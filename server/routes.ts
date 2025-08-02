import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMediaItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a default user for demo purposes (in real app, this would be handled by auth)
  const defaultUserId = "demo-user-id";

  // Media routes
  app.get("/api/media", async (req, res) => {
    try {
      const { type, status } = req.query;
      const filters = {
        type: typeof type === 'string' ? type : undefined,
        status: typeof status === 'string' ? status : undefined
      };
      
      const mediaItems = await storage.getMediaItems(defaultUserId, filters);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media items" });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const mediaItem = await storage.getMediaItem(req.params.id, defaultUserId);
      if (!mediaItem) {
        return res.status(404).json({ error: "Media item not found" });
      }
      res.json(mediaItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media item" });
    }
  });

  app.post("/api/media", async (req, res) => {
    try {
      const validatedData = insertMediaItemSchema.parse(req.body);
      const mediaItem = await storage.createMediaItem({
        ...validatedData,
        userId: defaultUserId
      });
      res.status(201).json(mediaItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create media item" });
    }
  });

  app.patch("/api/media/:id", async (req, res) => {
    try {
      const updates = insertMediaItemSchema.partial().parse(req.body);
      const mediaItem = await storage.updateMediaItem(req.params.id, defaultUserId, updates);
      if (!mediaItem) {
        return res.status(404).json({ error: "Media item not found" });
      }
      res.json(mediaItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update media item" });
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      const success = await storage.deleteMediaItem(req.params.id, defaultUserId);
      if (!success) {
        return res.status(404).json({ error: "Media item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete media item" });
    }
  });

  // Progress routes
  app.get("/api/media/in-progress", async (req, res) => {
    try {
      const items = await storage.getInProgressItems(defaultUserId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch in-progress items" });
    }
  });

  app.post("/api/media/:id/increment", async (req, res) => {
    try {
      const mediaItem = await storage.getMediaItem(req.params.id, defaultUserId);
      if (!mediaItem) {
        return res.status(404).json({ error: "Media item not found" });
      }

      let updates: any = {};
      
      if (mediaItem.type === 'Anime' || mediaItem.type === 'TV Shows') {
        const currentEpisode = mediaItem.episode || 0;
        const currentSeason = mediaItem.season || 1;
        const newEpisode = currentEpisode + 1;
        
        updates = {
          episode: newEpisode,
          season: currentSeason,
          progress: `S${currentSeason}E${newEpisode}`
        };
      } else {
        const currentChapter = mediaItem.chapter || 0;
        const newChapter = currentChapter + 1;
        
        updates = {
          chapter: newChapter,
          progress: `Ch${newChapter}`
        };
      }

      const updatedItem = await storage.updateMediaItem(req.params.id, defaultUserId, updates);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to increment progress" });
    }
  });

  app.post("/api/media/:id/complete", async (req, res) => {
    try {
      const mediaItem = await storage.getMediaItem(req.params.id, defaultUserId);
      if (!mediaItem) {
        return res.status(404).json({ error: "Media item not found" });
      }

      const completedStatus = (mediaItem.type === 'Anime' || mediaItem.type === 'Movies' || mediaItem.type === 'TV Shows') 
        ? 'Watched' 
        : 'Read';

      const updatedItem = await storage.updateMediaItem(req.params.id, defaultUserId, {
        status: completedStatus,
        dateCompleted: new Date()
      });
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark item as complete" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getDetailedStats(defaultUserId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/stats/user", async (req, res) => {
    try {
      const userStats = await storage.getUserStats(defaultUserId);
      res.json(userStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // Search and random routes
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (typeof q !== 'string' || q.trim().length === 0) {
        return res.status(400).json({ error: "Query parameter is required" });
      }
      
      const results = await storage.searchMediaItems(defaultUserId, q.trim());
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search media items" });
    }
  });

  app.get("/api/random", async (req, res) => {
    try {
      const { type, status } = req.query;
      const filters = {
        type: typeof type === 'string' ? type : undefined,
        status: typeof status === 'string' ? status : undefined
      };
      
      const randomItem = await storage.getRandomItem(defaultUserId, filters);
      if (!randomItem) {
        return res.status(404).json({ error: "No items found with the specified filters" });
      }
      
      res.json(randomItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to get random item" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(defaultUserId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Recent items
  app.get("/api/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentItems = await storage.getRecentlyAdded(defaultUserId, limit);
      res.json(recentItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
