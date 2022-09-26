import { LatLng, LatLngBounds } from 'leaflet';
import { useEffect, useRef, useState } from 'react';

const useMapControl = (dependencies: any[]) => {
  const [isMenuShown, toggleMenu] = useState(true);

  const dataRef = useRef<any>(null);
  const [dataBounds, setDataBounds] = useState<LatLngBounds>(
    new LatLngBounds(new LatLng(-180, -90), new LatLng(180, 90))
  );

  useEffect(() => {
    dataRef.current && setDataBounds(dataRef.current.getBounds());
  }, [...dependencies, isMenuShown]);

  return {
    isMenuShown,
    toggleMenu,
    dataBounds,
    dataRef
  };
};

export default useMapControl;
