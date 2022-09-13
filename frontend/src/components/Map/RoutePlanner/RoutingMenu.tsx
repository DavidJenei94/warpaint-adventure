import { LatLng } from 'leaflet';
import Button from '../../UI/Button';

import styles from './RoutingMenu.module.scss';

type RoutingMenuProps = {
  nodes: LatLng[];
};

const RoutingMenu = ({ nodes }: RoutingMenuProps) => {
  return (
    <div>
      <div className={styles['route-preactions']}>
        <Button>Load Route</Button>
        <Button>Import GPX</Button>
      </div>
      <div className={styles['route-name-container']}>
        <p>Name of Route or New Route button</p>
      </div>
      <div className={styles['node-list']}>
        {nodes.map((node, index) => (
          <p key={index}>
            Lat: {node.lat}, Long: {node.lng}
          </p>
        ))}
      </div>
      <div className={styles['route-actions']}>
        <Button>Clear route</Button>
        <Button>Delete</Button>
        <Button>Export GPX</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
};

export default RoutingMenu;
