const SUPABASE_URL =
"https://iomxopcdoygphvulaswb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_4KqCEnqLVSEETOob_X9c7w_4IOpToI-";

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

const tabla = document.getElementById("tabla");
const mensaje = document.getElementById("mensaje");
const busqueda = document.getElementById("busqueda");
const actualizar = document.getElementById("actualizar");

let registros = [];

async function cargarRegistros() {

mensaje.textContent = "Cargando solicitudes...";

const { data, error } = await supabaseClient
.from("usuario_verificaciones")
.select("*")
.order("fecha", { ascending: false });

if (error) {

console.error("Error al cargar:", error);

mensaje.textContent =
  "No se pudieron cargar las solicitudes: " +
  error.message;

return;

}

registros = data || [];

mostrarRegistros(registros);
}

function mostrarRegistros(lista) {

tabla.innerHTML = "";

mensaje.textContent =
"Solicitudes encontradas: " + lista.length;

if (lista.length === 0) {

tabla.innerHTML = `
  <tr>
    <td colspan="8" style="text-align:center;">
      No hay solicitudes.
    </td>
  </tr>
`;

return;

}

lista.forEach(function(registro) {

const fila = document.createElement("tr");

const id = document.createElement("td");
id.textContent = registro.id ?? "";

const nombre = document.createElement("td");
nombre.textContent = registro.nombre ?? "";

const correo = document.createElement("td");
correo.textContent = registro.correo ?? "";

const telefono = document.createElement("td");
telefono.textContent = registro.telefono ?? "";

const motivo = document.createElement("td");
motivo.textContent = registro.motivo ?? "";

const estado = document.createElement("td");
estado.textContent = registro.estado ?? "Pendiente";
estado.className = "estado";

const fecha = document.createElement("td");

if (registro.fecha) {
  fecha.textContent =
    new Date(registro.fecha).toLocaleString("es-ES");
} else {
  fecha.textContent = "";
}

const acciones = document.createElement("td");

const botonEliminar =
  document.createElement("button");

botonEliminar.textContent = "Eliminar";
botonEliminar.className = "btn-eliminar";

botonEliminar.addEventListener("click", function() {
  eliminarRegistro(registro.id);
});

acciones.appendChild(botonEliminar);

fila.appendChild(id);
fila.appendChild(nombre);
fila.appendChild(correo);
fila.appendChild(telefono);
fila.appendChild(motivo);
fila.appendChild(estado);
fila.appendChild(fecha);
fila.appendChild(acciones);

tabla.appendChild(fila);

});
}

async function eliminarRegistro(id) {

const confirmar = confirm(
"¿Seguro que quieres eliminar esta solicitud?\n\n" +
"Esta acción no se puede deshacer."
);

if (!confirmar) {
return;
}

mensaje.textContent = "Eliminando solicitud...";

const { error } = await supabaseClient
.from("usuario_verificaciones")
.delete()
.eq("id", id);

if (error) {

console.error("Error al eliminar:", error);

mensaje.textContent =
  "No se pudo eliminar: " + error.message;

return;

}

registros = registros.filter(function(registro) {
return registro.id !== id;
});

mostrarRegistros(registros);

mensaje.textContent =
"Solicitud eliminada correctamente.";
}

busqueda.addEventListener("input", function() {

const texto =
busqueda.value.toLowerCase().trim();

if (!texto) {

mostrarRegistros(registros);
return;

}

const filtrados = registros.filter(function(registro) {

return (
  String(registro.nombre ?? "")
    .toLowerCase()
    .includes(texto) ||

  String(registro.correo ?? "")
    .toLowerCase()
    .includes(texto) ||

  String(registro.telefono ?? "")
    .toLowerCase()
    .includes(texto) ||

  String(registro.motivo ?? "")
    .toLowerCase()
    .includes(texto)
);

});

mostrarRegistros(filtrados);

});

actualizar.addEventListener("click", function() {
cargarRegistros();
});

cargarRegistros();
