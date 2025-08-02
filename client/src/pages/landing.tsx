import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Book, Tv, Play, Star, Users, Target, Zap, Search, Archive } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">📺</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-red-400 bg-clip-text text-transparent">
              Complete Media Tracker
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Your personal AI-powered entertainment assistant. Track anime, manhwa, novels, movies, TV shows, and more. 
            Get smart recommendations, unlock achievements, and organize your entire media library.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-12 py-6 bg-[#7A1927] hover:bg-[#9d2332] border-[#7A1927] hover:border-[#9d2332] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => window.location.href = '/api/login'}
          >
            Start Your Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-[#141414] border-gray-700 hover:border-[#7A1927] transition-all duration-300 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-[#7A1927]/20">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-[#7A1927]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7A1927]/30 transition-colors">
                <Film className="w-8 h-8 text-[#7A1927]" />
              </div>
              <CardTitle className="text-white text-xl">Multiple Media Types</CardTitle>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Track movies, TV shows, anime, books, manga, novels, manhwa, pornhwa, and more expandable categories
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#141414] border-gray-700 hover:border-[#7A1927] transition-all duration-300 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-[#7A1927]/20">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-[#7A1927]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7A1927]/30 transition-colors">
                <Target className="w-8 h-8 text-[#7A1927]" />
              </div>
              <CardTitle className="text-white text-xl">Progress Tracking</CardTitle>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Monitor your progress through episodes, chapters, and completion status with detailed analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#141414] border-gray-700 hover:border-[#7A1927] transition-all duration-300 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-[#7A1927]/20">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-[#7A1927]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7A1927]/30 transition-colors">
                <Star className="w-8 h-8 text-[#7A1927]" />
              </div>
              <CardTitle className="text-white text-xl">Ratings & Reviews</CardTitle>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Rate and review your completed media with personal notes and detailed feedback
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#141414] border-gray-700 hover:border-[#7A1927] transition-all duration-300 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-[#7A1927]/20">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-[#7A1927]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7A1927]/30 transition-colors">
                <Users className="w-8 h-8 text-[#7A1927]" />
              </div>
              <CardTitle className="text-white text-xl">Achievement System</CardTitle>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Unlock achievements and track your entertainment milestones and reading patterns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#141414] border-gray-700 hover:border-[#7A1927] transition-all duration-300 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-[#7A1927]/20">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-[#7A1927]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7A1927]/30 transition-colors">
                <Zap className="w-8 h-8 text-[#7A1927]" />
              </div>
              <CardTitle className="text-white text-xl">Smart Organization</CardTitle>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Browse your collection with filters, search, and categorization with auto-archiving
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#141414] border-gray-700 hover:border-[#7A1927] transition-all duration-300 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-[#7A1927]/20">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-[#7A1927]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7A1927]/30 transition-colors">
                <Archive className="w-8 h-8 text-[#7A1927]" />
              </div>
              <CardTitle className="text-white text-xl">Future Integration</CardTitle>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Planned integration with streaming services and reading platforms for seamless tracking
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Supported Media Categories */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Supported Media Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#141414] rounded-xl p-6 border border-gray-700 hover:border-[#7A1927] transition-all duration-300 group">
              <Film className="w-12 h-12 text-[#7A1927] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-lg">Movies</h3>
            </div>
            <div className="bg-[#141414] rounded-xl p-6 border border-gray-700 hover:border-[#7A1927] transition-all duration-300 group">
              <Tv className="w-12 h-12 text-[#7A1927] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-lg">TV Shows</h3>
            </div>
            <div className="bg-[#141414] rounded-xl p-6 border border-gray-700 hover:border-[#7A1927] transition-all duration-300 group">
              <Play className="w-12 h-12 text-[#7A1927] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-lg">Anime</h3>
            </div>
            <div className="bg-[#141414] rounded-xl p-6 border border-gray-700 hover:border-[#7A1927] transition-all duration-300 group">
              <Book className="w-12 h-12 text-[#7A1927] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-lg">Books/Manga</h3>
            </div>
          </div>
          <p className="text-gray-400 mt-6 text-lg max-w-3xl mx-auto">
            Plus novels, manhwa, manhwa, pornhwa, and more expandable categories
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#7A1927]/20 to-[#7A1927]/10 rounded-2xl p-12 border border-[#7A1927]/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Media Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands who have organized their entertainment with our intelligent tracking platform
            </p>
            <Button 
              size="lg" 
              className="text-xl px-16 py-8 bg-[#7A1927] hover:bg-[#9d2332] border-[#7A1927] hover:border-[#9d2332] text-white font-bold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}