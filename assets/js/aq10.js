// Autêntico — Teste de rastreio AQ-10 (versão estática, sem backend)
// Texto das perguntas: tradução para o português do Brasil do AQ-10 Adult
// (Instituto de Pesquisas Neuropsiquiátricas, SUAV – Waldir Toledo, 2020).

const PERGUNTAS = [
  "Costumo notar pequenos sons quando outros não percebem",
  "Eu geralmente me concentro mais no todo de uma imagem, ao invés de pequenos detalhes",
  "Acho fácil fazer mais de uma coisa de uma só vez",
  "Se houver uma interrupção, posso voltar para o que eu estava fazendo muito rápido",
  "Acho fácil “ler nas entrelinhas” quando alguém está falando comigo",
  "Eu sei dizer se alguém que está me ouvindo está ficando entediado",
  "Quando estou lendo uma história, acho difícil descobrir as intenções dos personagens",
  "Gosto de coletar informações sobre categorias de coisas (por exemplo, tipos de carro, tipos de pássaros, tipos de trem, tipos de planta, etc.)",
  "Acho que é fácil descobrir o que alguém está pensando ou sentindo apenas olhando para o rosto da pessoa",
  "Acho difícil entender as intenções das pessoas",
];

// As quatro opções de resposta do teste original, na mesma ordem
const OPCOES = [
  { valor: "cp",  rotulo: "Concordo plenamente" },
  { valor: "cpa", rotulo: "Concordo parcialmente" },
  { valor: "dpa", rotulo: "Discordo parcialmente" },
  { valor: "dp",  rotulo: "Discordo plenamente" },
];

// Pontuação (apenas 1 ponto por pergunta). Índices em base 0:
// itens 1, 7, 8 e 10 pontuam com "concordo" (plenamente ou parcialmente)
const PONTUA_CONCORDO = new Set([0, 6, 7, 9]);
// itens 2, 3, 4, 5, 6 e 9 pontuam com "discordo" (plenamente ou parcialmente)
const PONTUA_DISCORDO = new Set([1, 2, 3, 4, 5, 8]);

const concorda = (v) => v === "cp" || v === "cpa";
const discorda = (v) => v === "dp" || v === "dpa";

// respostas: lista com 10 valores ("cp", "cpa", "dpa" ou "dp")
function calcularPontuacao(respostas) {
  let pontuacao = 0;
  respostas.forEach((resposta, i) => {
    if (PONTUA_CONCORDO.has(i) && concorda(resposta)) pontuacao++;
    if (PONTUA_DISCORDO.has(i) && discorda(resposta)) pontuacao++;
  });
  return pontuacao;
}

const checkEntendi = document.getElementById("check-entendi");
const btnContinuar = document.getElementById("btn-continuar");
const erroAviso = document.getElementById("erro-aviso");
const telaDisclaimer = document.getElementById("tela-disclaimer");
const telaTeste = document.getElementById("tela-teste");
const listaPerguntas = document.getElementById("lista-perguntas");
const progressTrack = document.querySelector(".progress-track");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const erroTeste = document.getElementById("erro-teste");
const resultadoBox = document.getElementById("resultado-box");
const pontuacaoValor = document.getElementById("pontuacao-valor");
const resultadoTexto = document.getElementById("resultado-texto");

// leva o foco (e a leitura do leitor de tela) para o título da nova tela
function irPara(elemento) {
  elemento.focus({ preventScroll: true });
  elemento.scrollIntoView({ behavior: "smooth", block: "start" });
}

checkEntendi.addEventListener("change", () => {
  erroAviso.hidden = true;
});

btnContinuar.addEventListener("click", () => {
  if (!checkEntendi.checked) {
    erroAviso.textContent = "Marque a caixa acima para continuar.";
    erroAviso.hidden = false;
    checkEntendi.focus();
    return;
  }
  telaDisclaimer.hidden = true;
  telaTeste.hidden = false;
  montarPerguntas();
  irPara(document.getElementById("titulo-teste"));
});

