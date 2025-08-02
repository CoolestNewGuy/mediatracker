import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Tags, X } from "lucide-react";
import type { InsertMediaItem, MediaItem } from "@shared/schema";

interface EditMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItem: MediaItem | null;
}

// Media types based on your Google Sheets specifications
const mediaTypes = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'];
const genres = [
  'Fantasy', 'Sci-Fi', 'Romance', 'Slice of Life', 'Action', 'Adventure',
  'Comedy', 'Drama', 'Horror', 'Mystery', 'Thriller', 'Psychological',
  'Sports', 'Supernatural', 'Historical'
];

export default function EditMediaModal({ isOpen, onClose, mediaItem }: EditMediaModalProps) {
  const [formData, setFormData] = useState<Partial<InsertMediaItem>>({
    title: '',
    type: '',
    status: '',
    genre: '',
    notes: '',
    season: 1,
    episode: 0,
    chapter: 0,
    imageUrl: '',
    description: '',
    externalId: '',
    releaseYear: undefined,
  });
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [autoSearchResults, setAutoSearchResults] = useState<any[]>([]);
  const [showAutoSearch, setShowAutoSearch] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Populate form with existing data when modal opens
  useEffect(() => {
    if (mediaItem && isOpen) {
      setFormData({
        title: mediaItem.title,
        type: mediaItem.type,
        status: mediaItem.status,
        genre: mediaItem.genre || '',
        notes: mediaItem.notes || '',
        season: mediaItem.season || 1,
        episode: mediaItem.episode || 0,
        chapter: mediaItem.chapter || 0,
        imageUrl: mediaItem.imageUrl || '',
        description: mediaItem.description || '',
        externalId: mediaItem.externalId || '',
        releaseYear: mediaItem.releaseYear || undefined,
      });
      
      // Set genres from existing data
      if (mediaItem.genre) {
        setSelectedGenres(mediaItem.genre.split(', ').filter(g => g.trim()));
      } else {
        setSelectedGenres([]);
      }
    }
  }, [mediaItem, isOpen]);

  // Auto-search when typing 3+ characters
  useEffect(() => {
    if (formData.title && formData.title.length >= 3 && formData.type) {
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search-external?query=${encodeURIComponent(formData.title!)}&type=${encodeURIComponent(formData.type!)}`);
          const results = await response.json();
          setAutoSearchResults(results);
          setShowAutoSearch(results.length > 0);
        } catch (error) {
          console.error('Auto-search error:', error);
          setShowAutoSearch(false);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setShowAutoSearch(false);
    }
  }, [formData.title, formData.type]);

  const updateMediaMutation = useMutation({
    mutationFn: async (data: Partial<InsertMediaItem>) => {
      const response = await apiRequest('PATCH', `/api/media/${mediaItem?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Media updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update media. Please try again.",
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
      imageUrl: '',
      description: '',
      externalId: '',
      releaseYear: undefined,
    });
    setSelectedGenres([]);
    setShowAutoSearch(false);
  };

  const handleGenresChange = (genres: string[]) => {
    setSelectedGenres(genres);
    setFormData(prev => ({
      ...prev,
      genre: genres.join(', ')
    }));
  };

  const getStatusOptions = (type: string) => {
    if (type === 'Movies') {
      return ['To Watch', 'Watched', 'Dropped'];
    } else if (type === 'Anime' || type === 'TV Shows') {
      return ['To Watch', 'In Progress', 'Watched', 'Dropped'];
    } else if (type === 'Manhwa' || type === 'Pornhwa' || type === 'Novels') {
      return ['To Read', 'In Progress', 'Read', 'Dropped'];
    }
    return [];
  };

  const setQuickStatus = (statusType: 'planned' | 'progress' | 'completed') => {
    if (!formData.type) return;
    
    let status = '';
    if (statusType === 'planned') {
      status = (['Movies', 'Anime', 'TV Shows'].includes(formData.type || '')) ? 'To Watch' : 'To Read';
    } else if (statusType === 'progress') {
      status = 'In Progress';
    } else if (statusType === 'completed') {
      status = (['Movies', 'Anime', 'TV Shows'].includes(formData.type || '')) ? 'Watched' : 'Read';
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
    } else if (['Manhwa', 'Pornhwa', 'Novels'].includes(formData.type || '')) {
      if (formData.chapter) {
        progress = `Ch${formData.chapter}`;
      }
    }

    const submitData: Partial<InsertMediaItem> = {
      title: formData.title!,
      type: formData.type!,
      status: formData.status!,
      progress,
      season: formData.season,
      episode: formData.episode,
      chapter: formData.chapter,
      genre: selectedGenres.length > 0 ? selectedGenres.join(', ') : null,
      notes: formData.notes || null,
      rating: null,
      dateCompleted: null,
      timeSpent: null,
      isArchived: false,
      imageUrl: formData.imageUrl || null,
      description: formData.description || null,
      externalId: formData.externalId || null,
      releaseYear: formData.releaseYear || null,
    };

    updateMediaMutation.mutate(submitData);
  };

  // Handle auto-search result selection
  const handleSearchResult = (result: any) => {
    setFormData(prev => ({
      ...prev,
      title: result.title,
      imageUrl: result.imageUrl || '',
      description: result.description || '',
      releaseYear: result.releaseYear || undefined,
      externalId: result.externalId || ''
    }));
    
    // Set first genre if available
    if (result.genres && result.genres.length > 0) {
      setSelectedGenres([result.genres[0]]);
    }
    
    setShowAutoSearch(false);
  };

  const showSeasonField = formData.type === 'Anime' || formData.type === 'TV Shows';
  const episodeLabel = ['Manhwa', 'Pornhwa', 'Novels'].includes(formData.type || '') ? 'Chapter' : 'Episode';

  if (!mediaItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">✏️ Edit Media</DialogTitle>
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
                {mediaTypes.map((type: string) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title with Search Button */}
          <div>
            <Label htmlFor="title">Title*</Label>
            <div className="flex space-x-2">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-surface-2 border-gray-600 flex-1"
                placeholder="Enter media title"
              />
            </div>
            
            {/* Auto Search Results */}
            {showAutoSearch && (
              <div className="bg-surface-2 border border-gray-600 rounded-md mt-2 max-h-40 overflow-y-auto">
                <div className="p-2 text-xs text-gray-400 border-b border-gray-600">
                  Auto-search results (click to fill):
                </div>
                {autoSearchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-surface-1 cursor-pointer border-b border-gray-700 last:border-b-0"
                    onClick={() => handleSearchResult(result)}
                  >
                    <div className="text-sm font-medium">{result.title}</div>
                    {result.releaseYear && (
                      <div className="text-xs text-gray-400">{result.releaseYear}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status - only show if type is selected */}
          {formData.type && (
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
            )}

          {/* Progress Fields - only show if status is selected and status is "In Progress" */}
          {formData.status === 'In Progress' && (
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

          {/* Genres (Multi-select) */}
          <div>
            <Label htmlFor="genre">Genres</Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGenreModalOpen(true)}
                className="w-full bg-surface-2 border-gray-600 justify-start text-left"
              >
                <Tags className="w-4 h-4 mr-2" />
                {selectedGenres.length > 0 
                  ? `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''} selected`
                  : 'Select genres'
                }
              </Button>
              
              {selectedGenres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedGenres.map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="secondary" 
                      className="text-xs bg-surface-1 text-gray-300"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => setSelectedGenres(prev => prev.filter(g => g !== genre))}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-surface-2 border-gray-600"
              placeholder="Add your thoughts, reviews, or notes..."
              rows={3}
            />
          </div>

          {/* Additional Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="bg-surface-2 border-gray-600"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-surface-2 border-gray-600"
                placeholder="Plot summary or description..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                type="number"
                min="1900"
                max="2030"
                value={formData.releaseYear || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, releaseYear: parseInt(e.target.value) || undefined }))}
                className="bg-surface-2 border-gray-600"
                placeholder="2023"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMediaMutation.isPending}
              className="bg-[#7A1927] hover:bg-[#9d2332]"
            >
              {updateMediaMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Media'
              )}
            </Button>
          </div>
        </form>

        {/* Genre Selection Modal */}
        <Dialog open={isGenreModalOpen} onOpenChange={setIsGenreModalOpen}>
          <DialogContent className="bg-surface border-gray-700 max-w-md">
            <DialogHeader>
              <DialogTitle>Select Genres</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  type="button"
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedGenres(prev => 
                      prev.includes(genre) 
                        ? prev.filter(g => g !== genre)
                        : [...prev, genre]
                    );
                  }}
                  className={`justify-start ${
                    selectedGenres.includes(genre) 
                      ? 'bg-[#7A1927] hover:bg-[#9d2332]' 
                      : 'bg-surface-2 border-gray-600'
                  }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedGenres([])}>
                Clear All
              </Button>
              <Button onClick={() => setIsGenreModalOpen(false)}>
                Done ({selectedGenres.length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}