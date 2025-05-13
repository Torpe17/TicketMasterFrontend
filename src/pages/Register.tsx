import { useState } from "react";
import RegisterForm from "../components/auth/RegisterForm";
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
    const response = await api.User.register(
      values.name,
      values.email,
      values.password,
      [3],
      formatDateOnly(values.birthDate)
    );
    setSuccessModalOpened(true);
  } catch (error) {
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
  if (error instanceof AxiosError) {
    let errorMessage = error.response?.data?.message || error.response?.data || error.message;
    setError('Registration unsuccessfull. Please try again. ' + errorMessage);
  } else if (error instanceof Error) {
    setError('Registration unsuccessfull. Please try again. ' + error.message);
  } else {
    setError('Registration unsuccessfull. An unknown error has occured. Please try again.');
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