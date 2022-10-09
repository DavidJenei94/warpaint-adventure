import { useEffect } from 'react';

// To handle data changes in components that use http-hook sendRequest.
// useEffect is needed to handle the values get back in useHttp sendRequest.
// (this is because an executable callback in useHttp does not work
// as the states are not available (return empty value) in the function)
const useFetchDataEffect = (
  executableFunction: () => void,
  dependencies: any[]
) => {
  const [status, error, data] = dependencies;
  useEffect(() => {
    if (status === 'completed' && !error) {
      executableFunction();
    }
  }, [status, error, data]);
};

export default useFetchDataEffect;
