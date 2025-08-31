import { Card } from "@/components/ui/card";
import { Flag, Atom, Trophy, Star } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  hoverGradient: string;
  iconBg: string;
  iconHoverBg: string;
  textColor: string;
  hoverTextColor: string;
}

const categories: Category[] = [
  {
    id: "independence",
    name: "Independence",
    icon: Flag,
    gradient: "from-primary/5 to-primary/10",
    hoverGradient: "hover:from-primary/10 hover:to-primary/20",
    iconBg: "bg-primary/20",
    iconHoverBg: "group-hover:bg-primary/30",
    textColor: "text-card-foreground",
    hoverTextColor: "group-hover:text-primary"
  },
  {
    id: "science",
    name: "Science",
    icon: Atom,
    gradient: "from-secondary/5 to-secondary/10",
    hoverGradient: "hover:from-secondary/10 hover:to-secondary/20",
    iconBg: "bg-secondary/20",
    iconHoverBg: "group-hover:bg-secondary/30",
    textColor: "text-card-foreground",
    hoverTextColor: "group-hover:text-secondary"
  },
  {
    id: "sports",
    name: "Sports",
    icon: Trophy,
    gradient: "from-accent/5 to-accent/10",
    hoverGradient: "hover:from-accent/10 hover:to-accent/20",
    iconBg: "bg-accent/20",
    iconHoverBg: "group-hover:bg-accent/30",
    textColor: "text-card-foreground",
    hoverTextColor: "group-hover:text-accent-foreground"
  },
  {
    id: "celebrities",
    name: "Celebrities",
    icon: Star,
    gradient: "from-primary/5 to-accent/5",
    hoverGradient: "hover:from-primary/10 hover:to-accent/10",
    iconBg: "bg-gradient-to-br from-primary/20 to-accent/20",
    iconHoverBg: "group-hover:from-primary/30 group-hover:to-accent/30",
    textColor: "text-card-foreground",
    hoverTextColor: "group-hover:text-primary"
  }
];

export function CategoryExplorer() {
  const handleCategoryClick = (categoryId: string) => {
    console.log('Selected category:', categoryId);
    // TODO: Implement category-specific fact fetching
  };

  return (
    <Card className="shadow-lg p-6 mb-8" data-testid="card-category-explorer">
      <h3 className="text-xl font-semibold mb-6 decorative-font">Explore Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`group cursor-pointer bg-gradient-to-br ${category.gradient} ${category.hoverGradient} rounded-lg p-4 border border-border transition-all duration-200`}
              data-testid={`category-${category.id}`}
            >
              <div className="text-center">
                <div className={`w-10 h-10 ${category.iconBg} ${category.iconHoverBg} rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-200`}>
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <p className={`text-sm font-medium ${category.textColor} ${category.hoverTextColor} transition-colors duration-200`}>
                  {category.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
