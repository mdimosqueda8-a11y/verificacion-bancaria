const SUPABASE_URL =
  "https://iomxopcdoygphvulaswb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_4KqCEnqLVSEETOob_X9c7w_4IOpToI-";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


const tabla =
  document.getElementById("tabla");

const mensaje =
  document.getElementById("mensaje");

const busqueda =
  document.getElementById("busqueda");

const actualizar =
  document.getElementById("actualizar");


let registros = [];


async function cargarRegistros() {

  mensaje.textContent =
    "Cargando solicitudes...";


  const { data, error } =
    await supabaseClient
      .from("usuario_verificaciones")
      .select("*")
      .order("fecha", {
        ascending: false
      });


  if (error) {

    console.error(
      "Error al cargar:",
      error
    );

    mensaje.textContent =
      "No se pudieron cargar las solicitudes.";

    return;
  }


  registros = data || [];

  mostrarRegistros(registros);
}


function crearEstado(registro) {

  const select =
    document.createElement("select");


  const estados = [
    "Pendiente",
    "En revisión",
    "Aprobado",
    "Rechazado"
  ];


  estados.forEach(function(estado) {

    const opcion =
      document.createElement("option");

    opcion.value = estado;
    opcion.textContent = estado;

    if (
      (registro.estado || "Pendiente")
      === estado
    ) {
      opcion.selected = true;
    }

    select.appendChild(opcion);

  });


  aplicarColorEstado(
    select,
    registro.estado || "Pendiente"
  );


  select.addEventListener(
    "change",
    function() {

      actualizarEstado(
        registro.id,
        select.value,
        select
      );

    }
  );


  return select;
}


function aplicarColorEstado(
  elemento,
  estado
) {

  elemento.classList.remove(
    "estado-pendiente",
    "estado-revision",
    "estado-aprobado",
    "estado-rechazado"
  );


  if (estado === "Pendiente") {

    elemento.classList.add(
      "estado-pendiente"
    );

  }

  else if (estado === "En revisión") {

    elemento.classList.add(
      "estado-revision"
    );

  }

  else if (estado === "Aprobado") {

    elemento.classList.add(
      "estado-aprobado"
    );

  }

  else if (estado === "Rechazado") {

    elemento.classList.add(
      "estado-rechazado"
    );

  }

}


async function actualizarEstado(
  id,
  nuevoEstado,
  elemento
) {

  elemento.disabled = true;

  mensaje.textContent =
    "Actualizando estado...";


  const { error } =
    await supabaseClient
      .from("usuario_verificaciones")
      .update({
        estado: nuevoEstado
      })
      .eq("id", id);


  if (error) {

    console.error(
      "Error al actualizar:",
      error
    );

    mensaje.textContent =
      "No se pudo actualizar el estado: " +
      error.message;

    elemento.disabled = false;

    return;
  }


  const registro =
    registros.find(function(item) {

      return item.id === id;

    });


  if (registro) {
    registro.estado = nuevoEstado;
  }


  aplicarColorEstado(
    elemento,
    nuevoEstado
  );


  mensaje.textContent =
    "Estado actualizado correctamente.";


  elemento.disabled = false;
}


function mostrarRegistros(lista) {

  tabla.innerHTML = "";


  mensaje.textContent =
    "Solicitudes encontradas: " +
    lista.length;


  if (lista.length === 0) {

    const fila =
      document.createElement("tr");

    const celda =
      document.createElement("td");

    celda.colSpan = 8;

    celda.textContent =
      "No hay solicitudes.";

    celda.style.textAlign =
      "center";

    fila.appendChild(celda);

    tabla.appendChild(fila);

    return;
  }


  lista.forEach(function(registro) {

    const fila =
      document.createElement("tr");


    const id =
      document.createElement("td");

    id.textContent =
      registro.id ?? "";


    const nombre =
      document.createElement("td");

    nombre.textContent =
      registro.nombre ?? "";


    const correo =
      document.createElement("td");

    correo.textContent =
      registro.correo ?? "";


    const telefono =
      document.createElement("td");

    telefono.textContent =
      registro.telefono ?? "";


    const motivo =
      document.createElement("td");

    motivo.textContent =
      registro.motivo ?? "";


    const estado =
      document.createElement("td");

    estado.appendChild(
      crearEstado(registro)
    );


    const fecha =
      document.createElement("td");


    if (registro.fecha) {

      fecha.textContent =
        new Date(
          registro.fecha
        ).toLocaleString("es-ES");

    } else {

      fecha.textContent = "";

    }


    const acciones =
      document.createElement("td");


    const botonEliminar =
      document.createElement("button");


    botonEliminar.textContent =
      "Eliminar";

    botonEliminar.className =
      "btn-eliminar";


    botonEliminar.addEventListener(
      "click",
      function() {

        eliminarRegistro(
          registro.id
        );

      }
    );


    acciones.appendChild(
      botonEliminar
    );


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

  const confirmar =
    confirm(
      "¿Seguro que quieres eliminar esta solicitud?\n\n" +
      "Esta acción no se puede deshacer."
    );


  if (!confirmar) {
    return;
  }


  mensaje.textContent =
    "Eliminando solicitud...";


  const { error } =
    await supabaseClient
      .from("usuario_verificaciones")
      .delete()
      .eq("id", id);


  if (error) {

    console.error(
      "Error al eliminar:",
      error
    );

    mensaje.textContent =
      "No se pudo eliminar la solicitud.";

    return;
  }


  registros =
    registros.filter(function(registro) {

      return registro.id !== id;

    });


  mostrarRegistros(registros);


  mensaje.textContent =
    "Solicitud eliminada correctamente.";
}


busqueda.addEventListener(
  "input",
  function() {

    const texto =
      busqueda.value
        .toLowerCase()
        .trim();


    if (!texto) {

      mostrarRegistros(registros);

      return;
    }


    const filtrados =
      registros.filter(
        function(registro) {

          return (

            String(
              registro.nombre ?? ""
            )
            .toLowerCase()
            .includes(texto)

            ||

            String(
              registro.correo ?? ""
            )
            .toLowerCase()
            .includes(texto)

            ||

            String(
              registro.telefono ?? ""
            )
            .toLowerCase()
            .includes(texto)

            ||

            String(
              registro.motivo ?? ""
            )
            .toLowerCase()
            .includes(texto)

          );

        }
      );


    mostrarRegistros(filtrados);

  }
);


actualizar.addEventListener(
  "click",
  function() {

    cargarRegistros();

  }
);


cargarRegistros();
