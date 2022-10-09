import { LatLng, LeafletMouseEvent } from 'leaflet';
import { GeoJSON } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux-hooks';
import { toggleWarningFeedback } from '../../../../store/feedback-toggler-actions';
import { routeActions } from '../../../../store/route';
import {
  createBasicGeoJsonFC,
  getDistanceOfRoute,
} from '../../Utils/geojson.utils';

const RouteGeoJSONs = () => {
  const dispatch = useAppDispatch();

  const nodes: number[][] = useAppSelector((state) => state.route.nodes);
  const routeSections: GeoJSON.FeatureCollection<any>[] = useAppSelector(
    (state) => state.route.routeSections
  );
  const routeColor: string = useAppSelector((state) => state.route.route.color);

  const splitGeoJSONHandler = (event: LeafletMouseEvent) => {
    // Feature array has the same indexing as routes, as all element contains only one feature
    // lastIndexOf works because routeSections holds references
    const featuresArray: GeoJSON.Feature<any>[] = routeSections.map(
      (routeSection) => routeSection.features[0]
    );
    let routeIndex: number = -1;
    for (const key in event.target._layers) {
      routeIndex = featuresArray.lastIndexOf(event.target._layers[key].feature);
    }
    const clickedNode: LatLng = event.latlng;

    const selectedRoute: GeoJSON.FeatureCollection<any> =
      routeSections[routeIndex];
    const routeLength: number =
      selectedRoute.features[0].geometry.coordinates.length;
    // if length is short, do not split
    if (routeLength < 3) {
      toggleWarningFeedback('Route Section cannot be splitted further!');
      return;
    }

    let lowestDistance: number;
    let splitIndex: number = 0;
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
    const selectedNode: LatLng = new LatLng(
      selectedRoute.features[0].geometry.coordinates[splitIndex][1],
      selectedRoute.features[0].geometry.coordinates[splitIndex][0]
    );

    // add new node if it does not exists, otherwise return previous route
    // and new node won't be added as it remains undefined
    if (
      nodes.some(
        (node) => selectedNode.lat === node[0] && selectedNode.lng === node[1]
      )
    ) {
      toggleWarningFeedback('Route Section is already splitted at this node!');
      return;
    }

    const newCoordinate: number[] =
      selectedRoute.features[0].geometry.coordinates[splitIndex];
    const newNode: LatLng = new LatLng(newCoordinate[1], newCoordinate[0]);
    // split coordinates into 2 parts
    const splitRouteCoordinates1: number[][] =
      selectedRoute.features[0].geometry.coordinates.slice(0, splitIndex + 1);
    const splitRouteCoordinates2: number[][] =
      selectedRoute.features[0].geometry.coordinates.slice(splitIndex);
    // create splitted routes
    let splitRoute1: GeoJSON.FeatureCollection<any> = createBasicGeoJsonFC(
      { coordinates: splitRouteCoordinates1, type: 'LineString' },
      getDistanceOfRoute(splitRouteCoordinates1)
    );
    let splitRoute2: GeoJSON.FeatureCollection<any> = createBasicGeoJsonFC(
      { coordinates: splitRouteCoordinates2, type: 'LineString' },
      getDistanceOfRoute(splitRouteCoordinates2)
    );
    // add splitted routes to routes
    let newRoutes: GeoJSON.FeatureCollection<any>[] = [];
    if (routeIndex !== 0) {
      const splitRoutes1 = routeSections.slice(0, routeIndex);
      newRoutes = newRoutes.concat(splitRoutes1);
    }
    newRoutes.push(splitRoute1);
    newRoutes.push(splitRoute2);
    if (routeIndex !== routeSections.length - 1) {
      const splitRoutes2 = routeSections.slice(routeIndex + 1);
      newRoutes = newRoutes.concat(splitRoutes2);
    }

    dispatch(routeActions.setRouteSections(newRoutes));
    dispatch(
      routeActions.insertNode({
        index: routeIndex + 1,
        deleteCount: 0,
        insertElement: [newNode.lat, newNode.lng],
      })
    );
  };

  return (
    <>
      {routeSections.map((routeSection) => {
        const coordinates: number[][] =
          routeSection.features[0].geometry.coordinates;

        // This key is enough as there can't be 2 node placed on each other
        // Must use end coordinates to recalculate route
        const key: string = `route-${coordinates[0][1]}-${coordinates[0][0]}-${
          coordinates[coordinates.length - 1][1]
        }-${coordinates[coordinates.length - 1][0]}`;

        return (
          <GeoJSON
            key={key}
            attribution="&copy; credits due..."
            style={{
              color: routeColor,
              weight: 3.5,
              fillColor: '#aaaa00',
              fillOpacity: 0,
              // opacity: 0.75,
            }}
            data={routeSection}
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
