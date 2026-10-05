const runSql = document.querySelector('#run-sql');
const sqlInput = document.querySelector('#sql-input');
const sqlResult = document.querySelector('#sql-result');

const products = [
  { id: 1, produto: 'Café Expresso', preco: '7,50' },
  { id: 2, produto: 'Cappuccino', preco: '12,00' },
  { id: 3, produto: 'Mocha', preco: '14,00' }
];

runSql?.addEventListener('click', () => {
  const command = sqlInput.value.trim().replace(/\s+/g, ' ').toLowerCase();

  if (command === 'select * from produtos;' || command === 'select * from produtos') {
    sqlResult.innerHTML = `
      <table class="result-table">
        <thead><tr><th>ID</th><th>Produto</th><th>Preço</th></tr></thead>
        <tbody>${products.map(p => `<tr><td>${p.id}</td><td>${p.produto}</td><td>R$ ${p.preco}</td></tr>`).join('')}</tbody>
      </table>`;
  } else {
    sqlResult.textContent = 'Consulta ainda não reconhecida neste protótipo. Experimente: SELECT * FROM produtos;';
  }
});
