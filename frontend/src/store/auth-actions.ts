import { fetchToken } from './auth';
import store from './store';

export const refreshToken = async (token: string) => {
  if (!token) {
    return;
  }

  try {
    return await store.dispatch(fetchToken(token));
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
};


