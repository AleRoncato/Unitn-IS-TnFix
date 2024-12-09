import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarClose } from "lucide-react";
import Filter from "./filter";

const Sidebar = ({ showSidebar, toggleSidebar }) => {

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape" && showSidebar) {
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [showSidebar, toggleSidebar]);

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget && showSidebar) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div
        onClick={handleOutsideClick}
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-700 ${showSidebar ? "opacity-100 w-full" : "opacity-0 w-0"
          } `}
      >
        <div
          className={`bg-neutral-900
                        fixed left-0 top-0 h-full w-96 shadow-lg z-35 p-4 flex flex-col 
                        overflow-y-auto scroll-m-0 transition-transform duration-700 ${showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <button
            onClick={toggleSidebar}
            className={`hover:bg-neutral-700
           ml-2 p-2 rounded-full self-start`}
          >
            <SidebarClose
              className={`text-white`}
              size={32}
            />
          </button>

          <div className="h-full">
            <Filter />
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Sidebar;
