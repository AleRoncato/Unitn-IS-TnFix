import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setisAuthenticated] = useState(false);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                setisAuthenticated(false);
            } else {
                setisAuthenticated(true);
            }
        }
    }, [token]);

    const login = (username, password) => {
        //THIS SHOULD FETCH THE TOKEN FROM THE BACKEND
        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, role: "admin" })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Success:", data.token);
                if (data.token) {
                    setToken(data.token);
                    localStorage.setItem("Token", data.token);
                } else {
                    // Handle login error
                    console.error("Login failed");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });

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