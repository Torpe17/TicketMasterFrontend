import Login from "../pages/Login.tsx";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import Tickets from "../pages/Tickets.tsx";
import Register from "../pages/Register.tsx";
import AdminPage from "../pages/AdminPage.tsx";
import CreateUpdateFilms from "../pages/CreateUpdateFilm.tsx";
import CreateUpdateScreenings from "../pages/CreateUpdateScreening.tsx";
import RequireAdmin from "../components/auth/RequireAdmin.tsx";
import TicketInspection from "../pages/TicketInspection.tsx";
import RequireCashier from "../components/auth/RequireCashier.tsx";
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
        path: "ticket-inspection",
        component: (
            <RequireCashier>
              <TicketInspection />
            </RequireCashier>
          )
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
]