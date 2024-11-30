window.addEventListener("DOMContentLoaded", () => {
  const agregarBtn = document.getElementById("agregar");
  const editarBtn = document.getElementById("editar");
  const eliminarBtn = document.getElementById("eliminar");
  const limpiarBtn = document.getElementById("limpiar");

  const buscarBtn = document.getElementById("buscar");
  const verTodosBtn = document.getElementById("verTodos");

  const dniInput = document.getElementById("dni");
  const dniInputBuscar = document.getElementById("dniBuscar");
  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const emailInput = document.getElementById("email");
  const fechaInicioInput = document.getElementById("fecha_inicio_alquiler");
  const idCasaInput = document.getElementById("id_casa");

  const tablaRegistros = document
    .getElementById("tablaRegistros")
    .querySelector("tbody");

  limpiarTabla();
  inicializarTabla();

  buscarBtn.addEventListener("click", buscar);
  verTodosBtn.addEventListener("click", () => {
    limpiarTabla();
    inicializarTabla();
  });

  agregarBtn.addEventListener("click", agregarRegistro);
  editarBtn.addEventListener("click", editarRegistro);
  eliminarBtn.addEventListener("click", eliminarRegistro);
  limpiarBtn.addEventListener("click", limpiarFormulario);

  function inicializarTabla() {
    fetch("https://api-alquiler-production.up.railway.app/controlador/inquilino.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((respuesta) => respuesta.json())
      .then((respuesta) => {
        limpiarTabla();
        llenarTabla(respuesta);
      })
      .catch((error) => {
        console.error("Error al inicializar la tabla:", error);
      });
  }

  function llenarTabla(datos) {
    if (datos.length > 0) {
      datos.forEach((registro, posicion) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${registro.DNI}</td>
          <td>${registro.nombre}</td>
          <td>${registro.telefono}</td>
          <td>${registro.email}</td>
          <td>${registro.fecha_inicio_alquiler}</td>
          <td>${registro.id_casa}</td>
        `;
        fila.addEventListener("click", () =>
          seleccionarRegistro(posicion, datos)
        );
        tablaRegistros.appendChild(fila);
      });
    } else {
      const fila = document.createElement("tr");
      fila.innerHTML = `<td colspan="6">No hay datos disponibles</td>`;
      tablaRegistros.appendChild(fila);
    }
  }

  function limpiarTabla() {
    tablaRegistros.innerHTML = "";
  }

  function seleccionarRegistro(posicion, datos) {
    dniInput.value = datos[posicion].DNI;
    nombreInput.value = datos[posicion].nombre;
    telefonoInput.value = datos[posicion].telefono;
    emailInput.value = datos[posicion].email;
    fechaInicioInput.value = datos[posicion].fecha_inicio_alquiler;
    idCasaInput.value = datos[posicion].id_casa;

    agregarBtn.disabled = true;
    editarBtn.disabled = false;
    eliminarBtn.disabled = false;
  }

  function limpiarFormulario() {
    dniInput.value = "";
    nombreInput.value = "";
    telefonoInput.value = "";
    emailInput.value = "";
    fechaInicioInput.value = "";
    idCasaInput.value = "";

    agregarBtn.disabled = false;
    editarBtn.disabled = true;
    eliminarBtn.disabled = true;
  }

  function agregarRegistro() {
    const datos = {
        DNI: dniInput.value,
        nombre: nombreInput.value,
        telefono: telefonoInput.value,
        email: emailInput.value,
        fecha_inicio_alquiler: fechaInicioInput.value,
        id_casa: idCasaInput.value,
    };
    const datos2 = {
      DNI: dniInput.value,
  };
    if (!buscarDNInquilino(datos2)) {
      alert('DNI ya existe en un propietario');
    }else{

    fetch("https://api-alquiler-production.up.railway.app/controlador/inquilino.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    })
    .then((respuesta) => respuesta.json())
    .then((data) => {
        if (data.success) {
            limpiarFormulario();
            inicializarTabla();
        } else {
            alert("El DNI ya le pertenece a un propietario");
            return false;
        }
    })
    .catch((error) => {
        alert("El DNI ya existe en la tabla inquilino");
    });
  }
}
function buscarDNInquilino(datos) {

  fetch("https://api-alquiler-production.up.railway.app/controlador/inquilino.php", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if(datos.length>0){
        return true;
      }
    })
    .catch((error) => {
      console.error("Error al buscar el registro:", error);
    });
    fetch("https://api-alquiler-production.up.railway.app/controlador/propietario.php", {
      method: "PATCH", // Método HTTP
      headers: { "Content-Type": "application/json" }, // Cabecera indicando que se envía JSON
      body: JSON.stringify(datos), // Convierte el objeto datos en formato JSON para enviarlo
    })
      .then((respuesta) => respuesta.json()) // Decodifica el JSON de la respuesta
      .then((datos) => {
        if(datos.length>0){
          return true;
        }
      })
      .catch((error) => {
        // Maneja errores durante la solicitud y los muestra en la página
        //document.getElementById("mensaje_resultado").innerText = "Error: " + error.message;
      });
    return false;
}

  function editarRegistro() {
    const datos = {
      DNI: dniInput.value,
      nombre: nombreInput.value,
      telefono: telefonoInput.value,
      email: emailInput.value,
      fecha_inicio_alquiler: fechaInicioInput.value,
      id_casa: idCasaInput.value,
    };
  
    fetch("https://api-alquiler-production.up.railway.app/controlador/inquilino.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((respuesta) => respuesta.json())
      .then((data) => {
        // Verificar si hubo un error en el backend
        if (data.error) {
          alert("Error: " + data.error); // Mostrar el error al usuario
        } else {
          inicializarTabla(); // Si todo está bien, actualizamos la tabla
        }
      })
      .catch((error) => {
        alert("Hubo un problema al editar el registro.");
      });
  }
  

  function eliminarRegistro() {
    const datos = { DNI: dniInput.value };

    fetch("https://api-alquiler-production.up.railway.app/controlador/inquilino.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((respuesta) => respuesta.json())
      .then(() => {
        limpiarFormulario();
        inicializarTabla();
        alert('Se elimino correctamente');
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
      });
  }

  function buscar() {
    const datos = { DNI: dniInputBuscar.value };

    fetch("https://api-alquiler-production.up.railway.app/controlador/inquilino.php", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        limpiarTabla();
        llenarTabla(datos);
      })
      .catch((error) => {
        console.error("Error al buscar el registro:", error);
      });
  }
});
