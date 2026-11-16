'use strict';
/* V9 fixed art: per-item 336x246 WebP files, no atlas/sprite stretching. */
window.GAME_APPROVED_ART=Object.freeze((()=>{
  const ids=[
    'explorer-hat','magic-hat','hero-cape','star-glasses',
    'treehouse','castle','star-library','ocean-treasure',
    'word-badge','reading-badge','grammar-badge','review-badge'
  ];
  const known=new Set(ids);
  const url=(id)=>'assets/'+(known.has(id)?id:'explorer-hat')+'.webp';
  function apply(element,id){
    const safe=known.has(id)?id:'explorer-hat';
    /* Clear all old sprite backgrounds on every render / outfit change. */
    element.style.removeProperty('background-image');
    element.style.removeProperty('background-size');
    element.style.removeProperty('background-position');
    element.style.removeProperty('background-repeat');
    element.style.removeProperty('background-color');
    element.src=url(safe);
    element.setAttribute('data-art-id',safe);
    element.classList.add('approved-art-image');
  }
  function mainOutfit(equipped={}){
    if(equipped.cape==='hero-cape')return 'hero-cape';
    if(equipped.glasses==='star-glasses')return 'star-glasses';
    if(equipped.hat==='magic-hat')return 'magic-hat';
    return 'explorer-hat';
  }
  return {ids,apply,mainOutfit,item:url,atlas:null};
})());
