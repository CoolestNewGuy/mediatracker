import { useState, useEffect } from "react";
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
import MediaSearch from "@/components/MediaSearch";
import GenreSelector from "@/components/GenreSelector";
import type { InsertMediaItem } from "@shared/schema";

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Media types based on your Google Sheets specifications
const mediaTypes = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'];
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
    imageUrl: '',
    description: '',
    externalId: '',
    releaseYear: undefined,
  });
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);

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
      imageUrl: '',
      description: '',
      externalId: '',
      releaseYear: undefined,
    });
    setSelectedGenres([]);
  };

  const handleSearchResult = (result: any) => {
    setFormData(prev => ({
      ...prev,
      title: result.title,
      imageUrl: result.imageUrl || '',
      description: result.description || '',
      externalId: result.externalId || '',
      releaseYear: result.releaseYear || undefined,
    }));
    
    if (result.genres && result.genres.length > 0) {
      setSelectedGenres(result.genres);
    }
    
    setIsSearchOpen(false);
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

    const submitData: InsertMediaItem = {
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

    addMediaMutation.mutate(submitData);
  };

  const showProgressFields = formData.type && formData.type !== 'Movies';
  const showSeasonField = formData.type === 'Anime' || formData.type === 'TV Shows';
  const episodeLabel = ['Manhwa', 'Pornhwa', 'Novels'].includes(formData.type || '') ? 'Chapter' : 'Episode';

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
              {formData.type && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-[#7A1927] hover:bg-[#9d2332] border-[#7A1927] text-white"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>
            {formData.type && (
              <p className="text-xs text-gray-400 mt-1">
                Click the search button to find {formData.type.toLowerCase()} from external databases
              </p>
            )}
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
                  : 'Select genres...'
                }
              </Button>
              
              {selectedGenres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedGenres.map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="secondary" 
                      className="bg-[#7A1927] text-white"
                    >
                      {genre}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => {
                          const newGenres = selectedGenres.filter(g => g !== genre);
                          setSelectedGenres(newGenres);
                          setFormData(prev => ({ ...prev, genre: newGenres.join(', ') }));
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description (from search) */}
          {formData.description && (
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-surface-2 border-gray-600"
                rows={3}
                placeholder="Media description..."
              />
            </div>
          )}

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
        
        {/* Search Modal */}
        <MediaSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          mediaType={formData.type || ''}
          onSelect={handleSearchResult}
        />
        
        {/* Genre Selection Modal */}
        <GenreSelector
          isOpen={isGenreModalOpen}
          onClose={() => setIsGenreModalOpen(false)}
          selectedGenres={selectedGenres}
          onGenresChange={handleGenresChange}
        />
      </DialogContent>
    </Dialog>
  );
}
