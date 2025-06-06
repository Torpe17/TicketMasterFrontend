import Login from "../pages/User/Login.tsx";
import ForgotPassword from "../pages/User/ForgotPassword.tsx";
import Films from "../pages/Film/Films.tsx";
import FilmDetails from '../pages/Film/FilmDetails.tsx';

import Tickets from "../pages/Tickets/Tickets.tsx";
import Register from "../pages/User/Register.tsx";
import AdminPage from "../pages/admin/AdminPage.tsx";
import CreateUpdateFilms from "../pages/admin/CreateUpdateFilm.tsx";
import CreateUpdateScreenings from "../pages/admin/CreateUpdateScreening.tsx";
import RequireAdmin from "../components/auth/RequireAdmin.tsx";
import TicketInspection from "../pages/Tickets/TicketInspection.tsx";
import RequireCashier from "../components/auth/RequireCashier.tsx";
import UserProfile from "../pages/User/UserProfile.tsx";
import CreateAddress from "../pages/admin/CreateAddress.tsx";
import ScreeningDetails from "../pages/Film/ScreeningDetails.tsx";
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
        path: "films",
        component: <Films/>,
        isPrivate: false
    },
    {
        path: "films/:id",
        component: <FilmDetails />,
        isPrivate: false
    },
    {
        path: "films",
        component: <Films/>,
        isPrivate: true
    },
    {
        path: "films",
        component: <Films/>,
        isPrivate: false
    },
    {
        path: "films/:id",
        component: <FilmDetails />,
        isPrivate: true
    },
    {
        path: "screening/:id/purchase",
        component: <ScreeningDetails />,
        isPrivate: false
    },
    {
        path: "screening/:id/purchase",
        component: <ScreeningDetails />,
        isPrivate: true
    },
    {
        path: "ticket-inspection",
        component: (
            <RequireCashier>
              <TicketInspection />
            </RequireCashier>
          ),
          isPrivate: true
    },
    {  
        path: "tickets",
        component: <Tickets/>,
        isPrivate: true
    },
    {
        path: "adminpage",
        component: (
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          ),
        isPrivate: true
    },
    {
        path: "adminpage/film/create",
        component: (<RequireAdmin><CreateUpdateFilms isCreate={true}/></RequireAdmin>),
        isPrivate: true
    },
    {
        path: "adminpage/film/:id",
        component: (<RequireAdmin><CreateUpdateFilms isCreate={false}/></RequireAdmin>),
        isPrivate: true
    },
    {
        path: "adminpage/film/:filmId/screening/create",
        component: (<RequireAdmin><CreateUpdateScreenings isCreate={true}/></RequireAdmin>),
        isPrivate: true
    },
    {
        path: "adminpage/film/:filmId/screening/:id",
        component: (<RequireAdmin><CreateUpdateScreenings isCreate={false}/></RequireAdmin>),
        isPrivate: true
    },
    {
        path: "profile",
        component: <UserProfile/>,
        isPrivate: true,
    },
    {
        path: "newAddress",
        component: <CreateAddress isCreate={true}/>,
        isPrivate: true,
    },
    {
        path: "editAddress",
        component: <CreateAddress isCreate={false}/>,
        isPrivate: true,
    }
]