import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { LatLng } from 'leaflet';
import useModal from '../../../hooks/modal-hook';
import {
  createBasicGeoJsonFC,
  getDistanceOfRoute,
  sameCoordinates,
} from '../Utils/geojson.utils';
import { useAppSelector } from '../../../hooks/redux-hooks';
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

import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button';
import BasicConfirmation from '../../UI/ConfirmationModals/BasicConfirmation';
import SingleInputConfirmation from '../../UI/ConfirmationModals/SingleInputConfirmation';
import Select from '../../UI/Select';
import ColorSelection from '../Utils/ColorSelection';
import EditDeleteText from '../../UI/Combined/EditDeleteText';

import styles from './RoutingMenu.module.scss';

type RoutingMenuProps = {
  nodes: LatLng[];
  setNodes: Dispatch<SetStateAction<LatLng[]>>;
  routes: GeoJSON.FeatureCollection<any>[];
  setRoutes: Dispatch<SetStateAction<GeoJSON.FeatureCollection<any>[]>>;
  activeRoute: Route;
  setActiveRoute: Dispatch<SetStateAction<Route>>;
  setWarningMessage: Dispatch<SetStateAction<string>>;
};

const RoutingMenu = ({
  nodes,
  setRoutes,
  routes,
  setNodes,
  activeRoute,
  setActiveRoute,
  setWarningMessage,
}: RoutingMenuProps) => {
  const token = useAppSelector((state) => state.auth.token);

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
  const [selectedColor, setSelectedColor] = useState('blue');
  const [importedGpxText, setImportedGpxText] = useState('');
  // Separate state to detect changes if name was changed or not in edit mode
  const [routeName, setRouteName] = useState('');
  // In route selection in Load Route
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

  // Display correct name after activeRoute changes (eg. load route)
  useEffect(() => {
    if (activeRoute) {
      setRouteName(activeRoute.name);
    }
  }, [activeRoute]);

  // Set color after Menu is hidden/shown
  useEffect(() => {
    activeRoute.color && setSelectedColor(activeRoute.color);
  }, []);

  // Update activeRoute with selected color
  useEffect(() => {
    setActiveRoute((prevState) => {
      return { ...prevState, color: selectedColor };
    });
  }, [selectedColor]);

  const chooseGpxFileHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // check if correct input
    // https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers

    const input = event.target;
    if (!input) {
      setWarningMessage('The browser does not does not support file input.');
      return;
    }
    if (!input.files) {
      setWarningMessage(
        'The browser does not does not support this file input.'
      );
      return;
    }
    if (!input.files![0]) {
      setWarningMessage('The file did not loaded properly.');
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
    const firstNode = new LatLng(coordinates[0][1], coordinates[0][0]);
    const lastNode = new LatLng(
      coordinates[coordinates.length - 1][1],
      coordinates[coordinates.length - 1][0]
    );

    setRoutes((prevState) => {
      if (prevState.length === 0) {
        setNodes([firstNode, lastNode]);
        return [importGpxData];
      }

      const prevFirstCoordinates =
        prevState[0].features[0].geometry.coordinates;
      const prevFirstNode = new LatLng(
        prevFirstCoordinates[0][1],
        prevFirstCoordinates[0][0]
      );
      const prevLastCoordinates =
        prevState[prevState.length - 1].features[0].geometry.coordinates;
      const prevLastNode = new LatLng(
        prevLastCoordinates[prevLastCoordinates.length - 1][1],
        prevLastCoordinates[prevLastCoordinates.length - 1][0]
      );

      // If newly added route's last node is the same as the first node of current route
      if (sameCoordinates(prevFirstNode, lastNode)) {
        setNodes((prevState) => {
          return [lastNode].concat(prevState);
        });
        return [importGpxData].concat(prevState);
      }

      // If newly added route's first node is the same as the last node of current route
      if (sameCoordinates(prevLastNode, firstNode)) {
        setNodes((prevState) => {
          return prevState.concat([lastNode]);
        });
        return prevState.concat([importGpxData]);
      }

      // check if it matches a current middle node, then throw warning message
      prevState.map((route, index) => {
        if (index === 0 || index === prevState.length) {
          return;
        }

        const routeCoordinates = route.features[0].geometry.coordinates;
        const routeFirstNode = new LatLng(
          routeCoordinates[0][1],
          routeCoordinates[0][0]
        );
        const routeLastNode = new LatLng(
          routeCoordinates[routeCoordinates.length - 1][1],
          routeCoordinates[routeCoordinates.length - 1][0]
        );

        if (
          sameCoordinates(firstNode, routeFirstNode) ||
          sameCoordinates(firstNode, routeLastNode) ||
          sameCoordinates(lastNode, routeFirstNode) ||
          sameCoordinates(lastNode, routeLastNode)
        ) {
          setWarningMessage(
            'Route cannot be connected as it starts or ends at the middle of the current route!'
          );

          return prevState;
        }
      });

      // otherwise draw a connecting route with 1 extra node at the middle
      const smallerLng =
        prevLastNode.lng < firstNode.lng ? prevLastNode.lng : firstNode.lng;
      const smallerLat =
        prevLastNode.lat < firstNode.lat ? prevLastNode.lat : firstNode.lat;
      const middleRouteCoordinate = [
        smallerLng + Math.abs(prevLastNode.lng - firstNode.lng) / 2,
        smallerLat + Math.abs(prevLastNode.lat - firstNode.lat) / 2,
      ];
      const middleNode = new LatLng(
        middleRouteCoordinate[1],
        middleRouteCoordinate[0]
      );

      const connectingCoordinates1 = [
        [prevLastNode.lng, prevLastNode.lat],
        middleRouteCoordinate,
      ];
      const connectingRoute1 = createBasicGeoJsonFC(
        { coordinates: connectingCoordinates1, type: 'LineString' },
        getDistanceOfRoute(connectingCoordinates1)
      );
      const connectingCoordinates2 = [
        middleRouteCoordinate,
        [firstNode.lng, firstNode.lat],
      ];
      const connectingRoute2 = createBasicGeoJsonFC(
        { coordinates: connectingCoordinates2, type: 'LineString' },
        getDistanceOfRoute(connectingCoordinates2)
      );

      setNodes((prevState) => {
        return [...prevState]
          .concat([middleNode])
          .concat([firstNode])
          .concat([lastNode]);
      });

      return [...prevState]
        .concat(connectingRoute1)
        .concat(connectingRoute2)
        .concat(importGpxData);
    });
  }, [importGpxStatus, importGpxError, importGpxData]);

  const exportGpxHandler = async () => {
    if (routes.length === 0) {
      setWarningMessage('No route to export!');
      return;
    }

    let mergedCoordinates: number[][] = [];
    let totalDistance = 0;
    routes.map((route) => {
      mergedCoordinates = mergedCoordinates.concat(
        route.features[0].geometry.coordinates
      );
      totalDistance += route.features[0].properties
        ? route.features[0].properties.distance
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
    setRoutes([]);
    setNodes([]);
  };

  const deleteRouteHandler = async () => {
    setRoutes([]);
    setNodes([]);

    sendDeleteRouteRequest({
      token,
      id: activeRoute.id,
      path: activeRoute.path,
    });
  };

  useFetchDataEffect(() => {
    setActiveRoute({
      id: 0,
      name: '',
      path: '',
      color: 'blue',
    });
  }, [deleteRouteStatus, deleteRouteError, deleteRouteData]);

  const confirmNameChangeHandler = () => {
    // If name was not changed
    if (activeRoute.name === routeName) {
      return;
    }

    setActiveRoute((prevState) => {
      return { ...prevState, name: routeName };
    });

    //Maybe fetch PUT to change name save if route was saved before (it has a path!)
  };

  const saveRouteHandler = async () => {
    if (!activeRoute.name) {
      toggleWarningFeedback('Route has no name!');
      return;
    }

    if (routes.length === 0) {
      toggleWarningFeedback('No route on map!');
      return;
    }

    let mergedCoordinates: number[][] = [];
    let totalDistance = 0;
    routes.map((route) => {
      mergedCoordinates = mergedCoordinates.concat(
        route.features[0].geometry.coordinates
      );
      totalDistance += route.features[0].properties
        ? route.features[0].properties.distance
        : 0;
    });

    const mergedGeoJson = createBasicGeoJsonFC(
      { coordinates: mergedCoordinates, type: 'LineString' },
      totalDistance
    );

    if (activeRoute.id === 0) {
      sendCreateRouteRequest({ token, activeRoute, mergedGeoJson });
    } else {
      sendUpdateRouteRequest({
        token,
        id: activeRoute.id,
        activeRoute,
        mergedGeoJson,
      });
    }
  };

  useFetchDataEffect(() => {
    // update active route with the created route's name and color
    setActiveRoute(createRouteData.route);
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
    setActiveRoute(getRouteData.route);
    setRoutes([getRouteData.geoJson]);

    const coordinates = getRouteData.geoJson.features[0].geometry.coordinates;
    const firstNode = new LatLng(coordinates[0][1], coordinates[0][0]);
    const lastNode = new LatLng(
      coordinates[coordinates.length - 1][1],
      coordinates[coordinates.length - 1][0]
    );
    setNodes([firstNode, lastNode]);
    setSelectedColor(getRouteData.route.color);
  }, [getRouteStatus, getRouteError, getRouteData]);

  const routeSelectionChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target = event.target;

    setSelectedRouteIndex(Number(target.value));
  };

  const totalDistance =
    routes.length > 0
      ? round(
          routes.reduce((total, route) => {
            if (route.features[0].properties) {
              total += route.features[0].properties!.distance;
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
            setActiveRoute({ id: 0, name: '', path: '', color: 'blue' });
            setRoutes([]);
            setNodes([]);
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
