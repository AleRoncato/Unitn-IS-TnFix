import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarClose } from "lucide-react";
import Filter from "./filter";

const Sidebar = ({ showSidebar, toggleSidebar, theme }) => {
  const navigate = useNavigate();

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleSidebar();
    }
  };

  return (
    <>


      {showSidebar &&
        <div
          onClick={handleOutsideClick}
          className={`fixed pl-80 inset-0 bg-black bg-opacity-50 z-40 ${!showSidebar ? "min-w-0" : ""
            }`}
        >
          <div
            className={`${theme === "dark" ? "bg-neutral-900" : "bg-white"} 
                        fixed left-0 top-0 h-full w-96 shadow-lg z-35 p-4 flex flex-col 
                        overflow-y-auto scroll-m-0`}
          >
            <button
              onClick={toggleSidebar}
              className={`${theme === "dark"
                ? "hover:bg-neutral-700"
                : "hover:bg-neutral-300"
                } ml-2 p-2 rounded-full self-start`}
            >
              <SidebarClose
                className={`${theme === "dark" ? "text-white" : "text-black"}`}
                size={30}
              />
            </button>

            <div className="h-full">
              <Filter theme={theme} />
            </div>
          </div>
        </div>
      }


      <Outlet />
    </>
  );
};

export default Sidebar;
