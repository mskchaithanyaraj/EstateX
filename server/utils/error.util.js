export const createError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
