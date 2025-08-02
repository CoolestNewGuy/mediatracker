import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MediaItem } from "@shared/schema";

const editMediaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["Movies", "TV Shows", "Anime", "Manhwa", "Novels", "Pornhwa"]),
  status: z.string(),
  progress: z.string().optional(),
  season: z.string().optional(),
  totalEpisodes: z.string().optional(),
  totalSeasons: z.string().optional(),
  totalChapters: z.string().optional(),
  rating: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  genres: z.array(z.string()).optional(),
});

type EditMediaFormData = z.infer<typeof editMediaSchema>;

interface EditMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItem: MediaItem | null;
}

export default function EditMediaModal({ isOpen, onClose, mediaItem }: EditMediaModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EditMediaFormData>({
    resolver: zodResolver(editMediaSchema),
    defaultValues: {
      title: "",
      type: "Anime",
      status: "To Watch",
      progress: "",
      season: "",
      totalEpisodes: "",
      totalSeasons: "",
      totalChapters: "",
      rating: "",
      notes: "",
      imageUrl: "",
      genres: [],
    },
  });

  useEffect(() => {
    if (mediaItem) {
      form.reset({
        title: mediaItem.title,
        type: mediaItem.type,
        status: mediaItem.status,
        progress: mediaItem.progress || "",
        season: mediaItem.season?.toString() || "",
        totalEpisodes: mediaItem.totalEpisodes?.toString() || "",
        totalSeasons: mediaItem.totalSeasons?.toString() || "",
        totalChapters: mediaItem.totalChapters?.toString() || "",
        rating: mediaItem.rating?.toString() || "",
        notes: mediaItem.notes || "",
        imageUrl: mediaItem.imageUrl || "",
        genres: mediaItem.genres || [],
      });
    }
  }, [mediaItem, form]);

  const updateMediaMutation = useMutation({
    mutationFn: async (data: EditMediaFormData) => {
      if (!mediaItem) return;
      
      const payload = {
        ...data,
        season: data.season ? parseInt(data.season) : undefined,
        totalEpisodes: data.totalEpisodes ? parseInt(data.totalEpisodes) : undefined,
        totalSeasons: data.totalSeasons ? parseInt(data.totalSeasons) : undefined,
        totalChapters: data.totalChapters ? parseInt(data.totalChapters) : undefined,
        rating: data.rating ? parseFloat(data.rating) : undefined,
      };

      const response = await apiRequest('PATCH', `/api/media/${mediaItem.id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Media updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update media. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditMediaFormData) => {
    updateMediaMutation.mutate(data);
  };

  const watchedType = form.watch("type");

  const getStatusOptions = () => {
    if (watchedType === "Movies") {
      return ["To Watch", "Watched", "Watching"];
    } else if (watchedType === "TV Shows" || watchedType === "Anime") {
      return ["To Watch", "Watching", "Completed", "Dropped", "On Hold"];
    } else {
      return ["To Read", "Reading", "Read", "Dropped", "On Hold"];
    }
  };

  if (!mediaItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Media</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-surface-2 border-gray-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-surface-2 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-surface-2 border-gray-600">
                        <SelectItem value="Movies">Movies</SelectItem>
                        <SelectItem value="TV Shows">TV Shows</SelectItem>
                        <SelectItem value="Anime">Anime</SelectItem>
                        <SelectItem value="Manhwa">Manhwa</SelectItem>
                        <SelectItem value="Novels">Novels</SelectItem>
                        <SelectItem value="Pornhwa">Pornhwa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-surface-2 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-surface-2 border-gray-600">
                        {getStatusOptions().map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder={watchedType === "Anime" || watchedType === "TV Shows" ? "e.g., S1E5" : "e.g., Ch42"}
                        className="bg-surface-2 border-gray-600" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-10)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        max="10" 
                        step="0.5"
                        className="bg-surface-2 border-gray-600" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(watchedType === "TV Shows" || watchedType === "Anime") && (
                <>
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Season</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1" 
                            className="bg-surface-2 border-gray-600" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalEpisodes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Episodes</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1" 
                            className="bg-surface-2 border-gray-600" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalSeasons"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Seasons</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1" 
                            className="bg-surface-2 border-gray-600" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {(watchedType === "Manhwa" || watchedType === "Novels" || watchedType === "Pornhwa") && (
                <FormField
                  control={form.control}
                  name="totalChapters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Chapters</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="1" 
                          className="bg-surface-2 border-gray-600" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-surface-2 border-gray-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3}
                        className="bg-surface-2 border-gray-600" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateMediaMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateMediaMutation.isPending}
                className="bg-[#7A1927] hover:bg-[#9d2332]"
              >
                {updateMediaMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Media'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}