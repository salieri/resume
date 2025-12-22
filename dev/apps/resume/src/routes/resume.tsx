import { Box, Text, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Page } from '@/components/page/page';
import { PrintOnly } from '@/components/print-only/print-only';
import { AtAGlance } from '@/sections/at-a-glance/at-a-glance';
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

        <Title order={5} component='p'>
          <Trans>
            CTO, Chief Architect, Principal Engineer, <wbr />
            Founding Engineer, Senior Staff Engineer
          </Trans>
        </Title>

        <ContactInfo />

        <ExecutiveSummary />
      </Page>

      <Page>
        <AtAGlance />
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
