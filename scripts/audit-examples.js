// Audit all bilingual examples and provenance for source-linked vocabulary additions.
const fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),context,{timeout:10000});
const qs=context.window.GAME_QUESTIONS||[];
const missing=[],termNotUsed=[],provenanceMissing=[],invalid=[],statuses={};
for(const q of qs){
 const status=q.example_status||'unspecified';
 statuses[status]=(statuses[status]||0)+1;
 if(!q.example_en||!q.example_zh) missing.push(q.id);
 if(q.example_origin==='original_teaching_example'){
   const term=q.book==='journeys' ? q.options[q.answer] : (q.question.match(/[“"]([^”"]+)[”"]/)||[])[1];
   if(!term||!q.example_en.toLowerCase().includes(term.toLowerCase()))termNotUsed.push(q.id);
   if(!q.source_file||!q.source_item_id||!q.verification_status||q.review_status!=='needs_textbook_check')provenanceMissing.push(q.id);
   if(!q.example_review_status||q.example_status!=='new_question_specific')invalid.push(q.id);
 }
}
const added=qs.filter(q=>q.example_origin==='original_teaching_example');
const counts=Object.fromEntries(['journeys','science','social'].map(b=>[b,added.filter(q=>q.book===b).length]));
console.log(JSON.stringify({total:qs.length,examples_complete:qs.length-missing.length,new_source_linked:added.length,byBook:counts,statuses,missing,termNotUsed,provenanceMissing,invalid},null,2));
if(qs.length!==997||added.length!==496||counts.journeys!==240||counts.science!==256||missing.length||termNotUsed.length||provenanceMissing.length||invalid.length)process.exitCode=1;
