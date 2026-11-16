#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class ClassList{
 constructor(){this.items=new Set();}
 toggle(name,on){if(on===undefined)on=!this.items.has(name);if(on)this.items.add(name);else this.items.delete(name);return on;}
 add(name){this.items.add(name);}
 remove(name){this.items.delete(name);}
 contains(name){return this.items.has(name);}
}
class Element{
 constructor(id=''){this.id=id;this.children=[];this.classList=new ClassList();this.style={removeProperty(name){delete this[name];}};this.dataset={};this.attributes={};this.textContent='';this.value='';this.disabled=false;}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=[...items];}
 setAttribute(a,v){this.attributes[a]=v;}
 querySelectorAll(){return this.children.filter(x=>x.id==='shop-filter');}
 scrollIntoView(){}
 closest(){return new Element();}
 after(){}
 remove(){}
}
const map=new Map();
const element=(id)=>{if(!map.has(id))map.set(id,new Element(id));return map.get(id);};
for(const name of ['all','outfit','scene','badge']){const b=new Element('shop-filter');b.dataset.filter=name;element('shopFilters').append(b);}
const document={getElementById:element,createElement:(tag)=>new Element(tag),querySelector:()=>element('hero')};
const storage={};
const context=vm.createContext({window:{scrollTo:()=>{}},document,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},alert:()=>{},confirm:()=>true,console,Math,Date,Set,JSON});
for(const p of ['reward-art.js','approved-art.js','rewards.js','data.js','reading.js','reading-addon.js','game.js'])vm.runInContext(fs.readFileSync(p,'utf8'),context,{timeout:10000,filename:p});
vm.runInContext("nav('shop')",context);
assert.equal(element('shopItems').children.length,12);
assert.equal(element('collectionShelf').children.length,4);
assert.equal(element('heroMascot').attributes['data-art-id'],'explorer-hat');
vm.runInContext('state.stars=150; save(); renderShop()',context);
let magic=element('shopItems').children.find(x=>x.children.some(n=>n.textContent==='魔法學者帽'));
assert(magic,'magic hat card missing');
let button=magic.children[magic.children.length-1];
assert.equal(button.disabled,false);
button.onclick();
assert.equal(JSON.parse(storage.guinea_game_v2).stars,150);
element('detailClose').onclick();
assert.equal(JSON.parse(storage.guinea_game_v2).stars,150);
button.onclick();
element('detailBuy').onclick();
assert.equal(JSON.parse(storage.guinea_game_v2).stars,50);
assert(JSON.parse(storage.guinea_game_v2).purchased.includes('magic-hat'));
assert.equal(element('heroMascot').attributes['data-art-id'],'magic-hat');
vm.runInContext("renderShop()",context);
magic=element('shopItems').children.find(x=>x.children.some(n=>n.textContent==='魔法學者帽'));
button=magic.children[magic.children.length-1];
assert.equal(button.textContent,'✓ 使用中 · 點擊卸下');
button.onclick();
assert.equal(JSON.parse(storage.guinea_game_v2).stars,50,'removing equipment should not refund or charge');
assert.equal(JSON.parse(storage.guinea_game_v2).equipped.hat,null);
vm.runInContext("shopFilter='badge';renderShop()",context);
assert.equal(element('shopItems').children.length,4);
vm.runInContext("shopFilter='scene';renderShop()",context);
assert.equal(element('shopItems').children.length,4);
const css=fs.readFileSync('style.css','utf8');
assert(css.includes('.mascot-wrap img.mascot')&&css.includes('width: 100%;')&&css.includes('height: auto;')&&css.includes('aspect-ratio: 336 / 246'),'Avatar crop must preserve 336x246 atlas cell ratio');
assert(css.includes('#shop .shop-sidebar .reward-preview')&&css.includes('#shop .reward-preview img.shop-portrait'),'Shop preview and homepage character must use a consistent fixed aspect ratio');
console.log('PASS: V9 shop renders 12 cards and 4 badges, buys hat once, changes complete portrait, toggles equipment, and filters');

