var e=44.45,t=[6.35,22.225,38.1],n={"19inch":{standard:`19inch`,panel_width_mm:482.6,aperture_width_mm:450.85,hole_center_to_center_mm:465.1,left_aperture_offset_mm:15.875,left_hole_center_x_mm:8.75,W_panel:482.6,W_aperture:450.85,W_holes:465.1,X_aperture_min:15.875,X_hole_left:8.75},"10inch":{standard:`10inch`,panel_width_mm:254,aperture_width_mm:222.25,hole_center_to_center_mm:236.5,left_aperture_offset_mm:15.875,left_hole_center_x_mm:8.75,W_panel:254,W_aperture:222.25,W_holes:236.5,X_aperture_min:15.875,X_hole_left:8.75},"6inch":{standard:`6inch`,panel_width_mm:152.4,aperture_width_mm:120.65,hole_center_to_center_mm:134.9,left_aperture_offset_mm:15.875,left_hole_center_x_mm:8.75,W_panel:152.4,W_aperture:120.65,W_holes:134.9,X_aperture_min:15.875,X_hole_left:8.75}},r={rj45:{straight_mm:35,angled_mm:20},"rj45-serial-console":{straight_mm:35,angled_mm:20},"sfp-plus":{straight_mm:48,angled_mm:null},"iec-c13":{straight_mm:55,angled_mm:30},"iec-c14":{straight_mm:55,angled_mm:30},"schuko-cee7":{straight_mm:65,angled_mm:38},"dc-5525":{straight_mm:32,angled_mm:18},"usb-c":{straight_mm:32,angled_mm:18},"usb-a":{straight_mm:32,angled_mm:18},"audio-35mm":{straight_mm:28,angled_mm:15}};function i(e){return e.toLowerCase().includes(`angled`)}function a(e,t){let n=r[e];return t&&i(t)&&n.angled_mm!==null?n.angled_mm:n.straight_mm}var o={af:15.4,at:30,"bt-type3":60,"bt-type4":90},s=[150,250,300,500,750,1e3,1500,2e3,3e3],c=1.12,l=6.5;function u(e){let t=Object.values(e).filter(e=>typeof e==`number`);return Object.entries(e).filter(([e,n])=>t.indexOf(+e)===-1).map(([e,t])=>t)}function d(e,t=`|`){return e.map(e=>ae(e)).join(t)}function f(e,t){return typeof t==`bigint`?t.toString():t}var p=class{constructor(e){this._getter=e,this._value=void 0}get value(){let e=this._getter;return e!==void 0&&(this._value=e(),this._getter=void 0),this._value}};function m(e){return new p(e)}function h(e){return e==null}function g(e){let t=+!!e.startsWith(`^`),n=e.endsWith(`$`)?e.length-1:e.length;return e.slice(t,n)}function _(e,t){let n=e/t,r=Math.round(n),i=4*2**-52*Math.max(Math.abs(n),1);return Math.abs(n-r)<i?0:n-r}function v(e,t,n){Object.defineProperty(e,t,{value:n,writable:!0,enumerable:!0,configurable:!0})}function y(e){let t=Object.getOwnPropertyDescriptor(e,`shape`);return t?.get?t.get.raw:t?.value}function b(e){return y(e._zod.def)??e._zod.def.shape}function x(e,t,n){Object.defineProperty(e,t,{get(){let e=n();return v(this,t,e),e},enumerable:!0,configurable:!0})}function S(e,t,n){t in e?v(e,t,n):e[t]=n}function C(e,t,n,r){let i=b(t);for(let a of n){let n=Object.getOwnPropertyDescriptor(i,a);n.enumerable&&(n.get?x(e,a,()=>{let e=t._zod.def.shape[a];return r?r(e,a):e}):S(e,a,r?r(n.value,a):n.value))}}function w(e,t){for(let n of Reflect.ownKeys(t)){let r=Object.getOwnPropertyDescriptor(t,n);r.enumerable&&(r.get?x(e,n,()=>t[n]):S(e,n,r.value))}}function T(...e){let t={};for(let n of e){let e=Object.getOwnPropertyDescriptors(n);Object.assign(t,e)}return Object.defineProperties({},t)}function ee(e){return JSON.stringify(e)}function te(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,``).replace(/[\s_-]+/g,`-`).replace(/^-+|-+$/g,``)}var ne=`captureStackTrace`in Error?Error.captureStackTrace:(...e)=>{};function E(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}var D=m(()=>{if(qe.jitless||typeof navigator<`u`&&navigator?.userAgent?.includes(`Cloudflare`))return!1;try{return Function(``),!0}catch{return!1}});function O(e){if(E(e)===!1)return!1;let t=e.constructor;if(t===void 0||typeof t!=`function`)return!0;let n=t.prototype;return E(n)!==!1&&Object.prototype.hasOwnProperty.call(n,`isPrototypeOf`)!==!1}function re(e){return O(e)?{...e}:Array.isArray(e)?[...e]:e instanceof Map?new Map(e):e instanceof Set?new Set(e):e}var ie=new Set([`string`,`number`,`symbol`]);function k(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function A(e,t,n){let r=new e._zod.constr(t??e._zod.def);return(!t||n?.parent)&&(r._zod.parent=e),r}function j(e){let t=e;if(!t)return{};if(typeof t==`string`)return{error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw Error("Cannot specify both `message` and `error` params");t.error=t.message}return delete t.message,typeof t.error==`string`?{...t,error:()=>t.error}:t}function ae(e){return typeof e==`bigint`?e.toString()+`n`:typeof e==`string`?`"${e}"`:`${e}`}function oe(e){return Object.keys(e).filter(t=>e[t]._zod.optin!==void 0&&e[t]._zod.optout===`optional`)}var M={safeint:[-(2**53-1),2**53-1],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]},se={int64:[BigInt(`-9223372036854775808`),BigInt(`9223372036854775807`)],uint64:[BigInt(0),BigInt(`18446744073709551615`)]};function ce(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.pick() cannot be used on object schemas containing refinements`);let i={};return C(i,e,le(e,t)),A(e,T(n,{shape:i,checks:[]}))}function le(e,t){let n=b(e),r=[];for(let e of Reflect.ownKeys(t)){if(!Object.getOwnPropertyDescriptor(n,e)?.enumerable)throw Error(`Unrecognized key: "${String(e)}"`);t[e]&&r.push(e)}return r}function ue(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.omit() cannot be used on object schemas containing refinements`);let i=new Set(le(e,t)),a={};return C(a,e,Reflect.ownKeys(b(e)).filter(e=>!i.has(e))),A(e,T(n,{shape:a,checks:[]}))}function de(e,t){if(!O(t))throw Error(`Invalid input to extend: expected a plain object`);let n=e._zod.def.checks;if(n&&n.length>0){let n=b(e);for(let e of Reflect.ownKeys(t))if(Object.getOwnPropertyDescriptor(n,e)!==void 0)throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}return A(e,T(e._zod.def,{shape:fe(e,t)}))}function fe(e,t){let n={};return C(n,e,Reflect.ownKeys(b(e))),w(n,t),n}function pe(e,t){if(!O(t))throw Error(`Invalid input to safeExtend: expected a plain object`);return A(e,T(e._zod.def,{shape:fe(e,t)}))}function me(e,t){if(!t?._zod?.def)throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");if(e._zod.def.checks?.length)throw Error(`.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.`);let n={};return C(n,e,Reflect.ownKeys(b(e))),C(n,t,Reflect.ownKeys(b(t))),A(e,T(e._zod.def,{shape:n,get catchall(){return t._zod.def.catchall},checks:t._zod.def.checks??[]}))}function he(e,t,n,r=`partial`){let i=t._zod.def.checks;if(i&&i.length>0)throw Error(`.${r}() cannot be used on object schemas containing refinements`);let a=n?new Set(le(t,n)):void 0,o={};return C(o,t,Reflect.ownKeys(b(t)),e&&((t,n)=>a&&!a.has(n)?t:new e({type:`optional`,innerType:t}))),A(t,T(t._zod.def,{shape:o,checks:[]}))}function ge(e,t,n){let r=n?new Set(le(t,n)):void 0,i={};return C(i,t,Reflect.ownKeys(b(t)),(t,n)=>r&&!r.has(n)?t:new e({type:`nonoptional`,innerType:t})),A(t,T(t._zod.def,{shape:i}))}function _e(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue!==!0)return!0;return!1}function ve(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue===!1)return!0;return!1}function ye(e,t){return t.map(t=>{var n;return(n=t).path??(n.path=[]),t.path.unshift(e),t})}function be(e){return typeof e==`string`?e:e?.message}function xe(e){let t=[];for(let n of e??[]){let e=n._zod.def;if(!/_(length|size)$|_equals$/.test(e.check))break;let r=e.maximum??e.length??e.size;r>=0&&t.push([r,n])}return t}function Se(e,t,n){var r;for(let i=t;i<e.length;i++)(r=e[i]).schema??(r.schema=n)}function Ce(e,t,n){var r;let i=e.inst?._zod?.traits;i?.has(`$ZodType`)&&(i.has(`$ZodCheck`)?(r=e).schema??(r.schema=e.inst):e.schema=e.inst);let a=e.schema===e.inst?void 0:e.schema?._zod.def?.error,o=e.message?e.message:be(e.inst?._zod.def?.error?.(e))??be(a?.(e))??be(t?.error?.(e))??be(n.customError?.(e))??be(n.localeError?.(e))??`Invalid input`,s={};for(let t of Object.keys(e))t!==`inst`&&t!==`schema`&&t!==`continue`&&t!==`input`&&t!==`__proto__`&&(s[t]=e[t]);return s.path??=[],s.message=o,t?.reportInput&&(s.input=e.input),s}var we=/[\uD800-\uDBFF]/;function Te(e){let t=e.length;if(!we.test(e))return t;let n=t;for(let r=0;r<t-1;r++)(e.charCodeAt(r)&64512)==55296&&(e.charCodeAt(r+1)&64512)==56320&&(n--,r++);return n}function Ee(e){return Array.isArray(e)?`array`:typeof e==`string`?`string`:`unknown`}function De(e){let t=typeof e;switch(t){case`number`:return Number.isNaN(e)?`nan`:`number`;case`object`:{if(e===null)return`null`;if(Array.isArray(e))return`array`;let t=e;if(t&&Object.getPrototypeOf(t)!==Object.prototype&&`constructor`in t&&t.constructor)return t.constructor.name}}return t}function Oe(...e){let[t,n,r]=e;return typeof t==`string`?{message:t,code:`custom`,input:n,inst:r}:{...t}}function ke(e,t){for(let n in t){let r=Object.getOwnPropertyDescriptor(t,n);r.get?Object.defineProperty(e,n,{...r,enumerable:!1}):Ne(e,n,r.value)}}function Ae(e,t,n,r=!0){return Object.defineProperty(e,t,{configurable:!0,writable:!0,enumerable:r,value:n}),n}function je(e,t,n){return Ae(e,t,n,!1)}function Me(e,t){for(let n in e){let r=e[n];Object.defineProperty(t,n,{configurable:!0,enumerable:!0,get(){return Ae(this,n,r(this))},set(e){Ae(this,n,e)}})}return t}function Ne(e,t,n){Object.defineProperty(e,t,{configurable:!0,get(){return this==null?n:Ae(this,t,n.bind(this))},set(e){Ae(this,t,e)}})}function Pe(e,t){let n=Object.getPrototypeOf(e);return t in n?void 0:n}var Fe,Ie=!1,Le={configurable:!0,get(){Ie=!0}};function N(e,t,n){let r=Object.getPrototypeOf(e._zod);t in r&&Fe!==e._zod?Fe=void 0:(Fe=e._zod,Object.defineProperty(r,t,{configurable:!0,get(){Object.defineProperty(this,t,Le);let e=Ie;Ie=!1;try{let r=n(this);return Ie?delete this[t]:Object.defineProperty(this,t,{configurable:!0,writable:!0,value:r}),Ie||=e,r}catch(n){throw delete this[t],Ie||=e,n}},set(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:e})}}))}function Re(e,t,n,r){let i=Pe(e,t);i&&Object.defineProperty(i,t,{configurable:!0,get(){let e={configurable:!0,writable:!0,enumerable:r,value:void 0};return Object.defineProperty(this,t,e),e.value=n(this),Object.defineProperty(this,t,e),e.value},set(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,enumerable:r,value:e})}})}var ze=`~constantCatch`;function Be(e){let t=()=>e;return t[ze]=!0,t}var Ve,He={value:void 0,enumerable:!1},Ue=`captureStackTrace`in Error?Error:null;function We(e){let t=Ue;if(t){let n=t.stackTraceLimit;if(typeof n==`number`){try{t.stackTraceLimit=0}catch{return Ue=null,new e}try{return new e}finally{t.stackTraceLimit=n}}}return new e}function P(e,t,n,r){let i={};function a(e){this.def=e,this.constr=d,this.traits=new Set}a.prototype=i;let o=n,s=o&&new WeakSet;function c(n,r){if(!n._zod){He.value=new a(r);try{Object.defineProperty(n,"_zod",He)}finally{He.value=void 0}}else if(n._zod.traits.has(e))return;if(n._zod.traits.add(e),t(n,r),s){let e=Object.getPrototypeOf(n),t=n._zod.constr.prototype,r=e;for(;r&&r!==t;)r=Object.getPrototypeOf(r);let i=r??e;s.has(i)||(s.add(i),ke(i,o))}let i=d.prototype;for(let e in i)Object.prototype.hasOwnProperty.call(i,e)&&(e in n||(n[e]=i[e].bind(n)))}let l=r?.Parent??Object;class u extends l{}Object.defineProperty(u,"name",{value:e});function d(e){let t=r?.Parent?We(u):this;c(t,e);let n=t._zod.deferred;if(n){for(let e of n)e();t._zod.deferred=void 0}let i=globalThis.__zod_globalConfig?.postProcessor;return i&&i(t),t}return Object.defineProperty(d,"init",{value:c}),Object.defineProperty(d,Symbol.hasInstance,{value:t=>r?.Parent&&t instanceof r.Parent?!0:t?._zod?.traits?.has(e)}),Object.defineProperty(d,"name",{value:e}),d}var Ge=class extends Error{constructor(){super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`)}},Ke=class extends Error{constructor(e){super(`Encountered unidirectional transform during encode: ${e}`),this.name=`ZodEncodeError`}};(Ve=globalThis).__zod_globalConfig??(Ve.__zod_globalConfig={});var qe=globalThis.__zod_globalConfig;function Je(e){return e&&Object.assign(qe,e),qe}function Ye(){let e=this._zod;return e.message??=JSON.stringify(e.def,f,2),e.message}function Xe(e){this._zod.message=e}var Ze={get:Ye,set:Xe,enumerable:!0,configurable:!0},Qe={value:void 0,enumerable:!1},$e=new WeakSet([Object.prototype,Error.prototype]),et=P(`$ZodError`,(e,t)=>{e.name=`$ZodError`,Qe.value=t,Object.defineProperty(e,"issues",Qe),Qe.value=void 0,Object.defineProperty(e,"message",Ze);let n=Object.getPrototypeOf(e);$e.has(n)||($e.add(n),Object.defineProperty(n,"toString",{configurable:!0,enumerable:!1,get(){let e=()=>this.message;return Object.defineProperty(this,"toString",{value:e,configurable:!0,writable:!0}),e},set(e){Object.defineProperty(this,"toString",{value:e,configurable:!0,writable:!0})}}))});function tt(e,t,n){return Object.prototype.hasOwnProperty.call(e,t)||(t===`__proto__`?Object.defineProperty(e,t,{value:n(),writable:!0,enumerable:!0,configurable:!0}):e[t]=n()),e[t]}function nt(e,t=e=>e.message){let n={},r=[];for(let i of e.issues)i.path.length>0?tt(n,i.path[0],()=>[]).push(t(i)):r.push(t(i));return{formErrors:r,fieldErrors:n}}function rt(e,t=e=>e.message){let n={_errors:[]},r=(e,i=[])=>{for(let a of e.issues)if(a.code===`invalid_union`&&a.errors.length)a.errors.map(e=>r({issues:e},[...i,...a.path]));else if(a.code===`invalid_key`)r({issues:a.issues},[...i,...a.path]);else if(a.code===`invalid_element`)r({issues:a.issues},[...i,...a.path]);else{let e=[...i,...a.path];if(e.length===0)n._errors.push(t(a));else{let r=n,i=0;for(;i<e.length;){let n=e[i],o=i===e.length-1;if(n===`_errors`){o&&r._errors.push(t(a)),i++;continue}Object.prototype.hasOwnProperty.call(r,n)||Object.defineProperty(r,n,{value:{_errors:[]},enumerable:!0,writable:!0,configurable:!0});let s=r[n];o&&s._errors.push(t(a)),r=s,i++}}}};return r(e),n}function it(e,t){return{callee:t?.callee??e,Err:t?.Err}}var at=e=>{let t=(n,r,i,a)=>{let o=i?{...i,async:!1}:{async:!1},s=n._zod.run({value:r,issues:[]},o);if(s instanceof Promise)throw new Ge;if(s.issues.length){let n=new((a?.Err)??e)(s.issues.map(e=>Ce(e,o,Je())));throw ne(n,a?.callee??t),n}return s.value};return t},ot=e=>{let t=async(n,r,i,a)=>{let o=i?{...i,async:!0}:{async:!0},s=n._zod.run({value:r,issues:[]},o);if(s instanceof Promise&&(s=await s),s.issues.length){let n=new((a?.Err)??e)(s.issues.map(e=>Ce(e,o,Je())));throw ne(n,a?.callee??t),n}return s.value};return t},st=e=>(t,n,r)=>{let i=r?{...r,async:!1}:{async:!1},a=t._zod.run({value:n,issues:[]},i);if(a instanceof Promise)throw new Ge;return a.issues.length?ct(e,a.issues,i):{success:!0,data:a.value}};function ct(e,t,n){let r;return{success:!1,get error(){return r||(r=new e(t.map(e=>Ce(e,n,Je()))),t=void 0,n=void 0),r},set error(e){r=e,t=void 0,n=void 0}}}var lt=e=>async(t,n,r)=>{let i=r?{...r,async:!0}:{async:!0},a=t._zod.run({value:n,issues:[]},i);return a instanceof Promise&&(a=await a),a.issues.length?ct(e,a.issues,i):{success:!0,data:a.value}},ut=Symbol.for(`zod.compile.invalid`),dt=Symbol.for(`zod.compile.fallback`),ft=((e,t,n)=>{let r=e._zod.bag.validator;if(r!==void 0){if(r(t)!==ut)return!0;if(r.definite===!0&&n===void 0)return!1}return pt(e,t,n)});function pt(e,t,n){let r=n?{...n,async:!1,abortEarly:!0}:{async:!1,abortEarly:!0},i=e._zod.bag.fallbackRun,a;if(i?(r[dt]=!0,a=i({value:t,issues:[]},r)):a=e._zod.run({value:t,issues:[]},r),a instanceof Promise)throw new Ge;return a.issues.length===0}var mt=async(e,t,n)=>{let r=n?{...n,async:!0,abortEarly:!0}:{async:!0,abortEarly:!0},i=e._zod.run({value:t,issues:[]},r);return i instanceof Promise&&(i=await i),i.issues.length===0},ht=e=>{let t=at(e),n=(e,r,i,a)=>{let o=i?{...i,direction:`backward`}:{direction:`backward`};return t(e,r,o,it(n,a))};return n},gt=e=>{let t=at(e),n=(e,r,i,a)=>t(e,r,i,it(n,a));return n},_t=e=>{let t=ot(e),n=async(e,r,i,a)=>{let o=i?{...i,direction:`backward`}:{direction:`backward`};return await t(e,r,o,it(n,a))};return n},vt=e=>{let t=ot(e),n=async(e,r,i,a)=>await t(e,r,i,it(n,a));return n},yt=e=>(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return st(e)(t,n,i)},bt=e=>(t,n,r)=>st(e)(t,n,r),xt=e=>async(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return lt(e)(t,n,i)},St=e=>async(t,n,r)=>lt(e)(t,n,r),Ct=/^[cC][0-9a-z]{6,}$/,wt=/^[0-9a-z]+$/,Tt=/^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/,Et=/^[0-9a-vA-V]{20}$/,Dt=/^[A-Za-z0-9]{27}$/,Ot=/^[a-zA-Z0-9_-]{21}$/;function kt(e){return RegExp(`^[a-zA-Z0-9_-]{${e}}$`)}var At=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,jt=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,Mt=e=>e?RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Nt=/^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Pt=`^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;function Ft(){return new RegExp(Pt,`u`)}var It=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Lt=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,Rt=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,zt=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Bt=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Vt=/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/,Ht=/^https?$/,Ut=/^\+[1-9]\d{6,14}$/,Wt=`(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;function Gt(e){return RegExp(`^${e}$`)}var Kt=Gt(Wt);function qt(e){let t=`(?:[01]\\d|2[0-3]):[0-5]\\d`;return typeof e.precision==`number`?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:e.seconds?`${t}:[0-5]\\d(?:\\.\\d+)?`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Jt(e){return RegExp(`^${qt(e)}$`)}function Yt(e){let t=[`Z`];e.offset&&t.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);let n=`${qt({precision:e.precision,seconds:!0})}(?:${t.join(`|`)})`,r=e.local?`${n}|${qt({precision:e.precision})}`:n;return RegExp(`^${Wt}T(?:${r})$`)}var Xt=/^[\s\S]{0,}$/,Zt=/^-?\d+$/,Qt=/^-?\d+(?:\.\d+)?$/,$t=/^(?:true|false)$/i,en=/^[^A-Z]*$/,tn=/^[^a-z]*$/,nn=P(`$ZodCheck`,(e,t)=>{var n;e._zod??={},e._zod.def=t,(n=e._zod).onattach??(n.onattach=[])}),rn=e=>{let t=e.value;return!h(t)&&t.length!==void 0},an={number:`number`,bigint:`bigint`,object:`date`},on=P(`$ZodCheckLessThan`,(e,t)=>{nn.init(e,t);let n=an[typeof t.value];e._zod.check=r=>{(t.inclusive?r.value<=t.value:r.value<t.value)||r.issues.push({origin:an[typeof r.value]??n,code:`too_big`,maximum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),sn=P(`$ZodCheckGreaterThan`,(e,t)=>{nn.init(e,t);let n=an[typeof t.value];e._zod.check=r=>{(t.inclusive?r.value>=t.value:r.value>t.value)||r.issues.push({origin:an[typeof r.value]??n,code:`too_small`,minimum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),cn=P(`$ZodCheckMultipleOf`,(e,t)=>{nn.init(e,t),e._zod.check=n=>{if(typeof n.value!=typeof t.value)throw Error(`Cannot mix number and bigint in multiple_of check.`);(typeof n.value==`bigint`?t.value!==BigInt(0)&&n.value%t.value===BigInt(0):_(n.value,t.value)===0)||n.issues.push({origin:typeof n.value,code:`not_multiple_of`,divisor:t.value,input:n.value,inst:e,continue:!t.abort})}}),ln=P(`$ZodCheckNumberFormat`,(e,t)=>{nn.init(e,t),t.format=t.format||`float64`;let n=t.format?.includes(`int`),r=n?`int`:`number`,[i,a]=M[t.format];e._zod.check=o=>{let s=o.value;if(n){if(!Number.isInteger(s)){o.issues.push({expected:r,format:t.format,code:`invalid_type`,continue:!1,input:s,inst:e});return}if(!Number.isSafeInteger(s)){s>0?o.issues.push({input:s,code:`too_big`,maximum:2**53-1,note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort}):o.issues.push({input:s,code:`too_small`,minimum:-(2**53-1),note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort});return}}s<i&&o.issues.push({origin:`number`,input:s,code:`too_small`,minimum:i,inclusive:!0,inst:e,continue:!t.abort}),s>a&&o.issues.push({origin:`number`,input:s,code:`too_big`,maximum:a,inclusive:!0,inst:e,continue:!t.abort})}}),un=P(`$ZodCheckMaxLength`,(e,t)=>{var n;nn.init(e,t),(n=e._zod.def).when??(n.when=rn),e._zod.check=n=>{let r=n.value,i=r.length;if((typeof r==`string`&&i>t.maximum?Te(r):i)<=t.maximum)return;let a=Ee(r);n.issues.push({origin:a,code:`too_big`,maximum:t.maximum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),dn=P(`$ZodCheckMinLength`,(e,t)=>{var n;nn.init(e,t),(n=e._zod.def).when??(n.when=rn),e._zod.check=n=>{let r=n.value,i=r.length;if((typeof r==`string`&&i>=t.minimum&&i<t.minimum*2?Te(r):i)>=t.minimum)return;let a=Ee(r);n.issues.push({origin:a,code:`too_small`,minimum:t.minimum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),fn=P(`$ZodCheckLengthEquals`,(e,t)=>{var n;nn.init(e,t),(n=e._zod.def).when??(n.when=rn),e._zod.check=n=>{let r=n.value,i=r.length,a=typeof r==`string`&&i>=t.length&&i<=t.length*2?Te(r):i;if(a===t.length)return;let o=Ee(r),s=a>t.length;n.issues.push({origin:o,...s?{code:`too_big`,maximum:t.length}:{code:`too_small`,minimum:t.length},inclusive:!0,exact:!0,input:n.value,inst:e,continue:!t.abort})}}),pn=P(`$ZodCheckStringFormat`,(e,t)=>{var n,r;nn.init(e,t),t.pattern?(n=e._zod).check??(n.check=n=>{t.pattern.lastIndex=0,t.pattern.test(n.value)||n.issues.push({origin:`string`,code:`invalid_format`,format:t.format,input:n.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort})}):(r=e._zod).check??(r.check=()=>{})}),mn=P(`$ZodCheckRegex`,(e,t)=>{pn.init(e,t),e._zod.check=n=>{t.pattern.lastIndex=0,t.pattern.test(n.value)||n.issues.push({origin:`string`,code:`invalid_format`,format:`regex`,input:n.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort})}}),hn=P(`$ZodCheckLowerCase`,(e,t)=>{t.pattern??=en,pn.init(e,t)}),gn=P(`$ZodCheckUpperCase`,(e,t)=>{t.pattern??=tn,pn.init(e,t)}),_n=P(`$ZodCheckIncludes`,(e,t)=>{nn.init(e,t);let n=k(t.includes);t.pattern=new RegExp(typeof t.position==`number`?`^.{${t.position},}${n}`:n),e._zod.check=n=>{n.value.includes(t.includes,t.position)||n.issues.push({origin:`string`,code:`invalid_format`,format:`includes`,includes:t.includes,input:n.value,inst:e,continue:!t.abort})}}),vn=P(`$ZodCheckStartsWith`,(e,t)=>{nn.init(e,t);let n=RegExp(`^${k(t.prefix)}.*`);t.pattern??=n,e._zod.check=n=>{n.value.startsWith(t.prefix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`starts_with`,prefix:t.prefix,input:n.value,inst:e,continue:!t.abort})}}),yn=P(`$ZodCheckEndsWith`,(e,t)=>{nn.init(e,t);let n=RegExp(`.*${k(t.suffix)}$`);t.pattern??=n,e._zod.check=n=>{n.value.endsWith(t.suffix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`ends_with`,suffix:t.suffix,input:n.value,inst:e,continue:!t.abort})}}),bn=P(`$ZodCheckOverwrite`,(e,t)=>{nn.init(e,t),e._zod.check=e=>{e.value=t.tx(e.value)}}),xn=class{constructor(e=[],t={}){this.content=[],this.indent=0,this.args=e,this.closed=t}indented(e){this.indent+=1;try{e(this)}finally{--this.indent}}write(e){if(typeof e==`function`){e(this,{execution:`sync`}),e(this,{execution:`async`});return}let t=e.split(`
`).filter(e=>e),n=Math.min(...t.map(e=>e.length-e.trimStart().length)),r=t.map(e=>e.slice(n)).map(e=>` `.repeat(this.indent*2)+e);for(let e of r)this.content.push(e)}compile(){let e=Function,t=this?.content??[``];return new e(...Object.keys(this.closed),`return function (${this.args.join(`, `)}) {\n${t.join(`
`)}\n};`)(...Object.values(this.closed))}},Sn={major:4,minor:6,patch:7},F=P(`$ZodType`,(e,t)=>{var n;e??={},e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=Sn;let r=e._zod.def.checks,i=e._zod.traits.has(`$ZodCheck`)?[e,...r??[]]:r?.length?[...r]:[];for(let t of i)for(let n of t._zod.onattach)n(e);if(i.length===0)(n=e._zod).deferred??(n.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{let t=(t,n,r)=>{if(t.memo)return t;let i=_e(t),a;for(let o of n){if(o._zod.def.when){if(ve(t)||!o._zod.def.when(t))continue}else if(i)continue;let n=t.issues.length,s=o._zod.check(t);if(s instanceof Promise&&r?.async===!1)throw new Ge;if(a||s instanceof Promise)a=(a??Promise.resolve()).then(async()=>{await s,t.issues.length!==n&&(Se(t.issues,n,e),i||=_e(t,n))});else{if(t.issues.length===n)continue;Se(t.issues,n,e),i||=_e(t,n)}}return a?a.then(()=>t):t},n=(n,r,a)=>{if(_e(n))return n.aborted=!0,n;let o=t(r,i,a);if(o instanceof Promise){if(a.async===!1)throw new Ge;return o.then(t=>e._zod.parse(t,a))}return e._zod.parse(o,a)};e._zod.run=(r,a)=>{if(a.skipChecks)return e._zod.parse(r,a);if(a.direction===`backward`){let t=e._zod.parse({value:r.value,issues:[]},{...a,skipChecks:!0});return t instanceof Promise?t.then(e=>n(e,r,a)):n(t,r,a)}let o=e._zod.parse(r,a);if(o instanceof Promise){if(a.async===!1)throw new Ge;return o.then(e=>t(e,i,a))}return t(o,i,a)}}},{get"~standard"(){return je(this,`~standard`,Tn(this))},set"~standard"(e){Ae(this,`~standard`,e)}}),Cn=(e,t)=>e.issues.length?{issues:e.issues.map(e=>Ce(e,t,Je()))}:{value:e.value};async function wn(e,t){let n={async:!0};return Cn(await e._zod.run({value:t,issues:[]},n),n)}function Tn(e){return{validate:t=>{let n={async:!1};try{let r=e._zod.run({value:t,issues:[]},n);if(!(r instanceof Promise))return Cn(r,n)}catch{}return wn(e,t)},vendor:`zod`,version:1}}var En=P(`$ZodString`,(e,t)=>{F.init(e,t),e._zod.pattern=t.pattern??Xt,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=String(n.value)}catch{}return typeof n.value==`string`||n.issues.push({expected:`string`,code:`invalid_type`,input:n.value,inst:e}),n}}),I=P(`$ZodStringFormat`,(e,t)=>{pn.init(e,t),En.init(e,t)}),Dn=P(`$ZodGUID`,(e,t)=>{t.pattern??=jt,I.init(e,t)}),On=P(`$ZodUUID`,(e,t)=>{if(t.version){let e={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(e===void 0)throw Error(`Invalid UUID version: "${t.version}"`);t.pattern??=Mt(e)}else t.pattern??=Mt();I.init(e,t)}),kn=P(`$ZodEmail`,(e,t)=>{t.pattern??=Nt,I.init(e,t)});function An(e){try{return typeof URL<`u`&&typeof URL.canParse==`function`?URL.canParse(e):(new URL(e),!0)}catch{return!1}}function jn(e,t){return!(`normalize`in t)&&!(`hostname`in t)&&!(`protocol`in t)?An(e)||2:Mn(e,t)}function Mn(e,t){if(!t.normalize&&t.protocol?.source===Ht.source&&!/^https?:\/\//i.test(e))return 1;try{if(typeof URL<`u`){let t=URL;if(typeof t.parse==`function`)return t.parse(e)??2}return new URL(e)}catch{return 2}}var Nn=/[\t\n\r]/g;function Pn(e){return e.replace(Nn,``)}function Fn(e,t){return t.lastIndex=0,t.test(e.hostname)}function In(e,t){return t.lastIndex=0,t.test(e.protocol.endsWith(`:`)?e.protocol.slice(0,-1):e.protocol)}var Ln=P(`$ZodURL`,(e,t)=>{I.init(e,t),e._zod.check=n=>{try{let r=n.value.trim(),i=jn(r,t);if(i===1){n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid URL format`,input:n.value,inst:e,continue:!t.abort});return}if(i===2){n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort});return}if(i===!0){n.value=Pn(r);return}t.hostname&&!Fn(i,t.hostname)&&n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid hostname`,pattern:t.hostname.source,input:n.value,inst:e,continue:!t.abort}),t.protocol&&!In(i,t.protocol)&&n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid protocol`,pattern:t.protocol.source,input:n.value,inst:e,continue:!t.abort}),n.value=t.normalize?i.href:Pn(r);return}catch{n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort})}}}),Rn=P(`$ZodEmoji`,(e,t)=>{t.pattern??=Ft(),I.init(e,t)}),zn=P(`$ZodNanoID`,(e,t)=>{if(t.length!==void 0&&(!Number.isInteger(t.length)||t.length<1))throw Error(`Invalid nanoid length: ${t.length}`);t.pattern??=t.length===void 0?Ot:kt(t.length),I.init(e,t)}),Bn=P(`$ZodCUID`,(e,t)=>{t.pattern??=Ct,I.init(e,t)}),Vn=P(`$ZodCUID2`,(e,t)=>{t.pattern??=wt,I.init(e,t)}),Hn=P(`$ZodULID`,(e,t)=>{t.pattern??=Tt,I.init(e,t)}),Un=P(`$ZodXID`,(e,t)=>{t.pattern??=Et,I.init(e,t)}),Wn=P(`$ZodKSUID`,(e,t)=>{t.pattern??=Dt,I.init(e,t)}),Gn=P(`$ZodISODateTime`,(e,t)=>{t.pattern??=Yt(t),I.init(e,t)}),Kn=P(`$ZodISODate`,(e,t)=>{t.pattern??=Kt,I.init(e,t)}),qn=P(`$ZodISOTime`,(e,t)=>{t.pattern??=Jt(t),I.init(e,t)}),Jn=P(`$ZodISODuration`,(e,t)=>{t.pattern??=At,I.init(e,t)}),Yn=P(`$ZodIPv4`,(e,t)=>{t.pattern??=It,I.init(e,t)}),Xn=/^[0-9a-fA-F:.]+$/;function Zn(e){return Xn.test(e)?An(`http://[${e}]`):!1}var Qn=P(`$ZodIPv6`,(e,t)=>{t.pattern??=Lt,I.init(e,t),e._zod.check=n=>{Zn(n.value)||n.issues.push({code:`invalid_format`,format:`ipv6`,input:n.value,inst:e,continue:!t.abort})}}),$n=P(`$ZodCIDRv4`,(e,t)=>{t.pattern??=Rt,I.init(e,t)});function er(e){let t=e.split(`/`);if(t.length!==2)return!1;let[n,r]=t;if(!r)return!1;let i=Number(r);return`${i}`!==r||i<0||i>128?!1:Zn(n)}var tr=P(`$ZodCIDRv6`,(e,t)=>{t.pattern??=zt,I.init(e,t),e._zod.check=n=>{er(n.value)||n.issues.push({code:`invalid_format`,format:`cidrv6`,input:n.value,inst:e,continue:!t.abort})}});function nr(e){if(e===``)return!0;if(/\s/.test(e)||e.length%4!=0)return!1;try{return atob(e),!0}catch{return!1}}var rr=/^[0-9a-zA-Z+/]*={0,2}$/,ir=P(`$ZodBase64`,(e,t)=>{t.pattern??=rr,I.init(e,t),e._zod.check=n=>{nr(n.value)||n.issues.push({code:`invalid_format`,format:`base64`,input:n.value,inst:e,continue:!t.abort})}}),ar=/^[A-Za-z0-9_-]*$/;function or(e){if(!ar.test(e))return!1;let t=e.replace(/[-_]/g,e=>e===`-`?`+`:`/`);return nr(t.padEnd(Math.ceil(t.length/4)*4,`=`))}var sr=P(`$ZodBase64URL`,(e,t)=>{t.pattern??=ar,I.init(e,t),e._zod.check=n=>{or(n.value)||n.issues.push({code:`invalid_format`,format:`base64url`,input:n.value,inst:e,continue:!t.abort})}}),cr=P(`$ZodE164`,(e,t)=>{t.pattern??=Ut,I.init(e,t)});function lr(e,t=null){try{let n=e.split(`.`);if(n.length!==3)return!1;let[r]=n;if(!r)return!1;let i=JSON.parse(atob(r));return!(`typ`in i&&i?.typ!==`JWT`||!i.alg||t&&(!(`alg`in i)||i.alg!==t))}catch{return!1}}var ur=P(`$ZodJWT`,(e,t)=>{I.init(e,t),e._zod.check=n=>{lr(n.value,t.alg)||n.issues.push({code:`invalid_format`,format:`jwt`,input:n.value,inst:e,continue:!t.abort})}}),dr=P(`$ZodNumber`,(e,t)=>{F.init(e,t),e._zod.pattern=Qt,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=Number(n.value)}catch{}let i=n.value;if(typeof i==`number`&&!Number.isNaN(i)&&Number.isFinite(i))return n;let a=typeof i==`number`?Number.isNaN(i)?`NaN`:Number.isFinite(i)?void 0:String(i):void 0;return n.issues.push({expected:`number`,code:`invalid_type`,input:i,inst:e,...a?{received:a}:{}}),n}}),fr=P(`$ZodNumberFormat`,(e,t)=>{ln.init(e,t),dr.init(e,t)}),pr=P(`$ZodBoolean`,(e,t)=>{F.init(e,t),e._zod.pattern=$t,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=!!n.value}catch{}let i=n.value;return typeof i==`boolean`||n.issues.push({expected:`boolean`,code:`invalid_type`,input:i,inst:e}),n}}),mr=P(`$ZodUnknown`,(e,t)=>{F.init(e,t),e._zod.parse=e=>e}),hr=P(`$ZodNever`,(e,t)=>{F.init(e,t),e._zod.parse=(t,n)=>(t.issues.push({expected:`never`,code:`invalid_type`,input:t.value,inst:e}),t)});function gr(e,t){let n=xe(e._zod.def.checks);if(!n.length)return;let r=Math.min(...n.map(e=>e[0])),i=e._zod.parse;e._zod.parse=(n,a)=>{let o=t(n.value);if(o>r&&!a?.skipChecks&&a?.direction!==`backward`){for(let[t,r]of xe(e._zod.def.checks))if(o>t&&r._zod.def.when(n)){let t=n.issues.length;return r._zod.check(n),n.issues[t].continue=!1,Se(n.issues,t,e),n}}return i(n,a)}}var _r=e=>Array.isArray(e)?e.length:-1;function vr(e,t,n){e.issues.length&&t.issues.push(...ye(n,e.issues)),t.value[n]=e.value}var yr=P(`$ZodArray`,(e,t)=>{F.init(e,t);let n=qe.memoizer;n?.attach(e),e._zod.parse=(r,i)=>{let a=r.value;if(!Array.isArray(a))return r.issues.push({expected:`array`,code:`invalid_type`,input:a,inst:e}),r;r.value=n?n.alloc(e,r,Array(a.length),i):Array(a.length);let o=[],s=i?.abortEarly;for(let e=0;e<a.length;e++){let n=a[e],c=t.element._zod.run({value:n,issues:[]},i);if(c instanceof Promise)o.push(c.then(t=>vr(t,r,e)));else if(vr(c,r,e),s&&c.issues.length!==0&&_e(c))break}return o.length?Promise.all(o).then(()=>r):r},gr(e,_r)});function br(e,t,n,r,i,a){let o=n in r,s=a===`optional`;if(o||!s||i!==`optional`){if(e.issues.length){if(i!==void 0&&s&&!o)return;t.issues.push(...ye(n,e.issues))}!o&&i===void 0?e.issues.length||t.issues.push({code:`invalid_type`,expected:`nonoptional`,input:void 0,path:[n]}):e.value===void 0?(o||i===`defaulted`&&!s)&&(t.value[n]=void 0):t.value[n]=e.value}}var xr=[];function Sr(e){let t=Object.keys(e.shape),n=Object.getOwnPropertySymbols(e.shape),r=n.length?n:xr,i=r.length?[...t,...r]:t;for(let t of i)if(!e.shape?.[t]?._zod?.traits?.has(`$ZodType`))throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);let a=oe(e.shape);return{...e,allKeys:i,symbolKeys:r,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(a)}}function Cr(e,t,n,r,i,a,o){let s=[],c=i.keySet,l=i.catchall._zod,u=l.def.type,d=l.optin,f=l.optout,p=0;for(let i in t){if(o&&n.issues.length!==p){if(_e(n,p))break;p=n.issues.length}if(c.has(i))continue;if(i===`__proto__`){u===`never`&&s.push(i);continue}if(u===`never`){s.push(i);continue}let a=l.run({value:t[i],issues:[]},r);a instanceof Promise?e.push(a.then(e=>br(e,n,i,t,d,f))):br(a,n,i,t,d,f)}return s.length&&n.issues.push({code:`unrecognized_keys`,keys:s,input:t,inst:a,continue:!0}),e.length?Promise.all(e).then(()=>n):n}var wr=P(`$ZodObject`,(e,t)=>{F.init(e,t);let n=Object.getOwnPropertyDescriptor(t,`shape`),r=n?.get?n.get.raw:t.shape??{};if(r){let e=()=>{let n={...r};return Object.defineProperty(t,"shape",{value:n}),e.raw=n,n};e.raw=r,Object.defineProperty(t,"shape",{get:e})}let i=m(()=>Sr(t));N(e,`propValues`,e=>{let t=e.def.shape,n={};for(let e in t){let r=t[e]._zod;if(r.values){Object.prototype.hasOwnProperty.call(n,e)||v(n,e,new Set);for(let t of r.values)n[e].add(t);r.optin!==void 0&&n[e].add(void 0)}}return n});let a=E,o=t.catchall,s,c=qe.memoizer;c?.attach(e),e._zod.parse=(t,n)=>{s??=i.value;let r=t.value;if(!a(r))return t.issues.push({expected:`object`,code:`invalid_type`,input:r,inst:e}),t;t.value=c?c.alloc(e,t,{},n):{};let l=[],u=s.shape,d=n?.abortEarly,f=t.issues.length;for(let e of s.allKeys){if(d&&t.issues.length!==f){if(_e(t,f))break;f=t.issues.length}if(e===`__proto__`)continue;let i=u[e],a=i._zod.optin,o=i._zod.optout,s=i._zod.run({value:r[e],issues:[]},n);s instanceof Promise?l.push(s.then(n=>br(n,t,e,r,a,o))):br(s,t,e,r,a,o)}return o?Cr(l,r,t,n,i.value,e,d===!0):l.length?Promise.all(l).then(()=>t):t}}),Tr=P(`$ZodObjectJIT`,(e,t)=>{wr.init(e,t);let n=e._zod.parse,r=m(()=>Sr(t)),i=qe.memoizer,a=t=>{let n=r.value,a=n.symbolKeys,o=new xn([`payload`,`ctx`],{shape:t,inst:e,memo:i,syms:a}),s=e=>`shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`,c=(e,t)=>`
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
          }`;o.write(`const input = payload.value;`);let l=Object.create(null),u=0;for(let e of n.allKeys)l[e]=`key_${u++}`;o.write(i?`const newResult = memo.alloc(inst, payload, {}, ctx);`:`const newResult = {};`);for(let e of n.allKeys){if(e===`__proto__`)continue;let n=l[e],r=typeof e==`symbol`?`syms[${a.indexOf(e)}]`:ee(e),i=`${r} in input`,u=t[e],d=u?._zod?.optin,f=d!==void 0,p=u?._zod?.optout===`optional`;if(o.write(`const ${n} = ${s(r)};`),f&&p){let e=d===`optional`?`${n}_present`:`${n}.value !== undefined || ${n}_present`;o.write(`
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

      `)}return o.write(`payload.value = newResult;`),o.write(`return payload;`),o.compile()},o,s=E,c=!qe.jitless,l=c&&D.value,u=t.catchall,d;e._zod.parse=(i,f)=>{d??=r.value;let p=i.value;return s(p)?c&&l&&f?.async===!1&&f.jitless!==!0?(o||=a(t.shape),i=o(i,f),u?Cr([],p,i,f,d,e,f?.abortEarly===!0):i):n(i,f):(i.issues.push({expected:`object`,code:`invalid_type`,input:p,inst:e}),i)}});function Er(e,t,n,r){for(let n of e)if(n.issues.length===0)return t.value=n.value,t;let i=e.filter(e=>!_e(e));return i.length===1?(t.value=i[0].value,i[0]):(t.issues.push({code:`invalid_union`,input:t.value,inst:n,errors:e.map(e=>e.issues.map(e=>Ce(e,r,Je())))}),t)}var Dr=P(`$ZodUnion`,(e,t)=>{F.init(e,t),N(e,`optin`,e=>e.def.options.some(e=>e._zod.optin===`defaulted`)?`defaulted`:e.def.options.some(e=>e._zod.optin!==void 0)?`optional`:void 0),N(e,`optout`,e=>e.def.options.some(e=>e._zod.optout===`optional`)?`optional`:void 0),N(e,`values`,e=>{if(e.def.options.every(e=>e._zod.values))return new Set(e.def.options.flatMap(e=>Array.from(e._zod.values)))}),N(e,`pattern`,e=>{if(e.def.options.every(e=>e._zod.pattern)){let t=e.def.options.map(e=>e._zod.pattern);return RegExp(`^(${t.map(e=>g(e.source)).join(`|`)})$`)}});let n=t.options.length===1?t.options[0]._zod.run:null;e._zod.parse=(r,i)=>{if(n)return n(r,i);let a=!1,o=[];for(let e of t.options){let t=e._zod.run({value:r.value,issues:[]},i);if(t instanceof Promise)o.push(t),a=!0;else{if(t.issues.length===0)return t;o.push(t)}}return a?Promise.all(o).then(t=>Er(t,r,e,i)):Er(o,r,e,i)}}),Or=P(`$ZodIntersection`,(e,t)=>{F.init(e,t),e._zod.parse=(e,n)=>{let r=e.value,i=t.left._zod.run({value:r,issues:[]},n),a=t.right._zod.run({value:r,issues:[]},n);return i instanceof Promise||a instanceof Promise?Promise.all([i,a]).then(([t,n])=>Ar(e,t,n)):Ar(e,i,a)}});function kr(e,t){if(e===t||e instanceof Date&&t instanceof Date&&+e==+t)return{valid:!0,data:e};if(O(e)&&O(t)){let n=Object.keys(t),r=Object.keys(e).filter(e=>n.indexOf(e)!==-1),i={...e,...t};Object.prototype.hasOwnProperty.call(i,`__proto__`)&&delete i.__proto__;for(let n of r){if(n===`__proto__`)continue;let r=kr(e[n],t[n]);if(!r.valid)return{valid:!1,mergeErrorPath:[n,...r.mergeErrorPath]};i[n]=r.data}return{valid:!0,data:i}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return{valid:!1,mergeErrorPath:[]};let n=[];for(let r=0;r<e.length;r++){let i=e[r],a=t[r],o=kr(i,a);if(!o.valid)return{valid:!1,mergeErrorPath:[r,...o.mergeErrorPath]};n.push(o.data)}return{valid:!0,data:n}}return{valid:!1,mergeErrorPath:[]}}function Ar(e,t,n){let r=new Map,i,a=new Map,o=(e,t)=>{let n;if(e.code===`unrecognized_keys`&&!e.path?.length)i??=e,n=e.keys;else if(e.code===`invalid_key`&&e.origin===`record`&&e.path?.length===1){let t=String(e.path[0]);a.has(t)||a.set(t,e),n=[t]}else return!1;for(let e of n)r.has(e)||r.set(e,{}),r.get(e)[t]=!0;return!0};for(let n of t.issues)o(n,`l`)||e.issues.push(n);for(let t of n.issues)o(t,`r`)||e.issues.push(t);let s=[...r].filter(([,e])=>e.l&&e.r).map(([e])=>e);if(s.length){let t=i?s.filter(e=>i.keys.includes(e)):[];t.length&&e.issues.push({...i,keys:t});for(let n of s)!t.includes(n)&&a.has(n)&&e.issues.push(a.get(n))}let c=kr(t.value,n.value);if(!c.valid){if(_e(e))return e;throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`)}return e.value=c.data,e}var jr=P(`$ZodTuple`,(e,t)=>{F.init(e,t);let n=t.items,r=qe.memoizer;r?.attach(e),e._zod.parse=(i,a)=>{let o=i.value;if(!Array.isArray(o))return i.issues.push({input:o,inst:e,expected:`tuple`,code:`invalid_type`}),i;i.value=r?r.alloc(e,i,[],a):[];let s=[],c=Mr(n,`optin`),l=Mr(n,`optout`);if(!t.rest){if(o.length<c)return i.issues.push({code:`too_small`,minimum:c,inclusive:!0,input:o,inst:e,origin:`array`}),i;o.length>n.length&&i.issues.push({code:`too_big`,maximum:n.length,inclusive:!0,input:o,inst:e,origin:`array`})}let u=Array(n.length),d=t.rest?a?.abortEarly:void 0,f=!1;for(let e=0;e<n.length;e++){let t=n[e]._zod.run({value:o[e],issues:[]},a);t instanceof Promise?s.push(t.then(t=>{u[e]=t})):(u[e]=t,d&&!f&&t.issues.length&&(f=_e(t)))}if(t.rest&&!f){let e=n.length-1,r=o.slice(n.length),c=i.issues.length;for(let n of r){if(d&&i.issues.length!==c){if(_e(i,c))break;c=i.issues.length}e++;let r=t.rest._zod.run({value:n,issues:[]},a);r instanceof Promise?s.push(r.then(t=>Nr(t,i,e))):Nr(r,i,e)}}return s.length?Promise.all(s).then(()=>Pr(u,i,n,o,l)):Pr(u,i,n,o,l)}});function Mr(e,t){for(let n=e.length-1;n>=0;n--)if(!(t===`optin`?e[n]._zod.optin!==void 0:e[n]._zod.optout===`optional`))return n+1;return 0}function Nr(e,t,n){e.issues.length&&t.issues.push(...ye(n,e.issues)),t.value[n]=e.value}function Pr(e,t,n,r,i){for(let a=0;a<n.length;a++){let o=e[a],s=a<r.length;if(!s&&a>=i&&n[a]._zod.optin===`optional`){t.value.length=a;break}if(o.issues.length){if(!s&&a>=i){t.value.length=a;break}t.issues.push(...ye(a,o.issues))}t.value[a]=o.value}for(let e=t.value.length-1;e>=r.length&&n[e]._zod.optout===`optional`&&t.value[e]===void 0;e--)t.value.length=e;return t}var Fr=P(`$ZodRecord`,(e,t)=>{F.init(e,t);let n=qe.memoizer;n?.attach(e),e._zod.parse=(r,i)=>{let a=r.value;if(!O(a))return r.issues.push({expected:`record`,code:`invalid_type`,input:a,inst:e}),r;let o=[],s=t.keyType._zod.values;if(s&&!t.partial){r.value=n?n.alloc(e,r,{},i):{};let c=new Set;for(let n of s)if(typeof n==`string`||typeof n==`number`||typeof n==`symbol`){if(c.add(typeof n==`number`?n.toString():n),n===`__proto__`)continue;let s=t.keyType._zod.run({value:n,issues:[]},i);if(s instanceof Promise)throw Error(`Async schemas not supported in object keys currently`);if(s.issues.length){r.issues.push({code:`invalid_key`,origin:`record`,issues:s.issues.map(e=>Ce(e,i,Je())),input:n,path:[n],inst:e});continue}let l=s.value;if(l===`__proto__`)continue;let u=t.valueType._zod.run({value:a[n],issues:[]},i);u instanceof Promise?o.push(u.then(e=>{e.issues.length&&r.issues.push(...ye(n,e.issues)),r.value[l]=e.value})):(u.issues.length&&r.issues.push(...ye(n,u.issues)),r.value[l]=u.value)}let l;for(let e in a)if(!c.has(e)){if(t.mode===`loose`){if(e===`__proto__`)continue;r.value[e]=a[e]}else l??=[],l.push(e)}l&&l.length>0&&r.issues.push({code:`unrecognized_keys`,input:a,inst:e,keys:l,continue:!0})}else{r.value=n?n.alloc(e,r,{},i):{};let c;for(let n of Reflect.ownKeys(a)){if(n===`__proto__`||!Object.prototype.propertyIsEnumerable.call(a,n))continue;let l=t.keyType._zod.run({value:n,issues:[]},i);if(l instanceof Promise)throw Error(`Async schemas not supported in object keys currently`);if(typeof n==`string`&&Qt.test(n)&&l.issues.length){let e=t.keyType._zod.run({value:Number(n),issues:[]},i);if(e instanceof Promise)throw Error(`Async schemas not supported in object keys currently`);e.issues.length===0&&(l=e)}if(l.issues.length){t.mode===`loose`?r.value[n]=a[n]:s?(c??=[],c.push(n)):r.issues.push({code:`invalid_key`,origin:`record`,issues:l.issues.map(e=>Ce(e,i,Je())),input:n,path:[n],inst:e});continue}let u=l.value;if(u===`__proto__`)continue;let d=t.valueType._zod.run({value:a[n],issues:[]},i);d instanceof Promise?o.push(d.then(e=>{e.issues.length&&r.issues.push(...ye(n,e.issues)),r.value[u]=e.value})):(d.issues.length&&r.issues.push(...ye(n,d.issues)),r.value[u]=d.value)}c&&c.length>0&&r.issues.push({code:`unrecognized_keys`,input:a,inst:e,keys:c,continue:!0})}return o.length?Promise.all(o).then(()=>r):r}}),Ir=P(`$ZodEnum`,(e,t)=>{F.init(e,t);let n=u(t.entries),r=new Set(n);e._zod.values=r,N(e,`pattern`,e=>{let t=u(e.def.entries).filter(e=>ie.has(typeof e));return RegExp(t.length?`^(${t.map(e=>k(e.toString())).join(`|`)})$`:`^[^\\s\\S]$`)}),e._zod.parse=(t,i)=>{let a=t.value;return r.has(a)||t.issues.push({code:`invalid_value`,values:n,input:a,inst:e}),t}}),Lr=P(`$ZodLiteral`,(e,t)=>{F.init(e,t);let n=new Set(t.values);e._zod.values=n,N(e,`pattern`,e=>{let t=e.def.values;return RegExp(t.length?`^(${t.map(e=>typeof e==`string`?k(e):e?k(e.toString()):String(e)).join(`|`)})$`:`^[^\\s\\S]$`)}),e._zod.parse=(r,i)=>{let a=r.value;return n.has(a)||r.issues.push({code:`invalid_value`,values:t.values,input:a,inst:e}),r}}),Rr=P(`$ZodTransform`,(e,t)=>{F.init(e,t),e._zod.optin=`optional`,qe.memoizer?.guard(e),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new Ke(e.constructor.name);let i=t.transform(n.value,n);if(r.async)return(i instanceof Promise?i:Promise.resolve(i)).then(e=>(n.value=e,n));if(i instanceof Promise)throw new Ge;return n.value=i,n}});function zr(e,t){return e.value=t.issues.length?void 0:t.value,e}var Br=P(`$ZodOptional`,(e,t)=>{F.init(e,t),N(e,`optin`,e=>e.def.innerType._zod.optin===`defaulted`?`defaulted`:`optional`),e._zod.optout=`optional`,N(e,`values`,e=>{let t=e.def.innerType._zod.values;return t?new Set([...t,void 0]):void 0}),N(e,`pattern`,e=>{let t=e.def.innerType._zod.pattern;return t?RegExp(`^(${g(t.source)})?$`):void 0}),e._zod.parse=(e,n)=>{if(e.value===void 0){if(t.innerType._zod.optin!==`defaulted`)return e;let r=t.innerType._zod.run({value:e.value,issues:[]},n);return r instanceof Promise?r.then(t=>zr(e,t)):zr(e,r)}return t.innerType._zod.run(e,n)}}),Vr=P(`$ZodExactOptional`,(e,t)=>{Br.init(e,t),N(e,`values`,e=>e.def.innerType._zod.values),N(e,`pattern`,e=>e.def.innerType._zod.pattern),e._zod.parse=(e,n)=>t.innerType._zod.run(e,n)}),Hr=P(`$ZodNullable`,(e,t)=>{F.init(e,t),N(e,`optin`,e=>e.def.innerType._zod.optin),N(e,`optout`,e=>e.def.innerType._zod.optout),N(e,`pattern`,e=>{let t=e.def.innerType._zod.pattern;return t?RegExp(`^(${g(t.source)}|null)$`):void 0}),N(e,`values`,e=>e.def.innerType._zod.values?new Set([...e.def.innerType._zod.values,null]):void 0),e._zod.parse=(e,n)=>e.value===null?e:t.innerType._zod.run(e,n)}),Ur=P(`$ZodDefault`,(e,t)=>{F.init(e,t),e._zod.optin=`defaulted`,N(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);if(e.value===void 0)return e.value=t.defaultValue,e;let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(e=>Wr(e,t)):Wr(r,t)}});function Wr(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}var Gr=P(`$ZodPrefault`,(e,t)=>{F.init(e,t),e._zod.optin=`defaulted`,N(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>(n.direction===`backward`||e.value===void 0&&(e.value=t.defaultValue),t.innerType._zod.run(e,n))}),Kr=P(`$ZodNonOptional`,(e,t)=>{F.init(e,t),N(e,`values`,e=>{let t=e.def.innerType._zod.values;return t?new Set([...t].filter(e=>e!==void 0)):void 0}),e._zod.parse=(n,r)=>{let i=t.innerType._zod.run(n,r);return i instanceof Promise?i.then(t=>qr(t,e)):qr(i,e)}});function qr(e,t){return!e.issues.length&&e.value===void 0&&e.issues.push({code:`invalid_type`,expected:`nonoptional`,input:e.value,inst:t}),e}function Jr(e,t,n,r){return t.issues.length?(e.value=n.catchValue({...t,value:e.value,error:{issues:t.issues.map(e=>Ce(e,r,Je()))},input:e.value}),e):(e.value=t.value,t.memo&&(e.memo=!0),e)}var Yr=P(`$ZodCatch`,(e,t)=>{F.init(e,t),N(e,`optin`,e=>e.def.innerType._zod.optin===`defaulted`?`defaulted`:`optional`),N(e,`optout`,e=>e.def.innerType._zod.optout),N(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run({value:e.value,issues:[]},n);return r instanceof Promise?r.then(r=>Jr(e,r,t,n)):Jr(e,r,t,n)}}),Xr=P(`$ZodPipe`,(e,t)=>{F.init(e,t),N(e,`values`,e=>e.def.in._zod.values),N(e,`optin`,e=>e.def.in._zod.optin),N(e,`optout`,e=>e.def.out._zod.optout),N(e,`propValues`,e=>e.def.in._zod.propValues),e._zod.parse=(e,n)=>{if(n.direction===`backward`){let r=t.out._zod.run(e,n);return r instanceof Promise?r.then(e=>Zr(e,t.in,n)):Zr(r,t.in,n)}let r=t.in._zod.run(e,n);return r instanceof Promise?r.then(e=>Zr(e,t.out,n)):Zr(r,t.out,n)}});function Zr(e,t,n){return e.issues.some(e=>e.code!==`unrecognized_keys`)?(e.aborted=!0,e):t._zod.run({value:e.value,issues:e.issues},n)}var Qr=P(`$ZodReadonly`,(e,t)=>{F.init(e,t),N(e,`propValues`,e=>e.def.innerType._zod.propValues),N(e,`values`,e=>e.def.innerType._zod.values),N(e,`optin`,e=>e.def.innerType?._zod?.optin),N(e,`optout`,e=>e.def.innerType?._zod?.optout),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then($r):$r(r)}});function $r(e){return e.memo||(e.value=Object.freeze(e.value)),e}var ei=P(`$ZodCustom`,(e,t)=>{nn.init(e,t),F.init(e,t),e._zod.parse=(e,t)=>e,e._zod.check=n=>{let r=n.value,i=t.fn(r);if(i instanceof Promise)return i.then(t=>ti(t,n,r,e));ti(i,n,r,e)}});function ti(e,t,n,r){if(!e){let e={code:`custom`,input:n,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(e.params=r._zod.def.params),t.issues.push(Oe(e))}}var ni=class extends Error{constructor(){super(`Cannot parse a reference cycle that closes through a transform`),this.name=`ZodCyclicError`}},ri=`~memo`,ii=[];function ai(e){return typeof e==`object`&&!!e}function oi(e){return e.map(e=>e.path?{...e,path:e.path.slice()}:{...e})}var si=new WeakMap,ci=0,li=1,ui=2;function di(e,t,n){let r=si.get(e);if(r!==void 0)return r?ui:ci;if(t.has(e))return ui;t.add(e);let i=ci,a=e=>{if(i!==ui&&e?._zod){let r=di(e,t,n);r>i&&(i=r)}},o=(e,r)=>{let i=ci;for(let a of Reflect.ownKeys(e)){let o=Object.getOwnPropertyDescriptor(e,a);if(r&&!o.enumerable)continue;let s=o.get?li:o.value?._zod?di(o.value,t,n):ci;s>i&&(i=s)}return i},s=e=>{e>i&&(i=e)},c=e._zod.def;switch(c.type){case`object`:{let e=y(c);s(e?o(e,!0):li),a(c.catchall);break}case`array`:a(c.element);break;case`tuple`:for(let e of c.items)a(e);a(c.rest);break;case`record`:case`map`:a(c.keyType),a(c.valueType);break;case`set`:a(c.valueType);break;case`union`:for(let e of c.options)a(e);break;case`intersection`:a(c.left),a(c.right);break;case`optional`:case`nullable`:case`default`:case`prefault`:case`catch`:case`readonly`:case`nonoptional`:case`promise`:case`success`:a(c.innerType);break;case`pipe`:a(c.in),a(c.out);break;case`function`:a(c.input),a(c.output);break;case`lazy`:{let r=c._cachedInner??(n?e._zod.innerType:void 0);s(r?di(r,t,!1):li);break}case`template_literal`:case`string`:case`number`:case`int`:case`boolean`:case`bigint`:case`symbol`:case`undefined`:case`null`:case`void`:case`never`:case`any`:case`unknown`:case`date`:case`nan`:case`enum`:case`literal`:case`file`:case`transform`:case`custom`:break;default:for(let e in c){let t=Object.getOwnPropertyDescriptor(c,e);if(!t||t.get)continue;let n=t.value;if(n&&typeof n==`object`){if(n._zod)a(n);else if(Array.isArray(n))for(let e of n)a(e)}}}return t.delete(e),fi(e,i)}function fi(e,t){return t!==li&&si.set(e,t===ui),t}function pi(e,t){let n=e.buckets.get(t);return n||(n=new WeakMap,e.buckets.set(t,n)),n}var mi,hi=[],gi={alloc(e,t,n){let r=mi;if(!r)return n;mi=void 0;let i={value:n,issues:null};return r.set(t.value,i),hi.push(i),n},guard(e){var t;(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred.push(()=>{let t=e._zod.parse,n=(e,n)=>{if(n.direction!==`backward`&&vi(n,e.value))throw new ni;return t(e,n)};e._zod.parse=n,e._zod.run===t&&(e._zod.run=n)})},attach(e){var t;let n,r=!1,i,a;(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred.push(()=>{let t=e._zod.parse,o=(s,c)=>{if(n===void 0){let i=di(e,new Set,!1);if(i===ci)return e._zod.parse=t,e._zod.run===o&&(e._zod.run=t),t(s,c);i===ui||r?n=!0:r=!0}let l=s.value;if(!ai(l))return t(s,c);let u=c[ri];u||(u={buckets:new WeakMap,backEdges:void 0},c[ri]=u);let d;i===c?d=a:(d=pi(u,e),i=c,a=d);let f=d.get(l);if(f)return s.value=f.value,f.issues?f.issues.length&&s.issues.push(...oi(f.issues)):(s.memo=!0,u.backEdges??(u.backEdges=new WeakSet),u.backEdges.add(f.value)),s;mi=d;let p=hi.length,m=t(s,c);mi=void 0;let h=hi.length>p?hi.pop():void 0;return m instanceof Promise?m.then(e=>(h&&(h.issues=e.issues.length?oi(e.issues):ii),e)):(h&&(h.issues=m.issues.length?oi(m.issues):ii),m)};e._zod.parse=o,e._zod.run===t&&(e._zod.run=o)})}};function _i(){return gi}function vi(e,t){let n=e[ri]?.backEdges;return n!==void 0&&ai(t)&&n.has(t)}var yi=()=>{let e={string:{unit:`characters`,verb:`to have`},file:{unit:`bytes`,verb:`to have`},array:{unit:`items`,verb:`to have`},set:{unit:`items`,verb:`to have`},map:{unit:`entries`,verb:`to have`}};function t(t){return e[t]??null}let n={regex:`input`,email:`email address`,url:`URL`,emoji:`emoji`,uuid:`UUID`,uuidv4:`UUIDv4`,uuidv6:`UUIDv6`,nanoid:`nanoid`,guid:`GUID`,cuid:`cuid`,cuid2:`cuid2`,ulid:`ULID`,xid:`XID`,ksuid:`KSUID`,datetime:`ISO datetime`,date:`ISO date`,time:`ISO time`,duration:`ISO duration`,ipv4:`IPv4 address`,ipv6:`IPv6 address`,mac:`MAC address`,cidrv4:`IPv4 range`,cidrv6:`IPv6 range`,base64:`base64-encoded string`,base64url:`base64url-encoded string`,json_string:`JSON string`,e164:`E.164 number`,currency_code:`currency code`,credit_card:`credit card number`,iban:`IBAN`,jwt:`JWT`,template_literal:`input`},r={nan:`NaN`};function i(e,t){return e===`number`&&typeof t==`number`&&!Number.isFinite(t)?String(t):r[e]??e}return e=>{switch(e.code){case`invalid_type`:return`Invalid input: expected ${i(e.expected)}, received ${i(De(e.input),e.input)}`;case`invalid_value`:return e.values.length===1?`Invalid input: expected ${ae(e.values[0])}`:`Invalid option: expected one of ${d(e.values,`|`)}`;case`too_big`:{let n=e.exact?`exactly `:e.inclusive?`<=`:`<`,r=t(e.origin);return r?`Too big: expected ${e.origin??`value`} to have ${n}${e.maximum.toString()} ${r.unit??`elements`}`:`Too big: expected ${e.origin??`value`} to be ${n}${e.maximum.toString()}`}case`too_small`:{let n=e.exact?`exactly `:e.inclusive?`>=`:`>`,r=t(e.origin);return r?`Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}`:`Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`}case`invalid_format`:{let t=e;return t.format===`starts_with`?`Invalid string: must start with "${t.prefix}"`:t.format===`ends_with`?`Invalid string: must end with "${t.suffix}"`:t.format===`includes`?`Invalid string: must include "${t.includes}"`:t.format===`regex`?`Invalid string: must match pattern ${t.pattern}`:`Invalid ${n[t.format]??e.format}`}case`not_multiple_of`:return`Invalid number: must be a multiple of ${e.divisor}`;case`unrecognized_keys`:return`Unrecognized key${e.keys.length>1?`s`:``}: ${d(e.keys,`, `)}`;case`invalid_key`:return`Invalid key in ${e.origin}`;case`invalid_union`:return e.options&&Array.isArray(e.options)&&e.options.length>0?`Invalid discriminator value. Expected ${e.options.map(e=>`'${e}'`).join(` | `)}`:e.inclusive===!1?`Invalid input: more than one option matched`:`Invalid input`;case`invalid_element`:return`Invalid value in ${e.origin}`;default:return`Invalid input`}}};function bi(){return{localeError:yi()}}var xi,Si=class{constructor(){this._map=new WeakMap,this._idmap=new Map}add(e,...t){let n=t[0];return this._map.set(e,n),n&&typeof n==`object`&&`id`in n&&this._idmap.set(n.id,e),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(e){let t=this._map.get(e);return t&&typeof t==`object`&&`id`in t&&this._idmap.delete(t.id),this._map.delete(e),this}get(e){let t=e._zod.parent;if(t){let n={...this.get(t)??{}};delete n.id;let r={...n,...this._map.get(e)};return Object.keys(r).length?r:void 0}return this._map.get(e)}has(e){return this._map.has(e)}};function Ci(){return new Si}(xi=globalThis).__zod_globalRegistry??(xi.__zod_globalRegistry=Ci());var wi=globalThis.__zod_globalRegistry;function Ti(e){return e.checks&&=[...e.checks],e}function Ei(e,t){return new e(Ti({type:`string`,...j(t)}))}function Di(e,t){return new e({type:`string`,format:`email`,check:`string_format`,abort:!1,...j(t)})}function Oi(e,t){return new e({type:`string`,format:`guid`,check:`string_format`,abort:!1,...j(t)})}function ki(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,...j(t)})}function Ai(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v4`,...j(t)})}function ji(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v6`,...j(t)})}function Mi(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v7`,...j(t)})}function Ni(e,t){return new e({type:`string`,format:`url`,check:`string_format`,abort:!1,...j(t)})}function Pi(e,t){return new e({type:`string`,format:`emoji`,check:`string_format`,abort:!1,...j(t)})}function Fi(e,t){return new e({type:`string`,format:`nanoid`,check:`string_format`,abort:!1,...j(t)})}function Ii(e,t){return new e({type:`string`,format:`cuid`,check:`string_format`,abort:!1,...j(t)})}function Li(e,t){return new e({type:`string`,format:`cuid2`,check:`string_format`,abort:!1,...j(t)})}function Ri(e,t){return new e({type:`string`,format:`ulid`,check:`string_format`,abort:!1,...j(t)})}function zi(e,t){return new e({type:`string`,format:`xid`,check:`string_format`,abort:!1,...j(t)})}function Bi(e,t){return new e({type:`string`,format:`ksuid`,check:`string_format`,abort:!1,...j(t)})}function Vi(e,t){return new e({type:`string`,format:`ipv4`,check:`string_format`,abort:!1,...j(t)})}function Hi(e,t){return new e({type:`string`,format:`ipv6`,check:`string_format`,abort:!1,...j(t)})}function Ui(e,t){return new e({type:`string`,format:`cidrv4`,check:`string_format`,abort:!1,...j(t)})}function Wi(e,t){return new e({type:`string`,format:`cidrv6`,check:`string_format`,abort:!1,...j(t)})}function Gi(e,t){return new e({type:`string`,format:`base64`,check:`string_format`,abort:!1,...j(t)})}function Ki(e,t){return new e({type:`string`,format:`base64url`,check:`string_format`,abort:!1,...j(t)})}function qi(e,t){return new e({type:`string`,format:`e164`,check:`string_format`,abort:!1,...j(t)})}function Ji(e,t){return new e({type:`string`,format:`jwt`,check:`string_format`,abort:!1,...j(t)})}function Yi(e,t){return new e({type:`string`,format:`datetime`,check:`string_format`,offset:!1,local:!1,precision:null,...j(t)})}function Xi(e,t){return new e({type:`string`,format:`date`,check:`string_format`,...j(t)})}function Zi(e,t){return new e({type:`string`,format:`time`,check:`string_format`,precision:null,...j(t)})}function Qi(e,t){return new e({type:`string`,format:`duration`,check:`string_format`,...j(t)})}function $i(e,t){return new e(Ti({type:`number`,checks:[],...j(t)}))}function ea(e,t){return new e({type:`number`,check:`number_format`,abort:!1,format:`safeint`,...j(t)})}function ta(e,t){return new e({type:`boolean`,...j(t)})}function na(e){return new e({type:`unknown`})}function ra(e,t){return new e({type:`never`,...j(t)})}function ia(e,t){return new on({check:`less_than`,...j(t),value:e,inclusive:!1})}function aa(e,t){return new on({check:`less_than`,...j(t),value:e,inclusive:!0})}function oa(e,t){return new sn({check:`greater_than`,...j(t),value:e,inclusive:!1})}function sa(e,t){return new sn({check:`greater_than`,...j(t),value:e,inclusive:!0})}function ca(e,t){return new cn({check:`multiple_of`,...j(t),value:e})}function la(e,t){return new un({check:`max_length`,...j(t),maximum:e})}function ua(e,t){return new dn({check:`min_length`,...j(t),minimum:e})}function da(e,t){return new fn({check:`length_equals`,...j(t),length:e})}function fa(e,t){return new mn({check:`string_format`,format:`regex`,...j(t),pattern:e})}function pa(e){return new hn({check:`string_format`,format:`lowercase`,...j(e)})}function ma(e){return new gn({check:`string_format`,format:`uppercase`,...j(e)})}function ha(e,t){return new _n({check:`string_format`,format:`includes`,...j(t),includes:e})}function ga(e,t){return new vn({check:`string_format`,format:`starts_with`,...j(t),prefix:e})}function _a(e,t){return new yn({check:`string_format`,format:`ends_with`,...j(t),suffix:e})}function va(e){return new bn({check:`overwrite`,tx:e})}function ya(e){return va(t=>t.normalize(e))}function ba(){return va(e=>e.trim())}function xa(){return va(e=>e.toLowerCase())}function Sa(){return va(e=>e.toUpperCase())}function Ca(){return va(e=>te(e))}function wa(e,t,n){return new e({type:`array`,element:t,...j(n)})}function Ta(e,t,n){return new e({type:`custom`,check:`custom`,fn:t,...j(n)})}function Ea(e,t){let n=Da(t=>(t.addIssue=e=>{if(typeof e==`string`)t.issues.push(Oe(e,t.value,n._zod.def));else{let r=e;r.fatal&&(r.continue=!1),r.code??=`custom`,`input`in r||(r.input=t.value),r.inst??=n,r.continue??=!n._zod.def.abort,t.issues.push(Oe(r))}},e(t.value,t)),t);return n}function Da(e,t){let n=new nn({check:`custom`,...j(t)});return n._zod.check=e,n}function Oa(e,...t){for(let n of t)for(let t of Reflect.ownKeys(n))Object.prototype.propertyIsEnumerable.call(n,t)&&v(e,t,n[t]);return e}function ka(e){let t=e?.target??`draft-2020-12`;return t===`draft-4`&&(t=`draft-04`),t===`draft-7`&&(t=`draft-07`),{processors:e.processors??{},metadataRegistry:e?.metadata??wi,target:t,unrepresentable:e?.unrepresentable??`throw`,override:e?.override??(()=>{}),io:e?.io??`output`,counter:0,seen:new Map,sharedDefsExtractedFor:void 0,sharedEmitDoneFor:void 0,cycles:e?.cycles??`ref`,reused:e?.reused??`inline`,intersections:[],deferred:[],external:e?.external??void 0}}function Aa(e,t,n,r,i){let a=typeof t.unrepresentable==`function`?t.unrepresentable({zodSchema:e,path:r.path,message:i}):t.unrepresentable;if(a===`any`)return!1;if(a===void 0||a===`throw`)throw Error(i);return Object.assign(n,a),!0}function L(e,t,n={path:[],schemaPath:[]}){var r;let i=e._zod.def,a=t.seen.get(e);if(a)return a.count++,n.schemaPath.includes(e)&&(a.cycle=n.path),a.schema;let o={schema:{},count:1,cycle:void 0,path:n.path};t.seen.set(e,o),t.sharedDefsExtractedFor=void 0,t.sharedEmitDoneFor=void 0;let s=e._zod.toJSONSchema?.();if(s)o.schema=s;else{let r={...n,schemaPath:[...n.schemaPath,e],path:n.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,o.schema,r);else{let n=o.schema,a=t.processors[i.type];if(!a)throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);a(e,t,n,r)}let a=e._zod.parent;a&&(o.ref||=a,L(a,t,r),t.seen.get(a).isParent=!0)}let c=t.metadataRegistry.get(e);return c&&Oa(o.schema,c),t.io===`input`&&Ba(e)&&(delete o.schema.examples,delete o.schema.default),t.io===`input`&&`_prefault`in o.schema&&((r=o.schema).default??(r.default=o.schema._prefault)),delete o.schema._prefault,t.seen.get(e).schema}function ja(e){return e.replace(/~/g,`~0`).replace(/\//g,`~1`)}function Ma(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);if(e.external&&e.sharedDefsExtractedFor===e.external)return;let r=new Map;for(let t of e.seen.entries()){let n=e.metadataRegistry.get(t[0])?.id;if(n){let e=r.get(n);if(e&&e!==t[0])throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);r.set(n,t[0])}}let i=t=>{let r=e.target===`draft-2020-12`?`$defs`:`definitions`;if(e.external){let n=e.external.registry.get(t[0])?.id,i=e.external.uri??(e=>e);if(n)return{ref:i(n)};let a=t[1].defId??t[1].schema.id??`schema${e.counter++}`;return t[1].defId=a,{defId:a,ref:`${i(`__shared`)}#/${r}/${ja(a)}`}}let i=`#/${r}/`;if(t[1]===n&&!t[1].schema.id)return{ref:`#`};let a=t[1].schema.id??`__schema${e.counter++}`;return{defId:a,ref:i+ja(a)}},a=e=>{if(e[1].schema.$ref)return;let t=e[1],{ref:n,defId:r}=i(e);t.def={...t.schema},r&&(t.defId=r);let a=t.schema;for(let e in a)delete a[e];a.$ref=n};if(e.cycles===`throw`)for(let t of e.seen.entries()){let e=t[1];if(e.cycle)throw Error(`Cycle detected: #/${e.cycle?.join(`/`)}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(let n of e.seen.entries()){let r=n[1];if(t===n[0])a(n);else{if(e.external){let r=e.external.registry.get(n[0])?.id;if(t!==n[0]&&r){a(n);continue}}(e.metadataRegistry.get(n[0])?.id||r.cycle||r.count>1&&e.reused===`ref`)&&a(n)}}e.external&&(e.sharedDefsExtractedFor=e.external)}function Na(e){let t=e.anyOf;if(!Array.isArray(t)||t.length===0||e.type!==void 0)return;let n=[];for(let e of t){if(!e||typeof e!=`object`)return;Na(e);let t=Object.keys(e);if(t.length!==1||t[0]!==`type`)return;let r=e.type;for(let e of Array.isArray(r)?r:[r]){if(typeof e!=`string`)return;n.includes(e)||n.push(e)}}delete e.anyOf,e.type=n.length===1?n[0]:n}var Pa=new Set([`type`,`properties`,`required`,`additionalProperties`]),Fa=[`oneOf`,`anyOf`];function Ia(e){let t=e.additionalProperties;return t===void 0||t===!1||typeof t!=`object`||!t?null:Object.keys(t).length?t:null}function La(e){let t=[];for(let n of e){if(typeof n!=`object`||n.type!==`object`)return null;for(let e in n)if(!Pa.has(e))return null;t.push(n)}let n={},r=new Set;for(let e of t){for(let r in e.properties){if(Object.prototype.hasOwnProperty.call(n,r))continue;let e=[];for(let n of t){let t=n.properties?.[r]??Ia(n);t!=null&&(e.some(e=>JSON.stringify(e)===JSON.stringify(t))||e.push(t))}v(n,r,e.length===1?e[0]:La(e)??{allOf:e})}for(let t of e.required??[])r.add(t)}let i={type:`object`,properties:n};if(r.size&&(i.required=[...r]),t.every(e=>e.additionalProperties===!1))i.additionalProperties=!1;else{let e=[];for(let n of t){let t=Ia(n);t&&!e.some(e=>JSON.stringify(e)===JSON.stringify(t))&&e.push(t)}e.length===1?i.additionalProperties=e[0]:e.length>1&&(i.additionalProperties={allOf:e})}return i}function Ra(e){let t=e.allOf;if(!Array.isArray(t)||t.length<2)return;for(let t of Pa)if(t in e)return;let n=t.filter(e=>Fa.some(t=>Array.isArray(e[t]))),r=null;if(!n.length)r=La(t);else{let e=n[0],i=Fa.find(t=>Array.isArray(e[t]));if(Object.keys(e).length!==1)return;let a=t.filter(t=>t!==e),o=e[i].map(e=>La([...a,e]));if(o.some(e=>!e))return;r={[i]:o}}r&&(delete e.allOf,Oa(e,r))}function za(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);let r=t=>{let n=e.seen.get(t);if(n.ref===null)return;let i=n.def??n.schema,a={...i},o=n.ref;if(n.ref=null,o){r(o);let n=e.seen.get(o),s=n.schema;if(s.$ref&&(e.target===`draft-07`||e.target===`draft-04`||e.target===`openapi-3.0`)?(i.allOf=i.allOf??[],i.allOf.push(s)):Oa(i,s),Oa(i,a),t._zod.parent===o)for(let e in i)e!==`$ref`&&e!==`allOf`&&(e in a||delete i[e]);if(s.$ref&&n.def)for(let e in i)e!==`$ref`&&e!==`allOf`&&e in n.def&&JSON.stringify(i[e])===JSON.stringify(n.def[e])&&delete i[e]}let s=t._zod.parent;if(s&&s!==o){r(s);let t=e.seen.get(s);if(t?.schema.$ref&&(i.$ref=t.schema.$ref,t.def))for(let e in i)e!==`$ref`&&e!==`allOf`&&e in t.def&&JSON.stringify(i[e])===JSON.stringify(t.def[e])&&delete i[e]}e.override({zodSchema:t,jsonSchema:i,path:n.path??[]})};if(!e.external||e.sharedEmitDoneFor!==e.external){for(let t of[...e.seen.entries()].reverse())r(t[0]);if(e.target!==`openapi-3.0`)for(let t of e.seen.entries())Na(t[1].def??t[1].schema);for(let t of e.deferred)t();if(e.intersections.length){let t=new Map;for(let n of e.seen.values())for(let e of[n.schema,n.def]){let n=e?.allOf;if(!Array.isArray(n))continue;let r=t.get(n);r?r.push(e):t.set(n,[e])}for(let n of e.intersections)for(let e of t.get(n)??[])Ra(e)}}let i={};if(e.target===`draft-2020-12`?i.$schema=`https://json-schema.org/draft/2020-12/schema`:e.target===`draft-07`?i.$schema=`http://json-schema.org/draft-07/schema#`:e.target===`draft-04`?i.$schema=`http://json-schema.org/draft-04/schema#`:e.target,e.external?.uri){let n=e.external.registry.get(t)?.id;if(!n)throw Error("Schema is missing an `id` property");i.$id=e.external.uri(n)}Oa(i,n.defId?n.schema:n.def??n.schema);let a=e.metadataRegistry.get(t)?.id;a!==void 0&&i.id===a&&delete i.id;let o=e.external?.defs??{};if(!e.external||e.sharedEmitDoneFor!==e.external)for(let t of e.seen.entries()){let e=t[1];e.def&&e.defId&&(e.def.id===e.defId&&delete e.def.id,v(o,e.defId,e.def))}e.external&&(e.sharedEmitDoneFor=e.external),e.external||Object.keys(o).length>0&&(e.target===`draft-2020-12`?i.$defs=o:i.definitions=o);try{let n=JSON.parse(JSON.stringify(i));return Object.defineProperty(n,"~standard",{value:{...t[`~standard`],jsonSchema:{input:Ha(t,`input`,e.processors),output:Ha(t,`output`,e.processors)}},enumerable:!1,writable:!1}),n}catch{throw Error(`Error converting schema to JSON.`)}}function Ba(e,t){let n=t??{seen:new Set};if(n.seen.has(e))return!1;n.seen.add(e);let r=e._zod.def;if(r.type===`transform`)return!0;if(r.type===`array`)return Ba(r.element,n);if(r.type===`set`)return Ba(r.valueType,n);if(r.type===`lazy`)return Ba(r.getter(),n);if(r.type===`promise`||r.type===`optional`||r.type===`nonoptional`||r.type===`nullable`||r.type===`readonly`||r.type==="default"||r.type===`prefault`||r.type===`catch`)return Ba(r.innerType,n);if(r.type===`intersection`)return Ba(r.left,n)||Ba(r.right,n);if(r.type===`record`||r.type===`map`)return Ba(r.keyType,n)||Ba(r.valueType,n);if(r.type===`pipe`)return e._zod.traits.has(`$ZodCodec`)?!0:Ba(r.in,n)||Ba(r.out,n);if(r.type===`object`){for(let e in r.shape)if(Ba(r.shape[e],n))return!0;return!1}if(r.type===`union`){for(let e of r.options)if(Ba(e,n))return!0;return!1}if(r.type===`tuple`){for(let e of r.items)if(Ba(e,n))return!0;return!!(r.rest&&Ba(r.rest,n))}return!1}var Va=(e,t={})=>n=>{let r=ka({...n,processors:t});return L(e,r),Ma(r,e),za(r,e)},Ha=(e,t,n={})=>r=>{let{libraryOptions:i,target:a}=r??{},o=ka({...i??{},target:a,io:t,processors:n});return L(e,o),Ma(o,e),za(o,e)},Ua=(e,t,n)=>{(e[t]===void 0||n>e[t])&&(e[t]=n)},Wa=(e,t,n)=>{(e[t]===void 0||n<e[t])&&(e[t]=n)},Ga=(e,t)=>{Ua(e,`minimum`,t),Wa(e,`maximum`,t)},Ka=(e,t)=>{e.multipleOf??=[],e.multipleOf.includes(t)||e.multipleOf.push(t)},qa=(e,t)=>{e.patterns??=new Set,e.patterns.add(t)},Ja=(e,t)=>{e.mime=e.mime?e.mime.filter(e=>t.includes(e)):[...t]},Ya=(e,t)=>{e.format=t,t.includes(`int`)&&(e.isInt=!0)},Xa=(e,t)=>Ua(e,`minimum`,t.minimum),Za=(e,t)=>Wa(e,`maximum`,t.maximum),Qa=e=>(t,n)=>{Ya(t,n.format);let[r,i]=e[n.format];Ua(t,`minimum`,r),Wa(t,`maximum`,i)},$a={greater_than:(e,t)=>Ua(e,t.inclusive?`minimum`:`exclusiveMinimum`,t.value),less_than:(e,t)=>Wa(e,t.inclusive?`maximum`:`exclusiveMaximum`,t.value),multiple_of:(e,t)=>Ka(e,t.value),number_format:Qa(M),bigint_format:Qa(se),min_length:Xa,max_length:Za,length_equals:(e,t)=>Ga(e,t.length),min_size:Xa,max_size:Za,size_equals:(e,t)=>Ga(e,t.size),string_format:(e,t)=>{Ya(e,t.format),t.pattern&&qa(e,t.pattern),(t.format===`base64`||t.format===`base64url`)&&(e.contentEncoding=t.format),(t.local||t.precision===-1)&&(e.laxFormat=!0)},mime_type:(e,t)=>Ja(e,t.mime)};function eo(e){let t={},n=e._zod.def,r=e._zod.traits.has(`$ZodCheck`)?[e,...n.checks??[]]:n.checks??[];for(let e of r)$a[e._zod.def.check]?.(t,e._zod.def);let i=e._zod.bag;i.minimum!==void 0&&Ua(t,`minimum`,i.minimum),i.exclusiveMinimum!==void 0&&Ua(t,`exclusiveMinimum`,i.exclusiveMinimum),i.maximum!==void 0&&Wa(t,`maximum`,i.maximum),i.exclusiveMaximum!==void 0&&Wa(t,`exclusiveMaximum`,i.exclusiveMaximum),i.multipleOf!==void 0&&Ka(t,i.multipleOf),i.format!==void 0&&(t.format??=i.format,i.format.includes(`int`)&&(t.isInt=!0)),i.mime&&Ja(t,i.mime);for(let e of i.patterns??[])qa(t,e);return t}var to={guid:`uuid`,url:`uri`,datetime:`date-time`,json_string:`json-string`,regex:``},no=new Map([[rr,Bt],[ar,Vt]]),ro=e=>no.get(e)??e,io=(e,t,n,r)=>{let i=n;i.type=`string`;let{minimum:a,maximum:o,format:s,patterns:c,contentEncoding:l,laxFormat:u}=eo(e);if(typeof a==`number`&&(i.minLength=a),typeof o==`number`&&(i.maxLength=o),s&&(i.format=to[s]??s,i.format===``&&delete i.format,(s===`time`||u)&&delete i.format),l&&(i.contentEncoding=l),c&&c.size>0){let e=[...c].map(ro);e.length===1?i.pattern=e[0].source:e.length>1&&(i.allOf=[...e.map(e=>({...t.target===`draft-07`||t.target===`draft-04`||t.target===`openapi-3.0`?{type:`string`}:{},pattern:e.source}))])}},ao=(e,t,n,r)=>{let i=n,{minimum:a,maximum:o,multipleOf:s,exclusiveMaximum:c,exclusiveMinimum:l,isInt:u}=eo(e);i.type=u?`integer`:`number`;let d=typeof l==`number`&&l>=(a??-1/0),f=typeof c==`number`&&c<=(o??1/0),p=t.target===`draft-04`||t.target===`openapi-3.0`;if(d?p?(i.minimum=l,i.exclusiveMinimum=!0):i.exclusiveMinimum=l:typeof a==`number`&&(i.minimum=a),f?p?(i.maximum=c,i.exclusiveMaximum=!0):i.exclusiveMaximum=c:typeof o==`number`&&(i.maximum=o),s){let n=new Set;for(let a of s)Number.isFinite(a)&&a!==0?n.add(Math.abs(a)):Aa(e,t,i,r,`A multipleOf divisor of ${a} cannot be represented in JSON Schema`);let[a,...o]=n;a!==void 0&&(i.multipleOf=a),o.length&&(i.allOf=[...i.allOf??[],...o.map(e=>({multipleOf:e}))])}},oo=(e,t,n,r)=>{n.type=`boolean`},so=(e,t,n,r)=>{n.not={}},co=(e,t,n,r)=>{let i=e._zod.def,a=u(i.entries);a.length===0?n.not={}:(a.every(e=>typeof e==`number`)&&(n.type=`number`),a.every(e=>typeof e==`string`)&&(n.type=`string`),n.enum=a)},lo=(e,t,n,r)=>{let i=e._zod.def;if(i.values.length===0){n.not={};return}let a=[];for(let o of i.values)if(o===void 0){if(Aa(e,t,n,r,"Literal `undefined` cannot be represented in JSON Schema"))return}else if(typeof o==`bigint`){if(Aa(e,t,n,r,`BigInt literals cannot be represented in JSON Schema`))return;a.push(Number(o))}else a.push(o);if(a.length!==0){if(a.length===1){let e=a[0];n.type=e===null?`null`:typeof e,t.target===`draft-04`||t.target===`openapi-3.0`?n.enum=[e]:n.const=e}else a.every(e=>typeof e==`number`)&&(n.type=`number`),a.every(e=>typeof e==`string`)&&(n.type=`string`),a.every(e=>typeof e==`boolean`)&&(n.type=`boolean`),a.every(e=>e===null)&&(n.type=`null`),n.enum=a}},uo=(e,t,n,r)=>{Aa(e,t,n,r,`Custom types cannot be represented in JSON Schema`)},fo=(e,t,n,r)=>{Aa(e,t,n,r,`Transforms cannot be represented in JSON Schema`)},po=(e,t,n,r)=>{let i=n,a=e._zod.def,{minimum:o,maximum:s}=eo(e);typeof o==`number`&&(i.minItems=o),typeof s==`number`&&(i.maxItems=s),i.type=`array`,i.items=L(a.element,t,{...r,path:[...r.path,`items`]})};function mo(e){let t=e._zod.def;return t.type===`pipe`&&t.in._zod.traits.has(`$ZodTransform`)?mo(t.out):t.type===`catch`?mo(t.innerType):e._zod.optin}var ho=(e,t,n,r)=>{let i=n,a=e._zod.def,o=a.shape;if(Object.getOwnPropertySymbols(o).length&&Aa(e,t,i,r,`Symbol keys cannot be represented in JSON Schema`))return;i.type=`object`,i.properties={};for(let e in o)v(i.properties,e,L(o[e],t,{...r,path:[...r.path,`properties`,e]}));let s=[];for(let e of Object.keys(o)){let n=a.shape[e];(t.io===`input`?mo(n)===void 0:n._zod.optout===void 0)&&s.push(e)}s.length>0&&(i.required=s),a.catchall?._zod.def.type===`never`?i.additionalProperties=!1:a.catchall?a.catchall&&(i.additionalProperties=L(a.catchall,t,{...r,path:[...r.path,`additionalProperties`]})):t.io===`output`&&(i.additionalProperties=!1)},go=(e,t,n,r)=>{let i=e._zod.def,a=i.inclusive===!1,o=i.options.map((e,n)=>L(e,t,{...r,path:[...r.path,a?`oneOf`:`anyOf`,n]}));a?n.oneOf=o:n.anyOf=o},_o=(e,t,n,r)=>{let i=e._zod.def,a=L(i.left,t,{...r,path:[...r.path,`allOf`,0]}),o=L(i.right,t,{...r,path:[...r.path,`allOf`,1]}),s=e=>`allOf`in e&&Object.keys(e).length===1,c=[...s(a)?a.allOf:[a],...s(o)?o.allOf:[o]];n.allOf=c,t.intersections.push(c)},vo=(e,t,n,r)=>{let i=n,a=e._zod.def;i.type=`array`;let o=t.target===`draft-2020-12`?`prefixItems`:`items`,s=t.target===`draft-2020-12`||t.target===`openapi-3.0`?`items`:`additionalItems`,c=a.items.map((e,n)=>L(e,t,{...r,path:[...r.path,o,n]})),l=a.rest?L(a.rest,t,{...r,path:[...r.path,s,...t.target===`openapi-3.0`?[a.items.length]:[]]}):null,u=a.items.length;for(;u>0;){let e=a.items[u-1];if(!(t.io===`input`?mo(e)!==void 0:e._zod.optout===`optional`))break;u--}let d=a.items.length,f=!a.rest;t.target===`draft-2020-12`?(i.prefixItems=c,f?i.items=!1:l&&(i.items=l),u>0&&(i.minItems=u),f&&(i.maxItems=d)):t.target===`openapi-3.0`?(i.items={anyOf:c},l&&i.items.anyOf.push(l),u>0&&(i.minItems=u),f&&(i.maxItems=d)):(i.items=c,f?i.additionalItems=!1:l&&(i.additionalItems=l),u>0&&(i.minItems=u),f&&(i.maxItems=d));let{minimum:p,maximum:m}=eo(e);typeof p==`number`&&(i.minItems=p),typeof m==`number`&&(i.maxItems=m)};function yo(e,t,n){if(t.$ref){if(n.has(t))return t;n.add(t);let r=e.get(t)?.def;if(!r)return t;let i=yo(e,r,n);return i===r?t:i}for(let r of[`anyOf`,`oneOf`]){let i=t[r];if(!Array.isArray(i))continue;let a=i.map(t=>yo(e,t,n));a.some((e,t)=>e!==i[t])&&(t={...t,[r]:a})}let r=Array.isArray(t.type)?t.type:[t.type],i=!r.includes(`string`)&&r.some(e=>e===`number`||e===`integer`),a=t.enum??(t.const===void 0?void 0:[t.const]);if(!i&&!a?.some(e=>typeof e==`number`))return t;let{minimum:o,maximum:s,exclusiveMinimum:c,exclusiveMaximum:l,multipleOf:u,format:d,id:f,...p}=t;return p.enum?p.enum=p.enum.map(e=>typeof e==`number`?String(e):e):typeof p.const==`number`&&(p.const=String(p.const)),i&&(p.type=`string`,a||(p.pattern=(r.includes(`number`)?Qt:Zt).source)),p}var bo=new WeakMap;function xo(e){let t=new Map;for(let n of e.seen.values())n.def&&!t.has(n.schema)&&t.set(n.schema,n);let n=new Map;for(let r of bo.get(e)??[]){let i=e.seen.get(r),a=(i?.def??i?.schema)?.propertyNames;if(!a||a===!0||n.has(a))continue;let o=yo(t,a,new Set);o!==a&&n.set(a,o)}if(n.size)for(let t of e.seen.values())for(let e of[t.schema,t.def]){let t=e&&n.get(e.propertyNames);t&&(e.propertyNames=t)}}var So=(e,t,n,r)=>{let i=n,a=e._zod.def;i.type=`object`;let o=a.keyType,s=eo(o).patterns;if(a.mode===`loose`&&s&&s.size>0){let e=L(a.valueType,t,{...r,path:[...r.path,`patternProperties`,`*`]});i.patternProperties={};for(let t of s)v(i.patternProperties,ro(t).source,e)}else{if(t.target===`draft-07`||t.target===`draft-2020-12`){i.propertyNames=L(a.keyType,t,{...r,path:[...r.path,`propertyNames`]});let n=bo.get(t);n||(n=[],bo.set(t,n),t.deferred.push(()=>xo(t))),n.push(e)}i.additionalProperties=L(a.valueType,t,{...r,path:[...r.path,`additionalProperties`]})}let c=o._zod.values,l=t.io===`input`&&mo(a.valueType)!==void 0;if(c&&!a.partial&&!l){let e=[...c].filter(e=>typeof e==`string`||typeof e==`number`);e.length>0&&(i.required=e.map(String))}},Co=(e,t,n,r)=>{let i=e._zod.def,a=L(i.innerType,t,r),o=t.seen.get(e);t.target===`openapi-3.0`?(o.ref=i.innerType,n.nullable=!0):n.anyOf=[a,{type:`null`}]},wo=(e,t,n,r)=>{let i=e._zod.def;L(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},To=Symbol();function Eo(e,t,n,r,i){let a=!1,o=JSON.stringify(e,(e,t)=>typeof t==`bigint`?(a=!0,null):t);return a?(Aa(t,n,r,i,`BigInt defaults cannot be represented in JSON Schema`),To):JSON.parse(o)}var Do=(e,t,n,r)=>{let i=e._zod.def;L(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o=Eo(i.defaultValue,e,t,n,r);o!==To&&(n.default=o)},Oo=(e,t,n,r)=>{let i=e._zod.def;L(i.innerType,t,r);let a=t.seen.get(e);if(a.ref=i.innerType,t.io!==`input`)return;let o=Eo(i.defaultValue,e,t,n,r);o!==To&&(n._prefault=o)},ko=(e,t,n,r)=>{let i=e._zod.def;L(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o;try{o=i.catchValue(void 0)}catch{Aa(e,t,n,r,`Dynamic catch values are not supported in JSON Schema`);return}n.default=o},Ao=(e,t,n,r)=>{let i=e._zod.def,a=i.in._zod.traits.has(`$ZodTransform`),o=t.io===`input`?a?i.out:i.in:i.out;L(o,t,r);let s=t.seen.get(e);s.ref=o},jo=(e,t,n,r)=>{let i=e._zod.def;L(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType,n.readOnly=!0},Mo=(e,t,n,r)=>{let i=e._zod.def;L(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},No=new WeakSet([Object.prototype,Error.prototype]);function Po(e,t,n){Object.defineProperty(e,t,{configurable:!0,enumerable:!1,get(){let e=n(this);return Object.defineProperty(this,t,{value:e,configurable:!0,writable:!0}),e},set(e){Object.defineProperty(this,t,{value:e,configurable:!0,writable:!0})}})}var Fo=P(`ZodError`,(e,t)=>{et.init(e,t),e.name=`ZodError`;let n=Object.getPrototypeOf(e);No.has(n)||(No.add(n),Po(n,`format`,e=>t=>rt(e,t)),Po(n,`flatten`,e=>t=>nt(e,t)),Po(n,`addIssue`,e=>t=>{e.issues.push(t),e.message=JSON.stringify(e.issues,f,2)}),Po(n,`addIssues`,e=>t=>{e.issues.push(...t),e.message=JSON.stringify(e.issues,f,2)}),Object.defineProperty(n,"isEmpty",{configurable:!0,enumerable:!1,get(){return this.issues.length===0}}))},void 0,{Parent:Error}),Io=at(Fo),Lo=ot(Fo),Ro=st(Fo),zo=lt(Fo),Bo=ht(Fo),Vo=gt(Fo),Ho=_t(Fo),Uo=vt(Fo),Wo=yt(Fo),Go=bt(Fo),Ko=xt(Fo),qo=St(Fo);function Jo(){qe.localeError||Je(bi())}function Yo(){qe.memoizer||Je({memoizer:_i()})}var R=P(`ZodType`,(e,t)=>(Jo(),F.init(e,t),e.def=t,e.type=t.type,e),{check(...e){let t=this.def;return this.clone(T(t,{checks:[...t.checks??[],...e.map(e=>typeof e==`function`?{_zod:{check:e,def:{check:`custom`},onattach:[]}}:e)]}),{parent:!0})},with(...e){return this.check(...e)},clone(e,t){return A(this,e,t)},brand(){return this},register(e,t){return e.add(this,t),this},refine(e,t){return this.check(uc(e,t))},superRefine(e,t){return this.check(dc(e,t))},overwrite(e){return this.check(va(e))},optional(){return Ks(this)},exactOptional(){return Js(this)},nullable(){return Xs(this)},nullish(){return Ks(Xs(this))},nonoptional(e){return nc(this,e)},array(){return H(this)},or(e){return Ns([this,e])},and(e){return Fs(this,e)},transform(e){return oc(this,Ws(e))},default(e){return Qs(this,e)},prefault(e){return ec(this,e)},catch(e){return ic(this,e)},pipe(e){return oc(this,e)},readonly(){return cc(this)},describe(e){let t=this.clone();return wi.add(t,{description:e}),t},meta(...e){if(e.length===0)return wi.get(this);let t=this.clone();return wi.add(t,e[0]),t},isOptional(){return this.safeParse(void 0).success},isNullable(){return this.safeParse(null).success},apply(e,...t){return t.length===0?e(this):e(this,...t)},get"~standard"(){return je(this,`~standard`,{...Tn(this),jsonSchema:{input:Ha(this,`input`),output:Ha(this,`output`)}})},set"~standard"(e){Ae(this,`~standard`,e)},parse:function e(t,n){return Io(this,t,n,{callee:e})},parseAsync:async function e(t,n){return await Lo(this,t,n,{callee:e})},safeParse(e,t){return Ro(this,e,t)},async safeParseAsync(e,t){return zo(this,e,t)},get spa(){return this?.safeParseAsync},set spa(e){Ae(this,`spa`,e)},validate(e,t){return ft(this,e,t)},validateAsync(e,t){return mt(this,e,t)},encode:function e(t,n){return Bo(this,t,n,{callee:e})},decode:function e(t,n){return Vo(this,t,n,{callee:e})},encodeAsync:async function e(t,n){return await Ho(this,t,n,{callee:e})},decodeAsync:async function e(t,n){return await Uo(this,t,n,{callee:e})},safeEncode(e,t){return Wo(this,e,t)},safeDecode(e,t){return Go(this,e,t)},async safeEncodeAsync(e,t){return Ko(this,e,t)},async safeDecodeAsync(e,t){return qo(this,e,t)},toJSONSchema(e){return Va(this,{})(e)},get description(){return wi.get(this)?.description},get _def(){return this._zod.def}}),Xo=P(`_ZodString`,(e,t)=>{En.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>io(e,t,n,r)},Me({format:e=>eo(e).format??null,minLength:e=>eo(e).minimum??null,maxLength:e=>eo(e).maximum??null},{regex(...e){return this.check(fa(...e))},includes(...e){return this.check(ha(...e))},startsWith(...e){return this.check(ga(...e))},endsWith(...e){return this.check(_a(...e))},min(...e){return this.check(ua(...e))},max(...e){return this.check(la(...e))},length(...e){return this.check(da(...e))},nonempty(...e){return this.check(ua(1,...e))},lowercase(e){return this.check(pa(e))},uppercase(e){return this.check(ma(e))},trim(){return this.check(ba())},normalize(...e){return this.check(ya(...e))},toLowerCase(){return this.check(xa())},toUpperCase(){return this.check(Sa())},slugify(){return this.check(Ca())}})),Zo=P(`ZodString`,(e,t)=>{En.init(e,t),Xo.init(e,t)},{email(e){return this.check(Di(ns,e))},url(e){return this.check(Ni(as,e))},jwt(e){return this.check(Ji(bs,e))},emoji(e){return this.check(Pi(os,e))},guid(e){return this.check(Oi(rs,e))},uuid(e){return this.check(ki(is,e))},uuidv4(e){return this.check(Ai(is,e))},uuidv6(e){return this.check(ji(is,e))},uuidv7(e){return this.check(Mi(is,e))},nanoid(e){return this.check(Fi(ss,e))},cuid(e){return this.check(Ii(cs,e))},cuid2(e){return this.check(Li(ls,e))},ulid(e){return this.check(Ri(us,e))},base64(e){return this.check(Gi(_s,e))},base64url(e){return this.check(Ki(vs,e))},xid(e){return this.check(zi(ds,e))},ksuid(e){return this.check(Bi(fs,e))},ipv4(e){return this.check(Vi(ps,e))},ipv6(e){return this.check(Hi(ms,e))},cidrv4(e){return this.check(Ui(hs,e))},cidrv6(e){return this.check(Wi(gs,e))},e164(e){return this.check(qi(ys,e))},datetime(e){return this.check(Yi(Qo,e))},date(e){return this.check(Xi($o,e))},time(e){return this.check(Zi(es,e))},duration(e){return this.check(Qi(ts,e))}});function z(e){return Ei(Zo,e)}var B=P(`ZodStringFormat`,(e,t)=>{I.init(e,t),Xo.init(e,t)}),Qo=P(`ZodISODateTime`,(e,t)=>{Gn.init(e,t),B.init(e,t)}),$o=P(`ZodISODate`,(e,t)=>{Kn.init(e,t),B.init(e,t)}),es=P(`ZodISOTime`,(e,t)=>{qn.init(e,t),B.init(e,t)}),ts=P(`ZodISODuration`,(e,t)=>{Jn.init(e,t),B.init(e,t)}),ns=P(`ZodEmail`,(e,t)=>{kn.init(e,t),B.init(e,t)}),rs=P(`ZodGUID`,(e,t)=>{Dn.init(e,t),B.init(e,t)}),is=P(`ZodUUID`,(e,t)=>{On.init(e,t),B.init(e,t)}),as=P(`ZodURL`,(e,t)=>{Ln.init(e,t),B.init(e,t)}),os=P(`ZodEmoji`,(e,t)=>{Rn.init(e,t),B.init(e,t)}),ss=P(`ZodNanoID`,(e,t)=>{zn.init(e,t),B.init(e,t)}),cs=P(`ZodCUID`,(e,t)=>{Bn.init(e,t),B.init(e,t)}),ls=P(`ZodCUID2`,(e,t)=>{Vn.init(e,t),B.init(e,t)}),us=P(`ZodULID`,(e,t)=>{Hn.init(e,t),B.init(e,t)}),ds=P(`ZodXID`,(e,t)=>{Un.init(e,t),B.init(e,t)}),fs=P(`ZodKSUID`,(e,t)=>{Wn.init(e,t),B.init(e,t)}),ps=P(`ZodIPv4`,(e,t)=>{Yn.init(e,t),B.init(e,t)}),ms=P(`ZodIPv6`,(e,t)=>{Qn.init(e,t),B.init(e,t)}),hs=P(`ZodCIDRv4`,(e,t)=>{$n.init(e,t),B.init(e,t)}),gs=P(`ZodCIDRv6`,(e,t)=>{tr.init(e,t),B.init(e,t)}),_s=P(`ZodBase64`,(e,t)=>{ir.init(e,t),B.init(e,t)}),vs=P(`ZodBase64URL`,(e,t)=>{sr.init(e,t),B.init(e,t)}),ys=P(`ZodE164`,(e,t)=>{cr.init(e,t),B.init(e,t)}),bs=P(`ZodJWT`,(e,t)=>{ur.init(e,t),B.init(e,t)}),xs=P(`ZodNumber`,(e,t)=>{dr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ao(e,t,n,r),e.isFinite=!0},Me({minValue:e=>{let{minimum:t,exclusiveMinimum:n}=eo(e);return Math.max(t??-1/0,n??-1/0)},maxValue:e=>{let{maximum:t,exclusiveMaximum:n}=eo(e);return Math.min(t??1/0,n??1/0)},isInt:e=>{let{isInt:t,multipleOf:n}=eo(e);return!!t||!!n?.some(Number.isSafeInteger)},format:e=>eo(e).format??null},{gt(e,t){return this.check(oa(e,t))},gte(e,t){return this.check(sa(e,t))},min(e,t){return this.check(sa(e,t))},lt(e,t){return this.check(ia(e,t))},lte(e,t){return this.check(aa(e,t))},max(e,t){return this.check(aa(e,t))},int(e){return this.check(Cs(e))},safe(e){return this.check(Cs(e))},positive(e){return this.check(oa(0,e))},nonnegative(e){return this.check(sa(0,e))},negative(e){return this.check(ia(0,e))},nonpositive(e){return this.check(aa(0,e))},multipleOf(e,t){return this.check(ca(e,t))},step(e,t){return this.check(ca(e,t))},finite(){return this}}));function V(e){return $i(xs,e)}var Ss=P(`ZodNumberFormat`,(e,t)=>{fr.init(e,t),xs.init(e,t)});function Cs(e){return ea(Ss,e)}var ws=P(`ZodBoolean`,(e,t)=>{pr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>oo(e,t,n,r)});function Ts(e){return ta(ws,e)}var Es=P(`ZodUnknown`,(e,t)=>{mr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(e,t,n)=>void 0});function Ds(){return na(Es)}var Os=P(`ZodNever`,(e,t)=>{hr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>so(e,t,n,r)});function ks(e){return ra(Os,e)}var As=P(`ZodArray`,(e,t)=>{Yo(),yr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>po(e,t,n,r),e.element=t.element},{min(e,t){return this.check(ua(e,t))},nonempty(e){return this.check(ua(1,e))},max(e,t){return this.check(la(e,t))},length(e,t){return this.check(da(e,t))},unwrap(){return this.element}});function H(e,t){return wa(As,e,t)}var js=P(`ZodObject`,(e,t)=>{Yo(),Tr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ho(e,t,n,r),Re(e,`shape`,e=>e._zod.def.shape,!1)},{keyof(){return W(Object.keys(this._zod.def.shape))},catchall(e){return this.clone(T(this._zod.def,{catchall:e}))},passthrough(){return this.clone(T(this._zod.def,{catchall:Ds()}))},loose(){return this.clone(T(this._zod.def,{catchall:Ds()}))},strict(){return this.clone(T(this._zod.def,{catchall:ks()}))},strip(){return this.clone(T(this._zod.def,{catchall:void 0}))},extend(e){return de(this,e)},safeExtend(e){return pe(this,e)},merge(e){return me(this,e)},pick(e){return ce(this,e)},omit(e){return ue(this,e)},partial(...e){return he(Gs,this,e[0])},exactPartial(...e){return he(qs,this,e[0],`exactPartial`)},required(...e){return ge(tc,this,e[0])}});function U(e,t){return new js({type:`object`,shape:e??{},...j(t)})}var Ms=P(`ZodUnion`,(e,t)=>{Dr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>go(e,t,n,r),e.options=t.options});function Ns(e,t){return new Ms({type:`union`,options:e,...j(t)})}var Ps=P(`ZodIntersection`,(e,t)=>{Or.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>_o(e,t,n,r)});function Fs(e,t){return new Ps({type:`intersection`,left:e,right:t})}var Is=P(`ZodTuple`,(e,t)=>{Yo(),jr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>vo(e,t,n,r)},{rest(e){return this.clone({...this._zod.def,rest:e})},partial(){let e=this._zod.def;if(e.checks?.length)throw Error(`.partial() cannot be used on tuple schemas containing refinements`);return this.clone({...e,items:e.items.map(e=>new Gs({type:`optional`,innerType:e}))})}});function Ls(e,t,n){let r=t instanceof F;return new Is({type:`tuple`,items:e,rest:r?t:null,...j(r?n:t)})}var Rs=P(`ZodRecord`,(e,t)=>{Yo(),Fr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>So(e,t,n,r),e.keyType=t.keyType,e.valueType=t.valueType});function zs(e,t,n){return!t||!t._zod?new Rs({type:`record`,keyType:z(),valueType:e,...j(t)}):new Rs({type:`record`,keyType:e,valueType:t,...j(n)})}var Bs=P(`ZodEnum`,(e,t)=>{Ir.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>co(e,t,n,r),e.enum=t.entries,e.options=[...e._zod.values];let n=new Set(Object.keys(t.entries));e.extract=(e,r)=>{let i={};for(let r of e)if(n.has(r))i[r]=t.entries[r];else throw Error(`Key ${r} not found in enum`);return new Bs({...t,checks:[],...j(r),entries:i})},e.exclude=(e,r)=>{let i={...t.entries};for(let t of e)if(n.has(t))delete i[t];else throw Error(`Key ${t} not found in enum`);return new Bs({...t,checks:[],...j(r),entries:i})}});function W(e,t){return new Bs({type:`enum`,entries:Array.isArray(e)?Object.fromEntries(e.map(e=>[e,e])):e,...j(t)})}var Vs=P(`ZodLiteral`,(e,t)=>{Lr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>lo(e,t,n,r),e.values=new Set(t.values),Object.defineProperty(e,"value",{get(){if(t.values.length>1)throw Error("This schema contains multiple valid literal values. Use `.values` instead.");return t.values[0]}})});function Hs(e,t){return new Vs({type:`literal`,values:Array.isArray(e)?e:[e],...j(t)})}var Us=P(`ZodTransform`,(e,t)=>{Yo(),Rr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>fo(e,t,n,r),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new Ke(e.constructor.name);n.addIssue=r=>{if(typeof r==`string`)n.issues.push(Oe(r,n.value,t));else{let t=r;t.fatal&&(t.continue=!1),t.code??=`custom`,`input`in t||(t.input=n.value),t.inst??=e,n.issues.push(Oe(t))}};let i=t.transform(n.value,n);return i instanceof Promise?i.then(e=>(n.value=e,n)):(n.value=i,n)}});function Ws(e){return new Us({type:`transform`,transform:e})}var Gs=P(`ZodOptional`,(e,t)=>{Br.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Mo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Ks(e){return new Gs({type:`optional`,innerType:e})}var qs=P(`ZodExactOptional`,(e,t)=>{Vr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Mo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Js(e){return new qs({type:`optional`,innerType:e})}var Ys=P(`ZodNullable`,(e,t)=>{Hr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Co(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Xs(e){return new Ys({type:`nullable`,innerType:e})}var Zs=P(`ZodDefault`,(e,t)=>{Ur.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Do(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function Qs(e,t){return new Zs({type:`default`,innerType:e,get defaultValue(){return typeof t==`function`?t():re(t)}})}var $s=P(`ZodPrefault`,(e,t)=>{Gr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Oo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function ec(e,t){return new $s({type:`prefault`,innerType:e,get defaultValue(){return typeof t==`function`?t():re(t)}})}var tc=P(`ZodNonOptional`,(e,t)=>{Kr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>wo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function nc(e,t){return new tc({type:`nonoptional`,innerType:e,...j(t)})}var rc=P(`ZodCatch`,(e,t)=>{Yr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ko(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function ic(e,t){return new rc({type:`catch`,innerType:e,catchValue:typeof t==`function`?t:Be(t)})}var ac=P(`ZodPipe`,(e,t)=>{Xr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Ao(e,t,n,r),e.in=t.in,e.out=t.out});function oc(e,t){return new ac({type:`pipe`,in:e,out:t})}var sc=P(`ZodReadonly`,(e,t)=>{Qr.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>jo(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function cc(e){return new sc({type:`readonly`,innerType:e})}var lc=P(`ZodCustom`,(e,t)=>{ei.init(e,t),R.init(e,t),e._zod.processJSONSchema=(t,n,r)=>uo(e,t,n,r)});function uc(e,t={}){return Ta(lc,e,t)}function dc(e,t){return Ea(e,t)}var fc=W([`switch`,`router`,`compute-node`,`mini-pc`,`sbc`,`nas`,`patch-panel`,`pdu`,`ups`,`modular-carrier`,`brush-panel`,`blanking-panel`,`blank-panel`,`shelf`,`keystone-module`]).describe(`Primary functional category of the hardware unit.`),pc=W([`rackmount-19`,`rackmount-10`,`rackmount-6`,`sub-module`,`shelf-standing`]).describe(`Physical form factor and mounting mechanism.`),mc=W([`included-19inch-ears`,`included-10inch-ears`,`included-6inch-ears`,`flush-front`,`recessed-20mm`,`sub-module-clip`,`rear-rail-mount`,`none`]).describe(`Mounting ear geometry relative to the vertical rack rails.`),hc=W([`consumer`,`pse-switch`,`pdu`,`ups`,`passive`]).describe(`Role in the electrical and PoE Directed Acyclic Graph (DAG).`),gc=W([`front-to-rear`,`rear-to-front`,`side-to-side`,`passive-convection`,`none`]).describe(`Primary thermal airflow path through the device chassis.`),_c=W([`front`,`rear`]).describe(`Mounting or port face relative to the rack or chassis.`),vc=W([`rj45`,`rj45-serial-console`,`sfp-plus`,`iec-c13`,`iec-c14`,`schuko-cee7`,`dc-5525`,`usb-c`,`usb-a`,`audio-35mm`]).describe(`Physical connector interface type.`),yc=W(`100base-tx,1000base-t,2500base-t,5gbase-t,10gbase-t,10gbase-sr,10gbase-lr,10gbase-dac,25gbase-dac,poe-out,poe+,poe-out-af,poe-out-at,poe-out-bt-type3,poe-out-bt-type4,poe-in-af,poe-in-at,poe-in-bt-type3,poe-in-bt-type4,ac-mains,dc-power,usb-pd,usb-3.0,usb-3.1,audio-analog,serial-rs232,passthrough-coupler`.split(`,`)).describe(`Supported electrical, optical, or PoE protocol capability.`),bc=W([`input`,`output`,`bidirectional`]).describe(`Signal or electrical power flow direction.`),xc=W([`upright`,`inverted`,`left`,`right`]).describe(`Physical orientation of the connector latch/keyway.`),Sc=U({x_mm:V().min(-2e3).max(2e3).describe(`Horizontal offset in mm from the bottom-left corner of the face.`),y_mm:V().min(-3e3).max(3e3).describe(`Vertical offset in mm from the bottom-left corner of the face.`),orientation:xc.default(`upright`)}).describe(`Local 2D coordinates on the device face in millimeters.`),Cc=U({port_id:z().min(1).max(128).describe(`Unique identifier of the port within the device.`),label:z().min(1).max(160).describe(`Human-readable silk-screened port label.`),face:_c,connector_type:vc,direction:bc,capabilities:H(yc).max(32).default([]).describe(`Electrical, optical, or PoE capabilities supported by this port.`),coordinates:Sc,is_passthrough_coupler:Ts().optional().describe(`True if this port is a passive front-to-rear feedthrough coupler.`)}).describe(`Explicit physical port definition with local millimeter coordinates.`),wc=U({origin_x_mm:V().min(-2e3).max(2e3).describe(`X coordinate of the first port (column 0) in mm.`),origin_y_mm:V().min(-3e3).max(3e3).describe(`Y coordinate of the first port (row 0) in mm.`),columns:V().int().positive().max(64).describe(`Number of horizontal port columns in the matrix (1..64).`),rows:V().int().positive().max(16).describe(`Number of vertical port rows in the matrix (1..16).`),pitch_x_mm:V().min(-500).max(500).describe(`Horizontal center-to-center spacing between adjacent columns in mm.`),pitch_y_mm:V().min(-500).max(500).describe(`Vertical center-to-center spacing between adjacent rows in mm.`)}).describe(`2D grid layout parameters for automatic port matrix expansion.`),Tc=U({id_prefix:z().min(1).max(64).describe(`Prefix for generated port_id values (e.g. "eth").`),label_prefix:z().max(96).optional().describe(`Prefix for generated human-readable labels.`),start_index:V().int().nonnegative().max(1e4).default(1).describe(`Starting numeric suffix for generated port IDs (default: 1).`),count:V().int().positive().max(128).describe(`Total number of ports to generate in this group (1..128).`),face:_c,connector_type:vc,direction:bc,capabilities:H(yc).max(32).default([]).describe(`Capabilities assigned to every port generated by this group.`),orientation:xc.default(`upright`),is_passthrough_coupler:Ts().optional().describe(`True if generated ports are passive front-to-rear couplers.`),grid:wc}).describe(`Declarative port matrix macro expanded into flat PortDefinition items on load.`),Ec=U({u_height:V().nonnegative().max(60).describe(`Nominal height in Rack Units (1U = 44.45mm, max 60U).`),width_mm:V().positive().max(1e3).describe(`Physical chassis body width in millimeters (max 1000mm).`),height_mm:V().positive().max(3e3).describe(`Physical chassis height in millimeters (max 3000mm).`),depth_mm:V().positive().max(2e3).describe(`Physical chassis depth in millimeters along the Z-axis (max 2000mm).`),ear_mount_style:mc.default(`flush-front`),front_protrusion_mm:V().nonnegative().max(500).default(0).describe(`Protrusion in front of Z=0 (handles, ears, knobs) in mm.`),rear_protrusion_mm:V().nonnegative().max(500).default(0).describe(`Protrusion behind depth_mm (fans, PSU handles) in mm.`),weight_grams:V().nonnegative().max(5e5).default(0).describe(`Total device mass in grams for Center of Gravity calculation.`),has_cable_pass_through:Ts().optional().describe(`True if cables can pass front-to-rear through this unit.`)}).describe(`Physical 3D bounding dimensions and mass specification.`),Dc=U({electrical_role:hc,idle_watts:V().nonnegative().max(1e5).default(0).describe(`Idle power draw in watts.`),max_system_watts:V().nonnegative().max(1e5).default(0).describe(`Peak own system power consumption in watts (excluding PoE output).`),poe_budget_watts:V().nonnegative().max(1e5).optional().describe(`Maximum total PoE output power budget in watts for PSE switches.`),ups_capacity_watts:V().positive().max(1e5).optional().describe(`Maximum output load capacity in watts for UPS units.`),ups_battery_wh:V().positive().max(1e5).optional().describe(`Usable battery energy capacity in Watt-hours (Wh) for UPS runtime estimation.`),pdu_capacity_watts:V().positive().max(1e5).optional().describe(`Maximum output load capacity in watts for PDU units.`),airflow:gc.default(`passive-convection`),noise_db_a:V().nonnegative().max(200).optional().describe(`Acoustic noise emission in dB(A) at 1 meter distance.`)}).describe(`Electrical power consumption, PoE budget, thermal airflow, and acoustic dB(A) characteristics.`),Oc=U({x:V().min(-2e3).max(2e3).describe(`Local X offset from carrier origin in mm.`),y:V().min(-3e3).max(3e3).describe(`Local Y offset from carrier origin in mm.`),z:V().min(-2e3).max(2e3).default(0).describe(`Local Z offset from carrier origin in mm.`)}).describe(`Local 3D offset of a sub-module slot relative to its parent carrier.`),kc=U({width:V().positive().max(2e3).describe(`Maximum allowed child width in mm.`),height:V().positive().max(3e3).describe(`Maximum allowed child height in mm.`),depth:V().positive().max(2e3).describe(`Maximum allowed child depth in mm.`)}).describe(`Maximum internal bounding dimensions of a carrier slot in mm.`),Ac=U({slot_id:z().min(1).max(100).describe(`Unique slot identifier within the carrier.`),accepted_slot_type:z().min(1).max(100).describe(`Required child slot_compatibility token (e.g. "mini-pc-1liter").`),offset_mm:Oc,max_dimensions_mm:kc}).describe(`Sub-U carrier bay specification for modular child devices.`),jc=W([`matte-black-steel`,`coated-aluminum`,`3d-printed-petg`,`3d-printed-abs`,`polycarbonate`]).describe(`Surface material shader preset for 3D procedural rendering.`),Mc=U({chassis_color_hex:z().regex(/^#[0-9A-Fa-f]{6}$/).default(`#E5E7EB`).describe(`Primary chassis hex color code.`),material_preset:jc.default(`matte-black-steel`),has_oled_display:Ts().default(!1).describe(`True if the front panel includes a status OLED screen.`),stl_mesh_path:z().max(512).nullable().default(null).describe(`Optional relative path to custom 3D mesh (.stl/.glb).`)}).describe(`Visual rendering metadata for 2D SVG and 3D WebGL pipelines.`),Nc=U({filament_grams:V().nonnegative().max(5e4).describe(`Estimated filament mass in grams.`),material_recommendation:z().max(128).default(`PETG`).describe(`Recommended 3D printing filament material (e.g. "PETG", "ABS", "ASA").`),heat_set_inserts:z().max(256).optional().describe(`Optional specification of required brass heat-set inserts.`),fasteners:z().max(256).optional().describe(`Optional specification of required mounting screws and cage nuts.`),printables_url:z().url().max(512).regex(/^https?:\/\//i,`Reference URL must use http:// or https://`).optional().describe(`Optional HTTPS reference URL to an upstream 3D model repository.`)}).nullable().default(null).describe(`3D printing fabrication metadata for printable modular carriers.`),Pc=U({slug:z().min(1).max(100).regex(/^[a-z0-9-]+$/,`Hardware slug must be lowercase kebab-case`).describe(`Unique lowercase kebab-case hardware identifier (vendor-model-variant).`),manufacturer:z().min(1).max(160).describe(`Hardware manufacturer name.`),model:z().min(1).max(160).describe(`Hardware model name or part number.`),description:z().max(2e3).optional().describe(`Human-readable explanation of what the device is, its role in the rack, and its physical mounting method (e.g. native rack ears vs. 3D-printed carrier/cradle).`),category:fc,mount_type:pc,slot_compatibility:z().max(100).optional().describe(`Slot compatibility token when mount_type is "sub-module".`),is_passthrough_coupler:Ts().optional().describe(`True if the entire unit acts as a passive front-to-rear feedthrough patch panel.`),geometry:Ec,power_and_thermal:Dc,port_groups:H(Tc).max(16).default([]).describe(`Optional repeating port grid macros expanded into flat ports[] upon registration.`),ports:H(Cc).max(256).default([]).describe(`Explicit physical ports with local face millimeter coordinates.`),slots:H(Ac).max(32).default([]).describe(`Sub-module carrier bays when mount_type is "modular-carrier".`),visuals:Mc.default({chassis_color_hex:`#E5E7EB`,material_preset:`matte-black-steel`,has_oled_display:!1,stl_mesh_path:null}),printable_metadata:Nc,estimated_price_eur:V().nonnegative().max(1e6).optional().describe(`Optional indicative street price in EUR for BOM hardware budget estimation.`)}).describe(`Complete hardware catalog blueprint specification.`),Fc=W([`19inch`,`10inch`,`6inch`]).describe(`EIA-310-D or homelab rack width standard.`),Ic=W([`open-frame`,`closed-glass-front`,`closed-vented-front`]).describe(`Physical rack enclosure style governing front door clearance checks.`),Lc=U({standard:Fc,u_height:V().int().positive().max(60).describe(`Total vertical rack capacity in Rack Units (U / HE, 1..60).`),rail_depth_mm:V().positive().max(2e3).describe(`Distance from front mounting rail face (Z=0) to rear mounting rail face in mm (max 2000mm).`),enclosure_type:Ic.default(`open-frame`),front_door_clearance_mm:V().nonnegative().max(1e3).default(45).describe(`Available clearance in front of Z=0 before hitting the front door in mm.`),rear_clearance_mm:V().nonnegative().max(1e3).default(40).describe(`Available clearance behind Z=rail_depth_mm in mm.`)}).describe(`Physical rack frame dimensions and enclosure configuration.`),Rc=U({instance_id:z().min(1).max(100).describe(`Unique project-wide instance identifier for the child device.`),blueprint_slug:z().min(1).max(100).describe(`Hardware catalog blueprint slug for the child sub-module.`),slot_id:z().min(1).max(100).describe(`Target slot_id inside the parent modular carrier.`),hostname:z().max(160).optional().describe(`Optional logical hostname or label.`)}).describe(`Sub-module device mounted inside a specific slot of a parent carrier.`),zc=U({instance_id:z().min(1).max(100).describe(`Unique project-wide instance identifier for the mounted equipment.`),blueprint_slug:z().min(1).max(100).describe(`Hardware catalog blueprint slug.`),u_position:V().int().positive().max(60).describe(`Lowest 1-indexed Rack Unit (U) occupied by this device.`),face:_c.default(`front`),hostname:z().max(160).optional().describe(`Optional logical hostname or label.`),children:H(Rc).max(32).default([]).describe(`Child sub-modules mounted inside this carrier.`)}).describe(`Equipment mounted directly onto a rack unit.`),Bc=U({instance_id:z().min(1).max(100).describe(`Target device instance_id (top-level or child sub-module).`),port_id:z().min(1).max(128).describe(`Target port_id on the device.`),face:_c.optional().describe(`Explicit rack face selector (used to distinguish front vs rear connections on passthrough couplers).`)}).describe(`Source or destination port endpoint of a physical cable.`),Vc=W([`cat6a`,`cat6a-angled`,`cat6`,`cat6-angled`,`cat5e`,`cat5e-angled`,`sfp-plus-dac`,`sfp-plus-dac-angled`,`fiber-lc-duplex`,`fiber-lc-duplex-angled`,`rj45-serial-rollover`,`rj45-serial-rollover-angled`,`power-c13-c14`,`power-c13-c14-angled`,`power-schuko-c13`,`power-schuko-c13-angled`,`power-dc-5525`,`power-dc-5525-angled`,`power-usb-c`,`power-usb-c-angled`]).describe(`Standardized physical cable and connector assembly type.`),Hc=W([`shortest-direct`,`left-duct`,`right-duct`]).default(`shortest-direct`).describe(`Physical cable routing strategy: shortest-direct (default collision-free L/C-route minimizing cable length and bends) or explicit side-duct detour (left-duct / right-duct) when requested by the user.`),Uc=U({cable_id:z().min(1).max(128).describe(`Unique identifier for the cable connection.`),from:Bc,to:Bc,cable_type:Vc,color_hex:z().regex(/^#[0-9A-Fa-f]{6}$/).default(`#3B82F6`).describe(`Hex color code for 2D/3D cable visualization.`),label:z().max(240).optional().describe(`Optional cable label or circuit tag.`),vlan_id:V().int().min(1).max(4094).optional().describe(`Optional IEEE 802.1Q primary VLAN ID carried on this link (1..4094).`),ip_cidr:z().max(64).optional().describe(`Optional IPv4/IPv6 subnet or interface CIDR annotation (e.g. "10.10.20.0/24").`),preferred_portal_u:V().int().positive().max(60).optional().describe(`Optional 1-indexed U hint for front-to-rear cable portal routing.`),routing_mode:Hc.optional().describe(`Optional routing strategy override: defaults to shortest-direct (shortest collision-free path); set to left-duct or right-duct only when the user explicitly requests routing via a side cable duct.`)}).describe(`Point-to-point physical cable connection between two ports.`),Wc=W([`poe-camera`,`wifi-ap`,`wall-outlet-pc`,`projector-media`,`workstation-dock`,`iot-controller`,`isp-wan-uplink`,`other-lan`]).describe(`Physical category of an external building or room drop entering the rack from outside.`),Gc=W([`top-rear`,`bottom-rear`]).default(`top-rear`).describe(`Rear building cable conduit entry point into the rack frame.`),Kc=W([`100m`,`1gbe`,`2.5gbe`,`10gbe`]).default(`1gbe`).describe(`Required Ethernet link speed for the external room/device drop.`),qc=U({endpoint_id:z().min(1).max(100).describe(`Unique project-wide identifier for the external building/room drop (e.g., "cam-01", "ap-eg-01", "room-office-pc").`),label:z().min(1).max(200).describe(`Human-readable label shown on cable badges and patching instructions (e.g., "Kamera 1 – Einfahrt", "Büro – Workstation").`),category:Wc.default(`other-lan`),room_or_zone:z().max(160).optional().describe(`Optional building zone or room name (e.g., "Außenbereich", "EG Wohnzimmer", "OG Büro", "Heimkino").`),poe_draw_watts:V().nonnegative().max(200).default(0).describe(`Required PoE power draw in watts (0 for non-PoE LAN drops; e.g., 9W for PoE camera, 18W for Wi-Fi 7 AP).`),required_speed:Kc,entry_position:Gc,patch_panel_instance_id:z().min(1).max(100).describe(`Target patch panel instance_id where the incoming building cable is punched down on the rear face.`),patch_panel_port_id:z().min(1).max(128).describe(`Target port_id on the patch panel rear face (e.g., "p1" .. "p24").`),color_hex:z().regex(/^#[0-9A-Fa-f]{6}$/).default(`#38BDF8`).describe(`Hex color code for the external cable drop and its front patch guide.`),vlan_id:V().int().min(1).max(4094).optional().describe(`Optional IEEE 802.1Q VLAN ID assigned to this room/device drop (1..4094).`),notes:z().max(1e3).optional().describe(`Optional user-facing installation note.`)}).describe(`External building/house cable drop entering from outside the rack and terminating on the rear of a patch panel (consuming 0U of rack space).`),Jc=U({schema_version:Hs(`1.0`).default(`1.0`),project_name:z().min(1).max(160).describe(`Human-readable name of the rack layout project.`),rack:Lc,mounted_devices:H(zc).max(120).default([]),cables:H(Uc).max(512).default([]),external_endpoints:H(qc).max(256).default([]).describe(`External building/room cable drops (PoE cameras, Wi-Fi APs, room wall outlets) entering from the rear conduit onto a patch panel.`)}).describe(`Root declarative Rack-as-Code state schema (rack.yaml).`),Yc=W([`ERROR`,`WARNING`,`INFO`]).describe(`Severity level of the engineering constraint diagnostic.`),Xc=W([`CHASSIS_COLLISION`,`PLUG_CLEARANCE_COLLISION`,`FRONT_DOOR_COLLISION`,`SLOT_DIMENSION_OVERFLOW`,`SLOT_INCOMPATIBLE`,`OUT_OF_RACK_BOUNDS`,`BLUEPRINT_NOT_FOUND`,`PORT_NOT_FOUND`,`PORT_ALREADY_OCCUPIED`,`CONNECTOR_INCOMPATIBLE`,`SIGNAL_PROTOCOL_INCOMPATIBLE`,`SPEED_MISMATCH`,`POE_BUDGET_EXCEEDED`,`POE_CLASS_EXCEEDED`,`UPS_OVERLOAD`,`UNPOWERED_DEVICE`,`TOP_HEAVY_RACK`,`NO_FRONT_TO_REAR_PORTAL`,`THERMAL_AIRFLOW_CONFLICT`,`THERMAL_HOTSPOT_STACKING`,`ACOUSTIC_NOISE_HIGH`]).describe(`Machine-readable deterministic validation diagnostic code.`),Zc=U({action_type:W([`move_device`,`change_cable_type`,`connect_power`,`disconnect_cable`,`redistribute_poe`,`add_portal_gap`,`change_rack_depth`]).describe(`Recommended self-correction operation category.`),target_instance_id:z().optional().describe(`Device instance_id targeted by this remediation action.`),target_cable_id:z().optional().describe(`Cable connection cable_id targeted by this remediation action.`),suggested_u_positions:H(V().int().positive()).optional().describe(`Candidate 1-indexed U positions that resolve the spatial conflict.`),suggested_face:_c.optional(),suggested_cable_type:z().optional().describe(`Suggested replacement cable_type (e.g. angled plug or higher speed grade).`),description:z().describe(`Human- and agent-readable explanation of the remediation step.`)}).describe(`Structured self-correction action for autonomous agent remediation.`),Qc=U({code:Xc,severity:Yc,stage:V().int().min(1).max(5).optional().describe(`Validation pipeline stage (1..5) that produced this finding.`),affected_instances:H(z()).describe(`Device instance IDs involved in this diagnostic issue.`),u_range:Ls([V().int(),V().int()]).optional().describe(`Inclusive [start_u, end_u] range where the issue occurs.`),message:z().describe(`Detailed engineering explanation with exact millimeter/watt figures.`),remediation_suggestions:H(z()).min(1).describe(`Actionable self-correction instructions for the calling LLM agent.`),remediation_actions:H(Zc).optional().describe(`Optional machine-actionable remediation descriptors.`)}).describe(`Single validation finding with deterministic self-correction feedback.`),$c=U({pse_instance_id:z().describe(`Instance ID of the PoE Power Sourcing Equipment (PSE) switch.`),poe_budget_watts:V().describe(`Maximum rated PoE output power budget of the switch in watts.`),consumed_poe_watts:V().describe(`Total PoE power drawn by connected Powered Devices (PDs) in watts.`),remaining_poe_watts:V().describe(`Remaining available PoE power budget in watts (negative if overloaded).`),downstream_devices:H(z()).describe(`Instance or endpoint IDs of downstream PoE consumers powered by this switch.`)}).describe(`PoE budget utilization breakdown for a single PSE switch.`),el=U({source_instance_id:z().describe(`Instance ID of the upstream PDU or UPS unit.`),role:W([`pdu`,`ups`]).describe(`Electrical source classification ("pdu" or "ups").`),capacity_watts:V().describe(`Maximum rated output capacity of the power source in watts.`),total_load_watts:V().describe(`Cumulative downstream system and PoE load in watts.`),utilization_percent:V().describe(`Percentage of rated watt capacity consumed (0..100+).`),battery_wh:V().positive().optional().describe(`Usable UPS battery energy capacity in Watt-hours (Wh).`),estimated_runtime_minutes_peak:V().nonnegative().optional().describe(`Estimated UPS backup runtime in minutes at peak connected load (85% inverter efficiency).`),estimated_runtime_minutes_typical:V().nonnegative().optional().describe(`Estimated UPS backup runtime in minutes at typical continuous load (85% inverter efficiency).`)}).describe(`Load and capacity summary for a mounted PDU or UPS unit.`),tl=U({status:W([`VALID`,`INVALID`]).describe(`Overall rack validation state ("VALID" when error_count is 0).`),is_valid:Ts().describe(`True when zero ERROR-level diagnostic issues exist.`),error_count:V().int().nonnegative().describe(`Total number of blocking ERROR diagnostics.`),warning_count:V().int().nonnegative().describe(`Total number of non-blocking WARNING diagnostics.`),issues:H(Qc).describe(`List of all detected ERROR, WARNING, and INFO diagnostic issues.`),power_summary:U({total_system_watts:V().describe(`Total peak system power draw across all mounted equipment in watts.`),total_idle_watts:V().nonnegative().default(0).describe(`Total baseline idle system power draw across all mounted equipment in watts.`),total_poe_watts:V().describe(`Total PoE power draw across all connected PoE devices and external drops in watts.`),annual_energy_kwh_typical:V().nonnegative().default(0).describe(`Estimated annual energy consumption in kWh/year at typical continuous load (8760h/yr).`),estimated_ups_runtime_minutes:V().nonnegative().nullable().default(null).describe(`Minimum estimated UPS backup runtime in minutes at typical load across mounted UPS units, or null if no UPS is mounted.`),estimated_hardware_budget_eur:V().nonnegative().default(0).describe(`Sum of indicative hardware street prices in EUR across mounted devices with pricing metadata.`),pse_budgets:H($c).describe(`Per-switch PoE budget utilization breakdown.`),power_sources:H(el).describe(`Per-PDU and per-UPS electrical load breakdown.`),unpowered_active_instances:H(z()).describe(`Active device instance IDs missing a valid AC, DC, USB-C, or PoE power input.`)}).describe(`Aggregated electrical and PoE DAG power analysis.`),mechanical_summary:U({total_weight_grams:V().describe(`Total mass of all mounted equipment in grams.`),center_of_gravity_y_mm:V().describe(`Vertical Center of Gravity height from bottom of U1 in millimeters.`),normalized_cog_y:V().describe(`Normalized vertical Center of Gravity ratio (0.0 = bottom, 1.0 = top; keep <= 0.50).`),available_portal_u_positions:H(V().int()).describe(`1-indexed U slots that allow front-to-rear cable pass-through (open U or brush panel).`),total_thermal_btu_hr:V().default(0).describe(`Total peak thermal dissipation in BTU/hr (1W = 3.41214 BTU/hr).`),combined_noise_db_a:V().default(0).describe(`Logarithmic sum of acoustic noise emissions in dB(A) across all mounted devices.`),airflow_profile:W([`uniform-front-to-rear`,`uniform-passive`,`hybrid-active-passive`,`mixed-conflict`]).default(`uniform-passive`).describe(`Rack-wide thermal airflow regime classification.`)}).describe(`Aggregated mechanical mass, center of gravity, thermal BTU/hr, and acoustic dB(A) metrics.`)}).describe(`Complete 5-stage deterministic validation report.`),nl=.001;function G(e){return Math.round((e+2**-52)*1e4)/1e4}function K(e){return Math.round((e+2**-52)*100)/100}function q(e){return Math.round((e+2**-52)*10)/10}function rl(e){let t=[],n=e.label_prefix??e.id_prefix;for(let r=0;r<e.count;r++){let i=e.start_index+r,a=r%e.grid.columns,o=Math.floor(r/e.grid.columns),s=G(e.grid.origin_x_mm+a*e.grid.pitch_x_mm),c=G(e.grid.origin_y_mm+o*e.grid.pitch_y_mm),l={port_id:`${e.id_prefix}${i}`,label:`${n}${i}`,face:e.face,connector_type:e.connector_type,direction:e.direction,capabilities:[...e.capabilities],coordinates:{x_mm:s,y_mm:c,orientation:e.orientation},...e.is_passthrough_coupler===void 0?{}:{is_passthrough_coupler:e.is_passthrough_coupler}};t.push(l)}return t}function il(e){let t=Pc.parse(e),n=new Map;for(let e of t.port_groups){let t=rl(e);for(let e of t)n.set(e.port_id,e)}for(let e of t.ports)n.set(e.port_id,e);return{...t,ports:Array.from(n.values())}}var al=W([`rackmount-19`,`rackmount-10`,`rackmount-6`,`sub-module`,`shelf-standing`,`10inch`,`19inch`,`6inch`]).describe(`Hardware form factor or mounting mechanism filter.`),ol=U({query:z().max(200).optional().describe(`Optional case-insensitive substring filter matching slug, manufacturer, or model name (omit to match all).`),form_factor:al.optional().describe(`Primary rack width or mounting form-factor filter (shorthands "10inch", "19inch", and "6inch" match both direct rackmount equipment and modular carriers of that width).`),mount_type:al.optional().describe(`Optional alias for form_factor to filter by physical mounting style ("rackmount-10", "rackmount-19", "rackmount-6", "sub-module", or "shelf-standing"); combined with logical AND if both are provided.`),category:fc.optional().describe(`Functional hardware category filter (e.g., "switch", "router", "ups", "pdu", "patch-panel", "modular-carrier", "mini-pc", "sbc").`),max_depth_mm:V().positive().max(2e3).optional().describe(`Maximum allowed chassis depth in millimeters (inclusive upper bound).`),min_poe_budget_watts:V().nonnegative().max(1e5).optional().describe(`Minimum required PSE PoE output power budget in watts (inclusive lower bound).`),accepted_slot_type:z().min(1).max(100).optional().describe(`Sub-module slot compatibility token matching either a sub-module slot_compatibility or a carrier slot accepted_slot_type (e.g., "mini-pc-1liter", "sbc-rpi5", "standard-keystone").`)}),sl=U({slug:z().min(1).max(100).describe(`Exact lowercase kebab-case hardware catalog blueprint slug to retrieve (discoverable via search_catalog).`)}),cl=U({blueprint:Pc.describe(`Complete custom hardware blueprint specification; ports may be defined via explicit ports[], repeating port_groups[] macros, or both.`)}),ll=U({project_name:z().min(1).max(160).default(`Rack Project`).describe(`Human-readable project name stored in rack.yaml.`),standard:Fc.describe(`Mechanical rack width standard ("19inch" = 482.6mm, "10inch" = 254.0mm, "6inch" = 152.4mm).`),u_height:V().int().positive().max(60).describe(`Total usable vertical rack height in Rack Units (1U = 44.45mm, 1..60U).`),rail_depth_mm:V().positive().max(2e3).describe(`Front-to-rear mounting rail depth in millimeters along the Z-axis (max 2000mm).`),enclosure_type:Ic.default(`open-frame`).describe(`Enclosure door style ("open-frame", "closed-glass-front", or "closed-vented-front").`),front_door_clearance_mm:V().nonnegative().max(1e3).default(45).describe(`Available clearance in millimeters between front mounting rails (Z=0) and a closed front door.`),rear_clearance_mm:V().nonnegative().max(1e3).default(40).describe(`Available clearance in millimeters behind the rear mounting rails (Z=rail_depth_mm) for power plugs and bending radii.`)}),ul=U({instance_id:z().min(1).max(100).describe(`Unique project-wide instance identifier for this mounted device (e.g., "ups-u1", "sw-core-01").`),blueprint_slug:z().min(1).max(100).describe(`Catalog or custom hardware blueprint slug to instantiate.`),hostname:z().max(160).optional().describe(`Optional logical hostname or display label shown in elevations and schematics.`),u_position:V().int().positive().max(60).optional().describe(`1-indexed lowest Rack Unit (U) when mounting directly onto the rack rails (mutually exclusive with parent_carrier_id/slot_id).`),face:_c.optional().default(`front`).describe(`Target rack mounting face ("front" or "rear") for direct rackmount equipment.`),parent_carrier_id:z().max(100).optional().describe(`Mounted parent modular-carrier instance_id when mounting a sub-module (requires slot_id; mutually exclusive with u_position).`),slot_id:z().max(100).optional().describe(`Target bay slot_id inside parent_carrier_id when mounting a sub-module (e.g., "left-bay", "keystone-1").`)}),dl=U({instance_id:z().min(1).max(100).describe(`Existing mounted device or child sub-module instance_id to modify.`),action:W([`move`,`rename`,`remove`]).describe(`Modification operation: "move" relocates a device, "rename" updates its hostname, and "remove" deletes the device instance.`),u_position:V().int().positive().max(60).optional().describe(`New 1-indexed U position when action is "move" on a direct rackmount device (takes precedence over new_u_position).`),new_u_position:V().int().positive().max(60).optional().describe(`Optional alias for u_position when action is "move".`),face:_c.optional().describe(`New mounting face ("front" or "rear") when action is "move" on a rackmount device (takes precedence over new_face).`),new_face:_c.optional().describe(`Optional alias for face when action is "move".`),parent_carrier_id:z().min(1).max(100).optional().describe(`Target parent carrier instance_id when action is "move" on a child sub-module.`),slot_id:z().min(1).max(100).optional().describe(`Target slot_id inside parent_carrier_id when action is "move" on a child sub-module.`),hostname:z().min(1).max(160).optional().describe(`New logical hostname when action is "rename" (takes precedence over new_hostname).`),new_hostname:z().min(1).max(160).optional().describe(`Optional alias for hostname when action is "rename".`),remove_connected_cables:Ts().optional().default(!0).describe(`When action is "remove", whether to automatically disconnect all cables and external endpoints attached to the removed device (default: true).`)}),fl=U({cables:H(Uc).min(1).max(128).describe(`Batch of one or more cable connections to upsert by cable_id, route in 3D, and validate (max 128 per call).`)}),pl=U({cable_ids:H(z().min(1).max(128)).max(512).optional().describe(`Specific cable_id values to disconnect (can be combined with instance_id; at least one of cable_ids or instance_id must be provided).`),instance_id:z().max(100).optional().describe(`Mounted device or modular-carrier instance_id whose attached cables (including child sub-module cables) should all be disconnected.`)}),ml=U({}),hl=U({formats:H(W([`elevation-svg`,`wiring-svg`,`bom-md`,`scene-glb`,`carrier-scad`,`carrier-stl`,`labels-csv`,`labels-svg`])).max(8).default([`elevation-svg`,`wiring-svg`,`bom-md`,`scene-glb`,`carrier-scad`,`carrier-stl`]).describe(`Deliverable formats to generate and write to disk (defaults to the 6 standard CAD/BOM formats; optionally include "labels-csv" or "labels-svg" for printable cable labels, and carrier-scad/carrier-stl emit files when modular carriers are mounted).`),output_dir:z().max(512).optional().describe(`Optional target filesystem directory for generated files in local stdio mode (defaults to the directory of the active rack.yaml file; ignored on hosted remote MCP servers where HTTPS download URLs are returned instead).`)}),gl=U({id_prefix:z().min(1).max(64).optional().describe(`Optional ID prefix for generated endpoints (e.g., "cam", "ap", "room").`),label_prefix:z().min(1).max(160).describe(`Human-readable label prefix (e.g., "Kamera", "WLAN Access Point", "Raum LAN").`),custom_labels:H(z().min(1).max(200)).max(96).optional().describe(`Optional per-item custom labels overriding numbered prefix (e.g., ["Büro – PC", "Heimkino – Beamer", "Studio – Workstation"]).`),category:Wc.default(`other-lan`),room_or_zone:z().max(160).optional().describe(`Building zone or room name (e.g., "Außenbereich", "EG Wohnzimmer", "Wohnräume").`),count:V().int().positive().max(96).default(1).describe(`Number of external cable drops in this group (1..96).`),poe_draw_watts:V().nonnegative().max(200).default(0).describe(`PoE power draw in watts per drop (0 for standard LAN; e.g., 9 for PoE camera, 18 for Wi-Fi AP).`),required_speed:Kc.optional().default(`1gbe`),color_hex:z().regex(/^#[0-9A-Fa-f]{6}$/).optional().describe(`Hex color code for this group of cables (defaults to category color if omitted).`),vlan_id:V().int().min(1).max(4094).optional().describe(`Optional IEEE 802.1Q VLAN ID assigned to this group.`)}),_l=U({endpoint_id:z().min(1).max(100).optional().describe(`Optional explicit endpoint_id (auto-generated if omitted).`),label:z().min(1).max(200).describe(`Human-readable label for this room/device drop (e.g., "Kamera 1 – Einfahrt").`),category:Wc.default(`other-lan`),room_or_zone:z().max(160).optional().describe(`Optional building zone or room name.`),poe_draw_watts:V().nonnegative().max(200).default(0).describe(`Required PoE power draw in watts (0 for non-PoE LAN).`),required_speed:Kc.optional().default(`1gbe`),patch_panel_port_id:z().min(1).max(128).optional().describe(`Optional explicit patch panel port_id (e.g., "p1"); auto-assigned sequentially if omitted.`),color_hex:z().regex(/^#[0-9A-Fa-f]{6}$/).optional().describe(`Optional hex color code for this drop and its front patch cable.`),vlan_id:V().int().min(1).max(4094).optional().describe(`Optional VLAN ID (1..4094).`),notes:z().max(1e3).optional().describe(`Optional installation notes.`)}),vl=U({patch_panel_instance_id:z().min(1).max(100).describe(`Mounted patch panel instance_id whose rear ports receive the incoming building cable drops.`),start_port_number:V().int().positive().max(256).optional().describe(`1-indexed starting port number on the patch panel (defaults to next free rear port or 1).`),entry_position:Gc.optional().default(`top-rear`),groups:H(gl).max(24).optional().describe(`Batch groups of external drops (e.g., 10x PoE cameras, 5x Wi-Fi APs, 5x room LAN outlets).`),endpoints:H(_l).max(128).optional().describe(`Individual external building/room drops to terminate on the rear of the patch panel.`),auto_connect_switch_instance_id:z().min(1).max(100).optional().describe(`Optional switch instance_id to automatically patch from the front of the patch panel using labeled Cat6A cables.`),auto_connect_switch_start_port:V().int().positive().max(256).optional().default(1).describe(`1-indexed starting Ethernet port number on auto_connect_switch_instance_id (e.g., 1 for eth1).`),clear_existing:Ts().optional().default(!1).describe(`If true, destructively clears existing external_endpoints (and their front patch cables) on patch_panel_instance_id before planning.`)}),yl=U({action:W([`undo`,`redo`]).describe(`History traversal direction: "undo" reverts the most recent state mutation, "redo" reapplies a reverted mutation.`)}),bl=U({pin_instance_ids:H(z().min(1).max(100)).max(120).optional().describe(`Optional list of mounted device or child sub-module instance_id values whose current U position and rack face must remain locked during optimization.`)}),xl=W([`VALID`,`INVALID`]).describe(`Deterministic execution outcome: "VALID" when the operation succeeded with 0 validation errors; "INVALID" when precondition or engineering validation errors are present in issues[].`);function Sl(e,t){return U({status:xl,summary:z().describe(`Concise human- and agent-readable summary of the tool result and validation status.`),data:e,issues:H(Qc).describe(`Structured diagnostic findings (ERROR, WARNING, INFO) with actionable remediation_suggestions.`)}).describe(t)}var Cl=U({slug:z().describe(`Unique lowercase kebab-case hardware blueprint slug.`),manufacturer:z().describe(`Hardware manufacturer name.`),model:z().describe(`Hardware model name.`),category:fc,mount_type:pc,u_height:V().describe(`Nominal height in Rack Units (U).`),width_mm:V().describe(`Chassis width in millimeters.`),height_mm:V().describe(`Chassis height in millimeters.`),depth_mm:V().describe(`Chassis depth in millimeters.`),weight_grams:V().describe(`Device mass in grams.`),electrical_role:hc,max_system_watts:V().describe(`Peak system power consumption in watts.`),poe_budget_watts:V().describe(`Available PSE PoE output budget in watts (0 if non-PSE).`),slot_compatibility:z().nullable().describe(`Sub-module slot compatibility token, or null for rackmount equipment.`),slots:H(U({slot_id:z().describe(`Carrier bay slot identifier.`),accepted_slot_type:z().describe(`Accepted child sub-module compatibility token.`),max_dimensions_mm:kc})).describe(`Available carrier bays when mount_type is "modular-carrier".`),port_count:V().int().nonnegative().describe(`Total number of expanded physical ports.`)}).passthrough().describe(`Compact hardware blueprint summary returned by search_catalog.`),wl=Sl(U({count:V().int().nonnegative().describe(`Total number of catalog blueprints matching all supplied filter criteria.`),blueprints:H(Cl).describe(`Matching hardware blueprint summary records.`)}).passthrough().describe(`Catalog search result payload.`),`Structured result of search_catalog containing matching hardware blueprint summaries.`),Tl=Sl(U({blueprint:Pc.optional().describe(`Complete hardware blueprint specification with port_groups pre-expanded into flat ports[].`),requested_slug:z().optional().describe(`Requested slug echoed when lookup fails with BLUEPRINT_NOT_FOUND.`)}).passthrough().describe(`Blueprint lookup result payload.`),`Structured result of get_device_blueprint containing the expanded hardware blueprint or lookup diagnostics.`),El=Sl(U({slug:z().optional().describe(`Registered lowercase kebab-case blueprint slug.`),saved_path:z().nullable().optional().describe(`Absolute filesystem path of the persisted custom blueprint YAML file, or null if in-memory.`),blueprint:Pc.optional().describe(`Registered hardware blueprint with expanded port coordinates.`),validation_errors:H(Ds()).optional().describe(`Schema validation details if the custom blueprint failed parsing.`)}).passthrough().describe(`Custom blueprint registration payload.`),`Structured result of define_custom_blueprint confirming persistence and expanded port geometry.`),Dl=Sl(U({rack:Lc.describe(`Initialized physical rack frame specification.`),geometry:U({total_height_mm:V().describe(`Total vertical mounting height in millimeters (u_height * 44.45).`),rail_depth_mm:V().describe(`Front-to-rear mounting rail depth in millimeters.`),panel_width_mm:V().describe(`Outer mounting ear panel width in millimeters.`),aperture_width_mm:V().describe(`Inner usable rail aperture width in millimeters.`)}).passthrough().describe(`Computed millimeter enclosure dimensions.`),validation:tl.describe(`Initial 5-stage validation report for the newly initialized empty rack.`)}).passthrough().describe(`Rack initialization payload.`),`Structured result of init_rack containing the new rack configuration, millimeter dimensions, and validation status.`),Ol=Sl(U({mounted_device:zs(z(),Ds()).nullable().optional().describe(`Computed 3D world bounding boxes (chassis and plug clearance) and global port coordinates for the mounted device.`),instance_id:z().optional().describe(`Target instance_id echoed when a pre-mount check fails.`),blueprint_slug:z().optional().describe(`Target blueprint_slug echoed when a pre-mount check fails.`),validation:tl.optional().describe(`Updated 5-stage validation report after mounting the device.`)}).passthrough().describe(`Equipment mounting result payload.`),`Structured result of mount_equipment with 3D world geometry and 5-stage validation diagnostics.`),kl=Sl(U({action:W([`move`,`rename`,`remove`]).optional().describe(`Modification operation that was executed.`),instance_id:z().describe(`Target mounted device or sub-module instance_id.`),updated_device:zs(z(),Ds()).nullable().optional().describe(`Updated 3D world geometry of the device, or null if removed.`),removed_cable_ids:H(z()).optional().describe(`Cable IDs automatically disconnected when action is "remove".`),rerouted_cables:H(U({cable_id:z().describe(`Cable connection identifier.`),raw_arc_length_mm:V().describe(`Recalculated 3D spline arc length in mm.`),required_length_mm:V().describe(`Required cable length with slack in mm.`),recommended_commercial_mm:V().describe(`Standard commercial cable length bin in mm.`)}).passthrough()).optional().describe(`Recalculated 3D cable length summaries after moving or removing equipment.`),validation:tl.optional().describe(`Updated 5-stage validation report after the equipment modification.`)}).passthrough().describe(`Equipment modification result payload.`),`Structured result of modify_equipment with updated device geometry, rerouted cable lengths, and validation diagnostics.`),Al=Sl(U({connected_cables:H(U({cable_id:z().describe(`Unique cable identifier.`),cable_type:Vc,route_case:z().describe(`Computed 3D spline routing topology class.`),raw_arc_length_mm:V().describe(`3D Catmull-Rom spline arc length in mm.`),required_length_mm:V().describe(`Required length including slack in mm.`),recommended_commercial_mm:V().describe(`Standard commercial patch cable length bin in mm.`),portal_u:V().nullable().optional().describe(`1-indexed U position of the front-to-rear cable portal if traversed.`),assigned_ducts:H(z()).optional().describe(`Cable ducts traversed along the route.`)}).passthrough()).describe(`Computed 3D spline route metrics and commercial SKU length bins for the connected cables.`),total_cables:V().int().nonnegative().describe(`Total number of active cables in the rack project.`),validation:tl.describe(`Updated 5-stage validation report including port, speed, PoE budget, and plug clearance checks.`)}).passthrough().describe(`Cable connection and 3D routing result payload.`),`Structured result of connect_cables containing 3D cable lengths, commercial length bins, and PoE/clearance diagnostics.`),jl=Sl(U({removed_cable_ids:H(z()).describe(`List of cable_id values that were disconnected.`),remaining_cables_count:V().int().nonnegative().describe(`Total number of cables remaining in the active rack project.`),validation:tl.optional().describe(`Updated 5-stage validation report after cable removal.`)}).passthrough().describe(`Cable disconnection result payload.`),`Structured result of disconnect_cables listing removed cable IDs and updated validation status.`),Ml=Sl(U({added_endpoints_count:V().int().nonnegative().optional().describe(`Number of external building/room cable drops terminated on the patch panel rear ports.`),auto_patched_cables_count:V().int().nonnegative().optional().describe(`Number of front Cat6A patch cables automatically created to the target switch.`),total_external_endpoints:V().int().nonnegative().optional().describe(`Total external endpoints now configured in the rack project.`),patching_guide:H(U({step_number:V().int().positive().describe(`Sequential installation step number.`),endpoint_id:z().describe(`Unique external endpoint identifier.`),label:z().describe(`Human-readable room or device drop label.`),room_or_zone:z().describe(`Building zone or room name.`),poe_draw_watts:V().nonnegative().describe(`PoE power draw in watts for this drop.`),rear_punchdown:z().describe(`Rear patch panel port termination assignment.`),front_patch_cable:z().describe(`Front patch panel to switch port assignment.`),color_hex:z().describe(`Assigned cable hex color code.`)}).passthrough()).optional().describe(`Step-by-step rear punchdown and front switch patching schedule.`),patch_panel_instance_id:z().optional().describe(`Target patch_panel_instance_id echoed when a pre-check fails.`),auto_connect_switch_instance_id:z().optional().describe(`Target auto_connect_switch_instance_id echoed when a pre-check fails.`),validation:tl.optional().describe(`Updated 5-stage validation report including cumulative PoE load from external building drops.`)}).passthrough().describe(`External endpoint planning and auto-patching payload.`),`Structured result of plan_external_endpoints containing the rear punchdown/front patching schedule and PoE validation report.`),Nl=Sl(U({is_valid:Ts().describe(`True when error_count is 0 across all 5 validation stages.`),ascii_elevation:z().describe(`Formatted ASCII front/rear rack elevation diagram, mounted device inventory, and power/PoE summary.`),validation:tl.describe(`Complete 5-stage deterministic validation report with issues and remediation_suggestions.`)}).passthrough().describe(`Rack state inspection and validation result payload.`),`Structured result of validate_rack containing the ASCII front/rear elevation diagram and full 5-stage diagnostic report.`),Pl=Sl(U({output_dir:z().describe(`Resolved absolute directory path where deliverable files were written (or HTTPS base export endpoint when running on a hosted remote MCP server).`),live_viewer_url:z().optional().describe(`Interactive 3D/2D Web-Viewer URL bound live to this remote MCP session (present in hosted remote MCP mode).`),rack_yaml_url:z().optional().describe(`Direct HTTPS download URL for the session rack.yaml source of truth (present in hosted remote MCP mode).`),exported_files:H(U({format:z().describe(`Deliverable format identifier (e.g., "elevation-svg", "carrier-stl").`),path:z().describe(`Absolute filesystem path of the written file (or direct HTTPS download URL in hosted remote MCP mode).`),download_url:z().optional().describe(`Direct HTTPS download URL for this deliverable when connected to a hosted remote MCP server.`),filename:z().optional().describe(`Suggested local filename for saving the deliverable.`),size_bytes:V().int().nonnegative().describe(`Size of the generated deliverable in bytes.`)}).passthrough()).describe(`Metadata for each generated deliverable file or download URL.`),bom_summary:U({mounted_devices_count:V().int().nonnegative().describe(`Total mounted rack devices and carrier sub-modules.`),cables_count:V().int().nonnegative().describe(`Total routed cables.`),total_power_draw_watts:V().nonnegative().describe(`Total peak system power draw in watts.`),total_poe_draw_watts:V().nonnegative().describe(`Total PoE power draw in watts.`),total_poe_budget_watts:V().nonnegative().describe(`Total available PSE PoE budget in watts.`)}).passthrough().describe(`Summary counts and power totals included in the Bill of Materials.`),validation:tl.describe(`Current 5-stage validation report at the time of export.`)}).passthrough().describe(`Deliverable export result payload.`),`Structured result of export_deliverables listing written file paths, byte sizes, BOM summary, and validation status.`),Fl=Sl(U({action:W([`undo`,`redo`]).describe(`History traversal direction that was requested.`),applied:Ts().describe(`True if a history snapshot was restored; false if the target history stack was empty.`),undo_available:V().int().nonnegative().describe(`Number of remaining undo snapshots available in memory.`),redo_available:V().int().nonnegative().describe(`Number of remaining redo snapshots available in memory.`),ascii_elevation:z().describe(`Updated ASCII front/rear rack elevation diagram after history traversal.`),validation:tl.describe(`Updated 5-stage validation report for the restored rack state.`)}).passthrough().describe(`Undo/redo history traversal result payload.`),`Structured result of undo_redo containing stack availability, updated ASCII elevation, and validation status.`),Il=U({instance_id:z().describe(`Top-level mounted rack-unit device or carrier instance_id that was relocated.`),from_u:V().int().positive().describe(`Original 1-indexed U position before optimization.`),to_u:V().int().positive().describe(`Optimized 1-indexed U position after optimization.`),from_face:_c.describe(`Original rack mounting face ("front" or "rear").`),to_face:_c.describe(`Optimized rack mounting face ("front" or "rear").`),reason:z().describe(`Deterministic engineering rationale explaining why this device was relocated.`)}).passthrough().describe(`Relocation record emitted by optimize_rack for a moved top-level device.`),Ll=U({error_count:V().int().nonnegative().describe(`Total blocking validation ERROR diagnostics.`),warning_count:V().int().nonnegative().describe(`Total non-blocking validation WARNING diagnostics.`),normalized_cog_y:V().describe(`Normalized vertical Center of Gravity ratio (0.0 = bottom, 1.0 = top; target <= 0.50).`),total_cable_length_mm:V().nonnegative().describe(`Sum of 3D Catmull-Rom spline arc lengths across all routed cables in millimeters.`)}).passthrough().describe(`Aggregated rack layout quality metrics before or after optimization.`),Rl=Sl(U({improved:Ts().describe(`True when optimization strictly improved the rack layout and relocated at least one device.`),applied:Ts().describe(`True when the optimized layout was committed to rack.yaml and pushed onto the undo stack.`),moved_devices:H(Il).describe(`Top-level mounted devices relocated during optimization with before/after U positions and faces.`),metrics_before:Ll.describe(`Validation error/warning counts, normalized CoG, and total cable length before optimization.`),metrics_after:Ll.describe(`Validation error/warning counts, normalized CoG, and total cable length after optimization.`),ascii_elevation:z().describe(`Updated ASCII front/rear rack elevation diagram after optimization.`),validation:tl.describe(`Complete 5-stage deterministic validation report for the resulting rack layout.`)}).passthrough().describe(`Deterministic rack auto-optimization result payload.`),`Structured result of optimize_rack containing moved device records, before/after metrics, ASCII elevation, and 5-stage validation status.`),zl={search_catalog:{name:`search_catalog`,title:`Search Hardware Blueprint Catalog`,description:`Search and filter the local hardware catalog to discover compatible rackmount devices, modular carriers, and sub-modules before mounting. All supplied filters combine with logical AND: 'form_factor' and its alias 'mount_type' accept width shorthands '10inch', '19inch', and '6inch' that match both direct rackmount gear and modular carriers, 'accepted_slot_type' matches both carrier bays and compatible sub-modules, and 'max_depth_mm' bounds chassis depth excluding plug clearance. Returns all matches from the bounded catalog in one unpaginated response sorted in deterministic registration order, with built-in blueprints followed by custom blueprints. Call with no arguments to list the full catalog; use get_device_blueprint to inspect expanded port coordinates for a known slug, or define_custom_blueprint to register unlisted hardware.`,inputSchema:ol,outputSchema:wl,annotations:{readOnlyHint:!0,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},get_device_blueprint:{name:`get_device_blueprint`,title:`Retrieve Hardware Device Blueprint Details`,description:`Retrieve the complete hardware specification, millimeter port coordinates, electrical and PoE ratings, and carrier slot geometry for a single catalog blueprint. The 'slug' parameter requires a case-sensitive exact match in lowercase kebab-case vendor-model-variant format against the built-in or session custom catalog; partial substrings or uppercase characters do not match. Returns the full blueprint in one unpaginated payload with repeating port_groups pre-expanded into up to 256 flat ports[] entries, or returns status 'INVALID' with a BLUEPRINT_NOT_FOUND issue and candidate slugs instead of throwing. Use when you already know the target slug and need exact port_id or slot_id values for mount_equipment or connect_cables; use search_catalog instead to discover unknown slugs by criteria.`,inputSchema:sl,outputSchema:Tl,annotations:{readOnlyHint:!0,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},define_custom_blueprint:{name:`define_custom_blueprint`,title:`Register Custom Hardware Blueprint`,description:`Validate and register a custom hardware blueprint into the active catalog so unlisted equipment can be mounted. Pass the entire specification inside the top-level 'blueprint' object: 'blueprint.slug' must use lowercase kebab-case, ports may combine explicit 'ports[]' with repeating 'port_groups[]' macros whose coordinates fit strictly within 'blueprint.geometry' without overlapping, and 'slots[]' applies only when 'mount_type' is 'modular-carrier' whereas 'slot_compatibility' applies to 'sub-module'. Persists YAML to the local custom-catalog folder in stdio mode or session memory on remote servers, overwrites same-slug custom entries without touching mounted rack state or undo history, and returns status 'INVALID' instead of throwing on validation errors. Use only after search_catalog confirms hardware is unlisted; use mount_equipment instead to place an already registered blueprint into the rack.`,inputSchema:cl,outputSchema:El,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},init_rack:{name:`init_rack`,title:`Initialize and Reset Rack Enclosure`,description:`Initialize a new rack project and destructively reset the active rack.yaml state to an empty enclosure with the specified width standard, U height, and rail depth. Overwrites the current enclosure and clears all mounted devices, child sub-modules, cables, and external endpoints, while pushing the previous project state onto the in-memory undo stack for recovery via undo_redo. 'project_name' sets the title used in exported schematics and BOMs, 'rail_depth_mm' plus 'rear_clearance_mm' bounds total +Z chassis and rear plug depth before wall collision, and 'front_door_clearance_mm' is enforced only when 'enclosure_type' has a closed front door. Use when starting a rack design from scratch or changing enclosure dimensions; use validate_rack to inspect the current rack, or modify_equipment to move or remove individual devices.`,inputSchema:ll,outputSchema:Dl,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!0,openWorldHint:!1,consequentialHint:!0}},mount_equipment:{name:`mount_equipment`,title:`Mount Equipment into Rack Unit or Carrier Slot`,description:`Mount a new hardware device instance onto a rack unit or into a modular carrier bay in the active rack.yaml project and run 5-stage validation. 'instance_id' must be unique across both top-level devices and nested sub-modules, 'blueprint_slug' must reference an existing catalog or custom slug, and placement uses two mutually exclusive modes: 'u_position' with optional 'face' where the device's full U span fits within 1..u_height, or 'parent_carrier_id' plus a compatible 'slot_id' for sub-modules. Precondition errors such as duplicate 'instance_id', unknown 'blueprint_slug', or missing carriers return status 'INVALID' without mutating state, whereas 3D collision or PoE issues persist the mount, push an undo snapshot, and return remediation_suggestions. Use to add a new device instance; use modify_equipment to move, rename, or remove an existing instance, or plan_external_endpoints for off-rack room cable drops.`,inputSchema:ul,outputSchema:Ol,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!1,openWorldHint:!1}},modify_equipment:{name:`modify_equipment`,title:`Move, Rename, or Remove Mounted Equipment`,description:`Move, rename, or destructively remove an existing mounted device or child sub-module in the active rack, recalculate 3D cable splines, and re-run 5-stage validation. 'instance_id' resolves across top-level devices and carrier sub-modules, and required fields depend on 'action': 'move' updates 'u_position' and 'face' on rackmount gear or 'slot_id' and optional 'parent_carrier_id' across carriers for sub-modules with primary fields taking precedence over 'new_*' aliases, 'rename' updates or clears 'hostname', and 'remove' cascades to child sub-modules plus attached cables and external endpoints when 'remove_connected_cables' is true. Pushes the prior state onto the undo stack and updates rack.yaml atomically, or returns status 'INVALID' without mutating state when 'instance_id' or a target carrier is unknown. Use to update or delete a mounted instance; use mount_equipment to add new hardware, or disconnect_cables to remove cables while keeping devices mounted.`,inputSchema:dl,outputSchema:kl,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!1,openWorldHint:!1,consequentialHint:!0}},connect_cables:{name:`connect_cables`,title:`Connect and Route Inter-Device Cables`,description:`Connect or update a batch of up to 128 power and network cables between mounted device ports in the active rack, computing 3D Catmull-Rom splines, commercial length bins, and PoE or power budgets. Each entry in 'cables[]' upserts in place by 'cable_id' while leaving all other cables and mounted equipment untouched, pushes a recoverable undo snapshot, and persists rack.yaml atomically; port, speed, PoE, or clearance violations return status 'INVALID' with remediation_suggestions instead of throwing. Within each cable, endpoint 'face' is required only on pass-through couplers such as patch panels exposing identical 'port_id' values on both faces, 'preferred_portal_u' applies only to front-to-rear transitions, and 'vlan_id' or 'ip_cidr' annotate logical network links. Use when both endpoint devices are mounted inside the rack; use disconnect_cables to remove cables, or plan_external_endpoints to terminate incoming building cable drops on a patch panel.`,inputSchema:fl,outputSchema:Al,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},disconnect_cables:{name:`disconnect_cables`,title:`Disconnect Cables by ID or Device Instance`,description:`Remove specific cables by identifier or strip all cables attached to a mounted device or modular carrier from the active rack, then re-evaluate PoE budgets and plug clearances. Supply a non-empty 'cable_ids' list, 'instance_id', or both to disconnect their union; 'instance_id' matches both 'from' and 'to' endpoints across a carrier and its child sub-modules while leaving external patch-panel drops intact, whereas omitting both or passing only an empty list returns status 'INVALID' with a PORT_NOT_FOUND issue and zero mutations. Valid calls push an undo snapshot, persist rack.yaml atomically, and return removed IDs, remaining cable count, and updated validation results, succeeding idempotently when targeted IDs are already absent. Use when rewiring ports while keeping hardware mounted; use connect_cables to add or replace cables, or modify_equipment with action 'remove' to delete a device and its cables.`,inputSchema:pl,outputSchema:jl,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!0,openWorldHint:!1}},plan_external_endpoints:{name:`plan_external_endpoints`,title:`Terminate External Building Cable Drops on Patch Panel`,description:`Terminate external building or room cable drops onto the rear RJ45 ports of a mounted patch panel without consuming rack U slots, and optionally auto-create labeled Cat6A front patch cables to a mounted switch. 'groups[]' batch-generates drops first—with 'custom_labels[]' overriding numbered 'label_prefix' entries per index—followed by 'endpoints[]', allocating sequential free rear ports from 'start_port_number' and sequential free switch RJ45 ports from 'auto_connect_switch_start_port'. Setting 'clear_existing' destructively removes prior external drops on 'patch_panel_instance_id' and their front patch cables before allocation, while unmounted patch-panel or switch IDs return status 'INVALID' without mutating state. Use for off-rack building wiring entering the enclosure; never mount room endpoints via mount_equipment, and use connect_cables for purely internal rack-to-rack links.`,inputSchema:vl,outputSchema:Ml,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!1,openWorldHint:!1}},validate_rack:{name:`validate_rack`,title:`Inspect and Validate Active Rack State`,description:`Inspect the active rack.yaml state and run all 5 deterministic validation stages covering mechanical bounds, 3D depth and plug clearances, PoE and power budgets, cable compatibility, and thermal limits. Takes no parameters, performs zero state or undo-stack mutations, and returns the ASCII front and rear elevation diagram, power utilization summary, and all diagnostic issues with remediation_suggestions. Sets status to 'INVALID' instead of throwing whenever any validation ERROR is present. Use to inspect currently mounted equipment or verify zero errors before exporting; use export_deliverables instead to generate SVG, BOM, GLB, or 3D-print files.`,inputSchema:ml,outputSchema:Nl,annotations:{readOnlyHint:!0,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}},export_deliverables:{name:`export_deliverables`,title:`Export 2D SVG, BOM, 3D GLB, Labels, and 3D-Print Deliverables`,description:`Generate 2D elevation and wiring SVGs, a Markdown BOM, a binary 3D GLB scene, parametric OpenSCAD or watertight STL 3D-print models, and optional printable cable-label sheets for the active rack project. Omitting 'formats' exports the six standard deliverables whereas adding 'labels-csv' or 'labels-svg' generates Brother/DYMO wrap-around cable labels; 'carrier-scad' and 'carrier-stl' emit one file per mounted modular carrier, switch cradle, or printable cover panel, and 'output_dir' resolves relative paths within the project directory. Local stdio execution writes deterministic filenames—elevation.svg, wiring-schematic.svg, BOM.md, rack-scene.glb, labels.csv, labels.svg, and <slug>.scad or <slug>.stl—overwriting same-named files in place, whereas hosted remote sessions stream in-memory HTTPS download URLs; neither mode mutates rack state or undo history. Use after validate_rack confirms a valid layout; use validate_rack instead for read-only validation and ASCII elevation inspection without generating export files.`,inputSchema:hl,outputSchema:Pl,annotations:{readOnlyHint:!1,destructiveHint:!0,idempotentHint:!0,openWorldHint:!1,consequentialHint:!0}},undo_redo:{name:`undo_redo`,title:`Undo or Redo Rack State Mutation`,description:`Traverse the per-project in-memory history ring buffer of up to 50 snapshots to revert the latest rack mutation or reapply a reverted mutation, updating rack.yaml atomically. Setting 'action' to 'undo' steps backward across rack-state mutations—excluding catalog-only define_custom_blueprint calls and read-only tools—and pushes the displaced state onto the redo stack, whereas 'redo' is available only immediately after 'undo' because any new rack mutation flushes the redo stack. Calling either action when its target stack is empty is a safe no-op returning applied=false without throwing. Use to roll back an unintended batch change or accidental init_rack reset; use modify_equipment or disconnect_cables instead to edit specific items without reverting intermediate steps.`,inputSchema:yl,outputSchema:Fl,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!1,openWorldHint:!1}},optimize_rack:{name:`optimize_rack`,title:`Auto-Optimize Rack Equipment Layout Deterministically`,description:`Deterministically optimize top-level rackmount equipment U positions and rear PDU face assignments to eliminate chassis or plug-clearance collisions, lower the vertical Center of Gravity below 0.50, preserve mid-height front-to-rear cable portals, and minimize 3D cable arc lengths. Evaluates candidate zoned and locally refined layouts against the full 3D geometry, 5-stage validation, and Catmull-Rom routing engines while keeping carrier sub-modules inside their parent bays, keeping existing cables and external endpoints intact, and locking any devices or parent carriers named in 'pin_instance_ids'. Only commits a strictly improving, non-regressing layout to rack.yaml and pushes an undo snapshot when at least one device moves, making repeated calls safely idempotent. Use when a rack has collisions, top-heavy warnings, or unclustered patch cabling; use modify_equipment instead to move a single device to an explicit U slot.`,inputSchema:bl,outputSchema:Rl,annotations:{readOnlyHint:!1,destructiveHint:!1,idempotentHint:!0,openWorldHint:!1}}};function J(e,t,n){return{x:G(e),y:G(t),z:G(n)}}function Bl(e,t){return J(e.x+t.x,e.y+t.y,e.z+t.z)}function Vl(e,t){return J(e.x*t,e.y*t,e.z*t)}function Hl(e,t){let n=e.x-t.x,r=e.y-t.y,i=e.z-t.z;return Math.sqrt(n*n+r*r+i*i)}function Ul(e,t){return{min:J(Math.min(e.x,t.x),Math.min(e.y,t.y),Math.min(e.z,t.z)),max:J(Math.max(e.x,t.x),Math.max(e.y,t.y),Math.max(e.z,t.z))}}function Wl(e,t,n=nl){let r=Math.min(e.max.x,t.max.x)-Math.max(e.min.x,t.min.x),i=Math.min(e.max.y,t.max.y)-Math.max(e.min.y,t.min.y),a=Math.min(e.max.z,t.max.z)-Math.max(e.min.z,t.min.z);return r>n&&i>n&&a>n}function Gl(e,t,n=nl){return Wl(e,t,n)?{min:J(Math.max(e.min.x,t.min.x),Math.max(e.min.y,t.min.y),Math.max(e.min.z,t.min.z)),max:J(Math.min(e.max.x,t.max.x),Math.min(e.max.y,t.max.y),Math.min(e.max.z,t.max.z))}:null}function Kl(e){let t=e[0];if(!t)return null;let n=t.min.x,r=t.min.y,i=t.min.z,a=t.max.x,o=t.max.y,s=t.max.z;for(let t=1;t<e.length;t++){let c=e[t];c.min.x<n&&(n=c.min.x),c.min.y<r&&(r=c.min.y),c.min.z<i&&(i=c.min.z),c.max.x>a&&(a=c.max.x),c.max.y>o&&(o=c.max.y),c.max.z>s&&(s=c.max.z)}return{min:J(n,r,i),max:J(a,o,s)}}function ql(e,t){let n=e instanceof Map?e.get(t):e[t];if(n)return il(n)}function Jl(e,t){return!!(t.is_passthrough_coupler||e.is_passthrough_coupler||t.capabilities.includes(`passthrough-coupler`)||e.category===`keystone-module`&&e.ports.length===1)}function Yl(t,n,r,i){let a=(t-1)*e;return n===`front`?J(0,a,0):J(r,a,i)}function Xl(e,t,n){return n===`front`?J(t.x+e.x,t.y+e.y,t.z+e.z):J(t.x-e.x,t.y+e.y,t.z-e.z)}function Zl(e,t){return t===`front`?J(e.x,e.y,e.z):J(-e.x,e.y,-e.z)}function Ql(e,t,n,r,i,a,o){let s=o??n.face,c=s===`front`?0:t.geometry.depth_mm,l=s===`front`?J(0,0,-1):J(0,0,1),u=J(n.coordinates.x_mm,n.coordinates.y_mm,c),d=Xl(Bl(r,u),i,a),f=Zl(l,a),p=f.z<0?`front`:`rear`;return{instance_id:e,port_id:n.port_id,label:n.label,local_face:s,world_face:p,connector_type:n.connector_type,direction:n.direction,capabilities:n.capabilities,is_passthrough_coupler:Jl(t,n),local_position:u,world_position:d,world_normal:f}}function $l(e,t,n,r){let i=e.blueprint.ports.find(e=>e.port_id===t);if(!i)return;let a=e.ports.find(e=>e.port_id===t);if(!a)return;if(!n||!a.is_passthrough_coupler)return a;let o=e.face,s=o===`front`?n:n===`front`?`rear`:`front`;if(s===a.local_face)return a;let c=e.world_origin,l=J(0,0,0);if(e.mount_target===`carrier-slot`&&r){c=r.world_origin;let t=r.blueprint.slots.find(t=>t.slot_id===e.slot_id);t&&(l=J(t.offset_mm.x,t.offset_mm.y,t.offset_mm.z))}return Ql(e.instance_id,e.blueprint,i,l,c,o,s)}function eu(e,t,n){let r=[];for(let o of t){let t=[];o.from.instance_id===e.instance_id&&t.push(o.from),o.to.instance_id===e.instance_id&&t.push(o.to);for(let s of t){let t=$l(e,s.port_id,s.face,n);if(!t)continue;let c=a(t.connector_type,o.cable_type),l=i(o.cable_type),u=t.world_position.z,d=u+t.world_normal.z*c,f=Ul(J(e.chassis_box.min.x,e.chassis_box.min.y,u),J(e.chassis_box.max.x,e.chassis_box.max.y,d)),p=Ul(J(t.world_position.x-8,t.world_position.y-8,u),J(t.world_position.x+8,t.world_position.y+8,d));r.push({instance_id:e.instance_id,port_id:t.port_id,cable_id:o.cable_id,cable_type:o.cable_type,connector_type:t.connector_type,is_angled:l,delta_z_mm:c,world_normal:t.world_normal,clearance_box:f,port_local_box:p})}}return{portClearances:r,combinedClearanceBox:Kl(r.map(e=>e.clearance_box))}}function tu(t,r){let i=n[t.rack.standard],a=i.panel_width_mm,o=i.aperture_width_mm,s=G(t.rack.u_height*e),c=t.rack.rail_depth_mm,l=new Map,u=[];for(let n of t.mounted_devices){let i=ql(r,n.blueprint_slug);if(!i)continue;let o=Math.max(1,Math.ceil(i.geometry.u_height)),s=[n.u_position,n.u_position+o-1],d=Yl(n.u_position,n.face,a,c),f=Math.max(0,(a-i.geometry.width_mm)/2),p=f,m=a-f,h=(n.u_position-1)*e,g=h+i.geometry.height_mm,_,v;n.face===`front`?(_=-i.geometry.front_protrusion_mm,v=i.geometry.depth_mm+i.geometry.rear_protrusion_mm):(_=c-i.geometry.depth_mm-i.geometry.rear_protrusion_mm,v=c+i.geometry.front_protrusion_mm);let y=Ul(J(p,h,_),J(m,g,v)),b=i.ports.map(e=>Ql(n.instance_id,i,e,J(0,0,0),d,n.face)),x=i.slots.map(e=>{let t=J(e.offset_mm.x,e.offset_mm.y,e.offset_mm.z),r=J(e.offset_mm.x+e.max_dimensions_mm.width,e.offset_mm.y+e.max_dimensions_mm.height,e.offset_mm.z+e.max_dimensions_mm.depth),i=Xl(t,d,n.face),a=Xl(r,d,n.face),o=n.children.find(t=>t.slot_id===e.slot_id);return{carrier_instance_id:n.instance_id,slot_definition:e,world_origin:i,world_bounds:Ul(i,a),occupied_by_instance_id:o?o.instance_id:null}}),S={instance_id:n.instance_id,blueprint_slug:n.blueprint_slug,blueprint:i,hostname:n.hostname,mount_target:`rack-unit`,u_position:n.u_position,u_range:s,face:n.face,parent_carrier_id:null,slot_id:null,world_origin:d,chassis_box:y,plug_clearance_box:null,port_clearances:[],ports:b,slots:x,child_instance_ids:n.children.map(e=>e.instance_id)},C=eu(S,t.cables),w={...S,plug_clearance_box:C.combinedClearanceBox,port_clearances:C.portClearances};l.set(w.instance_id,w),u.push(w);for(let e of n.children){let a=ql(r,e.blueprint_slug);if(!a)continue;let o=i.slots.find(t=>t.slot_id===e.slot_id),c=o?J(o.offset_mm.x,o.offset_mm.y,o.offset_mm.z):J(0,0,0),f=Xl(c,d,n.face),p=J(c.x,c.y,c.z-a.geometry.front_protrusion_mm),m=J(c.x+a.geometry.width_mm,c.y+a.geometry.height_mm,c.z+a.geometry.depth_mm+a.geometry.rear_protrusion_mm),h=Ul(Xl(p,d,n.face),Xl(m,d,n.face)),g=a.ports.map(t=>Ql(e.instance_id,a,t,c,d,n.face)),_={instance_id:e.instance_id,blueprint_slug:e.blueprint_slug,blueprint:a,hostname:e.hostname,mount_target:`carrier-slot`,u_position:n.u_position,u_range:s,face:n.face,parent_carrier_id:n.instance_id,slot_id:e.slot_id,world_origin:f,chassis_box:h,plug_clearance_box:null,port_clearances:[],ports:g,slots:[],child_instance_ids:[]},v=eu(_,t.cables,w),y={..._,plug_clearance_box:v.combinedClearanceBox,port_clearances:v.portClearances};l.set(y.instance_id,y),u.push(y)}}return{rack:t.rack,panel_width_mm:a,aperture_width_mm:o,total_height_mm:s,rail_depth_mm:c,devices_by_id:l,devices:u}}function nu(e,t){let n=[],r=t.devices.filter(e=>e.mount_target===`rack-unit`&&e.face===`front`);for(let i=1;i<=e.rack.u_height;i++){let e=r.filter(e=>i>=e.u_range[0]&&i<=e.u_range[1]);(e.length===0||e.some(e=>{if(e.blueprint.category===`brush-panel`||e.blueprint.geometry.has_cable_pass_through===!0)return!0;let n=(t.aperture_width_mm-e.blueprint.geometry.width_mm)/2;return(e.blueprint.geometry.ear_mount_style===`none`||e.blueprint.mount_type===`shelf-standing`)&&n>=15}))&&n.push(i)}return n}function ru(e,t,n,r){let i=Math.max(1,Math.ceil(e.blueprint.geometry.u_height)),a=[],o=[],s=r.devices.filter(t=>t.mount_target===`rack-unit`&&t.instance_id!==e.instance_id);for(let c=1;c<=n.rack.u_height-i+1;c++){let l=c,u=c+i-1;if(s.some(e=>e.face===t&&Math.max(l,e.u_range[0])<=Math.min(u,e.u_range[1])))continue;let d=r.devices.filter(e=>e.face!==t&&Math.max(l,e.u_range[0])<=Math.min(u,e.u_range[1]));if(d.length===0){a.push(c),o.push(c);continue}let f=e.port_clearances.reduce((e,n)=>t===`front`&&n.world_normal.z>0||t===`rear`&&n.world_normal.z<0?Math.max(e,n.delta_z_mm):e,0),p=e.blueprint.geometry.depth_mm+f;d.some(e=>{let t=e.port_clearances.reduce((t,n)=>e.face===`front`&&n.world_normal.z>0||e.face===`rear`&&n.world_normal.z<0?Math.max(t,n.delta_z_mm):t,0),r=e.blueprint.geometry.depth_mm+t;return p+r>n.rack.rail_depth_mm})||a.push(c)}return{freeUs:a,zeroOppositeDepthUs:o}}function iu(e,t){let n=[`rj45`,`rj45-serial-console`];return!!(n.includes(e)&&n.includes(t)||e===`sfp-plus`&&t===`sfp-plus`||e===`iec-c13`&&t===`iec-c14`||e===`iec-c14`&&t===`iec-c13`||e===`schuko-cee7`&&(t===`iec-c14`||t===`iec-c13`)||(e===`iec-c14`||e===`iec-c13`)&&t===`schuko-cee7`||e===`dc-5525`&&(t===`dc-5525`||t===`schuko-cee7`||t===`iec-c13`)||(e===`schuko-cee7`||e===`iec-c13`)&&t===`dc-5525`||e===`usb-c`&&(t===`usb-c`||t===`schuko-cee7`||t===`iec-c13`)||(e===`schuko-cee7`||e===`iec-c13`)&&t===`usb-c`||e===`usb-a`&&t===`usb-a`||e===`audio-35mm`&&t===`audio-35mm`)}function au(e,t,n){let r=e.connector_type===`rj45-serial-console`||e.capabilities.includes(`serial-rs232`)&&e.capabilities.length===1;if(r!==(t.connector_type===`rj45-serial-console`||t.capabilities.includes(`serial-rs232`)&&t.capabilities.length===1))return{compatible:!1,reason:`Cannot connect RJ45 serial console port ('${r?e.port_id:t.port_id}') directly to standard Ethernet port ('${r?t.port_id:e.port_id}') without a serial-to-Ethernet adapter.`};let i=n.toLowerCase(),a=i.startsWith(`power-`)||i.includes(`c13`)||i.includes(`schuko`)||i.includes(`dc-5525`),o=e.connector_type===`rj45`||e.connector_type===`sfp-plus`||t.connector_type===`rj45`||t.connector_type===`sfp-plus`;return a&&o?{compatible:!1,reason:`Power cable '${n}' cannot be used on data ports '${e.port_id}' <-> '${t.port_id}'.`}:{compatible:!0}}function ou(e){return e.includes(`poe-out-bt-type4`)?{supported:!0,maxWatts:o[`bt-type4`],className:`bt-type4`}:e.includes(`poe-out-bt-type3`)?{supported:!0,maxWatts:o[`bt-type3`],className:`bt-type3`}:e.includes(`poe-out-at`)||e.includes(`poe+`)?{supported:!0,maxWatts:o.at,className:`at`}:e.includes(`poe-out-af`)||e.includes(`poe-out`)?{supported:!0,maxWatts:o.af,className:`af`}:{supported:!1,maxWatts:0,className:`none`}}function su(e){return e.some(e=>e.startsWith(`poe-in`))}function cu(e){return e.includes(`25gbase-dac`)?25e3:e.includes(`10gbase-t`)||e.includes(`10gbase-sr`)||e.includes(`10gbase-lr`)||e.includes(`10gbase-dac`)?1e4:e.includes(`5gbase-t`)?5e3:e.includes(`2500base-t`)?2500:e.includes(`1000base-t`)?1e3:e.includes(`100base-tx`)?100:0}function lu(t,n,i){let a=i??tu(t,n),o=[];for(let e of t.mounted_devices){let r=ql(n,e.blueprint_slug);if(!r){o.push({code:`BLUEPRINT_NOT_FOUND`,severity:`ERROR`,stage:1,affected_instances:[e.instance_id],u_range:[e.u_position,e.u_position],message:`Hardware blueprint '${e.blueprint_slug}' for instance '${e.instance_id}' was not found in the catalog.`,remediation_suggestions:[`Register '${e.blueprint_slug}' using define_custom_blueprint or select a valid slug via search_catalog.`]});continue}let i=Math.max(1,Math.ceil(r.geometry.u_height)),a=e.u_position+i-1;(e.u_position<1||a>t.rack.u_height)&&o.push({code:`OUT_OF_RACK_BOUNDS`,severity:`ERROR`,stage:1,affected_instances:[e.instance_id],u_range:[e.u_position,a],message:`Device '${e.instance_id}' at U${e.u_position}..U${a} exceeds rack height of ${t.rack.u_height}U.`,remediation_suggestions:[`Move '${e.instance_id}' to a U position between U1 and U${Math.max(1,t.rack.u_height-i+1)}.`]});for(let t of e.children){let i=ql(n,t.blueprint_slug);if(!i){o.push({code:`BLUEPRINT_NOT_FOUND`,severity:`ERROR`,stage:1,affected_instances:[t.instance_id],u_range:[e.u_position,a],message:`Child hardware blueprint '${t.blueprint_slug}' for '${t.instance_id}' was not found in the catalog.`,remediation_suggestions:[`Register '${t.blueprint_slug}' using define_custom_blueprint or select a valid sub-module blueprint.`]});continue}let s=r.slots.find(e=>e.slot_id===t.slot_id);if(!s){let n=r.slots.map(e=>`'${e.slot_id}'`).join(`, `);o.push({code:`SLOT_INCOMPATIBLE`,severity:`ERROR`,stage:1,affected_instances:[e.instance_id,t.instance_id],u_range:[e.u_position,a],message:`Carrier '${e.instance_id}' does not have a slot '${t.slot_id}' for child '${t.instance_id}'.`,remediation_suggestions:[n?`Mount '${t.instance_id}' in one of the available slots on '${e.instance_id}': ${n}.`:`Mount '${t.instance_id}' inside a compatible modular-carrier.`]});continue}i.slot_compatibility&&i.slot_compatibility!==s.accepted_slot_type&&o.push({code:`SLOT_INCOMPATIBLE`,severity:`ERROR`,stage:1,affected_instances:[e.instance_id,t.instance_id],u_range:[e.u_position,a],message:`Slot '${s.slot_id}' on '${e.instance_id}' expects slot type '${s.accepted_slot_type}', but '${t.instance_id}' has slot_compatibility '${i.slot_compatibility}'.`,remediation_suggestions:[`Mount '${t.instance_id}' into a slot accepting '${i.slot_compatibility}'.`]});let{width_mm:c,height_mm:l,depth_mm:u}=i.geometry,{width:d,height:f,depth:p}=s.max_dimensions_mm;(c>d||l>f||u>p)&&o.push({code:`SLOT_DIMENSION_OVERFLOW`,severity:`ERROR`,stage:1,affected_instances:[e.instance_id,t.instance_id],u_range:[e.u_position,a],message:`Child device '${t.instance_id}' (${c}x${l}x${u}mm) exceeds max dimensions of slot '${s.slot_id}' (${d}x${f}x${p}mm) on carrier '${e.instance_id}'.`,remediation_suggestions:[`Use a carrier with a larger bay (>= ${c}x${l}x${u}mm) or mount '${t.instance_id}' on a 1U rack shelf.`]})}}let s=a.devices,c=new Set;for(let e=0;e<s.length;e++){let n=s[e];for(let r=e+1;r<s.length;r++){let e=s[r];if(n.parent_carrier_id===e.instance_id||e.parent_carrier_id===n.instance_id)continue;let i=Gl(n.chassis_box,e.chassis_box);if(i){let r=[n.instance_id,e.instance_id].sort().join(`::`);c.add(r);let s=q(i.max.z-i.min.z),l=Math.max(n.u_range[0],e.u_range[0]),u=Math.min(n.u_range[1],e.u_range[1]),d=e.mount_target===`rack-unit`?e:n,{freeUs:f}=ru(d,d.face,t,a),p=[],m=[];if(f.length>0){let e=f.map(e=>`U${e} (${d.face})`).join(` or `),t=`Move '${d.instance_id}' from U${d.u_position} (${d.face}) to ${e} to resolve chassis overlap.`;p.push(t),m.push({action_type:`move_device`,target_instance_id:d.instance_id,suggested_u_positions:f,suggested_face:d.face,description:t})}else p.push(`Relocate '${d.instance_id}' or increase rack rail depth beyond ${t.rack.rail_depth_mm}mm.`);o.push({code:`CHASSIS_COLLISION`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id,e.instance_id],u_range:[l,Math.max(l,u)],message:`Hard chassis collision on U${l}: '${n.instance_id}' (${n.face}) and '${e.instance_id}' (${e.face}) overlap by ${s}mm on Z-axis.`,remediation_suggestions:p,remediation_actions:m})}}}for(let e of s)for(let n of e.port_clearances)for(let i of s){if(e.instance_id===i.instance_id||e.parent_carrier_id===i.instance_id||i.parent_carrier_id===e.instance_id)continue;let s=[e.instance_id,i.instance_id].sort().join(`::`);if(c.has(s))continue;let l=Gl(n.clearance_box,i.chassis_box);if(!l)continue;let u=q(l.max.z-l.min.z),d=Math.max(e.u_range[0],i.u_range[0]),f=Math.min(e.u_range[1],i.u_range[1]),p=e.blueprint.geometry.depth_mm,m=q(p+n.delta_z_mm),h=i.blueprint.geometry.depth_mm,g=[],_=[],v=i.face===`rear`&&i.mount_target===`rack-unit`?i:e.mount_target===`rack-unit`?e:i;if(v.mount_target===`rack-unit`){let{freeUs:e,zeroOppositeDepthUs:n}=ru(v,v.face,t,a),r=n.length>0?n:e;if(r.length>0){let e=r.map(e=>`U${e} (${v.face})`).join(` or `),t=v.face===`rear`?`front`:`rear`,i=n.length>0?`, where ${t} depth is 0mm.`:`, where depth clearance is sufficient.`,a=`Move '${v.instance_id}' from U${v.u_position} (${v.face}) to ${e}${i}`;g.push(a),_.push({action_type:`move_device`,target_instance_id:v.instance_id,suggested_u_positions:r,suggested_face:v.face,description:a})}}let y=r[n.connector_type];if(!n.is_angled&&y.angled_mm!==null){let e=y.angled_mm,t=`${n.cable_type}-angled`,r=q(u-(n.delta_z_mm-e)),i=r<=0?`Change cable '${n.cable_id}' to '${t}', reducing plug clearance from ${n.delta_z_mm}mm to ${e}mm and resolving the collision.`:`Change cable '${n.cable_id}' to '${t}', reducing plug clearance from ${n.delta_z_mm}mm to ${e}mm (still requires moving '${v.instance_id}' or increasing rail depth by ${r}mm).`;g.push(i),_.push({action_type:`change_cable_type`,target_cable_id:n.cable_id,suggested_cable_type:t,description:i})}g.length===0&&g.push(`Increase rack rail_depth_mm by at least ${u}mm (to >= ${t.rack.rail_depth_mm+u}mm).`);let b=`${n.is_angled?`angled`:`straight`} ${n.connector_type.toUpperCase()} plug`;o.push({code:`PLUG_CLEARANCE_COLLISION`,severity:`ERROR`,stage:1,affected_instances:[e.instance_id,i.instance_id],u_range:[d,Math.max(d,f)],message:`Depth collision on U${d}: '${e.instance_id}' (${p}mm body + ${n.delta_z_mm}mm ${b} = ${m}mm) overlaps with ${i.face}-mounted '${i.instance_id}' (${h}mm depth) in a ${t.rack.rail_depth_mm}mm deep rack (${u}mm overlap).`,remediation_suggestions:g,remediation_actions:_})}if(t.rack.enclosure_type===`closed-glass-front`){let e=-t.rack.front_door_clearance_mm;for(let n of s){let i=n.chassis_box.min.z,a=n.plug_clearance_box===null?i:n.plug_clearance_box.min.z,s=Math.min(i,a);if(s<e-.001){let i=q(e-s),a=n.port_clearances.find(t=>t.clearance_box.min.z<e-nl),c=[];if(a&&!a.is_angled){let e=r[a.connector_type];e.angled_mm!==null&&c.push(`Change cable '${a.cable_id}' to '${a.cable_type}-angled' to reduce front plug protrusion from ${a.delta_z_mm}mm to ${e.angled_mm}mm.`)}c.push(`Use recessed mounting ears ('recessed-20mm') on '${n.instance_id}' or change rack enclosure_type to 'open-frame'.`),o.push({code:`FRONT_DOOR_COLLISION`,severity:`ERROR`,stage:1,affected_instances:[n.instance_id],u_range:[n.u_range[0],n.u_range[1]],message:`Front door collision on U${n.u_position}: '${n.instance_id}' protrudes to Z = ${s}mm, exceeding front glass door clearance (-${t.rack.front_door_clearance_mm}mm) by ${i}mm.`,remediation_suggestions:c})}}}let l=new Map,u=[];for(let e of t.cables){let t=a.devices_by_id.get(e.from.instance_id),n=a.devices_by_id.get(e.to.instance_id);if(!t||!n){let n=t?e.to.instance_id:e.from.instance_id;o.push({code:`PORT_NOT_FOUND`,severity:`ERROR`,stage:2,affected_instances:[n],message:`Cable '${e.cable_id}' references non-existent device instance '${n}'.`,remediation_suggestions:[`Verify instance_id '${n}' is mounted or remove cable '${e.cable_id}'.`]});continue}let r=t.parent_carrier_id?a.devices_by_id.get(t.parent_carrier_id):void 0,i=n.parent_carrier_id?a.devices_by_id.get(n.parent_carrier_id):void 0,s=$l(t,e.from.port_id,e.from.face,r),c=$l(n,e.to.port_id,e.to.face,i);if(!s||!c){let r=s?n:t,i=s?e.to.port_id:e.from.port_id,a=r.ports.map(e=>`'${e.port_id}'`).join(`, `);o.push({code:`PORT_NOT_FOUND`,severity:`ERROR`,stage:2,affected_instances:[r.instance_id],u_range:[r.u_range[0],r.u_range[1]],message:`Port '${i}' does not exist on device '${r.instance_id}' (referenced by cable '${e.cable_id}').`,remediation_suggestions:[`Use one of the valid port IDs on '${r.instance_id}': ${a||`none`}.`]});continue}let d=[{dev:t,port:s,epFace:e.from.face??s.world_face},{dev:n,port:c,epFace:e.to.face??c.world_face}];for(let t of d){let n=t.port.is_passthrough_coupler?`${t.dev.instance_id}:${t.port.port_id}:${t.epFace}`:`${t.dev.instance_id}:${t.port.port_id}`,r=l.get(n);if(r){let n=t.dev.ports.filter(e=>e.connector_type===t.port.connector_type&&!l.has(`${t.dev.instance_id}:${e.port_id}`)).map(e=>`'${e.port_id}'`);o.push({code:`PORT_ALREADY_OCCUPIED`,severity:`ERROR`,stage:2,affected_instances:[t.dev.instance_id],u_range:[t.dev.u_range[0],t.dev.u_range[1]],message:`Port '${t.port.port_id}'${t.port.is_passthrough_coupler?` (${t.epFace} face)`:``} on '${t.dev.instance_id}' is already occupied by cable '${r}' and cannot accept cable '${e.cable_id}'.`,remediation_suggestions:[n.length>0?`Connect cable '${e.cable_id}' to a free port on '${t.dev.instance_id}': ${n.slice(0,4).join(`, `)}.`:`Disconnect '${r}' before connecting '${e.cable_id}'.`]})}else l.set(n,e.cable_id)}if(!iu(s.connector_type,c.connector_type)){o.push({code:`CONNECTOR_INCOMPATIBLE`,severity:`ERROR`,stage:2,affected_instances:[t.instance_id,n.instance_id],message:`Physical connector mismatch on cable '${e.cable_id}': '${t.instance_id}:${s.port_id}' (${s.connector_type}) is incompatible with '${n.instance_id}:${c.port_id}' (${c.connector_type}).`,remediation_suggestions:[`Connect '${t.instance_id}:${s.port_id}' (${s.connector_type}) to a compatible '${s.connector_type}' port on '${n.instance_id}'.`]});continue}let f=au(s,c,e.cable_type);if(!f.compatible){o.push({code:`SIGNAL_PROTOCOL_INCOMPATIBLE`,severity:`ERROR`,stage:2,affected_instances:[t.instance_id,n.instance_id],message:`Signal incompatibility on cable '${e.cable_id}': ${f.reason}`,remediation_suggestions:[`Connect '${t.instance_id}:${s.port_id}' to a protocol-compatible port or insert a media/protocol converter.`]});continue}let p=e.cable_type===`cat5e`||e.cable_type===`cat5e-angled`,m=cu(s.capabilities),h=cu(c.capabilities),g=m>0&&h>0?Math.min(m,h):Math.max(m,h);if(p&&g>=2500){let r=e.cable_type===`cat5e-angled`?`cat6a-angled`:`cat6a`,i=`Upgrade cable '${e.cable_id}' from '${e.cable_type}' to '${r}' to prevent multi-gigabit (${g/1e3}G) link throttling to 1000BASE-T.`;o.push({code:`SPEED_MISMATCH`,severity:`WARNING`,stage:2,affected_instances:[t.instance_id,n.instance_id],message:`Cable media bottleneck on '${e.cable_id}': '${e.cable_type}' is rated for 1000BASE-T (1G) and may throttle the ${g/1e3}G link between '${t.instance_id}:${s.port_id}' and '${n.instance_id}:${c.port_id}'.`,remediation_suggestions:[i],remediation_actions:[{action_type:`change_cable_type`,target_cable_id:e.cable_id,suggested_cable_type:r,description:i}]})}u.push({cable:e,fromDev:t,toDev:n,fromPort:s,toPort:c})}let d=t.external_endpoints??[],f=[];for(let e of d){let t=a.devices_by_id.get(e.patch_panel_instance_id);if(!t){o.push({code:`PORT_NOT_FOUND`,severity:`ERROR`,stage:2,affected_instances:[e.patch_panel_instance_id],message:`External endpoint '${e.endpoint_id}' (${e.label}) references non-existent patch panel '${e.patch_panel_instance_id}'.`,remediation_suggestions:[`Mount patch panel '${e.patch_panel_instance_id}' first or reference an existing patch panel instance_id.`]});continue}let n=t.parent_carrier_id?a.devices_by_id.get(t.parent_carrier_id):void 0,r=$l(t,e.patch_panel_port_id,`rear`,n);if(!r){let n=t.ports.map(e=>`'${e.port_id}'`).join(`, `);o.push({code:`PORT_NOT_FOUND`,severity:`ERROR`,stage:2,affected_instances:[t.instance_id],u_range:[t.u_range[0],t.u_range[1]],message:`Port '${e.patch_panel_port_id}' does not exist on patch panel '${t.instance_id}' (referenced by external endpoint '${e.endpoint_id}').`,remediation_suggestions:[`Use one of the valid port IDs on '${t.instance_id}': ${n||`none`}.`]});continue}let i=r.is_passthrough_coupler?`${t.instance_id}:${r.port_id}:rear`:`${t.instance_id}:${r.port_id}`,s=l.get(i);s?o.push({code:`PORT_ALREADY_OCCUPIED`,severity:`ERROR`,stage:2,affected_instances:[t.instance_id],u_range:[t.u_range[0],t.u_range[1]],message:`Rear port '${r.port_id}' on '${t.instance_id}' is already occupied by '${s}' and cannot accept external endpoint '${e.endpoint_id}' (${e.label}).`,remediation_suggestions:[`Assign external endpoint '${e.endpoint_id}' to a free rear port on '${t.instance_id}'.`]}):(l.set(i,`external:${e.endpoint_id}`),f.push({ext:e,ppDev:t,ppPort:r}))}let p=[],m=new Map;for(let e of u){let t=e.fromPort.is_passthrough_coupler,n=e.toPort.is_passthrough_coupler;if(!t&&!n)p.push({cableIds:[e.cable.cable_id],devA:e.fromDev,portA:e.fromPort,devB:e.toDev,portB:e.toPort});else if(t&&!n){let t=`${e.fromDev.instance_id}:${e.fromPort.port_id}`,n=e.cable.from.face??e.fromPort.world_face,r=m.get(t)??{};r[n]={dev:e.toDev,port:e.toPort,cableId:e.cable.cable_id},m.set(t,r)}else if(!t&&n){let t=`${e.toDev.instance_id}:${e.toPort.port_id}`,n=e.cable.to.face??e.toPort.world_face,r=m.get(t)??{};r[n]={dev:e.fromDev,port:e.fromPort,cableId:e.cable.cable_id},m.set(t,r)}else if(t&&n){let t=`${e.fromDev.instance_id}:${e.fromPort.port_id}`,n=e.cable.from.face??e.fromPort.world_face,r=`${e.toDev.instance_id}:${e.toPort.port_id}`,i=e.cable.to.face??e.toPort.world_face,a=m.get(t)??{};a[n]={dev:e.toDev,port:e.toPort,cableId:e.cable.cable_id,otherCouplerKey:r,otherCouplerFace:i},m.set(t,a);let o=m.get(r)??{};o[i]={dev:e.fromDev,port:e.fromPort,cableId:e.cable.cable_id,otherCouplerKey:t,otherCouplerFace:n},m.set(r,o)}}let h=new Set;for(let[e,t]of m.entries())if(!h.has(e)&&t.front&&t.rear){let n=t.front,r=t.rear,i=new Set([n.cableId,r.cableId]);for(h.add(e);n?.otherCouplerKey&&n.otherCouplerFace;){let e=n.otherCouplerKey;h.add(e);let t=n.otherCouplerFace===`front`?`rear`:`front`,r=m.get(e)?.[t];if(!r){n=void 0;break}i.add(r.cableId),n=r}for(;r?.otherCouplerKey&&r.otherCouplerFace;){let e=r.otherCouplerKey;h.add(e);let t=r.otherCouplerFace===`front`?`rear`:`front`,n=m.get(e)?.[t];if(!n){r=void 0;break}i.add(n.cableId),r=n}n&&r&&!n.otherCouplerKey&&!r.otherCouplerKey&&p.push({cableIds:Array.from(i),devA:n.dev,portA:n.port,devB:r.dev,portB:r.port})}let g=new Map;for(let e of s)e.blueprint.power_and_thermal.electrical_role===`pse-switch`&&g.set(e.instance_id,{pseDev:e,budgetWatts:e.blueprint.power_and_thermal.poe_budget_watts??0,consumedWatts:0,downstreamIds:[]});let _=new Set,v=new Set,y=new Map,b=[];for(let{ext:e,ppDev:t,ppPort:n}of f){let r=`${t.instance_id}:${n.port_id}`,i=m.get(r)?.front;if(!i){e.poe_draw_watts>0&&(b.push(e.endpoint_id),o.push({code:`UNPOWERED_DEVICE`,severity:`WARNING`,stage:3,affected_instances:[t.instance_id],u_range:[t.u_range[0],t.u_range[1]],message:`External PoE endpoint '${e.endpoint_id}' (${e.label}, ${e.poe_draw_watts}W) is terminated on the rear of '${t.instance_id}:${n.port_id}', but no front patch cable connects '${t.instance_id}:${n.port_id}' to a PoE switch port.`,remediation_suggestions:[`Connect a front patch cable from '${t.instance_id}:${n.port_id}' (face: "front") to a PoE-capable switch port.`]}));continue}let a=i,s=new Set([r]);for(;a?.otherCouplerKey&&a.otherCouplerFace;){let e=a.otherCouplerKey;if(s.has(e)){a=void 0;break}s.add(e);let t=a.otherCouplerFace===`front`?`rear`:`front`;a=m.get(e)?.[t]}if(!a||a.otherCouplerKey){e.poe_draw_watts>0&&b.push(e.endpoint_id);continue}let c=a.dev,l=a.port,u=e.required_speed===`10gbe`?1e4:e.required_speed===`2.5gbe`?2500:e.required_speed===`1gbe`?1e3:100,d=cu(l.capabilities);if(d>0&&d<u&&o.push({code:`SPEED_MISMATCH`,severity:`WARNING`,stage:2,affected_instances:[t.instance_id,c.instance_id],u_range:[Math.min(t.u_range[0],c.u_range[0]),Math.max(t.u_range[1],c.u_range[1])],message:`External endpoint '${e.endpoint_id}' (${e.label}) on '${t.instance_id}:${n.port_id}' requires ${e.required_speed.toUpperCase()} (${u>=1e3?`${u/1e3}G`:`${u}M`}), but connected switch port '${c.instance_id}:${l.port_id}' only supports up to ${d>=1e3?`${d/1e3}G`:`${d}M`}.`,remediation_suggestions:[`Patch '${t.instance_id}:${n.port_id}' to a ${e.required_speed.toUpperCase()}-capable port on '${c.instance_id}' or another switch.`]}),e.poe_draw_watts>0){let r=ou(l.capabilities);if(!r.supported)b.push(e.endpoint_id),o.push({code:`UNPOWERED_DEVICE`,severity:`WARNING`,stage:3,affected_instances:[t.instance_id,c.instance_id],u_range:[Math.min(t.u_range[0],c.u_range[0]),Math.max(t.u_range[1],c.u_range[1])],message:`External PoE endpoint '${e.endpoint_id}' (${e.label}, ${e.poe_draw_watts}W) is patched via '${t.instance_id}:${n.port_id}' to '${c.instance_id}:${l.port_id}', which does not provide PoE output.`,remediation_suggestions:[`Connect '${t.instance_id}:${n.port_id}' to a PoE-capable port on '${c.instance_id}' or another PSE switch.`]});else{e.poe_draw_watts>r.maxWatts&&o.push({code:`POE_CLASS_EXCEEDED`,severity:`ERROR`,stage:3,affected_instances:[c.instance_id,t.instance_id],u_range:[c.u_range[0],c.u_range[1]],message:`PoE class exceeded on '${c.instance_id}:${l.port_id}' (class '${r.className}', max ${r.maxWatts}W): external endpoint '${e.endpoint_id}' (${e.label}) requires ${e.poe_draw_watts}W.`,remediation_suggestions:[`Patch '${t.instance_id}:${n.port_id}' ('${e.label}') to a higher-class PoE+/PoE++ port (>= ${e.poe_draw_watts}W).`]});let i=g.get(c.instance_id);i||(i={pseDev:c,budgetWatts:c.blueprint.power_and_thermal.poe_budget_watts??0,consumedWatts:0,downstreamIds:[]},g.set(c.instance_id,i)),i.consumedWatts=K(i.consumedWatts+e.poe_draw_watts),i.downstreamIds.includes(e.endpoint_id)||i.downstreamIds.push(e.endpoint_id)}}}for(let e of p){let t=ou(e.portA.capabilities),n=ou(e.portB.capabilities),r=(e,t,n,r,i)=>{if(!n.supported||!su(i.capabilities))return;let a=r.blueprint.power_and_thermal.max_system_watts;_.add(r.instance_id),a>n.maxWatts&&o.push({code:`POE_CLASS_EXCEEDED`,severity:`ERROR`,stage:3,affected_instances:[e.instance_id,r.instance_id],u_range:[e.u_range[0],r.u_range[1]],message:`PoE class exceeded on '${e.instance_id}:${t.port_id}' (class '${n.className}', max ${n.maxWatts}W): downstream device '${r.instance_id}' requires ${a}W.`,remediation_suggestions:[`Connect '${r.instance_id}' to a higher-class PoE++ port (>= ${a}W) or power it via a dedicated AC/DC adapter.`]});let s=g.get(e.instance_id);s||(s={pseDev:e,budgetWatts:e.blueprint.power_and_thermal.poe_budget_watts??0,consumedWatts:0,downstreamIds:[]},g.set(e.instance_id,s)),s.consumedWatts=K(s.consumedWatts+a),s.downstreamIds.includes(r.instance_id)||s.downstreamIds.push(r.instance_id)};r(e.devA,e.portA,t,e.devB,e.portB),r(e.devB,e.portB,n,e.devA,e.portA);let i=e=>e.connector_type===`iec-c13`||e.connector_type===`iec-c14`||e.connector_type===`schuko-cee7`||e.connector_type===`dc-5525`||e.connector_type===`usb-c`&&(e.capabilities.includes(`usb-pd`)||e.capabilities.includes(`dc-power`)||e.direction!==`bidirectional`);if(i(e.portA)&&i(e.portB)){let t=e.devA.blueprint.power_and_thermal.electrical_role,n=e.devB.blueprint.power_and_thermal.electrical_role,r=t===`ups`||t===`pdu`&&n!==`ups`||e.portA.direction===`output`,i=n===`ups`||n===`pdu`&&t!==`ups`||e.portB.direction===`output`;if(r&&!i){v.add(e.devB.instance_id);let t=y.get(e.devA.instance_id)??[];t.push(e.devB.instance_id),y.set(e.devA.instance_id,t)}else if(i&&!r){v.add(e.devA.instance_id);let t=y.get(e.devB.instance_id)??[];t.push(e.devA.instance_id),y.set(e.devB.instance_id,t)}}}let x=[],S=0;for(let[,e]of g.entries()){S=K(S+e.consumedWatts);let t=K(e.budgetWatts-e.consumedWatts);if(x.push({pse_instance_id:e.pseDev.instance_id,poe_budget_watts:e.budgetWatts,consumed_poe_watts:e.consumedWatts,remaining_poe_watts:t,downstream_devices:e.downstreamIds}),e.consumedWatts>e.budgetWatts){let t=q(e.consumedWatts-e.budgetWatts),n=[`Disconnect or move at least ${t}W of PoE load (${e.downstreamIds.map(e=>`'${e}'`).join(`, `)}) from '${e.pseDev.instance_id}' to dedicated AC/DC power or a PoE injector.`,`Upgrade '${e.pseDev.instance_id}' to a PSE switch with poe_budget_watts >= ${e.consumedWatts}W.`];o.push({code:`POE_BUDGET_EXCEEDED`,severity:`ERROR`,stage:3,affected_instances:[e.pseDev.instance_id,...e.downstreamIds],u_range:[e.pseDev.u_range[0],e.pseDev.u_range[1]],message:`PoE budget exceeded on '${e.pseDev.instance_id}': downstream PoE devices (${e.downstreamIds.join(`, `)}) draw ${e.consumedWatts}W, exceeding the ${e.budgetWatts}W budget by ${t}W.`,remediation_suggestions:n,remediation_actions:[{action_type:`redistribute_poe`,target_instance_id:e.pseDev.instance_id,description:n[0]}]})}}let C=(e,t=new Set)=>{if(t.has(e))return 0;t.add(e);let n=a.devices_by_id.get(e);if(!n)return 0;let r=n.blueprint.power_and_thermal.max_system_watts,i=g.get(e)?.consumedWatts??0,o=(y.get(e)??[]).reduce((e,n)=>e+C(n,t),0);return K(r+i+o)},w=(e,t=new Set)=>{if(t.has(e))return 0;t.add(e);let n=a.devices_by_id.get(e);if(!n)return 0;let r=n.blueprint.power_and_thermal,i=(r.idle_watts+r.max_system_watts)/2,o=(g.get(e)?.consumedWatts??0)*.75,s=(y.get(e)??[]).reduce((e,n)=>e+w(n,t),0);return K(i+o+s)},T=[],ee=null;for(let e of s){let t=e.blueprint.power_and_thermal.electrical_role;if(t!==`ups`&&t!==`pdu`)continue;let n=y.get(e.instance_id)??[],r=n.reduce((e,t)=>e+C(t),0),i=K(e.blueprint.power_and_thermal.max_system_watts+r),a=e.blueprint.power_and_thermal.ups_capacity_watts??e.blueprint.power_and_thermal.pdu_capacity_watts??(t===`ups`?600:2300),s=q(i/a*100);if(t===`ups`){let r=e.blueprint.power_and_thermal.ups_battery_wh??Math.max(36,Math.round(a*.24)),o=n.reduce((e,t)=>e+w(t),0),c=Math.max(1,(e.blueprint.power_and_thermal.idle_watts+e.blueprint.power_and_thermal.max_system_watts)/2+o),l=Math.max(1,i),u=q(r*.85/l*60),d=q(r*.85/c*60);ee=ee===null?d:Math.min(ee,d),T.push({source_instance_id:e.instance_id,role:t,capacity_watts:a,total_load_watts:i,utilization_percent:s,battery_wh:r,estimated_runtime_minutes_peak:u,estimated_runtime_minutes_typical:d})}else T.push({source_instance_id:e.instance_id,role:t,capacity_watts:a,total_load_watts:i,utilization_percent:s});if(i>a){let r=q(i-a);o.push({code:`UPS_OVERLOAD`,severity:`ERROR`,stage:3,affected_instances:[e.instance_id,...n],u_range:[e.u_range[0],e.u_range[1]],message:`Power capacity exceeded on '${e.instance_id}' (${t.toUpperCase()}): connected peak load is ${i}W, exceeding capacity of ${a}W by ${r}W.`,remediation_suggestions:[`Offload at least ${r}W from '${e.instance_id}' onto a secondary PDU/UPS or upgrade '${e.instance_id}' to >= ${Math.ceil(i*1.2)}W capacity.`]})}}let te=[...b],ne=s.filter(e=>e.blueprint.power_and_thermal.electrical_role===`pdu`||e.blueprint.power_and_thermal.electrical_role===`ups`);for(let e of s){let t=e.blueprint.power_and_thermal.electrical_role;if(t!==`passive`&&t!==`ups`&&t!==`pdu`&&!(v.has(e.instance_id)||_.has(e.instance_id))){te.push(e.instance_id);let n=e.ports.find(e=>e.direction===`input`||e.connector_type===`iec-c14`||e.connector_type===`dc-5525`||e.capabilities.some(e=>e.startsWith(`poe-in`))),r=[],i=[];if(ne.length>0&&n){let t=ne[0],a=t.ports.find(e=>!l.has(`${t.instance_id}:${e.port_id}`)&&(e.direction===`output`||e.connector_type===`schuko-cee7`||e.connector_type===`iec-c13`));if(a){let o=`Connect power port '${n.port_id}' on '${e.instance_id}' to free outlet '${a.port_id}' on '${t.instance_id}'.`;r.push(o),i.push({action_type:`connect_power`,target_instance_id:e.instance_id,description:o})}}r.length===0&&r.push(`Connect '${e.instance_id}' to a PDU/UPS power outlet or a PoE-capable switch port.`),o.push({code:`UNPOWERED_DEVICE`,severity:`WARNING`,stage:3,affected_instances:[e.instance_id],u_range:[e.u_range[0],e.u_range[1]],message:`Active device '${e.instance_id}' (${t}, ${e.blueprint.power_and_thermal.max_system_watts}W) has no active power or PoE connection.`,remediation_suggestions:r,remediation_actions:i})}}let E=0,D=0,O=[];for(let e of s){let n=e.blueprint.geometry.weight_grams,r=(e.chassis_box.min.y+e.chassis_box.max.y)/2;E+=n,D+=n*r,(n>=(t.rack.standard===`19inch`?12e3:4e3)||e.blueprint.category===`ups`&&n>=4e3)&&e.u_position>3&&O.push(e)}let re=t.rack.u_height*e,ie=E>0?K(D/E):0,k=E>0&&re>0?G(ie/re):0;if(k>.55||O.length>0){let e=O.length>0?O.map(e=>e.instance_id):s.filter(e=>e.u_position>Math.ceil(t.rack.u_height/2)).map(e=>e.instance_id),n=O.length>0?`heavy equipment (${O.map(e=>`'${e.instance_id}' at ${e.blueprint.geometry.weight_grams}g on U${e.u_position}`).join(`, `)}) is mounted above U3 (normalized CoG = ${k})`:`normalized vertical Center of Gravity is ${k} (> 0.55 threshold)`;o.push({code:`TOP_HEAVY_RACK`,severity:`WARNING`,stage:4,affected_instances:e,message:`Rack mechanical stability warning: ${n}.`,remediation_suggestions:[`Move heavy devices (such as UPS or high-mass nodes) to U1–U3 at the bottom of the rack to lower the center of gravity.`]})}let A=nu(t,a);for(let e of u)if(e.fromPort.world_face!==e.toPort.world_face){let n=e.fromDev.u_position,r=e.toDev.u_position,i=Math.min(n,r)-3,a=Math.max(n,r)+3;A.filter(e=>e>=i&&e<=a).length===0&&o.push({code:`NO_FRONT_TO_REAR_PORTAL`,severity:`ERROR`,stage:4,affected_instances:[e.fromDev.instance_id,e.toDev.instance_id],u_range:[Math.min(n,r),Math.max(n,r)],message:`Cross-face cable '${e.cable.cable_id}' connects '${e.fromDev.instance_id}:${e.fromPort.port_id}' (${e.fromPort.world_face}, U${n}) to '${e.toDev.instance_id}:${e.toPort.port_id}' (${e.toPort.world_face}, U${r}), but no valid front-to-rear cable portal exists within +/- 3U.`,remediation_suggestions:[`Leave at least one rack unit unoccupied or mount a 1U 'brush-panel' between U${Math.max(1,i)} and U${Math.min(t.rack.u_height,a)}.`],remediation_actions:[{action_type:`add_portal_gap`,target_cable_id:e.cable.cable_id,description:`Mount a brush-panel or free a 1U gap within +/- 3U of U${n}..U${r}.`}]})}let j=K(s.reduce((e,t)=>e+t.blueprint.power_and_thermal.max_system_watts,0)),ae=q(s.reduce((e,t)=>e+t.blueprint.power_and_thermal.idle_watts,0)),oe=q(q((ae+j)/2+S*.75)*8760/1e3),M=K(s.reduce((e,t)=>e+(t.blueprint.estimated_price_eur??0),0)),se=q(j*3.41214),ce=s.filter(e=>e.blueprint.power_and_thermal.max_system_watts>0&&e.blueprint.power_and_thermal.airflow===`front-to-rear`),le=s.filter(e=>e.blueprint.power_and_thermal.max_system_watts>0&&e.blueprint.power_and_thermal.airflow===`rear-to-front`),ue=s.filter(e=>e.blueprint.power_and_thermal.max_system_watts>0&&e.blueprint.power_and_thermal.airflow===`passive-convection`),de=`uniform-passive`;if(ce.length>0&&le.length>0){de=`mixed-conflict`;let e=[...ce.map(e=>e.instance_id),...le.map(e=>e.instance_id)];o.push({code:`THERMAL_AIRFLOW_CONFLICT`,severity:`WARNING`,stage:5,affected_instances:e,message:`Opposing thermal airflow directions detected: front-to-rear devices (${ce.map(e=>`'${e.instance_id}'`).join(`, `)}) conflict with rear-to-front devices (${le.map(e=>`'${e.instance_id}'`).join(`, `)}), causing hot-air recirculation.`,remediation_suggestions:[`Reverse mounting face or fan orientation on ${le.map(e=>`'${e.instance_id}'`).join(`, `)} so all active equipment follows a uniform front-to-rear cold/hot aisle path.`]})}else(ce.length>0||le.length>0)&&ue.length>0?de=`hybrid-active-passive`:ce.length>0&&(de=`uniform-front-to-rear`);let fe=ue.filter(e=>e.blueprint.power_and_thermal.max_system_watts>=35);for(let e=0;e<fe.length;e++){let t=fe[e];for(let n=e+1;n<fe.length;n++){let e=fe[n];if(Math.abs(t.u_position-e.u_position)===1){let n=Math.min(t.u_position,e.u_position),r=Math.max(t.u_position,e.u_position);o.push({code:`THERMAL_HOTSPOT_STACKING`,severity:`WARNING`,stage:5,affected_instances:[t.instance_id,e.instance_id],u_range:[n,r],message:`Thermal hotspot stacking on U${n}..U${r}: passive-convection devices '${t.instance_id}' (${t.blueprint.power_and_thermal.max_system_watts}W) and '${e.instance_id}' (${e.blueprint.power_and_thermal.max_system_watts}W) are stacked directly adjacent without active airflow or a 1U ventilation gap.`,remediation_suggestions:[`Insert a 1U ventilation gap or brush-panel between '${t.instance_id}' and '${e.instance_id}', or add active front-to-rear rack cooling.`]})}}}let pe=0,me=[];for(let e of s){let t=e.blueprint.power_and_thermal,n=t.noise_db_a;n===void 0&&(n=t.airflow===`front-to-rear`||t.airflow===`rear-to-front`||t.airflow===`side-to-side`?t.max_system_watts>=25?28:t.max_system_watts>0?22:0:0),n>0&&(pe+=10**(n/10),n>=40&&me.push({id:e.instance_id,dbA:n}))}let he=pe>0?q(10*Math.log10(pe)):0;he>45&&o.push({code:`ACOUSTIC_NOISE_HIGH`,severity:`WARNING`,stage:5,affected_instances:me.length>0?me.map(e=>e.id):s.map(e=>e.instance_id),message:`Combined rack acoustic emission is ${he} dB(A), exceeding the 45.0 dB(A) homelab/office comfort threshold.`,remediation_suggestions:[`Replace high-RPM fans with low-noise PWM fans or relocate high-noise equipment (${me.map(e=>`'${e.id}' at ${e.dbA} dB(A)`).join(`, `)||`active switches/servers`}) to an enclosed utility closet.`]});let ge=o.filter(e=>e.severity===`ERROR`).length,_e=o.filter(e=>e.severity===`WARNING`).length;return{status:ge===0?`VALID`:`INVALID`,is_valid:ge===0,error_count:ge,warning_count:_e,issues:o,power_summary:{total_system_watts:j,total_idle_watts:ae,total_poe_watts:S,annual_energy_kwh_typical:oe,estimated_ups_runtime_minutes:ee,estimated_hardware_budget_eur:M,pse_budgets:x,power_sources:T,unpowered_active_instances:te},mechanical_summary:{total_weight_grams:E,center_of_gravity_y_mm:ie,normalized_cog_y:k,available_portal_u_positions:A,total_thermal_btu_hr:se,combined_noise_db_a:he,airflow_profile:de}}}function uu(e,t=l){if(e<=0)return{du:0,dv:0};let n=1;for(;1+3*n*(n+1)<=e;)n++;let r=e-(1+3*n*(n-1)),i=Math.floor(r/n),a=r%n,o=i*Math.PI/3,s=(i+1)*Math.PI/3,c=n*t,u=c*Math.cos(o),d=c*Math.sin(o),f=c*Math.cos(s),p=c*Math.sin(s),m=a/n;return{du:G(u+m*(f-u)),dv:G(d+m*(p-d))}}function du(e){if(e.length===0)return[];let t=[e[0]];for(let n=1;n<e.length;n++){let r=t[t.length-1],i=e[n];Hl(r,i)>.001&&t.push(i)}return t}function fu(e,t=32,n=.5){let r=du(e);if(r.length===0)return[];if(r.length===1)return[J(r[0].x,r[0].y,r[0].z)];let i=r[0],a=r[r.length-1],o=r.length-1,s=(e,t,n)=>{let r=1-n;return{x:e.x*r+t.x*n,y:e.y*r+t.y*n,z:e.z*r+t.z*n}},c=(e,t,n,r)=>{let i=1-r,a=i*i,o=2*i*r,s=r*r;return{x:a*e.x+o*t.x+s*n.x,y:a*e.y+o*t.y+s*n.y,z:a*e.z+o*t.z+s*n.z}},l=r.map((e,t)=>{if(t===0||t===o)return{radiusMm:0,sIn:e,cIn:e,apex:e,cOut:e,sOut:e};let n=r[t-1],i=r[t+1],a=Hl(n,e),c=Hl(e,i);if(a<=.001||c<=.001)return{radiusMm:0,sIn:e,cIn:e,apex:e,cOut:e,sOut:e};let l={x:(e.x-n.x)/a,y:(e.y-n.y)/a,z:(e.z-n.z)/a},u={x:(i.x-e.x)/c,y:(i.y-e.y)/c,z:(i.z-e.z)/c},d=t===1||t===o-1,f=d?4.5:10,p=d?.35:.4,m=Math.min(f,a*p,c*p),h={x:e.x-l.x*m,y:e.y-l.y*m,z:e.z-l.z*m},g={x:e.x+u.x*m,y:e.y+u.y*m,z:e.z+u.z*m},_=s(h,e,.5),v=s(e,g,.5);return{radiusMm:m,sIn:h,cIn:_,apex:s(_,v,.5),cOut:v,sOut:g}}),u=[];for(let e=0;e<o;e++){let n=l[e],r=l[e+1],i=n.radiusMm>.001,a=r.radiusMm>.001,o=i?.28:0,d=a?.72:1,f=e===0?0:1;for(let e=f;e<=t;e++){let l=e/t,f;if(i&&l<o){let e=l/o;f=c(n.apex,n.cOut,n.sOut,e)}else if(a&&l>d){let e=(l-d)/(1-d);f=c(r.sIn,r.cIn,r.apex,e)}else{let e=Math.max(1e-6,d-o),t=(l-o)/e;f=s(n.sOut,r.sIn,t)}u.push(J(f.x,f.y,f.z))}}return u.length>0&&(u[0]=J(i.x,i.y,i.z),u[u.length-1]=J(a.x,a.y,a.z)),u}function pu(e){let t=0;for(let n=1;n<e.length;n++)t+=Hl(e[n-1],e[n]);return K(t)}function mu(e){let t=K(e*c+40);for(let e of s)if(e>=t)return{requiredLengthMm:t,recommendedCommercialMm:e};return{requiredLengthMm:t,recommendedCommercialMm:Math.ceil(t/500)*500}}function hu(e){let t=e.toLowerCase();return t.startsWith(`power-`)||t.includes(`c13`)||t.includes(`c14`)||t.includes(`schuko`)||t.includes(`dc-5525`)||t.includes(`usb-c`)}function gu(e,t,n){return t.is_passthrough_coupler&&n!==void 0?n:t.world_face===`rear`||e.face===`rear`||t.world_position.z>35?`rear`:`front`}function _u(e,t=`svg-dark`){let n=e.trim();if(!/^#[0-9a-fA-F]{6}$/.test(n))return e;let r=Number.parseInt(n.slice(1,3),16),i=Number.parseInt(n.slice(3,5),16),a=Number.parseInt(n.slice(5,7),16),o=e=>{let t=e/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4};if(.2126*o(r)+.7152*o(i)+.0722*o(a)>=(t===`svg-dark`?.12:.08))return e;let s=t===`svg-dark`?Math.min(232,Math.round(124+r*.56)):Math.min(210,Math.round(68+r*.65)),c=t===`svg-dark`?Math.min(236,Math.round(130+i*.56)):Math.min(215,Math.round(72+i*.65)),l=t===`svg-dark`?Math.min(242,Math.round(138+a*.58)):Math.min(225,Math.round(80+a*.68)),u=e=>e.toString(16).toUpperCase().padStart(2,`0`);return`#${u(s)}${u(c)}${u(l)}`}function vu(e,t,n,r){let i=0,a=1;for(let o of[`x`,`y`,`z`]){let s=n.min[o]-r,c=n.max[o]+r,l=e[o],u=t[o]-l;if(Math.abs(u)<1e-9){if(l<s||l>c)return!1}else{let e=1/u,t=(s-l)*e,n=(c-l)*e;if(t>n){let e=t;t=n,n=e}if(t>i&&(i=t),n<a&&(a=n),i>a)return!1}}return!0}var yu=new WeakMap;function bu(e){let t=yu.get(e);if(t!==void 0)return t;let n=1/0,r=-1/0,i=1/0,a=-1/0,o=1/0,s=-1/0;for(let t of e)t.x<n&&(n=t.x),t.x>r&&(r=t.x),t.y<i&&(i=t.y),t.y>a&&(a=t.y),t.z<o&&(o=t.z),t.z>s&&(s=t.z);let c=[],l=e.length;if(l>=2){let t=l<=128?1:2,n=e[0],r=e[Math.min(t,l-1)];for(let i=t;i<l-1;i+=t){let a=e[Math.min(i+t,l-1)],o=r.x-n.x,s=r.y-n.y,u=r.z-n.z,d=a.x-r.x,f=a.y-r.y,p=a.z-r.z,m=o*o+s*s+u*u,h=d*d+f*f+p*p,g=o*d+s*f+u*p,_=s*p-u*f,v=u*d-o*p,y=o*f-s*d,b=_*_+v*v+y*y;h<=1e-10||g>=0&&b<=1e-7*m*h||(c.push({p:n,q:r,minX:Math.min(n.x,r.x),maxX:Math.max(n.x,r.x),minY:Math.min(n.y,r.y),maxY:Math.max(n.y,r.y),minZ:Math.min(n.z,r.z),maxZ:Math.max(n.z,r.z)}),n=r),r=a}c.push({p:n,q:r,minX:Math.min(n.x,r.x),maxX:Math.max(n.x,r.x),minY:Math.min(n.y,r.y),maxY:Math.max(n.y,r.y),minZ:Math.min(n.z,r.z),maxZ:Math.max(n.z,r.z)})}let u={minX:n,maxX:r,minY:i,maxY:a,minZ:o,maxZ:s,segments:c};return yu.set(e,u),u}var xu=new WeakMap;function Su(e){let t=xu.get(e);if(t!==void 0)return t;let n=[],r=[];for(let t of e.devices){let i=t.blueprint.category;if(i!==`keystone-module`){let e=i===`brush-panel`||t.blueprint.geometry.has_cable_pass_through===!0,r=t.chassis_box;i===`modular-carrier`?r={min:t.chassis_box.min,max:J(t.chassis_box.max.x,Math.min(t.chassis_box.max.y,t.chassis_box.min.y+4.6),t.chassis_box.max.z)}:i===`shelf`&&(r={min:t.chassis_box.min,max:J(t.chassis_box.max.x,Math.min(t.chassis_box.max.y,t.chassis_box.min.y+13.5),t.chassis_box.max.z)}),n.push({instanceId:t.instance_id,isPassThroughDevice:e,uMin:t.u_range[0],uMax:t.u_range[1],box:r})}for(let n of t.ports){let t=n.world_position,i=n.world_face===`rear`&&t.z<e.rail_depth_mm-15?Math.max(24,Math.min(105,e.rail_depth_mm-10-t.z)):22,a=Bl(t,Vl(n.world_normal,i));r.push({pos:t,bootTip:a,minX:Math.min(t.x,a.x),maxX:Math.max(t.x,a.x),minY:Math.min(t.y,a.y),maxY:Math.max(t.y,a.y),minZ:Math.min(t.z,a.z),maxZ:Math.max(t.z,a.z)})}}let i={obstacles:n,portShafts:r};return xu.set(e,i),i}function Cu(e,t,n,r,i,a,o=null){if(e.length<2)return 10;let s=bu(e),{obstacles:c}=Su(t),l=[];for(let e of c)o!==null&&e.isPassThroughDevice&&o>=e.uMin&&o<=e.uMax||s.maxX+3.4<e.box.min.x||e.box.max.x+3.4<s.minX||s.maxY+3.4<e.box.min.y||e.box.max.y+3.4<s.minY||s.maxZ+3.4<e.box.min.z||e.box.max.z+3.4<s.minZ||l.push(e);if(l.length===0)return 10;let u=10,d=e.length<=128?1:2;for(let t=0;t<e.length-1;t+=d){let o=e[t],s=e[Math.min(t+d,e.length-1)],c={x:(o.x+s.x)*.5,y:(o.y+s.y)*.5,z:(o.z+s.z)*.5},f=Hl(c,i)<=15.5,p=Hl(c,a)<=15.5;for(let e of l)if(!(e.instanceId===n&&f||e.instanceId===r&&p)){if(vu(o,s,e.box,-.15))return-1;u>1.5&&vu(o,s,e.box,3.3)&&(u=1.5)}}return u}function wu(e,t,n,r){let i=t.x-e.x,a=t.y-e.y,o=t.z-e.z,s=r.x-n.x,c=r.y-n.y,l=r.z-n.z,u=e.x-n.x,d=e.y-n.y,f=e.z-n.z,p=i*i+a*a+o*o,m=s*s+c*c+l*l,h=s*u+c*d+l*f,g=0,_=0;if(p<=1e-6&&m<=1e-6)return Math.hypot(u,d,f);if(p<=1e-6)_=Math.max(0,Math.min(1,h/m));else{let e=i*u+a*d+o*f;if(m<=1e-6)g=Math.max(0,Math.min(1,-e/p));else{let t=i*s+a*c+o*l,n=p*m-t*t;n!==0&&(g=Math.max(0,Math.min(1,(t*h-e*m)/n))),_=(t*g+h)/m,_<0?(_=0,g=Math.max(0,Math.min(1,-e/p))):_>1&&(_=1,g=Math.max(0,Math.min(1,(t-e)/p)))}}return Math.hypot(u+i*g-s*_,d+a*g-c*_,f+o*g-l*_)}function Tu(e,t,n=6.2){if(t.length===0||e.length<2)return 1/0;let r=bu(e),i=n*.45,a=1/0;for(let e of t){let t=e.spline_points;if(t.length<2)continue;let n=bu(t);if(!(r.maxX+a<n.minX||n.maxX+a<r.minX||r.maxY+a<n.minY||n.maxY+a<r.minY||r.maxZ+a<n.minZ||n.maxZ+a<r.minZ)){for(let e of r.segments)if(!(e.maxX+a<n.minX||n.maxX+a<e.minX||e.maxY+a<n.minY||n.maxY+a<e.minY||e.maxZ+a<n.minZ||n.maxZ+a<e.minZ))for(let t of n.segments){if(e.maxX+a<t.minX||t.maxX+a<e.minX||e.maxY+a<t.minY||t.maxY+a<e.minY||e.maxZ+a<t.minZ||t.maxZ+a<e.minZ)continue;let n=wu(e.p,e.q,t.p,t.q);if(n<a&&(a=n,a<i))return a}}}return a}function Eu(e,t,n,r){if(e.length<2)return 1/0;let i=bu(e),{portShafts:a}=Su(t),o=1/0;for(let e of a)if(!(e.maxX+o<i.minX||i.maxX+o<e.minX||e.maxY+o<i.minY||i.maxY+o<e.minY||e.maxZ+o<i.minZ||i.maxZ+o<e.minZ)&&!(Hl(e.pos,n)<1||Hl(e.pos,r)<1))for(let t of i.segments){if(t.maxX+o<e.minX||e.maxX+o<t.minX||t.maxY+o<e.minY||e.maxY+o<t.minY||t.maxZ+o<e.minZ||e.maxZ+o<t.minZ)continue;let n=wu(t.p,t.q,e.pos,e.bootTip);if(n<o&&(o=n,o<3.5))return o}return o}function Du(e,t,n,r,i=1){let a=Math.min(t.y,r)-3.2,o=Math.max(t.y,r)+3.2,s=r=>{for(let i of e.devices)for(let e of i.ports)if(e.world_face===n&&!(Math.abs(e.world_position.x-t.x)<.5&&Math.abs(e.world_position.y-t.y)<.5)&&!(Math.abs(e.world_position.y-t.y)>38||Math.abs(e.world_position.z-t.z)>15)&&Math.abs(e.world_position.x-r)<6.8&&e.world_position.y>=a&&e.world_position.y<=o)return!0;return!1};if(!s(t.x))return t.x;let c=(e.panel_width_mm-e.aperture_width_mm)/2,l=G(c+5.5),u=G(e.panel_width_mm-c-5.5),d=e=>G(Math.max(l,Math.min(u,e))),f=i>=0?1:-1,p=d(t.x+f*7.8);if(!s(p))return p;let m=d(t.x-f*7.8);return s(m)?p:m}function Ou(e,t,n,r,i,a,o,s){let c=Math.min(r,i)-4,l=Math.max(r,i)+4;for(let r of e.devices)for(let e of r.ports){if(e.world_face!==t)continue;let r=e.world_position;if(!(Hl(r,o)<1||Hl(r,s)<1)&&Math.abs(r.y-n)<6.2&&r.x>=c&&r.x<=l&&(Math.abs(r.z-a)<35||Math.abs(r.z-o.z)<35||t===`rear`&&r.z>100&&r.z<=a))return!0}return!1}function ku(e,t,n,r=new Set){let i=Math.min(185,e.rail_depth_mm*.52),a=1/0,o=e.rail_depth_mm;for(let s of e.devices)s.u_range[1]<t||s.u_range[0]>n||(s.face===`front`?i=Math.max(i,s.chassis_box.max.z):s.face===`rear`&&!r.has(s.instance_id)&&(a=Math.min(a,s.chassis_box.min.z),o=Math.max(o,s.chassis_box.max.z)));return{maxFrontDeviceZ:i,minRearDeviceZ:a,maxRearDeviceZ:o}}function Au(e,t,n,r=1/0,i=e.rail_depth_mm,a=0,o=!1){let s=n*3%8;if(r<1/0){let c=Math.max(t+9.2,a),l=r-9.2;if(l>=c&&!o){let e=l-c;if(e>=5.5){let t=Math.min(8,Math.max(2,Math.floor(e/5.5)+1)),r=n*3%t;return{zRear:G(t<=1?(c+l)*.5:c+r*e/(t-1)),numPlanes:t}}let t=[.5,.15,.85,.35,.65,0,1,.5],r=t[n%t.length];return{zRear:G(c+e*r),numPlanes:4}}return{zRear:G(Math.max(i,e.rail_depth_mm)+9.5+s*6.5),numPlanes:8}}let c=Math.max(t+10,Math.min(e.rail_depth_mm-38,196)),l=Math.min(Math.max(c+21,e.rail_depth_mm-8.5),c+52);return{zRear:G(c+s*(Math.max(c+14,l)-c)/7),numPlanes:8}}function ju(t,n,r,i,a,o=`front`){let s=(t.u_range[0]-1)*e,c=t.u_range[1]*e;if(o===`rear`){if(t.u_range[1]-t.u_range[0]>=1){let e=n-s<38?[s+8,s+15.5,s+41.5,c-5.5]:[c-5.5,c-13,s+42.5,s+8],t=e[i%e.length];return G(Math.max(4,Math.min(a-4,t)))}let e=[c-4.5,c-11.5,Math.min(a-4,c+3),s+5.5],r=e[i%e.length];return G(Math.max(4,Math.min(a-4,r)))}let l=r>n+8?c<=a-3:r<n-8?!1:n-s>c-n,u=Math.min(a-4,c-3.6),d=Math.min(a-3,c+3.4),f=Math.min(a-4,c-7),p=Math.min(a-3,c+6.8),m=Math.max(4,s+3.6),h=Math.max(3,s-3.4),g=Math.max(4,s+7),_=Math.max(3,s-6.8),v=l?[u,d,f,p,m,h]:[m,h,g,_,u,d];return G(v[i%v.length])}function Mu(t,n,r,i,a,o=[]){let s=r.devices_by_id.get(t.from.instance_id),c=r.devices_by_id.get(t.to.instance_id);if(!s||!c)return null;let l=s.parent_carrier_id?r.devices_by_id.get(s.parent_carrier_id):void 0,u=c.parent_carrier_id?r.devices_by_id.get(c.parent_carrier_id):void 0,d=$l(s,t.from.port_id,t.from.face,l),f=$l(c,t.to.port_id,t.to.face,u);if(!d||!f)return null;let p=d.world_position,m=d.world_normal,h=f.world_position,g=f.world_normal,_=Bl(p,Vl(m,10)),v=Bl(h,Vl(g,10)),y=hu(t.cable_type),b=gu(s,d,t.from.face),x=gu(c,f,t.to.face),S=d.world_face===f.world_face,C=b===x,w=b===`rear`&&m.z<0,T=x===`rear`&&g.z<0,ee=Math.abs(p.y-h.y),te=Math.abs(p.x-h.x),ne=Math.abs(p.z-h.z),E=Math.abs(s.u_position-c.u_position),D=E<=1||E===2&&S&&b===`front`&&te<=55&&ee<=95&&s.parent_carrier_id===null&&c.parent_carrier_id===null,O=S&&b===`front`&&E===1&&s.parent_carrier_id===null&&c.parent_carrier_id===null;if(S&&C&&!w&&!T&&D&&ee<=95&&ne<=160&&(s.u_position!==c.u_position||s.face===c.face)&&(te<=55||s.u_position===c.u_position||O)){let n=`PATCH:${b}:${Math.min(s.u_position,c.u_position)}`,i=a.get(n)??0;a.set(n,i+1);let m=uu(i),g=Math.min(s.u_position,c.u_position),y=`BRIDGE:${b}:${g}`,x=a.get(y)??0;b===`front`&&(te>55||s.u_position===c.u_position)&&a.set(y,x+1);let S=Du(r,p,d.world_face,h.y,1),C=Du(r,h,f.world_face,p.y,1),w=S!==p.x||C!==h.x,T=t=>{if(b===`front`){if(te<=55&&s.u_position!==c.u_position){let e=w?[-24,-31,-38,-45,-17]:[-17,-24,-31,-38,-45],n=e[t%e.length],r=!w&&t===0?G(_.z-5):n,i=!w&&t===0?G(v.z-5):n,a=J(p.x,p.y,r),o=J(h.x,h.y,i),s=J(G((_.x+v.x)/2),G((_.y+v.y)/2),n);return[p,_,a,s,o,v,h]}let n=x+t,i=[-23.5,-29.8,-36.1,-42.4,-17.5,-45.5],a=i[n%i.length],o=[-3.6,3.6,-10.2,10.2,0,-6.8,6.8],l=s.u_position===c.u_position?G((g-1)*e+5+n%4*6.8):G(g*e+o[n%o.length]),u=Du(r,p,`front`,l,1),d=Du(r,h,`front`,l,1);return[p,_,J(p.x,p.y,a),J(u,p.y,a),J(u,l,a),J(d,l,a),J(d,h.y,a),J(h.x,h.y,a),v,h]}let n=i+t,a=G(Math.max(_.z,v.z)+10+n%6*6.8);if(te<=28&&ne<=15){let e=J(p.x,p.y,G(_.z+6)),t=J(h.x,h.y,G(v.z+6)),n=J(G((_.x+v.x)/2),G((_.y+v.y)/2),a);return[p,_,e,n,t,v,h]}if(s.u_position===c.u_position){if(!Ou(r,`rear`,p.y,p.x,h.x,a,p,h)&&Math.abs(p.y-h.y)<=6)return[p,_,J(p.x,p.y,a),J(h.x,h.y,a),v,h];let t=(l??s).u_range[1]*e,i=G(Math.min(t-3.5,Math.max(p.y,h.y)+8.5+n%2*6));return[p,_,J(p.x,p.y,a),J(p.x,i,a),J(h.x,i,a),J(h.x,h.y,a),v,h]}if(h.z>=r.rail_depth_mm-2&&p.z<r.rail_depth_mm-15){let e=G(_.z+8),t=u??c,n=G(h.y>=p.y?t.chassis_box.min.y-8.5:t.chassis_box.max.y+8.5);return[p,_,J(p.x,p.y,e),J(p.x,n,e),J(h.x,n,e),J(h.x,n,a),J(h.x,h.y,a),v,h]}if(p.z>=r.rail_depth_mm-2&&h.z<r.rail_depth_mm-15){let e=G(v.z+8),t=l??s,n=G(h.y>=p.y?t.chassis_box.max.y+8.5:t.chassis_box.min.y-8.5);return[p,_,J(p.x,p.y,a),J(p.x,n,a),J(p.x,n,e),J(h.x,n,e),J(h.x,h.y,e),v,h]}let o=J(p.x,p.y,a),d=J(h.x,h.y,a);return[p,_,o,J(h.x,p.y,a),d,v,h]},ee=T(0),E=fu(ee,8),D=Tu(E,o),O=Cu(E,r,s.instance_id,c.instance_id,p,h,null);if(D<6.2||O<9)for(let e=1;e<12;e++){let t=T(e),n=fu(t,8),i=Cu(n,r,s.instance_id,c.instance_id,p,h,null);if(i<O)continue;let a=Tu(n,o);if((i>O||i>=O&&a>D)&&(O=i,D=a,ee=t),D>=6.2&&O>=9)break}let re=fu(ee,32),ie=pu(re),{requiredLengthMm:k,recommendedCommercialMm:A}=mu(ie);return{cable_id:t.cable_id,cable_type:t.cable_type,color_hex:t.color_hex,label:t.label,route_case:`direct-vertical-patch`,assigned_ducts:[],bundle_index:i,bundle_offset_mm:m,portal_u:null,waypoints:du(ee),spline_points:re,raw_arc_length_mm:ie,required_length_mm:k,recommended_commercial_mm:A}}if(C){let n=t.routing_mode??`shortest-direct`,i=b===`front`?n===`left-duct`||n===`shortest-direct`&&y?`FL`:`FR`:n===`left-duct`||n===`shortest-direct`&&y?`RL`:`RR`,x=a.get(i)??0;a.set(i,x+1);let S=uu(x),C=b===`front`?`PLANE:FRONT`:`PLANE:REAR`,ee=a.get(C)??0,te=Math.min(s.u_position,c.u_position),ne=Math.max(s.u_position,c.u_position),E=h.x>=p.x?1:-1,D=h.y>=p.y?1:-1,O=G((r.panel_width_mm-r.aperture_width_mm)/2+6),re=[O,G(O+6.5),G(O+13)],ie=t=>{let i=ee+t,a=re[Math.floor(i/2)%re.length],o=G(a),y=G(r.panel_width_mm-a),S=Math.abs(p.x-o)+Math.abs(h.x-o)<=Math.abs(p.x-y)+Math.abs(h.x-y)?o:y,C=n===`left-duct`?o:n===`right-duct`?y:S;if(b===`front`){let a=[-24,-30.5,-37,-18.8,-43.5,-21.5,-27.2,-33.8],o=a[i%a.length],d=Du(r,p,`front`,h.y,E),f=Du(r,h,`front`,p.y,-E);if(n===`left-duct`||n===`right-duct`){let e=Math.floor(i/a.length),t=ju(l??s,p.y,h.y,e,r.total_height_mm,`front`),n=ju(u??c,h.y,p.y,e,r.total_height_mm,`front`);return[p,_,J(p.x,p.y,o),J(d,p.y,o),J(d,t,o),J(C,t,o),J(C,n,o),J(f,n,o),J(f,h.y,o),J(h.x,h.y,o),v,h]}if(Math.abs(d-f)<=16&&t<8)return[p,_,J(p.x,p.y,o),J(d,p.y,o),J(f,h.y,o),J(h.x,h.y,o),v,h];let m=Math.floor(t/a.length),g=((l??s).u_range[0]-1)*e,y=(l??s).u_range[1]*e,b=D>0?y+(m%2==0?-3.2:3.2):g+(m%2==0?3.2:-3.2),x=Math.min(p.y,h.y),S=Math.max(p.y,h.y),w=G(Math.max(x,Math.min(S,b)));return[p,_,J(p.x,p.y,o),J(d,p.y,o),J(d,w,o),J(f,w,o),J(f,h.y,o),J(h.x,h.y,o),v,h]}let O=p.z>=r.rail_depth_mm-5&&m.z>0,ie=h.z>=r.rail_depth_mm-5&&g.z>0,k=Du(r,p,d.world_face,h.y,E),A=Du(r,h,f.world_face,p.y,-E);if((w||T)&&!O&&!ie){let e=new Set;w&&e.add((l??s).instance_id),T&&e.add((u??c).instance_id);let n=ku(r,te,ne,e),i=Math.min(w?_.z:1/0,T?v.z:1/0,n.minRearDeviceZ-7.5),a=Math.max(w?0:_.z,T?0:v.z,n.maxFrontDeviceZ+7),o=[0,-5.5,5.5,-11,11,-16.5,16.5,-8.2],d=o[t%o.length],f;if(i>=a){let e=(a+i)*.5;f=G(Math.max(a,Math.min(i,e+d)))}else f=G(i);let m=w?Math.min(_.z,f):Math.max(_.z,f),g=T?Math.min(v.z,f):Math.max(v.z,f);return t%2==0?[p,_,J(p.x,p.y,m),J(k,p.y,m),J(k,h.y,m),J(k,h.y,g),J(h.x,h.y,g),v,h]:[p,_,J(p.x,p.y,m),J(A,p.y,m),J(A,h.y,m),J(A,h.y,g),J(h.x,h.y,g),v,h]}let j=ku(r,O&&D>0?Math.min(ne,(l??s).u_range[1]+1):ie&&D<0?Math.min(ne,(u??c).u_range[1]+1):te,O&&D<0?Math.max(te,(l??s).u_range[0]-1):ie&&D>0?Math.max(te,(u??c).u_range[0]-1):ne),ae=Math.max(O||w?0:_.z,ie||T?0:v.z),oe=Math.min(j.minRearDeviceZ,w?p.z-2.5:1/0,T?h.z-2.5:1/0),{zRear:M,numPlanes:se}=Au(r,j.maxFrontDeviceZ,i,oe,j.maxRearDeviceZ,ae,t>=16);if(n===`left-duct`||n===`right-duct`){let e=Math.floor(i/3)+t,n=ju(l??s,p.y,h.y,e,r.total_height_mm,`rear`),a=ju(u??c,h.y,p.y,e+1,r.total_height_mm,`rear`);return[p,_,J(p.x,p.y,M),J(k,p.y,M),J(k,n,M),J(C,n,M),J(C,a,M),J(A,a,M),J(A,h.y,M),J(h.x,h.y,M),v,h]}if(O){let e=G(_.z+4+i%4*6.5),n=l??s,a=(x+Math.floor(t/2))%4,o=n.chassis_box.max.y+9.5,c=n.chassis_box.min.y-9.5,u=D>=0?o+a*6:c-a*6,d=D>=0?Math.max(o,Math.min(Math.max(o,h.y),u)):Math.min(c,Math.max(Math.min(c,h.y),u)),f=G(Math.max(5.5,Math.min(r.total_height_mm-5.5,d)));if(t%2==1){if(!Ou(r,`rear`,h.y,k,h.x,M,p,h))return[p,_,J(p.x,p.y,e),J(k,p.y,e),J(k,f,e),J(k,f,M),J(k,h.y,M),J(h.x,h.y,M),v,h];let n=G(D>=0?Math.max(f,h.y-10.5-(t>>1)%3*6.5):Math.min(f,h.y+10.5+(t>>1)%3*6.5));return[p,_,J(p.x,p.y,e),J(k,p.y,e),J(k,f,e),J(k,f,M),J(k,n,M),J(A,n,M),J(A,h.y,M),J(h.x,h.y,M),v,h]}return[p,_,J(p.x,p.y,e),J(k,p.y,e),J(k,f,e),J(k,f,M),J(A,f,M),J(A,h.y,M),J(h.x,h.y,M),v,h]}if(ie){let e=G(v.z+4+i%4*6.5),n=u??c,a=(x+Math.floor(t/2))%4,o=n.chassis_box.min.y-9.5,s=n.chassis_box.max.y+9.5,l=D>=0?o-a*6:s+a*6,d=D>=0?Math.min(o,Math.max(Math.min(o,p.y),l)):Math.max(s,Math.min(Math.max(s,p.y),l)),f=G(Math.max(5.5,Math.min(r.total_height_mm-5.5,d)));return[p,_,J(p.x,p.y,M),J(k,p.y,M),J(k,f,M),J(A,f,M),J(A,f,e),J(A,h.y,e),J(h.x,h.y,e),v,h]}let ce=Math.floor(t/se),le=Ou(r,`rear`,p.y,p.x,A,M,p,h);if(ce===0){if(!le)return[p,_,J(p.x,p.y,M),J(A,p.y,M),J(A,h.y,M),J(h.x,h.y,M),v,h];let e=G(D>0?Math.min(h.y,p.y+9.5+t%3*6.5):Math.max(h.y,p.y-9.5-t%3*6.5));return[p,_,J(p.x,p.y,M),J(k,p.y,M),J(k,e,M),J(A,e,M),J(A,h.y,M),J(h.x,h.y,M),v,h]}if(ce===1){if(!Ou(r,`rear`,h.y,k,h.x,M,p,h)&&t%2==0)return[p,_,J(p.x,p.y,M),J(k,p.y,M),J(k,h.y,M),J(h.x,h.y,M),v,h];let e=G(D>0?Math.max(p.y,h.y-10.5-t%3*6.5):Math.min(p.y,h.y+10.5+t%3*6.5));return[p,_,J(p.x,p.y,M),J(k,p.y,M),J(k,e,M),J(A,e,M),J(A,h.y,M),J(h.x,h.y,M),v,h]}let ue=G(D>0?Math.min(h.y,p.y+16.5+t%4*6.8):Math.max(h.y,p.y-16.5-t%4*6.8));return[p,_,J(p.x,p.y,M),J(k,p.y,M),J(k,ue,M),J(A,ue,M),J(A,h.y,M),J(h.x,h.y,M),v,h]},k=0,A=ie(0),j=fu(A,8),ae=Tu(j,o),oe=Eu(j,r,p,h),M=Cu(j,r,s.instance_id,c.instance_id,p,h,null);if(M<9||ae<6.2||oe<5.2)for(let e=1;e<28;e++){let t=ie(e),n=fu(t,8),i=Cu(n,r,s.instance_id,c.instance_id,p,h,null);if(i<M)continue;let a=Tu(n,o),l=Eu(n,r,p,h),u=M>=9&&ae>=6.2&&oe>=5.2,d=i>=9&&a>=6.2&&l>=5.2,f=i>M,m=i>=M;if((f||m&&d&&!u||m&&!u&&a>=6.2&&ae<6.2||m&&!u&&a>ae&&l>=Math.min(oe,5.2))&&(M=i,ae=a,oe=l,k=e,A=t),M>=9&&ae>=6.2&&oe>=5.2)break}a.set(C,ee+k+1);let se=fu(A,32),ce=pu(se),{requiredLengthMm:le,recommendedCommercialMm:ue}=mu(ce);return{cable_id:t.cable_id,cable_type:t.cable_type,color_hex:t.color_hex,label:t.label,route_case:`same-face-duct`,assigned_ducts:[i],bundle_index:x,bundle_offset_mm:S,portal_u:null,waypoints:du(A),spline_points:se,raw_arc_length_mm:ce,required_length_mm:le,recommended_commercial_mm:ue}}let re=t.routing_mode??`shortest-direct`,ie=re===`left-duct`||re===`shortest-direct`&&y?`FL`:`FR`,k=re===`left-duct`||re===`shortest-direct`&&y?`RL`:`RR`,A=b===`front`?ie:k,j=x===`front`?ie:k,ae=`${A}->${j}`,oe=a.get(ae)??0;a.set(ae,oe+1);let M=uu(oe),se=r.devices.filter(e=>e.blueprint.category===`brush-panel`||e.blueprint.geometry.has_cable_pass_through===!0),ce=(s.u_position+c.u_position)/2,le=Math.min(s.u_position,c.u_position),ue=Math.max(s.u_position,c.u_position),de;if(t.preferred_portal_u!==void 0&&i.includes(t.preferred_portal_u))de=t.preferred_portal_u;else if(i.length>0){let e=e=>{let t=e<le?(le-e)*2:e>ue?(e-ue)*2:0,n=Math.abs(e-ce)*.25,r=se.some(t=>e>=t.u_range[0]&&e<=t.u_range[1]);return t+n-(r?.85:0)};de=i.reduce((t,n)=>e(n)<e(t)?n:t)}else de=se.length>0?se.reduce((e,t)=>Math.abs(t.u_position-ce)<Math.abs(e.u_position-ce)?t:e).u_position:t.preferred_portal_u??Math.max(1,Math.round(ce));let fe=b===`rear`?l??s:u??c,pe=b===`rear`?_.z:v.z,me=ku(r,Math.min(de,fe.u_range[0]),Math.max(de,fe.u_range[1])),he=a.get(`PLANE:FRONT`)??0,ge=a.get(`PLANE:REAR`)??0,_e=`PORTAL:${de}`,ve=a.get(_e)??0,ye=(r.panel_width_mm-r.aperture_width_mm)/2,be=G(ye+16),xe=G(r.panel_width_mm-ye-16),Se=t=>{let n=he+t,i=ge+t,a=ve+t,o=G((de-.5)*e+(a%3-1)*5),s=h.x>=p.x?1:-1,c=Du(r,p,d.world_face,o,t%2==0?s:-s),l=Du(r,h,f.world_face,o,t%2==0?-s:s),u;if(re===`left-duct`)u=G(be+a%6*7.5);else if(re===`right-duct`)u=G(xe-a%6*7.5);else{let e=Math.max(be,Math.min(xe,c)),n=[0,7.5,-7.5,15,-15,22.5,-22.5,30],r=n[Math.floor(t/2)%n.length]*s;u=G(Math.max(be,Math.min(xe,e+r)))}let m=[-24,-30.5,-37,-18.8,-43.5,-21.5,-27.2,-33.8],g=m[n%m.length],{zRear:y}=Au(r,Math.max(me.maxFrontDeviceZ,pe-4),i,me.minRearDeviceZ,me.maxRearDeviceZ),S=b===`front`?g:y,C=x===`front`?g:y,w=J(p.x,p.y,S),T=J(c,p.y,S),ee=Math.abs(u-c)<=1?[J(u,o,S)]:[J(c,o,S),J(u,o,S)],te=J(u,o,b===`front`?-2:17),ne=J(u,o,b===`front`?17:-2),E=J(u,o,C),D=Math.abs(u-l)<=1?[J(l,h.y,C),J(h.x,h.y,C)]:t%2==0?[J(l,o,C),J(l,h.y,C),J(h.x,h.y,C)]:[J(u,h.y,C),J(h.x,h.y,C)];return[p,_,w,T,...ee,te,ne,E,...D,v,h]},Ce=0,we=Se(0),Te=fu(we,8),Ee=Tu(Te,o),De=Eu(Te,r,p,h),Oe=Cu(Te,r,s.instance_id,c.instance_id,p,h,de);if(Oe<9||Ee<6.2||De<5.2)for(let e=1;e<28;e++){let t=Se(e),n=fu(t,8),i=Cu(n,r,s.instance_id,c.instance_id,p,h,de);if(i<Oe)continue;let a=Tu(n,o),l=Eu(n,r,p,h),u=Oe>=9&&Ee>=6.2&&De>=5.2,d=i>=9&&a>=6.2&&l>=5.2,f=i>Oe,m=i>=Oe;if((f||m&&d&&!u||m&&!u&&a>=6.2&&Ee<6.2||m&&!u&&a>Ee&&l>=Math.min(De,5.2))&&(Oe=i,Ee=a,De=l,Ce=e,we=t),Oe>=9&&Ee>=6.2&&De>=5.2)break}a.set(`PLANE:FRONT`,he+Ce+1),a.set(`PLANE:REAR`,ge+Ce+1),a.set(_e,ve+Ce+1);let ke=fu(we,32),Ae=pu(ke),{requiredLengthMm:je,recommendedCommercialMm:Me}=mu(Ae);return{cable_id:t.cable_id,cable_type:t.cable_type,color_hex:t.color_hex,label:t.label,route_case:`cross-face-portal`,assigned_ducts:[A,j],bundle_index:oe,bundle_offset_mm:M,portal_u:de,waypoints:du(we),spline_points:ke,raw_arc_length_mm:Ae,required_length_mm:je,recommended_commercial_mm:Me}}function Nu(e,t,n){let r=n??tu(e,t),i=nu(e,r),a=new Map,o=[];for(let t of e.cables){let n=Mu(t,e,r,i,a,o);n&&o.push(n)}return o}var Pu=.001,Fu=.01;function Iu(e){return{instance_id:e.instance_id,blueprint_slug:e.blueprint_slug,slot_id:e.slot_id,...e.hostname===void 0?{}:{hostname:e.hostname}}}function Lu(e,t){let n=e.mounted_devices.map(e=>{let n=t.get(e.instance_id),r=e.children.map(Iu);return{instance_id:e.instance_id,blueprint_slug:e.blueprint_slug,u_position:n?n.u_position:e.u_position,face:n?n.face:e.face,children:r,...e.hostname===void 0?{}:{hostname:e.hostname}}});return{schema_version:e.schema_version,project_name:e.project_name,rack:{...e.rack},mounted_devices:n,cables:e.cables.map(e=>({...e,from:{...e.from},to:{...e.to}})),external_endpoints:e.external_endpoints.map(e=>({...e}))}}function Ru(e){let t=new Map;for(let n of e.mounted_devices)t.set(n.instance_id,{u_position:n.u_position,face:n.face});return t}function zu(e,t){return e===void 0?`compute`:e.category===`ups`||e.power_and_thermal.electrical_role===`ups`?`ups`:e.category===`pdu`||e.power_and_thermal.electrical_role===`pdu`?`pdu`:e.category===`patch-panel`?`patch-panel`:e.category===`brush-panel`||e.geometry.has_cable_pass_through===!0?`brush-panel`:e.category===`blank-panel`||e.category===`blanking-panel`?`blank-panel`:e.category===`switch`||e.power_and_thermal.electrical_role===`pse-switch`?`switch`:e.category===`router`?`router`:e.category===`nas`||t>=2500?`heavy-floor`:`compute`}function Bu(e,t,n,r){if(t===void 0)return{inwardFrontMm:0,inwardRearMm:0,frontProtrusionTotalMm:0};let i=t.geometry.depth_mm+t.geometry.rear_protrusion_mm,o=t.geometry.front_protrusion_mm,s=new Map;s.set(e.instance_id,t);for(let n of e.children){let e=ql(r,n.blueprint_slug);if(e===void 0)continue;s.set(n.instance_id,e);let a=t.slots.find(e=>e.slot_id===n.slot_id)?.offset_mm.z??0;i=Math.max(i,a+e.geometry.depth_mm+e.geometry.rear_protrusion_mm),o=Math.max(o,e.geometry.front_protrusion_mm-a)}let c=0,l=0,u=0;for(let e of n.cables){let t=[e.from,e.to];for(let n of t){let t=s.get(n.instance_id);if(t===void 0)continue;let r=t.ports.find(e=>e.port_id===n.port_id);if(r===void 0)continue;let i=a(r.connector_type,e.cable_type);r.is_passthrough_coupler||t.is_passthrough_coupler||r.capabilities.includes(`passthrough-coupler`)||t.category===`keystone-module`&&t.ports.length===1?n.face===`rear`?c=Math.max(c,i):n.face===`front`?(l=Math.max(l,i),u=Math.max(u,i)):r.face===`rear`?c=Math.max(c,i):u=Math.max(u,i):r.face===`rear`?(c=Math.max(c,i),l=Math.max(l,i)):u=Math.max(u,i)}}return{inwardFrontMm:G(i+c),inwardRearMm:G(i+l),frontProtrusionTotalMm:G(Math.max(o,u))}}function Vu(e,t,n){let r=new Set;for(let t of e.cables)r.add(t.from.instance_id),r.add(t.to.instance_id);let i=new Set(e.external_endpoints.map(e=>e.patch_panel_instance_id));return e.mounted_devices.map((a,o)=>{let s=ql(t,a.blueprint_slug),c=s?Math.max(1,Math.ceil(s.geometry.u_height)):1,l=s?.geometry.weight_grams??0,u=s?.power_and_thermal.max_system_watts??0,d=r.has(a.instance_id),f=!1;for(let e of a.children){n.has(e.instance_id)&&(f=!0),r.has(e.instance_id)&&(d=!0);let i=ql(t,e.blueprint_slug);i&&(l+=i.geometry.weight_grams,u+=i.power_and_thermal.max_system_watts)}let p=s===void 0||n.has(a.instance_id)||f,m=zu(s,l),h=s!==void 0&&s.power_and_thermal.airflow===`passive-convection`&&u>=35,g=a.face===`rear`||m===`pdu`&&s!==void 0&&s.mount_type!==`shelf-standing`&&s.mount_type!==`sub-module`&&s.geometry.depth_mm<e.rack.rail_depth_mm,_=a.face===`front`||s!==void 0&&s.geometry.ear_mount_style!==`rear-rail-mount`,v=Bu(a,s,e,t);return{index:o,device:a,blueprint:s,pinned:p,uSpan:c,totalWeightGrams:l,totalMaxWatts:u,isPassiveHighHeat:h,role:m,rearMountable:g,frontMountable:_,inwardDepthFrontMm:v.inwardFrontMm,inwardDepthRearMm:v.inwardRearMm,frontProtrusionTotalMm:v.frontProtrusionTotalMm,hasCables:d,hasExternalEndpoints:i.has(a.instance_id)}})}function Hu(e){let t=new Map;for(let n of e.mounted_devices){t.set(n.instance_id,n.instance_id);for(let e of n.children)t.set(e.instance_id,n.instance_id)}let n=new Map,r=(e,t,r)=>{if(e===t)return;let i=n.get(e);i||(i=new Map,n.set(e,i)),i.set(t,(i.get(t)??0)+r);let a=n.get(t);a||(a=new Map,n.set(t,a)),a.set(e,(a.get(e)??0)+r)};for(let n of e.cables){let e=t.get(n.from.instance_id),i=t.get(n.to.instance_id);e!==void 0&&i!==void 0&&r(e,i,n.cable_type.startsWith(`power-`)?.5:2)}return n}function Uu(e,t,n,r){let i=new Map,a=new Map;for(let r of e.mounted_devices){i.set(r.instance_id,r.instance_id);let e=n.get(r.instance_id);e?.blueprint!==void 0&&a.set(r.instance_id,e.blueprint);for(let e of r.children){i.set(e.instance_id,r.instance_id);let n=ql(t,e.blueprint_slug);n!==void 0&&a.set(e.instance_id,n)}}let o=(e,t,n,r)=>{if(n!==void 0)return n;let i=a.get(e)?.ports.find(e=>e.port_id===t)?.face??`front`;return r===`front`?i:i===`front`?`rear`:`front`};for(let t of e.cables){let e=i.get(t.from.instance_id),a=i.get(t.to.instance_id);if(e===void 0||a===void 0)continue;let s=n.get(e),c=n.get(a);if(s===void 0||c===void 0)continue;let l=r.get(e)?.face??s.device.face,u=r.get(a)?.face??c.device.face;if(l!==u||o(t.from.instance_id,t.from.port_id,t.from.face,l)!==o(t.to.instance_id,t.to.port_id,t.to.face,u))return!0}return!1}function Wu(e,t){let n=0;for(let r of e.mounted_devices){let e=t.get(r.instance_id);e!==void 0&&(e.role===`ups`?n+=(r.u_position-1)*150:e.role===`heavy-floor`&&(n+=(r.u_position-1)*60))}return n}function Gu(e,t,n){let r=Math.max(0,e.normalized_cog_y-.45),i=t!==void 0&&n!==void 0?Wu(t,n):0;return e.error_count*1e6+e.warning_count*1e4+r*5e3+e.total_cable_length_mm+i}function Ku(e,t,n,r){let i=0,a=e.rack.u_height,o=Math.ceil(a/2),s=[];for(let n of e.mounted_devices)t.get(n.instance_id)?.role===`patch-panel`&&s.push(n.u_position);for(let n of e.mounted_devices){let c=t.get(n.instance_id);if(c===void 0)continue;let l=n.u_position+c.uSpan-1;if(c.role===`ups`)i+=(n.u_position-1)*(20+c.totalWeightGrams/500);else if(c.role===`heavy-floor`)i+=(n.u_position-1)*(5+c.totalWeightGrams/1e3);else if(c.role===`patch-panel`)i+=(a-l)*3;else if(c.role===`switch`||c.role===`router`){if(s.length>0&&c.role===`switch`){let e=a;for(let t of s)e=Math.min(e,Math.abs(n.u_position-t));i+=Math.max(0,e-1)*4}i+=(a-l)*.2}else if(c.role===`brush-panel`)i+=Math.abs(n.u_position-o)*1.5;else if(c.role===`pdu`){if(n.face===`rear`){let r=e.mounted_devices.filter(e=>{if(e.face!==`front`)return!1;let r=t.get(e.instance_id),i=e.u_position+(r?.uSpan??1)-1;return Math.max(n.u_position,e.u_position)<=Math.min(l,i)});if(r.length===0)i-=.5;else{let e=t.get(r[0].instance_id)?.role;e===`blank-panel`||e===`brush-panel`||e===`patch-panel`?i-=.4:i+=2}}else i+=1}let u=r.get(n.instance_id);u!==void 0&&(u.u_position!==n.u_position||u.face!==n.face)&&(i+=.01)}let c=nu(e,n);if(c.length>0&&e.cables.length>0){let e=c.reduce((e,t)=>Math.abs(t-o)<Math.abs(e-o)?t:e);i+=Math.abs(e-o)*.05}return K(i)}function qu(e,t,n,r){let i=tu(e,t),a=lu(e,t,i),o=K(Nu(e,t,i).reduce((e,t)=>e+t.raw_arc_length_mm,0)),s={error_count:a.error_count,warning_count:a.warning_count,normalized_cog_y:a.mechanical_summary.normalized_cog_y,total_cable_length_mm:o};return{project:e,geometry:i,validation:a,metrics:s,primaryScore:Gu(s,e,n),zoningScore:Ku(e,n,i,r)}}function Ju(e,t){return e.primaryScore<t.primaryScore-Pu||Math.abs(e.primaryScore-t.primaryScore)<=Pu&&e.zoningScore<t.zoningScore-Pu}function Yu(e,t){return e.metrics.error_count>t.metrics.error_count||e.metrics.error_count===t.metrics.error_count&&e.metrics.warning_count>t.metrics.warning_count?!1:Ju(e,t)}function Xu(e,t,n,r,i,a){let o=i+r.uSpan-1;if(i<1||o>n.u_height||a===`front`&&n.enclosure_type===`closed-glass-front`&&r.frontProtrusionTotalMm>n.front_door_clearance_mm+Fu)return!1;let s=a===`front`?r.inwardDepthFrontMm:r.inwardDepthRearMm;for(let[c,l]of e.entries()){if(c===r.device.instance_id)continue;let e=t.get(c);if(e===void 0)continue;let u=l.u_position+e.uSpan-1;if(Math.max(i,l.u_position)<=Math.min(o,u)&&(l.face===a||s+(l.face===`front`?e.inwardDepthFrontMm:e.inwardDepthRearMm)>n.rail_depth_mm-Fu))return!1}return!0}function Zu(e,t,n,r,i,a){let o=i+r.uSpan-1;if(i<1||o>n.u_height)return 1e6;let s=a===`front`?r.inwardDepthFrontMm:r.inwardDepthRearMm,c=0;for(let[l,u]of e.entries()){if(l===r.device.instance_id)continue;let e=t.get(l);if(e===void 0)continue;let d=u.u_position+e.uSpan-1,f=Math.min(o,d)-Math.max(i,u.u_position)+1;if(!(f<=0)){if(u.face===a)c+=1e4*f;else{let t=s+(u.face===`front`?e.inwardDepthFrontMm:e.inwardDepthRearMm)-n.rail_depth_mm;t>0&&(c+=1e3+t)}}}return c}function Qu(e,t,n,r,i){for(let a of i)if(Xu(e,t,n,r,a.u_position,a.face))return a;let a=i[0]??{u_position:Math.min(Math.max(1,r.device.u_position),Math.max(1,n.u_height-r.uSpan+1)),face:r.device.face},o=1/0;for(let s of i){let i=Zu(e,t,n,r,s.u_position,s.face);i<o&&(o=i,a=s)}return a}function $u(e,t,n){let r=new Map,i=e.project.rack,a=new Set;for(let t of e.validation.issues)if(t.code===`CHASSIS_COLLISION`||t.code===`PLUG_CLEARANCE_COLLISION`||t.code===`OUT_OF_RACK_BOUNDS`||t.code===`TOP_HEAVY_RACK`||t.code===`NO_FRONT_TO_REAR_PORTAL`||t.code===`THERMAL_HOTSPOT_STACKING`)for(let e of t.affected_instances)a.add(e);for(let e of t)e.pinned&&r.set(e.device.instance_id,{u_position:e.device.u_position,face:e.device.face});for(let e of t)e.pinned||a.has(e.device.instance_id)||Xu(r,n,i,e,e.device.u_position,e.device.face)&&r.set(e.device.instance_id,{u_position:e.device.u_position,face:e.device.face});let o=t.filter(e=>!r.has(e.device.instance_id));o.sort((e,t)=>{let n=e=>{switch(e){case`ups`:return 0;case`heavy-floor`:return 1;case`patch-panel`:return 2;case`switch`:return 3;case`brush-panel`:return 4;case`compute`:case`router`:return 5;case`pdu`:return 6;case`blank-panel`:return 7}},r=n(e.role)-n(t.role);return r===0?e.index-t.index:r});let s=Math.ceil(i.u_height/2);for(let e of o){let t=Math.max(1,i.u_height-e.uSpan+1),a=[],o=[];for(let e=1;e<=t;e++)o.push(e);if(e.role===`ups`||e.role===`heavy-floor`?o.sort((e,t)=>e-t):e.role===`patch-panel`||e.role===`switch`?o.sort((e,t)=>t-e):e.role===`brush-panel`?o.sort((e,t)=>Math.abs(e-s)-Math.abs(t-s)):o.sort((t,n)=>Math.abs(t-e.device.u_position)-Math.abs(n-e.device.u_position)),e.role===`pdu`&&e.rearMountable){let t=[...o].sort((t,i)=>{let a=e=>{let t=0;for(let[i,a]of r.entries()){if(a.face!==`front`)continue;let r=n.get(i);r&&e>=a.u_position&&e<=a.u_position+r.uSpan-1&&(t=Math.max(t,r.inwardDepthFrontMm))}return t},o=a(t),s=a(i);return o===s?Math.abs(t-e.device.u_position)-Math.abs(i-e.device.u_position):o-s});for(let e of t)a.push({u_position:e,face:`rear`});if(e.frontMountable)for(let e of o)a.push({u_position:e,face:`front`})}else{let t=e.device.face===`rear`&&e.rearMountable?`rear`:`front`;for(let e of o)a.push({u_position:e,face:t})}let c=Qu(r,n,i,e,a);r.set(e.device.instance_id,c)}return r}function ed(e,t,n,r,i){let a=n+r-1;for(let[r,o]of e.entries()){let e=t.get(r);if(e===void 0||!e.isPassiveHighHeat||o.face!==i)continue;let s=o.u_position+e.uSpan-1;if(o.u_position===a+1||n===s+1)return!0}return!1}function td(e,t,n,r,i,a){let o=e.rack,s=new Map;for(let e of n)e.pinned&&s.set(e.device.instance_id,{u_position:e.device.u_position,face:e.device.face});let c=n.filter(e=>!e.pinned),l=c.filter(e=>e.role===`ups`).sort((e,t)=>t.totalWeightGrams===e.totalWeightGrams?t.uSpan===e.uSpan?e.device.instance_id.localeCompare(t.device.instance_id):t.uSpan-e.uSpan:t.totalWeightGrams-e.totalWeightGrams),u=c.filter(e=>e.role===`heavy-floor`).sort((e,t)=>t.totalWeightGrams===e.totalWeightGrams?e.device.instance_id.localeCompare(t.device.instance_id):t.totalWeightGrams-e.totalWeightGrams),d=c.filter(e=>e.role===`patch-panel`).sort((e,t)=>e.hasExternalEndpoints===t.hasExternalEndpoints?e.device.instance_id.localeCompare(t.device.instance_id):e.hasExternalEndpoints?-1:1),f=c.filter(e=>e.role===`brush-panel`).sort((e,t)=>e.device.instance_id.localeCompare(t.device.instance_id)),p=c.filter(e=>e.role===`switch`||e.role===`router`).sort((e,t)=>{let n=e=>e===`switch`?0:1,a=n(e.role)-n(t.role);if(a!==0)return a;let o=e=>{let t=i.get(e);if(!t)return 0;let n=0;for(let[e,i]of t.entries())r.get(e)?.role===`patch-panel`?n+=i*10:n+=i;return n},s=o(t.device.instance_id)-o(e.device.instance_id);return s===0?e.device.instance_id.localeCompare(t.device.instance_id):s}),m=c.filter(e=>e.role===`compute`).sort((e,t)=>t.totalWeightGrams===e.totalWeightGrams?e.device.instance_id.localeCompare(t.device.instance_id):t.totalWeightGrams-e.totalWeightGrams),h=c.filter(e=>e.role===`blank-panel`).sort((e,t)=>e.device.instance_id.localeCompare(t.device.instance_id)),g=c.filter(e=>e.role===`pdu`).sort((e,t)=>e.device.instance_id.localeCompare(t.device.instance_id)),_=(e,t,n,i,c)=>{let l=[],u=[];for(let o of t){if(i!==null&&e.role!==`brush-panel`&&i>=o&&i<=o+e.uSpan-1)continue;let t={u_position:o,face:n};a.separatePassiveHotspots&&e.isPassiveHighHeat&&ed(s,r,o,e.uSpan,n)?l.push(t):u.push(t)}let d=[...u,...l];if(i!==null)for(let r of t)i>=r&&i<=r+e.uSpan-1&&d.push({u_position:r,face:n});if(c!==void 0)for(let e of t)d.push({u_position:e,face:c});let f=Qu(s,r,o,e,d);s.set(e.device.instance_id,f)},v=e=>{let t=Math.max(1,o.u_height-e+1),n=[];for(let e=1;e<=t;e++)n.push(e);return n},y=e=>v(e).reverse(),b=n.filter(e=>e.role!==`blank-panel`&&e.role!==`pdu`&&(!e.pinned||e.device.face===`front`)).reduce((e,t)=>e+t.uSpan,0),x=e.cables.length>0&&(g.length>0||n.some(e=>e.device.face===`rear`)||Uu(e,t,r,s)),S=Math.ceil(o.u_height/2),C=null;a.reserveMidPortalGap&&x&&f.length===0&&!n.some(e=>e.pinned&&e.role===`brush-panel`)&&b<o.u_height&&(C=v(1).filter(e=>{for(let t of n)if(t.pinned&&t.device.face===`front`&&e>=t.device.u_position&&e<=t.device.u_position+t.uSpan-1)return!1;return!0}).sort((e,t)=>Math.abs(e-S)-Math.abs(t-S))[0]??null);for(let e of l)_(e,v(e.uSpan),e.device.face===`rear`&&!e.frontMountable?`rear`:`front`,C);for(let e of u)_(e,v(e.uSpan),e.device.face===`rear`&&!e.frontMountable?`rear`:`front`,C);for(let e of d)_(e,y(e.uSpan),e.device.face===`rear`&&!e.frontMountable?`rear`:`front`,C);for(let e of p){let t=i.get(e.device.instance_id),n=[];if(t)for(let[e,i]of t.entries()){let t=s.get(e),o=r.get(e);if(t!==void 0&&o!==void 0){let e=o.role===`patch-panel`?8:o.role===`switch`?4:a.clusterAroundPinned&&o.pinned?5:1;n.push({u:t.u_position,weight:i*e})}}if(n.length===0)for(let[e,t]of s.entries())r.get(e)?.role===`patch-panel`&&n.push({u:t.u_position,weight:5});let o=y(e.uSpan);if(n.length>0){let e=n.reduce((e,t)=>e+t.weight,0),t=n.reduce((e,t)=>e+t.u*t.weight,0)/e;o.sort((e,n)=>{let r=Math.abs(e-t),i=Math.abs(n-t);return Math.abs(r-i)>.25?r-i:n-e})}_(e,o,e.device.face===`rear`&&!e.frontMountable?`rear`:`front`,C)}for(let e of f)_(e,v(e.uSpan).sort((e,t)=>Math.abs(e-S)-Math.abs(t-S)),`front`,null);for(let e of m)_(e,v(e.uSpan),e.device.face===`rear`&&e.rearMountable?`rear`:`front`,C);let w=[],T=[];for(let e of g)e.rearMountable&&(a.preferRearForAllPdus||e.device.face===`rear`)?T.push(e):w.push(e);for(let e of T){let t=v(e.uSpan),n=t=>{let n=t+e.uSpan-1,a=0,o=0;for(let[e,i]of s.entries()){if(i.face!==`front`)continue;let s=r.get(e);if(!s)continue;let c=i.u_position+s.uSpan-1;Math.max(t,i.u_position)<=Math.min(n,c)&&(a=Math.max(a,s.inwardDepthFrontMm),(s.role===`blank-panel`||s.role===`brush-panel`||s.role===`patch-panel`)&&(o-=10))}let c=0,l=i.get(e.device.instance_id);if(l)for(let[e,n]of l.entries()){let r=s.get(e);r&&(c+=Math.abs(t-r.u_position)*n*2)}return a+o+c};t.sort((e,t)=>n(e)-n(t));let a=t.map(e=>({u_position:e,face:`rear`}));if(e.frontMountable)for(let t of v(e.uSpan))a.push({u_position:t,face:`front`});let c=Qu(s,r,o,e,a);s.set(e.device.instance_id,c)}for(let e of w)_(e,v(e.uSpan),`front`,C,e.rearMountable?`rear`:void 0);for(let e of h)_(e,v(e.uSpan).sort((e,t)=>{let n=e=>{for(let[t,n]of s.entries())if(n.face===`rear`&&r.get(t)?.role===`pdu`){let i=r.get(t);if(e>=n.u_position&&e<=n.u_position+i.uSpan-1)return!0}return!1},i=+!n(e),a=+!n(t);return i===a?Math.abs(t-S)-Math.abs(e-S):i-a}),`front`,C);return s}function nd(e,t,n,r,i){let a=tu(e,t),o=lu(e,t,a),s=Math.max(0,o.mechanical_summary.normalized_cog_y-.45);if(o.error_count*1e6+o.warning_count*1e4+s*5e3+Wu(e,n)>i+Pu)return;let c=K(Nu(e,t,a).reduce((e,t)=>e+t.raw_arc_length_mm,0)),l={error_count:o.error_count,warning_count:o.warning_count,normalized_cog_y:o.mechanical_summary.normalized_cog_y,total_cable_length_mm:c};return{project:e,geometry:a,validation:o,metrics:l,primaryScore:Gu(l,e,n),zoningScore:Ku(e,n,a,r)}}function rd(e,t,n,r,i){let a=e,o=a.project.rack,s=n.filter(e=>!e.pinned);if(s.length===0)return a;for(let e=0;e<3;e++){let e=!1,n=Ru(a.project);for(let c of s){let s=n.get(c.device.instance_id);if(s===void 0)continue;let l=c.role===`pdu`&&c.rearMountable||c.device.face===`rear`?c.frontMountable?[`rear`,`front`]:[`rear`]:[`front`],u=Math.max(1,o.u_height-c.uSpan+1),d;for(let e of l)for(let l=1;l<=u;l++){if(l===s.u_position&&e===s.face||!Xu(n,r,o,c,l,e))continue;let u=new Map(n);u.set(c.device.instance_id,{u_position:l,face:e});let f=Lu(a.project,u),p=d??a,m=nd(f,t,r,i,p.primaryScore);m!==void 0&&Ju(m,p)&&(d=m)}if(d!==void 0){a=d;let t=Ru(a.project).get(c.device.instance_id);t&&n.set(c.device.instance_id,t),e=!0}}for(let c=0;c<s.length;c++){let l=s[c],u=n.get(l.device.instance_id);if(u!==void 0)for(let d=c+1;d<s.length;d++){let c=s[d],f=n.get(c.device.instance_id);if(f===void 0||u.face!==f.face)continue;let p=new Map(n);if(p.delete(l.device.instance_id),p.delete(c.device.instance_id),!Xu(p,r,o,l,f.u_position,u.face)||(p.set(l.device.instance_id,{u_position:f.u_position,face:u.face}),!Xu(p,r,o,c,u.u_position,f.face)))continue;p.set(c.device.instance_id,{u_position:u.u_position,face:f.face});let m=nd(Lu(a.project,p),t,r,i,a.primaryScore);if(m!==void 0&&Ju(m,a)){a=m,n.set(l.device.instance_id,{u_position:f.u_position,face:u.face}),n.set(c.device.instance_id,{u_position:u.u_position,face:f.face}),e=!0;break}}}let c=s.filter(e=>e.uSpan===2),l=new Map;for(let e of s)if(e.uSpan===1){let t=n.get(e.device.instance_id);t&&l.set(`${t.face}:${t.u_position}`,e)}for(let s of c){let c=n.get(s.device.instance_id);if(c)for(let u=1;u<=o.u_height-1;u++){let d=l.get(`${c.face}:${u}`),f=l.get(`${c.face}:${u+1}`);if(!d||!f)continue;let p=new Map(n);if(p.delete(s.device.instance_id),p.delete(d.device.instance_id),p.delete(f.device.instance_id),!Xu(p,r,o,s,u,c.face)||(p.set(s.device.instance_id,{u_position:u,face:c.face}),!Xu(p,r,o,d,c.u_position,c.face))||(p.set(d.device.instance_id,{u_position:c.u_position,face:c.face}),!Xu(p,r,o,f,c.u_position+1,c.face)))continue;p.set(f.device.instance_id,{u_position:c.u_position+1,face:c.face});let m=nd(Lu(a.project,p),t,r,i,a.primaryScore);if(m!==void 0&&Ju(m,a)){a=m,n.set(s.device.instance_id,{u_position:u,face:c.face}),n.set(d.device.instance_id,{u_position:c.u_position,face:c.face}),n.set(f.device.instance_id,{u_position:c.u_position+1,face:c.face}),l.delete(`${c.face}:${u}`),l.delete(`${c.face}:${u+1}`),l.set(`${c.face}:${c.u_position}`,d),l.set(`${c.face}:${c.u_position+1}`,f),e=!0;break}}}if(!e)break}return a}function id(e,t,n,r,i,a,o){let s=e.device.instance_id,c=a.some(e=>e.affected_instances.includes(s)&&(e.code===`CHASSIS_COLLISION`||e.code===`OUT_OF_RACK_BOUNDS`)),l=a.some(e=>e.affected_instances.includes(s)&&e.code===`PLUG_CLEARANCE_COLLISION`),u=a.some(e=>e.code===`NO_FRONT_TO_REAR_PORTAL`),d=a.some(e=>e.affected_instances.includes(s)&&e.code===`THERMAL_HOTSPOT_STACKING`);return e.role===`pdu`&&i===`rear`?l||r!==i?`Assigned rear-face PDU behind shallow/empty front slot at U${n} to prevent Z-depth and plug clearance collisions`:`Relocated rear-face PDU from U${t} to U${n} behind shallow front clearance`:c?`Relocated from U${t} (${r}) to collision-free slot U${n} (${i})`:l?`Moved from U${t} (${r}) to U${n} (${i}) to eliminate plug clearance collision`:(e.role===`ups`||e.role===`heavy-floor`)&&n<t?`Lowered heavy ${e.role===`ups`?`UPS`:`equipment`} (${e.totalWeightGrams}g) from U${t} to U${n} to bring normalized CoG to ${o.metrics.normalized_cog_y}`:e.role===`brush-panel`&&u?`Positioned brush-panel at mid-height U${n} to restore front-to-rear cable portal`:e.role===`patch-panel`?`Positioned patch panel at U${n} in upper wiring zone`:e.role===`switch`||e.role===`router`?`Clustered ${e.role} at U${n} adjacent to connected patch panel/peers to minimize cable spans`:d?`Separated passive high-heat device from U${t} to U${n} to eliminate thermal hotspot stacking`:`Optimized placement from U${t} (${r}) to U${n} (${i}) for improved layout score`}function ad(e,t,n){let r=Jc.parse(e),i=Vu(r,t,new Set(n?.pin_instance_ids??[])),a=new Map(i.map(e=>[e.device.instance_id,e])),o=Ru(r),s=qu(r,t,a,o);if(i.length===0||i.every(e=>e.pinned))return{optimized_project:r,moved_devices:[],metrics_before:s.metrics,metrics_after:s.metrics,improved:!1};let c=Hu(r),l=[$u(s,i,a)];for(let e of[{preferRearForAllPdus:!0,reserveMidPortalGap:!0,separatePassiveHotspots:!0,clusterAroundPinned:!0},{preferRearForAllPdus:!1,reserveMidPortalGap:!0,separatePassiveHotspots:!0,clusterAroundPinned:!0},{preferRearForAllPdus:!0,reserveMidPortalGap:!1,separatePassiveHotspots:!1,clusterAroundPinned:!0},{preferRearForAllPdus:!0,reserveMidPortalGap:!0,separatePassiveHotspots:!0,clusterAroundPinned:!1}])l.push(td(r,t,i,a,c,e));let u=[s],d=new Set,f=e=>i.map(t=>{let n=e.get(t.device.instance_id);return`${t.device.instance_id}@${n?.u_position??t.device.u_position}:${n?.face??t.device.face}`}).join(`|`);d.add(f(o));for(let e of l){let n=f(e);if(d.has(n))continue;d.add(n);let i=Lu(r,e);u.push(qu(i,t,a,o))}u.sort((e,t)=>Math.abs(e.primaryScore-t.primaryScore)>Pu?e.primaryScore-t.primaryScore:e.zoningScore-t.zoningScore);let p=[];u[0]!==void 0&&p.push(u[0]),u[0]!==s&&p.push(s);let m=s;for(let e of p){let n=rd(e,t,i,a,o);Ju(n,m)&&(m=n)}if(!Yu(m,s))return{optimized_project:r,moved_devices:[],metrics_before:s.metrics,metrics_after:s.metrics,improved:!1};let h=[];for(let e=0;e<r.mounted_devices.length;e++){let t=r.mounted_devices[e],n=m.project.mounted_devices[e];if(t.u_position!==n.u_position||t.face!==n.face){let e=a.get(t.instance_id);h.push({instance_id:t.instance_id,from_u:t.u_position,to_u:n.u_position,from_face:t.face,to_face:n.face,reason:id(e,t.u_position,n.u_position,t.face,n.face,s.validation.issues,m)})}}return h.length===0?{optimized_project:r,moved_devices:[],metrics_before:s.metrics,metrics_after:s.metrics,improved:!1}:{optimized_project:m.project,moved_devices:h,metrics_before:s.metrics,metrics_after:m.metrics,improved:!0}}function od(e){let t={};for(let[n,r]of e.geometry.devices_by_id.entries())n!==`__proto__`&&n!==`constructor`&&n!==`prototype`&&Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0});return{project:e.project,geometry:{rack:e.geometry.rack,panel_width_mm:e.geometry.panel_width_mm,aperture_width_mm:e.geometry.aperture_width_mm,total_height_mm:e.geometry.total_height_mm,rail_depth_mm:e.geometry.rail_depth_mm,devices:e.geometry.devices,devices_by_id:t},validation:e.validation,cable_routes:e.cable_routes}}function sd(e){let t=new Map;for(let[n,r]of Object.entries(e.geometry.devices_by_id))n!==`__proto__`&&n!==`constructor`&&n!==`prototype`&&t.set(n,r);for(let n of e.geometry.devices)t.has(n.instance_id)||t.set(n.instance_id,n);return{project:e.project,geometry:{rack:e.geometry.rack,panel_width_mm:e.geometry.panel_width_mm,aperture_width_mm:e.geometry.aperture_width_mm,total_height_mm:e.geometry.total_height_mm,rail_depth_mm:e.geometry.rail_depth_mm,devices:e.geometry.devices,devices_by_id:t},validation:e.validation,cable_routes:e.cable_routes}}function cd(e,t){if(e.rack.standard!==t.rack.standard||e.rack.u_height!==t.rack.u_height||e.rack.rail_depth_mm!==t.rack.rail_depth_mm||e.rack.enclosure_type!==t.rack.enclosure_type||e.rack.front_door_clearance_mm!==t.rack.front_door_clearance_mm||e.rack.rear_clearance_mm!==t.rack.rear_clearance_mm||e.mounted_devices.length!==t.mounted_devices.length||e.cables.length!==t.cables.length)return!1;for(let n=0;n<e.mounted_devices.length;n++){let r=e.mounted_devices[n],i=t.mounted_devices[n];if(r===void 0||i===void 0||r.instance_id!==i.instance_id||r.blueprint_slug!==i.blueprint_slug||r.u_position!==i.u_position||r.face!==i.face||r.children.length!==i.children.length)return!1;for(let e=0;e<r.children.length;e++){let t=r.children[e],n=i.children[e];if(t===void 0||n===void 0||t.instance_id!==n.instance_id||t.blueprint_slug!==n.blueprint_slug||t.slot_id!==n.slot_id)return!1}}for(let n=0;n<e.cables.length;n++){let r=e.cables[n],i=t.cables[n];if(r===void 0||i===void 0||r.cable_id!==i.cable_id||r.cable_type!==i.cable_type||r.preferred_portal_u!==i.preferred_portal_u||(r.routing_mode??`shortest-direct`)!==(i.routing_mode??`shortest-direct`)||r.from.instance_id!==i.from.instance_id||r.from.port_id!==i.from.port_id||r.from.face!==i.from.face||r.to.instance_id!==i.to.instance_id||r.to.port_id!==i.to.port_id||r.to.face!==i.to.face)return!1}return!0}function ld(e,t,n){let r=Jc.parse(e),i=tu(r,t),a=lu(r,t,i),o;if(n!==void 0&&cd(n.project,r)){let e=new Map(r.cables.map(e=>[e.cable_id,e]));o=n.cable_routes.map(t=>{let n=e.get(t.cable_id);return n===void 0?t:{...t,color_hex:n.color_hex,label:n.label}})}else o=Nu(r,t,i);return{project:r,geometry:i,validation:a,cable_routes:o}}var ud=Symbol.for(`yaml.alias`),dd=Symbol.for(`yaml.document`),fd=Symbol.for(`yaml.map`),pd=Symbol.for(`yaml.pair`),md=Symbol.for(`yaml.scalar`),hd=Symbol.for(`yaml.seq`),gd=Symbol.for(`yaml.node.type`),_d=e=>!!e&&typeof e==`object`&&e[gd]===ud,vd=e=>!!e&&typeof e==`object`&&e[gd]===dd,yd=e=>!!e&&typeof e==`object`&&e[gd]===fd,Y=e=>!!e&&typeof e==`object`&&e[gd]===pd,X=e=>!!e&&typeof e==`object`&&e[gd]===md,bd=e=>!!e&&typeof e==`object`&&e[gd]===hd;function Z(e){if(e&&typeof e==`object`)switch(e[gd]){case fd:case hd:return!0}return!1}function Q(e){if(e&&typeof e==`object`)switch(e[gd]){case ud:case fd:case md:case hd:return!0}return!1}var xd=e=>(X(e)||Z(e))&&!!e.anchor,Sd=Symbol(`break visit`),Cd=Symbol(`skip children`),wd=Symbol(`remove node`);function Td(e,t){let n=Dd(t);vd(e)?Ed(null,e.contents,n,Object.freeze([e]))===wd&&(e.contents=null):Ed(null,e,n,Object.freeze([]))}Td.BREAK=Sd,Td.SKIP=Cd,Td.REMOVE=wd;function Ed(e,t,n,r){let i=Od(e,t,n,r);if(Q(i)||Y(i))return kd(e,r,i),Ed(e,i,n,r);if(typeof i!=`symbol`){if(Z(t)){r=Object.freeze(r.concat(t));for(let e=0;e<t.items.length;++e){let i=Ed(e,t.items[e],n,r);if(typeof i==`number`)e=i-1;else if(i===Sd)return Sd;else i===wd&&(t.items.splice(e,1),--e)}}else if(Y(t)){r=Object.freeze(r.concat(t));let e=Ed(`key`,t.key,n,r);if(e===Sd)return Sd;e===wd&&(t.key=null);let i=Ed(`value`,t.value,n,r);if(i===Sd)return Sd;i===wd&&(t.value=null)}}return i}function Dd(e){return typeof e==`object`&&(e.Collection||e.Node||e.Value)?Object.assign({Alias:e.Node,Map:e.Node,Scalar:e.Node,Seq:e.Node},e.Value&&{Map:e.Value,Scalar:e.Value,Seq:e.Value},e.Collection&&{Map:e.Collection,Seq:e.Collection},e):e}function Od(e,t,n,r){if(typeof n==`function`)return n(e,t,r);if(yd(t))return n.Map?.(e,t,r);if(bd(t))return n.Seq?.(e,t,r);if(Y(t))return n.Pair?.(e,t,r);if(X(t))return n.Scalar?.(e,t,r);if(_d(t))return n.Alias?.(e,t,r)}function kd(e,t,n){let r=t[t.length-1];if(Z(r))r.items[e]=n;else if(Y(r))e===`key`?r.key=n:r.value=n;else if(vd(r))r.contents=n;else{let e=_d(r)?`alias`:`scalar`;throw Error(`Cannot replace node with ${e} parent`)}}var Ad={"!":`%21`,",":`%2C`,"[":`%5B`,"]":`%5D`,"{":`%7B`,"}":`%7D`},jd=e=>e.replace(/[!,[\]{}]/g,e=>Ad[e]),Md=class e{constructor(t,n){this.docStart=null,this.docEnd=!1,this.yaml=Object.assign({},e.defaultYaml,t),this.tags=Object.assign({},e.defaultTags,n)}clone(){let t=new e(this.yaml,this.tags);return t.docStart=this.docStart,t}atDocument(){let t=new e(this.yaml,this.tags);switch(this.yaml.version){case`1.1`:this.atNextDocument=!0;break;case`1.2`:this.atNextDocument=!1,this.yaml={explicit:e.defaultYaml.explicit,version:`1.2`},this.tags=Object.assign({},e.defaultTags)}return t}add(t,n){this.atNextDocument&&=(this.yaml={explicit:e.defaultYaml.explicit,version:`1.1`},this.tags=Object.assign({},e.defaultTags),!1);let r=t.trim().split(/[ \t]+/),i=r.shift();switch(i){case`%TAG`:{if(r.length!==2&&(n(0,`%TAG directive should contain exactly two parts`),r.length<2))return!1;let[e,t]=r;return this.tags[e]=t,!0}case`%YAML`:{if(this.yaml.explicit=!0,r.length!==1)return n(0,`%YAML directive should contain exactly one part`),!1;let[e]=r;if(e===`1.1`||e===`1.2`)return this.yaml.version=e,!0;{let t=/^\d+\.\d+$/.test(e);return n(6,`Unsupported YAML version ${e}`,t),!1}}default:return n(0,`Unknown directive ${i}`,!0),!1}}tagName(e,t){if(e===`!`)return`!`;if(e[0]!==`!`)return t(`Not a valid tag: ${e}`),null;if(e[1]===`<`){let n=e.slice(2,-1);return n===`!`||n===`!!`?(t(`Verbatim tags aren't resolved, so ${e} is invalid.`),null):(e[e.length-1]!==`>`&&t(`Verbatim tags must end with a >`),n)}let[,n,r]=e.match(/^(.*!)([^!]*)$/s);r||t(`The ${e} tag has no suffix`);let i=this.tags[n];if(i)try{return i+decodeURIComponent(r)}catch(e){return t(String(e)),null}return n===`!`?e:(t(`Could not resolve tag: ${e}`),null)}tagString(e){for(let[t,n]of Object.entries(this.tags))if(e.startsWith(n))return t+jd(e.substring(n.length));return e[0]===`!`?e:`!<${e}>`}toString(e){let t=this.yaml.explicit?[`%YAML ${this.yaml.version||`1.2`}`]:[],n=Object.entries(this.tags),r;if(e&&n.length>0&&Q(e.contents)){let t={};Td(e.contents,(e,n)=>{Q(n)&&n.tag&&(t[n.tag]=!0)}),r=Object.keys(t)}else r=[];for(let[i,a]of n)i===`!!`&&a===`tag:yaml.org,2002:`||e&&!r.some(e=>e.startsWith(a))||t.push(`%TAG ${i} ${a}`);return t.join(`
`)}};Md.defaultYaml={explicit:!1,version:`1.2`},Md.defaultTags={"!!":`tag:yaml.org,2002:`};function Nd(e){if(/[\x00-\x19\s,[\]{}]/.test(e)){let t=`Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;throw Error(t)}return!0}function Pd(e){let t=new Set;return Td(e,{Value(e,n){n.anchor&&t.add(n.anchor)}}),t}function Fd(e,t){for(let n=1;;++n){let r=`${e}${n}`;if(!t.has(r))return r}}function Id(e,t){let n=[],r=new Map,i=null;return{onAnchor:r=>{n.push(r),i??=Pd(e);let a=Fd(t,i);return i.add(a),a},setAnchors:()=>{for(let e of n){let t=r.get(e);if(typeof t==`object`&&t.anchor&&(X(t.node)||Z(t.node)))t.node.anchor=t.anchor;else{let t=Error(`Failed to resolve repeated object (this should not happen)`);throw t.source=e,t}}},sourceObjects:r}}function Ld(e,t,n,r){if(r&&typeof r==`object`){if(Array.isArray(r))for(let t=0,n=r.length;t<n;++t){let n=r[t],i=Ld(e,r,String(t),n);i===void 0?delete r[t]:i!==n&&(r[t]=i)}else if(r instanceof Map)for(let t of Array.from(r.keys())){let n=r.get(t),i=Ld(e,r,t,n);i===void 0?r.delete(t):i!==n&&r.set(t,i)}else if(r instanceof Set)for(let t of Array.from(r)){let n=Ld(e,r,t,t);n===void 0?r.delete(t):n!==t&&(r.delete(t),r.add(n))}else for(let[t,n]of Object.entries(r)){let i=Ld(e,r,t,n);i===void 0?delete r[t]:i!==n&&(r[t]=i)}}return e.call(t,n,r)}function Rd(e,t,n){if(Array.isArray(e))return e.map((e,t)=>Rd(e,String(t),n));if(e&&typeof e.toJSON==`function`){if(!n||!xd(e))return e.toJSON(t,n);let r={aliasCount:0,count:1,res:void 0};n.anchors.set(e,r),n.onCreate=e=>{r.res=e,delete n.onCreate};let i=e.toJSON(t,n);return n.onCreate&&n.onCreate(i),i}return typeof e==`bigint`&&!n?.keep?Number(e):e}var zd=class{constructor(e){Object.defineProperty(this,gd,{value:e})}clone(){let e=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return this.range&&(e.range=this.range.slice()),e}toJS(e,{mapAsMap:t,maxAliasCount:n,onAnchor:r,reviver:i}={}){if(!vd(e))throw TypeError(`A document argument is required`);let a={anchors:new Map,doc:e,keep:!0,mapAsMap:t===!0,mapKeyWarned:!1,maxAliasCount:typeof n==`number`?n:100},o=Rd(this,``,a);if(typeof r==`function`)for(let{count:e,res:t}of a.anchors.values())r(t,e);return typeof i==`function`?Ld(i,{"":o},``,o):o}},Bd=class extends zd{constructor(e){super(ud),this.source=e,Object.defineProperty(this,"tag",{set(){throw Error(`Alias nodes cannot have tags`)}})}resolve(e,t){if(t?.maxAliasCount===0)throw ReferenceError(`Alias resolution is disabled`);let n;t?.aliasResolveCache?n=t.aliasResolveCache:(n=[],Td(e,{Node:(e,t)=>{(_d(t)||xd(t))&&n.push(t)}}),t&&(t.aliasResolveCache=n));let r;for(let e of n){if(e===this)break;e.anchor===this.source&&(r=e)}if(r&&t){let{anchors:e,doc:n,maxAliasCount:i}=t,a=e.get(r);if(a||=(Rd(r,null,t),e.get(r)),a?.res===void 0)throw ReferenceError(`This should not happen: Alias anchor was not resolved?`);if(i>=0&&(a.count+=1,a.aliasCount===0&&(a.aliasCount=Vd(n,r,e)),a.count*a.aliasCount>i))throw ReferenceError(`Excessive alias count indicates a resource exhaustion attack`)}return r}toJSON(e,t){if(!t)return{source:this.source};let n=this.resolve(t.doc,t);if(!n){let e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw ReferenceError(e)}return t.anchors.get(n).res}toString(e,t,n){let r=`*${this.source}`;if(e){if(Nd(this.source),e.options.verifyAliasOrder&&!e.anchors.has(this.source)){let e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw Error(e)}if(e.implicitKey)return`${r} `}return r}};function Vd(e,t,n){if(_d(t)){let r=t.resolve(e),i=n&&r&&n.get(r);return i?i.count*i.aliasCount:0}if(Z(t)){let r=0;for(let i of t.items){let t=Vd(e,i,n);t>r&&(r=t)}return r}if(Y(t)){let r=Vd(e,t.key,n),i=Vd(e,t.value,n);return Math.max(r,i)}return 1}var Hd=e=>!e||typeof e!=`function`&&typeof e!=`object`,$=class extends zd{constructor(e){super(md),this.value=e}toJSON(e,t){return t?.keep?this.value:Rd(this.value,e,t)}toString(){return String(this.value)}};$.BLOCK_FOLDED=`BLOCK_FOLDED`,$.BLOCK_LITERAL=`BLOCK_LITERAL`,$.PLAIN=`PLAIN`,$.QUOTE_DOUBLE=`QUOTE_DOUBLE`,$.QUOTE_SINGLE=`QUOTE_SINGLE`;var Ud=`tag:yaml.org,2002:`;function Wd(e,t,n){if(t){let e=n.filter(e=>e.tag===t),r=e.find(e=>!e.format)??e[0];if(!r)throw Error(`Tag ${t} not found`);return r}return n.find(t=>t.identify?.(e)&&!t.format)}function Gd(e,t,n){if(vd(e)&&(e=e.contents),Q(e))return e;if(Y(e)){let t=n.schema[fd].createNode?.(n.schema,null,n);return t.items.push(e),t}(e instanceof String||e instanceof Number||e instanceof Boolean||typeof BigInt<`u`&&e instanceof BigInt)&&(e=e.valueOf());let{aliasDuplicateObjects:r,onAnchor:i,onTagObj:a,schema:o,sourceObjects:s}=n,c;if(r&&e&&typeof e==`object`){if(c=s.get(e),c)return c.anchor??(c.anchor=i(e)),new Bd(c.anchor);c={anchor:null,node:null},s.set(e,c)}t?.startsWith(`!!`)&&(t=Ud+t.slice(2));let l=Wd(e,t,o.tags);if(!l){if(e&&typeof e.toJSON==`function`&&(e=e.toJSON()),!e||typeof e!=`object`){let t=new $(e);return c&&(c.node=t),t}l=e instanceof Map?o[fd]:Symbol.iterator in Object(e)?o[hd]:o[fd]}a&&(a(l),delete n.onTagObj);let u=l?.createNode?l.createNode(n.schema,e,n):typeof l?.nodeClass?.from==`function`?l.nodeClass.from(n.schema,e,n):new $(e);return t?u.tag=t:l.default||(u.tag=l.tag),c&&(c.node=u),u}function Kd(e,t,n){let r=n;for(let e=t.length-1;e>=0;--e){let n=t[e];if(typeof n==`number`&&Number.isInteger(n)&&n>=0){let e=[];e[n]=r,r=e}else r=new Map([[n,r]])}return Gd(r,void 0,{aliasDuplicateObjects:!1,keepUndefined:!1,onAnchor:()=>{throw Error(`This should not happen, please report a bug.`)},schema:e,sourceObjects:new Map})}var qd=e=>e==null||typeof e==`object`&&!!e[Symbol.iterator]().next().done,Jd=class extends zd{constructor(e,t){super(e),Object.defineProperty(this,"schema",{value:t,configurable:!0,enumerable:!1,writable:!0})}clone(e){let t=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return e&&(t.schema=e),t.items=t.items.map(t=>Q(t)||Y(t)?t.clone(e):t),this.range&&(t.range=this.range.slice()),t}addIn(e,t){if(qd(e))this.add(t);else{let[n,...r]=e,i=this.get(n,!0);if(Z(i))i.addIn(r,t);else if(i===void 0&&this.schema)this.set(n,Kd(this.schema,r,t));else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`)}}deleteIn(e){let[t,...n]=e;if(n.length===0)return this.delete(t);let r=this.get(t,!0);if(Z(r))return r.deleteIn(n);throw Error(`Expected YAML collection at ${t}. Remaining path: ${n}`)}getIn(e,t){let[n,...r]=e,i=this.get(n,!0);return r.length===0?!t&&X(i)?i.value:i:Z(i)?i.getIn(r,t):void 0}hasAllNullValues(e){return this.items.every(t=>{if(!Y(t))return!1;let n=t.value;return n==null||e&&X(n)&&n.value==null&&!n.commentBefore&&!n.comment&&!n.tag})}hasIn(e){let[t,...n]=e;if(n.length===0)return this.has(t);let r=this.get(t,!0);return Z(r)?r.hasIn(n):!1}setIn(e,t){let[n,...r]=e;if(r.length===0)this.set(n,t);else{let e=this.get(n,!0);if(Z(e))e.setIn(r,t);else if(e===void 0&&this.schema)this.set(n,Kd(this.schema,r,t));else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`)}}},Yd=e=>e.replace(/^(?!$)(?: $)?/gm,`#`);function Xd(e,t){return/^\n+$/.test(e)?e.substring(1):t?e.replace(/^(?! *$)/gm,t):e}var Zd=(e,t,n)=>e.endsWith(`
`)?Xd(n,t):n.includes(`
`)?`
`+Xd(n,t):(e.endsWith(` `)?``:` `)+n,Qd=`flow`,$d=`block`,ef=`quoted`;function tf(e,t,n=`flow`,{indentAtStart:r,lineWidth:i=80,minContentWidth:a=20,onFold:o,onOverflow:s}={}){if(!i||i<0)return e;i<a&&(a=0);let c=Math.max(1+a,1+i-t.length);if(e.length<=c)return e;let l=[],u={},d=i-t.length;typeof r==`number`&&(r>i-Math.max(2,a)?l.push(0):d=i-r);let f,p,m=!1,h=-1,g=-1,_=-1;n===`block`&&(h=nf(e,h,t.length),h!==-1&&(d=h+c));for(let r;r=e[h+=1];){if(n===`quoted`&&r===`\\`){switch(g=h,e[h+1]){case`x`:h+=3;break;case`u`:h+=5;break;case`U`:h+=9;break;default:h+=1}_=h}if(r===`
`)n===`block`&&(h=nf(e,h,t.length)),d=h+t.length+c,f=void 0;else{if(r===` `&&p&&p!==` `&&p!==`
`&&p!==`	`){let t=e[h+1];t&&t!==` `&&t!==`
`&&t!==`	`&&(f=h)}if(h>=d){if(f)l.push(f),d=f+c,f=void 0;else if(n===`quoted`){for(;p===` `||p===`	`;)p=r,r=e[h+=1],m=!0;let t=h>_+1?h-2:g-1;if(u[t])return e;l.push(t),u[t]=!0,d=t+c,f=void 0}else m=!0}}p=r}if(m&&s&&s(),l.length===0)return e;o&&o();let v=e.slice(0,l[0]);for(let r=0;r<l.length;++r){let i=l[r],a=l[r+1]||e.length;i===0?v=`\n${t}${e.slice(0,a)}`:(n===`quoted`&&u[i]&&(v+=`${e[i]}\\`),v+=`\n${t}${e.slice(i+1,a)}`)}return v}function nf(e,t,n){let r=t,i=t+1,a=e[i];for(;a===` `||a===`	`;)if(t<i+n)a=e[++t];else{do a=e[++t];while(a&&a!==`
`);r=t,i=t+1,a=e[i]}return r}var rf=(e,t)=>({indentAtStart:t?e.indent.length:e.indentAtStart,lineWidth:e.options.lineWidth,minContentWidth:e.options.minContentWidth}),af=e=>/^(%|---|\.\.\.)/m.test(e);function of(e,t,n){if(!t||t<0)return!1;let r=t-n,i=e.length;if(i<=r)return!1;for(let t=0,n=0;t<i;++t)if(e[t]===`
`){if(t-n>r)return!0;if(n=t+1,i-n<=r)return!1}return!0}function sf(e,t){let n=JSON.stringify(e);if(t.options.doubleQuotedAsJSON)return n;let{implicitKey:r}=t,i=t.options.doubleQuotedMinMultiLineLength,a=t.indent||(af(e)?`  `:``),o=``,s=0;for(let e=0,t=n[e];t;t=n[++e])if(t===` `&&n[e+1]===`\\`&&n[e+2]===`n`&&(o+=n.slice(s,e)+`\\ `,e+=1,s=e,t=`\\`),t===`\\`)switch(n[e+1]){case`u`:{o+=n.slice(s,e);let t=n.substr(e+2,4);switch(t){case`0000`:o+=`\\0`;break;case`0007`:o+=`\\a`;break;case`000b`:o+=`\\v`;break;case`001b`:o+=`\\e`;break;case`0085`:o+=`\\N`;break;case`00a0`:o+=`\\_`;break;case`2028`:o+=`\\L`;break;case`2029`:o+=`\\P`;break;default:t.substr(0,2)===`00`?o+=`\\x`+t.substr(2):o+=n.substr(e,6)}e+=5,s=e+1}break;case`n`:if(r||n[e+2]===`"`||n.length<i)e+=1;else{for(o+=n.slice(s,e)+`

`;n[e+2]===`\\`&&n[e+3]===`n`&&n[e+4]!==`"`;)o+=`
`,e+=2;o+=a,n[e+2]===` `&&(o+=`\\`),e+=1,s=e+1}break;default:e+=1}return o=s?o+n.slice(s):n,r?o:tf(o,a,ef,rf(t,!1))}function cf(e,t){if(t.options.singleQuote===!1||t.implicitKey&&e.includes(`
`)||/[ \t]\n|\n[ \t]/.test(e))return sf(e,t);let n=t.indent||(af(e)?`  `:``),r=`'`+e.replace(/'/g,`''`).replace(/\n+/g,`$&\n${n}`)+`'`;return t.implicitKey?r:tf(r,n,Qd,rf(t,!1))}function lf(e,t){let{singleQuote:n}=t.options,r;if(n===!1)r=sf;else{let t=e.includes(`"`),i=e.includes(`'`);r=t&&!i?cf:i&&!t?sf:n?cf:sf}return r(e,t)}var uf;try{uf=RegExp(`(^|(?<!
))
+(?!
|$)`,`g`)}catch{uf=/\n+(?!\n|$)/g}function df({comment:e,type:t,value:n},r,i,a){let{blockQuote:o,commentString:s,lineWidth:c}=r.options;if(!o||/\n[\t ]+$/.test(n))return lf(n,r);let l=r.indent||(r.forceBlockIndent||af(n)?`  `:``),u=o===`literal`?!0:o===`folded`||t===$.BLOCK_FOLDED?!1:t===$.BLOCK_LITERAL||!of(n,c,l.length);if(!n)return u?`|
`:`>
`;let d,f;for(f=n.length;f>0;--f){let e=n[f-1];if(e!==`
`&&e!==`	`&&e!==` `)break}let p=n.substring(f),m=p.indexOf(`
`);m===-1?d=`-`:n===p||m!==p.length-1?(d=`+`,a&&a()):d=``,p&&=(n=n.slice(0,-p.length),p[p.length-1]===`
`&&(p=p.slice(0,-1)),p.replace(uf,`$&${l}`));let h=!1,g,_=-1;for(g=0;g<n.length;++g){let e=n[g];if(e===` `)h=!0;else if(e===`
`)_=g;else break}let v=n.substring(0,_<g?_+1:g);v&&=(n=n.substring(v.length),v.replace(/\n+/g,`$&${l}`));let y=(h?l?`2`:`1`:``)+d;if(e&&(y+=` `+s(e.replace(/ ?[\r\n]+/g,` `)),i&&i()),!u){let e=n.replace(/\n+/g,`
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g,`$1$2`).replace(/\n+/g,`$&${l}`),i=!1,a=rf(r,!0);o!==`folded`&&t!==$.BLOCK_FOLDED&&(a.onOverflow=()=>{i=!0});let s=tf(`${v}${e}${p}`,l,$d,a);if(!i)return`>${y}\n${l}${s}`}return n=n.replace(/\n+/g,`$&${l}`),`|${y}\n${l}${v}${n}${p}`}function ff(e,t,n,r){let{type:i,value:a}=e,{actualString:o,implicitKey:s,indent:c,indentStep:l,inFlow:u}=t;if(s&&a.includes(`
`)||u&&/[[\]{},]/.test(a))return lf(a,t);if(/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a))return s||u||!a.includes(`
`)?lf(a,t):df(e,t,n,r);if(!s&&!u&&i!==$.PLAIN&&a.includes(`
`))return df(e,t,n,r);if(af(a)){if(c===``)return t.forceBlockIndent=!0,df(e,t,n,r);if(s&&c===l)return lf(a,t)}let d=a.replace(/\n+/g,`$&\n${c}`);if(o){let e=e=>e.default&&e.tag!==`tag:yaml.org,2002:str`&&e.test?.test(d),{compat:n,tags:r}=t.doc.schema;if(r.some(e)||n?.some(e))return lf(a,t)}return s?d:tf(d,c,Qd,rf(t,!1))}function pf(e,t,n,r){let{implicitKey:i,inFlow:a}=t,o=typeof e.value==`string`?e:Object.assign({},e,{value:String(e.value)}),{type:s}=e;s!==$.QUOTE_DOUBLE&&/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value)&&(s=$.QUOTE_DOUBLE);let c=e=>{switch(e){case $.BLOCK_FOLDED:case $.BLOCK_LITERAL:return i||a?lf(o.value,t):df(o,t,n,r);case $.QUOTE_DOUBLE:return sf(o.value,t);case $.QUOTE_SINGLE:return cf(o.value,t);case $.PLAIN:return ff(o,t,n,r);default:return null}},l=c(s);if(l===null){let{defaultKeyType:e,defaultStringType:n}=t.options,r=i&&e||n;if(l=c(r),l===null)throw Error(`Unsupported default string type ${r}`)}return l}function mf(e,t){let n=Object.assign({blockQuote:!0,commentString:Yd,defaultKeyType:null,defaultStringType:`PLAIN`,directives:null,doubleQuotedAsJSON:!1,doubleQuotedMinMultiLineLength:40,falseStr:`false`,flowCollectionPadding:!0,indentSeq:!0,lineWidth:80,minContentWidth:20,nullStr:`null`,simpleKeys:!1,singleQuote:null,trailingComma:!1,trueStr:`true`,verifyAliasOrder:!0},e.schema.toStringOptions,t),r;switch(n.collectionStyle){case`block`:r=!1;break;case`flow`:r=!0;break;default:r=null}return{anchors:new Set,doc:e,flowCollectionPadding:n.flowCollectionPadding?` `:``,indent:``,indentStep:typeof n.indent==`number`?` `.repeat(n.indent):`  `,inFlow:r,options:n}}function hf(e,t){if(t.tag){let n=e.filter(e=>e.tag===t.tag);if(n.length>0)return n.find(e=>e.format===t.format)??n[0]}let n,r;if(X(t)){r=t.value;let i=e.filter(e=>e.identify?.(r));if(i.length>1){let e=i.filter(e=>e.test);e.length>0&&(i=e)}n=i.find(e=>e.format===t.format)??i.find(e=>!e.format)}else r=t,n=e.find(e=>e.nodeClass&&r instanceof e.nodeClass);if(!n){let e=r?.constructor?.name??(r===null?`null`:typeof r);throw Error(`Tag not resolved for ${e} value`)}return n}function gf(e,t,{anchors:n,doc:r}){if(!r.directives)return``;let i=[],a=(X(e)||Z(e))&&e.anchor;a&&Nd(a)&&(n.add(a),i.push(`&${a}`));let o=e.tag??(t.default?null:t.tag);return o&&i.push(r.directives.tagString(o)),i.join(` `)}function _f(e,t,n,r){if(Y(e))return e.toString(t,n,r);if(_d(e)){if(t.doc.directives)return e.toString(t);if(t.resolvedAliases?.has(e))throw TypeError(`Cannot stringify circular structure without alias nodes`);t.resolvedAliases?t.resolvedAliases.add(e):t.resolvedAliases=new Set([e]),e=e.resolve(t.doc)}let i,a=Q(e)?e:t.doc.createNode(e,{onTagObj:e=>i=e});i??=hf(t.doc.schema.tags,a);let o=gf(a,i,t);o.length>0&&(t.indentAtStart=(t.indentAtStart??0)+o.length+1);let s=typeof i.stringify==`function`?i.stringify(a,t,n,r):X(a)?pf(a,t,n,r):a.toString(t,n,r);return o?X(a)||s[0]===`{`||s[0]===`[`?`${o} ${s}`:`${o}\n${t.indent}${s}`:s}function vf({key:e,value:t},n,r,i){let{allNullValues:a,doc:o,indent:s,indentStep:c,options:{commentString:l,indentSeq:u,simpleKeys:d}}=n,f=Q(e)&&e.comment||null;if(d){if(f)throw Error(`With simple keys, key nodes cannot have comments`);if(Z(e)||!Q(e)&&typeof e==`object`)throw Error(`With simple keys, collection cannot be used as a key value`)}let p=!d&&(!e||f&&t==null&&!n.inFlow||Z(e)||(X(e)?e.type===$.BLOCK_FOLDED||e.type===$.BLOCK_LITERAL:typeof e==`object`));n=Object.assign({},n,{allNullValues:!1,implicitKey:!p&&(d||!a),indent:s+c});let m=!1,h=!1,g=_f(e,n,()=>m=!0,()=>h=!0);if(!p&&!n.inFlow&&g.length>1024){if(d)throw Error(`With simple keys, single line scalar must not span more than 1024 characters`);p=!0}if(n.inFlow){if(a||t==null)return m&&r&&r(),g===``?`?`:p?`? ${g}`:g}else if(a&&!d||t==null&&p)return g=`? ${g}`,f&&!m?g+=Zd(g,n.indent,l(f)):h&&i&&i(),g;m&&(f=null),p?(f&&(g+=Zd(g,n.indent,l(f))),g=`? ${g}\n${s}:`):(g=`${g}:`,f&&(g+=Zd(g,n.indent,l(f))));let _,v,y;Q(t)?(_=!!t.spaceBefore,v=t.commentBefore,y=t.comment):(_=!1,v=null,y=null,t&&typeof t==`object`&&(t=o.createNode(t))),n.implicitKey=!1,!p&&!f&&X(t)&&(n.indentAtStart=g.length+1),h=!1,!u&&c.length>=2&&!n.inFlow&&!p&&bd(t)&&!t.flow&&!t.tag&&!t.anchor&&(n.indent=n.indent.substring(2));let b=!1,x=_f(t,n,()=>b=!0,()=>h=!0),S=` `;if(f||_||v){if(S=_?`
`:``,v){let e=l(v);S+=`\n${Xd(e,n.indent)}`}x===``&&!n.inFlow?S===`
`&&y&&(S=`

`):S+=`\n${n.indent}`}else if(!p&&Z(t)){let e=x[0],r=x.indexOf(`
`),i=r!==-1,a=n.inFlow??t.flow??t.items.length===0;if(i||!a){let t=!1;if(i&&(e===`&`||e===`!`)){let n=x.indexOf(` `);e===`&`&&n!==-1&&n<r&&x[n+1]===`!`&&(n=x.indexOf(` `,n+1)),(n===-1||r<n)&&(t=!0)}t||(S=`\n${n.indent}`)}}else(x===``||x[0]===`
`)&&(S=``);return g+=S+x,n.inFlow?b&&r&&r():y&&!b?g+=Zd(g,n.indent,l(y)):h&&i&&i(),g}function yf(e,t){(e===`debug`||e===`warn`)&&console.warn(t)}var bf=`<<`,xf={identify:e=>e===bf||typeof e==`symbol`&&e.description===bf,default:`key`,tag:`tag:yaml.org,2002:merge`,test:/^<<$/,resolve:()=>Object.assign(new $(Symbol(bf)),{addToJSMap:Cf}),stringify:()=>bf},Sf=(e,t)=>(xf.identify(t)||X(t)&&(!t.type||t.type===$.PLAIN)&&xf.identify(t.value))&&e?.doc.schema.tags.some(e=>e.tag===xf.tag&&e.default);function Cf(e,t,n){let r=Tf(e,n);if(bd(r))for(let n of r.items)wf(e,t,n);else if(Array.isArray(r))for(let n of r)wf(e,t,n);else wf(e,t,r)}function wf(e,t,n){let r=Tf(e,n);if(!yd(r))throw Error(`Merge sources must be maps or map aliases`);let i=r.toJSON(null,e,Map);for(let[e,n]of i)t instanceof Map?t.has(e)||t.set(e,n):t instanceof Set?t.add(e):Object.prototype.hasOwnProperty.call(t,e)||Object.defineProperty(t,e,{value:n,writable:!0,enumerable:!0,configurable:!0});return t}function Tf(e,t){return e&&_d(t)?t.resolve(e.doc,e):t}function Ef(e,t,{key:n,value:r}){if(Q(n)&&n.addToJSMap)n.addToJSMap(e,t,r);else if(Sf(e,n))Cf(e,t,r);else{let i=Rd(n,``,e);if(t instanceof Map)t.set(i,Rd(r,i,e));else if(t instanceof Set)t.add(i);else{let a=Df(n,i,e),o=Rd(r,a,e);a in t?Object.defineProperty(t,a,{value:o,writable:!0,enumerable:!0,configurable:!0}):t[a]=o}}return t}function Df(e,t,n){if(t===null)return``;if(typeof t!=`object`)return String(t);if(Q(e)&&n?.doc){let t=mf(n.doc,{});t.anchors=new Set;for(let e of n.anchors.keys())t.anchors.add(e.anchor);t.inFlow=!0,t.inStringifyKey=!0;let r=e.toString(t);if(!n.mapKeyWarned){let e=JSON.stringify(r);e.length>40&&(e=e.substring(0,36)+`..."`),yf(n.doc.options.logLevel,`Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`),n.mapKeyWarned=!0}return r}return JSON.stringify(t)}function Of(e,t,n){return new kf(Gd(e,void 0,n),Gd(t,void 0,n))}var kf=class e{constructor(e,t=null){Object.defineProperty(this,gd,{value:pd}),this.key=e,this.value=t}clone(t){let{key:n,value:r}=this;return Q(n)&&(n=n.clone(t)),Q(r)&&(r=r.clone(t)),new e(n,r)}toJSON(e,t){return Ef(t,t?.mapAsMap?new Map:{},this)}toString(e,t,n){return e?.doc?vf(this,e,t,n):JSON.stringify(this)}};function Af(e,t,n){return(t.inFlow??e.flow?Mf:jf)(e,t,n)}function jf({comment:e,items:t},n,{blockItemPrefix:r,flowChars:i,itemIndent:a,onChompKeep:o,onComment:s}){let{indent:c,options:{commentString:l}}=n,u=Object.assign({},n,{indent:a,type:null}),d=!1,f=[];for(let e=0;e<t.length;++e){let i=t[e],o=null;if(Q(i))!d&&i.spaceBefore&&f.push(``),Nf(n,f,i.commentBefore,d),i.comment&&(o=i.comment);else if(Y(i)){let e=Q(i.key)?i.key:null;e&&(!d&&e.spaceBefore&&f.push(``),Nf(n,f,e.commentBefore,d))}d=!1;let s=_f(i,u,()=>o=null,()=>d=!0);o&&(s+=Zd(s,a,l(o))),d&&o&&(d=!1),f.push(r+s)}let p;if(f.length===0)p=i.start+i.end;else{p=f[0];for(let e=1;e<f.length;++e){let t=f[e];p+=t?`\n${c}${t}`:`
`}}return e?(p+=`
`+Xd(l(e),c),s&&s()):d&&o&&o(),p}function Mf({items:e},t,{flowChars:n,itemIndent:r}){let{indent:i,indentStep:a,flowCollectionPadding:o,options:{commentString:s}}=t;r+=a;let c=Object.assign({},t,{indent:r,inFlow:!0,type:null}),l=!1,u=0,d=[];for(let n=0;n<e.length;++n){let i=e[n],a=null;if(Q(i))i.spaceBefore&&d.push(``),Nf(t,d,i.commentBefore,!1),i.comment&&(a=i.comment);else if(Y(i)){let e=Q(i.key)?i.key:null;e&&(e.spaceBefore&&d.push(``),Nf(t,d,e.commentBefore,!1),e.comment&&(l=!0));let n=Q(i.value)?i.value:null;n?(n.comment&&(a=n.comment),n.commentBefore&&(l=!0)):i.value==null&&e?.comment&&(a=e.comment)}a&&(l=!0);let o=_f(i,c,()=>a=null);l||=d.length>u||o.includes(`
`),n<e.length-1?o+=`,`:t.options.trailingComma&&(t.options.lineWidth>0&&(l||=d.reduce((e,t)=>e+t.length+2,2)+(o.length+2)>t.options.lineWidth),l&&(o+=`,`)),a&&(o+=Zd(o,r,s(a))),d.push(o),u=d.length}let{start:f,end:p}=n;if(d.length===0)return f+p;if(!l){let e=d.reduce((e,t)=>e+t.length+2,2);l=t.options.lineWidth>0&&e>t.options.lineWidth}if(l){let e=f;for(let t of d)e+=t?`\n${a}${i}${t}`:`
`;return`${e}\n${i}${p}`}return`${f}${o}${d.join(` `)}${o}${p}`}function Nf({indent:e,options:{commentString:t}},n,r,i){if(r&&i&&(r=r.replace(/^\n+/,``)),r){let i=Xd(t(r),e);n.push(i.trimStart())}}function Pf(e,t){let n=X(t)?t.value:t;for(let r of e)if(Y(r)&&(r.key===t||r.key===n||X(r.key)&&r.key.value===n))return r}var Ff=class extends Jd{static get tagName(){return`tag:yaml.org,2002:map`}constructor(e){super(fd,e),this.items=[]}static from(e,t,n){let{keepUndefined:r,replacer:i}=n,a=new this(e),o=(e,o)=>{if(typeof i==`function`)o=i.call(t,e,o);else if(Array.isArray(i)&&!i.includes(e))return;(o!==void 0||r)&&a.items.push(Of(e,o,n))};if(t instanceof Map)for(let[e,n]of t)o(e,n);else if(t&&typeof t==`object`)for(let e of Object.keys(t))o(e,t[e]);return typeof e.sortMapEntries==`function`&&a.items.sort(e.sortMapEntries),a}add(e,t){let n;n=Y(e)?e:!e||typeof e!=`object`||!(`key`in e)?new kf(e,e?.value):new kf(e.key,e.value);let r=Pf(this.items,n.key),i=this.schema?.sortMapEntries;if(r){if(!t)throw Error(`Key ${n.key} already set`);X(r.value)&&Hd(n.value)?r.value.value=n.value:r.value=n.value}else if(i){let e=this.items.findIndex(e=>i(n,e)<0);e===-1?this.items.push(n):this.items.splice(e,0,n)}else this.items.push(n)}delete(e){let t=Pf(this.items,e);return t?this.items.splice(this.items.indexOf(t),1).length>0:!1}get(e,t){let n=Pf(this.items,e)?.value;return(!t&&X(n)?n.value:n)??void 0}has(e){return!!Pf(this.items,e)}set(e,t){this.add(new kf(e,t),!0)}toJSON(e,t,n){let r=n?new n:t?.mapAsMap?new Map:{};t?.onCreate&&t.onCreate(r);for(let e of this.items)Ef(t,r,e);return r}toString(e,t,n){if(!e)return JSON.stringify(this);for(let e of this.items)if(!Y(e))throw Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`);return!e.allNullValues&&this.hasAllNullValues(!1)&&(e=Object.assign({},e,{allNullValues:!0})),Af(this,e,{blockItemPrefix:``,flowChars:{start:`{`,end:`}`},itemIndent:e.indent||``,onChompKeep:n,onComment:t})}},If={collection:`map`,default:!0,nodeClass:Ff,tag:`tag:yaml.org,2002:map`,resolve(e,t){return yd(e)||t(`Expected a mapping for this tag`),e},createNode:(e,t,n)=>Ff.from(e,t,n)},Lf=class extends Jd{static get tagName(){return`tag:yaml.org,2002:seq`}constructor(e){super(hd,e),this.items=[]}add(e){this.items.push(e)}delete(e){let t=Rf(e);return typeof t==`number`&&this.items.splice(t,1).length>0}get(e,t){let n=Rf(e);if(typeof n!=`number`)return;let r=this.items[n];return!t&&X(r)?r.value:r}has(e){let t=Rf(e);return typeof t==`number`&&t<this.items.length}set(e,t){let n=Rf(e);if(typeof n!=`number`)throw Error(`Expected a valid index, not ${e}.`);let r=this.items[n];X(r)&&Hd(t)?r.value=t:this.items[n]=t}toJSON(e,t){let n=[];t?.onCreate&&t.onCreate(n);let r=0;for(let e of this.items)n.push(Rd(e,String(r++),t));return n}toString(e,t,n){return e?Af(this,e,{blockItemPrefix:`- `,flowChars:{start:`[`,end:`]`},itemIndent:(e.indent||``)+`  `,onChompKeep:n,onComment:t}):JSON.stringify(this)}static from(e,t,n){let{replacer:r}=n,i=new this(e);if(t&&Symbol.iterator in Object(t)){let e=0;for(let a of t){if(typeof r==`function`){let n=t instanceof Set?a:String(e++);a=r.call(t,n,a)}i.items.push(Gd(a,void 0,n))}}return i}};function Rf(e){let t=X(e)?e.value:e;return t&&typeof t==`string`&&(t=Number(t)),typeof t==`number`&&Number.isInteger(t)&&t>=0?t:null}var zf={collection:`seq`,default:!0,nodeClass:Lf,tag:`tag:yaml.org,2002:seq`,resolve(e,t){return bd(e)||t(`Expected a sequence for this tag`),e},createNode:(e,t,n)=>Lf.from(e,t,n)},Bf={identify:e=>typeof e==`string`,default:!0,tag:`tag:yaml.org,2002:str`,resolve:e=>e,stringify(e,t,n,r){return t=Object.assign({actualString:!0},t),pf(e,t,n,r)}},Vf={identify:e=>e==null,createNode:()=>new $(null),default:!0,tag:`tag:yaml.org,2002:null`,test:/^(?:~|[Nn]ull|NULL)?$/,resolve:()=>new $(null),stringify:({source:e},t)=>typeof e==`string`&&Vf.test.test(e)?e:t.options.nullStr},Hf={identify:e=>typeof e==`boolean`,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,resolve:e=>new $(e[0]===`t`||e[0]===`T`),stringify({source:e,value:t},n){return e&&Hf.test.test(e)&&t===(e[0]===`t`||e[0]===`T`)?e:t?n.options.trueStr:n.options.falseStr}};function Uf({format:e,minFractionDigits:t,tag:n,value:r}){if(typeof r==`bigint`)return String(r);let i=typeof r==`number`?r:Number(r);if(!isFinite(i))return isNaN(i)?`.nan`:i<0?`-.inf`:`.inf`;let a=Object.is(r,-0)?`-0`:JSON.stringify(r);if(!e&&t&&(!n||n===`tag:yaml.org,2002:float`)&&/^-?\d/.test(a)&&!a.includes(`e`)){let e=a.indexOf(`.`);e<0&&(e=a.length,a+=`.`);let n=t-(a.length-e-1);for(;n-->0;)a+=`0`}return a}var Wf={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,resolve:e=>e.slice(-3).toLowerCase()===`nan`?NaN:e[0]===`-`?-1/0:1/0,stringify:Uf},Gf={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,format:`EXP`,test:/^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e),stringify(e){let t=Number(e.value);return isFinite(t)?t.toExponential():Uf(e)}},Kf={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,resolve(e){let t=new $(parseFloat(e)),n=e.indexOf(`.`);return n!==-1&&e[e.length-1]===`0`&&(t.minFractionDigits=e.length-n-1),t},stringify:Uf},qf=e=>typeof e==`bigint`||Number.isInteger(e),Jf=(e,t,n,{intAsBigInt:r})=>r?BigInt(e):parseInt(e.substring(t),n);function Yf(e,t,n){let{value:r}=e;return qf(r)&&r>=0?n+r.toString(t):Uf(e)}var Xf={identify:e=>qf(e)&&e>=0,default:!0,tag:`tag:yaml.org,2002:int`,format:`OCT`,test:/^0o[0-7]+$/,resolve:(e,t,n)=>Jf(e,2,8,n),stringify:e=>Yf(e,8,`0o`)},Zf={identify:qf,default:!0,tag:`tag:yaml.org,2002:int`,test:/^[-+]?[0-9]+$/,resolve:(e,t,n)=>Jf(e,0,10,n),stringify:Uf},Qf={identify:e=>qf(e)&&e>=0,default:!0,tag:`tag:yaml.org,2002:int`,format:`HEX`,test:/^0x[0-9a-fA-F]+$/,resolve:(e,t,n)=>Jf(e,2,16,n),stringify:e=>Yf(e,16,`0x`)},$f=[If,zf,Bf,Vf,Hf,Xf,Zf,Qf,Wf,Gf,Kf];function ep(e){return typeof e==`bigint`||Number.isInteger(e)}var tp=({value:e})=>JSON.stringify(e),np=[{identify:e=>typeof e==`string`,default:!0,tag:`tag:yaml.org,2002:str`,resolve:e=>e,stringify:tp},{identify:e=>e==null,createNode:()=>new $(null),default:!0,tag:`tag:yaml.org,2002:null`,test:/^null$/,resolve:()=>null,stringify:tp},{identify:e=>typeof e==`boolean`,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^true$|^false$/,resolve:e=>e===`true`,stringify:tp},{identify:ep,default:!0,tag:`tag:yaml.org,2002:int`,test:/^-?(?:0|[1-9][0-9]*)$/,resolve:(e,t,{intAsBigInt:n})=>n?BigInt(e):parseInt(e,10),stringify:({value:e})=>ep(e)?e.toString():JSON.stringify(e)},{identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,resolve:e=>parseFloat(e),stringify:tp}],rp=[If,zf].concat(np,{default:!0,tag:``,test:/^/,resolve(e,t){return t(`Unresolved plain scalar ${JSON.stringify(e)}`),e}}),ip={identify:e=>e instanceof Uint8Array,default:!1,tag:`tag:yaml.org,2002:binary`,resolve(e,t){if(typeof atob==`function`){let t=atob(e.replace(/[\n\r]/g,``)),n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n[e]=t.charCodeAt(e);return n}return t(`This environment does not support reading binary tags; either Buffer or atob is required`),e},stringify({comment:e,type:t,value:n},r,i,a){if(!n)return``;let o=n,s;if(typeof btoa==`function`){let e=``;for(let t=0;t<o.length;++t)e+=String.fromCharCode(o[t]);s=btoa(e)}else throw Error(`This environment does not support writing binary tags; either Buffer or btoa is required`);if(t??=$.BLOCK_LITERAL,t!==$.QUOTE_DOUBLE){let e=Math.max(r.options.lineWidth-r.indent.length,r.options.minContentWidth),n=Math.ceil(s.length/e),i=Array(n);for(let t=0,r=0;t<n;++t,r+=e)i[t]=s.substr(r,e);s=i.join(t===$.BLOCK_LITERAL?`
`:` `)}return pf({comment:e,type:t,value:s},r,i,a)}};function ap(e,t){if(bd(e))for(let n=0;n<e.items.length;++n){let r=e.items[n];if(!Y(r)){if(yd(r)){r.items.length>1&&t(`Each pair must have its own sequence indicator`);let e=r.items[0]||new kf(new $(null));if(r.commentBefore&&(e.key.commentBefore=e.key.commentBefore?`${r.commentBefore}\n${e.key.commentBefore}`:r.commentBefore),r.comment){let t=e.value??e.key;t.comment=t.comment?`${r.comment}\n${t.comment}`:r.comment}r=e}e.items[n]=Y(r)?r:new kf(r)}}else t(`Expected a sequence for this tag`);return e}function op(e,t,n){let{replacer:r}=n,i=new Lf(e);i.tag=`tag:yaml.org,2002:pairs`;let a=0;if(t&&Symbol.iterator in Object(t))for(let e of t){typeof r==`function`&&(e=r.call(t,String(a++),e));let o,s;if(Array.isArray(e)){if(e.length===2)o=e[0],s=e[1];else throw TypeError(`Expected [key, value] tuple: ${e}`)}else if(e&&e instanceof Object){let t=Object.keys(e);if(t.length===1)o=t[0],s=e[o];else throw TypeError(`Expected tuple with one key, not ${t.length} keys`)}else o=e;i.items.push(Of(o,s,n))}return i}var sp={collection:`seq`,default:!1,tag:`tag:yaml.org,2002:pairs`,resolve:ap,createNode:op},cp=class e extends Lf{constructor(){super(),this.add=Ff.prototype.add.bind(this),this.delete=Ff.prototype.delete.bind(this),this.get=Ff.prototype.get.bind(this),this.has=Ff.prototype.has.bind(this),this.set=Ff.prototype.set.bind(this),this.tag=e.tag}toJSON(e,t){if(!t)return super.toJSON(e);let n=new Map;t?.onCreate&&t.onCreate(n);for(let e of this.items){let r,i;if(Y(e)?(r=Rd(e.key,``,t),i=Rd(e.value,r,t)):r=Rd(e,``,t),n.has(r))throw Error(`Ordered maps must not include duplicate keys`);n.set(r,i)}return n}static from(e,t,n){let r=op(e,t,n),i=new this;return i.items=r.items,i}};cp.tag=`tag:yaml.org,2002:omap`;var lp={collection:`seq`,identify:e=>e instanceof Map,nodeClass:cp,default:!1,tag:`tag:yaml.org,2002:omap`,resolve(e,t){let n=ap(e,t),r=[];for(let{key:e}of n.items)X(e)&&(r.includes(e.value)?t(`Ordered maps must not include duplicate keys: ${e.value}`):r.push(e.value));return Object.assign(new cp,n)},createNode:(e,t,n)=>cp.from(e,t,n)};function up({value:e,source:t},n){return t&&(e?dp:fp).test.test(t)?t:e?n.options.trueStr:n.options.falseStr}var dp={identify:e=>e===!0,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,resolve:()=>new $(!0),stringify:up},fp={identify:e=>e===!1,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,resolve:()=>new $(!1),stringify:up},pp={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,resolve:e=>e.slice(-3).toLowerCase()===`nan`?NaN:e[0]===`-`?-1/0:1/0,stringify:Uf},mp={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,format:`EXP`,test:/^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e.replace(/_/g,``)),stringify(e){let t=Number(e.value);return isFinite(t)?t.toExponential():Uf(e)}},hp={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,resolve(e){let t=new $(parseFloat(e.replace(/_/g,``))),n=e.indexOf(`.`);if(n!==-1){let r=e.substring(n+1).replace(/_/g,``);r[r.length-1]===`0`&&(t.minFractionDigits=r.length)}return t},stringify:Uf},gp=e=>typeof e==`bigint`||Number.isInteger(e);function _p(e,t,n,{intAsBigInt:r}){let i=e[0];if((i===`-`||i===`+`)&&(t+=1),e=e.substring(t).replace(/_/g,``),r){switch(n){case 2:e=`0b${e}`;break;case 8:e=`0o${e}`;break;case 16:e=`0x${e}`}let t=BigInt(e);return i===`-`?BigInt(-1)*t:t}let a=parseInt(e,n);return i===`-`?-1*a:a}function vp(e,t,n){let{value:r}=e;if(gp(r)){let e=r.toString(t);return r<0?`-`+n+e.substr(1):n+e}return Uf(e)}var yp={identify:gp,default:!0,tag:`tag:yaml.org,2002:int`,format:`BIN`,test:/^[-+]?0b[0-1_]+$/,resolve:(e,t,n)=>_p(e,2,2,n),stringify:e=>vp(e,2,`0b`)},bp={identify:gp,default:!0,tag:`tag:yaml.org,2002:int`,format:`OCT`,test:/^[-+]?0[0-7_]+$/,resolve:(e,t,n)=>_p(e,1,8,n),stringify:e=>vp(e,8,`0`)},xp={identify:gp,default:!0,tag:`tag:yaml.org,2002:int`,test:/^[-+]?[0-9][0-9_]*$/,resolve:(e,t,n)=>_p(e,0,10,n),stringify:Uf},Sp={identify:gp,default:!0,tag:`tag:yaml.org,2002:int`,format:`HEX`,test:/^[-+]?0x[0-9a-fA-F_]+$/,resolve:(e,t,n)=>_p(e,2,16,n),stringify:e=>vp(e,16,`0x`)},Cp=class e extends Ff{constructor(t){super(t),this.tag=e.tag}add(e){let t;t=Y(e)?e:e&&typeof e==`object`&&`key`in e&&`value`in e&&e.value===null?new kf(e.key,null):new kf(e,null),Pf(this.items,t.key)||this.items.push(t)}get(e,t){let n=Pf(this.items,e);return!t&&Y(n)?X(n.key)?n.key.value:n.key:n}set(e,t){if(typeof t!=`boolean`)throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);let n=Pf(this.items,e);n&&!t?this.items.splice(this.items.indexOf(n),1):!n&&t&&this.items.push(new kf(e))}toJSON(e,t){return super.toJSON(e,t,Set)}toString(e,t,n){if(!e)return JSON.stringify(this);if(this.hasAllNullValues(!0))return super.toString(Object.assign({},e,{allNullValues:!0}),t,n);throw Error(`Set items must all have null values`)}static from(e,t,n){let{replacer:r}=n,i=new this(e);if(t&&Symbol.iterator in Object(t))for(let e of t)typeof r==`function`&&(e=r.call(t,e,e)),i.items.push(Of(e,null,n));return i}};Cp.tag=`tag:yaml.org,2002:set`;var wp={collection:`map`,identify:e=>e instanceof Set,nodeClass:Cp,default:!1,tag:`tag:yaml.org,2002:set`,createNode:(e,t,n)=>Cp.from(e,t,n),resolve(e,t){if(yd(e)){if(e.hasAllNullValues(!0))return Object.assign(new Cp,e);t(`Set items must all have null values`)}else t(`Expected a mapping for this tag`);return e}};function Tp(e,t){let n=e[0],r=n===`-`||n===`+`?e.substring(1):e,i=e=>t?BigInt(e):Number(e),a=r.replace(/_/g,``).split(`:`).reduce((e,t)=>e*i(60)+i(t),i(0));return n===`-`?i(-1)*a:a}function Ep(e){let{value:t}=e,n=e=>e;if(typeof t==`bigint`)n=e=>BigInt(e);else if(isNaN(t)||!isFinite(t))return Uf(e);let r=``;t<0&&(r=`-`,t*=n(-1));let i=n(60),a=[t%i];return t<60?a.unshift(0):(t=(t-a[0])/i,a.unshift(t%i),t>=60&&(t=(t-a[0])/i,a.unshift(t))),r+a.map(e=>String(e).padStart(2,`0`)).join(`:`).replace(/000000\d*$/,``)}var Dp={identify:e=>typeof e==`bigint`||Number.isInteger(e),default:!0,tag:`tag:yaml.org,2002:int`,format:`TIME`,test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,resolve:(e,t,{intAsBigInt:n})=>Tp(e,n),stringify:Ep},Op={identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,format:`TIME`,test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,resolve:e=>Tp(e,!1),stringify:Ep},kp={identify:e=>e instanceof Date,default:!0,tag:`tag:yaml.org,2002:timestamp`,test:RegExp(`^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$`),resolve(e){let t=e.match(kp.test);if(!t)throw Error(`!!timestamp expects a date, starting with yyyy-mm-dd`);let[,n,r,i,a,o,s]=t.map(Number),c=t[7]?Number((t[7]+`00`).substr(1,3)):0,l=Date.UTC(n,r-1,i,a||0,o||0,s||0,c),u=t[8];if(u&&u!==`Z`){let e=Tp(u,!1);Math.abs(e)<30&&(e*=60),l-=6e4*e}return new Date(l)},stringify:({value:e})=>e?.toISOString().replace(/(T00:00:00)?\.000Z$/,``)??``},Ap=[If,zf,Bf,Vf,dp,fp,yp,bp,xp,Sp,pp,mp,hp,ip,xf,lp,sp,wp,Dp,Op,kp],jp=new Map([[`core`,$f],[`failsafe`,[If,zf,Bf]],[`json`,rp],[`yaml11`,Ap],[`yaml-1.1`,Ap]]),Mp={binary:ip,bool:Hf,float:Kf,floatExp:Gf,floatNaN:Wf,floatTime:Op,int:Zf,intHex:Qf,intOct:Xf,intTime:Dp,map:If,merge:xf,null:Vf,omap:lp,pairs:sp,seq:zf,set:wp,timestamp:kp},Np={"tag:yaml.org,2002:binary":ip,"tag:yaml.org,2002:merge":xf,"tag:yaml.org,2002:omap":lp,"tag:yaml.org,2002:pairs":sp,"tag:yaml.org,2002:set":wp,"tag:yaml.org,2002:timestamp":kp};function Pp(e,t,n){let r=jp.get(t);if(r&&!e)return n&&!r.includes(xf)?r.concat(xf):r.slice();let i=r;if(!i){if(Array.isArray(e))i=[];else{let e=Array.from(jp.keys()).filter(e=>e!==`yaml11`).map(e=>JSON.stringify(e)).join(`, `);throw Error(`Unknown schema "${t}"; use one of ${e} or define customTags array`)}}if(Array.isArray(e))for(let t of e)i=i.concat(t);else typeof e==`function`&&(i=e(i.slice()));return n&&(i=i.concat(xf)),i.reduce((e,t)=>{let n=typeof t==`string`?Mp[t]:t;if(!n){let e=JSON.stringify(t),n=Object.keys(Mp).map(e=>JSON.stringify(e)).join(`, `);throw Error(`Unknown custom tag ${e}; use one of ${n}`)}return e.includes(n)||e.push(n),e},[])}var Fp=(e,t)=>e.key<t.key?-1:+(e.key>t.key),Ip=class e{constructor({compat:e,customTags:t,merge:n,resolveKnownTags:r,schema:i,sortMapEntries:a,toStringDefaults:o}){this.compat=Array.isArray(e)?Pp(e,`compat`):e?Pp(null,e):null,this.name=typeof i==`string`&&i||`core`,this.knownTags=r?Np:{},this.tags=Pp(t,this.name,n),this.toStringOptions=o??null,Object.defineProperty(this,fd,{value:If}),Object.defineProperty(this,md,{value:Bf}),Object.defineProperty(this,hd,{value:zf}),this.sortMapEntries=typeof a==`function`?a:a===!0?Fp:null}clone(){let t=Object.create(e.prototype,Object.getOwnPropertyDescriptors(this));return t.tags=this.tags.slice(),t}};function Lp(e,t){let n=[],r=t.directives===!0;if(t.directives!==!1&&e.directives){let t=e.directives.toString(e);t?(n.push(t),r=!0):e.directives.docStart&&(r=!0)}r&&n.push(`---`);let i=mf(e,t),{commentString:a}=i.options;if(e.commentBefore){n.length!==1&&n.unshift(``);let t=a(e.commentBefore);n.unshift(Xd(t,``))}let o=!1,s=null;if(e.contents){if(Q(e.contents)){if(e.contents.spaceBefore&&r&&n.push(``),e.contents.commentBefore){let t=a(e.contents.commentBefore);n.push(Xd(t,``))}i.forceBlockIndent=!!e.comment,s=e.contents.comment}let t=s?void 0:()=>o=!0,c=_f(e.contents,i,()=>s=null,t);s&&(c+=Zd(c,``,a(s))),(c[0]===`|`||c[0]===`>`)&&n[n.length-1]===`---`?n[n.length-1]=`--- ${c}`:n.push(c)}else n.push(_f(e.contents,i));if(e.directives?.docEnd){if(e.comment){let t=a(e.comment);t.includes(`
`)?(n.push(`...`),n.push(Xd(t,``))):n.push(`... ${t}`)}else n.push(`...`)}else{let t=e.comment;t&&o&&(t=t.replace(/^\n+/,``)),t&&((!o||s)&&n[n.length-1]!==``&&n.push(``),n.push(Xd(a(t),``)))}return n.join(`
`)+`
`}var Rp=class e{constructor(e,t,n){this.commentBefore=null,this.comment=null,this.errors=[],this.warnings=[],Object.defineProperty(this,gd,{value:dd});let r=null;typeof t==`function`||Array.isArray(t)?r=t:n===void 0&&t&&(n=t,t=void 0);let i=Object.assign({intAsBigInt:!1,keepSourceTokens:!1,logLevel:`warn`,prettyErrors:!0,strict:!0,stringKeys:!1,uniqueKeys:!0,version:`1.2`},n);this.options=i;let{version:a}=i;n?._directives?(this.directives=n._directives.atDocument(),this.directives.yaml.explicit&&(a=this.directives.yaml.version)):this.directives=new Md({version:a}),this.setSchema(a,n),this.contents=e===void 0?null:this.createNode(e,r,n)}clone(){let t=Object.create(e.prototype,{[gd]:{value:dd}});return t.commentBefore=this.commentBefore,t.comment=this.comment,t.errors=this.errors.slice(),t.warnings=this.warnings.slice(),t.options=Object.assign({},this.options),this.directives&&(t.directives=this.directives.clone()),t.schema=this.schema.clone(),t.contents=Q(this.contents)?this.contents.clone(t.schema):this.contents,this.range&&(t.range=this.range.slice()),t}add(e){zp(this.contents)&&this.contents.add(e)}addIn(e,t){zp(this.contents)&&this.contents.addIn(e,t)}createAlias(e,t){if(!e.anchor){let n=Pd(this);e.anchor=!t||n.has(t)?Fd(t||`a`,n):t}return new Bd(e.anchor)}createNode(e,t,n){let r;if(typeof t==`function`)e=t.call({"":e},``,e),r=t;else if(Array.isArray(t)){let e=t.filter(e=>typeof e==`number`||e instanceof String||e instanceof Number).map(String);e.length>0&&(t=t.concat(e)),r=t}else n===void 0&&t&&(n=t,t=void 0);let{aliasDuplicateObjects:i,anchorPrefix:a,flow:o,keepUndefined:s,onTagObj:c,tag:l}=n??{},{onAnchor:u,setAnchors:d,sourceObjects:f}=Id(this,a||`a`),p={aliasDuplicateObjects:i??!0,keepUndefined:s??!1,onAnchor:u,onTagObj:c,replacer:r,schema:this.schema,sourceObjects:f},m=Gd(e,l,p);return o&&Z(m)&&(m.flow=!0),d(),m}createPair(e,t,n={}){return new kf(this.createNode(e,null,n),this.createNode(t,null,n))}delete(e){return zp(this.contents)?this.contents.delete(e):!1}deleteIn(e){return qd(e)?this.contents!=null&&(this.contents=null,!0):zp(this.contents)?this.contents.deleteIn(e):!1}get(e,t){return Z(this.contents)?this.contents.get(e,t):void 0}getIn(e,t){return qd(e)?!t&&X(this.contents)?this.contents.value:this.contents:Z(this.contents)?this.contents.getIn(e,t):void 0}has(e){return Z(this.contents)?this.contents.has(e):!1}hasIn(e){return qd(e)?this.contents!==void 0:Z(this.contents)?this.contents.hasIn(e):!1}set(e,t){this.contents==null?this.contents=Kd(this.schema,[e],t):zp(this.contents)&&this.contents.set(e,t)}setIn(e,t){qd(e)?this.contents=t:this.contents==null?this.contents=Kd(this.schema,Array.from(e),t):zp(this.contents)&&this.contents.setIn(e,t)}setSchema(e,t={}){typeof e==`number`&&(e=String(e));let n;switch(e){case`1.1`:this.directives?this.directives.yaml.version=`1.1`:this.directives=new Md({version:`1.1`}),n={resolveKnownTags:!1,schema:`yaml-1.1`};break;case`1.2`:case`next`:this.directives?this.directives.yaml.version=e:this.directives=new Md({version:e}),n={resolveKnownTags:!0,schema:`core`};break;case null:this.directives&&delete this.directives,n=null;break;default:{let t=JSON.stringify(e);throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${t}`)}}if(t.schema instanceof Object)this.schema=t.schema;else if(n)this.schema=new Ip(Object.assign(n,t));else throw Error(`With a null YAML version, the { schema: Schema } option is required`)}toJS({json:e,jsonArg:t,mapAsMap:n,maxAliasCount:r,onAnchor:i,reviver:a}={}){let o={anchors:new Map,doc:this,keep:!e,mapAsMap:n===!0,mapKeyWarned:!1,maxAliasCount:typeof r==`number`?r:100},s=Rd(this.contents,t??``,o);if(typeof i==`function`)for(let{count:e,res:t}of o.anchors.values())i(t,e);return typeof a==`function`?Ld(a,{"":s},``,s):s}toJSON(e,t){return this.toJS({json:!0,jsonArg:e,mapAsMap:!1,onAnchor:t})}toString(e={}){if(this.errors.length>0)throw Error(`Document with errors cannot be stringified`);if(`indent`in e&&(!Number.isInteger(e.indent)||Number(e.indent)<=0)){let t=JSON.stringify(e.indent);throw Error(`"indent" option must be a positive integer, not ${t}`)}return Lp(this,e)}};function zp(e){if(Z(e))return!0;throw Error(`Expected a YAML collection as document contents`)}var Bp=class extends Error{constructor(e,t,n,r){super(),this.name=e,this.code=n,this.message=r,this.pos=t}},Vp=class extends Bp{constructor(e,t,n){super(`YAMLParseError`,e,t,n)}},Hp=class extends Bp{constructor(e,t,n){super(`YAMLWarning`,e,t,n)}},Up=(e,t)=>n=>{if(n.pos[0]===-1)return;n.linePos=n.pos.map(e=>t.linePos(e));let{line:r,col:i}=n.linePos[0];n.message+=` at line ${r}, column ${i}`;let a=i-1,o=e.substring(t.lineStarts[r-1],t.lineStarts[r]).replace(/[\n\r]+$/,``);if(a>=60&&o.length>80){let e=Math.min(a-39,o.length-79);o=`…`+o.substring(e),a-=e-1}if(o.length>80&&(o=o.substring(0,79)+`…`),r>1&&/^ *$/.test(o.substring(0,a))){let n=e.substring(t.lineStarts[r-2],t.lineStarts[r-1]);n.length>80&&(n=n.substring(0,79)+`…
`),o=n+o}if(/[^ ]/.test(o)){let e=1,t=n.linePos[1];t?.line===r&&t.col>i&&(e=Math.max(1,Math.min(t.col-i,80-a)));let s=` `.repeat(a)+`^`.repeat(e);n.message+=`:\n\n${o}\n${s}\n`}};function Wp(e,{flow:t,indicator:n,next:r,offset:i,onError:a,parentIndent:o,startOnNewline:s}){let c=!1,l=s,u=s,d=``,f=``,p=!1,m=!1,h=null,g=null,_=null,v=null,y=null,b=null,x=null;for(let i of e)switch(m&&=(i.type!==`space`&&i.type!==`newline`&&i.type!==`comma`&&a(i.offset,`MISSING_CHAR`,`Tags and anchors must be separated from the next token by white space`),!1),h&&=(l&&i.type!==`comment`&&i.type!==`newline`&&a(h,`TAB_AS_INDENT`,`Tabs are not allowed as indentation`),null),i.type){case`space`:!t&&(n!==`doc-start`||r?.type!==`flow-collection`)&&i.source.includes(`	`)&&(h=i),u=!0;break;case`comment`:{u||a(i,`MISSING_CHAR`,`Comments must be separated from other tokens by white space characters`);let e=i.source.substring(1)||` `;d?d+=f+e:d=e,f=``,l=!1;break}case`newline`:l?d?d+=i.source:b&&n===`seq-item-ind`||(c=!0):f+=i.source,l=!0,p=!0,(g||_)&&(v=i),u=!0;break;case`anchor`:g&&a(i,`MULTIPLE_ANCHORS`,`A node can have at most one anchor`),i.source.endsWith(`:`)&&a(i.offset+i.source.length-1,`BAD_ALIAS`,`Anchor ending in : is ambiguous`,!0),g=i,x??=i.offset,l=!1,u=!1,m=!0;break;case`tag`:_&&a(i,`MULTIPLE_TAGS`,`A node can have at most one tag`),_=i,x??=i.offset,l=!1,u=!1,m=!0;break;case n:(g||_)&&a(i,`BAD_PROP_ORDER`,`Anchors and tags must be after the ${i.source} indicator`),b&&a(i,`UNEXPECTED_TOKEN`,`Unexpected ${i.source} in ${t??`collection`}`),b=i,l=n===`seq-item-ind`||n===`explicit-key-ind`,u=!1;break;case`comma`:if(t){y&&a(i,`UNEXPECTED_TOKEN`,`Unexpected , in ${t}`),y=i,l=!1,u=!1;break}default:a(i,`UNEXPECTED_TOKEN`,`Unexpected ${i.type} token`),l=!1,u=!1}let S=e[e.length-1],C=S?S.offset+S.source.length:i;return m&&r&&r.type!==`space`&&r.type!==`newline`&&r.type!==`comma`&&(r.type!==`scalar`||r.source!==``)&&a(r.offset,`MISSING_CHAR`,`Tags and anchors must be separated from the next token by white space`),h&&(l&&h.indent<=o||r?.type===`block-map`||r?.type===`block-seq`)&&a(h,`TAB_AS_INDENT`,`Tabs are not allowed as indentation`),{comma:y,found:b,spaceBefore:c,comment:d,hasNewline:p,anchor:g,tag:_,newlineAfterProp:v,end:C,start:x??C}}function Gp(e){if(!e)return null;switch(e.type){case`alias`:case`scalar`:case`double-quoted-scalar`:case`single-quoted-scalar`:if(e.source.includes(`
`))return!0;if(e.end){for(let t of e.end)if(t.type===`newline`)return!0}return!1;case`flow-collection`:for(let t of e.items){for(let e of t.start)if(e.type===`newline`)return!0;if(t.sep){for(let e of t.sep)if(e.type===`newline`)return!0}if(Gp(t.key)||Gp(t.value))return!0}return!1;default:return!0}}function Kp(e,t,n){if(t?.type===`flow-collection`){let r=t.end[0];r.indent===e&&(r.source===`]`||r.source===`}`)&&Gp(t)&&n(r,`BAD_INDENT`,`Flow end indicator should be more indented than parent`,!0)}}function qp(e,t,n){let{uniqueKeys:r}=e.options;if(r===!1)return!1;let i=typeof r==`function`?r:(e,t)=>e===t||X(e)&&X(t)&&e.value===t.value;return t.some(e=>i(e.key,n))}var Jp=`All mapping items must start at the same column`;function Yp({composeNode:e,composeEmptyNode:t},n,r,i,a){let o=new((a?.nodeClass)??Ff)(n.schema);n.atRoot&&=!1;let s=r.offset,c=null;for(let a of r.items){let{start:l,key:u,sep:d,value:f}=a,p=Wp(l,{indicator:`explicit-key-ind`,next:u??d?.[0],offset:s,onError:i,parentIndent:r.indent,startOnNewline:!0}),m=!p.found;if(m){if(u&&(u.type===`block-seq`?i(s,`BLOCK_AS_IMPLICIT_KEY`,`A block sequence may not be used as an implicit map key`):`indent`in u&&u.indent!==r.indent&&i(s,`BAD_INDENT`,Jp)),!p.anchor&&!p.tag&&!d){c=p.end,p.comment&&(o.comment?o.comment+=`
`+p.comment:o.comment=p.comment);continue}(p.newlineAfterProp||Gp(u))&&i(u??l[l.length-1],`MULTILINE_IMPLICIT_KEY`,`Implicit keys need to be on a single line`)}else p.found?.indent!==r.indent&&i(s,`BAD_INDENT`,Jp);n.atKey=!0;let h=p.end,g=u?e(n,u,p,i):t(n,h,l,null,p,i);n.schema.compat&&Kp(r.indent,u,i),n.atKey=!1,qp(n,o.items,g)&&i(h,`DUPLICATE_KEY`,`Map keys must be unique`);let _=Wp(d??[],{indicator:`map-value-ind`,next:f,offset:g.range[2],onError:i,parentIndent:r.indent,startOnNewline:!u||u.type===`block-scalar`});if(s=_.end,_.found){m&&(f?.type===`block-map`&&!_.hasNewline&&i(s,`BLOCK_AS_IMPLICIT_KEY`,`Nested mappings are not allowed in compact mappings`),n.options.strict&&p.start<_.found.offset-1024&&i(g.range,`KEY_OVER_1024_CHARS`,`The : indicator must be at most 1024 chars after the start of an implicit block mapping key`));let c=f?e(n,f,_,i):t(n,s,d,null,_,i);n.schema.compat&&Kp(r.indent,f,i),s=c.range[2];let l=new kf(g,c);n.options.keepSourceTokens&&(l.srcToken=a),o.items.push(l)}else{m&&i(g.range,`MISSING_CHAR`,`Implicit map keys need to be followed by map values`),_.comment&&(g.comment?g.comment+=`
`+_.comment:g.comment=_.comment);let e=new kf(g);n.options.keepSourceTokens&&(e.srcToken=a),o.items.push(e)}}return c&&c<s&&i(c,`IMPOSSIBLE`,`Map comment with trailing content`),o.range=[r.offset,s,c??s],o}function Xp({composeNode:e,composeEmptyNode:t},n,r,i,a){let o=new((a?.nodeClass)??Lf)(n.schema);n.atRoot&&=!1,n.atKey&&=!1;let s=r.offset,c=null;for(let{start:a,value:l}of r.items){let u=Wp(a,{indicator:`seq-item-ind`,next:l,offset:s,onError:i,parentIndent:r.indent,startOnNewline:!0});if(!u.found){if(u.anchor||u.tag||l)l?.type===`block-seq`?i(u.end,`BAD_INDENT`,`All sequence items must start at the same column`):i(s,`MISSING_CHAR`,`Sequence item without - indicator`);else{c=u.end,u.comment&&(o.comment=u.comment);continue}}let d=l?e(n,l,u,i):t(n,u.end,a,null,u,i);n.schema.compat&&Kp(r.indent,l,i),s=d.range[2],o.items.push(d)}return o.range=[r.offset,s,c??s],o}function Zp(e,t,n,r){let i=``;if(e){let a=!1,o=``;for(let s of e){let{source:e,type:c}=s;switch(c){case`space`:a=!0;break;case`comment`:{n&&!a&&r(s,`MISSING_CHAR`,`Comments must be separated from other tokens by white space characters`);let t=e.substring(1)||` `;i?i+=o+t:i=t,o=``;break}case`newline`:i&&(o+=e),a=!0;break;default:r(s,`UNEXPECTED_TOKEN`,`Unexpected ${c} at node end`)}t+=e.length}}return{comment:i,offset:t}}var Qp=`Block collections are not allowed within flow collections`,$p=e=>e&&(e.type===`block-map`||e.type===`block-seq`);function em({composeNode:e,composeEmptyNode:t},n,r,i,a){let o=r.start.source===`{`,s=o?`flow map`:`flow sequence`,c=new((a?.nodeClass)??(o?Ff:Lf))(n.schema);c.flow=!0;let l=n.atRoot;l&&(n.atRoot=!1),n.atKey&&=!1;let u=r.offset+r.start.source.length;for(let a=0;a<r.items.length;++a){let l=r.items[a],{start:d,key:f,sep:p,value:m}=l,h=Wp(d,{flow:s,indicator:`explicit-key-ind`,next:f??p?.[0],offset:u,onError:i,parentIndent:r.indent,startOnNewline:!1});if(!h.found){if(!h.anchor&&!h.tag&&!p&&!m){a===0&&h.comma?i(h.comma,`UNEXPECTED_TOKEN`,`Unexpected , in ${s}`):a<r.items.length-1&&i(h.start,`UNEXPECTED_TOKEN`,`Unexpected empty item in ${s}`),h.comment&&(c.comment?c.comment+=`
`+h.comment:c.comment=h.comment),u=h.end;continue}!o&&n.options.strict&&Gp(f)&&i(f,`MULTILINE_IMPLICIT_KEY`,`Implicit keys of flow sequence pairs need to be on a single line`)}if(a===0)h.comma&&i(h.comma,`UNEXPECTED_TOKEN`,`Unexpected , in ${s}`);else if(h.comma||i(h.start,`MISSING_CHAR`,`Missing , between ${s} items`),h.comment){let e=``;loop:for(let t of d)switch(t.type){case`comma`:case`space`:break;case`comment`:e=t.source.substring(1);break loop;default:break loop}if(e){let t=c.items[c.items.length-1];Y(t)&&(t=t.value??t.key),t.comment?t.comment+=`
`+e:t.comment=e,h.comment=h.comment.substring(e.length+1)}}if(!o&&!p&&!h.found){let r=m?e(n,m,h,i):t(n,h.end,p,null,h,i);c.items.push(r),u=r.range[2],$p(m)&&i(r.range,`BLOCK_IN_FLOW`,Qp)}else{n.atKey=!0;let a=h.end,g=f?e(n,f,h,i):t(n,a,d,null,h,i);$p(f)&&i(g.range,`BLOCK_IN_FLOW`,Qp),n.atKey=!1;let _=Wp(p??[],{flow:s,indicator:`map-value-ind`,next:m,offset:g.range[2],onError:i,parentIndent:r.indent,startOnNewline:!1});if(_.found){if(!o&&!h.found&&n.options.strict){if(p)for(let e of p){if(e===_.found)break;if(e.type===`newline`){i(e,`MULTILINE_IMPLICIT_KEY`,`Implicit keys of flow sequence pairs need to be on a single line`);break}}h.start<_.found.offset-1024&&i(_.found,`KEY_OVER_1024_CHARS`,`The : indicator must be at most 1024 chars after the start of an implicit flow sequence key`)}}else m&&(`source`in m&&m.source?.[0]===`:`?i(m,`MISSING_CHAR`,`Missing space after : in ${s}`):i(_.start,`MISSING_CHAR`,`Missing , or : between ${s} items`));let v=m?e(n,m,_,i):_.found?t(n,_.end,p,null,_,i):null;v?$p(m)&&i(v.range,`BLOCK_IN_FLOW`,Qp):_.comment&&(g.comment?g.comment+=`
`+_.comment:g.comment=_.comment);let y=new kf(g,v);if(n.options.keepSourceTokens&&(y.srcToken=l),o){let e=c;qp(n,e.items,g)&&i(a,`DUPLICATE_KEY`,`Map keys must be unique`),e.items.push(y)}else{let e=new Ff(n.schema);e.flow=!0,e.items.push(y);let t=(v??g).range;e.range=[g.range[0],t[1],t[2]],c.items.push(e)}u=v?v.range[2]:_.end}}let d=o?`}`:`]`,[f,...p]=r.end,m=u;if(f?.source===d)m=f.offset+f.source.length;else{let e=s[0].toUpperCase()+s.substring(1),t=l?`${e} must end with a ${d}`:`${e} in block collection must be sufficiently indented and end with a ${d}`;i(u,l?`MISSING_CHAR`:`BAD_INDENT`,t),f&&f.source.length!==1&&p.unshift(f)}if(p.length>0){let e=Zp(p,m,n.options.strict,i);e.comment&&(c.comment?c.comment+=`
`+e.comment:c.comment=e.comment),c.range=[r.offset,m,e.offset]}else c.range=[r.offset,m,m];return c}function tm(e,t,n,r,i,a){let o=n.type===`block-map`?Yp(e,t,n,r,a):n.type===`block-seq`?Xp(e,t,n,r,a):em(e,t,n,r,a),s=o.constructor;return i===`!`||i===s.tagName?(o.tag=s.tagName,o):(i&&(o.tag=i),o)}function nm(e,t,n,r,i){let a=r.tag,o=a?t.directives.tagName(a.source,e=>i(a,`TAG_RESOLVE_FAILED`,e)):null;if(n.type===`block-seq`){let{anchor:e,newlineAfterProp:t}=r,n=e&&a?e.offset>a.offset?e:a:e??a;n&&(!t||t.offset<n.offset)&&i(n,`MISSING_CHAR`,`Missing newline after block sequence props`)}let s=n.type===`block-map`?`map`:n.type===`block-seq`?`seq`:n.start.source===`{`?`map`:`seq`;if(!a||!o||o===`!`||o===Ff.tagName&&s===`map`||o===Lf.tagName&&s===`seq`)return tm(e,t,n,i,o);let c=t.schema.tags.find(e=>e.tag===o&&e.collection===s);if(!c){let r=t.schema.knownTags[o];if(r?.collection===s)t.schema.tags.push(Object.assign({},r,{default:!1})),c=r;else return r?i(a,`BAD_COLLECTION_TYPE`,`${r.tag} used for ${s} collection, but expects ${r.collection??`scalar`}`,!0):i(a,`TAG_RESOLVE_FAILED`,`Unresolved tag: ${o}`,!0),tm(e,t,n,i,o)}let l=tm(e,t,n,i,o,c),u=c.resolve?.(l,e=>i(a,`TAG_RESOLVE_FAILED`,e),t.options)??l,d=Q(u)?u:new $(u);return d.range=l.range,d.tag=o,c?.format&&(d.format=c.format),d}function rm(e,t,n){let r=t.offset,i=im(t,e.options.strict,n);if(!i)return{value:``,type:null,comment:``,range:[r,r,r]};let a=i.mode===`>`?$.BLOCK_FOLDED:$.BLOCK_LITERAL,o=t.source?am(t.source):[],s=o.length;for(let e=o.length-1;e>=0;--e){let t=o[e][1];if(t===``||t===`\r`)s=e;else break}if(s===0){let e=i.chomp===`+`&&o.length>0?`
`.repeat(Math.max(1,o.length-1)):``,n=r+i.length;return t.source&&(n+=t.source.length),{value:e,type:a,comment:i.comment,range:[r,n,n]}}let c=t.indent+i.indent,l=t.offset+i.length,u=0;for(let t=0;t<s;++t){let[r,a]=o[t];if(a===``||a===`\r`)i.indent===0&&r.length>c&&(c=r.length);else{r.length<c&&n(l+r.length,`MISSING_CHAR`,`Block scalars with more-indented leading empty lines must use an explicit indentation indicator`),i.indent===0&&(c=r.length),u=t,c===0&&!e.atRoot&&n(l,`BAD_INDENT`,`Block scalar values in collections must be indented`);break}l+=r.length+a.length+1}for(let e=o.length-1;e>=s;--e)o[e][0].length>c&&(s=e+1);let d=``,f=``,p=!1;for(let e=0;e<u;++e)d+=o[e][0].slice(c)+`
`;for(let e=u;e<s;++e){let[t,r]=o[e];l+=t.length+r.length+1;let s=r[r.length-1]===`\r`;if(s&&(r=r.slice(0,-1)),r&&t.length<c){let e=`Block scalar lines must not be less indented than their ${i.indent?`explicit indentation indicator`:`first line`}`;n(l-r.length-(s?2:1),`BAD_INDENT`,e),t=``}a===$.BLOCK_LITERAL?(d+=f+t.slice(c)+r,f=`
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
`}let m=r+i.length+t.source.length;return{value:d,type:a,comment:i.comment,range:[r,m,m]}}function im({offset:e,props:t},n,r){if(t[0].type!==`block-scalar-header`)return r(t[0],`IMPOSSIBLE`,`Block scalar header not found`),null;let{source:i}=t[0],a=i[0],o=0,s=``,c=-1;for(let t=1;t<i.length;++t){let n=i[t];if(!s&&(n===`-`||n===`+`))s=n;else{let r=Number(n);!o&&r?o=r:c===-1&&(c=e+t)}}c!==-1&&r(c,`UNEXPECTED_TOKEN`,`Block scalar header includes extra characters: ${i}`);let l=!1,u=``,d=i.length;for(let e=1;e<t.length;++e){let i=t[e];switch(i.type){case`space`:l=!0;case`newline`:d+=i.source.length;break;case`comment`:n&&!l&&r(i,`MISSING_CHAR`,`Comments must be separated from other tokens by white space characters`),d+=i.source.length,u=i.source.substring(1);break;case`error`:r(i,`UNEXPECTED_TOKEN`,i.message),d+=i.source.length;break;default:{r(i,`UNEXPECTED_TOKEN`,`Unexpected token in block scalar header: ${i.type}`);let e=i.source;e&&typeof e==`string`&&(d+=e.length)}}}return{mode:a,indent:o,chomp:s,comment:u,length:d}}function am(e){let t=e.split(/\n( *)/),n=t[0],r=n.match(/^( *)/),i=[r?.[1]?[r[1],n.slice(r[1].length)]:[``,n]];for(let e=1;e<t.length;e+=2)i.push([t[e],t[e+1]]);return i}function om(e,t,n){let{offset:r,type:i,source:a,end:o}=e,s,c,l=(e,t,i)=>n(r+e,t,i);switch(i){case`scalar`:s=$.PLAIN,c=sm(a,l);break;case`single-quoted-scalar`:s=$.QUOTE_SINGLE,c=cm(a,l);break;case`double-quoted-scalar`:s=$.QUOTE_DOUBLE,c=um(a,l);break;default:return n(e,`UNEXPECTED_TOKEN`,`Expected a flow scalar value, but found: ${i}`),{value:``,type:null,comment:``,range:[r,r+a.length,r+a.length]}}let u=r+a.length,d=Zp(o,u,t,n);return{value:c,type:s,comment:d.comment,range:[r,u,d.offset]}}function sm(e,t){let n=``;switch(e[0]){case`	`:n=`a tab character`;break;case`,`:n=`flow indicator character ,`;break;case`%`:n=`directive indicator character %`;break;case`|`:case`>`:n=`block scalar indicator ${e[0]}`;break;case`@`:case"`":n=`reserved character ${e[0]}`}return n&&t(0,`BAD_SCALAR_START`,`Plain value cannot start with ${n}`),lm(e)}function cm(e,t){return(e[e.length-1]!==`'`||e.length===1)&&t(e.length,`MISSING_CHAR`,`Missing closing 'quote`),lm(e.slice(1,-1)).replace(/''/g,`'`)}function lm(e){let t=/(.*?)\r?\n/sy,n=t.exec(e);if(!n)return e;let r,i;try{r=RegExp(`(?<![ 	])[ 	]+$`),i=RegExp(`^[ 	]+|(?<![ 	])[ 	]+$`,`g`)}catch{r=/[ \t]+$/,i=/^[ \t]+|[ \t]+$/g}let a=n[1].replace(r,``),o=` `,s=t.lastIndex;for(;n=t.exec(e);){let e=n[1].replace(i,``);e===``?o===`
`?a+=o:o=`
`:(a+=o+e,o=` `),s=t.lastIndex}let c=/[ \t]*(.*)/sy;return c.lastIndex=s,n=c.exec(e),a+o+(n?.[1]??``)}function um(e,t){let n=``;for(let r=1;r<e.length-1;++r){let i=e[r];if(i!==`\r`||e[r+1]!==`
`){if(i===`
`){let{fold:t,offset:i}=dm(e,r);n+=t,r=i}else if(i===`\\`){let i=e[++r],a=fm[i];if(a)n+=a;else if(i===`
`)for(i=e[r+1];i===` `||i===`	`;)i=e[++r+1];else if(i===`\r`&&e[r+1]===`
`)for(i=e[++r+1];i===` `||i===`	`;)i=e[++r+1];else if(i===`x`||i===`u`||i===`U`){let a=i===`x`?2:i===`u`?4:8;n+=pm(e,r+1,a,t),r+=a}else{let i=e.substr(r-1,2);t(r-1,`BAD_DQ_ESCAPE`,`Invalid escape sequence ${i}`),n+=i}}else if(i===` `||i===`	`){let t=r,a=e[r+1];for(;a===` `||a===`	`;)a=e[++r+1];a!==`
`&&(a!==`\r`||e[r+2]!==`
`)&&(n+=r>t?e.slice(t,r+1):i)}else n+=i}}return(e[e.length-1]!==`"`||e.length===1)&&t(e.length,`MISSING_CHAR`,`Missing closing "quote`),n}function dm(e,t){let n=``,r=e[t+1];for(;(r===` `||r===`	`||r===`
`||r===`\r`)&&(r!==`\r`||e[t+2]===`
`);)r===`
`&&(n+=`
`),t+=1,r=e[t+1];return n||=` `,{fold:n,offset:t}}var fm={0:`\0`,a:`\x07`,b:`\b`,e:`\x1B`,f:`\f`,n:`
`,r:`\r`,t:`	`,v:`\v`,N:``,_:`\xA0`,L:`\u2028`,P:`\u2029`," ":` `,'"':`"`,"/":`/`,"\\":`\\`,"	":`	`};function pm(e,t,n,r){let i=e.substr(t,n),a=i.length===n&&/^[0-9a-fA-F]+$/.test(i)?parseInt(i,16):NaN;try{return String.fromCodePoint(a)}catch{let i=e.substr(t-2,n+2);return r(t-2,`BAD_DQ_ESCAPE`,`Invalid escape sequence ${i}`),i}}function mm(e,t,n,r){let{value:i,type:a,comment:o,range:s}=t.type===`block-scalar`?rm(e,t,r):om(t,e.options.strict,r),c=n?e.directives.tagName(n.source,e=>r(n,`TAG_RESOLVE_FAILED`,e)):null,l;l=e.options.stringKeys&&e.atKey?e.schema[md]:c?hm(e.schema,i,c,n,r):t.type===`scalar`?gm(e,i,t,r):e.schema[md];let u;try{let a=l.resolve(i,e=>r(n??t,`TAG_RESOLVE_FAILED`,e),e.options);u=X(a)?a:new $(a)}catch(e){let a=e instanceof Error?e.message:String(e);r(n??t,`TAG_RESOLVE_FAILED`,a),u=new $(i)}return u.range=s,u.source=i,a&&(u.type=a),c&&(u.tag=c),l.format&&(u.format=l.format),o&&(u.comment=o),u}function hm(e,t,n,r,i){if(n===`!`)return e[md];let a=[];for(let t of e.tags)if(!t.collection&&t.tag===n){if(t.default&&t.test)a.push(t);else return t}for(let e of a)if(e.test?.test(t))return e;let o=e.knownTags[n];return o&&!o.collection?(e.tags.push(Object.assign({},o,{default:!1,test:void 0})),o):(i(r,`TAG_RESOLVE_FAILED`,`Unresolved tag: ${n}`,n!==`tag:yaml.org,2002:str`),e[md])}function gm({atKey:e,directives:t,schema:n},r,i,a){let o=n.tags.find(t=>(t.default===!0||e&&t.default===`key`)&&t.test?.test(r))||n[md];if(n.compat){let e=n.compat.find(e=>e.default&&e.test?.test(r))??n[md];o.tag!==e.tag&&a(i,`TAG_RESOLVE_FAILED`,`Value may be parsed as either ${t.tagString(o.tag)} or ${t.tagString(e.tag)}`,!0)}return o}function _m(e,t,n){if(t){n??=t.length;for(let r=n-1;r>=0;--r){let n=t[r];switch(n.type){case`space`:case`comment`:case`newline`:e-=n.source.length;continue}for(n=t[++r];n?.type===`space`;)e+=n.source.length,n=t[++r];break}}return e}var vm={composeNode:ym,composeEmptyNode:bm};function ym(e,t,n,r){let i=e.atKey,{spaceBefore:a,comment:o,anchor:s,tag:c}=n,l,u=!0;switch(t.type){case`alias`:l=xm(e,t,r),(s||c)&&r(t,`ALIAS_PROPS`,`An alias node must not specify any properties`);break;case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:case`block-scalar`:l=mm(e,t,c,r),s&&(l.anchor=s.source.substring(1));break;case`block-map`:case`block-seq`:case`flow-collection`:try{l=nm(vm,e,t,n,r),s&&(l.anchor=s.source.substring(1))}catch(e){r(t,`RESOURCE_EXHAUSTION`,e instanceof Error?e.message:String(e))}break;default:r(t,`UNEXPECTED_TOKEN`,t.type===`error`?t.message:`Unsupported token (type: ${t.type})`),u=!1}return l??=bm(e,t.offset,void 0,null,n,r),s&&l.anchor===``&&r(s,`BAD_ALIAS`,`Anchor cannot be an empty string`),i&&e.options.stringKeys&&(!X(l)||typeof l.value!=`string`||l.tag&&l.tag!==`tag:yaml.org,2002:str`)&&r(c??t,`NON_STRING_KEY`,`With stringKeys, all keys must be strings`),a&&(l.spaceBefore=!0),o&&(t.type===`scalar`&&t.source===``?l.comment=o:l.commentBefore=o),e.options.keepSourceTokens&&u&&(l.srcToken=t),l}function bm(e,t,n,r,{spaceBefore:i,comment:a,anchor:o,tag:s,end:c},l){let u=mm(e,{type:`scalar`,offset:_m(t,n,r),indent:-1,source:``},s,l);return o&&(u.anchor=o.source.substring(1),u.anchor===``&&l(o,`BAD_ALIAS`,`Anchor cannot be an empty string`)),i&&(u.spaceBefore=!0),a&&(u.comment=a,u.range[2]=c),u}function xm({options:e},{offset:t,source:n,end:r},i){let a=new Bd(n.substring(1));a.source===``&&i(t,`BAD_ALIAS`,`Alias cannot be an empty string`),a.source.endsWith(`:`)&&i(t+n.length-1,`BAD_ALIAS`,`Alias ending in : is ambiguous`,!0);let o=t+n.length,s=Zp(r,o,e.strict,i);return a.range=[t,o,s.offset],s.comment&&(a.comment=s.comment),a}function Sm(e,t,{offset:n,start:r,value:i,end:a},o){let s=new Rp(void 0,Object.assign({_directives:t},e)),c={atKey:!1,atRoot:!0,directives:s.directives,options:s.options,schema:s.schema},l=Wp(r,{indicator:`doc-start`,next:i??a?.[0],offset:n,onError:o,parentIndent:0,startOnNewline:!0});l.found&&(s.directives.docStart=!0,i&&(i.type===`block-map`||i.type===`block-seq`)&&!l.hasNewline&&o(l.end,`MISSING_CHAR`,`Block collection cannot start on same line with directives-end marker`)),s.contents=i?ym(c,i,l,o):bm(c,l.end,r,null,l,o);let u=s.contents.range[2],d=Zp(a,u,!1,o);return d.comment&&(s.comment=d.comment),s.range=[n,u,d.offset],s}function Cm(e){if(typeof e==`number`)return[e,e+1];if(Array.isArray(e))return e.length===2?e:[e[0],e[1]];let{offset:t,source:n}=e;return[t,t+(typeof n==`string`?n.length:1)]}function wm(e){let t=``,n=!1,r=!1;for(let i=0;i<e.length;++i){let a=e[i];switch(a[0]){case`#`:t+=(t===``?``:r?`

`:`
`)+(a.substring(1)||` `),n=!0,r=!1;break;case`%`:e[i+1]?.[0]!==`#`&&(i+=1),n=!1;break;default:n||(r=!0),n=!1}}return{comment:t,afterEmptyLine:r}}var Tm=class{constructor(e={}){this.doc=null,this.atDirectives=!1,this.prelude=[],this.errors=[],this.warnings=[],this.onError=(e,t,n,r)=>{let i=Cm(e);r?this.warnings.push(new Hp(i,t,n)):this.errors.push(new Vp(i,t,n))},this.directives=new Md({version:e.version||`1.2`}),this.options=e}decorate(e,t){let{comment:n,afterEmptyLine:r}=wm(this.prelude);if(n){let i=e.contents;if(t)e.comment=e.comment?`${e.comment}\n${n}`:n;else if(r||e.directives.docStart||!i)e.commentBefore=n;else if(Z(i)&&!i.flow&&i.items.length>0){let e=i.items[0];Y(e)&&(e=e.key);let t=e.commentBefore;e.commentBefore=t?`${n}\n${t}`:n}else{let e=i.commentBefore;i.commentBefore=e?`${n}\n${e}`:n}}if(t){for(let t=0;t<this.errors.length;++t)e.errors.push(this.errors[t]);for(let t=0;t<this.warnings.length;++t)e.warnings.push(this.warnings[t])}else e.errors=this.errors,e.warnings=this.warnings;this.prelude=[],this.errors=[],this.warnings=[]}streamInfo(){return{comment:wm(this.prelude).comment,directives:this.directives,errors:this.errors,warnings:this.warnings}}*compose(e,t=!1,n=-1){for(let t of e)yield*this.next(t);yield*this.end(t,n)}*next(e){switch(e.type){case`directive`:this.directives.add(e.source,(t,n,r)=>{let i=Cm(e);i[0]+=t,this.onError(i,`BAD_DIRECTIVE`,n,r)}),this.prelude.push(e.source),this.atDirectives=!0;break;case`document`:{let t=Sm(this.options,this.directives,e,this.onError);this.atDirectives&&!t.directives.docStart&&this.onError(e,`MISSING_CHAR`,`Missing directives-end/doc-start indicator line`),this.decorate(t,!1),this.doc&&(yield this.doc),this.doc=t,this.atDirectives=!1;break}case`byte-order-mark`:case`space`:break;case`comment`:case`newline`:this.prelude.push(e.source);break;case`error`:{let t=e.source?`${e.message}: ${JSON.stringify(e.source)}`:e.message,n=new Vp(Cm(e),`UNEXPECTED_TOKEN`,t);this.atDirectives||!this.doc?this.errors.push(n):this.doc.errors.push(n);break}case`doc-end`:{if(!this.doc){this.errors.push(new Vp(Cm(e),`UNEXPECTED_TOKEN`,`Unexpected doc-end without preceding document`));break}this.doc.directives.docEnd=!0;let t=Zp(e.end,e.offset+e.source.length,this.doc.options.strict,this.onError);if(this.decorate(this.doc,!0),t.comment){let e=this.doc.comment;this.doc.comment=e?`${e}\n${t.comment}`:t.comment}this.doc.range[2]=t.offset;break}default:this.errors.push(new Vp(Cm(e),`UNEXPECTED_TOKEN`,`Unsupported token ${e.type}`))}}*end(e=!1,t=-1){if(this.doc)this.decorate(this.doc,!0),yield this.doc,this.doc=null;else if(e){let e=new Rp(void 0,Object.assign({_directives:this.directives},this.options));this.atDirectives&&this.onError(t,`MISSING_CHAR`,`Missing directives-end indicator line`),e.range=[0,t,t],this.decorate(e,!1),yield e}}},Em=Symbol(`break visit`),Dm=Symbol(`skip children`),Om=Symbol(`remove item`);function km(e,t){`type`in e&&e.type===`document`&&(e={start:e.start,value:e.value}),Am(Object.freeze([]),e,t)}km.BREAK=Em,km.SKIP=Dm,km.REMOVE=Om,km.itemAtPath=(e,t)=>{let n=e;for(let[e,r]of t){let t=n?.[e];if(t&&`items`in t)n=t.items[r];else return}return n},km.parentCollection=(e,t)=>{let n=km.itemAtPath(e,t.slice(0,-1)),r=t[t.length-1][0],i=n?.[r];if(i&&`items`in i)return i;throw Error(`Parent collection not found`)};function Am(e,t,n){let r=n(t,e);if(typeof r==`symbol`)return r;for(let i of[`key`,`value`]){let a=t[i];if(a&&`items`in a){for(let t=0;t<a.items.length;++t){let r=Am(Object.freeze(e.concat([[i,t]])),a.items[t],n);if(typeof r==`number`)t=r-1;else if(r===Em)return Em;else r===Om&&(a.items.splice(t,1),--t)}typeof r==`function`&&i===`key`&&(r=r(t,e))}}return typeof r==`function`?r(t,e):r}function jm(e){switch(e){case`﻿`:return`byte-order-mark`;case``:return`doc-mode`;case``:return`flow-error-end`;case``:return`scalar`;case`---`:return`doc-start`;case`...`:return`doc-end`;case``:case`
`:case`\r
`:return`newline`;case`-`:return`seq-item-ind`;case`?`:return`explicit-key-ind`;case`:`:return`map-value-ind`;case`{`:return`flow-map-start`;case`}`:return`flow-map-end`;case`[`:return`flow-seq-start`;case`]`:return`flow-seq-end`;case`,`:return`comma`}switch(e[0]){case` `:case`	`:return`space`;case`#`:return`comment`;case`%`:return`directive-line`;case`*`:return`alias`;case`&`:return`anchor`;case`!`:return`tag`;case`'`:return`single-quoted-scalar`;case`"`:return`double-quoted-scalar`;case`|`:case`>`:return`block-scalar-header`}return null}function Mm(e){switch(e){case void 0:case` `:case`
`:case`\r`:case`	`:return!0;default:return!1}}var Nm=new Set(`0123456789ABCDEFabcdef`),Pm=new Set(`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()`),Fm=new Set(`,[]{}`),Im=new Set(` ,[]{}
\r	`),Lm=e=>!e||Im.has(e),Rm=class{constructor(){this.atEnd=!1,this.blockScalarIndent=-1,this.blockScalarKeep=!1,this.buffer=``,this.flowKey=!1,this.flowLevel=0,this.indentNext=0,this.indentValue=0,this.lineEndPos=null,this.next=null,this.pos=0}*lex(e,t=!1){if(e){if(typeof e!=`string`)throw TypeError(`source is not a string`);this.buffer=this.buffer?this.buffer+e:e,this.lineEndPos=null}this.atEnd=!t;let n=this.next??`stream`;for(;n&&(t||this.hasChars(1));)n=yield*this.parseNext(n)}atLineEnd(){let e=this.pos,t=this.buffer[e];for(;t===` `||t===`	`;)t=this.buffer[++e];return!t||t===`#`||t===`
`||t===`\r`&&this.buffer[e+1]===`
`}charAt(e){return this.buffer[this.pos+e]}continueScalar(e){let t=this.buffer[e];if(this.indentNext>0){let n=0;for(;t===` `;)t=this.buffer[++n+e];if(t===`\r`){let t=this.buffer[n+e+1];if(t===`
`||!t&&!this.atEnd)return e+n+1}return t===`
`||n>=this.indentNext||!t&&!this.atEnd?e+n:-1}if(t===`-`||t===`.`){let t=this.buffer.substr(e,3);if((t===`---`||t===`...`)&&Mm(this.buffer[e+3]))return-1}return e}getLine(){let e=this.lineEndPos;return(typeof e!=`number`||e!==-1&&e<this.pos)&&(e=this.buffer.indexOf(`
`,this.pos),this.lineEndPos=e),e===-1?this.atEnd?this.buffer.substring(this.pos):null:(this.buffer[e-1]===`\r`&&--e,this.buffer.substring(this.pos,e))}hasChars(e){return this.pos+e<=this.buffer.length}setNext(e){return this.buffer=this.buffer.substring(this.pos),this.pos=0,this.lineEndPos=null,this.next=e,null}peek(e){return this.buffer.substr(this.pos,e)}*parseNext(e){switch(e){case`stream`:return yield*this.parseStream();case`line-start`:return yield*this.parseLineStart();case`block-start`:return yield*this.parseBlockStart();case`doc`:return yield*this.parseDocument();case`flow`:return yield*this.parseFlowCollection();case`quoted-scalar`:return yield*this.parseQuotedScalar();case`block-scalar`:return yield*this.parseBlockScalar();case`plain-scalar`:return yield*this.parsePlainScalar()}}*parseStream(){let e=this.getLine();if(e===null)return this.setNext(`stream`);if(e[0]===`﻿`&&(yield*this.pushCount(1),e=e.substring(1)),e[0]===`%`){let t=e.length,n=e.indexOf(`#`);for(;n!==-1;){let r=e[n-1];if(r===` `||r===`	`){t=n-1;break}n=e.indexOf(`#`,n+1)}for(;;){let n=e[t-1];if(n===` `||n===`	`)--t;else break}let r=(yield*this.pushCount(t))+(yield*this.pushSpaces(!0));return yield*this.pushCount(e.length-r),this.pushNewline(),`stream`}if(this.atLineEnd()){let t=yield*this.pushSpaces(!0);return yield*this.pushCount(e.length-t),yield*this.pushNewline(),`stream`}return yield``,yield*this.parseLineStart()}*parseLineStart(){let e=this.charAt(0);if(!e&&!this.atEnd)return this.setNext(`line-start`);if(e===`-`||e===`.`){if(!this.atEnd&&!this.hasChars(4))return this.setNext(`line-start`);let e=this.peek(3);if((e===`---`||e===`...`)&&Mm(this.charAt(3)))return yield*this.pushCount(3),this.indentValue=0,this.indentNext=0,e===`---`?`doc`:`stream`}return this.indentValue=yield*this.pushSpaces(!1),this.indentNext>this.indentValue&&!Mm(this.charAt(1))&&(this.indentNext=this.indentValue),yield*this.parseBlockStart()}*parseBlockStart(){let[e,t]=this.peek(2);if(!t&&!this.atEnd)return this.setNext(`block-start`);if((e===`-`||e===`?`||e===`:`)&&Mm(t)){let e=(yield*this.pushCount(1))+(yield*this.pushSpaces(!0));return this.indentNext=this.indentValue+1,this.indentValue+=e,`block-start`}return`doc`}*parseDocument(){yield*this.pushSpaces(!0);let e=this.getLine();if(e===null)return this.setNext(`doc`);let t=yield*this.pushIndicators();switch(e[t]){case`#`:yield*this.pushCount(e.length-t);case void 0:return yield*this.pushNewline(),yield*this.parseLineStart();case`{`:case`[`:return yield*this.pushCount(1),this.flowKey=!1,this.flowLevel=1,`flow`;case`}`:case`]`:return yield*this.pushCount(1),`doc`;case`*`:return yield*this.pushUntil(Lm),`doc`;case`"`:case`'`:return yield*this.parseQuotedScalar();case`|`:case`>`:return t+=yield*this.parseBlockScalarHeader(),t+=yield*this.pushSpaces(!0),yield*this.pushCount(e.length-t),yield*this.pushNewline(),yield*this.parseBlockScalar();default:return yield*this.parsePlainScalar()}}*parseFlowCollection(){let e,t,n=-1;do e=yield*this.pushNewline(),e>0?(t=yield*this.pushSpaces(!1),this.indentValue=n=t):t=0,t+=yield*this.pushSpaces(!0);while(e+t>0);let r=this.getLine();if(r===null)return this.setNext(`flow`);if((n!==-1&&n<this.indentNext&&r[0]!==`#`||n===0&&(r.startsWith(`---`)||r.startsWith(`...`))&&Mm(r[3]))&&(n!==this.indentNext-1||this.flowLevel!==1||r[0]!==`]`&&r[0]!==`}`))return this.flowLevel=0,yield``,yield*this.parseLineStart();let i=0;for(;r[i]===`,`;)i+=yield*this.pushCount(1),i+=yield*this.pushSpaces(!0),this.flowKey=!1;switch(i+=yield*this.pushIndicators(),r[i]){case void 0:return`flow`;case`#`:return yield*this.pushCount(r.length-i),`flow`;case`{`:case`[`:return yield*this.pushCount(1),this.flowKey=!1,this.flowLevel+=1,`flow`;case`}`:case`]`:return yield*this.pushCount(1),this.flowKey=!0,--this.flowLevel,this.flowLevel?`flow`:`doc`;case`*`:return yield*this.pushUntil(Lm),`flow`;case`"`:case`'`:return this.flowKey=!0,yield*this.parseQuotedScalar();case`:`:{let e=this.charAt(1);if(this.flowKey||Mm(e)||e===`,`)return this.flowKey=!1,yield*this.pushCount(1),yield*this.pushSpaces(!0),`flow`}default:return this.flowKey=!1,yield*this.parsePlainScalar()}}*parseQuotedScalar(){let e=this.charAt(0),t=this.buffer.indexOf(e,this.pos+1);if(e===`'`)for(;t!==-1&&this.buffer[t+1]===`'`;)t=this.buffer.indexOf(`'`,t+2);else for(;t!==-1;){let e=0;for(;this.buffer[t-1-e]===`\\`;)e+=1;if(e%2==0)break;t=this.buffer.indexOf(`"`,t+1)}let n=this.buffer.substring(0,t),r=n.indexOf(`
`,this.pos);if(r!==-1){for(;r!==-1;){let e=this.continueScalar(r+1);if(e===-1)break;r=n.indexOf(`
`,e)}r!==-1&&(t=r-(n[r-1]===`\r`?2:1))}if(t===-1){if(!this.atEnd)return this.setNext(`quoted-scalar`);t=this.buffer.length}return yield*this.pushToIndex(t+1,!1),this.flowLevel?`flow`:`doc`}*parseBlockScalarHeader(){this.blockScalarIndent=-1,this.blockScalarKeep=!1;let e=this.pos;for(;;){let t=this.buffer[++e];if(t===`+`)this.blockScalarKeep=!0;else if(t>`0`&&t<=`9`)this.blockScalarIndent=Number(t)-1;else if(t!==`-`)break}return yield*this.pushUntil(e=>Mm(e)||e===`#`)}*parseBlockScalar(){let e=this.pos-1,t=0,n;loop:for(let r=this.pos;n=this.buffer[r];++r)switch(n){case` `:t+=1;break;case`
`:e=r,t=0;break;case`\r`:{let e=this.buffer[r+1];if(!e&&!this.atEnd)return this.setNext(`block-scalar`);if(e===`
`)break}default:break loop}if(!n&&!this.atEnd)return this.setNext(`block-scalar`);if(t>=this.indentNext){this.indentNext=this.blockScalarIndent===-1?t:this.blockScalarIndent+(this.indentNext===0?1:this.indentNext);do{let t=this.continueScalar(e+1);if(t===-1)break;e=this.buffer.indexOf(`
`,t)}while(e!==-1);if(e===-1){if(!this.atEnd)return this.setNext(`block-scalar`);e=this.buffer.length}}let r=e+1;for(n=this.buffer[r];n===` `;)n=this.buffer[++r];if(n===`	`){for(;n===`	`||n===` `||n===`\r`||n===`
`;)n=this.buffer[++r];e=r-1}else if(!this.blockScalarKeep)do{let n=e-1,r=this.buffer[n];r===`\r`&&(r=this.buffer[--n]);let i=n;for(;r===` `;)r=this.buffer[--n];if(r===`
`&&n>=this.pos&&n+1+t>i)e=n;else break}while(1);return yield``,yield*this.pushToIndex(e+1,!0),yield*this.parseLineStart()}*parsePlainScalar(){let e=this.flowLevel>0,t=this.pos-1,n=this.pos-1,r;for(;r=this.buffer[++n];)if(r===`:`){let r=this.buffer[n+1];if(Mm(r)||e&&Fm.has(r))break;t=n}else if(Mm(r)){let i=this.buffer[n+1];if(r===`\r`&&(i===`
`?(n+=1,r=`
`,i=this.buffer[n+1]):t=n),i===`#`||e&&Fm.has(i))break;if(r===`
`){let e=this.continueScalar(n+1);if(e===-1)break;n=Math.max(n,e-2)}}else{if(e&&Fm.has(r))break;t=n}return!r&&!this.atEnd?this.setNext(`plain-scalar`):(yield``,yield*this.pushToIndex(t+1,!0),e?`flow`:`doc`)}*pushCount(e){return e>0?(yield this.buffer.substr(this.pos,e),this.pos+=e,e):0}*pushToIndex(e,t){let n=this.buffer.slice(this.pos,e);return n?(yield n,this.pos+=n.length,n.length):(t&&(yield``),0)}*pushIndicators(){let e=0;loop:for(;;){switch(this.charAt(0)){case`!`:e+=yield*this.pushTag(),e+=yield*this.pushSpaces(!0);continue loop;case`&`:e+=yield*this.pushUntil(Lm),e+=yield*this.pushSpaces(!0);continue loop;case`-`:case`?`:case`:`:{let t=this.flowLevel>0,n=this.charAt(1);if(Mm(n)||t&&Fm.has(n)){t?this.flowKey&&=!1:this.indentNext=this.indentValue+1,e+=yield*this.pushCount(1),e+=yield*this.pushSpaces(!0);continue loop}}}break loop}return e}*pushTag(){if(this.charAt(1)===`<`){let e=this.pos+2,t=this.buffer[e];for(;!Mm(t)&&t!==`>`;)t=this.buffer[++e];return yield*this.pushToIndex(t===`>`?e+1:e,!1)}{let e=this.pos+1,t=this.buffer[e];for(;t;)if(Pm.has(t))t=this.buffer[++e];else if(t===`%`&&Nm.has(this.buffer[e+1])&&Nm.has(this.buffer[e+2]))t=this.buffer[e+=3];else break;return yield*this.pushToIndex(e,!1)}}*pushNewline(){let e=this.buffer[this.pos];return e===`
`?yield*this.pushCount(1):e===`\r`&&this.charAt(1)===`
`?yield*this.pushCount(2):0}*pushSpaces(e){let t=this.pos-1,n;do n=this.buffer[++t];while(n===` `||e&&n===`	`);let r=t-this.pos;return r>0&&(yield this.buffer.substr(this.pos,r),this.pos=t),r}*pushUntil(e){let t=this.pos,n=this.buffer[t];for(;!e(n);)n=this.buffer[++t];return yield*this.pushToIndex(t,!1)}},zm=class{constructor(){this.lineStarts=[],this.addNewLine=e=>this.lineStarts.push(e),this.linePos=e=>{let t=0,n=this.lineStarts.length;for(;t<n;){let r=t+n>>1;this.lineStarts[r]<e?t=r+1:n=r}if(this.lineStarts[t]===e)return{line:t+1,col:1};if(t===0)return{line:0,col:e};let r=this.lineStarts[t-1];return{line:t,col:e-r+1}}}};function Bm(e,t){for(let n=0;n<e.length;++n)if(e[n].type===t)return!0;return!1}function Vm(e){for(let t=0;t<e.length;++t)switch(e[t].type){case`space`:case`comment`:case`newline`:break;default:return t}return-1}function Hm(e){switch(e?.type){case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:case`flow-collection`:return!0;default:return!1}}function Um(e){switch(e.type){case`document`:return e.start;case`block-map`:{let t=e.items[e.items.length-1];return t.sep??t.start}case`block-seq`:return e.items[e.items.length-1].start;default:return[]}}function Wm(e){if(e.length===0)return[];let t=e.length;loop:for(;--t>=0;)switch(e[t].type){case`doc-start`:case`explicit-key-ind`:case`map-value-ind`:case`seq-item-ind`:case`newline`:break loop}for(;e[++t]?.type===`space`;);return e.splice(t,e.length)}function Gm(e,t){if(t.length<1e5)Array.prototype.push.apply(e,t);else for(let n=0;n<t.length;++n)e.push(t[n])}function Km(e){if(e.start.type===`flow-seq-start`)for(let t of e.items)t.sep&&!t.value&&!Bm(t.start,`explicit-key-ind`)&&!Bm(t.sep,`map-value-ind`)&&(t.key&&(t.value=t.key),delete t.key,Hm(t.value)?t.value.end?Gm(t.value.end,t.sep):t.value.end=t.sep:Gm(t.start,t.sep),delete t.sep)}var qm=class{constructor(e){this.atNewLine=!0,this.atScalar=!1,this.indent=0,this.offset=0,this.onKeyLine=!1,this.stack=[],this.source=``,this.type=``,this.lexer=new Rm,this.onNewLine=e}*parse(e,t=!1){this.onNewLine&&this.offset===0&&this.onNewLine(0);for(let n of this.lexer.lex(e,t))yield*this.next(n);t||(yield*this.end())}*next(e){if(this.source=e,this.atScalar){this.atScalar=!1,yield*this.step(),this.offset+=e.length;return}let t=jm(e);if(!t){let t=`Not a YAML token: ${e}`;yield*this.pop({type:`error`,offset:this.offset,message:t,source:e}),this.offset+=e.length}else if(t===`scalar`)this.atNewLine=!1,this.atScalar=!0,this.type=`scalar`;else{switch(this.type=t,yield*this.step(),t){case`newline`:this.atNewLine=!0,this.indent=0,this.onNewLine&&this.onNewLine(this.offset+e.length);break;case`space`:this.atNewLine&&e[0]===` `&&(this.indent+=e.length);break;case`explicit-key-ind`:case`map-value-ind`:case`seq-item-ind`:this.atNewLine&&(this.indent+=e.length);break;case`doc-mode`:case`flow-error-end`:return;default:this.atNewLine=!1}this.offset+=e.length}}*end(){for(;this.stack.length>0;)yield*this.pop()}get sourceToken(){return{type:this.type,offset:this.offset,indent:this.indent,source:this.source}}*step(){let e=this.peek(1);if(this.type===`doc-end`&&e?.type!==`doc-end`){for(;this.stack.length>0;)yield*this.pop();this.stack.push({type:`doc-end`,offset:this.offset,source:this.source})}else{if(!e)return yield*this.stream();switch(e.type){case`document`:return yield*this.document(e);case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:return yield*this.scalar(e);case`block-scalar`:return yield*this.blockScalar(e);case`block-map`:return yield*this.blockMap(e);case`block-seq`:return yield*this.blockSequence(e);case`flow-collection`:return yield*this.flowCollection(e);case`doc-end`:return yield*this.documentEnd(e)}yield*this.pop()}}peek(e){return this.stack[this.stack.length-e]}*pop(e){let t=e??this.stack.pop();if(!t)yield{type:`error`,offset:this.offset,source:``,message:`Tried to pop an empty stack`};else if(this.stack.length===0)yield t;else{let e=this.peek(1);switch(t.type===`block-scalar`?t.indent=`indent`in e?e.indent:0:t.type===`flow-collection`&&e.type===`document`&&(t.indent=0),t.type===`flow-collection`&&Km(t),e.type){case`document`:e.value=t;break;case`block-scalar`:e.props.push(t);break;case`block-map`:{let n=e.items[e.items.length-1];if(n.value){e.items.push({start:[],key:t,sep:[]}),this.onKeyLine=!0;return}if(n.sep)n.value=t;else{Object.assign(n,{key:t,sep:[]}),this.onKeyLine=!n.explicitKey;return}break}case`block-seq`:{let n=e.items[e.items.length-1];n.value?e.items.push({start:[],value:t}):n.value=t;break}case`flow-collection`:{let n=e.items[e.items.length-1];!n||n.value?e.items.push({start:[],key:t,sep:[]}):n.sep?n.value=t:Object.assign(n,{key:t,sep:[]});return}default:yield*this.pop(),yield*this.pop(t)}if((e.type===`document`||e.type===`block-map`||e.type===`block-seq`)&&(t.type===`block-map`||t.type===`block-seq`)){let n=t.items[t.items.length-1];n&&!n.sep&&!n.value&&n.start.length>0&&Vm(n.start)===-1&&(t.indent===0||n.start.every(e=>e.type!==`comment`||e.indent<t.indent))&&(e.type===`document`?e.end=n.start:e.items.push({start:n.start}),t.items.splice(-1,1))}}}*stream(){switch(this.type){case`directive-line`:yield{type:`directive`,offset:this.offset,source:this.source};return;case`byte-order-mark`:case`space`:case`comment`:case`newline`:yield this.sourceToken;return;case`doc-mode`:case`doc-start`:{let e={type:`document`,offset:this.offset,start:[]};this.type===`doc-start`&&e.start.push(this.sourceToken),this.stack.push(e);return}}yield{type:`error`,offset:this.offset,message:`Unexpected ${this.type} token in YAML stream`,source:this.source}}*document(e){if(e.value)return yield*this.lineEnd(e);switch(this.type){case`doc-start`:Vm(e.start)===-1?e.start.push(this.sourceToken):(yield*this.pop(),yield*this.step());return;case`anchor`:case`tag`:case`space`:case`comment`:case`newline`:e.start.push(this.sourceToken);return}let t=this.startBlockValue(e);t?this.stack.push(t):yield{type:`error`,offset:this.offset,message:`Unexpected ${this.type} token in YAML document`,source:this.source}}*scalar(e){if(this.type===`map-value-ind`){let t=Wm(Um(this.peek(2))),n;e.end?(n=e.end,n.push(this.sourceToken),delete e.end):n=[this.sourceToken];let r={type:`block-map`,offset:e.offset,indent:e.indent,items:[{start:t,key:e,sep:n}]};this.onKeyLine=!0,this.stack[this.stack.length-1]=r}else yield*this.lineEnd(e)}*blockScalar(e){switch(this.type){case`space`:case`comment`:case`newline`:e.props.push(this.sourceToken);return;case`scalar`:if(e.source=this.source,this.atNewLine=!0,this.indent=0,this.onNewLine){let e=this.source.indexOf(`
`)+1;for(;e!==0;)this.onNewLine(this.offset+e),e=this.source.indexOf(`
`,e)+1}yield*this.pop();break;default:yield*this.pop(),yield*this.step()}}*blockMap(e){let t=e.items[e.items.length-1];switch(this.type){case`newline`:if(this.onKeyLine=!1,t.value){let n=`end`in t.value?t.value.end:void 0;(Array.isArray(n)?n[n.length-1]:void 0)?.type===`comment`?n?.push(this.sourceToken):e.items.push({start:[this.sourceToken]})}else t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case`space`:case`comment`:if(t.value)e.items.push({start:[this.sourceToken]});else if(t.sep)t.sep.push(this.sourceToken);else{if(this.atIndentedComment(t.start,e.indent)){let n=e.items[e.items.length-2]?.value?.end;if(Array.isArray(n)){Gm(n,t.start),n.push(this.sourceToken),e.items.pop();return}}t.start.push(this.sourceToken)}return}if(this.indent>=e.indent){let n=!this.onKeyLine&&this.indent===e.indent,r=n&&(t.sep||t.explicitKey)&&this.type!==`seq-item-ind`,i=[];if(r&&t.sep&&!t.value){let n=[];for(let r=0;r<t.sep.length;++r){let i=t.sep[r];switch(i.type){case`newline`:n.push(r);break;case`space`:break;case`comment`:i.indent>e.indent&&(n.length=0);break;default:n.length=0}}n.length>=2&&(i=t.sep.splice(n[1]))}switch(this.type){case`anchor`:case`tag`:r||t.value?(i.push(this.sourceToken),e.items.push({start:i}),this.onKeyLine=!0):t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case`explicit-key-ind`:!t.sep&&!t.explicitKey?(t.start.push(this.sourceToken),t.explicitKey=!0):r||t.value?(i.push(this.sourceToken),e.items.push({start:i,explicitKey:!0})):this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken],explicitKey:!0}]}),this.onKeyLine=!0;return;case`map-value-ind`:if(t.explicitKey){if(!t.sep){if(Bm(t.start,`newline`))Object.assign(t,{key:null,sep:[this.sourceToken]});else{let e=Wm(t.start);this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:e,key:null,sep:[this.sourceToken]}]})}}else if(t.value)e.items.push({start:[],key:null,sep:[this.sourceToken]});else if(Bm(t.sep,`map-value-ind`))this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:i,key:null,sep:[this.sourceToken]}]});else if(Hm(t.key)&&!Bm(t.sep,`newline`)){let e=Wm(t.start),n=t.key,r=t.sep;r.push(this.sourceToken),delete t.key,delete t.sep,this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:e,key:n,sep:r}]})}else i.length>0?t.sep=t.sep.concat(i,this.sourceToken):t.sep.push(this.sourceToken)}else t.sep?t.value||r?e.items.push({start:i,key:null,sep:[this.sourceToken]}):Bm(t.sep,`map-value-ind`)?this.stack.push({type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:[],key:null,sep:[this.sourceToken]}]}):t.sep.push(this.sourceToken):Object.assign(t,{key:null,sep:[this.sourceToken]});this.onKeyLine=!0;return;case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:{let n=this.flowScalar(this.type);r||t.value?(e.items.push({start:i,key:n,sep:[]}),this.onKeyLine=!0):t.sep?this.stack.push(n):(Object.assign(t,{key:n,sep:[]}),this.onKeyLine=!0);return}default:{let r=this.startBlockValue(e);if(r){if(r.type===`block-seq`){if(!t.explicitKey&&t.sep&&!Bm(t.sep,`newline`)){yield*this.pop({type:`error`,offset:this.offset,message:`Unexpected block-seq-ind on same line with key`,source:this.source});return}}else n&&e.items.push({start:i});this.stack.push(r);return}}}}yield*this.pop(),yield*this.step()}*blockSequence(e){let t=e.items[e.items.length-1];switch(this.type){case`newline`:if(t.value){let n=`end`in t.value?t.value.end:void 0;(Array.isArray(n)?n[n.length-1]:void 0)?.type===`comment`?n?.push(this.sourceToken):e.items.push({start:[this.sourceToken]})}else t.start.push(this.sourceToken);return;case`space`:case`comment`:if(t.value)e.items.push({start:[this.sourceToken]});else{if(this.atIndentedComment(t.start,e.indent)){let n=e.items[e.items.length-2]?.value?.end;if(Array.isArray(n)){Gm(n,t.start),n.push(this.sourceToken),e.items.pop();return}}t.start.push(this.sourceToken)}return;case`anchor`:case`tag`:if(t.value||this.indent<=e.indent)break;t.start.push(this.sourceToken);return;case`seq-item-ind`:if(this.indent!==e.indent)break;t.value||Bm(t.start,`seq-item-ind`)?e.items.push({start:[this.sourceToken]}):t.start.push(this.sourceToken);return}if(this.indent>e.indent){let t=this.startBlockValue(e);if(t){this.stack.push(t);return}}yield*this.pop(),yield*this.step()}*flowCollection(e){let t=e.items[e.items.length-1];if(this.type===`flow-error-end`){let e;do yield*this.pop(),e=this.peek(1);while(e?.type===`flow-collection`)}else if(e.end.length===0){switch(this.type){case`comma`:case`explicit-key-ind`:!t||t.sep?e.items.push({start:[this.sourceToken]}):t.start.push(this.sourceToken);return;case`map-value-ind`:!t||t.value?e.items.push({start:[],key:null,sep:[this.sourceToken]}):t.sep?t.sep.push(this.sourceToken):Object.assign(t,{key:null,sep:[this.sourceToken]});return;case`space`:case`comment`:case`newline`:case`anchor`:case`tag`:!t||t.value?e.items.push({start:[this.sourceToken]}):t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:{let n=this.flowScalar(this.type);!t||t.value?e.items.push({start:[],key:n,sep:[]}):t.sep?this.stack.push(n):Object.assign(t,{key:n,sep:[]});return}case`flow-map-end`:case`flow-seq-end`:e.end.push(this.sourceToken);return}let n=this.startBlockValue(e);n?this.stack.push(n):(yield*this.pop(),yield*this.step())}else{let t=this.peek(2);if(t.type===`block-map`&&(this.type===`map-value-ind`&&t.indent===e.indent||this.type===`newline`&&!t.items[t.items.length-1].sep))yield*this.pop(),yield*this.step();else if(this.type===`map-value-ind`&&t.type!==`flow-collection`){let n=Wm(Um(t));Km(e);let r=e.end.splice(1,e.end.length);r.push(this.sourceToken);let i={type:`block-map`,offset:e.offset,indent:e.indent,items:[{start:n,key:e,sep:r}]};this.onKeyLine=!0,this.stack[this.stack.length-1]=i}else yield*this.lineEnd(e)}}flowScalar(e){if(this.onNewLine){let e=this.source.indexOf(`
`)+1;for(;e!==0;)this.onNewLine(this.offset+e),e=this.source.indexOf(`
`,e)+1}return{type:e,offset:this.offset,indent:this.indent,source:this.source}}startBlockValue(e){switch(this.type){case`alias`:case`scalar`:case`single-quoted-scalar`:case`double-quoted-scalar`:return this.flowScalar(this.type);case`block-scalar-header`:return{type:`block-scalar`,offset:this.offset,indent:this.indent,props:[this.sourceToken],source:``};case`flow-map-start`:case`flow-seq-start`:return{type:`flow-collection`,offset:this.offset,indent:this.indent,start:this.sourceToken,items:[],end:[]};case`seq-item-ind`:return{type:`block-seq`,offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken]}]};case`explicit-key-ind`:{this.onKeyLine=!0;let t=Wm(Um(e));return t.push(this.sourceToken),{type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:t,explicitKey:!0}]}}case`map-value-ind`:{this.onKeyLine=!0;let t=Wm(Um(e));return{type:`block-map`,offset:this.offset,indent:this.indent,items:[{start:t,key:null,sep:[this.sourceToken]}]}}}return null}atIndentedComment(e,t){return this.type!==`comment`||this.indent<=t?!1:e.every(e=>e.type===`newline`||e.type===`space`)}*documentEnd(e){this.type!==`doc-mode`&&(e.end?e.end.push(this.sourceToken):e.end=[this.sourceToken],this.type===`newline`&&(yield*this.pop()))}*lineEnd(e){switch(this.type){case`comma`:case`doc-start`:case`doc-end`:case`flow-seq-end`:case`flow-map-end`:case`map-value-ind`:yield*this.pop(),yield*this.step();break;case`newline`:this.onKeyLine=!1;default:e.end?e.end.push(this.sourceToken):e.end=[this.sourceToken],this.type===`newline`&&(yield*this.pop())}}};function Jm(e){let t=e.prettyErrors!==!1;return{lineCounter:e.lineCounter||t&&new zm||null,prettyErrors:t}}function Ym(e,t={}){let{lineCounter:n,prettyErrors:r}=Jm(t),i=new qm(n?.addNewLine),a=new Tm(t),o=null;for(let t of a.compose(i.parse(e),!0,e.length))if(!o)o=t;else if(o.options.logLevel!==`silent`){o.errors.push(new Vp(t.range.slice(0,2),`MULTIPLE_DOCS`,`Source contains multiple documents; please use YAML.parseAllDocuments()`));break}return r&&n&&(o.errors.forEach(Up(e,n)),o.warnings.forEach(Up(e,n))),o}function Xm(e,t,n){let r;typeof t==`function`?r=t:n===void 0&&t&&typeof t==`object`&&(n=t);let i=Ym(e,n);if(!i)return null;if(i.warnings.forEach(e=>yf(i.options.logLevel,e)),i.errors.length>0){if(i.options.logLevel!==`silent`)throw i.errors[0];i.errors=[]}return i.toJS(Object.assign({reviver:r},n))}function Zm(e,t,n){let r=null;if(typeof t==`function`||Array.isArray(t)?r=t:n===void 0&&t&&(n=t),typeof n==`string`&&(n=n.length),typeof n==`number`){let e=Math.round(n);n=e<1?void 0:e>8?{indent:8}:{indent:e}}if(e===void 0){let{keepUndefined:e}=n??t??{};if(!e)return}return vd(e)&&!r?e.toString(n):new Rp(e,r,n).toString(n)}var Qm=[{relativePath:`catalog/10inch/3dprint-10inch-cover-panel-hex-1u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "3dprint-10inch-cover-panel-hex-1u"
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
`},{relativePath:`catalog/10inch/asustor-lockerstor-4-gen2.yaml`,categoryDir:`10inch`,rawYaml:`slug: "asustor-lockerstor-4-gen2"
manufacturer: "ASUSTOR"
model: "Lockerstor 4 Gen2 (AS6704T) 4-Bay 2.5GbE NAS"
description: "Quiet 4-bay 2.5GbE + quad M.2 NVMe NAS (170×185.5×230mm) powered by Intel Celeron N5105 with dual 2.5GbE ports and dual USB 3.2 Gen2. Shelf-standing across 5U inside 10-inch or 19-inch racks."
category: "nas"
mount_type: "shelf-standing"
geometry:
  u_height: 4.2
  width_mm: 170.0
  height_mm: 185.5
  depth_mm: 230.0
  ear_mount_style: "none"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 2940
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 17
  max_system_watts: 35
  airflow: "front-to-rear"
  noise_db_a: 19.6
ports:
  - port_id: "usb_front"
    label: "USB 3.2 Gen2 Front"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 144.0
      y_mm: 26.0
      orientation: "upright"
  - port_id: "lan1_25g"
    label: "2.5GbE LAN 1"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 108.0
      y_mm: 38.0
      orientation: "upright"
  - port_id: "lan2_25g"
    label: "2.5GbE LAN 2"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 130.0
      y_mm: 38.0
      orientation: "upright"
  - port_id: "usb_rear"
    label: "USB 3.2 Rear"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 84.0
      y_mm: 38.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V 90W DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 148.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 569
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
  ups_battery_wh: 72
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
estimated_price_eur: 169
`},{relativePath:`catalog/10inch/deskpi-10inch-4bay-nvme-nas-2u.yaml`,categoryDir:`10inch`,rawYaml:`slug: "deskpi-10inch-4bay-nvme-nas-2u"
manufacturer: "DeskPi"
model: "RackMate 10-Inch 4-Bay M.2 NVMe NAS Enclosure 2U"
description: "Flaches 10-Zoll 2U All-Flash NVMe-NAS-Chassis (222×88.1×165mm) für bis zu 4x M.2 NVMe SSDs mit dualem 2.5GbE-LAN und integriertem PWM-Lüfter für kompakte Homelabs."
category: "nas"
mount_type: "rackmount-10"
geometry:
  u_height: 2.0
  width_mm: 222.0
  height_mm: 88.1
  depth_mm: 165.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.5
  rear_protrusion_mm: 0.0
  weight_grams: 1350
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 14
  max_system_watts: 38
  airflow: "front-to-rear"
  noise_db_a: 24.0
ports:
  - port_id: "usb_front_1"
    label: "USB 3.2 Front"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 190.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "lan1"
    label: "2.5GbE LAN 1"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 130.0
      y_mm: 32.0
      orientation: "upright"
  - port_id: "lan2"
    label: "2.5GbE LAN 2"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 150.0
      y_mm: 32.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V DC Input"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 180.0
      y_mm: 20.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 299
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
estimated_price_eur: 35
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
estimated_price_eur: 29
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
estimated_price_eur: 16
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
`},{relativePath:`catalog/10inch/mikrotik-crs305-1g-4s-plus-in.yaml`,categoryDir:`10inch`,rawYaml:`slug: "mikrotik-crs305-1g-4s-plus-in"
manufacturer: "MikroTik"
model: "CRS305-1G-4S+IN (4x 10G SFP+ Fanless Switch)"
description: "Compact silent fanless 10G fiber/DAC switch (141×28×115mm) featuring 4x 10G SFP+ cages, 1x 1GbE RJ45 PoE-In management port, and dual redundant DC inputs. Fits cleanly inside a 10-inch 1U rackmount tray or 3D-printed rack-ear bracket."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 141.0
  height_mm: 28.0
  depth_mm: 115.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 495
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 10
  max_system_watts: 18
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "sfp"
    label_prefix: "10G SFP+ "
    start_index: 1
    count: 4
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    orientation: "upright"
    grid:
      origin_x_mm: 28.0
      origin_y_mm: 14.0
      columns: 4
      rows: 1
      pitch_x_mm: 21.0
      pitch_y_mm: 0.0
ports:
  - port_id: "eth1"
    label: "1G ETH1 (PoE-In)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 116.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "dc_in1"
    label: "DC1 12-57V"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 34.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "dc_in2"
    label: "DC2 12-57V"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 62.0
      y_mm: 14.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 149
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
`},{relativePath:`catalog/10inch/mikrotik-rb5009ug-s-in.yaml`,categoryDir:`10inch`,rawYaml:`slug: "mikrotik-rb5009ug-s-in"
manufacturer: "MikroTik"
model: "RB5009UG+S+IN (10G SFP+ / 2.5G Router)"
description: "High-performance fanless ARM64 router (220×22×125mm) featuring 1x 10G SFP+, 1x 2.5GbE RJ45 with 802.3af/at PoE-In, 7x 1GbE RJ45 ports, and USB 3.0 in a heavy-duty metal heatsink enclosure. Mounts in a 10-inch 1U rack via MikroTik K-79 rackmount ears."
category: "router"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 220.0
  height_mm: 22.0
  depth_mm: 125.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 900
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 14
  max_system_watts: 25
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "eth"
    label_prefix: "ETH "
    start_index: 2
    count: 7
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 66.0
      origin_y_mm: 11.0
      columns: 7
      rows: 1
      pitch_x_mm: 15.5
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp_plus1"
    label: "10G SFP+"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 24.0
      y_mm: 11.0
      orientation: "upright"
  - port_id: "eth1"
    label: "2.5G ETH1 (PoE-In)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 46.0
      y_mm: 11.0
      orientation: "upright"
  - port_id: "usb1"
    label: "USB 3.0"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 184.0
      y_mm: 11.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "24-57V DC Input"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 190.0
      y_mm: 11.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#1F2937"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 215
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
`},{relativePath:`catalog/10inch/netgate-4200-pfsense-firewall.yaml`,categoryDir:`10inch`,rawYaml:`slug: "netgate-4200-pfsense-firewall"
manufacturer: "Netgate"
model: "Netgate 4200 pfSense+ Security Gateway"
description: "Fanless quad-core Intel Atom C1110 pfSense+ firewall appliance (220×60×180mm) with 4x 2.5GbE discrete RJ45 ports, RJ45 serial console, and USB 3.0. Fits a 10-inch 1.5U/2U rackmount kit or shelf cleanly."
category: "router"
mount_type: "rackmount-10"
geometry:
  u_height: 1.5
  width_mm: 220.0
  height_mm: 60.0
  depth_mm: 180.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 1350
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 12
  max_system_watts: 28
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "eth"
    label_prefix: "2.5G Port "
    start_index: 1
    count: 4
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 40.0
      origin_y_mm: 26.0
      columns: 4
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "console"
    label: "RJ45 Console"
    face: "front"
    connector_type: "rj45-serial-console"
    direction: "bidirectional"
    capabilities: ["serial-rs232"]
    coordinates:
      x_mm: 130.0
      y_mm: 26.0
      orientation: "upright"
  - port_id: "usb1"
    label: "USB 3.0"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 162.0
      y_mm: 26.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V Locking DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 188.0
      y_mm: 26.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 549
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
`},{relativePath:`catalog/10inch/qnap-ts-464-nas.yaml`,categoryDir:`10inch`,rawYaml:`slug: "qnap-ts-464-nas"
manufacturer: "QNAP"
model: "TS-464 4-Bay 2.5GbE x86 NAS"
description: "Compact 4-bay Intel Celeron N5095 NAS (170×165×226.5mm) featuring dual 2.5GbE RJ45 ports, dual M.2 NVMe PCIe slots, and USB 3.2 Gen2 connectivity. Shelf-standing across 4U inside 10-inch or 19-inch racks."
category: "nas"
mount_type: "shelf-standing"
geometry:
  u_height: 4.0
  width_mm: 170.0
  height_mm: 165.0
  depth_mm: 226.5
  ear_mount_style: "none"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 2260
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 21
  max_system_watts: 41
  airflow: "front-to-rear"
  noise_db_a: 21.0
ports:
  - port_id: "usb_front"
    label: "USB 3.2 Gen2 One-Touch"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 144.0
      y_mm: 26.0
      orientation: "upright"
  - port_id: "lan1_25g"
    label: "2.5GbE LAN 1"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 108.0
      y_mm: 36.0
      orientation: "upright"
  - port_id: "lan2_25g"
    label: "2.5GbE LAN 2"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 130.0
      y_mm: 36.0
      orientation: "upright"
  - port_id: "usb_rear"
    label: "USB 3.2 Rear"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 84.0
      y_mm: 36.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V 90W DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 148.0
      y_mm: 20.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 549
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
`},{relativePath:`catalog/10inch/synology-ds923-plus.yaml`,categoryDir:`10inch`,rawYaml:`slug: "synology-ds923-plus"
manufacturer: "Synology"
model: "DiskStation DS923+ 4-Bay NAS (10GbE Ready)"
description: "Desktop 4-bay 3.5-inch SATA NAS (199×166×223mm) with AMD Ryzen R1600, dual M.2 NVMe cache slots, 2x 1GbE RJ45, and optional 10GbE RJ45 upgrade module. Mounted shelf-standing across 4U inside 10-inch or 19-inch racks."
category: "nas"
mount_type: "shelf-standing"
geometry:
  u_height: 4.0
  width_mm: 199.0
  height_mm: 166.0
  depth_mm: 223.0
  ear_mount_style: "none"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 2240
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 12
  max_system_watts: 36
  airflow: "front-to-rear"
  noise_db_a: 22.9
ports:
  - port_id: "usb_front"
    label: "USB 3.2 Gen1 Front"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 175.0
      y_mm: 30.0
      orientation: "upright"
  - port_id: "lan1"
    label: "1GbE LAN 1"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 118.0
      y_mm: 34.0
      orientation: "upright"
  - port_id: "lan2"
    label: "1GbE LAN 2"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 138.0
      y_mm: 34.0
      orientation: "upright"
  - port_id: "lan3_10g"
    label: "10GbE E10G22-T1-Mini"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "10gbase-t"]
    coordinates:
      x_mm: 162.0
      y_mm: 58.0
      orientation: "upright"
  - port_id: "usb_rear"
    label: "USB 3.2 Rear"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0", "usb-3.1"]
    coordinates:
      x_mm: 118.0
      y_mm: 58.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V 100W DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 172.0
      y_mm: 26.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 629
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
`},{relativePath:`catalog/10inch/ubiquiti-usw-enterprise-8-poe.yaml`,categoryDir:`10inch`,rawYaml:`slug: "ubiquiti-usw-enterprise-8-poe"
manufacturer: "Ubiquiti"
model: "UniFi Switch Enterprise 8 PoE (USW-Enterprise-8-PoE)"
description: "Layer-3 2.5GbE PoE+ desktop/10-inch rackable switch (200×44×248mm) offering 8x 2.5GbE RJ45 PoE+ ports (120W total PoE budget), 2x 10G SFP+ uplinks, and a 1.3-inch front touchscreen. Mounts in 10-inch racks >= 280mm deep via included/3D-printed 10-inch brackets."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 200.0
  height_mm: 44.0
  depth_mm: 248.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 2400
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 14
  max_system_watts: 30
  poe_budget_watts: 120
  airflow: "front-to-rear"
  noise_db_a: 26.0
port_groups:
  - id_prefix: "eth"
    label_prefix: "2.5G PoE+ "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at"]
    orientation: "upright"
    grid:
      origin_x_mm: 36.0
      origin_y_mm: 22.0
      columns: 8
      rows: 1
      pitch_x_mm: 15.0
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp1"
    label: "10G SFP+ 9"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 162.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp2"
    label: "10G SFP+ 10"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 182.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "100-240V AC"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 172.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 479
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
estimated_price_eur: 199
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
`},{relativePath:`catalog/10inch/ubiquiti-usw-pro-xg-8-poe.yaml`,categoryDir:`10inch`,rawYaml:`slug: "ubiquiti-usw-pro-xg-8-poe"
manufacturer: "Ubiquiti"
model: "UniFi Pro XG 8 PoE (8x 10GbE PoE+++ + 2x 10G SFP+)"
description: "Kompakter Layer-3 10GbE Multi-Gigabit PoE+++ Switch (210×43.7×185mm) mit 8x 10GbE RJ45 (155W Gesamtbudget) und 2x 10G SFP+ Uplinks. Passt mit 3D-gedruckter 10-Zoll-Aufnahme perfekt ins High-Speed-Mini-Rack."
category: "switch"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 210.0
  height_mm: 43.7
  depth_mm: 185.0
  ear_mount_style: "included-10inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 1620
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 16
  max_system_watts: 35
  poe_budget_watts: 155
  airflow: "front-to-rear"
  noise_db_a: 26.0
port_groups:
  - id_prefix: "eth"
    label_prefix: "10G Port "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "5gbase-t", "10gbase-t", "poe-out", "poe+", "poe-out-af", "poe-out-at", "poe-out-bt-type3", "poe-out-bt-type4"]
    orientation: "upright"
    grid:
      origin_x_mm: 24.0
      origin_y_mm: 21.5
      columns: 8
      rows: 1
      pitch_x_mm: 15.0
      pitch_y_mm: 0.0
ports:
  - port_id: "sfp1"
    label: "10G SFP+ 9"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 154.0
      y_mm: 21.5
      orientation: "upright"
  - port_id: "sfp2"
    label: "10G SFP+ 10"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 174.0
      y_mm: 21.5
      orientation: "upright"
  - port_id: "pwr_in"
    label: "AC Mains In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 176.0
      y_mm: 21.5
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 479
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
`},{relativePath:`catalog/10inch/ugreen-nasync-dxp4800-plus.yaml`,categoryDir:`10inch`,rawYaml:`slug: "ugreen-nasync-dxp4800-plus"
manufacturer: "UGREEN"
model: "NASync DXP4800 Plus 4-Bay NAS (10GbE + 2.5GbE)"
description: "High-speed 4-bay aluminum desktop NAS (178×178×257.5mm) with Intel Pentium Gold 8505, dual M.2 NVMe slots, 1x 10GbE RJ45, and 1x 2.5GbE RJ45. Sits shelf-standing in 10-inch deep racks or 19-inch racks."
category: "nas"
mount_type: "shelf-standing"
geometry:
  u_height: 4.1
  width_mm: 178.0
  height_mm: 178.0
  depth_mm: 257.5
  ear_mount_style: "none"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 3900
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 18
  max_system_watts: 48
  airflow: "front-to-rear"
  noise_db_a: 26.0
ports:
  - port_id: "usb_c_front"
    label: "USB-C 3.2 Gen2"
    face: "front"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 128.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "usb_a_front"
    label: "USB-A 3.2 Gen2"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 148.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "lan1_10g"
    label: "10GbE LAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "10gbase-t"]
    coordinates:
      x_mm: 110.0
      y_mm: 34.0
      orientation: "upright"
  - port_id: "lan2_25g"
    label: "2.5GbE LAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 132.0
      y_mm: 34.0
      orientation: "upright"
  - port_id: "usb_rear"
    label: "USB-A 3.2 Rear"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 86.0
      y_mm: 34.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "19V 150W DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 152.0
      y_mm: 24.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 699
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
  ups_battery_wh: 260
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
estimated_price_eur: 799
`},{relativePath:`catalog/19inch/apc-smart-ups-750va-rm-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "apc-smart-ups-750va-rm-1u"
manufacturer: "APC"
model: "Smart-UPS 750VA RM 1U (SUA750RMI1U / 480W)"
description: "Classic 19-inch 1U line-interactive rackmount UPS (432×44×660mm, 750VA / 480W, 216Wh VRLA cartridge) with 4x IEC-C13 battery outlets and SmartSlot network management for deep 800mm+ server cabinets."
category: "ups"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 432.0
  height_mm: 44.0
  depth_mm: 660.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 10.0
  rear_protrusion_mm: 0.0
  weight_grams: 21820
power_and_thermal:
  electrical_role: "ups"
  idle_watts: 15
  max_system_watts: 35
  ups_capacity_watts: 480
  ups_battery_wh: 216
  airflow: "front-to-rear"
  noise_db_a: 42.0
port_groups:
  - id_prefix: "iec_out"
    label_prefix: "OUT "
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "iec-c13"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 130.0
      origin_y_mm: 22.0
      columns: 4
      rows: 1
      pitch_x_mm: 42.0
      pitch_y_mm: 0.0
ports:
  - port_id: "ac_in"
    label: "IEC-C14 AC In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 65.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "mgmt_eth"
    label: "Network Mgmt"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 345.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 599
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
  ups_battery_wh: 216
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
estimated_price_eur: 1190
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
`},{relativePath:`catalog/19inch/cyberpower-or600erm1u-ups.yaml`,categoryDir:`19inch`,rawYaml:`slug: "cyberpower-or600erm1u-ups"
manufacturer: "CyberPower"
model: "OR600ERM1U Short-Depth 1U Rack UPS (600VA / 360W)"
description: "Short-depth 19-inch 1U line-interactive rackmount UPS (433×44×235mm, 600VA / 360W, 86Wh battery) with front LCD status display and 4x rear IEC-C13 battery outlets — ideal for shallow 400–600mm wall cabinets."
category: "ups"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 433.0
  height_mm: 44.0
  depth_mm: 235.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 6.0
  rear_protrusion_mm: 0.0
  weight_grams: 7800
power_and_thermal:
  electrical_role: "ups"
  idle_watts: 10
  max_system_watts: 24
  ups_capacity_watts: 360
  ups_battery_wh: 86
  airflow: "front-to-rear"
  noise_db_a: 38.0
port_groups:
  - id_prefix: "iec_out"
    label_prefix: "Battery OUT "
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "iec-c13"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 125.0
      origin_y_mm: 22.0
      columns: 4
      rows: 1
      pitch_x_mm: 42.0
      pitch_y_mm: 0.0
ports:
  - port_id: "ac_in"
    label: "IEC-C14 AC In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 62.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 259
`},{relativePath:`catalog/19inch/digitus-19inch-patch-panel-24p.yaml`,categoryDir:`19inch`,rawYaml:`slug: "digitus-19inch-patch-panel-24p"
manufacturer: "DIGITUS"
model: "19-Inch 1U 24-Port Modular Keystone Patch Panel (DN-91410)"
description: "Shielded 19-inch 1U 24-port modular Cat6A keystone patch panel (482.6×44×32mm) with numbered ports, integrated rear strain relief bar, and passive front-to-rear coupler support."
category: "patch-panel"
mount_type: "rackmount-19"
is_passthrough_coupler: true
geometry:
  u_height: 1.0
  width_mm: 482.6
  height_mm: 44.0
  depth_mm: 32.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 680
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
  noise_db_a: 0
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
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 39
`},{relativePath:`catalog/19inch/eaton-5p-650i-rack-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "eaton-5p-650i-rack-1u"
manufacturer: "Eaton"
model: "5P 650i Rack 1U Line-Interactive UPS (650VA / 420W)"
description: "Enterprise 19-inch 1U pure sinewave line-interactive UPS (438×43.2×364mm, 650VA / 420W, 108Wh battery) with 4x IEC-C13 switched outlets, front LCD panel, and network management interface."
category: "ups"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 438.0
  height_mm: 43.2
  depth_mm: 364.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 8.0
  rear_protrusion_mm: 0.0
  weight_grams: 8600
power_and_thermal:
  electrical_role: "ups"
  idle_watts: 10
  max_system_watts: 28
  ups_capacity_watts: 420
  ups_battery_wh: 108
  airflow: "front-to-rear"
  noise_db_a: 40.0
port_groups:
  - id_prefix: "iec_out"
    label_prefix: "OUT "
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "iec-c13"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 130.0
      origin_y_mm: 21.6
      columns: 4
      rows: 1
      pitch_x_mm: 40.0
      pitch_y_mm: 0.0
ports:
  - port_id: "ac_in"
    label: "IEC-C14 AC In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 68.0
      y_mm: 21.6
      orientation: "upright"
  - port_id: "mgmt_eth"
    label: "Network Mgmt"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 340.0
      y_mm: 21.6
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 449
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
`},{relativePath:`catalog/19inch/gl-inet-mt6000-flint-2.yaml`,categoryDir:`19inch`,rawYaml:`slug: "gl-inet-mt6000-flint-2"
manufacturer: "GL.iNet"
model: "Flint 2 (GL-MT6000) Dual 2.5G Wi-Fi 6 OpenWrt Router"
description: "High-throughput OpenWrt / WireGuard router box (233×53×137mm excluding antennas) equipped with 2x 2.5GbE RJ45 (WAN/LAN), 4x 1GbE RJ45 LAN ports, and USB 3.0. Mounts shelf-standing across 2U inside a 19-inch rack."
category: "router"
mount_type: "shelf-standing"
geometry:
  u_height: 1.2
  width_mm: 233.0
  height_mm: 53.0
  depth_mm: 137.0
  ear_mount_style: "none"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 761
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 6.5
  max_system_watts: 19.0
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "lan"
    label_prefix: "1G LAN "
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 86.0
      origin_y_mm: 22.0
      columns: 4
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "wan_25g"
    label: "2.5G WAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 34.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "lan_25g"
    label: "2.5G LAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 58.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "usb1"
    label: "USB 3.0"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 168.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V 4A DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 204.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#374151"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 149
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
`},{relativePath:`catalog/19inch/mikrotik-l009uigs-rm.yaml`,categoryDir:`19inch`,rawYaml:`slug: "mikrotik-l009uigs-rm"
manufacturer: "MikroTik"
model: "L009UiGS-RM (19-Inch 1U 8x GbE + 2.5G SFP Router)"
description: "Fanless 19-inch 1U ARM64 rackmount router (443×44×125mm) equipped with 8x 1GbE RJ45 ports (PoE-In on ETH1, PoE-Out on ETH8), 1x 2.5G SFP cage, RJ45 serial console, and USB 3.0."
category: "router"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 443.0
  height_mm: 44.0
  depth_mm: 125.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 980
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 8
  max_system_watts: 15
  poe_budget_watts: 24
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "eth"
    label_prefix: "ETH "
    start_index: 2
    count: 6
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 165.0
      origin_y_mm: 22.0
      columns: 6
      rows: 1
      pitch_x_mm: 16.0
      pitch_y_mm: 0.0
ports:
  - port_id: "console"
    label: "RJ45 Console"
    face: "front"
    connector_type: "rj45-serial-console"
    direction: "bidirectional"
    capabilities: ["serial-rs232"]
    coordinates:
      x_mm: 110.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "eth1"
    label: "ETH1 (PoE-In)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 145.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "eth8"
    label: "ETH8 (PoE-Out)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-out", "poe-out-af", "poe-out-at"]
    coordinates:
      x_mm: 265.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "sfp1"
    label: "2.5G SFP"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 292.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "usb1"
    label: "USB 3.0"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 322.0
      y_mm: 22.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "24-56V DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 400.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#7F1D1D"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 129
`},{relativePath:`catalog/19inch/startech-19inch-brush-panel-1u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "startech-19inch-brush-panel-1u"
manufacturer: "StarTech.com"
model: "19-Inch 1U High-Density Cable Brush Strip Panel (CMBRUSH1U)"
description: "19-inch 1U steel cable management brush panel (482.6×44×16mm) with high-density nylon bristles serving as a clean front-to-rear cable pass-through portal while blocking bypass airflow."
category: "brush-panel"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 482.6
  height_mm: 44.0
  depth_mm: 16.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 310
  has_cable_pass_through: true
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
  noise_db_a: 0
visuals:
  chassis_color_hex: "#111827"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 24
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
`},{relativePath:`catalog/19inch/ubiquiti-pdu-pro-19inch-2u.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-pdu-pro-19inch-2u"
manufacturer: "Ubiquiti"
model: "UniFi Power Distribution Pro (USP-PDU-Pro 2U)"
description: "Managed 19-inch 2U smart PDU (442.4×87.4×106mm) featuring 16x individually switchable rear AC outlets (IEC-C13), 4x front USB-C power ports (20W shared), GbE management uplink, and a 1.3-inch OLED touchscreen."
category: "pdu"
mount_type: "rackmount-19"
geometry:
  u_height: 2.0
  width_mm: 442.4
  height_mm: 87.4
  depth_mm: 106.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 3700
power_and_thermal:
  electrical_role: "pdu"
  idle_watts: 12
  max_system_watts: 40
  pdu_capacity_watts: 1875
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "outlet"
    label_prefix: "AC Outlet "
    start_index: 1
    count: 16
    face: "rear"
    connector_type: "iec-c13"
    direction: "output"
    capabilities: ["ac-mains"]
    orientation: "upright"
    grid:
      origin_x_mm: 52.0
      origin_y_mm: 24.0
      columns: 8
      rows: 2
      pitch_x_mm: 42.0
      pitch_y_mm: 36.0
  - id_prefix: "usbc_out"
    label_prefix: "USB-C "
    start_index: 1
    count: 4
    face: "front"
    connector_type: "usb-c"
    direction: "output"
    capabilities: ["usb-pd", "dc-power"]
    orientation: "upright"
    grid:
      origin_x_mm: 110.0
      origin_y_mm: 24.0
      columns: 4
      rows: 1
      pitch_x_mm: 22.0
      pitch_y_mm: 0.0
ports:
  - port_id: "eth_gbe"
    label: "1GbE Mgmt"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 240.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "Mains AC Input"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 404.0
      y_mm: 44.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#D1D5DB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 299
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
`},{relativePath:`catalog/19inch/ubiquiti-usw-pro-max-48-poe.yaml`,categoryDir:`19inch`,rawYaml:`slug: "ubiquiti-usw-pro-max-48-poe"
manufacturer: "Ubiquiti"
model: "UniFi Switch Pro Max 48 PoE (USW-Pro-Max-48-PoE)"
description: "19-inch 1U Layer-3 Etherlighting PoE++ core switch (442.4×44×400mm, 720W PoE budget) featuring 16x 2.5GbE PoE++, 32x 1GbE PoE+/PoE++, 4x 10G SFP+ uplinks, and a 1.3-inch front touchscreen."
category: "switch"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 442.4
  height_mm: 44.0
  depth_mm: 400.0
  ear_mount_style: "included-19inch-ears"
  front_protrusion_mm: 4.0
  rear_protrusion_mm: 0.0
  weight_grams: 6300
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 45
  max_system_watts: 100
  poe_budget_watts: 720
  airflow: "front-to-rear"
  noise_db_a: 33.0
port_groups:
  - id_prefix: "eth"
    label_prefix: "Port "
    start_index: 1
    count: 48
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-out", "poe+", "poe-out-af", "poe-out-at", "poe-out-bt-type3", "poe-out-bt-type4"]
    orientation: "upright"
    grid:
      origin_x_mm: 44.0
      origin_y_mm: 14.0
      columns: 24
      rows: 2
      pitch_x_mm: 14.4
      pitch_y_mm: 15.0
ports:
  - port_id: "sfp1"
    label: "10G SFP+ 49"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 396.0
      y_mm: 29.0
      orientation: "upright"
  - port_id: "sfp2"
    label: "10G SFP+ 50"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 396.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "sfp3"
    label: "10G SFP+ 51"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 418.0
      y_mm: 29.0
      orientation: "upright"
  - port_id: "sfp4"
    label: "10G SFP+ 52"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-lr", "10gbase-dac"]
    coordinates:
      x_mm: 418.0
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
estimated_price_eur: 1299
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
`},{relativePath:`catalog/6inch/mikrotik-hex-s-2025.yaml`,categoryDir:`6inch`,rawYaml:`slug: "mikrotik-hex-s-2025"
manufacturer: "MikroTik"
model: "hEX S (2025 E60iUGS) 5x GbE + 2.5G SFP Router"
description: "Ultra-compact 6-inch micro-lab router (113×28×89mm) featuring 5x 1GbE RJ45 ports (PoE-In on ETH1, passive/af PoE-Out on ETH5) and 1x 2.5G SFP fiber cage. Fits natively in 6-inch 1U micro-racks via 3D-printed rack ears."
category: "router"
mount_type: "rackmount-6"
geometry:
  u_height: 1.0
  width_mm: 113.0
  height_mm: 28.0
  depth_mm: 89.0
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 350
power_and_thermal:
  electrical_role: "pse-switch"
  idle_watts: 5
  max_system_watts: 10
  poe_budget_watts: 13
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "eth"
    label_prefix: "ETH "
    start_index: 2
    count: 3
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 36.0
      origin_y_mm: 14.0
      columns: 3
      rows: 1
      pitch_x_mm: 15.0
      pitch_y_mm: 0.0
ports:
  - port_id: "eth1"
    label: "ETH1 (PoE-In)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 21.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "eth5"
    label: "ETH5 (PoE-Out)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-out", "poe-out-af"]
    coordinates:
      x_mm: 81.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "sfp1"
    label: "2.5G SFP"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 100.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12-57V DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 92.0
      y_mm: 14.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 79
`},{relativePath:`catalog/6inch/ubiquiti-usw-flex-2-5g-5.yaml`,categoryDir:`6inch`,rawYaml:`slug: "ubiquiti-usw-flex-2-5g-5"
manufacturer: "Ubiquiti"
model: "UniFi Flex Mini 2.5G (USW-Flex-2.5G-5)"
description: "Fanless 5-port 2.5GbE desktop/6-inch micro-rack switch (117.1×21.2×90mm) powered via USB-C PD or 802.3at PoE-In on Port 5. Mounts cleanly inside 6-inch 1U micro-homelab enclosures."
category: "switch"
mount_type: "rackmount-6"
geometry:
  u_height: 1.0
  width_mm: 117.1
  height_mm: 21.2
  depth_mm: 90.0
  ear_mount_style: "included-6inch-ears"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 206
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 2.5
  max_system_watts: 6.4
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "eth"
    label_prefix: "2.5G Port "
    start_index: 1
    count: 4
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 20.0
      origin_y_mm: 10.6
      columns: 4
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "eth5"
    label: "2.5G Uplink (PoE-In)"
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "poe-in-af", "poe-in-at"]
    coordinates:
      x_mm: 94.0
      y_mm: 10.6
      orientation: "upright"
  - port_id: "usbc_pwr"
    label: "5V USB-C In"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 94.0
      y_mm: 10.6
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "polycarbonate"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 54
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
`},{relativePath:`catalog/carriers/3dprint-10inch-jetkvm-plus-3keystone-1u.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-jetkvm-plus-3keystone-1u"
manufacturer: "Community 3D-Print"
model: "10-Inch 1U Carrier for 1x JetKVM + 3x Keystone"
description: "3D-printable 10-inch 1U modular faceplate carrier (PETG / ABS) holding 1x JetKVM out-of-band IP-KVM touchscreen module on the left and 3x standard RJ45 keystone coupler cutouts on the right."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 85.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 130
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
  noise_db_a: 0
slots:
  - slot_id: "jetkvm-bay-1"
    accepted_slot_type: "jetkvm-bay"
    offset_mm:
      x: 24.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 48.0
      height: 38.0
      depth: 70.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 140.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 170.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-3"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 200.0
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
  filament_grams: 120
  material_recommendation: "PETG / ABS"
  heat_set_inserts: "4x M3x5x4mm"
  fasteners: "4x M3x10mm Socket Head + 4x M6 cage nuts"
  printables_url: "https://www.printables.com/model/10inch-jetkvm-3keystone-1u"
estimated_price_eur: 14
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
`},{relativePath:`catalog/carriers/3dprint-10inch-mac-mini-m4-plus-2keystone-2u.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-mac-mini-m4-plus-2keystone-2u"
manufacturer: "Community 3D-Print"
model: "10-Inch 2U Carrier for Apple Mac mini M4 + 2x Keystone"
description: "3D-druckbarer 10-Zoll 2U Modulträger (PETG/ASA) passgenau für einen Apple Mac mini M4 (127×50×127mm) inklusive Belüftungsschlitzen und 2x Keystone-Buchsen auf der Vorderseite."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 2.0
  width_mm: 254.0
  height_mm: 88.1
  depth_mm: 145.0
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
  - slot_id: "mac-mini-bay"
    accepted_slot_type: "mac-mini-m4"
    offset_mm:
      x: 20.0
      y: 17.0
      z: 0.0
    max_dimensions_mm:
      width: 130.0
      height: 54.0
      depth: 140.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 174.0
      y: 33.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 202.0
      y: 33.0
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
  filament_grams: 138
  material_recommendation: "PETG / ASA"
  heat_set_inserts: "4x M3x5x4mm"
  fasteners: "4x M6 Cage Nuts & Screws"
  printables_url: "https://www.printables.com/model/10inch-mac-mini-m4-2u-carrier"
`},{relativePath:`catalog/carriers/3dprint-10inch-minisforum-ms01-2u.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-minisforum-ms01-2u"
manufacturer: "Community 3D-Print"
model: "10-Inch 2U Carrier for Minisforum MS-01 + 2x Keystone"
description: "3D-printable 10-inch 2U heavy-duty ventilated tray carrier (PETG-CF / ABS / ASA) tailored for 1x Minisforum MS-01 SFF workstation (196×48×189mm) plus 2x side-stacked standard keystone passthrough ports."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 2.0
  width_mm: 254.0
  height_mm: 88.1
  depth_mm: 195.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 280
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "front-to-rear"
  noise_db_a: 0
slots:
  - slot_id: "ms01-bay-1"
    accepted_slot_type: "mini-pc-workstation"
    offset_mm:
      x: 18.0
      y: 18.0
      z: 0.0
    max_dimensions_mm:
      width: 198.0
      height: 50.0
      depth: 192.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 219.0
      y: 16.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 219.0
      y: 46.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "3d-printed-abs"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata:
  filament_grams: 265
  material_recommendation: "PETG-CF or ABS / ASA"
  heat_set_inserts: "4x M3x5x4mm brass inserts"
  fasteners: "4x M3x12mm Socket Head + 4x M6 cage nuts"
  printables_url: "https://www.printables.com/model/10inch-minisforum-ms01-2u"
estimated_price_eur: 22
`},{relativePath:`catalog/carriers/3dprint-10inch-nanokvm-plus-4keystone-1u.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-10inch-nanokvm-plus-4keystone-1u"
manufacturer: "Community 3D-Print"
model: "10-Inch 1U Carrier for 2x Sipeed NanoKVM + 4x Keystone"
description: "3D-printable 10-inch 1U out-of-band management carrier (PETG) supporting up to 2x Sipeed NanoKVM Full IP-KVM cubes (ip-kvm-compact) alongside 4x standard RJ45 keystone passthrough couplers."
category: "modular-carrier"
mount_type: "rackmount-10"
geometry:
  u_height: 1.0
  width_mm: 254.0
  height_mm: 44.0
  depth_mm: 60.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 110
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "passive-convection"
  noise_db_a: 0
slots:
  - slot_id: "nanokvm-bay-1"
    accepted_slot_type: "ip-kvm-compact"
    offset_mm:
      x: 20.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 44.0
      height: 38.0
      depth: 45.0
  - slot_id: "nanokvm-bay-2"
    accepted_slot_type: "ip-kvm-compact"
    offset_mm:
      x: 72.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 44.0
      height: 38.0
      depth: 45.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 132.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 158.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-3"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 184.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-4"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 210.0
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
  filament_grams: 105
  material_recommendation: "PETG / PLA+"
  heat_set_inserts: "4x M3x5x4mm"
  fasteners: "4x M3x10mm Socket Head + 4x M6 cage nuts"
  printables_url: "https://www.printables.com/model/10inch-nanokvm-4keystone-1u"
estimated_price_eur: 12
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
`},{relativePath:`catalog/carriers/3dprint-19inch-quad-rpi5-poe-1u.yaml`,categoryDir:`carriers`,rawYaml:`slug: "3dprint-19inch-quad-rpi5-poe-1u"
manufacturer: "Community 3D-Print"
model: "19-Inch 1U Cluster Carrier for 4x Raspberry Pi 5 PoE+ + 2x Keystone"
description: "2-piece interlocking 3D-printable 19-inch 1U SBC cluster rackmount carrier (PETG / ABS) accommodating 4x Raspberry Pi 5 PoE+ nodes side-by-side plus 2x keystone uplink couplers."
category: "modular-carrier"
mount_type: "rackmount-19"
geometry:
  u_height: 1.0
  width_mm: 482.6
  height_mm: 44.0
  depth_mm: 110.0
  ear_mount_style: "flush-front"
  front_protrusion_mm: 3.0
  rear_protrusion_mm: 0.0
  weight_grams: 280
power_and_thermal:
  electrical_role: "passive"
  idle_watts: 0
  max_system_watts: 0
  airflow: "front-to-rear"
  noise_db_a: 0
slots:
  - slot_id: "rpi-bay-1"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 24.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 66.0
      height: 36.0
      depth: 100.0
  - slot_id: "rpi-bay-2"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 104.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 66.0
      height: 36.0
      depth: 100.0
  - slot_id: "rpi-bay-3"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 184.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 66.0
      height: 36.0
      depth: 100.0
  - slot_id: "rpi-bay-4"
    accepted_slot_type: "sbc-rpi5"
    offset_mm:
      x: 264.0
      y: 4.0
      z: 0.0
    max_dimensions_mm:
      width: 66.0
      height: 36.0
      depth: 100.0
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 370.0
      y: 11.0
      z: 0.0
    max_dimensions_mm:
      width: 16.5
      height: 22.0
      depth: 35.0
  - slot_id: "keystone-2"
    accepted_slot_type: "standard-keystone"
    offset_mm:
      x: 400.0
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
  filament_grams: 260
  material_recommendation: "PETG / ABS (2-Piece Interlocking)"
  heat_set_inserts: "16x M2.5x4mm, 4x M3x5x4mm"
  fasteners: "16x M2.5x8mm Pan Head + 4x M6 cage nuts"
  printables_url: "https://www.printables.com/model/19inch-quad-rpi5-1u"
estimated_price_eur: 24
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
`},{relativePath:`catalog/sub-modules/apple-mac-mini-m4.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "apple-mac-mini-m4"
manufacturer: "Apple"
model: "Mac mini M4 / M4 Pro (10GbE Homelab Node)"
description: "Ultrakompakter Apple Mac mini M4 (127×50×127mm) aus eloxiertem Aluminium mit internem Netzteil, frontseitigen USB-C-Ports und 10GbE Ethernet — beliebt als leiser 24/7 AI-, Build- oder Docker-Node im 10-Zoll-2U-Carrier."
category: "mini-pc"
mount_type: "sub-module"
slot_compatibility: "mac-mini-m4"
geometry:
  u_height: 1.15
  width_mm: 127.0
  height_mm: 50.0
  depth_mm: 127.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 1.0
  rear_protrusion_mm: 0.0
  weight_grams: 670
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 5
  max_system_watts: 65
  airflow: "front-to-rear"
  noise_db_a: 18.0
ports:
  - port_id: "usb_c_front_1"
    label: "Front USB-C 1"
    face: "front"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 44.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "usb_c_front_2"
    label: "Front USB-C 2"
    face: "front"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 58.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "audio_front"
    label: "3.5mm Audio"
    face: "front"
    connector_type: "audio-35mm"
    direction: "bidirectional"
    capabilities: ["audio-analog"]
    coordinates:
      x_mm: 74.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth0"
    label: "10GbE RJ45"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t", "10gbase-t"]
    coordinates:
      x_mm: 28.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "tb4_1"
    label: "Thunderbolt USB-C"
    face: "rear"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 52.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "ac_in"
    label: "AC Mains In"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates:
      x_mm: 98.0
      y_mm: 22.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 699
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
`},{relativePath:`catalog/sub-modules/hp-prodesk-400-g6-mini.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "hp-prodesk-400-g6-mini"
manufacturer: "HP"
model: "ProDesk 400 G6 Desktop Mini PC (1L USFF)"
description: "Compact 1-liter enterprise USFF mini-PC (177×34.2×175mm) supporting Intel Core 10th Gen T-series CPUs, 64GB DDR4, and M.2 NVMe storage for Proxmox or Docker workloads. Mounts inside any \`mini-pc-1liter\` 10-inch or 19-inch 1U carrier."
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
  idle_watts: 9.0
  max_system_watts: 65
  airflow: "front-to-rear"
  noise_db_a: 23.5
ports:
  - port_id: "usb_c_front"
    label: "USB-C 3.2"
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
      x_mm: 64.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "audio_front"
    label: "Headset Audio"
    face: "front"
    connector_type: "audio-35mm"
    direction: "bidirectional"
    capabilities: ["audio-analog"]
    coordinates:
      x_mm: 86.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "19.5V DC Input"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 22.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "usb_rear"
    label: "USB-A 3.2 Rear"
    face: "rear"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 108.0
      y_mm: 16.0
      orientation: "upright"
  - port_id: "eth0"
    label: "1GbE RJ45 LAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    coordinates:
      x_mm: 136.0
      y_mm: 16.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 195
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
estimated_price_eur: 185
`},{relativePath:`catalog/sub-modules/minisforum-ms-01-workstation.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "minisforum-ms-01-workstation"
manufacturer: "Minisforum"
model: "MS-01 SFF Workstation & Proxmox Node (Dual 10G SFP+ / Dual 2.5G)"
description: "Ultrakompakte Hochleistungs-Workstation und Proxmox-Virtualisierungs-Node (196×48×189mm) mit 2x 10G SFP+, 2x 2.5GbE RJ45, PCIe x16 Slot und bis zu 3x M.2 NVMe SSDs. Passt in passende 10-Zoll- oder 19-Zoll-Träger (\`mini-pc-workstation\`)."
category: "mini-pc"
mount_type: "sub-module"
slot_compatibility: "mini-pc-workstation"
geometry:
  u_height: 1.1
  width_mm: 196.0
  height_mm: 48.0
  depth_mm: 189.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 2.0
  rear_protrusion_mm: 0.0
  weight_grams: 1420
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 18
  max_system_watts: 65
  airflow: "front-to-rear"
  noise_db_a: 29.0
ports:
  - port_id: "usb_c_front_1"
    label: "USB 3.2 Gen2"
    face: "front"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 42.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "usb_a_front_1"
    label: "USB-A 3.2"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.1"]
    coordinates:
      x_mm: 62.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "sfp1"
    label: "10G SFP+ 1"
    face: "rear"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 32.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "sfp2"
    label: "10G SFP+ 2"
    face: "rear"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates:
      x_mm: 54.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "eth0"
    label: "2.5GbE LAN 1"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 84.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "eth1"
    label: "2.5GbE LAN 2"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 106.0
      y_mm: 24.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "19V DC Input"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 162.0
      y_mm: 24.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#27272A"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 699
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
`},{relativePath:`catalog/sub-modules/protectli-fw4b-firewall.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "protectli-fw4b-firewall"
manufacturer: "Protectli"
model: "Vault FW4B 4-Port Fanless Firewall Appliance"
description: "Fanless aluminum 4x Intel i211 1GbE firewall/router appliance (115×39×107.5mm) for OPNsense, pfSense, or VyOS with RJ45 COM console and dual front USB 3.0 ports. Fits \`intel-nuc-4x4\` 10-inch carriers or rack shelves."
category: "router"
mount_type: "sub-module"
slot_compatibility: "intel-nuc-4x4"
geometry:
  u_height: 0.9
  width_mm: 115.0
  height_mm: 39.0
  depth_mm: 107.5
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 0.0
  rear_protrusion_mm: 0.0
  weight_grams: 500
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 5.5
  max_system_watts: 18
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "eth"
    label_prefix: "1GbE Port "
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 30.0
      origin_y_mm: 18.0
      columns: 4
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "usb_front1"
    label: "USB 3.0 Front 1"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 34.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "usb_front2"
    label: "USB 3.0 Front 2"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 54.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "console"
    label: "RJ45 COM Console"
    face: "front"
    connector_type: "rj45-serial-console"
    direction: "bidirectional"
    capabilities: ["serial-rs232"]
    coordinates:
      x_mm: 84.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 102.0
      y_mm: 18.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "coated-aluminum"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 269
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
`},{relativePath:`catalog/sub-modules/sipeed-nanokvm-full.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "sipeed-nanokvm-full"
manufacturer: "Sipeed"
model: "NanoKVM Full (Cube) RISC-V IP-KVM"
description: "Extrem kompaktes Open-Source RISC-V IP-KVM-Modul (40×36×23mm) im CNC-Aluminiumgehäuse mit kleinem OLED-Statusdisplay für BIOS- und Fernwartung über Ethernet und USB-C."
category: "sbc"
mount_type: "sub-module"
slot_compatibility: "ip-kvm-compact"
geometry:
  u_height: 0.8
  width_mm: 40.0
  height_mm: 36.0
  depth_mm: 23.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 1.0
  rear_protrusion_mm: 0.0
  weight_grams: 45
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 1.5
  max_system_watts: 3.0
  airflow: "passive-convection"
ports:
  - port_id: "usb_c_hid"
    label: "USB-C HID"
    face: "front"
    connector_type: "usb-c"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 20.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "eth0"
    label: "100M Ethernet"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["100base-tx"]
    coordinates:
      x_mm: 12.0
      y_mm: 18.0
      orientation: "upright"
  - port_id: "usb_c_pwr"
    label: "5V USB-C Power"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 28.0
      y_mm: 18.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#18181B"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 59
`},{relativePath:`catalog/sub-modules/tp-link-omada-er605-v2.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "tp-link-omada-er605-v2"
manufacturer: "TP-Link"
model: "Omada ER605 v2 Multi-WAN Gigabit VPN Router"
description: "Compact steel desktop Multi-WAN Gigabit VPN router (158×25×101mm) featuring 5x configurable WAN/LAN 1GbE RJ45 ports and USB 2.0/LTE backup port. Fits cleanly on a 10-inch shelf (\`open-shelf-area\`) or modular bracket."
category: "router"
mount_type: "sub-module"
slot_compatibility: "open-shelf-area"
geometry:
  u_height: 0.6
  width_mm: 158.0
  height_mm: 25.0
  depth_mm: 101.0
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 1.0
  rear_protrusion_mm: 0.0
  weight_grams: 380
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 4.0
  max_system_watts: 8.0
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "eth"
    label_prefix: "Port "
    start_index: 1
    count: 5
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 40.0
      origin_y_mm: 12.5
      columns: 5
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "usb_front"
    label: "USB LTE Backup"
    face: "front"
    connector_type: "usb-a"
    direction: "bidirectional"
    capabilities: ["usb-3.0"]
    coordinates:
      x_mm: 136.0
      y_mm: 12.5
      orientation: "upright"
  - port_id: "dc_in"
    label: "12V 1A DC In"
    face: "rear"
    connector_type: "dc-5525"
    direction: "input"
    capabilities: ["dc-power"]
    coordinates:
      x_mm: 132.0
      y_mm: 12.5
      orientation: "upright"
visuals:
  chassis_color_hex: "#1E293B"
  material_preset: "matte-black-steel"
  has_oled_display: false
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 59
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
estimated_price_eur: 219
`},{relativePath:`catalog/sub-modules/ubiquiti-ucg-ultra.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "ubiquiti-ucg-ultra"
manufacturer: "Ubiquiti"
model: "Cloud Gateway Ultra (UCG-Ultra)"
description: "Compact multi-WAN UniFi Cloud Gateway & IDS/IPS router (141.8×30×127.6mm) with 1x 2.5GbE WAN, 4x 1GbE LAN ports, front status LCM display, and USB-C power. Mounts as a sub-module inside \`3dprint-10inch-ucg-ultra-plus-3keystone\`."
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
  weight_grams: 520
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 4.5
  max_system_watts: 6.2
  airflow: "passive-convection"
  noise_db_a: 0
port_groups:
  - id_prefix: "lan"
    label_prefix: "1G LAN "
    start_index: 1
    count: 4
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t"]
    orientation: "upright"
    grid:
      origin_x_mm: 24.0
      origin_y_mm: 14.0
      columns: 4
      rows: 1
      pitch_x_mm: 18.0
      pitch_y_mm: 0.0
ports:
  - port_id: "wan"
    label: "2.5G WAN"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "2500base-t"]
    coordinates:
      x_mm: 100.0
      y_mm: 14.0
      orientation: "upright"
  - port_id: "usbc_pwr"
    label: "5V USB-C In"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 124.0
      y_mm: 14.0
      orientation: "upright"
visuals:
  chassis_color_hex: "#F3F4F6"
  material_preset: "polycarbonate"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 109
`},{relativePath:`catalog/sub-modules/ubiquiti-uck-g2-plus.yaml`,categoryDir:`sub-modules`,rawYaml:`slug: "ubiquiti-uck-g2-plus"
manufacturer: "Ubiquiti"
model: "UniFi Cloud Key Gen2 Plus (UCK-G2-PLUS)"
description: "Compact anodized aluminum UniFi OS console and Protect NVR with internal 2.5-inch SSD/HDD bay (131.2×27.1×134.2mm), front OLED readout, and 802.3af PoE or USB-C QC power. Clips into a \`unifi-compact-gateway\` carrier bay."
category: "compute-node"
mount_type: "sub-module"
slot_compatibility: "unifi-compact-gateway"
geometry:
  u_height: 0.7
  width_mm: 131.2
  height_mm: 27.1
  depth_mm: 134.2
  ear_mount_style: "sub-module-clip"
  front_protrusion_mm: 1.5
  rear_protrusion_mm: 0.0
  weight_grams: 582
power_and_thermal:
  electrical_role: "consumer"
  idle_watts: 7.0
  max_system_watts: 12.95
  airflow: "passive-convection"
  noise_db_a: 0
ports:
  - port_id: "eth0"
    label: "1GbE PoE-In"
    face: "rear"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["1000base-t", "poe-in-af"]
    coordinates:
      x_mm: 42.0
      y_mm: 13.5
      orientation: "upright"
  - port_id: "usbc_pwr"
    label: "USB-C QC Power"
    face: "rear"
    connector_type: "usb-c"
    direction: "input"
    capabilities: ["usb-pd", "dc-power"]
    coordinates:
      x_mm: 84.0
      y_mm: 13.5
      orientation: "upright"
visuals:
  chassis_color_hex: "#D1D5DB"
  material_preset: "coated-aluminum"
  has_oled_display: true
  stl_mesh_path: null
printable_metadata: null
estimated_price_eur: 215
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
`}];function $m(e){switch(e){case`rackmount-10`:return`10inch`;case`rackmount-19`:return`19inch`;case`rackmount-6`:return`6inch`;case`sub-module`:case`shelf-standing`:return}}function eh(e,t=e.slug){let r=il(e),i=[],{width_mm:a,height_mm:o}=r.geometry,s=new Set;for(let e=0;e<r.ports.length;e++){let n=r.ports[e];s.has(n.port_id)&&i.push({slug:r.slug,source:t,code:`DUPLICATE_PORT_ID`,message:`Duplicate port_id '${n.port_id}' in blueprint '${r.slug}'.`}),s.add(n.port_id);let{x_mm:c,y_mm:l}=n.coordinates;(c<=0||c>=a||l<=0||l>=o)&&i.push({slug:r.slug,source:t,code:`PORT_OUT_OF_BOUNDS`,message:`Port '${n.port_id}' on face '${n.face}' at (${c}, ${l}) mm lies outside face bounds (0..${a}, 0..${o}) mm.`});for(let a=e+1;a<r.ports.length;a++){let e=r.ports[a];if(n.face!==e.face)continue;let o=n.coordinates.x_mm-e.coordinates.x_mm,s=n.coordinates.y_mm-e.coordinates.y_mm,c=G(Math.hypot(o,s));c<8&&i.push({slug:r.slug,source:t,code:`PORT_OVERLAP`,message:`Ports '${n.port_id}' and '${e.port_id}' on '${n.face}' face overlap (distance ${c} mm < 8 mm).`})}}let c=$m(r.mount_type),l=c===void 0?void 0:n[c];for(let e=0;e<r.slots.length;e++){let n=r.slots[e],a=n.offset_mm.x,s=G(n.offset_mm.x+n.max_dimensions_mm.width),u=n.offset_mm.y,d=G(n.offset_mm.y+n.max_dimensions_mm.height),f=n.offset_mm.z,p=G(n.offset_mm.z+n.max_dimensions_mm.depth);if(l!==void 0){let e=l.X_aperture_min,o=G(l.X_aperture_min+l.W_aperture);(a<e-.001||s>o+.001)&&i.push({slug:r.slug,source:t,code:`SLOT_OUT_OF_APERTURE`,message:`Slot '${n.slot_id}' X-span [${a}, ${s}] mm exceeds ${c} usable aperture [${e}, ${o}] mm (W_aperture = ${l.W_aperture} mm).`})}(u<-.001||d>o+.001)&&i.push({slug:r.slug,source:t,code:`SLOT_OUT_OF_APERTURE`,message:`Slot '${n.slot_id}' Y-span [${u}, ${d}] mm exceeds carrier height [0, ${o}] mm.`});for(let o=e+1;o<r.slots.length;o++){let e=r.slots[o],c=e.offset_mm.x,l=G(e.offset_mm.x+e.max_dimensions_mm.width),m=e.offset_mm.y,h=G(e.offset_mm.y+e.max_dimensions_mm.height),g=e.offset_mm.z,_=G(e.offset_mm.z+e.max_dimensions_mm.depth),v=Math.min(s,l)-Math.max(a,c),y=Math.min(d,h)-Math.max(u,m),b=Math.min(p,_)-Math.max(f,g);v>.001&&y>.001&&b>.001&&i.push({slug:r.slug,source:t,code:`SLOT_OVERLAP`,message:`Carrier slots '${n.slot_id}' and '${e.slot_id}' overlap in 3D space by (${G(v)}, ${G(y)}, ${G(b)}) mm.`})}}return{valid:i.length===0,blueprint:r,issues:i}}function th(e,t=`inline-yaml`){let n;try{n=Xm(e)}catch(e){return{valid:!1,issues:[{slug:t,source:t,code:`YAML_PARSE_ERROR`,message:e instanceof Error?e.message:String(e)}]}}let r=Pc.safeParse(n);return r.success?eh(r.data,t):{valid:!1,issues:r.error.issues.map(e=>({slug:t,source:t,code:`ZOD_SCHEMA_INVALID`,message:`${e.path.join(`.`)}: ${e.message}`}))}}function nh(e){switch(e){case`10inch`:case`10inch-rackmount`:case`rackmount-10`:return`rackmount-10`;case`19inch`:case`19inch-rackmount`:case`rackmount-19`:return`rackmount-19`;case`6inch`:case`6inch-rackmount`:case`rackmount-6`:return`rackmount-6`;case`sub-module`:return`sub-module`;case`shelf-standing`:return`shelf-standing`}}var rh=new class e{blueprints=new Map;constructor(e,t){if(t!==void 0)for(let[e,n]of t.entries())this.blueprints.set(e,n);else if(e!==void 0)for(let t of e)this.registerCustomBlueprint(t);else for(let e of Qm){let t=th(e.rawYaml,e.relativePath);if(!t.valid||t.blueprint===void 0){let n=t.issues.map(e=>`${e.code}: ${e.message}`).join(`; `);throw Error(`Invalid built-in catalog blueprint '${e.relativePath}': ${n}`)}this.blueprints.set(t.blueprint.slug,t.blueprint)}}clone(){return new e(void 0,this.blueprints)}getAllBlueprints(){return[...this.blueprints.values()]}getBlueprintBySlug(e){return this.blueprints.get(e)}registerCustomBlueprint(e){let t=Pc.parse(e),n=eh(t,t.slug);if(!n.valid||n.blueprint===void 0){let e=n.issues.map(e=>`${e.code}: ${e.message}`).join(`; `);throw Error(`Cannot register invalid blueprint '${t.slug}': ${e}`)}this.blueprints.set(n.blueprint.slug,il(n.blueprint))}searchCatalog(e={}){let t=e.query?.trim().toLowerCase(),n=e.mount_type===void 0?e.form_factor===void 0?void 0:nh(e.form_factor):nh(e.mount_type);return this.getAllBlueprints().filter(r=>{if(t!==void 0&&t.length>0){let e=`${r.slug} ${r.manufacturer} ${r.model} ${r.category}`.toLowerCase();if(!t.split(/\s+/).every(t=>e.includes(t)))return!1}if(n!==void 0&&r.mount_type!==n||e.category!==void 0&&r.category!==e.category||e.max_depth_mm!==void 0&&r.geometry.depth_mm>e.max_depth_mm||e.min_poe_budget_watts!==void 0&&(r.power_and_thermal.poe_budget_watts??0)<e.min_poe_budget_watts)return!1;if(e.accepted_slot_type!==void 0){let t=r.slot_compatibility===e.accepted_slot_type,n=r.slots.some(t=>t.accepted_slot_type===e.accepted_slot_type);if(!t&&!n)return!1}return!0})}toRecord(){let e={};for(let[t,n]of this.blueprints.entries())t!==`__proto__`&&t!==`constructor`&&t!==`prototype`&&Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0});return e}};export{e as C,n as S,nl as _,ld as a,Jc as b,_u as c,gu as d,ql as f,il as g,zl as h,sd as i,fu as l,Gl as m,Xm as n,od as o,$l as p,Zm as r,ad as s,rh as t,hu as u,K as v,t as w,Pc as x,q as y};
//# sourceMappingURL=vendor-catalog-C1t8jphs.js.map