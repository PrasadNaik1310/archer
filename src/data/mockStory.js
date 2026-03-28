// ==========================================
// PART 1: THE CLUSTER MAP (Nodes & Edges)
// ==========================================

export const canvasNodes = [
  // LEVEL 0
  { id: 'cat-corporate', type: 'custom', data: { label: 'Corporate Governance', level: 0 } },
  { id: 'cat-markets', type: 'custom', data: { label: 'Markets & Finance', level: 0 } },
  { id: 'cat-tech', type: 'custom', data: { label: 'Tech & AI', level: 0 } },

  // LEVEL 1
  { id: 't-fraud', type: 'custom', data: { label: 'Financial Fraud', level: 1, parent: 'cat-corporate' } },
  { id: 't-board', type: 'custom', data: { label: 'Board Conflicts', level: 1, parent: 'cat-corporate' } },
  { id: 't-reg', type: 'custom', data: { label: 'Regulatory Shifts', level: 1, parent: 'cat-corporate' } },
  { id: 't-esg', type: 'custom', data: { label: 'ESG Compliance', level: 1, parent: 'cat-corporate' } },

  { id: 't-crypto', type: 'custom', data: { label: 'Crypto Assets', level: 1, parent: 'cat-markets' } },
  { id: 't-ipo', type: 'custom', data: { label: 'IPO Landscape', level: 1, parent: 'cat-markets' } },
  { id: 't-macro', type: 'custom', data: { label: 'Macro Inflation', level: 1, parent: 'cat-markets' } },

  { id: 't-genai', type: 'custom', data: { label: 'Generative AI', level: 1 } },
  { id: 't-chips', type: 'custom', data: { label: 'Semiconductors', level: 1, parent: 'cat-tech' } },
  { id: 't-cyber', type: 'custom', data: { label: 'Cyber Warfare', level: 1, parent: 'cat-tech' } },
  { id: 't-space', type: 'custom', data: { label: 'Space Economy', level: 1, parent: 'cat-tech' } },

  // LEVEL 2 (Subtopics)
  { id: 't-llms', type: 'custom', data: { label: 'Large Language Models', level: 2 } }, 

  // LEVEL 2 & 3 (Leaf Stories - Notice we don't need isLeaf: true anymore!)
  { id: 's-gpt4', type: 'custom', data: { label: 'GPT-4 Release', level: 3, sourceCount: 150 } }, 
  { id: 's-adani', type: 'custom', data: { label: 'Adani Hindenburg Saga', level: 2, parent: 't-fraud', sourceCount: 48 } },
  { id: 's-wirecard', type: 'custom', data: { label: 'Wirecard Collapse', level: 2, parent: 't-fraud', sourceCount: 112 } },
  { id: 's-evergrande', type: 'custom', data: { label: 'Evergrande Liquidation', level: 2, parent: 't-fraud', sourceCount: 89 } },
  { id: 's-openai', type: 'custom', data: { label: 'OpenAI Board Coup', level: 2, parent: 't-board', sourceCount: 205 } },
  { id: 's-disney', type: 'custom', data: { label: 'Disney Proxy Fight', level: 2, parent: 't-board', sourceCount: 64 } },
  { id: 's-starbucks', type: 'custom', data: { label: 'Starbucks Union Clash', level: 2, parent: 't-board', sourceCount: 32 } },
  { id: 's-paytm', type: 'custom', data: { label: 'Paytm RBI Ban', level: 2, parent: 't-reg', sourceCount: 76 } },
  { id: 's-binance', type: 'custom', data: { label: 'Binance DOJ Settlement', level: 2, parent: 't-reg', sourceCount: 140 } },
  { id: 's-ftx', type: 'custom', data: { label: 'FTX Bankruptcy', level: 2, parent: 't-crypto', sourceCount: 310 } },
  { id: 's-etf', type: 'custom', data: { label: 'Bitcoin ETF Approval', level: 2, parent: 't-crypto', sourceCount: 185 } },
  { id: 's-sora', type: 'custom', data: { label: 'Sora Video Launch', level: 2, parent: 't-genai', sourceCount: 94 } },
  { id: 's-gemini', type: 'custom', data: { label: 'Gemini Pro Rollout', level: 2, parent: 't-genai', sourceCount: 120 } },
  { id: 's-nyt', type: 'custom', data: { label: 'NYT vs OpenAI Lawsuit', level: 2, parent: 't-genai', sourceCount: 88 } },
  { id: 's-nvidia', type: 'custom', data: { label: 'Nvidia $2T Valuation', level: 2, parent: 't-chips', sourceCount: 250 } },
  { id: 's-tsmc', type: 'custom', data: { label: 'TSMC Arizona Delay', level: 2, parent: 't-chips', sourceCount: 45 } },
  { id: 's-arm', type: 'custom', data: { label: 'ARM Architecture Shift', level: 2, parent: 't-chips', sourceCount: 60 } },
  { id: 's-luckin', type: 'custom', data: { label: 'Luckin Coffee Fraud', level: 2, parent: 't-fraud', sourceCount: 77 } },
  { id: 's-nirav', type: 'custom', data: { label: 'Nirav Modi Scam', level: 2, parent: 't-fraud', sourceCount: 134 } },
  { id: 's-shell', type: 'custom', data: { label: 'Shell Climate Case', level: 2, parent: 't-esg', sourceCount: 58 } },
  { id: 's-tesla-esg', type: 'custom', data: { label: 'Tesla ESG Removal', level: 2, parent: 't-esg', sourceCount: 40 } },
  { id: 's-ola-ipo', type: 'custom', data: { label: 'Ola Electric IPO', level: 2, parent: 't-ipo', sourceCount: 29 } },
  { id: 's-reddit-ipo', type: 'custom', data: { label: 'Reddit IPO Surge', level: 2, parent: 't-ipo', sourceCount: 61 } },
  { id: 's-fed-rate', type: 'custom', data: { label: 'Fed Rate Hikes', level: 2, parent: 't-macro', sourceCount: 180 } },
  { id: 's-inflation-india', type: 'custom', data: { label: 'India Inflation Cycle', level: 2, parent: 't-macro', sourceCount: 92 } },
  { id: 's-russia-cyber', type: 'custom', data: { label: 'Russia Cyber Ops', level: 2, parent: 't-cyber', sourceCount: 110 } },
  { id: 's-solarwinds', type: 'custom', data: { label: 'SolarWinds Hack', level: 2, parent: 't-cyber', sourceCount: 140 } },
  { id: 's-spacex', type: 'custom', data: { label: 'Starship Launches', level: 2, parent: 't-space', sourceCount: 75 } },
  { id: 's-isro', type: 'custom', data: { label: 'ISRO Moon Mission', level: 2, parent: 't-space', sourceCount: 65 } },
];

