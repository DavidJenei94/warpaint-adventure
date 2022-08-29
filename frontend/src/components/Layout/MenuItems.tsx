import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { authActions } from '../../store/auth';

import ALink from '../UI/ALink';
import Button from '../UI/Button';

import styles from './MenuItems.module.scss';

type Props = {
  isHamburgerMenu?: boolean;
};

const MenuItems = ({ isHamburgerMenu }: Props) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const classNames = isHamburgerMenu ? styles['hamburger-menu-item'] : '';

  const logoutHandler = () => {
    dispatch(authActions.logout());
  };

  return (
    <div className={!isHamburgerMenu ? styles['menu-items'] : ''}>
      <ALink to="/packing" className={classNames} type="NavLink">
        Packing
      </ALink>
      <ALink to="/map/designer" className={classNames} type="NavLink">
        Adventure
      </ALink>
      <ALink to="/premium" className={classNames} type="NavLink">
        Premium
      </ALink>
      {!isAuthenticated && (
        <ALink
          to="/login"
          className={classNames ? classNames : styles['to-right']}
          type="NavLink"
        >
          Sign In
        </ALink>
      )}
      {isAuthenticated && (
        <>
          <ALink
            to="/profile"
            className={classNames ? classNames : styles['to-right']}
            type="NavLink"
          >
            Profile
          </ALink>
          <Button onClick={logoutHandler}>Sign out</Button>
        </>
      )}
    </div>
  );
};

export default MenuItems;
