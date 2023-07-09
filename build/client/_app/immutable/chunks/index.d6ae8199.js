import{S as re,i as ie,s as ne,k as d,q as N,a as D,l as f,m as _,r as B,h,c as C,n as l,b as oe,D as i,V as R,M as z,a4 as le,H as te,R as ce,T as ue,o as de}from"./index.4457990f.js";import{w as F}from"./index.6850ff3f.js";var ae=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function fe(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var j={exports:{}},se;function he(){return se||(se=1,function(n,e){var t=function(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof ae<"u")return ae;throw new Error("unable to locate global object")},a=t();n.exports=e=a.fetch,a.fetch&&(e.default=a.fetch.bind(a)),e.Headers=a.Headers,e.Request=a.Request,e.Response=a.Response}(j,j.exports)),j.exports}let O;typeof window<"u"?O=window.fetch:O=he();class pe{constructor(e,t){this._redirect_in_unauthorized_internal=t,this._basic_authentication={},this._url=e,this._defaultHeaders=new Map}SetBasicAuthentication(e,t){return e&&t?this._basic_authentication="Basic "+Buffer.from(e+":"+t).toString("base64"):this._basic_authentication=void 0,this}_addBasicAuthentication(e){return this._basic_authentication&&(e.Authorization=this._basic_authentication),e}addHeader(e,t){this._defaultHeaders.set(e,t)}async request(e,t,a,o){let s,r=t?t.toUpperCase():"GET",u=e&&e.length>0?e:this._url;if(!(r=="GET"||r=="POST"||r=="HEAD"||r=="PUT"||r=="DELETE"||r=="CONNECT"||r=="OPTIONS"||r=="TRACE"||r=="PATCH"))throw"Invalid method";o||(o={"Content-Type":"application/json"}),o=this._addBasicAuthentication(o);for(const[p,E]of this._defaultHeaders)o[p]=E;try{switch(r){case"POST":s=await O(u,{method:r,body:JSON.stringify(a),headers:o});break;case"PUT":s=await O(u,{method:r,body:JSON.stringify(a),headers:o});break;default:let p=new URLSearchParams(a);u=u+"?"+p.toString(),s=await O(u,{method:r,headers:o});break}return this._redirect_in_unauthorized&&s.status==401&&(window.location.href=this._redirect_in_unauthorized),s}catch(p){if(console.log(p),s)return s;throw p}}async put(e,t,a){return this.request(e,"PUT",t,a)}async delete(e,t,a){return this.request(e,"DELETE",t,a)}async post(e,t,a){return this.request(e,"POST",t,a)}async get(e,t,a){return this.request(e,"GET",t,a)}async patch(e,t,a){return this.request(e,"PATCH",t,a)}}var _e=pe;const $=fe(_e),ve=F({}),be=F({}),ye=F({}),we=async n=>{let e=new $;e.addHeader("api-token",n);try{let a=await(await e.get("/api/system/handler")).json();if(a&&Array.isArray(a)){let o=a.map(s=>({id:s.handler,value:s.label,enabled:s.enabled,description:s.description}));ye.set(o)}}catch(t){console.error(t)}},me=async n=>{let e=new $;e.addHeader("api-token",n);try{let a=await(await e.get("/api/methods")).json();if(a&&Array.isArray(a)){let o=a.map(s=>({id:s.method,value:s.label,enabled:s.enabled,description:""}));be.set(o)}}catch(t){console.error(t)}};function ge(n){let e,t,a,o,s,r,u,p,E,m,c,b,g,S,k,U,H,v,V,I,q,T,M,G,J;return{c(){e=d("div"),t=d("h1"),a=N("Iniciar sesión"),o=D(),s=d("form"),r=d("div"),u=d("label"),p=N("Nombre de usuario"),E=D(),m=d("div"),c=d("input"),b=D(),g=d("div"),S=d("label"),k=N("Contraseña"),U=D(),H=d("div"),v=d("input"),V=D(),I=d("div"),q=d("div"),T=d("button"),M=N("Iniciar sesión"),this.h()},l(y){e=f(y,"DIV",{class:!0});var w=_(e);t=f(w,"H1",{class:!0});var K=_(t);a=B(K,"Iniciar sesión"),K.forEach(h),o=C(w),s=f(w,"FORM",{class:!0});var A=_(s);r=f(A,"DIV",{class:!0});var P=_(r);u=f(P,"LABEL",{class:!0});var Q=_(u);p=B(Q,"Nombre de usuario"),Q.forEach(h),E=C(P),m=f(P,"DIV",{class:!0});var W=_(m);c=f(W,"INPUT",{class:!0,type:!0,placeholder:!0}),W.forEach(h),P.forEach(h),b=C(A),g=f(A,"DIV",{class:!0});var L=_(g);S=f(L,"LABEL",{class:!0});var X=_(S);k=B(X,"Contraseña"),X.forEach(h),U=C(L),H=f(L,"DIV",{class:!0});var Y=_(H);v=f(Y,"INPUT",{class:!0,type:!0,placeholder:!0}),Y.forEach(h),L.forEach(h),V=C(A),I=f(A,"DIV",{class:!0});var Z=_(I);q=f(Z,"DIV",{class:!0});var x=_(q);T=f(x,"BUTTON",{class:!0,type:!0});var ee=_(T);M=B(ee,"Iniciar sesión"),ee.forEach(h),x.forEach(h),Z.forEach(h),A.forEach(h),w.forEach(h),this.h()},h(){l(t,"class","title is-4"),l(u,"class","label"),l(c,"class","input"),l(c,"type","text"),l(c,"placeholder","Nombre de usuario"),c.required=!0,l(m,"class","control"),l(r,"class","field"),l(S,"class","label"),l(v,"class","input"),l(v,"type","password"),l(v,"placeholder","Contraseña"),v.required=!0,l(H,"class","control"),l(g,"class","field"),l(T,"class","button is-primary"),l(T,"type","submit"),l(q,"class","control"),l(I,"class","field"),l(s,"class","form svelte-osrx57"),l(e,"class","container svelte-osrx57")},m(y,w){oe(y,e,w),i(e,t),i(t,a),i(e,o),i(e,s),i(s,r),i(r,u),i(u,p),i(r,E),i(r,m),i(m,c),R(c,n[0]),i(s,b),i(s,g),i(g,S),i(S,k),i(g,U),i(g,H),i(H,v),R(v,n[1]),i(s,V),i(s,I),i(I,q),i(q,T),i(T,M),G||(J=[z(c,"input",n[3]),z(v,"input",n[4]),z(s,"submit",le(n[2]))],G=!0)},p(y,[w]){w&1&&c.value!==y[0]&&R(c,y[0]),w&2&&v.value!==y[1]&&R(v,y[1])},i:te,o:te,d(y){y&&h(e),G=!1,ce(J)}}}function Ee(n,e,t){const a=ue();let o="",s="",r=new $;function u(c){a("login",{login:c})}async function p(){try{let b=await(await r.post("/api/login",{username:o,password:s})).json();console.log(b),b.login?(ve.set(b),await me(b.token),await we(b.token)):alert("Credenciales inválidas"),u(b.login)}catch(c){console.trace(c),alert(c.message)}}de(()=>{});function E(){o=this.value,t(0,o)}function m(){s=this.value,t(1,s)}return[o,s,p,E,m]}class He extends re{constructor(e){super(),ie(this,e,Ee,ge,ne,{})}}export{He as L,ye as a,ve as b,me as g,be as l,$ as u};
