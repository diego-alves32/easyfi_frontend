document.getElementById("searchButton").addEventListener("click", function () {
  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim = document.getElementById("dataFim").value;

  filtrarTransacoes(dataInicio, dataFim);
});

document.getElementById("viewAllButton").addEventListener("click", function () {
  filtrarTransacoes();
});

async function filtrarTransacoes(dataInicio, dataFim) {
  const dadosFinanceiros = await buscaDadosFinanceiros(dataInicio, dataFim);

  let resultados = dadosFinanceiros.extrato;

  const modalTransactionList = document.getElementById("modalTransactionList");
  modalTransactionList.innerHTML = "";

  if (resultados.length > 0) {
    const table = document.createElement("table");
    table.classList.add("transactions-table");

    const thead = `
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Tipo</th>
                      <th>Categoria</th>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Ações</th>
                  </tr>
              </thead>
          `;
    const tbody = document.createElement("tbody");

    resultados.forEach((transacao) => {
      const capitalize = (str) => {
        if (!str) return "";
        const segmenter = new Intl.Segmenter("pt", { granularity: "word" });
        return Array.from(segmenter.segment(str))
          .map(
            ({ segment }) =>
              segment[0].toUpperCase() + segment.slice(1).toLowerCase()
          )
          .join("");
      };

      const formatarData = (data) => {
        const [year, month, day] = data.split("T")[0].split("-");
        return `${day}/${month}/${year}`;
      };

      const formatarValor = (valor) => {
        const valorCentavos = parseInt(valor, 10);
        return (valorCentavos / 100)
          .toFixed(2)
          .replace(".", ",")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };

      const row = `
                  <tr>
                      <td>${transacao.id_registro}</td>
                      <td>${capitalize(transacao.tipo)}</td>
                      <td>${capitalize(transacao.desc_categoria)}</td>
                      <td>${formatarData(transacao.data_fato)}</td>
                      <td>${capitalize(transacao.desc_registro)}</td>
                      <td>R$ ${formatarValor(transacao.valor)}</td>
                      <td>
                          <button class="edit-button" onclick="editarTransacao(${
                            transacao.id_registro
                          }, '${encodeURIComponent(
        JSON.stringify(transacao)
      )}')">Editar</button>
                          <button class="delete-button" onclick="deletarTransacao(${
                            transacao.id_registro
                          })">Deletar</button>
                      </td>
                  </tr>
              `;
      tbody.innerHTML += row;
    });

    table.innerHTML = thead;
    table.appendChild(tbody);
    modalTransactionList.appendChild(table);

    const modal = document.getElementById("transactionModal");
    modal.style.display = "block";
  } else {
    modalTransactionList.innerHTML =
      "<p>Nenhuma transação encontrada para este período.</p>";
    const modal = document.getElementById("transactionModal");
    modal.style.display = "block";
  }
}

function editarTransacao(id, transacaoString) {
  console.log(id);
  const transacao = JSON.parse(decodeURIComponent(transacaoString));
  console.log("Transação a ser editada:", transacao.data_fato);
  localStorage.setItem("transacaoEditar", JSON.stringify(transacao));
}

async function deletarTransacao(id) {
  if (confirm("Deseja realmente excluir esta transação?")) {
    const deletar = await deletarTransacao(id);
    console.log(deletar);
    alert(`Transação com ID ${id} deletada com sucesso.`);
    window.location.href = `transaction-form.html?id=${id}`;
  }
}

document
  .getElementById("modalTransactionList")
  .addEventListener("input", (e) => {
    if (e.target.classList.contains("valorTransacao")) {
      let inputValue = e.target.value.replace(/\D/g, "");

      if (inputValue === "") {
        e.target.value = "0,00";
        return;
      }

      const valueInCents = parseInt(inputValue, 10);
      const formattedValue = (valueInCents / 100).toFixed(2).replace(".", ",");

      e.target.value = formattedValue;
    }
  });

async function deletarTransacao(id) {
  try {
    const response = await fetch(
      `https://easy-fi-eight.vercel.app/incomes-expenses/deletarItem/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}
