document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const clearButton = document.getElementById("clearForm");
  const alertBox = document.getElementById("formAlert");
  const birthDateInput = document.getElementById("birthDate");

  const fullNameInput = document.getElementById("fullName");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const shippingAddressInput = document.getElementById("shippingAddress");

  const requiredInputs = [fullNameInput, usernameInput, emailInput, passwordInput, confirmPasswordInput, birthDateInput];

  const today = new Date();
  const maxBirthDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  const minBirthDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

  birthDateInput.max = formatDate(maxBirthDate);
  birthDateInput.min = formatDate(minBirthDate);



  requiredInputs.forEach((input) => {
    input.addEventListener("input", () => {
      clearAlert();

      if (input.id === "fullName") validateFullName();
      if (input.id === "username") validateUsername();
      if (input.id === "email") validateEmail();
      if (input.id === "password") {
        validatePassword();
        if (confirmPasswordInput.value) {
          validateConfirmPassword();
        }
      }
      if (input.id === "confirmPassword") validateConfirmPassword();
      if (input.id === "birthDate") validateBirthDate();
    });
  });

  clearButton.addEventListener("click", () => {
    form.reset();
    clearAlert();
    requiredInputs.forEach((input) => resetFieldState(input));
    shippingAddressInput.value = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showAlert("danger", "Revisa los campos marcados antes de enviar el formulario.");
      return;
    }

    showAlert("success", "Registro enviado correctamente.");
    form.reset();
    requiredInputs.forEach((input) => resetFieldState(input));
    shippingAddressInput.value = "";
  });
});