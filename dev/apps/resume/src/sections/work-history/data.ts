export interface WorkHistory {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  summary: string;
  details: string;
  url?: string;
  notes?: string;
}

export const workHistoryData: WorkHistory[] = [
  {
    title: 'Senior Staff Software Engineer',
    company: 'Abridge',
    startDate: '01/2024',
    endDate: 'Present',
    summary: 'Startup, healthcare, AI, 300 employees, $700M series C-E',
    details: '',
    url: 'https://www.abridge.com/',
  },
  {
    title: 'Chief Technology Officer',
    company: 'Arena.im',
    startDate: '08/2021',
    endDate: '01/2023',
    summary: 'Startup, audience engagement, 50 employees, $13.6M series A',
    url: 'https://arena.im/',
    details:
      'Led engineering, architecture, and IT on Arena’s mission to revolutionize audience engagement. Steered technology through Series A round from CRV, Craft Ventures, Artisanal Ventures, and Vela Partners. Reduced technical operations cost by over 40%. Guided team through JS to TS transformation, and adoption of reliable development practices such as code reviews, continuous inspection, planning, data-driven operations, standard processes, and technical policies.',
  },
  {
    title: 'Chief Technology Officer',
    company: 'Optym',
    startDate: '10/2019',
    endDate: '03/2021',
    summary: 'Private company, computer science, optimization, 250 employees, $25M revenue',
    url: 'https://www.optym.com/',
    details:
      'Led Optym’s SaaS technology endeavors. Mentored key engineers in our business units for career, culture, and skillset development. Designed policies, processes, and standardized architectures for rapid deployment of new product lines. Presented Optym’s technology solutions to potential partners. Designed new products and bespoke solutions with customers.',
  },
  {
    title: 'Chief Architect',
    company: 'Solera',
    url: 'https://www.solera.com/',
    startDate: '06/2015',
    endDate: '09/2019',
    summary:
      'Private multinational, risk management, asset protection, 6,000 employees, $1.1B revenue',
    details:
      'Ran strategic R&D, innovation, and product incubation projects for the office of the CEO. Evaluated modern and emerging technology trends for enterprise use, including machine learning, blockchain, Internet of things, vehicle telematics, digital ID, location tracking, big data, AWS, SaaS, AR, VR, 3D, and hybrid mobile.',
  },
  {
    title: 'Head of Technology',
    company: 'HPI',
    startDate: '11/2013',
    endDate: '05/2015',
    url: 'https://www.hpi.co.uk/',
    summary: 'Private company, automotive, asset protection, vehicle history, £20M revenue',
    details:
      'Spearheaded product development, conceptualization, and solution development for new consumer-focused products and services at UK’s leading provider of vehicle history checks.',
    notes: '(Subsidiary of Solera Holdings)',
  },
  {
    title: 'Chief Technology Officer',
    company: 'TalMix',
    startDate: '01/2013',
    endDate: '10/2013',
    summary: 'Startup, management consulting, talent search, £2M series A.',
    details:
      'Built a marketplace for consultants and businesses looking to find qualified talent for projects. Key focus on turning around an outdated technology platform and improving search results on ideal candidates.',
    notes: '(Previously known as MBA & Company)',
  },
  {
    title: 'Technical Director',
    company: 'MadBid.com',
    startDate: '06/2008',
    endDate: '12/2012',
    summary: 'Startup, entertainment shopping for consumers, £4M series A, £10M revenue.',
    details:
      'One of the founders of an entertainment-shopping startup MadBid.com. Backed by £4M investment from Atomico Ventures. In charge of all tech and software development, from the bootstrap phase through rapid growth to £10M+ annual turnover.',
  },
];
