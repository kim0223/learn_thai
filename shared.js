// ========================================
// 泰語學習卡 v3 - 共享渲染邏輯
// 所有主題頁面通用的JavaScript代碼
// ========================================

var cIdx=0,voices=[],loopMode=null,loopInterval=4000,loopTimer=null;
var currentTopic = null;

function hexAlpha(hex,alpha){
  var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}

function getVoice(lang){
  if(voices.length===0)voices=window.speechSynthesis.getVoices();
  var filtered=voices.filter(function(v){return v.lang.startsWith(lang.split('-')[0]);});
  return filtered.length>0?filtered[0]:null;
}

if(window.speechSynthesis){
  voices=window.speechSynthesis.getVoices();
  if(window.speechSynthesis.onvoiceschanged!==undefined){
    window.speechSynthesis.onvoiceschanged=function(){voices=window.speechSynthesis.getVoices();};
  }
}

var phoneticColorStylesInjected = false;

function injectPhoneticColorStyles(){
  if(phoneticColorStylesInjected || !document.head) return;
  phoneticColorStylesInjected = true;
  var style = document.createElement('style');
  style.textContent = '.phonetic .part-classifier{color:var(--teal);}.phonetic .part-thii{color:var(--gold);}.phonetic .part-num{color:var(--rose);}.phonetic .p-s{color:var(--blue);}.phonetic .p-v{color:var(--teal);}.phonetic .p-o{color:var(--rose);}.phonetic .p-key{color:var(--gold);}.phonetic .p-tail{color:var(--violet);}.phonetic .p-neg{color:#ff6b6b;}.phonetic .p-prog{color:var(--cyan);}.phonetic .p-loc{color:var(--pink);}';
  document.head.appendChild(style);
}

function colorizePhonetic(card,bkData,topicType){
  if(!card || !card.phonetic) return '';
  if(/<span\b/i.test(card.phonetic)) return card.phonetic;
  if(!bkData || !bkData.length) return card.phonetic;

  var clsFn;
  if(topicType==='number' || topicType==='ordinal'){
    clsFn = function(b){ return b.c==='k' ? 'part-thii' : (b.c==='v' ? 'part-classifier' : 'part-num'); };
  } else if(topicType==='question'){
    clsFn = function(b){ return {k:'part-thii',v:'part-classifier',s:'part-num'}[b.c] || 'part-thii'; };
  } else {
    clsFn = function(b){ return {s:'p-s',v:'p-v',o:'p-o',k:'p-key',t:'p-tail',n:'p-neg',p:'p-prog',l:'p-loc'}[b.c] || 'p-key'; };
  }

  var text = card.phonetic.trim();
  if(text==='') return card.phonetic;

  var words = text.split(/\s+/);
  if(words.length === 0) return card.phonetic;
  if(bkData.length === 1) return '<span class="'+clsFn(bkData[0])+'">'+card.phonetic+'</span>';
  if(words.length === bkData.length){
    return words.map(function(w,i){ return '<span class="'+clsFn(bkData[i])+'">'+w+'</span>'; }).join(' ');
  }

  var tokenLens = words.map(function(w){ return w.replace(/[^A-Za-z0-9\u00C0-\u017F\u0180-\u024F\u1E00-\u1EFF]/g,'').length; });
  var segLens = bkData.map(function(b){ return b.t.replace(/\s+/g,'').length; });
  var m = bkData.length, n = words.length;
  var dp = Array.from({length:m+1}, function(){ return Array(n+1).fill(Infinity); });
  var choice = Array.from({length:m+1}, function(){ return Array(n+1).fill(1); });
  dp[0][0] = 0;

  for(var i=1;i<=m;i++){
    for(var j=i;j<=n;j++){
      for(var k=1;k<=j-(i-1);k++){
        var sum = 0;
        for(var t=j-k;t<j;t++) sum += tokenLens[t];
        var cost = Math.abs(segLens[i-1] - sum);
        var score = dp[i-1][j-k] + cost;
        if(score < dp[i][j]){
          dp[i][j] = score;
          choice[i][j] = k;
        }
      }
    }
  }

  if(!isFinite(dp[m][n])) return '<span class="'+clsFn(bkData[0])+'">'+card.phonetic+'</span>';

  var groups = [];
  var j = n;
  for(var i=m;i>0;i--){
    var k = choice[i][j];
    var start = j - k;
    groups.unshift({ text: words.slice(start,j).join(' '), cls: clsFn(bkData[i-1]) });
    j = start;
  }

  return groups.map(function(g){ return '<span class="'+g.cls+'">'+g.text+'</span>'; }).join(' ');
}

