import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import './print/styles.css';

import { theme } from '@faust/theme';
import {
  ColorSchemeScript, DirectionProvider,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';
import i18n from 'i18next';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import { initI18n } from '~/i18n/i18n';
import { I18nTitleManager } from '~/i18n/i18n-title-manager';

// @ts-expect-error
import type { Route } from './+types/root';
import { ResumeAppShell } from './components/app-shell/app-shell';

// eslint-disable-next-line @stylistic/array-bracket-newline
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
// eslint-disable-next-line @stylistic/array-bracket-newline
];

void initI18n();

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
          href='https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          {i18n.isInitialized && (
            <>
              <I18nTitleManager />
              <DirectionProvider initialDirection='ltr' detectDirection={false}>
                <MantineProvider theme={theme}>
                  <ResumeAppShell>{children}</ResumeAppShell>
                </MantineProvider>
              </DirectionProvider>
            </>
          )}
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
  const { t } = useTranslation();
  let message = t('error.oops', 'Oops!');
  let details = t('error.unexpected', 'An unexpected error occurred.');
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404
      ? t('error.notFoundTitle', '404')
      : t('error.errorTitle', 'Error');

    details
      = error.status === 404
        ? t('error.notFoundDetails', 'The requested page could not be found.')
        : error.statusText || details;
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
