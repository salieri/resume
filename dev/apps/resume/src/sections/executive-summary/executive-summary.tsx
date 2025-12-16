import { SimpleGrid, Text, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';

import { TranslatedChart } from './chart';
import { focusFitData, industryExperienceData, leadershipExperienceData, missionFitData, technicalExperienceData,
  technologyFitData
} from './data';

export const ExecutiveSummary = () => {
  return (
    <Section>
      <Title order={1}>
        <Trans i18nKey='title.thisIsAleksi'>
          This is <strong>Aleksi</strong>.
        </Trans>
      </Title>

      <Title order={2}>
        <Trans i18nKey='title.executiveSummary'>Executive Summary</Trans>
      </Title>

      <Text>
        <Trans i18nKey='text.20YearsOfExperience'>
          20+ years of <strong>hands-on</strong>, relevant industry experience.
        </Trans>
      </Text>

      <Text>
        <Trans i18nKey='text.creativeTechnologist'>
          <strong>Creative technologist leading early-stage technology projects.</strong> Generalist
          with extensive development, architectural, and senior-management experience.
        </Trans>
      </Text>

      <Text>
        <Trans i18nKey='text.practicalExperienceOnAllLayers'>
          Practical experience on all layers of software development and operations, including
          backend, middleware, web, mobile, desktop, database, data science, ML, QA, and DevOps.
        </Trans>
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        <TranslatedChart data={technicalExperienceData} title='Technical Experience' />
        <TranslatedChart data={leadershipExperienceData} title='Leadership Experience' />
        <TranslatedChart data={industryExperienceData} title='Industry Experience' />
        <TranslatedChart data={missionFitData} title='Mission Fit' />
        <TranslatedChart data={focusFitData} title='Focus Fit' />
        <TranslatedChart data={technologyFitData} title='Technology Fit' />
      </SimpleGrid>

      <Title order={1}>
        <Trans i18nKey='title.whatAleksiLikes'>
          Aleksi likes to <strong>build</strong>.
        </Trans>
      </Title>
    </Section>
  );
};
