function paginasProtegidasSeLogado() {
  const dadosUsuario = localStorage.getItem("usuario");
  if (!dadosUsuario) {
    window.location.href = "../index.html";
  }
}

function paginasProtegidasSeNaoLogado() {
  const dadosUsuario = localStorage.getItem("usuario");
  if (dadosUsuario) {
    window.location.href = "./Dashboard/dashboard.html";
  }
}
