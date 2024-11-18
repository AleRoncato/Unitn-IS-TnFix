import React from 'react';
import { CSSTransition } from "react-transition-group";
import { useNavigate } from 'react-router-dom';
import { SidebarClose } from 'lucide-react';
import "./header.css";

const Sidebar = ({ showSidebar, toggleSidebar, theme }) => {
    const navigate = useNavigate();
    return (
        <>
            <CSSTransition
                in={showSidebar}
                timeout={1000}
                classNames="fade"
                unmountOnExit
            >
                <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${!showSidebar ? 'min-w-0' : ''}`} onClick={toggleSidebar}>
                    <div className={`${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'} fixed left-0 top-0 h-full w-80 shadow-lg z-50 p-4 flex flex-col`}>
                        <button className={`${theme === 'dark' ? 'hover:bg-neutral-700' : 'hover:bg-neutral-300'} ml-2 p-2 rounded-full self-start`}>
                            <SidebarClose className={`${theme === 'dark' ? 'text-white' : 'text-black'}`} size={30} />
                        </button>
                        <div className="flex-grow flex flex-col justify-center items-center">
                            <ul className="space-y-4 flex flex-col items-center">
                                <li className="cursor-pointer" onClick={() => navigate('/home')}>Home</li>
                                <li className="cursor-pointer" onClick={() => navigate('/products')}>Products</li>
                                <li className="cursor-pointer" onClick={() => navigate('/about')}>About</li>
                                <li className="cursor-pointer" onClick={() => navigate('/contact')}>Contact</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </>
    );
};

export default Sidebar;