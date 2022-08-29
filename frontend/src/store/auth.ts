import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import store from './store';

let logOutTimer: ReturnType<typeof setTimeout>;

const calculateExpirationTime = (expiresIn: number) => {
  const currentTime = new Date().getTime();
  return (currentTime + expiresIn * 1000).toString();
};

const calculateRemainingTime = (expirationTime: string) => {
  const currentTime = new Date().getTime();
  const remainingDuration = Number(expirationTime) - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  if (storedToken && storedExpirationDate) {
    const remainingTime = calculateRemainingTime(storedExpirationDate);
    console.log('storedToken');
    console.log(storedToken);
    console.log('remainingTime');
    console.log(remainingTime);

    // if less than x ms, get a new token
    // 1hr = 60 * 60 * 1000
    if (remainingTime > 60 * 1000) {
      return { token: storedToken, expiresIn: remainingTime };
    }
  }

  localStorage.removeItem('token');
  localStorage.removeItem('expirationTime');
  return null;
};

const tokenData = retrieveStoredToken();
console.log('tokenData');
console.log(tokenData);

type AuthBaseState = {
  token: string;
  expiresIn: number;
};

type AuthState = AuthBaseState & {
  isAuthenticated: boolean;
};

const initialAuthState: AuthState = tokenData
  ? { isAuthenticated: true, ...tokenData }
  : {
      token: '',
      isAuthenticated: false,
      expiresIn: 0,
    };

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (state, action: PayloadAction<AuthBaseState>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem(
        'expirationTime',
        calculateExpirationTime(action.payload.expiresIn)
      );
      logOutTimer = setTimeout(callLogout, action.payload.expiresIn);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = '';
      state.expiresIn = 0;
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      if (logOutTimer) {
        clearTimeout(logOutTimer);
      }
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchToken.pending, (state, action) => {})
    // builder.addCase(fetchToken.rejected, (state, action) => {})
    builder.addCase(fetchToken.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem(
        'expirationTime',
        calculateExpirationTime(action.payload.expiresIn)
      );
      logOutTimer = setTimeout(callLogout, action.payload.expiresIn);
    });
  },
});

const callLogout = () => {
  return (dispatch: typeof store.dispatch) => {
    console.log('callLogoutcalled');

    dispatch(authSlice.actions.logout);
  };
};

export const fetchToken = createAsyncThunk(
  'auth/fetchToken',
  async (token: string) => {
    const response = await fetch('http://localhost:4000/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    });
    const data = await response.json();

    return {
      token: data.user.token,
      expiresIn: data.user.expiresIn,
    };
  }
);

export const authActions = authSlice.actions;

export default authSlice.reducer;
