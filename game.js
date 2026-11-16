'use strict';const $=id=>document.getElementById(id),catalog=window.GAME_CATALOG||[],questions=window.GAME_QUESTIONS||[];const KEY='guinea_game_v2';let book=null,unit=null,lesson=null,pool=[],pos=0,score=0,locked=false,review=false;let currentOptions=[],currentAnswer=-1,readingSession=false;let state;try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{state={}}state={stars:0,runs:0,wrong:[],history:[],correctIds:[],purchased:[],equipped:{hat:null,cape:null,glasses:null,home:null},...state};if(!Array.isArray(state.correctIds))state.correctIds=[];if(!Array.isArray(state.purchased))state.purchased=[];if(!state.equipped||typeof state.equipped!=='object')state.equipped={hat:null,cape:null,glasses:null,home:null};state.stars=Math.max(0,Number(state.stars)||0);let earnedThisRun=0;const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};function nav(page){['home','select','quiz','finish','stats','shop'].forEach(x=>$(x).classList.toggle('hide',x!==page));['navHome','navWrong','navStats','navShop'].forEach(x=>$(x).classList.remove('active'));if(page==='home')$('navHome').classList.add('active');if(page==='stats')$('navStats').classList.add('active');if(page==='shop'){$('navShop').classList.add('active');renderShop();}syncOutfits();$('stars').textContent='⭐ '+state.stars+' 星星';$('done').textContent='🏆 '+state.runs+' 次闖關';window.scrollTo({top:0,behavior:'smooth'})}function speak(s){if(!('speechSynthesis'in window))return alert('瀏覽器不支援語音');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s.replaceAll('_____','blank'));u.lang='en-US';u.rate=.85;speechSynthesis.speak(u)}function renderBooks(){$('books').replaceChildren();catalog.forEach(b=>{const d=document.createElement('article');d.className='book';const count=questions.filter(q=>q.book===b.id).length;d.innerHTML=`<div class="emoji">${b.emoji}</div><h3>${b.name}</h3><p>${b.subtitle}</p><p>${b.units.length} Units · ${count} 題練習題</p>`;const btn=document.createElement('button');btn.textContent='開始冒險 →';btn.onclick=()=>chooseBook(b.id);d.append(btn);$('books').append(d)})}function chooseBook(id){book=catalog.find(b=>b.id===id);$('bookTitle').textContent=book.emoji+' '+book.name;$('units').replaceChildren();$('lessons').replaceChildren();$('modeChoice').classList.add('hide');book.units.forEach(u=>{const b=document.createElement('button');b.className='unit';b.textContent='📖 '+u.name;b.onclick=()=>chooseUnit(u.id);$('units').append(b)});nav('select')}function chooseUnit(id){unit=book.units.find(u=>u.id===id);$('lessons').replaceChildren();if(unit.lessons.length===1){lesson=unit.lessons[0];const items=questions.filter(q=>q.book===book.id&&q.unit===unit.id&&q.lesson===lesson.id);showModes(items);return;}const title=document.createElement('h3');title.textContent=unit.name+' · 課次';$('lessons').append(title);unit.lessons.forEach(l=>{const n=questions.filter(q=>q.book===book.id&&q.unit===unit.id&&q.lesson===l.id).length;const b=document.createElement('button');b.className='lesson';b.disabled=n===0;b.textContent=(n?'🎮 ':'🔒 ')+l.name;const small=document.createElement('small');small.textContent=n?`題庫 ${n} 題 · 每次最多隨機20題`:'題庫待補，暫未開放';b.append(small);b.onclick=()=>{lesson=l;showModes(questions.filter(q=>q.book===book.id&&q.unit===unit.id&&q.lesson===l.id))};$('lessons').append(b)});[...$('units').children].forEach((b,i)=>b.classList.toggle('active',book.units[i].id===id))}function start(items,isReview=false,isReading=false){readingSession=isReading;if(!items.length){alert('這個範圍尚未有題目。');return}pool=[...items];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}if(readingSession){const key='last_reading_'+book.id+'_'+unit.id+'_'+lesson.id;let previous=[];try{previous=JSON.parse(localStorage.getItem(key)||'[]')}catch{};const unseen=pool.filter(q=>!previous.includes(q.id));const seen=pool.filter(q=>previous.includes(q.id));pool=[...unseen,...seen].slice(0,20);try{localStorage.setItem(key,JSON.stringify(pool.map(q=>q.id)))}catch{}}else pool=pool.slice(0,20);pos=0;score=0;earnedThisRun=0;review=isReview;$('backSelect').textContent=(!isReview&&unit&&unit.lessons.length===1)?'← 返回單元':'← 返回課次';nav('quiz');renderQuestion()}function renderQuestion(){locked=false;const q=pool[pos];const order=q.options.map((_,i)=>i);for(let k=order.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[order[k],order[j]]=[order[j],order[k]];}currentOptions=order.map(i=>q.options[i]);currentAnswer=order.indexOf(q.answer);$('crumb').textContent=review?'錯題複習':`${book.name} · ${unit.name} · ${lesson.name}`;$('qcounter').textContent=`第 ${pos+1} / ${pool.length} 題`;$('qscore').textContent='⭐ '+score;$('barfill').style.width=(pos/pool.length*100)+'%';$('qtype').textContent=({vocabulary:'🔤 單字挑戰',reading:'📖 閱讀理解',grammar:'✏️ 文法練習',concept:'🧠 學科觀念'}[q.type]||'🧠 觀念理解');$('question').textContent=q.question;const passageBox=$('readingPassage');if(q.passage){passageBox.classList.remove('hide');$('readingTitle').textContent=q.passage_title||'Reading Passage';$('readingText').textContent=q.passage;}else passageBox.classList.add('hide');$('options').replaceChildren();currentOptions.forEach((x,i)=>{const b=document.createElement('button');b.className='option';b.textContent=String.fromCharCode(65+i)+'. '+x;b.onclick=()=>answer(i);$('options').append(b)});$('feedback').classList.add('hide')}function answer(i){if(locked)return;locked=true;const q=pool[pos],ok=i===currentAnswer;const bad=new Set(state.wrong);if(ok){score+=10;const first=!state.correctIds.includes(q.id);const earned=window.GAME_REWARD_RULES.pointsForAnswer(!first);state.stars+=earned;earnedThisRun+=earned;if(first)state.correctIds.push(q.id);bad.delete(q.id)}else bad.add(q.id);state.wrong=[...bad];save();[...$('options').children].forEach((b,j)=>{b.disabled=true;if(j===currentAnswer)b.classList.add('correct');else if(j===i)b.classList.add('wrong')});$('verdict').textContent=ok?'🎉 答對了！豚鼠為你歡呼！':'💪 再試一次，你會更厲害！';$('explanation').textContent='正確答案：'+String.fromCharCode(65+currentAnswer)+'. '+currentOptions[currentAnswer]+'。'+q.explanation;const sameLesson=window.GAME_QUESTIONS.filter(x=>x.book===q.book&&x.unit===q.unit&&x.lesson===q.lesson);
const repeated=sameLesson.length>1&&sameLesson.every(x=>x.example_en===q.example_en);
const isGoPast=/past form of [“"]go[”"]/i.test(q.question)&&q.options[q.answer]?.toLowerCase()==='went';
const exampleBox=$('exampleEn').closest('.example');
if(isGoPast){
  $('exampleEn').textContent='Yesterday, I went to school.';
  $('exampleZh').textContent='昨天我去上學。';
  exampleBox.classList.remove('hide');
}else if(repeated){
  $('exampleEn').textContent='';
  $('exampleZh').textContent='';
  exampleBox.classList.add('hide');
}else{
  $('exampleEn').textContent=q.example_en||'';
  $('exampleZh').textContent=(q.example_zh_kind==='concept_explanation'?'中文重點：':'')+(q.example_zh||'');
  exampleBox.classList.toggle('hide',!q.example_en);
}$('feedback').classList.remove('hide');$('next').textContent=pos===pool.length-1?'🏆 查看成績':'下一題 →';$('qscore').textContent='⭐ '+score;$('stars').textContent='⭐ '+state.stars+' 星星'}function finish(){state.runs++;state.history.unshift({date:new Date().toLocaleDateString('zh-TW'),title:review?'錯題複習':book.name+' / '+unit.name,score,total:pool.length});state.history=state.history.slice(0,30);save();nav('finish');$('finish').replaceChildren();const h=document.createElement('h2');h.textContent='🏆 闖關完成！';const p=document.createElement('p');p.textContent=`答對 ${score/10} / ${pool.length} 題，本次獲得 ${earnedThisRun} 顆星星！`;const b=document.createElement('button');b.className='primary';b.textContent='🐹 再玩一次';b.onclick=()=>start(review?[...questions,...(window.GAME_READING_QUESTIONS||[])].filter(q=>state.wrong.includes(q.id)):(readingSession?window.GAME_READING_QUESTIONS.filter(q=>q.book===book.id&&q.unit===unit.id&&q.lesson===lesson.id):questions.filter(q=>q.book===book.id&&q.unit===unit.id&&q.lesson===lesson.id)),review,readingSession);const home=document.createElement('button');home.className='outline';home.textContent='返回首頁';home.style.marginLeft='12px';home.onclick=()=>nav('home');$('finish').append(h,p,b,home)}function wrongReview(){const set=new Set(state.wrong),items=[...questions,...(window.GAME_READING_QUESTIONS||[])].filter(q=>set.has(q.id));if(!items.length){alert('目前沒有錯題！先去闖關吧。');return}start(items,true)}function stats(){nav('stats');$('statsBody').replaceChildren();const p=document.createElement('p');p.textContent=`可用星星：${state.stars}　已首次答對：${state.correctIds.length} 題　已購買商品：${state.purchased.length} 件　完成闖關：${state.runs} 次　待複習錯題：${state.wrong.length} 題`;$('statsBody').append(p);state.history.forEach(h=>{const x=document.createElement('p');x.textContent=`${h.date} · ${h.title} · ${h.score/10}/${h.total} 題`;$('statsBody').append(x)})}function goSelect(){if(!book){nav('home');return}const previousUnit=unit;chooseBook(book.id);if(previousUnit&&previousUnit.lessons.length>1)chooseUnit(previousUnit.id)}$('navHome').onclick=()=>nav('home');$('navWrong').onclick=wrongReview;$('navStats').onclick=stats;$('navShop').onclick=()=>nav('shop');$('backHome').onclick=()=>nav('home');$('backSelect').onclick=goSelect;$('speakQuestion').onclick=()=>speak(pool[pos].question);$('speakPassage').onclick=()=>speak(pool[pos].passage||'');$('speakExample').onclick=()=>speak(pool[pos].example_en);$('next').onclick=()=>{pos++;pos<pool.length?renderQuestion():finish()};$('clearStats').onclick=()=>{if(confirm('確定清除本機所有學習紀錄？')){state={stars:0,runs:0,wrong:[],history:[],correctIds:[],purchased:[],equipped:{hat:null,cape:null,glasses:null,home:null}};syncOutfits();save();stats()}};renderBooks();nav('home');

