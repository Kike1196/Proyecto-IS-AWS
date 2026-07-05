// 1️⃣ Limpiar campos de login al cargar la página
window.addEventListener("load", () => {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
});

// Evitar cache al volver con <- o ->
window.addEventListener("pageshow", function (event) {
  if (event.persisted || (window.performance && window.performance.getEntriesByType("navigation")[0].type === "back_forward")) {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    localStorage.removeItem("usuario");
    sessionStorage.clear();
  }
});

// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const eyeIcon = document.getElementById("eyeIcon");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  eyeIcon.style.opacity = type === "text" ? "0.5" : "1";
});

// Handle login form submission
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = document.getElementById("email").value.trim();
  const contrasena = document.getElementById("password").value.trim();

  // 🚨 Alerta con SweetAlert2 si hay campos vacíos
  if (!correo || !contrasena) {
    Swal.fire({
      icon: "warning",
      title: "Campos vacíos",
      text: "Por favor, completa todos los campos.",
      confirmButtonColor: "#d33"
    });
    return;
  }

  try {
    const response = await fetch("http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar datos del usuario
      localStorage.setItem("usuario", JSON.stringify(data.user));

      
      Swal.fire({
        icon: "success",
        title: `¡Bienvenido ${data.user.nombres}!`,
        text: "Inicio de sesión exitoso.",
        confirmButtonColor: "#3085d6"
      }).then(() => {
        // Redirigir según el rol
        if (data.user.roles_id_rol === "1") {
  localStorage.setItem("adminLogueado", "true");  // 🔥 IMPORTANTE
  window.location.href = "usuarios.html";
} else if (data.user.roles_id_rol === "2") {
  window.location.href = "Docente.html";
} else {
  window.location.href = "alumno.html";
}

      });
    } else {
      // ❌ SweetAlert de error de credenciales
      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Usuario o contraseña no válidos. Intenta de nuevo.",
        confirmButtonColor: "#d33"
      });
    }

  } catch (error) {
    console.error("Error al conectar:", error);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor.",
      confirmButtonColor: "#d33"
    });
  }
});

// Handle register button
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", () => {
  Swal.fire({
    title: "¿Deseas crear una cuenta nueva?",
    text: "Serás redirigido a la página de registro.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33"
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "registro.html";
    }
  });
});

// Input validation feedback
const inputs = document.querySelectorAll(".form-input");
inputs.forEach((input) => {
  input.addEventListener("blur", function () {
    this.style.borderColor = this.value.trim() === "" ? "#EF4444" : "#10B981";
  });
  input.addEventListener("focus", function () {
    this.style.borderColor = "var(--color-burgundy)";
  });
});


