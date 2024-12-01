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
  async function agregarRegistro() {
    const datos = {
        DNI: dniInput.value,
        nombre: nombreInput.value,
        telefono: telefonoInput.value,
        email: emailInput.value,
        fecha_inicio_alquiler: fechaInicioInput.value,
        id_casa: idCasaInput.value,
    };

    const datosB = {
        DNI: dniInput.value,
    };

    try {
        // Verificar si el DNI existe en inquilinos
        const respuestaInquilino = await fetch("https://api-alquiler-production.up.railway.app/controlador/inquilino.php", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosB),
        });
        const resultadoInquilino = await respuestaInquilino.json();

        // Verificar si el DNI existe en propietarios
        const respuestaPropietario = await fetch("https://api-alquiler-production.up.railway.app/controlador/propietario.php", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosB),
        });
        const resultadoPropietario = await respuestaPropietario.json();

        // Validar existencia del DNI
        if (resultadoInquilino.length > 0 || resultadoPropietario.length > 0) {
            alert('El DNI ya existe en un propietario o en un inquilino');
            return;
        }

        // Si no existe, agregar el nuevo registro
        const respuestaAgregar = await fetch("https://api-alquiler-production.up.railway.app/controlador/inquilino.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        if (!respuestaAgregar.ok) {
            throw new Error('Error al agregar el registro.');
        }

        const datosAgregados = await respuestaAgregar.json();
        limpiarFormulario();
        inicializarTabla();
        alert('Registro agregado con éxito');
    } catch (error) {
        console.error("Error al agregar el registro:", error);
        alert('Ocurrió un error al agregar el registro.');
    }
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
