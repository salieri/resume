import { useEffect, useState } from 'react';

/**
 * Returns true after the component hydrates on the client.
 */
export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
};
