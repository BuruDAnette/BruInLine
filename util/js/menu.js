var usuario = JSON.parse(localStorage.getItem("contaLogada"));

$(document).ready(function () {
    if (!usuario) {
        window.location.href = "index.html";
        return;
    }
    
    $("#nomeLogin").text(usuario.nome);
    verificaAlerta();
    
    $('[data-bs-toggle="tooltip"]').tooltip();
});

function logout() {
    localStorage.removeItem("contaLogada");
    window.location.href = "index.html";
}