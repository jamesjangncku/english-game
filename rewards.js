'use strict';
/* Original, in-game-only cosmetic rewards. They never lock lessons. */
window.GAME_REWARDS=Object.freeze([
  {id:'magic-hat',name:'魔法帽',emoji:'🎩',price:100,slot:'hat',description:'替豚鼠戴上神奇的帽子'},
  {id:'hero-cape',name:'英雄披風',emoji:'🦸',price:200,slot:'cape',description:'豚鼠變身小小英雄'},
  {id:'treehouse',name:'專屬樹屋',emoji:'🌳',price:500,slot:'home',description:'幫豚鼠換上森林樹屋場景'},
  {id:'castle',name:'夢幻城堡',emoji:'🏰',price:1000,slot:'home',description:'為豚鼠換上夢幻城堡場景'}
]);
/* Stateless functions make the purchase and scoring rules testable. */
window.GAME_REWARD_RULES=Object.freeze({
  firstCorrect:10,
  repeatCorrect:2,
  pointsForAnswer:(alreadyCorrect)=>alreadyCorrect?2:10,
  canBuy:(stars,owned,id)=>{const item=window.GAME_REWARDS.find(x=>x.id===id);return !!item&&!owned.includes(id)&&stars>=item.price;},
  buy:(stars,owned,id)=>{const item=window.GAME_REWARDS.find(x=>x.id===id);if(!item||owned.includes(id)||stars<item.price)return null;return {stars:stars-item.price,owned:[...owned,id]};}
});
