// Quality report for question-specific example sentences. Run with: node scripts/audit-examples.js
const fs=require('fs'),vm=require('vm');
const context={window:{}};vm.runInNewContext(fs.readFileSync('data.js','utf8'),context);
const qs=context.window.GAME_QUESTIONS||[];
const byStatus={};const missing=[];const pending=[];
for(const q of qs){
 const status=q.example_status||'legacy_lesson_example';
 byStatus[status]=(byStatus[status]||0)+1;
 if(!q.example_en||!q.example_zh)missing.push(q.id);
 if(status!=='new_question_specific')pending.push(q.id);
}
console.log(JSON.stringify({total:qs.length,status:byStatus,missing,remaining:pending.length},null,2));
const legacy=qs.filter(q=>q.example_status!=='new_question_specific').map(q=>q.id);
const badIds=qs.filter(q=>!q.id||!q.example_en||!q.example_zh).map(q=>q.id);
console.log('Example audit:',qs.length,'total;',legacy.length,'not rewritten;',badIds.length,'missing fields');
if(qs.length!==501||missing.length||legacy.length||badIds.length)process.exitCode=1;
