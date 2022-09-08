import { ChangeEvent, useReducer } from 'react';

type InputValidation = (value: string) => boolean;

type State = {
  value: string;
  isTouched: boolean;
};

type StateAction = {
  type: string;
  value: string;
};

const initialInputState: State = {
  value: '',
  isTouched: false,
};

const inputStateReducer = (state: State, action: StateAction) => {
  if (action.type === 'INPUT') {
    return {
      value: action.value,
      isTouched: state.isTouched,
    };
  }
  if (action.type === 'BLUR') {
    return {
      value: state.value,
      isTouched: true,
    };
  }
  if (action.type === 'RESET') {
    return {
      value: '',
      isTouched: false,
    };
  }

  return initialInputState;
};

const useInput = (validateValue: InputValidation, validateEqualToValue?: string) => {
  const [inputState, dispatchInput] = useReducer(
    inputStateReducer,
    initialInputState
  );

  let valueIsValid = validateValue(inputState.value);
  if (validateEqualToValue) {
    valueIsValid = valueIsValid && inputState.value === validateEqualToValue
  }
  const hasError = !valueIsValid && inputState.isTouched;

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    dispatchInput({ type: 'INPUT', value: event.target.value });
  };

  const blurHandler = () => {
    dispatchInput({ type: 'BLUR', value: '' });
  };

  const reset = () => {
    dispatchInput({ type: 'RESET', value: '' });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    changeHandler,
    blurHandler,
    reset,
  };
};

export default useInput;