// Each item supports equip, switching, removal and re-equip.
const rewardItems=context.window.GAME_REWARDS;
const action=(item)=>element('shopItems').children
 .find(card=>card.children[1].textContent===item.name).children.at(-1);
const current=()=>JSON.parse(storage.guinea_game_v2);
vm.runInContext("state.stars=6000; state.purchased=['word-badge']; state.equipped={}; shopFilter='all'; renderShop()",context);
for(const item of rewardItems){
 const before=vm.runInContext('state.stars',context);
 action(item).onclick();
 if(item.id!=='word-badge')element('detailBuy').onclick();
 const remaining=before-(item.id==='word-badge'?0:item.price);
 assert.equal(current().stars,remaining);
 assert.equal(current().equipped[item.slot],item.id);
 const views={outfit:['heroMascot','shopPortrait'],scene:['heroScene','shopScene'],badge:['heroBadge','shopBadge']}[item.category];
 for(const id of views){
  const view=element(id);
  assert.equal(view.attributes['data-art-id'],item.id);
  assert.equal(view.src,'assets/'+item.id+'.webp');
  assert.notEqual(view.hidden,true);
 }
 if(item.category==='scene')assert(element('hero').style.backgroundImage.includes(item.id+'.webp'));
 if(item.category==='badge'){
  assert(element('collectionShelf').children.some(cell=>cell.classList.contains('badge-equipped')));
  assert(element('showcaseBadges').children.some(cell=>cell.children[1]?.textContent===item.name));
 }
 action(item).onclick();
 assert.equal(current().equipped[item.slot],null);
 assert.equal(current().stars,remaining);
 if(item.category!=='outfit')for(const id of views)assert.equal(element(id).hidden,true);
 action(item).onclick();
 assert.equal(current().stars,remaining);
 assert.equal(current().purchased.filter(id=>id===item.id).length,1);
}
assert.equal(current().equipped.home,'ocean-treasure');
assert.equal(current().equipped.badge,'review-badge');
assert.equal(current().equipped.glasses,'star-glasses');
assert.equal(current().equipped.cape,null);
vm.runInContext("state=JSON.parse(localStorage.getItem(KEY)); nav('shop')",context);
assert.equal(element('shopScene').attributes['data-art-id'],'ocean-treasure');
assert.equal(element('shopBadge').attributes['data-art-id'],'review-badge');
vm.runInContext("$('clearStats').onclick(); nav('shop')",context);
assert.equal(current().stars,0);
assert.equal(element('shopItems').children.filter(card=>card.children.at(-1).disabled).length,12);
assert.equal(element('shopScene').hidden,true);
assert.equal(element('shopBadge').hidden,true);
console.log('PASS: 12 items, purchase/equip/remove/re-equip, all render targets, persistence, balance and reset');

const run=(source)=>vm.runInContext(source,context);
for(const course of context.window.GAME_CATALOG){
 run(`chooseBook(${JSON.stringify(course.id)}); chooseUnit(book.units[0].id)`);
 if(course.units[0].lessons.length>1)element('lessons').children[1].onclick();
 element('studyMode').onclick();
 assert(element('lessonReview').children.some(node=>node.children[0]?.id==='summary'));
 element('mixedMode').onclick();
 assert(element('options').children.length>=2);
 assert.equal(run("pool.every(q=>q.book===book.id)"),true);
 element('backSelect').onclick();
 assert(!element('select').classList.contains('hide'));
}
run(`const reading=window.GAME_READING_QUESTIONS[0];
 chooseBook(reading.book); chooseUnit(reading.unit);
 if(unit.lessons.length>1){
  $('lessons').children[unit.lessons.findIndex(x=>x.id===reading.lesson)+1].onclick();
 }`);
