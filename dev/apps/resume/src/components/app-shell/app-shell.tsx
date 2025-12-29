import { AppShell, Typography } from '@mantine/core';
import type { ReactNode } from 'react';

import { ConfigMenu } from '~/components/config-menu/config-menu';
import { DisplayOnly } from '~/components/display-only/display-only';

export interface ResumeAppShellProps {
  children?: ReactNode;
}

export const ResumeAppShell = (props: ResumeAppShellProps) => {
  return (
    <Typography>
      <AppShell maw={640} mr='auto' ml='auto' p='md' withBorder={false}>
        <AppShell.Main>
          <DisplayOnly>
            <ConfigMenu />
          </DisplayOnly>

          {props.children}
        </AppShell.Main>
      </AppShell>
    </Typography>
  );
};
