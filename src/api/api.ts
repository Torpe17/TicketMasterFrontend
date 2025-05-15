import { IPurchase } from "../interfaces/IPurchase"
import axiosInstance from "./axios.config.ts";
import { ICreateScreening } from "../interfaces/ICreateScreening.ts";
import { IFilm } from './../interfaces/IFilm.ts';
import { IRoom } from "../interfaces/IRoom.ts";
import { IScreening } from "../interfaces/IScreening.ts";
import { ITicket } from "../interfaces/ITicket.ts";

const User ={
    login: (email: string, password: string) => axiosInstance.post<{token: string}>(`/api/Users/login`, {email, password}),
    register: (name : string, email : string, password: string, roleIds: number[], birthDate?: string | null) => axiosInstance.post('/api/Users/register', {name, email, password, birthDate : birthDate || undefined, roleIds}),
    updatePassword: (email: string, password: string, birthDate?: string | null) => axiosInstance.put('/api/Users/update-password', {email, password, birthDate}),
    updateProfile: (email: string | null, username: string | null) => axiosInstance.put('/api/Users/update-profile', {email, username}),
    createAddress: (country: string, county: string, zipcode: number, city: string, street: string, housenumber: number, floor: string | null) => axiosInstance.post('/api/Users/address', {country, county, zipcode, city, street, housenumber, floor}),
    deleteAddress: () => axiosInstance.delete('/api/Users/address'),
    getAddress: () => axiosInstance.get<IAddress>('/api/Users/address'),
    updateAddress: (
  setFloor: boolean,
  country: string | null,
  county: string | null,
  zipcode: number | null,
  city: string | null,
  street: string | null,
  housenumber: number | null,
  floor: string | null | undefined
) => axiosInstance.put('/api/Users/address', {
  country,
  county,
  zipcode,
  city,
  street,
  housenumber,
  floor: floor === undefined ? undefined : (floor === null ? '' : floor),
  setFloor
})}

const Films = {
    getFilms: () => axiosInstance.get<IFilm[]>(`/api/film`),
    getTrendingFilms: () => axiosInstance.get<IFilm[]>(`/api/film/trending`),
    getFilm: (id: string) => axiosInstance.get<IFilm>(`/api/film/${id}`),
    getFilmOnDate: (date: string) => axiosInstance.get<IFilm[]>(`/api/film/on/${date}`),
    getFilmAfterDate: (date: string) => axiosInstance.get<IFilm[]>(`/api/film/after/${date}`),
    getFilmByName: (name: string) => axiosInstance.get<IFilm[]>(`/api/film/name?name=${name}`),
    getFilmByNameAndDate: (date: string, name: string, onDay:boolean) => axiosInstance.get<IFilm[]>(`/api/film/NameAndDate?name=${name}&date=${date}&onDay=${onDay}`),
    createFilm : (param: ICreateFilm) => axiosInstance.post<IFilm>(`/api/film`, param),
    updateFilm: (id: string, param2: {
        title: string;
        director: string;
        genre: string;
        length: number;
        description: string;
        ageRating: number | null;
        setAgeRating: boolean;
        pictureBase64: string | null;
        removePicture: boolean;
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

const Tickets = {
    getTicketsByScreeningId: (screeningId: number) => axiosInstance.get<ITicket[]>(`/api/tickets/screening/${screeningId}`),
    validateTicket: (id: number) => axiosInstance.put<void>(`/api/tickets/${id}/validate`)
}
const Room = {
    getRooms: () => axiosInstance.get<IRoom[]>(`/api/rooms`),
    getRoom: (id: number) => axiosInstance.get<IRoom>(`/api/room/${id}`)
}

const Purchases = {
    getMyPurchases: () => axiosInstance.get<IPurchase[]>('/api/myPurchases'),
    deletePurchase: (purchaseId: number) => axiosInstance.delete(`/api/purchase/${purchaseId}`),
    createPurchaseUser: (purchaseDetails: ICreatePurchaseUser) => axiosInstance.post(`/api/purchase`, purchaseDetails),
    createPurchaseCashier: (purchaseDetails: ICreatePurchaseCashier) => axiosInstance.post(`/api/purchase`, purchaseDetails),
    createPurchaseGuest: (purchaseDetails: ICreatePurchaseGuest) => axiosInstance.post(`/api/purchase`, purchaseDetails)
}

const api = {Films, User, Screening, Tickets, Room, Purchases};

export default api;