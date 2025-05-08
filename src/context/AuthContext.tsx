import { createContext } from "react";
import {emailKeyName, roleKeyName, tokenKeyName, userName} from "../constants/constants.ts";

interface AuthContext {
    token: string | null;
    setToken: (token: string | null) => void;
    email: string | null;
    setEmail: (email: string | null) => void;
    roles: string[] | null;
    setRoles: (role: string[] | null) => void;
    name: string | null;
    setName: (name: string | null) => void;

}

export const AuthContext = createContext<AuthContext>({
    token: localStorage.getItem(tokenKeyName),
    setToken: () => {},
    email: localStorage.getItem(emailKeyName),
    setEmail: () => {},
    roles: JSON.parse(localStorage.getItem(roleKeyName) || '[]'),
    setRoles: () => {},
    name: localStorage.getItem(userName),
    setName: () => {}
});