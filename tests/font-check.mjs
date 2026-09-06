import { chromium } from 'playwright';
const B='http://localhost:4173';
const P=['/','/about/','/enterprise-data/','/solutions/','/contact/','/insights/','/ai-services/',
 '/ai-services/mom-ie/','/ai-services/anybuild/','/consulting/e-discovery/','/consulting/internal-control/',
 '/consulting/exchange-archive/','/consulting/ai-transformation/','/solutions/enterprise-vault/',
 '/solutions/enterprise-vault-capture/','/solutions/data-insight/','/solutions/ediscovery-platform/'];
const b=await chromium.launch(); const c=await b.newContext({viewport:{width:1440,height:900}}); const p=await c.newPage();
const bad=[];
for(const u of P){
  await p.goto(B+u,{waitUntil:'networkidle'});
  const d=await p.evaluate(()=>{
    const out=[];
    for(const el of document.querySelectorAll('h1,h2,h3,p,li,dt,dd,a,span')){
      const t=(el.textContent||'').trim();
      if(!/[가-힣]/.test(t)) continue;
      if(el.children.length) continue;            // 리프 노드만
      const ff=getComputedStyle(el).fontFamily;
      if(/Source Serif/.test(ff.split(',')[0])) out.push({tag:el.tagName, ff:ff.split(',')[0], t:t.slice(0,28)});
    }
    return out;
  });
  for(const x of d) bad.push(u+' '+x.tag+' '+x.ff+' "'+x.t+'"');
}
await b.close();
console.log(bad.length? '  FAIL 한글에 세리프 적용 '+bad.length+'건:\n    '+bad.slice(0,10).join('\n    ')
                      : `  PASS  ${P.length}개 페이지 — 한글 요소에 Source Serif 적용 0건`);
