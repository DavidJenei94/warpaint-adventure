import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';
import { FeatureGroup, Marker } from 'react-leaflet';
import { errorHandlingFetch } from '../../../utils/errorHanling';
import {
  createBasicGeoJsonFC,
  getDistanceOfRoute,
} from '../Utils/geojson.utils';

import MapLayout from '../Layout/MapLayout';
import RoutingMenu from './RoutingMenu';
import Map from '../Layout/Map';
import CurrentPosition from '../Utils/CurrentPosition';
import GeoJSONs from '../Utils/GeoJSONs';

import styles from './RoutingPlanner.module.scss';
import { nodeIcon } from '../Utils/Icons';

const RoutingPlanner = () => {
  const [nextPosition, setNextPosition] = useState<LatLng | null>(null);
  const [nodes, setNodes] = useState<LatLng[]>([]);
  const [routes, setRoutes] = useState<GeoJSON.FeatureCollection<any>[]>([]);

  const [indexOfDraggedNode, setIndexOfDraggedNode] = useState<number | null>(
    null
  );
  const [indexOfClickedRoute, setIndexOfClickedRoute] = useState<number | null>(
    null
  );

  useEffect(() => {
    const checkSplit = (indexOfClickedRoute: number) => {
      let newNode: LatLng;

      setRoutes((prevState) => {
        let prevStateCopy = [...prevState];
        // let prevStateCopy = JSON.parse(JSON.stringify(prevState));

        const selectedRoute = prevStateCopy[indexOfClickedRoute];
        const routeLength =
          selectedRoute.features[0].geometry.coordinates.length;
        if (routeLength < 3) return prevState; // if length is short, do not split

        // split coordinates into 2 parts
        const splitIndex = Math.ceil(routeLength / 2);
        const splitRouteCoordinates1 =
          selectedRoute.features[0].geometry.coordinates.slice(0, splitIndex);
        const splitRouteCoordinates2 =
          selectedRoute.features[0].geometry.coordinates.slice(splitIndex - 1);

        // create splitted routes
        let splitRoute1 = createBasicGeoJsonFC(
          { coordinates: splitRouteCoordinates1, type: 'LineString' },
          getDistanceOfRoute(splitRouteCoordinates1)
        );
        let splitRoute2 = createBasicGeoJsonFC(
          { coordinates: splitRouteCoordinates2, type: 'LineString' },
          getDistanceOfRoute(splitRouteCoordinates2)
        );

        // add new node
        const newCoordinate =
          selectedRoute.features[0].geometry.coordinates[splitIndex - 1];
        newNode = new LatLng(newCoordinate[1], newCoordinate[0]);

        // add splitted routes to routes
        let newRoutes: any[] = [];

        if (indexOfClickedRoute !== 0) {
          const splitRoutes1 = prevStateCopy.slice(0, indexOfClickedRoute);
          newRoutes = newRoutes.concat(splitRoutes1);
        }

        newRoutes.push(splitRoute1);
        newRoutes.push(splitRoute2);

        if (indexOfClickedRoute !== prevState.length - 1) {
          const splitRoutes2 = prevStateCopy.slice(indexOfClickedRoute + 1);
          newRoutes = newRoutes.concat(splitRoutes2);
        }

        return newRoutes;
      });

      setNodes((prevNodeState) => {
        let prevNodeStateCopy = [...prevNodeState];

        prevNodeStateCopy.splice(indexOfClickedRoute + 1, 0, newNode);

        return prevNodeStateCopy;
      });

      setIndexOfClickedRoute(null);
      setNextPosition(null);
      return;
    };

    const handleNodeChange = async () => {
      if (!nextPosition) return;

      // handle new node
      if (indexOfDraggedNode === null || indexOfDraggedNode === -1) {
        let routingData;
        // fetch route with first node (both from and to) to adjust to a route point
        if (nodes[0]) {
          routingData = await fetchRoute(nodes[nodes.length - 1], nextPosition);
        } else {
          routingData = await fetchRoute(nextPosition, nextPosition);
        }

        handleFetchedRoutingData(routingData);

        setNextPosition(null);
        return;
      }

      // handle dragged node
      if (indexOfDraggedNode || indexOfDraggedNode === 0) {
        let routingData;
        if (nodes[indexOfDraggedNode - 1]) {
          routingData = await fetchRoute(
            nodes[indexOfDraggedNode - 1],
            nextPosition
          );

          handleFetchedRoutingData(routingData, indexOfDraggedNode);
        }
        if (nodes[indexOfDraggedNode + 1]) {
          routingData = await fetchRoute(
            nextPosition,
            nodes[indexOfDraggedNode + 1]
          );

          handleFetchedRoutingData(routingData, indexOfDraggedNode, true);
        }

        setIndexOfDraggedNode(null);
        setNextPosition(null);
      }
    };

    // handle route splitting when route is clicked
    if ((indexOfClickedRoute || indexOfClickedRoute === 0) && nextPosition) {
      checkSplit(indexOfClickedRoute);
    } else {
      handleNodeChange();
    }
  }, [nodes, nextPosition, indexOfDraggedNode, indexOfClickedRoute]);

  const fetchRoute = async (startPos: LatLng, endPos: LatLng) => {
    try {
      const response = await fetch(
        `http://localhost:8080/ors/v2/directions/foot-hiking?start=${startPos.lng},${startPos.lat}&end=${endPos.lng},${endPos.lat}`
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message);
      }

      return data;
    } catch (err: any) {
      errorHandlingFetch(err.message);
      return null;
    }
  };

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
    setNodes((prevState) => {
      // On first node placed it would place another one
      // prevent this with returning prevState
      if (
        prevState[0] &&
        !prevState[1] &&
        prevState[0].lat === coordinates[coordinatesLength - 1][1] &&
        prevState[0].lng === coordinates[coordinatesLength - 1][0]
      ) {
        return prevState;
      }

      const prevStateCopy = [...prevState];
      return [...prevStateCopy].concat(
        new LatLng(
          coordinates[coordinatesLength - 1][1],
          coordinates[coordinatesLength - 1][0]
        )
      );
    });

    // on first node there is only one coordinate
    // should not set routes with it
    if (coordinatesLength !== 1) {
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

  console.log(routes);
  // console.log(nodes);

  return (
    <>
      <MapLayout>
        <RoutingMenu nodes={nodes} />
        <Map>
          <CurrentPosition setPosition={setNextPosition} />
          <FeatureGroup>
            <GeoJSONs
              geoJSONs={routes}
              setClickedRouteIndex={setIndexOfClickedRoute}
            />
          </FeatureGroup>
          {nodes[0] &&
            nodes.map((node, index) => (
              <Marker
                key={index}
                position={node}
                icon={nodeIcon}
                draggable={true}
                autoPan={true}
                eventHandlers={{
                  dragstart: (e) => {
                    setNextPosition(null);

                    setIndexOfDraggedNode(
                      nodes.lastIndexOf(e.target.getLatLng())
                    );
                  },
                  dragend: (e) => {
                    setNextPosition(e.target.getLatLng());
                  },
                }}
              ></Marker>
            ))}
        </Map>
      </MapLayout>
    </>
  );
};

export default RoutingPlanner;
