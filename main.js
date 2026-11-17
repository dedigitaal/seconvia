/*! Seconvia site script (footer, after the CDN libraries)
 * 1. Button 046 (Osmo)       hover circle on [data-button-046]
 * 2. Page logic (svInit)     word swap, carousels, rules/certificate, statement fill,
 *                            loop diagram, counters, materials filter, facilities map pins,
 *                            blog table of contents + read time
 * 3. Page transition (Osmo)  Barba + Lenis + DrawSVG; re-inits Webflow modules and fires the IX3
 *                            event "sv-page-in" (hero reveal + marquee are edited in the Interactions panel)
 */

/* 1. Button 046 (Osmo) ---------------------------------------------------- */
gsap.registerPlugin(CustomEase);
CustomEase.create('button-046-ease','0.32, 0.72, 0, 1');
function initButton046(){
  if(window.__b46mm)window.__b46mm.revert();
  const buttons=document.querySelectorAll('[data-button-046]');
  if(!buttons.length) return;
  const mm=window.__b46mm=gsap.matchMedia();
  buttons.forEach((button)=>{
    const circle=button.querySelector('[data-button-046-circle]');
    if(!circle) return;
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
      const xSet=gsap.quickSetter(circle,'xPercent');
      const ySet=gsap.quickSetter(circle,'yPercent');
      function getXY(e){
        const {left,top,width,height}=button.getBoundingClientRect();
        const xT=gsap.utils.pipe(gsap.utils.mapRange(0,width,0,100),gsap.utils.clamp(0,100));
        const yT=gsap.utils.pipe(gsap.utils.mapRange(0,height,0,100),gsap.utils.clamp(0,100));
        return {x:xT(e.clientX-left),y:yT(e.clientY-top)};
      }
      function onEnter(e){const {x,y}=getXY(e);xSet(x);ySet(y);gsap.to(circle,{scale:1,duration:1.25,ease:'button-046-ease',overwrite:'auto'});}
      function onLeave(e){const {x,y}=getXY(e);gsap.killTweensOf(circle);gsap.to(circle,{xPercent:x>90?x+25:x<12.5?x-25:x,yPercent:y>90?y+25:y<12.5?y-25:y,scale:0,duration:0.45,ease:'button-046-ease',overwrite:'auto'});}
      function onMove(e){const {x,y}=getXY(e);gsap.to(circle,{xPercent:x,yPercent:y,duration:0.5,ease:'power1',overwrite:'auto'});}
      button.addEventListener('pointerenter',onEnter);
      button.addEventListener('pointerleave',onLeave);
      button.addEventListener('pointermove',onMove);
      return ()=>{button.removeEventListener('pointerenter',onEnter);button.removeEventListener('pointerleave',onLeave);button.removeEventListener('pointermove',onMove);};
    });
  });
}

