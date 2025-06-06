import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'The email address or password does not match!');
    }
  };

  const handleClearError = () => {
    setError(null);
  };

  return <LoginForm 
    onLogin={handleLogin} 
    error={error} 
    onClearError={handleClearError} 
  />;
}

export default Login;