import{_ as l,d,v as _,x as o,D as a,F as u,E as m,G as c,B as p,I as f}from"./plugin-vue_export-helper.32525bab.js";const v=d({__name:"Popup",setup(x){const s=_({});i(t=>{var r=chrome.tabs.connect(t,{name:"popup"});r.onMessage.addListener(function(e){for(const n in e)s[n]=e[n]})});function i(t){chrome.tabs.query({active:!0,currentWindow:!0},function(r){var e;t&&((e=r[0])==null?void 0:e.id)&&t(r[0].id)})}return(t,r)=>(o(),a("dl",null,[(o(!0),a(u,null,m(s,(e,n)=>(o(),a(u,null,[c("dt",null,p(n),1),c("dd",null,p(e),1)],64))),256))]))}});var g=l(v,[["__file","/Users/dexter/project/glog/src/Popup.vue"]]);f(g).mount("#app");
