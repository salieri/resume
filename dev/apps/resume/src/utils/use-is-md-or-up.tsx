import { useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';

const betterMediaQuery = (mediaQueryString: string) => {
  const [matches, setMatches] = useState<null | boolean>(null);

  useEffect(() => {
    const mediaQueryList = globalThis.matchMedia(mediaQueryString);
    const listener = () => setMatches(!!mediaQueryList.matches);

    listener();
    mediaQueryList.addEventListener('change', listener);

    return () => mediaQueryList.removeEventListener('change', listener);
  }, [mediaQueryString]);

  return matches;
};

export const useIsMdOrUp = () => {
  const theme = useMantineTheme();

  return betterMediaQuery(`(min-width: ${theme.breakpoints.md})`);

  // const theme = useMantineTheme();
  //
  // return useMediaQuery(`(min-width: ${theme.breakpoints.md})`, false, {
  //   getInitialValueInEffect: false,
  // });
};
