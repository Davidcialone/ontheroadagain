export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = () => {
  localStorage.setItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};
