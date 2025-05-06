import { IPurchase } from "../interfaces/IPurchase"
import axiosInstance from "./axios.config"
import axiosInstance from "./axios.config.ts";

const Auth = {
    login: (email: string, password: string) => axiosInstance.post<{token: string}>(`/api/Users/login`, {email, password})
}

const RegisterPost = {
    register: (name : string, email : string, password: string, roleIds: number[], birthDate?: string | null) => axiosInstance.post('/api/Users/register', {name, email, password, birthDate : birthDate || undefined, roleIds})
}

const UpdatePasswordPut = {
    updatePassword: (email: string, password: string) => axiosInstance.put('/api/Users/update-password', {email, password})
}

const Films = {}

const Screening = {}

const Tickets = {}

const Purchases = {
    getMyPurchases: () => axiosInstance.get<IPurchase[]>('api/myPurchases')
}

const api = {Films, Auth, Screening, Tickets, Purchases, UpdatePasswordPut};

export default api;