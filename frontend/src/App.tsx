import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Main from './components/Layout/Main';
import MenuBar from './components/Layout/MenuBar';
import LoadingIcon from './components/UI/LoadingIcon';
import NotFound from './pages/NotFound';

import { authActions } from './store/auth';
import { useAppDispatch, useAppSelector } from './hooks/redux-hooks';
import { refreshToken } from './store/auth-actions';

import './App.scss';
import FeedbackBar, { FeedbackBar2 } from './components/UI/FeedbackBar';

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
  const user = useAppSelector((state) => state.auth);
  const feedback = useAppSelector((state) => state.feedback);

  // Start timer to log them out if they are over expiresIn period
  useEffect(() => {
    let logoutTimeout: NodeJS.Timeout;
    if (user.isAuthenticated) {
      logoutTimeout = setTimeout(() => {
        dispatch(authActions.logout());
      }, user.expiresIn * 1000);

      // clear Timeout if app is left
      // It will be checked in auth store
      return clearTimeout(logoutTimeout);
    }
  }, [dispatch, user.isAuthenticated]);

  useEffect(() => {
    refreshToken(user.token);
  }, [dispatch, user.isAuthenticated]);

  // console.log(feedback.shown);
  

  return (
    <>
      {feedback.shown && (
        <FeedbackBar2 status={feedback.status}>{feedback.message}</FeedbackBar2>
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
