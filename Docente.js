// ===============================
// Verificación de sesión
// ===============================
const usuarioActual =
  JSON.parse(localStorage.getItem("usuarioActual")) ||
  JSON.parse(localStorage.getItem("usuario")) ||
  null;

if (!usuarioActual) {
  alert("⚠️ No hay sesión activa. Inicia sesión nuevamente.");
  window.location.href = "index.html";
}
console.log("Usuario actual:", usuarioActual);


// ===============================
// Datos del docente logueado
// ===============================
const API_URL = "http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com";

if (usuarioActual) {
  document.querySelector(".profile-name").textContent =
    `${usuarioActual.nombres} ${usuarioActual.apellidos}`;
  document.querySelector(".profile-code").textContent =
    `${usuarioActual.id_usuario} - Electrónica Analógica`;
}


// ===============================
// Cerrar sesión
// ===============================
document.querySelector(".btn-logout").addEventListener("click", () => {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Se cerrará tu sesión actual.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {

      // Limpia el localStorage
      localStorage.clear();

      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        showConfirmButton: false,
        timer: 1200
      });

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

    }
  });
});

// ===============================
// Variables
// ===============================
let asesorias = [];
let nextId = 1;

// ===============================
// Tabs
// ===============================
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.tab;

    document
      .querySelectorAll(".tab-button")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));
    document.getElementById(`${tabName}-tab`).classList.add("active");
  });
});

// ===============================
// Modal helpers
// ===============================
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
});

// ===============================
// Render asesorías
// ===============================
// Mantienes tu función original
function renderAsesorias() {
  const container = document.getElementById("asesorias-list");

  if (asesorias.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #666; padding: 2rem;">No hay asesorías programadas</p>';
    return;
  }

  container.innerHTML = asesorias
    .map(
      (asesoria) => `
      <div class="asesoria-card">
        <div class="asesoria-info">
          <h3 class="asesoria-title">${asesoria.titulo}</h3>
          <p class="asesoria-datetime">${formatDate(
            asesoria.fecha
          )} • ${asesoria.horario}</p>
          <div class="asesoria-details">
            <div class="asesoria-detail">
              👥 ${asesoria.cuposocupados || 0}/${asesoria.cupo} inscritos
            </div>
          </div>
        </div>
        <span class="badge badge-programada">Programada</span>
        <div class="asesoria-actions">
          <button class="btn-icon" onclick="verEstudiantes('${
            asesoria.id_crear_asesoria
          }')" title="Ver Inscritos">👁️</button>
          <button class="btn-icon" onclick="editarAsesoria('${
            asesoria.id_crear_asesoria
          }')" title="Editar">✏️</button>
          <button class="btn-icon btn-delete" onclick="eliminarAsesoria('${asesoria.id_crear_asesoria}')" title="Eliminar">🗑️</button>

        </div>
      </div>
    `
    )
    .join("");
}

// Nueva función que agrega lógica extra
function renderizarAsesorias() {
  // Primero llamas a la función original
  renderAsesorias();

  // Luego agregas cualquier funcionalidad extra
  console.log("Asesorías renderizadas:", asesorias.length);

  // Ejemplo: agregar un highlight a las asesorías con cupos disponibles
  asesorias.forEach((asesoria) => {
    if ((asesoria.cupo - (asesoria.cuposocupados || 0)) > 0) {
      const card = document.querySelector(
        `.asesoria-card:has(.asesoria-title:contains("${asesoria.titulo}"))`
      );
      if (card) card.classList.add("highlight");
    }
  });
}


// ===============================
// Formatear fecha
// ===============================
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// ===============================
// Cargar asesorías desde BD
// ===============================
async function cargarAsesorias() {
  try {
    const res = await fetch(`${API_URL}/asesorias`);
    asesorias = await res.json();
    renderAsesorias();
  } catch (err) {
    console.error("Error al cargar asesorías:", err);
  }
}

// ===============================
// Crear nueva asesoría
// ===============================
document
  .getElementById("btn-nueva-asesoria")
  .addEventListener("click", () => {
    document.getElementById("form-crear-asesoria").reset();
    openModal("modal-crear");
  });

