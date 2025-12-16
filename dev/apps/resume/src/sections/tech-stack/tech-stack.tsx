import { Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';
import { TranslatedTechStackItem } from '@/sections/tech-stack/item';

import { techStackData } from './data';

export const TechStack = () => {
  return (
    <Section>
      <Title order={2}>
        <Trans i18nKey='techStack.title'>Modern Technology Stack Expertise</Trans>
      </Title>

      {techStackData.map((data) => (
        <TranslatedTechStackItem data={data} key={data.title} />
      ))}
    </Section>
  );
};
