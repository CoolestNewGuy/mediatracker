import { 
  users, 
  mediaItems, 
  achievements, 
  userStats,
  type User, 
  type InsertUser,
  type MediaItem,
  type InsertMediaItem,
  type Achievement,
  type InsertAchievement,
  type UserStats,
  type InsertUserStats
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Media methods
  getMediaItems(userId: string, filters?: { type?: string; status?: string }): Promise<MediaItem[]>;
  getMediaItem(id: string, userId: string): Promise<MediaItem | undefined>;
  createMediaItem(mediaItem: InsertMediaItem & { userId: string }): Promise<MediaItem>;
  updateMediaItem(id: string, userId: string, updates: Partial<InsertMediaItem>): Promise<MediaItem | undefined>;
  deleteMediaItem(id: string, userId: string): Promise<boolean>;
  getInProgressItems(userId: string): Promise<MediaItem[]>;
  getRecentlyAdded(userId: string, limit?: number): Promise<MediaItem[]>;
  searchMediaItems(userId: string, query: string): Promise<MediaItem[]>;
  getRandomItem(userId: string, filters?: { type?: string; status?: string }): Promise<MediaItem | undefined>;

  // Stats methods
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats>;
  getDetailedStats(userId: string): Promise<any>;
  
  // Achievement methods
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement & { userId: string }): Promise<Achievement>;
  checkAndUnlockAchievements(userId: string): Promise<Achievement[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Create initial user stats
    await db.insert(userStats).values({ userId: user.id });
    
    return user;
  }

  // Media methods
  async getMediaItems(userId: string, filters?: { type?: string; status?: string }): Promise<MediaItem[]> {
    let query = db.select().from(mediaItems).where(
      and(
        eq(mediaItems.userId, userId),
        eq(mediaItems.isArchived, false)
      )
    );

    if (filters?.type && filters.type !== 'all') {
      query = db.select().from(mediaItems).where(
        and(
          eq(mediaItems.userId, userId),
          eq(mediaItems.type, filters.type),
          eq(mediaItems.isArchived, false)
        )
      );
    }

    if (filters?.status && filters.status !== 'all') {
      const statusFilter = filters.status === 'planned' 
        ? ['To Watch', 'To Read']
        : filters.status === 'inprogress' 
        ? ['In Progress']
        : [filters.status];
      
      query = db.select().from(mediaItems).where(
        and(
          eq(mediaItems.userId, userId),
          sql`${mediaItems.status} = ANY(${statusFilter})`,
          eq(mediaItems.isArchived, false),
          ...(filters.type && filters.type !== 'all' ? [eq(mediaItems.type, filters.type)] : [])
        )
      );
    }

    return await query.orderBy(desc(mediaItems.dateAdded));
  }

  async getMediaItem(id: string, userId: string): Promise<MediaItem | undefined> {
    const [item] = await db
      .select()
      .from(mediaItems)
      .where(and(eq(mediaItems.id, id), eq(mediaItems.userId, userId)));
    return item || undefined;
  }

  async createMediaItem(mediaItem: InsertMediaItem & { userId: string }): Promise<MediaItem> {
    const [item] = await db
      .insert(mediaItems)
      .values(mediaItem)
      .returning();
    
    // Update user stats
    await this.updateStatsAfterAction(mediaItem.userId, 'add', mediaItem.status);
    
    // Check for achievements
    await this.checkAndUnlockAchievements(mediaItem.userId);
    
    return item;
  }

  async updateMediaItem(id: string, userId: string, updates: Partial<InsertMediaItem>): Promise<MediaItem | undefined> {
    const [item] = await db
      .update(mediaItems)
      .set(updates)
      .where(and(eq(mediaItems.id, id), eq(mediaItems.userId, userId)))
      .returning();
    
    if (item) {
      await this.updateStatsAfterAction(userId, 'update', item.status);
      await this.checkAndUnlockAchievements(userId);
    }
    
    return item || undefined;
  }

  async deleteMediaItem(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(mediaItems)
      .where(and(eq(mediaItems.id, id), eq(mediaItems.userId, userId)));
    
    if (result.rowCount && result.rowCount > 0) {
      await this.updateStatsAfterAction(userId, 'delete');
      return true;
    }
    return false;
  }

  async getInProgressItems(userId: string): Promise<MediaItem[]> {
    return await db
      .select()
      .from(mediaItems)
      .where(
        and(
          eq(mediaItems.userId, userId),
          eq(mediaItems.status, 'In Progress'),
          eq(mediaItems.isArchived, false)
        )
      )
      .orderBy(desc(mediaItems.dateAdded));
  }

  async getRecentlyAdded(userId: string, limit = 10): Promise<MediaItem[]> {
    return await db
      .select()
      .from(mediaItems)
      .where(and(eq(mediaItems.userId, userId), eq(mediaItems.isArchived, false)))
      .orderBy(desc(mediaItems.dateAdded))
      .limit(limit);
  }

  async searchMediaItems(userId: string, query: string): Promise<MediaItem[]> {
    return await db
      .select()
      .from(mediaItems)
      .where(
        and(
          eq(mediaItems.userId, userId),
          sql`${mediaItems.title} ILIKE ${`%${query}%`}`,
          eq(mediaItems.isArchived, false)
        )
      )
      .orderBy(desc(mediaItems.dateAdded));
  }

  async getRandomItem(userId: string, filters?: { type?: string; status?: string }): Promise<MediaItem | undefined> {
    const items = await this.getMediaItems(userId, filters);
    if (items.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  // Stats methods
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async updateUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats> {
    const [stats] = await db
      .update(userStats)
      .set({ ...updates, lastActivity: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return stats;
  }

  async getDetailedStats(userId: string): Promise<any> {
    const items = await db
      .select()
      .from(mediaItems)
      .where(and(eq(mediaItems.userId, userId), eq(mediaItems.isArchived, false)));

    const stats = {
      total: items.length,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, any>,
      byGenre: {} as Record<string, number>,
      topGenres: [] as any[],
      inProgressCount: 0,
      completedCount: 0,
      recentlyAdded: [] as MediaItem[]
    };

    items.forEach(item => {
      // Status stats
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
      
      // Type stats
      if (!stats.byType[item.type]) {
        stats.byType[item.type] = { total: 0, completed: 0, inProgress: 0, planned: 0, dropped: 0 };
      }
      stats.byType[item.type].total++;
      
      if (item.status === 'Watched' || item.status === 'Read') {
        stats.byType[item.type].completed++;
        stats.completedCount++;
      } else if (item.status === 'In Progress') {
        stats.byType[item.type].inProgress++;
        stats.inProgressCount++;
      } else if (item.status === 'To Watch' || item.status === 'To Read') {
        stats.byType[item.type].planned++;
      } else if (item.status === 'Dropped') {
        stats.byType[item.type].dropped++;
      }

      // Genre stats
      if (item.genre) {
        stats.byGenre[item.genre] = (stats.byGenre[item.genre] || 0) + 1;
      }
    });

    // Convert genres to sorted array
    stats.topGenres = Object.keys(stats.byGenre)
      .map(genre => ({ name: genre, count: stats.byGenre[genre] }))
      .sort((a, b) => b.count - a.count);

    // Get recently added
    stats.recentlyAdded = await this.getRecentlyAdded(userId, 5);

    return stats;
  }

  // Achievement methods
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  async createAchievement(achievement: InsertAchievement & { userId: string }): Promise<Achievement> {
    const [newAchievement] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    const stats = await this.getDetailedStats(userId);
    const existingAchievements = await this.getUserAchievements(userId);
    const existingTypes = existingAchievements.map(a => a.type);
    const newAchievements: Achievement[] = [];

    // Collector achievements
    if (stats.total >= 10 && !existingTypes.includes('collector_10')) {
      const achievement = await this.createAchievement({
        userId,
        type: 'collector_10',
        title: 'Getting Started',
        description: 'Added your first 10 items',
        metadata: { count: stats.total }
      });
      newAchievements.push(achievement);
    }

    if (stats.total >= 50 && !existingTypes.includes('collector_50')) {
      const achievement = await this.createAchievement({
        userId,
        type: 'collector_50',
        title: 'Collector',
        description: 'Added 50 items to your library',
        metadata: { count: stats.total }
      });
      newAchievements.push(achievement);
    }

    if (stats.total >= 100 && !existingTypes.includes('collector_100')) {
      const achievement = await this.createAchievement({
        userId,
        type: 'collector_100',
        title: 'Curator',
        description: 'Added 100 items to your library',
        metadata: { count: stats.total }
      });
      newAchievements.push(achievement);
    }

    // Completion achievements
    if (stats.completedCount >= 10 && !existingTypes.includes('completed_10')) {
      const achievement = await this.createAchievement({
        userId,
        type: 'completed_10',
        title: 'Finisher',
        description: 'Completed your first 10 items',
        metadata: { count: stats.completedCount }
      });
      newAchievements.push(achievement);
    }

    return newAchievements;
  }

  private async updateStatsAfterAction(userId: string, action: 'add' | 'update' | 'delete', status?: string): Promise<void> {
    const stats = await this.getDetailedStats(userId);
    
    await this.updateUserStats(userId, {
      totalItems: stats.total,
      completedItems: stats.completedCount,
      inProgressItems: stats.inProgressCount,
      plannedItems: (stats.byStatus['To Watch'] || 0) + (stats.byStatus['To Read'] || 0),
      droppedItems: stats.byStatus['Dropped'] || 0,
    });
  }
}

export const storage = new DatabaseStorage();
