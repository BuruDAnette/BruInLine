usuario = JSON.parse(localStorage.getItem("contaLogada"));

$(document).ready(function () {
  $("#nomeLogin").text(usuario.nome);
  loadCompras();
});

function loadCompras() {
  let vetor = JSON.parse(localStorage.getItem("vetor"));

  if (!vetor) {
    var tabela = $("#tabelaCompras");
    var linha = $("<caption> Você não possui compras registradas</caption>");
    tabela.append(linha);
    return;
  }

  let info = vetor.find((info) => info.id == usuario.id);
  
  if (!info || !info.compras || info.compras.length == 0) {
    var tabela = $("#tabelaCompras");
    var linha = $("<caption> Você não possui compras registradas</caption>");
    tabela.append(linha);
  } else {
    info.compras.forEach((compra) => {
      adicionarLinha(compra);
    });
  }
}

async function adicionarLinha(compra) {
  var tbody = $("#tabelaCompras").find("tbody");
  var linha = $("<tr></tr>");

  $("<td></td>").text(compra.descricao).appendTo(linha);
  $("<td></td>").text(compra.valorComprado).appendTo(linha);

  try {
    let resp = await fetch(
      "https://api-odinline.odiloncorrea.com/produto/" + compra.id
    );
    let item = await resp.json();

    $("<td></td>")
      .text("R$" + item.valor)
      .appendTo(linha);
  } catch (error) {}

  tbody.append(linha);
}

function logout() {
  localStorage.removeItem("contaLogada");
  window.location.href = "../index.html";
}

function voltarPagina() {
    history.back();
}
