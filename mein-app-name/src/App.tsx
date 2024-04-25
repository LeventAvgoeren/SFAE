import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import { PageIndex } from './PageIndex';
import { createMemoryHistory } from 'history';
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
