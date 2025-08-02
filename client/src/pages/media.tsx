import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MediaItem } from "@shared/schema";
import type { MediaStats } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import MediaList from "@/components/MediaList";
import AddMediaModal from "@/components/AddMediaModal";
import EditMediaModal from "@/components/EditMediaModal";

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all media items
  const { data: mediaItems = [], isLoading, error } = useQuery<MediaItem[]>({
    queryKey: ['/api/media'],
  });

  // Fetch stats for sidebar
  const { data: stats } = useQuery<MediaStats>({
    queryKey: ['/api/stats'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Success",
        description: "Media item deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete media item",
        variant: "destructive",
      });
    },
  });

  // Increment progress mutation
  const incrementMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/media/${id}/increment`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Progress Updated",
        description: "Media progress incremented successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  // Filter media items
  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = (item: MediaItem) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
  };

  const handleIncrement = (item: MediaItem) => {
    incrementMutation.mutate(item.id);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || typeFilter !== "all" || statusFilter !== "all";

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar 
          stats={stats}
          onAddMedia={() => setIsAddModalOpen(true)}
          onQuickUpdate={() => {}}
          onViewCatalog={() => {}}
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <HeaderBar onAddMedia={() => setIsAddModalOpen(true)} />
          
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-2">Failed to Load Media</h2>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "An unexpected error occurred"}
              </p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/media'] })}>
                Try Again
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        stats={stats}
        onAddMedia={() => setIsAddModalOpen(true)}
        onQuickUpdate={() => {}}
        onViewCatalog={() => {}}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <HeaderBar onAddMedia={() => setIsAddModalOpen(true)} />
        
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">All Media</h1>
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : `${filteredItems.length} of ${mediaItems.length} items`}
                  {hasActiveFilters && " (filtered)"}
                </p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Anime">Anime</SelectItem>
                  <SelectItem value="Movies">Movies</SelectItem>
                  <SelectItem value="TV Shows">TV Shows</SelectItem>
                  <SelectItem value="Manhwa">Manhwa</SelectItem>
                  <SelectItem value="Novels">Novels</SelectItem>
                  <SelectItem value="Pornhwa">Pornhwa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="To Watch">To Watch</SelectItem>
                  <SelectItem value="To Read">To Read</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Watching">Watching</SelectItem>
                  <SelectItem value="Reading">Reading</SelectItem>
                  <SelectItem value="Watched">Watched</SelectItem>
                  <SelectItem value="Read">Read</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Dropped">Dropped</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {/* Media List */}
            <MediaList
              items={filteredItems}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onIncrement={handleIncrement}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditMediaModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        mediaItem={editingItem}
      />
    </div>
  );
}