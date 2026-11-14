// Autêntico — liga os botões de entrada do fórum quando o endereço do serviço existe.
// O endereço vem de assets/js/config.js (window.AUTENTICO_FORUM_URL).
(function () {
  function enderecoValido(valor) {
    if (typeof valor !== "string") return null;
    var url = valor.trim();
    if (!url) return null;
    var seguro = /^https:\/\/[^\s/]+/i.test(url);
    var local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url);
    if (!seguro && !local) {
      if (window.console) console.warn("AUTENTICO_FORUM_URL ignorado: use um endereço que comece com https://");
      return null;
    }
    return url.replace(/\/+$/, "") + "/";
  }

  var base = enderecoValido(window.AUTENTICO_FORUM_URL);
  if (!base) return; // sem endereço: fica o texto "O cadastro abre em breve"

  var texto = document.getElementById("entrada-texto");
  var botoes = document.getElementById("entrada-botoes");
  var aviso = document.getElementById("aviso-servico");
  if (!texto || !botoes) return;

  document.getElementById("link-cadastro").href = base + "cadastro";
  document.getElementById("link-login").href = base + "login";
  document.getElementById("link-forum").href = base + "forum";

  texto.textContent =
    "Crie uma conta para publicar. Toda publicação é revisada pela equipe antes de aparecer, e você pode usar um apelido.";
  botoes.hidden = false;

  if (aviso) {
    aviso.textContent =
      "O fórum de verdade já está no ar: use os botões acima. As publicações desta página continuam sendo só exemplos.";
  }
})();
