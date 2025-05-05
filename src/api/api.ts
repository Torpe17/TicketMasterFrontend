import { ICreateScreening } from "../interfaces/ICreateScreening.ts";
import { IFilm } from "../interfaces/IFilm.ts";
import { IRoom } from "../interfaces/IRoom.ts";
import { IScreening } from "../interfaces/IScreening.ts";
import axiosInstance from "./axios.config.ts";

const Auth = {}

const Films = {
    getFilms: () => axiosInstance.get<IFilm[]>(`/api/film`),
    getFilm: (id: string) => axiosInstance.get<IFilm>(`/api/film/${id}`),
    createFilm : (param: ICreateFilm) => axiosInstance.post<IFilm>(`/api/film`, param),
    updateFilm: (id: string, param2: {
        title: string;
        director: string;
        genre: string;
        length: number;
        description: string;
        ageRating: number | null;
        setAgeRating: boolean;
    }) => axiosInstance.put<IFilm>(`/api/film/${id}`, param2),
    deleteFilm: (id: string) => axiosInstance.delete<void>(`/api/film/${id}`)
}

const Screening = {
    getScreenings: (filmId: number) => axiosInstance.get<IScreening[]>(`/api/film/${filmId}/screenings`),
    getScreening: (id: string) => axiosInstance.get<IScreening>(`/api/screenings/${id}`),
    createScreening : (param: ICreateScreening) => axiosInstance.post<IScreening>(`/api/screenings`, param),
    updateScreening: (id: string, param2: ICreateScreening) => axiosInstance.put<void>(`/api/screenings/${id}`, param2),
    deleteScreening: (id: string) => axiosInstance.delete<void>(`/api/screenings/${id}`)
}

const Tickets = {}
const Room = {
    getRooms: () => axiosInstance.get<IRoom[]>(`/api/rooms`),
}

const api = {Films, Auth, Screening, Tickets, Room};

export default api;