import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { CrossIcon, Moon, SidebarClose, Sun } from 'lucide-react';
import { IconUserCircle, IconShoppingCart, IconLogin, IconLogout, IconShield, IconBurger, IconLayoutSidebar } from '@tabler/icons-react';
import Sidebar from './sidebar';




export const Header = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => { setShowSidebar(prev => !prev) };


    return (
        <div>
            <header id="outer-container page-wrap" className={`${theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'} py-4 px-6 shadow-md fixed top-0 left-0 w-full z-50`}>

                <nav className="flex justify-between items-center">

                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className={`${theme === 'dark' ? 'hover:bg-neutral-700' : 'hover:bg-neutral-300'} p-2 rounded-full`}>
                            <IconLayoutSidebar className={`${theme === 'dark' ? 'text-white' : 'text-black'}`} size={30} />
                        </button>
                    </div>

                    <Sidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} theme={theme} />

                    <div onClick={() => navigate('/')} className="space-x-6 text-2xl font-bold text-gold cursor-pointer">
                        TN FIX
                    </div>

                    <ul className="flex space-x-6 items-center">

                        <li style={{ marginLeft: '10px' }}>
                            <div
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                onClick={() => {

                                }} className="mr-2 cursor-pointer flex flex-col items-center relative group">

                                <>
                                    <IconLogout
                                        size={30}
                                        stroke={1.2}
                                        color={`${hovered ? 'red' : theme === 'dark' ? 'white' : 'black'}`}
                                        className="hover:text-red-500"
                                    />
                                    <div className="absolute bottom-0 translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Logout
                                    </div>
                                </>

                            </div>
                        </li>
                        <li>
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700">
                                {theme === 'dark' ? <Sun className="text-yellow-500" size={24} /> : <Moon className="text-neutral-500" size={24} />}
                            </button>
                        </li>
                    </ul>

                </nav >
            </header >

            <Outlet /> {/* Importante perche senza outlet non carica i nodi figlio del padre (sicconme questa page è children di Header [come tutta la app]) */}
        </div >
    );
};