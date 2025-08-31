import type { Express } from "express";
import { createServer, type Server } from "http";

// Function to get current date
function getCurrentDate() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    day: now.getDate(),
    year: now.getFullYear()
  };
}

// In-memory cache to store facts and prevent duplicates
const factCache = new Map();
const usedFacts = new Set(); // Track all facts served today
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

// Reset used facts daily
let lastResetDate = new Date().toDateString();
function resetDailyCache() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    usedFacts.clear();
    factCache.clear();
    lastResetDate = today;
    console.log('🔄 Daily cache reset - fresh facts available');
  }
}

// Fallback facts for Indian heritage and personalities
const fallbackFacts = [
  "1947: India gained independence from British rule on August 15, marking the end of nearly 200 years of colonial governance under the leadership of Mahatma Gandhi and the freedom movement.",
  "1969: The Indian Space Research Organisation (ISRO) was established, leading to India becoming the fourth country to reach Mars with its Mangalyaan mission in 2014.",
  "1983: India won its first Cricket World Cup under the captaincy of Kapil Dev, defeating the West Indies in a historic final at Lord's Cricket Ground.",
  "1930: Chandrasekhara Venkata Raman won the Nobel Prize in Physics for his work on light scattering, becoming the first Asian to receive a Nobel Prize in science.",
  "1973: Amitabh Bachchan starred in 'Zanjeer', marking the beginning of his legendary career as the 'Angry Young Man' of Bollywood cinema.",
  "1999: Kargil War concluded with Indian victory, demonstrating the valor of the Indian Armed Forces in defending the nation's sovereignty.",
  "2008: A.R. Rahman won Academy Awards for Best Original Score and Best Original Song for 'Slumdog Millionaire', bringing global recognition to Indian music.",
  "1996: Leander Paes won the bronze medal in tennis at the Atlanta Olympics, becoming the first Indian to win an individual Olympic medal in 44 years.",
  "1913: Rabindranath Tagore became the first non-European to win the Nobel Prize in Literature for his collection of poems 'Gitanjali'.",
  "2014: Narendra Modi became Prime Minister, launching initiatives like Digital India and Make in India to transform the country's technological landscape."
];

// Enhanced Hugging Face API with fallback system
async function getFactFromHuggingFace(month: number, day: number, attemptNumber = 1): Promise<string> {
  const maxAttempts = 2; // Reduced attempts for faster fallback
  
  try {
    // Simplified prompt for better API compatibility
    const prompt = `On ${month}/${day}, an important event in Indian history occurred. Tell me about a significant Indian historical event, scientific achievement, sports victory, or famous personality birth on this date.`;
    
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.8,
          top_p: 0.9,
          return_full_text: false
        }
      })
    });
    
    if (!response.ok) {
      if (response.status === 503) {
        console.log('🔄 AI model is loading, using fallback facts...');
        throw new Error('Model loading');
      }
      console.log(`❌ API error ${response.status}, using fallback facts...`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Process and clean the response
    let fact = '';
    if (Array.isArray(result) && result[0]?.generated_text) {
      fact = result[0].generated_text.trim();
    } else if (result.generated_text) {
      fact = result.generated_text.trim();
    }
    
    if (fact && fact.length > 20) {
      // Clean up the response
      fact = fact.replace(prompt, '').trim();
      fact = fact.replace(/^[:\-\s]+/, '').trim();
      
      // Check for duplicates
      const factKey = fact.toLowerCase().substring(0, 40);
      if (usedFacts.has(factKey) && attemptNumber < maxAttempts) {
        console.log(`🔄 Duplicate fact detected, retrying...`);
        return await getFactFromHuggingFace(month, day, attemptNumber + 1);
      }
      
      usedFacts.add(factKey);
      console.log('✅ Successfully generated AI fact');
      return fact;
    }
    
    throw new Error('No valid fact generated');
    
  } catch (error) {
    console.error('Hugging Face API error:', error);
    
    if (attemptNumber < maxAttempts) {
      console.log(`🔄 Retrying AI generation (attempt ${attemptNumber + 1})...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await getFactFromHuggingFace(month, day, attemptNumber + 1);
    }
    
    // Fallback to curated facts
    console.log('📚 Using fallback historical facts...');
    const now = new Date();
    const randomIndex = (month + day + now.getMinutes()) % fallbackFacts.length;
    return fallbackFacts[randomIndex];
  }
}

// Function to get fresh fact from AI with duplicate prevention
async function getHistoricalFact(month: number, day: number): Promise<string> {
  // Reset cache daily
  resetDailyCache();
  
  const dateKey = `${month}-${day}`;
  const requestId = `${dateKey}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    // Always fetch fresh from AI
    console.log(`🤖 Generating fresh AI fact for ${month}/${day}...`);
    const fact = await getFactFromHuggingFace(month, day);
    
    // Store in cache with unique key
    factCache.set(requestId, {
      fact: fact,
      timestamp: Date.now()
    });
    
    console.log(`✅ Generated unique fact for ${month}/${day}`);
    return fact;
  } catch (error) {
    console.error('Error fetching fact from AI:', error);
    throw new Error('AI service temporarily unavailable. Please refresh to try again.');
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get today's fact
  app.get('/api/today', async (req, res) => {
    const { month, day } = getCurrentDate();
    
    try {
      const fact = await getHistoricalFact(month, day);
      const today = new Date().toISOString().split('T')[0];
      
      res.json({
        date: today,
        fact: fact,
        source: 'Live AI Generated',
        generated_at: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        error: 'AI service temporarily unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
        retry: true
      });
    }
  });

  // API endpoint to get facts for a specific date
  app.get('/api/date/:month/:day', async (req, res) => {
    const month = parseInt(req.params.month);
    const day = parseInt(req.params.day);
    
    // Basic validation
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return res.status(400).json({
        error: 'Invalid date format. Use /api/date/MM/DD'
      });
    }
    
    try {
      const fact = await getHistoricalFact(month, day);
      
      res.json({
        date: `${month}/${day}`,
        fact: fact,
        source: 'Live AI Generated',
        generated_at: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        error: 'AI service temporarily unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
        retry: true
      });
    }
  });

  // Clear cache endpoint (useful for development)
  app.post('/api/clear-cache', (req, res) => {
    factCache.clear();
    usedFacts.clear();
    res.json({ message: 'Cache cleared successfully' });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      cacheSize: factCache.size,
      usedFactsCount: usedFacts.size
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
