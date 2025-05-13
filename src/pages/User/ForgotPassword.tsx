import { useState } from "react";
import api from "../../api/api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const navigate = useNavigate();

  const formatDateOnly = (date: Date | string | null): string | undefined => {
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

  const handleSubmit = async (values: {
    email: string;
    password: string;
    birthDate: Date | null;
  }) => {
    if (!values.birthDate) {
      setError('Birth Date is required!');
      return;
    }
    
    try {
      await api.User.updatePassword(
        values.email,
        values.password,
        formatDateOnly(values.birthDate)
      );
      setSuccessModalOpened(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        let errorMessage = error.response?.data;
        setError('Password change was unsuccessfull. ' + errorMessage);
      }
    }
  };

  const handleModalClose = () => {
    setSuccessModalOpened(false);
    navigate('/login');
  };

  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit}
      error={error}
      onClearError={() => setError(null)}
      successModalOpened={successModalOpened}
      onModalClose={handleModalClose}
    />
  );
};

export default ForgotPassword;