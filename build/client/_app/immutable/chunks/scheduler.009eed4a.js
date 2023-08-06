var C=Object.defineProperty;var P=(t,n,e)=>n in t?C(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var f=(t,n,e)=>(P(t,typeof n!="symbol"?n+"":n,e),e);function B(){}function q(t,n){for(const e in n)t[e]=n[e];return t}function O(t){return t()}function et(){return Object.create(null)}function G(t){t.forEach(O)}function it(t){return typeof t=="function"}function lt(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function ct(t){return Object.keys(t).length===0}function R(t,...n){if(t==null){for(const i of n)i(void 0);return B}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function st(t,n,e){t.$$.on_destroy.push(R(n,e))}function rt(t,n,e,i){if(t){const l=H(t,n,e,i);return t[0](l)}}function H(t,n,e,i){return t[1]&&i?q(e.ctx.slice(),t[1](i(n))):e.ctx}function ot(t,n,e,i){if(t[2]&&i){const l=t[2](i(e));if(n.dirty===void 0)return l;if(typeof l=="object"){const r=[],c=Math.max(n.dirty.length,l.length);for(let o=0;o<c;o+=1)r[o]=n.dirty[o]|l[o];return r}return n.dirty|l}return n.dirty}function ut(t,n,e,i,l,r){if(l){const c=H(n,e,i,r);t.p(c,l)}}function at(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let i=0;i<e;i++)n[i]=-1;return n}return-1}function ft(t){const n={};for(const e in t)n[e]=!0;return n}function _t(t){return t??""}let p=!1;function dt(){p=!0}function ht(){p=!1}function z(t,n,e,i){for(;t<n;){const l=t+(n-t>>1);e(l)<=i?t=l+1:n=l}return t}function F(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if(t.nodeName==="HEAD"){const s=[];for(let u=0;u<n.length;u++){const a=n[u];a.claim_order!==void 0&&s.push(a)}n=s}const e=new Int32Array(n.length+1),i=new Int32Array(n.length);e[0]=-1;let l=0;for(let s=0;s<n.length;s++){const u=n[s].claim_order,a=(l>0&&n[e[l]].claim_order<=u?l+1:z(1,l,j=>n[e[j]].claim_order,u))-1;i[s]=e[a]+1;const N=a+1;e[N]=s,l=Math.max(N,l)}const r=[],c=[];let o=n.length-1;for(let s=e[l]+1;s!=0;s=i[s-1]){for(r.push(n[s-1]);o>=s;o--)c.push(n[o]);o--}for(;o>=0;o--)c.push(n[o]);r.reverse(),c.sort((s,u)=>s.claim_order-u.claim_order);for(let s=0,u=0;s<c.length;s++){for(;u<r.length&&c[s].claim_order>=r[u].claim_order;)u++;const a=u<r.length?r[u]:null;t.insertBefore(c[s],a)}}function I(t,n){if(p){for(F(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?(n.claim_order!==void 0||n.parentNode!==t)&&t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else(n.parentNode!==t||n.nextSibling!==null)&&t.appendChild(n)}function W(t,n,e){t.insertBefore(n,e||null)}function J(t,n,e){p&&!e?I(t,n):(n.parentNode!==t||n.nextSibling!=e)&&t.insertBefore(n,e||null)}function x(t){t.parentNode&&t.parentNode.removeChild(t)}function mt(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function L(t){return document.createElement(t)}function K(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function v(t){return document.createTextNode(t)}function pt(){return v(" ")}function yt(){return v("")}function bt(t,n,e,i){return t.addEventListener(n,e,i),()=>t.removeEventListener(n,e,i)}function gt(t){return function(n){return n.preventDefault(),t.call(this,n)}}function xt(t,n,e){e==null?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function Et(t){return t.dataset.svelteH}function Tt(t){return t===""?null:+t}function vt(t){return Array.from(t.childNodes)}function M(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function S(t,n,e,i,l=!1){M(t);const r=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const o=t[c];if(n(o)){const s=e(o);return s===void 0?t.splice(c,1):t[c]=s,l||(t.claim_info.last_index=c),o}}for(let c=t.claim_info.last_index-1;c>=0;c--){const o=t[c];if(n(o)){const s=e(o);return s===void 0?t.splice(c,1):t[c]=s,l?s===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,o}}return i()})();return r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,r}function Q(t,n,e,i){return S(t,l=>l.nodeName===n,l=>{const r=[];for(let c=0;c<l.attributes.length;c++){const o=l.attributes[c];e[o.name]||r.push(o.name)}r.forEach(c=>l.removeAttribute(c))},()=>i(n))}function Nt(t,n,e){return Q(t,n,e,L)}function U(t,n){return S(t,e=>e.nodeType===3,e=>{const i=""+n;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>v(n),!0)}function wt(t){return U(t," ")}function w(t,n,e){for(let i=e;i<t.length;i+=1){const l=t[i];if(l.nodeType===8&&l.textContent.trim()===n)return i}return-1}function At(t,n){const e=w(t,"HTML_TAG_START",0),i=w(t,"HTML_TAG_END",e+1);if(e===-1||i===-1)return new A(n);M(t);const l=t.splice(e,i-e+1);x(l[0]),x(l[l.length-1]);const r=l.slice(1,l.length-1);for(const c of r)c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new A(n,r)}function kt(t,n){n=""+n,t.data!==n&&(t.data=n)}function Ht(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function Lt(t,n){t.value=n??""}function Mt(t,n,e,i){e==null?t.style.removeProperty(n):t.style.setProperty(n,e,i?"important":"")}function St(t,n,e){for(let i=0;i<t.options.length;i+=1){const l=t.options[i];if(l.__value===n){l.selected=!0;return}}(!e||n!==void 0)&&(t.selectedIndex=-1)}function Dt(t){const n=t.querySelector(":checked");return n&&n.__value}function jt(t,n,e){t.classList.toggle(n,!!e)}function V(t,n,{bubbles:e=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:n,bubbles:e,cancelable:i})}function Ct(t,n){const e=[];let i=0;for(const l of n.childNodes)if(l.nodeType===8){const r=l.textContent.trim();r===`HEAD_${t}_END`?(i-=1,e.push(l)):r===`HEAD_${t}_START`&&(i+=1,e.push(l))}else i>0&&e.push(l);return e}class X{constructor(n=!1){f(this,"is_svg",!1);f(this,"e");f(this,"n");f(this,"t");f(this,"a");this.is_svg=n,this.e=this.n=null}c(n){this.h(n)}m(n,e,i=null){this.e||(this.is_svg?this.e=K(e.nodeName):this.e=L(e.nodeType===11?"TEMPLATE":e.nodeName),this.t=e.tagName!=="TEMPLATE"?e:e.content,this.c(n)),this.i(i)}h(n){this.e.innerHTML=n,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(n){for(let e=0;e<this.n.length;e+=1)W(this.t,this.n[e],n)}p(n){this.d(),this.h(n),this.i(this.a)}d(){this.n.forEach(x)}}class A extends X{constructor(e=!1,i){super(e);f(this,"l");this.e=this.n=null,this.l=i}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let i=0;i<this.n.length;i+=1)J(this.t,this.n[i],e)}}function Pt(t,n){return new t(n)}let m;function b(t){m=t}function y(){if(!m)throw new Error("Function called outside component initialization");return m}function Bt(t){y().$$.on_mount.push(t)}function qt(t){y().$$.after_update.push(t)}function Ot(t){y().$$.on_destroy.push(t)}function Gt(){const t=y();return(n,e,{cancelable:i=!1}={})=>{const l=t.$$.callbacks[n];if(l){const r=V(n,e,{cancelable:i});return l.slice().forEach(c=>{c.call(t,r)}),!r.defaultPrevented}return!0}}function Rt(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach(i=>i.call(this,n))}const h=[],k=[];let d=[];const E=[],D=Promise.resolve();let T=!1;function Y(){T||(T=!0,D.then($))}function zt(){return Y(),D}function Z(t){d.push(t)}function Ft(t){E.push(t)}const g=new Set;let _=0;function $(){if(_!==0)return;const t=m;do{try{for(;_<h.length;){const n=h[_];_++,b(n),tt(n.$$)}}catch(n){throw h.length=0,_=0,n}for(b(null),h.length=0,_=0;k.length;)k.pop()();for(let n=0;n<d.length;n+=1){const e=d[n];g.has(e)||(g.add(e),e())}d.length=0}while(h.length);for(;E.length;)E.pop()();T=!1,g.clear(),b(t)}function tt(t){if(t.fragment!==null){t.update(),G(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(Z)}}function It(t){const n=[],e=[];d.forEach(i=>t.indexOf(i)===-1?n.push(i):e.push(i)),e.forEach(i=>i()),d=n}export{b as $,Ct as A,Et as B,G as C,jt as D,bt as E,Rt as F,mt as G,_t as H,ft as I,Gt as J,Ot as K,Lt as L,it as M,A as N,At as O,Ft as P,Z as Q,St as R,Dt as S,Ht as T,Tt as U,gt as V,et as W,$ as X,ct as Y,It as Z,m as _,pt as a,O as a0,h as a1,Y as a2,dt as a3,ht as a4,qt as b,wt as c,x as d,yt as e,L as f,Nt as g,vt as h,J as i,xt as j,Mt as k,v as l,U as m,kt as n,Bt as o,k as p,Pt as q,rt as r,lt as s,zt as t,I as u,ut as v,at as w,ot as x,B as y,st as z};