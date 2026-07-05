let cart = JSON.parse(localStorage.getItem("cart")) || []

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  renderCartItems()
  updateSummary()
  cargarDocentes() 
   mostrarUsuario();
})

document.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
  updateSummary();
  cargarDocentes();
  mostrarUsuario(); // 👈
});

async function mostrarUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return;

  // Obtener datos completos del usuario con carrera
  try {
    const response = await fetch(`http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/usuario/${usuario.id_usuario}`);
    const userData = await response.json();
    
    document.getElementById("userName").textContent = userData.nombre_completo;
    document.getElementById("userCareer").textContent = userData.carrera || "No registrada";
  } catch (error) {
    console.error("Error al cargar datos del usuario:", error);
    // Fallback a datos del localStorage
    document.getElementById("userName").textContent = `${usuario.nombres} ${usuario.apellidos}`;
    document.getElementById("userCareer").textContent = "No disponible";
  }
}


// Render cart items
function renderCartItems() {
  const cartList = document.getElementById("cartItemsList")
  const emptyCart = document.getElementById("emptyCart")
  const confirmBtn = document.getElementById("confirmLoanBtn")

  if (cart.length === 0) {
    cartList.style.display = "none"
    emptyCart.style.display = "block"
    confirmBtn.disabled = true
    return
  }

  cartList.style.display = "block"
  emptyCart.style.display = "none"
  confirmBtn.disabled = false

  cartList.innerHTML = cart
    .map(
      (item, index) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-category">${item.category}</p>
        <div class="cart-item-quantity">
          <span>Cantidad: ${item.quantity}</span>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="cart-qty-btn" onclick="decreaseQuantity(${index})">-</button>
        <button class="cart-qty-btn" onclick="increaseQuantity(${index})">+</button>
        <button class="remove-btn" onclick="removeItem(${index})">Eliminar</button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Update summary
function updateSummary() {
  const totalItems = cart.length
  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0)

  document.getElementById("totalItems").textContent = totalItems
  document.getElementById("totalUnits").textContent = totalUnits
}

// Increase quantity
function increaseQuantity(index) {
  cart[index].quantity++
  localStorage.setItem("cart", JSON.stringify(cart))
  renderCartItems()
  updateSummary()
}

// Decrease quantity
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--
    localStorage.setItem("cart", JSON.stringify(cart))
    renderCartItems()
    updateSummary()
  }
}

// Remove item
function removeItem(index) {
  Swal.fire({
    title: "¿Eliminar material?",
    text: "¿Estás seguro de que deseas eliminar este material?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      cart.splice(index, 1)
      localStorage.setItem("cart", JSON.stringify(cart))
      renderCartItems()
      updateSummary()

      Swal.fire({
        icon: "success",
        title: "Material eliminado",
        showConfirmButton: false,
        timer: 1500
      })
    }
  })
}



// Cargar lista de docentes en el select




async function confirmLoan() {
  const reason = document.getElementById("loanReason").value.trim();
  const docenteId = document.getElementById("docenteSelect").value;

  if (!reason) {
  Swal.fire({
    icon: "warning",
    title: "Campo vacío",
    text: "Por favor, ingresa el motivo del préstamo.",
    confirmButtonText: "Entendido",
  });
  return;
}


const teacherSelect = document.getElementById("docenteSelect");
const id_docente = teacherSelect.value;


if (id_docente === "" || id_docente === null) {
  Swal.fire({
    icon: "warning",
    title: "Docente no seleccionado",
    text: "Por favor, selecciona un docente antes de continuar.",
    confirmButtonText: "Entendido"
  });
  teacherSelect.focus();
  return;
}



  if (cart.length === 0) {
    alert("Tu solicitud está vacía");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Debes iniciar sesión");
    window.location.href = "index.html";
    return;
  }

  const confirmBtn = document.getElementById("confirmLoanBtn");
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Procesando...";

  try {
    const materialesParaEnviar = cart.map((item) => ({
      id_materiales: item.id,
      cantidad: item.quantity,
    }));

    const teacherName =
  teacherSelect.options[teacherSelect.selectedIndex].textContent;


    const response = await fetch("http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/vales-prestamo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
  id_usuario: usuario.id_usuario,
  docente: teacherName, // 👈 lo agregamos aquí
  materiales: materialesParaEnviar,
  fecha_entrega: new Date().toISOString(),
  motivo: String(reason),
}),

    });

    const data = await response.json();

    if (data.success) {
      console.log("[Carrito] Vale creado exitosamente con ID:", data.id_vales);

  // 👇 AQUI VA EL BLOQUE NUEVO 👇
  const teacherName = teacherSelect.options[teacherSelect.selectedIndex].text;

  const loanData = {
    id_vales: data.id_vales,
    materials: cart,
    reason: reason,
    docente: { id: id_docente, nombre: teacherName }, // 👈 guardamos esto
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("currentLoan", JSON.stringify(loanData));

  // ✅ Todo lo que ya tenías después
  // Limpiar carrito
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));

  // Redirigir al vale
  window.location.href = "vale-prestamo.html";
    } else {
      throw new Error(data.error);
    }
  } 
  catch (error) {
    console.error("[Carrito] Error:", error);
    alert("Error al enviar la solicitud: " + error.message);
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.textContent = "Confirmar Préstamo";
  }
}



// Cargar docentes para el select
async function cargarDocentes() {
  const select = document.getElementById("docenteSelect");

  try {
    const res = await fetch("http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/docentes");
    const docentes = await res.json();

    if (docentes.length === 0) {
      select.innerHTML = `<option value="">No hay docentes registrados</option>`;
      return;
    }

    select.innerHTML =
  `<option value="">Seleccione un docente</option>` + 
  docentes
    .map(
      (d) =>
        `<option value="${d.id_usuario}">${d.nombre_completo}</option>`
    )
    .join("");

  } catch (error) {
    console.error("Error al cargar docentes:", error);
    select.innerHTML = `<option value="">Error al cargar docentes</option>`;
  }
}


