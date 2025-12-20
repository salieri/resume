import { SimpleGrid, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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
  const theme = useMantineTheme();

  const isMdOrUp = useMediaQuery(`(min-width: ${theme.breakpoints.md})`, false, {
    getInitialValueInEffect: false,
  });

  const isPrint = useMediaQuery('print', false, {
    getInitialValueInEffect: false,
  });

  const chartAdjuster = isMdOrUp || isPrint ? { cy: 125 } : {};

  return (
    <Section>
      <Title order={2}>
        <Trans>At a Glance</Trans>
      </Title>

      <SimpleGrid cols={isPrint ? 2 : { base: 1, md: 2 }}>
        <TranslatedChart data={technicalExperienceData} title='Technical Strengths' />
        <TranslatedChart
          data={leadershipExperienceData}
          title='Leadership'
          radarChartProps={chartAdjuster}
        />
        <TranslatedChart data={industryExperienceData} title='Industry Experience' />
        <TranslatedChart data={missionFitData} title='Mission Fit' />
        <TranslatedChart data={focusFitData} title='Focus' />
        <TranslatedChart data={technologyFitData} title='Recent Experience' />
      </SimpleGrid>
    </Section>
  );
};
