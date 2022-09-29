import { useEffect, useState } from 'react';

// On updating components with fetching
// To give a little delay before the LoadingIcon is displayed
// Preventing these shorts flashes grants greater user experience
const useDelayLoading = (statuses: (string | null)[]) => {
  const [loadDelay, setLoadDelay] = useState(false);

  useEffect(() => {
    // dispatch(feedbackActions.resetFeedback());
    setLoadDelay(false);
    let loadingIconDelay: ReturnType<typeof setTimeout>;

    if (statuses.some((status) => status === 'pending')) {
      loadingIconDelay = setTimeout(() => {
        // dispatch(feedbackActions.pendingFeedback());
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
