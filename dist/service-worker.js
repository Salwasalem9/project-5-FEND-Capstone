if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return i[e]||(r=new Promise((async r=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},r=(r,i)=>{Promise.all(r.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(r)};self.define=(r,s,n)=>{i[r]||(i[r]=Promise.resolve().then((()=>{let i={};const o={uri:location.origin+r.slice(1)};return Promise.all(s.map((r=>{switch(r){case"exports":return i;case"module":return o;default:return e(r)}}))).then((e=>{const r=n(...e);return i.default||(i.default=r),i}))})))}}define("./service-worker.js",["./workbox-224ec2e5"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./index.html",revision:"2b754fbb8eb7658df2287e6177134a07"},{url:"main.css",revision:"cce3dfa27e9ac471add27e1839b92241"},{url:"main.js",revision:"5a9de2319d752fba0a7286bc39c589b4"},{url:"main.js.LICENSE.txt",revision:"7b3516806a7f4483ac17b2ada5b247ca"},{url:"media/im.ico",revision:"db71d59c068d55fa43f9fbf776cd0c27"},{url:"media/yu.jpg",revision:"31e46274fbbda4c2f9767e6eb1e40aa7"}],{})}));
