/* eslint-disable no-unused-vars */
import React from "react";
import SideNavbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={SideNavbar} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
