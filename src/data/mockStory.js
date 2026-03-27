// ==========================================
// PART 1: THE INFINITE CANVAS MAP (Nodes & Edges)
// ==========================================
export const canvasNodes = [
  // Level 1: Categories
  { id: 'cat-corporate', position: { x: 0, y: 0 }, data: { label: 'Corporate Governance', type: 'category' } },
  { id: 'cat-markets', position: { x: 0, y: 600 }, data: { label: 'Markets & Finance', type: 'category' } },
  { id: 'cat-startups', position: { x: 800, y: 0 }, data: { label: 'Startups & Tech', type: 'category' } },

  // Level 2: Subtopics
  { id: 'sub-fraud', position: { x: -300, y: 200 }, data: { label: 'Financial Irregularities', type: 'topic' } },
  { id: 'sub-regulatory', position: { x: 300, y: 200 }, data: { label: 'Regulatory Crackdowns', type: 'topic' } },

  // Level 3: Leaf Nodes (Stories)
  { id: 'node-adani', position: { x: -450, y: 400 }, data: { label: 'The Adani-Hindenburg Saga', type: 'story', isStory: true, storyId: 'adani-2024' } },
  { id: 'node-paytm', position: { x: 450, y: 400 }, data: { label: 'The Paytm RBI Ban', type: 'story', isStory: true, storyId: 'paytm-2024' } },
];

export const canvasEdges = [
  // Connecting Categories to Subtopics
  { id: 'e-corp-fraud', source: 'cat-corporate', target: 'sub-fraud', animated: true },
  { id: 'e-corp-reg', source: 'cat-corporate', target: 'sub-regulatory', animated: true },
  
  // Connecting Subtopics to Stories
  { id: 'e-fraud-adani', source: 'sub-fraud', target: 'node-adani' },
  { id: 'e-reg-paytm', source: 'sub-regulatory', target: 'node-paytm' },
];

// ==========================================
// PART 2: THE STORY OVERLAY DATABASE
// ==========================================
// This data ONLY loads when a user clicks a leaf node (like 'node-adani').

export const storyDatabase = {
  "adani-2024": {
    id: "adani-2024",
    title: "Adani Group: The Recovery Arc",
    description: "Analyzing the shift from the Hindenburg short-seller report to regulatory pivots and capital recovery.",
    sentimentTrend: [
      { date: 'Jan 23', sentiment: -85 },
      { date: 'May 23', sentiment: -40 },
      { date: 'Aug 23', sentiment: -10 },
      { date: 'Jan 24', sentiment: 30 },
      { date: 'Mar 24', sentiment: 55 },
    ],
    timeline: [
      {
        id: "ev-1",
        timestamp: "Jan 24, 2023",
        title: "Hindenburg Report Released",
        summary: "Short-seller report triggers massive sell-off in Adani stocks.",
        entities: ["Adani Group", "Hindenburg"],
        sentiment: "negative",
        impactScore: 98
      },
      {
        id: "ev-2",
        timestamp: "May 19, 2023",
        title: "SC Panel Interim Report",
        summary: "Supreme Court panel finds no prima facie evidence of manipulation.",
        entities: ["SEBI", "Adani Group"],
        sentiment: "positive",
        impactScore: 75
      }
    ],
    // This is the inner Entity Graph that shows up on the right side of the screen
    nodes: [
      { id: '1', type: 'entity', data: { label: 'Adani Group', type: 'company' }, position: { x: 250, y: 50 } },
      { id: '2', type: 'entity', data: { label: 'Gautam Adani', type: 'person' }, position: { x: 250, y: 200 } },
      { id: '3', type: 'entity', data: { label: 'Hindenburg', type: 'org' }, position: { x: 50, y: 125 } },
      { id: '4', type: 'entity', data: { label: 'SEBI', type: 'regulator' }, position: { x: 450, y: 125 } },
    ],
    edges: [
      { id: 'e3-1', source: '3', target: '1', label: 'ACCUSED', animated: true },
      { id: 'e2-1', source: '2', target: '1', label: 'LEADS' },
      { id: 'e4-1', source: '4', target: '1', label: 'PROBES' },
    ],
    predictions: [
      { title: "Verdict Q3", desc: "Legal clearance likely by late September." },
      { title: "Refinancing", desc: "Expect $2.5B bond issue in Singapore." }
    ]
  },

  "paytm-2024": {
    id: "paytm-2024",
    title: "The Paytm Regulatory Crisis",
    description: "RBI's crackdown on Paytm Payments Bank and the subsequent scramble for compliance and survival.",
    sentimentTrend: [
      { date: 'Dec 23', sentiment: 20 },
      { date: 'Jan 31', sentiment: -95 },
      { date: 'Feb 15', sentiment: -60 },
      { date: 'Mar 15', sentiment: -20 },
    ],
    timeline: [
      {
        id: "ev-p1",
        timestamp: "Jan 31, 2024",
        title: "RBI Bans Paytm Payments Bank",
        summary: "Central bank orders PPBL to halt mostly all deposits and credit transactions.",
        entities: ["Paytm", "RBI"],
        sentiment: "negative",
        impactScore: 100
      },
      {
        id: "ev-p2",
        timestamp: "Mar 14, 2024",
        title: "NPCI Grants TPAP License",
        summary: "Paytm receives Third-Party Application Provider license to continue UPI operations.",
        entities: ["Paytm", "NPCI"],
        sentiment: "positive",
        impactScore: 80
      }
    ],
    nodes: [
      { id: 'p1', type: 'entity', data: { label: 'Paytm', type: 'company' }, position: { x: 250, y: 50 } },
      { id: 'p2', type: 'entity', data: { label: 'RBI', type: 'regulator' }, position: { x: 50, y: 150 } },
      { id: 'p3', type: 'entity', data: { label: 'NPCI', type: 'org' }, position: { x: 450, y: 150 } },
    ],
    edges: [
      { id: 'ep-1', source: 'p2', target: 'p1', label: 'BANNED', animated: true },
      { id: 'ep-2', source: 'p3', target: 'p1', label: 'LICENSED' },
    ],
    predictions: [
      { title: "Market Share Loss", desc: "Expected 15% drop in UPI market share to PhonePe." },
      { title: "Merger Rumors", desc: "Potential acquisition of wallet business by competitors." }
    ]
  }
};