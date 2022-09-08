import { useState } from 'react';

const useModal = () => {
  const [isShown, setIsShown] = useState(false);
  const [response, setResponse] = useState<string[]>([""]);

  const toggleModal = () => {
    setIsShown((prevState) => {
      return !prevState;
    });
  };

  return {
    isShown,
    toggleModal,
    response,
    setResponse,
  };
};

export default useModal;
