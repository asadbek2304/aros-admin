export const setStorage = (name, value) => {
  if (typeof window !== undefined) {
    localStorage.setItem(name, value);
  }
  return;
};

export const getStorage = (name) => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(name);
    return item;
  }
  return undefined;
};

export const removeStorage = (name) => {
  if (typeof window !== undefined) {
    localStorage.removeItem(name);
  }
  return;
};
