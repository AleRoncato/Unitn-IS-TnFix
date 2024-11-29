import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoutes = () => {
    const { isAuthenticated } = useAuth();
    console.log(isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoutes;