import { Navigate } from "react-router-dom";
import { roleKeyName } from "../../constants/constants";

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const rolesData = localStorage.getItem(roleKeyName);
  const roles : string[] = rolesData ? JSON.parse(rolesData) : null;

  if (!roles || !roles.includes("Admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireAdmin;
