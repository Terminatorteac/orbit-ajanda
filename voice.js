(function(global){
'use strict';
const normalize=s=>s.toLocaleLowerCase('tr-TR').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[’']/g,'');
const ones={sifir:0,bir:1,iki:2,uc:3,dort:4,bes:5,alti:6,yedi:7,sekiz:8,dokuz:9},tens={on:10,yirmi:20,otuz:30,kirk:40,elli:50};
function numeric(text){return text.replace(/\b(on|yirmi|otuz|kirk|elli)\s+(bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz)\b/g,(_,a,b)=>String(tens[a]+ones[b])).replace(/\b(sifir|bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz|on|yirmi|otuz|kirk|elli)\b/g,w=>String(ones[w]??tens[w]));}
const pad=n=>String(n).padStart(2,'0'),key=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
function parse(text,now=new Date()){
 const raw=String(text).trim(),s=numeric(normalize(raw));const months=['ocak','subat','mart','nisan','mayis','haziran','temmuz','agustos','eylul','ekim','kasim','aralik'];let date=null,time=null,error=null,matchedDate=false;
 const numericDate=[...s.matchAll(/\b(\d{1,2})[./-](\d{1,2})(?:[./-](20\d{2}))?\b/g)].find(x=>!/(?:saat|sabah|aksam|gece)\s*$/.test(s.slice(0,x.index)));
 let m=s.match(new RegExp('\\b(\\d{1,2})\\s+('+months.join('|')+')(?:\\s+(20\\d{2}))?'));let day,month,year;
 if(m){matchedDate=true;day=+m[1];month=months.indexOf(m[2]);year=m[3]?+m[3]:now.getFullYear();}
 else if((m=numericDate)){matchedDate=true;day=+m[1];month=+m[2]-1;year=m[3]?+m[3]:now.getFullYear();}
 if(matchedDate){let d=new Date(year,month,day,12);if(d.getDate()!==day||d.getMonth()!==month||d.getFullYear()!==year)error='Söylenen tarih geçerli değil. Tarihi kontrol et.';else{if(!m[3]&&key(d)<key(now))d=new Date(year+1,month,day,12);if(d.getDate()!==day||d.getMonth()!==month)error='Tarih için yılı da belirt veya elle seç.';else date=key(d);}}
 else {let offset=null;if(/\bobur gun\b|\byarindan sonra\b/.test(s))offset=2;else if(/\byarin\b/.test(s))offset=1;else if(/\bbugun\b/.test(s))offset=0;if(offset!==null){const d=new Date(now);d.setDate(d.getDate()+offset);date=key(d);}else{const names=['pazar','pazartesi','sali','carsamba','persembe','cuma','cumartesi'];const weekday=s.match(/\b(pazartesi|sali|carsamba|persembe|cuma|cumartesi|pazar)\b/);if(weekday){const d=new Date(now);let offset=(names.indexOf(weekday[1])-now.getDay()+7)%7;if(offset===0||/gelecek hafta|haftaya/.test(s))offset+=7;d.setDate(d.getDate()+offset);date=key(d);}}}
 let tm=s.match(/\bsaat\s*(\d{1,2})(?:\s*[:.]\s*(\d{1,2})|\s+(\d{1,2})\b|\s+(bucuk|ceyrek))?/)||s.match(/\b(\d{1,2}):(\d{2})\b/);
 if(!tm)tm=s.match(/\b(?:sabah|aksam|gece|ogleden sonra)\s+(\d{1,2})(?:\s*[:.]\s*(\d{1,2})|\s+(\d{1,2})\b|\s+(bucuk|ceyrek))?/);
 if(tm){let h=+tm[1],minute=+(tm[2]||tm[3]||0);if(tm[4]==='bucuk')minute=30;if(tm[4]==='ceyrek')minute=15;if(/\b(aksam|ogleden sonra)\b/.test(s)&&h<12)h+=12;if(/\bgece\b/.test(s)&&h===12)h=0;if(h>23||minute>59)error='Söylenen saat geçerli değil. Saati kontrol et.';else time=pad(h)+':'+pad(minute);}
 const repeat=/\bher gun\b/.test(s)?'daily':/\bher hafta\b|\bher (pazartesi|sali|carsamba|persembe|cuma|cumartesi|pazar)\b/.test(s)?'weekly':null;
 return {date,time,repeat,error,raw};
}
function join(a,b){a=a.trim();b=b.trim();if(!a)return b;if(!b)return a;const aw=a.split(/\s+/),bw=b.split(/\s+/);for(let n=Math.min(aw.length,bw.length);n>0;n--){if(normalize(aw.slice(-n).join(' '))===normalize(bw.slice(0,n).join(' ')))return [...aw,...bw.slice(n)].join(' ');}return a+' '+b;}
class Session{
 constructor({Speech,onText=()=>{},onState=()=>{},schedule=setTimeout,cancel=clearTimeout}){this.Speech=Speech;this.onText=onText;this.onState=onState;this.schedule=schedule;this.cancel=cancel;this.wanted=false;this.finishing=false;this.generation=0;this.base='';this.segment='';this.emptyEnds=0;this.pending=null;this.rec=null;this.lastError=null;}
 start(){if(this.wanted||this.finishing)return;this.wanted=true;this.base='';this.segment='';this.emptyEnds=0;this.lastError=null;this.generation++;this.onState('starting');this.open(this.generation);}
 open(gen){if(!this.wanted||gen!==this.generation)return;const r=new this.Speech();this.rec=r;this.segment='';r.lang='tr-TR';r.continuous=true;r.interimResults=true;r.maxAlternatives=1;const current=()=>gen===this.generation&&this.rec===r;
 r.onstart=()=>{if(!current())return;if(!this.wanted){r.stop();return;}this.onState('listening');};
 r.onresult=e=>{if(!current())return;let text='';for(let i=0;i<e.results.length;i++)text=join(text,e.results[i][0].transcript);this.segment=text;this.onText(join(this.base,text));};
 r.onerror=e=>{if(!current())return;if(e.error==='no-speech'){this.onState('waiting');return;}if(e.error==='aborted'&&!this.wanted)return;this.lastError=e.error;this.wanted=false;this.onState('error',e.error);};
 r.onend=()=>{if(!current())return;const segment=this.segment.trim();this.base=join(this.base,segment);this.segment='';this.rec=null;this.emptyEnds=segment?0:this.emptyEnds+1;if(this.wanted&&this.emptyEnds<4){this.onState('reconnecting');this.pending=this.schedule(()=>{this.pending=null;this.open(gen);},350);return;}if(this.wanted){this.wanted=false;this.lastError='repeated-end';this.onState('error',this.lastError);}this.finish();};
 try{r.start();}catch(e){this.rec=null;this.wanted=false;this.lastError='start-failed';this.onState('error',this.lastError);this.finish();}}
 finish(){this.finishing=false;this.cancel(this.stopTimeout);this.stopTimeout=null;if(!this.lastError)this.onState('stopped');this.resolve?.(join(this.base,this.segment));this.resolve=null;}
 stop(){if(this.finishing)return this.stopPromise;this.wanted=false;this.cancel(this.pending);this.pending=null;this.finishing=true;this.onState('finishing');this.stopPromise=new Promise(resolve=>{this.resolve=resolve;});const result=this.stopPromise;if(this.rec){this.stopTimeout=this.schedule(()=>{if(this.rec){const r=this.rec;this.base=join(this.base,this.segment);this.segment='';this.rec=null;try{r.abort();}catch{}}this.finish();},1600);try{this.rec.stop();}catch{this.finish();}}else this.finish();return result;}
 dispose(){this.wanted=false;this.generation++;this.cancel(this.pending);this.cancel(this.stopTimeout);if(this.rec){try{this.rec.abort();}catch{}}this.rec=null;this.finishing=false;this.resolve?.(join(this.base,this.segment));this.resolve=null;}
}
const api={parse,join,Session};if(typeof module!=='undefined')module.exports=api;else global.OrbitVoice=api;
})(typeof window!=='undefined'?window:globalThis);
