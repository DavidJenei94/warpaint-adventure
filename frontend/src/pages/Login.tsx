import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux-hooks';

import Footer from '../components/Layout/Footer';
import LoginForm from '../components/User/LoginForm';

const Login = () => {
  const isAuthenticated: boolean = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <>
      <LoginForm />
      <Footer />
    </>
  );
};

export default Login;
