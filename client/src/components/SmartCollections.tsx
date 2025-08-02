import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  TrendingDown, 
  Zap, 
  Sparkles,
  ChevronRight,
  Play
} from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import type { MediaItem } from "@shared/schema";

interface SmartCollectionsProps {
  onOpenCatalog?: (filter?: string) => void;
}

export default function SmartCollections({ onOpenCatalog }: SmartCollectionsProps) {
  const { data: mediaItems } = useQuery<MediaItem[]>({
    queryKey: ['/api/media'],
  });

  const collections = React.useMemo(() => {
    if (!mediaItems) return { continueWatching: [], almostDone: [], droppingSoon: [], bingeReady: [] };

    const now = Date.now();
    const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);

    // Continue Watching - In Progress items sorted by last update
    const continueWatching = mediaItems
      .filter(item => item.status === 'In Progress' || item.status === 'Watching' || item.status === 'Reading')
      .sort((a, b) => new Date(b.updatedAt || b.dateAdded).getTime() - new Date(a.updatedAt || a.dateAdded).getTime())
      .slice(0, 6);

    // Almost Done - >80% complete
    const almostDone = mediaItems
      .filter(item => {
        if (!item.progress) return false;
        const current = parseInt(item.progress.match(/\d+/)?.[0] || '0');
        const total = item.totalEpisodes || item.totalChapters || 0;
        return total > 0 && (current / total) >= 0.8 && item.status !== 'Completed';
      })
      .slice(0, 4);

    // Dropping Soon - No activity for 14+ days
    const droppingSoon = mediaItems
      .filter(item => {
        if (item.status !== 'In Progress' && item.status !== 'Watching' && item.status !== 'Reading') return false;
        const lastUpdate = new Date(item.updatedAt || item.dateAdded).getTime();
        return lastUpdate < twoWeeksAgo;
      })
      .slice(0, 4);

    // Binge Ready - Completed seasons/series in "To Watch" or "To Read"
    const bingeReady = mediaItems
      .filter(item => 
        (item.status === 'To Watch' || item.status === 'To Read') && 
        (item.totalEpisodes || item.totalChapters)
      )
      .slice(0, 4);

    return { continueWatching, almostDone, droppingSoon, bingeReady };
  }, [mediaItems]);

  const getProgressPercentage = (item: MediaItem) => {
    const current = parseInt(item.progress?.match(/\d+/)?.[0] || '0');
    const total = item.totalEpisodes || item.totalChapters || 0;
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  const getDaysSinceUpdate = (item: MediaItem) => {
    const lastUpdate = new Date(item.updatedAt || item.dateAdded).getTime();
    const now = Date.now();
    return Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Continue Watching */}
      {collections.continueWatching.length > 0 && (
        <Card className="bg-surface border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-400" />
                Continue Watching
              </CardTitle>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onOpenCatalog?.('in-progress')}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {collections.continueWatching.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full"
                      fallback={
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Play className="w-8 h-8 text-gray-500" />
                        </div>
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${getProgressPercentage(item)}%` }}
                          />
                        </div>
                        <p className="text-xs text-white">{item.progress}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Almost Done */}
        {collections.almostDone.length > 0 && (
          <Card className="bg-surface border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Almost Done
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {collections.almostDone.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <OptimizedImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-10 h-14 rounded"
                    width={40}
                    height={56}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-500 h-1.5 rounded-full"
                          style={{ width: `${getProgressPercentage(item)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{getProgressPercentage(item)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Dropping Soon */}
        {collections.droppingSoon.length > 0 && (
          <Card className="bg-surface border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                Dropping Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {collections.droppingSoon.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <OptimizedImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-10 h-14 rounded"
                    width={40}
                    height={56}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-red-400">
                      {getDaysSinceUpdate(item)} days inactive
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Binge Ready */}
        {collections.bingeReady.length > 0 && (
          <Card className="bg-surface border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Binge Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {collections.bingeReady.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <OptimizedImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-10 h-14 rounded"
                    width={40}
                    height={56}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      {item.totalEpisodes || item.totalChapters} {item.totalEpisodes ? 'episodes' : 'chapters'}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}