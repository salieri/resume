import { Anchor, Box, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import type { Project } from './data';
import classes from './item.module.css';

export interface ProjectItemProps {
  data: Project;
}

export const TranslatedProjectItem = (props: ProjectItemProps) => {
  const { data } = props;
  const projectKey = `projects.${data.name}`;
  const { t } = useTranslation();

  return (
    <Box className={`${classes.projectItem} projectItem`}>
      <Stack gap={0}>
        <Title order={3} mb={0} lh='100%' className={classes.title}>{t(`${projectKey}.name`, data.name)}</Title>
        <Anchor href={data.url} mb='1em'>{data.url.replace('https://', '')}</Anchor>
      </Stack>
      <Text className={classes.description}>
        {t(`${projectKey}.description`, data.description)}
      </Text>
    </Box>
  );
};
