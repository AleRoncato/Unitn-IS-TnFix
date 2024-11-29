import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setisAuthenticated] = useState(false);

    useEffect(() => {
        if (token) {
            // const decodedToken = jwtDecode(token);
            // if (decodedToken.exp * 1000 < Date.now()) {
            //     setisAuthenticated(false);
            // } else {
                setisAuthenticated(true);
            // }
        }
    }, [token]);

    const login = (user, password) => {
        //THIS SHOULD FETCH THE TOKEN FROM THE BACKEND
        setToken(user + password);
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