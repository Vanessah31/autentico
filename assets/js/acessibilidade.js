// Autêntico — acessibilidade (aba lateral + painel)
// Tamanho do texto, alto contraste, modo calmo e fonte simples.
// As escolhas ficam salvas no navegador (localStorage) e valem para todas as páginas.

(function () {
  var CHAVE = "autentico-acessibilidade";
  var NIVEIS = [100, 112.5, 125, 150];
  var raiz = document.documentElement;

  var padrao = { nivel: 0, contraste: false, calmo: false, fonte: false };
  var estado = lerEstado();

  function lerEstado() {
    try {
      var salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (salvo && typeof salvo === "object") {
        return {
          nivel: Math.min(Math.max(parseInt(salvo.nivel, 10) || 0, 0), NIVEIS.length - 1),
          contraste: !!salvo.contraste,
          calmo: !!salvo.calmo,
          fonte: !!salvo.fonte,
        };
      }
    } catch (e) {}
    return Object.assign({}, padrao);
  }

  function salvarEstado() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch (e) {}
  }

  function aplicar() {
    raiz.style.fontSize = NIVEIS[estado.nivel] + "%";
    raiz.classList.toggle("alto-contraste", estado.contraste);
    raiz.classList.toggle("modo-calmo", estado.calmo);
    raiz.classList.toggle("fonte-simples", estado.fonte);
  }

  // aplica logo de cara, antes da página ser desenhada, para não "piscar"
  aplicar();

  var ICONE =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<circle cx="12" cy="7.2" r="1.6" fill="currentColor"/>' +
    '<path d="M6.8 9.6c3.4 1 6.6 1 10.4 0M12 10v4.2m0 0-2.6 4.3m2.6-4.3 2.6 4.3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  function opcao(id, rotulo) {
    return (
      '<button type="button" class="acess-btn acess-opcao" id="' + id + '" aria-pressed="false">' +
      "<span>" + rotulo + '</span><span class="acess-estado">Desligado</span></button>'
    );
  }

  function montar() {
    var caixa = document.createElement("div");
    caixa.className = "acess-lateral";
    caixa.setAttribute("role", "region");
    caixa.setAttribute("aria-label", "Ferramentas de acessibilidade");
    caixa.innerHTML =
      '<button type="button" class="acess-aba" id="acess-toggle" aria-expanded="false" aria-controls="painel-acess">' +
      ICONE + '<span class="acess-aba-texto">Acessibilidade</span></button>' +
      '<div class="acess-painel" id="painel-acess" role="dialog" aria-modal="false" aria-labelledby="acess-titulo" hidden>' +
      '<div class="acess-topo">' +
      '<span class="acess-titulo" id="acess-titulo">Acessibilidade</span>' +
      '<button type="button" class="acess-btn" id="acess-fechar">Fechar</button>' +
      "</div>" +
      '<div class="acess-lista">' +
      '<div class="acess-grupo" role="group" aria-labelledby="rot-texto">' +
      '<span class="rot" id="rot-texto">Tamanho do texto</span>' +
      '<button type="button" class="acess-btn" id="acess-menos" aria-label="Diminuir o tamanho do texto">A−</button>' +
      '<span class="acess-nivel" id="acess-nivel" aria-live="polite"></span>' +
      '<button type="button" class="acess-btn" id="acess-mais" aria-label="Aumentar o tamanho do texto">A+</button>' +
      "</div>" +
      opcao("acess-contraste", "Alto contraste") +
      opcao("acess-calmo", "Modo calmo") +
      opcao("acess-fonte", "Fonte simples") +
      '<button type="button" class="acess-btn" id="acess-restaurar">Restaurar padrão</button>' +
      "</div></div>";

    var pular = document.querySelector(".pular");
    if (pular && pular.nextSibling) {
      pular.parentNode.insertBefore(caixa, pular.nextSibling);
    } else {
      document.body.insertBefore(caixa, document.body.firstChild);
    }

    var toggle = document.getElementById("acess-toggle");
    var painel = document.getElementById("painel-acess");
    var btnFechar = document.getElementById("acess-fechar");
    var btnMenos = document.getElementById("acess-menos");
    var btnMais = document.getElementById("acess-mais");
    var rotNivel = document.getElementById("acess-nivel");
    var btnContraste = document.getElementById("acess-contraste");
    var btnCalmo = document.getElementById("acess-calmo");
    var btnFonte = document.getElementById("acess-fonte");
    var btnRestaurar = document.getElementById("acess-restaurar");

    function marcar(botao, ligado) {
      botao.setAttribute("aria-pressed", String(ligado));
      botao.querySelector(".acess-estado").textContent = ligado ? "Ligado" : "Desligado";
    }

    function atualizarPainel() {
      rotNivel.textContent = NIVEIS[estado.nivel] + "%";
      marcar(btnContraste, estado.contraste);
      marcar(btnCalmo, estado.calmo);
      marcar(btnFonte, estado.fonte);
    }

    function mudou() {
      aplicar();
      salvarEstado();
      atualizarPainel();
    }

    // a aba some enquanto o painel está aberto (os dois ficam na mesma borda)
    function abrir() {
      painel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.hidden = true;
      btnFechar.focus();
    }

    function fechar(devolverFoco) {
      painel.hidden = true;
      toggle.hidden = false;
      toggle.setAttribute("aria-expanded", "false");
      if (devolverFoco) toggle.focus();
    }

    toggle.addEventListener("click", abrir);
    btnFechar.addEventListener("click", function () { fechar(true); });

    caixa.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !painel.hidden) fechar(true);
    });

    // clicar fora do painel também fecha
    document.addEventListener("click", function (e) {
      if (!painel.hidden && !caixa.contains(e.target)) fechar(false);
    });

    btnMenos.addEventListener("click", function () {
      if (estado.nivel > 0) { estado.nivel--; mudou(); }
    });
    btnMais.addEventListener("click", function () {
      if (estado.nivel < NIVEIS.length - 1) { estado.nivel++; mudou(); }
    });
    btnContraste.addEventListener("click", function () { estado.contraste = !estado.contraste; mudou(); });
    btnCalmo.addEventListener("click", function () { estado.calmo = !estado.calmo; mudou(); });
    btnFonte.addEventListener("click", function () { estado.fonte = !estado.fonte; mudou(); });
    btnRestaurar.addEventListener("click", function () {
      estado = Object.assign({}, padrao);
      mudou();
    });

    atualizarPainel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montar);
  } else {
    montar();
  }
})();
