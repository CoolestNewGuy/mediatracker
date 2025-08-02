import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Plus, ArrowRight } from "lucide-react";
import Fuse from "fuse.js";
import type { MediaItem } from "@shared/schema";

interface QuickProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickProgressModal({ isOpen, onClose }: QuickProgressModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [progressValue, setProgressValue] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaItems } = useQuery<MediaItem[]>({
    queryKey: ['/api/media'],
  });

  // Initialize Fuse for fuzzy search
  const fuse = React.useMemo(() => {
    if (!mediaItems) return null;
    return new Fuse(mediaItems, {
      keys: ['title', 'type'],
      threshold: 0.3,
      includeScore: true
    });
  }, [mediaItems]);

  // Search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || !fuse) return [];
    return fuse.search(searchQuery).slice(0, 8);
  }, [searchQuery, fuse]);

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: string }) => {
      const response = await apiRequest('PATCH', `/api/media/${id}`, { progress });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress Updated",
        description: "Media progress updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent'] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSearchQuery("");
    setSelectedItem(null);
    setProgressValue("");
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleQuickCommand = (input: string) => {
    // Parse commands like "aot 5" or "+3"
    const trimmed = input.trim();
    
    if (trimmed.startsWith('+')) {
      // Relative increment: +3
      const increment = parseInt(trimmed.substring(1));
      if (selectedItem && !isNaN(increment)) {
        const currentProgress = selectedItem.progress || "";
        const currentNum = extractNumberFromProgress(currentProgress);
        const newProgress = formatProgress(selectedItem, currentNum + increment);
        updateProgressMutation.mutate({ id: selectedItem.id, progress: newProgress });
        return true;
      }
    } else {
      // Direct update: "aot 5" or just "5"
      const parts = trimmed.split(' ');
      if (parts.length >= 2) {
        // Format: "title number"
        const query = parts.slice(0, -1).join(' ');
        const number = parseInt(parts[parts.length - 1]);
        
        if (!isNaN(number) && fuse) {
          const results = fuse.search(query);
          if (results.length > 0) {
            const item = results[0].item;
            const newProgress = formatProgress(item, number);
            updateProgressMutation.mutate({ id: item.id, progress: newProgress });
            return true;
          }
        }
      } else if (selectedItem && !isNaN(parseInt(trimmed))) {
        // Just a number with selected item
        const number = parseInt(trimmed);
        const newProgress = formatProgress(selectedItem, number);
        updateProgressMutation.mutate({ id: selectedItem.id, progress: newProgress });
        return true;
      }
    }
    return false;
  };

  const extractNumberFromProgress = (progress: string): number => {
    const match = progress.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const formatProgress = (item: MediaItem, number: number): string => {
    if (item.type === 'Anime' || item.type === 'TV Shows') {
      const season = item.season || 1;
      return `S${season}E${number}`;
    } else {
      return `Ch${number}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItem && progressValue) {
      if (!handleQuickCommand(progressValue)) {
        const newProgress = formatProgress(selectedItem, parseInt(progressValue) || 0);
        updateProgressMutation.mutate({ id: selectedItem.id, progress: newProgress });
      }
    } else if (searchQuery) {
      handleQuickCommand(searchQuery);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Watched':
      case 'Read':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'To Watch':
      case 'To Read':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">⚡ Quick Progress Update</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-surface-2 rounded-lg p-4 text-sm text-gray-400">
            <p className="mb-2">Quick commands:</p>
            <ul className="space-y-1 text-xs">
              <li>• Type "attack on titan 5" to set episode 5</li>
              <li>• Type "+3" to add 3 to current progress</li>
              <li>• Or search and select, then enter number</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Quick command or search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-2 border-gray-600"
                autoFocus
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {searchResults.map((result) => (
                  <div
                    key={result.item.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedItem?.id === result.item.id 
                        ? 'bg-[#7A1927] border border-[#9d2332]' 
                        : 'bg-surface-2 hover:bg-surface-1'
                    }`}
                    onClick={() => setSelectedItem(result.item)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{result.item.title}</p>
                        <p className="text-xs text-gray-400">{result.item.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(result.item.status)}`}>
                          {result.item.status}
                        </Badge>
                        {result.item.progress && (
                          <Badge variant="secondary" className="text-xs">
                            {result.item.progress}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Item Progress Input */}
            {selectedItem && (
              <div className="bg-surface-2 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-medium">{selectedItem.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder={
                      selectedItem.type === 'Anime' || selectedItem.type === 'TV Shows' 
                        ? "Episode number" 
                        : "Chapter number"
                    }
                    value={progressValue}
                    onChange={(e) => setProgressValue(e.target.value)}
                    className="bg-surface border-gray-600"
                    type="number"
                    min="0"
                  />
                  <Button 
                    type="submit" 
                    disabled={updateProgressMutation.isPending}
                    className="bg-[#7A1927] hover:bg-[#9d2332]"
                  >
                    {updateProgressMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {!selectedItem && (
              <Button 
                type="submit" 
                disabled={!searchQuery.trim() || updateProgressMutation.isPending}
                className="w-full bg-[#7A1927] hover:bg-[#9d2332]"
              >
                {updateProgressMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  'Execute Command'
                )}
              </Button>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}