import { Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '@/components/section/section';
import { TranslatedWorkHistoryItem } from '@/sections/work-history/item';

import { workHistoryData } from './data';

export const WorkHistory = () => {
  return (
    <Section>
      <Title order={2}>
        <Trans i18nKey='workHistory.workHistoryTitle'>Work History</Trans>
      </Title>

      {workHistoryData.map((data) => (
        <TranslatedWorkHistoryItem data={data} key={`${data.company}:${data.title}`} />
      ))}
    </Section>
  );
};
