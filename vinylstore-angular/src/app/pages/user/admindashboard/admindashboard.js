document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  if (currentUser.role !== "admin") {
    window.location.href = "index.html";
    return;
  }

  const alertBox = document.getElementById("adminAlert");
  const summary = document.getElementById("adminSummary");
  const usersTableBody = document.getElementById("usersTableBody");

  function showAlert(type, message) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
  }

  function clearAlert() {
    alertBox.className = "alert d-none";
    alertBox.textContent = "";
  }

  function renderUsers() {
    const users = getUsers();
    summary.textContent = `Usuarios registrados: ${users.length}`;
    usersTableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      const isCurrentAdmin = user.id === currentUser.id;
      const roleLabel = user.role === "admin" ? "Administrador" : "Usuario";

      row.innerHTML = `
        <td>${user.fullName}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${roleLabel}</td>
        <td>
          <button class="btn btn-sm btn-outline-light js-delete-user" data-user-id="${user.id}" ${isCurrentAdmin ? "disabled" : ""}>
            ${isCurrentAdmin ? "No puedes eliminarte" : "Eliminar"}
          </button>
        </td>
      `;

      usersTableBody.appendChild(row);
    });
  }

  usersTableBody.addEventListener("click", (event) => {
    const button = event.target.closest(".js-delete-user");
    if (!button || button.disabled) {
      return;
    }

    const userId = button.dataset.userId;
    const removed = deleteUserById(userId);

    if (!removed) {
      showAlert("danger", "No se pudo eliminar el usuario.");
      return;
    }

    clearAlert();
    showAlert("success", "Usuario eliminado correctamente.");
    renderUsers();
  });

  renderUsers();
});
