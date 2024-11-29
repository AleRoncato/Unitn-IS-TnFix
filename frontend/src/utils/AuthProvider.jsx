import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const isAuthenticated = useState(() => {token && !isTokenExpired()});

    const isTokenExpired = () => {
        if (!token) return true;

        const decodedToken = jwtDecode(token);
        console.log(decodedToken.exp);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
    };

    const login = (user,password) => {
        //THIS SHOULD FETCH THE TOKEN FROM THE BACKEND
        setToken(token);
        localStorage.setItem("Token", token);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("Token");
    };



    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};