import Login from "../pages/Login.tsx";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import Films from "../pages/Films.tsx";
import FilmDetails from '../pages/FilmDetails.tsx';

export const routes = [
    {
        path: "login",
        component: <Login/>,
        isPrivate: false
    },
    {
        path: "forgot",
        component: <ForgotPassword/>,
        isPrivate: false
    },
    {
        path: "dashboard",
        component: <Dashboard/>,
        isPrivate: true
    },
    {
        path: "films",
        component: <Films/>,
        isPrivate: true
    },
    {
        path: "app/films/:id",
        component: <FilmDetails />,
        isPrivate: true
    },
]