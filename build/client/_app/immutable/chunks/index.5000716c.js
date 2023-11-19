import{s as K,f as c,a as H,g as f,h as T,B as j,c as L,d as A,j as l,i as W,u,L as z,E as U,V as X,y as G,C as Y,J as Z,o as ee}from"./scheduler.1f4a56be.js";import{S as te,i as se}from"./index.facf8a82.js";import{w as O}from"./index.1fb3217c.js";var $=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ae(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var I={exports:{}},Q;function ne(){return Q||(Q=1,function(i,e){var t=function(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof $<"u")return $;throw new Error("unable to locate global object")},s=t();i.exports=e=s.fetch,s.fetch&&(e.default=s.fetch.bind(s)),e.Headers=s.Headers,e.Request=s.Request,e.Response=s.Response}(I,I.exports)),I.exports}let B;typeof window<"u"?B=window.fetch:B=ne();class ie{constructor(e=void 0,t=void 0){this._redirect_in_unauthorized_internal=t,this._basic_authentication={},this._bearer_authentication,this._url=e,this._defaultHeaders=new Map}SetBasicAuthentication(e,t){return e&&t?this._basic_authentication="Basic "+Buffer.from(e+":"+t).toString("base64"):this._basic_authentication=void 0,this}setBasicAuthorization(e,t){return e&&t?this._basic_authentication="Basic "+Buffer.from(e+":"+t).toString("base64"):this._basic_authentication=void 0,this}setBearerAuthorization(e){return e?this._bearer_authentication="Bearer "+e:this._bearer_authentication=void 0,this}_addAuthorizationHeader(e){return this._basic_authentication&&(e.Authorization=this._basic_authentication),this._bearer_authentication&&(e.Authorization=this._bearer_authentication),e}addHeader(e,t){this._defaultHeaders.set(e,t)}async request(e,t,s,r){let a,n=t?t.toUpperCase():"GET",d=e&&e.length>0?e:this._url;if(!(n=="GET"||n=="POST"||n=="HEAD"||n=="PUT"||n=="DELETE"||n=="CONNECT"||n=="OPTIONS"||n=="TRACE"||n=="PATCH"))throw"Invalid method";r||(r={"Content-Type":"application/json"}),r=this._addAuthorizationHeader(r);for(const[h,w]of this._defaultHeaders)r[h]=w;try{switch(n){case"POST":a=await B(d,{method:n,body:JSON.stringify(s),headers:r});break;case"PUT":a=await B(d,{method:n,body:JSON.stringify(s),headers:r});break;default:let h=new URLSearchParams(s);d=d+"?"+h.toString(),a=await B(d,{method:n,headers:r});break}return this._redirect_in_unauthorized&&a.status==401&&(window.location.href=this._redirect_in_unauthorized),a}catch(h){if(console.log(h),a)return a;throw h}}async put(e=void 0,t=void 0,s=void 0){return this.request(e,"PUT",t,s)}async delete(e=void 0,t=void 0,s=void 0){return this.request(e,"DELETE",t,s)}async post(e=void 0,t=void 0,s=void 0){return this.request(e,"POST",t,s)}async get(e=void 0,t=void 0,s=void 0){return this.request(e,"GET",t,s)}async patch(e=void 0,t=void 0,s=void 0){return this.request(e,"PATCH",t,s)}}var re=ie;const N=ae(re),oe=O({}),le=O({}),ue=O({}),de=O({}),ye=O({}),me=i=>JSON.stringify(i,null,2).replace(/\n/g,"<br/>").replace(/ /g,"&nbsp;"),we=async(i,e)=>{let t=new N;t.setBearerAuthorization(i);try{let r=await(await t.get("/system/main/functions",{appName:e})).json();if(r&&Array.isArray(r)){let a=r.map(n=>({id:n,value:n}));de.set(a)}}catch(s){console.error(s)}},ce=async i=>{let e=new N;e.setBearerAuthorization(i);try{let s=await(await e.get("/system/main/handlers")).json();if(s&&Array.isArray(s)){let r=s.map(a=>({id:a.handler,value:a.label,enabled:a.enabled,description:a.description}));ue.set(r)}}catch(t){console.error(t)}},fe=async i=>{let e=new N;e.setBearerAuthorization(i);try{let s=await(await e.get("/system/main/methods")).json();if(s&&Array.isArray(s)){let r=s.map(a=>({id:a.method,value:a.label,enabled:a.enabled,description:""}));le.set(r)}}catch(t){console.error(t)}},ge={FETCH:{css:" is-primary is-outlined ",label:" Fetch ",icon:" fa-solid fa-server "},JS:{css:" is-link is-outlined ",label:" Javascript ",icon:" fa-brands fa-square-js "},SOAP:{css:" is-danger is-outlined ",label:" SOAP ",icon:" fa-solid fa-soap "},SQL:{css:" is-info is-outlined ",label:" SQL ",icon:"fa-solid fa-database "},FUNCTION:{css:" is-success is-outlined ",label:" Function ",icon:" fa-brands fa-node-js "}};function he(i){let e,t,s="Iniciar sesión",r,a,n,d,h="Nombre de usuario",w,y,o,_,m,g,M="Contraseña",D,E,p,F,C,V='<div class="control"><button class="button is-primary" type="submit">Iniciar sesión</button></div>',R,x;return{c(){e=c("div"),t=c("h1"),t.textContent=s,r=H(),a=c("form"),n=c("div"),d=c("label"),d.textContent=h,w=H(),y=c("div"),o=c("input"),_=H(),m=c("div"),g=c("label"),g.textContent=M,D=H(),E=c("div"),p=c("input"),F=H(),C=c("div"),C.innerHTML=V,this.h()},l(b){e=f(b,"DIV",{class:!0});var v=T(e);t=f(v,"H1",{class:!0,"data-svelte-h":!0}),j(t)!=="svelte-1yeihy2"&&(t.textContent=s),r=L(v),a=f(v,"FORM",{class:!0});var S=T(a);n=f(S,"DIV",{class:!0});var q=T(n);d=f(q,"LABEL",{class:!0,"data-svelte-h":!0}),j(d)!=="svelte-1tq2mwz"&&(d.textContent=h),w=L(q),y=f(q,"DIV",{class:!0});var J=T(y);o=f(J,"INPUT",{class:!0,type:!0,placeholder:!0}),J.forEach(A),q.forEach(A),_=L(S),m=f(S,"DIV",{class:!0});var P=T(m);g=f(P,"LABEL",{class:!0,"data-svelte-h":!0}),j(g)!=="svelte-66z98u"&&(g.textContent=M),D=L(P),E=f(P,"DIV",{class:!0});var k=T(E);p=f(k,"INPUT",{class:!0,type:!0,placeholder:!0}),k.forEach(A),P.forEach(A),F=L(S),C=f(S,"DIV",{class:!0,"data-svelte-h":!0}),j(C)!=="svelte-u84jsi"&&(C.innerHTML=V),S.forEach(A),v.forEach(A),this.h()},h(){l(t,"class","title is-4"),l(d,"class","label"),l(o,"class","input"),l(o,"type","text"),l(o,"placeholder","Nombre de usuario"),o.required=!0,l(y,"class","control"),l(n,"class","field"),l(g,"class","label"),l(p,"class","input"),l(p,"type","password"),l(p,"placeholder","Contraseña"),p.required=!0,l(E,"class","control"),l(m,"class","field"),l(C,"class","field"),l(a,"class","form svelte-osrx57"),l(e,"class","container svelte-osrx57")},m(b,v){W(b,e,v),u(e,t),u(e,r),u(e,a),u(a,n),u(n,d),u(n,w),u(n,y),u(y,o),z(o,i[0]),u(a,_),u(a,m),u(m,g),u(m,D),u(m,E),u(E,p),z(p,i[1]),u(a,F),u(a,C),R||(x=[U(o,"input",i[3]),U(p,"input",i[4]),U(a,"submit",X(i[2]))],R=!0)},p(b,[v]){v&1&&o.value!==b[0]&&z(o,b[0]),v&2&&p.value!==b[1]&&z(p,b[1])},i:G,o:G,d(b){b&&A(e),R=!1,Y(x)}}}function pe(i,e,t){const s=Z();let r="",a="",n=new N;function d(o){s("login",{login:o})}async function h(){try{let _=await(await n.post("/system/main/login",{username:r,password:a})).json();console.log(_),_.login?(oe.set(_),await fe(_.token),await ce(_.token)):alert("Credenciales inválidas"),d(_.login)}catch(o){console.trace(o),alert(o.message)}}ee(()=>{});function w(){r=this.value,t(0,r)}function y(){a=this.value,t(1,a)}return[r,a,h,w,y]}class Ce extends te{constructor(e){super(),se(this,e,pe,he,K,{})}}export{Ce as L,ue as a,ye as b,ge as c,de as d,oe as e,me as f,we as g,fe as h,le as l,N as u};
