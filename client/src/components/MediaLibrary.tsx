import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Grid, List, Search, Filter, Plus, MoreHorizontal, Play, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MediaItem } from "@shared/schema";
// Import EditMediaModal when it's needed

interface MediaLibraryProps {
  onAddMedia: () => void;
  selectedType?: string;
}

const cardSizes = {
  small: { width: 140, height: 200 },
  medium: { width: 180, height: 260 },
  large: { width: 220, height: 320 },
  xlarge: { width: 260, height: 380 }
};

export default function MediaLibrary({ onAddMedia, selectedType }: MediaLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState(selectedType || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cardSize, setCardSize] = useState<keyof typeof cardSizes>("medium");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedType) {
      setTypeFilter(selectedType);
    }
  }, [selectedType]);

  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ['/api/media', typeFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await fetch(`/api/media?${params.toString()}`);
      return response.json();
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent'] });
      toast({
        title: "Media Deleted",
        description: "The media item has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete media item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredItems = mediaItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.genre && item.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditingItem(null);
    setIsEditModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Watch':
      case 'To Read':
        return 'bg-amber-500/20 text-amber-400';
      case 'In Progress':
        return 'bg-green-500/20 text-green-400';
      case 'Watched':
      case 'Read':
        return 'bg-blue-500/20 text-blue-400';
      case 'Dropped':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPlaceholderImage = (type: string, title: string) => {
    const colors = {
      'Anime': '#7A1927',
      'Movies': '#2563eb',
      'TV Shows': '#059669',
      'Manhwa': '#dc2626',
      'Novels': '#7c3aed',
      'Pornhwa': '#ec4899'
    };
    const color = colors[type as keyof typeof colors] || '#6b7280';
    return `https://via.placeholder.com/300x450/${color.replace('#', '')}/fff?text=${encodeURIComponent(title)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading media library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedType ? `${selectedType} Library` : 'Media Library'}
        </h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-surface-2 border-gray-600"
            />
          </div>

          {/* Filters */}
          {!selectedType && (
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-surface-2 border-gray-600">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-gray-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Anime">Anime</SelectItem>
                <SelectItem value="Movies">Movies</SelectItem>
                <SelectItem value="TV Shows">TV Shows</SelectItem>
                <SelectItem value="Manhwa">Manhwa</SelectItem>
                <SelectItem value="Novels">Novels</SelectItem>
                <SelectItem value="Pornhwa">Pornhwa</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-surface-2 border-gray-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-surface-2 border-gray-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="To Watch">To Watch</SelectItem>
              <SelectItem value="To Read">To Read</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Watched">Watched</SelectItem>
              <SelectItem value="Read">Read</SelectItem>
              <SelectItem value="Dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={onAddMedia} className="bg-[#7A1927] hover:bg-[#9d2332]">
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
        </div>
      </div>

      {/* Card Size Slider */}
      {viewMode === 'grid' && (
        <div className="flex items-center gap-4 max-w-xs">
          <Label className="text-sm">Card Size:</Label>
          <div className="flex-1">
            <Slider
              value={[Object.keys(cardSizes).indexOf(cardSize)]}
              onValueChange={(value) => {
                const sizes = Object.keys(cardSizes) as (keyof typeof cardSizes)[];
                setCardSize(sizes[value[0]]);
              }}
              max={3}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          <span className="text-sm text-gray-400 capitalize">{cardSize}</span>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredItems.length} of {mediaItems.length} items
      </div>

      {/* Media Grid/List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No media found</h3>
          <p className="text-gray-400 mb-4">
            {searchQuery 
              ? `No results for "${searchQuery}"`
              : "Start building your library by adding some media"
            }
          </p>
          <Button onClick={onAddMedia} className="bg-[#7A1927] hover:bg-[#9d2332]">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Media
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div 
          className="grid gap-4 auto-fill"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${cardSizes[cardSize].width}px, 1fr))`
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-surface-2 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-105 group"
              style={{ height: cardSizes[cardSize].height }}
            >
              {/* Cover Image */}
              <div className="relative h-4/5 overflow-hidden">
                <img
                  src={item.imageUrl || getPlaceholderImage(item.type, item.title)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getPlaceholderImage(item.type, item.title);
                  }}
                />
                
                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                      <Play className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-surface-2 border-gray-600">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-400"
                          onClick={() => handleDelete(item.id, item.title)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>

                {/* Progress Badge */}
                {item.progress && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs bg-black/50 text-white">
                      {item.progress}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Title and Info */}
              <div className="p-3 h-1/5 flex flex-col justify-center">
                <h3 className="font-medium text-sm line-clamp-2 mb-1" title={item.title}>
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{item.type}</span>
                  {item.releaseYear && (
                    <>
                      <span>•</span>
                      <span>{item.releaseYear}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-surface-2 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || getPlaceholderImage(item.type, item.title)}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getPlaceholderImage(item.type, item.title);
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <span>{item.type}</span>
                    {item.releaseYear && (
                      <>
                        <span>•</span>
                        <span>{item.releaseYear}</span>
                      </>
                    )}
                    {item.genre && (
                      <>
                        <span>•</span>
                        <span className="truncate">{item.genre}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                  {item.progress && (
                    <Badge variant="secondary" className="text-xs">
                      {item.progress}
                    </Badge>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-surface-2 border-gray-600">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400"
                        onClick={() => handleDelete(item.id, item.title)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditMediaModal
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        mediaItem={editingItem}
      />
    </div>
  );
}