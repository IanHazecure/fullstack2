document.addEventListener("DOMContentLoaded", () => {
  const alertBox = document.getElementById("profileAlert");
  const form = document.getElementById("profileForm");
  const fullName = document.getElementById("profileFullName");
  const username = document.getElementById("profileUsername");
  const email = document.getElementById("profileEmail");
  const shipping = document.getElementById("profileShipping");
  const newPassword = document.getElementById("profileNewPassword");

  function showAlert(type, message) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
  }

  function clearAlert() {
    alertBox.className = "alert d-none";
    alertBox.textContent = "";
  }

  function requireLogin() {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return null;
    }
    return user;
  }

  const user = requireLogin();
  if (!user) return;

  fullName.value = user.fullName || "";
  username.value = user.username || "";
  email.value = user.email || "";
  shipping.value = user.shippingAddress || "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAlert();

    if (!fullName.value.trim()) {
      showAlert("danger", "El nombre no puede quedar vacío.");
      return;
    }

    const updated = { ...user };
    updated.fullName = fullName.value.trim();
    updated.shippingAddress = shipping.value.trim();

    if (newPassword.value) {
      if (newPassword.value.length < 6) {
        showAlert("danger", "La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }
      updated.password = newPassword.value;
    }

    const ok = updateUser(updated);
    if (!ok) {
      showAlert("danger", "No se pudo actualizar el perfil.");
      return;
    }

    showAlert("success", "Perfil actualizado.");
    newPassword.value = "";
  });
});
