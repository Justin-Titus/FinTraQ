// In-memory token store to avoid XSS risks from localStorage
let accessTokenMemory = null;

export const getAccessToken = () => accessTokenMemory;
export const setAccessToken = (token) => { accessTokenMemory = token; };
export const clearAccessToken = () => { accessTokenMemory = null; };
