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
    summary: 'Healthcare AI startup | 300 employees | $700M series C-E',
    details: 'Joined Abridge at ~30 employees. First senior staff engineer. Operated through hyper-growth and multiple funding stages (A16Z, Khosla Ventures, Elad Gil, IVP). Drove core technical direction by leading architecture decisions and selecting foundational technologies (e.g., Temporal) that scaled with the business. Proposed, architected, and implemented mission-critical systems, including large-scale orchestration of audio into structured clinical notes. Led high-risk, high-precision internal initiatives such as major database migrations, owning design, execution, and reliability outcomes end to end.',
    url: 'https://www.abridge.com/',
  },
  {
    title: 'Chief Technology Officer',
    company: 'Arena',
    startDate: '08/2021',
    endDate: '01/2023',
    summary: 'Audience engagement startup | 50 employees | $13.6M series A',
    url: 'https://arena.im/',
    details:
      'Owned engineering, architecture, and IT. Scaled the platform through Series A led by CRV, Craft Ventures, Artisanal Ventures, and Vela Partners. Cut technical operations costs 40%+. Led company-wide migration from JavaScript to TypeScript. Established disciplined engineering practices: code reviews, CI, planning, metrics-driven operations, and standardized technical processes.',
  },
  {
    title: 'Chief Technology Officer',
    company: 'Optym',
    startDate: '10/2019',
    endDate: '03/2021',
    summary: 'B2B SaaS | Optimization & Decision Science | 250 employees | $25M revenue',
    url: 'https://www.optym.com/',
    details:
      'Supported Optym’s SaaS technology ventures. Established shared architectures, policies, and delivery standards to enable rapid product launches. Mentored senior engineers and technical leaders, reinforcing execution quality and engineering culture. Worked directly with customers, partners, and executives to design new products, deliver bespoke solutions.',
  },
  {
    title: 'Chief Architect',
    company: 'Solera',
    url: 'https://www.solera.com/',
    startDate: '06/2015',
    endDate: '09/2019',
    summary:
      'Multinational | Risk management & asset protection | 6,000 employees | $1.1B revenue',
    details:
      'Led strategic R&D and product incubation initiatives for the office of the CEO. Assessed emerging technologies for enterprise adoption, including ML, blockchain, AR/VR, IoT/telematics, digital identity, large-scale data platforms, and cloud-native SaaS (AWS).',
  },
  {
    title: 'Head of Technology',
    company: 'HPI',
    startDate: '11/2013',
    endDate: '05/2015',
    url: 'https://www.hpi.co.uk/',
    summary: 'Private company | Automotive data & asset protection | £20M revenue',
    details:
      'Led end-to-end product development and delivery for new consumer products, from concept through launch. UK market leader in vehicle history checks.',
    notes: '(Subsidiary of Solera Holdings)',
  },
  {
    title: 'Chief Technology Officer',
    company: 'TalMix',
    startDate: '01/2013',
    endDate: '10/2013',
    summary: 'Management consulting startup | Talent search | £2M series A',
    details:
      'Rebuilt a legacy platform into a scalable two-sided marketplace. Led search and matching improvements to increase relevance of consultant recommendations.',
    notes: '(Previously known as MBA & Company)',
  },
  {
    title: 'Technical Director',
    company: 'MadBid',
    startDate: '06/2008',
    endDate: '12/2012',
    summary: 'Entertainment shopping startup | 75 employees | £4M Series A | £10M revenue',
    details:
      'Co-founded MadBid and led all technology and software development from bootstrap to scale. Built and ran the entire engineering organization through rapid growth.',
  },
];
