async function buscaDadosFinanceiros(dataInicio, dataFim) {
  const now = new Date();
  const primeiroDiaMes = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const ultimoDiaMes = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const inicio = dataInicio ? dataInicio : primeiroDiaMes;
  const fim = dataFim ? dataFim : ultimoDiaMes;

  try {
    const usuario = buscarDadosUsuario();
    const response = await fetch(
      `https://easy-fi-eight.vercel.app/incomes-expenses/buscarExtratoFiltro?userId=${usuario.id_usuario}&dataInicio=${inicio}&dataFim=${fim}`
    );
    const data = await response.json();

    if (!response.ok) throw new Error("Erro ao buscar dados da API");

    return data;
  } catch (error) {
    console.error("Erro ao buscar dados financeiros:", error);
  }
}

function trataDadosFinanceiros(data) {
  if (!data) return;

  var totalDespesas = 0;
  var totalReceitas = 0;

  for (i = 0; i < data.extrato.length; i++) {
    if (data.extrato[i].tipo == "receita") {
      totalReceitas += parseFloat(data.extrato[i].valor);
    } else if (data.extrato[i].tipo == "despesa") {
      totalDespesas += parseFloat(data.extrato[i].valor);
    }
  }

  var saldo = totalReceitas - totalDespesas;

  document.getElementById("receita").textContent = `R$ ${formatarMoeda(
    totalReceitas
  )}`;
  document.getElementById("despesas").textContent = `R$ ${formatarMoeda(
    totalDespesas
  )}`;
  document.getElementById("saldo").textContent = `R$ ${formatarMoeda(saldo)}`;

  if (saldo < 0) {
    document.getElementById("saldo").style = "color: red;";
  } else {
    document.getElementById("saldo").style = "color: #90ee90;";
  }

  return { saldo, totalReceitas, totalDespesas };
}

function formatarMoeda(valor) {
  return (valor / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buscarDadosUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  document.getElementById("nomeUsuario").innerText = `${usuario.nome}`; 
  return usuario;
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await buscaDadosFinanceiros();
  const valoresFinanceiros = trataDadosFinanceiros(data);
  const usuario = buscarDadosUsuario();

  if (valoresFinanceiros) {
    atualizaGrafico(valoresFinanceiros);
  }
});

document.getElementById("logout")?.addEventListener("click", function (event) {
  localStorage.removeItem("usuario");
  window.location.href = "/";
});

document.getElementById("filterType").addEventListener("change", function () {
  const filterType = this.value;
  document
    .querySelectorAll(".filter-field")
    .forEach((field) => (field.style.display = "none"));

  if (filterType === "categoria") {
    document.getElementById("categoriaInput").style.display = "inline-block";
  } else if (filterType === "id") {
    document.getElementById("idInput").style.display = "inline-block";
  } else if (filterType === "data") {
    document.getElementById("dateInput").style.display = "inline-block";
  }
});
