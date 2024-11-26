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
    fetch("http://localhost/proyecto-alquiler/controlador/inquilino.php", {
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

    fetch("http://localhost/proyecto-alquiler/controlador/inquilino.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((respuesta) => respuesta.json())
      .then(() => {
        limpiarFormulario();
        inicializarTabla();
      })
      .catch((error) => {
        console.error("Error al agregar el registro:", error);
      });
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

    fetch("http://localhost/proyecto-alquiler/controlador/inquilino.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((respuesta) => respuesta.json())
      .then(() => {
        inicializarTabla();
      })
      .catch((error) => {
        console.error("Error al editar el registro:", error);
      });
  }

  function eliminarRegistro() {
    const datos = { DNI: dniInput.value };

    fetch("http://localhost/proyecto-alquiler/controlador/inquilino.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((respuesta) => respuesta.json())
      .then(() => {
        limpiarFormulario();
        inicializarTabla();
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
      });
  }

  function buscar() {
    const datos = { DNI: dniInputBuscar.value };

    fetch("http://localhost/proyecto-alquiler/controlador/inquilino.php", {
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
