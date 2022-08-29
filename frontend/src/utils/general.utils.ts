export const validateEmail = (email: string | number) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    ? true
    : false;
};

export const validatePassword = (password: string) => {
  return password.trim().length >= 8;
};

export const validateName = (password: string) => {
  return password.trim() !== '';
};

export const isUppercase = (word: string) => {
  return /^\p{Lu}/u.test(word);
};
