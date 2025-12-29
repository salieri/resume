import type { TranslatorFn } from '~/utils/translator.type';

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
}

const baseKey = 'projects';

export const data = (t: TranslatorFn): Project[] => {
  return [
    {
      id: 'jsvfx',
      name: t(`${baseKey}.jsvfx.name`, 'JS VFX'),
      url: 'https://salieri.github.io/js-vfx/',
      description: t(`${baseKey}.jsvfx.description`, 'Visual effects written in pure JavaScript.'),
    },
    {
      id: 'tartarus',
      name: t(`${baseKey}.tartarus.name`, 'Tartarus Deep Learning Framework'),
      url: 'https://github.com/salieri/tartarus-deep/',
      description: t(`${baseKey}.tartarus.description`, 'From-the-ground-up deep learning framework for TypeScript.'),
    },
    {
      id: 'resume',
      name: t(`${baseKey}.resume.name`, 'Resume'),
      url: 'https://github.com/salieri/resume/',
      description: t(`${baseKey}.resume.description`, 'This resume as code. Extremely over-engineered. Start here.'),
    },
  ];
};
