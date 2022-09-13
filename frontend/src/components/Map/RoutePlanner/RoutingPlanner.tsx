import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';
import { GeoJSON, Marker } from 'react-leaflet';

import MapLayout from '../Layout/MapLayout';
import RoutingMenu from './RoutingMenu';
import Map from '../Layout/Map';

import styles from './RoutingPlanner.module.scss';
import CurrentPosition from '../Utils/CurrentPosition';
import GeoJSONs from '../Utils/GeoJSONs';
import { nodeIcon } from '../Utils/Icons';
import { errorHandlingFetch } from '../../../utils/errorHanling';

const RoutingPlanner = () => {
  const [nextPosition, setNextPosition] = useState<LatLng | null>(null);
  const [nodes, setNodes] = useState<LatLng[]>([]);
  const [routes, setRoutes] = useState<GeoJSON.FeatureCollection<any>[]>([]);

  useEffect(() => {
    // fetch route with first node to adjust to a route
    if (nodes[0] && nextPosition) {
      fetchRoute(nodes[nodes.length - 1], nextPosition);
    } else if (nextPosition) {
      fetchRoute(nextPosition, nextPosition);
    }
  }, [nodes[0], nextPosition]);

  const fetchRoute = async (startPos: LatLng, endPos: LatLng) => {
    try {
      const response = await fetch(
        `http://localhost:8080/ors/v2/directions/foot-hiking?start=${startPos.lng},${startPos.lat}&end=${endPos.lng},${endPos.lat}`
      );

      const data = await response.json();
      // console.log(data);
      if (!response.ok) {
        throw new Error(data.error.message);
      }

      const coordinates = data.features[0].geometry.coordinates;
      setNodes((prevState) => {
        // On first node placed it would place another one
        // prevent this with returning prevState
        if (
          prevState[0] &&
          !prevState[1] &&
          prevState[0].lat === coordinates[coordinates.length - 1][1] &&
          prevState[0].lng === coordinates[coordinates.length - 1][0]
        ) {
          return prevState;
        }
        return [...prevState].concat(
          new LatLng(
            coordinates[coordinates.length - 1][1],
            coordinates[coordinates.length - 1][0]
          )
        );
      });

      setRoutes((prevState) => {
        return [...prevState].concat(data);
      });
    } catch (err: any) {
      errorHandlingFetch(err.message);
    }
  };

  // console.log(routes);
  // console.log(nodes);

  return (
    <>
      <MapLayout>
        <RoutingMenu nodes={nodes}/>
        <Map>
          <CurrentPosition setPosition={setNextPosition} />
          <GeoJSONs geoJSONs={routes} />
          {nodes[0] &&
            nodes.map((node, index) => (
              <Marker
                key={index}
                position={node}
                icon={nodeIcon}
                draggable={true}
              ></Marker>
            ))}
        </Map>
      </MapLayout>
    </>
  );
};

export default RoutingPlanner;
