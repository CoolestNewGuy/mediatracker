import { Film, TvIcon, Book, BookOpen, Heart, PlayCircle, Plus, Search, Library, Clock, Trophy, Settings, Download, ChartLine, Grid } from "lucide-react";
import type { MediaStats } from "@/lib/types";

interface SidebarProps {
  stats?: MediaStats;
  onAddMedia: () => void;
  onQuickUpdate: () => void;
  onViewCatalog: () => void;
}

export default function Sidebar({ stats, onAddMedia, onQuickUpdate, onViewCatalog }: SidebarProps) {
  // Primary media types (main focus)
  const primaryTypes = [
    { name: 'Movies', icon: Film, count: stats?.byType?.Movies?.total || 0, category: 'primary' },
    { name: 'TV Shows', icon: PlayCircle, count: stats?.byType?.['TV Shows']?.total || 0, category: 'primary' },
    { name: 'Anime', icon: TvIcon, count: stats?.byType?.Anime?.total || 0, category: 'primary' },
    { name: 'Books & Manga', icon: Book, count: (stats?.byType?.Manhwa?.total || 0) + (stats?.byType?.Books?.total || 0), category: 'primary' },
  ];
  
  // Additional/Extended media types
  const additionalTypes = [
    { name: 'Novels', icon: BookOpen, count: stats?.byType?.Novels?.total || 0, category: 'additional' },
    { name: 'Manhwa', icon: Book, count: stats?.byType?.Manhwa?.total || 0, category: 'additional' },
    { name: 'Manhua', icon: Book, count: stats?.byType?.Manhua?.total || 0, category: 'additional' },
    { name: 'Pornhwa', icon: Heart, count: stats?.byType?.Pornhwa?.total || 0, category: 'additional' },
  ].filter(type => type.count > 0); // Only show additional types if they have content

  return (
    <div className="w-64 bg-surface border-r border-gray-700 flex-shrink-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-red rounded-lg flex items-center justify-center">
            <Film className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Media Tracker</h1>
            <p className="text-xs text-gray-400">Your Entertainment Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-2">
          <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-white bg-primary-red">
            <ChartLine size={16} />
            <span>Dashboard</span>
          </a>
          <button 
            onClick={onAddMedia}
            className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 w-full text-left hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200"
          >
            <Plus size={16} />
            <span>Add Media</span>
          </button>
          <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200">
            <Search size={16} />
            <span>Search All</span>
          </a>
        </div>

        {/* Primary Media Types */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Categories</h3>
          <div className="space-y-1">
            {primaryTypes.map((type) => {
              const Icon = type.icon;
              return (
                <a 
                  key={type.name}
                  href="#" 
                  className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200"
                >
                  <Icon size={16} />
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
                    className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200"
                  >
                    <Icon size={16} />
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
              className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 w-full text-left hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200"
            >
              <Grid size={16} />
              <span>View Catalog</span>
            </button>
            <button 
              onClick={onQuickUpdate}
              className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 w-full text-left hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200"
            >
              <Clock size={16} />
              <span>Quick Update</span>
            </button>
            <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200">
              <Trophy size={16} />
              <span>Achievements</span>
            </a>
          </div>
        </div>

        {/* Settings */}
        <div className="mt-6">
          <div className="space-y-1">
            <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200">
              <Settings size={16} />
              <span>Settings</span>
            </a>
            <a href="#" className="sidebar-item flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-surface-2 hover:border-l-4 hover:border-primary-red transition-all duration-200">
              <Download size={16} />
              <span>Export Data</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
