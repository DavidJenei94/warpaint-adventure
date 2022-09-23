import { LatLng, LeafletMouseEvent } from 'leaflet';
import { Dispatch, SetStateAction } from 'react';
import { GeoJSON } from 'react-leaflet';
import {
  createBasicGeoJsonFC,
  getDistanceOfRoute,
} from '../../Utils/geojson.utils';

type RouteGeoJSONsProps = {
  routes: GeoJSON.FeatureCollection<any>[];
  setRoutes: Dispatch<SetStateAction<GeoJSON.FeatureCollection<any>[]>>;
  nodes: LatLng[];
  setNodes: Dispatch<SetStateAction<LatLng[]>>;
  setWarningMessage: Dispatch<SetStateAction<string>>;
};

const RouteGeoJSONs = ({
  routes,
  setRoutes,
  nodes,
  setNodes,
  setWarningMessage
}: RouteGeoJSONsProps) => {

  const splitGeoJSONHandler = (event: LeafletMouseEvent) => {
    // Feature array has the same indexing as routes, as all element contains only one feature
    const featuresArray = routes.map((route) => route.features[0]);

    let routeIndex: number;
    for (const key in event.target._layers) {
      routeIndex = featuresArray.lastIndexOf(event.target._layers[key].feature);
    }

    const clickedNode = event.latlng;

    let newNode: LatLng;
    setRoutes((prevState) => {
      let prevStateCopy = [...prevState];
      // let prevStateCopy = JSON.parse(JSON.stringify(prevState));

      const selectedRoute = prevStateCopy[routeIndex];
      const routeLength = selectedRoute.features[0].geometry.coordinates.length;
      // if length is short, do not split
      if (routeLength < 3) {
        setWarningMessage("Route cannot be splitted further!")
        return prevState;
      } 

      let lowestDistance: number;
      let splitIndex = 0;
      selectedRoute.features[0].geometry.coordinates.map(
        (coordinate: number[], index: number) => {
          const coordinatePoint = new LatLng(coordinate[1], coordinate[0]);
          const newDistance = clickedNode.distanceTo(coordinatePoint);

          if (!lowestDistance || lowestDistance > newDistance) {
            lowestDistance = newDistance;
            splitIndex = index;
          }
        }
      );
      const selectedNode = new LatLng(
        selectedRoute.features[0].geometry.coordinates[splitIndex][1],
        selectedRoute.features[0].geometry.coordinates[splitIndex][0]
      );

      // add new node if it does not exists, otherwise return previous route
      // and new node won't be added as it remains undefined
      if (
        nodes.some(
          (node) =>
            selectedNode.lat === node.lat && selectedNode.lng === node.lng
        )
      ) {
        setWarningMessage(`Route is already splitted at this node!`);

        return prevState;
      }

      const newCoordinate =
        selectedRoute.features[0].geometry.coordinates[splitIndex];
      newNode = new LatLng(newCoordinate[1], newCoordinate[0]);

      // split coordinates into 2 parts
      const splitRouteCoordinates1 =
        selectedRoute.features[0].geometry.coordinates.slice(0, splitIndex + 1);
      const splitRouteCoordinates2 =
        selectedRoute.features[0].geometry.coordinates.slice(splitIndex);

      // create splitted routes
      let splitRoute1 = createBasicGeoJsonFC(
        { coordinates: splitRouteCoordinates1, type: 'LineString' },
        getDistanceOfRoute(splitRouteCoordinates1)
      );
      let splitRoute2 = createBasicGeoJsonFC(
        { coordinates: splitRouteCoordinates2, type: 'LineString' },
        getDistanceOfRoute(splitRouteCoordinates2)
      );

      // add splitted routes to routes
      let newRoutes: any[] = [];

      if (routeIndex !== 0) {
        const splitRoutes1 = prevStateCopy.slice(0, routeIndex);
        newRoutes = newRoutes.concat(splitRoutes1);
      }

      newRoutes.push(splitRoute1);
      newRoutes.push(splitRoute2);

      if (routeIndex !== prevState.length - 1) {
        const splitRoutes2 = prevStateCopy.slice(routeIndex + 1);
        newRoutes = newRoutes.concat(splitRoutes2);
      }

      return newRoutes;
    });

    setNodes((prevNodeState) => {
      let prevNodeStateCopy = [...prevNodeState];

      // if new node was not created because the route part was too short
      if (newNode) {
        prevNodeStateCopy.splice(routeIndex + 1, 0, newNode);
      }

      return prevNodeStateCopy;
    });

    return;
  };

  return (
    <>
      {routes.map((route) => {
        const coordinates = route.features[0].geometry.coordinates;
        // This key is enough as there can't be 2 node placed on each other
        // Must use end coordinates to recalculate route
        const key = `route-${coordinates[0][1]}-${coordinates[0][0]}-${
          coordinates[coordinates.length - 1][1]
        }-${coordinates[coordinates.length - 1][0]}`;

        return (
          <GeoJSON
            key={key}
            attribution="&copy; credits due..."
            style={{
              color: '#2222bb',
              weight: 3.5,
              fillColor: '#aaaa00',
              fillOpacity: 0,
              opacity: 0.75,
            }}
            data={route}
            bubblingMouseEvents={false} // Prevent clicking on route to fire map's click event
            eventHandlers={{
              click: (e) => {
                splitGeoJSONHandler(e);
              },
            }}
          />
        );
      })}
    </>
  );
};

export default RouteGeoJSONs;
