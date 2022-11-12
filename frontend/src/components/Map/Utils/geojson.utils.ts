import { LatLng } from 'leaflet';
import { round } from '../../../utils/general.utils';
import { toggleErrorFeedback } from '../../../store/feedback-toggler-actions';

interface GeometryType {
  coordinates: number[][];
  type: string;
}

export const createBasicGeoJsonFC = (
  geometry: GeometryType,
  distance?: number
): GeoJSON.FeatureCollection<any> => {
  const calculatedDistance: number = distance ? distance : 0;

  const newFeatureCollection: GeoJSON.FeatureCollection<any> = {
    type: 'FeatureCollection',
    features: [
      {
        geometry: geometry,
        type: 'Feature',
        properties: { distance: calculatedDistance },
      },
    ],
  };

  return newFeatureCollection;
};

export const getDistanceOfRoute = (coordinates: number[][]): number => {
  let previousCoordinate: number[];

  const totalDistance: number = coordinates.reduce(
    (previousValue, currentCoordinate, index) => {
      if (index === 0) return 0;

      previousCoordinate = coordinates[index - 1];

      return (
        previousValue +
        new LatLng(previousCoordinate[1], previousCoordinate[0]).distanceTo(
          new LatLng(currentCoordinate[1], currentCoordinate[0])
        )
      );
    },
    0
  );

  return round(totalDistance, 1);
};

export const sameCoordinates = (node1: LatLng, node2: LatLng): boolean => {
  return node1.lat === node2.lat && node1.lng === node2.lng;
};

export const fetchGeoJSONRoute = async (startPos: LatLng, endPos: LatLng) => {
  try {
    const response = await fetch(
      // `http://localhost:8080/ors/v2/directions/foot-hiking?start=${startPos.lng},${startPos.lat}&end=${endPos.lng},${endPos.lat}`
      `https://api.openrouteservice.org/v2/directions/foot-hiking?api_key=5b3ce3597851110001cf6248e84c7d602b6f468b9f55c273023bcc70&start=${startPos.lng},${startPos.lat}&end=${endPos.lng},${endPos.lat}`
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (err: any) {
    toggleErrorFeedback(err.message);
    return null;
  }
};
