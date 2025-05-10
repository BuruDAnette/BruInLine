async function verificaUsuario() {
  const login = $("#login").val().trim();
  const senha = $("#senha").val().trim();

  const $btn = $("#loginBtn");
  const $loginInput = $("#login");
  const $senhaInput = $("#senha");

  $("#loginError").addClass("d-none").text("");
  $("#senhaError").addClass("d-none").text("");
  $loginInput.removeClass("is-invalid is-valid");
  $senhaInput.removeClass("is-invalid is-valid");

  let erro = false;

  if (login === "") {
    $("#loginError").text("Digite o login").removeClass("d-none");
    $loginInput.addClass("is-invalid");
    erro = true;
  }

  if (senha === "") {
    $("#senhaError").text("Digite a senha").removeClass("d-none");
    $senhaInput.addClass("is-invalid");
    erro = true;
  }

  if (erro) return;

  $btn.prop("disabled", true);
  $btn.html(`<span class="spinner-border spinner-border-sm me-2" role="status"></span> Autenticando...`);

  try {
    let resp = await fetch(
      "https://api-odinline.odiloncorrea.com/usuario/" + encodeURIComponent(login) + "/" +
        encodeURIComponent(senha) + "/autenticar"
    );

    let usuario = await resp.json();

    if (usuario.id) {
      $loginInput.addClass("is-valid");
      $senhaInput.addClass("is-valid");

      $btn.html(`Autenticado`);
      
      setTimeout(() => {
        localStorage.setItem("contaLogada", JSON.stringify(usuario));
        window.location.href = "../menu.html";
      }, 1000);
    } else {
      $("#loginError").text("Usuário inválido ou não encontrado").removeClass("d-none");
      $("#senhaError").text("Senha incorreta").removeClass("d-none");
      $loginInput.addClass("is-invalid");
      $senhaInput.addClass("is-invalid");
      $btn.html(`Entrar`).prop("disabled", false);
    }
  } catch (error) {
    $("#loginError").text("Erro ao conectar ao servidor").removeClass("d-none");
    $loginInput.addClass("is-invalid");
    $btn.html(`Entrar`).prop("disabled", false);
  }
}
