import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Archive, Tag, Check } from "lucide-react";

interface BulkActionsProps {
  selectedItems: string[];
  onMarkAsWatched: () => void;
  onMarkAsRead: () => void;
  onChangeStatus: (status: string) => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedItems,
  onMarkAsWatched,
  onMarkAsRead,
  onChangeStatus,
  onDelete,
  onClearSelection
}: BulkActionsProps) {
  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-surface border border-gray-600 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-[#7A1927] text-white">
          {selectedItems.length} selected
        </Badge>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onMarkAsWatched}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-1" />
            Mark Watched
          </Button>
          
          <Button
            size="sm"
            onClick={onMarkAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="w-4 h-4 mr-1" />
            Mark Read
          </Button>
          
          <Select onValueChange={onChangeStatus}>
            <SelectTrigger className="w-32 h-8 bg-surface-2 border-gray-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-surface-2 border-gray-600">
              <SelectItem value="To Watch">To Watch</SelectItem>
              <SelectItem value="To Read">To Read</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}