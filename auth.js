const AUTH_STORAGE_KEYS = {
  users: "vinilos.users",
  currentUser: "vinilos.currentUser",
};

function readStorageList(key) {
  try {
    const value = localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


