import { LatLng } from 'leaflet';
import { errorHandlingFetch } from '../../../utils/errorHanling';
import { round } from '../../../utils/general.utils';

type GeometryType = {
  coordinates: number[][];
  type: string;
};

export const createBasicGeoJsonFC = (
  geometry: GeometryType,
  distance?: number
) => {
  const calculatedDistance = distance ? distance : 0;

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

export const getDistanceOfRoute = (coordinates: number[][]) => {
  let previousCoordinate: number[];

  const totalDistance = coordinates.reduce(
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


export const fetchGeoJSONRoute = async (startPos: LatLng, endPos: LatLng) => {
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
