document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const alertBox = document.getElementById("loginAlert");
  const identifierInput = document.getElementById("loginIdentifier");
  const passwordInput = document.getElementById("loginPassword");

  seedUsers();

  function showAlert(type, message) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
  }

  function clearAlert() {
    alertBox.className = "alert d-none";
    alertBox.textContent = "";
  }

  function validateField(input, message) {
    const isValid = Boolean(input.value.trim());
    input.classList.remove("is-valid", "is-invalid");
    input.classList.add(isValid ? "is-valid" : "is-invalid");
    if (!isValid && message) {
      input.parentElement.querySelector(".invalid-feedback").textContent = message;
    }
    return isValid;
  }

  identifierInput.addEventListener("input", () => {
    clearAlert();
    validateField(identifierInput, "Escribe tu usuario o correo.");
  });

  passwordInput.addEventListener("input", () => {
    clearAlert();
    validateField(passwordInput, "La contraseña es obligatoria.");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAlert();

    const isIdentifierValid = validateField(identifierInput, "Escribe tu usuario o correo.");
    const isPasswordValid = validateField(passwordInput, "La contraseña es obligatoria.");

    if (!isIdentifierValid || !isPasswordValid) {
      showAlert("danger", "Completa los campos antes de entrar.");
      return;
    }

    const result = authenticateUser(identifierInput.value, passwordInput.value);

    if (!result.ok) {
      showAlert("danger", result.message);
      passwordInput.classList.add("is-invalid");
      return;
    }

    showAlert("success", `Sesión iniciada como ${result.user.role === "admin" ? "administrador" : "usuario"}.`);
    form.reset();
    identifierInput.classList.remove("is-valid", "is-invalid");
    passwordInput.classList.remove("is-valid", "is-invalid");

    window.location.href = "index.html";
  });
});
