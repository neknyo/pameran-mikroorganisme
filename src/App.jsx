import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './home';
import Game from './game';
import Login from './login';
import Counter from './counter';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}