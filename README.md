# DEVPULSE AGILE KANBAN BOARD - MANUAL DE OPERAÇÃO

**Instituição:** SENAI  
**Disciplina:** Frameworks Front-End  
**Docente:** Prof. Me. Deivison S. Takatu  
**Atividade:** Atividade 03 - Gestão de Projetos Front-End  

---

## 1. Visão Geral da Ferramenta

O **DevPulse Agile Kanban** é uma aplicação web interativa desenvolvida com HTML5 semântico, CSS3 moderno e Vanilla JavaScript ES6+, criada especificamente para gerenciar o ciclo de vida das tarefas e entregáveis do **Projeto Integrador Interdisciplinar**.

### Principais Funcionalidades:
- **Fluxo Visual em 5 Estágios:** Product Backlog, Sprint Backlog, In Progress, Code Review e Concluído (Done).
- **Drag-and-Drop Nativo (HTML5 Drag and Drop API):** Permite mover os cartões de forma intuitiva entre as colunas com feedback tátil e visual.
- **Controle Estrito de WIP Limits (Work In Progress):** Alerta visual e toast de notificação quando os limites recomendados de trabalho simultâneo (2 tarefas em In Progress / 2 em Review) forem excedidos.
- **Métricas Ágeis em Tempo Real:** Cálculo automático de:
  - Percentual de conclusão da Sprint com barra de progresso dinâmica;
  - Total de Story Points concluídos versus planejados (Sequência de Fibonacci: 1, 2, 3, 5, 8, 13);
  - Quantidade de tarefas ativas e velocidade da equipe (*Velocity*).
- **Classificação MoSCoW:** Tags visuais categorizadas em *Must Have*, *Should Have*, *Could Have* e *Won't Have*.
- **Filtros e Busca Instantânea:** Filtragem dinâmica por palavra-chave (título, descrição ou módulo) e por prioridade MoSCoW.
- **Persistência Local (LocalStorage):** O estado das tarefas e suas posições são preservados automaticamente entre sessões do navegador.

---

## 2. Estrutura dos Arquivos

```text
03-Gestao-de-Projetos-FrontEnd/
├── GESTAO_PROJETO_AGIL.md    # Documentação mestre completa da metodologia
└── kanban-board/
    ├── index.html            # Estrutura do quadro e modais
    ├── style.css             # Folha de estilo completa com suporte a Dark Mode
    ├── app.js                # Lógica de negócio, drag-and-drop e métricas
    └── README.md             # Guia de execução e instruções de uso
```

---

## 3. Como Executar

### No Navegador Web
1. Abra a pasta `c:\Users\Letícia Vieira\Desktop\DevisonProjeto\03-Gestao-de-Projetos-FrontEnd\kanban-board\`.
2. Dê um duplo clique no arquivo `index.html` (ou abra com Google Chrome, Microsoft Edge ou Firefox).
3. O quadro já iniciará carregado com as **9 tarefas reais** do plano da disciplina para visualização imediata!

### Via Live Server (VS Code / Antigravity IDE)
1. Clique com o botão direito no arquivo `index.html`.
2. Selecione **Open with Live Server**.
3. Acesse no navegador: `http://127.0.0.1:5500/03-Gestao-de-Projetos-FrontEnd/kanban-board/index.html`.

---

## 4. Guia de Operação Prática

1. **Movimentar uma Tarefa:** Clique e segure qualquer card para arrastá-lo para a coluna desejada (ex.: mova da coluna `In Progress` para `Code Review`).
2. **Criar Nova Tarefa:** Clique no botão azul **"+ Nova Tarefa"** no cabeçalho. Preencha o título, descrição com critérios de aceite Gherkin, pontuação em Story Points e prioridade MoSCoW. Clique em **Salvar no Backlog**.
3. **Filtrar Tarefas:** Utilize o campo de busca no painel superior para encontrar itens por texto (ex.: digite `React`, `API` ou `CSS`) ou selecione uma prioridade no menu suspenso.
4. **Restaurar Dados Originais:** Para voltar ao estado padrão com as tarefas da disciplina, clique no botão **"Resetar Dados"**.
