import {en} from './locales/en.js?v=e0e696b592bf';
let language='zh-CN';
const textSources=new Map(),attributeSources=[];
export const t = message => language==='en' ? (en[message]??message) : message;
function rememberText(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement?.closest('script,style,svg,select,[data-dynamic]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  while(walker.nextNode()){const node=walker.currentNode;if(node.nodeValue.trim())textSources.set(node,node.nodeValue);}
}
export function initializeLanguage(onChange){
  rememberText(document.body);
  document.querySelectorAll('[aria-label],[alt],[placeholder]').forEach(el=>{for(const attribute of ['aria-label','alt','placeholder'])if(el.hasAttribute(attribute))attributeSources.push([el,attribute,el.getAttribute(attribute)]);});
  const title=document.title,description=document.querySelector('meta[name=description]'),originalDescription=description?.content;
  const select=document.querySelector('#language-select');
  function apply(next){
    language=next==='en'?'en':'zh-CN';document.documentElement.lang=language;select.value=language;
    for(const [node,source] of textSources){if(!node.isConnected)continue;const trimmed=source.trim();node.nodeValue=source.replace(trimmed,t(trimmed));}
    for(const [el,attribute,value] of attributeSources)el.setAttribute(attribute,t(value));
    document.title=t(title);if(description)description.content=t(originalDescription);
    const url=new URL(location.href);if(language==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');history.replaceState(null,'',url);
    try{localStorage.setItem('sf-language',language)}catch{}
    document.querySelectorAll('a[href]').forEach(link=>{const value=link.getAttribute('href');if(!value||value.startsWith('#')||link.origin!==location.origin)return;const target=new URL(link.href);if(!target.pathname.endsWith('.html')&&!target.pathname.endsWith('/'))return;if(language==='en')target.searchParams.set('lang','en');else target.searchParams.delete('lang');link.href=target.href;});
    for(const [attribute,directory] of [['data-privacy','privacy'],['data-terms','terms']])document.querySelectorAll(`[${attribute}]`).forEach(link=>link.href=new URL(`${directory}/${language==='en'?'en.html':'zh-CN.html'}`,import.meta.url).href);
    onChange?.();
  }
  select?.addEventListener('change',()=>apply(select.value));
  let preference;try{preference=localStorage.getItem('sf-language')}catch{}
  apply(new URL(location.href).searchParams.get('lang')||preference||'zh-CN');
}
