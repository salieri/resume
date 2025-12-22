import { SimpleGrid, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';
import { useIsMdOrUp } from '@/utils/use-is-md-or-up';
import { useIsPrint } from '@/utils/use-is-print';

import { TranslatedChart } from './chart';
import {
  focusFitData,
  industryExperienceData,
  leadershipExperienceData,
  missionFitData,
  technicalExperienceData,
  technologyFitData,
} from './data';

export const AtAGlance = () => {
  const isMdOrUp = useIsMdOrUp();
  const isPrint = useIsPrint();

  const chartAdjuster = isMdOrUp ? { cy: 125 } : (isPrint ? {} : {});

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
