import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Book, Tv, Play, Star, Users, Target } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-accent-foreground bg-clip-text text-transparent">
            Media Tracker
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track your entertainment journey across movies, TV shows, anime, books, and more. 
            Stay organized and discover your next favorite media.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Film className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Multiple Media Types</CardTitle>
              <CardDescription>
                Track movies, TV shows, anime, books, manga, novels, manhwa, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your progress through episodes, chapters, and completion status
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Ratings & Reviews</CardTitle>
              <CardDescription>
                Rate and review your completed media with personal notes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Achievement System</CardTitle>
              <CardDescription>
                Unlock achievements and track your entertainment milestones
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Smart Organization</CardTitle>
              <CardDescription>
                Browse your collection with filters, search, and categorization
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Future Integration</CardTitle>
              <CardDescription>
                Planned integration with streaming services and reading platforms
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Categories Preview */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Supported Media Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
              <Film className="w-8 h-8 text-accent mb-2" />
              <span className="font-medium">Movies</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
              <Tv className="w-8 h-8 text-accent mb-2" />
              <span className="font-medium">TV Shows</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
              <Play className="w-8 h-8 text-accent mb-2" />
              <span className="font-medium">Anime</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
              <Book className="w-8 h-8 text-accent mb-2" />
              <span className="font-medium">Books/Manga</span>
            </div>
          </div>
          <p className="text-muted-foreground mt-4">
            Plus novels, manhwa, manhua, pornhwa, and more expandable categories
          </p>
        </div>
      </div>
    </div>
  );
}