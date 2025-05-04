import Login from "../pages/Login.tsx";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import AdminPage from "../pages/AdminPage.tsx";
import Register from "../pages/Register.tsx";
export const routes = [
    {
        path: "login",
        component: <Login/>,
        isPrivate: false
    },
    {
        path: "register",
        component: <Register/>,
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
        path: "adminpage",
        component: <AdminPage/>,
        isPrivate: true
    },
]