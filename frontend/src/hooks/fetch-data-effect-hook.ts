import { useEffect } from 'react';

// To handle data changes in components that use http-hook sendRequest.
// useEffect is needed to handle the values get back in useHttp sendRequest.
// (this is why an executable callback in useHttp does not work 
// as the states are not available (return empty value) in the function)
const useFetchDataEffect = (
  executableFunction: () => void,
  status: string | null,
  error: string | null,
  data: any
) => {
  useEffect(() => {
    if (status === 'completed' && !error) {
      executableFunction();
    }
  }, [status, error, data]);
};

export default useFetchDataEffect;
