import { create } from 'zustand';

export const useStoryStore = create((set) => ({
  // 1. Canvas State (Where are we on the map?)
  activeNodeId: null,      // Tracks the category or subtopic clicked
  
  // 2. Story State (Is the UI overlay visible?)
  activeStoryId: null,     // If a leaf node (e.g., 'adani-2024') is clicked, this triggers the Timeline/Dashboard to slide in.
  
  // 3. Deep Dive State (Timeline & Entities)
  selectedEvent: null,     // The specific timeline event clicked
  isDrawerOpen: false,     // Controls the right-side detail panel
  activeEntities: [],      // Which entities should glow on the map?

  // Actions
  // Click a category/topic on the canvas to zoom in
  setActiveNode: (nodeId) => set({ activeNodeId: nodeId }), 
  
  // Click a leaf node to open the news story overlays
  openStory: (storyId) => set({ activeStoryId: storyId, activeNodeId: storyId }), 
  
  // Close the story overlays and zoom back out to the canvas
  closeStory: () => set({ activeStoryId: null, selectedEvent: null, isDrawerOpen: false, activeEntities: [] }),

  // Click a timeline event to highlight the graph and open the drawer
  setSelectedEvent: (event) => set({ 
    selectedEvent: event,
    activeEntities: event ? event.entities : [],
    isDrawerOpen: !!event
  }),
  
  // Close the side drawer specifically
  setDrawerOpen: (open) => set({ isDrawerOpen: open })
}));