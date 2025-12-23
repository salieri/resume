import { SimpleGrid, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { DisplayOnly } from '@/components/display-only/display-only';
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
  const chartAdjuster = isPrint ? {} : (isMdOrUp ? { cy: 125 } : {});

  return (
    <Section className='atAGlanceSection'>
      <DisplayOnly>
        <Title order={2}>
          <Trans>At a Glance</Trans>
        </Title>
      </DisplayOnly>

      <SimpleGrid cols={isPrint ? 3 : { base: 1, md: 2 }} verticalSpacing={isPrint ? 0 : 'md'}>
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
