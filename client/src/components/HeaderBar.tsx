import { Search, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";

interface HeaderBarProps {
  onAddMedia: () => void;
}

export default function HeaderBar({ onAddMedia }: HeaderBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-surface border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MediaTracker
            </h1>
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
          
          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
