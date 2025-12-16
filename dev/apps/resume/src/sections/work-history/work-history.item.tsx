import { Anchor, Card, Text, Title } from '@mantine/core';

import type { WorkHistory } from '@/sections/work-history/data';

export interface WorkHistoryItemProps {
  data: WorkHistory;
}

export const TranslatedWorkHistoryItem = (props: WorkHistoryItemProps) => {
  const { data } = props;

  return (
    <Card>
      <Title order={3}>{data.title}</Title>
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

      <Text>{data.summary}</Text>

      <Text>{data.details}</Text>

      {data.notes && <Text>{data.notes}</Text>}
    </Card>
  );
};
