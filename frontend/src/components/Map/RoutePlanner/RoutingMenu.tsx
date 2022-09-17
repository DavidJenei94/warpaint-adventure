import { Dispatch, SetStateAction, useState } from 'react';
import { LatLng } from 'leaflet';
import Button from '../../UI/Button';

import styles from './RoutingMenu.module.scss';
import useModal from '../../../hooks/modal-hook';
import Modal from '../../UI/Modal/Modal';
import BasicConfirmation from '../../UI/ConfirmationModals/BasicConfirmation';

type RoutingMenuProps = {
  nodes: LatLng[];
  setNodes: Dispatch<SetStateAction<LatLng[]>>;
  setRoutes: Dispatch<SetStateAction<GeoJSON.FeatureCollection<any>[]>>;
};

const RoutingMenu = ({ nodes, setRoutes, setNodes }: RoutingMenuProps) => {
  const { isShown: deleteModalIsShown, toggleModal: toggleDeleteModal } =
    useModal();
  const { isShown: clearModalIsShown, toggleModal: toggleClearModal } =
    useModal();

  const clearRoutesHandler = () => {
    setRoutes([]);
    setNodes([]);
  };

  return (
    <div>
      {clearModalIsShown && (
        <Modal onClose={toggleClearModal} onConfirm={clearRoutesHandler}>
          <BasicConfirmation>
            Are you sure you want to clear the route?
          </BasicConfirmation>
        </Modal>
      )}
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
        <Button onClick={toggleClearModal}>Clear route</Button>
        <Button>Delete</Button>
        <Button>Export GPX</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
};

export default RoutingMenu;