function initTopic(topicData){
  currentTopic = topicData;
  injectPhoneticColorStyles();
  render();
}

function render(){
  if(!currentTopic) return;
  
  var c=currentTopic.cards[cIdx],total=currentTopic.cards.length,color=currentTopic.color;
  
  // Topic Chip
  document.getElementById('topicChip').innerHTML='<div class="topic-dot" style="background:'+color+'"></div><div class="topic-text">'+currentTopic.id+' - '+currentTopic.title+' ｜ '+currentTopic.subtitle+'</div>';
  
  // Concept Box
  if(currentTopic.concept){
    document.getElementById('conceptBox').style.display='';
    document.getElementById('conceptBox').innerHTML='<div class="concept-label">句型公式 · Pattern</div><div class="concept-formula">'+currentTopic.concept.formula+'</div><div class="concept-zh">'+currentTopic.concept.zh+'</div>';
  }else{
    document.getElementById('conceptBox').style.display='none';
  }
  
  // Progress
  var prog=(cIdx+1)/total*100;
  document.getElementById('progressFill').style.width=prog+'%';
  document.getElementById('progressFill').style.background=color;
  document.getElementById('progressLabel').textContent=(cIdx+1)+'/'+total;
  
  // Card
  var cardHTML='<div class="card-stripe" style="background:'+color+'"></div><div class="card-num">'+(cIdx+1)+'/'+total+'</div>';
  var bkHTML='',bkData=c.bk||[];
  
  if(currentTopic.type==='number'||currentTopic.type==='ordinal'){
    var thaiDisp=bkData.map(function(b){return '<span class="part-'+(b.c==='k'?'thii':(b.c==='v'?'classifier':'num'))+'">'+b.t+'</span>';}).join(' ');
    bkHTML=bkData.map(function(b,i){return '<div class="bk-item" onclick="speakWord(\''+b.t+'\',this)"><div class="bk-thai">'+b.t+'</div><div class="bk-zh">'+b.z+'</div></div>'+(i<bkData.length-1?'<div class="bk-plus">+</div>':'');}).join('');
    cardHTML+='<div class="card-top"><div class="num-badge">'+(c.icon||'#')+'</div><div class="card-main"><div class="thai-expr">'+thaiDisp+'</div><div class="phonetic">'+colorizePhonetic(c,bkData,currentTopic.type)+'</div><div class="zh-meaning">'+c.zh+'</div><div class="speak-row"><button class="btn-speak th" onclick="speakThai(this)">🔊 泰語</button><button class="btn-speak zh" onclick="speakZh(this)">🔊 中文</button></div></div></div>';
  } else if(currentTopic.type==='phrase'||currentTopic.type==='vocab'){
    bkHTML=bkData.map(function(b){return '<div class="bk-item" onclick="speakWord(\''+b.t+'\',this)"><div class="bk-thai">'+b.t+'</div><div class="bk-zh">'+b.z+'</div></div>';}).join('');
    cardHTML+='<div class="card-top"><div class="card-icon">'+(c.icon||'💬')+'</div><div class="card-main"><div class="thai-expr">'+c.th+'</div><div class="phonetic">'+colorizePhonetic(c,bkData,currentTopic.type)+'</div><div class="zh-meaning">'+c.zh+'</div><div class="speak-row"><button class="btn-speak th" onclick="speakThai(this)">🔊 泰語</button><button class="btn-speak zh" onclick="speakZh(this)">🔊 中文</button></div></div></div>';
  } else if(currentTopic.type==='question'){
    var thaiDisp2=bkData.map(function(b){var cls={k:'part-thii',v:'part-classifier',s:'part-num'}[b.c]||'part-thii';return '<span class="'+cls+'">'+b.t+'</span>';}).join(' ');
    bkHTML=bkData.map(function(b,i){return '<div class="bk-item" onclick="speakWord(\''+b.t+'\',this)"><div class="bk-thai">'+b.t+'</div><div class="bk-zh">'+b.z+'</div></div>'+(i<bkData.length-1?'<div class="bk-plus">+</div>':'');}).join('');
    cardHTML+='<div class="card-top"><div class="card-icon">'+(c.icon||'💡')+'</div><div class="card-main"><div class="thai-expr">'+thaiDisp2+'</div><div class="phonetic">'+colorizePhonetic(c,bkData,currentTopic.type)+'</div><div class="zh-meaning">'+c.zh+'</div><div class="speak-row"><button class="btn-speak th" onclick="speakThai(this)">🔊 泰語</button><button class="btn-speak zh" onclick="speakZh(this)">🔊 中文</button></div></div></div>';
  } else if(currentTopic.type==='dialogue'){
    var roleCls=c.role||'a';
    bkHTML=bkData.map(function(b){return '<div class="bk-item" onclick="speakWord(\''+b.t+'\',this)"><div class="bk-thai">'+b.t+'</div><div class="bk-zh">'+b.z+'</div></div>';}).join('');
    cardHTML+='<div class="dialogue-bubble '+roleCls+'"><div class="dialogue-icon">'+(c.speakerIcon||'💬')+'</div><div class="dialogue-body"><div class="dialogue-name">'+(c.speakerZh||'')+'</div><div class="dialogue-thai">'+c.fullThai+'</div>'+(c.phonetic?'<div class="phonetic">'+colorizePhonetic(c,bkData,currentTopic.type)+'</div>':'')+'<div class="dialogue-zh">'+c.zh+'</div></div></div>';
    cardHTML+='<div class="speak-row"><button class="btn-speak th" onclick="speakThai(this)">🔊 泰語</button><button class="btn-speak zh" onclick="speakZh(this)">🔊 中文</button></div>';
  } else {
    var cm={s:'p-s',v:'p-v',o:'p-o',k:'p-key',t:'p-tail',n:'p-neg',p:'p-prog',l:'p-loc'};
    var thaiDisp3=bkData.map(function(b){return '<span class="'+(cm[b.c]||'p-key')+'">'+b.t+'</span>';}).join(' ');
    bkHTML=bkData.map(function(b,i){return '<div class="bk-item" onclick="speakWord(\''+b.t+'\',this)"><div class="bk-thai">'+b.t+'</div><div class="bk-zh">'+b.z+'</div></div>'+(i<bkData.length-1?'<div class="bk-plus">+</div>':'');}).join('');
    cardHTML+='<div class="thai-sentence">'+thaiDisp3+'</div><div class="phonetic">'+colorizePhonetic(c,bkData,currentTopic.type)+'</div><div class="zh-meaning">'+c.zh+'</div><div class="speak-row"><button class="btn-speak th" onclick="speakThai(this)">🔊 泰語</button><button class="btn-speak zh" onclick="speakZh(this)">🔊 中文</button></div>';
  }

  if(bkHTML){
    var legendHTML=currentTopic.legend?currentTopic.legend.map(function(l){return '<div class="legend-item"><span class="legend-dot" style="background:'+l.color+'"></span>'+l.label+'</div>';}).join(''):'';
    var bkTitle=currentTopic.type==='dialogue'?'單字拆解・（點字發音）':'句型拆解・（點字發音）';
    cardHTML+='<div class="breakdown"><div class="breakdown-title">'+bkTitle+'</div><div class="breakdown-row">'+bkHTML+'</div>'+(legendHTML?'<div class="legend">'+legendHTML+'</div>':'')+'</div>';
  }
  document.getElementById('card').innerHTML=cardHTML;
}

