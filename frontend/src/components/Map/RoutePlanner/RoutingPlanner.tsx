import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';
import { createBasicGeoJsonFC } from '../Utils/geojson.utils';
import { Status, toggleFeedback } from '../../../store/feedback';
import { useAppDispatch } from '../../../hooks/redux-hooks';

import MapLayout from '../Layout/MapLayout';
import RoutingMenu from './RoutingMenu';
import Map from '../Layout/Map';
import NodeMarkers from './DataDisplay/NodeMarkers';
import RouteGeoJSONs from './DataDisplay/RouteGeoJSONs';

import styles from './RoutingPlanner.module.scss';

const RoutingPlanner = () => {
  const dispatch = useAppDispatch();

  const [nodes, setNodes] = useState<LatLng[]>([]);
  const [routes, setRoutes] = useState<GeoJSON.FeatureCollection<any>[]>([]);

  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (warningMessage) {
      dispatch(
        toggleFeedback({
          status: Status.WARNING,
          message: warningMessage,
          showTime: 3,
        })
      );
    }

    setWarningMessage('');
  }, [warningMessage]);

  const handleFetchedRoutingData = (
    data: any,
    nodeIndex = -1,
    startNode = false
  ) => {
    const coordinates = data.features[0].geometry.coordinates;
    const coordinatesLength = coordinates.length;

    // if node is dragged
    if (nodeIndex !== -1) {
      setNodes((prevState) => {
        const prevStateCopy = [...prevState];

        prevStateCopy[nodeIndex] = !startNode
          ? new LatLng(
              coordinates[coordinatesLength - 1][1],
              coordinates[coordinatesLength - 1][0]
            )
          : new LatLng(coordinates[0][1], coordinates[0][0]);

        return prevStateCopy;
      });

      // return if only 1 node is there
      if (nodes.length === 1) {
        return;
      }

      setRoutes((prevState) => {
        const prevStateCopy = [...prevState];

        const newFeatureCollection = createBasicGeoJsonFC(
          data.features[0].geometry,
          data.features[0].properties.summary.distance
        );
        if (startNode) {
          prevStateCopy[nodeIndex] = newFeatureCollection;
        }
        if (!startNode) {
          prevStateCopy[nodeIndex - 1] = newFeatureCollection;
        }

        return prevStateCopy;
      });

      return;
    }

    // otherwise if new node is placed
    const newLat = coordinates[coordinatesLength - 1][1];
    const newLng = coordinates[coordinatesLength - 1][0];
    let nodeAlreadyExists = false; // and if not the 1st node

    // do not create new node at coordinate of a previous one
    // (it would create 1st node twice and do not create more at dead ends)
    setNodes((prevState) => {
      if (
        prevState.some((node) => node.lat === newLat && node.lng === newLng)
      ) {
        nodeAlreadyExists = nodes.length !== 0;
      }

      if (nodeAlreadyExists) {
        setWarningMessage(
          `Node already exists at coordinate: Lat: ${newLat}, Lng: ${newLng}`
        );
        return prevState;
      }

      const prevStateCopy = [...prevState];
      return [...prevStateCopy].concat(new LatLng(newLat, newLng));
    });

    // on first node fetch there is only one coordinate
    // should not set route
    // and if clicked where node already exists
    if (coordinatesLength !== 1 && !nodeAlreadyExists) {
      setRoutes((prevState) => {
        const prevStateCopy = [...prevState];
        // reduce geoJson data by removing unnecessary data
        const newFeatureCollection = createBasicGeoJsonFC(
          data.features[0].geometry,
          data.features[0].properties.summary.distance
        );
        return [...prevStateCopy].concat(newFeatureCollection);
      });
    }
  };

  // console.log(routes);
  // console.log(nodes);

  return (
    <>
      <MapLayout>
        <RoutingMenu nodes={nodes} />
        <Map>
          <RouteGeoJSONs
            routes={routes}
            setRoutes={setRoutes}
            nodes={nodes}
            setNodes={setNodes}
            setWarningMessage={setWarningMessage}
          />
          <NodeMarkers
            nodes={nodes}
            setNodes={setNodes}
            routes={routes}
            setRoutes={setRoutes}
            handleFetchedRoutingData={handleFetchedRoutingData}
          />
        </Map>
      </MapLayout>
    </>
  );
};

export default RoutingPlanner;
