import React from 'react';
import Home from './pages/Home';

import './App.scss';
import MenuBar from './components/Layout/MenuBar';

function App() {
  return (
    <div className="App">
      <MenuBar />
      <Home />
    </div>
  );
}

export default App;
