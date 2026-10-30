const SUPABASE_URL = "https://iomxopcdoygphvulaswb.supabase.co";
const SUPABASE_KEY = "sb_publishable_4KqCEnqLVSEETOob_X9c7w_4IOpToI-";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const tabla = document.getElementById("tabla");
const mensaje = document.getElementById("mensaje");
const busqueda = document.getElementById("busqueda");
const actualizar = document.getElementById("actualizar");

let registros = [];

async function cargarRegistros() {
  mensaje.textContent = "Cargando solicitudes...";

  const { data, error } = await supabase
    .from("usuario_verificaciones")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) {
    mensaje.textContent = "Error al cargar.";
    return;
  }

  registros = data;
  mostrarRegistros(registros);
}

function mostrarImagen(url) {
  const img = document.createElement("img");
  img.src = url;
  return img;
}

function mostrarRegistros(lista) {
  tabla.innerHTML = "";

  lista.forEach((r) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${r.id}</td>
      <td>${r.usuario}</td>
      <td>${r.cuenta}</td>
      <td>${r.iban}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>${r.estado}</td>
      <td>${new Date(r.fecha).toLocaleString()}</td>
      <td><button class="btn-eliminar">Eliminar</button></td>
    `;

    fila.children[4].appendChild(mostrarImagen(r.frontal_url));
    fila.children[5].appendChild(mostrarImagen(r.trasera_url));
    fila.children[6].appendChild(mostrarImagen(r.domicilio_url));
    fila.children[7].appendChild(mostrarImagen(r.finanzas_url));

    fila.querySelector(".btn-eliminar").onclick = () => eliminarRegistro(r.id);

    tabla.appendChild(fila);
  });

  mensaje.textContent = `Solicitudes: ${lista.length}`;
}

async function eliminarRegistro(id) {
  const { error } = await supabase
    .from("usuario_verificaciones")
    .delete()
    .eq("id", id);

  if (!error) cargarRegistros();
}

busqueda.oninput = () => {
  const t = busqueda.value.toLowerCase();
  mostrarRegistros(
    registros.filter((r) =>
      `${r.usuario} ${r.cuenta} ${r.iban}`.toLowerCase().includes(t)
    )
  );
};

actualizar.onclick = cargarRegistros;

cargarRegistros();
