import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PrivateRoutes from "./utils/privateRoutes";
import { AuthProvider } from "./utils/AuthProvider";

import { Home } from "./pages";
import LoginForm from "./pages/login";
import AddPage from "./pages/addPage";

import "./App.css";

function App() {


  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };


  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/add-ticket" element={<AddPage theme={theme} toggleTheme={toggleTheme} />} />
          </Route>
          <Route path="*" element={<h1 className="fixed h-[100vh] w-full text-black bg-white flex justify-center items-center"> <p>Not Found</p></h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
