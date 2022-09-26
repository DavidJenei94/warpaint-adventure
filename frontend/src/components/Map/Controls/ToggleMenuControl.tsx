import React, { Dispatch, SetStateAction } from 'react';
import ControlButton from './ControlButton';

import hideMenuIcon from '../../../assets/map-assets/hide-menu-icon.png';
import showMenuIcon from '../../../assets/map-assets/show-menu-icon.png';

type ToggleMenuControlProps = {
  isMenuShown: boolean;
  toggleMenu: Dispatch<SetStateAction<boolean>>;
};

const ToggleMenuControl = ({
  isMenuShown,
  toggleMenu,
}: ToggleMenuControlProps) => {
  const toggleMenuHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleMenu((prevState) => !prevState);
  };

  return (
    <ControlButton position="topleft" title="Hide Menu">
      <img
        src={isMenuShown ? hideMenuIcon : showMenuIcon}
        onClick={toggleMenuHandler}
      />
    </ControlButton>
  );
};

export default ToggleMenuControl;
