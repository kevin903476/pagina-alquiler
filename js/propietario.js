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
    // Datos iniciales opcionales
    fetch("https://api-alquiler-production.up.railway.app/controlador/propietario.php", {
      method: "GET", // Método HTTP
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
    //console.log(datos.length)
    if (datos.length > 0) {
      datos.forEach((registro, posicion) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
             <td>${registro.DNI}</td>
             <td>${registro.nombre}</td>
             <td>${registro.telefono}</td>
             <td>${registro.email}</td>
         `;
        fila.addEventListener("click", () =>
          seleccionarRegistro(posicion, datos)
        );
        tablaRegistros.appendChild(fila);
      });
    } else {
      const fila = document.createElement("tr");
        fila.innerHTML = `
             <td>   No hay datos disponibles   </td>
             
         `;
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

    agregarBtn.disabled = true;
    editarBtn.disabled = false;
    eliminarBtn.disabled = false;
  }

  function limpiarFormulario() {
    dniInput.value = "";
    nombreInput.value = "";
    telefonoInput.value = "";
    emailInput.value = "";
    registroSeleccionado = null;

    agregarBtn.disabled = false;
    editarBtn.disabled = true;
    eliminarBtn.disabled = true;
  }

  function agregarRegistro() {
    const datos = {
      DNI: dni,
      nombre: nombreInput.value,
      telefono: telefonoInput.value,
      email: emailInput.value,
    };
  
    // Realiza la solicitud al API utilizando Fetch
    fetch("https://api-alquiler-production.up.railway.app/controlador/propietario.php", {
      method: "POST", // Método HTTP
      headers: { "Content-Type": "application/json" }, // Cabecera indicando que se envía JSON
      body: JSON.stringify(datos), // Convierte el objeto datos en formato JSON para enviarlo
    })
      .then((respuesta) => respuesta.json()) // Decodifica el JSON de la respuesta
      .then((datos) => {
        if (datos.error) {
          alert(datos.error); // Mostrar el mensaje de error si el servidor lo devuelve
        } else {
          limpiarFormulario();
          inicializarTabla();
        }
      })
      .catch((error) => {
        alert("Error al agregar el propietario:", error);
      });
  }

  function editarRegistro() {
    const datos = {
        DNI: dniInput.value,
        nombre: nombreInput.value,
        telefono: telefonoInput.value,
        email: emailInput.value,
    };

    fetch("https://api-alquiler-production.up.railway.app/controlador/propietario.php", {
        method: "PUT", // Método HTTP
        headers: { "Content-Type": "application/json" }, // Cabecera indicando que se envía JSON
        body: JSON.stringify(datos), // Convierte el objeto datos en formato JSON para enviarlo
    })
    .then((respuesta) => respuesta.json()) // Decodifica el JSON de la respuesta
    .then((datos) => {
        if (datos.error) {
            alert(datos.error); // Mostrar el mensaje de error si el servidor lo devuelve
        } else {
            inicializarTabla();
        }
    })
    .catch((error) => {
         alert("Error al editar el propietario:", error); // Mostrar error en caso de fallo
    });
}

  function eliminarRegistro() {
    const datos = {
      DNI: dniInput.value,
    };

    fetch("https://api-alquiler-production.up.railway.app/controlador/propietario.php", {
      method: "DELETE", // Método HTTP
      headers: { "Content-Type": "application/json" }, // Cabecera indicando que se envía JSON
      body: JSON.stringify(datos), // Convierte el objeto datos en formato JSON para enviarlo
    })
      .then((respuesta) => respuesta.json()) // Decodifica el JSON de la respuesta
      .then((datos) => {
        limpiarFormulario();
        inicializarTabla();
        alert('Se elimino correctamente');
      })
      .catch((error) => {});
  }

  function buscar() {
    const datos = {
      DNI: dniInputBuscar.value,
    };

    fetch("https://api-alquiler-production.up.railway.app/controlador/propietario.php", {
      method: "PATCH", // Método HTTP
      headers: { "Content-Type": "application/json" }, // Cabecera indicando que se envía JSON
      body: JSON.stringify(datos), // Convierte el objeto datos en formato JSON para enviarlo
    })
      .then((respuesta) => respuesta.json()) // Decodifica el JSON de la respuesta
      .then((datos) => {
        limpiarTabla();
        llenarTabla(datos);
      })
      .catch((error) => {
        // Maneja errores durante la solicitud y los muestra en la página
        //document.getElementById("mensaje_resultado").innerText = "Error: " + error.message;
      });
  }

  //limpiarFormulario();
});
