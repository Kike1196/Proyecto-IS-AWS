
// Obtener los elementos del formulario
const registerForm = document.getElementById("registerForm");
const passwordRegistroInput = document.getElementById("passwordRegistro");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Manejo de toggle de contraseña
const togglePasswordRegistro = document.getElementById("togglePasswordRegistro");
togglePasswordRegistro.addEventListener("click", () => {
  const type = passwordRegistroInput.type === "password" ? "text" : "password";
  passwordRegistroInput.type = type;
});

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
toggleConfirmPassword.addEventListener("click", () => {
  const type = confirmPasswordInput.type === "password" ? "text" : "password";
  confirmPasswordInput.type = type;
});

// Validar que coincidan las contraseñas
confirmPasswordInput.addEventListener("input", () => {
  const password = passwordRegistroInput.value;
  const confirm = confirmPasswordInput.value;
  const hint = document.getElementById("passwordMatch");
  if (confirm === "") {
    hint.textContent = "";
  } else if (password === confirm) {
    hint.textContent = "Las contraseñas coinciden";
    confirmPasswordInput.style.borderColor = "#10B981";
  } else {
    hint.textContent = "Las contraseñas no coinciden";
    confirmPasswordInput.style.borderColor = "#EF4444";
  }
});

// Validación de número de control
const numeroControlInput = document.getElementById("numeroControl");
numeroControlInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Manejar envío del formulario
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id_usuario = document.getElementById("numeroControl");
  const nombres = document.getElementById("nombres");
  const apellidos = document.getElementById("apellidos");
  const correo = document.getElementById("emailRegistro");
  const contrasena = passwordRegistroInput;
  const confirmPassword = confirmPasswordInput;
  const carrera = document.getElementById("carrera");
  const semestre = document.getElementById("semestre");

  // Función para marcar campos en error o éxito
  const marcarError = (input, mensaje) => {
    input.style.borderColor = "#EF4444"; // rojo
    Swal.fire("⚠️ " + mensaje);
  };

  const marcarCorrecto = (input) => {
    input.style.borderColor = "#10B981"; // verde
  };

  // ✅ Validar campos vacíos
  if (!id_usuario.value.trim() || !nombres.value.trim() || !apellidos.value.trim() || 
      !correo.value.trim() || !carrera.value || !semestre.value || 
      !contrasena.value.trim() || !confirmPassword.value.trim()) {
    Swal.fire("⚠️ Todos los campos son obligatorios");
    return;
  }

  // ✅ Validar correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo.value)) {
    marcarError(correo, "Ingresa un correo electrónico válido");
    return;
  } else {
    marcarCorrecto(correo);
  }

  // ✅ Validar longitud de contraseña
  if (contrasena.value.length < 8) {
    marcarError(contrasena, "La contraseña debe tener al menos 8 caracteres");
    return;
  } else {
    marcarCorrecto(contrasena);
  }

  // ✅ Validar confirmación de contraseña
  if (contrasena.value !== confirmPassword.value) {
    marcarError(confirmPassword, "Las contraseñas no coinciden");
    return;
  } else {
    marcarCorrecto(confirmPassword);
  }

  // ✅ Validar número de control (solo números)
  const numeroRegex = /^[0-9]+$/;
  if (!numeroRegex.test(id_usuario.value)) {
    marcarError(id_usuario, "El número de control solo puede contener dígitos");
    return;
  } else {
    marcarCorrecto(id_usuario);
  }

  // ✅ Validar selects
  if (!carrera.value) {
    marcarError(carrera, "Selecciona una carrera");
    return;
  } else {
    marcarCorrecto(carrera);
  }

  if (!semestre.value) {
    marcarError(semestre, "Selecciona un semestre");
    return;
  } else {
    marcarCorrecto(semestre);
  }

  // ✅ Si pasa todas las validaciones
  const formData = {
    id_usuario: id_usuario.value.trim(),
    nombres: nombres.value.trim(),
    apellidos: apellidos.value.trim(),
    carreras_id_carreras: carrera.value,
    correo: correo.value.trim(),
    semestre: semestre.value,
    contrasena: contrasena.value,
  };

  try {
    const response = await fetch("http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        title: "✅ Registro exitoso",
        text: data.message,
        icon: "success",
        confirmButtonColor: "#10B981",
      }).then(() => {
        window.location.href = "index.html";
      });
    } else {
      Swal.fire("⚠️ " + (data.error || "Error al registrar"));
    }
  } catch (error) {
    console.error(error);
    Swal.fire("❌ Error al conectar con el servidor");
  }

});

// 🔙 Botón "Volver al inicio"
const backToLoginBtn = document.getElementById("backToLoginBtn");

backToLoginBtn.addEventListener("click", () => {
  Swal.fire({
    title: "¿Deseas volver al inicio?",
    text: "Se perderá la información ingresada.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, volver",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#10B981",
    cancelButtonColor: "#EF4444",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "index.html";
    }
  });
});