/* 2. Page logic ------------------------------------------------------------ */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[role="button"][href="#"]');if(a)e.preventDefault()});
window.svInit=function(){
var IV=[],WL=[];
var setInterval=function(f,ms){var t=window.setInterval(f,ms);IV.push(t);return t};
var addEventListener=function(t,f,o){window.addEventListener(t,f,o);WL.push([t,f,o])};

var Q=function(s,r){return (r||document).querySelector(s)},QA=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function kids(p,c){return Array.prototype.filter.call(p.children,function(e){return e.classList.contains(c)})}
function desc(el){return [el].concat(QA('*',el))}
function byText(root,t){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;while(n=w.nextNode()){if(n.nodeValue.trim()===t)return n.parentNode}return null}

function group(items,onPick,attr){
  attr=attr||'aria-pressed';
  var on=items.filter(function(e){return e.getAttribute(attr)==='true'})[0],off=items.filter(function(e){return e.getAttribute(attr)!=='true'})[0];
  var tOn=on&&desc(on).map(function(e){return e.getAttribute('class')}),tOff=off&&desc(off).map(function(e){return e.getAttribute('class')});
  function sel(i){items.forEach(function(el,j){var t=j===i?tOn:tOff,d=desc(el);if(t&&t.length===d.length)d.forEach(function(e,k){if(t[k]!==null)e.setAttribute('class',t[k])});el.setAttribute(attr,j===i?'true':'false')});if(onPick)onPick(i)}
  items.forEach(function(el,i){el.addEventListener('click',function(e){e.preventDefault();sel(i)})});
  return sel;
}
/* word swap + ticker */
var sp=[];QA('.sw').forEach(function(s){if(sp.indexOf(s.parentNode)<0)sp.push(s.parentNode)});
sp.forEach(function(p){var k=kids(p,'sw');if(k.length<2)return;var i=Math.max(0,k.findIndex(function(e){return e.classList.contains('on')}));
  setInterval(function(){k[i].classList.remove('on');i=(i+1)%k.length;k[i].classList.add('on')},k.length===2?4800:2400)});
/* carousels */
var cp=[],cn=0;QA('.cs').forEach(function(s){if(cp.indexOf(s.parentNode)<0)cp.push(s.parentNode)});
cp.forEach(function(p){var all=kids(p,'cs'),a=p,dots=[];
  for(var n=0;n<4&&a;n++){dots=QA('.cdot',a);if(dots.length===all.length)break;dots=[];a=a.parentElement}
  var sl=all.filter(function(e){return !(e.classList.contains('w-dyn-bind-empty')||(e.tagName==='IMG'&&!e.getAttribute('src')))});
  all.forEach(function(e,i){if(sl.indexOf(e)<0){e.parentNode.removeChild(e);if(dots[i])dots[i].setAttribute('data-x','1')}});
  dots=dots.filter(function(d){if(d.getAttribute('data-x')){d.parentNode.removeChild(d);return false}return true});
  if(sl.length&&!sl.some(function(e){return e.classList.contains('on')}))sl[0].classList.add('on');
  if(sl.length<2){if(dots[0]&&dots[0].parentNode)dots[0].parentNode.style.display='none';return}
  if(!dots.length)return;
  var idx=Math.max(0,sl.findIndex(function(e){return e.classList.contains('on')})),t;
  function show(i){idx=i;sl.forEach(function(e,j){e.classList.toggle('on',j===i)});dots.forEach(function(d,j){d.setAttribute('aria-pressed',j===i?'true':'false')})}
  function start(){clearInterval(t);t=setInterval(function(){show((idx+1)%sl.length)},4800)}
  if(!RM)setTimeout(start,(cn++%2)*2400);
  dots.forEach(function(d,j){d.addEventListener('click',function(e){e.preventDefault();show(j);if(!RM)start()})});
});
/* home: handling rules + routes */
var routes=QA('path.route,.route');
if(routes.length&&!Q('[aria-label="Sample Certificate of Handling"]')){
  group(QA('.rule'),function(i){routes.forEach(function(r,j){r.setAttribute('stroke',j===i?'url(#routeGrad)':'#3A433E');r.setAttribute('stroke-width',j===i?'6':'2.5')})});
}
/* home: pick a pair -> native IX3 ("Pick a pair: ..." click interactions) */
/* home: statement fill, loop diagram, counters */
/* statement fill: split words */
var fp0=Q('#fillp');if(fp0&&!fp0.querySelector('.fw')){var ws=fp0.textContent.trim().split(/\s+/);fp0.textContent='';ws.forEach(function(t){var s=document.createElement('span');s.className='fw';s.textContent=t+' ';fp0.appendChild(s)})}
var fp=Q('#fillp'),fw=fp?QA('.fw',fp):[],lp=Q('#loop'),pr=Q('#proof'),counted=false;
var LR=[[.3,.7],[.7,.9],[.2,.5],[.15,.4],[0,.15]],NC=['#0F4D3A','#0F4D3A','#8FBFA8'],NI=[0,2,5];
var lpaths=lp?QA('path[stroke-dasharray="1"]',lp):[],lnodes=lp?QA('circle',lp).filter(function(c){return c.getAttribute('r')==='7.2'}):[],stg=QA('[data-stage]');
var CN={'1,857':1857,'70':70,'49,466':49466},cnodes=[];
if(pr){var w=document.createTreeWalker(pr,NodeFilter.SHOW_TEXT),n;while(n=w.nextNode()){var v=n.nodeValue.trim();if(CN[v])cnodes.push([n,CN[v]])}}
function onScroll(){
  var vh=innerHeight;
  if(fw.length){var r=fp.getBoundingClientRect(),f=Math.min(1,Math.max(0,(vh*.8-r.top)/Math.max(1,r.height+vh*.35))),lit=Math.round(f*fw.length);fw.forEach(function(s,i){s.style.color=i<lit?'#0E1512':'#B4B8B1'})}
  if(lp&&lpaths.length){var R=lp.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh*.55-R.top)/Math.max(1,R.height-vh*.5)));
    lpaths.forEach(function(e,i){var g=LR[i]||[0,1];e.setAttribute('stroke-dashoffset',String(1-Math.min(1,Math.max(0,(p-g[0])/(g[1]-g[0])))))});
    var a=-1;stg.forEach(function(e,i){if(e.getBoundingClientRect().top<vh*.6)a=i});
    lnodes.forEach(function(c,i){c.setAttribute('fill',a>=NI[i]?NC[i]:'#D3D4CC')})}
  if(cnodes.length&&!counted&&pr.getBoundingClientRect().top<vh*.85){counted=true;var t0=performance.now();
    (function step(t){var x=Math.min(1,(t-t0)/1600),e=1-Math.pow(1-x,3);cnodes.forEach(function(c){c[0].nodeValue=Math.round(c[1]*e).toLocaleString('en-US')});if(x<1)requestAnimationFrame(step)})(t0)}
}
if(fw.length||lpaths.length||cnodes.length){addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll()}
/* loop page: tear-apart + recovery bars */
function reveal(el,th,setup,go){if(!el)return;if(!('IntersectionObserver' in window)||RM)return;setup();var io=new IntersectionObserver(function(es){if(es.some(function(x){return x.isIntersecting})){io.disconnect();setTimeout(go,250)}},{threshold:th});io.observe(el)}
var tear=Q('#tear');
if(tear){var te=QA('svg [style*="transition"]',tear).map(function(e){return [e,e.style.transform,e.style.strokeDashoffset,e.style.opacity]});
  reveal(tear,.45,function(){te.forEach(function(x){var e=x[0],tr=e.style.transition;e.style.transition='none';if(x[1])e.style.transform='translate(0px, 0px)';if(x[2])e.style.strokeDashoffset='1';if(x[3])e.style.opacity='0';e.getBoundingClientRect();e.style.transition=tr})},
  function(){te.forEach(function(x){var e=x[0];if(x[1])e.style.transform=x[1];if(x[2])e.style.strokeDashoffset=x[2];if(x[3])e.style.opacity=x[3]})})}
