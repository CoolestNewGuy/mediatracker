import { Film, Book, Heart, BookOpen, TvIcon, PlayCircle, Image } from "lucide-react";
import type { MediaItem } from "@shared/schema";

interface RecentMediaListProps {
  items?: MediaItem[];
  isLoading?: boolean;
}

const getMediaIcon = (type: string) => {
  switch (type) {
    case 'Anime': return TvIcon;
    case 'Manhwa': return Book;
    case 'Pornhwa': return Heart;
    case 'Novels': return BookOpen;
    case 'Movies': return Film;
    case 'TV Shows': return PlayCircle;
    default: return Image;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'To Watch':
    case 'To Read': return 'bg-amber-500/20 text-amber-400';
    case 'In Progress': return 'bg-green-500/20 text-green-400';
    case 'Watched':
    case 'Read': return 'bg-blue-500/20 text-blue-400';
    case 'Dropped': return 'bg-red-500/20 text-red-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

export default function RecentMediaList({ items = [], isLoading }: RecentMediaListProps) {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Recently Added</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 bg-surface-2 rounded-lg animate-pulse">
              <div className="w-12 h-16 bg-gray-600 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Recently Added</h3>
        <a href="#" className="text-primary-red hover:text-accent text-sm">View All</a>
      </div>
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No recent items</p>
            <p className="text-sm text-gray-500 mt-2">Add some media to see them here!</p>
          </div>
        ) : (
          items.slice(0, 5).map((item) => {
            const Icon = getMediaIcon(item.type);
            return (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-surface-2 rounded-lg hover:bg-surface-3 transition-colors">
                <div className="w-12 h-16 bg-gradient-to-br from-primary-red to-accent rounded-lg flex items-center justify-center">
                  <Icon className="text-white w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.type}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.dateAdded ? formatDate(item.dateAdded.toString()) : 'Recently'}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <PlayCircle className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
