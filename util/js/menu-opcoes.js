var usuario = JSON.parse(localStorage.getItem("contaLogada"));
var produtos;

class Info {
  constructor(id) {
    this.id = id;
    this.compras = [];
    this.alertas = [];
  }
}

function saveVetor() {
  var vetor = JSON.parse(localStorage.getItem("vetor"));

  if (vetor == null) {
    let vetor = [];
    localStorage.setItem("vetor", JSON.stringify(vetor));
  }

  vetor = JSON.parse(localStorage.getItem("vetor"));

  if (vetor.length === 0) {
    let info = new Info(usuario.id);
    vetor.push(info);
    localStorage.setItem("vetor", JSON.stringify(vetor));
  } else if (vetor.find((info) => info.id == usuario.id) == null) {
    let info = new Info(usuario.id);
    vetor.push(info);
    localStorage.setItem("vetor", JSON.stringify(vetor));
  }
}

$(document).ready(function () {
  $("#nomeLogin").text(usuario.nome);

  loadProdutos();
  loadPreco();
  saveVetor();
});

async function loadProdutos() {
  try {
    let resp = await fetch(
      "https://api-odinline.odiloncorrea.com/produto/" +
        usuario.chave +
        "/usuario "
    );
    produtos = await resp.json();

    produtos.forEach((produto) => {
      var novaOp = $("<option />", {
        value: produto.id,
        text: produto.descricao,
      });

      $("#listProdutos").append(novaOp);
    });
  } catch (error) {}
}

function loadPreco() {
  let valor = $("#listProdutos").val();
  let produto;
  if (valor == null) {
    $("#precoAProduto").attr("placeholder", "...");
  } else {
    produto = produtos.find((produto) => produto.id == valor);
    $("#precoAProduto").attr("value", "R$" + produto.valor);
    loadRange(produto);
  }
}

function alteraModo(valor) {
  if (!valor) return;

  const opDuo = document.getElementById("opDuo");
  const opAlerta = document.getElementById("opAlerta");
  const btnAcaoC = document.getElementById("btnAcaoC");
  const btnAcaoA = document.getElementById("btnAcaoA");

  opDuo.style.display = "block";
  if (valor === 1) {
    opAlerta.style.display = "none";
    btnAcaoC.style.display = "inline-block";
    btnAcaoA.style.display = "none";
  } else if (valor === 2) {
    opAlerta.style.display = "block";
    btnAcaoC.style.display = "none";
    btnAcaoA.style.display = "inline-block";
  }
}


function loadRange(produto) {
  $("#limiteRange").attr("max", parseFloat(produto.valor) + 1000);
  $("#limiteRange").attr("value", parseFloat(produto.valor));

  $("#precoLProduto").val("R$" + parseFloat(produto.valor));
}

function atualizaRange() {
  let v = $("#limiteRange").val();

  $("#precoLProduto").val("R$" + $("#limiteRange").val());
}

function realizarCompra() {
  let produto = produtos.find(
    (produto) => produto.id == $("#listProdutos").val()
  );

  let item = produto;

  item.valorComprado = $("#precoAProduto").val();

  let vetor = JSON.parse(localStorage.getItem("vetor"));

  let info = vetor.find((info) => info.id == usuario.id);

  info.compras.push(item);

  localStorage.setItem("vetor", JSON.stringify(vetor));

  alert("Compra Registrada!");

  window.location.reload();
}

function logout() {
  localStorage.removeItem("contaLogada");
  window.location.href = "../index.html";
}

class Alerta {
  constructor(idItem, valorLimite) {
    this.idItem = idItem;
    this.valorLimite = valorLimite;
  }
}

function registrarAlerta() {
  let produtoId = $("#listProdutos").val();
  let precoLimite = $("#limite-preco").val();
  
  if (!produtoId || !precoLimite) {
    alert("Preencha todos os campos!");
    return;
  }

  let alerta = new Alerta(produtoId, "R$" + precoLimite);

  let vetor = JSON.parse(localStorage.getItem("vetor"));
  let info = vetor.find((info) => info.id == usuario.id);
  
  if (!info.alertas) {
    info.alertas = [];
  }
  
  info.alertas.push(alerta);
  localStorage.setItem("vetor", JSON.stringify(vetor));

  alert("Alerta registrado!");
  window.location.reload();
}


