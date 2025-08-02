import { ExternalLink, Search, Star, Edit, Trash2, Play, Book, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MediaItem } from "@shared/schema";

interface EnhancedMediaContextMenuProps {
  x: number;
  y: number;
  item: MediaItem;
  onClose: () => void;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string, title: string) => void;
}

interface PlatformLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  type: 'streaming' | 'info' | 'purchase' | 'reading';
}

export default function EnhancedMediaContextMenu({
  x,
  y,
  item,
  onClose,
  onEdit,
  onDelete
}: EnhancedMediaContextMenuProps) {
  
  const getPlatformLinks = (item: MediaItem): PlatformLink[] => {
    const title = encodeURIComponent(item.title);
    const links: PlatformLink[] = [];
    
    // Universal links
    links.push({
      name: "Google Search",
      url: `https://www.google.com/search?q=${title}`,
      icon: <Search className="w-4 h-4" />,
      type: 'info'
    });
    
    switch (item.type) {
      case 'Anime':
        links.push(
          {
            name: "AniList",
            url: `https://anilist.co/search/anime?search=${title}`,
            icon: <Star className="w-4 h-4" />,
            type: 'info'
          },
          {
            name: "Crunchyroll",
            url: `https://www.crunchyroll.com/search?q=${title}`,
            icon: <Play className="w-4 h-4" />,
            type: 'streaming'
          },
          {
            name: "Funimation",
            url: `https://www.funimation.com/search/?q=${title}`,
            icon: <Play className="w-4 h-4" />,
            type: 'streaming'
          }
        );
        break;
        
      case 'Movies':
      case 'TV Shows':
        links.push(
          {
            name: "TMDB",
            url: `https://www.themoviedb.org/search?query=${title}`,
            icon: <Star className="w-4 h-4" />,
            type: 'info'
          },
          {
            name: "Netflix",
            url: `https://www.netflix.com/search?q=${title}`,
            icon: <Monitor className="w-4 h-4" />,
            type: 'streaming'
          },
          {
            name: "Prime Video",
            url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${title}`,
            icon: <Monitor className="w-4 h-4" />,
            type: 'streaming'
          },
          {
            name: "Amazon Buy",
            url: `https://www.amazon.com/s?k=${title}&i=movies-tv&tag=yourref-20`,
            icon: <ExternalLink className="w-4 h-4" />,
            type: 'purchase'
          }
        );
        break;
        
      case 'Manhwa':
      case 'Pornhwa':
        links.push(
          {
            name: "Webtoon",
            url: `https://www.webtoons.com/en/search?keyword=${title}`,
            icon: <Book className="w-4 h-4" />,
            type: 'reading'
          },
          {
            name: "Amazon Manga",
            url: `https://www.amazon.com/s?k=${title}&i=stripbooks&tag=yourref-20`,
            icon: <ExternalLink className="w-4 h-4" />,
            type: 'purchase'
          }
        );
        break;
        
      case 'Novels':
        links.push(
          {
            name: "Goodreads",
            url: `https://www.goodreads.com/search?q=${title}`,
            icon: <Star className="w-4 h-4" />,
            type: 'info'
          },
          {
            name: "Amazon Books",
            url: `https://www.amazon.com/s?k=${title}&i=stripbooks&tag=yourref-20`,
            icon: <ExternalLink className="w-4 h-4" />,
            type: 'purchase'
          },
          {
            name: "Kindle Store",
            url: `https://www.amazon.com/s?k=${title}&i=digital-text&tag=yourref-20`,
            icon: <Book className="w-4 h-4" />,
            type: 'purchase'
          }
        );
        break;
    }
    
    return links;
  };

  const platformLinks = getPlatformLinks(item);
  
  const getLinkTypeColor = (type: string) => {
    switch (type) {
      case 'streaming': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'purchase': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'reading': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed z-50 bg-surface-2 border border-gray-600 rounded-lg shadow-xl min-w-80 max-w-96"
        style={{ 
          left: x, 
          top: y,
          transform: 'translate(-50%, 0)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-600">
          <h3 className="font-semibold text-sm text-white leading-tight mb-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {item.type}
            </Badge>
            {item.releaseYear && (
              <Badge variant="outline" className="text-xs">
                {item.releaseYear}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-3">
              {item.description}
            </p>
          )}
        </div>

        {/* Platform Links */}
        <div className="p-4 border-b border-gray-600">
          <h4 className="text-xs font-medium text-gray-300 mb-3 uppercase tracking-wide">
            Platform Links
          </h4>
          <div className="space-y-2">
            {platformLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700/50 transition-colors group"
                onClick={onClose}
              >
                <div className="flex-shrink-0">
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white group-hover:text-gray-200">
                    {link.name}
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getLinkTypeColor(link.type)}`}
                >
                  {link.type}
                </Badge>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-2">
          <button
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-700/50 w-full text-left rounded-md transition-colors"
            onClick={() => {
              onEdit(item);
              onClose();
            }}
          >
            <Edit className="w-4 h-4" />
            Edit Details
          </button>
          <button
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-red-500/20 text-red-400 w-full text-left rounded-md transition-colors"
            onClick={() => {
              onDelete(item.id, item.title);
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}