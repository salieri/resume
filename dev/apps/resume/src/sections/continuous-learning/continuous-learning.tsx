import { Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';

import { continuousLearningData } from './data';
import { TranslatedContinuousLearningItem } from './item';

export const ContinuousLearning = () => {
  return (
    <Section>
      <Title order={2}>
        <Trans i18nKey='continuousLearning.title'>Continuous Learning</Trans>
      </Title>

      {continuousLearningData.map((data) => (
        <TranslatedContinuousLearningItem data={data} key={data.title} />
      ))}
    </Section>
  );
};
