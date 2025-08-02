import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Library, Filter, Grid, List } from "lucide-react";
import type { MediaItem } from "@shared/schema";

interface CatalogPreviewProps {
  onOpenCatalog: () => void;
}

export default function CatalogPreview({ onOpenCatalog }: CatalogPreviewProps) {
  const { data: recentMedia } = useQuery<MediaItem[]>({
    queryKey: ['/api/recent'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Watched':
      case 'Read':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'To Watch':
      case 'To Read':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Dropped':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-surface border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Library className="w-5 h-5" />
            Library Preview
          </CardTitle>
          <Button 
            size="sm" 
            onClick={onOpenCatalog}
            className="bg-[#7A1927] hover:bg-[#9d2332]"
          >
            <Grid className="w-4 h-4 mr-2" />
            Browse All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentMedia && recentMedia.length > 0 ? (
          <div className="space-y-3">
            {recentMedia.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg hover:bg-surface-1 transition-colors">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center">
                    <Library className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                    {item.progress && (
                      <Badge variant="secondary" className="text-xs">
                        {item.progress}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {recentMedia.length > 4 && (
              <div className="text-center pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onOpenCatalog}
                  className="text-xs"
                >
                  View {recentMedia.length - 4} more items
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Library className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Your library is empty</p>
            <p className="text-xs text-gray-500 mb-4">Start by adding some media to track</p>
            <Button 
              size="sm" 
              onClick={onOpenCatalog}
              className="bg-[#7A1927] hover:bg-[#9d2332]"
            >
              Add Media
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}