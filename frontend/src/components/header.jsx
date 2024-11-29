import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CrossIcon, Moon, SidebarClose, Sun } from "lucide-react";
import {
  IconLogout,
  IconLayoutSidebar,
} from "@tabler/icons-react";
import { useAuth } from "../utils/AuthProvider";
import Sidebar from "./sidebar";

export const Header = ({ theme, toggleTheme }) => {

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
    <div>
      <header
        id="outer-container page-wrap"
        className={`${theme === "dark"
          ? "bg-neutral-900 text-white"
          : "bg-neutral-100 text-neutral-900"
          } py-4 px-6 shadow-md top-0 left-0 w-full z-50`}
      >
        <nav className="flex items-center justify-between w-full">
          <div className="left flex items-center space-x-6">
            <button
              onClick={toggleSidebar}
              className={`${theme === "dark"
                ? "hover:bg-neutral-700"
                : "hover:bg-neutral-300"
                } p-2 rounded-full`}
            >
              <IconLayoutSidebar
                className={`${theme === "dark" ? "text-white" : "text-black"}`}
                size={30}
              />
            </button>
          </div>
  
          <Sidebar
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
            theme={theme}
          />

          <div
            onClick={() => navigate("/home")}
            className=" pl-12 center space-x-6 text-2xl font-bold text-gold cursor-pointer"
          >
            TN FIX
          </div>

          <div className="right flex items-center space-x-6">
            <ul className="flex space-x-6 items-center">
              <li style={{ marginLeft: "10px" }} onClick={handleLogout}>
                <div
                  className="mr-2 cursor-pointer flex flex-col items-center relative group"
                >
                  <IconLogout
                    size={30}
                    className={`${theme === "dark" ? "white hover:text-red-400" : "black hover:text-red-500"
                      }`}
                  />
                  <div className="absolute bottom-0 translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Logout
                  </div>
                </div>
              </li>
              <li>
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
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <Outlet />
      {/* Importante perche senza outlet non carica i nodi figlio del padre (sicconme questa page è children di Header [come tutta la app]) */}
    </div >
  );
};
