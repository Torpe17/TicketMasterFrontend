import axios from 'axios';
import {tokenKeyName} from "../constants/constants.ts";

const baseURL = `${import.meta.env.VITE_REST_API_URL}`;

const axiosInstance = axios.create({
    baseURL
});

axiosInstance.interceptors.request.use(
    config => {
        config.headers["Authorization"] = "Bearer " + localStorage.getItem(tokenKeyName);
        config.headers["Access-Control-Allow-Origin"] = "*";
        config.headers["Access-Control-Allow-Headers"] = "X-Requested-Withs";
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

export default axiosInstance;