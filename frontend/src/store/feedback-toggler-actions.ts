import { Status, toggleFeedback } from '../store/feedback';
import store from './store';

export const toggleErrorFeedback = (err: Error | string) => {
  if (err instanceof Error) {
    store.dispatch(
      toggleFeedback({
        status: Status.ERROR,
        message:
          err.message === 'Failed to fetch'
            ? 'Unexpected server error: Failed to fetch.'
            : err.message,
        showTime: 4,
      })
    );
  } else {
    store.dispatch(
      toggleFeedback({
        status: Status.ERROR,
        message: `Unexpected error: ${err}`,
        showTime: 4,
      })
    );
  }
};

export const toggleWarningFeedback = (message: string, showTime = 3) => {
  store.dispatch(
    toggleFeedback({
      status: Status.WARNING,
      message,
      showTime,
    })
  );
}

export const toggleSuccessFeedback = (message: string, showTime = 2) => {
  store.dispatch(
    toggleFeedback({
      status: Status.SUCCESS,
      message,
      showTime,
    })
  );
}
