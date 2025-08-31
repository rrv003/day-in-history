import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Calendar, Sun, Moon, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleRefreshFact = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/today"] });
      toast({
        title: "Refreshing...",
        description: "Getting a new historical fact for you.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh fact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm" data-testid="header">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center lotus-animation">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground decorative-font">
                This Day in History
              </h1>
              <p className="text-sm text-muted-foreground">
                🇮🇳 Indian Heritage & Personalities
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              data-testid="button-toggle-theme"
              className="p-2 rounded-lg bg-muted hover:bg-accent"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>
            <Button
              onClick={handleRefreshFact}
              data-testid="button-refresh-fact"
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Fact
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
