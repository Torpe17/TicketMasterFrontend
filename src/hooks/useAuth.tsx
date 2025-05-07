import {useContext, useEffect} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {emailKeyName, tokenKeyName, roleKeyName, emailTokenKey} from "../constants/constants.ts";
import {jwtDecode, JwtPayload} from "jwt-decode";
import api from "../api/api.ts";

interface CustomJwtPayload extends JwtPayload {
    [key: string]: any;
}


const useAuth = () => {
    const { token, setToken, email, setEmail, roles, setRoles  } = useContext(AuthContext);
    const isLoggedIn = !!token;

    const login = async (email: string, password: string) => {
        try {
            const response = await api.User.login(email, password);
            loginKata(response.data.token);
            return { success: true };
        } catch (error: any) {
            // Extract error message from response
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.title ||
                               'Hibás email cím vagy jelszó';
            return { success: false, error: errorMessage };
        }
    }

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setEmail(null);
        setRoles(null);
    }

    const loginKata = (token: string) => {
        setToken(token); localStorage.setItem(tokenKeyName, token);
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        const tempEmail = decodedToken[emailTokenKey];
        let rolesArray: string[] = decodedToken[roleKeyName];
        localStorage.setItem(emailKeyName, tempEmail); setEmail(tempEmail);
        localStorage.setItem(roleKeyName, JSON.stringify(rolesArray)); setRoles(rolesArray);
    }

    useEffect(() => {

    }, []);

    return {login, logout, loginKata, token, email, isLoggedIn, roles};
}

export default useAuth;