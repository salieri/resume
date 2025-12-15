import '@mantine/core/styles.css';

import { theme } from '@faust/theme';
import { MantineProvider } from '@mantine/core';

import { Router } from './router';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  );
}
