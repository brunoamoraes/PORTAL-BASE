
function cenarioCurrentUser(){ return 'public'; }
function cenarioProgressKey(key){ return `${cenarioCurrentUser()}::hawkins-${key}`; }
const webAnswers = {
  w01: { q1:'a', q2:'b', q3:'a', q4:'a', q5:'b' },
  w02: { q1:'a', q2:'a', q3:'b', q4:'a', q5:'a' },
  w03: { q1:'a', q2:'b', q3:'a', q4:'a', q5:'b' },
  w04: { q1:'a', q2:'a', q3:'b', q4:'a', q5:'a' },
  w05: { q1:'a', q2:'b', q3:'a', q4:'a', q5:'a' },
  w06: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a' },
  w07: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a' },
  w08: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a' },
  w09: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a' },
  w10: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a' },
  w11: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a' },
  w12: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a' },
  w13: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a' }
};

document.querySelectorAll('.challenge-card').forEach(card => {
  card.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
    const output = card.querySelector('output');
    const ok = button.dataset.choice === card.dataset.answer;
    output.textContent = ok ? '✓ Correto.' : '✕ Revise o conceito e tente novamente.';
    output.className = ok ? 'feedback-ok' : 'feedback-error';
  }));
});

document.querySelectorAll('.quiz-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const checkpoint = form.closest('[data-checkpoint]');
    const key = checkpoint?.dataset.checkpoint;
    const answers = webAnswers[key];
    if (!answers) return;
    let score=0, answered=0;
    Object.entries(answers).forEach(([name,answer]) => {
      const chosen=form.querySelector(`input[name="${name}"]:checked`);
      if(chosen){ answered++; if(chosen.value===answer) score++; }
    });
    const pct=Math.round(score/Object.keys(answers).length*100);
    const out=form.querySelector('.quiz-result');
    if(answered<Object.keys(answers).length){ out.textContent=`Responda todas as questões. ${answered}/5 respondidas.`; out.className='quiz-result feedback-error'; return; }
    const ok=pct>=70;
    out.textContent=ok ? `✓ Checkpoint concluído: ${score}/5 (${pct}%).` : `Você fez ${score}/5 (${pct}%). Revise a aula e tente novamente.`;
    out.className=ok?'quiz-result feedback-ok':'quiz-result feedback-error';
    if(ok){ localStorage.setItem(cenarioProgressKey(key),'completed');  document.body.classList.add('mission-completed'); }
  });
});

const currentCheckpoint=document.querySelector('[data-checkpoint]')?.dataset.checkpoint;
if(currentCheckpoint && localStorage.getItem(cenarioProgressKey(currentCheckpoint))==='completed') document.body.classList.add('mission-completed');

const toggle=document.querySelector('#toggle-world');
toggle?.addEventListener('click',()=>{
  document.body.classList.toggle('upside-down');
  toggle.textContent=document.body.classList.contains('upside-down')?'Voltar para Hawkins':'Entrar no mundo invertido';
});

