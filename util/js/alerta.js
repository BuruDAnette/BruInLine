var usuario = JSON.parse(localStorage.getItem("contaLogada"));
$(document).ready(function () {
  $("#nomeLogin").text(usuario.nome);
  loadCompras();
});
$(document).ready(function() {
  if (!verificaLogin()) return;
  
  iniciarMonitoramento();
});

function verificaLogin() {
  if (!usuario) {
    alert("Você precisa fazer login para acessar!");
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function iniciarMonitoramento() {
  verificaAlertas(); 
  setInterval(verificaAlertas, 5000); 
}

async function verificaAlertas() {
  try {
    const vetor = JSON.parse(localStorage.getItem("vetor")) || [];
    const info = vetor.find(info => info.id === usuario.id);
    
    if (!info?.alertas?.length) return;

    for (let i = info.alertas.length - 1; i >= 0; i--) {
      const alerta = info.alertas[i];
      const produto = await buscarProduto(alerta.idItem);
      
      if (produto && produto.valor <= parseValor(alerta.valorLimite)) {
        mostrarNotificacao(produto, alerta.valorLimite);
        info.alertas.splice(i, 1); 
        localStorage.setItem("vetor", JSON.stringify(vetor));
      }
    }
  } catch (error) {
    console.error("Erro ao verificar alertas:", error);
  }
}

async function buscarProduto(id) {
  try {
    const response = await fetch(`https://api-odinline.odiloncorrea.com/produto/${id}`);
    if (!response.ok) throw new Error("Produto não encontrado");
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return null;
  }
}

function parseValor(valorStr) {
  return parseFloat(valorStr.replace("R$", "").replace(",", ".").trim());
}

function mostrarNotificacao(produto, valorLimite) {
  const toastHtml = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-primary text-white">
          <strong class="me-auto"><i class="bi bi-bell-fill"></i> Alerta de Preço</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          <p>O produto <strong>${produto.descricao}</strong> atingiu seu preço alvo!</p>
          <div class="d-flex justify-content-between">
            <span>Preço atual: <strong>R$${produto.valor}</strong></span>
            <span>Limite: <strong>${valorLimite}</strong></span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const toastElement = $(toastHtml).appendTo('body');
  setTimeout(() => toastElement.remove(), 5000);
}

function verComprass() {
  window.location.href = "menu-opcoes.html";
}