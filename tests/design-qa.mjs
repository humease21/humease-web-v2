/** 리디자인 FAIL 기준 자동 점검 */
import { chromium } from 'playwright';
const B = 'http://localhost:4173';
const R = ['/', '/about/', '/enterprise-data/', '/consulting/e-discovery/', '/consulting/internal-control/',
  '/consulting/exchange-archive/', '/consulting/ai-transformation/', '/ai-services/', '/ai-services/mom-ie/',
  '/solutions/', '/contact/', '/insights/'];
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
const fails = [];

for (const route of R) {
  await p.goto(B + route, { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    // ① 이미지가 카드 안에 갇혔는가 — rounded + border 를 가진 래퍼 안의 이미지
    const caged = imgs.filter((i) => {
      let el = i.parentElement, depth = 0;
      while (el && depth < 3) {
        const s = getComputedStyle(el);
        const r = parseFloat(s.borderRadius) || 0;
        const bw = parseFloat(s.borderTopWidth) || 0;
        if (r >= 8 && (bw > 0 || s.overflow === 'hidden') && el.getBoundingClientRect().width < window.innerWidth * 0.92) return true;
        el = el.parentElement; depth++;
      }
      return false;
    }).map((i) => i.getAttribute('src'));

    // ② 반복 카드 패턴 — 동일 클래스 조합이 3회 이상 + rounded + border
    const cls = {};
    for (const el of document.querySelectorAll('div,article,li')) {
      const s = getComputedStyle(el);
      if ((parseFloat(s.borderRadius) || 0) >= 8 && (parseFloat(s.borderTopWidth) || 0) > 0) {
        const k = el.className.toString();
        cls[k] = (cls[k] || 0) + 1;
      }
    }
    const cardRepeat = Object.entries(cls).filter(([, n]) => n >= 3);

    // ③ 첫 화면 정보량 — 뷰포트 안 텍스트 노드 길이
    const firstScreenText = [...document.querySelectorAll('h1,h2,h3,p,li,a,span')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0 && r.height > 0; })
      .map((e) => e.textContent.trim()).join(' ').replace(/\s+/g, ' ');

    // ④ 보라색 SaaS — 보라 계열 배경/그라디언트
    let purple = 0;
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      const t = s.backgroundImage + ' ' + s.backgroundColor;
      const m = t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g) || [];
      for (const c of m) {
        const [r, g, bl] = c.match(/\d+/g).map(Number);
        if (bl > r + 40 && bl > g + 50 && r > g) purple++;
      }
    }

    // ⑤ Hero 높이
    const hero = document.querySelector('main > section');
    const heroH = hero ? hero.getBoundingClientRect().height / window.innerHeight : 0;

    return { caged, cardRepeat, firstScreenLen: firstScreenText.length, purple, heroH };
  });

  if (d.caged.length) fails.push(`${route} 이미지가 카드에 갇힘: ${d.caged.join(', ')}`);
  if (d.cardRepeat.length) fails.push(`${route} 반복 카드 패턴 ${d.cardRepeat.length}종`);
  if (d.firstScreenLen > 420) fails.push(`${route} 첫 화면 정보 과다 (${d.firstScreenLen}자)`);
  if (d.purple > 2) fails.push(`${route} 보라 계열 ${d.purple}건`);
  if (route === '/' && d.heroH < 0.86) fails.push(`Hero 높이 ${(d.heroH * 100).toFixed(0)}svh (기준 88svh)`);
}
await b.close();
console.log(fails.length ? 'FAIL\n  ' + fails.join('\n  ') : `PASS  12페이지 — 카드 갇힘 0 · 반복카드 0 · 첫화면 과다 0 · 보라 0 · Hero 높이 충족`);
