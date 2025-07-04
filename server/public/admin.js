
document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();

  document.getElementById("formProducto").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const nuevoProducto = {
  codigo: document.getElementById("codigo").value.trim(),
  nombre: document.getElementById("nombre").value.trim(),
  descripcion: document.getElementById("descripcion").value.trim(),
  precio: parseFloat(document.getElementById("precio").value),
  stock: parseInt(document.getElementById("stock").value),
  categoria: document.getElementById("categoria").value.trim(),
  sucursalId: parseInt(document.getElementById("sucursalId").value)
};
    const res = await fetch("/api/admin/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(nuevoProducto)
});

    if (res.ok) {
      alert("Producto agregado");
      e.target.reset();
      await cargarProductos();
    } else {
      alert("Error al agregar producto");
    }
  });
});

async function cargarProductos() {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/productos/admin", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const productos = await res.json();

  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";

  productos.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <hr>
      <p><strong>${p.nombre}</strong> (${p.habilitado ? "Habilitado" : "Deshabilitado"})</p>
      <button onclick="deshabilitarProducto(${p.id})">Deshabilitar</button>
      <button onclick="eliminarProducto(${p.id})">Eliminar</button>
    `;
    lista.appendChild(div);
  });
}

async function deshabilitarProducto(id) {
  const token = localStorage.getItem("token");
  await fetch(`/api/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ habilitado: false })
  });
  await cargarProductos();
}

async function eliminarProducto(id) {
  const token = localStorage.getItem("token");
  await fetch(`/api/productos/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  await cargarProductos();
}

function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}
