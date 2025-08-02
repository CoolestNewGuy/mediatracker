import { Film, TvIcon, Book, BookOpen, Heart, PlayCircle, Plus, Search, Library, Clock, Trophy, Settings, Download, ChartLine, Grid } from "lucide-react";
import type { MediaStats } from "@/lib/types";

interface SidebarProps {
  stats?: MediaStats;
  onAddMedia: () => void;
  onQuickUpdate: () => void;
  onViewCatalog: () => void;
}

export default function Sidebar({ stats, onAddMedia, onQuickUpdate, onViewCatalog }: SidebarProps) {
  // Media types matching your specifications
  const mediaTypes = [
    { name: 'Anime', icon: TvIcon, count: stats?.byType?.Anime?.total || 0 },
    { name: 'Manhwa', icon: Book, count: stats?.byType?.Manhwa?.total || 0 },
    { name: 'Pornhwa', icon: Heart, count: stats?.byType?.Pornhwa?.total || 0 },
    { name: 'Novels', icon: BookOpen, count: stats?.byType?.Novels?.total || 0 },
    { name: 'Movies', icon: Film, count: stats?.byType?.Movies?.total || 0 },
    { name: 'TV Shows', icon: PlayCircle, count: stats?.byType?.['TV Shows']?.total || 0 },
  ];

  return (
    <div className="w-64 bg-surface border-r border-gray-700 flex-shrink-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#7A1927] rounded-lg flex items-center justify-center">
            <Film className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Media Tracker</h1>
            <p className="text-xs text-gray-400">Complete Media Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-2">
          <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-white bg-[#7A1927]">
            <ChartLine size={16} />
            <span>Dashboard</span>
          </a>
          <button 
            onClick={onAddMedia}
            className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 w-full text-left hover:bg-surface-2 hover:border-l-4 hover:border-[#7A1927] transition-all duration-200"
          >
            <Plus size={16} />
            <span>Add Media</span>
          </button>
          <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-[#7A1927] transition-all duration-200">
            <Search size={16} />
            <span>Search All</span>
          </a>
        </div>

        {/* Media Categories */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Media Library</h3>
          <div className="space-y-1">
            {mediaTypes.map((type) => {
              const Icon = type.icon;
              return (
                <a 
                  key={type.name}
                  href="#" 
                  className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-[#7A1927] transition-all duration-200"
                >
                  <Icon size={16} className="text-[#7A1927]" />
                  <span>{type.name}</span>
                  <span className="ml-auto bg-surface-2 px-2 py-1 rounded text-xs">
                    {type.count}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Additional Media Types (only show if they have content) */}
        {additionalTypes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Additional</h3>
            <div className="space-y-1">
              {additionalTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <a 
                    key={type.name}
                    href="#" 
                    className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-red-500 transition-all duration-200"
                  >
                    <Icon size={16} className="text-red-500" />
                    <span>{type.name}</span>
                    <span className="ml-auto bg-surface-2 px-2 py-1 rounded text-xs">
                      {type.count}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Browse</h3>
          <div className="space-y-1">
            <button 
              onClick={onViewCatalog}
              className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 w-full text-left hover:bg-surface-2 hover:border-l-4 hover:border-red-500 transition-all duration-200"
            >
              <Grid size={16} />
              <span>View Catalog</span>
            </button>
            <button 
              onClick={onQuickUpdate}
              className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 w-full text-left hover:bg-surface-2 hover:border-l-4 hover:border-red-500 transition-all duration-200"
            >
              <Clock size={16} />
              <span>Quick Update</span>
            </button>
            <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-red-500 transition-all duration-200">
              <Trophy size={16} />
              <span>Achievements</span>
            </a>
          </div>
        </div>

        {/* Settings */}
        <div className="mt-6">
          <div className="space-y-1">
            <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-red-500 transition-all duration-200">
              <Settings size={16} />
              <span>Settings</span>
            </a>
            <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-red-500 transition-all duration-200">
              <Download size={16} />
              <span>Export Data</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
