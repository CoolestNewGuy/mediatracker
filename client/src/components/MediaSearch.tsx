import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink } from "lucide-react";

interface MediaSearchProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: string;
  onSelect: (result: any) => void;
}

interface SearchResult {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  releaseYear: number;
  genres: string[];
  externalId: string;
}

export default function MediaSearch({ isOpen, onClose, mediaType, onSelect }: MediaSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: searchResults = [], isLoading, refetch } = useQuery<SearchResult[]>({
    queryKey: ['/api/search-external', searchQuery, mediaType],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const params = new URLSearchParams({
        query: searchQuery,
        type: mediaType
      });
      
      const response = await fetch(`/api/search-external?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json();
    },
    enabled: false, // Manual trigger
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setSearchQuery("");
    setHasSearched(false);
  };

  const handleClose = () => {
    setSearchQuery("");
    setHasSearched(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            Search {mediaType} Database
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            Search external databases for {mediaType.toLowerCase()} information
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Search for ${mediaType.toLowerCase()}...`}
              className="bg-surface-2 border-gray-600 flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoading}
              className="bg-[#7A1927] hover:bg-[#9d2332]"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Search Results */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-gray-400">Searching external databases...</p>
              </div>
            </div>
          )}

          {hasSearched && !isLoading && searchResults.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="text-lg font-semibold mb-1">No results found</h3>
              <p className="text-gray-400">
                Try searching with different keywords or check your spelling
              </p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Search Results ({searchResults.length})
              </h3>
              
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-surface-2 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex gap-4">
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      className="w-16 h-24 object-cover rounded flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(result.title)}`;
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white line-clamp-1">{result.title}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span>{mediaType}</span>
                        {result.releaseYear && (
                          <>
                            <span>•</span>
                            <span>{result.releaseYear}</span>
                          </>
                        )}
                      </div>

                      {result.genres && result.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {result.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                          {result.genres.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{result.genres.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <p className="text-gray-400 text-sm line-clamp-2">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search Tips */}
          {!hasSearched && (
            <div className="bg-surface-2 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-white mb-2">Search Tips</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Use the exact title or close variations</li>
                <li>• Try searching without special characters</li>
                <li>• For anime, you can search in English or Japanese</li>
                <li>• Results come from {
                  mediaType === 'Movies' || mediaType === 'TV Shows' ? 'TMDB' :
                  mediaType === 'Anime' ? 'AniList' :
                  'manga databases'
                }</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}