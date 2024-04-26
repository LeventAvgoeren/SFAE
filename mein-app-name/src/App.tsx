import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { PageIndex } from './components/PageIndex';
const history = createMemoryHistory();

function App() {
  return (
    <>
    <Router location={window.location} navigator={history}>
      <Routes>
        <Route path={"/"} element={<PageIndex />} />
      </Routes>
      </Router>
    </>
    
  
  );
}

export default App;
