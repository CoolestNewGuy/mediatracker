import { Search, Plus, User, Flame } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderBarProps {
  onAddMedia: () => void;
}

export default function HeaderBar({ onAddMedia }: HeaderBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-surface border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-2 bg-surface-2 rounded-lg px-3 py-1">
            <Flame className="text-accent w-4 h-4" />
            <span className="text-sm font-medium">7 day streak!</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-2 border-gray-600 w-80 pr-10 focus:border-primary"
            />
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          
          {/* Quick Add Button */}
          <Button 
            onClick={onAddMedia}
            className="bg-primary-red hover:bg-primary-red/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
          
          {/* User Menu */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon"
              className="w-8 h-8 bg-primary-red border-primary-red"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
