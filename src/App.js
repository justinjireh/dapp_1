import React from 'react';


//import { Route, Routes,   BrowserRouter } from "react-router-dom";
import { Route, Routes,  HashRouter as BrowserRouter } from "react-router-dom";

import Home from "./Home";
import Site from "./Site";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />}  ></Route>
                    <Route exact path="Site" element={<Site />}  />
                
            </Routes>

        </BrowserRouter>
    );
}