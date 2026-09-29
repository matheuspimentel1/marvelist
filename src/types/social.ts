export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface FollowCounts {
  followers: number;
  following: number;
}