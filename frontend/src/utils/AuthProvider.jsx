import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("Token") || null);
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation(); // Initialize useLocation

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                setisAuthenticated(false);
            } else {
                setisAuthenticated(true);
                if (location.pathname === "/login" || location.pathname === "/") {
                    navigate("/home"); // Navigate to home if authenticated and on login page
                }
            }
        } else {
            setisAuthenticated(false);
        }
    }, [token, navigate, location]); // Add location to dependency array

    const login = (username, password, callback) => {
        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    setToken(data.token);
                    localStorage.setItem("Token", data.token);
                    setisAuthenticated(true); // Set isAuthenticated to true after login
                    navigate("/home"); // Navigate to home after login
                    if (callback) callback();
                } else {
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
        setisAuthenticated(false); // Set isAuthenticated to false after logout
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