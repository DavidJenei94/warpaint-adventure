import { Dispatch, SetStateAction } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

type Props = {
  setPosition: Dispatch<SetStateAction<LatLng | null>>;
  // setNodes: Dispatch<SetStateAction<LatLng[]>>;
};

const CurrentPosition = ({ setPosition }: Props) => {
  useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
    },
  });

  return null;
};

export default CurrentPosition;
