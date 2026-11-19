# Autêntico — Site Estático (MVP para GitHub Pages)

Plataforma de apoio ao diagnóstico tardio de TEA — versão estática (HTML/CSS/JS),
criada para publicação no GitHub Pages como entrega do MVP.

**Site no ar:** https://vanessah31.github.io/autentico/

## Autoria e equipe

Projeto da disciplina **Laboratório de Inovação IV** (Análise e Desenvolvimento de Sistemas, Faculdade Senac DF), com orientação da professora **Maristela Oliveira**.

- **Desenvolvimento do site e do fórum: Vanessa Sousa da Silva** ([@Vanessah31](https://github.com/Vanessah31)). Código em HTML, CSS e JavaScript (site), Flask e SQLite/MySQL (fórum), teste AQ-10 e recursos de acessibilidade.
- **Equipe do projeto:** Cicera Taysa de Freitas Batista, Vanessa Sousa da Silva e Verônica Alves.

© 2026 Equipe Autêntico. Todos os direitos reservados. O conteúdo e o código não podem ser copiados ou republicados sem autorização das autoras.

## Sobre esta versão

Esta é uma versão **estática** do projeto Autêntico, sem backend real — feita
especificamente para rodar no GitHub Pages, que não executa Python/Flask nem
conecta a bancos de dados.

- O **teste AQ-10** funciona de verdade: a pontuação é calculada em JavaScript,
  no navegador (arquivo `assets/js/aq10.js`), usando a mesma lógica da versão
  Flask do projeto.
- A página **Onde Buscar Ajuda** tem filtro funcional (SUS/Particular/Associação),
  também em JavaScript.
- O **Fórum** exibe posts de exemplo (estáticos) para demonstrar a interface —
  a versão com cadastro, publicação e denúncia real está implementada no
  backend Flask + MySQL do projeto (ver repositório principal).

A versão completa, com Flask, MySQL, cadastro de usuários e fórum funcional
de verdade, está documentada separadamente e é a versão "de produção" do
projeto — esta aqui cobre a exigência de publicação no GitHub Pages.

## Acessibilidade

O site foi pensado para um público que inclui pessoas autistas, então a acessibilidade faz parte do projeto:

- **Aba de acessibilidade** em todas as páginas, na lateral direita da tela (no celular vira um botão redondo no canto): aumentar e diminuir o texto (100% a 150%), alto contraste, modo calmo (menos cor e sem movimento), fonte simples e restaurar padrão. As escolhas ficam salvas no navegador (`assets/js/acessibilidade.js`).
- **Navegação por teclado**: link "Pular para o conteúdo", foco sempre visível e alvos de toque de pelo menos 44 px.
- **Leitores de tela**: página principal marcada (`main`), um `h1` por página, menu com a página atual indicada (`aria-current`), filtros que avisam quantos itens aparecem e erros do teste anunciados.
- **Teste AQ-10**: o foco acompanha a troca de tela, as perguntas não respondidas são indicadas com texto (não só com cor) e a barra de progresso é lida pelo leitor de tela.
- **Contraste** das cores principais acima de 4,5:1 (nível AA do WCAG 2.1) e respeito à preferência de sistema "reduzir movimento".
- Verificação automática com `axe-core` nas sete páginas, sem violações encontradas.

## Como ligar o fórum quando ele estiver no ar

O fórum de verdade é um serviço separado (Flask + MySQL, na pasta `autentico-forum`) e precisa ser hospedado num servidor. Enquanto isso não acontece, a página `forum.html` mostra "O cadastro abre em breve".

Quando o serviço estiver no ar, **edite um único arquivo**, `assets/js/config.js`, e cole o endereço dele:

```js
window.AUTENTICO_FORUM_URL = "https://seu-forum.exemplo.com/";
```

Os botões "Cadastrar", "Entrar" e "Ir para o fórum" aparecem sozinhos na página. Só são aceitos endereços que começam com `https://` (ou `http://localhost`, para testes).

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `autentico`).
2. Faça upload de todos os arquivos desta pasta para o repositório
   (mantendo a estrutura: `index.html` na raiz, pasta `assets/` junto).
3. No repositório, vá em **Settings > Pages**.
4. Em "Source", selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
5. Clique em **Save**.
6. Aguarde 1-2 minutos — o GitHub vai gerar um link parecido com:
   `https://seu-usuario.github.io/autentico/`
7. Esse é o link que você envia no Moodle.

## Estrutura de arquivos

```
autentico-site/
├── index.html              → Página inicial
├── sobre-tea.html           → Sobre o TEA / Diagnóstico Tardio
├── teste-aq10.html          → Teste de rastreio (funcional)
├── onde-buscar-ajuda.html   → Diretório de recursos (Brasília/DF)
├── forum.html                → Fórum (demonstração estática)
├── vivencias.html            → Vozes & Vivências
├── quem-somos.html           → Equipe e motivação do projeto
├── assets/
│   ├── css/style.css         → Estilos de todo o site
│   └── js/
│       ├── aq10.js           → Lógica do teste AQ-10
│       ├── acessibilidade.js → Aba de acessibilidade
│       ├── config.js         → Endereço do fórum (cole aqui quando estiver no ar)
│       └── forum-entrada.js  → Liga os botões de cadastro do fórum
└── README.md
```

## Observação importante

Antes de publicar, revisar com a professora orientadora o texto da seção
"Quem Somos" — a versão aqui já foi escrita sem mencionar detalhes pessoais
específicos que não foram formalmente autorizados para divulgação pública.


## Libras (VLibras)

Todas as páginas carregam o plugin gratuito **VLibras** (governo federal), que traduz automaticamente o texto selecionado para Libras com um avatar. O botão aparece no lado esquerdo da tela. A tradução é automática e pode errar em termos técnicos; ela não substitui um intérprete humano. Precisa de internet. Para remover, apague o bloco `<div vw>` e os dois `<script>` do final de cada página.