document
  .getElementById("form-crear-asesoria")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validaciones personalizadas con SweetAlert
    const titulo = document.getElementById("crear-titulo").value.trim();
    const descripcion = document.getElementById("crear-descripcion").value.trim();
    const fecha = document.getElementById("crear-fecha").value;
    const horario = document.getElementById("crear-horario").value.trim();
    const cupos = document.getElementById("crear-cupos").value;

    if (!titulo || !descripcion || !fecha || !horario || !cupos) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos antes de continuar.",
      });
      return; // ❌ Detener envío
    }

    if (cupos <= 0) {
      Swal.fire({
        icon: "error",
        title: "Cupos inválidos",
        text: "El número de cupos debe ser mayor a 0.",
      });
      return;
    }

    // Crear asesoría si todo está bien
    const nuevaAsesoria = {
      id_crear_asesoria:
        usuarioActual.roles_id_rol === "2"
          ? `D${Date.now().toString().slice(-8)}`
          : `ASES${Date.now().toString().slice(-7)}`,
      usuarios_id_usuario: usuarioActual.id_usuario,
      titulo,
      descripcion,
      fecha,
      horario,
      cupo: parseInt(cupos),
    };

    try {
      const res = await fetch(`${API_URL}/asesorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaAsesoria),
      });

      if (!res.ok) throw new Error("Error al crear la asesoría");

      Swal.fire({
        icon: "success",
        title: "Asesoría creada",
        text: "La asesoría ha sido registrada correctamente.",
      });

      closeModal("modal-crear");
      cargarAsesorias();

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al crear la asesoría.",
      });
    }
  });

// ===============================
// Editar asesoría
// ===============================
function editarAsesoria(id) {
  const asesoria = asesorias.find((a) => a.id_crear_asesoria === id);
  if (!asesoria) return;

  document.getElementById("editar-id").value = asesoria.id_crear_asesoria;
  document.getElementById("editar-titulo").value = asesoria.titulo;
  document.getElementById("editar-descripcion").value = asesoria.descripcion;
  document.getElementById("editar-fecha").value = asesoria.fecha;
  document.getElementById("editar-horario").value = asesoria.horario;
  document.getElementById("editar-cupos").value = asesoria.cupo;

  openModal("modal-editar");
}

document
  .getElementById("form-editar-asesoria")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editar-id").value;

    // Validaciones antes de enviar
    const titulo = document.getElementById("editar-titulo").value.trim();
    const descripcion = document.getElementById("editar-descripcion").value.trim();
    const fecha = document.getElementById("editar-fecha").value;
    const horario = document.getElementById("editar-horario").value.trim();
    const cupos = parseInt(document.getElementById("editar-cupos").value);

    // 🚨 Validación SweetAlert
    if (!titulo || !descripcion || !fecha || !horario || !cupos) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debes completar todos los campos antes de guardar los cambios.",
      });
      return;
    }

    if (cupos <= 0) {
      Swal.fire({
        icon: "error",
        title: "Cupo inválido",
        text: "El número de cupos debe ser mayor a 0.",
      });
      return;
    }

    const asesoriaActualizada = {
      titulo,
      descripcion,
      fecha,
      horario,
      cupo: cupos,
    };

    try {
      const res = await fetch(`${API_URL}/asesorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asesoriaActualizada),
      });

      if (!res.ok) throw new Error("Error al editar la asesoría");

      await Swal.fire({
        icon: "success",
        title: "Asesoría actualizada",
        text: "Los cambios se guardaron correctamente.",
        confirmButtonText: "Aceptar",
      });

      closeModal("modal-editar");
      cargarAsesorias();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al editar la asesoría.",
      });
    }
  });


// ===============================
// Ver estudiantes inscritos
// ===============================
async function verEstudiantes(id_crear_asesoria) {
  try {
const res = await fetch(`${API_URL}/asesorias/${id_crear_asesoria}/inscritos`);
    const estudiantes = await res.json();

    const container = document.getElementById("estudiantes-list");

    if (!estudiantes.length) {
      container.innerHTML =
        '<p style="text-align: center; color: #666;">No hay estudiantes inscritos</p>';
    } else {
      // BUSCA ESTA SECCIÓN EN TU verEstudiantes():
container.innerHTML = estudiantes
  .map(
    (e) => `
  <div class="estudiante-item">
    <div class="estudiante-avatar">👩‍🎓</div>
    <div class="estudiante-info">
      <div class="estudiante-name">${e.nombres} ${e.apellidos}</div>
      <div class="estudiante-code">${e.id_usuario}</div>
    </div>
    <div class="estudiante-email">${e.correo}</div>
    <button class="btn-icon btn-danger" onclick="removerEstudiante('${e.id_usuario}', '${id_crear_asesoria}', '${e.nombres} ${e.apellidos}')" title="Remover">✕</button>
  </div>
`
  )
  .join("");
    }
// Guardar el ID de la asesoría en un atributo del modal
document.getElementById("modal-estudiantes").dataset.asesoriaId = id_crear_asesoria;
    openModal("modal-estudiantes");
  } catch (err) {
    console.error("Error al cargar estudiantes:", err);
  }
}

