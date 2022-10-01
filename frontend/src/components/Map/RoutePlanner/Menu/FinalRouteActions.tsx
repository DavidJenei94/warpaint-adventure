import useFetchDataEffect from '../../../../hooks/fetch-data-effect-hook';
import useHttp from '../../../../hooks/http-hook';
import useModal from '../../../../hooks/modal-hook';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux-hooks';
import { exportGpx } from '../../../../lib/gpx-api';
import { createRoute, updateRoute } from '../../../../lib/route-api';
import { toggleWarningFeedback } from '../../../../store/feedback-toggler-actions';
import { routeActions } from '../../../../store/route';
import { createBasicGeoJsonFC } from '../../Utils/geojson.utils';

import Button from '../../../UI/Button';
import BasicConfirmation from '../../../UI/ConfirmationModals/BasicConfirmation';
import Modal from '../../../UI/Modal/Modal';

import styles from './FinalRouteActions.module.scss';

const FinalRouteActions = () => {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  const route = useAppSelector((state) => state.route.route);
  const routeSections = useAppSelector((state) => state.route.routeSections);

  const { isShown: clearModalIsShown, toggleModal: toggleClearModal } =
    useModal();

  const { isShown: newRouteModalIsShown, toggleModal: toggleNewRouteModal } =
    useModal();

  const {
    sendRequest: sendCreateRouteRequest,
    status: createRouteStatus,
    error: createRouteError,
    data: createRouteData,
  } = useHttp(createRoute);

  const { sendRequest: sendUpdateRouteRequest } = useHttp(updateRoute);

  const {
    sendRequest: sendExportGpxRequest,
    status: exportGpxStatus,
    error: exportGpxError,
    data: exportGpxData,
  } = useHttp(exportGpx, false);

  const clearRoutesHandler = () => {
    dispatch(routeActions.resetNodes());
    dispatch(routeActions.resetRouteSections());
  };

  useFetchDataEffect(() => {
    // update active route with the created route's name and color
    dispatch(routeActions.setRoute(createRouteData.route));
  }, [createRouteStatus, createRouteError, createRouteData]);

  const newRouteClickHandler = () => {
    if (routeSections.length > 0) {
      toggleNewRouteModal();
      return;
    }

    newRouteHandler();
  };

  const newRouteHandler = () => {
    dispatch(
      routeActions.setRoute({
        id: 0,
        name: '',
        path: '',
        color: 'blue',
      })
    );
    dispatch(routeActions.resetNodes());
    dispatch(routeActions.resetRouteSections());
  };

  const exportGpxHandler = async () => {
    if (routeSections.length === 0) {
      toggleWarningFeedback('No route to export!');
      return;
    }

    let mergedCoordinates: number[][] = [];
    let totalDistance = 0;
    routeSections.map((reouteSection) => {
      mergedCoordinates = mergedCoordinates.concat(
        reouteSection.features[0].geometry.coordinates
      );
      totalDistance += reouteSection.features[0].properties
        ? reouteSection.features[0].properties.distance
        : 0;
    });

    const mergedGeoJson = createBasicGeoJsonFC(
      { coordinates: mergedCoordinates, type: 'LineString' },
      totalDistance
    );

    sendExportGpxRequest({ geoJson: mergedGeoJson });
  };

  useFetchDataEffect(() => {
    // export gpx as a file
    const element = document.createElement('a');
    const file = new Blob([exportGpxData], { type: 'application/gpx+xml' });
    element.href = URL.createObjectURL(file);
    element.download = 'route.gpx';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }, [exportGpxStatus, exportGpxError, exportGpxData]);

  const saveRouteHandler = async () => {
    if (!route.name) {
      toggleWarningFeedback('Route has no name!');
      return;
    }

    if (routeSections.length === 0) {
      toggleWarningFeedback('No route on map!');
      return;
    }

    let mergedCoordinates: number[][] = [];
    let totalDistance = 0;
    routeSections.map((routeSection) => {
      mergedCoordinates = mergedCoordinates.concat(
        routeSection.features[0].geometry.coordinates
      );
      totalDistance += routeSection.features[0].properties
        ? routeSection.features[0].properties.distance
        : 0;
    });

    const mergedGeoJson = createBasicGeoJsonFC(
      { coordinates: mergedCoordinates, type: 'LineString' },
      totalDistance
    );

    if (route.id === 0) {
      sendCreateRouteRequest({ token, route, mergedGeoJson });
    } else {
      sendUpdateRouteRequest({
        token,
        id: route.id,
        route,
        mergedGeoJson,
      });
    }

    dispatch(routeActions.setIsChanged(false));
  };

  return (
    <>
      {clearModalIsShown && (
        <Modal onClose={toggleClearModal} onConfirm={clearRoutesHandler}>
          <BasicConfirmation>
            Are you sure you want to clear the route?
          </BasicConfirmation>
        </Modal>
      )}
      {newRouteModalIsShown && (
        <Modal onClose={toggleNewRouteModal} onConfirm={newRouteHandler}>
          <BasicConfirmation>
            Do you want to continue without saving?
          </BasicConfirmation>
        </Modal>
      )}
      <div className={styles['route-actions']}>
        <Button onClick={toggleClearModal}>Clear route</Button>
        <Button onClick={newRouteClickHandler}>New Route</Button>
        <Button onClick={exportGpxHandler}>Export GPX</Button>
        <Button onClick={saveRouteHandler}>Save</Button>
      </div>
    </>
  );
};

export default FinalRouteActions;
