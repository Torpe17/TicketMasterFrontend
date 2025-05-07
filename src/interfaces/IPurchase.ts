import { ITicket } from "./ITicket";

export interface IPurchase {
    id: number,
    userId: number,
    userName: string,
    totalPrice: number,
    ticketCount: number,
    ticketFilmName: string,
    screeningTime: Date,
    tickets: ITicket[],
    purchaseDate: string
}