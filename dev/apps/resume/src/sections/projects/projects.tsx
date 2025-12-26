import { Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Section } from '@/components/section/section';

import { data } from './data';
import { ProjectItem } from './item';

export const Projects = () => {
  const { t } = useTranslation();
  const translated = data(t);

  return (
    <Section className='projects'>
      <Title order={2}>
        {t('projects.title', 'Reference Projects')}
      </Title>

      {translated.map((item) => (
        <ProjectItem data={item} key={item.id} />
      ))}
    </Section>
  );
};
