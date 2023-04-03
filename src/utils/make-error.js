export const makeError = (name, message, details) => {
  const err = new Error(message);
  err.name = name;
  err.details = details;
  return err;
};
