import type { TranslatorFn } from '~/utils/translator.type';

export interface WorkHistory {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  summary: string;
  details: string | string[];
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
      summary: t(`${baseKey}.abridge.summary`, 'Healthcare AI startup | 300 employees | $700M series B-E'),
      details: [
        t(`${baseKey}.abridge.details.role`, 'Joined Abridge at ~30 employees. Company\'s first senior staff engineer.'),
        t(`${baseKey}.abridge.details.growth`, 'Operated through hyper-growth and multiple funding stages (A16Z, Khosla Ventures, Elad Gil, IVP).'),
        t(`${baseKey}.abridge.details.architecture`, 'Drove core technical direction by leading architecture decisions and selecting foundational technologies (e.g., Temporal) that scaled with the business.'),
        t(`${baseKey}.abridge.details.proposals`, 'Proposed, architected, and implemented critical core systems, including large-scale orchestration of audio into structured clinical notes.'),
        t(`${baseKey}.abridge.details.missions`, 'Led high-risk, high-precision internal initiatives such as major database migrations, owning design, execution, and reliability outcomes end to end.'),
      ],
      url: 'https://www.abridge.com/',
    },
    {
      id: 'arena',
      title: t(`${baseKey}.arena.title`, 'Chief Technology Officer'),
      company: 'Arena',
      startDate: '08/2021',
      endDate: '12/2022',
      summary: t(`${baseKey}.arena.summary`, 'Audience engagement startup | 50 employees | $13.6M series A'),
      url: 'https://arena.im/',
      details: [
        t(`${baseKey}.arena.details.ownership`, 'Owned engineering, architecture, and IT.'),
        t(`${baseKey}.arena.details.scale`, 'Scaled the platform through Series A led by CRV, Craft Ventures, Artisanal Ventures, and Vela Partners.'),
        t(`${baseKey}.arena.details.optimization`, 'Cut technical operations costs 40%+.'),
        t(`${baseKey}.arena.details.practices`, 'Established engineering practices: code reviews, CI, planning, metrics-driven operations, and standardized technical processes.'),
      ],
    },
    {
      id: 'optym',
      title: t(`${baseKey}.optym.title`, 'Chief Technology Officer'),
      company: 'Optym',
      startDate: '10/2019',
      endDate: '03/2021',
      summary: t(`${baseKey}.optym.summary`, 'B2B SaaS | Optimization & Decision Science | 250 employees | $25M revenue'),
      url: 'https://www.optym.com/',
      details: [
        t(`${baseKey}.optym.details.mentor`, 'Mentored senior engineers and technical leaders, reinforcing execution quality and engineering culture.'),
        t(`${baseKey}.optym.details.arch`, 'Established shared architectures, policies, and delivery standards to enable rapid product launches.'),
        t(`${baseKey}.optym.details.customers`, 'Worked directly with customers, partners, and executives to design new products, deliver bespoke solutions.'),
        t(`${baseKey}.optym.details.saas`, 'Supported Optym’s SaaS technology ventures.'),
      ],
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
      details: [
        t(`${baseKey}.solera.details.rnd`, 'Led strategic R&D and product incubation initiatives for the office of the CEO.'),
        t(`${baseKey}.solera.details.emerging`, 'Assessed emerging technologies for enterprise adoption, including ML, blockchain, AR/VR, IoT/telematics, digital identity, large-scale data platforms, and cloud-native SaaS (AWS).'),
      ],
    },
    {
      id: 'hpi',
      title: t(`${baseKey}.hpi.title`, 'Head of Technology'),
      company: 'HPI',
      startDate: '11/2013',
      endDate: '05/2015',
      url: 'https://www.hpi.co.uk/',
      summary: t(`${baseKey}.hpi.summary`, 'Private company | Automotive data & asset protection | £20M revenue'),
      details: [
        t(`${baseKey}.hpi.details.products`, 'Led end-to-end product development and delivery for new consumer products, from concept through launch.'),
        t(`${baseKey}.hpi.details.leader`, 'UK market leader in vehicle history checks.'),
      ],
      notes: t(`${baseKey}.hpi.notes`, '(Subsidiary of Solera)'),
    },
    {
      id: 'talmix',
      title: t(`${baseKey}.talmix.title`, 'Chief Technology Officer'),
      company: 'TalMix',
      startDate: '01/2013',
      endDate: '10/2013',
      summary: t(`${baseKey}.talmix.summary`, 'Management consulting startup | Talent search | £2M series A'),
      details: [
        t(`${baseKey}.talmix.details.rebuild`, 'Rebuilt a legacy platform into a scalable two-sided marketplace. Led search and matching improvements to increase relevance of consultant recommendations.'),
        t(`${baseKey}.talmix.details.search`, 'Led search and matching improvements to increase relevance of consultant recommendations.'),
        t(`${baseKey}.talmix.details.itTech`, 'Owned all technical operations.'),
      ],
      notes: t(`${baseKey}.talmix.notes`, '(Previously known as MBA & Company)'),
    },
    {
      id: 'madbid',
      title: t(`${baseKey}.madbid.title`, 'Technical Director'),
      company: 'MadBid',
      startDate: '06/2008',
      endDate: '12/2012',
      summary: t(`${baseKey}.madbid.summary`, 'Entertainment shopping startup | 75 employees | £4M Series A | £10M revenue'),
      details: [
        t(`${baseKey}.madbid.details.cofounder`, 'Co-founded MadBid.'),
        t(`${baseKey}.madbid.details.technlogyLeadership`, 'Led all technology and software development from bootstrap to scale.'),
        t(`${baseKey}.madbid.details.orgScale`, 'Built and ran the entire engineering organization through rapid growth.'),
      ],
    },
  ];
};
