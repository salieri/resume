import { Box, Title } from '@mantine/core';

import { Page } from '@/components/page/page';
import { PrintOnly } from '@/components/print-only/print-only';
import { Charts } from '@/sections/charts/charts';
import { ContactInfo } from '@/sections/contact-info/contact-info';
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
      <Page>
        <Title order={1}>Aleksi Asikainen</Title>
        <ExecutiveSummary />

        <PrintOnly>
          <ContactInfo />
        </PrintOnly>

        <Charts />
      </Page>
      <Page>
        <WorkHistory />
      </Page>
      <Page>
        <Projects />
      </Page>
    </Box>
  );
}