function speakText(text,lang,btn){
  if(!window.speechSynthesis)return;window.speechSynthesis.cancel();
  if(voices.length===0)voices=window.speechSynthesis.getVoices();
  var u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=0.82;
  var v=getVoice(lang);if(v)u.voice=v;
  if(btn){u.onstart=function(){btn.classList.add('playing');};u.onend=function(){btn.classList.remove('playing');};u.onerror=function(){btn.classList.remove('playing');};}
  window.speechSynthesis.speak(u);
}

function speakThai(btn){
  if(!currentTopic) return;
  speakText(currentTopic.cards[cIdx].th||currentTopic.cards[cIdx].fullThai,'th-TH',btn);
}

function speakZh(btn){
  if(!currentTopic) return;
  speakText(currentTopic.cards[cIdx].zh,'zh-TW',btn);
}

function speakWord(text,el){
  if(loopMode)stopLoop(true);if(!window.speechSynthesis)return;window.speechSynthesis.cancel();
  if(voices.length===0)voices=window.speechSynthesis.getVoices();
  var u=new SpeechSynthesisUtterance(text);u.lang='th-TH';u.rate=0.78;
  var v=getVoice('th-TH');if(v)u.voice=v;
  u.onstart=function(){el.classList.add('word-playing');};u.onend=function(){el.classList.remove('word-playing');};u.onerror=function(){el.classList.remove('word-playing');};
  window.speechSynthesis.speak(u);
}

