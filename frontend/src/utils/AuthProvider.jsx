import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("user"));

    const login = (token) => {

        //THIS SHOULD FETCH THE TOKEN FROM THE BACKEND
        
        setToken(token);
        localStorage.setItem("user", token);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("user");
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};