import { create } from 'zustand';
import { fetchStories, fetchStoryById } from '../api/api';

const CATEGORY_ROOT_LABELS = {
  'cat-corporate': 'Corporate Governance Briefing',
  'cat-markets': 'Markets & Finance Briefing',
  'cat-tech': 'Tech & AI Briefing',
  'cat-geopolitics': 'Global Geopolitics Briefing',
  'cat-climate': 'Climate & Energy Briefing',
  'cat-health': 'Biotech & Health Briefing',
  'cat-consumer': 'Consumer Trends Briefing',
  'cat-media': 'Media & Entertainment Briefing',
};

const isGenericStoryTitle = (title) => {
  const normalized = (title || '').trim().toLowerCase();
  return (
    normalized === '' ||
    normalized === 'auto generated story' ||
    normalized === 'untitled story'
  );
};

const getRootLabel = (categoryId, storyTitle) => {
  if (!isGenericStoryTitle(storyTitle)) {
    return storyTitle;
  }

  return CATEGORY_ROOT_LABELS[categoryId] || 'Story Briefing';
};

const formatTimestamp = (ts) => {
  if (!ts) return 'Unknown';
  const date = new Date(Number(ts) * 1000);
  return Number.isNaN(date.getTime()) ? String(ts) : date.toLocaleString();
};

