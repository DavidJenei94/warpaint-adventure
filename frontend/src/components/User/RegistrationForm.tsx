import { useState } from 'react';
import ALink from '../UI/ALink';
import Button from '../UI/Button';
import CheckBox from '../UI/CheckBox';
import Input from '../UI/Input';
import styles from './RegistrationForm.module.scss';

const RegistrationForm = () => {
  const [termAccepted, setTermsAccepted] = useState(false);

  const regHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('logged in clicked');
    console.log("terms accepted: " + termAccepted);
    

    return;
  };

  return (
    <div className={styles['reg-container']}>
      <form onSubmit={regHandler}>
        <Input placeholder="Email..." />
        <Input placeholder="Name..." title="Firstname Lastname" />
        <Input type="password" placeholder="Password..." />
        <Input type="password" placeholder="Confirm password..." />
        <CheckBox
          id='terms'
          baseValue={termAccepted}
          getValue={setTermsAccepted}
        >I read and accept the <ALink to='/registration' type='Link'>terms and
        conditions</ALink>.</CheckBox>
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
