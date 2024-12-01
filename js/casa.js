window.addEventListener("DOMContentLoaded", () => {
  const agregarBtn = document.getElementById("agregar");
  const editarBtn = document.getElementById("editar");
  const eliminarBtn = document.getElementById("eliminar");
  const limpiarBtn = document.getElementById("limpiar");

  const buscarBtn = document.getElementById("buscar");
  const verTodosBtn = document.getElementById("verTodos");

  const idCasaInput = document.getElementById("idCasa");
  const direccionInput = document.getElementById("direccion");
  const ciudadInput = document.getElementById("ciudad");
  const precioAlquilerInput = document.getElementById("precioAlquiler");
  const dniPropietarioInput = document.getElementById("dniPropietario");
  const idCasaBuscarInput = document.getElementById("idCasaBuscar");

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
    fetch("https://api-alquiler-production.up.railway.app/controlador/casa.php", {
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
             <td>${registro.id_casa}</td>
             <td>${registro.direccion}</td>
             <td>${registro.ciudad}</td>
             <td>${registro.precio_alquiler}</td>
             <td>${registro.DNI_propietario}</td>
         `;
        fila.addEventListener("click", () =>
          seleccionarRegistro(posicion, datos)
        );
        tablaRegistros.appendChild(fila);
      });
    } else {
      const fila = document.createElement("tr");
      fila.innerHTML = `<td colspan="5">No hay datos disponibles</td>`;
      tablaRegistros.appendChild(fila);
    }
  }

  function limpiarTabla() {
    tablaRegistros.innerHTML = "";
  }

  function seleccionarRegistro(posicion, datos) {
    idCasaInput.value = datos[posicion].id_casa;
    direccionInput.value = datos[posicion].direccion;
    ciudadInput.value = datos[posicion].ciudad;
    precioAlquilerInput.value = datos[posicion].precio_alquiler;
    dniPropietarioInput.value = datos[posicion].DNI_propietario;

    agregarBtn.disabled = true;
    editarBtn.disabled = false;
    eliminarBtn.disabled = false;
  }

  function limpiarFormulario() {
    idCasaInput.value = "";
    direccionInput.value = "";
    ciudadInput.value = "";
    precioAlquilerInput.value = "";
    dniPropietarioInput.value = "";

    agregarBtn.disabled = false;
    editarBtn.disabled = true;
    eliminarBtn.disabled = true;
  }

  function agregarRegistro() {
    const datos = {
        direccion: direccionInput.value,
        ciudad: ciudadInput.value,
        precio_alquiler: precioAlquilerInput.value,
        DNI_propietario: dniPropietarioInput.value,
    };

    fetch("https://api-alquiler-production.up.railway.app/controlador/casa.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then((respuesta) => respuesta.json())
    .then((data) => {
          // Verificar si hubo un error en el backend
          if (data.error) {
            alert("Error: " + data.error); // Mostrar el error al usuario
          } else {
            limpiarFormulario();
            inicializarTabla(); // Si todo está bien, actualizamos la tabla
          }
    })
    .catch((error) => {
        alert('Hubo un problema al ingresar Casa'); 
    });
}

function editarRegistro() {
  const datos = {
    id_casa: idCasaInput.value,
    direccion: direccionInput.value,
    ciudad: ciudadInput.value,
    precio_alquiler: precioAlquilerInput.value,
    // Solo agregamos el DNI_propietario si el campo no está vacío
    DNI_propietario: dniPropietarioInput.value || null, // Si está vacío, lo dejamos como null
  };

  fetch("https://api-alquiler-production.up.railway.app/controlador/casa.php", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then((respuesta) => respuesta.json())
    .then(() => {
      alert("Actualizado Correctamente")
      limpiarFormulario();
      inicializarTabla();
    })
    .catch((error) => {
      alert("Error al editar registro:", error);
    });
}

  function eliminarRegistro() {
    const datos = { id_casa: idCasaInput.value };

    fetch("https://api-alquiler-production.up.railway.app/controlador/casa.php", {
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
        alert.error("Error al eliminar registro:", error);
      });
  }

  function buscar() {
    const datos = { id_casa: idCasaBuscarInput.value };

    fetch("https://api-alquiler-production.up.railway.app/controlador/casa.php", {
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
        alert.error("Error al buscar registro:", error);
      });
  }
});
