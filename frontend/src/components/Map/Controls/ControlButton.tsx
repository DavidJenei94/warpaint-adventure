import { ControlPosition } from 'leaflet';
import Control from 'react-leaflet-custom-control';
import { ChildrenProps } from '../../../models/basic.props';

import styles from './ControlButton.module.scss';

interface ControlButtonProps extends ChildrenProps {
  position: ControlPosition;
  title: string;
}

const ControlButton = ({ children, position, title }: ControlButtonProps) => {
  return (
    <Control position={position}>
      <div className={styles['button-container']} title={title}>
        {children}
      </div>
    </Control>
  );
};

export default ControlButton;
