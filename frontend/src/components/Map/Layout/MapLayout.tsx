import { ChildrenProps } from '../../../models/basic.props';

import styles from './MapLayout.module.scss';
import 'leaflet/dist/leaflet.css';

const MapLayout = ({ children }: ChildrenProps) => {
  return <div className={styles.container}>{children}</div>;
};

export default MapLayout;
