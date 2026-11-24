/**
 * DEVPULSE AGILE KANBAN - LÓGICA JAVASCRIPT ES6+
 * Disciplina: Frameworks Front-End | SENAI
 * Docente: Prof. Me. Deivison S. Takatu
 */

const STORAGE_KEY = 'devpulse_kanban_tasks_v1';

// Tarefas padrão alinhadas ao cronograma pedagógico da disciplina
const DEFAULT_TASKS = [
  {
    id: 'TASK-01',
    title: 'Setup do Repositório Git e Aplicação Vanilla JS',
    desc: 'Dado o ambiente Node configurado, quando criar a aplicação Vanilla JS com LocalStorage, então versionar e preparar para deploy na Vercel.',
    column: 'done',
    points: 3,
    priority: 'Must Have',
    module: 'Core UI',
    assignee: 'Letícia Vieira'
  },
  {
    id: 'TASK-02',
    title: 'Box Model Externo (20 Elementos) & 20 Regras Flexbox',
    desc: 'Dado o layout responsivo, quando estruturar 20 elementos com Content/Padding/Border/Margin e 20 propriedades Flexbox, então validar responsividade.',
    column: 'done',
    points: 5,
    priority: 'Must Have',
    module: 'Core UI',
    assignee: 'Letícia Vieira'
  },
  {
    id: 'TASK-03',
    title: 'Dashboard Analítico com 30+ Classes Tailwind CSS',
    desc: 'Dado o CDN Tailwind v4, quando construir o painel analítico com classes utilitárias categorizadas, então documentar equivalentes em CSS nativo.',
    column: 'review',
    points: 5,
    priority: 'Must Have',
    module: 'Tailwind',
    assignee: 'Time Front-End'
  },
  {
    id: 'TASK-04',
    title: 'Servidor RESTful Express.js com CRUD e data.json',
    desc: 'Dado o backend Node, quando expor rotas /api/notes com middlewares CORS e body-parser, então persistir as notas em arquivo JSON.',
    column: 'in-progress',
    points: 5,
    priority: 'Must Have',
    module: 'Express API',
    assignee: 'Time Back-End'
  },
  {
    id: 'TASK-05',
    title: 'Single Page Application React com Virtual DOM e Props',
    desc: 'Dado o setup React, quando criar componentes reutilizáveis, renderizar coleções com keys e renderização condicional, então documentar ciclo de vida.',
    column: 'sprint-backlog',
    points: 8,
    priority: 'Must Have',
    module: 'React App',
    assignee: 'Time Front-End'
  },
  {
    id: 'TASK-06',
    title: 'Consumo de APIs via Fetch API e Rotas com React Router',
    desc: 'Dado os endpoints REST, quando implementar useState, useEffect e navegação entre páginas com rotas aninhadas, então sincronizar estado global.',
    column: 'backlog',
    points: 8,
    priority: 'Must Have',
    module: 'React App',
    assignee: 'Time Front-End'
  },
  {
    id: 'TASK-07',
    title: 'Construção do Quadro Kanban Interativo com Drag and Drop',
    desc: 'Dado o planejamento ágil, quando implementar drag-and-drop nativo com controle de limites WIP e métricas de Story Points, então integrar no projeto.',
    column: 'done',
    points: 5,
    priority: 'Should Have',
    module: 'Core UI',
    assignee: 'Letícia Vieira'
  },
  {
    id: 'TASK-08',
    title: 'Coleção Postman com Testes Automatizados e Códigos HTTP',
    desc: 'Dado a API de notas, quando criar a coleção documentada no Postman com validação de status 200, 201, 204 e 404, então exportar arquivo JSON.',
    column: 'backlog',
    points: 3,
    priority: 'Should Have',
    module: 'Express API',
    assignee: 'Devison Takatu'
  },
  {
    id: 'TASK-09',
    title: 'Pipeline CI/CD: Deploy do Backend no Render e Front na Vercel',
    desc: 'Dado os repositórios no GitHub, quando conectar os webhooks com Render e Vercel, então certificar SSL e variáveis de ambiente.',
    column: 'backlog',
    points: 2,
    priority: 'Must Have',
    module: 'DevOps',
    assignee: 'Time DevOps'
  }
];

