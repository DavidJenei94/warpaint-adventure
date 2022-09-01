export const validateEmail = (email: string | number) => {
  return String(email)
    .toLowerCase()
    .match(
      // /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    )
    ? true
    : false;
};

export const validatePassword = (password: string) => {
  const regex = new RegExp('^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$');
  return regex.test(password);
};

export const validateName = (name: string) => {
  const regex = new RegExp(
    "^[w'-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[]]{2,}$"
  );
  return regex.test(name);
};

export const isUppercase = (word: string) => {
  return /^\p{Lu}/u.test(word);
};
