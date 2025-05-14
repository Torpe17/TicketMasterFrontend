import {Navigate, Route, Routes} from "react-router-dom";
import BasicLayout from "../components/Layout/BasicLayout.tsx";
import useAuth from "../hooks/useAuth.tsx";
import {routes} from "./Routes.tsx";
import {ReactElement} from "react";
import Unauthorized from "../pages/Unauthorized.tsx";


const PrivateRoute = ({element}: {element: ReactElement}) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? element : <Navigate to="/login" />;
};

const AuthenticatedRedirect = ({element}: {element: ReactElement}) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <Navigate to="/app" /> : element;
};

const Routing = () => {

    return <Routes>
        <Route
            path="/"
            element={<AuthenticatedRedirect element={<Navigate to="login" />} />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {
            routes.filter(route => !route.isPrivate).map(route => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<AuthenticatedRedirect element={route.component} />}
                />
            ))
        }
        <Route
            path="app"
            element={<PrivateRoute element={<BasicLayout />} />}>
            <Route
                path=""
                element={<Navigate to="films" />}
            />
            {
                routes.filter(route => route.isPrivate).map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<PrivateRoute element={route.component} />}
                    />
                ))
            }
        </Route>
       
    </Routes>
}

export default Routing;