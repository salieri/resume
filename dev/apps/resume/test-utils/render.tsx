import { theme } from '@faust/theme';
import { MantineProvider } from '@mantine/core';
import { render as testingLibraryRender } from '@testing-library/react';

export function render(ui: React.ReactNode): ReturnType<typeof testingLibraryRender> {
  return testingLibraryRender(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={theme} env='test'>
        {children}
      </MantineProvider>
    ),
  });
}
