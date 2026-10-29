document.getElementById("enviar").addEventListener("click", function () {
  console.log("enviado");
});

document.getElementById("borrar").addEventListener("click", function () {
  document.querySelectorAll("input").forEach(function (campo) {
    campo.value = "";
  });
});
