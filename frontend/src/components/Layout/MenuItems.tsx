import { type } from '@testing-library/user-event/dist/type';
import { ClassNameProps } from '../../models/basicProps';
import ALink from '../UI/ALink';

import styles from './MenuItems.module.scss';

type Props = {
  isHamburgerMenu?: boolean;
}

const MenuItems = ({ isHamburgerMenu }: Props) => {
  const classNames = isHamburgerMenu ? styles['hamburger-menu-item'] : '';

  return (
    <div className={!isHamburgerMenu ? styles['menu-items'] : ''}>
      <ALink className={classNames}>Packing</ALink>
      <ALink className={classNames}>Adventure</ALink>
      <ALink className={classNames}>Premium</ALink>
      <ALink className={classNames ? classNames : styles["to-right"]}>
        Login/Profile + Logout
      </ALink>
    </div>
  );
};

export default MenuItems;
