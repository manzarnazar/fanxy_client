export interface StoryCreator {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface StoryItem {
  id: string;
  type: "image" | "video";
  url: string;
  description: string | null;
  viewCount: number;
  viewed: boolean;
  createdAt: string;
}

export interface StoryNeighbor {
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface StoryBundle {
  creator: StoryCreator;
  stories: StoryItem[];
  prevCreator: StoryNeighbor | null;
  nextCreator: StoryNeighbor | null;
}

/** One creator with active stories, for the /stories index grid. */
export interface StoryGroupSummary {
  creatorId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  storyCount: number;
  allViewed: boolean;
  latestStoryUrl: string | null;
  latestStoryType: "image" | "video";
}