// ===============================
// Remover estudiante de asesoría
// ===============================
async function removerEstudiante(id_usuario, id_crear_asesoria, nombreEstudiante) {
  console.log("[v0] Removiendo:", { id_usuario, id_crear_asesoria, nombreEstudiante });
  
  const confirm = await Swal.fire({
    icon: "warning",
    title: "¿Remover estudiante?",
    text: `¿Deseas remover a ${nombreEstudiante} de esta asesoría?`,
    showCancelButton: true,
    confirmButtonText: "Sí, remover",
    cancelButtonText: "Cancelar"
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL}/inscripciones/${id_usuario}/${id_crear_asesoria}`, {
      method: "DELETE",
    });

    console.log("[v0] Response status:", res.status);

    if (!res.ok) throw new Error("Error al remover estudiante");

    Swal.fire({
      icon: "success",
      title: "Estudiante removido",
      text: "El estudiante fue removido de la asesoría.",
    });

    // Recargar lista sin cerrar modal
    verEstudiantes(id_crear_asesoria);
    cargarAsesorias();
  } catch (error) {
    console.error("[v0] Error:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo remover al estudiante."
    });
  }
}

// ===============================
// Eliminar asesoría
// ===============================
async function eliminarAsesoria(id) {
  // Confirmar con SweetAlert
  const confirm = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar asesoría?",
    text: "Esta acción no se puede deshacer.",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL}/asesorias/${id}`, {
      method: "DELETE",
    });

    // ❌ Si la asesoría tiene alumnos inscritos (error 500)
    if (res.status === 500) {
      return Swal.fire({
        icon: "error",
        title: "No se puede eliminar",
        text: "Esta asesoría tiene estudiantes inscritos. Solo puedes editarla.",
      });
    }

    // ❌ Otros errores
    if (!res.ok) {
      throw new Error("Error al eliminar");
    }

    // ✅ Eliminado correctamente
    await Swal.fire({
      icon: "success",
      title: "Asesoría eliminada",
      text: "La asesoría fue eliminada correctamente."
    });

    cargarAsesorias();
  } catch (error) {
    console.error("Error eliminando:", error);

    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "No se pudo eliminar la asesoría. Inténtalo más tarde."
    });
  }
}


// ===============================
// Cargar y filtrar materiales
// ===============================
let todosLosMateriales = [];

async function cargarMateriales() {
  try {
    const res = await fetch(`${API_URL}/materiales`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    todosLosMateriales = await res.json();

    console.log("📦 Materiales cargados:", todosLosMateriales);
    mostrarMateriales(todosLosMateriales);
    llenarCategorias(todosLosMateriales);
  } catch (error) {
    console.error("Error al cargar materiales:", error);
  }
}

// ===============================
// Mostrar materiales en tarjetas
// ===============================
function mostrarMateriales(lista) {
  const contenedor = document.querySelector(".materials-grid");
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = `<p style="text-align:center; color:#666;">No se encontraron materiales</p>`;
    return;
  }

  lista.forEach((m) => {
    const disponibles = Number(m.cantidad_disponible) || 0;
    const danados = Number(m.cantidad_daniados) || 0;
    const total = disponibles + danados;
    const porcentaje = total > 0 ? Math.round((disponibles / total) * 100) : 0;

    let badgeClass = "badge-disponible";
    let badgeText = "Disponible";
    if (disponibles === 0) {
      badgeClass = "badge-agotado";
      badgeText = "Agotado";
    } else if (danados > 0 && disponibles > 0) {
      badgeClass = "badge-danado";
      badgeText = "Con Dañados";
    }

    const card = document.createElement("div");
    card.className = "material-card";
    card.innerHTML = `
      <div class="material-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
      </div>
      <div class="material-info">
        <h3 class="material-name">${m.nombre || "—"}</h3>
        <p class="material-category">${m.categoria || "Sin categoría"}</p>
      </div>
      <div class="material-status">
        <div class="material-availability">
          <span class="availability-text">${disponibles}/${total} disponibles</span>
          <div class="progress-bar"><div class="progress-fill" style="width:${porcentaje}%"></div></div>
        </div>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// ===============================
// Llenar select de categorías
// ===============================
function llenarCategorias() {
  const select = document.getElementById("filtroCategoria");
  if (!select) return;

  // Obtener categorías desde el backend
  fetch("http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/categorias")
    .then(res => res.json())
    .then(categorias => {

      select.innerHTML = `
        <option value="">Todas las categorías</option>
        ${categorias.map(cat => `
          <option value="${cat.descripcion}">
            ${cat.descripcion}
          </option>
        `).join("")}
      `;

    })
    .catch(error => {
      console.error("Error cargando categorías:", error);
    });
}


// ===============================
// Filtrar materiales (nombre o categoría)
// ===============================
function aplicarFiltros() {
  const texto = document.getElementById("buscarMaterial").value.toLowerCase().trim();
  const categoriaSel = document.getElementById("filtroCategoria").value.toLowerCase().trim();

  const filtrados = todosLosMateriales.filter((m) => {
    const nombre = (m.nombre || "").toLowerCase();
    const categoria = (m.categoria || "Sin categoría").toLowerCase();

    // Coincide si:
    // - el texto está en el nombre o la categoría
    // - y además coincide con la categoría seleccionada (si hay una)
    const coincideTexto = nombre.includes(texto) || categoria.includes(texto);
    const coincideCategoria = !categoriaSel || categoria === categoriaSel;
    return coincideTexto && coincideCategoria;
  });

  mostrarMateriales(filtrados);
}

// ===============================
// Inicialización de filtros
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const inputBuscar = document.getElementById("buscarMaterial");
  const selectCategoria = document.getElementById("filtroCategoria");

  inputBuscar.addEventListener("input", aplicarFiltros);
  selectCategoria.addEventListener("change", aplicarFiltros);
});


// ===============================
// Inicialización
// ===============================
cargarAsesorias();
cargarMateriales();


