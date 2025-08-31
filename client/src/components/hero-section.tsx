import { Card } from "@/components/ui/card";

interface HeroSectionProps {
  currentDate: string;
}

export function HeroSection({ currentDate }: HeroSectionProps) {
  return (
    <section className="hero-pattern py-16 bg-gradient-to-br from-background via-muted/50 to-background" data-testid="hero-section">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold decorative-font mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent" data-testid="text-current-date">
            {currentDate}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover fascinating moments from India's rich history, cultural heritage, and the remarkable personalities who shaped our nation.
          </p>
        </div>
        
        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/80 backdrop-blur-sm border border-border p-6 shadow-sm" data-testid="stat-categories">
            <div className="text-2xl font-bold text-primary mb-2">8+</div>
            <div className="text-sm text-muted-foreground">Fact Categories</div>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border border-border p-6 shadow-sm" data-testid="stat-facts">
            <div className="text-2xl font-bold text-secondary mb-2">365+</div>
            <div className="text-sm text-muted-foreground">Daily Facts</div>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border border-border p-6 shadow-sm" data-testid="stat-personalities">
            <div className="text-2xl font-bold text-accent mb-2">1000+</div>
            <div className="text-sm text-muted-foreground">Personalities</div>
          </Card>
        </div>
      </div>
    </section>
  );
}
