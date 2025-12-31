import { Text, Title } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';

import { Section } from '~/components/section/section';

export const ExecutiveSummary = () => {
  useTranslation();

  return (
    <Section className='executiveSummarySection'>
      <Title order={2}>
        <Trans i18nKey='exsum.title'>Executive Summary</Trans>
      </Title>

      <Text>
        <Trans i18nKey='exsum.20YearsOfExperience'>
          <strong>25+ years</strong> of <strong>hands-on</strong> software leadership.
        </Trans>
      </Text>

      <Text>
        <Trans i18nKey='exsum.creativeTechnologist'>
          Senior technologist who <strong>delivers complex technology initiatives</strong>.
          Translates vague ideas into <strong>scalable, production-grade platforms</strong>.
        </Trans>
      </Text>

      <Text>
        <Trans i18nKey='exsum.engagement'>
          Proven at <strong>0→1, 1→N, and scale-up inflection points</strong>. Recently built a
          system that transforms <strong>100+ hours of audio</strong> into structured inference{' '}
          <strong>every minute</strong>.
        </Trans>
      </Text>

      <Text>
        <Trans i18nKey='exsum.managementResource'>
          Brought in to{' '}
          <strong>de-risk execution, accelerate delivery, and scale teams and systems</strong>.
          Advisor to <strong>founders, C-level, and VPs</strong>.
        </Trans>
      </Text>

      <Text>
        <Trans i18nKey='exsum.problemSolver'>
          Your solution to: <i>"How do we build this?"</i>
        </Trans>
      </Text>

      <Text>
        <Trans i18nKey='exsum.practicalExperienceOnAllLayers'>
          Founder-level generalist: backend, web, mobile, desktop, data, ML, QA, platform,
          infrastructure, and DevOps. Dabbles in product, design, and UX. Loves{' '}
          <strong>building</strong>.
        </Trans>
      </Text>
    </Section>
  );
};
