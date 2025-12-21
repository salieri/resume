import { useMediaQuery } from '@mantine/hooks';

export const useIsPrint = () => {
  return useMediaQuery('print', false, {
    getInitialValueInEffect: true,
  });
};