const structureInput=document.querySelector('#structure-input');
const structurePreview=document.querySelector('#structure-preview');
document.querySelector('#render-structure')?.addEventListener('click',()=>{
  structurePreview.srcdoc=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>body{font-family:Arial;padding:22px;color:#111}header,main,footer{border:1px solid #ddd;padding:14px;margin:8px 0;border-radius:10px}h1{margin-top:0}</style></head><body>${structureInput.value}</body></html>`;
});

const semanticInput=document.querySelector('#semantic-input');
const semanticResult=document.querySelector('#semantic-result');
document.querySelector('#check-semantic')?.addEventListener('click',()=>{
  const html=semanticInput.value.toLowerCase();
  const tags=['header','nav','main','section','article','footer'];
  const found=tags.filter(tag=>new RegExp(`<${tag}[\\s>]`).test(html));
  const divs=(html.match(/<div[\s>]/g)||[]).length;
  semanticResult.textContent=`Tags semânticas encontradas: ${found.length}/6 (${found.join(', ') || 'nenhuma'}). DIVs genéricas: ${divs}. ${found.length>=5 && divs<=1?'✓ Estrutura muito boa.':'Tente comunicar melhor a função de cada região da página.'}`;
  semanticResult.className=found.length>=5 && divs<=1?'result-panel feedback-ok':'result-panel';
});

const hexInput=document.querySelector('#hex-color');
const rgbInput=document.querySelector('#rgb-color');
const colorPreview=document.querySelector('#color-preview');
const colorStatus=document.querySelector('#color-status');
function validHex(v){return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());}
function validRgb(v){const m=v.trim().match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);return m && m.slice(1).every(n=>Number(n)<=255);}
function applyColor(v){colorPreview.style.background=v;colorStatus.textContent=`Aplicado: ${v}`;colorStatus.className='lab-status feedback-ok';}
document.querySelector('#apply-hex')?.addEventListener('click',()=> validHex(hexInput.value)?applyColor(hexInput.value):(colorStatus.textContent='Hex inválido. Ex.: #ff536d',colorStatus.className='lab-status feedback-error'));
document.querySelector('#apply-rgb')?.addEventListener('click',()=> validRgb(rgbInput.value)?applyColor(rgbInput.value):(colorStatus.textContent='RGB inválido. Ex.: rgb(255, 83, 109)',colorStatus.className='lab-status feedback-error'));


// V7 — Image Lab
const imageFormat=document.querySelector('#image-format');
const altText=document.querySelector('#alt-text');
const imageAnalysis=document.querySelector('#image-analysis');
const formatBadge=document.querySelector('#format-badge');
imageFormat?.addEventListener('change',()=>{ if(formatBadge) formatBadge.textContent=imageFormat.value.toUpperCase(); });
document.querySelector('#analyze-image')?.addEventListener('click',()=>{
  const format=imageFormat.value;
  const alt=altText.value.trim();
  const notes={jpg:'Adequado para fotografias e imagens com muitas tonalidades.',png:'Bom quando transparência é necessária; avalie o peso do arquivo.',svg:'Excelente para ícones, logotipos e desenhos vetoriais.',webp:'Boa opção moderna para reduzir peso mantendo qualidade.'};
  const altOk=alt.length>=12 && !/^imagem$/i.test(alt);
  imageAnalysis.textContent=`${notes[format]} ${altOk?'✓ O texto alternativo é descritivo.':'Revise o alt: descreva o conteúdo e a função da imagem.'}`;
  imageAnalysis.className=altOk?'lab-status feedback-ok':'lab-status feedback-error';
});

// V7 — CSS Lab
const cssFields=['css-bg','css-text','css-font','css-padding','css-radius','css-family'].map(id=>document.getElementById(id));
const cssCard=document.querySelector('#css-preview-card');
const cssCode=document.querySelector('#css-code');
function updateCssLab(){
  if(!cssCard) return;
  const bg=document.querySelector('#css-bg')?.value||'#7d1022';
  const color=document.querySelector('#css-text')?.value||'#ffffff';
  const font=document.querySelector('#css-font')?.value||20;
  const pad=document.querySelector('#css-padding')?.value||24;
  const radius=document.querySelector('#css-radius')?.value||18;
  const family=document.querySelector('#css-family')?.value||'Arial, sans-serif';
  Object.assign(cssCard.style,{background:bg,color,fontSize:`${font}px`,padding:`${pad}px`,borderRadius:`${radius}px`,fontFamily:family});
  if(cssCode) cssCode.textContent=`background: ${bg};\ncolor: ${color};\nfont-size: ${font}px;\npadding: ${pad}px;\nborder-radius: ${radius}px;\nfont-family: ${family};`;
}
cssFields.forEach(el=>{el?.addEventListener('input',updateCssLab);el?.addEventListener('change',updateCssLab);});
updateCssLab();