function animateCard(){var c=document.getElementById('card');c.style.animation='none';c.offsetHeight;c.style.animation='';}

function navigate(dir){
  if(!currentTopic) return;
  if(loopMode)stopLoop(true);
  var total=currentTopic.cards.length;
  cIdx=Math.max(0,Math.min(total-1,cIdx+dir));
  animateCard();
  render();
}

function updateSpeed(v){
  loopInterval=v*1000;
  document.getElementById('speedVal').textContent=v+'s';
  if(loopMode){clearLoopTimer();scheduleNext();}
}

function startLoop(mode){
  stopLoop(false);
  loopMode=mode;
  document.getElementById('btnLoopSingle').className='btn-loop'+(mode==='single'?' active-loop':'');
  document.getElementById('btnLoopAll').className='btn-loop'+(mode==='all'?' active-loop':'');
  document.getElementById('btnLoopStop').style.display='';
  document.getElementById('loopStatus').style.display='';
  updateLoopStatus();
  speakSeq();
}

function stopLoop(r){
  if(r===undefined)r=true;
  loopMode=null;
  clearLoopTimer();
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  if(r){
    document.getElementById('btnLoopSingle').className='btn-loop';
    document.getElementById('btnLoopAll').className='btn-loop';
    document.getElementById('btnLoopStop').style.display='none';
    document.getElementById('loopStatus').style.display='none';
  }
}

function clearLoopTimer(){if(loopTimer){clearTimeout(loopTimer);loopTimer=null;}}

function updateLoopStatus(){
  if(!currentTopic) return;
  var c=currentTopic.cards[cIdx],total=currentTopic.cards.length;
  var el=document.getElementById('loopStatusText');
  var ml=loopMode==='single'?'單卡循環':'全部循環';
  if(el)el.textContent=ml+'｜'+c.zh+' ('+(cIdx+1)+'/'+total+')';
}

function speakSeq(){
  if(!loopMode||!currentTopic)return;
  var c=currentTopic.cards[cIdx];
  if(!window.speechSynthesis){scheduleNext();return;}
  window.speechSynthesis.cancel();
  if(voices.length===0)voices=window.speechSynthesis.getVoices();
  var thV=getVoice('th-TH'),zhV=getVoice('zh-TW');
  var thaiText=c.th||c.fullThai;
  var u1=new SpeechSynthesisUtterance(thaiText);u1.lang='th-TH';u1.rate=0.80;if(thV)u1.voice=thV;
  var u2=new SpeechSynthesisUtterance(c.zh);u2.lang='zh-TW';u2.rate=0.88;if(zhV)u2.voice=zhV;
  u2.onend=function(){if(loopMode)scheduleNext();};u2.onerror=function(){if(loopMode)scheduleNext();};
  u1.onend=function(){if(!loopMode)return;setTimeout(function(){if(loopMode&&window.speechSynthesis)window.speechSynthesis.speak(u2);},350);};
  u1.onerror=function(){if(loopMode)scheduleNext();};
  window.speechSynthesis.speak(u1);
}

function scheduleNext(){
  if(!loopMode||!currentTopic)return;
  loopTimer=setTimeout(function(){
    if(!loopMode)return;
    if(loopMode==='single'){
      updateLoopStatus();
      speakSeq();
    }else{
      var total=currentTopic.cards.length;
      cIdx=(cIdx+1)%total;
      animateCard();
      render();
      updateLoopStatus();
      speakSeq();
    }
  },loopInterval);
}

document.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight')navigate(1);
  if(e.key==='ArrowLeft')navigate(-1);
  if(e.key===' '){
    e.preventDefault();
    if(loopMode)stopLoop(true);
    else startLoop('all');
  }
});
