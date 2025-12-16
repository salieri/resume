import { Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';

import { projectData } from './data';
import { TranslatedProjectItem } from './item';

export const Projects = () => {
  return (
    <Section>
      <Title order={2}>
        <Trans i18nKey='techStack.title'>
          And More <small>(hobby projects)</small>
        </Trans>
      </Title>

      {projectData.map((data) => (
        <TranslatedProjectItem data={data} key={data.name} />
      ))}
    </Section>
  );
};
