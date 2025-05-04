import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import {BrowserRouter} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Routing from "./routing/Routing.tsx";
import {useState} from "react";
import {emailKeyName, tokenKeyName, roleKeyName} from "./constants/constants.ts";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem(tokenKeyName));
  const [email, setEmail] = useState(localStorage.getItem(emailKeyName));
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem(roleKeyName) || '[]'));

  return <MantineProvider theme={theme}>
    <BrowserRouter>
      <AuthContext.Provider value={{ token, setToken, email, setEmail, roles, setRoles }}>
        <Routing/>
      </AuthContext.Provider>
    </BrowserRouter>
  </MantineProvider>;
}