function showModes(items){$('modeChoice').classList.remove('hide');$('mixedMode').onclick=()=>start(items);$('readingMode').onclick=()=>{const r=(window.GAME_READING_QUESTIONS||[]).filter(q=>q.book===book.id&&q.unit===unit.id&&q.lesson===lesson.id);if(!r.length){alert('本課尚無獨立閱讀文章題庫，請使用綜合練習中的閱讀理解題。');return;}start(r,false,true)};$('modeChoice').scrollIntoView({behavior:'smooth',block:'center'});}

/* Lesson preview uses only already-loaded, reviewed question bank content. */
function showLessonReview(items){
  let panel=$('lessonReview');
  if(!panel){panel=document.createElement('section');panel.id='lessonReview';panel.className='lesson-review';$('modeChoice').after(panel);}
  panel.replaceChildren();
  const h=document.createElement('h3');h.textContent='📚 課前複習 · '+(lesson?.name||'本課');panel.append(h);
  const info=document.createElement('p');info.className='muted';info.textContent='以下內容擷取自現有練習題與解析，並非課本原文。';panel.append(info);
  items.slice(0,30).forEach((q,i)=>{
    const d=document.createElement('details');d.className='review-item';
    const summary=document.createElement('summary');summary.textContent=(i+1)+'. '+q.question;d.append(summary);
    const a=document.createElement('p');a.textContent='正確答案：'+(q.options?.[q.answer]||'待確認');d.append(a);
    if(q.explanation){const p=document.createElement('p');p.textContent='解析：'+q.explanation;d.append(p);}
    if(q.example_en){const p=document.createElement('p');p.textContent='例句：'+q.example_en;d.append(p);}
    panel.append(d);
  });
  panel.scrollIntoView({behavior:'smooth',block:'start'});
}
const originalShowModes=showModes;
showModes=function(items){
  originalShowModes(items);
  let btn=$('studyMode');
  if(!btn){btn=document.createElement('button');btn.id='studyMode';btn.className='outline';btn.textContent='📚 課前複習（題目與解析）';$('modeChoice').append(btn);}
  btn.onclick=()=>showLessonReview(items);
  const old=$('lessonReview');if(old)old.remove();
  const reading=(window.GAME_READING_QUESTIONS||[]).filter(q=>q.book===book.id&&q.unit===unit.id&&q.lesson===lesson.id);
  $('readingMode').disabled=reading.length===0;
  $('readingMode').title=reading.length===0?'目前沒有獨立閱讀短文題庫':'';
};


