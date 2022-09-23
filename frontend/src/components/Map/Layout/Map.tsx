import { MapContainer, TileLayer } from 'react-leaflet';
import { ChildrenProps } from '../../../models/basic.props';

const Map = ({ children }: ChildrenProps) => {
  return (
    <div>
      <MapContainer
        center={[46.22406960789375, 20.672510248317746]}
        zoom={9}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default Map;
