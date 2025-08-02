import { Search, Plus, User, Flame, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User as UserType } from "@shared/schema";

interface HeaderBarProps {
  onAddMedia: () => void;
}

export default function HeaderBar({ onAddMedia }: HeaderBarProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const typedUser = user as UserType | undefined;

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 bg-surface-2 border-gray-600 hover:bg-surface-3"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={typedUser?.profileImageUrl || ""} />
                  <AvatarFallback className="bg-primary-red text-white text-xs">
                    {typedUser?.firstName?.charAt(0) || typedUser?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {typedUser?.firstName || typedUser?.email?.split('@')[0] || "User"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {typedUser?.firstName && typedUser?.lastName 
                      ? `${typedUser.firstName} ${typedUser.lastName}`
                      : typedUser?.email?.split('@')[0] || "User"
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">{typedUser?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => window.location.href = '/api/logout'}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
