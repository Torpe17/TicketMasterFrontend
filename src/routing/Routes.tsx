import Login from "../pages/Login.tsx";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import AdminPage from "../pages/AdminPage.tsx";
import CreateUpdateFilms from "../pages/CreateUpdateFilm.tsx";
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
        path: "adminpage",
        component: <AdminPage/>,
        isPrivate: true
    },
    {
        path: "adminpage/film/create",
        component: <CreateUpdateFilms isCreate={true}/>,
        isPrivate: true
    },
    {
        path: "adminpage/film/:id",
        component: <CreateUpdateFilms isCreate={false}/>,
        isPrivate: true
    },
]