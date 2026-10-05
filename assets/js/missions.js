
function cenarioCurrentUser(){ return 'public'; }
function cenarioProgressKey(key){ return `${cenarioCurrentUser()}::cenario-inovador-${key}`; }
const answerMaps = {
  m01: { q1: 'b', q2: 'a', q3: 'a', q4: 'a', q5: 'a' },
  m02: { q1: 'a', q2: 'b', q3: 'a', q4: 'a', q5: 'a' },
  m03: { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' },
  m04: { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' },
  m05: { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' },
  m06: { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' },
  m07: { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' },
  m08: { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' },
  m09: { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' },
  m10: { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' }
};

function markInteractiveCard(card, choice) {
  const output = card.querySelector('output');
  const correct = choice === card.dataset.answer;
  output.textContent = correct ? '✓ Análise correta.' : '✕ Revise a regra e tente novamente.';
  output.className = correct ? 'feedback-ok' : 'feedback-error';
  if (correct) card.dataset.completed = 'true';
}

document.querySelectorAll('.challenge-card').forEach(card => {
  card.querySelectorAll('[data-choice]').forEach(button => {
    button.addEventListener('click', () => markInteractiveCard(card, button.dataset.choice));
  });
});

document.querySelectorAll('.term-card').forEach(card => {
  card.querySelectorAll('[data-choice]').forEach(button => {
    button.addEventListener('click', () => markInteractiveCard(card, button.dataset.choice));
  });
});

document.querySelectorAll('.checkpoint').forEach(checkpoint => {
  const form = checkpoint.querySelector('.quiz-form');
  const result = checkpoint.querySelector('.quiz-result');
  const key = checkpoint.dataset.checkpoint;
  const answers = answerMaps[key];
  if (!form || !answers) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    let score = 0;
    let answered = 0;
    Object.entries(answers).forEach(([question, answer]) => {
      const selected = form.querySelector(`input[name="${question}"]:checked`);
      if (selected) {
        answered += 1;
        if (selected.value === answer) score += 1;
      }
    });

    if (answered < 5) {
      result.textContent = `Responda todas as questões. Você concluiu ${answered} de 5.`;
      result.className = 'quiz-result feedback-error';
      return;
    }

    const percent = score * 20;
    const passed = percent >= 70;
    result.textContent = passed
      ? `Checkpoint concluído: ${score}/5 (${percent}%). Missão validada.`
      : `Resultado: ${score}/5 (${percent}%). Revise o conteúdo e tente novamente.`;
    result.className = `quiz-result ${passed ? 'feedback-ok' : 'feedback-error'}`;

    if (passed) {
      localStorage.setItem(cenarioProgressKey(key), 'completed');
      
      document.body.classList.add('mission-completed');
    }
  });

  if (localStorage.getItem(cenarioProgressKey(key)) === 'completed') {
    document.body.classList.add('mission-completed');
    result.textContent = '✓ Esta missão já foi validada neste dispositivo.';
    result.className = 'quiz-result feedback-ok';
  }
});


// V3 — laboratório DDL simulado
const ddlInput = document.querySelector('#ddl-input');
const ddlResult = document.querySelector('#ddl-result');
const runDdl = document.querySelector('#run-ddl');
const resetDdl = document.querySelector('#reset-ddl');
const schemaState = document.querySelector('#schema-state');
let simulatedSchema = {};

function renderSchema() {
  if (!schemaState) return;
  const names = Object.keys(simulatedSchema);
  if (!names.length) {
    schemaState.innerHTML = '<span>Nenhuma tabela implantada nesta simulação.</span>';
    return;
  }
  schemaState.innerHTML = names.map(name => {
    const cols = simulatedSchema[name];
    return `<article class="schema-table"><strong>${name.toUpperCase()}</strong>${cols.map(c => `<span>${c}</span>`).join('')}</article>`;
  }).join('');
}

runDdl?.addEventListener('click', () => {
  const raw = ddlInput.value.trim();
  const normalized = raw.replace(/\s+/g, ' ').trim();
  let match;

  if ((match = normalized.match(/^create\s+database\s+([a-zA-Z_][\w]*)\s*;?$/i))) {
    ddlResult.textContent = `✓ Banco ${match[1]} criado na simulação.`;
    ddlResult.className = 'result-panel feedback-ok';
    return;
  }

  if ((match = raw.match(/create\s+table\s+([a-zA-Z_][\w]*)\s*\(([\s\S]+)\)\s*;?/i))) {
    const name = match[1].toLowerCase();
    const columns = match[2].split(',').map(x => x.trim()).filter(Boolean).map(x => x.split(/\s+/).slice(0, 3).join(' '));
    simulatedSchema[name] = columns;
    ddlResult.textContent = `✓ Tabela ${name} criada com ${columns.length} definição(ões).`;
    ddlResult.className = 'result-panel feedback-ok';
    renderSchema();
    return;
  }

  if ((match = normalized.match(/^alter\s+table\s+([a-zA-Z_][\w]*)\s+add(?:\s+column)?\s+(.+?)\s*;?$/i))) {
    const name = match[1].toLowerCase();
    if (!simulatedSchema[name]) {
      ddlResult.textContent = `✕ A tabela ${name} ainda não existe na simulação. Crie-a primeiro.`;
      ddlResult.className = 'result-panel feedback-error';
      return;
    }
    simulatedSchema[name].push(match[2].replace(/;$/, ''));
    ddlResult.textContent = `✓ Estrutura de ${name} alterada.`;
    ddlResult.className = 'result-panel feedback-ok';
    renderSchema();
    return;
  }

  if ((match = normalized.match(/^truncate\s+table\s+([a-zA-Z_][\w]*)\s*;?$/i))) {
    ddlResult.textContent = simulatedSchema[match[1].toLowerCase()]
      ? `✓ TRUNCATE reconhecido. Os dados seriam removidos, mantendo a estrutura de ${match[1]}.`
      : `✕ A tabela ${match[1]} ainda não existe na simulação.`;
    ddlResult.className = simulatedSchema[match[1].toLowerCase()] ? 'result-panel feedback-ok' : 'result-panel feedback-error';
    return;
  }

  if ((match = normalized.match(/^drop\s+table\s+([a-zA-Z_][\w]*)\s*;?$/i))) {
    const name = match[1].toLowerCase();
    if (!simulatedSchema[name]) {
      ddlResult.textContent = `✕ A tabela ${name} ainda não existe na simulação.`;
      ddlResult.className = 'result-panel feedback-error';
      return;
    }
    delete simulatedSchema[name];
    ddlResult.textContent = `✓ Tabela ${name} removida da simulação.`;
    ddlResult.className = 'result-panel feedback-ok';
    renderSchema();
    return;
  }

  ddlResult.textContent = 'Comando não reconhecido neste laboratório. Experimente CREATE DATABASE, CREATE TABLE, ALTER TABLE ... ADD, TRUNCATE TABLE ou DROP TABLE.';
  ddlResult.className = 'result-panel feedback-error';
});

resetDdl?.addEventListener('click', () => {
  simulatedSchema = {};
  ddlResult.textContent = 'Laboratório reiniciado.';
  ddlResult.className = 'result-panel';
  renderSchema();
});


// V4 — SQL Challenge Center (DQL)
const dqlInput = document.querySelector('#dql-input');
const dqlResult = document.querySelector('#dql-result');
const runDql = document.querySelector('#run-dql');
const showDqlHint = document.querySelector('#show-dql-hint');
const challengeTitle = document.querySelector('#sql-challenge-title');
const challengeHint = document.querySelector('#sql-challenge-hint');
const challengeProgress = document.querySelector('#sql-challenge-progress');
const challengeButtons = [...document.querySelectorAll('[data-sql-challenge]')];

const smartCoffeeProducts = [
  { id: 1, nome: 'Espresso', preco: 7.5, estoque: 18, categoria: 'Cafés' },
  { id: 2, nome: 'Cappuccino', preco: 12, estoque: 9, categoria: 'Cafés' },
  { id: 3, nome: 'Mocha', preco: 14, estoque: 4, categoria: 'Cafés' },
  { id: 4, nome: 'Cheesecake', preco: 16, estoque: 6, categoria: 'Doces' },
  { id: 5, nome: 'Cookie', preco: 8, estoque: 3, categoria: 'Doces' }
];

const sqlChallenges = {
  1: { title: 'Liste todos os produtos.', hint: 'Use SELECT e FROM.', starter: 'SELECT * FROM produto;', test: q => /^select\s+\*\s+from\s+produto\s*;?$/i.test(q) },
  2: { title: 'Liste os produtos com preço maior que 10.', hint: 'Use WHERE preco > 10.', starter: 'SELECT * FROM produto\nWHERE preco > 10;', test: q => /select[\s\S]+from\s+produto[\s\S]+where\s+preco\s*>\s*10/i.test(q) },
  3: { title: 'Ordene os produtos do maior para o menor preço.', hint: 'Use ORDER BY preco DESC.', starter: 'SELECT nome, preco FROM produto\nORDER BY preco DESC;', test: q => /select[\s\S]+from\s+produto[\s\S]+order\s+by\s+preco\s+desc/i.test(q) },
  4: { title: 'Calcule a média de preço dos produtos.', hint: 'Use AVG(preco).', starter: 'SELECT AVG(preco) AS media_preco FROM produto;', test: q => /select\s+avg\s*\(\s*preco\s*\)[\s\S]+from\s+produto/i.test(q) },
  5: { title: 'Mostre produto e categoria usando JOIN.', hint: 'Relacione PRODUTO e CATEGORIA pelo id_categoria.', starter: 'SELECT p.nome, c.nome_categoria\nFROM produto p\nJOIN categoria c ON c.id_categoria = p.id_categoria;', test: q => /select[\s\S]+from\s+produto\s+\w+[\s\S]+join\s+categoria\s+\w+[\s\S]+on/i.test(q) }
};

let activeChallenge = 1;
const completedChallenges = new Set();

function renderDqlTable(rows, caption='Resultado simulado') {
  if (!dqlResult) return;
  const keys = Object.keys(rows[0] || {});
  dqlResult.innerHTML = `<strong class="result-caption">${caption}</strong><table class="result-table"><thead><tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${keys.map(k => `<td>${row[k]}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  dqlResult.className = 'result-panel query-success';
}

function updateChallengeProgress() {
  if (challengeProgress) challengeProgress.textContent = `${completedChallenges.size} de 5 desafios concluídos`;
}

function setChallenge(id) {
  activeChallenge = Number(id);
  const c = sqlChallenges[activeChallenge];
  challengeTitle.textContent = c.title;
  challengeHint.textContent = 'Dica disponível.';
  dqlInput.value = c.starter;
  dqlResult.textContent = 'Aguardando consulta...';
  dqlResult.className = 'result-panel';
  challengeButtons.forEach(b => b.classList.toggle('active', Number(b.dataset.sqlChallenge) === activeChallenge));
}

challengeButtons.forEach(button => button.addEventListener('click', () => setChallenge(button.dataset.sqlChallenge)));
showDqlHint?.addEventListener('click', () => { challengeHint.textContent = sqlChallenges[activeChallenge].hint; });

runDql?.addEventListener('click', () => {
  const q = dqlInput.value.trim().replace(/\s+/g, ' ');
  const c = sqlChallenges[activeChallenge];
  if (!c.test(q)) {
    dqlResult.textContent = `✕ A consulta ainda não atende ao desafio ${activeChallenge}. ${c.hint}`;
    dqlResult.className = 'result-panel feedback-error';
    return;
  }

  completedChallenges.add(activeChallenge);
  updateChallengeProgress();

  if (activeChallenge === 1) renderDqlTable(smartCoffeeProducts.map(p => ({ id: p.id, produto: p.nome, preco: `R$ ${p.preco.toFixed(2)}` })));
  if (activeChallenge === 2) renderDqlTable(smartCoffeeProducts.filter(p => p.preco > 10).map(p => ({ produto: p.nome, preco: `R$ ${p.preco.toFixed(2)}` })));
  if (activeChallenge === 3) renderDqlTable([...smartCoffeeProducts].sort((a,b) => b.preco-a.preco).map(p => ({ produto: p.nome, preco: `R$ ${p.preco.toFixed(2)}` })));
  if (activeChallenge === 4) {
    const avg = smartCoffeeProducts.reduce((s,p) => s+p.preco,0) / smartCoffeeProducts.length;
    renderDqlTable([{ media_preco: `R$ ${avg.toFixed(2)}` }], 'Agregação calculada');
  }
  if (activeChallenge === 5) renderDqlTable(smartCoffeeProducts.map(p => ({ produto: p.nome, categoria: p.categoria })), 'JOIN simulado');
});

// V5 — DML Lab
const dmlInput = document.querySelector('#dml-input');
const dmlResult = document.querySelector('#dml-result');
const dmlTable = document.querySelector('#dml-table');
const runDml = document.querySelector('#run-dml');
const resetDml = document.querySelector('#reset-dml');
const initialDmlRows = [
  { id: 1, nome: 'Café Expresso', preco: 7.5, estoque: 15 },
  { id: 2, nome: 'Cappuccino', preco: 12, estoque: 8 },
  { id: 3, nome: 'Mocha', preco: 14, estoque: 6 }
];
let dmlRows = JSON.parse(JSON.stringify(initialDmlRows));

function renderDmlRows() {
  if (!dmlTable) return;
  dmlTable.innerHTML = `<table class="result-table"><thead><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Estoque</th></tr></thead><tbody>${dmlRows.map(r => `<tr><td>${r.id}</td><td>${r.nome}</td><td>R$ ${r.preco.toFixed(2).replace('.', ',')}</td><td>${r.estoque}</td></tr>`).join('')}</tbody></table>`;
}
renderDmlRows();

runDml?.addEventListener('click', () => {
  const sql = dmlInput.value.trim().replace(/\s+/g, ' ');
  let m;
  if ((m = sql.match(/^insert\s+into\s+produto\s*\([^)]*nome[^)]*preco[^)]*estoque[^)]*\)\s*values\s*\(\s*['\"]([^'\"]+)['\"]\s*,\s*([0-9.]+)\s*,\s*(\d+)\s*\)\s*;?$/i))) {
    const nextId = Math.max(0, ...dmlRows.map(r => r.id)) + 1;
    dmlRows.push({ id: nextId, nome: m[1], preco: Number(m[2]), estoque: Number(m[3]) });
    dmlResult.textContent = `✓ INSERT executado. Produto ${m[1]} adicionado.`;
    dmlResult.className = 'result-panel feedback-ok';
    renderDmlRows(); return;
  }
  if ((m = sql.match(/^update\s+produto\s+set\s+(preco|estoque)\s*=\s*([0-9.]+)\s+where\s+id_produto\s*=\s*(\d+)\s*;?$/i))) {
    const row = dmlRows.find(r => r.id === Number(m[3]));
    if (!row) { dmlResult.textContent = '✕ ID não encontrado.'; dmlResult.className = 'result-panel feedback-error'; return; }
    row[m[1].toLowerCase()] = Number(m[2]);
    dmlResult.textContent = `✓ UPDATE executado no produto ${row.nome}.`;
    dmlResult.className = 'result-panel feedback-ok';
    renderDmlRows(); return;
  }
  if ((m = sql.match(/^delete\s+from\s+produto\s+where\s+id_produto\s*=\s*(\d+)\s*;?$/i))) {
    const id = Number(m[1]);
    const before = dmlRows.length;
    dmlRows = dmlRows.filter(r => r.id !== id);
    dmlResult.textContent = dmlRows.length < before ? `✓ DELETE executado. ID ${id} removido.` : '✕ ID não encontrado.';
    dmlResult.className = dmlRows.length < before ? 'result-panel feedback-ok' : 'result-panel feedback-error';
    renderDmlRows(); return;
  }
  if (/^(update|delete)/i.test(sql) && !/\bwhere\b/i.test(sql)) {
    dmlResult.textContent = '⚠ Comando bloqueado na simulação: UPDATE/DELETE sem WHERE é perigoso.';
    dmlResult.className = 'result-panel feedback-error'; return;
  }
  dmlResult.textContent = '✕ Comando não reconhecido. Use os exemplos da missão e mantenha a estrutura proposta.';
  dmlResult.className = 'result-panel feedback-error';
});
resetDml?.addEventListener('click', () => {
  dmlRows = JSON.parse(JSON.stringify(initialDmlRows)); renderDmlRows();
  dmlResult.textContent = 'Dados restaurados.'; dmlResult.className = 'result-panel';
});

// V5 — SmartCoffee CRUD visual
const coffeeForm = document.querySelector('#coffee-form');
const coffeeBody = document.querySelector('#coffee-table-body');
const coffeeFeedback = document.querySelector('#coffee-feedback');
const coffeeCancel = document.querySelector('#coffee-cancel');
const coffeeSubmit = document.querySelector('#coffee-submit');
const coffeeStorageKey = 'cenario-inovador-smartcoffee-products';
const coffeeDefaults = [
  { id: 1, nome: 'Café Expresso', categoria: 'Cafés', preco: 7.5, estoque: 15 },
  { id: 2, nome: 'Cappuccino', categoria: 'Cafés', preco: 12, estoque: 8 },
  { id: 3, nome: 'Brownie', categoria: 'Doces', preco: 9.5, estoque: 10 }
];
let coffeeProducts = [];
if (coffeeForm) {
  try { coffeeProducts = JSON.parse(localStorage.getItem(coffeeStorageKey)) || coffeeDefaults; } catch { coffeeProducts = coffeeDefaults; }
}
function brl(value) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); }
function saveCoffee() { localStorage.setItem(coffeeStorageKey, JSON.stringify(coffeeProducts)); }
function renderCoffee() {
  if (!coffeeBody) return;
  coffeeBody.innerHTML = coffeeProducts.map(p => `<tr><td>${p.id}</td><td>${p.nome}</td><td>${p.categoria}</td><td>${brl(p.preco)}</td><td>${p.estoque}</td><td class="coffee-actions"><button type="button" data-edit-coffee="${p.id}">Editar</button><button type="button" data-delete-coffee="${p.id}">Excluir</button></td></tr>`).join('');
  document.querySelector('#coffee-total-products').textContent = coffeeProducts.length;
  document.querySelector('#coffee-total-stock').textContent = coffeeProducts.reduce((a,p) => a+p.estoque, 0);
  document.querySelector('#coffee-inventory-value').textContent = brl(coffeeProducts.reduce((a,p) => a+(p.preco*p.estoque), 0));
}
function clearCoffeeForm() {
  coffeeForm?.reset();
  const id = document.querySelector('#coffee-id'); if (id) id.value = '';
  if (coffeeSubmit) coffeeSubmit.textContent = 'Cadastrar produto';
  if (coffeeCancel) coffeeCancel.hidden = true;
}
coffeeForm?.addEventListener('submit', e => {
  e.preventDefault();
  const idValue = Number(document.querySelector('#coffee-id').value || 0);
  const payload = {
    nome: document.querySelector('#coffee-name').value.trim(),
    preco: Number(document.querySelector('#coffee-price').value),
    estoque: Number(document.querySelector('#coffee-stock').value),
    categoria: document.querySelector('#coffee-category').value
  };
  if (!payload.nome || payload.preco < 0 || payload.estoque < 0) return;
  if (idValue) {
    const item = coffeeProducts.find(p => p.id === idValue);
    if (item) Object.assign(item, payload);
    coffeeFeedback.textContent = '✓ Produto atualizado. Equivalente conceitual: UPDATE.';
  } else {
    const nextId = Math.max(0, ...coffeeProducts.map(p => p.id)) + 1;
    coffeeProducts.push({ id: nextId, ...payload });
    coffeeFeedback.textContent = '✓ Produto cadastrado. Equivalente conceitual: INSERT.';
  }
  coffeeFeedback.className = 'choice-feedback feedback-ok';
  saveCoffee(); renderCoffee(); clearCoffeeForm();
});
coffeeBody?.addEventListener('click', e => {
  const edit = e.target.closest('[data-edit-coffee]');
  const del = e.target.closest('[data-delete-coffee]');
  if (edit) {
    const p = coffeeProducts.find(x => x.id === Number(edit.dataset.editCoffee)); if (!p) return;
    document.querySelector('#coffee-id').value = p.id;
    document.querySelector('#coffee-name').value = p.nome;
    document.querySelector('#coffee-price').value = p.preco;
    document.querySelector('#coffee-stock').value = p.estoque;
    document.querySelector('#coffee-category').value = p.categoria;
    coffeeSubmit.textContent = 'Salvar alteração'; coffeeCancel.hidden = false;
    coffeeFeedback.textContent = 'Modo edição ativado. Ao salvar, pense em UPDATE ... WHERE id_produto = ?';
    coffeeFeedback.className = 'choice-feedback';
  }
  if (del) {
    const id = Number(del.dataset.deleteCoffee);
    const p = coffeeProducts.find(x => x.id === id);
    if (!p) return;
    coffeeProducts = coffeeProducts.filter(x => x.id !== id);
    saveCoffee(); renderCoffee();
    coffeeFeedback.textContent = `✓ ${p.nome} excluído. Equivalente conceitual: DELETE ... WHERE id_produto = ${id}.`;
    coffeeFeedback.className = 'choice-feedback feedback-ok';
    clearCoffeeForm();
  }
});
coffeeCancel?.addEventListener('click', clearCoffeeForm);
renderCoffee();
