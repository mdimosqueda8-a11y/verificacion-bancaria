const SUPABASE_URL =
"https://iomxopcdoygphvulaswb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_4KqCEnqLVSEETOob_X9c7w_4IOpToI-";

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

const formulario = document.getElementById("formulario");
const boton = document.getElementById("boton");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo) {
mensaje.textContent = texto;
mensaje.className = tipo;
}

formulario.addEventListener("submit", async function(evento) {

evento.preventDefault();

// Comprobar primero que el formulario sea válido.
if (!formulario.checkValidity()) {
formulario.reportValidity();
return;
}

const nombre =
document.getElementById("nombre").value.trim();

const correo =
document.getElementById("correo").value.trim();

const telefono =
document.getElementById("telefono").value.trim();

const motivo =
document.getElementById("motivo").value.trim();

// Comprobación adicional para evitar enviar campos vacíos.
if (!nombre || !correo || !telefono || !motivo) {
mostrarMensaje(
"Por favor, completa todos los campos.",
"error"
);
return;
}

boton.disabled = true;
boton.textContent = "Enviando...";
mensaje.className = "";
mensaje.textContent = "";

const registro = {
nombre: nombre,
correo: correo,
telefono: telefono,
motivo: motivo,
estado: "Pendiente"
};

console.log("Registro que se enviará:", registro);

try {

const { data, error } = await supabaseClient
  .from("usuario_verificaciones")
  .insert(registro)
  .select()
  .single();

if (error) {

  console.error("Error de Supabase:", error);

  mostrarMensaje(
    "No se pudo guardar la solicitud: " + error.message,
    "error"
  );

  return;
}

console.log("Registro guardado:", data);

mostrarMensaje(
  "Solicitud enviada correctamente.",
  "exito"
);

formulario.reset();

} catch (error) {

console.error("Error inesperado:", error);

mostrarMensaje(
  "Ocurrió un error de conexión. Inténtalo nuevamente.",
  "error"
);

} finally {

boton.disabled = false;
boton.textContent = "Enviar solicitud";

}

});
