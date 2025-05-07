import axiosInstance from "./axios.config.ts";

const Auth = {
    login: (email: string, password: string) => axiosInstance.post<{token: string}>(`/api/Users/login`, {email, password})
}

const RegisterPost = {
    register: (name : string, email : string, password: string, roleIds: number[], birthDate?: string | null) => axiosInstance.post('/api/Users/register', {name, email, password, birthDate : birthDate || undefined, roleIds})
}

const UpdatePasswordPut = {
    updatePassword: (email: string, password: string, birthDate?: string | null) => axiosInstance.put('/api/Users/update-password', {email, password, birthDate})
}

const Films = {}

const Screening = {}

const Tickets = {}

const api = {Films, Auth, Screening, Tickets, RegisterPost, UpdatePasswordPut};

export default api;