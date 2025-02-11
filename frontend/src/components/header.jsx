import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  CrossIcon,
  LogOut,
  Moon,
  Plus,
  SidebarClose,
  SidebarIcon,
  Sun,
} from "lucide-react";
import { useAuth } from "../utils/AuthProvider";
import Sidebar from "./sidebar";
import logo from "../assets/logo-no-background.svg";




export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);


  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header
        id="outer-container page-wrap"
        className=" bg-neutral-900 text-white py-4 px-6 shadow-md "
      >
        <nav className="flex items-center justify-between w-full">
          <div className="left flex items-center space-x-6">
            <ul className="flex space-x-6 items-center">
              <li
                onClick={toggleSidebar}
                className={`
                   hover:bg-neutral-700
               
                   p-2 rounded-full`}
              >
                <div className="cursor-pointer flex flex-col items-center relative group">
                  <SidebarIcon
                    className={`text-white`}
                    size={28}
                  />
                </div>
              </li>
              <li
                onClick={() => navigate("/add-ticket")}
                className={`hover:bg-neutral-700 p-2 rounded-full`}
              >
                <div className="cursor-pointer flex flex-col items-center relative group">
                  <Plus
                    className={`text-white`}
                    size={30}
                  />
                </div>

              </li>

            </ul>
          </div>

          <Sidebar
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
            
          />

          <div
            onClick={() => navigate("/home")}
            className="center space-x-6 text-2xl font-bold text-gold cursor-pointer"
          >
            {/* fix this logo */}
            <img src={logo} alt="" />

          </div>

          <div className="right flex items-center space-x-6">
            <ul className="flex space-x-6 items-center">
              <li className={`ml-2`} onClick={handleLogout}>
                <div className="mr-2 cursor-pointer flex flex-col items-center relative group">
                  <LogOut
                    size={24}
                    className={"white hover:text-red-400"}
                  />
                  <div className="absolute bottom-0 translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Logout
                  </div>
                </div>
              </li>
              {/* <li>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
                >
                  {theme === "dark" ? (
                    <Sun className="hover:text-yellow-500" size={24} />
                  ) : (
                    <Moon className="hover:text-neutral-300 " size={24} />
                  )}
                </button>
              </li> */}
            </ul>
          </div>
        </nav>
      </header>
      <Outlet />
      {/* Importante perche senza outlet non carica i nodi figlio del padre (sicconme questa page è children di Header [come tutta la app]) */}
    </>
  );
};
