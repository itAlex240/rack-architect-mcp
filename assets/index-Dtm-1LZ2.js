import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{a as t,n,r}from"./vendor-react-DS7EWbwX.js";import{a as i,i as a,n as o,o as s,r as c,s as l,t as u}from"./vendor-three-CAysbiSS.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var d=e(t(),1),f=e(r(),1),p=44.45,m=[6.35,22.225,38.1],h={"19inch":{standard:`19inch`,panel_width_mm:482.6,aperture_width_mm:450.85,hole_center_to_center_mm:465.1,left_aperture_offset_mm:15.875,left_hole_center_x_mm:8.75,W_panel:482.6,W_aperture:450.85,W_holes:465.1,X_aperture_min:15.875,X_hole_left:8.75},"10inch":{standard:`10inch`,panel_width_mm:254,aperture_width_mm:222.25,hole_center_to_center_mm:236.5,left_aperture_offset_mm:15.875,left_hole_center_x_mm:8.75,W_panel:254,W_aperture:222.25,W_holes:236.5,X_aperture_min:15.875,X_hole_left:8.75},"6inch":{standard:`6inch`,panel_width_mm:152.4,aperture_width_mm:120.65,hole_center_to_center_mm:134.9,left_aperture_offset_mm:15.875,left_hole_center_x_mm:8.75,W_panel:152.4,W_aperture:120.65,W_holes:134.9,X_aperture_min:15.875,X_hole_left:8.75}},g={rj45:{straight_mm:35,angled_mm:20},"rj45-serial-console":{straight_mm:35,angled_mm:20},"sfp-plus":{straight_mm:48,angled_mm:null},"iec-c13":{straight_mm:55,angled_mm:30},"iec-c14":{straight_mm:55,angled_mm:30},"schuko-cee7":{straight_mm:65,angled_mm:38},"dc-5525":{straight_mm:32,angled_mm:18},"usb-c":{straight_mm:32,angled_mm:18},"usb-a":{straight_mm:32,angled_mm:18},"audio-35mm":{straight_mm:28,angled_mm:15}};function _(e){return e.toLowerCase().includes(`angled`)}function v(e,t){let n=g[e];return t&&_(t)&&n.angled_mm!==null?n.angled_mm:n.straight_mm}var y={af:15.4,at:30,"bt-type3":60,"bt-type4":90},b=[150,250,300,500,750,1e3,1500,2e3,3e3],x=1.12,S=6.5;function C(e){let t=Object.values(e).filter(e=>typeof e==`number`);return Object.entries(e).filter(([e,n])=>t.indexOf(+e)===-1).map(([e,t])=>t)}function w(e,t=`|`){return e.map(e=>ce(e)).join(t)}function T(e,t){return typeof t==`bigint`?t.toString():t}var E=class{constructor(e){this._getter=e,this._value=void 0}get value(){let e=this._getter;return e!==void 0&&(this._value=e(),this._getter=void 0),this._value}};function D(e){return new E(e)}function O(e){return e==null}function k(e){let t=+!!e.startsWith(`^`),n=e.endsWith(`$`)?e.length-1:e.length;return e.slice(t,n)}function A(e,t){let n=e/t,r=Math.round(n),i=4*2**-52*Math.max(Math.abs(n),1);return Math.abs(n-r)<i?0:n-r}function j(e,t,n){Object.defineProperty(e,t,{value:n,writable:!0,enumerable:!0,configurable:!0})}function M(e){let t=Object.getOwnPropertyDescriptor(e,`shape`);return t?.get?t.get.raw:t?.value}function N(e){return M(e._zod.def)??e._zod.def.shape}function P(e,t,n){Object.defineProperty(e,t,{get(){let e=n();return j(this,t,e),e},enumerable:!0,configurable:!0})}function F(e,t,n){t in e?j(e,t,n):e[t]=n}function I(e,t,n,r){let i=N(t);for(let a of n){let n=Object.getOwnPropertyDescriptor(i,a);n.enumerable&&(n.get?P(e,a,()=>{let e=t._zod.def.shape[a];return r?r(e,a):e}):F(e,a,r?r(n.value,a):n.value))}}function L(e,t){for(let n of Reflect.ownKeys(t)){let r=Object.getOwnPropertyDescriptor(t,n);r.enumerable&&(r.get?P(e,n,()=>t[n]):F(e,n,r.value))}}function R(...e){let t={};for(let n of e){let e=Object.getOwnPropertyDescriptors(n);Object.assign(t,e)}return Object.defineProperties({},t)}function z(e){return JSON.stringify(e)}function ee(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,``).replace(/[\s_-]+/g,`-`).replace(/^-+|-+$/g,``)}var te=`captureStackTrace`in Error?Error.captureStackTrace:(...e)=>{};function ne(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}var re=D(()=>{if(Ze.jitless||typeof navigator<`u`&&navigator?.userAgent?.includes(`Cloudflare`))return!1;try{return Function(``),!0}catch{return!1}});function B(e){if(ne(e)===!1)return!1;let t=e.constructor;if(t===void 0||typeof t!=`function`)return!0;let n=t.prototype;return ne(n)!==!1&&Object.prototype.hasOwnProperty.call(n,`isPrototypeOf`)!==!1}function ie(e){return B(e)?{...e}:Array.isArray(e)?[...e]:e instanceof Map?new Map(e):e instanceof Set?new Set(e):e}var ae=new Set([`string`,`number`,`symbol`]);function oe(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function se(e,t,n){let r=new e._zod.constr(t??e._zod.def);return(!t||n?.parent)&&(r._zod.parent=e),r}function V(e){let t=e;if(!t)return{};if(typeof t==`string`)return{error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw Error("Cannot specify both `message` and `error` params");t.error=t.message}return delete t.message,typeof t.error==`string`?{...t,error:()=>t.error}:t}function ce(e){return typeof e==`bigint`?e.toString()+`n`:typeof e==`string`?`"${e}"`:`${e}`}function H(e){return Object.keys(e).filter(t=>e[t]._zod.optin!==void 0&&e[t]._zod.optout===`optional`)}var le={safeint:[-(2**53-1),2**53-1],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]},ue={int64:[BigInt(`-9223372036854775808`),BigInt(`9223372036854775807`)],uint64:[BigInt(0),BigInt(`18446744073709551615`)]};function de(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.pick() cannot be used on object schemas containing refinements`);let i={};return I(i,e,fe(e,t)),se(e,R(n,{shape:i,checks:[]}))}function fe(e,t){let n=N(e),r=[];for(let e of Reflect.ownKeys(t)){if(!Object.getOwnPropertyDescriptor(n,e)?.enumerable)throw Error(`Unrecognized key: "${String(e)}"`);t[e]&&r.push(e)}return r}function pe(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.omit() cannot be used on object schemas containing refinements`);let i=new Set(fe(e,t)),a={};return I(a,e,Reflect.ownKeys(N(e)).filter(e=>!i.has(e))),se(e,R(n,{shape:a,checks:[]}))}function me(e,t){if(!B(t))throw Error(`Invalid input to extend: expected a plain object`);let n=e._zod.def.checks;if(n&&n.length>0){let n=N(e);for(let e of Reflect.ownKeys(t))if(Object.getOwnPropertyDescriptor(n,e)!==void 0)throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}return se(e,R(e._zod.def,{shape:he(e,t)}))}function he(e,t){let n={};return I(n,e,Reflect.ownKeys(N(e))),L(n,t),n}function ge(e,t){if(!B(t))throw Error(`Invalid input to safeExtend: expected a plain object`);return se(e,R(e._zod.def,{shape:he(e,t)}))}function _e(e,t){if(!t?._zod?.def)throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");if(e._zod.def.checks?.length)throw Error(`.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.`);let n={};return I(n,e,Reflect.ownKeys(N(e))),I(n,t,Reflect.ownKeys(N(t))),se(e,R(e._zod.def,{shape:n,get catchall(){return t._zod.def.catchall},checks:t._zod.def.checks??[]}))}function ve(e,t,n,r=`partial`){let i=t._zod.def.checks;if(i&&i.length>0)throw Error(`.${r}() cannot be used on object schemas containing refinements`);let a=n?new Set(fe(t,n)):void 0,o={};return I(o,t,Reflect.ownKeys(N(t)),e&&((t,n)=>a&&!a.has(n)?t:new e({type:`optional`,innerType:t}))),se(t,R(t._zod.def,{shape:o,checks:[]}))}function ye(e,t,n){let r=n?new Set(fe(t,n)):void 0,i={};return I(i,t,Reflect.ownKeys(N(t)),(t,n)=>r&&!r.has(n)?t:new e({type:`nonoptional`,innerType:t})),se(t,R(t._zod.def,{shape:i}))}function be(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue!==!0)return!0;return!1}function xe(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue===!1)return!0;return!1}function Se(e,t){return t.map(t=>{var n;return(n=t).path??(n.path=[]),t.path.unshift(e),t})}function Ce(e){return typeof e==`string`?e:e?.message}function we(e){let t=[];for(let n of e??[]){let e=n._zod.def;if(!/_(length|size)$|_equals$/.test(e.check))break;let r=e.maximum??e.length??e.size;r>=0&&t.push([r,n])}return t}function Te(e,t,n){var r;for(let i=t;i<e.length;i++)(r=e[i]).schema??(r.schema=n)}function Ee(e,t,n){var r;let i=e.inst?._zod?.traits;i?.has(`$ZodType`)&&(i.has(`$ZodCheck`)?(r=e).schema??(r.schema=e.inst):e.schema=e.inst);let a=e.schema===e.inst?void 0:e.schema?._zod.def?.error,o=e.message?e.message:Ce(e.inst?._zod.def?.error?.(e))??Ce(a?.(e))??Ce(t?.error?.(e))??Ce(n.customError?.(e))??Ce(n.localeError?.(e))??`Invalid input`,s={};for(let t of Object.keys(e))t!==`inst`&&t!==`schema`&&t!==`continue`&&t!==`input`&&t!==`__proto__`&&(s[t]=e[t]);return s.path??=[],s.message=o,t?.reportInput&&(s.input=e.input),s}var De=/[\uD800-\uDBFF]/;function Oe(e){let t=e.length;if(!De.test(e))return t;let n=t;for(let r=0;r<t-1;r++)(e.charCodeAt(r)&64512)==55296&&(e.charCodeAt(r+1)&64512)==56320&&(n--,r++);return n}function ke(e){return Array.isArray(e)?`array`:typeof e==`string`?`string`:`unknown`}function Ae(e){let t=typeof e;switch(t){case`number`:return Number.isNaN(e)?`nan`:`number`;case`object`:{if(e===null)return`null`;if(Array.isArray(e))return`array`;let t=e;if(t&&Object.getPrototypeOf(t)!==Object.prototype&&`constructor`in t&&t.constructor)return t.constructor.name}}return t}function je(...e){let[t,n,r]=e;return typeof t==`string`?{message:t,code:`custom`,input:n,inst:r}:{...t}}function Me(e,t){for(let n in t){let r=Object.getOwnPropertyDescriptor(t,n);r.get?Object.defineProperty(e,n,{...r,enumerable:!1}):Ie(e,n,r.value)}}function Ne(e,t,n,r=!0){return Object.defineProperty(e,t,{configurable:!0,writable:!0,enumerable:r,value:n}),n}function Pe(e,t,n){return Ne(e,t,n,!1)}function Fe(e,t){for(let n in e){let r=e[n];Object.defineProperty(t,n,{configurable:!0,enumerable:!0,get(){return Ne(this,n,r(this))},set(e){Ne(this,n,e)}})}return t}function Ie(e,t,n){Object.defineProperty(e,t,{configurable:!0,get(){return this==null?n:Ne(this,t,n.bind(this))},set(e){Ne(this,t,e)}})}function Le(e,t){let n=Object.getPrototypeOf(e);return t in n?void 0:n}var Re,ze=!1,Be={configurable:!0,get(){ze=!0}};function Ve(e,t,n){let r=Object.getPrototypeOf(e._zod);t in r&&Re!==e._zod?Re=void 0:(Re=e._zod,Object.defineProperty(r,t,{configurable:!0,get(){Object.defineProperty(this,t,Be);let e=ze;ze=!1;try{let r=n(this);return ze?delete this[t]:Object.defineProperty(this,t,{configurable:!0,writable:!0,value:r}),ze||=e,r}catch(n){throw delete this[t],ze||=e,n}},set(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:e})}}))}function He(e,t,n,r){let i=Le(e,t);i&&Object.defineProperty(i,t,{configurable:!0,get(){let e={configurable:!0,writable:!0,enumerable:r,value:void 0};return Object.defineProperty(this,t,e),e.value=n(this),Object.defineProperty(this,t,e),e.value},set(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,enumerable:r,value:e})}})}var Ue=`~constantCatch`;function We(e){let t=()=>e;return t[Ue]=!0,t}var Ge,Ke={value:void 0,enumerable:!1},qe=`captureStackTrace`in Error?Error:null;function Je(e){let t=qe;if(t){let n=t.stackTraceLimit;if(typeof n==`number`){try{t.stackTraceLimit=0}catch{return qe=null,new e}try{return new e}finally{t.stackTraceLimit=n}}}return new e}function U(e,t,n,r){let i={};function a(e){this.def=e,this.constr=d,this.traits=new Set}a.prototype=i;let o=n,s=o&&new WeakSet;function c(n,r){if(!n._zod){Ke.value=new a(r);try{Object.defineProperty(n,"_zod",Ke)}finally{Ke.value=void 0}}else if(n._zod.traits.has(e))return;if(n._zod.traits.add(e),t(n,r),s){let e=Object.getPrototypeOf(n),t=n._zod.constr.prototype,r=e;for(;r&&r!==t;)r=Object.getPrototypeOf(r);let i=r??e;s.has(i)||(s.add(i),Me(i,o))}let i=d.prototype;for(let e in i)Object.prototype.hasOwnProperty.call(i,e)&&(e in n||(n[e]=i[e].bind(n)))}let l=r?.Parent??Object;class u extends l{}Object.defineProperty(u,"name",{value:e});function d(e){let t=r?.Parent?Je(u):this;c(t,e);let n=t._zod.deferred;if(n){for(let e of n)e();t._zod.deferred=void 0}let i=globalThis.__zod_globalConfig?.postProcessor;return i&&i(t),t}return Object.defineProperty(d,"init",{value:c}),Object.defineProperty(d,Symbol.hasInstance,{value:t=>r?.Parent&&t instanceof r.Parent?!0:t?._zod?.traits?.has(e)}),Object.defineProperty(d,"name",{value:e}),d}var Ye=class extends Error{constructor(){super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`)}},Xe=class extends Error{constructor(e){super(`Encountered unidirectional transform during encode: ${e}`),this.name=`ZodEncodeError`}};(Ge=globalThis).__zod_globalConfig??(Ge.__zod_globalConfig={});var Ze=globalThis.__zod_globalConfig;function Qe(e){return e&&Object.assign(Ze,e),Ze}function $e(){let e=this._zod;return e.message??=JSON.stringify(e.def,T,2),e.message}function et(e){this._zod.message=e}var tt={get:$e,set:et,enumerable:!0,configurable:!0},nt={value:void 0,enumerable:!1},rt=new WeakSet([Object.prototype,Error.prototype]),it=U(`$ZodError`,(e,t)=>{e.name=`$ZodError`,nt.value=t,Object.defineProperty(e,"issues",nt),nt.value=void 0,Object.defineProperty(e,"message",tt);let n=Object.getPrototypeOf(e);rt.has(n)||(rt.add(n),Object.defineProperty(n,"toString",{configurable:!0,enumerable:!1,get(){let e=()=>this.message;return Object.defineProperty(this,"toString",{value:e,configurable:!0,writable:!0}),e},set(e){Object.defineProperty(this,"toString",{value:e,configurable:!0,writable:!0})}}))});function at(e,t,n){return Object.prototype.hasOwnProperty.call(e,t)||(t===`__proto__`?Object.defineProperty(e,t,{value:n(),writable:!0,enumerable:!0,configurable:!0}):e[t]=n()),e[t]}function ot(e,t=e=>e.message){let n={},r=[];for(let i of e.issues)i.path.length>0?at(n,i.path[0],()=>[]).push(t(i)):r.push(t(i));return{formErrors:r,fieldErrors:n}}function st(e,t=e=>e.message){let n={_errors:[]},r=(e,i=[])=>{for(let a of e.issues)if(a.code===`invalid_union`&&a.errors.length)a.errors.map(e=>r({issues:e},[...i,...a.path]));else if(a.code===`invalid_key`)r({issues:a.issues},[...i,...a.path]);else if(a.code===`invalid_element`)r({issues:a.issues},[...i,...a.path]);else{let e=[...i,...a.path];if(e.length===0)n._errors.push(t(a));else{let r=n,i=0;for(;i<e.length;){let n=e[i],o=i===e.length-1;if(n===`_errors`){o&&r._errors.push(t(a)),i++;continue}Object.prototype.hasOwnProperty.call(r,n)||Object.defineProperty(r,n,{value:{_errors:[]},enumerable:!0,writable:!0,configurable:!0});let s=r[n];o&&s._errors.push(t(a)),r=s,i++}}}};return r(e),n}function ct(e,t){return{callee:t?.callee??e,Err:t?.Err}}var lt=e=>{let t=(n,r,i,a)=>{let o=i?{...i,async:!1}:{async:!1},s=n._zod.run({value:r,issues:[]},o);if(s instanceof Promise)throw new Ye;if(s.issues.length){let n=new((a?.Err)??e)(s.issues.map(e=>Ee(e,o,Qe())));throw te(n,a?.callee??t),n}return s.value};return t},ut=e=>{let t=async(n,r,i,a)=>{let o=i?{...i,async:!0}:{async:!0},s=n._zod.run({value:r,issues:[]},o);if(s instanceof Promise&&(s=await s),s.issues.length){let n=new((a?.Err)??e)(s.issues.map(e=>Ee(e,o,Qe())));throw te(n,a?.callee??t),n}return s.value};return t},dt=e=>(t,n,r)=>{let i=r?{...r,async:!1}:{async:!1},a=t._zod.run({value:n,issues:[]},i);if(a instanceof Promise)throw new Ye;return a.issues.length?ft(e,a.issues,i):{success:!0,data:a.value}};function ft(e,t,n){let r;return{success:!1,get error(){return r||(r=new e(t.map(e=>Ee(e,n,Qe()))),t=void 0,n=void 0),r},set error(e){r=e,t=void 0,n=void 0}}}var pt=e=>async(t,n,r)=>{let i=r?{...r,async:!0}:{async:!0},a=t._zod.run({value:n,issues:[]},i);return a instanceof Promise&&(a=await a),a.issues.length?ft(e,a.issues,i):{success:!0,data:a.value}},mt=Symbol.for(`zod.compile.invalid`),ht=Symbol.for(`zod.compile.fallback`),gt=((e,t,n)=>{let r=e._zod.bag.validator;if(r!==void 0){if(r(t)!==mt)return!0;if(r.definite===!0&&n===void 0)return!1}return _t(e,t,n)});function _t(e,t,n){let r=n?{...n,async:!1,abortEarly:!0}:{async:!1,abortEarly:!0},i=e._zod.bag.fallbackRun,a;if(i?(r[ht]=!0,a=i({value:t,issues:[]},r)):a=e._zod.run({value:t,issues:[]},r),a instanceof Promise)throw new Ye;return a.issues.length===0}var vt=async(e,t,n)=>{let r=n?{...n,async:!0,abortEarly:!0}:{async:!0,abortEarly:!0},i=e._zod.run({value:t,issues:[]},r);return i instanceof Promise&&(i=await i),i.issues.length===0},yt=e=>{let t=lt(e),n=(e,r,i,a)=>{let o=i?{...i,direction:`backward`}:{direction:`backward`};return t(e,r,o,ct(n,a))};return n},bt=e=>{let t=lt(e),n=(e,r,i,a)=>t(e,r,i,ct(n,a));return n},xt=e=>{let t=ut(e),n=async(e,r,i,a)=>{let o=i?{...i,direction:`backward`}:{direction:`backward`};return await t(e,r,o,ct(n,a))};return n},St=e=>{let t=ut(e),n=async(e,r,i,a)=>await t(e,r,i,ct(n,a));return n},Ct=e=>(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return dt(e)(t,n,i)},wt=e=>(t,n,r)=>dt(e)(t,n,r),Tt=e=>async(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return pt(e)(t,n,i)},Et=e=>async(t,n,r)=>pt(e)(t,n,r),Dt=/^[cC][0-9a-z]{6,}$/,Ot=/^[0-9a-z]+$/,kt=/^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/,At=/^[0-9a-vA-V]{20}$/,jt=/^[A-Za-z0-9]{27}$/,Mt=/^[a-zA-Z0-9_-]{21}$/;function Nt(e){return RegExp(`^[a-zA-Z0-9_-]{${e}}$`)}var Pt=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Ft=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,It=e=>e?RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Lt=/^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Rt=`^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;function zt(){return new RegExp(Rt,`u`)}var Bt=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Vt=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,Ht=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Ut=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Wt=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Gt=/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/,Kt=/^https?$/,qt=/^\+[1-9]\d{6,14}$/,Jt=`(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;function Yt(e){return RegExp(`^${e}$`)}var Xt=Yt(Jt);function Zt(e){let t=`(?:[01]\\d|2[0-3]):[0-5]\\d`;return typeof e.precision==`number`?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:e.seconds?`${t}:[0-5]\\d(?:\\.\\d+)?`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Qt(e){return RegExp(`^${Zt(e)}$`)}function $t(e){let t=[`Z`];e.offset&&t.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);let n=`${Zt({precision:e.precision,seconds:!0})}(?:${t.join(`|`)})`,r=e.local?`${n}|${Zt({precision:e.precision})}`:n;return RegExp(`^${Jt}T(?:${r})$`)}var en=/^[\s\S]{0,}$/,tn=/^-?\d+$/,nn=/^-?\d+(?:\.\d+)?$/,rn=/^(?:true|false)$/i,an=/^[^A-Z]*$/,on=/^[^a-z]*$/,sn=U(`$ZodCheck`,(e,t)=>{var n;e._zod??={},e._zod.def=t,(n=e._zod).onattach??(n.onattach=[])}),cn=e=>{let t=e.value;return!O(t)&&t.length!==void 0},ln={number:`number`,bigint:`bigint`,object:`date`},un=U(`$ZodCheckLessThan`,(e,t)=>{sn.init(e,t);let n=ln[typeof t.value];e._zod.check=r=>{(t.inclusive?r.value<=t.value:r.value<t.value)||r.issues.push({origin:ln[typeof r.value]??n,code:`too_big`,maximum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),dn=U(`$ZodCheckGreaterThan`,(e,t)=>{sn.init(e,t);let n=ln[typeof t.value];e._zod.check=r=>{(t.inclusive?r.value>=t.value:r.value>t.value)||r.issues.push({origin:ln[typeof r.value]??n,code:`too_small`,minimum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),fn=U(`$ZodCheckMultipleOf`,(e,t)=>{sn.init(e,t),e._zod.check=n=>{if(typeof n.value!=typeof t.value)throw Error(`Cannot mix number and bigint in multiple_of check.`);(typeof n.value==`bigint`?t.value!==BigInt(0)&&n.value%t.value===BigInt(0):A(n.value,t.value)===0)||n.issues.push({origin:typeof n.value,code:`not_multiple_of`,divisor:t.value,input:n.value,inst:e,continue:!t.abort})}}),pn=U(`$ZodCheckNumberFormat`,(e,t)=>{sn.init(e,t),t.format=t.format||`float64`;let n=t.format?.includes(`int`),r=n?`int`:`number`,[i,a]=le[t.format];e._zod.check=o=>{let s=o.value;if(n){if(!Number.isInteger(s)){o.issues.push({expected:r,format:t.format,code:`invalid_type`,continue:!1,input:s,inst:e});return}if(!Number.isSafeInteger(s)){s>0?o.issues.push({input:s,code:`too_big`,maximum:2**53-1,note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort}):o.issues.push({input:s,code:`too_small`,minimum:-(2**53-1),note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort});return}}s<i&&o.issues.push({origin:`number`,input:s,code:`too_small`,minimum:i,inclusive:!0,inst:e,continue:!t.abort}),s>a&&o.issues.push({origin:`number`,input:s,code:`too_big`,maximum:a,inclusive:!0,inst:e,continue:!t.abort})}}),mn=U(`$ZodCheckMaxLength`,(e,t)=>{var n;sn.init(e,t),(n=e._zod.def).when??(n.when=cn),e._zod.check=n=>{let r=n.value,i=r.length;if((typeof r==`string`&&i>t.maximum?Oe(r):i)<=t.maximum)return;let a=ke(r);n.issues.push({origin:a,code:`too_big`,maximum:t.maximum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),hn=U(`$ZodCheckMinLength`,(e,t)=>{var n;sn.init(e,t),(n=e._zod.def).when??(n.when=cn),e._zod.check=n=>{let r=n.value,i=r.length;if((typeof r==`string`&&i>=t.minimum&&i<t.minimum*2?Oe(r):i)>=t.minimum)return;let a=ke(r);n.issues.push({origin:a,code:`too_small`,minimum:t.minimum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),gn=U(`$ZodCheckLengthEquals`,(e,t)=>{var n;sn.init(e,t),(n=e._zod.def).when??(n.when=cn),e._zod.check=n=>{let r=n.value,i=r.length,a=typeof r==`string`&&i>=t.length&&i<=t.length*2?Oe(r):i;if(a===t.length)return;let o=ke(r),s=a>t.length;n.issues.push({origin:o,...s?{code:`too_big`,maximum:t.length}:{code:`too_small`,minimum:t.length},inclusive:!0,exact:!0,input:n.value,inst:e,continue:!t.abort})}}),_n=U(`$ZodCheckStringFormat`,(e,t)=>{var n,r;sn.init(e,t),t.pattern?(n=e._zod).check??(n.check=n=>{t.pattern.lastIndex=0,t.pattern.test(n.value)||n.issues.push({origin:`string`,code:`invalid_format`,format:t.format,input:n.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort})}):(r=e._zod).check??(r.check=()=>{})}),vn=U(`$ZodCheckRegex`,(e,t)=>{_n.init(e,t),e._zod.check=n=>{t.pattern.lastIndex=0,t.pattern.test(n.value)||n.issues.push({origin:`string`,code:`invalid_format`,format:`regex`,input:n.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort})}}),yn=U(`$ZodCheckLowerCase`,(e,t)=>{t.pattern??=an,_n.init(e,t)}),bn=U(`$ZodCheckUpperCase`,(e,t)=>{t.pattern??=on,_n.init(e,t)}),xn=U(`$ZodCheckIncludes`,(e,t)=>{sn.init(e,t);let n=oe(t.includes);t.pattern=new RegExp(typeof t.position==`number`?`^.{${t.position},}${n}`:n),e._zod.check=n=>{n.value.includes(t.includes,t.position)||n.issues.push({origin:`string`,code:`invalid_format`,format:`includes`,includes:t.includes,input:n.value,inst:e,continue:!t.abort})}}),Sn=U(`$ZodCheckStartsWith`,(e,t)=>{sn.init(e,t);let n=RegExp(`^${oe(t.prefix)}.*`);t.pattern??=n,e._zod.check=n=>{n.value.startsWith(t.prefix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`starts_with`,prefix:t.prefix,input:n.value,inst:e,continue:!t.abort})}}),Cn=U(`$ZodCheckEndsWith`,(e,t)=>{sn.init(e,t);let n=RegExp(`.*${oe(t.suffix)}$`);t.pattern??=n,e._zod.check=n=>{n.value.endsWith(t.suffix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`ends_with`,suffix:t.suffix,input:n.value,inst:e,continue:!t.abort})}}),wn=U(`$ZodCheckOverwrite`,(e,t)=>{sn.init(e,t),e._zod.check=e=>{e.value=t.tx(e.value)}}),Tn=class{constructor(e=[],t={}){this.content=[],this.indent=0,this.args=e,this.closed=t}indented(e){this.indent+=1;try{e(this)}finally{--this.indent}}write(e){if(typeof e==`function`){e(this,{execution:`sync`}),e(this,{execution:`async`});return}let t=e.split(`
`).filter(e=>e),n=Math.min(...t.map(e=>e.length-e.trimStart().length)),r=t.map(e=>e.slice(n)).map(e=>` `.repeat(this.indent*2)+e);for(let e of r)this.content.push(e)}compile(){let e=Function,t=this?.content??[``];return new e(...Object.keys(this.closed),`return function (${this.args.join(`, `)}) {\n${t.join(`
`)}\n};`)(...Object.values(this.closed))}},En={major:4,minor:6,patch:7},Dn=U(`$ZodType`,(e,t)=>{var n;e??={},e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=En;let r=e._zod.def.checks,i=e._zod.traits.has(`$ZodCheck`)?[e,...r??[]]:r?.length?[...r]:[];for(let t of i)for(let n of t._zod.onattach)n(e);if(i.length===0)(n=e._zod).deferred??(n.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{let t=(t,n,r)=>{if(t.memo)return t;let i=be(t),a;for(let o of n){if(o._zod.def.when){if(xe(t)||!o._zod.def.when(t))continue}else if(i)continue;let n=t.issues.length,s=o._zod.check(t);if(s instanceof Promise&&r?.async===!1)throw new Ye;if(a||s instanceof Promise)a=(a??Promise.resolve()).then(async()=>{await s,t.issues.length!==n&&(Te(t.issues,n,e),i||=be(t,n))});else{if(t.issues.length===n)continue;Te(t.issues,n,e),i||=be(t,n)}}return a?a.then(()=>t):t},n=(n,r,a)=>{if(be(n))return n.aborted=!0,n;let o=t(r,i,a);if(o instanceof Promise){if(a.async===!1)throw new Ye;return o.then(t=>e._zod.parse(t,a))}return e._zod.parse(o,a)};e._zod.run=(r,a)=>{if(a.skipChecks)return e._zod.parse(r,a);if(a.direction===`backward`){let t=e._zod.parse({value:r.value,issues:[]},{...a,skipChecks:!0});return t instanceof Promise?t.then(e=>n(e,r,a)):n(t,r,a)}let o=e._zod.parse(r,a);if(o instanceof Promise){if(a.async===!1)throw new Ye;return o.then(e=>t(e,i,a))}return t(o,i,a)}}},{get"~standard"(){return Pe(this,`~standard`,An(this))},set"~standard"(e){Ne(this,`~standard`,e)}}),On=(e,t)=>e.issues.length?{issues:e.issues.map(e=>Ee(e,t,Qe()))}:{value:e.value};async function kn(e,t){let n={async:!0};return On(await e._zod.run({value:t,issues:[]},n),n)}function An(e){return{validate:t=>{let n={async:!1};try{let r=e._zod.run({value:t,issues:[]},n);if(!(r instanceof Promise))return On(r,n)}catch{}return kn(e,t)},vendor:`zod`,version:1}}var jn=U(`$ZodString`,(e,t)=>{Dn.init(e,t),e._zod.pattern=t.pattern??en,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=String(n.value)}catch{}return typeof n.value==`string`||n.issues.push({expected:`string`,code:`invalid_type`,input:n.value,inst:e}),n}}),Mn=U(`$ZodStringFormat`,(e,t)=>{_n.init(e,t),jn.init(e,t)}),Nn=U(`$ZodGUID`,(e,t)=>{t.pattern??=Ft,Mn.init(e,t)}),Pn=U(`$ZodUUID`,(e,t)=>{if(t.version){let e={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(e===void 0)throw Error(`Invalid UUID version: "${t.version}"`);t.pattern??=It(e)}else t.pattern??=It();Mn.init(e,t)}),Fn=U(`$ZodEmail`,(e,t)=>{t.pattern??=Lt,Mn.init(e,t)});function In(e){try{return typeof URL<`u`&&typeof URL.canParse==`function`?URL.canParse(e):(new URL(e),!0)}catch{return!1}}function Ln(e,t){return!(`normalize`in t)&&!(`hostname`in t)&&!(`protocol`in t)?In(e)||2:Rn(e,t)}function Rn(e,t){if(!t.normalize&&t.protocol?.source===Kt.source&&!/^https?:\/\//i.test(e))return 1;try{if(typeof URL<`u`){let t=URL;if(typeof t.parse==`function`)return t.parse(e)??2}return new URL(e)}catch{return 2}}var zn=/[\t\n\r]/g;function Bn(e){return e.replace(zn,``)}function Vn(e,t){return t.lastIndex=0,t.test(e.hostname)}function Hn(e,t){return t.lastIndex=0,t.test(e.protocol.endsWith(`:`)?e.protocol.slice(0,-1):e.protocol)}var Un=U(`$ZodURL`,(e,t)=>{Mn.init(e,t),e._zod.check=n=>{try{let r=n.value.trim(),i=Ln(r,t);if(i===1){n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid URL format`,input:n.value,inst:e,continue:!t.abort});return}if(i===2){n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort});return}if(i===!0){n.value=Bn(r);return}t.hostname&&!Vn(i,t.hostname)&&n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid hostname`,pattern:t.hostname.source,input:n.value,inst:e,continue:!t.abort}),t.protocol&&!Hn(i,t.protocol)&&n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid protocol`,pattern:t.protocol.source,input:n.value,inst:e,continue:!t.abort}),n.value=t.normalize?i.href:Bn(r);return}catch{n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort})}}}),Wn=U(`$ZodEmoji`,(e,t)=>{t.pattern??=zt(),Mn.init(e,t)}),Gn=U(`$ZodNanoID`,(e,t)=>{if(t.length!==void 0&&(!Number.isInteger(t.length)||t.length<1))throw Error(`Invalid nanoid length: ${t.length}`);t.pattern??=t.length===void 0?Mt:Nt(t.length),Mn.init(e,t)}),Kn=U(`$ZodCUID`,(e,t)=>{t.pattern??=Dt,Mn.init(e,t)}),qn=U(`$ZodCUID2`,(e,t)=>{t.pattern??=Ot,Mn.init(e,t)}),Jn=U(`$ZodULID`,(e,t)=>{t.pattern??=kt,Mn.init(e,t)}),Yn=U(`$ZodXID`,(e,t)=>{t.pattern??=At,Mn.init(e,t)}),Xn=U(`$ZodKSUID`,(e,t)=>{t.pattern??=jt,Mn.init(e,t)}),Zn=U(`$ZodISODateTime`,(e,t)=>{t.pattern??=$t(t),Mn.init(e,t)}),Qn=U(`$ZodISODate`,(e,t)=>{t.pattern??=Xt,Mn.init(e,t)}),$n=U(`$ZodISOTime`,(e,t)=>{t.pattern??=Qt(t),Mn.init(e,t)}),er=U(`$ZodISODuration`,(e,t)=>{t.pattern??=Pt,Mn.init(e,t)}),tr=U(`$ZodIPv4`,(e,t)=>{t.pattern??=Bt,Mn.init(e,t)}),nr=/^[0-9a-fA-F:.]+$/;function rr(e){return nr.test(e)?In(`http://[${e}]`):!1}var ir=U(`$ZodIPv6`,(e,t)=>{t.pattern??=Vt,Mn.init(e,t),e._zod.check=n=>{rr(n.value)||n.issues.push({code:`invalid_format`,format:`ipv6`,input:n.value,inst:e,continue:!t.abort})}}),ar=U(`$ZodCIDRv4`,(e,t)=>{t.pattern??=Ht,Mn.init(e,t)});function or(e){let t=e.split(`/`);if(t.length!==2)return!1;let[n,r]=t;if(!r)return!1;let i=Number(r);return`${i}`!==r||i<0||i>128?!1:rr(n)}var sr=U(`$ZodCIDRv6`,(e,t)=>{t.pattern??=Ut,Mn.init(e,t),e._zod.check=n=>{or(n.value)||n.issues.push({code:`invalid_format`,format:`cidrv6`,input:n.value,inst:e,continue:!t.abort})}});function cr(e){if(e===``)return!0;if(/\s/.test(e)||e.length%4!=0)return!1;try{return atob(e),!0}catch{return!1}}var lr=/^[0-9a-zA-Z+/]*={0,2}$/,ur=U(`$ZodBase64`,(e,t)=>{t.pattern??=lr,Mn.init(e,t),e._zod.check=n=>{cr(n.value)||n.issues.push({code:`invalid_format`,format:`base64`,input:n.value,inst:e,continue:!t.abort})}}),dr=/^[A-Za-z0-9_-]*$/;function fr(e){if(!dr.test(e))return!1;let t=e.replace(/[-_]/g,e=>e===`-`?`+`:`/`);return cr(t.padEnd(Math.ceil(t.length/4)*4,`=`))}var pr=U(`$ZodBase64URL`,(e,t)=>{t.pattern??=dr,Mn.init(e,t),e._zod.check=n=>{fr(n.value)||n.issues.push({code:`invalid_format`,format:`base64url`,input:n.value,inst:e,continue:!t.abort})}}),mr=U(`$ZodE164`,(e,t)=>{t.pattern??=qt,Mn.init(e,t)});function hr(e,t=null){try{let n=e.split(`.`);if(n.length!==3)return!1;let[r]=n;if(!r)return!1;let i=JSON.parse(atob(r));return!(`typ`in i&&i?.typ!==`JWT`||!i.alg||t&&(!(`alg`in i)||i.alg!==t))}catch{return!1}}var gr=U(`$ZodJWT`,(e,t)=>{Mn.init(e,t),e._zod.check=n=>{hr(n.value,t.alg)||n.issues.push({code:`invalid_format`,format:`jwt`,input:n.value,inst:e,continue:!t.abort})}}),_r=U(`$ZodNumber`,(e,t)=>{Dn.init(e,t),e._zod.pattern=nn,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=Number(n.value)}catch{}let i=n.value;if(typeof i==`number`&&!Number.isNaN(i)&&Number.isFinite(i))return n;let a=typeof i==`number`?Number.isNaN(i)?`NaN`:Number.isFinite(i)?void 0:String(i):void 0;return n.issues.push({expected:`number`,code:`invalid_type`,input:i,inst:e,...a?{received:a}:{}}),n}}),vr=U(`$ZodNumberFormat`,(e,t)=>{pn.init(e,t),_r.init(e,t)}),yr=U(`$ZodBoolean`,(e,t)=>{Dn.init(e,t),e._zod.pattern=rn,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=!!n.value}catch{}let i=n.value;return typeof i==`boolean`||n.issues.push({expected:`boolean`,code:`invalid_type`,input:i,inst:e}),n}}),br=U(`$ZodUnknown`,(e,t)=>{Dn.init(e,t),e._zod.parse=e=>e}),xr=U(`$ZodNever`,(e,t)=>{Dn.init(e,t),e._zod.parse=(t,n)=>(t.issues.push({expected:`never`,code:`invalid_type`,input:t.value,inst:e}),t)});function Sr(e,t){let n=we(e._zod.def.checks);if(!n.length)return;let r=Math.min(...n.map(e=>e[0])),i=e._zod.parse;e._zod.parse=(n,a)=>{let o=t(n.value);if(o>r&&!a?.skipChecks&&a?.direction!==`backward`){for(let[t,r]of we(e._zod.def.checks))if(o>t&&r._zod.def.when(n)){let t=n.issues.length;return r._zod.check(n),n.issues[t].continue=!1,Te(n.issues,t,e),n}}return i(n,a)}}var Cr=e=>Array.isArray(e)?e.length:-1;function wr(e,t,n){e.issues.length&&t.issues.push(...Se(n,e.issues)),t.value[n]=e.value}var Tr=U(`$ZodArray`,(e,t)=>{Dn.init(e,t);let n=Ze.memoizer;n?.attach(e),e._zod.parse=(r,i)=>{let a=r.value;if(!Array.isArray(a))return r.issues.push({expected:`array`,code:`invalid_type`,input:a,inst:e}),r;r.value=n?n.alloc(e,r,Array(a.length),i):Array(a.length);let o=[],s=i?.abortEarly;for(let e=0;e<a.length;e++){let n=a[e],c=t.element._zod.run({value:n,issues:[]},i);if(c instanceof Promise)o.push(c.then(t=>wr(t,r,e)));else if(wr(c,r,e),s&&c.issues.length!==0&&be(c))break}return o.length?Promise.all(o).then(()=>r):r},Sr(e,Cr)});function Er(e,t,n,r,i,a){let o=n in r,s=a===`optional`;if(o||!s||i!==`optional`){if(e.issues.length){if(i!==void 0&&s&&!o)return;t.issues.push(...Se(n,e.issues))}!o&&i===void 0?e.issues.length||t.issues.push({code:`invalid_type`,expected:`nonoptional`,input:void 0,path:[n]}):e.value===void 0?(o||i===`defaulted`&&!s)&&(t.value[n]=void 0):t.value[n]=e.value}}var Dr=[];function Or(e){let t=Object.keys(e.shape),n=Object.getOwnPropertySymbols(e.shape),r=n.length?n:Dr,i=r.length?[...t,...r]:t;for(let t of i)if(!e.shape?.[t]?._zod?.traits?.has(`$ZodType`))throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);let a=H(e.shape);return{...e,allKeys:i,symbolKeys:r,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(a)}}function kr(e,t,n,r,i,a,o){let s=[],c=i.keySet,l=i.catchall._zod,u=l.def.type,d=l.optin,f=l.optout,p=0;for(let i in t){if(o&&n.issues.length!==p){if(be(n,p))break;p=n.issues.length}if(c.has(i))continue;if(i===`__proto__`){u===`never`&&s.push(i);continue}if(u===`never`){s.push(i);continue}let a=l.run({value:t[i],issues:[]},r);a instanceof Promise?e.push(a.then(e=>Er(e,n,i,t,d,f))):Er(a,n,i,t,d,f)}return s.length&&n.issues.push({code:`unrecognized_keys`,keys:s,input:t,inst:a,continue:!0}),e.length?Promise.all(e).then(()=>n):n}var Ar=U(`$ZodObject`,(e,t)=>{Dn.init(e,t);let n=Object.getOwnPropertyDescriptor(t,`shape`),r=n?.get?n.get.raw:t.shape??{};if(r){let e=()=>{let n={...r};return Object.defineProperty(t,"shape",{value:n}),e.raw=n,n};e.raw=r,Object.defineProperty(t,"shape",{get:e})}let i=D(()=>Or(t));Ve(e,`propValues`,e=>{let t=e.def.shape,n={};for(let e in t){let r=t[e]._zod;if(r.values){Object.prototype.hasOwnProperty.call(n,e)||j(n,e,new Set);for(let t of r.values)n[e].add(t);r.optin!==void 0&&n[e].add(void 0)}}return n});let a=ne,o=t.catchall,s,c=Ze.memoizer;c?.attach(e),e._zod.parse=(t,n)=>{s??=i.value;let r=t.value;if(!a(r))return t.issues.push({expected:`object`,code:`invalid_type`,input:r,inst:e}),t;t.value=c?c.alloc(e,t,{},n):{};let l=[],u=s.shape,d=n?.abortEarly,f=t.issues.length;for(let e of s.allKeys){if(d&&t.issues.length!==f){if(be(t,f))break;f=t.issues.length}if(e===`__proto__`)continue;let i=u[e],a=i._zod.optin,o=i._zod.optout,s=i._zod.run({value:r[e],issues:[]},n);s instanceof Promise?l.push(s.then(n=>Er(n,t,e,r,a,o))):Er(s,t,e,r,a,o)}return o?kr(l,r,t,n,i.value,e,d===!0):l.length?Promise.all(l).then(()=>t):t}}),jr=U(`$ZodObjectJIT`,(e,t)=>{Ar.init(e,t);let n=e._zod.parse,r=D(()=>Or(t)),i=Ze.memoizer,a=t=>{let n=r.value,a=n.symbolKeys,o=new Tn([`payload`,`ctx`],{shape:t,inst:e,memo:i,syms:a}),s=e=>`shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`,c=(e,t)=>`
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;o.write(`const input = payload.value;`);let l=Object.create(null),u=0;for(let e of n.allKeys)l[e]=`key_${u++}`;o.write(i?`const newResult = memo.alloc(inst, payload, {}, ctx);`:`const newResult = {};`);for(let e of n.allKeys){if(e===`__proto__`)continue;let n=l[e],r=typeof e==`symbol`?`syms[${a.indexOf(e)}]`:z(e),i=`${r} in input`,u=t[e],d=u?._zod?.optin,f=d!==void 0,p=u?._zod?.optout===`optional`;if(o.write(`const ${n} = ${s(r)};`),f&&p){let e=d===`optional`?`${n}_present`:`${n}.value !== undefined || ${n}_present`;o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n,r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `)}else f?(o.write(`
        if (${n}.issues.length) {${c(n,r)}
        }
      `),d===`defaulted`?o.write(`newResult[${r}] = ${n}.value;`):o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)):o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n,r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `)}return o.write(`payload.value = newResult;`),o.write(`return payload;`),o.compile()},o,s=ne,c=!Ze.jitless,l=c&&re.value,u=t.catchall,d;e._zod.parse=(i,f)=>{d??=r.value;let p=i.value;return s(p)?c&&l&&f?.async===!1&&f.jitless!==!0?(o||=a(t.shape),i=o(i,f),u?kr([],p,i,f,d,e,f?.abortEarly===!0):i):n(i,f):(i.issues.push({expected:`object`,code:`invalid_type`,input:p,inst:e}),i)}});function Mr(e,t,n,r){for(let n of e)if(n.issues.length===0)return t.value=n.value,t;let i=e.filter(e=>!be(e));return i.length===1?(t.value=i[0].value,i[0]):(t.issues.push({code:`invalid_union`,input:t.value,inst:n,errors:e.map(e=>e.issues.map(e=>Ee(e,r,Qe())))}),t)}var Nr=U(`$ZodUnion`,(e,t)=>{Dn.init(e,t),Ve(e,`optin`,e=>e.def.options.some(e=>e._zod.optin===`defaulted`)?`defaulted`:e.def.options.some(e=>e._zod.optin!==void 0)?`optional`:void 0),Ve(e,`optout`,e=>e.def.options.some(e=>e._zod.optout===`optional`)?`optional`:void 0),Ve(e,`values`,e=>{if(e.def.options.every(e=>e._zod.values))return new Set(e.def.options.flatMap(e=>Array.from(e._zod.values)))}),Ve(e,`pattern`,e=>{if(e.def.options.every(e=>e._zod.pattern)){let t=e.def.options.map(e=>e._zod.pattern);return RegExp(`^(${t.map(e=>k(e.source)).join(`|`)})$`)}});let n=t.options.length===1?t.options[0]._zod.run:null;e._zod.parse=(r,i)=>{if(n)return n(r,i);let a=!1,o=[];for(let e of t.options){let t=e._zod.run({value:r.value,issues:[]},i);if(t instanceof Promise)o.push(t),a=!0;else{if(t.issues.length===0)return t;o.push(t)}}return a?Promise.all(o).then(t=>Mr(t,r,e,i)):Mr(o,r,e,i)}}),Pr=U(`$ZodIntersection`,(e,t)=>{Dn.init(e,t),e._zod.parse=(e,n)=>{let r=e.value,i=t.left._zod.run({value:r,issues:[]},n),a=t.right._zod.run({value:r,issues:[]},n);return i instanceof Promise||a instanceof Promise?Promise.all([i,a]).then(([t,n])=>Ir(e,t,n)):Ir(e,i,a)}});function Fr(e,t){if(e===t||e instanceof Date&&t instanceof Date&&+e==+t)return{valid:!0,data:e};if(B(e)&&B(t)){let n=Object.keys(t),r=Object.keys(e).filter(e=>n.indexOf(e)!==-1),i={...e,...t};Object.prototype.hasOwnProperty.call(i,`__proto__`)&&delete i.__proto__;for(let n of r){if(n===`__proto__`)continue;let r=Fr(e[n],t[n]);if(!r.valid)return{valid:!1,mergeErrorPath:[n,...r.mergeErrorPath]};i[n]=r.data}return{valid:!0,data:i}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return{valid:!1,mergeErrorPath:[]};let n=[];for(let r=0;r<e.length;r++){let i=e[r],a=t[r],o=Fr(i,a);if(!o.valid)return{valid:!1,mergeErrorPath:[r,...o.mergeErrorPath]};n.push(o.data)}return{valid:!0,data:n}}return{valid:!1,mergeErrorPath:[]}}function Ir(e,t,n){let r=new Map,i,a=new Map,o=(e,t)=>{let n;if(e.code===`unrecognized_keys`&&!e.path?.length)i??=e,n=e.keys;else if(e.code===`invalid_key`&&e.origin===`record`&&e.path?.length===1){let t=String(e.path[0]);a.has(t)||a.set(t,e),n=[t]}else return!1;for(let e of n)r.has(e)||r.set(e,{}),r.get(e)[t]=!0;return!0};for(let n of t.issues)o(n,`l`)||e.issues.push(n);for(let t of n.issues)o(t,`r`)||e.issues.push(t);let s=[...r].filter(([,e])=>e.l&&e.r).map(([e])=>e);if(s.length){let t=i?s.filter(e=>i.keys.includes(e)):[];t.length&&e.issues.push({...i,keys:t});for(let n of s)!t.includes(n)&&a.has(n)&&e.issues.push(a.get(n))}let c=Fr(t.value,n.value);if(!c.valid){if(be(e))return e;throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`)}return e.value=c.data,e}var Lr=U(`$ZodTuple`,(e,t)=>{Dn.init(e,t);let n=t.items,r=Ze.memoizer;r?.attach(e),e._zod.parse=(i,a)=>{let o=i.value;if(!Array.isArray(o))return i.issues.push({input:o,inst:e,expected:`tuple`,code:`invalid_type`}),i;i.value=r?r.alloc(e,i,[],a):[];let s=[],c=Rr(n,`optin`),l=Rr(n,`optout`);if(!t.rest){if(o.length<c)return i.issues.push({code:`too_small`,minimum:c,inclusive:!0,input:o,inst:e,origin:`array`}),i;o.length>n.length&&i.issues.push({code:`too_big`,maximum:n.length,inclusive:!0,input:o,inst:e,origin:`array`})}let u=Array(n.length),d=t.rest?a?.abortEarly:void 0,f=!1;for(let e=0;e<n.length;e++){let t=n[e]._zod.run({value:o[e],issues:[]},a);t instanceof Promise?s.push(t.then(t=>{u[e]=t})):(u[e]=t,d&&!f&&t.issues.length&&(f=be(t)))}if(t.rest&&!f){let e=n.length-1,r=o.slice(n.length),c=i.issues.length;for(let n of r){if(d&&i.issues.length!==c){if(be(i,c))break;c=i.issues.length}e++;let r=t.rest._zod.run({value:n,issues:[]},a);r instanceof Promise?s.push(r.then(t=>zr(t,i,e))):zr(r,i,e)}}return s.length?Promise.all(s).then(()=>Br(u,i,n,o,l)):Br(u,i,n,o,l)}});function Rr(e,t){for(let n=e.length-1;n>=0;n--)if(!(t===`optin`?e[n]._zod.optin!==void 0:e[n]._zod.optout===`optional`))return n+1;return 0}function zr(e,t,n){e.issues.length&&t.issues.push(...Se(n,e.issues)),t.value[n]=e.value}function Br(e,t,n,r,i){for(let a=0;a<n.length;a++){let o=e[a],s=a<r.length;if(!s&&a>=i&&n[a]._zod.optin===`optional`){t.value.length=a;break}if(o.issues.length){if(!s&&a>=i){t.value.length=a;break}t.issues.push(...Se(a,o.issues))}t.value[a]=o.value}for(let e=t.value.length-1;e>=r.length&&n[e]._zod.optout===`optional`&&t.value[e]===void 0;e--)t.value.length=e;return t}var Vr=U(`$ZodRecord`,(e,t)=>{Dn.init(e,t);let n=Ze.memoizer;n?.attach(e),e._zod.parse=(r,i)=>{let a=r.value;if(!B(a))return r.issues.push({expected:`record`,code:`invalid_type`,input:a,inst:e}),r;let o=[],s=t.keyType._zod.values;if(s&&!t.partial){r.value=n?n.alloc(e,r,{},i):{};let c=new Set;for(let n of s)if(typeof n==`string`||typeof n==`number`||typeof n==`symbol`){if(c.add(typeof n==`number`?n.toString():n),n===`__proto__`)continue;let s=t.keyType._zod.run({value:n,issues:[]},i);if(s instanceof Promise)throw Error(`Async schemas not supported in object keys currently`);if(s.issues.length){r.issues.push({code:`invalid_key`,origin:`record`,issues:s.issues.map(e=>Ee(e,i,Qe())),input:n,path:[n],inst:e});continue}let l=s.value;if(l===`__proto__`)continue;let u=t.valueType._zod.run({value:a[n],issues:[]},i);u instanceof Promise?o.push(u.then(e=>{e.issues.length&&r.issues.push(...Se(n,e.issues)),r.value[l]=e.value})):(u.issues.length&&r.issues.push(...Se(n,u.issues)),r.value[l]=u.value)}let l;for(let e in a)if(!c.has(e)){if(t.mode===`loose`){if(e===`__proto__`)continue;r.value[e]=a[e]}else l??=[],l.push(e)}l&&l.length>0&&r.issues.push({code:`unrecognized_keys`,input:a,inst:e,keys:l,continue:!0})}else{r.value=n?n.alloc(e,r,{},i):{};let c;for(let n of Reflect.ownKeys(a)){if(n===`__proto__`||!Object.prototype.propertyIsEnumerable.call(a,n))continue;let l=t.keyType._zod.run({value:n,issues:[]},i);if(l instanceof Promise)throw Error(`Async schemas not supported in object keys currently`);if(typeof n==`string`&&nn.test(n)&&l.issues.length){let e=t.keyType._zod.run({value:Number(n),issues:[]},i);if(e instanceof Promise)throw Error(`Async schemas not supported in object keys currently`);e.issues.length===0&&(l=e)}if(l.issues.length){t.mode===`loose`?r.value[n]=a[n]:s?(c??=[],c.push(n)):r.issues.push({code:`invalid_key`,origin:`record`,issues:l.issues.map(e=>Ee(e,i,Qe())),input:n,path:[n],inst:e});continue}let u=l.value;if(u===`__proto__`)continue;let d=t.valueType._zod.run({value:a[n],issues:[]},i);d instanceof Promise?o.push(d.then(e=>{e.issues.length&&r.issues.push(...Se(n,e.issues)),r.value[u]=e.value})):(d.issues.length&&r.issues.push(...Se(n,d.issues)),r.value[u]=d.value)}c&&c.length>0&&r.issues.push({code:`unrecognized_keys`,input:a,inst:e,keys:c,continue:!0})}return o.length?Promise.all(o).then(()=>r):r}}),Hr=U(`$ZodEnum`,(e,t)=>{Dn.init(e,t);let n=C(t.entries),r=new Set(n);e._zod.values=r,Ve(e,`pattern`,e=>{let t=C(e.def.entries).filter(e=>ae.has(typeof e));return RegExp(t.length?`^(${t.map(e=>oe(e.toString())).join(`|`)})$`:`^[^\\s\\S]$`)}),e._zod.parse=(t,i)=>{let a=t.value;return r.has(a)||t.issues.push({code:`invalid_value`,values:n,input:a,inst:e}),t}}),Ur=U(`$ZodLiteral`,(e,t)=>{Dn.init(e,t);let n=new Set(t.values);e._zod.values=n,Ve(e,`pattern`,e=>{let t=e.def.values;return RegExp(t.length?`^(${t.map(e=>typeof e==`string`?oe(e):e?oe(e.toString()):String(e)).join(`|`)})$`:`^[^\\s\\S]$`)}),e._zod.parse=(r,i)=>{let a=r.value;return n.has(a)||r.issues.push({code:`invalid_value`,values:t.values,input:a,inst:e}),r}}),Wr=U(`$ZodTransform`,(e,t)=>{Dn.init(e,t),e._zod.optin=`optional`,Ze.memoizer?.guard(e),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new Xe(e.constructor.name);let i=t.transform(n.value,n);if(r.async)return(i instanceof Promise?i:Promise.resolve(i)).then(e=>(n.value=e,n));if(i instanceof Promise)throw new Ye;return n.value=i,n}});function Gr(e,t){return e.value=t.issues.length?void 0:t.value,e}var Kr=U(`$ZodOptional`,(e,t)=>{Dn.init(e,t),Ve(e,`optin`,e=>e.def.innerType._zod.optin===`defaulted`?`defaulted`:`optional`),e._zod.optout=`optional`,Ve(e,`values`,e=>{let t=e.def.innerType._zod.values;return t?new Set([...t,void 0]):void 0}),Ve(e,`pattern`,e=>{let t=e.def.innerType._zod.pattern;return t?RegExp(`^(${k(t.source)})?$`):void 0}),e._zod.parse=(e,n)=>{if(e.value===void 0){if(t.innerType._zod.optin!==`defaulted`)return e;let r=t.innerType._zod.run({value:e.value,issues:[]},n);return r instanceof Promise?r.then(t=>Gr(e,t)):Gr(e,r)}return t.innerType._zod.run(e,n)}}),qr=U(`$ZodExactOptional`,(e,t)=>{Kr.init(e,t),Ve(e,`values`,e=>e.def.innerType._zod.values),Ve(e,`pattern`,e=>e.def.innerType._zod.pattern),e._zod.parse=(e,n)=>t.innerType._zod.run(e,n)}),Jr=U(`$ZodNullable`,(e,t)=>{Dn.init(e,t),Ve(e,`optin`,e=>e.def.innerType._zod.optin),Ve(e,`optout`,e=>e.def.innerType._zod.optout),Ve(e,`pattern`,e=>{let t=e.def.innerType._zod.pattern;return t?RegExp(`^(${k(t.source)}|null)$`):void 0}),Ve(e,`values`,e=>e.def.innerType._zod.values?new Set([...e.def.innerType._zod.values,null]):void 0),e._zod.parse=(e,n)=>e.value===null?e:t.innerType._zod.run(e,n)}),Yr=U(`$ZodDefault`,(e,t)=>{Dn.init(e,t),e._zod.optin=`defaulted`,Ve(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);if(e.value===void 0)return e.value=t.defaultValue,e;let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(e=>Xr(e,t)):Xr(r,t)}});function Xr(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}var Zr=U(`$ZodPrefault`,(e,t)=>{Dn.init(e,t),e._zod.optin=`defaulted`,Ve(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>(n.direction===`backward`||e.value===void 0&&(e.value=t.defaultValue),t.innerType._zod.run(e,n))}),Qr=U(`$ZodNonOptional`,(e,t)=>{Dn.init(e,t),Ve(e,`values`,e=>{let t=e.def.innerType._zod.values;return t?new Set([...t].filter(e=>e!==void 0)):void 0}),e._zod.parse=(n,r)=>{let i=t.innerType._zod.run(n,r);return i instanceof Promise?i.then(t=>$r(t,e)):$r(i,e)}});function $r(e,t){return!e.issues.length&&e.value===void 0&&e.issues.push({code:`invalid_type`,expected:`nonoptional`,input:e.value,inst:t}),e}function ei(e,t,n,r){return t.issues.length?(e.value=n.catchValue({...t,value:e.value,error:{issues:t.issues.map(e=>Ee(e,r,Qe()))},input:e.value}),e):(e.value=t.value,t.memo&&(e.memo=!0),e)}var ti=U(`$ZodCatch`,(e,t)=>{Dn.init(e,t),Ve(e,`optin`,e=>e.def.innerType._zod.optin===`defaulted`?`defaulted`:`optional`),Ve(e,`optout`,e=>e.def.innerType._zod.optout),Ve(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run({value:e.value,issues:[]},n);return r instanceof Promise?r.then(r=>ei(e,r,t,n)):ei(e,r,t,n)}}),ni=U(`$ZodPipe`,(e,t)=>{Dn.init(e,t),Ve(e,`values`,e=>e.def.in._zod.values),Ve(e,`optin`,e=>e.def.in._zod.optin),Ve(e,`optout`,e=>e.def.out._zod.optout),Ve(e,`propValues`,e=>e.def.in._zod.propValues),e._zod.parse=(e,n)=>{if(n.direction===`backward`){let r=t.out._zod.run(e,n);return r instanceof Promise?r.then(e=>ri(e,t.in,n)):ri(r,t.in,n)}let r=t.in._zod.run(e,n);return r instanceof Promise?r.then(e=>ri(e,t.out,n)):ri(r,t.out,n)}});function ri(e,t,n){return e.issues.some(e=>e.code!==`unrecognized_keys`)?(e.aborted=!0,e):t._zod.run({value:e.value,issues:e.issues},n)}var ii=U(`$ZodReadonly`,(e,t)=>{Dn.init(e,t),Ve(e,`propValues`,e=>e.def.innerType._zod.propValues),Ve(e,`values`,e=>e.def.innerType._zod.values),Ve(e,`optin`,e=>e.def.innerType?._zod?.optin),Ve(e,`optout`,e=>e.def.innerType?._zod?.optout),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(ai):ai(r)}});function ai(e){return e.memo||(e.value=Object.freeze(e.value)),e}var oi=U(`$ZodCustom`,(e,t)=>{sn.init(e,t),Dn.init(e,t),e._zod.parse=(e,t)=>e,e._zod.check=n=>{let r=n.value,i=t.fn(r);if(i instanceof Promise)return i.then(t=>si(t,n,r,e));si(i,n,r,e)}});function si(e,t,n,r){if(!e){let e={code:`custom`,input:n,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(e.params=r._zod.def.params),t.issues.push(je(e))}}var ci=class extends Error{constructor(){super(`Cannot parse a reference cycle that closes through a transform`),this.name=`ZodCyclicError`}},li=`~memo`,ui=[];function di(e){return typeof e==`object`&&!!e}function fi(e){return e.map(e=>e.path?{...e,path:e.path.slice()}:{...e})}var pi=new WeakMap,mi=0,hi=1,gi=2;function _i(e,t,n){let r=pi.get(e);if(r!==void 0)return r?gi:mi;if(t.has(e))return gi;t.add(e);let i=mi,a=e=>{if(i!==gi&&e?._zod){let r=_i(e,t,n);r>i&&(i=r)}},o=(e,r)=>{let i=mi;for(let a of Reflect.ownKeys(e)){let o=Object.getOwnPropertyDescriptor(e,a);if(r&&!o.enumerable)continue;let s=o.get?hi:o.value?._zod?_i(o.value,t,n):mi;s>i&&(i=s)}return i},s=e=>{e>i&&(i=e)},c=e._zod.def;switch(c.type){case`object`:{let e=M(c);s(e?o(e,!0):hi),a(c.catchall);break}case`array`:a(c.element);break;case`tuple`:for(let e of c.items)a(e);a(c.rest);break;case`record`:case`map`:a(c.keyType),a(c.valueType);break;case`set`:a(c.valueType);break;case`union`:for(let e of c.options)a(e);break;case`intersection`:a(c.left),a(c.right);break;case`optional`:case`nullable`:case`default`:case`prefault`:case`catch`:case`readonly`:case`nonoptional`:case`promise`:case`success`:a(c.innerType);break;case`pipe`:a(c.in),a(c.out);break;case`function`:a(c.input),a(c.output);break;case`lazy`:{let r=c._cachedInner??(n?e._zod.innerType:void 0);s(r?_i(r,t,!1):hi);break}case`template_literal`:case`string`:case`number`:case`int`:case`boolean`:case`bigint`:case`symbol`:case`undefined`:case`null`:case`void`:case`never`:case`any`:case`unknown`:case`date`:case`nan`:case`enum`:case`literal`:case`file`:case`transform`:case`custom`:break;default:for(let e in c){let t=Object.getOwnPropertyDescriptor(c,e);if(!t||t.get)continue;let n=t.value;if(n&&typeof n==`object`){if(n._zod)a(n);else if(Array.isArray(n))for(let e of n)a(e)}}}return t.delete(e),vi(e,i)}function vi(e,t){return t!==hi&&pi.set(e,t===gi),t}function yi(e,t){let n=e.buckets.get(t);return n||(n=new WeakMap,e.buckets.set(t,n)),n}var bi,xi=[],Si={alloc(e,t,n){let r=bi;if(!r)return n;bi=void 0;let i={value:n,issues:null};return r.set(t.value,i),xi.push(i),n},guard(e){var t;(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred.push(()=>{let t=e._zod.parse,n=(e,n)=>{if(n.direction!==`backward`&&wi(n,e.value))throw new ci;return t(e,n)};e._zod.parse=n,e._zod.run===t&&(e._zod.run=n)})},attach(e){var t;let n,r=!1,i,a;(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred.push(()=>{let t=e._zod.parse,o=(s,c)=>{if(n===void 0){let i=_i(e,new Set,!1);if(i===mi)return e._zod.parse=t,e._zod.run===o&&(e._zod.run=t),t(s,c);i===gi||r?n=!0:r=!0}let l=s.value;if(!di(l))return t(s,c);let u=c[li];u||(u={buckets:new WeakMap,backEdges:void 0},c[li]=u);let d;i===c?d=a:(d=yi(u,e),i=c,a=d);let f=d.get(l);if(f)return s.value=f.value,f.issues?f.issues.length&&s.issues.push(...fi(f.issues)):(s.memo=!0,u.backEdges??(u.backEdges=new WeakSet),u.backEdges.add(f.value)),s;bi=d;let p=xi.length,m=t(s,c);bi=void 0;let h=xi.length>p?xi.pop():void 0;return m instanceof Promise?m.then(e=>(h&&(h.issues=e.issues.length?fi(e.issues):ui),e)):(h&&(h.issues=m.issues.length?fi(m.issues):ui),m)};e._zod.parse=o,e._zod.run===t&&(e._zod.run=o)})}};function Ci(){return Si}function wi(e,t){let n=e[li]?.backEdges;return n!==void 0&&di(t)&&n.has(t)}var Ti=()=>{let e={string:{unit:`characters`,verb:`to have`},file:{unit:`bytes`,verb:`to have`},array:{unit:`items`,verb:`to have`},set:{unit:`items`,verb:`to have`},map:{unit:`entries`,verb:`to have`}};function t(t){return e[t]??null}let n={regex:`input`,email:`email address`,url:`URL`,emoji:`emoji`,uuid:`UUID`,uuidv4:`UUIDv4`,uuidv6:`UUIDv6`,nanoid:`nanoid`,guid:`GUID`,cuid:`cuid`,cuid2:`cuid2`,ulid:`ULID`,xid:`XID`,ksuid:`KSUID`,datetime:`ISO datetime`,date:`ISO date`,time:`ISO time`,duration:`ISO duration`,ipv4:`IPv4 address`,ipv6:`IPv6 address`,mac:`MAC address`,cidrv4:`IPv4 range`,cidrv6:`IPv6 range`,base64:`base64-encoded string`,base64url:`base64url-encoded string`,json_string:`JSON string`,e164:`E.164 number`,currency_code:`currency code`,credit_card:`credit card number`,iban:`IBAN`,jwt:`JWT`,template_literal:`input`},r={nan:`NaN`};function i(e,t){return e===`number`&&typeof t==`number`&&!Number.isFinite(t)?String(t):r[e]??e}return e=>{switch(e.code){case`invalid_type`:return`Invalid input: expected ${i(e.expected)}, received ${i(Ae(e.input),e.input)}`;case`invalid_value`:return e.values.length===1?`Invalid input: expected ${ce(e.values[0])}`:`Invalid option: expected one of ${w(e.values,`|`)}`;case`too_big`:{let n=e.exact?`exactly `:e.inclusive?`<=`:`<`,r=t(e.origin);return r?`Too big: expected ${e.origin??`value`} to have ${n}${e.maximum.toString()} ${r.unit??`elements`}`:`Too big: expected ${e.origin??`value`} to be ${n}${e.maximum.toString()}`}case`too_small`:{let n=e.exact?`exactly `:e.inclusive?`>=`:`>`,r=t(e.origin);return r?`Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}`:`Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`}case`invalid_format`:{let t=e;return t.format===`starts_with`?`Invalid string: must start with "${t.prefix}"`:t.format===`ends_with`?`Invalid string: must end with "${t.suffix}"`:t.format===`includes`?`Invalid string: must include "${t.includes}"`:t.format===`regex`?`Invalid string: must match pattern ${t.pattern}`:`Invalid ${n[t.format]??e.format}`}case`not_multiple_of`:return`Invalid number: must be a multiple of ${e.divisor}`;case`unrecognized_keys`:return`Unrecognized key${e.keys.length>1?`s`:``}: ${w(e.keys,`, `)}`;case`invalid_key`:return`Invalid key in ${e.origin}`;case`invalid_union`:return e.options&&Array.isArray(e.options)&&e.options.length>0?`Invalid discriminator value. Expected ${e.options.map(e=>`'${e}'`).join(` | `)}`:e.inclusive===!1?`Invalid input: more than one option matched`:`Invalid input`;case`invalid_element`:return`Invalid value in ${e.origin}`;default:return`Invalid input`}}};function Ei(){return{localeError:Ti()}}var Di,Oi=class{constructor(){this._map=new WeakMap,this._idmap=new Map}add(e,...t){let n=t[0];return this._map.set(e,n),n&&typeof n==`object`&&`id`in n&&this._idmap.set(n.id,e),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(e){let t=this._map.get(e);return t&&typeof t==`object`&&`id`in t&&this._idmap.delete(t.id),this._map.delete(e),this}get(e){let t=e._zod.parent;if(t){let n={...this.get(t)??{}};delete n.id;let r={...n,...this._map.get(e)};return Object.keys(r).length?r:void 0}return this._map.get(e)}has(e){return this._map.has(e)}};function ki(){return new Oi}(Di=globalThis).__zod_globalRegistry??(Di.__zod_globalRegistry=ki());var Ai=globalThis.__zod_globalRegistry;function ji(e){return e.checks&&=[...e.checks],e}function Mi(e,t){return new e(ji({type:`string`,...V(t)}))}function Ni(e,t){return new e({type:`string`,format:`email`,check:`string_format`,abort:!1,...V(t)})}function Pi(e,t){return new e({type:`string`,format:`guid`,check:`string_format`,abort:!1,...V(t)})}function Fi(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,...V(t)})}function Ii(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v4`,...V(t)})}function Li(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v6`,...V(t)})}function Ri(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v7`,...V(t)})}function zi(e,t){return new e({type:`string`,format:`url`,check:`string_format`,abort:!1,...V(t)})}function Bi(e,t){return new e({type:`string`,format:`emoji`,check:`string_format`,abort:!1,...V(t)})}function Vi(e,t){return new e({type:`string`,format:`nanoid`,check:`string_format`,abort:!1,...V(t)})}function Hi(e,t){return new e({type:`string`,format:`cuid`,check:`string_format`,abort:!1,...V(t)})}function Ui(e,t){return new e({type:`string`,format:`cuid2`,check:`string_format`,abort:!1,...V(t)})}function Wi(e,t){return new e({type:`string`,format:`ulid`,check:`string_format`,abort:!1,...V(t)})}function Gi(e,t){return new e({type:`string`,format:`xid`,check:`string_format`,abort:!1,...V(t)})}function Ki(e,t){return new e({type:`string`,format:`ksuid`,check:`string_format`,abort:!1,...V(t)})}function qi(e,t){return new e({type:`string`,format:`ipv4`,check:`string_format`,abort:!1,...V(t)})}function Ji(e,t){return new e({type:`string`,format:`ipv6`,check:`string_format`,abort:!1,...V(t)})}function Yi(e,t){return new e({type:`string`,format:`cidrv4`,check:`string_format`,abort:!1,...V(t)})}function Xi(e,t){return new e({type:`string`,format:`cidrv6`,check:`string_format`,abort:!1,...V(t)})}function Zi(e,t){return new e({type:`string`,format:`base64`,check:`string_format`,abort:!1,...V(t)})}function Qi(e,t){return new e({type:`string`,format:`base64url`,check:`string_format`,abort:!1,...V(t)})}function $i(e,t){return new e({type:`string`,format:`e164`,check:`string_format`,abort:!1,...V(t)})}function ea(e,t){return new e({type:`string`,format:`jwt`,check:`string_format`,abort:!1,...V(t)})}function ta(e,t){return new e({type:`string`,format:`datetime`,check:`string_format`,offset:!1,local:!1,precision:null,...V(t)})}function na(e,t){return new e({type:`string`,format:`date`,check:`string_format`,...V(t)})}function ra(e,t){return new e({type:`string`,format:`time`,check:`string_format`,precision:null,...V(t)})}function ia(e,t){return new e({type:`string`,format:`duration`,check:`string_format`,...V(t)})}function aa(e,t){return new e(ji({type:`number`,checks:[],...V(t)}))}function oa(e,t){return new e({type:`number`,check:`number_format`,abort:!1,format:`safeint`,...V(t)})}function sa(e,t){return new e({type:`boolean`,...V(t)})}function ca(e){return new e({type:`unknown`})}function la(e,t){return new e({type:`never`,...V(t)})}function ua(e,t){return new un({check:`less_than`,...V(t),value:e,inclusive:!1})}function da(e,t){return new un({check:`less_than`,...V(t),value:e,inclusive:!0})}function fa(e,t){return new dn({check:`greater_than`,...V(t),value:e,inclusive:!1})}function pa(e,t){return new dn({check:`greater_than`,...V(t),value:e,inclusive:!0})}function ma(e,t){return new fn({check:`multiple_of`,...V(t),value:e})}function ha(e,t){return new mn({check:`max_length`,...V(t),maximum:e})}function ga(e,t){return new hn({check:`min_length`,...V(t),minimum:e})}function _a(e,t){return new gn({check:`length_equals`,...V(t),length:e})}function va(e,t){return new vn({check:`string_format`,format:`regex`,...V(t),pattern:e})}function ya(e){return new yn({check:`string_format`,format:`lowercase`,...V(e)})}function ba(e){return new bn({check:`string_format`,format:`uppercase`,...V(e)})}function xa(e,t){return new xn({check:`string_format`,format:`includes`,...V(t),includes:e})}function Sa(e,t){return new Sn({check:`string_format`,format:`starts_with`,...V(t),prefix:e})}function Ca(e,t){return new Cn({check:`string_format`,format:`ends_with`,...V(t),suffix:e})}function wa(e){return new wn({check:`overwrite`,tx:e})}function Ta(e){return wa(t=>t.normalize(e))}function Ea(){return wa(e=>e.trim())}function Da(){return wa(e=>e.toLowerCase())}function Oa(){return wa(e=>e.toUpperCase())}function ka(){return wa(e=>ee(e))}function Aa(e,t,n){return new e({type:`array`,element:t,...V(n)})}function ja(e,t,n){return new e({type:`custom`,check:`custom`,fn:t,...V(n)})}function Ma(e,t){let n=Na(t=>(t.addIssue=e=>{if(typeof e==`string`)t.issues.push(je(e,t.value,n._zod.def));else{let r=e;r.fatal&&(r.continue=!1),r.code??=`custom`,`input`in r||(r.input=t.value),r.inst??=n,r.continue??=!n._zod.def.abort,t.issues.push(je(r))}},e(t.value,t)),t);return n}function Na(e,t){let n=new sn({check:`custom`,...V(t)});return n._zod.check=e,n}function Pa(e,...t){for(let n of t)for(let t of Reflect.ownKeys(n))Object.prototype.propertyIsEnumerable.call(n,t)&&j(e,t,n[t]);return e}function Fa(e){let t=e?.target??`draft-2020-12`;return t===`draft-4`&&(t=`draft-04`),t===`draft-7`&&(t=`draft-07`),{processors:e.processors??{},metadataRegistry:e?.metadata??Ai,target:t,unrepresentable:e?.unrepresentable??`throw`,override:e?.override??(()=>{}),io:e?.io??`output`,counter:0,seen:new Map,sharedDefsExtractedFor:void 0,sharedEmitDoneFor:void 0,cycles:e?.cycles??`ref`,reused:e?.reused??`inline`,intersections:[],deferred:[],external:e?.external??void 0}}function Ia(e,t,n,r,i){let a=typeof t.unrepresentable==`function`?t.unrepresentable({zodSchema:e,path:r.path,message:i}):t.unrepresentable;if(a===`any`)return!1;if(a===void 0||a===`throw`)throw Error(i);return Object.assign(n,a),!0}function La(e,t,n={path:[],schemaPath:[]}){var r;let i=e._zod.def,a=t.seen.get(e);if(a)return a.count++,n.schemaPath.includes(e)&&(a.cycle=n.path),a.schema;let o={schema:{},count:1,cycle:void 0,path:n.path};t.seen.set(e,o),t.sharedDefsExtractedFor=void 0,t.sharedEmitDoneFor=void 0;let s=e._zod.toJSONSchema?.();if(s)o.schema=s;else{let r={...n,schemaPath:[...n.schemaPath,e],path:n.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,o.schema,r);else{let n=o.schema,a=t.processors[i.type];if(!a)throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);a(e,t,n,r)}let a=e._zod.parent;a&&(o.ref||=a,La(a,t,r),t.seen.get(a).isParent=!0)}let c=t.metadataRegistry.get(e);return c&&Pa(o.schema,c),t.io===`input`&&qa(e)&&(delete o.schema.examples,delete o.schema.default),t.io===`input`&&`_prefault`in o.schema&&((r=o.schema).default??(r.default=o.schema._prefault)),delete o.schema._prefault,t.seen.get(e).schema}function Ra(e){return e.replace(/~/g,`~0`).replace(/\//g,`~1`)}function za(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);if(e.external&&e.sharedDefsExtractedFor===e.external)return;let r=new Map;for(let t of e.seen.entries()){let n=e.metadataRegistry.get(t[0])?.id;if(n){let e=r.get(n);if(e&&e!==t[0])throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);r.set(n,t[0])}}let i=t=>{let r=e.target===`draft-2020-12`?`$defs`:`definitions`;if(e.external){let n=e.external.registry.get(t[0])?.id,i=e.external.uri??(e=>e);if(n)return{ref:i(n)};let a=t[1].defId??t[1].schema.id??`schema${e.counter++}`;return t[1].defId=a,{defId:a,ref:`${i(`__shared`)}#/${r}/${Ra(a)}`}}let i=`#/${r}/`;if(t[1]===n&&!t[1].schema.id)return{ref:`#`};let a=t[1].schema.id??`__schema${e.counter++}`;return{defId:a,ref:i+Ra(a)}},a=e=>{if(e[1].schema.$ref)return;let t=e[1],{ref:n,defId:r}=i(e);t.def={...t.schema},r&&(t.defId=r);let a=t.schema;for(let e in a)delete a[e];a.$ref=n};if(e.cycles===`throw`)for(let t of e.seen.entries()){let e=t[1];if(e.cycle)throw Error(`Cycle detected: #/${e.cycle?.join(`/`)}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(let n of e.seen.entries()){let r=n[1];if(t===n[0])a(n);else{if(e.external){let r=e.external.registry.get(n[0])?.id;if(t!==n[0]&&r){a(n);continue}}(e.metadataRegistry.get(n[0])?.id||r.cycle||r.count>1&&e.reused===`ref`)&&a(n)}}e.external&&(e.sharedDefsExtractedFor=e.external)}function Ba(e){let t=e.anyOf;if(!Array.isArray(t)||t.length===0||e.type!==void 0)return;let n=[];for(let e of t){if(!e||typeof e!=`object`)return;Ba(e);let t=Object.keys(e);if(t.length!==1||t[0]!==`type`)return;let r=e.type;for(let e of Array.isArray(r)?r:[r]){if(typeof e!=`string`)return;n.includes(e)||n.push(e)}}delete e.anyOf,e.type=n.length===1?n[0]:n}var Va=new Set([`type`,`properties`,`required`,`additionalProperties`]),Ha=[`oneOf`,`anyOf`];function Ua(e){let t=e.additionalProperties;return t===void 0||t===!1||typeof t!=`object`||!t?null:Object.keys(t).length?t:null}function Wa(e){let t=[];for(let n of e){if(typeof n!=`object`||n.type!==`object`)return null;for(let e in n)if(!Va.has(e))return null;t.push(n)}let n={},r=new Set;for(let e of t){for(let r in e.properties){if(Object.prototype.hasOwnProperty.call(n,r))continue;let e=[];for(let n of t){let t=n.properties?.[r]??Ua(n);t!=null&&(e.some(e=>JSON.stringify(e)===JSON.stringify(t))||e.push(t))}j(n,r,e.length===1?e[0]:Wa(e)??{allOf:e})}for(let t of e.required??[])r.add(t)}let i={type:`object`,properties:n};if(r.size&&(i.required=[...r]),t.every(e=>e.additionalProperties===!1))i.additionalProperties=!1;else{let e=[];for(let n of t){let t=Ua(n);t&&!e.some(e=>JSON.stringify(e)===JSON.stringify(t))&&e.push(t)}e.length===1?i.additionalProperties=e[0]:e.length>1&&(i.additionalProperties={allOf:e})}return i}function Ga(e){let t=e.allOf;if(!Array.isArray(t)||t.length<2)return;for(let t of Va)if(t in e)return;let n=t.filter(e=>Ha.some(t=>Array.isArray(e[t]))),r=null;if(!n.length)r=Wa(t);else{let e=n[0],i=Ha.find(t=>Array.isArray(e[t]));if(Object.keys(e).length!==1)return;let a=t.filter(t=>t!==e),o=e[i].map(e=>Wa([...a,e]));if(o.some(e=>!e))return;r={[i]:o}}r&&(delete e.allOf,Pa(e,r))}function Ka(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);let r=t=>{let n=e.seen.get(t);if(n.ref===null)return;let i=n.def??n.schema,a={...i},o=n.ref;if(n.ref=null,o){r(o);let n=e.seen.get(o),s=n.schema;if(s.$ref&&(e.target===`draft-07`||e.target===`draft-04`||e.target===`openapi-3.0`)?(i.allOf=i.allOf??[],i.allOf.push(s)):Pa(i,s),Pa(i,a),t._zod.parent===o)for(let e in i)e!==`$ref`&&e!==`allOf`&&(e in a||delete i[e]);if(s.$ref&&n.def)for(let e in i)e!==`$ref`&&e!==`allOf`&&e in n.def&&JSON.stringify(i[e])===JSON.stringify(n.def[e])&&delete i[e]}let s=t._zod.parent;if(s&&s!==o){r(s);let t=e.seen.get(s);if(t?.schema.$ref&&(i.$ref=t.schema.$ref,t.def))for(let e in i)e!==`$ref`&&e!==`allOf`&&e in t.def&&JSON.stringify(i[e])===JSON.stringify(t.def[e])&&delete i[e]}e.override({zodSchema:t,jsonSchema:i,path:n.path??[]})};if(!e.external||e.sharedEmitDoneFor!==e.external){for(let t of[...e.seen.entries()].reverse())r(t[0]);if(e.target!==`openapi-3.0`)for(let t of e.seen.entries())Ba(t[1].def??t[1].schema);for(let t of e.deferred)t();if(e.intersections.length){let t=new Map;for(let n of e.seen.values())for(let e of[n.schema,n.def]){let n=e?.allOf;if(!Array.isArray(n))continue;let r=t.get(n);r?r.push(e):t.set(n,[e])}for(let n of e.intersections)for(let e of t.get(n)??[])Ga(e)}}let i={};if(e.target===`draft-2020-12`?i.$schema=`https://json-schema.org/draft/2020-12/schema`:e.target===`draft-07`?i.$schema=`http://json-schema.org/draft-07/schema#`:e.target===`draft-04`?i.$schema=`http://json-schema.org/draft-04/schema#`:e.target,e.external?.uri){let n=e.external.registry.get(t)?.id;if(!n)throw Error("Schema is missing an `id` property");i.$id=e.external.uri(n)}Pa(i,n.defId?n.schema:n.def??n.schema);let a=e.metadataRegistry.get(t)?.id;a!==void 0&&i.id===a&&delete i.id;let o=e.external?.defs??{};if(!e.external||e.sharedEmitDoneFor!==e.external)for(let t of e.seen.entries()){let e=t[1];e.def&&e.defId&&(e.def.id===e.defId&&delete e.def.id,j(o,e.defId,e.def))}e.external&&(e.sharedEmitDoneFor=e.external),e.external||Object.keys(o).length>0&&(e.target===`draft-2020-12`?i.$defs=o:i.definitions=o);try{let n=JSON.parse(JSON.stringify(i));return Object.defineProperty(n,"~standard",{value:{...t[`~standard`],jsonSchema:{input:Ya(t,`input`,e.processors),output:Ya(t,`output`,e.processors)}},enumerable:!1,writable:!1}),n}catch{throw Error(`Error converting schema to JSON.`)}}function qa(e,t){let n=t??{seen:new Set};if(n.seen.has(e))return!1;n.seen.add(e);let r=e._zod.def;if(r.type===`transform`)return!0;if(r.type===`array`)return qa(r.element,n);if(r.type===`set`)return qa(r.valueType,n);if(r.type===`lazy`)return qa(r.getter(),n);if(r.type===`promise`||r.type===`optional`||r.type===`nonoptional`||r.type===`nullable`||r.type===`readonly`||r.type==="default"||r.type===`prefault`||r.type===`catch`)return qa(r.innerType,n);if(r.type===`intersection`)return qa(r.left,n)||qa(r.right,n);if(r.type===`record`||r.type===`map`)return qa(r.keyType,n)||qa(r.valueType,n);if(r.type===`pipe`)return e._zod.traits.has(`$ZodCodec`)?!0:qa(r.in,n)||qa(r.out,n);if(r.type===`object`){for(let e in r.shape)if(qa(r.shape[e],n))return!0;return!1}if(r.type===`union`){for(let e of r.options)if(qa(e,n))return!0;return!1}if(r.type===`tuple`){for(let e of r.items)if(qa(e,n))return!0;return!!(r.rest&&qa(r.rest,n))}return!1}var Ja=(e,t={})=>n=>{let r=Fa({...n,processors:t});return La(e,r),za(r,e),Ka(r,e)},Ya=(e,t,n={})=>r=>{let{libraryOptions:i,target:a}=r??{},o=Fa({...i??{},target:a,io:t,processors:n});return La(e,o),za(o,e),Ka(o,e)},Xa=(e,t,n)=>{(e[t]===void 0||n>e[t])&&(e[t]=n)},Za=(e,t,n)=>{(e[t]===void 0||n<e[t])&&(e[t]=n)},Qa=(e,t)=>{Xa(e,`minimum`,t),Za(e,`maximum`,t)},$a=(e,t)=>{e.multipleOf??=[],e.multipleOf.includes(t)||e.multipleOf.push(t)},eo=(e,t)=>{e.patterns??=new Set,e.patterns.add(t)},to=(e,t)=>{e.mime=e.mime?e.mime.filter(e=>t.includes(e)):[...t]},no=(e,t)=>{e.format=t,t.includes(`int`)&&(e.isInt=!0)},ro=(e,t)=>Xa(e,`minimum`,t.minimum),io=(e,t)=>Za(e,`maximum`,t.maximum),ao=e=>(t,n)=>{no(t,n.format);let[r,i]=e[n.format];Xa(t,`minimum`,r),Za(t,`maximum`,i)},oo={greater_than:(e,t)=>Xa(e,t.inclusive?`minimum`:`exclusiveMinimum`,t.value),less_than:(e,t)=>Za(e,t.inclusive?`maximum`:`exclusiveMaximum`,t.value),multiple_of:(e,t)=>$a(e,t.value),number_format:ao(le),bigint_format:ao(ue),min_length:ro,max_length:io,length_equals:(e,t)=>Qa(e,t.length),min_size:ro,max_size:io,size_equals:(e,t)=>Qa(e,t.size),string_format:(e,t)=>{no(e,t.format),t.pattern&&eo(e,t.pattern),(t.format===`base64`||t.format===`base64url`)&&(e.contentEncoding=t.format),(t.local||t.precision===-1)&&(e.laxFormat=!0)},mime_type:(e,t)=>to(e,t.mime)};function so(e){let t={},n=e._zod.def,r=e._zod.traits.has(`$ZodCheck`)?[e,...n.checks??[]]:n.checks??[];for(let e of r)oo[e._zod.def.check]?.(t,e._zod.def);let i=e._zod.bag;i.minimum!==void 0&&Xa(t,`minimum`,i.minimum),i.exclusiveMinimum!==void 0&&Xa(t,`exclusiveMinimum`,i.exclusiveMinimum),i.maximum!==void 0&&Za(t,`maximum`,i.maximum),i.exclusiveMaximum!==void 0&&Za(t,`exclusiveMaximum`,i.exclusiveMaximum),i.multipleOf!==void 0&&$a(t,i.multipleOf),i.format!==void 0&&(t.format??=i.format,i.format.includes(`int`)&&(t.isInt=!0)),i.mime&&to(t,i.mime);for(let e of i.patterns??[])eo(t,e);return t}var co={guid:`uuid`,url:`uri`,datetime:`date-time`,json_string:`json-string`,regex:``},lo=new Map([[lr,Wt],[dr,Gt]]),uo=e=>lo.get(e)??e,fo=(e,t,n,r)=>{let i=n;i.type=`string`;let{minimum:a,maximum:o,format:s,patterns:c,contentEncoding:l,laxFormat:u}=so(e);if(typeof a==`number`&&(i.minLength=a),typeof o==`number`&&(i.maxLength=o),s&&(i.format=co[s]??s,i.format===``&&delete i.format,(s===`time`||u)&&delete i.format),l&&(i.contentEncoding=l),c&&c.size>0){let e=[...c].map(uo);e.length===1?i.pattern=e[0].source:e.length>1&&(i.allOf=[...e.map(e=>({...t.target===`draft-07`||t.target===`draft-04`||t.target===`openapi-3.0`?{type:`string`}:{},pattern:e.source}))])}},po=(e,t,n,r)=>{let i=n,{minimum:a,maximum:o,multipleOf:s,exclusiveMaximum:c,exclusiveMinimum:l,isInt:u}=so(e);i.type=u?`integer`:`number`;let d=typeof l==`number`&&l>=(a??-1/0),f=typeof c==`number`&&c<=(o??1/0),p=t.target===`draft-04`||t.target===`openapi-3.0`;if(d?p?(i.minimum=l,i.exclusiveMinimum=!0):i.exclusiveMinimum=l:typeof a==`number`&&(i.minimum=a),f?p?(i.maximum=c,i.exclusiveMaximum=!0):i.exclusiveMaximum=c:typeof o==`number`&&(i.maximum=o),s){let n=new Set;for(let a of s)Number.isFinite(a)&&a!==0?n.add(Math.abs(a)):Ia(e,t,i,r,`A multipleOf divisor of ${a} cannot be represented in JSON Schema`);let[a,...o]=n;a!==void 0&&(i.multipleOf=a),o.length&&(i.allOf=[...i.allOf??[],...o.map(e=>({multipleOf:e}))])}},mo=(e,t,n,r)=>{n.type=`boolean`},ho=(e,t,n,r)=>{n.not={}},go=(e,t,n,r)=>{let i=e._zod.def,a=C(i.entries);a.length===0?n.not={}:(a.every(e=>typeof e==`number`)&&(n.type=`number`),a.every(e=>typeof e==`string`)&&(n.type=`string`),n.enum=a)},_o=(e,t,n,r)=>{let i=e._zod.def;if(i.values.length===0){n.not={};return}let a=[];for(let o of i.values)if(o===void 0){if(Ia(e,t,n,r,"Literal `undefined` cannot be represented in JSON Schema"))return}else if(typeof o==`bigint`){if(Ia(e,t,n,r,`BigInt literals cannot be represented in JSON Schema`))return;a.push(Number(o))}else a.push(o);if(a.length!==0){if(a.length===1){let e=a[0];n.type=e===null?`null`:typeof e,t.target===`draft-04`||t.target===`openapi-3.0`?n.enum=[e]:n.const=e}else a.every(e=>typeof e==`number`)&&(n.type=`number`),a.every(e=>typeof e==`string`)&&(n.type=`string`),a.every(e=>typeof e==`boolean`)&&(n.type=`boolean`),a.every(e=>e===null)&&(n.type=`null`),n.enum=a}},vo=(e,t,n,r)=>{Ia(e,t,n,r,`Custom types cannot be represented in JSON Schema`)},yo=(e,t,n,r)=>{Ia(e,t,n,r,`Transforms cannot be represented in JSON Schema`)},bo=(e,t,n,r)=>{let i=n,a=e._zod.def,{minimum:o,maximum:s}=so(e);typeof o==`number`&&(i.minItems=o),typeof s==`number`&&(i.maxItems=s),i.type=`array`,i.items=La(a.element,t,{...r,path:[...r.path,`items`]})};function xo(e){let t=e._zod.def;return t.type===`pipe`&&t.in._zod.traits.has(`$ZodTransform`)?xo(t.out):t.type===`catch`?xo(t.innerType):e._zod.optin}var So=(e,t,n,r)=>{let i=n,a=e._zod.def,o=a.shape;if(Object.getOwnPropertySymbols(o).length&&Ia(e,t,i,r,`Symbol keys cannot be represented in JSON Schema`))return;i.type=`object`,i.properties={};for(let e in o)j(i.properties,e,La(o[e],t,{...r,path:[...r.path,`properties`,e]}));let s=[];for(let e of Object.keys(o)){let n=a.shape[e];(t.io===`input`?xo(n)===void 0:n._zod.optout===void 0)&&s.push(e)}s.length>0&&(i.required=s),a.catchall?._zod.def.type===`never`?i.additionalProperties=!1:a.catchall?a.catchall&&(i.additionalProperties=La(a.catchall,t,{...r,path:[...r.path,`additionalProperties`]})):t.io===`output`&&(i.additionalProperties=!1)},Co=(e,t,n,r)=>{let i=e._zod.def,a=i.inclusive===!1,o=i.options.map((e,n)=>La(e,t,{...r,path:[...r.path,a?`oneOf`:`anyOf`,n]}));a?n.oneOf=o:n.anyOf=o},wo=(e,t,n,r)=>{let i=e._zod.def,a=La(i.left,t,{...r,path:[...r.path,`allOf`,0]}),o=La(i.right,t,{...r,path:[...r.path,`allOf`,1]}),s=e=>`allOf`in e&&Object.keys(e).length===1,c=[...s(a)?a.allOf:[a],...s(o)?o.allOf:[o]];n.allOf=c,t.intersections.push(c)},To=(e,t,n,r)=>{let i=n,a=e._zod.def;i.type=`array`;let o=t.target===`draft-2020-12`?`prefixItems`:`items`,s=t.target===`draft-2020-12`||t.target===`openapi-3.0`?`items`:`additionalItems`,c=a.items.map((e,n)=>La(e,t,{...r,path:[...r.path,o,n]})),l=a.rest?La(a.rest,t,{...r,path:[...r.path,s,...t.target===`openapi-3.0`?[a.items.length]:[]]}):null,u=a.items.length;for(;u>0;){let e=a.items[u-1];if(!(t.io===`input`?xo(e)!==void 0:e._zod.optout===`optional`))break;u--}let d=a.items.length,f=!a.rest;t.target===`draft-2020-12`?(i.prefixItems=c,f?i.items=!1:l&&(i.items=l),u>0&&(i.minItems=u),f&&(i.maxItems=d)):t.target===`openapi-3.0`?(i.items={anyOf:c},l&&i.items.anyOf.push(l),u>0&&(i.minItems=u),f&&(i.maxItems=d)):(i.items=c,f?i.additionalItems=!1:l&&(i.additionalItems=l),u>0&&(i.minItems=u),f&&(i.maxItems=d));let{minimum:p,maximum:m}=so(e);typeof p==`number`&&(i.minItems=p),typeof m==`number`&&(i.maxItems=m)};function Eo(e,t,n){if(t.$ref){if(n.has(t))return t;n.add(t);let r=e.get(t)?.def;if(!r)return t;let i=Eo(e,r,n);return i===r?t:i}for(let r of[`anyOf`,`oneOf`]){let i=t[r];if(!Array.isArray(i))continue;let a=i.map(t=>Eo(e,t,n));a.some((e,t)=>e!==i[t])&&(t={...t,[r]:a})}let r=Array.isArray(t.type)?t.type:[t.type],i=!r.includes(`string`)&&r.some(e=>e===`number`||e===`integer`),a=t.enum??(t.const===void 0?void 0:[t.const]);if(!i&&!a?.some(e=>typeof e==`number`))return t;let{minimum:o,maximum:s,exclusiveMinimum:c,exclusiveMaximum:l,multipleOf:u,format:d,id:f,...p}=t;return p.enum?p.enum=p.enum.map(e=>typeof e==`number`?String(e):e):typeof p.const==`number`&&(p.const=String(p.const)),i&&(p.type=`string`,a||(p.pattern=(r.includes(`number`)?nn:tn).source)),p}var Do=new WeakMap;function Oo(e){let t=new Map;for(let n of e.seen.values())n.def&&!t.has(n.schema)&&t.set(n.schema,n);let n=new Map;for(let r of Do.get(e)??[]){let i=e.seen.get(r),a=(i?.def??i?.schema)?.propertyNames;if(!a||a===!0||n.has(a))continue;let o=Eo(t,a,new Set);o!==a&&n.set(a,o)}if(n.size)for(let t of e.seen.values())for(let e of[t.schema,t.def]){let t=e&&n.get(e.propertyNames);t&&(e.propertyNames=t)}}var ko=(e,t,n,r)=>{let i=n,a=e._zod.def;i.type=`object`;let o=a.keyType,s=so(o).patterns;if(a.mode===`loose`&&s&&s.size>0){let e=La(a.valueType,t,{...r,path:[...r.path,`patternProperties`,`*`]});i.patternProperties={};for(let t of s)j(i.patternProperties,uo(t).source,e)}else{if(t.target===`draft-07`||t.target===`draft-2020-12`){i.propertyNames=La(a.keyType,t,{...r,path:[...r.path,`propertyNames`]});let n=Do.get(t);n||(n=[],Do.set(t,n),t.deferred.push(()=>Oo(t))),n.push(e)}i.additionalProperties=La(a.valueType,t,{...r,path:[...r.path,`additionalProperties`]})}let c=o._zod.values,l=t.io===`input`&&xo(a.valueType)!==void 0;if(c&&!a.partial&&!l){let e=[...c].filter(e=>typeof e==`string`||typeof e==`number`);e.length>0&&(i.required=e.map(String))}},Ao=(e,t,n,r)=>{let i=e._zod.def,a=La(i.innerType,t,r),o=t.seen.get(e);t.target===`openapi-3.0`?(o.ref=i.innerType,n.nullable=!0):n.anyOf=[a,{type:`null`}]},jo=(e,t,n,r)=>{let i=e._zod.def;La(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},Mo=Symbol();function No(e,t,n,r,i){let a=!1,o=JSON.stringify(e,(e,t)=>typeof t==`bigint`?(a=!0,null):t);return a?(Ia(t,n,r,i,`BigInt defaults cannot be represented in JSON Schema`),Mo):JSON.parse(o)}var Po=(e,t,n,r)=>{let i=e._zod.def;La(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o=No(i.defaultValue,e,t,n,r);o!==Mo&&(n.default=o)},Fo=(e,t,n,r)=>{let i=e._zod.def;La(i.innerType,t,r);let a=t.seen.get(e);if(a.ref=i.innerType,t.io!==`input`)return;let o=No(i.defaultValue,e,t,n,r);o!==Mo&&(n._prefault=o)},Io=(e,t,n,r)=>{let i=e._zod.def;La(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o;try{o=i.catchValue(void 0)}catch{Ia(e,t,n,r,`Dynamic catch values are not supported in JSON Schema`);return}n.default=o},Lo=(e,t,n,r)=>{let i=e._zod.def,a=i.in._zod.traits.has(`$ZodTransform`),o=t.io===`input`?a?i.out:i.in:i.out;La(o,t,r);let s=t.seen.get(e);s.ref=o},Ro=(e,t,n,r)=>{let i=e._zod.def;La(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType,n.readOnly=!0},zo=(e,t,n,r)=>{let i=e._zod.def;La(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},Bo=new WeakSet([Object.prototype,Error.prototype]);function Vo(e,t,n){Object.defineProperty(e,t,{configurable:!0,enumerable:!1,get(){let e=n(this);return Object.defineProperty(this,t,{value:e,configurable:!0,writable:!0}),e},set(e){Object.defineProperty(this,t,{value:e,configurable:!0,writable:!0})}})}var Ho=U(`ZodError`,(e,t)=>{it.init(e,t),e.name=`ZodError`;let n=Object.getPrototypeOf(e);Bo.has(n)||(Bo.add(n),Vo(n,`format`,e=>t=>st(e,t)),Vo(n,`flatten`,e=>t=>ot(e,t)),Vo(n,`addIssue`,e=>t=>{e.issues.push(t),e.message=JSON.stringify(e.issues,T,2)}),Vo(n,`addIssues`,e=>t=>{e.issues.push(...t),e.message=JSON.stringify(e.issues,T,2)}),Object.defineProperty(n,"isEmpty",{configurable:!0,enumerable:!1,get(){return this.issues.length===0}}))},void 0,{Parent:Error}),Uo=lt(Ho),Wo=ut(Ho),Go=dt(Ho),Ko=pt(Ho),qo=yt(Ho),Jo=bt(Ho),Yo=xt(Ho),Xo=St(Ho),Zo=Ct(Ho),Qo=wt(Ho),$o=Tt(Ho),es=Et(Ho);function ts(){Ze.localeError||Qe(Ei())}function ns(){Ze.memoizer||Qe({memoizer:Ci()})}var rs=U(`ZodType`,(e,t)=>(ts(),Dn.init(e,t),e.def=t,e.type=t.type,e),{check(...e){let t=this.def;return this.clone(R(t,{checks:[...t.checks??[],...e.map(e=>typeof e==`function`?{_zod:{check:e,def:{check:`custom`},onattach:[]}}:e)]}),{parent:!0})},with(...e){return this.check(...e)},clone(e,t){return se(this,e,t)},brand(){return this},register(e,t){return e.add(this,t),this},refine(e,t){return this.check(yc(e,t))},superRefine(e,t){return this.check(bc(e,t))},overwrite(e){return this.check(wa(e))},optional(){return tc(this)},exactOptional(){return rc(this)},nullable(){return ac(this)},nullish(){return tc(ac(this))},nonoptional(e){return dc(this,e)},array(){return K(this)},or(e){return Hs([this,e])},and(e){return Ws(this,e)},transform(e){return hc(this,$s(e))},default(e){return sc(this,e)},prefault(e){return lc(this,e)},catch(e){return pc(this,e)},pipe(e){return hc(this,e)},readonly(){return _c(this)},describe(e){let t=this.clone();return Ai.add(t,{description:e}),t},meta(...e){if(e.length===0)return Ai.get(this);let t=this.clone();return Ai.add(t,e[0]),t},isOptional(){return this.safeParse(void 0).success},isNullable(){return this.safeParse(null).success},apply(e,...t){return t.length===0?e(this):e(this,...t)},get"~standard"(){return Pe(this,`~standard`,{...An(this),jsonSchema:{input:Ya(this,`input`),output:Ya(this,`output`)}})},set"~standard"(e){Ne(this,`~standard`,e)},parse:function e(t,n){return Uo(this,t,n,{callee:e})},parseAsync:async function e(t,n){return await Wo(this,t,n,{callee:e})},safeParse(e,t){return Go(this,e,t)},async safeParseAsync(e,t){return Ko(this,e,t)},get spa(){return this?.safeParseAsync},set spa(e){Ne(this,`spa`,e)},validate(e,t){return gt(this,e,t)},validateAsync(e,t){return vt(this,e,t)},encode:function e(t,n){return qo(this,t,n,{callee:e})},decode:function e(t,n){return Jo(this,t,n,{callee:e})},encodeAsync:async function e(t,n){return await Yo(this,t,n,{callee:e})},decodeAsync:async function e(t,n){return await Xo(this,t,n,{callee:e})},safeEncode(e,t){return Zo(this,e,t)},safeDecode(e,t){return Qo(this,e,t)},async safeEncodeAsync(e,t){return $o(this,e,t)},async safeDecodeAsync(e,t){return es(this,e,t)},toJSONSchema(e){return Ja(this,{})(e)},get description(){return Ai.get(this)?.description},get _def(){return this._zod.def}}),is=U(`_ZodString`,(e,t)=>{jn.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>fo(e,t,n,r)},Fe({format:e=>so(e).format??null,minLength:e=>so(e).minimum??null,maxLength:e=>so(e).maximum??null},{regex(...e){return this.check(va(...e))},includes(...e){return this.check(xa(...e))},startsWith(...e){return this.check(Sa(...e))},endsWith(...e){return this.check(Ca(...e))},min(...e){return this.check(ga(...e))},max(...e){return this.check(ha(...e))},length(...e){return this.check(_a(...e))},nonempty(...e){return this.check(ga(1,...e))},lowercase(e){return this.check(ya(e))},uppercase(e){return this.check(ba(e))},trim(){return this.check(Ea())},normalize(...e){return this.check(Ta(...e))},toLowerCase(){return this.check(Da())},toUpperCase(){return this.check(Oa())},slugify(){return this.check(ka())}})),as=U(`ZodString`,(e,t)=>{jn.init(e,t),is.init(e,t)},{email(e){return this.check(Ni(ds,e))},url(e){return this.check(zi(ms,e))},jwt(e){return this.check(ea(ks,e))},emoji(e){return this.check(Bi(hs,e))},guid(e){return this.check(Pi(fs,e))},uuid(e){return this.check(Fi(ps,e))},uuidv4(e){return this.check(Ii(ps,e))},uuidv6(e){return this.check(Li(ps,e))},uuidv7(e){return this.check(Ri(ps,e))},nanoid(e){return this.check(Vi(gs,e))},cuid(e){return this.check(Hi(_s,e))},cuid2(e){return this.check(Ui(vs,e))},ulid(e){return this.check(Wi(ys,e))},base64(e){return this.check(Zi(Es,e))},base64url(e){return this.check(Qi(Ds,e))},xid(e){return this.check(Gi(bs,e))},ksuid(e){return this.check(Ki(xs,e))},ipv4(e){return this.check(qi(Ss,e))},ipv6(e){return this.check(Ji(Cs,e))},cidrv4(e){return this.check(Yi(ws,e))},cidrv6(e){return this.check(Xi(Ts,e))},e164(e){return this.check($i(Os,e))},datetime(e){return this.check(ta(ss,e))},date(e){return this.check(na(cs,e))},time(e){return this.check(ra(ls,e))},duration(e){return this.check(ia(us,e))}});function W(e){return Mi(as,e)}var os=U(`ZodStringFormat`,(e,t)=>{Mn.init(e,t),is.init(e,t)}),ss=U(`ZodISODateTime`,(e,t)=>{Zn.init(e,t),os.init(e,t)}),cs=U(`ZodISODate`,(e,t)=>{Qn.init(e,t),os.init(e,t)}),ls=U(`ZodISOTime`,(e,t)=>{$n.init(e,t),os.init(e,t)}),us=U(`ZodISODuration`,(e,t)=>{er.init(e,t),os.init(e,t)}),ds=U(`ZodEmail`,(e,t)=>{Fn.init(e,t),os.init(e,t)}),fs=U(`ZodGUID`,(e,t)=>{Nn.init(e,t),os.init(e,t)}),ps=U(`ZodUUID`,(e,t)=>{Pn.init(e,t),os.init(e,t)}),ms=U(`ZodURL`,(e,t)=>{Un.init(e,t),os.init(e,t)}),hs=U(`ZodEmoji`,(e,t)=>{Wn.init(e,t),os.init(e,t)}),gs=U(`ZodNanoID`,(e,t)=>{Gn.init(e,t),os.init(e,t)}),_s=U(`ZodCUID`,(e,t)=>{Kn.init(e,t),os.init(e,t)}),vs=U(`ZodCUID2`,(e,t)=>{qn.init(e,t),os.init(e,t)}),ys=U(`ZodULID`,(e,t)=>{Jn.init(e,t),os.init(e,t)}),bs=U(`ZodXID`,(e,t)=>{Yn.init(e,t),os.init(e,t)}),xs=U(`ZodKSUID`,(e,t)=>{Xn.init(e,t),os.init(e,t)}),Ss=U(`ZodIPv4`,(e,t)=>{tr.init(e,t),os.init(e,t)}),Cs=U(`ZodIPv6`,(e,t)=>{ir.init(e,t),os.init(e,t)}),ws=U(`ZodCIDRv4`,(e,t)=>{ar.init(e,t),os.init(e,t)}),Ts=U(`ZodCIDRv6`,(e,t)=>{sr.init(e,t),os.init(e,t)}),Es=U(`ZodBase64`,(e,t)=>{ur.init(e,t),os.init(e,t)}),Ds=U(`ZodBase64URL`,(e,t)=>{pr.init(e,t),os.init(e,t)}),Os=U(`ZodE164`,(e,t)=>{mr.init(e,t),os.init(e,t)}),ks=U(`ZodJWT`,(e,t)=>{gr.init(e,t),os.init(e,t)}),As=U(`ZodNumber`,(e,t)=>{_r.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>po(e,t,n,r),e.isFinite=!0},Fe({minValue:e=>{let{minimum:t,exclusiveMinimum:n}=so(e);return Math.max(t??-1/0,n??-1/0)},maxValue:e=>{let{maximum:t,exclusiveMaximum:n}=so(e);return Math.min(t??1/0,n??1/0)},isInt:e=>{let{isInt:t,multipleOf:n}=so(e);return!!t||!!n?.some(Number.isSafeInteger)},format:e=>so(e).format??null},{gt(e,t){return this.check(fa(e,t))},gte(e,t){return this.check(pa(e,t))},min(e,t){return this.check(pa(e,t))},lt(e,t){return this.check(ua(e,t))},lte(e,t){return this.check(da(e,t))},max(e,t){return this.check(da(e,t))},int(e){return this.check(Ms(e))},safe(e){return this.check(Ms(e))},positive(e){return this.check(fa(0,e))},nonnegative(e){return this.check(pa(0,e))},negative(e){return this.check(ua(0,e))},nonpositive(e){return this.check(da(0,e))},multipleOf(e,t){return this.check(ma(e,t))},step(e,t){return this.check(ma(e,t))},finite(){return this}}));function G(e){return aa(As,e)}var js=U(`ZodNumberFormat`,(e,t)=>{vr.init(e,t),As.init(e,t)});function Ms(e){return oa(js,e)}var Ns=U(`ZodBoolean`,(e,t)=>{yr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>mo(e,t,n,r)});function Ps(e){return sa(Ns,e)}var Fs=U(`ZodUnknown`,(e,t)=>{br.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(e,t,n)=>void 0});function Is(){return ca(Fs)}var Ls=U(`ZodNever`,(e,t)=>{xr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ho(e,t,n,r)});function Rs(e){return la(Ls,e)}var zs=U(`ZodArray`,(e,t)=>{ns(),Tr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>bo(e,t,n,r),e.element=t.element},{min(e,t){return this.check(ga(e,t))},nonempty(e){return this.check(ga(1,e))},max(e,t){return this.check(ha(e,t))},length(e,t){return this.check(_a(e,t))},unwrap(){return this.element}});function K(e,t){return Aa(zs,e,t)}var Bs=U(`ZodObject`,(e,t)=>{ns(),jr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>So(e,t,n,r),He(e,`shape`,e=>e._zod.def.shape,!1)},{keyof(){return J(Object.keys(this._zod.def.shape))},catchall(e){return this.clone(R(this._zod.def,{catchall:e}))},passthrough(){return this.clone(R(this._zod.def,{catchall:Is()}))},loose(){return this.clone(R(this._zod.def,{catchall:Is()}))},strict(){return this.clone(R(this._zod.def,{catchall:Rs()}))},strip(){return this.clone(R(this._zod.def,{catchall:void 0}))},extend(e){return me(this,e)},safeExtend(e){return ge(this,e)},merge(e){return _e(this,e)},pick(e){return de(this,e)},omit(e){return pe(this,e)},partial(...e){return ve(ec,this,e[0])},exactPartial(...e){return ve(nc,this,e[0],`exactPartial`)},required(...e){return ye(uc,this,e[0])}});function q(e,t){return new Bs({type:`object`,shape:e??{},...V(t)})}var Vs=U(`ZodUnion`,(e,t)=>{Nr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Co(e,t,n,r),e.options=t.options});function Hs(e,t){return new Vs({type:`union`,options:e,...V(t)})}var Us=U(`ZodIntersection`,(e,t)=>{Pr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>wo(e,t,n,r)});function Ws(e,t){return new Us({type:`intersection`,left:e,right:t})}var Gs=U(`ZodTuple`,(e,t)=>{ns(),Lr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>To(e,t,n,r)},{rest(e){return this.clone({...this._zod.def,rest:e})},partial(){let e=this._zod.def;if(e.checks?.length)throw Error(`.partial() cannot be used on tuple schemas containing refinements`);return this.clone({...e,items:e.items.map(e=>new ec({type:`optional`,innerType:e}))})}});function Ks(e,t,n){let r=t instanceof Dn;return new Gs({type:`tuple`,items:e,rest:r?t:null,...V(r?n:t)})}var qs=U(`ZodRecord`,(e,t)=>{ns(),Vr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ko(e,t,n,r),e.keyType=t.keyType,e.valueType=t.valueType});function Js(e,t,n){return!t||!t._zod?new qs({type:`record`,keyType:W(),valueType:e,...V(t)}):new qs({type:`record`,keyType:e,valueType:t,...V(n)})}var Ys=U(`ZodEnum`,(e,t)=>{Hr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>go(e,t,n,r),e.enum=t.entries,e.options=[...e._zod.values];let n=new Set(Object.keys(t.entries));e.extract=(e,r)=>{let i={};for(let r of e)if(n.has(r))i[r]=t.entries[r];else throw Error(`Key ${r} not found in enum`);return new Ys({...t,checks:[],...V(r),entries:i})},e.exclude=(e,r)=>{let i={...t.entries};for(let t of e)if(n.has(t))delete i[t];else throw Error(`Key ${t} not found in enum`);return new Ys({...t,checks:[],...V(r),entries:i})}});function J(e,t){return new Ys({type:`enum`,entries:Array.isArray(e)?Object.fromEntries(e.map(e=>[e,e])):e,...V(t)})}var Xs=U(`ZodLiteral`,(e,t)=>{Ur.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>_o(e,t,n,r),e.values=new Set(t.values),Object.defineProperty(e,"value",{get(){if(t.values.length>1)throw Error("This schema contains multiple valid literal values. Use `.values` instead.");return t.values[0]}})});function Zs(e,t){return new Xs({type:`literal`,values:Array.isArray(e)?e:[e],...V(t)})}var Qs=U(`ZodTransform`,(e,t)=>{ns(),Wr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>yo(e,t,n,r),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new Xe(e.constructor.name);n.addIssue=r=>{if(typeof r==`string`)n.issues.push(je(r,n.value,t));else{let t=r;t.fatal&&(t.continue=!1),t.code??=`custom`,`input`in t||(t.input=n.value),t.inst??=e,n.issues.push(je(t))}};let i=t.transform(n.value,n);return i instanceof Promise?i.then(e=>(n.value=e,n)):(n.value=i,n)}});function $s(e){return new Qs({type:`transform`,transform:e})}var ec=U(`ZodOptional`,(e,t)=>{Kr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>zo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function tc(e){return new ec({type:`optional`,innerType:e})}var nc=U(`ZodExactOptional`,(e,t)=>{qr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>zo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function rc(e){return new nc({type:`optional`,innerType:e})}var ic=U(`ZodNullable`,(e,t)=>{Jr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Ao(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function ac(e){return new ic({type:`nullable`,innerType:e})}var oc=U(`ZodDefault`,(e,t)=>{Yr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Po(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function sc(e,t){return new oc({type:`default`,innerType:e,get defaultValue(){return typeof t==`function`?t():ie(t)}})}var cc=U(`ZodPrefault`,(e,t)=>{Zr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Fo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function lc(e,t){return new cc({type:`prefault`,innerType:e,get defaultValue(){return typeof t==`function`?t():ie(t)}})}var uc=U(`ZodNonOptional`,(e,t)=>{Qr.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>jo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function dc(e,t){return new uc({type:`nonoptional`,innerType:e,...V(t)})}var fc=U(`ZodCatch`,(e,t)=>{ti.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Io(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function pc(e,t){return new fc({type:`catch`,innerType:e,catchValue:typeof t==`function`?t:We(t)})}var mc=U(`ZodPipe`,(e,t)=>{ni.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Lo(e,t,n,r),e.in=t.in,e.out=t.out});function hc(e,t){return new mc({type:`pipe`,in:e,out:t})}var gc=U(`ZodReadonly`,(e,t)=>{ii.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Ro(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function _c(e){return new gc({type:`readonly`,innerType:e})}var vc=U(`ZodCustom`,(e,t)=>{oi.init(e,t),rs.init(e,t),e._zod.processJSONSchema=(t,n,r)=>vo(e,t,n,r)});function yc(e,t={}){return ja(vc,e,t)}function bc(e,t){return Ma(e,t)}var xc=J([`switch`,`router`,`compute-node`,`mini-pc`,`sbc`,`nas`,`patch-panel`,`pdu`,`ups`,`modular-carrier`,`brush-panel`,`blanking-panel`,`blank-panel`,`shelf`,`keystone-module`]).describe(`Primary functional category of the hardware unit.`),Sc=J([`rackmount-19`,`rackmount-10`,`rackmount-6`,`sub-module`,`shelf-standing`]).describe(`Physical form factor and mounting mechanism.`),Cc=J([`included-19inch-ears`,`included-10inch-ears`,`included-6inch-ears`,`flush-front`,`recessed-20mm`,`sub-module-clip`,`rear-rail-mount`,`none`]).describe(`Mounting ear geometry relative to the vertical rack rails.`),wc=J([`consumer`,`pse-switch`,`pdu`,`ups`,`passive`]).describe(`Role in the electrical and PoE Directed Acyclic Graph (DAG).`),Tc=J([`front-to-rear`,`rear-to-front`,`side-to-side`,`passive-convection`,`none`]).describe(`Primary thermal airflow path through the device chassis.`),Ec=J([`front`,`rear`]).describe(`Mounting or port face relative to the rack or chassis.`),Dc=J([`rj45`,`rj45-serial-console`,`sfp-plus`,`iec-c13`,`iec-c14`,`schuko-cee7`,`dc-5525`,`usb-c`,`usb-a`,`audio-35mm`]).describe(`Physical connector interface type.`),Oc=J(`100base-tx,1000base-t,2500base-t,5gbase-t,10gbase-t,10gbase-sr,10gbase-lr,10gbase-dac,25gbase-dac,poe-out,poe+,poe-out-af,poe-out-at,poe-out-bt-type3,poe-out-bt-type4,poe-in-af,poe-in-at,poe-in-bt-type3,poe-in-bt-type4,ac-mains,dc-power,usb-pd,usb-3.0,usb-3.1,audio-analog,serial-rs232,passthrough-coupler`.split(`,`)).describe(`Supported electrical, optical, or PoE protocol capability.`),kc=J([`input`,`output`,`bidirectional`]).describe(`Signal or electrical power flow direction.`),Ac=J([`upright`,`inverted`,`left`,`right`]).describe(`Physical orientation of the connector latch/keyway.`),jc=q({x_mm:G().min(-2e3).max(2e3).describe(`Horizontal offset in mm from the bottom-left corner of the face.`),y_mm:G().min(-3e3).max(3e3).describe(`Vertical offset in mm from the bottom-left corner of the face.`),orientation:Ac.default(`upright`)}).describe(`Local 2D coordinates on the device face in millimeters.`),Mc=q({port_id:W().min(1).max(128).describe(`Unique identifier of the port within the device.`),label:W().min(1).max(160).describe(`Human-readable silk-screened port label.`),face:Ec,connector_type:Dc,direction:kc,capabilities:K(Oc).max(32).default([]).describe(`Electrical, optical, or PoE capabilities supported by this port.`),coordinates:jc,is_passthrough_coupler:Ps().optional().describe(`True if this port is a passive front-to-rear feedthrough coupler.`)}).describe(`Explicit physical port definition with local millimeter coordinates.`),Nc=q({origin_x_mm:G().min(-2e3).max(2e3).describe(`X coordinate of the first port (column 0) in mm.`),origin_y_mm:G().min(-3e3).max(3e3).describe(`Y coordinate of the first port (row 0) in mm.`),columns:G().int().positive().max(64).describe(`Number of horizontal port columns in the matrix (1..64).`),rows:G().int().positive().max(16).describe(`Number of vertical port rows in the matrix (1..16).`),pitch_x_mm:G().min(-500).max(500).describe(`Horizontal center-to-center spacing between adjacent columns in mm.`),pitch_y_mm:G().min(-500).max(500).describe(`Vertical center-to-center spacing between adjacent rows in mm.`)}).describe(`2D grid layout parameters for automatic port matrix expansion.`),Pc=q({id_prefix:W().min(1).max(64).describe(`Prefix for generated port_id values (e.g. "eth").`),label_prefix:W().max(96).optional().describe(`Prefix for generated human-readable labels.`),start_index:G().int().nonnegative().max(1e4).default(1).describe(`Starting numeric suffix for generated port IDs (default: 1).`),count:G().int().positive().max(128).describe(`Total number of ports to generate in this group (1..128).`),face:Ec,connector_type:Dc,direction:kc,capabilities:K(Oc).max(32).default([]).describe(`Capabilities assigned to every port generated by this group.`),orientation:Ac.default(`upright`),is_passthrough_coupler:Ps().optional().describe(`True if generated ports are passive front-to-rear couplers.`),grid:Nc}).describe(`Declarative port matrix macro expanded into flat PortDefinition items on load.`),Fc=q({u_height:G().nonnegative().max(60).describe(`Nominal height in Rack Units (1U = 44.45mm, max 60U).`),width_mm:G().positive().max(1e3).describe(`Physical chassis body width in millimeters (max 1000mm).`),height_mm:G().positive().max(3e3).describe(`Physical chassis height in millimeters (max 3000mm).`),depth_mm:G().positive().max(2e3).describe(`Physical chassis depth in millimeters along the Z-axis (max 2000mm).`),ear_mount_style:Cc.default(`flush-front`),front_protrusion_mm:G().nonnegative().max(500).default(0).describe(`Protrusion in front of Z=0 (handles, ears, knobs) in mm.`),rear_protrusion_mm:G().nonnegative().max(500).default(0).describe(`Protrusion behind depth_mm (fans, PSU handles) in mm.`),weight_grams:G().nonnegative().max(5e5).default(0).describe(`Total device mass in grams for Center of Gravity calculation.`),has_cable_pass_through:Ps().optional().describe(`True if cables can pass front-to-rear through this unit.`)}).describe(`Physical 3D bounding dimensions and mass specification.`),Ic=q({electrical_role:wc,idle_watts:G().nonnegative().max(1e5).default(0).describe(`Idle power draw in watts.`),max_system_watts:G().nonnegative().max(1e5).default(0).describe(`Peak own system power consumption in watts (excluding PoE output).`),poe_budget_watts:G().nonnegative().max(1e5).optional().describe(`Maximum total PoE output power budget in watts for PSE switches.`),ups_capacity_watts:G().positive().max(1e5).optional().describe(`Maximum output load capacity in watts for UPS units.`),pdu_capacity_watts:G().positive().max(1e5).optional().describe(`Maximum output load capacity in watts for PDU units.`),airflow:Tc.default(`passive-convection`),noise_db_a:G().nonnegative().max(200).optional().describe(`Acoustic noise emission in dB(A) at 1 meter distance.`)}).describe(`Electrical power consumption, PoE budget, thermal airflow, and acoustic dB(A) characteristics.`),Lc=q({x:G().min(-2e3).max(2e3).describe(`Local X offset from carrier origin in mm.`),y:G().min(-3e3).max(3e3).describe(`Local Y offset from carrier origin in mm.`),z:G().min(-2e3).max(2e3).default(0).describe(`Local Z offset from carrier origin in mm.`)}).describe(`Local 3D offset of a sub-module slot relative to its parent carrier.`),Rc=q({width:G().positive().max(2e3).describe(`Maximum allowed child width in mm.`),height:G().positive().max(3e3).describe(`Maximum allowed child height in mm.`),depth:G().positive().max(2e3).describe(`Maximum allowed child depth in mm.`)}).describe(`Maximum internal bounding dimensions of a carrier slot in mm.`),zc=q({slot_id:W().min(1).max(100).describe(`Unique slot identifier within the carrier.`),accepted_slot_type:W().min(1).max(100).describe(`Required child slot_compatibility token (e.g. "mini-pc-1liter").`),offset_mm:Lc,max_dimensions_mm:Rc}).describe(`Sub-U carrier bay specification for modular child devices.`),Bc=J([`matte-black-steel`,`coated-aluminum`,`3d-printed-petg`,`3d-printed-abs`,`polycarbonate`]).describe(`Surface material shader preset for 3D procedural rendering.`),Vc=q({chassis_color_hex:W().regex(/^#[0-9A-Fa-f]{6}$/).default(`#E5E7EB`).describe(`Primary chassis hex color code.`),material_preset:Bc.default(`matte-black-steel`),has_oled_display:Ps().default(!1).describe(`True if the front panel includes a status OLED screen.`),stl_mesh_path:W().max(512).nullable().default(null).describe(`Optional relative path to custom 3D mesh (.stl/.glb).`)}).describe(`Visual rendering metadata for 2D SVG and 3D WebGL pipelines.`),Hc=q({filament_grams:G().nonnegative().max(5e4).describe(`Estimated filament mass in grams.`),material_recommendation:W().max(128).default(`PETG`).describe(`Recommended 3D printing filament material (e.g. "PETG", "ABS", "ASA").`),heat_set_inserts:W().max(256).optional().describe(`Optional specification of required brass heat-set inserts.`),fasteners:W().max(256).optional().describe(`Optional specification of required mounting screws and cage nuts.`),printables_url:W().url().max(512).regex(/^https?:\/\//i,`Reference URL must use http:// or https://`).optional().describe(`Optional HTTPS reference URL to an upstream 3D model repository.`)}).nullable().default(null).describe(`3D printing fabrication metadata for printable modular carriers.`),Uc=q({slug:W().min(1).max(100).regex(/^[a-z0-9-]+$/,`Hardware slug must be lowercase kebab-case`).describe(`Unique lowercase kebab-case hardware identifier (vendor-model-variant).`),manufacturer:W().min(1).max(160).describe(`Hardware manufacturer name.`),model:W().min(1).max(160).describe(`Hardware model name or part number.`),description:W().max(2e3).optional().describe(`Human-readable explanation of what the device is, its role in the rack, and its physical mounting method (e.g. native rack ears vs. 3D-printed carrier/cradle).`),category:xc,mount_type:Sc,slot_compatibility:W().max(100).optional().describe(`Slot compatibility token when mount_type is "sub-module".`),is_passthrough_coupler:Ps().optional().describe(`True if the entire unit acts as a passive front-to-rear feedthrough patch panel.`),geometry:Fc,power_and_thermal:Ic,port_groups:K(Pc).max(16).default([]).describe(`Optional repeating port grid macros expanded into flat ports[] upon registration.`),ports:K(Mc).max(256).default([]).describe(`Explicit physical ports with local face millimeter coordinates.`),slots:K(zc).max(32).default([]).describe(`Sub-module carrier bays when mount_type is "modular-carrier".`),visuals:Vc.default({chassis_color_hex:`#E5E7EB`,material_preset:`matte-black-steel`,has_oled_display:!1,stl_mesh_path:null}),printable_metadata:Hc}).describe(`Complete hardware catalog blueprint specification.`),Wc=J([`19inch`,`10inch`,`6inch`]).describe(`EIA-310-D or homelab rack width standard.`),Gc=J([`open-frame`,`closed-glass-front`,`closed-vented-front`]).describe(`Physical rack enclosure style governing front door clearance checks.`),Kc=q({standard:Wc,u_height:G().int().positive().max(60).describe(`Total vertical rack capacity in Rack Units (U / HE, 1..60).`),rail_depth_mm:G().positive().max(2e3).describe(`Distance from front mounting rail face (Z=0) to rear mounting rail face in mm (max 2000mm).`),enclosure_type:Gc.default(`open-frame`),front_door_clearance_mm:G().nonnegative().max(1e3).default(45).describe(`Available clearance in front of Z=0 before hitting the front door in mm.`),rear_clearance_mm:G().nonnegative().max(1e3).default(40).describe(`Available clearance behind Z=rail_depth_mm in mm.`)}).describe(`Physical rack frame dimensions and enclosure configuration.`),qc=q({instance_id:W().min(1).max(100).describe(`Unique project-wide instance identifier for the child device.`),blueprint_slug:W().min(1).max(100).describe(`Hardware catalog blueprint slug for the child sub-module.`),slot_id:W().min(1).max(100).describe(`Target slot_id inside the parent modular carrier.`),hostname:W().max(160).optional().describe(`Optional logical hostname or label.`)}).describe(`Sub-module device mounted inside a specific slot of a parent carrier.`),Jc=q({instance_id:W().min(1).max(100).describe(`Unique project-wide instance identifier for the mounted equipment.`),blueprint_slug:W().min(1).max(100).describe(`Hardware catalog blueprint slug.`),u_position:G().int().positive().max(60).describe(`Lowest 1-indexed Rack Unit (U) occupied by this device.`),face:Ec.default(`front`),hostname:W().max(160).optional().describe(`Optional logical hostname or label.`),children:K(qc).max(32).default([]).describe(`Child sub-modules mounted inside this carrier.`)}).describe(`Equipment mounted directly onto a rack unit.`),Yc=q({instance_id:W().min(1).max(100).describe(`Target device instance_id (top-level or child sub-module).`),port_id:W().min(1).max(128).describe(`Target port_id on the device.`),face:Ec.optional().describe(`Explicit rack face selector (used to distinguish front vs rear connections on passthrough couplers).`)}).describe(`Source or destination port endpoint of a physical cable.`),Xc=J([`cat6a`,`cat6a-angled`,`cat6`,`cat6-angled`,`cat5e`,`cat5e-angled`,`sfp-plus-dac`,`sfp-plus-dac-angled`,`fiber-lc-duplex`,`fiber-lc-duplex-angled`,`rj45-serial-rollover`,`rj45-serial-rollover-angled`,`power-c13-c14`,`power-c13-c14-angled`,`power-schuko-c13`,`power-schuko-c13-angled`,`power-dc-5525`,`power-dc-5525-angled`,`power-usb-c`,`power-usb-c-angled`]).describe(`Standardized physical cable and connector assembly type.`),Zc=J([`shortest-direct`,`left-duct`,`right-duct`]).default(`shortest-direct`).describe(`Physical cable routing strategy: shortest-direct (default collision-free L/C-route minimizing cable length and bends) or explicit side-duct detour (left-duct / right-duct) when requested by the user.`),Qc=q({cable_id:W().min(1).max(128).describe(`Unique identifier for the cable connection.`),from:Yc,to:Yc,cable_type:Xc,color_hex:W().regex(/^#[0-9A-Fa-f]{6}$/).default(`#3B82F6`).describe(`Hex color code for 2D/3D cable visualization.`),label:W().max(240).optional().describe(`Optional cable label or circuit tag.`),vlan_id:G().int().min(1).max(4094).optional().describe(`Optional IEEE 802.1Q primary VLAN ID carried on this link (1..4094).`),ip_cidr:W().max(64).optional().describe(`Optional IPv4/IPv6 subnet or interface CIDR annotation (e.g. "10.10.20.0/24").`),preferred_portal_u:G().int().positive().max(60).optional().describe(`Optional 1-indexed U hint for front-to-rear cable portal routing.`),routing_mode:Zc.optional().describe(`Optional routing strategy override: defaults to shortest-direct (shortest collision-free path); set to left-duct or right-duct only when the user explicitly requests routing via a side cable duct.`)}).describe(`Point-to-point physical cable connection between two ports.`),$c=J([`poe-camera`,`wifi-ap`,`wall-outlet-pc`,`projector-media`,`workstation-dock`,`iot-controller`,`isp-wan-uplink`,`other-lan`]).describe(`Physical category of an external building or room drop entering the rack from outside.`),el=J([`top-rear`,`bottom-rear`]).default(`top-rear`).describe(`Rear building cable conduit entry point into the rack frame.`),tl=J([`100m`,`1gbe`,`2.5gbe`,`10gbe`]).default(`1gbe`).describe(`Required Ethernet link speed for the external room/device drop.`),nl=q({endpoint_id:W().min(1).max(100).describe(`Unique project-wide identifier for the external building/room drop (e.g., "cam-01", "ap-eg-01", "room-office-pc").`),label:W().min(1).max(200).describe(`Human-readable label shown on cable badges and patching instructions (e.g., "Kamera 1 – Einfahrt", "Büro – Workstation").`),category:$c.default(`other-lan`),room_or_zone:W().max(160).optional().describe(`Optional building zone or room name (e.g., "Außenbereich", "EG Wohnzimmer", "OG Büro", "Heimkino").`),poe_draw_watts:G().nonnegative().max(200).default(0).describe(`Required PoE power draw in watts (0 for non-PoE LAN drops; e.g., 9W for PoE camera, 18W for Wi-Fi 7 AP).`),required_speed:tl,entry_position:el,patch_panel_instance_id:W().min(1).max(100).describe(`Target patch panel instance_id where the incoming building cable is punched down on the rear face.`),patch_panel_port_id:W().min(1).max(128).describe(`Target port_id on the patch panel rear face (e.g., "p1" .. "p24").`),color_hex:W().regex(/^#[0-9A-Fa-f]{6}$/).default(`#38BDF8`).describe(`Hex color code for the external cable drop and its front patch guide.`),vlan_id:G().int().min(1).max(4094).optional().describe(`Optional IEEE 802.1Q VLAN ID assigned to this room/device drop (1..4094).`),notes:W().max(1e3).optional().describe(`Optional user-facing installation note.`)}).describe(`External building/house cable drop entering from outside the rack and terminating on the rear of a patch panel (consuming 0U of rack space).`),rl=q({schema_version:Zs(`1.0`).default(`1.0`),project_name:W().min(1).max(160).describe(`Human-readable name of the rack layout project.`),rack:Kc,mounted_devices:K(Jc).max(120).default([]),cables:K(Qc).max(512).default([]),external_endpoints:K(nl).max(256).default([]).describe(`External building/room cable drops (PoE cameras, Wi-Fi APs, room wall outlets) entering from the rear conduit onto a patch panel.`)}).describe(`Root declarative Rack-as-Code state schema (rack.yaml).`),il=J([`ERROR`,`WARNING`,`INFO`]).describe(`Severity level of the engineering constraint diagnostic.`),al=J([`CHASSIS_COLLISION`,`PLUG_CLEARANCE_COLLISION`,`FRONT_DOOR_COLLISION`,`SLOT_DIMENSION_OVERFLOW`,`SLOT_INCOMPATIBLE`,`OUT_OF_RACK_BOUNDS`,`BLUEPRINT_NOT_FOUND`,`PORT_NOT_FOUND`,`PORT_ALREADY_OCCUPIED`,`CONNECTOR_INCOMPATIBLE`,`SIGNAL_PROTOCOL_INCOMPATIBLE`,`SPEED_MISMATCH`,`POE_BUDGET_EXCEEDED`,`POE_CLASS_EXCEEDED`,`UPS_OVERLOAD`,`UNPOWERED_DEVICE`,`TOP_HEAVY_RACK`,`NO_FRONT_TO_REAR_PORTAL`,`THERMAL_AIRFLOW_CONFLICT`,`THERMAL_HOTSPOT_STACKING`,`ACOUSTIC_NOISE_HIGH`]).describe(`Machine-readable deterministic validation diagnostic code.`),ol=q({action_type:J([`move_device`,`change_cable_type`,`connect_power`,`disconnect_cable`,`redistribute_poe`,`add_portal_gap`,`change_rack_depth`]).describe(`Recommended self-correction operation category.`),target_instance_id:W().optional().describe(`Device instance_id targeted by this remediation action.`),target_cable_id:W().optional().describe(`Cable connection cable_id targeted by this remediation action.`),suggested_u_positions:K(G().int().positive()).optional().describe(`Candidate 1-indexed U positions that resolve the spatial conflict.`),suggested_face:Ec.optional(),suggested_cable_type:W().optional().describe(`Suggested replacement cable_type (e.g. angled plug or higher speed grade).`),description:W().describe(`Human- and agent-readable explanation of the remediation step.`)}).describe(`Structured self-correction action for autonomous agent remediation.`),sl=q({code:al,severity:il,stage:G().int().min(1).max(5).optional().describe(`Validation pipeline stage (1..5) that produced this finding.`),affected_instances:K(W()).describe(`Device instance IDs involved in this diagnostic issue.`),u_range:Ks([G().int(),G().int()]).optional().describe(`Inclusive [start_u, end_u] range where the issue occurs.`),message:W().describe(`Detailed engineering explanation with exact millimeter/watt figures.`),remediation_suggestions:K(W()).min(1).describe(`Actionable self-correction instructions for the calling LLM agent.`),remediation_actions:K(ol).optional().describe(`Optional machine-actionable remediation descriptors.`)}).describe(`Single validation finding with deterministic self-correction feedback.`),cl=q({pse_instance_id:W().describe(`Instance ID of the PoE Power Sourcing Equipment (PSE) switch.`),poe_budget_watts:G().describe(`Maximum rated PoE output power budget of the switch in watts.`),consumed_poe_watts:G().describe(`Total PoE power drawn by connected Powered Devices (PDs) in watts.`),remaining_poe_watts:G().describe(`Remaining available PoE power budget in watts (negative if overloaded).`),downstream_devices:K(W()).describe(`Instance or endpoint IDs of downstream PoE consumers powered by this switch.`)}).describe(`PoE budget utilization breakdown for a single PSE switch.`),ll=q({source_instance_id:W().describe(`Instance ID of the upstream PDU or UPS unit.`),role:J([`pdu`,`ups`]).describe(`Electrical source classification ("pdu" or "ups").`),capacity_watts:G().describe(`Maximum rated output capacity of the power source in watts.`),total_load_watts:G().describe(`Cumulative downstream system and PoE load in watts.`),utilization_percent:G().describe(`Percentage of rated watt capacity consumed (0..100+).`)}).describe(`Load and capacity summary for a mounted PDU or UPS unit.`),ul=q({status:J([`VALID`,`INVALID`]).describe(`Overall rack validation state ("VALID" when error_count is 0).`),is_valid:Ps().describe(`True when zero ERROR-level diagnostic issues exist.`),error_count:G().int().nonnegative().describe(`Total number of blocking ERROR diagnostics.`),warning_count:G().int().nonnegative().describe(`Total number of non-blocking WARNING diagnostics.`),issues:K(sl).describe(`List of all detected ERROR, WARNING, and INFO diagnostic issues.`),power_summary:q({total_system_watts:G().describe(`Total peak system power draw across all mounted equipment in watts.`),total_poe_watts:G().describe(`Total PoE power draw across all connected PoE devices and external drops in watts.`),pse_budgets:K(cl).describe(`Per-switch PoE budget utilization breakdown.`),power_sources:K(ll).describe(`Per-PDU and per-UPS electrical load breakdown.`),unpowered_active_instances:K(W()).describe(`Active device instance IDs missing a valid AC, DC, USB-C, or PoE power input.`)}).describe(`Aggregated electrical and PoE DAG power analysis.`),mechanical_summary:q({total_weight_grams:G().describe(`Total mass of all mounted equipment in grams.`),center_of_gravity_y_mm:G().describe(`Vertical Center of Gravity height from bottom of U1 in millimeters.`),normalized_cog_y:G().describe(`Normalized vertical Center of Gravity ratio (0.0 = bottom, 1.0 = top; keep <= 0.50).`),available_portal_u_positions:K(G().int()).describe(`1-indexed U slots that allow front-to-rear cable pass-through (open U or brush panel).`),total_thermal_btu_hr:G().default(0).describe(`Total peak thermal dissipation in BTU/hr (1W = 3.41214 BTU/hr).`),combined_noise_db_a:G().default(0).describe(`Logarithmic sum of acoustic noise emissions in dB(A) across all mounted devices.`),airflow_profile:J([`uniform-front-to-rear`,`uniform-passive`,`hybrid-active-passive`,`mixed-conflict`]).default(`uniform-passive`).describe(`Rack-wide thermal airflow regime classification.`)}).describe(`Aggregated mechanical mass, center of gravity, thermal BTU/hr, and acoustic dB(A) metrics.`)}).describe(`Complete 5-stage deterministic validation report.`),dl=.001;function Y(e){return Math.round((e+2**-52)*1e4)/1e4}function X(e){return Math.round((e+2**-52)*100)/100}function fl(e){return Math.round((e+2**-52)*10)/10}function pl(e){let t=[],n=e.label_prefix??e.id_prefix;for(let r=0;r<e.count;r++){let i=e.start_index+r,a=r%e.grid.columns,o=Math.floor(r/e.grid.columns),s=Y(e.grid.origin_x_mm+a*e.grid.pitch_x_mm),c=Y(e.grid.origin_y_mm+o*e.grid.pitch_y_mm),l={port_id:`${e.id_prefix}${i}`,label:`${n}${i}`,face:e.face,connector_type:e.connector_type,direction:e.direction,capabilities:[...e.capabilities],coordinates:{x_mm:s,y_mm:c,orientation:e.orientation},...e.is_passthrough_coupler===void 0?{}:{is_passthrough_coupler:e.is_passthrough_coupler}};t.push(l)}return t}function ml(e){let t=Uc.parse(e),n=new Map;for(let e of t.port_groups){let t=pl(e);for(let e of t)n.set(e.port_id,e)}for(let e of t.ports)n.set(e.port_id,e);return{...t,ports:Array.from(n.values())}}var hl=J([`rackmount-19`,`rackmount-10`,`rackmount-6`,`sub-module`,`shelf-standing`,`10inch`,`19inch`,`6inch`]).describe(`Hardware form factor or mounting mechanism filter.`),gl=q({query:W().max(200).optional().describe(`Optional case-insensitive substring filter matching slug, manufacturer, or model name (omit to match all).`),form_factor:hl.optional().describe(`Primary rack width or mounting form-factor filter (shorthands "10inch", "19inch", and "6inch" match both direct rackmount equipment and modular carriers of that width).`),mount_type:hl.optional().describe(`Optional alias for form_factor to filter by physical mounting style ("rackmount-10", "rackmount-19", "rackmount-6", "sub-module", or "shelf-standing"); combined with logical AND if both are provided.`),category:xc.optional().describe(`Functional hardware category filter (e.g., "switch", "router", "ups", "pdu", "patch-panel", "modular-carrier", "mini-pc", "sbc").`),max_depth_mm:G().positive().max(2e3).optional().describe(`Maximum allowed chassis depth in millimeters (inclusive upper bound).`),min_poe_budget_watts:G().nonnegative().max(1e5).optional().describe(`Minimum required PSE PoE output power budget in watts (inclusive lower bound).`),accepted_slot_type:W().min(1).max(100).optional().describe(`Sub-module slot compatibility token matching either a sub-module slot_compatibility or a carrier slot accepted_slot_type (e.g., "mini-pc-1liter", "sbc-rpi5", "standard-keystone").`)}),_l=q({slug:W().min(1).max(100).describe(`Exact lowercase kebab-case hardware catalog blueprint slug to retrieve (discoverable via search_catalog).`)}),vl=q({blueprint:Uc.describe(`Complete custom hardware blueprint specification; ports may be defined via explicit ports[], repeating port_groups[] macros, or both.`)}),yl=q({project_name:W().min(1).max(160).default(`Rack Project`).describe(`Human-readable project name stored in rack.yaml.`),standard:Wc.describe(`Mechanical rack width standard ("19inch" = 482.6mm, "10inch" = 254.0mm, "6inch" = 152.4mm).`),u_height:G().int().positive().max(60).describe(`Total usable vertical rack height in Rack Units (1U = 44.45mm, 1..60U).`),rail_depth_mm:G().positive().max(2e3).describe(`Front-to-rear mounting rail depth in millimeters along the Z-axis (max 2000mm).`),enclosure_type:Gc.default(`open-frame`).describe(`Enclosure door style ("open-frame", "closed-glass-front", or "closed-vented-front").`),front_door_clearance_mm:G().nonnegative().max(1e3).default(45).describe(`Available clearance in millimeters between front mounting rails (Z=0) and a closed front door.`),rear_clearance_mm:G().nonnegative().max(1e3).default(40).describe(`Available clearance in millimeters behind the rear mounting rails (Z=rail_depth_mm) for power plugs and bending radii.`)}),bl=q({instance_id:W().min(1).max(100).describe(`Unique project-wide instance identifier for this mounted device (e.g., "ups-u1", "sw-core-01").`),blueprint_slug:W().min(1).max(100).describe(`Catalog or custom hardware blueprint slug to instantiate.`),hostname:W().max(160).optional().describe(`Optional logical hostname or display label shown in elevations and schematics.`),u_position:G().int().positive().max(60).optional().describe(`1-indexed lowest Rack Unit (U) when mounting directly onto the rack rails (mutually exclusive with parent_carrier_id/slot_id).`),face:Ec.optional().default(`front`).describe(`Target rack mounting face ("front" or "rear") for direct rackmount equipment.`),parent_carrier_id:W().max(100).optional().describe(`Mounted parent modular-carrier instance_id when mounting a sub-module (requires slot_id; mutually exclusive with u_position).`),slot_id:W().max(100).optional().describe(`Target bay slot_id inside parent_carrier_id when mounting a sub-module (e.g., "left-bay", "keystone-1").`)}),xl=q({instance_id:W().min(1).max(100).describe(`Existing mounted device or child sub-module instance_id to modify.`),action:J([`move`,`rename`,`remove`]).describe(`Modification operation: "move" relocates a device, "rename" updates its hostname, and "remove" deletes the device instance.`),u_position:G().int().positive().max(60).optional().describe(`New 1-indexed U position when action is "move" on a direct rackmount device (takes precedence over new_u_position).`),new_u_position:G().int().positive().max(60).optional().describe(`Optional alias for u_position when action is "move".`),face:Ec.optional().describe(`New mounting face ("front" or "rear") when action is "move" on a rackmount device (takes precedence over new_face).`),new_face:Ec.optional().describe(`Optional alias for face when action is "move".`),parent_carrier_id:W().min(1).max(100).optional().describe(`Target parent carrier instance_id when action is "move" on a child sub-module.`),slot_id:W().min(1).max(100).optional().describe(`Target slot_id inside parent_carrier_id when action is "move" on a child sub-module.`),hostname:W().min(1).max(160).optional().describe(`New logical hostname when action is "rename" (takes precedence over new_hostname).`),new_hostname:W().min(1).max(160).optional().describe(`Optional alias for hostname when action is "rename".`),remove_connected_cables:Ps().optional().default(!0).describe(`When action is "remove", whether to automatically disconnect all cables and external endpoints attached to the removed device (default: true).`)}),Sl=q({cables:K(Qc).min(1).max(128).describe(`Batch of one or more cable connections to upsert by cable_id, route in 3D, and validate (max 128 per call).`)}),Cl=q({cable_ids:K(W().min(1).max(128)).max(512).optional().describe(`Specific cable_id values to disconnect (can be combined with instance_id; at least one of cable_ids or instance_id must be provided).`),instance_id:W().max(100).optional().describe(`Mounted device or modular-carrier instance_id whose attached cables (including child sub-module cables) should all be disconnected.`)}),wl=q({}),Tl=q({formats:K(J([`elevation-svg`,`wiring-svg`,`bom-md`,`scene-glb`,`carrier-scad`,`carrier-stl`])).max(6).default([`elevation-svg`,`wiring-svg`,`bom-md`,`scene-glb`,`carrier-scad`,`carrier-stl`]).describe(`Deliverable formats to generate and write to disk (defaults to all 6 formats; carrier-scad and carrier-stl emit files when modular carriers are mounted).`),output_dir:W().max(512).optional().describe(`Optional target filesystem directory for generated files in local stdio mode (defaults to the directory of the active rack.yaml file; ignored on hosted remote MCP servers where HTTPS download URLs are returned instead).`)}),El=q({id_prefix:W().min(1).max(64).optional().describe(`Optional ID prefix for generated endpoints (e.g., "cam", "ap", "room").`),label_prefix:W().min(1).max(160).describe(`Human-readable label prefix (e.g., "Kamera", "WLAN Access Point", "Raum LAN").`),custom_labels:K(W().min(1).max(200)).max(96).optional().describe(`Optional per-item custom labels overriding numbered prefix (e.g., ["Büro – PC", "Heimkino – Beamer", "Studio – Workstation"]).`),category:$c.default(`other-lan`),room_or_zone:W().max(160).optional().describe(`Building zone or room name (e.g., "Außenbereich", "EG Wohnzimmer", "Wohnräume").`),count:G().int().positive().max(96).default(1).describe(`Number of external cable drops in this group (1..96).`),poe_draw_watts:G().nonnegative().max(200).default(0).describe(`PoE power draw in watts per drop (0 for standard LAN; e.g., 9 for PoE camera, 18 for Wi-Fi AP).`),required_speed:tl.optional().default(`1gbe`),color_hex:W().regex(/^#[0-9A-Fa-f]{6}$/).optional().describe(`Hex color code for this group of cables (defaults to category color if omitted).`),vlan_id:G().int().min(1).max(4094).optional().describe(`Optional IEEE 802.1Q VLAN ID assigned to this group.`)}),Dl=q({endpoint_id:W().min(1).max(100).optional().describe(`Optional explicit endpoint_id (auto-generated if omitted).`),label:W().min(1).max(200).describe(`Human-readable label for this room/device drop (e.g., "Kamera 1 – Einfahrt").`),category:$c.default(`other-lan`),room_or_zone:W().max(160).optional().describe(`Optional building zone or room name.`),poe_draw_watts:G().nonnegative().max(200).default(0).describe(`Required PoE power draw in watts (0 for non-PoE LAN).`),required_speed:tl.optional().default(`1gbe`),patch_panel_port_id:W().min(1).max(128).optional().describe(`Optional explicit patch panel port_id (e.g., "p1"); auto-assigned sequentially if omitted.`),color_hex:W().regex(/^#[0-9A-Fa-f]{6}$/).optional().describe(`Optional hex color code for this drop and its front patch cable.`),vlan_id:G().int().min(1).max(4094).optional().describe(`Optional VLAN ID (1..4094).`),notes:W().max(1e3).optional().describe(`Optional installation notes.`)}),Ol=q({patch_panel_instance_id:W().min(1).max(100).describe(`Mounted patch panel instance_id whose rear ports receive the incoming building cable drops.`),start_port_number:G().int().positive().max(256).optional().describe(`1-indexed starting port number on the patch panel (defaults to next free rear port or 1).`),entry_position:el.optional().default(`top-rear`),groups:K(El).max(24).optional().describe(`Batch groups of external drops (e.g., 10x PoE cameras, 5x Wi-Fi APs, 5x room LAN outlets).`),endpoints:K(Dl).max(128).optional().describe(`Individual external building/room drops to terminate on the rear of the patch panel.`),auto_connect_switch_instance_id:W().min(1).max(100).optional().describe(`Optional switch instance_id to automatically patch from the front of the patch panel using labeled Cat6A cables.`),auto_connect_switch_start_port:G().int().positive().max(256).optional().default(1).describe(`1-indexed starting Ethernet port number on auto_connect_switch_instance_id (e.g., 1 for eth1).`),clear_existing:Ps().optional().default(!1).describe(`If true, destructively clears existing external_endpoints (and their front patch cables) on patch_panel_instance_id before planning.`)}),kl=q({action:J([`undo`,`redo`]).describe(`History traversal direction: "undo" reverts the most recent state mutation, "redo" reapplies a reverted mutation.`)}),Al=J([`VALID`,`INVALID`]).describe(`Deterministic execution outcome: "VALID" when the operation succeeded with 0 validation errors; "INVALID" when precondition or engineering validation errors are present in issues[].`);function jl(e,t){return q({status:Al,summary:W().describe(`Concise human- and agent-readable summary of the tool result and validation status.`),data:e,issues:K(sl).describe(`Structured diagnostic findings (ERROR, WARNING, INFO) with actionable remediation_suggestions.`)}).describe(t)}var Ml=q({slug:W().describe(`Unique lowercase kebab-case hardware blueprint slug.`),manufacturer:W().describe(`Hardware manufacturer name.`),model:W().describe(`Hardware model name.`),category:xc,mount_type:Sc,u_height:G().describe(`Nominal height in Rack Units (U).`),width_mm:G().describe(`Chassis width in millimeters.`),height_mm:G().describe(`Chassis height in millimeters.`),depth_mm:G().describe(`Chassis depth in millimeters.`),weight_grams:G().describe(`Device mass in grams.`),electrical_role:wc,max_system_watts:G().describe(`Peak system power consumption in watts.`),poe_budget_watts:G().describe(`Available PSE PoE output budget in watts (0 if non-PSE).`),slot_compatibility:W().nullable().describe(`Sub-module slot compatibility token, or null for rackmount equipment.`),slots:K(q({slot_id:W().describe(`Carrier bay slot identifier.`),accepted_slot_type:W().describe(`Accepted child sub-module compatibility token.`),max_dimensions_mm:Rc})).describe(`Available carrier bays when mount_type is "modular-carrier".`),port_count:G().int().nonnegative().describe(`Total number of expanded physical ports.`)}).passthrough().describe(`Compact hardware blueprint summary returned by search_catalog.`),Nl=jl(q({count:G().int().nonnegative().describe(`Total number of catalog blueprints matching all supplied filter criteria.`),blueprints:K(Ml).describe(`Matching hardware blueprint summary records.`)}).passthrough().describe(`Catalog search result payload.`),`Structured result of search_catalog containing matching hardware blueprint summaries.`),Pl=jl(q({blueprint:Uc.optional().describe(`Complete hardware blueprint specification with port_groups pre-expanded into flat ports[].`),requested_slug:W().optional().describe(`Requested slug echoed when lookup fails with BLUEPRINT_NOT_FOUND.`)}).passthrough().describe(`Blueprint lookup result payload.`),`Structured result of get_device_blueprint containing the expanded hardware blueprint or lookup diagnostics.`),Fl=jl(q({slug:W().optional().describe(`Registered lowercase kebab-case blueprint slug.`),saved_path:W().nullable().optional().describe(`Absolute filesystem path of the persisted custom blueprint YAML file, or null if in-memory.`),blueprint:Uc.optional().describe(`Registered hardware blueprint with expanded port coordinates.`),validation_errors:K(Is()).optional().describe(`Schema validation details if the custom blueprint failed parsing.`)}).passthrough().describe(`Custom blueprint registration payload.`),`Structured result of define_custom_blueprint confirming persistence and expanded port geometry.`),Il=jl(q({rack:Kc.describe(`Initialized physical rack frame specification.`),geometry:q({total_height_mm:G().describe(`Total vertical mounting height in millimeters (u_height * 44.45).`),rail_depth_mm:G().describe(`Front-to-rear mounting rail depth in millimeters.`),panel_width_mm:G().describe(`Outer mounting ear panel width in millimeters.`),aperture_width_mm:G().describe(`Inner usable rail aperture width in millimeters.`)}).passthrough().describe(`Computed millimeter enclosure dimensions.`),validation:ul.describe(`Initial 5-stage validation report for the newly initialized empty rack.`)}).passthrough().describe(`Rack initialization payload.`),`Structured result of init_rack containing the new rack configuration, millimeter dimensions, and validation status.`),Ll=jl(q({mounted_device:Js(W(),Is()).nullable().optional().describe(`Computed 3D world bounding boxes (chassis and plug clearance) and global port coordinates for the mounted device.`),instance_id:W().optional().describe(`Target instance_id echoed when a pre-mount check fails.`),blueprint_slug:W().optional().describe(`Target blueprint_slug echoed when a pre-mount check fails.`),validation:ul.optional().describe(`Updated 5-stage validation report after mounting the device.`)}).passthrough().describe(`Equipment mounting result payload.`),`Structured result of mount_equipment with 3D world geometry and 5-stage validation diagnostics.`),Rl=jl(q({action:J([`move`,`rename`,`remove`]).optional().describe(`Modification operation that was executed.`),instance_id:W().describe(`Target mounted device or sub-module instance_id.`),updated_device:Js(W(),Is()).nullable().optional().describe(`Updated 3D world geometry of the device, or null if removed.`),removed_cable_ids:K(W()).optional().describe(`Cable IDs automatically disconnected when action is "remove".`),rerouted_cables:K(q({cable_id:W().describe(`Cable connection identifier.`),raw_arc_length_mm:G().describe(`Recalculated 3D spline arc length in mm.`),required_length_mm:G().describe(`Required cable length with slack in mm.`),recommended_commercial_mm:G().describe(`Standard commercial cable length bin in mm.`)}).passthrough()).optional().describe(`Recalculated 3D cable length summaries after moving or removing equipment.`),validation:ul.optional().describe(`Updated 5-stage validation report after the equipment modification.`)}).passthrough().describe(`Equipment modification result payload.`),`Structured result of modify_equipment with updated device geometry, rerouted cable lengths, and validation diagnostics.`),zl=jl(q({connected_cables:K(q({cable_id:W().describe(`Unique cable identifier.`),cable_type:Xc,route_case:W().describe(`Computed 3D spline routing topology class.`),raw_arc_length_mm:G().describe(`3D Catmull-Rom spline arc length in mm.`),required_length_mm:G().describe(`Required length including slack in mm.`),recommended_commercial_mm:G().describe(`Standard commercial patch cable length bin in mm.`),portal_u:G().nullable().optional().describe(`1-indexed U position of the front-to-rear cable portal if traversed.`),assigned_ducts:K(W()).optional().describe(`Cable ducts traversed along the route.`)}).passthrough()).describe(`Computed 3D spline route metrics and commercial SKU length bins for the connected cables.`),total_cables:G().int().nonnegative().describe(`Total number of active cables in the rack project.`),validation:ul.describe(`Updated 5-stage validation report including port, speed, PoE budget, and plug clearance checks.`)}).passthrough().describe(`Cable connection and 3D routing result payload.`),`Structured result of connect_cables containing 3D cable lengths, commercial length bins, and PoE/clearance diagnostics.`),Bl=jl(q({removed_cable_ids:K(W()).describe(`List of cable_id values that were disconnected.`),remaining_cables_count:G().int().nonnegative().describe(`Total number of cables remaining in the active rack project.`),validation:ul.optional().describe(`Updated 5-stage validation report after cable removal.`)}).passthrough().describe(`Cable disconnection result payload.`),`Structured result of disconnect_cables listing removed cable IDs and updated validation status.`),Vl=jl(q({added_endpoints_count:G().int().nonnegative().optional().describe(`Number of external building/room cable drops terminated on the patch panel rear ports.`),auto_patched_cables_count:G().int().nonnegative().optional().describe(`Number of front Cat6A patch cables automatically created to the target switch.`),total_external_endpoints:G().int().nonnegative().optional().describe(`Total external endpoints now configured in the rack project.`),patching_guide:K(q({step_number:G().int().positive().describe(`Sequential installation step number.`),endpoint_id:W().describe(`Unique external endpoint identifier.`),label:W().describe(`Human-readable room or device drop label.`),room_or_zone:W().describe(`Building zone or room name.`),poe_draw_watts:G().nonnegative().describe(`PoE power draw in watts for this drop.`),rear_punchdown:W().describe(`Rear patch panel port termination assignment.`),front_patch_cable:W().describe(`Front patch panel to switch port assignment.`),color_hex:W().describe(`Assigned cable hex color code.`)}).passthrough()).optional().describe(`Step-by-step rear punchdown and front switch patching schedule.`),patch_panel_instance_id:W().optional().describe(`Target patch_panel_instance_id echoed when a pre-check fails.`),auto_connect_switch_instance_id:W().optional().describe(`Target auto_connect_switch_instance_id echoed when a pre-check fails.`),validation:ul.optional().describe(`Updated 5-stage validation report including cumulative PoE load from external building drops.`)}).passthrough().describe(`External endpoint planning and auto-patching payload.`),`Structured result of plan_external_endpoints containing the rear punchdown/front patching schedule and PoE validation report.`),Hl=jl(q({is_valid:Ps().describe(`True when error_count is 0 across all 5 validation stages.`),ascii_elevation:W().describe(`Formatted ASCII front/rear rack elevation diagram, mounted device inventory, and power/PoE summary.`),validation:ul.describe(`Complete 5-stage deterministic validation report with issues and remediation_suggestions.`)}).passthrough().describe(`Rack state inspection and validation result payload.`),`Structured result of validate_rack containing the ASCII front/rear elevation diagram and full 5-stage diagnostic report.`),Ul=jl(q({output_dir:W().describe(`Resolved absolute directory path where deliverable files were written (or HTTPS base export endpoint when running on a hosted remote MCP server).`),live_viewer_url:W().optional().describe(`Interactive 3D/2D Web-Viewer URL bound live to this remote MCP session (present in hosted remote MCP mode).`),rack_yaml_url:W().optional().describe(`Direct HTTPS download URL for the session rack.yaml source of truth (present in hosted remote MCP mode).`),exported_files:K(q({format:W().describe(`Deliverable format identifier (e.g., "elevation-svg", "carrier-stl").`),path:W().describe(`Absolute filesystem path of the written file (or direct HTTPS download URL in hosted remote MCP mode).`),download_url:W().optional().describe(`Direct HTTPS download URL for this deliverable when connected to a hosted remote MCP server.`),filename:W().optional().describe(`Suggested local filename for saving the deliverable.`),size_bytes:G().int().nonnegative().describe(`Size of the generated deliverable in bytes.`)}).passthrough()).describe(`Metadata for each generated deliverable file or download URL.`),bom_summary:q({mounted_devices_count:G().int().nonnegative().describe(`Total mounted rack devices and carrier sub-modules.`),cables_count:G().int().nonnegative().describe(`Total routed cables.`),total_power_draw_watts:G().nonnegative().describe(`Total peak system power draw in watts.`),total_poe_draw_watts:G().nonnegative().describe(`Total PoE power draw in watts.`),total_poe_budget_watts:G().nonnegative().describe(`Total available PSE PoE budget in watts.`)}).passthrough().describe(`Summary counts and power totals included in the Bill of Materials.`),validation:ul.describe(`Current 5-stage validation report at the time of export.`)}).passthrough().describe(`Deliverable export result payload.`),`Structured result of export_deliverables listing written file paths, byte sizes, BOM summary, and validation status.`),Wl=jl(q({action:J([`undo`,`redo`]).describe(`History traversal direction that was requested.`),applied:Ps().describe(`True if a history snapshot was restored; false if the target history stack was empty.`),undo_available:G().int().nonnegative().describe(`Number of remaining undo snapshots available in memory.`),redo_available:G().int().nonnegative().describe(`Number of remaining redo snapshots available in memory.`),ascii_elevation:W().describe(`Updated ASCII front/rear rack elevation diagram after history traversal.`),validation:ul.describe(`Updated 5-stage validation report for the restored rack state.`)}).passthrough().describe(`Undo/redo history traversal result payload.`),`Structured result of undo_redo containing stack availability, updated ASCII elevation, and validation status.`),Gl={search_catalog:{name:`search_catalog`,title:`Search Hardware Blueprint Catalog`,description:`Search and filter the local hardware catalog to discover compatible rackmount devices, modular carriers, and sub-modules before mounting. All supplied filters combine with logical AND: 'form_factor' and its alias 'mount_type' accept width shorthands '10inch', '19inch', and '6inch' that match both direct rackmount gear and modular carriers, 'accepted_slot_type' matches both carrier bays and compatible sub-modules, and 'max_depth_mm' bounds chassis depth excluding plug clearance. Returns all matches from the bounded catalog in one unpaginated response sorted in deterministic registration order, with built-in blueprints followed by custom blueprints. Call with no arguments to list the full catalog; use get_device_blueprint to inspect expanded port coordinates for a known slug, or define_custom_blueprint to register unlisted hardware.`,inputSchema:gl,outputSchema:Nl,annotations:{readOnlyHint:!0,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},get_device_blueprint:{name:`get_device_blueprint`,title:`Retrieve Hardware Device Blueprint Details`,description:`Retrieve the complete hardware specification, millimeter port coordinates, electrical and PoE ratings, and carrier slot geometry for a single catalog blueprint. The 'slug' parameter requires a case-sensitive exact match in lowercase kebab-case vendor-model-variant format against the built-in or session custom catalog; partial substrings or uppercase characters do not match. Returns the full blueprint in one unpaginated payload with repeating port_groups pre-expanded into up to 256 flat ports[] entries, or returns status 'INVALID' with a BLUEPRINT_NOT_FOUND issue and candidate slugs instead of throwing. Use when you already know the target slug and need exact port_id or slot_id values for mount_equipment or connect_cables; use search_catalog instead to discover unknown slugs by criteria.`,inputSchema:_l,outputSchema:Pl,annotations:{readOnlyHint:!0,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},define_custom_blueprint:{name:`define_custom_blueprint`,title:`Register Custom Hardware Blueprint`,description:`Validate and register a custom hardware blueprint into the active catalog so unlisted equipment can be mounted. Pass the entire specification inside the top-level 'blueprint' object: 'blueprint.slug' must use lowercase kebab-case, ports may combine explicit 'ports[]' with repeating 'port_groups[]' macros whose coordinates fit strictly within 'blueprint.geometry' without overlapping, and 'slots[]' applies only when 'mount_type' is 'modular-carrier' whereas 'slot_compatibility' applies to 'sub-module'. Persists YAML to the local custom-catalog folder in stdio mode or session memory on remote servers, overwrites same-slug custom entries without touching mounted rack state or undo history, and returns status 'INVALID' instead of throwing on validation errors. Use only after search_catalog confirms hardware is unlisted; use mount_equipment instead to place an already registered blueprint into the rack.`,inputSchema:vl,outputSchema:Fl,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},init_rack:{name:`init_rack`,title:`Initialize and Reset Rack Enclosure`,description:`Initialize a new rack project and destructively reset the active rack.yaml state to an empty enclosure with the specified width standard, U height, and rail depth. Overwrites the current enclosure and clears all mounted devices, child sub-modules, cables, and external endpoints, while pushing the previous project state onto the in-memory undo stack for recovery via undo_redo. 'project_name' sets the title used in exported schematics and BOMs, 'rail_depth_mm' plus 'rear_clearance_mm' bounds total +Z chassis and rear plug depth before wall collision, and 'front_door_clearance_mm' is enforced only when 'enclosure_type' has a closed front door. Use when starting a rack design from scratch or changing enclosure dimensions; use validate_rack to inspect the current rack, or modify_equipment to move or remove individual devices.`,inputSchema:yl,outputSchema:Il,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!0,openWorldHint:!1,consequentialHint:!0}},mount_equipment:{name:`mount_equipment`,title:`Mount Equipment into Rack Unit or Carrier Slot`,description:`Mount a new hardware device instance onto a rack unit or into a modular carrier bay in the active rack.yaml project and run 5-stage validation. 'instance_id' must be unique across both top-level devices and nested sub-modules, 'blueprint_slug' must reference an existing catalog or custom slug, and placement uses two mutually exclusive modes: 'u_position' with optional 'face' where the device's full U span fits within 1..u_height, or 'parent_carrier_id' plus a compatible 'slot_id' for sub-modules. Precondition errors such as duplicate 'instance_id', unknown 'blueprint_slug', or missing carriers return status 'INVALID' without mutating state, whereas 3D collision or PoE issues persist the mount, push an undo snapshot, and return remediation_suggestions. Use to add a new device instance; use modify_equipment to move, rename, or remove an existing instance, or plan_external_endpoints for off-rack room cable drops.`,inputSchema:bl,outputSchema:Ll,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!1,openWorldHint:!1}},modify_equipment:{name:`modify_equipment`,title:`Move, Rename, or Remove Mounted Equipment`,description:`Move, rename, or destructively remove an existing mounted device or child sub-module in the active rack, recalculate 3D cable splines, and re-run 5-stage validation. 'instance_id' resolves across top-level devices and carrier sub-modules, and required fields depend on 'action': 'move' updates 'u_position' and 'face' on rackmount gear or 'slot_id' and optional 'parent_carrier_id' across carriers for sub-modules with primary fields taking precedence over 'new_*' aliases, 'rename' updates or clears 'hostname', and 'remove' cascades to child sub-modules plus attached cables and external endpoints when 'remove_connected_cables' is true. Pushes the prior state onto the undo stack and updates rack.yaml atomically, or returns status 'INVALID' without mutating state when 'instance_id' or a target carrier is unknown. Use to update or delete a mounted instance; use mount_equipment to add new hardware, or disconnect_cables to remove cables while keeping devices mounted.`,inputSchema:xl,outputSchema:Rl,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!1,openWorldHint:!1,consequentialHint:!0}},connect_cables:{name:`connect_cables`,title:`Connect and Route Inter-Device Cables`,description:`Connect or update a batch of up to 128 power and network cables between mounted device ports in the active rack, computing 3D Catmull-Rom splines, commercial length bins, and PoE or power budgets. Each entry in 'cables[]' upserts in place by 'cable_id' while leaving all other cables and mounted equipment untouched, pushes a recoverable undo snapshot, and persists rack.yaml atomically; port, speed, PoE, or clearance violations return status 'INVALID' with remediation_suggestions instead of throwing. Within each cable, endpoint 'face' is required only on pass-through couplers such as patch panels exposing identical 'port_id' values on both faces, 'preferred_portal_u' applies only to front-to-rear transitions, and 'vlan_id' or 'ip_cidr' annotate logical network links. Use when both endpoint devices are mounted inside the rack; use disconnect_cables to remove cables, or plan_external_endpoints to terminate incoming building cable drops on a patch panel.`,inputSchema:Sl,outputSchema:zl,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},disconnect_cables:{name:`disconnect_cables`,title:`Disconnect Cables by ID or Device Instance`,description:`Remove specific cables by identifier or strip all cables attached to a mounted device or modular carrier from the active rack, then re-evaluate PoE budgets and plug clearances. Supply a non-empty 'cable_ids' list, 'instance_id', or both to disconnect their union; 'instance_id' matches both 'from' and 'to' endpoints across a carrier and its child sub-modules while leaving external patch-panel drops intact, whereas omitting both or passing only an empty list returns status 'INVALID' with a PORT_NOT_FOUND issue and zero mutations. Valid calls push an undo snapshot, persist rack.yaml atomically, and return removed IDs, remaining cable count, and updated validation results, succeeding idempotently when targeted IDs are already absent. Use when rewiring ports while keeping hardware mounted; use connect_cables to add or replace cables, or modify_equipment with action 'remove' to delete a device and its cables.`,inputSchema:Cl,outputSchema:Bl,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!0,openWorldHint:!1}},plan_external_endpoints:{name:`plan_external_endpoints`,title:`Terminate External Building Cable Drops on Patch Panel`,description:`Terminate external building or room cable drops onto the rear RJ45 ports of a mounted patch panel without consuming rack U slots, and optionally auto-create labeled Cat6A front patch cables to a mounted switch. 'groups[]' batch-generates drops first—with 'custom_labels[]' overriding numbered 'label_prefix' entries per index—followed by 'endpoints[]', allocating sequential free rear ports from 'start_port_number' and sequential free switch RJ45 ports from 'auto_connect_switch_start_port'. Setting 'clear_existing' destructively removes prior external drops on 'patch_panel_instance_id' and their front patch cables before allocation, while unmounted patch-panel or switch IDs return status 'INVALID' without mutating state. Use for off-rack building wiring entering the enclosure; never mount room endpoints via mount_equipment, and use connect_cables for purely internal rack-to-rack links.`,inputSchema:Ol,outputSchema:Vl,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!1,openWorldHint:!1}},validate_rack:{name:`validate_rack`,title:`Inspect and Validate Active Rack State`,description:`Inspect the active rack.yaml state and run all 5 deterministic validation stages covering mechanical bounds, 3D depth and plug clearances, PoE and power budgets, cable compatibility, and thermal limits. Takes no parameters, performs zero state or undo-stack mutations, and returns the ASCII front and rear elevation diagram, power utilization summary, and all diagnostic issues with remediation_suggestions. Sets status to 'INVALID' instead of throwing whenever any validation ERROR is present. Use to inspect currently mounted equipment or verify zero errors before exporting; use export_deliverables instead to generate SVG, BOM, GLB, or 3D-print files.`,inputSchema:wl,outputSchema:Hl,annotations:{readOnlyHint:!0,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},export_deliverables:{name:`export_deliverables`,title:`Export 2D SVG, BOM, 3D GLB, and 3D-Print Deliverables`,description:`Generate 2D elevation and wiring SVGs, a Markdown BOM, a binary 3D GLB scene, and parametric OpenSCAD or watertight STL 3D-print models for the active rack project. Omitting 'formats' exports all six types; 'carrier-scad' and 'carrier-stl' emit one file per mounted modular carrier, switch cradle, or printable cover panel and emit zero files when none are mounted, while 'output_dir' resolves relative paths within the project directory and creates missing folders. Local stdio execution writes deterministic filenames—elevation.svg, wiring-schematic.svg, BOM.md, rack-scene.glb, and <slug>.scad or <slug>.stl—overwriting same-named files in place, whereas hosted remote sessions stream in-memory HTTPS download URLs; neither mode mutates rack state or undo history. Use after validate_rack confirms a valid layout; use validate_rack instead for read-only validation and ASCII elevation inspection without generating export files.`,inputSchema:Tl,outputSchema:Ul,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!0,openWorldHint:!1,consequentialHint:!0}},undo_redo:{name:`undo_redo`,title:`Undo or Redo Rack State Mutation`,description:`Traverse the per-project in-memory history ring buffer of up to 50 snapshots to revert the latest rack mutation or reapply a reverted mutation, updating rack.yaml atomically. Setting 'action' to 'undo' steps backward across rack-state mutations—excluding catalog-only define_custom_blueprint calls and read-only tools—and pushes the displaced state onto the redo stack, whereas 'redo' is available only immediately after 'undo' because any new rack mutation flushes the redo stack. Calling either action when its target stack is empty is a safe no-op returning applied=false without throwing. Use to roll back an unintended batch change or accidental init_rack reset; use modify_equipment or disconnect_cables instead to edit specific items without reverting intermediate steps.`,inputSchema:kl,outputSchema:Wl,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!1,openWorldHint:!1}}};function Z(e,t,n){return{x:Y(e),y:Y(t),z:Y(n)}}function Kl(e,t){return Z(e.x+t.x,e.y+t.y,e.z+t.z)}function ql(e,t){return Z(e.x*t,e.y*t,e.z*t)}function Jl(e,t){let n=e.x-t.x,r=e.y-t.y,i=e.z-t.z;return Math.sqrt(n*n+r*r+i*i)}function Yl(e,t){return{min:Z(Math.min(e.x,t.x),Math.min(e.y,t.y),Math.min(e.z,t.z)),max:Z(Math.max(e.x,t.x),Math.max(e.y,t.y),Math.max(e.z,t.z))}}function Xl(e,t,n=dl){let r=Math.min(e.max.x,t.max.x)-Math.max(e.min.x,t.min.x),i=Math.min(e.max.y,t.max.y)-Math.max(e.min.y,t.min.y),a=Math.min(e.max.z,t.max.z)-Math.max(e.min.z,t.min.z);return r>n&&i>n&&a>n}function Zl(e,t,n=dl){return Xl(e,t,n)?{min:Z(Math.max(e.min.x,t.min.x),Math.max(e.min.y,t.min.y),Math.max(e.min.z,t.min.z)),max:Z(Math.min(e.max.x,t.max.x),Math.min(e.max.y,t.max.y),Math.min(e.max.z,t.max.z))}:null}function Ql(e){let t=e[0];if(!t)return null;let n=t.min.x,r=t.min.y,i=t.min.z,a=t.max.x,o=t.max.y,s=t.max.z;for(let t=1;t<e.length;t++){let c=e[t];c.min.x<n&&(n=c.min.x),c.min.y<r&&(r=c.min.y),c.min.z<i&&(i=c.min.z),c.max.x>a&&(a=c.max.x),c.max.y>o&&(o=c.max.y),c.max.z>s&&(s=c.max.z)}return{min:Z(n,r,i),max:Z(a,o,s)}}function $l(e,t){let n=e instanceof Map?e.get(t):e[t];if(n)return ml(n)}function eu(e,t){return!!(t.is_passthrough_coupler||e.is_passthrough_coupler||t.capabilities.includes(`passthrough-coupler`)||e.category===`keystone-module`&&e.ports.length===1)}function tu(e,t,n,r){let i=(e-1)*p;return t===`front`?Z(0,i,0):Z(n,i,r)}function nu(e,t,n){return n===`front`?Z(t.x+e.x,t.y+e.y,t.z+e.z):Z(t.x-e.x,t.y+e.y,t.z-e.z)}function ru(e,t){return t===`front`?Z(e.x,e.y,e.z):Z(-e.x,e.y,-e.z)}function iu(e,t,n,r,i,a,o){let s=o??n.face,c=s===`front`?0:t.geometry.depth_mm,l=s===`front`?Z(0,0,-1):Z(0,0,1),u=Z(n.coordinates.x_mm,n.coordinates.y_mm,c),d=nu(Kl(r,u),i,a),f=ru(l,a),p=f.z<0?`front`:`rear`;return{instance_id:e,port_id:n.port_id,label:n.label,local_face:s,world_face:p,connector_type:n.connector_type,direction:n.direction,capabilities:n.capabilities,is_passthrough_coupler:eu(t,n),local_position:u,world_position:d,world_normal:f}}function au(e,t,n,r){let i=e.blueprint.ports.find(e=>e.port_id===t);if(!i)return;let a=e.ports.find(e=>e.port_id===t);if(!a)return;if(!n||!a.is_passthrough_coupler)return a;let o=e.face,s=o===`front`?n:n===`front`?`rear`:`front`;if(s===a.local_face)return a;let c=e.world_origin,l=Z(0,0,0);if(e.mount_target===`carrier-slot`&&r){c=r.world_origin;let t=r.blueprint.slots.find(t=>t.slot_id===e.slot_id);t&&(l=Z(t.offset_mm.x,t.offset_mm.y,t.offset_mm.z))}return iu(e.instance_id,e.blueprint,i,l,c,o,s)}function ou(e,t,n){let r=[];for(let i of t){let t=[];i.from.instance_id===e.instance_id&&t.push(i.from),i.to.instance_id===e.instance_id&&t.push(i.to);for(let a of t){let t=au(e,a.port_id,a.face,n);if(!t)continue;let o=v(t.connector_type,i.cable_type),s=_(i.cable_type),c=t.world_position.z,l=c+t.world_normal.z*o,u=Yl(Z(e.chassis_box.min.x,e.chassis_box.min.y,c),Z(e.chassis_box.max.x,e.chassis_box.max.y,l)),d=Yl(Z(t.world_position.x-8,t.world_position.y-8,c),Z(t.world_position.x+8,t.world_position.y+8,l));r.push({instance_id:e.instance_id,port_id:t.port_id,cable_id:i.cable_id,cable_type:i.cable_type,connector_type:t.connector_type,is_angled:s,delta_z_mm:o,world_normal:t.world_normal,clearance_box:u,port_local_box:d})}}return{portClearances:r,combinedClearanceBox:Ql(r.map(e=>e.clearance_box))}}function su(e,t){let n=h[e.rack.standard],r=n.panel_width_mm,i=n.aperture_width_mm,a=Y(e.rack.u_height*p),o=e.rack.rail_depth_mm,s=new Map,c=[];for(let n of e.mounted_devices){let i=$l(t,n.blueprint_slug);if(!i)continue;let a=Math.max(1,Math.ceil(i.geometry.u_height)),l=[n.u_position,n.u_position+a-1],u=tu(n.u_position,n.face,r,o),d=Math.max(0,(r-i.geometry.width_mm)/2),f=d,m=r-d,h=(n.u_position-1)*p,g=h+i.geometry.height_mm,_,v;n.face===`front`?(_=-i.geometry.front_protrusion_mm,v=i.geometry.depth_mm+i.geometry.rear_protrusion_mm):(_=o-i.geometry.depth_mm-i.geometry.rear_protrusion_mm,v=o+i.geometry.front_protrusion_mm);let y=Yl(Z(f,h,_),Z(m,g,v)),b=i.ports.map(e=>iu(n.instance_id,i,e,Z(0,0,0),u,n.face)),x=i.slots.map(e=>{let t=Z(e.offset_mm.x,e.offset_mm.y,e.offset_mm.z),r=Z(e.offset_mm.x+e.max_dimensions_mm.width,e.offset_mm.y+e.max_dimensions_mm.height,e.offset_mm.z+e.max_dimensions_mm.depth),i=nu(t,u,n.face),a=nu(r,u,n.face),o=n.children.find(t=>t.slot_id===e.slot_id);return{carrier_instance_id:n.instance_id,slot_definition:e,world_origin:i,world_bounds:Yl(i,a),occupied_by_instance_id:o?o.instance_id:null}}),S={instance_id:n.instance_id,blueprint_slug:n.blueprint_slug,blueprint:i,hostname:n.hostname,mount_target:`rack-unit`,u_position:n.u_position,u_range:l,face:n.face,parent_carrier_id:null,slot_id:null,world_origin:u,chassis_box:y,plug_clearance_box:null,port_clearances:[],ports:b,slots:x,child_instance_ids:n.children.map(e=>e.instance_id)},C=ou(S,e.cables),w={...S,plug_clearance_box:C.combinedClearanceBox,port_clearances:C.portClearances};s.set(w.instance_id,w),c.push(w);for(let r of n.children){let a=$l(t,r.blueprint_slug);if(!a)continue;let o=i.slots.find(e=>e.slot_id===r.slot_id),d=o?Z(o.offset_mm.x,o.offset_mm.y,o.offset_mm.z):Z(0,0,0),f=nu(d,u,n.face),p=Z(d.x,d.y,d.z-a.geometry.front_protrusion_mm),m=Z(d.x+a.geometry.width_mm,d.y+a.geometry.height_mm,d.z+a.geometry.depth_mm+a.geometry.rear_protrusion_mm),h=Yl(nu(p,u,n.face),nu(m,u,n.face)),g=a.ports.map(e=>iu(r.instance_id,a,e,d,u,n.face)),_={instance_id:r.instance_id,blueprint_slug:r.blueprint_slug,blueprint:a,hostname:r.hostname,mount_target:`carrier-slot`,u_position:n.u_position,u_range:l,face:n.face,parent_carrier_id:n.instance_id,slot_id:r.slot_id,world_origin:f,chassis_box:h,plug_clearance_box:null,port_clearances:[],ports:g,slots:[],child_instance_ids:[]},v=ou(_,e.cables,w),y={..._,plug_clearance_box:v.combinedClearanceBox,port_clearances:v.portClearances};s.set(y.instance_id,y),c.push(y)}}return{rack:e.rack,panel_width_mm:r,aperture_width_mm:i,total_height_mm:a,rail_depth_mm:o,devices_by_id:s,devices:c}}function cu(e,t){let n=[],r=t.devices.filter(e=>e.mount_target===`rack-unit`&&e.face===`front`);for(let i=1;i<=e.rack.u_height;i++){let e=r.filter(e=>i>=e.u_range[0]&&i<=e.u_range[1]);(e.length===0||e.some(e=>{if(e.blueprint.category===`brush-panel`||e.blueprint.geometry.has_cable_pass_through===!0)return!0;let n=(t.aperture_width_mm-e.blueprint.geometry.width_mm)/2;return(e.blueprint.geometry.ear_mount_style===`none`||e.blueprint.mount_type===`shelf-standing`)&&n>=15}))&&n.push(i)}return n}function lu(e,t,n,r){let i=Math.max(1,Math.ceil(e.blueprint.geometry.u_height)),a=[],o=[],s=r.devices.filter(t=>t.mount_target===`rack-unit`&&t.instance_id!==e.instance_id);for(let c=1;c<=n.rack.u_height-i+1;c++){let l=c,u=c+i-1;if(s.some(e=>e.face===t&&Math.max(l,e.u_range[0])<=Math.min(u,e.u_range[1])))continue;let d=r.devices.filter(e=>e.face!==t&&Math.max(l,e.u_range[0])<=Math.min(u,e.u_range[1]));if(d.length===0){a.push(c),o.push(c);continue}let f=e.port_clearances.reduce((e,n)=>t===`front`&&n.world_normal.z>0||t===`rear`&&n.world_normal.z<0?Math.max(e,n.delta_z_mm):e,0),p=e.blueprint.geometry.depth_mm+f;d.some(e=>{let t=e.port_clearances.reduce((t,n)=>e.face===`front`&&n.world_normal.z>0||e.face===`rear`&&n.world_normal.z<0?Math.max(t,n.delta_z_mm):t,0),r=e.blueprint.geometry.depth_mm+t;return p+r>n.rack.rail_depth_mm})||a.push(c)}return{freeUs:a,zeroOppositeDepthUs:o}}function uu(e,t){let n=[`rj45`,`rj45-serial-console`];return!!(n.includes(e)&&n.includes(t)||e===`sfp-plus`&&t===`sfp-plus`||e===`iec-c13`&&t===`iec-c14`||e===`iec-c14`&&t===`iec-c13`||e===`schuko-cee7`&&(t===`iec-c14`||t===`iec-c13`)||(e===`iec-c14`||e===`iec-c13`)&&t===`schuko-cee7`||e===`dc-5525`&&(t===`dc-5525`||t===`schuko-cee7`||t===`iec-c13`)||(e===`schuko-cee7`||e===`iec-c13`)&&t===`dc-5525`||e===`usb-c`&&(t===`usb-c`||t===`schuko-cee7`||t===`iec-c13`)||(e===`schuko-cee7`||e===`iec-c13`)&&t===`usb-c`||e===`usb-a`&&t===`usb-a`||e===`audio-35mm`&&t===`audio-35mm`)}function du(e,t,n){let r=e.connector_type===`rj45-serial-console`||e.capabilities.includes(`serial-rs232`)&&e.capabilities.length===1;if(r!==(t.connector_type===`rj45-serial-console`||t.capabilities.includes(`serial-rs232`)&&t.capabilities.length===1))return{compatible:!1,reason:`Cannot connect RJ45 serial console port ('${r?e.port_id:t.port_id}') directly to standard Ethernet port ('${r?t.port_id:e.port_id}') without a serial-to-Ethernet adapter.`};let i=n.toLowerCase(),a=i.startsWith(`power-`)||i.includes(`c13`)||i.includes(`schuko`)||i.includes(`dc-5525`),o=e.connector_type===`rj45`||e.connector_type===`sfp-plus`||t.connector_type===`rj45`||t.connector_type===`sfp-plus`;return a&&o?{compatible:!1,reason:`Power cable '${n}' cannot be used on data ports '${e.port_id}' <-> '${t.port_id}'.`}:{compatible:!0}}function fu(e){return e.includes(`poe-out-bt-type4`)?{supported:!0,maxWatts:y[`bt-type4`],className:`bt-type4`}:e.includes(`poe-out-bt-type3`)?{supported:!0,maxWatts:y[`bt-type3`],className:`bt-type3`}:e.includes(`poe-out-at`)||e.includes(`poe+`)?{supported:!0,maxWatts:y.at,className:`at`}:e.includes(`poe-out-af`)||e.includes(`poe-out`)?{supported:!0,maxWatts:y.af,className:`af`}:{supported:!1,maxWatts:0,className:`none`}}function pu(e){return e.some(e=>e.startsWith(`poe-in`))}function mu(e){return e.includes(`25gbase-dac`)?25e3:e.includes(`10gbase-t`)||e.includes(`10gbase-sr`)||e.includes(`10gbase-lr`)||e.includes(`10gbase-dac`)?1e4:e.includes(`5gbase-t`)?5e3:e.includes(`2500base-t`)?2500:e.includes(`1000base-t`)?1e3:e.includes(`100base-tx`)?100:0}function hu(e,t,n){let r=n??su(e,t),i=[];for(let n of e.mounted_devices){let r=$l(t,n.blueprint_slug);if(!r){i.push({code:`BLUEPRINT_NOT_FOUND`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id],u_range:[n.u_position,n.u_position],message:`Hardware blueprint '${n.blueprint_slug}' for instance '${n.instance_id}' was not found in the catalog.`,remediation_suggestions:[`Register '${n.blueprint_slug}' using define_custom_blueprint or select a valid slug via search_catalog.`]});continue}let a=Math.max(1,Math.ceil(r.geometry.u_height)),o=n.u_position+a-1;(n.u_position<1||o>e.rack.u_height)&&i.push({code:`OUT_OF_RACK_BOUNDS`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id],u_range:[n.u_position,o],message:`Device '${n.instance_id}' at U${n.u_position}..U${o} exceeds rack height of ${e.rack.u_height}U.`,remediation_suggestions:[`Move '${n.instance_id}' to a U position between U1 and U${Math.max(1,e.rack.u_height-a+1)}.`]});for(let e of n.children){let a=$l(t,e.blueprint_slug);if(!a){i.push({code:`BLUEPRINT_NOT_FOUND`,severity:`ERROR`,stage:1,affected_instances:[e.instance_id],u_range:[n.u_position,o],message:`Child hardware blueprint '${e.blueprint_slug}' for '${e.instance_id}' was not found in the catalog.`,remediation_suggestions:[`Register '${e.blueprint_slug}' using define_custom_blueprint or select a valid sub-module blueprint.`]});continue}let s=r.slots.find(t=>t.slot_id===e.slot_id);if(!s){let t=r.slots.map(e=>`'${e.slot_id}'`).join(`, `);i.push({code:`SLOT_INCOMPATIBLE`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id,e.instance_id],u_range:[n.u_position,o],message:`Carrier '${n.instance_id}' does not have a slot '${e.slot_id}' for child '${e.instance_id}'.`,remediation_suggestions:[t?`Mount '${e.instance_id}' in one of the available slots on '${n.instance_id}': ${t}.`:`Mount '${e.instance_id}' inside a compatible modular-carrier.`]});continue}a.slot_compatibility&&a.slot_compatibility!==s.accepted_slot_type&&i.push({code:`SLOT_INCOMPATIBLE`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id,e.instance_id],u_range:[n.u_position,o],message:`Slot '${s.slot_id}' on '${n.instance_id}' expects slot type '${s.accepted_slot_type}', but '${e.instance_id}' has slot_compatibility '${a.slot_compatibility}'.`,remediation_suggestions:[`Mount '${e.instance_id}' into a slot accepting '${a.slot_compatibility}'.`]});let{width_mm:c,height_mm:l,depth_mm:u}=a.geometry,{width:d,height:f,depth:p}=s.max_dimensions_mm;(c>d||l>f||u>p)&&i.push({code:`SLOT_DIMENSION_OVERFLOW`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id,e.instance_id],u_range:[n.u_position,o],message:`Child device '${e.instance_id}' (${c}x${l}x${u}mm) exceeds max dimensions of slot '${s.slot_id}' (${d}x${f}x${p}mm) on carrier '${n.instance_id}'.`,remediation_suggestions:[`Use a carrier with a larger bay (>= ${c}x${l}x${u}mm) or mount '${e.instance_id}' on a 1U rack shelf.`]})}}let a=r.devices,o=new Set;for(let t=0;t<a.length;t++){let n=a[t];for(let s=t+1;s<a.length;s++){let t=a[s];if(n.parent_carrier_id===t.instance_id||t.parent_carrier_id===n.instance_id)continue;let c=Zl(n.chassis_box,t.chassis_box);if(c){let a=[n.instance_id,t.instance_id].sort().join(`::`);o.add(a);let s=fl(c.max.z-c.min.z),l=Math.max(n.u_range[0],t.u_range[0]),u=Math.min(n.u_range[1],t.u_range[1]),d=t.mount_target===`rack-unit`?t:n,{freeUs:f}=lu(d,d.face,e,r),p=[],m=[];if(f.length>0){let e=f.map(e=>`U${e} (${d.face})`).join(` or `),t=`Move '${d.instance_id}' from U${d.u_position} (${d.face}) to ${e} to resolve chassis overlap.`;p.push(t),m.push({action_type:`move_device`,target_instance_id:d.instance_id,suggested_u_positions:f,suggested_face:d.face,description:t})}else p.push(`Relocate '${d.instance_id}' or increase rack rail depth beyond ${e.rack.rail_depth_mm}mm.`);i.push({code:`CHASSIS_COLLISION`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id,t.instance_id],u_range:[l,Math.max(l,u)],message:`Hard chassis collision on U${l}: '${n.instance_id}' (${n.face}) and '${t.instance_id}' (${t.face}) overlap by ${s}mm on Z-axis.`,remediation_suggestions:p,remediation_actions:m})}}}for(let t of a)for(let n of t.port_clearances)for(let s of a){if(t.instance_id===s.instance_id||t.parent_carrier_id===s.instance_id||s.parent_carrier_id===t.instance_id)continue;let a=[t.instance_id,s.instance_id].sort().join(`::`);if(o.has(a))continue;let c=Zl(n.clearance_box,s.chassis_box);if(!c)continue;let l=fl(c.max.z-c.min.z),u=Math.max(t.u_range[0],s.u_range[0]),d=Math.min(t.u_range[1],s.u_range[1]),f=t.blueprint.geometry.depth_mm,p=fl(f+n.delta_z_mm),m=s.blueprint.geometry.depth_mm,h=[],_=[],v=s.face===`rear`&&s.mount_target===`rack-unit`?s:t.mount_target===`rack-unit`?t:s;if(v.mount_target===`rack-unit`){let{freeUs:t,zeroOppositeDepthUs:n}=lu(v,v.face,e,r),i=n.length>0?n:t;if(i.length>0){let e=i.map(e=>`U${e} (${v.face})`).join(` or `),t=v.face===`rear`?`front`:`rear`,r=n.length>0?`, where ${t} depth is 0mm.`:`, where depth clearance is sufficient.`,a=`Move '${v.instance_id}' from U${v.u_position} (${v.face}) to ${e}${r}`;h.push(a),_.push({action_type:`move_device`,target_instance_id:v.instance_id,suggested_u_positions:i,suggested_face:v.face,description:a})}}let y=g[n.connector_type];if(!n.is_angled&&y.angled_mm!==null){let e=y.angled_mm,t=`${n.cable_type}-angled`,r=fl(l-(n.delta_z_mm-e)),i=r<=0?`Change cable '${n.cable_id}' to '${t}', reducing plug clearance from ${n.delta_z_mm}mm to ${e}mm and resolving the collision.`:`Change cable '${n.cable_id}' to '${t}', reducing plug clearance from ${n.delta_z_mm}mm to ${e}mm (still requires moving '${v.instance_id}' or increasing rail depth by ${r}mm).`;h.push(i),_.push({action_type:`change_cable_type`,target_cable_id:n.cable_id,suggested_cable_type:t,description:i})}h.length===0&&h.push(`Increase rack rail_depth_mm by at least ${l}mm (to >= ${e.rack.rail_depth_mm+l}mm).`);let b=`${n.is_angled?`angled`:`straight`} ${n.connector_type.toUpperCase()} plug`;i.push({code:`PLUG_CLEARANCE_COLLISION`,severity:`ERROR`,stage:1,affected_instances:[t.instance_id,s.instance_id],u_range:[u,Math.max(u,d)],message:`Depth collision on U${u}: '${t.instance_id}' (${f}mm body + ${n.delta_z_mm}mm ${b} = ${p}mm) overlaps with ${s.face}-mounted '${s.instance_id}' (${m}mm depth) in a ${e.rack.rail_depth_mm}mm deep rack (${l}mm overlap).`,remediation_suggestions:h,remediation_actions:_})}if(e.rack.enclosure_type===`closed-glass-front`){let t=-e.rack.front_door_clearance_mm;for(let n of a){let r=n.chassis_box.min.z,a=n.plug_clearance_box===null?r:n.plug_clearance_box.min.z,o=Math.min(r,a);if(o<t-.001){let r=fl(t-o),a=n.port_clearances.find(e=>e.clearance_box.min.z<t-dl),s=[];if(a&&!a.is_angled){let e=g[a.connector_type];e.angled_mm!==null&&s.push(`Change cable '${a.cable_id}' to '${a.cable_type}-angled' to reduce front plug protrusion from ${a.delta_z_mm}mm to ${e.angled_mm}mm.`)}s.push(`Use recessed mounting ears ('recessed-20mm') on '${n.instance_id}' or change rack enclosure_type to 'open-frame'.`),i.push({code:`FRONT_DOOR_COLLISION`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id],u_range:[n.u_range[0],n.u_range[1]],message:`Front door collision on U${n.u_position}: '${n.instance_id}' protrudes to Z = ${o}mm, exceeding front glass door clearance (-${e.rack.front_door_clearance_mm}mm) by ${r}mm.`,remediation_suggestions:s})}}}let s=new Map,c=[];for(let t of e.cables){let e=r.devices_by_id.get(t.from.instance_id),n=r.devices_by_id.get(t.to.instance_id);if(!e||!n){let n=e?t.to.instance_id:t.from.instance_id;i.push({code:`PORT_NOT_FOUND`,severity:`ERROR`,stage:2,affected_instances:[n],message:`Cable '${t.cable_id}' references non-existent device instance '${n}'.`,remediation_suggestions:[`Verify instance_id '${n}' is mounted or remove cable '${t.cable_id}'.`]});continue}let a=e.parent_carrier_id?r.devices_by_id.get(e.parent_carrier_id):void 0,o=n.parent_carrier_id?r.devices_by_id.get(n.parent_carrier_id):void 0,l=au(e,t.from.port_id,t.from.face,a),u=au(n,t.to.port_id,t.to.face,o);if(!l||!u){let r=l?n:e,a=l?t.to.port_id:t.from.port_id,o=r.ports.map(e=>`'${e.port_id}'`).join(`, `);i.push({code:`PORT_NOT_FOUND`,severity:`ERROR`,stage:2,affected_instances:[r.instance_id],u_range:[r.u_range[0],r.u_range[1]],message:`Port '${a}' does not exist on device '${r.instance_id}' (referenced by cable '${t.cable_id}').`,remediation_suggestions:[`Use one of the valid port IDs on '${r.instance_id}': ${o||`none`}.`]});continue}let d=[{dev:e,port:l,epFace:t.from.face??l.world_face},{dev:n,port:u,epFace:t.to.face??u.world_face}];for(let e of d){let n=e.port.is_passthrough_coupler?`${e.dev.instance_id}:${e.port.port_id}:${e.epFace}`:`${e.dev.instance_id}:${e.port.port_id}`,r=s.get(n);if(r){let n=e.dev.ports.filter(t=>t.connector_type===e.port.connector_type&&!s.has(`${e.dev.instance_id}:${t.port_id}`)).map(e=>`'${e.port_id}'`);i.push({code:`PORT_ALREADY_OCCUPIED`,severity:`ERROR`,stage:2,affected_instances:[e.dev.instance_id],u_range:[e.dev.u_range[0],e.dev.u_range[1]],message:`Port '${e.port.port_id}'${e.port.is_passthrough_coupler?` (${e.epFace} face)`:``} on '${e.dev.instance_id}' is already occupied by cable '${r}' and cannot accept cable '${t.cable_id}'.`,remediation_suggestions:[n.length>0?`Connect cable '${t.cable_id}' to a free port on '${e.dev.instance_id}': ${n.slice(0,4).join(`, `)}.`:`Disconnect '${r}' before connecting '${t.cable_id}'.`]})}else s.set(n,t.cable_id)}if(!uu(l.connector_type,u.connector_type)){i.push({code:`CONNECTOR_INCOMPATIBLE`,severity:`ERROR`,stage:2,affected_instances:[e.instance_id,n.instance_id],message:`Physical connector mismatch on cable '${t.cable_id}': '${e.instance_id}:${l.port_id}' (${l.connector_type}) is incompatible with '${n.instance_id}:${u.port_id}' (${u.connector_type}).`,remediation_suggestions:[`Connect '${e.instance_id}:${l.port_id}' (${l.connector_type}) to a compatible '${l.connector_type}' port on '${n.instance_id}'.`]});continue}let f=du(l,u,t.cable_type);if(!f.compatible){i.push({code:`SIGNAL_PROTOCOL_INCOMPATIBLE`,severity:`ERROR`,stage:2,affected_instances:[e.instance_id,n.instance_id],message:`Signal incompatibility on cable '${t.cable_id}': ${f.reason}`,remediation_suggestions:[`Connect '${e.instance_id}:${l.port_id}' to a protocol-compatible port or insert a media/protocol converter.`]});continue}let p=t.cable_type===`cat5e`||t.cable_type===`cat5e-angled`,m=mu(l.capabilities),h=mu(u.capabilities),g=m>0&&h>0?Math.min(m,h):Math.max(m,h);if(p&&g>=2500){let r=t.cable_type===`cat5e-angled`?`cat6a-angled`:`cat6a`,a=`Upgrade cable '${t.cable_id}' from '${t.cable_type}' to '${r}' to prevent multi-gigabit (${g/1e3}G) link throttling to 1000BASE-T.`;i.push({code:`SPEED_MISMATCH`,severity:`WARNING`,stage:2,affected_instances:[e.instance_id,n.instance_id],message:`Cable media bottleneck on '${t.cable_id}': '${t.cable_type}' is rated for 1000BASE-T (1G) and may throttle the ${g/1e3}G link between '${e.instance_id}:${l.port_id}' and '${n.instance_id}:${u.port_id}'.`,remediation_suggestions:[a],remediation_actions:[{action_type:`change_cable_type`,target_cable_id:t.cable_id,suggested_cable_type:r,description:a}]})}c.push({cable:t,fromDev:e,toDev:n,fromPort:l,toPort:u})}let l=e.external_endpoints??[],u=[];for(let e of l){let t=r.devices_by_id.get(e.patch_panel_instance_id);if(!t){i.push({code:`PORT_NOT_FOUND`,severity:`ERROR`,stage:2,affected_instances:[e.patch_panel_instance_id],message:`External endpoint '${e.endpoint_id}' (${e.label}) references non-existent patch panel '${e.patch_panel_instance_id}'.`,remediation_suggestions:[`Mount patch panel '${e.patch_panel_instance_id}' first or reference an existing patch panel instance_id.`]});continue}let n=t.parent_carrier_id?r.devices_by_id.get(t.parent_carrier_id):void 0,a=au(t,e.patch_panel_port_id,`rear`,n);if(!a){let n=t.ports.map(e=>`'${e.port_id}'`).join(`, `);i.push({code:`PORT_NOT_FOUND`,severity:`ERROR`,stage:2,affected_instances:[t.instance_id],u_range:[t.u_range[0],t.u_range[1]],message:`Port '${e.patch_panel_port_id}' does not exist on patch panel '${t.instance_id}' (referenced by external endpoint '${e.endpoint_id}').`,remediation_suggestions:[`Use one of the valid port IDs on '${t.instance_id}': ${n||`none`}.`]});continue}let o=a.is_passthrough_coupler?`${t.instance_id}:${a.port_id}:rear`:`${t.instance_id}:${a.port_id}`,c=s.get(o);c?i.push({code:`PORT_ALREADY_OCCUPIED`,severity:`ERROR`,stage:2,affected_instances:[t.instance_id],u_range:[t.u_range[0],t.u_range[1]],message:`Rear port '${a.port_id}' on '${t.instance_id}' is already occupied by '${c}' and cannot accept external endpoint '${e.endpoint_id}' (${e.label}).`,remediation_suggestions:[`Assign external endpoint '${e.endpoint_id}' to a free rear port on '${t.instance_id}'.`]}):(s.set(o,`external:${e.endpoint_id}`),u.push({ext:e,ppDev:t,ppPort:a}))}let d=[],f=new Map;for(let e of c){let t=e.fromPort.is_passthrough_coupler,n=e.toPort.is_passthrough_coupler;if(!t&&!n)d.push({cableIds:[e.cable.cable_id],devA:e.fromDev,portA:e.fromPort,devB:e.toDev,portB:e.toPort});else if(t&&!n){let t=`${e.fromDev.instance_id}:${e.fromPort.port_id}`,n=e.cable.from.face??e.fromPort.world_face,r=f.get(t)??{};r[n]={dev:e.toDev,port:e.toPort,cableId:e.cable.cable_id},f.set(t,r)}else if(!t&&n){let t=`${e.toDev.instance_id}:${e.toPort.port_id}`,n=e.cable.to.face??e.toPort.world_face,r=f.get(t)??{};r[n]={dev:e.fromDev,port:e.fromPort,cableId:e.cable.cable_id},f.set(t,r)}else if(t&&n){let t=`${e.fromDev.instance_id}:${e.fromPort.port_id}`,n=e.cable.from.face??e.fromPort.world_face,r=`${e.toDev.instance_id}:${e.toPort.port_id}`,i=e.cable.to.face??e.toPort.world_face,a=f.get(t)??{};a[n]={dev:e.toDev,port:e.toPort,cableId:e.cable.cable_id,otherCouplerKey:r,otherCouplerFace:i},f.set(t,a);let o=f.get(r)??{};o[i]={dev:e.fromDev,port:e.fromPort,cableId:e.cable.cable_id,otherCouplerKey:t,otherCouplerFace:n},f.set(r,o)}}let m=new Set;for(let[e,t]of f.entries())if(!m.has(e)&&t.front&&t.rear){let n=t.front,r=t.rear,i=new Set([n.cableId,r.cableId]);for(m.add(e);n?.otherCouplerKey&&n.otherCouplerFace;){let e=n.otherCouplerKey;m.add(e);let t=n.otherCouplerFace===`front`?`rear`:`front`,r=f.get(e)?.[t];if(!r){n=void 0;break}i.add(r.cableId),n=r}for(;r?.otherCouplerKey&&r.otherCouplerFace;){let e=r.otherCouplerKey;m.add(e);let t=r.otherCouplerFace===`front`?`rear`:`front`,n=f.get(e)?.[t];if(!n){r=void 0;break}i.add(n.cableId),r=n}n&&r&&!n.otherCouplerKey&&!r.otherCouplerKey&&d.push({cableIds:Array.from(i),devA:n.dev,portA:n.port,devB:r.dev,portB:r.port})}let h=new Map;for(let e of a)e.blueprint.power_and_thermal.electrical_role===`pse-switch`&&h.set(e.instance_id,{pseDev:e,budgetWatts:e.blueprint.power_and_thermal.poe_budget_watts??0,consumedWatts:0,downstreamIds:[]});let _=new Set,v=new Set,y=new Map,b=[];for(let{ext:e,ppDev:t,ppPort:n}of u){let r=`${t.instance_id}:${n.port_id}`,a=f.get(r)?.front;if(!a){e.poe_draw_watts>0&&(b.push(e.endpoint_id),i.push({code:`UNPOWERED_DEVICE`,severity:`WARNING`,stage:3,affected_instances:[t.instance_id],u_range:[t.u_range[0],t.u_range[1]],message:`External PoE endpoint '${e.endpoint_id}' (${e.label}, ${e.poe_draw_watts}W) is terminated on the rear of '${t.instance_id}:${n.port_id}', but no front patch cable connects '${t.instance_id}:${n.port_id}' to a PoE switch port.`,remediation_suggestions:[`Connect a front patch cable from '${t.instance_id}:${n.port_id}' (face: "front") to a PoE-capable switch port.`]}));continue}let o=a,s=new Set([r]);for(;o?.otherCouplerKey&&o.otherCouplerFace;){let e=o.otherCouplerKey;if(s.has(e)){o=void 0;break}s.add(e);let t=o.otherCouplerFace===`front`?`rear`:`front`;o=f.get(e)?.[t]}if(!o||o.otherCouplerKey){e.poe_draw_watts>0&&b.push(e.endpoint_id);continue}let c=o.dev,l=o.port,u=e.required_speed===`10gbe`?1e4:e.required_speed===`2.5gbe`?2500:e.required_speed===`1gbe`?1e3:100,d=mu(l.capabilities);if(d>0&&d<u&&i.push({code:`SPEED_MISMATCH`,severity:`WARNING`,stage:2,affected_instances:[t.instance_id,c.instance_id],u_range:[Math.min(t.u_range[0],c.u_range[0]),Math.max(t.u_range[1],c.u_range[1])],message:`External endpoint '${e.endpoint_id}' (${e.label}) on '${t.instance_id}:${n.port_id}' requires ${e.required_speed.toUpperCase()} (${u>=1e3?`${u/1e3}G`:`${u}M`}), but connected switch port '${c.instance_id}:${l.port_id}' only supports up to ${d>=1e3?`${d/1e3}G`:`${d}M`}.`,remediation_suggestions:[`Patch '${t.instance_id}:${n.port_id}' to a ${e.required_speed.toUpperCase()}-capable port on '${c.instance_id}' or another switch.`]}),e.poe_draw_watts>0){let r=fu(l.capabilities);if(!r.supported)b.push(e.endpoint_id),i.push({code:`UNPOWERED_DEVICE`,severity:`WARNING`,stage:3,affected_instances:[t.instance_id,c.instance_id],u_range:[Math.min(t.u_range[0],c.u_range[0]),Math.max(t.u_range[1],c.u_range[1])],message:`External PoE endpoint '${e.endpoint_id}' (${e.label}, ${e.poe_draw_watts}W) is patched via '${t.instance_id}:${n.port_id}' to '${c.instance_id}:${l.port_id}', which does not provide PoE output.`,remediation_suggestions:[`Connect '${t.instance_id}:${n.port_id}' to a PoE-capable port on '${c.instance_id}' or another PSE switch.`]});else{e.poe_draw_watts>r.maxWatts&&i.push({code:`POE_CLASS_EXCEEDED`,severity:`ERROR`,stage:3,affected_instances:[c.instance_id,t.instance_id],u_range:[c.u_range[0],c.u_range[1]],message:`PoE class exceeded on '${c.instance_id}:${l.port_id}' (class '${r.className}', max ${r.maxWatts}W): external endpoint '${e.endpoint_id}' (${e.label}) requires ${e.poe_draw_watts}W.`,remediation_suggestions:[`Patch '${t.instance_id}:${n.port_id}' ('${e.label}') to a higher-class PoE+/PoE++ port (>= ${e.poe_draw_watts}W).`]});let a=h.get(c.instance_id);a||(a={pseDev:c,budgetWatts:c.blueprint.power_and_thermal.poe_budget_watts??0,consumedWatts:0,downstreamIds:[]},h.set(c.instance_id,a)),a.consumedWatts=X(a.consumedWatts+e.poe_draw_watts),a.downstreamIds.includes(e.endpoint_id)||a.downstreamIds.push(e.endpoint_id)}}}for(let e of d){let t=fu(e.portA.capabilities),n=fu(e.portB.capabilities),r=(e,t,n,r,a)=>{if(!n.supported||!pu(a.capabilities))return;let o=r.blueprint.power_and_thermal.max_system_watts;_.add(r.instance_id),o>n.maxWatts&&i.push({code:`POE_CLASS_EXCEEDED`,severity:`ERROR`,stage:3,affected_instances:[e.instance_id,r.instance_id],u_range:[e.u_range[0],r.u_range[1]],message:`PoE class exceeded on '${e.instance_id}:${t.port_id}' (class '${n.className}', max ${n.maxWatts}W): downstream device '${r.instance_id}' requires ${o}W.`,remediation_suggestions:[`Connect '${r.instance_id}' to a higher-class PoE++ port (>= ${o}W) or power it via a dedicated AC/DC adapter.`]});let s=h.get(e.instance_id);s||(s={pseDev:e,budgetWatts:e.blueprint.power_and_thermal.poe_budget_watts??0,consumedWatts:0,downstreamIds:[]},h.set(e.instance_id,s)),s.consumedWatts=X(s.consumedWatts+o),s.downstreamIds.includes(r.instance_id)||s.downstreamIds.push(r.instance_id)};r(e.devA,e.portA,t,e.devB,e.portB),r(e.devB,e.portB,n,e.devA,e.portA);let a=e=>e.connector_type===`iec-c13`||e.connector_type===`iec-c14`||e.connector_type===`schuko-cee7`||e.connector_type===`dc-5525`||e.connector_type===`usb-c`&&(e.capabilities.includes(`usb-pd`)||e.capabilities.includes(`dc-power`)||e.direction!==`bidirectional`);if(a(e.portA)&&a(e.portB)){let t=e.devA.blueprint.power_and_thermal.electrical_role,n=e.devB.blueprint.power_and_thermal.electrical_role,r=t===`ups`||t===`pdu`&&n!==`ups`||e.portA.direction===`output`,i=n===`ups`||n===`pdu`&&t!==`ups`||e.portB.direction===`output`;if(r&&!i){v.add(e.devB.instance_id);let t=y.get(e.devA.instance_id)??[];t.push(e.devB.instance_id),y.set(e.devA.instance_id,t)}else if(i&&!r){v.add(e.devA.instance_id);let t=y.get(e.devB.instance_id)??[];t.push(e.devA.instance_id),y.set(e.devB.instance_id,t)}}}let x=[],S=0;for(let[,e]of h.entries()){S=X(S+e.consumedWatts);let t=X(e.budgetWatts-e.consumedWatts);if(x.push({pse_instance_id:e.pseDev.instance_id,poe_budget_watts:e.budgetWatts,consumed_poe_watts:e.consumedWatts,remaining_poe_watts:t,downstream_devices:e.downstreamIds}),e.consumedWatts>e.budgetWatts){let t=fl(e.consumedWatts-e.budgetWatts),n=[`Disconnect or move at least ${t}W of PoE load (${e.downstreamIds.map(e=>`'${e}'`).join(`, `)}) from '${e.pseDev.instance_id}' to dedicated AC/DC power or a PoE injector.`,`Upgrade '${e.pseDev.instance_id}' to a PSE switch with poe_budget_watts >= ${e.consumedWatts}W.`];i.push({code:`POE_BUDGET_EXCEEDED`,severity:`ERROR`,stage:3,affected_instances:[e.pseDev.instance_id,...e.downstreamIds],u_range:[e.pseDev.u_range[0],e.pseDev.u_range[1]],message:`PoE budget exceeded on '${e.pseDev.instance_id}': downstream PoE devices (${e.downstreamIds.join(`, `)}) draw ${e.consumedWatts}W, exceeding the ${e.budgetWatts}W budget by ${t}W.`,remediation_suggestions:n,remediation_actions:[{action_type:`redistribute_poe`,target_instance_id:e.pseDev.instance_id,description:n[0]}]})}}let C=(e,t=new Set)=>{if(t.has(e))return 0;t.add(e);let n=r.devices_by_id.get(e);if(!n)return 0;let i=n.blueprint.power_and_thermal.max_system_watts,a=h.get(e)?.consumedWatts??0,o=(y.get(e)??[]).reduce((e,n)=>e+C(n,t),0);return X(i+a+o)},w=[];for(let e of a){let t=e.blueprint.power_and_thermal.electrical_role;if(t!==`ups`&&t!==`pdu`)continue;let n=y.get(e.instance_id)??[],r=n.reduce((e,t)=>e+C(t),0),a=X(e.blueprint.power_and_thermal.max_system_watts+r),o=e.blueprint.power_and_thermal.ups_capacity_watts??e.blueprint.power_and_thermal.pdu_capacity_watts??(t===`ups`?600:2300),s=fl(a/o*100);if(w.push({source_instance_id:e.instance_id,role:t,capacity_watts:o,total_load_watts:a,utilization_percent:s}),a>o){let r=fl(a-o);i.push({code:`UPS_OVERLOAD`,severity:`ERROR`,stage:3,affected_instances:[e.instance_id,...n],u_range:[e.u_range[0],e.u_range[1]],message:`Power capacity exceeded on '${e.instance_id}' (${t.toUpperCase()}): connected peak load is ${a}W, exceeding capacity of ${o}W by ${r}W.`,remediation_suggestions:[`Offload at least ${r}W from '${e.instance_id}' onto a secondary PDU/UPS or upgrade '${e.instance_id}' to >= ${Math.ceil(a*1.2)}W capacity.`]})}}let T=[...b],E=a.filter(e=>e.blueprint.power_and_thermal.electrical_role===`pdu`||e.blueprint.power_and_thermal.electrical_role===`ups`);for(let e of a){let t=e.blueprint.power_and_thermal.electrical_role;if(t!==`passive`&&t!==`ups`&&t!==`pdu`&&!(v.has(e.instance_id)||_.has(e.instance_id))){T.push(e.instance_id);let n=e.ports.find(e=>e.direction===`input`||e.connector_type===`iec-c14`||e.connector_type===`dc-5525`||e.capabilities.some(e=>e.startsWith(`poe-in`))),r=[],a=[];if(E.length>0&&n){let t=E[0],i=t.ports.find(e=>!s.has(`${t.instance_id}:${e.port_id}`)&&(e.direction===`output`||e.connector_type===`schuko-cee7`||e.connector_type===`iec-c13`));if(i){let o=`Connect power port '${n.port_id}' on '${e.instance_id}' to free outlet '${i.port_id}' on '${t.instance_id}'.`;r.push(o),a.push({action_type:`connect_power`,target_instance_id:e.instance_id,description:o})}}r.length===0&&r.push(`Connect '${e.instance_id}' to a PDU/UPS power outlet or a PoE-capable switch port.`),i.push({code:`UNPOWERED_DEVICE`,severity:`WARNING`,stage:3,affected_instances:[e.instance_id],u_range:[e.u_range[0],e.u_range[1]],message:`Active device '${e.instance_id}' (${t}, ${e.blueprint.power_and_thermal.max_system_watts}W) has no active power or PoE connection.`,remediation_suggestions:r,remediation_actions:a})}}let D=0,O=0,k=[];for(let t of a){let n=t.blueprint.geometry.weight_grams,r=(t.chassis_box.min.y+t.chassis_box.max.y)/2;D+=n,O+=n*r,(n>=(e.rack.standard===`19inch`?12e3:4e3)||t.blueprint.category===`ups`&&n>=4e3)&&t.u_position>3&&k.push(t)}let A=e.rack.u_height*p,j=D>0?X(O/D):0,M=D>0&&A>0?Y(j/A):0;if(M>.55||k.length>0){let t=k.length>0?k.map(e=>e.instance_id):a.filter(t=>t.u_position>Math.ceil(e.rack.u_height/2)).map(e=>e.instance_id),n=k.length>0?`heavy equipment (${k.map(e=>`'${e.instance_id}' at ${e.blueprint.geometry.weight_grams}g on U${e.u_position}`).join(`, `)}) is mounted above U3 (normalized CoG = ${M})`:`normalized vertical Center of Gravity is ${M} (> 0.55 threshold)`;i.push({code:`TOP_HEAVY_RACK`,severity:`WARNING`,stage:4,affected_instances:t,message:`Rack mechanical stability warning: ${n}.`,remediation_suggestions:[`Move heavy devices (such as UPS or high-mass nodes) to U1–U3 at the bottom of the rack to lower the center of gravity.`]})}let N=cu(e,r);for(let t of c)if(t.fromPort.world_face!==t.toPort.world_face){let n=t.fromDev.u_position,r=t.toDev.u_position,a=Math.min(n,r)-3,o=Math.max(n,r)+3;N.filter(e=>e>=a&&e<=o).length===0&&i.push({code:`NO_FRONT_TO_REAR_PORTAL`,severity:`ERROR`,stage:4,affected_instances:[t.fromDev.instance_id,t.toDev.instance_id],u_range:[Math.min(n,r),Math.max(n,r)],message:`Cross-face cable '${t.cable.cable_id}' connects '${t.fromDev.instance_id}:${t.fromPort.port_id}' (${t.fromPort.world_face}, U${n}) to '${t.toDev.instance_id}:${t.toPort.port_id}' (${t.toPort.world_face}, U${r}), but no valid front-to-rear cable portal exists within +/- 3U.`,remediation_suggestions:[`Leave at least one rack unit unoccupied or mount a 1U 'brush-panel' between U${Math.max(1,a)} and U${Math.min(e.rack.u_height,o)}.`],remediation_actions:[{action_type:`add_portal_gap`,target_cable_id:t.cable.cable_id,description:`Mount a brush-panel or free a 1U gap within +/- 3U of U${n}..U${r}.`}]})}let P=X(a.reduce((e,t)=>e+t.blueprint.power_and_thermal.max_system_watts,0)),F=fl(P*3.41214),I=a.filter(e=>e.blueprint.power_and_thermal.max_system_watts>0&&e.blueprint.power_and_thermal.airflow===`front-to-rear`),L=a.filter(e=>e.blueprint.power_and_thermal.max_system_watts>0&&e.blueprint.power_and_thermal.airflow===`rear-to-front`),R=a.filter(e=>e.blueprint.power_and_thermal.max_system_watts>0&&e.blueprint.power_and_thermal.airflow===`passive-convection`),z=`uniform-passive`;if(I.length>0&&L.length>0){z=`mixed-conflict`;let e=[...I.map(e=>e.instance_id),...L.map(e=>e.instance_id)];i.push({code:`THERMAL_AIRFLOW_CONFLICT`,severity:`WARNING`,stage:5,affected_instances:e,message:`Opposing thermal airflow directions detected: front-to-rear devices (${I.map(e=>`'${e.instance_id}'`).join(`, `)}) conflict with rear-to-front devices (${L.map(e=>`'${e.instance_id}'`).join(`, `)}), causing hot-air recirculation.`,remediation_suggestions:[`Reverse mounting face or fan orientation on ${L.map(e=>`'${e.instance_id}'`).join(`, `)} so all active equipment follows a uniform front-to-rear cold/hot aisle path.`]})}else(I.length>0||L.length>0)&&R.length>0?z=`hybrid-active-passive`:I.length>0&&(z=`uniform-front-to-rear`);let ee=R.filter(e=>e.blueprint.power_and_thermal.max_system_watts>=35);for(let e=0;e<ee.length;e++){let t=ee[e];for(let n=e+1;n<ee.length;n++){let e=ee[n];if(Math.abs(t.u_position-e.u_position)===1){let n=Math.min(t.u_position,e.u_position),r=Math.max(t.u_position,e.u_position);i.push({code:`THERMAL_HOTSPOT_STACKING`,severity:`WARNING`,stage:5,affected_instances:[t.instance_id,e.instance_id],u_range:[n,r],message:`Thermal hotspot stacking on U${n}..U${r}: passive-convection devices '${t.instance_id}' (${t.blueprint.power_and_thermal.max_system_watts}W) and '${e.instance_id}' (${e.blueprint.power_and_thermal.max_system_watts}W) are stacked directly adjacent without active airflow or a 1U ventilation gap.`,remediation_suggestions:[`Insert a 1U ventilation gap or brush-panel between '${t.instance_id}' and '${e.instance_id}', or add active front-to-rear rack cooling.`]})}}}let te=0,ne=[];for(let e of a){let t=e.blueprint.power_and_thermal,n=t.noise_db_a;n===void 0&&(n=t.airflow===`front-to-rear`||t.airflow===`rear-to-front`||t.airflow===`side-to-side`?t.max_system_watts>=25?28:t.max_system_watts>0?22:0:0),n>0&&(te+=10**(n/10),n>=40&&ne.push({id:e.instance_id,dbA:n}))}let re=te>0?fl(10*Math.log10(te)):0;re>45&&i.push({code:`ACOUSTIC_NOISE_HIGH`,severity:`WARNING`,stage:5,affected_instances:ne.length>0?ne.map(e=>e.id):a.map(e=>e.instance_id),message:`Combined rack acoustic emission is ${re} dB(A), exceeding the 45.0 dB(A) homelab/office comfort threshold.`,remediation_suggestions:[`Replace high-RPM fans with low-noise PWM fans or relocate high-noise equipment (${ne.map(e=>`'${e.id}' at ${e.dbA} dB(A)`).join(`, `)||`active switches/servers`}) to an enclosed utility closet.`]});let B=i.filter(e=>e.severity===`ERROR`).length,ie=i.filter(e=>e.severity===`WARNING`).length;return{status:B===0?`VALID`:`INVALID`,is_valid:B===0,error_count:B,warning_count:ie,issues:i,power_summary:{total_system_watts:P,total_poe_watts:S,pse_budgets:x,power_sources:w,unpowered_active_instances:T},mechanical_summary:{total_weight_grams:D,center_of_gravity_y_mm:j,normalized_cog_y:M,available_portal_u_positions:N,total_thermal_btu_hr:F,combined_noise_db_a:re,airflow_profile:z}}}function gu(e,t=S){if(e<=0)return{du:0,dv:0};let n=1;for(;1+3*n*(n+1)<=e;)n++;let r=e-(1+3*n*(n-1)),i=Math.floor(r/n),a=r%n,o=i*Math.PI/3,s=(i+1)*Math.PI/3,c=n*t,l=c*Math.cos(o),u=c*Math.sin(o),d=c*Math.cos(s),f=c*Math.sin(s),p=a/n;return{du:Y(l+p*(d-l)),dv:Y(u+p*(f-u))}}function _u(e){if(e.length===0)return[];let t=[e[0]];for(let n=1;n<e.length;n++){let r=t[t.length-1],i=e[n];Jl(r,i)>.001&&t.push(i)}return t}function vu(e,t=32,n=.5){let r=_u(e);if(r.length===0)return[];if(r.length===1)return[Z(r[0].x,r[0].y,r[0].z)];let i=r[0],a=r[r.length-1],o=r.length-1,s=(e,t,n)=>{let r=1-n;return{x:e.x*r+t.x*n,y:e.y*r+t.y*n,z:e.z*r+t.z*n}},c=(e,t,n,r)=>{let i=1-r,a=i*i,o=2*i*r,s=r*r;return{x:a*e.x+o*t.x+s*n.x,y:a*e.y+o*t.y+s*n.y,z:a*e.z+o*t.z+s*n.z}},l=r.map((e,t)=>{if(t===0||t===o)return{radiusMm:0,sIn:e,cIn:e,apex:e,cOut:e,sOut:e};let n=r[t-1],i=r[t+1],a=Jl(n,e),c=Jl(e,i);if(a<=.001||c<=.001)return{radiusMm:0,sIn:e,cIn:e,apex:e,cOut:e,sOut:e};let l={x:(e.x-n.x)/a,y:(e.y-n.y)/a,z:(e.z-n.z)/a},u={x:(i.x-e.x)/c,y:(i.y-e.y)/c,z:(i.z-e.z)/c},d=t===1||t===o-1,f=d?4.5:10,p=d?.35:.4,m=Math.min(f,a*p,c*p),h={x:e.x-l.x*m,y:e.y-l.y*m,z:e.z-l.z*m},g={x:e.x+u.x*m,y:e.y+u.y*m,z:e.z+u.z*m},_=s(h,e,.5),v=s(e,g,.5);return{radiusMm:m,sIn:h,cIn:_,apex:s(_,v,.5),cOut:v,sOut:g}}),u=[];for(let e=0;e<o;e++){let n=l[e],r=l[e+1],i=n.radiusMm>.001,a=r.radiusMm>.001,o=i?.28:0,d=a?.72:1,f=e===0?0:1;for(let e=f;e<=t;e++){let l=e/t,f;if(i&&l<o){let e=l/o;f=c(n.apex,n.cOut,n.sOut,e)}else if(a&&l>d){let e=(l-d)/(1-d);f=c(r.sIn,r.cIn,r.apex,e)}else{let e=Math.max(1e-6,d-o),t=(l-o)/e;f=s(n.sOut,r.sIn,t)}u.push(Z(f.x,f.y,f.z))}}return u.length>0&&(u[0]=Z(i.x,i.y,i.z),u[u.length-1]=Z(a.x,a.y,a.z)),u}function yu(e){let t=0;for(let n=1;n<e.length;n++)t+=Jl(e[n-1],e[n]);return X(t)}function bu(e){let t=X(e*x+40);for(let e of b)if(e>=t)return{requiredLengthMm:t,recommendedCommercialMm:e};return{requiredLengthMm:t,recommendedCommercialMm:Math.ceil(t/500)*500}}function xu(e){let t=e.toLowerCase();return t.startsWith(`power-`)||t.includes(`c13`)||t.includes(`c14`)||t.includes(`schuko`)||t.includes(`dc-5525`)||t.includes(`usb-c`)}function Su(e,t,n){return t.is_passthrough_coupler&&n!==void 0?n:t.world_face===`rear`||e.face===`rear`||t.world_position.z>35?`rear`:`front`}function Cu(e,t=`svg-dark`){let n=e.trim();if(!/^#[0-9a-fA-F]{6}$/.test(n))return e;let r=Number.parseInt(n.slice(1,3),16),i=Number.parseInt(n.slice(3,5),16),a=Number.parseInt(n.slice(5,7),16),o=e=>{let t=e/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4};if(.2126*o(r)+.7152*o(i)+.0722*o(a)>=(t===`svg-dark`?.12:.08))return e;let s=t===`svg-dark`?Math.min(232,Math.round(124+r*.56)):Math.min(210,Math.round(68+r*.65)),c=t===`svg-dark`?Math.min(236,Math.round(130+i*.56)):Math.min(215,Math.round(72+i*.65)),l=t===`svg-dark`?Math.min(242,Math.round(138+a*.58)):Math.min(225,Math.round(80+a*.68)),u=e=>e.toString(16).toUpperCase().padStart(2,`0`);return`#${u(s)}${u(c)}${u(l)}`}function wu(e,t,n,r){let i=0,a=1;for(let o of[`x`,`y`,`z`]){let s=n.min[o]-r,c=n.max[o]+r,l=e[o],u=t[o]-l;if(Math.abs(u)<1e-9){if(l<s||l>c)return!1}else{let e=1/u,t=(s-l)*e,n=(c-l)*e;if(t>n){let e=t;t=n,n=e}if(t>i&&(i=t),n<a&&(a=n),i>a)return!1}}return!0}var Tu=new WeakMap;function Eu(e){let t=Tu.get(e);if(t!==void 0)return t;let n=1/0,r=-1/0,i=1/0,a=-1/0,o=1/0,s=-1/0;for(let t of e)t.x<n&&(n=t.x),t.x>r&&(r=t.x),t.y<i&&(i=t.y),t.y>a&&(a=t.y),t.z<o&&(o=t.z),t.z>s&&(s=t.z);let c=[],l=e.length;if(l>=2){let t=l<=128?1:2,n=e[0],r=e[Math.min(t,l-1)];for(let i=t;i<l-1;i+=t){let a=e[Math.min(i+t,l-1)],o=r.x-n.x,s=r.y-n.y,u=r.z-n.z,d=a.x-r.x,f=a.y-r.y,p=a.z-r.z,m=o*o+s*s+u*u,h=d*d+f*f+p*p,g=o*d+s*f+u*p,_=s*p-u*f,v=u*d-o*p,y=o*f-s*d,b=_*_+v*v+y*y;h<=1e-10||g>=0&&b<=1e-7*m*h||(c.push({p:n,q:r,minX:Math.min(n.x,r.x),maxX:Math.max(n.x,r.x),minY:Math.min(n.y,r.y),maxY:Math.max(n.y,r.y),minZ:Math.min(n.z,r.z),maxZ:Math.max(n.z,r.z)}),n=r),r=a}c.push({p:n,q:r,minX:Math.min(n.x,r.x),maxX:Math.max(n.x,r.x),minY:Math.min(n.y,r.y),maxY:Math.max(n.y,r.y),minZ:Math.min(n.z,r.z),maxZ:Math.max(n.z,r.z)})}let u={minX:n,maxX:r,minY:i,maxY:a,minZ:o,maxZ:s,segments:c};return Tu.set(e,u),u}var Du=new WeakMap;function Ou(e){let t=Du.get(e);if(t!==void 0)return t;let n=[],r=[];for(let t of e.devices){let i=t.blueprint.category;if(i!==`keystone-module`){let e=i===`brush-panel`||t.blueprint.geometry.has_cable_pass_through===!0,r=t.chassis_box;i===`modular-carrier`?r={min:t.chassis_box.min,max:Z(t.chassis_box.max.x,Math.min(t.chassis_box.max.y,t.chassis_box.min.y+4.6),t.chassis_box.max.z)}:i===`shelf`&&(r={min:t.chassis_box.min,max:Z(t.chassis_box.max.x,Math.min(t.chassis_box.max.y,t.chassis_box.min.y+13.5),t.chassis_box.max.z)}),n.push({instanceId:t.instance_id,isPassThroughDevice:e,uMin:t.u_range[0],uMax:t.u_range[1],box:r})}for(let n of t.ports){let t=n.world_position,i=n.world_face===`rear`&&t.z<e.rail_depth_mm-15?Math.max(24,Math.min(105,e.rail_depth_mm-10-t.z)):22,a=Kl(t,ql(n.world_normal,i));r.push({pos:t,bootTip:a,minX:Math.min(t.x,a.x),maxX:Math.max(t.x,a.x),minY:Math.min(t.y,a.y),maxY:Math.max(t.y,a.y),minZ:Math.min(t.z,a.z),maxZ:Math.max(t.z,a.z)})}}let i={obstacles:n,portShafts:r};return Du.set(e,i),i}function ku(e,t,n,r,i,a,o=null){if(e.length<2)return 10;let s=Eu(e),{obstacles:c}=Ou(t),l=[];for(let e of c)o!==null&&e.isPassThroughDevice&&o>=e.uMin&&o<=e.uMax||s.maxX+3.4<e.box.min.x||e.box.max.x+3.4<s.minX||s.maxY+3.4<e.box.min.y||e.box.max.y+3.4<s.minY||s.maxZ+3.4<e.box.min.z||e.box.max.z+3.4<s.minZ||l.push(e);if(l.length===0)return 10;let u=10,d=e.length<=128?1:2;for(let t=0;t<e.length-1;t+=d){let o=e[t],s=e[Math.min(t+d,e.length-1)],c={x:(o.x+s.x)*.5,y:(o.y+s.y)*.5,z:(o.z+s.z)*.5},f=Jl(c,i)<=15.5,p=Jl(c,a)<=15.5;for(let e of l)if(!(e.instanceId===n&&f||e.instanceId===r&&p)){if(wu(o,s,e.box,-.15))return-1;u>1.5&&wu(o,s,e.box,3.3)&&(u=1.5)}}return u}function Au(e,t,n,r){let i=t.x-e.x,a=t.y-e.y,o=t.z-e.z,s=r.x-n.x,c=r.y-n.y,l=r.z-n.z,u=e.x-n.x,d=e.y-n.y,f=e.z-n.z,p=i*i+a*a+o*o,m=s*s+c*c+l*l,h=s*u+c*d+l*f,g=0,_=0;if(p<=1e-6&&m<=1e-6)return Math.hypot(u,d,f);if(p<=1e-6)_=Math.max(0,Math.min(1,h/m));else{let e=i*u+a*d+o*f;if(m<=1e-6)g=Math.max(0,Math.min(1,-e/p));else{let t=i*s+a*c+o*l,n=p*m-t*t;n!==0&&(g=Math.max(0,Math.min(1,(t*h-e*m)/n))),_=(t*g+h)/m,_<0?(_=0,g=Math.max(0,Math.min(1,-e/p))):_>1&&(_=1,g=Math.max(0,Math.min(1,(t-e)/p)))}}return Math.hypot(u+i*g-s*_,d+a*g-c*_,f+o*g-l*_)}function ju(e,t,n=6.2){if(t.length===0||e.length<2)return 1/0;let r=Eu(e),i=n*.45,a=1/0;for(let e of t){let t=e.spline_points;if(t.length<2)continue;let n=Eu(t);if(!(r.maxX+a<n.minX||n.maxX+a<r.minX||r.maxY+a<n.minY||n.maxY+a<r.minY||r.maxZ+a<n.minZ||n.maxZ+a<r.minZ)){for(let e of r.segments)if(!(e.maxX+a<n.minX||n.maxX+a<e.minX||e.maxY+a<n.minY||n.maxY+a<e.minY||e.maxZ+a<n.minZ||n.maxZ+a<e.minZ))for(let t of n.segments){if(e.maxX+a<t.minX||t.maxX+a<e.minX||e.maxY+a<t.minY||t.maxY+a<e.minY||e.maxZ+a<t.minZ||t.maxZ+a<e.minZ)continue;let n=Au(e.p,e.q,t.p,t.q);if(n<a&&(a=n,a<i))return a}}}return a}function Mu(e,t,n,r){if(e.length<2)return 1/0;let i=Eu(e),{portShafts:a}=Ou(t),o=1/0;for(let e of a)if(!(e.maxX+o<i.minX||i.maxX+o<e.minX||e.maxY+o<i.minY||i.maxY+o<e.minY||e.maxZ+o<i.minZ||i.maxZ+o<e.minZ)&&!(Jl(e.pos,n)<1||Jl(e.pos,r)<1))for(let t of i.segments){if(t.maxX+o<e.minX||e.maxX+o<t.minX||t.maxY+o<e.minY||e.maxY+o<t.minY||t.maxZ+o<e.minZ||e.maxZ+o<t.minZ)continue;let n=Au(t.p,t.q,e.pos,e.bootTip);if(n<o&&(o=n,o<3.5))return o}return o}function Nu(e,t,n,r,i=1){let a=Math.min(t.y,r)-3.2,o=Math.max(t.y,r)+3.2,s=r=>{for(let i of e.devices)for(let e of i.ports)if(e.world_face===n&&!(Math.abs(e.world_position.x-t.x)<.5&&Math.abs(e.world_position.y-t.y)<.5)&&!(Math.abs(e.world_position.y-t.y)>38||Math.abs(e.world_position.z-t.z)>15)&&Math.abs(e.world_position.x-r)<6.8&&e.world_position.y>=a&&e.world_position.y<=o)return!0;return!1};if(!s(t.x))return t.x;let c=(e.panel_width_mm-e.aperture_width_mm)/2,l=Y(c+5.5),u=Y(e.panel_width_mm-c-5.5),d=e=>Y(Math.max(l,Math.min(u,e))),f=i>=0?1:-1,p=d(t.x+f*7.8);if(!s(p))return p;let m=d(t.x-f*7.8);return s(m)?p:m}function Pu(e,t,n,r,i,a,o,s){let c=Math.min(r,i)-4,l=Math.max(r,i)+4;for(let r of e.devices)for(let e of r.ports){if(e.world_face!==t)continue;let r=e.world_position;if(!(Jl(r,o)<1||Jl(r,s)<1)&&Math.abs(r.y-n)<6.2&&r.x>=c&&r.x<=l&&(Math.abs(r.z-a)<35||Math.abs(r.z-o.z)<35||t===`rear`&&r.z>100&&r.z<=a))return!0}return!1}function Fu(e,t,n,r=new Set){let i=Math.min(185,e.rail_depth_mm*.52),a=1/0,o=e.rail_depth_mm;for(let s of e.devices)s.u_range[1]<t||s.u_range[0]>n||(s.face===`front`?i=Math.max(i,s.chassis_box.max.z):s.face===`rear`&&!r.has(s.instance_id)&&(a=Math.min(a,s.chassis_box.min.z),o=Math.max(o,s.chassis_box.max.z)));return{maxFrontDeviceZ:i,minRearDeviceZ:a,maxRearDeviceZ:o}}function Iu(e,t,n,r=1/0,i=e.rail_depth_mm,a=0,o=!1){let s=n*3%8;if(r<1/0){let c=Math.max(t+9.2,a),l=r-9.2;if(l>=c&&!o){let e=l-c;if(e>=5.5){let t=Math.min(8,Math.max(2,Math.floor(e/5.5)+1)),r=n*3%t;return{zRear:Y(t<=1?(c+l)*.5:c+r*e/(t-1)),numPlanes:t}}let t=[.5,.15,.85,.35,.65,0,1,.5],r=t[n%t.length];return{zRear:Y(c+e*r),numPlanes:4}}return{zRear:Y(Math.max(i,e.rail_depth_mm)+9.5+s*6.5),numPlanes:8}}let c=Math.max(t+10,Math.min(e.rail_depth_mm-38,196)),l=Math.min(Math.max(c+21,e.rail_depth_mm-8.5),c+52);return{zRear:Y(c+s*(Math.max(c+14,l)-c)/7),numPlanes:8}}function Lu(e,t,n,r,i,a=`front`){let o=(e.u_range[0]-1)*p,s=e.u_range[1]*p;if(a===`rear`){if(e.u_range[1]-e.u_range[0]>=1){let e=t-o<38?[o+8,o+15.5,o+41.5,s-5.5]:[s-5.5,s-13,o+42.5,o+8],n=e[r%e.length];return Y(Math.max(4,Math.min(i-4,n)))}let n=[s-4.5,s-11.5,Math.min(i-4,s+3),o+5.5],a=n[r%n.length];return Y(Math.max(4,Math.min(i-4,a)))}let c=n>t+8?s<=i-3:n<t-8?!1:t-o>s-t,l=Math.min(i-4,s-3.6),u=Math.min(i-3,s+3.4),d=Math.min(i-4,s-7),f=Math.min(i-3,s+6.8),m=Math.max(4,o+3.6),h=Math.max(3,o-3.4),g=Math.max(4,o+7),_=Math.max(3,o-6.8),v=c?[l,u,d,f,m,h]:[m,h,g,_,l,u];return Y(v[r%v.length])}function Ru(e,t,n,r,i,a=[]){let o=n.devices_by_id.get(e.from.instance_id),s=n.devices_by_id.get(e.to.instance_id);if(!o||!s)return null;let c=o.parent_carrier_id?n.devices_by_id.get(o.parent_carrier_id):void 0,l=s.parent_carrier_id?n.devices_by_id.get(s.parent_carrier_id):void 0,u=au(o,e.from.port_id,e.from.face,c),d=au(s,e.to.port_id,e.to.face,l);if(!u||!d)return null;let f=u.world_position,m=u.world_normal,h=d.world_position,g=d.world_normal,_=Kl(f,ql(m,10)),v=Kl(h,ql(g,10)),y=xu(e.cable_type),b=Su(o,u,e.from.face),x=Su(s,d,e.to.face),S=u.world_face===d.world_face,C=b===x,w=b===`rear`&&m.z<0,T=x===`rear`&&g.z<0,E=Math.abs(f.y-h.y),D=Math.abs(f.x-h.x),O=Math.abs(f.z-h.z),k=Math.abs(o.u_position-s.u_position),A=k<=1||k===2&&S&&b===`front`&&D<=55&&E<=95&&o.parent_carrier_id===null&&s.parent_carrier_id===null,j=S&&b===`front`&&k===1&&o.parent_carrier_id===null&&s.parent_carrier_id===null;if(S&&C&&!w&&!T&&A&&E<=95&&O<=160&&(o.u_position!==s.u_position||o.face===s.face)&&(D<=55||o.u_position===s.u_position||j)){let t=`PATCH:${b}:${Math.min(o.u_position,s.u_position)}`,r=i.get(t)??0;i.set(t,r+1);let m=gu(r),g=Math.min(o.u_position,s.u_position),y=`BRIDGE:${b}:${g}`,x=i.get(y)??0;b===`front`&&(D>55||o.u_position===s.u_position)&&i.set(y,x+1);let S=Nu(n,f,u.world_face,h.y,1),C=Nu(n,h,d.world_face,f.y,1),w=S!==f.x||C!==h.x,T=e=>{if(b===`front`){if(D<=55&&o.u_position!==s.u_position){let t=w?[-24,-31,-38,-45,-17]:[-17,-24,-31,-38,-45],n=t[e%t.length],r=!w&&e===0?Y(_.z-5):n,i=!w&&e===0?Y(v.z-5):n,a=Z(f.x,f.y,r),o=Z(h.x,h.y,i),s=Z(Y((_.x+v.x)/2),Y((_.y+v.y)/2),n);return[f,_,a,s,o,v,h]}let t=x+e,r=[-23.5,-29.8,-36.1,-42.4,-17.5,-45.5],i=r[t%r.length],a=[-3.6,3.6,-10.2,10.2,0,-6.8,6.8],c=o.u_position===s.u_position?Y((g-1)*p+5+t%4*6.8):Y(g*p+a[t%a.length]),l=Nu(n,f,`front`,c,1),u=Nu(n,h,`front`,c,1);return[f,_,Z(f.x,f.y,i),Z(l,f.y,i),Z(l,c,i),Z(u,c,i),Z(u,h.y,i),Z(h.x,h.y,i),v,h]}let t=r+e,i=Y(Math.max(_.z,v.z)+10+t%6*6.8);if(D<=28&&O<=15){let e=Z(f.x,f.y,Y(_.z+6)),t=Z(h.x,h.y,Y(v.z+6)),n=Z(Y((_.x+v.x)/2),Y((_.y+v.y)/2),i);return[f,_,e,n,t,v,h]}if(o.u_position===s.u_position){if(!Pu(n,`rear`,f.y,f.x,h.x,i,f,h)&&Math.abs(f.y-h.y)<=6)return[f,_,Z(f.x,f.y,i),Z(h.x,h.y,i),v,h];let e=(c??o).u_range[1]*p,r=Y(Math.min(e-3.5,Math.max(f.y,h.y)+8.5+t%2*6));return[f,_,Z(f.x,f.y,i),Z(f.x,r,i),Z(h.x,r,i),Z(h.x,h.y,i),v,h]}if(h.z>=n.rail_depth_mm-2&&f.z<n.rail_depth_mm-15){let e=Y(_.z+8),t=l??s,n=Y(h.y>=f.y?t.chassis_box.min.y-8.5:t.chassis_box.max.y+8.5);return[f,_,Z(f.x,f.y,e),Z(f.x,n,e),Z(h.x,n,e),Z(h.x,n,i),Z(h.x,h.y,i),v,h]}if(f.z>=n.rail_depth_mm-2&&h.z<n.rail_depth_mm-15){let e=Y(v.z+8),t=c??o,n=Y(h.y>=f.y?t.chassis_box.max.y+8.5:t.chassis_box.min.y-8.5);return[f,_,Z(f.x,f.y,i),Z(f.x,n,i),Z(f.x,n,e),Z(h.x,n,e),Z(h.x,h.y,e),v,h]}let a=Z(f.x,f.y,i),u=Z(h.x,h.y,i);return[f,_,a,Z(h.x,f.y,i),u,v,h]},E=T(0),k=vu(E,8),A=ju(k,a),j=ku(k,n,o.instance_id,s.instance_id,f,h,null);if(A<6.2||j<9)for(let e=1;e<12;e++){let t=T(e),r=vu(t,8),i=ku(r,n,o.instance_id,s.instance_id,f,h,null);if(i<j)continue;let c=ju(r,a);if((i>j||i>=j&&c>A)&&(j=i,A=c,E=t),A>=6.2&&j>=9)break}let M=vu(E,32),N=yu(M),{requiredLengthMm:P,recommendedCommercialMm:F}=bu(N);return{cable_id:e.cable_id,cable_type:e.cable_type,color_hex:e.color_hex,label:e.label,route_case:`direct-vertical-patch`,assigned_ducts:[],bundle_index:r,bundle_offset_mm:m,portal_u:null,waypoints:_u(E),spline_points:M,raw_arc_length_mm:N,required_length_mm:P,recommended_commercial_mm:F}}if(C){let t=e.routing_mode??`shortest-direct`,r=b===`front`?t===`left-duct`||t===`shortest-direct`&&y?`FL`:`FR`:t===`left-duct`||t===`shortest-direct`&&y?`RL`:`RR`,x=i.get(r)??0;i.set(r,x+1);let S=gu(x),C=b===`front`?`PLANE:FRONT`:`PLANE:REAR`,E=i.get(C)??0,D=Math.min(o.u_position,s.u_position),O=Math.max(o.u_position,s.u_position),k=h.x>=f.x?1:-1,A=h.y>=f.y?1:-1,j=Y((n.panel_width_mm-n.aperture_width_mm)/2+6),M=[j,Y(j+6.5),Y(j+13)],N=e=>{let r=E+e,i=M[Math.floor(r/2)%M.length],a=Y(i),y=Y(n.panel_width_mm-i),S=Math.abs(f.x-a)+Math.abs(h.x-a)<=Math.abs(f.x-y)+Math.abs(h.x-y)?a:y,C=t===`left-duct`?a:t===`right-duct`?y:S;if(b===`front`){let i=[-24,-30.5,-37,-18.8,-43.5,-21.5,-27.2,-33.8],a=i[r%i.length],u=Nu(n,f,`front`,h.y,k),d=Nu(n,h,`front`,f.y,-k);if(t===`left-duct`||t===`right-duct`){let e=Math.floor(r/i.length),t=Lu(c??o,f.y,h.y,e,n.total_height_mm,`front`),p=Lu(l??s,h.y,f.y,e,n.total_height_mm,`front`);return[f,_,Z(f.x,f.y,a),Z(u,f.y,a),Z(u,t,a),Z(C,t,a),Z(C,p,a),Z(d,p,a),Z(d,h.y,a),Z(h.x,h.y,a),v,h]}if(Math.abs(u-d)<=16&&e<8)return[f,_,Z(f.x,f.y,a),Z(u,f.y,a),Z(d,h.y,a),Z(h.x,h.y,a),v,h];let m=Math.floor(e/i.length),g=((c??o).u_range[0]-1)*p,y=(c??o).u_range[1]*p,b=A>0?y+(m%2==0?-3.2:3.2):g+(m%2==0?3.2:-3.2),x=Math.min(f.y,h.y),S=Math.max(f.y,h.y),w=Y(Math.max(x,Math.min(S,b)));return[f,_,Z(f.x,f.y,a),Z(u,f.y,a),Z(u,w,a),Z(d,w,a),Z(d,h.y,a),Z(h.x,h.y,a),v,h]}let j=f.z>=n.rail_depth_mm-5&&m.z>0,N=h.z>=n.rail_depth_mm-5&&g.z>0,P=Nu(n,f,u.world_face,h.y,k),F=Nu(n,h,d.world_face,f.y,-k);if((w||T)&&!j&&!N){let t=new Set;w&&t.add((c??o).instance_id),T&&t.add((l??s).instance_id);let r=Fu(n,D,O,t),i=Math.min(w?_.z:1/0,T?v.z:1/0,r.minRearDeviceZ-7.5),a=Math.max(w?0:_.z,T?0:v.z,r.maxFrontDeviceZ+7),u=[0,-5.5,5.5,-11,11,-16.5,16.5,-8.2],d=u[e%u.length],p;if(i>=a){let e=(a+i)*.5;p=Y(Math.max(a,Math.min(i,e+d)))}else p=Y(i);let m=w?Math.min(_.z,p):Math.max(_.z,p),g=T?Math.min(v.z,p):Math.max(v.z,p);return e%2==0?[f,_,Z(f.x,f.y,m),Z(P,f.y,m),Z(P,h.y,m),Z(P,h.y,g),Z(h.x,h.y,g),v,h]:[f,_,Z(f.x,f.y,m),Z(F,f.y,m),Z(F,h.y,m),Z(F,h.y,g),Z(h.x,h.y,g),v,h]}let I=Fu(n,j&&A>0?Math.min(O,(c??o).u_range[1]+1):N&&A<0?Math.min(O,(l??s).u_range[1]+1):D,j&&A<0?Math.max(D,(c??o).u_range[0]-1):N&&A>0?Math.max(D,(l??s).u_range[0]-1):O),L=Math.max(j||w?0:_.z,N||T?0:v.z),R=Math.min(I.minRearDeviceZ,w?f.z-2.5:1/0,T?h.z-2.5:1/0),{zRear:z,numPlanes:ee}=Iu(n,I.maxFrontDeviceZ,r,R,I.maxRearDeviceZ,L,e>=16);if(t===`left-duct`||t===`right-duct`){let t=Math.floor(r/3)+e,i=Lu(c??o,f.y,h.y,t,n.total_height_mm,`rear`),a=Lu(l??s,h.y,f.y,t+1,n.total_height_mm,`rear`);return[f,_,Z(f.x,f.y,z),Z(P,f.y,z),Z(P,i,z),Z(C,i,z),Z(C,a,z),Z(F,a,z),Z(F,h.y,z),Z(h.x,h.y,z),v,h]}if(j){let t=Y(_.z+4+r%4*6.5),i=c??o,a=(x+Math.floor(e/2))%4,s=i.chassis_box.max.y+9.5,l=i.chassis_box.min.y-9.5,u=A>=0?s+a*6:l-a*6,d=A>=0?Math.max(s,Math.min(Math.max(s,h.y),u)):Math.min(l,Math.max(Math.min(l,h.y),u)),p=Y(Math.max(5.5,Math.min(n.total_height_mm-5.5,d)));if(e%2==1){if(!Pu(n,`rear`,h.y,P,h.x,z,f,h))return[f,_,Z(f.x,f.y,t),Z(P,f.y,t),Z(P,p,t),Z(P,p,z),Z(P,h.y,z),Z(h.x,h.y,z),v,h];let r=Y(A>=0?Math.max(p,h.y-10.5-(e>>1)%3*6.5):Math.min(p,h.y+10.5+(e>>1)%3*6.5));return[f,_,Z(f.x,f.y,t),Z(P,f.y,t),Z(P,p,t),Z(P,p,z),Z(P,r,z),Z(F,r,z),Z(F,h.y,z),Z(h.x,h.y,z),v,h]}return[f,_,Z(f.x,f.y,t),Z(P,f.y,t),Z(P,p,t),Z(P,p,z),Z(F,p,z),Z(F,h.y,z),Z(h.x,h.y,z),v,h]}if(N){let t=Y(v.z+4+r%4*6.5),i=l??s,a=(x+Math.floor(e/2))%4,o=i.chassis_box.min.y-9.5,c=i.chassis_box.max.y+9.5,u=A>=0?o-a*6:c+a*6,d=A>=0?Math.min(o,Math.max(Math.min(o,f.y),u)):Math.max(c,Math.min(Math.max(c,f.y),u)),p=Y(Math.max(5.5,Math.min(n.total_height_mm-5.5,d)));return[f,_,Z(f.x,f.y,z),Z(P,f.y,z),Z(P,p,z),Z(F,p,z),Z(F,p,t),Z(F,h.y,t),Z(h.x,h.y,t),v,h]}let te=Math.floor(e/ee),ne=Pu(n,`rear`,f.y,f.x,F,z,f,h);if(te===0){if(!ne)return[f,_,Z(f.x,f.y,z),Z(F,f.y,z),Z(F,h.y,z),Z(h.x,h.y,z),v,h];let t=Y(A>0?Math.min(h.y,f.y+9.5+e%3*6.5):Math.max(h.y,f.y-9.5-e%3*6.5));return[f,_,Z(f.x,f.y,z),Z(P,f.y,z),Z(P,t,z),Z(F,t,z),Z(F,h.y,z),Z(h.x,h.y,z),v,h]}if(te===1){if(!Pu(n,`rear`,h.y,P,h.x,z,f,h)&&e%2==0)return[f,_,Z(f.x,f.y,z),Z(P,f.y,z),Z(P,h.y,z),Z(h.x,h.y,z),v,h];let t=Y(A>0?Math.max(f.y,h.y-10.5-e%3*6.5):Math.min(f.y,h.y+10.5+e%3*6.5));return[f,_,Z(f.x,f.y,z),Z(P,f.y,z),Z(P,t,z),Z(F,t,z),Z(F,h.y,z),Z(h.x,h.y,z),v,h]}let re=Y(A>0?Math.min(h.y,f.y+16.5+e%4*6.8):Math.max(h.y,f.y-16.5-e%4*6.8));return[f,_,Z(f.x,f.y,z),Z(P,f.y,z),Z(P,re,z),Z(F,re,z),Z(F,h.y,z),Z(h.x,h.y,z),v,h]},P=0,F=N(0),I=vu(F,8),L=ju(I,a),R=Mu(I,n,f,h),z=ku(I,n,o.instance_id,s.instance_id,f,h,null);if(z<9||L<6.2||R<5.2)for(let e=1;e<28;e++){let t=N(e),r=vu(t,8),i=ku(r,n,o.instance_id,s.instance_id,f,h,null);if(i<z)continue;let c=ju(r,a),l=Mu(r,n,f,h),u=z>=9&&L>=6.2&&R>=5.2,d=i>=9&&c>=6.2&&l>=5.2,p=i>z,m=i>=z;if((p||m&&d&&!u||m&&!u&&c>=6.2&&L<6.2||m&&!u&&c>L&&l>=Math.min(R,5.2))&&(z=i,L=c,R=l,P=e,F=t),z>=9&&L>=6.2&&R>=5.2)break}i.set(C,E+P+1);let ee=vu(F,32),te=yu(ee),{requiredLengthMm:ne,recommendedCommercialMm:re}=bu(te);return{cable_id:e.cable_id,cable_type:e.cable_type,color_hex:e.color_hex,label:e.label,route_case:`same-face-duct`,assigned_ducts:[r],bundle_index:x,bundle_offset_mm:S,portal_u:null,waypoints:_u(F),spline_points:ee,raw_arc_length_mm:te,required_length_mm:ne,recommended_commercial_mm:re}}let M=e.routing_mode??`shortest-direct`,N=M===`left-duct`||M===`shortest-direct`&&y?`FL`:`FR`,P=M===`left-duct`||M===`shortest-direct`&&y?`RL`:`RR`,F=b===`front`?N:P,I=x===`front`?N:P,L=`${F}->${I}`,R=i.get(L)??0;i.set(L,R+1);let z=gu(R),ee=n.devices.filter(e=>e.blueprint.category===`brush-panel`||e.blueprint.geometry.has_cable_pass_through===!0),te=(o.u_position+s.u_position)/2,ne=Math.min(o.u_position,s.u_position),re=Math.max(o.u_position,s.u_position),B;if(e.preferred_portal_u!==void 0&&r.includes(e.preferred_portal_u))B=e.preferred_portal_u;else if(r.length>0){let e=e=>{let t=e<ne?(ne-e)*2:e>re?(e-re)*2:0,n=Math.abs(e-te)*.25,r=ee.some(t=>e>=t.u_range[0]&&e<=t.u_range[1]);return t+n-(r?.85:0)};B=r.reduce((t,n)=>e(n)<e(t)?n:t)}else B=ee.length>0?ee.reduce((e,t)=>Math.abs(t.u_position-te)<Math.abs(e.u_position-te)?t:e).u_position:e.preferred_portal_u??Math.max(1,Math.round(te));let ie=b===`rear`?c??o:l??s,ae=b===`rear`?_.z:v.z,oe=Fu(n,Math.min(B,ie.u_range[0]),Math.max(B,ie.u_range[1])),se=i.get(`PLANE:FRONT`)??0,V=i.get(`PLANE:REAR`)??0,ce=`PORTAL:${B}`,H=i.get(ce)??0,le=(n.panel_width_mm-n.aperture_width_mm)/2,ue=Y(le+16),de=Y(n.panel_width_mm-le-16),fe=e=>{let t=se+e,r=V+e,i=H+e,a=Y((B-.5)*p+(i%3-1)*5),o=h.x>=f.x?1:-1,s=Nu(n,f,u.world_face,a,e%2==0?o:-o),c=Nu(n,h,d.world_face,a,e%2==0?-o:o),l;if(M===`left-duct`)l=Y(ue+i%6*7.5);else if(M===`right-duct`)l=Y(de-i%6*7.5);else{let t=Math.max(ue,Math.min(de,s)),n=[0,7.5,-7.5,15,-15,22.5,-22.5,30],r=n[Math.floor(e/2)%n.length]*o;l=Y(Math.max(ue,Math.min(de,t+r)))}let m=[-24,-30.5,-37,-18.8,-43.5,-21.5,-27.2,-33.8],g=m[t%m.length],{zRear:y}=Iu(n,Math.max(oe.maxFrontDeviceZ,ae-4),r,oe.minRearDeviceZ,oe.maxRearDeviceZ),S=b===`front`?g:y,C=x===`front`?g:y,w=Z(f.x,f.y,S),T=Z(s,f.y,S),E=Math.abs(l-s)<=1?[Z(l,a,S)]:[Z(s,a,S),Z(l,a,S)],D=Z(l,a,b===`front`?-2:17),O=Z(l,a,b===`front`?17:-2),k=Z(l,a,C),A=Math.abs(l-c)<=1?[Z(c,h.y,C),Z(h.x,h.y,C)]:e%2==0?[Z(c,a,C),Z(c,h.y,C),Z(h.x,h.y,C)]:[Z(l,h.y,C),Z(h.x,h.y,C)];return[f,_,w,T,...E,D,O,k,...A,v,h]},pe=0,me=fe(0),he=vu(me,8),ge=ju(he,a),_e=Mu(he,n,f,h),ve=ku(he,n,o.instance_id,s.instance_id,f,h,B);if(ve<9||ge<6.2||_e<5.2)for(let e=1;e<28;e++){let t=fe(e),r=vu(t,8),i=ku(r,n,o.instance_id,s.instance_id,f,h,B);if(i<ve)continue;let c=ju(r,a),l=Mu(r,n,f,h),u=ve>=9&&ge>=6.2&&_e>=5.2,d=i>=9&&c>=6.2&&l>=5.2,p=i>ve,m=i>=ve;if((p||m&&d&&!u||m&&!u&&c>=6.2&&ge<6.2||m&&!u&&c>ge&&l>=Math.min(_e,5.2))&&(ve=i,ge=c,_e=l,pe=e,me=t),ve>=9&&ge>=6.2&&_e>=5.2)break}i.set(`PLANE:FRONT`,se+pe+1),i.set(`PLANE:REAR`,V+pe+1),i.set(ce,H+pe+1);let ye=vu(me,32),be=yu(ye),{requiredLengthMm:xe,recommendedCommercialMm:Se}=bu(be);return{cable_id:e.cable_id,cable_type:e.cable_type,color_hex:e.color_hex,label:e.label,route_case:`cross-face-portal`,assigned_ducts:[F,I],bundle_index:R,bundle_offset_mm:z,portal_u:B,waypoints:_u(me),spline_points:ye,raw_arc_length_mm:be,required_length_mm:xe,recommended_commercial_mm:Se}}function zu(e,t,n){let r=n??su(e,t),i=cu(e,r),a=new Map,o=[];for(let t of e.cables){let n=Ru(t,e,r,i,a,o);n&&o.push(n)}return o}function Bu(e){let t={};for(let[n,r]of e.geometry.devices_by_id.entries())n!==`__proto__`&&n!==`constructor`&&n!==`prototype`&&Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0});return{project:e.project,geometry:{rack:e.geometry.rack,panel_width_mm:e.geometry.panel_width_mm,aperture_width_mm:e.geometry.aperture_width_mm,total_height_mm:e.geometry.total_height_mm,rail_depth_mm:e.geometry.rail_depth_mm,devices:e.geometry.devices,devices_by_id:t},validation:e.validation,cable_routes:e.cable_routes}}function Vu(e,t){if(e.rack.standard!==t.rack.standard||e.rack.u_height!==t.rack.u_height||e.rack.rail_depth_mm!==t.rack.rail_depth_mm||e.rack.enclosure_type!==t.rack.enclosure_type||e.rack.front_door_clearance_mm!==t.rack.front_door_clearance_mm||e.rack.rear_clearance_mm!==t.rack.rear_clearance_mm||e.mounted_devices.length!==t.mounted_devices.length||e.cables.length!==t.cables.length)return!1;for(let n=0;n<e.mounted_devices.length;n++){let r=e.mounted_devices[n],i=t.mounted_devices[n];if(r===void 0||i===void 0||r.instance_id!==i.instance_id||r.blueprint_slug!==i.blueprint_slug||r.u_position!==i.u_position||r.face!==i.face||r.children.length!==i.children.length)return!1;for(let e=0;e<r.children.length;e++){let t=r.children[e],n=i.children[e];if(t===void 0||n===void 0||t.instance_id!==n.instance_id||t.blueprint_slug!==n.blueprint_slug||t.slot_id!==n.slot_id)return!1}}for(let n=0;n<e.cables.length;n++){let r=e.cables[n],i=t.cables[n];if(r===void 0||i===void 0||r.cable_id!==i.cable_id||r.cable_type!==i.cable_type||r.preferred_portal_u!==i.preferred_portal_u||(r.routing_mode??`shortest-direct`)!==(i.routing_mode??`shortest-direct`)||r.from.instance_id!==i.from.instance_id||r.from.port_id!==i.from.port_id||r.from.face!==i.from.face||r.to.instance_id!==i.to.instance_id||r.to.port_id!==i.to.port_id||r.to.face!==i.to.face)return!1}return!0}function Hu(e,t,n){let r=rl.parse(e),i=su(r,t),a=hu(r,t,i),o;if(n!==void 0&&Vu(n.project,r)){let e=new Map(r.cables.map(e=>[e.cable_id,e]));o=n.cable_routes.map(t=>{let n=e.get(t.cable_id);return n===void 0?t:{...t,color_hex:n.color_hex,label:n.label}})}else o=zu(r,t,i);return{project:r,geometry:i,validation:a,cable_routes:o}}var Uu=[{relativePath:`catalog/10inch/3dprint-10inch-cover-panel-hex-1u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "3dprint-10inch-cover-panel-hex-1u"
manufacturer: "Community 3D-Print"
model: "10-Inch 1U Designer Cover Panel (Hexagonal Honeycomb Relief)"
description: "3D-druckbares 10-Zoll 1U Cover-Panel (PETG/PLA/ASA, rückseitig geschlossen ohne Kabeldurchlass) mit eingelassenem sechseckigem Wabenmuster (Honeycomb-Relief) auf der Vorderseite. Sorgt für einen modernen Look bei ungenutzten 1U-Frontslots."
category: "blank-panel"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 222.0
  height_mm: 44.0
  depth_mm: 8.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 42
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 42
  material_recommendation: "PETG / PLA"
  fasteners: "4x M6 Cage Nuts & Screws"
  printables_url: "https://www.printables.com/model/10inch-1u-cover-panel-hex"
`},{relativePath:`catalog/10inch/3dprint-10inch-cover-panel-lines-1u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "3dprint-10inch-cover-panel-lines-1u"
manufacturer: "Community 3D-Print"
model: "10-Inch 1U Designer Cover Panel (Horizontal Precision Lines)"
description: "3D-druckbares 10-Zoll 1U Cover-Panel (PETG/PLA/ASA, komplett geschlossene Frontblende ohne Kabeldurchlass) mit feinen horizontalen Design-Rillen und rückseitigen Versteifungsrippen. Verschließt offene Slots (z. B. über der USV, wenn hinten eine Steckdosenleiste sitzt) für eine saubere, geschlossene Frontansicht."
category: "blank-panel"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 222.0
  height_mm: 44.0
  depth_mm: 8.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 45
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 45
  material_recommendation: "PETG / PLA"
  fasteners: "4x M6 Cage Nuts & Screws"
  printables_url: "https://www.printables.com/model/10inch-1u-cover-panel-lines"
`},{relativePath:`catalog/10inch/3dprint-10inch-cover-panel-lines-2u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "3dprint-10inch-cover-panel-lines-2u"
manufacturer: "Community 3D-Print"
model: "10-Inch 2U Designer Cover Panel (Horizontal Precision Lines)"
description: "3D-druckbares 10-Zoll 2U Cover-Panel (88.1mm Höhe, PETG/PLA/ASA, geschlossen ohne Kabeldurchlass) mit durchgehenden horizontalen Präzisionslinien und rückseitigem Versteifungsrahmen zum Verschließen größerer 2U-Lücken."
category: "blank-panel"
mount_type: "rackmount-10"
geometry:
  u_height: 2.0
  width_mm: 222.0
  height_mm: 88.1
  depth_mm: 8.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 85
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 85
  material_recommendation: "PETG / PLA"
  fasteners: "4x M6 Cage Nuts & Screws"
  printables_url: "https://www.printables.com/model/10inch-2u-cover-panel-lines"
`},{relativePath:`catalog/10inch/3dprint-10inch-cover-panel-ribs-2u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "3dprint-10inch-cover-panel-ribs-2u"
manufacturer: "Community 3D-Print"
model: "10-Inch 2U Designer Cover Panel (Vertical Tech-Ribs)"
description: "3D-druckbares 10-Zoll 2U Cover-Panel (88.1mm Höhe, PETG/PLA, geschlossen ohne Kabeldurchlass) im silbergrauen UniFi-Stil mit vertikalen Tech-Rippen und umlaufender Schattenfuge."
category: "blank-panel"
mount_type: "rackmount-10"
geometry:
  u_height: 2.0
  width_mm: 222.0
  height_mm: 88.1
  depth_mm: 8.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 88
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 88
  material_recommendation: "PETG / PLA"
  fasteners: "4x M6 Cage Nuts & Screws"
  printables_url: "https://www.printables.com/model/10inch-2u-cover-panel-ribs"
`},{relativePath:`catalog/10inch/brennenstuhl-10inch-pdu-6way-iec-c13.yaml`,categoryDir:`10inch`,rawYaml:`slug: "brennenstuhl-10inch-pdu-6way-iec-c13"
manufacturer: "Brennenstuhl"
model: "Alu-Line 10-Inch 1U 6-Way IEC-C13 PDU"
description: "Flache 10-Zoll 1U Kaltgeräte-Steckdosenleiste (PDU, eloxiertes Aluminiumprofil, 48mm Bautiefe) mit 6x IEC-C13 Ausgängen und 1x rückseitigem IEC-C14 Stromeingang zur direkten Anbindung an eine USV. Ideal für enge 10-Zoll-Racks, da Kaltgerätestecker deutlich weniger Platz benötigen als große Schuko-Steckernetzteile."
category: "pdu"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 222.0
  height_mm: 44.0
  depth_mm: 48.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 440
power_and_thermal:
  electrical_role: "pdu"
  idle_watts: 0
  max_system_watts: 0
  pdu_capacity_watts: 2300
  airflow: "passive-convection"
port_groups:
  - id_prefix: "iec_out"
    label_prefix: "C13 Outlet "
    start_index: 1
    count: 6
    face: "front"
    connector_type: "iec-c13"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 26.0
      origin_y_mm: 22.0
      columns: 6
      rows: 1
      pitch_x_mm: 28.0
      pitch_y_mm: 0.0
ports:
  - port_id: "ac_in"
    label: "IEC-C14 Mains In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 196.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#334155"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/cyberpower-10inch-ups-1u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "cyberpower-10inch-ups-1u"
manufacturer: "CyberPower"
model: "10-Inch Compact Lithium UPS 500VA/300W 1U"
description: "Kompakte 10-Zoll 1U Unterbrechungsfreie Stromversorgung (USV, 500VA / 300W Lithium) mit 4x IEC-C13 Batterie-Ausgängen hinten. Schützt das gesamte Mini-Rack bei Stromausfall und versorgt die hintere Steckdosenleiste (PDU) sowie das PoE-Netzteil."
category: "ups"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 220.0
  height_mm: 44.0
  depth_mm: 185.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 5.0
  rear_protrusion_mm: 0.0
  weight_grams: 3200
power_and_thermal:
  electrical_role: "ups"
  idle_watts: 5
  max_system_watts: 15
  ups_capacity_watts: 300
  airflow: "front-to-rear"
port_groups:
  - id_prefix: "iec_out"
    label_prefix: "Battery C13-"
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "iec-c13"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 35.0
      origin_y_mm: 22.0
      columns: 4
      rows: 1
      pitch_x_mm: 32.0
      pitch_y_mm: 0.0
ports:
  - port_id: "ac_in"
    label: "AC Mains In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 185.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/deskpi-10inch-patch-panel-12port.yaml`,categoryDir:`10inch`,rawYaml:`slug: "deskpi-10inch-patch-panel-12port"
manufacturer: "DeskPi"
model: "RackMate 10-Inch 12-Port Cat6A Passthrough Patch Panel"
description: "Passives 10-Zoll 1U Cat6A Durchgangs-Patchpanel mit 12 geschirmten RJ45-Buchsen (vorne & hinten steckbar). Dient als sauberer Übergabepunkt zwischen den von hinten kommenden Gerätekabeln/Hausleitungen und den kurzen Patchkabeln zum Switch."
category: "patch-panel"
mount_type: "rackmount-10"
is_passthrough_coupler: true
geometry:
  u_height: 1.0
  width_mm: 222.0
  height_mm: 44.0
  depth_mm: 30.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 310
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
port_groups:
  - id_prefix: "p"
    label_prefix: "Port "
    start_index: 1
    count: 12
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["passthrough-coupler", "10gbase-t", "2500base-t", "1000base-t"]
    orientation: "upright"
    is_passthrough_coupler: true
    grid:
      origin_x_mm: 26.0
      origin_y_mm: 22.0
      columns: 12
      rows: 1
      pitch_x_mm: 15.5
      pitch_y_mm: 0.0
visuals:
  chassis_color_hex: "#111827"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/digitus-10inch-pdu-4way-schuko.yaml`,categoryDir:`10inch`,rawYaml:`slug: "digitus-10inch-pdu-4way-schuko"
manufacturer: "Digitus"
model: "10-Inch 1U 4-Way Socket Strip (DN-95411)"
description: "10-Zoll 1U 4-fach Schuko-Steckdosenleiste (PDU, Aluminiumgehäuse, bis 3600W). Wird meist rückseitig im Rack montiert, um die Netzteile von Mini-PCs, Routern und Switches zentral über die USV mit Strom zu versorgen."
category: "pdu"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 220.0
  height_mm: 44.0
  depth_mm: 55.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 480
power_and_thermal:
  electrical_role: "pdu"
  idle_watts: 0
  max_system_watts: 0
  pdu_capacity_watts: 3600
  airflow: "passive-convection"
port_groups:
  - id_prefix: "outlet"
    label_prefix: "Schuko "
    start_index: 1
    count: 4
    face: "front"
    connector_type: "schuko-cee7"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 32.0
      origin_y_mm: 22.0
      columns: 4
      rows: 1
      pitch_x_mm: 44.0
      pitch_y_mm: 0.0
ports:
  - port_id: "mains_in"
    label: "230V AC Input"
    face: "front"
    connector_type: "schuko-cee7"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 190.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#374151"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/generic-10inch-blank-panel-1u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "generic-10inch-blank-panel-1u"
manufacturer: "Generic"
model: "10-Inch 1U Steel Blanking Panel"
description: "10-Zoll 1U Blindabdeckung aus pulverbeschichtetem Stahl. Verschließt ungenutzte Höheneinheiten für eine saubere Optik und gerichtete Luftführung (Airflow) im Rack."
category: "blank-panel"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 222.0
  height_mm: 44.0
  depth_mm: 10.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 140
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#1F2937"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/generic-10inch-brush-panel-1u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "generic-10inch-brush-panel-1u"
manufacturer: "Generic"
model: "10-Inch 1U Cable Management Brush Strip Panel"
description: "10-Zoll 1U Bürstenleiste (Brush Panel) mit zweireihigen Nylonborsten. Ermöglicht die saubere Durchführung von Patch- und Stromkabeln zwischen Vorder- und Rückseite des Racks ohne Staub- oder Luftkurzschluss."
category: "brush-panel"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 222.0
  height_mm: 44.0
  depth_mm: 15.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 160
  has_cable_pass_through: true
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
visuals:
  chassis_color_hex: "#111827"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/generic-10inch-shelf-1u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "generic-10inch-shelf-1u"
manufacturer: "Generic"
model: "10-Inch 1U Vented Cantilever Equipment Shelf"
description: "Belüfteter 10-Zoll 1U Fachboden (Cantilever Shelf, 180mm Tiefe) aus Stahlblech. Ideal zum Aufstellen von Geräten ohne eigene Rack-Ohren (z. B. Desktop-Switches, Glasfaser-Modems oder externe Festplatten)."
category: "shelf"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 180.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 450
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
slots:
  - slot_id: "shelf-tray-1"
    accepted_slot_type: "open-shelf-area"
    offset_mm:
      x: 18.0
      y: 2.0
      z: 0.0
    max_dimensions_mm:
      width: 218.0
      height: 40.0
      depth: 175.0
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/mikrotik-crs309-1g-8s-plus-in.yaml`,categoryDir:`10inch`,rawYaml:`slug: "mikrotik-crs309-1g-8s-plus-in"
manufacturer: "MikroTik"
model: "CRS309-1G-8S+IN (8x 10G SFP+ Aggregation Switch)"
description: "Lüfterloser 10-Zoll 1U 10-Gigabit Aggregation Switch mit 8x 10G SFP+ Einschüben, 1x 1GbE RJ45 Management-/PoE-In-Port, RS232-Seriell-Konsole und Dual-Boot (RouterOS / SwOS). Das CNC-gefräste Metallgehäuse dient gleichzeitig als passiver Kühlkörper (0 dB(A) lautlos) und wird mit beiliegenden Montagewinkeln im 10-Zoll-Rack verschraubt."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 220.0
  height_mm: 41.0
  depth_mm: 141.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 820
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 10
  max_system_watts: 23
  airflow: "passive-convection"
port_groups:
  - id_prefix: "sfp"
    label_prefix: "SFP+ "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    orientation: "upright"
    grid:
      origin_x_mm: 22.0
      origin_y_mm: 20.0
      columns: 8
      rows: 1
      pitch_x_mm: 16.5
      pitch_y_mm: 0.0
ports:
  - port_id: "eth1"
    label: "ETH1 / PoE-In"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 166.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "console"
    label: "RS232 Console"
    face: "front"
    connector_type: "rj45-serial-console"
    direction: "bidirectional"
    capabilities: ["serial-rs232"]
    coordinates:
      x_mm: 192.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "dc_in1"
    label: "DC1 12-57V"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 170.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "pwr_in"
    label: "AC Adapter In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 198.0
      y_mm: 20.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#D1D5DB"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/mikrotik-crs310-8g-plus-2s-plus-in.yaml`,categoryDir:`10inch`,rawYaml:`slug: "mikrotik-crs310-8g-plus-2s-plus-in"
manufacturer: "MikroTik"
model: "CRS310-8G+2S+IN (8x 2.5G RJ45 + 2x 10G SFP+ Switch)"
description: "Managed 8-Port 2.5-Gbit/s RJ45 + 2-Port 10G SFP+ Switch im Metallgehäuse. Wird inklusive passender Rack-Montagewinkel geliefert und eignet sich als schneller 2.5G/10G Core-Switch für 10-Zoll- und 19-Zoll-Racks."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 200.0
  height_mm: 44.0
  depth_mm: 206.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 880
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 10
  max_system_watts: 34
  airflow: "front-to-rear"
  noise_db_a: 28.0
port_groups:
  - id_prefix: "eth"
    label_prefix: "2.5G ETH"
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 26.0
      origin_y_mm: 20.0
      columns: 8
      rows: 1
      pitch_x_mm: 15.0
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp_plus1"
    label: "10G SFP+ 1"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 154.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "sfp_plus2"
    label: "10G SFP+ 2"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 174.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "24V DC Input"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 170.0
      y_mm: 20.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/mikrotik-rb5009upr-s-in.yaml`,categoryDir:`10inch`,rawYaml:`slug: "mikrotik-rb5009upr-s-in"
manufacturer: "MikroTik"
model: "RB5009UPr+S+IN (PoE-In/Out Router)"
description: "Hochleistungs-Router (RB5009UPr+S+IN) im kompakten Metallgehäuse mit 1x 10G SFP+, 1x 2.5G RJ45 und 7x 1G RJ45 Ports (alle 8 RJ45 Ports mit PoE-In & PoE-Out bis 130W Gesamtbudget). Direkt im 10-Zoll-Rack verschraubbar."
category: "router"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 220.0
  height_mm: 44.0
  depth_mm: 125.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 754
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 12
  max_system_watts: 20
  poe_budget_watts: 130
  airflow: "passive-convection"
port_groups:
  - id_prefix: "eth"
    label_prefix: "ETH "
    start_index: 2
    count: 7
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at", "poe-in-af", "poe-in-at"]
    orientation: "upright"
    grid:
      origin_x_mm: 68.0
      origin_y_mm: 20.0
      columns: 7
      rows: 1
      pitch_x_mm: 16.0
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp_plus1"
    label: "10G SFP+"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 25.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "eth1"
    label: "2.5G ETH1"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 48.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "usb1"
    label: "USB 3.0"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 192.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "pwr_in"
    label: "AC/DC Input"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 190.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#1F2937"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/netgear-gs108pp-10inch-poe-plus.yaml`,categoryDir:`10inch`,rawYaml:`slug: "netgear-gs108pp-10inch-poe-plus"
manufacturer: "Netgear"
model: "ProSAFE GS108PP 8-Port Gigabit PoE+ Switch (123W, 10-Inch Mount)"
description: "Lüfterloser 8-Port Gigabit High-Power PoE+ Switch im robusten dunkelblauen Metallgehäuse (123W PoE-Gesamtbudget, 8x 802.3at/af PoE+ Ports bis 30W pro Port). Passt mit 10-Zoll-Montagewinkeln direkt in eine 1U-Etage eines 10-Zoll-Mini-Racks."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 220.0
  height_mm: 27.0
  depth_mm: 102.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 600
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 5
  max_system_watts: 12
  poe_budget_watts: 123
  airflow: "passive-convection"
port_groups:
  - id_prefix: "eth"
    label_prefix: "PoE+ "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at"]
    orientation: "upright"
    grid:
      origin_x_mm: 42.0
      origin_y_mm: 13.5
      columns: 8
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "dc_in"
    label: "54V 130W DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 165.0
      y_mm: 13.5
      orientation: "upright"
  - port_id: "pwr_in"
    label: "AC Power Brick In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 192.0
      y_mm: 13.5
      orientation: "upright"
visuals:
  chassis_color_hex: "#1E293B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/qnap-ts-433-10inch-3u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "qnap-ts-433-10inch-3u"
manufacturer: "QNAP"
model: "TS-433 4-Bay 2.5GbE ARM NAS (10-Inch 3U Mount)"
description: "Kompaktes 4-Bay 3,5-Zoll SATA-NAS (RAID 5 / RAID 6 / ZFS-Snapshots) mit Quad-Core Cortex-A55 Prozessor, integrierter NPU für KI-Fotoerkennung (QuMagie), 1x 2.5GbE RJ45 + 1x 1GbE RJ45 für SMB-Multichannel oder Link-Aggregation. Passt auf einem 10-Zoll 3U-Montagerahmen exakt in 10-Zoll-Racksab 240mm Tiefe."
category: "nas"
mount_type: "rackmount-10"
geometry:
  u_height: 3.0
  width_mm: 220.0
  height_mm: 132.0
  depth_mm: 219.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 2650
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 11
  max_system_watts: 35
  airflow: "front-to-rear"
  noise_db_a: 21.5
ports:
  - port_id: "usb_front"
    label: "USB 3.2 Copy"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 195.0
      y_mm: 28.0
      orientation: "upright"
  - port_id: "lan1_25g"
    label: "2.5GbE LAN 1"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 155.0
      y_mm: 52.0
      orientation: "upright"
  - port_id: "lan2_1g"
    label: "1GbE LAN 2"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 155.0
      y_mm: 32.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V 90W DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 185.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "pwr_in"
    label: "AC Power Brick In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 185.0
      y_mm: 48.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E2E8F0"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/synology-ds224-plus-10inch-2u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "synology-ds224-plus-10inch-2u"
manufacturer: "Synology"
model: "DiskStation DS224+ 2-Bay NAS (10-Inch 2U Rack Tray)"
description: "Kompaktes 2-Bay NAS-Speichersystem (Synology DiskStation DS224+, 2x 1GbE LAN) für Backups, Container und Netzwerkspeicher. Belegt 2 Höheneinheiten (2U) auf einem passgenauen 10-Zoll-Rack-Träger."
category: "nas"
mount_type: "rackmount-10"
geometry:
  u_height: 2.0
  width_mm: 222.0
  height_mm: 88.0
  depth_mm: 232.5
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 2100
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 7
  max_system_watts: 18
  airflow: "front-to-rear"
  noise_db_a: 22.0
ports:
  - port_id: "usb_front_1"
    label: "USB 3.2 Copy"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 188.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "lan1"
    label: "1GbE LAN 1"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 162.0
      y_mm: 32.0
      orientation: "upright"
  - port_id: "lan2"
    label: "1GbE LAN 2"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 180.0
      y_mm: 32.0
      orientation: "upright"
  - port_id: "usb_rear_1"
    label: "USB 3.2 Rear"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 162.0
      y_mm: 52.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V 60W DC"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 180.0
      y_mm: 16.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/tp-link-tl-sg2210mp.yaml`,categoryDir:`10inch`,rawYaml:`slug: "tp-link-tl-sg2210mp"
manufacturer: "TP-Link"
model: "Omada JetStream TL-SG2210MP (8x 1G PoE+ 150W + 2x SFP)"
description: "Managed 10-Zoll/19-Zoll PoE+ Switch (Omada JetStream TL-SG2210MP) im Metallgehäuse mit 8x Gigabit PoE+ Ports (150W PoE-Budget) und 2x Gigabit SFP-Slots inklusive Metall-Rackwinkeln."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 220.0
  height_mm: 44.0
  depth_mm: 180.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 1250
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 11
  max_system_watts: 23
  poe_budget_watts: 150
  airflow: "side-to-side"
  noise_db_a: 32.0
port_groups:
  - id_prefix: "eth"
    label_prefix: "PoE+ "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["100base-tx", "1000base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at"]
    orientation: "upright"
    grid:
      origin_x_mm: 28.0
      origin_y_mm: 20.0
      columns: 8
      rows: 1
      pitch_x_mm: 15.5
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp1"
    label: "SFP 9"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["1000base-t", "10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 164.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "sfp2"
    label: "SFP 10"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["1000base-t", "10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 184.0
      y_mm: 20.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 185.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#1F2937"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/ubiquiti-ucg-fiber.yaml`,categoryDir:`10inch`,rawYaml:`slug: "ubiquiti-ucg-fiber"
manufacturer: "Ubiquiti"
model: "UniFi Cloud Gateway Fiber (UCG-Fiber)"
description: "Hochleistungs-10G-Glasfaser- & 2.5G-Cloud-Gateway mit 5 Gbit/s IDS/IPS-Routing, 4x 2.5GbE RJ45 LAN (davon 1x PoE+ Out), 1x 10GbE RJ45 WAN, 2x 10G SFP+ Ports (WAN/LAN) und integriertem NVMe-Steckplatz für UniFi Protect Kameras. Sitzt im 10-Zoll-Rack passgenau in einer 3D-gedruckten 1U-PETG-Aufnahmehalterung."
category: "router"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 212.8
  height_mm: 30.0
  depth_mm: 127.6
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 680
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 11
  max_system_watts: 25
  poe_budget_watts: 30
  airflow: "passive-convection"
port_groups:
  - id_prefix: "lan"
    label_prefix: "2.5G LAN "
    start_index: 1
    count: 4
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-out", "poe+", "poe-out-at"]
    orientation: "upright"
    grid:
      origin_x_mm: 58.0
      origin_y_mm: 15.0
      columns: 4
      rows: 1
      pitch_x_mm: 16.5
      pitch_y_mm: 0.0
ports:
  - port_id: "wan1"
    label: "10G RJ45 WAN"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "10gbase-t"]
    coordinates:
      x_mm: 132.0
      y_mm: 15.0
      orientation: "upright"
  - port_id: "sfp_wan"
    label: "10G SFP+ WAN"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 160.0
      y_mm: 15.0
      orientation: "upright"
  - port_id: "sfp_lan"
    label: "10G SFP+ LAN"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 184.0
      y_mm: 15.0
      orientation: "upright"
  - port_id: "pwr_in"
    label: "54V DC / AC Input"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 180.0
      y_mm: 15.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "polycarbonate"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/ubiquiti-usw-flex-2-5g-8-poe.yaml`,categoryDir:`10inch`,rawYaml:`slug: "ubiquiti-usw-flex-2-5g-8-poe"
manufacturer: "Ubiquiti"
model: "UniFi Flex 2.5G PoE (USW-Flex-2.5G-8-PoE)"
description: "Kompakter 8-Port 2.5-Gbit/s PoE++ Switch (bis 196W PoE-Budget) mit 10G SFP+ & 10G RJ45 Uplink-Port zur Versorgung von Access Points, Kameras und Mini-PCs. Wichtiger Montage-Hinweis: Von Haus aus ein reines Desktop-/Wandgerät aus Polycarbonat (212.9×32.5×99.4mm ohne eigene Rack-Ohren) — sitzt im 10-Zoll-Rack daher in einer 3D-gedruckten 1U-PETG-Aufnahmehalterung (Cradle) oder auf einem 1U-Fachboden."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 212.9
  height_mm: 32.5
  depth_mm: 99.4
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 567
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 8
  max_system_watts: 14
  poe_budget_watts: 196
  airflow: "passive-convection"
port_groups:
  - id_prefix: "eth"
    label_prefix: "Port "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at", "poe-out-bt-type3"]
    orientation: "upright"
    grid:
      origin_x_mm: 30.0
      origin_y_mm: 16.0
      columns: 8
      rows: 1
      pitch_x_mm: 14.5
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp1"
    label: "10G SFP+"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 162.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth9"
    label: "10G RJ45/PoE-In"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["2500base-t", "10gbase-t", "poe-in-bt-type4"]
    coordinates:
      x_mm: 185.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "pwr_in"
    label: "AC/DC Input"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 180.0
      y_mm: 16.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/ubiquiti-usw-lite-8-poe.yaml`,categoryDir:`10inch`,rawYaml:`slug: "ubiquiti-usw-lite-8-poe"
manufacturer: "Ubiquiti"
model: "UniFi Switch Lite 8 PoE (USW-Lite-8-PoE)"
description: "Kompakter 8-Port Gigabit-Switch (davon 4x PoE+ bis 52W Gesamtbudget). Wichtiger Montage-Hinweis: Von Haus aus ein Desktop-/Wandgerät aus Polycarbonat (200×31×99.6mm ohne eigene Rack-Ohren) — benötigt für den 10-Zoll-Rackeinbau eine 3D-gedruckte 1U-PETG-Halterung oder einen 1U-Fachboden."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 200.0
  height_mm: 31.0
  depth_mm: 99.6
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 295
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 4
  max_system_watts: 8
  poe_budget_watts: 52
  airflow: "passive-convection"
port_groups:
  - id_prefix: "eth"
    label_prefix: "PoE+ "
    start_index: 1
    count: 4
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at"]
    orientation: "upright"
    grid:
      origin_x_mm: 36.0
      origin_y_mm: 15.0
      columns: 4
      rows: 1
      pitch_x_mm: 16.0
      pitch_y_mm: 0.0
  - id_prefix: "eth"
    label_prefix: "GbE "
    start_index: 5
    count: 4
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 106.0
      origin_y_mm: 15.0
      columns: 4
      rows: 1
      pitch_x_mm: 16.0
      pitch_y_mm: 0.0
ports:
  - port_id: "dc_in"
    label: "54V DC"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 174.0
      y_mm: 15.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#F3F4F6"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/10inch/ubiquiti-usw-ultra-60w.yaml`,categoryDir:`10inch`,rawYaml:`slug: "ubiquiti-usw-ultra-60w"
manufacturer: "Ubiquiti"
model: "UniFi Switch Ultra 60W (USW-Ultra-60W)"
description: "Ultrakompakter 8-Port Gigabit Layer-2 PoE+ Switch (52W PoE-Budget mit mitgeliefertem 60W AC-Netzteil, bis 202W via PoE++ Input) mit 7x GbE PoE+ Ausgangsports und 1x GbE PoE++/AC-Eingangsport. Sitzt im 10-Zoll-Rack in einer 3D-gedruckten 1U-PETG-Aufnahmehalterung (Cradle, 76mm Bautiefe — passt selbst in extrem flache Wandgehäuse)."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 203.0
  height_mm: 33.0
  depth_mm: 76.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 320
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 4
  max_system_watts: 9
  poe_budget_watts: 52
  airflow: "passive-convection"
port_groups:
  - id_prefix: "eth"
    label_prefix: "PoE+ Port "
    start_index: 1
    count: 7
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at"]
    orientation: "upright"
    grid:
      origin_x_mm: 28.0
      origin_y_mm: 16.5
      columns: 7
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "eth8"
    label: "Port 8 (PoE++ In)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-bt-type4", "poe-in-bt-type3", "poe-in-at"]
    coordinates:
      x_mm: 168.0
      y_mm: 16.5
      orientation: "upright"
  - port_id: "pwr_in"
    label: "54V 60W DC In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 170.0
      y_mm: 16.5
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/3dprint-19inch-cover-panel-hex-2u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "3dprint-19inch-cover-panel-hex-2u"
manufacturer: "Community 3D-Print"
model: "19-Inch 2U Designer Cover Panel (Hexagonal Honeycomb Relief)"
description: "3D-druckbares 19-Zoll 2U Cover-Panel (88.1mm Höhe, PETG/ASA, rückseitig geschlossen ohne Kabeldurchlass) mit eingelassenem Waben-Relief für 2U-Lücken im 19-Zoll-Serverschrank."
category: "blank-panel"
mount_type: "rackmount-19"
geometry:
  u_height: 2.0
  width_mm: 442.4
  height_mm: 88.1
  depth_mm: 8.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 160
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 160
  material_recommendation: "PETG / ASA"
  fasteners: "4x M6 Cage Nuts & Screws"
  printables_url: "https://www.printables.com/model/19inch-2u-cover-panel-hex"
`},{relativePath:`catalog/19inch/3dprint-19inch-cover-panel-lines-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "3dprint-19inch-cover-panel-lines-1u"
manufacturer: "Community 3D-Print"
model: "19-Inch 1U Designer Cover Panel (Horizontal Precision Lines)"
description: "3D-druckbares 19-Zoll 1U Cover-Panel (PETG/ASA, geschlossene Frontfläche ohne Kabeldurchlass) mit feinen horizontalen Präzisionsrillen für freie 19-Zoll-Höheneinheiten."
category: "blank-panel"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 44.0
  depth_mm: 8.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 85
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 85
  material_recommendation: "PETG / ASA"
  fasteners: "4x M6 Cage Nuts & Screws"
  printables_url: "https://www.printables.com/model/19inch-1u-cover-panel-lines"
`},{relativePath:`catalog/19inch/apc-smart-ups-1500-2u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "apc-smart-ups-1500-2u"
manufacturer: "APC"
model: "Smart-UPS 1500VA LCD RM 2U (SMT1500RMI2UC)"
description: "Enterprise 19-Zoll 2U Line-Interactive USV (APC Smart-UPS 1500VA / 1000W, 477mm Tiefe) mit LCD-Statusdisplay und 8x IEC-C13 Batterieausgängen für tiefe Serverschränke (ab 600mm Schranktiefe)."
category: "ups"
mount_type: "rackmount-19"
geometry:
  u_height: 2.0
  width_mm: 432.0
  height_mm: 86.0
  depth_mm: 477.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 12.0
  rear_protrusion_mm: 0.0
  weight_grams: 24000
power_and_thermal:
  electrical_role: "ups"
  idle_watts: 18
  max_system_watts: 45
  ups_capacity_watts: 1000
  airflow: "front-to-rear"
port_groups:
  - id_prefix: "iec_out"
    label_prefix: "OUT "
    start_index: 1
    count: 8
    face: "rear"
    connector_type: "iec-c13"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 120.0
      origin_y_mm: 28.0
      columns: 4
      rows: 2
      pitch_x_mm: 38.0
      pitch_y_mm: 30.0
ports:
  - port_id: "ac_in"
    label: "AC INPUT"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 60.0
      y_mm: 43.0
      orientation: "upright"
  - port_id: "smartconnect_eth"
    label: "SmartConnect"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 360.0
      y_mm: 43.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/apc-smart-ups-li-ion-short-depth-2u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "apc-smart-ups-li-ion-short-depth-2u"
manufacturer: "APC"
model: "Smart-UPS Li-Ion 1500VA Short-Depth Network RM 2U (SMTL1500RMI2UC)"
description: "Kurztiefe 19-Zoll 2U Lithium-Ionen Enterprise-USV (APC Smart-UPS Short-Depth, 1500VA / 1200W, nur 290mm Einbautiefe) mit 6x IEC-C13 Ausgängen und 2x geregelten 20V-DC-Ausgängen — speziell für kompakte 400mm–450mm tiefe 19-Zoll-Wand- und Netzwerkschränke."
category: "ups"
mount_type: "rackmount-19"
geometry:
  u_height: 2.0
  width_mm: 442.4
  height_mm: 86.0
  depth_mm: 290.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 18500
power_and_thermal:
  electrical_role: "ups"
  idle_watts: 15
  max_system_watts: 35
  ups_capacity_watts: 1200
  airflow: "front-to-rear"
port_groups:
  - id_prefix: "iec_out"
    label_prefix: "IEC OUT "
    start_index: 1
    count: 6
    face: "rear"
    connector_type: "iec-c13"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 112.0
      origin_y_mm: 28.0
      columns: 3
      rows: 2
      pitch_x_mm: 38.0
      pitch_y_mm: 28.0
ports:
  - port_id: "ac_in"
    label: "Mains AC Input"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 52.0
      y_mm: 43.0
      orientation: "upright"
  - port_id: "dc_out1"
    label: "20V Regulated DC Out 1 (PVE1)"
    face: "rear"
    connector_type: "dc-5525"
    direction: "output"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 270.0
      y_mm: 56.0
      orientation: "upright"
  - port_id: "dc_out2"
    label: "20V Regulated DC Out 2 (PVE2)"
    face: "rear"
    connector_type: "dc-5525"
    direction: "output"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 306.0
      y_mm: 56.0
      orientation: "upright"
  - port_id: "smartconnect_eth"
    label: "SmartConnect Mgmt"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 365.0
      y_mm: 43.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/brennenstuhl-19inch-pdu-8way-schuko-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "brennenstuhl-19inch-pdu-8way-schuko-1u"
manufacturer: "Brennenstuhl"
model: "Alu-Line 19-Inch 1U 8-Way Schuko Socket Strip (PDU)"
description: "Robuste 19-Zoll 1U 8-fach Schuko-Steckdosenleiste (PDU, mattschwarzes/silbernes Aluminiumprofil, bis 3500W / 16A) mit 8x um 45° gedrehten Schutzkontakt-Steckdosen und rückseitigem IEC-C14 Stromeingang zur Anbindung an eine 19-Zoll USV."
category: "pdu"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 44.0
  depth_mm: 54.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 890
power_and_thermal:
  electrical_role: "pdu"
  idle_watts: 0
  max_system_watts: 0
  pdu_capacity_watts: 3500
  airflow: "passive-convection"
port_groups:
  - id_prefix: "outlet"
    label_prefix: "Schuko "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "schuko-cee7"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 52.0
      origin_y_mm: 22.0
      columns: 8
      rows: 1
      pitch_x_mm: 46.0
      pitch_y_mm: 0.0
ports:
  - port_id: "ac_in"
    label: "IEC-C14 Mains In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 410.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#374151"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/fortinet-fortigate-200f-ngfw-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "fortinet-fortigate-200f-ngfw-1u"
manufacturer: "Fortinet"
model: "FortiGate 200F Enterprise Next-Gen Firewall (1U)"
description: "19-Zoll 1U Enterprise Next-Generation Firewall (FortiGate 200F) mit NP6XLite/CP9 Security-Prozessoren, Dual-2.5G-WAN, HA-Heartbeat-Port, 10G SFP+ Core-Uplinks, Hardware-beschleunigtem IPS/SSL-Inspection und redundanter Stromversorgung."
category: "router"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 43.7
  depth_mm: 280.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 4300
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 38
  max_system_watts: 68
  airflow: "front-to-rear"
  noise_db_a: 39.0
ports:
  - port_id: "wan1"
    label: "WAN1 (Primary Fiber ONT 2.5G)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 48.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "wan2"
    label: "WAN2 (Backup Cable/5G 2.5G)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 68.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ha1"
    label: "HA Heartbeat"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 92.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "eth1"
    label: "LAN1 Mgmt"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 125.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "eth2"
    label: "LAN2 DMZ"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 145.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "eth8"
    label: "LAN8 Shadow Sync"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 265.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp_plus1"
    label: "10G SFP+ Core Trunk 1"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 360.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp_plus2"
    label: "10G SFP+ Core Trunk 2"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 384.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "AC Mains In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 60.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#DC2626"
  material_preset: "matte-black-steel"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/generic-19inch-blank-panel-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "generic-19inch-blank-panel-1u"
manufacturer: "Generic"
model: "19-Inch 1U Steel Blanking Panel (Airflow Baffle)"
description: "19-Zoll 1U Blindplatte aus mattschwarz pulverbeschichtetem Stahlblech. Verschließt freie Höheneinheiten zur optischen Aufwertung und verhindert thermischen Kurzschluss (Rückströmen warmer Abluft auf die kalte Vorderseite)."
category: "blank-panel"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 44.0
  depth_mm: 12.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 340
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#1F2937"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/generic-19inch-brush-panel-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "generic-19inch-brush-panel-1u"
manufacturer: "Generic"
model: "19-Inch 1U High-Density Cable Management Brush Strip Panel"
description: "19-Zoll 1U Kabeldurchführungs-Bürstenpanel (Brush Strip Panel) mit eloxiertem Metallrahmen und flexiblen Nylonbürsten für den sauberen Wechsel von Kabeln zwischen Vorder- und Rückseite des Racks."
category: "brush-panel"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 482.6
  height_mm: 44.0
  depth_mm: 18.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 280
  has_cable_pass_through: true
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
visuals:
  chassis_color_hex: "#111827"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/generic-19inch-patch-panel-24port-cat6a.yaml`,categoryDir:`19inch`,rawYaml:`slug: "generic-19inch-patch-panel-24port-cat6a"
manufacturer: "Generic"
model: "19-Inch 1U 24-Port Cat6A Shielded Passthrough Patch Panel"
description: "Geschirmtes 19-Zoll 1U 24-Port Cat6A Durchgangs-Patchpanel (10G-fähig). Nimmt auf der Rückseite bis zu 24 ankommende Gebäude-/Raumleitungen (Kameras, Access Points, Bürodosen) auf und verbindet sie vorne per kurzem Patchkabel mit dem Switch."
category: "patch-panel"
mount_type: "rackmount-19"
is_passthrough_coupler: true
geometry:
  u_height: 1.0
  width_mm: 482.6
  height_mm: 44.0
  depth_mm: 35.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 640
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
port_groups:
  - id_prefix: "p"
    label_prefix: "Port "
    start_index: 1
    count: 24
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["passthrough-coupler", "10gbase-t", "2500base-t", "1000base-t"]
    orientation: "upright"
    is_passthrough_coupler: true
    grid:
      origin_x_mm: 42.0
      origin_y_mm: 22.0
      columns: 24
      rows: 1
      pitch_x_mm: 17.2
      pitch_y_mm: 0.0
visuals:
  chassis_color_hex: "#111827"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/generic-19inch-shelf-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "generic-19inch-shelf-1u"
manufacturer: "Generic"
model: "19-Inch 1U Ventilated Cantilever Equipment Shelf (250mm Depth)"
description: "Perforierter 19-Zoll 1U Fachboden (Geräteablage aus 1,5mm pulverbeschichtetem Stahlblech, 250mm Tiefe, bis 25kg Traglast) zur Ablage von Glasfaser-ONTs, Kabelmodems, externen Festplatten, Netzteilen oder nicht-rackfähigen Desktop-Geräten."
category: "shelf"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 44.0
  depth_mm: 250.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 1850
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "front-to-rear"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/mikrotik-ccr2004-16g-2s-plus.yaml`,categoryDir:`19inch`,rawYaml:`slug: "mikrotik-ccr2004-16g-2s-plus"
manufacturer: "MikroTik"
model: "Cloud Core Router CCR2004-16G-2S+ (16x 1GbE + 2x 10G SFP+)"
description: "19-Zoll 1U Enterprise Cloud Core Router (CCR2004-16G-2S+) mit 4-Kern 64-Bit ARMv8 Prozessor (Amazon Annapurna Labs Alpine v2, 1,7 GHz), 4 GB DDR4 RAM, 16x 1GbE RJ45 Ports, 2x 10G SFP+ Slots und doppelt redundanten Hot-Swap AC-Netzteilen."
category: "router"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 443.0
  height_mm: 44.0
  depth_mm: 210.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 1780
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 22
  max_system_watts: 48
  airflow: "front-to-rear"
  noise_db_a: 31.0
port_groups:
  - id_prefix: "eth"
    label_prefix: "GE "
    start_index: 1
    count: 16
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 95.0
      origin_y_mm: 22.0
      columns: 16
      rows: 1
      pitch_x_mm: 15.0
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp_plus1"
    label: "10G SFP+ 1"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 350.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp_plus2"
    label: "10G SFP+ 2"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 374.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "console"
    label: "RJ45 Console"
    face: "front"
    connector_type: "rj45-serial-console"
    direction: "bidirectional"
    capabilities: ["serial-rs232"]
    coordinates:
      x_mm: 405.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ac_in1"
    label: "PSU 1 AC In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 360.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ac_in2"
    label: "PSU 2 AC In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 405.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/mikrotik-crs326-24g-2s-plus-rm.yaml`,categoryDir:`19inch`,rawYaml:`slug: "mikrotik-crs326-24g-2s-plus-rm"
manufacturer: "MikroTik"
model: "CRS326-24G-2S+RM (24x 1GbE + 2x 10G SFP+ Rackmount Switch)"
description: "Lüfterloser 19-Zoll 1U 24-Port Gigabit-Switch (nur 144mm Bautiefe, 0 dB(A), Dual-Boot RouterOS / SwOS) mit 24x 1GbE RJ45 Ports, 2x 10G SFP+ Glasfaser-/DAC-Slots und serieller RS232-Konsole. Ein Klassiker für geräuschlose 19-Zoll-Homelabs und kleine Büroschränke."
category: "switch"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 443.0
  height_mm: 44.0
  depth_mm: 144.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 1280
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 11
  max_system_watts: 24
  airflow: "passive-convection"
port_groups:
  - id_prefix: "eth"
    label_prefix: "GE "
    start_index: 1
    count: 24
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-af"]
    orientation: "upright"
    grid:
      origin_x_mm: 36.0
      origin_y_mm: 22.0
      columns: 24
      rows: 1
      pitch_x_mm: 13.5
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp_plus1"
    label: "10G SFP+ 1"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 372.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp_plus2"
    label: "10G SFP+ 2"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 394.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "console"
    label: "RS232 Console"
    face: "front"
    connector_type: "rj45-serial-console"
    direction: "bidirectional"
    capabilities: ["serial-rs232"]
    coordinates:
      x_mm: 418.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 400.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/synology-rs1221-plus-2u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "synology-rs1221-plus-2u"
manufacturer: "Synology"
model: "RackStation RS1221+ 8-Bay 2U Short-Depth Enterprise NAS"
description: "Kurztiefes 19-Zoll 2U 8-Bay Enterprise-NAS (Synology RS1221+, nur 306,6mm Bautiefe — passt problemlos in flache 400mm/450mm Wandschränke) mit AMD Ryzen V1500B Quad-Core-CPU, ECC-RAM, 8x Hot-Swap 3,5\\"/2,5\\" SATA-Einschüben, 4x 1GbE RJ45 Ports sowie integrierter Dual-10G-SFP+ Netzwerkkarte."
category: "nas"
mount_type: "rackmount-19"
geometry:
  u_height: 2.0
  width_mm: 442.4
  height_mm: 88.0
  depth_mm: 306.6
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 5.0
  rear_protrusion_mm: 0.0
  weight_grams: 6900
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 28
  max_system_watts: 85
  airflow: "front-to-rear"
  noise_db_a: 35.2
port_groups:
  - id_prefix: "lan"
    label_prefix: "1GbE LAN "
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 180.0
      origin_y_mm: 28.0
      columns: 4
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp_plus1"
    label: "10G SFP+ 1 (E10G21-F2)"
    face: "rear"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 310.0
      y_mm: 52.0
      orientation: "upright"
  - port_id: "sfp_plus2"
    label: "10G SFP+ 2 (E10G21-F2)"
    face: "rear"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 334.0
      y_mm: 52.0
      orientation: "upright"
  - port_id: "console"
    label: "RS232 Console"
    face: "rear"
    connector_type: "rj45-serial-console"
    direction: "bidirectional"
    capabilities: ["serial-rs232"]
    coordinates:
      x_mm: 140.0
      y_mm: 28.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "250W AC Input"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 65.0
      y_mm: 44.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/ubiquiti-udm-pro.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-udm-pro"
manufacturer: "Ubiquiti"
model: "UniFi Dream Machine Pro (UDM-Pro)"
description: "19-Zoll 1U All-in-One Enterprise Security Gateway, Firewall & UniFi Network/Protect Controller (UDM-Pro) mit 8x 1G RJ45 LAN-Switch, 1x 2.5G RJ45 WAN, 2x 10G SFP+ (WAN/LAN) und 1.3\\" Touchscreen."
category: "router"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 43.7
  depth_mm: 285.6
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 3900
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 22
  max_system_watts: 33
  airflow: "front-to-rear"
port_groups:
  - id_prefix: "eth"
    label_prefix: "LAN "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 260.0
      origin_y_mm: 14.0
      columns: 4
      rows: 2
      pitch_x_mm: 16.0
      pitch_y_mm: 15.0
ports:
  - port_id: "wan1"
    label: "WAN 9 (2.5G)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 345.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp_wan2"
    label: "SFP+ WAN 10"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 375.0
      y_mm: 29.0
      orientation: "upright"
  - port_id: "sfp_lan11"
    label: "SFP+ LAN 11"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 375.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 400.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#D1D5DB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/ubiquiti-udm-se.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-udm-se"
manufacturer: "Ubiquiti"
model: "UniFi Dream Machine Special Edition (UDM-SE)"
description: "19-Zoll 1U Enterprise Security Gateway, Firewall & UniFi Protect Kamera-NVR (inkl. 128GB SSD & 3,5\\" HDD-Einschub) mit integriertem 180W PoE/PoE+ 8-Port-Switch (2x 802.3at PoE+ + 6x 802.3af PoE), 1x 2.5GbE RJ45 WAN, 2x 10G SFP+ (WAN/LAN) und 1,3\\" Farb-Touchscreen. Spart in kleineren 19-Zoll-Racks einen separaten PoE-Switch für Kameras und Access Points."
category: "router"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 43.7
  depth_mm: 285.6
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 4950
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 26
  max_system_watts: 50
  poe_budget_watts: 180
  airflow: "front-to-rear"
  noise_db_a: 29.5
port_groups:
  - id_prefix: "eth"
    label_prefix: "PoE LAN "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at"]
    orientation: "upright"
    grid:
      origin_x_mm: 260.0
      origin_y_mm: 14.0
      columns: 4
      rows: 2
      pitch_x_mm: 16.0
      pitch_y_mm: 15.0
ports:
  - port_id: "wan1"
    label: "WAN 9 (2.5GbE)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 345.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp_wan2"
    label: "10G SFP+ WAN 10"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 375.0
      y_mm: 29.0
      orientation: "upright"
  - port_id: "sfp_lan11"
    label: "10G SFP+ LAN 11"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 375.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 400.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#D1D5DB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/ubiquiti-unas-pro-2u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-unas-pro-2u"
manufacturer: "Ubiquiti"
model: "UniFi UNAS Pro (7-Bay 2U 10G SFP+ Rackmount NAS)"
description: "19-Zoll 2U 7-Bay Rackmount-NAS (UniFi UNAS Pro) mit 10G SFP+ Uplink und Touchscreen für hochperformanten Netzwerkspeicher, SMB-Freigaben und Proxmox-Backups."
category: "nas"
mount_type: "rackmount-19"
geometry:
  u_height: 2.0
  width_mm: 442.4
  height_mm: 87.4
  depth_mm: 325.1
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 9200
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 25
  max_system_watts: 160
  airflow: "front-to-rear"
  noise_db_a: 34.0
ports:
  - port_id: "eth1"
    label: "1GbE RJ45"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 340.0
      y_mm: 28.0
      orientation: "upright"
  - port_id: "sfp_plus1"
    label: "10G SFP+"
    face: "rear"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 365.0
      y_mm: 28.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 65.0
      y_mm: 32.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/ubiquiti-unvr-4bay-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-unvr-4bay-1u"
manufacturer: "Ubiquiti"
model: "UniFi Protect Network Video Recorder 4-Bay 1U (UNVR)"
description: "Dedizierter 19-Zoll 1U Videoüberwachungs-Rekorder (UniFi Protect NVR) mit 4x Hot-Swap 3,5\\"/2,5\\" SATA-Laufwerksschächten (RAID 1 / RAID 5 / RAID 10 für bis zu 18x 4K-Kameras oder 60x Full-HD-Kameras), 1x 10G SFP+ Uplink und 1x 1GbE RJ45 Port."
category: "nas"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 43.7
  depth_mm: 325.1
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 5100
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 32
  max_system_watts: 100
  airflow: "front-to-rear"
  noise_db_a: 34.0
ports:
  - port_id: "sfp_plus1"
    label: "10G SFP+ Video Trunk"
    face: "rear"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 340.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "eth1"
    label: "1GbE RJ45 LAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 365.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 400.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#D1D5DB"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/ubiquiti-usw-aggregation.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-usw-aggregation"
manufacturer: "Ubiquiti"
model: "UniFi Switch Aggregation (USW-Aggregation 8x 10G SFP+)"
description: "Lüfterloser 19-Zoll 1U Layer-2 Core-Aggregation-Switch (USW-Aggregation) mit 8x 10G SFP+ Glasfaser-/DAC-Ports (160 Gbit/s Switching-Kapazität) zur schnellen Kopplung von Firewall, Access-Switches, NAS und Servern."
category: "switch"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 43.7
  depth_mm: 120.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 2650
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 12
  max_system_watts: 30
  airflow: "passive-convection"
port_groups:
  - id_prefix: "sfp"
    label_prefix: "10G SFP+ "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    orientation: "upright"
    grid:
      origin_x_mm: 260.0
      origin_y_mm: 20.0
      columns: 8
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 390.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/ubiquiti-usw-pro-max-16-poe-rack-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-usw-pro-max-16-poe-rack-1u"
manufacturer: "Ubiquiti"
model: "UniFi Pro Max 16 PoE (USW-Pro-Max-16-PoE + 19\\" 1U Rack Mount Kit)"
description: "Ultraflacher 19-Zoll 1U Layer-3 Etherlighting PoE++ Switch (nur 160mm Einbautiefe, 180W PoE-Budget, lautlos) mit 4x 2.5GbE PoE++ Ports, 12x 1GbE PoE+ Ports, 2x 10G SFP+ Uplinks und 1,3\\" Touchscreen im offiziellen 19-Zoll-Rackmount-Rahmen."
category: "switch"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 43.7
  depth_mm: 160.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 2800
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 14
  max_system_watts: 30
  poe_budget_watts: 180
  airflow: "passive-convection"
port_groups:
  - id_prefix: "eth"
    label_prefix: "Port "
    start_index: 1
    count: 16
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at", "poe-out-bt-type3"]
    orientation: "upright"
    grid:
      origin_x_mm: 130.0
      origin_y_mm: 22.0
      columns: 16
      rows: 1
      pitch_x_mm: 14.5
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp1"
    label: "10G SFP+ 17"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 382.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp2"
    label: "10G SFP+ 18"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 404.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "54V 210W AC/DC In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 400.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#D1D5DB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/19inch/ubiquiti-usw-pro-max-24-poe.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-usw-pro-max-24-poe"
manufacturer: "Ubiquiti"
model: "UniFi Switch Pro Max 24 PoE (USW-Pro-Max-24-PoE)"
description: "19-Zoll 1U Layer-3 PoE++ Enterprise Switch (USW-Pro-Max-24-PoE, 400W PoE-Budget) mit Etherlighting-LEDs, 8x 2.5G RJ45, 16x 1G RJ45 (PoE+/PoE++) und 2x 10G SFP+ Uplinks für große Kamera-, WLAN-7- und Haus-Installationen."
category: "switch"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 43.7
  depth_mm: 325.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 5100
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 35
  max_system_watts: 50
  poe_budget_watts: 400
  airflow: "front-to-rear"
port_groups:
  - id_prefix: "eth"
    label_prefix: "Port "
    start_index: 1
    count: 24
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at", "poe-out-bt-type3"]
    orientation: "upright"
    grid:
      origin_x_mm: 46.0
      origin_y_mm: 22.0
      columns: 24
      rows: 1
      pitch_x_mm: 14.8
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp1"
    label: "SFP+ 25"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 416.0
      y_mm: 29.0
      orientation: "upright"
  - port_id: "sfp2"
    label: "SFP+ 26"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 416.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 400.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#D1D5DB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/6inch/3dprint-6inch-cover-panel-lines-1u.yaml`,categoryDir:`6inch`,rawYaml:`slug: "3dprint-6inch-cover-panel-lines-1u"
manufacturer: "Community 3D-Print"
model: "6-Inch 1U Micro-Rack Designer Cover Panel (Horizontal Precision Lines)"
description: "3D-druckbares 6-Zoll 1U Cover-Panel (PETG/PLA, geschlossene Frontblende ohne Kabeldurchlass) mit feinen horizontalen Präzisionsrillen für 6-Zoll Micro-Homelabs."
category: "blank-panel"
mount_type: "rackmount-6"
geometry:
  u_height: 1.0
  width_mm: 120.0
  height_mm: 44.0
  depth_mm: 6.0
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 28
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "none"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 28
  material_recommendation: "PETG / PLA"
  fasteners: "4x M4 Rack Screws"
  printables_url: "https://www.printables.com/model/6inch-1u-cover-panel-lines"
`},{relativePath:`catalog/6inch/generic-6inch-brush-panel-1u.yaml`,categoryDir:`6inch`,rawYaml:`slug: "generic-6inch-brush-panel-1u"
manufacturer: "MicroRack"
model: "6-Inch 1U Brush Strip Cable Pass-Through Panel"
description: "6-Zoll 1U Bürstenleiste (Kabeldurchführung mit dichten Nylonborsten im eloxierten Stahlrahmen) für 6-Zoll Micro-Racks. Ermöglicht das saubere Durchführen von Patch- und Stromkabeln zwischen Vorder- und Rückseite."
category: "brush-panel"
mount_type: "rackmount-6"
geometry:
  u_height: 1.0
  width_mm: 120.0
  height_mm: 44.0
  depth_mm: 15.0
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 130
  has_cable_pass_through: true
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "front-to-rear"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/6inch/generic-6inch-patch-panel-6port.yaml`,categoryDir:`6inch`,rawYaml:`slug: "generic-6inch-patch-panel-6port"
manufacturer: "DeskPi / MicroRack"
model: "6-Inch 1U 6-Port Cat6A Shielded Passthrough Patch Panel"
description: "Passives 6-Zoll 1U Cat6A Durchgangs-Patchpanel mit 6 geschirmten RJ45-Keystone-Buchsen (vorne & hinten steckbar) zur sauberen Strukturverkabelung in 6-Zoll Micro-Homelabs."
category: "patch-panel"
mount_type: "rackmount-6"
is_passthrough_coupler: true
geometry:
  u_height: 1.0
  width_mm: 120.0
  height_mm: 44.0
  depth_mm: 30.0
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 185
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
port_groups:
  - id_prefix: "p"
    label_prefix: "Port "
    start_index: 1
    count: 6
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["passthrough-coupler", "10gbase-t", "2500base-t", "1000base-t"]
    orientation: "upright"
    is_passthrough_coupler: true
    grid:
      origin_x_mm: 18.5
      origin_y_mm: 22.0
      columns: 6
      rows: 1
      pitch_x_mm: 16.5
      pitch_y_mm: 0.0
visuals:
  chassis_color_hex: "#111827"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/6inch/generic-6inch-usb-pd-pdu-4port.yaml`,categoryDir:`6inch`,rawYaml:`slug: "generic-6inch-usb-pd-pdu-4port"
manufacturer: "MicroLab"
model: "6-Inch 1U 200W 4-Port USB-C GaN PD + DC-5525 Micro-PDU"
description: "Kompakte 6-Zoll 1U GaN-Stromverteilungseinheit (Micro-PDU, 200W Gesamtleistung) mit 4x USB-C Power-Delivery-Ausgängen (5V/9V/12V/15V/20V für Raspberry Pi 5, USW-Flex-Mini, GL.iNet Router & JetKVM/PiKVM), 1x 12V/20V DC-5525 Hohlstecker-Ausgang und rückseitigem IEC-C14 Kaltgeräte-Eingang."
category: "pdu"
mount_type: "rackmount-6"
geometry:
  u_height: 1.0
  width_mm: 120.0
  height_mm: 44.0
  depth_mm: 52.0
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 340
power_and_thermal:
  electrical_role: "pdu"
  idle_watts: 2
  max_system_watts: 8
  pdu_capacity_watts: 200
  airflow: "passive-convection"
port_groups:
  - id_prefix: "usb_pd"
    label_prefix: "USB-C PD "
    start_index: 1
    count: 4
    face: "front"
    connector_type: "usb-c"
    direction: "output"
    capabilities: ["usb-pd", "dc-power"]
    orientation: "upright"
    grid:
      origin_x_mm: 40.0
      origin_y_mm: 22.0
      columns: 4
      rows: 1
      pitch_x_mm: 16.0
      pitch_y_mm: 0.0
ports:
  - port_id: "dc_out1"
    label: "12V/20V DC Out"
    face: "front"
    connector_type: "dc-5525"
    direction: "output"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 105.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "IEC-C14 AC In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 60.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/6inch/gl-inet-mt3000-beryl-ax-6inch.yaml`,categoryDir:`6inch`,rawYaml:`slug: "gl-inet-mt3000-beryl-ax-6inch"
manufacturer: "GL.iNet"
model: "GL-MT3000 Beryl AX OpenWrt 2.5G Security Gateway (6-Inch 1U)"
description: "Kompaktes OpenWrt / WireGuard / OpenVPN Security-Gateway (120×34×83mm) mit 2.5GbE WAN-Port, 1GbE LAN-Port, USB 3.0 und Wi-Fi 6 für 6-Zoll Micro-Homelabs. Wird über USB-C (5V/3A PD) versorgt und sitzt in einer 3D-gedruckten 6-Zoll 1U Halterung."
category: "router"
mount_type: "rackmount-6"
geometry:
  u_height: 1.0
  width_mm: 120.0
  height_mm: 34.0
  depth_mm: 83.0
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 196
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 4
  max_system_watts: 12
  airflow: "front-to-rear"
ports:
  - port_id: "wan1"
    label: "2.5GbE WAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 42.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "lan1"
    label: "1GbE LAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 66.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "usb1"
    label: "USB 3.0"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 92.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "pwr_usb_c"
    label: "5V 3A USB-C In"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 18.0
      y_mm: 16.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#1E293B"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/6inch/ubiquiti-usw-flex-mini-6inch.yaml`,categoryDir:`6inch`,rawYaml:`slug: "ubiquiti-usw-flex-mini-6inch"
manufacturer: "Ubiquiti"
model: "UniFi Switch Flex Mini (USW-Flex-Mini, 6-Inch 1U Mount)"
description: "Ultrakompakter 5-Port Gigabit Managed Switch (107,2×21,2×70,2mm, lautlos) für 6-Zoll Micro-Racks. Kann wahlweise über Port 1 per 802.3af/at PoE-In oder über den rückseitigen 5V USB-C Anschluss mit Strom versorgt werden und sitzt im 6-Zoll-Rack in einer 3D-gedruckten 1U-PETG-Aufnahmehalterung."
category: "switch"
mount_type: "rackmount-6"
geometry:
  u_height: 1.0
  width_mm: 107.2
  height_mm: 21.2
  depth_mm: 70.2
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 150
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 1.5
  max_system_watts: 2.5
  airflow: "passive-convection"
port_groups:
  - id_prefix: "eth"
    label_prefix: "Port "
    start_index: 2
    count: 4
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 35.5
      origin_y_mm: 10.6
      columns: 4
      rows: 1
      pitch_x_mm: 17.5
      pitch_y_mm: 0.0
ports:
  - port_id: "eth1"
    label: "Port 1 (PoE-In)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 18.0
      y_mm: 10.6
      orientation: "upright"
  - port_id: "pwr_usb_c"
    label: "5V 1A USB-C In"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 88.0
      y_mm: 10.6
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/carriers/3dprint-10inch-dual-rpi5-plus-4keystone.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-dual-rpi5-plus-4keystone"
manufacturer: "Community 3D-Print"
model: "10-Inch 1U Carrier for 2x Raspberry Pi 5 + 4x Keystone"
description: "3D-druckbarer 10-Zoll 1U Modulträger (PETG/ABS, L-Profil mit Stützboden) mit 2 Einschüben für Raspberry Pi 5 SBCs sowie 4 integrierten Standard-Keystone-Ausschnitten."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 105.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 145
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
slots:
  - slot_id: "rpi-bay-1"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 18.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 65.0
      height: 36.0
      depth: 100.0
  - slot_id: "rpi-bay-2"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 87.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 65.0
      height: 36.0
      depth: 100.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 158.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 178.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-3"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 198.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-4"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 218.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 135
  material_recommendation: "PETG / ABS"
  heat_set_inserts: "8x M2.5x4x3.5mm, 4x M3x5x4mm"
  fasteners: "8x M2.5x8mm Pan Head"
  printables_url: "https://www.printables.com/model/10inch-dual-rpi5-4keystone"
`},{relativePath:`catalog/carriers/3dprint-10inch-intel-nuc-plus-3keystone.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-intel-nuc-plus-3keystone"
manufacturer: "Printables Community"
model: "10-Inch 1U Intel NUC (4x4 Slim) + 3x Keystone Modular Carrier"
description: "3D-gedruckter 10-Zoll 1U Modulträger (PETG/ASA) mit einem passgenauen Einschub für einen kompakten 4x4-Zoll Mini-PC (z. B. Intel NUC 12/13 Pro Slim oder ASUS NUC 14 Pro) auf der linken Seite sowie drei Keystone-Aussparungen rechts, um den hinteren 2.5G-LAN-Port und zwei weitere Anschlüsse sauber nach vorne zu führen."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 135.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 0.0
  rear_protrusion_mm: 0.0
  weight_grams: 165
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "front-to-rear"
slots:
  - slot_id: "intel-nuc-bay"
    accepted_slot_type: "intel-nuc-4x4"
    offset_mm:
      x: 18.0
      y: 2.5
      z: 0.0
    max_dimensions_mm:
      width: 122.0
      height: 39.0
      depth: 125.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 152.0
      y: 12.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 178.0
      y: 12.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-3"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 204.0
      y: 12.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: "meshes/3dprint-10inch-intel-nuc-plus-3keystone.stl"
printable_metadata:
  filament_grams: 165
  material_recommendation: "PETG or ASA (25% Gyroid Infill, 4 Perimeters)"
  heat_set_inserts: "4x M3x5x4mm Voron standard brass inserts"
  fasteners: "4x M3x10mm BHCS + 4x M6 cage nuts"
  printables_url: "https://www.printables.com/model/10inch-intel-nuc-3keystone"
`},{relativePath:`catalog/carriers/3dprint-10inch-lenovo-tiny-plus-2keystone.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-lenovo-tiny-plus-2keystone"
manufacturer: "Community 3D-Print"
model: "10-Inch 1U Carrier for Lenovo Tiny + 2x Keystone"
description: "3D-druckbarer 10-Zoll 1U Modulträger (PETG/ABS, offenes L-Tray) für 1x 1-Liter Mini-PC (Lenovo ThinkCentre Tiny / Dell OptiPlex Micro / HP EliteDesk Mini) plus 2x RJ45-Keystone-Buchsen rechts daneben."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 185.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 180
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
slots:
  - slot_id: "left-mini-pc-bay"
    accepted_slot_type: "mini-pc-1liter"
    offset_mm:
      x: 18.0
      y: 2.0
      z: 0.0
    max_dimensions_mm:
      width: 180.0
      height: 38.0
      depth: 185.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 201.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 220.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 165
  material_recommendation: "PETG / ABS"
  heat_set_inserts: "4x M3x5x4mm"
  fasteners: "4x M3x10mm Socket Head"
  printables_url: "https://www.printables.com/model/10inch-lenovo-tiny-2keystone"
`},{relativePath:`catalog/carriers/3dprint-10inch-rpi5-jetkvm-2keystone.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-rpi5-jetkvm-2keystone"
manufacturer: "Community 3D-Print"
model: "10-Inch 1U Carrier for 1x Raspberry Pi 5 + 1x JetKVM + 2x Keystone"
description: "3D-druckbarer 10-Zoll 1U Modulträger (PETG/ABS) für 1x Raspberry Pi 5, 1x JetKVM Out-of-Band IP-KVM (mit Display-Ausschnitt) und 2x Keystone-Buchsen."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 110.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 155
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
slots:
  - slot_id: "rpi-bay-1"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 18.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 65.0
      height: 36.0
      depth: 100.0
  - slot_id: "jetkvm-bay-1"
    accepted_slot_type: "jetkvm-bay"
    offset_mm:
      x: 92.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 46.0
      height: 38.0
      depth: 70.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 192.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 214.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 142
  material_recommendation: "PETG / ABS"
  heat_set_inserts: "4x M2.5x4x3.5mm, 4x M3x5x4mm"
  fasteners: "4x M2.5x8mm Pan Head, 2x M3x10mm Socket Head"
  printables_url: "https://www.printables.com/model/10inch-rpi5-jetkvm-2keystone"
`},{relativePath:`catalog/carriers/3dprint-10inch-sbc-pikvm-carrier-1u.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-sbc-pikvm-carrier-1u"
manufacturer: "Printables Community"
model: "10-Inch 1U Raspberry Pi 5 + PiKVM V4 Mini + Keystone Carrier"
description: "3D-gedruckter 10-Zoll 1U Kombi-Träger (PETG/ASA) für einen Raspberry Pi 5 (links), ein PiKVM V4 Mini Out-of-Band IP-KVM-Modul (Mitte) und ein Keystone-Durchgangsmodul (rechts). Ideal als Management- & Quorum-Etage für ein 10-Zoll Proxmox-Cluster."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 110.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 0.0
  rear_protrusion_mm: 0.0
  weight_grams: 150
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "front-to-rear"
slots:
  - slot_id: "rpi5-bay-1"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 18.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 65.0
      height: 36.0
      depth: 100.0
  - slot_id: "pikvm-bay"
    accepted_slot_type: "pikvm-v4-bay"
    offset_mm:
      x: 88.0
      y: 8.0
      z: 0.0
    max_dimensions_mm:
      width: 122.0
      height: 28.0
      depth: 75.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 215.0
      y: 12.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: "meshes/3dprint-10inch-sbc-pikvm-carrier-1u.stl"
printable_metadata:
  filament_grams: 150
  material_recommendation: "PETG or ASA (25% Gyroid Infill, 4 Perimeters)"
  heat_set_inserts: "6x M2.5x4mm brass inserts"
  fasteners: "6x M2.5x8mm SHCS + 4x M6 cage nuts"
  printables_url: "https://www.printables.com/model/10inch-rpi5-pikvm-v4-carrier"
`},{relativePath:`catalog/carriers/3dprint-10inch-ucg-ultra-plus-3keystone.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-ucg-ultra-plus-3keystone"
manufacturer: "Community 3D-Print"
model: "10-Inch 1U Carrier for UniFi Cloud Gateway Ultra/Max + 3x Keystone"
description: "3D-druckbarer 10-Zoll 1U Modulträger (PETG/ABS) passgenau für das Ubiquiti Cloud Gateway Max/Ultra (UCG-Max / UCG-Ultra) inklusive Sichtfenster für das Front-OLED und 3x Keystone-Buchsen, um die hinteren WAN/LAN-Ports nach vorne zu führen."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 140.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 155
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
slots:
  - slot_id: "gateway-bay"
    accepted_slot_type: "unifi-compact-gateway"
    offset_mm:
      x: 18.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 145.0
      height: 36.0
      depth: 135.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 170.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 192.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-3"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 214.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 150
  material_recommendation: "PETG / ABS"
  heat_set_inserts: "4x M3x5x4mm"
  fasteners: "4x M3x12mm Socket Head"
  printables_url: "https://www.printables.com/model/10inch-ucg-ultra-max-3keystone"
`},{relativePath:`catalog/carriers/3dprint-19inch-dual-minipc-poe-carrier-1u.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-19inch-dual-minipc-poe-carrier-1u"
manufacturer: "Community 3D-Print"
model: "19-Inch 1U Carrier for 2x 1L Proxmox Nodes + 1x PoE Pi5 Witness"
description: "3D-druckbarer 19-Zoll 1U Hybrid-Carrier (PETG-CF / ASA) für 2x 1-Liter Proxmox Compute-Nodes (Dell OptiPlex Micro / Lenovo ThinkCentre Tiny / HP EliteDesk Mini) plus 1x Raspberry Pi 5 PoE+ Quorum-Witness-Slot auf einer einzigen Höheneinheit."
category: "modular-carrier"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 482.6
  height_mm: 44.0
  depth_mm: 185.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 390
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
slots:
  - slot_id: "mini-pc-bay-1"
    accepted_slot_type: "mini-pc-1liter"
    offset_mm:
      x: 22.0
      y: 3.5
      z: 0.0
    max_dimensions_mm:
      width: 182.0
      height: 38.0
      depth: 185.0
  - slot_id: "mini-pc-bay-2"
    accepted_slot_type: "mini-pc-1liter"
    offset_mm:
      x: 212.0
      y: 3.5
      z: 0.0
    max_dimensions_mm:
      width: 182.0
      height: 38.0
      depth: 185.0
  - slot_id: "pi-poe-bay-1"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 400.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 66.0
      height: 38.0
      depth: 120.0
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: "meshes/3dprint-19inch-dual-minipc-poe-carrier-1u.stl"
printable_metadata:
  filament_grams: 365
  material_recommendation: "PETG-CF or ASA (30% Gyroid Infill, 4 Perimeters)"
  heat_set_inserts: "8x M3x5x4mm brass inserts"
  fasteners: "8x M3x12mm Socket Head + 4x M6 cage nuts"
  printables_url: "https://www.printables.com/model/19inch-dual-minipc-pi5-poe-carrier"
`},{relativePath:`catalog/carriers/3dprint-19inch-triple-mini-pc-carrier.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-19inch-triple-mini-pc-carrier"
manufacturer: "Community 3D-Print"
model: "19-Inch 1U Carrier for 3x 1L Mini-PCs (2-Piece Interlocking)"
description: "Zweiteiliger 3D-druckbarer 19-Zoll 1U Schwerlast-Modulträger (ABS/ASA mit Schwalbenschwanz-Steckverbindung) für bis zu 3x 1-Liter Proxmox Mini-PCs nebeneinander auf nur einer Höheneinheit."
category: "modular-carrier"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 482.6
  height_mm: 44.0
  depth_mm: 185.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 360
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
slots:
  - slot_id: "mini-pc-bay-1"
    accepted_slot_type: "mini-pc-1liter"
    offset_mm:
      x: 18.0
      y: 2.0
      z: 0.0
    max_dimensions_mm:
      width: 145.0
      height: 38.0
      depth: 185.0
  - slot_id: "mini-pc-bay-2"
    accepted_slot_type: "mini-pc-1liter"
    offset_mm:
      x: 169.0
      y: 2.0
      z: 0.0
    max_dimensions_mm:
      width: 145.0
      height: 38.0
      depth: 185.0
  - slot_id: "mini-pc-bay-3"
    accepted_slot_type: "mini-pc-1liter"
    offset_mm:
      x: 320.0
      y: 2.0
      z: 0.0
    max_dimensions_mm:
      width: 145.0
      height: 38.0
      depth: 185.0
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "3d-printed-abs"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 340
  material_recommendation: "ABS / ASA"
  heat_set_inserts: "8x M3x5x4mm"
  fasteners: "8x M3x12mm Socket Head"
  printables_url: "https://www.printables.com/model/19inch-triple-mini-pc-carrier"
`},{relativePath:`catalog/carriers/3dprint-6inch-rpi5-plus-keystone-carrier-1u.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-6inch-rpi5-plus-keystone-carrier-1u"
manufacturer: "Printables Community"
model: "6-Inch 1U Raspberry Pi 5 + 2x Keystone Micro-Carrier"
description: "3D-gedruckter 6-Zoll 1U Modulträger (PETG/ASA, 152,4mm Gesamtbreite) mit einem Einschub für einen Raspberry Pi 5 (inkl. PoE+ HAT) auf der linken Seite sowie zwei Keystone-Slots rechts. Ideal für ultrakompakte 6-Zoll Schreibtisch-Racks."
category: "modular-carrier"
mount_type: "rackmount-6"
geometry:
  u_height: 1.0
  width_mm: 152.4
  height_mm: 44.0
  depth_mm: 105.0
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 0.0
  rear_protrusion_mm: 0.0
  weight_grams: 110
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "front-to-rear"
slots:
  - slot_id: "rpi5-bay-1"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 18.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 66.0
      height: 36.0
      depth: 100.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 90.0
      y: 12.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 112.0
      y: 12.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "3d-printed-petg"
  has_oled_display: false
  stl_mesh_path: "meshes/3dprint-6inch-rpi5-plus-keystone-carrier-1u.stl"
printable_metadata:
  filament_grams: 110
  material_recommendation: "PETG or ASA (25% Gyroid Infill, 4 Perimeters)"
  heat_set_inserts: "4x M2.5x4mm brass inserts"
  fasteners: "4x M2.5x8mm SHCS + 4x M6 cage nuts"
  printables_url: "https://www.printables.com/model/6inch-rpi5-2keystone-carrier"
`},{relativePath:`catalog/sub-modules/dell-optiplex-7010-micro.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "dell-optiplex-7010-micro"
manufacturer: "Dell"
model: "OptiPlex 7010 Micro (1L Proxmox Node with 2.5GbE NIC)"
description: "Kompakter 1-Liter Business Mini-PC (Dell OptiPlex 7010 Micro) mit zusätzlichem 2.5GbE M.2-Netzwerkadapter — ideal als stromsparender Proxmox-VE Virtualisierungs-Knoten in einem 3D-gedruckten 1U-Carrier."
category: "mini-pc"
mount_type: "sub-module"
slot_compatibility: "mini-pc-1liter"
geometry:
  u_height: 0.8
  width_mm: 178.0
  height_mm: 36.0
  depth_mm: 182.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 1180
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 12
  max_system_watts: 65
  airflow: "front-to-rear"
  noise_db_a: 24.0
ports:
  - port_id: "usb_c_front"
    label: "USB-C 3.2"
    face: "front"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 48.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "usb_a_front"
    label: "USB-A 3.2"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 64.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "audio_front"
    label: "Universal Audio"
    face: "front"
    connector_type: "audio-35mm"
    direction: "bidirectional"
    capabilities: ["audio-analog"]
    coordinates:
      x_mm: 82.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "19.5V DC"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 20.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth0"
    label: "1GbE Onboard"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 92.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth1"
    label: "2.5GbE M.2 NIC"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 142.0
      y_mm: 16.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#1F2937"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/hp-elitedesk-800-g6-mini.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "hp-elitedesk-800-g6-mini"
manufacturer: "HP"
model: "EliteDesk 800 G6 Desktop Mini PC (Core i7-10700T, Dual NVMe)"
description: "1-Liter Business-Mini-PC (177×34,2×175mm, bis 64GB DDR4, 2x M.2 NVMe SSD) mit integriertem 1GbE Intel-NIC und zusätzlichem 2.5GbE Flex-IO-Port auf der Rückseite für Proxmox VE, OPNsense oder Docker. Wird als Einschubmodul (\`sub-module\`) in einen 3D-gedruckten 1-Liter-Mini-PC-Träger (\`mini-pc-1liter\`) im 10-Zoll- oder 19-Zoll-Rack eingesetzt."
category: "mini-pc"
mount_type: "sub-module"
slot_compatibility: "mini-pc-1liter"
geometry:
  u_height: 0.8
  width_mm: 177.0
  height_mm: 34.2
  depth_mm: 175.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 0.0
  rear_protrusion_mm: 0.0
  weight_grams: 1250
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 10
  max_system_watts: 65
  airflow: "front-to-rear"
  noise_db_a: 24.0
ports:
  - port_id: "usb_c_front"
    label: "USB-C 3.2 Gen2"
    face: "front"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 42.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "usb_a_front"
    label: "USB-A 3.2"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 62.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth0"
    label: "1GbE vPro NIC"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 142.0
      y_mm: 15.0
      orientation: "upright"
  - port_id: "eth1"
    label: "2.5GbE Flex-IO"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 106.0
      y_mm: 15.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "19.5V DC Input"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 22.0
      y_mm: 15.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#1F2937"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/intel-nuc-13-pro-slim.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "intel-nuc-13-pro-slim"
manufacturer: "Intel"
model: "NUC 13 Pro Slim (NUC13ANKi7, Core i7-1360P, 2.5GbE)"
description: "Ultrakompakter 4x4-Zoll Mini-PC (117×37×112mm) mit 12-Kern Intel Core i7-1360P Prozessor, bis zu 64GB RAM, M.2 PCIe 4.0 NVMe SSD und Intel i226-V 2.5-Gbit/s Ethernet. Wird als Einschubmodul (\`sub-module\`) in den 3D-gedruckten 10-Zoll NUC-Träger (\`3dprint-10inch-intel-nuc-plus-3keystone\`) eingesetzt."
category: "mini-pc"
mount_type: "sub-module"
slot_compatibility: "intel-nuc-4x4"
geometry:
  u_height: 0.85
  width_mm: 117.0
  height_mm: 37.0
  depth_mm: 112.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 0.0
  rear_protrusion_mm: 0.0
  weight_grams: 540
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 8
  max_system_watts: 65
  airflow: "front-to-rear"
  noise_db_a: 26.0
ports:
  - port_id: "usb_front1"
    label: "USB 3.2 Front 1"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 35.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "usb_front2"
    label: "USB 3.2 Front 2"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 55.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "eth0"
    label: "2.5GbE i226-V"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 68.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "tb4_rear"
    label: "Thunderbolt 4"
    face: "rear"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 42.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "20V Barrel In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 18.0
      y_mm: 18.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/jetkvm-smart-ip-kvm.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "jetkvm-smart-ip-kvm"
manufacturer: "JetKVM"
model: "JetKVM Open-Source Out-of-Band IP-KVM with Touchscreen"
description: "Kompaktes Open-Source IP-KVM-Modul (JetKVM) mit Touchscreen zur Fernsteuerung (BIOS-Zugriff, HDMI-Capture & virtuelles USB-Keyboard/Media) von Servern über das Netzwerk. Wird in einen 3D-Druck-Carrier eingeclipst."
category: "compute-node"
mount_type: "sub-module"
slot_compatibility: "jetkvm-bay"
geometry:
  u_height: 0.8
  width_mm: 43.0
  height_mm: 36.0
  depth_mm: 60.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 165
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 2.5
  max_system_watts: 4.5
  airflow: "passive-convection"
ports:
  - port_id: "eth0"
    label: "RJ45 LAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["100base-tx", "1000base-t"]
    coordinates:
      x_mm: 12.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "usb_c_pwr"
    label: "USB-C Power/HID"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "usb-3.0"]
    coordinates:
      x_mm: 31.0
      y_mm: 16.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#374151"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/keystone-rj45-cat6a-coupler.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "keystone-rj45-cat6a-coupler"
manufacturer: "Generic"
model: "Shielded RJ45 Cat6A Passthrough Keystone Coupler"
description: "Geschirmtes Cat6A RJ45 Keystone-Durchgangsmodul (Buchse-auf-Buchse). Wird in die Keystone-Slots eines 3D-gedruckten Carriers eingeclipst, um rückseitige Anschlüsse sauber auf der Vorderseite zugänglich zu machen."
category: "keystone-module"
mount_type: "sub-module"
slot_compatibility: "standard-keystone"
is_passthrough_coupler: true
geometry:
  u_height: 0.5
  width_mm: 16.0
  height_mm: 20.0
  depth_mm: 30.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 18
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
ports:
  - port_id: "coupler"
    label: "RJ45"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["passthrough-coupler", "10gbase-t", "2500base-t", "1000base-t"]
    is_passthrough_coupler: true
    coordinates:
      x_mm: 8.0
      y_mm: 10.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#9CA3AF"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/lenovo-thinkcentre-m920q.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "lenovo-thinkcentre-m920q"
manufacturer: "Lenovo"
model: "ThinkCentre M920q Tiny (with Dual-Port PCIe NIC)"
description: "Beliebter 1-Liter Homelab- & Enterprise-Mini-PC (Lenovo ThinkCentre M920q Tiny) mit PCIe-Riser-Slot für eine zusätzliche Dual-Port 2.5GbE-Netzwerkkarte (insgesamt 3x RJ45). Wird als Sub-Modul in einen 3D-gedruckten 1U-Carrier eingeschoben."
category: "mini-pc"
mount_type: "sub-module"
slot_compatibility: "mini-pc-1liter"
geometry:
  u_height: 0.8
  width_mm: 179.0
  height_mm: 34.5
  depth_mm: 182.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 1320
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 15
  max_system_watts: 65
  airflow: "front-to-rear"
ports:
  - port_id: "usb_c_front"
    label: "USB-C"
    face: "front"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 52.0
      y_mm: 17.0
      orientation: "upright"
  - port_id: "usb_a_front"
    label: "USB-A"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 68.0
      y_mm: 17.0
      orientation: "upright"
  - port_id: "audio_front"
    label: "Headset"
    face: "front"
    connector_type: "audio-35mm"
    direction: "bidirectional"
    capabilities: ["audio-analog"]
    coordinates:
      x_mm: 86.0
      y_mm: 17.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "20V DC"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 18.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth0"
    label: "ETH0"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 85.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth1"
    label: "ETH1 (PCIe)"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 132.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth2"
    label: "ETH2 (PCIe)"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 152.0
      y_mm: 16.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/pikvm-v4-mini-ip-kvm.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "pikvm-v4-mini-ip-kvm"
manufacturer: "PiKVM"
model: "PiKVM V4 Mini Open-Source Out-of-Band IP-KVM"
description: "Professionelles Open-Source Hardware-IP-KVM auf Basis des Raspberry Pi Compute Module 4 (120×24×68mm, eloxiertes Stahl-/Aluminiumgehäuse mit OLED-Statusanzeige). Ermöglicht vollständigen BIOS/UEFI-Fernzugriff, virtuelles USB-Boot-Medium und ATX-Power-Steuerung über das Netzwerk. Passt als Einschubmodul (\`pikvm-v4-bay\`) in den \`3dprint-10inch-sbc-pikvm-carrier-1u\`."
category: "sbc"
mount_type: "sub-module"
slot_compatibility: "pikvm-v4-bay"
geometry:
  u_height: 0.55
  width_mm: 120.0
  height_mm: 24.0
  depth_mm: 68.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 0.0
  rear_protrusion_mm: 0.0
  weight_grams: 235
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 4
  max_system_watts: 12
  airflow: "passive-convection"
ports:
  - port_id: "eth0"
    label: "1GbE Management"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 92.0
      y_mm: 12.0
      orientation: "upright"
  - port_id: "usb_otg"
    label: "USB-C KVM OTG"
    face: "rear"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 56.0
      y_mm: 12.0
      orientation: "upright"
  - port_id: "pwr_usb_c"
    label: "5V 3A USB-C In"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 24.0
      y_mm: 12.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#1E293B"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/raspberry-pi-5-poe-hat.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "raspberry-pi-5-poe-hat"
manufacturer: "Raspberry Pi"
model: "Raspberry Pi 5 (8GB) with Official PoE+ HAT"
description: "Raspberry Pi 5 (8GB) Einplatinencomputer mit offiziellem PoE+ HAT. Bezieht Strom und Netzwerk über ein einziges PoE-Netzwerkkabel an der Vorderseite — ideal als Proxmox-Quorum-Witness, Pi-hole DNS oder Monitoring-Node."
category: "sbc"
mount_type: "sub-module"
slot_compatibility: "sbc-rpi5"
geometry:
  u_height: 0.8
  width_mm: 62.0
  height_mm: 32.0
  depth_mm: 92.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 110
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 4.5
  max_system_watts: 12
  airflow: "front-to-rear"
ports:
  - port_id: "eth0"
    label: "GbE PoE"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 16.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "usb3_1"
    label: "USB 3.0"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 34.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "usb2_1"
    label: "USB 2.0"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 50.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "usbc_pwr"
    label: "5V USB-C"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 20.0
      y_mm: 10.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#166534"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/ubiquiti-ucg-max.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "ubiquiti-ucg-max"
manufacturer: "Ubiquiti"
model: "Cloud Gateway Max (UCG-Max)"
description: "Kompaktes Multi-Gigabit UniFi Cloud Gateway & Firewall (UCG-Max) mit 5x 2.5GbE RJ45 Ports (1x WAN, 4x LAN), NVMe-Speicher für UniFi Protect und Front-OLED-Display. Da es ein reines Desktop-Gehäuse (141.8×30×127.6mm) ohne Rack-Ohren ist, wird es als Sub-Modul in den 3D-gedruckten 10-Zoll-Carrier eingesetzt."
category: "router"
mount_type: "sub-module"
slot_compatibility: "unifi-compact-gateway"
geometry:
  u_height: 0.8
  width_mm: 141.8
  height_mm: 30.0
  depth_mm: 127.6
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 519
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 9.5
  max_system_watts: 16.1
  airflow: "passive-convection"
port_groups:
  - id_prefix: "lan"
    label_prefix: "LAN "
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 25.0
      origin_y_mm: 14.0
      columns: 4
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "wan"
    label: "WAN 2.5G"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 102.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "usbc_pwr"
    label: "5V 5A USB-C"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 125.0
      y_mm: 14.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#F3F4F6"
  material_preset: "polycarbonate"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
`},{relativePath:`catalog/sub-modules/zimaboard-832-2-5g-router-nas.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "zimaboard-832-2-5g-router-nas"
manufacturer: "IceWhale"
model: "ZimaBoard 832 Single-Board x86 Micro-Server (Dual GbE / PCIe 2.5G)"
description: "Lüfterloser x86-Einplatinen-Micro-Server (138,7×34,9×81,4mm, passives Aluminium-Kühlrippengehäuse, 0 dB(A)) mit Dual-Ethernet, 2x SATA-Ports und offenem PCIe-Slot für 2.5G/10G-NICs oder NVMe-Adapter. Passt als kompaktes Einschubmodul in \`mini-pc-1liter\` Träger und eignet sich ideal als lautloser OPNsense-Router, Pi-hole/AdGuard-Server oder Docker-Node."
category: "sbc"
mount_type: "sub-module"
slot_compatibility: "mini-pc-1liter"
geometry:
  u_height: 0.8
  width_mm: 138.7
  height_mm: 34.9
  depth_mm: 81.4
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 0.0
  rear_protrusion_mm: 0.0
  weight_grams: 280
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 6
  max_system_watts: 18
  airflow: "passive-convection"
ports:
  - port_id: "eth0"
    label: "LAN 1 (GbE/2.5G)"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 78.0
      y_mm: 17.0
      orientation: "upright"
  - port_id: "eth1"
    label: "LAN 2 (WAN/Trunk)"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 98.0
      y_mm: 17.0
      orientation: "upright"
  - port_id: "usb1"
    label: "USB 3.0"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 52.0
      y_mm: 17.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V 3A DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 22.0
      y_mm: 17.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
`}],Wu=Symbol.for(`yaml.alias`),Gu=Symbol.for(`yaml.document`),Ku=Symbol.for(`yaml.map`),qu=Symbol.for(`yaml.pair`),Ju=Symbol.for(`yaml.scalar`),Yu=Symbol.for(`yaml.seq`),Xu=Symbol.for(`yaml.node.type`),Zu=e=>!!e&&typeof e==`object`&&e[Xu]===Wu,Qu=e=>!!e&&typeof e==`object`&&e[Xu]===Gu,$u=e=>!!e&&typeof e==`object`&&e[Xu]===Ku,ed=e=>!!e&&typeof e==`object`&&e[Xu]===qu,td=e=>!!e&&typeof e==`object`&&e[Xu]===Ju,nd=e=>!!e&&typeof e==`object`&&e[Xu]===Yu;function rd(e){if(e&&typeof e==`object`)switch(e[Xu]){case Ku:case Yu:return!0}return!1}function id(e){if(e&&typeof e==`object`)switch(e[Xu]){case Wu:case Ku:case Ju:case Yu:return!0}return!1}var ad=e=>(td(e)||rd(e))&&!!e.anchor,od=Symbol(`break visit`),sd=Symbol(`skip children`),cd=Symbol(`remove node`);function ld(e,t){let n=dd(t);Qu(e)?ud(null,e.contents,n,Object.freeze([e]))===cd&&(e.contents=null):ud(null,e,n,Object.freeze([]))}ld.BREAK=od,ld.SKIP=sd,ld.REMOVE=cd;function ud(e,t,n,r){let i=fd(e,t,n,r);if(id(i)||ed(i))return pd(e,r,i),ud(e,i,n,r);if(typeof i!=`symbol`){if(rd(t)){r=Object.freeze(r.concat(t));for(let e=0;e<t.items.length;++e){let i=ud(e,t.items[e],n,r);if(typeof i==`number`)e=i-1;else if(i===od)return od;else i===cd&&(t.items.splice(e,1),--e)}}else if(ed(t)){r=Object.freeze(r.concat(t));let e=ud(`key`,t.key,n,r);if(e===od)return od;e===cd&&(t.key=null);let i=ud(`value`,t.value,n,r);if(i===od)return od;i===cd&&(t.value=null)}}return i}function dd(e){return typeof e==`object`&&(e.Collection||e.Node||e.Value)?Object.assign({Alias:e.Node,Map:e.Node,Scalar:e.Node,Seq:e.Node},e.Value&&{Map:e.Value,Scalar:e.Value,Seq:e.Value},e.Collection&&{Map:e.Collection,Seq:e.Collection},e):e}function fd(e,t,n,r){if(typeof n==`function`)return n(e,t,r);if($u(t))return n.Map?.(e,t,r);if(nd(t))return n.Seq?.(e,t,r);if(ed(t))return n.Pair?.(e,t,r);if(td(t))return n.Scalar?.(e,t,r);if(Zu(t))return n.Alias?.(e,t,r)}function pd(e,t,n){let r=t[t.length-1];if(rd(r))r.items[e]=n;else if(ed(r))e===`key`?r.key=n:r.value=n;else if(Qu(r))r.contents=n;else{let e=Zu(r)?`alias`:`scalar`;throw Error(`Cannot replace node with ${e} parent`)}}var md={"!":`%21`,",":`%2C`,"[":`%5B`,"]":`%5D`,"{":`%7B`,"}":`%7D`},hd=e=>e.replace(/[!,[\]{}]/g,e=>md[e]),gd=class e{constructor(t,n){this.docStart=null,this.docEnd=!1,this.yaml=Object.assign({},e.defaultYaml,t),this.tags=Object.assign({},e.defaultTags,n)}clone(){let t=new e(this.yaml,this.tags);return t.docStart=this.docStart,t}atDocument(){let t=new e(this.yaml,this.tags);switch(this.yaml.version){case`1.1`:this.atNextDocument=!0;break;case`1.2`:this.atNextDocument=!1,this.yaml={explicit:e.defaultYaml.explicit,version:`1.2`},this.tags=Object.assign({},e.defaultTags)}return t}add(t,n){this.atNextDocument&&=(this.yaml={explicit:e.defaultYaml.explicit,version:`1.1`},this.tags=Object.assign({},e.defaultTags),!1);let r=t.trim().split(/[ \t]+/),i=r.shift();switch(i){case`%TAG`:{if(r.length!==2&&(n(0,`%TAG directive should contain exactly two parts`),r.length<2))return!1;let[e,t]=r;return this.tags[e]=t,!0}case`%YAML`:{if(this.yaml.explicit=!0,r.length!==1)return n(0,`%YAML directive should contain exactly one part`),!1;let[e]=r;if(e===`1.1`||e===`1.2`)return this.yaml.version=e,!0;{let t=/^\d+\.\d+$/.test(e);return n(6,`Unsupported YAML version ${e}`,t),!1}}default:return n(0,`Unknown directive ${i}`,!0),!1}}tagName(e,t){if(e===`!`)return`!`;if(e[0]!==`!`)return t(`Not a valid tag: ${e}`),null;if(e[1]===`<`){let n=e.slice(2,-1);return n===`!`||n===`!!`?(t(`Verbatim tags aren't resolved, so ${e} is invalid.`),null):(e[e.length-1]!==`>`&&t(`Verbatim tags must end with a >`),n)}let[,n,r]=e.match(/^(.*!)([^!]*)$/s);r||t(`The ${e} tag has no suffix`);let i=this.tags[n];if(i)try{return i+decodeURIComponent(r)}catch(e){return t(String(e)),null}return n===`!`?e:(t(`Could not resolve tag: ${e}`),null)}tagString(e){for(let[t,n]of Object.entries(this.tags))if(e.startsWith(n))return t+hd(e.substring(n.length));return e[0]===`!`?e:`!<${e}>`}toString(e){let t=this.yaml.explicit?[`%YAML ${this.yaml.version||`1.2`}`]:[],n=Object.entries(this.tags),r;if(e&&n.length>0&&id(e.contents)){let t={};ld(e.contents,(e,n)=>{id(n)&&n.tag&&(t[n.tag]=!0)}),r=Object.keys(t)}else r=[];for(let[i,a]of n)i===`!!`&&a===`tag:yaml.org,2002:`||e&&!r.some(e=>e.startsWith(a))||t.push(`%TAG ${i} ${a}`);return t.join(`
`)}};gd.defaultYaml={explicit:!1,version:`1.2`},gd.defaultTags={"!!":`tag:yaml.org,2002:`};function _d(e){if(/[\x00-\x19\s,[\]{}]/.test(e)){let t=`Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;throw Error(t)}return!0}function vd(e){let t=new Set;return ld(e,{Value(e,n){n.anchor&&t.add(n.anchor)}}),t}function yd(e,t){for(let n=1;;++n){let r=`${e}${n}`;if(!t.has(r))return r}}function bd(e,t){let n=[],r=new Map,i=null;return{onAnchor:r=>{n.push(r),i??=vd(e);let a=yd(t,i);return i.add(a),a},setAnchors:()=>{for(let e of n){let t=r.get(e);if(typeof t==`object`&&t.anchor&&(td(t.node)||rd(t.node)))t.node.anchor=t.anchor;else{let t=Error(`Failed to resolve repeated object (this should not happen)`);throw t.source=e,t}}},sourceObjects:r}}function xd(e,t,n,r){if(r&&typeof r==`object`){if(Array.isArray(r))for(let t=0,n=r.length;t<n;++t){let n=r[t],i=xd(e,r,String(t),n);i===void 0?delete r[t]:i!==n&&(r[t]=i)}else if(r instanceof Map)for(let t of Array.from(r.keys())){let n=r.get(t),i=xd(e,r,t,n);i===void 0?r.delete(t):i!==n&&r.set(t,i)}else if(r instanceof Set)for(let t of Array.from(r)){let n=xd(e,r,t,t);n===void 0?r.delete(t):n!==t&&(r.delete(t),r.add(n))}else for(let[t,n]of Object.entries(r)){let i=xd(e,r,t,n);i===void 0?delete r[t]:i!==n&&(r[t]=i)}}return e.call(t,n,r)}function Sd(e,t,n){if(Array.isArray(e))return e.map((e,t)=>Sd(e,String(t),n));if(e&&typeof e.toJSON==`function`){if(!n||!ad(e))return e.toJSON(t,n);let r={aliasCount:0,count:1,res:void 0};n.anchors.set(e,r),n.onCreate=e=>{r.res=e,delete n.onCreate};let i=e.toJSON(t,n);return n.onCreate&&n.onCreate(i),i}return typeof e==`bigint`&&!n?.keep?Number(e):e}var Cd=class{constructor(e){Object.defineProperty(this,Xu,{value:e})}clone(){let e=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return this.range&&(e.range=this.range.slice()),e}toJS(e,{mapAsMap:t,maxAliasCount:n,onAnchor:r,reviver:i}={}){if(!Qu(e))throw TypeError(`A document argument is required`);let a={anchors:new Map,doc:e,keep:!0,mapAsMap:t===!0,mapKeyWarned:!1,maxAliasCount:typeof n==`number`?n:100},o=Sd(this,``,a);if(typeof r==`function`)for(let{count:e,res:t}of a.anchors.values())r(t,e);return typeof i==`function`?xd(i,{"":o},``,o):o}},wd=class extends Cd{constructor(e){super(Wu),this.source=e,Object.defineProperty(this,"tag",{set(){throw Error(`Alias nodes cannot have tags`)}})}resolve(e,t){if(t?.maxAliasCount===0)throw ReferenceError(`Alias resolution is disabled`);let n;t?.aliasResolveCache?n=t.aliasResolveCache:(n=[],ld(e,{Node:(e,t)=>{(Zu(t)||ad(t))&&n.push(t)}}),t&&(t.aliasResolveCache=n));let r;for(let e of n){if(e===this)break;e.anchor===this.source&&(r=e)}if(r&&t){let{anchors:e,doc:n,maxAliasCount:i}=t,a=e.get(r);if(a||=(Sd(r,null,t),e.get(r)),a?.res===void 0)throw ReferenceError(`This should not happen: Alias anchor was not resolved?`);if(i>=0&&(a.count+=1,a.aliasCount===0&&(a.aliasCount=Td(n,r,e)),a.count*a.aliasCount>i))throw ReferenceError(`Excessive alias count indicates a resource exhaustion attack`)}return r}toJSON(e,t){if(!t)return{source:this.source};let n=this.resolve(t.doc,t);if(!n){let e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw ReferenceError(e)}return t.anchors.get(n).res}toString(e,t,n){let r=`*${this.source}`;if(e){if(_d(this.source),e.options.verifyAliasOrder&&!e.anchors.has(this.source)){let e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw Error(e)}if(e.implicitKey)return`${r} `}return r}};function Td(e,t,n){if(Zu(t)){let r=t.resolve(e),i=n&&r&&n.get(r);return i?i.count*i.aliasCount:0}if(rd(t)){let r=0;for(let i of t.items){let t=Td(e,i,n);t>r&&(r=t)}return r}if(ed(t)){let r=Td(e,t.key,n),i=Td(e,t.value,n);return Math.max(r,i)}return 1}var Ed=e=>!e||typeof e!=`function`&&typeof e!=`object`,Q=class extends Cd{constructor(e){super(Ju),this.value=e}toJSON(e,t){return t?.keep?this.value:Sd(this.value,e,t)}toString(){return String(this.value)}};Q.BLOCK_FOLDED=`BLOCK_FOLDED`,Q.BLOCK_LITERAL=`BLOCK_LITERAL`,Q.PLAIN=`PLAIN`,Q.QUOTE_DOUBLE=`QUOTE_DOUBLE`,Q.QUOTE_SINGLE=`QUOTE_SINGLE`;var Dd=`tag:yaml.org,2002:`;function Od(e,t,n){if(t){let e=n.filter(e=>e.tag===t),r=e.find(e=>!e.format)??e[0];if(!r)throw Error(`Tag ${t} not found`);return r}return n.find(t=>t.identify?.(e)&&!t.format)}function kd(e,t,n){if(Qu(e)&&(e=e.contents),id(e))return e;if(ed(e)){let t=n.schema[Ku].createNode?.(n.schema,null,n);return t.items.push(e),t}(e instanceof String||e instanceof Number||e instanceof Boolean||typeof BigInt<`u`&&e instanceof BigInt)&&(e=e.valueOf());let{aliasDuplicateObjects:r,onAnchor:i,onTagObj:a,schema:o,sourceObjects:s}=n,c;if(r&&e&&typeof e==`object`){if(c=s.get(e),c)return c.anchor??(c.anchor=i(e)),new wd(c.anchor);c={anchor:null,node:null},s.set(e,c)}t?.startsWith(`!!`)&&(t=Dd+t.slice(2));let l=Od(e,t,o.tags);if(!l){if(e&&typeof e.toJSON==`function`&&(e=e.toJSON()),!e||typeof e!=`object`){let t=new Q(e);return c&&(c.node=t),t}l=e instanceof Map?o[Ku]:Symbol.iterator in Object(e)?o[Yu]:o[Ku]}a&&(a(l),delete n.onTagObj);let u=l?.createNode?l.createNode(n.schema,e,n):typeof l?.nodeClass?.from==`function`?l.nodeClass.from(n.schema,e,n):new Q(e);return t?u.tag=t:l.default||(u.tag=l.tag),c&&(c.node=u),u}function Ad(e,t,n){let r=n;for(let e=t.length-1;e>=0;--e){let n=t[e];if(typeof n==`number`&&Number.isInteger(n)&&n>=0){let e=[];e[n]=r,r=e}else r=new Map([[n,r]])}return kd(r,void 0,{aliasDuplicateObjects:!1,keepUndefined:!1,onAnchor:()=>{throw Error(`This should not happen, please report a bug.`)},schema:e,sourceObjects:new Map})}var jd=e=>e==null||typeof e==`object`&&!!e[Symbol.iterator]().next().done,Md=class extends Cd{constructor(e,t){super(e),Object.defineProperty(this,"schema",{value:t,configurable:!0,enumerable:!1,writable:!0})}clone(e){let t=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return e&&(t.schema=e),t.items=t.items.map(t=>id(t)||ed(t)?t.clone(e):t),this.range&&(t.range=this.range.slice()),t}addIn(e,t){if(jd(e))this.add(t);else{let[n,...r]=e,i=this.get(n,!0);if(rd(i))i.addIn(r,t);else if(i===void 0&&this.schema)this.set(n,Ad(this.schema,r,t));else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`)}}deleteIn(e){let[t,...n]=e;if(n.length===0)return this.delete(t);let r=this.get(t,!0);if(rd(r))return r.deleteIn(n);throw Error(`Expected YAML collection at ${t}. Remaining path: ${n}`)}getIn(e,t){let[n,...r]=e,i=this.get(n,!0);return r.length===0?!t&&td(i)?i.value:i:rd(i)?i.getIn(r,t):void 0}hasAllNullValues(e){return this.items.every(t=>{if(!ed(t))return!1;let n=t.value;return n==null||e&&td(n)&&n.value==null&&!n.commentBefore&&!n.comment&&!n.tag})}hasIn(e){let[t,...n]=e;if(n.length===0)return this.has(t);let r=this.get(t,!0);return rd(r)?r.hasIn(n):!1}setIn(e,t){let[n,...r]=e;if(r.length===0)this.set(n,t);else{let e=this.get(n,!0);if(rd(e))e.setIn(r,t);else if(e===void 0&&this.schema)this.set(n,Ad(this.schema,r,t));else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`)}}},Nd=e=>e.replace(/^(?!$)(?: $)?/gm,`#`);function Pd(e,t){return/^\n+$/.test(e)?e.substring(1):t?e.replace(/^(?! *$)/gm,t):e}var Fd=(e,t,n)=>e.endsWith(`
`)?Pd(n,t):n.includes(`
`)?`
`+Pd(n,t):(e.endsWith(` `)?``:` `)+n,Id=`flow`,Ld=`block`,Rd=`quoted`;function zd(e,t,n=`flow`,{indentAtStart:r,lineWidth:i=80,minContentWidth:a=20,onFold:o,onOverflow:s}={}){if(!i||i<0)return e;i<a&&(a=0);let c=Math.max(1+a,1+i-t.length);if(e.length<=c)return e;let l=[],u={},d=i-t.length;typeof r==`number`&&(r>i-Math.max(2,a)?l.push(0):d=i-r);let f,p,m=!1,h=-1,g=-1,_=-1;n===`block`&&(h=Bd(e,h,t.length),h!==-1&&(d=h+c));for(let r;r=e[h+=1];){if(n===`quoted`&&r===`\\`){switch(g=h,e[h+1]){case`x`:h+=3;break;case`u`:h+=5;break;case`U`:h+=9;break;default:h+=1}_=h}if(r===`
`)n===`block`&&(h=Bd(e,h,t.length)),d=h+t.length+c,f=void 0;else{if(r===` `&&p&&p!==` `&&p!==`
`&&p!==`	`){let t=e[h+1];t&&t!==` `&&t!==`
`&&t!==`	`&&(f=h)}if(h>=d){if(f)l.push(f),d=f+c,f=void 0;else if(n===`quoted`){for(;p===` `||p===`	`;)p=r,r=e[h+=1],m=!0;let t=h>_+1?h-2:g-1;if(u[t])return e;l.push(t),u[t]=!0,d=t+c,f=void 0}else m=!0}}p=r}if(m&&s&&s(),l.length===0)return e;o&&o();let v=e.slice(0,l[0]);for(let r=0;r<l.length;++r){let i=l[r],a=l[r+1]||e.length;i===0?v=`\n${t}${e.slice(0,a)}`:(n===`quoted`&&u[i]&&(v+=`${e[i]}\\`),v+=`\n${t}${e.slice(i+1,a)}`)}return v}function Bd(e,t,n){let r=t,i=t+1,a=e[i];for(;a===` `||a===`	`;)if(t<i+n)a=e[++t];else{do a=e[++t];while(a&&a!==`
`);r=t,i=t+1,a=e[i]}return r}var Vd=(e,t)=>({indentAtStart:t?e.indent.length:e.indentAtStart,lineWidth:e.options.lineWidth,minContentWidth:e.options.minContentWidth}),Hd=e=>/^(%|---|\.\.\.)/m.test(e);function Ud(e,t,n){if(!t||t<0)return!1;let r=t-n,i=e.length;if(i<=r)return!1;for(let t=0,n=0;t<i;++t)if(e[t]===`
`){if(t-n>r)return!0;if(n=t+1,i-n<=r)return!1}return!0}function Wd(e,t){let n=JSON.stringify(e);if(t.options.doubleQuotedAsJSON)return n;let{implicitKey:r}=t,i=t.options.doubleQuotedMinMultiLineLength,a=t.indent||(Hd(e)?`  `:``),o=``,s=0;for(let e=0,t=n[e];t;t=n[++e])if(t===` `&&n[e+1]===`\\`&&n[e+2]===`n`&&(o+=n.slice(s,e)+`\\ `,e+=1,s=e,t=`\\`),t===`\\`)switch(n[e+1]){case`u`:{o+=n.slice(s,e);let t=n.substr(e+2,4);switch(t){case`0000`:o+=`\\0`;break;case`0007`:o+=`\\a`;break;case`000b`:o+=`\\v`;break;case`001b`:o+=`\\e`;break;case`0085`:o+=`\\N`;break;case`00a0`:o+=`\\_`;break;case`2028`:o+=`\\L`;break;case`2029`:o+=`\\P`;break;default:t.substr(0,2)===`00`?o+=`\\x`+t.substr(2):o+=n.substr(e,6)}e+=5,s=e+1}break;case`n`:if(r||n[e+2]===`"`||n.length<i)e+=1;else{for(o+=n.slice(s,e)+`

`;n[e+2]===`\\`&&n[e+3]===`n`&&n[e+4]!==`"`;)o+=`
`,e+=2;o+=a,n[e+2]===` `&&(o+=`\\`),e+=1,s=e+1}break;default:e+=1}return o=s?o+n.slice(s):n,r?o:zd(o,a,Rd,Vd(t,!1))}function Gd(e,t){if(t.options.singleQuote===!1||t.implicitKey&&e.includes(`
`)||/[ \t]\n|\n[ \t]/.test(e))return Wd(e,t);let n=t.indent||(Hd(e)?`  `:``),r=`'`+e.replace(/'/g,`''`).replace(/\n+/g,`$&\n${n}`)+`'`;return t.implicitKey?r:zd(r,n,Id,Vd(t,!1))}function Kd(e,t){let{singleQuote:n}=t.options,r;if(n===!1)r=Wd;else{let t=e.includes(`"`),i=e.includes(`'`);r=t&&!i?Gd:i&&!t?Wd:n?Gd:Wd}return r(e,t)}var qd;try{qd=RegExp(`(^|(?<!
))
+(?!
|$)`,`g`)}catch{qd=/\n+(?!\n|$)/g}function Jd({comment:e,type:t,value:n},r,i,a){let{blockQuote:o,commentString:s,lineWidth:c}=r.options;if(!o||/\n[\t ]+$/.test(n))return Kd(n,r);let l=r.indent||(r.forceBlockIndent||Hd(n)?`  `:``),u=o===`literal`?!0:o===`folded`||t===Q.BLOCK_FOLDED?!1:t===Q.BLOCK_LITERAL||!Ud(n,c,l.length);if(!n)return u?`|
`:`>
`;let d,f;for(f=n.length;f>0;--f){let e=n[f-1];if(e!==`
`&&e!==`	`&&e!==` `)break}let p=n.substring(f),m=p.indexOf(`
`);m===-1?d=`-`:n===p||m!==p.length-1?(d=`+`,a&&a()):d=``,p&&=(n=n.slice(0,-p.length),p[p.length-1]===`
`&&(p=p.slice(0,-1)),p.replace(qd,`$&${l}`));let h=!1,g,_=-1;for(g=0;g<n.length;++g){let e=n[g];if(e===` `)h=!0;else if(e===`
`)_=g;else break}let v=n.substring(0,_<g?_+1:g);v&&=(n=n.substring(v.length),v.replace(/\n+/g,`$&${l}`));let y=(h?l?`2`:`1`:``)+d;if(e&&(y+=` `+s(e.replace(/ ?[\r\n]+/g,` `)),i&&i()),!u){let e=n.replace(/\n+/g,`
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g,`$1$2`).replace(/\n+/g,`$&${l}`),i=!1,a=Vd(r,!0);o!==`folded`&&t!==Q.BLOCK_FOLDED&&(a.onOverflow=()=>{i=!0});let s=zd(`${v}${e}${p}`,l,Ld,a);if(!i)return`>${y}\n${l}${s}`}return n=n.replace(/\n+/g,`$&${l}`),`|${y}\n${l}${v}${n}${p}`}function Yd(e,t,n,r){let{type:i,value:a}=e,{actualString:o,implicitKey:s,indent:c,indentStep:l,inFlow:u}=t;if(s&&a.includes(`
`)||u&&/[[\]{},]/.test(a))return Kd(a,t);if(/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a))return s||u||!a.includes(`
`)?Kd(a,t):Jd(e,t,n,r);if(!s&&!u&&i!==Q.PLAIN&&a.includes(`
`))return Jd(e,t,n,r);if(Hd(a)){if(c===``)return t.forceBlockIndent=!0,Jd(e,t,n,r);if(s&&c===l)return Kd(a,t)}let d=a.replace(/\n+/g,`$&\n${c}`);if(o){let e=e=>e.default&&e.tag!==`tag:yaml.org,2002:str`&&e.test?.test(d),{compat:n,tags:r}=t.doc.schema;if(r.some(e)||n?.some(e))return Kd(a,t)}return s?d:zd(d,c,Id,Vd(t,!1))}function Xd(e,t,n,r){let{implicitKey:i,inFlow:a}=t,o=typeof e.value==`string`?e:Object.assign({},e,{value:String(e.value)}),{type:s}=e;s!==Q.QUOTE_DOUBLE&&/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value)&&(s=Q.QUOTE_DOUBLE);let c=e=>{switch(e){case Q.BLOCK_FOLDED:case Q.BLOCK_LITERAL:return i||a?Kd(o.value,t):Jd(o,t,n,r);case Q.QUOTE_DOUBLE:return Wd(o.value,t);case Q.QUOTE_SINGLE:return Gd(o.value,t);case Q.PLAIN:return Yd(o,t,n,r);default:return null}},l=c(s);if(l===null){let{defaultKeyType:e,defaultStringType:n}=t.options,r=i&&e||n;if(l=c(r),l===null)throw Error(`Unsupported default string type ${r}`)}return l}function Zd(e,t){let n=Object.assign({blockQuote:!0,commentString:Nd,defaultKeyType:null,defaultStringType:`PLAIN`,directives:null,doubleQuotedAsJSON:!1,doubleQuotedMinMultiLineLength:40,falseStr:`false`,flowCollectionPadding:!0,indentSeq:!0,lineWidth:80,minContentWidth:20,nullStr:`null`,simpleKeys:!1,singleQuote:null,trailingComma:!1,trueStr:`true`,verifyAliasOrder:!0},e.schema.toStringOptions,t),r;switch(n.collectionStyle){case`block`:r=!1;break;case`flow`:r=!0;break;default:r=null}return{anchors:new Set,doc:e,flowCollectionPadding:n.flowCollectionPadding?` `:``,indent:``,indentStep:typeof n.indent==`number`?` `.repeat(n.indent):`  `,inFlow:r,options:n}}function Qd(e,t){if(t.tag){let n=e.filter(e=>e.tag===t.tag);if(n.length>0)return n.find(e=>e.format===t.format)??n[0]}let n,r;if(td(t)){r=t.value;let i=e.filter(e=>e.identify?.(r));if(i.length>1){let e=i.filter(e=>e.test);e.length>0&&(i=e)}n=i.find(e=>e.format===t.format)??i.find(e=>!e.format)}else r=t,n=e.find(e=>e.nodeClass&&r instanceof e.nodeClass);if(!n){let e=r?.constructor?.name??(r===null?`null`:typeof r);throw Error(`Tag not resolved for ${e} value`)}return n}function $d(e,t,{anchors:n,doc:r}){if(!r.directives)return``;let i=[],a=(td(e)||rd(e))&&e.anchor;a&&_d(a)&&(n.add(a),i.push(`&${a}`));let o=e.tag??(t.default?null:t.tag);return o&&i.push(r.directives.tagString(o)),i.join(` `)}function ef(e,t,n,r){if(ed(e))return e.toString(t,n,r);if(Zu(e)){if(t.doc.directives)return e.toString(t);if(t.resolvedAliases?.has(e))throw TypeError(`Cannot stringify circular structure without alias nodes`);t.resolvedAliases?t.resolvedAliases.add(e):t.resolvedAliases=new Set([e]),e=e.resolve(t.doc)}let i,a=id(e)?e:t.doc.createNode(e,{onTagObj:e=>i=e});i??=Qd(t.doc.schema.tags,a);let o=$d(a,i,t);o.length>0&&(t.indentAtStart=(t.indentAtStart??0)+o.length+1);let s=typeof i.stringify==`function`?i.stringify(a,t,n,r):td(a)?Xd(a,t,n,r):a.toString(t,n,r);return o?td(a)||s[0]===`{`||s[0]===`[`?`${o} ${s}`:`${o}\n${t.indent}${s}`:s}function tf({key:e,value:t},n,r,i){let{allNullValues:a,doc:o,indent:s,indentStep:c,options:{commentString:l,indentSeq:u,simpleKeys:d}}=n,f=id(e)&&e.comment||null;if(d){if(f)throw Error(`With simple keys, key nodes cannot have comments`);if(rd(e)||!id(e)&&typeof e==`object`)throw Error(`With simple keys, collection cannot be used as a key value`)}let p=!d&&(!e||f&&t==null&&!n.inFlow||rd(e)||(td(e)?e.type===Q.BLOCK_FOLDED||e.type===Q.BLOCK_LITERAL:typeof e==`object`));n=Object.assign({},n,{allNullValues:!1,implicitKey:!p&&(d||!a),indent:s+c});let m=!1,h=!1,g=ef(e,n,()=>m=!0,()=>h=!0);if(!p&&!n.inFlow&&g.length>1024){if(d)throw Error(`With simple keys, single line scalar must not span more than 1024 characters`);p=!0}if(n.inFlow){if(a||t==null)return m&&r&&r(),g===``?`?`:p?`? ${g}`:g}else if(a&&!d||t==null&&p)return g=`? ${g}`,f&&!m?g+=Fd(g,n.indent,l(f)):h&&i&&i(),g;m&&(f=null),p?(f&&(g+=Fd(g,n.indent,l(f))),g=`? ${g}\n${s}:`):(g=`${g}:`,f&&(g+=Fd(g,n.indent,l(f))));let _,v,y;id(t)?(_=!!t.spaceBefore,v=t.commentBefore,y=t.comment):(_=!1,v=null,y=null,t&&typeof t==`object`&&(t=o.createNode(t))),n.implicitKey=!1,!p&&!f&&td(t)&&(n.indentAtStart=g.length+1),h=!1,!u&&c.length>=2&&!n.inFlow&&!p&&nd(t)&&!t.flow&&!t.tag&&!t.anchor&&(n.indent=n.indent.substring(2));let b=!1,x=ef(t,n,()=>b=!0,()=>h=!0),S=` `;if(f||_||v){if(S=_?`
`:``,v){let e=l(v);S+=`\n${Pd(e,n.indent)}`}x===``&&!n.inFlow?S===`
`&&y&&(S=`

`):S+=`\n${n.indent}`}else if(!p&&rd(t)){let e=x[0],r=x.indexOf(`
`),i=r!==-1,a=n.inFlow??t.flow??t.items.length===0;if(i||!a){let t=!1;if(i&&(e===`&`||e===`!`)){let n=x.indexOf(` `);e===`&`&&n!==-1&&n<r&&x[n+1]===`!`&&(n=x.indexOf(` `,n+1)),(n===-1||r<n)&&(t=!0)}t||(S=`\n${n.indent}`)}}else(x===``||x[0]===`
`)&&(S=``);return g+=S+x,n.inFlow?b&&r&&r():y&&!b?g+=Fd(g,n.indent,l(y)):h&&i&&i(),g}function nf(e,t){(e===`debug`||e===`warn`)&&console.warn(t)}var rf=`<<`,af={identify:e=>e===rf||typeof e==`symbol`&&e.description===rf,default:`key`,tag:`tag:yaml.org,2002:merge`,test:/^<<$/,resolve:()=>Object.assign(new Q(Symbol(rf)),{addToJSMap:sf}),stringify:()=>rf},of=(e,t)=>(af.identify(t)||td(t)&&(!t.type||t.type===Q.PLAIN)&&af.identify(t.value))&&e?.doc.schema.tags.some(e=>e.tag===af.tag&&e.default);function sf(e,t,n){let r=lf(e,n);if(nd(r))for(let n of r.items)cf(e,t,n);else if(Array.isArray(r))for(let n of r)cf(e,t,n);else cf(e,t,r)}function cf(e,t,n){let r=lf(e,n);if(!$u(r))throw Error(`Merge sources must be maps or map aliases`);let i=r.toJSON(null,e,Map);for(let[e,n]of i)t instanceof Map?t.has(e)||t.set(e,n):t instanceof Set?t.add(e):Object.prototype.hasOwnProperty.call(t,e)||Object.defineProperty(t,e,{value:n,writable:!0,enumerable:!0,configurable:!0});return t}function lf(e,t){return e&&Zu(t)?t.resolve(e.doc,e):t}function uf(e,t,{key:n,value:r}){if(id(n)&&n.addToJSMap)n.addToJSMap(e,t,r);else if(of(e,n))sf(e,t,r);else{let i=Sd(n,``,e);if(t instanceof Map)t.set(i,Sd(r,i,e));else if(t instanceof Set)t.add(i);else{let a=df(n,i,e),o=Sd(r,a,e);a in t?Object.defineProperty(t,a,{value:o,writable:!0,enumerable:!0,configurable:!0}):t[a]=o}}return t}function df(e,t,n){if(t===null)return``;if(typeof t!=`object`)return String(t);if(id(e)&&n?.doc){let t=Zd(n.doc,{});t.anchors=new Set;for(let e of n.anchors.keys())t.anchors.add(e.anchor);t.inFlow=!0,t.inStringifyKey=!0;let r=e.toString(t);if(!n.mapKeyWarned){let e=JSON.stringify(r);e.length>40&&(e=e.substring(0,36)+`..."`),nf(n.doc.options.logLevel,`Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`),n.mapKeyWarned=!0}return r}return JSON.stringify(t)}function ff(e,t,n){return new pf(kd(e,void 0,n),kd(t,void 0,n))}var pf=class e{constructor(e,t=null){Object.defineProperty(this,Xu,{value:qu}),this.key=e,this.value=t}clone(t){let{key:n,value:r}=this;return id(n)&&(n=n.clone(t)),id(r)&&(r=r.clone(t)),new e(n,r)}toJSON(e,t){return uf(t,t?.mapAsMap?new Map:{},this)}toString(e,t,n){return e?.doc?tf(this,e,t,n):JSON.stringify(this)}};function mf(e,t,n){return(t.inFlow??e.flow?gf:hf)(e,t,n)}function hf({comment:e,items:t},n,{blockItemPrefix:r,flowChars:i,itemIndent:a,onChompKeep:o,onComment:s}){let{indent:c,options:{commentString:l}}=n,u=Object.assign({},n,{indent:a,type:null}),d=!1,f=[];for(let e=0;e<t.length;++e){let i=t[e],o=null;if(id(i))!d&&i.spaceBefore&&f.push(``),_f(n,f,i.commentBefore,d),i.comment&&(o=i.comment);else if(ed(i)){let e=id(i.key)?i.key:null;e&&(!d&&e.spaceBefore&&f.push(``),_f(n,f,e.commentBefore,d))}d=!1;let s=ef(i,u,()=>o=null,()=>d=!0);o&&(s+=Fd(s,a,l(o))),d&&o&&(d=!1),f.push(r+s)}let p;if(f.length===0)p=i.start+i.end;else{p=f[0];for(let e=1;e<f.length;++e){let t=f[e];p+=t?`\n${c}${t}`:`
`}}return e?(p+=`
`+Pd(l(e),c),s&&s()):d&&o&&o(),p}function gf({items:e},t,{flowChars:n,itemIndent:r}){let{indent:i,indentStep:a,flowCollectionPadding:o,options:{commentString:s}}=t;r+=a;let c=Object.assign({},t,{indent:r,inFlow:!0,type:null}),l=!1,u=0,d=[];for(let n=0;n<e.length;++n){let i=e[n],a=null;if(id(i))i.spaceBefore&&d.push(``),_f(t,d,i.commentBefore,!1),i.comment&&(a=i.comment);else if(ed(i)){let e=id(i.key)?i.key:null;e&&(e.spaceBefore&&d.push(``),_f(t,d,e.commentBefore,!1),e.comment&&(l=!0));let n=id(i.value)?i.value:null;n?(n.comment&&(a=n.comment),n.commentBefore&&(l=!0)):i.value==null&&e?.comment&&(a=e.comment)}a&&(l=!0);let o=ef(i,c,()=>a=null);l||=d.length>u||o.includes(`
`),n<e.length-1?o+=`,`:t.options.trailingComma&&(t.options.lineWidth>0&&(l||=d.reduce((e,t)=>e+t.length+2,2)+(o.length+2)>t.options.lineWidth),l&&(o+=`,`)),a&&(o+=Fd(o,r,s(a))),d.push(o),u=d.length}let{start:f,end:p}=n;if(d.length===0)return f+p;if(!l){let e=d.reduce((e,t)=>e+t.length+2,2);l=t.options.lineWidth>0&&e>t.options.lineWidth}if(l){let e=f;for(let t of d)e+=t?`\n${a}${i}${t}`:`
`;return`${e}\n${i}${p}`}return`${f}${o}${d.join(` `)}${o}${p}`}function _f({indent:e,options:{commentString:t}},n,r,i){if(r&&i&&(r=r.replace(/^\n+/,``)),r){let i=Pd(t(r),e);n.push(i.trimStart())}}function vf(e,t){let n=td(t)?t.value:t;for(let r of e)if(ed(r)&&(r.key===t||r.key===n||td(r.key)&&r.key.value===n))return r}var yf=class extends Md{static get tagName(){return`tag:yaml.org,2002:map`}constructor(e){super(Ku,e),this.items=[]}static from(e,t,n){let{keepUndefined:r,replacer:i}=n,a=new this(e),o=(e,o)=>{if(typeof i==`function`)o=i.call(t,e,o);else if(Array.isArray(i)&&!i.includes(e))return;(o!==void 0||r)&&a.items.push(ff(e,o,n))};if(t instanceof Map)for(let[e,n]of t)o(e,n);else if(t&&typeof t==`object`)for(let e of Object.keys(t))o(e,t[e]);return typeof e.sortMapEntries==`function`&&a.items.sort(e.sortMapEntries),a}add(e,t){let n;n=ed(e)?e:!e||typeof e!=`object`||!(`key`in e)?new pf(e,e?.value):new pf(e.key,e.value);let r=vf(this.items,n.key),i=this.schema?.sortMapEntries;if(r){if(!t)throw Error(`Key ${n.key} already set`);td(r.value)&&Ed(n.value)?r.value.value=n.value:r.value=n.value}else if(i){let e=this.items.findIndex(e=>i(n,e)<0);e===-1?this.items.push(n):this.items.splice(e,0,n)}else this.items.push(n)}delete(e){let t=vf(this.items,e);return t?this.items.splice(this.items.indexOf(t),1).length>0:!1}get(e,t){let n=vf(this.items,e)?.value;return(!t&&td(n)?n.value:n)??void 0}has(e){return!!vf(this.items,e)}set(e,t){this.add(new pf(e,t),!0)}toJSON(e,t,n){let r=n?new n:t?.mapAsMap?new Map:{};t?.onCreate&&t.onCreate(r);for(let e of this.items)uf(t,r,e);return r}toString(e,t,n){if(!e)return JSON.stringify(this);for(let e of this.items)if(!ed(e))throw Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`);return!e.allNullValues&&this.hasAllNullValues(!1)&&(e=Object.assign({},e,{allNullValues:!0})),mf(this,e,{blockItemPrefix:``,flowChars:{start:`{`,end:`}`},itemIndent:e.indent||``,onChompKeep:n,onComment:t})}},bf={collection:`map`,default:!0,nodeClass:yf,tag:`tag:yaml.org,2002:map`,resolve(e,t){return $u(e)||t(`Expected a mapping for this tag`),e},createNode:(e,t,n)=>yf.from(e,t,n)},xf=class extends Md{static get tagName(){return`tag:yaml.org,2002:seq`}constructor(e){super(Yu,e),this.items=[]}add(e){this.items.push(e)}delete(e){let t=Sf(e);return typeof t==`number`&&this.items.splice(t,1).length>0}get(e,t){let n=Sf(e);if(typeof n!=`number`)return;let r=this.items[n];return!t&&td(r)?r.value:r}has(e){let t=Sf(e);return typeof t==`number`&&t<this.items.length}set(e,t){let n=Sf(e);if(typeof n!=`number`)throw Error(`Expected a valid index, not ${e}.`);let r=this.items[n];td(r)&&Ed(t)?r.value=t:this.items[n]=t}toJSON(e,t){let n=[];t?.onCreate&&t.onCreate(n);let r=0;for(let e of this.items)n.push(Sd(e,String(r++),t));return n}toString(e,t,n){return e?mf(this,e,{blockItemPrefix:`- `,flowChars:{start:`[`,end:`]`},itemIndent:(e.indent||``)+`  `,onChompKeep:n,onComment:t}):JSON.stringify(this)}static from(e,t,n){let{replacer:r}=n,i=new this(e);if(t&&Symbol.iterator in Object(t)){let e=0;for(let a of t){if(typeof r==`function`){let n=t instanceof Set?a:String(e++);a=r.call(t,n,a)}i.items.push(kd(a,void 0,n))}}return i}};function Sf(e){let t=td(e)?e.value:e;return t&&typeof t==`string`&&(t=Number(t)),typeof t==`number`&&Number.isInteger(t)&&t>=0?t:null}var Cf={collection:`seq`,default:!0,nodeClass:xf,tag:`tag:yaml.org,2002:seq`,resolve(e,t){return nd(e)||t(`Expected a sequence for this tag`),e},createNode:(e,t,n)=>xf.from(e,t,n)},wf={identify:e=>typeof e==`string`,default:!0,tag:`tag:yaml.org,2002:str`,resolve:e=>e,stringify(e,t,n,r){return t=Object.assign({actualString:!0},t),Xd(e,t,n,r)}},Tf={identify:e=>e==null,createNode:()=>new Q(null),default:!0,tag:`tag:yaml.org,2002:null`,test:/^(?:~|[Nn]ull|NULL)?$/,resolve:()=>new Q(null),stringify:({source:e},t)=>typeof e==`string`&&Tf.test.test(e)?e:t.options.nullStr},Ef={identify:e=>typeof e==`boolean`,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,resolve:e=>new Q(e[0]===`t`||e[0]===`T`),stringify({source:e,value:t},n){return e&&Ef.test.test(e)&&t===(e[0]===`t`||e[0]===`T`)?e:t?n.options.trueStr:n.options.falseStr}};function Df({format:e,minFractionDigits:t,tag:n,value:r}){if(typeof r==`bigint`)return String(r);let i=typeof r==`number`?r:Number(r);if(!isFinite(i))return isNaN(i)?`.nan`:i<0?`-.inf`:`.inf`;let a=Object.is(r,-0)?`-0`:JSON.stringify(r);if(!e&&t&&(!n||n===`tag:yaml.org,2002:float`)&&/^-?\d/.test(a)&&!a.includes(`e`)){let e=a.indexOf(`.`);e<0&&(e=a.length,a+=`.`);let n=t-(a.length-e-1);for(;n-->0;)a+=`0`}return a}var Of={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,resolve:e=>e.slice(-3).toLowerCase()===`nan`?NaN:e[0]===`-`?-1/0:1/0,stringify:Df},kf={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,format:`EXP`,test:/^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e),stringify(e){let t=Number(e.value);return isFinite(t)?t.toExponential():Df(e)}},Af={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,resolve(e){let t=new Q(parseFloat(e)),n=e.indexOf(`.`);return n!==-1&&e[e.length-1]===`0`&&(t.minFractionDigits=e.length-n-1),t},stringify:Df},jf=e=>typeof e==`bigint`||Number.isInteger(e),Mf=(e,t,n,{intAsBigInt:r})=>r?BigInt(e):parseInt(e.substring(t),n);function Nf(e,t,n){let{value:r}=e;return jf(r)&&r>=0?n+r.toString(t):Df(e)}var Pf={identify:e=>jf(e)&&e>=0,default:!0,tag:`tag:yaml.org,2002:int`,format:`OCT`,test:/^0o[0-7]+$/,resolve:(e,t,n)=>Mf(e,2,8,n),stringify:e=>Nf(e,8,`0o`)},Ff={identify:jf,default:!0,tag:`tag:yaml.org,2002:int`,test:/^[-+]?[0-9]+$/,resolve:(e,t,n)=>Mf(e,0,10,n),stringify:Df},If={identify:e=>jf(e)&&e>=0,default:!0,tag:`tag:yaml.org,2002:int`,format:`HEX`,test:/^0x[0-9a-fA-F]+$/,resolve:(e,t,n)=>Mf(e,2,16,n),stringify:e=>Nf(e,16,`0x`)},Lf=[bf,Cf,wf,Tf,Ef,Pf,Ff,If,Of,kf,Af];function Rf(e){return typeof e==`bigint`||Number.isInteger(e)}var zf=({value:e})=>JSON.stringify(e),Bf=[{identify:e=>typeof e==`string`,default:!0,tag:`tag:yaml.org,2002:str`,resolve:e=>e,stringify:zf},{identify:e=>e==null,createNode:()=>new Q(null),default:!0,tag:`tag:yaml.org,2002:null`,test:/^null$/,resolve:()=>null,stringify:zf},{identify:e=>typeof e==`boolean`,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^true$|^false$/,resolve:e=>e===`true`,stringify:zf},{identify:Rf,default:!0,tag:`tag:yaml.org,2002:int`,test:/^-?(?:0|[1-9][0-9]*)$/,resolve:(e,t,{intAsBigInt:n})=>n?BigInt(e):parseInt(e,10),stringify:({value:e})=>Rf(e)?e.toString():JSON.stringify(e)},{identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,resolve:e=>parseFloat(e),stringify:zf}],Vf=[bf,Cf].concat(Bf,{default:!0,tag:``,test:/^/,resolve(e,t){return t(`Unresolved plain scalar ${JSON.stringify(e)}`),e}}),Hf={identify:e=>e instanceof Uint8Array,default:!1,tag:`tag:yaml.org,2002:binary`,resolve(e,t){if(typeof atob==`function`){let t=atob(e.replace(/[\n\r]/g,``)),n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n[e]=t.charCodeAt(e);return n}return t(`This environment does not support reading binary tags; either Buffer or atob is required`),e},stringify({comment:e,type:t,value:n},r,i,a){if(!n)return``;let o=n,s;if(typeof btoa==`function`){let e=``;for(let t=0;t<o.length;++t)e+=String.fromCharCode(o[t]);s=btoa(e)}else throw Error(`This environment does not support writing binary tags; either Buffer or btoa is required`);if(t??=Q.BLOCK_LITERAL,t!==Q.QUOTE_DOUBLE){let e=Math.max(r.options.lineWidth-r.indent.length,r.options.minContentWidth),n=Math.ceil(s.length/e),i=Array(n);for(let t=0,r=0;t<n;++t,r+=e)i[t]=s.substr(r,e);s=i.join(t===Q.BLOCK_LITERAL?`
`:` `)}return Xd({comment:e,type:t,value:s},r,i,a)}};function Uf(e,t){if(nd(e))for(let n=0;n<e.items.length;++n){let r=e.items[n];if(!ed(r)){if($u(r)){r.items.length>1&&t(`Each pair must have its own sequence indicator`);let e=r.items[0]||new pf(new Q(null));if(r.commentBefore&&(e.key.commentBefore=e.key.commentBefore?`${r.commentBefore}\n${e.key.commentBefore}`:r.commentBefore),r.comment){let t=e.value??e.key;t.comment=t.comment?`${r.comment}\n${t.comment}`:r.comment}r=e}e.items[n]=ed(r)?r:new pf(r)}}else t(`Expected a sequence for this tag`);return e}function Wf(e,t,n){let{replacer:r}=n,i=new xf(e);i.tag=`tag:yaml.org,2002:pairs`;let a=0;if(t&&Symbol.iterator in Object(t))for(let e of t){typeof r==`function`&&(e=r.call(t,String(a++),e));let o,s;if(Array.isArray(e)){if(e.length===2)o=e[0],s=e[1];else throw TypeError(`Expected [key, value] tuple: ${e}`)}else if(e&&e instanceof Object){let t=Object.keys(e);if(t.length===1)o=t[0],s=e[o];else throw TypeError(`Expected tuple with one key, not ${t.length} keys`)}else o=e;i.items.push(ff(o,s,n))}return i}var Gf={collection:`seq`,default:!1,tag:`tag:yaml.org,2002:pairs`,resolve:Uf,createNode:Wf},Kf=class e extends xf{constructor(){super(),this.add=yf.prototype.add.bind(this),this.delete=yf.prototype.delete.bind(this),this.get=yf.prototype.get.bind(this),this.has=yf.prototype.has.bind(this),this.set=yf.prototype.set.bind(this),this.tag=e.tag}toJSON(e,t){if(!t)return super.toJSON(e);let n=new Map;t?.onCreate&&t.onCreate(n);for(let e of this.items){let r,i;if(ed(e)?(r=Sd(e.key,``,t),i=Sd(e.value,r,t)):r=Sd(e,``,t),n.has(r))throw Error(`Ordered maps must not include duplicate keys`);n.set(r,i)}return n}static from(e,t,n){let r=Wf(e,t,n),i=new this;return i.items=r.items,i}};Kf.tag=`tag:yaml.org,2002:omap`;var qf={collection:`seq`,identify:e=>e instanceof Map,nodeClass:Kf,default:!1,tag:`tag:yaml.org,2002:omap`,resolve(e,t){let n=Uf(e,t),r=[];for(let{key:e}of n.items)td(e)&&(r.includes(e.value)?t(`Ordered maps must not include duplicate keys: ${e.value}`):r.push(e.value));return Object.assign(new Kf,n)},createNode:(e,t,n)=>Kf.from(e,t,n)};function Jf({value:e,source:t},n){return t&&(e?Yf:Xf).test.test(t)?t:e?n.options.trueStr:n.options.falseStr}var Yf={identify:e=>e===!0,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,resolve:()=>new Q(!0),stringify:Jf},Xf={identify:e=>e===!1,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,resolve:()=>new Q(!1),stringify:Jf},Zf={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,resolve:e=>e.slice(-3).toLowerCase()===`nan`?NaN:e[0]===`-`?-1/0:1/0,stringify:Df},Qf={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,format:`EXP`,test:/^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e.replace(/_/g,``)),stringify(e){let t=Number(e.value);return isFinite(t)?t.toExponential():Df(e)}},$f={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,resolve(e){let t=new Q(parseFloat(e.replace(/_/g,``))),n=e.indexOf(`.`);if(n!==-1){let r=e.substring(n+1).replace(/_/g,``);r[r.length-1]===`0`&&(t.minFractionDigits=r.length)}return t},stringify:Df},ep=e=>typeof e==`bigint`||Number.isInteger(e);function tp(e,t,n,{intAsBigInt:r}){let i=e[0];if((i===`-`||i===`+`)&&(t+=1),e=e.substring(t).replace(/_/g,``),r){switch(n){case 2:e=`0b${e}`;break;case 8:e=`0o${e}`;break;case 16:e=`0x${e}`}let t=BigInt(e);return i===`-`?BigInt(-1)*t:t}let a=parseInt(e,n);return i===`-`?-1*a:a}function np(e,t,n){let{value:r}=e;if(ep(r)){let e=r.toString(t);return r<0?`-`+n+e.substr(1):n+e}return Df(e)}var rp={identify:ep,default:!0,tag:`tag:yaml.org,2002:int`,format:`BIN`,test:/^[-+]?0b[0-1_]+$/,resolve:(e,t,n)=>tp(e,2,2,n),stringify:e=>np(e,2,`0b`)},ip={identify:ep,default:!0,tag:`tag:yaml.org,2002:int`,format:`OCT`,test:/^[-+]?0[0-7_]+$/,resolve:(e,t,n)=>tp(e,1,8,n),stringify:e=>np(e,8,`0`)},ap={identify:ep,default:!0,tag:`tag:yaml.org,2002:int`,test:/^[-+]?[0-9][0-9_]*$/,resolve:(e,t,n)=>tp(e,0,10,n),stringify:Df},op={identify:ep,default:!0,tag:`tag:yaml.org,2002:int`,format:`HEX`,test:/^[-+]?0x[0-9a-fA-F_]+$/,resolve:(e,t,n)=>tp(e,2,16,n),stringify:e=>np(e,16,`0x`)},sp=class e extends yf{constructor(t){super(t),this.tag=e.tag}add(e){let t;t=ed(e)?e:e&&typeof e==`object`&&`key`in e&&`value`in e&&e.value===null?new pf(e.key,null):new pf(e,null),vf(this.items,t.key)||this.items.push(t)}get(e,t){let n=vf(this.items,e);return!t&&ed(n)?td(n.key)?n.key.value:n.key:n}set(e,t){if(typeof t!=`boolean`)throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);let n=vf(this.items,e);n&&!t?this.items.splice(this.items.indexOf(n),1):!n&&t&&this.items.push(new pf(e))}toJSON(e,t){return super.toJSON(e,t,Set)}toString(e,t,n){if(!e)return JSON.stringify(this);if(this.hasAllNullValues(!0))return super.toString(Object.assign({},e,{allNullValues:!0}),t,n);throw Error(`Set items must all have null values`)}static from(e,t,n){let{replacer:r}=n,i=new this(e);if(t&&Symbol.iterator in Object(t))for(let e of t)typeof r==`function`&&(e=r.call(t,e,e)),i.items.push(ff(e,null,n));return i}};sp.tag=`tag:yaml.org,2002:set`;var cp={collection:`map`,identify:e=>e instanceof Set,nodeClass:sp,default:!1,tag:`tag:yaml.org,2002:set`,createNode:(e,t,n)=>sp.from(e,t,n),resolve(e,t){if($u(e)){if(e.hasAllNullValues(!0))return Object.assign(new sp,e);t(`Set items must all have null values`)}else t(`Expected a mapping for this tag`);return e}};function lp(e,t){let n=e[0],r=n===`-`||n===`+`?e.substring(1):e,i=e=>t?BigInt(e):Number(e),a=r.replace(/_/g,``).split(`:`).reduce((e,t)=>e*i(60)+i(t),i(0));return n===`-`?i(-1)*a:a}function up(e){let{value:t}=e,n=e=>e;if(typeof t==`bigint`)n=e=>BigInt(e);else if(isNaN(t)||!isFinite(t))return Df(e);let r=``;t<0&&(r=`-`,t*=n(-1));let i=n(60),a=[t%i];return t<60?a.unshift(0):(t=(t-a[0])/i,a.unshift(t%i),t>=60&&(t=(t-a[0])/i,a.unshift(t))),r+a.map(e=>String(e).padStart(2,`0`)).join(`:`).replace(/000000\d*$/,``)}var dp={identify:e=>typeof e==`bigint`||Number.isInteger(e),default:!0,tag:`tag:yaml.org,2002:int`,format:`TIME`,test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,resolve:(e,t,{intAsBigInt:n})=>lp(e,n),stringify:up},fp={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,format:`TIME`,test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,resolve:e=>lp(e,!1),stringify:up},pp={identify:e=>e instanceof Date,default:!0,tag:`tag:yaml.org,2002:timestamp`,test:RegExp(`^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$`),resolve(e){let t=e.match(pp.test);if(!t)throw Error(`!!timestamp expects a date, starting with yyyy-mm-dd`);let[,n,r,i,a,o,s]=t.map(Number),c=t[7]?Number((t[7]+`00`).substr(1,3)):0,l=Date.UTC(n,r-1,i,a||0,o||0,s||0,c),u=t[8];if(u&&u!==`Z`){let e=lp(u,!1);Math.abs(e)<30&&(e*=60),l-=6e4*e}return new Date(l)},stringify:({value:e})=>e?.toISOString().replace(/(T00:00:00)?\.000Z$/,``)??``},mp=[bf,Cf,wf,Tf,Yf,Xf,rp,ip,ap,op,Zf,Qf,$f,Hf,af,qf,Gf,cp,dp,fp,pp],hp=new Map([[`core`,Lf],[`failsafe`,[bf,Cf,wf]],[`json`,Vf],[`yaml11`,mp],[`yaml-1.1`,mp]]),gp={binary:Hf,bool:Ef,float:Af,floatExp:kf,floatNaN:Of,floatTime:fp,int:Ff,intHex:If,intOct:Pf,intTime:dp,map:bf,merge:af,null:Tf,omap:qf,pairs:Gf,seq:Cf,set:cp,timestamp:pp},_p={"tag:yaml.org,2002:binary":Hf,"tag:yaml.org,2002:merge":af,"tag:yaml.org,2002:omap":qf,"tag:yaml.org,2002:pairs":Gf,"tag:yaml.org,2002:set":cp,"tag:yaml.org,2002:timestamp":pp};function vp(e,t,n){let r=hp.get(t);if(r&&!e)return n&&!r.includes(af)?r.concat(af):r.slice();let i=r;if(!i){if(Array.isArray(e))i=[];else{let e=Array.from(hp.keys()).filter(e=>e!==`yaml11`).map(e=>JSON.stringify(e)).join(`, `);throw Error(`Unknown schema "${t}"; use one of ${e} or define customTags array`)}}if(Array.isArray(e))for(let t of e)i=i.concat(t);else typeof e==`function`&&(i=e(i.slice()));return n&&(i=i.concat(af)),i.reduce((e,t)=>{let n=typeof t==`string`?gp[t]:t;if(!n){let e=JSON.stringify(t),n=Object.keys(gp).map(e=>JSON.stringify(e)).join(`, `);throw Error(`Unknown custom tag ${e}; use one of ${n}`)}return e.includes(n)||e.push(n),e},[])}var yp=(e,t)=>e.key<t.key?-1:+(e.key>t.key),bp=class e{constructor({compat:e,customTags:t,merge:n,resolveKnownTags:r,schema:i,sortMapEntries:a,toStringDefaults:o}){this.compat=Array.isArray(e)?vp(e,`compat`):e?vp(null,e):null,this.name=typeof i==`string`&&i||`core`,this.knownTags=r?_p:{},this.tags=vp(t,this.name,n),this.toStringOptions=o??null,Object.defineProperty(this,Ku,{value:bf}),Object.defineProperty(this,Ju,{value:wf}),Object.defineProperty(this,Yu,{value:Cf}),this.sortMapEntries=typeof a==`function`?a:a===!0?yp:null}clone(){let t=Object.create(e.prototype,Object.getOwnPropertyDescriptors(this));return t.tags=this.tags.slice(),t}};function xp(e,t){let n=[],r=t.directives===!0;if(t.directives!==!1&&e.directives){let t=e.directives.toString(e);t?(n.push(t),r=!0):e.directives.docStart&&(r=!0)}r&&n.push(`---`);let i=Zd(e,t),{commentString:a}=i.options;if(e.commentBefore){n.length!==1&&n.unshift(``);let t=a(e.commentBefore);n.unshift(Pd(t,``))}let o=!1,s=null;if(e.contents){if(id(e.contents)){if(e.contents.spaceBefore&&r&&n.push(``),e.contents.commentBefore){let t=a(e.contents.commentBefore);n.push(Pd(t,``))}i.forceBlockIndent=!!e.comment,s=e.contents.comment}let t=s?void 0:()=>o=!0,c=ef(e.contents,i,()=>s=null,t);s&&(c+=Fd(c,``,a(s))),(c[0]===`|`||c[0]===`>`)&&n[n.length-1]===`---`?n[n.length-1]=`--- ${c}`:n.push(c)}else n.push(ef(e.contents,i));if(e.directives?.docEnd){if(e.comment){let t=a(e.comment);t.includes(`
`)?(n.push(`...`),n.push(Pd(t,``))):n.push(`... ${t}`)}else n.push(`...`)}else{let t=e.comment;t&&o&&(t=t.replace(/^\n+/,``)),t&&((!o||s)&&n[n.length-1]!==``&&n.push(``),n.push(Pd(a(t),``)))}return n.join(`
`)+`
`}var Sp=class e{constructor(e,t,n){this.commentBefore=null,this.comment=null,this.errors=[],this.warnings=[],Object.defineProperty(this,Xu,{value:Gu});let r=null;typeof t==`function`||Array.isArray(t)?r=t:n===void 0&&t&&(n=t,t=void 0);let i=Object.assign({intAsBigInt:!1,keepSourceTokens:!1,logLevel:`warn`,prettyErrors:!0,strict:!0,stringKeys:!1,uniqueKeys:!0,version:`1.2`},n);this.options=i;let{version:a}=i;n?._directives?(this.directives=n._directives.atDocument(),this.directives.yaml.explicit&&(a=this.directives.yaml.version)):this.directives=new gd({version:a}),this.setSchema(a,n),this.contents=e===void 0?null:this.createNode(e,r,n)}clone(){let t=Object.create(e.prototype,{[Xu]:{value:Gu}});return t.commentBefore=this.commentBefore,t.comment=this.comment,t.errors=this.errors.slice(),t.warnings=this.warnings.slice(),t.options=Object.assign({},this.options),this.directives&&(t.directives=this.directives.clone()),t.schema=this.schema.clone(),t.contents=id(this.contents)?this.contents.clone(t.schema):this.contents,this.range&&(t.range=this.range.slice()),t}add(e){Cp(this.contents)&&this.contents.add(e)}addIn(e,t){Cp(this.contents)&&this.contents.addIn(e,t)}createAlias(e,t){if(!e.anchor){let n=vd(this);e.anchor=!t||n.has(t)?yd(t||`a`,n):t}return new wd(e.anchor)}createNode(e,t,n){let r;if(typeof t==`function`)e=t.call({"":e},``,e),r=t;else if(Array.isArray(t)){let e=t.filter(e=>typeof e==`number`||e instanceof String||e instanceof Number).map(String);e.length>0&&(t=t.concat(e)),r=t}else n===void 0&&t&&(n=t,t=void 0);let{aliasDuplicateObjects:i,anchorPrefix:a,flow:o,keepUndefined:s,onTagObj:c,tag:l}=n??{},{onAnchor:u,setAnchors:d,sourceObjects:f}=bd(this,a||`a`),p={aliasDuplicateObjects:i??!0,keepUndefined:s??!1,onAnchor:u,onTagObj:c,replacer:r,schema:this.schema,sourceObjects:f},m=kd(e,l,p);return o&&rd(m)&&(m.flow=!0),d(),m}createPair(e,t,n={}){return new pf(this.createNode(e,null,n),this.createNode(t,null,n))}delete(e){return Cp(this.contents)?this.contents.delete(e):!1}deleteIn(e){return jd(e)?this.contents!=null&&(this.contents=null,!0):Cp(this.contents)?this.contents.deleteIn(e):!1}get(e,t){return rd(this.contents)?this.contents.get(e,t):void 0}getIn(e,t){return jd(e)?!t&&td(this.contents)?this.contents.value:this.contents:rd(this.contents)?this.contents.getIn(e,t):void 0}has(e){return rd(this.contents)?this.contents.has(e):!1}hasIn(e){return jd(e)?this.contents!==void 0:rd(this.contents)?this.contents.hasIn(e):!1}set(e,t){this.contents==null?this.contents=Ad(this.schema,[e],t):Cp(this.contents)&&this.contents.set(e,t)}setIn(e,t){jd(e)?this.contents=t:this.contents==null?this.contents=Ad(this.schema,Array.from(e),t):Cp(this.contents)&&this.contents.setIn(e,t)}setSchema(e,t={}){typeof e==`number`&&(e=String(e));let n;switch(e){case`1.1`:this.directives?this.directives.yaml.version=`1.1`:this.directives=new gd({version:`1.1`}),n={resolveKnownTags:!1,schema:`yaml-1.1`};break;case`1.2`:case`next`:this.directives?this.directives.yaml.version=e:this.directives=new gd({version:e}),n={resolveKnownTags:!0,schema:`core`};break;case null:this.directives&&delete this.directives,n=null;break;default:{let t=JSON.stringify(e);throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${t}`)}}if(t.schema instanceof Object)this.schema=t.schema;else if(n)this.schema=new bp(Object.assign(n,t));else throw Error(`With a null YAML version, the { schema: Schema } option is required`)}toJS({json:e,jsonArg:t,mapAsMap:n,maxAliasCount:r,onAnchor:i,reviver:a}={}){let o={anchors:new Map,doc:this,keep:!e,mapAsMap:n===!0,mapKeyWarned:!1,maxAliasCount:typeof r==`number`?r:100},s=Sd(this.contents,t??``,o);if(typeof i==`function`)for(let{count:e,res:t}of o.anchors.values())i(t,e);return typeof a==`function`?xd(a,{"":s},``,s):s}toJSON(e,t){return this.toJS({json:!0,jsonArg:e,mapAsMap:!1,onAnchor:t})}toString(e={}){if(this.errors.length>0)throw Error(`Document with errors cannot be stringified`);if(`indent`in e&&(!Number.isInteger(e.indent)||Number(e.indent)<=0)){let t=JSON.stringify(e.indent);throw Error(`"indent" option must be a positive integer, not ${t}`)}return xp(this,e)}};function Cp(e){if(rd(e))return!0;throw Error(`Expected a YAML collection as document contents`)}var wp=class extends Error{constructor(e,t,n,r){super(),this.name=e,this.code=n,this.message=r,this.pos=t}},Tp=class extends wp{constructor(e,t,n){super(`YAMLParseError`,e,t,n)}},Ep=class extends wp{constructor(e,t,n){super(`YAMLWarning`,e,t,n)}},Dp=(e,t)=>n=>{if(n.pos[0]===-1)return;n.linePos=n.pos.map(e=>t.linePos(e));let{line:r,col:i}=n.linePos[0];n.message+=` at line ${r}, column ${i}`;let a=i-1,o=e.substring(t.lineStarts[r-1],t.lineStarts[r]).replace(/[\n\r]+$/,``);if(a>=60&&o.length>80){let e=Math.min(a-39,o.length-79);o=`…`+o.substring(e),a-=e-1}if(o.length>80&&(o=o.substring(0,79)+`…`),r>1&&/^ *$/.test(o.substring(0,a))){let n=e.substring(t.lineStarts[r-2],t.lineStarts[r-1]);n.length>80&&(n=n.substring(0,79)+`…
`),o=n+o}if(/[^ ]/.test(o)){let e=1,t=n.linePos[1];t?.line===r&&t.col>i&&(e=Math.max(1,Math.min(t.col-i,80-a)));let s=` `.repeat(a)+`^`.repeat(e);n.message+=`:\n\n${o}\n${s}\n`}};function Op(e,{flow:t,indicator:n,next:r,offset:i,onError:a,parentIndent:o,startOnNewline:s}){let c=!1,l=s,u=s,d=``,f=``,p=!1,m=!1,h=null,g=null,_=null,v=null,y=null,b=null,x=null;for(let i of e)switch(m&&=(i.type!==`space`&&i.type!==`newline`&&i.type!==`comma`&&a(i.offset,`MISSING_CHAR`,`Tags and anchors must be separated from the next token by white space`),!1),h&&=(l&&i.type!==`comment`&&i.type!==`newline`&&a(h,`TAB_AS_INDENT`,`Tabs are not allowed as indentation`),null),i.type){case`space`:!t&&(n!==`doc-start`||r?.type!==`flow-collection`)&&i.source.includes(`	`)&&(h=i),u=!0;break;case`comment`:{u||a(i,`MISSING_CHAR`,`Comments must be separated from other tokens by white space characters`);let e=i.source.substring(1)||` `;d?d+=f+e:d=e,f=``,l=!1;break}case`newline`:l?d?d+=i.source:b&&n===`seq-item-ind`||(c=!0):f+=i.source,l=!0,p=!0,(g||_)&&(v=i),u=!0;break;case`anchor`:g&&a(i,`MULTIPLE_ANCHORS`,`A node can have at most one anchor`),i.source.endsWith(`:`)&&a(i.offset+i.source.length-1,`BAD_ALIAS`,`Anchor ending in : is ambiguous`,!0),g=i,x??=i.offset,l=!1,u=!1,m=!0;break;case`tag`:_&&a(i,`MULTIPLE_TAGS`,`A node can have at most one tag`),_=i,x??=i.offset,l=!1,u=!1,m=!0;break;case n:(g||_)&&a(i,`BAD_PROP_ORDER`,`Anchors and tags must be after the ${i.source} indicator`),b&&a(i,`UNEXPECTED_TOKEN`,`Unexpected ${i.source} in ${t??`collection`}`),b=i,l=n===`seq-item-ind`||n===`explicit-key-ind`,u=!1;break;case`comma`:if(t){y&&a(i,`UNEXPECTED_TOKEN`,`Unexpected , in ${t}`),y=i,l=!1,u=!1;break}default:a(i,`UNEXPECTED_TOKEN`,`Unexpected ${i.type} token`),l=!1,u=!1}let S=e[e.length-1],C=S?S.offset+S.source.length:i;return m&&r&&r.type!==`space`&&r.type!==`newline`&&r.type!==`comma`&&(r.type!==`scalar`||r.source!==``)&&a(r.offset,`MISSING_CHAR`,`Tags and anchors must be separated from the next token by white space`),h&&(l&&h.indent<=o||r?.type===`block-map`||r?.type===`block-seq`)&&a(h,`TAB_AS_INDENT`,`Tabs are not allowed as indentation`),{comma:y,found:b,spaceBefore:c,comment:d,hasNewline:p,anchor:g,tag:_,newlineAfterProp:v,end:C,start:x??C}}function kp(e){if(!e)return null;switch(e.type){case`alias`:case`scalar`:case`double-quoted-scalar`:case`single-quoted-scalar`:if(e.source.includes(`
`))return!0;if(e.end){for(let t of e.end)if(t.type===`newline`)return!0}return!1;case`flow-collection`:for(let t of e.items){for(let e of t.start)if(e.type===`newline`)return!0;if(t.sep){for(let e of t.sep)if(e.type===`newline`)return!0}if(kp(t.key)||kp(t.value))return!0}return!1;default:return!0}}function Ap(e,t,n){if(t?.type===`flow-collection`){let r=t.end[0];r.indent===e&&(r.source===`]`||r.source===`}`)&&kp(t)&&n(r,`BAD_INDENT`,`Flow end indicator should be more indented than parent`,!0)}}function jp(e,t,n){let{uniqueKeys:r}=e.options;if(r===!1)return!1;let i=typeof r==`function`?r:(e,t)=>e===t||td(e)&&td(t)&&e.value===t.value;return t.some(e=>i(e.key,n))}var Mp=`All mapping items must start at the same column`;function Np({composeNode:e,composeEmptyNode:t},n,r,i,a){let o=new((a?.nodeClass)??yf)(n.schema);n.atRoot&&=!1;let s=r.offset,c=null;for(let a of r.items){let{start:l,key:u,sep:d,value:f}=a,p=Op(l,{indicator:`explicit-key-ind`,next:u??d?.[0],offset:s,onError:i,parentIndent:r.indent,startOnNewline:!0}),m=!p.found;if(m){if(u&&(u.type===`block-seq`?i(s,`BLOCK_AS_IMPLICIT_KEY`,`A block sequence may not be used as an implicit map key`):`indent`in u&&u.indent!==r.indent&&i(s,`BAD_INDENT`,Mp)),!p.anchor&&!p.tag&&!d){c=p.end,p.comment&&(o.comment?o.comment+=`
`+p.comment:o.comment=p.comment);continue}(p.newlineAfterProp||kp(u))&&i(u??l[l.length-1],`MULTILINE_IMPLICIT_KEY`,`Implicit keys need to be on a single line`)}else p.found?.indent!==r.indent&&i(s,`BAD_INDENT`,Mp);n.atKey=!0;let h=p.end,g=u?e(n,u,p,i):t(n,h,l,null,p,i);n.schema.compat&&Ap(r.indent,u,i),n.atKey=!1,jp(n,o.items,g)&&i(h,`DUPLICATE_KEY`,`Map keys must be unique`);let _=Op(d??[],{indicator:`map-value-ind`,next:f,offset:g.range[2],onError:i,parentIndent:r.indent,startOnNewline:!u||u.type===`block-scalar`});if(s=_.end,_.found){m&&(f?.type===`block-map`&&!_.hasNewline&&i(s,`BLOCK_AS_IMPLICIT_KEY`,`Nested mappings are not allowed in compact mappings`),n.options.strict&&p.start<_.found.offset-1024&&i(g.range,`KEY_OVER_1024_CHARS`,`The : indicator must be at most 1024 chars after the start of an implicit block mapping key`));let c=f?e(n,f,_,i):t(n,s,d,null,_,i);n.schema.compat&&Ap(r.indent,f,i),s=c.range[2];let l=new pf(g,c);n.options.keepSourceTokens&&(l.srcToken=a),o.items.push(l)}else{m&&i(g.range,`MISSING_CHAR`,`Implicit map keys need to be followed by map values`),_.comment&&(g.comment?g.comment+=`
`+_.comment:g.comment=_.comment);let e=new pf(g);n.options.keepSourceTokens&&(e.srcToken=a),o.items.push(e)}}return c&&c<s&&i(c,`IMPOSSIBLE`,`Map comment with trailing content`),o.range=[r.offset,s,c??s],o}function Pp({composeNode:e,composeEmptyNode:t},n,r,i,a){let o=new((a?.nodeClass)??xf)(n.schema);n.atRoot&&=!1,n.atKey&&=!1;let s=r.offset,c=null;for(let{start:a,value:l}of r.items){let u=Op(a,{indicator:`seq-item-ind`,next:l,offset:s,onError:i,parentIndent:r.indent,startOnNewline:!0});if(!u.found){if(u.anchor||u.tag||l)l?.type===`block-seq`?i(u.end,`BAD_INDENT`,`All sequence items must start at the same column`):i(s,`MISSING_CHAR`,`Sequence item without - indicator`);else{c=u.end,u.comment&&(o.comment=u.comment);continue}}let d=l?e(n,l,u,i):t(n,u.end,a,null,u,i);n.schema.compat&&Ap(r.indent,l,i),s=d.range[2],o.items.push(d)}return o.range=[r.offset,s,c??s],o}function Fp(e,t,n,r){let i=``;if(e){let a=!1,o=``;for(let s of e){let{source:e,type:c}=s;switch(c){case`space`:a=!0;break;case`comment`:{n&&!a&&r(s,`MISSING_CHAR`,`Comments must be separated from other tokens by white space characters`);let t=e.substring(1)||` `;i?i+=o+t:i=t,o=``;break}case`newline`:i&&(o+=e),a=!0;break;default:r(s,`UNEXPECTED_TOKEN`,`Unexpected ${c} at node end`)}t+=e.length}}return{comment:i,offset:t}}var Ip=`Block collections are not allowed within flow collections`,Lp=e=>e&&(e.type===`block-map`||e.type===`block-seq`);function Rp({composeNode:e,composeEmptyNode:t},n,r,i,a){let o=r.start.source===`{`,s=o?`flow map`:`flow sequence`,c=new((a?.nodeClass)??(o?yf:xf))(n.schema);c.flow=!0;let l=n.atRoot;l&&(n.atRoot=!1),n.atKey&&=!1;let u=r.offset+r.start.source.length;for(let a=0;a<r.items.length;++a){let l=r.items[a],{start:d,key:f,sep:p,value:m}=l,h=Op(d,{flow:s,indicator:`explicit-key-ind`,next:f??p?.[0],offset:u,onError:i,parentIndent:r.indent,startOnNewline:!1});if(!h.found){if(!h.anchor&&!h.tag&&!p&&!m){a===0&&h.comma?i(h.comma,`UNEXPECTED_TOKEN`,`Unexpected , in ${s}`):a<r.items.length-1&&i(h.start,`UNEXPECTED_TOKEN`,`Unexpected empty item in ${s}`),h.comment&&(c.comment?c.comment+=`
`+h.comment:c.comment=h.comment),u=h.end;continue}!o&&n.options.strict&&kp(f)&&i(f,`MULTILINE_IMPLICIT_KEY`,`Implicit keys of flow sequence pairs need to be on a single line`)}if(a===0)h.comma&&i(h.comma,`UNEXPECTED_TOKEN`,`Unexpected , in ${s}`);else if(h.comma||i(h.start,`MISSING_CHAR`,`Missing , between ${s} items`),h.comment){let e=``;loop:for(let t of d)switch(t.type){case`comma`:case`space`:break;case`comment`:e=t.source.substring(1);break loop;default:break loop}if(e){let t=c.items[c.items.length-1];ed(t)&&(t=t.value??t.key),t.comment?t.comment+=`
`+e:t.comment=e,h.comment=h.comment.substring(e.length+1)}}if(!o&&!p&&!h.found){let r=m?e(n,m,h,i):t(n,h.end,p,null,h,i);c.items.push(r),u=r.range[2],Lp(m)&&i(r.range,`BLOCK_IN_FLOW`,Ip)}else{n.atKey=!0;let a=h.end,g=f?e(n,f,h,i):t(n,a,d,null,h,i);Lp(f)&&i(g.range,`BLOCK_IN_FLOW`,Ip),n.atKey=!1;let _=Op(p??[],{flow:s,indicator:`map-value-ind`,next:m,offset:g.range[2],onError:i,parentIndent:r.indent,startOnNewline:!1});if(_.found){if(!o&&!h.found&&n.options.strict){if(p)for(let e of p){if(e===_.found)break;if(e.type===`newline`){i(e,`MULTILINE_IMPLICIT_KEY`,`Implicit keys of flow sequence pairs need to be on a single line`);break}}h.start<_.found.offset-1024&&i(_.found,`KEY_OVER_1024_CHARS`,`The : indicator must be at most 1024 chars after the start of an implicit flow sequence key`)}}else m&&(`source`in m&&m.source?.[0]===`:`?i(m,`MISSING_CHAR`,`Missing space after : in ${s}`):i(_.start,`MISSING_CHAR`,`Missing , or : between ${s} items`));let v=m?e(n,m,_,i):_.found?t(n,_.end,p,null,_,i):null;v?Lp(m)&&i(v.range,`BLOCK_IN_FLOW`,Ip):_.comment&&(g.comment?g.comment+=`
`+_.comment:g.comment=_.comment);let y=new pf(g,v);if(n.options.keepSourceTokens&&(y.srcToken=l),o){let e=c;jp(n,e.items,g)&&i(a,`DUPLICATE_KEY`,`Map keys must be unique`),e.items.push(y)}else{let e=new yf(n.schema);e.flow=!0,e.items.push(y);let t=(v??g).range;e.range=[g.range[0],t[1],t[2]],c.items.push(e)}u=v?v.range[2]:_.end}}let d=o?`}`:`]`,[f,...p]=r.end,m=u;if(f?.source===d)m=f.offset+f.source.length;else{let e=s[0].toUpperCase()+s.substring(1),t=l?`${e} must end with a ${d}`:`${e} in block collection must be sufficiently indented and end with a ${d}`;i(u,l?`MISSING_CHAR`:`BAD_INDENT`,t),f&&f.source.length!==1&&p.unshift(f)}if(p.length>0){let e=Fp(p,m,n.options.strict,i);e.comment&&(c.comment?c.comment+=`
`+e.comment:c.comment=e.comment),c.range=[r.offset,m,e.offset]}else c.range=[r.offset,m,m];return c}function zp(e,t,n,r,i,a){let o=n.type===`block-map`?Np(e,t,n,r,a):n.type===`block-seq`?Pp(e,t,n,r,a):Rp(e,t,n,r,a),s=o.constructor;return i===`!`||i===s.tagName?(o.tag=s.tagName,o):(i&&(o.tag=i),o)}function Bp(e,t,n,r,i){let a=r.tag,o=a?t.directives.tagName(a.source,e=>i(a,`TAG_RESOLVE_FAILED`,e)):null;if(n.type===`block-seq`){let{anchor:e,newlineAfterProp:t}=r,n=e&&a?e.offset>a.offset?e:a:e??a;n&&(!t||t.offset<n.offset)&&i(n,`MISSING_CHAR`,`Missing newline after block sequence props`)}let s=n.type===`block-map`?`map`:n.type===`block-seq`?`seq`:n.start.source===`{`?`map`:`seq`;if(!a||!o||o===`!`||o===yf.tagName&&s===`map`||o===xf.tagName&&s===`seq`)return zp(e,t,n,i,o);let c=t.schema.tags.find(e=>e.tag===o&&e.collection===s);if(!c){let r=t.schema.knownTags[o];if(r?.collection===s)t.schema.tags.push(Object.assign({},r,{default:!1})),c=r;else return r?i(a,`BAD_COLLECTION_TYPE`,`${r.tag} used for ${s} collection, but expects ${r.collection??`scalar`}`,!0):i(a,`TAG_RESOLVE_FAILED`,`Unresolved tag: ${o}`,!0),zp(e,t,n,i,o)}let l=zp(e,t,n,i,o,c),u=c.resolve?.(l,e=>i(a,`TAG_RESOLVE_FAILED`,e),t.options)??l,d=id(u)?u:new Q(u);return d.range=l.range,d.tag=o,c?.format&&(d.format=c.format),d}function Vp(e,t,n){let r=t.offset,i=Hp(t,e.options.strict,n);if(!i)return{value:``,type:null,comment:``,range:[r,r,r]};let a=i.mode===`>`?Q.BLOCK_FOLDED:Q.BLOCK_LITERAL,o=t.source?Up(t.source):[],s=o.length;for(let e=o.length-1;e>=0;--e){let t=o[e][1];if(t===``||t===`\r`)s=e;else break}if(s===0){let e=i.chomp===`+`&&o.length>0?`
`.repeat(Math.max(1,o.length-1)):``,n=r+i.length;return t.source&&(n+=t.source.length),{value:e,type:a,comment:i.comment,range:[r,n,n]}}let c=t.indent+i.indent,l=t.offset+i.length,u=0;for(let t=0;t<s;++t){let[r,a]=o[t];if(a===``||a===`\r`)i.indent===0&&r.length>c&&(c=r.length);else{r.length<c&&n(l+r.length,`MISSING_CHAR`,`Block scalars with more-indented leading empty lines must use an explicit indentation indicator`),i.indent===0&&(c=r.length),u=t,c===0&&!e.atRoot&&n(l,`BAD_INDENT`,`Block scalar values in collections must be indented`);break}l+=r.length+a.length+1}for(let e=o.length-1;e>=s;--e)o[e][0].length>c&&(s=e+1);let d=``,f=``,p=!1;for(let e=0;e<u;++e)d+=o[e][0].slice(c)+`
`;for(let e=u;e<s;++e){let[t,r]=o[e];l+=t.length+r.length+1;let s=r[r.length-1]===`\r`;if(s&&(r=r.slice(0,-1)),r&&t.length<c){let e=`Block scalar lines must not be less indented than their ${i.indent?`explicit indentation indicator`:`first line`}`;n(l-r.length-(s?2:1),`BAD_INDENT`,e),t=``}a===Q.BLOCK_LITERAL?(d+=f+t.slice(c)+r,f=`
`):t.length>c||r[0]===`	`?(f===` `?f=`
`:!p&&f===`
`&&(f=`

`),d+=f+t.slice(c)+r,f=`
`,p=!0):r===``?f===`
`?d+=`
`:f=`
`:(d+=f+r,f=` `,p=!1)}switch(i.chomp){case`-`:break;case`+`:for(let e=s;e<o.length;++e)d+=`
`+o[e][0].slice(c);d[d.length-1]!==`
`&&(d+=`
`);break;default:d+=`
`}let m=r+i.length+t.source.length;return{value:d,type:a,comment:i.comment,range:[r,m,m]}}function Hp({offset:e,props:t},n,r){if(t[0].type!==`block-scalar-header`)return r(t[0],`IMPOSSIBLE`,`Block scalar header not found`),null;let{source:i}=t[0],a=i[0],o=0,s=``,c=-1;for(let t=1;t<i.length;++t){let n=i[t];if(!s&&(n===`-`||n===`+`))s=n;else{let r=Number(n);!o&&r?o=r:c===-1&&(c=e+t)}}c!==-1&&r(c,`UNEXPECTED_TOKEN`,`Block scalar header includes extra characters: ${i}`);let l=!1,u=``,d=i.length;for(let e=1;e<t.length;++e){let i=t[e];switch(i.type){case`space`:l=!0;case`newline`:d+=i.source.length;break;case`comment`:n&&!l&&r(i,`MISSING_CHAR`,`Comments must be separated from other tokens by white space characters`),d+=i.source.length,u=i.source.substring(1);break;case`error`:r(i,`UNEXPECTED_TOKEN`,i.message),d+=i.source.length;break;default:{r(i,`UNEXPECTED_TOKEN`,`Unexpected token in block scalar header: ${i.type}`);let e=i.source;e&&typeof e==`string`&&(d+=e.length)}}}return{mode:a,indent:o,chomp:s,comment:u,length:d}}function Up(e){let t=e.split(/\n( *)/),n=t[0],r=n.match(/^( *)/),i=[r?.[1]?[r[1],n.slice(r[1].length)]:[``,n]];for(let e=1;e<t.length;e+=2)i.push([t[e],t[e+1]]);return i}function Wp(e,t,n){let{offset:r,type:i,source:a,end:o}=e,s,c,l=(e,t,i)=>n(r+e,t,i);switch(i){case`scalar`:s=Q.PLAIN,c=Gp(a,l);break;case`single-quoted-scalar`:s=Q.QUOTE_SINGLE,c=Kp(a,l);break;case`double-quoted-scalar`:s=Q.QUOTE_DOUBLE,c=Jp(a,l);break;default:return n(e,`UNEXPECTED_TOKEN`,`Expected a flow scalar value, but found: ${i}`),{value:``,type:null,comment:``,range:[r,r+a.length,r+a.length]}}let u=r+a.length,d=Fp(o,u,t,n);return{value:c,type:s,comment:d.comment,range:[r,u,d.offset]}}function Gp(e,t){let n=``;switch(e[0]){case`	`:n=`a tab character`;break;case`,`:n=`flow indicator character ,`;break;case`%`:n=`directive indicator character %`;break;case`|`:case`>`:n=`block scalar indicator ${e[0]}`;break;case`@`:case"`":n=`reserved character ${e[0]}`}return n&&t(0,`BAD_SCALAR_START`,`Plain value cannot start with ${n}`),qp(e)}function Kp(e,t){return(e[e.length-1]!==`'`||e.length===1)&&t(e.length,`MISSING_CHAR`,`Missing closing 'quote`),qp(e.slice(1,-1)).replace(/''/g,`'`)}function qp(e){let t=/(.*?)\r?\n/sy,n=t.exec(e);if(!n)return e;let r,i;try{r=RegExp(`(?<![ 	])[ 	]+$`),i=RegExp(`^[ 	]+|(?<![ 	])[ 	]+$`,`g`)}catch{r=/[ \t]+$/,i=/^[ \t]+|[ \t]+$/g}let a=n[1].replace(r,``),o=` `,s=t.lastIndex;for(;n=t.exec(e);){let e=n[1].replace(i,``);e===``?o===`
`?a+=o:o=`
`:(a+=o+e,o=` `),s=t.lastIndex}let c=/[ \t]*(.*)/sy;return c.lastIndex=s,n=c.exec(e),a+o+(n?.[1]??``)}function Jp(e,t){let n=``;for(let r=1;r<e.length-1;++r){let i=e[r];if(i!==`\r`||e[r+1]!==`
`){if(i===`
`){let{fold:t,offset:i}=Yp(e,r);n+=t,r=i}else if(i===`\\`){let i=e[++r],a=Xp[i];if(a)n+=a;else if(i===`
`)for(i=e[r+1];i===` `||i===`	`;)i=e[++r+1];else if(i===`\r`&&e[r+1]===`
`)for(i=e[++r+1];i===` `||i===`	`;)i=e[++r+1];else if(i===`x`||i===`u`||i===`U`){let a=i===`x`?2:i===`u`?4:8;n+=Zp(e,r+1,a,t),r+=a}else{let i=e.substr(r-1,2);t(r-1,`BAD_DQ_ESCAPE`,`Invalid escape sequence ${i}`),n+=i}}else if(i===` `||i===`	`){let t=r,a=e[r+1];for(;a===` `||a===`	`;)a=e[++r+1];a!==`
`&&(a!==`\r`||e[r+2]!==`
`)&&(n+=r>t?e.slice(t,r+1):i)}else n+=i}}return(e[e.length-1]!==`"`||e.length===1)&&t(e.length,`MISSING_CHAR`,`Missing closing "quote`),n}function Yp(e,t){let n=``,r=e[t+1];for(;(r===` `||r===`	`||r===`
`||r===`\r`)&&(r!==`\r`||e[t+2]===`
`);)r===`
`&&(n+=`
`),t+=1,r=e[t+1];return n||=` `,{fold:n,offset:t}}var Xp={0:`\0`,a:`\x07`,b:`\b`,e:`\x1B`,f:`\f`,n:`
`,r:`\r`,t:`	`,v:`\v`,N:``,_:`\xA0`,L:`\u2028`,P:`\u2029`," ":` `,'"':`"`,"/":`/`,"\\":`\\`,"	":`	`};function Zp(e,t,n,r){let i=e.substr(t,n),a=i.length===n&&/^[0-9a-fA-F]+$/.test(i)?parseInt(i,16):NaN;try{return String.fromCodePoint(a)}catch{let i=e.substr(t-2,n+2);return r(t-2,`BAD_DQ_ESCAPE`,`Invalid escape sequence ${i}`),i}}function Qp(e,t,n,r){let{value:i,type:a,comment:o,range:s}=t.type===`block-scalar`?Vp(e,t,r):Wp(t,e.options.strict,r),c=n?e.directives.tagName(n.source,e=>r(n,`TAG_RESOLVE_FAILED`,e)):null,l;l=e.options.stringKeys&&e.atKey?e.schema[Ju]:c?$p(e.schema,i,c,n,r):t.type===`scalar`?em(e,i,t,r):e.schema[Ju];let u;try{let a=l.resolve(i,e=>r(n??t,`TAG_RESOLVE_FAILED`,e),e.options);u=td(a)?a:new Q(a)}catch(e){let a=e instanceof Error?e.message:String(e);r(n??t,`TAG_RESOLVE_FAILED`,a),u=new Q(i)}return u.range=s,u.source=i,a&&(u.type=a),c&&(u.tag=c),l.format&&(u.format=l.format),o&&(u.comment=o),u}function $p(e,t,n,r,i){if(n===`!`)return e[Ju];let a=[];for(let t of e.tags)if(!t.collection&&t.tag===n){if(t.default&&t.test)a.push(t);else return t}for(let e of a)if(e.test?.test(t))return e;let o=e.knownTags[n];return o&&!o.collection?(e.tags.push(Object.assign({},o,{default:!1,test:void 0})),o):(i(r,`TAG_RESOLVE_FAILED`,`Unresolved tag: ${n}`,n!==`tag:yaml.org,2002:str`),e[Ju])}function em({atKey:e,directives:t,schema:n},r,i,a){let o=n.tags.find(t=>(t.default===!0||e&&t.default===`key`)&&t.test?.test(r))||n[Ju];if(n.compat){let e=n.compat.find(e=>e.default&&e.test?.test(r))??n[Ju];o.tag!==e.tag&&a(i,`TAG_RESOLVE_FAILED`,`Value may be parsed as either ${t.tagString(o.tag)} or ${t.tagString(e.tag)}`,!0)}return o}function tm(e,t,n){if(t){n??=t.length;for(let r=n-1;r>=0;--r){let n=t[r];switch(n.type){case`space`:case`comment`:case`newline`:e-=n.source.length;continue}for(n=t[++r];n?.type===`space`;)e+=n.source.length,n=t[++r];break}}return e}var nm={composeNode:rm,composeEmptyNode:im};function rm(e,t,n,r){let i=e.atKey,{spaceBefore:a,comment:o,anchor:s,tag:c}=n,l,u=!0;switch(t.type){case`alias`:l=am(e,t,r),(s||c)&&r(t,`ALIAS_PROPS`,`An alias node must not specify any properties`);break;case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:case`block-scalar`:l=Qp(e,t,c,r),s&&(l.anchor=s.source.substring(1));break;case`block-map`:case`block-seq`:case`flow-collection`:try{l=Bp(nm,e,t,n,r),s&&(l.anchor=s.source.substring(1))}catch(e){r(t,`RESOURCE_EXHAUSTION`,e instanceof Error?e.message:String(e))}break;default:r(t,`UNEXPECTED_TOKEN`,t.type===`error`?t.message:`Unsupported token (type: ${t.type})`),u=!1}return l??=im(e,t.offset,void 0,null,n,r),s&&l.anchor===``&&r(s,`BAD_ALIAS`,`Anchor cannot be an empty string`),i&&e.options.stringKeys&&(!td(l)||typeof l.value!=`string`||l.tag&&l.tag!==`tag:yaml.org,2002:str`)&&r(c??t,`NON_STRING_KEY`,`With stringKeys, all keys must be strings`),a&&(l.spaceBefore=!0),o&&(t.type===`scalar`&&t.source===``?l.comment=o:l.commentBefore=o),e.options.keepSourceTokens&&u&&(l.srcToken=t),l}function im(e,t,n,r,{spaceBefore:i,comment:a,anchor:o,tag:s,end:c},l){let u=Qp(e,{type:`scalar`,offset:tm(t,n,r),indent:-1,source:``},s,l);return o&&(u.anchor=o.source.substring(1),u.anchor===``&&l(o,`BAD_ALIAS`,`Anchor cannot be an empty string`)),i&&(u.spaceBefore=!0),a&&(u.comment=a,u.range[2]=c),u}function am({options:e},{offset:t,source:n,end:r},i){let a=new wd(n.substring(1));a.source===``&&i(t,`BAD_ALIAS`,`Alias cannot be an empty string`),a.source.endsWith(`:`)&&i(t+n.length-1,`BAD_ALIAS`,`Alias ending in : is ambiguous`,!0);let o=t+n.length,s=Fp(r,o,e.strict,i);return a.range=[t,o,s.offset],s.comment&&(a.comment=s.comment),a}function om(e,t,{offset:n,start:r,value:i,end:a},o){let s=new Sp(void 0,Object.assign({_directives:t},e)),c={atKey:!1,atRoot:!0,directives:s.directives,options:s.options,schema:s.schema},l=Op(r,{indicator:`doc-start`,next:i??a?.[0],offset:n,onError:o,parentIndent:0,startOnNewline:!0});l.found&&(s.directives.docStart=!0,i&&(i.type===`block-map`||i.type===`block-seq`)&&!l.hasNewline&&o(l.end,`MISSING_CHAR`,`Block collection cannot start on same line with directives-end marker`)),s.contents=i?rm(c,i,l,o):im(c,l.end,r,null,l,o);let u=s.contents.range[2],d=Fp(a,u,!1,o);return d.comment&&(s.comment=d.comment),s.range=[n,u,d.offset],s}function sm(e){if(typeof e==`number`)return[e,e+1];if(Array.isArray(e))return e.length===2?e:[e[0],e[1]];let{offset:t,source:n}=e;return[t,t+(typeof n==`string`?n.length:1)]}function cm(e){let t=``,n=!1,r=!1;for(let i=0;i<e.length;++i){let a=e[i];switch(a[0]){case`#`:t+=(t===``?``:r?`

`:`
`)+(a.substring(1)||` `),n=!0,r=!1;break;case`%`:e[i+1]?.[0]!==`#`&&(i+=1),n=!1;break;default:n||(r=!0),n=!1}}return{comment:t,afterEmptyLine:r}}var lm=class{constructor(e={}){this.doc=null,this.atDirectives=!1,this.prelude=[],this.errors=[],this.warnings=[],this.onError=(e,t,n,r)=>{let i=sm(e);r?this.warnings.push(new Ep(i,t,n)):this.errors.push(new Tp(i,t,n))},this.directives=new gd({version:e.version||`1.2`}),this.options=e}decorate(e,t){let{comment:n,afterEmptyLine:r}=cm(this.prelude);if(n){let i=e.contents;if(t)e.comment=e.comment?`${e.comment}\n${n}`:n;else if(r||e.directives.docStart||!i)e.commentBefore=n;else if(rd(i)&&!i.flow&&i.items.length>0){let e=i.items[0];ed(e)&&(e=e.key);let t=e.commentBefore;e.commentBefore=t?`${n}\n${t}`:n}else{let e=i.commentBefore;i.commentBefore=e?`${n}\n${e}`:n}}if(t){for(let t=0;t<this.errors.length;++t)e.errors.push(this.errors[t]);for(let t=0;t<this.warnings.length;++t)e.warnings.push(this.warnings[t])}else e.errors=this.errors,e.warnings=this.warnings;this.prelude=[],this.errors=[],this.warnings=[]}streamInfo(){return{comment:cm(this.prelude).comment,directives:this.directives,errors:this.errors,warnings:this.warnings}}*compose(e,t=!1,n=-1){for(let t of e)yield*this.next(t);yield*this.end(t,n)}*next(e){switch(e.type){case`directive`:this.directives.add(e.source,(t,n,r)=>{let i=sm(e);i[0]+=t,this.onError(i,`BAD_DIRECTIVE`,n,r)}),this.prelude.push(e.source),this.atDirectives=!0;break;case`document`:{let t=om(this.options,this.directives,e,this.onError);this.atDirectives&&!t.directives.docStart&&this.onError(e,`MISSING_CHAR`,`Missing directives-end/doc-start indicator line`),this.decorate(t,!1),this.doc&&(yield this.doc),this.doc=t,this.atDirectives=!1;break}case`byte-order-mark`:case`space`:break;case`comment`:case`newline`:this.prelude.push(e.source);break;case`error`:{let t=e.source?`${e.message}: ${JSON.stringify(e.source)}`:e.message,n=new Tp(sm(e),`UNEXPECTED_TOKEN`,t);this.atDirectives||!this.doc?this.errors.push(n):this.doc.errors.push(n);break}case`doc-end`:{if(!this.doc){this.errors.push(new Tp(sm(e),`UNEXPECTED_TOKEN`,`Unexpected doc-end without preceding document`));break}this.doc.directives.docEnd=!0;let t=Fp(e.end,e.offset+e.source.length,this.doc.options.strict,this.onError);if(this.decorate(this.doc,!0),t.comment){let e=this.doc.comment;this.doc.comment=e?`${e}\n${t.comment}`:t.comment}this.doc.range[2]=t.offset;break}default:this.errors.push(new Tp(sm(e),`UNEXPECTED_TOKEN`,`Unsupported token ${e.type}`))}}*end(e=!1,t=-1){if(this.doc)this.decorate(this.doc,!0),yield this.doc,this.doc=null;else if(e){let e=new Sp(void 0,Object.assign({_directives:this.directives},this.options));this.atDirectives&&this.onError(t,`MISSING_CHAR`,`Missing directives-end indicator line`),e.range=[0,t,t],this.decorate(e,!1),yield e}}},um=Symbol(`break visit`),dm=Symbol(`skip children`),fm=Symbol(`remove item`);function pm(e,t){`type`in e&&e.type===`document`&&(e={start:e.start,value:e.value}),mm(Object.freeze([]),e,t)}pm.BREAK=um,pm.SKIP=dm,pm.REMOVE=fm,pm.itemAtPath=(e,t)=>{let n=e;for(let[e,r]of t){let t=n?.[e];if(t&&`items`in t)n=t.items[r];else return}return n},pm.parentCollection=(e,t)=>{let n=pm.itemAtPath(e,t.slice(0,-1)),r=t[t.length-1][0],i=n?.[r];if(i&&`items`in i)return i;throw Error(`Parent collection not found`)};function mm(e,t,n){let r=n(t,e);if(typeof r==`symbol`)return r;for(let i of[`key`,`value`]){let a=t[i];if(a&&`items`in a){for(let t=0;t<a.items.length;++t){let r=mm(Object.freeze(e.concat([[i,t]])),a.items[t],n);if(typeof r==`number`)t=r-1;else if(r===um)return um;else r===fm&&(a.items.splice(t,1),--t)}typeof r==`function`&&i===`key`&&(r=r(t,e))}}return typeof r==`function`?r(t,e):r}function hm(e){switch(e){case`﻿`:return`byte-order-mark`;case``:return`doc-mode`;case``:return`flow-error-end`;case``:return`scalar`;case`---`:return`doc-start`;case`...`:return`doc-end`;case``:case`
`:case`\r
`:return`newline`;case`-`:return`seq-item-ind`;case`?`:return`explicit-key-ind`;case`:`:return`map-value-ind`;case`{`:return`flow-map-start`;case`}`:return`flow-map-end`;case`[`:return`flow-seq-start`;case`]`:return`flow-seq-end`;case`,`:return`comma`}switch(e[0]){case` `:case`	`:return`space`;case`#`:return`comment`;case`%`:return`directive-line`;case`*`:return`alias`;case`&`:return`anchor`;case`!`:return`tag`;case`'`:return`single-quoted-scalar`;case`"`:return`double-quoted-scalar`;case`|`:case`>`:return`block-scalar-header`}return null}function gm(e){switch(e){case void 0:case` `:case`
`:case`\r`:case`	`:return!0;default:return!1}}var _m=new Set(`0123456789ABCDEFabcdef`),vm=new Set(`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()`),ym=new Set(`,[]{}`),bm=new Set(` ,[]{}
\r	`),xm=e=>!e||bm.has(e),Sm=class{constructor(){this.atEnd=!1,this.blockScalarIndent=-1,this.blockScalarKeep=!1,this.buffer=``,this.flowKey=!1,this.flowLevel=0,this.indentNext=0,this.indentValue=0,this.lineEndPos=null,this.next=null,this.pos=0}*lex(e,t=!1){if(e){if(typeof e!=`string`)throw TypeError(`source is not a string`);this.buffer=this.buffer?this.buffer+e:e,this.lineEndPos=null}this.atEnd=!t;let n=this.next??`stream`;for(;n&&(t||this.hasChars(1));)n=yield*this.parseNext(n)}atLineEnd(){let e=this.pos,t=this.buffer[e];for(;t===` `||t===`	`;)t=this.buffer[++e];return!t||t===`#`||t===`
`||t===`\r`&&this.buffer[e+1]===`
`}charAt(e){return this.buffer[this.pos+e]}continueScalar(e){let t=this.buffer[e];if(this.indentNext>0){let n=0;for(;t===` `;)t=this.buffer[++n+e];if(t===`\r`){let t=this.buffer[n+e+1];if(t===`
`||!t&&!this.atEnd)return e+n+1}return t===`
`||n>=this.indentNext||!t&&!this.atEnd?e+n:-1}if(t===`-`||t===`.`){let t=this.buffer.substr(e,3);if((t===`---`||t===`...`)&&gm(this.buffer[e+3]))return-1}return e}getLine(){let e=this.lineEndPos;return(typeof e!=`number`||e!==-1&&e<this.pos)&&(e=this.buffer.indexOf(`
`,this.pos),this.lineEndPos=e),e===-1?this.atEnd?this.buffer.substring(this.pos):null:(this.buffer[e-1]===`\r`&&--e,this.buffer.substring(this.pos,e))}hasChars(e){return this.pos+e<=this.buffer.length}setNext(e){return this.buffer=this.buffer.substring(this.pos),this.pos=0,this.lineEndPos=null,this.next=e,null}peek(e){return this.buffer.substr(this.pos,e)}*parseNext(e){switch(e){case`stream`:return yield*this.parseStream();case`line-start`:return yield*this.parseLineStart();case`block-start`:return yield*this.parseBlockStart();case`doc`:return yield*this.parseDocument();case`flow`:return yield*this.parseFlowCollection();case`quoted-scalar`:return yield*this.parseQuotedScalar();case`block-scalar`:return yield*this.parseBlockScalar();case`plain-scalar`:return yield*this.parsePlainScalar()}}*parseStream(){let e=this.getLine();if(e===null)return this.setNext(`stream`);if(e[0]===`﻿`&&(yield*this.pushCount(1),e=e.substring(1)),e[0]===`%`){let t=e.length,n=e.indexOf(`#`);for(;n!==-1;){let r=e[n-1];if(r===` `||r===`	`){t=n-1;break}n=e.indexOf(`#`,n+1)}for(;;){let n=e[t-1];if(n===` `||n===`	`)--t;else break}let r=(yield*this.pushCount(t))+(yield*this.pushSpaces(!0));return yield*this.pushCount(e.length-r),this.pushNewline(),`stream`}if(this.atLineEnd()){let t=yield*this.pushSpaces(!0);return yield*this.pushCount(e.length-t),yield*this.pushNewline(),`stream`}return yield``,yield*this.parseLineStart()}*parseLineStart(){let e=this.charAt(0);if(!e&&!this.atEnd)return this.setNext(`line-start`);if(e===`-`||e===`.`){if(!this.atEnd&&!this.hasChars(4))return this.setNext(`line-start`);let e=this.peek(3);if((e===`---`||e===`...`)&&gm(this.charAt(3)))return yield*this.pushCount(3),this.indentValue=0,this.indentNext=0,e===`---`?`doc`:`stream`}return this.indentValue=yield*this.pushSpaces(!1),this.indentNext>this.indentValue&&!gm(this.charAt(1))&&(this.indentNext=this.indentValue),yield*this.parseBlockStart()}*parseBlockStart(){let[e,t]=this.peek(2);if(!t&&!this.atEnd)return this.setNext(`block-start`);if((e===`-`||e===`?`||e===`:`)&&gm(t)){let e=(yield*this.pushCount(1))+(yield*this.pushSpaces(!0));return this.indentNext=this.indentValue+1,this.indentValue+=e,`block-start`}return`doc`}*parseDocument(){yield*this.pushSpaces(!0);let e=this.getLine();if(e===null)return this.setNext(`doc`);let t=yield*this.pushIndicators();switch(e[t]){case`#`:yield*this.pushCount(e.length-t);case void 0:return yield*this.pushNewline(),yield*this.parseLineStart();case`{`:case`[`:return yield*this.pushCount(1),this.flowKey=!1,this.flowLevel=1,`flow`;case`}`:case`]`:return yield*this.pushCount(1),`doc`;case`*`:return yield*this.pushUntil(xm),`doc`;case`"`:case`'`:return yield*this.parseQuotedScalar();case`|`:case`>`:return t+=yield*this.parseBlockScalarHeader(),t+=yield*this.pushSpaces(!0),yield*this.pushCount(e.length-t),yield*this.pushNewline(),yield*this.parseBlockScalar();default:return yield*this.parsePlainScalar()}}*parseFlowCollection(){let e,t,n=-1;do e=yield*this.pushNewline(),e>0?(t=yield*this.pushSpaces(!1),this.indentValue=n=t):t=0,t+=yield*this.pushSpaces(!0);while(e+t>0);let r=this.getLine();if(r===null)return this.setNext(`flow`);if((n!==-1&&n<this.indentNext&&r[0]!==`#`||n===0&&(r.startsWith(`---`)||r.startsWith(`...`))&&gm(r[3]))&&(n!==this.indentNext-1||this.flowLevel!==1||r[0]!==`]`&&r[0]!==`}`))return this.flowLevel=0,yield``,yield*this.parseLineStart();let i=0;for(;r[i]===`,`;)i+=yield*this.pushCount(1),i+=yield*this.pushSpaces(!0),this.flowKey=!1;switch(i+=yield*this.pushIndicators(),r[i]){case void 0:return`flow`;case`#`:return yield*this.pushCount(r.length-i),`flow`;case`{`:case`[`:return yield*this.pushCount(1),this.flowKey=!1,this.flowLevel+=1,`flow`;case`}`:case`]`:return yield*this.pushCount(1),this.flowKey=!0,--this.flowLevel,this.flowLevel?`flow`:`doc`;case`*`:return yield*this.pushUntil(xm),`flow`;case`"`:case`'`:return this.flowKey=!0,yield*this.parseQuotedScalar();case`:`:{let e=this.charAt(1);if(this.flowKey||gm(e)||e===`,`)return this.flowKey=!1,yield*this.pushCount(1),yield*this.pushSpaces(!0),`flow`}default:return this.flowKey=!1,yield*this.parsePlainScalar()}}*parseQuotedScalar(){let e=this.charAt(0),t=this.buffer.indexOf(e,this.pos+1);if(e===`'`)for(;t!==-1&&this.buffer[t+1]===`'`;)t=this.buffer.indexOf(`'`,t+2);else for(;t!==-1;){let e=0;for(;this.buffer[t-1-e]===`\\`;)e+=1;if(e%2==0)break;t=this.buffer.indexOf(`"`,t+1)}let n=this.buffer.substring(0,t),r=n.indexOf(`
`,this.pos);if(r!==-1){for(;r!==-1;){let e=this.continueScalar(r+1);if(e===-1)break;r=n.indexOf(`
`,e)}r!==-1&&(t=r-(n[r-1]===`\r`?2:1))}if(t===-1){if(!this.atEnd)return this.setNext(`quoted-scalar`);t=this.buffer.length}return yield*this.pushToIndex(t+1,!1),this.flowLevel?`flow`:`doc`}*parseBlockScalarHeader(){this.blockScalarIndent=-1,this.blockScalarKeep=!1;let e=this.pos;for(;;){let t=this.buffer[++e];if(t===`+`)this.blockScalarKeep=!0;else if(t>`0`&&t<=`9`)this.blockScalarIndent=Number(t)-1;else if(t!==`-`)break}return yield*this.pushUntil(e=>gm(e)||e===`#`)}*parseBlockScalar(){let e=this.pos-1,t=0,n;loop:for(let r=this.pos;n=this.buffer[r];++r)switch(n){case` `:t+=1;break;case`
`:e=r,t=0;break;case`\r`:{let e=this.buffer[r+1];if(!e&&!this.atEnd)return this.setNext(`block-scalar`);if(e===`
`)break}default:break loop}if(!n&&!this.atEnd)return this.setNext(`block-scalar`);if(t>=this.indentNext){this.indentNext=this.blockScalarIndent===-1?t:this.blockScalarIndent+(this.indentNext===0?1:this.indentNext);do{let t=this.continueScalar(e+1);if(t===-1)break;e=this.buffer.indexOf(`
`,t)}while(e!==-1);if(e===-1){if(!this.atEnd)return this.setNext(`block-scalar`);e=this.buffer.length}}let r=e+1;for(n=this.buffer[r];n===` `;)n=this.buffer[++r];if(n===`	`){for(;n===`	`||n===` `||n===`\r`||n===`
`;)n=this.buffer[++r];e=r-1}else if(!this.blockScalarKeep)do{let n=e-1,r=this.buffer[n];r===`\r`&&(r=this.buffer[--n]);let i=n;for(;r===` `;)r=this.buffer[--n];if(r===`
`&&n>=this.pos&&n+1+t>i)e=n;else break}while(1);return yield``,yield*this.pushToIndex(e+1,!0),yield*this.parseLineStart()}*parsePlainScalar(){let e=this.flowLevel>0,t=this.pos-1,n=this.pos-1,r;for(;r=this.buffer[++n];)if(r===`:`){let r=this.buffer[n+1];if(gm(r)||e&&ym.has(r))break;t=n}else if(gm(r)){let i=this.buffer[n+1];if(r===`\r`&&(i===`
`?(n+=1,r=`
`,i=this.buffer[n+1]):t=n),i===`#`||e&&ym.has(i))break;if(r===`
`){let e=this.continueScalar(n+1);if(e===-1)break;n=Math.max(n,e-2)}}else{if(e&&ym.has(r))break;t=n}return!r&&!this.atEnd?this.setNext(`plain-scalar`):(yield``,yield*this.pushToIndex(t+1,!0),e?`flow`:`doc`)}*pushCount(e){return e>0?(yield this.buffer.substr(this.pos,e),this.pos+=e,e):0}*pushToIndex(e,t){let n=this.buffer.slice(this.pos,e);return n?(yield n,this.pos+=n.length,n.length):(t&&(yield``),0)}*pushIndicators(){let e=0;loop:for(;;){switch(this.charAt(0)){case`!`:e+=yield*this.pushTag(),e+=yield*this.pushSpaces(!0);continue loop;case`&`:e+=yield*this.pushUntil(xm),e+=yield*this.pushSpaces(!0);continue loop;case`-`:case`?`:case`:`:{let t=this.flowLevel>0,n=this.charAt(1);if(gm(n)||t&&ym.has(n)){t?this.flowKey&&=!1:this.indentNext=this.indentValue+1,e+=yield*this.pushCount(1),e+=yield*this.pushSpaces(!0);continue loop}}}break loop}return e}*pushTag(){if(this.charAt(1)===`<`){let e=this.pos+2,t=this.buffer[e];for(;!gm(t)&&t!==`>`;)t=this.buffer[++e];return yield*this.pushToIndex(t===`>`?e+1:e,!1)}{let e=this.pos+1,t=this.buffer[e];for(;t;)if(vm.has(t))t=this.buffer[++e];else if(t===`%`&&_m.has(this.buffer[e+1])&&_m.has(this.buffer[e+2]))t=this.buffer[e+=3];else break;return yield*this.pushToIndex(e,!1)}}*pushNewline(){let e=this.buffer[this.pos];return e===`
`?yield*this.pushCount(1):e===`\r`&&this.charAt(1)===`
`?yield*this.pushCount(2):0}*pushSpaces(e){let t=this.pos-1,n;do n=this.buffer[++t];while(n===` `||e&&n===`	`);let r=t-this.pos;return r>0&&(yield this.buffer.substr(this.pos,r),this.pos=t),r}*pushUntil(e){let t=this.pos,n=this.buffer[t];for(;!e(n);)n=this.buffer[++t];return yield*this.pushToIndex(t,!1)}},Cm=class{constructor(){this.lineStarts=[],this.addNewLine=e=>this.lineStarts.push(e),this.linePos=e=>{let t=0,n=this.lineStarts.length;for(;t<n;){let r=t+n>>1;this.lineStarts[r]<e?t=r+1:n=r}if(this.lineStarts[t]===e)return{line:t+1,col:1};if(t===0)return{line:0,col:e};let r=this.lineStarts[t-1];return{line:t,col:e-r+1}}}};function wm(e,t){for(let n=0;n<e.length;++n)if(e[n].type===t)return!0;return!1}function Tm(e){for(let t=0;t<e.length;++t)switch(e[t].type){case`space`:case`comment`:case`newline`:break;default:return t}return-1}function Em(e){switch(e?.type){case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:case`flow-collection`:return!0;default:return!1}}function Dm(e){switch(e.type){case`document`:return e.start;case`block-map`:{let t=e.items[e.items.length-1];return t.sep??t.start}case`block-seq`:return e.items[e.items.length-1].start;default:return[]}}function Om(e){if(e.length===0)return[];let t=e.length;loop:for(;--t>=0;)switch(e[t].type){case`doc-start`:case`explicit-key-ind`:case`map-value-ind`:case`seq-item-ind`:case`newline`:break loop}for(;e[++t]?.type===`space`;);return e.splice(t,e.length)}function km(e,t){if(t.length<1e5)Array.prototype.push.apply(e,t);else for(let n=0;n<t.length;++n)e.push(t[n])}function Am(e){if(e.start.type===`flow-seq-start`)for(let t of e.items)t.sep&&!t.value&&!wm(t.start,`explicit-key-ind`)&&!wm(t.sep,`map-value-ind`)&&(t.key&&(t.value=t.key),delete t.key,Em(t.value)?t.value.end?km(t.value.end,t.sep):t.value.end=t.sep:km(t.start,t.sep),delete t.sep)}var jm=class{constructor(e){this.atNewLine=!0,this.atScalar=!1,this.indent=0,this.offset=0,this.onKeyLine=!1,this.stack=[],this.source=``,this.type=``,this.lexer=new Sm,this.onNewLine=e}*parse(e,t=!1){this.onNewLine&&this.offset===0&&this.onNewLine(0);for(let n of this.lexer.lex(e,t))yield*this.next(n);t||(yield*this.end())}*next(e){if(this.source=e,this.atScalar){this.atScalar=!1,yield*this.step(),this.offset+=e.length;return}let t=hm(e);if(!t){let t=`Not a YAML token: ${e}`;yield*this.pop({type:`error`,offset:this.offset,message:t,source:e}),this.offset+=e.length}else if(t===`scalar`)this.atNewLine=!1,this.atScalar=!0,this.type=`scalar`;else{switch(this.type=t,yield*this.step(),t){case`newline`:this.atNewLine=!0,this.indent=0,this.onNewLine&&this.onNewLine(this.offset+e.length);break;case`space`:this.atNewLine&&e[0]===` `&&(this.indent+=e.length);break;case`explicit-key-ind`:case`map-value-ind`:case`seq-item-ind`:this.atNewLine&&(this.indent+=e.length);break;case`doc-mode`:case`flow-error-end`:return;default:this.atNewLine=!1}this.offset+=e.length}}*end(){for(;this.stack.length>0;)yield*this.pop()}get sourceToken(){return{type:this.type,offset:this.offset,indent:this.indent,source:this.source}}*step(){let e=this.peek(1);if(this.type===`doc-end`&&e?.type!==`doc-end`){for(;this.stack.length>0;)yield*this.pop();this.stack.push({type:`doc-end`,offset:this.offset,source:this.source})}else{if(!e)return yield*this.stream();switch(e.type){case`document`:return yield*this.document(e);case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:return yield*this.scalar(e);case`block-scalar`:return yield*this.blockScalar(e);case`block-map`:return yield*this.blockMap(e);case`block-seq`:return yield*this.blockSequence(e);case`flow-collection`:return yield*this.flowCollection(e);case`doc-end`:return yield*this.documentEnd(e)}yield*this.pop()}}peek(e){return this.stack[this.stack.length-e]}*pop(e){let t=e??this.stack.pop();if(!t)yield{type:`error`,offset:this.offset,source:``,message:`Tried to pop an empty stack`};else if(this.stack.length===0)yield t;else{let e=this.peek(1);switch(t.type===`block-scalar`?t.indent=`indent`in e?e.indent:0:t.type===`flow-collection`&&e.type===`document`&&(t.indent=0),t.type===`flow-collection`&&Am(t),e.type){case`document`:e.value=t;break;case`block-scalar`:e.props.push(t);break;case`block-map`:{let n=e.items[e.items.length-1];if(n.value){e.items.push({start:[],key:t,sep:[]}),this.onKeyLine=!0;return}if(n.sep)n.value=t;else{Object.assign(n,{key:t,sep:[]}),this.onKeyLine=!n.explicitKey;return}break}case`block-seq`:{let n=e.items[e.items.length-1];n.value?e.items.push({start:[],value:t}):n.value=t;break}case`flow-collection`:{let n=e.items[e.items.length-1];!n||n.value?e.items.push({start:[],key:t,sep:[]}):n.sep?n.value=t:Object.assign(n,{key:t,sep:[]});return}default:yield*this.pop(),yield*this.pop(t)}if((e.type===`document`||e.type===`block-map`||e.type===`block-seq`)&&(t.type===`block-map`||t.type===`block-seq`)){let n=t.items[t.items.length-1];n&&!n.sep&&!n.value&&n.start.length>0&&Tm(n.start)===-1&&(t.indent===0||n.start.every(e=>e.type!==`comment`||e.indent<t.indent))&&(e.type===`document`?e.end=n.start:e.items.push({start:n.start}),t.items.splice(-1,1))}}}*stream(){switch(this.type){case`directive-line`:yield{type:`directive`,offset:this.offset,source:this.source};return;case`byte-order-mark`:case`space`:case`comment`:case`newline`:yield this.sourceToken;return;case`doc-mode`:case`doc-start`:{let e={type:`document`,offset:this.offset,start:[]};this.type===`doc-start`&&e.start.push(this.sourceToken),this.stack.push(e);return}}yield{type:`error`,offset:this.offset,message:`Unexpected ${this.type} token in YAML stream`,source:this.source}}*document(e){if(e.value)return yield*this.lineEnd(e);switch(this.type){case`doc-start`:Tm(e.start)===-1?e.start.push(this.sourceToken):(yield*this.pop(),yield*this.step());return;case`anchor`:case`tag`:case`space`:case`comment`:case`newline`:e.start.push(this.sourceToken);return}let t=this.startBlockValue(e);t?this.stack.push(t):yield{type:`error`,offset:this.offset,message:`Unexpected ${this.type} token in YAML document`,source:this.source}}*scalar(e){if(this.type===`map-value-ind`){let t=Om(Dm(this.peek(2))),n;e.end?(n=e.end,n.push(this.sourceToken),delete e.end):n=[this.sourceToken];let r={type:`block-map`,offset:e.offset,indent:e.indent,items:[{start:t,key:e,sep:n}]};this.onKeyLine=!0,this.stack[this.stack.length-1]=r}else yield*this.lineEnd(e)}*blockScalar(e){switch(this.type){case`space`:case`comment`:case`newline`:e.props.push(this.sourceToken);return;case`scalar`:if(e.source=this.source,this.atNewLine=!0,this.indent=0,this.onNewLine){let e=this.source.indexOf(`
`)+1;for(;e!==0;)this.onNewLine(this.offset+e),e=this.source.indexOf(`
`,e)+1}yield*this.pop();break;default:yield*this.pop(),yield*this.step()}}*blockMap(e){let t=e.items[e.items.length-1];switch(this.type){case`newline`:if(this.onKeyLine=!1,t.value){let n=`end`in t.value?t.value.end:void 0;(Array.isArray(n)?n[n.length-1]:void 0)?.type===`comment`?n?.push(this.sourceToken):e.items.push({start:[this.sourceToken]})}else t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case`space`:case`comment`:if(t.value)e.items.push({start:[this.sourceToken]});else if(t.sep)t.sep.push(this.sourceToken);else{if(this.atIndentedComment(t.start,e.indent)){let n=e.items[e.items.length-2]?.value?.end;if(Array.isArray(n)){km(n,t.start),n.push(this.sourceToken),e.items.pop();return}}t.start.push(this.sourceToken)}return}if(this.indent>=e.indent){let n=!this.onKeyLine&&this.indent===e.indent,r=n&&(t.sep||t.explicitKey)&&this.type!==`seq-item-ind`,i=[];if(r&&t.sep&&!t.value){let n=[];for(let r=0;r<t.sep.length;++r){let i=t.sep[r];switch(i.type){case`newline`:n.push(r);break;case`space`:break;case`comment`:i.indent>e.indent&&(n.length=0);break;default:n.length=0}}n.length>=2&&(i=t.sep.splice(n[1]))}switch(this.type){case`anchor`:case`tag`:r||t.value?(i.push(this.sourceToken),e.items.push({start:i}),this.onKeyLine=!0):t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case`explicit-key-ind`:!t.sep&&!t.explicitKey?(t.start.push(this.sourceToken),t.explicitKey=!0):r||t.value?(i.push(this.sourceToken),e.items.push({start:i,explicitKey:!0})):this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken],explicitKey:!0}]}),this.onKeyLine=!0;return;case`map-value-ind`:if(t.explicitKey){if(!t.sep){if(wm(t.start,`newline`))Object.assign(t,{key:null,sep:[this.sourceToken]});else{let e=Om(t.start);this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:e,key:null,sep:[this.sourceToken]}]})}}else if(t.value)e.items.push({start:[],key:null,sep:[this.sourceToken]});else if(wm(t.sep,`map-value-ind`))this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:i,key:null,sep:[this.sourceToken]}]});else if(Em(t.key)&&!wm(t.sep,`newline`)){let e=Om(t.start),n=t.key,r=t.sep;r.push(this.sourceToken),delete t.key,delete t.sep,this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:e,key:n,sep:r}]})}else i.length>0?t.sep=t.sep.concat(i,this.sourceToken):t.sep.push(this.sourceToken)}else t.sep?t.value||r?e.items.push({start:i,key:null,sep:[this.sourceToken]}):wm(t.sep,`map-value-ind`)?this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:[],key:null,sep:[this.sourceToken]}]}):t.sep.push(this.sourceToken):Object.assign(t,{key:null,sep:[this.sourceToken]});this.onKeyLine=!0;return;case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:{let n=this.flowScalar(this.type);r||t.value?(e.items.push({start:i,key:n,sep:[]}),this.onKeyLine=!0):t.sep?this.stack.push(n):(Object.assign(t,{key:n,sep:[]}),this.onKeyLine=!0);return}default:{let r=this.startBlockValue(e);if(r){if(r.type===`block-seq`){if(!t.explicitKey&&t.sep&&!wm(t.sep,`newline`)){yield*this.pop({type:`error`,offset:this.offset,message:`Unexpected block-seq-ind on same line with key`,source:this.source});return}}else n&&e.items.push({start:i});this.stack.push(r);return}}}}yield*this.pop(),yield*this.step()}*blockSequence(e){let t=e.items[e.items.length-1];switch(this.type){case`newline`:if(t.value){let n=`end`in t.value?t.value.end:void 0;(Array.isArray(n)?n[n.length-1]:void 0)?.type===`comment`?n?.push(this.sourceToken):e.items.push({start:[this.sourceToken]})}else t.start.push(this.sourceToken);return;case`space`:case`comment`:if(t.value)e.items.push({start:[this.sourceToken]});else{if(this.atIndentedComment(t.start,e.indent)){let n=e.items[e.items.length-2]?.value?.end;if(Array.isArray(n)){km(n,t.start),n.push(this.sourceToken),e.items.pop();return}}t.start.push(this.sourceToken)}return;case`anchor`:case`tag`:if(t.value||this.indent<=e.indent)break;t.start.push(this.sourceToken);return;case`seq-item-ind`:if(this.indent!==e.indent)break;t.value||wm(t.start,`seq-item-ind`)?e.items.push({start:[this.sourceToken]}):t.start.push(this.sourceToken);return}if(this.indent>e.indent){let t=this.startBlockValue(e);if(t){this.stack.push(t);return}}yield*this.pop(),yield*this.step()}*flowCollection(e){let t=e.items[e.items.length-1];if(this.type===`flow-error-end`){let e;do yield*this.pop(),e=this.peek(1);while(e?.type===`flow-collection`)}else if(e.end.length===0){switch(this.type){case`comma`:case`explicit-key-ind`:!t||t.sep?e.items.push({start:[this.sourceToken]}):t.start.push(this.sourceToken);return;case`map-value-ind`:!t||t.value?e.items.push({start:[],key:null,sep:[this.sourceToken]}):t.sep?t.sep.push(this.sourceToken):Object.assign(t,{key:null,sep:[this.sourceToken]});return;case`space`:case`comment`:case`newline`:case`anchor`:case`tag`:!t||t.value?e.items.push({start:[this.sourceToken]}):t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:{let n=this.flowScalar(this.type);!t||t.value?e.items.push({start:[],key:n,sep:[]}):t.sep?this.stack.push(n):Object.assign(t,{key:n,sep:[]});return}case`flow-map-end`:case`flow-seq-end`:e.end.push(this.sourceToken);return}let n=this.startBlockValue(e);n?this.stack.push(n):(yield*this.pop(),yield*this.step())}else{let t=this.peek(2);if(t.type===`block-map`&&(this.type===`map-value-ind`&&t.indent===e.indent||this.type===`newline`&&!t.items[t.items.length-1].sep))yield*this.pop(),yield*this.step();else if(this.type===`map-value-ind`&&t.type!==`flow-collection`){let n=Om(Dm(t));Am(e);let r=e.end.splice(1,e.end.length);r.push(this.sourceToken);let i={type:`block-map`,offset:e.offset,indent:e.indent,items:[{start:n,key:e,sep:r}]};this.onKeyLine=!0,this.stack[this.stack.length-1]=i}else yield*this.lineEnd(e)}}flowScalar(e){if(this.onNewLine){let e=this.source.indexOf(`
`)+1;for(;e!==0;)this.onNewLine(this.offset+e),e=this.source.indexOf(`
`,e)+1}return{type:e,offset:this.offset,indent:this.indent,source:this.source}}startBlockValue(e){switch(this.type){case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:return this.flowScalar(this.type);case`block-scalar-header`:return{type:`block-scalar`,offset:this.offset,indent:this.indent,props:[this.sourceToken],source:``};case`flow-map-start`:case`flow-seq-start`:return{type:`flow-collection`,offset:this.offset,indent:this.indent,start:this.sourceToken,items:[],end:[]};case`seq-item-ind`:return{type:`block-seq`,offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken]}]};case`explicit-key-ind`:{this.onKeyLine=!0;let t=Om(Dm(e));return t.push(this.sourceToken),{type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:t,explicitKey:!0}]}}case`map-value-ind`:{this.onKeyLine=!0;let t=Om(Dm(e));return{type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:t,key:null,sep:[this.sourceToken]}]}}}return null}atIndentedComment(e,t){return this.type!==`comment`||this.indent<=t?!1:e.every(e=>e.type===`newline`||e.type===`space`)}*documentEnd(e){this.type!==`doc-mode`&&(e.end?e.end.push(this.sourceToken):e.end=[this.sourceToken],this.type===`newline`&&(yield*this.pop()))}*lineEnd(e){switch(this.type){case`comma`:case`doc-start`:case`doc-end`:case`flow-seq-end`:case`flow-map-end`:case`map-value-ind`:yield*this.pop(),yield*this.step();break;case`newline`:this.onKeyLine=!1;default:e.end?e.end.push(this.sourceToken):e.end=[this.sourceToken],this.type===`newline`&&(yield*this.pop())}}};function Mm(e){let t=e.prettyErrors!==!1;return{lineCounter:e.lineCounter||t&&new Cm||null,prettyErrors:t}}function Nm(e,t={}){let{lineCounter:n,prettyErrors:r}=Mm(t),i=new jm(n?.addNewLine),a=new lm(t),o=null;for(let t of a.compose(i.parse(e),!0,e.length))if(!o)o=t;else if(o.options.logLevel!==`silent`){o.errors.push(new Tp(t.range.slice(0,2),`MULTIPLE_DOCS`,`Source contains multiple documents; please use YAML.parseAllDocuments()`));break}return r&&n&&(o.errors.forEach(Dp(e,n)),o.warnings.forEach(Dp(e,n))),o}function Pm(e,t,n){let r;typeof t==`function`?r=t:n===void 0&&t&&typeof t==`object`&&(n=t);let i=Nm(e,n);if(!i)return null;if(i.warnings.forEach(e=>nf(i.options.logLevel,e)),i.errors.length>0){if(i.options.logLevel!==`silent`)throw i.errors[0];i.errors=[]}return i.toJS(Object.assign({reviver:r},n))}function Fm(e){switch(e){case`rackmount-10`:return`10inch`;case`rackmount-19`:return`19inch`;case`rackmount-6`:return`6inch`;case`sub-module`:case`shelf-standing`:return}}function Im(e,t=e.slug){let n=ml(e),r=[],{width_mm:i,height_mm:a}=n.geometry,o=new Set;for(let e=0;e<n.ports.length;e++){let s=n.ports[e];o.has(s.port_id)&&r.push({slug:n.slug,source:t,code:`DUPLICATE_PORT_ID`,message:`Duplicate port_id '${s.port_id}' in blueprint '${n.slug}'.`}),o.add(s.port_id);let{x_mm:c,y_mm:l}=s.coordinates;(c<=0||c>=i||l<=0||l>=a)&&r.push({slug:n.slug,source:t,code:`PORT_OUT_OF_BOUNDS`,message:`Port '${s.port_id}' on face '${s.face}' at (${c}, ${l}) mm lies outside face bounds (0..${i}, 0..${a}) mm.`});for(let i=e+1;i<n.ports.length;i++){let e=n.ports[i];if(s.face!==e.face)continue;let a=s.coordinates.x_mm-e.coordinates.x_mm,o=s.coordinates.y_mm-e.coordinates.y_mm,c=Y(Math.hypot(a,o));c<8&&r.push({slug:n.slug,source:t,code:`PORT_OVERLAP`,message:`Ports '${s.port_id}' and '${e.port_id}' on '${s.face}' face overlap (distance ${c} mm < 8 mm).`})}}let s=Fm(n.mount_type),c=s===void 0?void 0:h[s];for(let e=0;e<n.slots.length;e++){let i=n.slots[e],o=i.offset_mm.x,l=Y(i.offset_mm.x+i.max_dimensions_mm.width),u=i.offset_mm.y,d=Y(i.offset_mm.y+i.max_dimensions_mm.height),f=i.offset_mm.z,p=Y(i.offset_mm.z+i.max_dimensions_mm.depth);if(c!==void 0){let e=c.X_aperture_min,a=Y(c.X_aperture_min+c.W_aperture);(o<e-.001||l>a+.001)&&r.push({slug:n.slug,source:t,code:`SLOT_OUT_OF_APERTURE`,message:`Slot '${i.slot_id}' X-span [${o}, ${l}] mm exceeds ${s} usable aperture [${e}, ${a}] mm (W_aperture = ${c.W_aperture} mm).`})}(u<-.001||d>a+.001)&&r.push({slug:n.slug,source:t,code:`SLOT_OUT_OF_APERTURE`,message:`Slot '${i.slot_id}' Y-span [${u}, ${d}] mm exceeds carrier height [0, ${a}] mm.`});for(let a=e+1;a<n.slots.length;a++){let e=n.slots[a],s=e.offset_mm.x,c=Y(e.offset_mm.x+e.max_dimensions_mm.width),m=e.offset_mm.y,h=Y(e.offset_mm.y+e.max_dimensions_mm.height),g=e.offset_mm.z,_=Y(e.offset_mm.z+e.max_dimensions_mm.depth),v=Math.min(l,c)-Math.max(o,s),y=Math.min(d,h)-Math.max(u,m),b=Math.min(p,_)-Math.max(f,g);v>.001&&y>.001&&b>.001&&r.push({slug:n.slug,source:t,code:`SLOT_OVERLAP`,message:`Carrier slots '${i.slot_id}' and '${e.slot_id}' overlap in 3D space by (${Y(v)}, ${Y(y)}, ${Y(b)}) mm.`})}}return{valid:r.length===0,blueprint:n,issues:r}}function Lm(e,t=`inline-yaml`){let n;try{n=Pm(e)}catch(e){return{valid:!1,issues:[{slug:t,source:t,code:`YAML_PARSE_ERROR`,message:e instanceof Error?e.message:String(e)}]}}let r=Uc.safeParse(n);return r.success?Im(r.data,t):{valid:!1,issues:r.error.issues.map(e=>({slug:t,source:t,code:`ZOD_SCHEMA_INVALID`,message:`${e.path.join(`.`)}: ${e.message}`}))}}function Rm(e){switch(e){case`10inch`:case`10inch-rackmount`:case`rackmount-10`:return`rackmount-10`;case`19inch`:case`19inch-rackmount`:case`rackmount-19`:return`rackmount-19`;case`6inch`:case`6inch-rackmount`:case`rackmount-6`:return`rackmount-6`;case`sub-module`:return`sub-module`;case`shelf-standing`:return`shelf-standing`}}var zm=new class e{blueprints=new Map;constructor(e,t){if(t!==void 0)for(let[e,n]of t.entries())this.blueprints.set(e,n);else if(e!==void 0)for(let t of e)this.registerCustomBlueprint(t);else for(let e of Uu){let t=Lm(e.rawYaml,e.relativePath);if(!t.valid||t.blueprint===void 0){let n=t.issues.map(e=>`${e.code}: ${e.message}`).join(`; `);throw Error(`Invalid built-in catalog blueprint '${e.relativePath}': ${n}`)}this.blueprints.set(t.blueprint.slug,t.blueprint)}}clone(){return new e(void 0,this.blueprints)}getAllBlueprints(){return[...this.blueprints.values()]}getBlueprintBySlug(e){return this.blueprints.get(e)}registerCustomBlueprint(e){let t=Uc.parse(e),n=Im(t,t.slug);if(!n.valid||n.blueprint===void 0){let e=n.issues.map(e=>`${e.code}: ${e.message}`).join(`; `);throw Error(`Cannot register invalid blueprint '${t.slug}': ${e}`)}this.blueprints.set(n.blueprint.slug,ml(n.blueprint))}searchCatalog(e={}){let t=e.query?.trim().toLowerCase(),n=e.mount_type===void 0?e.form_factor===void 0?void 0:Rm(e.form_factor):Rm(e.mount_type);return this.getAllBlueprints().filter(r=>{if(t!==void 0&&t.length>0){let e=`${r.slug} ${r.manufacturer} ${r.model} ${r.category}`.toLowerCase();if(!t.split(/\s+/).every(t=>e.includes(t)))return!1}if(n!==void 0&&r.mount_type!==n||e.category!==void 0&&r.category!==e.category||e.max_depth_mm!==void 0&&r.geometry.depth_mm>e.max_depth_mm||e.min_poe_budget_watts!==void 0&&(r.power_and_thermal.poe_budget_watts??0)<e.min_poe_budget_watts)return!1;if(e.accepted_slot_type!==void 0){let t=r.slot_compatibility===e.accepted_slot_type,n=r.slots.some(t=>t.accepted_slot_type===e.accepted_slot_type);if(!t&&!n)return!1}return!0})}toRecord(){let e={};for(let[t,n]of this.blueprints.entries())t!==`__proto__`&&t!==`constructor`&&t!==`prototype`&&Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0});return e}};function Bm(){return{schema_version:`1.0`,project_name:`8U 10-Inch Proxmox & UniFi Homelab`,rack:{standard:`10inch`,u_height:8,rail_depth_mm:240,enclosure_type:`closed-glass-front`,front_door_clearance_mm:50,rear_clearance_mm:60},mounted_devices:[{instance_id:`ups-u1`,blueprint_slug:`cyberpower-10inch-ups-1u`,hostname:`ups-core-01`,u_position:1,face:`front`,children:[]},{instance_id:`cover-u2`,blueprint_slug:`3dprint-10inch-cover-panel-lines-1u`,hostname:`cover-panel-u2`,u_position:2,face:`front`,children:[]},{instance_id:`pdu-u2-rear`,blueprint_slug:`digitus-10inch-pdu-4way-schuko`,hostname:`pdu-rear-01`,u_position:2,face:`rear`,children:[]},{instance_id:`carrier-u3`,blueprint_slug:`3dprint-10inch-ucg-ultra-plus-3keystone`,hostname:`carrier-gateway-u3`,u_position:3,face:`front`,children:[{instance_id:`ucg-max`,blueprint_slug:`ubiquiti-ucg-max`,hostname:`gw-unifi-max`,slot_id:`gateway-bay`},{instance_id:`ks-u3-wan`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`WAN-ISP`,slot_id:`keystone-1`},{instance_id:`ks-u3-uplink`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`UCG-LAN1`,slot_id:`keystone-2`},{instance_id:`ks-u3-aux`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`UCG-LAN2`,slot_id:`keystone-3`}]},{instance_id:`carrier-u4`,blueprint_slug:`3dprint-10inch-lenovo-tiny-plus-2keystone`,hostname:`carrier-pve01-u4`,u_position:4,face:`front`,children:[{instance_id:`pve-node-01`,blueprint_slug:`lenovo-thinkcentre-m920q`,hostname:`pve-node-01`,slot_id:`left-mini-pc-bay`},{instance_id:`ks-u4-eth1`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`PVE1-2.5G`,slot_id:`keystone-1`},{instance_id:`ks-u4-ceph`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`PVE1-CEPH`,slot_id:`keystone-2`}]},{instance_id:`carrier-u5`,blueprint_slug:`3dprint-10inch-lenovo-tiny-plus-2keystone`,hostname:`carrier-pve02-u5`,u_position:5,face:`front`,children:[{instance_id:`pve-node-02`,blueprint_slug:`lenovo-thinkcentre-m920q`,hostname:`pve-node-02`,slot_id:`left-mini-pc-bay`},{instance_id:`ks-u5-eth1`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`PVE2-2.5G`,slot_id:`keystone-1`},{instance_id:`ks-u5-ceph`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`PVE2-CEPH`,slot_id:`keystone-2`}]},{instance_id:`brush-u6`,blueprint_slug:`generic-10inch-brush-panel-1u`,hostname:`cable-brush-u6`,u_position:6,face:`front`,children:[]},{instance_id:`patch-u7`,blueprint_slug:`deskpi-10inch-patch-panel-12port`,hostname:`patch-panel-u7`,u_position:7,face:`front`,children:[]},{instance_id:`sw-u8`,blueprint_slug:`ubiquiti-usw-flex-2-5g-8-poe`,hostname:`sw-core-flex25g`,u_position:8,face:`front`,children:[]}],cables:[{cable_id:`pwr-ups-to-pdu`,cable_type:`power-schuko-c13`,color_hex:`#EF4444`,label:`UPS C13-1 -> Rear PDU Input`,from:{instance_id:`ups-u1`,port_id:`iec_out1`,face:`rear`},to:{instance_id:`pdu-u2-rear`,port_id:`mains_in`}},{cable_id:`pwr-ups-to-sw`,cable_type:`power-c13-c14`,color_hex:`#EF4444`,label:`UPS C13-2 -> USW-Flex-2.5G`,from:{instance_id:`ups-u1`,port_id:`iec_out2`,face:`rear`},to:{instance_id:`sw-u8`,port_id:`pwr_in`,face:`rear`}},{cable_id:`pwr-pdu-to-ucg`,cable_type:`power-usb-c`,color_hex:`#F97316`,label:`PDU Schuko 1 -> UCG-Max USB-C PD`,from:{instance_id:`pdu-u2-rear`,port_id:`outlet1`},to:{instance_id:`ucg-max`,port_id:`usbc_pwr`,face:`rear`}},{cable_id:`pwr-pdu-to-pve1`,cable_type:`power-dc-5525`,color_hex:`#F59E0B`,label:`PDU Schuko 2 -> PVE-01 20V DC Brick`,from:{instance_id:`pdu-u2-rear`,port_id:`outlet2`},to:{instance_id:`pve-node-01`,port_id:`dc_in`,face:`rear`}},{cable_id:`pwr-pdu-to-pve2`,cable_type:`power-dc-5525`,color_hex:`#F59E0B`,label:`PDU Schuko 3 -> PVE-02 20V DC Brick`,from:{instance_id:`pdu-u2-rear`,port_id:`outlet3`},to:{instance_id:`pve-node-02`,port_id:`dc_in`,face:`rear`}},{cable_id:`trunk-ucg-lan1-to-patch1`,cable_type:`cat6a`,color_hex:`#3B82F6`,label:`UCG-Max LAN1 -> Patch P1 (Rear)`,vlan_id:1,ip_cidr:`10.10.0.1/24`,from:{instance_id:`ucg-max`,port_id:`lan1`,face:`rear`},to:{instance_id:`patch-u7`,port_id:`p1`,face:`rear`}},{cable_id:`trunk-pve1-eth1-to-patch2`,cable_type:`cat6a`,color_hex:`#10B981`,label:`PVE-01 2.5G ETH1 -> Patch P2 (Rear)`,from:{instance_id:`pve-node-01`,port_id:`eth1`,face:`rear`},to:{instance_id:`patch-u7`,port_id:`p2`,face:`rear`}},{cable_id:`trunk-pve2-eth1-to-patch3`,cable_type:`cat6a`,color_hex:`#10B981`,label:`PVE-02 2.5G ETH1 -> Patch P3 (Rear)`,from:{instance_id:`pve-node-02`,port_id:`eth1`,face:`rear`},to:{instance_id:`patch-u7`,port_id:`p3`,face:`rear`}},{cable_id:`trunk-pve1-eth0-to-patch4`,cable_type:`cat6a`,color_hex:`#6366F1`,label:`PVE-01 Mgmt ETH0 -> Patch P4 (Rear)`,from:{instance_id:`pve-node-01`,port_id:`eth0`,face:`rear`},to:{instance_id:`patch-u7`,port_id:`p4`,face:`rear`}},{cable_id:`trunk-pve2-eth0-to-patch5`,cable_type:`cat6a`,color_hex:`#6366F1`,label:`PVE-02 Mgmt ETH0 -> Patch P5 (Rear)`,from:{instance_id:`pve-node-02`,port_id:`eth0`,face:`rear`},to:{instance_id:`patch-u7`,port_id:`p5`,face:`rear`}},{cable_id:`trunk-ucg-wan-to-ks`,cable_type:`cat6a`,color_hex:`#EC4899`,label:`UCG-Max WAN -> U3 Keystone 1 (Rear)`,from:{instance_id:`ucg-max`,port_id:`wan`,face:`rear`},to:{instance_id:`ks-u3-wan`,port_id:`coupler`,face:`rear`}},{cable_id:`trunk-pve-ceph-direct`,cable_type:`cat6a`,color_hex:`#A855F7`,label:`PVE-01 ETH2 <-> PVE-02 ETH2 (2.5G Ceph Cluster)`,vlan_id:50,ip_cidr:`10.50.0.0/24`,from:{instance_id:`pve-node-01`,port_id:`eth2`,face:`rear`},to:{instance_id:`pve-node-02`,port_id:`eth2`,face:`rear`}},{cable_id:`patch-front-p1-sw1`,cable_type:`cat6a`,color_hex:`#3B82F6`,label:`Patch P1 -> Switch Port 1 (Gateway Uplink)`,from:{instance_id:`patch-u7`,port_id:`p1`,face:`front`},to:{instance_id:`sw-u8`,port_id:`eth1`,face:`front`}},{cable_id:`patch-front-p2-sw2`,cable_type:`cat6a`,color_hex:`#10B981`,label:`Patch P2 -> Switch Port 2 (PVE-01 2.5G)`,from:{instance_id:`patch-u7`,port_id:`p2`,face:`front`},to:{instance_id:`sw-u8`,port_id:`eth2`,face:`front`}},{cable_id:`patch-front-p3-sw3`,cable_type:`cat6a`,color_hex:`#10B981`,label:`Patch P3 -> Switch Port 3 (PVE-02 2.5G)`,from:{instance_id:`patch-u7`,port_id:`p3`,face:`front`},to:{instance_id:`sw-u8`,port_id:`eth3`,face:`front`}},{cable_id:`patch-front-p4-sw4`,cable_type:`cat6a`,color_hex:`#6366F1`,label:`Patch P4 -> Switch Port 4 (PVE-01 Mgmt)`,from:{instance_id:`patch-u7`,port_id:`p4`,face:`front`},to:{instance_id:`sw-u8`,port_id:`eth4`,face:`front`}},{cable_id:`patch-front-p5-sw5`,cable_type:`cat6a`,color_hex:`#6366F1`,label:`Patch P5 -> Switch Port 5 (PVE-02 Mgmt)`,from:{instance_id:`patch-u7`,port_id:`p5`,face:`front`},to:{instance_id:`sw-u8`,port_id:`eth5`,face:`front`}},{cable_id:`patch-front-p6-wan`,cable_type:`cat6a`,color_hex:`#EC4899`,label:`Patch P6 -> U3 WAN Keystone (ISP Glasfaser-ONT 2.5G)`,vlan_id:900,from:{instance_id:`patch-u7`,port_id:`p6`,face:`front`},to:{instance_id:`ks-u3-wan`,port_id:`coupler`,face:`front`}},{cable_id:`patch-front-p7-sw7`,cable_type:`cat6a`,color_hex:`#0EA5E9`,label:`Patch P7 -> Switch Port 7 (PoE+ Wi-Fi 7 AP EG, 21W)`,vlan_id:20,from:{instance_id:`patch-u7`,port_id:`p7`,face:`front`},to:{instance_id:`sw-u8`,port_id:`eth7`,face:`front`}},{cable_id:`patch-front-p8-sw8`,cable_type:`cat6a`,color_hex:`#F59E0B`,label:`Patch P8 -> Switch Port 8 (PoE+ 4K Kamera Einfahrt, 12.5W)`,vlan_id:30,from:{instance_id:`patch-u7`,port_id:`p8`,face:`front`},to:{instance_id:`sw-u8`,port_id:`eth8`,face:`front`}},{cable_id:`patch-front-p9-sw9`,cable_type:`cat6a`,color_hex:`#14B8A6`,label:`Patch P9 -> Switch Port 9 (Home-Office 2.5G LAN)`,vlan_id:10,from:{instance_id:`patch-u7`,port_id:`p9`,face:`front`},to:{instance_id:`sw-u8`,port_id:`eth9`,face:`front`}},{cable_id:`cross-sw6-to-ucg-lan2`,cable_type:`cat6a`,color_hex:`#06B6D4`,label:`Switch Port 6 (Front) -> U6 Brush Portal -> UCG-Max LAN2 (Rear)`,preferred_portal_u:6,from:{instance_id:`sw-u8`,port_id:`eth6`,face:`front`},to:{instance_id:`ucg-max`,port_id:`lan2`,face:`rear`}}],external_endpoints:[{endpoint_id:`ext-isp-wan`,label:`ISP Glasfaser-ONT (2.5G WAN-Uplink)`,category:`isp-wan-uplink`,room_or_zone:`Hausanschluss / Keller (Glasfaser-Übergabepunkt)`,patch_panel_instance_id:`patch-u7`,patch_panel_port_id:`p6`,entry_position:`top-rear`,color_hex:`#EC4899`,poe_draw_watts:0,required_speed:`2.5gbe`,vlan_id:900},{endpoint_id:`ext-ap-eg`,label:`UniFi U7-Pro Wi-Fi 7 Decken-AP`,category:`wifi-ap`,room_or_zone:`Erdgeschoss Flur / Wohnbereich`,patch_panel_instance_id:`patch-u7`,patch_panel_port_id:`p7`,entry_position:`top-rear`,color_hex:`#0EA5E9`,poe_draw_watts:21,required_speed:`2.5gbe`,vlan_id:20},{endpoint_id:`ext-cam-einfahrt`,label:`4K PoE+ Überwachungskamera Einfahrt & Haustür`,category:`poe-camera`,room_or_zone:`Außenbereich Nord / Einfahrt`,patch_panel_instance_id:`patch-u7`,patch_panel_port_id:`p8`,entry_position:`top-rear`,color_hex:`#F59E0B`,poe_draw_watts:12.5,required_speed:`1gbe`,vlan_id:30},{endpoint_id:`ext-office-lan`,label:`Home-Office 2.5G Workstation-Dose`,category:`workstation-dock`,room_or_zone:`Obergeschoss Arbeitszimmer`,patch_panel_instance_id:`patch-u7`,patch_panel_port_id:`p9`,entry_position:`top-rear`,color_hex:`#14B8A6`,poe_draw_watts:0,required_speed:`2.5gbe`,vlan_id:10}]}}function Vm(e=Bm(),t=zm.toRecord()){return Bu(Hu(e,t))}function Hm(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&apos;`)}function Um(e,t=5){if(e.length===0)return``;if(e.length===1)return`M ${e[0].x} ${e[0].y}`;let n=[e[0]];for(let t=1;t<e.length;t++){let r=n[n.length-1],i=e[t],a=t===e.length-1;Math.hypot(i.x-r.x,i.y-r.y)>.4?n.push(i):a&&(n.length>=2?n[n.length-1]=i:n.push(i))}let r=[n[0]];for(let e=1;e<n.length-1;e++){let t=r[r.length-1],i=n[e],a=n[e+1],o=i.x-t.x,s=i.y-t.y,c=a.x-i.x,l=a.y-i.y,u=Math.hypot(o,s),d=Math.hypot(c,l);if(u>.5&&d>.5){let e=Math.abs(o*l-s*c)/(u*d),t=(o*c+s*l)/(u*d);if(e<.01&&t>.98)continue}r.push(i)}if(n.length>=2&&r.push(n[n.length-1]),r.length===0)return``;if(r.length===1)return`M ${r[0].x} ${r[0].y}`;let i=[`M ${r[0].x} ${r[0].y}`];for(let e=1;e<r.length-1;e++){let n=r[e-1],a=r[e],o=r[e+1],s=a.x-n.x,c=a.y-n.y,l=Math.hypot(s,c),u=o.x-a.x,d=o.y-a.y,f=Math.hypot(u,d),p=Math.min(t,l*.42,f*.42);if(p<.8){i.push(`L ${a.x} ${a.y}`);continue}let m=X(a.x-s/l*p),h=X(a.y-c/l*p),g=X(a.x+u/f*p),_=X(a.y+d/f*p);i.push(`L ${m} ${h}`),i.push(`Q ${a.x} ${a.y} ${g} ${_}`)}let a=r[r.length-1];return i.push(`L ${a.x} ${a.y}`),i.join(` `)}function Wm(e){let t=2.6,n=e=>X(e*t),r=h[e.project.rack.standard],i=e.project.rack.u_height,a=r.W_panel,o=i*p,s=e.project.rack.rail_depth_mm,c=e.project.rack.front_door_clearance_mm,l=Math.max(e.project.rack.rear_clearance_mm,55),u=c+s+l,d=n(a),f=n(o),m=80+d+110,g=m+d+110,_=n(u),v=X(g+_+80),y=X(110+f+96),b=e=>X(110+(o-e)*t),x=e=>X(g+(e+c)*t),S=new Map,C=new Map(e.geometry.devices.map(e=>[e.instance_id,e])),w=new Map(e.cable_routes.map(e=>[e.cable_id,e])),T=[];T.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v} ${y}" width="${v}" height="${y}" font-family="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">`),T.push(`<rect x="0" y="0" width="${v}" height="${y}" fill="#09090B" />`),T.push(`<text x="32" y="36" fill="#F4F4F5" font-size="16" font-weight="700">${Hm(e.project.project_name)} — 2D CAD Elevation &amp; Depth Cutaway</text>`),T.push(`<text x="32" y="58" fill="#A1A1AA" font-size="11">Standard: ${e.project.rack.standard} (${a}mm) • Height: ${i}U (${fl(o)}mm) • Rail Depth: ${s}mm • Cables: ${e.project.cables.length}</text>`);let E=(e,t,r)=>{T.push(`<text x="${X(e+r/2)}" y="94" fill="#E4E4E7" font-size="12" font-weight="700" text-anchor="middle">${Hm(t)}</text>`),T.push(`<rect x="${e-8}" y="102" width="${r+16}" height="${f+16}" rx="6" fill="#0E0E11" stroke="#3F3F46" stroke-width="2" />`);for(let t=1;t<=i;t++){let i=b(t*p),a=n(p);T.push(`<rect x="${e}" y="${i}" width="${r}" height="${a}" fill="${t%2==1?`#121216`:`#18181D`}" stroke="#27272A" stroke-width="0.9" stroke-dasharray="4,2" />`),T.push(`<text x="${e-18}" y="${X(i+a/2+4)}" fill="#A1A1AA" font-size="10" font-weight="700" text-anchor="middle">U${t}</text>`)}};E(80,`FRONT ELEVATION (Z = 0mm)`,d),E(m,`REAR ELEVATION (Z = ${s}mm, MIRRORED X)`,d),E(g,`SIDE-PROFILE DEPTH CUTAWAY (Z-Y)`,_);let D=[-50,0,50,100,150,200,s,s+50];for(let e of[...new Set(D)].filter(e=>e>=-c&&e<=s+l)){let t=x(e);T.push(`<line x1="${t}" y1="110" x2="${t}" y2="${110+f}" stroke="#27272A" stroke-width="0.8" stroke-dasharray="2,4" />`),T.push(`<text x="${t}" y="${110+f+20}" fill="#71717A" font-size="8.5" font-weight="600" text-anchor="middle">${e}mm</text>`)}if(e.project.rack.enclosure_type!==`open-frame`){let e=x(-c);T.push(`<rect x="${X(e-2)}" y="110" width="4" height="${f}" rx="1.5" fill="#3B82F6" fill-opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />`)}let O=x(0),k=x(s);T.push(`<rect x="${O}" y="110" width="5" height="${f}" fill="#3F3F46" stroke="#71717A" stroke-width="1" />`),T.push(`<rect x="${X(k-5)}" y="110" width="5" height="${f}" fill="#3F3F46" stroke="#71717A" stroke-width="1" />`);for(let t of e.geometry.devices){let e=n(t.chassis_box.max.x-t.chassis_box.min.x),r=n(t.chassis_box.max.y-t.chassis_box.min.y),i=b(t.chassis_box.max.y),o=t.mount_target===`carrier-slot`,s=t.blueprint.category===`modular-carrier`,c=s&&t.child_instance_ids.some(e=>{let t=C.get(e);return t!==void 0&&t.blueprint.category!==`keystone-module`});if(t.face===`front`){let a=X(80+n(t.chassis_box.min.x)),c=``;if(t.blueprint.category===`nas`){let o=t.blueprint.slug,s=o.includes(`8bay`)||o.includes(`rs1221`)?8:o.includes(`7bay`)||o.includes(`unas`)?7:4,l=s>4?2:1,u=X(a+n(34)),d=Math.max(n(50),e-n(52)),f=X(i+n(7)),p=Math.max(n(16),r-n(12)),m=d/4,h=p/l,g=[];for(let e=0;e<s;e++){let t=Math.floor(e/4),n=X(u+e%4*m+3),r=X(m-6),i=X(f+t*h+2.5),a=X(h-5);g.push(`<rect x="${n}" y="${i}" width="${r}" height="${a}" rx="1.5" fill="#18181B" stroke="#52525B" stroke-width="1" /><circle cx="${X(n+r-5)}" cy="${X(i+5)}" r="1.5" fill="#10B981" />`)}c=g.join(``)}else if(t.blueprint.category===`blank-panel`||t.blueprint.category===`blanking-panel`){let o=t.blueprint.slug,s=X(a+n(8)),l=Math.max(20,X(e-n(16))),u=X(i+n(4.5)),d=Math.max(8,X(r-n(9))),f=[`<rect x="${s}" y="${u}" width="${l}" height="${d}" rx="1.5" fill="#18181B" fill-opacity="0.55" stroke="#3F3F46" stroke-width="0.9" />`];if(o.includes(`-hex`)){let e=t.blueprint.geometry.u_height>=2?4:2,n=(l-12)/8,r=(d-8)/e;for(let t=0;t<e;t++){let e=X(u+4+(t+.5)*r),i=t%2==1?3:-3;for(let t=0;t<8;t++){let r=X(s+6+(t+.5)*n+i);f.push(`<circle cx="${r}" cy="${e}" r="3.4" fill="#09090B" stroke="#52525B" stroke-width="0.9" />`)}}}else if(o.includes(`-ribs`)){let e=(l-12)/12;for(let t=0;t<12;t++){let n=X(s+6+(t+.3)*e);f.push(`<rect x="${n}" y="${X(u+3)}" width="${X(e*.42)}" height="${X(d-6)}" rx="0.8" fill="#09090B" stroke="#71717A" stroke-width="0.8" />`)}}else{let e=t.blueprint.geometry.u_height>=2?6:3,n=e>1?(d-12)/(e-1):0;for(let t=0;t<e;t++){let e=X(u+6+t*n);f.push(`<line x1="${X(s+8)}" y1="${e}" x2="${X(s+l-8)}" y2="${e}" stroke="#52525B" stroke-width="2.0" stroke-linecap="round" />`)}}c=f.join(``)}else if(t.blueprint.category===`brush-panel`){let t=X(a+n(10)),o=Math.max(24,X(e-n(20))),s=X(i+n(7)),l=Math.max(8,X(r-n(14))),u=[`<rect x="${t}" y="${s}" width="${o}" height="${l}" rx="1.5" fill="#050507" stroke="#3F3F46" stroke-width="1" />`];for(let e=t+4;e<t+o-2;e+=4.5)u.push(`<line x1="${X(e)}" y1="${s+1}" x2="${X(e)}" y2="${X(s+l-1)}" stroke="#27272A" stroke-width="1" />`);c=u.join(``)}let l=t.blueprint.visuals.chassis_color_hex,u=l.replace(`#`,``),d=(u.length===6?(.2126*parseInt(u.slice(0,2),16)+.7152*parseInt(u.slice(2,4),16)+.0722*parseInt(u.slice(4,6),16))/255:.15)>.48?`#09090B`:`#E4E4E7`;T.push(`<g data-instance-id="${Hm(t.instance_id)}"><rect x="${a}" y="${i}" width="${e}" height="${r}" rx="2" fill="${l}" stroke="${o?`#3B82F6`:`#52525B`}" stroke-width="1.3" />${c}${s?``:`<text x="${a+6}" y="${i+11}" fill="${d}" font-size="8.2" font-weight="700">${Hm(t.hostname??t.instance_id)}</text>`}</g>`)}if(t.face!==`front`||t.blueprint.category!==`blank-panel`&&t.blueprint.category!==`blanking-panel`||t.ports.length!==0){let c=X(m+n(a-t.chassis_box.max.x)),l=``;if(t.blueprint.category===`brush-panel`){let t=X(c+n(10)),a=Math.max(24,X(e-n(20))),o=X(i+n(7)),s=Math.max(8,X(r-n(14))),u=[`<rect x="${t}" y="${o}" width="${a}" height="${s}" rx="1.5" fill="#050507" stroke="#3F3F46" stroke-width="1" />`];for(let e=t+4;e<t+a-2;e+=4.5)u.push(`<line x1="${X(e)}" y1="${o+1}" x2="${X(e)}" y2="${X(o+s-1)}" stroke="#27272A" stroke-width="1" />`);l=u.join(``)}let u=t.blueprint.visuals.chassis_color_hex.replace(`#`,``),d=(u.length===6?(.2126*parseInt(u.slice(0,2),16)+.7152*parseInt(u.slice(2,4),16)+.0722*parseInt(u.slice(4,6),16))/255:.15)>.45?`#09090B`:t.face===`rear`?`#F4F4F5`:`#D4D4D8`,f=!s&&e>n(40)?`<text x="${X(c+6)}" y="${X(i+10.5)}" fill="${d}" font-size="7.8" font-weight="700">${Hm(o?t.hostname??t.instance_id:`${t.hostname??t.instance_id}${t.face===`rear`?` [REAR]`:``}`)}</text>`:``;T.push(`<g data-rear-instance="${Hm(t.instance_id)}"><rect x="${c}" y="${i}" width="${e}" height="${r}" rx="2" fill="${t.blueprint.visuals.chassis_color_hex}" fill-opacity="${t.face===`rear`?`1`:`0.82`}" stroke="${t.face===`rear`?`#F59E0B`:`#3F3F46`}" stroke-width="1.2" />${l}${f}</g>`)}for(let e of t.ports){let r=b(e.world_position.y),i=Su(t,e);if(i===`front`&&t.face===`front`||e.is_passthrough_coupler&&t.face===`front`){let i=X(80+n(e.world_position.x));S.set(`${t.instance_id}:${e.port_id}:front`,{x:i,y:r,u:t.u_position,worldZ:e.world_position.z,worldY:e.world_position.y}),T.push(`<rect x="${i-4}" y="${r-3.5}" width="8" height="7" rx="1" fill="#09090B" stroke="#3B82F6" stroke-width="1.1" />`)}if(i===`rear`||e.is_passthrough_coupler){let i=X(m+n(a-e.world_position.x));S.set(`${t.instance_id}:${e.port_id}:rear`,{x:i,y:r,u:t.u_position,worldZ:e.world_position.z,worldY:e.world_position.y}),T.push(`<rect x="${i-4}" y="${r-3.5}" width="8" height="7" rx="1" fill="#09090B" stroke="#F59E0B" stroke-width="1.1" />`)}}if(t.blueprint.category!==`keystone-module`){let e=x(t.chassis_box.min.z),a=Math.max(5,n(t.chassis_box.max.z-t.chassis_box.min.z));if(s&&c){let o=Math.max(5,n(4.2)),s=Math.max(6,n(5.5));T.push(`<g data-side-instance-id="${Hm(t.instance_id)}"><rect x="${e}" y="${i}" width="${s}" height="${r}" rx="1.5" fill="#27272A" stroke="#52525B" stroke-width="1" /><rect x="${e}" y="${X(i+r-o)}" width="${a}" height="${o}" rx="1.5" fill="#27272A" stroke="#52525B" stroke-width="1" /></g>`)}else{let s=o?3:1,c=o?Math.max(5,n(4.5)):1,l=X(i+s),u=Math.max(12,X(r-s-c)),d=o?`#3B82F6`:t.face===`rear`?`#F59E0B`:`#52525B`,f=fl(t.chassis_box.max.z-t.chassis_box.min.z);T.push(`<g data-side-instance-id="${Hm(t.instance_id)}"><rect x="${e}" y="${l}" width="${a}" height="${u}" rx="2" fill="${t.blueprint.visuals.chassis_color_hex}" fill-opacity="0.9" stroke="${d}" stroke-width="1.2" />${a>60?`<rect x="${e+5}" y="${l+4}" width="${Math.min(a-10,175)}" height="15" rx="2.5" fill="#09090B" fill-opacity="0.82" /><text x="${e+10}" y="${l+14}" fill="#F4F4F5" font-size="8" font-weight="700">${Hm(`${t.hostname??t.instance_id} (${f}mm)`)}</text>`:``}</g>`)}if(t.plug_clearance_box){let e=x(t.plug_clearance_box.min.z),r=Math.max(6,n(t.plug_clearance_box.max.z-t.plug_clearance_box.min.z)),i=b(t.plug_clearance_box.max.y),a=Math.max(12,n(t.plug_clearance_box.max.y-t.plug_clearance_box.min.y));T.push(`<rect x="${e}" y="${i}" width="${r}" height="${a}" rx="2" fill="#F59E0B" fill-opacity="0.18" stroke="#F59E0B" stroke-width="1.1" stroke-dasharray="3,2" />`)}}}let A=[...new Set(e.cable_routes.map(e=>e.portal_u).filter(e=>e!==null))].sort((e,t)=>e-t);for(let t of A){if(e.geometry.devices.some(e=>e.blueprint.category===`brush-panel`&&t>=e.u_range[0]&&t<=e.u_range[1]))continue;let r=X(b(t*p)+4),i=X(Math.max(18,n(p)-8)),a=X(n(20)),o=X(Math.max(80,d-a*2));for(let[e,n]of[[`front`,80],[`rear`,m]]){let s=X(n+a);T.push(`<g data-open-portal-u="${t}" data-portal-view="${e}"><rect x="${s}" y="${r}" width="${o}" height="${i}" rx="4" fill="#121216" fill-opacity="0.72" stroke="#3B82F6" stroke-opacity="0.48" stroke-width="1.1" stroke-dasharray="5,3" /><text x="${X(s+8)}" y="${X(r+10)}" fill="#93C5FD" fill-opacity="0.92" font-size="7.4" font-weight="700" letter-spacing="0.35">U${t} OPEN CABLE PASS-THROUGH PORTAL</text></g>`)}let c=x(0),l=x(s);T.push(`<rect data-open-portal-u="${t}" data-portal-view="side" x="${c}" y="${r}" width="${X(Math.max(12,l-c))}" height="${i}" rx="3" fill="#3B82F6" fill-opacity="0.06" stroke="#3B82F6" stroke-opacity="0.32" stroke-width="1" stroke-dasharray="4,3" />`)}let j=0,M=0,N=0,P=0,F=0,I=0,L=0,R=0,z=0,ee=new Map,te=0,ne=0,re=Math.max(3,Math.floor((d-n(68))/64)),B=[];for(let t of e.project.cables){let e=C.get(t.from.instance_id),r=C.get(t.to.instance_id);if(!e||!r)continue;let i=e.parent_carrier_id?C.get(e.parent_carrier_id):void 0,a=r.parent_carrier_id?C.get(r.parent_carrier_id):void 0,o=au(e,t.from.port_id,t.from.face,i),c=au(r,t.to.port_id,t.to.face,a);if(!o||!c)continue;let l=Su(e,o,t.from.face),u=Su(r,c,t.to.face),f=Cu(t.color_hex,`svg-dark`),h=S.get(`${t.from.instance_id}:${t.from.port_id}:${l}`)??S.get(`${t.from.instance_id}:${t.from.port_id}:front`)??S.get(`${t.from.instance_id}:${t.from.port_id}:rear`),g=S.get(`${t.to.instance_id}:${t.to.port_id}:${u}`)??S.get(`${t.to.instance_id}:${t.to.port_id}:front`)??S.get(`${t.to.instance_id}:${t.to.port_id}:rear`);if(!h||!g)continue;let _=xu(t.cable_type),v=w.get(t.cable_id);if(l===u){let e=l===`front`?80:m,r=Math.abs(h.u-g.u),i;if(r<=1){if(h.u!==g.u&&Math.abs(h.x-g.x)<=2)i=[{x:h.x,y:h.y},{x:g.x,y:g.y}];else{let e=F++,t=h.u===g.u?X(Math.max(h.y,g.y)+11+e%4*3.2):X(b(Math.min(h.u,g.u)*p)+(e%7-3)*2.4);i=[{x:h.x,y:h.y},{x:h.x,y:t},{x:g.x,y:t},{x:g.x,y:g.y}]}}else{let r=t.routing_mode??`shortest-direct`,a=(h.x-e+(g.x-e))*.5,o=r===`left-duct`||r!==`right-duct`&&a<=d*.5,s,c;if(l===`front`){if(o){let t=j++;c=(t%5-2)*2.8,s=X(e+n(9)+t%9*3.6)}else{let t=M++;c=(t%5-2)*2.8,s=X(e+d-n(9)-t%9*3.6)}}else if(o){let t=N++;c=(t%5-2)*2.8,s=X(e+n(_?9:12)+t%9*3.8)}else{let t=P++;c=(t%5-2)*2.8,s=X(e+d-n(_?9:12)-t%9*3.8)}let u=g.y>=h.y?1:-1,f=X(h.y+u*9+c),p=X(g.y-u*9+c);i=[{x:h.x,y:h.y},{x:h.x,y:f},{x:s,y:f},{x:s,y:p},{x:g.x,y:p},{x:g.x,y:g.y}]}let a=Um(i,5);T.push(`<path data-cable-id="${Hm(t.cable_id)}" data-cable-view="${l}-halo" d="${a}" fill="none" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`),T.push(`<path data-cable-id="${Hm(t.cable_id)}" data-cable-view="${l}" d="${a}" fill="none" stroke="${f}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`),B.push(`<circle cx="${h.x}" cy="${h.y}" r="3.2" fill="${f}" stroke="#09090B" stroke-width="1.2" />`,`<circle cx="${g.x}" cy="${g.y}" r="3.2" fill="${f}" stroke="#09090B" stroke-width="1.2" />`)}else{let e=v?.portal_u??6,r=ee.get(e)??0;ee.set(e,r+1);let i=r%re,a=Math.floor(r/re),o=a===0?(i%2==0?-1:1)*3.6:(a%2==1?-1:1)*12,s=X(b((e-.5)*p)+o),c=l===`front`?h:g,u=l===`rear`?h:g,_=X(80+d-n(36)-i*64),y=(c.x-80+(_-80))*.5<=d*.45,x=y?I++:L++,S=X(y?80+n(11)+x%8*3.8:80+d-n(11)-x%8*3.8),C=s>=c.y?1:-1,w=X(c.y+C*9.5),E=Um([{x:c.x,y:c.y},{x:c.x,y:w},{x:S,y:w},{x:S,y:s},{x:_,y:s}],5);T.push(`<path data-cable-id="${Hm(t.cable_id)}" data-cable-view="front-halo" d="${E}" fill="none" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`),T.push(`<path data-cable-id="${Hm(t.cable_id)}" data-cable-view="front" d="${E}" fill="none" stroke="${f}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`),B.push(`<circle cx="${c.x}" cy="${c.y}" r="3.2" fill="${f}" stroke="#09090B" stroke-width="1.2" />`,`<g transform="translate(${_}, ${s})"><rect x="-46" y="-8" width="54" height="16" rx="8" fill="#09090B" stroke="${f}" stroke-width="1.3" /><circle cx="0" cy="0" r="3.8" fill="${f}" stroke="#09090B" stroke-width="1.1" /><text x="-22" y="2.8" fill="#F4F4F5" font-size="7" font-weight="700" text-anchor="middle">●-&gt;REAR</text></g>`);let D=X(m+n(36)+i*64),O=(u.x-m+(D-m))*.5<=d*.55,k=O?R++:z++,A=X(O?m+n(11)+k%8*3.8:m+d-n(11)-k%8*3.8),j=u.y>=s?1:-1,M=X(u.y-j*9.5),N=Um([{x:D,y:s},{x:A,y:s},{x:A,y:M},{x:u.x,y:M},{x:u.x,y:u.y}],5);T.push(`<path data-cable-id="${Hm(t.cable_id)}" data-cable-view="rear-halo" d="${N}" fill="none" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`),T.push(`<path data-cable-id="${Hm(t.cable_id)}" data-cable-view="rear" d="${N}" fill="none" stroke="${f}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`),B.push(`<circle cx="${u.x}" cy="${u.y}" r="3.2" fill="${f}" stroke="#09090B" stroke-width="1.2" />`,`<g transform="translate(${D}, ${s})"><rect x="-8" y="-8" width="58" height="16" rx="8" fill="#09090B" stroke="${f}" stroke-width="1.3" /><circle cx="0" cy="0" r="3.8" fill="${f}" stroke="#09090B" stroke-width="1.1" /><text x="25" y="2.8" fill="#F4F4F5" font-size="7" font-weight="700" text-anchor="middle">FRONT-&gt;●</text></g>`)}let y=x(o.world_position.z),E=b(o.world_position.y),D=x(c.world_position.z),O=b(c.world_position.y),k;if(v&&v.waypoints.length>=2)k=v.waypoints.map((e,t)=>t===0?{x:y,y:E}:t===v.waypoints.length-1?{x:D,y:O}:{x:x(e.z),y:b(e.y)});else if(l===`front`&&u===`front`){let e=x(-15-te++%6*4);k=[{x:y,y:E},{x:e,y:E},{x:e,y:O},{x:D,y:O}]}else if(l===`rear`&&u===`rear`){let e=ne++,t=x(Math.max(o.world_position.z,c.world_position.z)+12+e%5*4);k=[{x:y,y:E},{x:t,y:E},{x:t,y:O},{x:D,y:O}]}else{let e=b(((v?.portal_u??6)-.5)*p),t=x(-24),n=x(Math.min(s-18,Math.max(o.world_position.z,c.world_position.z)+18));k=l===`front`?[{x:y,y:E},{x:t,y:E},{x:t,y:e},{x:n,y:e},{x:n,y:O},{x:D,y:O}]:[{x:y,y:E},{x:n,y:E},{x:n,y:e},{x:t,y:e},{x:t,y:O},{x:D,y:O}]}let A=Um(k,5);T.push(`<path data-cable-id="${Hm(t.cable_id)}" data-cable-view="side-halo" d="${A}" fill="none" stroke="#09090B" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.86" />`),T.push(`<path data-cable-id="${Hm(t.cable_id)}" data-cable-view="side" data-start-xy="${y},${E}" data-end-xy="${D},${O}" d="${A}" fill="none" stroke="${f}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />`),B.push(`<circle class="side-cable-plug" cx="${y}" cy="${E}" r="3.0" fill="${f}" stroke="#09090B" stroke-width="1.2" />`,`<circle class="side-cable-plug" cx="${D}" cy="${O}" r="3.0" fill="${f}" stroke="#09090B" stroke-width="1.2" />`)}T.push(...B);let ie=e.project.external_endpoints??[];if(ie.length>0){T.push(`<g data-layer="external-building-drops">`);let e=Math.min(d*.65,Math.max(108,ie.length*14+36)),t=X(m+(d-e)/2),n=X(96);T.push(`<rect x="${t}" y="${n}" width="${e}" height="12" rx="3" fill="#18181D" stroke="#52525B" stroke-width="1.2" />`),T.push(`<text x="${X(m+d/2)}" y="${X(n+8.5)}" fill="#E4E4E7" font-size="7.2" font-weight="700" text-anchor="middle">TOP-REAR ISP / BUILDING CONDUIT (${ie.length}x)</text>`);let r=Math.min(s-24,Math.max(96,s*.45)),i=x(r),a=Math.max(68,ie.length*4.5+24);T.push(`<rect x="${X(i-a/2)}" y="${n}" width="${X(a)}" height="12" rx="3" fill="#18181D" stroke="#52525B" stroke-width="1.2" />`),T.push(`<text x="${i}" y="${X(n+8.5)}" fill="#E4E4E7" font-size="7" font-weight="700" text-anchor="middle">ROOF ENTRY</text>`),ie.forEach((e,t)=>{let i=Cu(e.color_hex,`svg-dark`),a=S.get(`${e.patch_panel_instance_id}:${e.patch_panel_port_id}:rear`)??S.get(`${e.patch_panel_instance_id}:${e.patch_panel_port_id}:front`);if(!a)return;let o=X(m+d/2+(t-(ie.length-1)/2)*11),s=e.entry_position===`bottom-rear`?X(110+f+10):X(n+12),c=X(a.y-10-t%3*2.8),l=Um([{x:o,y:s},{x:o,y:c},{x:a.x,y:c},{x:a.x,y:a.y}],4.5);T.push(`<path data-external-endpoint-id="${Hm(e.endpoint_id)}" data-external-view="rear" d="${l}" fill="none" stroke="${i}" stroke-width="2.1" stroke-dasharray="5,2" stroke-linecap="round" stroke-linejoin="round" />`),T.push(`<circle cx="${a.x}" cy="${a.y}" r="3.0" fill="${i}" stroke="#09090B" stroke-width="1.1" />`);let u=x(r+(t-(ie.length-1)/2)*3.6),p=x(a.worldZ),h=Um([{x:u,y:s},{x:u,y:a.y},{x:p,y:a.y}],4.5);T.push(`<path data-external-endpoint-id="${Hm(e.endpoint_id)}" data-external-view="side" d="${h}" fill="none" stroke="${i}" stroke-width="2.0" stroke-dasharray="5,2" stroke-linecap="round" stroke-linejoin="round" />`),T.push(`<circle cx="${p}" cy="${a.y}" r="2.8" fill="${i}" stroke="#09090B" stroke-width="1.1" />`)}),T.push(`</g>`)}return T.push(`</svg>`),T.join(`
`)}function Gm(e,t){return`${(t/1e3).toFixed(2)}m ${{cat6a:`Cat6A`,"cat6a-angled":`Cat6A Angled`,cat6:`Cat6`,"cat6-angled":`Cat6 Angled`,cat5e:`Cat5e`,"cat5e-angled":`Cat5e Angled`,"sfp-plus-dac":`10G DAC`,"sfp-plus-dac-angled":`10G DAC Angled`,"fiber-lc-duplex":`OM4 Fiber`,"fiber-lc-duplex-angled":`OM4 Fiber Angled`,"rj45-serial-rollover":`Serial`,"rj45-serial-rollover-angled":`Serial Angled`,"power-c13-c14":`IEC C13-C14`,"power-c13-c14-angled":`IEC C13-C14 Angled`,"power-schuko-c13":`Schuko-C13`,"power-schuko-c13-angled":`Schuko-C13 Angled`,"power-dc-5525":`DC Barrel`,"power-dc-5525-angled":`DC Barrel Angled`,"power-usb-c":`USB-C PD`,"power-usb-c-angled":`USB-C PD Angled`}[e]}`}function Km(e){let t=e.project.cables,n=new Map(e.cable_routes.map(e=>[e.cable_id,e])),r=new Map(e.geometry.devices.map(e=>[e.instance_id,e])),i=t.filter(e=>xu(e.cable_type)),a=[];for(let e of t){if(xu(e.cable_type))continue;let t=r.get(e.from.instance_id),n=r.get(e.to.instance_id);if(!t||!n)continue;let i=t.ports.find(t=>t.port_id===e.from.port_id),o=n.ports.find(t=>t.port_id===e.to.port_id),s=(t.blueprint.power_and_thermal.poe_budget_watts??0)>0||t.blueprint.power_and_thermal.electrical_role===`pse-switch`,c=o?.capabilities.some(e=>e.startsWith(`poe-in`))===!0,l=(n.blueprint.power_and_thermal.poe_budget_watts??0)>0||n.blueprint.power_and_thermal.electrical_role===`pse-switch`,u=i?.capabilities.some(e=>e.startsWith(`poe-in`))===!0;s&&c?a.push({cableId:e.cable_id,fromId:t.instance_id,toId:n.instance_id,colorHex:e.color_hex}):l&&u&&a.push({cableId:e.cable_id,fromId:n.instance_id,toId:t.instance_id,colorHex:e.color_hex})}let o=new Set;for(let e of i)o.add(e.from.instance_id),o.add(e.to.instance_id);for(let e of a)o.add(e.fromId),o.add(e.toId);for(let t of e.geometry.devices)(t.blueprint.category===`ups`||t.blueprint.category===`pdu`)&&o.add(t.instance_id);let s=new Set;for(let e of o)r.get(e)?.blueprint.category===`ups`&&s.add(e);let c=new Set,l=new Set;for(let e of i){let t=s.has(e.from.instance_id),n=s.has(e.to.instance_id);t&&!n?c.add(e.to.instance_id):n&&!t?c.add(e.from.instance_id):!t&&!n&&(r.get(e.from.instance_id)?.blueprint.category===`pdu`?l.add(e.to.instance_id):l.add(e.from.instance_id))}for(let e of a)l.add(e.toId);let u=[],d=[],f=[];for(let e of o){let t=r.get(e);t&&(t.blueprint.category===`ups`?u.push(t):t.blueprint.category===`pdu`||c.has(e)&&!l.has(e)?d.push(t):f.push(t))}u.sort((e,t)=>t.u_position-e.u_position),d.sort((e,t)=>{let n=+(e.blueprint.category===`pdu`),r=+(t.blueprint.category===`pdu`);return n===r?t.u_position-e.u_position:r-n}),f.sort((e,t)=>t.u_position-e.u_position);let p=Math.max(1,u.length,d.length,Math.ceil(f.length/2)),m=Math.max(154,62+p*58+20),h=e=>{let t=e?.blueprint.category;return t===`ups`||t===`pdu`||t===`patch-panel`||t===`switch`?`left`:`right`},g=new Map,_=new Map;for(let e of t){let t=r.get(e.from.instance_id),n=r.get(e.to.instance_id),i=h(t),a=h(n),o=!0;if(i===`left`&&a===`left`){let e=t?.blueprint.category,r=n?.blueprint.category;o=!(r===`patch-panel`&&e!==`patch-panel`||r===`ups`&&e!==`ups`)}else o=i===`left`||i===`right`&&a===`right`;let s=o?e.from:e.to,c=o?e.to:e.from,l=g.get(s.instance_id)??[];l.push({cableId:e.cable_id,instanceId:s.instance_id,portId:s.port_id,face:s.face}),g.set(s.instance_id,l);let u=_.get(c.instance_id)??[];u.push({cableId:e.cable_id,instanceId:c.instance_id,portId:c.port_id,face:c.face}),_.set(c.instance_id,u)}let v=e=>[...e.entries()].sort((e,t)=>{let n=r.get(e[0]);return(r.get(t[0])?.u_position??0)-(n?.u_position??0)}),y=364+(312+Math.max(1,t.length)*15+28),b=Math.max(1420,y+324+40),x=80+m+22,S=new Map,C=(e,t,n)=>{let i=[],a=x+52;for(let[o,s]of e){let e=r.get(o),c=e?`${e.hostname??e.blueprint.model}`:o,l=e?e.mount_target===`carrier-slot`?`U${e.u_position} SLOT`:`U${e.u_position} ${e.face.toUpperCase()}`:`DEVICE`,u=e?`${l} • ${o} • ${e.blueprint.category}`:o,d=38+s.length*28+8,f=X(t===`left`?n+324:n),p=s.map((n,r)=>{let i=X(a+38+r*28+14),o=e?.ports.find(e=>e.port_id===n.portId),s=o?.capabilities[0]??o?.connector_type??`port`,c={cableId:n.cableId,instanceId:n.instanceId,portId:n.portId,capabilityBadge:String(s),pinX:f,pinY:i};return S.set(`${n.cableId}:${t}`,c),c});i.push({instanceId:o,title:c,subtitle:u,column:t,cardX:n,cardY:a,cardW:324,cardH:d,pins:p}),a+=d+16}return{cards:i,height:Math.max(180,a-x+18)}},w=C(v(g),`left`,40),T=C(v(_),`right`,y),E=Math.max(w.height,T.height),D=X(x+E+36),O=[];O.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${b} ${D}" width="${b}" height="${D}" font-family="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">`),O.push(`<rect x="0" y="0" width="${b}" height="${D}" fill="#09090B" />`),O.push(`<text x="32" y="34" fill="#F4F4F5" font-size="16" font-weight="700">${Hm(e.project.project_name)} — Power Distribution DAG &amp; Multi-Track Wiring Plan</text>`),O.push(`<text x="32" y="55" fill="#A1A1AA" font-size="11">Total System Draw: ${fl(e.validation.power_summary.total_system_watts)}W • PoE Load: ${fl(e.validation.power_summary.total_poe_watts)}W • Active Cables: ${t.length} • Validation: ${e.validation.status}</text>`),O.push(`<g data-section="power-dag">`),O.push(`<rect x="24" y="80" width="${b-48}" height="${m}" rx="8" fill="#0E0E11" stroke="#27272A" stroke-width="1.4" />`),O.push(`<text x="44" y="106" fill="#E4E4E7" font-size="12" font-weight="700" letter-spacing="0.3">SECTION 1: POWER DISTRIBUTION TOPOLOGY (UPS -&gt; PDU -&gt; COMPUTE &amp; NETWORK LOADS)</text>`);let k=new Map,A=(e,t,n,r,i,a,o)=>{k.set(e,{x:r,y:i,w:a,h:44}),O.push(`<g data-dag-node="${Hm(e)}"><rect x="${r}" y="${i}" width="${a}" height="44" rx="5" fill="#121216" stroke="#27272A" stroke-width="1.2" /><line x1="${r}" y1="${i+4}" x2="${r}" y2="${i+44-4}" stroke="${o}" stroke-width="3" stroke-linecap="round" /><text x="${r+12}" y="${i+18}" fill="#F4F4F5" font-size="9.8" font-weight="700">${Hm(t.slice(0,34))}</text><text x="${r+12}" y="${i+33}" fill="#A1A1AA" font-size="8.4">${Hm(n.slice(0,38))}</text></g>`)};u.length===0?A(`__mains__`,`230V AC Mains Feed`,`Facility Grid Supply`,48,128,240,`#10B981`):u.forEach((e,t)=>{A(e.instance_id,`${e.hostname??e.blueprint.model}`,`U${e.u_position} UPS • ${e.instance_id}`,48,126+t*56,268,`#10B981`)}),d.forEach((e,t)=>{let n=e.blueprint.category===`pdu`,r=e.blueprint.power_and_thermal.poe_budget_watts??0,i=r>0||e.blueprint.power_and_thermal.electrical_role===`pse-switch`,a=n?`${e.face.toUpperCase()} PDU`:i?`PoE PSE (${r}W)`:`${e.blueprint.power_and_thermal.max_system_watts}W Direct UPS`;A(e.instance_id,`${e.hostname??e.blueprint.model}`,`U${e.u_position} ${a} • ${e.instance_id}`,430,126+t*56,292,n?`#F59E0B`:i?`#06B6D4`:`#3B82F6`)}),f.forEach((e,t)=>{let n=t%2,r=Math.floor(t/2),i=840+n*288,o=126+r*56,s=a.some(t=>t.toId===e.instance_id);A(e.instance_id,`${e.hostname??e.blueprint.model}`,`U${e.u_position} • ${e.blueprint.power_and_thermal.max_system_watts}W max${s?` (PoE PD)`:``}`,i,o,268,s?`#10B981`:`#3B82F6`)}),[...i.map(e=>({id:e.cable_id,fromId:e.from.instance_id,toId:e.to.instance_id,colorHex:e.color_hex,isPoe:!1})),...a.map(e=>({id:e.cableId,fromId:e.fromId,toId:e.toId,colorHex:e.colorHex,isPoe:!0}))].forEach((e,t)=>{let n=k.get(e.fromId),r=k.get(e.toId);if(!n||!r)return;let i=n.x<=r.x?n:r,a=n.x<=r.x?r:n,o=X(i.x+i.w),s=X(i.y+13+t%4*6),c=X(a.x),l=X(a.y+13+t%4*6),u=X(o+((a.x>900?836:a.x)-o)*(.28+t%6/6*.56)),d=Cu(e.colorHex,`svg-dark`),f=Um(a.x>900?[{x:o,y:s},{x:u,y:s},{x:u,y:X(a.y-6.5+t%2*2.5)},{x:X(a.x-11+t%3*2.5),y:X(a.y-6.5+t%2*2.5)},{x:X(a.x-11+t%3*2.5),y:l},{x:c,y:l}]:[{x:o,y:s},{x:u,y:s},{x:u,y:l},{x:c,y:l}],5);O.push(`<path data-power-edge="${Hm(e.id)}" d="${f}" fill="none" stroke="${d}" stroke-width="2" ${e.isPoe?``:`stroke-dasharray="5,2.5" `}opacity="0.92" />`),O.push(`<circle cx="${o}" cy="${s}" r="2.8" fill="${d}" stroke="#09090B" stroke-width="1" /><circle cx="${c}" cy="${l}" r="2.8" fill="${d}" stroke="#09090B" stroke-width="1" />`)}),O.push(`</g>`),O.push(`<g data-section="port-to-port-schematic">`),O.push(`<rect x="24" y="${x}" width="${b-48}" height="${E}" rx="8" fill="#0E0E11" stroke="#27272A" stroke-width="1.4" />`),O.push(`<text x="44" y="${x+28}" fill="#E4E4E7" font-size="12" font-weight="700" letter-spacing="0.3">SECTION 2: PORT-TO-PORT PATCH &amp; POWER SCHEMATIC (GROUPED DEVICE CARDS &amp; MULTI-TRACK ROUTER)</text>`);let j=e=>{for(let t of e){let e=t.column===`left`;O.push(`<g data-schematic-device="${Hm(t.instanceId)}">`),O.push(`<rect x="${t.cardX}" y="${t.cardY}" width="${t.cardW}" height="${t.cardH}" rx="6" fill="#121216" stroke="#27272A" stroke-width="1.4" />`),O.push(`<rect x="${t.cardX}" y="${t.cardY}" width="${t.cardW}" height="38" rx="6" fill="#18181D" stroke="#27272A" stroke-width="1" />`),O.push(`<text x="${t.cardX+12}" y="${t.cardY+16}" fill="#F4F4F5" font-size="10.2" font-weight="700">${Hm(t.title.slice(0,38))}</text>`),O.push(`<text x="${t.cardX+12}" y="${t.cardY+30}" fill="#A1A1AA" font-size="8.6">${Hm(t.subtitle.slice(0,44))}</text>`);for(let n of t.pins){let r=X(n.pinY-14),i=X(e?n.pinX-16:n.pinX+16),a=e?`end`:`start`,o=X(e?t.cardX+10:t.cardX+t.cardW-92-10);O.push(`<line x1="${t.cardX+6}" y1="${r}" x2="${t.cardX+t.cardW-6}" y2="${r}" stroke="#27272A" stroke-width="0.7" />`),O.push(`<rect x="${o}" y="${X(n.pinY-7.5)}" width="92" height="15" rx="3" fill="#09090B" stroke="#3F3F46" stroke-width="0.8" />`),O.push(`<text x="${X(o+46)}" y="${X(n.pinY+3)}" fill="#A1A1AA" font-size="7.4" font-weight="600" text-anchor="middle">${Hm(n.capabilityBadge.slice(0,15))}</text>`),O.push(`<text x="${i}" y="${X(n.pinY+3.5)}" fill="#F4F4F5" font-size="9.6" font-weight="700" text-anchor="${a}">${Hm(n.portId)}</text>`),O.push(`<circle cx="${n.pinX}" cy="${n.pinY}" r="3.8" fill="#18181D" stroke="#52525B" stroke-width="1.3" />`)}O.push(`</g>`)}};j(w.cards),j(T.cards);let M=X(676);for(let e=0;e<t.length;e++){let r=t[e],i=S.get(`${r.cable_id}:left`),a=S.get(`${r.cable_id}:right`);if(!i||!a)continue;let o=n.get(r.cable_id)?.recommended_commercial_mm??500,s=Gm(r.cable_type,o),c=Cu(r.color_hex,`svg-dark`),l=X(M+e*15),u=Um([{x:i.pinX,y:i.pinY},{x:l,y:i.pinY},{x:l,y:a.pinY},{x:a.pinX,y:a.pinY}],7.5);O.push(`<path d="${u}" fill="none" stroke="#09090B" stroke-width="4.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.82" />`),O.push(`<path data-schematic-cable="${Hm(r.cable_id)}" d="${u}" fill="none" stroke="${c}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />`),O.push(`<circle cx="${i.pinX}" cy="${i.pinY}" r="3.2" fill="${c}" stroke="#09090B" stroke-width="1" />`),O.push(`<circle cx="${a.pinX}" cy="${a.pinY}" r="3.2" fill="${c}" stroke="#09090B" stroke-width="1" />`);let d=[];r.vlan_id!==void 0&&d.push(`VLAN${r.vlan_id}`),r.ip_cidr!==void 0&&d.push(r.ip_cidr);let f=d.length>0?` • ${d.join(` `)}`:``,p=`${r.cable_id} | ${s}${f}`,m=f.length>0?292:244,h=X(i.pinX+12),g=X(i.pinY-9);O.push(`<rect x="${h}" y="${g}" width="${m}" height="18" rx="9" fill="#09090B" stroke="${c}" stroke-width="1.25" />`),O.push(`<text x="${X(h+m/2)}" y="${X(i.pinY+3)}" fill="#F4F4F5" font-size="8.2" font-weight="600" text-anchor="middle">${Hm(p.slice(0,46))}</text>`)}return O.push(`</g>`),O.push(`</svg>`),O.join(`
`)}function qm(e){let t=[];t.push(`# Bill of Materials & Assembly Guide — ${e.project.project_name}`),t.push(``),t.push(`- **Validation Status:** \`${e.validation.status}\` (${e.validation.error_count} Errors, ${e.validation.warning_count} Warnings)`),t.push(`- **Total Power Load:** \`${fl(e.validation.power_summary.total_system_watts)} W\` (PoE: \`${fl(e.validation.power_summary.total_poe_watts)} W\`)`),t.push(`- **Total Weight:** \`${fl(e.validation.mechanical_summary.total_weight_grams/1e3)} kg\``),t.push(`- **Thermal & Acoustics:** \`${fl(e.validation.mechanical_summary.total_thermal_btu_hr)} BTU/hr\` • \`${fl(e.validation.mechanical_summary.combined_noise_db_a)} dB(A)\` (\`${e.validation.mechanical_summary.airflow_profile}\`)`),t.push(``),t.push(`## Mounted Hardware & Sub-Modules`);for(let n of e.geometry.devices)t.push(`- **U${n.u_position} [${n.face.toUpperCase()}]** \`${n.instance_id}\` (${n.hostname??n.blueprint.model}) — \`${n.blueprint_slug}\``);t.push(``),t.push(`## Cable Patch Schedule`);for(let n of e.cable_routes){let r=e.project.cables.find(e=>e.cable_id===n.cable_id);if(!r)continue;let i=xu(r.cable_type)?`POWER`:`DATA`,a=r.vlan_id===void 0?``:` [VLAN ${r.vlan_id}${r.ip_cidr?` ${r.ip_cidr}`:``}]`;t.push(`- \`${r.cable_id}\` [${i}]${a} \`${r.from.instance_id}:${r.from.port_id}\` -> \`${r.to.instance_id}:${r.to.port_id}\` (${(n.recommended_commercial_mm/1e3).toFixed(2)}m \`${r.cable_type}\`)`)}if((e.project.external_endpoints??[]).length>0){t.push(``),t.push(`## External Building & ISP Cable Drops (Top-Rear Entry)`);for(let n of e.project.external_endpoints){let e=n.poe_draw_watts>0?`PoE ${n.poe_draw_watts}W`:`Non-PoE`,r=n.room_or_zone?` (${n.room_or_zone})`:``;t.push(`- **${n.label}**${r} [\`${n.category}\`, ${e}, \`${n.entry_position}\`] -> \`${n.patch_panel_instance_id}:${n.patch_panel_port_id}\` (REAR)`)}}return t.join(`
`)}function Jm(e,t=`10inch`){let n=e.mount_type===`rackmount-19`?`19inch`:e.mount_type===`rackmount-6`?`6inch`:e.mount_type===`rackmount-10`?`10inch`:t,r=h[n],i=Math.max(1,Math.round(e.geometry.u_height||1)),a=X(r.W_panel),o=X(r.W_aperture),s=X(r.W_holes),c=X(e.slots.length===0&&e.geometry.height_mm<38?i*p-.75:e.geometry.height_mm||i*44.45-.75),l=X((a-o)/2);if(e.category===`blank-panel`||e.category===`blanking-panel`){let t=e.slug,r=t.includes(`-hex`)?`hex`:t.includes(`-ribs`)?`ribs`:t.includes(`-lines`)?`lines`:`bevel`,u=X(Math.max(6,e.geometry.depth_mm)),d=X(l+10),f=X(o-20),p=[];if(p.push(`// ============================================================================`),p.push(`// RackArchitect MCP — Parametric 3D-Printable Slot Cover Panel (.scad)`),p.push(`// Blueprint: ${e.manufacturer} ${e.model} (${e.slug})`),p.push(`// Standard:  ${n.toUpperCase()} EIA-310 (${a}mm Total Width, ${i}U = ${c}mm)`),p.push(`// Pattern:   ${r.toUpperCase()} (Closed Front Faceplate — Zero Cable Pass-Through)`),p.push(`// Material:  ${e.printable_metadata?.material_recommendation??`PETG / PLA / ASA`}`),p.push(`// ============================================================================`),p.push(``),p.push(`panel_width_mm = ${a};`),p.push(`aperture_width_mm = ${o};`),p.push(`hole_center_pitch_x_mm = ${s};`),p.push(`panel_height_mm = ${c};`),p.push(`u_count = ${i};`),p.push(`faceplate_thickness_mm = 4.2;`),p.push(`stiffener_depth_mm = ${u};`),p.push(`stiffener_wall_mm = 3.2;`),p.push(`pattern_groove_depth_mm = 1.4;`),p.push(`$fn = 36;`),p.push(``),p.push(`module oval_mounting_slot(slot_w = 10.0, slot_h = 6.5, thickness = 10.0) {`),p.push(`  hull() {`),p.push(`    translate([-(slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`),p.push(`    translate([ (slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`),p.push(`  }`),p.push(`}`),p.push(``),p.push(`module eia310_ear_holes() {`),p.push(`  left_hole_x = (panel_width_mm - hole_center_pitch_x_mm) / 2;`),p.push(`  right_hole_x = panel_width_mm - left_hole_x;`),p.push(`  for (u = [0 : u_count - 1]) {`),p.push(`    base_y = u * 44.45;`),p.push(`    for (offset_y = [6.35, 22.225, 38.10]) {`),p.push(`      if (base_y + offset_y < panel_height_mm - 3.0) {`),p.push(`        translate([left_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`),p.push(`        translate([right_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`),p.push(`      }`),p.push(`    }`),p.push(`  }`),p.push(`}`),p.push(``),p.push(`module slot_bay_cutouts() {`),r===`lines`){let e=i*3,t=e>1?(c-16)/(e-1):0;for(let n=0;n<e;n++)p.push(`  translate([${d}, ${X(8+n*t-1.2)}, -0.5]) cube([${f}, 2.4, pattern_groove_depth_mm + 0.5]);`)}else if(r===`hex`){let e=i*2,t=Math.max(5,Math.min(14,Math.floor(f/20))),n=X(f/t),r=X((c-12)/e);for(let i=0;i<e;i++){let e=X(6+(i+.5)*r),a=i%2==1?X(n*.25):-X(n*.25);for(let i=0;i<t;i++){let t=X(d+(i+.5)*n+a);p.push(`  translate([${t}, ${e}, -0.5]) cylinder(d = ${X(Math.min(n,r)*.68)}, h = pattern_groove_depth_mm + 0.5, $fn = 6);`)}}}else if(r===`ribs`){let e=Math.max(8,Math.min(20,Math.floor(f/14))),t=f/e,n=X(Math.max(3,t*.45));for(let r=0;r<e;r++)p.push(`  translate([${X(d+(r+.5)*t-n/2)}, 6.0, -0.5]) cube([${n}, ${X(c-12)}, pattern_groove_depth_mm + 0.5]);`)}else p.push(`  translate([${d}, ${X(c/2-1.2)}, -0.5]) cube([${f}, 2.4, pattern_groove_depth_mm + 0.5]);`);return p.push(`}`),p.push(``),p.push(`union() {`),p.push(`  difference() { cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]); eia310_ear_holes(); slot_bay_cutouts(); }`),p.push(`  translate([${l}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`),p.push(`  translate([${l}, panel_height_mm - stiffener_wall_mm, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`),p.push(`  translate([${l}, 0, faceplate_thickness_mm]) cube([stiffener_wall_mm, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`),p.push(`  translate([${l} + aperture_width_mm - stiffener_wall_mm, 0, faceplate_thickness_mm]) cube([stiffener_wall_mm, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`),p.push(`}`),p.join(`
`)}let u=e.slots.length>0?e.slots:e.geometry.height_mm<38?[{slot_id:`${e.slug}-cradle-bay`,accepted_slot_type:`desktop-switch-cradle`,offset_mm:{x:X((a-e.geometry.width_mm)/2),y:3.2,z:0},max_dimensions_mm:{width:e.geometry.width_mm,height:e.geometry.height_mm,depth:e.geometry.depth_mm}}]:[],d=X(Math.max(40,e.geometry.depth_mm)),f=[];f.push(`// ============================================================================`),f.push(`// RackArchitect MCP — Parametric 3D-Printable Rack Carrier (.scad)`),f.push(`// Blueprint: ${e.manufacturer} ${e.model} (${e.slug})`),f.push(`// Standard:  ${t.toUpperCase()} EIA-310 (${a}mm Total Width, ${i}U = ${c}mm)`),f.push(`// Material:  ${e.printable_metadata?.material_recommendation??`PETG / ABS / ASA (4 Perimeters, 25% Gyroid Infill)`}`),f.push(`// ============================================================================`),f.push(``),f.push(`panel_width_mm = ${a};`),f.push(`aperture_width_mm = ${o};`),f.push(`hole_center_pitch_x_mm = ${s};`),f.push(`panel_height_mm = ${c};`),f.push(`u_count = ${i};`),f.push(`faceplate_thickness_mm = 4.2;`),f.push(`tray_depth_mm = ${d};`),f.push(`tray_floor_thickness_mm = 3.2;`),f.push(`side_gusset_thickness_mm = 3.5;`),f.push(`print_tolerance_mm = 0.35;`),f.push(`$fn = 36;`),f.push(``),f.push(`module oval_mounting_slot(slot_w = 10.0, slot_h = 6.5, thickness = 10.0) {`),f.push(`  hull() {`),f.push(`    translate([-(slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`),f.push(`    translate([ (slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`),f.push(`  }`),f.push(`}`),f.push(``),f.push(`module eia310_ear_holes() {`),f.push(`  left_hole_x = (panel_width_mm - hole_center_pitch_x_mm) / 2;`),f.push(`  right_hole_x = panel_width_mm - left_hole_x;`),f.push(`  for (u = [0 : u_count - 1]) {`),f.push(`    base_y = u * 44.45;`),f.push(`    for (offset_y = [6.35, 22.225, 38.10]) {`),f.push(`      if (base_y + offset_y < panel_height_mm - 3.0) {`),f.push(`        translate([left_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`),f.push(`        translate([right_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`),f.push(`      }`),f.push(`    }`),f.push(`  }`),f.push(`}`),f.push(``),f.push(`module slot_bay_cutouts() {`);for(let e of u)f.push(`  translate([${X(e.offset_mm.x)} - print_tolerance_mm, ${X(e.offset_mm.y)} - print_tolerance_mm, -1.0]) cube([${X(e.max_dimensions_mm.width)} + 2 * print_tolerance_mm, ${X(e.max_dimensions_mm.height)} + 2 * print_tolerance_mm, faceplate_thickness_mm + 2.0]);`);f.push(`}`),f.push(``),f.push(`module slot_retention_rails() {`);for(let e of u){if(e.accepted_slot_type===`standard-keystone`)continue;let t=X(e.offset_mm.x),n=X(e.offset_mm.y),r=X(e.max_dimensions_mm.width),i=X(Math.min(d-6,e.max_dimensions_mm.depth)),a=X(Math.min(c,Math.max(8,n+6)));f.push(`  translate([${t} - print_tolerance_mm - 2.2, 0, faceplate_thickness_mm]) cube([2.2, ${a}, ${i}]);`),f.push(`  translate([${X(t+r)} + print_tolerance_mm, 0, faceplate_thickness_mm]) cube([2.2, ${a}, ${i}]);`)}return f.push(`}`),f.push(``),f.push(`module honeycomb_vent_cutouts() {`),f.push(`  tray_x0 = ${l} + 14;`),f.push(`  tray_x1 = panel_width_mm - ${l} - 14;`),f.push(`  for (z = [24 : 22 : tray_depth_mm - 18]) {`),f.push(`    for (x = [tray_x0 : 22 : tray_x1]) {`),f.push(`      translate([x, -1.0, z]) rotate([-90, 0, 0]) cylinder(d = 14, h = tray_floor_thickness_mm + 2.0, $fn = 6);`),f.push(`    }`),f.push(`  }`),f.push(`}`),f.push(``),f.push(`union() {`),f.push(`  difference() { cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]); eia310_ear_holes(); slot_bay_cutouts(); }`),f.push(`  difference() { translate([${l}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, tray_floor_thickness_mm, tray_depth_mm - faceplate_thickness_mm]); honeycomb_vent_cutouts(); }`),f.push(`  translate([${l}, 0, faceplate_thickness_mm]) cube([side_gusset_thickness_mm, panel_height_mm * 0.65, tray_depth_mm - faceplate_thickness_mm]);`),f.push(`  translate([${l} + aperture_width_mm - side_gusset_thickness_mm, 0, faceplate_thickness_mm]) cube([side_gusset_thickness_mm, panel_height_mm * 0.65, tray_depth_mm - faceplate_thickness_mm]);`),f.push(`  slot_retention_rails();`),f.push(`}`),f.join(`
`)}function Ym(e){return{x0:X(Math.min(e.x0,e.x1)),y0:X(Math.min(e.y0,e.y1)),z0:X(Math.min(e.z0,e.z1)),x1:X(Math.max(e.x0,e.x1)),y1:X(Math.max(e.y0,e.y1)),z1:X(Math.max(e.z0,e.z1))}}function Xm(e,t,n,r){return e>r.x0&&e<r.x1&&t>r.y0&&t<r.y1&&n>r.z0&&n<r.z1}function Zm(e){let t=[...e].map(e=>X(e)).sort((e,t)=>e-t),n=[];for(let e of t){let t=n[n.length-1];(t===void 0||Math.abs(e-t)>.001)&&n.push(e)}return n}function Qm(e,t=`10inch`){let n=h[e.mount_type===`rackmount-19`?`19inch`:e.mount_type===`rackmount-6`?`6inch`:e.mount_type===`rackmount-10`?`10inch`:t],r=Math.max(1,Math.round(e.geometry.u_height||1)),i=X(n.W_panel),a=X(n.W_aperture),o=X(n.W_holes),s=X(e.slots.length===0&&e.geometry.height_mm<38?r*p-.75:e.geometry.height_mm||r*44.45-.75),c=e.category===`blank-panel`||e.category===`blanking-panel`,l=c?[]:e.slots.length>0?e.slots:e.geometry.height_mm<38?[{slot_id:`${e.slug}-cradle-bay`,accepted_slot_type:`desktop-switch-cradle`,offset_mm:{x:X((i-e.geometry.width_mm)/2),y:3.2,z:0},max_dimensions_mm:{width:e.geometry.width_mm,height:e.geometry.height_mm,depth:e.geometry.depth_mm}}]:[],u=4.2,d=3.2,f=3.5,m=.35,g=X(Math.max(c?6:40,e.geometry.depth_mm)),_=X((i-a)/2),v=Ym({x0:0,y0:0,z0:0,x1:i,y1:s,z1:u}),y=Ym({x0:_,y0:0,z0:u,x1:i-_,y1:d,z1:g}),b=c?Ym({x0:_,y0:X(s-d),z0:u,x1:i-_,y1:s,z1:g}):null,x=c?s:X(s*.65),S=[Ym({x0:_,y0:0,z0:u,x1:_+f,y1:x,z1:g}),Ym({x0:i-_-f,y0:0,z0:u,x1:i-_,y1:x,z1:g})],C=X((i-o)/2),w=X(i-C),T=[];for(let e=0;e<r;e++){let t=e*p;for(let e of[6.35,22.225,38.1]){let n=X(t+e);n+3.25<s-1.5&&n-3.25>1.5&&T.push(Ym({x0:Math.max(1.2,C-5),y0:n-3.25,z0:-1,x1:Math.min(_-1.2,C+5),y1:n+3.25,z1:5.2}),Ym({x0:Math.max(i-_+1.2,w-5),y0:n-3.25,z0:-1,x1:Math.min(i-1.2,w+5),y1:n+3.25,z1:5.2}))}}let E=[];if(c){let t=e.slug,n=t.includes(`-hex`)?`hex`:t.includes(`-ribs`)?`ribs`:t.includes(`-lines`)?`lines`:`bevel`,a=X(_+10),o=X(i-_-10),c=X(o-a),l=1.4;if(n===`lines`){let e=r*3,t=e>1?(s-16)/(e-1):0;for(let n=0;n<e;n++){let e=X(8+n*t-1.2);E.push(Ym({x0:a,y0:e,z0:-1,x1:o,y1:X(e+2.4),z1:l}))}}else if(n===`hex`){let e=r*2,t=Math.max(5,Math.min(10,Math.floor(c/24))),n=c/t,i=(s-12)/e,u=X(n*.62),d=X(i*.6);for(let r=0;r<e;r++){let e=6+(r+.5)*i,s=r%2==1?n*.16:-n*.16;for(let r=0;r<t;r++){let t=a+(r+.5)*n+s,i=X(Math.max(a,t-u/2)),c=X(Math.min(o,t+u/2)),f=X(e-d/2),p=X(e+d/2);c-i>=3&&p-f>=3&&E.push(Ym({x0:i,y0:f,z0:-1,x1:c,y1:p,z1:l}))}}}else if(n===`ribs`){let e=Math.max(8,Math.min(14,Math.floor(c/16))),t=c/e,n=X(Math.max(3,t*.45));for(let r=0;r<e;r++){let e=X(a+(r+.5)*t-n/2);E.push(Ym({x0:e,y0:6,z0:-1,x1:X(e+n),y1:X(s-6),z1:l}))}}else E.push(Ym({x0:a,y0:X(s/2-1.2),z0:-1,x1:o,y1:X(s/2+1.2),z1:l}))}let D=[],O=[];for(let e of l){let t=X(Math.max(_+1,e.offset_mm.x-m)),n=X(Math.min(i-_-1,e.offset_mm.x+e.max_dimensions_mm.width+m)),r=X(Math.max(1.2,e.offset_mm.y-m)),a=X(Math.min(s-1.2,e.offset_mm.y+e.max_dimensions_mm.height+m));if(n>t&&a>r&&D.push(Ym({x0:t,y0:r,z0:-1,x1:n,y1:a,z1:5.2})),e.accepted_slot_type!==`standard-keystone`){let r=X(Math.min(g-6,e.max_dimensions_mm.depth)),a=X(Math.min(s,Math.max(8,e.offset_mm.y+6))),o=X(Math.max(_+f,t-2.2));t-o>=1&&O.push(Ym({x0:o,y0:0,z0:u,x1:t,y1:a,z1:u+r}));let c=X(Math.min(i-_-f,n+2.2));c-n>=1&&O.push(Ym({x0:n,y0:0,z0:u,x1:c,y1:a,z1:u+r}))}}let k=[];if(!c){let e=X(_+f+10),t=X(i-_-f-10);for(let n=20;n+12<=g-12;n+=22)for(let r=e;r+12<=t;r+=22){let e=X(r),t=X(r+12),i=X(n),a=X(n+12);O.some(n=>t>n.x0-2&&e<n.x1+2&&a>n.z0-2&&i<n.z1+2)||k.push(Ym({x0:e,y0:-1,z0:i,x1:t,y1:4.2,z1:a}))}}let A=[v,y,...b?[b]:[],...S,...T,...E,...D,...O,...k],j=Zm(A.flatMap(e=>[e.x0,e.x1]).filter(e=>e>=0&&e<=i)),M=Zm(A.flatMap(e=>[e.y0,e.y1]).filter(e=>e>=0&&e<=s)),N=Zm(A.flatMap(e=>[e.z0,e.z1]).filter(e=>e>=0&&e<=g)),P=j.length-1,F=M.length-1,I=N.length-1,L=(e,t,n)=>{if(e<0||e>=P||t<0||t>=F||n<0||n>=I)return!1;let r=j[e],i=j[e+1],a=M[t],o=M[t+1],s=N[n],c=N[n+1],l=.5*(r+i),u=.5*(a+o),d=.5*(s+c),f=Xm(l,u,d,v)&&!T.some(e=>Xm(l,u,d,e))&&!E.some(e=>Xm(l,u,d,e))&&!D.some(e=>Xm(l,u,d,e)),p=Xm(l,u,d,y)&&!k.some(e=>Xm(l,u,d,e)),m=b!==null&&Xm(l,u,d,b),h=S.some(e=>Xm(l,u,d,e)),g=O.some(e=>Xm(l,u,d,e));return f||p||m||h||g},R=[];for(let e=0;e<P;e++){let t=[];for(let n=0;n<F;n++){let r=[];for(let t=0;t<I;t++)r.push(L(e,n,t));t.push(r)}R.push(t)}let z=(e,t,n)=>R[e]?.[t]?.[n]??!1,ee=e.slug.replace(/[^a-zA-Z0-9_-]/g,`_`),te=[`solid ${ee}`],ne=(e,t,n,r,i,a)=>{te.push(`  facet normal ${e} ${t} ${n}`),te.push(`    outer loop`),te.push(`      vertex ${r[0]} ${r[1]} ${r[2]}`),te.push(`      vertex ${i[0]} ${i[1]} ${i[2]}`),te.push(`      vertex ${a[0]} ${a[1]} ${a[2]}`),te.push(`    endloop`),te.push(`  endfacet`)};for(let e=0;e<P;e++){let t=j[e],n=j[e+1];for(let r=0;r<F;r++){let i=M[r],a=M[r+1];for(let o=0;o<I;o++){if(!z(e,r,o))continue;let s=N[o],c=N[o+1];z(e,r,o-1)||(ne(0,0,-1,[t,i,s],[t,a,s],[n,a,s]),ne(0,0,-1,[t,i,s],[n,a,s],[n,i,s])),z(e,r,o+1)||(ne(0,0,1,[t,i,c],[n,i,c],[n,a,c]),ne(0,0,1,[t,i,c],[n,a,c],[t,a,c])),z(e,r-1,o)||(ne(0,-1,0,[t,i,s],[n,i,s],[n,i,c]),ne(0,-1,0,[t,i,s],[n,i,c],[t,i,c])),z(e,r+1,o)||(ne(0,1,0,[t,a,s],[t,a,c],[n,a,c]),ne(0,1,0,[t,a,s],[n,a,c],[n,a,s])),z(e-1,r,o)||(ne(-1,0,0,[t,i,s],[t,i,c],[t,a,c]),ne(-1,0,0,[t,i,s],[t,a,c],[t,a,s])),z(e+1,r,o)||(ne(1,0,0,[n,i,s],[n,a,s],[n,a,c]),ne(1,0,0,[n,i,s],[n,a,c],[n,i,c]))}}}return te.push(`endsolid ${ee}`),te.join(`
`)}var $m={A:[`.###.`,`#...#`,`#...#`,`#####`,`#...#`,`#...#`,`#...#`],B:[`####.`,`#...#`,`#...#`,`####.`,`#...#`,`#...#`,`####.`],C:[`.####`,`#....`,`#....`,`#....`,`#....`,`#....`,`.####`],D:[`####.`,`#...#`,`#...#`,`#...#`,`#...#`,`#...#`,`####.`],E:[`#####`,`#....`,`#....`,`####.`,`#....`,`#....`,`#####`],F:[`#####`,`#....`,`#....`,`####.`,`#....`,`#....`,`#....`],G:[`.####`,`#....`,`#....`,`#..##`,`#...#`,`#...#`,`.####`],H:[`#...#`,`#...#`,`#...#`,`#####`,`#...#`,`#...#`,`#...#`],I:[`.###.`,`..#..`,`..#..`,`..#..`,`..#..`,`..#..`,`.###.`],J:[`..###`,`...#.`,`...#.`,`...#.`,`#..#.`,`#..#.`,`.##..`],K:[`#...#`,`#..#.`,`#.#..`,`##...`,`#.#..`,`#..#.`,`#...#`],L:[`#....`,`#....`,`#....`,`#....`,`#....`,`#....`,`#####`],M:[`#...#`,`##.##`,`#.#.#`,`#...#`,`#...#`,`#...#`,`#...#`],N:[`#...#`,`##..#`,`#.#.#`,`#..##`,`#...#`,`#...#`,`#...#`],O:[`.###.`,`#...#`,`#...#`,`#...#`,`#...#`,`#...#`,`.###.`],P:[`####.`,`#...#`,`#...#`,`####.`,`#....`,`#....`,`#....`],Q:[`.###.`,`#...#`,`#...#`,`#...#`,`#.#.#`,`#..#.`,`.##.#`],R:[`####.`,`#...#`,`#...#`,`####.`,`#.#..`,`#..#.`,`#...#`],S:[`.####`,`#....`,`#....`,`.###.`,`....#`,`....#`,`####.`],T:[`#####`,`..#..`,`..#..`,`..#..`,`..#..`,`..#..`,`..#..`],U:[`#...#`,`#...#`,`#...#`,`#...#`,`#...#`,`#...#`,`.###.`],V:[`#...#`,`#...#`,`#...#`,`#...#`,`#...#`,`.#.#.`,`..#..`],W:[`#...#`,`#...#`,`#...#`,`#...#`,`#.#.#`,`##.##`,`#...#`],X:[`#...#`,`#...#`,`.#.#.`,`..#..`,`.#.#.`,`#...#`,`#...#`],Y:[`#...#`,`#...#`,`.#.#.`,`..#..`,`..#..`,`..#..`,`..#..`],Z:[`#####`,`....#`,`...#.`,`..#..`,`.#...`,`#....`,`#####`],0:[`.###.`,`#...#`,`#..##`,`#.#.#`,`##..#`,`#...#`,`.###.`],1:[`..#..`,`.##..`,`..#..`,`..#..`,`..#..`,`..#..`,`.###.`],2:[`.###.`,`#...#`,`....#`,`..##.`,`.#...`,`#....`,`#####`],3:[`####.`,`....#`,`....#`,`.###.`,`....#`,`....#`,`####.`],4:[`#...#`,`#...#`,`#...#`,`#####`,`....#`,`....#`,`....#`],5:[`#####`,`#....`,`####.`,`....#`,`....#`,`#...#`,`.###.`],6:[`.###.`,`#....`,`####.`,`#...#`,`#...#`,`#...#`,`.###.`],7:[`#####`,`....#`,`...#.`,`..#..`,`.#...`,`.#...`,`.#...`],8:[`.###.`,`#...#`,`#...#`,`.###.`,`#...#`,`#...#`,`.###.`],9:[`.###.`,`#...#`,`#...#`,`.####`,`....#`,`....#`,`.###.`],"-":[`.....`,`.....`,`.....`,`#####`,`.....`,`.....`,`.....`],".":[`.....`,`.....`,`.....`,`.....`,`.....`,`.##..`,`.##..`],_:[`.....`,`.....`,`.....`,`.....`,`.....`,`.....`,`#####`],"/":[`....#`,`...#.`,`...#.`,`..#..`,`.#...`,`.#...`,`#....`]," ":[`.....`,`.....`,`.....`,`.....`,`.....`,`.....`,`.....`]};function eh(e){return e?e.toUpperCase().replace(/[^A-Z0-9 ._/-]/g,``).trim().slice(0,14):``}function th(e,t,n,r,i){let a=eh(e);if(a.length===0)return null;let o=a.length*6-1,s=Math.max(24,r-10),c=X(Math.max(1,Math.min(1.55,s/Math.max(1,o)))),l=X(Math.max(.68,c*.7)),u=(o-1)*c+l,d=6*c+l,f=t/2,p=n/2,m=f+(o-1)*c/2,h=p+6*c/2,g=[];for(let e=0;e<a.length;e++){let t=$m[a[e]??` `]??$m[` `];for(let n=0;n<7;n++){let r=t[n]??`.....`,a=h-n*c;for(let t=0;t<5;t++){if(r[t]!==`#`)continue;let n=m-(e*6+t)*c;g.push(Ym({x0:n-l/2,y0:a-l/2,z0:-1,x1:n+l/2,y1:a+l/2,z1:i}))}}}return{label:a,plateX0:X(f-u/2-2.6),plateX1:X(f+u/2+2.6),plateY0:X(p-d/2-2.2),plateY1:X(p+d/2+2.2),dotBoxes:g}}function nh(e,t,n,r,i,a,o,s){return n>i&&e<o&&r>a&&t<s}function rh(e){let t=h[e.standard],n=X(t.W_panel),r=X(t.W_aperture),i=X(t.W_holes),a=X(e.u_height*p-.75),o=X((n-r)/2),s=X(o+10),c=X(n-o-10),l=X(c-s),u=e.u_height>=2?12:10,d=1.4,f=th(e.label_text,n,a,l,d),m=[];if(m.push(`// ============================================================================`),m.push(`// RackArchitect MCP — Custom Parametric 3D-Printable Slot Cover Panel (.scad)`),m.push(`// Standard:  ${e.standard.toUpperCase()} EIA-310 (${n}mm Width, ${e.u_height}U = ${a}mm Height)`),m.push(`// Pattern:   ${e.pattern.toUpperCase()}${f?` | Engraved Label: "${f.label}"`:``}`),m.push(`// Material:  PETG / PLA / ASA (Print Face-Down on Textured PEI Plate, Zero Supports)`),m.push(`// ============================================================================`),m.push(``),m.push(`panel_width_mm = ${n};`),m.push(`aperture_width_mm = ${r};`),m.push(`hole_center_pitch_x_mm = ${i};`),m.push(`panel_height_mm = ${a};`),m.push(`faceplate_thickness_mm = 4.2;`),m.push(`stiffener_depth_mm = ${u};`),m.push(`stiffener_wall_mm = 3.2;`),m.push(`pattern_groove_depth_mm = ${d};`),m.push(`$fn = 36;`),m.push(``),m.push(`module oval_mounting_slot(slot_w = 10.0, slot_h = 6.5, thickness = 10.0) {`),m.push(`  hull() {`),m.push(`    translate([-(slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`),m.push(`    translate([ (slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`),m.push(`  }`),m.push(`}`),m.push(``),m.push(`module eia310_ear_holes() {`),m.push(`  left_hole_x = (panel_width_mm - hole_center_pitch_x_mm) / 2;`),m.push(`  right_hole_x = panel_width_mm - left_hole_x;`),e.u_height<1){let e=X(a/2);m.push(`  translate([left_hole_x, ${e}, 0]) oval_mounting_slot();`),m.push(`  translate([right_hole_x, ${e}, 0]) oval_mounting_slot();`)}else{let t=Math.round(e.u_height);m.push(`  for (u = [0 : ${t-1}]) {`),m.push(`    base_y = u * 44.45;`),m.push(`    for (offset_y = [6.35, 22.225, 38.10]) {`),m.push(`      if (base_y + offset_y < panel_height_mm - 3.0) {`),m.push(`        translate([left_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`),m.push(`        translate([right_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`),m.push(`      }`),m.push(`    }`),m.push(`  }`)}if(m.push(`}`),m.push(``),m.push(`module custom_surface_features() {`),e.pattern===`lines`){let t=Math.max(2,Math.round(e.u_height*3)),n=e.u_height<1?5.2:8,r=t>1?(a-2*n)/(t-1):0;for(let e=0;e<t;e++){let t=X(n+e*r-1.1),i=X(t+2.2);if(f&&nh(s,t,c,i,f.plateX0,f.plateY0,f.plateX1,f.plateY1)){let e=X(f.plateX0-s),n=X(c-f.plateX1);e>=6&&m.push(`  translate([${s}, ${t}, -0.5]) cube([${e}, 2.2, pattern_groove_depth_mm + 0.5]);`),n>=6&&m.push(`  translate([${f.plateX1}, ${t}, -0.5]) cube([${n}, 2.2, pattern_groove_depth_mm + 0.5]);`)}else m.push(`  translate([${s}, ${t}, -0.5]) cube([${l}, 2.2, pattern_groove_depth_mm + 0.5]);`)}}else if(e.pattern===`hex`){let t=Math.max(1,Math.round(e.u_height*2)),n=Math.max(5,Math.min(14,Math.floor(l/20))),r=l/n,i=e.u_height<1?4.5:6,o=(a-2*i)/t,c=X(Math.min(r,o)*.66);for(let e=0;e<t;e++){let t=X(i+(e+.5)*o),a=e%2==1?r*.2:-r*.2;for(let e=0;e<n;e++){let n=X(s+(e+.5)*r+a);f&&nh(n-c/2,t-c/2,n+c/2,t+c/2,f.plateX0,f.plateY0,f.plateX1,f.plateY1)||m.push(`  translate([${n}, ${t}, -0.5]) cylinder(d = ${c}, h = pattern_groove_depth_mm + 0.5, $fn = 6);`)}}}else if(e.pattern===`ribs`){let t=Math.max(8,Math.min(18,Math.floor(l/15))),n=l/t,r=X(Math.max(2.8,n*.44)),i=e.u_height<1?4.5:6,o=X(a-2*i);for(let e=0;e<t;e++){let t=X(s+(e+.5)*n-r/2),a=X(t+r);f&&nh(t,i,a,i+o,f.plateX0,f.plateY0,f.plateX1,f.plateY1)||m.push(`  translate([${t}, ${i}, -0.5]) cube([${r}, ${o}, pattern_groove_depth_mm + 0.5]);`)}}else if(e.pattern===`vented-slots`){let t=e.standard===`19inch`?3:2,n=X((l-(t-1)*6)/t),r=2.4,i=5.2;for(let e=i;e+r<=a-i;e+=5.6){let i=X(e),a=X(e+r);for(let e=0;e<t;e++){let t=X(s+e*(n+6)),o=X(t+n);f&&nh(t,i,o,a,f.plateX0,f.plateY0,f.plateX1,f.plateY1)||m.push(`  translate([${t}, ${i}, -1.0]) cube([${n}, ${r}, faceplate_thickness_mm + 2.0]);`)}}}if(f){let t=X(Math.min(e.u_height<1?7.5:10.5,l*.72/Math.max(1,f.label.length)));m.push(`  translate([panel_width_mm / 2, panel_height_mm / 2, -0.5]) linear_extrude(height = pattern_groove_depth_mm + 0.5) mirror([1, 0, 0]) text("${f.label}", size = ${t}, font = "Liberation Mono:style=Bold", halign = "center", valign = "center");`)}return m.push(`}`),m.push(``),m.push(`union() {`),m.push(`  difference() { cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]); eia310_ear_holes(); custom_surface_features(); }`),m.push(`  translate([${o}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`),m.push(`  translate([${o}, panel_height_mm - stiffener_wall_mm, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`),m.push(`  translate([${o}, 0, faceplate_thickness_mm]) cube([3.5, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`),m.push(`  translate([${o} + aperture_width_mm - 3.5, 0, faceplate_thickness_mm]) cube([3.5, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`),m.push(`}`),m.join(`
`)}function ih(e){let t=h[e.standard],n=X(t.W_panel),r=X(t.W_aperture),i=X(t.W_holes),a=X(e.u_height*p-.75),o=X((n-r)/2),s=4.2,c=3.2,l=3.5,u=e.u_height>=2?12:10,d=1.4,f=Ym({x0:0,y0:0,z0:0,x1:n,y1:a,z1:s}),m=Ym({x0:o,y0:0,z0:s,x1:n-o,y1:c,z1:u}),g=Ym({x0:o,y0:X(a-c),z0:s,x1:n-o,y1:a,z1:u}),_=[Ym({x0:o,y0:0,z0:s,x1:o+l,y1:a,z1:u}),Ym({x0:n-o-l,y0:0,z0:s,x1:n-o,y1:a,z1:u})],v=X((n-i)/2),y=X(n-v),b=[];if(e.u_height<1){let e=X(a/2);b.push(Ym({x0:Math.max(1.2,v-5),y0:e-3.25,z0:-1,x1:Math.min(o-1.2,v+5),y1:e+3.25,z1:5.2}),Ym({x0:Math.max(n-o+1.2,y-5),y0:e-3.25,z0:-1,x1:Math.min(n-1.2,y+5),y1:e+3.25,z1:5.2}))}else{let t=Math.round(e.u_height);for(let e=0;e<t;e++){let t=e*p;for(let e of[6.35,22.225,38.1]){let r=X(t+e);r+3.25<a-1.5&&r-3.25>1.5&&b.push(Ym({x0:Math.max(1.2,v-5),y0:r-3.25,z0:-1,x1:Math.min(o-1.2,v+5),y1:r+3.25,z1:5.2}),Ym({x0:Math.max(n-o+1.2,y-5),y0:r-3.25,z0:-1,x1:Math.min(n-1.2,y+5),y1:r+3.25,z1:5.2}))}}}let x=X(o+10),S=X(n-o-10),C=X(S-x),w=th(e.label_text,n,a,C,d),T=[];if(e.pattern===`lines`){let t=Math.max(2,Math.round(e.u_height*3)),n=e.u_height<1?5.2:8,r=t>1?(a-2*n)/(t-1):0;for(let e=0;e<t;e++){let t=X(n+e*r-1.1),i=X(t+2.2);w&&nh(x,t,S,i,w.plateX0,w.plateY0,w.plateX1,w.plateY1)?(w.plateX0-x>=6&&T.push(Ym({x0:x,y0:t,z0:-1,x1:w.plateX0,y1:i,z1:d})),S-w.plateX1>=6&&T.push(Ym({x0:w.plateX1,y0:t,z0:-1,x1:S,y1:i,z1:d}))):T.push(Ym({x0:x,y0:t,z0:-1,x1:S,y1:i,z1:d}))}}else if(e.pattern===`hex`){let t=Math.max(1,Math.round(e.u_height*2)),n=Math.max(5,Math.min(10,Math.floor(C/24))),r=C/n,i=e.u_height<1?4.5:6,o=(a-2*i)/t,s=X(r*.62),c=X(o*.6);for(let e=0;e<t;e++){let t=i+(e+.5)*o,a=e%2==1?r*.16:-r*.16;for(let e=0;e<n;e++){let n=x+(e+.5)*r+a,i=X(Math.max(x,n-s/2)),o=X(Math.min(S,n+s/2)),l=X(t-c/2),u=X(t+c/2);o-i<3||u-l<3||w&&nh(i,l,o,u,w.plateX0,w.plateY0,w.plateX1,w.plateY1)||T.push(Ym({x0:i,y0:l,z0:-1,x1:o,y1:u,z1:d}))}}}else if(e.pattern===`ribs`){let t=Math.max(8,Math.min(14,Math.floor(C/16))),n=C/t,r=X(Math.max(2.8,n*.44)),i=e.u_height<1?4.5:6;for(let e=0;e<t;e++){let t=X(x+(e+.5)*n-r/2),o=X(t+r),s=i,c=X(a-i);w&&nh(t,s,o,c,w.plateX0,w.plateY0,w.plateX1,w.plateY1)||T.push(Ym({x0:t,y0:s,z0:-1,x1:o,y1:c,z1:d}))}}else if(e.pattern===`vented-slots`){let t=e.standard===`19inch`?3:2,n=X((C-(t-1)*6)/t),r=2.4,i=5.2;for(let e=i;e+r<=a-i;e+=5.6){let i=X(e),a=X(e+r);for(let e=0;e<t;e++){let t=X(x+e*(n+6)),r=X(t+n);w&&nh(t,i,r,a,w.plateX0,w.plateY0,w.plateX1,w.plateY1)||T.push(Ym({x0:t,y0:i,z0:-1,x1:r,y1:a,z1:5.2}))}}}w&&T.push(...w.dotBoxes);let E=[f,m,g,..._,...b,...T],D=Zm(E.flatMap(e=>[e.x0,e.x1]).filter(e=>e>=0&&e<=n)),O=Zm(E.flatMap(e=>[e.y0,e.y1]).filter(e=>e>=0&&e<=a)),k=Zm(E.flatMap(e=>[e.z0,e.z1]).filter(e=>e>=0&&e<=u)),A=D.length-1,j=O.length-1,M=k.length-1,N=(e,t,n)=>{if(e<0||e>=A||t<0||t>=j||n<0||n>=M)return!1;let r=.5*(D[e]+D[e+1]),i=.5*(O[t]+O[t+1]),a=.5*(k[n]+k[n+1]),o=Xm(r,i,a,f)&&!b.some(e=>Xm(r,i,a,e))&&!T.some(e=>Xm(r,i,a,e)),s=Xm(r,i,a,m),c=Xm(r,i,a,g),l=_.some(e=>Xm(r,i,a,e));return o||s||c||l},P=[];for(let e=0;e<A;e++){let t=[];for(let n=0;n<j;n++){let r=[];for(let t=0;t<M;t++)r.push(N(e,n,t));t.push(r)}P.push(t)}let F=(e,t,n)=>P[e]?.[t]?.[n]??!1,I=`custom_cover_${e.standard}_${String(e.u_height).replaceAll(`.`,`p`)}u_${e.pattern}`,L=[`solid ${I}`],R=(e,t,n,r,i,a)=>{L.push(`  facet normal ${e} ${t} ${n}`),L.push(`    outer loop`),L.push(`      vertex ${r[0]} ${r[1]} ${r[2]}`),L.push(`      vertex ${i[0]} ${i[1]} ${i[2]}`),L.push(`      vertex ${a[0]} ${a[1]} ${a[2]}`),L.push(`    endloop`),L.push(`  endfacet`)};for(let e=0;e<A;e++){let t=D[e],n=D[e+1];for(let r=0;r<j;r++){let i=O[r],a=O[r+1];for(let o=0;o<M;o++){if(!F(e,r,o))continue;let s=k[o],c=k[o+1];F(e,r,o-1)||(R(0,0,-1,[t,i,s],[t,a,s],[n,a,s]),R(0,0,-1,[t,i,s],[n,a,s],[n,i,s])),F(e,r,o+1)||(R(0,0,1,[t,i,c],[n,i,c],[n,a,c]),R(0,0,1,[t,i,c],[n,a,c],[t,a,c])),F(e,r-1,o)||(R(0,-1,0,[t,i,s],[n,i,s],[n,i,c]),R(0,-1,0,[t,i,s],[n,i,c],[t,i,c])),F(e,r+1,o)||(R(0,1,0,[t,a,s],[t,a,c],[n,a,c]),R(0,1,0,[t,a,s],[n,a,c],[n,a,s])),F(e-1,r,o)||(R(-1,0,0,[t,i,s],[t,i,c],[t,a,c]),R(-1,0,0,[t,i,s],[t,a,c],[t,a,s])),F(e+1,r,o)||(R(1,0,0,[n,i,s],[n,a,s],[n,a,c]),R(1,0,0,[n,i,s],[n,a,c],[n,i,c]))}}}return L.push(`endsolid ${I}`),L.join(`
`)}function ah(e){let t=h[e.standard],n=X(t.W_panel),r=X(t.W_aperture),i=X(t.W_holes),a=X(e.u_height*p-.75),o=X((n-r)/2),s=X((n-i)/2),c=X(n-s),l=X(o+10),u=X(n-o-10),d=X(u-l),f=eh(e.label_text),m=X(n+24),g=X(a+24),_=[];_.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${g}" width="100%" height="100%" style="max-height:132px;display:block">`),_.push(`<rect x="0" y="0" width="${m}" height="${g}" rx="4" fill="#0E0E11" />`),_.push(`<rect x="12" y="12" width="${n}" height="${a}" rx="1.8" fill="#18181D" stroke="#52525B" stroke-width="0.9" />`),_.push(`<rect x="${X(12+o+2)}" y="${X(14.5)}" width="${X(r-4)}" height="${X(a-5)}" rx="1.2" fill="#121216" stroke="#27272A" stroke-width="0.7" />`);let v=[];if(e.u_height<1)v.push(X(a/2));else{let t=Math.round(e.u_height);for(let e=0;e<t;e++)for(let t of[6.35,22.225,38.1]){let n=X(e*p+t);n+3.25<a-1.5&&n-3.25>1.5&&v.push(a-n)}}for(let e of v)for(let t of[s,c])_.push(`<rect x="${X(12+t-4.5)}" y="${X(12+e-3)}" width="9.0" height="6.0" rx="3.0" fill="#09090B" stroke="#71717A" stroke-width="0.7" />`);let y=f.length>0,b=y?f.length*6-1:0,x=y?X(Math.max(1,Math.min(1.55,Math.max(24,d-10)/Math.max(1,b)))):0,S=y?X(Math.max(.68,x*.7)):0,C=y?(b-1)*x+S:0,w=y?6*x+S:0,T=X(n/2-C/2-2.6),E=X(n/2+C/2+2.6),D=X(a/2-w/2-2.2),O=X(a/2+w/2+2.2);if(e.pattern===`lines`){let t=Math.max(2,Math.round(e.u_height*3)),n=e.u_height<1?5.2:8,r=t>1?(a-2*n)/(t-1):0;for(let e=0;e<t;e++){let t=X(n+e*r-1.1),i=X(t+2.2);y&&nh(l,t,u,i,T,D,E,O)?(T-l>=6&&_.push(`<rect x="${X(12+l)}" y="${X(12+t)}" width="${X(T-l)}" height="2.2" rx="0.8" fill="#3F3F46" />`),u-E>=6&&_.push(`<rect x="${X(12+E)}" y="${X(12+t)}" width="${X(u-E)}" height="2.2" rx="0.8" fill="#3F3F46" />`)):_.push(`<rect x="${X(12+l)}" y="${X(12+t)}" width="${d}" height="2.2" rx="0.8" fill="#3F3F46" />`)}}else if(e.pattern===`hex`){let t=Math.max(1,Math.round(e.u_height*2)),n=Math.max(5,Math.min(10,Math.floor(d/24))),r=d/n,i=e.u_height<1?4.5:6,o=(a-2*i)/t,s=X(Math.min(r,o)*.3);for(let e=0;e<t;e++){let t=X(i+(e+.5)*o),a=e%2==1?r*.16:-r*.16;for(let e=0;e<n;e++){let n=X(l+(e+.5)*r+a);y&&nh(n-s,t-s,n+s,t+s,T,D,E,O)||_.push(`<circle cx="${X(12+n)}" cy="${X(12+t)}" r="${s}" fill="#09090B" stroke="#52525B" stroke-width="0.8" />`)}}}else if(e.pattern===`ribs`){let t=Math.max(8,Math.min(14,Math.floor(d/16))),n=d/t,r=X(Math.max(2.8,n*.44)),i=e.u_height<1?4.5:6,o=X(a-2*i);for(let e=0;e<t;e++){let t=X(l+(e+.5)*n-r/2);y&&nh(t,i,t+r,i+o,T,D,E,O)||_.push(`<rect x="${X(12+t)}" y="${X(12+i)}" width="${r}" height="${o}" rx="0.8" fill="#09090B" stroke="#3F3F46" stroke-width="0.7" />`)}}else if(e.pattern===`vented-slots`){let t=e.standard===`19inch`?3:2,n=X((d-(t-1)*6)/t),r=2.4,i=5.2;for(let e=i;e+r<=a-i;e+=5.6)for(let i=0;i<t;i++){let t=X(l+i*(n+6));y&&nh(t,e,t+n,e+r,T,D,E,O)||_.push(`<rect x="${X(12+t)}" y="${X(12+e)}" width="${n}" height="${r}" rx="1.0" fill="#09090B" stroke="#3B82F6" stroke-opacity="0.45" stroke-width="0.6" />`)}}if(y){_.push(`<rect x="${X(12+T)}" y="${X(12+D)}" width="${X(E-T)}" height="${X(O-D)}" rx="1.4" fill="#141418" stroke="#3F3F46" stroke-width="0.6" />`);let e=n/2-(b-1)*x/2,t=a/2-6*x/2;for(let n=0;n<f.length;n++){let r=$m[f[n]??` `]??$m[` `];for(let i=0;i<7;i++){let a=r[i]??`.....`;for(let r=0;r<5;r++){if(a[r]!==`#`)continue;let o=X(12+e+(n*6+r)*x-S/2),s=X(12+t+i*x-S/2);_.push(`<rect x="${o}" y="${s}" width="${S}" height="${S}" rx="0.2" fill="#E4E4E7" />`)}}}}return _.push(`</svg>`),_.join(``)}var oh=[{id:`10inch-homelab`,label:`10" Homelab (8U · Proxmox + UniFi)`,defaultSelectedDeviceId:`sw-u8`},{id:`19inch-enterprise`,label:`19" Enterprise HA (12U · FortiGate + 24p PoE++)`,defaultSelectedDeviceId:`sw-poe-core-01`},{id:`6inch-microlab`,label:`6" DeskMate Micro-Lab (6U · Pi 5 + OpenWrt)`,defaultSelectedDeviceId:`sw-flex-u6`},{id:`empty-10inch`,label:`Empty 10" Mini-Rack (8U · Start Fresh)`,defaultSelectedDeviceId:null},{id:`empty-19inch`,label:`Empty 19" Server Rack (12U · Start Fresh)`,defaultSelectedDeviceId:null}];function sh(){return{schema_version:`1.0`,project_name:`12U 19-Inch Enterprise Firewall, PoE++ & Proxmox HA Rack`,rack:{standard:`19inch`,u_height:12,rail_depth_mm:400,enclosure_type:`closed-vented-front`,front_door_clearance_mm:55,rear_clearance_mm:60},mounted_devices:[{instance_id:`ups-core-01`,blueprint_slug:`apc-smart-ups-li-ion-short-depth-2u`,u_position:1,face:`front`,hostname:`APC Smart-UPS 1500VA Li-Ion Short-Depth (U1-U2)`,children:[]},{instance_id:`nas-storage-01`,blueprint_slug:`ubiquiti-unas-pro-2u`,u_position:3,face:`front`,hostname:`UniFi UNAS Pro 7-Bay 10G NAS (U3-U4)`,children:[]},{instance_id:`carrier-compute-u5`,blueprint_slug:`3dprint-19inch-dual-minipc-poe-carrier-1u`,u_position:5,face:`front`,hostname:`19-Inch Proxmox & PoE Witness Carrier (U5)`,children:[{instance_id:`pve-node-01`,blueprint_slug:`lenovo-thinkcentre-m920q`,slot_id:`mini-pc-bay-1`,hostname:`Proxmox HA Node 01 (M920q)`},{instance_id:`pve-node-02`,blueprint_slug:`lenovo-thinkcentre-m920q`,slot_id:`mini-pc-bay-2`,hostname:`Proxmox HA Node 02 (M920q)`},{instance_id:`pi5-qdevice-01`,blueprint_slug:`raspberry-pi-5-poe-hat`,slot_id:`pi-poe-bay-1`,hostname:`Pi 5 PoE+ Quorum Witness`}]},{instance_id:`brush-portal-u6`,blueprint_slug:`generic-19inch-brush-panel-1u`,u_position:6,face:`front`,hostname:`19-Inch Brush Strip Cable Portal (U6)`,children:[]},{instance_id:`cover-u7`,blueprint_slug:`3dprint-19inch-cover-panel-lines-1u`,u_position:7,face:`front`,hostname:`19-Inch 3D-Printed Slot Cover Panel (U7)`,children:[]},{instance_id:`udm-pro-sec-01`,blueprint_slug:`ubiquiti-udm-pro`,u_position:8,face:`front`,hostname:`UniFi UDM-Pro NVR & Controller (U8)`,children:[]},{instance_id:`fw-ngfw-01`,blueprint_slug:`fortinet-fortigate-200f-ngfw-1u`,u_position:9,face:`front`,hostname:`FortiGate 200F Enterprise NGFW (U9)`,children:[]},{instance_id:`sw-core-agg-01`,blueprint_slug:`ubiquiti-usw-aggregation`,u_position:10,face:`front`,hostname:`USW-Aggregation 10G Core Switch (U10)`,children:[]},{instance_id:`sw-poe-core-01`,blueprint_slug:`ubiquiti-usw-pro-max-24-poe`,u_position:11,face:`front`,hostname:`USW-Pro-Max 24 PoE++ Switch (U11)`,children:[]},{instance_id:`patch-ext-u11`,blueprint_slug:`generic-19inch-patch-panel-24port-cat6a`,u_position:12,face:`front`,hostname:`24-Port Cat6A Building Patch Panel (U12)`,children:[]}],cables:[{cable_id:`wan1-patch-to-ngfw`,from:{instance_id:`patch-ext-u11`,port_id:`p2`,face:`front`},to:{instance_id:`fw-ngfw-01`,port_id:`wan1`,face:`front`},cable_type:`cat6a`,color_hex:`#EF4444`,label:`Primary Fiber ONT WAN1 -> FortiGate 200F`,vlan_id:901,ip_cidr:`198.51.100.2/30`},{cable_id:`wan2-patch-to-ngfw`,from:{instance_id:`patch-ext-u11`,port_id:`p3`,face:`front`},to:{instance_id:`fw-ngfw-01`,port_id:`wan2`,face:`front`},cable_type:`cat6a`,color_hex:`#F97316`,label:`Backup 5G/Cable WAN2 -> FortiGate 200F`,vlan_id:902,ip_cidr:`203.0.113.2/30`},...[1,2,3,4,5,6].map(e=>{let t=7+e;return{cable_id:`poe-patch-ap-0${e}`,from:{instance_id:`sw-poe-core-01`,port_id:`eth${t}`,face:`front`},to:{instance_id:`patch-ext-u11`,port_id:`p${t}`,face:`front`},cable_type:`cat6a`,color_hex:`#0EA5E9`,label:`PoE++ Patch -> Wi-Fi 7 AP #${e} (22W)`,vlan_id:20,ip_cidr:`10.20.0.${10+e}/24`}}),...[1,2,3,4,5,6].map(e=>{let t=13+e;return{cable_id:`poe-patch-cam-0${e}`,from:{instance_id:`sw-poe-core-01`,port_id:`eth${t}`,face:`front`},to:{instance_id:`patch-ext-u11`,port_id:`p${t}`,face:`front`},cable_type:`cat6a`,color_hex:`#F59E0B`,label:`PoE+ Patch -> 4K Security Cam #${e} (12W)`,vlan_id:30,ip_cidr:`10.30.0.${10+e}/24`}}),{cable_id:`poe-patch-door-01`,from:{instance_id:`sw-poe-core-01`,port_id:`eth20`,face:`front`},to:{instance_id:`patch-ext-u11`,port_id:`p20`,face:`front`},cable_type:`cat6a`,color_hex:`#10B981`,label:`PoE+ Patch -> Door Access #1 (15W)`,vlan_id:40,ip_cidr:`10.40.0.11/24`},{cable_id:`poe-patch-door-02`,from:{instance_id:`sw-poe-core-01`,port_id:`eth21`,face:`front`},to:{instance_id:`patch-ext-u11`,port_id:`p21`,face:`front`},cable_type:`cat6a`,color_hex:`#10B981`,label:`PoE+ Patch -> Door Access #2 (15W)`,vlan_id:40,ip_cidr:`10.40.0.12/24`},{cable_id:`dac-ngfw-to-agg-1`,from:{instance_id:`fw-ngfw-01`,port_id:`sfp_plus1`,face:`front`},to:{instance_id:`sw-core-agg-01`,port_id:`sfp5`,face:`front`},cable_type:`sfp-plus-dac`,color_hex:`#A855F7`,label:`10G SFP+ LACP Core Trunk 1 (FortiGate -> Aggregation)`,vlan_id:1,ip_cidr:`10.0.0.1/24`},{cable_id:`dac-ngfw-to-agg-2`,from:{instance_id:`fw-ngfw-01`,port_id:`sfp_plus2`,face:`front`},to:{instance_id:`sw-core-agg-01`,port_id:`sfp6`,face:`front`},cable_type:`sfp-plus-dac`,color_hex:`#A855F7`,label:`10G SFP+ LACP Core Trunk 2 (FortiGate -> Aggregation)`,vlan_id:1,ip_cidr:`10.0.0.2/24`},{cable_id:`dac-agg-to-poesw-1`,from:{instance_id:`sw-core-agg-01`,port_id:`sfp7`,face:`front`},to:{instance_id:`sw-poe-core-01`,port_id:`sfp1`,face:`front`},cable_type:`sfp-plus-dac`,color_hex:`#38BDF8`,label:`10G SFP+ LACP Uplink 1 (Aggregation -> PoE++ Switch)`,vlan_id:1},{cable_id:`dac-agg-to-poesw-2`,from:{instance_id:`sw-core-agg-01`,port_id:`sfp8`,face:`front`},to:{instance_id:`sw-poe-core-01`,port_id:`sfp2`,face:`front`},cable_type:`sfp-plus-dac`,color_hex:`#38BDF8`,label:`10G SFP+ LACP Uplink 2 (Aggregation -> PoE++ Switch)`,vlan_id:1},{cable_id:`dac-agg-to-udm`,from:{instance_id:`sw-core-agg-01`,port_id:`sfp4`,face:`front`},to:{instance_id:`udm-pro-sec-01`,port_id:`sfp_lan11`,face:`front`},cable_type:`sfp-plus-dac`,color_hex:`#8B5CF6`,label:`10G SFP+ Protect NVR Camera Stream Trunk`,vlan_id:30,ip_cidr:`10.30.0.2/24`},{cable_id:`cross-agg-to-nas`,from:{instance_id:`sw-core-agg-01`,port_id:`sfp1`,face:`front`},to:{instance_id:`nas-storage-01`,port_id:`sfp_plus1`,face:`rear`},cable_type:`sfp-plus-dac`,color_hex:`#6366F1`,label:`10G SFP+ UNAS Pro Storage Trunk (via U6 Brush Portal)`,vlan_id:50,ip_cidr:`10.50.0.10/24`,preferred_portal_u:6},{cable_id:`poe-sw-to-pi5-witness`,from:{instance_id:`sw-poe-core-01`,port_id:`eth24`,face:`front`},to:{instance_id:`pi5-qdevice-01`,port_id:`eth0`,face:`front`},cable_type:`cat6a`,color_hex:`#EC4899`,label:`PoE+ Power & Quorum Link -> Pi 5 Witness (12W PoE)`,vlan_id:10,ip_cidr:`10.10.0.15/24`},{cable_id:`cross-pve1-to-poesw`,from:{instance_id:`sw-poe-core-01`,port_id:`eth2`,face:`front`},to:{instance_id:`pve-node-01`,port_id:`eth1`,face:`rear`},cable_type:`cat6a`,color_hex:`#2563EB`,label:`2.5G Proxmox Node 01 VM Trunk (via U6 Brush Portal)`,vlan_id:10,ip_cidr:`10.10.0.11/24`,preferred_portal_u:6},{cable_id:`cross-pve2-to-poesw`,from:{instance_id:`sw-poe-core-01`,port_id:`eth23`,face:`front`},to:{instance_id:`pve-node-02`,port_id:`eth1`,face:`rear`},cable_type:`cat6a`,color_hex:`#2563EB`,label:`2.5G Proxmox Node 02 VM Trunk (via U6 Brush Portal)`,vlan_id:10,ip_cidr:`10.10.0.12/24`,preferred_portal_u:6},{cable_id:`rear-pve1-to-pve2-ceph`,from:{instance_id:`pve-node-01`,port_id:`eth2`,face:`rear`},to:{instance_id:`pve-node-02`,port_id:`eth2`,face:`rear`},cable_type:`cat6a`,color_hex:`#14B8A6`,label:`2.5G Direct Ceph Storage Replication Heartbeat`,vlan_id:99,ip_cidr:`172.16.99.1/30`},{cable_id:`fw-ha-sync-to-udm`,from:{instance_id:`fw-ngfw-01`,port_id:`eth8`,face:`front`},to:{instance_id:`udm-pro-sec-01`,port_id:`eth8`,face:`front`},cable_type:`cat6a`,color_hex:`#F43F5E`,label:`FortiGate <-> UDM-Pro Management & Telemetry Interconnect`,vlan_id:1,ip_cidr:`10.0.0.3/24`},{cable_id:`pwr-ups-to-nas`,from:{instance_id:`ups-core-01`,port_id:`iec_out1`,face:`rear`},to:{instance_id:`nas-storage-01`,port_id:`ac_in`,face:`rear`},cable_type:`power-c13-c14`,color_hex:`#18181B`,label:`UPS IEC-1 -> UNAS Pro 2U (160W)`},{cable_id:`pwr-ups-to-udm`,from:{instance_id:`ups-core-01`,port_id:`iec_out2`,face:`rear`},to:{instance_id:`udm-pro-sec-01`,port_id:`ac_in`,face:`rear`},cable_type:`power-c13-c14`,color_hex:`#18181B`,label:`UPS IEC-2 -> UDM-Pro (33W)`},{cable_id:`pwr-ups-to-ngfw`,from:{instance_id:`ups-core-01`,port_id:`iec_out3`,face:`rear`},to:{instance_id:`fw-ngfw-01`,port_id:`ac_in`,face:`rear`},cable_type:`power-c13-c14`,color_hex:`#DC2626`,label:`UPS IEC-3 -> FortiGate 200F NGFW (68W)`},{cable_id:`pwr-ups-to-agg`,from:{instance_id:`ups-core-01`,port_id:`iec_out4`,face:`rear`},to:{instance_id:`sw-core-agg-01`,port_id:`ac_in`,face:`rear`},cable_type:`power-c13-c14`,color_hex:`#18181B`,label:`UPS IEC-4 -> USW-Aggregation 10G (30W)`},{cable_id:`pwr-ups-to-poesw`,from:{instance_id:`ups-core-01`,port_id:`iec_out5`,face:`rear`},to:{instance_id:`sw-poe-core-01`,port_id:`ac_in`,face:`rear`},cable_type:`power-c13-c14`,color_hex:`#18181B`,label:`UPS IEC-5 -> USW-Pro-Max-24-PoE++ (450W Total)`},{cable_id:`pwr-ups-to-pve1`,from:{instance_id:`ups-core-01`,port_id:`dc_out1`,face:`rear`},to:{instance_id:`pve-node-01`,port_id:`dc_in`,face:`rear`},cable_type:`power-dc-5525`,color_hex:`#27272A`,label:`UPS 20V DC Out 1 -> Proxmox Node 01 (65W)`},{cable_id:`pwr-ups-to-pve2`,from:{instance_id:`ups-core-01`,port_id:`dc_out2`,face:`rear`},to:{instance_id:`pve-node-02`,port_id:`dc_in`,face:`rear`},cable_type:`power-dc-5525`,color_hex:`#27272A`,label:`UPS 20V DC Out 2 -> Proxmox Node 02 (65W)`}],external_endpoints:[{endpoint_id:`ext-wan-01`,label:`Primary Fiber ONT (ISP 1)`,room_or_zone:`Hausanschlussraum (HAR)`,category:`isp-wan-uplink`,patch_panel_instance_id:`patch-ext-u11`,patch_panel_port_id:`p2`,poe_draw_watts:0,required_speed:`2.5gbe`,entry_position:`top-rear`,color_hex:`#EF4444`,vlan_id:901},{endpoint_id:`ext-wan-02`,label:`Backup 5G/Cable Modem (ISP 2)`,room_or_zone:`Hausanschlussraum (HAR)`,category:`isp-wan-uplink`,patch_panel_instance_id:`patch-ext-u11`,patch_panel_port_id:`p3`,poe_draw_watts:0,required_speed:`1gbe`,entry_position:`top-rear`,color_hex:`#F97316`,vlan_id:902},...[[`Empfang / EG Foyer`,`p8`],[`Großraumbüro Nord (1. OG)`,`p9`],[`Großraumbüro Süd (1. OG)`,`p10`],[`Konferenzraum & Beamer-Zone (2. OG)`,`p11`],[`Entwickler-Labor (2. OG)`,`p12`],[`Dachterrasse / Lounge (3. OG)`,`p13`]].map(([e,t],n)=>({endpoint_id:`ext-wifi-ap-0${n+1}`,label:`Wi-Fi 7 PoE++ AP #${n+1}`,room_or_zone:e,category:`wifi-ap`,patch_panel_instance_id:`patch-ext-u11`,patch_panel_port_id:t,poe_draw_watts:22,required_speed:`2.5gbe`,entry_position:`top-rear`,color_hex:`#0EA5E9`,vlan_id:20})),...[[`Haupteingang Außen`,`p14`],[`Tiefgarage Einfahrt`,`p15`],[`Serverraum Schleuse`,`p16`],[`Lieferzone Nord`,`p17`],[`Innenhof Süd`,`p18`],[`Flur 1. OG`,`p19`]].map(([e,t],n)=>({endpoint_id:`ext-cam-0${n+1}`,label:`4K PoE+ Security Cam #${n+1}`,room_or_zone:e,category:`poe-camera`,patch_panel_instance_id:`patch-ext-u11`,patch_panel_port_id:t,poe_draw_watts:12,required_speed:`1gbe`,entry_position:`top-rear`,color_hex:`#F59E0B`,vlan_id:30})),{endpoint_id:`ext-door-01`,label:`PoE+ Door Access Reader #1`,room_or_zone:`Haupteingang Schleuse`,category:`iot-controller`,patch_panel_instance_id:`patch-ext-u11`,patch_panel_port_id:`p20`,poe_draw_watts:15,required_speed:`1gbe`,entry_position:`top-rear`,color_hex:`#10B981`,vlan_id:40},{endpoint_id:`ext-door-02`,label:`PoE+ Door Access Reader #2`,room_or_zone:`Serverraum Tür`,category:`iot-controller`,patch_panel_instance_id:`patch-ext-u11`,patch_panel_port_id:`p21`,poe_draw_watts:15,required_speed:`1gbe`,entry_position:`top-rear`,color_hex:`#10B981`,vlan_id:40}]}}function ch(){return{schema_version:`1.0`,project_name:`6U 6-Inch DeskMate Micro-Homelab (Pi 5 + OpenWrt + UniFi)`,rack:{standard:`6inch`,u_height:6,rail_depth_mm:180,enclosure_type:`open-frame`,front_door_clearance_mm:40,rear_clearance_mm:50},mounted_devices:[{instance_id:`pdu-u1`,blueprint_slug:`generic-6inch-usb-pd-pdu-4port`,hostname:`pdu-gan-200w`,u_position:1,face:`front`,children:[]},{instance_id:`carrier-pi5-u2`,blueprint_slug:`3dprint-6inch-rpi5-plus-keystone-carrier-1u`,hostname:`carrier-pi5-u2`,u_position:2,face:`front`,children:[{instance_id:`pi5-docker-01`,blueprint_slug:`raspberry-pi-5-poe-hat`,hostname:`pi5-docker-node`,slot_id:`rpi5-bay-1`},{instance_id:`ks-u2-wan`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`ISP-ONT-WAN`,slot_id:`keystone-1`},{instance_id:`ks-u2-lan`,blueprint_slug:`keystone-rj45-cat6a-coupler`,hostname:`PI5-GBE`,slot_id:`keystone-2`}]},{instance_id:`gw-beryl-u3`,blueprint_slug:`gl-inet-mt3000-beryl-ax-6inch`,hostname:`gw-beryl-ax`,u_position:3,face:`front`,children:[]},{instance_id:`brush-u4`,blueprint_slug:`generic-6inch-brush-panel-1u`,hostname:`brush-portal-u4`,u_position:4,face:`front`,children:[]},{instance_id:`patch-u5`,blueprint_slug:`generic-6inch-patch-panel-6port`,hostname:`patch-6p-u5`,u_position:5,face:`front`,children:[]},{instance_id:`sw-flex-u6`,blueprint_slug:`ubiquiti-usw-flex-mini-6inch`,hostname:`sw-flex-mini`,u_position:6,face:`front`,children:[]}],cables:[{cable_id:`pwr-pdu-to-beryl`,cable_type:`power-usb-c`,color_hex:`#F97316`,label:`200W PDU USB-C PD1 -> Beryl AX Gateway`,from:{instance_id:`pdu-u1`,port_id:`usb_pd1`,face:`front`},to:{instance_id:`gw-beryl-u3`,port_id:`pwr_usb_c`,face:`rear`}},{cable_id:`pwr-pdu-to-pi5`,cable_type:`power-usb-c`,color_hex:`#F59E0B`,label:`200W PDU USB-C PD2 -> Raspberry Pi 5 (27W PD)`,from:{instance_id:`pdu-u1`,port_id:`usb_pd2`,face:`front`},to:{instance_id:`pi5-docker-01`,port_id:`usbc_pwr`,face:`rear`}},{cable_id:`pwr-pdu-to-flex`,cable_type:`power-usb-c`,color_hex:`#EF4444`,label:`200W PDU USB-C PD3 -> USW-Flex-Mini`,from:{instance_id:`pdu-u1`,port_id:`usb_pd3`,face:`front`},to:{instance_id:`sw-flex-u6`,port_id:`pwr_usb_c`,face:`rear`}},{cable_id:`wan-ks-to-beryl`,cable_type:`cat6a`,color_hex:`#EC4899`,label:`ISP ONT Keystone (Front) -> Beryl AX 2.5G WAN`,from:{instance_id:`ks-u2-wan`,port_id:`coupler`,face:`front`},to:{instance_id:`gw-beryl-u3`,port_id:`wan1`,face:`rear`}},{cable_id:`lan-beryl-to-patch1`,cable_type:`cat6a`,color_hex:`#3B82F6`,label:`Beryl AX LAN -> Patch P1 (Rear)`,from:{instance_id:`gw-beryl-u3`,port_id:`lan1`,face:`rear`},to:{instance_id:`patch-u5`,port_id:`p1`,face:`rear`}},{cable_id:`lan-pi5-to-ks2`,cable_type:`cat6a`,color_hex:`#10B981`,label:`Pi 5 GbE -> U2 Keystone 2 (Front)`,from:{instance_id:`pi5-docker-01`,port_id:`eth0`,face:`front`},to:{instance_id:`ks-u2-lan`,port_id:`coupler`,face:`front`}},{cable_id:`trunk-ks2-to-patch2`,cable_type:`cat6a`,color_hex:`#10B981`,label:`U2 Keystone 2 (Rear) -> Patch P2 (Rear)`,from:{instance_id:`ks-u2-lan`,port_id:`coupler`,face:`rear`},to:{instance_id:`patch-u5`,port_id:`p2`,face:`rear`}},{cable_id:`patch-p1-to-sw1`,cable_type:`cat6a`,color_hex:`#3B82F6`,label:`Patch P1 -> Flex Mini Port 1 (Gateway Uplink)`,from:{instance_id:`patch-u5`,port_id:`p1`,face:`front`},to:{instance_id:`sw-flex-u6`,port_id:`eth1`,face:`front`}},{cable_id:`patch-p2-to-sw2`,cable_type:`cat6a`,color_hex:`#10B981`,label:`Patch P2 -> Flex Mini Port 2 (Pi 5 Docker Node)`,from:{instance_id:`patch-u5`,port_id:`p2`,face:`front`},to:{instance_id:`sw-flex-u6`,port_id:`eth2`,face:`front`}},{cable_id:`patch-p3-to-sw3`,cable_type:`cat6a`,color_hex:`#0EA5E9`,label:`Patch P3 -> Flex Mini Port 3 (Desk Workstation)`,from:{instance_id:`patch-u5`,port_id:`p3`,face:`front`},to:{instance_id:`sw-flex-u6`,port_id:`eth3`,face:`front`}}],external_endpoints:[{endpoint_id:`ext-isp-ont`,label:`ISP Fiber ONT (Glasfaser-Modem)`,room_or_zone:`Wohnzimmer Glasfaser-APL`,category:`isp-wan-uplink`,patch_panel_instance_id:`ks-u2-wan`,patch_panel_port_id:`coupler`,poe_draw_watts:0,required_speed:`2.5gbe`,entry_position:`top-rear`,color_hex:`#EC4899`,vlan_id:900},{endpoint_id:`ext-desk-pc`,label:`Desk Workstation Drop (1GbE LAN)`,room_or_zone:`Home Office Schreibtisch`,category:`workstation-dock`,patch_panel_instance_id:`patch-u5`,patch_panel_port_id:`p3`,poe_draw_watts:0,required_speed:`1gbe`,entry_position:`top-rear`,color_hex:`#0EA5E9`,vlan_id:10}]}}function lh(e){switch(e){case`19inch-enterprise`:return sh();case`6inch-microlab`:return ch();case`empty-10inch`:return{schema_version:`1.0`,project_name:`Clean 8U 10-Inch Mini-Rack`,rack:{standard:`10inch`,u_height:8,rail_depth_mm:240,enclosure_type:`closed-glass-front`,front_door_clearance_mm:50,rear_clearance_mm:60},mounted_devices:[],cables:[],external_endpoints:[]};case`empty-19inch`:return{schema_version:`1.0`,project_name:`Clean 12U 19-Inch Server Rack`,rack:{standard:`19inch`,u_height:12,rail_depth_mm:400,enclosure_type:`closed-vented-front`,front_door_clearance_mm:55,rear_clearance_mm:60},mounted_devices:[],cables:[],external_endpoints:[]};default:return Bm()}}var uh=`rack=v1.`;function dh(e){let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);let n=btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`),r=n.length;for(;r>0&&n.charCodeAt(r-1)===61;)r--;return n.slice(0,r)}function fh(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=(4-t.length%4)%4,r=t+`=`.repeat(n),i=atob(r),a=new Uint8Array(i.length);for(let e=0;e<i.length;e++)a[e]=i.charCodeAt(e);return a}function ph(e){let t=rl.parse(e),n=JSON.stringify(t);return`#${uh}${dh(new TextEncoder().encode(n))}`}function mh(e){if(!e)return null;let t=e.indexOf(`#`),n=t>=0?e.slice(t+1):e.replace(/^#/,``);if(!n)return null;let r=n.split(`&`).find(e=>e.startsWith(uh));if(!r)return null;let i=r.slice(8).trim();if(!i)return null;try{let e=fh(i),t=new TextDecoder().decode(e),n=JSON.parse(t),r=rl.safeParse(n);return r.success?r.data:null}catch{return null}}var hh=[{id:`mcp-call-6`,timestamp:`10:14:22`,tool:`validate_rack`,summary:`Rack '8U 10-Inch Proxmox & UniFi Homelab' is VALID (0 Errors, 0 Warnings, 33.5W PoE active).`,status:`VALID`,errorCount:0,warningCount:0},{id:`mcp-call-5b`,timestamp:`10:14:20`,tool:`plan_external_endpoints`,summary:`Terminated 4 top-rear external drops on 'patch-u7' (ISP Glasfaser-ONT WAN, Wi-Fi 7 PoE+ AP 21W, 4K PoE+ Kamera 12.5W, Office 2.5G LAN).`,status:`VALID`,errorCount:0,warningCount:0},{id:`mcp-call-5`,timestamp:`10:14:19`,tool:`connect_cables`,summary:`Connected 22 cable(s) and computed 3D Catmull-Rom routes cleanly (including U6 Brush Portal & external patch links).`,status:`VALID`,errorCount:0,warningCount:0},{id:`mcp-call-4`,timestamp:`10:14:15`,tool:`modify_equipment`,summary:`Self-Correction: Moved 'pdu-u2-rear' from U1 Rear -> U2 Rear to clear 45mm Schuko/IEC plug zone.`,status:`VALID`,errorCount:0,warningCount:0},{id:`mcp-call-3`,timestamp:`10:14:12`,tool:`connect_cables`,summary:`PLUG_CLEARANCE_COLLISION on U1: 'ups-u1' rear plug (+45mm) collides with 'pdu-u2-rear' at U1 Rear.`,status:`INVALID`,errorCount:1,warningCount:0},{id:`mcp-call-2`,timestamp:`10:14:08`,tool:`mount_equipment`,summary:`Mounted 8 top-level units + 10 sub-modules (UCG-Max, 2x Lenovo M920q, 7x Cat6A Keystones).`,status:`VALID`,errorCount:0,warningCount:0},{id:`mcp-call-1`,timestamp:`10:14:02`,tool:`init_rack`,summary:`Initialized 10inch rack '8U 10-Inch Proxmox & UniFi Homelab' (8U, 240mm depth, closed-glass-front).`,status:`VALID`,errorCount:0,warningCount:0}];function gh(e,t){return e===`usb-c`||t===`usb-c`?`power-usb-c`:e===`dc-5525`||t===`dc-5525`?`power-dc-5525`:e===`schuko-cee7`||t===`schuko-cee7`?`power-schuko-c13`:e===`iec-c13`||e===`iec-c14`||t===`iec-c13`||t===`iec-c14`?`power-c13-c14`:e===`sfp-plus`&&t===`sfp-plus`?`sfp-plus-dac`:e===`rj45-serial-console`||t===`rj45-serial-console`?`rj45-serial-rollover`:`cat6a`}function _h(){let e=typeof window<`u`?mh(window.location.hash):null,t=(0,d.useRef)(e??Bm()),n=(0,d.useRef)([]),r=(0,d.useRef)([]),[i,a]=(0,d.useState)(`standalone-demo`),[o,s]=(0,d.useState)(null),[c,l]=(0,d.useState)(`10inch-homelab`),[u,f]=(0,d.useState)(()=>Vm(t.current)),[p,m]=(0,d.useState)(()=>zm.getAllBlueprints()),[h,g]=(0,d.useState)(hh),[_,v]=(0,d.useState)(0),[y,b]=(0,d.useState)(0),[x,S]=(0,d.useState)(()=>Wm(u)),[C,w]=(0,d.useState)(()=>Km(u)),[T,E]=(0,d.useState)(()=>qm(u)),[D,O]=(0,d.useState)(`3d`),[k,A]=(0,d.useState)(!1),[j,M]=(0,d.useState)(0),[N,P]=(0,d.useState)(`all`),[F,I]=(0,d.useState)(`isometric`),[L,R]=(0,d.useState)(!1),[z,ee]=(0,d.useState)(!1),[te,ne]=(0,d.useState)(!1),[re,B]=(0,d.useState)(()=>e?e.mounted_devices?.[0]?.instance_id??null:`sw-u8`),[ie,ae]=(0,d.useState)(null),[oe,se]=(0,d.useState)(null),[V,ce]=(0,d.useState)(null),H=(0,d.useRef)(null),le=(0,d.useRef)(!1),ue=(0,d.useCallback)(async(e,t=``)=>{try{let[n,r,i]=await Promise.all([fetch(`${e}/api/export/elevation.svg${t}`),fetch(`${e}/api/export/wiring.svg${t}`),fetch(`${e}/api/export/bom.md${t}`)]);n.ok&&S(await n.text()),r.ok&&w(await r.text()),i.ok&&E(await i.text())}catch{}},[]),de=(0,d.useCallback)(e=>{let i=structuredClone(t.current);n.current.push(i),r.current=[];let a=e(structuredClone(i));t.current=a;let o=Vm(a);f(o),v(n.current.length),b(0),S(Wm(o)),w(Km(o)),E(qm(o))},[]),fe=(0,d.useCallback)((e,t)=>{let n=Math.max(1,Math.min(u.project.rack.u_height,Math.round(t)));i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN?H.current.send(JSON.stringify({type:`COMMAND`,tool:`modify_equipment`,args:{instance_id:e,action:`move`,new_u_position:n}})):de(t=>{let r=t.mounted_devices??[];for(let t of r)t.instance_id===e&&(t.u_position=n);return t})},[de,i,u.project.rack.u_height]),pe=(0,d.useCallback)(()=>{if(i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN){H.current.send(JSON.stringify({type:`COMMAND`,tool:`undo_redo`,args:{action:`undo`}}));return}let e=n.current.pop();if(!e)return;r.current.push(structuredClone(t.current)),t.current=e;let a=Vm(e);f(a),v(n.current.length),b(r.current.length),S(Wm(a)),w(Km(a)),E(qm(a))},[i]),me=(0,d.useCallback)(()=>{if(i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN){H.current.send(JSON.stringify({type:`COMMAND`,tool:`undo_redo`,args:{action:`redo`}}));return}let e=r.current.pop();if(!e)return;n.current.push(structuredClone(t.current)),t.current=e;let a=Vm(e);f(a),v(n.current.length),b(r.current.length),S(Wm(a)),w(Km(a)),E(qm(a))},[i]),he=(0,d.useCallback)(e=>{n.current=[],r.current=[];let i=lh(e);t.current=i;let a=Vm(i),o=oh.find(t=>t.id===e);l(e),f(a),ce(null),ae(null),B(o?.defaultSelectedDeviceId??null),v(0),b(0),S(Wm(a)),w(Km(a)),E(qm(a)),g([{id:`preset-${e}-${Date.now()}`,timestamp:`PRESET`,tool:`validate_rack`,summary:`Loaded preset '${a.project.project_name}' (${a.project.rack.standard.toUpperCase()} · ${a.project.rack.u_height}U · ${a.validation.error_count} Errors).`,status:a.validation.is_valid?`VALID`:`INVALID`,errorCount:a.validation.error_count,warningCount:a.validation.warning_count}]),typeof window<`u`&&window.location.hash.includes(`rack=v1.`)&&window.history.replaceState(null,``,`${window.location.pathname}${window.location.search}`)},[]),ge=(0,d.useCallback)(()=>{n.current=[],r.current=[];let e=lh(c);t.current=e;let i=Vm(e),a=oh.find(e=>e.id===c);f(i),ce(null),ae(null),B(a?.defaultSelectedDeviceId??null),c===`10inch-homelab`&&g(hh),v(0),b(0),S(Wm(i)),w(Km(i)),E(qm(i))},[c]),_e=(0,d.useCallback)(e=>{if(e===`collision`){let e=Bm(),i={...e,mounted_devices:(e.mounted_devices??[]).map(e=>e.instance_id===`pdu-u2-rear`?{...e,u_position:1,face:`rear`}:e)};n.current.push(structuredClone(t.current)),r.current=[],t.current=i;let a=Vm(i);f(a),v(n.current.length),b(0),S(Wm(a)),w(Km(a)),E(qm(a)),O(`3d`),R(!0),I(`side-cutaway`),B(`ups-u1`),g([{id:`sim-collision-${Date.now()}`,timestamp:`LIVE`,tool:`connect_cables`,summary:`PLUG_CLEARANCE_COLLISION on U1: 'ups-u1' rear Schuko/IEC plug (+45mm) collides with 'pdu-u2-rear' on U1 Rear.`,status:`INVALID`,errorCount:a.validation.error_count,warningCount:a.validation.warning_count},...hh.slice(-2)]);return}let i=Bm();n.current.push(structuredClone(t.current)),r.current=[],t.current=i;let a=Vm(i);f(a),v(n.current.length),b(0),S(Wm(a)),w(Km(a)),E(qm(a)),R(!1),I(`isometric`),B(`pdu-u2-rear`),g(hh)},[]),ve=(0,d.useCallback)((e,t,n,r)=>{let a=Math.max(1,Math.min(u.project.rack.u_height,Math.round(t))),o=Math.floor(100+Math.random()*900),s=`${e.split(`-`).slice(0,2).join(`-`)}-u${a}-${o}`;i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN?(H.current.send(JSON.stringify({type:`COMMAND`,tool:`mount_equipment`,args:{instance_id:s,blueprint_slug:e,u_position:a,face:n,...r?{hostname:r}:{}}})),B(s)):(de(t=>{let i=t.mounted_devices??[];return i.push({instance_id:s,blueprint_slug:e,u_position:a,face:n,...r?{hostname:r}:{},children:[]}),t.mounted_devices=i,t}),B(s))},[de,i,u.project.rack.u_height]),ye=(0,d.useCallback)(e=>{i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN?(H.current.send(JSON.stringify({type:`COMMAND`,tool:`modify_equipment`,args:{instance_id:e,action:`remove`,remove_connected_cables:!0}})),re===e&&B(null)):(de(t=>{let n=new Set([e]);return t.mounted_devices=(t.mounted_devices??[]).filter(t=>{if(t.instance_id===e){for(let e of t.children??[])n.add(e.instance_id);return!1}return t.children=(t.children??[]).filter(t=>t.instance_id!==e),!0}),t.cables=(t.cables??[]).filter(e=>!n.has(e.from.instance_id)&&!n.has(e.to.instance_id)),t}),re===e&&B(null))},[de,i,re]),be=(0,d.useCallback)((e,t,n,r,a,o,s,c,l)=>{let u=`cab-${e}-${t}-to-${n}-${r}`.toLowerCase().replace(/[^a-z0-9_-]/g,`-`),d={cable_id:u,cable_type:a,color_hex:a.startsWith(`power-`)?`#EF4444`:a.startsWith(`sfp-`)?`#06B6D4`:`#38BDF8`,label:`${e}:${t} -> ${n}:${r}`,from:{instance_id:e,port_id:t,...c?{face:c}:{}},to:{instance_id:n,port_id:r,...l?{face:l}:{}},...o===void 0?{}:{vlan_id:o},...s!==void 0&&s.trim().length>0?{ip_cidr:s.trim()}:{}};i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN?(H.current.send(JSON.stringify({type:`COMMAND`,tool:`connect_cables`,args:{cables:[d]}})),ae(u)):(de(e=>{let t=(e.cables??[]).filter(e=>e.cable_id!==u);return t.push(d),e.cables=t,e}),ae(u))},[de,i]),xe=(0,d.useCallback)((e,t)=>{if(V===null){if(t){ae(t),B(null);return}ce(e);return}if(V.instanceId===e.instanceId&&V.portId===e.portId&&V.worldFace===e.worldFace){ce(null);return}if(t){ce(null),ae(t),B(null);return}let n=gh(V.connectorType,e.connectorType);be(V.instanceId,V.portId,e.instanceId,e.portId,n,void 0,void 0,V.worldFace,e.worldFace),ce(null)},[be,V]),Se=(0,d.useCallback)(()=>{let e=ph(u.project);if(typeof window>`u`)return e;let t=`${window.location.origin}${window.location.pathname}${window.location.search}`;return window.history.replaceState(null,``,`${window.location.pathname}${window.location.search}${e}`),`${t}${e}`},[u.project]),Ce=(0,d.useCallback)(e=>{i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN?(H.current.send(JSON.stringify({type:`COMMAND`,tool:`disconnect_cables`,args:{cable_ids:[e]}})),ie===e&&ae(null)):(de(t=>(t.cables=(t.cables??[]).filter(t=>t.cable_id!==e),t)),ie===e&&ae(null))},[de,i,ie]),we=(0,d.useCallback)(e=>{try{let t=JSON.parse(e),n=rl.parse(t);return de(()=>n),!0}catch{return!1}},[de]),Te=(0,d.useCallback)(e=>{i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN?(H.current.send(JSON.stringify({type:`COMMAND`,tool:`init_rack`,args:{project_name:e.project_name,standard:e.standard,u_height:e.u_height,rail_depth_mm:e.rail_depth_mm,enclosure_type:e.enclosure_type,front_door_clearance_mm:e.standard===`19inch`?55:45,rear_clearance_mm:e.standard===`19inch`?60:40}})),B(null),ae(null)):(de(()=>({schema_version:`1.0`,project_name:e.project_name,rack:{standard:e.standard,u_height:e.u_height,rail_depth_mm:e.rail_depth_mm,enclosure_type:e.enclosure_type,front_door_clearance_mm:e.standard===`19inch`?55:45,rear_clearance_mm:e.standard===`19inch`?60:40},mounted_devices:[],cables:[]})),B(null),ae(null))},[de,i]),Ee=(0,d.useCallback)(()=>{i===`sidecar-live`&&H.current&&H.current.readyState===WebSocket.OPEN&&H.current.send(JSON.stringify({type:`COMMAND`,tool:`export_deliverables`,args:{formats:[`elevation-svg`,`wiring-svg`,`bom-md`,`scene-glb`,`carrier-scad`,`carrier-stl`]}}))},[i]),De=(0,d.useCallback)(()=>{i===`sidecar-live`&&!le.current&&H.current&&H.current.readyState===WebSocket.OPEN&&H.current.send(JSON.stringify({type:`COMMAND`,tool:`clear_tool_log`,args:{}})),g([])},[i]),Oe=(0,d.useCallback)(e=>{B(e),e!==null&&ae(null)},[]),ke=(0,d.useCallback)(e=>{ae(e),e!==null&&B(null)},[]);return(0,d.useEffect)(()=>{if(typeof window>`u`)return;let e=()=>{if(i===`sidecar-live`)return;let e=mh(window.location.hash);e&&(de(()=>e),ce(null),ae(null),B(e.mounted_devices?.[0]?.instance_id??null))};return window.addEventListener(`hashchange`,e),()=>{window.removeEventListener(`hashchange`,e)}},[de,i]),(0,d.useEffect)(()=>{if(typeof window>`u`||typeof WebSocket>`u`)return;let e=new URLSearchParams(window.location.search).get(`session`)?.trim()??``,n=/^[a-zA-Z0-9_-]{1,128}$/.test(e);if(window.location.hash.includes(`rack=v1.`)&&!n||window.navigator.userAgent.includes(`jsdom`)||window.navigator.userAgent.includes(`HappyDOM`))return;let r=!1,i=window.location.protocol===`https:`?`https:`:`http:`,o=window.location.protocol===`https:`?`wss:`:`ws:`,c=window.location.host||`127.0.0.1:3100`,l=n?`?session=${encodeURIComponent(e)}`:``,u=`${i}//${c}`,d=`${o}//${c}/ws${l}`;return(async()=>{let e=!1;try{let[t,n]=await Promise.all([fetch(`${u}/api/state${l}`),fetch(`${u}/api/catalog${l}`)]);if(!r&&t.ok){e=!0;let n=await t.json();f(n.scene),s(n.projectPath??null),v(n.undoAvailable),b(n.redoAvailable),g(Array.isArray(n.toolCallLog)?n.toolCallLog:[]),a(`sidecar-live`),await ue(u,l)}if(!r&&n.ok){let e=await n.json();Array.isArray(e.blueprints)&&m(e.blueprints)}}catch{}if(!r&&e)try{let e=new WebSocket(d);H.current=e,e.onopen=()=>{r||a(`sidecar-live`)},e.onmessage=e=>{if(!r)try{let n=JSON.parse(String(e.data));n.readOnly!==void 0&&(le.current=n.readOnly),(n.type===`INITIAL_STATE`||n.type===`STATE_UPDATED`||n.type===`RACK_SCENE_UPDATE`)&&n.scene&&(t.current=structuredClone(n.scene.project),f(n.scene),n.projectPath!==void 0&&s(n.projectPath??null),Array.isArray(n.blueprints)&&m(n.blueprints),v(n.undoAvailable??0),b(n.redoAvailable??0),Array.isArray(n.toolCallLog)&&g(n.toolCallLog),S(Wm(n.scene)),w(Km(n.scene)),E(qm(n.scene)),ue(u,l))}catch{}},e.onclose=()=>{r||a(`standalone-demo`)}}catch{}})(),()=>{r=!0,H.current&&=(H.current.close(),null)}},[ue]),(0,d.useEffect)(()=>{if(typeof document>`u`||!(`modelContext`in document))return;let e=document.modelContext;if(!e)return;let t=new AbortController,n=t.signal;return(async()=>{try{await e.registerTool({name:Gl.validate_rack.name,description:Gl.validate_rack.description,inputSchema:{type:`object`,properties:{}},annotations:{readOnlyHint:Gl.validate_rack.annotations.readOnlyHint},execute:()=>({status:u.validation.status,is_valid:u.validation.is_valid,error_count:u.validation.error_count,warning_count:u.validation.warning_count,issues:u.validation.issues,power_summary:u.validation.power_summary,mechanical_summary:u.validation.mechanical_summary})},{signal:n}),await e.registerTool({name:Gl.search_catalog.name,description:Gl.search_catalog.description,inputSchema:{type:`object`,properties:{query:{type:`string`},category:{type:`string`}}},annotations:{readOnlyHint:Gl.search_catalog.annotations.readOnlyHint},execute:e=>{let t=typeof e.query==`string`?e.query.toLowerCase():``,n=p.filter(e=>!t||e.slug.toLowerCase().includes(t)||e.model.toLowerCase().includes(t)||e.manufacturer.toLowerCase().includes(t));return{count:n.length,blueprints:n.map(e=>({slug:e.slug,manufacturer:e.manufacturer,model:e.model,category:e.category,u_height:e.geometry.u_height,depth_mm:e.geometry.depth_mm}))}}},{signal:n}),await e.registerTool({name:Gl.undo_redo.name,description:Gl.undo_redo.description,inputSchema:{type:`object`,properties:{action:{type:`string`,enum:[`undo`,`redo`]}},required:[`action`]},annotations:{readOnlyHint:Gl.undo_redo.annotations.readOnlyHint},execute:e=>(e.action===`redo`?me():pe(),{status:`OK`,action:e.action})},{signal:n})}catch{}})(),()=>{t.abort()}},[p,me,u.validation,pe]),{connectionMode:i,projectPath:o,activePresetId:c,scene:u,catalog:p,mcpToolLog:h,undoAvailable:_,redoAvailable:y,elevationSvg:x,wiringSvg:C,bomMarkdown:T,activeTab:D,xrayMode:k,explodeZMm:j,cableFilter:N,cameraPreset:F,showClearanceBoxes:L,doorOpen:z,catalogDrawerOpen:te,selectedDeviceId:re,selectedCableId:ie,hoveredPort:oe,pendingPort:V,setActiveTab:O,setXrayMode:A,setExplodeZMm:M,setCableFilter:P,setCameraPreset:I,setShowClearanceBoxes:R,setDoorOpen:ee,setCatalogDrawerOpen:ne,selectPreset:he,buildShareableRackUrl:Se,selectDevice:Oe,selectCable:ke,setHoveredPort:se,setPendingPort:ce,handlePortClick3D:xe,moveDeviceU:fe,mountEquipmentFromCatalog:ve,removeEquipment:ye,connectInteractiveCable:be,disconnectCable:Ce,importProjectJson:we,initNewRack:Te,exportDeliverablesToDisk:Ee,clearMcpToolLog:De,simulateAgentStep:_e,undo:pe,redo:me,resetDemoScene:ge}}var $=n();function vh({rack:e,xrayMode:t,doorOpen:n}){let r=h[e.standard],i=r.W_panel,a=r.X_aperture_min,o=e.u_height*p,s=e.rail_depth_mm,c=t?.15:1,l=-e.front_door_clearance_mm,u=n?-105*Math.PI/180:0;return(0,$.jsxs)(`group`,{children:[[[-10,o/2,-10],[i+10,o/2,-10],[-10,o/2,s+10],[i+10,o/2,s+10]].map(([e,n,r],i)=>(0,$.jsxs)(`mesh`,{position:[e,n,r],children:[(0,$.jsx)(`boxGeometry`,{args:[20,o+40,20]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#3F3F46`,metalness:.68,roughness:.32,transparent:t,opacity:c,depthWrite:!t})]},`post-${i}`)),[-10,o+10].map((e,n)=>(0,$.jsxs)(`mesh`,{position:[i/2,e,s/2],children:[(0,$.jsx)(`boxGeometry`,{args:[i+40,13,s+40]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#27272A`,metalness:.58,roughness:.42,transparent:t,opacity:c,depthWrite:!t})]},`plate-${n}`)),[[a/2,o/2,1.5],[i-a/2,o/2,1.5],[a/2,o/2,s-1.5],[i-a/2,o/2,s-1.5]].map(([e,n,r],i)=>(0,$.jsxs)(`mesh`,{position:[e,n,r],children:[(0,$.jsx)(`boxGeometry`,{args:[a,o,3]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#71717A`,metalness:.78,roughness:.26,transparent:t,opacity:c,depthWrite:!t})]},`rail-${i}`)),Array.from({length:e.u_height},(e,t)=>t+1).map(e=>{let t=(e-1)*p;return(0,$.jsxs)(`group`,{children:[(0,$.jsxs)(`mesh`,{position:[-10,t+p/2,-.5],children:[(0,$.jsx)(`boxGeometry`,{args:[10,14,2]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#0EA5E9`,roughness:.4})]}),m.map((n,r)=>(0,$.jsxs)(`group`,{children:[(0,$.jsxs)(`mesh`,{position:[a/2,t+n,-.2],children:[(0,$.jsx)(`boxGeometry`,{args:[4.5,4.5,1.2]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#020617`})]}),(0,$.jsxs)(`mesh`,{position:[i-a/2,t+n,-.2],children:[(0,$.jsx)(`boxGeometry`,{args:[4.5,4.5,1.2]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#020617`})]})]},`hole-${e}-${r}`))]},`u-ticks-${e}`)}),e.enclosure_type!==`open-frame`&&(0,$.jsx)(`group`,{position:[-10,o/2,l],rotation:[0,u,0],children:(0,$.jsxs)(`mesh`,{position:[(i+20)/2,0,0],children:[(0,$.jsx)(`boxGeometry`,{args:[i+20,o,4]}),(0,$.jsx)(`meshPhysicalMaterial`,{color:`#38BDF8`,transparent:!0,opacity:t?.05:.16,roughness:.1,metalness:.1,transmission:.65,depthWrite:!1})]})})]})}function yh(e,t){return!e||t===0?0:e.face===`rear`?t:e.mount_target===`carrier-slot`?t*.25:-t*.65}function bh({route:e,cable:t,devicesById:n,explodeZMm:r,isHighlighted:o,isDimmed:c,onSelectCable:u}){let f=xu(t.cable_type)?3.2:2.3,p=n.get(t.from.instance_id),m=n.get(t.to.instance_id),h=yh(p,r),g=yh(m,r),{tubeGeo:_,startBootPos:v,startBootQuat:y,endBootPos:b,endBootQuat:x}=(0,d.useMemo)(()=>{let t=e.spline_points,n=t.length,r=t.map((e,t)=>{let r=n>1?t/(n-1):0,i=h*(1-r)+g*r;return new l(e.x,e.y,e.z+i)});if(r.length>=2){let t=e.waypoints,n=t.length>=2?Math.sign(t[1].z-t[0].z):-1;if(p){let e=n<0?Math.min(r[0].z,p.chassis_box.min.z+h-1.6):Math.max(r[0].z,p.chassis_box.max.z+h+1.6);r[0].z=e}let i=t.length>=2?Math.sign(t[t.length-2].z-t[t.length-1].z):-1;if(m){let e=r.length-1,t=i<0?Math.min(r[e].z,m.chassis_box.min.z+g-1.6):Math.max(r[e].z,m.chassis_box.max.z+g+1.6);r[e].z=t}}let o=new a(r.length>=2?r:[new l(0,0,0),new l(0,10,0)],!1,`centripetal`,.5),c=Math.max(96,Math.min(192,r.length)),u=new s(o,c,f,12,!1),d=r[0],_=e.waypoints,v=_.length>=2?new l(_[1].x-_[0].x,_[1].y-_[0].y,_[1].z-_[0].z).normalize():new l().subVectors(r[Math.min(1,r.length-1)],d).normalize();v.lengthSq()<1e-6&&v.set(0,0,-1);let y=new i().setFromUnitVectors(new l(0,1,0),v),b=d.clone().addScaledVector(v,4.5),x=r[r.length-1],S=_.length>=2?new l(_[_.length-2].x-_[_.length-1].x,_[_.length-2].y-_[_.length-1].y,_[_.length-2].z-_[_.length-1].z).normalize():new l().subVectors(r[Math.max(0,r.length-2)],x).normalize();S.lengthSq()<1e-6&&S.set(0,0,-1);let C=new i().setFromUnitVectors(new l(0,1,0),S),w=x.clone().addScaledVector(S,4.5);return{tubeGeo:u,startBootPos:[b.x,b.y,b.z],startBootQuat:y,endBootPos:[w.x,w.y,w.z],endBootQuat:C}},[g,p,e.spline_points,e.waypoints,h,m,f]),S=t=>{t.stopPropagation(),u(e.cable_id)},C=c?.2:1,w=Cu(t.color_hex,`3d-dark`);return(0,$.jsxs)(`group`,{onClick:S,children:[(0,$.jsx)(`mesh`,{geometry:_,children:(0,$.jsx)(`meshStandardMaterial`,{color:w,roughness:.42,metalness:.14,emissive:o?w:`#000000`,emissiveIntensity:o?.45:0,transparent:c,opacity:C})}),(0,$.jsxs)(`mesh`,{position:v,quaternion:y,children:[(0,$.jsx)(`cylinderGeometry`,{args:[f*1.15,f*1.48,10,12]}),(0,$.jsx)(`meshStandardMaterial`,{color:o?w:`#27272A`,roughness:.5,metalness:.3,transparent:c,opacity:C})]}),(0,$.jsxs)(`mesh`,{position:b,quaternion:x,children:[(0,$.jsx)(`cylinderGeometry`,{args:[f*1.15,f*1.48,10,12]}),(0,$.jsx)(`meshStandardMaterial`,{color:o?w:`#27272A`,roughness:.5,metalness:.3,transparent:c,opacity:C})]})]})}function xh(e){switch(e){case`rj45`:case`rj45-serial-console`:return{w:12.2,h:10,d:3.2,color:`#0F172A`};case`sfp-plus`:return{w:14.5,h:9.2,d:3.6,color:`#334155`};case`iec-c13`:case`iec-c14`:return{w:24,h:16,d:3.8,color:`#111827`};case`schuko-cee7`:return{w:34,h:34,d:4.2,color:`#1E293B`};case`usb-c`:return{w:9,h:3.6,d:2.6,color:`#475569`};case`usb-a`:return{w:12.5,h:5.5,d:2.8,color:`#1E3A8A`};case`dc-5525`:return{w:8.5,h:8.5,d:3,color:`#1F2937`};default:return{w:6,h:6,d:2.5,color:`#3F6212`}}}function Sh({port:e,cables:t,externalEndpoints:n=[],faceSurfaceZMm:r,explodeOffsetZMm:i,isHighlighted:a,isPendingSource:o=!1,onHoverPort:s,onClickPort:c}){let l=(0,d.useMemo)(()=>xh(e.connector_type),[e.connector_type]),u=(0,d.useMemo)(()=>t.find(t=>t.from.instance_id===e.instance_id&&t.from.port_id===e.port_id&&(t.from.face??e.world_face)===e.world_face||t.to.instance_id===e.instance_id&&t.to.port_id===e.port_id&&(t.to.face??e.world_face)===e.world_face),[t,e.instance_id,e.port_id,e.world_face]),f=(0,d.useMemo)(()=>n.find(t=>t.patch_panel_instance_id===e.instance_id&&t.patch_panel_port_id===e.port_id),[n,e.instance_id,e.port_id]),p=!!(u||f),m=(0,d.useMemo)(()=>{if(u){let t=u.from.instance_id===e.instance_id&&u.from.port_id===e.port_id?u.to:u.from,n=f?` · 🏠 ${f.label}${f.room_or_zone?` (${f.room_or_zone})`:``}`:``;return`${t.instance_id}:${t.port_id}${n}`}if(f)return`🏠 ${f.label}${f.room_or_zone?` (${f.room_or_zone})`:``} [Rear Drop]`},[u,f,e.instance_id,e.port_id]),h=(0,d.useMemo)(()=>e.capabilities.some(e=>e.startsWith(`poe`))||(f?.poe_draw_watts??0)>0,[f,e.capabilities]),g=e.world_normal.z===0?-1:e.world_normal.z,_=r??e.world_position.z,v=e.world_position.x,y=e.world_position.y,b=_+i+g*(l.d*.45);return(0,$.jsxs)(`group`,{position:[v,y,b],onClick:t=>{c&&(t.stopPropagation(),(e.world_face!==`rear`||f===void 0||u)&&c({instanceId:e.instance_id,portId:e.port_id,label:e.label,connectorType:e.connector_type,worldFace:e.world_face},u?.cable_id))},onPointerOver:t=>{t.stopPropagation(),s({instanceId:e.instance_id,portId:e.port_id,label:e.label,connectorType:e.connector_type,worldFace:e.world_face,worldPosMm:e.world_position,connectedCableId:u?.cable_id??f?.endpoint_id,peerDescription:m})},onPointerOut:e=>{e.stopPropagation(),s(null)},children:[(0,$.jsxs)(`mesh`,{children:[(0,$.jsx)(`boxGeometry`,{args:[l.w+1,l.h+1,l.d*.7]}),(0,$.jsx)(`meshStandardMaterial`,{color:o?`#10B981`:a?`#38BDF8`:`#52525B`,metalness:.78,roughness:.28})]}),(0,$.jsxs)(`mesh`,{position:[0,0,g*.35],children:[(0,$.jsx)(`boxGeometry`,{args:[l.w,l.h,l.d]}),(0,$.jsx)(`meshStandardMaterial`,{color:o?`#10B981`:a?`#38BDF8`:l.color,metalness:.55,roughness:.35,emissive:o?`#059669`:a?`#0284C7`:p?`#0F172A`:`#000000`,emissiveIntensity:o?.85:a?.5:.15})]}),(0,$.jsxs)(`mesh`,{position:[0,0,g*(l.d*.52)],children:[(0,$.jsx)(`boxGeometry`,{args:[l.w*.74,l.h*.68,l.d*.48]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#020617`,roughness:.9,metalness:.08})]}),(e.connector_type===`rj45`||e.connector_type===`sfp-plus`)&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)(`mesh`,{position:[-l.w*.3,l.h*.34,g*(l.d*.72)],children:[(0,$.jsx)(`boxGeometry`,{args:[2.2,1.4,.7]}),(0,$.jsx)(`meshStandardMaterial`,{color:p?`#22C55E`:`#334155`,emissive:p?`#22C55E`:`#000000`,emissiveIntensity:p?.95:0})]}),(0,$.jsxs)(`mesh`,{position:[l.w*.3,l.h*.34,g*(l.d*.72)],children:[(0,$.jsx)(`boxGeometry`,{args:[2.2,1.4,.7]}),(0,$.jsx)(`meshStandardMaterial`,{color:p&&h?`#F59E0B`:p?`#10B981`:`#334155`,emissive:p&&h?`#F59E0B`:p?`#10B981`:`#000000`,emissiveIntensity:p?.9:0})]})]})]})}function Ch(e){switch(e){case`coated-aluminum`:return{metalness:.65,roughness:.28};case`matte-black-steel`:return{metalness:.48,roughness:.45};case`3d-printed-petg`:case`3d-printed-asa`:case`3d-printed-pla`:return{metalness:.08,roughness:.72};default:return{metalness:.35,roughness:.5}}}function wh({device:e,rackStandard:t,cables:n,cableRoutes:r=[],externalEndpoints:i=[],xrayMode:a,explodeZMm:o,showClearanceBoxes:s,isSelected:c,pendingPort:l=null,onSelectDevice:u,onHoverPort:d,onClickPort:f}){let p=h[t],m=yh(e,o),g=e.chassis_box,_=g.max.x-g.min.x,v=g.max.y-g.min.y,y=g.max.z-g.min.z,b=(g.min.x+g.max.x)/2,x=(g.min.y+g.max.y)/2,S=(g.min.z+g.max.z)/2+m,C=Ch(e.blueprint.visuals.material_preset),w=e.blueprint.visuals.chassis_color_hex,T=e.blueprint.category===`brush-panel`,E=e.blueprint.category===`shelf`,D=e.blueprint.category===`nas`,O=e.mount_target===`rack-unit`&&e.blueprint.visuals.material_preset===`polycarbonate`&&v<38,k=e.mount_target===`rack-unit`&&e.blueprint.geometry.ear_mount_style!==`none`,A=Math.max(p.X_aperture_min,(p.W_panel-_)/2),j=(p.W_panel-p.W_holes)/2,M=p.W_panel-j,N=O?`#18181B`:w,P=O?Math.max(v,43.2):v,F=O?3.8:3.2,I=(e.face===`front`?g.min.z+F/2:g.max.z-F/2)+m,L=t=>{t.stopPropagation(),u(e.instance_id)},R=[];if(T){for(let t of r)if(t.portal_u===e.u_position){let e=t.waypoints.find(e=>Math.abs(e.y-x)<=v*.65);e&&R.push(e.x)}}let z=e.blueprint.category===`modular-carrier`,ee=e.blueprint.category===`blank-panel`||e.blueprint.category===`blanking-panel`,te=z?[...e.slots].sort((e,t)=>e.world_bounds.min.x-t.world_bounds.min.x):[],ne=(e.face===`front`?g.min.z+2.1:g.max.z-2.1)+m,re=[];if(z){let e=g.min.x;for(let t of te){let n=Math.max(g.min.x,t.world_bounds.min.x),r=Math.min(g.max.x,t.world_bounds.max.x),i=Math.max(g.min.y,t.world_bounds.min.y),a=Math.min(g.max.y,t.world_bounds.max.y);if(n-e>.5){let r=n-e;re.push({key:`pillar-${t.slot_definition.slot_id}`,cx:e+r/2,cy:x,w:r,h:v})}let o=Math.max(1,r-n);if(i-g.min.y>.5){let e=i-g.min.y;re.push({key:`below-${t.slot_definition.slot_id}`,cx:n+o/2,cy:g.min.y+e/2,w:o,h:e})}if(g.max.y-a>.5){let e=g.max.y-a;re.push({key:`above-${t.slot_definition.slot_id}`,cx:n+o/2,cy:a+e/2,w:o,h:e})}e=Math.max(e,r)}if(g.max.x-e>.5){let t=g.max.x-e;re.push({key:`pillar-right-end`,cx:e+t/2,cy:x,w:t,h:v})}}return(0,$.jsxs)(`group`,{children:[z?(0,$.jsxs)(`group`,{onClick:L,children:[(0,$.jsxs)(`mesh`,{position:[b,g.min.y+1.6,S],children:[(0,$.jsx)(`boxGeometry`,{args:[Math.min(_,p.W_aperture-1.5),3.2,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[b-Math.min(_,p.W_aperture-1.5)/2+1.75,g.min.y+v*.28,S],children:[(0,$.jsx)(`boxGeometry`,{args:[3.5,v*.56,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[b+Math.min(_,p.W_aperture-1.5)/2-1.75,g.min.y+v*.28,S],children:[(0,$.jsx)(`boxGeometry`,{args:[3.5,v*.56,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),re.map(e=>(0,$.jsxs)(`mesh`,{position:[e.cx,e.cy,ne],children:[(0,$.jsx)(`boxGeometry`,{args:[e.w,e.h,4.2]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]},e.key))]}):T?(0,$.jsxs)(`group`,{onClick:L,children:[(0,$.jsxs)(`mesh`,{position:[b,g.max.y-3.75,S],children:[(0,$.jsx)(`boxGeometry`,{args:[_,7.5,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#27272A`,metalness:.62,roughness:.34,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[b,g.min.y+3.75,S],children:[(0,$.jsx)(`boxGeometry`,{args:[_,7.5,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#27272A`,metalness:.62,roughness:.34,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[g.min.x+9,x,S],children:[(0,$.jsx)(`boxGeometry`,{args:[18,v,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#27272A`,metalness:.62,roughness:.34,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[g.max.x-9,x,S],children:[(0,$.jsx)(`boxGeometry`,{args:[18,v,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#27272A`,metalness:.62,roughness:.34,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[b,g.max.y-8.2,(e.face===`front`?g.min.z-.5:g.max.z+.5)+m],children:[(0,$.jsx)(`boxGeometry`,{args:[Math.max(20,_-32),1.8,1.4]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#71717A`,metalness:.78,roughness:.25})]}),(0,$.jsxs)(`mesh`,{position:[b,g.min.y+8.2,(e.face===`front`?g.min.z-.5:g.max.z+.5)+m],children:[(0,$.jsx)(`boxGeometry`,{args:[Math.max(20,_-32),1.8,1.4]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#71717A`,metalness:.78,roughness:.25})]}),(()=>{let e=Math.max(24,_-36),t=Math.max(18,Math.min(44,Math.floor(e/8.5))),n=e/t,r=Math.max(2,n*.78),i=Math.max(4,(v-17.5)/2),a=[];for(let e=0;e<t;e++){let t=g.min.x+18+(e+.5)*n,o=R.some(e=>Math.abs(e-t)<n*1.15)?Math.max(2.5,i-3.6):i-.7,s=e%2==0?-.35:.35,c=e%2==0?`#09090B`:`#18181B`;a.push((0,$.jsxs)(`group`,{children:[(0,$.jsxs)(`mesh`,{position:[t,g.max.y-8.5-o/2,S+s],children:[(0,$.jsx)(`boxGeometry`,{args:[r,o,Math.max(4,y*.52)]}),(0,$.jsx)(`meshStandardMaterial`,{color:c,roughness:.94,metalness:.04})]}),(0,$.jsxs)(`mesh`,{position:[t,g.min.y+8.5+o/2,S-s],children:[(0,$.jsx)(`boxGeometry`,{args:[r,o,Math.max(4,y*.52)]}),(0,$.jsx)(`meshStandardMaterial`,{color:c,roughness:.94,metalness:.04})]})]},`bristle-${e}`))}return a})()]}):E?(0,$.jsxs)(`group`,{onClick:L,children:[(0,$.jsxs)(`mesh`,{position:[b,g.min.y+1.6,S],children:[(0,$.jsx)(`boxGeometry`,{args:[_,3.2,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[b,g.min.y+7,(e.face===`front`?g.min.z+2:g.max.z-2)+m],children:[(0,$.jsx)(`boxGeometry`,{args:[_,14,4]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[g.min.x+1.8,g.min.y+v*.35,S],children:[(0,$.jsx)(`boxGeometry`,{args:[3.6,v*.7,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[g.max.x-1.8,g.min.y+v*.35,S],children:[(0,$.jsx)(`boxGeometry`,{args:[3.6,v*.7,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,transparent:a,opacity:a?.16:1,depthWrite:!a})]})]}):(0,$.jsxs)(`mesh`,{position:[b,x,S],onClick:L,children:[(0,$.jsx)(`boxGeometry`,{args:[_,v,y]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:C.metalness,roughness:C.roughness,emissive:c?`#3B82F6`:`#000000`,emissiveIntensity:c?.18:0,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),D&&(()=>{let t=e.blueprint.slug,n=t.includes(`8bay`)||t.includes(`rs1221`)?8:t.includes(`unas-pro`)?7:t.includes(`4bay`)||t.includes(`433`)?4:2,r=n>=8&&v>=70?2:1,i=Math.ceil(n/r),a=e.blueprint.visuals.has_oled_display?42:18,o=Math.max(40,_-a-22),s=Math.max(18,v-14),c=o/i,l=s/r,u=Math.max(12,c*.84),d=Math.max(10,l*.78),f=(e.face===`front`?g.min.z-1.2:g.max.z+1.2)+m,p=[];for(let t=0;t<n;t++){let n=Math.floor(t/i),r=t%i,o=g.min.x+a+(r+.5)*c,s=g.min.y+7+(n+.5)*l;p.push((0,$.jsxs)(`group`,{children:[(0,$.jsxs)(`mesh`,{position:[o,s,f],children:[(0,$.jsx)(`boxGeometry`,{args:[u,d,1.4]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#18181B`,metalness:.45,roughness:.55})]}),(0,$.jsxs)(`mesh`,{position:[o-u*.08,s,f+(e.face===`front`?-.6:.6)],children:[(0,$.jsx)(`boxGeometry`,{args:[u*.68,Math.min(6,d*.32),.9]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#71717A`,metalness:.75,roughness:.28})]}),(0,$.jsxs)(`mesh`,{position:[o+u*.36,s+d*.26,f+(e.face===`front`?-.6:.6)],children:[(0,$.jsx)(`boxGeometry`,{args:[1.8,1.8,.8]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#10B981`,emissive:`#10B981`,emissiveIntensity:.85})]})]},`hdd-sled-${t}`))}return(0,$.jsx)(`group`,{onClick:L,children:p})})(),!z&&!E&&!ee&&e.blueprint.category!==`keystone-module`&&e.blueprint.category!==`brush-panel`&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)(`mesh`,{position:[b,x,(e.face===`front`?g.min.z-.5:g.max.z+.5)+m],onClick:L,children:[(0,$.jsx)(`boxGeometry`,{args:[Math.max(8,_-6),Math.max(6,v-4),1]}),(0,$.jsx)(`meshStandardMaterial`,{color:w,metalness:Math.min(.85,C.metalness+.15),roughness:Math.max(.18,C.roughness-.12),transparent:a,opacity:a?.18:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[g.max.x-10,g.max.y-6,(e.face===`front`?g.min.z-1.1:g.max.z+1.1)+m],children:[(0,$.jsx)(`boxGeometry`,{args:[2.6,2.6,.8]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#10B981`,emissive:`#10B981`,emissiveIntensity:.9})]})]}),ee&&(0,$.jsxs)(`group`,{onClick:L,children:[(0,$.jsxs)(`mesh`,{position:[b,x,(e.face===`front`?g.min.z-.45:g.max.z+.45)+m],children:[(0,$.jsx)(`boxGeometry`,{args:[Math.max(12,_-14),Math.max(8,v-7),.9]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#111115`,metalness:.22,roughness:.72,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(()=>{let t=e.blueprint.slug,n=(e.face===`front`?g.min.z-1.05:g.max.z+1.05)+m,r=w.toUpperCase()===`#E5E7EB`||w.toUpperCase()===`#D1D5DB`?`#9CA3AF`:`#3F3F46`;if(t.includes(`hex`)){let e=v>60?5:2,t=_>300?18:_>180?11:6,i=Math.max(24,_-34),o=Math.max(12,v-14),s=t>1?i/(t-1):0,c=e>1?o/(e-1):0,l=[];for(let u=0;u<e;u++){let e=u%2==1?s*.45:0,d=u%2==1?Math.max(1,t-1):t;for(let t=0;t<d;t++){let d=b-i/2+t*s+e,f=x-o/2+u*c;l.push((0,$.jsxs)(`mesh`,{position:[d,f,n],rotation:[Math.PI/2,0,0],children:[(0,$.jsx)(`cylinderGeometry`,{args:[3.4,3.4,1.1,6]}),(0,$.jsx)(`meshStandardMaterial`,{color:r,metalness:.35,roughness:.48,transparent:a,opacity:a?.18:1,depthWrite:!a})]},`hex-${u}-${t}`))}}return l}if(t.includes(`ribs`)){let e=_>300?20:_>180?12:7,t=Math.max(24,_-32),i=Math.max(10,v-13),o=e>1?t/(e-1):0;return Array.from({length:e},(e,s)=>{let c=b-t/2+s*o;return(0,$.jsxs)(`mesh`,{position:[c,x,n],children:[(0,$.jsx)(`boxGeometry`,{args:[3.2,i,1.2]}),(0,$.jsx)(`meshStandardMaterial`,{color:r,metalness:.4,roughness:.42,transparent:a,opacity:a?.18:1,depthWrite:!a})]},`rib-${s}`)})}let i=v>60?6:3,o=Math.max(20,_-28),s=Math.max(10,v-14),c=i>1?s/(i-1):0;return Array.from({length:i},(e,t)=>{let i=x-s/2+t*c;return(0,$.jsxs)(`mesh`,{position:[b,i,n],children:[(0,$.jsx)(`boxGeometry`,{args:[o,2.2,1.2]}),(0,$.jsx)(`meshStandardMaterial`,{color:r,metalness:.42,roughness:.38,transparent:a,opacity:a?.18:1,depthWrite:!a})]},`line-${t}`)})})()]}),c&&(0,$.jsxs)(`mesh`,{position:[b,x,S],children:[(0,$.jsx)(`boxGeometry`,{args:[_+1.5,v+1.5,y+1.5]}),(0,$.jsx)(`meshBasicMaterial`,{color:`#3B82F6`,wireframe:!0})]}),O&&(0,$.jsxs)(`group`,{onClick:L,children:[(0,$.jsxs)(`mesh`,{position:[b,g.min.y-1.4,S],children:[(0,$.jsx)(`boxGeometry`,{args:[p.W_aperture-1.5,2.8,y+2]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#18181B`,metalness:.08,roughness:.72,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(()=>{let e=Math.max(2.5,(p.W_aperture-1.5-_)/2);return(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)(`mesh`,{position:[g.min.x-e/2,x-1,S],children:[(0,$.jsx)(`boxGeometry`,{args:[e,v+2.8,y+2]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#18181B`,metalness:.08,roughness:.72,transparent:a,opacity:a?.16:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[g.max.x+e/2,x-1,S],children:[(0,$.jsx)(`boxGeometry`,{args:[e,v+2.8,y+2]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#18181B`,metalness:.08,roughness:.72,transparent:a,opacity:a?.16:1,depthWrite:!a})]})]})})()]}),k&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)(`mesh`,{position:[A/2,x,I],onClick:L,children:[(0,$.jsx)(`boxGeometry`,{args:[A,P,F]}),(0,$.jsx)(`meshStandardMaterial`,{color:N,metalness:O?.08:C.metalness,roughness:O?.72:C.roughness,transparent:a,opacity:a?.15:1,depthWrite:!a})]}),(0,$.jsxs)(`mesh`,{position:[p.W_panel-A/2,x,I],onClick:L,children:[(0,$.jsx)(`boxGeometry`,{args:[A,P,F]}),(0,$.jsx)(`meshStandardMaterial`,{color:N,metalness:O?.08:C.metalness,roughness:O?.72:C.roughness,transparent:a,opacity:a?.15:1,depthWrite:!a})]}),[j,M].map(t=>[x-P/2+6.35,x+P/2-6.35].map(n=>(0,$.jsxs)(`mesh`,{position:[t,n,I+(e.face===`front`?-2:2)],rotation:[Math.PI/2,0,0],children:[(0,$.jsx)(`cylinderGeometry`,{args:[2.8,2.8,2.2,12]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#E2E8F0`,metalness:.85,roughness:.2})]},`${t}-${n}`)))]}),e.blueprint.visuals.has_oled_display&&(0,$.jsxs)(`mesh`,{position:[g.min.x+Math.min(24,_*.18),x,(e.face===`front`?g.min.z-1.3:g.max.z+1.3)+m],children:[(0,$.jsx)(`boxGeometry`,{args:[20,Math.min(16,v*.46),1.4]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#0EA5E9`,emissive:`#38BDF8`,emissiveIntensity:.95,roughness:.15})]}),s&&e.plug_clearance_box&&(0,$.jsxs)(`mesh`,{position:[(e.plug_clearance_box.min.x+e.plug_clearance_box.max.x)/2,(e.plug_clearance_box.min.y+e.plug_clearance_box.max.y)/2,(e.plug_clearance_box.min.z+e.plug_clearance_box.max.z)/2+m],children:[(0,$.jsx)(`boxGeometry`,{args:[e.plug_clearance_box.max.x-e.plug_clearance_box.min.x,e.plug_clearance_box.max.y-e.plug_clearance_box.min.y,e.plug_clearance_box.max.z-e.plug_clearance_box.min.z]}),(0,$.jsx)(`meshBasicMaterial`,{color:`#F59E0B`,wireframe:!0,transparent:!0,opacity:.75})]}),e.ports.map(t=>{let r=g.min.z-.8,a=g.max.z+.8,o=t.world_face===`front`?r:a,s=t.world_face===`front`?`rear`:`front`,u=l!==null&&l.instanceId===t.instance_id&&l.portId===t.port_id&&l.worldFace===t.world_face,p=l!==null&&l.instanceId===t.instance_id&&l.portId===t.port_id&&l.worldFace===s;return(0,$.jsxs)(`group`,{children:[(0,$.jsx)(Sh,{port:t,cables:n,externalEndpoints:i,faceSurfaceZMm:o,explodeOffsetZMm:m,isHighlighted:c,isPendingSource:u,onHoverPort:d,onClickPort:f}),t.is_passthrough_coupler&&(0,$.jsx)(Sh,{port:{...t,world_face:s,world_normal:{x:0,y:0,z:t.world_face===`front`?1:-1}},cables:n,externalEndpoints:i,faceSurfaceZMm:t.world_face===`front`?a:r,explodeOffsetZMm:m,isHighlighted:c,isPendingSource:p,onHoverPort:d,onClickPort:f})]},`${e.instance_id}:${t.port_id}:${t.world_face}`)})]})}function Th(){if(typeof window>`u`||typeof document>`u`||window.navigator.userAgent.includes(`jsdom`)||window.navigator.userAgent.includes(`HappyDOM`))return!1;try{let e=document.createElement(`canvas`);return!!(e.getContext(`webgl2`)??e.getContext(`webgl`))}catch{return!1}}function Eh({preset:e,center:t,panelWidthMm:n,totalHeightMm:r,railDepthMm:i}){let{camera:a}=c(),[o,s,l]=t;return(0,d.useEffect)(()=>{switch(e){case`front`:a.position.set(o,s,-520);break;case`rear`:a.position.set(o,s,i+520);break;case`side-cutaway`:a.position.set(n+560,s,l);break;case`top`:a.position.set(o,r+560,l-10);break;default:a.position.set(n+340,r*.88+140,-420)}a.lookAt(o,s,l),a.updateProjectionMatrix()},[a,o,s,l,n,e,i,r]),(0,$.jsx)(u,{target:[o,s,l],makeDefault:!0,enableDamping:!0,dampingFactor:.08})}function Dh({externalEndpoints:e,cables:t,devicesById:n,panelWidthMm:r,totalHeightMm:i,railDepthMm:o,explodeZMm:c,cableFilter:u,selectedCableId:f,onSelectCable:p}){let m=(0,d.useMemo)(()=>{if(u===`none`||u===`power`)return[];let d=[];return e.forEach((f,p)=>{if(u===`poe`&&f.poe_draw_watts<=0)return;let m=n.get(f.patch_panel_instance_id);if(!m)return;let h=m.ports.find(e=>e.port_id===f.patch_panel_port_id);if(!h)return;let g=t.find(e=>e.from.instance_id===f.patch_panel_instance_id&&e.from.port_id===f.patch_panel_port_id&&e.from.face!==`rear`||e.to.instance_id===f.patch_panel_instance_id&&e.to.port_id===f.patch_panel_port_id&&e.to.face!==`rear`),_=yh(m,c),v=h.world_position.x,y=h.world_position.y,b=m.chassis_box.max.z+_+2.2,x=Math.min(o-26,Math.max(b+56,Math.min(135,o*.45))),S=f.entry_position===`bottom-rear`,C=S?-24:i+30,w=S?4:i-2,T=S?Math.max(8,y-9.5-p%3*2):Math.min(i-8,y+9.5+p%3*2),E=r/2+(p-(e.length-1)/2)*Math.min(8,r*.62/Math.max(1,e.length)),D=x+p%2*4.5,O=b+30+p%4*5,k=vu([{x:E,y:C,z:D},{x:E,y:w,z:D},{x:E,y:T,z:D},{x:E,y:T,z:O},{x:v,y:T,z:O},{x:v,y,z:b+14},{x:v,y,z:b}],14).map(e=>new l(e.x,e.y,e.z)),A=new a(k,!1,`centripetal`,.5),j=new s(A,64,1.85,10,!1);d.push({ext:f,linkedFrontCableId:g?.cable_id??null,tubeGeo:j,bootPos:[v,y,b+4.5]})}),d},[u,t,n,c,e,r,o,i]);if(m.length===0)return null;let h=n.get(e[0]?.patch_panel_instance_id??``),g=(h?.chassis_box.max.z??35)+yh(h,c),_=Math.min(o-26,Math.max(g+56,Math.min(135,o*.45))),v=e[0]?.entry_position===`bottom-rear`,y=v?-3:i+3,b=Math.min(r*.65,Math.max(78,e.length*8.8+32));return(0,$.jsxs)(`group`,{children:[(0,$.jsxs)(`group`,{position:[r/2,y,_],children:[(0,$.jsxs)(`mesh`,{children:[(0,$.jsx)(`boxGeometry`,{args:[b,10,28]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#27272A`,metalness:.68,roughness:.32})]}),(0,$.jsxs)(`mesh`,{position:[0,0,0],children:[(0,$.jsx)(`boxGeometry`,{args:[b-8,11.2,20]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#09090B`,roughness:.92})]}),(0,$.jsxs)(`mesh`,{position:[0,v?-11:11,0],children:[(0,$.jsx)(`boxGeometry`,{args:[b-14,16,16]}),(0,$.jsx)(`meshStandardMaterial`,{color:`#18181D`,metalness:.55,roughness:.45})]})]}),m.map(({ext:e,linkedFrontCableId:t,tubeGeo:n,bootPos:r})=>{let i=f!==null&&f===t;return(0,$.jsxs)(`group`,{onClick:e=>{e.stopPropagation(),t&&p(t)},children:[(0,$.jsx)(`mesh`,{geometry:n,children:(0,$.jsx)(`meshStandardMaterial`,{color:e.color_hex,roughness:.45,metalness:.1,emissive:i?e.color_hex:`#000000`,emissiveIntensity:i?.5:0})}),(0,$.jsxs)(`mesh`,{position:r,rotation:[Math.PI/2,0,0],children:[(0,$.jsx)(`cylinderGeometry`,{args:[2.3,2.8,9,10]}),(0,$.jsx)(`meshStandardMaterial`,{color:i?e.color_hex:`#18181B`,roughness:.5,metalness:.3})]})]},`ext-drop-${e.endpoint_id}`)})]})}function Oh({scene:e,xrayMode:t,explodeZMm:n,cableFilter:r,cameraPreset:i,showClearanceBoxes:a,doorOpen:s,selectedDeviceId:c,selectedCableId:l,hoveredPort:u,pendingPort:f=null,onSelectDevice:m,onSelectCable:g,onHoverPort:_,onClickPort:v,onCancelPendingPort:y}){let b=(0,d.useRef)(null),[x,S]=(0,d.useState)({width:1280,height:800});(0,d.useEffect)(()=>{if(!f||!y||typeof window>`u`)return;let e=e=>{e.key===`Escape`&&y()};return window.addEventListener(`keydown`,e),()=>{window.removeEventListener(`keydown`,e)}},[y,f]),(0,d.useEffect)(()=>{let e=b.current;if(!e||typeof ResizeObserver>`u`)return;let t=new ResizeObserver(e=>{for(let t of e){let e=t.devicePixelContentBoxSize?.[0],n=typeof window<`u`&&window.devicePixelRatio||1,r=e?e.inlineSize:Math.max(1,Math.round(t.contentRect.width*n)),i=e?e.blockSize:Math.max(1,Math.round(t.contentRect.height*n));S({width:r,height:i})}});return t.observe(e),()=>{t.disconnect()}},[]);let C=h[e.project.rack.standard].W_panel,w=e.project.rack.u_height*p,T=e.project.rack.rail_depth_mm,E=[C/2,w/2,T/2],D=(0,d.useMemo)(()=>new Map(e.geometry.devices.map(e=>[e.instance_id,e])),[e.geometry.devices]),O=(0,d.useMemo)(()=>new Map(e.project.cables.map(e=>[e.cable_id,e])),[e.project.cables]),k=(0,d.useMemo)(()=>r===`none`?[]:e.cable_routes.filter(e=>{let t=O.get(e.cable_id);if(!t)return!1;let n=xu(t.cable_type);if(r===`power`)return n;if(r===`network`)return!n;if(r===`poe`){if(n)return!1;let e=D.get(t.from.instance_id),r=D.get(t.to.instance_id),i=e?.ports.find(e=>e.port_id===t.from.port_id),a=r?.ports.find(e=>e.port_id===t.to.port_id);return(i?.capabilities.some(e=>e.startsWith(`poe`))??!1)||(a?.capabilities.some(e=>e.startsWith(`poe`))??!1)}return!0}),[r,O,D,e.cable_routes]),A=(0,d.useMemo)(()=>Th(),[]);return(0,$.jsxs)(`div`,{ref:b,"data-testid":`rack-3d-viewport`,"data-pixel-size":`${x.width}x${x.height}`,"data-camera-preset":i,"data-xray":String(t),"data-explode-z":String(n),style:{position:`relative`,width:`100%`,height:`100%`,background:`radial-gradient(circle at 50% 38%, #18181f 0%, #09090b 78%)`,overflow:`hidden`},children:[A?(0,$.jsxs)(o,{camera:{fov:38,near:1,far:5e3,position:[C+340,w*.88+140,-420]},onPointerMissed:()=>{m(null),g(null)},children:[(0,$.jsx)(`ambientLight`,{intensity:1.05}),(0,$.jsx)(`directionalLight`,{position:[360,680,-520],intensity:1.65}),(0,$.jsx)(`directionalLight`,{position:[-320,480,640],intensity:1.15}),(0,$.jsx)(`pointLight`,{position:[C/2,w/2,-160],intensity:.75,color:`#E4E4E7`}),(0,$.jsx)(Eh,{preset:i,center:E,panelWidthMm:C,totalHeightMm:w,railDepthMm:T}),(0,$.jsx)(`gridHelper`,{args:[1200,24,`#27272A`,`#141418`],position:[C/2,-22,T/2]}),(0,$.jsx)(vh,{rack:e.project.rack,xrayMode:t,doorOpen:s}),e.geometry.devices.map(r=>(0,$.jsx)(wh,{device:r,rackStandard:e.project.rack.standard,cables:e.project.cables,cableRoutes:e.cable_routes,externalEndpoints:e.project.external_endpoints,xrayMode:t,explodeZMm:n,showClearanceBoxes:a,isSelected:c===r.instance_id,pendingPort:f,onSelectDevice:e=>m(e),onHoverPort:_,onClickPort:v},r.instance_id)),e.project.external_endpoints.length>0&&(0,$.jsx)(Dh,{externalEndpoints:e.project.external_endpoints,cables:e.project.cables,devicesById:D,panelWidthMm:C,totalHeightMm:w,railDepthMm:T,explodeZMm:n,cableFilter:r,selectedCableId:l,onSelectCable:e=>g(e)}),k.map(e=>{let t=O.get(e.cable_id);if(!t)return null;let r=c!==null&&(t.from.instance_id===c||t.to.instance_id===c),i=l===e.cable_id||r;return(0,$.jsx)(bh,{route:e,cable:t,devicesById:D,explodeZMm:n,isHighlighted:i,isDimmed:(c!==null||l!==null)&&!i,onSelectCable:e=>g(e)},e.cable_id)})]}):(0,$.jsxs)(`div`,{"data-testid":`rack-3d-scene-summary`,style:{padding:`28px`,display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,$.jsxs)(`div`,{style:{fontSize:`14px`,fontWeight:700,color:`#38BDF8`},children:[`3D Procedural Scene Graph (`,e.geometry.devices.length,` Devices •`,` `,k.length,` Visible Cable Tubes)`]}),(0,$.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`8px`},children:e.geometry.devices.map(e=>(0,$.jsxs)(`button`,{type:`button`,"data-testid":`scene-device-${e.instance_id}`,onClick:()=>m(e.instance_id),style:{padding:`6px 10px`,borderRadius:`6px`,border:c===e.instance_id?`1.5px solid #38BDF8`:`1px solid #334155`,background:`#0F172A`,color:`#F8FAFC`,cursor:`pointer`,fontSize:`12px`},children:[`U`,e.u_position,` `,e.hostname??e.instance_id]},e.instance_id))}),(0,$.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`8px`},children:k.map(e=>(0,$.jsxs)(`button`,{type:`button`,"data-testid":`scene-cable-${e.cable_id}`,onClick:()=>g(e.cable_id),style:{padding:`4px 8px`,borderRadius:`4px`,border:l===e.cable_id?`1.5px solid #38BDF8`:`1px solid #1E293B`,background:`#1E293B`,color:`#CBD5E1`,cursor:`pointer`,fontSize:`11px`},children:[e.cable_id,` (`,e.recommended_commercial_mm,`mm)`]},e.cable_id))}),v&&c!==null&&(()=>{let t=D.get(c);return!t||t.ports.length===0?null:(0,$.jsx)(`div`,{"data-testid":`scene-device-ports-${t.instance_id}`,style:{display:`flex`,flexWrap:`wrap`,gap:`6px`},children:t.ports.map(t=>{let n=e.project.cables.find(e=>e.from.instance_id===t.instance_id&&e.from.port_id===t.port_id&&(e.from.face??t.world_face)===t.world_face||e.to.instance_id===t.instance_id&&e.to.port_id===t.port_id&&(e.to.face??t.world_face)===t.world_face),r=f!==null&&f.instanceId===t.instance_id&&f.portId===t.port_id&&f.worldFace===t.world_face;return(0,$.jsxs)(`button`,{type:`button`,"data-testid":`scene-port-${t.instance_id}-${t.port_id}-${t.world_face}`,onClick:()=>v({instanceId:t.instance_id,portId:t.port_id,label:t.label,connectorType:t.connector_type,worldFace:t.world_face},n?.cable_id),style:{padding:`3px 7px`,borderRadius:`4px`,border:r?`1px solid rgba(16, 185, 129, 0.5)`:`1px solid rgba(255, 255, 255, 0.09)`,background:r?`rgba(16, 185, 129, 0.14)`:`#16161B`,color:r?`#6EE7B7`:n?`#A1A1AA`:`#F4F4F5`,cursor:`pointer`,fontSize:`10.5px`},children:[t.port_id,` (`,t.world_face,`)`]},`${t.instance_id}-${t.port_id}-${t.world_face}`)})})})()]}),f&&(0,$.jsxs)(`div`,{"data-testid":`pending-port-patch-banner`,style:{position:`absolute`,top:`16px`,left:`50%`,transform:`translateX(-50%)`,padding:`8px 12px`,background:`rgba(18, 18, 22, 0.94)`,backdropFilter:`blur(14px)`,borderTop:`1px solid rgba(255, 255, 255, 0.09)`,borderRight:`1px solid rgba(255, 255, 255, 0.09)`,borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,borderLeft:`2.5px solid #10B981`,borderRadius:`8px`,boxShadow:`0 10px 28px rgba(0, 0, 0, 0.65)`,display:`flex`,alignItems:`center`,gap:`10px`,zIndex:25},children:[(0,$.jsx)(`span`,{style:{width:`6px`,height:`6px`,borderRadius:`50%`,background:`#10B981`,flexShrink:0}}),(0,$.jsxs)(`span`,{style:{fontSize:`11.5px`,color:`#E4E4E7`},children:[`Patching from`,` `,(0,$.jsxs)(`strong`,{className:`mono`,style:{color:`#6EE7B7`},children:[f.instanceId,`:`,f.portId]}),` `,(0,$.jsxs)(`span`,{className:`mono`,style:{color:`#A1A1AA`},children:[`[`,f.connectorType.toUpperCase(),` ·`,` `,f.worldFace.toUpperCase(),`]`]}),` `,`— click a destination port to connect`]}),y&&(0,$.jsx)(`button`,{type:`button`,"data-testid":`btn-cancel-port-patch`,onClick:y,style:{padding:`3px 8px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#18181D`,color:`#A1A1AA`,fontSize:`11px`,cursor:`pointer`},children:`Cancel`})]}),c!==null&&l===null&&(()=>{let e=D.get(c);if(!e)return null;let t=e.mount_target===`rack-unit`&&e.blueprint.visuals.material_preset===`polycarbonate`&&e.blueprint.geometry.height_mm<38,n=e.blueprint.category===`modular-carrier`||e.blueprint.printable_metadata!==null,r=e.mount_target===`carrier-slot`,i=t?`🖨️ Desktop-Gerät im 3D-Druck-10"-Adapterrahmen`:n?`🖨️ 3D-gedruckter 1U-Modulträger`:r?`🧩 Sub-Modul in Slot (${e.slot_id??`Bay`})`:`🔩 Direktmontage (Metall-Rackohren)`;return(0,$.jsxs)(`div`,{"data-testid":`selected-device-guide-banner`,style:{position:`absolute`,top:`16px`,left:`16px`,maxWidth:`460px`,padding:`12px 14px`,background:`rgba(18, 18, 22, 0.92)`,backdropFilter:`blur(14px)`,borderTop:`1px solid rgba(255, 255, 255, 0.09)`,borderRight:`1px solid rgba(255, 255, 255, 0.09)`,borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,borderLeft:`3px solid #3B82F6`,borderRadius:`8px`,boxShadow:`0 10px 28px rgba(0,0,0,0.65)`,zIndex:20},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`8px`},children:[(0,$.jsxs)(`span`,{style:{fontSize:`12.5px`,fontWeight:600,color:`#F4F4F5`},children:[e.blueprint.manufacturer,` `,e.blueprint.model]}),(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`10px`,padding:`2px 6px`,borderRadius:`4px`,background:`rgba(59, 130, 246, 0.14)`,color:`#93C5FD`,flexShrink:0},children:[`U`,e.u_position,` · `,e.face.toUpperCase()]})]}),(0,$.jsx)(`div`,{className:`mono`,style:{marginTop:`4px`,fontSize:`10.5px`,color:`#A1A1AA`},children:e.hostname?`Hostname: ${e.hostname} · ID: ${e.instance_id} · ${i}`:`ID: ${e.instance_id} · ${i}`}),e.blueprint.description&&(0,$.jsx)(`div`,{style:{marginTop:`7px`,fontSize:`11px`,color:`#D4D4D8`,lineHeight:1.45},children:e.blueprint.description})]})})(),l!==null&&(()=>{let t=O.get(l);if(!t)return null;let n=e.project.external_endpoints.find(e=>t.from.instance_id===e.patch_panel_instance_id&&t.from.port_id===e.patch_panel_port_id||t.to.instance_id===e.patch_panel_instance_id&&t.to.port_id===e.patch_panel_port_id),r=n&&t.from.instance_id===n.patch_panel_instance_id?t.to:t.from;return(0,$.jsxs)(`div`,{"data-testid":`selected-cable-guide-banner`,style:{position:`absolute`,top:`16px`,left:`16px`,maxWidth:`440px`,padding:`12px 14px`,background:`rgba(18, 18, 22, 0.92)`,backdropFilter:`blur(14px)`,borderTop:`1px solid rgba(255, 255, 255, 0.09)`,borderRight:`1px solid rgba(255, 255, 255, 0.09)`,borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,borderLeft:`3px solid ${t.color_hex}`,borderRadius:`8px`,boxShadow:`0 10px 28px rgba(0,0,0,0.65)`,zIndex:20},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`8px`},children:[(0,$.jsx)(`span`,{style:{fontSize:`12px`,fontWeight:600,color:`#F4F4F5`},children:n?`🏠 ${n.label}${n.room_or_zone?` (${n.room_or_zone})`:``}`:t.label??t.cable_id}),(0,$.jsx)(`span`,{className:`mono`,style:{fontSize:`10px`,padding:`2px 6px`,borderRadius:`4px`,background:`rgba(255,255,255,0.06)`,color:`#A1A1AA`},children:n&&n.poe_draw_watts>0?`PoE ${n.poe_draw_watts}W · ${n.required_speed.toUpperCase()}`:t.cable_type})]}),n?(0,$.jsxs)(`div`,{style:{marginTop:`8px`,display:`flex`,flexDirection:`column`,gap:`4px`,fontSize:`11px`,color:`#D4D4D8`},children:[(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`strong`,{style:{color:`#A1A1AA`},children:`1. Hinten auflegen:`}),` `,`Hauskabel aus`,` `,(0,$.jsx)(`span`,{style:{color:`#F4F4F5`},children:n.room_or_zone??`Gebäude`}),` `,`in`,` `,(0,$.jsxs)(`span`,{className:`mono`,style:{color:`#38BDF8`},children:[n.patch_panel_instance_id,`:`,n.patch_panel_port_id,` (Rear)`]})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`strong`,{style:{color:`#A1A1AA`},children:`2. Vorne patchen:`}),` `,`Patchkabel von`,` `,(0,$.jsxs)(`span`,{className:`mono`,style:{color:`#38BDF8`},children:[n.patch_panel_instance_id,`:`,n.patch_panel_port_id,` (Front)`]}),` `,`→`,` `,(0,$.jsxs)(`span`,{className:`mono`,style:{color:`#10B981`},children:[r.instance_id,`:`,r.port_id]})]})]}):(0,$.jsxs)(`div`,{className:`mono`,style:{marginTop:`6px`,fontSize:`11px`,color:`#A1A1AA`},children:[t.from.instance_id,`:`,t.from.port_id,` →`,` `,t.to.instance_id,`:`,t.to.port_id]})]})})(),u&&(0,$.jsxs)(`div`,{"data-testid":`port-hover-tooltip`,style:{position:`absolute`,bottom:`22px`,left:`22px`,padding:`10px 14px`,background:`rgba(18, 18, 22, 0.94)`,backdropFilter:`blur(14px)`,borderTop:`1px solid rgba(255, 255, 255, 0.09)`,borderRight:`1px solid rgba(255, 255, 255, 0.09)`,borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,borderLeft:u.peerDescription?`2.5px solid #3B82F6`:`2.5px solid #10B981`,borderRadius:`8px`,boxShadow:`0 8px 24px rgba(0,0,0,0.65)`,pointerEvents:`none`,zIndex:20},children:[(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`12px`,fontWeight:700,color:`#F4F4F5`},children:[u.instanceId,` • `,u.portId,` `,(0,$.jsxs)(`span`,{style:{color:`#93C5FD`},children:[`[`,u.connectorType.toUpperCase(),` /`,` `,u.worldFace.toUpperCase(),`]`]})]}),(0,$.jsx)(`div`,{className:`mono`,style:{fontSize:`11px`,color:`#A1A1AA`,marginTop:`4px`},children:u.peerDescription?`Connected -> ${u.peerDescription} (${u.connectedCableId})`:f?`Unconnected Port — Click to complete cable patch`:`Unconnected Port — Click to start 2-click cable patch`}),(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`10px`,color:`#71717A`,marginTop:`2px`},children:[`3D World Pos: (`,u.worldPosMm.x,`mm,`,` `,u.worldPosMm.y,`mm, `,u.worldPosMm.z,`mm)`]})]})]})}function kh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z`}),(0,$.jsx)(`polyline`,{points:`3.27 6.96 12 12.01 20.73 6.96`}),(0,$.jsx)(`line`,{x1:`12`,y1:`22.08`,x2:`12`,y2:`12`})]})}function Ah({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`rect`,{x:`3`,y:`3`,width:`18`,height:`18`,rx:`2`}),(0,$.jsx)(`line`,{x1:`3`,y1:`9`,x2:`21`,y2:`9`}),(0,$.jsx)(`line`,{x1:`3`,y1:`15`,x2:`21`,y2:`15`}),(0,$.jsx)(`line`,{x1:`9`,y1:`3`,x2:`9`,y2:`21`})]})}function jh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`circle`,{cx:`6`,cy:`6`,r:`3`}),(0,$.jsx)(`circle`,{cx:`18`,cy:`18`,r:`3`}),(0,$.jsx)(`path`,{d:`M9 6h4a2 2 0 0 1 2 2v8a2 2 0 0 0 2 2`})]})}function Mh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z`}),(0,$.jsx)(`polyline`,{points:`14 2 14 8 20 8`}),(0,$.jsx)(`line`,{x1:`8`,y1:`13`,x2:`16`,y2:`13`}),(0,$.jsx)(`line`,{x1:`8`,y1:`17`,x2:`16`,y2:`17`})]})}function Nh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`line`,{x1:`12`,y1:`5`,x2:`12`,y2:`19`}),(0,$.jsx)(`line`,{x1:`5`,y1:`12`,x2:`19`,y2:`12`})]})}function Ph({size:e=14,style:t}){return(0,$.jsx)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:(0,$.jsx)(`path`,{d:`M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z`})})}function Fh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M3 7v6h6`}),(0,$.jsx)(`path`,{d:`M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13`})]})}function Ih({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M21 7v6h-6`}),(0,$.jsx)(`path`,{d:`M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7`})]})}function Lh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}),(0,$.jsx)(`polyline`,{points:`17 8 12 3 7 8`}),(0,$.jsx)(`line`,{x1:`12`,y1:`3`,x2:`12`,y2:`15`})]})}function Rh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}),(0,$.jsx)(`polyline`,{points:`7 10 12 15 17 10`}),(0,$.jsx)(`line`,{x1:`12`,y1:`15`,x2:`12`,y2:`3`})]})}function zh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`}),(0,$.jsx)(`path`,{d:`M3 3v5h5`})]})}function Bh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z`}),(0,$.jsx)(`circle`,{cx:`12`,cy:`12`,r:`3`})]})}function Vh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.75`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`polyline`,{points:`4 17 10 11 4 5`}),(0,$.jsx)(`line`,{x1:`12`,y1:`19`,x2:`20`,y2:`19`})]})}function Hh({size:e=14,style:t}){return(0,$.jsxs)(`svg`,{width:e,height:e,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{flexShrink:0,...t},"aria-hidden":`true`,children:[(0,$.jsx)(`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`}),(0,$.jsx)(`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`})]})}var Uh=[{id:`3d`,label:`3D Rack`,icon:(0,$.jsx)(kh,{size:13})},{id:`elevation`,label:`2D Elevation`,icon:(0,$.jsx)(Ah,{size:13})},{id:`wiring`,label:`Wiring Plan`,icon:(0,$.jsx)(jh,{size:13})},{id:`bom`,label:`BOM & 3D-Print`,icon:(0,$.jsx)(Mh,{size:13})}];function Wh({scene:e,connectionMode:t,projectPath:n,activePresetId:r,activeTab:i,catalogDrawerOpen:a,undoAvailable:o,redoAvailable:s,onSelectTab:c,onToggleCatalogDrawer:l,onSelectPreset:u,onShareRackUrl:f,onImportProjectJson:p,onInitNewRack:m,onExportDeliverablesToDisk:h,onUndo:g,onRedo:_,onResetDemo:v,onSimulateAgentStep:y}){let b=e.validation.is_valid,x=(0,d.useRef)(null),[S,C]=(0,d.useState)(!1),[w,T]=(0,d.useState)(`New Rack Project`),[E,D]=(0,d.useState)(`19inch`),[O,k]=(0,d.useState)(12),[A,j]=(0,d.useState)(400),[M,N]=(0,d.useState)(!1),[P,F]=(0,d.useState)(!1),I=n?n.split(/[\\/]/).slice(-2).join(`/`):`rack.yaml`;return(0,$.jsxs)(`header`,{"data-testid":`top-nav-bar`,style:{width:`100%`,maxWidth:`100%`,height:`52px`,padding:`0 12px`,background:`#0E0E11`,borderBottom:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`8px`,flexShrink:0,boxSizing:`border-box`,whiteSpace:`nowrap`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,minWidth:0,flexShrink:1},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,padding:`4px 8px`,borderRadius:`6px`,background:`#18181D`,border:`1px solid rgba(255, 255, 255, 0.09)`,color:`#F4F4F5`,fontWeight:700,fontSize:`11.5px`,letterSpacing:`-0.01em`,flexShrink:0},children:[(0,$.jsx)(`span`,{style:{width:`8px`,height:`8px`,borderRadius:`2px`,background:`#3B82F6`,display:`inline-block`,flexShrink:0}}),(0,$.jsx)(`span`,{children:`RackArchitect`})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,minWidth:0,flexShrink:1},children:[t===`standalone-demo`&&u?(0,$.jsx)(`select`,{"aria-label":`Select Rack Preset`,"data-testid":`preset-switcher-select`,value:r??`10inch-homelab`,onChange:e=>u(e.target.value),title:`Preset: ${e.project.project_name}`,style:{padding:`4px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#141418`,color:`#F4F4F5`,fontSize:`11.5px`,fontWeight:600,maxWidth:`215px`,minWidth:`90px`,cursor:`pointer`,flexShrink:1},children:oh.map(e=>(0,$.jsx)(`option`,{value:e.id,children:e.label},e.id))}):(0,$.jsx)(`span`,{title:e.project.project_name,style:{fontSize:`12.5px`,fontWeight:600,color:`#F4F4F5`,overflow:`hidden`,textOverflow:`ellipsis`,maxWidth:`175px`,minWidth:`40px`,flexShrink:1},children:e.project.project_name}),(0,$.jsxs)(`span`,{className:`mono`,style:{padding:`2px 6px`,borderRadius:`4px`,background:`#16161B`,border:`1px solid rgba(255, 255, 255, 0.06)`,fontSize:`10px`,color:`#A1A1AA`,flexShrink:0},children:[e.project.rack.standard.toUpperCase(),` ·`,` `,e.project.rack.u_height,`U · `,e.project.rack.rail_depth_mm,`mm`]})]}),(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-toggle-catalog-drawer`,onClick:l,style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`4px 9px`,borderRadius:`6px`,border:a?`1px solid rgba(59, 130, 246, 0.5)`:`1px solid rgba(255, 255, 255, 0.1)`,background:a?`rgba(59, 130, 246, 0.14)`:`#18181D`,color:a?`#93C5FD`:`#E4E4E7`,fontSize:`11px`,fontWeight:600,cursor:`pointer`,flexShrink:0},children:[(0,$.jsx)(Nh,{size:12}),(0,$.jsx)(`span`,{children:a?`Close Builder`:`Catalog & Cables`})]})]}),(0,$.jsx)(`nav`,{"aria-label":`Workspace Views`,style:{display:`flex`,alignItems:`center`,gap:`2px`,padding:`3px`,borderRadius:`8px`,background:`#141418`,border:`1px solid rgba(255, 255, 255, 0.07)`,flexShrink:0},children:Uh.map(e=>{let t=i===e.id;return(0,$.jsxs)(`button`,{type:`button`,"data-testid":`nav-tab-${e.id}`,onClick:()=>c(e.id),style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`4px 9px`,borderRadius:`6px`,border:t?`1px solid rgba(255, 255, 255, 0.12)`:`1px solid transparent`,background:t?`#23232B`:`transparent`,color:t?`#F4F4F5`:`#A1A1AA`,fontSize:`11px`,fontWeight:t?600:500,cursor:`pointer`},children:[e.icon,(0,$.jsx)(`span`,{children:e.label})]},e.id)})}),(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,minWidth:0,flexShrink:0},children:[(0,$.jsxs)(`span`,{"data-testid":`validation-status-pill`,className:`mono`,style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`4px 8px`,borderRadius:`6px`,fontSize:`10px`,fontWeight:600,background:b?`rgba(16, 185, 129, 0.08)`:`rgba(239, 68, 68, 0.12)`,color:b?`#D1FAE5`:`#FECACA`,border:b?`1px solid rgba(16, 185, 129, 0.25)`:`1px solid rgba(239, 68, 68, 0.35)`,flexShrink:0},children:[(0,$.jsx)(`span`,{style:{width:`6px`,height:`6px`,borderRadius:`999px`,background:b?`#10B981`:`#EF4444`,boxShadow:b?`0 0 6px rgba(16, 185, 129, 0.6)`:`0 0 6px rgba(239, 68, 68, 0.7)`}}),(0,$.jsx)(`span`,{children:b?`VALID (0 ERRORS)`:`INVALID (${e.validation.error_count} ERRORS)`})]}),(0,$.jsxs)(`span`,{"data-testid":`connection-status-badge`,title:t===`sidecar-live`?`Live MCP Sidecar connected (${n??`rack.yaml`})`:`Static Standalone Demo Mode (GitHub Pages)`,className:`mono`,style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`4px 7px`,borderRadius:`6px`,fontSize:`10px`,fontWeight:500,background:`#16161B`,color:t===`sidecar-live`?`#93C5FD`:`#A1A1AA`,border:`1px solid rgba(255, 255, 255, 0.07)`,maxWidth:`155px`,overflow:`hidden`,textOverflow:`ellipsis`,flexShrink:0},children:[(0,$.jsx)(`span`,{style:{width:`5px`,height:`5px`,borderRadius:`999px`,flexShrink:0,background:t===`sidecar-live`?`#3B82F6`:`#71717A`,boxShadow:t===`sidecar-live`?`0 0 6px rgba(59, 130, 246, 0.7)`:`none`}}),(0,$.jsx)(`span`,{style:{overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:t===`sidecar-live`?`MCP Live · ${I}`:`Standalone Demo`})]}),t===`standalone-demo`&&y&&(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-simulate-mcp-agent`,onClick:()=>y(b?`collision`:`resolved`),style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`5px 10px`,borderRadius:`6px`,border:b?`1px solid rgba(245, 158, 11, 0.35)`:`1px solid rgba(16, 185, 129, 0.4)`,background:b?`rgba(245, 158, 11, 0.1)`:`rgba(16, 185, 129, 0.12)`,color:b?`#FDE68A`:`#A7F3D0`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:[(0,$.jsx)(Ph,{size:12}),(0,$.jsx)(`span`,{children:b?`Simulate LLM Collision`:`Apply LLM Self-Correction`})]}),t===`sidecar-live`&&m&&(0,$.jsxs)(`div`,{style:{position:`relative`},children:[(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-init-new-rack`,onClick:()=>C(!S),style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`5px 10px`,borderRadius:`6px`,border:S?`1px solid rgba(59, 130, 246, 0.5)`:`1px solid rgba(255, 255, 255, 0.1)`,background:S?`rgba(59, 130, 246, 0.14)`:`#16161B`,color:S?`#93C5FD`:`#E4E4E7`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:[(0,$.jsx)(Nh,{size:11}),(0,$.jsx)(`span`,{children:`New Empty Rack`})]}),S&&(0,$.jsxs)(`div`,{"data-testid":`new-rack-popover`,style:{position:`absolute`,top:`calc(100% + 8px)`,right:0,width:`280px`,padding:`12px`,borderRadius:`8px`,background:`#141418`,border:`1px solid rgba(255, 255, 255, 0.12)`,boxShadow:`0 16px 36px rgba(0, 0, 0, 0.65)`,zIndex:100,display:`flex`,flexDirection:`column`,gap:`8px`,whiteSpace:`normal`},children:[(0,$.jsx)(`div`,{style:{fontSize:`11.5px`,fontWeight:700,color:`#F4F4F5`},children:"Initialize Clean Rack (`init_rack`)"}),(0,$.jsx)(`input`,{type:`text`,value:w,onChange:e=>T(e.target.value),placeholder:`Project Name`,style:{padding:`5px 8px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#0E0E11`,color:`#F4F4F5`,fontSize:`11px`}}),(0,$.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, minmax(0, 1fr))`,gap:`6px`},children:[(0,$.jsxs)(`select`,{value:E,onChange:e=>{let t=e.target.value;D(t),j(t===`19inch`?400:t===`10inch`?240:180),k(t===`19inch`?12:8)},style:{padding:`5px 6px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#0E0E11`,color:`#F4F4F5`,fontSize:`11px`},children:[(0,$.jsx)(`option`,{value:`19inch`,children:`19-Inch`}),(0,$.jsx)(`option`,{value:`10inch`,children:`10-Inch`}),(0,$.jsx)(`option`,{value:`6inch`,children:`6-Inch`})]}),(0,$.jsx)(`input`,{type:`number`,min:2,max:48,value:O,onChange:e=>k(Math.max(2,Number(e.target.value)||8)),title:`Height (U)`,style:{padding:`5px 6px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#0E0E11`,color:`#F4F4F5`,fontSize:`11px`}}),(0,$.jsx)(`input`,{type:`number`,min:120,max:1e3,step:10,value:A,onChange:e=>j(Math.max(120,Number(e.target.value)||300)),title:`Rail Depth (mm)`,style:{padding:`5px 6px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#0E0E11`,color:`#F4F4F5`,fontSize:`11px`}})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`6px`,marginTop:`2px`},children:[(0,$.jsx)(`button`,{type:`button`,onClick:()=>C(!1),style:{padding:`4px 8px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.08)`,background:`transparent`,color:`#A1A1AA`,fontSize:`10.5px`,cursor:`pointer`},children:`Cancel`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`btn-confirm-init-new-rack`,onClick:()=>{m({project_name:w.trim()||`New Rack Project`,standard:E,u_height:O,rail_depth_mm:A,enclosure_type:E===`19inch`?`closed-vented-front`:`closed-glass-front`}),C(!1)},style:{padding:`4px 10px`,borderRadius:`5px`,border:`1px solid rgba(59, 130, 246, 0.5)`,background:`#2563EB`,color:`#FFFFFF`,fontSize:`10.5px`,fontWeight:600,cursor:`pointer`},children:`Initialize Empty Rack`})]})]})]}),t===`sidecar-live`&&h&&(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-export-disk`,title:`Write SVG, BOM, GLB & STL deliverables to project folder`,onClick:()=>{h(),N(!0),setTimeout(()=>N(!1),1800)},style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`5px 9px`,borderRadius:`6px`,border:M?`1px solid rgba(16, 185, 129, 0.45)`:`1px solid rgba(255, 255, 255, 0.1)`,background:M?`rgba(16, 185, 129, 0.14)`:`#16161B`,color:M?`#A7F3D0`:`#D4D4D8`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:[(0,$.jsx)(Rh,{size:12}),(0,$.jsx)(`span`,{children:M?`Exported!`:`Export to Disk`})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`4px`,paddingLeft:`4px`,borderLeft:`1px solid rgba(255, 255, 255, 0.07)`},children:[(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-undo`,title:`Undo (${o})`,disabled:o===0,onClick:g,style:{display:`inline-flex`,alignItems:`center`,gap:`4px`,padding:`5px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.08)`,background:`#16161B`,color:o>0?`#E4E4E7`:`#52525B`,fontSize:`11px`,cursor:o>0?`pointer`:`not-allowed`},children:[(0,$.jsx)(Fh,{size:12}),(0,$.jsx)(`span`,{className:`mono`,children:o})]}),(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-redo`,title:`Redo (${s})`,disabled:s===0,onClick:_,style:{display:`inline-flex`,alignItems:`center`,gap:`4px`,padding:`5px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.08)`,background:`#16161B`,color:s>0?`#E4E4E7`:`#52525B`,fontSize:`11px`,cursor:s>0?`pointer`:`not-allowed`},children:[(0,$.jsx)(Ih,{size:12}),(0,$.jsx)(`span`,{className:`mono`,children:s})]}),(0,$.jsx)(`input`,{ref:x,type:`file`,accept:`.json,application/json`,"data-testid":`input-import-project-file`,style:{display:`none`},onChange:e=>{let t=e.target.files?.[0];t&&t.text().then(e=>{p(e)})}}),(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-import-project`,title:`Import rack.json`,onClick:()=>x.current?.click(),style:{display:`inline-flex`,alignItems:`center`,gap:`4px`,padding:`5px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.08)`,background:`#16161B`,color:`#D4D4D8`,fontSize:`11px`,cursor:`pointer`},children:[(0,$.jsx)(Lh,{size:12}),(0,$.jsx)(`span`,{children:`Import`})]}),f&&(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-share-rack-link`,title:`Copy Shareable Rack URL (#rack=v1...)`,onClick:()=>{let e=f();typeof navigator<`u`&&navigator.clipboard&&typeof navigator.clipboard.writeText==`function`&&navigator.clipboard.writeText(e).catch(()=>{}),F(!0),setTimeout(()=>F(!1),1800)},style:{display:`inline-flex`,alignItems:`center`,gap:`4px`,padding:`5px 8px`,borderRadius:`6px`,border:P?`1px solid rgba(16, 185, 129, 0.35)`:`1px solid rgba(255, 255, 255, 0.08)`,background:P?`rgba(16, 185, 129, 0.12)`:`#16161B`,color:P?`#6EE7B7`:`#D4D4D8`,fontSize:`11px`,fontWeight:P?600:500,cursor:`pointer`},children:[(0,$.jsx)(Hh,{size:12}),(0,$.jsx)(`span`,{children:P?`Copied!`:`Share`})]}),t===`standalone-demo`&&(0,$.jsx)(`button`,{type:`button`,"data-testid":`btn-reset-demo`,title:`Reset Demo Scene`,onClick:v,style:{display:`inline-flex`,alignItems:`center`,gap:`4px`,padding:`5px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.07)`,background:`transparent`,color:`#A1A1AA`,fontSize:`11px`,cursor:`pointer`},children:(0,$.jsx)(zh,{size:12})})]})]})]})}var Gh=[{id:`isometric`,label:`Iso`},{id:`front`,label:`Front`},{id:`rear`,label:`Rear`},{id:`side-cutaway`,label:`Side`},{id:`top`,label:`Top`}],Kh=[{id:`all`,label:`All`},{id:`network`,label:`Data`},{id:`power`,label:`Power`},{id:`poe`,label:`PoE`},{id:`none`,label:`Off`}];function qh({xrayMode:e,explodeZMm:t,cableFilter:n,cameraPreset:r,showClearanceBoxes:i,doorOpen:a,onToggleXray:o,onChangeExplodeZ:s,onSelectCableFilter:c,onSelectCameraPreset:l,onToggleClearanceBoxes:u,onToggleDoorOpen:d}){return(0,$.jsxs)(`div`,{"data-testid":`floating-3d-hud`,style:{position:`absolute`,bottom:`18px`,left:`50%`,transform:`translateX(-50%)`,maxWidth:`calc(100% - 28px)`,display:`flex`,flexWrap:`wrap`,alignItems:`center`,justifyContent:`center`,gap:`10px`,padding:`7px 12px`,borderRadius:`11px`,background:`rgba(16, 16, 20, 0.88)`,border:`1px solid rgba(255, 255, 255, 0.09)`,boxShadow:`0 16px 40px rgba(0, 0, 0, 0.65)`,backdropFilter:`blur(14px)`,zIndex:15,whiteSpace:`nowrap`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`2px`,padding:`2px`,borderRadius:`7px`,background:`#121216`,border:`1px solid rgba(255, 255, 255, 0.06)`},children:[(0,$.jsx)(`span`,{className:`mono`,style:{fontSize:`10px`,fontWeight:600,color:`#71717A`,padding:`0 6px`},children:`View`}),Gh.map(e=>{let t=r===e.id;return(0,$.jsx)(`button`,{type:`button`,"data-testid":`hud-camera-${e.id}`,onClick:()=>l(e.id),style:{padding:`4px 8px`,borderRadius:`5px`,border:`none`,background:t?`#272730`:`transparent`,color:t?`#F4F4F5`:`#A1A1AA`,fontSize:`11px`,fontWeight:t?600:500,cursor:`pointer`},children:e.label},e.id)})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`2px`,padding:`2px`,borderRadius:`7px`,background:`#121216`,border:`1px solid rgba(255, 255, 255, 0.06)`},children:[(0,$.jsx)(`span`,{className:`mono`,style:{fontSize:`10px`,fontWeight:600,color:`#71717A`,padding:`0 6px`},children:`Cables`}),Kh.map(e=>{let t=n===e.id;return(0,$.jsx)(`button`,{type:`button`,"data-testid":`hud-cable-filter-${e.id}`,onClick:()=>c(e.id),style:{padding:`4px 8px`,borderRadius:`5px`,border:`none`,background:t?`#272730`:`transparent`,color:t?`#F4F4F5`:`#A1A1AA`,fontSize:`11px`,fontWeight:t?600:500,cursor:`pointer`},children:e.label},e.id)})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,$.jsxs)(`button`,{type:`button`,"data-testid":`hud-toggle-xray`,onClick:()=>o(!e),style:{display:`inline-flex`,alignItems:`center`,gap:`5px`,padding:`5px 9px`,borderRadius:`6px`,border:e?`1px solid rgba(59, 130, 246, 0.45)`:`1px solid rgba(255, 255, 255, 0.08)`,background:e?`rgba(59, 130, 246, 0.16)`:`#16161B`,color:e?`#93C5FD`:`#D4D4D8`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:[(0,$.jsx)(Bh,{size:12}),(0,$.jsx)(`span`,{children:e?`X-Ray Ghost: ON`:`X-Ray Ghost: OFF`})]}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`hud-toggle-clearance`,onClick:()=>u(!i),style:{padding:`5px 9px`,borderRadius:`6px`,border:i?`1px solid rgba(245, 158, 11, 0.45)`:`1px solid rgba(255, 255, 255, 0.08)`,background:i?`rgba(245, 158, 11, 0.14)`:`#16161B`,color:i?`#FDE68A`:`#D4D4D8`,fontSize:`11px`,fontWeight:500,cursor:`pointer`},children:i?`B_clearance: ON`:`B_clearance: OFF`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`hud-toggle-door`,onClick:()=>d(!a),style:{padding:`5px 9px`,borderRadius:`6px`,border:a?`1px solid rgba(59, 130, 246, 0.4)`:`1px solid rgba(255, 255, 255, 0.08)`,background:a?`rgba(59, 130, 246, 0.12)`:`#16161B`,color:a?`#93C5FD`:`#D4D4D8`,fontSize:`11px`,fontWeight:500,cursor:`pointer`},children:a?`Glass Door: Open`:`Glass Door: Closed`}),(0,$.jsxs)(`label`,{className:`mono`,style:{display:`flex`,alignItems:`center`,gap:`7px`,padding:`3px 8px`,borderRadius:`6px`,background:`#121216`,border:`1px solid rgba(255, 255, 255, 0.06)`,fontSize:`10.5px`,color:`#D4D4D8`},children:[(0,$.jsxs)(`span`,{children:[`Explode `,t,`mm`]}),(0,$.jsx)(`input`,{type:`range`,"data-testid":`hud-explode-z-slider`,min:0,max:250,step:5,value:t,onChange:e=>s(Number(e.target.value)),style:{width:`76px`,accentColor:`#3B82F6`,cursor:`pointer`}})]})]})]})}function Jh({title:e,filename:t,svgMarkup:n}){let[r,i]=(0,d.useState)(.9),[a,o]=(0,d.useState)({x:0,y:0}),[s,c]=(0,d.useState)(!1),[l,u]=(0,d.useState)({x:0,y:0});return(0,$.jsxs)(`div`,{"data-testid":`svg-pan-zoom-viewer`,style:{position:`relative`,width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,background:`#09090b`,overflow:`hidden`},children:[(0,$.jsxs)(`div`,{style:{height:`44px`,padding:`0 16px`,background:`#0e0e11`,borderBottom:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,flexShrink:0},children:[(0,$.jsxs)(`div`,{style:{fontSize:`12px`,fontWeight:600,color:`#F4F4F5`,display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,$.jsx)(`span`,{children:e}),(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`11px`,color:`#71717A`,fontWeight:500},children:[`(`,t,`)`]})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,$.jsx)(`button`,{type:`button`,"data-testid":`svg-zoom-out`,onClick:()=>i(e=>Math.max(.35,Number((e-.15).toFixed(2)))),style:{padding:`4px 10px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#F4F4F5`,cursor:`pointer`,fontSize:`11.5px`},children:`Zoom -`}),(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`11.5px`,color:`#A1A1AA`,minWidth:`52px`,textAlign:`center`},children:[Math.round(r*100),`%`]}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`svg-zoom-in`,onClick:()=>i(e=>Math.min(3.5,Number((e+.15).toFixed(2)))),style:{padding:`4px 10px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#F4F4F5`,cursor:`pointer`,fontSize:`11.5px`},children:`Zoom +`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`svg-zoom-reset`,onClick:()=>{i(.9),o({x:0,y:0})},style:{padding:`4px 10px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#A1A1AA`,cursor:`pointer`,fontSize:`11.5px`},children:`Reset View`}),(0,$.jsxs)(`button`,{type:`button`,"data-testid":`svg-download-btn`,onClick:()=>{let e=new Blob([n],{type:`image/svg+xml;charset=utf-8`}),r=URL.createObjectURL(e),i=document.createElement(`a`);i.href=r,i.download=t,i.click(),URL.revokeObjectURL(r)},style:{padding:`5px 12px`,borderRadius:`5px`,border:`1px solid rgba(59, 130, 246, 0.35)`,background:`rgba(59, 130, 246, 0.12)`,color:`#93C5FD`,fontWeight:600,cursor:`pointer`,fontSize:`11.5px`},children:[`Download `,t]})]})]}),(0,$.jsx)(`div`,{onMouseDown:e=>{c(!0),u({x:e.clientX-a.x,y:e.clientY-a.y})},onMouseMove:e=>{s&&o({x:e.clientX-l.x,y:e.clientY-l.y})},onMouseUp:()=>c(!1),onMouseLeave:()=>c(!1),style:{flex:1,overflow:`auto`,cursor:s?`grabbing`:`grab`,padding:`20px`,display:`flex`,justifyContent:`center`,alignItems:`flex-start`},children:(0,$.jsx)(`div`,{style:{transform:`translate(${a.x}px, ${a.y}px) scale(${r})`,transformOrigin:`top center`,transition:s?`none`:`transform 120ms ease-out`},children:(0,$.jsx)(`img`,{src:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`,alt:e,draggable:!1,style:{maxWidth:`none`,display:`block`,userSelect:`none`}})})})]})}function Yh(e,t,n){let r=new Blob([e],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,a.click(),URL.revokeObjectURL(i)}function Xh(e){let t=``,n=!0,r=e.toLowerCase();for(let e=0;e<r.length;e++){let i=r.charCodeAt(e);i>=97&&i<=122||i>=48&&i<=57?(t+=r.charAt(e),n=!1):n||=(t+=`-`,!0)}return t.endsWith(`-`)?t.slice(0,-1):t}function Zh({scene:e,elevationSvg:t,wiringSvg:n,bomMarkdown:r}){let i=e.geometry.devices.filter(e=>e.blueprint.printable_metadata!==void 0&&e.blueprint.printable_metadata!==null||e.mount_target===`rack-unit`&&e.blueprint.visuals.material_preset===`polycarbonate`&&e.blueprint.geometry.height_mm<38),a=i.reduce((e,t)=>e+(t.blueprint.printable_metadata?.filament_grams??95),0),o=zm.getAllBlueprints().filter(e=>e.category===`blank-panel`&&e.printable_metadata!==void 0&&e.printable_metadata!==null),s=new Map(e.cable_routes.map(e=>[e.cable_id,e])),[c,l]=(0,d.useState)(e.project.rack.standard),[u,f]=(0,d.useState)(1),[m,g]=(0,d.useState)(`hex`),[_,v]=(0,d.useState)(``);(0,d.useEffect)(()=>{l(e.project.rack.standard)},[e.project.rack.standard]);let y=(0,d.useMemo)(()=>({standard:c,u_height:u,pattern:m,label_text:_}),[_,m,c,u]),b=(0,d.useMemo)(()=>ah(y),[y]),x=h[c],S=X(x.W_panel),C=X(u*p-.75),w=fl(Math.max(12,S*C*4.2*.00115*(m===`vented-slots`?.78:.94))),T=eh(_),E=T?Xh(T):``,D=`custom-${c}-cover-${String(u).replaceAll(`.`,`p`)}u-${m}${E?`-${E}`:``}`,O=typeof window<`u`?new URLSearchParams(window.location.search).get(`session`)?.trim()??``:``,k=/^[a-zA-Z0-9_-]{1,128}$/.test(O)?O:``;return(0,$.jsxs)(`div`,{"data-testid":`bom-and-exports-view`,style:{width:`100%`,height:`100%`,overflowY:`auto`,padding:`24px 28px`,background:`#09090b`,display:`flex`,flexDirection:`column`,gap:`20px`},children:[(0,$.jsxs)(`div`,{style:{padding:`16px 20px`,borderRadius:`10px`,background:`#121216`,border:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexWrap:`wrap`,alignItems:`center`,justifyContent:`space-between`,gap:`14px`},children:[(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`div`,{style:{fontSize:`14px`,fontWeight:600,color:`#F4F4F5`},children:`Deterministic CAD & Procurement Deliverables`}),(0,$.jsx)(`div`,{style:{fontSize:`12px`,color:`#A1A1AA`,marginTop:`3px`},children:`Export synchronized 2D SVG elevations, wiring schematics, Markdown BOM, and 3D glTF 2.0 (.glb) assets.`})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`8px`},children:[(0,$.jsx)(`button`,{type:`button`,"data-testid":`export-elevation-svg`,onClick:()=>Yh(t,`elevation.svg`,`image/svg+xml;charset=utf-8`),style:{padding:`7px 12px`,borderRadius:`6px`,border:`1px solid rgba(59, 130, 246, 0.35)`,background:`rgba(59, 130, 246, 0.12)`,color:`#93C5FD`,fontSize:`12px`,fontWeight:600,cursor:`pointer`},children:`Download elevation.svg`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`export-wiring-svg`,onClick:()=>Yh(n,`wiring-schematic.svg`,`image/svg+xml;charset=utf-8`),style:{padding:`7px 12px`,borderRadius:`6px`,border:`1px solid rgba(16, 185, 129, 0.35)`,background:`rgba(16, 185, 129, 0.12)`,color:`#6EE7B7`,fontSize:`12px`,fontWeight:600,cursor:`pointer`},children:`Download wiring-schematic.svg`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`export-bom-md`,onClick:()=>Yh(r,`BOM.md`,`text/markdown;charset=utf-8`),style:{padding:`7px 12px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.12)`,background:`#18181d`,color:`#F4F4F5`,fontSize:`12px`,fontWeight:600,cursor:`pointer`},children:`Download BOM.md`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`export-rack-json`,onClick:()=>Yh(JSON.stringify(e.project,null,2),`rack.json`,`application/json;charset=utf-8`),style:{padding:`7px 12px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.12)`,background:`#18181d`,color:`#A1A1AA`,fontSize:`12px`,fontWeight:500,cursor:`pointer`},children:`Download rack.json`}),(0,$.jsx)(`a`,{href:k?`/api/export/scene.glb?session=${encodeURIComponent(k)}`:`/api/export/scene.glb`,download:`rack-scene.glb`,"data-testid":`export-scene-glb`,style:{padding:`7px 12px`,borderRadius:`6px`,border:`1px solid rgba(168, 85, 247, 0.35)`,background:`rgba(168, 85, 247, 0.12)`,color:`#D8B4FE`,fontSize:`12px`,fontWeight:600,textDecoration:`none`,display:`inline-flex`,alignItems:`center`},children:`Download rack-scene.glb`})]})]}),(0,$.jsxs)(`section`,{style:{padding:`18px 20px`,borderRadius:`10px`,background:`#121216`,border:`1px solid rgba(255, 255, 255, 0.07)`},children:[(0,$.jsxs)(`h3`,{style:{margin:`0 0 12px 0`,fontSize:`12.5px`,fontWeight:600,letterSpacing:`0.03em`,textTransform:`uppercase`,color:`#A1A1AA`},children:[`1. Mounted Equipment & Sub-Module Schedule (`,e.geometry.devices.length,` Units)`]}),(0,$.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`12px`},children:[(0,$.jsx)(`thead`,{children:(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,color:`#71717A`,textAlign:`left`},children:[(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`U / Slot`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Face`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Instance / Hostname`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Manufacturer & Model`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Dimensions (mm)`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Max Draw`})]})}),(0,$.jsx)(`tbody`,{children:e.geometry.devices.map(e=>(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,color:`#93C5FD`},children:[`U`,e.u_position,e.slot_id?` • ${e.slot_id}`:``]}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,color:`#A1A1AA`},children:e.face.toUpperCase()}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,fontWeight:600,color:`#F4F4F5`},children:[e.hostname??e.instance_id,` `,(0,$.jsxs)(`span`,{style:{color:`#71717A`,fontWeight:400},children:[`(`,e.instance_id,`)`]})]}),(0,$.jsxs)(`td`,{style:{padding:`8px`,color:`#E4E4E7`},children:[(0,$.jsxs)(`div`,{style:{fontWeight:600},children:[e.blueprint.manufacturer,` `,e.blueprint.model]}),e.blueprint.description&&(0,$.jsx)(`div`,{style:{fontSize:`11px`,color:`#A1A1AA`,marginTop:`3px`,lineHeight:1.4},children:e.blueprint.description})]}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,color:`#A1A1AA`},children:[e.blueprint.geometry.width_mm,` ×`,` `,e.blueprint.geometry.height_mm,` ×`,` `,e.blueprint.geometry.depth_mm,` mm`]}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,color:`#F4F4F5`},children:[e.blueprint.power_and_thermal.max_system_watts,` W`]})]},e.instance_id))})]})]}),(0,$.jsxs)(`section`,{style:{padding:`18px 20px`,borderRadius:`10px`,background:`#121216`,border:`1px solid rgba(255, 255, 255, 0.07)`},children:[(0,$.jsxs)(`h3`,{style:{margin:`0 0 12px 0`,fontSize:`12.5px`,fontWeight:600,letterSpacing:`0.03em`,textTransform:`uppercase`,color:`#A1A1AA`},children:[`2. 3D-Print Fabrication Queue (`,i.length,` Carriers •`,` `,a,`g Total Filament)`]}),(0,$.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`12px`},children:[(0,$.jsx)(`thead`,{children:(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,color:`#71717A`,textAlign:`left`},children:[(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Carrier Instance`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Blueprint Slug`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Material`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Filament`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Join Mechanism`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`3D CAD Export (.SCAD / .STL)`})]})}),(0,$.jsx)(`tbody`,{children:i.map(t=>{let n=t.blueprint.printable_metadata??{material_recommendation:`PETG / ABS`,filament_grams:95,fasteners:`4x M6 Cage Nuts (3D-Printed 10" Cradle)`};return(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,fontWeight:600,color:`#6EE7B7`},children:[`U`,t.u_position,` • `,t.instance_id]}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,color:`#E4E4E7`},children:t.blueprint_slug}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,color:`#A1A1AA`},children:n.material_recommendation}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,color:`#F4F4F5`},children:[n.filament_grams,` g`]}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,color:`#71717A`},children:n.fasteners??`M4 Rack Screws`}),(0,$.jsx)(`td`,{style:{padding:`8px`},children:(0,$.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,$.jsx)(`button`,{type:`button`,"data-testid":`download-scad-${t.instance_id}`,onClick:()=>Yh(Jm(t.blueprint,e.project.rack.standard),`${t.blueprint_slug}.scad`,`text/plain;charset=utf-8`),style:{padding:`4px 8px`,borderRadius:`5px`,border:`1px solid rgba(59, 130, 246, 0.35)`,background:`rgba(59, 130, 246, 0.12)`,color:`#93C5FD`,fontSize:`10.5px`,fontWeight:600,cursor:`pointer`},children:`.SCAD`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`download-stl-${t.instance_id}`,onClick:()=>Yh(Qm(t.blueprint,e.project.rack.standard),`${t.blueprint_slug}.stl`,`model/stl;charset=utf-8`),style:{padding:`4px 8px`,borderRadius:`5px`,border:`1px solid rgba(16, 185, 129, 0.35)`,background:`rgba(16, 185, 129, 0.12)`,color:`#6EE7B7`,fontSize:`10.5px`,fontWeight:600,cursor:`pointer`},children:`.STL`})]})})]},t.instance_id)})})]}),(0,$.jsxs)(`div`,{style:{marginTop:`18px`,paddingTop:`14px`,borderTop:`1px solid rgba(255, 255, 255, 0.07)`},children:[(0,$.jsx)(`h4`,{style:{margin:`0 0 10px 0`,fontSize:`11.5px`,fontWeight:600,letterSpacing:`0.03em`,textTransform:`uppercase`,color:`#A1A1AA`},children:`2.1 Custom 3D-Print Slot Cover-Panel Configurator (0.5U – 3U • Engraved Label • Watertight 2-Manifold .STL)`}),(0,$.jsxs)(`form`,{"data-testid":`cover-panel-customizer-form`,onSubmit:e=>e.preventDefault(),style:{padding:`14px 16px`,borderRadius:`8px`,background:`#16161B`,border:`1px solid rgba(255, 255, 255, 0.08)`,display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(260px, 1fr))`,gap:`16px`,alignItems:`center`},children:[(0,$.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`10px`},children:[(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{htmlFor:`custom-cover-standard`,style:{display:`block`,fontSize:`10.5px`,color:`#A1A1AA`,marginBottom:`4px`},children:`Rack Standard`}),(0,$.jsxs)(`select`,{id:`custom-cover-standard`,"data-testid":`custom-cover-standard`,value:c,onChange:e=>l(e.target.value),style:{width:`100%`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#121216`,color:`#F4F4F5`,fontSize:`11.5px`},children:[(0,$.jsx)(`option`,{value:`10inch`,children:`10-Inch Mini-Rack (254.0 mm)`}),(0,$.jsx)(`option`,{value:`19inch`,children:`19-Inch Enterprise (482.6 mm)`}),(0,$.jsx)(`option`,{value:`6inch`,children:`6-Inch Micro-Lab (152.4 mm)`})]})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{htmlFor:`custom-cover-u-height`,style:{display:`block`,fontSize:`10.5px`,color:`#A1A1AA`,marginBottom:`4px`},children:`Slot Height (U)`}),(0,$.jsxs)(`select`,{id:`custom-cover-u-height`,"data-testid":`custom-cover-u-height`,value:String(u),onChange:e=>f(Number(e.target.value)),style:{width:`100%`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#121216`,color:`#F4F4F5`,fontSize:`11.5px`},children:[(0,$.jsx)(`option`,{value:`0.5`,children:`0.5U Half-Slot (21.48 mm)`}),(0,$.jsx)(`option`,{value:`1`,children:`1U Single Slot (43.70 mm)`}),(0,$.jsx)(`option`,{value:`2`,children:`2U Double Slot (88.15 mm)`}),(0,$.jsx)(`option`,{value:`3`,children:`3U Triple Slot (132.60 mm)`})]})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{htmlFor:`custom-cover-pattern`,style:{display:`block`,fontSize:`10.5px`,color:`#A1A1AA`,marginBottom:`4px`},children:`Surface Pattern`}),(0,$.jsxs)(`select`,{id:`custom-cover-pattern`,"data-testid":`custom-cover-pattern`,value:m,onChange:e=>g(e.target.value),style:{width:`100%`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#121216`,color:`#F4F4F5`,fontSize:`11.5px`},children:[(0,$.jsx)(`option`,{value:`lines`,children:`Horizontal Lines (Blind Relief)`}),(0,$.jsx)(`option`,{value:`hex`,children:`Hex-Grid Matrix (Blind Relief)`}),(0,$.jsx)(`option`,{value:`ribs`,children:`Vertical Tech-Ribs (Blind Relief)`}),(0,$.jsx)(`option`,{value:`vented-slots`,children:`Vented Airflow Slots (Through-Cut)`}),(0,$.jsx)(`option`,{value:`solid`,children:`Solid Minimalist Bezel`})]})]}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`label`,{htmlFor:`custom-cover-label`,style:{display:`block`,fontSize:`10.5px`,color:`#A1A1AA`,marginBottom:`4px`},children:`Engraved Front Text (Optional)`}),(0,$.jsx)(`input`,{id:`custom-cover-label`,"data-testid":`custom-cover-label`,type:`text`,maxLength:14,value:_,placeholder:`e.g. HOMELAB-01`,onChange:e=>v(e.target.value),style:{width:`100%`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.1)`,background:`#121216`,color:`#F4F4F5`,fontSize:`11.5px`,boxSizing:`border-box`}})]}),(0,$.jsxs)(`div`,{style:{gridColumn:`1 / -1`,display:`flex`,flexWrap:`wrap`,alignItems:`center`,justifyContent:`space-between`,gap:`8px`,paddingTop:`4px`},children:[(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`11px`,color:`#A1A1AA`},children:[S,` × `,C,` × `,14,` mm • ~`,w,` g PETG • Face-Down No-Support Print`]}),(0,$.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,$.jsx)(`button`,{type:`button`,"data-testid":`download-custom-cover-scad`,onClick:()=>Yh(rh(y),`${D}.scad`,`text/plain;charset=utf-8`),style:{padding:`6px 10px`,borderRadius:`6px`,border:`1px solid rgba(59, 130, 246, 0.35)`,background:`rgba(59, 130, 246, 0.12)`,color:`#93C5FD`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:`Download Custom .SCAD`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`download-custom-cover-stl`,onClick:()=>Yh(ih(y),`${D}.stl`,`model/stl;charset=utf-8`),style:{padding:`6px 10px`,borderRadius:`6px`,border:`1px solid rgba(16, 185, 129, 0.35)`,background:`rgba(16, 185, 129, 0.12)`,color:`#6EE7B7`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:`Download Custom .STL`})]})]})]}),(0,$.jsx)(`div`,{"data-testid":`custom-cover-svg-preview`,style:{padding:`10px`,borderRadius:`8px`,background:`#0E0E11`,border:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,minHeight:`116px`},children:(0,$.jsx)(`img`,{src:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(b)}`,alt:`Live 2D CAD Front-Elevation Preview`,draggable:!1,style:{width:`100%`,maxHeight:`132px`,display:`block`,userSelect:`none`}})})]})]}),(0,$.jsxs)(`div`,{style:{marginTop:`18px`,paddingTop:`14px`,borderTop:`1px solid rgba(255, 255, 255, 0.07)`},children:[(0,$.jsxs)(`h4`,{style:{margin:`0 0 10px 0`,fontSize:`11.5px`,fontWeight:600,letterSpacing:`0.03em`,textTransform:`uppercase`,color:`#A1A1AA`},children:[`2.2 3D-Printable Slot Cover Panels Library (`,o.length,` Variants • 1U & 2U • Lines / Hex / Tech-Ribs)`]}),(0,$.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`12px`},children:[(0,$.jsx)(`thead`,{children:(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,color:`#71717A`,textAlign:`left`},children:[(0,$.jsx)(`th`,{style:{padding:`7px 8px`,fontWeight:500},children:`Standard / Size`}),(0,$.jsx)(`th`,{style:{padding:`7px 8px`,fontWeight:500},children:`Blueprint Slug`}),(0,$.jsx)(`th`,{style:{padding:`7px 8px`,fontWeight:500},children:`Pattern & Model`}),(0,$.jsx)(`th`,{style:{padding:`7px 8px`,fontWeight:500},children:`Dimensions (mm)`}),(0,$.jsx)(`th`,{style:{padding:`7px 8px`,fontWeight:500},children:`Filament`}),(0,$.jsx)(`th`,{style:{padding:`7px 8px`,fontWeight:500},children:`3D CAD Export (.SCAD / .STL)`})]})}),(0,$.jsx)(`tbody`,{children:o.map(e=>{let t=e.mount_type===`rackmount-19`?`19inch`:e.mount_type===`rackmount-6`?`6inch`:`10inch`,n=e.geometry.u_height??1,r=e.printable_metadata?.filament_grams??45;return(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`7px 8px`,fontWeight:600,color:`#93C5FD`},children:[t.toUpperCase(),` • `,n,`U`]}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`7px 8px`,color:`#E4E4E7`},children:e.slug}),(0,$.jsx)(`td`,{style:{padding:`7px 8px`,color:`#A1A1AA`},children:e.model}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`7px 8px`,color:`#A1A1AA`},children:[e.geometry.width_mm,` × `,e.geometry.height_mm,` ×`,` `,e.geometry.depth_mm,` mm`]}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`7px 8px`,color:`#F4F4F5`},children:[r,` g`]}),(0,$.jsx)(`td`,{style:{padding:`7px 8px`},children:(0,$.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,$.jsx)(`button`,{type:`button`,"data-testid":`download-cover-scad-${e.slug}`,onClick:()=>Yh(Jm(e,t),`${e.slug}.scad`,`text/plain;charset=utf-8`),style:{padding:`4px 8px`,borderRadius:`5px`,border:`1px solid rgba(59, 130, 246, 0.35)`,background:`rgba(59, 130, 246, 0.12)`,color:`#93C5FD`,fontSize:`10.5px`,fontWeight:600,cursor:`pointer`},children:`.SCAD`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`download-cover-stl-${e.slug}`,onClick:()=>Yh(Qm(e,t),`${e.slug}.stl`,`model/stl;charset=utf-8`),style:{padding:`4px 8px`,borderRadius:`5px`,border:`1px solid rgba(16, 185, 129, 0.35)`,background:`rgba(16, 185, 129, 0.12)`,color:`#6EE7B7`,fontSize:`10.5px`,fontWeight:600,cursor:`pointer`},children:`.STL`})]})})]},e.slug)})})]})]})]}),(0,$.jsxs)(`section`,{style:{padding:`18px 20px`,borderRadius:`10px`,background:`#121216`,border:`1px solid rgba(255, 255, 255, 0.07)`},children:[(0,$.jsxs)(`h3`,{style:{margin:`0 0 12px 0`,fontSize:`12.5px`,fontWeight:600,letterSpacing:`0.03em`,textTransform:`uppercase`,color:`#A1A1AA`},children:[`3. Step-by-Step Cable Patching Schedule (`,e.project.cables.length,` `,`Cables)`]}),(0,$.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`12px`},children:[(0,$.jsx)(`thead`,{children:(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,color:`#71717A`,textAlign:`left`},children:[(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Cable ID`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Label / Purpose`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Type`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`From Port`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`To Port`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`3D Spline Length`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Commercial Bin`})]})}),(0,$.jsx)(`tbody`,{children:e.project.cables.map(e=>{let t=s.get(e.cable_id);return(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,fontWeight:600,color:e.color_hex},children:[`● `,e.cable_id]}),(0,$.jsx)(`td`,{style:{padding:`8px`,color:`#F4F4F5`,fontWeight:500},children:e.label??`—`}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,color:`#A1A1AA`},children:e.cable_type}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,color:`#E4E4E7`},children:[e.from.instance_id,`:`,e.from.port_id]}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,color:`#E4E4E7`},children:[e.to.instance_id,`:`,e.to.port_id]}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,color:`#A1A1AA`},children:t?`${fl(t.required_length_mm)} mm`:`—`}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,fontWeight:600,color:`#F4F4F5`},children:t?`${(t.recommended_commercial_mm/1e3).toFixed(2)} m (${t.recommended_commercial_mm} mm)`:`—`})]},e.cable_id)})})]})]}),(e.project.external_endpoints??[]).length>0&&(0,$.jsxs)(`section`,{"data-testid":`bom-external-patching-guide`,style:{padding:`18px 20px`,borderRadius:`10px`,background:`#121216`,border:`1px solid rgba(255, 255, 255, 0.07)`},children:[(0,$.jsxs)(`h3`,{style:{margin:`0 0 6px 0`,fontSize:`12.5px`,fontWeight:600,letterSpacing:`0.03em`,textTransform:`uppercase`,color:`#F4F4F5`},children:[`4. 🏠 Haus- & Raum-Verkabelung — Steck-für-Steck-Anleitung (`,(e.project.external_endpoints??[]).length,` Gebäude-Leitungen)`]}),(0,$.jsx)(`div`,{style:{fontSize:`11.5px`,color:`#A1A1AA`,marginBottom:`12px`},children:`So schließt du alle ankommenden Verlegekabel aus dem Gebäude (Kameras, Access Points, Büros, Beamer, PCs) Schritt für Schritt an dein Rack an:`}),(0,$.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,fontSize:`12px`},children:[(0,$.jsx)(`thead`,{children:(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.09)`,color:`#71717A`,textAlign:`left`},children:[(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`#`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Raum / Gerät`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Typ & PoE`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Schritt 1: Hinten auflegen (Rückseite)`}),(0,$.jsx)(`th`,{style:{padding:`8px`,fontWeight:500},children:`Schritt 2: Vorne patchen (Vorderseite)`})]})}),(0,$.jsx)(`tbody`,{children:(e.project.external_endpoints??[]).map((t,n)=>{let r=e.project.cables.find(e=>e.from.instance_id===t.patch_panel_instance_id&&e.from.port_id===t.patch_panel_port_id&&(e.from.face??`front`)===`front`||e.to.instance_id===t.patch_panel_instance_id&&e.to.port_id===t.patch_panel_port_id&&(e.to.face??`front`)===`front`),i=r?r.from.instance_id===t.patch_panel_instance_id&&r.from.port_id===t.patch_panel_port_id?r.to:r.from:null;return(0,$.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,color:`#71717A`},children:n+1}),(0,$.jsxs)(`td`,{style:{padding:`8px`,fontWeight:600,color:`#F4F4F5`},children:[(0,$.jsx)(`span`,{style:{display:`inline-block`,width:`8px`,height:`8px`,borderRadius:`50%`,background:t.color_hex,marginRight:`8px`}}),t.label,t.room_or_zone?` (${t.room_or_zone})`:``]}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,color:`#A1A1AA`},children:[t.category,` •`,` `,t.poe_draw_watts>0?(0,$.jsxs)(`span`,{style:{color:`#FCD34D`,fontWeight:600},children:[`PoE `,t.poe_draw_watts,` W`]}):`Ohne PoE`]}),(0,$.jsxs)(`td`,{className:`mono`,style:{padding:`8px`,color:`#E4E4E7`},children:[`Wandkabel →`,` `,(0,$.jsxs)(`strong`,{children:[t.patch_panel_instance_id,`:`,t.patch_panel_port_id.toUpperCase()]}),` `,`(Hinten)`]}),(0,$.jsx)(`td`,{className:`mono`,style:{padding:`8px`,color:`#6EE7B7`},children:i&&r?`Patchkabel (${r.cable_id}) von ${t.patch_panel_port_id.toUpperCase()} (Vorne) → ${i.instance_id}:${i.port_id.toUpperCase()}`:`Noch kein Patchkabel vorne gesteckt`})]},t.endpoint_id)})})]})]})]})}function Qh({scene:e,connectionMode:t=`standalone-demo`,projectPath:n,mcpToolLog:r=[],selectedDeviceId:i,selectedCableId:a,onSelectDevice:o,onSelectCable:s,onMoveDeviceU:c,onRemoveDevice:l,onDisconnectCable:u,onClearToolLog:f,onSimulateAgentStep:p}){let[m,h]=(0,d.useState)(`all`),g=e.validation.power_summary,_=e.validation.mechanical_summary,v=e.project.rack.u_height,y=g.power_sources.find(e=>e.role===`ups`),b=g.pse_budgets[0],x=new Set;for(let t of e.geometry.devices)if(t.mount_target===`rack-unit`)for(let e=t.u_range[0];e<=t.u_range[1];e++)x.add(e);let S=Math.min(100,Math.round(x.size/Math.max(1,v)*100)),C=i?e.geometry.devices.find(e=>e.instance_id===i):void 0,w=a?e.project.cables.find(e=>e.cable_id===a):void 0,T=a?e.cable_routes.find(e=>e.cable_id===a):void 0,E=m===`all`||m===`inspector`,D=m===`all`||m===`diagnostics`,O=m===`all`||m===`agent`;return(0,$.jsxs)(`aside`,{"data-testid":`inspector-sidebar`,style:{width:`368px`,minWidth:`368px`,maxWidth:`368px`,height:`100%`,background:`#0E0E11`,borderLeft:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,overflowY:`auto`,overflowX:`hidden`,boxSizing:`border-box`,flexShrink:0},children:[(0,$.jsxs)(`section`,{"data-testid":`telemetry-section`,style:{padding:`14px 16px`,borderBottom:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,gap:`10px`,background:`#111115`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,$.jsx)(`span`,{style:{fontSize:`12px`,fontWeight:600,color:`#E4E4E7`,letterSpacing:`-0.01em`},children:`Rack Telemetry & Power`}),(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`10.5px`,color:`#71717A`},children:[x.size,`/`,v,`U (`,S,`%)`]})]}),(0,$.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(2, minmax(0, 1fr))`,gap:`10px`},children:[(0,$.jsxs)(`div`,{style:{minWidth:0,overflow:`hidden`,padding:`8px 10px`,borderRadius:`7px`,background:`#17171C`,border:`1px solid rgba(255, 255, 255, 0.06)`},children:[(0,$.jsxs)(`div`,{className:`mono`,style:{display:`flex`,justifyContent:`space-between`,fontSize:`10px`,marginBottom:`5px`},children:[(0,$.jsx)(`span`,{style:{color:`#A1A1AA`},children:`UPS Load`}),(0,$.jsxs)(`span`,{style:{color:`#F4F4F5`,fontWeight:600},children:[fl(g.total_system_watts),`W /`,` `,y?.capacity_watts??300,`W`]})]}),(0,$.jsx)(`div`,{style:{height:`4px`,borderRadius:`999px`,background:`#272730`,overflow:`hidden`},children:(0,$.jsx)(`div`,{style:{width:`${Math.min(100,y?.utilization_percent??50)}%`,height:`100%`,background:`#10B981`}})})]}),(0,$.jsxs)(`div`,{style:{minWidth:0,overflow:`hidden`,padding:`8px 10px`,borderRadius:`7px`,background:`#17171C`,border:`1px solid rgba(255, 255, 255, 0.06)`},children:[(0,$.jsxs)(`div`,{className:`mono`,style:{display:`flex`,justifyContent:`space-between`,fontSize:`10px`,marginBottom:`5px`},children:[(0,$.jsx)(`span`,{style:{color:`#A1A1AA`},children:`PoE Budget`}),(0,$.jsxs)(`span`,{style:{color:`#F4F4F5`,fontWeight:600},children:[fl(g.total_poe_watts),`W /`,` `,b?.poe_budget_watts??196,`W`]})]}),(0,$.jsx)(`div`,{style:{height:`4px`,borderRadius:`999px`,background:`#272730`,overflow:`hidden`},children:(0,$.jsx)(`div`,{style:{width:`${Math.min(100,b&&b.poe_budget_watts>0?b.consumed_poe_watts/b.poe_budget_watts*100:0)}%`,height:`100%`,background:`#3B82F6`}})})]})]}),(0,$.jsxs)(`div`,{className:`mono`,style:{display:`grid`,gridTemplateColumns:`repeat(3, minmax(0, 1fr))`,gap:`6px`},children:[(0,$.jsxs)(`div`,{style:{minWidth:0,overflow:`hidden`,padding:`7px 8px`,borderRadius:`6px`,background:`#16161B`,border:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsx)(`div`,{style:{fontSize:`9px`,color:`#71717A`},children:`MASS`}),(0,$.jsxs)(`div`,{style:{fontSize:`11.5px`,fontWeight:600,color:`#F4F4F5`,marginTop:`2px`},children:[fl(_.total_weight_grams/1e3),` kg`]})]}),(0,$.jsxs)(`div`,{style:{minWidth:0,overflow:`hidden`,padding:`7px 8px`,borderRadius:`6px`,background:`#16161B`,border:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsx)(`div`,{style:{fontSize:`9px`,color:`#71717A`},children:`CoG Y`}),(0,$.jsxs)(`div`,{style:{fontSize:`11.5px`,fontWeight:600,color:`#F4F4F5`,marginTop:`2px`},children:[fl(_.center_of_gravity_y_mm),` mm`]})]}),(0,$.jsxs)(`div`,{"data-testid":`kpi-thermal-btu`,style:{minWidth:0,overflow:`hidden`,padding:`7px 8px`,borderRadius:`6px`,background:`#16161B`,border:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsx)(`div`,{style:{fontSize:`9px`,color:`#71717A`},children:`HEAT LOAD`}),(0,$.jsxs)(`div`,{style:{fontSize:`11.5px`,fontWeight:600,color:`#F4F4F5`,marginTop:`2px`},children:[fl(_.total_thermal_btu_hr),` BTU/h`]})]}),(0,$.jsxs)(`div`,{"data-testid":`kpi-acoustic-dba`,style:{minWidth:0,overflow:`hidden`,padding:`7px 8px`,borderRadius:`6px`,background:`#16161B`,border:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsx)(`div`,{style:{fontSize:`9px`,color:`#71717A`},children:`ACOUSTICS`}),(0,$.jsxs)(`div`,{style:{fontSize:`11.5px`,fontWeight:600,color:`#F4F4F5`,marginTop:`2px`},children:[fl(_.combined_noise_db_a),` dB(A)`]})]}),(0,$.jsxs)(`div`,{"data-testid":`kpi-airflow-profile`,style:{minWidth:0,overflow:`hidden`,gridColumn:`span 2`,padding:`7px 8px`,borderRadius:`6px`,background:`#16161B`,border:`1px solid rgba(255, 255, 255, 0.05)`},children:[(0,$.jsx)(`div`,{style:{fontSize:`9px`,color:`#71717A`},children:`AIRFLOW PROFILE`}),(0,$.jsx)(`div`,{style:{fontSize:`11px`,fontWeight:600,color:`#D4D4D8`,marginTop:`2px`},children:_.airflow_profile})]})]})]}),(0,$.jsx)(`div`,{style:{padding:`8px 16px`,background:`#0E0E11`,borderBottom:`1px solid rgba(255, 255, 255, 0.07)`,position:`sticky`,top:0,zIndex:10},children:(0,$.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 1fr)`,gap:`2px`,padding:`2px`,borderRadius:`7px`,background:`#15151A`,border:`1px solid rgba(255, 255, 255, 0.06)`},children:[{id:`all`,label:`All`},{id:`inspector`,label:`Element`},{id:`diagnostics`,label:`Checks (${e.validation.error_count})`},{id:`agent`,label:`MCP (${r.length})`}].map(e=>{let t=m===e.id;return(0,$.jsx)(`button`,{type:`button`,onClick:()=>h(e.id),style:{padding:`4px 6px`,borderRadius:`5px`,border:`none`,background:t?`#25252E`:`transparent`,color:t?`#F4F4F5`:`#A1A1AA`,fontSize:`10.5px`,fontWeight:t?600:500,cursor:`pointer`,whiteSpace:`nowrap`},children:e.label},e.id)})})}),E&&(0,$.jsxs)(`section`,{"data-testid":`selection-inspector`,style:{padding:`14px 16px`,borderBottom:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,$.jsx)(`span`,{style:{fontSize:`12px`,fontWeight:600,color:`#E4E4E7`},children:`Selected Element`}),C&&(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`10px`,padding:`2px 6px`,borderRadius:`4px`,background:`#18181F`,color:`#93C5FD`,border:`1px solid rgba(59, 130, 246, 0.25)`},children:[`U`,C.u_position,` ·`,` `,C.face.toUpperCase()]})]}),C?(0,$.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`,minWidth:0},children:[(0,$.jsxs)(`div`,{style:{minWidth:0,overflow:`hidden`,padding:`12px`,borderRadius:`8px`,background:`#15151A`,border:`1px solid rgba(255, 255, 255, 0.08)`},children:[(0,$.jsxs)(`div`,{style:{fontSize:`13px`,fontWeight:600,color:`#F4F4F5`,overflowWrap:`anywhere`},children:[C.blueprint.manufacturer,` `,C.blueprint.model]}),C.hostname&&(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`11px`,fontWeight:600,color:`#93C5FD`,marginTop:`3px`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:[`Hostname / Rolle: `,C.hostname]}),(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`10.5px`,color:`#A1A1AA`,marginTop:`2px`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:[C.instance_id,` · `,C.blueprint_slug]}),(()=>{let e=C.mount_target===`rack-unit`&&C.blueprint.visuals.material_preset===`polycarbonate`&&C.blueprint.geometry.height_mm<38,t=C.blueprint.category===`modular-carrier`||C.blueprint.printable_metadata!==null,n=C.mount_target===`carrier-slot`,r=e?`🖨️ Desktop-Gerät (benötigt 3D-Druck-Halterung / 1U-Fachboden)`:t?`🖨️ 3D-gedruckter 1U-Modulträger (PETG / ABS)`:n?`🧩 Sub-Modul im Carrier-Slot (${C.slot_id??`Bay`})`:`🔩 Direktmontage (inklusive Metall-Rackohren)`,i=e||t?{bg:`rgba(245, 158, 11, 0.12)`,border:`rgba(245, 158, 11, 0.3)`,text:`#FDE68A`}:n?{bg:`rgba(59, 130, 246, 0.12)`,border:`rgba(59, 130, 246, 0.3)`,text:`#93C5FD`}:{bg:`rgba(16, 185, 129, 0.1)`,border:`rgba(16, 185, 129, 0.25)`,text:`#6EE7B7`};return(0,$.jsx)(`div`,{"data-testid":`device-mounting-badge`,style:{marginTop:`7px`,padding:`4px 8px`,borderRadius:`5px`,background:i.bg,border:`1px solid ${i.border}`,color:i.text,fontSize:`10.5px`,fontWeight:600,lineHeight:1.35},children:r})})(),C.blueprint.description&&(0,$.jsxs)(`div`,{"data-testid":`selected-device-description`,style:{marginTop:`8px`,padding:`8px 10px`,borderRadius:`6px`,background:`#111115`,border:`1px solid rgba(255, 255, 255, 0.06)`,borderLeft:`2.5px solid #3B82F6`,fontSize:`11px`,color:`#D4D4D8`,lineHeight:1.45},children:[(0,$.jsx)(`div`,{style:{fontSize:`9.5px`,fontWeight:700,letterSpacing:`0.03em`,textTransform:`uppercase`,color:`#93C5FD`,marginBottom:`3px`},children:`Was ist dieses Gerät?`}),C.blueprint.description]}),(0,$.jsxs)(`div`,{className:`mono`,style:{display:`grid`,gridTemplateColumns:`repeat(2, minmax(0, 1fr))`,gap:`6px`,marginTop:`10px`,paddingTop:`10px`,borderTop:`1px solid rgba(255, 255, 255, 0.06)`,fontSize:`10.5px`},children:[(0,$.jsxs)(`div`,{style:{minWidth:0,overflow:`hidden`},children:[(0,$.jsx)(`div`,{style:{color:`#71717A`,fontSize:`9.5px`},children:`DIMENSIONS`}),(0,$.jsxs)(`div`,{style:{color:`#E4E4E7`,marginTop:`2px`},children:[C.blueprint.geometry.width_mm,`×`,C.blueprint.geometry.height_mm,`×`,C.blueprint.geometry.depth_mm,`mm`]})]}),(0,$.jsxs)(`div`,{style:{minWidth:0,overflow:`hidden`},children:[(0,$.jsx)(`div`,{style:{color:`#71717A`,fontSize:`9.5px`},children:`POWER DRAW`}),(0,$.jsxs)(`div`,{style:{color:`#E4E4E7`,marginTop:`2px`},children:[C.blueprint.power_and_thermal.idle_watts,`W /`,` `,C.blueprint.power_and_thermal.max_system_watts,`W Max`]})]})]}),C.mount_target===`rack-unit`&&(0,$.jsxs)(`div`,{style:{marginTop:`10px`},children:[(0,$.jsx)(`div`,{className:`mono`,style:{fontSize:`9.5px`,color:`#71717A`,marginBottom:`5px`},children:`RELOCATE RACK UNIT (LIVE AABB SOLVER)`}),(0,$.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`4px`},children:Array.from({length:v},(e,t)=>t+1).map(e=>{let t=C.u_position===e;return(0,$.jsxs)(`button`,{type:`button`,"data-testid":`move-device-u-${e}`,onClick:()=>c(C.instance_id,e),className:`mono`,style:{padding:`3px 7px`,borderRadius:`5px`,border:t?`1px solid rgba(59, 130, 246, 0.5)`:`1px solid rgba(255, 255, 255, 0.08)`,background:t?`rgba(59, 130, 246, 0.2)`:`#1C1C22`,color:t?`#93C5FD`:`#D4D4D8`,fontSize:`10.5px`,fontWeight:t?600:400,cursor:`pointer`},children:[`U`,e]},e)})})]}),l&&(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-remove-device`,onClick:()=>l(C.instance_id),style:{marginTop:`10px`,width:`100%`,padding:`6px 10px`,borderRadius:`6px`,border:`1px solid rgba(239, 68, 68, 0.3)`,background:`rgba(239, 68, 68, 0.08)`,color:`#FCA5A5`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:[`Remove Device (`,C.instance_id,`)`]})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`10.5px`,fontWeight:600,color:`#A1A1AA`},children:[`Ports (`,C.ports.length,`)`]}),(0,$.jsx)(`span`,{style:{fontSize:`10px`,color:`#71717A`},children:`Click linked port to inspect cable`})]}),(0,$.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(2, minmax(0, 1fr))`,gap:`5px`,minWidth:0,width:`100%`},children:C.ports.map(t=>{let n=e.project.cables.find(e=>e.from.instance_id===C.instance_id&&e.from.port_id===t.port_id||e.to.instance_id===C.instance_id&&e.to.port_id===t.port_id),r=e.project.external_endpoints.find(e=>e.patch_panel_instance_id===C.instance_id&&e.patch_panel_port_id===t.port_id);return(0,$.jsxs)(`div`,{onClick:()=>{n&&s(n.cable_id)},title:r?`${t.port_id}: ${r.label} (${r.room_or_zone??`Gebäude`})`:n?`${t.port_id}: ${n.label??n.cable_id}`:`${t.port_id} (${t.connector_type})`,style:{minWidth:0,overflow:`hidden`,padding:`6px 8px`,borderRadius:`6px`,background:`#15151A`,border:n||r?`1px solid rgba(255, 255, 255, 0.14)`:`1px solid rgba(255, 255, 255, 0.05)`,borderLeft:n?`2.5px solid ${n.color_hex}`:r?`2.5px solid ${r.color_hex}`:`1px solid rgba(255, 255, 255, 0.05)`,fontSize:`10.5px`,cursor:n?`pointer`:`default`,display:`flex`,flexDirection:`column`,gap:`2px`},children:[(0,$.jsxs)(`div`,{className:`mono`,style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`4px`,minWidth:0,fontWeight:600,color:`#E4E4E7`},children:[(0,$.jsx)(`span`,{style:{minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:t.port_id}),(0,$.jsx)(`span`,{style:{color:`#71717A`,fontSize:`9px`,flexShrink:0},children:r?`rear+front`:t.world_face})]}),(0,$.jsx)(`div`,{className:`mono`,style:{minWidth:0,color:n||r?`#A1A1AA`:`#52525B`,fontSize:`9.5px`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:r?`🏠 ${r.label}`:n?n.label??n.cable_id:t.connector_type})]},`${t.port_id}-${t.world_face}`)})})]}):w&&T?(()=>{let t=e.project.external_endpoints.find(e=>w.from.instance_id===e.patch_panel_instance_id&&w.from.port_id===e.patch_panel_port_id||w.to.instance_id===e.patch_panel_instance_id&&w.to.port_id===e.patch_panel_port_id),n=t&&w.from.instance_id===t.patch_panel_instance_id?w.to:w.from;return(0,$.jsxs)(`div`,{style:{padding:`12px`,borderRadius:`8px`,background:`#15151A`,border:`1px solid rgba(255, 255, 255, 0.09)`,borderLeft:`3px solid ${w.color_hex}`,display:`flex`,flexDirection:`column`,gap:`7px`},children:[(0,$.jsx)(`div`,{className:`mono`,style:{fontSize:`12.5px`,fontWeight:600,color:`#F4F4F5`},children:t?`🏠 ${t.label}`:w.label??w.cable_id}),(0,$.jsx)(`div`,{style:{fontSize:`11px`,color:`#A1A1AA`},children:t?`${t.room_or_zone??`Gebäude`} · ${t.poe_draw_watts>0?`PoE ${t.poe_draw_watts}W`:`Standard LAN`} · ${t.required_speed.toUpperCase()}`:`${w.cable_id} (${w.cable_type})`}),t?(0,$.jsxs)(`div`,{style:{padding:`8px 10px`,borderRadius:`6px`,background:`#111115`,border:`1px solid rgba(255, 255, 255, 0.06)`,display:`flex`,flexDirection:`column`,gap:`5px`,fontSize:`11px`},children:[(0,$.jsxs)(`div`,{style:{color:`#D4D4D8`},children:[(0,$.jsx)(`strong`,{style:{color:`#A1A1AA`},children:`Schritt 1 (Hinten):`}),` `,`Hauskabel in`,` `,(0,$.jsxs)(`span`,{className:`mono`,style:{color:`#38BDF8`},children:[t.patch_panel_instance_id,`:`,t.patch_panel_port_id]})]}),(0,$.jsxs)(`div`,{style:{color:`#D4D4D8`},children:[(0,$.jsx)(`strong`,{style:{color:`#A1A1AA`},children:`Schritt 2 (Vorne):`}),` `,`Patchkabel in Switch`,` `,(0,$.jsxs)(`span`,{className:`mono`,style:{color:`#10B981`},children:[n.instance_id,`:`,n.port_id]})]})]}):(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`11px`,color:`#D4D4D8`},children:[w.from.instance_id,`:`,w.from.port_id,` →`,` `,w.to.instance_id,`:`,w.to.port_id]}),(0,$.jsxs)(`div`,{className:`mono`,style:{display:`flex`,justifyContent:`space-between`,paddingTop:`6px`,borderTop:`1px solid rgba(255, 255, 255, 0.06)`,fontSize:`11px`,color:`#A1A1AA`},children:[(0,$.jsxs)(`span`,{children:[`Spline: `,fl(T.required_length_mm),`mm`]}),(0,$.jsxs)(`span`,{style:{color:`#10B981`,fontWeight:600},children:[`SKU:`,` `,(T.recommended_commercial_mm/1e3).toFixed(2),`m`]})]}),u&&(0,$.jsxs)(`button`,{type:`button`,"data-testid":`btn-disconnect-cable`,onClick:()=>u(w.cable_id),style:{marginTop:`4px`,padding:`6px 10px`,borderRadius:`6px`,border:`1px solid rgba(239, 68, 68, 0.3)`,background:`rgba(239, 68, 68, 0.08)`,color:`#FCA5A5`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:[`Disconnect Cable (`,w.cable_id,`)`]})]})})():(0,$.jsx)(`div`,{style:{padding:`12px`,borderRadius:`8px`,background:`#15151A`,border:`1px solid rgba(255, 255, 255, 0.06)`,fontSize:`11.5px`,color:`#A1A1AA`},children:`Select any device, sub-module, or 3D cable spline in the viewport to inspect its dimensions, ports, and clearances.`}),e.project.external_endpoints.length>0&&(0,$.jsxs)(`div`,{"data-testid":`external-endpoints-guide`,style:{marginTop:`4px`,padding:`11px 12px`,borderRadius:`8px`,background:`#15151A`,border:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,gap:`7px`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,$.jsx)(`span`,{style:{fontSize:`11.5px`,fontWeight:600,color:`#F4F4F5`},children:`🏠 Haus- & Raum-Verkabelung (Steckplan)`}),(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`10px`,color:`#A1A1AA`},children:[e.project.external_endpoints.length,` Leitungen`]})]}),(0,$.jsx)(`div`,{style:{fontSize:`10.5px`,color:`#71717A`},children:`Klicke auf eine Leitung, um das zugehörige Kabel im 3D-Rack hervorzuheben:`}),(0,$.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`5px`},children:e.project.external_endpoints.map((t,n)=>{let r=e.project.cables.find(e=>e.from.instance_id===t.patch_panel_instance_id&&e.from.port_id===t.patch_panel_port_id&&e.from.face!==`rear`||e.to.instance_id===t.patch_panel_instance_id&&e.to.port_id===t.patch_panel_port_id&&e.to.face!==`rear`),i=r?r.from.instance_id===t.patch_panel_instance_id&&r.from.port_id===t.patch_panel_port_id?`${r.to.instance_id}:${r.to.port_id}`:`${r.from.instance_id}:${r.from.port_id}`:`Offen`,o=r!==void 0&&a===r.cable_id;return(0,$.jsxs)(`div`,{onClick:()=>{r&&s(r.cable_id)},style:{minWidth:0,overflow:`hidden`,padding:`7px 9px`,borderRadius:`6px`,background:o?`#1E1E28`:`#111115`,border:o?`1px solid rgba(59, 130, 246, 0.45)`:`1px solid rgba(255, 255, 255, 0.05)`,borderLeft:`2.5px solid ${t.color_hex}`,cursor:r?`pointer`:`default`,display:`flex`,flexDirection:`column`,gap:`3px`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`6px`,minWidth:0},children:[(0,$.jsxs)(`span`,{style:{minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`,fontSize:`11px`,fontWeight:600,color:`#F4F4F5`},children:[`#`,String(n+1).padStart(2,`0`),` · `,t.label]}),(0,$.jsx)(`span`,{className:`mono`,style:{flexShrink:0,fontSize:`9.5px`,padding:`1px 5px`,borderRadius:`4px`,background:t.category===`isp-wan-uplink`?`rgba(236, 72, 153, 0.14)`:t.poe_draw_watts>0?`rgba(245, 158, 11, 0.14)`:`rgba(16, 185, 129, 0.12)`,color:t.category===`isp-wan-uplink`?`#F472B6`:t.poe_draw_watts>0?`#FBBF24`:`#34D399`},children:t.category===`isp-wan-uplink`?`ISP WAN`:t.poe_draw_watts>0?`PoE ${t.poe_draw_watts}W`:`LAN`})]}),(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`10px`,color:`#A1A1AA`,minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:[`1. Hinten:`,` `,(0,$.jsxs)(`span`,{style:{color:`#38BDF8`},children:[t.patch_panel_instance_id,`:`,t.patch_panel_port_id]}),` `,`→ 2. Vorne:`,` `,(0,$.jsx)(`span`,{style:{color:`#10B981`},children:i})]})]},t.endpoint_id)})})]})]}),D&&(0,$.jsxs)(`section`,{"data-testid":`validation-console`,style:{padding:`14px 16px`,borderBottom:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,$.jsx)(`span`,{style:{fontSize:`12px`,fontWeight:600,color:`#E4E4E7`},children:`5-Stage Validation Checks`}),(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`10.5px`,fontWeight:600,color:e.validation.is_valid?`#10B981`:`#EF4444`},children:[e.validation.error_count,` Errors ·`,` `,e.validation.warning_count,` Warnings`]})]}),e.validation.issues.length===0?(0,$.jsx)(`div`,{style:{padding:`10px 12px`,borderRadius:`7px`,background:`#15151A`,border:`1px solid rgba(255, 255, 255, 0.07)`,borderLeft:`3px solid #10B981`,fontSize:`11.5px`,color:`#D4D4D8`,lineHeight:1.45},children:`All spatial AABB clearances, sub-module slots, PoE budgets, and 3D spline cable routes passed validation with 0 collisions.`}):(0,$.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:e.validation.issues.map((e,t)=>(0,$.jsxs)(`div`,{"data-testid":`diagnostic-issue-${e.code}`,onClick:()=>{let t=e.affected_instances[0];t&&o(t)},style:{padding:`10px 12px`,borderRadius:`7px`,background:`#15151A`,border:`1px solid rgba(255, 255, 255, 0.08)`,borderLeft:e.severity===`ERROR`?`3px solid #EF4444`:`3px solid #F59E0B`,cursor:`pointer`},children:[(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`10.5px`,fontWeight:600,color:e.severity===`ERROR`?`#FCA5A5`:`#FDE68A`},children:[e.severity,` · `,e.code]}),(0,$.jsx)(`div`,{style:{fontSize:`11.5px`,color:`#E4E4E7`,marginTop:`4px`,lineHeight:1.4},children:e.message}),e.remediation_suggestions.length>0&&(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`10px`,color:`#93C5FD`,marginTop:`6px`,paddingTop:`6px`,borderTop:`1px solid rgba(255, 255, 255, 0.06)`},children:[`Remediation: `,e.remediation_suggestions[0]]})]},`${e.code}-${t}`))})]}),O&&(0,$.jsxs)(`section`,{"data-testid":`mcp-agent-feed`,style:{padding:`14px 16px`,display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,fontSize:`12px`,fontWeight:600,color:`#E4E4E7`},children:[(0,$.jsx)(Vh,{size:13,style:{color:`#3B82F6`}}),(0,$.jsx)(`span`,{children:`MCP AGENT TOOL-CALL FEED`})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,$.jsxs)(`span`,{className:`mono`,style:{color:`#71717A`,fontSize:`10.5px`},children:[r.length,` Calls`]}),t===`sidecar-live`&&r.length>0&&f&&(0,$.jsx)(`button`,{type:`button`,"data-testid":`btn-clear-mcp-log`,onClick:f,style:{padding:`2px 6px`,borderRadius:`4px`,border:`1px solid rgba(255, 255, 255, 0.08)`,background:`#16161B`,color:`#A1A1AA`,fontSize:`9.5px`,cursor:`pointer`},children:`Clear`})]})]}),t===`sidecar-live`&&n&&(0,$.jsxs)(`div`,{className:`mono`,style:{padding:`6px 9px`,borderRadius:`6px`,background:`#141418`,border:`1px solid rgba(255, 255, 255, 0.06)`,fontSize:`10px`,color:`#93C5FD`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},title:n,children:[`Bound File: `,n]}),t===`standalone-demo`&&p&&(0,$.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(2, minmax(0, 1fr))`,gap:`6px`},children:[(0,$.jsxs)(`button`,{type:`button`,"data-testid":`agent-sim-step-collision`,onClick:()=>p(`collision`),style:{display:`inline-flex`,alignItems:`center`,justifyContent:`center`,gap:`5px`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(245, 158, 11, 0.3)`,background:`rgba(245, 158, 11, 0.08)`,color:`#FDE68A`,fontSize:`10.5px`,fontWeight:600,cursor:`pointer`},children:[(0,$.jsx)(Ph,{size:11}),(0,$.jsx)(`span`,{children:`1. Trigger Collision`})]}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`agent-sim-step-resolved`,onClick:()=>p(`resolved`),style:{display:`inline-flex`,alignItems:`center`,justifyContent:`center`,gap:`5px`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(16, 185, 129, 0.3)`,background:`rgba(16, 185, 129, 0.08)`,color:`#A7F3D0`,fontSize:`10.5px`,fontWeight:600,cursor:`pointer`},children:(0,$.jsx)(`span`,{children:`2. LLM Self-Correction`})})]}),(0,$.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:r.length===0?(0,$.jsxs)(`div`,{"data-testid":`mcp-agent-empty-feed`,style:{padding:`12px`,borderRadius:`7px`,background:`#141418`,border:`1px solid rgba(255, 255, 255, 0.07)`,borderLeft:`2.5px solid #3B82F6`,fontSize:`11px`,color:`#A1A1AA`,lineHeight:1.45},children:[(0,$.jsx)(`div`,{style:{color:`#E4E4E7`,fontWeight:600,marginBottom:`4px`},children:"Ready for External MCP Agent (`rack_architect_mcp`)"}),`Connect your LLM agent via stdio or WebSocket to inspect live`,` `,(0,$.jsx)(`span`,{className:`mono`,children:`init_rack`}),`,`,` `,(0,$.jsx)(`span`,{className:`mono`,children:`mount_equipment`}),`,`,` `,(0,$.jsx)(`span`,{className:`mono`,children:`connect_cables`}),`, and`,` `,(0,$.jsx)(`span`,{className:`mono`,children:`validate_rack`}),` tool calls in real time.`]}):r.map(e=>{let t=e.timestamp.includes(`T`)?e.timestamp.slice(11,19):e.timestamp;return(0,$.jsxs)(`div`,{"data-testid":`mcp-tool-call-${e.tool}`,style:{padding:`9px 11px`,borderRadius:`7px`,background:`#15151A`,border:`1px solid rgba(255, 255, 255, 0.07)`,borderLeft:e.status===`VALID`?`2.5px solid #10B981`:`2.5px solid #EF4444`,display:`flex`,flexDirection:`column`,gap:`4px`},children:[(0,$.jsxs)(`div`,{className:`mono`,style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,fontSize:`10.5px`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,$.jsxs)(`span`,{style:{fontWeight:600,color:`#F4F4F5`},children:[e.tool,`()`]}),(0,$.jsx)(`span`,{style:{fontSize:`9.5px`,color:`#71717A`},children:t})]}),(0,$.jsx)(`span`,{style:{fontSize:`9.5px`,fontWeight:600,color:e.status===`VALID`?`#10B981`:`#EF4444`},children:e.status})]}),(0,$.jsx)(`div`,{style:{fontSize:`11px`,color:`#A1A1AA`,lineHeight:1.4},children:e.summary})]},e.id)})})]})]})}var $h=[{value:`cat6a`,label:`Cat6A (10G / 2.5G RJ45)`},{value:`cat6`,label:`Cat6 (1G / 2.5G RJ45)`},{value:`cat5e`,label:`Cat5e (1G Legacy — Speed Bottleneck Test)`},{value:`sfp-plus-dac`,label:`10G SFP+ DAC Twinax`},{value:`power-c13-c14`,label:`IEC C13 -> C14 Mains Cord`},{value:`power-schuko-c13`,label:`Schuko CEE7 -> IEC C13`},{value:`power-dc-5525`,label:`DC 5.5x2.5mm Power Lead`},{value:`power-usb-c`,label:`USB-C PD Power Cable`}];function eg({open:e,catalog:t,scene:n,onClose:r,onMountEquipment:i,onConnectCable:a}){let[o,s]=(0,d.useState)(``),[c,l]=(0,d.useState)(`all`),[u,f]=(0,d.useState)(6),[p,m]=(0,d.useState)(`front`),h=n.geometry.devices[0],g=n.geometry.devices[1]??h,[_,v]=(0,d.useState)(()=>h&&h.ports[0]?`${h.instance_id}::${h.ports[0].port_id}`:``),[y,b]=(0,d.useState)(()=>g&&g.ports[0]?`${g.instance_id}::${g.ports[0].port_id}`:``),[x,S]=(0,d.useState)(`cat6a`),[C,w]=(0,d.useState)(``),[T,E]=(0,d.useState)(``);if(!e)return null;let D=n.project.rack.u_height,O=t.filter(e=>{if(c!==`all`&&e.category!==c)return!1;if(!o.trim())return!0;let t=o.toLowerCase();return e.slug.toLowerCase().includes(t)||e.manufacturer.toLowerCase().includes(t)||e.model.toLowerCase().includes(t)||e.category.toLowerCase().includes(t)}),k=n.geometry.devices.flatMap(e=>e.ports.map(t=>({key:`${e.instance_id}::${t.port_id}`,label:`U${e.u_position} ${e.instance_id}:${t.port_id} (${t.connector_type} • ${t.world_face})`})));return(0,$.jsxs)(`aside`,{"data-testid":`catalog-builder-drawer`,style:{width:`360px`,height:`100%`,background:`#121216`,borderRight:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,overflowY:`auto`,flexShrink:0},children:[(0,$.jsxs)(`div`,{style:{padding:`12px 16px`,borderBottom:`1px solid rgba(255, 255, 255, 0.07)`,background:`#0e0e11`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,$.jsx)(`div`,{style:{fontSize:`11.5px`,fontWeight:600,letterSpacing:`0.04em`,textTransform:`uppercase`,color:`#F4F4F5`},children:`Hardware Catalog & Patcher`}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`btn-close-catalog-drawer`,onClick:r,style:{padding:`4px 8px`,borderRadius:`5px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#A1A1AA`,fontSize:`11px`,cursor:`pointer`},children:`Close ✕`})]}),(0,$.jsxs)(`section`,{"data-testid":`interactive-cable-patcher`,style:{padding:`14px 16px`,borderBottom:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,gap:`8px`,background:`#0e0e11`},children:[(0,$.jsx)(`div`,{style:{fontSize:`10.5px`,fontWeight:600,letterSpacing:`0.05em`,textTransform:`uppercase`,color:`#A1A1AA`},children:`Point-to-Point 3D Cable Patcher`}),(0,$.jsxs)(`label`,{style:{fontSize:`11px`,color:`#A1A1AA`},children:[`From Port`,(0,$.jsx)(`select`,{"data-testid":`select-cable-from`,value:_,onChange:e=>v(e.target.value),style:{width:`100%`,marginTop:`4px`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#F4F4F5`,fontSize:`11px`},children:k.map(e=>(0,$.jsx)(`option`,{value:e.key,children:e.label},`from-${e.key}`))})]}),(0,$.jsxs)(`label`,{style:{fontSize:`11px`,color:`#A1A1AA`},children:[`To Port`,(0,$.jsx)(`select`,{"data-testid":`select-cable-to`,value:y,onChange:e=>b(e.target.value),style:{width:`100%`,marginTop:`4px`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#F4F4F5`,fontSize:`11px`},children:k.map(e=>(0,$.jsx)(`option`,{value:e.key,children:e.label},`to-${e.key}`))})]}),(0,$.jsxs)(`label`,{style:{fontSize:`11px`,color:`#A1A1AA`},children:[`Cable Assembly Type`,(0,$.jsx)(`select`,{"data-testid":`select-cable-type`,value:x,onChange:e=>S(e.target.value),style:{width:`100%`,marginTop:`4px`,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#F4F4F5`,fontSize:`11px`},children:$h.map(e=>(0,$.jsx)(`option`,{value:e.value,children:e.label},e.value))})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,$.jsx)(`input`,{type:`number`,min:1,max:4094,placeholder:`VLAN ID (e.g. 20)`,"data-testid":`input-cable-vlan`,value:C,onChange:e=>w(e.target.value),style:{flex:1,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#F4F4F5`,fontSize:`11px`}}),(0,$.jsx)(`input`,{type:`text`,placeholder:`IP CIDR (10.20.0.0/24)`,"data-testid":`input-cable-cidr`,value:T,onChange:e=>E(e.target.value),style:{flex:1,padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#F4F4F5`,fontSize:`11px`}})]}),(0,$.jsx)(`button`,{type:`button`,"data-testid":`btn-add-cable`,onClick:()=>{let[e,t]=_.split(`::`),[n,r]=y.split(`::`);if(!e||!t||!n||!r)return;let i=Number(C),o=C.trim().length>0&&!Number.isNaN(i)&&i>=1&&i<=4094?Math.round(i):void 0;a(e,t,n,r,x,o,T)},style:{padding:`7px 12px`,borderRadius:`6px`,border:`1px solid rgba(16, 185, 129, 0.35)`,background:`rgba(16, 185, 129, 0.12)`,color:`#6EE7B7`,fontSize:`11.5px`,fontWeight:600,cursor:`pointer`},children:`+ Route 3D Spline Cable`})]}),(0,$.jsxs)(`section`,{style:{padding:`14px 16px`,display:`flex`,flexDirection:`column`,gap:`10px`,flex:1},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,$.jsx)(`span`,{style:{fontSize:`10.5px`,fontWeight:600,letterSpacing:`0.05em`,textTransform:`uppercase`,color:`#A1A1AA`},children:`Hardware Catalog`}),(0,$.jsxs)(`span`,{className:`mono`,style:{fontSize:`10.5px`,color:`#71717A`},children:[O.length,` blueprints`]})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`,padding:`8px 10px`,borderRadius:`6px`,background:`#18181d`,border:`1px solid rgba(255, 255, 255, 0.07)`},children:[(0,$.jsxs)(`label`,{style:{fontSize:`11px`,color:`#A1A1AA`,flex:1},children:[`Target U:`,(0,$.jsx)(`select`,{"data-testid":`select-mount-u`,value:u,onChange:e=>f(Number(e.target.value)),style:{marginLeft:`6px`,padding:`3px 6px`,borderRadius:`5px`,background:`#0e0e11`,color:`#F4F4F5`,border:`1px solid rgba(255, 255, 255, 0.09)`,fontSize:`11px`},children:Array.from({length:D},(e,t)=>t+1).map(e=>(0,$.jsxs)(`option`,{value:e,children:[`U`,e]},e))})]}),(0,$.jsxs)(`label`,{style:{fontSize:`11px`,color:`#A1A1AA`,flex:1},children:[`Face:`,(0,$.jsxs)(`select`,{"data-testid":`select-mount-face`,value:p,onChange:e=>m(e.target.value),style:{marginLeft:`6px`,padding:`3px 6px`,borderRadius:`5px`,background:`#0e0e11`,color:`#F4F4F5`,border:`1px solid rgba(255, 255, 255, 0.09)`,fontSize:`11px`},children:[(0,$.jsx)(`option`,{value:`front`,children:`FRONT`}),(0,$.jsx)(`option`,{value:`rear`,children:`REAR`})]})]})]}),(0,$.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,$.jsx)(`input`,{type:`search`,placeholder:`Search Ubiquiti, Lenovo, 10inch...`,"data-testid":`catalog-search-input`,value:o,onChange:e=>s(e.target.value),style:{flex:1,padding:`6px 9px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#F4F4F5`,fontSize:`11.5px`}}),(0,$.jsxs)(`select`,{"data-testid":`catalog-category-select`,value:c,onChange:e=>l(e.target.value),style:{padding:`6px 8px`,borderRadius:`6px`,border:`1px solid rgba(255, 255, 255, 0.09)`,background:`#18181d`,color:`#A1A1AA`,fontSize:`11px`},children:[(0,$.jsx)(`option`,{value:`all`,children:`All Categories`}),(0,$.jsx)(`option`,{value:`switch`,children:`Switches`}),(0,$.jsx)(`option`,{value:`router`,children:`Routers / Gateways`}),(0,$.jsx)(`option`,{value:`modular-carrier`,children:`3D-Print Carriers`}),(0,$.jsx)(`option`,{value:`compute-node`,children:`Compute / Mini-PC`}),(0,$.jsx)(`option`,{value:`patch-panel`,children:`Patch Panels`}),(0,$.jsx)(`option`,{value:`pdu`,children:`PDUs`}),(0,$.jsx)(`option`,{value:`ups`,children:`UPS Units`})]})]}),(0,$.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:O.map(e=>{let t=e.mount_type===`sub-module`;return(0,$.jsxs)(`div`,{"data-testid":`catalog-card-${e.slug}`,style:{padding:`10px 12px`,borderRadius:`8px`,background:`#18181d`,border:`1px solid rgba(255, 255, 255, 0.07)`,display:`flex`,flexDirection:`column`,gap:`5px`},children:[(0,$.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`6px`},children:[(0,$.jsxs)(`span`,{style:{fontSize:`12px`,fontWeight:600,color:`#F4F4F5`},children:[e.manufacturer,` `,e.model]}),(0,$.jsx)(`span`,{className:`mono`,style:{fontSize:`9.5px`,padding:`2px 6px`,borderRadius:`4px`,background:`rgba(255, 255, 255, 0.06)`,color:`#A1A1AA`,flexShrink:0},children:e.category})]}),(0,$.jsxs)(`div`,{className:`mono`,style:{fontSize:`10.5px`,color:`#71717A`},children:[e.geometry.width_mm,`×`,e.geometry.height_mm,`×`,e.geometry.depth_mm,`mm • `,e.ports.length,` Ports •`,` `,e.power_and_thermal.max_system_watts,`W`]}),e.description&&(0,$.jsx)(`div`,{style:{fontSize:`11px`,color:`#A1A1AA`,lineHeight:1.4},children:e.description}),!t&&(0,$.jsxs)(`button`,{type:`button`,"data-testid":`mount-blueprint-${e.slug}`,onClick:()=>i(e.slug,u,p),style:{marginTop:`3px`,padding:`6px 10px`,borderRadius:`6px`,border:`1px solid rgba(59, 130, 246, 0.35)`,background:`rgba(59, 130, 246, 0.12)`,color:`#93C5FD`,fontSize:`11px`,fontWeight:600,cursor:`pointer`},children:[`+ Mount on U`,u,` (`,p.toUpperCase(),`)`]})]},e.slug)})})]})]})}function tg(){let e=_h();return(0,$.jsxs)(`div`,{"data-testid":`app-dashboard`,style:{width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,background:`#09090b`,color:`#F4F4F5`,overflow:`hidden`},children:[(0,$.jsx)(Wh,{scene:e.scene,connectionMode:e.connectionMode,projectPath:e.projectPath,activePresetId:e.activePresetId,activeTab:e.activeTab,catalogDrawerOpen:e.catalogDrawerOpen,undoAvailable:e.undoAvailable,redoAvailable:e.redoAvailable,onSelectTab:e.setActiveTab,onToggleCatalogDrawer:()=>e.setCatalogDrawerOpen(!e.catalogDrawerOpen),onSelectPreset:e.selectPreset,onShareRackUrl:e.buildShareableRackUrl,onImportProjectJson:e.importProjectJson,onInitNewRack:e.initNewRack,onExportDeliverablesToDisk:e.exportDeliverablesToDisk,onUndo:e.undo,onRedo:e.redo,onResetDemo:e.resetDemoScene,onSimulateAgentStep:e.simulateAgentStep}),(0,$.jsxs)(`div`,{style:{flex:1,display:`flex`,minHeight:0,overflow:`hidden`},children:[(0,$.jsx)(eg,{open:e.catalogDrawerOpen,catalog:e.catalog,scene:e.scene,onClose:()=>e.setCatalogDrawerOpen(!1),onMountEquipment:e.mountEquipmentFromCatalog,onConnectCable:e.connectInteractiveCable}),(0,$.jsxs)(`main`,{style:{flex:1,position:`relative`,minWidth:0,height:`100%`,overflow:`hidden`},children:[e.activeTab===`3d`&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(qh,{xrayMode:e.xrayMode,explodeZMm:e.explodeZMm,cableFilter:e.cableFilter,cameraPreset:e.cameraPreset,showClearanceBoxes:e.showClearanceBoxes,doorOpen:e.doorOpen,onToggleXray:e.setXrayMode,onChangeExplodeZ:e.setExplodeZMm,onSelectCableFilter:e.setCableFilter,onSelectCameraPreset:e.setCameraPreset,onToggleClearanceBoxes:e.setShowClearanceBoxes,onToggleDoorOpen:e.setDoorOpen}),(0,$.jsx)(Oh,{scene:e.scene,xrayMode:e.xrayMode,explodeZMm:e.explodeZMm,cableFilter:e.cableFilter,cameraPreset:e.cameraPreset,showClearanceBoxes:e.showClearanceBoxes,doorOpen:e.doorOpen,selectedDeviceId:e.selectedDeviceId,selectedCableId:e.selectedCableId,hoveredPort:e.hoveredPort,pendingPort:e.pendingPort,onSelectDevice:e.selectDevice,onSelectCable:e.selectCable,onHoverPort:e.setHoveredPort,onClickPort:e.handlePortClick3D,onCancelPendingPort:()=>e.setPendingPort(null)})]}),e.activeTab===`elevation`&&(0,$.jsx)(Jh,{title:`Synchronized 2D Front/Rear Elevation & Z-Y Depth Cutaway`,filename:`elevation.svg`,svgMarkup:e.elevationSvg}),e.activeTab===`wiring`&&(0,$.jsx)(Jh,{title:`Hierarchical Power/PoE DAG & Multi-Track Wiring Schematic`,filename:`wiring-schematic.svg`,svgMarkup:e.wiringSvg}),e.activeTab===`bom`&&(0,$.jsx)(Zh,{scene:e.scene,elevationSvg:e.elevationSvg,wiringSvg:e.wiringSvg,bomMarkdown:e.bomMarkdown})]}),(0,$.jsx)(Qh,{scene:e.scene,connectionMode:e.connectionMode,projectPath:e.projectPath,mcpToolLog:e.mcpToolLog,selectedDeviceId:e.selectedDeviceId,selectedCableId:e.selectedCableId,onSelectDevice:e.selectDevice,onSelectCable:e.selectCable,onMoveDeviceU:e.moveDeviceU,onRemoveDevice:e.removeEquipment,onDisconnectCable:e.disconnectCable,onClearToolLog:e.clearMcpToolLog,onSimulateAgentStep:e.simulateAgentStep})]})]})}var ng=document.getElementById(`root`);ng&&(0,f.createRoot)(ng).render((0,$.jsx)(d.StrictMode,{children:(0,$.jsx)(tg,{})}));
//# sourceMappingURL=index-Dtm-1LZ2.js.map