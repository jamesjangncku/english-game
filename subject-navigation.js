'use strict';
/* Subject navigation layer: existing question banks only; no fabricated content. */
(() => {
  const books = document.getElementById('books');
  const home = document.getElementById('home');
  if (!books || !home || !Array.isArray(catalog)) return;
  const search=document.createElement('input');
  search.type='search';
  search.id='lessonSearch';
  search.className='lesson-search';
  search.placeholder='🔎 搜尋課本、單元或課次';
  search.setAttribute('aria-label','搜尋課本、單元或課次');
  books.before(search);
  const results=document.createElement('div');
  results.id='lessonSearchResults';
  results.className='lesson-search-results';
  search.after(results);
  search.addEventListener('input',()=>{
    results.replaceChildren();
    const term=search.value.trim().toLocaleLowerCase();
    if(!term)return;
    const matches=[];
    catalog.forEach(b=>(b.units||[]).forEach(u=>(u.lessons||[]).forEach(l=>{
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
})();
