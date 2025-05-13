interface ICreatePurchaseUser {
    tickets: ICreatePurchaseTicket[]
}
interface ICreatePurchaseGuest {
    email: string,
    phoneNumber: string,
    tickets: ICreatePurchaseTicket[]
}

interface ICreatePurchaseCashier{
    email: string,
    tickets: ICreatePurchaseTicket[]
}