export const useStoryStore = create((set, get) => ({
  // --- ONE-FLOW NAVIGATION STATES ---
  activeCategoryId: null,   // 1. Which main category is selected
  activeStoryId: null,      // 🔥 NEW: Specifically tracks the root ID for the Graph
  expandedNodes: [],        // 2. IDs of cluster branches that are expanded
  activeLeafId: null,       // 3. The ID of the leaf node (triggers timeline view inline)
  selectedDate: null,       // 4. The specific date clicked on the timeline
  selectedArticle: null,    // 5. The specific article clicked from that date

  // --- API & DATA STATES ---
  stories: [],
  currentStory: null,
  eventDetails: null,
  nodes: [], 
  edges: [], 
  loading: false,
  error: null,

  // --- ACTIONS ---

  // 1. Select a main category to initialize the cluster
  setCategory: (id) => set({ 
    activeCategoryId: id,
    activeStoryId: null,
    expandedNodes: [], // We clear this; the API will set the root node to expand once loaded
    activeLeafId: null,
    selectedDate: null,
    selectedArticle: null,
    currentStory: null,
    eventDetails: null,
    nodes: [],
    edges: []
  }),

  // 2. Click a non-leaf node in the cluster to reveal hidden subtopics
  expandNode: (id) => set((state) => ({
    expandedNodes: state.expandedNodes.includes(id) 
      ? state.expandedNodes 
      : [...state.expandedNodes, id]
  })),

  // 3. Click a leaf node to view its timeline on the canvas
  openLeafTimeline: (id) => set({
    activeLeafId: id,
    selectedDate: null,
    selectedArticle: null
  }),

  // 4. Click a date on the timeline to view all articles from that date
  setSelectedDate: (dateString) => set({
    selectedDate: dateString,
    selectedArticle: null 
  }),

  // 5. Select a specific article to read its full text
  setSelectedArticle: (article) => set({
    selectedArticle: article
  }),

  // 6. Reset everything (e.g., clicking a "Back to Start" button)
  resetAll: () => set({
    activeCategoryId: null,
    activeStoryId: null, // 🔥 Cleared on reset
    expandedNodes: [],
    activeLeafId: null,
    selectedDate: null,
    selectedArticle: null,
    currentStory: null,
    eventDetails: null,
    nodes: [],
    edges: []
  }), 
  
  // 7. Toggle a node open or closed (for the GraphNode clicks)
  toggleNode: (nodeId) => set((state) => {
    // If it's already expanded, collapse it (remove it from the array)
    if (state.expandedNodes.includes(nodeId)) {
      return { expandedNodes: state.expandedNodes.filter(id => id !== nodeId) };
    } 
    // If it's not expanded, expand it (add it to the array)
    return { expandedNodes: [...state.expandedNodes, nodeId] };
  }),

  // --- API ACTIONS ---

  loadStories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchStories();
      if (!data.length) {
        set({ error: 'No stories available yet. Ingest seed data first.' });
      }
      set({ stories: data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  loadStoryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchStoryById(id);
      const story = data?.story;
      const events = Array.isArray(data?.events) ? data.events : [];

      if (!story?.story_id) {
        throw new Error('Invalid story payload from backend');
      }

      const activeCategoryId = get().activeCategoryId;
      const rootLabel = getRootLabel(activeCategoryId, story.title);

      const storyEntities = Array.isArray(story.entities) ? story.entities : [];

      const rootNode = {
        id: story.story_id,
        data: { label: rootLabel, level: 0 },
        position: { x: 0, y: 0 },
        type: 'custom'
      };

      const entityNodes = storyEntities.map((entity, index) => ({
        id: `entity:${entity}`,
        data: { label: entity, level: 1 },
        position: {
          x: Math.cos((index / Math.max(storyEntities.length, 1)) * 2 * Math.PI) * 200,
          y: Math.sin((index / Math.max(storyEntities.length, 1)) * 2 * Math.PI) * 200,
        },
        type: 'custom'
      }));

      const eventNodes = events.map((entry, index) => {
        const event = entry?.event || {};
        const chunks = Array.isArray(entry?.chunks) ? entry.chunks : [];
        return {
          id: event.event_id || `event:${index}`,
          data: {
            label: event.summary || `Event ${index + 1}`,
            level: 2,
            sourceCount: chunks.length,
          },
          position: {
            x: Math.cos((index / Math.max(events.length, 1)) * 2 * Math.PI) * 400,
            y: Math.sin((index / Math.max(events.length, 1)) * 2 * Math.PI) * 400,
          },
          type: 'custom'
        };
      });

      const rootEdges = entityNodes.map((entityNode, i) => ({
        id: `root-${i}`,
        source: story.story_id,
        target: entityNode.id
      }));

      const entitySet = new Set(storyEntities);
      const eventEdges = [];

      events.forEach((entry, i) => {
        const event = entry?.event || {};
        const eventId = event.event_id || `event:${i}`;
        const eventEntities = Array.isArray(event.entities) ? event.entities : [];
        const matched = eventEntities.filter((entity) => entitySet.has(entity));

        if (matched.length) {
          matched.forEach((entity, idx) => {
            eventEdges.push({
              id: `event-${i}-${idx}`,
              source: `entity:${entity}`,
              target: eventId,
            });
          });
          return;
        }

        // If no matching entity edge exists, attach event directly to root.
        eventEdges.push({
          id: `event-root-${i}`,
          source: story.story_id,
          target: eventId,
        });
      });

      const timeline = events.map((entry, i) => {
        const event = entry?.event || {};
        const chunks = Array.isArray(entry?.chunks) ? entry.chunks : [];
        return {
          event_id: event.event_id || `event:${i}`,
          timestamp: event.timestamp,
          title: event.summary || `Event ${i + 1}`,
          summary: `${chunks.length} source article${chunks.length === 1 ? '' : 's'}`,
        };
      });

      set({
        currentStory: {
          ...data,
          timeline,
        },
        activeStoryId: story.story_id,
        nodes: [rootNode, ...entityNodes, ...eventNodes],
        edges: [...rootEdges, ...eventEdges],
        expandedNodes: [story.story_id]
      });

    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  loadEventById: async (eventId) => {
    set({ loading: true, error: null }); 
    try {
      const storyData = get().currentStory;
      const eventEntry = storyData?.events?.find((entry) => entry?.event?.event_id === eventId);

      if (!eventEntry) {
        throw new Error('Event not found in currently loaded story');
      }

      const articles = (eventEntry.chunks || []).map((chunk, idx) => ({
        title: chunk.summary || `Source ${idx + 1}`,
        source: `Source ${idx + 1}`,
        date: formatTimestamp(chunk.timestamp),
        content: chunk.text || chunk.summary || '',
      }));

      set({ eventDetails: { articles } });
    } catch (err) {
      set({ error: err.message });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  }
}));