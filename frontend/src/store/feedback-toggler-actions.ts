import { FeedbackStatus, toggleFeedback } from '../store/feedback';
import store from './store';

export const toggleErrorFeedback = (err: Error | string) => {
  if (err instanceof Error) {
    store.dispatch(
      toggleFeedback({
        status: FeedbackStatus.ERROR,
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
        status: FeedbackStatus.ERROR,
        message: `Unexpected error: ${err}`,
        showTime: 4,
      })
    );
  }
};

export const toggleWarningFeedback = (message: string, showTime = 3) => {
  store.dispatch(
    toggleFeedback({
      status: FeedbackStatus.WARNING,
      message,
      showTime,
    })
  );
}

export const toggleSuccessFeedback = (message: string, showTime = 2) => {
  store.dispatch(
    toggleFeedback({
      status: FeedbackStatus.SUCCESS,
      message,
      showTime,
    })
  );
}
