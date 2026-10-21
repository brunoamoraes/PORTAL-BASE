(() => {
  const input = document.querySelector('#git-search');
  const cards = [...document.querySelectorAll('.knowledge-card')];
  const empty = document.querySelector('#empty-state');
  const summary = document.querySelector('#search-summary');
  const clear = document.querySelector('#clear-search');
  const quick = [...document.querySelectorAll('[data-query]')];

  const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function filterCards(raw) {
    const query = normalize(raw.trim());
    const terms = query.split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const haystack = normalize(`${card.dataset.search || ''} ${card.textContent}`);
      const match = !terms.length || terms.every(term => haystack.includes(term));
      card.hidden = !match;
      if (match) visible++;
    });
    empty.hidden = visible !== 0;
    summary.textContent = terms.length
      ? `${visible} carta${visible === 1 ? '' : 's'} encontrada${visible === 1 ? '' : 's'} para “${raw.trim()}”.`
      : 'Mostrando todas as cartas da arena.';
  }

  input?.addEventListener('input', e => filterCards(e.target.value));
  clear?.addEventListener('click', () => { input.value=''; filterCards(''); input.focus(); });
  quick.forEach(button => button.addEventListener('click', () => {
    input.value = button.dataset.query;
    filterCards(input.value);
    document.querySelector('#git-cards').scrollIntoView({behavior:'smooth', block:'start'});
  }));
})();
