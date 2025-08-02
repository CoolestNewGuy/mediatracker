import { useState } from "react";
import { MoreHorizontal, Eye, Edit, Trash2, Play } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import type { MediaItem } from "@shared/schema";

interface MediaListProps {
  items: MediaItem[];
  onEdit?: (item: MediaItem) => void;
  onDelete?: (item: MediaItem) => void;
  onIncrement?: (item: MediaItem) => void;
  onView?: (item: MediaItem) => void;
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'to watch':
    case 'to read':
    case 'planned':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'in progress':
    case 'watching':
    case 'reading':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'watched':
    case 'read':
    case 'completed':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'dropped':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'on hold':
    case 'paused':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'anime':
      return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
    case 'movies':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'tv shows':
      return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    case 'manhwa':
      return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    case 'novels':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'pornhwa':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
};

export default function MediaList({ 
  items, 
  onEdit, 
  onDelete, 
  onIncrement, 
  onView,
  isLoading = false 
}: MediaListProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <div className="text-muted-foreground">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No media items found</h3>
          <p className="text-sm">Start adding some media to your library!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded border"
                    />
                  )}
                  <div>
                    <div className="font-medium line-clamp-1">{item.title}</div>
                    {item.rating && (
                      <div className="text-sm text-muted-foreground">
                        ⭐ {item.rating}/10
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getTypeColor(item.type)}>
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {item.progress && (
                    <div className="font-medium">{item.progress}</div>
                  )}
                  {item.type === 'Anime' || item.type === 'TV Shows' ? (
                    <div className="text-muted-foreground">
                      S{item.season || 1}E{item.episode || 0}
                      {item.totalEpisodes && ` / ${item.totalEpisodes}`}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Ch {item.chapter || 0}
                      {item.totalChapters && ` / ${item.totalChapters}`}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.dateAdded && 
                  formatDistanceToNow(new Date(item.dateAdded), { addSuffix: true })
                }
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(item)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onIncrement && (
                      <DropdownMenuItem onClick={() => onIncrement(item)}>
                        <Play className="mr-2 h-4 w-4" />
                        Update Progress
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(item)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}