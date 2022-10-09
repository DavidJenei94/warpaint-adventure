import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { authActions } from '../../store/auth';
import { toggleSuccessFeedback } from '../../store/feedback-toggler-actions';

import ALink from '../UI/ALink';
import Button from '../UI/Button';

import styles from './MenuItems.module.scss';
import logoutIcon from '../../assets/icons/logout.png';

interface MenuProps {
  isHamburgerMenu?: boolean;
}

const MenuItems = ({ isHamburgerMenu }: MenuProps) => {
  const dispatch = useAppDispatch();
  const isAuthenticated: boolean = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const classNames: string = isHamburgerMenu
    ? styles['hamburger-menu-item']
    : '';

  const logoutHandler = () => {
    dispatch(authActions.logout());
    toggleSuccessFeedback('User is logged out! Have a nice day!');
  };

  return (
    <div className={!isHamburgerMenu ? styles['menu-items'] : ''}>
      <ALink to="/packing" className={classNames} type="NavLink">
        Packing
      </ALink>
      <ALink to="/map/routing" className={classNames} type="NavLink">
        Routing
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
          <Button onClick={logoutHandler}>
            <img src={logoutIcon} />
          </Button>
        </>
      )}
    </div>
  );
};

export default MenuItems;
