// ==========================================
// PART 1: THE CLUSTER MAP (Nodes & Edges)
// ==========================================

export const canvasNodes = [
  // -----------------------------------------------------------------
  // LEVEL 0: CATEGORY HUBS (The 3 Main Starting Points)
  // -----------------------------------------------------------------
  { id: 'cat-corporate', type: 'custom', data: { label: 'Corporate Governance', level: 0 } },
  { id: 'cat-markets', type: 'custom', data: { label: 'Markets & Finance', level: 0 } },
  { id: 'cat-tech', type: 'custom', data: { label: 'Tech & AI', level: 0 } },

  // -----------------------------------------------------------------
  // LEVEL 1: TOPIC CLUSTERS 
  // -----------------------------------------------------------------
  // Under Corporate Governance
  { id: 't-fraud', type: 'custom', data: { label: 'Financial Fraud', level: 1, parent: 'cat-corporate' } },
  { id: 't-board', type: 'custom', data: { label: 'Board Conflicts', level: 1, parent: 'cat-corporate' } },
  { id: 't-reg', type: 'custom', data: { label: 'Regulatory Shifts', level: 1, parent: 'cat-corporate' } },
  { id: 't-esg', type: 'custom', data: { label: 'ESG Compliance', level: 1, parent: 'cat-corporate' } },

  // Under Markets & Finance
  { id: 't-crypto', type: 'custom', data: { label: 'Crypto Assets', level: 1, parent: 'cat-markets' } },
  { id: 't-ipo', type: 'custom', data: { label: 'IPO Landscape', level: 1, parent: 'cat-markets' } },
  { id: 't-macro', type: 'custom', data: { label: 'Macro Inflation', level: 1, parent: 'cat-markets' } },

  // Under Tech & AI
  { id: 't-genai', type: 'custom', data: { label: 'Generative AI', level: 1, parent: 'cat-tech' } },
  { id: 't-chips', type: 'custom', data: { label: 'Semiconductors', level: 1, parent: 'cat-tech' } },
  { id: 't-cyber', type: 'custom', data: { label: 'Cyber Warfare', level: 1, parent: 'cat-tech' } },
  { id: 't-space', type: 'custom', data: { label: 'Space Economy', level: 1, parent: 'cat-tech' } },

  // -----------------------------------------------------------------
  // LEVEL 2: LEAF STORIES (The Clickable Timelines)
  // -----------------------------------------------------------------
  
  // ---> Fraud Stories
  { id: 's-adani', type: 'custom', data: { label: 'Adani Hindenburg Saga', level: 2, isLeaf: true, parent: 't-fraud', sourceCount: 48 } },
  { id: 's-wirecard', type: 'custom', data: { label: 'Wirecard Collapse', level: 2, isLeaf: true, parent: 't-fraud', sourceCount: 112 } },
  { id: 's-evergrande', type: 'custom', data: { label: 'Evergrande Liquidation', level: 2, isLeaf: true, parent: 't-fraud', sourceCount: 89 } },

  // ---> Board Conflict Stories
  { id: 's-openai', type: 'custom', data: { label: 'OpenAI Board Coup', level: 2, isLeaf: true, parent: 't-board', sourceCount: 205 } },
  { id: 's-disney', type: 'custom', data: { label: 'Disney Proxy Fight', level: 2, isLeaf: true, parent: 't-board', sourceCount: 64 } },
  { id: 's-starbucks', type: 'custom', data: { label: 'Starbucks Union Clash', level: 2, isLeaf: true, parent: 't-board', sourceCount: 32 } },

  // ---> Regulatory Stories
  { id: 's-paytm', type: 'custom', data: { label: 'Paytm RBI Ban', level: 2, isLeaf: true, parent: 't-reg', sourceCount: 76 } },
  { id: 's-binance', type: 'custom', data: { label: 'Binance DOJ Settlement', level: 2, isLeaf: true, parent: 't-reg', sourceCount: 140 } },

  // ---> Crypto Stories
  { id: 's-ftx', type: 'custom', data: { label: 'FTX Bankruptcy', level: 2, isLeaf: true, parent: 't-crypto', sourceCount: 310 } },
  { id: 's-etf', type: 'custom', data: { label: 'Bitcoin ETF Approval', level: 2, isLeaf: true, parent: 't-crypto', sourceCount: 185 } },

  // ---> Gen AI Stories
  { id: 's-sora', type: 'custom', data: { label: 'Sora Video Launch', level: 2, isLeaf: true, parent: 't-genai', sourceCount: 94 } },
  { id: 's-gemini', type: 'custom', data: { label: 'Gemini Pro Rollout', level: 2, isLeaf: true, parent: 't-genai', sourceCount: 120 } },
  { id: 's-nyt', type: 'custom', data: { label: 'NYT vs OpenAI Lawsuit', level: 2, isLeaf: true, parent: 't-genai', sourceCount: 88 } },

  // ---> Semiconductor Stories
  { id: 's-nvidia', type: 'custom', data: { label: 'Nvidia $2T Valuation', level: 2, isLeaf: true, parent: 't-chips', sourceCount: 250 } },
  { id: 's-tsmc', type: 'custom', data: { label: 'TSMC Arizona Delay', level: 2, isLeaf: true, parent: 't-chips', sourceCount: 45 } },
  { id: 's-arm', type: 'custom', data: { label: 'ARM Architecture Shift', level: 2, isLeaf: true, parent: 't-chips', sourceCount: 60 } },
];

