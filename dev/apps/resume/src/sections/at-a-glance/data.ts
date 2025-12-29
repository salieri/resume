import type { TranslatorFn } from '~/utils/translator.type';

export interface ChartData {
  label: string;
  value: number;
}

export interface Chart {
  title: string;
  data: ChartData[];
}

const dataKeyBase = 'atAGlance';

export const technicalExperienceData = (t: TranslatorFn): Chart => {
  const keyBase = `${dataKeyBase}.technicalExperience`;

  return {
    title: t(`${keyBase}.title`, 'Technical Strengths'),
    data: [
      {
        label: t(`${keyBase}.architecture`, 'Architecture'),
        value: 5,
      },
      {
        label: t(`${keyBase}.backend`, 'Backend'),
        value: 5,
      },
      {
        label: t(`${keyBase}.devops`, 'DevOps'),
        value: 4.5,
      },
      {
        label: t(`${keyBase}.frontend`, 'Frontend'),
        value: 4,
      },
      {
        label: t(`${keyBase}.mobile`, 'Mobile'),
        value: 3,
      },
      {
        label: t(`${keyBase}.testingQa`, 'Testing/QA'),
        value: 4,
      },
      {
        label: t(`${keyBase}.technicalWriting`, 'Technical Writing'),
        value: 5,
      },
    ] };
};

export const leadershipExperienceData = (t: TranslatorFn): Chart => {
  const keyBase = `${dataKeyBase}.leadershipExperience`;

  return {
    title: t(`${keyBase}.title`, 'Leadership'),
    data: [
      {
        label: t(`${keyBase}.techLeadership`, 'Tech. Leadership'),
        value: 5,
      },
      {
        label: t(`${keyBase}.techStrategy`, 'Tech. Strategy'),
        value: 5,
      },
      {
        label: t(`${keyBase}.MgmtAdmin`, 'Mgmt & Admin'),
        value: 3,
      },
      {
        label: t(`${keyBase}.recruitment`, 'Recruitment'),
        value: 4,
      },
      {
        label: t(`${keyBase}.planning`, 'Planning'),
        value: 5,
      },
      {
        label: t(`${keyBase}.mentoringTraining`, 'Mentoring & Training'),
        value: 4,
      },
      {
        label: t(`${keyBase}.productDevelopment`, 'Product Development'),
        value: 5,
      },
    ] };
};

export const missionFitData = (t: TranslatorFn): Chart => {
  const keyBase = `${dataKeyBase}.missionFit`;

  return {
    title: t(`${keyBase}.title`, 'Mission Fit'),
    data: [
      {
        label: t(`${keyBase}.greenField`, 'Green-Field'),
        value: 5,
      },
      {
        label: t(`${keyBase}.nextGen20`, 'Next-Gen & 2.0'),
        value: 5,
      },
      {
        label: t(`${keyBase}.scaling`, 'Scaling'),
        value: 4.5,
      },
      {
        label: t(`${keyBase}.fixProjects`, 'Fix Projects'),
        value: 4,
      },
      {
        label: t(`${keyBase}.fixTeams`, 'Fix Teams'),
        value: 4,
      },
      {
        label: t(`${keyBase}.maintenance`, 'Maintenance'),
        value: 2,
      },
      {
        label: t(`${keyBase}.rnd`, 'R&D'),
        value: 5,
      },
      {
        label: t(`${keyBase}.devInfraTooling`, 'Dev. Infra & Tooling'),
        value: 5,
      },
    ] };
};

export const focusFitData = (t: TranslatorFn): Chart => {
  const keyBase = `${dataKeyBase}.focusFit`;

  return {
    title: t(`${keyBase}.title`, 'Focus'),
    data: [
      {
        label: t(`${keyBase}.architecture`, 'Architecture'),
        value: 5,
      },
      {
        label: t(`${keyBase}.strategy`, 'Strategy'),
        value: 5,
      },
      {
        label: t(`${keyBase}.devops`, 'DevOps'),
        value: 4,
      },
      {
        label: t(`${keyBase}.collaboration`, 'Collaboration'),
        value: 4,
      },
      {
        label: t(`${keyBase}.deepWork`, 'Deep Work'),
        value: 5,
      },
      {
        label: t(`${keyBase}.mgmtAdmin`, 'Mgmt & Admin'),
        value: 3,
      },
      {
        label: t(`${keyBase}.programming`, 'Programming'),
        value: 5,
      },
    ] };
};

export const technologyFitData = (t: TranslatorFn): Chart => {
  const keyBase = `${dataKeyBase}.technologyFit`;

  return {
    title: t(`${keyBase}.title`, 'Recent Experience'),
    data: [
      {
        label: t(`${keyBase}.typeScript`, 'TypeScript'),
        value: 5,
      },
      {
        label: t(`${keyBase}.python`, 'Python'),
        value: 4,
      },
      {
        label: t(`${keyBase}.mongoDb`, 'MongoDB'),
        value: 4,
      },
      {
        label: t(`${keyBase}.sql`, 'SQL'),
        value: 5,
      },
      {
        label: t(`${keyBase}.linux`, 'Linux'),
        value: 5,
      },
      {
        label: t(`${keyBase}.electron`, 'Electron'),
        value: 4,
      },
      {
        label: t(`${keyBase}.docker`, 'Docker'),
        value: 5,
      },
      {
        label: t(`${keyBase}.react`, 'React'),
        value: 3.5,
      },
      {
        label: t(`${keyBase}.vue`, 'Vue'),
        value: 4,
      },
      {
        label: t(`${keyBase}.angular`, 'Angular'),
        value: 2,
      },
      {
        label: t(`${keyBase}.nestJS`, 'NestJS'),
        value: 4,
      },
      {
        label: t(`${keyBase}.gcp`, 'GCP'),
        value: 4,
      },
      {
        label: t(`${keyBase}.azure`, 'Azure'),
        value: 2,
      },
      {
        label: t(`${keyBase}.aws`, 'AWS'),
        value: 4,
      },
    ] };
};

export const industryExperienceData = (t: TranslatorFn): Chart => {
  const keyBase = `${dataKeyBase}.industryExperience`;

  return {
    title: t(`${keyBase}.title`, 'Industry Experience'),
    data: [
      {
        label: t(`${keyBase}.b2c`, 'B2C'),
        value: 5,
      },
      {
        label: t(`${keyBase}.b2b`, 'B2B'),
        value: 5,
      },
      {
        label: t(`${keyBase}.fintech`, 'Fintech'),
        value: 3.5,
      },
      {
        label: t(`${keyBase}.automotive`, 'Automotive'),
        value: 3.5,
      },
      {
        label: t(`${keyBase}.hwEmbedded`, 'HW & Embedded'),
        value: 2,
      },
      {
        label: t(`${keyBase}.homeAutomation`, 'Home Automation'),
        value: 3,
      },
      {
        label: t(`${keyBase}.videoGames`, 'Video Games'),
        value: 3,
      },
      {
        label: t(`${keyBase}.realtime`, 'Real-Time'),
        value: 4,
      },
      {
        label: t(`${keyBase}.paymentSolutions`, 'Payment Solutions'),
        value: 4,
      },
      {
        label: t(`${keyBase}.talentSearch`, 'Talent Search'),
        value: 4,
      },
      {
        label: t(`${keyBase}.healthcare`, 'Healthcare'),
        value: 4,
      },
    ] };
};
