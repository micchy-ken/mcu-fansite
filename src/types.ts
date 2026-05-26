export interface UserReview {
  watched: boolean;
  rating: number; // 0 to 5 stars
  watchedDate: string; // YYYY-MM-DD
  notes: string;
  isFavorite: boolean;
  updatedAt: string;
}

export type UserReviewsState = Record<string, UserReview>;

export interface FilterState {
  searchQuery: string;
  type: 'all' | 'movie' | 'drama';
  phase: number | 'all';
  importance: 'all' | 3 | 2 | 1;
  watchedStatus: 'all' | 'watched' | 'unwatched' | 'favorite';
}

export type SortOrder = 'release' | 'chrono';
