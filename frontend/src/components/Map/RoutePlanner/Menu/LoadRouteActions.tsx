import { Dispatch, SetStateAction, useState } from 'react';
import useFetchDataEffect from '../../../../hooks/fetch-data-effect-hook';
import useHttp from '../../../../hooks/http-hook';
import useModal from '../../../../hooks/modal-hook';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux-hooks';
import { getAllRoutes, getRoute } from '../../../../lib/route-api';
import { toggleWarningFeedback } from '../../../../store/feedback-toggler-actions';
import { routeActions } from '../../../../store/route';
import { Route } from '../../../../models/route.model';

import Button from '../../../UI/Button';
import Modal from '../../../UI/Modal/Modal';
import Select from '../../../UI/Select';
import ImportGpx from './ImportGpx';

import styles from './LoadRouteActions.module.scss';

type LoadRouteActionsProps = {
  setSelectedColor: Dispatch<SetStateAction<string>>;
};

const LoadRouteActions = ({ setSelectedColor }: LoadRouteActionsProps) => {
  const dispatch = useAppDispatch();

  const token: string = useAppSelector((state) => state.auth.token);

  const [userRoutes, setUserRoutes] = useState<Route[]>([]);
  // In route selection option in Load Route
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const {
    isShown: loadRouteModalIsShown,
    toggleModal: toggleLoadRouteModalIsShown,
  } = useModal();

  const {
    sendRequest: sendGetAllRoutesRequest,
    status: getAllRoutesStatus,
    error: getAllRoutesError,
    data: getAllRoutesData,
  } = useHttp(getAllRoutes, false);

  const {
    sendRequest: sendGetRouteRequest,
    status: getRouteStatus,
    error: getRouteError,
    data: getRouteData,
  } = useHttp(getRoute);

  const loadRoutes = async () => {
    sendGetAllRoutesRequest({ token });
  };

  useFetchDataEffect(() => {
    setUserRoutes(getAllRoutesData);
  }, [getAllRoutesStatus, getAllRoutesError, getAllRoutesData]);

  const routeSelectionChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target = event.target;

    setSelectedRouteIndex(Number(target.value));
  };

  const loadRouteClickHandler = () => {
    toggleLoadRouteModalIsShown();
    loadRoutes();
  };

  const loadRouteHandler = async () => {
    if (selectedRouteIndex === 0) {
      toggleWarningFeedback('Select a valid route!');
      return;
    }

    sendGetRouteRequest({ token, id: selectedRouteIndex });
  };

  useFetchDataEffect(() => {
    dispatch(routeActions.setRoute(getRouteData.route));
    dispatch(routeActions.setRouteSections([getRouteData.geoJson]));

    const coordinates = getRouteData.geoJson.features[0].geometry.coordinates;
    const firstNode = [coordinates[0][1], coordinates[0][0]];
    const lastNode = [
      coordinates[coordinates.length - 1][1],
      coordinates[coordinates.length - 1][0],
    ];

    dispatch(routeActions.setNodes([firstNode, lastNode]));
    setSelectedColor(getRouteData.route.color);
    // Route is not changed if it is freshly loaded
    dispatch(routeActions.setIsChanged(false));
  }, [getRouteStatus, getRouteError, getRouteData]);

  const routeOptionList = [{ value: '0', text: '...' }].concat(
    userRoutes.map((route: Route) => {
      return {
        value: route.id.toString(),
        text: route.name,
      };
    })
  );

  return (
    <>
      {loadRouteModalIsShown && (
        <Modal
          onClose={toggleLoadRouteModalIsShown}
          onConfirm={loadRouteHandler}
        >
          <Select
            onChange={routeSelectionChangeHandler}
            value={selectedRouteIndex}
            optionList={routeOptionList}
          />
        </Modal>
      )}
      <div className={styles['route-preactions']}>
        <Button onClick={loadRouteClickHandler}>Load Route</Button>
        <ImportGpx />
      </div>
    </>
  );
};

export default LoadRouteActions;
