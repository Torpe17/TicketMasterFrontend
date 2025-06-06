import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import {BrowserRouter} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Routing from "./routing/Routing.tsx";
import {useState} from "react";
import {emailKeyName, tokenKeyName, roleKeyName, userName} from "./constants/constants.ts";
import '@mantine/dates/styles.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem(tokenKeyName));
  const [email, setEmail] = useState(localStorage.getItem(emailKeyName));
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem(roleKeyName) || '[]'));
  const [name, setName] = useState(localStorage.getItem(userName));

  return <MantineProvider theme={theme}>
    <BrowserRouter>
      <AuthContext.Provider value={{ token, setToken, email, setEmail, roles, setRoles, name, setName }}>
        <Routing/>
      </AuthContext.Provider>
    </BrowserRouter>
  </MantineProvider>;
}
