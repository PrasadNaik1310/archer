import { create } from 'zustand';

export const useStoryStore = create((set) => ({
  // --- ONE-FLOW NAVIGATION STATES ---
  activeCategoryId: null,   // 1. Which main category is selected
  expandedNodes: [],        // 2. IDs of cluster branches that are expanded
  activeLeafId: null,       // 3. The ID of the leaf node (triggers timeline view inline)
  selectedDate: null,       // 4. The specific date clicked on the timeline
  selectedArticle: null,    // 5. The specific article clicked from that date

  // --- ACTIONS ---

  // 1. Select a main category to initialize the cluster
  setCategory: (id) => set({ 
    activeCategoryId: id,
    expandedNodes: [id], // Start with the category node expanded
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
    expandedNodes: [],
    activeLeafId: null,
    selectedDate: null,
    selectedArticle: null
  }), // <--- Added the missing comma right here!
  
  // 7. Toggle a node open or closed (for the GraphNode clicks)
  toggleNode: (nodeId) => set((state) => {
    // If it's already expanded, collapse it (remove it from the array)
    if (state.expandedNodes.includes(nodeId)) {
      return { expandedNodes: state.expandedNodes.filter(id => id !== nodeId) };
    } 
    // If it's not expanded, expand it (add it to the array)
    return { expandedNodes: [...state.expandedNodes, nodeId] };
  })
}));