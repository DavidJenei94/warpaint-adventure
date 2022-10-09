import { useCallback, useReducer } from 'react';
import {
  toggleErrorFeedback,
  toggleSuccessFeedback,
} from '../store/feedback-toggler-actions';

enum FetchActionKind {
  SEND = 'SEND',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// An interface for our actions
interface FetchAction {
  type: FetchActionKind;
  payload: any;
}

// An interface for our state
interface FetchState {
  status: string | null;
  data: any;
  error: string | null;
}

const httpReducer = (state: FetchState, action: FetchAction) => {
  if (action.type === FetchActionKind.SEND) {
    return {
      status: 'pending',
      data: null,
      error: null,
    };
  }

  if (action.type === FetchActionKind.SUCCESS) {
    return {
      status: 'completed',
      data: action.payload.responseData,
      error: null,
    };
  }

  if (action.type === FetchActionKind.ERROR) {
    return {
      status: 'completed',
      data: null,
      error: action.payload.errorMessage,
    };
  }

  return state;
};

const useHttp = (
  requestFunction: (value: any) => Promise<any>,
  successFeedback = true
) => {
  const [httpState, dispatchHttpState] = useReducer(httpReducer, {
    status: null,
    data: null,
    error: null,
  });

  // useCallback if you would like to use in a useEffect dep array
  // it does not create new function object end does infinite loop
  const sendRequest = useCallback(
    async (requestData: any) => {
      dispatchHttpState({
        type: FetchActionKind.SEND,
        payload: {},
      });
      
      try {
        const responseData = await requestFunction(requestData);

        dispatchHttpState({
          type: FetchActionKind.SUCCESS,
          payload: { responseData },
        });

        if (successFeedback) {
          toggleSuccessFeedback(responseData.message);
        }
      } catch (error: any) {
        toggleErrorFeedback(error);
      }
    },
    [requestFunction]
  );

  return { sendRequest, ...httpState };
};

export default useHttp;
