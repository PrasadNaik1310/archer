const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// Generic handler
async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API Error: ${response.status}${body ? ` - ${body}` : ''}`);
  }
  return response.json();
}

// Fetch all stories from backend.
export async function fetchStories() {
  const res = await fetch(`${BASE_URL}/stories`);
  return handleResponse(res);
}

// Fetch full story payload from backend.
export async function fetchStoryById(id) {
  const res = await fetch(`${BASE_URL}/story/${id}`);
  return handleResponse(res);
}