var mb=QA('#mb').filter(function(e){return Q('[role="img"]',e)})[0];
if(mb){var bars=Array.prototype.slice.call(Q('[role="img"]',mb).children),pc=[];
  var w2=document.createTreeWalker(mb,NodeFilter.SHOW_TEXT),m;while(m=w2.nextNode()){if(/^\d+\s*[–-]\s*\d+%$/.test(m.nodeValue.trim()))pc.push(m.parentNode)}
  reveal(mb,.35,function(){bars.forEach(function(b,i){b.style.transition='none';b.style.width='0%';b.getBoundingClientRect();b.style.transition='width 1.2s cubic-bezier(.6,0,.2,1) '+(i*.15)+'s'});pc.forEach(function(e){e.style.transition='none';e.style.opacity='0';e.getBoundingClientRect();e.style.transition='opacity .8s ease .6s'})},
  function(){bars.forEach(function(b){b.style.width=''});pc.forEach(function(e){e.style.opacity=''})})}
/* brand protection: rule chips, rule cards, certificate */
var fig=Q('[aria-label="Sample Certificate of Handling"]');
if(fig){
  var CE=[['Rule A, controlled reuse',['Gate receipt','Graded','Approved markets only','Reuse'],[1690,260,330,200],'Reuse only in the countries and channels you approved. Destinations listed per shipment.'],
   ['Rule B, debrand and reuse',['Gate receipt','Graded','Debranded','Reuse or refurbish'],[1120,310,640,410],'Brand identifiers removed where agreed before redistribution.'],
   ['Rule C, destruction and recovery',['Gate receipt','Separated','Granulated','Material and energy recovery'],[0,0,1860,620],'No resale. The full weight goes to approved material and energy recovery routes.']];
  var NM=['Reused','Refurbished','Recovered as material','Energy recovery'],TOT=2480,K='ABC';
  var lot=null;QA('*',fig).forEach(function(e){if(!lot&&e.children.length===0&&/^Lot SV-/.test(e.textContent.trim()))lot=e});
  var g0=byText(fig,'Gate receipt'),slist=g0&&g0.parentNode.parentNode,bar=Q('[role="img"]',fig),dl=bar&&bar.nextElementSibling,note=dl&&dl.nextElementSibling;
  var see=QA('a').filter(function(a){return /^See the sample certificate/.test(a.textContent.trim())})[0];
  var pct=function(v){return (Math.round(v/TOT*1000)/10).toFixed(1)};
  var setRule=function(i){var c=CE[i];if(lot)lot.textContent='Lot SV-2026-0412 · '+c[0];
    if(slist)Array.prototype.forEach.call(slist.children,function(li,j){li.lastElementChild.textContent=c[1][j]});
    var nz=c[2].map(function(v,j){return v>0?j:-1}).filter(function(j){return j>=0}),last=nz[nz.length-1];
    if(bar){Array.prototype.forEach.call(bar.children,function(s,j){var v=c[2][j];s.style.width=(v/TOT*100).toFixed(2)+'%';s.style.borderRight=v>0&&j!==last?'3px solid #F2F1EC':'0'});
      bar.setAttribute('aria-label','Breakdown by route: '+NM.map(function(n,j){return n+' '+pct(c[2][j])+' percent'}).join(', '))}
    if(dl)Array.prototype.forEach.call(dl.children,function(row,j){var v=c[2][j],d=row.lastElementChild;d.textContent=v.toLocaleString('en-US')+' kg · '+pct(v)+'%';d.style.color=v>0?'#0E1512':'#8A908C'});
    if(note)note.textContent=c[3];if(see)see.textContent='See the sample certificate for rule '+K[i]};
  var sc,sr;sc=group(QA('.chip'),null);sr=group(QA('.rule'),null);
  QA('.chip').forEach(function(e,i){e.addEventListener('click',function(){sr&&sr(i);setRule(i)})});
  QA('.rule').forEach(function(e,i){e.addEventListener('click',function(){sc&&sc(i);setRule(i)})});
}
/* materials: filter chips */
var mchips=fig?[]:QA('.chip');
if(mchips.length){var lbl=mchips.map(function(c){return c.textContent.trim().toLowerCase()}),cats=QA('[data-cat]');
  group(mchips,function(i){cats.forEach(function(c){var it=c.closest('.w-dyn-item')||c;it.style.display=(i===0||c.getAttribute('data-cat').trim().toLowerCase()===lbl[i])?'':'none'})})}
