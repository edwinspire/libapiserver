import{s as W,f as c,a as P,g as f,h as H,B as z,c as q,d as A,j as l,i as X,u,L as B,E as R,U as Y,y as Q,C as Z,J as ee,o as te}from"./scheduler.Z87YXQ2_.js";import{S as ae,i as se}from"./index.JJWP2jl5.js";import{w as E}from"./index.2NKUeI6F.js";var $=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function re(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var F={exports:{}},K;function ne(){return K||(K=1,function(i,e){var t=function(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof $<"u")return $;throw new Error("unable to locate global object")},a=t();i.exports=e=a.fetch,a.fetch&&(e.default=a.fetch.bind(a)),e.Headers=a.Headers,e.Request=a.Request,e.Response=a.Response}(F,F.exports)),F.exports}let L;typeof window<"u"?L=window.fetch:L=ne();class ie{constructor(e=void 0,t=void 0){this._redirect_in_unauthorized_internal=t,this._basic_authentication={},this._bearer_authentication,this._url=e,this._defaultHeaders=new Map}SetBasicAuthentication(e,t){return e&&t?this._basic_authentication="Basic "+Buffer.from(e+":"+t).toString("base64"):this._basic_authentication=void 0,this}setBearerAuthorization(e){return e?this._bearer_authentication="Bearer "+e:this._bearer_authentication=void 0,this}_addAuthorizationHeader(e){return this._basic_authentication&&(e.Authorization=this._basic_authentication),this._bearer_authentication&&(e.Authorization=this._bearer_authentication),e}addHeader(e,t){this._defaultHeaders.set(e,t)}async request(e,t,a,r){let s,n=t?t.toUpperCase():"GET",d=e??this._url;if(!(n=="GET"||n=="POST"||n=="HEAD"||n=="PUT"||n=="DELETE"||n=="CONNECT"||n=="OPTIONS"||n=="TRACE"||n=="PATCH"))throw"Invalid method";r||(r={"Content-Type":"application/json"}),r=this._addAuthorizationHeader(r);for(const[h,w]of this._defaultHeaders)r[h]=w;try{switch(n){case"POST":s=await L(d,{method:n,body:JSON.stringify(a),headers:r});break;case"PUT":s=await L(d,{method:n,body:JSON.stringify(a),headers:r});break;default:let h=new URLSearchParams(a);d=d+"?"+h.toString(),s=await L(d,{method:n,headers:r});break}return this._redirect_in_unauthorized&&s.status==401&&(window.location.href=this._redirect_in_unauthorized),s}catch(h){if(console.log(h),s)return s;throw h}}async put(e=void 0,t=void 0,a=void 0){return this.request(e,"PUT",t,a)}async PUT(e){return this.request(e.url,"PUT",e.data,e.headers)}async delete(e=void 0,t=void 0,a=void 0){return this.request(e,"DELETE",t,a)}async DELETE(e){return this.request(e.url,"DELETE",e.data,e.headers)}async post(e=void 0,t=void 0,a=void 0){return this.request(e,"POST",t,a)}async POST(e){return this.request(e.url,"POST",e.data,e.headers)}async get(e=void 0,t=void 0,a=void 0){return this.request(e,"GET",t,a)}async GET(e){return this.request(e.url,"GET",e.data,e.headers)}async patch(e=void 0,t=void 0,a=void 0){return this.request(e,"PATCH",t,a)}async PATCH(e){return this.request(e.url,"PATCH",e.data,e.headers)}}var oe=ie;const I=re(oe),O={getfunctions:"/api/system/prd/functions",getHandler:"/api/system/prd/system/handler/0.01",Methods:"/api/system/prd/system/method/0.01",listEnv:"/api/system/prd/system/environment/0.01",listApps:"/api/system/prd/api/apps/0.01",getApp:"/api/system/prd/api/app/0.01",saveApp:"/api/system/prd/api/app/0.01",saveMethod:"/api/system/prd/system/method/0.01"},le=E({}),ue=E({}),de=E({}),ce=E({}),fe=E({}),he=E({}),ge=E({}),Te=i=>JSON.stringify(i,null,2).replace(/\n/g,"<br/>").replace(/ /g,"&nbsp;"),Ae=async(i,e)=>{let t=new I;t.setBearerAuthorization(i);try{let r=await(await t.get(O.getfunctions,{appName:e,environment:"dev"})).json();if(r&&Array.isArray(r)){let s=r.map(n=>({id:n,value:n}));ce.set(s)}}catch(a){console.error(a)}try{let r=await(await t.get(O.getfunctions,{appName:e,environment:"qa"})).json();if(r&&Array.isArray(r)){let s=r.map(n=>({id:n,value:n}));fe.set(s)}}catch(a){console.error(a)}try{let r=await(await t.get(O.getfunctions,{appName:e,environment:"prd"})).json();if(r&&Array.isArray(r)){let s=r.map(n=>({id:n,value:n}));he.set(s)}}catch(a){console.error(a)}},pe=async i=>{let e=new I;e.setBearerAuthorization(i);try{let a=await(await e.get(O.getHandler)).json();if(a&&Array.isArray(a)){let r=a.map(s=>({id:s.handler,value:s.label,enabled:s.enabled,description:s.description}));de.set(r)}}catch(t){console.error(t)}},ye=async i=>{let e=new I;e.setBearerAuthorization(i);try{let a=await(await e.get(O.Methods)).json();if(a&&Array.isArray(a)){let r=a.map(s=>({id:s.method,value:s.label,enabled:s.enabled,description:""}));ue.set(r)}}catch(t){console.error(t)}},Ee={FETCH:{css:" is-primary is-outlined ",label:" Fetch ",icon:" fa-solid fa-server "},JS:{css:" is-link is-outlined ",label:" Javascript ",icon:" fa-brands fa-square-js "},SOAP:{css:" is-danger is-outlined ",label:" SOAP ",icon:" fa-solid fa-soap "},SQL:{css:" is-info is-outlined ",label:" SQL ",icon:"fa-solid fa-database "},FUNCTION:{css:" is-dark is-outlined ",label:" Function ",icon:" fa-brands fa-node-js "}};function ve(i){let e,t,a="Iniciar sesión",r,s,n,d,h="Nombre de usuario",w,b,o,y,m,g,k="Contraseña",N,C,p,U,T,G='<div class="control"><button class="button is-primary" type="submit">Iniciar sesión</button></div>',M,J;return{c(){e=c("div"),t=c("h1"),t.textContent=a,r=P(),s=c("form"),n=c("div"),d=c("label"),d.textContent=h,w=P(),b=c("div"),o=c("input"),y=P(),m=c("div"),g=c("label"),g.textContent=k,N=P(),C=c("div"),p=c("input"),U=P(),T=c("div"),T.innerHTML=G,this.h()},l(v){e=f(v,"DIV",{class:!0});var _=H(e);t=f(_,"H1",{class:!0,"data-svelte-h":!0}),z(t)!=="svelte-1yeihy2"&&(t.textContent=a),r=q(_),s=f(_,"FORM",{class:!0});var S=H(s);n=f(S,"DIV",{class:!0});var j=H(n);d=f(j,"LABEL",{class:!0,"data-svelte-h":!0}),z(d)!=="svelte-1tq2mwz"&&(d.textContent=h),w=q(j),b=f(j,"DIV",{class:!0});var V=H(b);o=f(V,"INPUT",{class:!0,type:!0,placeholder:!0}),V.forEach(A),j.forEach(A),y=q(S),m=f(S,"DIV",{class:!0});var D=H(m);g=f(D,"LABEL",{class:!0,"data-svelte-h":!0}),z(g)!=="svelte-66z98u"&&(g.textContent=k),N=q(D),C=f(D,"DIV",{class:!0});var x=H(C);p=f(x,"INPUT",{class:!0,type:!0,placeholder:!0}),x.forEach(A),D.forEach(A),U=q(S),T=f(S,"DIV",{class:!0,"data-svelte-h":!0}),z(T)!=="svelte-u84jsi"&&(T.innerHTML=G),S.forEach(A),_.forEach(A),this.h()},h(){l(t,"class","title is-4"),l(d,"class","label"),l(o,"class","input"),l(o,"type","text"),l(o,"placeholder","Nombre de usuario"),o.required=!0,l(b,"class","control"),l(n,"class","field"),l(g,"class","label"),l(p,"class","input"),l(p,"type","password"),l(p,"placeholder","Contraseña"),p.required=!0,l(C,"class","control"),l(m,"class","field"),l(T,"class","field"),l(s,"class","form svelte-osrx57"),l(e,"class","container svelte-osrx57")},m(v,_){X(v,e,_),u(e,t),u(e,r),u(e,s),u(s,n),u(n,d),u(n,w),u(n,b),u(b,o),B(o,i[0]),u(s,y),u(s,m),u(m,g),u(m,N),u(m,C),u(C,p),B(p,i[1]),u(s,U),u(s,T),M||(J=[R(o,"input",i[3]),R(p,"input",i[4]),R(s,"submit",Y(i[2]))],M=!0)},p(v,[_]){_&1&&o.value!==v[0]&&B(o,v[0]),_&2&&p.value!==v[1]&&B(p,v[1])},i:Q,o:Q,d(v){v&&A(e),M=!1,Z(J)}}}function _e(i,e,t){const a=ee();let r="",s="",n=new I;function d(o){a("login",{login:o})}async function h(){try{let y=await(await n.post("/api/system/prd/system/login/0.01",{username:r,password:s})).json();console.log(y),y.login?(le.set(y),await ye(y.token),await pe(y.token)):alert("Credenciales inválidas"),d(y.login)}catch(o){console.trace(o),alert(o.message)}}te(()=>{});function w(){r=this.value,t(0,r)}function b(){s=this.value,t(1,s)}return[r,s,h,w,b]}class Ce extends ae{constructor(e){super(),se(this,e,_e,ve,W,{})}}export{Ce as L,de as a,ge as b,Ee as c,ce as d,fe as e,Te as f,he as g,le as h,O as i,Ae as j,ye as k,ue as l,I as u};
