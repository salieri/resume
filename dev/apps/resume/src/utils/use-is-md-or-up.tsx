import { useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';

const useChangeBasedMediaQuery = (mediaQueryString: string) => {
  const [matches, setMatches] = useState<null | boolean>(null);

  useEffect(() => {
    const mediaQueryList = globalThis.matchMedia(mediaQueryString);
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    const listener = () => setMatches(mediaQueryList.matches);

    listener();
    mediaQueryList.addEventListener('change', listener);

    return () => mediaQueryList.removeEventListener('change', listener);
  }, [mediaQueryString]);

  return matches;
};

export const useIsMdOrUp = () => {
  const theme = useMantineTheme();

  return useChangeBasedMediaQuery(`(min-width: ${theme.breakpoints.md})`);
};