/* facilities: CMS sites list + map pins (keyed by slug) */
var sites=QA('.site[data-site]');
if(sites.length){
  var NS='http://www.w3.org/2000/svg',pin0=Q('g.pin[data-site]'),svg=pin0&&pin0.ownerSVGElement;
  var pins=QA('g.pin[data-site]').map(function(g){var c=QA('circle',g).filter(function(x){return x.getAttribute('stroke-width')==='3'})[0];if(!c)return null;var dash=c.hasAttribute('stroke-dasharray');
    return [g,c,dash,dash?7:+c.getAttribute('r')]}).filter(Boolean);
  sites.forEach(function(b){var s=b.getAttribute('data-site'),x=parseFloat(b.getAttribute('data-x')),y=parseFloat(b.getAttribute('data-y'));
    if(!svg||isNaN(x)||isNaN(y)||pins.some(function(p){return p[0].getAttribute('data-site')===s}))return;
    var g=document.createElementNS(NS,'g');g.setAttribute('class','pin');g.setAttribute('data-site',s);
    var hit=document.createElementNS(NS,'circle');hit.setAttribute('cx',x);hit.setAttribute('cy',y);hit.setAttribute('r','22');hit.setAttribute('fill','transparent');
    var c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r','7');c.setAttribute('fill','#0F4D3A');c.setAttribute('stroke','#0F4D3A');c.setAttribute('stroke-width','3');
    var nm=Q('.nm',b),t=document.createElementNS(NS,'text');t.setAttribute('x',x+16);t.setAttribute('y',y-4);t.setAttribute('font-family','Inter Tight, system-ui, sans-serif');t.setAttribute('font-size','17');t.setAttribute('font-weight','500');t.setAttribute('fill','#0E1512');t.setAttribute('paint-order','stroke');t.setAttribute('stroke','#E8E7E0');t.setAttribute('stroke-width','5');t.textContent=nm?nm.textContent.split(',')[0]:'';
    g.appendChild(hit);g.appendChild(c);g.appendChild(t);svg.appendChild(g);pins.push([g,c,false,7])});
  var pickSite=function(s){sites.forEach(function(b){b.setAttribute('aria-expanded',b.getAttribute('data-site')===s?'true':'false')});
    pins.forEach(function(p){var on=p[0].getAttribute('data-site')===s;p[1].setAttribute('r',String(on?(p[3]===11?14:11):p[3]));p[1].setAttribute('fill',on?'#C6F24E':(p[2]?'#E8E7E0':'#0F4D3A'))})};
  sites.forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();pickSite(b.getAttribute('data-site'))})});
  pins.forEach(function(p){p[0].addEventListener('click',function(){pickSite(p[0].getAttribute('data-site'))})});
  var first=sites.filter(function(b){return /planned|development/i.test(b.getAttribute('data-status')||'')})[0]||sites[0];
  pickSite(first.getAttribute('data-site'));
}
/* blog: table of contents (data-toc-* attributes, same setup as Bankoh) + read time */
QA('[data-toc-wrap]').forEach(function(root){
  if(root.getAttribute('data-toc-init'))return;
  var content=Q('[data-toc-content]',root),list=Q('[data-toc-list]',root),tpl=list&&Q('[data-toc-link]',list),aside=Q('[data-toc-aside]',root);
  if(!content||!list||!tpl)return;
  var lv=root.getAttribute('data-toc-levels')||'h2,h3',off=parseInt(root.getAttribute('data-toc-offset'),10)||96;
  var hs=QA(lv,content).filter(function(h){return !h.hasAttribute('data-toc-ignore')&&h.textContent.trim()});
  tpl.parentNode.removeChild(tpl);
  root.setAttribute('data-toc-init','1');
  if(!hs.length){if(aside)aside.style.display='none';return}
  var used={};
  var links=hs.map(function(h){
    if(!h.id){var s=h.textContent.trim().toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'section';used[s]=(used[s]||0)+1;h.id=used[s]>1?s+'-'+used[s]:s}
    var a=tpl.cloneNode(true);a.removeAttribute('data-toc-link');a.setAttribute('data-toc-item','');a.setAttribute('data-toc-depth',h.tagName.charAt(1));if(h.tagName!=='H2')a.classList.add('is-depth-'+h.tagName.charAt(1));a.setAttribute('href','#'+h.id);a.textContent=h.textContent.trim();
    a.addEventListener('click',function(e){e.preventDefault();var L=window.__svLenis;if(L)L.scrollTo(h,{offset:-off});else window.scrollTo({top:h.getBoundingClientRect().top+window.scrollY-off,behavior:RM?'auto':'smooth'})});
    list.appendChild(a);return a});
  function setActive(i){links.forEach(function(a,j){a.setAttribute('data-toc-status',j===i?'active':'');a.classList.toggle('is-active',j===i)})} /* styling: combo class .article_toc-link.is-active in the Designer */
  function onToc(){var act=0;hs.forEach(function(h,i){if(h.getBoundingClientRect().top-off-1<=0)act=i});setActive(act)}
  addEventListener('scroll',onToc,{passive:true});onToc();
});
var rta=Q('[data-read-time-article]');
if(rta){var wc=rta.textContent.trim().split(/\s+/).filter(Boolean).length,mins=Math.max(1,Math.ceil(wc/200));QA('[data-read-time]').forEach(function(e){e.textContent=mins+' min read'})}