// V7 — Layout Lab
const layoutSelect=document.querySelector('#layout-select');
const layoutPreview=document.querySelector('#layout-preview');
const layoutStatus=document.querySelector('#layout-status');
document.querySelector('#apply-layout')?.addEventListener('click',()=>{
  if(!layoutSelect||!layoutPreview) return;
  layoutPreview.classList.remove('layout-two','layout-three','layout-stack');
  layoutPreview.classList.add(`layout-${layoutSelect.value}`);
  const msg={two:'Conteúdo principal com área complementar lateral.',three:'Três colunas: útil quando os blocos têm importância semelhante.',stack:'Fluxo vertical: simples e forte para telas estreitas.'};
  layoutStatus.textContent=msg[layoutSelect.value];
  layoutStatus.className='lab-status feedback-ok';
});


// V8 — Wireframe Builder
const wfToggles=document.querySelectorAll('.wf-toggle');
const wfStatus=document.querySelector('#wireframe-status');
function updateWireframe(){
  let active=0;
  wfToggles.forEach(toggle=>{
    const el=document.getElementById(toggle.dataset.target);
    if(el){ el.hidden=!toggle.checked; if(toggle.checked) active++; }
  });
  if(wfStatus){
    wfStatus.textContent=`${active} bloco${active===1?'':'s'} ativo${active===1?'':'s'}. ${active>=4?'✓ Estrutura suficiente para discutir fluxo.':'Revise: poucos blocos podem esconder funções importantes.'}`;
    wfStatus.className=active>=4?'lab-status feedback-ok':'lab-status feedback-error';
  }
}
wfToggles.forEach(t=>t.addEventListener('change',updateWireframe));
updateWireframe();

// V8 — Prototype Lab
const protoPrimary=document.querySelector('#proto-primary');
const protoBg=document.querySelector('#proto-bg');
const protoRadius=document.querySelector('#proto-radius');
const protoFont=document.querySelector('#proto-font');
const protoPreview=document.querySelector('#prototype-preview');
const protoStatus=document.querySelector('#prototype-status');
function updatePrototype(){
  if(!protoPreview) return;
  const primary=protoPrimary?.value||'#a6192e';
  const bg=protoBg?.value||'#16181d';
  const radius=protoRadius?.value||14;
  const font=protoFont?.value||'Arial, sans-serif';
  protoPreview.style.setProperty('--proto-primary',primary);
  protoPreview.style.setProperty('--proto-bg',bg);
  protoPreview.style.setProperty('--proto-radius',`${radius}px`);
  protoPreview.style.fontFamily=font;
  if(protoStatus) protoStatus.textContent=`Tokens ativos: principal ${primary}, fundo ${bg}, raio ${radius}px.`;
}
[protoPrimary,protoBg,protoRadius,protoFont].forEach(el=>{el?.addEventListener('input',updatePrototype);el?.addEventListener('change',updatePrototype);});
updatePrototype();

// V8 — HTML Translator
const translatorInput=document.querySelector('#translator-input');
const translationResult=document.querySelector('#translation-result');
document.querySelector('#analyze-translation')?.addEventListener('click',()=>{
  const html=(translatorInput?.value||'').toLowerCase();
  const required=['header','nav','main','section','aside','footer'];
  const found=required.filter(tag=>new RegExp(`<${tag}[\\s>]`).test(html));
  const divs=(html.match(/<div[\\s>]/g)||[]).length;
  const ok=found.length>=5 && divs<=1;
  translationResult.textContent=`Regiões reconhecidas: ${found.length}/6 (${found.join(', ')||'nenhuma'}). DIVs genéricas: ${divs}. ${ok?'✓ Boa tradução do wireframe para HTML semântico.':'Revise as funções dos blocos e substitua DIVs quando existir uma tag semântica apropriada.'}`;
  translationResult.className=ok?'lab-status feedback-ok':'lab-status feedback-error';
});
