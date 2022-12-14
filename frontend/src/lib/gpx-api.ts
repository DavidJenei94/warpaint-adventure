const BACKEND_DOMAIN = 'http://localhost:4000/api';

interface ImportGPXArgs {
  gpxString: string;
}

interface ExportGPXArgs {
  geoJson: GeoJSON.FeatureCollection<any>;
}

export const importGpx = async ({ gpxString }: ImportGPXArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/gpx/import/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gpxString }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not import GPX file!');
  }

  return data;
};

export const exportGpx = async ({ geoJson }: ExportGPXArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/gpx/export/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ geoJson }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not export GPX file!');
  }

  return data;
};
