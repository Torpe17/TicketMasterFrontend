import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import api from "../api/api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: {
  name: string;
  email: string;
  password: string;
  birthDate: Date | null;
}) => {
  try {
    console.log("Submitting registration with values:", values); // Debug log
    const response = await api.User.register(
      values.name,
      values.email,
      values.password,
      [3], // Default role IDs
      formatDateOnly(values.birthDate)
    );
    console.log("Registration response:", response); // Debug log
    setSuccessModalOpened(true);
  } catch (error) {
    console.error("Registration error:", error); // Debug log
    handleRegistrationError(error);
  }
};

   const formatDateOnly = (date: Date | string |null): string | undefined => {
        if (!date) return undefined;
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        if (date instanceof Date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
      };

  const handleRegistrationError = (error: unknown) => {
  console.error("Full error object:", error); // Debug log
  if (error instanceof AxiosError) {
    let errorMessage = error.response?.data?.message || error.response?.data || error.message;
    if (errorMessage === "There is already a User with this Email") {
      errorMessage = "Már van egy felhasználó ezzel az email címmel.";
    }
    if (errorMessage === "There is already a User with this Username") {
      errorMessage = "Már van egy felhasználó ezzel a felhasználó névvel.";
    }
    setError('A regisztráció sikertelen. Kérjük, próbáld újra. ' + errorMessage);
  } else if (error instanceof Error) {
    setError('A regisztráció sikertelen. Kérjük, próbáld újra. ' + error.message);
  } else {
    setError('A regisztráció sikertelen. Ismeretlen hiba történt.');
  }
};

  const handleModalClose = () => {
    setSuccessModalOpened(false);
    navigate('/login');
  };

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      error={error}
      onClearError={() => setError(null)}
      successModalOpened={successModalOpened}
      onModalClose={handleModalClose}
    />
  );
};

export default Register;