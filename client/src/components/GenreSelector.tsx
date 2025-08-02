import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface GenreSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

const allGenres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
  'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Slice of Life',
  'Supernatural', 'Psychological', 'Sports', 'Historical', 'Mecha',
  'School', 'Military', 'Music', 'Shounen', 'Seinen', 'Shoujo',
  'Josei', 'Ecchi', 'Harem', 'Isekai', 'Martial Arts', 'Medical',
  'Crime', 'Documentary', 'Biography', 'Animation', 'Family',
  'War', 'Western', 'Musical', 'Film-Noir', 'Game Show', 'Talk Show',
  'Reality TV', 'News', 'Sport', 'Adult', 'Mature'
];

export default function GenreSelector({ isOpen, onClose, selectedGenres, onGenresChange }: GenreSelectorProps) {
  const [tempSelectedGenres, setTempSelectedGenres] = useState<string[]>(selectedGenres);

  const handleGenreToggle = (genre: string) => {
    setTempSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleConfirm = () => {
    onGenresChange(tempSelectedGenres);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedGenres(selectedGenres);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="bg-surface border-gray-700 max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Select Genres</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Selected Genres Display */}
          {tempSelectedGenres.length > 0 && (
            <div className="border border-gray-600 rounded-lg p-3 bg-surface-2">
              <p className="text-sm font-medium mb-2">Selected ({tempSelectedGenres.length}):</p>
              <div className="flex flex-wrap gap-1">
                {tempSelectedGenres.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="secondary" 
                    className="bg-[#7A1927] text-white hover:bg-[#9d2332] cursor-pointer"
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Genre Grid */}
          <div className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {allGenres.map((genre) => {
                const isSelected = tempSelectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`
                      flex items-center justify-between p-2 rounded-lg text-left text-sm transition-colors
                      ${isSelected 
                        ? 'bg-[#7A1927] text-white border-[#7A1927]' 
                        : 'bg-surface-2 text-gray-300 hover:bg-gray-600 border-gray-600'
                      }
                      border
                    `}
                  >
                    <span>{genre}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-3 pt-4 border-t border-gray-600">
            <Button 
              variant="outline" 
              onClick={() => setTempSelectedGenres([])}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Clear All
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700">
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="bg-[#7A1927] hover:bg-[#9d2332]">
                Confirm ({tempSelectedGenres.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}