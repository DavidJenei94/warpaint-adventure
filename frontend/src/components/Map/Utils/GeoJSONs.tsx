import { GeoJSON } from 'react-leaflet';

type geoJSONsProps = {
  geoJSONs: GeoJSON.FeatureCollection<any>[];
};

const GeoJSONs = ({ geoJSONs }: geoJSONsProps) => {
  return (
    <>
      {geoJSONs.map((geoJson, index) => {
        return (
          <GeoJSON
            key={index}
            attribution="&copy; credits due..."
            style={{
              color: '#2222bb',
              weight: 3,
              fillColor: '#aaaa00',
              fillOpacity: 0,
              opacity: 0.75,
            }}
            data={geoJson}
            eventHandlers={{ click: (e) => console.log('GPX clicked') }}
          />
        );
      })}
    </>
  );
};

export default GeoJSONs;
