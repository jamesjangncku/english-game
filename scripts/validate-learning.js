#!/usr/bin/env node
// Validate the deployed data.js source without changing published content.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),context,{timeout:10000});
const catalog=context.window.GAME_CATALOG, questions=context.window.GAME_QUESTIONS;
assert(Array.isArray(catalog)&&Array.isArray(questions),'Missing catalog or questions');
const valid=new Set(),bookIds=new Set();
for(const b of catalog){
  assert(b.id&&!bookIds.has(b.id),'Duplicate or missing book id');
  bookIds.add(b.id);
  for(const u of b.units||[]) for(const l of u.lessons||[]) valid.add([b.id,u.id,l.id].join('/'));
}
const seen=new Set(),errors=[],warnings=[];
for(const q of questions){
  if(!q.id||seen.has(q.id))errors.push('Duplicate/missing question id: '+q.id);
  seen.add(q.id);
  if(!valid.has([q.book,q.unit,q.lesson].join('/')))errors.push('Orphan question: '+q.id);
  if(!Array.isArray(q.options)||q.options.length<2||!q.options.every(x=>typeof x==='string'&&x.trim()))errors.push('Invalid options: '+q.id);
  if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=(q.options||[]).length)errors.push('Invalid answer index: '+q.id);
  if(!q.explanation)warnings.push('Missing explanation: '+q.id);
}
const counts=Object.fromEntries(catalog.map(b=>[b.id,questions.filter(q=>q.book===b.id).length]));
console.log(JSON.stringify({books:catalog.length,questions:questions.length,counts,errors:errors.length,warnings:warnings.length},null,2));
errors.forEach(x=>console.error('ERROR',x));
warnings.slice(0,30).forEach(x=>console.warn('WARN',x));
if(errors.length)process.exitCode=1;
