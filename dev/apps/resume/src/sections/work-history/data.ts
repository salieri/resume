import type { TranslatorFn } from '~/utils/translator.type';

export interface WorkHistory {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  summary: string;
  details: string;
  url?: string;
  notes?: string;
}

export const translationKeyTypes = ['title', 'summary', 'details', 'notes'] as const;

type TranslationKeyType = typeof translationKeyTypes[number];

export const getTranslationKey = (item: WorkHistory, type: TranslationKeyType) => {
  return `workHistory.${item.company}.${item.title}.${type}`;
};

const baseKey = 'workHistory';

export const data = (t: TranslatorFn): WorkHistory[] => {
  return [
    {
      id: 'abrige',
      title: t(`${baseKey}.abridge.title`, 'Senior Staff Software Engineer'),
      company: 'Abridge',
      startDate: '01/2024',
      endDate: t(`${baseKey}.presentlyWorkingHere`, 'Present'),
      summary: t(`${baseKey}.abridge.summary`, 'Healthcare AI startup | 300 employees | $700M series C-E'),
      details: t(`${baseKey}.abridge.details`, 'Joined Abridge at ~30 employees. Company\'s first senior staff engineer. Operated through hyper-growth and multiple funding stages (A16Z, Khosla Ventures, Elad Gil, IVP). Drove core technical direction by leading architecture decisions and selecting foundational technologies (e.g., Temporal) that scaled with the business. Proposed, architected, and implemented mission-critical systems, including large-scale orchestration of audio into structured clinical notes. Led high-risk, high-precision internal initiatives such as major database migrations, owning design, execution, and reliability outcomes end to end.'),
      url: 'https://www.abridge.com/',
    },
    {
      id: 'arena',
      title: t(`${baseKey}.arena.title`, 'Chief Technology Officer'),
      company: 'Arena',
      startDate: '08/2021',
      endDate: '01/2023',
      summary: t(`${baseKey}.arena.summary`, 'Audience engagement startup | 50 employees | $13.6M series A'),
      url: 'https://arena.im/',
      details:
      t(`${baseKey}.arena.details`, 'Owned engineering, architecture, and IT. Scaled the platform through Series A led by CRV, Craft Ventures, Artisanal Ventures, and Vela Partners. Cut technical operations costs 40%+. Led company-wide migration from JavaScript to TypeScript. Established disciplined engineering practices: code reviews, CI, planning, metrics-driven operations, and standardized technical processes.'),
    },
    {
      id: 'optym',
      title: t(`${baseKey}.optym.title`, 'Chief Technology Officer'),
      company: 'Optym',
      startDate: '10/2019',
      endDate: '03/2021',
      summary: t(`${baseKey}.optym.summary`, 'B2B SaaS | Optimization & Decision Science | 250 employees | $25M revenue'),
      url: 'https://www.optym.com/',
      details:
      t(`${baseKey}.optym.details`, 'Supported Optym’s SaaS technology ventures. Established shared architectures, policies, and delivery standards to enable rapid product launches. Mentored senior engineers and technical leaders, reinforcing execution quality and engineering culture. Worked directly with customers, partners, and executives to design new products, deliver bespoke solutions.'),
    },
    {
      id: 'solera',
      title: t(`${baseKey}.solera.title`, 'Chief Architect'),
      company: 'Solera',
      url: 'https://www.solera.com/',
      startDate: '06/2015',
      endDate: '09/2019',
      summary:
      t(`${baseKey}.solera.summary`, 'Multinational | Risk management & asset protection | 6,000 employees | $1.1B revenue'),
      details:
      t(`${baseKey}.solera.details`, 'Led strategic R&D and product incubation initiatives for the office of the CEO. Assessed emerging technologies for enterprise adoption, including ML, blockchain, AR/VR, IoT/telematics, digital identity, large-scale data platforms, and cloud-native SaaS (AWS).'),
    },
    {
      id: 'hpi',
      title: t(`${baseKey}.hpi.title`, 'Head of Technology'),
      company: 'HPI',
      startDate: '11/2013',
      endDate: '05/2015',
      url: 'https://www.hpi.co.uk/',
      summary: t(`${baseKey}.hpi.summary`, 'Private company | Automotive data & asset protection | £20M revenue'),
      details:
      t(`${baseKey}.hpi.details`, 'Led end-to-end product development and delivery for new consumer products, from concept through launch. UK market leader in vehicle history checks.'),
      notes: t(`${baseKey}.hpi.notes`, '(Subsidiary of Solera Holdings)'),
    },
    {
      id: 'talmix',
      title: t(`${baseKey}.talmix.title`, 'Chief Technology Officer'),
      company: 'TalMix',
      startDate: '01/2013',
      endDate: '10/2013',
      summary: t(`${baseKey}.talmix.summary`, 'Management consulting startup | Talent search | £2M series A'),
      details:
      t(`${baseKey}.talmix.details`, 'Rebuilt a legacy platform into a scalable two-sided marketplace. Led search and matching improvements to increase relevance of consultant recommendations.'),
      notes: t(`${baseKey}.talmix.notes`, '(Previously known as MBA & Company)'),
    },
    {
      id: 'madbid',
      title: t(`${baseKey}.madbid.title`, 'Technical Director'),
      company: 'MadBid',
      startDate: '06/2008',
      endDate: '12/2012',
      summary: t(`${baseKey}.madbid.summary`, 'Entertainment shopping startup | 75 employees | £4M Series A | £10M revenue'),
      details:
      t(`${baseKey}.madbid.details`, 'Co-founded MadBid and led all technology and software development from bootstrap to scale. Built and ran the entire engineering organization through rapid growth.'),
    },
  ];
};
