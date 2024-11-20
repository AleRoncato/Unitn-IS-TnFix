import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarClose } from "lucide-react";
import "./header.css";

const Sidebar = ({ showSidebar, toggleSidebar, theme }) => {
    const navigate = useNavigate();

    const stati = [
        { title: "Attivi" },
        { title: "In Svolgimento" },
        { title: "Programmabili" },
        { title: "Accettabili" },
        { title: "Chiusi" },
    ];

    const tipi = [
        { title: "Incidenti" },
        { title: "Richieste di Servizio" },
        { title: "Problemi" },
        { title: "Cambiamenti" },
        { title: "Conoscenza" },
    ];

    return (
        <>


            {/* <CSSTransition
        in={showSidebar}
        timeout={1000}
        classNames="fade"
        unmountOnExit
      > */}

            {showSidebar &&
                <div
                    onClick={toggleSidebar}
                    className={`fixed pl-80 inset-0 bg-black bg-opacity-50 z-40 ${!showSidebar ? "min-w-0" : ""
                        }`}
                >
                    <div
                        className={`${theme === "dark" ? "bg-neutral-900" : "bg-white"} 
                        fixed left-0 top-0 h-full w-96 shadow-lg z-35 p-4 flex flex-col 
                        overflow-y-auto scroll-m-0`}
                    >
                        <button
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

                        <div className="flex-grow flex flex-col justify-center items-center">
                            {/* <Sidenav>
                <Sidenav.Body>
                  <Nav>
                    {stati.map(
                      (item, index) => (
                        <Nav.Menu eventKey={index} title={item.title}>
                          {tipi.map(
                            (item, index) => (
                              <Nav.Item eventKey={`3-${index}`}>
                                {item.title}
                              </Nav.Item>
                            ),
                            []
                          )}
                        </Nav.Menu>
                      ),
                      []
                    )}
                  </Nav>
                </Sidenav.Body>
              </Sidenav> */}
                        </div>
                    </div>
                </div>
            }
            {/* </CSSTransition> */}

            <Outlet />
        </>
    );
};

export default Sidebar;
