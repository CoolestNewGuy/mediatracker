import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertMediaItem } from "@shared/schema";

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Primary media types (main focus)
const primaryMediaTypes = ['Movies', 'TV Shows', 'Anime', 'Books'];

// Additional/Extended media types  
const additionalMediaTypes = ['Novels', 'Manhwa', 'Manhua', 'Pornhwa'];

const allMediaTypes = [...primaryMediaTypes, ...additionalMediaTypes];
const genres = [
  'Fantasy', 'Sci-Fi', 'Romance', 'Slice of Life', 'Action', 'Adventure',
  'Comedy', 'Drama', 'Horror', 'Mystery', 'Thriller', 'Psychological',
  'Sports', 'Supernatural', 'Historical'
];

export default function AddMediaModal({ isOpen, onClose }: AddMediaModalProps) {
  const [formData, setFormData] = useState<Partial<InsertMediaItem>>({
    title: '',
    type: '',
    status: '',
    genre: '',
    notes: '',
    season: 1,
    episode: 0,
    chapter: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addMediaMutation = useMutation({
    mutationFn: async (data: InsertMediaItem) => {
      const response = await apiRequest('POST', '/api/media', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Media added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add media. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      status: '',
      genre: '',
      notes: '',
      season: 1,
      episode: 0,
      chapter: 0,
    });
  };

  const getStatusOptions = (type: string) => {
    if (type === 'Movies') {
      return ['To Watch', 'Watched', 'Dropped'];
    } else if (type === 'Anime' || type === 'TV Shows') {
      return ['To Watch', 'Watching', 'Completed', 'On Hold', 'Dropped'];
    } else if (type === 'Books' || type === 'Manhwa' || type === 'Manhua' || type === 'Pornhwa' || type === 'Novels') {
      return ['To Read', 'Reading', 'Completed', 'On Hold', 'Dropped'];
    }
    return [];
  };

  const setQuickStatus = (statusType: 'planned' | 'progress' | 'completed') => {
    if (!formData.type) return;
    
    let status = '';
    if (statusType === 'planned') {
      status = formData.type === 'Movies' ? 'To Watch' : 
               ['Anime', 'TV Shows'].includes(formData.type) ? 'To Watch' : 'To Read';
    } else if (statusType === 'progress') {
      status = ['Anime', 'TV Shows'].includes(formData.type || '') ? 'Watching' : 'Reading';
    } else if (statusType === 'completed') {
      status = 'Completed';
    }
    
    setFormData(prev => ({ ...prev, status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.status) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Format progress
    let progress = '';
    if (formData.type === 'Anime' || formData.type === 'TV Shows') {
      if (formData.season && formData.episode) {
        progress = `S${formData.season}E${formData.episode}`;
      }
    } else if (['Books', 'Manhwa', 'Manhua', 'Pornhwa', 'Novels'].includes(formData.type || '')) {
      if (formData.chapter) {
        progress = `Ch${formData.chapter}`;
      }
    }

    const submitData: InsertMediaItem = {
      title: formData.title!,
      type: formData.type!,
      status: formData.status!,
      progress,
      season: formData.season,
      episode: formData.episode,
      chapter: formData.chapter,
      genre: formData.genre || null,
      notes: formData.notes || null,
      rating: null,
      dateCompleted: null,
      timeSpent: null,
      isArchived: false,
    };

    addMediaMutation.mutate(submitData);
  };

  const showProgressFields = formData.type && formData.type !== 'Movies';
  const showSeasonField = formData.type === 'Anime' || formData.type === 'TV Shows';
  const episodeLabel = ['Books', 'Manhwa', 'Manhua', 'Pornhwa', 'Novels'].includes(formData.type || '') ? 'Chapter' : 'Episode';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">➕ Add New Media</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Media Type */}
          <div>
            <Label htmlFor="type">Media Type*</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value, status: '' }))}>
              <SelectTrigger className="bg-surface-2 border-gray-600">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-gray-600">
                {primaryMediaTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
                {additionalMediaTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-surface-2 border-gray-600"
              placeholder="Enter media title"
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status*</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-surface-2 border-gray-600">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-gray-600">
                {getStatusOptions(formData.type || '').map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Quick Status Buttons */}
            {formData.type && (
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickStatus('planned')}
                  className="flex-1 bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30"
                >
                  Plan to {formData.type === 'Movies' || formData.type === 'Anime' || formData.type === 'TV Shows' ? 'Watch' : 'Read'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickStatus('progress')}
                  className="flex-1 bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                >
                  In Progress
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickStatus('completed')}
                  className="flex-1 bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                >
                  Completed
                </Button>
              </div>
            )}
          </div>

          {/* Progress Fields */}
          {showProgressFields && (
            <div className="space-y-4">
              {showSeasonField && (
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Input
                    id="season"
                    type="number"
                    min="1"
                    value={formData.season || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, season: parseInt(e.target.value) || 1 }))}
                    className="bg-surface-2 border-gray-600"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="episode">{episodeLabel}</Label>
                <Input
                  id="episode"
                  type="number"
                  min="0"
                  value={showSeasonField ? (formData.episode || '') : (formData.chapter || '')}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (showSeasonField) {
                      setFormData(prev => ({ ...prev, episode: value }));
                    } else {
                      setFormData(prev => ({ ...prev, chapter: value }));
                    }
                  }}
                  className="bg-surface-2 border-gray-600"
                />
              </div>
            </div>
          )}

          {/* Genre */}
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Select value={formData.genre || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
              <SelectTrigger className="bg-surface-2 border-gray-600">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-gray-600">
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-surface-2 border-gray-600"
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 bg-gray-600 hover:bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addMediaMutation.isPending}
              className="flex-1 bg-primary-red hover:bg-primary-red/90"
            >
              {addMediaMutation.isPending ? 'Adding...' : 'Add Media'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
