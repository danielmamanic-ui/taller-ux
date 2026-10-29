// Tarea Lab 11 - Registro de notas redisenado con principios de UX/UI
// Se mantienen las clases del Lab 08 y se agregan: boton desactivado hasta que los datos
// sean validos, mensajes despues de cada accion y opcion de deshacer al borrar.

class Estudiante {
  constructor(nombre, nota) {
    this.nombre = nombre;
    this.nota = nota;
  }

  estaAprobado() {
    return this.nota >= Estudiante.NOTA_MINIMA;
  }

  estado() {
    return this.estaAprobado() ? "aprobado" : "desaprobado";
  }
}
Estudiante.NOTA_MINIMA = 11;

class RegistroNotas {
  constructor() {
    this.estudiantes = [];
  }

  agregar(estudiante, posicion) {
    if (posicion === undefined) {
      this.estudiantes.push(estudiante);
    } else {
      this.estudiantes.splice(posicion, 0, estudiante);
    }
  }

  eliminar(estudiante) {
    const posicion = this.estudiantes.indexOf(estudiante);
    this.estudiantes.splice(posicion, 1);
    return posicion;
  }

  buscar(texto, filtro) {
    const t = texto.trim().toLowerCase();
    return this.estudiantes.filter((e) => {
      const coincideNombre = e.nombre.toLowerCase().includes(t);
      const coincideEstado = filtro === "todos" || e.estado() === filtro;
      return coincideNombre && coincideEstado;
    });
  }

  promedio() {
    if (this.estudiantes.length === 0) {
      return 0;
    }
    let suma = 0;
    this.estudiantes.forEach((e) => {
      suma = suma + e.nota;
    });
    return suma / this.estudiantes.length;
  }

  cantidadAprobados() {
    return this.estudiantes.filter((e) => e.estaAprobado()).length;
  }
}

// Datos iniciales
const registro = new RegistroNotas();
registro.agregar(new Estudiante("Ana Torres", 16));
registro.agregar(new Estudiante("Luis Quispe", 9));
registro.agregar(new Estudiante("Rosa Huaman", 13));

// Elementos del DOM
const formEstudiante = document.querySelector("#formEstudiante");
const nombre = document.querySelector("#nombre");
const nota = document.querySelector("#nota");
const btnAgregar = document.querySelector("#btnAgregar");
const aviso = document.querySelector("#aviso");
const avisoTexto = document.querySelector("#avisoTexto");
const btnDeshacer = document.querySelector("#btnDeshacer");
const buscar = document.querySelector("#buscar");
const conteo = document.querySelector("#conteo");
const lista = document.querySelector("#lista");
const promedio = document.querySelector("#promedio");
const aprobados = document.querySelector("#aprobados");
const desaprobados = document.querySelector("#desaprobados");

let ultimoBorrado = null; // { estudiante, posicion } para poder deshacer
let temporizador = null;

function mostrarAviso(texto, tipo, conDeshacer) {
  clearTimeout(temporizador);
  avisoTexto.textContent = texto;
  aviso.className = "aviso " + tipo;
  btnDeshacer.hidden = !conDeshacer;
  if (conDeshacer) {
    // La opcion de deshacer se ofrece durante 8 segundos
    temporizador = setTimeout(() => {
      btnDeshacer.hidden = true;
      ultimoBorrado = null;
    }, 8000);
  }
}

// Prevencion de errores: el boton solo se activa si los datos son validos
function datosValidos() {
  const valorNota = Number(nota.value);
  return nombre.value.trim() !== "" && nota.value !== "" && valorNota >= 0 && valorNota <= 20;
}

function revisarFormulario() {
  btnAgregar.disabled = !datosValidos();
}

function filtroActual() {
  return document.querySelector('input[name="filtro"]:checked').value;
}

function dibujar() {
  lista.innerHTML = "";
  const visibles = registro.buscar(buscar.value, filtroActual());

  if (visibles.length === 0) {
    const li = document.createElement("li");
    li.className = "vacio";
    li.textContent = "No hay estudiantes que coincidan con la búsqueda.";
    lista.appendChild(li);
  }

  visibles.forEach((est) => {
    const li = document.createElement("li");
    li.classList.add(est.estado());

    const info = document.createElement("span");
    const nombreEst = document.createElement("span");
    nombreEst.className = "nombre-est";
    nombreEst.textContent = est.nombre + ": " + est.nota;
    const estado = document.createElement("span");
    estado.className = "estado " + est.estado();
    estado.textContent = est.estaAprobado() ? "Aprobado" : "Desaprobado";
    info.appendChild(nombreEst);
    info.appendChild(estado);

    const btnBorrar = document.createElement("button");
    btnBorrar.type = "button";
    btnBorrar.className = "boton-borrar";
    btnBorrar.textContent = "Borrar";
    btnBorrar.setAttribute("aria-label", "Borrar a " + est.nombre);
    btnBorrar.addEventListener("click", () => {
      const posicion = registro.eliminar(est);
      ultimoBorrado = { estudiante: est, posicion: posicion };
      mostrarAviso("Se borró a " + est.nombre + ".", "info", true);
      dibujar();
      btnDeshacer.focus();
    });

    li.appendChild(info);
    li.appendChild(btnBorrar);
    lista.appendChild(li);
  });

  conteo.textContent = "Mostrando " + visibles.length + " de " + registro.estudiantes.length + " estudiantes.";
  const totalAprobados = registro.cantidadAprobados();
  promedio.textContent = registro.promedio().toFixed(2);
  aprobados.textContent = totalAprobados;
  desaprobados.textContent = registro.estudiantes.length - totalAprobados;
}

// Agregar
formEstudiante.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!datosValidos()) {
    return;
  }
  const valorNombre = nombre.value.trim();
  registro.agregar(new Estudiante(valorNombre, Number(nota.value)));
  mostrarAviso("Estudiante agregado: " + valorNombre + ".", "exito", false);
  formEstudiante.reset();
  revisarFormulario();
  dibujar();
  nombre.focus();
});

// Deshacer el ultimo borrado (control y libertad)
btnDeshacer.addEventListener("click", () => {
  if (ultimoBorrado === null) {
    return;
  }
  registro.agregar(ultimoBorrado.estudiante, ultimoBorrado.posicion);
  mostrarAviso("Se recuperó a " + ultimoBorrado.estudiante.nombre + ".", "exito", false);
  ultimoBorrado = null;
  dibujar();
  buscar.focus();
});

nombre.addEventListener("input", revisarFormulario);
nota.addEventListener("input", revisarFormulario);
buscar.addEventListener("input", dibujar);
document.querySelectorAll('input[name="filtro"]').forEach((radio) => {
  radio.addEventListener("change", dibujar);
});

dibujar();
