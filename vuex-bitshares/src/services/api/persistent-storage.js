import Cookies from 'js-cookie';

// Persistent Storage for data cache management
const PersistentStorage = {
  set(key, data) {
    Cookies.set(key, data, { expires: 365 });
  },
  get(key) {
    return Cookies.get(key);
  },
  getJSON(key) {
    return Cookies.getJSON(key);
  },
  remove(key) {
    return Cookies.remove(key);
  },

  saveNodesData: ({ data }) => {
    localStorage.setItem('BITSHARES_NODES', JSON.stringify(data));
  },
  getSavedNodesData: () => {
    const cachedData = JSON.parse(localStorage.getItem('BITSHARES_NODES'));
    if (typeof (cachedData) === 'object' && cachedData !== null) {
      return cachedData;
    }
    return null;
  },
};

export default PersistentStorage;
