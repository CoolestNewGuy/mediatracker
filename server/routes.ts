import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMediaItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Use a default user ID since we removed authentication
  const DEFAULT_USER_ID = "default-user";

  // Auth routes (simplified without authentication)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const user = await storage.getUser(DEFAULT_USER_ID);
      res.json(user || { id: DEFAULT_USER_ID, email: "user@example.com" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Media routes
  app.get("/api/media", async (req: any, res) => {
    try {
      const { type, status } = req.query;
      const filters = {
        type: typeof type === 'string' ? type : undefined,
        status: typeof status === 'string' ? status : undefined
      };
      
      const mediaItems = await storage.getMediaItems(DEFAULT_USER_ID, filters);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media items" });
    }
  });

  app.get("/api/media/:id", async (req: any, res) => {
    try {
      const mediaItem = await storage.getMediaItem(req.params.id, DEFAULT_USER_ID);
      if (!mediaItem) {
        return res.status(404).json({ error: "Media item not found" });
      }
      res.json(mediaItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media item" });
    }
  });

  app.post("/api/media", async (req: any, res) => {
    try {
      const validatedData = insertMediaItemSchema.parse(req.body);
      const mediaItem = await storage.createMediaItem({
        ...validatedData,
        userId: DEFAULT_USER_ID
      });
      res.status(201).json(mediaItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create media item" });
    }
  });

  app.patch("/api/media/:id", async (req: any, res) => {
    try {
      const updates = insertMediaItemSchema.partial().parse(req.body);
      const mediaItem = await storage.updateMediaItem(req.params.id, DEFAULT_USER_ID, updates);
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

  app.delete("/api/media/:id", async (req: any, res) => {
    try {
      const success = await storage.deleteMediaItem(req.params.id, DEFAULT_USER_ID);
      if (!success) {
        return res.status(404).json({ error: "Media item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete media item" });
    }
  });

  // Progress routes
  app.get("/api/media/in-progress", async (req: any, res) => {
    try {
      const items = await storage.getInProgressItems(DEFAULT_USER_ID);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch in-progress items" });
    }
  });

  app.post("/api/media/:id/increment", async (req: any, res) => {
    try {
      const mediaItem = await storage.getMediaItem(req.params.id, DEFAULT_USER_ID);
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

      const updatedItem = await storage.updateMediaItem(req.params.id, DEFAULT_USER_ID, updates);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to increment progress" });
    }
  });

  app.post("/api/media/:id/complete", async (req: any, res) => {
    try {
      const mediaItem = await storage.getMediaItem(req.params.id, DEFAULT_USER_ID);
      if (!mediaItem) {
        return res.status(404).json({ error: "Media item not found" });
      }

      const completedStatus = (mediaItem.type === 'Anime' || mediaItem.type === 'Movies' || mediaItem.type === 'TV Shows') 
        ? 'Watched' 
        : 'Read';

      const updatedItem = await storage.updateMediaItem(req.params.id, DEFAULT_USER_ID, {
        status: completedStatus,
        dateCompleted: new Date()
      });
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark item as complete" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req: any, res) => {
    try {
      const stats = await storage.getDetailedStats(DEFAULT_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/stats/user", async (req: any, res) => {
    try {
      const userStats = await storage.getUserStats(DEFAULT_USER_ID);
      res.json(userStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // Search and random routes
  app.get("/api/search", async (req: any, res) => {
    try {
      const { q } = req.query;
      if (typeof q !== 'string' || q.trim().length === 0) {
        return res.status(400).json({ error: "Query parameter is required" });
      }
      
      const results = await storage.searchMediaItems(DEFAULT_USER_ID, q.trim());
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search media items" });
    }
  });

  app.get("/api/random", async (req: any, res) => {
    try {
      const { type, status } = req.query;
      const filters = {
        type: typeof type === 'string' ? type : undefined,
        status: typeof status === 'string' ? status : undefined
      };
      
      const randomItem = await storage.getRandomItem(DEFAULT_USER_ID, filters);
      if (!randomItem) {
        return res.status(404).json({ error: "No items found with the specified filters" });
      }
      
      res.json(randomItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to get random item" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req: any, res) => {
    try {
      const achievements = await storage.getUserAchievements(DEFAULT_USER_ID);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Recent items
  app.get("/api/recent", async (req: any, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentItems = await storage.getRecentlyAdded(DEFAULT_USER_ID, limit);
      res.json(recentItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent items" });
    }
  });

  // External media search
  app.get("/api/search-external", async (req: any, res) => {
    try {
      const { query, type } = req.query;
      if (!query || !type) {
        return res.status(400).json({ error: "Query and type parameters are required" });
      }

      let results: any[] = [];

      // Mock external API responses for now (in production, you'd use real APIs)
      // This simulates TMDB, AniList, or other media databases
      if (type === 'Movies' || type === 'TV Shows') {
        // Simulate TMDB API response
        results = [
          {
            id: `tmdb_${Math.random()}`,
            title: `${query} - Sample Movie`,
            imageUrl: `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(query)}`,
            description: "This is a sample movie description that would come from TMDB API. In production, this would be real data from The Movie Database.",
            releaseYear: 2023,
            genres: ['Action', 'Adventure', 'Sci-Fi'],
            externalId: `tmdb_123456`
          },
          {
            id: `tmdb_${Math.random()}`,
            title: `${query} 2: The Sequel`,
            imageUrl: `https://via.placeholder.com/300x450/444/fff?text=${encodeURIComponent(query + '2')}`,
            description: "Another sample movie that matches your search. Real implementation would fetch from TMDB.",
            releaseYear: 2024,
            genres: ['Drama', 'Thriller'],
            externalId: `tmdb_789012`
          }
        ];
      } else if (type === 'Anime') {
        // Simulate AniList API response
        results = [
          {
            id: `anilist_${Math.random()}`,
            title: `${query} - Anime Series`,
            imageUrl: `https://via.placeholder.com/300x450/555/fff?text=${encodeURIComponent(query)}`,
            description: "Sample anime description from AniList API. Would contain real plot synopsis in production.",
            releaseYear: 2023,
            genres: ['Action', 'Supernatural', 'Shounen'],
            externalId: `anilist_54321`
          }
        ];
      } else if (type === 'Manhwa' || type === 'Novels') {
        // Simulate manga/novel database response
        results = [
          {
            id: `manga_${Math.random()}`,
            title: `${query} - Manhwa/Novel`,
            imageUrl: `https://via.placeholder.com/300x450/666/fff?text=${encodeURIComponent(query)}`,
            description: "Sample manhwa/novel description. In production, this would come from MangaDex or similar APIs.",
            releaseYear: 2022,
            genres: ['Romance', 'Fantasy', 'Slice of Life'],
            externalId: `manga_98765`
          }
        ];
      }

      // Filter results based on query similarity (basic implementation)
      const filteredResults = results.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase())
      );

      res.json(filteredResults);
    } catch (error) {
      console.error("External search error:", error);
      res.status(500).json({ error: "Failed to search external databases" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
