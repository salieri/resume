import { Anchor, Card, Text, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import type { WorkHistory } from '@/sections/work-history/data';

export interface WorkHistoryItemProps {
  data: WorkHistory;
}

export const TranslatedWorkHistoryItem = (props: WorkHistoryItemProps) => {
  const { data } = props;
  const workKey = `workHistory.${data.company}.${data.title}`;

  return (
    <Card>
      <Title order={3}>
        <Trans i18nKey={`${workKey}.title`}>{data.title}</Trans>
      </Title>
      <Text>
        {data.url ? (
          <Anchor href={data.url} target='_blank' rel='noreferrer'>
            {data.company}
          </Anchor>
        ) : (
          data.company
        )}{' '}
        | {data.startDate} – {data.endDate}
      </Text>

      <Text>
        <Trans i18nKey={`${workKey}.summary`}>{data.summary}</Trans>
      </Text>

      <Text>
        <Trans i18nKey={`${workKey}.details`}>{data.details}</Trans>
      </Text>

      {data.notes && (
        <Text>
          <small>
            <Trans i18nKey={`${workKey}.notes`}>{data.notes}</Trans>
          </small>
        </Text>
      )}
    </Card>
  );
};