return function(){IV.forEach(function(t){clearInterval(t)});WL.forEach(function(w){window.removeEventListener(w[0],w[1],w[2])})};
};

/* 3. Page transition (Osmo) -------------------------------------------------- */
// Seconvia page transition (Osmo boilerplate + Barba + Lenis + DrawSVG)
(function(){
if(!window.barba||!window.gsap||!window.DrawSVGPlugin){window.svInit&&svInit();window.initButton046&&initButton046();window.Webflow=window.Webflow||[];Webflow.push(function(){heroIn()});return}
gsap.registerPlugin(CustomEase,DrawSVGPlugin);
history.scrollRestoration="manual";
document.body.setAttribute("data-barba","wrapper");
var lenis=null,svClean=null;
var hasLenis=typeof window.Lenis!=="undefined",hasST=typeof window.ScrollTrigger!=="undefined";
var rmMQ=matchMedia("(prefers-reduced-motion: reduce)"),reducedMotion=rmMQ.matches;
rmMQ.addEventListener&&rmMQ.addEventListener("change",function(e){reducedMotion=e.matches});
CustomEase.create("osmo","0.625, 0.05, 0, 1");
gsap.defaults({ease:"osmo",duration:.6});

function T(){var w=document.querySelector("[data-transition-wrap]");if(!w)return null;
  var mk=w.querySelector("[data-transition-mark]");
  return {w:w,P:w.querySelectorAll("[data-transition-path]"),mk:mk,mp:mk?mk.querySelectorAll("path"):[],mn:mk?mk.querySelectorAll("circle"):[]}}

// ---------- page functions ----------
function initPage(root){
  if(svClean){svClean();svClean=null}
  if(window.svInit)svClean=window.svInit();
  if(window.initButton046)initButton046();
  QA("video[autoplay]",root).forEach(function(v){v.muted=true;var p=v.play();p&&p.catch&&p.catch(function(){})});
}
function QA(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function reinitWebflow(html){
  var m=html&&html.match(/data-wf-page="([^"]+)"/);if(m)document.documentElement.setAttribute("data-wf-page",m[1]);
  if(!window.Webflow)return;
  // No Webflow.destroy(): that wipes IX3, which registers its interactions only once per document.
  // Re-run the ready() of the Webflow modules this site uses (navbar sits inside the Barba container).
  ["navbar","dropdown","forms","links","tabs","slider","lightbox"].forEach(function(n){try{var x=Webflow.require(n);x&&x.ready&&x.ready()}catch(e){}});
  try{var i2=Webflow.require("ix2");i2&&i2.init&&i2.init()}catch(e){}
}
function rerunSequence(root){
  if(!root.querySelector("[data-sequence-wrap]"))return;
  var old=QA('script[src*="imagesequencescroll"]')[0];if(!old)return;
  var s=document.createElement("script");s.src=old.src;document.body.appendChild(s);
}
function replayReveals(root){
  QA(".draw",root).forEach(function(e){e.style.animation="none";e.offsetWidth;e.style.animation=""});
}
// Page-in animations live in Webflow IX3 (custom trigger "sv-page-in": hero reveal, marquee). Edit them in the
// Interactions panel. We only fire the event. After a Barba swap IX3 still points at the old page's elements,
// so we re-register the same interactions (IX3 update) before firing.
var ixSnap=null;
function ixSnapshot(i){if(!ixSnap&&i.timelineDefs&&i.timelineDefs.size)ixSnap={I:JSON.stringify([...i.interactions.values()]),T:JSON.stringify([...i.timelineDefs.values()])}}
function ixRefresh(i){if(!ixSnap||!i.remove||!i.register)return;try{var I=JSON.parse(ixSnap.I);
  i.remove(I.map(function(x){return x.id}));i.register(I,JSON.parse(ixSnap.T))}catch(e){}}
function heroIn(n,fresh){n=n||0;try{var ix=Webflow.require("ix3"),i=ix&&ix.getInstance&&ix.getInstance();
  if(i&&i.interactions&&i.interactions.size){ixSnapshot(i);if(fresh)ixRefresh(i);ix.emit("sv-page-in");return}}catch(e){}
  if(n<90)requestAnimationFrame(function(){heroIn(n+1,fresh)})} // wait until IX3 has registered (max ~1.5s)
function scrollToHash(){
  var h=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if(!h)return;if(lenis)lenis.scrollTo(h,{offset:-96,immediate:true});else h.scrollIntoView();
}

// ---------- transitions ----------
function resetPage(c){
  window.scrollTo(0,0);gsap.set(c,{clearProps:"position,top,left,right"});
  if(lenis){lenis.resize();lenis.start()}
}
function runLeave(current,next){
  var t=T(),tl=gsap.timeline({onComplete:function(){current.remove()}});
  if(reducedMotion||!t)return tl.set(current,{autoAlpha:0});
  tl.set(next,{autoAlpha:0},0);
  tl.set(t.P,{strokeWidth:"4%",drawSVG:"0% 0%"},0);
  tl.set(t.mk,{autoAlpha:1,y:0},0).set(t.mp,{drawSVG:"0% 0%"},0).set(t.mn,{scale:0,transformOrigin:"50% 50%"},0);
  tl.to(t.P,{duration:1,drawSVG:"0% 100%",ease:"power1.inOut",stagger:.06},0);
  tl.to(t.P,{strokeWidth:"42%",duration:.8,ease:"power1.inOut",stagger:.06},.2);
  tl.to(t.mp[0],{drawSVG:"0% 100%",duration:.5,ease:"power2.inOut"},.75);
  tl.to(t.mp[1],{drawSVG:"0% 100%",duration:.4,ease:"power2.inOut"},.95);
  tl.to(t.mn,{scale:1,duration:.35,ease:"back.out(2.5)",stagger:.1},1.05);
  return tl;
}
function runEnter(next){
  var t=T(),tl=gsap.timeline();
  if(reducedMotion||!t){tl.set(next,{autoAlpha:1});tl.call(resetPage,[next]);tl.call(function(){heroIn(0,true)});return new Promise(function(r){tl.call(r)})}
  tl.add("startEnter",1.5);
  tl.set(next,{autoAlpha:1},"startEnter");
  tl.call(function(){QA('[data-barba="container"]').forEach(function(c){if(c!==next)c.remove()});resetPage(next);replayReveals(next);heroIn(0,true)},null,"startEnter");
  tl.to(t.mk,{autoAlpha:0,y:-12,duration:.3,ease:"power2.in"},"startEnter");
  tl.to(Array.prototype.slice.call(t.P).reverse(),{drawSVG:"100% 100%",strokeWidth:"4%",duration:1.1,ease:"power1.inOut",stagger:.06},"startEnter+=0.15");
  if(!next.querySelector(".ln")){var h=next.querySelector("h1");if(h)tl.fromTo(h,{yPercent:25,autoAlpha:0},{yPercent:0,autoAlpha:1,ease:"expo.out",duration:1},"startEnter+=0.6")}
  tl.add("pageReady","startEnter+=0.2");
  return new Promise(function(r){tl.call(r,null,"pageReady")});
}

// ---------- barba ----------
barba.hooks.beforeEnter(function(d){
  gsap.set(d.next.container,{position:"fixed",top:0,left:0,right:0});
  if(lenis)lenis.stop();
  reinitWebflow(d.next.html); // next page is still hidden: IX3 sets its start states here
});
barba.hooks.afterLeave(function(){if(hasST)ScrollTrigger.getAll().forEach(function(x){x.kill()})});
barba.hooks.afterEnter(function(d){
  initPage(d.next.container);
  rerunSequence(d.next.container);
  if(lenis){lenis.resize();lenis.start()}
  scrollToHash();
  if(hasST)ScrollTrigger.refresh();
});
try{barba.init({
  debug:false,timeout:7000,preventRunning:true,
  prevent:function(o){var el=o.el,h=el.getAttribute("href")||"";
    return h.charAt(0)==="#"||el.closest(".w-dropdown-toggle")||el.hasAttribute("data-barba-prevent")||/\.(pdf|zip|jpg|png|webp|mp4)$/i.test(h)},
  transitions:[{name:"default",sync:true,
    once:function(d){initLenis();initPage(d.next.container);resetPage(d.next.container);window.Webflow=window.Webflow||[];Webflow.push(function(){heroIn()});if(location.hash)setTimeout(scrollToHash,50)},
    leave:function(d){return runLeave(d.current.container,d.next.container)},
    enter:function(d){return runEnter(d.next.container)}}]
});}catch(e){initLenis();initPage(document);window.Webflow=window.Webflow||[];Webflow.push(function(){heroIn()})}

function initLenis(){
  if(lenis||!hasLenis)return;
  lenis=new Lenis({lerp:.165,wheelMultiplier:1.25,anchors:{offset:-96}});
  window.__svLenis=lenis;
  if(hasST)lenis.on("scroll",ScrollTrigger.update);
  gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
}
})();
