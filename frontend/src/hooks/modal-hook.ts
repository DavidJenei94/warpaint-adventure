import { useState } from 'react';

const useModal = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [response, setResponse] = useState<string[]>(['']);

  const toggleModal = () => {
    setIsShown((prevState) => !prevState);
  };

  return {
    isShown,
    toggleModal,
    response,
    setResponse,
  };
};

export default useModal;
