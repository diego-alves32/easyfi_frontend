async function criarRegistroFinanceiro(dados) {
  try {
    const response = await fetch(
      `https://easy-fi-eight.vercel.app/incomes-expenses/cadastroItem`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      }
    );

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

async function buscaCategorias() {
  try {
    const result = await fetch(
      "https://easy-fi-eight.vercel.app/categories/buscarCategorias"
    );
    const data = await result.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

let selectTipo = document.getElementById("select_tipo");
let selectCategoria = document.getElementById("select_categoria");
let formTransacao = document.getElementById("formTransacao");

function popularSelectCategorias(dados, tipoSelecionado) {
  const categorias = dados.categorias;
  selectCategoria.innerHTML =
    "<option value=''>Selecione uma categoria</option>";

  categorias.forEach((categoria) => {
    if (categoria.tipo == tipoSelecionado) {
      const option = document.createElement("option");
      option.value = categoria.id_categoria;
      option.textContent = categoria.desc_categoria;
      selectCategoria.appendChild(option);
    }
  });
}

async function buscarTransacaoPorId(id) {
  try {
    const response = await fetch(
      `https://easy-fi-eight.vercel.app/incomes-expenses/buscarItem/${id}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function editarTransacao(id, dados) {
  try {
    const response = await fetch(
      `https://easy-fi-eight.vercel.app/incomes-expenses/atualizarItem/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

selectTipo.addEventListener("change", async () => {
  const categorias = await buscaCategorias();
  const tipoSelecionado = selectTipo.value;
  popularSelectCategorias(categorias, tipoSelecionado);
});

document
  .getElementById("valorTransacao")
  .addEventListener("input", function (e) {
    let inputValue = e.target.value.replace(/\D/g, "");

    if (inputValue === "") {
      e.target.value = "0,00";
      return;
    }

    const valueInCents = parseInt(inputValue, 10);
    const formattedValue = (valueInCents / 100).toFixed(2).replace(".", ",");

    e.target.value = formattedValue;
  });

formTransacao.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tipo = document.getElementById("select_tipo").value;
  const data = document.getElementById("dataTransacao").value;
  const categoria = document.getElementById("select_categoria").value;
  const descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valorTransacao").value;

  valor = valor.replace(/\D/g, "");

  const usuario = buscarDadosUsuario();

  const dadosRequisicao = {
    idUsuario: usuario.id_usuario,
    idCategoria: categoria,
    descricaoItem: descricao,
    dataOcorrencia: data,
    valor: valor,
  };

  const idTransacao = new URLSearchParams(window.location.search).get("id")
    ? new URLSearchParams(window.location.search).get("id")
    : null;

  if (!idTransacao) {
    const registrar = await criarRegistroFinanceiro(dadosRequisicao);
    window.location.href = "../Dashboard/dashboard.html";
  } else {
    const editar = await editarTransacao(idTransacao, dadosRequisicao);
    window.location.href = "../Dashboard/dashboard.html";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const idTransacao = new URLSearchParams(window.location.search).get("id")
    ? new URLSearchParams(window.location.search).get("id")
    : null;

  if (idTransacao) {
    const transacao = await buscarTransacaoPorId(idTransacao);
    const id_categoria = transacao.registro.id_categoria;

    const data = transacao.registro.data_fato.split("T")[0];

    const categoria = await buscarCategoria(id_categoria);

    document.getElementById("descricao").value =
      transacao.registro.desc_registro;

    const valorCentavos = parseInt(transacao.registro.valor, 10);
    document.getElementById("valorTransacao").value = (valorCentavos / 100)
      .toFixed(2)
      .replace(".", ",");

    document.getElementById("dataTransacao").value = data;
    document.getElementById("select_tipo").value = categoria.tipo;

    const categorias = await buscaCategorias();
    popularSelectCategorias(categorias, categoria.tipo);
    document.getElementById("select_categoria").value = id_categoria;
  }
});

async function buscarCategoria(id) {
  let categorias = await buscaCategorias();
  let desc_categoria;
  let tipo;

  categorias = categorias.categorias;

  categorias.forEach((element) => {
    if (element.id_categoria == id) {
      desc_categoria = element.desc_categoria;
      tipo = element.tipo;
    }
  });

  return { desc_categoria, tipo };
}