import { Anchor, Box, Stack, Text, Title } from '@mantine/core';

import type { Project } from './data';
import classes from './item.module.css';

export interface ProjectItemProps {
  data: Project;
}

export const ProjectItem = (props: ProjectItemProps) => {
  const { data } = props;

  return (
    <Box className={`${classes.projectItem} projectItem`}>
      <Stack gap={0}>
        <Title order={3} mb={0} lh='100%' className={classes.title}>
          {data.name}
        </Title>
        <Anchor href={data.url} mb='1em'>{data.url.replace('https://', '')}</Anchor>
      </Stack>
      <Text className={classes.description}>
        {data.description}
      </Text>
    </Box>
  );
};
