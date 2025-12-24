import { Box, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Page } from '@/components/page/page';
import type { TranslatableHandle } from '@/i18n/i18n-title-manager';
import { AtAGlance } from '@/sections/at-a-glance/at-a-glance';
import { ContactInfo } from '@/sections/contact-info/contact-info';
import { ExecutiveSummary } from '@/sections/executive-summary/executive-summary';
import { Projects } from '@/sections/projects/projects';
import { WorkHistory } from '@/sections/work-history/work-history';
import type { TranslatorFn } from '@/utils/translator.type';

import classes from './resume.module.css';

export const handle: TranslatableHandle = {
  title: (t: TranslatorFn) => t('page.resume', 'Resume | Aleksi Asikainen | Software Architecture and Development'),
};

export default function Resume() {
  return (
    <Box className={classes.resume}>
      <Page>
        <Title order={1}>Aleksi Asikainen</Title>

        <Title order={5} component='p'>
          <Trans i18nKey='resume.professionalTitles'>
            CTO, Chief Architect, Principal Engineer, <wbr />
            Founding Engineer, Senior Staff Engineer
          </Trans>
        </Title>

        <ContactInfo />
        <ExecutiveSummary />
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
