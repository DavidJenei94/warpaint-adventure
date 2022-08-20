import React, { Suspense } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';

import './App.scss';
import Main from './components/Layout/Main';

import MenuBar from './components/Layout/MenuBar';
import LoadingIcon from './components/UI/LoadingIcon';
import NotFound from './pages/NotFound';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Packing = React.lazy(() => import('./pages/Packing'));
const AdventureDesigner = React.lazy(() => import('./pages/AdventureDesigner'));
const AdventureViewer = React.lazy(() => import('./pages/AdventureViewer'));
const Registration = React.lazy(() => import('./pages/Registration'));
const Premium = React.lazy(() => import('./pages/Premium'));

function App() {
  return (
    <>
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
