import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { LatLng } from 'leaflet';
import Button from '../../UI/Button';

import styles from './RoutingMenu.module.scss';
import useModal from '../../../hooks/modal-hook';
import Modal from '../../UI/Modal/Modal';
import BasicConfirmation from '../../UI/ConfirmationModals/BasicConfirmation';
import SingleInputConfirmation from '../../UI/ConfirmationModals/SingleInputConfirmation';
import {
  createBasicGeoJsonFC,
  getDistanceOfRoute,
  sameCoordinates,
} from '../Utils/geojson.utils';
import { errorHandlingFetch } from '../../../utils/errorHanling';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import {
  feedbackActions,
  Status,
  toggleFeedback,
} from '../../../store/feedback';
import Input from '../../UI/Input';
import editIcon from '../../../assets/icons/icons-edit-16.png';
import deleteIcon from '../../../assets/icons/icons-trash-16.png';
import { round } from '../../../utils/general.utils';
import EditDeleteText from '../../UI/Combined/EditDeleteText';
import { Route } from '../../../models/route.model';
import Select from '../../UI/Select';

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
  const dispatch = useAppDispatch();
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

  const [allRoutes, setAllRoutes] = useState([]);

  const [importedGpx, setImportedGpx] = useState('');

  const [routeName, setRouteName] = useState('');
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  useEffect(() => {
    if (activeRoute) {
      setRouteName(activeRoute.name);
    }
  }, [activeRoute]);

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
    setImportedGpx(text);

    // Older version:
    // const fileReader = new FileReader();
    // fileReader.onload = (event) =>
    //   setImportedGpx(event.target!.result as string);
    // fileReader.readAsText(file);
  };

  const importGpxHandler = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/gpx/import/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gpxString: importedGpx }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      const coordinates = data.features[0].geometry.coordinates;
      const firstNode = new LatLng(coordinates[0][1], coordinates[0][0]);
      const lastNode = new LatLng(
        coordinates[coordinates.length - 1][1],
        coordinates[coordinates.length - 1][0]
      );

      setRoutes((prevState) => {
        if (prevState.length === 0) {
          setNodes([firstNode, lastNode]);
          return [data];
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
          return [data].concat(prevState);
        }

        // If newly added route's first node is the same as the last node of current route
        if (sameCoordinates(prevLastNode, firstNode)) {
          setNodes((prevState) => {
            return prevState.concat([lastNode]);
          });
          return prevState.concat([data]);
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
          .concat(data);
      });
    } catch (err: any) {
      errorHandlingFetch(err.message);
    }
  };

  const exportGpxHandler = async () => {
    if (routes.length === 0) {
      setWarningMessage('No route to export!');
    }

    try {
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

      const response = await fetch('http://localhost:4000/api/gpx/export/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ geoJson: mergedGeoJson }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      // export gpx as a file
      const element = document.createElement('a');
      const file = new Blob([data], { type: 'application/gpx+xml' });
      element.href = URL.createObjectURL(file);
      element.download = 'route.gpx';
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    } catch (err: any) {
      errorHandlingFetch(err.message);
    }
  };

  const clearRoutesHandler = () => {
    setRoutes([]);
    setNodes([]);
  };

  // edit this to fetch delete
  const deleteRouteHandler = async () => {
    setRoutes([]);
    setNodes([]);

    const result = await fetch(
      `http://localhost:4000/api/route/${activeRoute.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          routePath: activeRoute.path,
        }),
      }
    );

    const data = await result.json();
    setActiveRoute(data.route);

    dispatch(
      toggleFeedback({
        status: Status.SUCCESS,
        message: data.message,
      })
    );
  };

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
    try {
      if (!activeRoute.name) {
        throw new Error('Route has no name!');
      }

      if (routes.length === 0) {
        throw new Error('No route on map!');
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

      const method = activeRoute.id === 0 ? 'POST' : 'PUT';
      const url =
        activeRoute.id === 0
          ? 'http://localhost:4000/api/route'
          : `http://localhost:4000/api/route/${activeRoute.id}`;
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          route: { ...activeRoute },
          geoJson: mergedGeoJson,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      if (method === 'POST') setActiveRoute(data.route);

      dispatch(
        toggleFeedback({
          status: Status.SUCCESS,
          message: data.message,
        })
      );
    } catch (error: any) {
      errorHandlingFetch(error);
    }
  };

  const loadRoutes = async () => {
    try {
      const result = await fetch('http://localhost:4000/api/route', {
        method: 'GET',
        headers: { 'x-access-token': token },
      });

      const data = await result.json();
      if (!result.ok) {
        throw new Error(data.message);
      }

      setAllRoutes(data);
    } catch (error: any) {
      errorHandlingFetch(error);
    }
  };

  const loadRouteHandler = async () => {
    try {
      if (selectedRouteIndex === 0) {
        throw new Error("Select a valid route!");
      }

      const result = await fetch(
        `http://localhost:4000/api/route/${selectedRouteIndex}`,
        {
          method: 'GET',
          headers: { 'x-access-token': token },
        }
      );

      const data = await result.json();
      if (!result.ok) {
        throw new Error(data.message);
      }

      setActiveRoute(data.route);
      setRoutes([data.geoJson]);
      const coordinates = data.geoJson.features[0].geometry.coordinates;
      const firstNode = new LatLng(coordinates[0][1], coordinates[0][0]);
      const lastNode = new LatLng(
        coordinates[coordinates.length - 1][1],
        coordinates[coordinates.length - 1][0]
      );
      setNodes([firstNode, lastNode]);
    } catch (error: any) {
      errorHandlingFetch(error);
    }
  };

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
    allRoutes.map((route: Route) => {
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
      <div className={styles['route-summary']}>
        <p>{`Distance: ${totalDistance} km`}</p>
        <p>Elevation Gain: TBD</p>
        <p>Elevation Loss: TBD</p>
      </div>
      <div className={styles['route-actions']}>
        <Button onClick={toggleClearModal}>Clear route</Button>
        <Button
          onClick={() => {
            setActiveRoute({ id: 0, name: '', path: '' });
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
