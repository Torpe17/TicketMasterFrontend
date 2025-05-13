interface ICreatePurchase {
    userId: number,
    email: string,
    phoneNumber: string,
    tickets: ICreatePurchaseTicket[]
}