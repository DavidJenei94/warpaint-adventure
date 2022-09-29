import { useEffect } from 'react';

// To handle data changes in component that used http-hook sendRequest
// useEffect needed to handle the values get in useHttp
// (this is why an executable callback in useHttp does not work 
// as there are not available all necessary fields, eg. from useHttp)
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
