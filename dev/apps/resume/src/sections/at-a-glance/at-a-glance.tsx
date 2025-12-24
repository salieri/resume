import { SimpleGrid, Title } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

  return (
    <Section className='atAGlanceSection'>
      <DisplayOnly>
        <Title order={2}>
          <Trans i18nKey='atAGlance.title'>At a Glance</Trans>
        </Title>
      </DisplayOnly>

      <SimpleGrid cols={isPrint ? 3 : { base: 1, md: 2 }} verticalSpacing={isPrint ? 0 : 'md'}>
        <TranslatedChart data={technicalExperienceData(t)} />
        <TranslatedChart
          data={leadershipExperienceData(t)}
          radarChartProps={chartAdjuster}
        />
        <TranslatedChart data={industryExperienceData(t)} />
        <TranslatedChart data={missionFitData(t)} />
        <TranslatedChart data={focusFitData(t)} />
        <TranslatedChart data={technologyFitData(t)} />
      </SimpleGrid>
    </Section>
  );
};
