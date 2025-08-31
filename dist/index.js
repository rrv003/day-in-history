// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
function getCurrentDate() {
  const now = /* @__PURE__ */ new Date();
  return {
    month: now.getMonth() + 1,
    day: now.getDate(),
    year: now.getFullYear()
  };
}
var factCache = /* @__PURE__ */ new Map();
var usedFacts = /* @__PURE__ */ new Set();
var CACHE_DURATION = 60 * 60 * 1e3;
var lastResetDate = (/* @__PURE__ */ new Date()).toDateString();
function resetDailyCache() {
  const today = (/* @__PURE__ */ new Date()).toDateString();
  if (today !== lastResetDate) {
    usedFacts.clear();
    factCache.clear();
    lastResetDate = today;
    console.log("\u{1F504} Daily cache reset - fresh facts available");
  }
}
var fallbackFacts = [
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
async function getFactFromHuggingFace(month, day, attemptNumber = 1) {
  const maxAttempts = 2;
  try {
    const prompt = `On ${month}/${day}, an important event in Indian history occurred. Tell me about a significant Indian historical event, scientific achievement, sports victory, or famous personality birth on this date.`;
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
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
        console.log("\u{1F504} AI model is loading, using fallback facts...");
        throw new Error("Model loading");
      }
      console.log(`\u274C API error ${response.status}, using fallback facts...`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    let fact = "";
    if (Array.isArray(result) && result[0]?.generated_text) {
      fact = result[0].generated_text.trim();
    } else if (result.generated_text) {
      fact = result.generated_text.trim();
    }
    if (fact && fact.length > 20) {
      fact = fact.replace(prompt, "").trim();
      fact = fact.replace(/^[:\-\s]+/, "").trim();
      const factKey = fact.toLowerCase().substring(0, 40);
      if (usedFacts.has(factKey) && attemptNumber < maxAttempts) {
        console.log(`\u{1F504} Duplicate fact detected, retrying...`);
        return await getFactFromHuggingFace(month, day, attemptNumber + 1);
      }
      usedFacts.add(factKey);
      console.log("\u2705 Successfully generated AI fact");
      return fact;
    }
    throw new Error("No valid fact generated");
  } catch (error) {
    console.error("Hugging Face API error:", error);
    if (attemptNumber < maxAttempts) {
      console.log(`\u{1F504} Retrying AI generation (attempt ${attemptNumber + 1})...`);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return await getFactFromHuggingFace(month, day, attemptNumber + 1);
    }
    console.log("\u{1F4DA} Using fallback historical facts...");
    const now = /* @__PURE__ */ new Date();
    const randomIndex = (month + day + now.getMinutes()) % fallbackFacts.length;
    return fallbackFacts[randomIndex];
  }
}
async function getHistoricalFact(month, day) {
  resetDailyCache();
  const dateKey = `${month}-${day}`;
  const requestId = `${dateKey}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  try {
    console.log(`\u{1F916} Generating fresh AI fact for ${month}/${day}...`);
    const fact = await getFactFromHuggingFace(month, day);
    factCache.set(requestId, {
      fact,
      timestamp: Date.now()
    });
    console.log(`\u2705 Generated unique fact for ${month}/${day}`);
    return fact;
  } catch (error) {
    console.error("Error fetching fact from AI:", error);
    throw new Error("AI service temporarily unavailable. Please refresh to try again.");
  }
}
async function registerRoutes(app2) {
  app2.get("/api/today", async (req, res) => {
    const { month, day } = getCurrentDate();
    try {
      const fact = await getHistoricalFact(month, day);
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      res.json({
        date: today,
        fact,
        source: "Live AI Generated",
        generated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      res.status(503).json({
        error: "AI service temporarily unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
        retry: true
      });
    }
  });
  app2.get("/api/date/:month/:day", async (req, res) => {
    const month = parseInt(req.params.month);
    const day = parseInt(req.params.day);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return res.status(400).json({
        error: "Invalid date format. Use /api/date/MM/DD"
      });
    }
    try {
      const fact = await getHistoricalFact(month, day);
      res.json({
        date: `${month}/${day}`,
        fact,
        source: "Live AI Generated",
        generated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      res.status(503).json({
        error: "AI service temporarily unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
        retry: true
      });
    }
  });
  app2.post("/api/clear-cache", (req, res) => {
    factCache.clear();
    usedFacts.clear();
    res.json({ message: "Cache cleared successfully" });
  });
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      cacheSize: factCache.size,
      usedFactsCount: usedFacts.size
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