/* V9: cosmetics and collectible gallery, independent of all lessons. */
let shopFilter='all';
function owned(id){return state.purchased.includes(id);}
function equipped(item){return state.equipped?.[item.slot]===item.id;}
function syncOutfits(){
 const hat=owned(state.equipped?.hat)?state.equipped.hat:null;
 const cape=owned(state.equipped?.cape)?state.equipped.cape:null;
 const glasses=owned(state.equipped?.glasses)?state.equipped.glasses:null;
 const scene=owned(state.equipped?.home)?state.equipped.home:null;
 const img=$('heroMascot');
 window.GAME_APPROVED_ART.apply(img,window.GAME_APPROVED_ART.mainOutfit({hat,cape,glasses}));
 img.alt='精緻造型的豚鼠探險家';
 const labels=[];
 for(const id of [hat,cape,glasses,scene]){
  const item=window.GAME_REWARDS.find(r=>r.id===id);
  if(item)labels.push(item.name);
 }
 $('heroOutfitCaption').textContent=labels.length?labels.join(' · '):'我的冒險夥伴';
 const hero=document.querySelector('.hero');
 hero.classList.toggle('hero-treehouse',scene==='treehouse');
 hero.classList.toggle('hero-castle',scene==='castle');
 hero.classList.toggle('hero-star-library',scene==='star-library');
 hero.classList.toggle('hero-ocean-treasure',scene==='ocean-treasure');
 hero.style.backgroundImage=scene
  ?'linear-gradient(90deg,rgba(248,254,240,.82),rgba(255,255,255,.24)),url("'+window.GAME_REWARD_ART.scene(scene)+'")'
  :'';
 hero.style.backgroundSize=scene?'cover':'';
 hero.style.backgroundPosition=scene?'center':'';
}
function renderShop(){
 const items=window.GAME_REWARDS,art=window.GAME_REWARD_ART;
 $('shopBalance').textContent='⭐ 可用星星：'+state.stars+' 顆';
 for(const b of $('shopFilters').querySelectorAll('button')){
  const active=b.dataset.filter===shopFilter;
  b.classList.toggle('active',active);
  b.setAttribute('aria-pressed',String(active));
  b.onclick=()=>{shopFilter=b.dataset.filter;renderShop();};
 }
 const preview=$('rewardPreview');preview.replaceChildren();
 const img=document.createElement('img');
 window.GAME_APPROVED_ART.apply(img,window.GAME_APPROVED_ART.mainOutfit(state.equipped));
 img.className='shop-portrait';img.alt='已核准的豚鼠精緻角色造型';preview.append(img);
 const hint=document.createElement('p');hint.className='shop-portrait-label';
 hint.textContent='我的冒險夥伴 · 自由換裝';
 preview.append(hint);
 const scene=state.equipped?.home&&owned(state.equipped.home)?state.equipped.home:null;
 preview.style.backgroundImage=scene?'linear-gradient(#ffffff55,#ffffff55),url("'+art.scene(scene)+'")':'';
 preview.style.backgroundSize=scene?'cover':'';
 const summary=$('equipSummary');summary.replaceChildren();
 const ownedCount=document.createElement('p');ownedCount.textContent='已收藏 '+state.purchased.length+' / '+items.length+' 件商品';summary.append(ownedCount);
 const using=items.filter(x=>x.category!=='badge'&&equipped(x)&&owned(x));
 const equippedText=document.createElement('p');equippedText.textContent='使用中：'+(using.length?using.map(x=>x.name).join('、'):'預設造型');
 summary.append(equippedText);
 const shelf=$('collectionShelf');shelf.replaceChildren();
 for(const badge of items.filter(x=>x.category==='badge')){
  const box=document.createElement('div');box.className='badge-mini'+(owned(badge.id)?' badge-owned':'');
  const picture=document.createElement('img');window.GAME_APPROVED_ART.apply(picture,badge.id);picture.alt=badge.name;
  const label=document.createElement('small');label.textContent=owned(badge.id)?badge.name:'尚未收藏';
  box.append(picture,label);shelf.append(box);
 }
 const area=$('shopItems');area.replaceChildren();
 for(const item of items.filter(x=>shopFilter==='all'||x.category===shopFilter)){
  const card=document.createElement('article');card.className='shop-card v9-item';
  if(owned(item.id))card.classList.add('purchased');
  const artwrap=document.createElement('div');artwrap.className='shop-art';
  const picture=document.createElement('img');window.GAME_APPROVED_ART.apply(picture,item.id);picture.alt=item.name+'商品插畫';picture.loading='lazy';
  artwrap.append(picture);
  const peek=document.createElement('button');peek.type='button';peek.className='shop-peek';peek.textContent='⌕';peek.setAttribute('aria-label','查看「'+item.name+'」商品大圖');peek.onclick=()=>showRewardDetail(item);artwrap.append(peek);
  const rarity=document.createElement('span');rarity.className='rarity '+(item.rarity==='傳說'?'legendary':item.rarity==='稀有'?'rare':'common');
  rarity.textContent=item.rarity;artwrap.append(rarity);
  const name=document.createElement('h3');name.textContent=item.name;
  const desc=document.createElement('p');desc.className='shop-description';desc.textContent=item.description;
  const price=document.createElement('div');price.className='shop-price';price.textContent='⭐ '+item.price;
  const button=document.createElement('button');button.type='button';button.className='shop-buy';
  const isOwned=owned(item.id),active=isOwned&&equipped(item);
  button.textContent=!isOwned?'⭐ '+item.price+' · 兌換':item.category==='badge'?'✓ 已收藏':active?'✓ 使用中 · 點擊卸下':'使用商品';
  button.disabled=(!isOwned&&state.stars<item.price)||(isOwned&&item.category==='badge');
  button.title=!isOwned&&state.stars<item.price?'還需要 '+(item.price-state.stars)+' 顆星星':'';
  button.onclick=()=>{
   if(!owned(item.id)){
    if(!window.GAME_REWARD_RULES.canBuy(state.stars,state.purchased,item.id))return;
    if(!confirm('確定使用 '+item.price+' 顆星星兌換「'+item.name+'」嗎？'))return;
    const result=window.GAME_REWARD_RULES.buy(state.stars,state.purchased,item.id);
    if(!result)return;
    state.stars=result.stars;state.purchased=result.owned;
    if(item.category!=='badge')state.equipped[item.slot]=item.id;
    $('shopMessage').textContent='🎉 成功收藏「'+item.name+'」！';
   }else if(item.category!=='badge'){
    state.equipped[item.slot]=active?null:item.id;
    $('shopMessage').textContent=active?'已卸下「'+item.name+'」。':'已穿戴／啟用「'+item.name+'」。';
   }
   save();syncOutfits();$('stars').textContent='⭐ '+state.stars+' 星星';renderShop();
  };
  card.append(artwrap,name,desc,price,button);area.append(card);
 }
 renderRewardShowcase(items,art);
}
function renderRewardShowcase(items,art){
 const equip=$('showcaseEquipment'),badges=$('showcaseBadges');equip.replaceChildren();badges.replaceChildren();
 const equippedItems=items.filter(x=>x.category!=='badge'&&owned(x.id)&&equipped(x));
 const badgeItems=items.filter(x=>x.category==='badge'&&owned(x.id));
 for(const [target,list,placeholder] of [[equip,equippedItems,'目前沒有裝備，快來挑選喜歡的配件！'],[badges,badgeItems,'收集漂亮的徽章，記錄每一步學習成果！']]){
  if(!list.length){const p=document.createElement('p');p.className='showcase-placeholder';p.textContent=placeholder;target.append(p);}
  for(const item of list){const c=document.createElement('button');c.type='button';c.className='showcase-item';const img=document.createElement('img');window.GAME_APPROVED_ART.apply(img,item.id);img.alt=item.name;const title=document.createElement('span');title.textContent=item.name;c.append(img,title);c.onclick=()=>showRewardDetail(item);target.append(c);}
 }
}
function showRewardDetail(item){
 const dialog=$('rewardDetail');dialog.classList.remove('hide');
 window.GAME_APPROVED_ART.apply($('detailArt'),item.id);$('detailArt').alt=item.name+'大圖';
 $('detailTitle').textContent=item.name;$('detailDescription').textContent=item.description;
 $('detailPrice').textContent=owned(item.id)?'✓ 已收藏':'⭐ '+item.price+' 顆星星';
 $('detailRarity').textContent=item.rarity;
 const b=$('detailBuy');b.textContent=owned(item.id)?'關閉介紹':'前往兌換';
 b.onclick=()=>{closeRewardDetail();if(!owned(item.id)){shopFilter=item.category;renderShop();const target=$('shopItems');if(target&&target.scrollIntoView)target.scrollIntoView({behavior:'smooth',block:'start'});}};
 $('detailClose').onclick=closeRewardDetail;
 const backdrop=dialog.querySelector?.('.reward-detail-backdrop');if(backdrop)backdrop.onclick=closeRewardDetail;
}
function closeRewardDetail(){$('rewardDetail').classList.add('hide');}

