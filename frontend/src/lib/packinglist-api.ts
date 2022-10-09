const BACKEND_DOMAIN = 'http://localhost:4000/api';

interface PackingListDefaultArgs {
  token: string;
}

export const getAllPackingList = async ({ token }: PackingListDefaultArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/packinglist/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch Packinglists!');
  }

  return data;
};

interface CreatePackingListArgs extends PackingListDefaultArgs {
  name: string;
}

export const createPackingList = async ({
  token,
  name,
}: CreatePackingListArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/packinglist/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not create Packinglist!');
  }

  return data;
};

interface PackingListBaseArgs {
  token: string;
  id: number;
}

interface UpdatePackingListNameArgs extends PackingListBaseArgs {
  name: string;
}

export const updatePackingListName = async ({
  token,
  id,
  name,
}: UpdatePackingListNameArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/packinglist/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not update Packinglist!');
  }

  return data;
};

export const deletePackingList = async ({ token, id }: PackingListBaseArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/packinglist/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not delete Packinglist!');
  }

  return data;
};
