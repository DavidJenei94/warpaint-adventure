import { Route } from '../models/route.model';

const BACKEND_DOMAIN = 'http://localhost:4000/api';

interface getAllRoutesArgs {
  token: string;
}

export const getAllRoutes = async ({ token }: getAllRoutesArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/route/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch Routes!');
  }

  return data;
};

interface CreateRouteArgs {
  token: string;
  route: Route;
  mergedGeoJson: string;
}

export const createRoute = async ({
  token,
  route,
  mergedGeoJson,
}: CreateRouteArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/route/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      route: { ...route },
      geoJson: mergedGeoJson,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not create Route!');
  }

  return data;
};

interface RouteBaseArgs {
  token: string;
  id: number;
}

export const getRoute = async ({ token, id }: RouteBaseArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/route/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch Route!');
  }

  return data;
};

interface UpdateRouteArgs {
  token: string;
  id: number;
  route: Route;
  mergedGeoJson: string;
}

export const updateRoute = async ({
  token,
  id,
  route,
  mergedGeoJson,
}: UpdateRouteArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/route/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      route: { ...route },
      geoJson: mergedGeoJson,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not update Route!');
  }

  return data;
};

interface DeleteRouteArgs {
  token: string;
  id: number;
  path: string;
}

export const deleteRoute = async ({ token, id, path }: DeleteRouteArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/route/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      routePath: path,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not delete Route!');
  }

  return data;
};
