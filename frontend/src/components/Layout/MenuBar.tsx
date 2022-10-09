import { useState } from 'react';

import ALink from '../UI/ALink';
import MenuItems from './MenuItems';
import Button from '../UI/Button';

import styles from './MenuBar.module.scss';

const MenuBar = () => {
  const [isHamburgerMenuVisisble, setIsHamburgerMenuVisisble] =
    useState<boolean>(false);

  const hamburgerMenuHandler = () => {
    setIsHamburgerMenuVisisble((prevState) => !prevState);
  };

  return (
    <nav>
      <div className={styles['menu-bar']}>
        <ALink to="/home" type="Link">
          WpA
        </ALink>
        <MenuItems />
        <Button
          className={styles['hamburger-menu-icon']}
          onClick={hamburgerMenuHandler}
        >
          ≡
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
