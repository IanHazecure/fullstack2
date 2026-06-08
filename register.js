document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const clearButton = document.getElementById("clearForm");
  const alertBox = document.getElementById("formAlert");
  const birthDateInput = document.getElementById("birthDate");
  const recoveryCodeInput = document.getElementById("recoveryCode");

  const fullNameInput = document.getElementById("fullName");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const shippingAddressInput = document.getElementById("shippingAddress");

  const requiredInputs = [
    fullNameInput,
    usernameInput,
    emailInput,
    recoveryCodeInput,
    passwordInput,
    confirmPasswordInput,
    birthDateInput,
  ];

  const today = new Date();
  const maxBirthDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  const minBirthDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

  birthDateInput.max = formatDate(maxBirthDate);
  birthDateInput.min = formatDate(minBirthDate);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function showAlert(type, message) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
  }

  function clearAlert() {
    alertBox.className = "alert d-none";
    alertBox.textContent = "";
  }

  function setFieldState(input, isValid, message) {
    input.classList.remove("is-valid", "is-invalid");

    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback && feedback.dataset.defaultMessage) {
      feedback.textContent = feedback.dataset.defaultMessage;
    }

    if (isValid) {
      input.classList.add("is-valid");
      return;
    }

    input.classList.add("is-invalid");

    if (feedback && message) {
      feedback.textContent = message;
    }
  }

  function resetFieldState(input) {
    input.classList.remove("is-valid", "is-invalid");
    const feedback = input.parentElement.querySelector(".invalid-feedback");

    if (feedback && feedback.dataset.defaultMessage) {
      feedback.textContent = feedback.dataset.defaultMessage;
    }
  }

  function calculateAge(dateValue) {
    const birthDate = new Date(dateValue);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  function passwordHasRules(password) {
    return password.length >= 6 && password.length <= 18 && /[A-Z]/.test(password) && /\d/.test(password);
  }

  function validateFullName() {
    if (!fullNameInput.value.trim()) {
      setFieldState(fullNameInput, false, "El nombre completo no puede estar vacío.");
      return false;
    }

    setFieldState(fullNameInput, true);
    return true;
  }

  function validateUsername() {
    if (!usernameInput.value.trim()) {
      setFieldState(usernameInput, false, "El nombre de usuario no puede estar vacío.");
      return false;
    }

    const normalizedUsername = usernameInput.value.trim().toLowerCase();
    if (getUsers().some((user) => user.username === normalizedUsername)) {
      setFieldState(usernameInput, false, "Ese nombre de usuario ya está registrado.");
      return false;
    }

    setFieldState(usernameInput, true);
    return true;
  }

  function validateEmail() {
    if (!emailInput.value.trim()) {
      setFieldState(emailInput, false, "El correo electrónico no puede estar vacío.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      setFieldState(emailInput, false, "El correo electrónico debe tener un formato válido.");
      return false;
    }

    const normalizedEmail = emailInput.value.trim().toLowerCase();
    if (getUsers().some((user) => user.email.toLowerCase() === normalizedEmail)) {
      setFieldState(emailInput, false, "Ese correo electrónico ya está registrado.");
      return false;
    }

    setFieldState(emailInput, true);
    return true;
  }

  function validateRecoveryCode() {
    if (!recoveryCodeInput.value.trim()) {
      setFieldState(recoveryCodeInput, false, "El código de recuperación es obligatorio.");
      return false;
    }

    setFieldState(recoveryCodeInput, true);
    return true;
  }

  function validatePassword() {
    const passwordValue = passwordInput.value;

    if (!passwordValue) {
      setFieldState(passwordInput, false, "La contraseña no puede estar vacía.");
      return false;
    }

    if (!passwordHasRules(passwordValue)) {
      setFieldState(passwordInput, false, "La contraseña debe tener entre 6 y 18 caracteres, una mayúscula y un número.");
      return false;
    }

    setFieldState(passwordInput, true);
    return true;
  }

  function validateConfirmPassword() {
    if (!confirmPasswordInput.value) {
      setFieldState(confirmPasswordInput, false, "Debes repetir la contraseña.");
      return false;
    }

    if (confirmPasswordInput.value !== passwordInput.value) {
      setFieldState(confirmPasswordInput, false, "Las dos contraseñas deben ser iguales.");
      return false;
    }

    setFieldState(confirmPasswordInput, true);
    return true;
  }

  function validateBirthDate() {
    if (!birthDateInput.value) {
      setFieldState(birthDateInput, false, "La fecha de nacimiento es obligatoria.");
      return false;
    }

    if (calculateAge(birthDateInput.value) < 13) {
      setFieldState(birthDateInput, false, "Debes tener al menos 13 años para registrarte.");
      return false;
    }

    setFieldState(birthDateInput, true);
    return true;
  }

  function validateForm() {
    clearAlert();

    const isFormValid = [
      validateFullName(),
      validateUsername(),
      validateEmail(),
      validateRecoveryCode(),
      validatePassword(),
      validateConfirmPassword(),
      validateBirthDate(),
    ].every(Boolean);

    return isFormValid;
  }

  requiredInputs.forEach((input) => {
    input.addEventListener("input", () => {
      clearAlert();

      if (input.id === "fullName") validateFullName();
      if (input.id === "username") validateUsername();
      if (input.id === "email") validateEmail();
      if (input.id === "recoveryCode") validateRecoveryCode();
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

    const registration = {
      fullName: fullNameInput.value.trim(),
      username: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      recoveryCode: recoveryCodeInput.value.trim(),
      birthDate: birthDateInput.value,
      shippingAddress: shippingAddressInput.value.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const result = registerUser({
        ...registration,
        password: passwordInput.value,
      });

      if (!result.ok) {
        showAlert("danger", result.message);
        return;
      }

      showAlert("success", "Cuenta creada correctamente. Ya puedes iniciar sesión.");
    } catch (e) {
      // storage failed, ignore but notify in console
      console.error("Failed to save registration:", e);
    }

    form.reset();
    requiredInputs.forEach((input) => resetFieldState(input));
    shippingAddressInput.value = "";
  });
});