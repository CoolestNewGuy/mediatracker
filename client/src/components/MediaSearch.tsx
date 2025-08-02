import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MediaSearchResult {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  releaseYear?: number;
  genres?: string[];
  externalId: string;
}

interface MediaSearchProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: string;
  onSelect: (result: MediaSearchResult) => void;
}

export default function MediaSearch({ isOpen, onClose, mediaType, onSelect }: MediaSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/search-external?query=${encodeURIComponent(searchQuery)}&type=${mediaType}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getSearchPlaceholder = () => {
    switch (mediaType) {
      case 'Anime': return 'Search for anime titles...';
      case 'Movies': return 'Search for movies...';
      case 'TV Shows': return 'Search for TV shows...';
      case 'Manhwa': return 'Search for manhwa titles...';
      case 'Novels': return 'Search for light novels...';
      default: return 'Search for media...';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            🔍 Search {mediaType}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getSearchPlaceholder()}
              className="bg-surface-2 border-gray-600 flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-[#7A1927] hover:bg-[#9d2332]"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isSearching && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-400">Searching for {mediaType.toLowerCase()}...</p>
              </div>
            )}
            
            {!isSearching && hasSearched && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No results found for "{searchQuery}"</p>
                <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
              </div>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-surface-2 rounded-lg p-4 border border-gray-600 hover:border-gray-500 cursor-pointer transition-colors"
                    onClick={() => onSelect(result)}
                  >
                    <div className="flex space-x-3">
                      {result.imageUrl && (
                        <img
                          src={result.imageUrl}
                          alt={result.title}
                          className="w-16 h-24 object-cover rounded bg-gray-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{result.title}</h3>
                        {result.releaseYear && (
                          <p className="text-gray-400 text-sm">({result.releaseYear})</p>
                        )}
                        {result.genres && result.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.genres.slice(0, 3).map((genre) => (
                              <span
                                key={genre}
                                className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300"
                              >
                                {genre}
                              </span>
                            ))}
                            {result.genres.length > 3 && (
                              <span className="text-gray-500 text-xs">+{result.genres.length - 3} more</span>
                            )}
                          </div>
                        )}
                        {result.description && (
                          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                            {result.description.length > 150 
                              ? result.description.substring(0, 150) + "..."
                              : result.description
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
            <Button variant="outline" onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}