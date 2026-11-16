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
 constructor(id=''){this.id=id;this.children=[];this.classList=new ClassList();this.style={};this.dataset={};this.attributes={};this.textContent='';this.value='';this.disabled=false;}
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
for(const p of ['reward-art.js','rewards.js','data.js','reading.js','game.js'])vm.runInContext(fs.readFileSync(p,'utf8'),context,{timeout:10000,filename:p});
vm.runInContext("nav('shop')",context);
assert.equal(element('shopItems').children.length,12);
assert.equal(element('collectionShelf').children.length,4);
assert(element('heroMascot').src==='character.png');
vm.runInContext('state.stars=150; save(); renderShop()',context);
let magic=element('shopItems').children.find(x=>x.children.some(n=>n.textContent==='魔法學者帽'));
assert(magic,'magic hat card missing');
let button=magic.children[magic.children.length-1];
assert.equal(button.disabled,false);
button.onclick();
assert.equal(JSON.parse(storage.guinea_game_v2).stars,50);
assert(JSON.parse(storage.guinea_game_v2).purchased.includes('magic-hat'));
assert(element('heroMascot').src.startsWith('data:image/svg+xml'));
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
console.log('PASS: V9 shop renders 12 cards and 4 badges, buys hat once, changes complete portrait, toggles equipment, and filters');
