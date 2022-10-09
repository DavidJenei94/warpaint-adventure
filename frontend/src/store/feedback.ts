import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';

export enum FeedbackStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  PENDING = 'pending',
}

interface FeedbackBaseState {
  message: string;
  status: FeedbackStatus;
};

export interface FeedbackState extends FeedbackBaseState {
  shown?: boolean;
  showTime?: number;
};

const initialFeedbackState: FeedbackState = {
  message: '',
  shown: false,
  status: FeedbackStatus.SUCCESS,
  showTime: 2,
};

let hideFeedbackTimer: ReturnType<typeof setTimeout>;

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: initialFeedbackState,
  reducers: {
    showFeedback: (state, action: PayloadAction<FeedbackState>) => {
      state.shown = true;
      state.message = action.payload.message;
      state.status = action.payload.status;
    },
    hideFeedback: (state) => {
      state.shown = false;
      if (hideFeedbackTimer) {
        clearTimeout(hideFeedbackTimer);
      }
    },
    pendingFeedback: (state) => {
      state.status = FeedbackStatus.PENDING;
    },
    resetFeedback: (state) => {
      state.status = FeedbackStatus.SUCCESS;
    },
  },
});

export const toggleFeedback =
  ({ message, status, showTime }: FeedbackState) =>
  (dispatch: AppDispatch) => {
    dispatch(feedbackSlice.actions.showFeedback({ status, message }));

    const waitTime = showTime
      ? showTime * 1000
      : initialFeedbackState.showTime! * 1000;

    hideFeedbackTimer = setTimeout(() => {
      dispatch(feedbackSlice.actions.hideFeedback());
    }, waitTime);
  };

export const feedbackActions = feedbackSlice.actions;

export default feedbackSlice.reducer;
