import { Box, Title } from '@mantine/core';

import { Charts } from '@/sections/charts/charts';
import { ExecutiveSummary } from '@/sections/executive-summary/executive-summary';
import { Projects } from '@/sections/projects/projects';
import { WorkHistory } from '@/sections/work-history/work-history';
import type { TranslatableHandle } from '@/utils/i18n-title-manager';

import classes from './resume.module.css';

export const handle: TranslatableHandle = {
  title: 'Resume | Aleksi Asikainen | Software Architecture and Development',
  titleKey: 'resume',
};

export default function Resume() {
  return (
    <Box className={classes.resume}>
      <Title order={1}>Aleksi Asikainen</Title>

      <ExecutiveSummary />
      <Charts />
      <WorkHistory />
      <Projects />
    </Box>
  );
}
