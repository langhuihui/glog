import{d,A as l,v as a,x as o,F as u,H as m,y as c,I as i,K as f}from"./runtime-dom.esm-bundler.f64d1b9e.js";const _=d({__name:"Popup",setup(v){const s=l({});p(n=>{var t=chrome.tabs.connect(n,{name:"popup"});t.onMessage.addListener(function(e){for(const r in e)s[r]=e[r]})});function p(n){chrome.tabs.query({active:!0,currentWindow:!0},function(t){var e;n&&((e=t[0])==null?void 0:e.id)&&n(t[0].id)})}return(n,t)=>(a(),o("dl",null,[(a(!0),o(u,null,m(s,(e,r)=>(a(),o(u,null,[c("dt",null,i(r),1),c("dd",null,i(e),1)],64))),256))]))}});f(_).mount("#app");
