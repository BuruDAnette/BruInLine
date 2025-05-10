var usuario = JSON.parse(localStorage.getItem("contaLogada"));

$(document).ready(function () {
  $("#nomeLogin").text(usuario.nome);
  loadAlertas();
});

async function loadAlertas() {
  let vetor = JSON.parse(localStorage.getItem("vetor"));
  let tbody = $("#tabelaAlertas tbody");
  tbody.empty();

  if (!vetor) {
    tbody.append("<tr><td colspan='3' class='text-center'>Você não possui alertas registrados</td></tr>");
    return;
  }

  let info = vetor.find(info => info.id == usuario.id);

  if (!info || !info.alertas || info.alertas.length === 0) {
    tbody.append("<tr><td colspan='3' class='text-center'>Você não possui alertas registrados</td></tr>");
    return;
  }

  for (let alerta of info.alertas) {
    await adicionarLinha(alerta);
  }
}

async function adicionarLinha(alerta) {
  try {
    let resp = await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.idItem}`);
    let produto = await resp.json();

    // Extrai o valor numérico removendo "R$" e convertendo para float
    let valorLimiteStr = alerta.valorLimite.replace("R$", "").trim();
    let precoDesejado = parseFloat(valorLimiteStr);
    let precoAtual = parseFloat(produto.valor);

    let linha = `
      <tr>
        <td>${produto.descricao || "---"}</td>
        <td>${isNaN(precoDesejado) ? '---' : `R$${precoDesejado.toFixed(2)}`}</td>
        <td>${isNaN(precoAtual) ? '---' : `R$${precoAtual.toFixed(2)}`}</td>
      </tr>
    `;

    $("#tabelaAlertas tbody").append(linha);
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
  }
}

function logout() {
  localStorage.removeItem("contaLogada");
  window.location.href = "../index.html";
}

function voltarPagina() {
    history.back();
}
