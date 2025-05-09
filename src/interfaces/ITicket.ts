export interface ITicket {
    id: number,
    purchaseId: number,
    isValidated: boolean,
    seatRow: number,
    seatColumn: number,
    price: number
}