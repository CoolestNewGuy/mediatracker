import { X, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { QuickUpdateItem } from "@/lib/types";

interface QuickUpdateSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items?: QuickUpdateItem[];
}

export default function QuickUpdateSidebar({ isOpen, onClose, items = [] }: QuickUpdateSidebarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const incrementMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest('POST', `/api/media/${itemId}/increment`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress Updated",
        description: "Progress incremented successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/media/in-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress.",
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest('POST', `/api/media/${itemId}/complete`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Completed!",
        description: "Item marked as completed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/media/in-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark item as complete.",
        variant: "destructive",
      });
    },
  });

  const handleIncrement = (itemId: string) => {
    incrementMutation.mutate(itemId);
  };

  const handleComplete = (itemId: string) => {
    completeMutation.mutate(itemId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 bg-surface border-gray-700">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">⚡ Quick Update</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-400">
            Update progress for items you're currently watching/reading:
          </p>
          
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No items in progress</p>
              <p className="text-sm text-gray-500 mt-2">
                Add some media and start watching/reading to see them here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-surface-2 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.type}</p>
                      <p className="text-xs text-gray-500">
                        Current: {item.progress || 'No progress'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleIncrement(item.id)}
                      disabled={incrementMutation.isPending}
                      className="flex-1 bg-primary-red hover:bg-primary-red/90 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      +1 {item.type === 'Anime' || item.type === 'TV Shows' ? 'Episode' : 'Chapter'}
                    </Button>
                    <Button
                      onClick={() => handleComplete(item.id)}
                      disabled={completeMutation.isPending}
                      variant="outline"
                      className="bg-surface-3 hover:bg-gray-600 border-gray-600 text-sm"
                    >
                      ✓
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
