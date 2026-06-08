document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recoveryForm");
  const alertBox = document.getElementById("recoveryAlert");
  const identifier = document.getElementById("recIdentifier");
  const code = document.getElementById("recCode");
  const newPassword = document.getElementById("recNewPassword");
  const sendCodeBtn = document.getElementById("sendCodeBtn");

  function showAlert(type, message) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showAlert("", "");

    if (!identifier.value.trim() || !code.value.trim() || !newPassword.value) {
      showAlert("danger", "Completa todos los campos.");
      return;
    }

    if (newPassword.value.length < 6) {
      showAlert("danger", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const result = recoverPassword(identifier.value, code.value.trim(), newPassword.value);
    if (!result.ok) {
      showAlert("danger", result.message);
      return;
    }

    showAlert("success", "Contraseña restablecida. Puedes iniciar sesión con la nueva contraseña.");
    setTimeout(() => (window.location.href = "login.html"), 1200);
  });

  sendCodeBtn.addEventListener("click", () => {
    showAlert("", "");
    const id = identifier.value.trim();
    if (!id) {
      showAlert("danger", "Escribe tu usuario o correo para obtener el código.");
      return;
    }

    const user = findUserByIdentifier(id);
    if (!user) {
      showAlert("danger", "Usuario no encontrado.");
      return;
    }

    // show the stored recovery code (simulating delivery)
    showAlert("info", `Código de recuperación: ${user.recoveryCode}`);
  });
});
