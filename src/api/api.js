const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generic handler
async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

// 1. Fetch Stories
export async function fetchStories() {
  const res = await fetch(`${BASE_URL}/stories`);
  return handleResponse(res);
}

// 2. Fetch Story by ID
export async function fetchStoryById(id) {
  const res = await fetch(`${BASE_URL}/story/${id}`);
  return handleResponse(res);
}

// 3. Fetch Event by ID
export async function fetchEventById(id) {
  const res = await fetch(`${BASE_URL}/event/${id}`);
  return handleResponse(res);
}