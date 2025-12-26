import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconEPassport,
  IconMail,
  IconPhone,
  IconPlaneDeparture,
} from '@tabler/icons-react';

import type { TranslatorFn } from '@/utils/translator.type';

const baseKey = 'contactInfo';

export const contactInfoData = (_t: TranslatorFn) => {
  // intentionally not translated

  return [
    {
      id: 'phone',
      caption: '+1 (817) 247-0723',
      url: 'tel:+1817247023',
      Icon: IconPhone,
    },
    {
      id: 'email',
      caption: 'ping@getsalieri.com',
      url: 'email:ping@getsalieri.com',
      Icon: IconMail,
    },
    {
      id: 'linkedin',
      caption: 'linkedin.com/in/aleksiasikainen',
      url: 'https://linkedin.com/in/aleksiasikainen',
      Icon: IconBrandLinkedin,
    },
    {
      id: 'github',
      caption: 'github.com/salieri',
      url: 'https://github.com/salieri',
      Icon: IconBrandGithub,
    },
  ];
};

export const migrationData = (t: TranslatorFn) => {
  return [
    {
      id: 'residency',
      caption: t(`${baseKey}.residency`, 'US permanent resident, EU citizen'),
      Icon: IconEPassport,
    },
    {
      id: 'relocation',
      caption: t(`${baseKey}.relocation`, 'Can relocate'),
      Icon: IconPlaneDeparture,
    },
  ];
};
