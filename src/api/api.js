const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function getConfiguredStoryIds() {
  const envValue = import.meta.env.VITE_STORY_IDS || import.meta.env.VITE_STORY_ID || '';
  return envValue
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

// Generic handler
async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API Error: ${response.status}${body ? ` - ${body}` : ''}`);
  }
  return response.json();
}

// Fetch stories by IDs configured in VITE_STORY_IDS or VITE_STORY_ID.
export async function fetchStories() {
  const storyIds = getConfiguredStoryIds();
  if (!storyIds.length) {
    return [];
  }

  const stories = await Promise.all(
    storyIds.map(async (id) => {
      const data = await fetchStoryById(id);
      return data?.story || null;
    })
  );

  return stories.filter(Boolean);
}

// Fetch full story payload from backend.
export async function fetchStoryById(id) {
  const res = await fetch(`${BASE_URL}/story/${id}`);
  return handleResponse(res);
}