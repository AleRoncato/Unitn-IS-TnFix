import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PrivateRoutes from "./utils/privateRoutes";
import { AuthProvider } from "./utils/AuthProvider";

import { Home } from "./pages";
import LoginForm from "./pages/login";
import AddPage from "./pages/addPage";


function App() {


  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/add-ticket" element={<AddPage />} />
          </Route>
          <Route path="*" element={<h1 className="fixed h-[100vh] w-full text-black bg-white flex justify-center items-center"> <p>Not Found</p></h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
