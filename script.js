const SUPABASE_URL =
"https://iomxopcdoygphvulaswb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_4KqCEnqLVSEETOob_X9c7w_4IOpToI-";

const supabaseClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

const formulario =
document.getElementById("formulario");

const boton =
document.getElementById("boton");

const mensaje =
document.getElementById("mensaje");

function mostrarMensaje(texto, tipo) {

mensaje.textContent = texto;
mensaje.className = tipo;
mensaje.style.display = "block";

}

formulario.addEventListener(
"submit",
async function(evento) {

evento.preventDefault();

/*
  Primero comprobamos que todos
  los campos obligatorios estén completos.
*/

if (!formulario.checkValidity()) {

  formulario.reportValidity();

  mostrarMensaje(
    "Por favor, completa todos los campos correctamente antes de enviar la solicitud.",
    "error"
  );

  return;
}


/*
  Obtener los valores directamente
  de cada campo.
*/

const nombre =
  document.getElementById("nombre")
    .value
    .trim();

const correo =
  document.getElementById("correo")
    .value
    .trim();

const telefono =
  document.getElementById("telefono")
    .value
    .trim();

const motivo =
  document.getElementById("motivo")
    .value
    .trim();


/*
  Comprobación adicional.
*/

if (
  !nombre ||
  !correo ||
  !telefono ||
  !motivo
) {

  mostrarMensaje(
    "Por favor, completa todos los campos antes de enviar la solicitud.",
    "error"
  );

  return;
}


/*
  Comprobar formato del correo.
*/

const correoValido =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(correo);

if (!correoValido) {

  mostrarMensaje(
    "Por favor, introduce un correo electrónico válido.",
    "error"
  );

  return;
}


boton.disabled = true;
boton.textContent = "Enviando...";

mensaje.style.display = "none";


/*
  Registro que será enviado
  a Supabase.
*/

const registro = {

  nombre: nombre,

  correo: correo,

  telefono: telefono,

  motivo: motivo,

  estado: "Pendiente"

};


console.log(
  "Registro que se enviará:",
  registro
);


try {

  const { data, error } =
    await supabaseClient

      .from("usuario_verificaciones")

      .insert(registro)

      .select()

      .single();


  /*
    Si Supabase devuelve un error,
    NO borramos el formulario.
  */

  if (error) {

    console.error(
      "Error de Supabase:",
      error
    );

    mostrarMensaje(
      "No se pudo enviar la solicitud. Por favor, inténtalo nuevamente.",
      "error"
    );

    return;
  }


  console.log(
    "Solicitud guardada:",
    data
  );


  /*
    Éxito.
  */

  mostrarMensaje(
    "Solicitud enviada correctamente. Será revisada y procesada en un plazo máximo de 72 horas.",
    "exito"
  );


  /*
    Solo después de confirmar que
    Supabase guardó la solicitud,
    limpiamos el formulario.
  */

  formulario.reset();


} catch (error) {

  console.error(
    "Error inesperado:",
    error
  );

  mostrarMensaje(
    "Ocurrió un problema de conexión. Por favor, inténtalo nuevamente.",
    "error"
  );


} finally {

  boton.disabled = false;

  boton.textContent =
    "Enviar solicitud";

}

}
);
