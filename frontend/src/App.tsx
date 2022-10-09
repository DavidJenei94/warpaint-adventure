import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { authActions, AuthState } from './store/auth';
import { useAppDispatch, useAppSelector } from './hooks/redux-hooks';
import { refreshToken } from './store/auth-actions';
import { FeedbackState } from './store/feedback';
import { toggleSuccessFeedback } from './store/feedback-toggler-actions';

import Main from './components/Layout/Main';
import MenuBar from './components/Layout/MenuBar';
import LoadingIcon from './components/UI/LoadingIcon';
import NotFound from './pages/NotFound';
import FeedbackBar from './components/UI/FeedbackBar';
import RoutePlanner from './pages/RoutePlanner';

import './App.scss';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Packing = React.lazy(() => import('./pages/Packing'));
const AdventureDesigner = React.lazy(() => import('./pages/AdventureDesigner'));
const AdventureViewer = React.lazy(() => import('./pages/AdventureViewer'));
const Registration = React.lazy(() => import('./pages/Registration'));
const Premium = React.lazy(() => import('./pages/Premium'));
const Profile = React.lazy(() => import('./pages/Profile'));

function App() {
  const dispatch = useAppDispatch();

  const user: AuthState = useAppSelector((state) => state.auth);
  const feedback: FeedbackState = useAppSelector((state) => state.feedback);

  // Start timer to log them out if they are over expiresIn period
  useEffect(() => {
    let logoutTimeout: NodeJS.Timeout;

    if (user.isAuthenticated) {
      logoutTimeout = setTimeout(() => {
        dispatch(authActions.logout());
        toggleSuccessFeedback('User is logged out! Have a nice day!');
      }, user.expiresIn * 1000);
    }

    return () => {
      // clear Timeout if app is left
      // Expire time will be checked and refreshed next webpage visit
      logoutTimeout && clearTimeout(logoutTimeout);
    };
  }, [dispatch, user]);

  useEffect(() => {
    refreshToken(user.token);
  }, [user]);

  return (
    <>
      {feedback.shown && (
        <FeedbackBar status={feedback.status}>{feedback.message}</FeedbackBar>
      )}
      <MenuBar />
      <Suspense fallback={<LoadingIcon />}>
        <Main>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/packing" element={<Packing />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/map">
              <Route path="routing" element={<RoutePlanner />} />
              <Route path="designer" element={<AdventureDesigner />} />
              <Route path="viewer" element={<AdventureViewer />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Main>
      </Suspense>
    </>
  );
}

export default App;
