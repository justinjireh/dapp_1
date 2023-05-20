import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "./Home";
import Site from "./Site";

const Rotas = () => {
   return(
       <BrowserRouter>
           <Route component = { Home }  path="/"  >
           <Route component = { Site }  path="/site" ></Route>
           </Route>
           
       </BrowserRouter>
   )
}

export default Rotas;