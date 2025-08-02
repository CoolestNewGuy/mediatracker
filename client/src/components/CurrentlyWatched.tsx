import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Clock, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MediaItem } from "@shared/schema";
import MediaContextMenu from "./MediaContextMenu";
import EditMediaModal from "./EditMediaModal";

export default function CurrentlyWatched() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: MediaItem } | null>(null);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: inProgressItems = [], isLoading, error } = useQuery<MediaItem[]>({
    queryKey: ['/api/media/in-progress'],
    queryFn: async () => {
      const response = await fetch('/api/media/in-progress');
      if (!response.ok) {
        throw new Error('Failed to fetch in-progress items');
      }
      return response.json();
    },
    retry: false
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent'] });
      toast({
        title: "Media Deleted",
        description: "The media item has been successfully deleted.",
      });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: string }) => {
      return await apiRequest('PATCH', `/api/media/${id}`, { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Progress Updated",
        description: "Your progress has been updated successfully.",
      });
    },
  });

  const handleContextMenu = (e: React.MouseEvent, item: MediaItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleEdit = () => {
    if (contextMenu) {
      setEditingItem(contextMenu.item);
      setIsEditModalOpen(true);
      setContextMenu(null);
    }
  };

  const handleDelete = () => {
    if (contextMenu) {
      if (window.confirm(`Are you sure you want to delete "${contextMenu.item.title}"?`)) {
        deleteMutation.mutate(contextMenu.item.id);
      }
      setContextMenu(null);
    }
  };

  const handleAddProgress = (type: 'episodes' | 'seasons' | 'chapters', amount: number) => {
    if (!contextMenu) return;
    
    const item = contextMenu.item;
    let newProgress = item.progress || '';
    
    if (type === 'episodes' || type === 'chapters') {
      const match = newProgress.match(/(\d+)/);
      const current = match ? parseInt(match[1]) : 0;
      const newValue = current + amount;
      
      if (type === 'episodes') {
        newProgress = item.totalEpisodes 
          ? `${newValue}/${item.totalEpisodes}` 
          : `Episode ${newValue}`;
      } else {
        newProgress = item.totalChapters
          ? `${newValue}/${item.totalChapters}`
          : `Chapter ${newValue}`;
      }
    } else if (type === 'seasons' && item.season) {
      const newSeason = item.season + amount;
      newProgress = `Season ${newSeason}`;
    }
    
    updateProgressMutation.mutate({ id: item.id, progress: newProgress });
  };

  const getProgressPercentage = (item: MediaItem) => {
    const current = parseInt(item.progress?.match(/\d+/)?.[0] || '0');
    const total = item.totalEpisodes || item.totalChapters || 0;
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <Card className="bg-surface border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-green-400" />
            Currently Watching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-surface border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-green-400" />
            Currently Watching
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-gray-400 text-center py-8">
              <div className="text-sm">No items in progress yet</div>
              <div className="text-xs mt-1 text-gray-500">Add some media and mark them as "In Progress" to see them here</div>
            </div>
          ) : inProgressItems.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <div className="text-sm">No items currently in progress</div>
              <div className="text-xs mt-1 text-gray-500">Start watching or reading something new!</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {inProgressItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group cursor-pointer"
                  onContextMenu={(e) => handleContextMenu(e, item)}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    
                    {/* Progress overlay */}
                    {item.progress && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                        <div className="text-xs text-white font-medium">{item.progress}</div>
                        {getProgressPercentage(item) > 0 && (
                          <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full transition-all"
                              style={{ width: `${getProgressPercentage(item)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Hover overlay with title */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                      <div className="text-white">
                        <div className="font-medium text-sm line-clamp-2">{item.title}</div>
                        <div className="text-xs text-gray-300 mt-1">{item.type}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {contextMenu && (
        <MediaContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddProgress={handleAddProgress}
          mediaType={contextMenu.item.type}
          currentProgress={contextMenu.item.progress || undefined}
        />
      )}

      <EditMediaModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditingItem(null);
          setIsEditModalOpen(false);
        }}
        mediaItem={editingItem || undefined}
      />
    </>
  );
}