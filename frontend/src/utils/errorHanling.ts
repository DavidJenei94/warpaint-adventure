import { Status, toggleFeedback } from '../store/feedback';
import store from '../store/store';

export const errorHandlingFetch = (err: Error | string) => {
  if (err instanceof Error) {
    store.dispatch(
      toggleFeedback({
        status: Status.ERROR,
        message:
          err.message === 'Failed to fetch'
            ? 'Unexpected server error.'
            : err.message,
        showTime: 4,
      })
    );
  } else {
    store.dispatch(
      toggleFeedback({
        status: Status.ERROR,
        message: `Unexpected error: ${err}.`,
        showTime: 4,
      })
    );
  }
};
