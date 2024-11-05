import Cookies from "js-cookie";

export const getToken = () => {
  return Cookies.get("token");
};

export const setToken = () => {
  Cookies.set("token");
};

export const removeToken = () => {
  Cookies.remove("token");
};

export const getUserIdFromToken = () => {
  const token = Cookies.get("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};
