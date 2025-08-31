import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FactCard } from "@/components/fact-card";
import { CategoryExplorer } from "@/components/category-explorer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Flag, Atom, Trophy, Star, Twitter, Facebook } from "lucide-react";

export default function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection currentDate={currentDate} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <FactCard />
        <CategoryExplorer />
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-semibold text-card-foreground">Historical Calendar</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Explore historical events from any date in Indian history.
            </p>
            <Button 
              data-testid="button-browse-calendar"
              variant="outline" 
              className="w-full"
            >
              Browse Calendar
            </Button>
          </Card>

          <Card className="p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-secondary" />
              </div>
              <h4 className="font-semibold text-card-foreground">Personality Profiles</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Learn about influential figures in Indian history and culture.
            </p>
            <Button 
              data-testid="button-view-profiles"
              variant="outline" 
              className="w-full"
            >
              View Profiles
            </Button>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h5 className="font-semibold decorative-font">This Day in History</h5>
              </div>
              <p className="text-sm text-muted-foreground">
                Celebrating India's rich heritage through daily historical insights and memorable personalities.
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Categories</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Independence Movement</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Science & Innovation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Sports & Entertainment</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Arts & Literature</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">About</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">How it works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">AI Technology</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Data Sources</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                © 2025 This Day in History. Powered by AI technology.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Made with 🇮🇳 for India</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid="button-share-twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid="button-share-facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
