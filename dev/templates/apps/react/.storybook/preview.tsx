import '@mantine/core/styles.css';

import { theme } from '@faust/theme';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import type { ReactElement } from 'react';

export const parameters = {
  layout: 'fullscreen',
  options: {
    showPanel: false,
    // @ts-expect-error this file is evaluated as JAVASCRIPT!!?
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    storySort: (a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }),
  },
  backgrounds: { disable: true },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Mantine color scheme',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
    },
  },
};

export const decorators = [
  (renderStory: () => ReactElement, context: { globals: { theme: string } }) => {
    const scheme = (context.globals.theme || 'light') as 'light' | 'dark';

    return (
      <MantineProvider theme={theme} forceColorScheme={scheme}>
        <ColorSchemeScript />
        {renderStory()}
      </MantineProvider>
    );
  },
];
