'use strict';
/* Cropped, approved high-detail illustrations from the V9 concept sheet.
   Original graphic is packed into one locally hosted SVG atlas so the page
   needs no third-party image server. Each cell is 336 by 246 pixels. */
window.GAME_APPROVED_ART=Object.freeze((()=>{
 const atlas='assets/v9-approved-art-atlas.svg';
 const transparent='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
 const ids=[
  'explorer-hat','magic-hat','hero-cape','star-glasses',
  'treehouse','castle','star-library','ocean-treasure',
  'word-badge','reading-badge','grammar-badge','review-badge'
 ];
 const lookup=Object.fromEntries(ids.map((id,i)=>[id,{row:Math.floor(i/4),col:i%4}]));
 function apply(element,id){
  const pos=lookup[id]||lookup['explorer-hat'];
  if('src'in element)element.src=transparent;
  element.style.backgroundImage='url("'+atlas+'")';
  element.style.backgroundSize='400% 300%';
  element.style.backgroundPosition=(pos.col*100/3)+'% '+(pos.row*50)+'%';
  element.style.backgroundRepeat='no-repeat';
  element.style.backgroundColor='#fff4d6';
  element.setAttribute('data-art-id',id);
 }
 function mainOutfit(equipped={}){
  if(equipped.cape==='hero-cape')return 'hero-cape';
  if(equipped.glasses==='star-glasses')return 'star-glasses';
  if(equipped.hat==='magic-hat')return 'magic-hat';
  return 'explorer-hat';
 }
 return {atlas,ids,apply,mainOutfit};
})());
