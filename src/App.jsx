import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './home';
import Game from './moGame';
import Login from './login';
import Counter from './moCounter';
import About from './moAbout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}