import { Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';
import { TranslatedEducationItem } from '@/sections/education/item';

import { educationData } from './data';

export const Education = () => {
  return (
    <Section>
      <Title order={2}>
        <Trans i18nKey='education.title'>Education</Trans>
      </Title>

      {educationData.map((data) => (
        <TranslatedEducationItem data={data} key={data.title} />
      ))}
    </Section>
  );
};
