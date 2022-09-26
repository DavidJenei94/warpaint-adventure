import { ChildrenProps } from '../../../models/basic.props';

import styles from './MapLayout.module.scss';
import 'leaflet/dist/leaflet.css';

type MapLayoutProps = ChildrenProps & {
  isMenuShown: boolean;
};

const MapLayout = ({ children, isMenuShown }: MapLayoutProps) => {
  return (
    <div
      className={
        isMenuShown
          ? styles['container-with-menu']
          : styles['container-without-menu']
      }
    >
      {children}
    </div>
  );
};

export default MapLayout;
