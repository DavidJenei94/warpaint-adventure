import { NavLink } from 'react-router-dom';

import ALink from '../UI/ALink';

import styles from './MenuItems.module.scss';

type Props = {
  isHamburgerMenu?: boolean;
};

const MenuItems = ({ isHamburgerMenu }: Props) => {
  const classNames = isHamburgerMenu ? styles['hamburger-menu-item'] : '';

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
      <ALink
        to="/login"
        className={classNames ? classNames : styles['to-right']}
        type="NavLink"
      >
        Login/Profile + Logout
      </ALink>
    </div>
  );
};

export default MenuItems;
