import{s as W,f as c,a as L,g as f,h as H,B as P,c as j,d as S,j as l,i as X,u,L as z,E as U,V as Y,y as Q,C as Z,J as ee,o as te}from"./scheduler.1f4a56be.js";import{S as ae,i as se}from"./index.facf8a82.js";import{w as C}from"./index.1fb3217c.js";var $=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ne(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var D={exports:{}},K;function ie(){return K||(K=1,function(r,e){var t=function(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof $<"u")return $;throw new Error("unable to locate global object")},a=t();r.exports=e=a.fetch,a.fetch&&(e.default=a.fetch.bind(a)),e.Headers=a.Headers,e.Request=a.Request,e.Response=a.Response}(D,D.exports)),D.exports}let q;typeof window<"u"?q=window.fetch:q=ie();class re{constructor(e=void 0,t=void 0){this._redirect_in_unauthorized_internal=t,this._basic_authentication={},this._bearer_authentication,this._url=e,this._defaultHeaders=new Map}SetBasicAuthentication(e,t){return e&&t?this._basic_authentication="Basic "+Buffer.from(e+":"+t).toString("base64"):this._basic_authentication=void 0,this}setBasicAuthorization(e,t){return e&&t?this._basic_authentication="Basic "+Buffer.from(e+":"+t).toString("base64"):this._basic_authentication=void 0,this}setBearerAuthorization(e){return e?this._bearer_authentication="Bearer "+e:this._bearer_authentication=void 0,this}_addAuthorizationHeader(e){return this._basic_authentication&&(e.Authorization=this._basic_authentication),this._bearer_authentication&&(e.Authorization=this._bearer_authentication),e}addHeader(e,t){this._defaultHeaders.set(e,t)}async request(e,t,a,n){let s,i=t?t.toUpperCase():"GET",d=e&&e.length>0?e:this._url;if(!(i=="GET"||i=="POST"||i=="HEAD"||i=="PUT"||i=="DELETE"||i=="CONNECT"||i=="OPTIONS"||i=="TRACE"||i=="PATCH"))throw"Invalid method";n||(n={"Content-Type":"application/json"}),n=this._addAuthorizationHeader(n);for(const[h,w]of this._defaultHeaders)n[h]=w;try{switch(i){case"POST":s=await q(d,{method:i,body:JSON.stringify(a),headers:n});break;case"PUT":s=await q(d,{method:i,body:JSON.stringify(a),headers:n});break;default:let h=new URLSearchParams(a);d=d+"?"+h.toString(),s=await q(d,{method:i,headers:n});break}return this._redirect_in_unauthorized&&s.status==401&&(window.location.href=this._redirect_in_unauthorized),s}catch(h){if(console.log(h),s)return s;throw h}}async put(e=void 0,t=void 0,a=void 0){return this.request(e,"PUT",t,a)}async delete(e=void 0,t=void 0,a=void 0){return this.request(e,"DELETE",t,a)}async post(e=void 0,t=void 0,a=void 0){return this.request(e,"POST",t,a)}async get(e=void 0,t=void 0,a=void 0){return this.request(e,"GET",t,a)}async patch(e=void 0,t=void 0,a=void 0){return this.request(e,"PATCH",t,a)}}var oe=re;const F=ne(oe),M="/system/main/functions",le=C({}),ue=C({}),de=C({}),ce=C({}),fe=C({}),he=C({}),ge=C({}),Ae=r=>JSON.stringify(r,null,2).replace(/\n/g,"<br/>").replace(/ /g,"&nbsp;"),Se=async(r,e)=>{let t=new F;t.setBearerAuthorization(r);try{let n=await(await t.get(M,{appName:e,environment:"dev"})).json();if(n&&Array.isArray(n)){let s=n.map(i=>({id:i,value:i}));ce.set(s)}}catch(a){console.error(a)}try{let n=await(await t.get(M,{appName:e,environment:"qa"})).json();if(n&&Array.isArray(n)){let s=n.map(i=>({id:i,value:i}));fe.set(s)}}catch(a){console.error(a)}try{let n=await(await t.get(M,{appName:e,environment:"prd"})).json();if(n&&Array.isArray(n)){let s=n.map(i=>({id:i,value:i}));he.set(s)}}catch(a){console.error(a)}},pe=async r=>{let e=new F;e.setBearerAuthorization(r);try{let a=await(await e.get("/api/system/system/handler/0.01/prd")).json();if(a&&Array.isArray(a)){let n=a.map(s=>({id:s.handler,value:s.label,enabled:s.enabled,description:s.description}));de.set(n)}}catch(t){console.error(t)}},_e=async r=>{let e=new F;e.setBearerAuthorization(r);try{let a=await(await e.get("/api/system/system/method/0.01/prd")).json();if(a&&Array.isArray(a)){let n=a.map(s=>({id:s.method,value:s.label,enabled:s.enabled,description:""}));ue.set(n)}}catch(t){console.error(t)}},Ce={FETCH:{css:" is-primary is-outlined ",label:" Fetch ",icon:" fa-solid fa-server "},JS:{css:" is-link is-outlined ",label:" Javascript ",icon:" fa-brands fa-square-js "},SOAP:{css:" is-danger is-outlined ",label:" SOAP ",icon:" fa-solid fa-soap "},SQL:{css:" is-info is-outlined ",label:" SQL ",icon:"fa-solid fa-database "},FUNCTION:{css:" is-dark is-outlined ",label:" Function ",icon:" fa-brands fa-node-js "}};function ve(r){let e,t,a="Iniciar sesión",n,s,i,d,h="Nombre de usuario",w,y,o,_,m,g,V="Contraseña",I,E,p,N,A,k='<div class="control"><button class="button is-primary" type="submit">Iniciar sesión</button></div>',R,x;return{c(){e=c("div"),t=c("h1"),t.textContent=a,n=L(),s=c("form"),i=c("div"),d=c("label"),d.textContent=h,w=L(),y=c("div"),o=c("input"),_=L(),m=c("div"),g=c("label"),g.textContent=V,I=L(),E=c("div"),p=c("input"),N=L(),A=c("div"),A.innerHTML=k,this.h()},l(v){e=f(v,"DIV",{class:!0});var b=H(e);t=f(b,"H1",{class:!0,"data-svelte-h":!0}),P(t)!=="svelte-1yeihy2"&&(t.textContent=a),n=j(b),s=f(b,"FORM",{class:!0});var T=H(s);i=f(T,"DIV",{class:!0});var B=H(i);d=f(B,"LABEL",{class:!0,"data-svelte-h":!0}),P(d)!=="svelte-1tq2mwz"&&(d.textContent=h),w=j(B),y=f(B,"DIV",{class:!0});var J=H(y);o=f(J,"INPUT",{class:!0,type:!0,placeholder:!0}),J.forEach(S),B.forEach(S),_=j(T),m=f(T,"DIV",{class:!0});var O=H(m);g=f(O,"LABEL",{class:!0,"data-svelte-h":!0}),P(g)!=="svelte-66z98u"&&(g.textContent=V),I=j(O),E=f(O,"DIV",{class:!0});var G=H(E);p=f(G,"INPUT",{class:!0,type:!0,placeholder:!0}),G.forEach(S),O.forEach(S),N=j(T),A=f(T,"DIV",{class:!0,"data-svelte-h":!0}),P(A)!=="svelte-u84jsi"&&(A.innerHTML=k),T.forEach(S),b.forEach(S),this.h()},h(){l(t,"class","title is-4"),l(d,"class","label"),l(o,"class","input"),l(o,"type","text"),l(o,"placeholder","Nombre de usuario"),o.required=!0,l(y,"class","control"),l(i,"class","field"),l(g,"class","label"),l(p,"class","input"),l(p,"type","password"),l(p,"placeholder","Contraseña"),p.required=!0,l(E,"class","control"),l(m,"class","field"),l(A,"class","field"),l(s,"class","form svelte-osrx57"),l(e,"class","container svelte-osrx57")},m(v,b){X(v,e,b),u(e,t),u(e,n),u(e,s),u(s,i),u(i,d),u(i,w),u(i,y),u(y,o),z(o,r[0]),u(s,_),u(s,m),u(m,g),u(m,I),u(m,E),u(E,p),z(p,r[1]),u(s,N),u(s,A),R||(x=[U(o,"input",r[3]),U(p,"input",r[4]),U(s,"submit",Y(r[2]))],R=!0)},p(v,[b]){b&1&&o.value!==v[0]&&z(o,v[0]),b&2&&p.value!==v[1]&&z(p,v[1])},i:Q,o:Q,d(v){v&&S(e),R=!1,Z(x)}}}function be(r,e,t){const a=ee();let n="",s="",i=new F;function d(o){a("login",{login:o})}async function h(){try{let _=await(await i.post("/api/system/system/login/0.01/prd",{username:n,password:s})).json();console.log(_),_.login?(le.set(_),await _e(_.token),await pe(_.token)):alert("Credenciales inválidas"),d(_.login)}catch(o){console.trace(o),alert(o.message)}}te(()=>{});function w(){n=this.value,t(0,n)}function y(){s=this.value,t(1,s)}return[n,s,h,w,y]}class Ee extends ae{constructor(e){super(),se(this,e,be,ve,W,{})}}export{Ee as L,de as a,ge as b,Ce as c,ce as d,fe as e,Ae as f,he as g,le as h,Se as i,_e as j,ue as l,F as u};
