import L from 'leaflet';
import nodeIconUrl from '../../../assets/map-assets/node-icon.png';
// import iconShadow from '../images/marker-shadow.png';

export const nodeIcon = new L.Icon({
  iconUrl: nodeIconUrl,
  // iconShadow,
  iconAnchor: [6, 6],
  iconSize: [12, 12],
});
