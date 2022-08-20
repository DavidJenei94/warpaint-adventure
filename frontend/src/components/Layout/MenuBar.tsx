import { NavLink, Link } from 'react-router-dom';

import ALink from '../UI/ALink';
import MenuItems from './MenuItems';

import styles from './MenuBar.module.scss';
import { useState } from 'react';
import Button from '../UI/Button';

const MenuBar = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isHamburgerMenuVisisble, setIsHamburgerMenuVisisble] = useState(false);

  const hamburgerMenuHandler = () => {
    setIsHamburgerMenuVisisble((prevState) => !prevState);
  };

  return (
    <nav>
      <div className={styles['menu-bar']}>
        <ALink to="/home" type='Link'>WpA</ALink>
        <MenuItems />
        <Button
          className={styles['hamburger-menu-icon']}
          onClick={hamburgerMenuHandler}
        >
          [-]
        </Button>
      </div>
      <div className={styles['hamburger-menu']}>
        {isHamburgerMenuVisisble && (
          <MenuItems isHamburgerMenu={isHamburgerMenuVisisble} />
        )}
      </div>
    </nav>
  );
};

export default MenuBar;
