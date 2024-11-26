import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const LoginForm = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();


    const firstUpdateLog = useRef(true);
    const firstUpdateUser = useRef(true);

    useEffect(() => {

        if (firstUpdateLog.current) {
            firstUpdateLog.current = false;
            return;
        }

        validatePassword();
        console.log("Password: ", password);
    }, [password]);


    useEffect(() => {

        if (firstUpdateUser.current) {
            firstUpdateUser.current = false;
            return;
        }

        validateEmail();
        console.log("Password: ", password);
    }, [email]);

    const validateEmail = () => {
        if (!email) {
            setEmailError("Email is required");
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Invalid email format");
            return false;
        } else {
            setEmailError("");
            return true;
        }
    };
    const validatePassword = () => {
        if (!password) {
            setPasswordError("Password is required");
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateEmail() && validatePassword()) {
            console.log("Login successful");
            login("dummyToken");
            navigate("/home");
        }
    };
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="border border-gray-300 px-4 w-full max-w-md rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Login</h1>
                </div>
                <div className="my-4 text-left">
                    <form onSubmit={handleSubmit}>
                    {/* ${emailError ? 'text-red-500' : ''} */}
                        <div className={`mb-4 `}>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="john.doe@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={validateEmail}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                        </div>
                        {/* ${passwordError ? 'text-red-500' : ''} */}
                        <div className={`mb-6 `}>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                onBlur={validatePassword}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 mt-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default LoginForm;