import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import AddMediaModal from "@/components/AddMediaModal";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Calendar, BookOpen, Play, Coins } from "lucide-react";
import type { MediaStats, Achievement } from "@/lib/types";

export default function Achievements() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: stats } = useQuery<MediaStats>({
    queryKey: ['/api/stats'],
  });

  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const achievementCategories = [
    {
      title: "Collection Milestones",
      icon: Trophy,
      achievements: achievements.filter(a => a.category === 'collection'),
      color: "bg-yellow-500"
    },
    {
      title: "Completion Goals",
      icon: Target,
      achievements: achievements.filter(a => a.category === 'completion'),
      color: "bg-green-500"
    },
    {
      title: "Reading Progress",
      icon: BookOpen,
      achievements: achievements.filter(a => a.category === 'reading'),
      color: "bg-blue-500"
    },
    {
      title: "Watching Progress",
      icon: Play,
      achievements: achievements.filter(a => a.category === 'watching'),
      color: "bg-purple-500"
    },
    {
      title: "Consistency",
      icon: Calendar,
      achievements: achievements.filter(a => a.category === 'consistency'),
      color: "bg-orange-500"
    }
  ];

  // Mock upcoming achievements based on current stats
  const upcomingAchievements = [
    {
      title: "First Steps",
      description: "Add your first 5 media items",
      progress: Math.min(((stats?.total || 0) / 5) * 100, 100),
      target: 5,
      current: stats?.total || 0,
      icon: Star,
      unlocked: (stats?.total || 0) >= 5
    },
    {
      title: "Dedicated Viewer",
      description: "Complete 10 anime series",
      progress: Math.min(((stats?.byType?.Anime?.completed || 0) / 10) * 100, 100),
      target: 10,
      current: stats?.byType?.Anime?.completed || 0,
      icon: Play,
      unlocked: (stats?.byType?.Anime?.completed || 0) >= 10
    },
    {
      title: "Bookworm",
      description: "Read 25 manhwa/novels",
      progress: Math.min((((stats?.byType?.Manhwa?.completed || 0) + (stats?.byType?.Novels?.completed || 0)) / 25) * 100, 100),
      target: 25,
      current: (stats?.byType?.Manhwa?.completed || 0) + (stats?.byType?.Novels?.completed || 0),
      icon: BookOpen,
      unlocked: ((stats?.byType?.Manhwa?.completed || 0) + (stats?.byType?.Novels?.completed || 0)) >= 25
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar 
          stats={stats}
          onAddMedia={() => setIsAddModalOpen(true)}
          onQuickUpdate={() => {}}
          onViewCatalog={() => {}}
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <HeaderBar onAddMedia={() => setIsAddModalOpen(true)} />
          
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading achievements...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        stats={stats}
        onAddMedia={() => setIsAddModalOpen(true)}
        onQuickUpdate={() => {}}
        onViewCatalog={() => {}}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <HeaderBar onAddMedia={() => setIsAddModalOpen(true)} />
        
        <main className="flex-1 p-6">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Achievements</h1>
                <p className="text-gray-400 mt-1">
                  Track your progress and unlock rewards
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-[#7A1927]">
                  {achievements.filter(a => a.unlockedAt).length}
                </div>
                <div className="text-sm text-gray-400">Unlocked</div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="bg-surface-2 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-[#7A1927]' : 'bg-gray-600'}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                        {achievement.unlocked ? "Unlocked" : "In Progress"}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.current}/{achievement.target}</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Achievement Categories */}
            {achievementCategories.map((category) => {
              const Icon = category.icon;
              
              if (category.achievements.length === 0) {
                return (
                  <div key={category.title} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold">{category.title}</h2>
                    </div>
                    
                    <div className="bg-surface-2 rounded-lg p-8 border border-gray-700 text-center">
                      <div className="text-4xl mb-2">🏆</div>
                      <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                      <p className="text-gray-400">
                        Start adding and tracking media to unlock achievements in this category.
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={category.title} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                    <Badge variant="secondary">{category.achievements.length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.achievements.map((achievement) => (
                      <div key={achievement.id} className="bg-surface-2 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <Trophy className="w-4 h-4 text-white" />
                          </div>
                          <Badge variant={achievement.unlockedAt ? "default" : "secondary"}>
                            {achievement.unlockedAt ? "Unlocked" : "Locked"}
                          </Badge>
                        </div>
                        
                        <h3 className="font-medium mb-1">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                        
                        {achievement.unlockedAt && (
                          <div className="text-xs text-gray-500">
                            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Leaderboards Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Leaderboards
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Points Leaderboard */}
                <div className="bg-surface-2 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    Top Points Earners
                  </h3>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: "AnimeMaster", points: 15420, avatar: "🎯" },
                      { rank: 2, name: "You", points: (stats?.total || 0) * 10, avatar: "👤", isUser: true },
                      { rank: 3, name: "BookWorm88", points: 12100, avatar: "📚" },
                      { rank: 4, name: "CinemaLover", points: 10500, avatar: "🎬" },
                      { rank: 5, name: "MangaReader", points: 8920, avatar: "📖" }
                    ].map((user) => (
                      <div key={user.rank} className={`flex items-center gap-3 p-3 rounded-lg ${user.isUser ? 'bg-purple-900/20 border border-purple-700' : ''}`}>
                        <div className={`font-bold text-lg ${user.rank <= 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                          #{user.rank}
                        </div>
                        <div className="text-2xl">{user.avatar}</div>
                        <div className="flex-1">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.points.toLocaleString()} points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievement Leaderboard */}
                <div className="bg-surface-2 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    Most Achievements
                  </h3>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: "AchievementHunter", achievements: 47, avatar: "🏆" },
                      { rank: 2, name: "CompletionistPro", achievements: 42, avatar: "✅" },
                      { rank: 3, name: "You", achievements: achievements.filter(a => a.unlockedAt).length, avatar: "👤", isUser: true },
                      { rank: 4, name: "MediaExplorer", achievements: 35, avatar: "🔍" },
                      { rank: 5, name: "SeriesBinger", achievements: 31, avatar: "📺" }
                    ].map((user) => (
                      <div key={user.rank} className={`flex items-center gap-3 p-3 rounded-lg ${user.isUser ? 'bg-purple-900/20 border border-purple-700' : ''}`}>
                        <div className={`font-bold text-lg ${user.rank <= 3 ? 'text-purple-500' : 'text-gray-400'}`}>
                          #{user.rank}
                        </div>
                        <div className="text-2xl">{user.avatar}</div>
                        <div className="flex-1">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.achievements} achievements</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {achievements.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
                <p className="text-gray-400 mb-6">
                  Add some media to your library to start unlocking achievements!
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg"
                >
                  Add Your First Media
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}