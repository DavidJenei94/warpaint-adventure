import { useEffect, useState } from 'react';
import Footer from '../components/Layout/Footer';

import styles from './Home.module.scss';

const Home = () => {
  const [user4, setUser4]: any[] = useState();

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const response = await fetch('http://localhost:4000/api/users/4');
    const user4Data = await response.json();
    setUser4(user4Data);
  };
  return (
    <>
      {user4 && <p>{user4.Email}</p>}
      <p style={{ color: 'red' }}>Home asd Page refresh! </p>
      <Footer />
    </>
  );
};

export default Home;
