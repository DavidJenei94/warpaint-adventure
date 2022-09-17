import { Dispatch, SetStateAction, useState } from 'react';
import { LatLng, Point } from 'leaflet';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import {
  createBasicGeoJsonFC,
  fetchGeoJSONRoute,
} from '../../Utils/geojson.utils';

import Button from '../../../UI/Button';

import styles from './NodeMarkers.module.scss';
import { nodeIcon } from '../../Utils/Icons';
import deleteIcon from '../../../../assets/icons/icons-trash-16.png';

type NodeMarkersProps = {
  nodes: LatLng[];
  setNodes: (value: LatLng[]) => void;
  routes: GeoJSON.FeatureCollection<any>[];
  setRoutes: Dispatch<SetStateAction<GeoJSON.FeatureCollection<any>[]>>;
  handleFetchedRoutingData: (
    data: any,
    nodeIndex?: number,
    startNode?: boolean
  ) => void;
};

const NodeMarkers = ({
  nodes,
  setNodes,
  routes,
  setRoutes,
  handleFetchedRoutingData,
}: NodeMarkersProps) => {
  const [selectedNode, setSelectedNode] = useState<LatLng | null>(null);

  const map = useMapEvents({
    click: (e) => {
      newNodeHandler(e.latlng);
    },
  });

  const newNodeHandler = async (position: LatLng) => {
    let routingData;
    // fetch route with first node (both from and to) to adjust to a route point
    if (nodes[0]) {
      routingData = await fetchGeoJSONRoute(nodes[nodes.length - 1], position);
    } else {
      routingData = await fetchGeoJSONRoute(position, position);
    }

    handleFetchedRoutingData(routingData);
  };

  const deleteMarkerHandler = () => {
    setRoutes((prevState) => {
      const prevStateCopy = [...prevState];
      const selectedNodeIndex = nodes.lastIndexOf(selectedNode!);

      console.log(selectedNodeIndex);

      //handle first node
      if (selectedNodeIndex === 0) {
        prevStateCopy.splice(selectedNodeIndex, 1);
        return prevStateCopy;
      }

      //handle last node
      if (selectedNodeIndex === nodes.length - 1) {
        prevStateCopy.splice(selectedNodeIndex - 1, 1);
        return prevStateCopy;
      }

      // handle middle nodes
      const mergedCoordinates = prevStateCopy[
        selectedNodeIndex - 1
      ].features[0].geometry.coordinates.concat(
        prevStateCopy[selectedNodeIndex].features[0].geometry.coordinates
      );

      const distanceSum =
        prevStateCopy[selectedNodeIndex - 1].features[0].properties!.distance +
        prevStateCopy[selectedNodeIndex].features[0].properties!.distance;

      const mergedRoutes = createBasicGeoJsonFC(
        { coordinates: mergedCoordinates, type: 'LineString' },
        distanceSum
      );
      prevStateCopy.splice(selectedNodeIndex - 1, 2, mergedRoutes);

      return prevStateCopy;
    });

    const newNodes = nodes.filter((node) => node !== selectedNode);
    setNodes(newNodes);
  };

  const dragNodeHandler = async (newNode: LatLng) => {
    let routingData;
    // only one node is there
    if (nodes.length === 1) {
      routingData = await fetchGeoJSONRoute(newNode, newNode);

      handleFetchedRoutingData(routingData, 0);

      return;
    }

    const selectedNodeIndex = nodes.lastIndexOf(selectedNode!);

    // previous route recalculate
    if (nodes[selectedNodeIndex - 1]) {
      routingData = await fetchGeoJSONRoute(
        nodes[selectedNodeIndex - 1],
        newNode
      );

      handleFetchedRoutingData(routingData, selectedNodeIndex);
    }
    // next route recalculate
    if (nodes[selectedNodeIndex + 1]) {
      routingData = await fetchGeoJSONRoute(
        newNode,
        nodes[selectedNodeIndex + 1]
      );

      handleFetchedRoutingData(routingData, selectedNodeIndex, true);
    }
  };

  return (
    <>
      {nodes[0] &&
        nodes.map((node) => (
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
            >
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
        ))}
    </>
  );
};

export default NodeMarkers;
