import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

import { theme } from '@faust/theme';
import {
  AppShell,
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
  Typography,
} from '@mantine/core';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import { Body } from '@/components/body/body';
import { Footer } from '@/components/footer/footer';
import { Sidebar } from '@/components/sidebar/sidebar';
import { ContactInfo } from '@/sections/contact-info/contact-info';
import { I18nTitleManager } from '@/utils/i18n-title-manager';

// @ts-expect-error
import type { Route } from './+types/root';
import { ConfigMenu } from './components/config-menu/config-menu';

export const links: Route.LinksFunction = () => [
  // { rel: "preconnect", href: "https://fonts.googleapis.com" },
  // {
  //   rel: "preconnect",
  //   href: "https://fonts.gstatic.com",
  //   crossOrigin: "anonymous",
  // },
  // {
  //   rel: "stylesheet",
  //   href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  // },
];

void i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  // debug: true,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <ColorSchemeScript />
        <Meta />
        <Links />

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Merriweather+Sans:ital,wght@0,300..800;1,300..800&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          <I18nTitleManager />
          <MantineProvider theme={theme}>
            <AppShell maw={640} mr='auto' ml='auto' withBorder={false}>
              <Typography>
                <Sidebar>
                  <ContactInfo />
                </Sidebar>

                <ConfigMenu />

                <Body>
                  {children}

                  <Footer>
                    <ContactInfo />
                  </Footer>
                </Body>
              </Typography>
            </AppShell>
          </MantineProvider>
        </I18nextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