export const canvasEdges = [
  // Connect Corporate Hub to Topics
  { id: 'e-c-f', source: 'cat-corporate', target: 't-fraud' },
  { id: 'e-c-b', source: 'cat-corporate', target: 't-board' },
  { id: 'e-c-r', source: 'cat-corporate', target: 't-reg' },
  { id: 'e-c-e', source: 'cat-corporate', target: 't-esg' },

  // Connect Markets Hub to Topics
  { id: 'e-m-c', source: 'cat-markets', target: 't-crypto' },
  { id: 'e-m-i', source: 'cat-markets', target: 't-ipo' },
  { id: 'e-m-m', source: 'cat-markets', target: 't-macro' },

  // Connect Tech Hub to Topics
  { id: 'e-t-g', source: 'cat-tech', target: 't-genai' },
  { id: 'e-t-c', source: 'cat-tech', target: 't-chips' },
  { id: 'e-t-cy', source: 'cat-tech', target: 't-cyber' },
  { id: 'e-t-s', source: 'cat-tech', target: 't-space' },

  // Connect Topics to Leaf Stories
  { id: 'es-f-a', source: 't-fraud', target: 's-adani' },
  { id: 'es-f-w', source: 't-fraud', target: 's-wirecard' },
  { id: 'es-f-e', source: 't-fraud', target: 's-evergrande' },

  { id: 'es-b-o', source: 't-board', target: 's-openai' },
  { id: 'es-b-d', source: 't-board', target: 's-disney' },
  { id: 'es-b-s', source: 't-board', target: 's-starbucks' },

  { id: 'es-r-p', source: 't-reg', target: 's-paytm' },
  { id: 'es-r-b', source: 't-reg', target: 's-binance' },

  { id: 'es-c-f', source: 't-crypto', target: 's-ftx' },
  { id: 'es-c-e', source: 't-crypto', target: 's-etf' },

  { id: 'es-g-s', source: 't-genai', target: 's-sora' },
  { id: 'es-g-g', source: 't-genai', target: 's-gemini' },
  { id: 'es-g-n', source: 't-genai', target: 's-nyt' },

  { id: 'es-ch-n', source: 't-chips', target: 's-nvidia' },
  { id: 'es-ch-t', source: 't-chips', target: 's-tsmc' },
  { id: 'es-ch-a', source: 't-chips', target: 's-arm' },
];

// ==========================================
// PART 2: THE TIMELINE DATABASE
// ==========================================
// This maps the Leaf IDs above to actual chronological events.

export const storyDatabase = {
  "s-adani": {
    timeline: [
      { id: 'ev1', timestamp: 'Jan 24, 2024', title: 'Hindenburg Report Released', summary: 'Short-seller report alleges stock manipulation, wiping out billions in market cap.' },
      { id: 'ev2', timestamp: 'Feb 15, 2024', title: 'Regulatory Probe Initiated', summary: 'SEBI begins an official investigation into the corporate structure.' },
      { id: 'ev3', timestamp: 'Mar 10, 2024', title: 'GQG Partners Investment', summary: 'Major institutional backer buys $1.8B stake, signaling market confidence.' }
    ]
  },
  "s-openai": {
    timeline: [
      { id: 'o1', timestamp: 'Nov 17, 2023', title: 'Sam Altman Ousted', summary: 'The non-profit board unexpectedly fires the CEO via a Google Meet call.' },
      { id: 'o2', timestamp: 'Nov 19, 2023', title: 'Microsoft Intervenes', summary: 'Satya Nadella offers to hire Altman and all resigning OpenAI staff.' },
      { id: 'o3', timestamp: 'Nov 22, 2023', title: 'Altman Reinstated', summary: 'Following a massive employee revolt, the board is restructured and Altman returns.' }
    ]
  },
  "s-nvidia": {
    timeline: [
      { id: 'n1', timestamp: 'May 24, 2023', title: 'The $1 Trillion Milestone', summary: 'Nvidia briefly touches $1T market cap fueled by AI chip demand.' },
      { id: 'n2', timestamp: 'Feb 21, 2024', title: 'Blowout Q4 Earnings', summary: 'Revenue up 265% year-over-year, destroying Wall Street estimates.' },
      { id: 'n3', timestamp: 'Mar 01, 2024', title: 'Crossing $2 Trillion', summary: 'Stock surges past $2T, making it the third most valuable US company.' }
    ]
  }
};