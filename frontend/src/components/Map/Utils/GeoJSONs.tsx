import { LeafletMouseEvent } from 'leaflet';
import { GeoJSON } from 'react-leaflet';

type geoJSONsProps = {
  geoJSONs: GeoJSON.FeatureCollection<any>[];
  setClickedRouteIndex: (value: number) => void;
};

const GeoJSONs = ({ geoJSONs, setClickedRouteIndex }: geoJSONsProps) => {
  const clickOnGeoJSONhandler = (event: LeafletMouseEvent) => {
    // Feature array has the same indexing as routes, as all element contains only one feature
    const featuresArray = geoJSONs.map((geoJSON) => geoJSON.features[0]);

    for (const key in event.target._layers) {
      const routeIndex = featuresArray.lastIndexOf(
        event.target._layers[key].feature
      );
      setClickedRouteIndex(routeIndex);
    }
  };

  return (
    <>
      {geoJSONs.map((geoJson, index) => {
        return (
          <GeoJSON
            key={`${Math.random().toString()}-${index}`}
            attribution="&copy; credits due..."
            style={{
              color: '#2222bb',
              weight: 3,
              fillColor: '#aaaa00',
              fillOpacity: 0,
              opacity: 0.75,
            }}
            data={geoJson}
            eventHandlers={{
              click: (e) => {
                console.log('GPX clicked');
                clickOnGeoJSONhandler(e);
              },
            }}
          />
        );
      })}
    </>
  );
};

export default GeoJSONs;
