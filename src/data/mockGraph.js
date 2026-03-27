export const graphData = {
  nodes: [
    // LEVEL 0 (CATEGORY)
    {
      id: 'cat-corp',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { label: 'Corporate Governance', level: 0 }
    },

    // LEVEL 1 (TOPICS)
    {
      id: 'topic-fraud',
      type: 'custom',
      position: { x: -300, y: 200 },
      data: { label: 'Financial Fraud', level: 1, parent: 'cat-corp' }
    },
    {
      id: 'topic-ma',
      type: 'custom',
      position: { x: 300, y: 200 },
      data: { label: 'Mergers & Acquisitions', level: 1, parent: 'cat-corp' }
    },

    // LEVEL 2 (SUBTOPICS / LEAF)
    {
      id: 'adani',
      type: 'custom',
      position: { x: -500, y: 400 },
      data: {
        label: 'Adani Case',
        level: 2,
        parent: 'topic-fraud',
        isLeaf: true
      }
    }
  ],

  edges: [
    { id: 'e1', source: 'cat-corp', target: 'topic-fraud' },
    { id: 'e2', source: 'cat-corp', target: 'topic-ma' },
    { id: 'e3', source: 'topic-fraud', target: 'adani' }
  ]
};