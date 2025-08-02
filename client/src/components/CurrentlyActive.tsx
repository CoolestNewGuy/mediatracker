import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MediaItem } from "@shared/schema";

interface CurrentlyActiveProps {
  items?: MediaItem[];
  isLoading?: boolean;
  onQuickUpdate: () => void;
}

export default function CurrentlyActive({ items = [], isLoading, onQuickUpdate }: CurrentlyActiveProps) {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Currently Active</h3>
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-gray-600 rounded-lg p-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="h-2 bg-gray-700 rounded w-full"></div>
                <div className="h-8 bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate progress percentage (dummy calculation for demo)
  const getProgressPercentage = (item: MediaItem) => {
    if (item.type === 'Anime' || item.type === 'TV Shows') {
      // Assume 24 episodes per season for calculation
      const totalEpisodes = (item.season || 1) * 24;
      const currentEpisode = item.episode || 0;
      return Math.min(Math.round((currentEpisode / totalEpisodes) * 100), 100);
    } else {
      // For manga/novels, assume arbitrary total for demo
      const currentChapter = item.chapter || 0;
      const estimatedTotal = Math.max(currentChapter * 1.5, 100); // Rough estimate
      return Math.min(Math.round((currentChapter / estimatedTotal) * 100), 90);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Currently Active</h3>
        <Button 
          onClick={onQuickUpdate}
          variant="ghost" 
          size="sm"
          className="text-primary-red hover:text-accent"
        >
          <Plus className="w-4 h-4 mr-1" /> Quick Update
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No items in progress</p>
            <p className="text-sm text-gray-500 mt-2">
              Start watching or reading something to see it here!
            </p>
          </div>
        ) : (
          items.slice(0, 3).map((item) => {
            const progressPercent = getProgressPercentage(item);
            return (
              <div key={item.id} className="border border-gray-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.type}</p>
                  </div>
                  <span className="text-xs text-green-400">
                    {item.progress || 'No progress'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="progress-bar h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-primary-red hover:bg-primary-red/90 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    +1 {item.type === 'Anime' || item.type === 'TV Shows' ? 'Episode' : 'Chapter'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-surface-2 hover:bg-surface-3 border-gray-600 text-xs"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
