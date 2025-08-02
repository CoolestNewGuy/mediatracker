import { Trophy, Flame } from "lucide-react";
import type { Achievement } from "@shared/schema";

interface AchievementWidgetProps {
  achievements?: Achievement[];
  isLoading?: boolean;
}

const getAchievementIcon = (type: string) => {
  switch (type) {
    case 'collector_10':
    case 'collector_50':
    case 'collector_100': return Trophy;
    case 'completed_10':
    case 'completed_50': return Trophy;
    case 'week_streak': return Flame;
    default: return Trophy;
  }
};

const getAchievementColor = (type: string) => {
  switch (type) {
    case 'collector_10': return 'bg-bronze-500/20 text-bronze-400';
    case 'collector_50': return 'bg-silver-500/20 text-silver-400';
    case 'collector_100': return 'bg-yellow-500/20 text-yellow-400';
    case 'week_streak': return 'bg-blue-500/20 text-blue-400';
    default: return 'bg-yellow-500/20 text-yellow-400';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

export default function AchievementWidget({ achievements = [], isLoading }: AchievementWidgetProps) {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">🏆 Achievements</h3>
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentAchievements = achievements.slice(0, 3);

  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">🏆 Achievements</h3>
        <a href="#" className="text-primary-red hover:text-accent text-sm">View All</a>
      </div>
      
      <div className="space-y-3">
        {recentAchievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No achievements yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start adding and completing media to unlock achievements!
            </p>
          </div>
        ) : (
          recentAchievements.map((achievement) => {
            const Icon = getAchievementIcon(achievement.type);
            return (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-surface-2 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAchievementColor(achievement.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{achievement.title}</p>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {achievement.unlockedAt ? formatDate(achievement.unlockedAt.toString()) : 'Recently'}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