// Estado da Aplicação
let tasks = [];
let draggedTaskId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderBoard();
});

// Carregar Tarefas
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      tasks = [...DEFAULT_TASKS];
    }
  } else {
    tasks = [...DEFAULT_TASKS];
    saveTasks();
  }
}

// Salvar Tarefas no LocalStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  updateMetrics();
}

// Renderizar o Quadro Inteiro
function renderBoard() {
  const columns = ['backlog', 'sprint-backlog', 'in-progress', 'review', 'done'];
  const searchTerm = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
  const priorityFilter = document.getElementById('filter-priority')?.value || 'ALL';

  columns.forEach(col => {
    const colContainer = document.getElementById(`cards-${col}`);
    const counterEl = document.getElementById(`count-${col}`);
    if (!colContainer) return;

    // Filtra tarefas da coluna
    const colTasks = tasks.filter(t => {
      const matchCol = t.column === col;
      const matchPrio = priorityFilter === 'ALL' || t.priority === priorityFilter;
      const matchSearch = !searchTerm || 
        t.title.toLowerCase().includes(searchTerm) || 
        t.id.toLowerCase().includes(searchTerm) || 
        (t.desc && t.desc.toLowerCase().includes(searchTerm)) ||
        t.module.toLowerCase().includes(searchTerm);
      return matchCol && matchPrio && matchSearch;
    });

    // Atualiza contador
    if (counterEl) counterEl.innerText = colTasks.length;

    // Verifica limite de WIP
    const colWrapper = colContainer.closest('.kanban-col');
    const wipLimit = parseInt(colWrapper?.getAttribute('data-wip') || '0', 10);
    if (wipLimit > 0 && colTasks.length > wipLimit) {
      colWrapper.classList.add('wip-exceeded');
    } else if (colWrapper) {
      colWrapper.classList.remove('wip-exceeded');
    }

    // Limpa e renderiza cards
    colContainer.innerHTML = '';
    colTasks.forEach(task => {
      colContainer.appendChild(createTaskElement(task));
    });
  });

  updateMetrics();
}

