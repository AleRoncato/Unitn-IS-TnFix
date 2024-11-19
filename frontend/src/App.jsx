// prima pagina che viene caricata
//contiene routing, returna le pagione HTML, ecc

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { Home } from "./pages";

function App() {
  // const [count, setCount] = useState(0)

  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const router = createBrowserRouter([
    //per il routing, in router ci salvo tutte le pagine della web app (URL)
    {
      path: "/",
      element: <Home theme={theme} toggleTheme={toggleTheme} />,
      children: [],
    },
  ]);

  return (
    // returna il codice HTML
    <RouterProvider router={router} />
  );
}

export default App;
