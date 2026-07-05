document.addEventListener("DOMContentLoaded", () => {
  // === Verificar sesión y rol ===
  const usuario = JSON.parse(localStorage.getItem("usuario"))

  if (!usuario) {
    window.location.replace("index.html")
    return
  }

  if (usuario.roles_id_rol !== "1") {
    window.location.replace("alumno.html")
    return
  }

  const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`
  document.querySelector(".admin-details h3").textContent = nombreCompleto
  document.querySelector(".admin-details p").textContent = `${usuario.id_usuario} - Administrador del Sistema`

  cargarUsuarios()
})

function cerrarSesion() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    localStorage.removeItem("usuario")
    localStorage.clear()
    window.location.href = "index.html"
  }
}

let users = []
let currentUserId = null
let filteredUsers = []

async function cargarUsuarios() {
  try {
    const response = await fetch("http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/usuarios")
    if (!response.ok) throw new Error("Error al cargar usuarios")

    users = await response.json()

    users = users.map((user) => ({
      id: user.id_usuario,
      nombre: user.nombre,
      tipo: mapRolToTipo(user.tipo),
      email: user.email,
      numero: user.numerocontrol,
      roles_id_rol: user.roles_id_rol,
    }))

    filteredUsers = [...users]
    renderUsers()
  } catch (error) {
    console.error("Error al cargar usuarios:", error)
    Swal.fire("Error al cargar los usuarios de la base de datos")
  }
}

function mapRolToTipo(descripcion) {
  const roleMap = {
    Administrador: "administrador",
    Docente: "docente",
    Estudiante: "estudiante",
    Alumno: "estudiante",
  }
  return roleMap[descripcion] || descripcion.toLowerCase()
}

function mapTipoToRolId(tipo) {
  const roleMap = {
    administrador: "1",
    docente: "2",
    estudiante: "3",
  }
  return roleMap[tipo] || "3"
}

function renderUsers() {
  const tbody = document.getElementById("usersTableBody")

  if (filteredUsers.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                    No se encontraron usuarios que coincidan con la búsqueda
                </td>
            </tr>
        `
    return
  }

  tbody.innerHTML = filteredUsers
    .map(
      (user) => `
        <tr>
            <td>${user.nombre}</td>
            <td><span class="user-badge badge-${user.tipo}">${user.tipo}</span></td>
            <td>${user.email}</td>
            <td>${user.numero}</td>
            <td>
  <div class="actions-cell">
    <button class="action-btn btn-modificar" onclick="abrirModalEditar('${user.id}')">Modificar</button>
    <button class="action-btn btn-asignar" onclick="abrirModalRol('${user.id}')">Asignar Rol</button>
    <button class="action-btn btn-desactivar" onclick="eliminarUsuario('${user.id}')">Eliminar</button>
  </div>
</td>
        </tr>
    `,
    )
    .join("")
}

function abrirModalEditar(userId) {
  currentUserId = userId
  const user = users.find((u) => u.id === userId)

  document.getElementById("editModalSubtitle").textContent = `Edita la información del usuario ${user.nombre}`
  document.getElementById("editNombre").value = user.nombre
  document.getElementById("editEmail").value = user.email
  document.getElementById("editNumero").value = user.numero

  document.getElementById("editModalOverlay").classList.add("active")
  document.body.style.overflow = "hidden"
}

function abrirModalRol(userId) {
  currentUserId = userId
  const user = users.find((u) => u.id === userId)

  document.getElementById("roleModalSubtitle").textContent = `Cambia el rol del usuario ${user.nombre}`
  document.getElementById("selectRol").value = user.roles_id_rol || mapTipoToRolId(user.tipo)
  document.getElementById("rolActual").textContent = user.tipo
  document.getElementById("rolNuevo").textContent = user.tipo

  document.getElementById("roleModalOverlay").classList.add("active")
  document.body.style.overflow = "hidden"
}

function cerrarModal(type) {
  const modalId = type === "edit" ? "editModalOverlay" : "roleModalOverlay"
  document.getElementById(modalId).classList.remove("active")
  document.body.style.overflow = "auto"
  currentUserId = null
}

function cerrarModalSiClickFuera(event, type) {
  if (event.target === event.currentTarget) cerrarModal(type)
}

async function guardarCambiosUsuario(event) {
  event.preventDefault()

  const nombre = document.getElementById("editNombre").value
  const email = document.getElementById("editEmail").value
  const numeroControl = document.getElementById("editNumero").value

  try {
    const response = await fetch(`http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/usuarios/${currentUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, numeroControl }),
    })

    if (!response.ok) throw new Error("Error al actualizar usuario")

    await cargarUsuarios()
    cerrarModal("edit")
   Swal.fire("Éxito", "Datos del usuario actualizados exitosamente.", "success")
  } catch (error) {
    console.error("Error:", error)
    Swal.fire("Error al actualizar el usuario")
  }
}

function actualizarRolInfo() {
  const rolId = document.getElementById("selectRol").value
  const roleNames = { 1: "administrador", 2: "docente", 3: "estudiante" }
  document.getElementById("rolNuevo").textContent = roleNames[rolId] || "estudiante"
}

async function asignarRol(event) {
  event.preventDefault()

  const nuevoRolId = document.getElementById("selectRol").value
  const user = users.find((u) => u.id === currentUserId)

  try {
    const response = await fetch(`http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/usuarios/${currentUserId}/rol`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rol: nuevoRolId }),
    })

    if (!response.ok) throw new Error("Error al actualizar rol")

    await cargarUsuarios()
    cerrarModal("role")
    Swal.fire("Éxito", `Rol asignado exitosamente a ${user.nombre}.`, "success")  } catch (error) {
    console.error("Error:", error)
Swal.fire("Error", "No se pudo asignar el rol.", "error")  }
}

function buscarUsuarios() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim()
  filteredUsers = searchTerm === "" ? [...users] : users.filter((u) => u.nombre.toLowerCase().includes(searchTerm))
  renderUsers()
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal("edit")
    cerrarModal("role")
  }
})

async function eliminarUsuario(userId) {
  const user = users.find((u) => u.id === userId)
  
  Swal.fire({
    title: "¿Eliminar usuario?",
    text: `¿Estás seguro de que deseas eliminar a ${user.nombre}? Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8b1538",
    cancelButtonColor: "#d1d5db",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/usuarios/${userId}`, {
          method: "DELETE"
        })

        if (!response.ok) throw new Error("Error al eliminar usuario")

        await cargarUsuarios()
        Swal.fire("Éxito", `${user.nombre} ha sido eliminado.`, "success")
      } catch (error) {
        console.error("Error:", error)
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error")
      }
    }
  })
}


