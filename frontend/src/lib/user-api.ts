const BACKEND_DOMAIN = 'http://localhost:4000/api';

type LoginArgs = {
  email: string;
  password: string;
};

type SignupArgs = LoginArgs & {
  name: string;
};

export const loginUser = async ({ email, password }: LoginArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not login User!');
  }

  return data;
};

export const signupUser = async ({ email, password, name }: SignupArgs) => {
  const response = await fetch(`${BACKEND_DOMAIN}/auth/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      name,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not sign up!');
  }

  return data;
};
