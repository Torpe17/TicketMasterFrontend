import { IPurchase } from "../interfaces/IPurchase"
import axiosInstance from "./axios.config"

const Auth = {}

const Films = {}

const Screening = {}

const Tickets = {}

const Purchases = {
    getMyPurchases: () => axiosInstance.get<IPurchase[]>('api/myPurchases')
}

const api = {Films, Auth, Screening, Tickets, Purchases};

export default api;