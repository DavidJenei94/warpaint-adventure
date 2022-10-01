import { useEffect } from 'react';
import { LatLng } from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import { createBasicGeoJsonFC } from '../Utils/geojson.utils';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import useMapControl from '../../../hooks/map-controls-hook';
import { routeActions } from '../../../store/route';
import { toggleWarningFeedback } from '../../../store/feedback-toggler-actions';
import { usePrompt } from '../../../hooks/prompt-hook';

import MapLayout from '../Layout/MapLayout';
import RoutingMenu from './RoutingMenu';
import Map from '../Layout/Map';
import NodeMarkers from './DataDisplay/NodeMarkers';
import RouteGeoJSONs from './DataDisplay/RouteGeoJSONs';

import styles from './RoutingPlanner.module.scss';

const RoutingPlanner = () => {
  const dispatch = useAppDispatch();

  const route = useAppSelector((state) => state.route.route);
  const routeSections = useAppSelector((state) => state.route.routeSections);
  const nodes = useAppSelector((state) => state.route.nodes);
  const isChanged = useAppSelector((state) => state.route.isChanged);

  usePrompt('You have unsaved work. Do you want to navigate away?', isChanged);

  const { isMenuShown, toggleMenu, dataBounds, dataRef } = useMapControl([
    routeSections,
    nodes,
  ]);

  // Set to "not changed the route" if it is not an edited/loaded route and no nodes there
  useEffect(() => {
    if (nodes.length === 0 && route.name === '') {
      dispatch(routeActions.setIsChanged(false));
    }
  }, [nodes, routeSections, route]);

  const handleFetchedRoutingData = (
    data: any,
    nodeIndex = -1,
    startNode = false
  ) => {
    const coordinates = data.features[0].geometry.coordinates;
    const coordinatesLength = coordinates.length;

    // if node is dragged
    if (nodeIndex !== -1) {
      const updatedNode = !startNode
        ? new LatLng(
            coordinates[coordinatesLength - 1][1],
            coordinates[coordinatesLength - 1][0]
          )
        : new LatLng(coordinates[0][1], coordinates[0][0]);

      dispatch(
        routeActions.updateNode({
          index: nodeIndex,
          coordinates: [updatedNode.lat, updatedNode.lng],
        })
      );

      // return if only 1 node is there
      if (nodes.length === 1) {
        return;
      }

      const newFeatureCollection = createBasicGeoJsonFC(
        data.features[0].geometry,
        data.features[0].properties.summary.distance
      );
      if (startNode) {
        dispatch(
          routeActions.updateRouteSection({
            index: nodeIndex,
            routeSection: newFeatureCollection,
          })
        );
      }
      if (!startNode) {
        dispatch(
          routeActions.updateRouteSection({
            index: nodeIndex - 1,
            routeSection: newFeatureCollection,
          })
        );
      }

      return;
    }

    // otherwise if new node is placed
    const newLat = coordinates[coordinatesLength - 1][1];
    const newLng = coordinates[coordinatesLength - 1][0];

    // do not create new node at coordinate of a previous one
    // (it would create 1st node twice and do not create more at dead ends)
    if (
      nodes.some((node) => node[0] === newLat && node[1] === newLng) &&
      nodes.length !== 0
    ) {
      toggleWarningFeedback(
        `Node already exists at coordinate: Lat: ${newLat}, Lng: ${newLng}`
      );
      return;
    } else {
      dispatch(routeActions.addNode([newLat, newLng]));
    }

    // on first node fetch there is only one coordinate
    // should not set route
    if (coordinatesLength !== 1) {
      // reduce geoJson data by removing unnecessary data
      const newFeatureCollection = createBasicGeoJsonFC(
        data.features[0].geometry,
        data.features[0].properties.summary.distance
      );
      dispatch(routeActions.addRouteSection(newFeatureCollection));
    }
  };

  // console.log(routeSections);
  // console.log(nodes);

  // const nodesLatLng = nodes.map((node) => new LatLng(node[0], node[1]));

  return (
    <>
      <MapLayout isMenuShown={isMenuShown}>
        {isMenuShown && <RoutingMenu />}
        <Map
          dataBounds={dataBounds}
          isMenuShown={isMenuShown}
          toggleMenu={toggleMenu}
        >
          <FeatureGroup ref={dataRef}>
            <RouteGeoJSONs />
            <NodeMarkers handleFetchedRoutingData={handleFetchedRoutingData} />
          </FeatureGroup>
        </Map>
      </MapLayout>
    </>
  );
};

export default RoutingPlanner;
