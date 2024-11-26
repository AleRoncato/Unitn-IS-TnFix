// prima pagina che viene caricata
//contiene routing, returna le pagione HTML, ecc

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import LoginForm from "./components/LoginForm";
import PrivateRoutes from "./components/privateRoutes";
import { AuthProvider } from "./components/AuthProvider";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0)

  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };


  return (
    <Router>
      <AuthProvider>
        {" "}
        <Routes>
          <Route element={<PrivateRoutes />}>
            {" "}
            <Route path="/home" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
          </Route>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
