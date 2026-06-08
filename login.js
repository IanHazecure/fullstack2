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

});