export const canvasEdges = [
  { id: 'e-c-f', source: 'cat-corporate', target: 't-fraud' },
  { id: 'e-c-b', source: 'cat-corporate', target: 't-board' },
  { id: 'e-c-r', source: 'cat-corporate', target: 't-reg' },
  { id: 'e-c-e', source: 'cat-corporate', target: 't-esg' },

  { id: 'e-m-c', source: 'cat-markets', target: 't-crypto' },
  { id: 'e-m-i', source: 'cat-markets', target: 't-ipo' },
  { id: 'e-m-m', source: 'cat-markets', target: 't-macro' },

  { source: 'cat-tech', target: 't-genai' },
  { source: 'cat-tech', target: 't-chips' },
  { source: 'cat-tech', target: 't-cyber' },
  { source: 'cat-tech', target: 't-space' },

  { source: 't-genai', target: 't-llms' }, 
  { source: 't-llms', target: 's-gpt4' }, 

  { id: 'es-f-a', source: 't-fraud', target: 's-adani' },
  { id: 'es-f-w', source: 't-fraud', target: 's-wirecard' },
  { id: 'es-f-e', source: 't-fraud', target: 's-evergrande' },
  { id: 'es-f-l', source: 't-fraud', target: 's-luckin' },
  { id: 'es-f-n', source: 't-fraud', target: 's-nirav' },

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

  { id: 'es-e-s', source: 't-esg', target: 's-shell' },
  { id: 'es-e-t', source: 't-esg', target: 's-tesla-esg' },

  { id: 'es-i-o', source: 't-ipo', target: 's-ola-ipo' },
  { id: 'es-i-r', source: 't-ipo', target: 's-reddit-ipo' },

  { id: 'es-m-f', source: 't-macro', target: 's-fed-rate' },
  { id: 'es-m-i', source: 't-macro', target: 's-inflation-india' },

  { id: 'es-c-r', source: 't-cyber', target: 's-russia-cyber' },
  { id: 'es-c-s', source: 't-cyber', target: 's-solarwinds' },

  { id: 'es-s-x', source: 't-space', target: 's-spacex' },
  { id: 'es-s-i', source: 't-space', target: 's-isro' },
];

// ==========================================
// PART 2: THE TIMELINE DATABASE
// ==========================================

