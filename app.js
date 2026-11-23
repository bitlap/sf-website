import {siteConfig} from './site-config.js?v=6fa97940f8cf';
import {initializeLanguage,t} from './i18n.js?v=93b988752be5';
const paths = {
 download:'M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4',
 globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z',
 play:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM10 8l6 4-6 4Z',
 albums:'M6 3h14v14H6ZM3 7v14h14M9 13l3-3 5 5M15 7h.01',
 sparkles:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4',
 search:'M19 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 5 6',
 compass:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-5-5-3 6-6 3 3-6Z',
 bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4',
 user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
 chevron:'m7 10 5 5 5-5',
 chat:'M21 11a9 8 0 0 1-9 8H8l-5 3 1-6a8 8 0 0 1-1-5 9 8 0 0 1 18 0ZM8 10h8M8 14h5',
 scan:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h2v2H8Zm6 0h2v2h-2Zm-6 6h2v2H8Zm6 0h2v2h-2Z',
 info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10h.01',
 close:'m6 6 12 12M6 18 18 6',
 menu:'M4 6h16M4 12h16M4 18h16',
 apple:'M16 2c0 3-2 4-4 4 0-2 1-4 4-4ZM17 7c-2-1-4 0-5 0s-3-1-5 0c-5 2-3 10 0 13 2 2 3 0 5 0s3 2 5 0c1-1 2-3 3-5-4-1-5-5-1-7Z',
 android:'m7 4-2-2m12 2 2-2M5 9a7 7 0 0 1 14 0H5Zm0 3v6h14v-6M2 12v6m20-6v6M8 18v4m8-4v4M8 6h.01M16 6h.01',
 wechat:'M15 10c0 4-5 7-8 5l-4 2 1-4C0 8 5 3 10 4c3 0 5 2 5 6ZM12 14c0-5 9-7 10-1 1 2 0 4-1 5l1 3-3-1c-4 1-7-2-7-6ZM6 8h.01M10 8h.01M16 13h.01M19 13h.01'
};
function renderIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[el.dataset.icon]||paths.sparkles}"/></svg>`})}
renderIcons();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.desktop-nav');
nav.id='main-navigation';menu.setAttribute('aria-controls',nav.id);
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',t('展开菜单'))}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',t(open?'收起菜单':'展开菜单'))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
const dialog=document.querySelector('#platform-dialog');
const messages={
  ios:{title:'与幻兔，在 iPhone 上见面',description:'iOS 版本目前处于内部 TestFlight 测试阶段。公开下载入口将在正式开放后接入，敬请期待。'},
  android:{title:'Android 版，即将与你见面',description:'Android 下载入口正在准备中。正式安装包上线后，你可以从这里安全下载。'},
  mini:{title:'微信扫一扫，轻松发现',description:'小程序入口与官方小程序码待接入。正式开放后，你可以在这里扫码进入。'}
};
let selectedPlatform=null;
function updateDialog(){
  if(!dialog||!selectedPlatform)return;
  const message=messages[selectedPlatform],config=siteConfig.platforms[selectedPlatform];
  document.querySelector('#dialog-title').textContent=t(message.title);
  document.querySelector('#dialog-description').textContent=t(message.description);
  const qr=document.querySelector('#mini-qr');qr.hidden=!(selectedPlatform==='mini'&&config.qrImage);
  if(!qr.hidden){qr.src=config.qrImage;document.querySelector('#dialog-description').textContent=document.documentElement.lang==='en'?'Scan the official code with WeChat.':'使用微信扫描官方小程序码，即可进入幻兔。'}
}
// Only safe HTTPS destinations are accepted, even if a config edit is malformed.
function safePublicUrl(value){if(!value)return null;try{const url=new URL(value);return url.protocol==='https:'?url.href:null}catch{return null}}
document.querySelectorAll('[data-platform]').forEach(button=>button.addEventListener('click',()=>{
  selectedPlatform=button.dataset.platform;const config=siteConfig.platforms[selectedPlatform],url=safePublicUrl(config?.url);
  if(url){window.location.assign(url);return}
  if(dialog){updateDialog();dialog.showModal()}
}));
document.querySelectorAll('#dialog-title,#dialog-description').forEach(el=>el.dataset.dynamic='');
if(dialog){
  document.querySelectorAll('.dialog-close,.dialog-confirm').forEach(el=>el.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()});
}
const categories={
 photo:{image:'landscape.jpg',alt:'自然风景摄影示例',label:'在平凡里，发现不平凡',kicker:'用眼睛，收藏世界',title:['总有一帧，','让你想多停留一会儿。'],description:'风景、日常、光影与不期而遇。浏览摄影图集，把触动你的内容收藏起来，让下一次灵感有迹可循。',icon:'compass'},
 read:{image:'explore/books-comics.jpg',alt:'展开的书本与森林旅行漫画分镜',label:'给自己，一段安静的时间',kicker:'把时间，交给好故事',title:['翻开一页，','走进另一个世界。'],description:'在文字、图书和漫画之间，发现适合此刻心情的故事。给忙碌的生活留一段阅读时间，让想象继续延伸。',icon:'albums'},
 music:{image:'explore/music-video.jpg',alt:'黑胶唱片、耳机与摄影机的音乐影像组合',label:'把日常，调到喜欢的频道',kicker:'声音与画面，都有共鸣',title:['一首歌，一段影像，','刚好懂你的此刻。'],description:'浏览音乐与视频内容，找到你喜欢的节奏。让耳朵和眼睛一起出发，在旋律与画面里获得新的灵感。',icon:'play'},
 game:{image:'explore/casual-games.jpg',alt:'2048 数字方块与森林拼图的休闲游戏组合',label:'偶尔放空，也是生活的灵感',kicker:'休息一下，玩一会儿',title:['不用赶路，','快乐也可以很简单。'],description:'从 2048 到拼图，再到更多轻量 H5 游戏。用几分钟的轻松互动，给忙碌的自己一个小小的休息站。',icon:'sparkles'}
};
const tabs=[...document.querySelectorAll('[data-category]')];let selectedCategory='photo';
function updateCategory(){
  if(!tabs.length)return;const c=categories[selectedCategory];
  const img=document.querySelector('#explore-img');img.src=`assets/${c.image}`;img.alt=t(c.alt);
  for(const [id,key] of [['explore-image-label','label'],['explore-kicker','kicker'],['explore-description','description']])document.getElementById(id).textContent=t(c[key]);
  const title=document.querySelector('#explore-title');title.replaceChildren(document.createTextNode(t(c.title[0])),document.createElement('br'),document.createTextNode(t(c.title[1])));
  document.querySelector('#explore-symbol').dataset.icon=c.icon;renderIcons(document.querySelector('.explore-story'));
}
for(const id of ['explore-image-label','explore-kicker','explore-title','explore-description','explore-img']){const el=document.getElementById(id);if(el)el.dataset.dynamic=''}
tabs.forEach((button,index)=>{
  button.id=`tab-${button.dataset.category}`;button.setAttribute('aria-controls','explore-panel');button.tabIndex=index===0?0:-1;
  button.addEventListener('click',()=>{selectedCategory=button.dataset.category;tabs.forEach(tab=>{tab.setAttribute('aria-selected',String(tab===button));tab.tabIndex=tab===button?0:-1});document.querySelector('#explore-panel').setAttribute('aria-labelledby',button.id);updateCategory()});
  button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].click();tabs[next].focus()}});
});
if(tabs.length)document.querySelector('#explore-panel').setAttribute('aria-labelledby',tabs[0].id);
document.querySelectorAll('a[href^="mailto:"]').forEach(link=>link.href=`mailto:${siteConfig.supportEmail}`);
// Help remains readable without JavaScript; enhance search and direct answer links.
const supportSearch=document.querySelector('#support-search');
const supportAnswers=[...document.querySelectorAll('.faq-group details')];
let savedAnswerState=null;
function updateSupportSearch(){
  if(!supportSearch)return;
  const query=supportSearch.value.trim().toLocaleLowerCase();
  if(query&&!savedAnswerState)savedAnswerState=new Map(supportAnswers.map(answer=>[answer,answer.open]));
  let count=0;
  for(const answer of supportAnswers){
    const matches=!query||`${answer.parentElement.querySelector('h3').textContent} ${answer.textContent}`.toLocaleLowerCase().includes(query);
    answer.hidden=!matches;if(matches)count++;
    if(query)answer.open=matches;
    else if(savedAnswerState)answer.open=savedAnswerState.get(answer);
  }
  if(!query)savedAnswerState=null;
  document.querySelectorAll('.faq-group').forEach(group=>group.hidden=![...group.querySelectorAll('details')].some(answer=>!answer.hidden));
  document.querySelector('.clear-search').hidden=!query;
  document.querySelector('.no-results').hidden=count!==0;
  document.querySelector('.search-status').textContent=query?t('找到 {count} 个相关问题。').replace('{count}',String(count)):'';
}
function openSupportRoute(){
  if(!supportSearch)return;
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
  const target=document.getElementById(id);
  if(!target?.matches('.faq-group,.faq-group details'))return;
  supportSearch.value='';updateSupportSearch();
  if(target.matches('details')){target.open=true;target.querySelector('summary').focus({preventScroll:true})}
  else target.querySelectorAll('details').forEach(answer=>answer.open=true);
  target.scrollIntoView({block:'start'});
}
if(supportSearch){
  document.querySelector('.support-search').hidden=false;
  document.querySelector('.search-status').dataset.dynamic='';
  supportSearch.addEventListener('input',updateSupportSearch);
  document.querySelector('.clear-search').addEventListener('click',()=>{supportSearch.value='';updateSupportSearch();supportSearch.focus()});
  window.addEventListener('hashchange',openSupportRoute);
  document.querySelectorAll('.support-shortcuts a,.support-resources a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{if(link.hash===location.hash)openSupportRoute()}));
}
let toastTimer;
function showToast(message){const toast=document.querySelector('.toast');if(!toast)return;clearTimeout(toastTimer);toast.textContent=message;toast.classList.add('visible');toastTimer=setTimeout(()=>toast.classList.remove('visible'),3200)}
document.querySelector('.copy-email')?.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(siteConfig.supportEmail);showToast(t('邮箱已复制。'))}
  catch{showToast(t('请复制邮箱：')+' '+siteConfig.supportEmail)}
});
const motionToggle=document.querySelector('.motion-toggle');
let motionPaused=false;
function updateMotionLabel(){if(motionToggle)motionToggle.textContent=t(motionPaused?'继续漂浮':'暂停漂浮')}
if(motionToggle){
  motionToggle.hidden=false;motionToggle.dataset.dynamic='';
  motionToggle.addEventListener('click',()=>{motionPaused=!motionPaused;document.querySelector('.floating-scene').classList.toggle('is-paused',motionPaused);motionToggle.setAttribute('aria-pressed',String(motionPaused));updateMotionLabel()});
}

initializeLanguage(()=>{closeMenu();updateCategory();updateDialog();updateSupportSearch();updateMotionLabel()});
openSupportRoute();
document.querySelector('#year').textContent=new Date().getFullYear();
