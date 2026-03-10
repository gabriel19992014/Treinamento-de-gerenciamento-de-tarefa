// Seletores centralizados
const elements = {
  form: document.getElementById("formTarefa"),
  tarefa: document.getElementById("tarefa"),
  descricao: document.getElementById("descricao"),
  data: document.getElementById("data"),
  prioridade: document.getElementById("prioridade"),
  dataArea: document.getElementById("dataArea"),
};

// Função utilitária para criar elementos
function criarElemento(tag, texto = "", classe = "") {
  const el = document.createElement(tag);
  if (texto) el.textContent = texto;
  if (classe) el.classList.add(classe);
  return el;
}

// Função para montar uma tarefa
function criarTarefa({ titulo, descricao, data, prioridade, concluida = false }) {
  const tarefaDiv = criarElemento("div", "", "tarefa");
  tarefaDiv.classList.add(prioridade.toLowerCase());

  const tituloEl = criarElemento("h3", titulo);
  const descricaoEl = criarElemento("p", `Descrição: ${descricao}`);
  const dataEl = criarElemento("p", `Vencimento: ${data}`);
  const prioridadeEl = criarElemento("p", `Prioridade: ${prioridade}`);

  const checkbox = criarElemento("input");
  checkbox.type = "checkbox";
  checkbox.checked = concluida;
  if (concluida) tarefaDiv.classList.add("concluida");

  checkbox.addEventListener("change", () => {
    tarefaDiv.classList.toggle("concluida", checkbox.checked);
    salvarTarefas();
  });

  const btnRemover = criarElemento("button", "Remover");
  btnRemover.addEventListener("click", () => {
    tarefaDiv.remove();
    salvarTarefas();
  });

  tarefaDiv.append(checkbox, tituloEl, descricaoEl, dataEl, prioridadeEl, btnRemover);
  elements.dataArea.appendChild(tarefaDiv);
}

// Função principal
function adicionarTarefa(e) {
  e.preventDefault(); // evita recarregar a página

  const titulo = elements.tarefa.value.trim();
  const descricao = elements.descricao.value.trim();
  const data = elements.data.value.trim();
  const prioridade = elements.prioridade.value;

  if (!titulo || !descricao || !data) {
    alert("Preencha todos os campos!");
    return;
  }

  criarTarefa({ titulo, descricao, data, prioridade });
  salvarTarefas();

  // Limpa todos os campos do formulário de uma vez
  elements.form.reset();
}

// Função para salvar tarefas
function salvarTarefas() {
  const tarefas = [];
  document.querySelectorAll(".tarefa").forEach(tarefaDiv => {
    const titulo = tarefaDiv.querySelector("h3").textContent;
    const descricao = tarefaDiv.querySelector("p:nth-of-type(1)").textContent.replace("Descrição: ", "");
    const data = tarefaDiv.querySelector("p:nth-of-type(2)").textContent.replace("Vencimento: ", "");
    const prioridade = tarefaDiv.querySelector("p:nth-of-type(3)").textContent.replace("Prioridade: ", "");
    const concluida = tarefaDiv.classList.contains("concluida");

    tarefas.push({ titulo, descricao, data, prioridade, concluida });
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Função para carregar tarefas salvas
function carregarTarefas() {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.forEach(tarefa => criarTarefa(tarefa));
}

// Evento do formulário
elements.form.addEventListener("submit", adicionarTarefa);

// Carregar tarefas ao abrir a página
window.addEventListener("load", carregarTarefas);