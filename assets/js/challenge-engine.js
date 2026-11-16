(() => {
  const root = document.querySelector('[data-challenge-root]');
  if (!root) return;

  const theme = root.dataset.theme || 'challenge';
  const phase = root.dataset.phase || '1';
  const storageKey = `portal_challenge_${theme}_phase_${phase}`;
  const form = root.querySelector('[data-challenge-form]');
  const result = root.querySelector('[data-challenge-result]');
  const progress = document.querySelector('[data-phase-progress]');
  const phaseOneCard = document.querySelector('[data-phase="1"]');
  const resetBtn = root.querySelector('[data-reset-challenge]');

  function setCompleted(score, total) {
    localStorage.setItem(storageKey, JSON.stringify({ score, total, completed: score >= Math.ceil(total * 0.66) }));
    renderSaved();
  }

  function renderSaved() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch (_) {}
    if (!saved) return;
    if (progress) progress.textContent = saved.completed ? `Fase 1 concluída · ${saved.score}/${saved.total}` : `Última tentativa · ${saved.score}/${saved.total}`;
    if (phaseOneCard && saved.completed) {
      phaseOneCard.classList.add('phase-complete');
      const badge = phaseOneCard.querySelector('.phase-state');
      if (badge) badge.textContent = '✓ CONCLUÍDA';
    }
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const questions = [...form.querySelectorAll('[data-question]')];
    let score = 0;

    questions.forEach((q) => {
      const answer = q.dataset.answer;
      const name = q.dataset.name;
      const selected = form.querySelector(`input[name="${name}"]:checked`);
      const feedback = q.querySelector('.question-feedback');
      const ok = selected && selected.value === answer;
      if (ok) score++;
      q.classList.toggle('question-correct', !!ok);
      q.classList.toggle('question-wrong', !ok);
      if (feedback) {
        feedback.textContent = ok ? '✓ Correto.' : `✗ Revise este ponto. Resposta esperada: ${q.dataset.explain || answer}`;
      }
    });

    const total = questions.length;
    const passed = score >= Math.ceil(total * 0.66);
    if (result) {
      result.className = `challenge-result ${passed ? 'passed' : 'retry'}`;
      result.innerHTML = passed
        ? `<strong>MISSÃO CONCLUÍDA</strong><span>${score}/${total} acertos. Checkpoint salvo neste navegador.</span>`
        : `<strong>NOVA TENTATIVA NECESSÁRIA</strong><span>${score}/${total} acertos. Revise os feedbacks e tente novamente.</span>`;
    }
    setCompleted(score, total);
  });

  resetBtn?.addEventListener('click', () => {
    form?.reset();
    form?.querySelectorAll('[data-question]').forEach((q) => {
      q.classList.remove('question-correct', 'question-wrong');
      const feedback = q.querySelector('.question-feedback');
      if (feedback) feedback.textContent = '';
    });
    if (result) { result.className = 'challenge-result'; result.textContent = 'Aguardando tentativa...'; }
  });

  renderSaved();
})();
