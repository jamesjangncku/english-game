'use strict';
/* Original scalable illustrations; item artwork is not emoji or a pasted overlay. */
(()=> {
 const frame=(inner,w=360,h=260)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'" role="img"><defs>'
 +'<radialGradient id="gold"><stop stop-color="#fff8c4"/><stop offset=".64" stop-color="#ffc85c"/><stop offset="1" stop-color="#e7881d"/></radialGradient>'
 +'<linearGradient id="sky" x2=".3" y2="1"><stop stop-color="#a4deff"/><stop offset="1" stop-color="#fff8d6"/></linearGradient>'
 +'<linearGradient id="purple" x2="0" y2="1"><stop stop-color="#6d58c5"/><stop offset="1" stop-color="#272978"/></linearGradient>'
 +'<linearGradient id="red" x2="0" y2="1"><stop stop-color="#ff7374"/><stop offset="1" stop-color="#a52347"/></linearGradient>'
 +'<linearGradient id="mint" x2=".5" y2="1"><stop stop-color="#cdf5e3"/><stop offset="1" stop-color="#64b69a"/></linearGradient>'
 +'<filter id="soft"><feGaussianBlur stdDeviation="4"/></filter>'
 +'</defs>'+inner+'</svg>';
 const stars=(x=85,y=48,s=1)=>'<g fill="#fff8a7" stroke="#f6b841" stroke-width="2"><path d="M'+x+' '+(y-13*s)+'l'+(4*s)+' '+(9*s)+' '+(10*s)+' '+(3*s)+' -'+(10*s)+' '+(4*s)+' -'+(4*s)+' '+(11*s)+' -'+(4*s)+' -'+(11*s)+' -'+(10*s)+' -'+(4*s)+' '+(10*s)+' -'+(3*s)+'z"/></g>';
 const surround=(center,theme='gold')=>'<rect width="360" height="260" rx="26" fill="'+(theme==='blue'?'#c7eeff':theme==='green'?'#d8f6dc':theme==='violet'?'#efe3ff':'#fff1cb')+'"/>'
 +'<ellipse cx="180" cy="236" rx="142" ry="15" fill="#a86b3960" filter="url(#soft)"/>'
 +'<circle cx="180" cy="125" r="106" fill="#fff9e7" opacity=".8"/>'
 +stars(66,44,.7)+stars(295,62,.65)+center;
 const hatExplorer='<g stroke="#885526" stroke-width="4" stroke-linejoin="round"><path d="M92 173Q76 91 170 76Q264 76 268 173Z" fill="#da9650"/><path d="M78 173Q175 130 284 173Q248 207 98 201Q61 193 78 173Z" fill="#af7141"/><path d="M111 153Q180 145 247 157" fill="none" stroke="#623d26" stroke-width="17"/><path d="M161 79Q178 111 176 147M216 94Q222 119 220 149" stroke="#f2c080" fill="none" stroke-width="4"/><circle cx="185" cy="153" r="13" fill="#ffe7ad" stroke="#955629"/></g>';
 const hatWizard='<g stroke-linejoin="round"><path d="M100 185Q146 152 157 113Q166 76 204 29Q208 90 255 169Q286 179 294 193Q177 215 84 193Z" fill="url(#purple)" stroke="#e4b45d" stroke-width="8"/><path d="M92 186Q190 164 290 190" stroke="#15265c" stroke-width="17" fill="none"/><path d="M98 184Q189 163 289 188" stroke="#e2a845" stroke-width="6" fill="none"/>'+stars(187,94,1.4)+stars(226,145,.8)+stars(158,153,.75)+'<circle cx="205" cy="158" r="12" fill="#ffcc52" stroke="#ab7526" stroke-width="4"/></g>';
 const cape='<g stroke="#9d263d" stroke-linejoin="round" stroke-width="5"><path d="M145 67Q123 145 67 196Q95 212 150 197Q177 231 205 208Q252 229 291 202Q244 145 214 68Z" fill="url(#red)"/><path d="M160 79Q160 145 137 192M193 79Q212 136 235 197" stroke="#ffb9a3" stroke-width="8" opacity=".7"/><circle cx="179" cy="72" r="14" fill="#ffd75e" stroke="#b47d2a"/></g>';
 const glasses='<g stroke="#bd7b1e" stroke-width="11" stroke-linejoin="round" fill="#ffec9f99"><path d="M92 119L108 96L134 101L150 79L166 108L193 114L171 134L177 159L151 143L128 164L125 137Z"/><path d="M195 119L211 96L237 101L253 79L269 108L296 114L274 134L280 159L254 143L231 164L228 137Z"/><path d="M175 126Q190 113 204 126" fill="none"/></g>';
 const trees='<rect width="360" height="260" fill="url(#sky)"/><path d="M0 180Q65 136 125 180T270 172T360 184V260H0Z" fill="#8ed99a"/><path d="M0 218Q70 185 160 221T360 207V260H0Z" fill="#4fbf82"/><path d="M83 258Q87 180 98 129" stroke="#75563a" stroke-width="22"/><circle cx="68" cy="84" r="57" fill="#35936b"/><circle cx="109" cy="71" r="50" fill="#53b56a"/><circle cx="40" cy="118" r="39" fill="#67c67b"/>';
 const treehouse=trees+'<path d="M104 210L106 102" stroke="#806143" stroke-width="18"/><path d="M75 110L186 110L175 175L89 177Z" fill="#ba783b" stroke="#77502c" stroke-width="6"/><path d="M60 111L130 56L200 112Z" fill="#a83f32" stroke="#793a2d" stroke-width="7"/><rect x="115" y="122" width="43" height="51" rx="13" fill="#ffde70" stroke="#744626" stroke-width="6"/><path d="M74 178L193 179" stroke="#e7b56f" stroke-width="9"/>'+stars(215,65,.8)+stars(256,98,.7)+'<path d="M160 180Q230 185 272 248" fill="none" stroke="#d9b17c" stroke-width="10"/>';
 const castle='<rect width="360" height="260" fill="#c6e5ff"/><path d="M0 174Q155 80 360 153" fill="none" stroke="#ffd5b1" stroke-width="34" opacity=".9"/><path d="M0 197Q149 111 360 179" fill="none" stroke="#f6c2eb" stroke-width="24" opacity=".9"/><path d="M0 218Q130 179 360 213V260H0Z" fill="#a2db96"/><rect x="113" y="117" width="150" height="111" rx="9" fill="#f4c5e9" stroke="#aa72bc" stroke-width="6"/><rect x="83" y="85" width="52" height="134" rx="5" fill="#f3d6f9" stroke="#ab76c5" stroke-width="6"/><rect x="243" y="79" width="52" height="140" rx="5" fill="#f4d4fc" stroke="#ab76c5" stroke-width="6"/><path d="M73 91L108 33L146 91ZM237 83L270 24L305 83ZM140 128L185 53L228 128Z" fill="#9c6bc5" stroke="#7c52a8" stroke-width="5"/><path d="M169 228V176Q190 146 211 176V228" fill="#6f5497"/><rect x="96" y="108" width="20" height="31" rx="9" fill="#ffefac"/><rect x="260" y="111" width="20" height="31" rx="9" fill="#ffefac"/>'+stars(317,47,.7);
 const library='<rect width="360" height="260" fill="#191b50"/><circle cx="285" cy="54" r="37" fill="#fff3b4"/><circle cx="300" cy="43" r="33" fill="#191b50"/>'+stars(56,36,.7)+stars(228,69,.8)+stars(310,113,.5)+'<rect x="25" y="91" width="172" height="151" rx="12" fill="#75417d" stroke="#d89a6b" stroke-width="7"/><g fill="#e7b0a5"><rect x="42" y="110" width="18" height="45"/><rect x="65" y="107" width="27" height="48" fill="#b1e7d4"/><rect x="100" y="116" width="20" height="40" fill="#f2d576"/><rect x="127" y="110" width="23" height="45" fill="#adbbec"/><rect x="155" y="119" width="22" height="38"/><rect x="42" y="179" width="21" height="42"/><rect x="68" y="177" width="24" height="44" fill="#f3d788"/><rect x="99" y="179" width="18" height="42" fill="#c8ddfa"/><rect x="122" y="179" width="20" height="42" fill="#b1e7d4"/><rect x="148" y="182" width="24" height="39"/></g><path d="M210 222Q257 154 318 216V246H210Z" fill="#dc9e78"/><path d="M210 221Q258 191 318 221" fill="none" stroke="#ffd8a1" stroke-width="10"/><path d="M219 174Q251 164 262 183Q276 163 309 174L302 211Q270 198 262 221Q240 197 217 212Z" fill="#ffedcb" stroke="#e8c27d" stroke-width="4"/>';
 const underwater='<rect width="360" height="260" fill="#3bb8d6"/><circle cx="275" cy="55" r="48" fill="#90eaff77"/><path d="M0 212Q75 177 153 216T360 207V260H0Z" fill="#edcfad"/><g stroke-width="12" fill="none" stroke-linecap="round"><path d="M39 231Q22 198 38 156M38 210Q60 182 67 173" stroke="#f56a90"/><path d="M326 233Q337 204 322 171M325 199Q301 187 304 164" stroke="#ffad6c"/></g><ellipse cx="140" cy="210" rx="64" ry="31" fill="#a56db9"/><path d="M72 197Q144 109 208 197Z" fill="#ffbece" stroke="#e97cb2" stroke-width="6"/><path d="M113 194L172 194L163 230L119 230Z" fill="#b57629" stroke="#684e29" stroke-width="5"/><path d="M112 192L143 173L173 192" fill="none" stroke="#ffd567" stroke-width="9"/><rect x="126" y="192" width="29" height="17" rx="4" fill="#ffdd4a"/><circle cx="250" cy="130" r="12" fill="#f6b8df"/><circle cx="275" cy="106" r="7" fill="#d5f6ff"/><circle cx="297" cy="148" r="9" fill="#d5f6ff"/>'+stars(220,90,.7);
 const badge=(type)=>{
 const icons={
  'word-badge':'<path d="M122 104Q151 92 180 116Q212 92 239 104V178Q210 168 180 189Q151 168 122 178Z" fill="#fff5d3" stroke="#4876bb" stroke-width="6"/><path d="M180 117V188" stroke="#4876bb" stroke-width="5"/><path d="M136 124L163 130M137 147L163 152M198 131L224 126M198 151L224 145" stroke="#6599c8" stroke-width="5"/>',
  'reading-badge':'<path d="M113 125Q144 99 180 128Q215 99 248 125V186Q209 166 180 193Q146 166 112 186Z" fill="#fff9e6" stroke="#865cc0" stroke-width="6"/><path d="M180 127V192M126 139L164 146M198 145L234 137" stroke="#d08aac" stroke-width="5"/>',
  'grammar-badge':'<path d="M180 84L250 111V165Q226 210 180 230Q133 210 110 165V111Z" fill="#8cbfff" stroke="#e8f8ff" stroke-width="10"/><path d="M139 172L205 109" stroke="#fff8d4" stroke-width="13"/><path d="M155 165L211 103" stroke="#e2ac4d" stroke-width="4"/><path d="M208 101Q227 89 239 100L216 116Z" fill="#fff"/>',
  'review-badge':'<path d="M180 84L193 128L235 130L204 159L215 202L180 182L145 202L156 159L125 130L167 128Z" fill="#ffeb7d" stroke="#bf7b23" stroke-width="6"/><path d="M138 203Q180 189 222 204L214 226Q180 215 146 226Z" fill="#fff2d0" stroke="#9f692b" stroke-width="4"/>'
 };
 return frame(surround('<circle cx="180" cy="147" r="96" fill="url(#gold)" stroke="#c9822d" stroke-width="12"/><circle cx="180" cy="147" r="77" fill="'+(type==='reading-badge'?'#efd8fa':type==='grammar-badge'?'#c5e9ff':'#fef3bc')+'" stroke="#fff3c4" stroke-width="7"/>'
 +'<g fill="none" stroke="#c7952b" stroke-width="6"><path d="M90 191Q65 147 101 102M270 191Q293 147 259 102"/></g>'
 +'<g fill="#4eae77"><ellipse cx="101" cy="105" rx="9" ry="20" transform="rotate(-26 101 105)"/><ellipse cx="85" cy="137" rx="9" ry="19" transform="rotate(-45 85 137)"/><ellipse cx="261" cy="105" rx="9" ry="20" transform="rotate(26 261 105)"/><ellipse cx="275" cy="137" rx="9" ry="19" transform="rotate(45 275 137)"/></g>'
 +(icons[type]||icons['word-badge'])));
 };
 const art={
 'explorer-hat':frame(surround(hatExplorer)),
 'magic-hat':frame(surround(hatWizard,'violet')),
 'hero-cape':frame(surround(cape)),
 'star-glasses':frame(surround(glasses)),
 treehouse:frame(treehouse),
 castle:frame(castle),
 'star-library':frame(library),
 'ocean-treasure':frame(underwater),
 'word-badge':badge('word-badge'),
 'reading-badge':badge('reading-badge'),
 'grammar-badge':badge('grammar-badge'),
 'review-badge':badge('review-badge')
 };
 const toUrl=markup=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(markup);
 function portrait(equipped={}){
 const hat=equipped.hat||null,capeOn=equipped.cape==='hero-cape',glassesOn=equipped.glasses==='star-glasses';
 const back='<circle cx="180" cy="181" r="172" fill="#ffecb6"/><ellipse cx="180" cy="321" rx="127" ry="17" fill="#8a5c4d44"/>';
 const behind=capeOn?'<path d="M115 228Q60 275 33 332Q113 323 180 344Q245 327 333 337Q297 283 245 226Z" fill="url(#red)" stroke="#a32952" stroke-width="7"/>':'';
 const body='<ellipse cx="180" cy="275" rx="122" ry="102" fill="#b56c35"/><ellipse cx="180" cy="288" rx="85" ry="75" fill="#ffead4"/><ellipse cx="75" cy="257" rx="35" ry="59" transform="rotate(23 75 257)" fill="#dc9657"/><ellipse cx="296" cy="259" rx="35" ry="59" transform="rotate(-25 296 259)" fill="#dc9657"/><ellipse cx="103" cy="339" rx="43" ry="24" fill="#fff0d5"/><ellipse cx="266" cy="340" rx="43" ry="24" fill="#fff0d5"/>';
 const face='<circle cx="89" cy="132" r="34" fill="#a6633d" stroke="#73452e" stroke-width="7"/><circle cx="89" cy="133" r="22" fill="#e99a98"/><circle cx="271" cy="132" r="34" fill="#a6633d" stroke="#73452e" stroke-width="7"/><circle cx="271" cy="133" r="22" fill="#e99a98"/><ellipse cx="180" cy="176" rx="125" ry="102" fill="#ce823d"/><path d="M151 85Q169 91 179 103Q193 88 215 86Q241 118 230 186Q216 234 180 267Q144 229 129 180Q119 119 151 85Z" fill="#fff1df"/><ellipse cx="114" cy="208" rx="59" ry="47" fill="#ffebd3"/><ellipse cx="246" cy="208" rx="59" ry="47" fill="#ffebd3"/><ellipse cx="123" cy="171" rx="13" ry="18" fill="#261f24"/><ellipse cx="241" cy="171" rx="13" ry="18" fill="#261f24"/><circle cx="128" cy="165" r="5" fill="#fff"/><circle cx="246" cy="165" r="5" fill="#fff"/><path d="M163 218Q180 228 197 218Q181 241 163 218Z" fill="#ef99a1"/><path d="M181 228V246M181 246Q157 259 142 239M181 246Q205 259 219 239" stroke="#8b514b" stroke-width="4" fill="none" stroke-linecap="round"/>';
 const hatImg=hat==='magic-hat'?'<g transform="translate(66,-6) scale(.64)">'+hatWizard+'</g>':hat==='explorer-hat'?'<g transform="translate(48,-24) scale(.77)">'+hatExplorer+'</g>':'<path d="M70 118Q82 58 180 50Q278 58 289 116Q181 132 70 118Z" fill="#cc915c" stroke="#8b633e" stroke-width="8"/><path d="M47 122Q170 104 314 123Q268 146 77 142Z" fill="#ae774a" stroke="#7e5738" stroke-width="6"/><path d="M96 111Q181 102 267 111" stroke="#65472e" stroke-width="13" fill="none"/>';
 const glassImg=glassesOn?'<g transform="translate(6,50) scale(.94)">'+glasses+'</g>':'';
 const shirt='<path d="M143 273Q180 294 218 274L219 345H143Z" fill="#6c895d"/><path d="M145 275L180 308L215 275" fill="none" stroke="#e2b785" stroke-width="11"/><circle cx="181" cy="306" r="13" fill="#ffca55" stroke="#a7772b" stroke-width="4"/>';
 return frame(back+behind+body+shirt+face+hatImg+glassImg,360,360);
 }
 window.GAME_REWARD_ART=Object.freeze({item:id=>toUrl(art[id]||art['word-badge']),scene:id=>toUrl(art[id]||''),portrait:e=>toUrl(portrait(e)),svg:id=>art[id]||''});
})();
