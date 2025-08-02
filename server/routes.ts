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
      let user = await storage.getUser(DEFAULT_USER_ID);
      
      // Create default user if it doesn't exist
      if (!user) {
        user = await storage.upsertUser({
          id: DEFAULT_USER_ID,
          email: "user@example.com",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: null
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Media routes - specific routes first, then parameterized routes
  app.get("/api/media/in-progress", async (req: any, res) => {
    try {
      const items = await storage.getInProgressItems(DEFAULT_USER_ID);
      res.json(items);
    } catch (error) {
      console.error("Error fetching in-progress items:", error);
      res.status(500).json({ error: "Failed to fetch in-progress items" });
    }
  });

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

  // External media search with real APIs
  app.get("/api/search-external", async (req: any, res) => {
    try {
      const { query, type } = req.query;
      if (!query || !type) {
        return res.status(400).json({ error: "Query and type parameters are required" });
      }

      let results: any[] = [];

      if (type === 'Anime') {
        // AniList GraphQL API (no key needed)
        try {
          const graphqlQuery = `
            query ($search: String) {
              Page(perPage: 5) {
                media(search: $search, type: ANIME) {
                  id
                  title {
                    romaji
                    english
                  }
                  coverImage {
                    large
                  }
                  episodes
                  description
                  genres
                  startDate {
                    year
                  }
                }
              }
            }
          `;

          const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: graphqlQuery,
              variables: { search: query }
            })
          });

          const data = await response.json();
          if (data.data?.Page?.media) {
            results = data.data.Page.media.map((item: any) => ({
              title: item.title.english || item.title.romaji,
              imageUrl: item.coverImage.large,
              description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
              releaseYear: item.startDate?.year,
              genres: item.genres?.slice(0, 3) || [],
              externalId: `anilist_${item.id}`,
              episodes: item.episodes
            }));
          }
        } catch (error) {
          console.error('AniList API error:', error);
        }
      } else if (type === 'Movies' || type === 'TV Shows') {
        // TMDB API - fallback to mock if no API key
        const TMDB_KEY = process.env.TMDB_API_KEY;
        if (TMDB_KEY) {
          try {
            const mediaType = type === 'Movies' ? 'movie' : 'tv';
            const response = await fetch(
              `https://api.themoviedb.org/3/search/${mediaType}?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            
            if (data.results) {
              results = data.results.slice(0, 5).map((item: any) => ({
                title: item.title || item.name,
                imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null,
                description: item.overview,
                releaseYear: item.release_date ? parseInt(item.release_date.split('-')[0]) : 
                           item.first_air_date ? parseInt(item.first_air_date.split('-')[0]) : null,
                genres: [], // Would need additional API call for genres
                externalId: `tmdb_${item.id}`
              }));
            }
          } catch (error) {
            console.error('TMDB API error:', error);
          }
        }
      }

      // Fallback to basic search if no results from APIs
      if (results.length === 0) {
        results = [{
          title: query,
          imageUrl: null,
          description: `Search result for "${query}". Add TMDB_API_KEY to environment for enhanced ${type} search.`,
          releaseYear: new Date().getFullYear(),
          genres: [],
          externalId: `manual_${Date.now()}`
        }];
      }

      res.json(results);
    } catch (error) {
      console.error("External search error:", error);
      res.status(500).json({ error: "Failed to search external databases" });
    }
  });

  // Bulk operations
  app.patch("/api/bulk/update", async (req: any, res) => {
    try {
      const { ids, updates } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'IDs array is required' });
      }
      
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ error: 'Updates object is required' });
      }

      const results = [];
      for (const id of ids) {
        try {
          const item = await storage.getMediaItem(id, DEFAULT_USER_ID);
          if (item) {
            const updatedItem = await storage.updateMediaItem(id, DEFAULT_USER_ID, updates);
            results.push(updatedItem);
          }
        } catch (error) {
          console.error(`Failed to update item ${id}:`, error);
        }
      }

      res.json({ updated: results.length, items: results });
    } catch (error) {
      console.error('Bulk update error:', error);
      res.status(500).json({ error: 'Failed to update items' });
    }
  });

  app.delete("/api/bulk/delete", async (req: any, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'IDs array is required' });
      }

      let deletedCount = 0;
      for (const id of ids) {
        try {
          await storage.deleteMediaItem(id, DEFAULT_USER_ID);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete item ${id}:`, error);
        }
      }

      res.json({ deleted: deletedCount });
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({ error: 'Failed to delete items' });
    }
  });

  // Points and Daily Login routes
  app.post("/api/daily-login", async (req: any, res) => {
    try {
      // Ensure user exists before checking daily login
      let user = await storage.getUser(DEFAULT_USER_ID);
      if (!user) {
        user = await storage.upsertUser({
          id: DEFAULT_USER_ID,
          email: "user@example.com",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: null
        });
      }
      
      const result = await storage.checkAndClaimDailyLogin(DEFAULT_USER_ID);
      res.json(result);
    } catch (error) {
      console.error('Daily login error:', error);
      res.status(500).json({ error: 'Failed to claim daily login' });
    }
  });

  app.get("/api/user/points", async (req: any, res) => {
    try {
      const points = await storage.getUserPoints(DEFAULT_USER_ID);
      res.json({ points });
    } catch (error) {
      console.error('Get points error:', error);
      res.status(500).json({ error: 'Failed to get points' });
    }
  });

  app.patch("/api/user/nickname", async (req: any, res) => {
    try {
      const { nickname } = req.body;
      if (!nickname || nickname.trim().length === 0) {
        return res.status(400).json({ error: 'Nickname is required' });
      }
      const user = await storage.updateUserNickname(DEFAULT_USER_ID, nickname.trim());
      res.json(user);
    } catch (error) {
      console.error('Update nickname error:', error);
      res.status(500).json({ error: 'Failed to update nickname' });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard/:type", async (req: any, res) => {
    try {
      const { type } = req.params;
      const { limit = 10 } = req.query;
      
      if (!['points', 'watched', 'read'].includes(type)) {
        return res.status(400).json({ error: 'Invalid leaderboard type' });
      }
      
      const leaderboard = await storage.getLeaderboard(type as 'points' | 'watched' | 'read', parseInt(limit));
      res.json(leaderboard);
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ error: 'Failed to get leaderboard' });
    }
  });

  // First library use achievement
  app.post("/api/achievements/first-library-use", async (req: any, res) => {
    try {
      const existingAchievements = await storage.getUserAchievements(DEFAULT_USER_ID);
      const hasFirstLibraryUse = existingAchievements.some(a => a.type === 'first_library_use');
      
      if (!hasFirstLibraryUse) {
        const achievement = await storage.createAchievement({
          userId: DEFAULT_USER_ID,
          type: 'first_library_use',
          title: 'Library Explorer',
          description: 'Used the full library for the first time',
          pointsReward: 50
        });
        
        // Add points for the achievement
        await storage.addPoints(DEFAULT_USER_ID, 50);
        
        res.json({ achievement, newlyUnlocked: true });
      } else {
        res.json({ newlyUnlocked: false });
      }
    } catch (error) {
      console.error('First library achievement error:', error);
      res.status(500).json({ error: 'Failed to check achievement' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
