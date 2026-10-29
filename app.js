const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const boton = formulario.querySelector(".boton-principal");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  formulario.classList.add("validado");

  if (!formulario.checkValidity()) {
    mostrarMensaje("Revisa los campos marcados en rojo.", "error");
    formulario.querySelector("input:invalid, select:invalid").focus();
    return;
  }

  boton.disabled = true;
  boton.textContent = "Enviando...";
  mostrarMensaje("Enviando tu inscripción...", "info");

  setTimeout(function () {
    boton.disabled = false;
    boton.textContent = "Inscribirme";
    const taller = document.getElementById("taller").value;
    mostrarMensaje("¡Listo! Quedaste inscrito en el taller de " + taller + ".", "exito");
  }, 1500);
});

formulario.addEventListener("reset", function (evento) {
  if (!confirm("¿Seguro que quieres borrar todos los datos del formulario?")) {
    evento.preventDefault();
    return;
  }
  formulario.classList.remove("validado");
  mostrarMensaje("Formulario limpio. Puedes empezar de nuevo.", "info");
});
