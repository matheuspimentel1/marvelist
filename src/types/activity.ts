import type {
  Media,
} from "./media";

import type {
  Profile,
} from "./profile";

import type {
  UserMediaStatus,
} from "./userMedia";

export interface Activity {
  id: string;

  user_id: string;
  media_id: string;

  action: UserMediaStatus;

  created_at: string;
}

export interface ActivityFeedItem
  extends Activity {
  profile: Profile;
  media: Media;
}