import { IFilm } from "../interfaces/IFilm.ts";
import { IScreening } from "../interfaces/IScreening.ts";
import axiosInstance from "./axios.config.ts";

const Auth = {
    login: (email: string, password: string) => axiosInstance.post<{token: string}>(`/api/Users/login`, {email, password})
}

const RegisterPost = {
    register: (name : string, email : string, password: string, roleIds: number[], birthDate?: string | null) => axiosInstance.post('/api/Users/register', {name, email, password, birthDate : birthDate || undefined, roleIds})
}

const Films = {
    getFilms: () => axiosInstance.get<IFilm[]>(`/api/film`),
}

const Screening = {
    getScreenings: (filmId: number) => axiosInstance.get<IScreening[]>(`/api/film/${filmId}/screenings`),
}

const Tickets = {}

const api = {Films, Auth, Screening, Tickets, RegisterPost};

export default api;