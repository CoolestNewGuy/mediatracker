import { useState, useEffect, useRef } from "react";
import { Edit, Trash2, Plus, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddProgress: (type: 'episodes' | 'seasons' | 'chapters', amount: number) => void;
  mediaType: string;
  currentProgress?: string;
}

export default function MediaContextMenu({
  x,
  y,
  onClose,
  onEdit,
  onDelete,
  onAddProgress,
  mediaType,
  currentProgress
}: MediaContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addType, setAddType] = useState<'episodes' | 'seasons' | 'chapters'>('episodes');
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleAddProgress = () => {
    const amount = parseInt(addAmount);
    if (!isNaN(amount) && amount > 0) {
      onAddProgress(addType, amount);
      setShowAddDialog(false);
      setAddAmount("");
      onClose();
    }
  };

  const getProgressOptions = () => {
    if (mediaType === 'Anime' || mediaType === 'TV Shows' || mediaType === 'Movies') {
      return (
        <>
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 w-full text-left"
            onClick={() => {
              setAddType('episodes');
              setShowAddDialog(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Episodes
          </button>
          {(mediaType === 'TV Shows' || mediaType === 'Anime') && (
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 w-full text-left"
              onClick={() => {
                setAddType('seasons');
                setShowAddDialog(true);
              }}
            >
              <TrendingUp className="w-4 h-4" />
              Add Seasons
            </button>
          )}
        </>
      );
    } else if (mediaType === 'Manhwa' || mediaType === 'Pornhwa' || mediaType === 'Novels' || mediaType === 'Books') {
      return (
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 w-full text-left"
          onClick={() => {
            setAddType('chapters');
            setShowAddDialog(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Chapters
        </button>
      );
    }
    return null;
  };

  return (
    <>
      <div
        ref={menuRef}
        className="fixed bg-surface-2 border border-gray-600 rounded-lg shadow-lg py-1 z-50 min-w-[180px]"
        style={{ top: y, left: x }}
      >
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 w-full text-left"
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        
        {getProgressOptions()}
        
        <div className="border-t border-gray-600 my-1" />
        
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 w-full text-left text-red-400"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px] bg-surface-2 border-gray-600">
          <DialogHeader>
            <DialogTitle>Add {addType.charAt(0).toUpperCase() + addType.slice(1)}</DialogTitle>
            <DialogDescription>
              How many {addType} would you like to add?
              {currentProgress && <span className="block mt-1">Current: {currentProgress}</span>}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="col-span-3"
                placeholder="Enter number"
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProgress}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}