function montarPerguntas() {
  listaPerguntas.innerHTML = "";

  PERGUNTAS.forEach((texto, i) => {
    const linha = document.createElement("div");
    linha.className = "aq-linha";
    linha.setAttribute("role", "radiogroup");
    linha.setAttribute("aria-labelledby", `enunciado-${i}`);
    linha.dataset.indice = i;

    const enunciado = document.createElement("p");
    enunciado.className = "aq-enunciado";
    enunciado.id = `enunciado-${i}`;
    enunciado.textContent = `${i + 1}. ${texto}`;
    linha.appendChild(enunciado);

    OPCOES.forEach((opcao) => {
      const label = document.createElement("label");
      label.className = "aq-cel";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `p${i}`;
      input.value = opcao.valor;

      const rotulo = document.createElement("span");
      rotulo.className = "aq-rotulo";
      rotulo.textContent = opcao.rotulo;

      label.appendChild(input);
      label.appendChild(rotulo);
      linha.appendChild(label);
    });

    listaPerguntas.appendChild(linha);
  });

  listaPerguntas.addEventListener("change", (e) => {
    const linha = e.target.closest(".aq-linha");
    if (linha) limparAvisoDaLinha(linha);
    erroTeste.hidden = true;
    atualizarProgresso();
  });
}

function respostaDe(i) {
  const marcada = document.querySelector(`input[name="p${i}"]:checked`);
  return marcada ? marcada.value : null;
}

function atualizarProgresso() {
  const respondidas = PERGUNTAS.filter((_, i) => respostaDe(i) !== null).length;
  const texto = `${respondidas} de ${PERGUNTAS.length} respondidas`;

  progressFill.style.width = (respondidas / PERGUNTAS.length) * 100 + "%";
  progressLabel.textContent = texto;
  progressTrack.setAttribute("aria-valuenow", String(respondidas));
  progressTrack.setAttribute("aria-valuetext", texto);
}

function limparAvisoDaLinha(linha) {
  linha.classList.remove("falta");
  const aviso = linha.querySelector(".aq-aviso-linha");
  if (aviso) aviso.remove();
}

function marcarFaltantes(indices) {
  indices.forEach((i) => {
    const linha = listaPerguntas.querySelector(`.aq-linha[data-indice="${i}"]`);
    if (!linha || linha.classList.contains("falta")) return;
    linha.classList.add("falta");
    const aviso = document.createElement("p");
    aviso.className = "aq-aviso-linha";
    aviso.textContent = "Responda esta pergunta.";
    linha.appendChild(aviso);
  });
}

telaTeste.addEventListener("submit", (e) => {
  e.preventDefault();

  const faltantes = [];
  PERGUNTAS.forEach((_, i) => {
    if (respostaDe(i) === null) faltantes.push(i);
  });

  if (faltantes.length > 0) {
    marcarFaltantes(faltantes);
    const n = faltantes.length;
    erroTeste.textContent =
      n === 1
        ? "Falta 1 pergunta. Responda todas para ver o resultado."
        : `Faltam ${n} perguntas. Responda todas para ver o resultado.`;
    erroTeste.hidden = false;

    const primeira = listaPerguntas.querySelector(
      `.aq-linha[data-indice="${faltantes[0]}"] input`
    );
    if (primeira) {
      primeira.focus({ preventScroll: true });
      primeira.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const respostas = PERGUNTAS.map((_, i) => respostaDe(i));
  const pontuacao = calcularPontuacao(respostas);

  telaTeste.hidden = true;
  pontuacaoValor.textContent = pontuacao;

  if (pontuacao >= 6) {
    resultadoTexto.textContent =
      "No AQ-10 original, a partir de 6 pontos recomenda-se considerar uma avaliação diagnóstica especializada. Isso não é um diagnóstico, é só um indicativo de que pode valer a pena conversar com um profissional.";
  } else {
    resultadoTexto.textContent =
      "Isso está abaixo do ponto de corte do teste (6 pontos). Mesmo assim, se você sente que algo na sua experiência de vida ainda não foi explicado, buscar uma conversa com um profissional continua sendo uma opção válida — o autoconhecimento não depende de número.";
  }

  resultadoBox.hidden = false;
  irPara(document.getElementById("titulo-resultado"));
});
