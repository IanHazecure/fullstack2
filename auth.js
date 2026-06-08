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

function writeStorageList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createUserId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeValue(value) {
  return value.trim().toLowerCase();
}

function seedUsers() {
  const users = readStorageList(AUTH_STORAGE_KEYS.users);

  if (!users.some((user) => user.username === "admin")) {
    users.push({
      id: createUserId(),
      fullName: "Administrador del sistema",
      username: "admin",
      email: "admin@vinilos.test",
      password: "Admin123",
      role: "admin",
      birthDate: "1990-01-01",
      shippingAddress: "",
      recoveryCode: "VINILOS-ADMIN",
      createdAt: new Date().toISOString(),
    });
  }

  writeStorageList(AUTH_STORAGE_KEYS.users, users);
  return users;
}

function getUsers() {
  return seedUsers();
}

function saveUsers(users) {
  writeStorageList(AUTH_STORAGE_KEYS.users, users);
}

function findUserByIdentifier(identifier) {
  const normalized = normalizeValue(identifier);
  return getUsers().find(
    (user) => user.username === normalized || user.email.toLowerCase() === normalized,
  );
}

function registerUser(userData) {
  const users = getUsers();
  const username = normalizeValue(userData.username);
  const email = normalizeValue(userData.email);

  if (users.some((user) => user.username === username)) {
    return { ok: false, message: "Ese nombre de usuario ya está registrado." };
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { ok: false, message: "Ese correo electrónico ya está registrado." };
  }

  const newUser = {
    id: createUserId(),
    fullName: userData.fullName.trim(),
    username,
    email,
    password: userData.password,
    role: "user",
    birthDate: userData.birthDate,
    shippingAddress: userData.shippingAddress.trim(),
    recoveryCode: userData.recoveryCode || "",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

function authenticateUser(identifier, password) {
  const user = findUserByIdentifier(identifier);

  if (!user || user.password !== password) {
    return { ok: false, message: "Usuario o contraseña incorrectos." };
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(user));
  return { ok: true, user };
}

function getCurrentUser() {
  try {
    const value = localStorage.getItem(AUTH_STORAGE_KEYS.currentUser);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(user));
}

function updateUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === updatedUser.id);

  if (index === -1) {
    return false;
  }
  users[index] = updatedUser;
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === updatedUser.id) {
    setCurrentUser(updatedUser);
  }

  return true;
}

function logoutUser() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
}

function renderAuthNavigation(container) {
  if (!container) {
    return;
  }

  const currentUser = getCurrentUser();

  if (!currentUser) {
    container.innerHTML = `
      <a class="btn btn-outline-light" href="login.html">Iniciar sesión</a>
      <a class="btn btn-outline-light" href="register.html">Registro de usuarios</a>
    `;
    return;
  }

  container.innerHTML = `
    <a class="btn btn-outline-light" href="profile.html">Mi perfil</a>
    <button type="button" class="btn btn-outline-light js-logout-btn">Cerrar sesión</button>
  `;

  const logoutButton = container.querySelector(".js-logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      logoutUser();
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderAuthNavigation(document.getElementById("authNav"));
});

function recoverPassword(identifier, recoveryCode, newPassword) {
  const users = getUsers();
  const normalized = normalizeValue(identifier);
  const idx = users.findIndex(
    (u) => u.username === normalized || u.email.toLowerCase() === normalized,
  );

  if (idx === -1) {
    return { ok: false, message: "Usuario no encontrado." };
  }

  const user = users[idx];
  if (!user.recoveryCode || user.recoveryCode !== recoveryCode) {
    return { ok: false, message: "Código de recuperación incorrecto." };
  }

  user.password = newPassword;
  users[idx] = user;
  saveUsers(users);

  const current = getCurrentUser();
  if (current && current.id === user.id) setCurrentUser(user);

  return { ok: true };
}

