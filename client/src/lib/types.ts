export interface MediaStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, {
    total: number;
    completed: number;
    inProgress: number;
    planned: number;
    dropped: number;
  }>;
  byGenre: Record<string, number>;
  topGenres: Array<{ name: string; count: number }>;
  inProgressCount: number;
  completedCount: number;
  recentlyAdded: any[];
}

export interface MediaFilters {
  type?: string;
  status?: string;
  genre?: string;
}

export interface QuickUpdateItem {
  id: string;
  title: string;
  type: string;
  currentProgress?: string;
  progress?: string;
  episode?: number;
  chapter?: number;
  season?: number;
}
