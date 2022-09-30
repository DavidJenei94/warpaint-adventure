import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';
import useModal from '../../../hooks/modal-hook';
import {
  createBasicGeoJsonFC,
  getDistanceOfRoute,
  sameCoordinates,
} from '../Utils/geojson.utils';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { round } from '../../../utils/general.utils';
import { Route } from '../../../models/route.model';
import useHttp from '../../../hooks/http-hook';
import {
  createRoute,
  deleteRoute,
  getAllRoutes,
  getRoute,
  updateRoute,
} from '../../../lib/route-api';
import useFetchDataEffect from '../../../hooks/fetch-data-effect-hook';
import { exportGpx, importGpx } from '../../../lib/gpx-api';
import { toggleWarningFeedback } from '../../../store/feedback-toggler-actions';
import { routeActions } from '../../../store/route';

import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button';
import BasicConfirmation from '../../UI/ConfirmationModals/BasicConfirmation';
import SingleInputConfirmation from '../../UI/ConfirmationModals/SingleInputConfirmation';
import Select from '../../UI/Select';
import ColorSelection from '../Utils/ColorSelection';
import EditDeleteText from '../../UI/Combined/EditDeleteText';

import styles from './RoutingMenu.module.scss';

const RoutingMenu = () => {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  const route = useAppSelector((state) => state.route.route);
  const routeSections = useAppSelector((state) => state.route.routeSections);

  const { isShown: deleteModalIsShown, toggleModal: toggleDeleteModal } =
    useModal();
  const { isShown: clearModalIsShown, toggleModal: toggleClearModal } =
    useModal();
  const { isShown: importGpxModalIsShown, toggleModal: toggleImportGpxModal } =
    useModal();
  const {
    isShown: loadRouteModalIsShown,
    toggleModal: toggleLoadRouteModalIsShown,
  } = useModal();
  const {
    isShown: colorSelectonModalIsShown,
    toggleModal: toggleColorSelectionModalIsShown,
  } = useModal();

  const [userRoutes, setUserRoutes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(route.color || 'blue');
  const [importedGpxText, setImportedGpxText] = useState('');
  // Separate state to detect changes if name was changed or not in edit mode
  const [routeName, setRouteName] = useState(route.name || '');
  // In route selection option in Load Route
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const {
    sendRequest: sendGetAllRoutesRequest,
    status: getAllRoutesStatus,
    error: getAllRoutesError,
    data: getAllRoutesData,
  } = useHttp(getAllRoutes, false);

  const {
    sendRequest: sendCreateRouteRequest,
    status: createRouteStatus,
    error: createRouteError,
    data: createRouteData,
  } = useHttp(createRoute);

  const {
    sendRequest: sendGetRouteRequest,
    status: getRouteStatus,
    error: getRouteError,
    data: getRouteData,
  } = useHttp(getRoute);

  const { sendRequest: sendUpdateRouteRequest } = useHttp(updateRoute);

  const {
    sendRequest: sendDeleteRouteRequest,
    status: deleteRouteStatus,
    error: deleteRouteError,
    data: deleteRouteData,
  } = useHttp(deleteRoute);

  const {
    sendRequest: sendImportGpxRequest,
    status: importGpxStatus,
    error: importGpxError,
    data: importGpxData,
  } = useHttp(importGpx, false);
  const {
    sendRequest: sendExportGpxRequest,
    status: exportGpxStatus,
    error: exportGpxError,
    data: exportGpxData,
  } = useHttp(exportGpx, false);

  // Display correct name after route changes (eg. load route)
  useEffect(() => {
    if (route) {
      setRouteName(route.name);
    }
  }, [route]);

  // Update route with selected color
  useEffect(() => {
    dispatch(routeActions.setRoute({ ...route, color: selectedColor }));
  }, [selectedColor]);

  const chooseGpxFileHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // check if correct input
    // https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers

    const input = event.target;
    if (!input) {
      toggleWarningFeedback(
        'The browser does not does not support file input.'
      );
      return;
    }
    if (!input.files) {
      toggleWarningFeedback(
        'The browser does not does not support this file input.'
      );
      return;
    }
    if (!input.files![0]) {
      toggleWarningFeedback('The file did not loaded properly.');
      return;
    }

    const file = input.files![0];
    const text = await file.text(); // Blob API
    setImportedGpxText(text);

    // Older version:
    // const fileReader = new FileReader();
    // fileReader.onload = (event) =>
    //   setImportedGpx(event.target!.result as string);
    // fileReader.readAsText(file);
  };

  const importGpxHandler = async () => {
    sendImportGpxRequest({ gpxString: importedGpxText });
  };

  useFetchDataEffect(() => {
    const coordinates = importGpxData.features[0].geometry.coordinates;
    const firstNode = [coordinates[0][1], coordinates[0][0]];
    const lastNode = [
      coordinates[coordinates.length - 1][1],
      coordinates[coordinates.length - 1][0],
    ];
    const firstNodeLatLng = new LatLng(firstNode[0], firstNode[1]);
    const lastNodeLatLng = new LatLng(lastNode[0], lastNode[1]);

    // If no route is on the map (or only one node)
    if (routeSections.length === 0) {
      dispatch(routeActions.setNodes([firstNode, lastNode]));
      dispatch(routeActions.setRouteSections([importGpxData]));
      return;
    }

    // Otherwise connect to current route sections on map
    const prevFirstCoordinates =
      routeSections[0].features[0].geometry.coordinates;
    const prevFirstNode = new LatLng(
      prevFirstCoordinates[0][1],
      prevFirstCoordinates[0][0]
    );
    const prevLastCoordinates =
      routeSections[routeSections.length - 1].features[0].geometry.coordinates;
    const prevLastNode = new LatLng(
      prevLastCoordinates[prevLastCoordinates.length - 1][1],
      prevLastCoordinates[prevLastCoordinates.length - 1][0]
    );

    // If newly added route's last node is the same as the first node of current route
    if (sameCoordinates(prevFirstNode, lastNodeLatLng)) {
      dispatch(
        routeActions.insertNode({
          index: 0,
          deleteCount: 0,
          insertElement: firstNode,
        })
      );
      dispatch(
        routeActions.insertRouteSection({
          index: 0,
          deleteCount: 0,
          insertElement: importGpxData,
        })
      );
      return;
    }
    // If newly added route's first node is the same as the last node of current route
    if (sameCoordinates(prevLastNode, firstNodeLatLng)) {
      dispatch(routeActions.addNode(lastNode));
      dispatch(routeActions.addRouteSection(importGpxData));
      return;
    }

    // check if it matches a current middle node, then throw warning message
    routeSections.map((routeSection, index) => {
      if (index === 0 || index === routeSections.length) {
        return;
      }
      const routeCoordinates = routeSection.features[0].geometry.coordinates;
      const routeFirstNode = new LatLng(
        routeCoordinates[0][1],
        routeCoordinates[0][0]
      );
      const routeLastNode = new LatLng(
        routeCoordinates[routeCoordinates.length - 1][1],
        routeCoordinates[routeCoordinates.length - 1][0]
      );
      if (
        sameCoordinates(firstNodeLatLng, routeFirstNode) ||
        sameCoordinates(firstNodeLatLng, routeLastNode) ||
        sameCoordinates(lastNodeLatLng, routeFirstNode) ||
        sameCoordinates(lastNodeLatLng, routeLastNode)
      ) {
        toggleWarningFeedback(
          'Route Section cannot be connected as it starts or ends at the middle of the current route!'
        );
        return;
      }
    });

    // otherwise draw a connecting route with 1 extra node at the middle
    const smallerLng =
      prevLastNode.lng < firstNodeLatLng.lng
        ? prevLastNode.lng
        : firstNodeLatLng.lng;
    const smallerLat =
      prevLastNode.lat < firstNodeLatLng.lat
        ? prevLastNode.lat
        : firstNodeLatLng.lat;
    const middleNodeCoordinate = [
      smallerLng + Math.abs(prevLastNode.lng - firstNodeLatLng.lng) / 2,
      smallerLat + Math.abs(prevLastNode.lat - firstNodeLatLng.lat) / 2,
    ];
    const middleNode = new LatLng(
      middleNodeCoordinate[1],
      middleNodeCoordinate[0]
    );
    const connectingCoordinates1 = [
      [prevLastNode.lng, prevLastNode.lat],
      middleNodeCoordinate,
    ];
    const connectingRoute1 = createBasicGeoJsonFC(
      { coordinates: connectingCoordinates1, type: 'LineString' },
      getDistanceOfRoute(connectingCoordinates1)
    );
    const connectingCoordinates2 = [
      middleNodeCoordinate,
      [firstNodeLatLng.lng, firstNodeLatLng.lat],
    ];
    const connectingRoute2 = createBasicGeoJsonFC(
      { coordinates: connectingCoordinates2, type: 'LineString' },
      getDistanceOfRoute(connectingCoordinates2)
    );

    dispatch(routeActions.addRouteSection(connectingRoute1));
    dispatch(routeActions.addRouteSection(connectingRoute2));
    dispatch(routeActions.addRouteSection(importGpxData));
    dispatch(routeActions.addNode([middleNode.lat, middleNode.lng]));
    dispatch(routeActions.addNode([firstNodeLatLng.lat, firstNodeLatLng.lng]));
    dispatch(routeActions.addNode([lastNodeLatLng.lat, lastNodeLatLng.lng]));
  }, [importGpxStatus, importGpxError, importGpxData]);

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

  const clearRoutesHandler = () => {
    dispatch(routeActions.resetNodes());
    dispatch(routeActions.resetRouteSections());
  };

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
  };

  useFetchDataEffect(() => {
    // update active route with the created route's name and color
    dispatch(routeActions.setRoute(createRouteData.route));
  }, [createRouteStatus, createRouteError, createRouteData]);

  const loadRoutes = async () => {
    sendGetAllRoutesRequest({ token });
  };

  useFetchDataEffect(() => {
    setUserRoutes(getAllRoutesData);
  }, [getAllRoutesStatus, getAllRoutesError, getAllRoutesData]);

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
  }, [getRouteStatus, getRouteError, getRouteData]);

  const routeSelectionChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target = event.target;

    setSelectedRouteIndex(Number(target.value));
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

  const routeOptionList = [{ value: '0', text: '...' }].concat(
    userRoutes.map((route: Route) => {
      return {
        value: route.id.toString(),
        text: route.name,
      };
    })
  );

  return (
    <div>
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
      {importGpxModalIsShown && (
        <Modal onClose={toggleImportGpxModal} onConfirm={importGpxHandler}>
          <SingleInputConfirmation type="file" onChange={chooseGpxFileHandler}>
            Select a GPX file to import
          </SingleInputConfirmation>
        </Modal>
      )}
      {clearModalIsShown && (
        <Modal onClose={toggleClearModal} onConfirm={clearRoutesHandler}>
          <BasicConfirmation>
            Are you sure you want to clear the route?
          </BasicConfirmation>
        </Modal>
      )}
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
      <div className={styles['route-preactions']}>
        <Button
          onClick={() => {
            toggleLoadRouteModalIsShown();
            loadRoutes();
          }}
        >
          Load Route
        </Button>
        <Button onClick={toggleImportGpxModal}>Import GPX</Button>
      </div>
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
      <div className={styles['route-actions']}>
        <Button onClick={toggleClearModal}>Clear route</Button>
        <Button
          onClick={() => {
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
          }}
        >
          New Route
        </Button>
        <Button onClick={exportGpxHandler}>Export GPX</Button>
        <Button onClick={saveRouteHandler}>Save</Button>
      </div>
    </div>
  );
};

export default RoutingMenu;
