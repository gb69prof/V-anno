import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright');

const root=resolve(new URL('..',import.meta.url).pathname);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const relative=pathname==='/'?'index.html':pathname.replace(/^\//,'');
    const file=resolve(root,relative);
    if(!file.startsWith(root)){res.writeHead(403).end();return;}
    if((await stat(file)).isDirectory()){res.writeHead(302,{Location:`${pathname.replace(/\/$/,'')}/index.html`}).end();return;}
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(file));
  }catch{res.writeHead(404).end('Not found');}
});
await new Promise(r=>server.listen(4173,'127.0.0.1',r));

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1024,height:1366},deviceScaleFactor:2,hasTouch:true});
const page=await context.newPage();
const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  assert(await page.locator('#routeList li').count()===6,'Devono esserci sei movimenti.');
  await page.click('#startButton');
  assert(await page.locator('#panel-lesson section').count()>=5,'Lezione non articolata.');
  assert(await page.locator('#panel-test fieldset').count()===5,'Il test deve avere cinque domande.');
  assert(await page.locator('#panel-map img').getAttribute('src')==='maps/01-mondo.svg','Mappa locale mancante.');

  await page.click('#tab-test');
  for(const [i,a] of [0,1,2,1,2].entries())await page.check(`input[name="q-${i}"][value="${a}"]`);
  await page.click('#quizForm button[type="submit"]');
  assert((await page.locator('#quizResult').innerText()).includes('5/5'),'Il test corretto non produce 5/5.');

  await page.click('#nextButton');await page.click('#tab-test');
  for(let i=0;i<5;i++)await page.check(`input[name="q-${i}"][value="0"]`);
  await page.click('#quizForm button[type="submit"]');
  assert(await page.locator('.recovery').count()===3,'Il recupero deve elencare solo i tre errori.');
  await page.click('#retryWrong');
  assert(await page.locator('#quizForm fieldset').count()===3,'Il retest deve includere solo le domande sbagliate.');

  await page.click('#tab-notes');await page.fill('#notesArea','Il muro rende pensabile un oltre.');await page.waitForTimeout(500);
  await page.reload({waitUntil:'networkidle'});await page.click('#startButton');await page.click('#tab-notes');
  assert((await page.inputValue('#notesArea')).includes('muro'),'Le note locali non persistono.');

  await page.setViewportSize({width:1366,height:1024});await page.click('#tab-map');
  assert(await page.locator('.map-frame img').isVisible(),'Mappa non visibile su viewport iPad orizzontale.');
  await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:10000});
  await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});
  assert((await page.title()).includes('Montale'),'La riapertura offline non funziona.');
  assert(errors.length===0,`Errori console: ${errors.join(' | ')}`);
  console.log('PASS: struttura, quiz corretto, errori+recupero, retest selettivo, note, iPad e offline.');
}finally{await context.setOffline(false);await browser.close();await new Promise(r=>server.close(r));}