export const storyDatabase = {
  "s-adani": {
    timeline: [
      { id: 'ev1', timestamp: 'Jan 24, 2024', title: 'Hindenburg Report Released', summary: 'Short-seller report alleges stock manipulation, wiping out billions in market cap.' },
      { id: 'ev2', timestamp: 'Feb 15, 2024', title: 'Regulatory Probe Initiated', summary: 'SEBI begins an official investigation into the corporate structure.' },
      { id: 'ev3', timestamp: 'Mar 10, 2024', title: 'GQG Partners Investment', summary: 'Major institutional backer buys $1.8B stake, signaling market confidence.' }
    ]
  },
  "s-wirecard": {
    timeline: [
      { id: 'w1', timestamp: 'Jun 18, 2020', title: 'Missing €1.9 Billion', summary: 'Auditors refuse to sign off on accounts after discovering massive financial hole.' },
      { id: 'w2', timestamp: 'Jun 25, 2020', title: 'Insolvency Filed', summary: 'Wirecard collapses into insolvency; CEO Markus Braun arrested.' }
    ]
  },
  "s-luckin": {
    timeline: [
      { id: 'l1', timestamp: 'Apr 02, 2020', title: 'Fabricated Sales Admitted', summary: 'Internal investigation reveals COO fabricated $310M in sales.' },
      { id: 'l2', timestamp: 'Jun 29, 2020', title: 'NASDAQ Delisting', summary: 'Trading suspended and company officially delisted from US exchange.' }
    ]
  },
  "s-openai": {
    timeline: [
      { id: 'o1', timestamp: 'Nov 17, 2023', title: 'Sam Altman Ousted', summary: 'The non-profit board unexpectedly fires the CEO via a Google Meet call.' },
      { id: 'o2', timestamp: 'Nov 19, 2023', title: 'Microsoft Intervenes', summary: 'Satya Nadella offers to hire Altman and all resigning OpenAI staff.' },
      { id: 'o3', timestamp: 'Nov 22, 2023', title: 'Altman Reinstated', summary: 'Following a massive employee revolt, the board is restructured and Altman returns.' }
    ]
  },
  "s-disney": {
    timeline: [
      { id: 'd1', timestamp: 'Jan 11, 2023', title: 'Peltz Launches Proxy Fight', summary: 'Activist investor Nelson Peltz pushes for a board seat to cut costs.' },
      { id: 'd2', timestamp: 'Feb 09, 2023', title: 'Restructuring Announced', summary: 'Bob Iger announces 7,000 layoffs, prompting Peltz to back down.' }
    ]
  },
  "s-nvidia": {
    timeline: [
      { id: 'n1', timestamp: 'May 24, 2023', title: 'The $1 Trillion Milestone', summary: 'Nvidia briefly touches $1T market cap fueled by AI chip demand.' },
      { id: 'n2', timestamp: 'Feb 21, 2024', title: 'Blowout Q4 Earnings', summary: 'Revenue up 265% year-over-year, destroying Wall Street estimates.' },
      { id: 'n3', timestamp: 'Mar 01, 2024', title: 'Crossing $2 Trillion', summary: 'Stock surges past $2T, making it the third most valuable US company.' }
    ]
  },
  "s-tsmc": {
    timeline: [
      { id: 't1', timestamp: 'Dec 06, 2022', title: 'Arizona Fab Investment', summary: 'TSMC announces $40B investment in two US manufacturing plants.' },
      { id: 't2', timestamp: 'Jul 20, 2023', title: 'Production Delayed', summary: 'Lack of skilled workers forces TSMC to push Arizona production to 2025.' }
    ]
  },
  "s-paytm": {
    timeline: [
      { id: 'p1', timestamp: 'Jan 31, 2024', title: 'RBI Restricts Payments Bank', summary: 'Central bank orders Paytm Payments Bank to stop accepting deposits.' },
      { id: 'p2', timestamp: 'Feb 16, 2024', title: 'Deadline Extended', summary: 'RBI gives a 15-day extension for merchants to migrate their accounts.' }
    ]
  },
  "s-fed-rate": {
    timeline: [
      { id: 'f1', timestamp: 'Mar 16, 2022', title: 'Liftoff: Rates Increase', summary: 'Fed raises rates for the first time since 2018 to combat inflation.' },
      { id: 'f2', timestamp: 'Jul 26, 2023', title: 'Peak Rates Reached', summary: 'Fed hikes rates to 22-year high of 5.25%-5.50%.' },
      { id: 'f3', timestamp: 'Jan 31, 2024', title: 'Pivot Signaled', summary: 'Powell indicates rate cuts are coming, but pushes back on March timeline.' }
    ]
  },
  "s-solarwinds": {
    timeline: [
      { id: 'sw1', timestamp: 'Dec 13, 2020', title: 'Breach Discovered', summary: 'FireEye reveals state-sponsored hackers compromised SolarWinds Orion software.' },
      { id: 'sw2', timestamp: 'Apr 15, 2021', title: 'US Sanctions Russia', summary: 'US formally blames Russian intelligence (SVR) and expels diplomats.' }
    ]
  },
  "s-spacex": {
    timeline: [
      { id: 'sp1', timestamp: 'Apr 20, 2023', title: 'First Orbital Attempt', summary: 'Starship launches but experiences rapid unscheduled disassembly (RUD).' },
      { id: 'sp2', timestamp: 'Mar 14, 2024', title: 'Flight 3 Success', summary: 'Starship reaches orbit, completes payload door tests, and re-enters atmosphere.' }
    ]
  }
};