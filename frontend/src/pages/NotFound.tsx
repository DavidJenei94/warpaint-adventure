import { Navigate, useNavigate } from 'react-router-dom';

import Button from '../components/UI/Button';

import styles from './NotFound.module.scss';

const NotFound = () => {
  let navigate = useNavigate();

  const navigateToHome = () => {
    navigate('../home', { replace: true });
  };

  return (
    <div className={styles.container}>
      <p>The Page you are searching for does not exists</p>
      <Button onClick={navigateToHome}>Home page</Button>
    </div>
  );
};

export default NotFound;
