import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { PageIndex } from './components/PageIndex';
import { PageLogin } from './components/PageLogin';
import { PageRegistration } from './components/PageRegistration';



const history = createMemoryHistory();

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PageIndex />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/registration" element={<PageRegistration />} />
      </Routes>
    </>
  );
}

export default App;