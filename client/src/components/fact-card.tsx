import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Sparkles, Info, Clock, Zap, Share2, RefreshCw } from "lucide-react";

interface FactResponse {
  date: string;
  fact: string;
  source: string;
  generated_at: string;
}

export function FactCard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fact, isLoading, error, refetch } = useQuery<FactResponse>({
    queryKey: ["/api/today"],
    refetchOnMount: true,
    staleTime: 0,
    retry: 2
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/today"] });
      await refetch();
      toast({
        title: "New fact generated!",
        description: "A fresh historical fact has been loaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate new fact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleShare = async () => {
    if (!fact) return;

    const shareData = {
      title: 'This Day in Indian History',
      text: fact.fact,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        toast({
          title: "Copied to clipboard!",
          description: "The historical fact has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  };

  return (
    <Card className="shadow-lg overflow-hidden mb-8" data-testid="card-fact">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-card-foreground">Today's Historical Fact</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>AI Generated</span>
          </div>
        </div>
      </div>

      {/* Fact Content */}
      <div className="p-8" data-testid="fact-container">
        {(isLoading || isRefreshing) ? (
          <div className="animate-pulse" data-testid="loading-state">
            <div className="flex items-center mb-6">
              <LoadingSpinner className="mr-3" />
              <span className="text-muted-foreground font-medium">
                🤖 AI is researching Indian historical events and celebrity birthdays...
              </span>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded loading-shimmer"></div>
              <div className="h-4 bg-muted rounded w-3/4 loading-shimmer"></div>
              <div className="h-4 bg-muted rounded w-1/2 loading-shimmer"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8" data-testid="error-state">
            <p className="text-destructive mb-4">
              Failed to load historical fact. Please try refreshing.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : fact ? (
          <div className="space-y-6" data-testid="fact-content">
            <div className="fact-serif text-lg leading-relaxed text-card-foreground">
              {fact.fact}
            </div>

            {/* Fact Categories */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Indian History
              </span>
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                Historical Event
              </span>
              <span className="px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium">
                Today
              </span>
            </div>

            {/* Additional Information */}
            <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">About this fact:</p>
                  <p>Generated using AI trained on Indian historical records and cultural databases. Each fact is verified for accuracy and uniqueness.</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Card Footer */}
      {fact && (
        <div className="bg-muted/30 px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span data-testid="text-timestamp">
                  {formatTimestamp(fact.generated_at)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>Unique Daily Content</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleShare}
              data-testid="button-share-fact"
              className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
