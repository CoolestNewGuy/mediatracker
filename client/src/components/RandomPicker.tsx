import { useState } from "react";
import { Dice6 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MediaItem } from "@shared/schema";

export default function RandomPicker() {
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'planned'
  });
  const [randomResult, setRandomResult] = useState<MediaItem | null>(null);
  const { toast } = useToast();

  const randomPickMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.status !== 'all') params.append('status', filters.status);
      
      const response = await apiRequest('GET', `/api/random?${params.toString()}`);
      return response.json();
    },
    onSuccess: (data) => {
      setRandomResult(data);
      toast({
        title: "Random Pick Selected!",
        description: `Here's something for you: ${data.title}`,
      });
    },
    onError: () => {
      toast({
        title: "No Results",
        description: "No items found with the selected filters. Try changing your filters or add more media.",
        variant: "destructive",
      });
      setRandomResult(null);
    },
  });

  const handleRandomPick = () => {
    randomPickMutation.mutate();
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold mb-4">🎲 What to Watch Next?</h3>
      
      <div className="space-y-3 mb-4">
        <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
          <SelectTrigger className="bg-surface-2 border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface-2 border-gray-600">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Anime">Anime Only</SelectItem>
            <SelectItem value="Manhwa">Manhwa Only</SelectItem>
            <SelectItem value="Pornhwa">Pornhwa Only</SelectItem>
            <SelectItem value="Novels">Novels Only</SelectItem>
            <SelectItem value="Movies">Movies Only</SelectItem>
            <SelectItem value="TV Shows">TV Shows Only</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
          <SelectTrigger className="bg-surface-2 border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface-2 border-gray-600">
            <SelectItem value="planned">Not Started</SelectItem>
            <SelectItem value="inprogress">In Progress</SelectItem>
            <SelectItem value="all">All Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleRandomPick}
        disabled={randomPickMutation.isPending}
        className="w-full bg-primary-red hover:bg-primary-red/90 py-3 font-medium"
      >
        <Dice6 className="w-4 h-4 mr-2" />
        {randomPickMutation.isPending ? 'Picking...' : 'Pick Something Random!'}
      </Button>
      
      {/* Random Result Display */}
      {randomResult && (
        <div className="mt-4 p-4 bg-surface-2 rounded-lg text-center">
          <div className="text-sm text-gray-400 mb-1">{randomResult.type}</div>
          <div className="font-medium text-accent">{randomResult.title}</div>
          {randomResult.genre && (
            <div className="text-xs text-gray-500 mt-1">{randomResult.genre}</div>
          )}
          {randomResult.progress && (
            <div className="text-xs text-green-400 mt-1">Progress: {randomResult.progress}</div>
          )}
        </div>
      )}
    </div>
  );
}
