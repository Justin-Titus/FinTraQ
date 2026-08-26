// In-memory token store to avoid XSS risks from localStorage
let accessTokenMemory = null;
let onClearListeners = [];

export const getAccessToken = () => accessTokenMemory;
export const setAccessToken = (token) => { accessTokenMemory = token; };
export const clearAccessToken = () => { 
  accessTokenMemory = null; 
  onClearListeners.forEach(cb => cb());
};
export const onTokenClear = (cb) => {
  onClearListeners.push(cb);
  return () => {
    onClearListeners = onClearListeners.filter(l => l !== cb);
  };
};
