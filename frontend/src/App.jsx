// prima pagina che viene caricata
//contiene routing, returna le pagione HTML, ecc

import { Header } from './components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from "./pages"

function App() {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter([ //per il routing, in router ci salvo tutte le pagine della web app (URL)
    {
      path: '/',
      element: <Header />,
      children: [{
        path: '/',
        element: <Home  />
      },]
  }])

  return ( // returna il codice HTML
    <RouterProvider router={router} />  

  )

 
}


export default App
