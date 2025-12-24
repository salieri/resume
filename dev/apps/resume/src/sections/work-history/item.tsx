import { Anchor, Box, Text, Title } from '@mantine/core';

import type { WorkHistory } from '@/sections/work-history/data';

import classes from './item.module.css';

export interface WorkHistoryItemProps {
  data: WorkHistory;
}

export const WorkHistoryItem = (props: WorkHistoryItemProps) => {
  const { data } = props;

  return (
    <Box className={`${classes.workHistoryItem} workHistoryItem`}>
      <Title order={3}>
        {data.title}
      </Title>
      <Text className={classes.companyAndDate}>
        <span className={classes.company}>
          {data.url
            ? (
                <Anchor href={data.url} target='_blank' rel='noreferrer'>
                  {data.company}
                </Anchor>
              )
            : (
                data.company
              )}{' '}
        </span>
        | {data.startDate} – {data.endDate}
      </Text>

      <Text size='sm' className={`${classes.summary} summary`}>
        {data.summary}
      </Text>

      <Text className={`${classes.details} details`}>
        {data.details}
      </Text>

      {data.notes && (
        <Text className={`${classes.notes} notes`}>
          <small>
            {data.notes}
          </small>
        </Text>
      )}
    </Box>
  );
};
