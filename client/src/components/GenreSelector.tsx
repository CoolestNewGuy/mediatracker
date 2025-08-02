import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X } from "lucide-react";

interface GenreSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

const allGenres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
  'Animation', 'Documentary', 'Family', 'Music', 'War', 'Western', 'Crime', 'History', 'Biography',
  'Shounen', 'Shoujo', 'Seinen', 'Josei', 'Ecchi', 'Harem', 'Yaoi', 'Yuri', 'Mecha', 'Magical Girl',
  'Isekai', 'School', 'Sports', 'Supernatural', 'Psychological', 'Slice of Life', 'Military',
  'Post-Apocalyptic', 'Cyberpunk', 'Steampunk', 'Time Travel', 'Alternate History',
  'Mature', 'Adult', 'Smut', 'Manhwa', 'Manhua', 'Pornhwa', 'Webtoon'
];

export default function GenreSelector({ isOpen, onClose, selectedGenres, onGenresChange }: GenreSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>(selectedGenres);

  const filteredGenres = allGenres.filter(genre =>
    genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenreToggle = (genre: string) => {
    setTempSelected(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSave = () => {
    onGenresChange(tempSelected);
    onClose();
  };

  const handleCancel = () => {
    setTempSelected(selectedGenres);
    setSearchQuery("");
    onClose();
  };

  const handleClearAll = () => {
    setTempSelected([]);
  };

  const handleSelectPopular = () => {
    const popularGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi'];
    setTempSelected(prev => {
      const newSelected = [...prev];
      popularGenres.forEach(genre => {
        if (!newSelected.includes(genre)) {
          newSelected.push(genre);
        }
      });
      return newSelected;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="bg-surface border-gray-700 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white">Select Genres</DialogTitle>
          <p className="text-gray-400 text-sm">
            Choose one or more genres that describe your media
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search genres..."
              className="pl-10 bg-surface-2 border-gray-600"
            />
          </div>

          {/* Selected Genres */}
          {tempSelected.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-300">
                  Selected ({tempSelected.length})
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearAll}
                  className="text-gray-400 hover:text-white"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {tempSelected.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="secondary" 
                    className="bg-[#7A1927] text-white cursor-pointer"
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSelectPopular}
              className="bg-surface-2 border-gray-600 text-gray-300 hover:text-white"
            >
              Select Popular
            </Button>
          </div>

          {/* Genre Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredGenres.map((genre) => (
                <div
                  key={genre}
                  className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    tempSelected.includes(genre)
                      ? 'bg-[#7A1927] bg-opacity-20 border border-[#7A1927]'
                      : 'bg-surface-2 border border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => handleGenreToggle(genre)}
                >
                  <Checkbox
                    checked={tempSelected.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="data-[state=checked]:bg-[#7A1927] data-[state=checked]:border-[#7A1927]"
                  />
                  <span className={`text-sm ${
                    tempSelected.includes(genre) ? 'text-white font-medium' : 'text-gray-300'
                  }`}>
                    {genre}
                  </span>
                </div>
              ))}
            </div>
            
            {filteredGenres.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400">No genres found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-surface-2 border-gray-600 text-gray-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#7A1927] hover:bg-[#9d2332] text-white"
          >
            Save Genres ({tempSelected.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}