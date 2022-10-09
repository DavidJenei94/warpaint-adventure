import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux-hooks';

const Profile = () => {
  const isAuthenticated: boolean = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div>{isAuthenticated && <p>true</p>}</div>;
};

export default Profile;
