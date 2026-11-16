'use strict';
/* V9 cosmetic rewards: all courses remain open, independent of purchase history. */
window.GAME_REWARDS=Object.freeze([
 {id:'explorer-hat',name:'探險小帽',price:80,slot:'hat',rarity:'普通',category:'outfit',description:'戴上全新探險帽，準備出發！'},
 {id:'magic-hat',name:'魔法學者帽',price:100,slot:'hat',rarity:'稀有',category:'outfit',description:'戴上星月魔法帽，成為小小學者。'},
 {id:'hero-cape',name:'閃亮英雄披風',price:200,slot:'cape',rarity:'稀有',category:'outfit',description:'穿上閃亮披風，變身學習英雄！'},
 {id:'star-glasses',name:'星星眼鏡',price:300,slot:'glasses',rarity:'稀有',category:'outfit',description:'戴上星光眼鏡，發現新知識。'},
 {id:'treehouse',name:'森林樹屋',price:500,slot:'home',rarity:'稀有',category:'scene',description:'入住溫馨森林樹屋。'},
 {id:'castle',name:'夢幻城堡',price:1000,slot:'home',rarity:'傳說',category:'scene',description:'把學習樂園變成夢幻城堡。'},
 {id:'star-library',name:'星空閱讀房',price:650,slot:'home',rarity:'稀有',category:'scene',description:'在星空下享受閱讀時光。'},
 {id:'ocean-treasure',name:'海底寶藏屋',price:900,slot:'home',rarity:'傳說',category:'scene',description:'探索珊瑚與寶箱的秘密。'},
 {id:'word-badge',name:'單字小高手',price:150,slot:'badge',rarity:'普通',category:'badge',description:'把單字挑戰的努力收進收藏櫃。'},
 {id:'reading-badge',name:'閱讀小達人',price:250,slot:'badge',rarity:'稀有',category:'badge',description:'留下美好閱讀冒險的紀念。'},
 {id:'grammar-badge',name:'文法勇者',price:350,slot:'badge',rarity:'稀有',category:'badge',description:'收藏閃耀的文法勇者之盾。'},
 {id:'review-badge',name:'複習之星',price:450,slot:'badge',rarity:'傳說',category:'badge',description:'讓持續複習的熱情發光。'}
]);
window.GAME_REWARD_RULES=Object.freeze({
 firstCorrect:10,repeatCorrect:2,
 pointsForAnswer:alreadyCorrect=>alreadyCorrect?2:10,
 canBuy:(stars,owned,id)=>{const item=window.GAME_REWARDS.find(x=>x.id===id);return !!item&&!owned.includes(id)&&stars>=item.price;},
 buy:(stars,owned,id)=>{const item=window.GAME_REWARDS.find(x=>x.id===id);if(!item||owned.includes(id)||stars<item.price)return null;return {stars:stars-item.price,owned:[...owned,id]};}
});
