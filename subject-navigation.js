'use strict';
/* Subject navigation layer: existing question banks only; no fabricated content. */
(() => {
  const books = document.getElementById('books');
  const home = document.getElementById('home');
  if (!books || !home || !Array.isArray(window.GAME_CATALOG)) return;
  const groups = [
    {id:'all',name:'全部',icon:'🏠'},
    {id:'english',name:'英文',icon:'📘',books:['journeys']},
    {id:'science',name:'自然',icon:'🔬',books:['science']},
    {id:'social',name:'社會',icon:'🌍',books:['social']},
    {id:'chinese',name:'國文',icon:'📜',books:[]}
  ];
  const controls = document.createElement('div');
  controls.className = 'subject-tabs';
  controls.setAttribute('role','group');
  controls.setAttribute('aria-label','依科目篩選課本');
  const note = document.createElement('p');
  note.className = 'subject-note muted';
  books.before(controls,note);
  function filter(id) {
    const selected = groups.find(x=>x.id===id)||groups[0];
    const cards = [...books.querySelectorAll('.book')];
    const available = window.GAME_CATALOG;
    cards.forEach((card,i)=>{
      const b=available[i];
      card.hidden=!!selected.books && !selected.books.includes(b.id);
    });
    note.textContent = id==='chinese'
      ? '📜 國文題庫正在整理，待教材與答案完成核對後開放。'
      : id==='all' ? '選擇課本開始闖關；國文題庫尚待審核。'
      : selected.books.some(b=>available.some(x=>x.id===b))
        ? '選擇下方課本，開始這個科目的學習挑戰。'
        : '這個科目目前尚未有已核對的題庫。';
    controls.querySelectorAll('button').forEach(b=>{
      const active=b.dataset.subject===id;
      b.classList.toggle('active',active);
      b.setAttribute('aria-pressed',String(active));
    });
  }
  groups.forEach(g=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='subject-tab';
    b.dataset.subject=g.id;
    b.textContent=g.icon+' '+g.name;
    b.onclick=()=>filter(g.id);
    controls.append(b);
  });
  filter('all');
})();
