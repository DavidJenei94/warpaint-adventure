import { useState } from 'react';
import { Icon, LatLng, Point } from 'leaflet';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import {
  createBasicGeoJsonFC,
  fetchGeoJSONRoute,
} from '../../Utils/geojson.utils';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux-hooks';
import { routeActions } from '../../../../store/route';

import Button from '../../../UI/Button';

import styles from './NodeMarkers.module.scss';
import nodeIcons from '../../Utils/Icons';
import deleteIcon from '../../../../assets/icons/icons-trash-16.png';

interface NodeMarkersProps {
  handleFetchedRoutingData: (
    data: any,
    nodeIndex?: number,
    startNode?: boolean
  ) => void;
}

const NodeMarkers = ({ handleFetchedRoutingData }: NodeMarkersProps) => {
  const dispatch = useAppDispatch();

  const nodes: number[][] = useAppSelector((state) => state.route.nodes);
  const nodesLatLng: LatLng[] = nodes.map(
    (node) => new LatLng(node[0], node[1])
  );
  const routeSections: GeoJSON.FeatureCollection<any>[] = useAppSelector(
    (state) => state.route.routeSections
  );
  const routeColor: string = useAppSelector((state) => state.route.route.color);

  const [selectedNode, setSelectedNode] = useState<LatLng | null>(null);

  const map = useMapEvents({
    click: (e) => {
      newNodeHandler(e.latlng);
    },
  });

  const newNodeHandler = async (position: LatLng) => {
    let routingData: any;
    // fetch route with first node (both from and to) to adjust to a route point
    if (nodes[0]) {
      routingData = await fetchGeoJSONRoute(
        nodesLatLng[nodesLatLng.length - 1],
        position
      );
    } else {
      routingData = await fetchGeoJSONRoute(position, position);
    }

    handleFetchedRoutingData(routingData);
  };

  const deleteMarkerHandler = () => {
    const selectedNodeStringed: string =
      '' + selectedNode!.lat + selectedNode!.lng;
    const selectedNodeIndex: number = nodes
      .map((node) => '' + node[0] + node[1])
      .lastIndexOf(selectedNodeStringed);

    dispatch(routeActions.deleteNode(selectedNodeIndex));

    // For route sections:
    //handle first node
    if (selectedNodeIndex === 0) {
      dispatch(routeActions.deleteRouteSection(selectedNodeIndex));
      return;
    }
    //handle last node
    if (selectedNodeIndex === nodes.length - 1) {
      dispatch(routeActions.deleteRouteSection(selectedNodeIndex - 1));
      return;
    }
    // handle middle nodes
    const mergedCoordinates: number[][] = routeSections[
      selectedNodeIndex - 1
    ].features[0].geometry.coordinates.concat(
      routeSections[selectedNodeIndex].features[0].geometry.coordinates
    );
    const distanceSum: number =
      routeSections[selectedNodeIndex - 1].features[0].properties!.distance +
      routeSections[selectedNodeIndex].features[0].properties!.distance;
    const mergedRoutes: GeoJSON.FeatureCollection<any> = createBasicGeoJsonFC(
      { coordinates: mergedCoordinates, type: 'LineString' },
      distanceSum
    );
    dispatch(
      routeActions.insertRouteSection({
        index: selectedNodeIndex - 1,
        deleteCount: 2,
        insertElement: mergedRoutes,
      })
    );
  };

  const dragNodeHandler = async (newNode: LatLng) => {
    let routingData: any;
    // only one node is there
    if (nodes.length === 1) {
      routingData = await fetchGeoJSONRoute(newNode, newNode);

      handleFetchedRoutingData(routingData, 0);

      return;
    }

    const selectedNodeIndex: number = nodes
      .map((node) => '' + node[0] + node[1])
      .lastIndexOf('' + selectedNode!.lat + selectedNode!.lng);

    // previous route recalculate
    if (nodesLatLng[selectedNodeIndex - 1]) {
      routingData = await fetchGeoJSONRoute(
        nodesLatLng[selectedNodeIndex - 1],
        newNode
      );

      handleFetchedRoutingData(routingData, selectedNodeIndex);
    }
    // next route recalculate
    if (nodesLatLng[selectedNodeIndex + 1]) {
      routingData = await fetchGeoJSONRoute(
        newNode,
        nodesLatLng[selectedNodeIndex + 1]
      );

      handleFetchedRoutingData(routingData, selectedNodeIndex, true);
    }
  };

  const selectNodeIcon = () => {
    switch (routeColor) {
      case 'blue':
        return nodeIcons.nodeBlueIcon;
      case 'red':
        return nodeIcons.nodeRedIcon;
      case 'purple':
        return nodeIcons.nodePurpleIcon;
      case 'green':
        return nodeIcons.nodeGreenIcon;
      case 'yellow':
        return nodeIcons.nodeYellowIcon;
      case 'orange':
        return nodeIcons.nodeOrangeIcon;
      default:
        return nodeIcons.nodeBlueIcon;
    }
  };

  const nodeIcon: Icon = selectNodeIcon();

  return (
    <>
      {nodes[0] &&
        nodesLatLng.map((node, index) => {
          return (
            <Marker
              // This key is enough as there can't be 2 node placed on each other
              key={`marker-${node.lat}-${node.lng}`}
              position={node}
              icon={nodeIcon}
              draggable={true}
              autoPan={true}
              eventHandlers={{
                dragstart: (e) => {
                  setSelectedNode(e.target.getLatLng());
                },
                dragend: (e) => {
                  dragNodeHandler(e.target.getLatLng());
                },
                click: (e) => {
                  setSelectedNode(e.latlng);
                },
              }}
            >
              <Popup
                className={styles.popup}
                offset={new Point(0, 0)}
                minWidth={30}
                maxWidth={250}
              >
                <div>
                  <p>{`Coordinates (${index + 1}):`}</p>
                  <p>{`${node.lat}, ${node.lng}`}</p>
                </div>
                <Button
                  onClick={(e) => {
                    deleteMarkerHandler();

                    map.closePopup();
                  }}
                >
                  <img src={deleteIcon} />
                </Button>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
};

export default NodeMarkers;
