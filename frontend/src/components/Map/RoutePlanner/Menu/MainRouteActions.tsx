import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useFetchDataEffect from '../../../../hooks/fetch-data-effect-hook';
import useHttp from '../../../../hooks/http-hook';
import useModal from '../../../../hooks/modal-hook';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux-hooks';
import { deleteRoute } from '../../../../lib/route-api';
import { Route } from '../../../../models/route.model';
import { routeActions } from '../../../../store/route';
import { round } from '../../../../utils/general.utils';

import Button from '../../../UI/Button';
import EditDeleteText from '../../../UI/Combined/EditDeleteText';
import BasicConfirmation from '../../../UI/ConfirmationModals/BasicConfirmation';
import Modal from '../../../UI/Modal/Modal';
import ColorSelection from '../../Utils/ColorSelection';

import styles from './MainRouteActions.module.scss';

type LoadRouteActionsProps = {
  selectedColor: string;
  setSelectedColor: Dispatch<SetStateAction<string>>;
};

const MainRouteActions = ({
  selectedColor,
  setSelectedColor,
}: LoadRouteActionsProps) => {
  const dispatch = useAppDispatch();

  const token: string = useAppSelector((state) => state.auth.token);

  const route: Route = useAppSelector((state) => state.route.route);
  const routeSections: GeoJSON.FeatureCollection<any>[] = useAppSelector(
    (state) => state.route.routeSections
  );

  // Separate state to detect changes if name was changed or not in edit mode
  const [routeName, setRouteName] = useState<string>(route.name || '');

  const { isShown: deleteModalIsShown, toggleModal: toggleDeleteModal } =
    useModal();
  const {
    isShown: colorSelectonModalIsShown,
    toggleModal: toggleColorSelectionModalIsShown,
  } = useModal();

  const {
    sendRequest: sendDeleteRouteRequest,
    status: deleteRouteStatus,
    error: deleteRouteError,
    data: deleteRouteData,
  } = useHttp(deleteRoute);

  // Display correct name after route changes (eg. load route)
  useEffect(() => {
    if (route) {
      setRouteName(route.name);
    }
  }, [route]);

  const deleteRouteHandler = async () => {
    dispatch(routeActions.resetNodes());
    dispatch(routeActions.resetRouteSections());

    sendDeleteRouteRequest({
      token,
      id: route.id,
      path: route.path,
    });
  };

  useFetchDataEffect(() => {
    dispatch(
      routeActions.setRoute({
        id: 0,
        name: '',
        path: '',
        color: 'blue',
      })
    );
  }, [deleteRouteStatus, deleteRouteError, deleteRouteData]);

  const confirmNameChangeHandler = () => {
    // If name was not changed
    if (route.name === routeName) {
      return;
    }

    dispatch(routeActions.setRoute({ ...route, name: routeName }));

    //Maybe fetch PUT to change name save if route was saved before (it has a path!)
  };

  const totalDistance =
    routeSections.length > 0
      ? round(
          routeSections.reduce((total, routeSection) => {
            if (routeSection.features[0].properties) {
              total += routeSection.features[0].properties!.distance;
            }
            return total;
          }, 0) / 1000,
          2
        )
      : 0;

  return (
    <>
      {deleteModalIsShown && (
        <Modal onClose={toggleDeleteModal} onConfirm={deleteRouteHandler}>
          <BasicConfirmation>
            Are you sure you want to delete the route?
          </BasicConfirmation>
        </Modal>
      )}
      {colorSelectonModalIsShown && (
        <Modal
          onClose={toggleColorSelectionModalIsShown}
          onConfirm={() => {}}
          type="simple"
        >
          <ColorSelection
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onClose={toggleColorSelectionModalIsShown}
          />
        </Modal>
      )}
      <EditDeleteText
        text={routeName}
        setText={setRouteName}
        toggleDeleteModal={toggleDeleteModal}
        onConfirmChange={confirmNameChangeHandler}
        className={styles['route-name-container']}
        placeholder={'(Name...)'}
      />
      <div>
        <Button
          onClick={toggleColorSelectionModalIsShown}
          style={{ color: selectedColor }}
        >
          ██
        </Button>
      </div>
      <div className={styles['route-summary']}>
        <p>{`Distance: ${totalDistance} km`}</p>
        <p>Elevation Gain: TBD</p>
        <p>Elevation Loss: TBD</p>
      </div>
    </>
  );
};

export default MainRouteActions;