// Criar Elemento DOM do Card
function createTaskElement(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.setAttribute('draggable', 'true');
  card.setAttribute('data-id', task.id);

  // Mapeamento de cor da prioridade
  let prioClass = 'prio-could';
  if (task.priority === 'Must Have') prioClass = 'prio-must';
  else if (task.priority === 'Should Have') prioClass = 'prio-should';
  else if (task.priority === "Won't Have") prioClass = 'prio-wont';

  card.innerHTML = `
    <div class="card-top">
      <span class="task-id">${task.id}</span>
      <span class="task-module">${task.module}</span>
    </div>
    <div class="task-title">${escapeHtml(task.title)}</div>
    ${task.desc ? `<div class="task-desc">${escapeHtml(task.desc)}</div>` : ''}
    <div class="card-bottom">
      <span class="badge-priority ${prioClass}">${task.priority}</span>
      <div class="card-meta-right">
        <span class="points-badge" title="Estimativa em Story Points">${task.points} SP</span>
        <button class="btn-card-del" onclick="deleteTask('${task.id}')" title="Excluir tarefa">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Eventos de Drag and Drop
  card.addEventListener('dragstart', (e) => {
    draggedTaskId = task.id;
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    draggedTaskId = null;
    document.querySelectorAll('.col-cards').forEach(el => el.classList.remove('drag-over'));
  });

  return card;
}

// Eventos de Drop nas Colunas
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const container = e.currentTarget;
  container.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e, targetCol) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
  if (!taskId) return;

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  const currentTask = tasks[taskIndex];
  if (currentTask.column === targetCol) return;

  // Checagem de limite WIP
  const colWrapper = e.currentTarget.closest('.kanban-col');
  const wipLimit = parseInt(colWrapper?.getAttribute('data-wip') || '0', 10);
  const currentCountInTarget = tasks.filter(t => t.column === targetCol).length;

  if (wipLimit > 0 && currentCountInTarget >= wipLimit) {
    showToast(`⚠️ Alerta: Limite de WIP (${wipLimit}) atingido na coluna "${targetCol}"!`);
  }

  // Atualiza coluna da tarefa
  currentTask.column = targetCol;
  saveTasks();
  renderBoard();
  showToast(`Tarefa "${currentTask.id}" movida para ${targetCol.toUpperCase()}!`);
}

// Atualizar Métricas e Indicadores Ágeis
function updateMetrics() {
  const totalTasks = tasks.length;
  const totalPoints = tasks.reduce((sum, t) => sum + (Number(t.points) || 0), 0);
  
  const doneTasks = tasks.filter(t => t.column === 'done');
  const donePoints = doneTasks.reduce((sum, t) => sum + (Number(t.points) || 0), 0);

  const activeTasks = tasks.filter(t => t.column === 'in-progress' || t.column === 'review');
  const activePoints = activeTasks.reduce((sum, t) => sum + (Number(t.points) || 0), 0);

  const progressPct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  // Atualiza DOM
  const totalTasksEl = document.getElementById('metric-total-tasks');
  const donePointsEl = document.getElementById('metric-done-points');
  const activePointsEl = document.getElementById('metric-active-points');
  const progressPctEl = document.getElementById('metric-progress-pct');
  const pointsRatioEl = document.getElementById('metric-points-ratio');
  const progressBarFillEl = document.getElementById('progress-bar-fill');

  if (totalTasksEl) totalTasksEl.innerText = totalTasks;
  if (donePointsEl) donePointsEl.innerText = `${donePoints} SP`;
  if (activePointsEl) activePointsEl.innerText = `${activePoints} SP`;
  if (progressPctEl) progressPctEl.innerText = `${progressPct}%`;
  if (pointsRatioEl) pointsRatioEl.innerText = `${donePoints} / ${totalPoints} SP`;
  if (progressBarFillEl) progressBarFillEl.style.width = `${progressPct}%`;
}

// Filtros
function filterTasks() {
  renderBoard();
}

// Modal de Criação de Tarefa
function openModal() {
  const modal = document.getElementById('modal-new-task');
  if (modal) modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('modal-new-task');
  if (modal) modal.classList.add('hidden');
  document.getElementById('form-task')?.reset();
}

// Criar Nova Tarefa
function createTask() {
  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  const points = parseInt(document.getElementById('task-points').value, 10) || 3;
  const priority = document.getElementById('task-priority').value;
  const moduleName = document.getElementById('task-module').value;
  const assignee = document.getElementById('task-assignee').value.trim() || 'Equipe Dev';

  if (!title) return;

  // Gerador de ID ordenado (TASK-XX)
  const nextNum = tasks.length + 1;
  const newId = `TASK-${String(nextNum).padStart(2, '0')}`;

  const newTask = {
    id: newId,
    title,
    desc,
    column: 'sprint-backlog',
    points,
    priority,
    module: moduleName,
    assignee
  };

  tasks.unshift(newTask);
  saveTasks();
  renderBoard();
  closeModal();
  showToast(`Tarefa "${newId}" criada com sucesso no Sprint Backlog!`);
}

// Excluir Tarefa
function deleteTask(id) {
  if (confirm(`Tem certeza que deseja remover a tarefa "${id}"?`)) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderBoard();
    showToast(`Tarefa "${id}" removida.`);
  }
}

// Resetar para as Tarefas Padrão
function resetDefaultTasks() {
  if (confirm('Deseja restaurar as tarefas originais do plano da disciplina?')) {
    tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    saveTasks();
    renderBoard();
    showToast('Quadro Kanban restaurado com o backlog original!');
  }
}

// Sistema de Notificação Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.innerText = msg;
  toast.classList.remove('hidden');

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3200);
}

// Helper para escapar HTML contra XSS
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
