import { LatLngBounds } from 'leaflet';
import { useMap } from 'react-leaflet';
import ControlButton from './ControlButton';

import boundDataIcon from '../../../assets/map-assets/databound-button-icon.png';

type FitBoundsControlProps = {
  dataBounds: LatLngBounds;
};

const FitBoundsControl = ({ dataBounds }: FitBoundsControlProps) => {
  const map = useMap();

  const fitDataToBounds = () => {
    if (dataBounds.isValid()) map.fitBounds(dataBounds);
  };

  return (
    <ControlButton position="topleft" title="Fit bounds to data">
      <img src={boundDataIcon} onClick={fitDataToBounds} />
    </ControlButton>
  );
};

export default FitBoundsControl;
