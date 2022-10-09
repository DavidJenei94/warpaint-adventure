import { LatLngBounds } from 'leaflet';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import {
  LayersControl,
  MapContainer,
  ScaleControl,
  TileLayer,
} from 'react-leaflet';
import { ChildrenProps } from '../../../models/basic.props';

import FitBoundsControl from '../Controls/FitBoundsControl';
import ToggleMenuControl from '../Controls/ToggleMenuControl';

interface MapProps extends ChildrenProps {
  dataBounds: LatLngBounds;
  isMenuShown: boolean;
  toggleMenu: Dispatch<SetStateAction<boolean>>;
}

const Map = ({ children, dataBounds, isMenuShown, toggleMenu }: MapProps) => {
  const mapRef = useRef<any>(null);

  // invalidate to make bound data and draw whole map
  // (and load right side of the map after switching on/off menu)
  useEffect(() => {
    if (mapRef.current) mapRef.current.invalidateSize();
  }, [isMenuShown]);

  return (
    <div>
      <MapContainer
        center={[46.22406960789375, 20.672510248317746]}
        zoom={9}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <FitBoundsControl dataBounds={dataBounds} />
        <ToggleMenuControl isMenuShown={isMenuShown} toggleMenu={toggleMenu} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OSM Streets">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='Data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
              keepBuffer={50}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Open Topo Map">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              maxZoom={17}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OPNVKarte (transport)">
            <TileLayer
              url="https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"
              attribution='Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={18}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google">
            <TileLayer
              url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Satellite">
            <TileLayer
              url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Waymarked Trails">
            <TileLayer
              url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png"
              attribution='| Map style: &copy;
                <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (
                <a href="https://creativecommons.org/licenses/by-sa/3.0/">
                  CC-BY-SA
                </a>
                )'
              opacity={0.6}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="WpA Trails">
            <TileLayer url="http://localhost:8001/{z}/{x}/{y}" opacity={0.75} />
          </LayersControl.Overlay>
        </LayersControl>
        <ScaleControl position="bottomleft" />
        {children}
      </MapContainer>
    </div>
  );
};

export default Map;
