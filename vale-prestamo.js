// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadReceiptData()
})

// Load receipt data
async function loadReceiptData() {
  const loanData = JSON.parse(localStorage.getItem("currentLoan"))
  const usuario = JSON.parse(localStorage.getItem("usuario"))

  if (!loanData) {
    alert("No se encontraron datos del préstamo")
    window.location.href = "alumno.html"
    return
  }

  if (!usuario) {
    alert("No se encontraron datos del usuario")
    window.location.href = "index.html"
    return
  }

  // Generate receipt number
  const receiptNumber = "VP-" + loanData.id_vales.toString().padStart(8, "0")
  document.getElementById("receiptNumber").textContent = receiptNumber

  // Format date and time
  const date = new Date(loanData.timestamp)
  const formattedDate = date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  document.getElementById("receiptDateTime").textContent = formattedDate

  // Student data
  document.getElementById("studentNameReceipt").textContent = `${usuario.nombres} ${usuario.apellidos}`
  document.getElementById("studentControlReceipt").textContent = usuario.id_usuario

  try {
    const response = await fetch(`http://proyecto-is-backend-env.eba-vmx56ujg.us-east-1.elasticbeanstalk.com/usuario/${usuario.id_usuario}`)
    const usuarioData = await response.json()
    document.getElementById("studentCareerReceipt").textContent =
      usuarioData.carrera || usuarioData.nombre_carrera || "N/A"
  } catch (error) {
    console.error("Error al obtener la carrera:", error)
    document.getElementById("studentCareerReceipt").textContent = usuario.carrera || usuario.nombre_carrera || "N/A"
  }

  document.getElementById("studentSemesterReceipt").textContent = `${usuario.semestre || "N/A"} Semestre`
  document.getElementById("studentTeacherReceipt").textContent = loanData.docente?.nombre || "No asignado"

  // Materials table
  const tableBody = document.getElementById("materialsTableBody")
  tableBody.innerHTML = loanData.materials
    .map(
      (item) => `
    <tr>
      <td class="border border-gray-300 p-2">${item.name}</td>
      <td class="border border-gray-300 p-2">${item.category}</td>
      <td class="border border-gray-300 p-2 text-center">${item.quantity}</td>
    </tr>
  `,
    )
    .join("")

  // Loan reason
  document.getElementById("loanReasonReceipt").textContent = loanData.reason
}

// Print receipt
function printReceipt() {
  window.print()
}


