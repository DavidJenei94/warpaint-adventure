import ALink from '../UI/ALink';
import Button from '../UI/Button';
import Input from '../UI/Input';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const loginHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("logged in clicked");
    
    return;
  }

  return (
    <div className={styles["login-container"]}>
      <form onSubmit={loginHandler}>
        <Input placeholder='Email...'/>
        <Input type="password" placeholder='Password...'/>
        <Button type="submit">Login</Button>
        <div className={styles["other-actions"]}>
          <Button>Registration</Button>
          <Button>Forgot password</Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
