const BACKEND_DOMAIN = 'http://localhost:4000/api';

interface PackingItemBaseArgs {
  token: string;
  listId: number;
}

export const getAllPackingItem = async ({
  token,
  listId,
}: PackingItemBaseArgs) => {
  const response = await fetch(
    `${BACKEND_DOMAIN}/packinglist/${listId}/packingitem/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch Packing items!');
  }

  return data;
};

interface CreatePackingItemArgs extends PackingItemBaseArgs {
  name: string;
}

export const createPackingItem = async ({
  token,
  listId,
  name,
}: CreatePackingItemArgs) => {
  const response = await fetch(
    `${BACKEND_DOMAIN}/packinglist/${listId}/packingitem/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({ name }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not create Packing items!');
  }

  return data;
};

interface UpdateAllPackingItemArgs extends PackingItemBaseArgs {
  status: number;
}

export const updateAllPackingItemStatus = async ({
  token,
  listId,
  status,
}: UpdateAllPackingItemArgs) => {
  const response = await fetch(
    `${BACKEND_DOMAIN}/packinglist/${listId}/packingitem/`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not update Packing Items!');
  }

  return data;
};

interface GetPackingItemArgs extends PackingItemBaseArgs {
  id: number;
}

export const getPackingItem = async ({
  token,
  listId,
  id,
}: GetPackingItemArgs) => {
  const response = await fetch(
    `${BACKEND_DOMAIN}/packinglist/${listId}/packingitem/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch Packing item!');
  }

  return data;
};

interface UpdatePackingItemArgs extends PackingItemBaseArgs {
  id: number;
  name: string;
  status: number;
}

export const updatePackingItem = async ({
  token,
  listId,
  id,
  name,
  status,
}: UpdatePackingItemArgs) => {
  const response = await fetch(
    `${BACKEND_DOMAIN}/packinglist/${listId}/packingitem/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({
        name,
        status,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not update Packing item!');
  }

  return data;
};

interface DeletePackingItemArgs extends PackingItemBaseArgs {
  id: number;
}

export const deletePackingItem = async ({
  token,
  listId,
  id,
}: DeletePackingItemArgs) => {
  const response = await fetch(
    `${BACKEND_DOMAIN}/packinglist/${listId}/packingitem/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not delete Packing item!');
  }

  return data;
};
