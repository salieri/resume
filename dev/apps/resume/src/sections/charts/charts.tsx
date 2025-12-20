import { SimpleGrid, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';

import { TranslatedChart } from './chart';
import {
  focusFitData,
  industryExperienceData,
  leadershipExperienceData,
  missionFitData,
  technicalExperienceData,
  technologyFitData,
} from './data';

export const Charts = () => {
  return (
    <Section>
      <Title order={2}>
        <Trans>At a Glance</Trans>
      </Title>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <TranslatedChart data={technicalExperienceData} title='Technical Experience' />
        <TranslatedChart data={leadershipExperienceData} title='Leadership Experience' />
        <TranslatedChart data={industryExperienceData} title='Industry Experience' />
        <TranslatedChart data={missionFitData} title='Mission Fit' />
        <TranslatedChart data={focusFitData} title='Focus Fit' />
        <TranslatedChart data={technologyFitData} title='Technology Fit' />
      </SimpleGrid>
    </Section>
  );
};
