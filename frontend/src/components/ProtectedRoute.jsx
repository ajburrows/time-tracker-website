import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";


function ProtectedRoute({ children }) {
    // We must check if someone is authorized before they can access the route
    // If they are not authorized, they must log in before using it
    const [isAuthorized, setIsAuthorized] = useState(null);

    // Once we load a ProtectedRoute, we try to call auth()
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        // get the refreshToken
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // send the token to the backend
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                // if the response status was successful, set the local ACCESS_TOKEN to access token from the response
                localStorage.setItem(ACCESS_TOKEN, res.data.access) // if the token is in local storage, we can use it when we send requests
                setIsAuthorized(true)
            }
            else {
                setIsAuthorized(false)
            }
        }
        catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        // We check if we already have a token
        const token = localStorage.getItem(ACCESS_TOKEN);

        // if we don't have a token, we are no longer authorized and now need to get a new token
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        // if we do have a token, we want to ensure it is not expired
        if (tokenExpiration < now) {
            await refreshToken();
        } 
        else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;