import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux-hooks';

import PackingMain from '../components/Packing/PackingMain';

const Packing = () => {
  const isAuthenticated: boolean = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <PackingMain />;
};

export default Packing;