element('readingMode').onclick();
assert(!element('readingPassage').classList.contains('hide'));
const incorrectId=run('pool[pos].id');
element('options').children[run('(currentAnswer+1)%currentOptions.length')].onclick();
assert(current().wrong.includes(incorrectId));
assert.equal(current().stars,0);
assert(element('explanation').textContent.startsWith('正確答案'));
element('navWrong').onclick();
assert.equal(run('pool[0].id'),incorrectId);
element('options').children[run('currentAnswer')].onclick();
assert.equal(current().stars,10);
assert.equal(current().wrong.length,0);
element('next').onclick();
element('navStats').onclick();
assert(element('statsBody').children[0].textContent.includes('完成闖關：1'));
run('start([window.GAME_READING_QUESTIONS.find(q=>state.correctIds.includes(q.id))],true); answer(currentAnswer)');
assert.equal(current().stars,12);
console.log('PASS: all available books, lesson review, mixed and reading modes, feedback, correct/repeat points, wrong-answer review, completion and stats');

// Long pools are capped, and short pools use the available questions.
run('start(questions.slice(0,13),true)');
assert.equal(run('pool.length'),7);
assert.equal(element('qcounter').textContent,'第 1 / 7 題');
for(let i=0;i<7;i++){
 run('answer(currentAnswer)');
 element('next').onclick();
}
assert(!element('finish').classList.contains('hide'));
assert.equal(current().history[0].total,7);
run('start(questions.slice(0,3),true)');
assert.equal(run('pool.length'),3);
const course=context.window.GAME_CATALOG.find(book=>book.id==='journeys');
run(`chooseBook(${JSON.stringify(course.id)}); chooseUnit(book.units[0].id)`);
element('lessons').children[1].onclick();
element('readingMode').onclick();
assert.equal(run('pool.length'),7);
const firstReadingIds=run('pool.map(q=>q.id)');
element('readingMode').onclick();
assert(run('pool.map(q=>q.id)').every(id=>!firstReadingIds.includes(id)));
element('mixedMode').onclick();
assert.equal(run('pool.length'),7);
console.log('PASS: 7-question mixed, reading and review rounds; short pool, finish screen and repeat reading');

// Start with an independent test save and leave zero in storage after reset.
const testKey='guinea_game_v9_english_test';
storage.guinea_game_v2=JSON.stringify({stars:123});
function reloadTestBuild(){
 const fresh=vm.createContext({window:{scrollTo:()=>{},GAME_TEST_MODE:{storageKey:testKey,startingStars:6000}},document,
  localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},
  alert:()=>{},confirm:()=>true,console});
 for(const file of ['approved-art.js','rewards.js','data.js','reading.js','reading-addon.js','game.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),fresh,{filename:file});
 }
 return fresh;
}
let testContext=reloadTestBuild();
assert.equal(JSON.parse(storage[testKey]).stars,6000);
const fullPrice=rewardItems.reduce((sum,item)=>sum+item.price,0);
vm.runInContext("nav('shop')",testContext);
for(const item of rewardItems){
 action(item).onclick();
 element('detailBuy').onclick();
}
assert.equal(JSON.parse(storage[testKey]).stars,6000-fullPrice);
element('resetTestStars').onclick();
assert.equal(JSON.parse(storage[testKey]).stars,0);
assert.equal(JSON.parse(storage[testKey]).purchased.length,12);
testContext=reloadTestBuild();
assert.equal(vm.runInContext('state.stars',testContext),0);
assert.equal(JSON.parse(storage.guinea_game_v2).stars,123);
const english=testContext.window;
assert.deepEqual(Array.from(vm.runInContext('catalog',testContext),b=>b.id),['journeys','science','social']);
assert.deepEqual(Array.from(vm.runInContext('catalog',testContext),b=>b.name),[
 'Journeys Grade 6','ScienceFusion Grade 5','HMH Social Studies Grade 6'
]);
for(const unit of english.GAME_CATALOG.find(book=>book.id==='journeys').units){
 for(const lesson of unit.lessons){
  assert.equal(english.GAME_READING_QUESTIONS.filter(q=>q.book==='journeys'&&q.unit===unit.id&&q.lesson===lesson.id).length,50);
 }
}
console.log('PASS: three English textbooks, reading for all Journeys lessons, starter stars buy all 12 items, zero persists, original save is isolated');

assert(!fs.readFileSync('index.html','utf8').includes('test-mode.js'));
