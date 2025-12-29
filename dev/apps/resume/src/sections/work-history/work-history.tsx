import { Title } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';

import { Section } from '~/components/section/section';
import { WorkHistoryItem } from '~/sections/work-history/item';

import { data } from './data';

export const WorkHistory = () => {
  const { t } = useTranslation();

  return (
    <Section>
      <Title order={2}>
        <Trans i18nKey='workHistory.title'>Work History</Trans>
      </Title>

      {data(t).map((item) => (
        <WorkHistoryItem data={item} key={item.id} />
      ))}
    </Section>
  );
};
