import L from 'leaflet';
import nodeBlueIconUrl from '../../../assets/map-assets/node-blue.png';
import nodeRedIconUrl from '../../../assets/map-assets/node-red.png';
import nodePurpleIconUrl from '../../../assets/map-assets/node-purple.png';
import nodeGreenIconUrl from '../../../assets/map-assets/node-green.png';
import nodeYellowIconUrl from '../../../assets/map-assets/node-yellow.png';
import nodeOrangeIconUrl from '../../../assets/map-assets/node-orange.png';

const commonNodeIconProperties = {
  iconAnchor: new L.Point(6, 6),
  iconSize: new L.Point(12, 12),
};

export const nodeBlueIcon = new L.Icon({
  iconUrl: nodeBlueIconUrl,
  iconAnchor: commonNodeIconProperties.iconAnchor,
  iconSize: commonNodeIconProperties.iconSize,
});

export const nodeRedIcon = new L.Icon({
  iconUrl: nodeRedIconUrl,
  iconAnchor: commonNodeIconProperties.iconAnchor,
  iconSize: commonNodeIconProperties.iconSize,
});

export const nodePurpleIcon = new L.Icon({
  iconUrl: nodePurpleIconUrl,
  iconAnchor: commonNodeIconProperties.iconAnchor,
  iconSize: commonNodeIconProperties.iconSize,
});

export const nodeGreenIcon = new L.Icon({
  iconUrl: nodeGreenIconUrl,
  iconAnchor: commonNodeIconProperties.iconAnchor,
  iconSize: commonNodeIconProperties.iconSize,
});

export const nodeYellowIcon = new L.Icon({
  iconUrl: nodeYellowIconUrl,
  iconAnchor: commonNodeIconProperties.iconAnchor,
  iconSize: commonNodeIconProperties.iconSize,
});

export const nodeOrangeIcon = new L.Icon({
  iconUrl: nodeOrangeIconUrl,
  iconAnchor: commonNodeIconProperties.iconAnchor,
  iconSize: commonNodeIconProperties.iconSize,
});

export default {
  nodeBlueIcon,
  nodeRedIcon,
  nodePurpleIcon,
  nodeGreenIcon,
  nodeYellowIcon,
  nodeOrangeIcon,
};
