// Audit example coverage; source-linked vocabulary questions may await authentic contextual examples.
const fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),context,{timeout:10000});
const qs=context.window.GAME_QUESTIONS||[],counts={};
const missing=[],pending=[],invalid=[];
for(const q of qs){
 const status=q.example_status||'legacy_unmarked';
 counts[status]=(counts[status]||0)+1;
 if(status==='pending_contextual_example'){
   if(q.type!=='vocabulary'||!q.source_item_id||!q.verification_status||q.review_status!=='needs_textbook_check')invalid.push(q.id);
   pending.push(q.id);
 } else if(!q.example_en||!q.example_zh)missing.push(q.id);
}
const report={total:qs.length,status:counts,missing,examples_pending_review:pending.length,invalid};
console.log(JSON.stringify(report,null,2));
if(qs.length!==997||missing.length||invalid.length||pending.length!==496)process.exitCode=1;
