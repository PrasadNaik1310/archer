import { create } from 'zustand';
import { fetchStories, fetchStoryById, fetchEventById } from '../api/api';

export const useStoryStore = create((set) => ({
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
    expandedNodes: [], // We clear this; the API will set the root node to expand once loaded
    activeLeafId: null,
    selectedDate: null,
    selectedArticle: null
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

      // 1. Create ROOT node (category/story root)
      const rootNode = {
        id: data.story_id, 
        data: { label: data.title, level: 0 },
        position: { x: 0, y: 0 },
        type: 'custom'
      };

      // 2. Create entity nodes
      const entityNodes = data.entities.map((e, index) => ({
        id: e,
        data: { label: e, level: 1 },
        position: {
          x: Math.cos((index / data.entities.length) * 2 * Math.PI) * 200,
          y: Math.sin((index / data.entities.length) * 2 * Math.PI) * 200,
        },
        type: 'custom'
      }));

      const nodes = [rootNode, ...entityNodes];

      // 3. Connect root → entities
      const rootEdges = data.entities.map((e, i) => ({
        id: `root-${i}`,
        source: data.story_id,
        target: e
      }));

      // 4. Add relationships
      const relationEdges = data.relationships.map((r, i) => ({
        id: `rel-${i}`,
        source: r.source,
        target: r.target,
        label: r.type
      }));

      set({
        currentStory: data,
        activeStoryId: data.story_id, // 🔥 Set the active story root ID so the graph knows where to start
        nodes,
        edges: [...rootEdges, ...relationEdges],
        expandedNodes: [data.story_id] // Auto-expand the root node
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
      const data = await fetchEventById(eventId);
      set({ eventDetails: data });
    } catch (err) {
      set({ error: err.message });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  }
}));