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
  const search=document.createElement('input');
  search.type='search';
  search.id='lessonSearch';
  search.className='lesson-search';
  search.placeholder='🔎 搜尋課本、單元或課次';
  search.setAttribute('aria-label','搜尋課本、單元或課次');
  note.after(search);
  const results=document.createElement('div');
  results.id='lessonSearchResults';
  results.className='lesson-search-results';
  search.after(results);
  search.addEventListener('input',()=>{
    results.replaceChildren();
    const term=search.value.trim().toLocaleLowerCase();
    if(!term)return;
    const matches=[];
    window.GAME_CATALOG.forEach(b=>(b.units||[]).forEach(u=>(u.lessons||[]).forEach(l=>{
      if([b.name,u.name,l.name].some(t=>t.toLocaleLowerCase().includes(term)))matches.push({b,u,l});
    })));
    const heading=document.createElement('p');
    heading.className='muted';
    heading.textContent=matches.length+' 個符合的課次'+(matches.length>40?'（顯示前 40 筆）':'');
    results.append(heading);
    matches.slice(0,40).forEach(({b,u,l})=>{
      const button=document.createElement('button');
      button.type='button';
      button.className='lesson-search-result';
      button.textContent=b.name+' › '+u.name+' › '+l.name;
      button.onclick=()=>{
        if(typeof chooseBook!=='function'||typeof chooseUnit!=='function')return;
        chooseBook(b.id);chooseUnit(u.id);
        if(u.lessons.length>1){
          const lessonButtons=[...document.querySelectorAll('#lessons button.lesson')];
          const index=u.lessons.findIndex(x=>x.id===l.id);
          if(lessonButtons[index]&&!lessonButtons[index].disabled)lessonButtons[index].click();
        }
      };
      results.append(button);
    });
  });
  filter('all');
})();
