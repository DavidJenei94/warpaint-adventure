import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth';
import feedbackReducer from './feedback';

const store = configureStore({
  reducer: { auth: authReducer, feedback: feedbackReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

// Redux with ts:
// https://redux.js.org/usage/usage-with-typescript
// https://redux-toolkit.js.org/api/createAsyncThunk
