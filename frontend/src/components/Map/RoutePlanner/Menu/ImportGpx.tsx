import { useState } from 'react';
import { LatLng } from 'leaflet';
import useFetchDataEffect from '../../../../hooks/fetch-data-effect-hook';
import useHttp from '../../../../hooks/http-hook';
import useModal from '../../../../hooks/modal-hook';
import {
  createBasicGeoJsonFC,
  getDistanceOfRoute,
  sameCoordinates,
} from '../../Utils/geojson.utils';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux-hooks';
import { importGpx } from '../../../../lib/gpx-api';
import { toggleWarningFeedback } from '../../../../store/feedback-toggler-actions';
import { routeActions } from '../../../../store/route';

import Button from '../../../UI/Button';
import SingleInputConfirmation from '../../../UI/ConfirmationModals/SingleInputConfirmation';
import Modal from '../../../UI/Modal/Modal';

const ImportGpx = () => {
  const dispatch = useAppDispatch();

  const routeSections = useAppSelector((state) => state.route.routeSections);

  const [importedGpxText, setImportedGpxText] = useState('');

  const { isShown: importGpxModalIsShown, toggleModal: toggleImportGpxModal } =
    useModal();

  const {
    sendRequest: sendImportGpxRequest,
    status: importGpxStatus,
    error: importGpxError,
    data: importGpxData,
  } = useHttp(importGpx, false);

  const chooseGpxFileHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // check if correct input
    // https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers

    const input = event.target;
    if (!input) {
      toggleWarningFeedback(
        'The browser does not does not support file input.'
      );
      return;
    }
    if (!input.files) {
      toggleWarningFeedback(
        'The browser does not does not support this file input.'
      );
      return;
    }
    if (!input.files![0]) {
      toggleWarningFeedback('The file did not loaded properly.');
      return;
    }

    const file = input.files![0];
    const text = await file.text(); // Blob API
    setImportedGpxText(text);

    // Older version:
    // const fileReader = new FileReader();
    // fileReader.onload = (event) =>
    //   setImportedGpx(event.target!.result as string);
    // fileReader.readAsText(file);
  };

  const importGpxHandler = async () => {
    sendImportGpxRequest({ gpxString: importedGpxText });
  };

  useFetchDataEffect(() => {
    const coordinates = importGpxData.features[0].geometry.coordinates;
    const firstNode = [coordinates[0][1], coordinates[0][0]];
    const lastNode = [
      coordinates[coordinates.length - 1][1],
      coordinates[coordinates.length - 1][0],
    ];
    const firstNodeLatLng = new LatLng(firstNode[0], firstNode[1]);
    const lastNodeLatLng = new LatLng(lastNode[0], lastNode[1]);

    // If no route is on the map (or only one node)
    if (routeSections.length === 0) {
      dispatch(routeActions.setNodes([firstNode, lastNode]));
      dispatch(routeActions.setRouteSections([importGpxData]));
      return;
    }

    // Otherwise connect to current route sections on map
    const prevFirstCoordinates =
      routeSections[0].features[0].geometry.coordinates;
    const prevFirstNode = new LatLng(
      prevFirstCoordinates[0][1],
      prevFirstCoordinates[0][0]
    );
    const prevLastCoordinates =
      routeSections[routeSections.length - 1].features[0].geometry.coordinates;
    const prevLastNode = new LatLng(
      prevLastCoordinates[prevLastCoordinates.length - 1][1],
      prevLastCoordinates[prevLastCoordinates.length - 1][0]
    );

    // If newly added route's last node is the same as the first node of current route
    if (sameCoordinates(prevFirstNode, lastNodeLatLng)) {
      dispatch(
        routeActions.insertNode({
          index: 0,
          deleteCount: 0,
          insertElement: firstNode,
        })
      );
      dispatch(
        routeActions.insertRouteSection({
          index: 0,
          deleteCount: 0,
          insertElement: importGpxData,
        })
      );
      return;
    }
    // If newly added route's first node is the same as the last node of current route
    if (sameCoordinates(prevLastNode, firstNodeLatLng)) {
      dispatch(routeActions.addNode(lastNode));
      dispatch(routeActions.addRouteSection(importGpxData));
      return;
    }

    // check if it matches a current middle node, then throw warning message
    routeSections.map((routeSection, index) => {
      if (index === 0 || index === routeSections.length) {
        return;
      }
      const routeCoordinates = routeSection.features[0].geometry.coordinates;
      const routeFirstNode = new LatLng(
        routeCoordinates[0][1],
        routeCoordinates[0][0]
      );
      const routeLastNode = new LatLng(
        routeCoordinates[routeCoordinates.length - 1][1],
        routeCoordinates[routeCoordinates.length - 1][0]
      );
      if (
        sameCoordinates(firstNodeLatLng, routeFirstNode) ||
        sameCoordinates(firstNodeLatLng, routeLastNode) ||
        sameCoordinates(lastNodeLatLng, routeFirstNode) ||
        sameCoordinates(lastNodeLatLng, routeLastNode)
      ) {
        toggleWarningFeedback(
          'Route Section cannot be connected as it starts or ends at the middle of the current route!'
        );
        return;
      }
    });

    // otherwise draw a connecting route with 1 extra node at the middle
    const smallerLng =
      prevLastNode.lng < firstNodeLatLng.lng
        ? prevLastNode.lng
        : firstNodeLatLng.lng;
    const smallerLat =
      prevLastNode.lat < firstNodeLatLng.lat
        ? prevLastNode.lat
        : firstNodeLatLng.lat;
    const middleNodeCoordinate = [
      smallerLng + Math.abs(prevLastNode.lng - firstNodeLatLng.lng) / 2,
      smallerLat + Math.abs(prevLastNode.lat - firstNodeLatLng.lat) / 2,
    ];
    const middleNode = new LatLng(
      middleNodeCoordinate[1],
      middleNodeCoordinate[0]
    );
    const connectingCoordinates1 = [
      [prevLastNode.lng, prevLastNode.lat],
      middleNodeCoordinate,
    ];
    const connectingRoute1 = createBasicGeoJsonFC(
      { coordinates: connectingCoordinates1, type: 'LineString' },
      getDistanceOfRoute(connectingCoordinates1)
    );
    const connectingCoordinates2 = [
      middleNodeCoordinate,
      [firstNodeLatLng.lng, firstNodeLatLng.lat],
    ];
    const connectingRoute2 = createBasicGeoJsonFC(
      { coordinates: connectingCoordinates2, type: 'LineString' },
      getDistanceOfRoute(connectingCoordinates2)
    );

    dispatch(routeActions.addRouteSection(connectingRoute1));
    dispatch(routeActions.addRouteSection(connectingRoute2));
    dispatch(routeActions.addRouteSection(importGpxData));
    dispatch(routeActions.addNode([middleNode.lat, middleNode.lng]));
    dispatch(routeActions.addNode([firstNodeLatLng.lat, firstNodeLatLng.lng]));
    dispatch(routeActions.addNode([lastNodeLatLng.lat, lastNodeLatLng.lng]));
  }, [importGpxStatus, importGpxError, importGpxData]);

  return (
    <>
      {importGpxModalIsShown && (
        <Modal onClose={toggleImportGpxModal} onConfirm={importGpxHandler}>
          <SingleInputConfirmation type="file" onChange={chooseGpxFileHandler}>
            Select a GPX file to import
          </SingleInputConfirmation>
        </Modal>
      )}
      <Button onClick={toggleImportGpxModal}>Import GPX</Button>
    </>
  );
};

export default ImportGpx;
