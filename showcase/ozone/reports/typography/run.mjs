import {chromium} from '/opt/node-tools/node_modules/playwright/index.mjs';
const b=await chromium.launch();
const cases=[[640,360,3],[844,390,5],[320,568,4],[390,844,3],[1440,900,5],[1280,720,5],[720,450,3]];
for(const mode of ['vw','vh']){
 for(const [w,h,span] of cases){
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.goto('file://'+process.argv[2]+'/page.html');await p.evaluate(()=>document.fonts.load('800 1em B'));
  const r=await p.evaluate(([mode,span])=>{
   const cs=getComputedStyle(document.documentElement);const root=document.documentElement;
   const cols=+cs.getPropertyValue('--cols'),m=parseFloat(getComputedStyle(document.body).fontSize)&&0;
   const z=document.getElementById('z');
   const rem=16;const margin=document.getElementById('z').offsetLeft, g=parseFloat(cs.getPropertyValue('--gutter'))*16;
   const inner=Math.min(innerWidth-2*margin,1680);const col=(inner-(cols-1)*g)/cols;const wz=col*span+(span-1)*g;
   z.style.setProperty('--w',wz+'px');
   const probe=document.createElement('div');probe.style.cssText='font-size:var(--t-h1)';document.body.append(probe);
   let h1=parseFloat(getComputedStyle(probe).fontSize);probe.style.fontSize='var(--t-h2)';let h2=parseFloat(getComputedStyle(probe).fontSize);
   if(mode=='vh'){h1=Math.min(h1,0.131*innerHeight);h2=Math.min(h2,0.0715*innerHeight);}
   z.style.setProperty('--h1',h1+'px');z.style.setProperty('--h2',h2+'px');
   const l1=z.querySelector('.l1'),l2=z.querySelector('.l2');
   l2.style.marginTop='.4em';
   const zr=z.getBoundingClientRect();
   return {zoneW:Math.round(wz),h1:+h1.toFixed(1),h2:+h2.toFixed(1),L1lines:Math.round(l1.getBoundingClientRect().height/(h1*.92)),L2lines:Math.round(l2.getBoundingClientRect().height/(h2*1.08)),top:Math.round(zr.top),block:Math.round(zr.height),bottom:Math.round(zr.bottom)}
  },[mode,span]);
  console.log(mode,w+'x'+h,JSON.stringify(r));await p.close();}}
await b.close();
