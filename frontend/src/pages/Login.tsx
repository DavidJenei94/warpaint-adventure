import { Navigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import LoginForm from '../components/User/LoginForm';
import { useAppSelector } from '../hooks/redux-hooks';

const Login = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
