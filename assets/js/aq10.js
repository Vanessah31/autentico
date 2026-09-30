// Autêntico — Lógica do teste de rastreio AQ-10 (versão estática, sem backend)

const PERGUNTAS = [
  "Costumo notar pequenos sons quando outras pessoas não percebem.",
  "Geralmente me concentro mais no todo de uma situação do que em pequenos detalhes.",
  "Acho fácil fazer mais de uma coisa ao mesmo tempo.",
  "Se houver uma interrupção, consigo voltar rapidamente para o que eu estava fazendo.",
  "Acho fácil \"ler nas entrelinhas\" quando alguém está falando comigo.",
  "Eu sei dizer quando alguém que está me ouvindo está ficando entediado.",
  "Quando estou lendo uma história, acho difícil descobrir as intenções dos personagens.",
  "Gosto de coletar informações sobre categorias de coisas (tipos de carro, pássaros, plantas etc.).",
  "Acho fácil descobrir o que alguém está pensando ou sentindo apenas olhando para o rosto da pessoa.",
  "Acho difícil entender as intenções das outras pessoas.",
];

// índices (base 0) em que "concordo" pontua
const PONTUA_CONCORDO = new Set([0, 6, 7, 9]);
// índices (base 0) em que "discordo" pontua
const PONTUA_DISCORDO = new Set([1, 2, 3, 4, 5, 8]);

const checkEntendi = document.getElementById("check-entendi");
const btnContinuar = document.getElementById("btn-continuar");
const telaDisclaimer = document.getElementById("tela-disclaimer");
const telaTeste = document.getElementById("tela-teste");
const listaPerguntas = document.getElementById("lista-perguntas");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const btnVerResultado = document.getElementById("btn-ver-resultado");
const resultadoBox = document.getElementById("resultado-box");
const pontuacaoValor = document.getElementById("pontuacao-valor");
const resultadoTexto = document.getElementById("resultado-texto");

checkEntendi.addEventListener("change", () => {
  btnContinuar.disabled = !checkEntendi.checked;
});

btnContinuar.addEventListener("click", () => {
  telaDisclaimer.style.display = "none";
  telaTeste.style.display = "block";
  montarPerguntas();
});

function montarPerguntas() {
  PERGUNTAS.forEach((texto, i) => {
    const div = document.createElement("div");
    div.className = "pergunta";
    div.innerHTML = `
      <p class="enunciado">${i + 1}. ${texto}</p>
      <div class="opcoes">
        <label><input type="radio" name="p${i}" value="concordo" required> Concordo</label>
        <label><input type="radio" name="p${i}" value="discordo"> Discordo</label>
      </div>
    `;
    listaPerguntas.appendChild(div);
  });

  listaPerguntas.addEventListener("change", atualizarProgresso);
}

function atualizarProgresso() {
  const respondidas = PERGUNTAS.filter(
    (_, i) => document.querySelector(`input[name="p${i}"]:checked`)
  ).length;

  const pct = (respondidas / PERGUNTAS.length) * 100;
  progressFill.style.width = pct + "%";
  progressLabel.textContent = `${respondidas} de ${PERGUNTAS.length} respondidas`;
  btnVerResultado.disabled = respondidas < PERGUNTAS.length;
}

document.getElementById("tela-teste").addEventListener("submit", (e) => {
  e.preventDefault();

  let pontuacao = 0;
  PERGUNTAS.forEach((_, i) => {
    const resposta = document.querySelector(`input[name="p${i}"]:checked`).value;
    if (PONTUA_CONCORDO.has(i) && resposta === "concordo") pontuacao++;
    if (PONTUA_DISCORDO.has(i) && resposta === "discordo") pontuacao++;
  });

  document.getElementById("tela-teste").style.display = "none";
  pontuacaoValor.textContent = pontuacao;

  if (pontuacao >= 6) {
    resultadoTexto.textContent =
      "Pontuações a partir de 6 sugerem que pode valer a pena conversar com um profissional especializado sobre uma avaliação mais completa. Lembre-se: isso não é um diagnóstico, é só um indicativo.";
  } else {
    resultadoTexto.textContent =
      "Isso está dentro da média geral, mas se você sente que algo em sua experiência de vida ainda não foi explicado, buscar uma conversa com um profissional continua sendo uma opção válida — o autoconhecimento não depende de número.";
  }

  resultadoBox.style.display = "block";
  resultadoBox.scrollIntoView({ behavior: "smooth" });
});
