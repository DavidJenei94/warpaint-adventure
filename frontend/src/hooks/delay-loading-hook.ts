import { useEffect, useState } from 'react';

// On updating components with fetching
// To give a little delay before the LoadingIcon is displayed
// Preventing these shorts flashes grants greater user experience
const useDelayLoading = (statuses: (string | null)[]) => {
  const [loadDelay, setLoadDelay] = useState<boolean>(false);

  useEffect(() => {
    setLoadDelay(false);
    let loadingIconDelay: NodeJS.Timeout;

    if (statuses.some((status) => status === 'pending')) {
      loadingIconDelay = setTimeout(() => {
        setLoadDelay(true);
      }, 100);
    }

    return () => {
      clearTimeout(loadingIconDelay);
    };
  }, [...statuses]);

  return loadDelay;
};

export default useDelayLoading;
