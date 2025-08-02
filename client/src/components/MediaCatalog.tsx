import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Filter, Search, Grid, List, Star, Clock, Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MediaItem } from "@shared/schema";

interface MediaCatalogProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  'To Watch': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Watching': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Completed': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'On Hold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Dropped': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons = {
  'To Watch': Clock,
  'Watching': Play,
  'Completed': Check,
  'On Hold': Clock,
  'Dropped': X,
};

export default function MediaCatalog({ isOpen, onClose }: MediaCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ['/api/media'],
    enabled: isOpen
  });

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.genre && item.genre.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-background border border-border rounded-lg shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-foreground">Media Catalog</h2>
              <Badge variant="secondary" className="bg-surface-2 text-muted-foreground">
                {filteredItems.length} items
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap items-center gap-4 p-6 border-b border-border bg-surface-1">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px] bg-background border-border">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Movies">Movies</SelectItem>
                <SelectItem value="TV Shows">TV Shows</SelectItem>
                <SelectItem value="Anime">Anime</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Manhwa">Manhwa</SelectItem>
                <SelectItem value="Novels">Novels</SelectItem>
                <SelectItem value="Manhua">Manhua</SelectItem>
                <SelectItem value="Pornhwa">Pornhwa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] bg-background border-border">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="To Watch">To Watch</SelectItem>
                <SelectItem value="Watching">Watching</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No media items found</p>
                <p className="text-muted-foreground text-sm mt-2">
                  {searchTerm || filterType !== "all" || filterStatus !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Add some media items to get started"
                  }
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => {
                  const StatusIcon = statusIcons[item.status as keyof typeof statusIcons];
                  return (
                    <Card key={item.id} className="bg-surface-1 border-border hover:bg-surface-2 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-medium line-clamp-2 text-foreground">
                            {item.title}
                          </CardTitle>
                          <Badge className={`ml-2 ${statusColors[item.status as keyof typeof statusColors]} flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {item.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="text-foreground">{item.type}</span>
                          </div>
                          
                          {item.progress && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress:</span>
                              <span className="text-foreground">
                                {item.progress}
                              </span>
                            </div>
                          )}

                          {item.rating && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Rating:</span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                <span className="text-foreground">{item.rating}/10</span>
                              </div>
                            </div>
                          )}

                          {item.genre && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                                {item.genre}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const StatusIcon = statusIcons[item.status as keyof typeof statusIcons];
                  return (
                    <Card key={item.id} className="bg-surface-1 border-border hover:bg-surface-2 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <h3 className="font-medium text-foreground">{item.title}</h3>
                              <Badge className={`${statusColors[item.status as keyof typeof statusColors]} flex items-center gap-1`}>
                                <StatusIcon className="h-3 w-3" />
                                {item.status}
                              </Badge>
                              <Badge variant="outline" className="border-border text-muted-foreground">
                                {item.type}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                              {item.progress && (
                                <span>Progress: {item.progress}</span>
                              )}
                              {item.rating && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                  <span>{item.rating}/10</span>
                                </div>
                              )}
                              {item.genre && (
                                <span>Genre: {item.genre}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}