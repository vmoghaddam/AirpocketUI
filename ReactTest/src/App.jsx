import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Layout from "./pages/layout";
import Login from "./pages/login";
import Home from "./pages/home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
   


    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="Login" element={<Login />} />
                        {/*<Route path="*" element={<NoPage />} />*/}
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
