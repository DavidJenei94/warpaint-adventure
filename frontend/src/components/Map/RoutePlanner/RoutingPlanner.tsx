import { useState } from 'react';
import { LatLng } from 'leaflet';
import { createBasicGeoJsonFC } from '../Utils/geojson.utils';

import MapLayout from '../Layout/MapLayout';
import RoutingMenu from './RoutingMenu';
import Map from '../Layout/Map';
import NodeMarkers from './DataDisplay/NodeMarkers';
import RouteGeoJSONs from './DataDisplay/RouteGeoJSONs';

import styles from './RoutingPlanner.module.scss';

const RoutingPlanner = () => {
  const [nodes, setNodes] = useState<LatLng[]>([]);
  const [routes, setRoutes] = useState<GeoJSON.FeatureCollection<any>[]>([]);

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
