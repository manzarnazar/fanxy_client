import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiStoryGroup, ApiStoryItem } from "@/types/api/story.types";
import type { StoryBundle, StoryGroupSummary, StoryItem } from "@/features/story-view/types/story-view.types";

/** The backend returns user_name WITH the "@" prefix ("@bharat420") — URLs and matching use the bare name. */
export function normalizeUsername(userName: string): string {
  return userName.replace(/^@+/, "");
}

function mapStoryItem(item: ApiStoryItem): StoryItem | null {
  // A story whose media path is corrupted server-side can't render — drop it.
  const url = sanitizeMediaUrl(item.url);
  if (!url) return null;
  return {
    id: String(item.id),
    type: item.type === "video" ? "video" : "image",
    url,
    description: item.description,
    viewCount: item.total_view,
    viewed: item.is_view === 1,
    createdAt: item.created_at,
  };
}

/** Groups with no (renderable) stories are dropped everywhere — the API includes empty groups. */
function groupsWithStories(groups: ApiStoryGroup[]): Array<{ group: ApiStoryGroup; stories: StoryItem[] }> {
  return groups.flatMap((group) => {
    const stories = group.story.map(mapStoryItem).filter((item): item is StoryItem => item !== null);
    return stories.length > 0 ? [{ group, stories }] : [];
  });
}

export function mapStoryGroupSummaries(groups: ApiStoryGroup[]): StoryGroupSummary[] {
  return groupsWithStories(groups).map(({ group, stories }) => ({
    creatorId: String(group.user_id),
    username: normalizeUsername(group.user_name),
    name: group.full_name,
    avatarUrl: sanitizeMediaUrl(group.user_image),
    storyCount: stories.length,
    allViewed: stories.every((story) => story.viewed),
    latestStoryUrl: stories[0]?.url ?? null,
    latestStoryType: stories[0]?.type ?? "image",
  }));
}

// The real backend has no per-username story fetch — it returns every
// creator's story group in one list, and the client finds the matching
// group and derives prev/next neighbors from surrounding positions.
export function buildStoryBundle(groups: ApiStoryGroup[], username: string): StoryBundle | null {
  const target = normalizeUsername(decodeURIComponent(username));
  const populated = groupsWithStories(groups);
  const index = populated.findIndex(({ group }) => normalizeUsername(group.user_name) === target);
  if (index === -1) return null;

  const { group, stories } = populated[index];
  const prev = index > 0 ? populated[index - 1].group : null;
  const next = index < populated.length - 1 ? populated[index + 1].group : null;

  return {
    creator: {
      id: String(group.user_id),
      username: normalizeUsername(group.user_name),
      name: group.full_name,
      avatarUrl: sanitizeMediaUrl(group.user_image),
    },
    stories,
    prevCreator: prev
      ? { username: normalizeUsername(prev.user_name), name: prev.full_name, avatarUrl: sanitizeMediaUrl(prev.user_image) }
      : null,
    nextCreator: next
      ? { username: normalizeUsername(next.user_name), name: next.full_name, avatarUrl: sanitizeMediaUrl(next.user_image) }
      : null,
  };
}
