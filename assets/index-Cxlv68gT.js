(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();function vA(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var BI={exports:{}},OM={},NI={exports:{}},R={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ti=Symbol.for("react.element"),MA=Symbol.for("react.portal"),wA=Symbol.for("react.fragment"),LA=Symbol.for("react.strict_mode"),CA=Symbol.for("react.profiler"),SA=Symbol.for("react.provider"),IA=Symbol.for("react.context"),jA=Symbol.for("react.forward_ref"),bA=Symbol.for("react.suspense"),PA=Symbol.for("react.memo"),AA=Symbol.for("react.lazy"),wC=Symbol.iterator;function zA(e){return e===null||typeof e!="object"?null:(e=wC&&e[wC]||e["@@iterator"],typeof e=="function"?e:null)}var EI={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},OI=Object.assign,UI={};function Sa(e,t,n){this.props=e,this.context=t,this.refs=UI,this.updater=n||EI}Sa.prototype.isReactComponent={};Sa.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Sa.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function ZI(){}ZI.prototype=Sa.prototype;function rL(e,t,n){this.props=e,this.context=t,this.refs=UI,this.updater=n||EI}var oL=rL.prototype=new ZI;oL.constructor=rL;OI(oL,Sa.prototype);oL.isPureReactComponent=!0;var LC=Array.isArray,_I=Object.prototype.hasOwnProperty,sL={current:null},WI={key:!0,ref:!0,__self:!0,__source:!0};function GI(e,t,n){var a,r={},o=null,s=null;if(t!=null)for(a in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(o=""+t.key),t)_I.call(t,a)&&!WI.hasOwnProperty(a)&&(r[a]=t[a]);var c=arguments.length-2;if(c===1)r.children=n;else if(1<c){for(var d=Array(c),h=0;h<c;h++)d[h]=arguments[h+2];r.children=d}if(e&&e.defaultProps)for(a in c=e.defaultProps,c)r[a]===void 0&&(r[a]=c[a]);return{$$typeof:Ti,type:e,key:o,ref:s,props:r,_owner:sL.current}}function VA(e,t){return{$$typeof:Ti,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function cL(e){return typeof e=="object"&&e!==null&&e.$$typeof===Ti}function HA(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var CC=/\/+/g;function y9(e,t){return typeof e=="object"&&e!==null&&e.key!=null?HA(""+e.key):t.toString(36)}function ur(e,t,n,a,r){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(o){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case Ti:case MA:s=!0}}if(s)return s=e,r=r(s),e=a===""?"."+y9(s,0):a,LC(r)?(n="",e!=null&&(n=e.replace(CC,"$&/")+"/"),ur(r,t,n,"",function(h){return h})):r!=null&&(cL(r)&&(r=VA(r,n+(!r.key||s&&s.key===r.key?"":(""+r.key).replace(CC,"$&/")+"/")+e)),t.push(r)),1;if(s=0,a=a===""?".":a+":",LC(e))for(var c=0;c<e.length;c++){o=e[c];var d=a+y9(o,c);s+=ur(o,t,n,d,r)}else if(d=zA(e),typeof d=="function")for(e=d.call(e),c=0;!(o=e.next()).done;)o=o.value,d=a+y9(o,c++),s+=ur(o,t,n,d,r);else if(o==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function Zi(e,t,n){if(e==null)return e;var a=[],r=0;return ur(e,a,"","",function(o){return t.call(n,o,r++)}),a}function TA(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var we={current:null},yr={transition:null},qA={ReactCurrentDispatcher:we,ReactCurrentBatchConfig:yr,ReactCurrentOwner:sL};function $I(){throw Error("act(...) is not supported in production builds of React.")}R.Children={map:Zi,forEach:function(e,t,n){Zi(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Zi(e,function(){t++}),t},toArray:function(e){return Zi(e,function(t){return t})||[]},only:function(e){if(!cL(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};R.Component=Sa;R.Fragment=wA;R.Profiler=CA;R.PureComponent=rL;R.StrictMode=LA;R.Suspense=bA;R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=qA;R.act=$I;R.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=OI({},e.props),r=e.key,o=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(o=t.ref,s=sL.current),t.key!==void 0&&(r=""+t.key),e.type&&e.type.defaultProps)var c=e.type.defaultProps;for(d in t)_I.call(t,d)&&!WI.hasOwnProperty(d)&&(a[d]=t[d]===void 0&&c!==void 0?c[d]:t[d])}var d=arguments.length-2;if(d===1)a.children=n;else if(1<d){c=Array(d);for(var h=0;h<d;h++)c[h]=arguments[h+2];a.children=c}return{$$typeof:Ti,type:e.type,key:r,ref:o,props:a,_owner:s}};R.createContext=function(e){return e={$$typeof:IA,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:SA,_context:e},e.Consumer=e};R.createElement=GI;R.createFactory=function(e){var t=GI.bind(null,e);return t.type=e,t};R.createRef=function(){return{current:null}};R.forwardRef=function(e){return{$$typeof:jA,render:e}};R.isValidElement=cL;R.lazy=function(e){return{$$typeof:AA,_payload:{_status:-1,_result:e},_init:TA}};R.memo=function(e,t){return{$$typeof:PA,type:e,compare:t===void 0?null:t}};R.startTransition=function(e){var t=yr.transition;yr.transition={};try{e()}finally{yr.transition=t}};R.unstable_act=$I;R.useCallback=function(e,t){return we.current.useCallback(e,t)};R.useContext=function(e){return we.current.useContext(e)};R.useDebugValue=function(){};R.useDeferredValue=function(e){return we.current.useDeferredValue(e)};R.useEffect=function(e,t){return we.current.useEffect(e,t)};R.useId=function(){return we.current.useId()};R.useImperativeHandle=function(e,t,n){return we.current.useImperativeHandle(e,t,n)};R.useInsertionEffect=function(e,t){return we.current.useInsertionEffect(e,t)};R.useLayoutEffect=function(e,t){return we.current.useLayoutEffect(e,t)};R.useMemo=function(e,t){return we.current.useMemo(e,t)};R.useReducer=function(e,t,n){return we.current.useReducer(e,t,n)};R.useRef=function(e){return we.current.useRef(e)};R.useState=function(e){return we.current.useState(e)};R.useSyncExternalStore=function(e,t,n){return we.current.useSyncExternalStore(e,t,n)};R.useTransition=function(){return we.current.useTransition()};R.version="18.3.1";NI.exports=R;var C=NI.exports;const lL=vA(C);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var DA=C,FA=Symbol.for("react.element"),RA=Symbol.for("react.fragment"),BA=Object.prototype.hasOwnProperty,NA=DA.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,EA={key:!0,ref:!0,__self:!0,__source:!0};function XI(e,t,n){var a,r={},o=null,s=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(s=t.ref);for(a in t)BA.call(t,a)&&!EA.hasOwnProperty(a)&&(r[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)r[a]===void 0&&(r[a]=t[a]);return{$$typeof:FA,type:e,key:o,ref:s,props:r,_owner:NA.current}}OM.Fragment=RA;OM.jsx=XI;OM.jsxs=XI;BI.exports=OM;var l=BI.exports,J9={},KI={exports:{}},De={},QI={exports:{}},YI={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(P,T){var D=P.length;P.push(T);e:for(;0<D;){var q=D-1>>>1,_=P[q];if(0<r(_,T))P[q]=T,P[D]=_,D=q;else break e}}function n(P){return P.length===0?null:P[0]}function a(P){if(P.length===0)return null;var T=P[0],D=P.pop();if(D!==T){P[0]=D;e:for(var q=0,_=P.length,rn=_>>>1;q<rn;){var at=2*(q+1)-1,B1=P[at],Ae=at+1,on=P[Ae];if(0>r(B1,D))Ae<_&&0>r(on,B1)?(P[q]=on,P[Ae]=D,q=Ae):(P[q]=B1,P[at]=D,q=at);else if(Ae<_&&0>r(on,D))P[q]=on,P[Ae]=D,q=Ae;else break e}}return T}function r(P,T){var D=P.sortIndex-T.sortIndex;return D!==0?D:P.id-T.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var s=Date,c=s.now();e.unstable_now=function(){return s.now()-c}}var d=[],h=[],u=1,y=null,k=3,g=!1,v=!1,x=!1,L=typeof setTimeout=="function"?setTimeout:null,m=typeof clearTimeout=="function"?clearTimeout:null,p=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function f(P){for(var T=n(h);T!==null;){if(T.callback===null)a(h);else if(T.startTime<=P)a(h),T.sortIndex=T.expirationTime,t(d,T);else break;T=n(h)}}function M(P){if(x=!1,f(P),!v)if(n(d)!==null)v=!0,Y(w);else{var T=n(h);T!==null&&Re(M,T.startTime-P)}}function w(P,T){v=!1,x&&(x=!1,m(j),j=-1),g=!0;var D=k;try{for(f(T),y=n(d);y!==null&&(!(y.expirationTime>T)||P&&!re());){var q=y.callback;if(typeof q=="function"){y.callback=null,k=y.priorityLevel;var _=q(y.expirationTime<=T);T=e.unstable_now(),typeof _=="function"?y.callback=_:y===n(d)&&a(d),f(T)}else a(d);y=n(d)}if(y!==null)var rn=!0;else{var at=n(h);at!==null&&Re(M,at.startTime-T),rn=!1}return rn}finally{y=null,k=D,g=!1}}var I=!1,b=null,j=-1,z=5,H=-1;function re(){return!(e.unstable_now()-H<z)}function le(){if(b!==null){var P=e.unstable_now();H=P;var T=!0;try{T=b(!0,P)}finally{T?ge():(I=!1,b=null)}}else I=!1}var ge;if(typeof p=="function")ge=function(){p(le)};else if(typeof MessageChannel<"u"){var oe=new MessageChannel,jt=oe.port2;oe.port1.onmessage=le,ge=function(){jt.postMessage(null)}}else ge=function(){L(le,0)};function Y(P){b=P,I||(I=!0,ge())}function Re(P,T){j=L(function(){P(e.unstable_now())},T)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(P){P.callback=null},e.unstable_continueExecution=function(){v||g||(v=!0,Y(w))},e.unstable_forceFrameRate=function(P){0>P||125<P?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<P?Math.floor(1e3/P):5},e.unstable_getCurrentPriorityLevel=function(){return k},e.unstable_getFirstCallbackNode=function(){return n(d)},e.unstable_next=function(P){switch(k){case 1:case 2:case 3:var T=3;break;default:T=k}var D=k;k=T;try{return P()}finally{k=D}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(P,T){switch(P){case 1:case 2:case 3:case 4:case 5:break;default:P=3}var D=k;k=P;try{return T()}finally{k=D}},e.unstable_scheduleCallback=function(P,T,D){var q=e.unstable_now();switch(typeof D=="object"&&D!==null?(D=D.delay,D=typeof D=="number"&&0<D?q+D:q):D=q,P){case 1:var _=-1;break;case 2:_=250;break;case 5:_=1073741823;break;case 4:_=1e4;break;default:_=5e3}return _=D+_,P={id:u++,callback:T,priorityLevel:P,startTime:D,expirationTime:_,sortIndex:-1},D>q?(P.sortIndex=D,t(h,P),n(d)===null&&P===n(h)&&(x?(m(j),j=-1):x=!0,Re(M,D-q))):(P.sortIndex=_,t(d,P),v||g||(v=!0,Y(w))),P},e.unstable_shouldYield=re,e.unstable_wrapCallback=function(P){var T=k;return function(){var D=k;k=T;try{return P.apply(this,arguments)}finally{k=D}}}})(YI);QI.exports=YI;var OA=QI.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var UA=C,Te=OA;function S(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var JI=new Set,pi={};function q1(e,t){fa(e,t),fa(e+"Capture",t)}function fa(e,t){for(pi[e]=t,e=0;e<t.length;e++)JI.add(t[e])}var Mt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ew=Object.prototype.hasOwnProperty,ZA=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,SC={},IC={};function _A(e){return ew.call(IC,e)?!0:ew.call(SC,e)?!1:ZA.test(e)?IC[e]=!0:(SC[e]=!0,!1)}function WA(e,t,n,a){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return a?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function GA(e,t,n,a){if(t===null||typeof t>"u"||WA(e,t,n,a))return!0;if(a)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Le(e,t,n,a,r,o,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=a,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=s}var ue={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ue[e]=new Le(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ue[t]=new Le(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ue[e]=new Le(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ue[e]=new Le(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ue[e]=new Le(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ue[e]=new Le(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ue[e]=new Le(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ue[e]=new Le(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ue[e]=new Le(e,5,!1,e.toLowerCase(),null,!1,!1)});var dL=/[\-:]([a-z])/g;function hL(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(dL,hL);ue[t]=new Le(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(dL,hL);ue[t]=new Le(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(dL,hL);ue[t]=new Le(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ue[e]=new Le(e,1,!1,e.toLowerCase(),null,!1,!1)});ue.xlinkHref=new Le("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ue[e]=new Le(e,1,!1,e.toLowerCase(),null,!0,!0)});function uL(e,t,n,a){var r=ue.hasOwnProperty(t)?ue[t]:null;(r!==null?r.type!==0:a||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(GA(t,n,r,a)&&(n=null),a||r===null?_A(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):r.mustUseProperty?e[r.propertyName]=n===null?r.type===3?!1:"":n:(t=r.attributeName,a=r.attributeNamespace,n===null?e.removeAttribute(t):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,a?e.setAttributeNS(a,t,n):e.setAttribute(t,n))))}var It=UA.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,_i=Symbol.for("react.element"),E1=Symbol.for("react.portal"),O1=Symbol.for("react.fragment"),yL=Symbol.for("react.strict_mode"),tw=Symbol.for("react.profiler"),ej=Symbol.for("react.provider"),tj=Symbol.for("react.context"),pL=Symbol.for("react.forward_ref"),nw=Symbol.for("react.suspense"),aw=Symbol.for("react.suspense_list"),kL=Symbol.for("react.memo"),At=Symbol.for("react.lazy"),nj=Symbol.for("react.offscreen"),jC=Symbol.iterator;function ba(e){return e===null||typeof e!="object"?null:(e=jC&&e[jC]||e["@@iterator"],typeof e=="function"?e:null)}var K=Object.assign,p9;function Ra(e){if(p9===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);p9=t&&t[1]||""}return`
`+p9+e}var k9=!1;function f9(e,t){if(!e||k9)return"";k9=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(h){var a=h}Reflect.construct(e,[],t)}else{try{t.call()}catch(h){a=h}e.call(t.prototype)}else{try{throw Error()}catch(h){a=h}e()}}catch(h){if(h&&a&&typeof h.stack=="string"){for(var r=h.stack.split(`
`),o=a.stack.split(`
`),s=r.length-1,c=o.length-1;1<=s&&0<=c&&r[s]!==o[c];)c--;for(;1<=s&&0<=c;s--,c--)if(r[s]!==o[c]){if(s!==1||c!==1)do if(s--,c--,0>c||r[s]!==o[c]){var d=`
`+r[s].replace(" at new "," at ");return e.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",e.displayName)),d}while(1<=s&&0<=c);break}}}finally{k9=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Ra(e):""}function $A(e){switch(e.tag){case 5:return Ra(e.type);case 16:return Ra("Lazy");case 13:return Ra("Suspense");case 19:return Ra("SuspenseList");case 0:case 2:case 15:return e=f9(e.type,!1),e;case 11:return e=f9(e.type.render,!1),e;case 1:return e=f9(e.type,!0),e;default:return""}}function iw(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case O1:return"Fragment";case E1:return"Portal";case tw:return"Profiler";case yL:return"StrictMode";case nw:return"Suspense";case aw:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case tj:return(e.displayName||"Context")+".Consumer";case ej:return(e._context.displayName||"Context")+".Provider";case pL:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case kL:return t=e.displayName||null,t!==null?t:iw(e.type)||"Memo";case At:t=e._payload,e=e._init;try{return iw(e(t))}catch{}}return null}function XA(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return iw(t);case 8:return t===yL?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Kt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function aj(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function KA(e){var t=aj(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),a=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return r.call(this)},set:function(s){a=""+s,o.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(s){a=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Wi(e){e._valueTracker||(e._valueTracker=KA(e))}function ij(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=aj(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function dM(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function rw(e,t){var n=t.checked;return K({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function bC(e,t){var n=t.defaultValue==null?"":t.defaultValue,a=t.checked!=null?t.checked:t.defaultChecked;n=Kt(t.value!=null?t.value:n),e._wrapperState={initialChecked:a,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function rj(e,t){t=t.checked,t!=null&&uL(e,"checked",t,!1)}function ow(e,t){rj(e,t);var n=Kt(t.value),a=t.type;if(n!=null)a==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(a==="submit"||a==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?sw(e,t.type,n):t.hasOwnProperty("defaultValue")&&sw(e,t.type,Kt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function PC(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var a=t.type;if(!(a!=="submit"&&a!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function sw(e,t,n){(t!=="number"||dM(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Ba=Array.isArray;function aa(e,t,n,a){if(e=e.options,t){t={};for(var r=0;r<n.length;r++)t["$"+n[r]]=!0;for(n=0;n<e.length;n++)r=t.hasOwnProperty("$"+e[n].value),e[n].selected!==r&&(e[n].selected=r),r&&a&&(e[n].defaultSelected=!0)}else{for(n=""+Kt(n),t=null,r=0;r<e.length;r++){if(e[r].value===n){e[r].selected=!0,a&&(e[r].defaultSelected=!0);return}t!==null||e[r].disabled||(t=e[r])}t!==null&&(t.selected=!0)}}function cw(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(S(91));return K({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function AC(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(S(92));if(Ba(n)){if(1<n.length)throw Error(S(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Kt(n)}}function oj(e,t){var n=Kt(t.value),a=Kt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),a!=null&&(e.defaultValue=""+a)}function zC(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function sj(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function lw(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?sj(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Gi,cj=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,a,r){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,r)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Gi=Gi||document.createElement("div"),Gi.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Gi.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function ki(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Ua={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},QA=["Webkit","ms","Moz","O"];Object.keys(Ua).forEach(function(e){QA.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Ua[t]=Ua[e]})});function lj(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Ua.hasOwnProperty(e)&&Ua[e]?(""+t).trim():t+"px"}function dj(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var a=n.indexOf("--")===0,r=lj(n,t[n],a);n==="float"&&(n="cssFloat"),a?e.setProperty(n,r):e[n]=r}}var YA=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function dw(e,t){if(t){if(YA[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(S(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(S(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(S(61))}if(t.style!=null&&typeof t.style!="object")throw Error(S(62))}}function hw(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var uw=null;function fL(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var yw=null,ia=null,ra=null;function VC(e){if(e=Fi(e)){if(typeof yw!="function")throw Error(S(280));var t=e.stateNode;t&&(t=GM(t),yw(e.stateNode,e.type,t))}}function hj(e){ia?ra?ra.push(e):ra=[e]:ia=e}function uj(){if(ia){var e=ia,t=ra;if(ra=ia=null,VC(e),t)for(e=0;e<t.length;e++)VC(t[e])}}function yj(e,t){return e(t)}function pj(){}var m9=!1;function kj(e,t,n){if(m9)return e(t,n);m9=!0;try{return yj(e,t,n)}finally{m9=!1,(ia!==null||ra!==null)&&(pj(),uj())}}function fi(e,t){var n=e.stateNode;if(n===null)return null;var a=GM(n);if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(S(231,t,typeof n));return n}var pw=!1;if(Mt)try{var Pa={};Object.defineProperty(Pa,"passive",{get:function(){pw=!0}}),window.addEventListener("test",Pa,Pa),window.removeEventListener("test",Pa,Pa)}catch{pw=!1}function JA(e,t,n,a,r,o,s,c,d){var h=Array.prototype.slice.call(arguments,3);try{t.apply(n,h)}catch(u){this.onError(u)}}var Za=!1,hM=null,uM=!1,kw=null,ez={onError:function(e){Za=!0,hM=e}};function tz(e,t,n,a,r,o,s,c,d){Za=!1,hM=null,JA.apply(ez,arguments)}function nz(e,t,n,a,r,o,s,c,d){if(tz.apply(this,arguments),Za){if(Za){var h=hM;Za=!1,hM=null}else throw Error(S(198));uM||(uM=!0,kw=h)}}function D1(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function fj(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function HC(e){if(D1(e)!==e)throw Error(S(188))}function az(e){var t=e.alternate;if(!t){if(t=D1(e),t===null)throw Error(S(188));return t!==e?null:e}for(var n=e,a=t;;){var r=n.return;if(r===null)break;var o=r.alternate;if(o===null){if(a=r.return,a!==null){n=a;continue}break}if(r.child===o.child){for(o=r.child;o;){if(o===n)return HC(r),e;if(o===a)return HC(r),t;o=o.sibling}throw Error(S(188))}if(n.return!==a.return)n=r,a=o;else{for(var s=!1,c=r.child;c;){if(c===n){s=!0,n=r,a=o;break}if(c===a){s=!0,a=r,n=o;break}c=c.sibling}if(!s){for(c=o.child;c;){if(c===n){s=!0,n=o,a=r;break}if(c===a){s=!0,a=o,n=r;break}c=c.sibling}if(!s)throw Error(S(189))}}if(n.alternate!==a)throw Error(S(190))}if(n.tag!==3)throw Error(S(188));return n.stateNode.current===n?e:t}function mj(e){return e=az(e),e!==null?gj(e):null}function gj(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=gj(e);if(t!==null)return t;e=e.sibling}return null}var xj=Te.unstable_scheduleCallback,TC=Te.unstable_cancelCallback,iz=Te.unstable_shouldYield,rz=Te.unstable_requestPaint,J=Te.unstable_now,oz=Te.unstable_getCurrentPriorityLevel,mL=Te.unstable_ImmediatePriority,vj=Te.unstable_UserBlockingPriority,yM=Te.unstable_NormalPriority,sz=Te.unstable_LowPriority,Mj=Te.unstable_IdlePriority,UM=null,ct=null;function cz(e){if(ct&&typeof ct.onCommitFiberRoot=="function")try{ct.onCommitFiberRoot(UM,e,void 0,(e.current.flags&128)===128)}catch{}}var Je=Math.clz32?Math.clz32:hz,lz=Math.log,dz=Math.LN2;function hz(e){return e>>>=0,e===0?32:31-(lz(e)/dz|0)|0}var $i=64,Xi=4194304;function Na(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function pM(e,t){var n=e.pendingLanes;if(n===0)return 0;var a=0,r=e.suspendedLanes,o=e.pingedLanes,s=n&268435455;if(s!==0){var c=s&~r;c!==0?a=Na(c):(o&=s,o!==0&&(a=Na(o)))}else s=n&~r,s!==0?a=Na(s):o!==0&&(a=Na(o));if(a===0)return 0;if(t!==0&&t!==a&&!(t&r)&&(r=a&-a,o=t&-t,r>=o||r===16&&(o&4194240)!==0))return t;if(a&4&&(a|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=a;0<t;)n=31-Je(t),r=1<<n,a|=e[n],t&=~r;return a}function uz(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function yz(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,r=e.expirationTimes,o=e.pendingLanes;0<o;){var s=31-Je(o),c=1<<s,d=r[s];d===-1?(!(c&n)||c&a)&&(r[s]=uz(c,t)):d<=t&&(e.expiredLanes|=c),o&=~c}}function fw(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function wj(){var e=$i;return $i<<=1,!($i&4194240)&&($i=64),e}function g9(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function qi(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Je(t),e[t]=n}function pz(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var a=e.eventTimes;for(e=e.expirationTimes;0<n;){var r=31-Je(n),o=1<<r;t[r]=0,a[r]=-1,e[r]=-1,n&=~o}}function gL(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-Je(n),r=1<<a;r&t|e[a]&t&&(e[a]|=t),n&=~r}}var N=0;function Lj(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Cj,xL,Sj,Ij,jj,mw=!1,Ki=[],Bt=null,Nt=null,Et=null,mi=new Map,gi=new Map,Tt=[],kz="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function qC(e,t){switch(e){case"focusin":case"focusout":Bt=null;break;case"dragenter":case"dragleave":Nt=null;break;case"mouseover":case"mouseout":Et=null;break;case"pointerover":case"pointerout":mi.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":gi.delete(t.pointerId)}}function Aa(e,t,n,a,r,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:o,targetContainers:[r]},t!==null&&(t=Fi(t),t!==null&&xL(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,r!==null&&t.indexOf(r)===-1&&t.push(r),e)}function fz(e,t,n,a,r){switch(t){case"focusin":return Bt=Aa(Bt,e,t,n,a,r),!0;case"dragenter":return Nt=Aa(Nt,e,t,n,a,r),!0;case"mouseover":return Et=Aa(Et,e,t,n,a,r),!0;case"pointerover":var o=r.pointerId;return mi.set(o,Aa(mi.get(o)||null,e,t,n,a,r)),!0;case"gotpointercapture":return o=r.pointerId,gi.set(o,Aa(gi.get(o)||null,e,t,n,a,r)),!0}return!1}function bj(e){var t=k1(e.target);if(t!==null){var n=D1(t);if(n!==null){if(t=n.tag,t===13){if(t=fj(n),t!==null){e.blockedOn=t,jj(e.priority,function(){Sj(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function pr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=gw(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);uw=a,n.target.dispatchEvent(a),uw=null}else return t=Fi(n),t!==null&&xL(t),e.blockedOn=n,!1;t.shift()}return!0}function DC(e,t,n){pr(e)&&n.delete(t)}function mz(){mw=!1,Bt!==null&&pr(Bt)&&(Bt=null),Nt!==null&&pr(Nt)&&(Nt=null),Et!==null&&pr(Et)&&(Et=null),mi.forEach(DC),gi.forEach(DC)}function za(e,t){e.blockedOn===t&&(e.blockedOn=null,mw||(mw=!0,Te.unstable_scheduleCallback(Te.unstable_NormalPriority,mz)))}function xi(e){function t(r){return za(r,e)}if(0<Ki.length){za(Ki[0],e);for(var n=1;n<Ki.length;n++){var a=Ki[n];a.blockedOn===e&&(a.blockedOn=null)}}for(Bt!==null&&za(Bt,e),Nt!==null&&za(Nt,e),Et!==null&&za(Et,e),mi.forEach(t),gi.forEach(t),n=0;n<Tt.length;n++)a=Tt[n],a.blockedOn===e&&(a.blockedOn=null);for(;0<Tt.length&&(n=Tt[0],n.blockedOn===null);)bj(n),n.blockedOn===null&&Tt.shift()}var oa=It.ReactCurrentBatchConfig,kM=!0;function gz(e,t,n,a){var r=N,o=oa.transition;oa.transition=null;try{N=1,vL(e,t,n,a)}finally{N=r,oa.transition=o}}function xz(e,t,n,a){var r=N,o=oa.transition;oa.transition=null;try{N=4,vL(e,t,n,a)}finally{N=r,oa.transition=o}}function vL(e,t,n,a){if(kM){var r=gw(e,t,n,a);if(r===null)b9(e,t,a,fM,n),qC(e,a);else if(fz(r,e,t,n,a))a.stopPropagation();else if(qC(e,a),t&4&&-1<kz.indexOf(e)){for(;r!==null;){var o=Fi(r);if(o!==null&&Cj(o),o=gw(e,t,n,a),o===null&&b9(e,t,a,fM,n),o===r)break;r=o}r!==null&&a.stopPropagation()}else b9(e,t,a,null,n)}}var fM=null;function gw(e,t,n,a){if(fM=null,e=fL(a),e=k1(e),e!==null)if(t=D1(e),t===null)e=null;else if(n=t.tag,n===13){if(e=fj(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return fM=e,null}function Pj(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(oz()){case mL:return 1;case vj:return 4;case yM:case sz:return 16;case Mj:return 536870912;default:return 16}default:return 16}}var Dt=null,ML=null,kr=null;function Aj(){if(kr)return kr;var e,t=ML,n=t.length,a,r="value"in Dt?Dt.value:Dt.textContent,o=r.length;for(e=0;e<n&&t[e]===r[e];e++);var s=n-e;for(a=1;a<=s&&t[n-a]===r[o-a];a++);return kr=r.slice(e,1<a?1-a:void 0)}function fr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Qi(){return!0}function FC(){return!1}function Fe(e){function t(n,a,r,o,s){this._reactName=n,this._targetInst=r,this.type=a,this.nativeEvent=o,this.target=s,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(o):o[c]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Qi:FC,this.isPropagationStopped=FC,this}return K(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Qi)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Qi)},persist:function(){},isPersistent:Qi}),t}var Ia={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wL=Fe(Ia),Di=K({},Ia,{view:0,detail:0}),vz=Fe(Di),x9,v9,Va,ZM=K({},Di,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:LL,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Va&&(Va&&e.type==="mousemove"?(x9=e.screenX-Va.screenX,v9=e.screenY-Va.screenY):v9=x9=0,Va=e),x9)},movementY:function(e){return"movementY"in e?e.movementY:v9}}),RC=Fe(ZM),Mz=K({},ZM,{dataTransfer:0}),wz=Fe(Mz),Lz=K({},Di,{relatedTarget:0}),M9=Fe(Lz),Cz=K({},Ia,{animationName:0,elapsedTime:0,pseudoElement:0}),Sz=Fe(Cz),Iz=K({},Ia,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),jz=Fe(Iz),bz=K({},Ia,{data:0}),BC=Fe(bz),Pz={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Az={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},zz={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Vz(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=zz[e])?!!t[e]:!1}function LL(){return Vz}var Hz=K({},Di,{key:function(e){if(e.key){var t=Pz[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=fr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Az[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:LL,charCode:function(e){return e.type==="keypress"?fr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?fr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Tz=Fe(Hz),qz=K({},ZM,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),NC=Fe(qz),Dz=K({},Di,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:LL}),Fz=Fe(Dz),Rz=K({},Ia,{propertyName:0,elapsedTime:0,pseudoElement:0}),Bz=Fe(Rz),Nz=K({},ZM,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Ez=Fe(Nz),Oz=[9,13,27,32],CL=Mt&&"CompositionEvent"in window,_a=null;Mt&&"documentMode"in document&&(_a=document.documentMode);var Uz=Mt&&"TextEvent"in window&&!_a,zj=Mt&&(!CL||_a&&8<_a&&11>=_a),EC=" ",OC=!1;function Vj(e,t){switch(e){case"keyup":return Oz.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Hj(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var U1=!1;function Zz(e,t){switch(e){case"compositionend":return Hj(t);case"keypress":return t.which!==32?null:(OC=!0,EC);case"textInput":return e=t.data,e===EC&&OC?null:e;default:return null}}function _z(e,t){if(U1)return e==="compositionend"||!CL&&Vj(e,t)?(e=Aj(),kr=ML=Dt=null,U1=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return zj&&t.locale!=="ko"?null:t.data;default:return null}}var Wz={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function UC(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Wz[e.type]:t==="textarea"}function Tj(e,t,n,a){hj(a),t=mM(t,"onChange"),0<t.length&&(n=new wL("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var Wa=null,vi=null;function Gz(e){_j(e,0)}function _M(e){var t=W1(e);if(ij(t))return e}function $z(e,t){if(e==="change")return t}var qj=!1;if(Mt){var w9;if(Mt){var L9="oninput"in document;if(!L9){var ZC=document.createElement("div");ZC.setAttribute("oninput","return;"),L9=typeof ZC.oninput=="function"}w9=L9}else w9=!1;qj=w9&&(!document.documentMode||9<document.documentMode)}function _C(){Wa&&(Wa.detachEvent("onpropertychange",Dj),vi=Wa=null)}function Dj(e){if(e.propertyName==="value"&&_M(vi)){var t=[];Tj(t,vi,e,fL(e)),kj(Gz,t)}}function Xz(e,t,n){e==="focusin"?(_C(),Wa=t,vi=n,Wa.attachEvent("onpropertychange",Dj)):e==="focusout"&&_C()}function Kz(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return _M(vi)}function Qz(e,t){if(e==="click")return _M(t)}function Yz(e,t){if(e==="input"||e==="change")return _M(t)}function Jz(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var nt=typeof Object.is=="function"?Object.is:Jz;function Mi(e,t){if(nt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var r=n[a];if(!ew.call(t,r)||!nt(e[r],t[r]))return!1}return!0}function WC(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function GC(e,t){var n=WC(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=WC(n)}}function Fj(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Fj(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Rj(){for(var e=window,t=dM();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=dM(e.document)}return t}function SL(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function eV(e){var t=Rj(),n=e.focusedElem,a=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Fj(n.ownerDocument.documentElement,n)){if(a!==null&&SL(n)){if(t=a.start,e=a.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var r=n.textContent.length,o=Math.min(a.start,r);a=a.end===void 0?o:Math.min(a.end,r),!e.extend&&o>a&&(r=a,a=o,o=r),r=GC(n,o);var s=GC(n,a);r&&s&&(e.rangeCount!==1||e.anchorNode!==r.node||e.anchorOffset!==r.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(r.node,r.offset),e.removeAllRanges(),o>a?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var tV=Mt&&"documentMode"in document&&11>=document.documentMode,Z1=null,xw=null,Ga=null,vw=!1;function $C(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;vw||Z1==null||Z1!==dM(a)||(a=Z1,"selectionStart"in a&&SL(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Ga&&Mi(Ga,a)||(Ga=a,a=mM(xw,"onSelect"),0<a.length&&(t=new wL("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=Z1)))}function Yi(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var _1={animationend:Yi("Animation","AnimationEnd"),animationiteration:Yi("Animation","AnimationIteration"),animationstart:Yi("Animation","AnimationStart"),transitionend:Yi("Transition","TransitionEnd")},C9={},Bj={};Mt&&(Bj=document.createElement("div").style,"AnimationEvent"in window||(delete _1.animationend.animation,delete _1.animationiteration.animation,delete _1.animationstart.animation),"TransitionEvent"in window||delete _1.transitionend.transition);function WM(e){if(C9[e])return C9[e];if(!_1[e])return e;var t=_1[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Bj)return C9[e]=t[n];return e}var Nj=WM("animationend"),Ej=WM("animationiteration"),Oj=WM("animationstart"),Uj=WM("transitionend"),Zj=new Map,XC="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function en(e,t){Zj.set(e,t),q1(t,[e])}for(var S9=0;S9<XC.length;S9++){var I9=XC[S9],nV=I9.toLowerCase(),aV=I9[0].toUpperCase()+I9.slice(1);en(nV,"on"+aV)}en(Nj,"onAnimationEnd");en(Ej,"onAnimationIteration");en(Oj,"onAnimationStart");en("dblclick","onDoubleClick");en("focusin","onFocus");en("focusout","onBlur");en(Uj,"onTransitionEnd");fa("onMouseEnter",["mouseout","mouseover"]);fa("onMouseLeave",["mouseout","mouseover"]);fa("onPointerEnter",["pointerout","pointerover"]);fa("onPointerLeave",["pointerout","pointerover"]);q1("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));q1("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));q1("onBeforeInput",["compositionend","keypress","textInput","paste"]);q1("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));q1("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));q1("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ea="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),iV=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ea));function KC(e,t,n){var a=e.type||"unknown-event";e.currentTarget=n,nz(a,t,void 0,e),e.currentTarget=null}function _j(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],r=a.event;a=a.listeners;e:{var o=void 0;if(t)for(var s=a.length-1;0<=s;s--){var c=a[s],d=c.instance,h=c.currentTarget;if(c=c.listener,d!==o&&r.isPropagationStopped())break e;KC(r,c,h),o=d}else for(s=0;s<a.length;s++){if(c=a[s],d=c.instance,h=c.currentTarget,c=c.listener,d!==o&&r.isPropagationStopped())break e;KC(r,c,h),o=d}}}if(uM)throw e=kw,uM=!1,kw=null,e}function U(e,t){var n=t[Sw];n===void 0&&(n=t[Sw]=new Set);var a=e+"__bubble";n.has(a)||(Wj(t,e,2,!1),n.add(a))}function j9(e,t,n){var a=0;t&&(a|=4),Wj(n,e,a,t)}var Ji="_reactListening"+Math.random().toString(36).slice(2);function wi(e){if(!e[Ji]){e[Ji]=!0,JI.forEach(function(n){n!=="selectionchange"&&(iV.has(n)||j9(n,!1,e),j9(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ji]||(t[Ji]=!0,j9("selectionchange",!1,t))}}function Wj(e,t,n,a){switch(Pj(t)){case 1:var r=gz;break;case 4:r=xz;break;default:r=vL}n=r.bind(null,t,n,e),r=void 0,!pw||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(r=!0),a?r!==void 0?e.addEventListener(t,n,{capture:!0,passive:r}):e.addEventListener(t,n,!0):r!==void 0?e.addEventListener(t,n,{passive:r}):e.addEventListener(t,n,!1)}function b9(e,t,n,a,r){var o=a;if(!(t&1)&&!(t&2)&&a!==null)e:for(;;){if(a===null)return;var s=a.tag;if(s===3||s===4){var c=a.stateNode.containerInfo;if(c===r||c.nodeType===8&&c.parentNode===r)break;if(s===4)for(s=a.return;s!==null;){var d=s.tag;if((d===3||d===4)&&(d=s.stateNode.containerInfo,d===r||d.nodeType===8&&d.parentNode===r))return;s=s.return}for(;c!==null;){if(s=k1(c),s===null)return;if(d=s.tag,d===5||d===6){a=o=s;continue e}c=c.parentNode}}a=a.return}kj(function(){var h=o,u=fL(n),y=[];e:{var k=Zj.get(e);if(k!==void 0){var g=wL,v=e;switch(e){case"keypress":if(fr(n)===0)break e;case"keydown":case"keyup":g=Tz;break;case"focusin":v="focus",g=M9;break;case"focusout":v="blur",g=M9;break;case"beforeblur":case"afterblur":g=M9;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":g=RC;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":g=wz;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":g=Fz;break;case Nj:case Ej:case Oj:g=Sz;break;case Uj:g=Bz;break;case"scroll":g=vz;break;case"wheel":g=Ez;break;case"copy":case"cut":case"paste":g=jz;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":g=NC}var x=(t&4)!==0,L=!x&&e==="scroll",m=x?k!==null?k+"Capture":null:k;x=[];for(var p=h,f;p!==null;){f=p;var M=f.stateNode;if(f.tag===5&&M!==null&&(f=M,m!==null&&(M=fi(p,m),M!=null&&x.push(Li(p,M,f)))),L)break;p=p.return}0<x.length&&(k=new g(k,v,null,n,u),y.push({event:k,listeners:x}))}}if(!(t&7)){e:{if(k=e==="mouseover"||e==="pointerover",g=e==="mouseout"||e==="pointerout",k&&n!==uw&&(v=n.relatedTarget||n.fromElement)&&(k1(v)||v[wt]))break e;if((g||k)&&(k=u.window===u?u:(k=u.ownerDocument)?k.defaultView||k.parentWindow:window,g?(v=n.relatedTarget||n.toElement,g=h,v=v?k1(v):null,v!==null&&(L=D1(v),v!==L||v.tag!==5&&v.tag!==6)&&(v=null)):(g=null,v=h),g!==v)){if(x=RC,M="onMouseLeave",m="onMouseEnter",p="mouse",(e==="pointerout"||e==="pointerover")&&(x=NC,M="onPointerLeave",m="onPointerEnter",p="pointer"),L=g==null?k:W1(g),f=v==null?k:W1(v),k=new x(M,p+"leave",g,n,u),k.target=L,k.relatedTarget=f,M=null,k1(u)===h&&(x=new x(m,p+"enter",v,n,u),x.target=f,x.relatedTarget=L,M=x),L=M,g&&v)t:{for(x=g,m=v,p=0,f=x;f;f=N1(f))p++;for(f=0,M=m;M;M=N1(M))f++;for(;0<p-f;)x=N1(x),p--;for(;0<f-p;)m=N1(m),f--;for(;p--;){if(x===m||m!==null&&x===m.alternate)break t;x=N1(x),m=N1(m)}x=null}else x=null;g!==null&&QC(y,k,g,x,!1),v!==null&&L!==null&&QC(y,L,v,x,!0)}}e:{if(k=h?W1(h):window,g=k.nodeName&&k.nodeName.toLowerCase(),g==="select"||g==="input"&&k.type==="file")var w=$z;else if(UC(k))if(qj)w=Yz;else{w=Kz;var I=Xz}else(g=k.nodeName)&&g.toLowerCase()==="input"&&(k.type==="checkbox"||k.type==="radio")&&(w=Qz);if(w&&(w=w(e,h))){Tj(y,w,n,u);break e}I&&I(e,k,h),e==="focusout"&&(I=k._wrapperState)&&I.controlled&&k.type==="number"&&sw(k,"number",k.value)}switch(I=h?W1(h):window,e){case"focusin":(UC(I)||I.contentEditable==="true")&&(Z1=I,xw=h,Ga=null);break;case"focusout":Ga=xw=Z1=null;break;case"mousedown":vw=!0;break;case"contextmenu":case"mouseup":case"dragend":vw=!1,$C(y,n,u);break;case"selectionchange":if(tV)break;case"keydown":case"keyup":$C(y,n,u)}var b;if(CL)e:{switch(e){case"compositionstart":var j="onCompositionStart";break e;case"compositionend":j="onCompositionEnd";break e;case"compositionupdate":j="onCompositionUpdate";break e}j=void 0}else U1?Vj(e,n)&&(j="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(j="onCompositionStart");j&&(zj&&n.locale!=="ko"&&(U1||j!=="onCompositionStart"?j==="onCompositionEnd"&&U1&&(b=Aj()):(Dt=u,ML="value"in Dt?Dt.value:Dt.textContent,U1=!0)),I=mM(h,j),0<I.length&&(j=new BC(j,e,null,n,u),y.push({event:j,listeners:I}),b?j.data=b:(b=Hj(n),b!==null&&(j.data=b)))),(b=Uz?Zz(e,n):_z(e,n))&&(h=mM(h,"onBeforeInput"),0<h.length&&(u=new BC("onBeforeInput","beforeinput",null,n,u),y.push({event:u,listeners:h}),u.data=b))}_j(y,t)})}function Li(e,t,n){return{instance:e,listener:t,currentTarget:n}}function mM(e,t){for(var n=t+"Capture",a=[];e!==null;){var r=e,o=r.stateNode;r.tag===5&&o!==null&&(r=o,o=fi(e,n),o!=null&&a.unshift(Li(e,o,r)),o=fi(e,t),o!=null&&a.push(Li(e,o,r))),e=e.return}return a}function N1(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function QC(e,t,n,a,r){for(var o=t._reactName,s=[];n!==null&&n!==a;){var c=n,d=c.alternate,h=c.stateNode;if(d!==null&&d===a)break;c.tag===5&&h!==null&&(c=h,r?(d=fi(n,o),d!=null&&s.unshift(Li(n,d,c))):r||(d=fi(n,o),d!=null&&s.push(Li(n,d,c)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var rV=/\r\n?/g,oV=/\u0000|\uFFFD/g;function YC(e){return(typeof e=="string"?e:""+e).replace(rV,`
`).replace(oV,"")}function er(e,t,n){if(t=YC(t),YC(e)!==t&&n)throw Error(S(425))}function gM(){}var Mw=null,ww=null;function Lw(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Cw=typeof setTimeout=="function"?setTimeout:void 0,sV=typeof clearTimeout=="function"?clearTimeout:void 0,JC=typeof Promise=="function"?Promise:void 0,cV=typeof queueMicrotask=="function"?queueMicrotask:typeof JC<"u"?function(e){return JC.resolve(null).then(e).catch(lV)}:Cw;function lV(e){setTimeout(function(){throw e})}function P9(e,t){var n=t,a=0;do{var r=n.nextSibling;if(e.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(a===0){e.removeChild(r),xi(t);return}a--}else n!=="$"&&n!=="$?"&&n!=="$!"||a++;n=r}while(n);xi(t)}function Ot(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function eS(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var ja=Math.random().toString(36).slice(2),st="__reactFiber$"+ja,Ci="__reactProps$"+ja,wt="__reactContainer$"+ja,Sw="__reactEvents$"+ja,dV="__reactListeners$"+ja,hV="__reactHandles$"+ja;function k1(e){var t=e[st];if(t)return t;for(var n=e.parentNode;n;){if(t=n[wt]||n[st]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=eS(e);e!==null;){if(n=e[st])return n;e=eS(e)}return t}e=n,n=e.parentNode}return null}function Fi(e){return e=e[st]||e[wt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function W1(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(S(33))}function GM(e){return e[Ci]||null}var Iw=[],G1=-1;function tn(e){return{current:e}}function Z(e){0>G1||(e.current=Iw[G1],Iw[G1]=null,G1--)}function E(e,t){G1++,Iw[G1]=e.current,e.current=t}var Qt={},me=tn(Qt),Ie=tn(!1),P1=Qt;function ma(e,t){var n=e.type.contextTypes;if(!n)return Qt;var a=e.stateNode;if(a&&a.__reactInternalMemoizedUnmaskedChildContext===t)return a.__reactInternalMemoizedMaskedChildContext;var r={},o;for(o in n)r[o]=t[o];return a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=r),r}function je(e){return e=e.childContextTypes,e!=null}function xM(){Z(Ie),Z(me)}function tS(e,t,n){if(me.current!==Qt)throw Error(S(168));E(me,t),E(Ie,n)}function Gj(e,t,n){var a=e.stateNode;if(t=t.childContextTypes,typeof a.getChildContext!="function")return n;a=a.getChildContext();for(var r in a)if(!(r in t))throw Error(S(108,XA(e)||"Unknown",r));return K({},n,a)}function vM(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Qt,P1=me.current,E(me,e),E(Ie,Ie.current),!0}function nS(e,t,n){var a=e.stateNode;if(!a)throw Error(S(169));n?(e=Gj(e,t,P1),a.__reactInternalMemoizedMergedChildContext=e,Z(Ie),Z(me),E(me,e)):Z(Ie),E(Ie,n)}var yt=null,$M=!1,A9=!1;function $j(e){yt===null?yt=[e]:yt.push(e)}function uV(e){$M=!0,$j(e)}function nn(){if(!A9&&yt!==null){A9=!0;var e=0,t=N;try{var n=yt;for(N=1;e<n.length;e++){var a=n[e];do a=a(!0);while(a!==null)}yt=null,$M=!1}catch(r){throw yt!==null&&(yt=yt.slice(e+1)),xj(mL,nn),r}finally{N=t,A9=!1}}return null}var $1=[],X1=0,MM=null,wM=0,Ee=[],Oe=0,A1=null,pt=1,kt="";function ln(e,t){$1[X1++]=wM,$1[X1++]=MM,MM=e,wM=t}function Xj(e,t,n){Ee[Oe++]=pt,Ee[Oe++]=kt,Ee[Oe++]=A1,A1=e;var a=pt;e=kt;var r=32-Je(a)-1;a&=~(1<<r),n+=1;var o=32-Je(t)+r;if(30<o){var s=r-r%5;o=(a&(1<<s)-1).toString(32),a>>=s,r-=s,pt=1<<32-Je(t)+r|n<<r|a,kt=o+e}else pt=1<<o|n<<r|a,kt=e}function IL(e){e.return!==null&&(ln(e,1),Xj(e,1,0))}function jL(e){for(;e===MM;)MM=$1[--X1],$1[X1]=null,wM=$1[--X1],$1[X1]=null;for(;e===A1;)A1=Ee[--Oe],Ee[Oe]=null,kt=Ee[--Oe],Ee[Oe]=null,pt=Ee[--Oe],Ee[Oe]=null}var He=null,Ve=null,W=!1,Ye=null;function Kj(e,t){var n=Ue(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function aS(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,He=e,Ve=Ot(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,He=e,Ve=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=A1!==null?{id:pt,overflow:kt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Ue(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,He=e,Ve=null,!0):!1;default:return!1}}function jw(e){return(e.mode&1)!==0&&(e.flags&128)===0}function bw(e){if(W){var t=Ve;if(t){var n=t;if(!aS(e,t)){if(jw(e))throw Error(S(418));t=Ot(n.nextSibling);var a=He;t&&aS(e,t)?Kj(a,n):(e.flags=e.flags&-4097|2,W=!1,He=e)}}else{if(jw(e))throw Error(S(418));e.flags=e.flags&-4097|2,W=!1,He=e}}}function iS(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;He=e}function tr(e){if(e!==He)return!1;if(!W)return iS(e),W=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Lw(e.type,e.memoizedProps)),t&&(t=Ve)){if(jw(e))throw Qj(),Error(S(418));for(;t;)Kj(e,t),t=Ot(t.nextSibling)}if(iS(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(S(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Ve=Ot(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Ve=null}}else Ve=He?Ot(e.stateNode.nextSibling):null;return!0}function Qj(){for(var e=Ve;e;)e=Ot(e.nextSibling)}function ga(){Ve=He=null,W=!1}function bL(e){Ye===null?Ye=[e]:Ye.push(e)}var yV=It.ReactCurrentBatchConfig;function Ha(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(S(309));var a=n.stateNode}if(!a)throw Error(S(147,e));var r=a,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(s){var c=r.refs;s===null?delete c[o]:c[o]=s},t._stringRef=o,t)}if(typeof e!="string")throw Error(S(284));if(!n._owner)throw Error(S(290,e))}return e}function nr(e,t){throw e=Object.prototype.toString.call(t),Error(S(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function rS(e){var t=e._init;return t(e._payload)}function Yj(e){function t(m,p){if(e){var f=m.deletions;f===null?(m.deletions=[p],m.flags|=16):f.push(p)}}function n(m,p){if(!e)return null;for(;p!==null;)t(m,p),p=p.sibling;return null}function a(m,p){for(m=new Map;p!==null;)p.key!==null?m.set(p.key,p):m.set(p.index,p),p=p.sibling;return m}function r(m,p){return m=Wt(m,p),m.index=0,m.sibling=null,m}function o(m,p,f){return m.index=f,e?(f=m.alternate,f!==null?(f=f.index,f<p?(m.flags|=2,p):f):(m.flags|=2,p)):(m.flags|=1048576,p)}function s(m){return e&&m.alternate===null&&(m.flags|=2),m}function c(m,p,f,M){return p===null||p.tag!==6?(p=F9(f,m.mode,M),p.return=m,p):(p=r(p,f),p.return=m,p)}function d(m,p,f,M){var w=f.type;return w===O1?u(m,p,f.props.children,M,f.key):p!==null&&(p.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===At&&rS(w)===p.type)?(M=r(p,f.props),M.ref=Ha(m,p,f),M.return=m,M):(M=Lr(f.type,f.key,f.props,null,m.mode,M),M.ref=Ha(m,p,f),M.return=m,M)}function h(m,p,f,M){return p===null||p.tag!==4||p.stateNode.containerInfo!==f.containerInfo||p.stateNode.implementation!==f.implementation?(p=R9(f,m.mode,M),p.return=m,p):(p=r(p,f.children||[]),p.return=m,p)}function u(m,p,f,M,w){return p===null||p.tag!==7?(p=v1(f,m.mode,M,w),p.return=m,p):(p=r(p,f),p.return=m,p)}function y(m,p,f){if(typeof p=="string"&&p!==""||typeof p=="number")return p=F9(""+p,m.mode,f),p.return=m,p;if(typeof p=="object"&&p!==null){switch(p.$$typeof){case _i:return f=Lr(p.type,p.key,p.props,null,m.mode,f),f.ref=Ha(m,null,p),f.return=m,f;case E1:return p=R9(p,m.mode,f),p.return=m,p;case At:var M=p._init;return y(m,M(p._payload),f)}if(Ba(p)||ba(p))return p=v1(p,m.mode,f,null),p.return=m,p;nr(m,p)}return null}function k(m,p,f,M){var w=p!==null?p.key:null;if(typeof f=="string"&&f!==""||typeof f=="number")return w!==null?null:c(m,p,""+f,M);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case _i:return f.key===w?d(m,p,f,M):null;case E1:return f.key===w?h(m,p,f,M):null;case At:return w=f._init,k(m,p,w(f._payload),M)}if(Ba(f)||ba(f))return w!==null?null:u(m,p,f,M,null);nr(m,f)}return null}function g(m,p,f,M,w){if(typeof M=="string"&&M!==""||typeof M=="number")return m=m.get(f)||null,c(p,m,""+M,w);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case _i:return m=m.get(M.key===null?f:M.key)||null,d(p,m,M,w);case E1:return m=m.get(M.key===null?f:M.key)||null,h(p,m,M,w);case At:var I=M._init;return g(m,p,f,I(M._payload),w)}if(Ba(M)||ba(M))return m=m.get(f)||null,u(p,m,M,w,null);nr(p,M)}return null}function v(m,p,f,M){for(var w=null,I=null,b=p,j=p=0,z=null;b!==null&&j<f.length;j++){b.index>j?(z=b,b=null):z=b.sibling;var H=k(m,b,f[j],M);if(H===null){b===null&&(b=z);break}e&&b&&H.alternate===null&&t(m,b),p=o(H,p,j),I===null?w=H:I.sibling=H,I=H,b=z}if(j===f.length)return n(m,b),W&&ln(m,j),w;if(b===null){for(;j<f.length;j++)b=y(m,f[j],M),b!==null&&(p=o(b,p,j),I===null?w=b:I.sibling=b,I=b);return W&&ln(m,j),w}for(b=a(m,b);j<f.length;j++)z=g(b,m,j,f[j],M),z!==null&&(e&&z.alternate!==null&&b.delete(z.key===null?j:z.key),p=o(z,p,j),I===null?w=z:I.sibling=z,I=z);return e&&b.forEach(function(re){return t(m,re)}),W&&ln(m,j),w}function x(m,p,f,M){var w=ba(f);if(typeof w!="function")throw Error(S(150));if(f=w.call(f),f==null)throw Error(S(151));for(var I=w=null,b=p,j=p=0,z=null,H=f.next();b!==null&&!H.done;j++,H=f.next()){b.index>j?(z=b,b=null):z=b.sibling;var re=k(m,b,H.value,M);if(re===null){b===null&&(b=z);break}e&&b&&re.alternate===null&&t(m,b),p=o(re,p,j),I===null?w=re:I.sibling=re,I=re,b=z}if(H.done)return n(m,b),W&&ln(m,j),w;if(b===null){for(;!H.done;j++,H=f.next())H=y(m,H.value,M),H!==null&&(p=o(H,p,j),I===null?w=H:I.sibling=H,I=H);return W&&ln(m,j),w}for(b=a(m,b);!H.done;j++,H=f.next())H=g(b,m,j,H.value,M),H!==null&&(e&&H.alternate!==null&&b.delete(H.key===null?j:H.key),p=o(H,p,j),I===null?w=H:I.sibling=H,I=H);return e&&b.forEach(function(le){return t(m,le)}),W&&ln(m,j),w}function L(m,p,f,M){if(typeof f=="object"&&f!==null&&f.type===O1&&f.key===null&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case _i:e:{for(var w=f.key,I=p;I!==null;){if(I.key===w){if(w=f.type,w===O1){if(I.tag===7){n(m,I.sibling),p=r(I,f.props.children),p.return=m,m=p;break e}}else if(I.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===At&&rS(w)===I.type){n(m,I.sibling),p=r(I,f.props),p.ref=Ha(m,I,f),p.return=m,m=p;break e}n(m,I);break}else t(m,I);I=I.sibling}f.type===O1?(p=v1(f.props.children,m.mode,M,f.key),p.return=m,m=p):(M=Lr(f.type,f.key,f.props,null,m.mode,M),M.ref=Ha(m,p,f),M.return=m,m=M)}return s(m);case E1:e:{for(I=f.key;p!==null;){if(p.key===I)if(p.tag===4&&p.stateNode.containerInfo===f.containerInfo&&p.stateNode.implementation===f.implementation){n(m,p.sibling),p=r(p,f.children||[]),p.return=m,m=p;break e}else{n(m,p);break}else t(m,p);p=p.sibling}p=R9(f,m.mode,M),p.return=m,m=p}return s(m);case At:return I=f._init,L(m,p,I(f._payload),M)}if(Ba(f))return v(m,p,f,M);if(ba(f))return x(m,p,f,M);nr(m,f)}return typeof f=="string"&&f!==""||typeof f=="number"?(f=""+f,p!==null&&p.tag===6?(n(m,p.sibling),p=r(p,f),p.return=m,m=p):(n(m,p),p=F9(f,m.mode,M),p.return=m,m=p),s(m)):n(m,p)}return L}var xa=Yj(!0),Jj=Yj(!1),LM=tn(null),CM=null,K1=null,PL=null;function AL(){PL=K1=CM=null}function zL(e){var t=LM.current;Z(LM),e._currentValue=t}function Pw(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function sa(e,t){CM=e,PL=K1=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Se=!0),e.firstContext=null)}function We(e){var t=e._currentValue;if(PL!==e)if(e={context:e,memoizedValue:t,next:null},K1===null){if(CM===null)throw Error(S(308));K1=e,CM.dependencies={lanes:0,firstContext:e}}else K1=K1.next=e;return t}var f1=null;function VL(e){f1===null?f1=[e]:f1.push(e)}function eb(e,t,n,a){var r=t.interleaved;return r===null?(n.next=n,VL(t)):(n.next=r.next,r.next=n),t.interleaved=n,Lt(e,a)}function Lt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var zt=!1;function HL(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function tb(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function mt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Ut(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,B&2){var r=a.pending;return r===null?t.next=t:(t.next=r.next,r.next=t),a.pending=t,Lt(e,n)}return r=a.interleaved,r===null?(t.next=t,VL(a)):(t.next=r.next,r.next=t),a.interleaved=t,Lt(e,n)}function mr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,gL(e,n)}}function oS(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var r=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?r=o=s:o=o.next=s,n=n.next}while(n!==null);o===null?r=o=t:o=o.next=t}else r=o=t;n={baseState:a.baseState,firstBaseUpdate:r,lastBaseUpdate:o,shared:a.shared,effects:a.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function SM(e,t,n,a){var r=e.updateQueue;zt=!1;var o=r.firstBaseUpdate,s=r.lastBaseUpdate,c=r.shared.pending;if(c!==null){r.shared.pending=null;var d=c,h=d.next;d.next=null,s===null?o=h:s.next=h,s=d;var u=e.alternate;u!==null&&(u=u.updateQueue,c=u.lastBaseUpdate,c!==s&&(c===null?u.firstBaseUpdate=h:c.next=h,u.lastBaseUpdate=d))}if(o!==null){var y=r.baseState;s=0,u=h=d=null,c=o;do{var k=c.lane,g=c.eventTime;if((a&k)===k){u!==null&&(u=u.next={eventTime:g,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var v=e,x=c;switch(k=t,g=n,x.tag){case 1:if(v=x.payload,typeof v=="function"){y=v.call(g,y,k);break e}y=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=x.payload,k=typeof v=="function"?v.call(g,y,k):v,k==null)break e;y=K({},y,k);break e;case 2:zt=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,k=r.effects,k===null?r.effects=[c]:k.push(c))}else g={eventTime:g,lane:k,tag:c.tag,payload:c.payload,callback:c.callback,next:null},u===null?(h=u=g,d=y):u=u.next=g,s|=k;if(c=c.next,c===null){if(c=r.shared.pending,c===null)break;k=c,c=k.next,k.next=null,r.lastBaseUpdate=k,r.shared.pending=null}}while(!0);if(u===null&&(d=y),r.baseState=d,r.firstBaseUpdate=h,r.lastBaseUpdate=u,t=r.shared.interleaved,t!==null){r=t;do s|=r.lane,r=r.next;while(r!==t)}else o===null&&(r.shared.lanes=0);V1|=s,e.lanes=s,e.memoizedState=y}}function sS(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var a=e[t],r=a.callback;if(r!==null){if(a.callback=null,a=n,typeof r!="function")throw Error(S(191,r));r.call(a)}}}var Ri={},lt=tn(Ri),Si=tn(Ri),Ii=tn(Ri);function m1(e){if(e===Ri)throw Error(S(174));return e}function TL(e,t){switch(E(Ii,t),E(Si,e),E(lt,Ri),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:lw(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=lw(t,e)}Z(lt),E(lt,t)}function va(){Z(lt),Z(Si),Z(Ii)}function nb(e){m1(Ii.current);var t=m1(lt.current),n=lw(t,e.type);t!==n&&(E(Si,e),E(lt,n))}function qL(e){Si.current===e&&(Z(lt),Z(Si))}var G=tn(0);function IM(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var z9=[];function DL(){for(var e=0;e<z9.length;e++)z9[e]._workInProgressVersionPrimary=null;z9.length=0}var gr=It.ReactCurrentDispatcher,V9=It.ReactCurrentBatchConfig,z1=0,X=null,ae=null,se=null,jM=!1,$a=!1,ji=0,pV=0;function ye(){throw Error(S(321))}function FL(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!nt(e[n],t[n]))return!1;return!0}function RL(e,t,n,a,r,o){if(z1=o,X=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,gr.current=e===null||e.memoizedState===null?gV:xV,e=n(a,r),$a){o=0;do{if($a=!1,ji=0,25<=o)throw Error(S(301));o+=1,se=ae=null,t.updateQueue=null,gr.current=vV,e=n(a,r)}while($a)}if(gr.current=bM,t=ae!==null&&ae.next!==null,z1=0,se=ae=X=null,jM=!1,t)throw Error(S(300));return e}function BL(){var e=ji!==0;return ji=0,e}function ot(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return se===null?X.memoizedState=se=e:se=se.next=e,se}function Ge(){if(ae===null){var e=X.alternate;e=e!==null?e.memoizedState:null}else e=ae.next;var t=se===null?X.memoizedState:se.next;if(t!==null)se=t,ae=e;else{if(e===null)throw Error(S(310));ae=e,e={memoizedState:ae.memoizedState,baseState:ae.baseState,baseQueue:ae.baseQueue,queue:ae.queue,next:null},se===null?X.memoizedState=se=e:se=se.next=e}return se}function bi(e,t){return typeof t=="function"?t(e):t}function H9(e){var t=Ge(),n=t.queue;if(n===null)throw Error(S(311));n.lastRenderedReducer=e;var a=ae,r=a.baseQueue,o=n.pending;if(o!==null){if(r!==null){var s=r.next;r.next=o.next,o.next=s}a.baseQueue=r=o,n.pending=null}if(r!==null){o=r.next,a=a.baseState;var c=s=null,d=null,h=o;do{var u=h.lane;if((z1&u)===u)d!==null&&(d=d.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),a=h.hasEagerState?h.eagerState:e(a,h.action);else{var y={lane:u,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};d===null?(c=d=y,s=a):d=d.next=y,X.lanes|=u,V1|=u}h=h.next}while(h!==null&&h!==o);d===null?s=a:d.next=c,nt(a,t.memoizedState)||(Se=!0),t.memoizedState=a,t.baseState=s,t.baseQueue=d,n.lastRenderedState=a}if(e=n.interleaved,e!==null){r=e;do o=r.lane,X.lanes|=o,V1|=o,r=r.next;while(r!==e)}else r===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function T9(e){var t=Ge(),n=t.queue;if(n===null)throw Error(S(311));n.lastRenderedReducer=e;var a=n.dispatch,r=n.pending,o=t.memoizedState;if(r!==null){n.pending=null;var s=r=r.next;do o=e(o,s.action),s=s.next;while(s!==r);nt(o,t.memoizedState)||(Se=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,a]}function ab(){}function ib(e,t){var n=X,a=Ge(),r=t(),o=!nt(a.memoizedState,r);if(o&&(a.memoizedState=r,Se=!0),a=a.queue,NL(sb.bind(null,n,a,e),[e]),a.getSnapshot!==t||o||se!==null&&se.memoizedState.tag&1){if(n.flags|=2048,Pi(9,ob.bind(null,n,a,r,t),void 0,null),ce===null)throw Error(S(349));z1&30||rb(n,t,r)}return r}function rb(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=X.updateQueue,t===null?(t={lastEffect:null,stores:null},X.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ob(e,t,n,a){t.value=n,t.getSnapshot=a,cb(t)&&lb(e)}function sb(e,t,n){return n(function(){cb(t)&&lb(e)})}function cb(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!nt(e,n)}catch{return!0}}function lb(e){var t=Lt(e,1);t!==null&&et(t,e,1,-1)}function cS(e){var t=ot();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:bi,lastRenderedState:e},t.queue=e,e=e.dispatch=mV.bind(null,X,e),[t.memoizedState,e]}function Pi(e,t,n,a){return e={tag:e,create:t,destroy:n,deps:a,next:null},t=X.updateQueue,t===null?(t={lastEffect:null,stores:null},X.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e)),e}function db(){return Ge().memoizedState}function xr(e,t,n,a){var r=ot();X.flags|=e,r.memoizedState=Pi(1|t,n,void 0,a===void 0?null:a)}function XM(e,t,n,a){var r=Ge();a=a===void 0?null:a;var o=void 0;if(ae!==null){var s=ae.memoizedState;if(o=s.destroy,a!==null&&FL(a,s.deps)){r.memoizedState=Pi(t,n,o,a);return}}X.flags|=e,r.memoizedState=Pi(1|t,n,o,a)}function lS(e,t){return xr(8390656,8,e,t)}function NL(e,t){return XM(2048,8,e,t)}function hb(e,t){return XM(4,2,e,t)}function ub(e,t){return XM(4,4,e,t)}function yb(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function pb(e,t,n){return n=n!=null?n.concat([e]):null,XM(4,4,yb.bind(null,t,e),n)}function EL(){}function kb(e,t){var n=Ge();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&FL(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function fb(e,t){var n=Ge();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&FL(t,a[1])?a[0]:(e=e(),n.memoizedState=[e,t],e)}function mb(e,t,n){return z1&21?(nt(n,t)||(n=wj(),X.lanes|=n,V1|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Se=!0),e.memoizedState=n)}function kV(e,t){var n=N;N=n!==0&&4>n?n:4,e(!0);var a=V9.transition;V9.transition={};try{e(!1),t()}finally{N=n,V9.transition=a}}function gb(){return Ge().memoizedState}function fV(e,t,n){var a=_t(e);if(n={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null},xb(e))vb(t,n);else if(n=eb(e,t,n,a),n!==null){var r=Me();et(n,e,a,r),Mb(n,t,a)}}function mV(e,t,n){var a=_t(e),r={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null};if(xb(e))vb(t,r);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var s=t.lastRenderedState,c=o(s,n);if(r.hasEagerState=!0,r.eagerState=c,nt(c,s)){var d=t.interleaved;d===null?(r.next=r,VL(t)):(r.next=d.next,d.next=r),t.interleaved=r;return}}catch{}finally{}n=eb(e,t,r,a),n!==null&&(r=Me(),et(n,e,a,r),Mb(n,t,a))}}function xb(e){var t=e.alternate;return e===X||t!==null&&t===X}function vb(e,t){$a=jM=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Mb(e,t,n){if(n&4194240){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,gL(e,n)}}var bM={readContext:We,useCallback:ye,useContext:ye,useEffect:ye,useImperativeHandle:ye,useInsertionEffect:ye,useLayoutEffect:ye,useMemo:ye,useReducer:ye,useRef:ye,useState:ye,useDebugValue:ye,useDeferredValue:ye,useTransition:ye,useMutableSource:ye,useSyncExternalStore:ye,useId:ye,unstable_isNewReconciler:!1},gV={readContext:We,useCallback:function(e,t){return ot().memoizedState=[e,t===void 0?null:t],e},useContext:We,useEffect:lS,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,xr(4194308,4,yb.bind(null,t,e),n)},useLayoutEffect:function(e,t){return xr(4194308,4,e,t)},useInsertionEffect:function(e,t){return xr(4,2,e,t)},useMemo:function(e,t){var n=ot();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var a=ot();return t=n!==void 0?n(t):t,a.memoizedState=a.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},a.queue=e,e=e.dispatch=fV.bind(null,X,e),[a.memoizedState,e]},useRef:function(e){var t=ot();return e={current:e},t.memoizedState=e},useState:cS,useDebugValue:EL,useDeferredValue:function(e){return ot().memoizedState=e},useTransition:function(){var e=cS(!1),t=e[0];return e=kV.bind(null,e[1]),ot().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var a=X,r=ot();if(W){if(n===void 0)throw Error(S(407));n=n()}else{if(n=t(),ce===null)throw Error(S(349));z1&30||rb(a,t,n)}r.memoizedState=n;var o={value:n,getSnapshot:t};return r.queue=o,lS(sb.bind(null,a,o,e),[e]),a.flags|=2048,Pi(9,ob.bind(null,a,o,n,t),void 0,null),n},useId:function(){var e=ot(),t=ce.identifierPrefix;if(W){var n=kt,a=pt;n=(a&~(1<<32-Je(a)-1)).toString(32)+n,t=":"+t+"R"+n,n=ji++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=pV++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},xV={readContext:We,useCallback:kb,useContext:We,useEffect:NL,useImperativeHandle:pb,useInsertionEffect:hb,useLayoutEffect:ub,useMemo:fb,useReducer:H9,useRef:db,useState:function(){return H9(bi)},useDebugValue:EL,useDeferredValue:function(e){var t=Ge();return mb(t,ae.memoizedState,e)},useTransition:function(){var e=H9(bi)[0],t=Ge().memoizedState;return[e,t]},useMutableSource:ab,useSyncExternalStore:ib,useId:gb,unstable_isNewReconciler:!1},vV={readContext:We,useCallback:kb,useContext:We,useEffect:NL,useImperativeHandle:pb,useInsertionEffect:hb,useLayoutEffect:ub,useMemo:fb,useReducer:T9,useRef:db,useState:function(){return T9(bi)},useDebugValue:EL,useDeferredValue:function(e){var t=Ge();return ae===null?t.memoizedState=e:mb(t,ae.memoizedState,e)},useTransition:function(){var e=T9(bi)[0],t=Ge().memoizedState;return[e,t]},useMutableSource:ab,useSyncExternalStore:ib,useId:gb,unstable_isNewReconciler:!1};function Ke(e,t){if(e&&e.defaultProps){t=K({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Aw(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:K({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var KM={isMounted:function(e){return(e=e._reactInternals)?D1(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var a=Me(),r=_t(e),o=mt(a,r);o.payload=t,n!=null&&(o.callback=n),t=Ut(e,o,r),t!==null&&(et(t,e,r,a),mr(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=Me(),r=_t(e),o=mt(a,r);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=Ut(e,o,r),t!==null&&(et(t,e,r,a),mr(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Me(),a=_t(e),r=mt(n,a);r.tag=2,t!=null&&(r.callback=t),t=Ut(e,r,a),t!==null&&(et(t,e,a,n),mr(t,e,a))}};function dS(e,t,n,a,r,o,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,o,s):t.prototype&&t.prototype.isPureReactComponent?!Mi(n,a)||!Mi(r,o):!0}function wb(e,t,n){var a=!1,r=Qt,o=t.contextType;return typeof o=="object"&&o!==null?o=We(o):(r=je(t)?P1:me.current,a=t.contextTypes,o=(a=a!=null)?ma(e,r):Qt),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=KM,e.stateNode=t,t._reactInternals=e,a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=r,e.__reactInternalMemoizedMaskedChildContext=o),t}function hS(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&KM.enqueueReplaceState(t,t.state,null)}function zw(e,t,n,a){var r=e.stateNode;r.props=n,r.state=e.memoizedState,r.refs={},HL(e);var o=t.contextType;typeof o=="object"&&o!==null?r.context=We(o):(o=je(t)?P1:me.current,r.context=ma(e,o)),r.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(Aw(e,t,o,n),r.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(t=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),t!==r.state&&KM.enqueueReplaceState(r,r.state,null),SM(e,n,r,a),r.state=e.memoizedState),typeof r.componentDidMount=="function"&&(e.flags|=4194308)}function Ma(e,t){try{var n="",a=t;do n+=$A(a),a=a.return;while(a);var r=n}catch(o){r=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:r,digest:null}}function q9(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Vw(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var MV=typeof WeakMap=="function"?WeakMap:Map;function Lb(e,t,n){n=mt(-1,n),n.tag=3,n.payload={element:null};var a=t.value;return n.callback=function(){AM||(AM=!0,Ow=a),Vw(e,t)},n}function Cb(e,t,n){n=mt(-1,n),n.tag=3;var a=e.type.getDerivedStateFromError;if(typeof a=="function"){var r=t.value;n.payload=function(){return a(r)},n.callback=function(){Vw(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){Vw(e,t),typeof a!="function"&&(Zt===null?Zt=new Set([this]):Zt.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function uS(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new MV;var r=new Set;a.set(t,r)}else r=a.get(t),r===void 0&&(r=new Set,a.set(t,r));r.has(n)||(r.add(n),e=qV.bind(null,e,t,n),t.then(e,e))}function yS(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function pS(e,t,n,a,r){return e.mode&1?(e.flags|=65536,e.lanes=r,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=mt(-1,1),t.tag=2,Ut(n,t,1))),n.lanes|=1),e)}var wV=It.ReactCurrentOwner,Se=!1;function ve(e,t,n,a){t.child=e===null?Jj(t,null,n,a):xa(t,e.child,n,a)}function kS(e,t,n,a,r){n=n.render;var o=t.ref;return sa(t,r),a=RL(e,t,n,a,o,r),n=BL(),e!==null&&!Se?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Ct(e,t,r)):(W&&n&&IL(t),t.flags|=1,ve(e,t,a,r),t.child)}function fS(e,t,n,a,r){if(e===null){var o=n.type;return typeof o=="function"&&!XL(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,Sb(e,t,o,a,r)):(e=Lr(n.type,null,a,t,t.mode,r),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,!(e.lanes&r)){var s=o.memoizedProps;if(n=n.compare,n=n!==null?n:Mi,n(s,a)&&e.ref===t.ref)return Ct(e,t,r)}return t.flags|=1,e=Wt(o,a),e.ref=t.ref,e.return=t,t.child=e}function Sb(e,t,n,a,r){if(e!==null){var o=e.memoizedProps;if(Mi(o,a)&&e.ref===t.ref)if(Se=!1,t.pendingProps=a=o,(e.lanes&r)!==0)e.flags&131072&&(Se=!0);else return t.lanes=e.lanes,Ct(e,t,r)}return Hw(e,t,n,a,r)}function Ib(e,t,n){var a=t.pendingProps,r=a.children,o=e!==null?e.memoizedState:null;if(a.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},E(Y1,ze),ze|=n;else{if(!(n&1073741824))return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,E(Y1,ze),ze|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},a=o!==null?o.baseLanes:n,E(Y1,ze),ze|=a}else o!==null?(a=o.baseLanes|n,t.memoizedState=null):a=n,E(Y1,ze),ze|=a;return ve(e,t,r,n),t.child}function jb(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Hw(e,t,n,a,r){var o=je(n)?P1:me.current;return o=ma(t,o),sa(t,r),n=RL(e,t,n,a,o,r),a=BL(),e!==null&&!Se?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Ct(e,t,r)):(W&&a&&IL(t),t.flags|=1,ve(e,t,n,r),t.child)}function mS(e,t,n,a,r){if(je(n)){var o=!0;vM(t)}else o=!1;if(sa(t,r),t.stateNode===null)vr(e,t),wb(t,n,a),zw(t,n,a,r),a=!0;else if(e===null){var s=t.stateNode,c=t.memoizedProps;s.props=c;var d=s.context,h=n.contextType;typeof h=="object"&&h!==null?h=We(h):(h=je(n)?P1:me.current,h=ma(t,h));var u=n.getDerivedStateFromProps,y=typeof u=="function"||typeof s.getSnapshotBeforeUpdate=="function";y||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==a||d!==h)&&hS(t,s,a,h),zt=!1;var k=t.memoizedState;s.state=k,SM(t,a,s,r),d=t.memoizedState,c!==a||k!==d||Ie.current||zt?(typeof u=="function"&&(Aw(t,n,u,a),d=t.memoizedState),(c=zt||dS(t,n,c,a,k,d,h))?(y||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=d),s.props=a,s.state=d,s.context=h,a=c):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{s=t.stateNode,tb(e,t),c=t.memoizedProps,h=t.type===t.elementType?c:Ke(t.type,c),s.props=h,y=t.pendingProps,k=s.context,d=n.contextType,typeof d=="object"&&d!==null?d=We(d):(d=je(n)?P1:me.current,d=ma(t,d));var g=n.getDerivedStateFromProps;(u=typeof g=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==y||k!==d)&&hS(t,s,a,d),zt=!1,k=t.memoizedState,s.state=k,SM(t,a,s,r);var v=t.memoizedState;c!==y||k!==v||Ie.current||zt?(typeof g=="function"&&(Aw(t,n,g,a),v=t.memoizedState),(h=zt||dS(t,n,h,a,k,v,d)||!1)?(u||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(a,v,d),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(a,v,d)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&k===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&k===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=v),s.props=a,s.state=v,s.context=d,a=h):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&k===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&k===e.memoizedState||(t.flags|=1024),a=!1)}return Tw(e,t,n,a,o,r)}function Tw(e,t,n,a,r,o){jb(e,t);var s=(t.flags&128)!==0;if(!a&&!s)return r&&nS(t,n,!1),Ct(e,t,o);a=t.stateNode,wV.current=t;var c=s&&typeof n.getDerivedStateFromError!="function"?null:a.render();return t.flags|=1,e!==null&&s?(t.child=xa(t,e.child,null,o),t.child=xa(t,null,c,o)):ve(e,t,c,o),t.memoizedState=a.state,r&&nS(t,n,!0),t.child}function bb(e){var t=e.stateNode;t.pendingContext?tS(e,t.pendingContext,t.pendingContext!==t.context):t.context&&tS(e,t.context,!1),TL(e,t.containerInfo)}function gS(e,t,n,a,r){return ga(),bL(r),t.flags|=256,ve(e,t,n,a),t.child}var qw={dehydrated:null,treeContext:null,retryLane:0};function Dw(e){return{baseLanes:e,cachePool:null,transitions:null}}function Pb(e,t,n){var a=t.pendingProps,r=G.current,o=!1,s=(t.flags&128)!==0,c;if((c=s)||(c=e!==null&&e.memoizedState===null?!1:(r&2)!==0),c?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(r|=1),E(G,r&1),e===null)return bw(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=a.children,e=a.fallback,o?(a=t.mode,o=t.child,s={mode:"hidden",children:s},!(a&1)&&o!==null?(o.childLanes=0,o.pendingProps=s):o=JM(s,a,0,null),e=v1(e,a,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=Dw(n),t.memoizedState=qw,e):OL(t,s));if(r=e.memoizedState,r!==null&&(c=r.dehydrated,c!==null))return LV(e,t,s,a,c,r,n);if(o){o=a.fallback,s=t.mode,r=e.child,c=r.sibling;var d={mode:"hidden",children:a.children};return!(s&1)&&t.child!==r?(a=t.child,a.childLanes=0,a.pendingProps=d,t.deletions=null):(a=Wt(r,d),a.subtreeFlags=r.subtreeFlags&14680064),c!==null?o=Wt(c,o):(o=v1(o,s,n,null),o.flags|=2),o.return=t,a.return=t,a.sibling=o,t.child=a,a=o,o=t.child,s=e.child.memoizedState,s=s===null?Dw(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},o.memoizedState=s,o.childLanes=e.childLanes&~n,t.memoizedState=qw,a}return o=e.child,e=o.sibling,a=Wt(o,{mode:"visible",children:a.children}),!(t.mode&1)&&(a.lanes=n),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a}function OL(e,t){return t=JM({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ar(e,t,n,a){return a!==null&&bL(a),xa(t,e.child,null,n),e=OL(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function LV(e,t,n,a,r,o,s){if(n)return t.flags&256?(t.flags&=-257,a=q9(Error(S(422))),ar(e,t,s,a)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=a.fallback,r=t.mode,a=JM({mode:"visible",children:a.children},r,0,null),o=v1(o,r,s,null),o.flags|=2,a.return=t,o.return=t,a.sibling=o,t.child=a,t.mode&1&&xa(t,e.child,null,s),t.child.memoizedState=Dw(s),t.memoizedState=qw,o);if(!(t.mode&1))return ar(e,t,s,null);if(r.data==="$!"){if(a=r.nextSibling&&r.nextSibling.dataset,a)var c=a.dgst;return a=c,o=Error(S(419)),a=q9(o,a,void 0),ar(e,t,s,a)}if(c=(s&e.childLanes)!==0,Se||c){if(a=ce,a!==null){switch(s&-s){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(a.suspendedLanes|s)?0:r,r!==0&&r!==o.retryLane&&(o.retryLane=r,Lt(e,r),et(a,e,r,-1))}return $L(),a=q9(Error(S(421))),ar(e,t,s,a)}return r.data==="$?"?(t.flags|=128,t.child=e.child,t=DV.bind(null,e),r._reactRetry=t,null):(e=o.treeContext,Ve=Ot(r.nextSibling),He=t,W=!0,Ye=null,e!==null&&(Ee[Oe++]=pt,Ee[Oe++]=kt,Ee[Oe++]=A1,pt=e.id,kt=e.overflow,A1=t),t=OL(t,a.children),t.flags|=4096,t)}function xS(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),Pw(e.return,t,n)}function D9(e,t,n,a,r){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:r}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=a,o.tail=n,o.tailMode=r)}function Ab(e,t,n){var a=t.pendingProps,r=a.revealOrder,o=a.tail;if(ve(e,t,a.children,n),a=G.current,a&2)a=a&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&xS(e,n,t);else if(e.tag===19)xS(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}a&=1}if(E(G,a),!(t.mode&1))t.memoizedState=null;else switch(r){case"forwards":for(n=t.child,r=null;n!==null;)e=n.alternate,e!==null&&IM(e)===null&&(r=n),n=n.sibling;n=r,n===null?(r=t.child,t.child=null):(r=n.sibling,n.sibling=null),D9(t,!1,r,n,o);break;case"backwards":for(n=null,r=t.child,t.child=null;r!==null;){if(e=r.alternate,e!==null&&IM(e)===null){t.child=r;break}e=r.sibling,r.sibling=n,n=r,r=e}D9(t,!0,n,null,o);break;case"together":D9(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function vr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ct(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),V1|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(S(153));if(t.child!==null){for(e=t.child,n=Wt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Wt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function CV(e,t,n){switch(t.tag){case 3:bb(t),ga();break;case 5:nb(t);break;case 1:je(t.type)&&vM(t);break;case 4:TL(t,t.stateNode.containerInfo);break;case 10:var a=t.type._context,r=t.memoizedProps.value;E(LM,a._currentValue),a._currentValue=r;break;case 13:if(a=t.memoizedState,a!==null)return a.dehydrated!==null?(E(G,G.current&1),t.flags|=128,null):n&t.child.childLanes?Pb(e,t,n):(E(G,G.current&1),e=Ct(e,t,n),e!==null?e.sibling:null);E(G,G.current&1);break;case 19:if(a=(n&t.childLanes)!==0,e.flags&128){if(a)return Ab(e,t,n);t.flags|=128}if(r=t.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),E(G,G.current),a)break;return null;case 22:case 23:return t.lanes=0,Ib(e,t,n)}return Ct(e,t,n)}var zb,Fw,Vb,Hb;zb=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Fw=function(){};Vb=function(e,t,n,a){var r=e.memoizedProps;if(r!==a){e=t.stateNode,m1(lt.current);var o=null;switch(n){case"input":r=rw(e,r),a=rw(e,a),o=[];break;case"select":r=K({},r,{value:void 0}),a=K({},a,{value:void 0}),o=[];break;case"textarea":r=cw(e,r),a=cw(e,a),o=[];break;default:typeof r.onClick!="function"&&typeof a.onClick=="function"&&(e.onclick=gM)}dw(n,a);var s;n=null;for(h in r)if(!a.hasOwnProperty(h)&&r.hasOwnProperty(h)&&r[h]!=null)if(h==="style"){var c=r[h];for(s in c)c.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(pi.hasOwnProperty(h)?o||(o=[]):(o=o||[]).push(h,null));for(h in a){var d=a[h];if(c=r!=null?r[h]:void 0,a.hasOwnProperty(h)&&d!==c&&(d!=null||c!=null))if(h==="style")if(c){for(s in c)!c.hasOwnProperty(s)||d&&d.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in d)d.hasOwnProperty(s)&&c[s]!==d[s]&&(n||(n={}),n[s]=d[s])}else n||(o||(o=[]),o.push(h,n)),n=d;else h==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,c=c?c.__html:void 0,d!=null&&c!==d&&(o=o||[]).push(h,d)):h==="children"?typeof d!="string"&&typeof d!="number"||(o=o||[]).push(h,""+d):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(pi.hasOwnProperty(h)?(d!=null&&h==="onScroll"&&U("scroll",e),o||c===d||(o=[])):(o=o||[]).push(h,d))}n&&(o=o||[]).push("style",n);var h=o;(t.updateQueue=h)&&(t.flags|=4)}};Hb=function(e,t,n,a){n!==a&&(t.flags|=4)};function Ta(e,t){if(!W)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function pe(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var r=e.child;r!==null;)n|=r.lanes|r.childLanes,a|=r.subtreeFlags&14680064,a|=r.flags&14680064,r.return=e,r=r.sibling;else for(r=e.child;r!==null;)n|=r.lanes|r.childLanes,a|=r.subtreeFlags,a|=r.flags,r.return=e,r=r.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function SV(e,t,n){var a=t.pendingProps;switch(jL(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return pe(t),null;case 1:return je(t.type)&&xM(),pe(t),null;case 3:return a=t.stateNode,va(),Z(Ie),Z(me),DL(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(tr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Ye!==null&&(_w(Ye),Ye=null))),Fw(e,t),pe(t),null;case 5:qL(t);var r=m1(Ii.current);if(n=t.type,e!==null&&t.stateNode!=null)Vb(e,t,n,a,r),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!a){if(t.stateNode===null)throw Error(S(166));return pe(t),null}if(e=m1(lt.current),tr(t)){a=t.stateNode,n=t.type;var o=t.memoizedProps;switch(a[st]=t,a[Ci]=o,e=(t.mode&1)!==0,n){case"dialog":U("cancel",a),U("close",a);break;case"iframe":case"object":case"embed":U("load",a);break;case"video":case"audio":for(r=0;r<Ea.length;r++)U(Ea[r],a);break;case"source":U("error",a);break;case"img":case"image":case"link":U("error",a),U("load",a);break;case"details":U("toggle",a);break;case"input":bC(a,o),U("invalid",a);break;case"select":a._wrapperState={wasMultiple:!!o.multiple},U("invalid",a);break;case"textarea":AC(a,o),U("invalid",a)}dw(n,o),r=null;for(var s in o)if(o.hasOwnProperty(s)){var c=o[s];s==="children"?typeof c=="string"?a.textContent!==c&&(o.suppressHydrationWarning!==!0&&er(a.textContent,c,e),r=["children",c]):typeof c=="number"&&a.textContent!==""+c&&(o.suppressHydrationWarning!==!0&&er(a.textContent,c,e),r=["children",""+c]):pi.hasOwnProperty(s)&&c!=null&&s==="onScroll"&&U("scroll",a)}switch(n){case"input":Wi(a),PC(a,o,!0);break;case"textarea":Wi(a),zC(a);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(a.onclick=gM)}a=r,t.updateQueue=a,a!==null&&(t.flags|=4)}else{s=r.nodeType===9?r:r.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=sj(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof a.is=="string"?e=s.createElement(n,{is:a.is}):(e=s.createElement(n),n==="select"&&(s=e,a.multiple?s.multiple=!0:a.size&&(s.size=a.size))):e=s.createElementNS(e,n),e[st]=t,e[Ci]=a,zb(e,t,!1,!1),t.stateNode=e;e:{switch(s=hw(n,a),n){case"dialog":U("cancel",e),U("close",e),r=a;break;case"iframe":case"object":case"embed":U("load",e),r=a;break;case"video":case"audio":for(r=0;r<Ea.length;r++)U(Ea[r],e);r=a;break;case"source":U("error",e),r=a;break;case"img":case"image":case"link":U("error",e),U("load",e),r=a;break;case"details":U("toggle",e),r=a;break;case"input":bC(e,a),r=rw(e,a),U("invalid",e);break;case"option":r=a;break;case"select":e._wrapperState={wasMultiple:!!a.multiple},r=K({},a,{value:void 0}),U("invalid",e);break;case"textarea":AC(e,a),r=cw(e,a),U("invalid",e);break;default:r=a}dw(n,r),c=r;for(o in c)if(c.hasOwnProperty(o)){var d=c[o];o==="style"?dj(e,d):o==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,d!=null&&cj(e,d)):o==="children"?typeof d=="string"?(n!=="textarea"||d!=="")&&ki(e,d):typeof d=="number"&&ki(e,""+d):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(pi.hasOwnProperty(o)?d!=null&&o==="onScroll"&&U("scroll",e):d!=null&&uL(e,o,d,s))}switch(n){case"input":Wi(e),PC(e,a,!1);break;case"textarea":Wi(e),zC(e);break;case"option":a.value!=null&&e.setAttribute("value",""+Kt(a.value));break;case"select":e.multiple=!!a.multiple,o=a.value,o!=null?aa(e,!!a.multiple,o,!1):a.defaultValue!=null&&aa(e,!!a.multiple,a.defaultValue,!0);break;default:typeof r.onClick=="function"&&(e.onclick=gM)}switch(n){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}}a&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return pe(t),null;case 6:if(e&&t.stateNode!=null)Hb(e,t,e.memoizedProps,a);else{if(typeof a!="string"&&t.stateNode===null)throw Error(S(166));if(n=m1(Ii.current),m1(lt.current),tr(t)){if(a=t.stateNode,n=t.memoizedProps,a[st]=t,(o=a.nodeValue!==n)&&(e=He,e!==null))switch(e.tag){case 3:er(a.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&er(a.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else a=(n.nodeType===9?n:n.ownerDocument).createTextNode(a),a[st]=t,t.stateNode=a}return pe(t),null;case 13:if(Z(G),a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(W&&Ve!==null&&t.mode&1&&!(t.flags&128))Qj(),ga(),t.flags|=98560,o=!1;else if(o=tr(t),a!==null&&a.dehydrated!==null){if(e===null){if(!o)throw Error(S(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(S(317));o[st]=t}else ga(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;pe(t),o=!1}else Ye!==null&&(_w(Ye),Ye=null),o=!0;if(!o)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(a=a!==null,a!==(e!==null&&e.memoizedState!==null)&&a&&(t.child.flags|=8192,t.mode&1&&(e===null||G.current&1?ie===0&&(ie=3):$L())),t.updateQueue!==null&&(t.flags|=4),pe(t),null);case 4:return va(),Fw(e,t),e===null&&wi(t.stateNode.containerInfo),pe(t),null;case 10:return zL(t.type._context),pe(t),null;case 17:return je(t.type)&&xM(),pe(t),null;case 19:if(Z(G),o=t.memoizedState,o===null)return pe(t),null;if(a=(t.flags&128)!==0,s=o.rendering,s===null)if(a)Ta(o,!1);else{if(ie!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=IM(e),s!==null){for(t.flags|=128,Ta(o,!1),a=s.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),t.subtreeFlags=0,a=n,n=t.child;n!==null;)o=n,e=a,o.flags&=14680066,s=o.alternate,s===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=s.childLanes,o.lanes=s.lanes,o.child=s.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=s.memoizedProps,o.memoizedState=s.memoizedState,o.updateQueue=s.updateQueue,o.type=s.type,e=s.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return E(G,G.current&1|2),t.child}e=e.sibling}o.tail!==null&&J()>wa&&(t.flags|=128,a=!0,Ta(o,!1),t.lanes=4194304)}else{if(!a)if(e=IM(s),e!==null){if(t.flags|=128,a=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Ta(o,!0),o.tail===null&&o.tailMode==="hidden"&&!s.alternate&&!W)return pe(t),null}else 2*J()-o.renderingStartTime>wa&&n!==1073741824&&(t.flags|=128,a=!0,Ta(o,!1),t.lanes=4194304);o.isBackwards?(s.sibling=t.child,t.child=s):(n=o.last,n!==null?n.sibling=s:t.child=s,o.last=s)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=J(),t.sibling=null,n=G.current,E(G,a?n&1|2:n&1),t):(pe(t),null);case 22:case 23:return GL(),a=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==a&&(t.flags|=8192),a&&t.mode&1?ze&1073741824&&(pe(t),t.subtreeFlags&6&&(t.flags|=8192)):pe(t),null;case 24:return null;case 25:return null}throw Error(S(156,t.tag))}function IV(e,t){switch(jL(t),t.tag){case 1:return je(t.type)&&xM(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return va(),Z(Ie),Z(me),DL(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return qL(t),null;case 13:if(Z(G),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(S(340));ga()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Z(G),null;case 4:return va(),null;case 10:return zL(t.type._context),null;case 22:case 23:return GL(),null;case 24:return null;default:return null}}var ir=!1,fe=!1,jV=typeof WeakSet=="function"?WeakSet:Set,A=null;function Q1(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(a){Q(e,t,a)}else n.current=null}function Rw(e,t,n){try{n()}catch(a){Q(e,t,a)}}var vS=!1;function bV(e,t){if(Mw=kM,e=Rj(),SL(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var r=a.anchorOffset,o=a.focusNode;a=a.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var s=0,c=-1,d=-1,h=0,u=0,y=e,k=null;t:for(;;){for(var g;y!==n||r!==0&&y.nodeType!==3||(c=s+r),y!==o||a!==0&&y.nodeType!==3||(d=s+a),y.nodeType===3&&(s+=y.nodeValue.length),(g=y.firstChild)!==null;)k=y,y=g;for(;;){if(y===e)break t;if(k===n&&++h===r&&(c=s),k===o&&++u===a&&(d=s),(g=y.nextSibling)!==null)break;y=k,k=y.parentNode}y=g}n=c===-1||d===-1?null:{start:c,end:d}}else n=null}n=n||{start:0,end:0}}else n=null;for(ww={focusedElem:e,selectionRange:n},kM=!1,A=t;A!==null;)if(t=A,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,A=e;else for(;A!==null;){t=A;try{var v=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var x=v.memoizedProps,L=v.memoizedState,m=t.stateNode,p=m.getSnapshotBeforeUpdate(t.elementType===t.type?x:Ke(t.type,x),L);m.__reactInternalSnapshotBeforeUpdate=p}break;case 3:var f=t.stateNode.containerInfo;f.nodeType===1?f.textContent="":f.nodeType===9&&f.documentElement&&f.removeChild(f.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(S(163))}}catch(M){Q(t,t.return,M)}if(e=t.sibling,e!==null){e.return=t.return,A=e;break}A=t.return}return v=vS,vS=!1,v}function Xa(e,t,n){var a=t.updateQueue;if(a=a!==null?a.lastEffect:null,a!==null){var r=a=a.next;do{if((r.tag&e)===e){var o=r.destroy;r.destroy=void 0,o!==void 0&&Rw(t,n,o)}r=r.next}while(r!==a)}}function QM(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var a=n.create;n.destroy=a()}n=n.next}while(n!==t)}}function Bw(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Tb(e){var t=e.alternate;t!==null&&(e.alternate=null,Tb(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[st],delete t[Ci],delete t[Sw],delete t[dV],delete t[hV])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function qb(e){return e.tag===5||e.tag===3||e.tag===4}function MS(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||qb(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Nw(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=gM));else if(a!==4&&(e=e.child,e!==null))for(Nw(e,t,n),e=e.sibling;e!==null;)Nw(e,t,n),e=e.sibling}function Ew(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(e=e.child,e!==null))for(Ew(e,t,n),e=e.sibling;e!==null;)Ew(e,t,n),e=e.sibling}var de=null,Qe=!1;function bt(e,t,n){for(n=n.child;n!==null;)Db(e,t,n),n=n.sibling}function Db(e,t,n){if(ct&&typeof ct.onCommitFiberUnmount=="function")try{ct.onCommitFiberUnmount(UM,n)}catch{}switch(n.tag){case 5:fe||Q1(n,t);case 6:var a=de,r=Qe;de=null,bt(e,t,n),de=a,Qe=r,de!==null&&(Qe?(e=de,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):de.removeChild(n.stateNode));break;case 18:de!==null&&(Qe?(e=de,n=n.stateNode,e.nodeType===8?P9(e.parentNode,n):e.nodeType===1&&P9(e,n),xi(e)):P9(de,n.stateNode));break;case 4:a=de,r=Qe,de=n.stateNode.containerInfo,Qe=!0,bt(e,t,n),de=a,Qe=r;break;case 0:case 11:case 14:case 15:if(!fe&&(a=n.updateQueue,a!==null&&(a=a.lastEffect,a!==null))){r=a=a.next;do{var o=r,s=o.destroy;o=o.tag,s!==void 0&&(o&2||o&4)&&Rw(n,t,s),r=r.next}while(r!==a)}bt(e,t,n);break;case 1:if(!fe&&(Q1(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"))try{a.props=n.memoizedProps,a.state=n.memoizedState,a.componentWillUnmount()}catch(c){Q(n,t,c)}bt(e,t,n);break;case 21:bt(e,t,n);break;case 22:n.mode&1?(fe=(a=fe)||n.memoizedState!==null,bt(e,t,n),fe=a):bt(e,t,n);break;default:bt(e,t,n)}}function wS(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new jV),t.forEach(function(a){var r=FV.bind(null,e,a);n.has(a)||(n.add(a),a.then(r,r))})}}function $e(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var r=n[a];try{var o=e,s=t,c=s;e:for(;c!==null;){switch(c.tag){case 5:de=c.stateNode,Qe=!1;break e;case 3:de=c.stateNode.containerInfo,Qe=!0;break e;case 4:de=c.stateNode.containerInfo,Qe=!0;break e}c=c.return}if(de===null)throw Error(S(160));Db(o,s,r),de=null,Qe=!1;var d=r.alternate;d!==null&&(d.return=null),r.return=null}catch(h){Q(r,t,h)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Fb(t,e),t=t.sibling}function Fb(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if($e(t,e),it(e),a&4){try{Xa(3,e,e.return),QM(3,e)}catch(x){Q(e,e.return,x)}try{Xa(5,e,e.return)}catch(x){Q(e,e.return,x)}}break;case 1:$e(t,e),it(e),a&512&&n!==null&&Q1(n,n.return);break;case 5:if($e(t,e),it(e),a&512&&n!==null&&Q1(n,n.return),e.flags&32){var r=e.stateNode;try{ki(r,"")}catch(x){Q(e,e.return,x)}}if(a&4&&(r=e.stateNode,r!=null)){var o=e.memoizedProps,s=n!==null?n.memoizedProps:o,c=e.type,d=e.updateQueue;if(e.updateQueue=null,d!==null)try{c==="input"&&o.type==="radio"&&o.name!=null&&rj(r,o),hw(c,s);var h=hw(c,o);for(s=0;s<d.length;s+=2){var u=d[s],y=d[s+1];u==="style"?dj(r,y):u==="dangerouslySetInnerHTML"?cj(r,y):u==="children"?ki(r,y):uL(r,u,y,h)}switch(c){case"input":ow(r,o);break;case"textarea":oj(r,o);break;case"select":var k=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!o.multiple;var g=o.value;g!=null?aa(r,!!o.multiple,g,!1):k!==!!o.multiple&&(o.defaultValue!=null?aa(r,!!o.multiple,o.defaultValue,!0):aa(r,!!o.multiple,o.multiple?[]:"",!1))}r[Ci]=o}catch(x){Q(e,e.return,x)}}break;case 6:if($e(t,e),it(e),a&4){if(e.stateNode===null)throw Error(S(162));r=e.stateNode,o=e.memoizedProps;try{r.nodeValue=o}catch(x){Q(e,e.return,x)}}break;case 3:if($e(t,e),it(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{xi(t.containerInfo)}catch(x){Q(e,e.return,x)}break;case 4:$e(t,e),it(e);break;case 13:$e(t,e),it(e),r=e.child,r.flags&8192&&(o=r.memoizedState!==null,r.stateNode.isHidden=o,!o||r.alternate!==null&&r.alternate.memoizedState!==null||(_L=J())),a&4&&wS(e);break;case 22:if(u=n!==null&&n.memoizedState!==null,e.mode&1?(fe=(h=fe)||u,$e(t,e),fe=h):$e(t,e),it(e),a&8192){if(h=e.memoizedState!==null,(e.stateNode.isHidden=h)&&!u&&e.mode&1)for(A=e,u=e.child;u!==null;){for(y=A=u;A!==null;){switch(k=A,g=k.child,k.tag){case 0:case 11:case 14:case 15:Xa(4,k,k.return);break;case 1:Q1(k,k.return);var v=k.stateNode;if(typeof v.componentWillUnmount=="function"){a=k,n=k.return;try{t=a,v.props=t.memoizedProps,v.state=t.memoizedState,v.componentWillUnmount()}catch(x){Q(a,n,x)}}break;case 5:Q1(k,k.return);break;case 22:if(k.memoizedState!==null){CS(y);continue}}g!==null?(g.return=k,A=g):CS(y)}u=u.sibling}e:for(u=null,y=e;;){if(y.tag===5){if(u===null){u=y;try{r=y.stateNode,h?(o=r.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(c=y.stateNode,d=y.memoizedProps.style,s=d!=null&&d.hasOwnProperty("display")?d.display:null,c.style.display=lj("display",s))}catch(x){Q(e,e.return,x)}}}else if(y.tag===6){if(u===null)try{y.stateNode.nodeValue=h?"":y.memoizedProps}catch(x){Q(e,e.return,x)}}else if((y.tag!==22&&y.tag!==23||y.memoizedState===null||y===e)&&y.child!==null){y.child.return=y,y=y.child;continue}if(y===e)break e;for(;y.sibling===null;){if(y.return===null||y.return===e)break e;u===y&&(u=null),y=y.return}u===y&&(u=null),y.sibling.return=y.return,y=y.sibling}}break;case 19:$e(t,e),it(e),a&4&&wS(e);break;case 21:break;default:$e(t,e),it(e)}}function it(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(qb(n)){var a=n;break e}n=n.return}throw Error(S(160))}switch(a.tag){case 5:var r=a.stateNode;a.flags&32&&(ki(r,""),a.flags&=-33);var o=MS(e);Ew(e,o,r);break;case 3:case 4:var s=a.stateNode.containerInfo,c=MS(e);Nw(e,c,s);break;default:throw Error(S(161))}}catch(d){Q(e,e.return,d)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function PV(e,t,n){A=e,Rb(e)}function Rb(e,t,n){for(var a=(e.mode&1)!==0;A!==null;){var r=A,o=r.child;if(r.tag===22&&a){var s=r.memoizedState!==null||ir;if(!s){var c=r.alternate,d=c!==null&&c.memoizedState!==null||fe;c=ir;var h=fe;if(ir=s,(fe=d)&&!h)for(A=r;A!==null;)s=A,d=s.child,s.tag===22&&s.memoizedState!==null?SS(r):d!==null?(d.return=s,A=d):SS(r);for(;o!==null;)A=o,Rb(o),o=o.sibling;A=r,ir=c,fe=h}LS(e)}else r.subtreeFlags&8772&&o!==null?(o.return=r,A=o):LS(e)}}function LS(e){for(;A!==null;){var t=A;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:fe||QM(5,t);break;case 1:var a=t.stateNode;if(t.flags&4&&!fe)if(n===null)a.componentDidMount();else{var r=t.elementType===t.type?n.memoizedProps:Ke(t.type,n.memoizedProps);a.componentDidUpdate(r,n.memoizedState,a.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&sS(t,o,a);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}sS(t,s,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var d=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":d.autoFocus&&n.focus();break;case"img":d.src&&(n.src=d.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var h=t.alternate;if(h!==null){var u=h.memoizedState;if(u!==null){var y=u.dehydrated;y!==null&&xi(y)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(S(163))}fe||t.flags&512&&Bw(t)}catch(k){Q(t,t.return,k)}}if(t===e){A=null;break}if(n=t.sibling,n!==null){n.return=t.return,A=n;break}A=t.return}}function CS(e){for(;A!==null;){var t=A;if(t===e){A=null;break}var n=t.sibling;if(n!==null){n.return=t.return,A=n;break}A=t.return}}function SS(e){for(;A!==null;){var t=A;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{QM(4,t)}catch(d){Q(t,n,d)}break;case 1:var a=t.stateNode;if(typeof a.componentDidMount=="function"){var r=t.return;try{a.componentDidMount()}catch(d){Q(t,r,d)}}var o=t.return;try{Bw(t)}catch(d){Q(t,o,d)}break;case 5:var s=t.return;try{Bw(t)}catch(d){Q(t,s,d)}}}catch(d){Q(t,t.return,d)}if(t===e){A=null;break}var c=t.sibling;if(c!==null){c.return=t.return,A=c;break}A=t.return}}var AV=Math.ceil,PM=It.ReactCurrentDispatcher,UL=It.ReactCurrentOwner,_e=It.ReactCurrentBatchConfig,B=0,ce=null,ne=null,he=0,ze=0,Y1=tn(0),ie=0,Ai=null,V1=0,YM=0,ZL=0,Ka=null,Ce=null,_L=0,wa=1/0,ut=null,AM=!1,Ow=null,Zt=null,rr=!1,Ft=null,zM=0,Qa=0,Uw=null,Mr=-1,wr=0;function Me(){return B&6?J():Mr!==-1?Mr:Mr=J()}function _t(e){return e.mode&1?B&2&&he!==0?he&-he:yV.transition!==null?(wr===0&&(wr=wj()),wr):(e=N,e!==0||(e=window.event,e=e===void 0?16:Pj(e.type)),e):1}function et(e,t,n,a){if(50<Qa)throw Qa=0,Uw=null,Error(S(185));qi(e,n,a),(!(B&2)||e!==ce)&&(e===ce&&(!(B&2)&&(YM|=n),ie===4&&qt(e,he)),be(e,a),n===1&&B===0&&!(t.mode&1)&&(wa=J()+500,$M&&nn()))}function be(e,t){var n=e.callbackNode;yz(e,t);var a=pM(e,e===ce?he:0);if(a===0)n!==null&&TC(n),e.callbackNode=null,e.callbackPriority=0;else if(t=a&-a,e.callbackPriority!==t){if(n!=null&&TC(n),t===1)e.tag===0?uV(IS.bind(null,e)):$j(IS.bind(null,e)),cV(function(){!(B&6)&&nn()}),n=null;else{switch(Lj(a)){case 1:n=mL;break;case 4:n=vj;break;case 16:n=yM;break;case 536870912:n=Mj;break;default:n=yM}n=Wb(n,Bb.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Bb(e,t){if(Mr=-1,wr=0,B&6)throw Error(S(327));var n=e.callbackNode;if(ca()&&e.callbackNode!==n)return null;var a=pM(e,e===ce?he:0);if(a===0)return null;if(a&30||a&e.expiredLanes||t)t=VM(e,a);else{t=a;var r=B;B|=2;var o=Eb();(ce!==e||he!==t)&&(ut=null,wa=J()+500,x1(e,t));do try{HV();break}catch(c){Nb(e,c)}while(!0);AL(),PM.current=o,B=r,ne!==null?t=0:(ce=null,he=0,t=ie)}if(t!==0){if(t===2&&(r=fw(e),r!==0&&(a=r,t=Zw(e,r))),t===1)throw n=Ai,x1(e,0),qt(e,a),be(e,J()),n;if(t===6)qt(e,a);else{if(r=e.current.alternate,!(a&30)&&!zV(r)&&(t=VM(e,a),t===2&&(o=fw(e),o!==0&&(a=o,t=Zw(e,o))),t===1))throw n=Ai,x1(e,0),qt(e,a),be(e,J()),n;switch(e.finishedWork=r,e.finishedLanes=a,t){case 0:case 1:throw Error(S(345));case 2:dn(e,Ce,ut);break;case 3:if(qt(e,a),(a&130023424)===a&&(t=_L+500-J(),10<t)){if(pM(e,0)!==0)break;if(r=e.suspendedLanes,(r&a)!==a){Me(),e.pingedLanes|=e.suspendedLanes&r;break}e.timeoutHandle=Cw(dn.bind(null,e,Ce,ut),t);break}dn(e,Ce,ut);break;case 4:if(qt(e,a),(a&4194240)===a)break;for(t=e.eventTimes,r=-1;0<a;){var s=31-Je(a);o=1<<s,s=t[s],s>r&&(r=s),a&=~o}if(a=r,a=J()-a,a=(120>a?120:480>a?480:1080>a?1080:1920>a?1920:3e3>a?3e3:4320>a?4320:1960*AV(a/1960))-a,10<a){e.timeoutHandle=Cw(dn.bind(null,e,Ce,ut),a);break}dn(e,Ce,ut);break;case 5:dn(e,Ce,ut);break;default:throw Error(S(329))}}}return be(e,J()),e.callbackNode===n?Bb.bind(null,e):null}function Zw(e,t){var n=Ka;return e.current.memoizedState.isDehydrated&&(x1(e,t).flags|=256),e=VM(e,t),e!==2&&(t=Ce,Ce=n,t!==null&&_w(t)),e}function _w(e){Ce===null?Ce=e:Ce.push.apply(Ce,e)}function zV(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var a=0;a<n.length;a++){var r=n[a],o=r.getSnapshot;r=r.value;try{if(!nt(o(),r))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function qt(e,t){for(t&=~ZL,t&=~YM,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Je(t),a=1<<n;e[n]=-1,t&=~a}}function IS(e){if(B&6)throw Error(S(327));ca();var t=pM(e,0);if(!(t&1))return be(e,J()),null;var n=VM(e,t);if(e.tag!==0&&n===2){var a=fw(e);a!==0&&(t=a,n=Zw(e,a))}if(n===1)throw n=Ai,x1(e,0),qt(e,t),be(e,J()),n;if(n===6)throw Error(S(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,dn(e,Ce,ut),be(e,J()),null}function WL(e,t){var n=B;B|=1;try{return e(t)}finally{B=n,B===0&&(wa=J()+500,$M&&nn())}}function H1(e){Ft!==null&&Ft.tag===0&&!(B&6)&&ca();var t=B;B|=1;var n=_e.transition,a=N;try{if(_e.transition=null,N=1,e)return e()}finally{N=a,_e.transition=n,B=t,!(B&6)&&nn()}}function GL(){ze=Y1.current,Z(Y1)}function x1(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,sV(n)),ne!==null)for(n=ne.return;n!==null;){var a=n;switch(jL(a),a.tag){case 1:a=a.type.childContextTypes,a!=null&&xM();break;case 3:va(),Z(Ie),Z(me),DL();break;case 5:qL(a);break;case 4:va();break;case 13:Z(G);break;case 19:Z(G);break;case 10:zL(a.type._context);break;case 22:case 23:GL()}n=n.return}if(ce=e,ne=e=Wt(e.current,null),he=ze=t,ie=0,Ai=null,ZL=YM=V1=0,Ce=Ka=null,f1!==null){for(t=0;t<f1.length;t++)if(n=f1[t],a=n.interleaved,a!==null){n.interleaved=null;var r=a.next,o=n.pending;if(o!==null){var s=o.next;o.next=r,a.next=s}n.pending=a}f1=null}return e}function Nb(e,t){do{var n=ne;try{if(AL(),gr.current=bM,jM){for(var a=X.memoizedState;a!==null;){var r=a.queue;r!==null&&(r.pending=null),a=a.next}jM=!1}if(z1=0,se=ae=X=null,$a=!1,ji=0,UL.current=null,n===null||n.return===null){ie=1,Ai=t,ne=null;break}e:{var o=e,s=n.return,c=n,d=t;if(t=he,c.flags|=32768,d!==null&&typeof d=="object"&&typeof d.then=="function"){var h=d,u=c,y=u.tag;if(!(u.mode&1)&&(y===0||y===11||y===15)){var k=u.alternate;k?(u.updateQueue=k.updateQueue,u.memoizedState=k.memoizedState,u.lanes=k.lanes):(u.updateQueue=null,u.memoizedState=null)}var g=yS(s);if(g!==null){g.flags&=-257,pS(g,s,c,o,t),g.mode&1&&uS(o,h,t),t=g,d=h;var v=t.updateQueue;if(v===null){var x=new Set;x.add(d),t.updateQueue=x}else v.add(d);break e}else{if(!(t&1)){uS(o,h,t),$L();break e}d=Error(S(426))}}else if(W&&c.mode&1){var L=yS(s);if(L!==null){!(L.flags&65536)&&(L.flags|=256),pS(L,s,c,o,t),bL(Ma(d,c));break e}}o=d=Ma(d,c),ie!==4&&(ie=2),Ka===null?Ka=[o]:Ka.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var m=Lb(o,d,t);oS(o,m);break e;case 1:c=d;var p=o.type,f=o.stateNode;if(!(o.flags&128)&&(typeof p.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(Zt===null||!Zt.has(f)))){o.flags|=65536,t&=-t,o.lanes|=t;var M=Cb(o,c,t);oS(o,M);break e}}o=o.return}while(o!==null)}Ub(n)}catch(w){t=w,ne===n&&n!==null&&(ne=n=n.return);continue}break}while(!0)}function Eb(){var e=PM.current;return PM.current=bM,e===null?bM:e}function $L(){(ie===0||ie===3||ie===2)&&(ie=4),ce===null||!(V1&268435455)&&!(YM&268435455)||qt(ce,he)}function VM(e,t){var n=B;B|=2;var a=Eb();(ce!==e||he!==t)&&(ut=null,x1(e,t));do try{VV();break}catch(r){Nb(e,r)}while(!0);if(AL(),B=n,PM.current=a,ne!==null)throw Error(S(261));return ce=null,he=0,ie}function VV(){for(;ne!==null;)Ob(ne)}function HV(){for(;ne!==null&&!iz();)Ob(ne)}function Ob(e){var t=_b(e.alternate,e,ze);e.memoizedProps=e.pendingProps,t===null?Ub(e):ne=t,UL.current=null}function Ub(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=IV(n,t),n!==null){n.flags&=32767,ne=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{ie=6,ne=null;return}}else if(n=SV(n,t,ze),n!==null){ne=n;return}if(t=t.sibling,t!==null){ne=t;return}ne=t=e}while(t!==null);ie===0&&(ie=5)}function dn(e,t,n){var a=N,r=_e.transition;try{_e.transition=null,N=1,TV(e,t,n,a)}finally{_e.transition=r,N=a}return null}function TV(e,t,n,a){do ca();while(Ft!==null);if(B&6)throw Error(S(327));n=e.finishedWork;var r=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(S(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(pz(e,o),e===ce&&(ne=ce=null,he=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||rr||(rr=!0,Wb(yM,function(){return ca(),null})),o=(n.flags&15990)!==0,n.subtreeFlags&15990||o){o=_e.transition,_e.transition=null;var s=N;N=1;var c=B;B|=4,UL.current=null,bV(e,n),Fb(n,e),eV(ww),kM=!!Mw,ww=Mw=null,e.current=n,PV(n),rz(),B=c,N=s,_e.transition=o}else e.current=n;if(rr&&(rr=!1,Ft=e,zM=r),o=e.pendingLanes,o===0&&(Zt=null),cz(n.stateNode),be(e,J()),t!==null)for(a=e.onRecoverableError,n=0;n<t.length;n++)r=t[n],a(r.value,{componentStack:r.stack,digest:r.digest});if(AM)throw AM=!1,e=Ow,Ow=null,e;return zM&1&&e.tag!==0&&ca(),o=e.pendingLanes,o&1?e===Uw?Qa++:(Qa=0,Uw=e):Qa=0,nn(),null}function ca(){if(Ft!==null){var e=Lj(zM),t=_e.transition,n=N;try{if(_e.transition=null,N=16>e?16:e,Ft===null)var a=!1;else{if(e=Ft,Ft=null,zM=0,B&6)throw Error(S(331));var r=B;for(B|=4,A=e.current;A!==null;){var o=A,s=o.child;if(A.flags&16){var c=o.deletions;if(c!==null){for(var d=0;d<c.length;d++){var h=c[d];for(A=h;A!==null;){var u=A;switch(u.tag){case 0:case 11:case 15:Xa(8,u,o)}var y=u.child;if(y!==null)y.return=u,A=y;else for(;A!==null;){u=A;var k=u.sibling,g=u.return;if(Tb(u),u===h){A=null;break}if(k!==null){k.return=g,A=k;break}A=g}}}var v=o.alternate;if(v!==null){var x=v.child;if(x!==null){v.child=null;do{var L=x.sibling;x.sibling=null,x=L}while(x!==null)}}A=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,A=s;else e:for(;A!==null;){if(o=A,o.flags&2048)switch(o.tag){case 0:case 11:case 15:Xa(9,o,o.return)}var m=o.sibling;if(m!==null){m.return=o.return,A=m;break e}A=o.return}}var p=e.current;for(A=p;A!==null;){s=A;var f=s.child;if(s.subtreeFlags&2064&&f!==null)f.return=s,A=f;else e:for(s=p;A!==null;){if(c=A,c.flags&2048)try{switch(c.tag){case 0:case 11:case 15:QM(9,c)}}catch(w){Q(c,c.return,w)}if(c===s){A=null;break e}var M=c.sibling;if(M!==null){M.return=c.return,A=M;break e}A=c.return}}if(B=r,nn(),ct&&typeof ct.onPostCommitFiberRoot=="function")try{ct.onPostCommitFiberRoot(UM,e)}catch{}a=!0}return a}finally{N=n,_e.transition=t}}return!1}function jS(e,t,n){t=Ma(n,t),t=Lb(e,t,1),e=Ut(e,t,1),t=Me(),e!==null&&(qi(e,1,t),be(e,t))}function Q(e,t,n){if(e.tag===3)jS(e,e,n);else for(;t!==null;){if(t.tag===3){jS(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(Zt===null||!Zt.has(a))){e=Ma(n,e),e=Cb(t,e,1),t=Ut(t,e,1),e=Me(),t!==null&&(qi(t,1,e),be(t,e));break}}t=t.return}}function qV(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),t=Me(),e.pingedLanes|=e.suspendedLanes&n,ce===e&&(he&n)===n&&(ie===4||ie===3&&(he&130023424)===he&&500>J()-_L?x1(e,0):ZL|=n),be(e,t)}function Zb(e,t){t===0&&(e.mode&1?(t=Xi,Xi<<=1,!(Xi&130023424)&&(Xi=4194304)):t=1);var n=Me();e=Lt(e,t),e!==null&&(qi(e,t,n),be(e,n))}function DV(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Zb(e,n)}function FV(e,t){var n=0;switch(e.tag){case 13:var a=e.stateNode,r=e.memoizedState;r!==null&&(n=r.retryLane);break;case 19:a=e.stateNode;break;default:throw Error(S(314))}a!==null&&a.delete(t),Zb(e,n)}var _b;_b=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Ie.current)Se=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return Se=!1,CV(e,t,n);Se=!!(e.flags&131072)}else Se=!1,W&&t.flags&1048576&&Xj(t,wM,t.index);switch(t.lanes=0,t.tag){case 2:var a=t.type;vr(e,t),e=t.pendingProps;var r=ma(t,me.current);sa(t,n),r=RL(null,t,a,e,r,n);var o=BL();return t.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,je(a)?(o=!0,vM(t)):o=!1,t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,HL(t),r.updater=KM,t.stateNode=r,r._reactInternals=t,zw(t,a,e,n),t=Tw(null,t,a,!0,o,n)):(t.tag=0,W&&o&&IL(t),ve(null,t,r,n),t=t.child),t;case 16:a=t.elementType;e:{switch(vr(e,t),e=t.pendingProps,r=a._init,a=r(a._payload),t.type=a,r=t.tag=BV(a),e=Ke(a,e),r){case 0:t=Hw(null,t,a,e,n);break e;case 1:t=mS(null,t,a,e,n);break e;case 11:t=kS(null,t,a,e,n);break e;case 14:t=fS(null,t,a,Ke(a.type,e),n);break e}throw Error(S(306,a,""))}return t;case 0:return a=t.type,r=t.pendingProps,r=t.elementType===a?r:Ke(a,r),Hw(e,t,a,r,n);case 1:return a=t.type,r=t.pendingProps,r=t.elementType===a?r:Ke(a,r),mS(e,t,a,r,n);case 3:e:{if(bb(t),e===null)throw Error(S(387));a=t.pendingProps,o=t.memoizedState,r=o.element,tb(e,t),SM(t,a,null,n);var s=t.memoizedState;if(a=s.element,o.isDehydrated)if(o={element:a,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){r=Ma(Error(S(423)),t),t=gS(e,t,a,n,r);break e}else if(a!==r){r=Ma(Error(S(424)),t),t=gS(e,t,a,n,r);break e}else for(Ve=Ot(t.stateNode.containerInfo.firstChild),He=t,W=!0,Ye=null,n=Jj(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(ga(),a===r){t=Ct(e,t,n);break e}ve(e,t,a,n)}t=t.child}return t;case 5:return nb(t),e===null&&bw(t),a=t.type,r=t.pendingProps,o=e!==null?e.memoizedProps:null,s=r.children,Lw(a,r)?s=null:o!==null&&Lw(a,o)&&(t.flags|=32),jb(e,t),ve(e,t,s,n),t.child;case 6:return e===null&&bw(t),null;case 13:return Pb(e,t,n);case 4:return TL(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=xa(t,null,a,n):ve(e,t,a,n),t.child;case 11:return a=t.type,r=t.pendingProps,r=t.elementType===a?r:Ke(a,r),kS(e,t,a,r,n);case 7:return ve(e,t,t.pendingProps,n),t.child;case 8:return ve(e,t,t.pendingProps.children,n),t.child;case 12:return ve(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(a=t.type._context,r=t.pendingProps,o=t.memoizedProps,s=r.value,E(LM,a._currentValue),a._currentValue=s,o!==null)if(nt(o.value,s)){if(o.children===r.children&&!Ie.current){t=Ct(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var c=o.dependencies;if(c!==null){s=o.child;for(var d=c.firstContext;d!==null;){if(d.context===a){if(o.tag===1){d=mt(-1,n&-n),d.tag=2;var h=o.updateQueue;if(h!==null){h=h.shared;var u=h.pending;u===null?d.next=d:(d.next=u.next,u.next=d),h.pending=d}}o.lanes|=n,d=o.alternate,d!==null&&(d.lanes|=n),Pw(o.return,n,t),c.lanes|=n;break}d=d.next}}else if(o.tag===10)s=o.type===t.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(S(341));s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),Pw(s,n,t),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===t){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}ve(e,t,r.children,n),t=t.child}return t;case 9:return r=t.type,a=t.pendingProps.children,sa(t,n),r=We(r),a=a(r),t.flags|=1,ve(e,t,a,n),t.child;case 14:return a=t.type,r=Ke(a,t.pendingProps),r=Ke(a.type,r),fS(e,t,a,r,n);case 15:return Sb(e,t,t.type,t.pendingProps,n);case 17:return a=t.type,r=t.pendingProps,r=t.elementType===a?r:Ke(a,r),vr(e,t),t.tag=1,je(a)?(e=!0,vM(t)):e=!1,sa(t,n),wb(t,a,r),zw(t,a,r,n),Tw(null,t,a,!0,e,n);case 19:return Ab(e,t,n);case 22:return Ib(e,t,n)}throw Error(S(156,t.tag))};function Wb(e,t){return xj(e,t)}function RV(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ue(e,t,n,a){return new RV(e,t,n,a)}function XL(e){return e=e.prototype,!(!e||!e.isReactComponent)}function BV(e){if(typeof e=="function")return XL(e)?1:0;if(e!=null){if(e=e.$$typeof,e===pL)return 11;if(e===kL)return 14}return 2}function Wt(e,t){var n=e.alternate;return n===null?(n=Ue(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Lr(e,t,n,a,r,o){var s=2;if(a=e,typeof e=="function")XL(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case O1:return v1(n.children,r,o,t);case yL:s=8,r|=8;break;case tw:return e=Ue(12,n,t,r|2),e.elementType=tw,e.lanes=o,e;case nw:return e=Ue(13,n,t,r),e.elementType=nw,e.lanes=o,e;case aw:return e=Ue(19,n,t,r),e.elementType=aw,e.lanes=o,e;case nj:return JM(n,r,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ej:s=10;break e;case tj:s=9;break e;case pL:s=11;break e;case kL:s=14;break e;case At:s=16,a=null;break e}throw Error(S(130,e==null?e:typeof e,""))}return t=Ue(s,n,t,r),t.elementType=e,t.type=a,t.lanes=o,t}function v1(e,t,n,a){return e=Ue(7,e,a,t),e.lanes=n,e}function JM(e,t,n,a){return e=Ue(22,e,a,t),e.elementType=nj,e.lanes=n,e.stateNode={isHidden:!1},e}function F9(e,t,n){return e=Ue(6,e,null,t),e.lanes=n,e}function R9(e,t,n){return t=Ue(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function NV(e,t,n,a,r){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=g9(0),this.expirationTimes=g9(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=g9(0),this.identifierPrefix=a,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function KL(e,t,n,a,r,o,s,c,d){return e=new NV(e,t,n,c,d),t===1?(t=1,o===!0&&(t|=8)):t=0,o=Ue(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:a,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},HL(o),e}function EV(e,t,n){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:E1,key:a==null?null:""+a,children:e,containerInfo:t,implementation:n}}function Gb(e){if(!e)return Qt;e=e._reactInternals;e:{if(D1(e)!==e||e.tag!==1)throw Error(S(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(je(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(S(171))}if(e.tag===1){var n=e.type;if(je(n))return Gj(e,n,t)}return t}function $b(e,t,n,a,r,o,s,c,d){return e=KL(n,a,!0,e,r,o,s,c,d),e.context=Gb(null),n=e.current,a=Me(),r=_t(n),o=mt(a,r),o.callback=t??null,Ut(n,o,r),e.current.lanes=r,qi(e,r,a),be(e,a),e}function e9(e,t,n,a){var r=t.current,o=Me(),s=_t(r);return n=Gb(n),t.context===null?t.context=n:t.pendingContext=n,t=mt(o,s),t.payload={element:e},a=a===void 0?null:a,a!==null&&(t.callback=a),e=Ut(r,t,s),e!==null&&(et(e,r,s,o),mr(e,r,s)),s}function HM(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function bS(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function QL(e,t){bS(e,t),(e=e.alternate)&&bS(e,t)}function OV(){return null}var Xb=typeof reportError=="function"?reportError:function(e){console.error(e)};function YL(e){this._internalRoot=e}t9.prototype.render=YL.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(S(409));e9(e,t,null,null)};t9.prototype.unmount=YL.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;H1(function(){e9(null,e,null,null)}),t[wt]=null}};function t9(e){this._internalRoot=e}t9.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ij();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Tt.length&&t!==0&&t<Tt[n].priority;n++);Tt.splice(n,0,e),n===0&&bj(e)}};function JL(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function n9(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function PS(){}function UV(e,t,n,a,r){if(r){if(typeof a=="function"){var o=a;a=function(){var h=HM(s);o.call(h)}}var s=$b(t,a,e,0,null,!1,!1,"",PS);return e._reactRootContainer=s,e[wt]=s.current,wi(e.nodeType===8?e.parentNode:e),H1(),s}for(;r=e.lastChild;)e.removeChild(r);if(typeof a=="function"){var c=a;a=function(){var h=HM(d);c.call(h)}}var d=KL(e,0,!1,null,null,!1,!1,"",PS);return e._reactRootContainer=d,e[wt]=d.current,wi(e.nodeType===8?e.parentNode:e),H1(function(){e9(t,d,n,a)}),d}function a9(e,t,n,a,r){var o=n._reactRootContainer;if(o){var s=o;if(typeof r=="function"){var c=r;r=function(){var d=HM(s);c.call(d)}}e9(t,s,e,r)}else s=UV(n,t,e,r,a);return HM(s)}Cj=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Na(t.pendingLanes);n!==0&&(gL(t,n|1),be(t,J()),!(B&6)&&(wa=J()+500,nn()))}break;case 13:H1(function(){var a=Lt(e,1);if(a!==null){var r=Me();et(a,e,1,r)}}),QL(e,1)}};xL=function(e){if(e.tag===13){var t=Lt(e,134217728);if(t!==null){var n=Me();et(t,e,134217728,n)}QL(e,134217728)}};Sj=function(e){if(e.tag===13){var t=_t(e),n=Lt(e,t);if(n!==null){var a=Me();et(n,e,t,a)}QL(e,t)}};Ij=function(){return N};jj=function(e,t){var n=N;try{return N=e,t()}finally{N=n}};yw=function(e,t,n){switch(t){case"input":if(ow(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var r=GM(a);if(!r)throw Error(S(90));ij(a),ow(a,r)}}}break;case"textarea":oj(e,n);break;case"select":t=n.value,t!=null&&aa(e,!!n.multiple,t,!1)}};yj=WL;pj=H1;var ZV={usingClientEntryPoint:!1,Events:[Fi,W1,GM,hj,uj,WL]},qa={findFiberByHostInstance:k1,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},_V={bundleType:qa.bundleType,version:qa.version,rendererPackageName:qa.rendererPackageName,rendererConfig:qa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:It.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=mj(e),e===null?null:e.stateNode},findFiberByHostInstance:qa.findFiberByHostInstance||OV,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var or=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!or.isDisabled&&or.supportsFiber)try{UM=or.inject(_V),ct=or}catch{}}De.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ZV;De.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!JL(t))throw Error(S(200));return EV(e,t,null,n)};De.createRoot=function(e,t){if(!JL(e))throw Error(S(299));var n=!1,a="",r=Xb;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=KL(e,1,!1,null,null,n,!1,a,r),e[wt]=t.current,wi(e.nodeType===8?e.parentNode:e),new YL(t)};De.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(S(188)):(e=Object.keys(e).join(","),Error(S(268,e)));return e=mj(t),e=e===null?null:e.stateNode,e};De.flushSync=function(e){return H1(e)};De.hydrate=function(e,t,n){if(!n9(t))throw Error(S(200));return a9(null,e,t,!0,n)};De.hydrateRoot=function(e,t,n){if(!JL(e))throw Error(S(405));var a=n!=null&&n.hydratedSources||null,r=!1,o="",s=Xb;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=$b(t,null,e,1,n??null,r,!1,o,s),e[wt]=t.current,wi(e),a)for(e=0;e<a.length;e++)n=a[e],r=n._getVersion,r=r(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,r]:t.mutableSourceEagerHydrationData.push(n,r);return new t9(t)};De.render=function(e,t,n){if(!n9(t))throw Error(S(200));return a9(null,e,t,!1,n)};De.unmountComponentAtNode=function(e){if(!n9(e))throw Error(S(40));return e._reactRootContainer?(H1(function(){a9(null,null,e,!1,function(){e._reactRootContainer=null,e[wt]=null})}),!0):!1};De.unstable_batchedUpdates=WL;De.unstable_renderSubtreeIntoContainer=function(e,t,n,a){if(!n9(n))throw Error(S(200));if(e==null||e._reactInternals===void 0)throw Error(S(38));return a9(e,t,n,!1,a)};De.version="18.3.1-next-f1338f8080-20240426";function Kb(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Kb)}catch(e){console.error(e)}}Kb(),KI.exports=De;var WV=KI.exports,AS=WV;J9.createRoot=AS.createRoot,J9.hydrateRoot=AS.hydrateRoot;/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var GV={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $V=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),i=(e,t)=>{const n=C.forwardRef(({color:a="currentColor",size:r=24,strokeWidth:o=2,absoluteStrokeWidth:s,className:c="",children:d,...h},u)=>C.createElement("svg",{ref:u,...GV,width:r,height:r,stroke:a,strokeWidth:s?Number(o)*24/Number(r):o,className:["lucide",`lucide-${$V(e)}`,c].join(" "),...h},[...t.map(([y,k])=>C.createElement(y,k)),...Array.isArray(d)?d:[d]]));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cr=i("AArrowDown",[["path",{d:"M3.5 13h6",key:"p1my2r"}],["path",{d:"m2 16 4.5-9 4.5 9",key:"ndf0b3"}],["path",{d:"M18 7v9",key:"pknjwm"}],["path",{d:"m14 12 4 4 4-4",key:"buelq4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sr=i("AArrowUp",[["path",{d:"M3.5 13h6",key:"p1my2r"}],["path",{d:"m2 16 4.5-9 4.5 9",key:"ndf0b3"}],["path",{d:"M18 16V7",key:"ty0viw"}],["path",{d:"m14 11 4-4 4 4",key:"1pu57t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ir=i("ALargeSmall",[["path",{d:"M21 14h-5",key:"1vh23k"}],["path",{d:"M16 16v-3.5a2.5 2.5 0 0 1 5 0V16",key:"1wh10o"}],["path",{d:"M4.5 13h6",key:"dfilno"}],["path",{d:"m3 16 4.5-9 4.5 9",key:"2dxa0e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jr=i("Accessibility",[["circle",{cx:"16",cy:"4",r:"1",key:"1grugj"}],["path",{d:"m18 19 1-7-6 1",key:"r0i19z"}],["path",{d:"m5 8 3-3 5.5 3-2.36 3.5",key:"9ptxx2"}],["path",{d:"M4.24 14.5a5 5 0 0 0 6.88 6",key:"10kmtu"}],["path",{d:"M13.76 17.5a5 5 0 0 0-6.88-6",key:"2qq6rc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const br=i("ActivitySquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M17 12h-2l-2 5-2-10-2 5H7",key:"15hlnc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pr=i("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ar=i("AirVent",[["path",{d:"M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"larmp2"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12",key:"1bo8pg"}],["path",{d:"M6.6 15.6A2 2 0 1 0 10 17v-5",key:"t9h90c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zr=i("Airplay",[["path",{d:"M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1",key:"ns4c3b"}],["polygon",{points:"12 15 17 21 7 21 12 15",key:"1sy95i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hn=i("AlarmClockCheck",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}],["path",{d:"m9 13 2 2 4-4",key:"6343dt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const un=i("AlarmClockMinus",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}],["path",{d:"M9 13h6",key:"1uhe8q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vr=i("AlarmClockOff",[["path",{d:"M6.87 6.87a8 8 0 1 0 11.26 11.26",key:"3on8tj"}],["path",{d:"M19.9 14.25a8 8 0 0 0-9.15-9.15",key:"15ghsc"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.26 18.67 4 21",key:"yzmioq"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M4 4 2 6",key:"1ycko6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yn=i("AlarmClockPlus",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}],["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1uhe8q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hr=i("AlarmClock",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M12 9v4l2 2",key:"1c63tq"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tr=i("AlarmSmoke",[["path",{d:"M4 8a2 2 0 0 1-2-2V3h20v3a2 2 0 0 1-2 2Z",key:"2c4fvq"}],["path",{d:"m19 8-.8 3c-.1.6-.6 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L5 8",key:"1vrndv"}],["path",{d:"M16 21c0-2.5 2-2.5 2-5",key:"1o3eny"}],["path",{d:"M11 21c0-2.5 2-2.5 2-5",key:"1sicvv"}],["path",{d:"M6 21c0-2.5 2-2.5 2-5",key:"i3w1gp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qr=i("Album",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["polyline",{points:"11 3 11 11 14 8 17 11 17 3",key:"1wcwz3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const la=i("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dr=i("AlertOctagon",[["polygon",{points:"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",key:"h1p8hx"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=i("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fr=i("AlignCenterHorizontal",[["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4",key:"11f1s0"}],["path",{d:"M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4",key:"t14dx9"}],["path",{d:"M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1",key:"1w07xs"}],["path",{d:"M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1",key:"1apec2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rr=i("AlignCenterVertical",[["path",{d:"M12 2v20",key:"t6zp3m"}],["path",{d:"M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4",key:"14d6g8"}],["path",{d:"M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4",key:"1e2lrw"}],["path",{d:"M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1",key:"1fkdwx"}],["path",{d:"M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1",key:"1euafb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Br=i("AlignCenter",[["line",{x1:"21",x2:"3",y1:"6",y2:"6",key:"1fp77t"}],["line",{x1:"17",x2:"7",y1:"12",y2:"12",key:"rsh8ii"}],["line",{x1:"19",x2:"5",y1:"18",y2:"18",key:"1t0tuv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nr=i("AlignEndHorizontal",[["rect",{width:"6",height:"16",x:"4",y:"2",rx:"2",key:"z5wdxg"}],["rect",{width:"6",height:"9",x:"14",y:"9",rx:"2",key:"um7a8w"}],["path",{d:"M22 22H2",key:"19qnx5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Er=i("AlignEndVertical",[["rect",{width:"16",height:"6",x:"2",y:"4",rx:"2",key:"10wcwx"}],["rect",{width:"9",height:"6",x:"9",y:"14",rx:"2",key:"4p5bwg"}],["path",{d:"M22 22V2",key:"12ipfv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Or=i("AlignHorizontalDistributeCenter",[["rect",{width:"6",height:"14",x:"4",y:"5",rx:"2",key:"1wwnby"}],["rect",{width:"6",height:"10",x:"14",y:"7",rx:"2",key:"1fe6j6"}],["path",{d:"M17 22v-5",key:"4b6g73"}],["path",{d:"M17 7V2",key:"hnrr36"}],["path",{d:"M7 22v-3",key:"1r4jpn"}],["path",{d:"M7 5V2",key:"liy1u9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ur=i("AlignHorizontalDistributeEnd",[["rect",{width:"6",height:"14",x:"4",y:"5",rx:"2",key:"1wwnby"}],["rect",{width:"6",height:"10",x:"14",y:"7",rx:"2",key:"1fe6j6"}],["path",{d:"M10 2v20",key:"uyc634"}],["path",{d:"M20 2v20",key:"1tx262"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zr=i("AlignHorizontalDistributeStart",[["rect",{width:"6",height:"14",x:"4",y:"5",rx:"2",key:"1wwnby"}],["rect",{width:"6",height:"10",x:"14",y:"7",rx:"2",key:"1fe6j6"}],["path",{d:"M4 2v20",key:"gtpd5x"}],["path",{d:"M14 2v20",key:"tg6bpw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _r=i("AlignHorizontalJustifyCenter",[["rect",{width:"6",height:"14",x:"2",y:"5",rx:"2",key:"dy24zr"}],["rect",{width:"6",height:"10",x:"16",y:"7",rx:"2",key:"13zkjt"}],["path",{d:"M12 2v20",key:"t6zp3m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wr=i("AlignHorizontalJustifyEnd",[["rect",{width:"6",height:"14",x:"2",y:"5",rx:"2",key:"dy24zr"}],["rect",{width:"6",height:"10",x:"12",y:"7",rx:"2",key:"1ht384"}],["path",{d:"M22 2v20",key:"40qfg1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gr=i("AlignHorizontalJustifyStart",[["rect",{width:"6",height:"14",x:"6",y:"5",rx:"2",key:"hsirpf"}],["rect",{width:"6",height:"10",x:"16",y:"7",rx:"2",key:"13zkjt"}],["path",{d:"M2 2v20",key:"1ivd8o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $r=i("AlignHorizontalSpaceAround",[["rect",{width:"6",height:"10",x:"9",y:"7",rx:"2",key:"yn7j0q"}],["path",{d:"M4 22V2",key:"tsjzd3"}],["path",{d:"M20 22V2",key:"1bnhr8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xr=i("AlignHorizontalSpaceBetween",[["rect",{width:"6",height:"14",x:"3",y:"5",rx:"2",key:"j77dae"}],["rect",{width:"6",height:"10",x:"15",y:"7",rx:"2",key:"bq30hj"}],["path",{d:"M3 2v20",key:"1d2pfg"}],["path",{d:"M21 2v20",key:"p059bm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kr=i("AlignJustify",[["line",{x1:"3",x2:"21",y1:"6",y2:"6",key:"4m8b97"}],["line",{x1:"3",x2:"21",y1:"12",y2:"12",key:"10d38w"}],["line",{x1:"3",x2:"21",y1:"18",y2:"18",key:"kwyyxn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qr=i("AlignLeft",[["line",{x1:"21",x2:"3",y1:"6",y2:"6",key:"1fp77t"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}],["line",{x1:"17",x2:"3",y1:"18",y2:"18",key:"1awlsn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yr=i("AlignRight",[["line",{x1:"21",x2:"3",y1:"6",y2:"6",key:"1fp77t"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}],["line",{x1:"21",x2:"7",y1:"18",y2:"18",key:"1g9eri"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jr=i("AlignStartHorizontal",[["rect",{width:"6",height:"16",x:"4",y:"6",rx:"2",key:"1n4dg1"}],["rect",{width:"6",height:"9",x:"14",y:"6",rx:"2",key:"17khns"}],["path",{d:"M22 2H2",key:"fhrpnj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eo=i("AlignStartVertical",[["rect",{width:"9",height:"6",x:"6",y:"14",rx:"2",key:"lpm2y7"}],["rect",{width:"16",height:"6",x:"6",y:"4",rx:"2",key:"rdj6ps"}],["path",{d:"M2 2v20",key:"1ivd8o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const to=i("AlignVerticalDistributeCenter",[["rect",{width:"14",height:"6",x:"5",y:"14",rx:"2",key:"jmoj9s"}],["rect",{width:"10",height:"6",x:"7",y:"4",rx:"2",key:"aza5on"}],["path",{d:"M22 7h-5",key:"o2endc"}],["path",{d:"M7 7H1",key:"105l6j"}],["path",{d:"M22 17h-3",key:"1lwga1"}],["path",{d:"M5 17H2",key:"1gx9xc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const no=i("AlignVerticalDistributeEnd",[["rect",{width:"14",height:"6",x:"5",y:"14",rx:"2",key:"jmoj9s"}],["rect",{width:"10",height:"6",x:"7",y:"4",rx:"2",key:"aza5on"}],["path",{d:"M2 20h20",key:"owomy5"}],["path",{d:"M2 10h20",key:"1ir3d8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ao=i("AlignVerticalDistributeStart",[["rect",{width:"14",height:"6",x:"5",y:"14",rx:"2",key:"jmoj9s"}],["rect",{width:"10",height:"6",x:"7",y:"4",rx:"2",key:"aza5on"}],["path",{d:"M2 14h20",key:"myj16y"}],["path",{d:"M2 4h20",key:"mda7wb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const io=i("AlignVerticalJustifyCenter",[["rect",{width:"14",height:"6",x:"5",y:"16",rx:"2",key:"1i8z2d"}],["rect",{width:"10",height:"6",x:"7",y:"2",rx:"2",key:"ypihtt"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ro=i("AlignVerticalJustifyEnd",[["rect",{width:"14",height:"6",x:"5",y:"12",rx:"2",key:"4l4tp2"}],["rect",{width:"10",height:"6",x:"7",y:"2",rx:"2",key:"ypihtt"}],["path",{d:"M2 22h20",key:"272qi7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oo=i("AlignVerticalJustifyStart",[["rect",{width:"14",height:"6",x:"5",y:"16",rx:"2",key:"1i8z2d"}],["rect",{width:"10",height:"6",x:"7",y:"6",rx:"2",key:"13squh"}],["path",{d:"M2 2h20",key:"1ennik"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const so=i("AlignVerticalSpaceAround",[["rect",{width:"10",height:"6",x:"7",y:"9",rx:"2",key:"b1zbii"}],["path",{d:"M22 20H2",key:"1p1f7z"}],["path",{d:"M22 4H2",key:"1b7qnq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const co=i("AlignVerticalSpaceBetween",[["rect",{width:"14",height:"6",x:"5",y:"15",rx:"2",key:"1w91an"}],["rect",{width:"10",height:"6",x:"7",y:"3",rx:"2",key:"17wqzy"}],["path",{d:"M2 21h20",key:"1nyx9w"}],["path",{d:"M2 3h20",key:"91anmk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=i("Ampersand",[["path",{d:"M17.5 12c0 4.4-3.6 8-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13",key:"1o9ehi"}],["path",{d:"M16 12h3",key:"4uvgyw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ho=i("Ampersands",[["path",{d:"M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",key:"12lh1k"}],["path",{d:"M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",key:"173c68"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uo=i("Anchor",[["circle",{cx:"12",cy:"5",r:"3",key:"rqqgnr"}],["line",{x1:"12",x2:"12",y1:"22",y2:"8",key:"abakz7"}],["path",{d:"M5 12H2a10 10 0 0 0 20 0h-3",key:"1hv3nh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yo=i("Angry",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 16s-1.5-2-4-2-4 2-4 2",key:"epbg0q"}],["path",{d:"M7.5 8 10 9",key:"olxxln"}],["path",{d:"m14 9 2.5-1",key:"1j6cij"}],["path",{d:"M9 10h0",key:"1vxvly"}],["path",{d:"M15 10h0",key:"1j6oav"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const po=i("Annoyed",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 15h8",key:"45n4r"}],["path",{d:"M8 9h2",key:"1g203m"}],["path",{d:"M14 9h2",key:"116p9w"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ko=i("Antenna",[["path",{d:"M2 12 7 2",key:"117k30"}],["path",{d:"m7 12 5-10",key:"1tvx22"}],["path",{d:"m12 12 5-10",key:"ev1o1a"}],["path",{d:"m17 12 5-10",key:"1e4ti3"}],["path",{d:"M4.5 7h15",key:"vlsxkz"}],["path",{d:"M12 16v6",key:"c8a4gj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fo=i("Anvil",[["path",{d:"M7 10c-2.8 0-5-2.2-5-5h5",key:"1d6adc"}],["path",{d:"M7 4v8h7a8 8 0 0 0 8-8Z",key:"uu98hv"}],["path",{d:"M9 12v5",key:"3anwtq"}],["path",{d:"M15 12v5",key:"5xh3zn"}],["path",{d:"M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1H5Z",key:"10a9tj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mo=i("Aperture",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"14.31",x2:"20.05",y1:"8",y2:"17.94",key:"jdes2e"}],["line",{x1:"9.69",x2:"21.17",y1:"8",y2:"8",key:"1gubuk"}],["line",{x1:"7.38",x2:"13.12",y1:"12",y2:"2.06",key:"1m4d1n"}],["line",{x1:"9.69",x2:"3.95",y1:"16",y2:"6.06",key:"1wye2p"}],["line",{x1:"14.31",x2:"2.83",y1:"16",y2:"16",key:"1l9f4x"}],["line",{x1:"16.62",x2:"10.88",y1:"12",y2:"21.94",key:"1jjvfs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const go=i("AppWindow",[["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}],["path",{d:"M10 4v4",key:"pp8u80"}],["path",{d:"M2 8h20",key:"d11cs7"}],["path",{d:"M6 4v4",key:"1svtjw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xo=i("Apple",[["path",{d:"M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z",key:"3s7exb"}],["path",{d:"M10 2c1 .5 2 2 2 5",key:"fcco2y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vo=i("ArchiveRestore",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h2",key:"tvwodi"}],["path",{d:"M20 8v11a2 2 0 0 1-2 2h-2",key:"1gkqxj"}],["path",{d:"m9 15 3-3 3 3",key:"1pd0qc"}],["path",{d:"M12 12v9",key:"192myk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mo=i("ArchiveX",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"m9.5 17 5-5",key:"nakeu6"}],["path",{d:"m9.5 12 5 5",key:"1hccrj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wo=i("Archive",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lo=i("AreaChart",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M7 12v5h12V8l-5 5-4-4Z",key:"zxz28u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Co=i("Armchair",[["path",{d:"M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3",key:"irtipd"}],["path",{d:"M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z",key:"1e01m0"}],["path",{d:"M5 18v2",key:"ppbyun"}],["path",{d:"M19 18v2",key:"gy7782"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const So=i("ArrowBigDownDash",[["path",{d:"M15 5H9",key:"1tp3ed"}],["path",{d:"M15 9v3h4l-7 7-7-7h4V9h6z",key:"oscb9h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Io=i("ArrowBigDown",[["path",{d:"M15 6v6h4l-7 7-7-7h4V6h6z",key:"1thax2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jo=i("ArrowBigLeftDash",[["path",{d:"M19 15V9",key:"1hci5f"}],["path",{d:"M15 15h-3v4l-7-7 7-7v4h3v6z",key:"16tjna"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bo=i("ArrowBigLeft",[["path",{d:"M18 15h-6v4l-7-7 7-7v4h6v6z",key:"lbrdak"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Po=i("ArrowBigRightDash",[["path",{d:"M5 9v6",key:"158jrl"}],["path",{d:"M9 9h3V5l7 7-7 7v-4H9V9z",key:"1sg2xn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ao=i("ArrowBigRight",[["path",{d:"M6 9h6V5l7 7-7 7v-4H6V9z",key:"7fvt9c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zo=i("ArrowBigUpDash",[["path",{d:"M9 19h6",key:"456am0"}],["path",{d:"M9 15v-3H5l7-7 7 7h-4v3H9z",key:"1r2uve"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vo=i("ArrowBigUp",[["path",{d:"M9 18v-6H5l7-7 7 7h-4v6H9z",key:"1x06kx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ho=i("ArrowDown01",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["rect",{x:"15",y:"4",width:"4",height:"6",ry:"2",key:"1bwicg"}],["path",{d:"M17 20v-6h-2",key:"1qp1so"}],["path",{d:"M15 20h4",key:"1j968p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const To=i("ArrowDown10",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M17 10V4h-2",key:"zcsr5x"}],["path",{d:"M15 10h4",key:"id2lce"}],["rect",{x:"15",y:"14",width:"4",height:"6",ry:"2",key:"33xykx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pn=i("ArrowDownAZ",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M20 8h-5",key:"1vsyxs"}],["path",{d:"M15 10V6.5a2.5 2.5 0 0 1 5 0V10",key:"ag13bf"}],["path",{d:"M15 14h5l-5 6h5",key:"ur5jdg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qo=i("ArrowDownCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 8v8",key:"napkw2"}],["path",{d:"m8 12 4 4 4-4",key:"k98ssh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Do=i("ArrowDownFromLine",[["path",{d:"M19 3H5",key:"1236rx"}],["path",{d:"M12 21V7",key:"gj6g52"}],["path",{d:"m6 15 6 6 6-6",key:"h15q88"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fo=i("ArrowDownLeftFromCircle",[["path",{d:"M2 12a10 10 0 1 1 10 10",key:"1yn6ov"}],["path",{d:"m2 22 10-10",key:"28ilpk"}],["path",{d:"M8 22H2v-6",key:"sulq54"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ro=i("ArrowDownLeftSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m16 8-8 8",key:"166keh"}],["path",{d:"M16 16H8V8",key:"1w2ppm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bo=i("ArrowDownLeft",[["path",{d:"M17 7 7 17",key:"15tmo1"}],["path",{d:"M17 17H7V7",key:"1org7z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const No=i("ArrowDownNarrowWide",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M11 4h4",key:"6d7r33"}],["path",{d:"M11 8h7",key:"djye34"}],["path",{d:"M11 12h10",key:"1438ji"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eo=i("ArrowDownRightFromCircle",[["path",{d:"M12 22a10 10 0 1 1 10-10",key:"130bv5"}],["path",{d:"M22 22 12 12",key:"131aw7"}],["path",{d:"M22 16v6h-6",key:"1gvm70"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oo=i("ArrowDownRightSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m8 8 8 8",key:"1imecy"}],["path",{d:"M16 8v8H8",key:"1lbpgo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uo=i("ArrowDownRight",[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zo=i("ArrowDownSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 8v8",key:"napkw2"}],["path",{d:"m8 12 4 4 4-4",key:"k98ssh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _o=i("ArrowDownToDot",[["path",{d:"M12 2v14",key:"jyx4ut"}],["path",{d:"m19 9-7 7-7-7",key:"1oe3oy"}],["circle",{cx:"12",cy:"21",r:"1",key:"o0uj5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wo=i("ArrowDownToLine",[["path",{d:"M12 17V3",key:"1cwfxf"}],["path",{d:"m6 11 6 6 6-6",key:"12ii2o"}],["path",{d:"M19 21H5",key:"150jfl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Go=i("ArrowDownUp",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"m21 8-4-4-4 4",key:"1c9v7m"}],["path",{d:"M17 4v16",key:"7dpous"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kn=i("ArrowDownWideNarrow",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M11 4h10",key:"1w87gc"}],["path",{d:"M11 8h7",key:"djye34"}],["path",{d:"M11 12h4",key:"q8tih4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fn=i("ArrowDownZA",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M15 4h5l-5 6h5",key:"8asdl1"}],["path",{d:"M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",key:"r6l5cz"}],["path",{d:"M20 18h-5",key:"18j1r2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $o=i("ArrowDown",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xo=i("ArrowLeftCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 12H8",key:"1fr5h0"}],["path",{d:"m12 8-4 4 4 4",key:"15vm53"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ko=i("ArrowLeftFromLine",[["path",{d:"m9 6-6 6 6 6",key:"7v63n9"}],["path",{d:"M3 12h14",key:"13k4hi"}],["path",{d:"M21 19V5",key:"b4bplr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qo=i("ArrowLeftRight",[["path",{d:"M8 3 4 7l4 4",key:"9rb6wj"}],["path",{d:"M4 7h16",key:"6tx8e3"}],["path",{d:"m16 21 4-4-4-4",key:"siv7j2"}],["path",{d:"M20 17H4",key:"h6l3hr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yo=i("ArrowLeftSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m12 8-4 4 4 4",key:"15vm53"}],["path",{d:"M16 12H8",key:"1fr5h0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jo=i("ArrowLeftToLine",[["path",{d:"M3 19V5",key:"rwsyhb"}],["path",{d:"m13 6-6 6 6 6",key:"1yhaz7"}],["path",{d:"M7 12h14",key:"uoisry"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e2=i("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t2=i("ArrowRightCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m12 16 4-4-4-4",key:"1i9zcv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n2=i("ArrowRightFromLine",[["path",{d:"M3 5v14",key:"1nt18q"}],["path",{d:"M21 12H7",key:"13ipq5"}],["path",{d:"m15 18 6-6-6-6",key:"6tx3qv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a2=i("ArrowRightLeft",[["path",{d:"m16 3 4 4-4 4",key:"1x1c3m"}],["path",{d:"M20 7H4",key:"zbl0bi"}],["path",{d:"m8 21-4-4 4-4",key:"h9nckh"}],["path",{d:"M4 17h16",key:"g4d7ey"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i2=i("ArrowRightSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m12 16 4-4-4-4",key:"1i9zcv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r2=i("ArrowRightToLine",[["path",{d:"M17 12H3",key:"8awo09"}],["path",{d:"m11 18 6-6-6-6",key:"8c2y43"}],["path",{d:"M21 5v14",key:"nzette"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const da=i("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o2=i("ArrowUp01",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["rect",{x:"15",y:"4",width:"4",height:"6",ry:"2",key:"1bwicg"}],["path",{d:"M17 20v-6h-2",key:"1qp1so"}],["path",{d:"M15 20h4",key:"1j968p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s2=i("ArrowUp10",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M17 10V4h-2",key:"zcsr5x"}],["path",{d:"M15 10h4",key:"id2lce"}],["rect",{x:"15",y:"14",width:"4",height:"6",ry:"2",key:"33xykx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mn=i("ArrowUpAZ",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M20 8h-5",key:"1vsyxs"}],["path",{d:"M15 10V6.5a2.5 2.5 0 0 1 5 0V10",key:"ag13bf"}],["path",{d:"M15 14h5l-5 6h5",key:"ur5jdg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c2=i("ArrowUpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l2=i("ArrowUpDown",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d2=i("ArrowUpFromDot",[["path",{d:"m5 9 7-7 7 7",key:"1hw5ic"}],["path",{d:"M12 16V2",key:"ywoabb"}],["circle",{cx:"12",cy:"21",r:"1",key:"o0uj5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h2=i("ArrowUpFromLine",[["path",{d:"m18 9-6-6-6 6",key:"kcunyi"}],["path",{d:"M12 3v14",key:"7cf3v8"}],["path",{d:"M5 21h14",key:"11awu3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u2=i("ArrowUpLeftFromCircle",[["path",{d:"M2 8V2h6",key:"hiwtdz"}],["path",{d:"m2 2 10 10",key:"1oh8rs"}],["path",{d:"M12 2A10 10 0 1 1 2 12",key:"rrk4fa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y2=i("ArrowUpLeftSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 16V8h8",key:"19xb1h"}],["path",{d:"M16 16 8 8",key:"1qdy8n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p2=i("ArrowUpLeft",[["path",{d:"M7 17V7h10",key:"11bw93"}],["path",{d:"M17 17 7 7",key:"2786uv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gn=i("ArrowUpNarrowWide",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M11 12h4",key:"q8tih4"}],["path",{d:"M11 16h7",key:"uosisv"}],["path",{d:"M11 20h10",key:"jvxblo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k2=i("ArrowUpRightFromCircle",[["path",{d:"M22 12A10 10 0 1 1 12 2",key:"1fm58d"}],["path",{d:"M22 2 12 12",key:"yg2myt"}],["path",{d:"M16 2h6v6",key:"zan5cs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f2=i("ArrowUpRightSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 8h8v8",key:"b65dnt"}],["path",{d:"m8 16 8-8",key:"13b9ih"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m2=i("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g2=i("ArrowUpSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x2=i("ArrowUpToLine",[["path",{d:"M5 3h14",key:"7usisc"}],["path",{d:"m18 13-6-6-6 6",key:"1kf1n9"}],["path",{d:"M12 7v14",key:"1akyts"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v2=i("ArrowUpWideNarrow",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M11 12h10",key:"1438ji"}],["path",{d:"M11 16h7",key:"uosisv"}],["path",{d:"M11 20h4",key:"1krc32"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xn=i("ArrowUpZA",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M15 4h5l-5 6h5",key:"8asdl1"}],["path",{d:"M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",key:"r6l5cz"}],["path",{d:"M20 18h-5",key:"18j1r2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M2=i("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w2=i("ArrowsUpFromLine",[["path",{d:"m4 6 3-3 3 3",key:"9aidw8"}],["path",{d:"M7 17V3",key:"19qxw1"}],["path",{d:"m14 6 3-3 3 3",key:"6iy689"}],["path",{d:"M17 17V3",key:"o0fmgi"}],["path",{d:"M4 21h16",key:"1h09gz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L2=i("Asterisk",[["path",{d:"M12 6v12",key:"1vza4d"}],["path",{d:"M17.196 9 6.804 15",key:"1ah31z"}],["path",{d:"m6.804 9 10.392 6",key:"1b6pxd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C2=i("AtSign",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",key:"7n84p3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S2=i("Atom",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",key:"1l2ple"}],["path",{d:"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",key:"1wam0m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I2=i("AudioLines",[["path",{d:"M2 10v3",key:"1fnikh"}],["path",{d:"M6 6v11",key:"11sgs0"}],["path",{d:"M10 3v18",key:"yhl04a"}],["path",{d:"M14 8v7",key:"3a1oy3"}],["path",{d:"M18 5v13",key:"123xd1"}],["path",{d:"M22 10v3",key:"154ddg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j2=i("AudioWaveform",[["path",{d:"M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2",key:"57tc96"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b2=i("Award",[["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}],["path",{d:"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11",key:"em7aur"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P2=i("Axe",[["path",{d:"m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9",key:"csbz4o"}],["path",{d:"M15 13 9 7l4-4 6 6h3a8 8 0 0 1-7 7z",key:"113wfo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vn=i("Axis3d",[["path",{d:"M4 4v16h16",key:"1s015l"}],["path",{d:"m4 20 7-7",key:"17qe9y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=i("Baby",[["path",{d:"M9 12h.01",key:"157uk2"}],["path",{d:"M15 12h.01",key:"1k8ypt"}],["path",{d:"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5",key:"1u7htd"}],["path",{d:"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",key:"5yv0yz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A2=i("Backpack",[["path",{d:"M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z",key:"wvr1b5"}],["path",{d:"M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",key:"donm21"}],["path",{d:"M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5",key:"xk3gvk"}],["path",{d:"M8 10h8",key:"c7uz4u"}],["path",{d:"M8 18h8",key:"1no2b1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z2=i("BadgeAlert",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V2=i("BadgeCent",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M12 7v10",key:"jspqdw"}],["path",{d:"M15.4 10a4 4 0 1 0 0 4",key:"2eqtx8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mn=i("BadgeCheck",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H2=i("BadgeDollarSign",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 18V6",key:"zqpxq5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T2=i("BadgeEuro",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M7 12h5",key:"gblrwe"}],["path",{d:"M15 9.4a4 4 0 1 0 0 5.2",key:"1makmb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q2=i("BadgeHelp",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["line",{x1:"12",x2:"12.01",y1:"17",y2:"17",key:"io3f8k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D2=i("BadgeIndianRupee",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M8 8h8",key:"1bis0t"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m13 17-5-1h1a4 4 0 0 0 0-8",key:"nu2bwa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F2=i("BadgeInfo",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"12",x2:"12",y1:"16",y2:"12",key:"1y1yb1"}],["line",{x1:"12",x2:"12.01",y1:"8",y2:"8",key:"110wyk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R2=i("BadgeJapaneseYen",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 8 3 3v7",key:"17yadx"}],["path",{d:"m12 11 3-3",key:"p4cfq1"}],["path",{d:"M9 12h6",key:"1c52cq"}],["path",{d:"M9 16h6",key:"8wimt3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B2=i("BadgeMinus",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N2=i("BadgePercent",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 15h.01",key:"lqbp3k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E2=i("BadgePlus",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"12",x2:"12",y1:"8",y2:"16",key:"10p56q"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O2=i("BadgePoundSterling",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M8 12h4",key:"qz6y1c"}],["path",{d:"M10 16V9.5a2.5 2.5 0 0 1 5 0",key:"3mlbjk"}],["path",{d:"M8 16h7",key:"sbedsn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U2=i("BadgeRussianRuble",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M9 16h5",key:"1syiyw"}],["path",{d:"M9 12h5a2 2 0 1 0 0-4h-3v9",key:"1ge9c1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z2=i("BadgeSwissFranc",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M11 17V8h4",key:"1bfq6y"}],["path",{d:"M11 12h3",key:"2eqnfz"}],["path",{d:"M9 16h4",key:"1skf3a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _2=i("BadgeX",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"15",x2:"9",y1:"9",y2:"15",key:"f7djnv"}],["line",{x1:"9",x2:"15",y1:"9",y2:"15",key:"1shsy8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W2=i("Badge",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G2=i("BaggageClaim",[["path",{d:"M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2",key:"4irg2o"}],["path",{d:"M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10",key:"14fcyx"}],["rect",{width:"13",height:"8",x:"8",y:"6",rx:"1",key:"o6oiis"}],["circle",{cx:"18",cy:"20",r:"2",key:"t9985n"}],["circle",{cx:"9",cy:"20",r:"2",key:"e5v82j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $2=i("Ban",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m4.9 4.9 14.2 14.2",key:"1m5liu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X2=i("Banana",[["path",{d:"M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5",key:"1cscit"}],["path",{d:"M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z",key:"1y1nbv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K2=i("Banknote",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M6 12h.01M18 12h.01",key:"113zkx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q2=i("BarChart2",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y2=i("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J2=i("BarChart4",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M13 17V9",key:"1fwyjl"}],["path",{d:"M18 17V5",key:"sfb6ij"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const es=i("BarChartBig",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["rect",{width:"4",height:"7",x:"7",y:"10",rx:"1",key:"14u6mf"}],["rect",{width:"4",height:"12",x:"15",y:"5",rx:"1",key:"b3pek6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ts=i("BarChartHorizontalBig",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["rect",{width:"12",height:"4",x:"7",y:"5",rx:"1",key:"936jl1"}],["rect",{width:"7",height:"4",x:"7",y:"13",rx:"1",key:"jqfkpy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ns=i("BarChartHorizontal",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M7 16h8",key:"srdodz"}],["path",{d:"M7 11h12",key:"127s9w"}],["path",{d:"M7 6h3",key:"w9rmul"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const as=i("BarChart",[["line",{x1:"12",x2:"12",y1:"20",y2:"10",key:"1vz5eb"}],["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["line",{x1:"6",x2:"6",y1:"20",y2:"16",key:"hq0ia6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const is=i("Barcode",[["path",{d:"M3 5v14",key:"1nt18q"}],["path",{d:"M8 5v14",key:"1ybrkv"}],["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"M17 5v14",key:"ycjyhj"}],["path",{d:"M21 5v14",key:"nzette"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rs=i("Baseline",[["path",{d:"M4 20h16",key:"14thso"}],["path",{d:"m6 16 6-12 6 12",key:"1b4byz"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const os=i("Bath",[["path",{d:"M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",key:"1r8yf5"}],["line",{x1:"10",x2:"8",y1:"5",y2:"7",key:"h5g8z4"}],["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}],["line",{x1:"7",x2:"7",y1:"19",y2:"21",key:"16jp00"}],["line",{x1:"17",x2:"17",y1:"19",y2:"21",key:"1pxrnk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ss=i("BatteryCharging",[["path",{d:"M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2",key:"1sdynx"}],["path",{d:"M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1",key:"1gkd3k"}],["path",{d:"m11 7-3 5h4l-3 5",key:"b4a64w"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cs=i("BatteryFull",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}],["line",{x1:"6",x2:"6",y1:"11",y2:"13",key:"1wd6dw"}],["line",{x1:"10",x2:"10",y1:"11",y2:"13",key:"haxvl5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"13",key:"c6fn6x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ls=i("BatteryLow",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}],["line",{x1:"6",x2:"6",y1:"11",y2:"13",key:"1wd6dw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ds=i("BatteryMedium",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}],["line",{x1:"6",x2:"6",y1:"11",y2:"13",key:"1wd6dw"}],["line",{x1:"10",x2:"10",y1:"11",y2:"13",key:"haxvl5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hs=i("BatteryWarning",[["path",{d:"M14 7h2a2 2 0 0 1 2 2v6c0 1-1 2-2 2h-2",key:"1if82c"}],["path",{d:"M6 7H4a2 2 0 0 0-2 2v6c0 1 1 2 2 2h2",key:"2pdlyl"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}],["line",{x1:"10",x2:"10",y1:"7",y2:"13",key:"1uzyus"}],["line",{x1:"10",x2:"10",y1:"17",y2:"17.01",key:"1y8k4g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const us=i("Battery",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ys=i("Beaker",[["path",{d:"M4.5 3h15",key:"c7n0jr"}],["path",{d:"M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3",key:"m1uhx7"}],["path",{d:"M6 14h12",key:"4cwo0f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ps=i("BeanOff",[["path",{d:"M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1",key:"bq3udt"}],["path",{d:"M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66",key:"17ccse"}],["path",{d:"M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04",key:"18zqgq"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ks=i("Bean",[["path",{d:"M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z",key:"1tvzk7"}],["path",{d:"M5.341 10.62a4 4 0 1 0 5.279-5.28",key:"2cyri2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fs=i("BedDouble",[["path",{d:"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",key:"1k78r4"}],["path",{d:"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",key:"fb3tl2"}],["path",{d:"M12 4v6",key:"1dcgq2"}],["path",{d:"M2 18h20",key:"ajqnye"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ms=i("BedSingle",[["path",{d:"M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8",key:"1wm6mi"}],["path",{d:"M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4",key:"4k93s5"}],["path",{d:"M3 18h18",key:"1h113x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gs=i("Bed",[["path",{d:"M2 4v16",key:"vw9hq8"}],["path",{d:"M2 8h18a2 2 0 0 1 2 2v10",key:"1dgv2r"}],["path",{d:"M2 17h20",key:"18nfp3"}],["path",{d:"M6 8v9",key:"1yriud"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xs=i("Beef",[["circle",{cx:"12.5",cy:"8.5",r:"2.5",key:"9738u8"}],["path",{d:"M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z",key:"o0f6za"}],["path",{d:"m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5",key:"k7p6i0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vs=i("Beer",[["path",{d:"M17 11h1a3 3 0 0 1 0 6h-1",key:"1yp76v"}],["path",{d:"M9 12v6",key:"1u1cab"}],["path",{d:"M13 12v6",key:"1sugkk"}],["path",{d:"M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z",key:"1510fo"}],["path",{d:"M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8",key:"19jb7n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ms=i("BellDot",[["path",{d:"M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3",key:"xcehk"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["circle",{cx:"18",cy:"8",r:"3",key:"1g0gzu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ws=i("BellElectric",[["path",{d:"M18.8 4A6.3 8.7 0 0 1 20 9",key:"xve1fh"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["circle",{cx:"9",cy:"9",r:"7",key:"p2h5vp"}],["rect",{width:"10",height:"6",x:"4",y:"16",rx:"2",key:"17f3te"}],["path",{d:"M14 19c3 0 4.6-1.6 4.6-1.6",key:"n7odp6"}],["circle",{cx:"20",cy:"16",r:"2",key:"1v9bxh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ls=i("BellMinus",[["path",{d:"M18.4 12c.8 3.8 2.6 5 2.6 5H3s3-2 3-9c0-3.3 2.7-6 6-6 1.8 0 3.4.8 4.5 2",key:"eck70s"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"M15 8h6",key:"8ybuxh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cs=i("BellOff",[["path",{d:"M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5",key:"o7mx20"}],["path",{d:"M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7",key:"16f1lm"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ss=i("BellPlus",[["path",{d:"M19.3 14.8C20.1 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 1 0 1.9.2 2.8.7",key:"guizqy"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"M15 8h6",key:"8ybuxh"}],["path",{d:"M18 5v6",key:"g5ayrv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Is=i("BellRing",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const js=i("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bs=i("Bike",[["circle",{cx:"18.5",cy:"17.5",r:"3.5",key:"15x4ox"}],["circle",{cx:"5.5",cy:"17.5",r:"3.5",key:"1noe27"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["path",{d:"M12 17.5V14l-3-3 4-3 2 3h2",key:"1npguv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ps=i("Binary",[["rect",{x:"14",y:"14",width:"4",height:"6",rx:"2",key:"p02svl"}],["rect",{x:"6",y:"4",width:"4",height:"6",rx:"2",key:"xm4xkj"}],["path",{d:"M6 20h4",key:"1i6q5t"}],["path",{d:"M14 10h4",key:"ru81e7"}],["path",{d:"M6 14h2v6",key:"16z9wg"}],["path",{d:"M14 4h2v6",key:"1idq9u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const As=i("Biohazard",[["circle",{cx:"12",cy:"11.9",r:"2",key:"e8h31w"}],["path",{d:"M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6",key:"17bolr"}],["path",{d:"m8.9 10.1 1.4.8",key:"15ezny"}],["path",{d:"M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5",key:"wtwa5u"}],["path",{d:"m15.1 10.1-1.4.8",key:"1r0b28"}],["path",{d:"M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2",key:"m7qszh"}],["path",{d:"M12 13.9v1.6",key:"zfyyim"}],["path",{d:"M13.5 5.4c-1-.2-2-.2-3 0",key:"1bi9q0"}],["path",{d:"M17 16.4c.7-.7 1.2-1.6 1.5-2.5",key:"1rhjqw"}],["path",{d:"M5.5 13.9c.3.9.8 1.8 1.5 2.5",key:"8gsud3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zs=i("Bird",[["path",{d:"M16 7h.01",key:"1kdx03"}],["path",{d:"M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20",key:"oj1oa8"}],["path",{d:"m20 7 2 .5-2 .5",key:"12nv4d"}],["path",{d:"M10 18v3",key:"1yea0a"}],["path",{d:"M14 17.75V21",key:"1pymcb"}],["path",{d:"M7 18a6 6 0 0 0 3.84-10.61",key:"1npnn0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vs=i("Bitcoin",[["path",{d:"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",key:"yr8idg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hs=i("Blinds",[["path",{d:"M3 3h18",key:"o7r712"}],["path",{d:"M20 7H8",key:"gd2fo2"}],["path",{d:"M20 11H8",key:"1ynp89"}],["path",{d:"M10 19h10",key:"19hjk5"}],["path",{d:"M8 15h12",key:"1yqzne"}],["path",{d:"M4 3v14",key:"fggqzn"}],["circle",{cx:"4",cy:"19",r:"2",key:"p3m9r0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ts=i("Blocks",[["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["path",{d:"M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3",key:"1fpvtg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qs=i("BluetoothConnected",[["path",{d:"m7 7 10 10-5 5V2l5 5L7 17",key:"1q5490"}],["line",{x1:"18",x2:"21",y1:"12",y2:"12",key:"1rsjjs"}],["line",{x1:"3",x2:"6",y1:"12",y2:"12",key:"11yl8c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ds=i("BluetoothOff",[["path",{d:"m17 17-5 5V12l-5 5",key:"v5aci6"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M14.5 9.5 17 7l-5-5v4.5",key:"1kddfz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fs=i("BluetoothSearching",[["path",{d:"m7 7 10 10-5 5V2l5 5L7 17",key:"1q5490"}],["path",{d:"M20.83 14.83a4 4 0 0 0 0-5.66",key:"k8tn1j"}],["path",{d:"M18 12h.01",key:"yjnet6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rs=i("Bluetooth",[["path",{d:"m7 7 10 10-5 5V2l5 5L7 17",key:"1q5490"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bs=i("Bold",[["path",{d:"M14 12a4 4 0 0 0 0-8H6v8",key:"v2sylx"}],["path",{d:"M15 20a4 4 0 0 0 0-8H6v8Z",key:"1ef5ya"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ns=i("Bomb",[["circle",{cx:"11",cy:"13",r:"9",key:"hd149"}],["path",{d:"M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95",key:"jp4j1b"}],["path",{d:"m22 2-1.5 1.5",key:"ay92ug"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Es=i("Bone",[["path",{d:"M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z",key:"w610uw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Os=i("BookA",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"m8 13 4-7 4 7",key:"4rari8"}],["path",{d:"M9.1 11h5.7",key:"1gkovt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Us=i("BookAudio",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M8 8v3",key:"1qzp49"}],["path",{d:"M12 6v7",key:"1f6ttz"}],["path",{d:"M16 8v3",key:"gejaml"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zs=i("BookCheck",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"m9 9.5 2 2 4-4",key:"1dth82"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _s=i("BookCopy",[["path",{d:"M2 16V4a2 2 0 0 1 2-2h11",key:"spzkk5"}],["path",{d:"M5 14H4a2 2 0 1 0 0 4h1",key:"16gqf9"}],["path",{d:"M22 18H11a2 2 0 1 0 0 4h11V6H11a2 2 0 0 0-2 2v12",key:"1owzki"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wn=i("BookDashed",[["path",{d:"M20 22h-2",key:"1rpnb6"}],["path",{d:"M20 15v2h-2",key:"fph276"}],["path",{d:"M4 19.5V15",key:"6gr39e"}],["path",{d:"M20 8v3",key:"deu0bs"}],["path",{d:"M18 2h2v2",key:"180o53"}],["path",{d:"M4 11V9",key:"v3xsx8"}],["path",{d:"M12 2h2",key:"cvn524"}],["path",{d:"M12 22h2",key:"kn7ki6"}],["path",{d:"M12 17h2",key:"13u4lk"}],["path",{d:"M8 22H6.5a2.5 2.5 0 0 1 0-5H8",key:"fiseg2"}],["path",{d:"M4 5v-.5A2.5 2.5 0 0 1 6.5 2H8",key:"wywhs9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ws=i("BookDown",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"m9 10 3 3 3-3",key:"zt5b4y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gs=i("BookHeadphones",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["path",{d:"M8 12v-2a4 4 0 0 1 8 0v2",key:"1vsqkj"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $s=i("BookHeart",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M16 8.2C16 7 15 6 13.8 6c-.8 0-1.4.3-1.8.9-.4-.6-1-.9-1.8-.9C9 6 8 7 8 8.2c0 .6.3 1.2.7 1.6h0C10 11.1 12 13 12 13s2-1.9 3.3-3.1h0c.4-.4.7-1 .7-1.7z",key:"1dlbw1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xs=i("BookImage",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["circle",{cx:"10",cy:"8",r:"2",key:"2qkj4p"}],["path",{d:"m20 13.7-2.1-2.1c-.8-.8-2-.8-2.8 0L9.7 17",key:"160say"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ks=i("BookKey",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H14",key:"1gfsgw"}],["path",{d:"M20 8v14H6.5a2.5 2.5 0 0 1 0-5H20",key:"zb0ngp"}],["circle",{cx:"14",cy:"8",r:"2",key:"u49eql"}],["path",{d:"m20 2-4.5 4.5",key:"1sppr8"}],["path",{d:"m19 3 1 1",key:"ze14oc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qs=i("BookLock",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10",key:"18wgow"}],["path",{d:"M20 15v7H6.5a2.5 2.5 0 0 1 0-5H20",key:"dpch1j"}],["rect",{width:"8",height:"5",x:"12",y:"6",rx:"1",key:"9nqwug"}],["path",{d:"M18 6V4a2 2 0 1 0-4 0v2",key:"1aquzs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ys=i("BookMarked",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["polyline",{points:"10 2 10 10 13 7 16 10 16 2",key:"13o6vz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Js=i("BookMinus",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M9 10h6",key:"9gxzsh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ec=i("BookOpenCheck",[["path",{d:"M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4Z",key:"1i8u0n"}],["path",{d:"m16 12 2 2 4-4",key:"mdajum"}],["path",{d:"M22 6V3h-6c-2.2 0-4 1.8-4 4v14c0-1.7 1.3-3 3-3h7v-2.3",key:"jb5l51"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tc=i("BookOpenText",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}],["path",{d:"M6 8h2",key:"30oboj"}],["path",{d:"M6 12h2",key:"32wvfc"}],["path",{d:"M16 8h2",key:"msurwy"}],["path",{d:"M16 12h2",key:"7q9ll5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ya=i("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nc=i("BookPlus",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M9 10h6",key:"9gxzsh"}],["path",{d:"M12 7v6",key:"lw1j43"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ac=i("BookText",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M8 7h6",key:"1f0q6e"}],["path",{d:"M8 11h8",key:"vwpz6n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ic=i("BookType",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M16 8V6H8v2",key:"x8j6u4"}],["path",{d:"M12 6v7",key:"1f6ttz"}],["path",{d:"M10 13h4",key:"ytezjc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rc=i("BookUp2",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2",key:"1lorq7"}],["path",{d:"M18 2h2v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"1nfm9i"}],["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}],["path",{d:"m9 5 3-3 3 3",key:"l8vdw6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oc=i("BookUp",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sc=i("BookUser",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M15 13a3 3 0 1 0-6 0",key:"10j68g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cc=i("BookX",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"m14.5 7-5 5",key:"dy991v"}],["path",{d:"m9.5 7 5 5",key:"s45iea"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lc=i("Book",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dc=i("BookmarkCheck",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",key:"169p4p"}],["path",{d:"m9 10 2 2 4-4",key:"1gnqz4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hc=i("BookmarkMinus",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}],["line",{x1:"15",x2:"9",y1:"10",y2:"10",key:"1gty7f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uc=i("BookmarkPlus",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}],["line",{x1:"12",x2:"12",y1:"7",y2:"13",key:"1cppfj"}],["line",{x1:"15",x2:"9",y1:"10",y2:"10",key:"1gty7f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yc=i("BookmarkX",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",key:"169p4p"}],["path",{d:"m14.5 7.5-5 5",key:"3lb6iw"}],["path",{d:"m9.5 7.5 5 5",key:"ko136h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pc=i("Bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kc=i("BoomBox",[["path",{d:"M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",key:"vvzvr1"}],["path",{d:"M8 8v1",key:"xcqmfk"}],["path",{d:"M12 8v1",key:"1rj8u4"}],["path",{d:"M16 8v1",key:"1q12zr"}],["rect",{width:"20",height:"12",x:"2",y:"9",rx:"2",key:"igpb89"}],["circle",{cx:"8",cy:"15",r:"2",key:"fa4a8s"}],["circle",{cx:"16",cy:"15",r:"2",key:"14c3ya"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fc=i("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mc=i("BoxSelect",[["path",{d:"M5 3a2 2 0 0 0-2 2",key:"y57alp"}],["path",{d:"M19 3a2 2 0 0 1 2 2",key:"18rm91"}],["path",{d:"M21 19a2 2 0 0 1-2 2",key:"1j7049"}],["path",{d:"M5 21a2 2 0 0 1-2-2",key:"sbafld"}],["path",{d:"M9 3h1",key:"1yesri"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 3h1",key:"1ec4yj"}],["path",{d:"M14 21h1",key:"v9vybs"}],["path",{d:"M3 9v1",key:"1r0deq"}],["path",{d:"M21 9v1",key:"mxsmne"}],["path",{d:"M3 14v1",key:"vnatye"}],["path",{d:"M21 14v1",key:"169vum"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gc=i("Box",[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xc=i("Boxes",[["path",{d:"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",key:"lc1i9w"}],["path",{d:"m7 16.5-4.74-2.85",key:"1o9zyk"}],["path",{d:"m7 16.5 5-3",key:"va8pkn"}],["path",{d:"M7 16.5v5.17",key:"jnp8gn"}],["path",{d:"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",key:"8zsnat"}],["path",{d:"m17 16.5-5-3",key:"8arw3v"}],["path",{d:"m17 16.5 4.74-2.85",key:"8rfmw"}],["path",{d:"M17 16.5v5.17",key:"k6z78m"}],["path",{d:"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",key:"1xygjf"}],["path",{d:"M12 8 7.26 5.15",key:"1vbdud"}],["path",{d:"m12 8 4.74-2.85",key:"3rx089"}],["path",{d:"M12 13.5V8",key:"1io7kd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ln=i("Braces",[["path",{d:"M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",key:"ezmyqa"}],["path",{d:"M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",key:"e1hn23"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vc=i("Brackets",[["path",{d:"M16 3h3v18h-3",key:"1yor1f"}],["path",{d:"M8 21H5V3h3",key:"1qrfwo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mc=i("BrainCircuit",[["path",{d:"M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z",key:"ixwj2a"}],["path",{d:"M16 8V5c0-1.1.9-2 2-2",key:"13dx7u"}],["path",{d:"M12 13h4",key:"1ku699"}],["path",{d:"M12 18h6a2 2 0 0 1 2 2v1",key:"105ag5"}],["path",{d:"M12 8h8",key:"1lhi5i"}],["path",{d:"M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",key:"1s25gz"}],["path",{d:"M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",key:"127460"}],["path",{d:"M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",key:"fys062"}],["path",{d:"M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",key:"1vib61"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wc=i("BrainCog",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5",key:"1f4le0"}],["path",{d:"m15.7 10.4-.9.4",key:"ayzo6p"}],["path",{d:"m9.2 13.2-.9.4",key:"1uzb3g"}],["path",{d:"m13.6 15.7-.4-.9",key:"11ifqf"}],["path",{d:"m10.8 9.2-.4-.9",key:"1pmk2v"}],["path",{d:"m15.7 13.5-.9-.4",key:"7ng02m"}],["path",{d:"m9.2 10.9-.9-.4",key:"1x66zd"}],["path",{d:"m10.5 15.7.4-.9",key:"3js94g"}],["path",{d:"m13.1 9.2.4-.9",key:"18n7mc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lc=i("Brain",[["path",{d:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z",key:"1mhkh5"}],["path",{d:"M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z",key:"1d6s00"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cc=i("BrickWall",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 9v6",key:"199k2o"}],["path",{d:"M16 15v6",key:"8rj2es"}],["path",{d:"M16 3v6",key:"1j6rpj"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M8 15v6",key:"1stoo3"}],["path",{d:"M8 3v6",key:"vlvjmk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sc=i("Briefcase",[["rect",{width:"20",height:"14",x:"2",y:"7",rx:"2",ry:"2",key:"eto64e"}],["path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"zwj3tp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ic=i("BringToFront",[["rect",{x:"8",y:"8",width:"8",height:"8",rx:"2",key:"yj20xf"}],["path",{d:"M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2",key:"1ltk23"}],["path",{d:"M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2",key:"1q24h9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jc=i("Brush",[["path",{d:"m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08",key:"1styjt"}],["path",{d:"M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z",key:"z0l1mu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bc=i("BugOff",[["path",{d:"M15 7.13V6a3 3 0 0 0-5.14-2.1L8 2",key:"vl8zik"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M22 13h-4v-2a4 4 0 0 0-4-4h-1.3",key:"1ou0bd"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M7.7 7.7A4 4 0 0 0 6 11v3a6 6 0 0 0 11.13 3.13",key:"1njkjs"}],["path",{d:"M12 20v-8",key:"i3yub9"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pc=i("BugPlay",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M18 11a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v3a6.1 6.1 0 0 0 2 4.5",key:"1tjixy"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"m12 12 8 5-8 5Z",key:"1ydf81"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ac=i("Bug",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zc=i("Building2",[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vc=i("Building",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["path",{d:"M9 22v-4h6v4",key:"r93iot"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hc=i("BusFront",[["path",{d:"M4 6 2 7",key:"1mqr15"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"m22 7-2-1",key:"1umjhc"}],["rect",{width:"16",height:"16",x:"4",y:"3",rx:"2",key:"1wxw4b"}],["path",{d:"M4 11h16",key:"mpoxn0"}],["path",{d:"M8 15h.01",key:"a7atzg"}],["path",{d:"M16 15h.01",key:"rnfrdf"}],["path",{d:"M6 19v2",key:"1loha6"}],["path",{d:"M18 21v-2",key:"sqyl04"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tc=i("Bus",[["path",{d:"M8 6v6",key:"18i7km"}],["path",{d:"M15 6v6",key:"1sg6z9"}],["path",{d:"M2 12h19.6",key:"de5uta"}],["path",{d:"M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",key:"1wwztk"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}],["path",{d:"M9 18h5",key:"lrx6i"}],["circle",{cx:"16",cy:"18",r:"2",key:"1v4tcr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qc=i("CableCar",[["path",{d:"M10 3h.01",key:"lbucoy"}],["path",{d:"M14 2h.01",key:"1k8aa1"}],["path",{d:"m2 9 20-5",key:"1kz0j5"}],["path",{d:"M12 12V6.5",key:"1vbrij"}],["rect",{width:"16",height:"10",x:"4",y:"12",rx:"3",key:"if91er"}],["path",{d:"M9 12v5",key:"3anwtq"}],["path",{d:"M15 12v5",key:"5xh3zn"}],["path",{d:"M4 17h16",key:"g4d7ey"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dc=i("Cable",[["path",{d:"M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z",key:"1s6oa5"}],["path",{d:"M3 5V3",key:"1k5hjh"}],["path",{d:"M7 5V3",key:"1t1388"}],["path",{d:"M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9",key:"1ytv72"}],["path",{d:"M17 21v-2",key:"ds4u3f"}],["path",{d:"M21 21v-2",key:"eo0ou"}],["path",{d:"M22 19h-6v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z",key:"sdz6o8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fc=i("CakeSlice",[["circle",{cx:"9",cy:"7",r:"2",key:"1305pl"}],["path",{d:"M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6",key:"xle13f"}],["path",{d:"M16 13H3",key:"1wpj08"}],["path",{d:"M16 17H3",key:"3lvfcd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rc=i("Cake",[["path",{d:"M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8",key:"1w3rig"}],["path",{d:"M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1",key:"n2jgmb"}],["path",{d:"M2 21h20",key:"1nyx9w"}],["path",{d:"M7 8v3",key:"1qtyvj"}],["path",{d:"M12 8v3",key:"hwp4zt"}],["path",{d:"M17 8v3",key:"1i6e5u"}],["path",{d:"M7 4h0.01",key:"hsw7lv"}],["path",{d:"M12 4h0.01",key:"1e3d8f"}],["path",{d:"M17 4h0.01",key:"p7cxgy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bc=i("Calculator",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nc=i("CalendarCheck2",[["path",{d:"M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"bce9hv"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"m16 20 2 2 4-4",key:"13tcca"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ec=i("CalendarCheck",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"m9 16 2 2 4-4",key:"19s6y9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oc=i("CalendarClock",[["path",{d:"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",key:"1osxxc"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M3 10h5",key:"r794hk"}],["path",{d:"M17.5 17.5 16 16.25V14",key:"re2vv1"}],["path",{d:"M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",key:"ame013"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uc=i("CalendarDays",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zc=i("CalendarHeart",[["path",{d:"M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7",key:"1sfrvf"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z",key:"1t7hil"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _c=i("CalendarMinus",[["path",{d:"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"3spt84"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["line",{x1:"16",x2:"22",y1:"19",y2:"19",key:"1g9955"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wc=i("CalendarOff",[["path",{d:"M4.18 4.18A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18",key:"1feomx"}],["path",{d:"M21 15.5V6a2 2 0 0 0-2-2H9.5",key:"yhw86o"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M3 10h7",key:"1wap6i"}],["path",{d:"M21 10h-5.5",key:"quycpq"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gc=i("CalendarPlus",[["path",{d:"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"3spt84"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["line",{x1:"19",x2:"19",y1:"16",y2:"22",key:"1ttwzi"}],["line",{x1:"16",x2:"22",y1:"19",y2:"19",key:"1g9955"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $c=i("CalendarRange",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"M17 14h-6",key:"bkmgh3"}],["path",{d:"M13 18H7",key:"bb0bb7"}],["path",{d:"M7 14h.01",key:"1qa3f1"}],["path",{d:"M17 18h.01",key:"1bdyru"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xc=i("CalendarSearch",[["path",{d:"M21 12V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7.5",key:"18ncp8"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z",key:"mgbru4"}],["path",{d:"m22 22-1.5-1.5",key:"1x83k4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kc=i("CalendarX2",[["path",{d:"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"3spt84"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["line",{x1:"17",x2:"22",y1:"17",y2:"22",key:"xa9o8b"}],["line",{x1:"17",x2:"22",y1:"22",y2:"17",key:"18nitg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qc=i("CalendarX",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["line",{x1:"10",x2:"14",y1:"14",y2:"18",key:"1g3qc0"}],["line",{x1:"14",x2:"10",y1:"14",y2:"18",key:"1az83m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=i("Calendar",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yc=i("CameraOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16",key:"qmtpty"}],["path",{d:"M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5",key:"1ufyfc"}],["path",{d:"M14.121 15.121A3 3 0 1 1 9.88 10.88",key:"11zox6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jc=i("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const el=i("CandlestickChart",[["path",{d:"M9 5v4",key:"14uxtq"}],["rect",{width:"4",height:"6",x:"7",y:"9",rx:"1",key:"f4fvz0"}],["path",{d:"M9 15v2",key:"r5rk32"}],["path",{d:"M17 3v2",key:"1l2re6"}],["rect",{width:"4",height:"8",x:"15",y:"5",rx:"1",key:"z38je5"}],["path",{d:"M17 13v3",key:"5l0wba"}],["path",{d:"M3 3v18h18",key:"1s2lah"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tl=i("CandyCane",[["path",{d:"M5.7 21a2 2 0 0 1-3.5-2l8.6-14a6 6 0 0 1 10.4 6 2 2 0 1 1-3.464-2 2 2 0 1 0-3.464-2Z",key:"isaq8g"}],["path",{d:"M17.75 7 15 2.1",key:"12x7e8"}],["path",{d:"M10.9 4.8 13 9",key:"100a87"}],["path",{d:"m7.9 9.7 2 4.4",key:"ntfhaj"}],["path",{d:"M4.9 14.7 7 18.9",key:"1x43jy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nl=i("CandyOff",[["path",{d:"m8.5 8.5-1 1a4.95 4.95 0 0 0 7 7l1-1",key:"1ff4ui"}],["path",{d:"M11.843 6.187A4.947 4.947 0 0 1 16.5 7.5a4.947 4.947 0 0 1 1.313 4.657",key:"1sbrv4"}],["path",{d:"M14 16.5V14",key:"1maf8j"}],["path",{d:"M14 6.5v1.843",key:"1a6u6t"}],["path",{d:"M10 10v7.5",key:"80pj65"}],["path",{d:"m16 7 1-5 1.367.683A3 3 0 0 0 19.708 3H21v1.292a3 3 0 0 0 .317 1.341L22 7l-5 1",key:"11a9mt"}],["path",{d:"m8 17-1 5-1.367-.683A3 3 0 0 0 4.292 21H3v-1.292a3 3 0 0 0-.317-1.341L2 17l5-1",key:"3mjmon"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const al=i("Candy",[["path",{d:"m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z",key:"ue6khb"}],["path",{d:"M14 6.5v10",key:"5xnk7c"}],["path",{d:"M10 7.5v10",key:"1uew51"}],["path",{d:"m16 7 1-5 1.37.68A3 3 0 0 0 19.7 3H21v1.3c0 .46.1.92.32 1.33L22 7l-5 1",key:"b9cp6k"}],["path",{d:"m8 17-1 5-1.37-.68A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.32-1.33L2 17l5-1",key:"5lney8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const il=i("CarFront",[["path",{d:"m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",key:"1imjwt"}],["path",{d:"M7 14h.01",key:"1qa3f1"}],["path",{d:"M17 14h.01",key:"7oqj8z"}],["rect",{width:"18",height:"8",x:"3",y:"10",rx:"2",key:"a7itu8"}],["path",{d:"M5 18v2",key:"ppbyun"}],["path",{d:"M19 18v2",key:"gy7782"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rl=i("CarTaxiFront",[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",key:"1imjwt"}],["path",{d:"M7 14h.01",key:"1qa3f1"}],["path",{d:"M17 14h.01",key:"7oqj8z"}],["rect",{width:"18",height:"8",x:"3",y:"10",rx:"2",key:"a7itu8"}],["path",{d:"M5 18v2",key:"ppbyun"}],["path",{d:"M19 18v2",key:"gy7782"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ol=i("Car",[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sl=i("Caravan",[["rect",{width:"4",height:"4",x:"2",y:"9",key:"1vcvhd"}],["rect",{width:"4",height:"10",x:"10",y:"9",key:"1b7ev2"}],["path",{d:"M18 19V9a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a2 2 0 0 0 2 2h2",key:"19jm3t"}],["circle",{cx:"8",cy:"19",r:"2",key:"t8fc5s"}],["path",{d:"M10 19h12v-2",key:"1yu2qx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cl=i("Carrot",[["path",{d:"M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46",key:"rfqxbe"}],["path",{d:"M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z",key:"6b25w4"}],["path",{d:"M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z",key:"fn65lo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ll=i("CaseLower",[["circle",{cx:"7",cy:"12",r:"3",key:"12clwm"}],["path",{d:"M10 9v6",key:"17i7lo"}],["circle",{cx:"17",cy:"12",r:"3",key:"gl7c2s"}],["path",{d:"M14 7v8",key:"dl84cr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dl=i("CaseSensitive",[["path",{d:"m3 15 4-8 4 8",key:"1vwr6u"}],["path",{d:"M4 13h6",key:"1r9ots"}],["circle",{cx:"18",cy:"12",r:"3",key:"1kchzo"}],["path",{d:"M21 9v6",key:"anns31"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hl=i("CaseUpper",[["path",{d:"m3 15 4-8 4 8",key:"1vwr6u"}],["path",{d:"M4 13h6",key:"1r9ots"}],["path",{d:"M15 11h4.5a2 2 0 0 1 0 4H15V7h4a2 2 0 0 1 0 4",key:"1sqfas"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ul=i("CassetteTape",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["circle",{cx:"8",cy:"10",r:"2",key:"1xl4ub"}],["path",{d:"M8 12h8",key:"1wcyev"}],["circle",{cx:"16",cy:"10",r:"2",key:"r14t7q"}],["path",{d:"m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3",key:"l01ucn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yl=i("Cast",[["path",{d:"M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6",key:"3zrzxg"}],["path",{d:"M2 12a9 9 0 0 1 8 8",key:"g6cvee"}],["path",{d:"M2 16a5 5 0 0 1 4 4",key:"1y1dii"}],["line",{x1:"2",x2:"2.01",y1:"20",y2:"20",key:"xu2jvo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pl=i("Castle",[["path",{d:"M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z",key:"109fe4"}],["path",{d:"M18 11V4H6v7",key:"mon5oj"}],["path",{d:"M15 22v-4a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3v4",key:"jdggr9"}],["path",{d:"M22 11V9",key:"3zbp94"}],["path",{d:"M2 11V9",key:"1x5rnq"}],["path",{d:"M6 4V2",key:"1rsq15"}],["path",{d:"M18 4V2",key:"1jsdo1"}],["path",{d:"M10 4V2",key:"75d9ly"}],["path",{d:"M14 4V2",key:"8nj3z6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kl=i("Cat",[["path",{d:"M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",key:"x6xyqk"}],["path",{d:"M8 14v.5",key:"1nzgdb"}],["path",{d:"M16 14v.5",key:"1lajdz"}],["path",{d:"M11.25 16.25h1.5L12 17l-.75-.75Z",key:"12kq1m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fl=i("Cctv",[["path",{d:"M7 9h.01",key:"19b3jx"}],["path",{d:"M16.75 12H22l-3.5 7-3.09-4.32",key:"1h9vqe"}],["path",{d:"M18 9.5l-4 8-10.39-5.2a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3Z",key:"q5d122"}],["path",{d:"M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15",key:"19bib8"}],["path",{d:"M2 21v-4",key:"l40lih"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ml=i("CheckCheck",[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M1=i("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gl=i("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xl=i("CheckSquare2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vl=i("CheckSquare",[["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}],["path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",key:"1jnkn4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w1=i("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ml=i("ChefHat",[["path",{d:"M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z",key:"z3ra2g"}],["line",{x1:"6",x2:"18",y1:"17",y2:"17",key:"12q60k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wl=i("Cherry",[["path",{d:"M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z",key:"cvxqlc"}],["path",{d:"M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z",key:"1ostrc"}],["path",{d:"M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12",key:"hqx58h"}],["path",{d:"M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z",key:"eykp1o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ll=i("ChevronDownCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 10-4 4-4-4",key:"894hmk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cl=i("ChevronDownSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m16 10-4 4-4-4",key:"894hmk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ha=i("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sl=i("ChevronFirst",[["path",{d:"m17 18-6-6 6-6",key:"1yerx2"}],["path",{d:"M7 6v12",key:"1p53r6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Il=i("ChevronLast",[["path",{d:"m7 18 6-6-6-6",key:"lwmzdw"}],["path",{d:"M17 6v12",key:"1o0aio"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jl=i("ChevronLeftCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m14 16-4-4 4-4",key:"ojs7w8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bl=i("ChevronLeftSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m14 16-4-4 4-4",key:"ojs7w8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pl=i("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Al=i("ChevronRightCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m10 8 4 4-4 4",key:"1wy4r4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zl=i("ChevronRightSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m10 8 4 4-4 4",key:"1wy4r4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ja=i("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vl=i("ChevronUpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m8 14 4-4 4 4",key:"fy2ptz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hl=i("ChevronUpSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m8 14 4-4 4 4",key:"fy2ptz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tl=i("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ql=i("ChevronsDownUp",[["path",{d:"m7 20 5-5 5 5",key:"13a0gw"}],["path",{d:"m7 4 5 5 5-5",key:"1kwcof"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dl=i("ChevronsDown",[["path",{d:"m7 6 5 5 5-5",key:"1lc07p"}],["path",{d:"m7 13 5 5 5-5",key:"1d48rs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fl=i("ChevronsLeftRight",[["path",{d:"m9 7-5 5 5 5",key:"j5w590"}],["path",{d:"m15 7 5 5-5 5",key:"1bl6da"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rl=i("ChevronsLeft",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bl=i("ChevronsRightLeft",[["path",{d:"m20 17-5-5 5-5",key:"30x0n2"}],["path",{d:"m4 17 5-5-5-5",key:"16spf4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nl=i("ChevronsRight",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const El=i("ChevronsUpDown",[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ol=i("ChevronsUp",[["path",{d:"m17 11-5-5-5 5",key:"e8nh98"}],["path",{d:"m17 18-5-5-5 5",key:"2avn1x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ul=i("Chrome",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["line",{x1:"21.17",x2:"12",y1:"8",y2:"8",key:"a0cw5f"}],["line",{x1:"3.95",x2:"8.54",y1:"6.06",y2:"14",key:"1kftof"}],["line",{x1:"10.88",x2:"15.46",y1:"21.94",y2:"14",key:"1ymyh8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zl=i("Church",[["path",{d:"m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2",key:"gy5gyo"}],["path",{d:"M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4",key:"cpkuc4"}],["path",{d:"M18 22V5l-6-3-6 3v17",key:"1hsnhq"}],["path",{d:"M12 7v5",key:"ma6bk"}],["path",{d:"M10 9h4",key:"u4k05v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _l=i("CigaretteOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M12 12H2v4h14",key:"91gsaq"}],["path",{d:"M22 12v4",key:"142cbu"}],["path",{d:"M18 12h-.5",key:"12ymji"}],["path",{d:"M7 12v4",key:"jqww69"}],["path",{d:"M18 8c0-2.5-2-2.5-2-5",key:"1il607"}],["path",{d:"M22 8c0-2.5-2-2.5-2-5",key:"1gah44"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wl=i("Cigarette",[["path",{d:"M18 12H2v4h16",key:"2rt1hm"}],["path",{d:"M22 12v4",key:"142cbu"}],["path",{d:"M7 12v4",key:"jqww69"}],["path",{d:"M18 8c0-2.5-2-2.5-2-5",key:"1il607"}],["path",{d:"M22 8c0-2.5-2-2.5-2-5",key:"1gah44"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gl=i("CircleDashed",[["path",{d:"M10.1 2.18a9.93 9.93 0 0 1 3.8 0",key:"1qdqn0"}],["path",{d:"M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7",key:"1bq7p6"}],["path",{d:"M21.82 10.1a9.93 9.93 0 0 1 0 3.8",key:"1rlaqf"}],["path",{d:"M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69",key:"1xk03u"}],["path",{d:"M13.9 21.82a9.94 9.94 0 0 1-3.8 0",key:"l7re25"}],["path",{d:"M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7",key:"1v18p6"}],["path",{d:"M2.18 13.9a9.93 9.93 0 0 1 0-3.8",key:"xdo6bj"}],["path",{d:"M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69",key:"1jjmaz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $l=i("CircleDollarSign",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 18V6",key:"zqpxq5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xl=i("CircleDotDashed",[["path",{d:"M10.1 2.18a9.93 9.93 0 0 1 3.8 0",key:"1qdqn0"}],["path",{d:"M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7",key:"1bq7p6"}],["path",{d:"M21.82 10.1a9.93 9.93 0 0 1 0 3.8",key:"1rlaqf"}],["path",{d:"M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69",key:"1xk03u"}],["path",{d:"M13.9 21.82a9.94 9.94 0 0 1-3.8 0",key:"l7re25"}],["path",{d:"M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7",key:"1v18p6"}],["path",{d:"M2.18 13.9a9.93 9.93 0 0 1 0-3.8",key:"xdo6bj"}],["path",{d:"M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69",key:"1jjmaz"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kl=i("CircleDot",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ql=i("CircleEllipsis",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M17 12h.01",key:"1m0b6t"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M7 12h.01",key:"eqddd0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yl=i("CircleEqual",[["path",{d:"M7 10h10",key:"1101jm"}],["path",{d:"M7 14h10",key:"1mhdw3"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jl=i("CircleOff",[["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M8.35 2.69A10 10 0 0 1 21.3 15.65",key:"1pfsoa"}],["path",{d:"M19.08 19.08A10 10 0 1 1 4.92 4.92",key:"1ablyi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cn=i("CircleSlash2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M22 2 2 22",key:"y4kqgn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e0=i("CircleSlash",[["line",{x1:"9",x2:"15",y1:"15",y2:"9",key:"1dfufj"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sn=i("CircleUserRound",[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const In=i("CircleUser",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t0=i("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n0=i("CircuitBoard",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M11 9h4a2 2 0 0 0 2-2V3",key:"1ve2rv"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"M7 21v-4a2 2 0 0 1 2-2h4",key:"1fwkro"}],["circle",{cx:"15",cy:"15",r:"2",key:"3i40o0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a0=i("Citrus",[["path",{d:"M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z",key:"4ite01"}],["path",{d:"M19.65 15.66A8 8 0 0 1 8.35 4.34",key:"1gxipu"}],["path",{d:"m14 10-5.5 5.5",key:"92pfem"}],["path",{d:"M14 17.85V10H6.15",key:"xqmtsk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i0=i("Clapperboard",[["path",{d:"M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z",key:"1tn4o7"}],["path",{d:"m6.2 5.3 3.1 3.9",key:"iuk76l"}],["path",{d:"m12.4 3.4 3.1 4",key:"6hsd6n"}],["path",{d:"M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",key:"ltgou9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r0=i("ClipboardCheck",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o0=i("ClipboardCopy",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s0=i("ClipboardEdit",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z",key:"1rgxu8"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5",key:"cereej"}],["path",{d:"M4 13.5V6a2 2 0 0 1 2-2h2",key:"5ua5vh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c0=i("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l0=i("ClipboardPaste",[["path",{d:"M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z",key:"1pp7kr"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10",key:"2ik1ml"}],["path",{d:"m17 10 4 4-4 4",key:"vp2hj1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d0=i("ClipboardSignature",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5",key:"1but9f"}],["path",{d:"M16 4h2a2 2 0 0 1 1.73 1",key:"1p8n7l"}],["path",{d:"M18.42 9.61a2.1 2.1 0 1 1 2.97 2.97L16.95 17 13 18l.99-3.95 4.43-4.44Z",key:"johvi5"}],["path",{d:"M8 18h1",key:"13wk12"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h0=i("ClipboardType",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M9 12v-1h6v1",key:"iehl6m"}],["path",{d:"M11 17h2",key:"12w5me"}],["path",{d:"M12 11v6",key:"1bwqyc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u0=i("ClipboardX",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m15 11-6 6",key:"1toa9n"}],["path",{d:"m9 11 6 6",key:"wlibny"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y0=i("Clipboard",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p0=i("Clock1",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 14.5 8",key:"12zbmj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k0=i("Clock10",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 8 10",key:"atfzqc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f0=i("Clock11",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 9.5 8",key:"l5bg6f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m0=i("Clock12",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12",key:"1fub01"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g0=i("Clock2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 10",key:"1g230d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x0=i("Clock3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16.5 12",key:"1aq6pp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v0=i("Clock4",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M0=i("Clock5",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 14.5 16",key:"1pcbox"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w0=i("Clock6",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 12 16.5",key:"hb2qv6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L0=i("Clock7",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 9.5 16",key:"ka3394"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C0=i("Clock8",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 8 14",key:"tmc9b4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S0=i("Clock9",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 7.5 12",key:"1k60p0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ua=i("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I0=i("CloudCog",[["circle",{cx:"12",cy:"17",r:"3",key:"1spfwm"}],["path",{d:"M4.2 15.1A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2",key:"zaobp"}],["path",{d:"m15.7 18.4-.9-.3",key:"4qxpbn"}],["path",{d:"m9.2 15.9-.9-.3",key:"17q7o2"}],["path",{d:"m10.6 20.7.3-.9",key:"1pf4s2"}],["path",{d:"m13.1 14.2.3-.9",key:"1mnuqm"}],["path",{d:"m13.6 20.7-.4-1",key:"1jpd1m"}],["path",{d:"m10.8 14.3-.4-1",key:"17ugyy"}],["path",{d:"m8.3 18.6 1-.4",key:"s42vdx"}],["path",{d:"m14.7 15.8 1-.4",key:"2wizun"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j0=i("CloudDrizzle",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M8 19v1",key:"1dk2by"}],["path",{d:"M8 14v1",key:"84yxot"}],["path",{d:"M16 19v1",key:"v220m7"}],["path",{d:"M16 14v1",key:"g12gj6"}],["path",{d:"M12 21v1",key:"q8vafk"}],["path",{d:"M12 16v1",key:"1mx6rx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b0=i("CloudFog",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M16 17H7",key:"pygtm1"}],["path",{d:"M17 21H9",key:"1u2q02"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P0=i("CloudHail",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M16 14v2",key:"a1is7l"}],["path",{d:"M8 14v2",key:"1e9m6t"}],["path",{d:"M16 20h.01",key:"xwek51"}],["path",{d:"M8 20h.01",key:"1vjney"}],["path",{d:"M12 16v2",key:"z66u1j"}],["path",{d:"M12 22h.01",key:"1urd7a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A0=i("CloudLightning",[["path",{d:"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",key:"1cez44"}],["path",{d:"m13 12-3 5h4l-3 5",key:"1t22er"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z0=i("CloudMoonRain",[["path",{d:"M10.083 9A6.002 6.002 0 0 1 16 4a4.243 4.243 0 0 0 6 6c0 2.22-1.206 4.16-3 5.197",key:"u82z8m"}],["path",{d:"M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24",key:"1qmrp3"}],["path",{d:"M11 20v2",key:"174qtz"}],["path",{d:"M7 19v2",key:"12npes"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V0=i("CloudMoon",[["path",{d:"M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z",key:"p44pc9"}],["path",{d:"M10.1 9A6 6 0 0 1 16 4a4.24 4.24 0 0 0 6 6 6 6 0 0 1-3 5.197",key:"16nha0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H0=i("CloudOff",[["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193",key:"yfwify"}],["path",{d:"M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07",key:"jlfiyv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T0=i("CloudRainWind",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"m9.2 22 3-7",key:"sb5f6j"}],["path",{d:"m9 13-3 7",key:"500co5"}],["path",{d:"m17 13-3 7",key:"8t2fiy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q0=i("CloudRain",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M16 14v6",key:"1j4efv"}],["path",{d:"M8 14v6",key:"17c4r9"}],["path",{d:"M12 16v6",key:"c8a4gj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D0=i("CloudSnow",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M8 15h.01",key:"a7atzg"}],["path",{d:"M8 19h.01",key:"puxtts"}],["path",{d:"M12 17h.01",key:"p32p05"}],["path",{d:"M12 21h.01",key:"h35vbk"}],["path",{d:"M16 15h.01",key:"rnfrdf"}],["path",{d:"M16 19h.01",key:"1vcnzz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F0=i("CloudSunRain",[["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128",key:"dpwdj0"}],["path",{d:"M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24",key:"1qmrp3"}],["path",{d:"M11 20v2",key:"174qtz"}],["path",{d:"M7 19v2",key:"12npes"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R0=i("CloudSun",[["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128",key:"dpwdj0"}],["path",{d:"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z",key:"s09mg5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B0=i("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N0=i("Cloudy",[["path",{d:"M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"gqqjvc"}],["path",{d:"M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5",key:"1p2s76"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E0=i("Clover",[["path",{d:"M16.2 3.8a2.7 2.7 0 0 0-3.81 0l-.4.38-.4-.4a2.7 2.7 0 0 0-3.82 0C6.73 4.85 6.67 6.64 8 8l4 4 4-4c1.33-1.36 1.27-3.15.2-4.2z",key:"1gxwox"}],["path",{d:"M8 8c-1.36-1.33-3.15-1.27-4.2-.2a2.7 2.7 0 0 0 0 3.81l.38.4-.4.4a2.7 2.7 0 0 0 0 3.82C4.85 17.27 6.64 17.33 8 16",key:"il7z7z"}],["path",{d:"M16 16c1.36 1.33 3.15 1.27 4.2.2a2.7 2.7 0 0 0 0-3.81l-.38-.4.4-.4a2.7 2.7 0 0 0 0-3.82C19.15 6.73 17.36 6.67 16 8",key:"15bpx2"}],["path",{d:"M7.8 20.2a2.7 2.7 0 0 0 3.81 0l.4-.38.4.4a2.7 2.7 0 0 0 3.82 0c1.06-1.06 1.12-2.85-.21-4.21l-4-4-4 4c-1.33 1.36-1.27 3.15-.2 4.2z",key:"v9mug8"}],["path",{d:"m7 17-5 5",key:"1py3mz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O0=i("Club",[["path",{d:"M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z",key:"27yuqz"}],["path",{d:"M12 17.66L12 22",key:"ogfahf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U0=i("Code2",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z0=i("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _0=i("Codepen",[["polygon",{points:"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2",key:"srzb37"}],["line",{x1:"12",x2:"12",y1:"22",y2:"15.5",key:"1t73f2"}],["polyline",{points:"22 8.5 12 15.5 2 8.5",key:"ajlxae"}],["polyline",{points:"2 15.5 12 8.5 22 15.5",key:"susrui"}],["line",{x1:"12",x2:"12",y1:"2",y2:"8.5",key:"2cldga"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W0=i("Codesandbox",[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}],["polyline",{points:"7.5 4.21 12 6.81 16.5 4.21",key:"fabo96"}],["polyline",{points:"7.5 19.79 7.5 14.6 3 12",key:"z377f1"}],["polyline",{points:"21 12 16.5 14.6 16.5 19.79",key:"9nrev1"}],["polyline",{points:"3.27 6.96 12 12.01 20.73 6.96",key:"1180pa"}],["line",{x1:"12",x2:"12",y1:"22.08",y2:"12",key:"3z3uq6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G0=i("Coffee",[["path",{d:"M17 8h1a4 4 0 1 1 0 8h-1",key:"jx4kbh"}],["path",{d:"M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z",key:"1bxrl0"}],["line",{x1:"6",x2:"6",y1:"2",y2:"4",key:"1cr9l3"}],["line",{x1:"10",x2:"10",y1:"2",y2:"4",key:"170wym"}],["line",{x1:"14",x2:"14",y1:"2",y2:"4",key:"1c5f70"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $0=i("Cog",[["path",{d:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",key:"sobvz5"}],["path",{d:"M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",key:"11i496"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 22v-2",key:"1osdcq"}],["path",{d:"m17 20.66-1-1.73",key:"eq3orb"}],["path",{d:"M11 10.27 7 3.34",key:"16pf9h"}],["path",{d:"m20.66 17-1.73-1",key:"sg0v6f"}],["path",{d:"m3.34 7 1.73 1",key:"1ulond"}],["path",{d:"M14 12h8",key:"4f43i9"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"m20.66 7-1.73 1",key:"1ow05n"}],["path",{d:"m3.34 17 1.73-1",key:"nuk764"}],["path",{d:"m17 3.34-1 1.73",key:"2wel8s"}],["path",{d:"m11 13.73-4 6.93",key:"794ttg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X0=i("Coins",[["circle",{cx:"8",cy:"8",r:"6",key:"3yglwk"}],["path",{d:"M18.09 10.37A6 6 0 1 1 10.34 18",key:"t5s6rm"}],["path",{d:"M7 6h1v4",key:"1obek4"}],["path",{d:"m16.71 13.88.7.71-2.82 2.82",key:"1rbuyh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jn=i("Columns2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 3v18",key:"108xh3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bn=i("Columns3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K0=i("Columns4",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7.5 3v18",key:"w0wo6v"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M16.5 3v18",key:"10tjh1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q0=i("Combine",[["rect",{width:"8",height:"8",x:"2",y:"2",rx:"2",key:"z1hh3n"}],["path",{d:"M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2",key:"83orz6"}],["path",{d:"M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2",key:"k86dmt"}],["path",{d:"M10 18H5c-1.7 0-3-1.3-3-3v-1",key:"6vokjl"}],["polyline",{points:"7 21 10 18 7 15",key:"1k02g0"}],["rect",{width:"8",height:"8",x:"14",y:"14",rx:"2",key:"1fa9i4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y0=i("Command",[["path",{d:"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",key:"11bfej"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J0=i("Compass",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76",key:"m9r19z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ed=i("Component",[["path",{d:"M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z",key:"1kciei"}],["path",{d:"m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z",key:"1ome0g"}],["path",{d:"M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z",key:"vbupec"}],["path",{d:"m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z",key:"16csic"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const td=i("Computer",[["rect",{width:"14",height:"8",x:"5",y:"2",rx:"2",key:"wc9tft"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",key:"w68u3i"}],["path",{d:"M6 18h2",key:"rwmk9e"}],["path",{d:"M12 18h6",key:"aqd8w3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nd=i("ConciergeBell",[["path",{d:"M2 18a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2v-2Z",key:"1co3i8"}],["path",{d:"M20 16a8 8 0 1 0-16 0",key:"1pa543"}],["path",{d:"M12 4v4",key:"1bq03y"}],["path",{d:"M10 4h4",key:"1xpv9s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ad=i("Cone",[["path",{d:"m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98",key:"53pte7"}],["ellipse",{cx:"12",cy:"19",rx:"9",ry:"3",key:"1ji25f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const id=i("Construction",[["rect",{x:"2",y:"6",width:"20",height:"8",rx:"1",key:"1estib"}],["path",{d:"M17 14v7",key:"7m2elx"}],["path",{d:"M7 14v7",key:"1cm7wv"}],["path",{d:"M17 3v3",key:"1v4jwn"}],["path",{d:"M7 3v3",key:"7o6guu"}],["path",{d:"M10 14 2.3 6.3",key:"1023jk"}],["path",{d:"m14 6 7.7 7.7",key:"1s8pl2"}],["path",{d:"m8 6 8 8",key:"hl96qh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rd=i("Contact2",[["path",{d:"M16 18a4 4 0 0 0-8 0",key:"1lzouq"}],["circle",{cx:"12",cy:"11",r:"3",key:"itu57m"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["line",{x1:"8",x2:"8",y1:"2",y2:"4",key:"1ff9gb"}],["line",{x1:"16",x2:"16",y1:"2",y2:"4",key:"1ufoma"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const od=i("Contact",[["path",{d:"M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2",key:"1mghuy"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["circle",{cx:"12",cy:"10",r:"2",key:"1yojzk"}],["line",{x1:"8",x2:"8",y1:"2",y2:"4",key:"1ff9gb"}],["line",{x1:"16",x2:"16",y1:"2",y2:"4",key:"1ufoma"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sd=i("Container",[["path",{d:"M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z",key:"1t2lqe"}],["path",{d:"M10 21.9V14L2.1 9.1",key:"o7czzq"}],["path",{d:"m10 14 11.9-6.9",key:"zm5e20"}],["path",{d:"M14 19.8v-8.1",key:"159ecu"}],["path",{d:"M18 17.5V9.4",key:"11uown"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cd=i("Contrast",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 18a6 6 0 0 0 0-12v12z",key:"j4l70d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ld=i("Cookie",[["path",{d:"M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5",key:"laymnq"}],["path",{d:"M8.5 8.5v.01",key:"ue8clq"}],["path",{d:"M16 15.5v.01",key:"14dtrp"}],["path",{d:"M12 12v.01",key:"u5ubse"}],["path",{d:"M11 17v.01",key:"1hyl5a"}],["path",{d:"M7 14v.01",key:"uct60s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dd=i("CookingPot",[["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",key:"u0tga0"}],["path",{d:"m4 8 16-4",key:"16g0ng"}],["path",{d:"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8",key:"12cejc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hd=i("CopyCheck",[["path",{d:"m12 15 2 2 4-4",key:"2c609p"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ud=i("CopyMinus",[["line",{x1:"12",x2:"18",y1:"15",y2:"15",key:"1nscbv"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yd=i("CopyPlus",[["line",{x1:"15",x2:"15",y1:"12",y2:"18",key:"1p7wdc"}],["line",{x1:"12",x2:"18",y1:"15",y2:"15",key:"1nscbv"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pd=i("CopySlash",[["line",{x1:"12",x2:"18",y1:"18",y2:"12",key:"ebkxgr"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kd=i("CopyX",[["line",{x1:"12",x2:"18",y1:"12",y2:"18",key:"1rg63v"}],["line",{x1:"12",x2:"18",y1:"18",y2:"12",key:"ebkxgr"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fd=i("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const md=i("Copyleft",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.17 14.83a4 4 0 1 0 0-5.66",key:"1sveal"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gd=i("Copyright",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M14.83 14.83a4 4 0 1 1 0-5.66",key:"1i56pz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xd=i("CornerDownLeft",[["polyline",{points:"9 10 4 15 9 20",key:"r3jprv"}],["path",{d:"M20 4v7a4 4 0 0 1-4 4H4",key:"6o5b7l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vd=i("CornerDownRight",[["polyline",{points:"15 10 20 15 15 20",key:"1q7qjw"}],["path",{d:"M4 4v7a4 4 0 0 0 4 4h12",key:"z08zvw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Md=i("CornerLeftDown",[["polyline",{points:"14 15 9 20 4 15",key:"nkc4i"}],["path",{d:"M20 4h-7a4 4 0 0 0-4 4v12",key:"nbpdq2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wd=i("CornerLeftUp",[["polyline",{points:"14 9 9 4 4 9",key:"m9oyvo"}],["path",{d:"M20 20h-7a4 4 0 0 1-4-4V4",key:"1blwi3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ld=i("CornerRightDown",[["polyline",{points:"10 15 15 20 20 15",key:"axus6l"}],["path",{d:"M4 4h7a4 4 0 0 1 4 4v12",key:"wcbgct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cd=i("CornerRightUp",[["polyline",{points:"10 9 15 4 20 9",key:"1lr6px"}],["path",{d:"M4 20h7a4 4 0 0 0 4-4V4",key:"1plgdj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sd=i("CornerUpLeft",[["polyline",{points:"9 14 4 9 9 4",key:"881910"}],["path",{d:"M20 20v-7a4 4 0 0 0-4-4H4",key:"1nkjon"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Id=i("CornerUpRight",[["polyline",{points:"15 14 20 9 15 4",key:"1tbx3s"}],["path",{d:"M4 20v-7a4 4 0 0 1 4-4h12",key:"1lu4f8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jd=i("Cpu",[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"9",y:"9",width:"6",height:"6",key:"o3kz5p"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bd=i("CreativeCommons",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",key:"1ss3eq"}],["path",{d:"M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",key:"1od56t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pd=i("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ad=i("Croissant",[["path",{d:"m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z",key:"1ozxlb"}],["path",{d:"m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83",key:"ffuyb5"}],["path",{d:"M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4",key:"osnpzi"}],["path",{d:"m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2",key:"1vubaw"}],["path",{d:"M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5",key:"wxr772"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zd=i("Crop",[["path",{d:"M6 2v14a2 2 0 0 0 2 2h14",key:"ron5a4"}],["path",{d:"M18 22V8a2 2 0 0 0-2-2H2",key:"7s9ehn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vd=i("Cross",[["path",{d:"M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z",key:"1t5g7j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hd=i("Crosshair",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"22",x2:"18",y1:"12",y2:"12",key:"l9bcsi"}],["line",{x1:"6",x2:"2",y1:"12",y2:"12",key:"13hhkx"}],["line",{x1:"12",x2:"12",y1:"6",y2:"2",key:"10w3f3"}],["line",{x1:"12",x2:"12",y1:"22",y2:"18",key:"15g9kq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Td=i("Crown",[["path",{d:"m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14",key:"zkxr6b"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qd=i("Cuboid",[["path",{d:"m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z",key:"1u2ovd"}],["path",{d:"M10 22v-8L2.25 9.15",key:"11pn4q"}],["path",{d:"m10 14 11.77-6.87",key:"1kt1wh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dd=i("CupSoda",[["path",{d:"m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8",key:"8166m8"}],["path",{d:"M5 8h14",key:"pcz4l3"}],["path",{d:"M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0",key:"yjz344"}],["path",{d:"m12 8 1-6h2",key:"3ybfa4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fd=i("Currency",[["circle",{cx:"12",cy:"12",r:"8",key:"46899m"}],["line",{x1:"3",x2:"6",y1:"3",y2:"6",key:"1jkytn"}],["line",{x1:"21",x2:"18",y1:"3",y2:"6",key:"14zfjt"}],["line",{x1:"3",x2:"6",y1:"21",y2:"18",key:"iusuec"}],["line",{x1:"21",x2:"18",y1:"21",y2:"18",key:"yj2dd7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rd=i("Cylinder",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5v14a9 3 0 0 0 18 0V5",key:"aqi0yr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bd=i("DatabaseBackup",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 12a9 3 0 0 0 5 2.69",key:"1ui2ym"}],["path",{d:"M21 9.3V5",key:"6k6cib"}],["path",{d:"M3 5v14a9 3 0 0 0 6.47 2.88",key:"i62tjy"}],["path",{d:"M12 12v4h4",key:"1bxaet"}],["path",{d:"M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16",key:"1f4ei9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nd=i("DatabaseZap",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 15 21.84",key:"14ibmq"}],["path",{d:"M21 5V8",key:"1marbg"}],["path",{d:"M21 12L18 17H22L19 22",key:"zafso"}],["path",{d:"M3 12A9 3 0 0 0 14.59 14.87",key:"1y4wr8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ed=i("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Od=i("Delete",[["path",{d:"M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z",key:"1oy587"}],["line",{x1:"18",x2:"12",y1:"9",y2:"15",key:"1olkx5"}],["line",{x1:"12",x2:"18",y1:"9",y2:"15",key:"1n50pc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ud=i("Dessert",[["circle",{cx:"12",cy:"4",r:"2",key:"muu5ef"}],["path",{d:"M10.2 3.2C5.5 4 2 8.1 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4 0c0-4.9-3.5-9-8.2-9.8",key:"lfo06j"}],["path",{d:"M3.2 14.8a9 9 0 0 0 17.6 0",key:"12xarc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd=i("Diameter",[["circle",{cx:"19",cy:"19",r:"2",key:"17f5cg"}],["circle",{cx:"5",cy:"5",r:"2",key:"1gwv83"}],["path",{d:"M6.48 3.66a10 10 0 0 1 13.86 13.86",key:"xr8kdq"}],["path",{d:"m6.41 6.41 11.18 11.18",key:"uhpjw7"}],["path",{d:"M3.66 6.48a10 10 0 0 0 13.86 13.86",key:"cldpwv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _d=i("Diamond",[["path",{d:"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",key:"1f1r0c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wd=i("Dice1",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gd=i("Dice2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M15 9h.01",key:"x1ddxp"}],["path",{d:"M9 15h.01",key:"fzyn71"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $d=i("Dice3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M16 8h.01",key:"cr5u4v"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd=i("Dice4",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M16 8h.01",key:"cr5u4v"}],["path",{d:"M8 8h.01",key:"1e4136"}],["path",{d:"M8 16h.01",key:"18s6g9"}],["path",{d:"M16 16h.01",key:"1f9h7w"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kd=i("Dice5",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M16 8h.01",key:"cr5u4v"}],["path",{d:"M8 8h.01",key:"1e4136"}],["path",{d:"M8 16h.01",key:"18s6g9"}],["path",{d:"M16 16h.01",key:"1f9h7w"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qd=i("Dice6",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M16 8h.01",key:"cr5u4v"}],["path",{d:"M16 12h.01",key:"1l6xoz"}],["path",{d:"M16 16h.01",key:"1f9h7w"}],["path",{d:"M8 8h.01",key:"1e4136"}],["path",{d:"M8 12h.01",key:"czm47f"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yd=i("Dices",[["rect",{width:"12",height:"12",x:"2",y:"10",rx:"2",ry:"2",key:"6agr2n"}],["path",{d:"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",key:"1o487t"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 14h.01",key:"ssrbsk"}],["path",{d:"M15 6h.01",key:"cblpky"}],["path",{d:"M18 9h.01",key:"2061c0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd=i("Diff",[["path",{d:"M12 3v14",key:"7cf3v8"}],["path",{d:"M5 10h14",key:"elsbfy"}],["path",{d:"M5 21h14",key:"11awu3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eh=i("Disc2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const th=i("Disc3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M6 12c0-1.7.7-3.2 1.8-4.2",key:"oqkarx"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M18 12c0 1.7-.7 3.2-1.8 4.2",key:"1eah9h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nh=i("DiscAlbum",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["circle",{cx:"12",cy:"12",r:"5",key:"nd82uf"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ah=i("Disc",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ih=i("DivideCircle",[["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}],["line",{x1:"12",x2:"12",y1:"16",y2:"16",key:"aqc6ln"}],["line",{x1:"12",x2:"12",y1:"8",y2:"8",key:"1mkcni"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rh=i("DivideSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}],["line",{x1:"12",x2:"12",y1:"16",y2:"16",key:"aqc6ln"}],["line",{x1:"12",x2:"12",y1:"8",y2:"8",key:"1mkcni"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oh=i("Divide",[["circle",{cx:"12",cy:"6",r:"1",key:"1bh7o1"}],["line",{x1:"5",x2:"19",y1:"12",y2:"12",key:"13b5wn"}],["circle",{cx:"12",cy:"18",r:"1",key:"lqb9t5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sh=i("DnaOff",[["path",{d:"M15 2c-1.35 1.5-2.092 3-2.5 4.5M9 22c1.35-1.5 2.092-3 2.5-4.5",key:"sxiaad"}],["path",{d:"M2 15c3.333-3 6.667-3 10-3m10-3c-1.5 1.35-3 2.092-4.5 2.5",key:"yn4bs1"}],["path",{d:"m17 6-2.5-2.5",key:"5cdfhj"}],["path",{d:"m14 8-1.5-1.5",key:"1ohn8i"}],["path",{d:"m7 18 2.5 2.5",key:"16tu1a"}],["path",{d:"m3.5 14.5.5.5",key:"hapbhd"}],["path",{d:"m20 9 .5.5",key:"1n7z02"}],["path",{d:"m6.5 12.5 1 1",key:"cs35ky"}],["path",{d:"m16.5 10.5 1 1",key:"696xn5"}],["path",{d:"m10 16 1.5 1.5",key:"11lckj"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ch=i("Dna",[["path",{d:"M2 15c6.667-6 13.333 0 20-6",key:"1pyr53"}],["path",{d:"M9 22c1.798-1.998 2.518-3.995 2.807-5.993",key:"q3hbxp"}],["path",{d:"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993",key:"80uv8i"}],["path",{d:"m17 6-2.5-2.5",key:"5cdfhj"}],["path",{d:"m14 8-1-1",key:"15nbz5"}],["path",{d:"m7 18 2.5 2.5",key:"16tu1a"}],["path",{d:"m3.5 14.5.5.5",key:"hapbhd"}],["path",{d:"m20 9 .5.5",key:"1n7z02"}],["path",{d:"m6.5 12.5 1 1",key:"cs35ky"}],["path",{d:"m16.5 10.5 1 1",key:"696xn5"}],["path",{d:"m10 16 1.5 1.5",key:"11lckj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lh=i("Dog",[["path",{d:"M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5",key:"19br0u"}],["path",{d:"M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5",key:"11n1an"}],["path",{d:"M8 14v.5",key:"1nzgdb"}],["path",{d:"M16 14v.5",key:"1lajdz"}],["path",{d:"M11.25 16.25h1.5L12 17l-.75-.75Z",key:"12kq1m"}],["path",{d:"M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306",key:"wsu29d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dh=i("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hh=i("Donut",[["path",{d:"M20.5 10a2.5 2.5 0 0 1-2.4-3H18a2.95 2.95 0 0 1-2.6-4.4 10 10 0 1 0 6.3 7.1c-.3.2-.8.3-1.2.3",key:"19sr3x"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uh=i("DoorClosed",[["path",{d:"M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14",key:"36qu9e"}],["path",{d:"M2 20h20",key:"owomy5"}],["path",{d:"M14 12v.01",key:"xfcn54"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yh=i("DoorOpen",[["path",{d:"M13 4h3a2 2 0 0 1 2 2v14",key:"hrm0s9"}],["path",{d:"M2 20h3",key:"1gaodv"}],["path",{d:"M13 20h9",key:"s90cdi"}],["path",{d:"M10 12v.01",key:"vx6srw"}],["path",{d:"M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z",key:"199qr4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ei=i("Dot",[["circle",{cx:"12.1",cy:"12.1",r:"1",key:"18d7e5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ph=i("DownloadCloud",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M12 12v9",key:"192myk"}],["path",{d:"m8 17 4 4 4-4",key:"1ul180"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kh=i("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fh=i("DraftingCompass",[["circle",{cx:"12",cy:"5",r:"2",key:"f1ur92"}],["path",{d:"m3 21 8.02-14.26",key:"1ssaw4"}],["path",{d:"m12.99 6.74 1.93 3.44",key:"iwagvd"}],["path",{d:"M19 12c-3.87 4-10.13 4-14 0",key:"1tsu18"}],["path",{d:"m21 21-2.16-3.84",key:"vylbct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mh=i("Drama",[["path",{d:"M10 11h.01",key:"d2at3l"}],["path",{d:"M14 6h.01",key:"k028ub"}],["path",{d:"M18 6h.01",key:"1v4wsw"}],["path",{d:"M6.5 13.1h.01",key:"1748ia"}],["path",{d:"M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3",key:"172yzv"}],["path",{d:"M17.4 9.9c-.8.8-2 .8-2.8 0",key:"1obv0w"}],["path",{d:"M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7",key:"rqjl8i"}],["path",{d:"M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4",key:"1mr6wy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gh=i("Dribbble",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94",key:"hpej1"}],["path",{d:"M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32",key:"1tr44o"}],["path",{d:"M8.56 2.75c4.37 6 6 9.42 8 17.72",key:"kbh691"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xh=i("Droplet",[["path",{d:"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",key:"c7niix"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vh=i("Droplets",[["path",{d:"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",key:"1ptgy4"}],["path",{d:"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",key:"1sl1rz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mh=i("Drum",[["path",{d:"m2 2 8 8",key:"1v6059"}],["path",{d:"m22 2-8 8",key:"173r8a"}],["ellipse",{cx:"12",cy:"9",rx:"10",ry:"5",key:"liohsx"}],["path",{d:"M7 13.4v7.9",key:"1yi6u9"}],["path",{d:"M12 14v8",key:"1tn2tj"}],["path",{d:"M17 13.4v7.9",key:"eqz2v3"}],["path",{d:"M2 9v8a10 5 0 0 0 20 0V9",key:"1750ul"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wh=i("Drumstick",[["path",{d:"M15.45 15.4c-2.13.65-4.3.32-5.7-1.1-2.29-2.27-1.76-6.5 1.17-9.42 2.93-2.93 7.15-3.46 9.43-1.18 1.41 1.41 1.74 3.57 1.1 5.71-1.4-.51-3.26-.02-4.64 1.36-1.38 1.38-1.87 3.23-1.36 4.63z",key:"1o96s0"}],["path",{d:"m11.25 15.6-2.16 2.16a2.5 2.5 0 1 1-4.56 1.73 2.49 2.49 0 0 1-1.41-4.24 2.5 2.5 0 0 1 3.14-.32l2.16-2.16",key:"14vv5h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lh=i("Dumbbell",[["path",{d:"m6.5 6.5 11 11",key:"f7oqzb"}],["path",{d:"m21 21-1-1",key:"cpc6if"}],["path",{d:"m3 3 1 1",key:"d3rpuf"}],["path",{d:"m18 22 4-4",key:"1e32o6"}],["path",{d:"m2 6 4-4",key:"189tqz"}],["path",{d:"m3 10 7-7",key:"1bxui2"}],["path",{d:"m14 21 7-7",key:"16x78n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ch=i("EarOff",[["path",{d:"M6 18.5a3.5 3.5 0 1 0 7 0c0-1.57.92-2.52 2.04-3.46",key:"1qngmn"}],["path",{d:"M6 8.5c0-.75.13-1.47.36-2.14",key:"b06bma"}],["path",{d:"M8.8 3.15A6.5 6.5 0 0 1 19 8.5c0 1.63-.44 2.81-1.09 3.76",key:"g10hsz"}],["path",{d:"M12.5 6A2.5 2.5 0 0 1 15 8.5M10 13a2 2 0 0 0 1.82-1.18",key:"ygzou7"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sh=i("Ear",[["path",{d:"M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0",key:"1dfaln"}],["path",{d:"M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4",key:"1qnva7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ih=i("EggFried",[["circle",{cx:"11.5",cy:"12.5",r:"3.5",key:"1cl1mi"}],["path",{d:"M3 8c0-3.5 2.5-6 6.5-6 5 0 4.83 3 7.5 5s5 2 5 6c0 4.5-2.5 6.5-7 6.5-2.5 0-2.5 2.5-6 2.5s-7-2-7-5.5c0-3 1.5-3 1.5-5C3.5 10 3 9 3 8Z",key:"165ef9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jh=i("EggOff",[["path",{d:"M6.399 6.399C5.362 8.157 4.65 10.189 4.5 12c-.37 4.43 1.27 9.95 7.5 10 3.256-.026 5.259-1.547 6.375-3.625",key:"6et380"}],["path",{d:"M19.532 13.875A14.07 14.07 0 0 0 19.5 12c-.36-4.34-3.95-9.96-7.5-10-1.04.012-2.082.502-3.046 1.297",key:"gcdc3f"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bh=i("Egg",[["path",{d:"M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z",key:"1c39pg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ph=i("EqualNot",[["line",{x1:"5",x2:"19",y1:"9",y2:"9",key:"1nwqeh"}],["line",{x1:"5",x2:"19",y1:"15",y2:"15",key:"g8yjpy"}],["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ah=i("Equal",[["line",{x1:"5",x2:"19",y1:"9",y2:"9",key:"1nwqeh"}],["line",{x1:"5",x2:"19",y1:"15",y2:"15",key:"g8yjpy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zh=i("Eraser",[["path",{d:"m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",key:"182aya"}],["path",{d:"M22 21H7",key:"t4ddhn"}],["path",{d:"m5 11 9 9",key:"1mo9qw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vh=i("Euro",[["path",{d:"M4 10h12",key:"1y6xl8"}],["path",{d:"M4 14h9",key:"1loblj"}],["path",{d:"M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2",key:"1j6lzo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hh=i("Expand",[["path",{d:"m21 21-6-6m6 6v-4.8m0 4.8h-4.8",key:"1c15vz"}],["path",{d:"M3 16.2V21m0 0h4.8M3 21l6-6",key:"1fsnz2"}],["path",{d:"M21 7.8V3m0 0h-4.8M21 3l-6 6",key:"hawz9i"}],["path",{d:"M3 7.8V3m0 0h4.8M3 3l6 6",key:"u9ee12"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Th=i("ExternalLink",[["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}],["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["line",{x1:"10",x2:"21",y1:"14",y2:"3",key:"18c3s4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qh=i("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dh=i("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fh=i("Facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rh=i("Factory",[["path",{d:"M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"159hny"}],["path",{d:"M17 18h1",key:"uldtlt"}],["path",{d:"M12 18h1",key:"s9uhes"}],["path",{d:"M7 18h1",key:"1neino"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bh=i("Fan",[["path",{d:"M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z",key:"484a7f"}],["path",{d:"M12 12v.01",key:"u5ubse"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nh=i("FastForward",[["polygon",{points:"13 19 22 12 13 5 13 19",key:"587y9g"}],["polygon",{points:"2 19 11 12 2 5 2 19",key:"3pweh0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eh=i("Feather",[["path",{d:"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z",key:"u4sw5n"}],["line",{x1:"16",x2:"2",y1:"8",y2:"22",key:"1c47m2"}],["line",{x1:"17.5",x2:"9",y1:"15",y2:"15",key:"2fj3pr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oh=i("Fence",[["path",{d:"M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",key:"1n2rgs"}],["path",{d:"M6 8h4",key:"utf9t1"}],["path",{d:"M6 18h4",key:"12yh4b"}],["path",{d:"m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",key:"3ha7mj"}],["path",{d:"M14 8h4",key:"1r8wg2"}],["path",{d:"M14 18h4",key:"1t3kbu"}],["path",{d:"m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",key:"dfd4e2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uh=i("FerrisWheel",[["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m6.8 15-3.5 2",key:"hjy98k"}],["path",{d:"m20.7 7-3.5 2",key:"f08gto"}],["path",{d:"M6.8 9 3.3 7",key:"1aevh4"}],["path",{d:"m20.7 17-3.5-2",key:"1liqo3"}],["path",{d:"m9 22 3-8 3 8",key:"wees03"}],["path",{d:"M8 22h8",key:"rmew8v"}],["path",{d:"M18 18.7a9 9 0 1 0-12 0",key:"dhzg4g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zh=i("Figma",[["path",{d:"M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z",key:"1340ok"}],["path",{d:"M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z",key:"1hz3m3"}],["path",{d:"M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z",key:"1oz8n2"}],["path",{d:"M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z",key:"1ff65i"}],["path",{d:"M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z",key:"pdip6e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _h=i("FileArchive",[["path",{d:"M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h8.5L20 7.5V20c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6h-2",key:"1u864v"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"10",cy:"20",r:"2",key:"1xzdoj"}],["path",{d:"M10 7V6",key:"dljcrl"}],["path",{d:"M10 12v-1",key:"v7bkov"}],["path",{d:"M10 18v-2",key:"1cjy8d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wh=i("FileAudio2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v2",key:"fkyf72"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2 17v-3a4 4 0 0 1 8 0v3",key:"1ggdre"}],["circle",{cx:"9",cy:"17",r:"1",key:"bc1fq4"}],["circle",{cx:"3",cy:"17",r:"1",key:"vo6nti"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gh=i("FileAudio",[["path",{d:"M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3",key:"1013sb"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z",key:"gqt63y"}],["path",{d:"M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z",key:"cf7lqx"}],["path",{d:"M2 19v-3a6 6 0 0 1 12 0v3",key:"1acxgf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pn=i("FileAxis3d",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M8 10v8h8",key:"tlaukw"}],["path",{d:"m8 18 4-4",key:"12zab0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $h=i("FileBadge2",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["path",{d:"M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",key:"13rien"}],["path",{d:"m14 12.5 1 5.5-3-1-3 1 1-5.5",key:"14xlky"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xh=i("FileBadge",[["path",{d:"M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-6",key:"qtddq0"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",key:"u0c8gj"}],["path",{d:"M7 16.5 8 22l-3-1-3 1 1-5.5",key:"5gm2nr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kh=i("FileBarChart2",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"M8 18v-1",key:"zg0ygc"}],["path",{d:"M16 18v-3",key:"j5jt4h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qh=i("FileBarChart",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M12 18v-4",key:"q1q25u"}],["path",{d:"M8 18v-2",key:"qcmpov"}],["path",{d:"M16 18v-6",key:"15y0np"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yh=i("FileBox",[["path",{d:"M14.5 22H18a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"h7jej2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2.97 13.12c-.6.36-.97 1.02-.97 1.74v3.28c0 .72.37 1.38.97 1.74l3 1.83c.63.39 1.43.39 2.06 0l3-1.83c.6-.36.97-1.02.97-1.74v-3.28c0-.72-.37-1.38-.97-1.74l-3-1.83a1.97 1.97 0 0 0-2.06 0l-3 1.83Z",key:"f4a3oc"}],["path",{d:"m7 17-4.74-2.85",key:"etm6su"}],["path",{d:"m7 17 4.74-2.85",key:"5xuooz"}],["path",{d:"M7 17v5",key:"1yj1jh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jh=i("FileCheck2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m3 15 2 2 4-4",key:"1lhrkk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eu=i("FileCheck",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m9 15 2 2 4-4",key:"1grp1n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tu=i("FileClock",[["path",{d:"M16 22h2c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3",key:"9lo3o3"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"8",cy:"16",r:"6",key:"10v15b"}],["path",{d:"M9.5 17.5 8 16.25V14",key:"1o80t2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nu=i("FileCode2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m9 18 3-3-3-3",key:"112psh"}],["path",{d:"m5 12-3 3 3 3",key:"oke12k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const au=i("FileCode",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m10 13-2 2 2 2",key:"17smn8"}],["path",{d:"m14 17 2-2-2-2",key:"14mezr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const An=i("FileCog",[["circle",{cx:"6",cy:"13",r:"3",key:"1z65bp"}],["path",{d:"m9.7 14.4-.9-.3",key:"o1luaq"}],["path",{d:"m3.2 11.9-.9-.3",key:"qm3zk5"}],["path",{d:"m4.6 16.7.3-.9",key:"1o0ect"}],["path",{d:"m7.6 16.7-.4-1",key:"1ym8d1"}],["path",{d:"m4.8 10.3-.4-1",key:"18q26g"}],["path",{d:"m2.3 14.6 1-.4",key:"121m88"}],["path",{d:"m8.7 11.8 1-.4",key:"9meqp2"}],["path",{d:"m7.4 9.3-.3.9",key:"136qqn"}],["path",{d:"M14 2v6h6",key:"1kof46"}],["path",{d:"M4 5.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-1.5",key:"xwe04"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iu=i("FileDiff",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"M9 10h6",key:"9gxzsh"}],["path",{d:"M9 17h6",key:"r8uit2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ru=i("FileDigit",[["rect",{width:"4",height:"6",x:"2",y:"12",rx:"2",key:"jm304g"}],["path",{d:"M14 2v6h6",key:"1kof46"}],["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["path",{d:"M10 12h2v6",key:"12zw74"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ou=i("FileDown",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const su=i("FileEdit",[["path",{d:"M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5",key:"1bg6eb"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z",key:"1rgxu8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cu=i("FileHeart",[["path",{d:"M4 6V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4",key:"dba9qu"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10.29 10.7a2.43 2.43 0 0 0-2.66-.52c-.29.12-.56.3-.78.53l-.35.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L6.5 18l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z",key:"1c1fso"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lu=i("FileImage",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"10",cy:"13",r:"2",key:"6v46hv"}],["path",{d:"m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22",key:"17vly1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const du=i("FileInput",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2 15h10",key:"jfw4w8"}],["path",{d:"m9 18 3-3-3-3",key:"112psh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hu=i("FileJson2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"fq0c9t"}],["path",{d:"M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"4gibmv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uu=i("FileJson",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"1oajmo"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"mpwhp6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yu=i("FileKey2",[["path",{d:"M4 10V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4",key:"1nw5t3"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"4",cy:"16",r:"2",key:"1ehqvc"}],["path",{d:"m10 10-4.5 4.5",key:"7fwrp6"}],["path",{d:"m9 11 1 1",key:"wa6s5q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pu=i("FileKey",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["circle",{cx:"10",cy:"16",r:"2",key:"4ckbqe"}],["path",{d:"m16 10-4.5 4.5",key:"7p3ebg"}],["path",{d:"m15 11 1 1",key:"1bsyx3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ku=i("FileLineChart",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m16 13-3.5 3.5-2-2L8 17",key:"zz7yod"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fu=i("FileLock2",[["path",{d:"M4 5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4",key:"gwd2r9"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["rect",{width:"8",height:"5",x:"2",y:"13",rx:"1",key:"10y5wo"}],["path",{d:"M8 13v-2a2 2 0 1 0-4 0v2",key:"1pdxzg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mu=i("FileLock",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["rect",{width:"8",height:"6",x:"8",y:"12",rx:"1",key:"3yr8at"}],["path",{d:"M15 12v-2a3 3 0 1 0-6 0v2",key:"1nqnhw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gu=i("FileMinus2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M3 15h6",key:"4e2qda"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xu=i("FileMinus",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"9",x2:"15",y1:"15",y2:"15",key:"110plj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vu=i("FileMusic",[["circle",{cx:"14",cy:"16",r:"2",key:"1bzzi3"}],["circle",{cx:"6",cy:"18",r:"2",key:"1fncim"}],["path",{d:"M4 12.4V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-7.5",key:"skc018"}],["path",{d:"M8 18v-7.7L16 9v7",key:"1oie6o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mu=i("FileOutput",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2 15h10",key:"jfw4w8"}],["path",{d:"m5 12-3 3 3 3",key:"oke12k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wu=i("FilePieChart",[["path",{d:"M16 22h2a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3",key:"zhyrez"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M4.04 11.71a5.84 5.84 0 1 0 8.2 8.29",key:"f1t5jc"}],["path",{d:"M13.83 16A5.83 5.83 0 0 0 8 10.17V16h5.83Z",key:"7q54ec"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lu=i("FilePlus2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M3 15h6",key:"4e2qda"}],["path",{d:"M6 12v6",key:"1u72j0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cu=i("FilePlus",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"12",x2:"12",y1:"18",y2:"12",key:"1tsf04"}],["line",{x1:"9",x2:"15",y1:"15",y2:"15",key:"110plj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Su=i("FileQuestion",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["path",{d:"M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2",key:"1umxtm"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iu=i("FileScan",[["path",{d:"M20 10V7.5L14.5 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h4.5",key:"uvikde"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M16 22a2 2 0 0 1-2-2",key:"1wqh5n"}],["path",{d:"M20 22a2 2 0 0 0 2-2",key:"1l9q4k"}],["path",{d:"M20 14a2 2 0 0 1 2 2",key:"1ny6zw"}],["path",{d:"M16 14a2 2 0 0 0-2 2",key:"ceaadl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ju=i("FileSearch2",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"11.5",cy:"14.5",r:"2.5",key:"1bq0ko"}],["path",{d:"M13.25 16.25 15 18",key:"9eh8bj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bu=i("FileSearch",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3",key:"am10z3"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",key:"ychnub"}],["path",{d:"m9 18-1.5-1.5",key:"1j6qii"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pu=i("FileSignature",[["path",{d:"M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8.5L18 5.5",key:"kd5d3"}],["path",{d:"M8 18h1",key:"13wk12"}],["path",{d:"M18.42 9.61a2.1 2.1 0 1 1 2.97 2.97L16.95 17 13 18l.99-3.95 4.43-4.44Z",key:"johvi5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Au=i("FileSpreadsheet",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M14 17h2",key:"10kma7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zu=i("FileStack",[["path",{d:"M16 2v5h5",key:"kt2in0"}],["path",{d:"M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17l4 4z",key:"1km23n"}],["path",{d:"M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15",key:"16874u"}],["path",{d:"M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11",key:"k2ox98"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vu=i("FileSymlink",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v7",key:"138uzh"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m10 18 3-3-3-3",key:"18f6ys"}],["path",{d:"M4 18v-1a2 2 0 0 1 2-2h6",key:"5uz2rn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hu=i("FileTerminal",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m8 16 2-2-2-2",key:"10vzyd"}],["path",{d:"M12 18h4",key:"1wd2n7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tu=i("FileText",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"16",x2:"8",y1:"13",y2:"13",key:"14keom"}],["line",{x1:"16",x2:"8",y1:"17",y2:"17",key:"17nazh"}],["line",{x1:"10",x2:"8",y1:"9",y2:"9",key:"1a5vjj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qu=i("FileType2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2 13v-1h6v1",key:"1dh9dg"}],["path",{d:"M4 18h2",key:"1xrofg"}],["path",{d:"M5 12v6",key:"150t9c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Du=i("FileType",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M9 13v-1h6v1",key:"1bb014"}],["path",{d:"M11 18h2",key:"12mj7e"}],["path",{d:"M12 12v6",key:"3ahymv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fu=i("FileUp",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ru=i("FileVideo2",[["path",{d:"M4 8V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4",key:"1nti49"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m10 15.5 4 2.5v-6l-4 2.5",key:"t7cp39"}],["rect",{width:"8",height:"6",x:"2",y:"12",rx:"1",key:"1a6c1e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bu=i("FileVideo",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m10 11 5 3-5 3v-6Z",key:"7ntvm4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nu=i("FileVolume2",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M11.5 13.5c.32.4.5.94.5 1.5s-.18 1.1-.5 1.5",key:"joawwx"}],["path",{d:"M15 12c.64.8 1 1.87 1 3s-.36 2.2-1 3",key:"1f2wyw"}],["path",{d:"M8 15h.01",key:"a7atzg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eu=i("FileVolume",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3",key:"am10z3"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m7 10-3 2H2v4h2l3 2v-8Z",key:"tazg57"}],["path",{d:"M11 11c.64.8 1 1.87 1 3s-.36 2.2-1 3",key:"1yej3m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ou=i("FileWarning",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uu=i("FileX2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["path",{d:"M14 2v6h6",key:"1kof46"}],["path",{d:"m3 12.5 5 5",key:"1qls4r"}],["path",{d:"m8 12.5-5 5",key:"b853mi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zu=i("FileX",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"9.5",x2:"14.5",y1:"12.5",y2:"17.5",key:"izs6du"}],["line",{x1:"14.5",x2:"9.5",y1:"12.5",y2:"17.5",key:"1lehlj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _u=i("File",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wu=i("Files",[["path",{d:"M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z",key:"cennsq"}],["path",{d:"M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8",key:"ms809a"}],["path",{d:"M15 2v5h5",key:"qq6kwv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gu=i("Film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $u=i("FilterX",[["path",{d:"M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055",key:"1fi1da"}],["path",{d:"m22 3-5 5",key:"12jva0"}],["path",{d:"m17 3 5 5",key:"k36vhe"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ya=i("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xu=i("Fingerprint",[["path",{d:"M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4",key:"1jc9o5"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2",key:"1mxgy1"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2",key:"1fgabc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ku=i("FireExtinguisher",[["path",{d:"M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5",key:"sqyvz"}],["path",{d:"M9 18h8",key:"i7pszb"}],["path",{d:"M18 3h-3",key:"7idoqj"}],["path",{d:"M11 3a6 6 0 0 0-6 6v11",key:"1v5je3"}],["path",{d:"M5 13h4",key:"svpcxo"}],["path",{d:"M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z",key:"vsjego"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qu=i("FishOff",[["path",{d:"M18 12.47v.03m0-.5v.47m-.475 5.056A6.744 6.744 0 0 1 15 18c-3.56 0-7.56-2.53-8.5-6 .348-1.28 1.114-2.433 2.121-3.38m3.444-2.088A8.802 8.802 0 0 1 15 6c3.56 0 6.06 2.54 7 6-.309 1.14-.786 2.177-1.413 3.058",key:"1j1hse"}],["path",{d:"M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33m7.48-4.372A9.77 9.77 0 0 1 16 6.07m0 11.86a9.77 9.77 0 0 1-1.728-3.618",key:"1q46z8"}],["path",{d:"m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98M8.53 3h5.27a2 2 0 0 1 1.98 1.67l.23 1.4M2 2l20 20",key:"1407gh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yu=i("FishSymbol",[["path",{d:"M2 16s9-15 20-4C11 23 2 8 2 8",key:"h4oh4o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ju=i("Fish",[["path",{d:"M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z",key:"15baut"}],["path",{d:"M18 12v.5",key:"18hhni"}],["path",{d:"M16 17.93a9.77 9.77 0 0 1 0-11.86",key:"16dt7o"}],["path",{d:"M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33",key:"l9di03"}],["path",{d:"M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4",key:"1kjonw"}],["path",{d:"m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98",key:"1zlm23"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ey=i("FlagOff",[["path",{d:"M8 2c3 0 5 2 8 2s4-1 4-1v11",key:"9rwyz9"}],["path",{d:"M4 22V4",key:"1plyxx"}],["path",{d:"M4 15s1-1 4-1 5 2 8 2",key:"1myooe"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ty=i("FlagTriangleLeft",[["path",{d:"M17 22V2L7 7l10 5",key:"1rmf0r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ny=i("FlagTriangleRight",[["path",{d:"M7 22V2l10 5-10 5",key:"17n18y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ay=i("Flag",[["path",{d:"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z",key:"i9b6wo"}],["line",{x1:"4",x2:"4",y1:"22",y2:"15",key:"1cm3nv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iy=i("FlameKindling",[["path",{d:"M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z",key:"1ir223"}],["path",{d:"m5 22 14-4",key:"1brv4h"}],["path",{d:"m5 18 14 4",key:"lgyyje"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ry=i("Flame",[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oy=i("FlashlightOff",[["path",{d:"M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4",key:"1r120k"}],["path",{d:"M7 2h11v4c0 2-2 2-2 4v1",key:"dz1920"}],["line",{x1:"11",x2:"18",y1:"6",y2:"6",key:"bi1vpe"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sy=i("Flashlight",[["path",{d:"M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z",key:"1orkel"}],["line",{x1:"6",x2:"18",y1:"6",y2:"6",key:"1z11jq"}],["line",{x1:"12",x2:"12",y1:"12",y2:"12",key:"1f4yc1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cy=i("FlaskConicalOff",[["path",{d:"M10 10 4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-1.272-2.542",key:"59ek9y"}],["path",{d:"M10 2v2.343",key:"15t272"}],["path",{d:"M14 2v6.343",key:"sxr80q"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M7 16h9",key:"t5njau"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ly=i("FlaskConical",[["path",{d:"M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",key:"pzvekw"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dy=i("FlaskRound",[["path",{d:"M10 2v7.31",key:"5d1hyh"}],["path",{d:"M14 9.3V1.99",key:"14k4l0"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M14 9.3a6.5 6.5 0 1 1-4 0",key:"1r8fvy"}],["path",{d:"M5.52 16h12.96",key:"46hh1i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hy=i("FlipHorizontal2",[["path",{d:"m3 7 5 5-5 5V7",key:"couhi7"}],["path",{d:"m21 7-5 5 5 5V7",key:"6ouia7"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 2v2",key:"tus03m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uy=i("FlipHorizontal",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3",key:"1i73f7"}],["path",{d:"M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3",key:"saxlbk"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 2v2",key:"tus03m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yy=i("FlipVertical2",[["path",{d:"m17 3-5 5-5-5h10",key:"1ftt6x"}],["path",{d:"m17 21-5-5-5 5h10",key:"1m0wmu"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const py=i("FlipVertical",[["path",{d:"M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3",key:"14bfxa"}],["path",{d:"M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3",key:"14rx03"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ky=i("Flower2",[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",key:"3pnvol"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M12 10v12",key:"6ubwww"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z",key:"9hd38g"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z",key:"ufn41s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fy=i("Flower",[["path",{d:"M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15",key:"51z86h"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"m8 16 1.5-1.5",key:"ce6zph"}],["path",{d:"M14.5 9.5 16 8",key:"1kzrzb"}],["path",{d:"m8 8 1.5 1.5",key:"1yv88w"}],["path",{d:"M14.5 14.5 16 16",key:"12xhjh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const my=i("Focus",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gy=i("FoldHorizontal",[["path",{d:"M2 12h6",key:"1wqiqv"}],["path",{d:"M22 12h-6",key:"1eg9hc"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m19 9-3 3 3 3",key:"12ol22"}],["path",{d:"m5 15 3-3-3-3",key:"1kdhjc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xy=i("FoldVertical",[["path",{d:"M12 22v-6",key:"6o8u61"}],["path",{d:"M12 8V2",key:"1wkif3"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}],["path",{d:"m15 19-3-3-3 3",key:"e37ymu"}],["path",{d:"m15 5-3 3-3-3",key:"19d6lf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vy=i("FolderArchive",[["circle",{cx:"15",cy:"19",r:"2",key:"u2pros"}],["path",{d:"M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1",key:"1jj40k"}],["path",{d:"M15 11v-1",key:"cntcp"}],["path",{d:"M15 17v-2",key:"1279jj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const My=i("FolderCheck",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"m9 13 2 2 4-4",key:"6343dt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wy=i("FolderClock",[["circle",{cx:"16",cy:"16",r:"6",key:"qoo3c4"}],["path",{d:"M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2",key:"1urifu"}],["path",{d:"M16 14v2l1 1",key:"xth2jh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ly=i("FolderClosed",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M2 10h20",key:"1ir3d8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zn=i("FolderCog",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["path",{d:"M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.3",key:"1k8050"}],["path",{d:"m21.7 19.4-.9-.3",key:"1qgwi9"}],["path",{d:"m15.2 16.9-.9-.3",key:"1t7mvx"}],["path",{d:"m16.6 21.7.3-.9",key:"1j67ps"}],["path",{d:"m19.1 15.2.3-.9",key:"18r7jp"}],["path",{d:"m19.6 21.7-.4-1",key:"z2vh2"}],["path",{d:"m16.8 15.3-.4-1",key:"1ei7r6"}],["path",{d:"m14.3 19.6 1-.4",key:"11sv9r"}],["path",{d:"m20.7 16.8 1-.4",key:"19m87a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cy=i("FolderDot",[["path",{d:"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",key:"1fr9dc"}],["circle",{cx:"12",cy:"13",r:"1",key:"49l61u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sy=i("FolderDown",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"m15 13-3 3-3-3",key:"6j2sf0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iy=i("FolderEdit",[["path",{d:"M8.4 10.6a2.1 2.1 0 1 1 2.99 2.98L6 19l-4 1 1-3.9Z",key:"10ocjb"}],["path",{d:"M2 11.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5",key:"1h3cz8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jy=i("FolderGit2",[["path",{d:"M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5",key:"1w6njk"}],["circle",{cx:"13",cy:"12",r:"2",key:"1j92g6"}],["path",{d:"M18 19c-2.8 0-5-2.2-5-5v8",key:"pkpw2h"}],["circle",{cx:"20",cy:"19",r:"2",key:"1obnsp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const by=i("FolderGit",[["circle",{cx:"12",cy:"13",r:"2",key:"1c1ljs"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M14 13h3",key:"1dgedf"}],["path",{d:"M7 13h3",key:"1pygq7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Py=i("FolderHeart",[["path",{d:"M11 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.5",key:"6hud8k"}],["path",{d:"M13.9 17.45c-1.2-1.2-1.14-2.8-.2-3.73a2.43 2.43 0 0 1 3.44 0l.36.34.34-.34a2.43 2.43 0 0 1 3.45-.01v0c.95.95 1 2.53-.2 3.74L17.5 21Z",key:"vgq86i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ay=i("FolderInput",[["path",{d:"M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",key:"fm4g5t"}],["path",{d:"M2 13h10",key:"pgb2dq"}],["path",{d:"m9 16 3-3-3-3",key:"6m91ic"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zy=i("FolderKanban",[["path",{d:"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",key:"1fr9dc"}],["path",{d:"M8 10v4",key:"tgpxqk"}],["path",{d:"M12 10v2",key:"hh53o1"}],["path",{d:"M16 10v6",key:"1d6xys"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vy=i("FolderKey",[["circle",{cx:"16",cy:"20",r:"2",key:"1vifvg"}],["path",{d:"M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2",key:"3hgo9p"}],["path",{d:"m22 14-4.5 4.5",key:"1ef6z8"}],["path",{d:"m21 15 1 1",key:"1ejcpy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hy=i("FolderLock",[["rect",{width:"8",height:"5",x:"14",y:"17",rx:"1",key:"19aais"}],["path",{d:"M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",key:"1w6v7t"}],["path",{d:"M20 17v-2a2 2 0 1 0-4 0v2",key:"pwaxnr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ty=i("FolderMinus",[["path",{d:"M9 13h6",key:"1uhe8q"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qy=i("FolderOpenDot",[["path",{d:"m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2",key:"1nmvlm"}],["circle",{cx:"14",cy:"15",r:"1",key:"1gm4qj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dy=i("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fy=i("FolderOutput",[["path",{d:"M2 7.5V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2",key:"jm8npq"}],["path",{d:"M2 13h10",key:"pgb2dq"}],["path",{d:"m5 10-3 3 3 3",key:"1r8ie0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ry=i("FolderPlus",[["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1uhe8q"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const By=i("FolderRoot",[["path",{d:"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",key:"1fr9dc"}],["circle",{cx:"12",cy:"13",r:"2",key:"1c1ljs"}],["path",{d:"M12 15v5",key:"11xva1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ny=i("FolderSearch2",[["circle",{cx:"11.5",cy:"12.5",r:"2.5",key:"1ea5ju"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M13.3 14.3 15 16",key:"1y4v1n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ey=i("FolderSearch",[["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["path",{d:"M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1",key:"1bw5m7"}],["path",{d:"m21 21-1.5-1.5",key:"3sg1j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oy=i("FolderSymlink",[["path",{d:"M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2",key:"1or2t8"}],["path",{d:"m8 16 3-3-3-3",key:"rlqrt1"}],["path",{d:"M2 16v-1a2 2 0 0 1 2-2h6",key:"pgw8ln"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uy=i("FolderSync",[["path",{d:"M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1",key:"1rkwto"}],["path",{d:"M12 10v4h4",key:"1czhmt"}],["path",{d:"m12 14 1.5-1.5c.9-.9 2.2-1.5 3.5-1.5s2.6.6 3.5 1.5c.4.4.8 1 1 1.5",key:"25wejs"}],["path",{d:"M22 22v-4h-4",key:"1ewp4q"}],["path",{d:"m22 18-1.5 1.5c-.9.9-2.1 1.5-3.5 1.5s-2.6-.6-3.5-1.5c-.4-.4-.8-1-1-1.5",key:"vlp1j8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zy=i("FolderTree",[["path",{d:"M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",key:"hod4my"}],["path",{d:"M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",key:"w4yl2u"}],["path",{d:"M3 5a2 2 0 0 0 2 2h3",key:"f2jnh7"}],["path",{d:"M3 3v13a2 2 0 0 0 2 2h3",key:"k8epm1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _y=i("FolderUp",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"m9 13 3-3 3 3",key:"1pxg3c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wy=i("FolderX",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"m9.5 10.5 5 5",key:"ra9qjz"}],["path",{d:"m14.5 10.5-5 5",key:"l2rkpq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gy=i("Folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $y=i("Folders",[["path",{d:"M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z",key:"4u7rpt"}],["path",{d:"M2 8v11a2 2 0 0 0 2 2h14",key:"1eicx1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xy=i("Footprints",[["path",{d:"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z",key:"1dudjm"}],["path",{d:"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z",key:"l2t8xc"}],["path",{d:"M16 17h4",key:"1dejxt"}],["path",{d:"M4 13h4",key:"1bwh8b"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ky=i("Forklift",[["path",{d:"M12 12H5a2 2 0 0 0-2 2v5",key:"7zsz91"}],["circle",{cx:"13",cy:"19",r:"2",key:"wjnkru"}],["circle",{cx:"5",cy:"19",r:"2",key:"v8kfzx"}],["path",{d:"M8 19h3m5-17v17h6M6 12V7c0-1.1.9-2 2-2h3l5 5",key:"13bk1p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qy=i("FormInput",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M17 12h.01",key:"1m0b6t"}],["path",{d:"M7 12h.01",key:"eqddd0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yy=i("Forward",[["polyline",{points:"15 17 20 12 15 7",key:"1w3sku"}],["path",{d:"M4 18v-2a4 4 0 0 1 4-4h12",key:"jmiej9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jy=i("Frame",[["line",{x1:"22",x2:"2",y1:"6",y2:"6",key:"15w7dq"}],["line",{x1:"22",x2:"2",y1:"18",y2:"18",key:"1ip48p"}],["line",{x1:"6",x2:"6",y1:"2",y2:"22",key:"a2lnyx"}],["line",{x1:"18",x2:"18",y1:"2",y2:"22",key:"8vb6jd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ep=i("Framer",[["path",{d:"M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7",key:"1a2nng"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tp=i("Frown",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 16s-1.5-2-4-2-4 2-4 2",key:"epbg0q"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const np=i("Fuel",[["line",{x1:"3",x2:"15",y1:"22",y2:"22",key:"xegly4"}],["line",{x1:"4",x2:"14",y1:"9",y2:"9",key:"xcnuvu"}],["path",{d:"M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18",key:"16j0yd"}],["path",{d:"M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5",key:"8ur5zv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ap=i("Fullscreen",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["rect",{width:"10",height:"8",x:"7",y:"8",rx:"1",key:"vys8me"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ip=i("FunctionSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3",key:"m1af9g"}],["path",{d:"M9 11.2h5.7",key:"3zgcl2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rp=i("GalleryHorizontalEnd",[["path",{d:"M2 7v10",key:"a2pl2d"}],["path",{d:"M6 5v14",key:"1kq3d7"}],["rect",{width:"12",height:"18",x:"10",y:"3",rx:"2",key:"13i7bc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const op=i("GalleryHorizontal",[["path",{d:"M2 3v18",key:"pzttux"}],["rect",{width:"12",height:"18",x:"6",y:"3",rx:"2",key:"btr8bg"}],["path",{d:"M22 3v18",key:"6jf3v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sp=i("GalleryThumbnails",[["rect",{width:"18",height:"14",x:"3",y:"3",rx:"2",key:"74y24f"}],["path",{d:"M4 21h1",key:"16zlid"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 21h1",key:"v9vybs"}],["path",{d:"M19 21h1",key:"edywat"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cp=i("GalleryVerticalEnd",[["path",{d:"M7 2h10",key:"nczekb"}],["path",{d:"M5 6h14",key:"u2x4p"}],["rect",{width:"18",height:"12",x:"3",y:"10",rx:"2",key:"l0tzu3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lp=i("GalleryVertical",[["path",{d:"M3 2h18",key:"15qxfx"}],["rect",{width:"18",height:"12",x:"3",y:"6",rx:"2",key:"1439r6"}],["path",{d:"M3 22h18",key:"8prr45"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dp=i("Gamepad2",[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hp=i("Gamepad",[["line",{x1:"6",x2:"10",y1:"12",y2:"12",key:"161bw2"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"15",x2:"15.01",y1:"13",y2:"13",key:"dqpgro"}],["line",{x1:"18",x2:"18.01",y1:"11",y2:"11",key:"meh2c"}],["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vn=i("GanttChartSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 8h7",key:"kbo1nt"}],["path",{d:"M8 12h6",key:"ikassy"}],["path",{d:"M11 16h5",key:"oq65wt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const up=i("GanttChart",[["path",{d:"M8 6h10",key:"9lnwnk"}],["path",{d:"M6 12h9",key:"1g9pqf"}],["path",{d:"M11 18h7",key:"c8dzvl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yp=i("GaugeCircle",[["path",{d:"M15.6 2.7a10 10 0 1 0 5.7 5.7",key:"1e0p6d"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M13.4 10.6 19 5",key:"1kr7tw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pp=i("Gauge",[["path",{d:"m12 14 4-4",key:"9kzdfg"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0",key:"19p75a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kp=i("Gavel",[["path",{d:"m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8",key:"15492f"}],["path",{d:"m16 16 6-6",key:"vzrcl6"}],["path",{d:"m8 8 6-6",key:"18bi4p"}],["path",{d:"m9 7 8 8",key:"5jnvq1"}],["path",{d:"m21 11-8-8",key:"z4y7zo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fp=i("Gem",[["path",{d:"M6 3h12l4 6-10 13L2 9Z",key:"1pcd5k"}],["path",{d:"M11 3 8 9l4 13 4-13-3-6",key:"1fcu3u"}],["path",{d:"M2 9h20",key:"16fsjt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mp=i("Ghost",[["path",{d:"M9 10h.01",key:"qbtxuw"}],["path",{d:"M15 10h.01",key:"1qmjsl"}],["path",{d:"M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",key:"uwwb07"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gp=i("Gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xp=i("GitBranchPlus",[["path",{d:"M6 3v12",key:"qpgusn"}],["path",{d:"M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",key:"1d02ji"}],["path",{d:"M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",key:"chk6ph"}],["path",{d:"M15 6a9 9 0 0 0-9 9",key:"or332x"}],["path",{d:"M18 15v6",key:"9wciyi"}],["path",{d:"M21 18h-6",key:"139f0c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vp=i("GitBranch",[["line",{x1:"6",x2:"6",y1:"3",y2:"15",key:"17qcm7"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M18 9a9 9 0 0 1-9 9",key:"n2h4wq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hn=i("GitCommitHorizontal",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["line",{x1:"3",x2:"9",y1:"12",y2:"12",key:"1dyftd"}],["line",{x1:"15",x2:"21",y1:"12",y2:"12",key:"oup4p8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mp=i("GitCommitVertical",[["path",{d:"M12 3v6",key:"1holv5"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M12 15v6",key:"a9ows0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wp=i("GitCompareArrows",[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M12 6h5a2 2 0 0 1 2 2v7",key:"1yj91y"}],["path",{d:"m15 9-3-3 3-3",key:"1lwv8l"}],["circle",{cx:"19",cy:"18",r:"3",key:"1qljk2"}],["path",{d:"M12 18H7a2 2 0 0 1-2-2V9",key:"16sdep"}],["path",{d:"m9 15 3 3-3 3",key:"1m3kbl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lp=i("GitCompare",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M13 6h3a2 2 0 0 1 2 2v7",key:"1yeb86"}],["path",{d:"M11 18H8a2 2 0 0 1-2-2V9",key:"19pyzm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cp=i("GitFork",[["circle",{cx:"12",cy:"18",r:"3",key:"1mpf1b"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["path",{d:"M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9",key:"1uq4wg"}],["path",{d:"M12 12v3",key:"158kv8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sp=i("GitGraph",[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M5 9v6",key:"158jrl"}],["circle",{cx:"5",cy:"18",r:"3",key:"104gr9"}],["path",{d:"M12 3v18",key:"108xh3"}],["circle",{cx:"19",cy:"6",r:"3",key:"108a5v"}],["path",{d:"M16 15.7A9 9 0 0 0 19 9",key:"1e3vqb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ip=i("GitMerge",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 21V9a9 9 0 0 0 9 9",key:"7kw0sc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jp=i("GitPullRequestArrow",[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M5 9v12",key:"ih889a"}],["circle",{cx:"19",cy:"18",r:"3",key:"1qljk2"}],["path",{d:"m15 9-3-3 3-3",key:"1lwv8l"}],["path",{d:"M12 6h5a2 2 0 0 1 2 2v7",key:"1yj91y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bp=i("GitPullRequestClosed",[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 9v12",key:"1sc30k"}],["path",{d:"m21 3-6 6",key:"16nqsk"}],["path",{d:"m21 9-6-6",key:"9j17rh"}],["path",{d:"M18 11.5V15",key:"65xf6f"}],["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pp=i("GitPullRequestCreateArrow",[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M5 9v12",key:"ih889a"}],["path",{d:"m15 9-3-3 3-3",key:"1lwv8l"}],["path",{d:"M12 6h5a2 2 0 0 1 2 2v3",key:"1rbwk6"}],["path",{d:"M19 15v6",key:"10aioa"}],["path",{d:"M22 18h-6",key:"1d5gi5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ap=i("GitPullRequestCreate",[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 9v12",key:"1sc30k"}],["path",{d:"M13 6h3a2 2 0 0 1 2 2v3",key:"1jb6z3"}],["path",{d:"M18 15v6",key:"9wciyi"}],["path",{d:"M21 18h-6",key:"139f0c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zp=i("GitPullRequestDraft",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M18 6V5",key:"1oao2s"}],["path",{d:"M18 11v-1",key:"11c8tz"}],["line",{x1:"6",x2:"6",y1:"9",y2:"21",key:"rroup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vp=i("GitPullRequest",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M13 6h3a2 2 0 0 1 2 2v7",key:"1yeb86"}],["line",{x1:"6",x2:"6",y1:"9",y2:"21",key:"rroup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hp=i("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tp=i("Gitlab",[["path",{d:"m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z",key:"148pdi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qp=i("GlassWater",[["path",{d:"M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z",key:"48rfw3"}],["path",{d:"M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0",key:"mjntcy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dp=i("Glasses",[["circle",{cx:"6",cy:"15",r:"4",key:"vux9w4"}],["circle",{cx:"18",cy:"15",r:"4",key:"18o8ve"}],["path",{d:"M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2",key:"1ag4bs"}],["path",{d:"M2.5 13 5 7c.7-1.3 1.4-2 3-2",key:"1hm1gs"}],["path",{d:"M21.5 13 19 7c-.7-1.3-1.5-2-3-2",key:"1r31ai"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fp=i("Globe2",[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17",key:"1fi5u6"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"xsiumc"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rp=i("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bp=i("Goal",[["path",{d:"M12 13V2l8 4-8 4",key:"5wlwwj"}],["path",{d:"M20.55 10.23A9 9 0 1 1 8 4.94",key:"5988i3"}],["path",{d:"M8 10a5 5 0 1 0 8.9 2.02",key:"1hq7ot"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Np=i("Grab",[["path",{d:"M18 11.5V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4",key:"n5nng"}],["path",{d:"M14 10V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2",key:"185i9d"}],["path",{d:"M10 9.9V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5",key:"11pz95"}],["path",{d:"M6 14v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0",key:"16yk7l"}],["path",{d:"M18 11v0a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0",key:"nzvb1c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ep=i("GraduationCap",[["path",{d:"M22 10v6M2 10l10-5 10 5-10 5z",key:"1ef52a"}],["path",{d:"M6 12v5c3 3 9 3 12 0v-5",key:"1f75yj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Op=i("Grape",[["path",{d:"M22 5V2l-5.89 5.89",key:"1eenpo"}],["circle",{cx:"16.6",cy:"15.89",r:"3",key:"xjtalx"}],["circle",{cx:"8.11",cy:"7.4",r:"3",key:"u2fv6i"}],["circle",{cx:"12.35",cy:"11.65",r:"3",key:"i6i8g7"}],["circle",{cx:"13.91",cy:"5.85",r:"3",key:"6ye0dv"}],["circle",{cx:"18.15",cy:"10.09",r:"3",key:"snx9no"}],["circle",{cx:"6.56",cy:"13.2",r:"3",key:"17x4xg"}],["circle",{cx:"10.8",cy:"17.44",r:"3",key:"1hogw9"}],["circle",{cx:"5",cy:"19",r:"3",key:"1sn6vo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=i("Grid2x2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M12 3v18",key:"108xh3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=i("Grid3x3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Up=i("GripHorizontal",[["circle",{cx:"12",cy:"9",r:"1",key:"124mty"}],["circle",{cx:"19",cy:"9",r:"1",key:"1ruzo2"}],["circle",{cx:"5",cy:"9",r:"1",key:"1a8b28"}],["circle",{cx:"12",cy:"15",r:"1",key:"1e56xg"}],["circle",{cx:"19",cy:"15",r:"1",key:"1a92ep"}],["circle",{cx:"5",cy:"15",r:"1",key:"5r1jwy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zp=i("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _p=i("Grip",[["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"19",cy:"5",r:"1",key:"w8mnmm"}],["circle",{cx:"5",cy:"5",r:"1",key:"lttvr7"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}],["circle",{cx:"19",cy:"19",r:"1",key:"shf9b7"}],["circle",{cx:"5",cy:"19",r:"1",key:"bfqh0e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wp=i("Group",[["path",{d:"M3 7V5c0-1.1.9-2 2-2h2",key:"adw53z"}],["path",{d:"M17 3h2c1.1 0 2 .9 2 2v2",key:"an4l38"}],["path",{d:"M21 17v2c0 1.1-.9 2-2 2h-2",key:"144t0e"}],["path",{d:"M7 21H5c-1.1 0-2-.9-2-2v-2",key:"rtnfgi"}],["rect",{width:"7",height:"5",x:"7",y:"7",rx:"1",key:"1eyiv7"}],["rect",{width:"7",height:"5",x:"10",y:"12",rx:"1",key:"1qlmkx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gp=i("Guitar",[["path",{d:"m20 7 1.7-1.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0L17 4v3Z",key:"15ixgv"}],["path",{d:"m17 7-5.1 5.1",key:"l9guh7"}],["circle",{cx:"11.5",cy:"12.5",r:".5",key:"1evg0a"}],["path",{d:"M6 12a2 2 0 0 0 1.8-1.2l.4-.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4",key:"x9fguj"}],["path",{d:"m6 16 2 2",key:"16qmzd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $p=i("Hammer",[["path",{d:"m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9",key:"1afvon"}],["path",{d:"M17.64 15 22 10.64",key:"zsji6s"}],["path",{d:"m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91",key:"lehyy1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xp=i("HandMetal",[["path",{d:"M18 12.5V10a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4",key:"7eki13"}],["path",{d:"M14 11V9a2 2 0 1 0-4 0v2",key:"94qvcw"}],["path",{d:"M10 10.5V5a2 2 0 1 0-4 0v9",key:"m1ah89"}],["path",{d:"m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5",key:"t1skq1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L1=i("Hand",[["path",{d:"M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0",key:"aigmz7"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2",key:"1n6bmn"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8",key:"a9iiix"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"1s1gnw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kp=i("HardDriveDownload",[["path",{d:"M12 2v8",key:"1q4o3n"}],["path",{d:"m16 6-4 4-4-4",key:"6wukr"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",key:"w68u3i"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 18h.01",key:"h775k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qp=i("HardDriveUpload",[["path",{d:"m16 6-4-4-4 4",key:"13yo43"}],["path",{d:"M12 2v8",key:"1q4o3n"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",key:"w68u3i"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 18h.01",key:"h775k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yp=i("HardDrive",[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jp=i("HardHat",[["path",{d:"M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z",key:"1dej2m"}],["path",{d:"M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5",key:"1p9q5i"}],["path",{d:"M4 15v-3a6 6 0 0 1 6-6h0",key:"1uc279"}],["path",{d:"M14 6h0a6 6 0 0 1 6 6v3",key:"1j9mnm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ek=i("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tk=i("Haze",[["path",{d:"m5.2 6.2 1.4 1.4",key:"17imol"}],["path",{d:"M2 13h2",key:"13gyu8"}],["path",{d:"M20 13h2",key:"16rner"}],["path",{d:"m17.4 7.6 1.4-1.4",key:"t4xlah"}],["path",{d:"M22 17H2",key:"1gtaj3"}],["path",{d:"M22 21H2",key:"1gy6en"}],["path",{d:"M16 13a4 4 0 0 0-8 0",key:"1dyczq"}],["path",{d:"M12 5V2.5",key:"1vytko"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nk=i("HdmiPort",[["path",{d:"M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z",key:"2128wb"}],["path",{d:"M7.5 12h9",key:"1t0ckc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ak=i("Heading1",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"m17 12 3-2v8",key:"1hhhft"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ik=i("Heading2",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1",key:"9jr5yi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rk=i("Heading3",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2",key:"68ncm8"}],["path",{d:"M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2",key:"1ejuhz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ok=i("Heading4",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"M17 10v4h4",key:"13sv97"}],["path",{d:"M21 10v8",key:"1kdml4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sk=i("Heading5",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"M17 13v-3h4",key:"1nvgqp"}],["path",{d:"M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17",key:"2nebdn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ck=i("Heading6",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["circle",{cx:"19",cy:"16",r:"2",key:"15mx69"}],["path",{d:"M20 10c-2 2-3 3.5-3 6",key:"f35dl0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lk=i("Heading",[["path",{d:"M6 12h12",key:"8npq4p"}],["path",{d:"M6 20V4",key:"1w1bmo"}],["path",{d:"M18 20V4",key:"o2hl4u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dk=i("Headphones",[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hk=i("HeartCrack",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"m12 13-1-1 2-2-3-3 2-2",key:"xjdxli"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uk=i("HeartHandshake",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66",key:"12sd6o"}],["path",{d:"m18 15-2-2",key:"60u0ii"}],["path",{d:"m15 18-2-2",key:"6p76be"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yk=i("HeartOff",[["line",{x1:"2",y1:"2",x2:"22",y2:"22",key:"1w4vcy"}],["path",{d:"M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35",key:"3mpagl"}],["path",{d:"M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17",key:"1gh3v3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pk=i("HeartPulse",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",key:"1uw2ng"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=i("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kk=i("HelpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fk=i("HelpingHand",[["path",{d:"m3 15 5.12-5.12A3 3 0 0 1 10.24 9H13a2 2 0 1 1 0 4h-2.5m4-.68 4.17-4.89a1.88 1.88 0 0 1 2.92 2.36l-4.2 5.94A3 3 0 0 1 14.96 17H9.83a2 2 0 0 0-1.42.59L7 19",key:"nitrv7"}],["path",{d:"m2 14 6 6",key:"g6j1uo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mk=i("Hexagon",[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gk=i("Highlighter",[["path",{d:"m9 11-6 6v3h9l3-3",key:"1a3l36"}],["path",{d:"m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4",key:"14a9rk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xk=i("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C1=i("Home",[["path",{d:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"y5dka4"}],["polyline",{points:"9 22 9 12 15 12 15 22",key:"e2us08"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vk=i("HopOff",[["path",{d:"M17.5 5.5C19 7 20.5 9 21 11c-1.323.265-2.646.39-4.118.226",key:"10j95a"}],["path",{d:"M5.5 17.5C7 19 9 20.5 11 21c.5-2.5.5-5-1-8.5",key:"1mqyjd"}],["path",{d:"M17.5 17.5c-2.5 0-4 0-6-1",key:"11elt5"}],["path",{d:"M20 11.5c1 1.5 2 3.5 2 4.5",key:"13ezvz"}],["path",{d:"M11.5 20c1.5 1 3.5 2 4.5 2 .5-1.5 0-3-.5-4.5",key:"1ufrz1"}],["path",{d:"M22 22c-2 0-3.5-.5-5.5-1.5",key:"1n8vbj"}],["path",{d:"M4.783 4.782C1.073 8.492 1 14.5 5 18c1-1 2-4.5 1.5-6.5 1.5 1 4 1 5.5.5M8.227 2.57C11.578 1.335 15.453 2.089 18 5c-.88.88-3.7 1.761-5.726 1.618",key:"1h85u8"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mk=i("Hop",[["path",{d:"M17.5 5.5C19 7 20.5 9 21 11c-2.5.5-5 .5-8.5-1",key:"l0z2za"}],["path",{d:"M5.5 17.5C7 19 9 20.5 11 21c.5-2.5.5-5-1-8.5",key:"1mqyjd"}],["path",{d:"M16.5 11.5c1 2 1 3.5 1 6-2.5 0-4 0-6-1",key:"10xoad"}],["path",{d:"M20 11.5c1 1.5 2 3.5 2 4.5-1.5.5-3 0-4.5-.5",key:"1a4gpx"}],["path",{d:"M11.5 20c1.5 1 3.5 2 4.5 2 .5-1.5 0-3-.5-4.5",key:"1ufrz1"}],["path",{d:"M20.5 16.5c1 2 1.5 3.5 1.5 5.5-2 0-3.5-.5-5.5-1.5",key:"1ok5d2"}],["path",{d:"M4.783 4.782C8.493 1.072 14.5 1 18 5c-1 1-4.5 2-6.5 1.5 1 1.5 1 4 .5 5.5-1.5.5-4 .5-5.5-.5C7 13.5 6 17 5 18c-4-3.5-3.927-9.508-.217-13.218Z",key:"8hlroy"}],["path",{d:"M4.5 4.5 3 3c-.184-.185-.184-.816 0-1",key:"q3aj97"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wk=i("Hotel",[["path",{d:"M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z",key:"p9z69c"}],["path",{d:"m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16",key:"1bvcvh"}],["path",{d:"M8 7h.01",key:"1vti4s"}],["path",{d:"M16 7h.01",key:"1kdx03"}],["path",{d:"M12 7h.01",key:"1ivr5q"}],["path",{d:"M12 11h.01",key:"z322tv"}],["path",{d:"M16 11h.01",key:"xkw8gn"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M10 22v-6.5m4 0V22",key:"16gs4s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lk=i("Hourglass",[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ck=i("IceCream2",[["path",{d:"M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6Zm-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0",key:"g86ewz"}],["path",{d:"M12.14 11a3.5 3.5 0 1 1 6.71 0",key:"4k3m1s"}],["path",{d:"M15.5 6.5a3.5 3.5 0 1 0-7 0",key:"zmuahr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sk=i("IceCream",[["path",{d:"m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11",key:"1v6356"}],["path",{d:"M17 7A5 5 0 0 0 7 7",key:"151p3v"}],["path",{d:"M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4",key:"1sdaij"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ik=i("ImageDown",[["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10.8",key:"sqts6f"}],["path",{d:"m21 15-3.1-3.1a2 2 0 0 0-2.814.014L6 21",key:"1h47z9"}],["path",{d:"m14 19.5 3 3v-6",key:"1x9jmo"}],["path",{d:"m17 22.5 3-3",key:"xzuz0n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jk=i("ImageMinus",[["path",{d:"M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",key:"m87ecr"}],["line",{x1:"16",x2:"22",y1:"5",y2:"5",key:"ez7e4s"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bk=i("ImageOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M10.41 10.41a2 2 0 1 1-2.83-2.83",key:"1bzlo9"}],["line",{x1:"13.5",x2:"6",y1:"13.5",y2:"21",key:"1q0aeu"}],["line",{x1:"18",x2:"21",y1:"12",y2:"15",key:"5mozeu"}],["path",{d:"M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",key:"mmje98"}],["path",{d:"M21 15V5a2 2 0 0 0-2-2H9",key:"43el77"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pk=i("ImagePlus",[["path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",key:"31hg93"}],["line",{x1:"16",x2:"22",y1:"5",y2:"5",key:"ez7e4s"}],["line",{x1:"19",x2:"19",y1:"2",y2:"8",key:"1gkr8c"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ak=i("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zk=i("Import",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m8 11 4 4 4-4",key:"1dohi6"}],["path",{d:"M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4",key:"1ywtjm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vk=i("Inbox",[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hk=i("Indent",[["polyline",{points:"3 8 7 12 3 16",key:"f3rxhf"}],["line",{x1:"21",x2:"11",y1:"12",y2:"12",key:"1fxxak"}],["line",{x1:"21",x2:"11",y1:"6",y2:"6",key:"asgu94"}],["line",{x1:"21",x2:"11",y1:"18",y2:"18",key:"13dsj7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tk=i("IndianRupee",[["path",{d:"M6 3h12",key:"ggurg9"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"m6 13 8.5 8",key:"u1kupk"}],["path",{d:"M6 13h3",key:"wdp6ag"}],["path",{d:"M9 13c6.667 0 6.667-10 0-10",key:"1nkvk2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qk=i("Infinity",[["path",{d:"M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z",key:"1z0uae"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dk=i("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fk=i("InspectionPanel",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 7h.01",key:"7u93v4"}],["path",{d:"M17 7h.01",key:"14a9sn"}],["path",{d:"M7 17h.01",key:"19xn7k"}],["path",{d:"M17 17h.01",key:"1sd3ek"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rk=i("Instagram",[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bk=i("Italic",[["line",{x1:"19",x2:"10",y1:"4",y2:"4",key:"15jd3p"}],["line",{x1:"14",x2:"5",y1:"20",y2:"20",key:"bu0au3"}],["line",{x1:"15",x2:"9",y1:"4",y2:"20",key:"uljnxc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nk=i("IterationCcw",[["path",{d:"M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h8",key:"4znkd0"}],["polyline",{points:"16 14 20 18 16 22",key:"11njsm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ek=i("IterationCw",[["path",{d:"M4 10c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8H4",key:"tuf4su"}],["polyline",{points:"8 22 4 18 8 14",key:"evkj9s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ok=i("JapaneseYen",[["path",{d:"M12 9.5V21m0-11.5L6 3m6 6.5L18 3",key:"2ej80x"}],["path",{d:"M6 15h12",key:"1hwgt5"}],["path",{d:"M6 11h12",key:"wf4gp6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uk=i("Joystick",[["path",{d:"M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z",key:"jg2n2t"}],["path",{d:"M6 15v-2",key:"gd6mvg"}],["path",{d:"M12 15V9",key:"8c7uyn"}],["circle",{cx:"12",cy:"6",r:"3",key:"1gm2ql"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qn=i("KanbanSquareDashed",[["path",{d:"M8 7v7",key:"1x2jlm"}],["path",{d:"M12 7v4",key:"xawao1"}],["path",{d:"M16 7v9",key:"1hp2iy"}],["path",{d:"M5 3a2 2 0 0 0-2 2",key:"y57alp"}],["path",{d:"M9 3h1",key:"1yesri"}],["path",{d:"M14 3h1",key:"1ec4yj"}],["path",{d:"M19 3a2 2 0 0 1 2 2",key:"18rm91"}],["path",{d:"M21 9v1",key:"mxsmne"}],["path",{d:"M21 14v1",key:"169vum"}],["path",{d:"M21 19a2 2 0 0 1-2 2",key:"1j7049"}],["path",{d:"M14 21h1",key:"v9vybs"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M5 21a2 2 0 0 1-2-2",key:"sbafld"}],["path",{d:"M3 14v1",key:"vnatye"}],["path",{d:"M3 9v1",key:"1r0deq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dn=i("KanbanSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 7v7",key:"1x2jlm"}],["path",{d:"M12 7v4",key:"xawao1"}],["path",{d:"M16 7v9",key:"1hp2iy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zk=i("Kanban",[["path",{d:"M6 5v11",key:"mdvv1e"}],["path",{d:"M12 5v6",key:"14ar3b"}],["path",{d:"M18 5v14",key:"7ji314"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _k=i("KeyRound",[["path",{d:"M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z",key:"167ctg"}],["circle",{cx:"16.5",cy:"7.5",r:".5",key:"1kog09"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wk=i("KeySquare",[["path",{d:"M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z",key:"9li5bk"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4",key:"1ym3zm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gk=i("Key",[["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["path",{d:"m15.5 7.5 3 3L22 7l-3-3",key:"1rn1fs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $k=i("KeyboardMusic",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"M6 8h4",key:"utf9t1"}],["path",{d:"M14 8h.01",key:"1primd"}],["path",{d:"M18 8h.01",key:"emo2bl"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M6 12v4",key:"dy92yo"}],["path",{d:"M10 12v4",key:"1fxnav"}],["path",{d:"M14 12v4",key:"1hft58"}],["path",{d:"M18 12v4",key:"tjjnbz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xk=i("Keyboard",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",ry:"2",key:"15u882"}],["path",{d:"M6 8h.001",key:"1ej0i3"}],["path",{d:"M10 8h.001",key:"1x2st2"}],["path",{d:"M14 8h.001",key:"1vkmyp"}],["path",{d:"M18 8h.001",key:"kfsenl"}],["path",{d:"M8 12h.001",key:"1sjpby"}],["path",{d:"M12 12h.001",key:"al75ts"}],["path",{d:"M16 12h.001",key:"931bgk"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kk=i("LampCeiling",[["path",{d:"M12 2v5",key:"nd4vlx"}],["path",{d:"M6 7h12l4 9H2l4-9Z",key:"123d64"}],["path",{d:"M9.17 16a3 3 0 1 0 5.66 0",key:"1061mw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qk=i("LampDesk",[["path",{d:"m14 5-3 3 2 7 8-8-7-2Z",key:"1b0msb"}],["path",{d:"m14 5-3 3-3-3 3-3 3 3Z",key:"1uemms"}],["path",{d:"M9.5 6.5 4 12l3 6",key:"1bx08v"}],["path",{d:"M3 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H3Z",key:"wap775"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yk=i("LampFloor",[["path",{d:"M9 2h6l3 7H6l3-7Z",key:"wcx6mj"}],["path",{d:"M12 9v13",key:"3n1su1"}],["path",{d:"M9 22h6",key:"1rlq3v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jk=i("LampWallDown",[["path",{d:"M11 13h6l3 7H8l3-7Z",key:"9n3qlo"}],["path",{d:"M14 13V8a2 2 0 0 0-2-2H8",key:"1hu4hb"}],["path",{d:"M4 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4v6Z",key:"s053bc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e4=i("LampWallUp",[["path",{d:"M11 4h6l3 7H8l3-7Z",key:"11x1ee"}],["path",{d:"M14 11v5a2 2 0 0 1-2 2H8",key:"eutp5o"}],["path",{d:"M4 15h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4v-6Z",key:"1iuthr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t4=i("Lamp",[["path",{d:"M8 2h8l4 10H4L8 2Z",key:"9dma5w"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8Z",key:"mwf4oh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n4=i("LandPlot",[["path",{d:"m12 8 6-3-6-3v10",key:"mvpnpy"}],["path",{d:"m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12",key:"ek95tt"}],["path",{d:"m6.49 12.85 11.02 6.3",key:"1kt42w"}],["path",{d:"M17.51 12.85 6.5 19.15",key:"v55bdg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a4=i("Landmark",[["line",{x1:"3",x2:"21",y1:"22",y2:"22",key:"j8o0r"}],["line",{x1:"6",x2:"6",y1:"18",y2:"11",key:"10tf0k"}],["line",{x1:"10",x2:"10",y1:"18",y2:"11",key:"54lgf6"}],["line",{x1:"14",x2:"14",y1:"18",y2:"11",key:"380y"}],["line",{x1:"18",x2:"18",y1:"18",y2:"11",key:"1kevvc"}],["polygon",{points:"12 2 20 7 4 7",key:"jkujk7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i4=i("Languages",[["path",{d:"m5 8 6 6",key:"1wu5hv"}],["path",{d:"m4 14 6-6 2-3",key:"1k1g8d"}],["path",{d:"M2 5h12",key:"or177f"}],["path",{d:"M7 2h1",key:"1t2jsx"}],["path",{d:"m22 22-5-10-5 10",key:"don7ne"}],["path",{d:"M14 18h6",key:"1m8k6r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r4=i("Laptop2",[["rect",{width:"18",height:"12",x:"3",y:"4",rx:"2",ry:"2",key:"1qhy41"}],["line",{x1:"2",x2:"22",y1:"20",y2:"20",key:"ni3hll"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o4=i("Laptop",[["path",{d:"M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16",key:"tarvll"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s4=i("LassoSelect",[["path",{d:"M7 22a5 5 0 0 1-2-4",key:"umushi"}],["path",{d:"M7 16.93c.96.43 1.96.74 2.99.91",key:"ybbtv3"}],["path",{d:"M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2",key:"gt5e1w"}],["path",{d:"M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",key:"bq3ynw"}],["path",{d:"M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14v0z",key:"1bawls"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c4=i("Lasso",[["path",{d:"M7 22a5 5 0 0 1-2-4",key:"umushi"}],["path",{d:"M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1",key:"146dds"}],["path",{d:"M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",key:"bq3ynw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l4=i("Laugh",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z",key:"b2q4dd"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d4=i("Layers2",[["path",{d:"m16.02 12 5.48 3.13a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74L7.98 12",key:"1cuww1"}],["path",{d:"M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74Z",key:"pdlvxu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h4=i("Layers3",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59",key:"1e5n1m"}],["path",{d:"m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59",key:"1iwflc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ti=i("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u4=i("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y4=i("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p4=i("LayoutList",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}],["path",{d:"M14 4h7",key:"3xa0d5"}],["path",{d:"M14 9h7",key:"1icrd9"}],["path",{d:"M14 15h7",key:"1mj8o2"}],["path",{d:"M14 20h7",key:"11slyb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k4=i("LayoutPanelLeft",[["rect",{width:"7",height:"18",x:"3",y:"3",rx:"1",key:"2obqm"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f4=i("LayoutPanelTop",[["rect",{width:"18",height:"7",x:"3",y:"3",rx:"1",key:"f1a2em"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m4=i("LayoutTemplate",[["rect",{width:"18",height:"7",x:"3",y:"3",rx:"1",key:"f1a2em"}],["rect",{width:"9",height:"7",x:"3",y:"14",rx:"1",key:"jqznyg"}],["rect",{width:"5",height:"7",x:"16",y:"14",rx:"1",key:"q5h2i8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g4=i("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x4=i("LeafyGreen",[["path",{d:"M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22",key:"1134nt"}],["path",{d:"M2 22 17 7",key:"1q7jp2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v4=i("LibraryBig",[["rect",{width:"8",height:"18",x:"3",y:"3",rx:"1",key:"oynpb5"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z",key:"1qboyk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M4=i("LibrarySquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 7v10",key:"d5nglc"}],["path",{d:"M11 7v10",key:"pptsnr"}],["path",{d:"m15 7 2 10",key:"1m7qm5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w4=i("Library",[["path",{d:"m16 6 4 14",key:"ji33uf"}],["path",{d:"M12 6v14",key:"1n7gus"}],["path",{d:"M8 8v12",key:"1gg7y9"}],["path",{d:"M4 4v16",key:"6qkkli"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L4=i("LifeBuoy",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m4.93 4.93 4.24 4.24",key:"1ymg45"}],["path",{d:"m14.83 9.17 4.24-4.24",key:"1cb5xl"}],["path",{d:"m14.83 14.83 4.24 4.24",key:"q42g0n"}],["path",{d:"m9.17 14.83-4.24 4.24",key:"bqpfvv"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C4=i("Ligature",[["path",{d:"M8 20V8c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2",key:"1rtphz"}],["path",{d:"M6 12h4",key:"a4o3ry"}],["path",{d:"M14 12h2v8",key:"c1fccl"}],["path",{d:"M6 20h4",key:"1i6q5t"}],["path",{d:"M14 20h4",key:"lzx1xo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S4=i("LightbulbOff",[["path",{d:"M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5",key:"1fkcox"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5",key:"10m8kw"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S1=i("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I4=i("LineChart",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j4=i("Link2Off",[["path",{d:"M9 17H7A5 5 0 0 1 7 7",key:"10o201"}],["path",{d:"M15 7h2a5 5 0 0 1 4 8",key:"1d3206"}],["line",{x1:"8",x2:"12",y1:"12",y2:"12",key:"rvw6j4"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b4=i("Link2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P4=i("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A4=i("Linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z4=i("ListChecks",[["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V4=i("ListEnd",[["path",{d:"M16 12H3",key:"1a2rj7"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M10 18H3",key:"13769t"}],["path",{d:"M21 6v10a2 2 0 0 1-2 2h-5",key:"ilrcs8"}],["path",{d:"m16 16-2 2 2 2",key:"kkc6pm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H4=i("ListFilter",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M7 12h10",key:"b7w52i"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T4=i("ListMinus",[["path",{d:"M11 12H3",key:"51ecnj"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"M21 12h-6",key:"bt1uis"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q4=i("ListMusic",[["path",{d:"M21 15V6",key:"h1cx4g"}],["path",{d:"M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",key:"8saifv"}],["path",{d:"M12 12H3",key:"18klou"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M12 18H3",key:"11ftsu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D4=i("ListOrdered",[["line",{x1:"10",x2:"21",y1:"6",y2:"6",key:"76qw6h"}],["line",{x1:"10",x2:"21",y1:"12",y2:"12",key:"16nom4"}],["line",{x1:"10",x2:"21",y1:"18",y2:"18",key:"u3jurt"}],["path",{d:"M4 6h1v4",key:"cnovpq"}],["path",{d:"M4 10h2",key:"16xx2s"}],["path",{d:"M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",key:"m9a95d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F4=i("ListPlus",[["path",{d:"M11 12H3",key:"51ecnj"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"M18 9v6",key:"1twb98"}],["path",{d:"M21 12h-6",key:"bt1uis"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R4=i("ListRestart",[["path",{d:"M21 6H3",key:"1jwq7v"}],["path",{d:"M7 12H3",key:"13ou7f"}],["path",{d:"M7 18H3",key:"1sijw9"}],["path",{d:"M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14",key:"qth677"}],["path",{d:"M11 10v4h4",key:"172dkj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B4=i("ListStart",[["path",{d:"M16 12H3",key:"1a2rj7"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"M10 6H3",key:"lf8lx7"}],["path",{d:"M21 18V8a2 2 0 0 0-2-2h-5",key:"1hghli"}],["path",{d:"m16 8-2-2 2-2",key:"160uvd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N4=i("ListTodo",[["rect",{x:"3",y:"5",width:"6",height:"6",rx:"1",key:"1defrl"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E4=i("ListTree",[["path",{d:"M21 12h-8",key:"1bmf0i"}],["path",{d:"M21 6H8",key:"1pqkrb"}],["path",{d:"M21 18h-8",key:"1tm79t"}],["path",{d:"M3 6v4c0 1.1.9 2 2 2h3",key:"1ywdgy"}],["path",{d:"M3 10v6c0 1.1.9 2 2 2h3",key:"2wc746"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O4=i("ListVideo",[["path",{d:"M12 12H3",key:"18klou"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M12 18H3",key:"11ftsu"}],["path",{d:"m16 12 5 3-5 3v-6Z",key:"zpskkp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U4=i("ListX",[["path",{d:"M11 12H3",key:"51ecnj"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"m19 10-4 4",key:"1tz659"}],["path",{d:"m15 10 4 4",key:"1n7nei"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z4=i("List",[["line",{x1:"8",x2:"21",y1:"6",y2:"6",key:"7ey8pc"}],["line",{x1:"8",x2:"21",y1:"12",y2:"12",key:"rjfblc"}],["line",{x1:"8",x2:"21",y1:"18",y2:"18",key:"c3b1m8"}],["line",{x1:"3",x2:"3.01",y1:"6",y2:"6",key:"1g7gq3"}],["line",{x1:"3",x2:"3.01",y1:"12",y2:"12",key:"1pjlvk"}],["line",{x1:"3",x2:"3.01",y1:"18",y2:"18",key:"28t2mc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _4=i("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W4=i("Loader",[["line",{x1:"12",x2:"12",y1:"2",y2:"6",key:"gza1u7"}],["line",{x1:"12",x2:"12",y1:"18",y2:"22",key:"1qhbu9"}],["line",{x1:"4.93",x2:"7.76",y1:"4.93",y2:"7.76",key:"xae44r"}],["line",{x1:"16.24",x2:"19.07",y1:"16.24",y2:"19.07",key:"bxnmvf"}],["line",{x1:"2",x2:"6",y1:"12",y2:"12",key:"89khin"}],["line",{x1:"18",x2:"22",y1:"12",y2:"12",key:"pb8tfm"}],["line",{x1:"4.93",x2:"7.76",y1:"19.07",y2:"16.24",key:"1uxjnu"}],["line",{x1:"16.24",x2:"19.07",y1:"7.76",y2:"4.93",key:"6duxfx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G4=i("LocateFixed",[["line",{x1:"2",x2:"5",y1:"12",y2:"12",key:"bvdh0s"}],["line",{x1:"19",x2:"22",y1:"12",y2:"12",key:"1tbv5k"}],["line",{x1:"12",x2:"12",y1:"2",y2:"5",key:"11lu5j"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}],["circle",{cx:"12",cy:"12",r:"7",key:"fim9np"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $4=i("LocateOff",[["line",{x1:"2",x2:"5",y1:"12",y2:"12",key:"bvdh0s"}],["line",{x1:"19",x2:"22",y1:"12",y2:"12",key:"1tbv5k"}],["line",{x1:"12",x2:"12",y1:"2",y2:"5",key:"11lu5j"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}],["path",{d:"M7.11 7.11C5.83 8.39 5 10.1 5 12c0 3.87 3.13 7 7 7 1.9 0 3.61-.83 4.89-2.11",key:"1oh7ia"}],["path",{d:"M18.71 13.96c.19-.63.29-1.29.29-1.96 0-3.87-3.13-7-7-7-.67 0-1.33.1-1.96.29",key:"3qdecy"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X4=i("Locate",[["line",{x1:"2",x2:"5",y1:"12",y2:"12",key:"bvdh0s"}],["line",{x1:"19",x2:"22",y1:"12",y2:"12",key:"1tbv5k"}],["line",{x1:"12",x2:"12",y1:"2",y2:"5",key:"11lu5j"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}],["circle",{cx:"12",cy:"12",r:"7",key:"fim9np"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K4=i("LockKeyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q4=i("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y4=i("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J4=i("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e5=i("Lollipop",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}],["path",{d:"M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0",key:"107gwy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t5=i("Luggage",[["path",{d:"M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0",key:"1h5fkc"}],["path",{d:"M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14",key:"1l99gc"}],["path",{d:"M10 20h4",key:"ni2waw"}],["circle",{cx:"16",cy:"20",r:"2",key:"1vifvg"}],["circle",{cx:"8",cy:"20",r:"2",key:"ckkr5m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n5=i("MSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 16V8l4 4 4-4v8",key:"141u4e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a5=i("Magnet",[["path",{d:"m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15",key:"1i3lhw"}],["path",{d:"m5 8 4 4",key:"j6kj7e"}],["path",{d:"m12 15 4 4",key:"lnac28"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i5=i("MailCheck",[["path",{d:"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",key:"12jkf8"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"m16 19 2 2 4-4",key:"1b14m6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r5=i("MailMinus",[["path",{d:"M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",key:"fuxbkv"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M16 19h6",key:"xwg31i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o5=i("MailOpen",[["path",{d:"M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",key:"1jhwl8"}],["path",{d:"m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10",key:"1qfld7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s5=i("MailPlus",[["path",{d:"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",key:"12jkf8"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M19 16v6",key:"tddt3s"}],["path",{d:"M16 19h6",key:"xwg31i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c5=i("MailQuestion",[["path",{d:"M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5",key:"e61zoh"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2",key:"7z9rxb"}],["path",{d:"M20 22v.01",key:"12bgn6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l5=i("MailSearch",[["path",{d:"M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5",key:"w80f2v"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z",key:"mgbru4"}],["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["path",{d:"m22 22-1.5-1.5",key:"1x83k4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d5=i("MailWarning",[["path",{d:"M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5",key:"e61zoh"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M20 14v4",key:"1hm744"}],["path",{d:"M20 22v.01",key:"12bgn6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h5=i("MailX",[["path",{d:"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9",key:"1j9vog"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"m17 17 4 4",key:"1b3523"}],["path",{d:"m21 17-4 4",key:"uinynz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u5=i("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y5=i("Mailbox",[["path",{d:"M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z",key:"1lbycx"}],["polyline",{points:"15,9 18,9 18,11",key:"1pm9c0"}],["path",{d:"M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0",key:"n6nfvi"}],["line",{x1:"6",x2:"7",y1:"10",y2:"10",key:"1e2scm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p5=i("Mails",[["rect",{width:"16",height:"13",x:"6",y:"4",rx:"2",key:"1drq3f"}],["path",{d:"m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7",key:"xn252p"}],["path",{d:"M2 8v11c0 1.1.9 2 2 2h14",key:"n13cji"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k5=i("MapPinOff",[["path",{d:"M5.43 5.43A8.06 8.06 0 0 0 4 10c0 6 8 12 8 12a29.94 29.94 0 0 0 5-5",key:"12a8pk"}],["path",{d:"M19.18 13.52A8.66 8.66 0 0 0 20 10a8 8 0 0 0-8-8 7.88 7.88 0 0 0-3.52.82",key:"1r9f6y"}],["path",{d:"M9.13 9.13A2.78 2.78 0 0 0 9 10a3 3 0 0 0 3 3 2.78 2.78 0 0 0 .87-.13",key:"erynq7"}],["path",{d:"M14.9 9.25a3 3 0 0 0-2.15-2.16",key:"1hwwmx"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f5=i("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m5=i("MapPinned",[["path",{d:"M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0",key:"yrbn30"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835",key:"112zkj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g5=i("Map",[["polygon",{points:"3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21",key:"ok2ie8"}],["line",{x1:"9",x2:"9",y1:"3",y2:"18",key:"w34qz5"}],["line",{x1:"15",x2:"15",y1:"6",y2:"21",key:"volv9a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x5=i("Martini",[["path",{d:"M8 22h8",key:"rmew8v"}],["path",{d:"M12 11v11",key:"ur9y6a"}],["path",{d:"m19 3-7 8-7-8Z",key:"1sgpiw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v5=i("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M5=i("Maximize",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w5=i("Medal",[["path",{d:"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",key:"143lza"}],["path",{d:"M11 12 5.12 2.2",key:"qhuxz6"}],["path",{d:"m13 12 5.88-9.8",key:"hbye0f"}],["path",{d:"M8 7h8",key:"i86dvs"}],["circle",{cx:"12",cy:"17",r:"5",key:"qbz8iq"}],["path",{d:"M12 18v-2h-.5",key:"fawc4q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L5=i("MegaphoneOff",[["path",{d:"M9.26 9.26 3 11v3l14.14 3.14",key:"3429n"}],["path",{d:"M21 15.34V6l-7.31 2.03",key:"4o1dh8"}],["path",{d:"M11.6 16.8a3 3 0 1 1-5.8-1.6",key:"1yl0tm"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C5=i("Megaphone",[["path",{d:"m3 11 18-5v12L3 14v-3z",key:"n962bs"}],["path",{d:"M11.6 16.8a3 3 0 1 1-5.8-1.6",key:"1yl0tm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S5=i("Meh",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"8",x2:"16",y1:"15",y2:"15",key:"1xb1d9"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I5=i("MemoryStick",[["path",{d:"M6 19v-3",key:"1nvgqn"}],["path",{d:"M10 19v-3",key:"iu8nkm"}],["path",{d:"M14 19v-3",key:"kcehxu"}],["path",{d:"M18 19v-3",key:"1vh91z"}],["path",{d:"M8 11V9",key:"63erz4"}],["path",{d:"M16 11V9",key:"fru6f3"}],["path",{d:"M12 11V9",key:"ha00sb"}],["path",{d:"M2 15h20",key:"16ne18"}],["path",{d:"M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z",key:"lhddv3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j5=i("MenuSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 8h10",key:"1jw688"}],["path",{d:"M7 12h10",key:"b7w52i"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ni=i("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b5=i("Merge",[["path",{d:"m8 6 4-4 4 4",key:"ybng9g"}],["path",{d:"M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22",key:"1hyw0i"}],["path",{d:"m20 22-5-5",key:"1m27yz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P5=i("MessageCircleCode",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"m10 10-2 2 2 2",key:"p6et6i"}],["path",{d:"m14 10 2 2-2 2",key:"1kkmpt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A5=i("MessageCircleDashed",[["path",{d:"M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1",key:"16ll65"}],["path",{d:"M19.3 6.8a10.45 10.45 0 0 0-2.1-2.1",key:"1nq77a"}],["path",{d:"M20.9 13.5c.1-.5.1-1 .1-1.5s-.1-1-.1-1.5",key:"1sf7wn"}],["path",{d:"M17.2 19.3a10.45 10.45 0 0 0 2.1-2.1",key:"x1hs5g"}],["path",{d:"M10.5 20.9c.5.1 1 .1 1.5.1s1-.1 1.5-.1",key:"19m18z"}],["path",{d:"M3.5 17.5 2 22l4.5-1.5",key:"1f36qi"}],["path",{d:"M3.1 10.5c0 .5-.1 1-.1 1.5s.1 1 .1 1.5",key:"1vz3ju"}],["path",{d:"M6.8 4.7a10.45 10.45 0 0 0-2.1 2.1",key:"19f9do"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z5=i("MessageCircleHeart",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7",key:"43lnbm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V5=i("MessageCircleMore",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M8 12h.01",key:"czm47f"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M16 12h.01",key:"1l6xoz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H5=i("MessageCircleOff",[["path",{d:"M20.5 14.9A9 9 0 0 0 9.1 3.5",key:"1iebmn"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M5.6 5.6C3 8.3 2.2 12.5 4 16l-2 6 6-2c3.4 1.8 7.6 1.1 10.3-1.7",key:"1ov8ce"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T5=i("MessageCirclePlus",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q5=i("MessageCircleQuestion",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D5=i("MessageCircleReply",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"m10 15-3-3 3-3",key:"1pgupc"}],["path",{d:"M7 12h7a2 2 0 0 1 2 2v1",key:"1gheu4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F5=i("MessageCircleWarning",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R5=i("MessageCircleX",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B5=i("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N5=i("MessageSquareCode",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"m10 8-2 2 2 2",key:"19bv1o"}],["path",{d:"m14 8 2 2-2 2",key:"1whylv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E5=i("MessageSquareDashed",[["path",{d:"M3 6V5c0-1.1.9-2 2-2h2",key:"9usibi"}],["path",{d:"M11 3h3",key:"1c3ji7"}],["path",{d:"M18 3h1c1.1 0 2 .9 2 2",key:"19esxn"}],["path",{d:"M21 9v2",key:"p14lih"}],["path",{d:"M21 15c0 1.1-.9 2-2 2h-1",key:"1fo1j8"}],["path",{d:"M14 17h-3",key:"1w4p2m"}],["path",{d:"m7 17-4 4v-5",key:"ph9x1h"}],["path",{d:"M3 12v-2",key:"856n1q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O5=i("MessageSquareDiff",[["path",{d:"m5 19-2 2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2",key:"1xuzuj"}],["path",{d:"M9 10h6",key:"9gxzsh"}],["path",{d:"M12 7v6",key:"lw1j43"}],["path",{d:"M9 17h6",key:"r8uit2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U5=i("MessageSquareDot",[["path",{d:"M11.7 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2v-2.7",key:"uodpkb"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z5=i("MessageSquareHeart",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8",key:"1blaws"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _5=i("MessageSquareMore",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M16 10h.01",key:"1m94wz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W5=i("MessageSquareOff",[["path",{d:"M21 15V5a2 2 0 0 0-2-2H9",key:"43el77"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M3.6 3.6c-.4.3-.6.8-.6 1.4v16l4-4h10",key:"pwpm4a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G5=i("MessageSquarePlus",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M12 7v6",key:"lw1j43"}],["path",{d:"M9 10h6",key:"9gxzsh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $5=i("MessageSquareQuote",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M8 12a2 2 0 0 0 2-2V8H8",key:"1jfesj"}],["path",{d:"M14 12a2 2 0 0 0 2-2V8h-2",key:"1dq9mh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X5=i("MessageSquareReply",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"m10 7-3 3 3 3",key:"1eugdv"}],["path",{d:"M17 13v-1a2 2 0 0 0-2-2H7",key:"ernfh3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K5=i("MessageSquareShare",[["path",{d:"M21 12v3a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h7",key:"tqtdkg"}],["path",{d:"M16 3h5v5",key:"1806ms"}],["path",{d:"m16 8 5-5",key:"15mbrl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q5=i("MessageSquareText",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M13 8H7",key:"14i4kc"}],["path",{d:"M17 12H7",key:"16if0g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y5=i("MessageSquareWarning",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M12 7v2",key:"stiyo7"}],["path",{d:"M12 13h.01",key:"y0uutt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J5=i("MessageSquareX",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"m14.5 7.5-5 5",key:"3lb6iw"}],["path",{d:"m9.5 7.5 5 5",key:"ko136h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ef=i("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tf=i("MessagesSquare",[["path",{d:"M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z",key:"16vlm8"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1",key:"1cx29u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nf=i("Mic2",[["path",{d:"m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12",key:"zoua8r"}],["circle",{cx:"17",cy:"7",r:"5",key:"1fomce"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const af=i("MicOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M18.89 13.23A7.12 7.12 0 0 0 19 12v-2",key:"80xlxr"}],["path",{d:"M5 10v2a7 7 0 0 0 12 5",key:"p2k8kg"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rf=i("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const of=i("Microscope",[["path",{d:"M6 18h8",key:"1borvv"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M14 22a7 7 0 1 0 0-14h-1",key:"1jwaiy"}],["path",{d:"M9 14h2",key:"197e7h"}],["path",{d:"M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z",key:"1bmzmy"}],["path",{d:"M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",key:"1drr47"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sf=i("Microwave",[["rect",{width:"20",height:"15",x:"2",y:"4",rx:"2",key:"2no95f"}],["rect",{width:"8",height:"7",x:"6",y:"8",rx:"1",key:"zh9wx"}],["path",{d:"M18 8v7",key:"o5zi4n"}],["path",{d:"M6 19v2",key:"1loha6"}],["path",{d:"M18 19v2",key:"1dawf0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cf=i("Milestone",[["path",{d:"M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z",key:"1mp5s7"}],["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M12 3v3",key:"1n5kay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lf=i("MilkOff",[["path",{d:"M8 2h8",key:"1ssgc1"}],["path",{d:"M9 2v1.343M15 2v2.789a4 4 0 0 0 .672 2.219l.656.984a4 4 0 0 1 .672 2.22v1.131M7.8 7.8l-.128.192A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3",key:"y0ejgx"}],["path",{d:"M7 15a6.47 6.47 0 0 1 5 0 6.472 6.472 0 0 0 3.435.435",key:"iaxqsy"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const df=i("Milk",[["path",{d:"M8 2h8",key:"1ssgc1"}],["path",{d:"M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2",key:"qtp12x"}],["path",{d:"M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0",key:"ygeh44"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hf=i("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uf=i("Minimize",[["path",{d:"M8 3v3a2 2 0 0 1-2 2H3",key:"hohbtr"}],["path",{d:"M21 8h-3a2 2 0 0 1-2-2V3",key:"5jw1f3"}],["path",{d:"M3 16h3a2 2 0 0 1 2 2v3",key:"198tvr"}],["path",{d:"M16 21v-3a2 2 0 0 1 2-2h3",key:"ph8mxp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yf=i("MinusCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pf=i("MinusSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kf=i("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ff=i("MonitorCheck",[["path",{d:"m9 10 2 2 4-4",key:"1gnqz4"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mf=i("MonitorDot",[["circle",{cx:"19",cy:"6",r:"3",key:"108a5v"}],["path",{d:"M22 12v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9",key:"1fet9y"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gf=i("MonitorDown",[["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"m15 10-3 3-3-3",key:"lzhmyn"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xf=i("MonitorOff",[["path",{d:"M17 17H4a2 2 0 0 1-2-2V5c0-1.5 1-2 1-2",key:"k0q8oc"}],["path",{d:"M22 15V5a2 2 0 0 0-2-2H9",key:"cp1ac0"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vf=i("MonitorPause",[["path",{d:"M10 13V7",key:"1u13u9"}],["path",{d:"M14 13V7",key:"1vj9om"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mf=i("MonitorPlay",[["path",{d:"m10 7 5 3-5 3Z",key:"29ljg6"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wf=i("MonitorSmartphone",[["path",{d:"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",key:"10dyio"}],["path",{d:"M10 19v-3.96 3.15",key:"1irgej"}],["path",{d:"M7 19h5",key:"qswx4l"}],["rect",{width:"6",height:"10",x:"16",y:"12",rx:"2",key:"1egngj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lf=i("MonitorSpeaker",[["path",{d:"M5.5 20H8",key:"1k40s5"}],["path",{d:"M17 9h.01",key:"1j24nn"}],["rect",{width:"10",height:"16",x:"12",y:"4",rx:"2",key:"ixliua"}],["path",{d:"M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4",key:"1mp6e1"}],["circle",{cx:"17",cy:"15",r:"1",key:"tqvash"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cf=i("MonitorStop",[["rect",{x:"9",y:"7",width:"6",height:"6",key:"4xvc6r"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sf=i("MonitorUp",[["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}],["path",{d:"M12 13V7",key:"h0r20n"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const If=i("MonitorX",[["path",{d:"m14.5 12.5-5-5",key:"1jahn5"}],["path",{d:"m9.5 12.5 5-5",key:"1k2t7b"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jf=i("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bf=i("MoonStar",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}],["path",{d:"M19 3v4",key:"vgv24u"}],["path",{d:"M21 5h-4",key:"1wcg1f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pf=i("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Af=i("MoreHorizontal",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zf=i("MoreVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vf=i("MountainSnow",[["path",{d:"m8 3 4 8 5-5 5 15H2L8 3z",key:"otkl63"}],["path",{d:"M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19",key:"1pvmmp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hf=i("Mountain",[["path",{d:"m8 3 4 8 5-5 5 15H2L8 3z",key:"otkl63"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tf=i("MousePointer2",[["path",{d:"m4 4 7.07 17 2.51-7.39L21 11.07z",key:"1vqm48"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qf=i("MousePointerClick",[["path",{d:"m9 9 5 12 1.8-5.2L21 14Z",key:"1b76lo"}],["path",{d:"M7.2 2.2 8 5.1",key:"1cfko1"}],["path",{d:"m5.1 8-2.9-.8",key:"1go3kf"}],["path",{d:"M14 4.1 12 6",key:"ita8i4"}],["path",{d:"m6 12-1.9 2",key:"mnht97"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Df=i("MousePointerSquareDashed",[["path",{d:"M5 3a2 2 0 0 0-2 2",key:"y57alp"}],["path",{d:"M19 3a2 2 0 0 1 2 2",key:"18rm91"}],["path",{d:"m12 12 4 10 1.7-4.3L22 16Z",key:"64ilsv"}],["path",{d:"M5 21a2 2 0 0 1-2-2",key:"sbafld"}],["path",{d:"M9 3h1",key:"1yesri"}],["path",{d:"M9 21h2",key:"1qve2z"}],["path",{d:"M14 3h1",key:"1ec4yj"}],["path",{d:"M3 9v1",key:"1r0deq"}],["path",{d:"M21 9v2",key:"p14lih"}],["path",{d:"M3 14v1",key:"vnatye"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fn=i("MousePointerSquare",[["path",{d:"M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6",key:"14rsvq"}],["path",{d:"m12 12 4 10 1.7-4.3L22 16Z",key:"64ilsv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ff=i("MousePointer",[["path",{d:"m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z",key:"y2ucgo"}],["path",{d:"m13 13 6 6",key:"1nhxnf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rf=i("Mouse",[["rect",{x:"5",y:"2",width:"14",height:"20",rx:"7",key:"11ol66"}],["path",{d:"M12 6v4",key:"16clxf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rn=i("Move3d",[["path",{d:"M5 3v16h16",key:"1mqmf9"}],["path",{d:"m5 19 6-6",key:"jh6hbb"}],["path",{d:"m2 6 3-3 3 3",key:"tkyvxa"}],["path",{d:"m18 16 3 3-3 3",key:"1d4glt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bf=i("MoveDiagonal2",[["polyline",{points:"5 11 5 5 11 5",key:"ncfzxk"}],["polyline",{points:"19 13 19 19 13 19",key:"1mk7hk"}],["line",{x1:"5",x2:"19",y1:"5",y2:"19",key:"mcyte3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nf=i("MoveDiagonal",[["polyline",{points:"13 5 19 5 19 11",key:"11219e"}],["polyline",{points:"11 19 5 19 5 13",key:"sfq3wq"}],["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ef=i("MoveDownLeft",[["path",{d:"M11 19H5V13",key:"1akmht"}],["path",{d:"M19 5L5 19",key:"72u4yj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Of=i("MoveDownRight",[["path",{d:"M19 13V19H13",key:"10vkzq"}],["path",{d:"M5 5L19 19",key:"5zm2fv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uf=i("MoveDown",[["path",{d:"M8 18L12 22L16 18",key:"cskvfv"}],["path",{d:"M12 2V22",key:"r89rzk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zf=i("MoveHorizontal",[["polyline",{points:"18 8 22 12 18 16",key:"1hqrds"}],["polyline",{points:"6 8 2 12 6 16",key:"f0ernq"}],["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _f=i("MoveLeft",[["path",{d:"M6 8L2 12L6 16",key:"kyvwex"}],["path",{d:"M2 12H22",key:"1m8cig"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wf=i("MoveRight",[["path",{d:"M18 8L22 12L18 16",key:"1r0oui"}],["path",{d:"M2 12H22",key:"1m8cig"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gf=i("MoveUpLeft",[["path",{d:"M5 11V5H11",key:"3q78g9"}],["path",{d:"M5 5L19 19",key:"5zm2fv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $f=i("MoveUpRight",[["path",{d:"M13 5H19V11",key:"1n1gyv"}],["path",{d:"M19 5L5 19",key:"72u4yj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xf=i("MoveUp",[["path",{d:"M8 6L12 2L16 6",key:"1yvkyx"}],["path",{d:"M12 2V22",key:"r89rzk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kf=i("MoveVertical",[["polyline",{points:"8 18 12 22 16 18",key:"1uutw3"}],["polyline",{points:"8 6 12 2 16 6",key:"d60sxy"}],["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qf=i("Move",[["polyline",{points:"5 9 2 12 5 15",key:"1r5uj5"}],["polyline",{points:"9 5 12 2 15 5",key:"5v383o"}],["polyline",{points:"15 19 12 22 9 19",key:"g7qi8m"}],["polyline",{points:"19 9 22 12 19 15",key:"tpp73q"}],["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}],["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yf=i("Music2",[["circle",{cx:"8",cy:"18",r:"4",key:"1fc0mg"}],["path",{d:"M12 18V2l7 4",key:"g04rme"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jf=i("Music3",[["circle",{cx:"12",cy:"18",r:"4",key:"m3r9ws"}],["path",{d:"M16 18V2",key:"40x2m5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const em=i("Music4",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["path",{d:"m9 9 12-2",key:"1e64n2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tm=i("Music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nm=i("Navigation2Off",[["path",{d:"M9.31 9.31 5 21l7-4 7 4-1.17-3.17",key:"qoq2o2"}],["path",{d:"M14.53 8.88 12 2l-1.17 3.17",key:"k3sjzy"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const am=i("Navigation2",[["polygon",{points:"12 2 19 21 12 17 5 21 12 2",key:"x8c0qg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const im=i("NavigationOff",[["path",{d:"M8.43 8.43 3 11l8 2 2 8 2.57-5.43",key:"1vdtb7"}],["path",{d:"M17.39 11.73 22 2l-9.73 4.61",key:"tya3r6"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rm=i("Navigation",[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const om=i("Network",[["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1",key:"4q2zg0"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1",key:"8cvhb9"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1",key:"1egb70"}],["path",{d:"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",key:"1jsf9p"}],["path",{d:"M12 12V8",key:"2874zd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sm=i("Newspaper",[["path",{d:"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2",key:"7pis2x"}],["path",{d:"M18 14h-8",key:"sponae"}],["path",{d:"M15 18h-5",key:"95g1m2"}],["path",{d:"M10 6h8v4h-8V6Z",key:"smlsk5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cm=i("Nfc",[["path",{d:"M6 8.32a7.43 7.43 0 0 1 0 7.36",key:"9iaqei"}],["path",{d:"M9.46 6.21a11.76 11.76 0 0 1 0 11.58",key:"1yha7l"}],["path",{d:"M12.91 4.1a15.91 15.91 0 0 1 .01 15.8",key:"4iu2gk"}],["path",{d:"M16.37 2a20.16 20.16 0 0 1 0 20",key:"sap9u2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lm=i("NutOff",[["path",{d:"M12 4V2",key:"1k5q1u"}],["path",{d:"M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592a7.01 7.01 0 0 0 4.125-2.939",key:"1xcvy9"}],["path",{d:"M19 10v3.343",key:"163tfc"}],["path",{d:"M12 12c-1.349-.573-1.905-1.005-2.5-2-.546.902-1.048 1.353-2.5 2-1.018-.644-1.46-1.08-2-2-1.028.71-1.69.918-3 1 1.081-1.048 1.757-2.03 2-3 .194-.776.84-1.551 1.79-2.21m11.654 5.997c.887-.457 1.28-.891 1.556-1.787 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4-.74 0-1.461.068-2.15.192",key:"17914v"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dm=i("Nut",[["path",{d:"M12 4V2",key:"1k5q1u"}],["path",{d:"M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592A7.003 7.003 0 0 0 19 14v-4",key:"1tgyif"}],["path",{d:"M12 4C8 4 4.5 6 4 8c-.243.97-.919 1.952-2 3 1.31-.082 1.972-.29 3-1 .54.92.982 1.356 2 2 1.452-.647 1.954-1.098 2.5-2 .595.995 1.151 1.427 2.5 2 1.31-.621 1.862-1.058 2.5-2 .629.977 1.162 1.423 2.5 2 1.209-.548 1.68-.967 2-2 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4Z",key:"tnsqj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hm=i("Octagon",[["polygon",{points:"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",key:"h1p8hx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const um=i("Option",[["path",{d:"M3 3h6l6 18h6",key:"ph9rgk"}],["path",{d:"M14 3h7",key:"16f0ms"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ym=i("Orbit",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["circle",{cx:"19",cy:"5",r:"2",key:"mhkx31"}],["circle",{cx:"5",cy:"19",r:"2",key:"v8kfzx"}],["path",{d:"M10.4 21.9a10 10 0 0 0 9.941-15.416",key:"eohfx2"}],["path",{d:"M13.5 2.1a10 10 0 0 0-9.841 15.416",key:"19pvbm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pm=i("Outdent",[["polyline",{points:"7 8 3 12 7 16",key:"2j60jr"}],["line",{x1:"21",x2:"11",y1:"12",y2:"12",key:"1fxxak"}],["line",{x1:"21",x2:"11",y1:"6",y2:"6",key:"asgu94"}],["line",{x1:"21",x2:"11",y1:"18",y2:"18",key:"13dsj7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const km=i("Package2",[["path",{d:"M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z",key:"1ront0"}],["path",{d:"m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9",key:"19h2x1"}],["path",{d:"M12 3v6",key:"1holv5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fm=i("PackageCheck",[["path",{d:"m16 16 2 2 4-4",key:"gfu2re"}],["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mm=i("PackageMinus",[["path",{d:"M16 16h6",key:"100bgy"}],["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gm=i("PackageOpen",[["path",{d:"M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z",key:"1vy178"}],["path",{d:"m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z",key:"s3bv25"}],["line",{x1:"12",x2:"12",y1:"22",y2:"13",key:"1o4xyi"}],["path",{d:"M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5",key:"1na2nq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xm=i("PackagePlus",[["path",{d:"M16 16h6",key:"100bgy"}],["path",{d:"M19 13v6",key:"85cyf1"}],["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vm=i("PackageSearch",[["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}],["circle",{cx:"18.5",cy:"15.5",r:"2.5",key:"b5zd12"}],["path",{d:"M20.27 17.27 22 19",key:"1l4muz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mm=i("PackageX",[["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}],["path",{d:"m17 13 5 5m-5 0 5-5",key:"im3w4b"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wm=i("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lm=i("PaintBucket",[["path",{d:"m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z",key:"irua1i"}],["path",{d:"m5 2 5 5",key:"1lls2c"}],["path",{d:"M2 13h15",key:"1hkzvu"}],["path",{d:"M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z",key:"xk76lq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cm=i("Paintbrush2",[["path",{d:"M14 19.9V16h3a2 2 0 0 0 2-2v-2H5v2c0 1.1.9 2 2 2h3v3.9a2 2 0 1 0 4 0Z",key:"1c8kta"}],["path",{d:"M6 12V2h12v10",key:"1esbnf"}],["path",{d:"M14 2v4",key:"qmzblu"}],["path",{d:"M10 2v2",key:"7u0qdc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sm=i("Paintbrush",[["path",{d:"M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z",key:"m6k5sh"}],["path",{d:"M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7",key:"arzq70"}],["path",{d:"M14.5 17.5 4.5 15",key:"s7fvrz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Im=i("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",key:"1xcu5"}],["circle",{cx:"17.5",cy:"10.5",r:".5",key:"736e4u"}],["circle",{cx:"8.5",cy:"7.5",r:".5",key:"clrty"}],["circle",{cx:"6.5",cy:"12.5",r:".5",key:"1s4xz9"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jm=i("Palmtree",[["path",{d:"M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4",key:"foxbe7"}],["path",{d:"M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3",key:"18arnh"}],["path",{d:"M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35z",key:"epoumf"}],["path",{d:"M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14",key:"ft0feo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bm=i("PanelBottomClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"m15 8-3 3-3-3",key:"1oxy1z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bn=i("PanelBottomDashed",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M14 15h1",key:"171nev"}],["path",{d:"M19 15h2",key:"1vnucp"}],["path",{d:"M3 15h2",key:"8bym0q"}],["path",{d:"M9 15h1",key:"1tg3ks"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pm=i("PanelBottomOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Am=i("PanelBottom",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 15h18",key:"5xshup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nn=i("PanelLeftClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m16 15-3-3 3-3",key:"14y99z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const En=i("PanelLeftDashed",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 14v1",key:"askpd8"}],["path",{d:"M9 19v2",key:"16tejx"}],["path",{d:"M9 3v2",key:"1noubl"}],["path",{d:"M9 9v1",key:"19ebxg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const On=i("PanelLeftOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m14 9 3 3-3 3",key:"8010ee"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Un=i("PanelLeft",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zm=i("PanelRightClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m8 9 3 3-3 3",key:"12hl5m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zn=i("PanelRightDashed",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 14v1",key:"ilsfch"}],["path",{d:"M15 19v2",key:"1fst2f"}],["path",{d:"M15 3v2",key:"z204g4"}],["path",{d:"M15 9v1",key:"z2a8b1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vm=i("PanelRightOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m10 15-3-3 3-3",key:"1pgupc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hm=i("PanelRight",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tm=i("PanelTopClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"m9 16 3-3 3 3",key:"1idcnm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _n=i("PanelTopDashed",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M14 9h1",key:"l0svgy"}],["path",{d:"M19 9h2",key:"te2zfg"}],["path",{d:"M3 9h2",key:"1h4ldw"}],["path",{d:"M9 9h1",key:"15jzuz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qm=i("PanelTopOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"m15 14-3 3-3-3",key:"g215vf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dm=i("PanelTop",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fm=i("PanelsLeftBottom",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M9 15h12",key:"5ijen5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rm=i("PanelsRightBottom",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 15h12",key:"1wkqb3"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wn=i("PanelsTopLeft",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M9 21V9",key:"1oto5p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bm=i("Paperclip",[["path",{d:"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",key:"1u3ebp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nm=i("Parentheses",[["path",{d:"M8 21s-4-3-4-9 4-9 4-9",key:"uto9ud"}],["path",{d:"M16 3s4 3 4 9-4 9-4 9",key:"4w2vsq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Em=i("ParkingCircleOff",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m5 5 14 14",key:"11anup"}],["path",{d:"M13 13a3 3 0 1 0 0-6H9v2",key:"uoagbd"}],["path",{d:"M9 17v-2.34",key:"a9qo08"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Om=i("ParkingCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9 17V7h4a3 3 0 0 1 0 6H9",key:"1dfk2c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Um=i("ParkingMeter",[["path",{d:"M9 9a3 3 0 1 1 6 0",key:"jdoeu8"}],["path",{d:"M12 12v3",key:"158kv8"}],["path",{d:"M11 15h2",key:"199qp6"}],["path",{d:"M19 9a7 7 0 1 0-13.6 2.3C6.4 14.4 8 19 8 19h8s1.6-4.6 2.6-7.7c.3-.8.4-1.5.4-2.3",key:"1l50wn"}],["path",{d:"M12 19v3",key:"npa21l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zm=i("ParkingSquareOff",[["path",{d:"M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41",key:"9l1ft6"}],["path",{d:"M3 8.7V19a2 2 0 0 0 2 2h10.3",key:"17knke"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M13 13a3 3 0 1 0 0-6H9v2",key:"uoagbd"}],["path",{d:"M9 17v-2.3",key:"1jxgo2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _m=i("ParkingSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 17V7h4a3 3 0 0 1 0 6H9",key:"1dfk2c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wm=i("PartyPopper",[["path",{d:"M5.8 11.3 2 22l10.7-3.79",key:"gwxi1d"}],["path",{d:"M4 3h.01",key:"1vcuye"}],["path",{d:"M22 8h.01",key:"1mrtc2"}],["path",{d:"M15 2h.01",key:"1cjtqr"}],["path",{d:"M22 20h.01",key:"1mrys2"}],["path",{d:"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",key:"bpx1uq"}],["path",{d:"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17",key:"1pd0s7"}],["path",{d:"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7",key:"zq5xbz"}],["path",{d:"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",key:"4kbmks"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gm=i("PauseCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"10",x2:"10",y1:"15",y2:"9",key:"c1nkhi"}],["line",{x1:"14",x2:"14",y1:"15",y2:"9",key:"h65svq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $m=i("PauseOctagon",[["path",{d:"M10 15V9",key:"1lckn7"}],["path",{d:"M14 15V9",key:"1muqhk"}],["path",{d:"M7.714 2h8.572L22 7.714v8.572L16.286 22H7.714L2 16.286V7.714L7.714 2z",key:"1m7qra"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xm=i("Pause",[["rect",{width:"4",height:"16",x:"6",y:"4",key:"iffhe4"}],["rect",{width:"4",height:"16",x:"14",y:"4",key:"sjin7j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Km=i("PawPrint",[["circle",{cx:"11",cy:"4",r:"2",key:"vol9p0"}],["circle",{cx:"18",cy:"8",r:"2",key:"17gozi"}],["circle",{cx:"20",cy:"16",r:"2",key:"1v9bxh"}],["path",{d:"M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z",key:"1ydw1z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qm=i("PcCase",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",key:"1uq1d7"}],["path",{d:"M15 14h.01",key:"1kp3bh"}],["path",{d:"M9 6h6",key:"dgm16u"}],["path",{d:"M9 10h6",key:"9gxzsh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gn=i("PenLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"ymcmye"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=i("PenSquare",[["path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1qinfi"}],["path",{d:"M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z",key:"w2jsv5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ym=i("PenTool",[["path",{d:"m12 19 7-7 3 3-7 7-3-3z",key:"rklqx2"}],["path",{d:"m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z",key:"1et58u"}],["path",{d:"m2 2 7.586 7.586",key:"etlp93"}],["circle",{cx:"11",cy:"11",r:"2",key:"xmgehs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=i("Pen",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jm=i("PencilLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"ymcmye"}],["path",{d:"m15 5 3 3",key:"1w25hb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e3=i("PencilRuler",[["path",{d:"m15 5 4 4",key:"1mk7zo"}],["path",{d:"M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13",key:"orapub"}],["path",{d:"m8 6 2-2",key:"115y1s"}],["path",{d:"m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 0 0-4-4L3.5 16.5Z",key:"hes763"}],["path",{d:"m18 16 2-2",key:"ee94s4"}],["path",{d:"m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17",key:"cfq27r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t3=i("Pencil",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n3=i("Pentagon",[["path",{d:"M3.5 8.7c-.7.5-1 1.4-.7 2.2l2.8 8.7c.3.8 1 1.4 1.9 1.4h9.1c.9 0 1.6-.6 1.9-1.4l2.8-8.7c.3-.8 0-1.7-.7-2.2l-7.4-5.3a2.1 2.1 0 0 0-2.4 0Z",key:"hsj90r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a3=i("PercentCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 15h.01",key:"lqbp3k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i3=i("PercentDiamond",[["path",{d:"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z",key:"1tpxz2"}],["path",{d:"M9.2 9.2h.01",key:"1b7bvt"}],["path",{d:"m14.5 9.5-5 5",key:"17q4r4"}],["path",{d:"M14.7 14.8h.01",key:"17nsh4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r3=i("PercentSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 15h.01",key:"lqbp3k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o3=i("Percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s3=i("PersonStanding",[["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["path",{d:"m9 20 3-6 3 6",key:"se2kox"}],["path",{d:"m6 8 6 2 6-2",key:"4o3us4"}],["path",{d:"M12 10v4",key:"1kjpxc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c3=i("PhoneCall",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}],["path",{d:"M14.05 2a9 9 0 0 1 8 7.94",key:"vmijpz"}],["path",{d:"M14.05 6A5 5 0 0 1 18 10",key:"13nbpp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l3=i("PhoneForwarded",[["polyline",{points:"18 2 22 6 18 10",key:"6vjanh"}],["line",{x1:"14",x2:"22",y1:"6",y2:"6",key:"1jsywh"}],["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d3=i("PhoneIncoming",[["polyline",{points:"16 2 16 8 22 8",key:"1ygljm"}],["line",{x1:"22",x2:"16",y1:"2",y2:"8",key:"1xzwqn"}],["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h3=i("PhoneMissed",[["line",{x1:"22",x2:"16",y1:"2",y2:"8",key:"1xzwqn"}],["line",{x1:"16",x2:"22",y1:"2",y2:"8",key:"13zxdn"}],["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u3=i("PhoneOff",[["path",{d:"M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91",key:"z86iuo"}],["line",{x1:"22",x2:"2",y1:"2",y2:"22",key:"11kh81"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y3=i("PhoneOutgoing",[["polyline",{points:"22 8 22 2 16 2",key:"1g204g"}],["line",{x1:"16",x2:"22",y1:"8",y2:"2",key:"1ggias"}],["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p3=i("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k3=i("PiSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 7h10",key:"udp07y"}],["path",{d:"M10 7v10",key:"i1d9ee"}],["path",{d:"M16 17a2 2 0 0 1-2-2V7",key:"ftwdc7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f3=i("Pi",[["line",{x1:"9",x2:"9",y1:"4",y2:"20",key:"ovs5a5"}],["path",{d:"M4 7c0-1.7 1.3-3 3-3h13",key:"10pag4"}],["path",{d:"M18 20c-1.7 0-3-1.3-3-3V4",key:"1gaosr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m3=i("Piano",[["path",{d:"M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8",key:"lag0yf"}],["path",{d:"M2 14h20",key:"myj16y"}],["path",{d:"M6 14v4",key:"9ng0ue"}],["path",{d:"M10 14v4",key:"1v8uk5"}],["path",{d:"M14 14v4",key:"1tqops"}],["path",{d:"M18 14v4",key:"18uqwm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g3=i("PictureInPicture2",[["path",{d:"M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4",key:"daa4of"}],["rect",{width:"10",height:"7",x:"12",y:"13",rx:"2",key:"1nb8gs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x3=i("PictureInPicture",[["path",{d:"M8 4.5v5H3m-1-6 6 6m13 0v-3c0-1.16-.84-2-2-2h-7m-9 9v2c0 1.05.95 2 2 2h3",key:"bcd8fb"}],["rect",{width:"10",height:"7",x:"12",y:"13.5",ry:"2",key:"136fx3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v3=i("PieChart",[["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}],["path",{d:"M22 12A10 10 0 0 0 12 2v10z",key:"1rfc4y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M3=i("PiggyBank",[["path",{d:"M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z",key:"uf6l00"}],["path",{d:"M2 9v1c0 1.1.9 2 2 2h1",key:"nm575m"}],["path",{d:"M16 11h0",key:"k2aug8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w3=i("PilcrowSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 12H9.5a2.5 2.5 0 0 1 0-5H17",key:"1l9586"}],["path",{d:"M12 7v10",key:"jspqdw"}],["path",{d:"M16 7v10",key:"lavkr4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L3=i("Pilcrow",[["path",{d:"M13 4v16",key:"8vvj80"}],["path",{d:"M17 4v16",key:"7dpous"}],["path",{d:"M19 4H9.5a4.5 4.5 0 0 0 0 9H13",key:"sh4n9v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C3=i("Pill",[["path",{d:"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",key:"wa1lgi"}],["path",{d:"m8.5 8.5 7 7",key:"rvfmvr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S3=i("PinOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["line",{x1:"12",x2:"12",y1:"17",y2:"22",key:"1jrz49"}],["path",{d:"M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h12",key:"13x2n8"}],["path",{d:"M15 9.34V6h1a2 2 0 0 0 0-4H7.89",key:"reo3ki"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I3=i("Pin",[["line",{x1:"12",x2:"12",y1:"17",y2:"22",key:"1jrz49"}],["path",{d:"M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z",key:"13yl11"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j3=i("Pipette",[["path",{d:"m2 22 1-1h3l9-9",key:"1sre89"}],["path",{d:"M3 21v-3l9-9",key:"hpe2y6"}],["path",{d:"m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z",key:"196du1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b3=i("Pizza",[["path",{d:"M15 11h.01",key:"rns66s"}],["path",{d:"M11 15h.01",key:"k85uqc"}],["path",{d:"M16 16h.01",key:"1f9h7w"}],["path",{d:"m2 16 20 6-6-20A20 20 0 0 0 2 16",key:"e4slt2"}],["path",{d:"M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4",key:"rerf8f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P3=i("PlaneLanding",[["path",{d:"M2 22h20",key:"272qi7"}],["path",{d:"M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z",key:"1ma21e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A3=i("PlaneTakeoff",[["path",{d:"M2 22h20",key:"272qi7"}],["path",{d:"M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z",key:"fkigj9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z3=i("Plane",[["path",{d:"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",key:"1v9wt8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ai=i("PlayCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"10 8 16 12 10 16 10 8",key:"1cimsy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V3=i("PlaySquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m9 8 6 4-6 4Z",key:"f1r3lt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H3=i("Play",[["polygon",{points:"5 3 19 12 5 21 5 3",key:"191637"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T3=i("Plug2",[["path",{d:"M9 2v6",key:"17ngun"}],["path",{d:"M15 2v6",key:"s7yy2p"}],["path",{d:"M12 17v5",key:"bb1du9"}],["path",{d:"M5 8h14",key:"pcz4l3"}],["path",{d:"M6 11V8h12v3a6 6 0 1 1-12 0v0Z",key:"nd4hoy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q3=i("PlugZap2",[["path",{d:"m13 2-2 2.5h3L12 7",key:"1me98u"}],["path",{d:"M10 14v-3",key:"1mllf3"}],["path",{d:"M14 14v-3",key:"1l3fkq"}],["path",{d:"M11 19c-1.7 0-3-1.3-3-3v-2h8v2c0 1.7-1.3 3-3 3Z",key:"jd5pat"}],["path",{d:"M12 22v-3",key:"kmzjlo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D3=i("PlugZap",[["path",{d:"M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",key:"goz73y"}],["path",{d:"m2 22 3-3",key:"19mgm9"}],["path",{d:"M7.5 13.5 10 11",key:"7xgeeb"}],["path",{d:"M10.5 16.5 13 14",key:"10btkg"}],["path",{d:"m18 3-4 4h6l-4 4",key:"16psg9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F3=i("Plug",[["path",{d:"M12 22v-5",key:"1ega77"}],["path",{d:"M9 8V2",key:"14iosj"}],["path",{d:"M15 8V2",key:"18g5xt"}],["path",{d:"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",key:"osxo6l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ii=i("PlusCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R3=i("PlusSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B3=i("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N3=i("PocketKnife",[["path",{d:"M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2",key:"19w3oe"}],["path",{d:"M18 6h.01",key:"1v4wsw"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z",key:"6fykxj"}],["path",{d:"M18 11.66V22a4 4 0 0 0 4-4V6",key:"1utzek"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E3=i("Pocket",[["path",{d:"M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z",key:"1mz881"}],["polyline",{points:"8 10 12 14 16 10",key:"w4mbv5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O3=i("Podcast",[["circle",{cx:"12",cy:"11",r:"1",key:"1gvufo"}],["path",{d:"M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5Z",key:"1n5fvv"}],["path",{d:"M8 14a5 5 0 1 1 8 0",key:"fc81rn"}],["path",{d:"M17 18.5a9 9 0 1 0-10 0",key:"jqtxkf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U3=i("PointerOff",[["path",{d:"M10 4.5V4a2 2 0 0 0-2.41-1.957",key:"jsi14n"}],["path",{d:"M13.9 8.4a2 2 0 0 0-1.26-1.295",key:"hirc7f"}],["path",{d:"M21.7 16.2A8 8 0 0 0 22 14v-3a2 2 0 1 0-4 0v-1a2 2 0 0 0-3.63-1.158",key:"1jxb2e"}],["path",{d:"m7 15-1.8-1.8a2 2 0 0 0-2.79 2.86L6 19.7a7.74 7.74 0 0 0 6 2.3h2a8 8 0 0 0 5.657-2.343",key:"10r7hm"}],["path",{d:"M6 6v8",key:"tv5xkp"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z3=i("Pointer",[["path",{d:"M22 14a8 8 0 0 1-8 8",key:"56vcr3"}],["path",{d:"M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0",key:"1pp0yd"}],["path",{d:"M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1",key:"u654g"}],["path",{d:"M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10",key:"1e2dtv"}],["path",{d:"M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"g6ys72"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _3=i("Popcorn",[["path",{d:"M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4",key:"10td1f"}],["path",{d:"M10 22 9 8",key:"yjptiv"}],["path",{d:"m14 22 1-14",key:"8jwc8b"}],["path",{d:"M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z",key:"1qo33t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W3=i("Popsicle",[["path",{d:"M18.6 14.4c.8-.8.8-2 0-2.8l-8.1-8.1a4.95 4.95 0 1 0-7.1 7.1l8.1 8.1c.9.7 2.1.7 2.9-.1Z",key:"1o68ps"}],["path",{d:"m22 22-5.5-5.5",key:"17o70y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G3=i("PoundSterling",[["path",{d:"M18 7c0-5.333-8-5.333-8 0",key:"1prm2n"}],["path",{d:"M10 7v14",key:"18tmcs"}],["path",{d:"M6 21h12",key:"4dkmi1"}],["path",{d:"M6 13h10",key:"ybwr4a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $3=i("PowerCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 12V6",key:"30zewn"}],["path",{d:"M8 7.5A6.1 6.1 0 0 0 12 18a6 6 0 0 0 4-10.5",key:"1r0tk2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X3=i("PowerOff",[["path",{d:"M18.36 6.64A9 9 0 0 1 20.77 15",key:"dxknvb"}],["path",{d:"M6.16 6.16a9 9 0 1 0 12.68 12.68",key:"1x7qb5"}],["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K3=i("PowerSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 7v5",key:"ma6bk"}],["path",{d:"M8 9a5.14 5.14 0 0 0 4 8 4.95 4.95 0 0 0 4-8",key:"15eubv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q3=i("Power",[["path",{d:"M12 2v10",key:"mnfbl"}],["path",{d:"M18.4 6.6a9 9 0 1 1-12.77.04",key:"obofu9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y3=i("Presentation",[["path",{d:"M2 3h20",key:"91anmk"}],["path",{d:"M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3",key:"2k9sn8"}],["path",{d:"m7 21 5-5 5 5",key:"bip4we"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J3=i("Printer",[["polyline",{points:"6 9 6 2 18 2 18 9",key:"1306q4"}],["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["rect",{width:"12",height:"8",x:"6",y:"14",key:"5ipwut"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e6=i("Projector",[["path",{d:"M5 7 3 5",key:"1yys58"}],["path",{d:"M9 6V3",key:"1ptz9u"}],["path",{d:"m13 7 2-2",key:"1w3vmq"}],["circle",{cx:"9",cy:"13",r:"3",key:"1mma13"}],["path",{d:"M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17",key:"2frwzc"}],["path",{d:"M16 16h2",key:"dnq2od"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t6=i("Puzzle",[["path",{d:"M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z",key:"i0oyt7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n6=i("Pyramid",[["path",{d:"M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z",key:"aenxs0"}],["path",{d:"M12 2v20",key:"t6zp3m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a6=i("QrCode",[["rect",{width:"5",height:"5",x:"3",y:"3",rx:"1",key:"1tu5fj"}],["rect",{width:"5",height:"5",x:"16",y:"3",rx:"1",key:"1v8r4q"}],["rect",{width:"5",height:"5",x:"3",y:"16",rx:"1",key:"1x03jg"}],["path",{d:"M21 16h-3a2 2 0 0 0-2 2v3",key:"177gqh"}],["path",{d:"M21 21v.01",key:"ents32"}],["path",{d:"M12 7v3a2 2 0 0 1-2 2H7",key:"8crl2c"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M12 3h.01",key:"n36tog"}],["path",{d:"M12 16v.01",key:"133mhm"}],["path",{d:"M16 12h1",key:"1slzba"}],["path",{d:"M21 12v.01",key:"1lwtk9"}],["path",{d:"M12 21v-1",key:"1880an"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i6=i("Quote",[["path",{d:"M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z",key:"4rm80e"}],["path",{d:"M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",key:"10za9r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r6=i("Rabbit",[["path",{d:"M13 16a3 3 0 0 1 2.24 5",key:"1epib5"}],["path",{d:"M18 12h.01",key:"yjnet6"}],["path",{d:"M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3",key:"ue9ozu"}],["path",{d:"M20 8.54V4a2 2 0 1 0-4 0v3",key:"49iql8"}],["path",{d:"M7.612 12.524a3 3 0 1 0-1.6 4.3",key:"1e33i0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o6=i("Radar",[["path",{d:"M19.07 4.93A10 10 0 0 0 6.99 3.34",key:"z3du51"}],["path",{d:"M4 6h.01",key:"oypzma"}],["path",{d:"M2.29 9.62A10 10 0 1 0 21.31 8.35",key:"qzzz0"}],["path",{d:"M16.24 7.76A6 6 0 1 0 8.23 16.67",key:"1yjesh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M17.99 11.66A6 6 0 0 1 15.77 16.67",key:"1u2y91"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"m13.41 10.59 5.66-5.66",key:"mhq4k0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s6=i("Radiation",[["path",{d:"M12 12h0.01",key:"6ztbls"}],["path",{d:"M7.5 4.2c-.3-.5-.9-.7-1.3-.4C3.9 5.5 2.3 8.1 2 11c-.1.5.4 1 1 1h5c0-1.5.8-2.8 2-3.4-1.1-1.9-2-3.5-2.5-4.4z",key:"wy49g3"}],["path",{d:"M21 12c.6 0 1-.4 1-1-.3-2.9-1.8-5.5-4.1-7.1-.4-.3-1.1-.2-1.3.3-.6.9-1.5 2.5-2.6 4.3 1.2.7 2 2 2 3.5h5z",key:"vklnvr"}],["path",{d:"M7.5 19.8c-.3.5-.1 1.1.4 1.3 2.6 1.2 5.6 1.2 8.2 0 .5-.2.7-.8.4-1.3-.5-.9-1.4-2.5-2.5-4.3-1.2.7-2.8.7-4 0-1.1 1.8-2 3.4-2.5 4.3z",key:"wkdf1o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c6=i("RadioReceiver",[["path",{d:"M5 16v2",key:"g5qcv5"}],["path",{d:"M19 16v2",key:"1gbaio"}],["rect",{width:"20",height:"8",x:"2",y:"8",rx:"2",key:"vjsjur"}],["path",{d:"M18 12h0",key:"1ucjzd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l6=i("RadioTower",[["path",{d:"M4.9 16.1C1 12.2 1 5.8 4.9 1.9",key:"s0qx1y"}],["path",{d:"M7.8 4.7a6.14 6.14 0 0 0-.8 7.5",key:"1idnkw"}],["circle",{cx:"12",cy:"9",r:"2",key:"1092wv"}],["path",{d:"M16.2 4.8c2 2 2.26 5.11.8 7.47",key:"ojru2q"}],["path",{d:"M19.1 1.9a9.96 9.96 0 0 1 0 14.1",key:"rhi7fg"}],["path",{d:"M9.5 18h5",key:"mfy3pd"}],["path",{d:"m8 22 4-11 4 11",key:"25yftu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d6=i("Radio",[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9",key:"1vaf9d"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5",key:"u1ii0m"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5",key:"1j5fej"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19",key:"10b0cb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h6=i("Radius",[["path",{d:"M20.34 17.52a10 10 0 1 0-2.82 2.82",key:"fydyku"}],["circle",{cx:"19",cy:"19",r:"2",key:"17f5cg"}],["path",{d:"m13.41 13.41 4.18 4.18",key:"1gqbwc"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u6=i("RailSymbol",[["path",{d:"M5 15h14",key:"m0yey3"}],["path",{d:"M5 9h14",key:"7tsvo6"}],["path",{d:"m14 20-5-5 6-6-5-5",key:"1jo42i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y6=i("Rainbow",[["path",{d:"M22 17a10 10 0 0 0-20 0",key:"ozegv"}],["path",{d:"M6 17a6 6 0 0 1 12 0",key:"5giftw"}],["path",{d:"M10 17a2 2 0 0 1 4 0",key:"gnsikk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p6=i("Rat",[["path",{d:"M17 5c0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .8.3 1.5.8 2H11c-3.9 0-7 3.1-7 7v0c0 2.2 1.8 4 4 4",key:"16aj0u"}],["path",{d:"M16.8 3.9c.3-.3.6-.5 1-.7 1.5-.6 3.3.1 3.9 1.6.6 1.5-.1 3.3-1.6 3.9l1.6 2.8c.2.3.2.7.2 1-.2.8-.9 1.2-1.7 1.1 0 0-1.6-.3-2.7-.6H17c-1.7 0-3 1.3-3 3",key:"1crdmb"}],["path",{d:"M13.2 18a3 3 0 0 0-2.2-5",key:"1ol3lk"}],["path",{d:"M13 22H4a2 2 0 0 1 0-4h12",key:"bt3f23"}],["path",{d:"M16 9h.01",key:"1bdo4e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k6=i("Ratio",[["rect",{width:"12",height:"20",x:"6",y:"2",rx:"2",key:"1oxtiu"}],["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f6=i("Receipt",[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z",key:"wqdwcb"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17V7",key:"pyj7ub"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m6=i("RectangleHorizontal",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g6=i("RectangleVertical",[["rect",{width:"12",height:"20",x:"6",y:"2",rx:"2",key:"1oxtiu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x6=i("Recycle",[["path",{d:"M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5",key:"x6z5xu"}],["path",{d:"M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12",key:"1x4zh5"}],["path",{d:"m14 16-3 3 3 3",key:"f6jyew"}],["path",{d:"M8.293 13.596 7.196 9.5 3.1 10.598",key:"wf1obh"}],["path",{d:"m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843",key:"9tzpgr"}],["path",{d:"m13.378 9.633 4.096 1.098 1.097-4.096",key:"1oe83g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v6=i("Redo2",[["path",{d:"m15 14 5-5-5-5",key:"12vg1m"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13",key:"19mnr4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M6=i("RedoDot",[["circle",{cx:"12",cy:"17",r:"1",key:"1ixnty"}],["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w6=i("Redo",[["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L6=i("RefreshCcwDot",[["path",{d:"M3 2v6h6",key:"18ldww"}],["path",{d:"M21 12A9 9 0 0 0 6 5.3L3 8",key:"1pbrqz"}],["path",{d:"M21 22v-6h-6",key:"usdfbe"}],["path",{d:"M3 12a9 9 0 0 0 15 6.7l3-2.7",key:"1hosoe"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C6=i("RefreshCcw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S6=i("RefreshCwOff",[["path",{d:"M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47",key:"1krf6h"}],["path",{d:"M8 16H3v5",key:"1cv678"}],["path",{d:"M3 12C3 9.51 4 7.26 5.64 5.64",key:"ruvoct"}],["path",{d:"m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64",key:"19q130"}],["path",{d:"M21 12c0 1-.16 1.97-.47 2.87",key:"4w8emr"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M22 22 2 2",key:"1r8tn9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I6=i("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j6=i("Refrigerator",[["path",{d:"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z",key:"fpq118"}],["path",{d:"M5 10h14",key:"elsbfy"}],["path",{d:"M15 7v6",key:"1nx30x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b6=i("Regex",[["path",{d:"M17 3v10",key:"15fgeh"}],["path",{d:"m12.67 5.5 8.66 5",key:"1gpheq"}],["path",{d:"m12.67 10.5 8.66-5",key:"1dkfa6"}],["path",{d:"M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z",key:"swwfx4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P6=i("RemoveFormatting",[["path",{d:"M4 7V4h16v3",key:"9msm58"}],["path",{d:"M5 20h6",key:"1h6pxn"}],["path",{d:"M13 4 8 20",key:"kqq6aj"}],["path",{d:"m15 15 5 5",key:"me55sn"}],["path",{d:"m20 15-5 5",key:"11p7ol"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A6=i("Repeat1",[["path",{d:"m17 2 4 4-4 4",key:"nntrym"}],["path",{d:"M3 11v-1a4 4 0 0 1 4-4h14",key:"84bu3i"}],["path",{d:"m7 22-4-4 4-4",key:"1wqhfi"}],["path",{d:"M21 13v1a4 4 0 0 1-4 4H3",key:"1rx37r"}],["path",{d:"M11 10h1v4",key:"70cz1p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z6=i("Repeat2",[["path",{d:"m2 9 3-3 3 3",key:"1ltn5i"}],["path",{d:"M13 18H7a2 2 0 0 1-2-2V6",key:"1r6tfw"}],["path",{d:"m22 15-3 3-3-3",key:"4rnwn2"}],["path",{d:"M11 6h6a2 2 0 0 1 2 2v10",key:"2f72bc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V6=i("Repeat",[["path",{d:"m17 2 4 4-4 4",key:"nntrym"}],["path",{d:"M3 11v-1a4 4 0 0 1 4-4h14",key:"84bu3i"}],["path",{d:"m7 22-4-4 4-4",key:"1wqhfi"}],["path",{d:"M21 13v1a4 4 0 0 1-4 4H3",key:"1rx37r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H6=i("ReplaceAll",[["path",{d:"M14 4c0-1.1.9-2 2-2",key:"1mvvbw"}],["path",{d:"M20 2c1.1 0 2 .9 2 2",key:"1mj6oe"}],["path",{d:"M22 8c0 1.1-.9 2-2 2",key:"v1wql3"}],["path",{d:"M16 10c-1.1 0-2-.9-2-2",key:"821ux0"}],["path",{d:"m3 7 3 3 3-3",key:"x25e72"}],["path",{d:"M6 10V5c0-1.7 1.3-3 3-3h1",key:"13af7h"}],["rect",{width:"8",height:"8",x:"2",y:"14",rx:"2",key:"17ihk4"}],["path",{d:"M14 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2",key:"1w9p8c"}],["path",{d:"M20 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2",key:"m45eaa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T6=i("Replace",[["path",{d:"M14 4c0-1.1.9-2 2-2",key:"1mvvbw"}],["path",{d:"M20 2c1.1 0 2 .9 2 2",key:"1mj6oe"}],["path",{d:"M22 8c0 1.1-.9 2-2 2",key:"v1wql3"}],["path",{d:"M16 10c-1.1 0-2-.9-2-2",key:"821ux0"}],["path",{d:"m3 7 3 3 3-3",key:"x25e72"}],["path",{d:"M6 10V5c0-1.7 1.3-3 3-3h1",key:"13af7h"}],["rect",{width:"8",height:"8",x:"2",y:"14",rx:"2",key:"17ihk4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q6=i("ReplyAll",[["polyline",{points:"7 17 2 12 7 7",key:"t83bqg"}],["polyline",{points:"12 17 7 12 12 7",key:"1g4ajm"}],["path",{d:"M22 18v-2a4 4 0 0 0-4-4H7",key:"1fcyog"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D6=i("Reply",[["polyline",{points:"9 17 4 12 9 7",key:"hvgpf2"}],["path",{d:"M20 18v-2a4 4 0 0 0-4-4H4",key:"5vmcpk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F6=i("Rewind",[["polygon",{points:"11 19 2 12 11 5 11 19",key:"14yba5"}],["polygon",{points:"22 19 13 12 22 5 22 19",key:"1pi1cj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R6=i("Ribbon",[["path",{d:"M17.75 9.01c-.52 2.08-1.83 3.64-3.18 5.49l-2.6 3.54-2.97 4-3.5-2.54 3.85-4.97c-1.86-2.61-2.8-3.77-3.16-5.44",key:"1njedg"}],["path",{d:"M17.75 9.01A7 7 0 0 0 6.2 9.1C6.06 8.5 6 7.82 6 7c0-3.5 2.83-5 5.98-5C15.24 2 18 3.5 18 7c0 .73-.09 1.4-.25 2.01Z",key:"10len7"}],["path",{d:"m9.35 14.53 2.64-3.31",key:"1wfi09"}],["path",{d:"m11.97 18.04 2.99 4 3.54-2.54-3.93-5",key:"1ezyge"}],["path",{d:"M14 8c0 1-1 2-2.01 3.22C11 10 10 9 10 8a2 2 0 1 1 4 0",key:"aw0zq5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B6=i("Rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N6=i("RockingChair",[["polyline",{points:"3.5 2 6.5 12.5 18 12.5",key:"y3iy52"}],["line",{x1:"9.5",x2:"5.5",y1:"12.5",y2:"20",key:"19vg5i"}],["line",{x1:"15",x2:"18.5",y1:"12.5",y2:"20",key:"1inpmv"}],["path",{d:"M2.75 18a13 13 0 0 0 18.5 0",key:"1nquas"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E6=i("RollerCoaster",[["path",{d:"M6 19V5",key:"1r845m"}],["path",{d:"M10 19V6.8",key:"9j2tfs"}],["path",{d:"M14 19v-7.8",key:"10s8qv"}],["path",{d:"M18 5v4",key:"1tajlv"}],["path",{d:"M18 19v-6",key:"ielfq3"}],["path",{d:"M22 19V9",key:"158nzp"}],["path",{d:"M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65",key:"1930oh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xn=i("Rotate3d",[["path",{d:"M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2",key:"10n0gc"}],["path",{d:"m15.194 13.707 3.814 1.86-1.86 3.814",key:"16shm9"}],["path",{d:"M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4",key:"1lxi77"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O6=i("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U6=i("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z6=i("RouteOff",[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5c.4 0 .9-.1 1.3-.2",key:"1effex"}],["path",{d:"M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12",key:"k9y2ds"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M21 15.3a3.5 3.5 0 0 0-3.3-3.3",key:"11nlu2"}],["path",{d:"M15 5h-4.3",key:"6537je"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _6=i("Route",[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",key:"1d8sl"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W6=i("Router",[["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",key:"w68u3i"}],["path",{d:"M6.01 18H6",key:"19vcac"}],["path",{d:"M10.01 18H10",key:"uamcmx"}],["path",{d:"M15 10v4",key:"qjz1xs"}],["path",{d:"M17.84 7.17a4 4 0 0 0-5.66 0",key:"1rif40"}],["path",{d:"M20.66 4.34a8 8 0 0 0-11.31 0",key:"6a5xfq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kn=i("Rows2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 12h18",key:"1i2n21"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qn=i("Rows3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M21 9H3",key:"1338ky"}],["path",{d:"M21 15H3",key:"9uk58r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G6=i("Rows4",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M21 7.5H3",key:"1hm9pq"}],["path",{d:"M21 12H3",key:"2avoz0"}],["path",{d:"M21 16.5H3",key:"n7jzkj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $6=i("Rss",[["path",{d:"M4 11a9 9 0 0 1 9 9",key:"pv89mb"}],["path",{d:"M4 4a16 16 0 0 1 16 16",key:"k0647b"}],["circle",{cx:"5",cy:"19",r:"1",key:"bfqh0e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X6=i("Ruler",[["path",{d:"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",key:"icamh8"}],["path",{d:"m14.5 12.5 2-2",key:"inckbg"}],["path",{d:"m11.5 9.5 2-2",key:"fmmyf7"}],["path",{d:"m8.5 6.5 2-2",key:"vc6u1g"}],["path",{d:"m17.5 15.5 2-2",key:"wo5hmg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K6=i("RussianRuble",[["path",{d:"M6 11h8a4 4 0 0 0 0-8H9v18",key:"18ai8t"}],["path",{d:"M6 15h8",key:"1y8f6l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q6=i("Sailboat",[["path",{d:"M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z",key:"1404fh"}],["path",{d:"M21 14 10 2 3 14h18Z",key:"1nzg7v"}],["path",{d:"M10 2v16",key:"1labyt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y6=i("Salad",[["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z",key:"4rw317"}],["path",{d:"M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1",key:"10xrj0"}],["path",{d:"m13 12 4-4",key:"1hckqy"}],["path",{d:"M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2",key:"1p4srx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J6=i("Sandwich",[["path",{d:"M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3",key:"34v9d7"}],["path",{d:"M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83",key:"1k5vfb"}],["path",{d:"m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z",key:"1oe7l6"}],["path",{d:"M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z",key:"1ts2ri"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e8=i("SatelliteDish",[["path",{d:"M4 10a7.31 7.31 0 0 0 10 10Z",key:"1fzpp3"}],["path",{d:"m9 15 3-3",key:"88sc13"}],["path",{d:"M17 13a6 6 0 0 0-6-6",key:"15cc6u"}],["path",{d:"M21 13A10 10 0 0 0 11 3",key:"11nf8s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t8=i("Satellite",[["path",{d:"M13 7 9 3 5 7l4 4",key:"vyckw6"}],["path",{d:"m17 11 4 4-4 4-4-4",key:"rchckc"}],["path",{d:"m8 12 4 4 6-6-4-4Z",key:"1sshf7"}],["path",{d:"m16 8 3-3",key:"x428zp"}],["path",{d:"M9 21a6 6 0 0 0-6-6",key:"1iajcf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n8=i("SaveAll",[["path",{d:"M6 4a2 2 0 0 1 2-2h10l4 4v10.2a2 2 0 0 1-2 1.8H8a2 2 0 0 1-2-2Z",key:"1unput"}],["path",{d:"M10 2v4h6",key:"1p5sg6"}],["path",{d:"M18 18v-7h-8v7",key:"1oniuk"}],["path",{d:"M18 22H4a2 2 0 0 1-2-2V6",key:"pblm9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a8=i("Save",[["path",{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",key:"1owoqh"}],["polyline",{points:"17 21 17 13 7 13 7 21",key:"1md35c"}],["polyline",{points:"7 3 7 8 15 8",key:"8nz8an"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yn=i("Scale3d",[["circle",{cx:"19",cy:"19",r:"2",key:"17f5cg"}],["circle",{cx:"5",cy:"5",r:"2",key:"1gwv83"}],["path",{d:"M5 7v12h12",key:"vtaa4r"}],["path",{d:"m5 19 6-6",key:"jh6hbb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i8=i("Scale",[["path",{d:"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"7g6ntu"}],["path",{d:"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"ijws7r"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",key:"3gwbw2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r8=i("Scaling",[["path",{d:"M21 3 9 15",key:"15kdhq"}],["path",{d:"M12 3H3v18h18v-9",key:"8suug0"}],["path",{d:"M16 3h5v5",key:"1806ms"}],["path",{d:"M14 15H9v-5",key:"pi4jk9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o8=i("ScanBarcode",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M8 7v10",key:"23sfjj"}],["path",{d:"M12 7v10",key:"jspqdw"}],["path",{d:"M17 7v10",key:"578dap"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s8=i("ScanEye",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M5 12s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5",key:"nhuolu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c8=i("ScanFace",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M8 14s1.5 2 4 2 4-2 4-2",key:"1y1vjs"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 9h.01",key:"x1ddxp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l8=i("ScanLine",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M7 12h10",key:"b7w52i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d8=i("ScanSearch",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"m16 16-1.9-1.9",key:"1dq9hf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h8=i("ScanText",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M7 8h8",key:"1jbsf9"}],["path",{d:"M7 12h10",key:"b7w52i"}],["path",{d:"M7 16h6",key:"1vyc9m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u8=i("Scan",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y8=i("ScatterChart",[["circle",{cx:"7.5",cy:"7.5",r:".5",key:"1x97lo"}],["circle",{cx:"18.5",cy:"5.5",r:".5",key:"56iowl"}],["circle",{cx:"11.5",cy:"11.5",r:".5",key:"m9xkw9"}],["circle",{cx:"7.5",cy:"16.5",r:".5",key:"14ln9z"}],["circle",{cx:"17.5",cy:"14.5",r:".5",key:"14qxqt"}],["path",{d:"M3 3v18h18",key:"1s2lah"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p8=i("School2",[["circle",{cx:"12",cy:"10",r:"1",key:"1gnqs8"}],["path",{d:"M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z",key:"8z0lq4"}],["path",{d:"M6 17v.01",key:"roodi6"}],["path",{d:"M6 13v.01",key:"67c122"}],["path",{d:"M18 17v.01",key:"12ktxm"}],["path",{d:"M18 13v.01",key:"tn1rt1"}],["path",{d:"M14 22v-5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5",key:"jfgdp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k8=i("School",[["path",{d:"m4 6 8-4 8 4",key:"1q0ilc"}],["path",{d:"m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2",key:"1vwozw"}],["path",{d:"M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4",key:"cpkuc4"}],["path",{d:"M18 5v17",key:"1sw6gf"}],["path",{d:"M6 5v17",key:"1xfsm0"}],["circle",{cx:"12",cy:"9",r:"2",key:"1092wv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f8=i("ScissorsLineDashed",[["path",{d:"M5.42 9.42 8 12",key:"12pkuq"}],["circle",{cx:"4",cy:"8",r:"2",key:"107mxr"}],["path",{d:"m14 6-8.58 8.58",key:"gvzu5l"}],["circle",{cx:"4",cy:"16",r:"2",key:"1ehqvc"}],["path",{d:"M10.8 14.8 14 18",key:"ax7m9r"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m8=i("ScissorsSquareDashedBottom",[["path",{d:"M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2",key:"1vzg26"}],["path",{d:"M10 22H8",key:"euku7a"}],["path",{d:"M16 22h-2",key:"18d249"}],["circle",{cx:"8",cy:"8",r:"2",key:"14cg06"}],["path",{d:"M9.414 9.414 12 12",key:"qz4lzr"}],["path",{d:"M14.8 14.8 18 18",key:"11flf1"}],["circle",{cx:"8",cy:"16",r:"2",key:"1acxsx"}],["path",{d:"m18 6-8.586 8.586",key:"11kzk1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g8=i("ScissorsSquare",[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"2",key:"1btzen"}],["circle",{cx:"8",cy:"8",r:"2",key:"14cg06"}],["path",{d:"M9.414 9.414 12 12",key:"qz4lzr"}],["path",{d:"M14.8 14.8 18 18",key:"11flf1"}],["circle",{cx:"8",cy:"16",r:"2",key:"1acxsx"}],["path",{d:"m18 6-8.586 8.586",key:"11kzk1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x8=i("Scissors",[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M8.12 8.12 12 12",key:"1alkpv"}],["path",{d:"M20 4 8.12 15.88",key:"xgtan2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M14.8 14.8 20 20",key:"ptml3r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v8=i("ScreenShareOff",[["path",{d:"M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3",key:"i8wdob"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"m22 3-5 5",key:"12jva0"}],["path",{d:"m17 3 5 5",key:"k36vhe"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M8=i("ScreenShare",[["path",{d:"M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3",key:"i8wdob"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"m17 8 5-5",key:"fqif7o"}],["path",{d:"M17 3h5v5",key:"1o3tu8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w8=i("ScrollText",[["path",{d:"M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4",key:"13a6an"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M15 12h-5",key:"r7krc0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L8=i("Scroll",[["path",{d:"M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4",key:"13a6an"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C8=i("SearchCheck",[["path",{d:"m8 11 2 2 4-4",key:"1sed1v"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S8=i("SearchCode",[["path",{d:"m9 9-2 2 2 2",key:"17gsfh"}],["path",{d:"m13 13 2-2-2-2",key:"186z8k"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I8=i("SearchSlash",[["path",{d:"m13.5 8.5-5 5",key:"1cs55j"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j8=i("SearchX",[["path",{d:"m13.5 8.5-5 5",key:"1cs55j"}],["path",{d:"m8.5 8.5 5 5",key:"a8mexj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b8=i("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jn=i("SendHorizontal",[["path",{d:"m3 3 3 9-3 9 19-9Z",key:"1aobqy"}],["path",{d:"M6 12h16",key:"s4cdu5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P8=i("SendToBack",[["rect",{x:"14",y:"14",width:"8",height:"8",rx:"2",key:"1b0bso"}],["rect",{x:"2",y:"2",width:"8",height:"8",rx:"2",key:"1x09vl"}],["path",{d:"M7 14v1a2 2 0 0 0 2 2h1",key:"pao6x6"}],["path",{d:"M14 7h1a2 2 0 0 1 2 2v1",key:"19tdru"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A8=i("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z8=i("SeparatorHorizontal",[["line",{x1:"3",x2:"21",y1:"12",y2:"12",key:"10d38w"}],["polyline",{points:"8 8 12 4 16 8",key:"zo8t4w"}],["polyline",{points:"16 16 12 20 8 16",key:"1oyrid"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V8=i("SeparatorVertical",[["line",{x1:"12",x2:"12",y1:"3",y2:"21",key:"1efggb"}],["polyline",{points:"8 8 4 12 8 16",key:"bnfmv4"}],["polyline",{points:"16 16 20 12 16 8",key:"u90052"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H8=i("ServerCog",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5",key:"tn8das"}],["path",{d:"M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5",key:"1g2pve"}],["path",{d:"M6 6h.01",key:"1utrut"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"m15.7 13.4-.9-.3",key:"1jwmzr"}],["path",{d:"m9.2 10.9-.9-.3",key:"qapnim"}],["path",{d:"m10.6 15.7.3-.9",key:"quwk0k"}],["path",{d:"m13.6 15.7-.4-1",key:"cb9xp7"}],["path",{d:"m10.8 9.3-.4-1",key:"1uaiz5"}],["path",{d:"m8.3 13.6 1-.4",key:"s6srou"}],["path",{d:"m14.7 10.8 1-.4",key:"4d31cq"}],["path",{d:"m13.4 8.3-.3.9",key:"1bm987"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T8=i("ServerCrash",[["path",{d:"M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2",key:"4b9dqc"}],["path",{d:"M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2",key:"22nnkd"}],["path",{d:"M6 6h.01",key:"1utrut"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"m13 6-4 6h6l-4 6",key:"14hqih"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q8=i("ServerOff",[["path",{d:"M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5",key:"bt2siv"}],["path",{d:"M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z",key:"1hjrv1"}],["path",{d:"M22 17v-1a2 2 0 0 0-2-2h-1",key:"1iynyr"}],["path",{d:"M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z",key:"161ggg"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D8=i("Server",[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F8=i("Settings2",[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R8=i("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B8=i("Shapes",[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",key:"1bo67w"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1",key:"1bkyp8"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5",key:"w3z12y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ri=i("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N8=i("Share",[["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["polyline",{points:"16 6 12 2 8 6",key:"m901s6"}],["line",{x1:"12",x2:"12",y1:"2",y2:"15",key:"1p0rca"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E8=i("Sheet",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["line",{x1:"3",x2:"21",y1:"9",y2:"9",key:"1vqk6q"}],["line",{x1:"3",x2:"21",y1:"15",y2:"15",key:"o2sbyz"}],["line",{x1:"9",x2:"9",y1:"9",y2:"21",key:"1ib60c"}],["line",{x1:"15",x2:"15",y1:"9",y2:"21",key:"1n26ft"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O8=i("Shell",[["path",{d:"M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44",key:"1cn552"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I1=i("ShieldAlert",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U8=i("ShieldBan",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"m4 5 14 12",key:"1ta6nf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z8=i("ShieldCheck",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _8=i("ShieldEllipsis",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M12 11h.01",key:"z322tv"}],["path",{d:"M16 11h.01",key:"xkw8gn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W8=i("ShieldHalf",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M12 22V2",key:"zs6s6o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G8=i("ShieldMinus",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M8 11h8",key:"vwpz6n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $8=i("ShieldOff",[["path",{d:"M19.7 14a6.9 6.9 0 0 0 .3-2V5l-8-3-3.2 1.2",key:"342pvf"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M4.7 4.7 4 5v7c0 6 8 10 8 10a20.3 20.3 0 0 0 5.62-4.38",key:"p0ycf4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X8=i("ShieldPlus",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M8 11h8",key:"vwpz6n"}],["path",{d:"M12 15V7",key:"1ycneb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K8=i("ShieldQuestion",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",key:"mhlwft"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e1=i("ShieldX",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"m14.5 9-5 5",key:"1m49dw"}],["path",{d:"m9.5 9 5 5",key:"wyx7zg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pa=i("Shield",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q8=i("ShipWheel",[["circle",{cx:"12",cy:"12",r:"8",key:"46899m"}],["path",{d:"M12 2v7.5",key:"1e5rl5"}],["path",{d:"m19 5-5.23 5.23",key:"1ezxxf"}],["path",{d:"M22 12h-7.5",key:"le1719"}],["path",{d:"m19 19-5.23-5.23",key:"p3fmgn"}],["path",{d:"M12 14.5V22",key:"dgcmos"}],["path",{d:"M10.23 13.77 5 19",key:"qwopd4"}],["path",{d:"M9.5 12H2",key:"r7bup8"}],["path",{d:"M10.23 10.23 5 5",key:"k2y7lj"}],["circle",{cx:"12",cy:"12",r:"2.5",key:"ix0uyj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y8=i("Ship",[["path",{d:"M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"iegodh"}],["path",{d:"M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76",key:"fp8vka"}],["path",{d:"M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6",key:"qpkstq"}],["path",{d:"M12 10v4",key:"1kjpxc"}],["path",{d:"M12 2v3",key:"qbqxhf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J8=i("Shirt",[["path",{d:"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",key:"1wgbhj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eg=i("ShoppingBag",[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tg=i("ShoppingBasket",[["path",{d:"m5 11 4-7",key:"116ra9"}],["path",{d:"m19 11-4-7",key:"cnml18"}],["path",{d:"M2 11h20",key:"3eubbj"}],["path",{d:"m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4",key:"1x2lvw"}],["path",{d:"m9 11 1 9",key:"1ojof7"}],["path",{d:"M4.5 15.5h15",key:"13mye1"}],["path",{d:"m15 11-1 9",key:"5wnq3a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ng=i("ShoppingCart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ag=i("Shovel",[["path",{d:"M2 22v-5l5-5 5 5-5 5z",key:"1fh25c"}],["path",{d:"M9.5 14.5 16 8",key:"1smz5x"}],["path",{d:"m17 2 5 5-.5.5a3.53 3.53 0 0 1-5 0s0 0 0 0a3.53 3.53 0 0 1 0-5L17 2",key:"1q8uv5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ig=i("ShowerHead",[["path",{d:"m4 4 2.5 2.5",key:"uv2vmf"}],["path",{d:"M13.5 6.5a4.95 4.95 0 0 0-7 7",key:"frdkwv"}],["path",{d:"M15 5 5 15",key:"1ag8rq"}],["path",{d:"M14 17v.01",key:"eokfpp"}],["path",{d:"M10 16v.01",key:"14uyyl"}],["path",{d:"M13 13v.01",key:"1v1k97"}],["path",{d:"M16 10v.01",key:"5169yg"}],["path",{d:"M11 20v.01",key:"cj92p8"}],["path",{d:"M17 14v.01",key:"11cswd"}],["path",{d:"M20 11v.01",key:"19e0od"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rg=i("Shrink",[["path",{d:"m15 15 6 6m-6-6v4.8m0-4.8h4.8",key:"17vawe"}],["path",{d:"M9 19.8V15m0 0H4.2M9 15l-6 6",key:"chjx8e"}],["path",{d:"M15 4.2V9m0 0h4.8M15 9l6-6",key:"lav6yq"}],["path",{d:"M9 4.2V9m0 0H4.2M9 9 3 3",key:"1pxi2q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const og=i("Shrub",[["path",{d:"M12 22v-7l-2-2",key:"eqv9mc"}],["path",{d:"M17 8v.8A6 6 0 0 1 13.8 20v0H10v0A6.5 6.5 0 0 1 7 8h0a5 5 0 0 1 10 0Z",key:"12jcau"}],["path",{d:"m14 14-2 2",key:"847xa2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sg=i("Shuffle",[["path",{d:"M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22",key:"1wmou1"}],["path",{d:"m18 2 4 4-4 4",key:"pucp1d"}],["path",{d:"M2 6h1.9c1.5 0 2.9.9 3.6 2.2",key:"10bdb2"}],["path",{d:"M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8",key:"vgxac0"}],["path",{d:"m18 14 4 4-4 4",key:"10pe0f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=i("SigmaSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M16 8.9V7H8l4 5-4 5h8v-1.9",key:"9nih0i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lg=i("Sigma",[["path",{d:"M18 7V4H6l6 8-6 8h12v-3",key:"zis8ev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dg=i("SignalHigh",[["path",{d:"M2 20h.01",key:"4haj6o"}],["path",{d:"M7 20v-4",key:"j294jx"}],["path",{d:"M12 20v-8",key:"i3yub9"}],["path",{d:"M17 20V8",key:"1tkaf5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hg=i("SignalLow",[["path",{d:"M2 20h.01",key:"4haj6o"}],["path",{d:"M7 20v-4",key:"j294jx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ug=i("SignalMedium",[["path",{d:"M2 20h.01",key:"4haj6o"}],["path",{d:"M7 20v-4",key:"j294jx"}],["path",{d:"M12 20v-8",key:"i3yub9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yg=i("SignalZero",[["path",{d:"M2 20h.01",key:"4haj6o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pg=i("Signal",[["path",{d:"M2 20h.01",key:"4haj6o"}],["path",{d:"M7 20v-4",key:"j294jx"}],["path",{d:"M12 20v-8",key:"i3yub9"}],["path",{d:"M17 20V8",key:"1tkaf5"}],["path",{d:"M22 4v16",key:"sih9yq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kg=i("SignpostBig",[["path",{d:"M10 9H4L2 7l2-2h6",key:"1hq7x2"}],["path",{d:"M14 5h6l2 2-2 2h-6",key:"bv62ej"}],["path",{d:"M10 22V4a2 2 0 1 1 4 0v18",key:"eqpcf2"}],["path",{d:"M8 22h8",key:"rmew8v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fg=i("Signpost",[["path",{d:"M12 3v3",key:"1n5kay"}],["path",{d:"M18.5 13h-13L2 9.5 5.5 6h13L22 9.5Z",key:"27os56"}],["path",{d:"M12 13v8",key:"1l5pq0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mg=i("Siren",[["path",{d:"M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v6H7v-6Z",key:"rmc51c"}],["path",{d:"M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2Z",key:"yyvmjy"}],["path",{d:"M21 12h1",key:"jtio3y"}],["path",{d:"M18.5 4.5 18 5",key:"g5sp9y"}],["path",{d:"M2 12h1",key:"1uaihz"}],["path",{d:"M12 2v1",key:"11qlp1"}],["path",{d:"m4.929 4.929.707.707",key:"1i51kw"}],["path",{d:"M12 12v6",key:"3ahymv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gg=i("SkipBack",[["polygon",{points:"19 20 9 12 19 4 19 20",key:"o2sva"}],["line",{x1:"5",x2:"5",y1:"19",y2:"5",key:"1ocqjk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xg=i("SkipForward",[["polygon",{points:"5 4 15 12 5 20 5 4",key:"16p6eg"}],["line",{x1:"19",x2:"19",y1:"5",y2:"19",key:"futhcm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vg=i("Skull",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["path",{d:"M8 20v2h8v-2",key:"ded4og"}],["path",{d:"m12.5 17-.5-1-.5 1h1z",key:"3me087"}],["path",{d:"M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20",key:"xq9p5u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mg=i("Slack",[["rect",{width:"3",height:"8",x:"13",y:"2",rx:"1.5",key:"diqz80"}],["path",{d:"M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5",key:"183iwg"}],["rect",{width:"3",height:"8",x:"8",y:"14",rx:"1.5",key:"hqg7r1"}],["path",{d:"M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5",key:"76g71w"}],["rect",{width:"8",height:"3",x:"14",y:"13",rx:"1.5",key:"1kmz0a"}],["path",{d:"M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5",key:"jc4sz0"}],["rect",{width:"8",height:"3",x:"2",y:"8",rx:"1.5",key:"1omvl4"}],["path",{d:"M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5",key:"16f3cl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wg=i("Slash",[["path",{d:"M22 2 2 22",key:"y4kqgn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lg=i("Slice",[["path",{d:"m8 14-6 6h9v-3",key:"zo3j9a"}],["path",{d:"M18.37 3.63 8 14l3 3L21.37 6.63a2.12 2.12 0 1 0-3-3Z",key:"1dzx0j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cg=i("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sg=i("Sliders",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ig=i("SmartphoneCharging",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12.667 8 10 12h4l-2.667 4",key:"h9lk2d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jg=i("SmartphoneNfc",[["rect",{width:"7",height:"12",x:"2",y:"6",rx:"1",key:"5nje8w"}],["path",{d:"M13 8.32a7.43 7.43 0 0 1 0 7.36",key:"1g306n"}],["path",{d:"M16.46 6.21a11.76 11.76 0 0 1 0 11.58",key:"uqvjvo"}],["path",{d:"M19.91 4.1a15.91 15.91 0 0 1 .01 15.8",key:"ujntz3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bg=i("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pg=i("SmilePlus",[["path",{d:"M22 11v1a10 10 0 1 1-9-10",key:"ew0xw9"}],["path",{d:"M8 14s1.5 2 4 2 4-2 4-2",key:"1y1vjs"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}],["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ag=i("Smile",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 14s1.5 2 4 2 4-2 4-2",key:"1y1vjs"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zg=i("Snail",[["path",{d:"M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0",key:"hneq2s"}],["circle",{cx:"10",cy:"13",r:"8",key:"194lz3"}],["path",{d:"M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6",key:"ixqyt7"}],["path",{d:"M18 3 19.1 5.2",key:"9tjm43"}],["path",{d:"M22 3 20.9 5.2",key:"j3odrs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vg=i("Snowflake",[["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}],["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"m20 16-4-4 4-4",key:"rquw4f"}],["path",{d:"m4 8 4 4-4 4",key:"12s3z9"}],["path",{d:"m16 4-4 4-4-4",key:"1tumq1"}],["path",{d:"m8 20 4-4 4 4",key:"9p200w"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hg=i("Sofa",[["path",{d:"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3",key:"1dgpiv"}],["path",{d:"M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z",key:"u5qfb7"}],["path",{d:"M4 18v2",key:"jwo5n2"}],["path",{d:"M20 18v2",key:"1ar1qi"}],["path",{d:"M12 4v9",key:"oqhhn3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tg=i("Soup",[["path",{d:"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z",key:"4rw317"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M19.5 12 22 6",key:"shfsr5"}],["path",{d:"M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62",key:"rpc6vp"}],["path",{d:"M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62",key:"1lf63m"}],["path",{d:"M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62",key:"97tijn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qg=i("Space",[["path",{d:"M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",key:"lt2kga"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dg=i("Spade",[["path",{d:"M5 9c-1.5 1.5-3 3.2-3 5.5A5.5 5.5 0 0 0 7.5 20c1.8 0 3-.5 4.5-2 1.5 1.5 2.7 2 4.5 2a5.5 5.5 0 0 0 5.5-5.5c0-2.3-1.5-4-3-5.5l-7-7-7 7Z",key:"40bo9n"}],["path",{d:"M12 18v4",key:"jadmvz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fg=i("Sparkle",[["path",{d:"m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z",key:"nraa5p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=i("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rg=i("Speaker",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["circle",{cx:"12",cy:"14",r:"4",key:"1jruaj"}],["path",{d:"M12 14h.01",key:"1etili"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bg=i("Speech",[["path",{d:"M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20",key:"11atix"}],["path",{d:"M19.8 17.8a7.5 7.5 0 0 0 .003-10.603",key:"yol142"}],["path",{d:"M17 15a3.5 3.5 0 0 0-.025-4.975",key:"ssbmkc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ng=i("SpellCheck2",[["path",{d:"m6 16 6-12 6 12",key:"1b4byz"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M4 21c1.1 0 1.1-1 2.3-1s1.1 1 2.3 1c1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1",key:"8mdmtu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eg=i("SpellCheck",[["path",{d:"m6 16 6-12 6 12",key:"1b4byz"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m16 20 2 2 4-4",key:"13tcca"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Og=i("Spline",[["circle",{cx:"19",cy:"5",r:"2",key:"mhkx31"}],["circle",{cx:"5",cy:"19",r:"2",key:"v8kfzx"}],["path",{d:"M5 17A12 12 0 0 1 17 5",key:"1okkup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ug=i("SplitSquareHorizontal",[["path",{d:"M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3",key:"lubmu8"}],["path",{d:"M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3",key:"1ag34g"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zg=i("SplitSquareVertical",[["path",{d:"M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3",key:"1pi83i"}],["path",{d:"M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3",key:"ido5k7"}],["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _g=i("Split",[["path",{d:"M16 3h5v5",key:"1806ms"}],["path",{d:"M8 3H3v5",key:"15dfkv"}],["path",{d:"M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3",key:"1qrqzj"}],["path",{d:"m15 9 6-6",key:"ko1vev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wg=i("SprayCan",[["path",{d:"M3 3h.01",key:"159qn6"}],["path",{d:"M7 5h.01",key:"1hq22a"}],["path",{d:"M11 7h.01",key:"1osv80"}],["path",{d:"M3 7h.01",key:"1xzrh3"}],["path",{d:"M7 9h.01",key:"19b3jx"}],["path",{d:"M3 11h.01",key:"1eifu7"}],["rect",{width:"4",height:"4",x:"15",y:"5",key:"mri9e4"}],["path",{d:"m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2",key:"aib6hk"}],["path",{d:"m13 14 8-2",key:"1d7bmk"}],["path",{d:"m13 19 8-2",key:"1y2vml"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gg=i("Sprout",[["path",{d:"M7 20h10",key:"e6iznv"}],["path",{d:"M10 20c5.5-2.5.8-6.4 3-10",key:"161w41"}],["path",{d:"M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z",key:"9gtqwd"}],["path",{d:"M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z",key:"bkxnd2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $g=i("SquareAsterisk",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 8v8",key:"napkw2"}],["path",{d:"m8.5 14 7-4",key:"12hpby"}],["path",{d:"m8.5 10 7 4",key:"wwy2dy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xg=i("SquareCode",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m10 10-2 2 2 2",key:"p6et6i"}],["path",{d:"m14 14 2-2-2-2",key:"m075q2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kg=i("SquareDashedBottomCode",[["path",{d:"m10 10-2 2 2 2",key:"p6et6i"}],["path",{d:"m14 14 2-2-2-2",key:"m075q2"}],["path",{d:"M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",key:"as5y1o"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 21h1",key:"v9vybs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qg=i("SquareDashedBottom",[["path",{d:"M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",key:"as5y1o"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 21h1",key:"v9vybs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yg=i("SquareDot",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jg=i("SquareEqual",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 10h10",key:"1101jm"}],["path",{d:"M7 14h10",key:"1mhdw3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e7=i("SquareSlash",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["line",{x1:"9",x2:"15",y1:"15",y2:"9",key:"1dfufj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t7=i("SquareStack",[["path",{d:"M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",key:"4i38lg"}],["path",{d:"M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",key:"mlte4a"}],["rect",{width:"8",height:"8",x:"14",y:"14",rx:"2",key:"1fa9i4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t1=i("SquareUserRound",[["path",{d:"M18 21a6 6 0 0 0-12 0",key:"kaz2du"}],["circle",{cx:"12",cy:"11",r:"4",key:"1gt34v"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n1=i("SquareUser",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2",key:"1m6ac2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n7=i("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a7=i("Squircle",[["path",{d:"M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9",key:"garfkc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i7=i("Squirrel",[["path",{d:"M15.236 22a3 3 0 0 0-2.2-5",key:"21bitc"}],["path",{d:"M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4",key:"oh0fg0"}],["path",{d:"M18 13h.01",key:"9veqaj"}],["path",{d:"M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10",key:"980v8a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r7=i("Stamp",[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z",key:"1sy9ra"}],["path",{d:"M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 2 1 3.5V13",key:"cnxgux"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o7=i("StarHalf",[["path",{d:"M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2",key:"nare05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s7=i("StarOff",[["path",{d:"M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43",key:"16m0ql"}],["path",{d:"M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91",key:"1vt8nq"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c7=i("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l7=i("StepBack",[["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["polygon",{points:"14,20 4,12 14,4",key:"ypakod"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d7=i("StepForward",[["line",{x1:"6",x2:"6",y1:"4",y2:"20",key:"fy8qot"}],["polygon",{points:"10,4 20,12 10,20",key:"1mc1pf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oi=i("Stethoscope",[["path",{d:"M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3",key:"1jd90r"}],["path",{d:"M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4",key:"126ukv"}],["circle",{cx:"20",cy:"10",r:"2",key:"ts1r5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h7=i("Sticker",[["path",{d:"M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z",key:"1wis1t"}],["path",{d:"M15 3v6h6",key:"edgan2"}],["path",{d:"M10 16s.8 1 2 1c1.3 0 2-1 2-1",key:"1vvgv3"}],["path",{d:"M8 13h0",key:"jdup5h"}],["path",{d:"M16 13h0",key:"l4i2ga"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u7=i("StickyNote",[["path",{d:"M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z",key:"1wis1t"}],["path",{d:"M15 3v6h6",key:"edgan2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y7=i("StopCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["rect",{width:"6",height:"6",x:"9",y:"9",key:"1wrtvo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p7=i("Store",[["path",{d:"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",key:"ztvudi"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["path",{d:"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",key:"2ebpfo"}],["path",{d:"M2 7h20",key:"1fcdvo"}],["path",{d:"M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7",key:"jon5kx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k7=i("StretchHorizontal",[["rect",{width:"20",height:"6",x:"2",y:"4",rx:"2",key:"qdearl"}],["rect",{width:"20",height:"6",x:"2",y:"14",rx:"2",key:"1xrn6j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f7=i("StretchVertical",[["rect",{width:"6",height:"20",x:"4",y:"2",rx:"2",key:"19qu7m"}],["rect",{width:"6",height:"20",x:"14",y:"2",rx:"2",key:"24v0nk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m7=i("Strikethrough",[["path",{d:"M16 4H9a3 3 0 0 0-2.83 4",key:"43sutm"}],["path",{d:"M14 12a4 4 0 0 1 0 8H6",key:"nlfj13"}],["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g7=i("Subscript",[["path",{d:"m4 5 8 8",key:"1eunvl"}],["path",{d:"m12 5-8 8",key:"1ah0jp"}],["path",{d:"M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07",key:"e8ta8j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x7=i("Subtitles",[["path",{d:"M7 13h4",key:"1m1xj0"}],["path",{d:"M15 13h2",key:"vgjay3"}],["path",{d:"M7 9h2",key:"1q072n"}],["path",{d:"M13 9h4",key:"o7fxw0"}],["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z",key:"5somay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v7=i("SunDim",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 4h.01",key:"1ujb9j"}],["path",{d:"M20 12h.01",key:"1ykeid"}],["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M4 12h.01",key:"158zrr"}],["path",{d:"M17.657 6.343h.01",key:"31pqzk"}],["path",{d:"M17.657 17.657h.01",key:"jehnf4"}],["path",{d:"M6.343 17.657h.01",key:"gdk6ow"}],["path",{d:"M6.343 6.343h.01",key:"1uurf0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M7=i("SunMedium",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 3v1",key:"1asbbs"}],["path",{d:"M12 20v1",key:"1wcdkc"}],["path",{d:"M3 12h1",key:"lp3yf2"}],["path",{d:"M20 12h1",key:"1vloll"}],["path",{d:"m18.364 5.636-.707.707",key:"1hakh0"}],["path",{d:"m6.343 17.657-.707.707",key:"18m9nf"}],["path",{d:"m5.636 5.636.707.707",key:"1xv1c5"}],["path",{d:"m17.657 17.657.707.707",key:"vl76zb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w7=i("SunMoon",[["path",{d:"M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4",key:"1fu5g2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.9 4.9 1.4 1.4",key:"b9915j"}],["path",{d:"m17.7 17.7 1.4 1.4",key:"qc3ed3"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.3 17.7-1.4 1.4",key:"5gca6"}],["path",{d:"m19.1 4.9-1.4 1.4",key:"wpu9u6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L7=i("SunSnow",[["path",{d:"M10 9a3 3 0 1 0 0 6",key:"6zmtdl"}],["path",{d:"M2 12h1",key:"1uaihz"}],["path",{d:"M14 21V3",key:"1llu3z"}],["path",{d:"M10 4V3",key:"pkzwkn"}],["path",{d:"M10 21v-1",key:"1u8rkd"}],["path",{d:"m3.64 18.36.7-.7",key:"105rm9"}],["path",{d:"m4.34 6.34-.7-.7",key:"d3unjp"}],["path",{d:"M14 12h8",key:"4f43i9"}],["path",{d:"m17 4-3 3",key:"15jcng"}],["path",{d:"m14 17 3 3",key:"6tlq38"}],["path",{d:"m21 15-3-3 3-3",key:"1nlnje"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C7=i("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S7=i("Sunrise",[["path",{d:"M12 2v8",key:"1q4o3n"}],["path",{d:"m4.93 10.93 1.41 1.41",key:"2a7f42"}],["path",{d:"M2 18h2",key:"j10viu"}],["path",{d:"M20 18h2",key:"wocana"}],["path",{d:"m19.07 10.93-1.41 1.41",key:"15zs5n"}],["path",{d:"M22 22H2",key:"19qnx5"}],["path",{d:"m8 6 4-4 4 4",key:"ybng9g"}],["path",{d:"M16 18a4 4 0 0 0-8 0",key:"1lzouq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I7=i("Sunset",[["path",{d:"M12 10V2",key:"16sf7g"}],["path",{d:"m4.93 10.93 1.41 1.41",key:"2a7f42"}],["path",{d:"M2 18h2",key:"j10viu"}],["path",{d:"M20 18h2",key:"wocana"}],["path",{d:"m19.07 10.93-1.41 1.41",key:"15zs5n"}],["path",{d:"M22 22H2",key:"19qnx5"}],["path",{d:"m16 6-4 4-4-4",key:"6wukr"}],["path",{d:"M16 18a4 4 0 0 0-8 0",key:"1lzouq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j7=i("Superscript",[["path",{d:"m4 19 8-8",key:"hr47gm"}],["path",{d:"m12 19-8-8",key:"1dhhmo"}],["path",{d:"M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06",key:"1dfcux"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b7=i("SwissFranc",[["path",{d:"M10 21V3h8",key:"br2l0g"}],["path",{d:"M6 16h9",key:"2py0wn"}],["path",{d:"M10 9.5h7",key:"13dmhz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P7=i("SwitchCamera",[["path",{d:"M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",key:"mtk2lu"}],["path",{d:"M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5",key:"120jsl"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"m18 22-3-3 3-3",key:"kgdoj7"}],["path",{d:"m6 2 3 3-3 3",key:"1fnbkv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A7=i("Sword",[["polyline",{points:"14.5 17.5 3 6 3 3 6 3 17.5 14.5",key:"1hfsw2"}],["line",{x1:"13",x2:"19",y1:"19",y2:"13",key:"1vrmhu"}],["line",{x1:"16",x2:"20",y1:"16",y2:"20",key:"1bron3"}],["line",{x1:"19",x2:"21",y1:"21",y2:"19",key:"13pww6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z7=i("Swords",[["polyline",{points:"14.5 17.5 3 6 3 3 6 3 17.5 14.5",key:"1hfsw2"}],["line",{x1:"13",x2:"19",y1:"19",y2:"13",key:"1vrmhu"}],["line",{x1:"16",x2:"20",y1:"16",y2:"20",key:"1bron3"}],["line",{x1:"19",x2:"21",y1:"21",y2:"19",key:"13pww6"}],["polyline",{points:"14.5 6.5 18 3 21 3 21 6 17.5 9.5",key:"hbey2j"}],["line",{x1:"5",x2:"9",y1:"14",y2:"18",key:"1hf58s"}],["line",{x1:"7",x2:"4",y1:"17",y2:"20",key:"pidxm4"}],["line",{x1:"3",x2:"5",y1:"19",y2:"21",key:"1pehsh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=i("Syringe",[["path",{d:"m18 2 4 4",key:"22kx64"}],["path",{d:"m17 7 3-3",key:"1w1zoj"}],["path",{d:"M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5",key:"1exhtz"}],["path",{d:"m9 11 4 4",key:"rovt3i"}],["path",{d:"m5 19-3 3",key:"59f2uf"}],["path",{d:"m14 4 6 6",key:"yqp9t2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V7=i("Table2",[["path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",key:"gugj83"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H7=i("TableProperties",[["path",{d:"M15 3v18",key:"14nvp0"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M21 9H3",key:"1338ky"}],["path",{d:"M21 15H3",key:"9uk58r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T7=i("Table",[["path",{d:"M12 3v18",key:"108xh3"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q7=i("TabletSmartphone",[["rect",{width:"10",height:"14",x:"3",y:"8",rx:"2",key:"1vrsiq"}],["path",{d:"M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4",key:"1j4zmg"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D7=i("Tablet",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["line",{x1:"12",x2:"12.01",y1:"18",y2:"18",key:"1dp563"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F7=i("Tablets",[["circle",{cx:"7",cy:"7",r:"5",key:"x29byf"}],["circle",{cx:"17",cy:"17",r:"5",key:"1op1d2"}],["path",{d:"M12 17h10",key:"ls21zv"}],["path",{d:"m3.46 10.54 7.08-7.08",key:"1rehiu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R7=i("Tag",[["path",{d:"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z",key:"14b2ls"}],["path",{d:"M7 7h.01",key:"7u93v4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B7=i("Tags",[["path",{d:"M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z",key:"gt587u"}],["path",{d:"M6 9.01V9",key:"1flxpt"}],["path",{d:"m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19",key:"1cbfv1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N7=i("Tally1",[["path",{d:"M4 4v16",key:"6qkkli"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E7=i("Tally2",[["path",{d:"M4 4v16",key:"6qkkli"}],["path",{d:"M9 4v16",key:"81ygyz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O7=i("Tally3",[["path",{d:"M4 4v16",key:"6qkkli"}],["path",{d:"M9 4v16",key:"81ygyz"}],["path",{d:"M14 4v16",key:"12vmem"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U7=i("Tally4",[["path",{d:"M4 4v16",key:"6qkkli"}],["path",{d:"M9 4v16",key:"81ygyz"}],["path",{d:"M14 4v16",key:"12vmem"}],["path",{d:"M19 4v16",key:"8ij5ei"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z7=i("Tally5",[["path",{d:"M4 4v16",key:"6qkkli"}],["path",{d:"M9 4v16",key:"81ygyz"}],["path",{d:"M14 4v16",key:"12vmem"}],["path",{d:"M19 4v16",key:"8ij5ei"}],["path",{d:"M22 6 2 18",key:"h9moai"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _7=i("Tangent",[["circle",{cx:"17",cy:"4",r:"2",key:"y5j2s2"}],["path",{d:"M15.59 5.41 5.41 15.59",key:"l0vprr"}],["circle",{cx:"4",cy:"17",r:"2",key:"9p4efm"}],["path",{d:"M12 22s-4-9-1.5-11.5S22 12 22 12",key:"1twk4o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W7=i("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G7=i("TentTree",[["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}],["path",{d:"m14 5 3-3 3 3",key:"1sorif"}],["path",{d:"m14 10 3-3 3 3",key:"1jyi9h"}],["path",{d:"M17 14V2",key:"8ymqnk"}],["path",{d:"M17 14H7l-5 8h20Z",key:"13ar7p"}],["path",{d:"M8 14v8",key:"1ghmqk"}],["path",{d:"m9 14 5 8",key:"13pgi6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $7=i("Tent",[["path",{d:"M3.5 21 14 3",key:"1szst5"}],["path",{d:"M20.5 21 10 3",key:"1310c3"}],["path",{d:"M15.5 21 12 15l-3.5 6",key:"1ddtfw"}],["path",{d:"M2 21h20",key:"1nyx9w"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X7=i("TerminalSquare",[["path",{d:"m7 11 2-2-2-2",key:"1lz0vl"}],["path",{d:"M11 13h4",key:"1p7l4v"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K7=i("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q7=i("TestTube2",[["path",{d:"M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01v0a2.83 2.83 0 0 1 0-4L17 3",key:"dg8b2p"}],["path",{d:"m16 2 6 6",key:"1gw87d"}],["path",{d:"M12 16H4",key:"1cjfip"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ka=i("TestTube",[["path",{d:"M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2",key:"187lwq"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M14.5 16h-5",key:"1ox875"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y7=i("TestTubes",[["path",{d:"M9 2v17.5A2.5 2.5 0 0 1 6.5 22v0A2.5 2.5 0 0 1 4 19.5V2",key:"12z67u"}],["path",{d:"M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5v0a2.5 2.5 0 0 1-2.5-2.5V2",key:"1q2nfy"}],["path",{d:"M3 2h7",key:"7s29d5"}],["path",{d:"M14 2h7",key:"7sicin"}],["path",{d:"M9 16H4",key:"1bfye3"}],["path",{d:"M20 16h-5",key:"ddnjpe"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J7=i("TextCursorInput",[["path",{d:"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1",key:"18xjzo"}],["path",{d:"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5",key:"fj48gi"}],["path",{d:"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1",key:"1n9rhb"}],["path",{d:"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7",key:"13ksps"}],["path",{d:"M9 7v10",key:"1vc8ob"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ex=i("TextCursor",[["path",{d:"M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1",key:"uvaxm9"}],["path",{d:"M7 22h1a4 4 0 0 0 4-4v-1",key:"11xy8d"}],["path",{d:"M7 2h1a4 4 0 0 1 4 4v1",key:"1uw06m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tx=i("TextQuote",[["path",{d:"M17 6H3",key:"16j9eg"}],["path",{d:"M21 12H8",key:"scolzb"}],["path",{d:"M21 18H8",key:"1wfozv"}],["path",{d:"M3 12v6",key:"fv4c87"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a1=i("TextSelect",[["path",{d:"M5 3a2 2 0 0 0-2 2",key:"y57alp"}],["path",{d:"M19 3a2 2 0 0 1 2 2",key:"18rm91"}],["path",{d:"M21 19a2 2 0 0 1-2 2",key:"1j7049"}],["path",{d:"M5 21a2 2 0 0 1-2-2",key:"sbafld"}],["path",{d:"M9 3h1",key:"1yesri"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 3h1",key:"1ec4yj"}],["path",{d:"M14 21h1",key:"v9vybs"}],["path",{d:"M3 9v1",key:"1r0deq"}],["path",{d:"M21 9v1",key:"mxsmne"}],["path",{d:"M3 14v1",key:"vnatye"}],["path",{d:"M21 14v1",key:"169vum"}],["line",{x1:"7",x2:"15",y1:"8",y2:"8",key:"1758g8"}],["line",{x1:"7",x2:"17",y1:"12",y2:"12",key:"197423"}],["line",{x1:"7",x2:"13",y1:"16",y2:"16",key:"37cgm6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nx=i("Text",[["path",{d:"M17 6.1H3",key:"wptmhv"}],["path",{d:"M21 12.1H3",key:"1j38uz"}],["path",{d:"M15.1 18H3",key:"1nb16a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ax=i("Theater",[["path",{d:"M2 10s3-3 3-8",key:"3xiif0"}],["path",{d:"M22 10s-3-3-3-8",key:"ioaa5q"}],["path",{d:"M10 2c0 4.4-3.6 8-8 8",key:"16fkpi"}],["path",{d:"M14 2c0 4.4 3.6 8 8 8",key:"b9eulq"}],["path",{d:"M2 10s2 2 2 5",key:"1au1lb"}],["path",{d:"M22 10s-2 2-2 5",key:"qi2y5e"}],["path",{d:"M8 15h8",key:"45n4r"}],["path",{d:"M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",key:"1vsc2m"}],["path",{d:"M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",key:"hrha4u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ix=i("ThermometerSnowflake",[["path",{d:"M2 12h10",key:"19562f"}],["path",{d:"M9 4v16",key:"81ygyz"}],["path",{d:"m3 9 3 3-3 3",key:"1sas0l"}],["path",{d:"M12 6 9 9 6 6",key:"pfrgxu"}],["path",{d:"m6 18 3-3 1.5 1.5",key:"1e277p"}],["path",{d:"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"iof6y5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rx=i("ThermometerSun",[["path",{d:"M12 9a4 4 0 0 0-2 7.5",key:"1jvsq6"}],["path",{d:"M12 3v2",key:"1w22ol"}],["path",{d:"m6.6 18.4-1.4 1.4",key:"w2yidj"}],["path",{d:"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"iof6y5"}],["path",{d:"M4 13H2",key:"118le4"}],["path",{d:"M6.34 7.34 4.93 5.93",key:"1brd51"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ox=i("Thermometer",[["path",{d:"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"17jzev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sx=i("ThumbsDown",[["path",{d:"M17 14V2",key:"8ymqnk"}],["path",{d:"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z",key:"s6e0r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cx=i("ThumbsUp",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z",key:"y3tblf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lx=i("Ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dx=i("TimerOff",[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7",key:"10he05"}],["path",{d:"M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2",key:"15f7sh"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M12 12v-2",key:"fwoke6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hx=i("TimerReset",[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"M12 14v-4",key:"1evpnu"}],["path",{d:"M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6",key:"1ts96g"}],["path",{d:"M9 17H4v5",key:"8t5av"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ux=i("Timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yx=i("ToggleLeft",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"6",ry:"6",key:"f2vt7d"}],["circle",{cx:"8",cy:"12",r:"2",key:"1nvbw3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const px=i("ToggleRight",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"6",ry:"6",key:"f2vt7d"}],["circle",{cx:"16",cy:"12",r:"2",key:"4ma0v8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kx=i("Tornado",[["path",{d:"M21 4H3",key:"1hwok0"}],["path",{d:"M18 8H6",key:"41n648"}],["path",{d:"M19 12H9",key:"1g4lpz"}],["path",{d:"M16 16h-6",key:"1j5d54"}],["path",{d:"M11 20H9",key:"39obr8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fx=i("Torus",[["ellipse",{cx:"12",cy:"11",rx:"3",ry:"2",key:"1b2qxu"}],["ellipse",{cx:"12",cy:"12.5",rx:"10",ry:"8.5",key:"h8emeu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mx=i("TouchpadOff",[["path",{d:"M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16",key:"lnt0bk"}],["path",{d:"M2 14h12",key:"d8icqz"}],["path",{d:"M22 14h-2",key:"jrx26d"}],["path",{d:"M12 20v-6",key:"1rm09r"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M22 16V6a2 2 0 0 0-2-2H10",key:"11y8e4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gx=i("Touchpad",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"M2 14h20",key:"myj16y"}],["path",{d:"M12 20v-6",key:"1rm09r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xx=i("TowerControl",[["path",{d:"M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z",key:"1pledb"}],["path",{d:"M8 13v9",key:"hmv0ci"}],["path",{d:"M16 22v-9",key:"ylnf1u"}],["path",{d:"m9 6 1 7",key:"dpdgam"}],["path",{d:"m15 6-1 7",key:"ls7zgu"}],["path",{d:"M12 6V2",key:"1pj48d"}],["path",{d:"M13 2h-2",key:"mj6ths"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vx=i("ToyBrick",[["rect",{width:"18",height:"12",x:"3",y:"8",rx:"1",key:"158fvp"}],["path",{d:"M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3",key:"s0042v"}],["path",{d:"M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3",key:"9wmeh2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mx=i("Tractor",[["path",{d:"M3 4h9l1 7",key:"1ftpo8"}],["path",{d:"M4 11V4",key:"9ft8pt"}],["path",{d:"M8 10V4",key:"1y5f7n"}],["path",{d:"M18 5c-.6 0-1 .4-1 1v5.6",key:"10zbvr"}],["path",{d:"m10 11 11 .9c.6 0 .9.5.8 1.1l-.8 5h-1",key:"2w242w"}],["circle",{cx:"7",cy:"15",r:".5",key:"fbsjqy"}],["circle",{cx:"7",cy:"15",r:"5",key:"ddtuc"}],["path",{d:"M16 18h-5",key:"bq60fd"}],["circle",{cx:"18",cy:"18",r:"2",key:"1emm8v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wx=i("TrafficCone",[["path",{d:"M9.3 6.2a4.55 4.55 0 0 0 5.4 0",key:"flyxqv"}],["path",{d:"M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3",key:"1nlxxg"}],["path",{d:"M13.9 3.5a1.93 1.93 0 0 0-3.8-.1l-3 10c-.1.2-.1.4-.1.6 0 1.7 2.2 3 5 3s5-1.3 5-3c0-.2 0-.4-.1-.5Z",key:"vz7x1l"}],["path",{d:"m7.5 12.2-4.7 2.7c-.5.3-.8.7-.8 1.1s.3.8.8 1.1l7.6 4.5c.9.5 2.1.5 3 0l7.6-4.5c.7-.3 1-.7 1-1.1s-.3-.8-.8-1.1l-4.7-2.8",key:"1xfzlw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lx=i("TrainFrontTunnel",[["path",{d:"M2 22V12a10 10 0 1 1 20 0v10",key:"o0fyp0"}],["path",{d:"M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8",key:"m8q3n9"}],["path",{d:"M10 15h.01",key:"44in9x"}],["path",{d:"M14 15h.01",key:"5mohn5"}],["path",{d:"M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z",key:"hckbmu"}],["path",{d:"m9 19-2 3",key:"iij7hm"}],["path",{d:"m15 19 2 3",key:"npx8sa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cx=i("TrainFront",[["path",{d:"M8 3.1V7a4 4 0 0 0 8 0V3.1",key:"1v71zp"}],["path",{d:"m9 15-1-1",key:"1yrq24"}],["path",{d:"m15 15 1-1",key:"1t0d6s"}],["path",{d:"M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z",key:"1p0hjs"}],["path",{d:"m8 19-2 3",key:"13i0xs"}],["path",{d:"m16 19 2 3",key:"xo31yx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sx=i("TrainTrack",[["path",{d:"M2 17 17 2",key:"18b09t"}],["path",{d:"m2 14 8 8",key:"1gv9hu"}],["path",{d:"m5 11 8 8",key:"189pqp"}],["path",{d:"m8 8 8 8",key:"1imecy"}],["path",{d:"m11 5 8 8",key:"ummqn6"}],["path",{d:"m14 2 8 8",key:"1vk7dn"}],["path",{d:"M7 22 22 7",key:"15mb1i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i1=i("TramFront",[["rect",{width:"16",height:"16",x:"4",y:"3",rx:"2",key:"1wxw4b"}],["path",{d:"M4 11h16",key:"mpoxn0"}],["path",{d:"M12 3v8",key:"1h2ygw"}],["path",{d:"m8 19-2 3",key:"13i0xs"}],["path",{d:"m18 22-2-3",key:"1p0ohu"}],["path",{d:"M8 15h0",key:"q9eq1f"}],["path",{d:"M16 15h0",key:"pzrbjg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const si=i("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ix=i("Trash",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jx=i("TreeDeciduous",[["path",{d:"M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z",key:"oadzkq"}],["path",{d:"M12 19v3",key:"npa21l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bx=i("TreePine",[["path",{d:"m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z",key:"cpyugq"}],["path",{d:"M12 22v-3",key:"kmzjlo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Px=i("Trees",[["path",{d:"M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z",key:"yh07w9"}],["path",{d:"M7 16v6",key:"1a82de"}],["path",{d:"M13 19v3",key:"13sx9i"}],["path",{d:"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",key:"1sj9kv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ax=i("Trello",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["rect",{width:"3",height:"9",x:"7",y:"7",key:"14n3xi"}],["rect",{width:"3",height:"5",x:"14",y:"7",key:"s4azjd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zx=i("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ci=i("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vx=i("TriangleRight",[["path",{d:"M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z",key:"183wce"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hx=i("Triangle",[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"14u9p9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tx=i("Trophy",[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qx=i("Truck",[["path",{d:"M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11",key:"hs4xqm"}],["path",{d:"M14 9h4l4 4v4c0 .6-.4 1-1 1h-2",key:"11fp61"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dx=i("Turtle",[["path",{d:"m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z",key:"1lbbv7"}],["path",{d:"M4.82 7.9 8 10",key:"m9wose"}],["path",{d:"M15.18 7.9 12 10",key:"p8dp2u"}],["path",{d:"M16.93 10H20a2 2 0 0 1 0 4H2",key:"12nsm7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fx=i("Tv2",[["path",{d:"M7 21h10",key:"1b0cd5"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rx=i("Tv",[["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",ry:"2",key:"10ag99"}],["polyline",{points:"17 2 12 7 7 2",key:"11pgbg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bx=i("Twitch",[["path",{d:"M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7",key:"c0yzno"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nx=i("Twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ex=i("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ox=i("UmbrellaOff",[["path",{d:"M12 2v1",key:"11qlp1"}],["path",{d:"M15.5 21a1.85 1.85 0 0 1-3.5-1v-8H2a10 10 0 0 1 3.428-6.575",key:"eki10q"}],["path",{d:"M17.5 12H22A10 10 0 0 0 9.004 3.455",key:"n2ayka"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ux=i("Umbrella",[["path",{d:"M22 12a10.06 10.06 1 0 0-20 0Z",key:"1teyop"}],["path",{d:"M12 12v8a2 2 0 0 0 4 0",key:"ulpmoc"}],["path",{d:"M12 2v1",key:"11qlp1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zx=i("Underline",[["path",{d:"M6 4v6a6 6 0 0 0 12 0V4",key:"9kb039"}],["line",{x1:"4",x2:"20",y1:"20",y2:"20",key:"nun2al"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _x=i("Undo2",[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11",key:"llx8ln"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wx=i("UndoDot",[["circle",{cx:"12",cy:"17",r:"1",key:"1ixnty"}],["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gx=i("Undo",[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $x=i("UnfoldHorizontal",[["path",{d:"M16 12h6",key:"15xry1"}],["path",{d:"M8 12H2",key:"1jqql6"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m19 15 3-3-3-3",key:"wjy7rq"}],["path",{d:"m5 9-3 3 3 3",key:"j64kie"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xx=i("UnfoldVertical",[["path",{d:"M12 22v-6",key:"6o8u61"}],["path",{d:"M12 8V2",key:"1wkif3"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}],["path",{d:"m15 19-3 3-3-3",key:"11eu04"}],["path",{d:"m15 5-3-3-3 3",key:"itvq4r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kx=i("Ungroup",[["rect",{width:"8",height:"6",x:"5",y:"4",rx:"1",key:"nzclkv"}],["rect",{width:"8",height:"6",x:"11",y:"14",rx:"1",key:"4tytwb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qx=i("Unlink2",[["path",{d:"M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2",key:"1re2ne"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yx=i("Unlink",[["path",{d:"m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71",key:"yqzxt4"}],["path",{d:"m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71",key:"4qinb0"}],["line",{x1:"8",x2:"8",y1:"2",y2:"5",key:"1041cp"}],["line",{x1:"2",x2:"5",y1:"8",y2:"8",key:"14m1p5"}],["line",{x1:"16",x2:"16",y1:"19",y2:"22",key:"rzdirn"}],["line",{x1:"19",x2:"22",y1:"16",y2:"16",key:"ox905f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jx=i("UnlockKeyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 9.33-2.5",key:"car5b7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ev=i("Unlock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tv=i("Unplug",[["path",{d:"m19 5 3-3",key:"yk6iyv"}],["path",{d:"m2 22 3-3",key:"19mgm9"}],["path",{d:"M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",key:"goz73y"}],["path",{d:"M7.5 13.5 10 11",key:"7xgeeb"}],["path",{d:"M10.5 16.5 13 14",key:"10btkg"}],["path",{d:"m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z",key:"1snsnr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nv=i("UploadCloud",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M12 12v9",key:"192myk"}],["path",{d:"m16 16-4-4-4 4",key:"119tzi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const av=i("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iv=i("Usb",[["circle",{cx:"10",cy:"7",r:"1",key:"dypaad"}],["circle",{cx:"4",cy:"20",r:"1",key:"22iqad"}],["path",{d:"M4.7 19.3 19 5",key:"1enqfc"}],["path",{d:"m21 3-3 1 2 2Z",key:"d3ov82"}],["path",{d:"M9.26 7.68 5 12l2 5",key:"1esawj"}],["path",{d:"m10 14 5 2 3.5-3.5",key:"v8oal5"}],["path",{d:"m18 12 1-1 1 1-1 1Z",key:"1bh22v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rv=i("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ov=i("UserCog",[["circle",{cx:"18",cy:"15",r:"3",key:"gjjjvw"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M10 15H6a4 4 0 0 0-4 4v2",key:"1nfge6"}],["path",{d:"m21.7 16.4-.9-.3",key:"12j9ji"}],["path",{d:"m15.2 13.9-.9-.3",key:"1fdjdi"}],["path",{d:"m16.6 18.7.3-.9",key:"heedtr"}],["path",{d:"m19.1 12.2.3-.9",key:"1af3ki"}],["path",{d:"m19.6 18.7-.4-1",key:"1x9vze"}],["path",{d:"m16.8 12.3-.4-1",key:"vqeiwj"}],["path",{d:"m14.3 16.6 1-.4",key:"1qlj63"}],["path",{d:"m20.7 13.8 1-.4",key:"1v5t8k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sv=i("UserMinus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cv=i("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r1=i("UserRoundCheck",[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"m16 19 2 2 4-4",key:"1b14m6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o1=i("UserRoundCog",[["path",{d:"M2 21a8 8 0 0 1 10.434-7.62",key:"1yezr2"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["path",{d:"m19.5 14.3-.4.9",key:"1eb35c"}],["path",{d:"m16.9 20.8-.4.9",key:"dfjc4z"}],["path",{d:"m21.7 19.5-.9-.4",key:"q4dx6b"}],["path",{d:"m15.2 16.9-.9-.4",key:"1r0w5f"}],["path",{d:"m21.7 16.5-.9.4",key:"1knoei"}],["path",{d:"m15.2 19.1-.9.4",key:"j188fs"}],["path",{d:"m19.5 21.7-.4-.9",key:"1tonu5"}],["path",{d:"m16.9 15.2-.4-.9",key:"699xu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s1=i("UserRoundMinus",[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 19h-6",key:"vcuq98"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c1=i("UserRoundPlus",[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M19 16v6",key:"tddt3s"}],["path",{d:"M22 19h-6",key:"vcuq98"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lv=i("UserRoundSearch",[["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M2 21a8 8 0 0 1 10.434-7.62",key:"1yezr2"}],["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["path",{d:"m22 22-1.9-1.9",key:"1e5ubv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l1=i("UserRoundX",[["path",{d:"M2 21a8 8 0 0 1 11.873-7",key:"74fkxq"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"m17 17 5 5",key:"p7ous7"}],["path",{d:"m22 17-5 5",key:"gqnmv0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d1=i("UserRound",[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dv=i("UserSearch",[["circle",{cx:"10",cy:"7",r:"4",key:"e45bow"}],["path",{d:"M10.3 15H7a4 4 0 0 0-4 4v2",key:"3bnktk"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["path",{d:"m21 21-1.9-1.9",key:"1g2n9r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hv=i("UserX",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"17",x2:"22",y1:"8",y2:"13",key:"3nzzx3"}],["line",{x1:"22",x2:"17",y1:"8",y2:"13",key:"1swrse"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uv=i("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h1=i("UsersRound",[["path",{d:"M18 21a8 8 0 0 0-16 0",key:"3ypg7q"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",key:"10s06x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yv=i("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j1=i("UtensilsCrossed",[["path",{d:"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8",key:"n7qcjb"}],["path",{d:"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7",key:"d0u48b"}],["path",{d:"m2.1 21.8 6.4-6.3",key:"yn04lh"}],["path",{d:"m19 5-7 7",key:"194lzd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const li=i("Utensils",[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"1ogz0v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pv=i("UtilityPole",[["path",{d:"M12 2v20",key:"t6zp3m"}],["path",{d:"M2 5h20",key:"1fs1ex"}],["path",{d:"M3 3v2",key:"9imdir"}],["path",{d:"M7 3v2",key:"n0os7"}],["path",{d:"M17 3v2",key:"1l2re6"}],["path",{d:"M21 3v2",key:"1duuac"}],["path",{d:"m19 5-7 7-7-7",key:"133zxf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kv=i("Variable",[["path",{d:"M8 21s-4-3-4-9 4-9 4-9",key:"uto9ud"}],["path",{d:"M16 3s4 3 4 9-4 9-4 9",key:"4w2vsq"}],["line",{x1:"15",x2:"9",y1:"9",y2:"15",key:"f7djnv"}],["line",{x1:"9",x2:"15",y1:"9",y2:"15",key:"1shsy8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fv=i("Vegan",[["path",{d:"M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14",key:"qiv7li"}],["path",{d:"M16 8c4 0 6-2 6-6-4 0-6 2-6 6",key:"n7eohy"}],["path",{d:"M17.41 3.6a10 10 0 1 0 3 3",key:"1dion0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mv=i("VenetianMask",[["path",{d:"M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z",key:"1g6z3j"}],["path",{d:"M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z",key:"c2lwnf"}],["path",{d:"M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z",key:"njd9zo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gv=i("VibrateOff",[["path",{d:"m2 8 2 2-2 2 2 2-2 2",key:"sv1b1"}],["path",{d:"m22 8-2 2 2 2-2 2 2 2",key:"101i4y"}],["path",{d:"M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2",key:"1hbad5"}],["path",{d:"M16 10.34V6c0-.55-.45-1-1-1h-4.34",key:"1x5tf0"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xv=i("Vibrate",[["path",{d:"m2 8 2 2-2 2 2 2-2 2",key:"sv1b1"}],["path",{d:"m22 8-2 2 2 2-2 2 2 2",key:"101i4y"}],["rect",{width:"8",height:"14",x:"8",y:"5",rx:"1",key:"1oyrl4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vv=i("VideoOff",[["path",{d:"M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8",key:"ubwiq0"}],["path",{d:"M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z",key:"1l10zd"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mv=i("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wv=i("Videotape",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"M2 8h20",key:"d11cs7"}],["circle",{cx:"8",cy:"14",r:"2",key:"1k2qr5"}],["path",{d:"M8 12h8",key:"1wcyev"}],["circle",{cx:"16",cy:"14",r:"2",key:"14k7lr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lv=i("View",[["path",{d:"M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z",key:"vptub8"}],["path",{d:"M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",key:"10lhjs"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2",key:"mrq65r"}],["path",{d:"M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2",key:"be3xqs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cv=i("Voicemail",[["circle",{cx:"6",cy:"12",r:"4",key:"1ehtga"}],["circle",{cx:"18",cy:"12",r:"4",key:"4vafl8"}],["line",{x1:"6",x2:"18",y1:"16",y2:"16",key:"pmt8us"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sv=i("Volume1",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07",key:"ltjumu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iv=i("Volume2",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07",key:"ltjumu"}],["path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14",key:"1kegas"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jv=i("VolumeX",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bv=i("Volume",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pv=i("Vote",[["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}],["path",{d:"M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z",key:"1ezoue"}],["path",{d:"M22 19H2",key:"nuriw5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Av=i("Wallet2",[["path",{d:"M17 14h.01",key:"7oqj8z"}],["path",{d:"M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14",key:"u1rqew"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zv=i("WalletCards",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2",key:"4125el"}],["path",{d:"M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21",key:"1dpki6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vv=i("Wallet",[["path",{d:"M21 12V7H5a2 2 0 0 1 0-4h14v4",key:"195gfw"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h16v-5",key:"195n9w"}],["path",{d:"M18 12a2 2 0 0 0 0 4h4v-4Z",key:"vllfpd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hv=i("Wallpaper",[["circle",{cx:"8",cy:"9",r:"2",key:"gjzl9d"}],["path",{d:"m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2",key:"69xh40"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["path",{d:"M12 17v4",key:"1riwvh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tv=i("Wand2",[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z",key:"1bcowg"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qv=i("Wand",[["path",{d:"M15 4V2",key:"z1p9b7"}],["path",{d:"M15 16v-2",key:"px0unx"}],["path",{d:"M8 9h2",key:"1g203m"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M17.8 11.8 19 13",key:"yihg8r"}],["path",{d:"M15 9h0",key:"kg5t1u"}],["path",{d:"M17.8 6.2 19 5",key:"fd4us0"}],["path",{d:"m3 21 9-9",key:"1jfql5"}],["path",{d:"M12.2 6.2 11 5",key:"i3da3b"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dv=i("Warehouse",[["path",{d:"M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z",key:"gksnxg"}],["path",{d:"M6 18h12",key:"9pbo8z"}],["path",{d:"M6 14h12",key:"4cwo0f"}],["rect",{width:"12",height:"12",x:"6",y:"10",key:"apd30q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fv=i("Watch",[["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["polyline",{points:"12 10 12 12 13 13",key:"19dquz"}],["path",{d:"m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05",key:"18k57s"}],["path",{d:"m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05",key:"16ny36"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rv=i("Waves",[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"knzxuh"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"2jd2cc"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"rd2r6e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bv=i("Waypoints",[["circle",{cx:"12",cy:"4.5",r:"2.5",key:"r5ysbb"}],["path",{d:"m10.2 6.3-3.9 3.9",key:"1nzqf6"}],["circle",{cx:"4.5",cy:"12",r:"2.5",key:"jydg6v"}],["path",{d:"M7 12h10",key:"b7w52i"}],["circle",{cx:"19.5",cy:"12",r:"2.5",key:"1piiel"}],["path",{d:"m13.8 17.7 3.9-3.9",key:"1wyg1y"}],["circle",{cx:"12",cy:"19.5",r:"2.5",key:"13o1pw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nv=i("Webcam",[["circle",{cx:"12",cy:"10",r:"8",key:"1gshiw"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 22h10",key:"10w4w3"}],["path",{d:"M12 22v-4",key:"1utk9m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ev=i("Webhook",[["path",{d:"M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",key:"q3hayz"}],["path",{d:"m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06",key:"1go1hn"}],["path",{d:"m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",key:"qlwsc0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ov=i("Weight",[["circle",{cx:"12",cy:"5",r:"3",key:"rqqgnr"}],["path",{d:"M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z",key:"56o5sh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uv=i("WheatOff",[["path",{d:"m2 22 10-10",key:"28ilpk"}],["path",{d:"m16 8-1.17 1.17",key:"1qqm82"}],["path",{d:"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",key:"1rdhi6"}],["path",{d:"m8 8-.53.53a3.5 3.5 0 0 0 0 4.94L9 15l1.53-1.53c.55-.55.88-1.25.98-1.97",key:"4wz8re"}],["path",{d:"M10.91 5.26c.15-.26.34-.51.56-.73L13 3l1.53 1.53a3.5 3.5 0 0 1 .28 4.62",key:"rves66"}],["path",{d:"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z",key:"19rau1"}],["path",{d:"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",key:"tc8ph9"}],["path",{d:"m16 16-.53.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.49 3.49 0 0 1 1.97-.98",key:"ak46r"}],["path",{d:"M18.74 13.09c.26-.15.51-.34.73-.56L21 11l-1.53-1.53a3.5 3.5 0 0 0-4.62-.28",key:"1tw520"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zv=i("Wheat",[["path",{d:"M2 22 16 8",key:"60hf96"}],["path",{d:"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",key:"1rdhi6"}],["path",{d:"M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",key:"1sdzmb"}],["path",{d:"M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",key:"eoatbi"}],["path",{d:"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z",key:"19rau1"}],["path",{d:"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",key:"tc8ph9"}],["path",{d:"M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",key:"2m8kc5"}],["path",{d:"M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",key:"vex3ng"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _v=i("WholeWord",[["circle",{cx:"7",cy:"12",r:"3",key:"12clwm"}],["path",{d:"M10 9v6",key:"17i7lo"}],["circle",{cx:"17",cy:"12",r:"3",key:"gl7c2s"}],["path",{d:"M14 7v8",key:"dl84cr"}],["path",{d:"M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",key:"lt2kga"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wv=i("WifiOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M8.5 16.5a5 5 0 0 1 7 0",key:"sej527"}],["path",{d:"M2 8.82a15 15 0 0 1 4.17-2.65",key:"11utq1"}],["path",{d:"M10.66 5c4.01-.36 8.14.9 11.34 3.76",key:"hxefdu"}],["path",{d:"M16.85 11.25a10 10 0 0 1 2.22 1.68",key:"q734kn"}],["path",{d:"M5 13a10 10 0 0 1 5.24-2.76",key:"piq4yl"}],["line",{x1:"12",x2:"12.01",y1:"20",y2:"20",key:"of4bc4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gv=i("Wifi",[["path",{d:"M5 13a10 10 0 0 1 14 0",key:"6v8j51"}],["path",{d:"M8.5 16.5a5 5 0 0 1 7 0",key:"sej527"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["line",{x1:"12",x2:"12.01",y1:"20",y2:"20",key:"of4bc4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $v=i("Wind",[["path",{d:"M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2",key:"1k4u03"}],["path",{d:"M9.6 4.6A2 2 0 1 1 11 8H2",key:"b7d0fd"}],["path",{d:"M12.6 19.4A2 2 0 1 0 14 16H2",key:"1p5cb3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xv=i("WineOff",[["path",{d:"M8 22h8",key:"rmew8v"}],["path",{d:"M7 10h3m7 0h-1.343",key:"v48bem"}],["path",{d:"M12 15v7",key:"t2xh3l"}],["path",{d:"M7.307 7.307A12.33 12.33 0 0 0 7 10a5 5 0 0 0 7.391 4.391M8.638 2.981C8.75 2.668 8.872 2.34 9 2h6c1.5 4 2 6 2 8 0 .407-.05.809-.145 1.198",key:"1ymjlu"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kv=i("Wine",[["path",{d:"M8 22h8",key:"rmew8v"}],["path",{d:"M7 10h10",key:"1101jm"}],["path",{d:"M12 15v7",key:"t2xh3l"}],["path",{d:"M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z",key:"10ffi3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qv=i("Workflow",[["rect",{width:"8",height:"8",x:"3",y:"3",rx:"2",key:"by2w9f"}],["path",{d:"M7 11v4a2 2 0 0 0 2 2h4",key:"xkn7yn"}],["rect",{width:"8",height:"8",x:"13",y:"13",rx:"2",key:"1cgmvn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yv=i("WrapText",[["line",{x1:"3",x2:"21",y1:"6",y2:"6",key:"4m8b97"}],["path",{d:"M3 12h15a3 3 0 1 1 0 6h-4",key:"1cl7v7"}],["polyline",{points:"16 16 14 18 16 20",key:"1jznyi"}],["line",{x1:"3",x2:"10",y1:"18",y2:"18",key:"1h33wv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jv=i("Wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eM=i("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tM=i("XOctagon",[["polygon",{points:"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",key:"h1p8hx"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nM=i("XSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=i("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aM=i("Youtube",[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iM=i("ZapOff",[["polyline",{points:"12.41 6.75 13 2 10.57 4.92",key:"122m05"}],["polyline",{points:"18.57 12.91 21 10 15.66 10",key:"16r43o"}],["polyline",{points:"8 8 3 14 12 14 11 22 16 16",key:"tmh4bc"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rM=i("Zap",[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2",key:"45s27k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oM=i("ZoomIn",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sM=i("ZoomOut",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const XV=Object.freeze(Object.defineProperty({__proto__:null,AArrowDown:Cr,AArrowUp:Sr,ALargeSmall:Ir,Accessibility:jr,Activity:Pr,ActivitySquare:br,AirVent:Ar,Airplay:zr,AlarmClock:Hr,AlarmClockCheck:hn,AlarmClockMinus:un,AlarmClockOff:Vr,AlarmClockPlus:yn,AlarmSmoke:Tr,Album:qr,AlertCircle:la,AlertOctagon:Dr,AlertTriangle:Gt,AlignCenter:Br,AlignCenterHorizontal:Fr,AlignCenterVertical:Rr,AlignEndHorizontal:Nr,AlignEndVertical:Er,AlignHorizontalDistributeCenter:Or,AlignHorizontalDistributeEnd:Ur,AlignHorizontalDistributeStart:Zr,AlignHorizontalJustifyCenter:_r,AlignHorizontalJustifyEnd:Wr,AlignHorizontalJustifyStart:Gr,AlignHorizontalSpaceAround:$r,AlignHorizontalSpaceBetween:Xr,AlignJustify:Kr,AlignLeft:Qr,AlignRight:Yr,AlignStartHorizontal:Jr,AlignStartVertical:eo,AlignVerticalDistributeCenter:to,AlignVerticalDistributeEnd:no,AlignVerticalDistributeStart:ao,AlignVerticalJustifyCenter:io,AlignVerticalJustifyEnd:ro,AlignVerticalJustifyStart:oo,AlignVerticalSpaceAround:so,AlignVerticalSpaceBetween:co,Ampersand:lo,Ampersands:ho,Anchor:uo,Angry:yo,Annoyed:po,Antenna:ko,Anvil:fo,Aperture:mo,AppWindow:go,Apple:xo,Archive:wo,ArchiveRestore:vo,ArchiveX:Mo,AreaChart:Lo,Armchair:Co,ArrowBigDown:Io,ArrowBigDownDash:So,ArrowBigLeft:bo,ArrowBigLeftDash:jo,ArrowBigRight:Ao,ArrowBigRightDash:Po,ArrowBigUp:Vo,ArrowBigUpDash:zo,ArrowDown:$o,ArrowDown01:Ho,ArrowDown10:To,ArrowDownAZ:pn,ArrowDownCircle:qo,ArrowDownFromLine:Do,ArrowDownLeft:Bo,ArrowDownLeftFromCircle:Fo,ArrowDownLeftSquare:Ro,ArrowDownNarrowWide:No,ArrowDownRight:Uo,ArrowDownRightFromCircle:Eo,ArrowDownRightSquare:Oo,ArrowDownSquare:Zo,ArrowDownToDot:_o,ArrowDownToLine:Wo,ArrowDownUp:Go,ArrowDownWideNarrow:kn,ArrowDownZA:fn,ArrowLeft:e2,ArrowLeftCircle:Xo,ArrowLeftFromLine:Ko,ArrowLeftRight:Qo,ArrowLeftSquare:Yo,ArrowLeftToLine:Jo,ArrowRight:da,ArrowRightCircle:t2,ArrowRightFromLine:n2,ArrowRightLeft:a2,ArrowRightSquare:i2,ArrowRightToLine:r2,ArrowUp:M2,ArrowUp01:o2,ArrowUp10:s2,ArrowUpAZ:mn,ArrowUpCircle:c2,ArrowUpDown:l2,ArrowUpFromDot:d2,ArrowUpFromLine:h2,ArrowUpLeft:p2,ArrowUpLeftFromCircle:u2,ArrowUpLeftSquare:y2,ArrowUpNarrowWide:gn,ArrowUpRight:m2,ArrowUpRightFromCircle:k2,ArrowUpRightSquare:f2,ArrowUpSquare:g2,ArrowUpToLine:x2,ArrowUpWideNarrow:v2,ArrowUpZA:xn,ArrowsUpFromLine:w2,Asterisk:L2,AtSign:C2,Atom:S2,AudioLines:I2,AudioWaveform:j2,Award:b2,Axe:P2,Axis3d:vn,Baby:dt,Backpack:A2,Badge:W2,BadgeAlert:z2,BadgeCent:V2,BadgeCheck:Mn,BadgeDollarSign:H2,BadgeEuro:T2,BadgeHelp:q2,BadgeIndianRupee:D2,BadgeInfo:F2,BadgeJapaneseYen:R2,BadgeMinus:B2,BadgePercent:N2,BadgePlus:E2,BadgePoundSterling:O2,BadgeRussianRuble:U2,BadgeSwissFranc:Z2,BadgeX:_2,BaggageClaim:G2,Ban:$2,Banana:X2,Banknote:K2,BarChart:as,BarChart2:Q2,BarChart3:Y2,BarChart4:J2,BarChartBig:es,BarChartHorizontal:ns,BarChartHorizontalBig:ts,Barcode:is,Baseline:rs,Bath:os,Battery:us,BatteryCharging:ss,BatteryFull:cs,BatteryLow:ls,BatteryMedium:ds,BatteryWarning:hs,Beaker:ys,Bean:ks,BeanOff:ps,Bed:gs,BedDouble:fs,BedSingle:ms,Beef:xs,Beer:vs,Bell:js,BellDot:Ms,BellElectric:ws,BellMinus:Ls,BellOff:Cs,BellPlus:Ss,BellRing:Is,Bike:bs,Binary:Ps,Biohazard:As,Bird:zs,Bitcoin:Vs,Blinds:Hs,Blocks:Ts,Bluetooth:Rs,BluetoothConnected:qs,BluetoothOff:Ds,BluetoothSearching:Fs,Bold:Bs,Bomb:Ns,Bone:Es,Book:lc,BookA:Os,BookAudio:Us,BookCheck:Zs,BookCopy:_s,BookDashed:wn,BookDown:Ws,BookHeadphones:Gs,BookHeart:$s,BookImage:Xs,BookKey:Ks,BookLock:Qs,BookMarked:Ys,BookMinus:Js,BookOpen:Ya,BookOpenCheck:ec,BookOpenText:tc,BookPlus:nc,BookText:ac,BookType:ic,BookUp:oc,BookUp2:rc,BookUser:sc,BookX:cc,Bookmark:pc,BookmarkCheck:dc,BookmarkMinus:hc,BookmarkPlus:uc,BookmarkX:yc,BoomBox:kc,Bot:fc,Box:gc,BoxSelect:mc,Boxes:xc,Braces:Ln,Brackets:vc,Brain:Lc,BrainCircuit:Mc,BrainCog:wc,BrickWall:Cc,Briefcase:Sc,BringToFront:Ic,Brush:jc,Bug:Ac,BugOff:bc,BugPlay:Pc,Building:Vc,Building2:zc,Bus:Tc,BusFront:Hc,Cable:Dc,CableCar:qc,Cake:Rc,CakeSlice:Fc,Calculator:Bc,Calendar:gt,CalendarCheck:Ec,CalendarCheck2:Nc,CalendarClock:Oc,CalendarDays:Uc,CalendarHeart:Zc,CalendarMinus:_c,CalendarOff:Wc,CalendarPlus:Gc,CalendarRange:$c,CalendarSearch:Xc,CalendarX:Qc,CalendarX2:Kc,Camera:Jc,CameraOff:Yc,CandlestickChart:el,Candy:al,CandyCane:tl,CandyOff:nl,Car:ol,CarFront:il,CarTaxiFront:rl,Caravan:sl,Carrot:cl,CaseLower:ll,CaseSensitive:dl,CaseUpper:hl,CassetteTape:ul,Cast:yl,Castle:pl,Cat:kl,Cctv:fl,Check:w1,CheckCheck:ml,CheckCircle:gl,CheckCircle2:M1,CheckSquare:vl,CheckSquare2:xl,ChefHat:Ml,Cherry:wl,ChevronDown:ha,ChevronDownCircle:Ll,ChevronDownSquare:Cl,ChevronFirst:Sl,ChevronLast:Il,ChevronLeft:Pl,ChevronLeftCircle:jl,ChevronLeftSquare:bl,ChevronRight:Ja,ChevronRightCircle:Al,ChevronRightSquare:zl,ChevronUp:Tl,ChevronUpCircle:Vl,ChevronUpSquare:Hl,ChevronsDown:Dl,ChevronsDownUp:ql,ChevronsLeft:Rl,ChevronsLeftRight:Fl,ChevronsRight:Nl,ChevronsRightLeft:Bl,ChevronsUp:Ol,ChevronsUpDown:El,Chrome:Ul,Church:Zl,Cigarette:Wl,CigaretteOff:_l,Circle:t0,CircleDashed:Gl,CircleDollarSign:$l,CircleDot:Kl,CircleDotDashed:Xl,CircleEllipsis:Ql,CircleEqual:Yl,CircleOff:Jl,CircleSlash:e0,CircleSlash2:Cn,CircleUser:In,CircleUserRound:Sn,CircuitBoard:n0,Citrus:a0,Clapperboard:i0,Clipboard:y0,ClipboardCheck:r0,ClipboardCopy:o0,ClipboardEdit:s0,ClipboardList:c0,ClipboardPaste:l0,ClipboardSignature:d0,ClipboardType:h0,ClipboardX:u0,Clock:ua,Clock1:p0,Clock10:k0,Clock11:f0,Clock12:m0,Clock2:g0,Clock3:x0,Clock4:v0,Clock5:M0,Clock6:w0,Clock7:L0,Clock8:C0,Clock9:S0,Cloud:B0,CloudCog:I0,CloudDrizzle:j0,CloudFog:b0,CloudHail:P0,CloudLightning:A0,CloudMoon:V0,CloudMoonRain:z0,CloudOff:H0,CloudRain:q0,CloudRainWind:T0,CloudSnow:D0,CloudSun:R0,CloudSunRain:F0,Cloudy:N0,Clover:E0,Club:O0,Code:Z0,Code2:U0,Codepen:_0,Codesandbox:W0,Coffee:G0,Cog:$0,Coins:X0,Columns2:jn,Columns3:bn,Columns4:K0,Combine:Q0,Command:Y0,Compass:J0,Component:ed,Computer:td,ConciergeBell:nd,Cone:ad,Construction:id,Contact:od,Contact2:rd,Container:sd,Contrast:cd,Cookie:ld,CookingPot:dd,Copy:fd,CopyCheck:hd,CopyMinus:ud,CopyPlus:yd,CopySlash:pd,CopyX:kd,Copyleft:md,Copyright:gd,CornerDownLeft:xd,CornerDownRight:vd,CornerLeftDown:Md,CornerLeftUp:wd,CornerRightDown:Ld,CornerRightUp:Cd,CornerUpLeft:Sd,CornerUpRight:Id,Cpu:jd,CreativeCommons:bd,CreditCard:Pd,Croissant:Ad,Crop:zd,Cross:Vd,Crosshair:Hd,Crown:Td,Cuboid:qd,CupSoda:Dd,Currency:Fd,Cylinder:Rd,Database:Ed,DatabaseBackup:Bd,DatabaseZap:Nd,Delete:Od,Dessert:Ud,Diameter:Zd,Diamond:_d,Dice1:Wd,Dice2:Gd,Dice3:$d,Dice4:Xd,Dice5:Kd,Dice6:Qd,Dices:Yd,Diff:Jd,Disc:ah,Disc2:eh,Disc3:th,DiscAlbum:nh,Divide:oh,DivideCircle:ih,DivideSquare:rh,Dna:ch,DnaOff:sh,Dog:lh,DollarSign:dh,Donut:hh,DoorClosed:uh,DoorOpen:yh,Dot:ei,Download:kh,DownloadCloud:ph,DraftingCompass:fh,Drama:mh,Dribbble:gh,Droplet:xh,Droplets:vh,Drum:Mh,Drumstick:wh,Dumbbell:Lh,Ear:Sh,EarOff:Ch,Egg:bh,EggFried:Ih,EggOff:jh,Equal:Ah,EqualNot:Ph,Eraser:zh,Euro:Vh,Expand:Hh,ExternalLink:Th,Eye:Dh,EyeOff:qh,Facebook:Fh,Factory:Rh,Fan:Bh,FastForward:Nh,Feather:Eh,Fence:Oh,FerrisWheel:Uh,Figma:Zh,File:_u,FileArchive:_h,FileAudio:Gh,FileAudio2:Wh,FileAxis3d:Pn,FileBadge:Xh,FileBadge2:$h,FileBarChart:Qh,FileBarChart2:Kh,FileBox:Yh,FileCheck:eu,FileCheck2:Jh,FileClock:tu,FileCode:au,FileCode2:nu,FileCog:An,FileDiff:iu,FileDigit:ru,FileDown:ou,FileEdit:su,FileHeart:cu,FileImage:lu,FileInput:du,FileJson:uu,FileJson2:hu,FileKey:pu,FileKey2:yu,FileLineChart:ku,FileLock:mu,FileLock2:fu,FileMinus:xu,FileMinus2:gu,FileMusic:vu,FileOutput:Mu,FilePieChart:wu,FilePlus:Cu,FilePlus2:Lu,FileQuestion:Su,FileScan:Iu,FileSearch:bu,FileSearch2:ju,FileSignature:Pu,FileSpreadsheet:Au,FileStack:zu,FileSymlink:Vu,FileTerminal:Hu,FileText:Tu,FileType:Du,FileType2:qu,FileUp:Fu,FileVideo:Bu,FileVideo2:Ru,FileVolume:Eu,FileVolume2:Nu,FileWarning:Ou,FileX:Zu,FileX2:Uu,Files:Wu,Film:Gu,Filter:ya,FilterX:$u,Fingerprint:Xu,FireExtinguisher:Ku,Fish:Ju,FishOff:Qu,FishSymbol:Yu,Flag:ay,FlagOff:ey,FlagTriangleLeft:ty,FlagTriangleRight:ny,Flame:ry,FlameKindling:iy,Flashlight:sy,FlashlightOff:oy,FlaskConical:ly,FlaskConicalOff:cy,FlaskRound:dy,FlipHorizontal:uy,FlipHorizontal2:hy,FlipVertical:py,FlipVertical2:yy,Flower:fy,Flower2:ky,Focus:my,FoldHorizontal:gy,FoldVertical:xy,Folder:Gy,FolderArchive:vy,FolderCheck:My,FolderClock:wy,FolderClosed:Ly,FolderCog:zn,FolderDot:Cy,FolderDown:Sy,FolderEdit:Iy,FolderGit:by,FolderGit2:jy,FolderHeart:Py,FolderInput:Ay,FolderKanban:zy,FolderKey:Vy,FolderLock:Hy,FolderMinus:Ty,FolderOpen:Dy,FolderOpenDot:qy,FolderOutput:Fy,FolderPlus:Ry,FolderRoot:By,FolderSearch:Ey,FolderSearch2:Ny,FolderSymlink:Oy,FolderSync:Uy,FolderTree:Zy,FolderUp:_y,FolderX:Wy,Folders:$y,Footprints:Xy,Forklift:Ky,FormInput:Qy,Forward:Yy,Frame:Jy,Framer:ep,Frown:tp,Fuel:np,Fullscreen:ap,FunctionSquare:ip,GalleryHorizontal:op,GalleryHorizontalEnd:rp,GalleryThumbnails:sp,GalleryVertical:lp,GalleryVerticalEnd:cp,Gamepad:hp,Gamepad2:dp,GanttChart:up,GanttChartSquare:Vn,Gauge:pp,GaugeCircle:yp,Gavel:kp,Gem:fp,Ghost:mp,Gift:gp,GitBranch:vp,GitBranchPlus:xp,GitCommitHorizontal:Hn,GitCommitVertical:Mp,GitCompare:Lp,GitCompareArrows:wp,GitFork:Cp,GitGraph:Sp,GitMerge:Ip,GitPullRequest:Vp,GitPullRequestArrow:jp,GitPullRequestClosed:bp,GitPullRequestCreate:Ap,GitPullRequestCreateArrow:Pp,GitPullRequestDraft:zp,Github:Hp,Gitlab:Tp,GlassWater:qp,Glasses:Dp,Globe:Rp,Globe2:Fp,Goal:Bp,Grab:Np,GraduationCap:Ep,Grape:Op,Grid2x2:Tn,Grid3x3:rt,Grip:_p,GripHorizontal:Up,GripVertical:Zp,Group:Wp,Guitar:Gp,Hammer:$p,Hand:L1,HandMetal:Xp,HardDrive:Yp,HardDriveDownload:Kp,HardDriveUpload:Qp,HardHat:Jp,Hash:ek,Haze:tk,HdmiPort:nk,Heading:lk,Heading1:ak,Heading2:ik,Heading3:rk,Heading4:ok,Heading5:sk,Heading6:ck,Headphones:dk,Heart:Rt,HeartCrack:hk,HeartHandshake:uk,HeartOff:yk,HeartPulse:pk,HelpCircle:kk,HelpingHand:fk,Hexagon:mk,Highlighter:gk,History:xk,Home:C1,Hop:Mk,HopOff:vk,Hotel:wk,Hourglass:Lk,IceCream:Sk,IceCream2:Ck,Image:Ak,ImageDown:Ik,ImageMinus:jk,ImageOff:bk,ImagePlus:Pk,Import:zk,Inbox:Vk,Indent:Hk,IndianRupee:Tk,Infinity:qk,Info:Dk,InspectionPanel:Fk,Instagram:Rk,Italic:Bk,IterationCcw:Nk,IterationCw:Ek,JapaneseYen:Ok,Joystick:Uk,Kanban:Zk,KanbanSquare:Dn,KanbanSquareDashed:qn,Key:Gk,KeyRound:_k,KeySquare:Wk,Keyboard:Xk,KeyboardMusic:$k,Lamp:t4,LampCeiling:Kk,LampDesk:Qk,LampFloor:Yk,LampWallDown:Jk,LampWallUp:e4,LandPlot:n4,Landmark:a4,Languages:i4,Laptop:o4,Laptop2:r4,Lasso:c4,LassoSelect:s4,Laugh:l4,Layers:ti,Layers2:d4,Layers3:h4,LayoutDashboard:u4,LayoutGrid:y4,LayoutList:p4,LayoutPanelLeft:k4,LayoutPanelTop:f4,LayoutTemplate:m4,Leaf:g4,LeafyGreen:x4,Library:w4,LibraryBig:v4,LibrarySquare:M4,LifeBuoy:L4,Ligature:C4,Lightbulb:S1,LightbulbOff:S4,LineChart:I4,Link:P4,Link2:b4,Link2Off:j4,Linkedin:A4,List:Z4,ListChecks:z4,ListEnd:V4,ListFilter:H4,ListMinus:T4,ListMusic:q4,ListOrdered:D4,ListPlus:F4,ListRestart:R4,ListStart:B4,ListTodo:N4,ListTree:E4,ListVideo:O4,ListX:U4,Loader:W4,Loader2:_4,Locate:X4,LocateFixed:G4,LocateOff:$4,Lock:Q4,LockKeyhole:K4,LogIn:Y4,LogOut:J4,Lollipop:e5,Luggage:t5,MSquare:n5,Magnet:a5,Mail:u5,MailCheck:i5,MailMinus:r5,MailOpen:o5,MailPlus:s5,MailQuestion:c5,MailSearch:l5,MailWarning:d5,MailX:h5,Mailbox:y5,Mails:p5,Map:g5,MapPin:f5,MapPinOff:k5,MapPinned:m5,Martini:x5,Maximize:M5,Maximize2:v5,Medal:w5,Megaphone:C5,MegaphoneOff:L5,Meh:S5,MemoryStick:I5,Menu:ni,MenuSquare:j5,Merge:b5,MessageCircle:B5,MessageCircleCode:P5,MessageCircleDashed:A5,MessageCircleHeart:z5,MessageCircleMore:V5,MessageCircleOff:H5,MessageCirclePlus:T5,MessageCircleQuestion:q5,MessageCircleReply:D5,MessageCircleWarning:F5,MessageCircleX:R5,MessageSquare:ef,MessageSquareCode:N5,MessageSquareDashed:E5,MessageSquareDiff:O5,MessageSquareDot:U5,MessageSquareHeart:Z5,MessageSquareMore:_5,MessageSquareOff:W5,MessageSquarePlus:G5,MessageSquareQuote:$5,MessageSquareReply:X5,MessageSquareShare:K5,MessageSquareText:Q5,MessageSquareWarning:Y5,MessageSquareX:J5,MessagesSquare:tf,Mic:rf,Mic2:nf,MicOff:af,Microscope:of,Microwave:sf,Milestone:cf,Milk:df,MilkOff:lf,Minimize:uf,Minimize2:hf,Minus:kf,MinusCircle:yf,MinusSquare:pf,Monitor:jf,MonitorCheck:ff,MonitorDot:mf,MonitorDown:gf,MonitorOff:xf,MonitorPause:vf,MonitorPlay:Mf,MonitorSmartphone:wf,MonitorSpeaker:Lf,MonitorStop:Cf,MonitorUp:Sf,MonitorX:If,Moon:Pf,MoonStar:bf,MoreHorizontal:Af,MoreVertical:zf,Mountain:Hf,MountainSnow:Vf,Mouse:Rf,MousePointer:Ff,MousePointer2:Tf,MousePointerClick:qf,MousePointerSquare:Fn,MousePointerSquareDashed:Df,Move:Qf,Move3d:Rn,MoveDiagonal:Nf,MoveDiagonal2:Bf,MoveDown:Uf,MoveDownLeft:Ef,MoveDownRight:Of,MoveHorizontal:Zf,MoveLeft:_f,MoveRight:Wf,MoveUp:Xf,MoveUpLeft:Gf,MoveUpRight:$f,MoveVertical:Kf,Music:tm,Music2:Yf,Music3:Jf,Music4:em,Navigation:rm,Navigation2:am,Navigation2Off:nm,NavigationOff:im,Network:om,Newspaper:sm,Nfc:cm,Nut:dm,NutOff:lm,Octagon:hm,Option:um,Orbit:ym,Outdent:pm,Package:wm,Package2:km,PackageCheck:fm,PackageMinus:mm,PackageOpen:gm,PackagePlus:xm,PackageSearch:vm,PackageX:Mm,PaintBucket:Lm,Paintbrush:Sm,Paintbrush2:Cm,Palette:Im,Palmtree:jm,PanelBottom:Am,PanelBottomClose:bm,PanelBottomDashed:Bn,PanelBottomOpen:Pm,PanelLeft:Un,PanelLeftClose:Nn,PanelLeftDashed:En,PanelLeftOpen:On,PanelRight:Hm,PanelRightClose:zm,PanelRightDashed:Zn,PanelRightOpen:Vm,PanelTop:Dm,PanelTopClose:Tm,PanelTopDashed:_n,PanelTopOpen:qm,PanelsLeftBottom:Fm,PanelsRightBottom:Rm,PanelsTopLeft:Wn,Paperclip:Bm,Parentheses:Nm,ParkingCircle:Om,ParkingCircleOff:Em,ParkingMeter:Um,ParkingSquare:_m,ParkingSquareOff:Zm,PartyPopper:Wm,Pause:Xm,PauseCircle:Gm,PauseOctagon:$m,PawPrint:Km,PcCase:Qm,Pen:$n,PenLine:Gn,PenSquare:Xe,PenTool:Ym,Pencil:t3,PencilLine:Jm,PencilRuler:e3,Pentagon:n3,Percent:o3,PercentCircle:a3,PercentDiamond:i3,PercentSquare:r3,PersonStanding:s3,Phone:p3,PhoneCall:c3,PhoneForwarded:l3,PhoneIncoming:d3,PhoneMissed:h3,PhoneOff:u3,PhoneOutgoing:y3,Pi:f3,PiSquare:k3,Piano:m3,PictureInPicture:x3,PictureInPicture2:g3,PieChart:v3,PiggyBank:M3,Pilcrow:L3,PilcrowSquare:w3,Pill:C3,Pin:I3,PinOff:S3,Pipette:j3,Pizza:b3,Plane:z3,PlaneLanding:P3,PlaneTakeoff:A3,Play:H3,PlayCircle:ai,PlaySquare:V3,Plug:F3,Plug2:T3,PlugZap:D3,PlugZap2:q3,Plus:B3,PlusCircle:ii,PlusSquare:R3,Pocket:E3,PocketKnife:N3,Podcast:O3,Pointer:Z3,PointerOff:U3,Popcorn:_3,Popsicle:W3,PoundSterling:G3,Power:Q3,PowerCircle:$3,PowerOff:X3,PowerSquare:K3,Presentation:Y3,Printer:J3,Projector:e6,Puzzle:t6,Pyramid:n6,QrCode:a6,Quote:i6,Rabbit:r6,Radar:o6,Radiation:s6,Radio:d6,RadioReceiver:c6,RadioTower:l6,Radius:h6,RailSymbol:u6,Rainbow:y6,Rat:p6,Ratio:k6,Receipt:f6,RectangleHorizontal:m6,RectangleVertical:g6,Recycle:x6,Redo:w6,Redo2:v6,RedoDot:M6,RefreshCcw:C6,RefreshCcwDot:L6,RefreshCw:I6,RefreshCwOff:S6,Refrigerator:j6,Regex:b6,RemoveFormatting:P6,Repeat:V6,Repeat1:A6,Repeat2:z6,Replace:T6,ReplaceAll:H6,Reply:D6,ReplyAll:q6,Rewind:F6,Ribbon:R6,Rocket:B6,RockingChair:N6,RollerCoaster:E6,Rotate3d:Xn,RotateCcw:O6,RotateCw:U6,Route:_6,RouteOff:Z6,Router:W6,Rows2:Kn,Rows3:Qn,Rows4:G6,Rss:$6,Ruler:X6,RussianRuble:K6,Sailboat:Q6,Salad:Y6,Sandwich:J6,Satellite:t8,SatelliteDish:e8,Save:a8,SaveAll:n8,Scale:i8,Scale3d:Yn,Scaling:r8,Scan:u8,ScanBarcode:o8,ScanEye:s8,ScanFace:c8,ScanLine:l8,ScanSearch:d8,ScanText:h8,ScatterChart:y8,School:k8,School2:p8,Scissors:x8,ScissorsLineDashed:f8,ScissorsSquare:g8,ScissorsSquareDashedBottom:m8,ScreenShare:M8,ScreenShareOff:v8,Scroll:L8,ScrollText:w8,Search:b8,SearchCheck:C8,SearchCode:S8,SearchSlash:I8,SearchX:j8,Send:A8,SendHorizontal:Jn,SendToBack:P8,SeparatorHorizontal:z8,SeparatorVertical:V8,Server:D8,ServerCog:H8,ServerCrash:T8,ServerOff:q8,Settings:R8,Settings2:F8,Shapes:B8,Share:N8,Share2:ri,Sheet:E8,Shell:O8,Shield:pa,ShieldAlert:I1,ShieldBan:U8,ShieldCheck:Z8,ShieldEllipsis:_8,ShieldHalf:W8,ShieldMinus:G8,ShieldOff:$8,ShieldPlus:X8,ShieldQuestion:K8,ShieldX:e1,Ship:Y8,ShipWheel:Q8,Shirt:J8,ShoppingBag:eg,ShoppingBasket:tg,ShoppingCart:ng,Shovel:ag,ShowerHead:ig,Shrink:rg,Shrub:og,Shuffle:sg,Sigma:lg,SigmaSquare:cg,Signal:pg,SignalHigh:dg,SignalLow:hg,SignalMedium:ug,SignalZero:yg,Signpost:fg,SignpostBig:kg,Siren:mg,SkipBack:gg,SkipForward:xg,Skull:vg,Slack:Mg,Slash:wg,Slice:Lg,Sliders:Sg,SlidersHorizontal:Cg,Smartphone:bg,SmartphoneCharging:Ig,SmartphoneNfc:jg,Smile:Ag,SmilePlus:Pg,Snail:zg,Snowflake:Vg,Sofa:Hg,Soup:Tg,Space:qg,Spade:Dg,Sparkle:Fg,Sparkles:Vt,Speaker:Rg,Speech:Bg,SpellCheck:Eg,SpellCheck2:Ng,Spline:Og,Split:_g,SplitSquareHorizontal:Ug,SplitSquareVertical:Zg,SprayCan:Wg,Sprout:Gg,Square:n7,SquareAsterisk:$g,SquareCode:Xg,SquareDashedBottom:Qg,SquareDashedBottomCode:Kg,SquareDot:Yg,SquareEqual:Jg,SquareSlash:e7,SquareStack:t7,SquareUser:n1,SquareUserRound:t1,Squircle:a7,Squirrel:i7,Stamp:r7,Star:c7,StarHalf:o7,StarOff:s7,StepBack:l7,StepForward:d7,Stethoscope:oi,Sticker:h7,StickyNote:u7,StopCircle:y7,Store:p7,StretchHorizontal:k7,StretchVertical:f7,Strikethrough:m7,Subscript:g7,Subtitles:x7,Sun:C7,SunDim:v7,SunMedium:M7,SunMoon:w7,SunSnow:L7,Sunrise:S7,Sunset:I7,Superscript:j7,SwissFranc:b7,SwitchCamera:P7,Sword:A7,Swords:z7,Syringe:$t,Table:T7,Table2:V7,TableProperties:H7,Tablet:D7,TabletSmartphone:q7,Tablets:F7,Tag:R7,Tags:B7,Tally1:N7,Tally2:E7,Tally3:O7,Tally4:U7,Tally5:Z7,Tangent:_7,Target:W7,Tent:$7,TentTree:G7,Terminal:K7,TerminalSquare:X7,TestTube:ka,TestTube2:Q7,TestTubes:Y7,Text:nx,TextCursor:ex,TextCursorInput:J7,TextQuote:tx,TextSelect:a1,Theater:ax,Thermometer:ox,ThermometerSnowflake:ix,ThermometerSun:rx,ThumbsDown:sx,ThumbsUp:cx,Ticket:lx,Timer:ux,TimerOff:dx,TimerReset:hx,ToggleLeft:yx,ToggleRight:px,Tornado:kx,Torus:fx,Touchpad:gx,TouchpadOff:mx,TowerControl:xx,ToyBrick:vx,Tractor:Mx,TrafficCone:wx,TrainFront:Cx,TrainFrontTunnel:Lx,TrainTrack:Sx,TramFront:i1,Trash:Ix,Trash2:si,TreeDeciduous:jx,TreePine:bx,Trees:Px,Trello:Ax,TrendingDown:zx,TrendingUp:ci,Triangle:Hx,TriangleRight:Vx,Trophy:Tx,Truck:qx,Turtle:Dx,Tv:Rx,Tv2:Fx,Twitch:Bx,Twitter:Nx,Type:Ex,Umbrella:Ux,UmbrellaOff:Ox,Underline:Zx,Undo:Gx,Undo2:_x,UndoDot:Wx,UnfoldHorizontal:$x,UnfoldVertical:Xx,Ungroup:Kx,Unlink:Yx,Unlink2:Qx,Unlock:ev,UnlockKeyhole:Jx,Unplug:tv,Upload:av,UploadCloud:nv,Usb:iv,User:uv,UserCheck:rv,UserCog:ov,UserMinus:sv,UserPlus:cv,UserRound:d1,UserRoundCheck:r1,UserRoundCog:o1,UserRoundMinus:s1,UserRoundPlus:c1,UserRoundSearch:lv,UserRoundX:l1,UserSearch:dv,UserX:hv,Users:yv,UsersRound:h1,Utensils:li,UtensilsCrossed:j1,UtilityPole:pv,Variable:kv,Vegan:fv,VenetianMask:mv,Vibrate:xv,VibrateOff:gv,Video:Mv,VideoOff:vv,Videotape:wv,View:Lv,Voicemail:Cv,Volume:bv,Volume1:Sv,Volume2:Iv,VolumeX:jv,Vote:Pv,Wallet:Vv,Wallet2:Av,WalletCards:zv,Wallpaper:Hv,Wand:qv,Wand2:Tv,Warehouse:Dv,Watch:Fv,Waves:Rv,Waypoints:Bv,Webcam:Nv,Webhook:Ev,Weight:Ov,Wheat:Zv,WheatOff:Uv,WholeWord:_v,Wifi:Gv,WifiOff:Wv,Wind:$v,Wine:Kv,WineOff:Xv,Workflow:Qv,WrapText:Yv,Wrench:Jv,X:tt,XCircle:eM,XOctagon:tM,XSquare:nM,Youtube:aM,Zap:rM,ZapOff:iM,ZoomIn:oM,ZoomOut:sM},Symbol.toStringTag,{value:"Module"}));/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T1=Object.freeze(Object.defineProperty({__proto__:null,AArrowDown:Cr,AArrowDownIcon:Cr,AArrowUp:Sr,AArrowUpIcon:Sr,ALargeSmall:Ir,ALargeSmallIcon:Ir,Accessibility:jr,AccessibilityIcon:jr,Activity:Pr,ActivityIcon:Pr,ActivitySquare:br,ActivitySquareIcon:br,AirVent:Ar,AirVentIcon:Ar,Airplay:zr,AirplayIcon:zr,AlarmCheck:hn,AlarmCheckIcon:hn,AlarmClock:Hr,AlarmClockCheck:hn,AlarmClockCheckIcon:hn,AlarmClockIcon:Hr,AlarmClockMinus:un,AlarmClockMinusIcon:un,AlarmClockOff:Vr,AlarmClockOffIcon:Vr,AlarmClockPlus:yn,AlarmClockPlusIcon:yn,AlarmMinus:un,AlarmMinusIcon:un,AlarmPlus:yn,AlarmPlusIcon:yn,AlarmSmoke:Tr,AlarmSmokeIcon:Tr,Album:qr,AlbumIcon:qr,AlertCircle:la,AlertCircleIcon:la,AlertOctagon:Dr,AlertOctagonIcon:Dr,AlertTriangle:Gt,AlertTriangleIcon:Gt,AlignCenter:Br,AlignCenterHorizontal:Fr,AlignCenterHorizontalIcon:Fr,AlignCenterIcon:Br,AlignCenterVertical:Rr,AlignCenterVerticalIcon:Rr,AlignEndHorizontal:Nr,AlignEndHorizontalIcon:Nr,AlignEndVertical:Er,AlignEndVerticalIcon:Er,AlignHorizontalDistributeCenter:Or,AlignHorizontalDistributeCenterIcon:Or,AlignHorizontalDistributeEnd:Ur,AlignHorizontalDistributeEndIcon:Ur,AlignHorizontalDistributeStart:Zr,AlignHorizontalDistributeStartIcon:Zr,AlignHorizontalJustifyCenter:_r,AlignHorizontalJustifyCenterIcon:_r,AlignHorizontalJustifyEnd:Wr,AlignHorizontalJustifyEndIcon:Wr,AlignHorizontalJustifyStart:Gr,AlignHorizontalJustifyStartIcon:Gr,AlignHorizontalSpaceAround:$r,AlignHorizontalSpaceAroundIcon:$r,AlignHorizontalSpaceBetween:Xr,AlignHorizontalSpaceBetweenIcon:Xr,AlignJustify:Kr,AlignJustifyIcon:Kr,AlignLeft:Qr,AlignLeftIcon:Qr,AlignRight:Yr,AlignRightIcon:Yr,AlignStartHorizontal:Jr,AlignStartHorizontalIcon:Jr,AlignStartVertical:eo,AlignStartVerticalIcon:eo,AlignVerticalDistributeCenter:to,AlignVerticalDistributeCenterIcon:to,AlignVerticalDistributeEnd:no,AlignVerticalDistributeEndIcon:no,AlignVerticalDistributeStart:ao,AlignVerticalDistributeStartIcon:ao,AlignVerticalJustifyCenter:io,AlignVerticalJustifyCenterIcon:io,AlignVerticalJustifyEnd:ro,AlignVerticalJustifyEndIcon:ro,AlignVerticalJustifyStart:oo,AlignVerticalJustifyStartIcon:oo,AlignVerticalSpaceAround:so,AlignVerticalSpaceAroundIcon:so,AlignVerticalSpaceBetween:co,AlignVerticalSpaceBetweenIcon:co,Ampersand:lo,AmpersandIcon:lo,Ampersands:ho,AmpersandsIcon:ho,Anchor:uo,AnchorIcon:uo,Angry:yo,AngryIcon:yo,Annoyed:po,AnnoyedIcon:po,Antenna:ko,AntennaIcon:ko,Anvil:fo,AnvilIcon:fo,Aperture:mo,ApertureIcon:mo,AppWindow:go,AppWindowIcon:go,Apple:xo,AppleIcon:xo,Archive:wo,ArchiveIcon:wo,ArchiveRestore:vo,ArchiveRestoreIcon:vo,ArchiveX:Mo,ArchiveXIcon:Mo,AreaChart:Lo,AreaChartIcon:Lo,Armchair:Co,ArmchairIcon:Co,ArrowBigDown:Io,ArrowBigDownDash:So,ArrowBigDownDashIcon:So,ArrowBigDownIcon:Io,ArrowBigLeft:bo,ArrowBigLeftDash:jo,ArrowBigLeftDashIcon:jo,ArrowBigLeftIcon:bo,ArrowBigRight:Ao,ArrowBigRightDash:Po,ArrowBigRightDashIcon:Po,ArrowBigRightIcon:Ao,ArrowBigUp:Vo,ArrowBigUpDash:zo,ArrowBigUpDashIcon:zo,ArrowBigUpIcon:Vo,ArrowDown:$o,ArrowDown01:Ho,ArrowDown01Icon:Ho,ArrowDown10:To,ArrowDown10Icon:To,ArrowDownAZ:pn,ArrowDownAZIcon:pn,ArrowDownAz:pn,ArrowDownAzIcon:pn,ArrowDownCircle:qo,ArrowDownCircleIcon:qo,ArrowDownFromLine:Do,ArrowDownFromLineIcon:Do,ArrowDownIcon:$o,ArrowDownLeft:Bo,ArrowDownLeftFromCircle:Fo,ArrowDownLeftFromCircleIcon:Fo,ArrowDownLeftIcon:Bo,ArrowDownLeftSquare:Ro,ArrowDownLeftSquareIcon:Ro,ArrowDownNarrowWide:No,ArrowDownNarrowWideIcon:No,ArrowDownRight:Uo,ArrowDownRightFromCircle:Eo,ArrowDownRightFromCircleIcon:Eo,ArrowDownRightIcon:Uo,ArrowDownRightSquare:Oo,ArrowDownRightSquareIcon:Oo,ArrowDownSquare:Zo,ArrowDownSquareIcon:Zo,ArrowDownToDot:_o,ArrowDownToDotIcon:_o,ArrowDownToLine:Wo,ArrowDownToLineIcon:Wo,ArrowDownUp:Go,ArrowDownUpIcon:Go,ArrowDownWideNarrow:kn,ArrowDownWideNarrowIcon:kn,ArrowDownZA:fn,ArrowDownZAIcon:fn,ArrowDownZa:fn,ArrowDownZaIcon:fn,ArrowLeft:e2,ArrowLeftCircle:Xo,ArrowLeftCircleIcon:Xo,ArrowLeftFromLine:Ko,ArrowLeftFromLineIcon:Ko,ArrowLeftIcon:e2,ArrowLeftRight:Qo,ArrowLeftRightIcon:Qo,ArrowLeftSquare:Yo,ArrowLeftSquareIcon:Yo,ArrowLeftToLine:Jo,ArrowLeftToLineIcon:Jo,ArrowRight:da,ArrowRightCircle:t2,ArrowRightCircleIcon:t2,ArrowRightFromLine:n2,ArrowRightFromLineIcon:n2,ArrowRightIcon:da,ArrowRightLeft:a2,ArrowRightLeftIcon:a2,ArrowRightSquare:i2,ArrowRightSquareIcon:i2,ArrowRightToLine:r2,ArrowRightToLineIcon:r2,ArrowUp:M2,ArrowUp01:o2,ArrowUp01Icon:o2,ArrowUp10:s2,ArrowUp10Icon:s2,ArrowUpAZ:mn,ArrowUpAZIcon:mn,ArrowUpAz:mn,ArrowUpAzIcon:mn,ArrowUpCircle:c2,ArrowUpCircleIcon:c2,ArrowUpDown:l2,ArrowUpDownIcon:l2,ArrowUpFromDot:d2,ArrowUpFromDotIcon:d2,ArrowUpFromLine:h2,ArrowUpFromLineIcon:h2,ArrowUpIcon:M2,ArrowUpLeft:p2,ArrowUpLeftFromCircle:u2,ArrowUpLeftFromCircleIcon:u2,ArrowUpLeftIcon:p2,ArrowUpLeftSquare:y2,ArrowUpLeftSquareIcon:y2,ArrowUpNarrowWide:gn,ArrowUpNarrowWideIcon:gn,ArrowUpRight:m2,ArrowUpRightFromCircle:k2,ArrowUpRightFromCircleIcon:k2,ArrowUpRightIcon:m2,ArrowUpRightSquare:f2,ArrowUpRightSquareIcon:f2,ArrowUpSquare:g2,ArrowUpSquareIcon:g2,ArrowUpToLine:x2,ArrowUpToLineIcon:x2,ArrowUpWideNarrow:v2,ArrowUpWideNarrowIcon:v2,ArrowUpZA:xn,ArrowUpZAIcon:xn,ArrowUpZa:xn,ArrowUpZaIcon:xn,ArrowsUpFromLine:w2,ArrowsUpFromLineIcon:w2,Asterisk:L2,AsteriskIcon:L2,AtSign:C2,AtSignIcon:C2,Atom:S2,AtomIcon:S2,AudioLines:I2,AudioLinesIcon:I2,AudioWaveform:j2,AudioWaveformIcon:j2,Award:b2,AwardIcon:b2,Axe:P2,AxeIcon:P2,Axis3D:vn,Axis3DIcon:vn,Axis3d:vn,Axis3dIcon:vn,Baby:dt,BabyIcon:dt,Backpack:A2,BackpackIcon:A2,Badge:W2,BadgeAlert:z2,BadgeAlertIcon:z2,BadgeCent:V2,BadgeCentIcon:V2,BadgeCheck:Mn,BadgeCheckIcon:Mn,BadgeDollarSign:H2,BadgeDollarSignIcon:H2,BadgeEuro:T2,BadgeEuroIcon:T2,BadgeHelp:q2,BadgeHelpIcon:q2,BadgeIcon:W2,BadgeIndianRupee:D2,BadgeIndianRupeeIcon:D2,BadgeInfo:F2,BadgeInfoIcon:F2,BadgeJapaneseYen:R2,BadgeJapaneseYenIcon:R2,BadgeMinus:B2,BadgeMinusIcon:B2,BadgePercent:N2,BadgePercentIcon:N2,BadgePlus:E2,BadgePlusIcon:E2,BadgePoundSterling:O2,BadgePoundSterlingIcon:O2,BadgeRussianRuble:U2,BadgeRussianRubleIcon:U2,BadgeSwissFranc:Z2,BadgeSwissFrancIcon:Z2,BadgeX:_2,BadgeXIcon:_2,BaggageClaim:G2,BaggageClaimIcon:G2,Ban:$2,BanIcon:$2,Banana:X2,BananaIcon:X2,Banknote:K2,BanknoteIcon:K2,BarChart:as,BarChart2:Q2,BarChart2Icon:Q2,BarChart3:Y2,BarChart3Icon:Y2,BarChart4:J2,BarChart4Icon:J2,BarChartBig:es,BarChartBigIcon:es,BarChartHorizontal:ns,BarChartHorizontalBig:ts,BarChartHorizontalBigIcon:ts,BarChartHorizontalIcon:ns,BarChartIcon:as,Barcode:is,BarcodeIcon:is,Baseline:rs,BaselineIcon:rs,Bath:os,BathIcon:os,Battery:us,BatteryCharging:ss,BatteryChargingIcon:ss,BatteryFull:cs,BatteryFullIcon:cs,BatteryIcon:us,BatteryLow:ls,BatteryLowIcon:ls,BatteryMedium:ds,BatteryMediumIcon:ds,BatteryWarning:hs,BatteryWarningIcon:hs,Beaker:ys,BeakerIcon:ys,Bean:ks,BeanIcon:ks,BeanOff:ps,BeanOffIcon:ps,Bed:gs,BedDouble:fs,BedDoubleIcon:fs,BedIcon:gs,BedSingle:ms,BedSingleIcon:ms,Beef:xs,BeefIcon:xs,Beer:vs,BeerIcon:vs,Bell:js,BellDot:Ms,BellDotIcon:Ms,BellElectric:ws,BellElectricIcon:ws,BellIcon:js,BellMinus:Ls,BellMinusIcon:Ls,BellOff:Cs,BellOffIcon:Cs,BellPlus:Ss,BellPlusIcon:Ss,BellRing:Is,BellRingIcon:Is,Bike:bs,BikeIcon:bs,Binary:Ps,BinaryIcon:Ps,Biohazard:As,BiohazardIcon:As,Bird:zs,BirdIcon:zs,Bitcoin:Vs,BitcoinIcon:Vs,Blinds:Hs,BlindsIcon:Hs,Blocks:Ts,BlocksIcon:Ts,Bluetooth:Rs,BluetoothConnected:qs,BluetoothConnectedIcon:qs,BluetoothIcon:Rs,BluetoothOff:Ds,BluetoothOffIcon:Ds,BluetoothSearching:Fs,BluetoothSearchingIcon:Fs,Bold:Bs,BoldIcon:Bs,Bomb:Ns,BombIcon:Ns,Bone:Es,BoneIcon:Es,Book:lc,BookA:Os,BookAIcon:Os,BookAudio:Us,BookAudioIcon:Us,BookCheck:Zs,BookCheckIcon:Zs,BookCopy:_s,BookCopyIcon:_s,BookDashed:wn,BookDashedIcon:wn,BookDown:Ws,BookDownIcon:Ws,BookHeadphones:Gs,BookHeadphonesIcon:Gs,BookHeart:$s,BookHeartIcon:$s,BookIcon:lc,BookImage:Xs,BookImageIcon:Xs,BookKey:Ks,BookKeyIcon:Ks,BookLock:Qs,BookLockIcon:Qs,BookMarked:Ys,BookMarkedIcon:Ys,BookMinus:Js,BookMinusIcon:Js,BookOpen:Ya,BookOpenCheck:ec,BookOpenCheckIcon:ec,BookOpenIcon:Ya,BookOpenText:tc,BookOpenTextIcon:tc,BookPlus:nc,BookPlusIcon:nc,BookTemplate:wn,BookTemplateIcon:wn,BookText:ac,BookTextIcon:ac,BookType:ic,BookTypeIcon:ic,BookUp:oc,BookUp2:rc,BookUp2Icon:rc,BookUpIcon:oc,BookUser:sc,BookUserIcon:sc,BookX:cc,BookXIcon:cc,Bookmark:pc,BookmarkCheck:dc,BookmarkCheckIcon:dc,BookmarkIcon:pc,BookmarkMinus:hc,BookmarkMinusIcon:hc,BookmarkPlus:uc,BookmarkPlusIcon:uc,BookmarkX:yc,BookmarkXIcon:yc,BoomBox:kc,BoomBoxIcon:kc,Bot:fc,BotIcon:fc,Box:gc,BoxIcon:gc,BoxSelect:mc,BoxSelectIcon:mc,Boxes:xc,BoxesIcon:xc,Braces:Ln,BracesIcon:Ln,Brackets:vc,BracketsIcon:vc,Brain:Lc,BrainCircuit:Mc,BrainCircuitIcon:Mc,BrainCog:wc,BrainCogIcon:wc,BrainIcon:Lc,BrickWall:Cc,BrickWallIcon:Cc,Briefcase:Sc,BriefcaseIcon:Sc,BringToFront:Ic,BringToFrontIcon:Ic,Brush:jc,BrushIcon:jc,Bug:Ac,BugIcon:Ac,BugOff:bc,BugOffIcon:bc,BugPlay:Pc,BugPlayIcon:Pc,Building:Vc,Building2:zc,Building2Icon:zc,BuildingIcon:Vc,Bus:Tc,BusFront:Hc,BusFrontIcon:Hc,BusIcon:Tc,Cable:Dc,CableCar:qc,CableCarIcon:qc,CableIcon:Dc,Cake:Rc,CakeIcon:Rc,CakeSlice:Fc,CakeSliceIcon:Fc,Calculator:Bc,CalculatorIcon:Bc,Calendar:gt,CalendarCheck:Ec,CalendarCheck2:Nc,CalendarCheck2Icon:Nc,CalendarCheckIcon:Ec,CalendarClock:Oc,CalendarClockIcon:Oc,CalendarDays:Uc,CalendarDaysIcon:Uc,CalendarHeart:Zc,CalendarHeartIcon:Zc,CalendarIcon:gt,CalendarMinus:_c,CalendarMinusIcon:_c,CalendarOff:Wc,CalendarOffIcon:Wc,CalendarPlus:Gc,CalendarPlusIcon:Gc,CalendarRange:$c,CalendarRangeIcon:$c,CalendarSearch:Xc,CalendarSearchIcon:Xc,CalendarX:Qc,CalendarX2:Kc,CalendarX2Icon:Kc,CalendarXIcon:Qc,Camera:Jc,CameraIcon:Jc,CameraOff:Yc,CameraOffIcon:Yc,CandlestickChart:el,CandlestickChartIcon:el,Candy:al,CandyCane:tl,CandyCaneIcon:tl,CandyIcon:al,CandyOff:nl,CandyOffIcon:nl,Car:ol,CarFront:il,CarFrontIcon:il,CarIcon:ol,CarTaxiFront:rl,CarTaxiFrontIcon:rl,Caravan:sl,CaravanIcon:sl,Carrot:cl,CarrotIcon:cl,CaseLower:ll,CaseLowerIcon:ll,CaseSensitive:dl,CaseSensitiveIcon:dl,CaseUpper:hl,CaseUpperIcon:hl,CassetteTape:ul,CassetteTapeIcon:ul,Cast:yl,CastIcon:yl,Castle:pl,CastleIcon:pl,Cat:kl,CatIcon:kl,Cctv:fl,CctvIcon:fl,Check:w1,CheckCheck:ml,CheckCheckIcon:ml,CheckCircle:gl,CheckCircle2:M1,CheckCircle2Icon:M1,CheckCircleIcon:gl,CheckIcon:w1,CheckSquare:vl,CheckSquare2:xl,CheckSquare2Icon:xl,CheckSquareIcon:vl,ChefHat:Ml,ChefHatIcon:Ml,Cherry:wl,CherryIcon:wl,ChevronDown:ha,ChevronDownCircle:Ll,ChevronDownCircleIcon:Ll,ChevronDownIcon:ha,ChevronDownSquare:Cl,ChevronDownSquareIcon:Cl,ChevronFirst:Sl,ChevronFirstIcon:Sl,ChevronLast:Il,ChevronLastIcon:Il,ChevronLeft:Pl,ChevronLeftCircle:jl,ChevronLeftCircleIcon:jl,ChevronLeftIcon:Pl,ChevronLeftSquare:bl,ChevronLeftSquareIcon:bl,ChevronRight:Ja,ChevronRightCircle:Al,ChevronRightCircleIcon:Al,ChevronRightIcon:Ja,ChevronRightSquare:zl,ChevronRightSquareIcon:zl,ChevronUp:Tl,ChevronUpCircle:Vl,ChevronUpCircleIcon:Vl,ChevronUpIcon:Tl,ChevronUpSquare:Hl,ChevronUpSquareIcon:Hl,ChevronsDown:Dl,ChevronsDownIcon:Dl,ChevronsDownUp:ql,ChevronsDownUpIcon:ql,ChevronsLeft:Rl,ChevronsLeftIcon:Rl,ChevronsLeftRight:Fl,ChevronsLeftRightIcon:Fl,ChevronsRight:Nl,ChevronsRightIcon:Nl,ChevronsRightLeft:Bl,ChevronsRightLeftIcon:Bl,ChevronsUp:Ol,ChevronsUpDown:El,ChevronsUpDownIcon:El,ChevronsUpIcon:Ol,Chrome:Ul,ChromeIcon:Ul,Church:Zl,ChurchIcon:Zl,Cigarette:Wl,CigaretteIcon:Wl,CigaretteOff:_l,CigaretteOffIcon:_l,Circle:t0,CircleDashed:Gl,CircleDashedIcon:Gl,CircleDollarSign:$l,CircleDollarSignIcon:$l,CircleDot:Kl,CircleDotDashed:Xl,CircleDotDashedIcon:Xl,CircleDotIcon:Kl,CircleEllipsis:Ql,CircleEllipsisIcon:Ql,CircleEqual:Yl,CircleEqualIcon:Yl,CircleIcon:t0,CircleOff:Jl,CircleOffIcon:Jl,CircleSlash:e0,CircleSlash2:Cn,CircleSlash2Icon:Cn,CircleSlashIcon:e0,CircleSlashed:Cn,CircleSlashedIcon:Cn,CircleUser:In,CircleUserIcon:In,CircleUserRound:Sn,CircleUserRoundIcon:Sn,CircuitBoard:n0,CircuitBoardIcon:n0,Citrus:a0,CitrusIcon:a0,Clapperboard:i0,ClapperboardIcon:i0,Clipboard:y0,ClipboardCheck:r0,ClipboardCheckIcon:r0,ClipboardCopy:o0,ClipboardCopyIcon:o0,ClipboardEdit:s0,ClipboardEditIcon:s0,ClipboardIcon:y0,ClipboardList:c0,ClipboardListIcon:c0,ClipboardPaste:l0,ClipboardPasteIcon:l0,ClipboardSignature:d0,ClipboardSignatureIcon:d0,ClipboardType:h0,ClipboardTypeIcon:h0,ClipboardX:u0,ClipboardXIcon:u0,Clock:ua,Clock1:p0,Clock10:k0,Clock10Icon:k0,Clock11:f0,Clock11Icon:f0,Clock12:m0,Clock12Icon:m0,Clock1Icon:p0,Clock2:g0,Clock2Icon:g0,Clock3:x0,Clock3Icon:x0,Clock4:v0,Clock4Icon:v0,Clock5:M0,Clock5Icon:M0,Clock6:w0,Clock6Icon:w0,Clock7:L0,Clock7Icon:L0,Clock8:C0,Clock8Icon:C0,Clock9:S0,Clock9Icon:S0,ClockIcon:ua,Cloud:B0,CloudCog:I0,CloudCogIcon:I0,CloudDrizzle:j0,CloudDrizzleIcon:j0,CloudFog:b0,CloudFogIcon:b0,CloudHail:P0,CloudHailIcon:P0,CloudIcon:B0,CloudLightning:A0,CloudLightningIcon:A0,CloudMoon:V0,CloudMoonIcon:V0,CloudMoonRain:z0,CloudMoonRainIcon:z0,CloudOff:H0,CloudOffIcon:H0,CloudRain:q0,CloudRainIcon:q0,CloudRainWind:T0,CloudRainWindIcon:T0,CloudSnow:D0,CloudSnowIcon:D0,CloudSun:R0,CloudSunIcon:R0,CloudSunRain:F0,CloudSunRainIcon:F0,Cloudy:N0,CloudyIcon:N0,Clover:E0,CloverIcon:E0,Club:O0,ClubIcon:O0,Code:Z0,Code2:U0,Code2Icon:U0,CodeIcon:Z0,Codepen:_0,CodepenIcon:_0,Codesandbox:W0,CodesandboxIcon:W0,Coffee:G0,CoffeeIcon:G0,Cog:$0,CogIcon:$0,Coins:X0,CoinsIcon:X0,Columns:jn,Columns2:jn,Columns2Icon:jn,Columns3:bn,Columns3Icon:bn,Columns4:K0,Columns4Icon:K0,ColumnsIcon:jn,Combine:Q0,CombineIcon:Q0,Command:Y0,CommandIcon:Y0,Compass:J0,CompassIcon:J0,Component:ed,ComponentIcon:ed,Computer:td,ComputerIcon:td,ConciergeBell:nd,ConciergeBellIcon:nd,Cone:ad,ConeIcon:ad,Construction:id,ConstructionIcon:id,Contact:od,Contact2:rd,Contact2Icon:rd,ContactIcon:od,Container:sd,ContainerIcon:sd,Contrast:cd,ContrastIcon:cd,Cookie:ld,CookieIcon:ld,CookingPot:dd,CookingPotIcon:dd,Copy:fd,CopyCheck:hd,CopyCheckIcon:hd,CopyIcon:fd,CopyMinus:ud,CopyMinusIcon:ud,CopyPlus:yd,CopyPlusIcon:yd,CopySlash:pd,CopySlashIcon:pd,CopyX:kd,CopyXIcon:kd,Copyleft:md,CopyleftIcon:md,Copyright:gd,CopyrightIcon:gd,CornerDownLeft:xd,CornerDownLeftIcon:xd,CornerDownRight:vd,CornerDownRightIcon:vd,CornerLeftDown:Md,CornerLeftDownIcon:Md,CornerLeftUp:wd,CornerLeftUpIcon:wd,CornerRightDown:Ld,CornerRightDownIcon:Ld,CornerRightUp:Cd,CornerRightUpIcon:Cd,CornerUpLeft:Sd,CornerUpLeftIcon:Sd,CornerUpRight:Id,CornerUpRightIcon:Id,Cpu:jd,CpuIcon:jd,CreativeCommons:bd,CreativeCommonsIcon:bd,CreditCard:Pd,CreditCardIcon:Pd,Croissant:Ad,CroissantIcon:Ad,Crop:zd,CropIcon:zd,Cross:Vd,CrossIcon:Vd,Crosshair:Hd,CrosshairIcon:Hd,Crown:Td,CrownIcon:Td,Cuboid:qd,CuboidIcon:qd,CupSoda:Dd,CupSodaIcon:Dd,CurlyBraces:Ln,CurlyBracesIcon:Ln,Currency:Fd,CurrencyIcon:Fd,Cylinder:Rd,CylinderIcon:Rd,Database:Ed,DatabaseBackup:Bd,DatabaseBackupIcon:Bd,DatabaseIcon:Ed,DatabaseZap:Nd,DatabaseZapIcon:Nd,Delete:Od,DeleteIcon:Od,Dessert:Ud,DessertIcon:Ud,Diameter:Zd,DiameterIcon:Zd,Diamond:_d,DiamondIcon:_d,Dice1:Wd,Dice1Icon:Wd,Dice2:Gd,Dice2Icon:Gd,Dice3:$d,Dice3Icon:$d,Dice4:Xd,Dice4Icon:Xd,Dice5:Kd,Dice5Icon:Kd,Dice6:Qd,Dice6Icon:Qd,Dices:Yd,DicesIcon:Yd,Diff:Jd,DiffIcon:Jd,Disc:ah,Disc2:eh,Disc2Icon:eh,Disc3:th,Disc3Icon:th,DiscAlbum:nh,DiscAlbumIcon:nh,DiscIcon:ah,Divide:oh,DivideCircle:ih,DivideCircleIcon:ih,DivideIcon:oh,DivideSquare:rh,DivideSquareIcon:rh,Dna:ch,DnaIcon:ch,DnaOff:sh,DnaOffIcon:sh,Dog:lh,DogIcon:lh,DollarSign:dh,DollarSignIcon:dh,Donut:hh,DonutIcon:hh,DoorClosed:uh,DoorClosedIcon:uh,DoorOpen:yh,DoorOpenIcon:yh,Dot:ei,DotIcon:ei,Download:kh,DownloadCloud:ph,DownloadCloudIcon:ph,DownloadIcon:kh,DraftingCompass:fh,DraftingCompassIcon:fh,Drama:mh,DramaIcon:mh,Dribbble:gh,DribbbleIcon:gh,Droplet:xh,DropletIcon:xh,Droplets:vh,DropletsIcon:vh,Drum:Mh,DrumIcon:Mh,Drumstick:wh,DrumstickIcon:wh,Dumbbell:Lh,DumbbellIcon:Lh,Ear:Sh,EarIcon:Sh,EarOff:Ch,EarOffIcon:Ch,Edit:Xe,Edit2:$n,Edit2Icon:$n,Edit3:Gn,Edit3Icon:Gn,EditIcon:Xe,Egg:bh,EggFried:Ih,EggFriedIcon:Ih,EggIcon:bh,EggOff:jh,EggOffIcon:jh,Equal:Ah,EqualIcon:Ah,EqualNot:Ph,EqualNotIcon:Ph,Eraser:zh,EraserIcon:zh,Euro:Vh,EuroIcon:Vh,Expand:Hh,ExpandIcon:Hh,ExternalLink:Th,ExternalLinkIcon:Th,Eye:Dh,EyeIcon:Dh,EyeOff:qh,EyeOffIcon:qh,Facebook:Fh,FacebookIcon:Fh,Factory:Rh,FactoryIcon:Rh,Fan:Bh,FanIcon:Bh,FastForward:Nh,FastForwardIcon:Nh,Feather:Eh,FeatherIcon:Eh,Fence:Oh,FenceIcon:Oh,FerrisWheel:Uh,FerrisWheelIcon:Uh,Figma:Zh,FigmaIcon:Zh,File:_u,FileArchive:_h,FileArchiveIcon:_h,FileAudio:Gh,FileAudio2:Wh,FileAudio2Icon:Wh,FileAudioIcon:Gh,FileAxis3D:Pn,FileAxis3DIcon:Pn,FileAxis3d:Pn,FileAxis3dIcon:Pn,FileBadge:Xh,FileBadge2:$h,FileBadge2Icon:$h,FileBadgeIcon:Xh,FileBarChart:Qh,FileBarChart2:Kh,FileBarChart2Icon:Kh,FileBarChartIcon:Qh,FileBox:Yh,FileBoxIcon:Yh,FileCheck:eu,FileCheck2:Jh,FileCheck2Icon:Jh,FileCheckIcon:eu,FileClock:tu,FileClockIcon:tu,FileCode:au,FileCode2:nu,FileCode2Icon:nu,FileCodeIcon:au,FileCog:An,FileCog2:An,FileCog2Icon:An,FileCogIcon:An,FileDiff:iu,FileDiffIcon:iu,FileDigit:ru,FileDigitIcon:ru,FileDown:ou,FileDownIcon:ou,FileEdit:su,FileEditIcon:su,FileHeart:cu,FileHeartIcon:cu,FileIcon:_u,FileImage:lu,FileImageIcon:lu,FileInput:du,FileInputIcon:du,FileJson:uu,FileJson2:hu,FileJson2Icon:hu,FileJsonIcon:uu,FileKey:pu,FileKey2:yu,FileKey2Icon:yu,FileKeyIcon:pu,FileLineChart:ku,FileLineChartIcon:ku,FileLock:mu,FileLock2:fu,FileLock2Icon:fu,FileLockIcon:mu,FileMinus:xu,FileMinus2:gu,FileMinus2Icon:gu,FileMinusIcon:xu,FileMusic:vu,FileMusicIcon:vu,FileOutput:Mu,FileOutputIcon:Mu,FilePieChart:wu,FilePieChartIcon:wu,FilePlus:Cu,FilePlus2:Lu,FilePlus2Icon:Lu,FilePlusIcon:Cu,FileQuestion:Su,FileQuestionIcon:Su,FileScan:Iu,FileScanIcon:Iu,FileSearch:bu,FileSearch2:ju,FileSearch2Icon:ju,FileSearchIcon:bu,FileSignature:Pu,FileSignatureIcon:Pu,FileSpreadsheet:Au,FileSpreadsheetIcon:Au,FileStack:zu,FileStackIcon:zu,FileSymlink:Vu,FileSymlinkIcon:Vu,FileTerminal:Hu,FileTerminalIcon:Hu,FileText:Tu,FileTextIcon:Tu,FileType:Du,FileType2:qu,FileType2Icon:qu,FileTypeIcon:Du,FileUp:Fu,FileUpIcon:Fu,FileVideo:Bu,FileVideo2:Ru,FileVideo2Icon:Ru,FileVideoIcon:Bu,FileVolume:Eu,FileVolume2:Nu,FileVolume2Icon:Nu,FileVolumeIcon:Eu,FileWarning:Ou,FileWarningIcon:Ou,FileX:Zu,FileX2:Uu,FileX2Icon:Uu,FileXIcon:Zu,Files:Wu,FilesIcon:Wu,Film:Gu,FilmIcon:Gu,Filter:ya,FilterIcon:ya,FilterX:$u,FilterXIcon:$u,Fingerprint:Xu,FingerprintIcon:Xu,FireExtinguisher:Ku,FireExtinguisherIcon:Ku,Fish:Ju,FishIcon:Ju,FishOff:Qu,FishOffIcon:Qu,FishSymbol:Yu,FishSymbolIcon:Yu,Flag:ay,FlagIcon:ay,FlagOff:ey,FlagOffIcon:ey,FlagTriangleLeft:ty,FlagTriangleLeftIcon:ty,FlagTriangleRight:ny,FlagTriangleRightIcon:ny,Flame:ry,FlameIcon:ry,FlameKindling:iy,FlameKindlingIcon:iy,Flashlight:sy,FlashlightIcon:sy,FlashlightOff:oy,FlashlightOffIcon:oy,FlaskConical:ly,FlaskConicalIcon:ly,FlaskConicalOff:cy,FlaskConicalOffIcon:cy,FlaskRound:dy,FlaskRoundIcon:dy,FlipHorizontal:uy,FlipHorizontal2:hy,FlipHorizontal2Icon:hy,FlipHorizontalIcon:uy,FlipVertical:py,FlipVertical2:yy,FlipVertical2Icon:yy,FlipVerticalIcon:py,Flower:fy,Flower2:ky,Flower2Icon:ky,FlowerIcon:fy,Focus:my,FocusIcon:my,FoldHorizontal:gy,FoldHorizontalIcon:gy,FoldVertical:xy,FoldVerticalIcon:xy,Folder:Gy,FolderArchive:vy,FolderArchiveIcon:vy,FolderCheck:My,FolderCheckIcon:My,FolderClock:wy,FolderClockIcon:wy,FolderClosed:Ly,FolderClosedIcon:Ly,FolderCog:zn,FolderCog2:zn,FolderCog2Icon:zn,FolderCogIcon:zn,FolderDot:Cy,FolderDotIcon:Cy,FolderDown:Sy,FolderDownIcon:Sy,FolderEdit:Iy,FolderEditIcon:Iy,FolderGit:by,FolderGit2:jy,FolderGit2Icon:jy,FolderGitIcon:by,FolderHeart:Py,FolderHeartIcon:Py,FolderIcon:Gy,FolderInput:Ay,FolderInputIcon:Ay,FolderKanban:zy,FolderKanbanIcon:zy,FolderKey:Vy,FolderKeyIcon:Vy,FolderLock:Hy,FolderLockIcon:Hy,FolderMinus:Ty,FolderMinusIcon:Ty,FolderOpen:Dy,FolderOpenDot:qy,FolderOpenDotIcon:qy,FolderOpenIcon:Dy,FolderOutput:Fy,FolderOutputIcon:Fy,FolderPlus:Ry,FolderPlusIcon:Ry,FolderRoot:By,FolderRootIcon:By,FolderSearch:Ey,FolderSearch2:Ny,FolderSearch2Icon:Ny,FolderSearchIcon:Ey,FolderSymlink:Oy,FolderSymlinkIcon:Oy,FolderSync:Uy,FolderSyncIcon:Uy,FolderTree:Zy,FolderTreeIcon:Zy,FolderUp:_y,FolderUpIcon:_y,FolderX:Wy,FolderXIcon:Wy,Folders:$y,FoldersIcon:$y,Footprints:Xy,FootprintsIcon:Xy,Forklift:Ky,ForkliftIcon:Ky,FormInput:Qy,FormInputIcon:Qy,Forward:Yy,ForwardIcon:Yy,Frame:Jy,FrameIcon:Jy,Framer:ep,FramerIcon:ep,Frown:tp,FrownIcon:tp,Fuel:np,FuelIcon:np,Fullscreen:ap,FullscreenIcon:ap,FunctionSquare:ip,FunctionSquareIcon:ip,GalleryHorizontal:op,GalleryHorizontalEnd:rp,GalleryHorizontalEndIcon:rp,GalleryHorizontalIcon:op,GalleryThumbnails:sp,GalleryThumbnailsIcon:sp,GalleryVertical:lp,GalleryVerticalEnd:cp,GalleryVerticalEndIcon:cp,GalleryVerticalIcon:lp,Gamepad:hp,Gamepad2:dp,Gamepad2Icon:dp,GamepadIcon:hp,GanttChart:up,GanttChartIcon:up,GanttChartSquare:Vn,GanttChartSquareIcon:Vn,Gauge:pp,GaugeCircle:yp,GaugeCircleIcon:yp,GaugeIcon:pp,Gavel:kp,GavelIcon:kp,Gem:fp,GemIcon:fp,Ghost:mp,GhostIcon:mp,Gift:gp,GiftIcon:gp,GitBranch:vp,GitBranchIcon:vp,GitBranchPlus:xp,GitBranchPlusIcon:xp,GitCommit:Hn,GitCommitHorizontal:Hn,GitCommitHorizontalIcon:Hn,GitCommitIcon:Hn,GitCommitVertical:Mp,GitCommitVerticalIcon:Mp,GitCompare:Lp,GitCompareArrows:wp,GitCompareArrowsIcon:wp,GitCompareIcon:Lp,GitFork:Cp,GitForkIcon:Cp,GitGraph:Sp,GitGraphIcon:Sp,GitMerge:Ip,GitMergeIcon:Ip,GitPullRequest:Vp,GitPullRequestArrow:jp,GitPullRequestArrowIcon:jp,GitPullRequestClosed:bp,GitPullRequestClosedIcon:bp,GitPullRequestCreate:Ap,GitPullRequestCreateArrow:Pp,GitPullRequestCreateArrowIcon:Pp,GitPullRequestCreateIcon:Ap,GitPullRequestDraft:zp,GitPullRequestDraftIcon:zp,GitPullRequestIcon:Vp,Github:Hp,GithubIcon:Hp,Gitlab:Tp,GitlabIcon:Tp,GlassWater:qp,GlassWaterIcon:qp,Glasses:Dp,GlassesIcon:Dp,Globe:Rp,Globe2:Fp,Globe2Icon:Fp,GlobeIcon:Rp,Goal:Bp,GoalIcon:Bp,Grab:Np,GrabIcon:Np,GraduationCap:Ep,GraduationCapIcon:Ep,Grape:Op,GrapeIcon:Op,Grid:rt,Grid2X2:Tn,Grid2X2Icon:Tn,Grid2x2:Tn,Grid2x2Icon:Tn,Grid3X3:rt,Grid3X3Icon:rt,Grid3x3:rt,Grid3x3Icon:rt,GridIcon:rt,Grip:_p,GripHorizontal:Up,GripHorizontalIcon:Up,GripIcon:_p,GripVertical:Zp,GripVerticalIcon:Zp,Group:Wp,GroupIcon:Wp,Guitar:Gp,GuitarIcon:Gp,Hammer:$p,HammerIcon:$p,Hand:L1,HandIcon:L1,HandMetal:Xp,HandMetalIcon:Xp,HardDrive:Yp,HardDriveDownload:Kp,HardDriveDownloadIcon:Kp,HardDriveIcon:Yp,HardDriveUpload:Qp,HardDriveUploadIcon:Qp,HardHat:Jp,HardHatIcon:Jp,Hash:ek,HashIcon:ek,Haze:tk,HazeIcon:tk,HdmiPort:nk,HdmiPortIcon:nk,Heading:lk,Heading1:ak,Heading1Icon:ak,Heading2:ik,Heading2Icon:ik,Heading3:rk,Heading3Icon:rk,Heading4:ok,Heading4Icon:ok,Heading5:sk,Heading5Icon:sk,Heading6:ck,Heading6Icon:ck,HeadingIcon:lk,Headphones:dk,HeadphonesIcon:dk,Heart:Rt,HeartCrack:hk,HeartCrackIcon:hk,HeartHandshake:uk,HeartHandshakeIcon:uk,HeartIcon:Rt,HeartOff:yk,HeartOffIcon:yk,HeartPulse:pk,HeartPulseIcon:pk,HelpCircle:kk,HelpCircleIcon:kk,HelpingHand:fk,HelpingHandIcon:fk,Hexagon:mk,HexagonIcon:mk,Highlighter:gk,HighlighterIcon:gk,History:xk,HistoryIcon:xk,Home:C1,HomeIcon:C1,Hop:Mk,HopIcon:Mk,HopOff:vk,HopOffIcon:vk,Hotel:wk,HotelIcon:wk,Hourglass:Lk,HourglassIcon:Lk,IceCream:Sk,IceCream2:Ck,IceCream2Icon:Ck,IceCreamIcon:Sk,Image:Ak,ImageDown:Ik,ImageDownIcon:Ik,ImageIcon:Ak,ImageMinus:jk,ImageMinusIcon:jk,ImageOff:bk,ImageOffIcon:bk,ImagePlus:Pk,ImagePlusIcon:Pk,Import:zk,ImportIcon:zk,Inbox:Vk,InboxIcon:Vk,Indent:Hk,IndentIcon:Hk,IndianRupee:Tk,IndianRupeeIcon:Tk,Infinity:qk,InfinityIcon:qk,Info:Dk,InfoIcon:Dk,Inspect:Fn,InspectIcon:Fn,InspectionPanel:Fk,InspectionPanelIcon:Fk,Instagram:Rk,InstagramIcon:Rk,Italic:Bk,ItalicIcon:Bk,IterationCcw:Nk,IterationCcwIcon:Nk,IterationCw:Ek,IterationCwIcon:Ek,JapaneseYen:Ok,JapaneseYenIcon:Ok,Joystick:Uk,JoystickIcon:Uk,Kanban:Zk,KanbanIcon:Zk,KanbanSquare:Dn,KanbanSquareDashed:qn,KanbanSquareDashedIcon:qn,KanbanSquareIcon:Dn,Key:Gk,KeyIcon:Gk,KeyRound:_k,KeyRoundIcon:_k,KeySquare:Wk,KeySquareIcon:Wk,Keyboard:Xk,KeyboardIcon:Xk,KeyboardMusic:$k,KeyboardMusicIcon:$k,Lamp:t4,LampCeiling:Kk,LampCeilingIcon:Kk,LampDesk:Qk,LampDeskIcon:Qk,LampFloor:Yk,LampFloorIcon:Yk,LampIcon:t4,LampWallDown:Jk,LampWallDownIcon:Jk,LampWallUp:e4,LampWallUpIcon:e4,LandPlot:n4,LandPlotIcon:n4,Landmark:a4,LandmarkIcon:a4,Languages:i4,LanguagesIcon:i4,Laptop:o4,Laptop2:r4,Laptop2Icon:r4,LaptopIcon:o4,Lasso:c4,LassoIcon:c4,LassoSelect:s4,LassoSelectIcon:s4,Laugh:l4,LaughIcon:l4,Layers:ti,Layers2:d4,Layers2Icon:d4,Layers3:h4,Layers3Icon:h4,LayersIcon:ti,Layout:Wn,LayoutDashboard:u4,LayoutDashboardIcon:u4,LayoutGrid:y4,LayoutGridIcon:y4,LayoutIcon:Wn,LayoutList:p4,LayoutListIcon:p4,LayoutPanelLeft:k4,LayoutPanelLeftIcon:k4,LayoutPanelTop:f4,LayoutPanelTopIcon:f4,LayoutTemplate:m4,LayoutTemplateIcon:m4,Leaf:g4,LeafIcon:g4,LeafyGreen:x4,LeafyGreenIcon:x4,Library:w4,LibraryBig:v4,LibraryBigIcon:v4,LibraryIcon:w4,LibrarySquare:M4,LibrarySquareIcon:M4,LifeBuoy:L4,LifeBuoyIcon:L4,Ligature:C4,LigatureIcon:C4,Lightbulb:S1,LightbulbIcon:S1,LightbulbOff:S4,LightbulbOffIcon:S4,LineChart:I4,LineChartIcon:I4,Link:P4,Link2:b4,Link2Icon:b4,Link2Off:j4,Link2OffIcon:j4,LinkIcon:P4,Linkedin:A4,LinkedinIcon:A4,List:Z4,ListChecks:z4,ListChecksIcon:z4,ListEnd:V4,ListEndIcon:V4,ListFilter:H4,ListFilterIcon:H4,ListIcon:Z4,ListMinus:T4,ListMinusIcon:T4,ListMusic:q4,ListMusicIcon:q4,ListOrdered:D4,ListOrderedIcon:D4,ListPlus:F4,ListPlusIcon:F4,ListRestart:R4,ListRestartIcon:R4,ListStart:B4,ListStartIcon:B4,ListTodo:N4,ListTodoIcon:N4,ListTree:E4,ListTreeIcon:E4,ListVideo:O4,ListVideoIcon:O4,ListX:U4,ListXIcon:U4,Loader:W4,Loader2:_4,Loader2Icon:_4,LoaderIcon:W4,Locate:X4,LocateFixed:G4,LocateFixedIcon:G4,LocateIcon:X4,LocateOff:$4,LocateOffIcon:$4,Lock:Q4,LockIcon:Q4,LockKeyhole:K4,LockKeyholeIcon:K4,LogIn:Y4,LogInIcon:Y4,LogOut:J4,LogOutIcon:J4,Lollipop:e5,LollipopIcon:e5,LucideAArrowDown:Cr,LucideAArrowUp:Sr,LucideALargeSmall:Ir,LucideAccessibility:jr,LucideActivity:Pr,LucideActivitySquare:br,LucideAirVent:Ar,LucideAirplay:zr,LucideAlarmCheck:hn,LucideAlarmClock:Hr,LucideAlarmClockCheck:hn,LucideAlarmClockMinus:un,LucideAlarmClockOff:Vr,LucideAlarmClockPlus:yn,LucideAlarmMinus:un,LucideAlarmPlus:yn,LucideAlarmSmoke:Tr,LucideAlbum:qr,LucideAlertCircle:la,LucideAlertOctagon:Dr,LucideAlertTriangle:Gt,LucideAlignCenter:Br,LucideAlignCenterHorizontal:Fr,LucideAlignCenterVertical:Rr,LucideAlignEndHorizontal:Nr,LucideAlignEndVertical:Er,LucideAlignHorizontalDistributeCenter:Or,LucideAlignHorizontalDistributeEnd:Ur,LucideAlignHorizontalDistributeStart:Zr,LucideAlignHorizontalJustifyCenter:_r,LucideAlignHorizontalJustifyEnd:Wr,LucideAlignHorizontalJustifyStart:Gr,LucideAlignHorizontalSpaceAround:$r,LucideAlignHorizontalSpaceBetween:Xr,LucideAlignJustify:Kr,LucideAlignLeft:Qr,LucideAlignRight:Yr,LucideAlignStartHorizontal:Jr,LucideAlignStartVertical:eo,LucideAlignVerticalDistributeCenter:to,LucideAlignVerticalDistributeEnd:no,LucideAlignVerticalDistributeStart:ao,LucideAlignVerticalJustifyCenter:io,LucideAlignVerticalJustifyEnd:ro,LucideAlignVerticalJustifyStart:oo,LucideAlignVerticalSpaceAround:so,LucideAlignVerticalSpaceBetween:co,LucideAmpersand:lo,LucideAmpersands:ho,LucideAnchor:uo,LucideAngry:yo,LucideAnnoyed:po,LucideAntenna:ko,LucideAnvil:fo,LucideAperture:mo,LucideAppWindow:go,LucideApple:xo,LucideArchive:wo,LucideArchiveRestore:vo,LucideArchiveX:Mo,LucideAreaChart:Lo,LucideArmchair:Co,LucideArrowBigDown:Io,LucideArrowBigDownDash:So,LucideArrowBigLeft:bo,LucideArrowBigLeftDash:jo,LucideArrowBigRight:Ao,LucideArrowBigRightDash:Po,LucideArrowBigUp:Vo,LucideArrowBigUpDash:zo,LucideArrowDown:$o,LucideArrowDown01:Ho,LucideArrowDown10:To,LucideArrowDownAZ:pn,LucideArrowDownAz:pn,LucideArrowDownCircle:qo,LucideArrowDownFromLine:Do,LucideArrowDownLeft:Bo,LucideArrowDownLeftFromCircle:Fo,LucideArrowDownLeftSquare:Ro,LucideArrowDownNarrowWide:No,LucideArrowDownRight:Uo,LucideArrowDownRightFromCircle:Eo,LucideArrowDownRightSquare:Oo,LucideArrowDownSquare:Zo,LucideArrowDownToDot:_o,LucideArrowDownToLine:Wo,LucideArrowDownUp:Go,LucideArrowDownWideNarrow:kn,LucideArrowDownZA:fn,LucideArrowDownZa:fn,LucideArrowLeft:e2,LucideArrowLeftCircle:Xo,LucideArrowLeftFromLine:Ko,LucideArrowLeftRight:Qo,LucideArrowLeftSquare:Yo,LucideArrowLeftToLine:Jo,LucideArrowRight:da,LucideArrowRightCircle:t2,LucideArrowRightFromLine:n2,LucideArrowRightLeft:a2,LucideArrowRightSquare:i2,LucideArrowRightToLine:r2,LucideArrowUp:M2,LucideArrowUp01:o2,LucideArrowUp10:s2,LucideArrowUpAZ:mn,LucideArrowUpAz:mn,LucideArrowUpCircle:c2,LucideArrowUpDown:l2,LucideArrowUpFromDot:d2,LucideArrowUpFromLine:h2,LucideArrowUpLeft:p2,LucideArrowUpLeftFromCircle:u2,LucideArrowUpLeftSquare:y2,LucideArrowUpNarrowWide:gn,LucideArrowUpRight:m2,LucideArrowUpRightFromCircle:k2,LucideArrowUpRightSquare:f2,LucideArrowUpSquare:g2,LucideArrowUpToLine:x2,LucideArrowUpWideNarrow:v2,LucideArrowUpZA:xn,LucideArrowUpZa:xn,LucideArrowsUpFromLine:w2,LucideAsterisk:L2,LucideAtSign:C2,LucideAtom:S2,LucideAudioLines:I2,LucideAudioWaveform:j2,LucideAward:b2,LucideAxe:P2,LucideAxis3D:vn,LucideAxis3d:vn,LucideBaby:dt,LucideBackpack:A2,LucideBadge:W2,LucideBadgeAlert:z2,LucideBadgeCent:V2,LucideBadgeCheck:Mn,LucideBadgeDollarSign:H2,LucideBadgeEuro:T2,LucideBadgeHelp:q2,LucideBadgeIndianRupee:D2,LucideBadgeInfo:F2,LucideBadgeJapaneseYen:R2,LucideBadgeMinus:B2,LucideBadgePercent:N2,LucideBadgePlus:E2,LucideBadgePoundSterling:O2,LucideBadgeRussianRuble:U2,LucideBadgeSwissFranc:Z2,LucideBadgeX:_2,LucideBaggageClaim:G2,LucideBan:$2,LucideBanana:X2,LucideBanknote:K2,LucideBarChart:as,LucideBarChart2:Q2,LucideBarChart3:Y2,LucideBarChart4:J2,LucideBarChartBig:es,LucideBarChartHorizontal:ns,LucideBarChartHorizontalBig:ts,LucideBarcode:is,LucideBaseline:rs,LucideBath:os,LucideBattery:us,LucideBatteryCharging:ss,LucideBatteryFull:cs,LucideBatteryLow:ls,LucideBatteryMedium:ds,LucideBatteryWarning:hs,LucideBeaker:ys,LucideBean:ks,LucideBeanOff:ps,LucideBed:gs,LucideBedDouble:fs,LucideBedSingle:ms,LucideBeef:xs,LucideBeer:vs,LucideBell:js,LucideBellDot:Ms,LucideBellElectric:ws,LucideBellMinus:Ls,LucideBellOff:Cs,LucideBellPlus:Ss,LucideBellRing:Is,LucideBike:bs,LucideBinary:Ps,LucideBiohazard:As,LucideBird:zs,LucideBitcoin:Vs,LucideBlinds:Hs,LucideBlocks:Ts,LucideBluetooth:Rs,LucideBluetoothConnected:qs,LucideBluetoothOff:Ds,LucideBluetoothSearching:Fs,LucideBold:Bs,LucideBomb:Ns,LucideBone:Es,LucideBook:lc,LucideBookA:Os,LucideBookAudio:Us,LucideBookCheck:Zs,LucideBookCopy:_s,LucideBookDashed:wn,LucideBookDown:Ws,LucideBookHeadphones:Gs,LucideBookHeart:$s,LucideBookImage:Xs,LucideBookKey:Ks,LucideBookLock:Qs,LucideBookMarked:Ys,LucideBookMinus:Js,LucideBookOpen:Ya,LucideBookOpenCheck:ec,LucideBookOpenText:tc,LucideBookPlus:nc,LucideBookTemplate:wn,LucideBookText:ac,LucideBookType:ic,LucideBookUp:oc,LucideBookUp2:rc,LucideBookUser:sc,LucideBookX:cc,LucideBookmark:pc,LucideBookmarkCheck:dc,LucideBookmarkMinus:hc,LucideBookmarkPlus:uc,LucideBookmarkX:yc,LucideBoomBox:kc,LucideBot:fc,LucideBox:gc,LucideBoxSelect:mc,LucideBoxes:xc,LucideBraces:Ln,LucideBrackets:vc,LucideBrain:Lc,LucideBrainCircuit:Mc,LucideBrainCog:wc,LucideBrickWall:Cc,LucideBriefcase:Sc,LucideBringToFront:Ic,LucideBrush:jc,LucideBug:Ac,LucideBugOff:bc,LucideBugPlay:Pc,LucideBuilding:Vc,LucideBuilding2:zc,LucideBus:Tc,LucideBusFront:Hc,LucideCable:Dc,LucideCableCar:qc,LucideCake:Rc,LucideCakeSlice:Fc,LucideCalculator:Bc,LucideCalendar:gt,LucideCalendarCheck:Ec,LucideCalendarCheck2:Nc,LucideCalendarClock:Oc,LucideCalendarDays:Uc,LucideCalendarHeart:Zc,LucideCalendarMinus:_c,LucideCalendarOff:Wc,LucideCalendarPlus:Gc,LucideCalendarRange:$c,LucideCalendarSearch:Xc,LucideCalendarX:Qc,LucideCalendarX2:Kc,LucideCamera:Jc,LucideCameraOff:Yc,LucideCandlestickChart:el,LucideCandy:al,LucideCandyCane:tl,LucideCandyOff:nl,LucideCar:ol,LucideCarFront:il,LucideCarTaxiFront:rl,LucideCaravan:sl,LucideCarrot:cl,LucideCaseLower:ll,LucideCaseSensitive:dl,LucideCaseUpper:hl,LucideCassetteTape:ul,LucideCast:yl,LucideCastle:pl,LucideCat:kl,LucideCctv:fl,LucideCheck:w1,LucideCheckCheck:ml,LucideCheckCircle:gl,LucideCheckCircle2:M1,LucideCheckSquare:vl,LucideCheckSquare2:xl,LucideChefHat:Ml,LucideCherry:wl,LucideChevronDown:ha,LucideChevronDownCircle:Ll,LucideChevronDownSquare:Cl,LucideChevronFirst:Sl,LucideChevronLast:Il,LucideChevronLeft:Pl,LucideChevronLeftCircle:jl,LucideChevronLeftSquare:bl,LucideChevronRight:Ja,LucideChevronRightCircle:Al,LucideChevronRightSquare:zl,LucideChevronUp:Tl,LucideChevronUpCircle:Vl,LucideChevronUpSquare:Hl,LucideChevronsDown:Dl,LucideChevronsDownUp:ql,LucideChevronsLeft:Rl,LucideChevronsLeftRight:Fl,LucideChevronsRight:Nl,LucideChevronsRightLeft:Bl,LucideChevronsUp:Ol,LucideChevronsUpDown:El,LucideChrome:Ul,LucideChurch:Zl,LucideCigarette:Wl,LucideCigaretteOff:_l,LucideCircle:t0,LucideCircleDashed:Gl,LucideCircleDollarSign:$l,LucideCircleDot:Kl,LucideCircleDotDashed:Xl,LucideCircleEllipsis:Ql,LucideCircleEqual:Yl,LucideCircleOff:Jl,LucideCircleSlash:e0,LucideCircleSlash2:Cn,LucideCircleSlashed:Cn,LucideCircleUser:In,LucideCircleUserRound:Sn,LucideCircuitBoard:n0,LucideCitrus:a0,LucideClapperboard:i0,LucideClipboard:y0,LucideClipboardCheck:r0,LucideClipboardCopy:o0,LucideClipboardEdit:s0,LucideClipboardList:c0,LucideClipboardPaste:l0,LucideClipboardSignature:d0,LucideClipboardType:h0,LucideClipboardX:u0,LucideClock:ua,LucideClock1:p0,LucideClock10:k0,LucideClock11:f0,LucideClock12:m0,LucideClock2:g0,LucideClock3:x0,LucideClock4:v0,LucideClock5:M0,LucideClock6:w0,LucideClock7:L0,LucideClock8:C0,LucideClock9:S0,LucideCloud:B0,LucideCloudCog:I0,LucideCloudDrizzle:j0,LucideCloudFog:b0,LucideCloudHail:P0,LucideCloudLightning:A0,LucideCloudMoon:V0,LucideCloudMoonRain:z0,LucideCloudOff:H0,LucideCloudRain:q0,LucideCloudRainWind:T0,LucideCloudSnow:D0,LucideCloudSun:R0,LucideCloudSunRain:F0,LucideCloudy:N0,LucideClover:E0,LucideClub:O0,LucideCode:Z0,LucideCode2:U0,LucideCodepen:_0,LucideCodesandbox:W0,LucideCoffee:G0,LucideCog:$0,LucideCoins:X0,LucideColumns:jn,LucideColumns2:jn,LucideColumns3:bn,LucideColumns4:K0,LucideCombine:Q0,LucideCommand:Y0,LucideCompass:J0,LucideComponent:ed,LucideComputer:td,LucideConciergeBell:nd,LucideCone:ad,LucideConstruction:id,LucideContact:od,LucideContact2:rd,LucideContainer:sd,LucideContrast:cd,LucideCookie:ld,LucideCookingPot:dd,LucideCopy:fd,LucideCopyCheck:hd,LucideCopyMinus:ud,LucideCopyPlus:yd,LucideCopySlash:pd,LucideCopyX:kd,LucideCopyleft:md,LucideCopyright:gd,LucideCornerDownLeft:xd,LucideCornerDownRight:vd,LucideCornerLeftDown:Md,LucideCornerLeftUp:wd,LucideCornerRightDown:Ld,LucideCornerRightUp:Cd,LucideCornerUpLeft:Sd,LucideCornerUpRight:Id,LucideCpu:jd,LucideCreativeCommons:bd,LucideCreditCard:Pd,LucideCroissant:Ad,LucideCrop:zd,LucideCross:Vd,LucideCrosshair:Hd,LucideCrown:Td,LucideCuboid:qd,LucideCupSoda:Dd,LucideCurlyBraces:Ln,LucideCurrency:Fd,LucideCylinder:Rd,LucideDatabase:Ed,LucideDatabaseBackup:Bd,LucideDatabaseZap:Nd,LucideDelete:Od,LucideDessert:Ud,LucideDiameter:Zd,LucideDiamond:_d,LucideDice1:Wd,LucideDice2:Gd,LucideDice3:$d,LucideDice4:Xd,LucideDice5:Kd,LucideDice6:Qd,LucideDices:Yd,LucideDiff:Jd,LucideDisc:ah,LucideDisc2:eh,LucideDisc3:th,LucideDiscAlbum:nh,LucideDivide:oh,LucideDivideCircle:ih,LucideDivideSquare:rh,LucideDna:ch,LucideDnaOff:sh,LucideDog:lh,LucideDollarSign:dh,LucideDonut:hh,LucideDoorClosed:uh,LucideDoorOpen:yh,LucideDot:ei,LucideDownload:kh,LucideDownloadCloud:ph,LucideDraftingCompass:fh,LucideDrama:mh,LucideDribbble:gh,LucideDroplet:xh,LucideDroplets:vh,LucideDrum:Mh,LucideDrumstick:wh,LucideDumbbell:Lh,LucideEar:Sh,LucideEarOff:Ch,LucideEdit:Xe,LucideEdit2:$n,LucideEdit3:Gn,LucideEgg:bh,LucideEggFried:Ih,LucideEggOff:jh,LucideEqual:Ah,LucideEqualNot:Ph,LucideEraser:zh,LucideEuro:Vh,LucideExpand:Hh,LucideExternalLink:Th,LucideEye:Dh,LucideEyeOff:qh,LucideFacebook:Fh,LucideFactory:Rh,LucideFan:Bh,LucideFastForward:Nh,LucideFeather:Eh,LucideFence:Oh,LucideFerrisWheel:Uh,LucideFigma:Zh,LucideFile:_u,LucideFileArchive:_h,LucideFileAudio:Gh,LucideFileAudio2:Wh,LucideFileAxis3D:Pn,LucideFileAxis3d:Pn,LucideFileBadge:Xh,LucideFileBadge2:$h,LucideFileBarChart:Qh,LucideFileBarChart2:Kh,LucideFileBox:Yh,LucideFileCheck:eu,LucideFileCheck2:Jh,LucideFileClock:tu,LucideFileCode:au,LucideFileCode2:nu,LucideFileCog:An,LucideFileCog2:An,LucideFileDiff:iu,LucideFileDigit:ru,LucideFileDown:ou,LucideFileEdit:su,LucideFileHeart:cu,LucideFileImage:lu,LucideFileInput:du,LucideFileJson:uu,LucideFileJson2:hu,LucideFileKey:pu,LucideFileKey2:yu,LucideFileLineChart:ku,LucideFileLock:mu,LucideFileLock2:fu,LucideFileMinus:xu,LucideFileMinus2:gu,LucideFileMusic:vu,LucideFileOutput:Mu,LucideFilePieChart:wu,LucideFilePlus:Cu,LucideFilePlus2:Lu,LucideFileQuestion:Su,LucideFileScan:Iu,LucideFileSearch:bu,LucideFileSearch2:ju,LucideFileSignature:Pu,LucideFileSpreadsheet:Au,LucideFileStack:zu,LucideFileSymlink:Vu,LucideFileTerminal:Hu,LucideFileText:Tu,LucideFileType:Du,LucideFileType2:qu,LucideFileUp:Fu,LucideFileVideo:Bu,LucideFileVideo2:Ru,LucideFileVolume:Eu,LucideFileVolume2:Nu,LucideFileWarning:Ou,LucideFileX:Zu,LucideFileX2:Uu,LucideFiles:Wu,LucideFilm:Gu,LucideFilter:ya,LucideFilterX:$u,LucideFingerprint:Xu,LucideFireExtinguisher:Ku,LucideFish:Ju,LucideFishOff:Qu,LucideFishSymbol:Yu,LucideFlag:ay,LucideFlagOff:ey,LucideFlagTriangleLeft:ty,LucideFlagTriangleRight:ny,LucideFlame:ry,LucideFlameKindling:iy,LucideFlashlight:sy,LucideFlashlightOff:oy,LucideFlaskConical:ly,LucideFlaskConicalOff:cy,LucideFlaskRound:dy,LucideFlipHorizontal:uy,LucideFlipHorizontal2:hy,LucideFlipVertical:py,LucideFlipVertical2:yy,LucideFlower:fy,LucideFlower2:ky,LucideFocus:my,LucideFoldHorizontal:gy,LucideFoldVertical:xy,LucideFolder:Gy,LucideFolderArchive:vy,LucideFolderCheck:My,LucideFolderClock:wy,LucideFolderClosed:Ly,LucideFolderCog:zn,LucideFolderCog2:zn,LucideFolderDot:Cy,LucideFolderDown:Sy,LucideFolderEdit:Iy,LucideFolderGit:by,LucideFolderGit2:jy,LucideFolderHeart:Py,LucideFolderInput:Ay,LucideFolderKanban:zy,LucideFolderKey:Vy,LucideFolderLock:Hy,LucideFolderMinus:Ty,LucideFolderOpen:Dy,LucideFolderOpenDot:qy,LucideFolderOutput:Fy,LucideFolderPlus:Ry,LucideFolderRoot:By,LucideFolderSearch:Ey,LucideFolderSearch2:Ny,LucideFolderSymlink:Oy,LucideFolderSync:Uy,LucideFolderTree:Zy,LucideFolderUp:_y,LucideFolderX:Wy,LucideFolders:$y,LucideFootprints:Xy,LucideForklift:Ky,LucideFormInput:Qy,LucideForward:Yy,LucideFrame:Jy,LucideFramer:ep,LucideFrown:tp,LucideFuel:np,LucideFullscreen:ap,LucideFunctionSquare:ip,LucideGalleryHorizontal:op,LucideGalleryHorizontalEnd:rp,LucideGalleryThumbnails:sp,LucideGalleryVertical:lp,LucideGalleryVerticalEnd:cp,LucideGamepad:hp,LucideGamepad2:dp,LucideGanttChart:up,LucideGanttChartSquare:Vn,LucideGauge:pp,LucideGaugeCircle:yp,LucideGavel:kp,LucideGem:fp,LucideGhost:mp,LucideGift:gp,LucideGitBranch:vp,LucideGitBranchPlus:xp,LucideGitCommit:Hn,LucideGitCommitHorizontal:Hn,LucideGitCommitVertical:Mp,LucideGitCompare:Lp,LucideGitCompareArrows:wp,LucideGitFork:Cp,LucideGitGraph:Sp,LucideGitMerge:Ip,LucideGitPullRequest:Vp,LucideGitPullRequestArrow:jp,LucideGitPullRequestClosed:bp,LucideGitPullRequestCreate:Ap,LucideGitPullRequestCreateArrow:Pp,LucideGitPullRequestDraft:zp,LucideGithub:Hp,LucideGitlab:Tp,LucideGlassWater:qp,LucideGlasses:Dp,LucideGlobe:Rp,LucideGlobe2:Fp,LucideGoal:Bp,LucideGrab:Np,LucideGraduationCap:Ep,LucideGrape:Op,LucideGrid:rt,LucideGrid2X2:Tn,LucideGrid2x2:Tn,LucideGrid3X3:rt,LucideGrid3x3:rt,LucideGrip:_p,LucideGripHorizontal:Up,LucideGripVertical:Zp,LucideGroup:Wp,LucideGuitar:Gp,LucideHammer:$p,LucideHand:L1,LucideHandMetal:Xp,LucideHardDrive:Yp,LucideHardDriveDownload:Kp,LucideHardDriveUpload:Qp,LucideHardHat:Jp,LucideHash:ek,LucideHaze:tk,LucideHdmiPort:nk,LucideHeading:lk,LucideHeading1:ak,LucideHeading2:ik,LucideHeading3:rk,LucideHeading4:ok,LucideHeading5:sk,LucideHeading6:ck,LucideHeadphones:dk,LucideHeart:Rt,LucideHeartCrack:hk,LucideHeartHandshake:uk,LucideHeartOff:yk,LucideHeartPulse:pk,LucideHelpCircle:kk,LucideHelpingHand:fk,LucideHexagon:mk,LucideHighlighter:gk,LucideHistory:xk,LucideHome:C1,LucideHop:Mk,LucideHopOff:vk,LucideHotel:wk,LucideHourglass:Lk,LucideIceCream:Sk,LucideIceCream2:Ck,LucideImage:Ak,LucideImageDown:Ik,LucideImageMinus:jk,LucideImageOff:bk,LucideImagePlus:Pk,LucideImport:zk,LucideInbox:Vk,LucideIndent:Hk,LucideIndianRupee:Tk,LucideInfinity:qk,LucideInfo:Dk,LucideInspect:Fn,LucideInspectionPanel:Fk,LucideInstagram:Rk,LucideItalic:Bk,LucideIterationCcw:Nk,LucideIterationCw:Ek,LucideJapaneseYen:Ok,LucideJoystick:Uk,LucideKanban:Zk,LucideKanbanSquare:Dn,LucideKanbanSquareDashed:qn,LucideKey:Gk,LucideKeyRound:_k,LucideKeySquare:Wk,LucideKeyboard:Xk,LucideKeyboardMusic:$k,LucideLamp:t4,LucideLampCeiling:Kk,LucideLampDesk:Qk,LucideLampFloor:Yk,LucideLampWallDown:Jk,LucideLampWallUp:e4,LucideLandPlot:n4,LucideLandmark:a4,LucideLanguages:i4,LucideLaptop:o4,LucideLaptop2:r4,LucideLasso:c4,LucideLassoSelect:s4,LucideLaugh:l4,LucideLayers:ti,LucideLayers2:d4,LucideLayers3:h4,LucideLayout:Wn,LucideLayoutDashboard:u4,LucideLayoutGrid:y4,LucideLayoutList:p4,LucideLayoutPanelLeft:k4,LucideLayoutPanelTop:f4,LucideLayoutTemplate:m4,LucideLeaf:g4,LucideLeafyGreen:x4,LucideLibrary:w4,LucideLibraryBig:v4,LucideLibrarySquare:M4,LucideLifeBuoy:L4,LucideLigature:C4,LucideLightbulb:S1,LucideLightbulbOff:S4,LucideLineChart:I4,LucideLink:P4,LucideLink2:b4,LucideLink2Off:j4,LucideLinkedin:A4,LucideList:Z4,LucideListChecks:z4,LucideListEnd:V4,LucideListFilter:H4,LucideListMinus:T4,LucideListMusic:q4,LucideListOrdered:D4,LucideListPlus:F4,LucideListRestart:R4,LucideListStart:B4,LucideListTodo:N4,LucideListTree:E4,LucideListVideo:O4,LucideListX:U4,LucideLoader:W4,LucideLoader2:_4,LucideLocate:X4,LucideLocateFixed:G4,LucideLocateOff:$4,LucideLock:Q4,LucideLockKeyhole:K4,LucideLogIn:Y4,LucideLogOut:J4,LucideLollipop:e5,LucideLuggage:t5,LucideMSquare:n5,LucideMagnet:a5,LucideMail:u5,LucideMailCheck:i5,LucideMailMinus:r5,LucideMailOpen:o5,LucideMailPlus:s5,LucideMailQuestion:c5,LucideMailSearch:l5,LucideMailWarning:d5,LucideMailX:h5,LucideMailbox:y5,LucideMails:p5,LucideMap:g5,LucideMapPin:f5,LucideMapPinOff:k5,LucideMapPinned:m5,LucideMartini:x5,LucideMaximize:M5,LucideMaximize2:v5,LucideMedal:w5,LucideMegaphone:C5,LucideMegaphoneOff:L5,LucideMeh:S5,LucideMemoryStick:I5,LucideMenu:ni,LucideMenuSquare:j5,LucideMerge:b5,LucideMessageCircle:B5,LucideMessageCircleCode:P5,LucideMessageCircleDashed:A5,LucideMessageCircleHeart:z5,LucideMessageCircleMore:V5,LucideMessageCircleOff:H5,LucideMessageCirclePlus:T5,LucideMessageCircleQuestion:q5,LucideMessageCircleReply:D5,LucideMessageCircleWarning:F5,LucideMessageCircleX:R5,LucideMessageSquare:ef,LucideMessageSquareCode:N5,LucideMessageSquareDashed:E5,LucideMessageSquareDiff:O5,LucideMessageSquareDot:U5,LucideMessageSquareHeart:Z5,LucideMessageSquareMore:_5,LucideMessageSquareOff:W5,LucideMessageSquarePlus:G5,LucideMessageSquareQuote:$5,LucideMessageSquareReply:X5,LucideMessageSquareShare:K5,LucideMessageSquareText:Q5,LucideMessageSquareWarning:Y5,LucideMessageSquareX:J5,LucideMessagesSquare:tf,LucideMic:rf,LucideMic2:nf,LucideMicOff:af,LucideMicroscope:of,LucideMicrowave:sf,LucideMilestone:cf,LucideMilk:df,LucideMilkOff:lf,LucideMinimize:uf,LucideMinimize2:hf,LucideMinus:kf,LucideMinusCircle:yf,LucideMinusSquare:pf,LucideMonitor:jf,LucideMonitorCheck:ff,LucideMonitorDot:mf,LucideMonitorDown:gf,LucideMonitorOff:xf,LucideMonitorPause:vf,LucideMonitorPlay:Mf,LucideMonitorSmartphone:wf,LucideMonitorSpeaker:Lf,LucideMonitorStop:Cf,LucideMonitorUp:Sf,LucideMonitorX:If,LucideMoon:Pf,LucideMoonStar:bf,LucideMoreHorizontal:Af,LucideMoreVertical:zf,LucideMountain:Hf,LucideMountainSnow:Vf,LucideMouse:Rf,LucideMousePointer:Ff,LucideMousePointer2:Tf,LucideMousePointerClick:qf,LucideMousePointerSquare:Fn,LucideMousePointerSquareDashed:Df,LucideMove:Qf,LucideMove3D:Rn,LucideMove3d:Rn,LucideMoveDiagonal:Nf,LucideMoveDiagonal2:Bf,LucideMoveDown:Uf,LucideMoveDownLeft:Ef,LucideMoveDownRight:Of,LucideMoveHorizontal:Zf,LucideMoveLeft:_f,LucideMoveRight:Wf,LucideMoveUp:Xf,LucideMoveUpLeft:Gf,LucideMoveUpRight:$f,LucideMoveVertical:Kf,LucideMusic:tm,LucideMusic2:Yf,LucideMusic3:Jf,LucideMusic4:em,LucideNavigation:rm,LucideNavigation2:am,LucideNavigation2Off:nm,LucideNavigationOff:im,LucideNetwork:om,LucideNewspaper:sm,LucideNfc:cm,LucideNut:dm,LucideNutOff:lm,LucideOctagon:hm,LucideOption:um,LucideOrbit:ym,LucideOutdent:pm,LucidePackage:wm,LucidePackage2:km,LucidePackageCheck:fm,LucidePackageMinus:mm,LucidePackageOpen:gm,LucidePackagePlus:xm,LucidePackageSearch:vm,LucidePackageX:Mm,LucidePaintBucket:Lm,LucidePaintbrush:Sm,LucidePaintbrush2:Cm,LucidePalette:Im,LucidePalmtree:jm,LucidePanelBottom:Am,LucidePanelBottomClose:bm,LucidePanelBottomDashed:Bn,LucidePanelBottomInactive:Bn,LucidePanelBottomOpen:Pm,LucidePanelLeft:Un,LucidePanelLeftClose:Nn,LucidePanelLeftDashed:En,LucidePanelLeftInactive:En,LucidePanelLeftOpen:On,LucidePanelRight:Hm,LucidePanelRightClose:zm,LucidePanelRightDashed:Zn,LucidePanelRightInactive:Zn,LucidePanelRightOpen:Vm,LucidePanelTop:Dm,LucidePanelTopClose:Tm,LucidePanelTopDashed:_n,LucidePanelTopInactive:_n,LucidePanelTopOpen:qm,LucidePanelsLeftBottom:Fm,LucidePanelsLeftRight:bn,LucidePanelsRightBottom:Rm,LucidePanelsTopBottom:Qn,LucidePanelsTopLeft:Wn,LucidePaperclip:Bm,LucideParentheses:Nm,LucideParkingCircle:Om,LucideParkingCircleOff:Em,LucideParkingMeter:Um,LucideParkingSquare:_m,LucideParkingSquareOff:Zm,LucidePartyPopper:Wm,LucidePause:Xm,LucidePauseCircle:Gm,LucidePauseOctagon:$m,LucidePawPrint:Km,LucidePcCase:Qm,LucidePen:$n,LucidePenBox:Xe,LucidePenLine:Gn,LucidePenSquare:Xe,LucidePenTool:Ym,LucidePencil:t3,LucidePencilLine:Jm,LucidePencilRuler:e3,LucidePentagon:n3,LucidePercent:o3,LucidePercentCircle:a3,LucidePercentDiamond:i3,LucidePercentSquare:r3,LucidePersonStanding:s3,LucidePhone:p3,LucidePhoneCall:c3,LucidePhoneForwarded:l3,LucidePhoneIncoming:d3,LucidePhoneMissed:h3,LucidePhoneOff:u3,LucidePhoneOutgoing:y3,LucidePi:f3,LucidePiSquare:k3,LucidePiano:m3,LucidePictureInPicture:x3,LucidePictureInPicture2:g3,LucidePieChart:v3,LucidePiggyBank:M3,LucidePilcrow:L3,LucidePilcrowSquare:w3,LucidePill:C3,LucidePin:I3,LucidePinOff:S3,LucidePipette:j3,LucidePizza:b3,LucidePlane:z3,LucidePlaneLanding:P3,LucidePlaneTakeoff:A3,LucidePlay:H3,LucidePlayCircle:ai,LucidePlaySquare:V3,LucidePlug:F3,LucidePlug2:T3,LucidePlugZap:D3,LucidePlugZap2:q3,LucidePlus:B3,LucidePlusCircle:ii,LucidePlusSquare:R3,LucidePocket:E3,LucidePocketKnife:N3,LucidePodcast:O3,LucidePointer:Z3,LucidePointerOff:U3,LucidePopcorn:_3,LucidePopsicle:W3,LucidePoundSterling:G3,LucidePower:Q3,LucidePowerCircle:$3,LucidePowerOff:X3,LucidePowerSquare:K3,LucidePresentation:Y3,LucidePrinter:J3,LucideProjector:e6,LucidePuzzle:t6,LucidePyramid:n6,LucideQrCode:a6,LucideQuote:i6,LucideRabbit:r6,LucideRadar:o6,LucideRadiation:s6,LucideRadio:d6,LucideRadioReceiver:c6,LucideRadioTower:l6,LucideRadius:h6,LucideRailSymbol:u6,LucideRainbow:y6,LucideRat:p6,LucideRatio:k6,LucideReceipt:f6,LucideRectangleHorizontal:m6,LucideRectangleVertical:g6,LucideRecycle:x6,LucideRedo:w6,LucideRedo2:v6,LucideRedoDot:M6,LucideRefreshCcw:C6,LucideRefreshCcwDot:L6,LucideRefreshCw:I6,LucideRefreshCwOff:S6,LucideRefrigerator:j6,LucideRegex:b6,LucideRemoveFormatting:P6,LucideRepeat:V6,LucideRepeat1:A6,LucideRepeat2:z6,LucideReplace:T6,LucideReplaceAll:H6,LucideReply:D6,LucideReplyAll:q6,LucideRewind:F6,LucideRibbon:R6,LucideRocket:B6,LucideRockingChair:N6,LucideRollerCoaster:E6,LucideRotate3D:Xn,LucideRotate3d:Xn,LucideRotateCcw:O6,LucideRotateCw:U6,LucideRoute:_6,LucideRouteOff:Z6,LucideRouter:W6,LucideRows:Kn,LucideRows2:Kn,LucideRows3:Qn,LucideRows4:G6,LucideRss:$6,LucideRuler:X6,LucideRussianRuble:K6,LucideSailboat:Q6,LucideSalad:Y6,LucideSandwich:J6,LucideSatellite:t8,LucideSatelliteDish:e8,LucideSave:a8,LucideSaveAll:n8,LucideScale:i8,LucideScale3D:Yn,LucideScale3d:Yn,LucideScaling:r8,LucideScan:u8,LucideScanBarcode:o8,LucideScanEye:s8,LucideScanFace:c8,LucideScanLine:l8,LucideScanSearch:d8,LucideScanText:h8,LucideScatterChart:y8,LucideSchool:k8,LucideSchool2:p8,LucideScissors:x8,LucideScissorsLineDashed:f8,LucideScissorsSquare:g8,LucideScissorsSquareDashedBottom:m8,LucideScreenShare:M8,LucideScreenShareOff:v8,LucideScroll:L8,LucideScrollText:w8,LucideSearch:b8,LucideSearchCheck:C8,LucideSearchCode:S8,LucideSearchSlash:I8,LucideSearchX:j8,LucideSend:A8,LucideSendHorizonal:Jn,LucideSendHorizontal:Jn,LucideSendToBack:P8,LucideSeparatorHorizontal:z8,LucideSeparatorVertical:V8,LucideServer:D8,LucideServerCog:H8,LucideServerCrash:T8,LucideServerOff:q8,LucideSettings:R8,LucideSettings2:F8,LucideShapes:B8,LucideShare:N8,LucideShare2:ri,LucideSheet:E8,LucideShell:O8,LucideShield:pa,LucideShieldAlert:I1,LucideShieldBan:U8,LucideShieldCheck:Z8,LucideShieldClose:e1,LucideShieldEllipsis:_8,LucideShieldHalf:W8,LucideShieldMinus:G8,LucideShieldOff:$8,LucideShieldPlus:X8,LucideShieldQuestion:K8,LucideShieldX:e1,LucideShip:Y8,LucideShipWheel:Q8,LucideShirt:J8,LucideShoppingBag:eg,LucideShoppingBasket:tg,LucideShoppingCart:ng,LucideShovel:ag,LucideShowerHead:ig,LucideShrink:rg,LucideShrub:og,LucideShuffle:sg,LucideSidebar:Un,LucideSidebarClose:Nn,LucideSidebarOpen:On,LucideSigma:lg,LucideSigmaSquare:cg,LucideSignal:pg,LucideSignalHigh:dg,LucideSignalLow:hg,LucideSignalMedium:ug,LucideSignalZero:yg,LucideSignpost:fg,LucideSignpostBig:kg,LucideSiren:mg,LucideSkipBack:gg,LucideSkipForward:xg,LucideSkull:vg,LucideSlack:Mg,LucideSlash:wg,LucideSlice:Lg,LucideSliders:Sg,LucideSlidersHorizontal:Cg,LucideSmartphone:bg,LucideSmartphoneCharging:Ig,LucideSmartphoneNfc:jg,LucideSmile:Ag,LucideSmilePlus:Pg,LucideSnail:zg,LucideSnowflake:Vg,LucideSofa:Hg,LucideSortAsc:gn,LucideSortDesc:kn,LucideSoup:Tg,LucideSpace:qg,LucideSpade:Dg,LucideSparkle:Fg,LucideSparkles:Vt,LucideSpeaker:Rg,LucideSpeech:Bg,LucideSpellCheck:Eg,LucideSpellCheck2:Ng,LucideSpline:Og,LucideSplit:_g,LucideSplitSquareHorizontal:Ug,LucideSplitSquareVertical:Zg,LucideSprayCan:Wg,LucideSprout:Gg,LucideSquare:n7,LucideSquareAsterisk:$g,LucideSquareCode:Xg,LucideSquareDashedBottom:Qg,LucideSquareDashedBottomCode:Kg,LucideSquareDot:Yg,LucideSquareEqual:Jg,LucideSquareGantt:Vn,LucideSquareKanban:Dn,LucideSquareKanbanDashed:qn,LucideSquareSlash:e7,LucideSquareStack:t7,LucideSquareUser:n1,LucideSquareUserRound:t1,LucideSquircle:a7,LucideSquirrel:i7,LucideStamp:r7,LucideStar:c7,LucideStarHalf:o7,LucideStarOff:s7,LucideStars:Vt,LucideStepBack:l7,LucideStepForward:d7,LucideStethoscope:oi,LucideSticker:h7,LucideStickyNote:u7,LucideStopCircle:y7,LucideStore:p7,LucideStretchHorizontal:k7,LucideStretchVertical:f7,LucideStrikethrough:m7,LucideSubscript:g7,LucideSubtitles:x7,LucideSun:C7,LucideSunDim:v7,LucideSunMedium:M7,LucideSunMoon:w7,LucideSunSnow:L7,LucideSunrise:S7,LucideSunset:I7,LucideSuperscript:j7,LucideSwissFranc:b7,LucideSwitchCamera:P7,LucideSword:A7,LucideSwords:z7,LucideSyringe:$t,LucideTable:T7,LucideTable2:V7,LucideTableProperties:H7,LucideTablet:D7,LucideTabletSmartphone:q7,LucideTablets:F7,LucideTag:R7,LucideTags:B7,LucideTally1:N7,LucideTally2:E7,LucideTally3:O7,LucideTally4:U7,LucideTally5:Z7,LucideTangent:_7,LucideTarget:W7,LucideTent:$7,LucideTentTree:G7,LucideTerminal:K7,LucideTerminalSquare:X7,LucideTestTube:ka,LucideTestTube2:Q7,LucideTestTubes:Y7,LucideText:nx,LucideTextCursor:ex,LucideTextCursorInput:J7,LucideTextQuote:tx,LucideTextSelect:a1,LucideTextSelection:a1,LucideTheater:ax,LucideThermometer:ox,LucideThermometerSnowflake:ix,LucideThermometerSun:rx,LucideThumbsDown:sx,LucideThumbsUp:cx,LucideTicket:lx,LucideTimer:ux,LucideTimerOff:dx,LucideTimerReset:hx,LucideToggleLeft:yx,LucideToggleRight:px,LucideTornado:kx,LucideTorus:fx,LucideTouchpad:gx,LucideTouchpadOff:mx,LucideTowerControl:xx,LucideToyBrick:vx,LucideTractor:Mx,LucideTrafficCone:wx,LucideTrain:i1,LucideTrainFront:Cx,LucideTrainFrontTunnel:Lx,LucideTrainTrack:Sx,LucideTramFront:i1,LucideTrash:Ix,LucideTrash2:si,LucideTreeDeciduous:jx,LucideTreePine:bx,LucideTrees:Px,LucideTrello:Ax,LucideTrendingDown:zx,LucideTrendingUp:ci,LucideTriangle:Hx,LucideTriangleRight:Vx,LucideTrophy:Tx,LucideTruck:qx,LucideTurtle:Dx,LucideTv:Rx,LucideTv2:Fx,LucideTwitch:Bx,LucideTwitter:Nx,LucideType:Ex,LucideUmbrella:Ux,LucideUmbrellaOff:Ox,LucideUnderline:Zx,LucideUndo:Gx,LucideUndo2:_x,LucideUndoDot:Wx,LucideUnfoldHorizontal:$x,LucideUnfoldVertical:Xx,LucideUngroup:Kx,LucideUnlink:Yx,LucideUnlink2:Qx,LucideUnlock:ev,LucideUnlockKeyhole:Jx,LucideUnplug:tv,LucideUpload:av,LucideUploadCloud:nv,LucideUsb:iv,LucideUser:uv,LucideUser2:d1,LucideUserCheck:rv,LucideUserCheck2:r1,LucideUserCircle:In,LucideUserCircle2:Sn,LucideUserCog:ov,LucideUserCog2:o1,LucideUserMinus:sv,LucideUserMinus2:s1,LucideUserPlus:cv,LucideUserPlus2:c1,LucideUserRound:d1,LucideUserRoundCheck:r1,LucideUserRoundCog:o1,LucideUserRoundMinus:s1,LucideUserRoundPlus:c1,LucideUserRoundSearch:lv,LucideUserRoundX:l1,LucideUserSearch:dv,LucideUserSquare:n1,LucideUserSquare2:t1,LucideUserX:hv,LucideUserX2:l1,LucideUsers:yv,LucideUsers2:h1,LucideUsersRound:h1,LucideUtensils:li,LucideUtensilsCrossed:j1,LucideUtilityPole:pv,LucideVariable:kv,LucideVegan:fv,LucideVenetianMask:mv,LucideVerified:Mn,LucideVibrate:xv,LucideVibrateOff:gv,LucideVideo:Mv,LucideVideoOff:vv,LucideVideotape:wv,LucideView:Lv,LucideVoicemail:Cv,LucideVolume:bv,LucideVolume1:Sv,LucideVolume2:Iv,LucideVolumeX:jv,LucideVote:Pv,LucideWallet:Vv,LucideWallet2:Av,LucideWalletCards:zv,LucideWallpaper:Hv,LucideWand:qv,LucideWand2:Tv,LucideWarehouse:Dv,LucideWatch:Fv,LucideWaves:Rv,LucideWaypoints:Bv,LucideWebcam:Nv,LucideWebhook:Ev,LucideWeight:Ov,LucideWheat:Zv,LucideWheatOff:Uv,LucideWholeWord:_v,LucideWifi:Gv,LucideWifiOff:Wv,LucideWind:$v,LucideWine:Kv,LucideWineOff:Xv,LucideWorkflow:Qv,LucideWrapText:Yv,LucideWrench:Jv,LucideX:tt,LucideXCircle:eM,LucideXOctagon:tM,LucideXSquare:nM,LucideYoutube:aM,LucideZap:rM,LucideZapOff:iM,LucideZoomIn:oM,LucideZoomOut:sM,Luggage:t5,LuggageIcon:t5,MSquare:n5,MSquareIcon:n5,Magnet:a5,MagnetIcon:a5,Mail:u5,MailCheck:i5,MailCheckIcon:i5,MailIcon:u5,MailMinus:r5,MailMinusIcon:r5,MailOpen:o5,MailOpenIcon:o5,MailPlus:s5,MailPlusIcon:s5,MailQuestion:c5,MailQuestionIcon:c5,MailSearch:l5,MailSearchIcon:l5,MailWarning:d5,MailWarningIcon:d5,MailX:h5,MailXIcon:h5,Mailbox:y5,MailboxIcon:y5,Mails:p5,MailsIcon:p5,Map:g5,MapIcon:g5,MapPin:f5,MapPinIcon:f5,MapPinOff:k5,MapPinOffIcon:k5,MapPinned:m5,MapPinnedIcon:m5,Martini:x5,MartiniIcon:x5,Maximize:M5,Maximize2:v5,Maximize2Icon:v5,MaximizeIcon:M5,Medal:w5,MedalIcon:w5,Megaphone:C5,MegaphoneIcon:C5,MegaphoneOff:L5,MegaphoneOffIcon:L5,Meh:S5,MehIcon:S5,MemoryStick:I5,MemoryStickIcon:I5,Menu:ni,MenuIcon:ni,MenuSquare:j5,MenuSquareIcon:j5,Merge:b5,MergeIcon:b5,MessageCircle:B5,MessageCircleCode:P5,MessageCircleCodeIcon:P5,MessageCircleDashed:A5,MessageCircleDashedIcon:A5,MessageCircleHeart:z5,MessageCircleHeartIcon:z5,MessageCircleIcon:B5,MessageCircleMore:V5,MessageCircleMoreIcon:V5,MessageCircleOff:H5,MessageCircleOffIcon:H5,MessageCirclePlus:T5,MessageCirclePlusIcon:T5,MessageCircleQuestion:q5,MessageCircleQuestionIcon:q5,MessageCircleReply:D5,MessageCircleReplyIcon:D5,MessageCircleWarning:F5,MessageCircleWarningIcon:F5,MessageCircleX:R5,MessageCircleXIcon:R5,MessageSquare:ef,MessageSquareCode:N5,MessageSquareCodeIcon:N5,MessageSquareDashed:E5,MessageSquareDashedIcon:E5,MessageSquareDiff:O5,MessageSquareDiffIcon:O5,MessageSquareDot:U5,MessageSquareDotIcon:U5,MessageSquareHeart:Z5,MessageSquareHeartIcon:Z5,MessageSquareIcon:ef,MessageSquareMore:_5,MessageSquareMoreIcon:_5,MessageSquareOff:W5,MessageSquareOffIcon:W5,MessageSquarePlus:G5,MessageSquarePlusIcon:G5,MessageSquareQuote:$5,MessageSquareQuoteIcon:$5,MessageSquareReply:X5,MessageSquareReplyIcon:X5,MessageSquareShare:K5,MessageSquareShareIcon:K5,MessageSquareText:Q5,MessageSquareTextIcon:Q5,MessageSquareWarning:Y5,MessageSquareWarningIcon:Y5,MessageSquareX:J5,MessageSquareXIcon:J5,MessagesSquare:tf,MessagesSquareIcon:tf,Mic:rf,Mic2:nf,Mic2Icon:nf,MicIcon:rf,MicOff:af,MicOffIcon:af,Microscope:of,MicroscopeIcon:of,Microwave:sf,MicrowaveIcon:sf,Milestone:cf,MilestoneIcon:cf,Milk:df,MilkIcon:df,MilkOff:lf,MilkOffIcon:lf,Minimize:uf,Minimize2:hf,Minimize2Icon:hf,MinimizeIcon:uf,Minus:kf,MinusCircle:yf,MinusCircleIcon:yf,MinusIcon:kf,MinusSquare:pf,MinusSquareIcon:pf,Monitor:jf,MonitorCheck:ff,MonitorCheckIcon:ff,MonitorDot:mf,MonitorDotIcon:mf,MonitorDown:gf,MonitorDownIcon:gf,MonitorIcon:jf,MonitorOff:xf,MonitorOffIcon:xf,MonitorPause:vf,MonitorPauseIcon:vf,MonitorPlay:Mf,MonitorPlayIcon:Mf,MonitorSmartphone:wf,MonitorSmartphoneIcon:wf,MonitorSpeaker:Lf,MonitorSpeakerIcon:Lf,MonitorStop:Cf,MonitorStopIcon:Cf,MonitorUp:Sf,MonitorUpIcon:Sf,MonitorX:If,MonitorXIcon:If,Moon:Pf,MoonIcon:Pf,MoonStar:bf,MoonStarIcon:bf,MoreHorizontal:Af,MoreHorizontalIcon:Af,MoreVertical:zf,MoreVerticalIcon:zf,Mountain:Hf,MountainIcon:Hf,MountainSnow:Vf,MountainSnowIcon:Vf,Mouse:Rf,MouseIcon:Rf,MousePointer:Ff,MousePointer2:Tf,MousePointer2Icon:Tf,MousePointerClick:qf,MousePointerClickIcon:qf,MousePointerIcon:Ff,MousePointerSquare:Fn,MousePointerSquareDashed:Df,MousePointerSquareDashedIcon:Df,MousePointerSquareIcon:Fn,Move:Qf,Move3D:Rn,Move3DIcon:Rn,Move3d:Rn,Move3dIcon:Rn,MoveDiagonal:Nf,MoveDiagonal2:Bf,MoveDiagonal2Icon:Bf,MoveDiagonalIcon:Nf,MoveDown:Uf,MoveDownIcon:Uf,MoveDownLeft:Ef,MoveDownLeftIcon:Ef,MoveDownRight:Of,MoveDownRightIcon:Of,MoveHorizontal:Zf,MoveHorizontalIcon:Zf,MoveIcon:Qf,MoveLeft:_f,MoveLeftIcon:_f,MoveRight:Wf,MoveRightIcon:Wf,MoveUp:Xf,MoveUpIcon:Xf,MoveUpLeft:Gf,MoveUpLeftIcon:Gf,MoveUpRight:$f,MoveUpRightIcon:$f,MoveVertical:Kf,MoveVerticalIcon:Kf,Music:tm,Music2:Yf,Music2Icon:Yf,Music3:Jf,Music3Icon:Jf,Music4:em,Music4Icon:em,MusicIcon:tm,Navigation:rm,Navigation2:am,Navigation2Icon:am,Navigation2Off:nm,Navigation2OffIcon:nm,NavigationIcon:rm,NavigationOff:im,NavigationOffIcon:im,Network:om,NetworkIcon:om,Newspaper:sm,NewspaperIcon:sm,Nfc:cm,NfcIcon:cm,Nut:dm,NutIcon:dm,NutOff:lm,NutOffIcon:lm,Octagon:hm,OctagonIcon:hm,Option:um,OptionIcon:um,Orbit:ym,OrbitIcon:ym,Outdent:pm,OutdentIcon:pm,Package:wm,Package2:km,Package2Icon:km,PackageCheck:fm,PackageCheckIcon:fm,PackageIcon:wm,PackageMinus:mm,PackageMinusIcon:mm,PackageOpen:gm,PackageOpenIcon:gm,PackagePlus:xm,PackagePlusIcon:xm,PackageSearch:vm,PackageSearchIcon:vm,PackageX:Mm,PackageXIcon:Mm,PaintBucket:Lm,PaintBucketIcon:Lm,Paintbrush:Sm,Paintbrush2:Cm,Paintbrush2Icon:Cm,PaintbrushIcon:Sm,Palette:Im,PaletteIcon:Im,Palmtree:jm,PalmtreeIcon:jm,PanelBottom:Am,PanelBottomClose:bm,PanelBottomCloseIcon:bm,PanelBottomDashed:Bn,PanelBottomDashedIcon:Bn,PanelBottomIcon:Am,PanelBottomInactive:Bn,PanelBottomInactiveIcon:Bn,PanelBottomOpen:Pm,PanelBottomOpenIcon:Pm,PanelLeft:Un,PanelLeftClose:Nn,PanelLeftCloseIcon:Nn,PanelLeftDashed:En,PanelLeftDashedIcon:En,PanelLeftIcon:Un,PanelLeftInactive:En,PanelLeftInactiveIcon:En,PanelLeftOpen:On,PanelLeftOpenIcon:On,PanelRight:Hm,PanelRightClose:zm,PanelRightCloseIcon:zm,PanelRightDashed:Zn,PanelRightDashedIcon:Zn,PanelRightIcon:Hm,PanelRightInactive:Zn,PanelRightInactiveIcon:Zn,PanelRightOpen:Vm,PanelRightOpenIcon:Vm,PanelTop:Dm,PanelTopClose:Tm,PanelTopCloseIcon:Tm,PanelTopDashed:_n,PanelTopDashedIcon:_n,PanelTopIcon:Dm,PanelTopInactive:_n,PanelTopInactiveIcon:_n,PanelTopOpen:qm,PanelTopOpenIcon:qm,PanelsLeftBottom:Fm,PanelsLeftBottomIcon:Fm,PanelsLeftRight:bn,PanelsLeftRightIcon:bn,PanelsRightBottom:Rm,PanelsRightBottomIcon:Rm,PanelsTopBottom:Qn,PanelsTopBottomIcon:Qn,PanelsTopLeft:Wn,PanelsTopLeftIcon:Wn,Paperclip:Bm,PaperclipIcon:Bm,Parentheses:Nm,ParenthesesIcon:Nm,ParkingCircle:Om,ParkingCircleIcon:Om,ParkingCircleOff:Em,ParkingCircleOffIcon:Em,ParkingMeter:Um,ParkingMeterIcon:Um,ParkingSquare:_m,ParkingSquareIcon:_m,ParkingSquareOff:Zm,ParkingSquareOffIcon:Zm,PartyPopper:Wm,PartyPopperIcon:Wm,Pause:Xm,PauseCircle:Gm,PauseCircleIcon:Gm,PauseIcon:Xm,PauseOctagon:$m,PauseOctagonIcon:$m,PawPrint:Km,PawPrintIcon:Km,PcCase:Qm,PcCaseIcon:Qm,Pen:$n,PenBox:Xe,PenBoxIcon:Xe,PenIcon:$n,PenLine:Gn,PenLineIcon:Gn,PenSquare:Xe,PenSquareIcon:Xe,PenTool:Ym,PenToolIcon:Ym,Pencil:t3,PencilIcon:t3,PencilLine:Jm,PencilLineIcon:Jm,PencilRuler:e3,PencilRulerIcon:e3,Pentagon:n3,PentagonIcon:n3,Percent:o3,PercentCircle:a3,PercentCircleIcon:a3,PercentDiamond:i3,PercentDiamondIcon:i3,PercentIcon:o3,PercentSquare:r3,PercentSquareIcon:r3,PersonStanding:s3,PersonStandingIcon:s3,Phone:p3,PhoneCall:c3,PhoneCallIcon:c3,PhoneForwarded:l3,PhoneForwardedIcon:l3,PhoneIcon:p3,PhoneIncoming:d3,PhoneIncomingIcon:d3,PhoneMissed:h3,PhoneMissedIcon:h3,PhoneOff:u3,PhoneOffIcon:u3,PhoneOutgoing:y3,PhoneOutgoingIcon:y3,Pi:f3,PiIcon:f3,PiSquare:k3,PiSquareIcon:k3,Piano:m3,PianoIcon:m3,PictureInPicture:x3,PictureInPicture2:g3,PictureInPicture2Icon:g3,PictureInPictureIcon:x3,PieChart:v3,PieChartIcon:v3,PiggyBank:M3,PiggyBankIcon:M3,Pilcrow:L3,PilcrowIcon:L3,PilcrowSquare:w3,PilcrowSquareIcon:w3,Pill:C3,PillIcon:C3,Pin:I3,PinIcon:I3,PinOff:S3,PinOffIcon:S3,Pipette:j3,PipetteIcon:j3,Pizza:b3,PizzaIcon:b3,Plane:z3,PlaneIcon:z3,PlaneLanding:P3,PlaneLandingIcon:P3,PlaneTakeoff:A3,PlaneTakeoffIcon:A3,Play:H3,PlayCircle:ai,PlayCircleIcon:ai,PlayIcon:H3,PlaySquare:V3,PlaySquareIcon:V3,Plug:F3,Plug2:T3,Plug2Icon:T3,PlugIcon:F3,PlugZap:D3,PlugZap2:q3,PlugZap2Icon:q3,PlugZapIcon:D3,Plus:B3,PlusCircle:ii,PlusCircleIcon:ii,PlusIcon:B3,PlusSquare:R3,PlusSquareIcon:R3,Pocket:E3,PocketIcon:E3,PocketKnife:N3,PocketKnifeIcon:N3,Podcast:O3,PodcastIcon:O3,Pointer:Z3,PointerIcon:Z3,PointerOff:U3,PointerOffIcon:U3,Popcorn:_3,PopcornIcon:_3,Popsicle:W3,PopsicleIcon:W3,PoundSterling:G3,PoundSterlingIcon:G3,Power:Q3,PowerCircle:$3,PowerCircleIcon:$3,PowerIcon:Q3,PowerOff:X3,PowerOffIcon:X3,PowerSquare:K3,PowerSquareIcon:K3,Presentation:Y3,PresentationIcon:Y3,Printer:J3,PrinterIcon:J3,Projector:e6,ProjectorIcon:e6,Puzzle:t6,PuzzleIcon:t6,Pyramid:n6,PyramidIcon:n6,QrCode:a6,QrCodeIcon:a6,Quote:i6,QuoteIcon:i6,Rabbit:r6,RabbitIcon:r6,Radar:o6,RadarIcon:o6,Radiation:s6,RadiationIcon:s6,Radio:d6,RadioIcon:d6,RadioReceiver:c6,RadioReceiverIcon:c6,RadioTower:l6,RadioTowerIcon:l6,Radius:h6,RadiusIcon:h6,RailSymbol:u6,RailSymbolIcon:u6,Rainbow:y6,RainbowIcon:y6,Rat:p6,RatIcon:p6,Ratio:k6,RatioIcon:k6,Receipt:f6,ReceiptIcon:f6,RectangleHorizontal:m6,RectangleHorizontalIcon:m6,RectangleVertical:g6,RectangleVerticalIcon:g6,Recycle:x6,RecycleIcon:x6,Redo:w6,Redo2:v6,Redo2Icon:v6,RedoDot:M6,RedoDotIcon:M6,RedoIcon:w6,RefreshCcw:C6,RefreshCcwDot:L6,RefreshCcwDotIcon:L6,RefreshCcwIcon:C6,RefreshCw:I6,RefreshCwIcon:I6,RefreshCwOff:S6,RefreshCwOffIcon:S6,Refrigerator:j6,RefrigeratorIcon:j6,Regex:b6,RegexIcon:b6,RemoveFormatting:P6,RemoveFormattingIcon:P6,Repeat:V6,Repeat1:A6,Repeat1Icon:A6,Repeat2:z6,Repeat2Icon:z6,RepeatIcon:V6,Replace:T6,ReplaceAll:H6,ReplaceAllIcon:H6,ReplaceIcon:T6,Reply:D6,ReplyAll:q6,ReplyAllIcon:q6,ReplyIcon:D6,Rewind:F6,RewindIcon:F6,Ribbon:R6,RibbonIcon:R6,Rocket:B6,RocketIcon:B6,RockingChair:N6,RockingChairIcon:N6,RollerCoaster:E6,RollerCoasterIcon:E6,Rotate3D:Xn,Rotate3DIcon:Xn,Rotate3d:Xn,Rotate3dIcon:Xn,RotateCcw:O6,RotateCcwIcon:O6,RotateCw:U6,RotateCwIcon:U6,Route:_6,RouteIcon:_6,RouteOff:Z6,RouteOffIcon:Z6,Router:W6,RouterIcon:W6,Rows:Kn,Rows2:Kn,Rows2Icon:Kn,Rows3:Qn,Rows3Icon:Qn,Rows4:G6,Rows4Icon:G6,RowsIcon:Kn,Rss:$6,RssIcon:$6,Ruler:X6,RulerIcon:X6,RussianRuble:K6,RussianRubleIcon:K6,Sailboat:Q6,SailboatIcon:Q6,Salad:Y6,SaladIcon:Y6,Sandwich:J6,SandwichIcon:J6,Satellite:t8,SatelliteDish:e8,SatelliteDishIcon:e8,SatelliteIcon:t8,Save:a8,SaveAll:n8,SaveAllIcon:n8,SaveIcon:a8,Scale:i8,Scale3D:Yn,Scale3DIcon:Yn,Scale3d:Yn,Scale3dIcon:Yn,ScaleIcon:i8,Scaling:r8,ScalingIcon:r8,Scan:u8,ScanBarcode:o8,ScanBarcodeIcon:o8,ScanEye:s8,ScanEyeIcon:s8,ScanFace:c8,ScanFaceIcon:c8,ScanIcon:u8,ScanLine:l8,ScanLineIcon:l8,ScanSearch:d8,ScanSearchIcon:d8,ScanText:h8,ScanTextIcon:h8,ScatterChart:y8,ScatterChartIcon:y8,School:k8,School2:p8,School2Icon:p8,SchoolIcon:k8,Scissors:x8,ScissorsIcon:x8,ScissorsLineDashed:f8,ScissorsLineDashedIcon:f8,ScissorsSquare:g8,ScissorsSquareDashedBottom:m8,ScissorsSquareDashedBottomIcon:m8,ScissorsSquareIcon:g8,ScreenShare:M8,ScreenShareIcon:M8,ScreenShareOff:v8,ScreenShareOffIcon:v8,Scroll:L8,ScrollIcon:L8,ScrollText:w8,ScrollTextIcon:w8,Search:b8,SearchCheck:C8,SearchCheckIcon:C8,SearchCode:S8,SearchCodeIcon:S8,SearchIcon:b8,SearchSlash:I8,SearchSlashIcon:I8,SearchX:j8,SearchXIcon:j8,Send:A8,SendHorizonal:Jn,SendHorizonalIcon:Jn,SendHorizontal:Jn,SendHorizontalIcon:Jn,SendIcon:A8,SendToBack:P8,SendToBackIcon:P8,SeparatorHorizontal:z8,SeparatorHorizontalIcon:z8,SeparatorVertical:V8,SeparatorVerticalIcon:V8,Server:D8,ServerCog:H8,ServerCogIcon:H8,ServerCrash:T8,ServerCrashIcon:T8,ServerIcon:D8,ServerOff:q8,ServerOffIcon:q8,Settings:R8,Settings2:F8,Settings2Icon:F8,SettingsIcon:R8,Shapes:B8,ShapesIcon:B8,Share:N8,Share2:ri,Share2Icon:ri,ShareIcon:N8,Sheet:E8,SheetIcon:E8,Shell:O8,ShellIcon:O8,Shield:pa,ShieldAlert:I1,ShieldAlertIcon:I1,ShieldBan:U8,ShieldBanIcon:U8,ShieldCheck:Z8,ShieldCheckIcon:Z8,ShieldClose:e1,ShieldCloseIcon:e1,ShieldEllipsis:_8,ShieldEllipsisIcon:_8,ShieldHalf:W8,ShieldHalfIcon:W8,ShieldIcon:pa,ShieldMinus:G8,ShieldMinusIcon:G8,ShieldOff:$8,ShieldOffIcon:$8,ShieldPlus:X8,ShieldPlusIcon:X8,ShieldQuestion:K8,ShieldQuestionIcon:K8,ShieldX:e1,ShieldXIcon:e1,Ship:Y8,ShipIcon:Y8,ShipWheel:Q8,ShipWheelIcon:Q8,Shirt:J8,ShirtIcon:J8,ShoppingBag:eg,ShoppingBagIcon:eg,ShoppingBasket:tg,ShoppingBasketIcon:tg,ShoppingCart:ng,ShoppingCartIcon:ng,Shovel:ag,ShovelIcon:ag,ShowerHead:ig,ShowerHeadIcon:ig,Shrink:rg,ShrinkIcon:rg,Shrub:og,ShrubIcon:og,Shuffle:sg,ShuffleIcon:sg,Sidebar:Un,SidebarClose:Nn,SidebarCloseIcon:Nn,SidebarIcon:Un,SidebarOpen:On,SidebarOpenIcon:On,Sigma:lg,SigmaIcon:lg,SigmaSquare:cg,SigmaSquareIcon:cg,Signal:pg,SignalHigh:dg,SignalHighIcon:dg,SignalIcon:pg,SignalLow:hg,SignalLowIcon:hg,SignalMedium:ug,SignalMediumIcon:ug,SignalZero:yg,SignalZeroIcon:yg,Signpost:fg,SignpostBig:kg,SignpostBigIcon:kg,SignpostIcon:fg,Siren:mg,SirenIcon:mg,SkipBack:gg,SkipBackIcon:gg,SkipForward:xg,SkipForwardIcon:xg,Skull:vg,SkullIcon:vg,Slack:Mg,SlackIcon:Mg,Slash:wg,SlashIcon:wg,Slice:Lg,SliceIcon:Lg,Sliders:Sg,SlidersHorizontal:Cg,SlidersHorizontalIcon:Cg,SlidersIcon:Sg,Smartphone:bg,SmartphoneCharging:Ig,SmartphoneChargingIcon:Ig,SmartphoneIcon:bg,SmartphoneNfc:jg,SmartphoneNfcIcon:jg,Smile:Ag,SmileIcon:Ag,SmilePlus:Pg,SmilePlusIcon:Pg,Snail:zg,SnailIcon:zg,Snowflake:Vg,SnowflakeIcon:Vg,Sofa:Hg,SofaIcon:Hg,SortAsc:gn,SortAscIcon:gn,SortDesc:kn,SortDescIcon:kn,Soup:Tg,SoupIcon:Tg,Space:qg,SpaceIcon:qg,Spade:Dg,SpadeIcon:Dg,Sparkle:Fg,SparkleIcon:Fg,Sparkles:Vt,SparklesIcon:Vt,Speaker:Rg,SpeakerIcon:Rg,Speech:Bg,SpeechIcon:Bg,SpellCheck:Eg,SpellCheck2:Ng,SpellCheck2Icon:Ng,SpellCheckIcon:Eg,Spline:Og,SplineIcon:Og,Split:_g,SplitIcon:_g,SplitSquareHorizontal:Ug,SplitSquareHorizontalIcon:Ug,SplitSquareVertical:Zg,SplitSquareVerticalIcon:Zg,SprayCan:Wg,SprayCanIcon:Wg,Sprout:Gg,SproutIcon:Gg,Square:n7,SquareAsterisk:$g,SquareAsteriskIcon:$g,SquareCode:Xg,SquareCodeIcon:Xg,SquareDashedBottom:Qg,SquareDashedBottomCode:Kg,SquareDashedBottomCodeIcon:Kg,SquareDashedBottomIcon:Qg,SquareDot:Yg,SquareDotIcon:Yg,SquareEqual:Jg,SquareEqualIcon:Jg,SquareGantt:Vn,SquareGanttIcon:Vn,SquareIcon:n7,SquareKanban:Dn,SquareKanbanDashed:qn,SquareKanbanDashedIcon:qn,SquareKanbanIcon:Dn,SquareSlash:e7,SquareSlashIcon:e7,SquareStack:t7,SquareStackIcon:t7,SquareUser:n1,SquareUserIcon:n1,SquareUserRound:t1,SquareUserRoundIcon:t1,Squircle:a7,SquircleIcon:a7,Squirrel:i7,SquirrelIcon:i7,Stamp:r7,StampIcon:r7,Star:c7,StarHalf:o7,StarHalfIcon:o7,StarIcon:c7,StarOff:s7,StarOffIcon:s7,Stars:Vt,StarsIcon:Vt,StepBack:l7,StepBackIcon:l7,StepForward:d7,StepForwardIcon:d7,Stethoscope:oi,StethoscopeIcon:oi,Sticker:h7,StickerIcon:h7,StickyNote:u7,StickyNoteIcon:u7,StopCircle:y7,StopCircleIcon:y7,Store:p7,StoreIcon:p7,StretchHorizontal:k7,StretchHorizontalIcon:k7,StretchVertical:f7,StretchVerticalIcon:f7,Strikethrough:m7,StrikethroughIcon:m7,Subscript:g7,SubscriptIcon:g7,Subtitles:x7,SubtitlesIcon:x7,Sun:C7,SunDim:v7,SunDimIcon:v7,SunIcon:C7,SunMedium:M7,SunMediumIcon:M7,SunMoon:w7,SunMoonIcon:w7,SunSnow:L7,SunSnowIcon:L7,Sunrise:S7,SunriseIcon:S7,Sunset:I7,SunsetIcon:I7,Superscript:j7,SuperscriptIcon:j7,SwissFranc:b7,SwissFrancIcon:b7,SwitchCamera:P7,SwitchCameraIcon:P7,Sword:A7,SwordIcon:A7,Swords:z7,SwordsIcon:z7,Syringe:$t,SyringeIcon:$t,Table:T7,Table2:V7,Table2Icon:V7,TableIcon:T7,TableProperties:H7,TablePropertiesIcon:H7,Tablet:D7,TabletIcon:D7,TabletSmartphone:q7,TabletSmartphoneIcon:q7,Tablets:F7,TabletsIcon:F7,Tag:R7,TagIcon:R7,Tags:B7,TagsIcon:B7,Tally1:N7,Tally1Icon:N7,Tally2:E7,Tally2Icon:E7,Tally3:O7,Tally3Icon:O7,Tally4:U7,Tally4Icon:U7,Tally5:Z7,Tally5Icon:Z7,Tangent:_7,TangentIcon:_7,Target:W7,TargetIcon:W7,Tent:$7,TentIcon:$7,TentTree:G7,TentTreeIcon:G7,Terminal:K7,TerminalIcon:K7,TerminalSquare:X7,TerminalSquareIcon:X7,TestTube:ka,TestTube2:Q7,TestTube2Icon:Q7,TestTubeIcon:ka,TestTubes:Y7,TestTubesIcon:Y7,Text:nx,TextCursor:ex,TextCursorIcon:ex,TextCursorInput:J7,TextCursorInputIcon:J7,TextIcon:nx,TextQuote:tx,TextQuoteIcon:tx,TextSelect:a1,TextSelectIcon:a1,TextSelection:a1,TextSelectionIcon:a1,Theater:ax,TheaterIcon:ax,Thermometer:ox,ThermometerIcon:ox,ThermometerSnowflake:ix,ThermometerSnowflakeIcon:ix,ThermometerSun:rx,ThermometerSunIcon:rx,ThumbsDown:sx,ThumbsDownIcon:sx,ThumbsUp:cx,ThumbsUpIcon:cx,Ticket:lx,TicketIcon:lx,Timer:ux,TimerIcon:ux,TimerOff:dx,TimerOffIcon:dx,TimerReset:hx,TimerResetIcon:hx,ToggleLeft:yx,ToggleLeftIcon:yx,ToggleRight:px,ToggleRightIcon:px,Tornado:kx,TornadoIcon:kx,Torus:fx,TorusIcon:fx,Touchpad:gx,TouchpadIcon:gx,TouchpadOff:mx,TouchpadOffIcon:mx,TowerControl:xx,TowerControlIcon:xx,ToyBrick:vx,ToyBrickIcon:vx,Tractor:Mx,TractorIcon:Mx,TrafficCone:wx,TrafficConeIcon:wx,Train:i1,TrainFront:Cx,TrainFrontIcon:Cx,TrainFrontTunnel:Lx,TrainFrontTunnelIcon:Lx,TrainIcon:i1,TrainTrack:Sx,TrainTrackIcon:Sx,TramFront:i1,TramFrontIcon:i1,Trash:Ix,Trash2:si,Trash2Icon:si,TrashIcon:Ix,TreeDeciduous:jx,TreeDeciduousIcon:jx,TreePine:bx,TreePineIcon:bx,Trees:Px,TreesIcon:Px,Trello:Ax,TrelloIcon:Ax,TrendingDown:zx,TrendingDownIcon:zx,TrendingUp:ci,TrendingUpIcon:ci,Triangle:Hx,TriangleIcon:Hx,TriangleRight:Vx,TriangleRightIcon:Vx,Trophy:Tx,TrophyIcon:Tx,Truck:qx,TruckIcon:qx,Turtle:Dx,TurtleIcon:Dx,Tv:Rx,Tv2:Fx,Tv2Icon:Fx,TvIcon:Rx,Twitch:Bx,TwitchIcon:Bx,Twitter:Nx,TwitterIcon:Nx,Type:Ex,TypeIcon:Ex,Umbrella:Ux,UmbrellaIcon:Ux,UmbrellaOff:Ox,UmbrellaOffIcon:Ox,Underline:Zx,UnderlineIcon:Zx,Undo:Gx,Undo2:_x,Undo2Icon:_x,UndoDot:Wx,UndoDotIcon:Wx,UndoIcon:Gx,UnfoldHorizontal:$x,UnfoldHorizontalIcon:$x,UnfoldVertical:Xx,UnfoldVerticalIcon:Xx,Ungroup:Kx,UngroupIcon:Kx,Unlink:Yx,Unlink2:Qx,Unlink2Icon:Qx,UnlinkIcon:Yx,Unlock:ev,UnlockIcon:ev,UnlockKeyhole:Jx,UnlockKeyholeIcon:Jx,Unplug:tv,UnplugIcon:tv,Upload:av,UploadCloud:nv,UploadCloudIcon:nv,UploadIcon:av,Usb:iv,UsbIcon:iv,User:uv,User2:d1,User2Icon:d1,UserCheck:rv,UserCheck2:r1,UserCheck2Icon:r1,UserCheckIcon:rv,UserCircle:In,UserCircle2:Sn,UserCircle2Icon:Sn,UserCircleIcon:In,UserCog:ov,UserCog2:o1,UserCog2Icon:o1,UserCogIcon:ov,UserIcon:uv,UserMinus:sv,UserMinus2:s1,UserMinus2Icon:s1,UserMinusIcon:sv,UserPlus:cv,UserPlus2:c1,UserPlus2Icon:c1,UserPlusIcon:cv,UserRound:d1,UserRoundCheck:r1,UserRoundCheckIcon:r1,UserRoundCog:o1,UserRoundCogIcon:o1,UserRoundIcon:d1,UserRoundMinus:s1,UserRoundMinusIcon:s1,UserRoundPlus:c1,UserRoundPlusIcon:c1,UserRoundSearch:lv,UserRoundSearchIcon:lv,UserRoundX:l1,UserRoundXIcon:l1,UserSearch:dv,UserSearchIcon:dv,UserSquare:n1,UserSquare2:t1,UserSquare2Icon:t1,UserSquareIcon:n1,UserX:hv,UserX2:l1,UserX2Icon:l1,UserXIcon:hv,Users:yv,Users2:h1,Users2Icon:h1,UsersIcon:yv,UsersRound:h1,UsersRoundIcon:h1,Utensils:li,UtensilsCrossed:j1,UtensilsCrossedIcon:j1,UtensilsIcon:li,UtilityPole:pv,UtilityPoleIcon:pv,Variable:kv,VariableIcon:kv,Vegan:fv,VeganIcon:fv,VenetianMask:mv,VenetianMaskIcon:mv,Verified:Mn,VerifiedIcon:Mn,Vibrate:xv,VibrateIcon:xv,VibrateOff:gv,VibrateOffIcon:gv,Video:Mv,VideoIcon:Mv,VideoOff:vv,VideoOffIcon:vv,Videotape:wv,VideotapeIcon:wv,View:Lv,ViewIcon:Lv,Voicemail:Cv,VoicemailIcon:Cv,Volume:bv,Volume1:Sv,Volume1Icon:Sv,Volume2:Iv,Volume2Icon:Iv,VolumeIcon:bv,VolumeX:jv,VolumeXIcon:jv,Vote:Pv,VoteIcon:Pv,Wallet:Vv,Wallet2:Av,Wallet2Icon:Av,WalletCards:zv,WalletCardsIcon:zv,WalletIcon:Vv,Wallpaper:Hv,WallpaperIcon:Hv,Wand:qv,Wand2:Tv,Wand2Icon:Tv,WandIcon:qv,Warehouse:Dv,WarehouseIcon:Dv,Watch:Fv,WatchIcon:Fv,Waves:Rv,WavesIcon:Rv,Waypoints:Bv,WaypointsIcon:Bv,Webcam:Nv,WebcamIcon:Nv,Webhook:Ev,WebhookIcon:Ev,Weight:Ov,WeightIcon:Ov,Wheat:Zv,WheatIcon:Zv,WheatOff:Uv,WheatOffIcon:Uv,WholeWord:_v,WholeWordIcon:_v,Wifi:Gv,WifiIcon:Gv,WifiOff:Wv,WifiOffIcon:Wv,Wind:$v,WindIcon:$v,Wine:Kv,WineIcon:Kv,WineOff:Xv,WineOffIcon:Xv,Workflow:Qv,WorkflowIcon:Qv,WrapText:Yv,WrapTextIcon:Yv,Wrench:Jv,WrenchIcon:Jv,X:tt,XCircle:eM,XCircleIcon:eM,XIcon:tt,XOctagon:tM,XOctagonIcon:tM,XSquare:nM,XSquareIcon:nM,Youtube:aM,YoutubeIcon:aM,Zap:rM,ZapIcon:rM,ZapOff:iM,ZapOffIcon:iM,ZoomIn:oM,ZoomInIcon:oM,ZoomOut:sM,ZoomOutIcon:sM,createLucideIcon:i,icons:XV},Symbol.toStringTag,{value:"Module"}));function zS(e,t){const[n,a]=C.useState(()=>{try{const o=window.localStorage.getItem(e);return o?JSON.parse(o):t}catch(o){return console.error(o),t}});return[n,o=>{try{const s=o instanceof Function?o(n):o;a(s),window.localStorage.setItem(e,JSON.stringify(s))}catch(s){console.error(s)}}]}const Qb=C.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"}),i9=C.createContext({}),r9=C.createContext(null),o9=typeof document<"u",eC=o9?C.useLayoutEffect:C.useEffect,Yb=C.createContext({strict:!1}),tC=e=>e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),KV="framerAppearId",Jb="data-"+tC(KV);function QV(e,t,n,a){const{visualElement:r}=C.useContext(i9),o=C.useContext(Yb),s=C.useContext(r9),c=C.useContext(Qb).reducedMotion,d=C.useRef();a=a||o.renderer,!d.current&&a&&(d.current=a(e,{visualState:t,parent:r,props:n,presenceContext:s,blockInitialAnimation:s?s.initial===!1:!1,reducedMotionConfig:c}));const h=d.current;C.useInsertionEffect(()=>{h&&h.update(n,s)});const u=C.useRef(!!(n[Jb]&&!window.HandoffComplete));return eC(()=>{h&&(h.render(),u.current&&h.animationState&&h.animationState.animateChanges())}),C.useEffect(()=>{h&&(h.updateFeatures(),!u.current&&h.animationState&&h.animationState.animateChanges(),u.current&&(u.current=!1,window.HandoffComplete=!0))}),h}function J1(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function YV(e,t,n){return C.useCallback(a=>{a&&e.mount&&e.mount(a),t&&(a?t.mount(a):t.unmount()),n&&(typeof n=="function"?n(a):J1(n)&&(n.current=a))},[t])}function zi(e){return typeof e=="string"||Array.isArray(e)}function s9(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}const nC=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],aC=["initial",...nC];function c9(e){return s9(e.animate)||aC.some(t=>zi(e[t]))}function eP(e){return!!(c9(e)||e.variants)}function JV(e,t){if(c9(e)){const{initial:n,animate:a}=e;return{initial:n===!1||zi(n)?n:void 0,animate:zi(a)?a:void 0}}return e.inherit!==!1?t:{}}function eH(e){const{initial:t,animate:n}=JV(e,C.useContext(i9));return C.useMemo(()=>({initial:t,animate:n}),[VS(t),VS(n)])}function VS(e){return Array.isArray(e)?e.join(" "):e}const HS={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]},Vi={};for(const e in HS)Vi[e]={isEnabled:t=>HS[e].some(n=>!!t[n])};function tH(e){for(const t in e)Vi[t]={...Vi[t],...e[t]}}const iC=C.createContext({}),tP=C.createContext({}),nH=Symbol.for("motionComponentSymbol");function aH({preloadedFeatures:e,createVisualElement:t,useRender:n,useVisualState:a,Component:r}){e&&tH(e);function o(c,d){let h;const u={...C.useContext(Qb),...c,layoutId:iH(c)},{isStatic:y}=u,k=eH(c),g=a(c,y);if(!y&&o9){k.visualElement=QV(r,g,u,t);const v=C.useContext(tP),x=C.useContext(Yb).strict;k.visualElement&&(h=k.visualElement.loadFeatures(u,x,e,v))}return C.createElement(i9.Provider,{value:k},h&&k.visualElement?C.createElement(h,{visualElement:k.visualElement,...u}):null,n(r,c,YV(g,k.visualElement,d),g,y,k.visualElement))}const s=C.forwardRef(o);return s[nH]=r,s}function iH({layoutId:e}){const t=C.useContext(iC).id;return t&&e!==void 0?t+"-"+e:e}function rH(e){function t(a,r={}){return aH(e(a,r))}if(typeof Proxy>"u")return t;const n=new Map;return new Proxy(t,{get:(a,r)=>(n.has(r)||n.set(r,t(r)),n.get(r))})}const oH=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function rC(e){return typeof e!="string"||e.includes("-")?!1:!!(oH.indexOf(e)>-1||/[A-Z]/.test(e))}const TM={};function sH(e){Object.assign(TM,e)}const Bi=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],F1=new Set(Bi);function nP(e,{layout:t,layoutId:n}){return F1.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!TM[e]||e==="opacity")}const Pe=e=>!!(e&&e.getVelocity),cH={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},lH=Bi.length;function dH(e,{enableHardwareAcceleration:t=!0,allowTransformNone:n=!0},a,r){let o="";for(let s=0;s<lH;s++){const c=Bi[s];if(e[c]!==void 0){const d=cH[c]||c;o+=`${d}(${e[c]}) `}}return t&&!e.z&&(o+="translateZ(0)"),o=o.trim(),r?o=r(e,a?"":o):n&&a&&(o="none"),o}const aP=e=>t=>typeof t=="string"&&t.startsWith(e),iP=aP("--"),Ww=aP("var(--"),hH=/var\s*\(\s*--[\w-]+(\s*,\s*(?:(?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)+)?\s*\)/g,uH=(e,t)=>t&&typeof e=="number"?t.transform(e):e,Yt=(e,t,n)=>Math.min(Math.max(n,e),t),R1={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},di={...R1,transform:e=>Yt(0,1,e)},sr={...R1,default:1},hi=e=>Math.round(e*1e5)/1e5,l9=/(-)?([\d]*\.?[\d])+/g,rP=/(#[0-9a-f]{3,8}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi,yH=/^(#[0-9a-f]{3,8}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;function Ni(e){return typeof e=="string"}const Ei=e=>({test:t=>Ni(t)&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),Pt=Ei("deg"),ht=Ei("%"),V=Ei("px"),pH=Ei("vh"),kH=Ei("vw"),TS={...ht,parse:e=>ht.parse(e)/100,transform:e=>ht.transform(e*100)},qS={...R1,transform:Math.round},oP={borderWidth:V,borderTopWidth:V,borderRightWidth:V,borderBottomWidth:V,borderLeftWidth:V,borderRadius:V,radius:V,borderTopLeftRadius:V,borderTopRightRadius:V,borderBottomRightRadius:V,borderBottomLeftRadius:V,width:V,maxWidth:V,height:V,maxHeight:V,size:V,top:V,right:V,bottom:V,left:V,padding:V,paddingTop:V,paddingRight:V,paddingBottom:V,paddingLeft:V,margin:V,marginTop:V,marginRight:V,marginBottom:V,marginLeft:V,rotate:Pt,rotateX:Pt,rotateY:Pt,rotateZ:Pt,scale:sr,scaleX:sr,scaleY:sr,scaleZ:sr,skew:Pt,skewX:Pt,skewY:Pt,distance:V,translateX:V,translateY:V,translateZ:V,x:V,y:V,z:V,perspective:V,transformPerspective:V,opacity:di,originX:TS,originY:TS,originZ:V,zIndex:qS,fillOpacity:di,strokeOpacity:di,numOctaves:qS};function oC(e,t,n,a){const{style:r,vars:o,transform:s,transformOrigin:c}=e;let d=!1,h=!1,u=!0;for(const y in t){const k=t[y];if(iP(y)){o[y]=k;continue}const g=oP[y],v=uH(k,g);if(F1.has(y)){if(d=!0,s[y]=v,!u)continue;k!==(g.default||0)&&(u=!1)}else y.startsWith("origin")?(h=!0,c[y]=v):r[y]=v}if(t.transform||(d||a?r.transform=dH(e.transform,n,u,a):r.transform&&(r.transform="none")),h){const{originX:y="50%",originY:k="50%",originZ:g=0}=c;r.transformOrigin=`${y} ${k} ${g}`}}const sC=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function sP(e,t,n){for(const a in t)!Pe(t[a])&&!nP(a,n)&&(e[a]=t[a])}function fH({transformTemplate:e},t,n){return C.useMemo(()=>{const a=sC();return oC(a,t,{enableHardwareAcceleration:!n},e),Object.assign({},a.vars,a.style)},[t])}function mH(e,t,n){const a=e.style||{},r={};return sP(r,a,e),Object.assign(r,fH(e,t,n)),e.transformValues?e.transformValues(r):r}function gH(e,t,n){const a={},r=mH(e,t,n);return e.drag&&e.dragListener!==!1&&(a.draggable=!1,r.userSelect=r.WebkitUserSelect=r.WebkitTouchCallout="none",r.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(a.tabIndex=0),a.style=r,a}const xH=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","transformValues","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","ignoreStrict","viewport"]);function qM(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||xH.has(e)}let cP=e=>!qM(e);function vH(e){e&&(cP=t=>t.startsWith("on")?!qM(t):e(t))}try{vH(require("@emotion/is-prop-valid").default)}catch{}function MH(e,t,n){const a={};for(const r in e)r==="values"&&typeof e.values=="object"||(cP(r)||n===!0&&qM(r)||!t&&!qM(r)||e.draggable&&r.startsWith("onDrag"))&&(a[r]=e[r]);return a}function DS(e,t,n){return typeof e=="string"?e:V.transform(t+n*e)}function wH(e,t,n){const a=DS(t,e.x,e.width),r=DS(n,e.y,e.height);return`${a} ${r}`}const LH={offset:"stroke-dashoffset",array:"stroke-dasharray"},CH={offset:"strokeDashoffset",array:"strokeDasharray"};function SH(e,t,n=1,a=0,r=!0){e.pathLength=1;const o=r?LH:CH;e[o.offset]=V.transform(-a);const s=V.transform(t),c=V.transform(n);e[o.array]=`${s} ${c}`}function cC(e,{attrX:t,attrY:n,attrScale:a,originX:r,originY:o,pathLength:s,pathSpacing:c=1,pathOffset:d=0,...h},u,y,k){if(oC(e,h,u,k),y){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:g,style:v,dimensions:x}=e;g.transform&&(x&&(v.transform=g.transform),delete g.transform),x&&(r!==void 0||o!==void 0||v.transform)&&(v.transformOrigin=wH(x,r!==void 0?r:.5,o!==void 0?o:.5)),t!==void 0&&(g.x=t),n!==void 0&&(g.y=n),a!==void 0&&(g.scale=a),s!==void 0&&SH(g,s,c,d,!1)}const lP=()=>({...sC(),attrs:{}}),lC=e=>typeof e=="string"&&e.toLowerCase()==="svg";function IH(e,t,n,a){const r=C.useMemo(()=>{const o=lP();return cC(o,t,{enableHardwareAcceleration:!1},lC(a),e.transformTemplate),{...o.attrs,style:{...o.style}}},[t]);if(e.style){const o={};sP(o,e.style,e),r.style={...o,...r.style}}return r}function jH(e=!1){return(n,a,r,{latestValues:o},s)=>{const d=(rC(n)?IH:gH)(a,o,s,n),u={...MH(a,typeof n=="string",e),...d,ref:r},{children:y}=a,k=C.useMemo(()=>Pe(y)?y.get():y,[y]);return C.createElement(n,{...u,children:k})}}function dP(e,{style:t,vars:n},a,r){Object.assign(e.style,t,r&&r.getProjectionStyles(a));for(const o in n)e.style.setProperty(o,n[o])}const hP=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]);function uP(e,t,n,a){dP(e,t,void 0,a);for(const r in t.attrs)e.setAttribute(hP.has(r)?r:tC(r),t.attrs[r])}function dC(e,t){const{style:n}=e,a={};for(const r in n)(Pe(n[r])||t.style&&Pe(t.style[r])||nP(r,e))&&(a[r]=n[r]);return a}function yP(e,t){const n=dC(e,t);for(const a in e)if(Pe(e[a])||Pe(t[a])){const r=Bi.indexOf(a)!==-1?"attr"+a.charAt(0).toUpperCase()+a.substring(1):a;n[r]=e[a]}return n}function hC(e,t,n,a={},r={}){return typeof t=="function"&&(t=t(n!==void 0?n:e.custom,a,r)),typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"&&(t=t(n!==void 0?n:e.custom,a,r)),t}function pP(e){const t=C.useRef(null);return t.current===null&&(t.current=e()),t.current}const DM=e=>Array.isArray(e),bH=e=>!!(e&&typeof e=="object"&&e.mix&&e.toValue),PH=e=>DM(e)?e[e.length-1]||0:e;function cM(e){const t=Pe(e)?e.get():e;return bH(t)?t.toValue():t}function AH({scrapeMotionValuesFromProps:e,createRenderState:t,onMount:n},a,r,o){const s={latestValues:zH(a,r,o,e),renderState:t()};return n&&(s.mount=c=>n(a,c,s)),s}const kP=e=>(t,n)=>{const a=C.useContext(i9),r=C.useContext(r9),o=()=>AH(e,t,a,r);return n?o():pP(o)};function zH(e,t,n,a){const r={},o=a(e,{});for(const k in o)r[k]=cM(o[k]);let{initial:s,animate:c}=e;const d=c9(e),h=eP(e);t&&h&&!d&&e.inherit!==!1&&(s===void 0&&(s=t.initial),c===void 0&&(c=t.animate));let u=n?n.initial===!1:!1;u=u||s===!1;const y=u?c:s;return y&&typeof y!="boolean"&&!s9(y)&&(Array.isArray(y)?y:[y]).forEach(g=>{const v=hC(e,g);if(!v)return;const{transitionEnd:x,transition:L,...m}=v;for(const p in m){let f=m[p];if(Array.isArray(f)){const M=u?f.length-1:0;f=f[M]}f!==null&&(r[p]=f)}for(const p in x)r[p]=x[p]}),r}const ee=e=>e;class FS{constructor(){this.order=[],this.scheduled=new Set}add(t){if(!this.scheduled.has(t))return this.scheduled.add(t),this.order.push(t),!0}remove(t){const n=this.order.indexOf(t);n!==-1&&(this.order.splice(n,1),this.scheduled.delete(t))}clear(){this.order.length=0,this.scheduled.clear()}}function VH(e){let t=new FS,n=new FS,a=0,r=!1,o=!1;const s=new WeakSet,c={schedule:(d,h=!1,u=!1)=>{const y=u&&r,k=y?t:n;return h&&s.add(d),k.add(d)&&y&&r&&(a=t.order.length),d},cancel:d=>{n.remove(d),s.delete(d)},process:d=>{if(r){o=!0;return}if(r=!0,[t,n]=[n,t],n.clear(),a=t.order.length,a)for(let h=0;h<a;h++){const u=t.order[h];u(d),s.has(u)&&(c.schedule(u),e())}r=!1,o&&(o=!1,c.process(d))}};return c}const cr=["prepare","read","update","preRender","render","postRender"],HH=40;function TH(e,t){let n=!1,a=!0;const r={delta:0,timestamp:0,isProcessing:!1},o=cr.reduce((y,k)=>(y[k]=VH(()=>n=!0),y),{}),s=y=>o[y].process(r),c=()=>{const y=performance.now();n=!1,r.delta=a?1e3/60:Math.max(Math.min(y-r.timestamp,HH),1),r.timestamp=y,r.isProcessing=!0,cr.forEach(s),r.isProcessing=!1,n&&t&&(a=!1,e(c))},d=()=>{n=!0,a=!0,r.isProcessing||e(c)};return{schedule:cr.reduce((y,k)=>{const g=o[k];return y[k]=(v,x=!1,L=!1)=>(n||d(),g.schedule(v,x,L)),y},{}),cancel:y=>cr.forEach(k=>o[k].cancel(y)),state:r,steps:o}}const{schedule:O,cancel:St,state:ke,steps:B9}=TH(typeof requestAnimationFrame<"u"?requestAnimationFrame:ee,!0),qH={useVisualState:kP({scrapeMotionValuesFromProps:yP,createRenderState:lP,onMount:(e,t,{renderState:n,latestValues:a})=>{O.read(()=>{try{n.dimensions=typeof t.getBBox=="function"?t.getBBox():t.getBoundingClientRect()}catch{n.dimensions={x:0,y:0,width:0,height:0}}}),O.render(()=>{cC(n,a,{enableHardwareAcceleration:!1},lC(t.tagName),e.transformTemplate),uP(t,n)})}})},DH={useVisualState:kP({scrapeMotionValuesFromProps:dC,createRenderState:sC})};function FH(e,{forwardMotionProps:t=!1},n,a){return{...rC(e)?qH:DH,preloadedFeatures:n,useRender:jH(t),createVisualElement:a,Component:e}}function ft(e,t,n,a={passive:!0}){return e.addEventListener(t,n,a),()=>e.removeEventListener(t,n)}const fP=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1;function d9(e,t="page"){return{point:{x:e[t+"X"],y:e[t+"Y"]}}}const RH=e=>t=>fP(t)&&e(t,d9(t));function xt(e,t,n,a){return ft(e,t,RH(n),a)}const BH=(e,t)=>n=>t(e(n)),Xt=(...e)=>e.reduce(BH);function mP(e){let t=null;return()=>{const n=()=>{t=null};return t===null?(t=e,n):!1}}const RS=mP("dragHorizontal"),BS=mP("dragVertical");function gP(e){let t=!1;if(e==="y")t=BS();else if(e==="x")t=RS();else{const n=RS(),a=BS();n&&a?t=()=>{n(),a()}:(n&&n(),a&&a())}return t}function xP(){const e=gP(!0);return e?(e(),!1):!0}class an{constructor(t){this.isMounted=!1,this.node=t}update(){}}function NS(e,t){const n="pointer"+(t?"enter":"leave"),a="onHover"+(t?"Start":"End"),r=(o,s)=>{if(o.pointerType==="touch"||xP())return;const c=e.getProps();e.animationState&&c.whileHover&&e.animationState.setActive("whileHover",t),c[a]&&O.update(()=>c[a](o,s))};return xt(e.current,n,r,{passive:!e.getProps()[a]})}class NH extends an{mount(){this.unmount=Xt(NS(this.node,!0),NS(this.node,!1))}unmount(){}}class EH extends an{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Xt(ft(this.node.current,"focus",()=>this.onFocus()),ft(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}const vP=(e,t)=>t?e===t?!0:vP(e,t.parentElement):!1;function N9(e,t){if(!t)return;const n=new PointerEvent("pointer"+e);t(n,d9(n))}class OH extends an{constructor(){super(...arguments),this.removeStartListeners=ee,this.removeEndListeners=ee,this.removeAccessibleListeners=ee,this.startPointerPress=(t,n)=>{if(this.isPressing)return;this.removeEndListeners();const a=this.node.getProps(),o=xt(window,"pointerup",(c,d)=>{if(!this.checkPressEnd())return;const{onTap:h,onTapCancel:u,globalTapTarget:y}=this.node.getProps();O.update(()=>{!y&&!vP(this.node.current,c.target)?u&&u(c,d):h&&h(c,d)})},{passive:!(a.onTap||a.onPointerUp)}),s=xt(window,"pointercancel",(c,d)=>this.cancelPress(c,d),{passive:!(a.onTapCancel||a.onPointerCancel)});this.removeEndListeners=Xt(o,s),this.startPress(t,n)},this.startAccessiblePress=()=>{const t=o=>{if(o.key!=="Enter"||this.isPressing)return;const s=c=>{c.key!=="Enter"||!this.checkPressEnd()||N9("up",(d,h)=>{const{onTap:u}=this.node.getProps();u&&O.update(()=>u(d,h))})};this.removeEndListeners(),this.removeEndListeners=ft(this.node.current,"keyup",s),N9("down",(c,d)=>{this.startPress(c,d)})},n=ft(this.node.current,"keydown",t),a=()=>{this.isPressing&&N9("cancel",(o,s)=>this.cancelPress(o,s))},r=ft(this.node.current,"blur",a);this.removeAccessibleListeners=Xt(n,r)}}startPress(t,n){this.isPressing=!0;const{onTapStart:a,whileTap:r}=this.node.getProps();r&&this.node.animationState&&this.node.animationState.setActive("whileTap",!0),a&&O.update(()=>a(t,n))}checkPressEnd(){return this.removeEndListeners(),this.isPressing=!1,this.node.getProps().whileTap&&this.node.animationState&&this.node.animationState.setActive("whileTap",!1),!xP()}cancelPress(t,n){if(!this.checkPressEnd())return;const{onTapCancel:a}=this.node.getProps();a&&O.update(()=>a(t,n))}mount(){const t=this.node.getProps(),n=xt(t.globalTapTarget?window:this.node.current,"pointerdown",this.startPointerPress,{passive:!(t.onTapStart||t.onPointerStart)}),a=ft(this.node.current,"focus",this.startAccessiblePress);this.removeStartListeners=Xt(n,a)}unmount(){this.removeStartListeners(),this.removeEndListeners(),this.removeAccessibleListeners()}}const Gw=new WeakMap,E9=new WeakMap,UH=e=>{const t=Gw.get(e.target);t&&t(e)},ZH=e=>{e.forEach(UH)};function _H({root:e,...t}){const n=e||document;E9.has(n)||E9.set(n,{});const a=E9.get(n),r=JSON.stringify(t);return a[r]||(a[r]=new IntersectionObserver(ZH,{root:e,...t})),a[r]}function WH(e,t,n){const a=_H(t);return Gw.set(e,n),a.observe(e),()=>{Gw.delete(e),a.unobserve(e)}}const GH={some:0,all:1};class $H extends an{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.unmount();const{viewport:t={}}=this.node.getProps(),{root:n,margin:a,amount:r="some",once:o}=t,s={root:n?n.current:void 0,rootMargin:a,threshold:typeof r=="number"?r:GH[r]},c=d=>{const{isIntersecting:h}=d;if(this.isInView===h||(this.isInView=h,o&&!h&&this.hasEnteredView))return;h&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",h);const{onViewportEnter:u,onViewportLeave:y}=this.node.getProps(),k=h?u:y;k&&k(d)};return WH(this.node.current,s,c)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(XH(t,n))&&this.startObserver()}unmount(){}}function XH({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const KH={inView:{Feature:$H},tap:{Feature:OH},focus:{Feature:EH},hover:{Feature:NH}};function MP(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let a=0;a<n;a++)if(t[a]!==e[a])return!1;return!0}function QH(e){const t={};return e.values.forEach((n,a)=>t[a]=n.get()),t}function YH(e){const t={};return e.values.forEach((n,a)=>t[a]=n.getVelocity()),t}function h9(e,t,n){const a=e.getProps();return hC(a,t,n!==void 0?n:a.custom,QH(e),YH(e))}let uC=ee;const b1=e=>e*1e3,vt=e=>e/1e3,JH={current:!1},wP=e=>Array.isArray(e)&&typeof e[0]=="number";function LP(e){return!!(!e||typeof e=="string"&&CP[e]||wP(e)||Array.isArray(e)&&e.every(LP))}const Oa=([e,t,n,a])=>`cubic-bezier(${e}, ${t}, ${n}, ${a})`,CP={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Oa([0,.65,.55,1]),circOut:Oa([.55,0,1,.45]),backIn:Oa([.31,.01,.66,-.59]),backOut:Oa([.33,1.53,.69,.99])};function SP(e){if(e)return wP(e)?Oa(e):Array.isArray(e)?e.map(SP):CP[e]}function eT(e,t,n,{delay:a=0,duration:r,repeat:o=0,repeatType:s="loop",ease:c,times:d}={}){const h={[t]:n};d&&(h.offset=d);const u=SP(c);return Array.isArray(u)&&(h.easing=u),e.animate(h,{delay:a,duration:r,easing:Array.isArray(u)?"linear":u,fill:"both",iterations:o+1,direction:s==="reverse"?"alternate":"normal"})}function tT(e,{repeat:t,repeatType:n="loop"}){const a=t&&n!=="loop"&&t%2===1?0:e.length-1;return e[a]}const IP=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,nT=1e-7,aT=12;function iT(e,t,n,a,r){let o,s,c=0;do s=t+(n-t)/2,o=IP(s,a,r)-e,o>0?n=s:t=s;while(Math.abs(o)>nT&&++c<aT);return s}function Oi(e,t,n,a){if(e===t&&n===a)return ee;const r=o=>iT(o,0,1,e,n);return o=>o===0||o===1?o:IP(r(o),t,a)}const rT=Oi(.42,0,1,1),oT=Oi(0,0,.58,1),jP=Oi(.42,0,.58,1),sT=e=>Array.isArray(e)&&typeof e[0]!="number",bP=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,PP=e=>t=>1-e(1-t),yC=e=>1-Math.sin(Math.acos(e)),AP=PP(yC),cT=bP(yC),zP=Oi(.33,1.53,.69,.99),pC=PP(zP),lT=bP(pC),dT=e=>(e*=2)<1?.5*pC(e):.5*(2-Math.pow(2,-10*(e-1))),hT={linear:ee,easeIn:rT,easeInOut:jP,easeOut:oT,circIn:yC,circInOut:cT,circOut:AP,backIn:pC,backInOut:lT,backOut:zP,anticipate:dT},ES=e=>{if(Array.isArray(e)){uC(e.length===4);const[t,n,a,r]=e;return Oi(t,n,a,r)}else if(typeof e=="string")return hT[e];return e},kC=(e,t)=>n=>!!(Ni(n)&&yH.test(n)&&n.startsWith(e)||t&&Object.prototype.hasOwnProperty.call(n,t)),VP=(e,t,n)=>a=>{if(!Ni(a))return a;const[r,o,s,c]=a.match(l9);return{[e]:parseFloat(r),[t]:parseFloat(o),[n]:parseFloat(s),alpha:c!==void 0?parseFloat(c):1}},uT=e=>Yt(0,255,e),O9={...R1,transform:e=>Math.round(uT(e))},g1={test:kC("rgb","red"),parse:VP("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:a=1})=>"rgba("+O9.transform(e)+", "+O9.transform(t)+", "+O9.transform(n)+", "+hi(di.transform(a))+")"};function yT(e){let t="",n="",a="",r="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),a=e.substring(5,7),r=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),a=e.substring(3,4),r=e.substring(4,5),t+=t,n+=n,a+=a,r+=r),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(a,16),alpha:r?parseInt(r,16)/255:1}}const $w={test:kC("#"),parse:yT,transform:g1.transform},ea={test:kC("hsl","hue"),parse:VP("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:a=1})=>"hsla("+Math.round(e)+", "+ht.transform(hi(t))+", "+ht.transform(hi(n))+", "+hi(di.transform(a))+")"},xe={test:e=>g1.test(e)||$w.test(e)||ea.test(e),parse:e=>g1.test(e)?g1.parse(e):ea.test(e)?ea.parse(e):$w.parse(e),transform:e=>Ni(e)?e:e.hasOwnProperty("red")?g1.transform(e):ea.transform(e)},$=(e,t,n)=>-n*e+n*t+e;function U9(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function pT({hue:e,saturation:t,lightness:n,alpha:a}){e/=360,t/=100,n/=100;let r=0,o=0,s=0;if(!t)r=o=s=n;else{const c=n<.5?n*(1+t):n+t-n*t,d=2*n-c;r=U9(d,c,e+1/3),o=U9(d,c,e),s=U9(d,c,e-1/3)}return{red:Math.round(r*255),green:Math.round(o*255),blue:Math.round(s*255),alpha:a}}const Z9=(e,t,n)=>{const a=e*e;return Math.sqrt(Math.max(0,n*(t*t-a)+a))},kT=[$w,g1,ea],fT=e=>kT.find(t=>t.test(e));function OS(e){const t=fT(e);let n=t.parse(e);return t===ea&&(n=pT(n)),n}const HP=(e,t)=>{const n=OS(e),a=OS(t),r={...n};return o=>(r.red=Z9(n.red,a.red,o),r.green=Z9(n.green,a.green,o),r.blue=Z9(n.blue,a.blue,o),r.alpha=$(n.alpha,a.alpha,o),g1.transform(r))};function mT(e){var t,n;return isNaN(e)&&Ni(e)&&(((t=e.match(l9))===null||t===void 0?void 0:t.length)||0)+(((n=e.match(rP))===null||n===void 0?void 0:n.length)||0)>0}const TP={regex:hH,countKey:"Vars",token:"${v}",parse:ee},qP={regex:rP,countKey:"Colors",token:"${c}",parse:xe.parse},DP={regex:l9,countKey:"Numbers",token:"${n}",parse:R1.parse};function _9(e,{regex:t,countKey:n,token:a,parse:r}){const o=e.tokenised.match(t);o&&(e["num"+n]=o.length,e.tokenised=e.tokenised.replace(t,a),e.values.push(...o.map(r)))}function FM(e){const t=e.toString(),n={value:t,tokenised:t,values:[],numVars:0,numColors:0,numNumbers:0};return n.value.includes("var(--")&&_9(n,TP),_9(n,qP),_9(n,DP),n}function FP(e){return FM(e).values}function RP(e){const{values:t,numColors:n,numVars:a,tokenised:r}=FM(e),o=t.length;return s=>{let c=r;for(let d=0;d<o;d++)d<a?c=c.replace(TP.token,s[d]):d<a+n?c=c.replace(qP.token,xe.transform(s[d])):c=c.replace(DP.token,hi(s[d]));return c}}const gT=e=>typeof e=="number"?0:e;function xT(e){const t=FP(e);return RP(e)(t.map(gT))}const Jt={test:mT,parse:FP,createTransformer:RP,getAnimatableNone:xT},BP=(e,t)=>n=>`${n>0?t:e}`;function NP(e,t){return typeof e=="number"?n=>$(e,t,n):xe.test(e)?HP(e,t):e.startsWith("var(")?BP(e,t):OP(e,t)}const EP=(e,t)=>{const n=[...e],a=n.length,r=e.map((o,s)=>NP(o,t[s]));return o=>{for(let s=0;s<a;s++)n[s]=r[s](o);return n}},vT=(e,t)=>{const n={...e,...t},a={};for(const r in n)e[r]!==void 0&&t[r]!==void 0&&(a[r]=NP(e[r],t[r]));return r=>{for(const o in a)n[o]=a[o](r);return n}},OP=(e,t)=>{const n=Jt.createTransformer(t),a=FM(e),r=FM(t);return a.numVars===r.numVars&&a.numColors===r.numColors&&a.numNumbers>=r.numNumbers?Xt(EP(a.values,r.values),n):BP(e,t)},Hi=(e,t,n)=>{const a=t-e;return a===0?1:(n-e)/a},US=(e,t)=>n=>$(e,t,n);function MT(e){return typeof e=="number"?US:typeof e=="string"?xe.test(e)?HP:OP:Array.isArray(e)?EP:typeof e=="object"?vT:US}function wT(e,t,n){const a=[],r=n||MT(e[0]),o=e.length-1;for(let s=0;s<o;s++){let c=r(e[s],e[s+1]);if(t){const d=Array.isArray(t)?t[s]||ee:t;c=Xt(d,c)}a.push(c)}return a}function UP(e,t,{clamp:n=!0,ease:a,mixer:r}={}){const o=e.length;if(uC(o===t.length),o===1)return()=>t[0];e[0]>e[o-1]&&(e=[...e].reverse(),t=[...t].reverse());const s=wT(t,a,r),c=s.length,d=h=>{let u=0;if(c>1)for(;u<e.length-2&&!(h<e[u+1]);u++);const y=Hi(e[u],e[u+1],h);return s[u](y)};return n?h=>d(Yt(e[0],e[o-1],h)):d}function LT(e,t){const n=e[e.length-1];for(let a=1;a<=t;a++){const r=Hi(0,t,a);e.push($(n,1,r))}}function CT(e){const t=[0];return LT(t,e.length-1),t}function ST(e,t){return e.map(n=>n*t)}function IT(e,t){return e.map(()=>t||jP).splice(0,e.length-1)}function RM({duration:e=300,keyframes:t,times:n,ease:a="easeInOut"}){const r=sT(a)?a.map(ES):ES(a),o={done:!1,value:t[0]},s=ST(n&&n.length===t.length?n:CT(t),e),c=UP(s,t,{ease:Array.isArray(r)?r:IT(t,r)});return{calculatedDuration:e,next:d=>(o.value=c(d),o.done=d>=e,o)}}function ZP(e,t){return t?e*(1e3/t):0}const jT=5;function _P(e,t,n){const a=Math.max(t-jT,0);return ZP(n-e(a),t-a)}const W9=.001,bT=.01,PT=10,AT=.05,zT=1;function VT({duration:e=800,bounce:t=.25,velocity:n=0,mass:a=1}){let r,o,s=1-t;s=Yt(AT,zT,s),e=Yt(bT,PT,vt(e)),s<1?(r=h=>{const u=h*s,y=u*e,k=u-n,g=Xw(h,s),v=Math.exp(-y);return W9-k/g*v},o=h=>{const y=h*s*e,k=y*n+n,g=Math.pow(s,2)*Math.pow(h,2)*e,v=Math.exp(-y),x=Xw(Math.pow(h,2),s);return(-r(h)+W9>0?-1:1)*((k-g)*v)/x}):(r=h=>{const u=Math.exp(-h*e),y=(h-n)*e+1;return-W9+u*y},o=h=>{const u=Math.exp(-h*e),y=(n-h)*(e*e);return u*y});const c=5/e,d=TT(r,o,c);if(e=b1(e),isNaN(d))return{stiffness:100,damping:10,duration:e};{const h=Math.pow(d,2)*a;return{stiffness:h,damping:s*2*Math.sqrt(a*h),duration:e}}}const HT=12;function TT(e,t,n){let a=n;for(let r=1;r<HT;r++)a=a-e(a)/t(a);return a}function Xw(e,t){return e*Math.sqrt(1-t*t)}const qT=["duration","bounce"],DT=["stiffness","damping","mass"];function ZS(e,t){return t.some(n=>e[n]!==void 0)}function FT(e){let t={velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1,...e};if(!ZS(e,DT)&&ZS(e,qT)){const n=VT(e);t={...t,...n,mass:1},t.isResolvedFromDuration=!0}return t}function WP({keyframes:e,restDelta:t,restSpeed:n,...a}){const r=e[0],o=e[e.length-1],s={done:!1,value:r},{stiffness:c,damping:d,mass:h,duration:u,velocity:y,isResolvedFromDuration:k}=FT({...a,velocity:-vt(a.velocity||0)}),g=y||0,v=d/(2*Math.sqrt(c*h)),x=o-r,L=vt(Math.sqrt(c/h)),m=Math.abs(x)<5;n||(n=m?.01:2),t||(t=m?.005:.5);let p;if(v<1){const f=Xw(L,v);p=M=>{const w=Math.exp(-v*L*M);return o-w*((g+v*L*x)/f*Math.sin(f*M)+x*Math.cos(f*M))}}else if(v===1)p=f=>o-Math.exp(-L*f)*(x+(g+L*x)*f);else{const f=L*Math.sqrt(v*v-1);p=M=>{const w=Math.exp(-v*L*M),I=Math.min(f*M,300);return o-w*((g+v*L*x)*Math.sinh(I)+f*x*Math.cosh(I))/f}}return{calculatedDuration:k&&u||null,next:f=>{const M=p(f);if(k)s.done=f>=u;else{let w=g;f!==0&&(v<1?w=_P(p,f,M):w=0);const I=Math.abs(w)<=n,b=Math.abs(o-M)<=t;s.done=I&&b}return s.value=s.done?o:M,s}}}function _S({keyframes:e,velocity:t=0,power:n=.8,timeConstant:a=325,bounceDamping:r=10,bounceStiffness:o=500,modifyTarget:s,min:c,max:d,restDelta:h=.5,restSpeed:u}){const y=e[0],k={done:!1,value:y},g=j=>c!==void 0&&j<c||d!==void 0&&j>d,v=j=>c===void 0?d:d===void 0||Math.abs(c-j)<Math.abs(d-j)?c:d;let x=n*t;const L=y+x,m=s===void 0?L:s(L);m!==L&&(x=m-y);const p=j=>-x*Math.exp(-j/a),f=j=>m+p(j),M=j=>{const z=p(j),H=f(j);k.done=Math.abs(z)<=h,k.value=k.done?m:H};let w,I;const b=j=>{g(k.value)&&(w=j,I=WP({keyframes:[k.value,v(k.value)],velocity:_P(f,j,k.value),damping:r,stiffness:o,restDelta:h,restSpeed:u}))};return b(0),{calculatedDuration:null,next:j=>{let z=!1;return!I&&w===void 0&&(z=!0,M(j),b(j)),w!==void 0&&j>w?I.next(j-w):(!z&&M(j),k)}}}const RT=e=>{const t=({timestamp:n})=>e(n);return{start:()=>O.update(t,!0),stop:()=>St(t),now:()=>ke.isProcessing?ke.timestamp:performance.now()}},WS=2e4;function GS(e){let t=0;const n=50;let a=e.next(t);for(;!a.done&&t<WS;)t+=n,a=e.next(t);return t>=WS?1/0:t}const BT={decay:_S,inertia:_S,tween:RM,keyframes:RM,spring:WP};function BM({autoplay:e=!0,delay:t=0,driver:n=RT,keyframes:a,type:r="keyframes",repeat:o=0,repeatDelay:s=0,repeatType:c="loop",onPlay:d,onStop:h,onComplete:u,onUpdate:y,...k}){let g=1,v=!1,x,L;const m=()=>{L=new Promise(q=>{x=q})};m();let p;const f=BT[r]||RM;let M;f!==RM&&typeof a[0]!="number"&&(M=UP([0,100],a,{clamp:!1}),a=[0,100]);const w=f({...k,keyframes:a});let I;c==="mirror"&&(I=f({...k,keyframes:[...a].reverse(),velocity:-(k.velocity||0)}));let b="idle",j=null,z=null,H=null;w.calculatedDuration===null&&o&&(w.calculatedDuration=GS(w));const{calculatedDuration:re}=w;let le=1/0,ge=1/0;re!==null&&(le=re+s,ge=le*(o+1)-s);let oe=0;const jt=q=>{if(z===null)return;g>0&&(z=Math.min(z,q)),g<0&&(z=Math.min(q-ge/g,z)),j!==null?oe=j:oe=Math.round(q-z)*g;const _=oe-t*(g>=0?1:-1),rn=g>=0?_<0:_>ge;oe=Math.max(_,0),b==="finished"&&j===null&&(oe=ge);let at=oe,B1=w;if(o){const u9=Math.min(oe,ge)/le;let Ui=Math.floor(u9),sn=u9%1;!sn&&u9>=1&&(sn=1),sn===1&&Ui--,Ui=Math.min(Ui,o+1),!!(Ui%2)&&(c==="reverse"?(sn=1-sn,s&&(sn-=s/le)):c==="mirror"&&(B1=I)),at=Yt(0,1,sn)*le}const Ae=rn?{done:!1,value:a[0]}:B1.next(at);M&&(Ae.value=M(Ae.value));let{done:on}=Ae;!rn&&re!==null&&(on=g>=0?oe>=ge:oe<=0);const xA=j===null&&(b==="finished"||b==="running"&&on);return y&&y(Ae.value),xA&&P(),Ae},Y=()=>{p&&p.stop(),p=void 0},Re=()=>{b="idle",Y(),x(),m(),z=H=null},P=()=>{b="finished",u&&u(),Y(),x()},T=()=>{if(v)return;p||(p=n(jt));const q=p.now();d&&d(),j!==null?z=q-j:(!z||b==="finished")&&(z=q),b==="finished"&&m(),H=z,j=null,b="running",p.start()};e&&T();const D={then(q,_){return L.then(q,_)},get time(){return vt(oe)},set time(q){q=b1(q),oe=q,j!==null||!p||g===0?j=q:z=p.now()-q/g},get duration(){const q=w.calculatedDuration===null?GS(w):w.calculatedDuration;return vt(q)},get speed(){return g},set speed(q){q===g||!p||(g=q,D.time=vt(oe))},get state(){return b},play:T,pause:()=>{b="paused",j=oe},stop:()=>{v=!0,b!=="idle"&&(b="idle",h&&h(),Re())},cancel:()=>{H!==null&&jt(H),Re()},complete:()=>{b="finished"},sample:q=>(z=0,jt(q))};return D}function NT(e){let t;return()=>(t===void 0&&(t=e()),t)}const ET=NT(()=>Object.hasOwnProperty.call(Element.prototype,"animate")),OT=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),lr=10,UT=2e4,ZT=(e,t)=>t.type==="spring"||e==="backgroundColor"||!LP(t.ease);function _T(e,t,{onUpdate:n,onComplete:a,...r}){if(!(ET()&&OT.has(t)&&!r.repeatDelay&&r.repeatType!=="mirror"&&r.damping!==0&&r.type!=="inertia"))return!1;let s=!1,c,d,h=!1;const u=()=>{d=new Promise(f=>{c=f})};u();let{keyframes:y,duration:k=300,ease:g,times:v}=r;if(ZT(t,r)){const f=BM({...r,repeat:0,delay:0});let M={done:!1,value:y[0]};const w=[];let I=0;for(;!M.done&&I<UT;)M=f.sample(I),w.push(M.value),I+=lr;v=void 0,y=w,k=I-lr,g="linear"}const x=eT(e.owner.current,t,y,{...r,duration:k,ease:g,times:v}),L=()=>{h=!1,x.cancel()},m=()=>{h=!0,O.update(L),c(),u()};return x.onfinish=()=>{h||(e.set(tT(y,r)),a&&a(),m())},{then(f,M){return d.then(f,M)},attachTimeline(f){return x.timeline=f,x.onfinish=null,ee},get time(){return vt(x.currentTime||0)},set time(f){x.currentTime=b1(f)},get speed(){return x.playbackRate},set speed(f){x.playbackRate=f},get duration(){return vt(k)},play:()=>{s||(x.play(),St(L))},pause:()=>x.pause(),stop:()=>{if(s=!0,x.playState==="idle")return;const{currentTime:f}=x;if(f){const M=BM({...r,autoplay:!1});e.setWithVelocity(M.sample(f-lr).value,M.sample(f).value,lr)}m()},complete:()=>{h||x.finish()},cancel:m}}function WT({keyframes:e,delay:t,onUpdate:n,onComplete:a}){const r=()=>(n&&n(e[e.length-1]),a&&a(),{time:0,speed:1,duration:0,play:ee,pause:ee,stop:ee,then:o=>(o(),Promise.resolve()),cancel:ee,complete:ee});return t?BM({keyframes:[0,1],duration:0,delay:t,onComplete:r}):r()}const GT={type:"spring",stiffness:500,damping:25,restSpeed:10},$T=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),XT={type:"keyframes",duration:.8},KT={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},QT=(e,{keyframes:t})=>t.length>2?XT:F1.has(e)?e.startsWith("scale")?$T(t[1]):GT:KT,Kw=(e,t)=>e==="zIndex"?!1:!!(typeof t=="number"||Array.isArray(t)||typeof t=="string"&&(Jt.test(t)||t==="0")&&!t.startsWith("url(")),YT=new Set(["brightness","contrast","saturate","opacity"]);function JT(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[a]=n.match(l9)||[];if(!a)return e;const r=n.replace(a,"");let o=YT.has(t)?1:0;return a!==n&&(o*=100),t+"("+o+r+")"}const eq=/([a-z-]*)\(.*?\)/g,Qw={...Jt,getAnimatableNone:e=>{const t=e.match(eq);return t?t.map(JT).join(" "):e}},tq={...oP,color:xe,backgroundColor:xe,outlineColor:xe,fill:xe,stroke:xe,borderColor:xe,borderTopColor:xe,borderRightColor:xe,borderBottomColor:xe,borderLeftColor:xe,filter:Qw,WebkitFilter:Qw},fC=e=>tq[e];function GP(e,t){let n=fC(e);return n!==Qw&&(n=Jt),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const $P=e=>/^0[^.\s]+$/.test(e);function nq(e){if(typeof e=="number")return e===0;if(e!==null)return e==="none"||e==="0"||$P(e)}function aq(e,t,n,a){const r=Kw(t,n);let o;Array.isArray(n)?o=[...n]:o=[null,n];const s=a.from!==void 0?a.from:e.get();let c;const d=[];for(let h=0;h<o.length;h++)o[h]===null&&(o[h]=h===0?s:o[h-1]),nq(o[h])&&d.push(h),typeof o[h]=="string"&&o[h]!=="none"&&o[h]!=="0"&&(c=o[h]);if(r&&d.length&&c)for(let h=0;h<d.length;h++){const u=d[h];o[u]=GP(t,c)}return o}function iq({when:e,delay:t,delayChildren:n,staggerChildren:a,staggerDirection:r,repeat:o,repeatType:s,repeatDelay:c,from:d,elapsed:h,...u}){return!!Object.keys(u).length}function mC(e,t){return e[t]||e.default||e}const rq={skipAnimations:!1},gC=(e,t,n,a={})=>r=>{const o=mC(a,e)||{},s=o.delay||a.delay||0;let{elapsed:c=0}=a;c=c-b1(s);const d=aq(t,e,n,o),h=d[0],u=d[d.length-1],y=Kw(e,h),k=Kw(e,u);let g={keyframes:d,velocity:t.getVelocity(),ease:"easeOut",...o,delay:-c,onUpdate:v=>{t.set(v),o.onUpdate&&o.onUpdate(v)},onComplete:()=>{r(),o.onComplete&&o.onComplete()}};if(iq(o)||(g={...g,...QT(e,g)}),g.duration&&(g.duration=b1(g.duration)),g.repeatDelay&&(g.repeatDelay=b1(g.repeatDelay)),!y||!k||JH.current||o.type===!1||rq.skipAnimations)return WT(g);if(!a.isHandoff&&t.owner&&t.owner.current instanceof HTMLElement&&!t.owner.getProps().onUpdate){const v=_T(t,e,g);if(v)return v}return BM(g)};function NM(e){return!!(Pe(e)&&e.add)}const XP=e=>/^\-?\d*\.?\d+$/.test(e);function xC(e,t){e.indexOf(t)===-1&&e.push(t)}function vC(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}class MC{constructor(){this.subscriptions=[]}add(t){return xC(this.subscriptions,t),()=>vC(this.subscriptions,t)}notify(t,n,a){const r=this.subscriptions.length;if(r)if(r===1)this.subscriptions[0](t,n,a);else for(let o=0;o<r;o++){const s=this.subscriptions[o];s&&s(t,n,a)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const oq=e=>!isNaN(parseFloat(e));class sq{constructor(t,n={}){this.version="10.18.0",this.timeDelta=0,this.lastUpdated=0,this.canTrackVelocity=!1,this.events={},this.updateAndNotify=(a,r=!0)=>{this.prev=this.current,this.current=a;const{delta:o,timestamp:s}=ke;this.lastUpdated!==s&&(this.timeDelta=o,this.lastUpdated=s,O.postRender(this.scheduleVelocityCheck)),this.prev!==this.current&&this.events.change&&this.events.change.notify(this.current),this.events.velocityChange&&this.events.velocityChange.notify(this.getVelocity()),r&&this.events.renderRequest&&this.events.renderRequest.notify(this.current)},this.scheduleVelocityCheck=()=>O.postRender(this.velocityCheck),this.velocityCheck=({timestamp:a})=>{a!==this.lastUpdated&&(this.prev=this.current,this.events.velocityChange&&this.events.velocityChange.notify(this.getVelocity()))},this.hasAnimated=!1,this.prev=this.current=t,this.canTrackVelocity=oq(this.current),this.owner=n.owner}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new MC);const a=this.events[t].add(n);return t==="change"?()=>{a(),O.read(()=>{this.events.change.getSize()||this.stop()})}:a}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t,n=!0){!n||!this.passiveEffect?this.updateAndNotify(t,n):this.passiveEffect(t,this.updateAndNotify)}setWithVelocity(t,n,a){this.set(n),this.prev=t,this.timeDelta=a}jump(t){this.updateAndNotify(t),this.prev=t,this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}get(){return this.current}getPrevious(){return this.prev}getVelocity(){return this.canTrackVelocity?ZP(parseFloat(this.current)-parseFloat(this.prev),this.timeDelta):0}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function La(e,t){return new sq(e,t)}const KP=e=>t=>t.test(e),cq={test:e=>e==="auto",parse:e=>e},QP=[R1,V,ht,Pt,kH,pH,cq],Da=e=>QP.find(KP(e)),lq=[...QP,xe,Jt],dq=e=>lq.find(KP(e));function hq(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,La(n))}function uq(e,t){const n=h9(e,t);let{transitionEnd:a={},transition:r={},...o}=n?e.makeTargetAnimatable(n,!1):{};o={...o,...a};for(const s in o){const c=PH(o[s]);hq(e,s,c)}}function yq(e,t,n){var a,r;const o=Object.keys(t).filter(c=>!e.hasValue(c)),s=o.length;if(s)for(let c=0;c<s;c++){const d=o[c],h=t[d];let u=null;Array.isArray(h)&&(u=h[0]),u===null&&(u=(r=(a=n[d])!==null&&a!==void 0?a:e.readValue(d))!==null&&r!==void 0?r:t[d]),u!=null&&(typeof u=="string"&&(XP(u)||$P(u))?u=parseFloat(u):!dq(u)&&Jt.test(h)&&(u=GP(d,h)),e.addValue(d,La(u,{owner:e})),n[d]===void 0&&(n[d]=u),u!==null&&e.setBaseTarget(d,u))}}function pq(e,t){return t?(t[e]||t.default||t).from:void 0}function kq(e,t,n){const a={};for(const r in e){const o=pq(r,t);if(o!==void 0)a[r]=o;else{const s=n.getValue(r);s&&(a[r]=s.get())}}return a}function fq({protectedKeys:e,needsAnimating:t},n){const a=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,a}function mq(e,t){const n=e.get();if(Array.isArray(t)){for(let a=0;a<t.length;a++)if(t[a]!==n)return!0}else return n!==t}function YP(e,t,{delay:n=0,transitionOverride:a,type:r}={}){let{transition:o=e.getDefaultTransition(),transitionEnd:s,...c}=e.makeTargetAnimatable(t);const d=e.getValue("willChange");a&&(o=a);const h=[],u=r&&e.animationState&&e.animationState.getState()[r];for(const y in c){const k=e.getValue(y),g=c[y];if(!k||g===void 0||u&&fq(u,y))continue;const v={delay:n,elapsed:0,...mC(o||{},y)};if(window.HandoffAppearAnimations){const m=e.getProps()[Jb];if(m){const p=window.HandoffAppearAnimations(m,y,k,O);p!==null&&(v.elapsed=p,v.isHandoff=!0)}}let x=!v.isHandoff&&!mq(k,g);if(v.type==="spring"&&(k.getVelocity()||v.velocity)&&(x=!1),k.animation&&(x=!1),x)continue;k.start(gC(y,k,g,e.shouldReduceMotion&&F1.has(y)?{type:!1}:v));const L=k.animation;NM(d)&&(d.add(y),L.then(()=>d.remove(y))),h.push(L)}return s&&Promise.all(h).then(()=>{s&&uq(e,s)}),h}function Yw(e,t,n={}){const a=h9(e,t,n.custom);let{transition:r=e.getDefaultTransition()||{}}=a||{};n.transitionOverride&&(r=n.transitionOverride);const o=a?()=>Promise.all(YP(e,a,n)):()=>Promise.resolve(),s=e.variantChildren&&e.variantChildren.size?(d=0)=>{const{delayChildren:h=0,staggerChildren:u,staggerDirection:y}=r;return gq(e,t,h+d,u,y,n)}:()=>Promise.resolve(),{when:c}=r;if(c){const[d,h]=c==="beforeChildren"?[o,s]:[s,o];return d().then(()=>h())}else return Promise.all([o(),s(n.delay)])}function gq(e,t,n=0,a=0,r=1,o){const s=[],c=(e.variantChildren.size-1)*a,d=r===1?(h=0)=>h*a:(h=0)=>c-h*a;return Array.from(e.variantChildren).sort(xq).forEach((h,u)=>{h.notify("AnimationStart",t),s.push(Yw(h,t,{...o,delay:n+d(u)}).then(()=>h.notify("AnimationComplete",t)))}),Promise.all(s)}function xq(e,t){return e.sortNodePosition(t)}function vq(e,t,n={}){e.notify("AnimationStart",t);let a;if(Array.isArray(t)){const r=t.map(o=>Yw(e,o,n));a=Promise.all(r)}else if(typeof t=="string")a=Yw(e,t,n);else{const r=typeof t=="function"?h9(e,t,n.custom):t;a=Promise.all(YP(e,r,n))}return a.then(()=>e.notify("AnimationComplete",t))}const Mq=[...nC].reverse(),wq=nC.length;function Lq(e){return t=>Promise.all(t.map(({animation:n,options:a})=>vq(e,n,a)))}function Cq(e){let t=Lq(e);const n=Iq();let a=!0;const r=(d,h)=>{const u=h9(e,h);if(u){const{transition:y,transitionEnd:k,...g}=u;d={...d,...g,...k}}return d};function o(d){t=d(e)}function s(d,h){const u=e.getProps(),y=e.getVariantContext(!0)||{},k=[],g=new Set;let v={},x=1/0;for(let m=0;m<wq;m++){const p=Mq[m],f=n[p],M=u[p]!==void 0?u[p]:y[p],w=zi(M),I=p===h?f.isActive:null;I===!1&&(x=m);let b=M===y[p]&&M!==u[p]&&w;if(b&&a&&e.manuallyAnimateOnMount&&(b=!1),f.protectedKeys={...v},!f.isActive&&I===null||!M&&!f.prevProp||s9(M)||typeof M=="boolean")continue;let z=Sq(f.prevProp,M)||p===h&&f.isActive&&!b&&w||m>x&&w,H=!1;const re=Array.isArray(M)?M:[M];let le=re.reduce(r,{});I===!1&&(le={});const{prevResolvedValues:ge={}}=f,oe={...ge,...le},jt=Y=>{z=!0,g.has(Y)&&(H=!0,g.delete(Y)),f.needsAnimating[Y]=!0};for(const Y in oe){const Re=le[Y],P=ge[Y];if(v.hasOwnProperty(Y))continue;let T=!1;DM(Re)&&DM(P)?T=!MP(Re,P):T=Re!==P,T?Re!==void 0?jt(Y):g.add(Y):Re!==void 0&&g.has(Y)?jt(Y):f.protectedKeys[Y]=!0}f.prevProp=M,f.prevResolvedValues=le,f.isActive&&(v={...v,...le}),a&&e.blockInitialAnimation&&(z=!1),z&&(!b||H)&&k.push(...re.map(Y=>({animation:Y,options:{type:p,...d}})))}if(g.size){const m={};g.forEach(p=>{const f=e.getBaseTarget(p);f!==void 0&&(m[p]=f)}),k.push({animation:m})}let L=!!k.length;return a&&(u.initial===!1||u.initial===u.animate)&&!e.manuallyAnimateOnMount&&(L=!1),a=!1,L?t(k):Promise.resolve()}function c(d,h,u){var y;if(n[d].isActive===h)return Promise.resolve();(y=e.variantChildren)===null||y===void 0||y.forEach(g=>{var v;return(v=g.animationState)===null||v===void 0?void 0:v.setActive(d,h)}),n[d].isActive=h;const k=s(u,d);for(const g in n)n[g].protectedKeys={};return k}return{animateChanges:s,setActive:c,setAnimateFunction:o,getState:()=>n}}function Sq(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!MP(t,e):!1}function cn(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Iq(){return{animate:cn(!0),whileInView:cn(),whileHover:cn(),whileTap:cn(),whileDrag:cn(),whileFocus:cn(),exit:cn()}}class jq extends an{constructor(t){super(t),t.animationState||(t.animationState=Cq(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();this.unmount(),s9(t)&&(this.unmount=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){}}let bq=0;class Pq extends an{constructor(){super(...arguments),this.id=bq++}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n,custom:a}=this.node.presenceContext,{isPresent:r}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===r)return;const o=this.node.animationState.setActive("exit",!t,{custom:a??this.node.getProps().custom});n&&!t&&o.then(()=>n(this.id))}mount(){const{register:t}=this.node.presenceContext||{};t&&(this.unmount=t(this.id))}unmount(){}}const Aq={animation:{Feature:jq},exit:{Feature:Pq}},$S=(e,t)=>Math.abs(e-t);function zq(e,t){const n=$S(e.x,t.x),a=$S(e.y,t.y);return Math.sqrt(n**2+a**2)}class JP{constructor(t,n,{transformPagePoint:a,contextWindow:r,dragSnapToOrigin:o=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const y=$9(this.lastMoveEventInfo,this.history),k=this.startEvent!==null,g=zq(y.offset,{x:0,y:0})>=3;if(!k&&!g)return;const{point:v}=y,{timestamp:x}=ke;this.history.push({...v,timestamp:x});const{onStart:L,onMove:m}=this.handlers;k||(L&&L(this.lastMoveEvent,y),this.startEvent=this.lastMoveEvent),m&&m(this.lastMoveEvent,y)},this.handlePointerMove=(y,k)=>{this.lastMoveEvent=y,this.lastMoveEventInfo=G9(k,this.transformPagePoint),O.update(this.updatePoint,!0)},this.handlePointerUp=(y,k)=>{this.end();const{onEnd:g,onSessionEnd:v,resumeAnimation:x}=this.handlers;if(this.dragSnapToOrigin&&x&&x(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const L=$9(y.type==="pointercancel"?this.lastMoveEventInfo:G9(k,this.transformPagePoint),this.history);this.startEvent&&g&&g(y,L),v&&v(y,L)},!fP(t))return;this.dragSnapToOrigin=o,this.handlers=n,this.transformPagePoint=a,this.contextWindow=r||window;const s=d9(t),c=G9(s,this.transformPagePoint),{point:d}=c,{timestamp:h}=ke;this.history=[{...d,timestamp:h}];const{onSessionStart:u}=n;u&&u(t,$9(c,this.history)),this.removeListeners=Xt(xt(this.contextWindow,"pointermove",this.handlePointerMove),xt(this.contextWindow,"pointerup",this.handlePointerUp),xt(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),St(this.updatePoint)}}function G9(e,t){return t?{point:t(e.point)}:e}function XS(e,t){return{x:e.x-t.x,y:e.y-t.y}}function $9({point:e},t){return{point:e,delta:XS(e,eA(t)),offset:XS(e,Vq(t)),velocity:Hq(t,.1)}}function Vq(e){return e[0]}function eA(e){return e[e.length-1]}function Hq(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,a=null;const r=eA(e);for(;n>=0&&(a=e[n],!(r.timestamp-a.timestamp>b1(t)));)n--;if(!a)return{x:0,y:0};const o=vt(r.timestamp-a.timestamp);if(o===0)return{x:0,y:0};const s={x:(r.x-a.x)/o,y:(r.y-a.y)/o};return s.x===1/0&&(s.x=0),s.y===1/0&&(s.y=0),s}function qe(e){return e.max-e.min}function Jw(e,t=0,n=.01){return Math.abs(e-t)<=n}function KS(e,t,n,a=.5){e.origin=a,e.originPoint=$(t.min,t.max,e.origin),e.scale=qe(n)/qe(t),(Jw(e.scale,1,1e-4)||isNaN(e.scale))&&(e.scale=1),e.translate=$(n.min,n.max,e.origin)-e.originPoint,(Jw(e.translate)||isNaN(e.translate))&&(e.translate=0)}function ui(e,t,n,a){KS(e.x,t.x,n.x,a?a.originX:void 0),KS(e.y,t.y,n.y,a?a.originY:void 0)}function QS(e,t,n){e.min=n.min+t.min,e.max=e.min+qe(t)}function Tq(e,t,n){QS(e.x,t.x,n.x),QS(e.y,t.y,n.y)}function YS(e,t,n){e.min=t.min-n.min,e.max=e.min+qe(t)}function yi(e,t,n){YS(e.x,t.x,n.x),YS(e.y,t.y,n.y)}function qq(e,{min:t,max:n},a){return t!==void 0&&e<t?e=a?$(t,e,a.min):Math.max(e,t):n!==void 0&&e>n&&(e=a?$(n,e,a.max):Math.min(e,n)),e}function JS(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function Dq(e,{top:t,left:n,bottom:a,right:r}){return{x:JS(e.x,n,r),y:JS(e.y,t,a)}}function eI(e,t){let n=t.min-e.min,a=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,a]=[a,n]),{min:n,max:a}}function Fq(e,t){return{x:eI(e.x,t.x),y:eI(e.y,t.y)}}function Rq(e,t){let n=.5;const a=qe(e),r=qe(t);return r>a?n=Hi(t.min,t.max-a,e.min):a>r&&(n=Hi(e.min,e.max-r,t.min)),Yt(0,1,n)}function Bq(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const eL=.35;function Nq(e=eL){return e===!1?e=0:e===!0&&(e=eL),{x:tI(e,"left","right"),y:tI(e,"top","bottom")}}function tI(e,t,n){return{min:nI(e,t),max:nI(e,n)}}function nI(e,t){return typeof e=="number"?e:e[t]||0}const aI=()=>({translate:0,scale:1,origin:0,originPoint:0}),ta=()=>({x:aI(),y:aI()}),iI=()=>({min:0,max:0}),te=()=>({x:iI(),y:iI()});function Ne(e){return[e("x"),e("y")]}function tA({top:e,left:t,right:n,bottom:a}){return{x:{min:t,max:n},y:{min:e,max:a}}}function Eq({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function Oq(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),a=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:a.y,right:a.x}}function X9(e){return e===void 0||e===1}function tL({scale:e,scaleX:t,scaleY:n}){return!X9(e)||!X9(t)||!X9(n)}function u1(e){return tL(e)||nA(e)||e.z||e.rotate||e.rotateX||e.rotateY}function nA(e){return rI(e.x)||rI(e.y)}function rI(e){return e&&e!=="0%"}function EM(e,t,n){const a=e-n,r=t*a;return n+r}function oI(e,t,n,a,r){return r!==void 0&&(e=EM(e,r,a)),EM(e,n,a)+t}function nL(e,t=0,n=1,a,r){e.min=oI(e.min,t,n,a,r),e.max=oI(e.max,t,n,a,r)}function aA(e,{x:t,y:n}){nL(e.x,t.translate,t.scale,t.originPoint),nL(e.y,n.translate,n.scale,n.originPoint)}function Uq(e,t,n,a=!1){const r=n.length;if(!r)return;t.x=t.y=1;let o,s;for(let c=0;c<r;c++){o=n[c],s=o.projectionDelta;const d=o.instance;d&&d.style&&d.style.display==="contents"||(a&&o.options.layoutScroll&&o.scroll&&o!==o.root&&na(e,{x:-o.scroll.offset.x,y:-o.scroll.offset.y}),s&&(t.x*=s.x.scale,t.y*=s.y.scale,aA(e,s)),a&&u1(o.latestValues)&&na(e,o.latestValues))}t.x=sI(t.x),t.y=sI(t.y)}function sI(e){return Number.isInteger(e)||e>1.0000000000001||e<.999999999999?e:1}function Ht(e,t){e.min=e.min+t,e.max=e.max+t}function cI(e,t,[n,a,r]){const o=t[r]!==void 0?t[r]:.5,s=$(e.min,e.max,o);nL(e,t[n],t[a],s,t.scale)}const Zq=["x","scaleX","originX"],_q=["y","scaleY","originY"];function na(e,t){cI(e.x,t,Zq),cI(e.y,t,_q)}function iA(e,t){return tA(Oq(e.getBoundingClientRect(),t))}function Wq(e,t,n){const a=iA(e,n),{scroll:r}=t;return r&&(Ht(a.x,r.offset.x),Ht(a.y,r.offset.y)),a}const rA=({current:e})=>e?e.ownerDocument.defaultView:null,Gq=new WeakMap;class $q{constructor(t){this.openGlobalLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=te(),this.visualElement=t}start(t,{snapToCursor:n=!1}={}){const{presenceContext:a}=this.visualElement;if(a&&a.isPresent===!1)return;const r=u=>{const{dragSnapToOrigin:y}=this.getProps();y?this.pauseAnimation():this.stopAnimation(),n&&this.snapToCursor(d9(u,"page").point)},o=(u,y)=>{const{drag:k,dragPropagation:g,onDragStart:v}=this.getProps();if(k&&!g&&(this.openGlobalLock&&this.openGlobalLock(),this.openGlobalLock=gP(k),!this.openGlobalLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Ne(L=>{let m=this.getAxisMotionValue(L).get()||0;if(ht.test(m)){const{projection:p}=this.visualElement;if(p&&p.layout){const f=p.layout.layoutBox[L];f&&(m=qe(f)*(parseFloat(m)/100))}}this.originPoint[L]=m}),v&&O.update(()=>v(u,y),!1,!0);const{animationState:x}=this.visualElement;x&&x.setActive("whileDrag",!0)},s=(u,y)=>{const{dragPropagation:k,dragDirectionLock:g,onDirectionLock:v,onDrag:x}=this.getProps();if(!k&&!this.openGlobalLock)return;const{offset:L}=y;if(g&&this.currentDirection===null){this.currentDirection=Xq(L),this.currentDirection!==null&&v&&v(this.currentDirection);return}this.updateAxis("x",y.point,L),this.updateAxis("y",y.point,L),this.visualElement.render(),x&&x(u,y)},c=(u,y)=>this.stop(u,y),d=()=>Ne(u=>{var y;return this.getAnimationState(u)==="paused"&&((y=this.getAxisMotionValue(u).animation)===null||y===void 0?void 0:y.play())}),{dragSnapToOrigin:h}=this.getProps();this.panSession=new JP(t,{onSessionStart:r,onStart:o,onMove:s,onSessionEnd:c,resumeAnimation:d},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:h,contextWindow:rA(this.visualElement)})}stop(t,n){const a=this.isDragging;if(this.cancel(),!a)return;const{velocity:r}=n;this.startAnimation(r);const{onDragEnd:o}=this.getProps();o&&O.update(()=>o(t,n))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:a}=this.getProps();!a&&this.openGlobalLock&&(this.openGlobalLock(),this.openGlobalLock=null),n&&n.setActive("whileDrag",!1)}updateAxis(t,n,a){const{drag:r}=this.getProps();if(!a||!dr(t,r,this.currentDirection))return;const o=this.getAxisMotionValue(t);let s=this.originPoint[t]+a[t];this.constraints&&this.constraints[t]&&(s=qq(s,this.constraints[t],this.elastic[t])),o.set(s)}resolveConstraints(){var t;const{dragConstraints:n,dragElastic:a}=this.getProps(),r=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(t=this.visualElement.projection)===null||t===void 0?void 0:t.layout,o=this.constraints;n&&J1(n)?this.constraints||(this.constraints=this.resolveRefConstraints()):n&&r?this.constraints=Dq(r.layoutBox,n):this.constraints=!1,this.elastic=Nq(a),o!==this.constraints&&r&&this.constraints&&!this.hasMutatedConstraints&&Ne(s=>{this.getAxisMotionValue(s)&&(this.constraints[s]=Bq(r.layoutBox[s],this.constraints[s]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!J1(t))return!1;const a=t.current,{projection:r}=this.visualElement;if(!r||!r.layout)return!1;const o=Wq(a,r.root,this.visualElement.getTransformPagePoint());let s=Fq(r.layout.layoutBox,o);if(n){const c=n(Eq(s));this.hasMutatedConstraints=!!c,c&&(s=tA(c))}return s}startAnimation(t){const{drag:n,dragMomentum:a,dragElastic:r,dragTransition:o,dragSnapToOrigin:s,onDragTransitionEnd:c}=this.getProps(),d=this.constraints||{},h=Ne(u=>{if(!dr(u,n,this.currentDirection))return;let y=d&&d[u]||{};s&&(y={min:0,max:0});const k=r?200:1e6,g=r?40:1e7,v={type:"inertia",velocity:a?t[u]:0,bounceStiffness:k,bounceDamping:g,timeConstant:750,restDelta:1,restSpeed:10,...o,...y};return this.startAxisValueAnimation(u,v)});return Promise.all(h).then(c)}startAxisValueAnimation(t,n){const a=this.getAxisMotionValue(t);return a.start(gC(t,a,0,n))}stopAnimation(){Ne(t=>this.getAxisMotionValue(t).stop())}pauseAnimation(){Ne(t=>{var n;return(n=this.getAxisMotionValue(t).animation)===null||n===void 0?void 0:n.pause()})}getAnimationState(t){var n;return(n=this.getAxisMotionValue(t).animation)===null||n===void 0?void 0:n.state}getAxisMotionValue(t){const n="_drag"+t.toUpperCase(),a=this.visualElement.getProps(),r=a[n];return r||this.visualElement.getValue(t,(a.initial?a.initial[t]:void 0)||0)}snapToCursor(t){Ne(n=>{const{drag:a}=this.getProps();if(!dr(n,a,this.currentDirection))return;const{projection:r}=this.visualElement,o=this.getAxisMotionValue(n);if(r&&r.layout){const{min:s,max:c}=r.layout.layoutBox[n];o.set(t[n]-$(s,c,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:a}=this.visualElement;if(!J1(n)||!a||!this.constraints)return;this.stopAnimation();const r={x:0,y:0};Ne(s=>{const c=this.getAxisMotionValue(s);if(c){const d=c.get();r[s]=Rq({min:d,max:d},this.constraints[s])}});const{transformTemplate:o}=this.visualElement.getProps();this.visualElement.current.style.transform=o?o({},""):"none",a.root&&a.root.updateScroll(),a.updateLayout(),this.resolveConstraints(),Ne(s=>{if(!dr(s,t,null))return;const c=this.getAxisMotionValue(s),{min:d,max:h}=this.constraints[s];c.set($(d,h,r[s]))})}addListeners(){if(!this.visualElement.current)return;Gq.set(this.visualElement,this);const t=this.visualElement.current,n=xt(t,"pointerdown",d=>{const{drag:h,dragListener:u=!0}=this.getProps();h&&u&&this.start(d)}),a=()=>{const{dragConstraints:d}=this.getProps();J1(d)&&(this.constraints=this.resolveRefConstraints())},{projection:r}=this.visualElement,o=r.addEventListener("measure",a);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),a();const s=ft(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",({delta:d,hasLayoutChanged:h})=>{this.isDragging&&h&&(Ne(u=>{const y=this.getAxisMotionValue(u);y&&(this.originPoint[u]+=d[u].translate,y.set(y.get()+d[u].translate))}),this.visualElement.render())});return()=>{s(),n(),o(),c&&c()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:a=!1,dragPropagation:r=!1,dragConstraints:o=!1,dragElastic:s=eL,dragMomentum:c=!0}=t;return{...t,drag:n,dragDirectionLock:a,dragPropagation:r,dragConstraints:o,dragElastic:s,dragMomentum:c}}}function dr(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function Xq(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class Kq extends an{constructor(t){super(t),this.removeGroupControls=ee,this.removeListeners=ee,this.controls=new $q(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||ee}unmount(){this.removeGroupControls(),this.removeListeners()}}const lI=e=>(t,n)=>{e&&O.update(()=>e(t,n))};class Qq extends an{constructor(){super(...arguments),this.removePointerDownListener=ee}onPointerDown(t){this.session=new JP(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:rA(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:a,onPanEnd:r}=this.node.getProps();return{onSessionStart:lI(t),onStart:lI(n),onMove:a,onEnd:(o,s)=>{delete this.session,r&&O.update(()=>r(o,s))}}}mount(){this.removePointerDownListener=xt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}function Yq(){const e=C.useContext(r9);if(e===null)return[!0,null];const{isPresent:t,onExitComplete:n,register:a}=e,r=C.useId();return C.useEffect(()=>a(r),[]),!t&&n?[!1,()=>n&&n(r)]:[!0]}const lM={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function dI(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const Fa={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if(V.test(e))e=parseFloat(e);else return e;const n=dI(e,t.target.x),a=dI(e,t.target.y);return`${n}% ${a}%`}},Jq={correct:(e,{treeScale:t,projectionDelta:n})=>{const a=e,r=Jt.parse(e);if(r.length>5)return a;const o=Jt.createTransformer(e),s=typeof r[0]!="number"?1:0,c=n.x.scale*t.x,d=n.y.scale*t.y;r[0+s]/=c,r[1+s]/=d;const h=$(c,d,.5);return typeof r[2+s]=="number"&&(r[2+s]/=h),typeof r[3+s]=="number"&&(r[3+s]/=h),o(r)}};class eD extends lL.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:a,layoutId:r}=this.props,{projection:o}=t;sH(tD),o&&(n.group&&n.group.add(o),a&&a.register&&r&&a.register(o),o.root.didUpdate(),o.addEventListener("animationComplete",()=>{this.safeToRemove()}),o.setOptions({...o.options,onExitComplete:()=>this.safeToRemove()})),lM.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:a,drag:r,isPresent:o}=this.props,s=a.projection;return s&&(s.isPresent=o,r||t.layoutDependency!==n||n===void 0?s.willUpdate():this.safeToRemove(),t.isPresent!==o&&(o?s.promote():s.relegate()||O.postRender(()=>{const c=s.getStack();(!c||!c.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:t}=this.props.visualElement;t&&(t.root.didUpdate(),queueMicrotask(()=>{!t.currentAnimation&&t.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:a}=this.props,{projection:r}=t;r&&(r.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(r),a&&a.deregister&&a.deregister(r))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function oA(e){const[t,n]=Yq(),a=C.useContext(iC);return lL.createElement(eD,{...e,layoutGroup:a,switchLayoutGroup:C.useContext(tP),isPresent:t,safeToRemove:n})}const tD={borderRadius:{...Fa,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Fa,borderTopRightRadius:Fa,borderBottomLeftRadius:Fa,borderBottomRightRadius:Fa,boxShadow:Jq},sA=["TopLeft","TopRight","BottomLeft","BottomRight"],nD=sA.length,hI=e=>typeof e=="string"?parseFloat(e):e,uI=e=>typeof e=="number"||V.test(e);function aD(e,t,n,a,r,o){r?(e.opacity=$(0,n.opacity!==void 0?n.opacity:1,iD(a)),e.opacityExit=$(t.opacity!==void 0?t.opacity:1,0,rD(a))):o&&(e.opacity=$(t.opacity!==void 0?t.opacity:1,n.opacity!==void 0?n.opacity:1,a));for(let s=0;s<nD;s++){const c=`border${sA[s]}Radius`;let d=yI(t,c),h=yI(n,c);if(d===void 0&&h===void 0)continue;d||(d=0),h||(h=0),d===0||h===0||uI(d)===uI(h)?(e[c]=Math.max($(hI(d),hI(h),a),0),(ht.test(h)||ht.test(d))&&(e[c]+="%")):e[c]=h}(t.rotate||n.rotate)&&(e.rotate=$(t.rotate||0,n.rotate||0,a))}function yI(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const iD=cA(0,.5,AP),rD=cA(.5,.95,ee);function cA(e,t,n){return a=>a<e?0:a>t?1:n(Hi(e,t,a))}function pI(e,t){e.min=t.min,e.max=t.max}function Be(e,t){pI(e.x,t.x),pI(e.y,t.y)}function kI(e,t,n,a,r){return e-=t,e=EM(e,1/n,a),r!==void 0&&(e=EM(e,1/r,a)),e}function oD(e,t=0,n=1,a=.5,r,o=e,s=e){if(ht.test(t)&&(t=parseFloat(t),t=$(s.min,s.max,t/100)-s.min),typeof t!="number")return;let c=$(o.min,o.max,a);e===o&&(c-=t),e.min=kI(e.min,t,n,c,r),e.max=kI(e.max,t,n,c,r)}function fI(e,t,[n,a,r],o,s){oD(e,t[n],t[a],t[r],t.scale,o,s)}const sD=["x","scaleX","originX"],cD=["y","scaleY","originY"];function mI(e,t,n,a){fI(e.x,t,sD,n?n.x:void 0,a?a.x:void 0),fI(e.y,t,cD,n?n.y:void 0,a?a.y:void 0)}function gI(e){return e.translate===0&&e.scale===1}function lA(e){return gI(e.x)&&gI(e.y)}function lD(e,t){return e.x.min===t.x.min&&e.x.max===t.x.max&&e.y.min===t.y.min&&e.y.max===t.y.max}function dA(e,t){return Math.round(e.x.min)===Math.round(t.x.min)&&Math.round(e.x.max)===Math.round(t.x.max)&&Math.round(e.y.min)===Math.round(t.y.min)&&Math.round(e.y.max)===Math.round(t.y.max)}function xI(e){return qe(e.x)/qe(e.y)}class dD{constructor(){this.members=[]}add(t){xC(this.members,t),t.scheduleRender()}remove(t){if(vC(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){const n=this.members.findIndex(r=>t===r);if(n===0)return!1;let a;for(let r=n;r>=0;r--){const o=this.members[r];if(o.isPresent!==!1){a=o;break}}return a?(this.promote(a),!0):!1}promote(t,n){const a=this.lead;if(t!==a&&(this.prevLead=a,this.lead=t,t.show(),a)){a.instance&&a.scheduleRender(),t.scheduleRender(),t.resumeFrom=a,n&&(t.resumeFrom.preserveOpacity=!0),a.snapshot&&(t.snapshot=a.snapshot,t.snapshot.latestValues=a.animationValues||a.latestValues),t.root&&t.root.isUpdating&&(t.isLayoutDirty=!0);const{crossfade:r}=t.options;r===!1&&a.hide()}}exitAnimationComplete(){this.members.forEach(t=>{const{options:n,resumingFrom:a}=t;n.onExitComplete&&n.onExitComplete(),a&&a.options.onExitComplete&&a.options.onExitComplete()})}scheduleRender(){this.members.forEach(t=>{t.instance&&t.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function vI(e,t,n){let a="";const r=e.x.translate/t.x,o=e.y.translate/t.y;if((r||o)&&(a=`translate3d(${r}px, ${o}px, 0) `),(t.x!==1||t.y!==1)&&(a+=`scale(${1/t.x}, ${1/t.y}) `),n){const{rotate:d,rotateX:h,rotateY:u}=n;d&&(a+=`rotate(${d}deg) `),h&&(a+=`rotateX(${h}deg) `),u&&(a+=`rotateY(${u}deg) `)}const s=e.x.scale*t.x,c=e.y.scale*t.y;return(s!==1||c!==1)&&(a+=`scale(${s}, ${c})`),a||"none"}const hD=(e,t)=>e.depth-t.depth;class uD{constructor(){this.children=[],this.isDirty=!1}add(t){xC(this.children,t),this.isDirty=!0}remove(t){vC(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(hD),this.isDirty=!1,this.children.forEach(t)}}function yD(e,t){const n=performance.now(),a=({timestamp:r})=>{const o=r-n;o>=t&&(St(a),e(o-t))};return O.read(a,!0),()=>St(a)}function pD(e){window.MotionDebug&&window.MotionDebug.record(e)}function kD(e){return e instanceof SVGElement&&e.tagName!=="svg"}function fD(e,t,n){const a=Pe(e)?e:La(e);return a.start(gC("",a,t,n)),a.animation}const MI=["","X","Y","Z"],mD={visibility:"hidden"},wI=1e3;let gD=0;const y1={type:"projectionFrame",totalNodes:0,resolvedTargetDeltas:0,recalculatedProjection:0};function hA({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:a,resetTransform:r}){return class{constructor(s={},c=t==null?void 0:t()){this.id=gD++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,y1.totalNodes=y1.resolvedTargetDeltas=y1.recalculatedProjection=0,this.nodes.forEach(MD),this.nodes.forEach(ID),this.nodes.forEach(jD),this.nodes.forEach(wD),pD(y1)},this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=s,this.root=c?c.root||c:this,this.path=c?[...c.path,c]:[],this.parent=c,this.depth=c?c.depth+1:0;for(let d=0;d<this.path.length;d++)this.path[d].shouldResetTransform=!0;this.root===this&&(this.nodes=new uD)}addEventListener(s,c){return this.eventHandlers.has(s)||this.eventHandlers.set(s,new MC),this.eventHandlers.get(s).add(c)}notifyListeners(s,...c){const d=this.eventHandlers.get(s);d&&d.notify(...c)}hasListeners(s){return this.eventHandlers.has(s)}mount(s,c=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=kD(s),this.instance=s;const{layoutId:d,layout:h,visualElement:u}=this.options;if(u&&!u.current&&u.mount(s),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),c&&(h||d)&&(this.isLayoutDirty=!0),e){let y;const k=()=>this.root.updateBlockedByResize=!1;e(s,()=>{this.root.updateBlockedByResize=!0,y&&y(),y=yD(k,250),lM.hasAnimatedSinceResize&&(lM.hasAnimatedSinceResize=!1,this.nodes.forEach(CI))})}d&&this.root.registerSharedNode(d,this),this.options.animate!==!1&&u&&(d||h)&&this.addEventListener("didUpdate",({delta:y,hasLayoutChanged:k,hasRelativeTargetChanged:g,layout:v})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const x=this.options.transition||u.getDefaultTransition()||VD,{onLayoutAnimationStart:L,onLayoutAnimationComplete:m}=u.getProps(),p=!this.targetLayout||!dA(this.targetLayout,v)||g,f=!k&&g;if(this.options.layoutRoot||this.resumeFrom&&this.resumeFrom.instance||f||k&&(p||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(y,f);const M={...mC(x,"layout"),onPlay:L,onComplete:m};(u.shouldReduceMotion||this.options.layoutRoot)&&(M.delay=0,M.type=!1),this.startAnimation(M)}else k||CI(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=v})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const s=this.getStack();s&&s.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,St(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(bD),this.animationId++)}getTransformTemplate(){const{visualElement:s}=this.options;return s&&s.getProps().transformTemplate}willUpdate(s=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const y=this.path[u];y.shouldResetTransform=!0,y.updateScroll("snapshot"),y.options.layoutRoot&&y.willUpdate(!1)}const{layoutId:c,layout:d}=this.options;if(c===void 0&&!d)return;const h=this.getTransformTemplate();this.prevTransformTemplateValue=h?h(this.latestValues,""):void 0,this.updateSnapshot(),s&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(LI);return}this.isUpdating||this.nodes.forEach(CD),this.isUpdating=!1,this.nodes.forEach(SD),this.nodes.forEach(xD),this.nodes.forEach(vD),this.clearAllSnapshots();const c=performance.now();ke.delta=Yt(0,1e3/60,c-ke.timestamp),ke.timestamp=c,ke.isProcessing=!0,B9.update.process(ke),B9.preRender.process(ke),B9.render.process(ke),ke.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,queueMicrotask(()=>this.update()))}clearAllSnapshots(){this.nodes.forEach(LD),this.sharedNodes.forEach(PD)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,O.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){O.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure())}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let d=0;d<this.path.length;d++)this.path[d].updateScroll();const s=this.layout;this.layout=this.measure(!1),this.layoutCorrected=te(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:c}=this.options;c&&c.notify("LayoutMeasure",this.layout.layoutBox,s?s.layoutBox:void 0)}updateScroll(s="measure"){let c=!!(this.options.layoutScroll&&this.instance);this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===s&&(c=!1),c&&(this.scroll={animationId:this.root.animationId,phase:s,isRoot:a(this.instance),offset:n(this.instance)})}resetTransform(){if(!r)return;const s=this.isLayoutDirty||this.shouldResetTransform,c=this.projectionDelta&&!lA(this.projectionDelta),d=this.getTransformTemplate(),h=d?d(this.latestValues,""):void 0,u=h!==this.prevTransformTemplateValue;s&&(c||u1(this.latestValues)||u)&&(r(this.instance,h),this.shouldResetTransform=!1,this.scheduleRender())}measure(s=!0){const c=this.measurePageBox();let d=this.removeElementScroll(c);return s&&(d=this.removeTransform(d)),HD(d),{animationId:this.root.animationId,measuredBox:c,layoutBox:d,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:s}=this.options;if(!s)return te();const c=s.measureViewportBox(),{scroll:d}=this.root;return d&&(Ht(c.x,d.offset.x),Ht(c.y,d.offset.y)),c}removeElementScroll(s){const c=te();Be(c,s);for(let d=0;d<this.path.length;d++){const h=this.path[d],{scroll:u,options:y}=h;if(h!==this.root&&u&&y.layoutScroll){if(u.isRoot){Be(c,s);const{scroll:k}=this.root;k&&(Ht(c.x,-k.offset.x),Ht(c.y,-k.offset.y))}Ht(c.x,u.offset.x),Ht(c.y,u.offset.y)}}return c}applyTransform(s,c=!1){const d=te();Be(d,s);for(let h=0;h<this.path.length;h++){const u=this.path[h];!c&&u.options.layoutScroll&&u.scroll&&u!==u.root&&na(d,{x:-u.scroll.offset.x,y:-u.scroll.offset.y}),u1(u.latestValues)&&na(d,u.latestValues)}return u1(this.latestValues)&&na(d,this.latestValues),d}removeTransform(s){const c=te();Be(c,s);for(let d=0;d<this.path.length;d++){const h=this.path[d];if(!h.instance||!u1(h.latestValues))continue;tL(h.latestValues)&&h.updateSnapshot();const u=te(),y=h.measurePageBox();Be(u,y),mI(c,h.latestValues,h.snapshot?h.snapshot.layoutBox:void 0,u)}return u1(this.latestValues)&&mI(c,this.latestValues),c}setTargetDelta(s){this.targetDelta=s,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(s){this.options={...this.options,...s,crossfade:s.crossfade!==void 0?s.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==ke.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(s=!1){var c;const d=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=d.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=d.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=d.isSharedProjectionDirty);const h=!!this.resumingFrom||this!==d;if(!(s||h&&this.isSharedProjectionDirty||this.isProjectionDirty||!((c=this.parent)===null||c===void 0)&&c.isProjectionDirty||this.attemptToResolveRelativeTarget))return;const{layout:y,layoutId:k}=this.options;if(!(!this.layout||!(y||k))){if(this.resolvedRelativeTargetAt=ke.timestamp,!this.targetDelta&&!this.relativeTarget){const g=this.getClosestProjectingParent();g&&g.layout&&this.animationProgress!==1?(this.relativeParent=g,this.forceRelativeParentToResolveTarget(),this.relativeTarget=te(),this.relativeTargetOrigin=te(),yi(this.relativeTargetOrigin,this.layout.layoutBox,g.layout.layoutBox),Be(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)){if(this.target||(this.target=te(),this.targetWithTransforms=te()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Tq(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):Be(this.target,this.layout.layoutBox),aA(this.target,this.targetDelta)):Be(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget){this.attemptToResolveRelativeTarget=!1;const g=this.getClosestProjectingParent();g&&!!g.resumingFrom==!!this.resumingFrom&&!g.options.layoutScroll&&g.target&&this.animationProgress!==1?(this.relativeParent=g,this.forceRelativeParentToResolveTarget(),this.relativeTarget=te(),this.relativeTargetOrigin=te(),yi(this.relativeTargetOrigin,this.target,g.target),Be(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}y1.resolvedTargetDeltas++}}}getClosestProjectingParent(){if(!(!this.parent||tL(this.parent.latestValues)||nA(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var s;const c=this.getLead(),d=!!this.resumingFrom||this!==c;let h=!0;if((this.isProjectionDirty||!((s=this.parent)===null||s===void 0)&&s.isProjectionDirty)&&(h=!1),d&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(h=!1),this.resolvedRelativeTargetAt===ke.timestamp&&(h=!1),h)return;const{layout:u,layoutId:y}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(u||y))return;Be(this.layoutCorrected,this.layout.layoutBox);const k=this.treeScale.x,g=this.treeScale.y;Uq(this.layoutCorrected,this.treeScale,this.path,d),c.layout&&!c.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(c.target=c.layout.layoutBox);const{target:v}=c;if(!v){this.projectionTransform&&(this.projectionDelta=ta(),this.projectionTransform="none",this.scheduleRender());return}this.projectionDelta||(this.projectionDelta=ta(),this.projectionDeltaWithTransform=ta());const x=this.projectionTransform;ui(this.projectionDelta,this.layoutCorrected,v,this.latestValues),this.projectionTransform=vI(this.projectionDelta,this.treeScale),(this.projectionTransform!==x||this.treeScale.x!==k||this.treeScale.y!==g)&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",v)),y1.recalculatedProjection++}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(s=!0){if(this.options.scheduleRender&&this.options.scheduleRender(),s){const c=this.getStack();c&&c.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}setAnimationOrigin(s,c=!1){const d=this.snapshot,h=d?d.latestValues:{},u={...this.latestValues},y=ta();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!c;const k=te(),g=d?d.source:void 0,v=this.layout?this.layout.source:void 0,x=g!==v,L=this.getStack(),m=!L||L.members.length<=1,p=!!(x&&!m&&this.options.crossfade===!0&&!this.path.some(zD));this.animationProgress=0;let f;this.mixTargetDelta=M=>{const w=M/1e3;SI(y.x,s.x,w),SI(y.y,s.y,w),this.setTargetDelta(y),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(yi(k,this.layout.layoutBox,this.relativeParent.layout.layoutBox),AD(this.relativeTarget,this.relativeTargetOrigin,k,w),f&&lD(this.relativeTarget,f)&&(this.isProjectionDirty=!1),f||(f=te()),Be(f,this.relativeTarget)),x&&(this.animationValues=u,aD(u,h,this.latestValues,w,p,m)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=w},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(s){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(St(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=O.update(()=>{lM.hasAnimatedSinceResize=!0,this.currentAnimation=fD(0,wI,{...s,onUpdate:c=>{this.mixTargetDelta(c),s.onUpdate&&s.onUpdate(c)},onComplete:()=>{s.onComplete&&s.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const s=this.getStack();s&&s.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(wI),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const s=this.getLead();let{targetWithTransforms:c,target:d,layout:h,latestValues:u}=s;if(!(!c||!d||!h)){if(this!==s&&this.layout&&h&&uA(this.options.animationType,this.layout.layoutBox,h.layoutBox)){d=this.target||te();const y=qe(this.layout.layoutBox.x);d.x.min=s.target.x.min,d.x.max=d.x.min+y;const k=qe(this.layout.layoutBox.y);d.y.min=s.target.y.min,d.y.max=d.y.min+k}Be(c,d),na(c,u),ui(this.projectionDeltaWithTransform,this.layoutCorrected,c,u)}}registerSharedNode(s,c){this.sharedNodes.has(s)||this.sharedNodes.set(s,new dD),this.sharedNodes.get(s).add(c);const h=c.options.initialPromotionConfig;c.promote({transition:h?h.transition:void 0,preserveFollowOpacity:h&&h.shouldPreserveFollowOpacity?h.shouldPreserveFollowOpacity(c):void 0})}isLead(){const s=this.getStack();return s?s.lead===this:!0}getLead(){var s;const{layoutId:c}=this.options;return c?((s=this.getStack())===null||s===void 0?void 0:s.lead)||this:this}getPrevLead(){var s;const{layoutId:c}=this.options;return c?(s=this.getStack())===null||s===void 0?void 0:s.prevLead:void 0}getStack(){const{layoutId:s}=this.options;if(s)return this.root.sharedNodes.get(s)}promote({needsReset:s,transition:c,preserveFollowOpacity:d}={}){const h=this.getStack();h&&h.promote(this,d),s&&(this.projectionDelta=void 0,this.needsReset=!0),c&&this.setOptions({transition:c})}relegate(){const s=this.getStack();return s?s.relegate(this):!1}resetRotation(){const{visualElement:s}=this.options;if(!s)return;let c=!1;const{latestValues:d}=s;if((d.rotate||d.rotateX||d.rotateY||d.rotateZ)&&(c=!0),!c)return;const h={};for(let u=0;u<MI.length;u++){const y="rotate"+MI[u];d[y]&&(h[y]=d[y],s.setStaticValue(y,0))}s.render();for(const u in h)s.setStaticValue(u,h[u]);s.scheduleRender()}getProjectionStyles(s){var c,d;if(!this.instance||this.isSVG)return;if(!this.isVisible)return mD;const h={visibility:""},u=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,h.opacity="",h.pointerEvents=cM(s==null?void 0:s.pointerEvents)||"",h.transform=u?u(this.latestValues,""):"none",h;const y=this.getLead();if(!this.projectionDelta||!this.layout||!y.target){const x={};return this.options.layoutId&&(x.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,x.pointerEvents=cM(s==null?void 0:s.pointerEvents)||""),this.hasProjected&&!u1(this.latestValues)&&(x.transform=u?u({},""):"none",this.hasProjected=!1),x}const k=y.animationValues||y.latestValues;this.applyTransformsToTarget(),h.transform=vI(this.projectionDeltaWithTransform,this.treeScale,k),u&&(h.transform=u(k,h.transform));const{x:g,y:v}=this.projectionDelta;h.transformOrigin=`${g.origin*100}% ${v.origin*100}% 0`,y.animationValues?h.opacity=y===this?(d=(c=k.opacity)!==null&&c!==void 0?c:this.latestValues.opacity)!==null&&d!==void 0?d:1:this.preserveOpacity?this.latestValues.opacity:k.opacityExit:h.opacity=y===this?k.opacity!==void 0?k.opacity:"":k.opacityExit!==void 0?k.opacityExit:0;for(const x in TM){if(k[x]===void 0)continue;const{correct:L,applyTo:m}=TM[x],p=h.transform==="none"?k[x]:L(k[x],y);if(m){const f=m.length;for(let M=0;M<f;M++)h[m[M]]=p}else h[x]=p}return this.options.layoutId&&(h.pointerEvents=y===this?cM(s==null?void 0:s.pointerEvents)||"":"none"),h}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(s=>{var c;return(c=s.currentAnimation)===null||c===void 0?void 0:c.stop()}),this.root.nodes.forEach(LI),this.root.sharedNodes.clear()}}}function xD(e){e.updateLayout()}function vD(e){var t;const n=((t=e.resumeFrom)===null||t===void 0?void 0:t.snapshot)||e.snapshot;if(e.isLead()&&e.layout&&n&&e.hasListeners("didUpdate")){const{layoutBox:a,measuredBox:r}=e.layout,{animationType:o}=e.options,s=n.source!==e.layout.source;o==="size"?Ne(y=>{const k=s?n.measuredBox[y]:n.layoutBox[y],g=qe(k);k.min=a[y].min,k.max=k.min+g}):uA(o,n.layoutBox,a)&&Ne(y=>{const k=s?n.measuredBox[y]:n.layoutBox[y],g=qe(a[y]);k.max=k.min+g,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[y].max=e.relativeTarget[y].min+g)});const c=ta();ui(c,a,n.layoutBox);const d=ta();s?ui(d,e.applyTransform(r,!0),n.measuredBox):ui(d,a,n.layoutBox);const h=!lA(c);let u=!1;if(!e.resumeFrom){const y=e.getClosestProjectingParent();if(y&&!y.resumeFrom){const{snapshot:k,layout:g}=y;if(k&&g){const v=te();yi(v,n.layoutBox,k.layoutBox);const x=te();yi(x,a,g.layoutBox),dA(v,x)||(u=!0),y.options.layoutRoot&&(e.relativeTarget=x,e.relativeTargetOrigin=v,e.relativeParent=y)}}}e.notifyListeners("didUpdate",{layout:a,snapshot:n,delta:d,layoutDelta:c,hasLayoutChanged:h,hasRelativeTargetChanged:u})}else if(e.isLead()){const{onExitComplete:a}=e.options;a&&a()}e.options.transition=void 0}function MD(e){y1.totalNodes++,e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function wD(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function LD(e){e.clearSnapshot()}function LI(e){e.clearMeasurements()}function CD(e){e.isLayoutDirty=!1}function SD(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function CI(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function ID(e){e.resolveTargetDelta()}function jD(e){e.calcProjection()}function bD(e){e.resetRotation()}function PD(e){e.removeLeadSnapshot()}function SI(e,t,n){e.translate=$(t.translate,0,n),e.scale=$(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function II(e,t,n,a){e.min=$(t.min,n.min,a),e.max=$(t.max,n.max,a)}function AD(e,t,n,a){II(e.x,t.x,n.x,a),II(e.y,t.y,n.y,a)}function zD(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const VD={duration:.45,ease:[.4,0,.1,1]},jI=e=>typeof navigator<"u"&&navigator.userAgent.toLowerCase().includes(e),bI=jI("applewebkit/")&&!jI("chrome/")?Math.round:ee;function PI(e){e.min=bI(e.min),e.max=bI(e.max)}function HD(e){PI(e.x),PI(e.y)}function uA(e,t,n){return e==="position"||e==="preserve-aspect"&&!Jw(xI(t),xI(n),.2)}const TD=hA({attachResizeListener:(e,t)=>ft(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),K9={current:void 0},yA=hA({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!K9.current){const e=new TD({});e.mount(window),e.setOptions({layoutScroll:!0}),K9.current=e}return K9.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),qD={pan:{Feature:Qq},drag:{Feature:Kq,ProjectionNode:yA,MeasureLayout:oA}},DD=/var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;function FD(e){const t=DD.exec(e);if(!t)return[,];const[,n,a]=t;return[n,a]}function aL(e,t,n=1){const[a,r]=FD(e);if(!a)return;const o=window.getComputedStyle(t).getPropertyValue(a);if(o){const s=o.trim();return XP(s)?parseFloat(s):s}else return Ww(r)?aL(r,t,n+1):r}function RD(e,{...t},n){const a=e.current;if(!(a instanceof Element))return{target:t,transitionEnd:n};n&&(n={...n}),e.values.forEach(r=>{const o=r.get();if(!Ww(o))return;const s=aL(o,a);s&&r.set(s)});for(const r in t){const o=t[r];if(!Ww(o))continue;const s=aL(o,a);s&&(t[r]=s,n||(n={}),n[r]===void 0&&(n[r]=o))}return{target:t,transitionEnd:n}}const BD=new Set(["width","height","top","left","right","bottom","x","y","translateX","translateY"]),pA=e=>BD.has(e),ND=e=>Object.keys(e).some(pA),AI=e=>e===R1||e===V,zI=(e,t)=>parseFloat(e.split(", ")[t]),VI=(e,t)=>(n,{transform:a})=>{if(a==="none"||!a)return 0;const r=a.match(/^matrix3d\((.+)\)$/);if(r)return zI(r[1],t);{const o=a.match(/^matrix\((.+)\)$/);return o?zI(o[1],e):0}},ED=new Set(["x","y","z"]),OD=Bi.filter(e=>!ED.has(e));function UD(e){const t=[];return OD.forEach(n=>{const a=e.getValue(n);a!==void 0&&(t.push([n,a.get()]),a.set(n.startsWith("scale")?1:0))}),t.length&&e.render(),t}const Ca={width:({x:e},{paddingLeft:t="0",paddingRight:n="0"})=>e.max-e.min-parseFloat(t)-parseFloat(n),height:({y:e},{paddingTop:t="0",paddingBottom:n="0"})=>e.max-e.min-parseFloat(t)-parseFloat(n),top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:VI(4,13),y:VI(5,14)};Ca.translateX=Ca.x;Ca.translateY=Ca.y;const ZD=(e,t,n)=>{const a=t.measureViewportBox(),r=t.current,o=getComputedStyle(r),{display:s}=o,c={};s==="none"&&t.setStaticValue("display",e.display||"block"),n.forEach(h=>{c[h]=Ca[h](a,o)}),t.render();const d=t.measureViewportBox();return n.forEach(h=>{const u=t.getValue(h);u&&u.jump(c[h]),e[h]=Ca[h](d,o)}),e},_D=(e,t,n={},a={})=>{t={...t},a={...a};const r=Object.keys(t).filter(pA);let o=[],s=!1;const c=[];if(r.forEach(d=>{const h=e.getValue(d);if(!e.hasValue(d))return;let u=n[d],y=Da(u);const k=t[d];let g;if(DM(k)){const v=k.length,x=k[0]===null?1:0;u=k[x],y=Da(u);for(let L=x;L<v&&k[L]!==null;L++)g?uC(Da(k[L])===g):g=Da(k[L])}else g=Da(k);if(y!==g)if(AI(y)&&AI(g)){const v=h.get();typeof v=="string"&&h.set(parseFloat(v)),typeof k=="string"?t[d]=parseFloat(k):Array.isArray(k)&&g===V&&(t[d]=k.map(parseFloat))}else y!=null&&y.transform&&(g!=null&&g.transform)&&(u===0||k===0)?u===0?h.set(g.transform(u)):t[d]=y.transform(k):(s||(o=UD(e),s=!0),c.push(d),a[d]=a[d]!==void 0?a[d]:t[d],h.jump(k))}),c.length){const d=c.indexOf("height")>=0?window.pageYOffset:null,h=ZD(t,e,c);return o.length&&o.forEach(([u,y])=>{e.getValue(u).set(y)}),e.render(),o9&&d!==null&&window.scrollTo({top:d}),{target:h,transitionEnd:a}}else return{target:t,transitionEnd:a}};function WD(e,t,n,a){return ND(t)?_D(e,t,n,a):{target:t,transitionEnd:a}}const GD=(e,t,n,a)=>{const r=RD(e,t,a);return t=r.target,a=r.transitionEnd,WD(e,t,n,a)},iL={current:null},kA={current:!1};function $D(){if(kA.current=!0,!!o9)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>iL.current=e.matches;e.addListener(t),t()}else iL.current=!1}function XD(e,t,n){const{willChange:a}=t;for(const r in t){const o=t[r],s=n[r];if(Pe(o))e.addValue(r,o),NM(a)&&a.add(r);else if(Pe(s))e.addValue(r,La(o,{owner:e})),NM(a)&&a.remove(r);else if(s!==o)if(e.hasValue(r)){const c=e.getValue(r);!c.hasAnimated&&c.set(o)}else{const c=e.getStaticValue(r);e.addValue(r,La(c!==void 0?c:o,{owner:e}))}}for(const r in n)t[r]===void 0&&e.removeValue(r);return t}const HI=new WeakMap,fA=Object.keys(Vi),KD=fA.length,TI=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"],QD=aC.length;class YD{constructor({parent:t,props:n,presenceContext:a,reducedMotionConfig:r,visualState:o},s={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.values=new Map,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.scheduleRender=()=>O.render(this.render,!1,!0);const{latestValues:c,renderState:d}=o;this.latestValues=c,this.baseTarget={...c},this.initialValues=n.initial?{...c}:{},this.renderState=d,this.parent=t,this.props=n,this.presenceContext=a,this.depth=t?t.depth+1:0,this.reducedMotionConfig=r,this.options=s,this.isControllingVariants=c9(n),this.isVariantNode=eP(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:h,...u}=this.scrapeMotionValuesFromProps(n,{});for(const y in u){const k=u[y];c[y]!==void 0&&Pe(k)&&(k.set(c[y],!1),NM(h)&&h.add(y))}}scrapeMotionValuesFromProps(t,n){return{}}mount(t){this.current=t,HI.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,a)=>this.bindToMotionValue(a,n)),kA.current||$D(),this.shouldReduceMotion=this.reducedMotionConfig==="never"?!1:this.reducedMotionConfig==="always"?!0:iL.current,this.parent&&this.parent.children.add(this),this.update(this.props,this.presenceContext)}unmount(){HI.delete(this.current),this.projection&&this.projection.unmount(),St(this.notifyUpdate),St(this.render),this.valueSubscriptions.forEach(t=>t()),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent&&this.parent.children.delete(this);for(const t in this.events)this.events[t].clear();for(const t in this.features)this.features[t].unmount();this.current=null}bindToMotionValue(t,n){const a=F1.has(t),r=n.on("change",s=>{this.latestValues[t]=s,this.props.onUpdate&&O.update(this.notifyUpdate,!1,!0),a&&this.projection&&(this.projection.isTransformDirty=!0)}),o=n.on("renderRequest",this.scheduleRender);this.valueSubscriptions.set(t,()=>{r(),o()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}loadFeatures({children:t,...n},a,r,o){let s,c;for(let d=0;d<KD;d++){const h=fA[d],{isEnabled:u,Feature:y,ProjectionNode:k,MeasureLayout:g}=Vi[h];k&&(s=k),u(n)&&(!this.features[h]&&y&&(this.features[h]=new y(this)),g&&(c=g))}if((this.type==="html"||this.type==="svg")&&!this.projection&&s){this.projection=new s(this.latestValues,this.parent&&this.parent.projection);const{layoutId:d,layout:h,drag:u,dragConstraints:y,layoutScroll:k,layoutRoot:g}=n;this.projection.setOptions({layoutId:d,layout:h,alwaysMeasureLayout:!!u||y&&J1(y),visualElement:this,scheduleRender:()=>this.scheduleRender(),animationType:typeof h=="string"?h:"both",initialPromotionConfig:o,layoutScroll:k,layoutRoot:g})}return c}updateFeatures(){for(const t in this.features){const n=this.features[t];n.isMounted?n.update():(n.mount(),n.isMounted=!0)}}triggerBuild(){this.build(this.renderState,this.latestValues,this.options,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):te()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}makeTargetAnimatable(t,n=!0){return this.makeTargetAnimatableFromInstance(t,this.props,n)}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let a=0;a<TI.length;a++){const r=TI[a];this.propEventSubscriptions[r]&&(this.propEventSubscriptions[r](),delete this.propEventSubscriptions[r]);const o=t["on"+r];o&&(this.propEventSubscriptions[r]=this.on(r,o))}this.prevMotionValues=XD(this,this.scrapeMotionValuesFromProps(t,this.prevProps),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}getVariantContext(t=!1){if(t)return this.parent?this.parent.getVariantContext():void 0;if(!this.isControllingVariants){const a=this.parent?this.parent.getVariantContext()||{}:{};return this.props.initial!==void 0&&(a.initial=this.props.initial),a}const n={};for(let a=0;a<QD;a++){const r=aC[a],o=this.props[r];(zi(o)||o===!1)&&(n[r]=o)}return n}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){n!==this.values.get(t)&&(this.removeValue(t),this.bindToMotionValue(t,n)),this.values.set(t,n),this.latestValues[t]=n.get()}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let a=this.values.get(t);return a===void 0&&n!==void 0&&(a=La(n,{owner:this}),this.addValue(t,a)),a}readValue(t){var n;return this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:(n=this.getBaseTargetFromProps(this.props,t))!==null&&n!==void 0?n:this.readValueFromInstance(this.current,t,this.options)}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){var n;const{initial:a}=this.props,r=typeof a=="string"||typeof a=="object"?(n=hC(this.props,a))===null||n===void 0?void 0:n[t]:void 0;if(a&&r!==void 0)return r;const o=this.getBaseTargetFromProps(this.props,t);return o!==void 0&&!Pe(o)?o:this.initialValues[t]!==void 0&&r===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new MC),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}}class mA extends YD{sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){return t.style?t.style[n]:void 0}removeValueFromRenderState(t,{vars:n,style:a}){delete n[t],delete a[t]}makeTargetAnimatableFromInstance({transition:t,transitionEnd:n,...a},{transformValues:r},o){let s=kq(a,t||{},this);if(r&&(n&&(n=r(n)),a&&(a=r(a)),s&&(s=r(s))),o){yq(this,a,s);const c=GD(this,a,s,n);n=c.transitionEnd,a=c.target}return{transition:t,transitionEnd:n,...a}}}function JD(e){return window.getComputedStyle(e)}class eF extends mA{constructor(){super(...arguments),this.type="html"}readValueFromInstance(t,n){if(F1.has(n)){const a=fC(n);return a&&a.default||0}else{const a=JD(t),r=(iP(n)?a.getPropertyValue(n):a[n])||0;return typeof r=="string"?r.trim():r}}measureInstanceViewportBox(t,{transformPagePoint:n}){return iA(t,n)}build(t,n,a,r){oC(t,n,a,r.transformTemplate)}scrapeMotionValuesFromProps(t,n){return dC(t,n)}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;Pe(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}renderInstance(t,n,a,r){dP(t,n,a,r)}}class tF extends mA{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(F1.has(n)){const a=fC(n);return a&&a.default||0}return n=hP.has(n)?n:tC(n),t.getAttribute(n)}measureInstanceViewportBox(){return te()}scrapeMotionValuesFromProps(t,n){return yP(t,n)}build(t,n,a,r){cC(t,n,a,this.isSVGTag,r.transformTemplate)}renderInstance(t,n,a,r){uP(t,n,a,r)}mount(t){this.isSVGTag=lC(t.tagName),super.mount(t)}}const nF=(e,t)=>rC(e)?new tF(t,{enableHardwareAcceleration:!1}):new eF(t,{enableHardwareAcceleration:!0}),aF={layout:{ProjectionNode:yA,MeasureLayout:oA}},iF={...Aq,...KH,...qD,...aF},F=rH((e,t)=>FH(e,t,iF,nF));function gA(){const e=C.useRef(!1);return eC(()=>(e.current=!0,()=>{e.current=!1}),[]),e}function rF(){const e=gA(),[t,n]=C.useState(0),a=C.useCallback(()=>{e.current&&n(t+1)},[t]);return[C.useCallback(()=>O.postRender(a),[a]),t]}class oF extends C.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(n&&t.isPresent&&!this.props.isPresent){const a=this.props.sizeRef.current;a.height=n.offsetHeight||0,a.width=n.offsetWidth||0,a.top=n.offsetTop,a.left=n.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function sF({children:e,isPresent:t}){const n=C.useId(),a=C.useRef(null),r=C.useRef({width:0,height:0,top:0,left:0});return C.useInsertionEffect(()=>{const{width:o,height:s,top:c,left:d}=r.current;if(t||!a.current||!o||!s)return;a.current.dataset.motionPopId=n;const h=document.createElement("style");return document.head.appendChild(h),h.sheet&&h.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${o}px !important;
            height: ${s}px !important;
            top: ${c}px !important;
            left: ${d}px !important;
          }
        `),()=>{document.head.removeChild(h)}},[t]),C.createElement(oF,{isPresent:t,childRef:a,sizeRef:r},C.cloneElement(e,{ref:a}))}const Q9=({children:e,initial:t,isPresent:n,onExitComplete:a,custom:r,presenceAffectsLayout:o,mode:s})=>{const c=pP(cF),d=C.useId(),h=C.useMemo(()=>({id:d,initial:t,isPresent:n,custom:r,onExitComplete:u=>{c.set(u,!0);for(const y of c.values())if(!y)return;a&&a()},register:u=>(c.set(u,!1),()=>c.delete(u))}),o?void 0:[n]);return C.useMemo(()=>{c.forEach((u,y)=>c.set(y,!1))},[n]),C.useEffect(()=>{!n&&!c.size&&a&&a()},[n]),s==="popLayout"&&(e=C.createElement(sF,{isPresent:n},e)),C.createElement(r9.Provider,{value:h},e)};function cF(){return new Map}function lF(e){return C.useEffect(()=>()=>e(),[])}const p1=e=>e.key||"";function dF(e,t){e.forEach(n=>{const a=p1(n);t.set(a,n)})}function hF(e){const t=[];return C.Children.forEach(e,n=>{C.isValidElement(n)&&t.push(n)}),t}const Ze=({children:e,custom:t,initial:n=!0,onExitComplete:a,exitBeforeEnter:r,presenceAffectsLayout:o=!0,mode:s="sync"})=>{const c=C.useContext(iC).forceRender||rF()[0],d=gA(),h=hF(e);let u=h;const y=C.useRef(new Map).current,k=C.useRef(u),g=C.useRef(new Map).current,v=C.useRef(!0);if(eC(()=>{v.current=!1,dF(h,g),k.current=u}),lF(()=>{v.current=!0,g.clear(),y.clear()}),v.current)return C.createElement(C.Fragment,null,u.map(p=>C.createElement(Q9,{key:p1(p),isPresent:!0,initial:n?void 0:!1,presenceAffectsLayout:o,mode:s},p)));u=[...u];const x=k.current.map(p1),L=h.map(p1),m=x.length;for(let p=0;p<m;p++){const f=x[p];L.indexOf(f)===-1&&!y.has(f)&&y.set(f,void 0)}return s==="wait"&&y.size&&(u=[]),y.forEach((p,f)=>{if(L.indexOf(f)!==-1)return;const M=g.get(f);if(!M)return;const w=x.indexOf(f);let I=p;if(!I){const b=()=>{y.delete(f);const j=Array.from(g.keys()).filter(z=>!L.includes(z));if(j.forEach(z=>g.delete(z)),k.current=h.filter(z=>{const H=p1(z);return H===f||j.includes(H)}),!y.size){if(d.current===!1)return;c(),a&&a()}};I=C.createElement(Q9,{key:p1(M),isPresent:!1,onExitComplete:b,custom:t,presenceAffectsLayout:o,mode:s},M),y.set(f,I)}u.splice(w,0,I)}),u=u.map(p=>{const f=p.key;return y.has(f)?p:C.createElement(Q9,{key:p1(p),isPresent:!0,presenceAffectsLayout:o,mode:s},p)}),C.createElement(C.Fragment,null,y.size?u:u.map(p=>C.cloneElement(p)))};function uF({isOpen:e,onClose:t,onSave:n,editingChild:a}){const[r,o]=C.useState(""),[s,c]=C.useState("");C.useEffect(()=>{a?(o(a.name),c(a.birthday)):(o(""),c(""))},[a,e]);const d=h=>{h.preventDefault(),r&&s&&(n(r,s),t())};return e?l.jsx(Ze,{children:e&&l.jsxs(l.Fragment,{children:[l.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:t,className:"fixed inset-0 bg-black/40 z-50"}),l.jsxs(F.div,{initial:{opacity:0,y:"-50%",x:"-50%"},animate:{opacity:1,y:"-50%",x:"-50%"},exit:{opacity:0,y:"-50%",x:"-50%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed top-1/2 left-1/2 w-11/12 max-w-md bg-white rounded-3xl shadow-xl z-50 p-6",children:[l.jsxs("div",{className:"flex justify-between items-center mb-4",children:[l.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:a?"編輯寶寶資料":"新增寶寶"}),l.jsx("button",{onClick:t,className:"w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors",children:l.jsx(tt,{className:"w-5 h-5 text-gray-600"})})]}),l.jsxs("form",{onSubmit:d,className:"space-y-4",children:[l.jsxs("div",{children:[l.jsx("label",{htmlFor:"childName",className:"block text-sm font-medium text-gray-700 mb-1",children:"寶寶姓名"}),l.jsx("input",{type:"text",id:"childName",value:r,onChange:h=>o(h.target.value),className:"w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors",placeholder:"例如: 小寶",required:!0})]}),l.jsxs("div",{children:[l.jsx("label",{htmlFor:"childBirthday",className:"block text-sm font-medium text-gray-700 mb-1",children:"寶寶生日"}),l.jsx("input",{type:"date",id:"childBirthday",value:s,onChange:h=>c(h.target.value),className:"w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors",required:!0})]}),l.jsx("button",{type:"submit",className:"w-full bg-primary text-white py-3 rounded-xl font-semibold shadow-soft hover:bg-primary-dark transition-colors",children:a?"儲存修改":"新增寶寶"})]})]})]})}):null}function yF({isOpen:e,onClose:t,currentPage:n,onNavigate:a,childProfiles:r,currentChildId:o,setCurrentChildId:s,addChild:c,updateChild:d,deleteChild:h}){const[u,y]=C.useState(!1),[k,g]=C.useState(null),v=[{id:"home",label:"首頁",icon:C1,description:"返回主頁"},{id:"milestones",label:"里程碑追蹤",icon:dt,description:"記錄寶寶發展進度"},{id:"care-guide",label:"照顧重點",icon:la,description:"各階段注意事項"},{id:"vaccine-tracking",label:"疫苗追蹤",icon:$t,description:"疫苗接種時程與副作用"},{id:"complementary-food",label:"副食品指南",icon:j1,description:"副食品添加完整攻略"}],x=p=>{a(p),t()},L=(p,f)=>{k?d(k.id,p,f):c(p,f),g(null)},m=p=>{window.confirm("確定要刪除這位寶寶的資料嗎？所有里程碑進度也將一併刪除。")&&h(p)};return l.jsx(Ze,{children:e&&l.jsxs(l.Fragment,{children:[l.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:t,className:"fixed inset-0 bg-black/40 z-40"}),l.jsxs(F.div,{initial:{x:"-100%"},animate:{x:0},exit:{x:"-100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto",children:[l.jsxs("div",{className:"sticky top-0 bg-gradient-to-r from-primary to-secondary p-6 text-white",children:[l.jsxs("div",{className:"flex items-center justify-between mb-2",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(C1,{className:"w-6 h-6"}),l.jsx("h2",{className:"text-xl font-bold",children:"LittleSteps"})]}),l.jsx("button",{onClick:t,className:"w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors",children:l.jsx(tt,{className:"w-5 h-5"})})]}),l.jsx("p",{className:"text-sm text-white/80",children:"育兒里程碑追蹤"})]}),l.jsxs("div",{className:"p-4 border-b border-gray-100",children:[l.jsx("h3",{className:"text-lg font-semibold text-gray-800 mb-3",children:"我的寶寶"}),l.jsxs("div",{className:"space-y-2",children:[r.length===0&&l.jsx("p",{className:"text-gray-500 text-sm",children:"尚未新增寶寶資料"}),r.map(p=>l.jsxs("div",{className:`
                      flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
                      ${p.id===o?"bg-primary text-white shadow-soft":"bg-gray-50 text-gray-700 hover:bg-gray-100"}
                    `,children:[l.jsxs("div",{className:"flex-1 flex items-center gap-2",onClick:()=>s(p.id),children:[l.jsx(dt,{className:`w-5 h-5 ${p.id===o?"text-white":"text-primary"}`}),l.jsx("span",{className:"font-medium",children:p.name})]}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{onClick:f=>{f.stopPropagation(),g(p),y(!0)},className:`
                          w-8 h-8 flex items-center justify-center rounded-full transition-colors
                          ${p.id===o?"hover:bg-white/20":"hover:bg-gray-200"}
                        `,title:"編輯寶寶資料",children:l.jsx(Xe,{className:`w-4 h-4 ${p.id===o?"text-white":"text-gray-600"}`})}),l.jsx("button",{onClick:f=>{f.stopPropagation(),m(p.id)},className:`
                          w-8 h-8 flex items-center justify-center rounded-full transition-colors
                          ${p.id===o?"hover:bg-white/20":"hover:bg-gray-200"}
                        `,title:"刪除寶寶資料",children:l.jsx(si,{className:`w-4 h-4 ${p.id===o?"text-white":"text-red-500"}`})})]})]},p.id)),l.jsxs("button",{onClick:()=>{g(null),y(!0)},className:"w-full flex items-center justify-center gap-2 p-3 mt-3 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors",children:[l.jsx(ii,{className:"w-5 h-5"}),"新增寶寶"]})]})]}),l.jsx("div",{className:"p-4 space-y-2",children:v.map(p=>{const f=p.icon,M=n===p.id;return l.jsx("button",{onClick:()=>x(p.id),className:`
                      w-full p-4 rounded-2xl transition-all text-left
                      ${M?"bg-primary text-white shadow-soft":"bg-gray-50 text-gray-700 hover:bg-gray-100"}
                    `,children:l.jsxs("div",{className:"flex items-start gap-3",children:[l.jsx(f,{className:`w-6 h-6 flex-shrink-0 mt-0.5 ${M?"text-white":"text-primary"}`}),l.jsxs("div",{className:"flex-1",children:[l.jsx("div",{className:"font-semibold mb-1",children:p.label}),l.jsx("div",{className:`text-sm ${M?"text-white/80":"text-gray-500"}`,children:p.description})]})]})},p.id)})}),l.jsx("div",{className:"sticky bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100",children:l.jsxs("p",{className:"text-xs text-gray-500 text-center",children:["© 2024 LittleSteps",l.jsx("br",{}),"陪伴寶貝每一步成長"]})})]}),l.jsx(uF,{isOpen:u,onClose:()=>y(!1),onSave:L,editingChild:k})]})})}function pF({onNavigate:e}){const t=[{id:"milestones",icon:dt,title:"里程碑追蹤",description:"記錄寶寶每個珍貴的成長時刻，從第一個微笑到第一步，見證每個里程碑的達成",color:"from-pink-400 to-pink-600",bgColor:"bg-pink-50",page:"milestones"},{id:"care-guide",icon:pa,title:"照顧重點",description:"各階段專業照護建議，從生理發展到安全注意事項，給您最完整的育兒指南",color:"from-blue-400 to-blue-600",bgColor:"bg-blue-50",page:"care-guide"},{id:"vaccine",icon:$t,title:"疫苗追蹤",description:"完整的疫苗接種時程表，詳細記錄公費自費項目，掌握每一劑接種時機",color:"from-green-400 to-green-600",bgColor:"bg-green-50",page:"vaccine-tracking"},{id:"food",icon:j1,title:"副食品指南",description:"科學的副食品添加方法，從4個月到1歲的完整攻略，讓寶寶吃得健康又安心",color:"from-orange-400 to-orange-600",bgColor:"bg-orange-50",page:"complementary-food"}],n={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},a={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.5}}};return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-warm-white via-pink-50/30 to-blue-50/30",children:[l.jsxs(F.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.6},className:"relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 px-4 py-16",children:[l.jsx("div",{className:"absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"}),l.jsx("div",{className:"absolute bottom-10 left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"}),l.jsxs("div",{className:"relative max-w-4xl mx-auto text-center",children:[l.jsxs(F.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},transition:{delay:.2,duration:.5},className:"inline-flex items-center gap-3 mb-6",children:[l.jsx("div",{className:"w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft",children:l.jsx(dt,{className:"w-9 h-9 text-white"})}),l.jsx("h1",{className:"text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",children:"LittleSteps"})]}),l.jsx(F.p,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.4,duration:.5},className:"text-xl md:text-2xl text-gray-700 mb-4 font-medium",children:"陪伴您與寶寶的每一小步"}),l.jsx(F.p,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.6,duration:.5},className:"text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed",children:"成為新手父母是一段充滿驚喜與挑戰的旅程。LittleSteps 在這裡， 為您提供專業的育兒指南、貼心的成長記錄，讓您在育兒路上更加從容自信。"}),l.jsxs(F.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{delay:.8,duration:.5},className:"flex flex-wrap justify-center gap-3 mb-8",children:[l.jsxs("div",{className:"flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft",children:[l.jsx(Rt,{className:"w-4 h-4 text-red-500"}),l.jsx("span",{className:"text-sm font-medium text-gray-700",children:"專業育兒知識"})]}),l.jsxs("div",{className:"flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft",children:[l.jsx(Vt,{className:"w-4 h-4 text-yellow-500"}),l.jsx("span",{className:"text-sm font-medium text-gray-700",children:"完全免費使用"})]}),l.jsxs("div",{className:"flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft",children:[l.jsx(gt,{className:"w-4 h-4 text-blue-500"}),l.jsx("span",{className:"text-sm font-medium text-gray-700",children:"即時追蹤記錄"})]})]}),l.jsxs(F.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1,duration:.5},className:"flex flex-col items-center gap-2",children:[l.jsx("span",{className:"text-sm text-gray-500",children:"探索功能"}),l.jsx(F.div,{animate:{y:[0,8,0]},transition:{repeat:1/0,duration:1.5},children:l.jsx(da,{className:"w-5 h-5 text-primary rotate-90"})})]})]})]}),l.jsxs(F.div,{variants:n,initial:"hidden",animate:"visible",className:"max-w-6xl mx-auto px-4 py-16",children:[l.jsxs(F.div,{variants:a,className:"text-center mb-12",children:[l.jsx("h2",{className:"text-3xl md:text-4xl font-bold text-gray-800 mb-4",children:"完整的育兒工具箱"}),l.jsx("p",{className:"text-gray-600 max-w-2xl mx-auto",children:"從寶寶出生到一歲，我們為您準備了所有必要的追蹤與指南工具"})]}),l.jsx("div",{className:"grid md:grid-cols-2 gap-6",children:t.map(r=>{const o=r.icon;return l.jsx(F.div,{variants:a,whileHover:{y:-8,transition:{duration:.2}},className:"cursor-pointer",onClick:()=>e(r.page),children:l.jsxs("div",{className:`card h-full ${r.bgColor} border-2 border-transparent hover:border-primary/20 transition-all`,children:[l.jsxs("div",{className:"flex items-start gap-4 mb-4",children:[l.jsx("div",{className:`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-soft flex-shrink-0`,children:l.jsx(o,{className:"w-7 h-7 text-white"})}),l.jsxs("div",{className:"flex-1",children:[l.jsx("h3",{className:"text-xl font-bold text-gray-800 mb-2",children:r.title}),l.jsx("p",{className:"text-gray-600 text-sm leading-relaxed",children:r.description})]})]}),l.jsxs("div",{className:"flex items-center gap-2 text-primary font-medium text-sm group",children:[l.jsx("span",{children:"立即開始使用"}),l.jsx(da,{className:"w-4 h-4 group-hover:translate-x-1 transition-transform"})]})]})},r.id)})})]}),l.jsx(F.div,{initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0},transition:{duration:.6},className:"bg-gradient-to-br from-primary/5 to-secondary/5 py-16 px-4",children:l.jsxs("div",{className:"max-w-4xl mx-auto text-center",children:[l.jsxs("div",{className:"inline-flex items-center gap-2 mb-6",children:[l.jsx(Rt,{className:"w-8 h-8 text-red-400"}),l.jsx(Rt,{className:"w-6 h-6 text-red-300"}),l.jsx(Rt,{className:"w-4 h-4 text-red-200"})]}),l.jsx("h3",{className:"text-2xl md:text-3xl font-bold text-gray-800 mb-4",children:"您不是一個人在奮鬥"}),l.jsx("p",{className:"text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-6",children:"育兒之路充滿挑戰，但也充滿喜悅。LittleSteps 致力於成為您最可靠的數位育兒夥伴， 提供科學實用的建議，讓您在陪伴寶寶成長的每一步都更加安心與自信。"}),l.jsxs("div",{className:"flex flex-wrap justify-center gap-4 text-sm text-gray-500",children:[l.jsx("span",{children:"✨ 基於最新兒科醫學建議"}),l.jsx("span",{children:"•"}),l.jsx("span",{children:"🛡️ 重視寶寶健康安全"}),l.jsx("span",{children:"•"}),l.jsx("span",{children:"💙 支持新手父母成長"})]})]})}),l.jsx("div",{className:"bg-white border-t border-gray-100 py-8 px-4",children:l.jsxs("div",{className:"max-w-4xl mx-auto text-center",children:[l.jsxs("div",{className:"flex items-center justify-center gap-2 mb-3",children:[l.jsx(dt,{className:"w-5 h-5 text-primary"}),l.jsx("span",{className:"font-semibold text-gray-800",children:"LittleSteps"})]}),l.jsx("p",{className:"text-sm text-gray-500",children:"© 2024 LittleSteps • 陪伴寶貝每一步成長"})]})})]})}const qI=[{id:"m0-1-physical-1",monthRange:"0-2",category:"physical",title:"俯臥短暫抬頭",summary:"趴著時頭部可稍微抬起並左右擺頭",details:"這階段寶寶大多數時間都在吃睡，趴著時頸部力量雖弱，但能嘗試離開床面。",tips:["在有人看顧下練習 1 分鐘 Tummy Time","觀察睡姿，鼓勵寶寶平衡地向左右擺頭"]},{id:"m0-1-motor-1",monthRange:"0-2",category:"motor",title:"原始反射：強烈抓握",summary:"對聲音有反射反應，手掌常保持緊握",details:"對突如其來的強光和噪音會產生發抖、閉眼等反射動作。手指放入掌心會自動抓緊。",tips:["觀察寶寶對噪音是否有驚嚇反應","輕撫手掌練習放鬆"]},{id:"m2-physical-1",monthRange:"0-2",category:"physical",title:"抬頭幅度增加",summary:"趴著能小幅抬頭，拉扶坐起時頭微後仰",details:"頸部肌肉力量增強，趴著時視野開始稍微擴大。",tips:["2個月若完全無法抬頭需諮詢醫師","用色彩鮮豔的玩具誘發抬頭"]},{id:"m2-motor-1",monthRange:"0-2",category:"motor",title:"吃手安撫自我",summary:"開始透過吃手動作緩和情緒或增加安全感",details:"手部動作增加，會將手放入口中探索。抓握反射依然存在。",tips:["不需刻意禁止吃手，這在建立安全感","保持手部清潔"]},{id:"m2-cognitive-1",monthRange:"0-2",category:"cognitive",title:"聲音反應與咿呀聲",summary:"嘗試轉頭看聲源，發出不具意義的咿呀聲",details:"對周遭聲響產生好奇，開始練習聲帶控制（咕咕聲）。",tips:["在寶寶兩側說話觀察追聽反應","模仿寶寶的咿呀聲與他互動"]},{id:"m2-social-1",monthRange:"0-2",category:"cognitive",title:"社會性微笑",summary:"能近距離辨識人臉，會對照顧者微笑",details:"寶寶開始想看照顧者的臉孔，並能做出回應式的微笑。",tips:["多與寶寶面對面眼神交流","若2個月仍不微笑應注意"]},{id:"m3-physical-1",monthRange:"3-4",category:"physical",title:"抬頭 45 度與踢腿",summary:"趴著時抬頭達 45 度，躺著時踢腿運動",details:"肌肉力量從頸部延伸到腿部，踢腿動作能幫助下肢肌肉發展。",tips:["給予寬敞地墊讓寶寶自由踢腿","多玩腳踏車運動（幫寶寶踩動腿部）"]},{id:"m3-motor-1",monthRange:"3-4",category:"motor",title:"主動抓握玩具",summary:"能用手抓握玩具，吃手動作變精準",details:"手眼協調進步，看到物體會伸手嘗試抓取。",tips:["提供重量輕、好抓握的搖鈴","將玩具放在不同角度誘發抓取"]},{id:"m3-cognitive-1",monthRange:"3-4",category:"cognitive",title:"識人能力提升",summary:"對家庭成員產生熟悉感，發單音回應",details:"對人臉記憶力更好，會用單音回應大人的話語。",tips:["多介紹不同家人給寶寶認識","保持豐富的面部表情互動"]},{id:"m4-physical-1",monthRange:"3-4",category:"physical",title:"穩穩抬頭與翻身練習",summary:"能穩穩抬頭，利用翻滾由趴姿轉為躺姿",details:"這是大動作發展的重大進步。寶寶開始能控制重心轉移。",tips:["練習「翻回來」：引導寶寶從躺姿再翻回趴姿","注意床緣安全，絕對不可離開視線"]},{id:"m4-motor-1",monthRange:"3-4",category:"motor",title:"伸手碰觸與甩動物品",summary:"抓到東西後能穩穩握住並甩動、搖晃",details:"不再只是隨機觸碰，而是能有意識地操控手中物體。",tips:["練習拿走毛巾遊戲：將輕薄毛巾蓋臉，鼓勵寶寶抓開"]},{id:"m4-social-1",monthRange:"3-4",category:"cognitive",title:"主動微笑與模仿表情",summary:"喜歡跟人玩，模仿照顧者的表情",details:"社交互動變得更主動。若遊戲中斷會用哭來表達不滿。",tips:["與寶寶玩扮鬼臉遊戲","觀察視線是否能自由觀察環境"]},{id:"m5-physical-1",monthRange:"5-6",category:"physical",title:"全向翻滾與玩腳趾",summary:"能自行翻回正面，會用手玩弄腳趾",details:"原本只能單向翻滾，現在可以順利翻回。對自己的腳部產生極大興趣。",tips:["將寶寶雙腳拉近他的手，讓他發現自己的小腳ㄚ"]},{id:"m5-motor-1",monthRange:"5-6",category:"motor",title:"精細動作：玩弄腳趾",summary:"手部動作細膩度增加，會拉扯腳趾",details:"這是認識身體空間感的一部分，代表軀幹柔軟度佳。",tips:["在地墊上讓寶寶光腳活動"]},{id:"m5-feeding-1",monthRange:"5-6",category:"feeding",title:"副食品渴求期",summary:"看人吃東西會想要，長牙跡象出現",details:"會頻繁咬東西，表現出對大人食物的興趣，是嘗試副食品的最佳時機。",tips:["觀察寶寶是否有推舌反應消失","準備咬咬樂或固齒器緩和長牙癢"]},{id:"m5-social-1",monthRange:"5-6",category:"cognitive",title:"分辨陌生人",summary:"開始分辨熟人與陌生人，會因高興而尖叫",details:"情緒表達變得激烈且多元，能發出「媽、爸」等單音（無意義）。",tips:["給予安全感，不要強迫讓陌生人抱寶寶"]},{id:"m6-physical-1",monthRange:"5-6",category:"physical",title:"翻滾達人與獨立坐",summary:"不需協助能自己坐著，扶站時大腿能支撐",details:"核心與下肢肌肉發達。扶站時寶寶會試著用力踩地。",tips:["練習坐在地墊上玩玩具，訓練背部平衡力"]},{id:"m6-motor-1",monthRange:"5-6",category:"motor",title:"打開臉上的手帕",summary:"能抓開蓋在臉上的物品，喜歡東西塞嘴巴",details:"這代表手部力量與問題解決能力的結合。口腔探索依然強烈。",tips:["注意玩具清潔消毒，嚴防細菌病毒","玩進階版躲貓貓：用手帕遮住玩具讓寶寶找"]},{id:"m6-cognitive-1",monthRange:"5-6",category:"cognitive",title:"模仿聲音與反應名字",summary:"會模仿大人發出的音，對名字有反應",details:"對經常聽到的詞語產生連結。大人發一音，寶寶會試著回一音。",tips:["經常對寶寶說話，稱呼他的名字"]},{id:"m6-social-1",monthRange:"5-6",category:"cognitive",title:"分離焦慮出現",summary:"照顧者不在會焦慮，樂於與人開心地互動",details:"對熟人與陌生人的分辨能力大幅提升。此時若6個月不會翻滾應諮詢醫師。",tips:["建立穩定的告別儀式，增加寶寶安全感"]},{id:"m7-physical-1",monthRange:"7-9",category:"physical",title:"穩坐與大腿跳躍",summary:"維持坐姿輕鬆，被抱時會在大腿上亂跳",details:"下肢爆發力增強。坐著時能轉向不同方向拿東西而不倒下。",tips:["扶著寶寶腋下讓他在你腿上練習蹬腿"]},{id:"m7-motor-1",monthRange:"7-9",category:"motor",title:"拇指彎曲與撥弄物品",summary:"能用手指撥弄、抓握細小物件",details:"手部動作不再只是晃動，開始出現精細的撥弄動作。",tips:["給予不同大小的積木練習抓握"]},{id:"m8-physical-1",monthRange:"7-9",category:"physical",title:"爬行取代翻滾",summary:"開始爬行移動，能扶著支撐物站立",details:"移動能力進入新境界。此時口水分泌量大增（長牙）。",tips:["徹底執行地板安全檢查（電線、插座）"]},{id:"m8-motor-1",monthRange:"7-9",category:"motor",title:"主動放開物體",summary:"能自行或經由引導放開手中的物品",details:"放下動作是神經發育的重要指標。此時可以學習自己拿餅乾吃。",tips:["玩「給你/給我」的物體交換遊戲"]},{id:"m8-cognitive-1",monthRange:"7-9",category:"cognitive",title:"理解「不可以」的語氣",summary:"對否定意義詞語有反應，但還不能完全遵守",details:"能從語氣分辨照顧者的情緒，能將單音連成「爸爸、媽媽」。",tips:["語氣要堅定一致，避免過度吼叫"]},{id:"m9-physical-1",monthRange:"7-9",category:"physical",title:"靈活坐姿變換",summary:"能從其他姿勢變換為坐姿，坐直不倒下",details:"即使沒有支撐也能坐得很直，軀幹控制力趨於成熟。",tips:["觀察寶寶是否能自己從趴姿坐起來"]},{id:"m9-motor-1",monthRange:"7-9",category:"motor",title:"指尖捏取（食指拇指）",summary:"能靈活運用食指和拇指捏取食物或小玩具",details:"這是手部精細動作的重大進步（鉗式抓握）。",tips:["提供合適的手指食物練習捏取","嚴防細小雜物被誤吞"]},{id:"m9-cognitive-1",monthRange:"7-9",category:"cognitive",title:"物體恆存認知確立",summary:"知道藏起來的東西沒消失，會試著找出來",details:"躲貓貓遊戲對寶寶來說變得非常有意義。這是緩解分離焦慮的關鍵。",tips:["玩「尋寶遊戲」：在被子下藏玩具讓寶寶找"]},{id:"m10-physical-1",monthRange:"10-12",category:"physical",title:"扶物巡走（螃蟹走）",summary:"嘗試以扶物站立的方式在家中各處行走",details:"雙腿力量已可支撐全身，正處於學步前置期。",tips:["檢查家具是否穩固（避免翻倒）"]},{id:"m10-motor-1",monthRange:"10-12",category:"motor",title:"物品敲擊與容器遊戲",summary:"喜歡敲擊物品出聲，練習放入與取出",details:"對空間感與聲音因果關係感到好奇。",tips:["提供小桶子與軟球練習「放入」動作"]},{id:"m10-cognitive-1",monthRange:"10-12",category:"cognitive",title:"學習生活詞彙",summary:"理解「拜拜」等意思，會揮手回應",details:"能講出媽媽爸爸以外的簡單詞語如「不、走、來」。",tips:["多練習社交手勢如：謝謝、拜拜、親一個"]},{id:"m11-physical-1",monthRange:"10-12",category:"physical",title:"獨自站立與背後拿物",summary:"能不扶物自行站立，坐著可伸到背後拿東西",details:"平衡感極佳，平衡中心已從坐姿轉移到站姿。",tips:["提供安全開放空間讓寶寶嘗試放手站"]},{id:"m11-motor-1",monthRange:"10-12",category:"motor",title:"精細操作：堆疊與按鈕",summary:"能在容器堆疊積木，會用手指戳碰按鈕",details:"手指力量更集中，能單獨使用食指操作物體。",tips:["提供有按鍵的聲光玩具或按鈕書"]},{id:"m12-physical-1",monthRange:"12+",category:"physical",title:"踏出第一步與配合穿衣",summary:"能獨立行走幾步，換衣時會主動伸出手腳",details:"重大里程碑！能運用自身力量配合大人的動作。",tips:["換衣時說：『手伸出來』觀察寶寶反應","給予放手走路熱烈鼓勵"]},{id:"m12-motor-1",monthRange:"12+",category:"motor",title:"模仿工具正確用法",summary:"學拿杯子喝水或拿梳子梳頭髮",details:"手眼協調已可支持使用簡單工具，是自理教育的好時機。",tips:["給予學習杯練習自己喝水","在鏡子前示範梳頭、刷牙"]},{id:"m12-cognitive-1",monthRange:"12+",category:"cognitive",title:"理解音調語法與圖畫識別",summary:"能理解否定搖頭，能從多張圖中找出目標",details:"雖然詞彙有限，但已能識別一整句話的組成意圖與音調。",tips:["問：『蘋果在哪裡？』看寶寶是否能從水果中指出"]},{id:"m12-social-1",monthRange:"12+",category:"cognitive",title:"表現個人喜好與求助",summary:"有最愛的玩具，會主動拿書要求大人讀",details:"自我意識與幽默感展現，會用聲音吸引注意力。",tips:["多讀故事書給寶寶聽，建立早期共讀習慣"]}],kF=[{value:"0-2",label:"0-2 個月"},{value:"3-4",label:"3-4 個月"},{value:"5-6",label:"5-6 個月"},{value:"7-9",label:"7-9 個月"},{value:"10-12",label:"10-12 個月"},{value:"12+",label:"1 歲以上"}],fF=[{value:"all",label:"全部",icon:"Grid3x3"},{value:"physical",label:"大動作",icon:"User"},{value:"motor",label:"精細動作",icon:"Hand"},{value:"cognitive",label:"語言認知",icon:"Brain"},{value:"feeding",label:"飲食營養",icon:"UtensilsCrossed"}];function mF({ranges:e,selected:t,onChange:n}){return l.jsx("div",{className:"flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide",children:e.map(a=>l.jsx("button",{onClick:()=>n(a.value),className:`
            px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all snap-center
            ${t===a.value?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
          `,children:a.label},a.value))})}function gF({categories:e,selected:t,onChange:n}){return l.jsx("div",{className:"flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide",children:e.map(a=>{const r=T1[a.icon];return l.jsxs("button",{onClick:()=>n(a.value),className:`
              flex items-center gap-2 px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all snap-center
              ${t===a.value?"bg-secondary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:[r&&l.jsx(r,{className:"w-4 h-4"}),l.jsx("span",{children:a.label})]},a.value)})})}function xF({milestone:e,isCompleted:t,achievedDate:n,onToggle:a,onClick:r}){return l.jsxs("div",{className:"card flex gap-3 items-start",children:[l.jsx("button",{onClick:o=>{o.stopPropagation(),a()},className:`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${t?"bg-primary border-primary":"border-gray-300 hover:border-primary"}
        `,children:t&&l.jsx(w1,{className:"w-4 h-4 text-white"})}),l.jsxs("div",{onClick:r,className:"flex-1 cursor-pointer",children:[l.jsx("h3",{className:`font-semibold text-gray-800 mb-1 ${t?"line-through opacity-60":""}`,children:e.title}),t&&n&&l.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["完成日期: ",n]}),l.jsx("p",{className:"text-sm text-gray-600 line-clamp-2",children:e.summary})]}),l.jsx(Ja,{onClick:r,className:"w-5 h-5 text-gray-400 flex-shrink-0 cursor-pointer"})]})}async function vF(e){const t=window.location.href,n=`我的寶貝達成了【${e}】里程碑了！推薦給新手父母的育兒神器：`;if(navigator.share)try{return await navigator.share({title:"LittleSteps - 育兒里程碑",text:n,url:t}),!0}catch(a){return a.name!=="AbortError"&&console.error("分享失敗:",a),!1}else try{return await navigator.clipboard.writeText(`${n} ${t}`),alert("已複製到剪貼簿！"),!0}catch(a){return console.error("複製失敗:",a),!1}}function MF({milestone:e,isOpen:t,onClose:n,isCompleted:a,achievedDate:r,onToggle:o}){if(C.useEffect(()=>(t?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[t]),!e)return null;const s=async()=>{await vF(e.title)};return l.jsx(Ze,{children:t&&l.jsxs(l.Fragment,{children:[l.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:n,className:"fixed inset-0 bg-black/40 z-40"}),l.jsxs(F.div,{initial:{opacity:0,y:"100%"},animate:{opacity:1,y:0},exit:{opacity:0,y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto",children:[l.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[l.jsxs("div",{className:"flex-1 pr-4",children:[l.jsx("h2",{className:"text-xl font-bold text-gray-800",children:e.title}),a&&r&&l.jsxs("p",{className:"text-sm text-gray-500 mt-1",children:["完成日期: ",r]})]}),l.jsx("button",{onClick:n,className:"w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0",children:l.jsx(tt,{className:"w-5 h-5"})})]}),l.jsxs("div",{className:"px-4 py-6 space-y-6",children:[l.jsx("div",{children:l.jsx("p",{className:"text-gray-700 leading-relaxed",children:e.summary})}),l.jsxs("div",{children:[l.jsx("h3",{className:"font-semibold text-gray-800 mb-2",children:"詳細說明"}),l.jsx("p",{className:"text-gray-600 leading-relaxed",children:e.details})]}),e.tips&&e.tips.length>0&&l.jsxs("div",{children:[l.jsxs("h3",{className:"font-semibold text-gray-800 mb-3 flex items-center gap-2",children:[l.jsx(S1,{className:"w-5 h-5 text-primary"}),"練習小撇步"]}),l.jsx("ul",{className:"space-y-2",children:e.tips.map((c,d)=>l.jsxs("li",{className:"flex gap-2",children:[l.jsx("span",{className:"text-primary flex-shrink-0",children:"•"}),l.jsx("span",{className:"text-gray-600",children:c})]},d))})]})]}),l.jsxs("div",{className:"sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3",children:[l.jsxs("button",{onClick:o,className:`
                  flex-1 py-3 px-6 rounded-2xl font-medium transition-all flex items-center justify-center gap-2
                  ${a?"bg-gray-100 text-gray-600 hover:bg-gray-200":"bg-primary text-white shadow-soft hover:bg-primary-dark"}
                `,children:[l.jsx(w1,{className:"w-5 h-5"}),a?"已完成":"標記完成"]}),l.jsxs("button",{onClick:s,className:"px-6 py-3 rounded-2xl bg-secondary text-white shadow-soft hover:bg-secondary-dark transition-all flex items-center gap-2",children:[l.jsx(ri,{className:"w-5 h-5"}),"分享"]})]})]})]})})}function wF({progress:e,onToggleMilestone:t}){var u,y;const[n,a]=C.useState("0-2"),[r,o]=C.useState("all"),[s,c]=C.useState(null),d=C.useMemo(()=>qI.filter(k=>{const g=k.monthRange===n,v=r==="all"||k.category===r;return g&&v}),[n,r]),h=C.useMemo(()=>qI.find(k=>k.id===s)||null,[s]);return l.jsxs("div",{className:"min-h-screen bg-warm-white pb-6",children:[l.jsxs("div",{className:"bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[l.jsx(dt,{className:"w-6 h-6 text-primary"}),l.jsx("h2",{className:"text-xl font-bold text-gray-800",children:"寶寶成長里程碑"})]}),l.jsx("p",{className:"text-sm text-gray-600",children:"記錄寶寶每個珍貴的成長時刻，從第一個微笑到第一步"})]}),l.jsx("div",{className:"px-4 mb-4",children:l.jsx(mF,{ranges:kF,selected:n,onChange:a})}),l.jsx("div",{className:"px-4 mb-4",children:l.jsx(gF,{categories:fF,selected:r,onChange:o})}),l.jsx("div",{className:"px-4 space-y-3",children:l.jsx(Ze,{mode:"popLayout",children:d.length>0?d.map((k,g)=>{var v,x;return l.jsx(F.div,{layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.2,delay:g*.05},children:l.jsx(xF,{milestone:k,isCompleted:((v=e[k.id])==null?void 0:v.achieved)||!1,achievedDate:(x=e[k.id])==null?void 0:x.achievedDate,onToggle:()=>t(k.id),onClick:()=>c(k.id)})},k.id)}):l.jsxs(F.div,{initial:{opacity:0},animate:{opacity:1},className:"text-center py-12",children:[l.jsx("div",{className:"text-6xl mb-4",children:"👶"}),l.jsx("p",{className:"text-gray-500",children:r==="all"?"這個月齡階段沒有里程碑資料":"這個分類沒有里程碑資料"})]})})}),l.jsx(MF,{milestone:h,isOpen:!!h,onClose:()=>c(null),isCompleted:h&&((u=e[h.id])==null?void 0:u.achieved)||!1,achievedDate:h?(y=e[h.id])==null?void 0:y.achievedDate:void 0,onToggle:()=>h&&t(h.id)})]})}const LF=[{id:"safety-sleep",title:"睡眠安全",description:"仰睡，床鋪無鬆軟枕頭被褥，同室不同床",icon:"Moon"},{id:"safety-feeding",title:"飲食習慣",description:"6個月後逐步添加副食品，培養自主進食",icon:"UtensilsCrossed"},{id:"safety-oral",title:"口腔清潔",description:"即使沒長牙，餵奶後也可用紗布清潔口腔",icon:"Sparkles"},{id:"safety-vaccine",title:"疫苗接種",description:"按時接種預防針，滿5個月可接種卡介苗",icon:"Syringe"},{id:"safety-home",title:"居家安全",description:"移除危險物品，保護會爬會走的寶寶",icon:"ShieldCheck"},{id:"safety-bonding",title:"親密互動",description:"每天說話、唱歌，增加安全感",icon:"Heart"}],DI=[{month:1,title:"臍帶與皮膚護理",category:"physiological",highlights:["臍帶脫落前保持乾燥（洗澡後用 95% 酒精消毒乾燥）","新生兒脫皮是正常的，不需過度擦乳液","一週洗澡 2-3 次即可"]},{month:2,title:"排氣與情緒安撫",category:"physiological",highlights:["進入「腸絞痛」高發期，餵奶後務必拍嗝","每天做 2-3 次排氣操（空中腳踏車）","此時開始會社會性微笑，多給予眼神交流"]},{month:3,title:"抬頭與感官發展",category:"physiological",highlights:["練習 Tummy Time（趴睡抬頭），每天數次、每次 1-2 分鐘","加強頸部肌肉發展","白天拉開窗簾、晚上關燈，建立晝夜節律"]},{month:4,title:"副食品與口水疹",category:"feeding",highlights:["準備開始餵副食品（從十倍粥或果菜泥開始）","唾腺發育旺盛，需勤換圍兜","用「按壓」方式擦乾口水，避免口水疹"]},{month:5,title:"翻身安全警訊",category:"safety",highlights:["寶寶隨時會翻身，絕不可單獨留在尿布台或沙發上","若開始長牙，會因牙齦癢愛咬東西","需準備乾淨的固齒器"]},{month:6,title:"口腔清潔與坐姿",category:"feeding",highlights:["正式進入副食品規律期（一天 1-2 次）","開始練習坐姿，周圍需墊軟墊","早晚用紗布巾擦拭牙齦與新牙"]},{month:7,title:"爬行啟動與飲水",category:"safety",highlights:["寶寶開始會蠕動爬行，地板清潔要徹底","副食品量增加後，可開始練習用水杯喝水","預防便秘"]},{month:8,title:"居家環境大安檢",category:"safety",highlights:["寶寶活動力激增，需加裝插座保護蓋","收好地板上的細小物體（如硬幣、鈕扣）","避免誤食窒息"]},{month:9,title:"分離焦慮與安撫",category:"physiological",highlights:["寶寶變得很黏人、怕生，離開前要溫柔告知（不要偷溜）","建立固定的睡前儀式（洗澡→說故事→睡覺）","增加安全感"]},{month:10,title:"手指食物與咀嚼",category:"feeding",highlights:["提供手指食物（如煮軟的紅蘿蔔條、香蕉切片）","訓練手眼協調與咀嚼能力","應減少奶量，增加固體食物比例"]},{month:11,title:"扶站與撞擊防護",category:"safety",highlights:["寶寶會扶著家具站立或橫移","家中的尖銳桌角必須貼上防撞條","撤走可能被扯落的桌巾"]},{month:12,title:"作息調整與轉奶",category:"feeding",highlights:["滿週歲後，飲食應改為「正餐為主、奶為輔」（早晚奶）","可開始練習拿湯匙","嘗試與大人共餐（去油去鹽）"]}],FI=[{value:"all",label:"全部",icon:"Grid3x3"},{value:"physiological",label:"生理護理",icon:"Activity"},{value:"feeding",label:"餵養細節",icon:"Apple"},{value:"safety",label:"環境安全",icon:"ShieldAlert"}];function CF(){const[e,t]=C.useState("all"),n=C.useMemo(()=>e==="all"?DI:DI.filter(o=>o.category===e),[e]),a=o=>{switch(o){case"physiological":return"bg-blue-100 text-blue-700";case"feeding":return"bg-green-100 text-green-700";case"safety":return"bg-red-100 text-red-700";default:return"bg-gray-100 text-gray-700"}},r=o=>{const s=FI.find(c=>c.value===o);return s?s.label:o};return l.jsxs("div",{className:"min-h-screen bg-warm-white pb-6",children:[l.jsxs("div",{className:"bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(Gt,{className:"w-6 h-6 text-primary"}),l.jsx("h2",{className:"text-xl font-bold text-gray-800",children:"重點注意事項"})]}),l.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"適用於所有階段的核心照顧原則"}),l.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3",children:LF.map(o=>{const s=T1[o.icon];return l.jsx(F.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-white rounded-2xl p-4 shadow-soft",children:l.jsxs("div",{className:"flex items-start gap-3",children:[s&&l.jsx("div",{className:"w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0",children:l.jsx(s,{className:"w-5 h-5 text-primary"})}),l.jsxs("div",{className:"flex-1",children:[l.jsx("h3",{className:"font-semibold text-gray-800 mb-1",children:o.title}),l.jsx("p",{className:"text-sm text-gray-600",children:o.description})]})]})},o.id)})})]}),l.jsxs("div",{className:"px-4 mb-4",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[l.jsx(ya,{className:"w-5 h-5 text-gray-600"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"篩選照顧類別"})]}),l.jsx("div",{className:"flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide",children:FI.map(o=>{const s=T1[o.icon];return l.jsxs("button",{onClick:()=>t(o.value),className:`
                  flex items-center gap-2 px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all snap-center
                  ${e===o.value?"bg-secondary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
                `,children:[s&&l.jsx(s,{className:"w-4 h-4"}),l.jsx("span",{children:o.label})]},o.value)})})]}),l.jsxs("div",{className:"px-4",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(gt,{className:"w-5 h-5 text-gray-600"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"按月齡照顧重點"}),l.jsxs("span",{className:"text-sm text-gray-500",children:["（共 ",n.length," 項）"]})]}),l.jsx("div",{className:"space-y-3",children:l.jsx(Ze,{mode:"popLayout",children:n.map((o,s)=>l.jsxs(F.div,{layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.2,delay:s*.05},className:"card",children:[l.jsxs("div",{className:"flex items-start gap-3 mb-3",children:[l.jsxs("div",{className:"w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 text-white font-bold",children:[o.month,"月"]}),l.jsx("div",{className:"flex-1",children:l.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[l.jsx("h4",{className:"font-semibold text-gray-800",children:o.title}),l.jsx("span",{className:`text-xs px-2 py-1 rounded-full ${a(o.category)}`,children:r(o.category)})]})})]}),l.jsx("ul",{className:"space-y-2",children:o.highlights.map((c,d)=>l.jsxs("li",{className:"flex gap-2 text-sm text-gray-700",children:[l.jsx(M1,{className:"w-4 h-4 text-primary flex-shrink-0 mt-0.5"}),l.jsx("span",{children:c})]},d))})]},o.month))})})]})]})}const RI=[{id:"hepb-birth",name:"B型肝炎疫苗 第1劑",timing:"出生24小時內",fundingType:"public",ageInMonths:0,ageLabel:"出生",doses:3,currentDose:1,sideEffects:["注射部位紅腫","輕微發燒"],notes:"出生後儘速接種"},{id:"hepb-1m",name:"B型肝炎疫苗 第2劑",timing:"出生滿1個月",fundingType:"public",ageInMonths:1,ageLabel:"1個月",doses:3,currentDose:2,sideEffects:["注射部位紅腫","輕微發燒"]},{id:"hepb-6m",name:"B型肝炎疫苗 第3劑",timing:"出生滿6個月",fundingType:"public",ageInMonths:6,ageLabel:"6個月",doses:3,currentDose:3,sideEffects:["注射部位紅腫","輕微發燒"]},{id:"pentavalent-2m",name:"五合一疫苗 第1劑",timing:"出生滿2個月",fundingType:"public",ageInMonths:2,ageLabel:"2個月",doses:4,currentDose:1,sideEffects:["發燒","注射部位腫脹","煩躁不安","食慾下降"],notes:"含白喉、破傷風、百日咳、小兒麻痺、b型嗜血桿菌"},{id:"pneumococcal-2m",name:"13價肺炎鏈球菌疫苗 第1劑",timing:"出生滿2個月",fundingType:"public",ageInMonths:2,ageLabel:"2個月",doses:4,currentDose:1,sideEffects:["發燒","注射部位紅腫疼痛","煩躁","嗜睡"]},{id:"rotavirus-2m",name:"口服輪狀病毒疫苗 第1劑",timing:"出生滿2個月",fundingType:"private",ageInMonths:2,ageLabel:"2個月",doses:2,currentDose:1,sideEffects:["輕微腹瀉","嘔吐","煩躁"],notes:"自費疫苗，須在6個月前完成"},{id:"pentavalent-4m",name:"五合一疫苗 第2劑",timing:"出生滿4個月",fundingType:"public",ageInMonths:4,ageLabel:"4個月",doses:4,currentDose:2,sideEffects:["發燒","注射部位腫脹","煩躁不安","食慾下降"]},{id:"pneumococcal-4m",name:"13價肺炎鏈球菌疫苗 第2劑",timing:"出生滿4個月",fundingType:"public",ageInMonths:4,ageLabel:"4個月",doses:4,currentDose:2,sideEffects:["發燒","注射部位紅腫疼痛","煩躁","嗜睡"]},{id:"rotavirus-4m",name:"口服輪狀病毒疫苗 第2劑",timing:"出生滿4個月",fundingType:"private",ageInMonths:4,ageLabel:"4個月",doses:2,currentDose:2,sideEffects:["輕微腹瀉","嘔吐","煩躁"],notes:"自費疫苗"},{id:"bcg-5m",name:"卡介苗",timing:"出生滿5個月",fundingType:"public",ageInMonths:5,ageLabel:"5個月",doses:1,currentDose:1,sideEffects:["注射部位紅腫結痂","可能形成疤痕"],notes:"預防結核病"},{id:"pentavalent-6m",name:"五合一疫苗 第3劑",timing:"出生滿6個月",fundingType:"public",ageInMonths:6,ageLabel:"6個月",doses:4,currentDose:3,sideEffects:["發燒","注射部位腫脹","煩躁不安","食慾下降"]},{id:"pneumococcal-12m",name:"13價肺炎鏈球菌疫苗 第3劑",timing:"出生滿12個月",fundingType:"public",ageInMonths:12,ageLabel:"12個月",doses:4,currentDose:3,sideEffects:["發燒","注射部位紅腫疼痛","煩躁","嗜睡"]},{id:"mmr-12m",name:"麻疹腮腺炎德國麻疹混合疫苗 第1劑",timing:"出生滿12個月",fundingType:"public",ageInMonths:12,ageLabel:"12個月",doses:2,currentDose:1,sideEffects:["發燒","出疹","注射部位腫痛"],notes:"可能在接種後5-12天出現發燒"},{id:"varicella-12m",name:"水痘疫苗 第1劑",timing:"出生滿12個月",fundingType:"public",ageInMonths:12,ageLabel:"12個月",doses:1,currentDose:1,sideEffects:["輕微發燒","注射部位紅疹"],notes:"保護力約85%"},{id:"hepa-12m",name:"A型肝炎疫苗 第1劑",timing:"出生滿12個月",fundingType:"public",ageInMonths:12,ageLabel:"12個月",doses:2,currentDose:1,sideEffects:["注射部位疼痛","疲倦","輕微發燒"]},{id:"flu-1y",name:"流感疫苗",timing:"滿6個月以上，每年接種",fundingType:"public",ageInMonths:6,ageLabel:"6個月起",doses:1,sideEffects:["注射部位痠痛","輕微發燒","疲倦"],notes:"每年10月開始接種"},{id:"pentavalent-18m",name:"五合一疫苗 第4劑",timing:"出生滿18個月",fundingType:"public",ageInMonths:18,ageLabel:"18個月",doses:4,currentDose:4,sideEffects:["發燒","注射部位腫脹","煩躁不安","食慾下降"]},{id:"hepa-18m",name:"A型肝炎疫苗 第2劑",timing:"出生滿18個月",fundingType:"public",ageInMonths:18,ageLabel:"18個月",doses:2,currentDose:2,sideEffects:["注射部位疼痛","疲倦","輕微發燒"]},{id:"je-15m",name:"日本腦炎疫苗 第1劑",timing:"出生滿15個月",fundingType:"public",ageInMonths:15,ageLabel:"15個月",doses:3,currentDose:1,sideEffects:["發燒","注射部位紅腫","頭痛"],notes:"間隔2週接種第2劑"},{id:"je-15m-2",name:"日本腦炎疫苗 第2劑",timing:"第1劑後2週",fundingType:"public",ageInMonths:15.5,ageLabel:"15個月後2週",doses:3,currentDose:2,sideEffects:["發燒","注射部位紅腫","頭痛"]},{id:"je-27m",name:"日本腦炎疫苗 第3劑",timing:"第1劑後12個月",fundingType:"public",ageInMonths:27,ageLabel:"27個月",doses:3,currentDose:3,sideEffects:["發燒","注射部位紅腫","頭痛"]},{id:"pneumococcal-2y",name:"13價肺炎鏈球菌疫苗 第4劑",timing:"2-5歲補接種",fundingType:"public",ageInMonths:24,ageLabel:"2歲",doses:4,currentDose:4,sideEffects:["發燒","注射部位紅腫疼痛","煩躁","嗜睡"],notes:"高風險幼兒追加"},{id:"mmr-5y",name:"麻疹腮腺炎德國麻疹混合疫苗 第2劑",timing:"滿5歲至入小學前",fundingType:"public",ageInMonths:60,ageLabel:"5歲",doses:2,currentDose:2,sideEffects:["發燒","出疹","注射部位腫痛"]},{id:"tdap-5y",name:"減量破傷風白喉非細胞性百日咳及不活化小兒麻痺混合疫苗",timing:"滿5歲至入小學前",fundingType:"public",ageInMonths:60,ageLabel:"5歲",doses:1,sideEffects:["注射部位痠痛腫脹","疲倦","輕微發燒"],notes:"俗稱四合一疫苗"},{id:"je-5y",name:"日本腦炎疫苗 第4劑",timing:"滿5歲至入小學前",fundingType:"public",ageInMonths:60,ageLabel:"5歲",doses:4,currentDose:4,sideEffects:["發燒","注射部位紅腫","頭痛"]},{id:"enterovirus",name:"腸病毒71型疫苗",timing:"出生滿2個月起",fundingType:"private",ageInMonths:2,ageLabel:"2個月起",doses:2,sideEffects:["注射部位紅腫","輕微發燒","煩躁"],notes:"自費疫苗，間隔2個月接種"}],SF=[{category:"常見輕微反應",icon:"Thermometer",reactions:[{symptom:"發燒（<38.5°C）",severity:"mild",response:"多喝水、穿著輕薄衣物、溫水擦拭身體"},{symptom:"注射部位紅腫疼痛",severity:"mild",response:"冰敷15-20分鐘，避免搓揉"},{symptom:"食慾不振、煩躁不安",severity:"mild",response:"少量多餐、多安撫、觀察1-2天"},{symptom:"嗜睡",severity:"mild",response:"讓寶寶充分休息，但需定時確認反應"}]},{category:"需密切觀察",icon:"AlertCircle",reactions:[{symptom:"持續高燒（≥38.5°C超過24小時）",severity:"moderate",response:"使用退燒藥（依醫囑），若超過48小時未退燒需就醫"},{symptom:"注射部位硬塊（>2公分）",severity:"moderate",response:"溫熱敷、輕柔按摩，若持續擴大需回診"},{symptom:"輕微出疹（麻疹、水痘疫苗）",severity:"moderate",response:"保持皮膚清潔乾燥，避免抓破，5-7天內會消退"}]},{category:"立即就醫",icon:"AlertTriangle",reactions:[{symptom:"高燒不退（>39°C）伴隨抽搐",severity:"severe",response:"立即送急診，保持呼吸道暢通"},{symptom:"呼吸困難、臉色蒼白、嘴唇發紫",severity:"severe",response:"疑似過敏性休克，立即叫救護車"},{symptom:"持續嘔吐、嚴重腹瀉（輪狀病毒疫苗）",severity:"severe",response:"可能腸套疊，立即就醫"},{symptom:"活動力極差、不吃不喝超過8小時",severity:"severe",response:"立即就醫檢查"}]}],IF=[{id:"seizure",symptom:"抽搐或痙攣",icon:"Zap",action:"保持側臥、移除周圍危險物品、記錄時間長度、立即送急診"},{id:"anaphylaxis",symptom:"全身起疹、呼吸困難、嘴唇腫脹",icon:"AlertOctagon",action:"疑似過敏性休克，立即撥打119並平躺抬高雙腳"},{id:"intussusception",symptom:"嚴重腹痛、血便、果醬狀大便",icon:"Activity",action:"可能腸套疊（輪狀病毒疫苗罕見併發症），立即急診"},{id:"high-fever",symptom:"持續高燒>40°C",icon:"Flame",action:"冰枕降溫、給予退燒藥後立即就醫"},{id:"lethargy",symptom:"極度嗜睡、無法喚醒",icon:"Moon",action:"立即送急診，可能有神經系統反應"}],jF=[{title:"暫緩接種",items:["正在發燒（體溫≥38°C）","中重度急性疾病","正在使用免疫抑制劑","近期接受過輸血或免疫球蛋白"]},{title:"絕對禁忌",items:["曾對該疫苗成分產生嚴重過敏","接種後曾發生過敏性休克","免疫不全者不可接種活性減毒疫苗（麻疹、水痘、卡介苗）"]},{title:"接種後注意",items:["留院觀察30分鐘，確認無立即過敏反應","24小時內避免劇烈運動","注射部位保持清潔乾燥","記錄接種日期與疫苗批號"]}];function bF(){const[e,t]=C.useState("all"),[n,a]=C.useState("all"),[r,o]=C.useState(null),[s,c]=C.useState(!1),[d,h]=C.useState(!1),u=C.useMemo(()=>Array.from(new Set(RI.map(L=>L.ageInMonths||0))).sort((L,m)=>L-m),[]),y=C.useMemo(()=>{let x=RI;return e!=="all"&&(x=x.filter(L=>L.fundingType===e)),n!=="all"&&(x=x.filter(L=>L.ageInMonths===n)),x},[e,n]),k=C.useMemo(()=>{const x={};return y.forEach(L=>{const m=L.ageInMonths||0;x[m]||(x[m]=[]),x[m].push(L)}),x},[y]),g=x=>{o(r===x?null:x)},v=x=>{switch(x){case"mild":return"bg-green-100 text-green-700";case"moderate":return"bg-yellow-100 text-yellow-700";case"severe":return"bg-red-100 text-red-700";default:return"bg-gray-100 text-gray-700"}};return l.jsxs("div",{className:"min-h-screen bg-warm-white pb-6",children:[l.jsxs("div",{className:"bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[l.jsx($t,{className:"w-6 h-6 text-primary"}),l.jsx("h2",{className:"text-xl font-bold text-gray-800",children:"疫苗接種時程表"})]}),l.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"依照衛福部建議時程，記錄寶寶的疫苗接種狀況"}),l.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[l.jsxs("button",{onClick:()=>c(!0),className:"flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium",children:[l.jsx(Gt,{className:"w-4 h-4"}),l.jsx("span",{children:"緊急狀況處理"})]}),l.jsxs("button",{onClick:()=>h(!0),className:"flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium",children:[l.jsx(I1,{className:"w-4 h-4"}),l.jsx("span",{children:"接種注意事項"})]})]})]}),l.jsxs("div",{className:"px-4 mb-4",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[l.jsx(ya,{className:"w-5 h-5 text-gray-600"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"篩選疫苗類型"})]}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{onClick:()=>t("all"),className:`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="all"?"bg-secondary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"全部疫苗"}),l.jsx("button",{onClick:()=>t("public"),className:`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="public"?"bg-green-500 text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"公費疫苗"}),l.jsx("button",{onClick:()=>t("private"),className:`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="private"?"bg-orange-500 text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"自費疫苗"})]})]}),l.jsxs("div",{className:"px-4 mb-4",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[l.jsx(gt,{className:"w-5 h-5 text-gray-600"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"月齡篩選"})]}),l.jsxs("div",{className:"flex gap-2 overflow-x-auto pb-2",children:[l.jsx("button",{onClick:()=>a("all"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${n==="all"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"全部"}),u.map(x=>l.jsxs("button",{onClick:()=>a(x),className:`
                flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
                ${n===x?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
              `,children:[x,"個月"]},x))]})]}),l.jsxs("div",{className:"px-4",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx($t,{className:"w-5 h-5 text-gray-600"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"接種時程"}),l.jsxs("span",{className:"text-sm text-gray-500",children:["（共 ",y.length," 項）"]})]}),l.jsx("div",{className:"space-y-6",children:Object.keys(k).sort((x,L)=>Number(x)-Number(L)).map(x=>{const L=Number(x),m=k[L];return l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[l.jsxs("div",{className:"flex items-center gap-2 bg-gradient-to-r from-primary/10 to-transparent px-4 py-2 rounded-xl",children:[l.jsx(gt,{className:"w-4 h-4 text-primary"}),l.jsxs("span",{className:"font-bold text-primary",children:[L," 個月"]}),l.jsxs("span",{className:"text-sm text-gray-500",children:["(",m.length," 項)"]})]}),l.jsx("div",{className:"flex-1 h-px bg-gray-200"})]}),l.jsx("div",{className:"space-y-3",children:l.jsx(Ze,{mode:"popLayout",children:m.map((p,f)=>{const M=r===p.id;return l.jsx(F.div,{layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.2,delay:f*.02},className:"card cursor-pointer",onClick:()=>g(p.id),children:l.jsxs("div",{className:"flex items-start gap-3",children:[l.jsxs("div",{className:`
                      w-16 h-16 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-white font-bold text-xs
                      ${p.fundingType==="public"?"bg-gradient-to-br from-green-400 to-green-600":"bg-gradient-to-br from-orange-400 to-orange-600"}
                    `,children:[l.jsx("div",{className:"text-lg",children:p.ageInMonths||0}),l.jsx("div",{className:"text-[10px] opacity-90",children:"個月"})]}),l.jsxs("div",{className:"flex-1 min-w-0",children:[l.jsxs("div",{className:"flex items-start justify-between gap-2 mb-1",children:[l.jsx("h4",{className:"font-semibold text-gray-800 leading-tight",children:p.name}),l.jsx(F.div,{animate:{rotate:M?180:0},transition:{duration:.2},children:l.jsx(ha,{className:"w-5 h-5 text-gray-400 flex-shrink-0"})})]}),l.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2",children:[l.jsxs("span",{className:"flex items-center gap-1",children:[l.jsx(ua,{className:"w-3 h-3"}),p.timing]}),l.jsx("span",{className:`
                          px-2 py-0.5 rounded-full font-medium
                          ${p.fundingType==="public"?"bg-green-100 text-green-700":"bg-orange-100 text-orange-700"}
                        `,children:p.fundingType==="public"?"公費":"自費"}),p.doses>1&&l.jsxs("span",{className:"text-gray-500",children:["第 ",p.currentDose,"/",p.doses," 劑"]})]}),p.notes&&l.jsx("p",{className:"text-xs text-gray-500 italic",children:p.notes}),l.jsx(Ze,{children:M&&l.jsx(F.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.2},className:"mt-3 pt-3 border-t border-gray-100",children:l.jsxs("div",{className:"space-y-2",children:[l.jsxs("div",{className:"flex items-center gap-2 text-sm font-medium text-gray-700",children:[l.jsx(la,{className:"w-4 h-4 text-primary"}),l.jsx("span",{children:"可能的副作用"})]}),l.jsx("ul",{className:"space-y-1 ml-6",children:p.sideEffects.map((w,I)=>l.jsxs("li",{className:"text-sm text-gray-600 flex gap-2",children:[l.jsx("span",{className:"text-primary",children:"•"}),l.jsx("span",{children:w})]},I))})]})})})]})]})},p.id)})})})]},x)})})]}),l.jsxs("div",{className:"px-4 mt-6",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(oi,{className:"w-5 h-5 text-gray-600"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"副作用處理指南"})]}),l.jsx("div",{className:"space-y-3",children:SF.map(x=>{const L=T1[x.icon];return l.jsxs("div",{className:"card",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[L&&l.jsx(L,{className:"w-5 h-5 text-primary"}),l.jsx("h4",{className:"font-semibold text-gray-800",children:x.category})]}),l.jsx("div",{className:"space-y-2",children:x.reactions.map((m,p)=>l.jsxs("div",{className:"flex gap-3 text-sm",children:[l.jsx("span",{className:`
                        px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap h-fit
                        ${v(m.severity)}
                      `,children:m.symptom}),l.jsx("p",{className:"text-gray-600 flex-1",children:m.response})]},p))})]},x.category)})})]}),l.jsx(Ze,{children:s&&l.jsxs(l.Fragment,{children:[l.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>c(!1),className:"fixed inset-0 bg-black/50 z-40"}),l.jsxs(F.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto",children:[l.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(Gt,{className:"w-6 h-6 text-red-600"}),l.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"緊急狀況處理"})]}),l.jsx("button",{onClick:()=>c(!1),className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",children:l.jsx(tt,{className:"w-5 h-5 text-gray-600"})})]}),l.jsx("div",{className:"p-4 space-y-3",children:IF.map(x=>{const L=T1[x.icon];return l.jsx("div",{className:"bg-red-50 border-2 border-red-200 rounded-2xl p-4",children:l.jsxs("div",{className:"flex items-start gap-3",children:[L&&l.jsx("div",{className:"w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0",children:l.jsx(L,{className:"w-5 h-5 text-red-600"})}),l.jsxs("div",{className:"flex-1",children:[l.jsx("h4",{className:"font-semibold text-red-900 mb-1",children:x.symptom}),l.jsx("p",{className:"text-sm text-red-700",children:x.action})]})]})},x.id)})})]})]})}),l.jsx(Ze,{children:d&&l.jsxs(l.Fragment,{children:[l.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>h(!1),className:"fixed inset-0 bg-black/50 z-40"}),l.jsxs(F.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto",children:[l.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(I1,{className:"w-6 h-6 text-blue-600"}),l.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"接種禁忌與注意事項"})]}),l.jsx("button",{onClick:()=>h(!1),className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",children:l.jsx(tt,{className:"w-5 h-5 text-gray-600"})})]}),l.jsx("div",{className:"p-4 space-y-4",children:jF.map((x,L)=>l.jsxs("div",{className:"card",children:[l.jsx("h4",{className:"font-semibold text-gray-800 mb-3",children:x.title}),l.jsx("ul",{className:"space-y-2",children:x.items.map((m,p)=>l.jsxs("li",{className:"flex gap-2 text-sm text-gray-700",children:[l.jsx(M1,{className:"w-4 h-4 text-primary flex-shrink-0 mt-0.5"}),l.jsx("span",{children:m})]},p))})]},L))})]})]})})]})}const PF=[{level:1,name:"啟蒙期",ageRange:"4-6個月",milkRatio:"70-90%",foodRatio:"10-30%",mealsPerDay:"一天一餐",texture:"壓爛或剪碎",keyPoints:["以嘗試少量多樣化的天然食材為主","食物需壓爛或剪碎","不加重鹹糖味","奶水仍是主要營養來源","練習吞嚥與多樣化試敏"],warnings:[]},{level:2,name:"探索期",ageRange:"7-9個月",milkRatio:"60-70%",foodRatio:"30-40%",mealsPerDay:"一天至少兩餐",texture:"泥狀、糊狀到軟塊狀",keyPoints:["讓寶寶體驗不同質地的食物","鍛鍊咀嚼力","副食品比例提高","補充鐵質"],warnings:["嚴禁餵食蜂蜜（有肉毒桿菌風險）","嚴禁整顆硬堅果（有噎到風險）"]},{level:3,name:"進階期",ageRange:"10-12個月",milkRatio:"30-40%",foodRatio:"60-70%",mealsPerDay:"一天三餐起跳",texture:"更多樣形狀（如長條形）",keyPoints:["提供好抓握的食物","練習精細動作","副食品比重開始超過奶量","奶水轉變為點心性質","把主導權還給孩子，不強迫餵食"],warnings:[]}],AF=[{ageRange:"4-6個月",texture:"極稀流質/泥狀（十倍粥、十倍粥泥）",frequency:"1天1次（少量1-2匙開始）",purpose:"練習舌頭後推與吞嚥"},{ageRange:"7-9個月",texture:"濃稠泥/小顆粒粥（七倍粥、剁碎蔬菜）",frequency:"1天2次（逐漸取代一餐奶）",purpose:"練習用舌頭與牙齦壓碎食物"},{ageRange:"10-12個月",texture:"軟塊/手指食物（五倍粥、軟飯、丁狀肉）",frequency:"1天3次（與成人用餐同步）",purpose:"練習咀嚼能力與手眼協調"}],zF=[{level:"low",ageRange:"4-6個月開始",foods:["白米","南瓜","地瓜","胡蘿蔔","高麗菜","蘋果","香蕉"]},{level:"medium",ageRange:"7-9個月開始",foods:["蛋黃（先）","豆腐","白肉魚（鱈魚、鯛魚）","雞肉","大麥","燕麥"]},{level:"high",ageRange:"10個月+ 或少量嘗試",foods:["全蛋（蛋白）","帶殼海鮮（蝦蟹）","花生醬（需稀釋）","奇異果","草莓","番茄"]}],VF=[{month:"4-5個月",focus:"澱粉、根莖",foods:["十倍粥泥","地瓜泥","南瓜泥","紅蘿蔔泥"]},{month:"6個月",focus:"葉菜、基本水果",foods:["青江菜泥","高麗菜泥","蘋果泥","香蕉泥"]},{month:"7-8個月",focus:"植物與禽類蛋白",foods:["蛋黃泥","豆腐泥","雞肉泥","燕麥粥"]},{month:"9-10個月",focus:"魚類、紅肉、全蛋",foods:["鮭魚碎肉","牛肉泥","全蛋（蒸蛋）","細麵"]},{month:"11-12個月",focus:"多樣化成人食材",foods:["軟飯","小餛飩","起司","優格","剪碎的家常菜"]}],HF=[{category:"蔬菜類",examples:["蒸熟的紅蘿蔔條","綠花椰菜（帶梗方便抓）","南瓜塊","玉米筍（煮極軟）"]},{category:"水果類",examples:["香蕉段（切半）","酪梨條","去皮切片的軟柿或水蜜桃"]},{category:"澱粉類",examples:["烤過的吐司條（去邊）","軟質飯糰","煮軟的螺旋麵"]},{category:"蛋白類",examples:["漢堡排（碎肉壓製）","厚片蛋餅"]}],TF=[{id:"early-start",title:"四個月就可以開始吃副食品",description:"把握4-9個月免疫耐受性黃金時期，及早接觸反而能降低過敏機率",icon:"Calendar"},{id:"no-delay",title:"父母有過敏體質也不需延後",description:"現代醫學已證實，太晚給副食品非但不能減少過敏，反而可能提高",icon:"ShieldCheck"},{id:"natural-foods",title:"一歲前除蜂蜜外都可嘗試",description:"什麼天然食物都可以添加，除非吃了產生過敏症狀。少量多樣化最重要",icon:"Leaf"}],qF=[{id:"honey",title:"1歲前嚴禁蜂蜜",description:"含有肉毒桿菌孢子，可能對嬰兒造成致命威脅",icon:"AlertOctagon",severity:"danger"},{id:"choking-hazards",title:"避開窒息風險食物",description:"整顆葡萄、硬堅果、麻糬等黏性強或圓形硬物絕對禁止",icon:"AlertTriangle",severity:"danger"},{id:"no-seasoning",title:"不額外加鹽糖",description:"寶寶腎臟尚未發育完全，且要培養天然口味，避免未來挑食或重口味",icon:"XCircle",severity:"warning"},{id:"iron-supplement",title:"補鐵是關鍵",description:"6個月後母乳鐵質不足，應優先提供蛋黃、紅肉、豬肝泥或強化鐵質的米精",icon:"Droplet",severity:"info"},{id:"water",title:"水分補充",description:"開始副食品後可給予少量飲水（一次30-50ml），主要是為了漱口與習慣味道",icon:"Droplets",severity:"info"}],hr={name:"4x3 試敏法",description:"早期接觸（4-9個月內）反而能建立免疫耐受性，降低未來過敏機率",steps:[{step:1,title:"小量試3天",description:"第一天給一小口，觀察是否有紅疹、腹瀉、嘔吐"},{step:2,title:"增量試3天",description:"若無反應，第二天增加份量，持續觀察"},{step:3,title:"觀察3天",description:"停止新食材，觀察是否有延遲性過敏"}],principle:"每次只試「一種」新食材，若發生過敏，記錄並暫停該食材1-2個月再試"},Y9={title:"手指食物（BLW）挑選3大原則",ageRange:"7-8個月起",principles:[{name:"尺寸",description:"長度約為寶寶握緊拳頭後露出2-3公分（像粗薯條），方便抓握"},{name:"硬度",description:"父母用大拇指與食指能輕易壓碎的程度（如煮熟的紅蘿蔔）"},{name:"安全性",description:"絕對避開圓形（整顆葡萄）、硬殼（堅果）、黏性強（麻糬、蛋黃乾吃）的食物"}]},DF=[{id:"puree",name:"食物泥",description:"將食材打成泥狀，適合初期嘗試"},{id:"traditional",name:"傳統泥粥漸進法",description:"從十倍粥開始，逐步增加濃稠度"},{id:"blw",name:"BLW（寶寶主導式離乳法）",description:"提供手指食物，讓寶寶自己抓取進食"},{id:"follow-parents",name:"少量多樣化，跟著大人吃",description:"最推薦的方法，與家人同步用餐，培養良好飲食習慣"}],FF=["寶寶滿四個月大","寶寶會對大人食物睜大眼睛","開始表現出對大人食物感興趣","脖子能撐住、能坐穩","出現咀嚼動作"];function RF(){const[e,t]=C.useState("overview"),[n,a]=C.useState(!1),[r,o]=C.useState(!1),[s,c]=C.useState(null),d=u=>{switch(u){case"danger":return"bg-red-50 border-red-200 text-red-800";case"warning":return"bg-yellow-50 border-yellow-200 text-yellow-800";case"info":return"bg-blue-50 border-blue-200 text-blue-800";default:return"bg-gray-50 border-gray-200 text-gray-800"}},h=u=>{switch(u){case"low":return"bg-green-100 text-green-700";case"medium":return"bg-yellow-100 text-yellow-700";case"high":return"bg-orange-100 text-orange-700";default:return"bg-gray-100 text-gray-700"}};return l.jsxs("div",{className:"min-h-screen bg-warm-white pb-6",children:[l.jsxs("div",{className:"bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[l.jsx(j1,{className:"w-6 h-6 text-primary"}),l.jsx("h2",{className:"text-xl font-bold text-gray-800",children:"副食品指南"})]}),l.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"4-12個月寶寶的副食品添加完整攻略"}),l.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[l.jsxs("button",{onClick:()=>a(!0),className:"flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium",children:[l.jsx(ka,{className:"w-4 h-4"}),l.jsx("span",{children:"4x3 試敏法"})]}),l.jsxs("button",{onClick:()=>o(!0),className:"flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium",children:[l.jsx(L1,{className:"w-4 h-4"}),l.jsx("span",{children:"手指食物指南"})]})]})]}),l.jsx("div",{className:"px-4 mb-4",children:l.jsxs("div",{className:"flex gap-2 overflow-x-auto pb-2",children:[l.jsx("button",{onClick:()=>t("overview"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="overview"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"總覽"}),l.jsx("button",{onClick:()=>t("stages"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="stages"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"發展階段"}),l.jsx("button",{onClick:()=>t("menu"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="menu"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"菜單建議"}),l.jsx("button",{onClick:()=>t("safety"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="safety"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"安全須知"})]})}),e==="overview"&&l.jsxs("div",{className:"px-4 space-y-6",children:[l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(S1,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"副食品添加三大原則"})]}),l.jsx("div",{className:"space-y-3",children:TF.map(u=>{const y=T1[u.icon];return l.jsx(F.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"card",children:l.jsxs("div",{className:"flex gap-3",children:[y&&l.jsx("div",{className:"w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0",children:l.jsx(y,{className:"w-5 h-5 text-primary"})}),l.jsxs("div",{className:"flex-1",children:[l.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:u.title}),l.jsx("p",{className:"text-sm text-gray-600",children:u.description})]})]})},u.id)})})]}),l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(ai,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"開始副食品的時機"})]}),l.jsx("div",{className:"card",children:l.jsx("ul",{className:"space-y-2",children:FF.map((u,y)=>l.jsxs("li",{className:"flex gap-2 text-sm text-gray-700",children:[l.jsx(w1,{className:"w-4 h-4 text-primary flex-shrink-0 mt-0.5"}),l.jsx("span",{children:u})]},y))})})]}),l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(li,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"常見副食品餵食法"})]}),l.jsx("div",{className:"space-y-2",children:DF.map(u=>l.jsxs("div",{className:"card",children:[l.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:u.name}),l.jsx("p",{className:"text-sm text-gray-600",children:u.description})]},u.id))})]}),l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(ci,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"質地與頻率轉變"})]}),l.jsx("div",{className:"space-y-3",children:AF.map((u,y)=>l.jsx("div",{className:"card bg-gradient-to-r from-secondary/5 to-transparent",children:l.jsxs("div",{className:"flex items-start gap-3",children:[l.jsx("div",{className:"w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0 font-bold text-secondary",children:y+1}),l.jsxs("div",{className:"flex-1",children:[l.jsx("div",{className:"font-semibold text-gray-800 mb-1",children:u.ageRange}),l.jsxs("div",{className:"text-sm text-gray-600 space-y-1",children:[l.jsxs("div",{children:[l.jsx("span",{className:"font-medium",children:"質地："}),u.texture]}),l.jsxs("div",{children:[l.jsx("span",{className:"font-medium",children:"頻率："}),u.frequency]}),l.jsxs("div",{children:[l.jsx("span",{className:"font-medium",children:"目的："}),u.purpose]})]})]})]})},y))})]})]}),e==="stages"&&l.jsxs("div",{className:"px-4",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(ti,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"副食品與奶量轉換三階段"})]}),l.jsx("div",{className:"space-y-3",children:PF.map(u=>{const y=s===u.level;return l.jsx(F.div,{layout:!0,className:"card cursor-pointer",onClick:()=>c(y?null:u.level),children:l.jsxs("div",{className:"flex items-start gap-3",children:[l.jsxs("div",{className:"w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center text-white font-bold flex-shrink-0",children:[l.jsx("div",{className:"text-xs opacity-90",children:"Level"}),l.jsx("div",{className:"text-2xl",children:u.level})]}),l.jsxs("div",{className:"flex-1",children:[l.jsxs("div",{className:"flex items-start justify-between gap-2 mb-2",children:[l.jsxs("div",{children:[l.jsx("h4",{className:"font-bold text-gray-800",children:u.name}),l.jsx("p",{className:"text-sm text-gray-600",children:u.ageRange})]}),l.jsx(F.div,{animate:{rotate:y?180:0},transition:{duration:.2},children:l.jsx(ha,{className:"w-5 h-5 text-gray-400"})})]}),l.jsxs("div",{className:"grid grid-cols-2 gap-2 text-xs mb-2",children:[l.jsxs("div",{className:"bg-blue-50 px-2 py-1 rounded",children:[l.jsx("span",{className:"text-blue-600",children:"奶："}),l.jsx("span",{className:"font-medium text-blue-800",children:u.milkRatio})]}),l.jsxs("div",{className:"bg-green-50 px-2 py-1 rounded",children:[l.jsx("span",{className:"text-green-600",children:"副食品："}),l.jsx("span",{className:"font-medium text-green-800",children:u.foodRatio})]})]}),l.jsxs("div",{className:"flex items-center gap-2 text-xs text-gray-600",children:[l.jsx(ua,{className:"w-3 h-3"}),l.jsx("span",{children:u.mealsPerDay}),l.jsx("span",{className:"mx-1",children:"•"}),l.jsx("span",{children:u.texture})]}),l.jsx(Ze,{children:y&&l.jsxs(F.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.2},className:"mt-3 pt-3 border-t border-gray-100 space-y-3",children:[l.jsxs("div",{children:[l.jsx("div",{className:"text-sm font-medium text-gray-700 mb-2",children:"重點提示"}),l.jsx("ul",{className:"space-y-1",children:u.keyPoints.map((k,g)=>l.jsxs("li",{className:"text-sm text-gray-600 flex gap-2",children:[l.jsx(ei,{className:"w-4 h-4 text-primary flex-shrink-0"}),l.jsx("span",{children:k})]},g))})]}),u.warnings&&u.warnings.length>0&&l.jsxs("div",{className:"bg-red-50 border border-red-200 rounded-xl p-3",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx(Gt,{className:"w-4 h-4 text-red-600"}),l.jsx("span",{className:"text-sm font-medium text-red-800",children:"特別注意"})]}),l.jsx("ul",{className:"space-y-1",children:u.warnings.map((k,g)=>l.jsxs("li",{className:"text-sm text-red-700",children:["• ",k]},g))})]})]})})]})]})},u.level)})})]}),e==="menu"&&l.jsxs("div",{className:"px-4 space-y-6",children:[l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(Ya,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"試敏菜單與月份推薦"})]}),l.jsx("div",{className:"space-y-3",children:VF.map((u,y)=>l.jsxs(F.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:y*.05},className:"card",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("div",{className:"w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center",children:l.jsx(gt,{className:"w-4 h-4 text-primary"})}),l.jsxs("div",{children:[l.jsx("h4",{className:"font-semibold text-gray-800",children:u.month}),l.jsxs("p",{className:"text-xs text-gray-600",children:["重點：",u.focus]})]})]}),l.jsx("div",{className:"flex flex-wrap gap-2",children:u.foods.map((k,g)=>l.jsx("span",{className:"px-2 py-1 bg-secondary/10 text-secondary rounded-lg text-xs font-medium",children:k},g))})]},y))})]}),l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(I1,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"食物過敏程度分類"})]}),l.jsx("div",{className:"space-y-3",children:zF.map(u=>l.jsxs("div",{className:"card",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[l.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-bold ${h(u.level)}`,children:u.level==="low"?"低敏":u.level==="medium"?"中敏":"高敏"}),l.jsx("span",{className:"text-sm text-gray-600",children:u.ageRange})]}),l.jsx("div",{className:"flex flex-wrap gap-2",children:u.foods.map((y,k)=>l.jsx("span",{className:"text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded",children:y},k))})]},u.level))})]}),l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(L1,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"手指食物推薦（7-8個月起）"})]}),l.jsx("div",{className:"space-y-2",children:HF.map(u=>l.jsxs("div",{className:"card",children:[l.jsx("h4",{className:"font-semibold text-gray-800 mb-2",children:u.category}),l.jsx("div",{className:"flex flex-wrap gap-2",children:u.examples.map((y,k)=>l.jsx("span",{className:"text-sm text-gray-700 bg-orange-50 px-2 py-1 rounded",children:y},k))})]},u.category))})]})]}),e==="safety"&&l.jsxs("div",{className:"px-4",children:[l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(pa,{className:"w-5 h-5 text-primary"}),l.jsx("h3",{className:"font-semibold text-gray-800",children:"專業提醒與禁忌"})]}),l.jsx("div",{className:"space-y-3",children:qF.map(u=>{const y=T1[u.icon];return l.jsx(F.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},className:`card border-2 ${d(u.severity)}`,children:l.jsxs("div",{className:"flex gap-3",children:[y&&l.jsx("div",{className:"flex-shrink-0",children:l.jsx(y,{className:"w-6 h-6"})}),l.jsxs("div",{className:"flex-1",children:[l.jsx("h4",{className:"font-bold mb-1",children:u.title}),l.jsx("p",{className:"text-sm",children:u.description})]})]})},u.id)})})]}),l.jsx(Ze,{children:n&&l.jsxs(l.Fragment,{children:[l.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>a(!1),className:"fixed inset-0 bg-black/50 z-40"}),l.jsxs(F.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto",children:[l.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(ka,{className:"w-6 h-6 text-purple-600"}),l.jsx("h3",{className:"text-lg font-bold text-gray-800",children:hr.name})]}),l.jsx("button",{onClick:()=>a(!1),className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",children:l.jsx(tt,{className:"w-5 h-5 text-gray-600"})})]}),l.jsxs("div",{className:"p-4 space-y-4",children:[l.jsx("div",{className:"bg-purple-50 border border-purple-200 rounded-2xl p-4",children:l.jsx("p",{className:"text-sm text-purple-800",children:hr.description})}),hr.steps.map(u=>l.jsx("div",{className:"card",children:l.jsxs("div",{className:"flex gap-3",children:[l.jsx("div",{className:"w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 font-bold text-purple-700",children:u.step}),l.jsxs("div",{className:"flex-1",children:[l.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:u.title}),l.jsx("p",{className:"text-sm text-gray-600",children:u.description})]})]})},u.step)),l.jsx("div",{className:"bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4",children:l.jsxs("div",{className:"flex items-start gap-2",children:[l.jsx(S1,{className:"w-5 h-5 text-yellow-600 flex-shrink-0"}),l.jsx("p",{className:"text-sm text-yellow-800 font-medium",children:hr.principle})]})})]})]})]})}),l.jsx(Ze,{children:r&&l.jsxs(l.Fragment,{children:[l.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>o(!1),className:"fixed inset-0 bg-black/50 z-40"}),l.jsxs(F.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto",children:[l.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(L1,{className:"w-6 h-6 text-orange-600"}),l.jsx("h3",{className:"text-lg font-bold text-gray-800",children:Y9.title})]}),l.jsx("button",{onClick:()=>o(!1),className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",children:l.jsx(tt,{className:"w-5 h-5 text-gray-600"})})]}),l.jsxs("div",{className:"p-4 space-y-4",children:[l.jsx("div",{className:"bg-orange-50 border border-orange-200 rounded-2xl p-4",children:l.jsxs("p",{className:"text-sm text-orange-800 font-medium",children:["適用年齡：",Y9.ageRange]})}),Y9.principles.map((u,y)=>l.jsx("div",{className:"card",children:l.jsxs("div",{className:"flex gap-3",children:[l.jsx("div",{className:"w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0",children:l.jsx(M1,{className:"w-5 h-5 text-orange-600"})}),l.jsxs("div",{className:"flex-1",children:[l.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:u.name}),l.jsx("p",{className:"text-sm text-gray-600",children:u.description})]})]})},y))]})]})]})})]})}function BF(){const[e,t]=C.useState("home"),[n,a]=C.useState(!1),[r,o]=zS("child-profiles",[]),[s,c]=zS("current-child-id",null),d=C.useMemo(()=>r.find(p=>p.id===s),[r,s]),h=C.useMemo(()=>d?d.milestoneProgress:{},[d]);C.useEffect(()=>{r.length>0&&!d?c(r[0].id):r.length===0&&s!==null&&c(null)},[r,d,s,c]);const u=p=>{const f={home:"#/",milestones:"#/milestones","care-guide":"#/care-guide","vaccine-tracking":"#/vaccine-tracking","complementary-food":"#/complementary-food"};window.location.hash=f[p],t(p),window.scrollTo({top:0,behavior:"smooth"})},y=p=>{d&&o(f=>f.map(M=>{var w;if(M.id===d.id){const b=!((w=M.milestoneProgress[p])!=null&&w.achieved)?{achieved:!0,achievedDate:new Date().toISOString().split("T")[0]}:{achieved:!1,achievedDate:void 0};return{...M,milestoneProgress:{...M.milestoneProgress,[p]:b}}}return M}))},k=()=>{let p="LittleSteps";switch(d&&e!=="home"&&(p=`${d.name} 的 `),e){case"home":break;case"milestones":p+="里程碑追蹤";break;case"care-guide":p+="照顧重點";break;case"vaccine-tracking":p+="疫苗追蹤";break;case"complementary-food":p+="副食品指南";break}return p},g=e!=="home",v=(p,f)=>{const M={id:Date.now().toString(),name:p,birthday:f,milestoneProgress:{},createdAt:new Date().toISOString()};o(w=>[...w,M]),c(M.id)},x=(p,f,M)=>{o(w=>w.map(I=>I.id===p?{...I,name:f,birthday:M}:I))},L=p=>{var f;o(M=>M.filter(w=>w.id!==p)),s===p&&c(((f=r[0])==null?void 0:f.id)||null)},m=p=>{c(p)};return l.jsxs("div",{className:"min-h-screen bg-warm-white",children:[l.jsx(yF,{isOpen:n,onClose:()=>a(!1),currentPage:e,onNavigate:u,childProfiles:r,currentChildId:s,setCurrentChildId:m,addChild:v,updateChild:x,deleteChild:L}),g&&l.jsx("header",{className:"bg-white shadow-soft sticky top-0 z-10",children:l.jsxs("div",{className:"px-4 py-4 flex items-center gap-4",children:[l.jsx("button",{onClick:()=>a(!0),className:"w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center",children:l.jsx(ni,{className:"w-5 h-5 text-gray-700"})}),l.jsx("h1",{className:"text-2xl font-bold text-primary flex-1",children:k()}),l.jsx("button",{onClick:()=>u("home"),className:"w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center",title:"返回首頁",children:l.jsx(C1,{className:"w-5 h-5 text-gray-700"})})]})}),l.jsxs("main",{className:g?"pb-6":"",children:[e==="home"&&l.jsx(pF,{onNavigate:u}),e==="milestones"&&l.jsx(wF,{progress:h,onToggleMilestone:y}),e==="care-guide"&&l.jsx(CF,{}),e==="vaccine-tracking"&&l.jsx(bF,{}),e==="complementary-food"&&l.jsx(RF,{})]})]})}J9.createRoot(document.getElementById("root")).render(l.jsx(lL.StrictMode,{children:l.jsx(BF,{})}));
