import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const mediaItems = pgTable("media_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // Anime, Manhwa, Pornhwa, Novels, Movies, TV Shows
  status: text("status").notNull(), // To Watch/Read, In Progress, Watched/Read, Dropped
  progress: text("progress"),
  season: integer("season"),
  episode: integer("episode"),
  chapter: integer("chapter"),
  totalEpisodes: integer("total_episodes"),
  totalSeasons: integer("total_seasons"),
  totalChapters: integer("total_chapters"),
  genre: text("genre"), // Can store multiple genres as comma-separated values
  notes: text("notes"),
  rating: integer("rating"),
  dateAdded: timestamp("date_added").default(sql`now()`),
  dateCompleted: timestamp("date_completed"),
  timeSpent: integer("time_spent"), // in minutes
  isArchived: boolean("is_archived").default(false),
  imageUrl: text("image_url"), // Cover image URL
  description: text("description"), // Plot/synopsis
  externalId: text("external_id"), // ID from external database (TMDB, AniList, etc.)
  releaseYear: integer("release_year"),
  updatedAt: timestamp("updated_at").default(sql`now()`),
  genres: text("genres").array(), // Array of genres
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // collector, streak, genre_master, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  unlockedAt: timestamp("unlocked_at").default(sql`now()`),
  metadata: jsonb("metadata"), // additional data like count, streak length, etc.
});

export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  totalItems: integer("total_items").default(0),
  completedItems: integer("completed_items").default(0),
  inProgressItems: integer("in_progress_items").default(0),
  plannedItems: integer("planned_items").default(0),
  droppedItems: integer("dropped_items").default(0),
  totalTimeSpent: integer("total_time_spent").default(0), // in minutes
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivity: timestamp("last_activity").default(sql`now()`),
});

// Relations
export const mediaItemsRelations = relations(mediaItems, ({ one }) => ({
  user: one(users, {
    fields: [mediaItems.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  mediaItems: many(mediaItems),
  achievements: many(achievements),
  stats: one(userStats),
}));

// Insert schemas
export const insertMediaItemSchema = createInsertSchema(mediaItems).omit({
  id: true,
  userId: true,
  dateAdded: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  userId: true,
  unlockedAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  userId: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type MediaItem = typeof mediaItems.$inferSelect;
export type InsertMediaItem = z.infer<typeof insertMediaItemSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
