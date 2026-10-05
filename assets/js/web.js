const toggleWorld = document.querySelector('#toggle-world');
const renderHtml = document.querySelector('#render-html');
const htmlInput = document.querySelector('#html-input');
const htmlPreview = document.querySelector('#html-preview');

toggleWorld?.addEventListener('click', () => {
  document.body.classList.toggle('upside-down');
  const active = document.body.classList.contains('upside-down');
  toggleWorld.textContent = active ? 'Voltar para Hawkins' : 'Entrar no mundo invertido';
});

function updatePreview() {
  if (!htmlPreview || !htmlInput) return;
  htmlPreview.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}article{border:1px solid #ddd;border-radius:16px;padding:20px}h2{margin-top:0}</style></head><body>${htmlInput.value}</body></html>`;
}

renderHtml?.addEventListener('click', updatePreview);
updatePreview();
