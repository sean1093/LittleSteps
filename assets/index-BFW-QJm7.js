(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();function vA(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var RI={exports:{}},OM={},BI={exports:{}},F={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ai=Symbol.for("react.element"),xA=Symbol.for("react.portal"),MA=Symbol.for("react.fragment"),wA=Symbol.for("react.strict_mode"),LA=Symbol.for("react.profiler"),CA=Symbol.for("react.provider"),SA=Symbol.for("react.context"),IA=Symbol.for("react.forward_ref"),jA=Symbol.for("react.suspense"),PA=Symbol.for("react.memo"),bA=Symbol.for("react.lazy"),wC=Symbol.iterator;function AA(e){return e===null||typeof e!="object"?null:(e=wC&&e[wC]||e["@@iterator"],typeof e=="function"?e:null)}var NI={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},EI=Object.assign,OI={};function xa(e,t,n){this.props=e,this.context=t,this.refs=OI,this.updater=n||NI}xa.prototype.isReactComponent={};xa.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};xa.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function UI(){}UI.prototype=xa.prototype;function rL(e,t,n){this.props=e,this.context=t,this.refs=OI,this.updater=n||NI}var oL=rL.prototype=new UI;oL.constructor=rL;EI(oL,xa.prototype);oL.isPureReactComponent=!0;var LC=Array.isArray,ZI=Object.prototype.hasOwnProperty,sL={current:null},_I={key:!0,ref:!0,__self:!0,__source:!0};function WI(e,t,n){var a,r={},o=null,s=null;if(t!=null)for(a in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(o=""+t.key),t)ZI.call(t,a)&&!_I.hasOwnProperty(a)&&(r[a]=t[a]);var c=arguments.length-2;if(c===1)r.children=n;else if(1<c){for(var l=Array(c),d=0;d<c;d++)l[d]=arguments[d+2];r.children=l}if(e&&e.defaultProps)for(a in c=e.defaultProps,c)r[a]===void 0&&(r[a]=c[a]);return{$$typeof:Ai,type:e,key:o,ref:s,props:r,_owner:sL.current}}function zA(e,t){return{$$typeof:Ai,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function cL(e){return typeof e=="object"&&e!==null&&e.$$typeof===Ai}function VA(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var CC=/\/+/g;function y9(e,t){return typeof e=="object"&&e!==null&&e.key!=null?VA(""+e.key):t.toString(36)}function cr(e,t,n,a,r){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(o){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case Ai:case xA:s=!0}}if(s)return s=e,r=r(s),e=a===""?"."+y9(s,0):a,LC(r)?(n="",e!=null&&(n=e.replace(CC,"$&/")+"/"),cr(r,t,n,"",function(d){return d})):r!=null&&(cL(r)&&(r=zA(r,n+(!r.key||s&&s.key===r.key?"":(""+r.key).replace(CC,"$&/")+"/")+e)),t.push(r)),1;if(s=0,a=a===""?".":a+":",LC(e))for(var c=0;c<e.length;c++){o=e[c];var l=a+y9(o,c);s+=cr(o,t,n,l,r)}else if(l=AA(e),typeof l=="function")for(e=l.call(e),c=0;!(o=e.next()).done;)o=o.value,l=a+y9(o,c++),s+=cr(o,t,n,l,r);else if(o==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function Ni(e,t,n){if(e==null)return e;var a=[],r=0;return cr(e,a,"","",function(o){return t.call(n,o,r++)}),a}function HA(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var we={current:null},lr={transition:null},TA={ReactCurrentDispatcher:we,ReactCurrentBatchConfig:lr,ReactCurrentOwner:sL};function GI(){throw Error("act(...) is not supported in production builds of React.")}F.Children={map:Ni,forEach:function(e,t,n){Ni(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Ni(e,function(){t++}),t},toArray:function(e){return Ni(e,function(t){return t})||[]},only:function(e){if(!cL(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};F.Component=xa;F.Fragment=MA;F.Profiler=LA;F.PureComponent=rL;F.StrictMode=wA;F.Suspense=jA;F.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=TA;F.act=GI;F.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=EI({},e.props),r=e.key,o=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(o=t.ref,s=sL.current),t.key!==void 0&&(r=""+t.key),e.type&&e.type.defaultProps)var c=e.type.defaultProps;for(l in t)ZI.call(t,l)&&!_I.hasOwnProperty(l)&&(a[l]=t[l]===void 0&&c!==void 0?c[l]:t[l])}var l=arguments.length-2;if(l===1)a.children=n;else if(1<l){c=Array(l);for(var d=0;d<l;d++)c[d]=arguments[d+2];a.children=c}return{$$typeof:Ai,type:e.type,key:r,ref:o,props:a,_owner:s}};F.createContext=function(e){return e={$$typeof:SA,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:CA,_context:e},e.Consumer=e};F.createElement=WI;F.createFactory=function(e){var t=WI.bind(null,e);return t.type=e,t};F.createRef=function(){return{current:null}};F.forwardRef=function(e){return{$$typeof:IA,render:e}};F.isValidElement=cL;F.lazy=function(e){return{$$typeof:bA,_payload:{_status:-1,_result:e},_init:HA}};F.memo=function(e,t){return{$$typeof:PA,type:e,compare:t===void 0?null:t}};F.startTransition=function(e){var t=lr.transition;lr.transition={};try{e()}finally{lr.transition=t}};F.unstable_act=GI;F.useCallback=function(e,t){return we.current.useCallback(e,t)};F.useContext=function(e){return we.current.useContext(e)};F.useDebugValue=function(){};F.useDeferredValue=function(e){return we.current.useDeferredValue(e)};F.useEffect=function(e,t){return we.current.useEffect(e,t)};F.useId=function(){return we.current.useId()};F.useImperativeHandle=function(e,t,n){return we.current.useImperativeHandle(e,t,n)};F.useInsertionEffect=function(e,t){return we.current.useInsertionEffect(e,t)};F.useLayoutEffect=function(e,t){return we.current.useLayoutEffect(e,t)};F.useMemo=function(e,t){return we.current.useMemo(e,t)};F.useReducer=function(e,t,n){return we.current.useReducer(e,t,n)};F.useRef=function(e){return we.current.useRef(e)};F.useState=function(e){return we.current.useState(e)};F.useSyncExternalStore=function(e,t,n){return we.current.useSyncExternalStore(e,t,n)};F.useTransition=function(){return we.current.useTransition()};F.version="18.3.1";BI.exports=F;var L=BI.exports;const lL=vA(L);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qA=L,DA=Symbol.for("react.element"),FA=Symbol.for("react.fragment"),RA=Object.prototype.hasOwnProperty,BA=qA.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,NA={key:!0,ref:!0,__self:!0,__source:!0};function $I(e,t,n){var a,r={},o=null,s=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(s=t.ref);for(a in t)RA.call(t,a)&&!NA.hasOwnProperty(a)&&(r[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)r[a]===void 0&&(r[a]=t[a]);return{$$typeof:DA,type:e,key:o,ref:s,props:r,_owner:BA.current}}OM.Fragment=FA;OM.jsx=$I;OM.jsxs=$I;RI.exports=OM;var h=RI.exports,J9={},XI={exports:{}},De={},KI={exports:{}},QI={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(b,T){var D=b.length;b.push(T);e:for(;0<D;){var q=D-1>>>1,_=b[q];if(0<r(_,T))b[q]=T,b[D]=_,D=q;else break e}}function n(b){return b.length===0?null:b[0]}function a(b){if(b.length===0)return null;var T=b[0],D=b.pop();if(D!==T){b[0]=D;e:for(var q=0,_=b.length,Jt=_>>>1;q<Jt;){var tt=2*(q+1)-1,T1=b[tt],Ae=tt+1,en=b[Ae];if(0>r(T1,D))Ae<_&&0>r(en,T1)?(b[q]=en,b[Ae]=D,q=Ae):(b[q]=T1,b[tt]=D,q=tt);else if(Ae<_&&0>r(en,D))b[q]=en,b[Ae]=D,q=Ae;else break e}}return T}function r(b,T){var D=b.sortIndex-T.sortIndex;return D!==0?D:b.id-T.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var s=Date,c=s.now();e.unstable_now=function(){return s.now()-c}}var l=[],d=[],u=1,y=null,p=3,m=!1,v=!1,x=!1,I=typeof setTimeout=="function"?setTimeout:null,g=typeof clearTimeout=="function"?clearTimeout:null,k=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function f(b){for(var T=n(d);T!==null;){if(T.callback===null)a(d);else if(T.startTime<=b)a(d),T.sortIndex=T.expirationTime,t(l,T);else break;T=n(d)}}function M(b){if(x=!1,f(b),!v)if(n(l)!==null)v=!0,Y(w);else{var T=n(d);T!==null&&Re(M,T.startTime-b)}}function w(b,T){v=!1,x&&(x=!1,g(S),S=-1),m=!0;var D=p;try{for(f(T),y=n(l);y!==null&&(!(y.expirationTime>T)||b&&!re());){var q=y.callback;if(typeof q=="function"){y.callback=null,p=y.priorityLevel;var _=q(y.expirationTime<=T);T=e.unstable_now(),typeof _=="function"?y.callback=_:y===n(l)&&a(l),f(T)}else a(l);y=n(l)}if(y!==null)var Jt=!0;else{var tt=n(d);tt!==null&&Re(M,tt.startTime-T),Jt=!1}return Jt}finally{y=null,p=D,m=!1}}var j=!1,P=null,S=-1,z=5,H=-1;function re(){return!(e.unstable_now()-H<z)}function le(){if(P!==null){var b=e.unstable_now();H=b;var T=!0;try{T=P(!0,b)}finally{T?ge():(j=!1,P=null)}}else j=!1}var ge;if(typeof k=="function")ge=function(){k(le)};else if(typeof MessageChannel<"u"){var oe=new MessageChannel,St=oe.port2;oe.port1.onmessage=le,ge=function(){St.postMessage(null)}}else ge=function(){I(le,0)};function Y(b){P=b,j||(j=!0,ge())}function Re(b,T){S=I(function(){b(e.unstable_now())},T)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(b){b.callback=null},e.unstable_continueExecution=function(){v||m||(v=!0,Y(w))},e.unstable_forceFrameRate=function(b){0>b||125<b?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<b?Math.floor(1e3/b):5},e.unstable_getCurrentPriorityLevel=function(){return p},e.unstable_getFirstCallbackNode=function(){return n(l)},e.unstable_next=function(b){switch(p){case 1:case 2:case 3:var T=3;break;default:T=p}var D=p;p=T;try{return b()}finally{p=D}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(b,T){switch(b){case 1:case 2:case 3:case 4:case 5:break;default:b=3}var D=p;p=b;try{return T()}finally{p=D}},e.unstable_scheduleCallback=function(b,T,D){var q=e.unstable_now();switch(typeof D=="object"&&D!==null?(D=D.delay,D=typeof D=="number"&&0<D?q+D:q):D=q,b){case 1:var _=-1;break;case 2:_=250;break;case 5:_=1073741823;break;case 4:_=1e4;break;default:_=5e3}return _=D+_,b={id:u++,callback:T,priorityLevel:b,startTime:D,expirationTime:_,sortIndex:-1},D>q?(b.sortIndex=D,t(d,b),n(l)===null&&b===n(d)&&(x?(g(S),S=-1):x=!0,Re(M,D-q))):(b.sortIndex=_,t(l,b),v||m||(v=!0,Y(w))),b},e.unstable_shouldYield=re,e.unstable_wrapCallback=function(b){var T=p;return function(){var D=p;p=T;try{return b.apply(this,arguments)}finally{p=D}}}})(QI);KI.exports=QI;var EA=KI.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var OA=L,Te=EA;function C(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var YI=new Set,di={};function A1(e,t){ha(e,t),ha(e+"Capture",t)}function ha(e,t){for(di[e]=t,e=0;e<t.length;e++)YI.add(t[e])}var vt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ew=Object.prototype.hasOwnProperty,UA=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,SC={},IC={};function ZA(e){return ew.call(IC,e)?!0:ew.call(SC,e)?!1:UA.test(e)?IC[e]=!0:(SC[e]=!0,!1)}function _A(e,t,n,a){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return a?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function WA(e,t,n,a){if(t===null||typeof t>"u"||_A(e,t,n,a))return!0;if(a)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Le(e,t,n,a,r,o,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=a,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=s}var ue={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ue[e]=new Le(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ue[t]=new Le(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ue[e]=new Le(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ue[e]=new Le(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ue[e]=new Le(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ue[e]=new Le(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ue[e]=new Le(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ue[e]=new Le(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ue[e]=new Le(e,5,!1,e.toLowerCase(),null,!1,!1)});var dL=/[\-:]([a-z])/g;function hL(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(dL,hL);ue[t]=new Le(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(dL,hL);ue[t]=new Le(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(dL,hL);ue[t]=new Le(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ue[e]=new Le(e,1,!1,e.toLowerCase(),null,!1,!1)});ue.xlinkHref=new Le("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ue[e]=new Le(e,1,!1,e.toLowerCase(),null,!0,!0)});function uL(e,t,n,a){var r=ue.hasOwnProperty(t)?ue[t]:null;(r!==null?r.type!==0:a||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(WA(t,n,r,a)&&(n=null),a||r===null?ZA(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):r.mustUseProperty?e[r.propertyName]=n===null?r.type===3?!1:"":n:(t=r.attributeName,a=r.attributeNamespace,n===null?e.removeAttribute(t):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,a?e.setAttributeNS(a,t,n):e.setAttribute(t,n))))}var Ct=OA.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ei=Symbol.for("react.element"),D1=Symbol.for("react.portal"),F1=Symbol.for("react.fragment"),yL=Symbol.for("react.strict_mode"),tw=Symbol.for("react.profiler"),JI=Symbol.for("react.provider"),ej=Symbol.for("react.context"),pL=Symbol.for("react.forward_ref"),nw=Symbol.for("react.suspense"),aw=Symbol.for("react.suspense_list"),kL=Symbol.for("react.memo"),Pt=Symbol.for("react.lazy"),tj=Symbol.for("react.offscreen"),jC=Symbol.iterator;function La(e){return e===null||typeof e!="object"?null:(e=jC&&e[jC]||e["@@iterator"],typeof e=="function"?e:null)}var K=Object.assign,p9;function Ha(e){if(p9===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);p9=t&&t[1]||""}return`
`+p9+e}var k9=!1;function f9(e,t){if(!e||k9)return"";k9=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var a=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){a=d}e.call(t.prototype)}else{try{throw Error()}catch(d){a=d}e()}}catch(d){if(d&&a&&typeof d.stack=="string"){for(var r=d.stack.split(`
`),o=a.stack.split(`
`),s=r.length-1,c=o.length-1;1<=s&&0<=c&&r[s]!==o[c];)c--;for(;1<=s&&0<=c;s--,c--)if(r[s]!==o[c]){if(s!==1||c!==1)do if(s--,c--,0>c||r[s]!==o[c]){var l=`
`+r[s].replace(" at new "," at ");return e.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",e.displayName)),l}while(1<=s&&0<=c);break}}}finally{k9=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Ha(e):""}function GA(e){switch(e.tag){case 5:return Ha(e.type);case 16:return Ha("Lazy");case 13:return Ha("Suspense");case 19:return Ha("SuspenseList");case 0:case 2:case 15:return e=f9(e.type,!1),e;case 11:return e=f9(e.type.render,!1),e;case 1:return e=f9(e.type,!0),e;default:return""}}function iw(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case F1:return"Fragment";case D1:return"Portal";case tw:return"Profiler";case yL:return"StrictMode";case nw:return"Suspense";case aw:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ej:return(e.displayName||"Context")+".Consumer";case JI:return(e._context.displayName||"Context")+".Provider";case pL:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case kL:return t=e.displayName||null,t!==null?t:iw(e.type)||"Memo";case Pt:t=e._payload,e=e._init;try{return iw(e(t))}catch{}}return null}function $A(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return iw(t);case 8:return t===yL?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function _t(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function nj(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function XA(e){var t=nj(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),a=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return r.call(this)},set:function(s){a=""+s,o.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(s){a=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Oi(e){e._valueTracker||(e._valueTracker=XA(e))}function aj(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=nj(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function dM(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function rw(e,t){var n=t.checked;return K({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function PC(e,t){var n=t.defaultValue==null?"":t.defaultValue,a=t.checked!=null?t.checked:t.defaultChecked;n=_t(t.value!=null?t.value:n),e._wrapperState={initialChecked:a,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ij(e,t){t=t.checked,t!=null&&uL(e,"checked",t,!1)}function ow(e,t){ij(e,t);var n=_t(t.value),a=t.type;if(n!=null)a==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(a==="submit"||a==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?sw(e,t.type,n):t.hasOwnProperty("defaultValue")&&sw(e,t.type,_t(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function bC(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var a=t.type;if(!(a!=="submit"&&a!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function sw(e,t,n){(t!=="number"||dM(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Ta=Array.isArray;function Y1(e,t,n,a){if(e=e.options,t){t={};for(var r=0;r<n.length;r++)t["$"+n[r]]=!0;for(n=0;n<e.length;n++)r=t.hasOwnProperty("$"+e[n].value),e[n].selected!==r&&(e[n].selected=r),r&&a&&(e[n].defaultSelected=!0)}else{for(n=""+_t(n),t=null,r=0;r<e.length;r++){if(e[r].value===n){e[r].selected=!0,a&&(e[r].defaultSelected=!0);return}t!==null||e[r].disabled||(t=e[r])}t!==null&&(t.selected=!0)}}function cw(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(C(91));return K({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function AC(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(C(92));if(Ta(n)){if(1<n.length)throw Error(C(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:_t(n)}}function rj(e,t){var n=_t(t.value),a=_t(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),a!=null&&(e.defaultValue=""+a)}function zC(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function oj(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function lw(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?oj(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Ui,sj=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,a,r){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,r)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Ui=Ui||document.createElement("div"),Ui.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Ui.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function hi(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Ra={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},KA=["Webkit","ms","Moz","O"];Object.keys(Ra).forEach(function(e){KA.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Ra[t]=Ra[e]})});function cj(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Ra.hasOwnProperty(e)&&Ra[e]?(""+t).trim():t+"px"}function lj(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var a=n.indexOf("--")===0,r=cj(n,t[n],a);n==="float"&&(n="cssFloat"),a?e.setProperty(n,r):e[n]=r}}var QA=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function dw(e,t){if(t){if(QA[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(C(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(C(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(C(61))}if(t.style!=null&&typeof t.style!="object")throw Error(C(62))}}function hw(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var uw=null;function fL(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var yw=null,J1=null,ea=null;function VC(e){if(e=Hi(e)){if(typeof yw!="function")throw Error(C(280));var t=e.stateNode;t&&(t=GM(t),yw(e.stateNode,e.type,t))}}function dj(e){J1?ea?ea.push(e):ea=[e]:J1=e}function hj(){if(J1){var e=J1,t=ea;if(ea=J1=null,VC(e),t)for(e=0;e<t.length;e++)VC(t[e])}}function uj(e,t){return e(t)}function yj(){}var m9=!1;function pj(e,t,n){if(m9)return e(t,n);m9=!0;try{return uj(e,t,n)}finally{m9=!1,(J1!==null||ea!==null)&&(yj(),hj())}}function ui(e,t){var n=e.stateNode;if(n===null)return null;var a=GM(n);if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(C(231,t,typeof n));return n}var pw=!1;if(vt)try{var Ca={};Object.defineProperty(Ca,"passive",{get:function(){pw=!0}}),window.addEventListener("test",Ca,Ca),window.removeEventListener("test",Ca,Ca)}catch{pw=!1}function YA(e,t,n,a,r,o,s,c,l){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(u){this.onError(u)}}var Ba=!1,hM=null,uM=!1,kw=null,JA={onError:function(e){Ba=!0,hM=e}};function ez(e,t,n,a,r,o,s,c,l){Ba=!1,hM=null,YA.apply(JA,arguments)}function tz(e,t,n,a,r,o,s,c,l){if(ez.apply(this,arguments),Ba){if(Ba){var d=hM;Ba=!1,hM=null}else throw Error(C(198));uM||(uM=!0,kw=d)}}function z1(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function kj(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function HC(e){if(z1(e)!==e)throw Error(C(188))}function nz(e){var t=e.alternate;if(!t){if(t=z1(e),t===null)throw Error(C(188));return t!==e?null:e}for(var n=e,a=t;;){var r=n.return;if(r===null)break;var o=r.alternate;if(o===null){if(a=r.return,a!==null){n=a;continue}break}if(r.child===o.child){for(o=r.child;o;){if(o===n)return HC(r),e;if(o===a)return HC(r),t;o=o.sibling}throw Error(C(188))}if(n.return!==a.return)n=r,a=o;else{for(var s=!1,c=r.child;c;){if(c===n){s=!0,n=r,a=o;break}if(c===a){s=!0,a=r,n=o;break}c=c.sibling}if(!s){for(c=o.child;c;){if(c===n){s=!0,n=o,a=r;break}if(c===a){s=!0,a=o,n=r;break}c=c.sibling}if(!s)throw Error(C(189))}}if(n.alternate!==a)throw Error(C(190))}if(n.tag!==3)throw Error(C(188));return n.stateNode.current===n?e:t}function fj(e){return e=nz(e),e!==null?mj(e):null}function mj(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=mj(e);if(t!==null)return t;e=e.sibling}return null}var gj=Te.unstable_scheduleCallback,TC=Te.unstable_cancelCallback,az=Te.unstable_shouldYield,iz=Te.unstable_requestPaint,J=Te.unstable_now,rz=Te.unstable_getCurrentPriorityLevel,mL=Te.unstable_ImmediatePriority,vj=Te.unstable_UserBlockingPriority,yM=Te.unstable_NormalPriority,oz=Te.unstable_LowPriority,xj=Te.unstable_IdlePriority,UM=null,st=null;function sz(e){if(st&&typeof st.onCommitFiberRoot=="function")try{st.onCommitFiberRoot(UM,e,void 0,(e.current.flags&128)===128)}catch{}}var Ye=Math.clz32?Math.clz32:dz,cz=Math.log,lz=Math.LN2;function dz(e){return e>>>=0,e===0?32:31-(cz(e)/lz|0)|0}var Zi=64,_i=4194304;function qa(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function pM(e,t){var n=e.pendingLanes;if(n===0)return 0;var a=0,r=e.suspendedLanes,o=e.pingedLanes,s=n&268435455;if(s!==0){var c=s&~r;c!==0?a=qa(c):(o&=s,o!==0&&(a=qa(o)))}else s=n&~r,s!==0?a=qa(s):o!==0&&(a=qa(o));if(a===0)return 0;if(t!==0&&t!==a&&!(t&r)&&(r=a&-a,o=t&-t,r>=o||r===16&&(o&4194240)!==0))return t;if(a&4&&(a|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=a;0<t;)n=31-Ye(t),r=1<<n,a|=e[n],t&=~r;return a}function hz(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function uz(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,r=e.expirationTimes,o=e.pendingLanes;0<o;){var s=31-Ye(o),c=1<<s,l=r[s];l===-1?(!(c&n)||c&a)&&(r[s]=hz(c,t)):l<=t&&(e.expiredLanes|=c),o&=~c}}function fw(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Mj(){var e=Zi;return Zi<<=1,!(Zi&4194240)&&(Zi=64),e}function g9(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function zi(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ye(t),e[t]=n}function yz(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var a=e.eventTimes;for(e=e.expirationTimes;0<n;){var r=31-Ye(n),o=1<<r;t[r]=0,a[r]=-1,e[r]=-1,n&=~o}}function gL(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-Ye(n),r=1<<a;r&t|e[a]&t&&(e[a]|=t),n&=~r}}var B=0;function wj(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Lj,vL,Cj,Sj,Ij,mw=!1,Wi=[],qt=null,Dt=null,Ft=null,yi=new Map,pi=new Map,zt=[],pz="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function qC(e,t){switch(e){case"focusin":case"focusout":qt=null;break;case"dragenter":case"dragleave":Dt=null;break;case"mouseover":case"mouseout":Ft=null;break;case"pointerover":case"pointerout":yi.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":pi.delete(t.pointerId)}}function Sa(e,t,n,a,r,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:o,targetContainers:[r]},t!==null&&(t=Hi(t),t!==null&&vL(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,r!==null&&t.indexOf(r)===-1&&t.push(r),e)}function kz(e,t,n,a,r){switch(t){case"focusin":return qt=Sa(qt,e,t,n,a,r),!0;case"dragenter":return Dt=Sa(Dt,e,t,n,a,r),!0;case"mouseover":return Ft=Sa(Ft,e,t,n,a,r),!0;case"pointerover":var o=r.pointerId;return yi.set(o,Sa(yi.get(o)||null,e,t,n,a,r)),!0;case"gotpointercapture":return o=r.pointerId,pi.set(o,Sa(pi.get(o)||null,e,t,n,a,r)),!0}return!1}function jj(e){var t=h1(e.target);if(t!==null){var n=z1(t);if(n!==null){if(t=n.tag,t===13){if(t=kj(n),t!==null){e.blockedOn=t,Ij(e.priority,function(){Cj(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function dr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=gw(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);uw=a,n.target.dispatchEvent(a),uw=null}else return t=Hi(n),t!==null&&vL(t),e.blockedOn=n,!1;t.shift()}return!0}function DC(e,t,n){dr(e)&&n.delete(t)}function fz(){mw=!1,qt!==null&&dr(qt)&&(qt=null),Dt!==null&&dr(Dt)&&(Dt=null),Ft!==null&&dr(Ft)&&(Ft=null),yi.forEach(DC),pi.forEach(DC)}function Ia(e,t){e.blockedOn===t&&(e.blockedOn=null,mw||(mw=!0,Te.unstable_scheduleCallback(Te.unstable_NormalPriority,fz)))}function ki(e){function t(r){return Ia(r,e)}if(0<Wi.length){Ia(Wi[0],e);for(var n=1;n<Wi.length;n++){var a=Wi[n];a.blockedOn===e&&(a.blockedOn=null)}}for(qt!==null&&Ia(qt,e),Dt!==null&&Ia(Dt,e),Ft!==null&&Ia(Ft,e),yi.forEach(t),pi.forEach(t),n=0;n<zt.length;n++)a=zt[n],a.blockedOn===e&&(a.blockedOn=null);for(;0<zt.length&&(n=zt[0],n.blockedOn===null);)jj(n),n.blockedOn===null&&zt.shift()}var ta=Ct.ReactCurrentBatchConfig,kM=!0;function mz(e,t,n,a){var r=B,o=ta.transition;ta.transition=null;try{B=1,xL(e,t,n,a)}finally{B=r,ta.transition=o}}function gz(e,t,n,a){var r=B,o=ta.transition;ta.transition=null;try{B=4,xL(e,t,n,a)}finally{B=r,ta.transition=o}}function xL(e,t,n,a){if(kM){var r=gw(e,t,n,a);if(r===null)P9(e,t,a,fM,n),qC(e,a);else if(kz(r,e,t,n,a))a.stopPropagation();else if(qC(e,a),t&4&&-1<pz.indexOf(e)){for(;r!==null;){var o=Hi(r);if(o!==null&&Lj(o),o=gw(e,t,n,a),o===null&&P9(e,t,a,fM,n),o===r)break;r=o}r!==null&&a.stopPropagation()}else P9(e,t,a,null,n)}}var fM=null;function gw(e,t,n,a){if(fM=null,e=fL(a),e=h1(e),e!==null)if(t=z1(e),t===null)e=null;else if(n=t.tag,n===13){if(e=kj(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return fM=e,null}function Pj(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(rz()){case mL:return 1;case vj:return 4;case yM:case oz:return 16;case xj:return 536870912;default:return 16}default:return 16}}var Ht=null,ML=null,hr=null;function bj(){if(hr)return hr;var e,t=ML,n=t.length,a,r="value"in Ht?Ht.value:Ht.textContent,o=r.length;for(e=0;e<n&&t[e]===r[e];e++);var s=n-e;for(a=1;a<=s&&t[n-a]===r[o-a];a++);return hr=r.slice(e,1<a?1-a:void 0)}function ur(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Gi(){return!0}function FC(){return!1}function Fe(e){function t(n,a,r,o,s){this._reactName=n,this._targetInst=r,this.type=a,this.nativeEvent=o,this.target=s,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(o):o[c]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Gi:FC,this.isPropagationStopped=FC,this}return K(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Gi)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Gi)},persist:function(){},isPersistent:Gi}),t}var Ma={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wL=Fe(Ma),Vi=K({},Ma,{view:0,detail:0}),vz=Fe(Vi),v9,x9,ja,ZM=K({},Vi,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:LL,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ja&&(ja&&e.type==="mousemove"?(v9=e.screenX-ja.screenX,x9=e.screenY-ja.screenY):x9=v9=0,ja=e),v9)},movementY:function(e){return"movementY"in e?e.movementY:x9}}),RC=Fe(ZM),xz=K({},ZM,{dataTransfer:0}),Mz=Fe(xz),wz=K({},Vi,{relatedTarget:0}),M9=Fe(wz),Lz=K({},Ma,{animationName:0,elapsedTime:0,pseudoElement:0}),Cz=Fe(Lz),Sz=K({},Ma,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Iz=Fe(Sz),jz=K({},Ma,{data:0}),BC=Fe(jz),Pz={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},bz={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Az={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function zz(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Az[e])?!!t[e]:!1}function LL(){return zz}var Vz=K({},Vi,{key:function(e){if(e.key){var t=Pz[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ur(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?bz[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:LL,charCode:function(e){return e.type==="keypress"?ur(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ur(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Hz=Fe(Vz),Tz=K({},ZM,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),NC=Fe(Tz),qz=K({},Vi,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:LL}),Dz=Fe(qz),Fz=K({},Ma,{propertyName:0,elapsedTime:0,pseudoElement:0}),Rz=Fe(Fz),Bz=K({},ZM,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Nz=Fe(Bz),Ez=[9,13,27,32],CL=vt&&"CompositionEvent"in window,Na=null;vt&&"documentMode"in document&&(Na=document.documentMode);var Oz=vt&&"TextEvent"in window&&!Na,Aj=vt&&(!CL||Na&&8<Na&&11>=Na),EC=" ",OC=!1;function zj(e,t){switch(e){case"keyup":return Ez.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Vj(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var R1=!1;function Uz(e,t){switch(e){case"compositionend":return Vj(t);case"keypress":return t.which!==32?null:(OC=!0,EC);case"textInput":return e=t.data,e===EC&&OC?null:e;default:return null}}function Zz(e,t){if(R1)return e==="compositionend"||!CL&&zj(e,t)?(e=bj(),hr=ML=Ht=null,R1=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Aj&&t.locale!=="ko"?null:t.data;default:return null}}var _z={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function UC(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!_z[e.type]:t==="textarea"}function Hj(e,t,n,a){dj(a),t=mM(t,"onChange"),0<t.length&&(n=new wL("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var Ea=null,fi=null;function Wz(e){Zj(e,0)}function _M(e){var t=E1(e);if(aj(t))return e}function Gz(e,t){if(e==="change")return t}var Tj=!1;if(vt){var w9;if(vt){var L9="oninput"in document;if(!L9){var ZC=document.createElement("div");ZC.setAttribute("oninput","return;"),L9=typeof ZC.oninput=="function"}w9=L9}else w9=!1;Tj=w9&&(!document.documentMode||9<document.documentMode)}function _C(){Ea&&(Ea.detachEvent("onpropertychange",qj),fi=Ea=null)}function qj(e){if(e.propertyName==="value"&&_M(fi)){var t=[];Hj(t,fi,e,fL(e)),pj(Wz,t)}}function $z(e,t,n){e==="focusin"?(_C(),Ea=t,fi=n,Ea.attachEvent("onpropertychange",qj)):e==="focusout"&&_C()}function Xz(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return _M(fi)}function Kz(e,t){if(e==="click")return _M(t)}function Qz(e,t){if(e==="input"||e==="change")return _M(t)}function Yz(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var et=typeof Object.is=="function"?Object.is:Yz;function mi(e,t){if(et(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var r=n[a];if(!ew.call(t,r)||!et(e[r],t[r]))return!1}return!0}function WC(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function GC(e,t){var n=WC(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=WC(n)}}function Dj(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Dj(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Fj(){for(var e=window,t=dM();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=dM(e.document)}return t}function SL(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Jz(e){var t=Fj(),n=e.focusedElem,a=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Dj(n.ownerDocument.documentElement,n)){if(a!==null&&SL(n)){if(t=a.start,e=a.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var r=n.textContent.length,o=Math.min(a.start,r);a=a.end===void 0?o:Math.min(a.end,r),!e.extend&&o>a&&(r=a,a=o,o=r),r=GC(n,o);var s=GC(n,a);r&&s&&(e.rangeCount!==1||e.anchorNode!==r.node||e.anchorOffset!==r.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(r.node,r.offset),e.removeAllRanges(),o>a?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var eV=vt&&"documentMode"in document&&11>=document.documentMode,B1=null,vw=null,Oa=null,xw=!1;function $C(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;xw||B1==null||B1!==dM(a)||(a=B1,"selectionStart"in a&&SL(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Oa&&mi(Oa,a)||(Oa=a,a=mM(vw,"onSelect"),0<a.length&&(t=new wL("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=B1)))}function $i(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var N1={animationend:$i("Animation","AnimationEnd"),animationiteration:$i("Animation","AnimationIteration"),animationstart:$i("Animation","AnimationStart"),transitionend:$i("Transition","TransitionEnd")},C9={},Rj={};vt&&(Rj=document.createElement("div").style,"AnimationEvent"in window||(delete N1.animationend.animation,delete N1.animationiteration.animation,delete N1.animationstart.animation),"TransitionEvent"in window||delete N1.transitionend.transition);function WM(e){if(C9[e])return C9[e];if(!N1[e])return e;var t=N1[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Rj)return C9[e]=t[n];return e}var Bj=WM("animationend"),Nj=WM("animationiteration"),Ej=WM("animationstart"),Oj=WM("transitionend"),Uj=new Map,XC="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Xt(e,t){Uj.set(e,t),A1(t,[e])}for(var S9=0;S9<XC.length;S9++){var I9=XC[S9],tV=I9.toLowerCase(),nV=I9[0].toUpperCase()+I9.slice(1);Xt(tV,"on"+nV)}Xt(Bj,"onAnimationEnd");Xt(Nj,"onAnimationIteration");Xt(Ej,"onAnimationStart");Xt("dblclick","onDoubleClick");Xt("focusin","onFocus");Xt("focusout","onBlur");Xt(Oj,"onTransitionEnd");ha("onMouseEnter",["mouseout","mouseover"]);ha("onMouseLeave",["mouseout","mouseover"]);ha("onPointerEnter",["pointerout","pointerover"]);ha("onPointerLeave",["pointerout","pointerover"]);A1("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));A1("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));A1("onBeforeInput",["compositionend","keypress","textInput","paste"]);A1("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));A1("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));A1("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Da="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),aV=new Set("cancel close invalid load scroll toggle".split(" ").concat(Da));function KC(e,t,n){var a=e.type||"unknown-event";e.currentTarget=n,tz(a,t,void 0,e),e.currentTarget=null}function Zj(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],r=a.event;a=a.listeners;e:{var o=void 0;if(t)for(var s=a.length-1;0<=s;s--){var c=a[s],l=c.instance,d=c.currentTarget;if(c=c.listener,l!==o&&r.isPropagationStopped())break e;KC(r,c,d),o=l}else for(s=0;s<a.length;s++){if(c=a[s],l=c.instance,d=c.currentTarget,c=c.listener,l!==o&&r.isPropagationStopped())break e;KC(r,c,d),o=l}}}if(uM)throw e=kw,uM=!1,kw=null,e}function O(e,t){var n=t[Sw];n===void 0&&(n=t[Sw]=new Set);var a=e+"__bubble";n.has(a)||(_j(t,e,2,!1),n.add(a))}function j9(e,t,n){var a=0;t&&(a|=4),_j(n,e,a,t)}var Xi="_reactListening"+Math.random().toString(36).slice(2);function gi(e){if(!e[Xi]){e[Xi]=!0,YI.forEach(function(n){n!=="selectionchange"&&(aV.has(n)||j9(n,!1,e),j9(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Xi]||(t[Xi]=!0,j9("selectionchange",!1,t))}}function _j(e,t,n,a){switch(Pj(t)){case 1:var r=mz;break;case 4:r=gz;break;default:r=xL}n=r.bind(null,t,n,e),r=void 0,!pw||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(r=!0),a?r!==void 0?e.addEventListener(t,n,{capture:!0,passive:r}):e.addEventListener(t,n,!0):r!==void 0?e.addEventListener(t,n,{passive:r}):e.addEventListener(t,n,!1)}function P9(e,t,n,a,r){var o=a;if(!(t&1)&&!(t&2)&&a!==null)e:for(;;){if(a===null)return;var s=a.tag;if(s===3||s===4){var c=a.stateNode.containerInfo;if(c===r||c.nodeType===8&&c.parentNode===r)break;if(s===4)for(s=a.return;s!==null;){var l=s.tag;if((l===3||l===4)&&(l=s.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;s=s.return}for(;c!==null;){if(s=h1(c),s===null)return;if(l=s.tag,l===5||l===6){a=o=s;continue e}c=c.parentNode}}a=a.return}pj(function(){var d=o,u=fL(n),y=[];e:{var p=Uj.get(e);if(p!==void 0){var m=wL,v=e;switch(e){case"keypress":if(ur(n)===0)break e;case"keydown":case"keyup":m=Hz;break;case"focusin":v="focus",m=M9;break;case"focusout":v="blur",m=M9;break;case"beforeblur":case"afterblur":m=M9;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=RC;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=Mz;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=Dz;break;case Bj:case Nj:case Ej:m=Cz;break;case Oj:m=Rz;break;case"scroll":m=vz;break;case"wheel":m=Nz;break;case"copy":case"cut":case"paste":m=Iz;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=NC}var x=(t&4)!==0,I=!x&&e==="scroll",g=x?p!==null?p+"Capture":null:p;x=[];for(var k=d,f;k!==null;){f=k;var M=f.stateNode;if(f.tag===5&&M!==null&&(f=M,g!==null&&(M=ui(k,g),M!=null&&x.push(vi(k,M,f)))),I)break;k=k.return}0<x.length&&(p=new m(p,v,null,n,u),y.push({event:p,listeners:x}))}}if(!(t&7)){e:{if(p=e==="mouseover"||e==="pointerover",m=e==="mouseout"||e==="pointerout",p&&n!==uw&&(v=n.relatedTarget||n.fromElement)&&(h1(v)||v[xt]))break e;if((m||p)&&(p=u.window===u?u:(p=u.ownerDocument)?p.defaultView||p.parentWindow:window,m?(v=n.relatedTarget||n.toElement,m=d,v=v?h1(v):null,v!==null&&(I=z1(v),v!==I||v.tag!==5&&v.tag!==6)&&(v=null)):(m=null,v=d),m!==v)){if(x=RC,M="onMouseLeave",g="onMouseEnter",k="mouse",(e==="pointerout"||e==="pointerover")&&(x=NC,M="onPointerLeave",g="onPointerEnter",k="pointer"),I=m==null?p:E1(m),f=v==null?p:E1(v),p=new x(M,k+"leave",m,n,u),p.target=I,p.relatedTarget=f,M=null,h1(u)===d&&(x=new x(g,k+"enter",v,n,u),x.target=f,x.relatedTarget=I,M=x),I=M,m&&v)t:{for(x=m,g=v,k=0,f=x;f;f=q1(f))k++;for(f=0,M=g;M;M=q1(M))f++;for(;0<k-f;)x=q1(x),k--;for(;0<f-k;)g=q1(g),f--;for(;k--;){if(x===g||g!==null&&x===g.alternate)break t;x=q1(x),g=q1(g)}x=null}else x=null;m!==null&&QC(y,p,m,x,!1),v!==null&&I!==null&&QC(y,I,v,x,!0)}}e:{if(p=d?E1(d):window,m=p.nodeName&&p.nodeName.toLowerCase(),m==="select"||m==="input"&&p.type==="file")var w=Gz;else if(UC(p))if(Tj)w=Qz;else{w=Xz;var j=$z}else(m=p.nodeName)&&m.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(w=Kz);if(w&&(w=w(e,d))){Hj(y,w,n,u);break e}j&&j(e,p,d),e==="focusout"&&(j=p._wrapperState)&&j.controlled&&p.type==="number"&&sw(p,"number",p.value)}switch(j=d?E1(d):window,e){case"focusin":(UC(j)||j.contentEditable==="true")&&(B1=j,vw=d,Oa=null);break;case"focusout":Oa=vw=B1=null;break;case"mousedown":xw=!0;break;case"contextmenu":case"mouseup":case"dragend":xw=!1,$C(y,n,u);break;case"selectionchange":if(eV)break;case"keydown":case"keyup":$C(y,n,u)}var P;if(CL)e:{switch(e){case"compositionstart":var S="onCompositionStart";break e;case"compositionend":S="onCompositionEnd";break e;case"compositionupdate":S="onCompositionUpdate";break e}S=void 0}else R1?zj(e,n)&&(S="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(S="onCompositionStart");S&&(Aj&&n.locale!=="ko"&&(R1||S!=="onCompositionStart"?S==="onCompositionEnd"&&R1&&(P=bj()):(Ht=u,ML="value"in Ht?Ht.value:Ht.textContent,R1=!0)),j=mM(d,S),0<j.length&&(S=new BC(S,e,null,n,u),y.push({event:S,listeners:j}),P?S.data=P:(P=Vj(n),P!==null&&(S.data=P)))),(P=Oz?Uz(e,n):Zz(e,n))&&(d=mM(d,"onBeforeInput"),0<d.length&&(u=new BC("onBeforeInput","beforeinput",null,n,u),y.push({event:u,listeners:d}),u.data=P))}Zj(y,t)})}function vi(e,t,n){return{instance:e,listener:t,currentTarget:n}}function mM(e,t){for(var n=t+"Capture",a=[];e!==null;){var r=e,o=r.stateNode;r.tag===5&&o!==null&&(r=o,o=ui(e,n),o!=null&&a.unshift(vi(e,o,r)),o=ui(e,t),o!=null&&a.push(vi(e,o,r))),e=e.return}return a}function q1(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function QC(e,t,n,a,r){for(var o=t._reactName,s=[];n!==null&&n!==a;){var c=n,l=c.alternate,d=c.stateNode;if(l!==null&&l===a)break;c.tag===5&&d!==null&&(c=d,r?(l=ui(n,o),l!=null&&s.unshift(vi(n,l,c))):r||(l=ui(n,o),l!=null&&s.push(vi(n,l,c)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var iV=/\r\n?/g,rV=/\u0000|\uFFFD/g;function YC(e){return(typeof e=="string"?e:""+e).replace(iV,`
`).replace(rV,"")}function Ki(e,t,n){if(t=YC(t),YC(e)!==t&&n)throw Error(C(425))}function gM(){}var Mw=null,ww=null;function Lw(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Cw=typeof setTimeout=="function"?setTimeout:void 0,oV=typeof clearTimeout=="function"?clearTimeout:void 0,JC=typeof Promise=="function"?Promise:void 0,sV=typeof queueMicrotask=="function"?queueMicrotask:typeof JC<"u"?function(e){return JC.resolve(null).then(e).catch(cV)}:Cw;function cV(e){setTimeout(function(){throw e})}function b9(e,t){var n=t,a=0;do{var r=n.nextSibling;if(e.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(a===0){e.removeChild(r),ki(t);return}a--}else n!=="$"&&n!=="$?"&&n!=="$!"||a++;n=r}while(n);ki(t)}function Rt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function eS(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var wa=Math.random().toString(36).slice(2),ot="__reactFiber$"+wa,xi="__reactProps$"+wa,xt="__reactContainer$"+wa,Sw="__reactEvents$"+wa,lV="__reactListeners$"+wa,dV="__reactHandles$"+wa;function h1(e){var t=e[ot];if(t)return t;for(var n=e.parentNode;n;){if(t=n[xt]||n[ot]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=eS(e);e!==null;){if(n=e[ot])return n;e=eS(e)}return t}e=n,n=e.parentNode}return null}function Hi(e){return e=e[ot]||e[xt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function E1(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(C(33))}function GM(e){return e[xi]||null}var Iw=[],O1=-1;function Kt(e){return{current:e}}function Z(e){0>O1||(e.current=Iw[O1],Iw[O1]=null,O1--)}function N(e,t){O1++,Iw[O1]=e.current,e.current=t}var Wt={},me=Kt(Wt),Ie=Kt(!1),C1=Wt;function ua(e,t){var n=e.type.contextTypes;if(!n)return Wt;var a=e.stateNode;if(a&&a.__reactInternalMemoizedUnmaskedChildContext===t)return a.__reactInternalMemoizedMaskedChildContext;var r={},o;for(o in n)r[o]=t[o];return a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=r),r}function je(e){return e=e.childContextTypes,e!=null}function vM(){Z(Ie),Z(me)}function tS(e,t,n){if(me.current!==Wt)throw Error(C(168));N(me,t),N(Ie,n)}function Wj(e,t,n){var a=e.stateNode;if(t=t.childContextTypes,typeof a.getChildContext!="function")return n;a=a.getChildContext();for(var r in a)if(!(r in t))throw Error(C(108,$A(e)||"Unknown",r));return K({},n,a)}function xM(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Wt,C1=me.current,N(me,e),N(Ie,Ie.current),!0}function nS(e,t,n){var a=e.stateNode;if(!a)throw Error(C(169));n?(e=Wj(e,t,C1),a.__reactInternalMemoizedMergedChildContext=e,Z(Ie),Z(me),N(me,e)):Z(Ie),N(Ie,n)}var ut=null,$M=!1,A9=!1;function Gj(e){ut===null?ut=[e]:ut.push(e)}function hV(e){$M=!0,Gj(e)}function Qt(){if(!A9&&ut!==null){A9=!0;var e=0,t=B;try{var n=ut;for(B=1;e<n.length;e++){var a=n[e];do a=a(!0);while(a!==null)}ut=null,$M=!1}catch(r){throw ut!==null&&(ut=ut.slice(e+1)),gj(mL,Qt),r}finally{B=t,A9=!1}}return null}var U1=[],Z1=0,MM=null,wM=0,Ee=[],Oe=0,S1=null,yt=1,pt="";function an(e,t){U1[Z1++]=wM,U1[Z1++]=MM,MM=e,wM=t}function $j(e,t,n){Ee[Oe++]=yt,Ee[Oe++]=pt,Ee[Oe++]=S1,S1=e;var a=yt;e=pt;var r=32-Ye(a)-1;a&=~(1<<r),n+=1;var o=32-Ye(t)+r;if(30<o){var s=r-r%5;o=(a&(1<<s)-1).toString(32),a>>=s,r-=s,yt=1<<32-Ye(t)+r|n<<r|a,pt=o+e}else yt=1<<o|n<<r|a,pt=e}function IL(e){e.return!==null&&(an(e,1),$j(e,1,0))}function jL(e){for(;e===MM;)MM=U1[--Z1],U1[Z1]=null,wM=U1[--Z1],U1[Z1]=null;for(;e===S1;)S1=Ee[--Oe],Ee[Oe]=null,pt=Ee[--Oe],Ee[Oe]=null,yt=Ee[--Oe],Ee[Oe]=null}var He=null,Ve=null,W=!1,Ke=null;function Xj(e,t){var n=Ue(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function aS(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,He=e,Ve=Rt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,He=e,Ve=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=S1!==null?{id:yt,overflow:pt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Ue(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,He=e,Ve=null,!0):!1;default:return!1}}function jw(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Pw(e){if(W){var t=Ve;if(t){var n=t;if(!aS(e,t)){if(jw(e))throw Error(C(418));t=Rt(n.nextSibling);var a=He;t&&aS(e,t)?Xj(a,n):(e.flags=e.flags&-4097|2,W=!1,He=e)}}else{if(jw(e))throw Error(C(418));e.flags=e.flags&-4097|2,W=!1,He=e}}}function iS(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;He=e}function Qi(e){if(e!==He)return!1;if(!W)return iS(e),W=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Lw(e.type,e.memoizedProps)),t&&(t=Ve)){if(jw(e))throw Kj(),Error(C(418));for(;t;)Xj(e,t),t=Rt(t.nextSibling)}if(iS(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(C(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Ve=Rt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Ve=null}}else Ve=He?Rt(e.stateNode.nextSibling):null;return!0}function Kj(){for(var e=Ve;e;)e=Rt(e.nextSibling)}function ya(){Ve=He=null,W=!1}function PL(e){Ke===null?Ke=[e]:Ke.push(e)}var uV=Ct.ReactCurrentBatchConfig;function Pa(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(C(309));var a=n.stateNode}if(!a)throw Error(C(147,e));var r=a,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(s){var c=r.refs;s===null?delete c[o]:c[o]=s},t._stringRef=o,t)}if(typeof e!="string")throw Error(C(284));if(!n._owner)throw Error(C(290,e))}return e}function Yi(e,t){throw e=Object.prototype.toString.call(t),Error(C(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function rS(e){var t=e._init;return t(e._payload)}function Qj(e){function t(g,k){if(e){var f=g.deletions;f===null?(g.deletions=[k],g.flags|=16):f.push(k)}}function n(g,k){if(!e)return null;for(;k!==null;)t(g,k),k=k.sibling;return null}function a(g,k){for(g=new Map;k!==null;)k.key!==null?g.set(k.key,k):g.set(k.index,k),k=k.sibling;return g}function r(g,k){return g=Ot(g,k),g.index=0,g.sibling=null,g}function o(g,k,f){return g.index=f,e?(f=g.alternate,f!==null?(f=f.index,f<k?(g.flags|=2,k):f):(g.flags|=2,k)):(g.flags|=1048576,k)}function s(g){return e&&g.alternate===null&&(g.flags|=2),g}function c(g,k,f,M){return k===null||k.tag!==6?(k=F9(f,g.mode,M),k.return=g,k):(k=r(k,f),k.return=g,k)}function l(g,k,f,M){var w=f.type;return w===F1?u(g,k,f.props.children,M,f.key):k!==null&&(k.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===Pt&&rS(w)===k.type)?(M=r(k,f.props),M.ref=Pa(g,k,f),M.return=g,M):(M=vr(f.type,f.key,f.props,null,g.mode,M),M.ref=Pa(g,k,f),M.return=g,M)}function d(g,k,f,M){return k===null||k.tag!==4||k.stateNode.containerInfo!==f.containerInfo||k.stateNode.implementation!==f.implementation?(k=R9(f,g.mode,M),k.return=g,k):(k=r(k,f.children||[]),k.return=g,k)}function u(g,k,f,M,w){return k===null||k.tag!==7?(k=f1(f,g.mode,M,w),k.return=g,k):(k=r(k,f),k.return=g,k)}function y(g,k,f){if(typeof k=="string"&&k!==""||typeof k=="number")return k=F9(""+k,g.mode,f),k.return=g,k;if(typeof k=="object"&&k!==null){switch(k.$$typeof){case Ei:return f=vr(k.type,k.key,k.props,null,g.mode,f),f.ref=Pa(g,null,k),f.return=g,f;case D1:return k=R9(k,g.mode,f),k.return=g,k;case Pt:var M=k._init;return y(g,M(k._payload),f)}if(Ta(k)||La(k))return k=f1(k,g.mode,f,null),k.return=g,k;Yi(g,k)}return null}function p(g,k,f,M){var w=k!==null?k.key:null;if(typeof f=="string"&&f!==""||typeof f=="number")return w!==null?null:c(g,k,""+f,M);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Ei:return f.key===w?l(g,k,f,M):null;case D1:return f.key===w?d(g,k,f,M):null;case Pt:return w=f._init,p(g,k,w(f._payload),M)}if(Ta(f)||La(f))return w!==null?null:u(g,k,f,M,null);Yi(g,f)}return null}function m(g,k,f,M,w){if(typeof M=="string"&&M!==""||typeof M=="number")return g=g.get(f)||null,c(k,g,""+M,w);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case Ei:return g=g.get(M.key===null?f:M.key)||null,l(k,g,M,w);case D1:return g=g.get(M.key===null?f:M.key)||null,d(k,g,M,w);case Pt:var j=M._init;return m(g,k,f,j(M._payload),w)}if(Ta(M)||La(M))return g=g.get(f)||null,u(k,g,M,w,null);Yi(k,M)}return null}function v(g,k,f,M){for(var w=null,j=null,P=k,S=k=0,z=null;P!==null&&S<f.length;S++){P.index>S?(z=P,P=null):z=P.sibling;var H=p(g,P,f[S],M);if(H===null){P===null&&(P=z);break}e&&P&&H.alternate===null&&t(g,P),k=o(H,k,S),j===null?w=H:j.sibling=H,j=H,P=z}if(S===f.length)return n(g,P),W&&an(g,S),w;if(P===null){for(;S<f.length;S++)P=y(g,f[S],M),P!==null&&(k=o(P,k,S),j===null?w=P:j.sibling=P,j=P);return W&&an(g,S),w}for(P=a(g,P);S<f.length;S++)z=m(P,g,S,f[S],M),z!==null&&(e&&z.alternate!==null&&P.delete(z.key===null?S:z.key),k=o(z,k,S),j===null?w=z:j.sibling=z,j=z);return e&&P.forEach(function(re){return t(g,re)}),W&&an(g,S),w}function x(g,k,f,M){var w=La(f);if(typeof w!="function")throw Error(C(150));if(f=w.call(f),f==null)throw Error(C(151));for(var j=w=null,P=k,S=k=0,z=null,H=f.next();P!==null&&!H.done;S++,H=f.next()){P.index>S?(z=P,P=null):z=P.sibling;var re=p(g,P,H.value,M);if(re===null){P===null&&(P=z);break}e&&P&&re.alternate===null&&t(g,P),k=o(re,k,S),j===null?w=re:j.sibling=re,j=re,P=z}if(H.done)return n(g,P),W&&an(g,S),w;if(P===null){for(;!H.done;S++,H=f.next())H=y(g,H.value,M),H!==null&&(k=o(H,k,S),j===null?w=H:j.sibling=H,j=H);return W&&an(g,S),w}for(P=a(g,P);!H.done;S++,H=f.next())H=m(P,g,S,H.value,M),H!==null&&(e&&H.alternate!==null&&P.delete(H.key===null?S:H.key),k=o(H,k,S),j===null?w=H:j.sibling=H,j=H);return e&&P.forEach(function(le){return t(g,le)}),W&&an(g,S),w}function I(g,k,f,M){if(typeof f=="object"&&f!==null&&f.type===F1&&f.key===null&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case Ei:e:{for(var w=f.key,j=k;j!==null;){if(j.key===w){if(w=f.type,w===F1){if(j.tag===7){n(g,j.sibling),k=r(j,f.props.children),k.return=g,g=k;break e}}else if(j.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===Pt&&rS(w)===j.type){n(g,j.sibling),k=r(j,f.props),k.ref=Pa(g,j,f),k.return=g,g=k;break e}n(g,j);break}else t(g,j);j=j.sibling}f.type===F1?(k=f1(f.props.children,g.mode,M,f.key),k.return=g,g=k):(M=vr(f.type,f.key,f.props,null,g.mode,M),M.ref=Pa(g,k,f),M.return=g,g=M)}return s(g);case D1:e:{for(j=f.key;k!==null;){if(k.key===j)if(k.tag===4&&k.stateNode.containerInfo===f.containerInfo&&k.stateNode.implementation===f.implementation){n(g,k.sibling),k=r(k,f.children||[]),k.return=g,g=k;break e}else{n(g,k);break}else t(g,k);k=k.sibling}k=R9(f,g.mode,M),k.return=g,g=k}return s(g);case Pt:return j=f._init,I(g,k,j(f._payload),M)}if(Ta(f))return v(g,k,f,M);if(La(f))return x(g,k,f,M);Yi(g,f)}return typeof f=="string"&&f!==""||typeof f=="number"?(f=""+f,k!==null&&k.tag===6?(n(g,k.sibling),k=r(k,f),k.return=g,g=k):(n(g,k),k=F9(f,g.mode,M),k.return=g,g=k),s(g)):n(g,k)}return I}var pa=Qj(!0),Yj=Qj(!1),LM=Kt(null),CM=null,_1=null,bL=null;function AL(){bL=_1=CM=null}function zL(e){var t=LM.current;Z(LM),e._currentValue=t}function bw(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function na(e,t){CM=e,bL=_1=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Se=!0),e.firstContext=null)}function _e(e){var t=e._currentValue;if(bL!==e)if(e={context:e,memoizedValue:t,next:null},_1===null){if(CM===null)throw Error(C(308));_1=e,CM.dependencies={lanes:0,firstContext:e}}else _1=_1.next=e;return t}var u1=null;function VL(e){u1===null?u1=[e]:u1.push(e)}function Jj(e,t,n,a){var r=t.interleaved;return r===null?(n.next=n,VL(t)):(n.next=r.next,r.next=n),t.interleaved=n,Mt(e,a)}function Mt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var bt=!1;function HL(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function eP(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function ft(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Bt(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,R&2){var r=a.pending;return r===null?t.next=t:(t.next=r.next,r.next=t),a.pending=t,Mt(e,n)}return r=a.interleaved,r===null?(t.next=t,VL(a)):(t.next=r.next,r.next=t),a.interleaved=t,Mt(e,n)}function yr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,gL(e,n)}}function oS(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var r=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?r=o=s:o=o.next=s,n=n.next}while(n!==null);o===null?r=o=t:o=o.next=t}else r=o=t;n={baseState:a.baseState,firstBaseUpdate:r,lastBaseUpdate:o,shared:a.shared,effects:a.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function SM(e,t,n,a){var r=e.updateQueue;bt=!1;var o=r.firstBaseUpdate,s=r.lastBaseUpdate,c=r.shared.pending;if(c!==null){r.shared.pending=null;var l=c,d=l.next;l.next=null,s===null?o=d:s.next=d,s=l;var u=e.alternate;u!==null&&(u=u.updateQueue,c=u.lastBaseUpdate,c!==s&&(c===null?u.firstBaseUpdate=d:c.next=d,u.lastBaseUpdate=l))}if(o!==null){var y=r.baseState;s=0,u=d=l=null,c=o;do{var p=c.lane,m=c.eventTime;if((a&p)===p){u!==null&&(u=u.next={eventTime:m,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var v=e,x=c;switch(p=t,m=n,x.tag){case 1:if(v=x.payload,typeof v=="function"){y=v.call(m,y,p);break e}y=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=x.payload,p=typeof v=="function"?v.call(m,y,p):v,p==null)break e;y=K({},y,p);break e;case 2:bt=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,p=r.effects,p===null?r.effects=[c]:p.push(c))}else m={eventTime:m,lane:p,tag:c.tag,payload:c.payload,callback:c.callback,next:null},u===null?(d=u=m,l=y):u=u.next=m,s|=p;if(c=c.next,c===null){if(c=r.shared.pending,c===null)break;p=c,c=p.next,p.next=null,r.lastBaseUpdate=p,r.shared.pending=null}}while(!0);if(u===null&&(l=y),r.baseState=l,r.firstBaseUpdate=d,r.lastBaseUpdate=u,t=r.shared.interleaved,t!==null){r=t;do s|=r.lane,r=r.next;while(r!==t)}else o===null&&(r.shared.lanes=0);j1|=s,e.lanes=s,e.memoizedState=y}}function sS(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var a=e[t],r=a.callback;if(r!==null){if(a.callback=null,a=n,typeof r!="function")throw Error(C(191,r));r.call(a)}}}var Ti={},ct=Kt(Ti),Mi=Kt(Ti),wi=Kt(Ti);function y1(e){if(e===Ti)throw Error(C(174));return e}function TL(e,t){switch(N(wi,t),N(Mi,e),N(ct,Ti),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:lw(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=lw(t,e)}Z(ct),N(ct,t)}function ka(){Z(ct),Z(Mi),Z(wi)}function tP(e){y1(wi.current);var t=y1(ct.current),n=lw(t,e.type);t!==n&&(N(Mi,e),N(ct,n))}function qL(e){Mi.current===e&&(Z(ct),Z(Mi))}var G=Kt(0);function IM(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var z9=[];function DL(){for(var e=0;e<z9.length;e++)z9[e]._workInProgressVersionPrimary=null;z9.length=0}var pr=Ct.ReactCurrentDispatcher,V9=Ct.ReactCurrentBatchConfig,I1=0,X=null,ae=null,se=null,jM=!1,Ua=!1,Li=0,yV=0;function ye(){throw Error(C(321))}function FL(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!et(e[n],t[n]))return!1;return!0}function RL(e,t,n,a,r,o){if(I1=o,X=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,pr.current=e===null||e.memoizedState===null?mV:gV,e=n(a,r),Ua){o=0;do{if(Ua=!1,Li=0,25<=o)throw Error(C(301));o+=1,se=ae=null,t.updateQueue=null,pr.current=vV,e=n(a,r)}while(Ua)}if(pr.current=PM,t=ae!==null&&ae.next!==null,I1=0,se=ae=X=null,jM=!1,t)throw Error(C(300));return e}function BL(){var e=Li!==0;return Li=0,e}function rt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return se===null?X.memoizedState=se=e:se=se.next=e,se}function We(){if(ae===null){var e=X.alternate;e=e!==null?e.memoizedState:null}else e=ae.next;var t=se===null?X.memoizedState:se.next;if(t!==null)se=t,ae=e;else{if(e===null)throw Error(C(310));ae=e,e={memoizedState:ae.memoizedState,baseState:ae.baseState,baseQueue:ae.baseQueue,queue:ae.queue,next:null},se===null?X.memoizedState=se=e:se=se.next=e}return se}function Ci(e,t){return typeof t=="function"?t(e):t}function H9(e){var t=We(),n=t.queue;if(n===null)throw Error(C(311));n.lastRenderedReducer=e;var a=ae,r=a.baseQueue,o=n.pending;if(o!==null){if(r!==null){var s=r.next;r.next=o.next,o.next=s}a.baseQueue=r=o,n.pending=null}if(r!==null){o=r.next,a=a.baseState;var c=s=null,l=null,d=o;do{var u=d.lane;if((I1&u)===u)l!==null&&(l=l.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),a=d.hasEagerState?d.eagerState:e(a,d.action);else{var y={lane:u,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};l===null?(c=l=y,s=a):l=l.next=y,X.lanes|=u,j1|=u}d=d.next}while(d!==null&&d!==o);l===null?s=a:l.next=c,et(a,t.memoizedState)||(Se=!0),t.memoizedState=a,t.baseState=s,t.baseQueue=l,n.lastRenderedState=a}if(e=n.interleaved,e!==null){r=e;do o=r.lane,X.lanes|=o,j1|=o,r=r.next;while(r!==e)}else r===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function T9(e){var t=We(),n=t.queue;if(n===null)throw Error(C(311));n.lastRenderedReducer=e;var a=n.dispatch,r=n.pending,o=t.memoizedState;if(r!==null){n.pending=null;var s=r=r.next;do o=e(o,s.action),s=s.next;while(s!==r);et(o,t.memoizedState)||(Se=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,a]}function nP(){}function aP(e,t){var n=X,a=We(),r=t(),o=!et(a.memoizedState,r);if(o&&(a.memoizedState=r,Se=!0),a=a.queue,NL(oP.bind(null,n,a,e),[e]),a.getSnapshot!==t||o||se!==null&&se.memoizedState.tag&1){if(n.flags|=2048,Si(9,rP.bind(null,n,a,r,t),void 0,null),ce===null)throw Error(C(349));I1&30||iP(n,t,r)}return r}function iP(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=X.updateQueue,t===null?(t={lastEffect:null,stores:null},X.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function rP(e,t,n,a){t.value=n,t.getSnapshot=a,sP(t)&&cP(e)}function oP(e,t,n){return n(function(){sP(t)&&cP(e)})}function sP(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!et(e,n)}catch{return!0}}function cP(e){var t=Mt(e,1);t!==null&&Je(t,e,1,-1)}function cS(e){var t=rt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ci,lastRenderedState:e},t.queue=e,e=e.dispatch=fV.bind(null,X,e),[t.memoizedState,e]}function Si(e,t,n,a){return e={tag:e,create:t,destroy:n,deps:a,next:null},t=X.updateQueue,t===null?(t={lastEffect:null,stores:null},X.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e)),e}function lP(){return We().memoizedState}function kr(e,t,n,a){var r=rt();X.flags|=e,r.memoizedState=Si(1|t,n,void 0,a===void 0?null:a)}function XM(e,t,n,a){var r=We();a=a===void 0?null:a;var o=void 0;if(ae!==null){var s=ae.memoizedState;if(o=s.destroy,a!==null&&FL(a,s.deps)){r.memoizedState=Si(t,n,o,a);return}}X.flags|=e,r.memoizedState=Si(1|t,n,o,a)}function lS(e,t){return kr(8390656,8,e,t)}function NL(e,t){return XM(2048,8,e,t)}function dP(e,t){return XM(4,2,e,t)}function hP(e,t){return XM(4,4,e,t)}function uP(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function yP(e,t,n){return n=n!=null?n.concat([e]):null,XM(4,4,uP.bind(null,t,e),n)}function EL(){}function pP(e,t){var n=We();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&FL(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function kP(e,t){var n=We();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&FL(t,a[1])?a[0]:(e=e(),n.memoizedState=[e,t],e)}function fP(e,t,n){return I1&21?(et(n,t)||(n=Mj(),X.lanes|=n,j1|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Se=!0),e.memoizedState=n)}function pV(e,t){var n=B;B=n!==0&&4>n?n:4,e(!0);var a=V9.transition;V9.transition={};try{e(!1),t()}finally{B=n,V9.transition=a}}function mP(){return We().memoizedState}function kV(e,t,n){var a=Et(e);if(n={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null},gP(e))vP(t,n);else if(n=Jj(e,t,n,a),n!==null){var r=Me();Je(n,e,a,r),xP(n,t,a)}}function fV(e,t,n){var a=Et(e),r={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null};if(gP(e))vP(t,r);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var s=t.lastRenderedState,c=o(s,n);if(r.hasEagerState=!0,r.eagerState=c,et(c,s)){var l=t.interleaved;l===null?(r.next=r,VL(t)):(r.next=l.next,l.next=r),t.interleaved=r;return}}catch{}finally{}n=Jj(e,t,r,a),n!==null&&(r=Me(),Je(n,e,a,r),xP(n,t,a))}}function gP(e){var t=e.alternate;return e===X||t!==null&&t===X}function vP(e,t){Ua=jM=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function xP(e,t,n){if(n&4194240){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,gL(e,n)}}var PM={readContext:_e,useCallback:ye,useContext:ye,useEffect:ye,useImperativeHandle:ye,useInsertionEffect:ye,useLayoutEffect:ye,useMemo:ye,useReducer:ye,useRef:ye,useState:ye,useDebugValue:ye,useDeferredValue:ye,useTransition:ye,useMutableSource:ye,useSyncExternalStore:ye,useId:ye,unstable_isNewReconciler:!1},mV={readContext:_e,useCallback:function(e,t){return rt().memoizedState=[e,t===void 0?null:t],e},useContext:_e,useEffect:lS,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,kr(4194308,4,uP.bind(null,t,e),n)},useLayoutEffect:function(e,t){return kr(4194308,4,e,t)},useInsertionEffect:function(e,t){return kr(4,2,e,t)},useMemo:function(e,t){var n=rt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var a=rt();return t=n!==void 0?n(t):t,a.memoizedState=a.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},a.queue=e,e=e.dispatch=kV.bind(null,X,e),[a.memoizedState,e]},useRef:function(e){var t=rt();return e={current:e},t.memoizedState=e},useState:cS,useDebugValue:EL,useDeferredValue:function(e){return rt().memoizedState=e},useTransition:function(){var e=cS(!1),t=e[0];return e=pV.bind(null,e[1]),rt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var a=X,r=rt();if(W){if(n===void 0)throw Error(C(407));n=n()}else{if(n=t(),ce===null)throw Error(C(349));I1&30||iP(a,t,n)}r.memoizedState=n;var o={value:n,getSnapshot:t};return r.queue=o,lS(oP.bind(null,a,o,e),[e]),a.flags|=2048,Si(9,rP.bind(null,a,o,n,t),void 0,null),n},useId:function(){var e=rt(),t=ce.identifierPrefix;if(W){var n=pt,a=yt;n=(a&~(1<<32-Ye(a)-1)).toString(32)+n,t=":"+t+"R"+n,n=Li++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=yV++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},gV={readContext:_e,useCallback:pP,useContext:_e,useEffect:NL,useImperativeHandle:yP,useInsertionEffect:dP,useLayoutEffect:hP,useMemo:kP,useReducer:H9,useRef:lP,useState:function(){return H9(Ci)},useDebugValue:EL,useDeferredValue:function(e){var t=We();return fP(t,ae.memoizedState,e)},useTransition:function(){var e=H9(Ci)[0],t=We().memoizedState;return[e,t]},useMutableSource:nP,useSyncExternalStore:aP,useId:mP,unstable_isNewReconciler:!1},vV={readContext:_e,useCallback:pP,useContext:_e,useEffect:NL,useImperativeHandle:yP,useInsertionEffect:dP,useLayoutEffect:hP,useMemo:kP,useReducer:T9,useRef:lP,useState:function(){return T9(Ci)},useDebugValue:EL,useDeferredValue:function(e){var t=We();return ae===null?t.memoizedState=e:fP(t,ae.memoizedState,e)},useTransition:function(){var e=T9(Ci)[0],t=We().memoizedState;return[e,t]},useMutableSource:nP,useSyncExternalStore:aP,useId:mP,unstable_isNewReconciler:!1};function $e(e,t){if(e&&e.defaultProps){t=K({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Aw(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:K({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var KM={isMounted:function(e){return(e=e._reactInternals)?z1(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var a=Me(),r=Et(e),o=ft(a,r);o.payload=t,n!=null&&(o.callback=n),t=Bt(e,o,r),t!==null&&(Je(t,e,r,a),yr(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=Me(),r=Et(e),o=ft(a,r);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=Bt(e,o,r),t!==null&&(Je(t,e,r,a),yr(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Me(),a=Et(e),r=ft(n,a);r.tag=2,t!=null&&(r.callback=t),t=Bt(e,r,a),t!==null&&(Je(t,e,a,n),yr(t,e,a))}};function dS(e,t,n,a,r,o,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,o,s):t.prototype&&t.prototype.isPureReactComponent?!mi(n,a)||!mi(r,o):!0}function MP(e,t,n){var a=!1,r=Wt,o=t.contextType;return typeof o=="object"&&o!==null?o=_e(o):(r=je(t)?C1:me.current,a=t.contextTypes,o=(a=a!=null)?ua(e,r):Wt),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=KM,e.stateNode=t,t._reactInternals=e,a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=r,e.__reactInternalMemoizedMaskedChildContext=o),t}function hS(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&KM.enqueueReplaceState(t,t.state,null)}function zw(e,t,n,a){var r=e.stateNode;r.props=n,r.state=e.memoizedState,r.refs={},HL(e);var o=t.contextType;typeof o=="object"&&o!==null?r.context=_e(o):(o=je(t)?C1:me.current,r.context=ua(e,o)),r.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(Aw(e,t,o,n),r.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(t=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),t!==r.state&&KM.enqueueReplaceState(r,r.state,null),SM(e,n,r,a),r.state=e.memoizedState),typeof r.componentDidMount=="function"&&(e.flags|=4194308)}function fa(e,t){try{var n="",a=t;do n+=GA(a),a=a.return;while(a);var r=n}catch(o){r=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:r,digest:null}}function q9(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Vw(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var xV=typeof WeakMap=="function"?WeakMap:Map;function wP(e,t,n){n=ft(-1,n),n.tag=3,n.payload={element:null};var a=t.value;return n.callback=function(){AM||(AM=!0,Ow=a),Vw(e,t)},n}function LP(e,t,n){n=ft(-1,n),n.tag=3;var a=e.type.getDerivedStateFromError;if(typeof a=="function"){var r=t.value;n.payload=function(){return a(r)},n.callback=function(){Vw(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){Vw(e,t),typeof a!="function"&&(Nt===null?Nt=new Set([this]):Nt.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function uS(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new xV;var r=new Set;a.set(t,r)}else r=a.get(t),r===void 0&&(r=new Set,a.set(t,r));r.has(n)||(r.add(n),e=TV.bind(null,e,t,n),t.then(e,e))}function yS(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function pS(e,t,n,a,r){return e.mode&1?(e.flags|=65536,e.lanes=r,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=ft(-1,1),t.tag=2,Bt(n,t,1))),n.lanes|=1),e)}var MV=Ct.ReactCurrentOwner,Se=!1;function xe(e,t,n,a){t.child=e===null?Yj(t,null,n,a):pa(t,e.child,n,a)}function kS(e,t,n,a,r){n=n.render;var o=t.ref;return na(t,r),a=RL(e,t,n,a,o,r),n=BL(),e!==null&&!Se?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,wt(e,t,r)):(W&&n&&IL(t),t.flags|=1,xe(e,t,a,r),t.child)}function fS(e,t,n,a,r){if(e===null){var o=n.type;return typeof o=="function"&&!XL(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,CP(e,t,o,a,r)):(e=vr(n.type,null,a,t,t.mode,r),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,!(e.lanes&r)){var s=o.memoizedProps;if(n=n.compare,n=n!==null?n:mi,n(s,a)&&e.ref===t.ref)return wt(e,t,r)}return t.flags|=1,e=Ot(o,a),e.ref=t.ref,e.return=t,t.child=e}function CP(e,t,n,a,r){if(e!==null){var o=e.memoizedProps;if(mi(o,a)&&e.ref===t.ref)if(Se=!1,t.pendingProps=a=o,(e.lanes&r)!==0)e.flags&131072&&(Se=!0);else return t.lanes=e.lanes,wt(e,t,r)}return Hw(e,t,n,a,r)}function SP(e,t,n){var a=t.pendingProps,r=a.children,o=e!==null?e.memoizedState:null;if(a.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},N(G1,ze),ze|=n;else{if(!(n&1073741824))return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,N(G1,ze),ze|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},a=o!==null?o.baseLanes:n,N(G1,ze),ze|=a}else o!==null?(a=o.baseLanes|n,t.memoizedState=null):a=n,N(G1,ze),ze|=a;return xe(e,t,r,n),t.child}function IP(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Hw(e,t,n,a,r){var o=je(n)?C1:me.current;return o=ua(t,o),na(t,r),n=RL(e,t,n,a,o,r),a=BL(),e!==null&&!Se?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,wt(e,t,r)):(W&&a&&IL(t),t.flags|=1,xe(e,t,n,r),t.child)}function mS(e,t,n,a,r){if(je(n)){var o=!0;xM(t)}else o=!1;if(na(t,r),t.stateNode===null)fr(e,t),MP(t,n,a),zw(t,n,a,r),a=!0;else if(e===null){var s=t.stateNode,c=t.memoizedProps;s.props=c;var l=s.context,d=n.contextType;typeof d=="object"&&d!==null?d=_e(d):(d=je(n)?C1:me.current,d=ua(t,d));var u=n.getDerivedStateFromProps,y=typeof u=="function"||typeof s.getSnapshotBeforeUpdate=="function";y||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==a||l!==d)&&hS(t,s,a,d),bt=!1;var p=t.memoizedState;s.state=p,SM(t,a,s,r),l=t.memoizedState,c!==a||p!==l||Ie.current||bt?(typeof u=="function"&&(Aw(t,n,u,a),l=t.memoizedState),(c=bt||dS(t,n,c,a,p,l,d))?(y||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=l),s.props=a,s.state=l,s.context=d,a=c):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{s=t.stateNode,eP(e,t),c=t.memoizedProps,d=t.type===t.elementType?c:$e(t.type,c),s.props=d,y=t.pendingProps,p=s.context,l=n.contextType,typeof l=="object"&&l!==null?l=_e(l):(l=je(n)?C1:me.current,l=ua(t,l));var m=n.getDerivedStateFromProps;(u=typeof m=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==y||p!==l)&&hS(t,s,a,l),bt=!1,p=t.memoizedState,s.state=p,SM(t,a,s,r);var v=t.memoizedState;c!==y||p!==v||Ie.current||bt?(typeof m=="function"&&(Aw(t,n,m,a),v=t.memoizedState),(d=bt||dS(t,n,d,a,p,v,l)||!1)?(u||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(a,v,l),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(a,v,l)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&p===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=v),s.props=a,s.state=v,s.context=l,a=d):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&p===e.memoizedState||(t.flags|=1024),a=!1)}return Tw(e,t,n,a,o,r)}function Tw(e,t,n,a,r,o){IP(e,t);var s=(t.flags&128)!==0;if(!a&&!s)return r&&nS(t,n,!1),wt(e,t,o);a=t.stateNode,MV.current=t;var c=s&&typeof n.getDerivedStateFromError!="function"?null:a.render();return t.flags|=1,e!==null&&s?(t.child=pa(t,e.child,null,o),t.child=pa(t,null,c,o)):xe(e,t,c,o),t.memoizedState=a.state,r&&nS(t,n,!0),t.child}function jP(e){var t=e.stateNode;t.pendingContext?tS(e,t.pendingContext,t.pendingContext!==t.context):t.context&&tS(e,t.context,!1),TL(e,t.containerInfo)}function gS(e,t,n,a,r){return ya(),PL(r),t.flags|=256,xe(e,t,n,a),t.child}var qw={dehydrated:null,treeContext:null,retryLane:0};function Dw(e){return{baseLanes:e,cachePool:null,transitions:null}}function PP(e,t,n){var a=t.pendingProps,r=G.current,o=!1,s=(t.flags&128)!==0,c;if((c=s)||(c=e!==null&&e.memoizedState===null?!1:(r&2)!==0),c?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(r|=1),N(G,r&1),e===null)return Pw(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=a.children,e=a.fallback,o?(a=t.mode,o=t.child,s={mode:"hidden",children:s},!(a&1)&&o!==null?(o.childLanes=0,o.pendingProps=s):o=JM(s,a,0,null),e=f1(e,a,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=Dw(n),t.memoizedState=qw,e):OL(t,s));if(r=e.memoizedState,r!==null&&(c=r.dehydrated,c!==null))return wV(e,t,s,a,c,r,n);if(o){o=a.fallback,s=t.mode,r=e.child,c=r.sibling;var l={mode:"hidden",children:a.children};return!(s&1)&&t.child!==r?(a=t.child,a.childLanes=0,a.pendingProps=l,t.deletions=null):(a=Ot(r,l),a.subtreeFlags=r.subtreeFlags&14680064),c!==null?o=Ot(c,o):(o=f1(o,s,n,null),o.flags|=2),o.return=t,a.return=t,a.sibling=o,t.child=a,a=o,o=t.child,s=e.child.memoizedState,s=s===null?Dw(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},o.memoizedState=s,o.childLanes=e.childLanes&~n,t.memoizedState=qw,a}return o=e.child,e=o.sibling,a=Ot(o,{mode:"visible",children:a.children}),!(t.mode&1)&&(a.lanes=n),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a}function OL(e,t){return t=JM({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ji(e,t,n,a){return a!==null&&PL(a),pa(t,e.child,null,n),e=OL(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function wV(e,t,n,a,r,o,s){if(n)return t.flags&256?(t.flags&=-257,a=q9(Error(C(422))),Ji(e,t,s,a)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=a.fallback,r=t.mode,a=JM({mode:"visible",children:a.children},r,0,null),o=f1(o,r,s,null),o.flags|=2,a.return=t,o.return=t,a.sibling=o,t.child=a,t.mode&1&&pa(t,e.child,null,s),t.child.memoizedState=Dw(s),t.memoizedState=qw,o);if(!(t.mode&1))return Ji(e,t,s,null);if(r.data==="$!"){if(a=r.nextSibling&&r.nextSibling.dataset,a)var c=a.dgst;return a=c,o=Error(C(419)),a=q9(o,a,void 0),Ji(e,t,s,a)}if(c=(s&e.childLanes)!==0,Se||c){if(a=ce,a!==null){switch(s&-s){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(a.suspendedLanes|s)?0:r,r!==0&&r!==o.retryLane&&(o.retryLane=r,Mt(e,r),Je(a,e,r,-1))}return $L(),a=q9(Error(C(421))),Ji(e,t,s,a)}return r.data==="$?"?(t.flags|=128,t.child=e.child,t=qV.bind(null,e),r._reactRetry=t,null):(e=o.treeContext,Ve=Rt(r.nextSibling),He=t,W=!0,Ke=null,e!==null&&(Ee[Oe++]=yt,Ee[Oe++]=pt,Ee[Oe++]=S1,yt=e.id,pt=e.overflow,S1=t),t=OL(t,a.children),t.flags|=4096,t)}function vS(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),bw(e.return,t,n)}function D9(e,t,n,a,r){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:r}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=a,o.tail=n,o.tailMode=r)}function bP(e,t,n){var a=t.pendingProps,r=a.revealOrder,o=a.tail;if(xe(e,t,a.children,n),a=G.current,a&2)a=a&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&vS(e,n,t);else if(e.tag===19)vS(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}a&=1}if(N(G,a),!(t.mode&1))t.memoizedState=null;else switch(r){case"forwards":for(n=t.child,r=null;n!==null;)e=n.alternate,e!==null&&IM(e)===null&&(r=n),n=n.sibling;n=r,n===null?(r=t.child,t.child=null):(r=n.sibling,n.sibling=null),D9(t,!1,r,n,o);break;case"backwards":for(n=null,r=t.child,t.child=null;r!==null;){if(e=r.alternate,e!==null&&IM(e)===null){t.child=r;break}e=r.sibling,r.sibling=n,n=r,r=e}D9(t,!0,n,null,o);break;case"together":D9(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function fr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function wt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),j1|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(C(153));if(t.child!==null){for(e=t.child,n=Ot(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Ot(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function LV(e,t,n){switch(t.tag){case 3:jP(t),ya();break;case 5:tP(t);break;case 1:je(t.type)&&xM(t);break;case 4:TL(t,t.stateNode.containerInfo);break;case 10:var a=t.type._context,r=t.memoizedProps.value;N(LM,a._currentValue),a._currentValue=r;break;case 13:if(a=t.memoizedState,a!==null)return a.dehydrated!==null?(N(G,G.current&1),t.flags|=128,null):n&t.child.childLanes?PP(e,t,n):(N(G,G.current&1),e=wt(e,t,n),e!==null?e.sibling:null);N(G,G.current&1);break;case 19:if(a=(n&t.childLanes)!==0,e.flags&128){if(a)return bP(e,t,n);t.flags|=128}if(r=t.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),N(G,G.current),a)break;return null;case 22:case 23:return t.lanes=0,SP(e,t,n)}return wt(e,t,n)}var AP,Fw,zP,VP;AP=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Fw=function(){};zP=function(e,t,n,a){var r=e.memoizedProps;if(r!==a){e=t.stateNode,y1(ct.current);var o=null;switch(n){case"input":r=rw(e,r),a=rw(e,a),o=[];break;case"select":r=K({},r,{value:void 0}),a=K({},a,{value:void 0}),o=[];break;case"textarea":r=cw(e,r),a=cw(e,a),o=[];break;default:typeof r.onClick!="function"&&typeof a.onClick=="function"&&(e.onclick=gM)}dw(n,a);var s;n=null;for(d in r)if(!a.hasOwnProperty(d)&&r.hasOwnProperty(d)&&r[d]!=null)if(d==="style"){var c=r[d];for(s in c)c.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(di.hasOwnProperty(d)?o||(o=[]):(o=o||[]).push(d,null));for(d in a){var l=a[d];if(c=r!=null?r[d]:void 0,a.hasOwnProperty(d)&&l!==c&&(l!=null||c!=null))if(d==="style")if(c){for(s in c)!c.hasOwnProperty(s)||l&&l.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in l)l.hasOwnProperty(s)&&c[s]!==l[s]&&(n||(n={}),n[s]=l[s])}else n||(o||(o=[]),o.push(d,n)),n=l;else d==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,c=c?c.__html:void 0,l!=null&&c!==l&&(o=o||[]).push(d,l)):d==="children"?typeof l!="string"&&typeof l!="number"||(o=o||[]).push(d,""+l):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(di.hasOwnProperty(d)?(l!=null&&d==="onScroll"&&O("scroll",e),o||c===l||(o=[])):(o=o||[]).push(d,l))}n&&(o=o||[]).push("style",n);var d=o;(t.updateQueue=d)&&(t.flags|=4)}};VP=function(e,t,n,a){n!==a&&(t.flags|=4)};function ba(e,t){if(!W)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function pe(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var r=e.child;r!==null;)n|=r.lanes|r.childLanes,a|=r.subtreeFlags&14680064,a|=r.flags&14680064,r.return=e,r=r.sibling;else for(r=e.child;r!==null;)n|=r.lanes|r.childLanes,a|=r.subtreeFlags,a|=r.flags,r.return=e,r=r.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function CV(e,t,n){var a=t.pendingProps;switch(jL(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return pe(t),null;case 1:return je(t.type)&&vM(),pe(t),null;case 3:return a=t.stateNode,ka(),Z(Ie),Z(me),DL(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Qi(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Ke!==null&&(_w(Ke),Ke=null))),Fw(e,t),pe(t),null;case 5:qL(t);var r=y1(wi.current);if(n=t.type,e!==null&&t.stateNode!=null)zP(e,t,n,a,r),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!a){if(t.stateNode===null)throw Error(C(166));return pe(t),null}if(e=y1(ct.current),Qi(t)){a=t.stateNode,n=t.type;var o=t.memoizedProps;switch(a[ot]=t,a[xi]=o,e=(t.mode&1)!==0,n){case"dialog":O("cancel",a),O("close",a);break;case"iframe":case"object":case"embed":O("load",a);break;case"video":case"audio":for(r=0;r<Da.length;r++)O(Da[r],a);break;case"source":O("error",a);break;case"img":case"image":case"link":O("error",a),O("load",a);break;case"details":O("toggle",a);break;case"input":PC(a,o),O("invalid",a);break;case"select":a._wrapperState={wasMultiple:!!o.multiple},O("invalid",a);break;case"textarea":AC(a,o),O("invalid",a)}dw(n,o),r=null;for(var s in o)if(o.hasOwnProperty(s)){var c=o[s];s==="children"?typeof c=="string"?a.textContent!==c&&(o.suppressHydrationWarning!==!0&&Ki(a.textContent,c,e),r=["children",c]):typeof c=="number"&&a.textContent!==""+c&&(o.suppressHydrationWarning!==!0&&Ki(a.textContent,c,e),r=["children",""+c]):di.hasOwnProperty(s)&&c!=null&&s==="onScroll"&&O("scroll",a)}switch(n){case"input":Oi(a),bC(a,o,!0);break;case"textarea":Oi(a),zC(a);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(a.onclick=gM)}a=r,t.updateQueue=a,a!==null&&(t.flags|=4)}else{s=r.nodeType===9?r:r.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=oj(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof a.is=="string"?e=s.createElement(n,{is:a.is}):(e=s.createElement(n),n==="select"&&(s=e,a.multiple?s.multiple=!0:a.size&&(s.size=a.size))):e=s.createElementNS(e,n),e[ot]=t,e[xi]=a,AP(e,t,!1,!1),t.stateNode=e;e:{switch(s=hw(n,a),n){case"dialog":O("cancel",e),O("close",e),r=a;break;case"iframe":case"object":case"embed":O("load",e),r=a;break;case"video":case"audio":for(r=0;r<Da.length;r++)O(Da[r],e);r=a;break;case"source":O("error",e),r=a;break;case"img":case"image":case"link":O("error",e),O("load",e),r=a;break;case"details":O("toggle",e),r=a;break;case"input":PC(e,a),r=rw(e,a),O("invalid",e);break;case"option":r=a;break;case"select":e._wrapperState={wasMultiple:!!a.multiple},r=K({},a,{value:void 0}),O("invalid",e);break;case"textarea":AC(e,a),r=cw(e,a),O("invalid",e);break;default:r=a}dw(n,r),c=r;for(o in c)if(c.hasOwnProperty(o)){var l=c[o];o==="style"?lj(e,l):o==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&sj(e,l)):o==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&hi(e,l):typeof l=="number"&&hi(e,""+l):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(di.hasOwnProperty(o)?l!=null&&o==="onScroll"&&O("scroll",e):l!=null&&uL(e,o,l,s))}switch(n){case"input":Oi(e),bC(e,a,!1);break;case"textarea":Oi(e),zC(e);break;case"option":a.value!=null&&e.setAttribute("value",""+_t(a.value));break;case"select":e.multiple=!!a.multiple,o=a.value,o!=null?Y1(e,!!a.multiple,o,!1):a.defaultValue!=null&&Y1(e,!!a.multiple,a.defaultValue,!0);break;default:typeof r.onClick=="function"&&(e.onclick=gM)}switch(n){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}}a&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return pe(t),null;case 6:if(e&&t.stateNode!=null)VP(e,t,e.memoizedProps,a);else{if(typeof a!="string"&&t.stateNode===null)throw Error(C(166));if(n=y1(wi.current),y1(ct.current),Qi(t)){if(a=t.stateNode,n=t.memoizedProps,a[ot]=t,(o=a.nodeValue!==n)&&(e=He,e!==null))switch(e.tag){case 3:Ki(a.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Ki(a.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else a=(n.nodeType===9?n:n.ownerDocument).createTextNode(a),a[ot]=t,t.stateNode=a}return pe(t),null;case 13:if(Z(G),a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(W&&Ve!==null&&t.mode&1&&!(t.flags&128))Kj(),ya(),t.flags|=98560,o=!1;else if(o=Qi(t),a!==null&&a.dehydrated!==null){if(e===null){if(!o)throw Error(C(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(C(317));o[ot]=t}else ya(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;pe(t),o=!1}else Ke!==null&&(_w(Ke),Ke=null),o=!0;if(!o)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(a=a!==null,a!==(e!==null&&e.memoizedState!==null)&&a&&(t.child.flags|=8192,t.mode&1&&(e===null||G.current&1?ie===0&&(ie=3):$L())),t.updateQueue!==null&&(t.flags|=4),pe(t),null);case 4:return ka(),Fw(e,t),e===null&&gi(t.stateNode.containerInfo),pe(t),null;case 10:return zL(t.type._context),pe(t),null;case 17:return je(t.type)&&vM(),pe(t),null;case 19:if(Z(G),o=t.memoizedState,o===null)return pe(t),null;if(a=(t.flags&128)!==0,s=o.rendering,s===null)if(a)ba(o,!1);else{if(ie!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=IM(e),s!==null){for(t.flags|=128,ba(o,!1),a=s.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),t.subtreeFlags=0,a=n,n=t.child;n!==null;)o=n,e=a,o.flags&=14680066,s=o.alternate,s===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=s.childLanes,o.lanes=s.lanes,o.child=s.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=s.memoizedProps,o.memoizedState=s.memoizedState,o.updateQueue=s.updateQueue,o.type=s.type,e=s.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return N(G,G.current&1|2),t.child}e=e.sibling}o.tail!==null&&J()>ma&&(t.flags|=128,a=!0,ba(o,!1),t.lanes=4194304)}else{if(!a)if(e=IM(s),e!==null){if(t.flags|=128,a=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),ba(o,!0),o.tail===null&&o.tailMode==="hidden"&&!s.alternate&&!W)return pe(t),null}else 2*J()-o.renderingStartTime>ma&&n!==1073741824&&(t.flags|=128,a=!0,ba(o,!1),t.lanes=4194304);o.isBackwards?(s.sibling=t.child,t.child=s):(n=o.last,n!==null?n.sibling=s:t.child=s,o.last=s)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=J(),t.sibling=null,n=G.current,N(G,a?n&1|2:n&1),t):(pe(t),null);case 22:case 23:return GL(),a=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==a&&(t.flags|=8192),a&&t.mode&1?ze&1073741824&&(pe(t),t.subtreeFlags&6&&(t.flags|=8192)):pe(t),null;case 24:return null;case 25:return null}throw Error(C(156,t.tag))}function SV(e,t){switch(jL(t),t.tag){case 1:return je(t.type)&&vM(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ka(),Z(Ie),Z(me),DL(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return qL(t),null;case 13:if(Z(G),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(C(340));ya()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Z(G),null;case 4:return ka(),null;case 10:return zL(t.type._context),null;case 22:case 23:return GL(),null;case 24:return null;default:return null}}var er=!1,fe=!1,IV=typeof WeakSet=="function"?WeakSet:Set,A=null;function W1(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(a){Q(e,t,a)}else n.current=null}function Rw(e,t,n){try{n()}catch(a){Q(e,t,a)}}var xS=!1;function jV(e,t){if(Mw=kM,e=Fj(),SL(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var r=a.anchorOffset,o=a.focusNode;a=a.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var s=0,c=-1,l=-1,d=0,u=0,y=e,p=null;t:for(;;){for(var m;y!==n||r!==0&&y.nodeType!==3||(c=s+r),y!==o||a!==0&&y.nodeType!==3||(l=s+a),y.nodeType===3&&(s+=y.nodeValue.length),(m=y.firstChild)!==null;)p=y,y=m;for(;;){if(y===e)break t;if(p===n&&++d===r&&(c=s),p===o&&++u===a&&(l=s),(m=y.nextSibling)!==null)break;y=p,p=y.parentNode}y=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(ww={focusedElem:e,selectionRange:n},kM=!1,A=t;A!==null;)if(t=A,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,A=e;else for(;A!==null;){t=A;try{var v=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var x=v.memoizedProps,I=v.memoizedState,g=t.stateNode,k=g.getSnapshotBeforeUpdate(t.elementType===t.type?x:$e(t.type,x),I);g.__reactInternalSnapshotBeforeUpdate=k}break;case 3:var f=t.stateNode.containerInfo;f.nodeType===1?f.textContent="":f.nodeType===9&&f.documentElement&&f.removeChild(f.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(C(163))}}catch(M){Q(t,t.return,M)}if(e=t.sibling,e!==null){e.return=t.return,A=e;break}A=t.return}return v=xS,xS=!1,v}function Za(e,t,n){var a=t.updateQueue;if(a=a!==null?a.lastEffect:null,a!==null){var r=a=a.next;do{if((r.tag&e)===e){var o=r.destroy;r.destroy=void 0,o!==void 0&&Rw(t,n,o)}r=r.next}while(r!==a)}}function QM(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var a=n.create;n.destroy=a()}n=n.next}while(n!==t)}}function Bw(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function HP(e){var t=e.alternate;t!==null&&(e.alternate=null,HP(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[ot],delete t[xi],delete t[Sw],delete t[lV],delete t[dV])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function TP(e){return e.tag===5||e.tag===3||e.tag===4}function MS(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||TP(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Nw(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=gM));else if(a!==4&&(e=e.child,e!==null))for(Nw(e,t,n),e=e.sibling;e!==null;)Nw(e,t,n),e=e.sibling}function Ew(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(e=e.child,e!==null))for(Ew(e,t,n),e=e.sibling;e!==null;)Ew(e,t,n),e=e.sibling}var de=null,Xe=!1;function It(e,t,n){for(n=n.child;n!==null;)qP(e,t,n),n=n.sibling}function qP(e,t,n){if(st&&typeof st.onCommitFiberUnmount=="function")try{st.onCommitFiberUnmount(UM,n)}catch{}switch(n.tag){case 5:fe||W1(n,t);case 6:var a=de,r=Xe;de=null,It(e,t,n),de=a,Xe=r,de!==null&&(Xe?(e=de,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):de.removeChild(n.stateNode));break;case 18:de!==null&&(Xe?(e=de,n=n.stateNode,e.nodeType===8?b9(e.parentNode,n):e.nodeType===1&&b9(e,n),ki(e)):b9(de,n.stateNode));break;case 4:a=de,r=Xe,de=n.stateNode.containerInfo,Xe=!0,It(e,t,n),de=a,Xe=r;break;case 0:case 11:case 14:case 15:if(!fe&&(a=n.updateQueue,a!==null&&(a=a.lastEffect,a!==null))){r=a=a.next;do{var o=r,s=o.destroy;o=o.tag,s!==void 0&&(o&2||o&4)&&Rw(n,t,s),r=r.next}while(r!==a)}It(e,t,n);break;case 1:if(!fe&&(W1(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"))try{a.props=n.memoizedProps,a.state=n.memoizedState,a.componentWillUnmount()}catch(c){Q(n,t,c)}It(e,t,n);break;case 21:It(e,t,n);break;case 22:n.mode&1?(fe=(a=fe)||n.memoizedState!==null,It(e,t,n),fe=a):It(e,t,n);break;default:It(e,t,n)}}function wS(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new IV),t.forEach(function(a){var r=DV.bind(null,e,a);n.has(a)||(n.add(a),a.then(r,r))})}}function Ge(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var r=n[a];try{var o=e,s=t,c=s;e:for(;c!==null;){switch(c.tag){case 5:de=c.stateNode,Xe=!1;break e;case 3:de=c.stateNode.containerInfo,Xe=!0;break e;case 4:de=c.stateNode.containerInfo,Xe=!0;break e}c=c.return}if(de===null)throw Error(C(160));qP(o,s,r),de=null,Xe=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(d){Q(r,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)DP(t,e),t=t.sibling}function DP(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ge(t,e),nt(e),a&4){try{Za(3,e,e.return),QM(3,e)}catch(x){Q(e,e.return,x)}try{Za(5,e,e.return)}catch(x){Q(e,e.return,x)}}break;case 1:Ge(t,e),nt(e),a&512&&n!==null&&W1(n,n.return);break;case 5:if(Ge(t,e),nt(e),a&512&&n!==null&&W1(n,n.return),e.flags&32){var r=e.stateNode;try{hi(r,"")}catch(x){Q(e,e.return,x)}}if(a&4&&(r=e.stateNode,r!=null)){var o=e.memoizedProps,s=n!==null?n.memoizedProps:o,c=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{c==="input"&&o.type==="radio"&&o.name!=null&&ij(r,o),hw(c,s);var d=hw(c,o);for(s=0;s<l.length;s+=2){var u=l[s],y=l[s+1];u==="style"?lj(r,y):u==="dangerouslySetInnerHTML"?sj(r,y):u==="children"?hi(r,y):uL(r,u,y,d)}switch(c){case"input":ow(r,o);break;case"textarea":rj(r,o);break;case"select":var p=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!o.multiple;var m=o.value;m!=null?Y1(r,!!o.multiple,m,!1):p!==!!o.multiple&&(o.defaultValue!=null?Y1(r,!!o.multiple,o.defaultValue,!0):Y1(r,!!o.multiple,o.multiple?[]:"",!1))}r[xi]=o}catch(x){Q(e,e.return,x)}}break;case 6:if(Ge(t,e),nt(e),a&4){if(e.stateNode===null)throw Error(C(162));r=e.stateNode,o=e.memoizedProps;try{r.nodeValue=o}catch(x){Q(e,e.return,x)}}break;case 3:if(Ge(t,e),nt(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{ki(t.containerInfo)}catch(x){Q(e,e.return,x)}break;case 4:Ge(t,e),nt(e);break;case 13:Ge(t,e),nt(e),r=e.child,r.flags&8192&&(o=r.memoizedState!==null,r.stateNode.isHidden=o,!o||r.alternate!==null&&r.alternate.memoizedState!==null||(_L=J())),a&4&&wS(e);break;case 22:if(u=n!==null&&n.memoizedState!==null,e.mode&1?(fe=(d=fe)||u,Ge(t,e),fe=d):Ge(t,e),nt(e),a&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!u&&e.mode&1)for(A=e,u=e.child;u!==null;){for(y=A=u;A!==null;){switch(p=A,m=p.child,p.tag){case 0:case 11:case 14:case 15:Za(4,p,p.return);break;case 1:W1(p,p.return);var v=p.stateNode;if(typeof v.componentWillUnmount=="function"){a=p,n=p.return;try{t=a,v.props=t.memoizedProps,v.state=t.memoizedState,v.componentWillUnmount()}catch(x){Q(a,n,x)}}break;case 5:W1(p,p.return);break;case 22:if(p.memoizedState!==null){CS(y);continue}}m!==null?(m.return=p,A=m):CS(y)}u=u.sibling}e:for(u=null,y=e;;){if(y.tag===5){if(u===null){u=y;try{r=y.stateNode,d?(o=r.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(c=y.stateNode,l=y.memoizedProps.style,s=l!=null&&l.hasOwnProperty("display")?l.display:null,c.style.display=cj("display",s))}catch(x){Q(e,e.return,x)}}}else if(y.tag===6){if(u===null)try{y.stateNode.nodeValue=d?"":y.memoizedProps}catch(x){Q(e,e.return,x)}}else if((y.tag!==22&&y.tag!==23||y.memoizedState===null||y===e)&&y.child!==null){y.child.return=y,y=y.child;continue}if(y===e)break e;for(;y.sibling===null;){if(y.return===null||y.return===e)break e;u===y&&(u=null),y=y.return}u===y&&(u=null),y.sibling.return=y.return,y=y.sibling}}break;case 19:Ge(t,e),nt(e),a&4&&wS(e);break;case 21:break;default:Ge(t,e),nt(e)}}function nt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(TP(n)){var a=n;break e}n=n.return}throw Error(C(160))}switch(a.tag){case 5:var r=a.stateNode;a.flags&32&&(hi(r,""),a.flags&=-33);var o=MS(e);Ew(e,o,r);break;case 3:case 4:var s=a.stateNode.containerInfo,c=MS(e);Nw(e,c,s);break;default:throw Error(C(161))}}catch(l){Q(e,e.return,l)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function PV(e,t,n){A=e,FP(e)}function FP(e,t,n){for(var a=(e.mode&1)!==0;A!==null;){var r=A,o=r.child;if(r.tag===22&&a){var s=r.memoizedState!==null||er;if(!s){var c=r.alternate,l=c!==null&&c.memoizedState!==null||fe;c=er;var d=fe;if(er=s,(fe=l)&&!d)for(A=r;A!==null;)s=A,l=s.child,s.tag===22&&s.memoizedState!==null?SS(r):l!==null?(l.return=s,A=l):SS(r);for(;o!==null;)A=o,FP(o),o=o.sibling;A=r,er=c,fe=d}LS(e)}else r.subtreeFlags&8772&&o!==null?(o.return=r,A=o):LS(e)}}function LS(e){for(;A!==null;){var t=A;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:fe||QM(5,t);break;case 1:var a=t.stateNode;if(t.flags&4&&!fe)if(n===null)a.componentDidMount();else{var r=t.elementType===t.type?n.memoizedProps:$e(t.type,n.memoizedProps);a.componentDidUpdate(r,n.memoizedState,a.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&sS(t,o,a);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}sS(t,s,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var l=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var u=d.memoizedState;if(u!==null){var y=u.dehydrated;y!==null&&ki(y)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(C(163))}fe||t.flags&512&&Bw(t)}catch(p){Q(t,t.return,p)}}if(t===e){A=null;break}if(n=t.sibling,n!==null){n.return=t.return,A=n;break}A=t.return}}function CS(e){for(;A!==null;){var t=A;if(t===e){A=null;break}var n=t.sibling;if(n!==null){n.return=t.return,A=n;break}A=t.return}}function SS(e){for(;A!==null;){var t=A;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{QM(4,t)}catch(l){Q(t,n,l)}break;case 1:var a=t.stateNode;if(typeof a.componentDidMount=="function"){var r=t.return;try{a.componentDidMount()}catch(l){Q(t,r,l)}}var o=t.return;try{Bw(t)}catch(l){Q(t,o,l)}break;case 5:var s=t.return;try{Bw(t)}catch(l){Q(t,s,l)}}}catch(l){Q(t,t.return,l)}if(t===e){A=null;break}var c=t.sibling;if(c!==null){c.return=t.return,A=c;break}A=t.return}}var bV=Math.ceil,bM=Ct.ReactCurrentDispatcher,UL=Ct.ReactCurrentOwner,Ze=Ct.ReactCurrentBatchConfig,R=0,ce=null,ne=null,he=0,ze=0,G1=Kt(0),ie=0,Ii=null,j1=0,YM=0,ZL=0,_a=null,Ce=null,_L=0,ma=1/0,ht=null,AM=!1,Ow=null,Nt=null,tr=!1,Tt=null,zM=0,Wa=0,Uw=null,mr=-1,gr=0;function Me(){return R&6?J():mr!==-1?mr:mr=J()}function Et(e){return e.mode&1?R&2&&he!==0?he&-he:uV.transition!==null?(gr===0&&(gr=Mj()),gr):(e=B,e!==0||(e=window.event,e=e===void 0?16:Pj(e.type)),e):1}function Je(e,t,n,a){if(50<Wa)throw Wa=0,Uw=null,Error(C(185));zi(e,n,a),(!(R&2)||e!==ce)&&(e===ce&&(!(R&2)&&(YM|=n),ie===4&&Vt(e,he)),Pe(e,a),n===1&&R===0&&!(t.mode&1)&&(ma=J()+500,$M&&Qt()))}function Pe(e,t){var n=e.callbackNode;uz(e,t);var a=pM(e,e===ce?he:0);if(a===0)n!==null&&TC(n),e.callbackNode=null,e.callbackPriority=0;else if(t=a&-a,e.callbackPriority!==t){if(n!=null&&TC(n),t===1)e.tag===0?hV(IS.bind(null,e)):Gj(IS.bind(null,e)),sV(function(){!(R&6)&&Qt()}),n=null;else{switch(wj(a)){case 1:n=mL;break;case 4:n=vj;break;case 16:n=yM;break;case 536870912:n=xj;break;default:n=yM}n=_P(n,RP.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function RP(e,t){if(mr=-1,gr=0,R&6)throw Error(C(327));var n=e.callbackNode;if(aa()&&e.callbackNode!==n)return null;var a=pM(e,e===ce?he:0);if(a===0)return null;if(a&30||a&e.expiredLanes||t)t=VM(e,a);else{t=a;var r=R;R|=2;var o=NP();(ce!==e||he!==t)&&(ht=null,ma=J()+500,k1(e,t));do try{VV();break}catch(c){BP(e,c)}while(!0);AL(),bM.current=o,R=r,ne!==null?t=0:(ce=null,he=0,t=ie)}if(t!==0){if(t===2&&(r=fw(e),r!==0&&(a=r,t=Zw(e,r))),t===1)throw n=Ii,k1(e,0),Vt(e,a),Pe(e,J()),n;if(t===6)Vt(e,a);else{if(r=e.current.alternate,!(a&30)&&!AV(r)&&(t=VM(e,a),t===2&&(o=fw(e),o!==0&&(a=o,t=Zw(e,o))),t===1))throw n=Ii,k1(e,0),Vt(e,a),Pe(e,J()),n;switch(e.finishedWork=r,e.finishedLanes=a,t){case 0:case 1:throw Error(C(345));case 2:rn(e,Ce,ht);break;case 3:if(Vt(e,a),(a&130023424)===a&&(t=_L+500-J(),10<t)){if(pM(e,0)!==0)break;if(r=e.suspendedLanes,(r&a)!==a){Me(),e.pingedLanes|=e.suspendedLanes&r;break}e.timeoutHandle=Cw(rn.bind(null,e,Ce,ht),t);break}rn(e,Ce,ht);break;case 4:if(Vt(e,a),(a&4194240)===a)break;for(t=e.eventTimes,r=-1;0<a;){var s=31-Ye(a);o=1<<s,s=t[s],s>r&&(r=s),a&=~o}if(a=r,a=J()-a,a=(120>a?120:480>a?480:1080>a?1080:1920>a?1920:3e3>a?3e3:4320>a?4320:1960*bV(a/1960))-a,10<a){e.timeoutHandle=Cw(rn.bind(null,e,Ce,ht),a);break}rn(e,Ce,ht);break;case 5:rn(e,Ce,ht);break;default:throw Error(C(329))}}}return Pe(e,J()),e.callbackNode===n?RP.bind(null,e):null}function Zw(e,t){var n=_a;return e.current.memoizedState.isDehydrated&&(k1(e,t).flags|=256),e=VM(e,t),e!==2&&(t=Ce,Ce=n,t!==null&&_w(t)),e}function _w(e){Ce===null?Ce=e:Ce.push.apply(Ce,e)}function AV(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var a=0;a<n.length;a++){var r=n[a],o=r.getSnapshot;r=r.value;try{if(!et(o(),r))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Vt(e,t){for(t&=~ZL,t&=~YM,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Ye(t),a=1<<n;e[n]=-1,t&=~a}}function IS(e){if(R&6)throw Error(C(327));aa();var t=pM(e,0);if(!(t&1))return Pe(e,J()),null;var n=VM(e,t);if(e.tag!==0&&n===2){var a=fw(e);a!==0&&(t=a,n=Zw(e,a))}if(n===1)throw n=Ii,k1(e,0),Vt(e,t),Pe(e,J()),n;if(n===6)throw Error(C(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,rn(e,Ce,ht),Pe(e,J()),null}function WL(e,t){var n=R;R|=1;try{return e(t)}finally{R=n,R===0&&(ma=J()+500,$M&&Qt())}}function P1(e){Tt!==null&&Tt.tag===0&&!(R&6)&&aa();var t=R;R|=1;var n=Ze.transition,a=B;try{if(Ze.transition=null,B=1,e)return e()}finally{B=a,Ze.transition=n,R=t,!(R&6)&&Qt()}}function GL(){ze=G1.current,Z(G1)}function k1(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,oV(n)),ne!==null)for(n=ne.return;n!==null;){var a=n;switch(jL(a),a.tag){case 1:a=a.type.childContextTypes,a!=null&&vM();break;case 3:ka(),Z(Ie),Z(me),DL();break;case 5:qL(a);break;case 4:ka();break;case 13:Z(G);break;case 19:Z(G);break;case 10:zL(a.type._context);break;case 22:case 23:GL()}n=n.return}if(ce=e,ne=e=Ot(e.current,null),he=ze=t,ie=0,Ii=null,ZL=YM=j1=0,Ce=_a=null,u1!==null){for(t=0;t<u1.length;t++)if(n=u1[t],a=n.interleaved,a!==null){n.interleaved=null;var r=a.next,o=n.pending;if(o!==null){var s=o.next;o.next=r,a.next=s}n.pending=a}u1=null}return e}function BP(e,t){do{var n=ne;try{if(AL(),pr.current=PM,jM){for(var a=X.memoizedState;a!==null;){var r=a.queue;r!==null&&(r.pending=null),a=a.next}jM=!1}if(I1=0,se=ae=X=null,Ua=!1,Li=0,UL.current=null,n===null||n.return===null){ie=1,Ii=t,ne=null;break}e:{var o=e,s=n.return,c=n,l=t;if(t=he,c.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var d=l,u=c,y=u.tag;if(!(u.mode&1)&&(y===0||y===11||y===15)){var p=u.alternate;p?(u.updateQueue=p.updateQueue,u.memoizedState=p.memoizedState,u.lanes=p.lanes):(u.updateQueue=null,u.memoizedState=null)}var m=yS(s);if(m!==null){m.flags&=-257,pS(m,s,c,o,t),m.mode&1&&uS(o,d,t),t=m,l=d;var v=t.updateQueue;if(v===null){var x=new Set;x.add(l),t.updateQueue=x}else v.add(l);break e}else{if(!(t&1)){uS(o,d,t),$L();break e}l=Error(C(426))}}else if(W&&c.mode&1){var I=yS(s);if(I!==null){!(I.flags&65536)&&(I.flags|=256),pS(I,s,c,o,t),PL(fa(l,c));break e}}o=l=fa(l,c),ie!==4&&(ie=2),_a===null?_a=[o]:_a.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var g=wP(o,l,t);oS(o,g);break e;case 1:c=l;var k=o.type,f=o.stateNode;if(!(o.flags&128)&&(typeof k.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(Nt===null||!Nt.has(f)))){o.flags|=65536,t&=-t,o.lanes|=t;var M=LP(o,c,t);oS(o,M);break e}}o=o.return}while(o!==null)}OP(n)}catch(w){t=w,ne===n&&n!==null&&(ne=n=n.return);continue}break}while(!0)}function NP(){var e=bM.current;return bM.current=PM,e===null?PM:e}function $L(){(ie===0||ie===3||ie===2)&&(ie=4),ce===null||!(j1&268435455)&&!(YM&268435455)||Vt(ce,he)}function VM(e,t){var n=R;R|=2;var a=NP();(ce!==e||he!==t)&&(ht=null,k1(e,t));do try{zV();break}catch(r){BP(e,r)}while(!0);if(AL(),R=n,bM.current=a,ne!==null)throw Error(C(261));return ce=null,he=0,ie}function zV(){for(;ne!==null;)EP(ne)}function VV(){for(;ne!==null&&!az();)EP(ne)}function EP(e){var t=ZP(e.alternate,e,ze);e.memoizedProps=e.pendingProps,t===null?OP(e):ne=t,UL.current=null}function OP(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=SV(n,t),n!==null){n.flags&=32767,ne=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{ie=6,ne=null;return}}else if(n=CV(n,t,ze),n!==null){ne=n;return}if(t=t.sibling,t!==null){ne=t;return}ne=t=e}while(t!==null);ie===0&&(ie=5)}function rn(e,t,n){var a=B,r=Ze.transition;try{Ze.transition=null,B=1,HV(e,t,n,a)}finally{Ze.transition=r,B=a}return null}function HV(e,t,n,a){do aa();while(Tt!==null);if(R&6)throw Error(C(327));n=e.finishedWork;var r=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(C(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(yz(e,o),e===ce&&(ne=ce=null,he=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||tr||(tr=!0,_P(yM,function(){return aa(),null})),o=(n.flags&15990)!==0,n.subtreeFlags&15990||o){o=Ze.transition,Ze.transition=null;var s=B;B=1;var c=R;R|=4,UL.current=null,jV(e,n),DP(n,e),Jz(ww),kM=!!Mw,ww=Mw=null,e.current=n,PV(n),iz(),R=c,B=s,Ze.transition=o}else e.current=n;if(tr&&(tr=!1,Tt=e,zM=r),o=e.pendingLanes,o===0&&(Nt=null),sz(n.stateNode),Pe(e,J()),t!==null)for(a=e.onRecoverableError,n=0;n<t.length;n++)r=t[n],a(r.value,{componentStack:r.stack,digest:r.digest});if(AM)throw AM=!1,e=Ow,Ow=null,e;return zM&1&&e.tag!==0&&aa(),o=e.pendingLanes,o&1?e===Uw?Wa++:(Wa=0,Uw=e):Wa=0,Qt(),null}function aa(){if(Tt!==null){var e=wj(zM),t=Ze.transition,n=B;try{if(Ze.transition=null,B=16>e?16:e,Tt===null)var a=!1;else{if(e=Tt,Tt=null,zM=0,R&6)throw Error(C(331));var r=R;for(R|=4,A=e.current;A!==null;){var o=A,s=o.child;if(A.flags&16){var c=o.deletions;if(c!==null){for(var l=0;l<c.length;l++){var d=c[l];for(A=d;A!==null;){var u=A;switch(u.tag){case 0:case 11:case 15:Za(8,u,o)}var y=u.child;if(y!==null)y.return=u,A=y;else for(;A!==null;){u=A;var p=u.sibling,m=u.return;if(HP(u),u===d){A=null;break}if(p!==null){p.return=m,A=p;break}A=m}}}var v=o.alternate;if(v!==null){var x=v.child;if(x!==null){v.child=null;do{var I=x.sibling;x.sibling=null,x=I}while(x!==null)}}A=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,A=s;else e:for(;A!==null;){if(o=A,o.flags&2048)switch(o.tag){case 0:case 11:case 15:Za(9,o,o.return)}var g=o.sibling;if(g!==null){g.return=o.return,A=g;break e}A=o.return}}var k=e.current;for(A=k;A!==null;){s=A;var f=s.child;if(s.subtreeFlags&2064&&f!==null)f.return=s,A=f;else e:for(s=k;A!==null;){if(c=A,c.flags&2048)try{switch(c.tag){case 0:case 11:case 15:QM(9,c)}}catch(w){Q(c,c.return,w)}if(c===s){A=null;break e}var M=c.sibling;if(M!==null){M.return=c.return,A=M;break e}A=c.return}}if(R=r,Qt(),st&&typeof st.onPostCommitFiberRoot=="function")try{st.onPostCommitFiberRoot(UM,e)}catch{}a=!0}return a}finally{B=n,Ze.transition=t}}return!1}function jS(e,t,n){t=fa(n,t),t=wP(e,t,1),e=Bt(e,t,1),t=Me(),e!==null&&(zi(e,1,t),Pe(e,t))}function Q(e,t,n){if(e.tag===3)jS(e,e,n);else for(;t!==null;){if(t.tag===3){jS(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(Nt===null||!Nt.has(a))){e=fa(n,e),e=LP(t,e,1),t=Bt(t,e,1),e=Me(),t!==null&&(zi(t,1,e),Pe(t,e));break}}t=t.return}}function TV(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),t=Me(),e.pingedLanes|=e.suspendedLanes&n,ce===e&&(he&n)===n&&(ie===4||ie===3&&(he&130023424)===he&&500>J()-_L?k1(e,0):ZL|=n),Pe(e,t)}function UP(e,t){t===0&&(e.mode&1?(t=_i,_i<<=1,!(_i&130023424)&&(_i=4194304)):t=1);var n=Me();e=Mt(e,t),e!==null&&(zi(e,t,n),Pe(e,n))}function qV(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),UP(e,n)}function DV(e,t){var n=0;switch(e.tag){case 13:var a=e.stateNode,r=e.memoizedState;r!==null&&(n=r.retryLane);break;case 19:a=e.stateNode;break;default:throw Error(C(314))}a!==null&&a.delete(t),UP(e,n)}var ZP;ZP=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Ie.current)Se=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return Se=!1,LV(e,t,n);Se=!!(e.flags&131072)}else Se=!1,W&&t.flags&1048576&&$j(t,wM,t.index);switch(t.lanes=0,t.tag){case 2:var a=t.type;fr(e,t),e=t.pendingProps;var r=ua(t,me.current);na(t,n),r=RL(null,t,a,e,r,n);var o=BL();return t.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,je(a)?(o=!0,xM(t)):o=!1,t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,HL(t),r.updater=KM,t.stateNode=r,r._reactInternals=t,zw(t,a,e,n),t=Tw(null,t,a,!0,o,n)):(t.tag=0,W&&o&&IL(t),xe(null,t,r,n),t=t.child),t;case 16:a=t.elementType;e:{switch(fr(e,t),e=t.pendingProps,r=a._init,a=r(a._payload),t.type=a,r=t.tag=RV(a),e=$e(a,e),r){case 0:t=Hw(null,t,a,e,n);break e;case 1:t=mS(null,t,a,e,n);break e;case 11:t=kS(null,t,a,e,n);break e;case 14:t=fS(null,t,a,$e(a.type,e),n);break e}throw Error(C(306,a,""))}return t;case 0:return a=t.type,r=t.pendingProps,r=t.elementType===a?r:$e(a,r),Hw(e,t,a,r,n);case 1:return a=t.type,r=t.pendingProps,r=t.elementType===a?r:$e(a,r),mS(e,t,a,r,n);case 3:e:{if(jP(t),e===null)throw Error(C(387));a=t.pendingProps,o=t.memoizedState,r=o.element,eP(e,t),SM(t,a,null,n);var s=t.memoizedState;if(a=s.element,o.isDehydrated)if(o={element:a,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){r=fa(Error(C(423)),t),t=gS(e,t,a,n,r);break e}else if(a!==r){r=fa(Error(C(424)),t),t=gS(e,t,a,n,r);break e}else for(Ve=Rt(t.stateNode.containerInfo.firstChild),He=t,W=!0,Ke=null,n=Yj(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(ya(),a===r){t=wt(e,t,n);break e}xe(e,t,a,n)}t=t.child}return t;case 5:return tP(t),e===null&&Pw(t),a=t.type,r=t.pendingProps,o=e!==null?e.memoizedProps:null,s=r.children,Lw(a,r)?s=null:o!==null&&Lw(a,o)&&(t.flags|=32),IP(e,t),xe(e,t,s,n),t.child;case 6:return e===null&&Pw(t),null;case 13:return PP(e,t,n);case 4:return TL(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=pa(t,null,a,n):xe(e,t,a,n),t.child;case 11:return a=t.type,r=t.pendingProps,r=t.elementType===a?r:$e(a,r),kS(e,t,a,r,n);case 7:return xe(e,t,t.pendingProps,n),t.child;case 8:return xe(e,t,t.pendingProps.children,n),t.child;case 12:return xe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(a=t.type._context,r=t.pendingProps,o=t.memoizedProps,s=r.value,N(LM,a._currentValue),a._currentValue=s,o!==null)if(et(o.value,s)){if(o.children===r.children&&!Ie.current){t=wt(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var c=o.dependencies;if(c!==null){s=o.child;for(var l=c.firstContext;l!==null;){if(l.context===a){if(o.tag===1){l=ft(-1,n&-n),l.tag=2;var d=o.updateQueue;if(d!==null){d=d.shared;var u=d.pending;u===null?l.next=l:(l.next=u.next,u.next=l),d.pending=l}}o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),bw(o.return,n,t),c.lanes|=n;break}l=l.next}}else if(o.tag===10)s=o.type===t.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(C(341));s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),bw(s,n,t),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===t){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}xe(e,t,r.children,n),t=t.child}return t;case 9:return r=t.type,a=t.pendingProps.children,na(t,n),r=_e(r),a=a(r),t.flags|=1,xe(e,t,a,n),t.child;case 14:return a=t.type,r=$e(a,t.pendingProps),r=$e(a.type,r),fS(e,t,a,r,n);case 15:return CP(e,t,t.type,t.pendingProps,n);case 17:return a=t.type,r=t.pendingProps,r=t.elementType===a?r:$e(a,r),fr(e,t),t.tag=1,je(a)?(e=!0,xM(t)):e=!1,na(t,n),MP(t,a,r),zw(t,a,r,n),Tw(null,t,a,!0,e,n);case 19:return bP(e,t,n);case 22:return SP(e,t,n)}throw Error(C(156,t.tag))};function _P(e,t){return gj(e,t)}function FV(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ue(e,t,n,a){return new FV(e,t,n,a)}function XL(e){return e=e.prototype,!(!e||!e.isReactComponent)}function RV(e){if(typeof e=="function")return XL(e)?1:0;if(e!=null){if(e=e.$$typeof,e===pL)return 11;if(e===kL)return 14}return 2}function Ot(e,t){var n=e.alternate;return n===null?(n=Ue(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function vr(e,t,n,a,r,o){var s=2;if(a=e,typeof e=="function")XL(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case F1:return f1(n.children,r,o,t);case yL:s=8,r|=8;break;case tw:return e=Ue(12,n,t,r|2),e.elementType=tw,e.lanes=o,e;case nw:return e=Ue(13,n,t,r),e.elementType=nw,e.lanes=o,e;case aw:return e=Ue(19,n,t,r),e.elementType=aw,e.lanes=o,e;case tj:return JM(n,r,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case JI:s=10;break e;case ej:s=9;break e;case pL:s=11;break e;case kL:s=14;break e;case Pt:s=16,a=null;break e}throw Error(C(130,e==null?e:typeof e,""))}return t=Ue(s,n,t,r),t.elementType=e,t.type=a,t.lanes=o,t}function f1(e,t,n,a){return e=Ue(7,e,a,t),e.lanes=n,e}function JM(e,t,n,a){return e=Ue(22,e,a,t),e.elementType=tj,e.lanes=n,e.stateNode={isHidden:!1},e}function F9(e,t,n){return e=Ue(6,e,null,t),e.lanes=n,e}function R9(e,t,n){return t=Ue(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function BV(e,t,n,a,r){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=g9(0),this.expirationTimes=g9(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=g9(0),this.identifierPrefix=a,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function KL(e,t,n,a,r,o,s,c,l){return e=new BV(e,t,n,c,l),t===1?(t=1,o===!0&&(t|=8)):t=0,o=Ue(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:a,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},HL(o),e}function NV(e,t,n){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:D1,key:a==null?null:""+a,children:e,containerInfo:t,implementation:n}}function WP(e){if(!e)return Wt;e=e._reactInternals;e:{if(z1(e)!==e||e.tag!==1)throw Error(C(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(je(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(C(171))}if(e.tag===1){var n=e.type;if(je(n))return Wj(e,n,t)}return t}function GP(e,t,n,a,r,o,s,c,l){return e=KL(n,a,!0,e,r,o,s,c,l),e.context=WP(null),n=e.current,a=Me(),r=Et(n),o=ft(a,r),o.callback=t??null,Bt(n,o,r),e.current.lanes=r,zi(e,r,a),Pe(e,a),e}function e9(e,t,n,a){var r=t.current,o=Me(),s=Et(r);return n=WP(n),t.context===null?t.context=n:t.pendingContext=n,t=ft(o,s),t.payload={element:e},a=a===void 0?null:a,a!==null&&(t.callback=a),e=Bt(r,t,s),e!==null&&(Je(e,r,s,o),yr(e,r,s)),s}function HM(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function PS(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function QL(e,t){PS(e,t),(e=e.alternate)&&PS(e,t)}function EV(){return null}var $P=typeof reportError=="function"?reportError:function(e){console.error(e)};function YL(e){this._internalRoot=e}t9.prototype.render=YL.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(C(409));e9(e,t,null,null)};t9.prototype.unmount=YL.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;P1(function(){e9(null,e,null,null)}),t[xt]=null}};function t9(e){this._internalRoot=e}t9.prototype.unstable_scheduleHydration=function(e){if(e){var t=Sj();e={blockedOn:null,target:e,priority:t};for(var n=0;n<zt.length&&t!==0&&t<zt[n].priority;n++);zt.splice(n,0,e),n===0&&jj(e)}};function JL(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function n9(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function bS(){}function OV(e,t,n,a,r){if(r){if(typeof a=="function"){var o=a;a=function(){var d=HM(s);o.call(d)}}var s=GP(t,a,e,0,null,!1,!1,"",bS);return e._reactRootContainer=s,e[xt]=s.current,gi(e.nodeType===8?e.parentNode:e),P1(),s}for(;r=e.lastChild;)e.removeChild(r);if(typeof a=="function"){var c=a;a=function(){var d=HM(l);c.call(d)}}var l=KL(e,0,!1,null,null,!1,!1,"",bS);return e._reactRootContainer=l,e[xt]=l.current,gi(e.nodeType===8?e.parentNode:e),P1(function(){e9(t,l,n,a)}),l}function a9(e,t,n,a,r){var o=n._reactRootContainer;if(o){var s=o;if(typeof r=="function"){var c=r;r=function(){var l=HM(s);c.call(l)}}e9(t,s,e,r)}else s=OV(n,t,e,r,a);return HM(s)}Lj=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=qa(t.pendingLanes);n!==0&&(gL(t,n|1),Pe(t,J()),!(R&6)&&(ma=J()+500,Qt()))}break;case 13:P1(function(){var a=Mt(e,1);if(a!==null){var r=Me();Je(a,e,1,r)}}),QL(e,1)}};vL=function(e){if(e.tag===13){var t=Mt(e,134217728);if(t!==null){var n=Me();Je(t,e,134217728,n)}QL(e,134217728)}};Cj=function(e){if(e.tag===13){var t=Et(e),n=Mt(e,t);if(n!==null){var a=Me();Je(n,e,t,a)}QL(e,t)}};Sj=function(){return B};Ij=function(e,t){var n=B;try{return B=e,t()}finally{B=n}};yw=function(e,t,n){switch(t){case"input":if(ow(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var r=GM(a);if(!r)throw Error(C(90));aj(a),ow(a,r)}}}break;case"textarea":rj(e,n);break;case"select":t=n.value,t!=null&&Y1(e,!!n.multiple,t,!1)}};uj=WL;yj=P1;var UV={usingClientEntryPoint:!1,Events:[Hi,E1,GM,dj,hj,WL]},Aa={findFiberByHostInstance:h1,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},ZV={bundleType:Aa.bundleType,version:Aa.version,rendererPackageName:Aa.rendererPackageName,rendererConfig:Aa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ct.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=fj(e),e===null?null:e.stateNode},findFiberByHostInstance:Aa.findFiberByHostInstance||EV,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var nr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!nr.isDisabled&&nr.supportsFiber)try{UM=nr.inject(ZV),st=nr}catch{}}De.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=UV;De.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!JL(t))throw Error(C(200));return NV(e,t,null,n)};De.createRoot=function(e,t){if(!JL(e))throw Error(C(299));var n=!1,a="",r=$P;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=KL(e,1,!1,null,null,n,!1,a,r),e[xt]=t.current,gi(e.nodeType===8?e.parentNode:e),new YL(t)};De.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(C(188)):(e=Object.keys(e).join(","),Error(C(268,e)));return e=fj(t),e=e===null?null:e.stateNode,e};De.flushSync=function(e){return P1(e)};De.hydrate=function(e,t,n){if(!n9(t))throw Error(C(200));return a9(null,e,t,!0,n)};De.hydrateRoot=function(e,t,n){if(!JL(e))throw Error(C(405));var a=n!=null&&n.hydratedSources||null,r=!1,o="",s=$P;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=GP(t,null,e,1,n??null,r,!1,o,s),e[xt]=t.current,gi(e),a)for(e=0;e<a.length;e++)n=a[e],r=n._getVersion,r=r(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,r]:t.mutableSourceEagerHydrationData.push(n,r);return new t9(t)};De.render=function(e,t,n){if(!n9(t))throw Error(C(200));return a9(null,e,t,!1,n)};De.unmountComponentAtNode=function(e){if(!n9(e))throw Error(C(40));return e._reactRootContainer?(P1(function(){a9(null,null,e,!1,function(){e._reactRootContainer=null,e[xt]=null})}),!0):!1};De.unstable_batchedUpdates=WL;De.unstable_renderSubtreeIntoContainer=function(e,t,n,a){if(!n9(n))throw Error(C(200));if(e==null||e._reactInternals===void 0)throw Error(C(38));return a9(e,t,n,!1,a)};De.version="18.3.1-next-f1338f8080-20240426";function XP(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(XP)}catch(e){console.error(e)}}XP(),XI.exports=De;var _V=XI.exports,AS=_V;J9.createRoot=AS.createRoot,J9.hydrateRoot=AS.hydrateRoot;/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var WV={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const GV=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),i=(e,t)=>{const n=L.forwardRef(({color:a="currentColor",size:r=24,strokeWidth:o=2,absoluteStrokeWidth:s,className:c="",children:l,...d},u)=>L.createElement("svg",{ref:u,...WV,width:r,height:r,stroke:a,strokeWidth:s?Number(o)*24/Number(r):o,className:["lucide",`lucide-${GV(e)}`,c].join(" "),...d},[...t.map(([y,p])=>L.createElement(y,p)),...Array.isArray(l)?l:[l]]));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xr=i("AArrowDown",[["path",{d:"M3.5 13h6",key:"p1my2r"}],["path",{d:"m2 16 4.5-9 4.5 9",key:"ndf0b3"}],["path",{d:"M18 7v9",key:"pknjwm"}],["path",{d:"m14 12 4 4 4-4",key:"buelq4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mr=i("AArrowUp",[["path",{d:"M3.5 13h6",key:"p1my2r"}],["path",{d:"m2 16 4.5-9 4.5 9",key:"ndf0b3"}],["path",{d:"M18 16V7",key:"ty0viw"}],["path",{d:"m14 11 4-4 4 4",key:"1pu57t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wr=i("ALargeSmall",[["path",{d:"M21 14h-5",key:"1vh23k"}],["path",{d:"M16 16v-3.5a2.5 2.5 0 0 1 5 0V16",key:"1wh10o"}],["path",{d:"M4.5 13h6",key:"dfilno"}],["path",{d:"m3 16 4.5-9 4.5 9",key:"2dxa0e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lr=i("Accessibility",[["circle",{cx:"16",cy:"4",r:"1",key:"1grugj"}],["path",{d:"m18 19 1-7-6 1",key:"r0i19z"}],["path",{d:"m5 8 3-3 5.5 3-2.36 3.5",key:"9ptxx2"}],["path",{d:"M4.24 14.5a5 5 0 0 0 6.88 6",key:"10kmtu"}],["path",{d:"M13.76 17.5a5 5 0 0 0-6.88-6",key:"2qq6rc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cr=i("ActivitySquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M17 12h-2l-2 5-2-10-2 5H7",key:"15hlnc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sr=i("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ir=i("AirVent",[["path",{d:"M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"larmp2"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12",key:"1bo8pg"}],["path",{d:"M6.6 15.6A2 2 0 1 0 10 17v-5",key:"t9h90c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jr=i("Airplay",[["path",{d:"M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1",key:"ns4c3b"}],["polygon",{points:"12 15 17 21 7 21 12 15",key:"1sy95i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const on=i("AlarmClockCheck",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}],["path",{d:"m9 13 2 2 4-4",key:"6343dt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sn=i("AlarmClockMinus",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}],["path",{d:"M9 13h6",key:"1uhe8q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pr=i("AlarmClockOff",[["path",{d:"M6.87 6.87a8 8 0 1 0 11.26 11.26",key:"3on8tj"}],["path",{d:"M19.9 14.25a8 8 0 0 0-9.15-9.15",key:"15ghsc"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.26 18.67 4 21",key:"yzmioq"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M4 4 2 6",key:"1ycko6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cn=i("AlarmClockPlus",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}],["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1uhe8q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const br=i("AlarmClock",[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M12 9v4l2 2",key:"1c63tq"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ar=i("AlarmSmoke",[["path",{d:"M4 8a2 2 0 0 1-2-2V3h20v3a2 2 0 0 1-2 2Z",key:"2c4fvq"}],["path",{d:"m19 8-.8 3c-.1.6-.6 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L5 8",key:"1vrndv"}],["path",{d:"M16 21c0-2.5 2-2.5 2-5",key:"1o3eny"}],["path",{d:"M11 21c0-2.5 2-2.5 2-5",key:"1sicvv"}],["path",{d:"M6 21c0-2.5 2-2.5 2-5",key:"i3w1gp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zr=i("Album",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["polyline",{points:"11 3 11 11 14 8 17 11 17 3",key:"1wcwz3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=i("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vr=i("AlertOctagon",[["polygon",{points:"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",key:"h1p8hx"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ut=i("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hr=i("AlignCenterHorizontal",[["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4",key:"11f1s0"}],["path",{d:"M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4",key:"t14dx9"}],["path",{d:"M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1",key:"1w07xs"}],["path",{d:"M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1",key:"1apec2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tr=i("AlignCenterVertical",[["path",{d:"M12 2v20",key:"t6zp3m"}],["path",{d:"M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4",key:"14d6g8"}],["path",{d:"M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4",key:"1e2lrw"}],["path",{d:"M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1",key:"1fkdwx"}],["path",{d:"M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1",key:"1euafb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qr=i("AlignCenter",[["line",{x1:"21",x2:"3",y1:"6",y2:"6",key:"1fp77t"}],["line",{x1:"17",x2:"7",y1:"12",y2:"12",key:"rsh8ii"}],["line",{x1:"19",x2:"5",y1:"18",y2:"18",key:"1t0tuv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dr=i("AlignEndHorizontal",[["rect",{width:"6",height:"16",x:"4",y:"2",rx:"2",key:"z5wdxg"}],["rect",{width:"6",height:"9",x:"14",y:"9",rx:"2",key:"um7a8w"}],["path",{d:"M22 22H2",key:"19qnx5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fr=i("AlignEndVertical",[["rect",{width:"16",height:"6",x:"2",y:"4",rx:"2",key:"10wcwx"}],["rect",{width:"9",height:"6",x:"9",y:"14",rx:"2",key:"4p5bwg"}],["path",{d:"M22 22V2",key:"12ipfv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rr=i("AlignHorizontalDistributeCenter",[["rect",{width:"6",height:"14",x:"4",y:"5",rx:"2",key:"1wwnby"}],["rect",{width:"6",height:"10",x:"14",y:"7",rx:"2",key:"1fe6j6"}],["path",{d:"M17 22v-5",key:"4b6g73"}],["path",{d:"M17 7V2",key:"hnrr36"}],["path",{d:"M7 22v-3",key:"1r4jpn"}],["path",{d:"M7 5V2",key:"liy1u9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Br=i("AlignHorizontalDistributeEnd",[["rect",{width:"6",height:"14",x:"4",y:"5",rx:"2",key:"1wwnby"}],["rect",{width:"6",height:"10",x:"14",y:"7",rx:"2",key:"1fe6j6"}],["path",{d:"M10 2v20",key:"uyc634"}],["path",{d:"M20 2v20",key:"1tx262"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nr=i("AlignHorizontalDistributeStart",[["rect",{width:"6",height:"14",x:"4",y:"5",rx:"2",key:"1wwnby"}],["rect",{width:"6",height:"10",x:"14",y:"7",rx:"2",key:"1fe6j6"}],["path",{d:"M4 2v20",key:"gtpd5x"}],["path",{d:"M14 2v20",key:"tg6bpw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Er=i("AlignHorizontalJustifyCenter",[["rect",{width:"6",height:"14",x:"2",y:"5",rx:"2",key:"dy24zr"}],["rect",{width:"6",height:"10",x:"16",y:"7",rx:"2",key:"13zkjt"}],["path",{d:"M12 2v20",key:"t6zp3m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Or=i("AlignHorizontalJustifyEnd",[["rect",{width:"6",height:"14",x:"2",y:"5",rx:"2",key:"dy24zr"}],["rect",{width:"6",height:"10",x:"12",y:"7",rx:"2",key:"1ht384"}],["path",{d:"M22 2v20",key:"40qfg1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ur=i("AlignHorizontalJustifyStart",[["rect",{width:"6",height:"14",x:"6",y:"5",rx:"2",key:"hsirpf"}],["rect",{width:"6",height:"10",x:"16",y:"7",rx:"2",key:"13zkjt"}],["path",{d:"M2 2v20",key:"1ivd8o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zr=i("AlignHorizontalSpaceAround",[["rect",{width:"6",height:"10",x:"9",y:"7",rx:"2",key:"yn7j0q"}],["path",{d:"M4 22V2",key:"tsjzd3"}],["path",{d:"M20 22V2",key:"1bnhr8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _r=i("AlignHorizontalSpaceBetween",[["rect",{width:"6",height:"14",x:"3",y:"5",rx:"2",key:"j77dae"}],["rect",{width:"6",height:"10",x:"15",y:"7",rx:"2",key:"bq30hj"}],["path",{d:"M3 2v20",key:"1d2pfg"}],["path",{d:"M21 2v20",key:"p059bm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wr=i("AlignJustify",[["line",{x1:"3",x2:"21",y1:"6",y2:"6",key:"4m8b97"}],["line",{x1:"3",x2:"21",y1:"12",y2:"12",key:"10d38w"}],["line",{x1:"3",x2:"21",y1:"18",y2:"18",key:"kwyyxn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gr=i("AlignLeft",[["line",{x1:"21",x2:"3",y1:"6",y2:"6",key:"1fp77t"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}],["line",{x1:"17",x2:"3",y1:"18",y2:"18",key:"1awlsn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $r=i("AlignRight",[["line",{x1:"21",x2:"3",y1:"6",y2:"6",key:"1fp77t"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}],["line",{x1:"21",x2:"7",y1:"18",y2:"18",key:"1g9eri"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xr=i("AlignStartHorizontal",[["rect",{width:"6",height:"16",x:"4",y:"6",rx:"2",key:"1n4dg1"}],["rect",{width:"6",height:"9",x:"14",y:"6",rx:"2",key:"17khns"}],["path",{d:"M22 2H2",key:"fhrpnj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kr=i("AlignStartVertical",[["rect",{width:"9",height:"6",x:"6",y:"14",rx:"2",key:"lpm2y7"}],["rect",{width:"16",height:"6",x:"6",y:"4",rx:"2",key:"rdj6ps"}],["path",{d:"M2 2v20",key:"1ivd8o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qr=i("AlignVerticalDistributeCenter",[["rect",{width:"14",height:"6",x:"5",y:"14",rx:"2",key:"jmoj9s"}],["rect",{width:"10",height:"6",x:"7",y:"4",rx:"2",key:"aza5on"}],["path",{d:"M22 7h-5",key:"o2endc"}],["path",{d:"M7 7H1",key:"105l6j"}],["path",{d:"M22 17h-3",key:"1lwga1"}],["path",{d:"M5 17H2",key:"1gx9xc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yr=i("AlignVerticalDistributeEnd",[["rect",{width:"14",height:"6",x:"5",y:"14",rx:"2",key:"jmoj9s"}],["rect",{width:"10",height:"6",x:"7",y:"4",rx:"2",key:"aza5on"}],["path",{d:"M2 20h20",key:"owomy5"}],["path",{d:"M2 10h20",key:"1ir3d8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jr=i("AlignVerticalDistributeStart",[["rect",{width:"14",height:"6",x:"5",y:"14",rx:"2",key:"jmoj9s"}],["rect",{width:"10",height:"6",x:"7",y:"4",rx:"2",key:"aza5on"}],["path",{d:"M2 14h20",key:"myj16y"}],["path",{d:"M2 4h20",key:"mda7wb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eo=i("AlignVerticalJustifyCenter",[["rect",{width:"14",height:"6",x:"5",y:"16",rx:"2",key:"1i8z2d"}],["rect",{width:"10",height:"6",x:"7",y:"2",rx:"2",key:"ypihtt"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const to=i("AlignVerticalJustifyEnd",[["rect",{width:"14",height:"6",x:"5",y:"12",rx:"2",key:"4l4tp2"}],["rect",{width:"10",height:"6",x:"7",y:"2",rx:"2",key:"ypihtt"}],["path",{d:"M2 22h20",key:"272qi7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const no=i("AlignVerticalJustifyStart",[["rect",{width:"14",height:"6",x:"5",y:"16",rx:"2",key:"1i8z2d"}],["rect",{width:"10",height:"6",x:"7",y:"6",rx:"2",key:"13squh"}],["path",{d:"M2 2h20",key:"1ennik"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ao=i("AlignVerticalSpaceAround",[["rect",{width:"10",height:"6",x:"7",y:"9",rx:"2",key:"b1zbii"}],["path",{d:"M22 20H2",key:"1p1f7z"}],["path",{d:"M22 4H2",key:"1b7qnq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const io=i("AlignVerticalSpaceBetween",[["rect",{width:"14",height:"6",x:"5",y:"15",rx:"2",key:"1w91an"}],["rect",{width:"10",height:"6",x:"7",y:"3",rx:"2",key:"17wqzy"}],["path",{d:"M2 21h20",key:"1nyx9w"}],["path",{d:"M2 3h20",key:"91anmk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ro=i("Ampersand",[["path",{d:"M17.5 12c0 4.4-3.6 8-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13",key:"1o9ehi"}],["path",{d:"M16 12h3",key:"4uvgyw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oo=i("Ampersands",[["path",{d:"M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",key:"12lh1k"}],["path",{d:"M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",key:"173c68"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const so=i("Anchor",[["circle",{cx:"12",cy:"5",r:"3",key:"rqqgnr"}],["line",{x1:"12",x2:"12",y1:"22",y2:"8",key:"abakz7"}],["path",{d:"M5 12H2a10 10 0 0 0 20 0h-3",key:"1hv3nh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const co=i("Angry",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 16s-1.5-2-4-2-4 2-4 2",key:"epbg0q"}],["path",{d:"M7.5 8 10 9",key:"olxxln"}],["path",{d:"m14 9 2.5-1",key:"1j6cij"}],["path",{d:"M9 10h0",key:"1vxvly"}],["path",{d:"M15 10h0",key:"1j6oav"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=i("Annoyed",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 15h8",key:"45n4r"}],["path",{d:"M8 9h2",key:"1g203m"}],["path",{d:"M14 9h2",key:"116p9w"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ho=i("Antenna",[["path",{d:"M2 12 7 2",key:"117k30"}],["path",{d:"m7 12 5-10",key:"1tvx22"}],["path",{d:"m12 12 5-10",key:"ev1o1a"}],["path",{d:"m17 12 5-10",key:"1e4ti3"}],["path",{d:"M4.5 7h15",key:"vlsxkz"}],["path",{d:"M12 16v6",key:"c8a4gj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uo=i("Anvil",[["path",{d:"M7 10c-2.8 0-5-2.2-5-5h5",key:"1d6adc"}],["path",{d:"M7 4v8h7a8 8 0 0 0 8-8Z",key:"uu98hv"}],["path",{d:"M9 12v5",key:"3anwtq"}],["path",{d:"M15 12v5",key:"5xh3zn"}],["path",{d:"M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1H5Z",key:"10a9tj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yo=i("Aperture",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"14.31",x2:"20.05",y1:"8",y2:"17.94",key:"jdes2e"}],["line",{x1:"9.69",x2:"21.17",y1:"8",y2:"8",key:"1gubuk"}],["line",{x1:"7.38",x2:"13.12",y1:"12",y2:"2.06",key:"1m4d1n"}],["line",{x1:"9.69",x2:"3.95",y1:"16",y2:"6.06",key:"1wye2p"}],["line",{x1:"14.31",x2:"2.83",y1:"16",y2:"16",key:"1l9f4x"}],["line",{x1:"16.62",x2:"10.88",y1:"12",y2:"21.94",key:"1jjvfs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const po=i("AppWindow",[["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}],["path",{d:"M10 4v4",key:"pp8u80"}],["path",{d:"M2 8h20",key:"d11cs7"}],["path",{d:"M6 4v4",key:"1svtjw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ko=i("Apple",[["path",{d:"M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z",key:"3s7exb"}],["path",{d:"M10 2c1 .5 2 2 2 5",key:"fcco2y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fo=i("ArchiveRestore",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h2",key:"tvwodi"}],["path",{d:"M20 8v11a2 2 0 0 1-2 2h-2",key:"1gkqxj"}],["path",{d:"m9 15 3-3 3 3",key:"1pd0qc"}],["path",{d:"M12 12v9",key:"192myk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mo=i("ArchiveX",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"m9.5 17 5-5",key:"nakeu6"}],["path",{d:"m9.5 12 5 5",key:"1hccrj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const go=i("Archive",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vo=i("AreaChart",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M7 12v5h12V8l-5 5-4-4Z",key:"zxz28u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xo=i("Armchair",[["path",{d:"M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3",key:"irtipd"}],["path",{d:"M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z",key:"1e01m0"}],["path",{d:"M5 18v2",key:"ppbyun"}],["path",{d:"M19 18v2",key:"gy7782"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mo=i("ArrowBigDownDash",[["path",{d:"M15 5H9",key:"1tp3ed"}],["path",{d:"M15 9v3h4l-7 7-7-7h4V9h6z",key:"oscb9h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wo=i("ArrowBigDown",[["path",{d:"M15 6v6h4l-7 7-7-7h4V6h6z",key:"1thax2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lo=i("ArrowBigLeftDash",[["path",{d:"M19 15V9",key:"1hci5f"}],["path",{d:"M15 15h-3v4l-7-7 7-7v4h3v6z",key:"16tjna"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Co=i("ArrowBigLeft",[["path",{d:"M18 15h-6v4l-7-7 7-7v4h6v6z",key:"lbrdak"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const So=i("ArrowBigRightDash",[["path",{d:"M5 9v6",key:"158jrl"}],["path",{d:"M9 9h3V5l7 7-7 7v-4H9V9z",key:"1sg2xn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Io=i("ArrowBigRight",[["path",{d:"M6 9h6V5l7 7-7 7v-4H6V9z",key:"7fvt9c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jo=i("ArrowBigUpDash",[["path",{d:"M9 19h6",key:"456am0"}],["path",{d:"M9 15v-3H5l7-7 7 7h-4v3H9z",key:"1r2uve"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Po=i("ArrowBigUp",[["path",{d:"M9 18v-6H5l7-7 7 7h-4v6H9z",key:"1x06kx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bo=i("ArrowDown01",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["rect",{x:"15",y:"4",width:"4",height:"6",ry:"2",key:"1bwicg"}],["path",{d:"M17 20v-6h-2",key:"1qp1so"}],["path",{d:"M15 20h4",key:"1j968p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ao=i("ArrowDown10",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M17 10V4h-2",key:"zcsr5x"}],["path",{d:"M15 10h4",key:"id2lce"}],["rect",{x:"15",y:"14",width:"4",height:"6",ry:"2",key:"33xykx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ln=i("ArrowDownAZ",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M20 8h-5",key:"1vsyxs"}],["path",{d:"M15 10V6.5a2.5 2.5 0 0 1 5 0V10",key:"ag13bf"}],["path",{d:"M15 14h5l-5 6h5",key:"ur5jdg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zo=i("ArrowDownCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 8v8",key:"napkw2"}],["path",{d:"m8 12 4 4 4-4",key:"k98ssh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vo=i("ArrowDownFromLine",[["path",{d:"M19 3H5",key:"1236rx"}],["path",{d:"M12 21V7",key:"gj6g52"}],["path",{d:"m6 15 6 6 6-6",key:"h15q88"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ho=i("ArrowDownLeftFromCircle",[["path",{d:"M2 12a10 10 0 1 1 10 10",key:"1yn6ov"}],["path",{d:"m2 22 10-10",key:"28ilpk"}],["path",{d:"M8 22H2v-6",key:"sulq54"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const To=i("ArrowDownLeftSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m16 8-8 8",key:"166keh"}],["path",{d:"M16 16H8V8",key:"1w2ppm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qo=i("ArrowDownLeft",[["path",{d:"M17 7 7 17",key:"15tmo1"}],["path",{d:"M17 17H7V7",key:"1org7z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Do=i("ArrowDownNarrowWide",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M11 4h4",key:"6d7r33"}],["path",{d:"M11 8h7",key:"djye34"}],["path",{d:"M11 12h10",key:"1438ji"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fo=i("ArrowDownRightFromCircle",[["path",{d:"M12 22a10 10 0 1 1 10-10",key:"130bv5"}],["path",{d:"M22 22 12 12",key:"131aw7"}],["path",{d:"M22 16v6h-6",key:"1gvm70"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ro=i("ArrowDownRightSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m8 8 8 8",key:"1imecy"}],["path",{d:"M16 8v8H8",key:"1lbpgo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bo=i("ArrowDownRight",[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const No=i("ArrowDownSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 8v8",key:"napkw2"}],["path",{d:"m8 12 4 4 4-4",key:"k98ssh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eo=i("ArrowDownToDot",[["path",{d:"M12 2v14",key:"jyx4ut"}],["path",{d:"m19 9-7 7-7-7",key:"1oe3oy"}],["circle",{cx:"12",cy:"21",r:"1",key:"o0uj5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oo=i("ArrowDownToLine",[["path",{d:"M12 17V3",key:"1cwfxf"}],["path",{d:"m6 11 6 6 6-6",key:"12ii2o"}],["path",{d:"M19 21H5",key:"150jfl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uo=i("ArrowDownUp",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"m21 8-4-4-4 4",key:"1c9v7m"}],["path",{d:"M17 4v16",key:"7dpous"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dn=i("ArrowDownWideNarrow",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M11 4h10",key:"1w87gc"}],["path",{d:"M11 8h7",key:"djye34"}],["path",{d:"M11 12h4",key:"q8tih4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hn=i("ArrowDownZA",[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M15 4h5l-5 6h5",key:"8asdl1"}],["path",{d:"M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",key:"r6l5cz"}],["path",{d:"M20 18h-5",key:"18j1r2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zo=i("ArrowDown",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _o=i("ArrowLeftCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 12H8",key:"1fr5h0"}],["path",{d:"m12 8-4 4 4 4",key:"15vm53"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wo=i("ArrowLeftFromLine",[["path",{d:"m9 6-6 6 6 6",key:"7v63n9"}],["path",{d:"M3 12h14",key:"13k4hi"}],["path",{d:"M21 19V5",key:"b4bplr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Go=i("ArrowLeftRight",[["path",{d:"M8 3 4 7l4 4",key:"9rb6wj"}],["path",{d:"M4 7h16",key:"6tx8e3"}],["path",{d:"m16 21 4-4-4-4",key:"siv7j2"}],["path",{d:"M20 17H4",key:"h6l3hr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $o=i("ArrowLeftSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m12 8-4 4 4 4",key:"15vm53"}],["path",{d:"M16 12H8",key:"1fr5h0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xo=i("ArrowLeftToLine",[["path",{d:"M3 19V5",key:"rwsyhb"}],["path",{d:"m13 6-6 6 6 6",key:"1yhaz7"}],["path",{d:"M7 12h14",key:"uoisry"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ko=i("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qo=i("ArrowRightCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m12 16 4-4-4-4",key:"1i9zcv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yo=i("ArrowRightFromLine",[["path",{d:"M3 5v14",key:"1nt18q"}],["path",{d:"M21 12H7",key:"13ipq5"}],["path",{d:"m15 18 6-6-6-6",key:"6tx3qv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jo=i("ArrowRightLeft",[["path",{d:"m16 3 4 4-4 4",key:"1x1c3m"}],["path",{d:"M20 7H4",key:"zbl0bi"}],["path",{d:"m8 21-4-4 4-4",key:"h9nckh"}],["path",{d:"M4 17h16",key:"g4d7ey"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e2=i("ArrowRightSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m12 16 4-4-4-4",key:"1i9zcv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t2=i("ArrowRightToLine",[["path",{d:"M17 12H3",key:"8awo09"}],["path",{d:"m11 18 6-6-6-6",key:"8c2y43"}],["path",{d:"M21 5v14",key:"nzette"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n2=i("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a2=i("ArrowUp01",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["rect",{x:"15",y:"4",width:"4",height:"6",ry:"2",key:"1bwicg"}],["path",{d:"M17 20v-6h-2",key:"1qp1so"}],["path",{d:"M15 20h4",key:"1j968p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i2=i("ArrowUp10",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M17 10V4h-2",key:"zcsr5x"}],["path",{d:"M15 10h4",key:"id2lce"}],["rect",{x:"15",y:"14",width:"4",height:"6",ry:"2",key:"33xykx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const un=i("ArrowUpAZ",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M20 8h-5",key:"1vsyxs"}],["path",{d:"M15 10V6.5a2.5 2.5 0 0 1 5 0V10",key:"ag13bf"}],["path",{d:"M15 14h5l-5 6h5",key:"ur5jdg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r2=i("ArrowUpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o2=i("ArrowUpDown",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s2=i("ArrowUpFromDot",[["path",{d:"m5 9 7-7 7 7",key:"1hw5ic"}],["path",{d:"M12 16V2",key:"ywoabb"}],["circle",{cx:"12",cy:"21",r:"1",key:"o0uj5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c2=i("ArrowUpFromLine",[["path",{d:"m18 9-6-6-6 6",key:"kcunyi"}],["path",{d:"M12 3v14",key:"7cf3v8"}],["path",{d:"M5 21h14",key:"11awu3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l2=i("ArrowUpLeftFromCircle",[["path",{d:"M2 8V2h6",key:"hiwtdz"}],["path",{d:"m2 2 10 10",key:"1oh8rs"}],["path",{d:"M12 2A10 10 0 1 1 2 12",key:"rrk4fa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d2=i("ArrowUpLeftSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 16V8h8",key:"19xb1h"}],["path",{d:"M16 16 8 8",key:"1qdy8n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h2=i("ArrowUpLeft",[["path",{d:"M7 17V7h10",key:"11bw93"}],["path",{d:"M17 17 7 7",key:"2786uv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yn=i("ArrowUpNarrowWide",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M11 12h4",key:"q8tih4"}],["path",{d:"M11 16h7",key:"uosisv"}],["path",{d:"M11 20h10",key:"jvxblo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u2=i("ArrowUpRightFromCircle",[["path",{d:"M22 12A10 10 0 1 1 12 2",key:"1fm58d"}],["path",{d:"M22 2 12 12",key:"yg2myt"}],["path",{d:"M16 2h6v6",key:"zan5cs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y2=i("ArrowUpRightSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 8h8v8",key:"b65dnt"}],["path",{d:"m8 16 8-8",key:"13b9ih"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p2=i("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k2=i("ArrowUpSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f2=i("ArrowUpToLine",[["path",{d:"M5 3h14",key:"7usisc"}],["path",{d:"m18 13-6-6-6 6",key:"1kf1n9"}],["path",{d:"M12 7v14",key:"1akyts"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m2=i("ArrowUpWideNarrow",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M11 12h10",key:"1438ji"}],["path",{d:"M11 16h7",key:"uosisv"}],["path",{d:"M11 20h4",key:"1krc32"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pn=i("ArrowUpZA",[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M15 4h5l-5 6h5",key:"8asdl1"}],["path",{d:"M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",key:"r6l5cz"}],["path",{d:"M20 18h-5",key:"18j1r2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g2=i("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v2=i("ArrowsUpFromLine",[["path",{d:"m4 6 3-3 3 3",key:"9aidw8"}],["path",{d:"M7 17V3",key:"19qxw1"}],["path",{d:"m14 6 3-3 3 3",key:"6iy689"}],["path",{d:"M17 17V3",key:"o0fmgi"}],["path",{d:"M4 21h16",key:"1h09gz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x2=i("Asterisk",[["path",{d:"M12 6v12",key:"1vza4d"}],["path",{d:"M17.196 9 6.804 15",key:"1ah31z"}],["path",{d:"m6.804 9 10.392 6",key:"1b6pxd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M2=i("AtSign",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",key:"7n84p3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w2=i("Atom",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",key:"1l2ple"}],["path",{d:"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",key:"1wam0m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L2=i("AudioLines",[["path",{d:"M2 10v3",key:"1fnikh"}],["path",{d:"M6 6v11",key:"11sgs0"}],["path",{d:"M10 3v18",key:"yhl04a"}],["path",{d:"M14 8v7",key:"3a1oy3"}],["path",{d:"M18 5v13",key:"123xd1"}],["path",{d:"M22 10v3",key:"154ddg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C2=i("AudioWaveform",[["path",{d:"M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2",key:"57tc96"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S2=i("Award",[["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}],["path",{d:"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11",key:"em7aur"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I2=i("Axe",[["path",{d:"m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9",key:"csbz4o"}],["path",{d:"M15 13 9 7l4-4 6 6h3a8 8 0 0 1-7 7z",key:"113wfo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kn=i("Axis3d",[["path",{d:"M4 4v16h16",key:"1s015l"}],["path",{d:"m4 20 7-7",key:"17qe9y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ga=i("Baby",[["path",{d:"M9 12h.01",key:"157uk2"}],["path",{d:"M15 12h.01",key:"1k8ypt"}],["path",{d:"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5",key:"1u7htd"}],["path",{d:"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",key:"5yv0yz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j2=i("Backpack",[["path",{d:"M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z",key:"wvr1b5"}],["path",{d:"M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",key:"donm21"}],["path",{d:"M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5",key:"xk3gvk"}],["path",{d:"M8 10h8",key:"c7uz4u"}],["path",{d:"M8 18h8",key:"1no2b1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P2=i("BadgeAlert",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b2=i("BadgeCent",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M12 7v10",key:"jspqdw"}],["path",{d:"M15.4 10a4 4 0 1 0 0 4",key:"2eqtx8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fn=i("BadgeCheck",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A2=i("BadgeDollarSign",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 18V6",key:"zqpxq5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z2=i("BadgeEuro",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M7 12h5",key:"gblrwe"}],["path",{d:"M15 9.4a4 4 0 1 0 0 5.2",key:"1makmb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V2=i("BadgeHelp",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["line",{x1:"12",x2:"12.01",y1:"17",y2:"17",key:"io3f8k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H2=i("BadgeIndianRupee",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M8 8h8",key:"1bis0t"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m13 17-5-1h1a4 4 0 0 0 0-8",key:"nu2bwa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T2=i("BadgeInfo",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"12",x2:"12",y1:"16",y2:"12",key:"1y1yb1"}],["line",{x1:"12",x2:"12.01",y1:"8",y2:"8",key:"110wyk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q2=i("BadgeJapaneseYen",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 8 3 3v7",key:"17yadx"}],["path",{d:"m12 11 3-3",key:"p4cfq1"}],["path",{d:"M9 12h6",key:"1c52cq"}],["path",{d:"M9 16h6",key:"8wimt3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D2=i("BadgeMinus",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F2=i("BadgePercent",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 15h.01",key:"lqbp3k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R2=i("BadgePlus",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"12",x2:"12",y1:"8",y2:"16",key:"10p56q"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B2=i("BadgePoundSterling",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M8 12h4",key:"qz6y1c"}],["path",{d:"M10 16V9.5a2.5 2.5 0 0 1 5 0",key:"3mlbjk"}],["path",{d:"M8 16h7",key:"sbedsn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N2=i("BadgeRussianRuble",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M9 16h5",key:"1syiyw"}],["path",{d:"M9 12h5a2 2 0 1 0 0-4h-3v9",key:"1ge9c1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E2=i("BadgeSwissFranc",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M11 17V8h4",key:"1bfq6y"}],["path",{d:"M11 12h3",key:"2eqnfz"}],["path",{d:"M9 16h4",key:"1skf3a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O2=i("BadgeX",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["line",{x1:"15",x2:"9",y1:"9",y2:"15",key:"f7djnv"}],["line",{x1:"9",x2:"15",y1:"9",y2:"15",key:"1shsy8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U2=i("Badge",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z2=i("BaggageClaim",[["path",{d:"M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2",key:"4irg2o"}],["path",{d:"M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10",key:"14fcyx"}],["rect",{width:"13",height:"8",x:"8",y:"6",rx:"1",key:"o6oiis"}],["circle",{cx:"18",cy:"20",r:"2",key:"t9985n"}],["circle",{cx:"9",cy:"20",r:"2",key:"e5v82j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _2=i("Ban",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m4.9 4.9 14.2 14.2",key:"1m5liu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W2=i("Banana",[["path",{d:"M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5",key:"1cscit"}],["path",{d:"M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z",key:"1y1nbv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G2=i("Banknote",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M6 12h.01M18 12h.01",key:"113zkx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $2=i("BarChart2",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X2=i("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K2=i("BarChart4",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M13 17V9",key:"1fwyjl"}],["path",{d:"M18 17V5",key:"sfb6ij"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q2=i("BarChartBig",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["rect",{width:"4",height:"7",x:"7",y:"10",rx:"1",key:"14u6mf"}],["rect",{width:"4",height:"12",x:"15",y:"5",rx:"1",key:"b3pek6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y2=i("BarChartHorizontalBig",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["rect",{width:"12",height:"4",x:"7",y:"5",rx:"1",key:"936jl1"}],["rect",{width:"7",height:"4",x:"7",y:"13",rx:"1",key:"jqfkpy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J2=i("BarChartHorizontal",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M7 16h8",key:"srdodz"}],["path",{d:"M7 11h12",key:"127s9w"}],["path",{d:"M7 6h3",key:"w9rmul"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const es=i("BarChart",[["line",{x1:"12",x2:"12",y1:"20",y2:"10",key:"1vz5eb"}],["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["line",{x1:"6",x2:"6",y1:"20",y2:"16",key:"hq0ia6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ts=i("Barcode",[["path",{d:"M3 5v14",key:"1nt18q"}],["path",{d:"M8 5v14",key:"1ybrkv"}],["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"M17 5v14",key:"ycjyhj"}],["path",{d:"M21 5v14",key:"nzette"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ns=i("Baseline",[["path",{d:"M4 20h16",key:"14thso"}],["path",{d:"m6 16 6-12 6 12",key:"1b4byz"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const as=i("Bath",[["path",{d:"M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",key:"1r8yf5"}],["line",{x1:"10",x2:"8",y1:"5",y2:"7",key:"h5g8z4"}],["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}],["line",{x1:"7",x2:"7",y1:"19",y2:"21",key:"16jp00"}],["line",{x1:"17",x2:"17",y1:"19",y2:"21",key:"1pxrnk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const is=i("BatteryCharging",[["path",{d:"M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2",key:"1sdynx"}],["path",{d:"M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1",key:"1gkd3k"}],["path",{d:"m11 7-3 5h4l-3 5",key:"b4a64w"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rs=i("BatteryFull",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}],["line",{x1:"6",x2:"6",y1:"11",y2:"13",key:"1wd6dw"}],["line",{x1:"10",x2:"10",y1:"11",y2:"13",key:"haxvl5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"13",key:"c6fn6x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const os=i("BatteryLow",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}],["line",{x1:"6",x2:"6",y1:"11",y2:"13",key:"1wd6dw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ss=i("BatteryMedium",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}],["line",{x1:"6",x2:"6",y1:"11",y2:"13",key:"1wd6dw"}],["line",{x1:"10",x2:"10",y1:"11",y2:"13",key:"haxvl5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cs=i("BatteryWarning",[["path",{d:"M14 7h2a2 2 0 0 1 2 2v6c0 1-1 2-2 2h-2",key:"1if82c"}],["path",{d:"M6 7H4a2 2 0 0 0-2 2v6c0 1 1 2 2 2h2",key:"2pdlyl"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}],["line",{x1:"10",x2:"10",y1:"7",y2:"13",key:"1uzyus"}],["line",{x1:"10",x2:"10",y1:"17",y2:"17.01",key:"1y8k4g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ls=i("Battery",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ds=i("Beaker",[["path",{d:"M4.5 3h15",key:"c7n0jr"}],["path",{d:"M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3",key:"m1uhx7"}],["path",{d:"M6 14h12",key:"4cwo0f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hs=i("BeanOff",[["path",{d:"M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1",key:"bq3udt"}],["path",{d:"M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66",key:"17ccse"}],["path",{d:"M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04",key:"18zqgq"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const us=i("Bean",[["path",{d:"M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z",key:"1tvzk7"}],["path",{d:"M5.341 10.62a4 4 0 1 0 5.279-5.28",key:"2cyri2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ys=i("BedDouble",[["path",{d:"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",key:"1k78r4"}],["path",{d:"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",key:"fb3tl2"}],["path",{d:"M12 4v6",key:"1dcgq2"}],["path",{d:"M2 18h20",key:"ajqnye"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ps=i("BedSingle",[["path",{d:"M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8",key:"1wm6mi"}],["path",{d:"M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4",key:"4k93s5"}],["path",{d:"M3 18h18",key:"1h113x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ks=i("Bed",[["path",{d:"M2 4v16",key:"vw9hq8"}],["path",{d:"M2 8h18a2 2 0 0 1 2 2v10",key:"1dgv2r"}],["path",{d:"M2 17h20",key:"18nfp3"}],["path",{d:"M6 8v9",key:"1yriud"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fs=i("Beef",[["circle",{cx:"12.5",cy:"8.5",r:"2.5",key:"9738u8"}],["path",{d:"M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z",key:"o0f6za"}],["path",{d:"m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5",key:"k7p6i0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ms=i("Beer",[["path",{d:"M17 11h1a3 3 0 0 1 0 6h-1",key:"1yp76v"}],["path",{d:"M9 12v6",key:"1u1cab"}],["path",{d:"M13 12v6",key:"1sugkk"}],["path",{d:"M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z",key:"1510fo"}],["path",{d:"M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8",key:"19jb7n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gs=i("BellDot",[["path",{d:"M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3",key:"xcehk"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["circle",{cx:"18",cy:"8",r:"3",key:"1g0gzu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vs=i("BellElectric",[["path",{d:"M18.8 4A6.3 8.7 0 0 1 20 9",key:"xve1fh"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["circle",{cx:"9",cy:"9",r:"7",key:"p2h5vp"}],["rect",{width:"10",height:"6",x:"4",y:"16",rx:"2",key:"17f3te"}],["path",{d:"M14 19c3 0 4.6-1.6 4.6-1.6",key:"n7odp6"}],["circle",{cx:"20",cy:"16",r:"2",key:"1v9bxh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xs=i("BellMinus",[["path",{d:"M18.4 12c.8 3.8 2.6 5 2.6 5H3s3-2 3-9c0-3.3 2.7-6 6-6 1.8 0 3.4.8 4.5 2",key:"eck70s"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"M15 8h6",key:"8ybuxh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ms=i("BellOff",[["path",{d:"M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5",key:"o7mx20"}],["path",{d:"M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7",key:"16f1lm"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ws=i("BellPlus",[["path",{d:"M19.3 14.8C20.1 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 1 0 1.9.2 2.8.7",key:"guizqy"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"M15 8h6",key:"8ybuxh"}],["path",{d:"M18 5v6",key:"g5ayrv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ls=i("BellRing",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cs=i("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ss=i("Bike",[["circle",{cx:"18.5",cy:"17.5",r:"3.5",key:"15x4ox"}],["circle",{cx:"5.5",cy:"17.5",r:"3.5",key:"1noe27"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["path",{d:"M12 17.5V14l-3-3 4-3 2 3h2",key:"1npguv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Is=i("Binary",[["rect",{x:"14",y:"14",width:"4",height:"6",rx:"2",key:"p02svl"}],["rect",{x:"6",y:"4",width:"4",height:"6",rx:"2",key:"xm4xkj"}],["path",{d:"M6 20h4",key:"1i6q5t"}],["path",{d:"M14 10h4",key:"ru81e7"}],["path",{d:"M6 14h2v6",key:"16z9wg"}],["path",{d:"M14 4h2v6",key:"1idq9u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const js=i("Biohazard",[["circle",{cx:"12",cy:"11.9",r:"2",key:"e8h31w"}],["path",{d:"M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6",key:"17bolr"}],["path",{d:"m8.9 10.1 1.4.8",key:"15ezny"}],["path",{d:"M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5",key:"wtwa5u"}],["path",{d:"m15.1 10.1-1.4.8",key:"1r0b28"}],["path",{d:"M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2",key:"m7qszh"}],["path",{d:"M12 13.9v1.6",key:"zfyyim"}],["path",{d:"M13.5 5.4c-1-.2-2-.2-3 0",key:"1bi9q0"}],["path",{d:"M17 16.4c.7-.7 1.2-1.6 1.5-2.5",key:"1rhjqw"}],["path",{d:"M5.5 13.9c.3.9.8 1.8 1.5 2.5",key:"8gsud3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ps=i("Bird",[["path",{d:"M16 7h.01",key:"1kdx03"}],["path",{d:"M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20",key:"oj1oa8"}],["path",{d:"m20 7 2 .5-2 .5",key:"12nv4d"}],["path",{d:"M10 18v3",key:"1yea0a"}],["path",{d:"M14 17.75V21",key:"1pymcb"}],["path",{d:"M7 18a6 6 0 0 0 3.84-10.61",key:"1npnn0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bs=i("Bitcoin",[["path",{d:"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",key:"yr8idg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const As=i("Blinds",[["path",{d:"M3 3h18",key:"o7r712"}],["path",{d:"M20 7H8",key:"gd2fo2"}],["path",{d:"M20 11H8",key:"1ynp89"}],["path",{d:"M10 19h10",key:"19hjk5"}],["path",{d:"M8 15h12",key:"1yqzne"}],["path",{d:"M4 3v14",key:"fggqzn"}],["circle",{cx:"4",cy:"19",r:"2",key:"p3m9r0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zs=i("Blocks",[["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["path",{d:"M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3",key:"1fpvtg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vs=i("BluetoothConnected",[["path",{d:"m7 7 10 10-5 5V2l5 5L7 17",key:"1q5490"}],["line",{x1:"18",x2:"21",y1:"12",y2:"12",key:"1rsjjs"}],["line",{x1:"3",x2:"6",y1:"12",y2:"12",key:"11yl8c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hs=i("BluetoothOff",[["path",{d:"m17 17-5 5V12l-5 5",key:"v5aci6"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M14.5 9.5 17 7l-5-5v4.5",key:"1kddfz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ts=i("BluetoothSearching",[["path",{d:"m7 7 10 10-5 5V2l5 5L7 17",key:"1q5490"}],["path",{d:"M20.83 14.83a4 4 0 0 0 0-5.66",key:"k8tn1j"}],["path",{d:"M18 12h.01",key:"yjnet6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qs=i("Bluetooth",[["path",{d:"m7 7 10 10-5 5V2l5 5L7 17",key:"1q5490"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ds=i("Bold",[["path",{d:"M14 12a4 4 0 0 0 0-8H6v8",key:"v2sylx"}],["path",{d:"M15 20a4 4 0 0 0 0-8H6v8Z",key:"1ef5ya"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fs=i("Bomb",[["circle",{cx:"11",cy:"13",r:"9",key:"hd149"}],["path",{d:"M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95",key:"jp4j1b"}],["path",{d:"m22 2-1.5 1.5",key:"ay92ug"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rs=i("Bone",[["path",{d:"M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z",key:"w610uw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bs=i("BookA",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"m8 13 4-7 4 7",key:"4rari8"}],["path",{d:"M9.1 11h5.7",key:"1gkovt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ns=i("BookAudio",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M8 8v3",key:"1qzp49"}],["path",{d:"M12 6v7",key:"1f6ttz"}],["path",{d:"M16 8v3",key:"gejaml"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Es=i("BookCheck",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"m9 9.5 2 2 4-4",key:"1dth82"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Os=i("BookCopy",[["path",{d:"M2 16V4a2 2 0 0 1 2-2h11",key:"spzkk5"}],["path",{d:"M5 14H4a2 2 0 1 0 0 4h1",key:"16gqf9"}],["path",{d:"M22 18H11a2 2 0 1 0 0 4h11V6H11a2 2 0 0 0-2 2v12",key:"1owzki"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mn=i("BookDashed",[["path",{d:"M20 22h-2",key:"1rpnb6"}],["path",{d:"M20 15v2h-2",key:"fph276"}],["path",{d:"M4 19.5V15",key:"6gr39e"}],["path",{d:"M20 8v3",key:"deu0bs"}],["path",{d:"M18 2h2v2",key:"180o53"}],["path",{d:"M4 11V9",key:"v3xsx8"}],["path",{d:"M12 2h2",key:"cvn524"}],["path",{d:"M12 22h2",key:"kn7ki6"}],["path",{d:"M12 17h2",key:"13u4lk"}],["path",{d:"M8 22H6.5a2.5 2.5 0 0 1 0-5H8",key:"fiseg2"}],["path",{d:"M4 5v-.5A2.5 2.5 0 0 1 6.5 2H8",key:"wywhs9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Us=i("BookDown",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"m9 10 3 3 3-3",key:"zt5b4y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zs=i("BookHeadphones",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["path",{d:"M8 12v-2a4 4 0 0 1 8 0v2",key:"1vsqkj"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _s=i("BookHeart",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M16 8.2C16 7 15 6 13.8 6c-.8 0-1.4.3-1.8.9-.4-.6-1-.9-1.8-.9C9 6 8 7 8 8.2c0 .6.3 1.2.7 1.6h0C10 11.1 12 13 12 13s2-1.9 3.3-3.1h0c.4-.4.7-1 .7-1.7z",key:"1dlbw1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ws=i("BookImage",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["circle",{cx:"10",cy:"8",r:"2",key:"2qkj4p"}],["path",{d:"m20 13.7-2.1-2.1c-.8-.8-2-.8-2.8 0L9.7 17",key:"160say"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gs=i("BookKey",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H14",key:"1gfsgw"}],["path",{d:"M20 8v14H6.5a2.5 2.5 0 0 1 0-5H20",key:"zb0ngp"}],["circle",{cx:"14",cy:"8",r:"2",key:"u49eql"}],["path",{d:"m20 2-4.5 4.5",key:"1sppr8"}],["path",{d:"m19 3 1 1",key:"ze14oc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $s=i("BookLock",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10",key:"18wgow"}],["path",{d:"M20 15v7H6.5a2.5 2.5 0 0 1 0-5H20",key:"dpch1j"}],["rect",{width:"8",height:"5",x:"12",y:"6",rx:"1",key:"9nqwug"}],["path",{d:"M18 6V4a2 2 0 1 0-4 0v2",key:"1aquzs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xs=i("BookMarked",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["polyline",{points:"10 2 10 10 13 7 16 10 16 2",key:"13o6vz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ks=i("BookMinus",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M9 10h6",key:"9gxzsh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qs=i("BookOpenCheck",[["path",{d:"M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4Z",key:"1i8u0n"}],["path",{d:"m16 12 2 2 4-4",key:"mdajum"}],["path",{d:"M22 6V3h-6c-2.2 0-4 1.8-4 4v14c0-1.7 1.3-3 3-3h7v-2.3",key:"jb5l51"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ys=i("BookOpenText",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}],["path",{d:"M6 8h2",key:"30oboj"}],["path",{d:"M6 12h2",key:"32wvfc"}],["path",{d:"M16 8h2",key:"msurwy"}],["path",{d:"M16 12h2",key:"7q9ll5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $a=i("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Js=i("BookPlus",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M9 10h6",key:"9gxzsh"}],["path",{d:"M12 7v6",key:"lw1j43"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ec=i("BookText",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M8 7h6",key:"1f0q6e"}],["path",{d:"M8 11h8",key:"vwpz6n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tc=i("BookType",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M16 8V6H8v2",key:"x8j6u4"}],["path",{d:"M12 6v7",key:"1f6ttz"}],["path",{d:"M10 13h4",key:"ytezjc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nc=i("BookUp2",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2",key:"1lorq7"}],["path",{d:"M18 2h2v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"1nfm9i"}],["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}],["path",{d:"m9 5 3-3 3 3",key:"l8vdw6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ac=i("BookUp",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ic=i("BookUser",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M15 13a3 3 0 1 0-6 0",key:"10j68g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rc=i("BookX",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}],["path",{d:"m14.5 7-5 5",key:"dy991v"}],["path",{d:"m9.5 7 5 5",key:"s45iea"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oc=i("Book",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",key:"t4utmx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sc=i("BookmarkCheck",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",key:"169p4p"}],["path",{d:"m9 10 2 2 4-4",key:"1gnqz4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cc=i("BookmarkMinus",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}],["line",{x1:"15",x2:"9",y1:"10",y2:"10",key:"1gty7f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lc=i("BookmarkPlus",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}],["line",{x1:"12",x2:"12",y1:"7",y2:"13",key:"1cppfj"}],["line",{x1:"15",x2:"9",y1:"10",y2:"10",key:"1gty7f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dc=i("BookmarkX",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",key:"169p4p"}],["path",{d:"m14.5 7.5-5 5",key:"3lb6iw"}],["path",{d:"m9.5 7.5 5 5",key:"ko136h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hc=i("Bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uc=i("BoomBox",[["path",{d:"M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",key:"vvzvr1"}],["path",{d:"M8 8v1",key:"xcqmfk"}],["path",{d:"M12 8v1",key:"1rj8u4"}],["path",{d:"M16 8v1",key:"1q12zr"}],["rect",{width:"20",height:"12",x:"2",y:"9",rx:"2",key:"igpb89"}],["circle",{cx:"8",cy:"15",r:"2",key:"fa4a8s"}],["circle",{cx:"16",cy:"15",r:"2",key:"14c3ya"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yc=i("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pc=i("BoxSelect",[["path",{d:"M5 3a2 2 0 0 0-2 2",key:"y57alp"}],["path",{d:"M19 3a2 2 0 0 1 2 2",key:"18rm91"}],["path",{d:"M21 19a2 2 0 0 1-2 2",key:"1j7049"}],["path",{d:"M5 21a2 2 0 0 1-2-2",key:"sbafld"}],["path",{d:"M9 3h1",key:"1yesri"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 3h1",key:"1ec4yj"}],["path",{d:"M14 21h1",key:"v9vybs"}],["path",{d:"M3 9v1",key:"1r0deq"}],["path",{d:"M21 9v1",key:"mxsmne"}],["path",{d:"M3 14v1",key:"vnatye"}],["path",{d:"M21 14v1",key:"169vum"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kc=i("Box",[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fc=i("Boxes",[["path",{d:"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",key:"lc1i9w"}],["path",{d:"m7 16.5-4.74-2.85",key:"1o9zyk"}],["path",{d:"m7 16.5 5-3",key:"va8pkn"}],["path",{d:"M7 16.5v5.17",key:"jnp8gn"}],["path",{d:"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",key:"8zsnat"}],["path",{d:"m17 16.5-5-3",key:"8arw3v"}],["path",{d:"m17 16.5 4.74-2.85",key:"8rfmw"}],["path",{d:"M17 16.5v5.17",key:"k6z78m"}],["path",{d:"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",key:"1xygjf"}],["path",{d:"M12 8 7.26 5.15",key:"1vbdud"}],["path",{d:"m12 8 4.74-2.85",key:"3rx089"}],["path",{d:"M12 13.5V8",key:"1io7kd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gn=i("Braces",[["path",{d:"M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",key:"ezmyqa"}],["path",{d:"M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",key:"e1hn23"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mc=i("Brackets",[["path",{d:"M16 3h3v18h-3",key:"1yor1f"}],["path",{d:"M8 21H5V3h3",key:"1qrfwo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gc=i("BrainCircuit",[["path",{d:"M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z",key:"ixwj2a"}],["path",{d:"M16 8V5c0-1.1.9-2 2-2",key:"13dx7u"}],["path",{d:"M12 13h4",key:"1ku699"}],["path",{d:"M12 18h6a2 2 0 0 1 2 2v1",key:"105ag5"}],["path",{d:"M12 8h8",key:"1lhi5i"}],["path",{d:"M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",key:"1s25gz"}],["path",{d:"M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",key:"127460"}],["path",{d:"M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",key:"fys062"}],["path",{d:"M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",key:"1vib61"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vc=i("BrainCog",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5",key:"1f4le0"}],["path",{d:"m15.7 10.4-.9.4",key:"ayzo6p"}],["path",{d:"m9.2 13.2-.9.4",key:"1uzb3g"}],["path",{d:"m13.6 15.7-.4-.9",key:"11ifqf"}],["path",{d:"m10.8 9.2-.4-.9",key:"1pmk2v"}],["path",{d:"m15.7 13.5-.9-.4",key:"7ng02m"}],["path",{d:"m9.2 10.9-.9-.4",key:"1x66zd"}],["path",{d:"m10.5 15.7.4-.9",key:"3js94g"}],["path",{d:"m13.1 9.2.4-.9",key:"18n7mc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xc=i("Brain",[["path",{d:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z",key:"1mhkh5"}],["path",{d:"M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z",key:"1d6s00"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mc=i("BrickWall",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 9v6",key:"199k2o"}],["path",{d:"M16 15v6",key:"8rj2es"}],["path",{d:"M16 3v6",key:"1j6rpj"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M8 15v6",key:"1stoo3"}],["path",{d:"M8 3v6",key:"vlvjmk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wc=i("Briefcase",[["rect",{width:"20",height:"14",x:"2",y:"7",rx:"2",ry:"2",key:"eto64e"}],["path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"zwj3tp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lc=i("BringToFront",[["rect",{x:"8",y:"8",width:"8",height:"8",rx:"2",key:"yj20xf"}],["path",{d:"M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2",key:"1ltk23"}],["path",{d:"M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2",key:"1q24h9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cc=i("Brush",[["path",{d:"m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08",key:"1styjt"}],["path",{d:"M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z",key:"z0l1mu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sc=i("BugOff",[["path",{d:"M15 7.13V6a3 3 0 0 0-5.14-2.1L8 2",key:"vl8zik"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M22 13h-4v-2a4 4 0 0 0-4-4h-1.3",key:"1ou0bd"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M7.7 7.7A4 4 0 0 0 6 11v3a6 6 0 0 0 11.13 3.13",key:"1njkjs"}],["path",{d:"M12 20v-8",key:"i3yub9"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ic=i("BugPlay",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M18 11a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v3a6.1 6.1 0 0 0 2 4.5",key:"1tjixy"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"m12 12 8 5-8 5Z",key:"1ydf81"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jc=i("Bug",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pc=i("Building2",[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bc=i("Building",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["path",{d:"M9 22v-4h6v4",key:"r93iot"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ac=i("BusFront",[["path",{d:"M4 6 2 7",key:"1mqr15"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"m22 7-2-1",key:"1umjhc"}],["rect",{width:"16",height:"16",x:"4",y:"3",rx:"2",key:"1wxw4b"}],["path",{d:"M4 11h16",key:"mpoxn0"}],["path",{d:"M8 15h.01",key:"a7atzg"}],["path",{d:"M16 15h.01",key:"rnfrdf"}],["path",{d:"M6 19v2",key:"1loha6"}],["path",{d:"M18 21v-2",key:"sqyl04"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zc=i("Bus",[["path",{d:"M8 6v6",key:"18i7km"}],["path",{d:"M15 6v6",key:"1sg6z9"}],["path",{d:"M2 12h19.6",key:"de5uta"}],["path",{d:"M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",key:"1wwztk"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}],["path",{d:"M9 18h5",key:"lrx6i"}],["circle",{cx:"16",cy:"18",r:"2",key:"1v4tcr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vc=i("CableCar",[["path",{d:"M10 3h.01",key:"lbucoy"}],["path",{d:"M14 2h.01",key:"1k8aa1"}],["path",{d:"m2 9 20-5",key:"1kz0j5"}],["path",{d:"M12 12V6.5",key:"1vbrij"}],["rect",{width:"16",height:"10",x:"4",y:"12",rx:"3",key:"if91er"}],["path",{d:"M9 12v5",key:"3anwtq"}],["path",{d:"M15 12v5",key:"5xh3zn"}],["path",{d:"M4 17h16",key:"g4d7ey"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hc=i("Cable",[["path",{d:"M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z",key:"1s6oa5"}],["path",{d:"M3 5V3",key:"1k5hjh"}],["path",{d:"M7 5V3",key:"1t1388"}],["path",{d:"M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9",key:"1ytv72"}],["path",{d:"M17 21v-2",key:"ds4u3f"}],["path",{d:"M21 21v-2",key:"eo0ou"}],["path",{d:"M22 19h-6v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z",key:"sdz6o8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tc=i("CakeSlice",[["circle",{cx:"9",cy:"7",r:"2",key:"1305pl"}],["path",{d:"M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6",key:"xle13f"}],["path",{d:"M16 13H3",key:"1wpj08"}],["path",{d:"M16 17H3",key:"3lvfcd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qc=i("Cake",[["path",{d:"M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8",key:"1w3rig"}],["path",{d:"M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1",key:"n2jgmb"}],["path",{d:"M2 21h20",key:"1nyx9w"}],["path",{d:"M7 8v3",key:"1qtyvj"}],["path",{d:"M12 8v3",key:"hwp4zt"}],["path",{d:"M17 8v3",key:"1i6e5u"}],["path",{d:"M7 4h0.01",key:"hsw7lv"}],["path",{d:"M12 4h0.01",key:"1e3d8f"}],["path",{d:"M17 4h0.01",key:"p7cxgy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dc=i("Calculator",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fc=i("CalendarCheck2",[["path",{d:"M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"bce9hv"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"m16 20 2 2 4-4",key:"13tcca"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rc=i("CalendarCheck",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"m9 16 2 2 4-4",key:"19s6y9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bc=i("CalendarClock",[["path",{d:"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",key:"1osxxc"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M3 10h5",key:"r794hk"}],["path",{d:"M17.5 17.5 16 16.25V14",key:"re2vv1"}],["path",{d:"M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",key:"ame013"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nc=i("CalendarDays",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ec=i("CalendarHeart",[["path",{d:"M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7",key:"1sfrvf"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z",key:"1t7hil"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oc=i("CalendarMinus",[["path",{d:"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"3spt84"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["line",{x1:"16",x2:"22",y1:"19",y2:"19",key:"1g9955"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uc=i("CalendarOff",[["path",{d:"M4.18 4.18A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18",key:"1feomx"}],["path",{d:"M21 15.5V6a2 2 0 0 0-2-2H9.5",key:"yhw86o"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M3 10h7",key:"1wap6i"}],["path",{d:"M21 10h-5.5",key:"quycpq"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zc=i("CalendarPlus",[["path",{d:"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"3spt84"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["line",{x1:"19",x2:"19",y1:"16",y2:"22",key:"1ttwzi"}],["line",{x1:"16",x2:"22",y1:"19",y2:"19",key:"1g9955"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _c=i("CalendarRange",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"M17 14h-6",key:"bkmgh3"}],["path",{d:"M13 18H7",key:"bb0bb7"}],["path",{d:"M7 14h.01",key:"1qa3f1"}],["path",{d:"M17 18h.01",key:"1bdyru"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wc=i("CalendarSearch",[["path",{d:"M21 12V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7.5",key:"18ncp8"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z",key:"mgbru4"}],["path",{d:"m22 22-1.5-1.5",key:"1x83k4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gc=i("CalendarX2",[["path",{d:"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"3spt84"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["line",{x1:"17",x2:"22",y1:"17",y2:"22",key:"xa9o8b"}],["line",{x1:"17",x2:"22",y1:"22",y2:"17",key:"18nitg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $c=i("CalendarX",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["line",{x1:"10",x2:"14",y1:"14",y2:"18",key:"1g3qc0"}],["line",{x1:"14",x2:"10",y1:"14",y2:"18",key:"1az83m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m1=i("Calendar",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xc=i("CameraOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16",key:"qmtpty"}],["path",{d:"M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5",key:"1ufyfc"}],["path",{d:"M14.121 15.121A3 3 0 1 1 9.88 10.88",key:"11zox6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kc=i("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qc=i("CandlestickChart",[["path",{d:"M9 5v4",key:"14uxtq"}],["rect",{width:"4",height:"6",x:"7",y:"9",rx:"1",key:"f4fvz0"}],["path",{d:"M9 15v2",key:"r5rk32"}],["path",{d:"M17 3v2",key:"1l2re6"}],["rect",{width:"4",height:"8",x:"15",y:"5",rx:"1",key:"z38je5"}],["path",{d:"M17 13v3",key:"5l0wba"}],["path",{d:"M3 3v18h18",key:"1s2lah"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yc=i("CandyCane",[["path",{d:"M5.7 21a2 2 0 0 1-3.5-2l8.6-14a6 6 0 0 1 10.4 6 2 2 0 1 1-3.464-2 2 2 0 1 0-3.464-2Z",key:"isaq8g"}],["path",{d:"M17.75 7 15 2.1",key:"12x7e8"}],["path",{d:"M10.9 4.8 13 9",key:"100a87"}],["path",{d:"m7.9 9.7 2 4.4",key:"ntfhaj"}],["path",{d:"M4.9 14.7 7 18.9",key:"1x43jy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jc=i("CandyOff",[["path",{d:"m8.5 8.5-1 1a4.95 4.95 0 0 0 7 7l1-1",key:"1ff4ui"}],["path",{d:"M11.843 6.187A4.947 4.947 0 0 1 16.5 7.5a4.947 4.947 0 0 1 1.313 4.657",key:"1sbrv4"}],["path",{d:"M14 16.5V14",key:"1maf8j"}],["path",{d:"M14 6.5v1.843",key:"1a6u6t"}],["path",{d:"M10 10v7.5",key:"80pj65"}],["path",{d:"m16 7 1-5 1.367.683A3 3 0 0 0 19.708 3H21v1.292a3 3 0 0 0 .317 1.341L22 7l-5 1",key:"11a9mt"}],["path",{d:"m8 17-1 5-1.367-.683A3 3 0 0 0 4.292 21H3v-1.292a3 3 0 0 0-.317-1.341L2 17l5-1",key:"3mjmon"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const el=i("Candy",[["path",{d:"m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z",key:"ue6khb"}],["path",{d:"M14 6.5v10",key:"5xnk7c"}],["path",{d:"M10 7.5v10",key:"1uew51"}],["path",{d:"m16 7 1-5 1.37.68A3 3 0 0 0 19.7 3H21v1.3c0 .46.1.92.32 1.33L22 7l-5 1",key:"b9cp6k"}],["path",{d:"m8 17-1 5-1.37-.68A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.32-1.33L2 17l5-1",key:"5lney8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tl=i("CarFront",[["path",{d:"m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",key:"1imjwt"}],["path",{d:"M7 14h.01",key:"1qa3f1"}],["path",{d:"M17 14h.01",key:"7oqj8z"}],["rect",{width:"18",height:"8",x:"3",y:"10",rx:"2",key:"a7itu8"}],["path",{d:"M5 18v2",key:"ppbyun"}],["path",{d:"M19 18v2",key:"gy7782"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nl=i("CarTaxiFront",[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",key:"1imjwt"}],["path",{d:"M7 14h.01",key:"1qa3f1"}],["path",{d:"M17 14h.01",key:"7oqj8z"}],["rect",{width:"18",height:"8",x:"3",y:"10",rx:"2",key:"a7itu8"}],["path",{d:"M5 18v2",key:"ppbyun"}],["path",{d:"M19 18v2",key:"gy7782"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const al=i("Car",[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const il=i("Caravan",[["rect",{width:"4",height:"4",x:"2",y:"9",key:"1vcvhd"}],["rect",{width:"4",height:"10",x:"10",y:"9",key:"1b7ev2"}],["path",{d:"M18 19V9a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a2 2 0 0 0 2 2h2",key:"19jm3t"}],["circle",{cx:"8",cy:"19",r:"2",key:"t8fc5s"}],["path",{d:"M10 19h12v-2",key:"1yu2qx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rl=i("Carrot",[["path",{d:"M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46",key:"rfqxbe"}],["path",{d:"M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z",key:"6b25w4"}],["path",{d:"M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z",key:"fn65lo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ol=i("CaseLower",[["circle",{cx:"7",cy:"12",r:"3",key:"12clwm"}],["path",{d:"M10 9v6",key:"17i7lo"}],["circle",{cx:"17",cy:"12",r:"3",key:"gl7c2s"}],["path",{d:"M14 7v8",key:"dl84cr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sl=i("CaseSensitive",[["path",{d:"m3 15 4-8 4 8",key:"1vwr6u"}],["path",{d:"M4 13h6",key:"1r9ots"}],["circle",{cx:"18",cy:"12",r:"3",key:"1kchzo"}],["path",{d:"M21 9v6",key:"anns31"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cl=i("CaseUpper",[["path",{d:"m3 15 4-8 4 8",key:"1vwr6u"}],["path",{d:"M4 13h6",key:"1r9ots"}],["path",{d:"M15 11h4.5a2 2 0 0 1 0 4H15V7h4a2 2 0 0 1 0 4",key:"1sqfas"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ll=i("CassetteTape",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["circle",{cx:"8",cy:"10",r:"2",key:"1xl4ub"}],["path",{d:"M8 12h8",key:"1wcyev"}],["circle",{cx:"16",cy:"10",r:"2",key:"r14t7q"}],["path",{d:"m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3",key:"l01ucn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dl=i("Cast",[["path",{d:"M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6",key:"3zrzxg"}],["path",{d:"M2 12a9 9 0 0 1 8 8",key:"g6cvee"}],["path",{d:"M2 16a5 5 0 0 1 4 4",key:"1y1dii"}],["line",{x1:"2",x2:"2.01",y1:"20",y2:"20",key:"xu2jvo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hl=i("Castle",[["path",{d:"M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z",key:"109fe4"}],["path",{d:"M18 11V4H6v7",key:"mon5oj"}],["path",{d:"M15 22v-4a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3v4",key:"jdggr9"}],["path",{d:"M22 11V9",key:"3zbp94"}],["path",{d:"M2 11V9",key:"1x5rnq"}],["path",{d:"M6 4V2",key:"1rsq15"}],["path",{d:"M18 4V2",key:"1jsdo1"}],["path",{d:"M10 4V2",key:"75d9ly"}],["path",{d:"M14 4V2",key:"8nj3z6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ul=i("Cat",[["path",{d:"M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",key:"x6xyqk"}],["path",{d:"M8 14v.5",key:"1nzgdb"}],["path",{d:"M16 14v.5",key:"1lajdz"}],["path",{d:"M11.25 16.25h1.5L12 17l-.75-.75Z",key:"12kq1m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yl=i("Cctv",[["path",{d:"M7 9h.01",key:"19b3jx"}],["path",{d:"M16.75 12H22l-3.5 7-3.09-4.32",key:"1h9vqe"}],["path",{d:"M18 9.5l-4 8-10.39-5.2a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3Z",key:"q5d122"}],["path",{d:"M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15",key:"19bib8"}],["path",{d:"M2 21v-4",key:"l40lih"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pl=i("CheckCheck",[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g1=i("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kl=i("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fl=i("CheckSquare2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ml=i("CheckSquare",[["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}],["path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",key:"1jnkn4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v1=i("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gl=i("ChefHat",[["path",{d:"M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z",key:"z3ra2g"}],["line",{x1:"6",x2:"18",y1:"17",y2:"17",key:"12q60k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vl=i("Cherry",[["path",{d:"M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z",key:"cvxqlc"}],["path",{d:"M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z",key:"1ostrc"}],["path",{d:"M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12",key:"hqx58h"}],["path",{d:"M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z",key:"eykp1o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xl=i("ChevronDownCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 10-4 4-4-4",key:"894hmk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ml=i("ChevronDownSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m16 10-4 4-4-4",key:"894hmk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ra=i("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wl=i("ChevronFirst",[["path",{d:"m17 18-6-6 6-6",key:"1yerx2"}],["path",{d:"M7 6v12",key:"1p53r6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ll=i("ChevronLast",[["path",{d:"m7 18 6-6-6-6",key:"lwmzdw"}],["path",{d:"M17 6v12",key:"1o0aio"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cl=i("ChevronLeftCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m14 16-4-4 4-4",key:"ojs7w8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sl=i("ChevronLeftSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m14 16-4-4 4-4",key:"ojs7w8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Il=i("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jl=i("ChevronRightCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m10 8 4 4-4 4",key:"1wy4r4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pl=i("ChevronRightSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m10 8 4 4-4 4",key:"1wy4r4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xa=i("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bl=i("ChevronUpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m8 14 4-4 4 4",key:"fy2ptz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Al=i("ChevronUpSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m8 14 4-4 4 4",key:"fy2ptz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zl=i("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vl=i("ChevronsDownUp",[["path",{d:"m7 20 5-5 5 5",key:"13a0gw"}],["path",{d:"m7 4 5 5 5-5",key:"1kwcof"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hl=i("ChevronsDown",[["path",{d:"m7 6 5 5 5-5",key:"1lc07p"}],["path",{d:"m7 13 5 5 5-5",key:"1d48rs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tl=i("ChevronsLeftRight",[["path",{d:"m9 7-5 5 5 5",key:"j5w590"}],["path",{d:"m15 7 5 5-5 5",key:"1bl6da"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ql=i("ChevronsLeft",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dl=i("ChevronsRightLeft",[["path",{d:"m20 17-5-5 5-5",key:"30x0n2"}],["path",{d:"m4 17 5-5-5-5",key:"16spf4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fl=i("ChevronsRight",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rl=i("ChevronsUpDown",[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bl=i("ChevronsUp",[["path",{d:"m17 11-5-5-5 5",key:"e8nh98"}],["path",{d:"m17 18-5-5-5 5",key:"2avn1x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nl=i("Chrome",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["line",{x1:"21.17",x2:"12",y1:"8",y2:"8",key:"a0cw5f"}],["line",{x1:"3.95",x2:"8.54",y1:"6.06",y2:"14",key:"1kftof"}],["line",{x1:"10.88",x2:"15.46",y1:"21.94",y2:"14",key:"1ymyh8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const El=i("Church",[["path",{d:"m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2",key:"gy5gyo"}],["path",{d:"M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4",key:"cpkuc4"}],["path",{d:"M18 22V5l-6-3-6 3v17",key:"1hsnhq"}],["path",{d:"M12 7v5",key:"ma6bk"}],["path",{d:"M10 9h4",key:"u4k05v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ol=i("CigaretteOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M12 12H2v4h14",key:"91gsaq"}],["path",{d:"M22 12v4",key:"142cbu"}],["path",{d:"M18 12h-.5",key:"12ymji"}],["path",{d:"M7 12v4",key:"jqww69"}],["path",{d:"M18 8c0-2.5-2-2.5-2-5",key:"1il607"}],["path",{d:"M22 8c0-2.5-2-2.5-2-5",key:"1gah44"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ul=i("Cigarette",[["path",{d:"M18 12H2v4h16",key:"2rt1hm"}],["path",{d:"M22 12v4",key:"142cbu"}],["path",{d:"M7 12v4",key:"jqww69"}],["path",{d:"M18 8c0-2.5-2-2.5-2-5",key:"1il607"}],["path",{d:"M22 8c0-2.5-2-2.5-2-5",key:"1gah44"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zl=i("CircleDashed",[["path",{d:"M10.1 2.18a9.93 9.93 0 0 1 3.8 0",key:"1qdqn0"}],["path",{d:"M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7",key:"1bq7p6"}],["path",{d:"M21.82 10.1a9.93 9.93 0 0 1 0 3.8",key:"1rlaqf"}],["path",{d:"M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69",key:"1xk03u"}],["path",{d:"M13.9 21.82a9.94 9.94 0 0 1-3.8 0",key:"l7re25"}],["path",{d:"M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7",key:"1v18p6"}],["path",{d:"M2.18 13.9a9.93 9.93 0 0 1 0-3.8",key:"xdo6bj"}],["path",{d:"M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69",key:"1jjmaz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _l=i("CircleDollarSign",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 18V6",key:"zqpxq5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wl=i("CircleDotDashed",[["path",{d:"M10.1 2.18a9.93 9.93 0 0 1 3.8 0",key:"1qdqn0"}],["path",{d:"M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7",key:"1bq7p6"}],["path",{d:"M21.82 10.1a9.93 9.93 0 0 1 0 3.8",key:"1rlaqf"}],["path",{d:"M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69",key:"1xk03u"}],["path",{d:"M13.9 21.82a9.94 9.94 0 0 1-3.8 0",key:"l7re25"}],["path",{d:"M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7",key:"1v18p6"}],["path",{d:"M2.18 13.9a9.93 9.93 0 0 1 0-3.8",key:"xdo6bj"}],["path",{d:"M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69",key:"1jjmaz"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gl=i("CircleDot",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $l=i("CircleEllipsis",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M17 12h.01",key:"1m0b6t"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M7 12h.01",key:"eqddd0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xl=i("CircleEqual",[["path",{d:"M7 10h10",key:"1101jm"}],["path",{d:"M7 14h10",key:"1mhdw3"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kl=i("CircleOff",[["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M8.35 2.69A10 10 0 0 1 21.3 15.65",key:"1pfsoa"}],["path",{d:"M19.08 19.08A10 10 0 1 1 4.92 4.92",key:"1ablyi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vn=i("CircleSlash2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M22 2 2 22",key:"y4kqgn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ql=i("CircleSlash",[["line",{x1:"9",x2:"15",y1:"15",y2:"9",key:"1dfufj"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xn=i("CircleUserRound",[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mn=i("CircleUser",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yl=i("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jl=i("CircuitBoard",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M11 9h4a2 2 0 0 0 2-2V3",key:"1ve2rv"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"M7 21v-4a2 2 0 0 1 2-2h4",key:"1fwkro"}],["circle",{cx:"15",cy:"15",r:"2",key:"3i40o0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e0=i("Citrus",[["path",{d:"M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z",key:"4ite01"}],["path",{d:"M19.65 15.66A8 8 0 0 1 8.35 4.34",key:"1gxipu"}],["path",{d:"m14 10-5.5 5.5",key:"92pfem"}],["path",{d:"M14 17.85V10H6.15",key:"xqmtsk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t0=i("Clapperboard",[["path",{d:"M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z",key:"1tn4o7"}],["path",{d:"m6.2 5.3 3.1 3.9",key:"iuk76l"}],["path",{d:"m12.4 3.4 3.1 4",key:"6hsd6n"}],["path",{d:"M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",key:"ltgou9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n0=i("ClipboardCheck",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a0=i("ClipboardCopy",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",key:"4jdomd"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v4",key:"3hqy98"}],["path",{d:"M21 14H11",key:"1bme5i"}],["path",{d:"m15 10-4 4 4 4",key:"5dvupr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i0=i("ClipboardEdit",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z",key:"1rgxu8"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5",key:"cereej"}],["path",{d:"M4 13.5V6a2 2 0 0 1 2-2h2",key:"5ua5vh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r0=i("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o0=i("ClipboardPaste",[["path",{d:"M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z",key:"1pp7kr"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10",key:"2ik1ml"}],["path",{d:"m17 10 4 4-4 4",key:"vp2hj1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s0=i("ClipboardSignature",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5",key:"1but9f"}],["path",{d:"M16 4h2a2 2 0 0 1 1.73 1",key:"1p8n7l"}],["path",{d:"M18.42 9.61a2.1 2.1 0 1 1 2.97 2.97L16.95 17 13 18l.99-3.95 4.43-4.44Z",key:"johvi5"}],["path",{d:"M8 18h1",key:"13wk12"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c0=i("ClipboardType",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M9 12v-1h6v1",key:"iehl6m"}],["path",{d:"M11 17h2",key:"12w5me"}],["path",{d:"M12 11v6",key:"1bwqyc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l0=i("ClipboardX",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m15 11-6 6",key:"1toa9n"}],["path",{d:"m9 11 6 6",key:"wlibny"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d0=i("Clipboard",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h0=i("Clock1",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 14.5 8",key:"12zbmj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u0=i("Clock10",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 8 10",key:"atfzqc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y0=i("Clock11",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 9.5 8",key:"l5bg6f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p0=i("Clock12",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12",key:"1fub01"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k0=i("Clock2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 10",key:"1g230d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f0=i("Clock3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16.5 12",key:"1aq6pp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m0=i("Clock4",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g0=i("Clock5",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 14.5 16",key:"1pcbox"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v0=i("Clock6",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 12 16.5",key:"hb2qv6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x0=i("Clock7",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 9.5 16",key:"ka3394"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M0=i("Clock8",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 8 14",key:"tmc9b4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w0=i("Clock9",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 7.5 12",key:"1k60p0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oa=i("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L0=i("CloudCog",[["circle",{cx:"12",cy:"17",r:"3",key:"1spfwm"}],["path",{d:"M4.2 15.1A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2",key:"zaobp"}],["path",{d:"m15.7 18.4-.9-.3",key:"4qxpbn"}],["path",{d:"m9.2 15.9-.9-.3",key:"17q7o2"}],["path",{d:"m10.6 20.7.3-.9",key:"1pf4s2"}],["path",{d:"m13.1 14.2.3-.9",key:"1mnuqm"}],["path",{d:"m13.6 20.7-.4-1",key:"1jpd1m"}],["path",{d:"m10.8 14.3-.4-1",key:"17ugyy"}],["path",{d:"m8.3 18.6 1-.4",key:"s42vdx"}],["path",{d:"m14.7 15.8 1-.4",key:"2wizun"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C0=i("CloudDrizzle",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M8 19v1",key:"1dk2by"}],["path",{d:"M8 14v1",key:"84yxot"}],["path",{d:"M16 19v1",key:"v220m7"}],["path",{d:"M16 14v1",key:"g12gj6"}],["path",{d:"M12 21v1",key:"q8vafk"}],["path",{d:"M12 16v1",key:"1mx6rx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S0=i("CloudFog",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M16 17H7",key:"pygtm1"}],["path",{d:"M17 21H9",key:"1u2q02"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I0=i("CloudHail",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M16 14v2",key:"a1is7l"}],["path",{d:"M8 14v2",key:"1e9m6t"}],["path",{d:"M16 20h.01",key:"xwek51"}],["path",{d:"M8 20h.01",key:"1vjney"}],["path",{d:"M12 16v2",key:"z66u1j"}],["path",{d:"M12 22h.01",key:"1urd7a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j0=i("CloudLightning",[["path",{d:"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",key:"1cez44"}],["path",{d:"m13 12-3 5h4l-3 5",key:"1t22er"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P0=i("CloudMoonRain",[["path",{d:"M10.083 9A6.002 6.002 0 0 1 16 4a4.243 4.243 0 0 0 6 6c0 2.22-1.206 4.16-3 5.197",key:"u82z8m"}],["path",{d:"M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24",key:"1qmrp3"}],["path",{d:"M11 20v2",key:"174qtz"}],["path",{d:"M7 19v2",key:"12npes"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b0=i("CloudMoon",[["path",{d:"M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z",key:"p44pc9"}],["path",{d:"M10.1 9A6 6 0 0 1 16 4a4.24 4.24 0 0 0 6 6 6 6 0 0 1-3 5.197",key:"16nha0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A0=i("CloudOff",[["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193",key:"yfwify"}],["path",{d:"M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07",key:"jlfiyv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z0=i("CloudRainWind",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"m9.2 22 3-7",key:"sb5f6j"}],["path",{d:"m9 13-3 7",key:"500co5"}],["path",{d:"m17 13-3 7",key:"8t2fiy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V0=i("CloudRain",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M16 14v6",key:"1j4efv"}],["path",{d:"M8 14v6",key:"17c4r9"}],["path",{d:"M12 16v6",key:"c8a4gj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H0=i("CloudSnow",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M8 15h.01",key:"a7atzg"}],["path",{d:"M8 19h.01",key:"puxtts"}],["path",{d:"M12 17h.01",key:"p32p05"}],["path",{d:"M12 21h.01",key:"h35vbk"}],["path",{d:"M16 15h.01",key:"rnfrdf"}],["path",{d:"M16 19h.01",key:"1vcnzz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T0=i("CloudSunRain",[["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128",key:"dpwdj0"}],["path",{d:"M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24",key:"1qmrp3"}],["path",{d:"M11 20v2",key:"174qtz"}],["path",{d:"M7 19v2",key:"12npes"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q0=i("CloudSun",[["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128",key:"dpwdj0"}],["path",{d:"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z",key:"s09mg5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D0=i("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F0=i("Cloudy",[["path",{d:"M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"gqqjvc"}],["path",{d:"M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5",key:"1p2s76"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R0=i("Clover",[["path",{d:"M16.2 3.8a2.7 2.7 0 0 0-3.81 0l-.4.38-.4-.4a2.7 2.7 0 0 0-3.82 0C6.73 4.85 6.67 6.64 8 8l4 4 4-4c1.33-1.36 1.27-3.15.2-4.2z",key:"1gxwox"}],["path",{d:"M8 8c-1.36-1.33-3.15-1.27-4.2-.2a2.7 2.7 0 0 0 0 3.81l.38.4-.4.4a2.7 2.7 0 0 0 0 3.82C4.85 17.27 6.64 17.33 8 16",key:"il7z7z"}],["path",{d:"M16 16c1.36 1.33 3.15 1.27 4.2.2a2.7 2.7 0 0 0 0-3.81l-.38-.4.4-.4a2.7 2.7 0 0 0 0-3.82C19.15 6.73 17.36 6.67 16 8",key:"15bpx2"}],["path",{d:"M7.8 20.2a2.7 2.7 0 0 0 3.81 0l.4-.38.4.4a2.7 2.7 0 0 0 3.82 0c1.06-1.06 1.12-2.85-.21-4.21l-4-4-4 4c-1.33 1.36-1.27 3.15-.2 4.2z",key:"v9mug8"}],["path",{d:"m7 17-5 5",key:"1py3mz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B0=i("Club",[["path",{d:"M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z",key:"27yuqz"}],["path",{d:"M12 17.66L12 22",key:"ogfahf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N0=i("Code2",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E0=i("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O0=i("Codepen",[["polygon",{points:"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2",key:"srzb37"}],["line",{x1:"12",x2:"12",y1:"22",y2:"15.5",key:"1t73f2"}],["polyline",{points:"22 8.5 12 15.5 2 8.5",key:"ajlxae"}],["polyline",{points:"2 15.5 12 8.5 22 15.5",key:"susrui"}],["line",{x1:"12",x2:"12",y1:"2",y2:"8.5",key:"2cldga"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U0=i("Codesandbox",[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}],["polyline",{points:"7.5 4.21 12 6.81 16.5 4.21",key:"fabo96"}],["polyline",{points:"7.5 19.79 7.5 14.6 3 12",key:"z377f1"}],["polyline",{points:"21 12 16.5 14.6 16.5 19.79",key:"9nrev1"}],["polyline",{points:"3.27 6.96 12 12.01 20.73 6.96",key:"1180pa"}],["line",{x1:"12",x2:"12",y1:"22.08",y2:"12",key:"3z3uq6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z0=i("Coffee",[["path",{d:"M17 8h1a4 4 0 1 1 0 8h-1",key:"jx4kbh"}],["path",{d:"M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z",key:"1bxrl0"}],["line",{x1:"6",x2:"6",y1:"2",y2:"4",key:"1cr9l3"}],["line",{x1:"10",x2:"10",y1:"2",y2:"4",key:"170wym"}],["line",{x1:"14",x2:"14",y1:"2",y2:"4",key:"1c5f70"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _0=i("Cog",[["path",{d:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",key:"sobvz5"}],["path",{d:"M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",key:"11i496"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 22v-2",key:"1osdcq"}],["path",{d:"m17 20.66-1-1.73",key:"eq3orb"}],["path",{d:"M11 10.27 7 3.34",key:"16pf9h"}],["path",{d:"m20.66 17-1.73-1",key:"sg0v6f"}],["path",{d:"m3.34 7 1.73 1",key:"1ulond"}],["path",{d:"M14 12h8",key:"4f43i9"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"m20.66 7-1.73 1",key:"1ow05n"}],["path",{d:"m3.34 17 1.73-1",key:"nuk764"}],["path",{d:"m17 3.34-1 1.73",key:"2wel8s"}],["path",{d:"m11 13.73-4 6.93",key:"794ttg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W0=i("Coins",[["circle",{cx:"8",cy:"8",r:"6",key:"3yglwk"}],["path",{d:"M18.09 10.37A6 6 0 1 1 10.34 18",key:"t5s6rm"}],["path",{d:"M7 6h1v4",key:"1obek4"}],["path",{d:"m16.71 13.88.7.71-2.82 2.82",key:"1rbuyh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wn=i("Columns2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 3v18",key:"108xh3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ln=i("Columns3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G0=i("Columns4",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7.5 3v18",key:"w0wo6v"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M16.5 3v18",key:"10tjh1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $0=i("Combine",[["rect",{width:"8",height:"8",x:"2",y:"2",rx:"2",key:"z1hh3n"}],["path",{d:"M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2",key:"83orz6"}],["path",{d:"M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2",key:"k86dmt"}],["path",{d:"M10 18H5c-1.7 0-3-1.3-3-3v-1",key:"6vokjl"}],["polyline",{points:"7 21 10 18 7 15",key:"1k02g0"}],["rect",{width:"8",height:"8",x:"14",y:"14",rx:"2",key:"1fa9i4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X0=i("Command",[["path",{d:"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",key:"11bfej"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K0=i("Compass",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76",key:"m9r19z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q0=i("Component",[["path",{d:"M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z",key:"1kciei"}],["path",{d:"m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z",key:"1ome0g"}],["path",{d:"M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z",key:"vbupec"}],["path",{d:"m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z",key:"16csic"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y0=i("Computer",[["rect",{width:"14",height:"8",x:"5",y:"2",rx:"2",key:"wc9tft"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",key:"w68u3i"}],["path",{d:"M6 18h2",key:"rwmk9e"}],["path",{d:"M12 18h6",key:"aqd8w3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J0=i("ConciergeBell",[["path",{d:"M2 18a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2v-2Z",key:"1co3i8"}],["path",{d:"M20 16a8 8 0 1 0-16 0",key:"1pa543"}],["path",{d:"M12 4v4",key:"1bq03y"}],["path",{d:"M10 4h4",key:"1xpv9s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ed=i("Cone",[["path",{d:"m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98",key:"53pte7"}],["ellipse",{cx:"12",cy:"19",rx:"9",ry:"3",key:"1ji25f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const td=i("Construction",[["rect",{x:"2",y:"6",width:"20",height:"8",rx:"1",key:"1estib"}],["path",{d:"M17 14v7",key:"7m2elx"}],["path",{d:"M7 14v7",key:"1cm7wv"}],["path",{d:"M17 3v3",key:"1v4jwn"}],["path",{d:"M7 3v3",key:"7o6guu"}],["path",{d:"M10 14 2.3 6.3",key:"1023jk"}],["path",{d:"m14 6 7.7 7.7",key:"1s8pl2"}],["path",{d:"m8 6 8 8",key:"hl96qh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nd=i("Contact2",[["path",{d:"M16 18a4 4 0 0 0-8 0",key:"1lzouq"}],["circle",{cx:"12",cy:"11",r:"3",key:"itu57m"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["line",{x1:"8",x2:"8",y1:"2",y2:"4",key:"1ff9gb"}],["line",{x1:"16",x2:"16",y1:"2",y2:"4",key:"1ufoma"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ad=i("Contact",[["path",{d:"M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2",key:"1mghuy"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["circle",{cx:"12",cy:"10",r:"2",key:"1yojzk"}],["line",{x1:"8",x2:"8",y1:"2",y2:"4",key:"1ff9gb"}],["line",{x1:"16",x2:"16",y1:"2",y2:"4",key:"1ufoma"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const id=i("Container",[["path",{d:"M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z",key:"1t2lqe"}],["path",{d:"M10 21.9V14L2.1 9.1",key:"o7czzq"}],["path",{d:"m10 14 11.9-6.9",key:"zm5e20"}],["path",{d:"M14 19.8v-8.1",key:"159ecu"}],["path",{d:"M18 17.5V9.4",key:"11uown"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rd=i("Contrast",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 18a6 6 0 0 0 0-12v12z",key:"j4l70d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const od=i("Cookie",[["path",{d:"M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5",key:"laymnq"}],["path",{d:"M8.5 8.5v.01",key:"ue8clq"}],["path",{d:"M16 15.5v.01",key:"14dtrp"}],["path",{d:"M12 12v.01",key:"u5ubse"}],["path",{d:"M11 17v.01",key:"1hyl5a"}],["path",{d:"M7 14v.01",key:"uct60s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sd=i("CookingPot",[["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",key:"u0tga0"}],["path",{d:"m4 8 16-4",key:"16g0ng"}],["path",{d:"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8",key:"12cejc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cd=i("CopyCheck",[["path",{d:"m12 15 2 2 4-4",key:"2c609p"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ld=i("CopyMinus",[["line",{x1:"12",x2:"18",y1:"15",y2:"15",key:"1nscbv"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dd=i("CopyPlus",[["line",{x1:"15",x2:"15",y1:"12",y2:"18",key:"1p7wdc"}],["line",{x1:"12",x2:"18",y1:"15",y2:"15",key:"1nscbv"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hd=i("CopySlash",[["line",{x1:"12",x2:"18",y1:"18",y2:"12",key:"ebkxgr"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ud=i("CopyX",[["line",{x1:"12",x2:"18",y1:"12",y2:"18",key:"1rg63v"}],["line",{x1:"12",x2:"18",y1:"18",y2:"12",key:"ebkxgr"}],["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yd=i("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pd=i("Copyleft",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.17 14.83a4 4 0 1 0 0-5.66",key:"1sveal"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kd=i("Copyright",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M14.83 14.83a4 4 0 1 1 0-5.66",key:"1i56pz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fd=i("CornerDownLeft",[["polyline",{points:"9 10 4 15 9 20",key:"r3jprv"}],["path",{d:"M20 4v7a4 4 0 0 1-4 4H4",key:"6o5b7l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const md=i("CornerDownRight",[["polyline",{points:"15 10 20 15 15 20",key:"1q7qjw"}],["path",{d:"M4 4v7a4 4 0 0 0 4 4h12",key:"z08zvw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gd=i("CornerLeftDown",[["polyline",{points:"14 15 9 20 4 15",key:"nkc4i"}],["path",{d:"M20 4h-7a4 4 0 0 0-4 4v12",key:"nbpdq2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vd=i("CornerLeftUp",[["polyline",{points:"14 9 9 4 4 9",key:"m9oyvo"}],["path",{d:"M20 20h-7a4 4 0 0 1-4-4V4",key:"1blwi3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xd=i("CornerRightDown",[["polyline",{points:"10 15 15 20 20 15",key:"axus6l"}],["path",{d:"M4 4h7a4 4 0 0 1 4 4v12",key:"wcbgct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Md=i("CornerRightUp",[["polyline",{points:"10 9 15 4 20 9",key:"1lr6px"}],["path",{d:"M4 20h7a4 4 0 0 0 4-4V4",key:"1plgdj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wd=i("CornerUpLeft",[["polyline",{points:"9 14 4 9 9 4",key:"881910"}],["path",{d:"M20 20v-7a4 4 0 0 0-4-4H4",key:"1nkjon"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ld=i("CornerUpRight",[["polyline",{points:"15 14 20 9 15 4",key:"1tbx3s"}],["path",{d:"M4 20v-7a4 4 0 0 1 4-4h12",key:"1lu4f8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cd=i("Cpu",[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"9",y:"9",width:"6",height:"6",key:"o3kz5p"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sd=i("CreativeCommons",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",key:"1ss3eq"}],["path",{d:"M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",key:"1od56t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Id=i("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jd=i("Croissant",[["path",{d:"m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z",key:"1ozxlb"}],["path",{d:"m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83",key:"ffuyb5"}],["path",{d:"M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4",key:"osnpzi"}],["path",{d:"m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2",key:"1vubaw"}],["path",{d:"M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5",key:"wxr772"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pd=i("Crop",[["path",{d:"M6 2v14a2 2 0 0 0 2 2h14",key:"ron5a4"}],["path",{d:"M18 22V8a2 2 0 0 0-2-2H2",key:"7s9ehn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bd=i("Cross",[["path",{d:"M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z",key:"1t5g7j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ad=i("Crosshair",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"22",x2:"18",y1:"12",y2:"12",key:"l9bcsi"}],["line",{x1:"6",x2:"2",y1:"12",y2:"12",key:"13hhkx"}],["line",{x1:"12",x2:"12",y1:"6",y2:"2",key:"10w3f3"}],["line",{x1:"12",x2:"12",y1:"22",y2:"18",key:"15g9kq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zd=i("Crown",[["path",{d:"m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14",key:"zkxr6b"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vd=i("Cuboid",[["path",{d:"m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z",key:"1u2ovd"}],["path",{d:"M10 22v-8L2.25 9.15",key:"11pn4q"}],["path",{d:"m10 14 11.77-6.87",key:"1kt1wh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hd=i("CupSoda",[["path",{d:"m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8",key:"8166m8"}],["path",{d:"M5 8h14",key:"pcz4l3"}],["path",{d:"M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0",key:"yjz344"}],["path",{d:"m12 8 1-6h2",key:"3ybfa4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Td=i("Currency",[["circle",{cx:"12",cy:"12",r:"8",key:"46899m"}],["line",{x1:"3",x2:"6",y1:"3",y2:"6",key:"1jkytn"}],["line",{x1:"21",x2:"18",y1:"3",y2:"6",key:"14zfjt"}],["line",{x1:"3",x2:"6",y1:"21",y2:"18",key:"iusuec"}],["line",{x1:"21",x2:"18",y1:"21",y2:"18",key:"yj2dd7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qd=i("Cylinder",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5v14a9 3 0 0 0 18 0V5",key:"aqi0yr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dd=i("DatabaseBackup",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 12a9 3 0 0 0 5 2.69",key:"1ui2ym"}],["path",{d:"M21 9.3V5",key:"6k6cib"}],["path",{d:"M3 5v14a9 3 0 0 0 6.47 2.88",key:"i62tjy"}],["path",{d:"M12 12v4h4",key:"1bxaet"}],["path",{d:"M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16",key:"1f4ei9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fd=i("DatabaseZap",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 15 21.84",key:"14ibmq"}],["path",{d:"M21 5V8",key:"1marbg"}],["path",{d:"M21 12L18 17H22L19 22",key:"zafso"}],["path",{d:"M3 12A9 3 0 0 0 14.59 14.87",key:"1y4wr8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rd=i("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bd=i("Delete",[["path",{d:"M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z",key:"1oy587"}],["line",{x1:"18",x2:"12",y1:"9",y2:"15",key:"1olkx5"}],["line",{x1:"12",x2:"18",y1:"9",y2:"15",key:"1n50pc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nd=i("Dessert",[["circle",{cx:"12",cy:"4",r:"2",key:"muu5ef"}],["path",{d:"M10.2 3.2C5.5 4 2 8.1 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4 0c0-4.9-3.5-9-8.2-9.8",key:"lfo06j"}],["path",{d:"M3.2 14.8a9 9 0 0 0 17.6 0",key:"12xarc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ed=i("Diameter",[["circle",{cx:"19",cy:"19",r:"2",key:"17f5cg"}],["circle",{cx:"5",cy:"5",r:"2",key:"1gwv83"}],["path",{d:"M6.48 3.66a10 10 0 0 1 13.86 13.86",key:"xr8kdq"}],["path",{d:"m6.41 6.41 11.18 11.18",key:"uhpjw7"}],["path",{d:"M3.66 6.48a10 10 0 0 0 13.86 13.86",key:"cldpwv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Od=i("Diamond",[["path",{d:"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",key:"1f1r0c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ud=i("Dice1",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd=i("Dice2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M15 9h.01",key:"x1ddxp"}],["path",{d:"M9 15h.01",key:"fzyn71"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _d=i("Dice3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M16 8h.01",key:"cr5u4v"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wd=i("Dice4",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M16 8h.01",key:"cr5u4v"}],["path",{d:"M8 8h.01",key:"1e4136"}],["path",{d:"M8 16h.01",key:"18s6g9"}],["path",{d:"M16 16h.01",key:"1f9h7w"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gd=i("Dice5",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M16 8h.01",key:"cr5u4v"}],["path",{d:"M8 8h.01",key:"1e4136"}],["path",{d:"M8 16h.01",key:"18s6g9"}],["path",{d:"M16 16h.01",key:"1f9h7w"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $d=i("Dice6",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M16 8h.01",key:"cr5u4v"}],["path",{d:"M16 12h.01",key:"1l6xoz"}],["path",{d:"M16 16h.01",key:"1f9h7w"}],["path",{d:"M8 8h.01",key:"1e4136"}],["path",{d:"M8 12h.01",key:"czm47f"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd=i("Dices",[["rect",{width:"12",height:"12",x:"2",y:"10",rx:"2",ry:"2",key:"6agr2n"}],["path",{d:"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",key:"1o487t"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 14h.01",key:"ssrbsk"}],["path",{d:"M15 6h.01",key:"cblpky"}],["path",{d:"M18 9h.01",key:"2061c0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kd=i("Diff",[["path",{d:"M12 3v14",key:"7cf3v8"}],["path",{d:"M5 10h14",key:"elsbfy"}],["path",{d:"M5 21h14",key:"11awu3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qd=i("Disc2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yd=i("Disc3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M6 12c0-1.7.7-3.2 1.8-4.2",key:"oqkarx"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M18 12c0 1.7-.7 3.2-1.8 4.2",key:"1eah9h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd=i("DiscAlbum",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["circle",{cx:"12",cy:"12",r:"5",key:"nd82uf"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eh=i("Disc",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const th=i("DivideCircle",[["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}],["line",{x1:"12",x2:"12",y1:"16",y2:"16",key:"aqc6ln"}],["line",{x1:"12",x2:"12",y1:"8",y2:"8",key:"1mkcni"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nh=i("DivideSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}],["line",{x1:"12",x2:"12",y1:"16",y2:"16",key:"aqc6ln"}],["line",{x1:"12",x2:"12",y1:"8",y2:"8",key:"1mkcni"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ah=i("Divide",[["circle",{cx:"12",cy:"6",r:"1",key:"1bh7o1"}],["line",{x1:"5",x2:"19",y1:"12",y2:"12",key:"13b5wn"}],["circle",{cx:"12",cy:"18",r:"1",key:"lqb9t5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ih=i("DnaOff",[["path",{d:"M15 2c-1.35 1.5-2.092 3-2.5 4.5M9 22c1.35-1.5 2.092-3 2.5-4.5",key:"sxiaad"}],["path",{d:"M2 15c3.333-3 6.667-3 10-3m10-3c-1.5 1.35-3 2.092-4.5 2.5",key:"yn4bs1"}],["path",{d:"m17 6-2.5-2.5",key:"5cdfhj"}],["path",{d:"m14 8-1.5-1.5",key:"1ohn8i"}],["path",{d:"m7 18 2.5 2.5",key:"16tu1a"}],["path",{d:"m3.5 14.5.5.5",key:"hapbhd"}],["path",{d:"m20 9 .5.5",key:"1n7z02"}],["path",{d:"m6.5 12.5 1 1",key:"cs35ky"}],["path",{d:"m16.5 10.5 1 1",key:"696xn5"}],["path",{d:"m10 16 1.5 1.5",key:"11lckj"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rh=i("Dna",[["path",{d:"M2 15c6.667-6 13.333 0 20-6",key:"1pyr53"}],["path",{d:"M9 22c1.798-1.998 2.518-3.995 2.807-5.993",key:"q3hbxp"}],["path",{d:"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993",key:"80uv8i"}],["path",{d:"m17 6-2.5-2.5",key:"5cdfhj"}],["path",{d:"m14 8-1-1",key:"15nbz5"}],["path",{d:"m7 18 2.5 2.5",key:"16tu1a"}],["path",{d:"m3.5 14.5.5.5",key:"hapbhd"}],["path",{d:"m20 9 .5.5",key:"1n7z02"}],["path",{d:"m6.5 12.5 1 1",key:"cs35ky"}],["path",{d:"m16.5 10.5 1 1",key:"696xn5"}],["path",{d:"m10 16 1.5 1.5",key:"11lckj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oh=i("Dog",[["path",{d:"M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5",key:"19br0u"}],["path",{d:"M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5",key:"11n1an"}],["path",{d:"M8 14v.5",key:"1nzgdb"}],["path",{d:"M16 14v.5",key:"1lajdz"}],["path",{d:"M11.25 16.25h1.5L12 17l-.75-.75Z",key:"12kq1m"}],["path",{d:"M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306",key:"wsu29d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sh=i("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ch=i("Donut",[["path",{d:"M20.5 10a2.5 2.5 0 0 1-2.4-3H18a2.95 2.95 0 0 1-2.6-4.4 10 10 0 1 0 6.3 7.1c-.3.2-.8.3-1.2.3",key:"19sr3x"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lh=i("DoorClosed",[["path",{d:"M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14",key:"36qu9e"}],["path",{d:"M2 20h20",key:"owomy5"}],["path",{d:"M14 12v.01",key:"xfcn54"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dh=i("DoorOpen",[["path",{d:"M13 4h3a2 2 0 0 1 2 2v14",key:"hrm0s9"}],["path",{d:"M2 20h3",key:"1gaodv"}],["path",{d:"M13 20h9",key:"s90cdi"}],["path",{d:"M10 12v.01",key:"vx6srw"}],["path",{d:"M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z",key:"199qr4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ka=i("Dot",[["circle",{cx:"12.1",cy:"12.1",r:"1",key:"18d7e5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hh=i("DownloadCloud",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M12 12v9",key:"192myk"}],["path",{d:"m8 17 4 4 4-4",key:"1ul180"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uh=i("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yh=i("DraftingCompass",[["circle",{cx:"12",cy:"5",r:"2",key:"f1ur92"}],["path",{d:"m3 21 8.02-14.26",key:"1ssaw4"}],["path",{d:"m12.99 6.74 1.93 3.44",key:"iwagvd"}],["path",{d:"M19 12c-3.87 4-10.13 4-14 0",key:"1tsu18"}],["path",{d:"m21 21-2.16-3.84",key:"vylbct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ph=i("Drama",[["path",{d:"M10 11h.01",key:"d2at3l"}],["path",{d:"M14 6h.01",key:"k028ub"}],["path",{d:"M18 6h.01",key:"1v4wsw"}],["path",{d:"M6.5 13.1h.01",key:"1748ia"}],["path",{d:"M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3",key:"172yzv"}],["path",{d:"M17.4 9.9c-.8.8-2 .8-2.8 0",key:"1obv0w"}],["path",{d:"M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7",key:"rqjl8i"}],["path",{d:"M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4",key:"1mr6wy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kh=i("Dribbble",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94",key:"hpej1"}],["path",{d:"M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32",key:"1tr44o"}],["path",{d:"M8.56 2.75c4.37 6 6 9.42 8 17.72",key:"kbh691"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fh=i("Droplet",[["path",{d:"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",key:"c7niix"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mh=i("Droplets",[["path",{d:"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",key:"1ptgy4"}],["path",{d:"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",key:"1sl1rz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gh=i("Drum",[["path",{d:"m2 2 8 8",key:"1v6059"}],["path",{d:"m22 2-8 8",key:"173r8a"}],["ellipse",{cx:"12",cy:"9",rx:"10",ry:"5",key:"liohsx"}],["path",{d:"M7 13.4v7.9",key:"1yi6u9"}],["path",{d:"M12 14v8",key:"1tn2tj"}],["path",{d:"M17 13.4v7.9",key:"eqz2v3"}],["path",{d:"M2 9v8a10 5 0 0 0 20 0V9",key:"1750ul"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vh=i("Drumstick",[["path",{d:"M15.45 15.4c-2.13.65-4.3.32-5.7-1.1-2.29-2.27-1.76-6.5 1.17-9.42 2.93-2.93 7.15-3.46 9.43-1.18 1.41 1.41 1.74 3.57 1.1 5.71-1.4-.51-3.26-.02-4.64 1.36-1.38 1.38-1.87 3.23-1.36 4.63z",key:"1o96s0"}],["path",{d:"m11.25 15.6-2.16 2.16a2.5 2.5 0 1 1-4.56 1.73 2.49 2.49 0 0 1-1.41-4.24 2.5 2.5 0 0 1 3.14-.32l2.16-2.16",key:"14vv5h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xh=i("Dumbbell",[["path",{d:"m6.5 6.5 11 11",key:"f7oqzb"}],["path",{d:"m21 21-1-1",key:"cpc6if"}],["path",{d:"m3 3 1 1",key:"d3rpuf"}],["path",{d:"m18 22 4-4",key:"1e32o6"}],["path",{d:"m2 6 4-4",key:"189tqz"}],["path",{d:"m3 10 7-7",key:"1bxui2"}],["path",{d:"m14 21 7-7",key:"16x78n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mh=i("EarOff",[["path",{d:"M6 18.5a3.5 3.5 0 1 0 7 0c0-1.57.92-2.52 2.04-3.46",key:"1qngmn"}],["path",{d:"M6 8.5c0-.75.13-1.47.36-2.14",key:"b06bma"}],["path",{d:"M8.8 3.15A6.5 6.5 0 0 1 19 8.5c0 1.63-.44 2.81-1.09 3.76",key:"g10hsz"}],["path",{d:"M12.5 6A2.5 2.5 0 0 1 15 8.5M10 13a2 2 0 0 0 1.82-1.18",key:"ygzou7"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wh=i("Ear",[["path",{d:"M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0",key:"1dfaln"}],["path",{d:"M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4",key:"1qnva7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lh=i("EggFried",[["circle",{cx:"11.5",cy:"12.5",r:"3.5",key:"1cl1mi"}],["path",{d:"M3 8c0-3.5 2.5-6 6.5-6 5 0 4.83 3 7.5 5s5 2 5 6c0 4.5-2.5 6.5-7 6.5-2.5 0-2.5 2.5-6 2.5s-7-2-7-5.5c0-3 1.5-3 1.5-5C3.5 10 3 9 3 8Z",key:"165ef9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ch=i("EggOff",[["path",{d:"M6.399 6.399C5.362 8.157 4.65 10.189 4.5 12c-.37 4.43 1.27 9.95 7.5 10 3.256-.026 5.259-1.547 6.375-3.625",key:"6et380"}],["path",{d:"M19.532 13.875A14.07 14.07 0 0 0 19.5 12c-.36-4.34-3.95-9.96-7.5-10-1.04.012-2.082.502-3.046 1.297",key:"gcdc3f"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sh=i("Egg",[["path",{d:"M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z",key:"1c39pg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ih=i("EqualNot",[["line",{x1:"5",x2:"19",y1:"9",y2:"9",key:"1nwqeh"}],["line",{x1:"5",x2:"19",y1:"15",y2:"15",key:"g8yjpy"}],["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jh=i("Equal",[["line",{x1:"5",x2:"19",y1:"9",y2:"9",key:"1nwqeh"}],["line",{x1:"5",x2:"19",y1:"15",y2:"15",key:"g8yjpy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ph=i("Eraser",[["path",{d:"m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",key:"182aya"}],["path",{d:"M22 21H7",key:"t4ddhn"}],["path",{d:"m5 11 9 9",key:"1mo9qw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bh=i("Euro",[["path",{d:"M4 10h12",key:"1y6xl8"}],["path",{d:"M4 14h9",key:"1loblj"}],["path",{d:"M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2",key:"1j6lzo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ah=i("Expand",[["path",{d:"m21 21-6-6m6 6v-4.8m0 4.8h-4.8",key:"1c15vz"}],["path",{d:"M3 16.2V21m0 0h4.8M3 21l6-6",key:"1fsnz2"}],["path",{d:"M21 7.8V3m0 0h-4.8M21 3l-6 6",key:"hawz9i"}],["path",{d:"M3 7.8V3m0 0h4.8M3 3l6 6",key:"u9ee12"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zh=i("ExternalLink",[["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}],["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["line",{x1:"10",x2:"21",y1:"14",y2:"3",key:"18c3s4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vh=i("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hh=i("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Th=i("Facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qh=i("Factory",[["path",{d:"M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"159hny"}],["path",{d:"M17 18h1",key:"uldtlt"}],["path",{d:"M12 18h1",key:"s9uhes"}],["path",{d:"M7 18h1",key:"1neino"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dh=i("Fan",[["path",{d:"M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z",key:"484a7f"}],["path",{d:"M12 12v.01",key:"u5ubse"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fh=i("FastForward",[["polygon",{points:"13 19 22 12 13 5 13 19",key:"587y9g"}],["polygon",{points:"2 19 11 12 2 5 2 19",key:"3pweh0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rh=i("Feather",[["path",{d:"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z",key:"u4sw5n"}],["line",{x1:"16",x2:"2",y1:"8",y2:"22",key:"1c47m2"}],["line",{x1:"17.5",x2:"9",y1:"15",y2:"15",key:"2fj3pr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bh=i("Fence",[["path",{d:"M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",key:"1n2rgs"}],["path",{d:"M6 8h4",key:"utf9t1"}],["path",{d:"M6 18h4",key:"12yh4b"}],["path",{d:"m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",key:"3ha7mj"}],["path",{d:"M14 8h4",key:"1r8wg2"}],["path",{d:"M14 18h4",key:"1t3kbu"}],["path",{d:"m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",key:"dfd4e2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nh=i("FerrisWheel",[["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m6.8 15-3.5 2",key:"hjy98k"}],["path",{d:"m20.7 7-3.5 2",key:"f08gto"}],["path",{d:"M6.8 9 3.3 7",key:"1aevh4"}],["path",{d:"m20.7 17-3.5-2",key:"1liqo3"}],["path",{d:"m9 22 3-8 3 8",key:"wees03"}],["path",{d:"M8 22h8",key:"rmew8v"}],["path",{d:"M18 18.7a9 9 0 1 0-12 0",key:"dhzg4g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eh=i("Figma",[["path",{d:"M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z",key:"1340ok"}],["path",{d:"M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z",key:"1hz3m3"}],["path",{d:"M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z",key:"1oz8n2"}],["path",{d:"M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z",key:"1ff65i"}],["path",{d:"M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z",key:"pdip6e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oh=i("FileArchive",[["path",{d:"M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h8.5L20 7.5V20c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6h-2",key:"1u864v"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"10",cy:"20",r:"2",key:"1xzdoj"}],["path",{d:"M10 7V6",key:"dljcrl"}],["path",{d:"M10 12v-1",key:"v7bkov"}],["path",{d:"M10 18v-2",key:"1cjy8d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uh=i("FileAudio2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v2",key:"fkyf72"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2 17v-3a4 4 0 0 1 8 0v3",key:"1ggdre"}],["circle",{cx:"9",cy:"17",r:"1",key:"bc1fq4"}],["circle",{cx:"3",cy:"17",r:"1",key:"vo6nti"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zh=i("FileAudio",[["path",{d:"M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3",key:"1013sb"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z",key:"gqt63y"}],["path",{d:"M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z",key:"cf7lqx"}],["path",{d:"M2 19v-3a6 6 0 0 1 12 0v3",key:"1acxgf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cn=i("FileAxis3d",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M8 10v8h8",key:"tlaukw"}],["path",{d:"m8 18 4-4",key:"12zab0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _h=i("FileBadge2",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["path",{d:"M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",key:"13rien"}],["path",{d:"m14 12.5 1 5.5-3-1-3 1 1-5.5",key:"14xlky"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wh=i("FileBadge",[["path",{d:"M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-6",key:"qtddq0"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",key:"u0c8gj"}],["path",{d:"M7 16.5 8 22l-3-1-3 1 1-5.5",key:"5gm2nr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gh=i("FileBarChart2",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"M8 18v-1",key:"zg0ygc"}],["path",{d:"M16 18v-3",key:"j5jt4h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $h=i("FileBarChart",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M12 18v-4",key:"q1q25u"}],["path",{d:"M8 18v-2",key:"qcmpov"}],["path",{d:"M16 18v-6",key:"15y0np"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xh=i("FileBox",[["path",{d:"M14.5 22H18a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"h7jej2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2.97 13.12c-.6.36-.97 1.02-.97 1.74v3.28c0 .72.37 1.38.97 1.74l3 1.83c.63.39 1.43.39 2.06 0l3-1.83c.6-.36.97-1.02.97-1.74v-3.28c0-.72-.37-1.38-.97-1.74l-3-1.83a1.97 1.97 0 0 0-2.06 0l-3 1.83Z",key:"f4a3oc"}],["path",{d:"m7 17-4.74-2.85",key:"etm6su"}],["path",{d:"m7 17 4.74-2.85",key:"5xuooz"}],["path",{d:"M7 17v5",key:"1yj1jh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kh=i("FileCheck2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m3 15 2 2 4-4",key:"1lhrkk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qh=i("FileCheck",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m9 15 2 2 4-4",key:"1grp1n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yh=i("FileClock",[["path",{d:"M16 22h2c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3",key:"9lo3o3"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"8",cy:"16",r:"6",key:"10v15b"}],["path",{d:"M9.5 17.5 8 16.25V14",key:"1o80t2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jh=i("FileCode2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m9 18 3-3-3-3",key:"112psh"}],["path",{d:"m5 12-3 3 3 3",key:"oke12k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eu=i("FileCode",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m10 13-2 2 2 2",key:"17smn8"}],["path",{d:"m14 17 2-2-2-2",key:"14mezr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sn=i("FileCog",[["circle",{cx:"6",cy:"13",r:"3",key:"1z65bp"}],["path",{d:"m9.7 14.4-.9-.3",key:"o1luaq"}],["path",{d:"m3.2 11.9-.9-.3",key:"qm3zk5"}],["path",{d:"m4.6 16.7.3-.9",key:"1o0ect"}],["path",{d:"m7.6 16.7-.4-1",key:"1ym8d1"}],["path",{d:"m4.8 10.3-.4-1",key:"18q26g"}],["path",{d:"m2.3 14.6 1-.4",key:"121m88"}],["path",{d:"m8.7 11.8 1-.4",key:"9meqp2"}],["path",{d:"m7.4 9.3-.3.9",key:"136qqn"}],["path",{d:"M14 2v6h6",key:"1kof46"}],["path",{d:"M4 5.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-1.5",key:"xwe04"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tu=i("FileDiff",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"M9 10h6",key:"9gxzsh"}],["path",{d:"M9 17h6",key:"r8uit2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nu=i("FileDigit",[["rect",{width:"4",height:"6",x:"2",y:"12",rx:"2",key:"jm304g"}],["path",{d:"M14 2v6h6",key:"1kof46"}],["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["path",{d:"M10 12h2v6",key:"12zw74"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const au=i("FileDown",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iu=i("FileEdit",[["path",{d:"M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5",key:"1bg6eb"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z",key:"1rgxu8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ru=i("FileHeart",[["path",{d:"M4 6V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4",key:"dba9qu"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10.29 10.7a2.43 2.43 0 0 0-2.66-.52c-.29.12-.56.3-.78.53l-.35.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L6.5 18l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z",key:"1c1fso"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ou=i("FileImage",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"10",cy:"13",r:"2",key:"6v46hv"}],["path",{d:"m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22",key:"17vly1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const su=i("FileInput",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2 15h10",key:"jfw4w8"}],["path",{d:"m9 18 3-3-3-3",key:"112psh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cu=i("FileJson2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"fq0c9t"}],["path",{d:"M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"4gibmv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lu=i("FileJson",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"1oajmo"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"mpwhp6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const du=i("FileKey2",[["path",{d:"M4 10V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4",key:"1nw5t3"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"4",cy:"16",r:"2",key:"1ehqvc"}],["path",{d:"m10 10-4.5 4.5",key:"7fwrp6"}],["path",{d:"m9 11 1 1",key:"wa6s5q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hu=i("FileKey",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["circle",{cx:"10",cy:"16",r:"2",key:"4ckbqe"}],["path",{d:"m16 10-4.5 4.5",key:"7p3ebg"}],["path",{d:"m15 11 1 1",key:"1bsyx3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uu=i("FileLineChart",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m16 13-3.5 3.5-2-2L8 17",key:"zz7yod"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yu=i("FileLock2",[["path",{d:"M4 5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4",key:"gwd2r9"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["rect",{width:"8",height:"5",x:"2",y:"13",rx:"1",key:"10y5wo"}],["path",{d:"M8 13v-2a2 2 0 1 0-4 0v2",key:"1pdxzg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pu=i("FileLock",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["rect",{width:"8",height:"6",x:"8",y:"12",rx:"1",key:"3yr8at"}],["path",{d:"M15 12v-2a3 3 0 1 0-6 0v2",key:"1nqnhw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ku=i("FileMinus2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M3 15h6",key:"4e2qda"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fu=i("FileMinus",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"9",x2:"15",y1:"15",y2:"15",key:"110plj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mu=i("FileMusic",[["circle",{cx:"14",cy:"16",r:"2",key:"1bzzi3"}],["circle",{cx:"6",cy:"18",r:"2",key:"1fncim"}],["path",{d:"M4 12.4V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-7.5",key:"skc018"}],["path",{d:"M8 18v-7.7L16 9v7",key:"1oie6o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gu=i("FileOutput",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2 15h10",key:"jfw4w8"}],["path",{d:"m5 12-3 3 3 3",key:"oke12k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vu=i("FilePieChart",[["path",{d:"M16 22h2a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3",key:"zhyrez"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M4.04 11.71a5.84 5.84 0 1 0 8.2 8.29",key:"f1t5jc"}],["path",{d:"M13.83 16A5.83 5.83 0 0 0 8 10.17V16h5.83Z",key:"7q54ec"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xu=i("FilePlus2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M3 15h6",key:"4e2qda"}],["path",{d:"M6 12v6",key:"1u72j0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mu=i("FilePlus",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"12",x2:"12",y1:"18",y2:"12",key:"1tsf04"}],["line",{x1:"9",x2:"15",y1:"15",y2:"15",key:"110plj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wu=i("FileQuestion",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["path",{d:"M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2",key:"1umxtm"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lu=i("FileScan",[["path",{d:"M20 10V7.5L14.5 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h4.5",key:"uvikde"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M16 22a2 2 0 0 1-2-2",key:"1wqh5n"}],["path",{d:"M20 22a2 2 0 0 0 2-2",key:"1l9q4k"}],["path",{d:"M20 14a2 2 0 0 1 2 2",key:"1ny6zw"}],["path",{d:"M16 14a2 2 0 0 0-2 2",key:"ceaadl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cu=i("FileSearch2",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["circle",{cx:"11.5",cy:"14.5",r:"2.5",key:"1bq0ko"}],["path",{d:"M13.25 16.25 15 18",key:"9eh8bj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Su=i("FileSearch",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3",key:"am10z3"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",key:"ychnub"}],["path",{d:"m9 18-1.5-1.5",key:"1j6qii"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iu=i("FileSignature",[["path",{d:"M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8.5L18 5.5",key:"kd5d3"}],["path",{d:"M8 18h1",key:"13wk12"}],["path",{d:"M18.42 9.61a2.1 2.1 0 1 1 2.97 2.97L16.95 17 13 18l.99-3.95 4.43-4.44Z",key:"johvi5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ju=i("FileSpreadsheet",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M14 17h2",key:"10kma7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pu=i("FileStack",[["path",{d:"M16 2v5h5",key:"kt2in0"}],["path",{d:"M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17l4 4z",key:"1km23n"}],["path",{d:"M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15",key:"16874u"}],["path",{d:"M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11",key:"k2ox98"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bu=i("FileSymlink",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v7",key:"138uzh"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m10 18 3-3-3-3",key:"18f6ys"}],["path",{d:"M4 18v-1a2 2 0 0 1 2-2h6",key:"5uz2rn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Au=i("FileTerminal",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m8 16 2-2-2-2",key:"10vzyd"}],["path",{d:"M12 18h4",key:"1wd2n7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zu=i("FileText",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"16",x2:"8",y1:"13",y2:"13",key:"14keom"}],["line",{x1:"16",x2:"8",y1:"17",y2:"17",key:"17nazh"}],["line",{x1:"10",x2:"8",y1:"9",y2:"9",key:"1a5vjj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vu=i("FileType2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M2 13v-1h6v1",key:"1dh9dg"}],["path",{d:"M4 18h2",key:"1xrofg"}],["path",{d:"M5 12v6",key:"150t9c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hu=i("FileType",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M9 13v-1h6v1",key:"1bb014"}],["path",{d:"M11 18h2",key:"12mj7e"}],["path",{d:"M12 12v6",key:"3ahymv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tu=i("FileUp",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qu=i("FileVideo2",[["path",{d:"M4 8V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4",key:"1nti49"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m10 15.5 4 2.5v-6l-4 2.5",key:"t7cp39"}],["rect",{width:"8",height:"6",x:"2",y:"12",rx:"1",key:"1a6c1e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Du=i("FileVideo",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m10 11 5 3-5 3v-6Z",key:"7ntvm4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fu=i("FileVolume2",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M11.5 13.5c.32.4.5.94.5 1.5s-.18 1.1-.5 1.5",key:"joawwx"}],["path",{d:"M15 12c.64.8 1 1.87 1 3s-.36 2.2-1 3",key:"1f2wyw"}],["path",{d:"M8 15h.01",key:"a7atzg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ru=i("FileVolume",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3",key:"am10z3"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"m7 10-3 2H2v4h2l3 2v-8Z",key:"tazg57"}],["path",{d:"M11 11c.64.8 1 1.87 1 3s-.36 2.2-1 3",key:"1yej3m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bu=i("FileWarning",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nu=i("FileX2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["path",{d:"M14 2v6h6",key:"1kof46"}],["path",{d:"m3 12.5 5 5",key:"1qls4r"}],["path",{d:"m8 12.5-5 5",key:"b853mi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eu=i("FileX",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"9.5",x2:"14.5",y1:"12.5",y2:"17.5",key:"izs6du"}],["line",{x1:"14.5",x2:"9.5",y1:"12.5",y2:"17.5",key:"1lehlj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ou=i("File",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uu=i("Files",[["path",{d:"M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z",key:"cennsq"}],["path",{d:"M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8",key:"ms809a"}],["path",{d:"M15 2v5h5",key:"qq6kwv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zu=i("Film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _u=i("FilterX",[["path",{d:"M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055",key:"1fi1da"}],["path",{d:"m22 3-5 5",key:"12jva0"}],["path",{d:"m17 3 5 5",key:"k36vhe"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sa=i("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wu=i("Fingerprint",[["path",{d:"M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4",key:"1jc9o5"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2",key:"1mxgy1"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2",key:"1fgabc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gu=i("FireExtinguisher",[["path",{d:"M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5",key:"sqyvz"}],["path",{d:"M9 18h8",key:"i7pszb"}],["path",{d:"M18 3h-3",key:"7idoqj"}],["path",{d:"M11 3a6 6 0 0 0-6 6v11",key:"1v5je3"}],["path",{d:"M5 13h4",key:"svpcxo"}],["path",{d:"M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z",key:"vsjego"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $u=i("FishOff",[["path",{d:"M18 12.47v.03m0-.5v.47m-.475 5.056A6.744 6.744 0 0 1 15 18c-3.56 0-7.56-2.53-8.5-6 .348-1.28 1.114-2.433 2.121-3.38m3.444-2.088A8.802 8.802 0 0 1 15 6c3.56 0 6.06 2.54 7 6-.309 1.14-.786 2.177-1.413 3.058",key:"1j1hse"}],["path",{d:"M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33m7.48-4.372A9.77 9.77 0 0 1 16 6.07m0 11.86a9.77 9.77 0 0 1-1.728-3.618",key:"1q46z8"}],["path",{d:"m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98M8.53 3h5.27a2 2 0 0 1 1.98 1.67l.23 1.4M2 2l20 20",key:"1407gh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xu=i("FishSymbol",[["path",{d:"M2 16s9-15 20-4C11 23 2 8 2 8",key:"h4oh4o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ku=i("Fish",[["path",{d:"M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z",key:"15baut"}],["path",{d:"M18 12v.5",key:"18hhni"}],["path",{d:"M16 17.93a9.77 9.77 0 0 1 0-11.86",key:"16dt7o"}],["path",{d:"M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33",key:"l9di03"}],["path",{d:"M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4",key:"1kjonw"}],["path",{d:"m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98",key:"1zlm23"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qu=i("FlagOff",[["path",{d:"M8 2c3 0 5 2 8 2s4-1 4-1v11",key:"9rwyz9"}],["path",{d:"M4 22V4",key:"1plyxx"}],["path",{d:"M4 15s1-1 4-1 5 2 8 2",key:"1myooe"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yu=i("FlagTriangleLeft",[["path",{d:"M17 22V2L7 7l10 5",key:"1rmf0r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ju=i("FlagTriangleRight",[["path",{d:"M7 22V2l10 5-10 5",key:"17n18y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ey=i("Flag",[["path",{d:"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z",key:"i9b6wo"}],["line",{x1:"4",x2:"4",y1:"22",y2:"15",key:"1cm3nv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ty=i("FlameKindling",[["path",{d:"M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z",key:"1ir223"}],["path",{d:"m5 22 14-4",key:"1brv4h"}],["path",{d:"m5 18 14 4",key:"lgyyje"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ny=i("Flame",[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ay=i("FlashlightOff",[["path",{d:"M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4",key:"1r120k"}],["path",{d:"M7 2h11v4c0 2-2 2-2 4v1",key:"dz1920"}],["line",{x1:"11",x2:"18",y1:"6",y2:"6",key:"bi1vpe"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iy=i("Flashlight",[["path",{d:"M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z",key:"1orkel"}],["line",{x1:"6",x2:"18",y1:"6",y2:"6",key:"1z11jq"}],["line",{x1:"12",x2:"12",y1:"12",y2:"12",key:"1f4yc1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ry=i("FlaskConicalOff",[["path",{d:"M10 10 4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-1.272-2.542",key:"59ek9y"}],["path",{d:"M10 2v2.343",key:"15t272"}],["path",{d:"M14 2v6.343",key:"sxr80q"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M7 16h9",key:"t5njau"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oy=i("FlaskConical",[["path",{d:"M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",key:"pzvekw"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sy=i("FlaskRound",[["path",{d:"M10 2v7.31",key:"5d1hyh"}],["path",{d:"M14 9.3V1.99",key:"14k4l0"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M14 9.3a6.5 6.5 0 1 1-4 0",key:"1r8fvy"}],["path",{d:"M5.52 16h12.96",key:"46hh1i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cy=i("FlipHorizontal2",[["path",{d:"m3 7 5 5-5 5V7",key:"couhi7"}],["path",{d:"m21 7-5 5 5 5V7",key:"6ouia7"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 2v2",key:"tus03m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ly=i("FlipHorizontal",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3",key:"1i73f7"}],["path",{d:"M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3",key:"saxlbk"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 2v2",key:"tus03m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dy=i("FlipVertical2",[["path",{d:"m17 3-5 5-5-5h10",key:"1ftt6x"}],["path",{d:"m17 21-5-5-5 5h10",key:"1m0wmu"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hy=i("FlipVertical",[["path",{d:"M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3",key:"14bfxa"}],["path",{d:"M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3",key:"14rx03"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uy=i("Flower2",[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",key:"3pnvol"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M12 10v12",key:"6ubwww"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z",key:"9hd38g"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z",key:"ufn41s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yy=i("Flower",[["path",{d:"M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15",key:"51z86h"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"m8 16 1.5-1.5",key:"ce6zph"}],["path",{d:"M14.5 9.5 16 8",key:"1kzrzb"}],["path",{d:"m8 8 1.5 1.5",key:"1yv88w"}],["path",{d:"M14.5 14.5 16 16",key:"12xhjh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const py=i("Focus",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ky=i("FoldHorizontal",[["path",{d:"M2 12h6",key:"1wqiqv"}],["path",{d:"M22 12h-6",key:"1eg9hc"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m19 9-3 3 3 3",key:"12ol22"}],["path",{d:"m5 15 3-3-3-3",key:"1kdhjc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fy=i("FoldVertical",[["path",{d:"M12 22v-6",key:"6o8u61"}],["path",{d:"M12 8V2",key:"1wkif3"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}],["path",{d:"m15 19-3-3-3 3",key:"e37ymu"}],["path",{d:"m15 5-3 3-3-3",key:"19d6lf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const my=i("FolderArchive",[["circle",{cx:"15",cy:"19",r:"2",key:"u2pros"}],["path",{d:"M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1",key:"1jj40k"}],["path",{d:"M15 11v-1",key:"cntcp"}],["path",{d:"M15 17v-2",key:"1279jj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gy=i("FolderCheck",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"m9 13 2 2 4-4",key:"6343dt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vy=i("FolderClock",[["circle",{cx:"16",cy:"16",r:"6",key:"qoo3c4"}],["path",{d:"M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2",key:"1urifu"}],["path",{d:"M16 14v2l1 1",key:"xth2jh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xy=i("FolderClosed",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M2 10h20",key:"1ir3d8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const In=i("FolderCog",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["path",{d:"M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.3",key:"1k8050"}],["path",{d:"m21.7 19.4-.9-.3",key:"1qgwi9"}],["path",{d:"m15.2 16.9-.9-.3",key:"1t7mvx"}],["path",{d:"m16.6 21.7.3-.9",key:"1j67ps"}],["path",{d:"m19.1 15.2.3-.9",key:"18r7jp"}],["path",{d:"m19.6 21.7-.4-1",key:"z2vh2"}],["path",{d:"m16.8 15.3-.4-1",key:"1ei7r6"}],["path",{d:"m14.3 19.6 1-.4",key:"11sv9r"}],["path",{d:"m20.7 16.8 1-.4",key:"19m87a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const My=i("FolderDot",[["path",{d:"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",key:"1fr9dc"}],["circle",{cx:"12",cy:"13",r:"1",key:"49l61u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wy=i("FolderDown",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"m15 13-3 3-3-3",key:"6j2sf0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ly=i("FolderEdit",[["path",{d:"M8.4 10.6a2.1 2.1 0 1 1 2.99 2.98L6 19l-4 1 1-3.9Z",key:"10ocjb"}],["path",{d:"M2 11.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5",key:"1h3cz8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cy=i("FolderGit2",[["path",{d:"M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5",key:"1w6njk"}],["circle",{cx:"13",cy:"12",r:"2",key:"1j92g6"}],["path",{d:"M18 19c-2.8 0-5-2.2-5-5v8",key:"pkpw2h"}],["circle",{cx:"20",cy:"19",r:"2",key:"1obnsp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sy=i("FolderGit",[["circle",{cx:"12",cy:"13",r:"2",key:"1c1ljs"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M14 13h3",key:"1dgedf"}],["path",{d:"M7 13h3",key:"1pygq7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iy=i("FolderHeart",[["path",{d:"M11 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.5",key:"6hud8k"}],["path",{d:"M13.9 17.45c-1.2-1.2-1.14-2.8-.2-3.73a2.43 2.43 0 0 1 3.44 0l.36.34.34-.34a2.43 2.43 0 0 1 3.45-.01v0c.95.95 1 2.53-.2 3.74L17.5 21Z",key:"vgq86i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jy=i("FolderInput",[["path",{d:"M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",key:"fm4g5t"}],["path",{d:"M2 13h10",key:"pgb2dq"}],["path",{d:"m9 16 3-3-3-3",key:"6m91ic"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Py=i("FolderKanban",[["path",{d:"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",key:"1fr9dc"}],["path",{d:"M8 10v4",key:"tgpxqk"}],["path",{d:"M12 10v2",key:"hh53o1"}],["path",{d:"M16 10v6",key:"1d6xys"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const by=i("FolderKey",[["circle",{cx:"16",cy:"20",r:"2",key:"1vifvg"}],["path",{d:"M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2",key:"3hgo9p"}],["path",{d:"m22 14-4.5 4.5",key:"1ef6z8"}],["path",{d:"m21 15 1 1",key:"1ejcpy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ay=i("FolderLock",[["rect",{width:"8",height:"5",x:"14",y:"17",rx:"1",key:"19aais"}],["path",{d:"M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",key:"1w6v7t"}],["path",{d:"M20 17v-2a2 2 0 1 0-4 0v2",key:"pwaxnr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zy=i("FolderMinus",[["path",{d:"M9 13h6",key:"1uhe8q"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vy=i("FolderOpenDot",[["path",{d:"m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2",key:"1nmvlm"}],["circle",{cx:"14",cy:"15",r:"1",key:"1gm4qj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hy=i("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ty=i("FolderOutput",[["path",{d:"M2 7.5V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2",key:"jm8npq"}],["path",{d:"M2 13h10",key:"pgb2dq"}],["path",{d:"m5 10-3 3 3 3",key:"1r8ie0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qy=i("FolderPlus",[["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1uhe8q"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dy=i("FolderRoot",[["path",{d:"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",key:"1fr9dc"}],["circle",{cx:"12",cy:"13",r:"2",key:"1c1ljs"}],["path",{d:"M12 15v5",key:"11xva1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fy=i("FolderSearch2",[["circle",{cx:"11.5",cy:"12.5",r:"2.5",key:"1ea5ju"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M13.3 14.3 15 16",key:"1y4v1n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ry=i("FolderSearch",[["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["path",{d:"M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1",key:"1bw5m7"}],["path",{d:"m21 21-1.5-1.5",key:"3sg1j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const By=i("FolderSymlink",[["path",{d:"M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2",key:"1or2t8"}],["path",{d:"m8 16 3-3-3-3",key:"rlqrt1"}],["path",{d:"M2 16v-1a2 2 0 0 1 2-2h6",key:"pgw8ln"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ny=i("FolderSync",[["path",{d:"M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1",key:"1rkwto"}],["path",{d:"M12 10v4h4",key:"1czhmt"}],["path",{d:"m12 14 1.5-1.5c.9-.9 2.2-1.5 3.5-1.5s2.6.6 3.5 1.5c.4.4.8 1 1 1.5",key:"25wejs"}],["path",{d:"M22 22v-4h-4",key:"1ewp4q"}],["path",{d:"m22 18-1.5 1.5c-.9.9-2.1 1.5-3.5 1.5s-2.6-.6-3.5-1.5c-.4-.4-.8-1-1-1.5",key:"vlp1j8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ey=i("FolderTree",[["path",{d:"M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",key:"hod4my"}],["path",{d:"M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",key:"w4yl2u"}],["path",{d:"M3 5a2 2 0 0 0 2 2h3",key:"f2jnh7"}],["path",{d:"M3 3v13a2 2 0 0 0 2 2h3",key:"k8epm1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oy=i("FolderUp",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"m9 13 3-3 3 3",key:"1pxg3c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uy=i("FolderX",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"m9.5 10.5 5 5",key:"ra9qjz"}],["path",{d:"m14.5 10.5-5 5",key:"l2rkpq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zy=i("Folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _y=i("Folders",[["path",{d:"M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z",key:"4u7rpt"}],["path",{d:"M2 8v11a2 2 0 0 0 2 2h14",key:"1eicx1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wy=i("Footprints",[["path",{d:"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z",key:"1dudjm"}],["path",{d:"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z",key:"l2t8xc"}],["path",{d:"M16 17h4",key:"1dejxt"}],["path",{d:"M4 13h4",key:"1bwh8b"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gy=i("Forklift",[["path",{d:"M12 12H5a2 2 0 0 0-2 2v5",key:"7zsz91"}],["circle",{cx:"13",cy:"19",r:"2",key:"wjnkru"}],["circle",{cx:"5",cy:"19",r:"2",key:"v8kfzx"}],["path",{d:"M8 19h3m5-17v17h6M6 12V7c0-1.1.9-2 2-2h3l5 5",key:"13bk1p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $y=i("FormInput",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M17 12h.01",key:"1m0b6t"}],["path",{d:"M7 12h.01",key:"eqddd0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xy=i("Forward",[["polyline",{points:"15 17 20 12 15 7",key:"1w3sku"}],["path",{d:"M4 18v-2a4 4 0 0 1 4-4h12",key:"jmiej9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ky=i("Frame",[["line",{x1:"22",x2:"2",y1:"6",y2:"6",key:"15w7dq"}],["line",{x1:"22",x2:"2",y1:"18",y2:"18",key:"1ip48p"}],["line",{x1:"6",x2:"6",y1:"2",y2:"22",key:"a2lnyx"}],["line",{x1:"18",x2:"18",y1:"2",y2:"22",key:"8vb6jd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qy=i("Framer",[["path",{d:"M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7",key:"1a2nng"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yy=i("Frown",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 16s-1.5-2-4-2-4 2-4 2",key:"epbg0q"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jy=i("Fuel",[["line",{x1:"3",x2:"15",y1:"22",y2:"22",key:"xegly4"}],["line",{x1:"4",x2:"14",y1:"9",y2:"9",key:"xcnuvu"}],["path",{d:"M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18",key:"16j0yd"}],["path",{d:"M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5",key:"8ur5zv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ep=i("Fullscreen",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["rect",{width:"10",height:"8",x:"7",y:"8",rx:"1",key:"vys8me"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tp=i("FunctionSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3",key:"m1af9g"}],["path",{d:"M9 11.2h5.7",key:"3zgcl2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const np=i("GalleryHorizontalEnd",[["path",{d:"M2 7v10",key:"a2pl2d"}],["path",{d:"M6 5v14",key:"1kq3d7"}],["rect",{width:"12",height:"18",x:"10",y:"3",rx:"2",key:"13i7bc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ap=i("GalleryHorizontal",[["path",{d:"M2 3v18",key:"pzttux"}],["rect",{width:"12",height:"18",x:"6",y:"3",rx:"2",key:"btr8bg"}],["path",{d:"M22 3v18",key:"6jf3v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ip=i("GalleryThumbnails",[["rect",{width:"18",height:"14",x:"3",y:"3",rx:"2",key:"74y24f"}],["path",{d:"M4 21h1",key:"16zlid"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 21h1",key:"v9vybs"}],["path",{d:"M19 21h1",key:"edywat"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rp=i("GalleryVerticalEnd",[["path",{d:"M7 2h10",key:"nczekb"}],["path",{d:"M5 6h14",key:"u2x4p"}],["rect",{width:"18",height:"12",x:"3",y:"10",rx:"2",key:"l0tzu3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const op=i("GalleryVertical",[["path",{d:"M3 2h18",key:"15qxfx"}],["rect",{width:"18",height:"12",x:"3",y:"6",rx:"2",key:"1439r6"}],["path",{d:"M3 22h18",key:"8prr45"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sp=i("Gamepad2",[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cp=i("Gamepad",[["line",{x1:"6",x2:"10",y1:"12",y2:"12",key:"161bw2"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"15",x2:"15.01",y1:"13",y2:"13",key:"dqpgro"}],["line",{x1:"18",x2:"18.01",y1:"11",y2:"11",key:"meh2c"}],["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jn=i("GanttChartSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 8h7",key:"kbo1nt"}],["path",{d:"M8 12h6",key:"ikassy"}],["path",{d:"M11 16h5",key:"oq65wt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lp=i("GanttChart",[["path",{d:"M8 6h10",key:"9lnwnk"}],["path",{d:"M6 12h9",key:"1g9pqf"}],["path",{d:"M11 18h7",key:"c8dzvl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dp=i("GaugeCircle",[["path",{d:"M15.6 2.7a10 10 0 1 0 5.7 5.7",key:"1e0p6d"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M13.4 10.6 19 5",key:"1kr7tw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hp=i("Gauge",[["path",{d:"m12 14 4-4",key:"9kzdfg"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0",key:"19p75a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const up=i("Gavel",[["path",{d:"m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8",key:"15492f"}],["path",{d:"m16 16 6-6",key:"vzrcl6"}],["path",{d:"m8 8 6-6",key:"18bi4p"}],["path",{d:"m9 7 8 8",key:"5jnvq1"}],["path",{d:"m21 11-8-8",key:"z4y7zo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yp=i("Gem",[["path",{d:"M6 3h12l4 6-10 13L2 9Z",key:"1pcd5k"}],["path",{d:"M11 3 8 9l4 13 4-13-3-6",key:"1fcu3u"}],["path",{d:"M2 9h20",key:"16fsjt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pp=i("Ghost",[["path",{d:"M9 10h.01",key:"qbtxuw"}],["path",{d:"M15 10h.01",key:"1qmjsl"}],["path",{d:"M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",key:"uwwb07"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kp=i("Gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fp=i("GitBranchPlus",[["path",{d:"M6 3v12",key:"qpgusn"}],["path",{d:"M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",key:"1d02ji"}],["path",{d:"M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",key:"chk6ph"}],["path",{d:"M15 6a9 9 0 0 0-9 9",key:"or332x"}],["path",{d:"M18 15v6",key:"9wciyi"}],["path",{d:"M21 18h-6",key:"139f0c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mp=i("GitBranch",[["line",{x1:"6",x2:"6",y1:"3",y2:"15",key:"17qcm7"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M18 9a9 9 0 0 1-9 9",key:"n2h4wq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pn=i("GitCommitHorizontal",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["line",{x1:"3",x2:"9",y1:"12",y2:"12",key:"1dyftd"}],["line",{x1:"15",x2:"21",y1:"12",y2:"12",key:"oup4p8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gp=i("GitCommitVertical",[["path",{d:"M12 3v6",key:"1holv5"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M12 15v6",key:"a9ows0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vp=i("GitCompareArrows",[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M12 6h5a2 2 0 0 1 2 2v7",key:"1yj91y"}],["path",{d:"m15 9-3-3 3-3",key:"1lwv8l"}],["circle",{cx:"19",cy:"18",r:"3",key:"1qljk2"}],["path",{d:"M12 18H7a2 2 0 0 1-2-2V9",key:"16sdep"}],["path",{d:"m9 15 3 3-3 3",key:"1m3kbl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xp=i("GitCompare",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M13 6h3a2 2 0 0 1 2 2v7",key:"1yeb86"}],["path",{d:"M11 18H8a2 2 0 0 1-2-2V9",key:"19pyzm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mp=i("GitFork",[["circle",{cx:"12",cy:"18",r:"3",key:"1mpf1b"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["path",{d:"M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9",key:"1uq4wg"}],["path",{d:"M12 12v3",key:"158kv8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wp=i("GitGraph",[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M5 9v6",key:"158jrl"}],["circle",{cx:"5",cy:"18",r:"3",key:"104gr9"}],["path",{d:"M12 3v18",key:"108xh3"}],["circle",{cx:"19",cy:"6",r:"3",key:"108a5v"}],["path",{d:"M16 15.7A9 9 0 0 0 19 9",key:"1e3vqb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lp=i("GitMerge",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 21V9a9 9 0 0 0 9 9",key:"7kw0sc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cp=i("GitPullRequestArrow",[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M5 9v12",key:"ih889a"}],["circle",{cx:"19",cy:"18",r:"3",key:"1qljk2"}],["path",{d:"m15 9-3-3 3-3",key:"1lwv8l"}],["path",{d:"M12 6h5a2 2 0 0 1 2 2v7",key:"1yj91y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sp=i("GitPullRequestClosed",[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 9v12",key:"1sc30k"}],["path",{d:"m21 3-6 6",key:"16nqsk"}],["path",{d:"m21 9-6-6",key:"9j17rh"}],["path",{d:"M18 11.5V15",key:"65xf6f"}],["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ip=i("GitPullRequestCreateArrow",[["circle",{cx:"5",cy:"6",r:"3",key:"1qnov2"}],["path",{d:"M5 9v12",key:"ih889a"}],["path",{d:"m15 9-3-3 3-3",key:"1lwv8l"}],["path",{d:"M12 6h5a2 2 0 0 1 2 2v3",key:"1rbwk6"}],["path",{d:"M19 15v6",key:"10aioa"}],["path",{d:"M22 18h-6",key:"1d5gi5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jp=i("GitPullRequestCreate",[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 9v12",key:"1sc30k"}],["path",{d:"M13 6h3a2 2 0 0 1 2 2v3",key:"1jb6z3"}],["path",{d:"M18 15v6",key:"9wciyi"}],["path",{d:"M21 18h-6",key:"139f0c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pp=i("GitPullRequestDraft",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M18 6V5",key:"1oao2s"}],["path",{d:"M18 11v-1",key:"11c8tz"}],["line",{x1:"6",x2:"6",y1:"9",y2:"21",key:"rroup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bp=i("GitPullRequest",[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M13 6h3a2 2 0 0 1 2 2v7",key:"1yeb86"}],["line",{x1:"6",x2:"6",y1:"9",y2:"21",key:"rroup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ap=i("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zp=i("Gitlab",[["path",{d:"m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z",key:"148pdi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vp=i("GlassWater",[["path",{d:"M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z",key:"48rfw3"}],["path",{d:"M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0",key:"mjntcy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hp=i("Glasses",[["circle",{cx:"6",cy:"15",r:"4",key:"vux9w4"}],["circle",{cx:"18",cy:"15",r:"4",key:"18o8ve"}],["path",{d:"M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2",key:"1ag4bs"}],["path",{d:"M2.5 13 5 7c.7-1.3 1.4-2 3-2",key:"1hm1gs"}],["path",{d:"M21.5 13 19 7c-.7-1.3-1.5-2-3-2",key:"1r31ai"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tp=i("Globe2",[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17",key:"1fi5u6"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"xsiumc"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qp=i("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dp=i("Goal",[["path",{d:"M12 13V2l8 4-8 4",key:"5wlwwj"}],["path",{d:"M20.55 10.23A9 9 0 1 1 8 4.94",key:"5988i3"}],["path",{d:"M8 10a5 5 0 1 0 8.9 2.02",key:"1hq7ot"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fp=i("Grab",[["path",{d:"M18 11.5V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4",key:"n5nng"}],["path",{d:"M14 10V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2",key:"185i9d"}],["path",{d:"M10 9.9V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5",key:"11pz95"}],["path",{d:"M6 14v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0",key:"16yk7l"}],["path",{d:"M18 11v0a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0",key:"nzvb1c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rp=i("GraduationCap",[["path",{d:"M22 10v6M2 10l10-5 10 5-10 5z",key:"1ef52a"}],["path",{d:"M6 12v5c3 3 9 3 12 0v-5",key:"1f75yj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bp=i("Grape",[["path",{d:"M22 5V2l-5.89 5.89",key:"1eenpo"}],["circle",{cx:"16.6",cy:"15.89",r:"3",key:"xjtalx"}],["circle",{cx:"8.11",cy:"7.4",r:"3",key:"u2fv6i"}],["circle",{cx:"12.35",cy:"11.65",r:"3",key:"i6i8g7"}],["circle",{cx:"13.91",cy:"5.85",r:"3",key:"6ye0dv"}],["circle",{cx:"18.15",cy:"10.09",r:"3",key:"snx9no"}],["circle",{cx:"6.56",cy:"13.2",r:"3",key:"17x4xg"}],["circle",{cx:"10.8",cy:"17.44",r:"3",key:"1hogw9"}],["circle",{cx:"5",cy:"19",r:"3",key:"1sn6vo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bn=i("Grid2x2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M12 3v18",key:"108xh3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=i("Grid3x3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Np=i("GripHorizontal",[["circle",{cx:"12",cy:"9",r:"1",key:"124mty"}],["circle",{cx:"19",cy:"9",r:"1",key:"1ruzo2"}],["circle",{cx:"5",cy:"9",r:"1",key:"1a8b28"}],["circle",{cx:"12",cy:"15",r:"1",key:"1e56xg"}],["circle",{cx:"19",cy:"15",r:"1",key:"1a92ep"}],["circle",{cx:"5",cy:"15",r:"1",key:"5r1jwy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ep=i("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Op=i("Grip",[["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"19",cy:"5",r:"1",key:"w8mnmm"}],["circle",{cx:"5",cy:"5",r:"1",key:"lttvr7"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}],["circle",{cx:"19",cy:"19",r:"1",key:"shf9b7"}],["circle",{cx:"5",cy:"19",r:"1",key:"bfqh0e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Up=i("Group",[["path",{d:"M3 7V5c0-1.1.9-2 2-2h2",key:"adw53z"}],["path",{d:"M17 3h2c1.1 0 2 .9 2 2v2",key:"an4l38"}],["path",{d:"M21 17v2c0 1.1-.9 2-2 2h-2",key:"144t0e"}],["path",{d:"M7 21H5c-1.1 0-2-.9-2-2v-2",key:"rtnfgi"}],["rect",{width:"7",height:"5",x:"7",y:"7",rx:"1",key:"1eyiv7"}],["rect",{width:"7",height:"5",x:"10",y:"12",rx:"1",key:"1qlmkx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zp=i("Guitar",[["path",{d:"m20 7 1.7-1.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0L17 4v3Z",key:"15ixgv"}],["path",{d:"m17 7-5.1 5.1",key:"l9guh7"}],["circle",{cx:"11.5",cy:"12.5",r:".5",key:"1evg0a"}],["path",{d:"M6 12a2 2 0 0 0 1.8-1.2l.4-.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4",key:"x9fguj"}],["path",{d:"m6 16 2 2",key:"16qmzd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _p=i("Hammer",[["path",{d:"m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9",key:"1afvon"}],["path",{d:"M17.64 15 22 10.64",key:"zsji6s"}],["path",{d:"m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91",key:"lehyy1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wp=i("HandMetal",[["path",{d:"M18 12.5V10a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4",key:"7eki13"}],["path",{d:"M14 11V9a2 2 0 1 0-4 0v2",key:"94qvcw"}],["path",{d:"M10 10.5V5a2 2 0 1 0-4 0v9",key:"m1ah89"}],["path",{d:"m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5",key:"t1skq1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x1=i("Hand",[["path",{d:"M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0",key:"aigmz7"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2",key:"1n6bmn"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8",key:"a9iiix"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"1s1gnw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gp=i("HardDriveDownload",[["path",{d:"M12 2v8",key:"1q4o3n"}],["path",{d:"m16 6-4 4-4-4",key:"6wukr"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",key:"w68u3i"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 18h.01",key:"h775k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $p=i("HardDriveUpload",[["path",{d:"m16 6-4-4-4 4",key:"13yo43"}],["path",{d:"M12 2v8",key:"1q4o3n"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",key:"w68u3i"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 18h.01",key:"h775k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xp=i("HardDrive",[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kp=i("HardHat",[["path",{d:"M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z",key:"1dej2m"}],["path",{d:"M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5",key:"1p9q5i"}],["path",{d:"M4 15v-3a6 6 0 0 1 6-6h0",key:"1uc279"}],["path",{d:"M14 6h0a6 6 0 0 1 6 6v3",key:"1j9mnm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qp=i("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yp=i("Haze",[["path",{d:"m5.2 6.2 1.4 1.4",key:"17imol"}],["path",{d:"M2 13h2",key:"13gyu8"}],["path",{d:"M20 13h2",key:"16rner"}],["path",{d:"m17.4 7.6 1.4-1.4",key:"t4xlah"}],["path",{d:"M22 17H2",key:"1gtaj3"}],["path",{d:"M22 21H2",key:"1gy6en"}],["path",{d:"M16 13a4 4 0 0 0-8 0",key:"1dyczq"}],["path",{d:"M12 5V2.5",key:"1vytko"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jp=i("HdmiPort",[["path",{d:"M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z",key:"2128wb"}],["path",{d:"M7.5 12h9",key:"1t0ckc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ek=i("Heading1",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"m17 12 3-2v8",key:"1hhhft"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tk=i("Heading2",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1",key:"9jr5yi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nk=i("Heading3",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2",key:"68ncm8"}],["path",{d:"M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2",key:"1ejuhz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ak=i("Heading4",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"M17 10v4h4",key:"13sv97"}],["path",{d:"M21 10v8",key:"1kdml4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ik=i("Heading5",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["path",{d:"M17 13v-3h4",key:"1nvgqp"}],["path",{d:"M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17",key:"2nebdn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rk=i("Heading6",[["path",{d:"M4 12h8",key:"17cfdx"}],["path",{d:"M4 18V6",key:"1rz3zl"}],["path",{d:"M12 18V6",key:"zqpxq5"}],["circle",{cx:"19",cy:"16",r:"2",key:"15mx69"}],["path",{d:"M20 10c-2 2-3 3.5-3 6",key:"f35dl0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ok=i("Heading",[["path",{d:"M6 12h12",key:"8npq4p"}],["path",{d:"M6 20V4",key:"1w1bmo"}],["path",{d:"M18 20V4",key:"o2hl4u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sk=i("Headphones",[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ck=i("HeartCrack",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"m12 13-1-1 2-2-3-3 2-2",key:"xjdxli"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lk=i("HeartHandshake",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66",key:"12sd6o"}],["path",{d:"m18 15-2-2",key:"60u0ii"}],["path",{d:"m15 18-2-2",key:"6p76be"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dk=i("HeartOff",[["line",{x1:"2",y1:"2",x2:"22",y2:"22",key:"1w4vcy"}],["path",{d:"M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35",key:"3mpagl"}],["path",{d:"M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17",key:"1gh3v3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hk=i("HeartPulse",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",key:"1uw2ng"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uk=i("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yk=i("HelpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pk=i("HelpingHand",[["path",{d:"m3 15 5.12-5.12A3 3 0 0 1 10.24 9H13a2 2 0 1 1 0 4h-2.5m4-.68 4.17-4.89a1.88 1.88 0 0 1 2.92 2.36l-4.2 5.94A3 3 0 0 1 14.96 17H9.83a2 2 0 0 0-1.42.59L7 19",key:"nitrv7"}],["path",{d:"m2 14 6 6",key:"g6j1uo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kk=i("Hexagon",[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fk=i("Highlighter",[["path",{d:"m9 11-6 6v3h9l3-3",key:"1a3l36"}],["path",{d:"m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4",key:"14a9rk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mk=i("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qa=i("Home",[["path",{d:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"y5dka4"}],["polyline",{points:"9 22 9 12 15 12 15 22",key:"e2us08"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gk=i("HopOff",[["path",{d:"M17.5 5.5C19 7 20.5 9 21 11c-1.323.265-2.646.39-4.118.226",key:"10j95a"}],["path",{d:"M5.5 17.5C7 19 9 20.5 11 21c.5-2.5.5-5-1-8.5",key:"1mqyjd"}],["path",{d:"M17.5 17.5c-2.5 0-4 0-6-1",key:"11elt5"}],["path",{d:"M20 11.5c1 1.5 2 3.5 2 4.5",key:"13ezvz"}],["path",{d:"M11.5 20c1.5 1 3.5 2 4.5 2 .5-1.5 0-3-.5-4.5",key:"1ufrz1"}],["path",{d:"M22 22c-2 0-3.5-.5-5.5-1.5",key:"1n8vbj"}],["path",{d:"M4.783 4.782C1.073 8.492 1 14.5 5 18c1-1 2-4.5 1.5-6.5 1.5 1 4 1 5.5.5M8.227 2.57C11.578 1.335 15.453 2.089 18 5c-.88.88-3.7 1.761-5.726 1.618",key:"1h85u8"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vk=i("Hop",[["path",{d:"M17.5 5.5C19 7 20.5 9 21 11c-2.5.5-5 .5-8.5-1",key:"l0z2za"}],["path",{d:"M5.5 17.5C7 19 9 20.5 11 21c.5-2.5.5-5-1-8.5",key:"1mqyjd"}],["path",{d:"M16.5 11.5c1 2 1 3.5 1 6-2.5 0-4 0-6-1",key:"10xoad"}],["path",{d:"M20 11.5c1 1.5 2 3.5 2 4.5-1.5.5-3 0-4.5-.5",key:"1a4gpx"}],["path",{d:"M11.5 20c1.5 1 3.5 2 4.5 2 .5-1.5 0-3-.5-4.5",key:"1ufrz1"}],["path",{d:"M20.5 16.5c1 2 1.5 3.5 1.5 5.5-2 0-3.5-.5-5.5-1.5",key:"1ok5d2"}],["path",{d:"M4.783 4.782C8.493 1.072 14.5 1 18 5c-1 1-4.5 2-6.5 1.5 1 1.5 1 4 .5 5.5-1.5.5-4 .5-5.5-.5C7 13.5 6 17 5 18c-4-3.5-3.927-9.508-.217-13.218Z",key:"8hlroy"}],["path",{d:"M4.5 4.5 3 3c-.184-.185-.184-.816 0-1",key:"q3aj97"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xk=i("Hotel",[["path",{d:"M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z",key:"p9z69c"}],["path",{d:"m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16",key:"1bvcvh"}],["path",{d:"M8 7h.01",key:"1vti4s"}],["path",{d:"M16 7h.01",key:"1kdx03"}],["path",{d:"M12 7h.01",key:"1ivr5q"}],["path",{d:"M12 11h.01",key:"z322tv"}],["path",{d:"M16 11h.01",key:"xkw8gn"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M10 22v-6.5m4 0V22",key:"16gs4s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mk=i("Hourglass",[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wk=i("IceCream2",[["path",{d:"M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6Zm-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0",key:"g86ewz"}],["path",{d:"M12.14 11a3.5 3.5 0 1 1 6.71 0",key:"4k3m1s"}],["path",{d:"M15.5 6.5a3.5 3.5 0 1 0-7 0",key:"zmuahr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lk=i("IceCream",[["path",{d:"m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11",key:"1v6356"}],["path",{d:"M17 7A5 5 0 0 0 7 7",key:"151p3v"}],["path",{d:"M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4",key:"1sdaij"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ck=i("ImageDown",[["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10.8",key:"sqts6f"}],["path",{d:"m21 15-3.1-3.1a2 2 0 0 0-2.814.014L6 21",key:"1h47z9"}],["path",{d:"m14 19.5 3 3v-6",key:"1x9jmo"}],["path",{d:"m17 22.5 3-3",key:"xzuz0n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sk=i("ImageMinus",[["path",{d:"M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",key:"m87ecr"}],["line",{x1:"16",x2:"22",y1:"5",y2:"5",key:"ez7e4s"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ik=i("ImageOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M10.41 10.41a2 2 0 1 1-2.83-2.83",key:"1bzlo9"}],["line",{x1:"13.5",x2:"6",y1:"13.5",y2:"21",key:"1q0aeu"}],["line",{x1:"18",x2:"21",y1:"12",y2:"15",key:"5mozeu"}],["path",{d:"M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",key:"mmje98"}],["path",{d:"M21 15V5a2 2 0 0 0-2-2H9",key:"43el77"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jk=i("ImagePlus",[["path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",key:"31hg93"}],["line",{x1:"16",x2:"22",y1:"5",y2:"5",key:"ez7e4s"}],["line",{x1:"19",x2:"19",y1:"2",y2:"8",key:"1gkr8c"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pk=i("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bk=i("Import",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m8 11 4 4 4-4",key:"1dohi6"}],["path",{d:"M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4",key:"1ywtjm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ak=i("Inbox",[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zk=i("Indent",[["polyline",{points:"3 8 7 12 3 16",key:"f3rxhf"}],["line",{x1:"21",x2:"11",y1:"12",y2:"12",key:"1fxxak"}],["line",{x1:"21",x2:"11",y1:"6",y2:"6",key:"asgu94"}],["line",{x1:"21",x2:"11",y1:"18",y2:"18",key:"13dsj7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vk=i("IndianRupee",[["path",{d:"M6 3h12",key:"ggurg9"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"m6 13 8.5 8",key:"u1kupk"}],["path",{d:"M6 13h3",key:"wdp6ag"}],["path",{d:"M9 13c6.667 0 6.667-10 0-10",key:"1nkvk2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hk=i("Infinity",[["path",{d:"M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z",key:"1z0uae"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tk=i("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qk=i("InspectionPanel",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 7h.01",key:"7u93v4"}],["path",{d:"M17 7h.01",key:"14a9sn"}],["path",{d:"M7 17h.01",key:"19xn7k"}],["path",{d:"M17 17h.01",key:"1sd3ek"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dk=i("Instagram",[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fk=i("Italic",[["line",{x1:"19",x2:"10",y1:"4",y2:"4",key:"15jd3p"}],["line",{x1:"14",x2:"5",y1:"20",y2:"20",key:"bu0au3"}],["line",{x1:"15",x2:"9",y1:"4",y2:"20",key:"uljnxc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rk=i("IterationCcw",[["path",{d:"M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h8",key:"4znkd0"}],["polyline",{points:"16 14 20 18 16 22",key:"11njsm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bk=i("IterationCw",[["path",{d:"M4 10c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8H4",key:"tuf4su"}],["polyline",{points:"8 22 4 18 8 14",key:"evkj9s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nk=i("JapaneseYen",[["path",{d:"M12 9.5V21m0-11.5L6 3m6 6.5L18 3",key:"2ej80x"}],["path",{d:"M6 15h12",key:"1hwgt5"}],["path",{d:"M6 11h12",key:"wf4gp6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ek=i("Joystick",[["path",{d:"M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z",key:"jg2n2t"}],["path",{d:"M6 15v-2",key:"gd6mvg"}],["path",{d:"M12 15V9",key:"8c7uyn"}],["circle",{cx:"12",cy:"6",r:"3",key:"1gm2ql"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const An=i("KanbanSquareDashed",[["path",{d:"M8 7v7",key:"1x2jlm"}],["path",{d:"M12 7v4",key:"xawao1"}],["path",{d:"M16 7v9",key:"1hp2iy"}],["path",{d:"M5 3a2 2 0 0 0-2 2",key:"y57alp"}],["path",{d:"M9 3h1",key:"1yesri"}],["path",{d:"M14 3h1",key:"1ec4yj"}],["path",{d:"M19 3a2 2 0 0 1 2 2",key:"18rm91"}],["path",{d:"M21 9v1",key:"mxsmne"}],["path",{d:"M21 14v1",key:"169vum"}],["path",{d:"M21 19a2 2 0 0 1-2 2",key:"1j7049"}],["path",{d:"M14 21h1",key:"v9vybs"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M5 21a2 2 0 0 1-2-2",key:"sbafld"}],["path",{d:"M3 14v1",key:"vnatye"}],["path",{d:"M3 9v1",key:"1r0deq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zn=i("KanbanSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 7v7",key:"1x2jlm"}],["path",{d:"M12 7v4",key:"xawao1"}],["path",{d:"M16 7v9",key:"1hp2iy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ok=i("Kanban",[["path",{d:"M6 5v11",key:"mdvv1e"}],["path",{d:"M12 5v6",key:"14ar3b"}],["path",{d:"M18 5v14",key:"7ji314"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uk=i("KeyRound",[["path",{d:"M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z",key:"167ctg"}],["circle",{cx:"16.5",cy:"7.5",r:".5",key:"1kog09"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zk=i("KeySquare",[["path",{d:"M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z",key:"9li5bk"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4",key:"1ym3zm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _k=i("Key",[["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["path",{d:"m15.5 7.5 3 3L22 7l-3-3",key:"1rn1fs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wk=i("KeyboardMusic",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"M6 8h4",key:"utf9t1"}],["path",{d:"M14 8h.01",key:"1primd"}],["path",{d:"M18 8h.01",key:"emo2bl"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M6 12v4",key:"dy92yo"}],["path",{d:"M10 12v4",key:"1fxnav"}],["path",{d:"M14 12v4",key:"1hft58"}],["path",{d:"M18 12v4",key:"tjjnbz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gk=i("Keyboard",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",ry:"2",key:"15u882"}],["path",{d:"M6 8h.001",key:"1ej0i3"}],["path",{d:"M10 8h.001",key:"1x2st2"}],["path",{d:"M14 8h.001",key:"1vkmyp"}],["path",{d:"M18 8h.001",key:"kfsenl"}],["path",{d:"M8 12h.001",key:"1sjpby"}],["path",{d:"M12 12h.001",key:"al75ts"}],["path",{d:"M16 12h.001",key:"931bgk"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $k=i("LampCeiling",[["path",{d:"M12 2v5",key:"nd4vlx"}],["path",{d:"M6 7h12l4 9H2l4-9Z",key:"123d64"}],["path",{d:"M9.17 16a3 3 0 1 0 5.66 0",key:"1061mw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xk=i("LampDesk",[["path",{d:"m14 5-3 3 2 7 8-8-7-2Z",key:"1b0msb"}],["path",{d:"m14 5-3 3-3-3 3-3 3 3Z",key:"1uemms"}],["path",{d:"M9.5 6.5 4 12l3 6",key:"1bx08v"}],["path",{d:"M3 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H3Z",key:"wap775"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kk=i("LampFloor",[["path",{d:"M9 2h6l3 7H6l3-7Z",key:"wcx6mj"}],["path",{d:"M12 9v13",key:"3n1su1"}],["path",{d:"M9 22h6",key:"1rlq3v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qk=i("LampWallDown",[["path",{d:"M11 13h6l3 7H8l3-7Z",key:"9n3qlo"}],["path",{d:"M14 13V8a2 2 0 0 0-2-2H8",key:"1hu4hb"}],["path",{d:"M4 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4v6Z",key:"s053bc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yk=i("LampWallUp",[["path",{d:"M11 4h6l3 7H8l3-7Z",key:"11x1ee"}],["path",{d:"M14 11v5a2 2 0 0 1-2 2H8",key:"eutp5o"}],["path",{d:"M4 15h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4v-6Z",key:"1iuthr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jk=i("Lamp",[["path",{d:"M8 2h8l4 10H4L8 2Z",key:"9dma5w"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8Z",key:"mwf4oh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e4=i("LandPlot",[["path",{d:"m12 8 6-3-6-3v10",key:"mvpnpy"}],["path",{d:"m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12",key:"ek95tt"}],["path",{d:"m6.49 12.85 11.02 6.3",key:"1kt42w"}],["path",{d:"M17.51 12.85 6.5 19.15",key:"v55bdg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t4=i("Landmark",[["line",{x1:"3",x2:"21",y1:"22",y2:"22",key:"j8o0r"}],["line",{x1:"6",x2:"6",y1:"18",y2:"11",key:"10tf0k"}],["line",{x1:"10",x2:"10",y1:"18",y2:"11",key:"54lgf6"}],["line",{x1:"14",x2:"14",y1:"18",y2:"11",key:"380y"}],["line",{x1:"18",x2:"18",y1:"18",y2:"11",key:"1kevvc"}],["polygon",{points:"12 2 20 7 4 7",key:"jkujk7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n4=i("Languages",[["path",{d:"m5 8 6 6",key:"1wu5hv"}],["path",{d:"m4 14 6-6 2-3",key:"1k1g8d"}],["path",{d:"M2 5h12",key:"or177f"}],["path",{d:"M7 2h1",key:"1t2jsx"}],["path",{d:"m22 22-5-10-5 10",key:"don7ne"}],["path",{d:"M14 18h6",key:"1m8k6r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a4=i("Laptop2",[["rect",{width:"18",height:"12",x:"3",y:"4",rx:"2",ry:"2",key:"1qhy41"}],["line",{x1:"2",x2:"22",y1:"20",y2:"20",key:"ni3hll"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i4=i("Laptop",[["path",{d:"M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16",key:"tarvll"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r4=i("LassoSelect",[["path",{d:"M7 22a5 5 0 0 1-2-4",key:"umushi"}],["path",{d:"M7 16.93c.96.43 1.96.74 2.99.91",key:"ybbtv3"}],["path",{d:"M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2",key:"gt5e1w"}],["path",{d:"M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",key:"bq3ynw"}],["path",{d:"M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14v0z",key:"1bawls"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o4=i("Lasso",[["path",{d:"M7 22a5 5 0 0 1-2-4",key:"umushi"}],["path",{d:"M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1",key:"146dds"}],["path",{d:"M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",key:"bq3ynw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s4=i("Laugh",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z",key:"b2q4dd"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c4=i("Layers2",[["path",{d:"m16.02 12 5.48 3.13a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74L7.98 12",key:"1cuww1"}],["path",{d:"M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74Z",key:"pdlvxu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l4=i("Layers3",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59",key:"1e5n1m"}],["path",{d:"m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59",key:"1iwflc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ya=i("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d4=i("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h4=i("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u4=i("LayoutList",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}],["path",{d:"M14 4h7",key:"3xa0d5"}],["path",{d:"M14 9h7",key:"1icrd9"}],["path",{d:"M14 15h7",key:"1mj8o2"}],["path",{d:"M14 20h7",key:"11slyb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y4=i("LayoutPanelLeft",[["rect",{width:"7",height:"18",x:"3",y:"3",rx:"1",key:"2obqm"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p4=i("LayoutPanelTop",[["rect",{width:"18",height:"7",x:"3",y:"3",rx:"1",key:"f1a2em"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k4=i("LayoutTemplate",[["rect",{width:"18",height:"7",x:"3",y:"3",rx:"1",key:"f1a2em"}],["rect",{width:"9",height:"7",x:"3",y:"14",rx:"1",key:"jqznyg"}],["rect",{width:"5",height:"7",x:"16",y:"14",rx:"1",key:"q5h2i8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f4=i("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m4=i("LeafyGreen",[["path",{d:"M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22",key:"1134nt"}],["path",{d:"M2 22 17 7",key:"1q7jp2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g4=i("LibraryBig",[["rect",{width:"8",height:"18",x:"3",y:"3",rx:"1",key:"oynpb5"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z",key:"1qboyk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v4=i("LibrarySquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 7v10",key:"d5nglc"}],["path",{d:"M11 7v10",key:"pptsnr"}],["path",{d:"m15 7 2 10",key:"1m7qm5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x4=i("Library",[["path",{d:"m16 6 4 14",key:"ji33uf"}],["path",{d:"M12 6v14",key:"1n7gus"}],["path",{d:"M8 8v12",key:"1gg7y9"}],["path",{d:"M4 4v16",key:"6qkkli"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M4=i("LifeBuoy",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m4.93 4.93 4.24 4.24",key:"1ymg45"}],["path",{d:"m14.83 9.17 4.24-4.24",key:"1cb5xl"}],["path",{d:"m14.83 14.83 4.24 4.24",key:"q42g0n"}],["path",{d:"m9.17 14.83-4.24 4.24",key:"bqpfvv"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w4=i("Ligature",[["path",{d:"M8 20V8c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2",key:"1rtphz"}],["path",{d:"M6 12h4",key:"a4o3ry"}],["path",{d:"M14 12h2v8",key:"c1fccl"}],["path",{d:"M6 20h4",key:"1i6q5t"}],["path",{d:"M14 20h4",key:"lzx1xo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L4=i("LightbulbOff",[["path",{d:"M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5",key:"1fkcox"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5",key:"10m8kw"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M1=i("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C4=i("LineChart",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S4=i("Link2Off",[["path",{d:"M9 17H7A5 5 0 0 1 7 7",key:"10o201"}],["path",{d:"M15 7h2a5 5 0 0 1 4 8",key:"1d3206"}],["line",{x1:"8",x2:"12",y1:"12",y2:"12",key:"rvw6j4"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I4=i("Link2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j4=i("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P4=i("Linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b4=i("ListChecks",[["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A4=i("ListEnd",[["path",{d:"M16 12H3",key:"1a2rj7"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M10 18H3",key:"13769t"}],["path",{d:"M21 6v10a2 2 0 0 1-2 2h-5",key:"ilrcs8"}],["path",{d:"m16 16-2 2 2 2",key:"kkc6pm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z4=i("ListFilter",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M7 12h10",key:"b7w52i"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V4=i("ListMinus",[["path",{d:"M11 12H3",key:"51ecnj"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"M21 12h-6",key:"bt1uis"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H4=i("ListMusic",[["path",{d:"M21 15V6",key:"h1cx4g"}],["path",{d:"M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",key:"8saifv"}],["path",{d:"M12 12H3",key:"18klou"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M12 18H3",key:"11ftsu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T4=i("ListOrdered",[["line",{x1:"10",x2:"21",y1:"6",y2:"6",key:"76qw6h"}],["line",{x1:"10",x2:"21",y1:"12",y2:"12",key:"16nom4"}],["line",{x1:"10",x2:"21",y1:"18",y2:"18",key:"u3jurt"}],["path",{d:"M4 6h1v4",key:"cnovpq"}],["path",{d:"M4 10h2",key:"16xx2s"}],["path",{d:"M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",key:"m9a95d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q4=i("ListPlus",[["path",{d:"M11 12H3",key:"51ecnj"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"M18 9v6",key:"1twb98"}],["path",{d:"M21 12h-6",key:"bt1uis"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D4=i("ListRestart",[["path",{d:"M21 6H3",key:"1jwq7v"}],["path",{d:"M7 12H3",key:"13ou7f"}],["path",{d:"M7 18H3",key:"1sijw9"}],["path",{d:"M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14",key:"qth677"}],["path",{d:"M11 10v4h4",key:"172dkj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F4=i("ListStart",[["path",{d:"M16 12H3",key:"1a2rj7"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"M10 6H3",key:"lf8lx7"}],["path",{d:"M21 18V8a2 2 0 0 0-2-2h-5",key:"1hghli"}],["path",{d:"m16 8-2-2 2-2",key:"160uvd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R4=i("ListTodo",[["rect",{x:"3",y:"5",width:"6",height:"6",rx:"1",key:"1defrl"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B4=i("ListTree",[["path",{d:"M21 12h-8",key:"1bmf0i"}],["path",{d:"M21 6H8",key:"1pqkrb"}],["path",{d:"M21 18h-8",key:"1tm79t"}],["path",{d:"M3 6v4c0 1.1.9 2 2 2h3",key:"1ywdgy"}],["path",{d:"M3 10v6c0 1.1.9 2 2 2h3",key:"2wc746"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N4=i("ListVideo",[["path",{d:"M12 12H3",key:"18klou"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M12 18H3",key:"11ftsu"}],["path",{d:"m16 12 5 3-5 3v-6Z",key:"zpskkp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E4=i("ListX",[["path",{d:"M11 12H3",key:"51ecnj"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"m19 10-4 4",key:"1tz659"}],["path",{d:"m15 10 4 4",key:"1n7nei"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O4=i("List",[["line",{x1:"8",x2:"21",y1:"6",y2:"6",key:"7ey8pc"}],["line",{x1:"8",x2:"21",y1:"12",y2:"12",key:"rjfblc"}],["line",{x1:"8",x2:"21",y1:"18",y2:"18",key:"c3b1m8"}],["line",{x1:"3",x2:"3.01",y1:"6",y2:"6",key:"1g7gq3"}],["line",{x1:"3",x2:"3.01",y1:"12",y2:"12",key:"1pjlvk"}],["line",{x1:"3",x2:"3.01",y1:"18",y2:"18",key:"28t2mc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U4=i("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z4=i("Loader",[["line",{x1:"12",x2:"12",y1:"2",y2:"6",key:"gza1u7"}],["line",{x1:"12",x2:"12",y1:"18",y2:"22",key:"1qhbu9"}],["line",{x1:"4.93",x2:"7.76",y1:"4.93",y2:"7.76",key:"xae44r"}],["line",{x1:"16.24",x2:"19.07",y1:"16.24",y2:"19.07",key:"bxnmvf"}],["line",{x1:"2",x2:"6",y1:"12",y2:"12",key:"89khin"}],["line",{x1:"18",x2:"22",y1:"12",y2:"12",key:"pb8tfm"}],["line",{x1:"4.93",x2:"7.76",y1:"19.07",y2:"16.24",key:"1uxjnu"}],["line",{x1:"16.24",x2:"19.07",y1:"7.76",y2:"4.93",key:"6duxfx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _4=i("LocateFixed",[["line",{x1:"2",x2:"5",y1:"12",y2:"12",key:"bvdh0s"}],["line",{x1:"19",x2:"22",y1:"12",y2:"12",key:"1tbv5k"}],["line",{x1:"12",x2:"12",y1:"2",y2:"5",key:"11lu5j"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}],["circle",{cx:"12",cy:"12",r:"7",key:"fim9np"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W4=i("LocateOff",[["line",{x1:"2",x2:"5",y1:"12",y2:"12",key:"bvdh0s"}],["line",{x1:"19",x2:"22",y1:"12",y2:"12",key:"1tbv5k"}],["line",{x1:"12",x2:"12",y1:"2",y2:"5",key:"11lu5j"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}],["path",{d:"M7.11 7.11C5.83 8.39 5 10.1 5 12c0 3.87 3.13 7 7 7 1.9 0 3.61-.83 4.89-2.11",key:"1oh7ia"}],["path",{d:"M18.71 13.96c.19-.63.29-1.29.29-1.96 0-3.87-3.13-7-7-7-.67 0-1.33.1-1.96.29",key:"3qdecy"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G4=i("Locate",[["line",{x1:"2",x2:"5",y1:"12",y2:"12",key:"bvdh0s"}],["line",{x1:"19",x2:"22",y1:"12",y2:"12",key:"1tbv5k"}],["line",{x1:"12",x2:"12",y1:"2",y2:"5",key:"11lu5j"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}],["circle",{cx:"12",cy:"12",r:"7",key:"fim9np"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $4=i("LockKeyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X4=i("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K4=i("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q4=i("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y4=i("Lollipop",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}],["path",{d:"M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0",key:"107gwy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J4=i("Luggage",[["path",{d:"M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0",key:"1h5fkc"}],["path",{d:"M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14",key:"1l99gc"}],["path",{d:"M10 20h4",key:"ni2waw"}],["circle",{cx:"16",cy:"20",r:"2",key:"1vifvg"}],["circle",{cx:"8",cy:"20",r:"2",key:"ckkr5m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e5=i("MSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 16V8l4 4 4-4v8",key:"141u4e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t5=i("Magnet",[["path",{d:"m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15",key:"1i3lhw"}],["path",{d:"m5 8 4 4",key:"j6kj7e"}],["path",{d:"m12 15 4 4",key:"lnac28"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n5=i("MailCheck",[["path",{d:"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",key:"12jkf8"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"m16 19 2 2 4-4",key:"1b14m6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a5=i("MailMinus",[["path",{d:"M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",key:"fuxbkv"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M16 19h6",key:"xwg31i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i5=i("MailOpen",[["path",{d:"M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",key:"1jhwl8"}],["path",{d:"m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10",key:"1qfld7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r5=i("MailPlus",[["path",{d:"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",key:"12jkf8"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M19 16v6",key:"tddt3s"}],["path",{d:"M16 19h6",key:"xwg31i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o5=i("MailQuestion",[["path",{d:"M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5",key:"e61zoh"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2",key:"7z9rxb"}],["path",{d:"M20 22v.01",key:"12bgn6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s5=i("MailSearch",[["path",{d:"M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5",key:"w80f2v"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z",key:"mgbru4"}],["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["path",{d:"m22 22-1.5-1.5",key:"1x83k4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c5=i("MailWarning",[["path",{d:"M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5",key:"e61zoh"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"M20 14v4",key:"1hm744"}],["path",{d:"M20 22v.01",key:"12bgn6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l5=i("MailX",[["path",{d:"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9",key:"1j9vog"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"m17 17 4 4",key:"1b3523"}],["path",{d:"m21 17-4 4",key:"uinynz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d5=i("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h5=i("Mailbox",[["path",{d:"M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z",key:"1lbycx"}],["polyline",{points:"15,9 18,9 18,11",key:"1pm9c0"}],["path",{d:"M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0",key:"n6nfvi"}],["line",{x1:"6",x2:"7",y1:"10",y2:"10",key:"1e2scm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u5=i("Mails",[["rect",{width:"16",height:"13",x:"6",y:"4",rx:"2",key:"1drq3f"}],["path",{d:"m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7",key:"xn252p"}],["path",{d:"M2 8v11c0 1.1.9 2 2 2h14",key:"n13cji"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y5=i("MapPinOff",[["path",{d:"M5.43 5.43A8.06 8.06 0 0 0 4 10c0 6 8 12 8 12a29.94 29.94 0 0 0 5-5",key:"12a8pk"}],["path",{d:"M19.18 13.52A8.66 8.66 0 0 0 20 10a8 8 0 0 0-8-8 7.88 7.88 0 0 0-3.52.82",key:"1r9f6y"}],["path",{d:"M9.13 9.13A2.78 2.78 0 0 0 9 10a3 3 0 0 0 3 3 2.78 2.78 0 0 0 .87-.13",key:"erynq7"}],["path",{d:"M14.9 9.25a3 3 0 0 0-2.15-2.16",key:"1hwwmx"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p5=i("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k5=i("MapPinned",[["path",{d:"M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0",key:"yrbn30"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835",key:"112zkj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f5=i("Map",[["polygon",{points:"3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21",key:"ok2ie8"}],["line",{x1:"9",x2:"9",y1:"3",y2:"18",key:"w34qz5"}],["line",{x1:"15",x2:"15",y1:"6",y2:"21",key:"volv9a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m5=i("Martini",[["path",{d:"M8 22h8",key:"rmew8v"}],["path",{d:"M12 11v11",key:"ur9y6a"}],["path",{d:"m19 3-7 8-7-8Z",key:"1sgpiw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g5=i("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v5=i("Maximize",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x5=i("Medal",[["path",{d:"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",key:"143lza"}],["path",{d:"M11 12 5.12 2.2",key:"qhuxz6"}],["path",{d:"m13 12 5.88-9.8",key:"hbye0f"}],["path",{d:"M8 7h8",key:"i86dvs"}],["circle",{cx:"12",cy:"17",r:"5",key:"qbz8iq"}],["path",{d:"M12 18v-2h-.5",key:"fawc4q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M5=i("MegaphoneOff",[["path",{d:"M9.26 9.26 3 11v3l14.14 3.14",key:"3429n"}],["path",{d:"M21 15.34V6l-7.31 2.03",key:"4o1dh8"}],["path",{d:"M11.6 16.8a3 3 0 1 1-5.8-1.6",key:"1yl0tm"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w5=i("Megaphone",[["path",{d:"m3 11 18-5v12L3 14v-3z",key:"n962bs"}],["path",{d:"M11.6 16.8a3 3 0 1 1-5.8-1.6",key:"1yl0tm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L5=i("Meh",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"8",x2:"16",y1:"15",y2:"15",key:"1xb1d9"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C5=i("MemoryStick",[["path",{d:"M6 19v-3",key:"1nvgqn"}],["path",{d:"M10 19v-3",key:"iu8nkm"}],["path",{d:"M14 19v-3",key:"kcehxu"}],["path",{d:"M18 19v-3",key:"1vh91z"}],["path",{d:"M8 11V9",key:"63erz4"}],["path",{d:"M16 11V9",key:"fru6f3"}],["path",{d:"M12 11V9",key:"ha00sb"}],["path",{d:"M2 15h20",key:"16ne18"}],["path",{d:"M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z",key:"lhddv3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S5=i("MenuSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 8h10",key:"1jw688"}],["path",{d:"M7 12h10",key:"b7w52i"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ja=i("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I5=i("Merge",[["path",{d:"m8 6 4-4 4 4",key:"ybng9g"}],["path",{d:"M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22",key:"1hyw0i"}],["path",{d:"m20 22-5-5",key:"1m27yz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j5=i("MessageCircleCode",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"m10 10-2 2 2 2",key:"p6et6i"}],["path",{d:"m14 10 2 2-2 2",key:"1kkmpt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P5=i("MessageCircleDashed",[["path",{d:"M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1",key:"16ll65"}],["path",{d:"M19.3 6.8a10.45 10.45 0 0 0-2.1-2.1",key:"1nq77a"}],["path",{d:"M20.9 13.5c.1-.5.1-1 .1-1.5s-.1-1-.1-1.5",key:"1sf7wn"}],["path",{d:"M17.2 19.3a10.45 10.45 0 0 0 2.1-2.1",key:"x1hs5g"}],["path",{d:"M10.5 20.9c.5.1 1 .1 1.5.1s1-.1 1.5-.1",key:"19m18z"}],["path",{d:"M3.5 17.5 2 22l4.5-1.5",key:"1f36qi"}],["path",{d:"M3.1 10.5c0 .5-.1 1-.1 1.5s.1 1 .1 1.5",key:"1vz3ju"}],["path",{d:"M6.8 4.7a10.45 10.45 0 0 0-2.1 2.1",key:"19f9do"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b5=i("MessageCircleHeart",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7",key:"43lnbm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A5=i("MessageCircleMore",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M8 12h.01",key:"czm47f"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M16 12h.01",key:"1l6xoz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z5=i("MessageCircleOff",[["path",{d:"M20.5 14.9A9 9 0 0 0 9.1 3.5",key:"1iebmn"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M5.6 5.6C3 8.3 2.2 12.5 4 16l-2 6 6-2c3.4 1.8 7.6 1.1 10.3-1.7",key:"1ov8ce"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V5=i("MessageCirclePlus",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H5=i("MessageCircleQuestion",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T5=i("MessageCircleReply",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"m10 15-3-3 3-3",key:"1pgupc"}],["path",{d:"M7 12h7a2 2 0 0 1 2 2v1",key:"1gheu4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q5=i("MessageCircleWarning",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D5=i("MessageCircleX",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F5=i("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R5=i("MessageSquareCode",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"m10 8-2 2 2 2",key:"19bv1o"}],["path",{d:"m14 8 2 2-2 2",key:"1whylv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B5=i("MessageSquareDashed",[["path",{d:"M3 6V5c0-1.1.9-2 2-2h2",key:"9usibi"}],["path",{d:"M11 3h3",key:"1c3ji7"}],["path",{d:"M18 3h1c1.1 0 2 .9 2 2",key:"19esxn"}],["path",{d:"M21 9v2",key:"p14lih"}],["path",{d:"M21 15c0 1.1-.9 2-2 2h-1",key:"1fo1j8"}],["path",{d:"M14 17h-3",key:"1w4p2m"}],["path",{d:"m7 17-4 4v-5",key:"ph9x1h"}],["path",{d:"M3 12v-2",key:"856n1q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N5=i("MessageSquareDiff",[["path",{d:"m5 19-2 2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2",key:"1xuzuj"}],["path",{d:"M9 10h6",key:"9gxzsh"}],["path",{d:"M12 7v6",key:"lw1j43"}],["path",{d:"M9 17h6",key:"r8uit2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E5=i("MessageSquareDot",[["path",{d:"M11.7 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2v-2.7",key:"uodpkb"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O5=i("MessageSquareHeart",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8",key:"1blaws"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U5=i("MessageSquareMore",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M16 10h.01",key:"1m94wz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z5=i("MessageSquareOff",[["path",{d:"M21 15V5a2 2 0 0 0-2-2H9",key:"43el77"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M3.6 3.6c-.4.3-.6.8-.6 1.4v16l4-4h10",key:"pwpm4a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _5=i("MessageSquarePlus",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M12 7v6",key:"lw1j43"}],["path",{d:"M9 10h6",key:"9gxzsh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W5=i("MessageSquareQuote",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M8 12a2 2 0 0 0 2-2V8H8",key:"1jfesj"}],["path",{d:"M14 12a2 2 0 0 0 2-2V8h-2",key:"1dq9mh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G5=i("MessageSquareReply",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"m10 7-3 3 3 3",key:"1eugdv"}],["path",{d:"M17 13v-1a2 2 0 0 0-2-2H7",key:"ernfh3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $5=i("MessageSquareShare",[["path",{d:"M21 12v3a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h7",key:"tqtdkg"}],["path",{d:"M16 3h5v5",key:"1806ms"}],["path",{d:"m16 8 5-5",key:"15mbrl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X5=i("MessageSquareText",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M13 8H7",key:"14i4kc"}],["path",{d:"M17 12H7",key:"16if0g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K5=i("MessageSquareWarning",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M12 7v2",key:"stiyo7"}],["path",{d:"M12 13h.01",key:"y0uutt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q5=i("MessageSquareX",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"m14.5 7.5-5 5",key:"3lb6iw"}],["path",{d:"m9.5 7.5 5 5",key:"ko136h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y5=i("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J5=i("MessagesSquare",[["path",{d:"M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z",key:"16vlm8"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1",key:"1cx29u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ef=i("Mic2",[["path",{d:"m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12",key:"zoua8r"}],["circle",{cx:"17",cy:"7",r:"5",key:"1fomce"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tf=i("MicOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M18.89 13.23A7.12 7.12 0 0 0 19 12v-2",key:"80xlxr"}],["path",{d:"M5 10v2a7 7 0 0 0 12 5",key:"p2k8kg"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nf=i("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const af=i("Microscope",[["path",{d:"M6 18h8",key:"1borvv"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M14 22a7 7 0 1 0 0-14h-1",key:"1jwaiy"}],["path",{d:"M9 14h2",key:"197e7h"}],["path",{d:"M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z",key:"1bmzmy"}],["path",{d:"M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",key:"1drr47"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rf=i("Microwave",[["rect",{width:"20",height:"15",x:"2",y:"4",rx:"2",key:"2no95f"}],["rect",{width:"8",height:"7",x:"6",y:"8",rx:"1",key:"zh9wx"}],["path",{d:"M18 8v7",key:"o5zi4n"}],["path",{d:"M6 19v2",key:"1loha6"}],["path",{d:"M18 19v2",key:"1dawf0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const of=i("Milestone",[["path",{d:"M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z",key:"1mp5s7"}],["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M12 3v3",key:"1n5kay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sf=i("MilkOff",[["path",{d:"M8 2h8",key:"1ssgc1"}],["path",{d:"M9 2v1.343M15 2v2.789a4 4 0 0 0 .672 2.219l.656.984a4 4 0 0 1 .672 2.22v1.131M7.8 7.8l-.128.192A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3",key:"y0ejgx"}],["path",{d:"M7 15a6.47 6.47 0 0 1 5 0 6.472 6.472 0 0 0 3.435.435",key:"iaxqsy"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cf=i("Milk",[["path",{d:"M8 2h8",key:"1ssgc1"}],["path",{d:"M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2",key:"qtp12x"}],["path",{d:"M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0",key:"ygeh44"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lf=i("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const df=i("Minimize",[["path",{d:"M8 3v3a2 2 0 0 1-2 2H3",key:"hohbtr"}],["path",{d:"M21 8h-3a2 2 0 0 1-2-2V3",key:"5jw1f3"}],["path",{d:"M3 16h3a2 2 0 0 1 2 2v3",key:"198tvr"}],["path",{d:"M16 21v-3a2 2 0 0 1 2-2h3",key:"ph8mxp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hf=i("MinusCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uf=i("MinusSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yf=i("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pf=i("MonitorCheck",[["path",{d:"m9 10 2 2 4-4",key:"1gnqz4"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kf=i("MonitorDot",[["circle",{cx:"19",cy:"6",r:"3",key:"108a5v"}],["path",{d:"M22 12v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9",key:"1fet9y"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ff=i("MonitorDown",[["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"m15 10-3 3-3-3",key:"lzhmyn"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mf=i("MonitorOff",[["path",{d:"M17 17H4a2 2 0 0 1-2-2V5c0-1.5 1-2 1-2",key:"k0q8oc"}],["path",{d:"M22 15V5a2 2 0 0 0-2-2H9",key:"cp1ac0"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gf=i("MonitorPause",[["path",{d:"M10 13V7",key:"1u13u9"}],["path",{d:"M14 13V7",key:"1vj9om"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vf=i("MonitorPlay",[["path",{d:"m10 7 5 3-5 3Z",key:"29ljg6"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xf=i("MonitorSmartphone",[["path",{d:"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",key:"10dyio"}],["path",{d:"M10 19v-3.96 3.15",key:"1irgej"}],["path",{d:"M7 19h5",key:"qswx4l"}],["rect",{width:"6",height:"10",x:"16",y:"12",rx:"2",key:"1egngj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mf=i("MonitorSpeaker",[["path",{d:"M5.5 20H8",key:"1k40s5"}],["path",{d:"M17 9h.01",key:"1j24nn"}],["rect",{width:"10",height:"16",x:"12",y:"4",rx:"2",key:"ixliua"}],["path",{d:"M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4",key:"1mp6e1"}],["circle",{cx:"17",cy:"15",r:"1",key:"tqvash"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wf=i("MonitorStop",[["rect",{x:"9",y:"7",width:"6",height:"6",key:"4xvc6r"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lf=i("MonitorUp",[["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}],["path",{d:"M12 13V7",key:"h0r20n"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cf=i("MonitorX",[["path",{d:"m14.5 12.5-5-5",key:"1jahn5"}],["path",{d:"m9.5 12.5 5-5",key:"1k2t7b"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sf=i("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const If=i("MoonStar",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}],["path",{d:"M19 3v4",key:"vgv24u"}],["path",{d:"M21 5h-4",key:"1wcg1f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jf=i("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pf=i("MoreHorizontal",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bf=i("MoreVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Af=i("MountainSnow",[["path",{d:"m8 3 4 8 5-5 5 15H2L8 3z",key:"otkl63"}],["path",{d:"M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19",key:"1pvmmp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zf=i("Mountain",[["path",{d:"m8 3 4 8 5-5 5 15H2L8 3z",key:"otkl63"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vf=i("MousePointer2",[["path",{d:"m4 4 7.07 17 2.51-7.39L21 11.07z",key:"1vqm48"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hf=i("MousePointerClick",[["path",{d:"m9 9 5 12 1.8-5.2L21 14Z",key:"1b76lo"}],["path",{d:"M7.2 2.2 8 5.1",key:"1cfko1"}],["path",{d:"m5.1 8-2.9-.8",key:"1go3kf"}],["path",{d:"M14 4.1 12 6",key:"ita8i4"}],["path",{d:"m6 12-1.9 2",key:"mnht97"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tf=i("MousePointerSquareDashed",[["path",{d:"M5 3a2 2 0 0 0-2 2",key:"y57alp"}],["path",{d:"M19 3a2 2 0 0 1 2 2",key:"18rm91"}],["path",{d:"m12 12 4 10 1.7-4.3L22 16Z",key:"64ilsv"}],["path",{d:"M5 21a2 2 0 0 1-2-2",key:"sbafld"}],["path",{d:"M9 3h1",key:"1yesri"}],["path",{d:"M9 21h2",key:"1qve2z"}],["path",{d:"M14 3h1",key:"1ec4yj"}],["path",{d:"M3 9v1",key:"1r0deq"}],["path",{d:"M21 9v2",key:"p14lih"}],["path",{d:"M3 14v1",key:"vnatye"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vn=i("MousePointerSquare",[["path",{d:"M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6",key:"14rsvq"}],["path",{d:"m12 12 4 10 1.7-4.3L22 16Z",key:"64ilsv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qf=i("MousePointer",[["path",{d:"m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z",key:"y2ucgo"}],["path",{d:"m13 13 6 6",key:"1nhxnf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Df=i("Mouse",[["rect",{x:"5",y:"2",width:"14",height:"20",rx:"7",key:"11ol66"}],["path",{d:"M12 6v4",key:"16clxf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hn=i("Move3d",[["path",{d:"M5 3v16h16",key:"1mqmf9"}],["path",{d:"m5 19 6-6",key:"jh6hbb"}],["path",{d:"m2 6 3-3 3 3",key:"tkyvxa"}],["path",{d:"m18 16 3 3-3 3",key:"1d4glt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ff=i("MoveDiagonal2",[["polyline",{points:"5 11 5 5 11 5",key:"ncfzxk"}],["polyline",{points:"19 13 19 19 13 19",key:"1mk7hk"}],["line",{x1:"5",x2:"19",y1:"5",y2:"19",key:"mcyte3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rf=i("MoveDiagonal",[["polyline",{points:"13 5 19 5 19 11",key:"11219e"}],["polyline",{points:"11 19 5 19 5 13",key:"sfq3wq"}],["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bf=i("MoveDownLeft",[["path",{d:"M11 19H5V13",key:"1akmht"}],["path",{d:"M19 5L5 19",key:"72u4yj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nf=i("MoveDownRight",[["path",{d:"M19 13V19H13",key:"10vkzq"}],["path",{d:"M5 5L19 19",key:"5zm2fv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ef=i("MoveDown",[["path",{d:"M8 18L12 22L16 18",key:"cskvfv"}],["path",{d:"M12 2V22",key:"r89rzk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Of=i("MoveHorizontal",[["polyline",{points:"18 8 22 12 18 16",key:"1hqrds"}],["polyline",{points:"6 8 2 12 6 16",key:"f0ernq"}],["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uf=i("MoveLeft",[["path",{d:"M6 8L2 12L6 16",key:"kyvwex"}],["path",{d:"M2 12H22",key:"1m8cig"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zf=i("MoveRight",[["path",{d:"M18 8L22 12L18 16",key:"1r0oui"}],["path",{d:"M2 12H22",key:"1m8cig"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _f=i("MoveUpLeft",[["path",{d:"M5 11V5H11",key:"3q78g9"}],["path",{d:"M5 5L19 19",key:"5zm2fv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wf=i("MoveUpRight",[["path",{d:"M13 5H19V11",key:"1n1gyv"}],["path",{d:"M19 5L5 19",key:"72u4yj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gf=i("MoveUp",[["path",{d:"M8 6L12 2L16 6",key:"1yvkyx"}],["path",{d:"M12 2V22",key:"r89rzk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $f=i("MoveVertical",[["polyline",{points:"8 18 12 22 16 18",key:"1uutw3"}],["polyline",{points:"8 6 12 2 16 6",key:"d60sxy"}],["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xf=i("Move",[["polyline",{points:"5 9 2 12 5 15",key:"1r5uj5"}],["polyline",{points:"9 5 12 2 15 5",key:"5v383o"}],["polyline",{points:"15 19 12 22 9 19",key:"g7qi8m"}],["polyline",{points:"19 9 22 12 19 15",key:"tpp73q"}],["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}],["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kf=i("Music2",[["circle",{cx:"8",cy:"18",r:"4",key:"1fc0mg"}],["path",{d:"M12 18V2l7 4",key:"g04rme"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qf=i("Music3",[["circle",{cx:"12",cy:"18",r:"4",key:"m3r9ws"}],["path",{d:"M16 18V2",key:"40x2m5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yf=i("Music4",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["path",{d:"m9 9 12-2",key:"1e64n2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jf=i("Music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e3=i("Navigation2Off",[["path",{d:"M9.31 9.31 5 21l7-4 7 4-1.17-3.17",key:"qoq2o2"}],["path",{d:"M14.53 8.88 12 2l-1.17 3.17",key:"k3sjzy"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t3=i("Navigation2",[["polygon",{points:"12 2 19 21 12 17 5 21 12 2",key:"x8c0qg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n3=i("NavigationOff",[["path",{d:"M8.43 8.43 3 11l8 2 2 8 2.57-5.43",key:"1vdtb7"}],["path",{d:"M17.39 11.73 22 2l-9.73 4.61",key:"tya3r6"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a3=i("Navigation",[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i3=i("Network",[["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1",key:"4q2zg0"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1",key:"8cvhb9"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1",key:"1egb70"}],["path",{d:"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",key:"1jsf9p"}],["path",{d:"M12 12V8",key:"2874zd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r3=i("Newspaper",[["path",{d:"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2",key:"7pis2x"}],["path",{d:"M18 14h-8",key:"sponae"}],["path",{d:"M15 18h-5",key:"95g1m2"}],["path",{d:"M10 6h8v4h-8V6Z",key:"smlsk5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o3=i("Nfc",[["path",{d:"M6 8.32a7.43 7.43 0 0 1 0 7.36",key:"9iaqei"}],["path",{d:"M9.46 6.21a11.76 11.76 0 0 1 0 11.58",key:"1yha7l"}],["path",{d:"M12.91 4.1a15.91 15.91 0 0 1 .01 15.8",key:"4iu2gk"}],["path",{d:"M16.37 2a20.16 20.16 0 0 1 0 20",key:"sap9u2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s3=i("NutOff",[["path",{d:"M12 4V2",key:"1k5q1u"}],["path",{d:"M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592a7.01 7.01 0 0 0 4.125-2.939",key:"1xcvy9"}],["path",{d:"M19 10v3.343",key:"163tfc"}],["path",{d:"M12 12c-1.349-.573-1.905-1.005-2.5-2-.546.902-1.048 1.353-2.5 2-1.018-.644-1.46-1.08-2-2-1.028.71-1.69.918-3 1 1.081-1.048 1.757-2.03 2-3 .194-.776.84-1.551 1.79-2.21m11.654 5.997c.887-.457 1.28-.891 1.556-1.787 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4-.74 0-1.461.068-2.15.192",key:"17914v"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c3=i("Nut",[["path",{d:"M12 4V2",key:"1k5q1u"}],["path",{d:"M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592A7.003 7.003 0 0 0 19 14v-4",key:"1tgyif"}],["path",{d:"M12 4C8 4 4.5 6 4 8c-.243.97-.919 1.952-2 3 1.31-.082 1.972-.29 3-1 .54.92.982 1.356 2 2 1.452-.647 1.954-1.098 2.5-2 .595.995 1.151 1.427 2.5 2 1.31-.621 1.862-1.058 2.5-2 .629.977 1.162 1.423 2.5 2 1.209-.548 1.68-.967 2-2 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4Z",key:"tnsqj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l3=i("Octagon",[["polygon",{points:"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",key:"h1p8hx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d3=i("Option",[["path",{d:"M3 3h6l6 18h6",key:"ph9rgk"}],["path",{d:"M14 3h7",key:"16f0ms"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h3=i("Orbit",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["circle",{cx:"19",cy:"5",r:"2",key:"mhkx31"}],["circle",{cx:"5",cy:"19",r:"2",key:"v8kfzx"}],["path",{d:"M10.4 21.9a10 10 0 0 0 9.941-15.416",key:"eohfx2"}],["path",{d:"M13.5 2.1a10 10 0 0 0-9.841 15.416",key:"19pvbm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u3=i("Outdent",[["polyline",{points:"7 8 3 12 7 16",key:"2j60jr"}],["line",{x1:"21",x2:"11",y1:"12",y2:"12",key:"1fxxak"}],["line",{x1:"21",x2:"11",y1:"6",y2:"6",key:"asgu94"}],["line",{x1:"21",x2:"11",y1:"18",y2:"18",key:"13dsj7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y3=i("Package2",[["path",{d:"M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z",key:"1ront0"}],["path",{d:"m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9",key:"19h2x1"}],["path",{d:"M12 3v6",key:"1holv5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p3=i("PackageCheck",[["path",{d:"m16 16 2 2 4-4",key:"gfu2re"}],["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k3=i("PackageMinus",[["path",{d:"M16 16h6",key:"100bgy"}],["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f3=i("PackageOpen",[["path",{d:"M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z",key:"1vy178"}],["path",{d:"m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z",key:"s3bv25"}],["line",{x1:"12",x2:"12",y1:"22",y2:"13",key:"1o4xyi"}],["path",{d:"M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5",key:"1na2nq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m3=i("PackagePlus",[["path",{d:"M16 16h6",key:"100bgy"}],["path",{d:"M19 13v6",key:"85cyf1"}],["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g3=i("PackageSearch",[["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}],["circle",{cx:"18.5",cy:"15.5",r:"2.5",key:"b5zd12"}],["path",{d:"M20.27 17.27 22 19",key:"1l4muz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v3=i("PackageX",[["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}],["path",{d:"m17 13 5 5m-5 0 5-5",key:"im3w4b"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x3=i("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M3=i("PaintBucket",[["path",{d:"m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z",key:"irua1i"}],["path",{d:"m5 2 5 5",key:"1lls2c"}],["path",{d:"M2 13h15",key:"1hkzvu"}],["path",{d:"M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z",key:"xk76lq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w3=i("Paintbrush2",[["path",{d:"M14 19.9V16h3a2 2 0 0 0 2-2v-2H5v2c0 1.1.9 2 2 2h3v3.9a2 2 0 1 0 4 0Z",key:"1c8kta"}],["path",{d:"M6 12V2h12v10",key:"1esbnf"}],["path",{d:"M14 2v4",key:"qmzblu"}],["path",{d:"M10 2v2",key:"7u0qdc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L3=i("Paintbrush",[["path",{d:"M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z",key:"m6k5sh"}],["path",{d:"M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7",key:"arzq70"}],["path",{d:"M14.5 17.5 4.5 15",key:"s7fvrz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C3=i("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",key:"1xcu5"}],["circle",{cx:"17.5",cy:"10.5",r:".5",key:"736e4u"}],["circle",{cx:"8.5",cy:"7.5",r:".5",key:"clrty"}],["circle",{cx:"6.5",cy:"12.5",r:".5",key:"1s4xz9"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S3=i("Palmtree",[["path",{d:"M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4",key:"foxbe7"}],["path",{d:"M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3",key:"18arnh"}],["path",{d:"M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35z",key:"epoumf"}],["path",{d:"M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14",key:"ft0feo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I3=i("PanelBottomClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"m15 8-3 3-3-3",key:"1oxy1z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=i("PanelBottomDashed",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M14 15h1",key:"171nev"}],["path",{d:"M19 15h2",key:"1vnucp"}],["path",{d:"M3 15h2",key:"8bym0q"}],["path",{d:"M9 15h1",key:"1tg3ks"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j3=i("PanelBottomOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P3=i("PanelBottom",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 15h18",key:"5xshup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qn=i("PanelLeftClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m16 15-3-3 3-3",key:"14y99z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dn=i("PanelLeftDashed",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 14v1",key:"askpd8"}],["path",{d:"M9 19v2",key:"16tejx"}],["path",{d:"M9 3v2",key:"1noubl"}],["path",{d:"M9 9v1",key:"19ebxg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fn=i("PanelLeftOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m14 9 3 3-3 3",key:"8010ee"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rn=i("PanelLeft",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b3=i("PanelRightClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m8 9 3 3-3 3",key:"12hl5m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bn=i("PanelRightDashed",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 14v1",key:"ilsfch"}],["path",{d:"M15 19v2",key:"1fst2f"}],["path",{d:"M15 3v2",key:"z204g4"}],["path",{d:"M15 9v1",key:"z2a8b1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A3=i("PanelRightOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m10 15-3-3 3-3",key:"1pgupc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z3=i("PanelRight",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V3=i("PanelTopClose",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"m9 16 3-3 3 3",key:"1idcnm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nn=i("PanelTopDashed",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M14 9h1",key:"l0svgy"}],["path",{d:"M19 9h2",key:"te2zfg"}],["path",{d:"M3 9h2",key:"1h4ldw"}],["path",{d:"M9 9h1",key:"15jzuz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H3=i("PanelTopOpen",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"m15 14-3 3-3-3",key:"g215vf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T3=i("PanelTop",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q3=i("PanelsLeftBottom",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M9 15h12",key:"5ijen5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D3=i("PanelsRightBottom",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 15h12",key:"1wkqb3"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const En=i("PanelsTopLeft",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M9 21V9",key:"1oto5p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F3=i("Paperclip",[["path",{d:"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",key:"1u3ebp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R3=i("Parentheses",[["path",{d:"M8 21s-4-3-4-9 4-9 4-9",key:"uto9ud"}],["path",{d:"M16 3s4 3 4 9-4 9-4 9",key:"4w2vsq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B3=i("ParkingCircleOff",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m5 5 14 14",key:"11anup"}],["path",{d:"M13 13a3 3 0 1 0 0-6H9v2",key:"uoagbd"}],["path",{d:"M9 17v-2.34",key:"a9qo08"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N3=i("ParkingCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9 17V7h4a3 3 0 0 1 0 6H9",key:"1dfk2c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E3=i("ParkingMeter",[["path",{d:"M9 9a3 3 0 1 1 6 0",key:"jdoeu8"}],["path",{d:"M12 12v3",key:"158kv8"}],["path",{d:"M11 15h2",key:"199qp6"}],["path",{d:"M19 9a7 7 0 1 0-13.6 2.3C6.4 14.4 8 19 8 19h8s1.6-4.6 2.6-7.7c.3-.8.4-1.5.4-2.3",key:"1l50wn"}],["path",{d:"M12 19v3",key:"npa21l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O3=i("ParkingSquareOff",[["path",{d:"M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41",key:"9l1ft6"}],["path",{d:"M3 8.7V19a2 2 0 0 0 2 2h10.3",key:"17knke"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M13 13a3 3 0 1 0 0-6H9v2",key:"uoagbd"}],["path",{d:"M9 17v-2.3",key:"1jxgo2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U3=i("ParkingSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 17V7h4a3 3 0 0 1 0 6H9",key:"1dfk2c"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z3=i("PartyPopper",[["path",{d:"M5.8 11.3 2 22l10.7-3.79",key:"gwxi1d"}],["path",{d:"M4 3h.01",key:"1vcuye"}],["path",{d:"M22 8h.01",key:"1mrtc2"}],["path",{d:"M15 2h.01",key:"1cjtqr"}],["path",{d:"M22 20h.01",key:"1mrys2"}],["path",{d:"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",key:"bpx1uq"}],["path",{d:"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17",key:"1pd0s7"}],["path",{d:"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7",key:"zq5xbz"}],["path",{d:"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",key:"4kbmks"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _3=i("PauseCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"10",x2:"10",y1:"15",y2:"9",key:"c1nkhi"}],["line",{x1:"14",x2:"14",y1:"15",y2:"9",key:"h65svq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W3=i("PauseOctagon",[["path",{d:"M10 15V9",key:"1lckn7"}],["path",{d:"M14 15V9",key:"1muqhk"}],["path",{d:"M7.714 2h8.572L22 7.714v8.572L16.286 22H7.714L2 16.286V7.714L7.714 2z",key:"1m7qra"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G3=i("Pause",[["rect",{width:"4",height:"16",x:"6",y:"4",key:"iffhe4"}],["rect",{width:"4",height:"16",x:"14",y:"4",key:"sjin7j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $3=i("PawPrint",[["circle",{cx:"11",cy:"4",r:"2",key:"vol9p0"}],["circle",{cx:"18",cy:"8",r:"2",key:"17gozi"}],["circle",{cx:"20",cy:"16",r:"2",key:"1v9bxh"}],["path",{d:"M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z",key:"1ydw1z"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X3=i("PcCase",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",key:"1uq1d7"}],["path",{d:"M15 14h.01",key:"1kp3bh"}],["path",{d:"M9 6h6",key:"dgm16u"}],["path",{d:"M9 10h6",key:"9gxzsh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const On=i("PenLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"ymcmye"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=i("PenSquare",[["path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1qinfi"}],["path",{d:"M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z",key:"w2jsv5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K3=i("PenTool",[["path",{d:"m12 19 7-7 3 3-7 7-3-3z",key:"rklqx2"}],["path",{d:"m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z",key:"1et58u"}],["path",{d:"m2 2 7.586 7.586",key:"etlp93"}],["circle",{cx:"11",cy:"11",r:"2",key:"xmgehs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Un=i("Pen",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q3=i("PencilLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"ymcmye"}],["path",{d:"m15 5 3 3",key:"1w25hb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y3=i("PencilRuler",[["path",{d:"m15 5 4 4",key:"1mk7zo"}],["path",{d:"M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13",key:"orapub"}],["path",{d:"m8 6 2-2",key:"115y1s"}],["path",{d:"m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 0 0-4-4L3.5 16.5Z",key:"hes763"}],["path",{d:"m18 16 2-2",key:"ee94s4"}],["path",{d:"m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17",key:"cfq27r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J3=i("Pencil",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const em=i("Pentagon",[["path",{d:"M3.5 8.7c-.7.5-1 1.4-.7 2.2l2.8 8.7c.3.8 1 1.4 1.9 1.4h9.1c.9 0 1.6-.6 1.9-1.4l2.8-8.7c.3-.8 0-1.7-.7-2.2l-7.4-5.3a2.1 2.1 0 0 0-2.4 0Z",key:"hsj90r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tm=i("PercentCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 15h.01",key:"lqbp3k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nm=i("PercentDiamond",[["path",{d:"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z",key:"1tpxz2"}],["path",{d:"M9.2 9.2h.01",key:"1b7bvt"}],["path",{d:"m14.5 9.5-5 5",key:"17q4r4"}],["path",{d:"M14.7 14.8h.01",key:"17nsh4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const am=i("PercentSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 15h.01",key:"lqbp3k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const im=i("Percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rm=i("PersonStanding",[["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["path",{d:"m9 20 3-6 3 6",key:"se2kox"}],["path",{d:"m6 8 6 2 6-2",key:"4o3us4"}],["path",{d:"M12 10v4",key:"1kjpxc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const om=i("PhoneCall",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}],["path",{d:"M14.05 2a9 9 0 0 1 8 7.94",key:"vmijpz"}],["path",{d:"M14.05 6A5 5 0 0 1 18 10",key:"13nbpp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sm=i("PhoneForwarded",[["polyline",{points:"18 2 22 6 18 10",key:"6vjanh"}],["line",{x1:"14",x2:"22",y1:"6",y2:"6",key:"1jsywh"}],["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cm=i("PhoneIncoming",[["polyline",{points:"16 2 16 8 22 8",key:"1ygljm"}],["line",{x1:"22",x2:"16",y1:"2",y2:"8",key:"1xzwqn"}],["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lm=i("PhoneMissed",[["line",{x1:"22",x2:"16",y1:"2",y2:"8",key:"1xzwqn"}],["line",{x1:"16",x2:"22",y1:"2",y2:"8",key:"13zxdn"}],["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dm=i("PhoneOff",[["path",{d:"M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91",key:"z86iuo"}],["line",{x1:"22",x2:"2",y1:"2",y2:"22",key:"11kh81"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hm=i("PhoneOutgoing",[["polyline",{points:"22 8 22 2 16 2",key:"1g204g"}],["line",{x1:"16",x2:"22",y1:"8",y2:"2",key:"1ggias"}],["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const um=i("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ym=i("PiSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 7h10",key:"udp07y"}],["path",{d:"M10 7v10",key:"i1d9ee"}],["path",{d:"M16 17a2 2 0 0 1-2-2V7",key:"ftwdc7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pm=i("Pi",[["line",{x1:"9",x2:"9",y1:"4",y2:"20",key:"ovs5a5"}],["path",{d:"M4 7c0-1.7 1.3-3 3-3h13",key:"10pag4"}],["path",{d:"M18 20c-1.7 0-3-1.3-3-3V4",key:"1gaosr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const km=i("Piano",[["path",{d:"M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8",key:"lag0yf"}],["path",{d:"M2 14h20",key:"myj16y"}],["path",{d:"M6 14v4",key:"9ng0ue"}],["path",{d:"M10 14v4",key:"1v8uk5"}],["path",{d:"M14 14v4",key:"1tqops"}],["path",{d:"M18 14v4",key:"18uqwm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fm=i("PictureInPicture2",[["path",{d:"M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4",key:"daa4of"}],["rect",{width:"10",height:"7",x:"12",y:"13",rx:"2",key:"1nb8gs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mm=i("PictureInPicture",[["path",{d:"M8 4.5v5H3m-1-6 6 6m13 0v-3c0-1.16-.84-2-2-2h-7m-9 9v2c0 1.05.95 2 2 2h3",key:"bcd8fb"}],["rect",{width:"10",height:"7",x:"12",y:"13.5",ry:"2",key:"136fx3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gm=i("PieChart",[["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}],["path",{d:"M22 12A10 10 0 0 0 12 2v10z",key:"1rfc4y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vm=i("PiggyBank",[["path",{d:"M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z",key:"uf6l00"}],["path",{d:"M2 9v1c0 1.1.9 2 2 2h1",key:"nm575m"}],["path",{d:"M16 11h0",key:"k2aug8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xm=i("PilcrowSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 12H9.5a2.5 2.5 0 0 1 0-5H17",key:"1l9586"}],["path",{d:"M12 7v10",key:"jspqdw"}],["path",{d:"M16 7v10",key:"lavkr4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mm=i("Pilcrow",[["path",{d:"M13 4v16",key:"8vvj80"}],["path",{d:"M17 4v16",key:"7dpous"}],["path",{d:"M19 4H9.5a4.5 4.5 0 0 0 0 9H13",key:"sh4n9v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wm=i("Pill",[["path",{d:"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",key:"wa1lgi"}],["path",{d:"m8.5 8.5 7 7",key:"rvfmvr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lm=i("PinOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["line",{x1:"12",x2:"12",y1:"17",y2:"22",key:"1jrz49"}],["path",{d:"M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h12",key:"13x2n8"}],["path",{d:"M15 9.34V6h1a2 2 0 0 0 0-4H7.89",key:"reo3ki"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cm=i("Pin",[["line",{x1:"12",x2:"12",y1:"17",y2:"22",key:"1jrz49"}],["path",{d:"M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z",key:"13yl11"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sm=i("Pipette",[["path",{d:"m2 22 1-1h3l9-9",key:"1sre89"}],["path",{d:"M3 21v-3l9-9",key:"hpe2y6"}],["path",{d:"m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z",key:"196du1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Im=i("Pizza",[["path",{d:"M15 11h.01",key:"rns66s"}],["path",{d:"M11 15h.01",key:"k85uqc"}],["path",{d:"M16 16h.01",key:"1f9h7w"}],["path",{d:"m2 16 20 6-6-20A20 20 0 0 0 2 16",key:"e4slt2"}],["path",{d:"M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4",key:"rerf8f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jm=i("PlaneLanding",[["path",{d:"M2 22h20",key:"272qi7"}],["path",{d:"M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z",key:"1ma21e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pm=i("PlaneTakeoff",[["path",{d:"M2 22h20",key:"272qi7"}],["path",{d:"M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z",key:"fkigj9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bm=i("Plane",[["path",{d:"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",key:"1v9wt8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ei=i("PlayCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"10 8 16 12 10 16 10 8",key:"1cimsy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Am=i("PlaySquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m9 8 6 4-6 4Z",key:"f1r3lt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zm=i("Play",[["polygon",{points:"5 3 19 12 5 21 5 3",key:"191637"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vm=i("Plug2",[["path",{d:"M9 2v6",key:"17ngun"}],["path",{d:"M15 2v6",key:"s7yy2p"}],["path",{d:"M12 17v5",key:"bb1du9"}],["path",{d:"M5 8h14",key:"pcz4l3"}],["path",{d:"M6 11V8h12v3a6 6 0 1 1-12 0v0Z",key:"nd4hoy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hm=i("PlugZap2",[["path",{d:"m13 2-2 2.5h3L12 7",key:"1me98u"}],["path",{d:"M10 14v-3",key:"1mllf3"}],["path",{d:"M14 14v-3",key:"1l3fkq"}],["path",{d:"M11 19c-1.7 0-3-1.3-3-3v-2h8v2c0 1.7-1.3 3-3 3Z",key:"jd5pat"}],["path",{d:"M12 22v-3",key:"kmzjlo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tm=i("PlugZap",[["path",{d:"M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",key:"goz73y"}],["path",{d:"m2 22 3-3",key:"19mgm9"}],["path",{d:"M7.5 13.5 10 11",key:"7xgeeb"}],["path",{d:"M10.5 16.5 13 14",key:"10btkg"}],["path",{d:"m18 3-4 4h6l-4 4",key:"16psg9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qm=i("Plug",[["path",{d:"M12 22v-5",key:"1ega77"}],["path",{d:"M9 8V2",key:"14iosj"}],["path",{d:"M15 8V2",key:"18g5xt"}],["path",{d:"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",key:"osxo6l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dm=i("PlusCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fm=i("PlusSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rm=i("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bm=i("PocketKnife",[["path",{d:"M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2",key:"19w3oe"}],["path",{d:"M18 6h.01",key:"1v4wsw"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z",key:"6fykxj"}],["path",{d:"M18 11.66V22a4 4 0 0 0 4-4V6",key:"1utzek"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nm=i("Pocket",[["path",{d:"M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z",key:"1mz881"}],["polyline",{points:"8 10 12 14 16 10",key:"w4mbv5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Em=i("Podcast",[["circle",{cx:"12",cy:"11",r:"1",key:"1gvufo"}],["path",{d:"M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5Z",key:"1n5fvv"}],["path",{d:"M8 14a5 5 0 1 1 8 0",key:"fc81rn"}],["path",{d:"M17 18.5a9 9 0 1 0-10 0",key:"jqtxkf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Om=i("PointerOff",[["path",{d:"M10 4.5V4a2 2 0 0 0-2.41-1.957",key:"jsi14n"}],["path",{d:"M13.9 8.4a2 2 0 0 0-1.26-1.295",key:"hirc7f"}],["path",{d:"M21.7 16.2A8 8 0 0 0 22 14v-3a2 2 0 1 0-4 0v-1a2 2 0 0 0-3.63-1.158",key:"1jxb2e"}],["path",{d:"m7 15-1.8-1.8a2 2 0 0 0-2.79 2.86L6 19.7a7.74 7.74 0 0 0 6 2.3h2a8 8 0 0 0 5.657-2.343",key:"10r7hm"}],["path",{d:"M6 6v8",key:"tv5xkp"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Um=i("Pointer",[["path",{d:"M22 14a8 8 0 0 1-8 8",key:"56vcr3"}],["path",{d:"M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0",key:"1pp0yd"}],["path",{d:"M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1",key:"u654g"}],["path",{d:"M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10",key:"1e2dtv"}],["path",{d:"M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"g6ys72"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zm=i("Popcorn",[["path",{d:"M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4",key:"10td1f"}],["path",{d:"M10 22 9 8",key:"yjptiv"}],["path",{d:"m14 22 1-14",key:"8jwc8b"}],["path",{d:"M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z",key:"1qo33t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _m=i("Popsicle",[["path",{d:"M18.6 14.4c.8-.8.8-2 0-2.8l-8.1-8.1a4.95 4.95 0 1 0-7.1 7.1l8.1 8.1c.9.7 2.1.7 2.9-.1Z",key:"1o68ps"}],["path",{d:"m22 22-5.5-5.5",key:"17o70y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wm=i("PoundSterling",[["path",{d:"M18 7c0-5.333-8-5.333-8 0",key:"1prm2n"}],["path",{d:"M10 7v14",key:"18tmcs"}],["path",{d:"M6 21h12",key:"4dkmi1"}],["path",{d:"M6 13h10",key:"ybwr4a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gm=i("PowerCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 12V6",key:"30zewn"}],["path",{d:"M8 7.5A6.1 6.1 0 0 0 12 18a6 6 0 0 0 4-10.5",key:"1r0tk2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $m=i("PowerOff",[["path",{d:"M18.36 6.64A9 9 0 0 1 20.77 15",key:"dxknvb"}],["path",{d:"M6.16 6.16a9 9 0 1 0 12.68 12.68",key:"1x7qb5"}],["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xm=i("PowerSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 7v5",key:"ma6bk"}],["path",{d:"M8 9a5.14 5.14 0 0 0 4 8 4.95 4.95 0 0 0 4-8",key:"15eubv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Km=i("Power",[["path",{d:"M12 2v10",key:"mnfbl"}],["path",{d:"M18.4 6.6a9 9 0 1 1-12.77.04",key:"obofu9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qm=i("Presentation",[["path",{d:"M2 3h20",key:"91anmk"}],["path",{d:"M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3",key:"2k9sn8"}],["path",{d:"m7 21 5-5 5 5",key:"bip4we"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ym=i("Printer",[["polyline",{points:"6 9 6 2 18 2 18 9",key:"1306q4"}],["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["rect",{width:"12",height:"8",x:"6",y:"14",key:"5ipwut"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jm=i("Projector",[["path",{d:"M5 7 3 5",key:"1yys58"}],["path",{d:"M9 6V3",key:"1ptz9u"}],["path",{d:"m13 7 2-2",key:"1w3vmq"}],["circle",{cx:"9",cy:"13",r:"3",key:"1mma13"}],["path",{d:"M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17",key:"2frwzc"}],["path",{d:"M16 16h2",key:"dnq2od"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e6=i("Puzzle",[["path",{d:"M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z",key:"i0oyt7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t6=i("Pyramid",[["path",{d:"M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z",key:"aenxs0"}],["path",{d:"M12 2v20",key:"t6zp3m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n6=i("QrCode",[["rect",{width:"5",height:"5",x:"3",y:"3",rx:"1",key:"1tu5fj"}],["rect",{width:"5",height:"5",x:"16",y:"3",rx:"1",key:"1v8r4q"}],["rect",{width:"5",height:"5",x:"3",y:"16",rx:"1",key:"1x03jg"}],["path",{d:"M21 16h-3a2 2 0 0 0-2 2v3",key:"177gqh"}],["path",{d:"M21 21v.01",key:"ents32"}],["path",{d:"M12 7v3a2 2 0 0 1-2 2H7",key:"8crl2c"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M12 3h.01",key:"n36tog"}],["path",{d:"M12 16v.01",key:"133mhm"}],["path",{d:"M16 12h1",key:"1slzba"}],["path",{d:"M21 12v.01",key:"1lwtk9"}],["path",{d:"M12 21v-1",key:"1880an"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a6=i("Quote",[["path",{d:"M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z",key:"4rm80e"}],["path",{d:"M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",key:"10za9r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i6=i("Rabbit",[["path",{d:"M13 16a3 3 0 0 1 2.24 5",key:"1epib5"}],["path",{d:"M18 12h.01",key:"yjnet6"}],["path",{d:"M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3",key:"ue9ozu"}],["path",{d:"M20 8.54V4a2 2 0 1 0-4 0v3",key:"49iql8"}],["path",{d:"M7.612 12.524a3 3 0 1 0-1.6 4.3",key:"1e33i0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r6=i("Radar",[["path",{d:"M19.07 4.93A10 10 0 0 0 6.99 3.34",key:"z3du51"}],["path",{d:"M4 6h.01",key:"oypzma"}],["path",{d:"M2.29 9.62A10 10 0 1 0 21.31 8.35",key:"qzzz0"}],["path",{d:"M16.24 7.76A6 6 0 1 0 8.23 16.67",key:"1yjesh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M17.99 11.66A6 6 0 0 1 15.77 16.67",key:"1u2y91"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"m13.41 10.59 5.66-5.66",key:"mhq4k0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o6=i("Radiation",[["path",{d:"M12 12h0.01",key:"6ztbls"}],["path",{d:"M7.5 4.2c-.3-.5-.9-.7-1.3-.4C3.9 5.5 2.3 8.1 2 11c-.1.5.4 1 1 1h5c0-1.5.8-2.8 2-3.4-1.1-1.9-2-3.5-2.5-4.4z",key:"wy49g3"}],["path",{d:"M21 12c.6 0 1-.4 1-1-.3-2.9-1.8-5.5-4.1-7.1-.4-.3-1.1-.2-1.3.3-.6.9-1.5 2.5-2.6 4.3 1.2.7 2 2 2 3.5h5z",key:"vklnvr"}],["path",{d:"M7.5 19.8c-.3.5-.1 1.1.4 1.3 2.6 1.2 5.6 1.2 8.2 0 .5-.2.7-.8.4-1.3-.5-.9-1.4-2.5-2.5-4.3-1.2.7-2.8.7-4 0-1.1 1.8-2 3.4-2.5 4.3z",key:"wkdf1o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s6=i("RadioReceiver",[["path",{d:"M5 16v2",key:"g5qcv5"}],["path",{d:"M19 16v2",key:"1gbaio"}],["rect",{width:"20",height:"8",x:"2",y:"8",rx:"2",key:"vjsjur"}],["path",{d:"M18 12h0",key:"1ucjzd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c6=i("RadioTower",[["path",{d:"M4.9 16.1C1 12.2 1 5.8 4.9 1.9",key:"s0qx1y"}],["path",{d:"M7.8 4.7a6.14 6.14 0 0 0-.8 7.5",key:"1idnkw"}],["circle",{cx:"12",cy:"9",r:"2",key:"1092wv"}],["path",{d:"M16.2 4.8c2 2 2.26 5.11.8 7.47",key:"ojru2q"}],["path",{d:"M19.1 1.9a9.96 9.96 0 0 1 0 14.1",key:"rhi7fg"}],["path",{d:"M9.5 18h5",key:"mfy3pd"}],["path",{d:"m8 22 4-11 4 11",key:"25yftu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l6=i("Radio",[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9",key:"1vaf9d"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5",key:"u1ii0m"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5",key:"1j5fej"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19",key:"10b0cb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d6=i("Radius",[["path",{d:"M20.34 17.52a10 10 0 1 0-2.82 2.82",key:"fydyku"}],["circle",{cx:"19",cy:"19",r:"2",key:"17f5cg"}],["path",{d:"m13.41 13.41 4.18 4.18",key:"1gqbwc"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h6=i("RailSymbol",[["path",{d:"M5 15h14",key:"m0yey3"}],["path",{d:"M5 9h14",key:"7tsvo6"}],["path",{d:"m14 20-5-5 6-6-5-5",key:"1jo42i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u6=i("Rainbow",[["path",{d:"M22 17a10 10 0 0 0-20 0",key:"ozegv"}],["path",{d:"M6 17a6 6 0 0 1 12 0",key:"5giftw"}],["path",{d:"M10 17a2 2 0 0 1 4 0",key:"gnsikk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y6=i("Rat",[["path",{d:"M17 5c0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .8.3 1.5.8 2H11c-3.9 0-7 3.1-7 7v0c0 2.2 1.8 4 4 4",key:"16aj0u"}],["path",{d:"M16.8 3.9c.3-.3.6-.5 1-.7 1.5-.6 3.3.1 3.9 1.6.6 1.5-.1 3.3-1.6 3.9l1.6 2.8c.2.3.2.7.2 1-.2.8-.9 1.2-1.7 1.1 0 0-1.6-.3-2.7-.6H17c-1.7 0-3 1.3-3 3",key:"1crdmb"}],["path",{d:"M13.2 18a3 3 0 0 0-2.2-5",key:"1ol3lk"}],["path",{d:"M13 22H4a2 2 0 0 1 0-4h12",key:"bt3f23"}],["path",{d:"M16 9h.01",key:"1bdo4e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p6=i("Ratio",[["rect",{width:"12",height:"20",x:"6",y:"2",rx:"2",key:"1oxtiu"}],["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k6=i("Receipt",[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z",key:"wqdwcb"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17V7",key:"pyj7ub"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f6=i("RectangleHorizontal",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m6=i("RectangleVertical",[["rect",{width:"12",height:"20",x:"6",y:"2",rx:"2",key:"1oxtiu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g6=i("Recycle",[["path",{d:"M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5",key:"x6z5xu"}],["path",{d:"M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12",key:"1x4zh5"}],["path",{d:"m14 16-3 3 3 3",key:"f6jyew"}],["path",{d:"M8.293 13.596 7.196 9.5 3.1 10.598",key:"wf1obh"}],["path",{d:"m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843",key:"9tzpgr"}],["path",{d:"m13.378 9.633 4.096 1.098 1.097-4.096",key:"1oe83g"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v6=i("Redo2",[["path",{d:"m15 14 5-5-5-5",key:"12vg1m"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13",key:"19mnr4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x6=i("RedoDot",[["circle",{cx:"12",cy:"17",r:"1",key:"1ixnty"}],["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M6=i("Redo",[["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w6=i("RefreshCcwDot",[["path",{d:"M3 2v6h6",key:"18ldww"}],["path",{d:"M21 12A9 9 0 0 0 6 5.3L3 8",key:"1pbrqz"}],["path",{d:"M21 22v-6h-6",key:"usdfbe"}],["path",{d:"M3 12a9 9 0 0 0 15 6.7l3-2.7",key:"1hosoe"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L6=i("RefreshCcw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C6=i("RefreshCwOff",[["path",{d:"M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47",key:"1krf6h"}],["path",{d:"M8 16H3v5",key:"1cv678"}],["path",{d:"M3 12C3 9.51 4 7.26 5.64 5.64",key:"ruvoct"}],["path",{d:"m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64",key:"19q130"}],["path",{d:"M21 12c0 1-.16 1.97-.47 2.87",key:"4w8emr"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M22 22 2 2",key:"1r8tn9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S6=i("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I6=i("Refrigerator",[["path",{d:"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z",key:"fpq118"}],["path",{d:"M5 10h14",key:"elsbfy"}],["path",{d:"M15 7v6",key:"1nx30x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j6=i("Regex",[["path",{d:"M17 3v10",key:"15fgeh"}],["path",{d:"m12.67 5.5 8.66 5",key:"1gpheq"}],["path",{d:"m12.67 10.5 8.66-5",key:"1dkfa6"}],["path",{d:"M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z",key:"swwfx4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P6=i("RemoveFormatting",[["path",{d:"M4 7V4h16v3",key:"9msm58"}],["path",{d:"M5 20h6",key:"1h6pxn"}],["path",{d:"M13 4 8 20",key:"kqq6aj"}],["path",{d:"m15 15 5 5",key:"me55sn"}],["path",{d:"m20 15-5 5",key:"11p7ol"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b6=i("Repeat1",[["path",{d:"m17 2 4 4-4 4",key:"nntrym"}],["path",{d:"M3 11v-1a4 4 0 0 1 4-4h14",key:"84bu3i"}],["path",{d:"m7 22-4-4 4-4",key:"1wqhfi"}],["path",{d:"M21 13v1a4 4 0 0 1-4 4H3",key:"1rx37r"}],["path",{d:"M11 10h1v4",key:"70cz1p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A6=i("Repeat2",[["path",{d:"m2 9 3-3 3 3",key:"1ltn5i"}],["path",{d:"M13 18H7a2 2 0 0 1-2-2V6",key:"1r6tfw"}],["path",{d:"m22 15-3 3-3-3",key:"4rnwn2"}],["path",{d:"M11 6h6a2 2 0 0 1 2 2v10",key:"2f72bc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z6=i("Repeat",[["path",{d:"m17 2 4 4-4 4",key:"nntrym"}],["path",{d:"M3 11v-1a4 4 0 0 1 4-4h14",key:"84bu3i"}],["path",{d:"m7 22-4-4 4-4",key:"1wqhfi"}],["path",{d:"M21 13v1a4 4 0 0 1-4 4H3",key:"1rx37r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V6=i("ReplaceAll",[["path",{d:"M14 4c0-1.1.9-2 2-2",key:"1mvvbw"}],["path",{d:"M20 2c1.1 0 2 .9 2 2",key:"1mj6oe"}],["path",{d:"M22 8c0 1.1-.9 2-2 2",key:"v1wql3"}],["path",{d:"M16 10c-1.1 0-2-.9-2-2",key:"821ux0"}],["path",{d:"m3 7 3 3 3-3",key:"x25e72"}],["path",{d:"M6 10V5c0-1.7 1.3-3 3-3h1",key:"13af7h"}],["rect",{width:"8",height:"8",x:"2",y:"14",rx:"2",key:"17ihk4"}],["path",{d:"M14 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2",key:"1w9p8c"}],["path",{d:"M20 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2",key:"m45eaa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H6=i("Replace",[["path",{d:"M14 4c0-1.1.9-2 2-2",key:"1mvvbw"}],["path",{d:"M20 2c1.1 0 2 .9 2 2",key:"1mj6oe"}],["path",{d:"M22 8c0 1.1-.9 2-2 2",key:"v1wql3"}],["path",{d:"M16 10c-1.1 0-2-.9-2-2",key:"821ux0"}],["path",{d:"m3 7 3 3 3-3",key:"x25e72"}],["path",{d:"M6 10V5c0-1.7 1.3-3 3-3h1",key:"13af7h"}],["rect",{width:"8",height:"8",x:"2",y:"14",rx:"2",key:"17ihk4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T6=i("ReplyAll",[["polyline",{points:"7 17 2 12 7 7",key:"t83bqg"}],["polyline",{points:"12 17 7 12 12 7",key:"1g4ajm"}],["path",{d:"M22 18v-2a4 4 0 0 0-4-4H7",key:"1fcyog"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q6=i("Reply",[["polyline",{points:"9 17 4 12 9 7",key:"hvgpf2"}],["path",{d:"M20 18v-2a4 4 0 0 0-4-4H4",key:"5vmcpk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D6=i("Rewind",[["polygon",{points:"11 19 2 12 11 5 11 19",key:"14yba5"}],["polygon",{points:"22 19 13 12 22 5 22 19",key:"1pi1cj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F6=i("Ribbon",[["path",{d:"M17.75 9.01c-.52 2.08-1.83 3.64-3.18 5.49l-2.6 3.54-2.97 4-3.5-2.54 3.85-4.97c-1.86-2.61-2.8-3.77-3.16-5.44",key:"1njedg"}],["path",{d:"M17.75 9.01A7 7 0 0 0 6.2 9.1C6.06 8.5 6 7.82 6 7c0-3.5 2.83-5 5.98-5C15.24 2 18 3.5 18 7c0 .73-.09 1.4-.25 2.01Z",key:"10len7"}],["path",{d:"m9.35 14.53 2.64-3.31",key:"1wfi09"}],["path",{d:"m11.97 18.04 2.99 4 3.54-2.54-3.93-5",key:"1ezyge"}],["path",{d:"M14 8c0 1-1 2-2.01 3.22C11 10 10 9 10 8a2 2 0 1 1 4 0",key:"aw0zq5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R6=i("Rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B6=i("RockingChair",[["polyline",{points:"3.5 2 6.5 12.5 18 12.5",key:"y3iy52"}],["line",{x1:"9.5",x2:"5.5",y1:"12.5",y2:"20",key:"19vg5i"}],["line",{x1:"15",x2:"18.5",y1:"12.5",y2:"20",key:"1inpmv"}],["path",{d:"M2.75 18a13 13 0 0 0 18.5 0",key:"1nquas"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N6=i("RollerCoaster",[["path",{d:"M6 19V5",key:"1r845m"}],["path",{d:"M10 19V6.8",key:"9j2tfs"}],["path",{d:"M14 19v-7.8",key:"10s8qv"}],["path",{d:"M18 5v4",key:"1tajlv"}],["path",{d:"M18 19v-6",key:"ielfq3"}],["path",{d:"M22 19V9",key:"158nzp"}],["path",{d:"M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65",key:"1930oh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zn=i("Rotate3d",[["path",{d:"M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2",key:"10n0gc"}],["path",{d:"m15.194 13.707 3.814 1.86-1.86 3.814",key:"16shm9"}],["path",{d:"M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4",key:"1lxi77"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E6=i("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O6=i("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U6=i("RouteOff",[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5c.4 0 .9-.1 1.3-.2",key:"1effex"}],["path",{d:"M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12",key:"k9y2ds"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M21 15.3a3.5 3.5 0 0 0-3.3-3.3",key:"11nlu2"}],["path",{d:"M15 5h-4.3",key:"6537je"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z6=i("Route",[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",key:"1d8sl"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _6=i("Router",[["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",key:"w68u3i"}],["path",{d:"M6.01 18H6",key:"19vcac"}],["path",{d:"M10.01 18H10",key:"uamcmx"}],["path",{d:"M15 10v4",key:"qjz1xs"}],["path",{d:"M17.84 7.17a4 4 0 0 0-5.66 0",key:"1rif40"}],["path",{d:"M20.66 4.34a8 8 0 0 0-11.31 0",key:"6a5xfq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _n=i("Rows2",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 12h18",key:"1i2n21"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wn=i("Rows3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M21 9H3",key:"1338ky"}],["path",{d:"M21 15H3",key:"9uk58r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W6=i("Rows4",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M21 7.5H3",key:"1hm9pq"}],["path",{d:"M21 12H3",key:"2avoz0"}],["path",{d:"M21 16.5H3",key:"n7jzkj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G6=i("Rss",[["path",{d:"M4 11a9 9 0 0 1 9 9",key:"pv89mb"}],["path",{d:"M4 4a16 16 0 0 1 16 16",key:"k0647b"}],["circle",{cx:"5",cy:"19",r:"1",key:"bfqh0e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $6=i("Ruler",[["path",{d:"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",key:"icamh8"}],["path",{d:"m14.5 12.5 2-2",key:"inckbg"}],["path",{d:"m11.5 9.5 2-2",key:"fmmyf7"}],["path",{d:"m8.5 6.5 2-2",key:"vc6u1g"}],["path",{d:"m17.5 15.5 2-2",key:"wo5hmg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X6=i("RussianRuble",[["path",{d:"M6 11h8a4 4 0 0 0 0-8H9v18",key:"18ai8t"}],["path",{d:"M6 15h8",key:"1y8f6l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K6=i("Sailboat",[["path",{d:"M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z",key:"1404fh"}],["path",{d:"M21 14 10 2 3 14h18Z",key:"1nzg7v"}],["path",{d:"M10 2v16",key:"1labyt"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q6=i("Salad",[["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z",key:"4rw317"}],["path",{d:"M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1",key:"10xrj0"}],["path",{d:"m13 12 4-4",key:"1hckqy"}],["path",{d:"M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2",key:"1p4srx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y6=i("Sandwich",[["path",{d:"M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3",key:"34v9d7"}],["path",{d:"M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83",key:"1k5vfb"}],["path",{d:"m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z",key:"1oe7l6"}],["path",{d:"M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z",key:"1ts2ri"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J6=i("SatelliteDish",[["path",{d:"M4 10a7.31 7.31 0 0 0 10 10Z",key:"1fzpp3"}],["path",{d:"m9 15 3-3",key:"88sc13"}],["path",{d:"M17 13a6 6 0 0 0-6-6",key:"15cc6u"}],["path",{d:"M21 13A10 10 0 0 0 11 3",key:"11nf8s"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e8=i("Satellite",[["path",{d:"M13 7 9 3 5 7l4 4",key:"vyckw6"}],["path",{d:"m17 11 4 4-4 4-4-4",key:"rchckc"}],["path",{d:"m8 12 4 4 6-6-4-4Z",key:"1sshf7"}],["path",{d:"m16 8 3-3",key:"x428zp"}],["path",{d:"M9 21a6 6 0 0 0-6-6",key:"1iajcf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t8=i("SaveAll",[["path",{d:"M6 4a2 2 0 0 1 2-2h10l4 4v10.2a2 2 0 0 1-2 1.8H8a2 2 0 0 1-2-2Z",key:"1unput"}],["path",{d:"M10 2v4h6",key:"1p5sg6"}],["path",{d:"M18 18v-7h-8v7",key:"1oniuk"}],["path",{d:"M18 22H4a2 2 0 0 1-2-2V6",key:"pblm9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n8=i("Save",[["path",{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",key:"1owoqh"}],["polyline",{points:"17 21 17 13 7 13 7 21",key:"1md35c"}],["polyline",{points:"7 3 7 8 15 8",key:"8nz8an"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gn=i("Scale3d",[["circle",{cx:"19",cy:"19",r:"2",key:"17f5cg"}],["circle",{cx:"5",cy:"5",r:"2",key:"1gwv83"}],["path",{d:"M5 7v12h12",key:"vtaa4r"}],["path",{d:"m5 19 6-6",key:"jh6hbb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a8=i("Scale",[["path",{d:"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"7g6ntu"}],["path",{d:"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"ijws7r"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",key:"3gwbw2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i8=i("Scaling",[["path",{d:"M21 3 9 15",key:"15kdhq"}],["path",{d:"M12 3H3v18h18v-9",key:"8suug0"}],["path",{d:"M16 3h5v5",key:"1806ms"}],["path",{d:"M14 15H9v-5",key:"pi4jk9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r8=i("ScanBarcode",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M8 7v10",key:"23sfjj"}],["path",{d:"M12 7v10",key:"jspqdw"}],["path",{d:"M17 7v10",key:"578dap"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o8=i("ScanEye",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M5 12s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5",key:"nhuolu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s8=i("ScanFace",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M8 14s1.5 2 4 2 4-2 4-2",key:"1y1vjs"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 9h.01",key:"x1ddxp"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c8=i("ScanLine",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M7 12h10",key:"b7w52i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l8=i("ScanSearch",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"m16 16-1.9-1.9",key:"1dq9hf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d8=i("ScanText",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M7 8h8",key:"1jbsf9"}],["path",{d:"M7 12h10",key:"b7w52i"}],["path",{d:"M7 16h6",key:"1vyc9m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h8=i("Scan",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u8=i("ScatterChart",[["circle",{cx:"7.5",cy:"7.5",r:".5",key:"1x97lo"}],["circle",{cx:"18.5",cy:"5.5",r:".5",key:"56iowl"}],["circle",{cx:"11.5",cy:"11.5",r:".5",key:"m9xkw9"}],["circle",{cx:"7.5",cy:"16.5",r:".5",key:"14ln9z"}],["circle",{cx:"17.5",cy:"14.5",r:".5",key:"14qxqt"}],["path",{d:"M3 3v18h18",key:"1s2lah"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y8=i("School2",[["circle",{cx:"12",cy:"10",r:"1",key:"1gnqs8"}],["path",{d:"M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z",key:"8z0lq4"}],["path",{d:"M6 17v.01",key:"roodi6"}],["path",{d:"M6 13v.01",key:"67c122"}],["path",{d:"M18 17v.01",key:"12ktxm"}],["path",{d:"M18 13v.01",key:"tn1rt1"}],["path",{d:"M14 22v-5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5",key:"jfgdp0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p8=i("School",[["path",{d:"m4 6 8-4 8 4",key:"1q0ilc"}],["path",{d:"m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2",key:"1vwozw"}],["path",{d:"M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4",key:"cpkuc4"}],["path",{d:"M18 5v17",key:"1sw6gf"}],["path",{d:"M6 5v17",key:"1xfsm0"}],["circle",{cx:"12",cy:"9",r:"2",key:"1092wv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k8=i("ScissorsLineDashed",[["path",{d:"M5.42 9.42 8 12",key:"12pkuq"}],["circle",{cx:"4",cy:"8",r:"2",key:"107mxr"}],["path",{d:"m14 6-8.58 8.58",key:"gvzu5l"}],["circle",{cx:"4",cy:"16",r:"2",key:"1ehqvc"}],["path",{d:"M10.8 14.8 14 18",key:"ax7m9r"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f8=i("ScissorsSquareDashedBottom",[["path",{d:"M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2",key:"1vzg26"}],["path",{d:"M10 22H8",key:"euku7a"}],["path",{d:"M16 22h-2",key:"18d249"}],["circle",{cx:"8",cy:"8",r:"2",key:"14cg06"}],["path",{d:"M9.414 9.414 12 12",key:"qz4lzr"}],["path",{d:"M14.8 14.8 18 18",key:"11flf1"}],["circle",{cx:"8",cy:"16",r:"2",key:"1acxsx"}],["path",{d:"m18 6-8.586 8.586",key:"11kzk1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m8=i("ScissorsSquare",[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"2",key:"1btzen"}],["circle",{cx:"8",cy:"8",r:"2",key:"14cg06"}],["path",{d:"M9.414 9.414 12 12",key:"qz4lzr"}],["path",{d:"M14.8 14.8 18 18",key:"11flf1"}],["circle",{cx:"8",cy:"16",r:"2",key:"1acxsx"}],["path",{d:"m18 6-8.586 8.586",key:"11kzk1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g8=i("Scissors",[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M8.12 8.12 12 12",key:"1alkpv"}],["path",{d:"M20 4 8.12 15.88",key:"xgtan2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M14.8 14.8 20 20",key:"ptml3r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v8=i("ScreenShareOff",[["path",{d:"M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3",key:"i8wdob"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"m22 3-5 5",key:"12jva0"}],["path",{d:"m17 3 5 5",key:"k36vhe"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x8=i("ScreenShare",[["path",{d:"M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3",key:"i8wdob"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"m17 8 5-5",key:"fqif7o"}],["path",{d:"M17 3h5v5",key:"1o3tu8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M8=i("ScrollText",[["path",{d:"M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4",key:"13a6an"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M15 12h-5",key:"r7krc0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w8=i("Scroll",[["path",{d:"M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4",key:"13a6an"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L8=i("SearchCheck",[["path",{d:"m8 11 2 2 4-4",key:"1sed1v"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C8=i("SearchCode",[["path",{d:"m9 9-2 2 2 2",key:"17gsfh"}],["path",{d:"m13 13 2-2-2-2",key:"186z8k"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S8=i("SearchSlash",[["path",{d:"m13.5 8.5-5 5",key:"1cs55j"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I8=i("SearchX",[["path",{d:"m13.5 8.5-5 5",key:"1cs55j"}],["path",{d:"m8.5 8.5 5 5",key:"a8mexj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j8=i("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=i("SendHorizontal",[["path",{d:"m3 3 3 9-3 9 19-9Z",key:"1aobqy"}],["path",{d:"M6 12h16",key:"s4cdu5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P8=i("SendToBack",[["rect",{x:"14",y:"14",width:"8",height:"8",rx:"2",key:"1b0bso"}],["rect",{x:"2",y:"2",width:"8",height:"8",rx:"2",key:"1x09vl"}],["path",{d:"M7 14v1a2 2 0 0 0 2 2h1",key:"pao6x6"}],["path",{d:"M14 7h1a2 2 0 0 1 2 2v1",key:"19tdru"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b8=i("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A8=i("SeparatorHorizontal",[["line",{x1:"3",x2:"21",y1:"12",y2:"12",key:"10d38w"}],["polyline",{points:"8 8 12 4 16 8",key:"zo8t4w"}],["polyline",{points:"16 16 12 20 8 16",key:"1oyrid"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z8=i("SeparatorVertical",[["line",{x1:"12",x2:"12",y1:"3",y2:"21",key:"1efggb"}],["polyline",{points:"8 8 4 12 8 16",key:"bnfmv4"}],["polyline",{points:"16 16 20 12 16 8",key:"u90052"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V8=i("ServerCog",[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5",key:"tn8das"}],["path",{d:"M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5",key:"1g2pve"}],["path",{d:"M6 6h.01",key:"1utrut"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"m15.7 13.4-.9-.3",key:"1jwmzr"}],["path",{d:"m9.2 10.9-.9-.3",key:"qapnim"}],["path",{d:"m10.6 15.7.3-.9",key:"quwk0k"}],["path",{d:"m13.6 15.7-.4-1",key:"cb9xp7"}],["path",{d:"m10.8 9.3-.4-1",key:"1uaiz5"}],["path",{d:"m8.3 13.6 1-.4",key:"s6srou"}],["path",{d:"m14.7 10.8 1-.4",key:"4d31cq"}],["path",{d:"m13.4 8.3-.3.9",key:"1bm987"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H8=i("ServerCrash",[["path",{d:"M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2",key:"4b9dqc"}],["path",{d:"M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2",key:"22nnkd"}],["path",{d:"M6 6h.01",key:"1utrut"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"m13 6-4 6h6l-4 6",key:"14hqih"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T8=i("ServerOff",[["path",{d:"M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5",key:"bt2siv"}],["path",{d:"M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z",key:"1hjrv1"}],["path",{d:"M22 17v-1a2 2 0 0 0-2-2h-1",key:"1iynyr"}],["path",{d:"M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z",key:"161ggg"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q8=i("Server",[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D8=i("Settings2",[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F8=i("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R8=i("Shapes",[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",key:"1bo67w"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1",key:"1bkyp8"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5",key:"w3z12y"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ti=i("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B8=i("Share",[["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["polyline",{points:"16 6 12 2 8 6",key:"m901s6"}],["line",{x1:"12",x2:"12",y1:"2",y2:"15",key:"1p0rca"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N8=i("Sheet",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["line",{x1:"3",x2:"21",y1:"9",y2:"9",key:"1vqk6q"}],["line",{x1:"3",x2:"21",y1:"15",y2:"15",key:"o2sbyz"}],["line",{x1:"9",x2:"9",y1:"9",y2:"21",key:"1ib60c"}],["line",{x1:"15",x2:"15",y1:"9",y2:"21",key:"1n26ft"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E8=i("Shell",[["path",{d:"M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44",key:"1cn552"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w1=i("ShieldAlert",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O8=i("ShieldBan",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"m4 5 14 12",key:"1ta6nf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U8=i("ShieldCheck",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z8=i("ShieldEllipsis",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M12 11h.01",key:"z322tv"}],["path",{d:"M16 11h.01",key:"xkw8gn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _8=i("ShieldHalf",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M12 22V2",key:"zs6s6o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W8=i("ShieldMinus",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M8 11h8",key:"vwpz6n"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G8=i("ShieldOff",[["path",{d:"M19.7 14a6.9 6.9 0 0 0 .3-2V5l-8-3-3.2 1.2",key:"342pvf"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M4.7 4.7 4 5v7c0 6 8 10 8 10a20.3 20.3 0 0 0 5.62-4.38",key:"p0ycf4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $8=i("ShieldPlus",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M8 11h8",key:"vwpz6n"}],["path",{d:"M12 15V7",key:"1ycneb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X8=i("ShieldQuestion",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",key:"mhlwft"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xn=i("ShieldX",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"m14.5 9-5 5",key:"1m49dw"}],["path",{d:"m9.5 9 5 5",key:"wyx7zg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ni=i("Shield",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K8=i("ShipWheel",[["circle",{cx:"12",cy:"12",r:"8",key:"46899m"}],["path",{d:"M12 2v7.5",key:"1e5rl5"}],["path",{d:"m19 5-5.23 5.23",key:"1ezxxf"}],["path",{d:"M22 12h-7.5",key:"le1719"}],["path",{d:"m19 19-5.23-5.23",key:"p3fmgn"}],["path",{d:"M12 14.5V22",key:"dgcmos"}],["path",{d:"M10.23 13.77 5 19",key:"qwopd4"}],["path",{d:"M9.5 12H2",key:"r7bup8"}],["path",{d:"M10.23 10.23 5 5",key:"k2y7lj"}],["circle",{cx:"12",cy:"12",r:"2.5",key:"ix0uyj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q8=i("Ship",[["path",{d:"M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"iegodh"}],["path",{d:"M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76",key:"fp8vka"}],["path",{d:"M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6",key:"qpkstq"}],["path",{d:"M12 10v4",key:"1kjpxc"}],["path",{d:"M12 2v3",key:"qbqxhf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y8=i("Shirt",[["path",{d:"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",key:"1wgbhj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J8=i("ShoppingBag",[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eg=i("ShoppingBasket",[["path",{d:"m5 11 4-7",key:"116ra9"}],["path",{d:"m19 11-4-7",key:"cnml18"}],["path",{d:"M2 11h20",key:"3eubbj"}],["path",{d:"m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4",key:"1x2lvw"}],["path",{d:"m9 11 1 9",key:"1ojof7"}],["path",{d:"M4.5 15.5h15",key:"13mye1"}],["path",{d:"m15 11-1 9",key:"5wnq3a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tg=i("ShoppingCart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ng=i("Shovel",[["path",{d:"M2 22v-5l5-5 5 5-5 5z",key:"1fh25c"}],["path",{d:"M9.5 14.5 16 8",key:"1smz5x"}],["path",{d:"m17 2 5 5-.5.5a3.53 3.53 0 0 1-5 0s0 0 0 0a3.53 3.53 0 0 1 0-5L17 2",key:"1q8uv5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ag=i("ShowerHead",[["path",{d:"m4 4 2.5 2.5",key:"uv2vmf"}],["path",{d:"M13.5 6.5a4.95 4.95 0 0 0-7 7",key:"frdkwv"}],["path",{d:"M15 5 5 15",key:"1ag8rq"}],["path",{d:"M14 17v.01",key:"eokfpp"}],["path",{d:"M10 16v.01",key:"14uyyl"}],["path",{d:"M13 13v.01",key:"1v1k97"}],["path",{d:"M16 10v.01",key:"5169yg"}],["path",{d:"M11 20v.01",key:"cj92p8"}],["path",{d:"M17 14v.01",key:"11cswd"}],["path",{d:"M20 11v.01",key:"19e0od"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ig=i("Shrink",[["path",{d:"m15 15 6 6m-6-6v4.8m0-4.8h4.8",key:"17vawe"}],["path",{d:"M9 19.8V15m0 0H4.2M9 15l-6 6",key:"chjx8e"}],["path",{d:"M15 4.2V9m0 0h4.8M15 9l6-6",key:"lav6yq"}],["path",{d:"M9 4.2V9m0 0H4.2M9 9 3 3",key:"1pxi2q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rg=i("Shrub",[["path",{d:"M12 22v-7l-2-2",key:"eqv9mc"}],["path",{d:"M17 8v.8A6 6 0 0 1 13.8 20v0H10v0A6.5 6.5 0 0 1 7 8h0a5 5 0 0 1 10 0Z",key:"12jcau"}],["path",{d:"m14 14-2 2",key:"847xa2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const og=i("Shuffle",[["path",{d:"M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22",key:"1wmou1"}],["path",{d:"m18 2 4 4-4 4",key:"pucp1d"}],["path",{d:"M2 6h1.9c1.5 0 2.9.9 3.6 2.2",key:"10bdb2"}],["path",{d:"M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8",key:"vgxac0"}],["path",{d:"m18 14 4 4-4 4",key:"10pe0f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sg=i("SigmaSquare",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M16 8.9V7H8l4 5-4 5h8v-1.9",key:"9nih0i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=i("Sigma",[["path",{d:"M18 7V4H6l6 8-6 8h12v-3",key:"zis8ev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lg=i("SignalHigh",[["path",{d:"M2 20h.01",key:"4haj6o"}],["path",{d:"M7 20v-4",key:"j294jx"}],["path",{d:"M12 20v-8",key:"i3yub9"}],["path",{d:"M17 20V8",key:"1tkaf5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dg=i("SignalLow",[["path",{d:"M2 20h.01",key:"4haj6o"}],["path",{d:"M7 20v-4",key:"j294jx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hg=i("SignalMedium",[["path",{d:"M2 20h.01",key:"4haj6o"}],["path",{d:"M7 20v-4",key:"j294jx"}],["path",{d:"M12 20v-8",key:"i3yub9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ug=i("SignalZero",[["path",{d:"M2 20h.01",key:"4haj6o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yg=i("Signal",[["path",{d:"M2 20h.01",key:"4haj6o"}],["path",{d:"M7 20v-4",key:"j294jx"}],["path",{d:"M12 20v-8",key:"i3yub9"}],["path",{d:"M17 20V8",key:"1tkaf5"}],["path",{d:"M22 4v16",key:"sih9yq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pg=i("SignpostBig",[["path",{d:"M10 9H4L2 7l2-2h6",key:"1hq7x2"}],["path",{d:"M14 5h6l2 2-2 2h-6",key:"bv62ej"}],["path",{d:"M10 22V4a2 2 0 1 1 4 0v18",key:"eqpcf2"}],["path",{d:"M8 22h8",key:"rmew8v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kg=i("Signpost",[["path",{d:"M12 3v3",key:"1n5kay"}],["path",{d:"M18.5 13h-13L2 9.5 5.5 6h13L22 9.5Z",key:"27os56"}],["path",{d:"M12 13v8",key:"1l5pq0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fg=i("Siren",[["path",{d:"M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v6H7v-6Z",key:"rmc51c"}],["path",{d:"M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2Z",key:"yyvmjy"}],["path",{d:"M21 12h1",key:"jtio3y"}],["path",{d:"M18.5 4.5 18 5",key:"g5sp9y"}],["path",{d:"M2 12h1",key:"1uaihz"}],["path",{d:"M12 2v1",key:"11qlp1"}],["path",{d:"m4.929 4.929.707.707",key:"1i51kw"}],["path",{d:"M12 12v6",key:"3ahymv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mg=i("SkipBack",[["polygon",{points:"19 20 9 12 19 4 19 20",key:"o2sva"}],["line",{x1:"5",x2:"5",y1:"19",y2:"5",key:"1ocqjk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gg=i("SkipForward",[["polygon",{points:"5 4 15 12 5 20 5 4",key:"16p6eg"}],["line",{x1:"19",x2:"19",y1:"5",y2:"19",key:"futhcm"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vg=i("Skull",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["path",{d:"M8 20v2h8v-2",key:"ded4og"}],["path",{d:"m12.5 17-.5-1-.5 1h1z",key:"3me087"}],["path",{d:"M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20",key:"xq9p5u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xg=i("Slack",[["rect",{width:"3",height:"8",x:"13",y:"2",rx:"1.5",key:"diqz80"}],["path",{d:"M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5",key:"183iwg"}],["rect",{width:"3",height:"8",x:"8",y:"14",rx:"1.5",key:"hqg7r1"}],["path",{d:"M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5",key:"76g71w"}],["rect",{width:"8",height:"3",x:"14",y:"13",rx:"1.5",key:"1kmz0a"}],["path",{d:"M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5",key:"jc4sz0"}],["rect",{width:"8",height:"3",x:"2",y:"8",rx:"1.5",key:"1omvl4"}],["path",{d:"M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5",key:"16f3cl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mg=i("Slash",[["path",{d:"M22 2 2 22",key:"y4kqgn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wg=i("Slice",[["path",{d:"m8 14-6 6h9v-3",key:"zo3j9a"}],["path",{d:"M18.37 3.63 8 14l3 3L21.37 6.63a2.12 2.12 0 1 0-3-3Z",key:"1dzx0j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lg=i("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cg=i("Sliders",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sg=i("SmartphoneCharging",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12.667 8 10 12h4l-2.667 4",key:"h9lk2d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ig=i("SmartphoneNfc",[["rect",{width:"7",height:"12",x:"2",y:"6",rx:"1",key:"5nje8w"}],["path",{d:"M13 8.32a7.43 7.43 0 0 1 0 7.36",key:"1g306n"}],["path",{d:"M16.46 6.21a11.76 11.76 0 0 1 0 11.58",key:"uqvjvo"}],["path",{d:"M19.91 4.1a15.91 15.91 0 0 1 .01 15.8",key:"ujntz3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jg=i("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pg=i("SmilePlus",[["path",{d:"M22 11v1a10 10 0 1 1-9-10",key:"ew0xw9"}],["path",{d:"M8 14s1.5 2 4 2 4-2 4-2",key:"1y1vjs"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}],["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bg=i("Smile",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 14s1.5 2 4 2 4-2 4-2",key:"1y1vjs"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ag=i("Snail",[["path",{d:"M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0",key:"hneq2s"}],["circle",{cx:"10",cy:"13",r:"8",key:"194lz3"}],["path",{d:"M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6",key:"ixqyt7"}],["path",{d:"M18 3 19.1 5.2",key:"9tjm43"}],["path",{d:"M22 3 20.9 5.2",key:"j3odrs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zg=i("Snowflake",[["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}],["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"m20 16-4-4 4-4",key:"rquw4f"}],["path",{d:"m4 8 4 4-4 4",key:"12s3z9"}],["path",{d:"m16 4-4 4-4-4",key:"1tumq1"}],["path",{d:"m8 20 4-4 4 4",key:"9p200w"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vg=i("Sofa",[["path",{d:"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3",key:"1dgpiv"}],["path",{d:"M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z",key:"u5qfb7"}],["path",{d:"M4 18v2",key:"jwo5n2"}],["path",{d:"M20 18v2",key:"1ar1qi"}],["path",{d:"M12 4v9",key:"oqhhn3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hg=i("Soup",[["path",{d:"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z",key:"4rw317"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M19.5 12 22 6",key:"shfsr5"}],["path",{d:"M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62",key:"rpc6vp"}],["path",{d:"M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62",key:"1lf63m"}],["path",{d:"M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62",key:"97tijn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tg=i("Space",[["path",{d:"M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",key:"lt2kga"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qg=i("Spade",[["path",{d:"M5 9c-1.5 1.5-3 3.2-3 5.5A5.5 5.5 0 0 0 7.5 20c1.8 0 3-.5 4.5-2 1.5 1.5 2.7 2 4.5 2a5.5 5.5 0 0 0 5.5-5.5c0-2.3-1.5-4-3-5.5l-7-7-7 7Z",key:"40bo9n"}],["path",{d:"M12 18v4",key:"jadmvz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dg=i("Sparkle",[["path",{d:"m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z",key:"nraa5p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kn=i("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fg=i("Speaker",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["circle",{cx:"12",cy:"14",r:"4",key:"1jruaj"}],["path",{d:"M12 14h.01",key:"1etili"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rg=i("Speech",[["path",{d:"M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20",key:"11atix"}],["path",{d:"M19.8 17.8a7.5 7.5 0 0 0 .003-10.603",key:"yol142"}],["path",{d:"M17 15a3.5 3.5 0 0 0-.025-4.975",key:"ssbmkc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bg=i("SpellCheck2",[["path",{d:"m6 16 6-12 6 12",key:"1b4byz"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M4 21c1.1 0 1.1-1 2.3-1s1.1 1 2.3 1c1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1",key:"8mdmtu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ng=i("SpellCheck",[["path",{d:"m6 16 6-12 6 12",key:"1b4byz"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"m16 20 2 2 4-4",key:"13tcca"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eg=i("Spline",[["circle",{cx:"19",cy:"5",r:"2",key:"mhkx31"}],["circle",{cx:"5",cy:"19",r:"2",key:"v8kfzx"}],["path",{d:"M5 17A12 12 0 0 1 17 5",key:"1okkup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Og=i("SplitSquareHorizontal",[["path",{d:"M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3",key:"lubmu8"}],["path",{d:"M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3",key:"1ag34g"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ug=i("SplitSquareVertical",[["path",{d:"M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3",key:"1pi83i"}],["path",{d:"M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3",key:"ido5k7"}],["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zg=i("Split",[["path",{d:"M16 3h5v5",key:"1806ms"}],["path",{d:"M8 3H3v5",key:"15dfkv"}],["path",{d:"M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3",key:"1qrqzj"}],["path",{d:"m15 9 6-6",key:"ko1vev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _g=i("SprayCan",[["path",{d:"M3 3h.01",key:"159qn6"}],["path",{d:"M7 5h.01",key:"1hq22a"}],["path",{d:"M11 7h.01",key:"1osv80"}],["path",{d:"M3 7h.01",key:"1xzrh3"}],["path",{d:"M7 9h.01",key:"19b3jx"}],["path",{d:"M3 11h.01",key:"1eifu7"}],["rect",{width:"4",height:"4",x:"15",y:"5",key:"mri9e4"}],["path",{d:"m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2",key:"aib6hk"}],["path",{d:"m13 14 8-2",key:"1d7bmk"}],["path",{d:"m13 19 8-2",key:"1y2vml"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wg=i("Sprout",[["path",{d:"M7 20h10",key:"e6iznv"}],["path",{d:"M10 20c5.5-2.5.8-6.4 3-10",key:"161w41"}],["path",{d:"M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z",key:"9gtqwd"}],["path",{d:"M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z",key:"bkxnd2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gg=i("SquareAsterisk",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 8v8",key:"napkw2"}],["path",{d:"m8.5 14 7-4",key:"12hpby"}],["path",{d:"m8.5 10 7 4",key:"wwy2dy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $g=i("SquareCode",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m10 10-2 2 2 2",key:"p6et6i"}],["path",{d:"m14 14 2-2-2-2",key:"m075q2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xg=i("SquareDashedBottomCode",[["path",{d:"m10 10-2 2 2 2",key:"p6et6i"}],["path",{d:"m14 14 2-2-2-2",key:"m075q2"}],["path",{d:"M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",key:"as5y1o"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 21h1",key:"v9vybs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kg=i("SquareDashedBottom",[["path",{d:"M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",key:"as5y1o"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 21h1",key:"v9vybs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qg=i("SquareDot",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yg=i("SquareEqual",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 10h10",key:"1101jm"}],["path",{d:"M7 14h10",key:"1mhdw3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jg=i("SquareSlash",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["line",{x1:"9",x2:"15",y1:"15",y2:"9",key:"1dfufj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e7=i("SquareStack",[["path",{d:"M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",key:"4i38lg"}],["path",{d:"M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",key:"mlte4a"}],["rect",{width:"8",height:"8",x:"14",y:"14",rx:"2",key:"1fa9i4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qn=i("SquareUserRound",[["path",{d:"M18 21a6 6 0 0 0-12 0",key:"kaz2du"}],["circle",{cx:"12",cy:"11",r:"4",key:"1gt34v"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yn=i("SquareUser",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2",key:"1m6ac2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t7=i("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n7=i("Squircle",[["path",{d:"M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9",key:"garfkc"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a7=i("Squirrel",[["path",{d:"M15.236 22a3 3 0 0 0-2.2-5",key:"21bitc"}],["path",{d:"M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4",key:"oh0fg0"}],["path",{d:"M18 13h.01",key:"9veqaj"}],["path",{d:"M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10",key:"980v8a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i7=i("Stamp",[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z",key:"1sy9ra"}],["path",{d:"M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 2 1 3.5V13",key:"cnxgux"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r7=i("StarHalf",[["path",{d:"M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2",key:"nare05"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o7=i("StarOff",[["path",{d:"M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43",key:"16m0ql"}],["path",{d:"M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91",key:"1vt8nq"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s7=i("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c7=i("StepBack",[["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["polygon",{points:"14,20 4,12 14,4",key:"ypakod"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l7=i("StepForward",[["line",{x1:"6",x2:"6",y1:"4",y2:"20",key:"fy8qot"}],["polygon",{points:"10,4 20,12 10,20",key:"1mc1pf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ai=i("Stethoscope",[["path",{d:"M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3",key:"1jd90r"}],["path",{d:"M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4",key:"126ukv"}],["circle",{cx:"20",cy:"10",r:"2",key:"ts1r5v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d7=i("Sticker",[["path",{d:"M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z",key:"1wis1t"}],["path",{d:"M15 3v6h6",key:"edgan2"}],["path",{d:"M10 16s.8 1 2 1c1.3 0 2-1 2-1",key:"1vvgv3"}],["path",{d:"M8 13h0",key:"jdup5h"}],["path",{d:"M16 13h0",key:"l4i2ga"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h7=i("StickyNote",[["path",{d:"M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z",key:"1wis1t"}],["path",{d:"M15 3v6h6",key:"edgan2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u7=i("StopCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["rect",{width:"6",height:"6",x:"9",y:"9",key:"1wrtvo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y7=i("Store",[["path",{d:"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",key:"ztvudi"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["path",{d:"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",key:"2ebpfo"}],["path",{d:"M2 7h20",key:"1fcdvo"}],["path",{d:"M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7",key:"jon5kx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p7=i("StretchHorizontal",[["rect",{width:"20",height:"6",x:"2",y:"4",rx:"2",key:"qdearl"}],["rect",{width:"20",height:"6",x:"2",y:"14",rx:"2",key:"1xrn6j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k7=i("StretchVertical",[["rect",{width:"6",height:"20",x:"4",y:"2",rx:"2",key:"19qu7m"}],["rect",{width:"6",height:"20",x:"14",y:"2",rx:"2",key:"24v0nk"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f7=i("Strikethrough",[["path",{d:"M16 4H9a3 3 0 0 0-2.83 4",key:"43sutm"}],["path",{d:"M14 12a4 4 0 0 1 0 8H6",key:"nlfj13"}],["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m7=i("Subscript",[["path",{d:"m4 5 8 8",key:"1eunvl"}],["path",{d:"m12 5-8 8",key:"1ah0jp"}],["path",{d:"M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07",key:"e8ta8j"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g7=i("Subtitles",[["path",{d:"M7 13h4",key:"1m1xj0"}],["path",{d:"M15 13h2",key:"vgjay3"}],["path",{d:"M7 9h2",key:"1q072n"}],["path",{d:"M13 9h4",key:"o7fxw0"}],["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z",key:"5somay"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v7=i("SunDim",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 4h.01",key:"1ujb9j"}],["path",{d:"M20 12h.01",key:"1ykeid"}],["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M4 12h.01",key:"158zrr"}],["path",{d:"M17.657 6.343h.01",key:"31pqzk"}],["path",{d:"M17.657 17.657h.01",key:"jehnf4"}],["path",{d:"M6.343 17.657h.01",key:"gdk6ow"}],["path",{d:"M6.343 6.343h.01",key:"1uurf0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x7=i("SunMedium",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 3v1",key:"1asbbs"}],["path",{d:"M12 20v1",key:"1wcdkc"}],["path",{d:"M3 12h1",key:"lp3yf2"}],["path",{d:"M20 12h1",key:"1vloll"}],["path",{d:"m18.364 5.636-.707.707",key:"1hakh0"}],["path",{d:"m6.343 17.657-.707.707",key:"18m9nf"}],["path",{d:"m5.636 5.636.707.707",key:"1xv1c5"}],["path",{d:"m17.657 17.657.707.707",key:"vl76zb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M7=i("SunMoon",[["path",{d:"M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4",key:"1fu5g2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.9 4.9 1.4 1.4",key:"b9915j"}],["path",{d:"m17.7 17.7 1.4 1.4",key:"qc3ed3"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.3 17.7-1.4 1.4",key:"5gca6"}],["path",{d:"m19.1 4.9-1.4 1.4",key:"wpu9u6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w7=i("SunSnow",[["path",{d:"M10 9a3 3 0 1 0 0 6",key:"6zmtdl"}],["path",{d:"M2 12h1",key:"1uaihz"}],["path",{d:"M14 21V3",key:"1llu3z"}],["path",{d:"M10 4V3",key:"pkzwkn"}],["path",{d:"M10 21v-1",key:"1u8rkd"}],["path",{d:"m3.64 18.36.7-.7",key:"105rm9"}],["path",{d:"m4.34 6.34-.7-.7",key:"d3unjp"}],["path",{d:"M14 12h8",key:"4f43i9"}],["path",{d:"m17 4-3 3",key:"15jcng"}],["path",{d:"m14 17 3 3",key:"6tlq38"}],["path",{d:"m21 15-3-3 3-3",key:"1nlnje"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L7=i("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C7=i("Sunrise",[["path",{d:"M12 2v8",key:"1q4o3n"}],["path",{d:"m4.93 10.93 1.41 1.41",key:"2a7f42"}],["path",{d:"M2 18h2",key:"j10viu"}],["path",{d:"M20 18h2",key:"wocana"}],["path",{d:"m19.07 10.93-1.41 1.41",key:"15zs5n"}],["path",{d:"M22 22H2",key:"19qnx5"}],["path",{d:"m8 6 4-4 4 4",key:"ybng9g"}],["path",{d:"M16 18a4 4 0 0 0-8 0",key:"1lzouq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S7=i("Sunset",[["path",{d:"M12 10V2",key:"16sf7g"}],["path",{d:"m4.93 10.93 1.41 1.41",key:"2a7f42"}],["path",{d:"M2 18h2",key:"j10viu"}],["path",{d:"M20 18h2",key:"wocana"}],["path",{d:"m19.07 10.93-1.41 1.41",key:"15zs5n"}],["path",{d:"M22 22H2",key:"19qnx5"}],["path",{d:"m16 6-4 4-4-4",key:"6wukr"}],["path",{d:"M16 18a4 4 0 0 0-8 0",key:"1lzouq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I7=i("Superscript",[["path",{d:"m4 19 8-8",key:"hr47gm"}],["path",{d:"m12 19-8-8",key:"1dhhmo"}],["path",{d:"M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06",key:"1dfcux"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j7=i("SwissFranc",[["path",{d:"M10 21V3h8",key:"br2l0g"}],["path",{d:"M6 16h9",key:"2py0wn"}],["path",{d:"M10 9.5h7",key:"13dmhz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P7=i("SwitchCamera",[["path",{d:"M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",key:"mtk2lu"}],["path",{d:"M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5",key:"120jsl"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"m18 22-3-3 3-3",key:"kgdoj7"}],["path",{d:"m6 2 3 3-3 3",key:"1fnbkv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b7=i("Sword",[["polyline",{points:"14.5 17.5 3 6 3 3 6 3 17.5 14.5",key:"1hfsw2"}],["line",{x1:"13",x2:"19",y1:"19",y2:"13",key:"1vrmhu"}],["line",{x1:"16",x2:"20",y1:"16",y2:"20",key:"1bron3"}],["line",{x1:"19",x2:"21",y1:"21",y2:"19",key:"13pww6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A7=i("Swords",[["polyline",{points:"14.5 17.5 3 6 3 3 6 3 17.5 14.5",key:"1hfsw2"}],["line",{x1:"13",x2:"19",y1:"19",y2:"13",key:"1vrmhu"}],["line",{x1:"16",x2:"20",y1:"16",y2:"20",key:"1bron3"}],["line",{x1:"19",x2:"21",y1:"21",y2:"19",key:"13pww6"}],["polyline",{points:"14.5 6.5 18 3 21 3 21 6 17.5 9.5",key:"hbey2j"}],["line",{x1:"5",x2:"9",y1:"14",y2:"18",key:"1hf58s"}],["line",{x1:"7",x2:"4",y1:"17",y2:"20",key:"pidxm4"}],["line",{x1:"3",x2:"5",y1:"19",y2:"21",key:"1pehsh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ca=i("Syringe",[["path",{d:"m18 2 4 4",key:"22kx64"}],["path",{d:"m17 7 3-3",key:"1w1zoj"}],["path",{d:"M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5",key:"1exhtz"}],["path",{d:"m9 11 4 4",key:"rovt3i"}],["path",{d:"m5 19-3 3",key:"59f2uf"}],["path",{d:"m14 4 6 6",key:"yqp9t2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z7=i("Table2",[["path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",key:"gugj83"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V7=i("TableProperties",[["path",{d:"M15 3v18",key:"14nvp0"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M21 9H3",key:"1338ky"}],["path",{d:"M21 15H3",key:"9uk58r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H7=i("Table",[["path",{d:"M12 3v18",key:"108xh3"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T7=i("TabletSmartphone",[["rect",{width:"10",height:"14",x:"3",y:"8",rx:"2",key:"1vrsiq"}],["path",{d:"M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4",key:"1j4zmg"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q7=i("Tablet",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["line",{x1:"12",x2:"12.01",y1:"18",y2:"18",key:"1dp563"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D7=i("Tablets",[["circle",{cx:"7",cy:"7",r:"5",key:"x29byf"}],["circle",{cx:"17",cy:"17",r:"5",key:"1op1d2"}],["path",{d:"M12 17h10",key:"ls21zv"}],["path",{d:"m3.46 10.54 7.08-7.08",key:"1rehiu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F7=i("Tag",[["path",{d:"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z",key:"14b2ls"}],["path",{d:"M7 7h.01",key:"7u93v4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R7=i("Tags",[["path",{d:"M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z",key:"gt587u"}],["path",{d:"M6 9.01V9",key:"1flxpt"}],["path",{d:"m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19",key:"1cbfv1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B7=i("Tally1",[["path",{d:"M4 4v16",key:"6qkkli"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N7=i("Tally2",[["path",{d:"M4 4v16",key:"6qkkli"}],["path",{d:"M9 4v16",key:"81ygyz"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E7=i("Tally3",[["path",{d:"M4 4v16",key:"6qkkli"}],["path",{d:"M9 4v16",key:"81ygyz"}],["path",{d:"M14 4v16",key:"12vmem"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O7=i("Tally4",[["path",{d:"M4 4v16",key:"6qkkli"}],["path",{d:"M9 4v16",key:"81ygyz"}],["path",{d:"M14 4v16",key:"12vmem"}],["path",{d:"M19 4v16",key:"8ij5ei"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U7=i("Tally5",[["path",{d:"M4 4v16",key:"6qkkli"}],["path",{d:"M9 4v16",key:"81ygyz"}],["path",{d:"M14 4v16",key:"12vmem"}],["path",{d:"M19 4v16",key:"8ij5ei"}],["path",{d:"M22 6 2 18",key:"h9moai"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z7=i("Tangent",[["circle",{cx:"17",cy:"4",r:"2",key:"y5j2s2"}],["path",{d:"M15.59 5.41 5.41 15.59",key:"l0vprr"}],["circle",{cx:"4",cy:"17",r:"2",key:"9p4efm"}],["path",{d:"M12 22s-4-9-1.5-11.5S22 12 22 12",key:"1twk4o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _7=i("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W7=i("TentTree",[["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}],["path",{d:"m14 5 3-3 3 3",key:"1sorif"}],["path",{d:"m14 10 3-3 3 3",key:"1jyi9h"}],["path",{d:"M17 14V2",key:"8ymqnk"}],["path",{d:"M17 14H7l-5 8h20Z",key:"13ar7p"}],["path",{d:"M8 14v8",key:"1ghmqk"}],["path",{d:"m9 14 5 8",key:"13pgi6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G7=i("Tent",[["path",{d:"M3.5 21 14 3",key:"1szst5"}],["path",{d:"M20.5 21 10 3",key:"1310c3"}],["path",{d:"M15.5 21 12 15l-3.5 6",key:"1ddtfw"}],["path",{d:"M2 21h20",key:"1nyx9w"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $7=i("TerminalSquare",[["path",{d:"m7 11 2-2-2-2",key:"1lz0vl"}],["path",{d:"M11 13h4",key:"1p7l4v"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X7=i("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K7=i("TestTube2",[["path",{d:"M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01v0a2.83 2.83 0 0 1 0-4L17 3",key:"dg8b2p"}],["path",{d:"m16 2 6 6",key:"1gw87d"}],["path",{d:"M12 16H4",key:"1cjfip"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const la=i("TestTube",[["path",{d:"M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2",key:"187lwq"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M14.5 16h-5",key:"1ox875"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q7=i("TestTubes",[["path",{d:"M9 2v17.5A2.5 2.5 0 0 1 6.5 22v0A2.5 2.5 0 0 1 4 19.5V2",key:"12z67u"}],["path",{d:"M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5v0a2.5 2.5 0 0 1-2.5-2.5V2",key:"1q2nfy"}],["path",{d:"M3 2h7",key:"7s29d5"}],["path",{d:"M14 2h7",key:"7sicin"}],["path",{d:"M9 16H4",key:"1bfye3"}],["path",{d:"M20 16h-5",key:"ddnjpe"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y7=i("TextCursorInput",[["path",{d:"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1",key:"18xjzo"}],["path",{d:"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5",key:"fj48gi"}],["path",{d:"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1",key:"1n9rhb"}],["path",{d:"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7",key:"13ksps"}],["path",{d:"M9 7v10",key:"1vc8ob"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J7=i("TextCursor",[["path",{d:"M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1",key:"uvaxm9"}],["path",{d:"M7 22h1a4 4 0 0 0 4-4v-1",key:"11xy8d"}],["path",{d:"M7 2h1a4 4 0 0 1 4 4v1",key:"1uw06m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ev=i("TextQuote",[["path",{d:"M17 6H3",key:"16j9eg"}],["path",{d:"M21 12H8",key:"scolzb"}],["path",{d:"M21 18H8",key:"1wfozv"}],["path",{d:"M3 12v6",key:"fv4c87"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jn=i("TextSelect",[["path",{d:"M5 3a2 2 0 0 0-2 2",key:"y57alp"}],["path",{d:"M19 3a2 2 0 0 1 2 2",key:"18rm91"}],["path",{d:"M21 19a2 2 0 0 1-2 2",key:"1j7049"}],["path",{d:"M5 21a2 2 0 0 1-2-2",key:"sbafld"}],["path",{d:"M9 3h1",key:"1yesri"}],["path",{d:"M9 21h1",key:"15o7lz"}],["path",{d:"M14 3h1",key:"1ec4yj"}],["path",{d:"M14 21h1",key:"v9vybs"}],["path",{d:"M3 9v1",key:"1r0deq"}],["path",{d:"M21 9v1",key:"mxsmne"}],["path",{d:"M3 14v1",key:"vnatye"}],["path",{d:"M21 14v1",key:"169vum"}],["line",{x1:"7",x2:"15",y1:"8",y2:"8",key:"1758g8"}],["line",{x1:"7",x2:"17",y1:"12",y2:"12",key:"197423"}],["line",{x1:"7",x2:"13",y1:"16",y2:"16",key:"37cgm6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tv=i("Text",[["path",{d:"M17 6.1H3",key:"wptmhv"}],["path",{d:"M21 12.1H3",key:"1j38uz"}],["path",{d:"M15.1 18H3",key:"1nb16a"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nv=i("Theater",[["path",{d:"M2 10s3-3 3-8",key:"3xiif0"}],["path",{d:"M22 10s-3-3-3-8",key:"ioaa5q"}],["path",{d:"M10 2c0 4.4-3.6 8-8 8",key:"16fkpi"}],["path",{d:"M14 2c0 4.4 3.6 8 8 8",key:"b9eulq"}],["path",{d:"M2 10s2 2 2 5",key:"1au1lb"}],["path",{d:"M22 10s-2 2-2 5",key:"qi2y5e"}],["path",{d:"M8 15h8",key:"45n4r"}],["path",{d:"M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",key:"1vsc2m"}],["path",{d:"M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",key:"hrha4u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const av=i("ThermometerSnowflake",[["path",{d:"M2 12h10",key:"19562f"}],["path",{d:"M9 4v16",key:"81ygyz"}],["path",{d:"m3 9 3 3-3 3",key:"1sas0l"}],["path",{d:"M12 6 9 9 6 6",key:"pfrgxu"}],["path",{d:"m6 18 3-3 1.5 1.5",key:"1e277p"}],["path",{d:"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"iof6y5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iv=i("ThermometerSun",[["path",{d:"M12 9a4 4 0 0 0-2 7.5",key:"1jvsq6"}],["path",{d:"M12 3v2",key:"1w22ol"}],["path",{d:"m6.6 18.4-1.4 1.4",key:"w2yidj"}],["path",{d:"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"iof6y5"}],["path",{d:"M4 13H2",key:"118le4"}],["path",{d:"M6.34 7.34 4.93 5.93",key:"1brd51"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rv=i("Thermometer",[["path",{d:"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"17jzev"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ov=i("ThumbsDown",[["path",{d:"M17 14V2",key:"8ymqnk"}],["path",{d:"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z",key:"s6e0r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sv=i("ThumbsUp",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z",key:"y3tblf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cv=i("Ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lv=i("TimerOff",[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7",key:"10he05"}],["path",{d:"M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2",key:"15f7sh"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M12 12v-2",key:"fwoke6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dv=i("TimerReset",[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"M12 14v-4",key:"1evpnu"}],["path",{d:"M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6",key:"1ts96g"}],["path",{d:"M9 17H4v5",key:"8t5av"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hv=i("Timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uv=i("ToggleLeft",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"6",ry:"6",key:"f2vt7d"}],["circle",{cx:"8",cy:"12",r:"2",key:"1nvbw3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yv=i("ToggleRight",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"6",ry:"6",key:"f2vt7d"}],["circle",{cx:"16",cy:"12",r:"2",key:"4ma0v8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pv=i("Tornado",[["path",{d:"M21 4H3",key:"1hwok0"}],["path",{d:"M18 8H6",key:"41n648"}],["path",{d:"M19 12H9",key:"1g4lpz"}],["path",{d:"M16 16h-6",key:"1j5d54"}],["path",{d:"M11 20H9",key:"39obr8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kv=i("Torus",[["ellipse",{cx:"12",cy:"11",rx:"3",ry:"2",key:"1b2qxu"}],["ellipse",{cx:"12",cy:"12.5",rx:"10",ry:"8.5",key:"h8emeu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fv=i("TouchpadOff",[["path",{d:"M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16",key:"lnt0bk"}],["path",{d:"M2 14h12",key:"d8icqz"}],["path",{d:"M22 14h-2",key:"jrx26d"}],["path",{d:"M12 20v-6",key:"1rm09r"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M22 16V6a2 2 0 0 0-2-2H10",key:"11y8e4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mv=i("Touchpad",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"M2 14h20",key:"myj16y"}],["path",{d:"M12 20v-6",key:"1rm09r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gv=i("TowerControl",[["path",{d:"M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z",key:"1pledb"}],["path",{d:"M8 13v9",key:"hmv0ci"}],["path",{d:"M16 22v-9",key:"ylnf1u"}],["path",{d:"m9 6 1 7",key:"dpdgam"}],["path",{d:"m15 6-1 7",key:"ls7zgu"}],["path",{d:"M12 6V2",key:"1pj48d"}],["path",{d:"M13 2h-2",key:"mj6ths"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vv=i("ToyBrick",[["rect",{width:"18",height:"12",x:"3",y:"8",rx:"1",key:"158fvp"}],["path",{d:"M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3",key:"s0042v"}],["path",{d:"M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3",key:"9wmeh2"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xv=i("Tractor",[["path",{d:"M3 4h9l1 7",key:"1ftpo8"}],["path",{d:"M4 11V4",key:"9ft8pt"}],["path",{d:"M8 10V4",key:"1y5f7n"}],["path",{d:"M18 5c-.6 0-1 .4-1 1v5.6",key:"10zbvr"}],["path",{d:"m10 11 11 .9c.6 0 .9.5.8 1.1l-.8 5h-1",key:"2w242w"}],["circle",{cx:"7",cy:"15",r:".5",key:"fbsjqy"}],["circle",{cx:"7",cy:"15",r:"5",key:"ddtuc"}],["path",{d:"M16 18h-5",key:"bq60fd"}],["circle",{cx:"18",cy:"18",r:"2",key:"1emm8v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mv=i("TrafficCone",[["path",{d:"M9.3 6.2a4.55 4.55 0 0 0 5.4 0",key:"flyxqv"}],["path",{d:"M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3",key:"1nlxxg"}],["path",{d:"M13.9 3.5a1.93 1.93 0 0 0-3.8-.1l-3 10c-.1.2-.1.4-.1.6 0 1.7 2.2 3 5 3s5-1.3 5-3c0-.2 0-.4-.1-.5Z",key:"vz7x1l"}],["path",{d:"m7.5 12.2-4.7 2.7c-.5.3-.8.7-.8 1.1s.3.8.8 1.1l7.6 4.5c.9.5 2.1.5 3 0l7.6-4.5c.7-.3 1-.7 1-1.1s-.3-.8-.8-1.1l-4.7-2.8",key:"1xfzlw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wv=i("TrainFrontTunnel",[["path",{d:"M2 22V12a10 10 0 1 1 20 0v10",key:"o0fyp0"}],["path",{d:"M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8",key:"m8q3n9"}],["path",{d:"M10 15h.01",key:"44in9x"}],["path",{d:"M14 15h.01",key:"5mohn5"}],["path",{d:"M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z",key:"hckbmu"}],["path",{d:"m9 19-2 3",key:"iij7hm"}],["path",{d:"m15 19 2 3",key:"npx8sa"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lv=i("TrainFront",[["path",{d:"M8 3.1V7a4 4 0 0 0 8 0V3.1",key:"1v71zp"}],["path",{d:"m9 15-1-1",key:"1yrq24"}],["path",{d:"m15 15 1-1",key:"1t0d6s"}],["path",{d:"M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z",key:"1p0hjs"}],["path",{d:"m8 19-2 3",key:"13i0xs"}],["path",{d:"m16 19 2 3",key:"xo31yx"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cv=i("TrainTrack",[["path",{d:"M2 17 17 2",key:"18b09t"}],["path",{d:"m2 14 8 8",key:"1gv9hu"}],["path",{d:"m5 11 8 8",key:"189pqp"}],["path",{d:"m8 8 8 8",key:"1imecy"}],["path",{d:"m11 5 8 8",key:"ummqn6"}],["path",{d:"m14 2 8 8",key:"1vk7dn"}],["path",{d:"M7 22 22 7",key:"15mb1i"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e1=i("TramFront",[["rect",{width:"16",height:"16",x:"4",y:"3",rx:"2",key:"1wxw4b"}],["path",{d:"M4 11h16",key:"mpoxn0"}],["path",{d:"M12 3v8",key:"1h2ygw"}],["path",{d:"m8 19-2 3",key:"13i0xs"}],["path",{d:"m18 22-2-3",key:"1p0ohu"}],["path",{d:"M8 15h0",key:"q9eq1f"}],["path",{d:"M16 15h0",key:"pzrbjg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sv=i("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iv=i("Trash",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jv=i("TreeDeciduous",[["path",{d:"M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z",key:"oadzkq"}],["path",{d:"M12 19v3",key:"npa21l"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pv=i("TreePine",[["path",{d:"m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z",key:"cpyugq"}],["path",{d:"M12 22v-3",key:"kmzjlo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bv=i("Trees",[["path",{d:"M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z",key:"yh07w9"}],["path",{d:"M7 16v6",key:"1a82de"}],["path",{d:"M13 19v3",key:"13sx9i"}],["path",{d:"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",key:"1sj9kv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Av=i("Trello",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["rect",{width:"3",height:"9",x:"7",y:"7",key:"14n3xi"}],["rect",{width:"3",height:"5",x:"14",y:"7",key:"s4azjd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zv=i("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ii=i("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vv=i("TriangleRight",[["path",{d:"M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z",key:"183wce"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hv=i("Triangle",[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"14u9p9"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tv=i("Trophy",[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qv=i("Truck",[["path",{d:"M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11",key:"hs4xqm"}],["path",{d:"M14 9h4l4 4v4c0 .6-.4 1-1 1h-2",key:"11fp61"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dv=i("Turtle",[["path",{d:"m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z",key:"1lbbv7"}],["path",{d:"M4.82 7.9 8 10",key:"m9wose"}],["path",{d:"M15.18 7.9 12 10",key:"p8dp2u"}],["path",{d:"M16.93 10H20a2 2 0 0 1 0 4H2",key:"12nsm7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fv=i("Tv2",[["path",{d:"M7 21h10",key:"1b0cd5"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rv=i("Tv",[["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",ry:"2",key:"10ag99"}],["polyline",{points:"17 2 12 7 7 2",key:"11pgbg"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bv=i("Twitch",[["path",{d:"M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7",key:"c0yzno"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nv=i("Twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ev=i("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ov=i("UmbrellaOff",[["path",{d:"M12 2v1",key:"11qlp1"}],["path",{d:"M15.5 21a1.85 1.85 0 0 1-3.5-1v-8H2a10 10 0 0 1 3.428-6.575",key:"eki10q"}],["path",{d:"M17.5 12H22A10 10 0 0 0 9.004 3.455",key:"n2ayka"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uv=i("Umbrella",[["path",{d:"M22 12a10.06 10.06 1 0 0-20 0Z",key:"1teyop"}],["path",{d:"M12 12v8a2 2 0 0 0 4 0",key:"ulpmoc"}],["path",{d:"M12 2v1",key:"11qlp1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zv=i("Underline",[["path",{d:"M6 4v6a6 6 0 0 0 12 0V4",key:"9kb039"}],["line",{x1:"4",x2:"20",y1:"20",y2:"20",key:"nun2al"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _v=i("Undo2",[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11",key:"llx8ln"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wv=i("UndoDot",[["circle",{cx:"12",cy:"17",r:"1",key:"1ixnty"}],["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gv=i("Undo",[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $v=i("UnfoldHorizontal",[["path",{d:"M16 12h6",key:"15xry1"}],["path",{d:"M8 12H2",key:"1jqql6"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m19 15 3-3-3-3",key:"wjy7rq"}],["path",{d:"m5 9-3 3 3 3",key:"j64kie"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xv=i("UnfoldVertical",[["path",{d:"M12 22v-6",key:"6o8u61"}],["path",{d:"M12 8V2",key:"1wkif3"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}],["path",{d:"m15 19-3 3-3-3",key:"11eu04"}],["path",{d:"m15 5-3-3-3 3",key:"itvq4r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kv=i("Ungroup",[["rect",{width:"8",height:"6",x:"5",y:"4",rx:"1",key:"nzclkv"}],["rect",{width:"8",height:"6",x:"11",y:"14",rx:"1",key:"4tytwb"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qv=i("Unlink2",[["path",{d:"M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2",key:"1re2ne"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yv=i("Unlink",[["path",{d:"m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71",key:"yqzxt4"}],["path",{d:"m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71",key:"4qinb0"}],["line",{x1:"8",x2:"8",y1:"2",y2:"5",key:"1041cp"}],["line",{x1:"2",x2:"5",y1:"8",y2:"8",key:"14m1p5"}],["line",{x1:"16",x2:"16",y1:"19",y2:"22",key:"rzdirn"}],["line",{x1:"19",x2:"22",y1:"16",y2:"16",key:"ox905f"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jv=i("UnlockKeyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 9.33-2.5",key:"car5b7"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ex=i("Unlock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tx=i("Unplug",[["path",{d:"m19 5 3-3",key:"yk6iyv"}],["path",{d:"m2 22 3-3",key:"19mgm9"}],["path",{d:"M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",key:"goz73y"}],["path",{d:"M7.5 13.5 10 11",key:"7xgeeb"}],["path",{d:"M10.5 16.5 13 14",key:"10btkg"}],["path",{d:"m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z",key:"1snsnr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nx=i("UploadCloud",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M12 12v9",key:"192myk"}],["path",{d:"m16 16-4-4-4 4",key:"119tzi"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ax=i("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ix=i("Usb",[["circle",{cx:"10",cy:"7",r:"1",key:"dypaad"}],["circle",{cx:"4",cy:"20",r:"1",key:"22iqad"}],["path",{d:"M4.7 19.3 19 5",key:"1enqfc"}],["path",{d:"m21 3-3 1 2 2Z",key:"d3ov82"}],["path",{d:"M9.26 7.68 5 12l2 5",key:"1esawj"}],["path",{d:"m10 14 5 2 3.5-3.5",key:"v8oal5"}],["path",{d:"m18 12 1-1 1 1-1 1Z",key:"1bh22v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rx=i("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ox=i("UserCog",[["circle",{cx:"18",cy:"15",r:"3",key:"gjjjvw"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M10 15H6a4 4 0 0 0-4 4v2",key:"1nfge6"}],["path",{d:"m21.7 16.4-.9-.3",key:"12j9ji"}],["path",{d:"m15.2 13.9-.9-.3",key:"1fdjdi"}],["path",{d:"m16.6 18.7.3-.9",key:"heedtr"}],["path",{d:"m19.1 12.2.3-.9",key:"1af3ki"}],["path",{d:"m19.6 18.7-.4-1",key:"1x9vze"}],["path",{d:"m16.8 12.3-.4-1",key:"vqeiwj"}],["path",{d:"m14.3 16.6 1-.4",key:"1qlj63"}],["path",{d:"m20.7 13.8 1-.4",key:"1v5t8k"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sx=i("UserMinus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cx=i("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t1=i("UserRoundCheck",[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"m16 19 2 2 4-4",key:"1b14m6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n1=i("UserRoundCog",[["path",{d:"M2 21a8 8 0 0 1 10.434-7.62",key:"1yezr2"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["path",{d:"m19.5 14.3-.4.9",key:"1eb35c"}],["path",{d:"m16.9 20.8-.4.9",key:"dfjc4z"}],["path",{d:"m21.7 19.5-.9-.4",key:"q4dx6b"}],["path",{d:"m15.2 16.9-.9-.4",key:"1r0w5f"}],["path",{d:"m21.7 16.5-.9.4",key:"1knoei"}],["path",{d:"m15.2 19.1-.9.4",key:"j188fs"}],["path",{d:"m19.5 21.7-.4-.9",key:"1tonu5"}],["path",{d:"m16.9 15.2-.4-.9",key:"699xu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a1=i("UserRoundMinus",[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 19h-6",key:"vcuq98"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i1=i("UserRoundPlus",[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M19 16v6",key:"tddt3s"}],["path",{d:"M22 19h-6",key:"vcuq98"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lx=i("UserRoundSearch",[["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M2 21a8 8 0 0 1 10.434-7.62",key:"1yezr2"}],["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["path",{d:"m22 22-1.9-1.9",key:"1e5ubv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r1=i("UserRoundX",[["path",{d:"M2 21a8 8 0 0 1 11.873-7",key:"74fkxq"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"m17 17 5 5",key:"p7ous7"}],["path",{d:"m22 17-5 5",key:"gqnmv0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o1=i("UserRound",[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dx=i("UserSearch",[["circle",{cx:"10",cy:"7",r:"4",key:"e45bow"}],["path",{d:"M10.3 15H7a4 4 0 0 0-4 4v2",key:"3bnktk"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["path",{d:"m21 21-1.9-1.9",key:"1g2n9r"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hx=i("UserX",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"17",x2:"22",y1:"8",y2:"13",key:"3nzzx3"}],["line",{x1:"22",x2:"17",y1:"8",y2:"13",key:"1swrse"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ux=i("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s1=i("UsersRound",[["path",{d:"M18 21a8 8 0 0 0-16 0",key:"3ypg7q"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",key:"10s06x"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yx=i("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const da=i("UtensilsCrossed",[["path",{d:"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8",key:"n7qcjb"}],["path",{d:"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7",key:"d0u48b"}],["path",{d:"m2.1 21.8 6.4-6.3",key:"yn04lh"}],["path",{d:"m19 5-7 7",key:"194lzd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ri=i("Utensils",[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"1ogz0v"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const px=i("UtilityPole",[["path",{d:"M12 2v20",key:"t6zp3m"}],["path",{d:"M2 5h20",key:"1fs1ex"}],["path",{d:"M3 3v2",key:"9imdir"}],["path",{d:"M7 3v2",key:"n0os7"}],["path",{d:"M17 3v2",key:"1l2re6"}],["path",{d:"M21 3v2",key:"1duuac"}],["path",{d:"m19 5-7 7-7-7",key:"133zxf"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kx=i("Variable",[["path",{d:"M8 21s-4-3-4-9 4-9 4-9",key:"uto9ud"}],["path",{d:"M16 3s4 3 4 9-4 9-4 9",key:"4w2vsq"}],["line",{x1:"15",x2:"9",y1:"9",y2:"15",key:"f7djnv"}],["line",{x1:"9",x2:"15",y1:"9",y2:"15",key:"1shsy8"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fx=i("Vegan",[["path",{d:"M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14",key:"qiv7li"}],["path",{d:"M16 8c4 0 6-2 6-6-4 0-6 2-6 6",key:"n7eohy"}],["path",{d:"M17.41 3.6a10 10 0 1 0 3 3",key:"1dion0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mx=i("VenetianMask",[["path",{d:"M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z",key:"1g6z3j"}],["path",{d:"M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z",key:"c2lwnf"}],["path",{d:"M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z",key:"njd9zo"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gx=i("VibrateOff",[["path",{d:"m2 8 2 2-2 2 2 2-2 2",key:"sv1b1"}],["path",{d:"m22 8-2 2 2 2-2 2 2 2",key:"101i4y"}],["path",{d:"M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2",key:"1hbad5"}],["path",{d:"M16 10.34V6c0-.55-.45-1-1-1h-4.34",key:"1x5tf0"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vx=i("Vibrate",[["path",{d:"m2 8 2 2-2 2 2 2-2 2",key:"sv1b1"}],["path",{d:"m22 8-2 2 2 2-2 2 2 2",key:"101i4y"}],["rect",{width:"8",height:"14",x:"8",y:"5",rx:"1",key:"1oyrl4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xx=i("VideoOff",[["path",{d:"M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8",key:"ubwiq0"}],["path",{d:"M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z",key:"1l10zd"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mx=i("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wx=i("Videotape",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"M2 8h20",key:"d11cs7"}],["circle",{cx:"8",cy:"14",r:"2",key:"1k2qr5"}],["path",{d:"M8 12h8",key:"1wcyev"}],["circle",{cx:"16",cy:"14",r:"2",key:"14k7lr"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lx=i("View",[["path",{d:"M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z",key:"vptub8"}],["path",{d:"M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",key:"10lhjs"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2",key:"mrq65r"}],["path",{d:"M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2",key:"be3xqs"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cx=i("Voicemail",[["circle",{cx:"6",cy:"12",r:"4",key:"1ehtga"}],["circle",{cx:"18",cy:"12",r:"4",key:"4vafl8"}],["line",{x1:"6",x2:"18",y1:"16",y2:"16",key:"pmt8us"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sx=i("Volume1",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07",key:"ltjumu"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ix=i("Volume2",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07",key:"ltjumu"}],["path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14",key:"1kegas"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jx=i("VolumeX",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Px=i("Volume",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bx=i("Vote",[["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}],["path",{d:"M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z",key:"1ezoue"}],["path",{d:"M22 19H2",key:"nuriw5"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ax=i("Wallet2",[["path",{d:"M17 14h.01",key:"7oqj8z"}],["path",{d:"M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14",key:"u1rqew"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zx=i("WalletCards",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2",key:"4125el"}],["path",{d:"M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21",key:"1dpki6"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vx=i("Wallet",[["path",{d:"M21 12V7H5a2 2 0 0 1 0-4h14v4",key:"195gfw"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h16v-5",key:"195n9w"}],["path",{d:"M18 12a2 2 0 0 0 0 4h4v-4Z",key:"vllfpd"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hx=i("Wallpaper",[["circle",{cx:"8",cy:"9",r:"2",key:"gjzl9d"}],["path",{d:"m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2",key:"69xh40"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["path",{d:"M12 17v4",key:"1riwvh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tx=i("Wand2",[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z",key:"1bcowg"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qx=i("Wand",[["path",{d:"M15 4V2",key:"z1p9b7"}],["path",{d:"M15 16v-2",key:"px0unx"}],["path",{d:"M8 9h2",key:"1g203m"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M17.8 11.8 19 13",key:"yihg8r"}],["path",{d:"M15 9h0",key:"kg5t1u"}],["path",{d:"M17.8 6.2 19 5",key:"fd4us0"}],["path",{d:"m3 21 9-9",key:"1jfql5"}],["path",{d:"M12.2 6.2 11 5",key:"i3da3b"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dx=i("Warehouse",[["path",{d:"M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z",key:"gksnxg"}],["path",{d:"M6 18h12",key:"9pbo8z"}],["path",{d:"M6 14h12",key:"4cwo0f"}],["rect",{width:"12",height:"12",x:"6",y:"10",key:"apd30q"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fx=i("Watch",[["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["polyline",{points:"12 10 12 12 13 13",key:"19dquz"}],["path",{d:"m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05",key:"18k57s"}],["path",{d:"m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05",key:"16ny36"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rx=i("Waves",[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"knzxuh"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"2jd2cc"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"rd2r6e"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bx=i("Waypoints",[["circle",{cx:"12",cy:"4.5",r:"2.5",key:"r5ysbb"}],["path",{d:"m10.2 6.3-3.9 3.9",key:"1nzqf6"}],["circle",{cx:"4.5",cy:"12",r:"2.5",key:"jydg6v"}],["path",{d:"M7 12h10",key:"b7w52i"}],["circle",{cx:"19.5",cy:"12",r:"2.5",key:"1piiel"}],["path",{d:"m13.8 17.7 3.9-3.9",key:"1wyg1y"}],["circle",{cx:"12",cy:"19.5",r:"2.5",key:"13o1pw"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nx=i("Webcam",[["circle",{cx:"12",cy:"10",r:"8",key:"1gshiw"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 22h10",key:"10w4w3"}],["path",{d:"M12 22v-4",key:"1utk9m"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ex=i("Webhook",[["path",{d:"M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",key:"q3hayz"}],["path",{d:"m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06",key:"1go1hn"}],["path",{d:"m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",key:"qlwsc0"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ox=i("Weight",[["circle",{cx:"12",cy:"5",r:"3",key:"rqqgnr"}],["path",{d:"M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z",key:"56o5sh"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ux=i("WheatOff",[["path",{d:"m2 22 10-10",key:"28ilpk"}],["path",{d:"m16 8-1.17 1.17",key:"1qqm82"}],["path",{d:"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",key:"1rdhi6"}],["path",{d:"m8 8-.53.53a3.5 3.5 0 0 0 0 4.94L9 15l1.53-1.53c.55-.55.88-1.25.98-1.97",key:"4wz8re"}],["path",{d:"M10.91 5.26c.15-.26.34-.51.56-.73L13 3l1.53 1.53a3.5 3.5 0 0 1 .28 4.62",key:"rves66"}],["path",{d:"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z",key:"19rau1"}],["path",{d:"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",key:"tc8ph9"}],["path",{d:"m16 16-.53.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.49 3.49 0 0 1 1.97-.98",key:"ak46r"}],["path",{d:"M18.74 13.09c.26-.15.51-.34.73-.56L21 11l-1.53-1.53a3.5 3.5 0 0 0-4.62-.28",key:"1tw520"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zx=i("Wheat",[["path",{d:"M2 22 16 8",key:"60hf96"}],["path",{d:"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",key:"1rdhi6"}],["path",{d:"M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",key:"1sdzmb"}],["path",{d:"M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",key:"eoatbi"}],["path",{d:"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z",key:"19rau1"}],["path",{d:"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",key:"tc8ph9"}],["path",{d:"M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",key:"2m8kc5"}],["path",{d:"M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",key:"vex3ng"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _x=i("WholeWord",[["circle",{cx:"7",cy:"12",r:"3",key:"12clwm"}],["path",{d:"M10 9v6",key:"17i7lo"}],["circle",{cx:"17",cy:"12",r:"3",key:"gl7c2s"}],["path",{d:"M14 7v8",key:"dl84cr"}],["path",{d:"M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",key:"lt2kga"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wx=i("WifiOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M8.5 16.5a5 5 0 0 1 7 0",key:"sej527"}],["path",{d:"M2 8.82a15 15 0 0 1 4.17-2.65",key:"11utq1"}],["path",{d:"M10.66 5c4.01-.36 8.14.9 11.34 3.76",key:"hxefdu"}],["path",{d:"M16.85 11.25a10 10 0 0 1 2.22 1.68",key:"q734kn"}],["path",{d:"M5 13a10 10 0 0 1 5.24-2.76",key:"piq4yl"}],["line",{x1:"12",x2:"12.01",y1:"20",y2:"20",key:"of4bc4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gx=i("Wifi",[["path",{d:"M5 13a10 10 0 0 1 14 0",key:"6v8j51"}],["path",{d:"M8.5 16.5a5 5 0 0 1 7 0",key:"sej527"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["line",{x1:"12",x2:"12.01",y1:"20",y2:"20",key:"of4bc4"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $x=i("Wind",[["path",{d:"M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2",key:"1k4u03"}],["path",{d:"M9.6 4.6A2 2 0 1 1 11 8H2",key:"b7d0fd"}],["path",{d:"M12.6 19.4A2 2 0 1 0 14 16H2",key:"1p5cb3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xx=i("WineOff",[["path",{d:"M8 22h8",key:"rmew8v"}],["path",{d:"M7 10h3m7 0h-1.343",key:"v48bem"}],["path",{d:"M12 15v7",key:"t2xh3l"}],["path",{d:"M7.307 7.307A12.33 12.33 0 0 0 7 10a5 5 0 0 0 7.391 4.391M8.638 2.981C8.75 2.668 8.872 2.34 9 2h6c1.5 4 2 6 2 8 0 .407-.05.809-.145 1.198",key:"1ymjlu"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kx=i("Wine",[["path",{d:"M8 22h8",key:"rmew8v"}],["path",{d:"M7 10h10",key:"1101jm"}],["path",{d:"M12 15v7",key:"t2xh3l"}],["path",{d:"M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z",key:"10ffi3"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qx=i("Workflow",[["rect",{width:"8",height:"8",x:"3",y:"3",rx:"2",key:"by2w9f"}],["path",{d:"M7 11v4a2 2 0 0 0 2 2h4",key:"xkn7yn"}],["rect",{width:"8",height:"8",x:"13",y:"13",rx:"2",key:"1cgmvn"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yx=i("WrapText",[["line",{x1:"3",x2:"21",y1:"6",y2:"6",key:"4m8b97"}],["path",{d:"M3 12h15a3 3 0 1 1 0 6h-4",key:"1cl7v7"}],["polyline",{points:"16 16 14 18 16 20",key:"1jznyi"}],["line",{x1:"3",x2:"10",y1:"18",y2:"18",key:"1h33wv"}]]);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jx=i("Wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]]);/**
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
 */const lt=i("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
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
 */const $V=Object.freeze(Object.defineProperty({__proto__:null,AArrowDown:xr,AArrowUp:Mr,ALargeSmall:wr,Accessibility:Lr,Activity:Sr,ActivitySquare:Cr,AirVent:Ir,Airplay:jr,AlarmClock:br,AlarmClockCheck:on,AlarmClockMinus:sn,AlarmClockOff:Pr,AlarmClockPlus:cn,AlarmSmoke:Ar,Album:zr,AlertCircle:ia,AlertOctagon:Vr,AlertTriangle:Ut,AlignCenter:qr,AlignCenterHorizontal:Hr,AlignCenterVertical:Tr,AlignEndHorizontal:Dr,AlignEndVertical:Fr,AlignHorizontalDistributeCenter:Rr,AlignHorizontalDistributeEnd:Br,AlignHorizontalDistributeStart:Nr,AlignHorizontalJustifyCenter:Er,AlignHorizontalJustifyEnd:Or,AlignHorizontalJustifyStart:Ur,AlignHorizontalSpaceAround:Zr,AlignHorizontalSpaceBetween:_r,AlignJustify:Wr,AlignLeft:Gr,AlignRight:$r,AlignStartHorizontal:Xr,AlignStartVertical:Kr,AlignVerticalDistributeCenter:Qr,AlignVerticalDistributeEnd:Yr,AlignVerticalDistributeStart:Jr,AlignVerticalJustifyCenter:eo,AlignVerticalJustifyEnd:to,AlignVerticalJustifyStart:no,AlignVerticalSpaceAround:ao,AlignVerticalSpaceBetween:io,Ampersand:ro,Ampersands:oo,Anchor:so,Angry:co,Annoyed:lo,Antenna:ho,Anvil:uo,Aperture:yo,AppWindow:po,Apple:ko,Archive:go,ArchiveRestore:fo,ArchiveX:mo,AreaChart:vo,Armchair:xo,ArrowBigDown:wo,ArrowBigDownDash:Mo,ArrowBigLeft:Co,ArrowBigLeftDash:Lo,ArrowBigRight:Io,ArrowBigRightDash:So,ArrowBigUp:Po,ArrowBigUpDash:jo,ArrowDown:Zo,ArrowDown01:bo,ArrowDown10:Ao,ArrowDownAZ:ln,ArrowDownCircle:zo,ArrowDownFromLine:Vo,ArrowDownLeft:qo,ArrowDownLeftFromCircle:Ho,ArrowDownLeftSquare:To,ArrowDownNarrowWide:Do,ArrowDownRight:Bo,ArrowDownRightFromCircle:Fo,ArrowDownRightSquare:Ro,ArrowDownSquare:No,ArrowDownToDot:Eo,ArrowDownToLine:Oo,ArrowDownUp:Uo,ArrowDownWideNarrow:dn,ArrowDownZA:hn,ArrowLeft:Ko,ArrowLeftCircle:_o,ArrowLeftFromLine:Wo,ArrowLeftRight:Go,ArrowLeftSquare:$o,ArrowLeftToLine:Xo,ArrowRight:n2,ArrowRightCircle:Qo,ArrowRightFromLine:Yo,ArrowRightLeft:Jo,ArrowRightSquare:e2,ArrowRightToLine:t2,ArrowUp:g2,ArrowUp01:a2,ArrowUp10:i2,ArrowUpAZ:un,ArrowUpCircle:r2,ArrowUpDown:o2,ArrowUpFromDot:s2,ArrowUpFromLine:c2,ArrowUpLeft:h2,ArrowUpLeftFromCircle:l2,ArrowUpLeftSquare:d2,ArrowUpNarrowWide:yn,ArrowUpRight:p2,ArrowUpRightFromCircle:u2,ArrowUpRightSquare:y2,ArrowUpSquare:k2,ArrowUpToLine:f2,ArrowUpWideNarrow:m2,ArrowUpZA:pn,ArrowsUpFromLine:v2,Asterisk:x2,AtSign:M2,Atom:w2,AudioLines:L2,AudioWaveform:C2,Award:S2,Axe:I2,Axis3d:kn,Baby:Ga,Backpack:j2,Badge:U2,BadgeAlert:P2,BadgeCent:b2,BadgeCheck:fn,BadgeDollarSign:A2,BadgeEuro:z2,BadgeHelp:V2,BadgeIndianRupee:H2,BadgeInfo:T2,BadgeJapaneseYen:q2,BadgeMinus:D2,BadgePercent:F2,BadgePlus:R2,BadgePoundSterling:B2,BadgeRussianRuble:N2,BadgeSwissFranc:E2,BadgeX:O2,BaggageClaim:Z2,Ban:_2,Banana:W2,Banknote:G2,BarChart:es,BarChart2:$2,BarChart3:X2,BarChart4:K2,BarChartBig:Q2,BarChartHorizontal:J2,BarChartHorizontalBig:Y2,Barcode:ts,Baseline:ns,Bath:as,Battery:ls,BatteryCharging:is,BatteryFull:rs,BatteryLow:os,BatteryMedium:ss,BatteryWarning:cs,Beaker:ds,Bean:us,BeanOff:hs,Bed:ks,BedDouble:ys,BedSingle:ps,Beef:fs,Beer:ms,Bell:Cs,BellDot:gs,BellElectric:vs,BellMinus:xs,BellOff:Ms,BellPlus:ws,BellRing:Ls,Bike:Ss,Binary:Is,Biohazard:js,Bird:Ps,Bitcoin:bs,Blinds:As,Blocks:zs,Bluetooth:qs,BluetoothConnected:Vs,BluetoothOff:Hs,BluetoothSearching:Ts,Bold:Ds,Bomb:Fs,Bone:Rs,Book:oc,BookA:Bs,BookAudio:Ns,BookCheck:Es,BookCopy:Os,BookDashed:mn,BookDown:Us,BookHeadphones:Zs,BookHeart:_s,BookImage:Ws,BookKey:Gs,BookLock:$s,BookMarked:Xs,BookMinus:Ks,BookOpen:$a,BookOpenCheck:Qs,BookOpenText:Ys,BookPlus:Js,BookText:ec,BookType:tc,BookUp:ac,BookUp2:nc,BookUser:ic,BookX:rc,Bookmark:hc,BookmarkCheck:sc,BookmarkMinus:cc,BookmarkPlus:lc,BookmarkX:dc,BoomBox:uc,Bot:yc,Box:kc,BoxSelect:pc,Boxes:fc,Braces:gn,Brackets:mc,Brain:xc,BrainCircuit:gc,BrainCog:vc,BrickWall:Mc,Briefcase:wc,BringToFront:Lc,Brush:Cc,Bug:jc,BugOff:Sc,BugPlay:Ic,Building:bc,Building2:Pc,Bus:zc,BusFront:Ac,Cable:Hc,CableCar:Vc,Cake:qc,CakeSlice:Tc,Calculator:Dc,Calendar:m1,CalendarCheck:Rc,CalendarCheck2:Fc,CalendarClock:Bc,CalendarDays:Nc,CalendarHeart:Ec,CalendarMinus:Oc,CalendarOff:Uc,CalendarPlus:Zc,CalendarRange:_c,CalendarSearch:Wc,CalendarX:$c,CalendarX2:Gc,Camera:Kc,CameraOff:Xc,CandlestickChart:Qc,Candy:el,CandyCane:Yc,CandyOff:Jc,Car:al,CarFront:tl,CarTaxiFront:nl,Caravan:il,Carrot:rl,CaseLower:ol,CaseSensitive:sl,CaseUpper:cl,CassetteTape:ll,Cast:dl,Castle:hl,Cat:ul,Cctv:yl,Check:v1,CheckCheck:pl,CheckCircle:kl,CheckCircle2:g1,CheckSquare:ml,CheckSquare2:fl,ChefHat:gl,Cherry:vl,ChevronDown:ra,ChevronDownCircle:xl,ChevronDownSquare:Ml,ChevronFirst:wl,ChevronLast:Ll,ChevronLeft:Il,ChevronLeftCircle:Cl,ChevronLeftSquare:Sl,ChevronRight:Xa,ChevronRightCircle:jl,ChevronRightSquare:Pl,ChevronUp:zl,ChevronUpCircle:bl,ChevronUpSquare:Al,ChevronsDown:Hl,ChevronsDownUp:Vl,ChevronsLeft:ql,ChevronsLeftRight:Tl,ChevronsRight:Fl,ChevronsRightLeft:Dl,ChevronsUp:Bl,ChevronsUpDown:Rl,Chrome:Nl,Church:El,Cigarette:Ul,CigaretteOff:Ol,Circle:Yl,CircleDashed:Zl,CircleDollarSign:_l,CircleDot:Gl,CircleDotDashed:Wl,CircleEllipsis:$l,CircleEqual:Xl,CircleOff:Kl,CircleSlash:Ql,CircleSlash2:vn,CircleUser:Mn,CircleUserRound:xn,CircuitBoard:Jl,Citrus:e0,Clapperboard:t0,Clipboard:d0,ClipboardCheck:n0,ClipboardCopy:a0,ClipboardEdit:i0,ClipboardList:r0,ClipboardPaste:o0,ClipboardSignature:s0,ClipboardType:c0,ClipboardX:l0,Clock:oa,Clock1:h0,Clock10:u0,Clock11:y0,Clock12:p0,Clock2:k0,Clock3:f0,Clock4:m0,Clock5:g0,Clock6:v0,Clock7:x0,Clock8:M0,Clock9:w0,Cloud:D0,CloudCog:L0,CloudDrizzle:C0,CloudFog:S0,CloudHail:I0,CloudLightning:j0,CloudMoon:b0,CloudMoonRain:P0,CloudOff:A0,CloudRain:V0,CloudRainWind:z0,CloudSnow:H0,CloudSun:q0,CloudSunRain:T0,Cloudy:F0,Clover:R0,Club:B0,Code:E0,Code2:N0,Codepen:O0,Codesandbox:U0,Coffee:Z0,Cog:_0,Coins:W0,Columns2:wn,Columns3:Ln,Columns4:G0,Combine:$0,Command:X0,Compass:K0,Component:Q0,Computer:Y0,ConciergeBell:J0,Cone:ed,Construction:td,Contact:ad,Contact2:nd,Container:id,Contrast:rd,Cookie:od,CookingPot:sd,Copy:yd,CopyCheck:cd,CopyMinus:ld,CopyPlus:dd,CopySlash:hd,CopyX:ud,Copyleft:pd,Copyright:kd,CornerDownLeft:fd,CornerDownRight:md,CornerLeftDown:gd,CornerLeftUp:vd,CornerRightDown:xd,CornerRightUp:Md,CornerUpLeft:wd,CornerUpRight:Ld,Cpu:Cd,CreativeCommons:Sd,CreditCard:Id,Croissant:jd,Crop:Pd,Cross:bd,Crosshair:Ad,Crown:zd,Cuboid:Vd,CupSoda:Hd,Currency:Td,Cylinder:qd,Database:Rd,DatabaseBackup:Dd,DatabaseZap:Fd,Delete:Bd,Dessert:Nd,Diameter:Ed,Diamond:Od,Dice1:Ud,Dice2:Zd,Dice3:_d,Dice4:Wd,Dice5:Gd,Dice6:$d,Dices:Xd,Diff:Kd,Disc:eh,Disc2:Qd,Disc3:Yd,DiscAlbum:Jd,Divide:ah,DivideCircle:th,DivideSquare:nh,Dna:rh,DnaOff:ih,Dog:oh,DollarSign:sh,Donut:ch,DoorClosed:lh,DoorOpen:dh,Dot:Ka,Download:uh,DownloadCloud:hh,DraftingCompass:yh,Drama:ph,Dribbble:kh,Droplet:fh,Droplets:mh,Drum:gh,Drumstick:vh,Dumbbell:xh,Ear:wh,EarOff:Mh,Egg:Sh,EggFried:Lh,EggOff:Ch,Equal:jh,EqualNot:Ih,Eraser:Ph,Euro:bh,Expand:Ah,ExternalLink:zh,Eye:Hh,EyeOff:Vh,Facebook:Th,Factory:qh,Fan:Dh,FastForward:Fh,Feather:Rh,Fence:Bh,FerrisWheel:Nh,Figma:Eh,File:Ou,FileArchive:Oh,FileAudio:Zh,FileAudio2:Uh,FileAxis3d:Cn,FileBadge:Wh,FileBadge2:_h,FileBarChart:$h,FileBarChart2:Gh,FileBox:Xh,FileCheck:Qh,FileCheck2:Kh,FileClock:Yh,FileCode:eu,FileCode2:Jh,FileCog:Sn,FileDiff:tu,FileDigit:nu,FileDown:au,FileEdit:iu,FileHeart:ru,FileImage:ou,FileInput:su,FileJson:lu,FileJson2:cu,FileKey:hu,FileKey2:du,FileLineChart:uu,FileLock:pu,FileLock2:yu,FileMinus:fu,FileMinus2:ku,FileMusic:mu,FileOutput:gu,FilePieChart:vu,FilePlus:Mu,FilePlus2:xu,FileQuestion:wu,FileScan:Lu,FileSearch:Su,FileSearch2:Cu,FileSignature:Iu,FileSpreadsheet:ju,FileStack:Pu,FileSymlink:bu,FileTerminal:Au,FileText:zu,FileType:Hu,FileType2:Vu,FileUp:Tu,FileVideo:Du,FileVideo2:qu,FileVolume:Ru,FileVolume2:Fu,FileWarning:Bu,FileX:Eu,FileX2:Nu,Files:Uu,Film:Zu,Filter:sa,FilterX:_u,Fingerprint:Wu,FireExtinguisher:Gu,Fish:Ku,FishOff:$u,FishSymbol:Xu,Flag:ey,FlagOff:Qu,FlagTriangleLeft:Yu,FlagTriangleRight:Ju,Flame:ny,FlameKindling:ty,Flashlight:iy,FlashlightOff:ay,FlaskConical:oy,FlaskConicalOff:ry,FlaskRound:sy,FlipHorizontal:ly,FlipHorizontal2:cy,FlipVertical:hy,FlipVertical2:dy,Flower:yy,Flower2:uy,Focus:py,FoldHorizontal:ky,FoldVertical:fy,Folder:Zy,FolderArchive:my,FolderCheck:gy,FolderClock:vy,FolderClosed:xy,FolderCog:In,FolderDot:My,FolderDown:wy,FolderEdit:Ly,FolderGit:Sy,FolderGit2:Cy,FolderHeart:Iy,FolderInput:jy,FolderKanban:Py,FolderKey:by,FolderLock:Ay,FolderMinus:zy,FolderOpen:Hy,FolderOpenDot:Vy,FolderOutput:Ty,FolderPlus:qy,FolderRoot:Dy,FolderSearch:Ry,FolderSearch2:Fy,FolderSymlink:By,FolderSync:Ny,FolderTree:Ey,FolderUp:Oy,FolderX:Uy,Folders:_y,Footprints:Wy,Forklift:Gy,FormInput:$y,Forward:Xy,Frame:Ky,Framer:Qy,Frown:Yy,Fuel:Jy,Fullscreen:ep,FunctionSquare:tp,GalleryHorizontal:ap,GalleryHorizontalEnd:np,GalleryThumbnails:ip,GalleryVertical:op,GalleryVerticalEnd:rp,Gamepad:cp,Gamepad2:sp,GanttChart:lp,GanttChartSquare:jn,Gauge:hp,GaugeCircle:dp,Gavel:up,Gem:yp,Ghost:pp,Gift:kp,GitBranch:mp,GitBranchPlus:fp,GitCommitHorizontal:Pn,GitCommitVertical:gp,GitCompare:xp,GitCompareArrows:vp,GitFork:Mp,GitGraph:wp,GitMerge:Lp,GitPullRequest:bp,GitPullRequestArrow:Cp,GitPullRequestClosed:Sp,GitPullRequestCreate:jp,GitPullRequestCreateArrow:Ip,GitPullRequestDraft:Pp,Github:Ap,Gitlab:zp,GlassWater:Vp,Glasses:Hp,Globe:qp,Globe2:Tp,Goal:Dp,Grab:Fp,GraduationCap:Rp,Grape:Bp,Grid2x2:bn,Grid3x3:at,Grip:Op,GripHorizontal:Np,GripVertical:Ep,Group:Up,Guitar:Zp,Hammer:_p,Hand:x1,HandMetal:Wp,HardDrive:Xp,HardDriveDownload:Gp,HardDriveUpload:$p,HardHat:Kp,Hash:Qp,Haze:Yp,HdmiPort:Jp,Heading:ok,Heading1:ek,Heading2:tk,Heading3:nk,Heading4:ak,Heading5:ik,Heading6:rk,Headphones:sk,Heart:uk,HeartCrack:ck,HeartHandshake:lk,HeartOff:dk,HeartPulse:hk,HelpCircle:yk,HelpingHand:pk,Hexagon:kk,Highlighter:fk,History:mk,Home:Qa,Hop:vk,HopOff:gk,Hotel:xk,Hourglass:Mk,IceCream:Lk,IceCream2:wk,Image:Pk,ImageDown:Ck,ImageMinus:Sk,ImageOff:Ik,ImagePlus:jk,Import:bk,Inbox:Ak,Indent:zk,IndianRupee:Vk,Infinity:Hk,Info:Tk,InspectionPanel:qk,Instagram:Dk,Italic:Fk,IterationCcw:Rk,IterationCw:Bk,JapaneseYen:Nk,Joystick:Ek,Kanban:Ok,KanbanSquare:zn,KanbanSquareDashed:An,Key:_k,KeyRound:Uk,KeySquare:Zk,Keyboard:Gk,KeyboardMusic:Wk,Lamp:Jk,LampCeiling:$k,LampDesk:Xk,LampFloor:Kk,LampWallDown:Qk,LampWallUp:Yk,LandPlot:e4,Landmark:t4,Languages:n4,Laptop:i4,Laptop2:a4,Lasso:o4,LassoSelect:r4,Laugh:s4,Layers:Ya,Layers2:c4,Layers3:l4,LayoutDashboard:d4,LayoutGrid:h4,LayoutList:u4,LayoutPanelLeft:y4,LayoutPanelTop:p4,LayoutTemplate:k4,Leaf:f4,LeafyGreen:m4,Library:x4,LibraryBig:g4,LibrarySquare:v4,LifeBuoy:M4,Ligature:w4,Lightbulb:M1,LightbulbOff:L4,LineChart:C4,Link:j4,Link2:I4,Link2Off:S4,Linkedin:P4,List:O4,ListChecks:b4,ListEnd:A4,ListFilter:z4,ListMinus:V4,ListMusic:H4,ListOrdered:T4,ListPlus:q4,ListRestart:D4,ListStart:F4,ListTodo:R4,ListTree:B4,ListVideo:N4,ListX:E4,Loader:Z4,Loader2:U4,Locate:G4,LocateFixed:_4,LocateOff:W4,Lock:X4,LockKeyhole:$4,LogIn:K4,LogOut:Q4,Lollipop:Y4,Luggage:J4,MSquare:e5,Magnet:t5,Mail:d5,MailCheck:n5,MailMinus:a5,MailOpen:i5,MailPlus:r5,MailQuestion:o5,MailSearch:s5,MailWarning:c5,MailX:l5,Mailbox:h5,Mails:u5,Map:f5,MapPin:p5,MapPinOff:y5,MapPinned:k5,Martini:m5,Maximize:v5,Maximize2:g5,Medal:x5,Megaphone:w5,MegaphoneOff:M5,Meh:L5,MemoryStick:C5,Menu:Ja,MenuSquare:S5,Merge:I5,MessageCircle:F5,MessageCircleCode:j5,MessageCircleDashed:P5,MessageCircleHeart:b5,MessageCircleMore:A5,MessageCircleOff:z5,MessageCirclePlus:V5,MessageCircleQuestion:H5,MessageCircleReply:T5,MessageCircleWarning:q5,MessageCircleX:D5,MessageSquare:Y5,MessageSquareCode:R5,MessageSquareDashed:B5,MessageSquareDiff:N5,MessageSquareDot:E5,MessageSquareHeart:O5,MessageSquareMore:U5,MessageSquareOff:Z5,MessageSquarePlus:_5,MessageSquareQuote:W5,MessageSquareReply:G5,MessageSquareShare:$5,MessageSquareText:X5,MessageSquareWarning:K5,MessageSquareX:Q5,MessagesSquare:J5,Mic:nf,Mic2:ef,MicOff:tf,Microscope:af,Microwave:rf,Milestone:of,Milk:cf,MilkOff:sf,Minimize:df,Minimize2:lf,Minus:yf,MinusCircle:hf,MinusSquare:uf,Monitor:Sf,MonitorCheck:pf,MonitorDot:kf,MonitorDown:ff,MonitorOff:mf,MonitorPause:gf,MonitorPlay:vf,MonitorSmartphone:xf,MonitorSpeaker:Mf,MonitorStop:wf,MonitorUp:Lf,MonitorX:Cf,Moon:jf,MoonStar:If,MoreHorizontal:Pf,MoreVertical:bf,Mountain:zf,MountainSnow:Af,Mouse:Df,MousePointer:qf,MousePointer2:Vf,MousePointerClick:Hf,MousePointerSquare:Vn,MousePointerSquareDashed:Tf,Move:Xf,Move3d:Hn,MoveDiagonal:Rf,MoveDiagonal2:Ff,MoveDown:Ef,MoveDownLeft:Bf,MoveDownRight:Nf,MoveHorizontal:Of,MoveLeft:Uf,MoveRight:Zf,MoveUp:Gf,MoveUpLeft:_f,MoveUpRight:Wf,MoveVertical:$f,Music:Jf,Music2:Kf,Music3:Qf,Music4:Yf,Navigation:a3,Navigation2:t3,Navigation2Off:e3,NavigationOff:n3,Network:i3,Newspaper:r3,Nfc:o3,Nut:c3,NutOff:s3,Octagon:l3,Option:d3,Orbit:h3,Outdent:u3,Package:x3,Package2:y3,PackageCheck:p3,PackageMinus:k3,PackageOpen:f3,PackagePlus:m3,PackageSearch:g3,PackageX:v3,PaintBucket:M3,Paintbrush:L3,Paintbrush2:w3,Palette:C3,Palmtree:S3,PanelBottom:P3,PanelBottomClose:I3,PanelBottomDashed:Tn,PanelBottomOpen:j3,PanelLeft:Rn,PanelLeftClose:qn,PanelLeftDashed:Dn,PanelLeftOpen:Fn,PanelRight:z3,PanelRightClose:b3,PanelRightDashed:Bn,PanelRightOpen:A3,PanelTop:T3,PanelTopClose:V3,PanelTopDashed:Nn,PanelTopOpen:H3,PanelsLeftBottom:q3,PanelsRightBottom:D3,PanelsTopLeft:En,Paperclip:F3,Parentheses:R3,ParkingCircle:N3,ParkingCircleOff:B3,ParkingMeter:E3,ParkingSquare:U3,ParkingSquareOff:O3,PartyPopper:Z3,Pause:G3,PauseCircle:_3,PauseOctagon:W3,PawPrint:$3,PcCase:X3,Pen:Un,PenLine:On,PenSquare:it,PenTool:K3,Pencil:J3,PencilLine:Q3,PencilRuler:Y3,Pentagon:em,Percent:im,PercentCircle:tm,PercentDiamond:nm,PercentSquare:am,PersonStanding:rm,Phone:um,PhoneCall:om,PhoneForwarded:sm,PhoneIncoming:cm,PhoneMissed:lm,PhoneOff:dm,PhoneOutgoing:hm,Pi:pm,PiSquare:ym,Piano:km,PictureInPicture:mm,PictureInPicture2:fm,PieChart:gm,PiggyBank:vm,Pilcrow:Mm,PilcrowSquare:xm,Pill:wm,Pin:Cm,PinOff:Lm,Pipette:Sm,Pizza:Im,Plane:bm,PlaneLanding:jm,PlaneTakeoff:Pm,Play:zm,PlayCircle:ei,PlaySquare:Am,Plug:qm,Plug2:Vm,PlugZap:Tm,PlugZap2:Hm,Plus:Rm,PlusCircle:Dm,PlusSquare:Fm,Pocket:Nm,PocketKnife:Bm,Podcast:Em,Pointer:Um,PointerOff:Om,Popcorn:Zm,Popsicle:_m,PoundSterling:Wm,Power:Km,PowerCircle:Gm,PowerOff:$m,PowerSquare:Xm,Presentation:Qm,Printer:Ym,Projector:Jm,Puzzle:e6,Pyramid:t6,QrCode:n6,Quote:a6,Rabbit:i6,Radar:r6,Radiation:o6,Radio:l6,RadioReceiver:s6,RadioTower:c6,Radius:d6,RailSymbol:h6,Rainbow:u6,Rat:y6,Ratio:p6,Receipt:k6,RectangleHorizontal:f6,RectangleVertical:m6,Recycle:g6,Redo:M6,Redo2:v6,RedoDot:x6,RefreshCcw:L6,RefreshCcwDot:w6,RefreshCw:S6,RefreshCwOff:C6,Refrigerator:I6,Regex:j6,RemoveFormatting:P6,Repeat:z6,Repeat1:b6,Repeat2:A6,Replace:H6,ReplaceAll:V6,Reply:q6,ReplyAll:T6,Rewind:D6,Ribbon:F6,Rocket:R6,RockingChair:B6,RollerCoaster:N6,Rotate3d:Zn,RotateCcw:E6,RotateCw:O6,Route:Z6,RouteOff:U6,Router:_6,Rows2:_n,Rows3:Wn,Rows4:W6,Rss:G6,Ruler:$6,RussianRuble:X6,Sailboat:K6,Salad:Q6,Sandwich:Y6,Satellite:e8,SatelliteDish:J6,Save:n8,SaveAll:t8,Scale:a8,Scale3d:Gn,Scaling:i8,Scan:h8,ScanBarcode:r8,ScanEye:o8,ScanFace:s8,ScanLine:c8,ScanSearch:l8,ScanText:d8,ScatterChart:u8,School:p8,School2:y8,Scissors:g8,ScissorsLineDashed:k8,ScissorsSquare:m8,ScissorsSquareDashedBottom:f8,ScreenShare:x8,ScreenShareOff:v8,Scroll:w8,ScrollText:M8,Search:j8,SearchCheck:L8,SearchCode:C8,SearchSlash:S8,SearchX:I8,Send:b8,SendHorizontal:$n,SendToBack:P8,SeparatorHorizontal:A8,SeparatorVertical:z8,Server:q8,ServerCog:V8,ServerCrash:H8,ServerOff:T8,Settings:F8,Settings2:D8,Shapes:R8,Share:B8,Share2:ti,Sheet:N8,Shell:E8,Shield:ni,ShieldAlert:w1,ShieldBan:O8,ShieldCheck:U8,ShieldEllipsis:Z8,ShieldHalf:_8,ShieldMinus:W8,ShieldOff:G8,ShieldPlus:$8,ShieldQuestion:X8,ShieldX:Xn,Ship:Q8,ShipWheel:K8,Shirt:Y8,ShoppingBag:J8,ShoppingBasket:eg,ShoppingCart:tg,Shovel:ng,ShowerHead:ag,Shrink:ig,Shrub:rg,Shuffle:og,Sigma:cg,SigmaSquare:sg,Signal:yg,SignalHigh:lg,SignalLow:dg,SignalMedium:hg,SignalZero:ug,Signpost:kg,SignpostBig:pg,Siren:fg,SkipBack:mg,SkipForward:gg,Skull:vg,Slack:xg,Slash:Mg,Slice:wg,Sliders:Cg,SlidersHorizontal:Lg,Smartphone:jg,SmartphoneCharging:Sg,SmartphoneNfc:Ig,Smile:bg,SmilePlus:Pg,Snail:Ag,Snowflake:zg,Sofa:Vg,Soup:Hg,Space:Tg,Spade:qg,Sparkle:Dg,Sparkles:Kn,Speaker:Fg,Speech:Rg,SpellCheck:Ng,SpellCheck2:Bg,Spline:Eg,Split:Zg,SplitSquareHorizontal:Og,SplitSquareVertical:Ug,SprayCan:_g,Sprout:Wg,Square:t7,SquareAsterisk:Gg,SquareCode:$g,SquareDashedBottom:Kg,SquareDashedBottomCode:Xg,SquareDot:Qg,SquareEqual:Yg,SquareSlash:Jg,SquareStack:e7,SquareUser:Yn,SquareUserRound:Qn,Squircle:n7,Squirrel:a7,Stamp:i7,Star:s7,StarHalf:r7,StarOff:o7,StepBack:c7,StepForward:l7,Stethoscope:ai,Sticker:d7,StickyNote:h7,StopCircle:u7,Store:y7,StretchHorizontal:p7,StretchVertical:k7,Strikethrough:f7,Subscript:m7,Subtitles:g7,Sun:L7,SunDim:v7,SunMedium:x7,SunMoon:M7,SunSnow:w7,Sunrise:C7,Sunset:S7,Superscript:I7,SwissFranc:j7,SwitchCamera:P7,Sword:b7,Swords:A7,Syringe:ca,Table:H7,Table2:z7,TableProperties:V7,Tablet:q7,TabletSmartphone:T7,Tablets:D7,Tag:F7,Tags:R7,Tally1:B7,Tally2:N7,Tally3:E7,Tally4:O7,Tally5:U7,Tangent:Z7,Target:_7,Tent:G7,TentTree:W7,Terminal:X7,TerminalSquare:$7,TestTube:la,TestTube2:K7,TestTubes:Q7,Text:tv,TextCursor:J7,TextCursorInput:Y7,TextQuote:ev,TextSelect:Jn,Theater:nv,Thermometer:rv,ThermometerSnowflake:av,ThermometerSun:iv,ThumbsDown:ov,ThumbsUp:sv,Ticket:cv,Timer:hv,TimerOff:lv,TimerReset:dv,ToggleLeft:uv,ToggleRight:yv,Tornado:pv,Torus:kv,Touchpad:mv,TouchpadOff:fv,TowerControl:gv,ToyBrick:vv,Tractor:xv,TrafficCone:Mv,TrainFront:Lv,TrainFrontTunnel:wv,TrainTrack:Cv,TramFront:e1,Trash:Iv,Trash2:Sv,TreeDeciduous:jv,TreePine:Pv,Trees:bv,Trello:Av,TrendingDown:zv,TrendingUp:ii,Triangle:Hv,TriangleRight:Vv,Trophy:Tv,Truck:qv,Turtle:Dv,Tv:Rv,Tv2:Fv,Twitch:Bv,Twitter:Nv,Type:Ev,Umbrella:Uv,UmbrellaOff:Ov,Underline:Zv,Undo:Gv,Undo2:_v,UndoDot:Wv,UnfoldHorizontal:$v,UnfoldVertical:Xv,Ungroup:Kv,Unlink:Yv,Unlink2:Qv,Unlock:ex,UnlockKeyhole:Jv,Unplug:tx,Upload:ax,UploadCloud:nx,Usb:ix,User:ux,UserCheck:rx,UserCog:ox,UserMinus:sx,UserPlus:cx,UserRound:o1,UserRoundCheck:t1,UserRoundCog:n1,UserRoundMinus:a1,UserRoundPlus:i1,UserRoundSearch:lx,UserRoundX:r1,UserSearch:dx,UserX:hx,Users:yx,UsersRound:s1,Utensils:ri,UtensilsCrossed:da,UtilityPole:px,Variable:kx,Vegan:fx,VenetianMask:mx,Vibrate:vx,VibrateOff:gx,Video:Mx,VideoOff:xx,Videotape:wx,View:Lx,Voicemail:Cx,Volume:Px,Volume1:Sx,Volume2:Ix,VolumeX:jx,Vote:bx,Wallet:Vx,Wallet2:Ax,WalletCards:zx,Wallpaper:Hx,Wand:qx,Wand2:Tx,Warehouse:Dx,Watch:Fx,Waves:Rx,Waypoints:Bx,Webcam:Nx,Webhook:Ex,Weight:Ox,Wheat:Zx,WheatOff:Ux,WholeWord:_x,Wifi:Gx,WifiOff:Wx,Wind:$x,Wine:Kx,WineOff:Xx,Workflow:Qx,WrapText:Yx,Wrench:Jx,X:lt,XCircle:eM,XOctagon:tM,XSquare:nM,Youtube:aM,Zap:rM,ZapOff:iM,ZoomIn:oM,ZoomOut:sM},Symbol.toStringTag,{value:"Module"}));/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b1=Object.freeze(Object.defineProperty({__proto__:null,AArrowDown:xr,AArrowDownIcon:xr,AArrowUp:Mr,AArrowUpIcon:Mr,ALargeSmall:wr,ALargeSmallIcon:wr,Accessibility:Lr,AccessibilityIcon:Lr,Activity:Sr,ActivityIcon:Sr,ActivitySquare:Cr,ActivitySquareIcon:Cr,AirVent:Ir,AirVentIcon:Ir,Airplay:jr,AirplayIcon:jr,AlarmCheck:on,AlarmCheckIcon:on,AlarmClock:br,AlarmClockCheck:on,AlarmClockCheckIcon:on,AlarmClockIcon:br,AlarmClockMinus:sn,AlarmClockMinusIcon:sn,AlarmClockOff:Pr,AlarmClockOffIcon:Pr,AlarmClockPlus:cn,AlarmClockPlusIcon:cn,AlarmMinus:sn,AlarmMinusIcon:sn,AlarmPlus:cn,AlarmPlusIcon:cn,AlarmSmoke:Ar,AlarmSmokeIcon:Ar,Album:zr,AlbumIcon:zr,AlertCircle:ia,AlertCircleIcon:ia,AlertOctagon:Vr,AlertOctagonIcon:Vr,AlertTriangle:Ut,AlertTriangleIcon:Ut,AlignCenter:qr,AlignCenterHorizontal:Hr,AlignCenterHorizontalIcon:Hr,AlignCenterIcon:qr,AlignCenterVertical:Tr,AlignCenterVerticalIcon:Tr,AlignEndHorizontal:Dr,AlignEndHorizontalIcon:Dr,AlignEndVertical:Fr,AlignEndVerticalIcon:Fr,AlignHorizontalDistributeCenter:Rr,AlignHorizontalDistributeCenterIcon:Rr,AlignHorizontalDistributeEnd:Br,AlignHorizontalDistributeEndIcon:Br,AlignHorizontalDistributeStart:Nr,AlignHorizontalDistributeStartIcon:Nr,AlignHorizontalJustifyCenter:Er,AlignHorizontalJustifyCenterIcon:Er,AlignHorizontalJustifyEnd:Or,AlignHorizontalJustifyEndIcon:Or,AlignHorizontalJustifyStart:Ur,AlignHorizontalJustifyStartIcon:Ur,AlignHorizontalSpaceAround:Zr,AlignHorizontalSpaceAroundIcon:Zr,AlignHorizontalSpaceBetween:_r,AlignHorizontalSpaceBetweenIcon:_r,AlignJustify:Wr,AlignJustifyIcon:Wr,AlignLeft:Gr,AlignLeftIcon:Gr,AlignRight:$r,AlignRightIcon:$r,AlignStartHorizontal:Xr,AlignStartHorizontalIcon:Xr,AlignStartVertical:Kr,AlignStartVerticalIcon:Kr,AlignVerticalDistributeCenter:Qr,AlignVerticalDistributeCenterIcon:Qr,AlignVerticalDistributeEnd:Yr,AlignVerticalDistributeEndIcon:Yr,AlignVerticalDistributeStart:Jr,AlignVerticalDistributeStartIcon:Jr,AlignVerticalJustifyCenter:eo,AlignVerticalJustifyCenterIcon:eo,AlignVerticalJustifyEnd:to,AlignVerticalJustifyEndIcon:to,AlignVerticalJustifyStart:no,AlignVerticalJustifyStartIcon:no,AlignVerticalSpaceAround:ao,AlignVerticalSpaceAroundIcon:ao,AlignVerticalSpaceBetween:io,AlignVerticalSpaceBetweenIcon:io,Ampersand:ro,AmpersandIcon:ro,Ampersands:oo,AmpersandsIcon:oo,Anchor:so,AnchorIcon:so,Angry:co,AngryIcon:co,Annoyed:lo,AnnoyedIcon:lo,Antenna:ho,AntennaIcon:ho,Anvil:uo,AnvilIcon:uo,Aperture:yo,ApertureIcon:yo,AppWindow:po,AppWindowIcon:po,Apple:ko,AppleIcon:ko,Archive:go,ArchiveIcon:go,ArchiveRestore:fo,ArchiveRestoreIcon:fo,ArchiveX:mo,ArchiveXIcon:mo,AreaChart:vo,AreaChartIcon:vo,Armchair:xo,ArmchairIcon:xo,ArrowBigDown:wo,ArrowBigDownDash:Mo,ArrowBigDownDashIcon:Mo,ArrowBigDownIcon:wo,ArrowBigLeft:Co,ArrowBigLeftDash:Lo,ArrowBigLeftDashIcon:Lo,ArrowBigLeftIcon:Co,ArrowBigRight:Io,ArrowBigRightDash:So,ArrowBigRightDashIcon:So,ArrowBigRightIcon:Io,ArrowBigUp:Po,ArrowBigUpDash:jo,ArrowBigUpDashIcon:jo,ArrowBigUpIcon:Po,ArrowDown:Zo,ArrowDown01:bo,ArrowDown01Icon:bo,ArrowDown10:Ao,ArrowDown10Icon:Ao,ArrowDownAZ:ln,ArrowDownAZIcon:ln,ArrowDownAz:ln,ArrowDownAzIcon:ln,ArrowDownCircle:zo,ArrowDownCircleIcon:zo,ArrowDownFromLine:Vo,ArrowDownFromLineIcon:Vo,ArrowDownIcon:Zo,ArrowDownLeft:qo,ArrowDownLeftFromCircle:Ho,ArrowDownLeftFromCircleIcon:Ho,ArrowDownLeftIcon:qo,ArrowDownLeftSquare:To,ArrowDownLeftSquareIcon:To,ArrowDownNarrowWide:Do,ArrowDownNarrowWideIcon:Do,ArrowDownRight:Bo,ArrowDownRightFromCircle:Fo,ArrowDownRightFromCircleIcon:Fo,ArrowDownRightIcon:Bo,ArrowDownRightSquare:Ro,ArrowDownRightSquareIcon:Ro,ArrowDownSquare:No,ArrowDownSquareIcon:No,ArrowDownToDot:Eo,ArrowDownToDotIcon:Eo,ArrowDownToLine:Oo,ArrowDownToLineIcon:Oo,ArrowDownUp:Uo,ArrowDownUpIcon:Uo,ArrowDownWideNarrow:dn,ArrowDownWideNarrowIcon:dn,ArrowDownZA:hn,ArrowDownZAIcon:hn,ArrowDownZa:hn,ArrowDownZaIcon:hn,ArrowLeft:Ko,ArrowLeftCircle:_o,ArrowLeftCircleIcon:_o,ArrowLeftFromLine:Wo,ArrowLeftFromLineIcon:Wo,ArrowLeftIcon:Ko,ArrowLeftRight:Go,ArrowLeftRightIcon:Go,ArrowLeftSquare:$o,ArrowLeftSquareIcon:$o,ArrowLeftToLine:Xo,ArrowLeftToLineIcon:Xo,ArrowRight:n2,ArrowRightCircle:Qo,ArrowRightCircleIcon:Qo,ArrowRightFromLine:Yo,ArrowRightFromLineIcon:Yo,ArrowRightIcon:n2,ArrowRightLeft:Jo,ArrowRightLeftIcon:Jo,ArrowRightSquare:e2,ArrowRightSquareIcon:e2,ArrowRightToLine:t2,ArrowRightToLineIcon:t2,ArrowUp:g2,ArrowUp01:a2,ArrowUp01Icon:a2,ArrowUp10:i2,ArrowUp10Icon:i2,ArrowUpAZ:un,ArrowUpAZIcon:un,ArrowUpAz:un,ArrowUpAzIcon:un,ArrowUpCircle:r2,ArrowUpCircleIcon:r2,ArrowUpDown:o2,ArrowUpDownIcon:o2,ArrowUpFromDot:s2,ArrowUpFromDotIcon:s2,ArrowUpFromLine:c2,ArrowUpFromLineIcon:c2,ArrowUpIcon:g2,ArrowUpLeft:h2,ArrowUpLeftFromCircle:l2,ArrowUpLeftFromCircleIcon:l2,ArrowUpLeftIcon:h2,ArrowUpLeftSquare:d2,ArrowUpLeftSquareIcon:d2,ArrowUpNarrowWide:yn,ArrowUpNarrowWideIcon:yn,ArrowUpRight:p2,ArrowUpRightFromCircle:u2,ArrowUpRightFromCircleIcon:u2,ArrowUpRightIcon:p2,ArrowUpRightSquare:y2,ArrowUpRightSquareIcon:y2,ArrowUpSquare:k2,ArrowUpSquareIcon:k2,ArrowUpToLine:f2,ArrowUpToLineIcon:f2,ArrowUpWideNarrow:m2,ArrowUpWideNarrowIcon:m2,ArrowUpZA:pn,ArrowUpZAIcon:pn,ArrowUpZa:pn,ArrowUpZaIcon:pn,ArrowsUpFromLine:v2,ArrowsUpFromLineIcon:v2,Asterisk:x2,AsteriskIcon:x2,AtSign:M2,AtSignIcon:M2,Atom:w2,AtomIcon:w2,AudioLines:L2,AudioLinesIcon:L2,AudioWaveform:C2,AudioWaveformIcon:C2,Award:S2,AwardIcon:S2,Axe:I2,AxeIcon:I2,Axis3D:kn,Axis3DIcon:kn,Axis3d:kn,Axis3dIcon:kn,Baby:Ga,BabyIcon:Ga,Backpack:j2,BackpackIcon:j2,Badge:U2,BadgeAlert:P2,BadgeAlertIcon:P2,BadgeCent:b2,BadgeCentIcon:b2,BadgeCheck:fn,BadgeCheckIcon:fn,BadgeDollarSign:A2,BadgeDollarSignIcon:A2,BadgeEuro:z2,BadgeEuroIcon:z2,BadgeHelp:V2,BadgeHelpIcon:V2,BadgeIcon:U2,BadgeIndianRupee:H2,BadgeIndianRupeeIcon:H2,BadgeInfo:T2,BadgeInfoIcon:T2,BadgeJapaneseYen:q2,BadgeJapaneseYenIcon:q2,BadgeMinus:D2,BadgeMinusIcon:D2,BadgePercent:F2,BadgePercentIcon:F2,BadgePlus:R2,BadgePlusIcon:R2,BadgePoundSterling:B2,BadgePoundSterlingIcon:B2,BadgeRussianRuble:N2,BadgeRussianRubleIcon:N2,BadgeSwissFranc:E2,BadgeSwissFrancIcon:E2,BadgeX:O2,BadgeXIcon:O2,BaggageClaim:Z2,BaggageClaimIcon:Z2,Ban:_2,BanIcon:_2,Banana:W2,BananaIcon:W2,Banknote:G2,BanknoteIcon:G2,BarChart:es,BarChart2:$2,BarChart2Icon:$2,BarChart3:X2,BarChart3Icon:X2,BarChart4:K2,BarChart4Icon:K2,BarChartBig:Q2,BarChartBigIcon:Q2,BarChartHorizontal:J2,BarChartHorizontalBig:Y2,BarChartHorizontalBigIcon:Y2,BarChartHorizontalIcon:J2,BarChartIcon:es,Barcode:ts,BarcodeIcon:ts,Baseline:ns,BaselineIcon:ns,Bath:as,BathIcon:as,Battery:ls,BatteryCharging:is,BatteryChargingIcon:is,BatteryFull:rs,BatteryFullIcon:rs,BatteryIcon:ls,BatteryLow:os,BatteryLowIcon:os,BatteryMedium:ss,BatteryMediumIcon:ss,BatteryWarning:cs,BatteryWarningIcon:cs,Beaker:ds,BeakerIcon:ds,Bean:us,BeanIcon:us,BeanOff:hs,BeanOffIcon:hs,Bed:ks,BedDouble:ys,BedDoubleIcon:ys,BedIcon:ks,BedSingle:ps,BedSingleIcon:ps,Beef:fs,BeefIcon:fs,Beer:ms,BeerIcon:ms,Bell:Cs,BellDot:gs,BellDotIcon:gs,BellElectric:vs,BellElectricIcon:vs,BellIcon:Cs,BellMinus:xs,BellMinusIcon:xs,BellOff:Ms,BellOffIcon:Ms,BellPlus:ws,BellPlusIcon:ws,BellRing:Ls,BellRingIcon:Ls,Bike:Ss,BikeIcon:Ss,Binary:Is,BinaryIcon:Is,Biohazard:js,BiohazardIcon:js,Bird:Ps,BirdIcon:Ps,Bitcoin:bs,BitcoinIcon:bs,Blinds:As,BlindsIcon:As,Blocks:zs,BlocksIcon:zs,Bluetooth:qs,BluetoothConnected:Vs,BluetoothConnectedIcon:Vs,BluetoothIcon:qs,BluetoothOff:Hs,BluetoothOffIcon:Hs,BluetoothSearching:Ts,BluetoothSearchingIcon:Ts,Bold:Ds,BoldIcon:Ds,Bomb:Fs,BombIcon:Fs,Bone:Rs,BoneIcon:Rs,Book:oc,BookA:Bs,BookAIcon:Bs,BookAudio:Ns,BookAudioIcon:Ns,BookCheck:Es,BookCheckIcon:Es,BookCopy:Os,BookCopyIcon:Os,BookDashed:mn,BookDashedIcon:mn,BookDown:Us,BookDownIcon:Us,BookHeadphones:Zs,BookHeadphonesIcon:Zs,BookHeart:_s,BookHeartIcon:_s,BookIcon:oc,BookImage:Ws,BookImageIcon:Ws,BookKey:Gs,BookKeyIcon:Gs,BookLock:$s,BookLockIcon:$s,BookMarked:Xs,BookMarkedIcon:Xs,BookMinus:Ks,BookMinusIcon:Ks,BookOpen:$a,BookOpenCheck:Qs,BookOpenCheckIcon:Qs,BookOpenIcon:$a,BookOpenText:Ys,BookOpenTextIcon:Ys,BookPlus:Js,BookPlusIcon:Js,BookTemplate:mn,BookTemplateIcon:mn,BookText:ec,BookTextIcon:ec,BookType:tc,BookTypeIcon:tc,BookUp:ac,BookUp2:nc,BookUp2Icon:nc,BookUpIcon:ac,BookUser:ic,BookUserIcon:ic,BookX:rc,BookXIcon:rc,Bookmark:hc,BookmarkCheck:sc,BookmarkCheckIcon:sc,BookmarkIcon:hc,BookmarkMinus:cc,BookmarkMinusIcon:cc,BookmarkPlus:lc,BookmarkPlusIcon:lc,BookmarkX:dc,BookmarkXIcon:dc,BoomBox:uc,BoomBoxIcon:uc,Bot:yc,BotIcon:yc,Box:kc,BoxIcon:kc,BoxSelect:pc,BoxSelectIcon:pc,Boxes:fc,BoxesIcon:fc,Braces:gn,BracesIcon:gn,Brackets:mc,BracketsIcon:mc,Brain:xc,BrainCircuit:gc,BrainCircuitIcon:gc,BrainCog:vc,BrainCogIcon:vc,BrainIcon:xc,BrickWall:Mc,BrickWallIcon:Mc,Briefcase:wc,BriefcaseIcon:wc,BringToFront:Lc,BringToFrontIcon:Lc,Brush:Cc,BrushIcon:Cc,Bug:jc,BugIcon:jc,BugOff:Sc,BugOffIcon:Sc,BugPlay:Ic,BugPlayIcon:Ic,Building:bc,Building2:Pc,Building2Icon:Pc,BuildingIcon:bc,Bus:zc,BusFront:Ac,BusFrontIcon:Ac,BusIcon:zc,Cable:Hc,CableCar:Vc,CableCarIcon:Vc,CableIcon:Hc,Cake:qc,CakeIcon:qc,CakeSlice:Tc,CakeSliceIcon:Tc,Calculator:Dc,CalculatorIcon:Dc,Calendar:m1,CalendarCheck:Rc,CalendarCheck2:Fc,CalendarCheck2Icon:Fc,CalendarCheckIcon:Rc,CalendarClock:Bc,CalendarClockIcon:Bc,CalendarDays:Nc,CalendarDaysIcon:Nc,CalendarHeart:Ec,CalendarHeartIcon:Ec,CalendarIcon:m1,CalendarMinus:Oc,CalendarMinusIcon:Oc,CalendarOff:Uc,CalendarOffIcon:Uc,CalendarPlus:Zc,CalendarPlusIcon:Zc,CalendarRange:_c,CalendarRangeIcon:_c,CalendarSearch:Wc,CalendarSearchIcon:Wc,CalendarX:$c,CalendarX2:Gc,CalendarX2Icon:Gc,CalendarXIcon:$c,Camera:Kc,CameraIcon:Kc,CameraOff:Xc,CameraOffIcon:Xc,CandlestickChart:Qc,CandlestickChartIcon:Qc,Candy:el,CandyCane:Yc,CandyCaneIcon:Yc,CandyIcon:el,CandyOff:Jc,CandyOffIcon:Jc,Car:al,CarFront:tl,CarFrontIcon:tl,CarIcon:al,CarTaxiFront:nl,CarTaxiFrontIcon:nl,Caravan:il,CaravanIcon:il,Carrot:rl,CarrotIcon:rl,CaseLower:ol,CaseLowerIcon:ol,CaseSensitive:sl,CaseSensitiveIcon:sl,CaseUpper:cl,CaseUpperIcon:cl,CassetteTape:ll,CassetteTapeIcon:ll,Cast:dl,CastIcon:dl,Castle:hl,CastleIcon:hl,Cat:ul,CatIcon:ul,Cctv:yl,CctvIcon:yl,Check:v1,CheckCheck:pl,CheckCheckIcon:pl,CheckCircle:kl,CheckCircle2:g1,CheckCircle2Icon:g1,CheckCircleIcon:kl,CheckIcon:v1,CheckSquare:ml,CheckSquare2:fl,CheckSquare2Icon:fl,CheckSquareIcon:ml,ChefHat:gl,ChefHatIcon:gl,Cherry:vl,CherryIcon:vl,ChevronDown:ra,ChevronDownCircle:xl,ChevronDownCircleIcon:xl,ChevronDownIcon:ra,ChevronDownSquare:Ml,ChevronDownSquareIcon:Ml,ChevronFirst:wl,ChevronFirstIcon:wl,ChevronLast:Ll,ChevronLastIcon:Ll,ChevronLeft:Il,ChevronLeftCircle:Cl,ChevronLeftCircleIcon:Cl,ChevronLeftIcon:Il,ChevronLeftSquare:Sl,ChevronLeftSquareIcon:Sl,ChevronRight:Xa,ChevronRightCircle:jl,ChevronRightCircleIcon:jl,ChevronRightIcon:Xa,ChevronRightSquare:Pl,ChevronRightSquareIcon:Pl,ChevronUp:zl,ChevronUpCircle:bl,ChevronUpCircleIcon:bl,ChevronUpIcon:zl,ChevronUpSquare:Al,ChevronUpSquareIcon:Al,ChevronsDown:Hl,ChevronsDownIcon:Hl,ChevronsDownUp:Vl,ChevronsDownUpIcon:Vl,ChevronsLeft:ql,ChevronsLeftIcon:ql,ChevronsLeftRight:Tl,ChevronsLeftRightIcon:Tl,ChevronsRight:Fl,ChevronsRightIcon:Fl,ChevronsRightLeft:Dl,ChevronsRightLeftIcon:Dl,ChevronsUp:Bl,ChevronsUpDown:Rl,ChevronsUpDownIcon:Rl,ChevronsUpIcon:Bl,Chrome:Nl,ChromeIcon:Nl,Church:El,ChurchIcon:El,Cigarette:Ul,CigaretteIcon:Ul,CigaretteOff:Ol,CigaretteOffIcon:Ol,Circle:Yl,CircleDashed:Zl,CircleDashedIcon:Zl,CircleDollarSign:_l,CircleDollarSignIcon:_l,CircleDot:Gl,CircleDotDashed:Wl,CircleDotDashedIcon:Wl,CircleDotIcon:Gl,CircleEllipsis:$l,CircleEllipsisIcon:$l,CircleEqual:Xl,CircleEqualIcon:Xl,CircleIcon:Yl,CircleOff:Kl,CircleOffIcon:Kl,CircleSlash:Ql,CircleSlash2:vn,CircleSlash2Icon:vn,CircleSlashIcon:Ql,CircleSlashed:vn,CircleSlashedIcon:vn,CircleUser:Mn,CircleUserIcon:Mn,CircleUserRound:xn,CircleUserRoundIcon:xn,CircuitBoard:Jl,CircuitBoardIcon:Jl,Citrus:e0,CitrusIcon:e0,Clapperboard:t0,ClapperboardIcon:t0,Clipboard:d0,ClipboardCheck:n0,ClipboardCheckIcon:n0,ClipboardCopy:a0,ClipboardCopyIcon:a0,ClipboardEdit:i0,ClipboardEditIcon:i0,ClipboardIcon:d0,ClipboardList:r0,ClipboardListIcon:r0,ClipboardPaste:o0,ClipboardPasteIcon:o0,ClipboardSignature:s0,ClipboardSignatureIcon:s0,ClipboardType:c0,ClipboardTypeIcon:c0,ClipboardX:l0,ClipboardXIcon:l0,Clock:oa,Clock1:h0,Clock10:u0,Clock10Icon:u0,Clock11:y0,Clock11Icon:y0,Clock12:p0,Clock12Icon:p0,Clock1Icon:h0,Clock2:k0,Clock2Icon:k0,Clock3:f0,Clock3Icon:f0,Clock4:m0,Clock4Icon:m0,Clock5:g0,Clock5Icon:g0,Clock6:v0,Clock6Icon:v0,Clock7:x0,Clock7Icon:x0,Clock8:M0,Clock8Icon:M0,Clock9:w0,Clock9Icon:w0,ClockIcon:oa,Cloud:D0,CloudCog:L0,CloudCogIcon:L0,CloudDrizzle:C0,CloudDrizzleIcon:C0,CloudFog:S0,CloudFogIcon:S0,CloudHail:I0,CloudHailIcon:I0,CloudIcon:D0,CloudLightning:j0,CloudLightningIcon:j0,CloudMoon:b0,CloudMoonIcon:b0,CloudMoonRain:P0,CloudMoonRainIcon:P0,CloudOff:A0,CloudOffIcon:A0,CloudRain:V0,CloudRainIcon:V0,CloudRainWind:z0,CloudRainWindIcon:z0,CloudSnow:H0,CloudSnowIcon:H0,CloudSun:q0,CloudSunIcon:q0,CloudSunRain:T0,CloudSunRainIcon:T0,Cloudy:F0,CloudyIcon:F0,Clover:R0,CloverIcon:R0,Club:B0,ClubIcon:B0,Code:E0,Code2:N0,Code2Icon:N0,CodeIcon:E0,Codepen:O0,CodepenIcon:O0,Codesandbox:U0,CodesandboxIcon:U0,Coffee:Z0,CoffeeIcon:Z0,Cog:_0,CogIcon:_0,Coins:W0,CoinsIcon:W0,Columns:wn,Columns2:wn,Columns2Icon:wn,Columns3:Ln,Columns3Icon:Ln,Columns4:G0,Columns4Icon:G0,ColumnsIcon:wn,Combine:$0,CombineIcon:$0,Command:X0,CommandIcon:X0,Compass:K0,CompassIcon:K0,Component:Q0,ComponentIcon:Q0,Computer:Y0,ComputerIcon:Y0,ConciergeBell:J0,ConciergeBellIcon:J0,Cone:ed,ConeIcon:ed,Construction:td,ConstructionIcon:td,Contact:ad,Contact2:nd,Contact2Icon:nd,ContactIcon:ad,Container:id,ContainerIcon:id,Contrast:rd,ContrastIcon:rd,Cookie:od,CookieIcon:od,CookingPot:sd,CookingPotIcon:sd,Copy:yd,CopyCheck:cd,CopyCheckIcon:cd,CopyIcon:yd,CopyMinus:ld,CopyMinusIcon:ld,CopyPlus:dd,CopyPlusIcon:dd,CopySlash:hd,CopySlashIcon:hd,CopyX:ud,CopyXIcon:ud,Copyleft:pd,CopyleftIcon:pd,Copyright:kd,CopyrightIcon:kd,CornerDownLeft:fd,CornerDownLeftIcon:fd,CornerDownRight:md,CornerDownRightIcon:md,CornerLeftDown:gd,CornerLeftDownIcon:gd,CornerLeftUp:vd,CornerLeftUpIcon:vd,CornerRightDown:xd,CornerRightDownIcon:xd,CornerRightUp:Md,CornerRightUpIcon:Md,CornerUpLeft:wd,CornerUpLeftIcon:wd,CornerUpRight:Ld,CornerUpRightIcon:Ld,Cpu:Cd,CpuIcon:Cd,CreativeCommons:Sd,CreativeCommonsIcon:Sd,CreditCard:Id,CreditCardIcon:Id,Croissant:jd,CroissantIcon:jd,Crop:Pd,CropIcon:Pd,Cross:bd,CrossIcon:bd,Crosshair:Ad,CrosshairIcon:Ad,Crown:zd,CrownIcon:zd,Cuboid:Vd,CuboidIcon:Vd,CupSoda:Hd,CupSodaIcon:Hd,CurlyBraces:gn,CurlyBracesIcon:gn,Currency:Td,CurrencyIcon:Td,Cylinder:qd,CylinderIcon:qd,Database:Rd,DatabaseBackup:Dd,DatabaseBackupIcon:Dd,DatabaseIcon:Rd,DatabaseZap:Fd,DatabaseZapIcon:Fd,Delete:Bd,DeleteIcon:Bd,Dessert:Nd,DessertIcon:Nd,Diameter:Ed,DiameterIcon:Ed,Diamond:Od,DiamondIcon:Od,Dice1:Ud,Dice1Icon:Ud,Dice2:Zd,Dice2Icon:Zd,Dice3:_d,Dice3Icon:_d,Dice4:Wd,Dice4Icon:Wd,Dice5:Gd,Dice5Icon:Gd,Dice6:$d,Dice6Icon:$d,Dices:Xd,DicesIcon:Xd,Diff:Kd,DiffIcon:Kd,Disc:eh,Disc2:Qd,Disc2Icon:Qd,Disc3:Yd,Disc3Icon:Yd,DiscAlbum:Jd,DiscAlbumIcon:Jd,DiscIcon:eh,Divide:ah,DivideCircle:th,DivideCircleIcon:th,DivideIcon:ah,DivideSquare:nh,DivideSquareIcon:nh,Dna:rh,DnaIcon:rh,DnaOff:ih,DnaOffIcon:ih,Dog:oh,DogIcon:oh,DollarSign:sh,DollarSignIcon:sh,Donut:ch,DonutIcon:ch,DoorClosed:lh,DoorClosedIcon:lh,DoorOpen:dh,DoorOpenIcon:dh,Dot:Ka,DotIcon:Ka,Download:uh,DownloadCloud:hh,DownloadCloudIcon:hh,DownloadIcon:uh,DraftingCompass:yh,DraftingCompassIcon:yh,Drama:ph,DramaIcon:ph,Dribbble:kh,DribbbleIcon:kh,Droplet:fh,DropletIcon:fh,Droplets:mh,DropletsIcon:mh,Drum:gh,DrumIcon:gh,Drumstick:vh,DrumstickIcon:vh,Dumbbell:xh,DumbbellIcon:xh,Ear:wh,EarIcon:wh,EarOff:Mh,EarOffIcon:Mh,Edit:it,Edit2:Un,Edit2Icon:Un,Edit3:On,Edit3Icon:On,EditIcon:it,Egg:Sh,EggFried:Lh,EggFriedIcon:Lh,EggIcon:Sh,EggOff:Ch,EggOffIcon:Ch,Equal:jh,EqualIcon:jh,EqualNot:Ih,EqualNotIcon:Ih,Eraser:Ph,EraserIcon:Ph,Euro:bh,EuroIcon:bh,Expand:Ah,ExpandIcon:Ah,ExternalLink:zh,ExternalLinkIcon:zh,Eye:Hh,EyeIcon:Hh,EyeOff:Vh,EyeOffIcon:Vh,Facebook:Th,FacebookIcon:Th,Factory:qh,FactoryIcon:qh,Fan:Dh,FanIcon:Dh,FastForward:Fh,FastForwardIcon:Fh,Feather:Rh,FeatherIcon:Rh,Fence:Bh,FenceIcon:Bh,FerrisWheel:Nh,FerrisWheelIcon:Nh,Figma:Eh,FigmaIcon:Eh,File:Ou,FileArchive:Oh,FileArchiveIcon:Oh,FileAudio:Zh,FileAudio2:Uh,FileAudio2Icon:Uh,FileAudioIcon:Zh,FileAxis3D:Cn,FileAxis3DIcon:Cn,FileAxis3d:Cn,FileAxis3dIcon:Cn,FileBadge:Wh,FileBadge2:_h,FileBadge2Icon:_h,FileBadgeIcon:Wh,FileBarChart:$h,FileBarChart2:Gh,FileBarChart2Icon:Gh,FileBarChartIcon:$h,FileBox:Xh,FileBoxIcon:Xh,FileCheck:Qh,FileCheck2:Kh,FileCheck2Icon:Kh,FileCheckIcon:Qh,FileClock:Yh,FileClockIcon:Yh,FileCode:eu,FileCode2:Jh,FileCode2Icon:Jh,FileCodeIcon:eu,FileCog:Sn,FileCog2:Sn,FileCog2Icon:Sn,FileCogIcon:Sn,FileDiff:tu,FileDiffIcon:tu,FileDigit:nu,FileDigitIcon:nu,FileDown:au,FileDownIcon:au,FileEdit:iu,FileEditIcon:iu,FileHeart:ru,FileHeartIcon:ru,FileIcon:Ou,FileImage:ou,FileImageIcon:ou,FileInput:su,FileInputIcon:su,FileJson:lu,FileJson2:cu,FileJson2Icon:cu,FileJsonIcon:lu,FileKey:hu,FileKey2:du,FileKey2Icon:du,FileKeyIcon:hu,FileLineChart:uu,FileLineChartIcon:uu,FileLock:pu,FileLock2:yu,FileLock2Icon:yu,FileLockIcon:pu,FileMinus:fu,FileMinus2:ku,FileMinus2Icon:ku,FileMinusIcon:fu,FileMusic:mu,FileMusicIcon:mu,FileOutput:gu,FileOutputIcon:gu,FilePieChart:vu,FilePieChartIcon:vu,FilePlus:Mu,FilePlus2:xu,FilePlus2Icon:xu,FilePlusIcon:Mu,FileQuestion:wu,FileQuestionIcon:wu,FileScan:Lu,FileScanIcon:Lu,FileSearch:Su,FileSearch2:Cu,FileSearch2Icon:Cu,FileSearchIcon:Su,FileSignature:Iu,FileSignatureIcon:Iu,FileSpreadsheet:ju,FileSpreadsheetIcon:ju,FileStack:Pu,FileStackIcon:Pu,FileSymlink:bu,FileSymlinkIcon:bu,FileTerminal:Au,FileTerminalIcon:Au,FileText:zu,FileTextIcon:zu,FileType:Hu,FileType2:Vu,FileType2Icon:Vu,FileTypeIcon:Hu,FileUp:Tu,FileUpIcon:Tu,FileVideo:Du,FileVideo2:qu,FileVideo2Icon:qu,FileVideoIcon:Du,FileVolume:Ru,FileVolume2:Fu,FileVolume2Icon:Fu,FileVolumeIcon:Ru,FileWarning:Bu,FileWarningIcon:Bu,FileX:Eu,FileX2:Nu,FileX2Icon:Nu,FileXIcon:Eu,Files:Uu,FilesIcon:Uu,Film:Zu,FilmIcon:Zu,Filter:sa,FilterIcon:sa,FilterX:_u,FilterXIcon:_u,Fingerprint:Wu,FingerprintIcon:Wu,FireExtinguisher:Gu,FireExtinguisherIcon:Gu,Fish:Ku,FishIcon:Ku,FishOff:$u,FishOffIcon:$u,FishSymbol:Xu,FishSymbolIcon:Xu,Flag:ey,FlagIcon:ey,FlagOff:Qu,FlagOffIcon:Qu,FlagTriangleLeft:Yu,FlagTriangleLeftIcon:Yu,FlagTriangleRight:Ju,FlagTriangleRightIcon:Ju,Flame:ny,FlameIcon:ny,FlameKindling:ty,FlameKindlingIcon:ty,Flashlight:iy,FlashlightIcon:iy,FlashlightOff:ay,FlashlightOffIcon:ay,FlaskConical:oy,FlaskConicalIcon:oy,FlaskConicalOff:ry,FlaskConicalOffIcon:ry,FlaskRound:sy,FlaskRoundIcon:sy,FlipHorizontal:ly,FlipHorizontal2:cy,FlipHorizontal2Icon:cy,FlipHorizontalIcon:ly,FlipVertical:hy,FlipVertical2:dy,FlipVertical2Icon:dy,FlipVerticalIcon:hy,Flower:yy,Flower2:uy,Flower2Icon:uy,FlowerIcon:yy,Focus:py,FocusIcon:py,FoldHorizontal:ky,FoldHorizontalIcon:ky,FoldVertical:fy,FoldVerticalIcon:fy,Folder:Zy,FolderArchive:my,FolderArchiveIcon:my,FolderCheck:gy,FolderCheckIcon:gy,FolderClock:vy,FolderClockIcon:vy,FolderClosed:xy,FolderClosedIcon:xy,FolderCog:In,FolderCog2:In,FolderCog2Icon:In,FolderCogIcon:In,FolderDot:My,FolderDotIcon:My,FolderDown:wy,FolderDownIcon:wy,FolderEdit:Ly,FolderEditIcon:Ly,FolderGit:Sy,FolderGit2:Cy,FolderGit2Icon:Cy,FolderGitIcon:Sy,FolderHeart:Iy,FolderHeartIcon:Iy,FolderIcon:Zy,FolderInput:jy,FolderInputIcon:jy,FolderKanban:Py,FolderKanbanIcon:Py,FolderKey:by,FolderKeyIcon:by,FolderLock:Ay,FolderLockIcon:Ay,FolderMinus:zy,FolderMinusIcon:zy,FolderOpen:Hy,FolderOpenDot:Vy,FolderOpenDotIcon:Vy,FolderOpenIcon:Hy,FolderOutput:Ty,FolderOutputIcon:Ty,FolderPlus:qy,FolderPlusIcon:qy,FolderRoot:Dy,FolderRootIcon:Dy,FolderSearch:Ry,FolderSearch2:Fy,FolderSearch2Icon:Fy,FolderSearchIcon:Ry,FolderSymlink:By,FolderSymlinkIcon:By,FolderSync:Ny,FolderSyncIcon:Ny,FolderTree:Ey,FolderTreeIcon:Ey,FolderUp:Oy,FolderUpIcon:Oy,FolderX:Uy,FolderXIcon:Uy,Folders:_y,FoldersIcon:_y,Footprints:Wy,FootprintsIcon:Wy,Forklift:Gy,ForkliftIcon:Gy,FormInput:$y,FormInputIcon:$y,Forward:Xy,ForwardIcon:Xy,Frame:Ky,FrameIcon:Ky,Framer:Qy,FramerIcon:Qy,Frown:Yy,FrownIcon:Yy,Fuel:Jy,FuelIcon:Jy,Fullscreen:ep,FullscreenIcon:ep,FunctionSquare:tp,FunctionSquareIcon:tp,GalleryHorizontal:ap,GalleryHorizontalEnd:np,GalleryHorizontalEndIcon:np,GalleryHorizontalIcon:ap,GalleryThumbnails:ip,GalleryThumbnailsIcon:ip,GalleryVertical:op,GalleryVerticalEnd:rp,GalleryVerticalEndIcon:rp,GalleryVerticalIcon:op,Gamepad:cp,Gamepad2:sp,Gamepad2Icon:sp,GamepadIcon:cp,GanttChart:lp,GanttChartIcon:lp,GanttChartSquare:jn,GanttChartSquareIcon:jn,Gauge:hp,GaugeCircle:dp,GaugeCircleIcon:dp,GaugeIcon:hp,Gavel:up,GavelIcon:up,Gem:yp,GemIcon:yp,Ghost:pp,GhostIcon:pp,Gift:kp,GiftIcon:kp,GitBranch:mp,GitBranchIcon:mp,GitBranchPlus:fp,GitBranchPlusIcon:fp,GitCommit:Pn,GitCommitHorizontal:Pn,GitCommitHorizontalIcon:Pn,GitCommitIcon:Pn,GitCommitVertical:gp,GitCommitVerticalIcon:gp,GitCompare:xp,GitCompareArrows:vp,GitCompareArrowsIcon:vp,GitCompareIcon:xp,GitFork:Mp,GitForkIcon:Mp,GitGraph:wp,GitGraphIcon:wp,GitMerge:Lp,GitMergeIcon:Lp,GitPullRequest:bp,GitPullRequestArrow:Cp,GitPullRequestArrowIcon:Cp,GitPullRequestClosed:Sp,GitPullRequestClosedIcon:Sp,GitPullRequestCreate:jp,GitPullRequestCreateArrow:Ip,GitPullRequestCreateArrowIcon:Ip,GitPullRequestCreateIcon:jp,GitPullRequestDraft:Pp,GitPullRequestDraftIcon:Pp,GitPullRequestIcon:bp,Github:Ap,GithubIcon:Ap,Gitlab:zp,GitlabIcon:zp,GlassWater:Vp,GlassWaterIcon:Vp,Glasses:Hp,GlassesIcon:Hp,Globe:qp,Globe2:Tp,Globe2Icon:Tp,GlobeIcon:qp,Goal:Dp,GoalIcon:Dp,Grab:Fp,GrabIcon:Fp,GraduationCap:Rp,GraduationCapIcon:Rp,Grape:Bp,GrapeIcon:Bp,Grid:at,Grid2X2:bn,Grid2X2Icon:bn,Grid2x2:bn,Grid2x2Icon:bn,Grid3X3:at,Grid3X3Icon:at,Grid3x3:at,Grid3x3Icon:at,GridIcon:at,Grip:Op,GripHorizontal:Np,GripHorizontalIcon:Np,GripIcon:Op,GripVertical:Ep,GripVerticalIcon:Ep,Group:Up,GroupIcon:Up,Guitar:Zp,GuitarIcon:Zp,Hammer:_p,HammerIcon:_p,Hand:x1,HandIcon:x1,HandMetal:Wp,HandMetalIcon:Wp,HardDrive:Xp,HardDriveDownload:Gp,HardDriveDownloadIcon:Gp,HardDriveIcon:Xp,HardDriveUpload:$p,HardDriveUploadIcon:$p,HardHat:Kp,HardHatIcon:Kp,Hash:Qp,HashIcon:Qp,Haze:Yp,HazeIcon:Yp,HdmiPort:Jp,HdmiPortIcon:Jp,Heading:ok,Heading1:ek,Heading1Icon:ek,Heading2:tk,Heading2Icon:tk,Heading3:nk,Heading3Icon:nk,Heading4:ak,Heading4Icon:ak,Heading5:ik,Heading5Icon:ik,Heading6:rk,Heading6Icon:rk,HeadingIcon:ok,Headphones:sk,HeadphonesIcon:sk,Heart:uk,HeartCrack:ck,HeartCrackIcon:ck,HeartHandshake:lk,HeartHandshakeIcon:lk,HeartIcon:uk,HeartOff:dk,HeartOffIcon:dk,HeartPulse:hk,HeartPulseIcon:hk,HelpCircle:yk,HelpCircleIcon:yk,HelpingHand:pk,HelpingHandIcon:pk,Hexagon:kk,HexagonIcon:kk,Highlighter:fk,HighlighterIcon:fk,History:mk,HistoryIcon:mk,Home:Qa,HomeIcon:Qa,Hop:vk,HopIcon:vk,HopOff:gk,HopOffIcon:gk,Hotel:xk,HotelIcon:xk,Hourglass:Mk,HourglassIcon:Mk,IceCream:Lk,IceCream2:wk,IceCream2Icon:wk,IceCreamIcon:Lk,Image:Pk,ImageDown:Ck,ImageDownIcon:Ck,ImageIcon:Pk,ImageMinus:Sk,ImageMinusIcon:Sk,ImageOff:Ik,ImageOffIcon:Ik,ImagePlus:jk,ImagePlusIcon:jk,Import:bk,ImportIcon:bk,Inbox:Ak,InboxIcon:Ak,Indent:zk,IndentIcon:zk,IndianRupee:Vk,IndianRupeeIcon:Vk,Infinity:Hk,InfinityIcon:Hk,Info:Tk,InfoIcon:Tk,Inspect:Vn,InspectIcon:Vn,InspectionPanel:qk,InspectionPanelIcon:qk,Instagram:Dk,InstagramIcon:Dk,Italic:Fk,ItalicIcon:Fk,IterationCcw:Rk,IterationCcwIcon:Rk,IterationCw:Bk,IterationCwIcon:Bk,JapaneseYen:Nk,JapaneseYenIcon:Nk,Joystick:Ek,JoystickIcon:Ek,Kanban:Ok,KanbanIcon:Ok,KanbanSquare:zn,KanbanSquareDashed:An,KanbanSquareDashedIcon:An,KanbanSquareIcon:zn,Key:_k,KeyIcon:_k,KeyRound:Uk,KeyRoundIcon:Uk,KeySquare:Zk,KeySquareIcon:Zk,Keyboard:Gk,KeyboardIcon:Gk,KeyboardMusic:Wk,KeyboardMusicIcon:Wk,Lamp:Jk,LampCeiling:$k,LampCeilingIcon:$k,LampDesk:Xk,LampDeskIcon:Xk,LampFloor:Kk,LampFloorIcon:Kk,LampIcon:Jk,LampWallDown:Qk,LampWallDownIcon:Qk,LampWallUp:Yk,LampWallUpIcon:Yk,LandPlot:e4,LandPlotIcon:e4,Landmark:t4,LandmarkIcon:t4,Languages:n4,LanguagesIcon:n4,Laptop:i4,Laptop2:a4,Laptop2Icon:a4,LaptopIcon:i4,Lasso:o4,LassoIcon:o4,LassoSelect:r4,LassoSelectIcon:r4,Laugh:s4,LaughIcon:s4,Layers:Ya,Layers2:c4,Layers2Icon:c4,Layers3:l4,Layers3Icon:l4,LayersIcon:Ya,Layout:En,LayoutDashboard:d4,LayoutDashboardIcon:d4,LayoutGrid:h4,LayoutGridIcon:h4,LayoutIcon:En,LayoutList:u4,LayoutListIcon:u4,LayoutPanelLeft:y4,LayoutPanelLeftIcon:y4,LayoutPanelTop:p4,LayoutPanelTopIcon:p4,LayoutTemplate:k4,LayoutTemplateIcon:k4,Leaf:f4,LeafIcon:f4,LeafyGreen:m4,LeafyGreenIcon:m4,Library:x4,LibraryBig:g4,LibraryBigIcon:g4,LibraryIcon:x4,LibrarySquare:v4,LibrarySquareIcon:v4,LifeBuoy:M4,LifeBuoyIcon:M4,Ligature:w4,LigatureIcon:w4,Lightbulb:M1,LightbulbIcon:M1,LightbulbOff:L4,LightbulbOffIcon:L4,LineChart:C4,LineChartIcon:C4,Link:j4,Link2:I4,Link2Icon:I4,Link2Off:S4,Link2OffIcon:S4,LinkIcon:j4,Linkedin:P4,LinkedinIcon:P4,List:O4,ListChecks:b4,ListChecksIcon:b4,ListEnd:A4,ListEndIcon:A4,ListFilter:z4,ListFilterIcon:z4,ListIcon:O4,ListMinus:V4,ListMinusIcon:V4,ListMusic:H4,ListMusicIcon:H4,ListOrdered:T4,ListOrderedIcon:T4,ListPlus:q4,ListPlusIcon:q4,ListRestart:D4,ListRestartIcon:D4,ListStart:F4,ListStartIcon:F4,ListTodo:R4,ListTodoIcon:R4,ListTree:B4,ListTreeIcon:B4,ListVideo:N4,ListVideoIcon:N4,ListX:E4,ListXIcon:E4,Loader:Z4,Loader2:U4,Loader2Icon:U4,LoaderIcon:Z4,Locate:G4,LocateFixed:_4,LocateFixedIcon:_4,LocateIcon:G4,LocateOff:W4,LocateOffIcon:W4,Lock:X4,LockIcon:X4,LockKeyhole:$4,LockKeyholeIcon:$4,LogIn:K4,LogInIcon:K4,LogOut:Q4,LogOutIcon:Q4,Lollipop:Y4,LollipopIcon:Y4,LucideAArrowDown:xr,LucideAArrowUp:Mr,LucideALargeSmall:wr,LucideAccessibility:Lr,LucideActivity:Sr,LucideActivitySquare:Cr,LucideAirVent:Ir,LucideAirplay:jr,LucideAlarmCheck:on,LucideAlarmClock:br,LucideAlarmClockCheck:on,LucideAlarmClockMinus:sn,LucideAlarmClockOff:Pr,LucideAlarmClockPlus:cn,LucideAlarmMinus:sn,LucideAlarmPlus:cn,LucideAlarmSmoke:Ar,LucideAlbum:zr,LucideAlertCircle:ia,LucideAlertOctagon:Vr,LucideAlertTriangle:Ut,LucideAlignCenter:qr,LucideAlignCenterHorizontal:Hr,LucideAlignCenterVertical:Tr,LucideAlignEndHorizontal:Dr,LucideAlignEndVertical:Fr,LucideAlignHorizontalDistributeCenter:Rr,LucideAlignHorizontalDistributeEnd:Br,LucideAlignHorizontalDistributeStart:Nr,LucideAlignHorizontalJustifyCenter:Er,LucideAlignHorizontalJustifyEnd:Or,LucideAlignHorizontalJustifyStart:Ur,LucideAlignHorizontalSpaceAround:Zr,LucideAlignHorizontalSpaceBetween:_r,LucideAlignJustify:Wr,LucideAlignLeft:Gr,LucideAlignRight:$r,LucideAlignStartHorizontal:Xr,LucideAlignStartVertical:Kr,LucideAlignVerticalDistributeCenter:Qr,LucideAlignVerticalDistributeEnd:Yr,LucideAlignVerticalDistributeStart:Jr,LucideAlignVerticalJustifyCenter:eo,LucideAlignVerticalJustifyEnd:to,LucideAlignVerticalJustifyStart:no,LucideAlignVerticalSpaceAround:ao,LucideAlignVerticalSpaceBetween:io,LucideAmpersand:ro,LucideAmpersands:oo,LucideAnchor:so,LucideAngry:co,LucideAnnoyed:lo,LucideAntenna:ho,LucideAnvil:uo,LucideAperture:yo,LucideAppWindow:po,LucideApple:ko,LucideArchive:go,LucideArchiveRestore:fo,LucideArchiveX:mo,LucideAreaChart:vo,LucideArmchair:xo,LucideArrowBigDown:wo,LucideArrowBigDownDash:Mo,LucideArrowBigLeft:Co,LucideArrowBigLeftDash:Lo,LucideArrowBigRight:Io,LucideArrowBigRightDash:So,LucideArrowBigUp:Po,LucideArrowBigUpDash:jo,LucideArrowDown:Zo,LucideArrowDown01:bo,LucideArrowDown10:Ao,LucideArrowDownAZ:ln,LucideArrowDownAz:ln,LucideArrowDownCircle:zo,LucideArrowDownFromLine:Vo,LucideArrowDownLeft:qo,LucideArrowDownLeftFromCircle:Ho,LucideArrowDownLeftSquare:To,LucideArrowDownNarrowWide:Do,LucideArrowDownRight:Bo,LucideArrowDownRightFromCircle:Fo,LucideArrowDownRightSquare:Ro,LucideArrowDownSquare:No,LucideArrowDownToDot:Eo,LucideArrowDownToLine:Oo,LucideArrowDownUp:Uo,LucideArrowDownWideNarrow:dn,LucideArrowDownZA:hn,LucideArrowDownZa:hn,LucideArrowLeft:Ko,LucideArrowLeftCircle:_o,LucideArrowLeftFromLine:Wo,LucideArrowLeftRight:Go,LucideArrowLeftSquare:$o,LucideArrowLeftToLine:Xo,LucideArrowRight:n2,LucideArrowRightCircle:Qo,LucideArrowRightFromLine:Yo,LucideArrowRightLeft:Jo,LucideArrowRightSquare:e2,LucideArrowRightToLine:t2,LucideArrowUp:g2,LucideArrowUp01:a2,LucideArrowUp10:i2,LucideArrowUpAZ:un,LucideArrowUpAz:un,LucideArrowUpCircle:r2,LucideArrowUpDown:o2,LucideArrowUpFromDot:s2,LucideArrowUpFromLine:c2,LucideArrowUpLeft:h2,LucideArrowUpLeftFromCircle:l2,LucideArrowUpLeftSquare:d2,LucideArrowUpNarrowWide:yn,LucideArrowUpRight:p2,LucideArrowUpRightFromCircle:u2,LucideArrowUpRightSquare:y2,LucideArrowUpSquare:k2,LucideArrowUpToLine:f2,LucideArrowUpWideNarrow:m2,LucideArrowUpZA:pn,LucideArrowUpZa:pn,LucideArrowsUpFromLine:v2,LucideAsterisk:x2,LucideAtSign:M2,LucideAtom:w2,LucideAudioLines:L2,LucideAudioWaveform:C2,LucideAward:S2,LucideAxe:I2,LucideAxis3D:kn,LucideAxis3d:kn,LucideBaby:Ga,LucideBackpack:j2,LucideBadge:U2,LucideBadgeAlert:P2,LucideBadgeCent:b2,LucideBadgeCheck:fn,LucideBadgeDollarSign:A2,LucideBadgeEuro:z2,LucideBadgeHelp:V2,LucideBadgeIndianRupee:H2,LucideBadgeInfo:T2,LucideBadgeJapaneseYen:q2,LucideBadgeMinus:D2,LucideBadgePercent:F2,LucideBadgePlus:R2,LucideBadgePoundSterling:B2,LucideBadgeRussianRuble:N2,LucideBadgeSwissFranc:E2,LucideBadgeX:O2,LucideBaggageClaim:Z2,LucideBan:_2,LucideBanana:W2,LucideBanknote:G2,LucideBarChart:es,LucideBarChart2:$2,LucideBarChart3:X2,LucideBarChart4:K2,LucideBarChartBig:Q2,LucideBarChartHorizontal:J2,LucideBarChartHorizontalBig:Y2,LucideBarcode:ts,LucideBaseline:ns,LucideBath:as,LucideBattery:ls,LucideBatteryCharging:is,LucideBatteryFull:rs,LucideBatteryLow:os,LucideBatteryMedium:ss,LucideBatteryWarning:cs,LucideBeaker:ds,LucideBean:us,LucideBeanOff:hs,LucideBed:ks,LucideBedDouble:ys,LucideBedSingle:ps,LucideBeef:fs,LucideBeer:ms,LucideBell:Cs,LucideBellDot:gs,LucideBellElectric:vs,LucideBellMinus:xs,LucideBellOff:Ms,LucideBellPlus:ws,LucideBellRing:Ls,LucideBike:Ss,LucideBinary:Is,LucideBiohazard:js,LucideBird:Ps,LucideBitcoin:bs,LucideBlinds:As,LucideBlocks:zs,LucideBluetooth:qs,LucideBluetoothConnected:Vs,LucideBluetoothOff:Hs,LucideBluetoothSearching:Ts,LucideBold:Ds,LucideBomb:Fs,LucideBone:Rs,LucideBook:oc,LucideBookA:Bs,LucideBookAudio:Ns,LucideBookCheck:Es,LucideBookCopy:Os,LucideBookDashed:mn,LucideBookDown:Us,LucideBookHeadphones:Zs,LucideBookHeart:_s,LucideBookImage:Ws,LucideBookKey:Gs,LucideBookLock:$s,LucideBookMarked:Xs,LucideBookMinus:Ks,LucideBookOpen:$a,LucideBookOpenCheck:Qs,LucideBookOpenText:Ys,LucideBookPlus:Js,LucideBookTemplate:mn,LucideBookText:ec,LucideBookType:tc,LucideBookUp:ac,LucideBookUp2:nc,LucideBookUser:ic,LucideBookX:rc,LucideBookmark:hc,LucideBookmarkCheck:sc,LucideBookmarkMinus:cc,LucideBookmarkPlus:lc,LucideBookmarkX:dc,LucideBoomBox:uc,LucideBot:yc,LucideBox:kc,LucideBoxSelect:pc,LucideBoxes:fc,LucideBraces:gn,LucideBrackets:mc,LucideBrain:xc,LucideBrainCircuit:gc,LucideBrainCog:vc,LucideBrickWall:Mc,LucideBriefcase:wc,LucideBringToFront:Lc,LucideBrush:Cc,LucideBug:jc,LucideBugOff:Sc,LucideBugPlay:Ic,LucideBuilding:bc,LucideBuilding2:Pc,LucideBus:zc,LucideBusFront:Ac,LucideCable:Hc,LucideCableCar:Vc,LucideCake:qc,LucideCakeSlice:Tc,LucideCalculator:Dc,LucideCalendar:m1,LucideCalendarCheck:Rc,LucideCalendarCheck2:Fc,LucideCalendarClock:Bc,LucideCalendarDays:Nc,LucideCalendarHeart:Ec,LucideCalendarMinus:Oc,LucideCalendarOff:Uc,LucideCalendarPlus:Zc,LucideCalendarRange:_c,LucideCalendarSearch:Wc,LucideCalendarX:$c,LucideCalendarX2:Gc,LucideCamera:Kc,LucideCameraOff:Xc,LucideCandlestickChart:Qc,LucideCandy:el,LucideCandyCane:Yc,LucideCandyOff:Jc,LucideCar:al,LucideCarFront:tl,LucideCarTaxiFront:nl,LucideCaravan:il,LucideCarrot:rl,LucideCaseLower:ol,LucideCaseSensitive:sl,LucideCaseUpper:cl,LucideCassetteTape:ll,LucideCast:dl,LucideCastle:hl,LucideCat:ul,LucideCctv:yl,LucideCheck:v1,LucideCheckCheck:pl,LucideCheckCircle:kl,LucideCheckCircle2:g1,LucideCheckSquare:ml,LucideCheckSquare2:fl,LucideChefHat:gl,LucideCherry:vl,LucideChevronDown:ra,LucideChevronDownCircle:xl,LucideChevronDownSquare:Ml,LucideChevronFirst:wl,LucideChevronLast:Ll,LucideChevronLeft:Il,LucideChevronLeftCircle:Cl,LucideChevronLeftSquare:Sl,LucideChevronRight:Xa,LucideChevronRightCircle:jl,LucideChevronRightSquare:Pl,LucideChevronUp:zl,LucideChevronUpCircle:bl,LucideChevronUpSquare:Al,LucideChevronsDown:Hl,LucideChevronsDownUp:Vl,LucideChevronsLeft:ql,LucideChevronsLeftRight:Tl,LucideChevronsRight:Fl,LucideChevronsRightLeft:Dl,LucideChevronsUp:Bl,LucideChevronsUpDown:Rl,LucideChrome:Nl,LucideChurch:El,LucideCigarette:Ul,LucideCigaretteOff:Ol,LucideCircle:Yl,LucideCircleDashed:Zl,LucideCircleDollarSign:_l,LucideCircleDot:Gl,LucideCircleDotDashed:Wl,LucideCircleEllipsis:$l,LucideCircleEqual:Xl,LucideCircleOff:Kl,LucideCircleSlash:Ql,LucideCircleSlash2:vn,LucideCircleSlashed:vn,LucideCircleUser:Mn,LucideCircleUserRound:xn,LucideCircuitBoard:Jl,LucideCitrus:e0,LucideClapperboard:t0,LucideClipboard:d0,LucideClipboardCheck:n0,LucideClipboardCopy:a0,LucideClipboardEdit:i0,LucideClipboardList:r0,LucideClipboardPaste:o0,LucideClipboardSignature:s0,LucideClipboardType:c0,LucideClipboardX:l0,LucideClock:oa,LucideClock1:h0,LucideClock10:u0,LucideClock11:y0,LucideClock12:p0,LucideClock2:k0,LucideClock3:f0,LucideClock4:m0,LucideClock5:g0,LucideClock6:v0,LucideClock7:x0,LucideClock8:M0,LucideClock9:w0,LucideCloud:D0,LucideCloudCog:L0,LucideCloudDrizzle:C0,LucideCloudFog:S0,LucideCloudHail:I0,LucideCloudLightning:j0,LucideCloudMoon:b0,LucideCloudMoonRain:P0,LucideCloudOff:A0,LucideCloudRain:V0,LucideCloudRainWind:z0,LucideCloudSnow:H0,LucideCloudSun:q0,LucideCloudSunRain:T0,LucideCloudy:F0,LucideClover:R0,LucideClub:B0,LucideCode:E0,LucideCode2:N0,LucideCodepen:O0,LucideCodesandbox:U0,LucideCoffee:Z0,LucideCog:_0,LucideCoins:W0,LucideColumns:wn,LucideColumns2:wn,LucideColumns3:Ln,LucideColumns4:G0,LucideCombine:$0,LucideCommand:X0,LucideCompass:K0,LucideComponent:Q0,LucideComputer:Y0,LucideConciergeBell:J0,LucideCone:ed,LucideConstruction:td,LucideContact:ad,LucideContact2:nd,LucideContainer:id,LucideContrast:rd,LucideCookie:od,LucideCookingPot:sd,LucideCopy:yd,LucideCopyCheck:cd,LucideCopyMinus:ld,LucideCopyPlus:dd,LucideCopySlash:hd,LucideCopyX:ud,LucideCopyleft:pd,LucideCopyright:kd,LucideCornerDownLeft:fd,LucideCornerDownRight:md,LucideCornerLeftDown:gd,LucideCornerLeftUp:vd,LucideCornerRightDown:xd,LucideCornerRightUp:Md,LucideCornerUpLeft:wd,LucideCornerUpRight:Ld,LucideCpu:Cd,LucideCreativeCommons:Sd,LucideCreditCard:Id,LucideCroissant:jd,LucideCrop:Pd,LucideCross:bd,LucideCrosshair:Ad,LucideCrown:zd,LucideCuboid:Vd,LucideCupSoda:Hd,LucideCurlyBraces:gn,LucideCurrency:Td,LucideCylinder:qd,LucideDatabase:Rd,LucideDatabaseBackup:Dd,LucideDatabaseZap:Fd,LucideDelete:Bd,LucideDessert:Nd,LucideDiameter:Ed,LucideDiamond:Od,LucideDice1:Ud,LucideDice2:Zd,LucideDice3:_d,LucideDice4:Wd,LucideDice5:Gd,LucideDice6:$d,LucideDices:Xd,LucideDiff:Kd,LucideDisc:eh,LucideDisc2:Qd,LucideDisc3:Yd,LucideDiscAlbum:Jd,LucideDivide:ah,LucideDivideCircle:th,LucideDivideSquare:nh,LucideDna:rh,LucideDnaOff:ih,LucideDog:oh,LucideDollarSign:sh,LucideDonut:ch,LucideDoorClosed:lh,LucideDoorOpen:dh,LucideDot:Ka,LucideDownload:uh,LucideDownloadCloud:hh,LucideDraftingCompass:yh,LucideDrama:ph,LucideDribbble:kh,LucideDroplet:fh,LucideDroplets:mh,LucideDrum:gh,LucideDrumstick:vh,LucideDumbbell:xh,LucideEar:wh,LucideEarOff:Mh,LucideEdit:it,LucideEdit2:Un,LucideEdit3:On,LucideEgg:Sh,LucideEggFried:Lh,LucideEggOff:Ch,LucideEqual:jh,LucideEqualNot:Ih,LucideEraser:Ph,LucideEuro:bh,LucideExpand:Ah,LucideExternalLink:zh,LucideEye:Hh,LucideEyeOff:Vh,LucideFacebook:Th,LucideFactory:qh,LucideFan:Dh,LucideFastForward:Fh,LucideFeather:Rh,LucideFence:Bh,LucideFerrisWheel:Nh,LucideFigma:Eh,LucideFile:Ou,LucideFileArchive:Oh,LucideFileAudio:Zh,LucideFileAudio2:Uh,LucideFileAxis3D:Cn,LucideFileAxis3d:Cn,LucideFileBadge:Wh,LucideFileBadge2:_h,LucideFileBarChart:$h,LucideFileBarChart2:Gh,LucideFileBox:Xh,LucideFileCheck:Qh,LucideFileCheck2:Kh,LucideFileClock:Yh,LucideFileCode:eu,LucideFileCode2:Jh,LucideFileCog:Sn,LucideFileCog2:Sn,LucideFileDiff:tu,LucideFileDigit:nu,LucideFileDown:au,LucideFileEdit:iu,LucideFileHeart:ru,LucideFileImage:ou,LucideFileInput:su,LucideFileJson:lu,LucideFileJson2:cu,LucideFileKey:hu,LucideFileKey2:du,LucideFileLineChart:uu,LucideFileLock:pu,LucideFileLock2:yu,LucideFileMinus:fu,LucideFileMinus2:ku,LucideFileMusic:mu,LucideFileOutput:gu,LucideFilePieChart:vu,LucideFilePlus:Mu,LucideFilePlus2:xu,LucideFileQuestion:wu,LucideFileScan:Lu,LucideFileSearch:Su,LucideFileSearch2:Cu,LucideFileSignature:Iu,LucideFileSpreadsheet:ju,LucideFileStack:Pu,LucideFileSymlink:bu,LucideFileTerminal:Au,LucideFileText:zu,LucideFileType:Hu,LucideFileType2:Vu,LucideFileUp:Tu,LucideFileVideo:Du,LucideFileVideo2:qu,LucideFileVolume:Ru,LucideFileVolume2:Fu,LucideFileWarning:Bu,LucideFileX:Eu,LucideFileX2:Nu,LucideFiles:Uu,LucideFilm:Zu,LucideFilter:sa,LucideFilterX:_u,LucideFingerprint:Wu,LucideFireExtinguisher:Gu,LucideFish:Ku,LucideFishOff:$u,LucideFishSymbol:Xu,LucideFlag:ey,LucideFlagOff:Qu,LucideFlagTriangleLeft:Yu,LucideFlagTriangleRight:Ju,LucideFlame:ny,LucideFlameKindling:ty,LucideFlashlight:iy,LucideFlashlightOff:ay,LucideFlaskConical:oy,LucideFlaskConicalOff:ry,LucideFlaskRound:sy,LucideFlipHorizontal:ly,LucideFlipHorizontal2:cy,LucideFlipVertical:hy,LucideFlipVertical2:dy,LucideFlower:yy,LucideFlower2:uy,LucideFocus:py,LucideFoldHorizontal:ky,LucideFoldVertical:fy,LucideFolder:Zy,LucideFolderArchive:my,LucideFolderCheck:gy,LucideFolderClock:vy,LucideFolderClosed:xy,LucideFolderCog:In,LucideFolderCog2:In,LucideFolderDot:My,LucideFolderDown:wy,LucideFolderEdit:Ly,LucideFolderGit:Sy,LucideFolderGit2:Cy,LucideFolderHeart:Iy,LucideFolderInput:jy,LucideFolderKanban:Py,LucideFolderKey:by,LucideFolderLock:Ay,LucideFolderMinus:zy,LucideFolderOpen:Hy,LucideFolderOpenDot:Vy,LucideFolderOutput:Ty,LucideFolderPlus:qy,LucideFolderRoot:Dy,LucideFolderSearch:Ry,LucideFolderSearch2:Fy,LucideFolderSymlink:By,LucideFolderSync:Ny,LucideFolderTree:Ey,LucideFolderUp:Oy,LucideFolderX:Uy,LucideFolders:_y,LucideFootprints:Wy,LucideForklift:Gy,LucideFormInput:$y,LucideForward:Xy,LucideFrame:Ky,LucideFramer:Qy,LucideFrown:Yy,LucideFuel:Jy,LucideFullscreen:ep,LucideFunctionSquare:tp,LucideGalleryHorizontal:ap,LucideGalleryHorizontalEnd:np,LucideGalleryThumbnails:ip,LucideGalleryVertical:op,LucideGalleryVerticalEnd:rp,LucideGamepad:cp,LucideGamepad2:sp,LucideGanttChart:lp,LucideGanttChartSquare:jn,LucideGauge:hp,LucideGaugeCircle:dp,LucideGavel:up,LucideGem:yp,LucideGhost:pp,LucideGift:kp,LucideGitBranch:mp,LucideGitBranchPlus:fp,LucideGitCommit:Pn,LucideGitCommitHorizontal:Pn,LucideGitCommitVertical:gp,LucideGitCompare:xp,LucideGitCompareArrows:vp,LucideGitFork:Mp,LucideGitGraph:wp,LucideGitMerge:Lp,LucideGitPullRequest:bp,LucideGitPullRequestArrow:Cp,LucideGitPullRequestClosed:Sp,LucideGitPullRequestCreate:jp,LucideGitPullRequestCreateArrow:Ip,LucideGitPullRequestDraft:Pp,LucideGithub:Ap,LucideGitlab:zp,LucideGlassWater:Vp,LucideGlasses:Hp,LucideGlobe:qp,LucideGlobe2:Tp,LucideGoal:Dp,LucideGrab:Fp,LucideGraduationCap:Rp,LucideGrape:Bp,LucideGrid:at,LucideGrid2X2:bn,LucideGrid2x2:bn,LucideGrid3X3:at,LucideGrid3x3:at,LucideGrip:Op,LucideGripHorizontal:Np,LucideGripVertical:Ep,LucideGroup:Up,LucideGuitar:Zp,LucideHammer:_p,LucideHand:x1,LucideHandMetal:Wp,LucideHardDrive:Xp,LucideHardDriveDownload:Gp,LucideHardDriveUpload:$p,LucideHardHat:Kp,LucideHash:Qp,LucideHaze:Yp,LucideHdmiPort:Jp,LucideHeading:ok,LucideHeading1:ek,LucideHeading2:tk,LucideHeading3:nk,LucideHeading4:ak,LucideHeading5:ik,LucideHeading6:rk,LucideHeadphones:sk,LucideHeart:uk,LucideHeartCrack:ck,LucideHeartHandshake:lk,LucideHeartOff:dk,LucideHeartPulse:hk,LucideHelpCircle:yk,LucideHelpingHand:pk,LucideHexagon:kk,LucideHighlighter:fk,LucideHistory:mk,LucideHome:Qa,LucideHop:vk,LucideHopOff:gk,LucideHotel:xk,LucideHourglass:Mk,LucideIceCream:Lk,LucideIceCream2:wk,LucideImage:Pk,LucideImageDown:Ck,LucideImageMinus:Sk,LucideImageOff:Ik,LucideImagePlus:jk,LucideImport:bk,LucideInbox:Ak,LucideIndent:zk,LucideIndianRupee:Vk,LucideInfinity:Hk,LucideInfo:Tk,LucideInspect:Vn,LucideInspectionPanel:qk,LucideInstagram:Dk,LucideItalic:Fk,LucideIterationCcw:Rk,LucideIterationCw:Bk,LucideJapaneseYen:Nk,LucideJoystick:Ek,LucideKanban:Ok,LucideKanbanSquare:zn,LucideKanbanSquareDashed:An,LucideKey:_k,LucideKeyRound:Uk,LucideKeySquare:Zk,LucideKeyboard:Gk,LucideKeyboardMusic:Wk,LucideLamp:Jk,LucideLampCeiling:$k,LucideLampDesk:Xk,LucideLampFloor:Kk,LucideLampWallDown:Qk,LucideLampWallUp:Yk,LucideLandPlot:e4,LucideLandmark:t4,LucideLanguages:n4,LucideLaptop:i4,LucideLaptop2:a4,LucideLasso:o4,LucideLassoSelect:r4,LucideLaugh:s4,LucideLayers:Ya,LucideLayers2:c4,LucideLayers3:l4,LucideLayout:En,LucideLayoutDashboard:d4,LucideLayoutGrid:h4,LucideLayoutList:u4,LucideLayoutPanelLeft:y4,LucideLayoutPanelTop:p4,LucideLayoutTemplate:k4,LucideLeaf:f4,LucideLeafyGreen:m4,LucideLibrary:x4,LucideLibraryBig:g4,LucideLibrarySquare:v4,LucideLifeBuoy:M4,LucideLigature:w4,LucideLightbulb:M1,LucideLightbulbOff:L4,LucideLineChart:C4,LucideLink:j4,LucideLink2:I4,LucideLink2Off:S4,LucideLinkedin:P4,LucideList:O4,LucideListChecks:b4,LucideListEnd:A4,LucideListFilter:z4,LucideListMinus:V4,LucideListMusic:H4,LucideListOrdered:T4,LucideListPlus:q4,LucideListRestart:D4,LucideListStart:F4,LucideListTodo:R4,LucideListTree:B4,LucideListVideo:N4,LucideListX:E4,LucideLoader:Z4,LucideLoader2:U4,LucideLocate:G4,LucideLocateFixed:_4,LucideLocateOff:W4,LucideLock:X4,LucideLockKeyhole:$4,LucideLogIn:K4,LucideLogOut:Q4,LucideLollipop:Y4,LucideLuggage:J4,LucideMSquare:e5,LucideMagnet:t5,LucideMail:d5,LucideMailCheck:n5,LucideMailMinus:a5,LucideMailOpen:i5,LucideMailPlus:r5,LucideMailQuestion:o5,LucideMailSearch:s5,LucideMailWarning:c5,LucideMailX:l5,LucideMailbox:h5,LucideMails:u5,LucideMap:f5,LucideMapPin:p5,LucideMapPinOff:y5,LucideMapPinned:k5,LucideMartini:m5,LucideMaximize:v5,LucideMaximize2:g5,LucideMedal:x5,LucideMegaphone:w5,LucideMegaphoneOff:M5,LucideMeh:L5,LucideMemoryStick:C5,LucideMenu:Ja,LucideMenuSquare:S5,LucideMerge:I5,LucideMessageCircle:F5,LucideMessageCircleCode:j5,LucideMessageCircleDashed:P5,LucideMessageCircleHeart:b5,LucideMessageCircleMore:A5,LucideMessageCircleOff:z5,LucideMessageCirclePlus:V5,LucideMessageCircleQuestion:H5,LucideMessageCircleReply:T5,LucideMessageCircleWarning:q5,LucideMessageCircleX:D5,LucideMessageSquare:Y5,LucideMessageSquareCode:R5,LucideMessageSquareDashed:B5,LucideMessageSquareDiff:N5,LucideMessageSquareDot:E5,LucideMessageSquareHeart:O5,LucideMessageSquareMore:U5,LucideMessageSquareOff:Z5,LucideMessageSquarePlus:_5,LucideMessageSquareQuote:W5,LucideMessageSquareReply:G5,LucideMessageSquareShare:$5,LucideMessageSquareText:X5,LucideMessageSquareWarning:K5,LucideMessageSquareX:Q5,LucideMessagesSquare:J5,LucideMic:nf,LucideMic2:ef,LucideMicOff:tf,LucideMicroscope:af,LucideMicrowave:rf,LucideMilestone:of,LucideMilk:cf,LucideMilkOff:sf,LucideMinimize:df,LucideMinimize2:lf,LucideMinus:yf,LucideMinusCircle:hf,LucideMinusSquare:uf,LucideMonitor:Sf,LucideMonitorCheck:pf,LucideMonitorDot:kf,LucideMonitorDown:ff,LucideMonitorOff:mf,LucideMonitorPause:gf,LucideMonitorPlay:vf,LucideMonitorSmartphone:xf,LucideMonitorSpeaker:Mf,LucideMonitorStop:wf,LucideMonitorUp:Lf,LucideMonitorX:Cf,LucideMoon:jf,LucideMoonStar:If,LucideMoreHorizontal:Pf,LucideMoreVertical:bf,LucideMountain:zf,LucideMountainSnow:Af,LucideMouse:Df,LucideMousePointer:qf,LucideMousePointer2:Vf,LucideMousePointerClick:Hf,LucideMousePointerSquare:Vn,LucideMousePointerSquareDashed:Tf,LucideMove:Xf,LucideMove3D:Hn,LucideMove3d:Hn,LucideMoveDiagonal:Rf,LucideMoveDiagonal2:Ff,LucideMoveDown:Ef,LucideMoveDownLeft:Bf,LucideMoveDownRight:Nf,LucideMoveHorizontal:Of,LucideMoveLeft:Uf,LucideMoveRight:Zf,LucideMoveUp:Gf,LucideMoveUpLeft:_f,LucideMoveUpRight:Wf,LucideMoveVertical:$f,LucideMusic:Jf,LucideMusic2:Kf,LucideMusic3:Qf,LucideMusic4:Yf,LucideNavigation:a3,LucideNavigation2:t3,LucideNavigation2Off:e3,LucideNavigationOff:n3,LucideNetwork:i3,LucideNewspaper:r3,LucideNfc:o3,LucideNut:c3,LucideNutOff:s3,LucideOctagon:l3,LucideOption:d3,LucideOrbit:h3,LucideOutdent:u3,LucidePackage:x3,LucidePackage2:y3,LucidePackageCheck:p3,LucidePackageMinus:k3,LucidePackageOpen:f3,LucidePackagePlus:m3,LucidePackageSearch:g3,LucidePackageX:v3,LucidePaintBucket:M3,LucidePaintbrush:L3,LucidePaintbrush2:w3,LucidePalette:C3,LucidePalmtree:S3,LucidePanelBottom:P3,LucidePanelBottomClose:I3,LucidePanelBottomDashed:Tn,LucidePanelBottomInactive:Tn,LucidePanelBottomOpen:j3,LucidePanelLeft:Rn,LucidePanelLeftClose:qn,LucidePanelLeftDashed:Dn,LucidePanelLeftInactive:Dn,LucidePanelLeftOpen:Fn,LucidePanelRight:z3,LucidePanelRightClose:b3,LucidePanelRightDashed:Bn,LucidePanelRightInactive:Bn,LucidePanelRightOpen:A3,LucidePanelTop:T3,LucidePanelTopClose:V3,LucidePanelTopDashed:Nn,LucidePanelTopInactive:Nn,LucidePanelTopOpen:H3,LucidePanelsLeftBottom:q3,LucidePanelsLeftRight:Ln,LucidePanelsRightBottom:D3,LucidePanelsTopBottom:Wn,LucidePanelsTopLeft:En,LucidePaperclip:F3,LucideParentheses:R3,LucideParkingCircle:N3,LucideParkingCircleOff:B3,LucideParkingMeter:E3,LucideParkingSquare:U3,LucideParkingSquareOff:O3,LucidePartyPopper:Z3,LucidePause:G3,LucidePauseCircle:_3,LucidePauseOctagon:W3,LucidePawPrint:$3,LucidePcCase:X3,LucidePen:Un,LucidePenBox:it,LucidePenLine:On,LucidePenSquare:it,LucidePenTool:K3,LucidePencil:J3,LucidePencilLine:Q3,LucidePencilRuler:Y3,LucidePentagon:em,LucidePercent:im,LucidePercentCircle:tm,LucidePercentDiamond:nm,LucidePercentSquare:am,LucidePersonStanding:rm,LucidePhone:um,LucidePhoneCall:om,LucidePhoneForwarded:sm,LucidePhoneIncoming:cm,LucidePhoneMissed:lm,LucidePhoneOff:dm,LucidePhoneOutgoing:hm,LucidePi:pm,LucidePiSquare:ym,LucidePiano:km,LucidePictureInPicture:mm,LucidePictureInPicture2:fm,LucidePieChart:gm,LucidePiggyBank:vm,LucidePilcrow:Mm,LucidePilcrowSquare:xm,LucidePill:wm,LucidePin:Cm,LucidePinOff:Lm,LucidePipette:Sm,LucidePizza:Im,LucidePlane:bm,LucidePlaneLanding:jm,LucidePlaneTakeoff:Pm,LucidePlay:zm,LucidePlayCircle:ei,LucidePlaySquare:Am,LucidePlug:qm,LucidePlug2:Vm,LucidePlugZap:Tm,LucidePlugZap2:Hm,LucidePlus:Rm,LucidePlusCircle:Dm,LucidePlusSquare:Fm,LucidePocket:Nm,LucidePocketKnife:Bm,LucidePodcast:Em,LucidePointer:Um,LucidePointerOff:Om,LucidePopcorn:Zm,LucidePopsicle:_m,LucidePoundSterling:Wm,LucidePower:Km,LucidePowerCircle:Gm,LucidePowerOff:$m,LucidePowerSquare:Xm,LucidePresentation:Qm,LucidePrinter:Ym,LucideProjector:Jm,LucidePuzzle:e6,LucidePyramid:t6,LucideQrCode:n6,LucideQuote:a6,LucideRabbit:i6,LucideRadar:r6,LucideRadiation:o6,LucideRadio:l6,LucideRadioReceiver:s6,LucideRadioTower:c6,LucideRadius:d6,LucideRailSymbol:h6,LucideRainbow:u6,LucideRat:y6,LucideRatio:p6,LucideReceipt:k6,LucideRectangleHorizontal:f6,LucideRectangleVertical:m6,LucideRecycle:g6,LucideRedo:M6,LucideRedo2:v6,LucideRedoDot:x6,LucideRefreshCcw:L6,LucideRefreshCcwDot:w6,LucideRefreshCw:S6,LucideRefreshCwOff:C6,LucideRefrigerator:I6,LucideRegex:j6,LucideRemoveFormatting:P6,LucideRepeat:z6,LucideRepeat1:b6,LucideRepeat2:A6,LucideReplace:H6,LucideReplaceAll:V6,LucideReply:q6,LucideReplyAll:T6,LucideRewind:D6,LucideRibbon:F6,LucideRocket:R6,LucideRockingChair:B6,LucideRollerCoaster:N6,LucideRotate3D:Zn,LucideRotate3d:Zn,LucideRotateCcw:E6,LucideRotateCw:O6,LucideRoute:Z6,LucideRouteOff:U6,LucideRouter:_6,LucideRows:_n,LucideRows2:_n,LucideRows3:Wn,LucideRows4:W6,LucideRss:G6,LucideRuler:$6,LucideRussianRuble:X6,LucideSailboat:K6,LucideSalad:Q6,LucideSandwich:Y6,LucideSatellite:e8,LucideSatelliteDish:J6,LucideSave:n8,LucideSaveAll:t8,LucideScale:a8,LucideScale3D:Gn,LucideScale3d:Gn,LucideScaling:i8,LucideScan:h8,LucideScanBarcode:r8,LucideScanEye:o8,LucideScanFace:s8,LucideScanLine:c8,LucideScanSearch:l8,LucideScanText:d8,LucideScatterChart:u8,LucideSchool:p8,LucideSchool2:y8,LucideScissors:g8,LucideScissorsLineDashed:k8,LucideScissorsSquare:m8,LucideScissorsSquareDashedBottom:f8,LucideScreenShare:x8,LucideScreenShareOff:v8,LucideScroll:w8,LucideScrollText:M8,LucideSearch:j8,LucideSearchCheck:L8,LucideSearchCode:C8,LucideSearchSlash:S8,LucideSearchX:I8,LucideSend:b8,LucideSendHorizonal:$n,LucideSendHorizontal:$n,LucideSendToBack:P8,LucideSeparatorHorizontal:A8,LucideSeparatorVertical:z8,LucideServer:q8,LucideServerCog:V8,LucideServerCrash:H8,LucideServerOff:T8,LucideSettings:F8,LucideSettings2:D8,LucideShapes:R8,LucideShare:B8,LucideShare2:ti,LucideSheet:N8,LucideShell:E8,LucideShield:ni,LucideShieldAlert:w1,LucideShieldBan:O8,LucideShieldCheck:U8,LucideShieldClose:Xn,LucideShieldEllipsis:Z8,LucideShieldHalf:_8,LucideShieldMinus:W8,LucideShieldOff:G8,LucideShieldPlus:$8,LucideShieldQuestion:X8,LucideShieldX:Xn,LucideShip:Q8,LucideShipWheel:K8,LucideShirt:Y8,LucideShoppingBag:J8,LucideShoppingBasket:eg,LucideShoppingCart:tg,LucideShovel:ng,LucideShowerHead:ag,LucideShrink:ig,LucideShrub:rg,LucideShuffle:og,LucideSidebar:Rn,LucideSidebarClose:qn,LucideSidebarOpen:Fn,LucideSigma:cg,LucideSigmaSquare:sg,LucideSignal:yg,LucideSignalHigh:lg,LucideSignalLow:dg,LucideSignalMedium:hg,LucideSignalZero:ug,LucideSignpost:kg,LucideSignpostBig:pg,LucideSiren:fg,LucideSkipBack:mg,LucideSkipForward:gg,LucideSkull:vg,LucideSlack:xg,LucideSlash:Mg,LucideSlice:wg,LucideSliders:Cg,LucideSlidersHorizontal:Lg,LucideSmartphone:jg,LucideSmartphoneCharging:Sg,LucideSmartphoneNfc:Ig,LucideSmile:bg,LucideSmilePlus:Pg,LucideSnail:Ag,LucideSnowflake:zg,LucideSofa:Vg,LucideSortAsc:yn,LucideSortDesc:dn,LucideSoup:Hg,LucideSpace:Tg,LucideSpade:qg,LucideSparkle:Dg,LucideSparkles:Kn,LucideSpeaker:Fg,LucideSpeech:Rg,LucideSpellCheck:Ng,LucideSpellCheck2:Bg,LucideSpline:Eg,LucideSplit:Zg,LucideSplitSquareHorizontal:Og,LucideSplitSquareVertical:Ug,LucideSprayCan:_g,LucideSprout:Wg,LucideSquare:t7,LucideSquareAsterisk:Gg,LucideSquareCode:$g,LucideSquareDashedBottom:Kg,LucideSquareDashedBottomCode:Xg,LucideSquareDot:Qg,LucideSquareEqual:Yg,LucideSquareGantt:jn,LucideSquareKanban:zn,LucideSquareKanbanDashed:An,LucideSquareSlash:Jg,LucideSquareStack:e7,LucideSquareUser:Yn,LucideSquareUserRound:Qn,LucideSquircle:n7,LucideSquirrel:a7,LucideStamp:i7,LucideStar:s7,LucideStarHalf:r7,LucideStarOff:o7,LucideStars:Kn,LucideStepBack:c7,LucideStepForward:l7,LucideStethoscope:ai,LucideSticker:d7,LucideStickyNote:h7,LucideStopCircle:u7,LucideStore:y7,LucideStretchHorizontal:p7,LucideStretchVertical:k7,LucideStrikethrough:f7,LucideSubscript:m7,LucideSubtitles:g7,LucideSun:L7,LucideSunDim:v7,LucideSunMedium:x7,LucideSunMoon:M7,LucideSunSnow:w7,LucideSunrise:C7,LucideSunset:S7,LucideSuperscript:I7,LucideSwissFranc:j7,LucideSwitchCamera:P7,LucideSword:b7,LucideSwords:A7,LucideSyringe:ca,LucideTable:H7,LucideTable2:z7,LucideTableProperties:V7,LucideTablet:q7,LucideTabletSmartphone:T7,LucideTablets:D7,LucideTag:F7,LucideTags:R7,LucideTally1:B7,LucideTally2:N7,LucideTally3:E7,LucideTally4:O7,LucideTally5:U7,LucideTangent:Z7,LucideTarget:_7,LucideTent:G7,LucideTentTree:W7,LucideTerminal:X7,LucideTerminalSquare:$7,LucideTestTube:la,LucideTestTube2:K7,LucideTestTubes:Q7,LucideText:tv,LucideTextCursor:J7,LucideTextCursorInput:Y7,LucideTextQuote:ev,LucideTextSelect:Jn,LucideTextSelection:Jn,LucideTheater:nv,LucideThermometer:rv,LucideThermometerSnowflake:av,LucideThermometerSun:iv,LucideThumbsDown:ov,LucideThumbsUp:sv,LucideTicket:cv,LucideTimer:hv,LucideTimerOff:lv,LucideTimerReset:dv,LucideToggleLeft:uv,LucideToggleRight:yv,LucideTornado:pv,LucideTorus:kv,LucideTouchpad:mv,LucideTouchpadOff:fv,LucideTowerControl:gv,LucideToyBrick:vv,LucideTractor:xv,LucideTrafficCone:Mv,LucideTrain:e1,LucideTrainFront:Lv,LucideTrainFrontTunnel:wv,LucideTrainTrack:Cv,LucideTramFront:e1,LucideTrash:Iv,LucideTrash2:Sv,LucideTreeDeciduous:jv,LucideTreePine:Pv,LucideTrees:bv,LucideTrello:Av,LucideTrendingDown:zv,LucideTrendingUp:ii,LucideTriangle:Hv,LucideTriangleRight:Vv,LucideTrophy:Tv,LucideTruck:qv,LucideTurtle:Dv,LucideTv:Rv,LucideTv2:Fv,LucideTwitch:Bv,LucideTwitter:Nv,LucideType:Ev,LucideUmbrella:Uv,LucideUmbrellaOff:Ov,LucideUnderline:Zv,LucideUndo:Gv,LucideUndo2:_v,LucideUndoDot:Wv,LucideUnfoldHorizontal:$v,LucideUnfoldVertical:Xv,LucideUngroup:Kv,LucideUnlink:Yv,LucideUnlink2:Qv,LucideUnlock:ex,LucideUnlockKeyhole:Jv,LucideUnplug:tx,LucideUpload:ax,LucideUploadCloud:nx,LucideUsb:ix,LucideUser:ux,LucideUser2:o1,LucideUserCheck:rx,LucideUserCheck2:t1,LucideUserCircle:Mn,LucideUserCircle2:xn,LucideUserCog:ox,LucideUserCog2:n1,LucideUserMinus:sx,LucideUserMinus2:a1,LucideUserPlus:cx,LucideUserPlus2:i1,LucideUserRound:o1,LucideUserRoundCheck:t1,LucideUserRoundCog:n1,LucideUserRoundMinus:a1,LucideUserRoundPlus:i1,LucideUserRoundSearch:lx,LucideUserRoundX:r1,LucideUserSearch:dx,LucideUserSquare:Yn,LucideUserSquare2:Qn,LucideUserX:hx,LucideUserX2:r1,LucideUsers:yx,LucideUsers2:s1,LucideUsersRound:s1,LucideUtensils:ri,LucideUtensilsCrossed:da,LucideUtilityPole:px,LucideVariable:kx,LucideVegan:fx,LucideVenetianMask:mx,LucideVerified:fn,LucideVibrate:vx,LucideVibrateOff:gx,LucideVideo:Mx,LucideVideoOff:xx,LucideVideotape:wx,LucideView:Lx,LucideVoicemail:Cx,LucideVolume:Px,LucideVolume1:Sx,LucideVolume2:Ix,LucideVolumeX:jx,LucideVote:bx,LucideWallet:Vx,LucideWallet2:Ax,LucideWalletCards:zx,LucideWallpaper:Hx,LucideWand:qx,LucideWand2:Tx,LucideWarehouse:Dx,LucideWatch:Fx,LucideWaves:Rx,LucideWaypoints:Bx,LucideWebcam:Nx,LucideWebhook:Ex,LucideWeight:Ox,LucideWheat:Zx,LucideWheatOff:Ux,LucideWholeWord:_x,LucideWifi:Gx,LucideWifiOff:Wx,LucideWind:$x,LucideWine:Kx,LucideWineOff:Xx,LucideWorkflow:Qx,LucideWrapText:Yx,LucideWrench:Jx,LucideX:lt,LucideXCircle:eM,LucideXOctagon:tM,LucideXSquare:nM,LucideYoutube:aM,LucideZap:rM,LucideZapOff:iM,LucideZoomIn:oM,LucideZoomOut:sM,Luggage:J4,LuggageIcon:J4,MSquare:e5,MSquareIcon:e5,Magnet:t5,MagnetIcon:t5,Mail:d5,MailCheck:n5,MailCheckIcon:n5,MailIcon:d5,MailMinus:a5,MailMinusIcon:a5,MailOpen:i5,MailOpenIcon:i5,MailPlus:r5,MailPlusIcon:r5,MailQuestion:o5,MailQuestionIcon:o5,MailSearch:s5,MailSearchIcon:s5,MailWarning:c5,MailWarningIcon:c5,MailX:l5,MailXIcon:l5,Mailbox:h5,MailboxIcon:h5,Mails:u5,MailsIcon:u5,Map:f5,MapIcon:f5,MapPin:p5,MapPinIcon:p5,MapPinOff:y5,MapPinOffIcon:y5,MapPinned:k5,MapPinnedIcon:k5,Martini:m5,MartiniIcon:m5,Maximize:v5,Maximize2:g5,Maximize2Icon:g5,MaximizeIcon:v5,Medal:x5,MedalIcon:x5,Megaphone:w5,MegaphoneIcon:w5,MegaphoneOff:M5,MegaphoneOffIcon:M5,Meh:L5,MehIcon:L5,MemoryStick:C5,MemoryStickIcon:C5,Menu:Ja,MenuIcon:Ja,MenuSquare:S5,MenuSquareIcon:S5,Merge:I5,MergeIcon:I5,MessageCircle:F5,MessageCircleCode:j5,MessageCircleCodeIcon:j5,MessageCircleDashed:P5,MessageCircleDashedIcon:P5,MessageCircleHeart:b5,MessageCircleHeartIcon:b5,MessageCircleIcon:F5,MessageCircleMore:A5,MessageCircleMoreIcon:A5,MessageCircleOff:z5,MessageCircleOffIcon:z5,MessageCirclePlus:V5,MessageCirclePlusIcon:V5,MessageCircleQuestion:H5,MessageCircleQuestionIcon:H5,MessageCircleReply:T5,MessageCircleReplyIcon:T5,MessageCircleWarning:q5,MessageCircleWarningIcon:q5,MessageCircleX:D5,MessageCircleXIcon:D5,MessageSquare:Y5,MessageSquareCode:R5,MessageSquareCodeIcon:R5,MessageSquareDashed:B5,MessageSquareDashedIcon:B5,MessageSquareDiff:N5,MessageSquareDiffIcon:N5,MessageSquareDot:E5,MessageSquareDotIcon:E5,MessageSquareHeart:O5,MessageSquareHeartIcon:O5,MessageSquareIcon:Y5,MessageSquareMore:U5,MessageSquareMoreIcon:U5,MessageSquareOff:Z5,MessageSquareOffIcon:Z5,MessageSquarePlus:_5,MessageSquarePlusIcon:_5,MessageSquareQuote:W5,MessageSquareQuoteIcon:W5,MessageSquareReply:G5,MessageSquareReplyIcon:G5,MessageSquareShare:$5,MessageSquareShareIcon:$5,MessageSquareText:X5,MessageSquareTextIcon:X5,MessageSquareWarning:K5,MessageSquareWarningIcon:K5,MessageSquareX:Q5,MessageSquareXIcon:Q5,MessagesSquare:J5,MessagesSquareIcon:J5,Mic:nf,Mic2:ef,Mic2Icon:ef,MicIcon:nf,MicOff:tf,MicOffIcon:tf,Microscope:af,MicroscopeIcon:af,Microwave:rf,MicrowaveIcon:rf,Milestone:of,MilestoneIcon:of,Milk:cf,MilkIcon:cf,MilkOff:sf,MilkOffIcon:sf,Minimize:df,Minimize2:lf,Minimize2Icon:lf,MinimizeIcon:df,Minus:yf,MinusCircle:hf,MinusCircleIcon:hf,MinusIcon:yf,MinusSquare:uf,MinusSquareIcon:uf,Monitor:Sf,MonitorCheck:pf,MonitorCheckIcon:pf,MonitorDot:kf,MonitorDotIcon:kf,MonitorDown:ff,MonitorDownIcon:ff,MonitorIcon:Sf,MonitorOff:mf,MonitorOffIcon:mf,MonitorPause:gf,MonitorPauseIcon:gf,MonitorPlay:vf,MonitorPlayIcon:vf,MonitorSmartphone:xf,MonitorSmartphoneIcon:xf,MonitorSpeaker:Mf,MonitorSpeakerIcon:Mf,MonitorStop:wf,MonitorStopIcon:wf,MonitorUp:Lf,MonitorUpIcon:Lf,MonitorX:Cf,MonitorXIcon:Cf,Moon:jf,MoonIcon:jf,MoonStar:If,MoonStarIcon:If,MoreHorizontal:Pf,MoreHorizontalIcon:Pf,MoreVertical:bf,MoreVerticalIcon:bf,Mountain:zf,MountainIcon:zf,MountainSnow:Af,MountainSnowIcon:Af,Mouse:Df,MouseIcon:Df,MousePointer:qf,MousePointer2:Vf,MousePointer2Icon:Vf,MousePointerClick:Hf,MousePointerClickIcon:Hf,MousePointerIcon:qf,MousePointerSquare:Vn,MousePointerSquareDashed:Tf,MousePointerSquareDashedIcon:Tf,MousePointerSquareIcon:Vn,Move:Xf,Move3D:Hn,Move3DIcon:Hn,Move3d:Hn,Move3dIcon:Hn,MoveDiagonal:Rf,MoveDiagonal2:Ff,MoveDiagonal2Icon:Ff,MoveDiagonalIcon:Rf,MoveDown:Ef,MoveDownIcon:Ef,MoveDownLeft:Bf,MoveDownLeftIcon:Bf,MoveDownRight:Nf,MoveDownRightIcon:Nf,MoveHorizontal:Of,MoveHorizontalIcon:Of,MoveIcon:Xf,MoveLeft:Uf,MoveLeftIcon:Uf,MoveRight:Zf,MoveRightIcon:Zf,MoveUp:Gf,MoveUpIcon:Gf,MoveUpLeft:_f,MoveUpLeftIcon:_f,MoveUpRight:Wf,MoveUpRightIcon:Wf,MoveVertical:$f,MoveVerticalIcon:$f,Music:Jf,Music2:Kf,Music2Icon:Kf,Music3:Qf,Music3Icon:Qf,Music4:Yf,Music4Icon:Yf,MusicIcon:Jf,Navigation:a3,Navigation2:t3,Navigation2Icon:t3,Navigation2Off:e3,Navigation2OffIcon:e3,NavigationIcon:a3,NavigationOff:n3,NavigationOffIcon:n3,Network:i3,NetworkIcon:i3,Newspaper:r3,NewspaperIcon:r3,Nfc:o3,NfcIcon:o3,Nut:c3,NutIcon:c3,NutOff:s3,NutOffIcon:s3,Octagon:l3,OctagonIcon:l3,Option:d3,OptionIcon:d3,Orbit:h3,OrbitIcon:h3,Outdent:u3,OutdentIcon:u3,Package:x3,Package2:y3,Package2Icon:y3,PackageCheck:p3,PackageCheckIcon:p3,PackageIcon:x3,PackageMinus:k3,PackageMinusIcon:k3,PackageOpen:f3,PackageOpenIcon:f3,PackagePlus:m3,PackagePlusIcon:m3,PackageSearch:g3,PackageSearchIcon:g3,PackageX:v3,PackageXIcon:v3,PaintBucket:M3,PaintBucketIcon:M3,Paintbrush:L3,Paintbrush2:w3,Paintbrush2Icon:w3,PaintbrushIcon:L3,Palette:C3,PaletteIcon:C3,Palmtree:S3,PalmtreeIcon:S3,PanelBottom:P3,PanelBottomClose:I3,PanelBottomCloseIcon:I3,PanelBottomDashed:Tn,PanelBottomDashedIcon:Tn,PanelBottomIcon:P3,PanelBottomInactive:Tn,PanelBottomInactiveIcon:Tn,PanelBottomOpen:j3,PanelBottomOpenIcon:j3,PanelLeft:Rn,PanelLeftClose:qn,PanelLeftCloseIcon:qn,PanelLeftDashed:Dn,PanelLeftDashedIcon:Dn,PanelLeftIcon:Rn,PanelLeftInactive:Dn,PanelLeftInactiveIcon:Dn,PanelLeftOpen:Fn,PanelLeftOpenIcon:Fn,PanelRight:z3,PanelRightClose:b3,PanelRightCloseIcon:b3,PanelRightDashed:Bn,PanelRightDashedIcon:Bn,PanelRightIcon:z3,PanelRightInactive:Bn,PanelRightInactiveIcon:Bn,PanelRightOpen:A3,PanelRightOpenIcon:A3,PanelTop:T3,PanelTopClose:V3,PanelTopCloseIcon:V3,PanelTopDashed:Nn,PanelTopDashedIcon:Nn,PanelTopIcon:T3,PanelTopInactive:Nn,PanelTopInactiveIcon:Nn,PanelTopOpen:H3,PanelTopOpenIcon:H3,PanelsLeftBottom:q3,PanelsLeftBottomIcon:q3,PanelsLeftRight:Ln,PanelsLeftRightIcon:Ln,PanelsRightBottom:D3,PanelsRightBottomIcon:D3,PanelsTopBottom:Wn,PanelsTopBottomIcon:Wn,PanelsTopLeft:En,PanelsTopLeftIcon:En,Paperclip:F3,PaperclipIcon:F3,Parentheses:R3,ParenthesesIcon:R3,ParkingCircle:N3,ParkingCircleIcon:N3,ParkingCircleOff:B3,ParkingCircleOffIcon:B3,ParkingMeter:E3,ParkingMeterIcon:E3,ParkingSquare:U3,ParkingSquareIcon:U3,ParkingSquareOff:O3,ParkingSquareOffIcon:O3,PartyPopper:Z3,PartyPopperIcon:Z3,Pause:G3,PauseCircle:_3,PauseCircleIcon:_3,PauseIcon:G3,PauseOctagon:W3,PauseOctagonIcon:W3,PawPrint:$3,PawPrintIcon:$3,PcCase:X3,PcCaseIcon:X3,Pen:Un,PenBox:it,PenBoxIcon:it,PenIcon:Un,PenLine:On,PenLineIcon:On,PenSquare:it,PenSquareIcon:it,PenTool:K3,PenToolIcon:K3,Pencil:J3,PencilIcon:J3,PencilLine:Q3,PencilLineIcon:Q3,PencilRuler:Y3,PencilRulerIcon:Y3,Pentagon:em,PentagonIcon:em,Percent:im,PercentCircle:tm,PercentCircleIcon:tm,PercentDiamond:nm,PercentDiamondIcon:nm,PercentIcon:im,PercentSquare:am,PercentSquareIcon:am,PersonStanding:rm,PersonStandingIcon:rm,Phone:um,PhoneCall:om,PhoneCallIcon:om,PhoneForwarded:sm,PhoneForwardedIcon:sm,PhoneIcon:um,PhoneIncoming:cm,PhoneIncomingIcon:cm,PhoneMissed:lm,PhoneMissedIcon:lm,PhoneOff:dm,PhoneOffIcon:dm,PhoneOutgoing:hm,PhoneOutgoingIcon:hm,Pi:pm,PiIcon:pm,PiSquare:ym,PiSquareIcon:ym,Piano:km,PianoIcon:km,PictureInPicture:mm,PictureInPicture2:fm,PictureInPicture2Icon:fm,PictureInPictureIcon:mm,PieChart:gm,PieChartIcon:gm,PiggyBank:vm,PiggyBankIcon:vm,Pilcrow:Mm,PilcrowIcon:Mm,PilcrowSquare:xm,PilcrowSquareIcon:xm,Pill:wm,PillIcon:wm,Pin:Cm,PinIcon:Cm,PinOff:Lm,PinOffIcon:Lm,Pipette:Sm,PipetteIcon:Sm,Pizza:Im,PizzaIcon:Im,Plane:bm,PlaneIcon:bm,PlaneLanding:jm,PlaneLandingIcon:jm,PlaneTakeoff:Pm,PlaneTakeoffIcon:Pm,Play:zm,PlayCircle:ei,PlayCircleIcon:ei,PlayIcon:zm,PlaySquare:Am,PlaySquareIcon:Am,Plug:qm,Plug2:Vm,Plug2Icon:Vm,PlugIcon:qm,PlugZap:Tm,PlugZap2:Hm,PlugZap2Icon:Hm,PlugZapIcon:Tm,Plus:Rm,PlusCircle:Dm,PlusCircleIcon:Dm,PlusIcon:Rm,PlusSquare:Fm,PlusSquareIcon:Fm,Pocket:Nm,PocketIcon:Nm,PocketKnife:Bm,PocketKnifeIcon:Bm,Podcast:Em,PodcastIcon:Em,Pointer:Um,PointerIcon:Um,PointerOff:Om,PointerOffIcon:Om,Popcorn:Zm,PopcornIcon:Zm,Popsicle:_m,PopsicleIcon:_m,PoundSterling:Wm,PoundSterlingIcon:Wm,Power:Km,PowerCircle:Gm,PowerCircleIcon:Gm,PowerIcon:Km,PowerOff:$m,PowerOffIcon:$m,PowerSquare:Xm,PowerSquareIcon:Xm,Presentation:Qm,PresentationIcon:Qm,Printer:Ym,PrinterIcon:Ym,Projector:Jm,ProjectorIcon:Jm,Puzzle:e6,PuzzleIcon:e6,Pyramid:t6,PyramidIcon:t6,QrCode:n6,QrCodeIcon:n6,Quote:a6,QuoteIcon:a6,Rabbit:i6,RabbitIcon:i6,Radar:r6,RadarIcon:r6,Radiation:o6,RadiationIcon:o6,Radio:l6,RadioIcon:l6,RadioReceiver:s6,RadioReceiverIcon:s6,RadioTower:c6,RadioTowerIcon:c6,Radius:d6,RadiusIcon:d6,RailSymbol:h6,RailSymbolIcon:h6,Rainbow:u6,RainbowIcon:u6,Rat:y6,RatIcon:y6,Ratio:p6,RatioIcon:p6,Receipt:k6,ReceiptIcon:k6,RectangleHorizontal:f6,RectangleHorizontalIcon:f6,RectangleVertical:m6,RectangleVerticalIcon:m6,Recycle:g6,RecycleIcon:g6,Redo:M6,Redo2:v6,Redo2Icon:v6,RedoDot:x6,RedoDotIcon:x6,RedoIcon:M6,RefreshCcw:L6,RefreshCcwDot:w6,RefreshCcwDotIcon:w6,RefreshCcwIcon:L6,RefreshCw:S6,RefreshCwIcon:S6,RefreshCwOff:C6,RefreshCwOffIcon:C6,Refrigerator:I6,RefrigeratorIcon:I6,Regex:j6,RegexIcon:j6,RemoveFormatting:P6,RemoveFormattingIcon:P6,Repeat:z6,Repeat1:b6,Repeat1Icon:b6,Repeat2:A6,Repeat2Icon:A6,RepeatIcon:z6,Replace:H6,ReplaceAll:V6,ReplaceAllIcon:V6,ReplaceIcon:H6,Reply:q6,ReplyAll:T6,ReplyAllIcon:T6,ReplyIcon:q6,Rewind:D6,RewindIcon:D6,Ribbon:F6,RibbonIcon:F6,Rocket:R6,RocketIcon:R6,RockingChair:B6,RockingChairIcon:B6,RollerCoaster:N6,RollerCoasterIcon:N6,Rotate3D:Zn,Rotate3DIcon:Zn,Rotate3d:Zn,Rotate3dIcon:Zn,RotateCcw:E6,RotateCcwIcon:E6,RotateCw:O6,RotateCwIcon:O6,Route:Z6,RouteIcon:Z6,RouteOff:U6,RouteOffIcon:U6,Router:_6,RouterIcon:_6,Rows:_n,Rows2:_n,Rows2Icon:_n,Rows3:Wn,Rows3Icon:Wn,Rows4:W6,Rows4Icon:W6,RowsIcon:_n,Rss:G6,RssIcon:G6,Ruler:$6,RulerIcon:$6,RussianRuble:X6,RussianRubleIcon:X6,Sailboat:K6,SailboatIcon:K6,Salad:Q6,SaladIcon:Q6,Sandwich:Y6,SandwichIcon:Y6,Satellite:e8,SatelliteDish:J6,SatelliteDishIcon:J6,SatelliteIcon:e8,Save:n8,SaveAll:t8,SaveAllIcon:t8,SaveIcon:n8,Scale:a8,Scale3D:Gn,Scale3DIcon:Gn,Scale3d:Gn,Scale3dIcon:Gn,ScaleIcon:a8,Scaling:i8,ScalingIcon:i8,Scan:h8,ScanBarcode:r8,ScanBarcodeIcon:r8,ScanEye:o8,ScanEyeIcon:o8,ScanFace:s8,ScanFaceIcon:s8,ScanIcon:h8,ScanLine:c8,ScanLineIcon:c8,ScanSearch:l8,ScanSearchIcon:l8,ScanText:d8,ScanTextIcon:d8,ScatterChart:u8,ScatterChartIcon:u8,School:p8,School2:y8,School2Icon:y8,SchoolIcon:p8,Scissors:g8,ScissorsIcon:g8,ScissorsLineDashed:k8,ScissorsLineDashedIcon:k8,ScissorsSquare:m8,ScissorsSquareDashedBottom:f8,ScissorsSquareDashedBottomIcon:f8,ScissorsSquareIcon:m8,ScreenShare:x8,ScreenShareIcon:x8,ScreenShareOff:v8,ScreenShareOffIcon:v8,Scroll:w8,ScrollIcon:w8,ScrollText:M8,ScrollTextIcon:M8,Search:j8,SearchCheck:L8,SearchCheckIcon:L8,SearchCode:C8,SearchCodeIcon:C8,SearchIcon:j8,SearchSlash:S8,SearchSlashIcon:S8,SearchX:I8,SearchXIcon:I8,Send:b8,SendHorizonal:$n,SendHorizonalIcon:$n,SendHorizontal:$n,SendHorizontalIcon:$n,SendIcon:b8,SendToBack:P8,SendToBackIcon:P8,SeparatorHorizontal:A8,SeparatorHorizontalIcon:A8,SeparatorVertical:z8,SeparatorVerticalIcon:z8,Server:q8,ServerCog:V8,ServerCogIcon:V8,ServerCrash:H8,ServerCrashIcon:H8,ServerIcon:q8,ServerOff:T8,ServerOffIcon:T8,Settings:F8,Settings2:D8,Settings2Icon:D8,SettingsIcon:F8,Shapes:R8,ShapesIcon:R8,Share:B8,Share2:ti,Share2Icon:ti,ShareIcon:B8,Sheet:N8,SheetIcon:N8,Shell:E8,ShellIcon:E8,Shield:ni,ShieldAlert:w1,ShieldAlertIcon:w1,ShieldBan:O8,ShieldBanIcon:O8,ShieldCheck:U8,ShieldCheckIcon:U8,ShieldClose:Xn,ShieldCloseIcon:Xn,ShieldEllipsis:Z8,ShieldEllipsisIcon:Z8,ShieldHalf:_8,ShieldHalfIcon:_8,ShieldIcon:ni,ShieldMinus:W8,ShieldMinusIcon:W8,ShieldOff:G8,ShieldOffIcon:G8,ShieldPlus:$8,ShieldPlusIcon:$8,ShieldQuestion:X8,ShieldQuestionIcon:X8,ShieldX:Xn,ShieldXIcon:Xn,Ship:Q8,ShipIcon:Q8,ShipWheel:K8,ShipWheelIcon:K8,Shirt:Y8,ShirtIcon:Y8,ShoppingBag:J8,ShoppingBagIcon:J8,ShoppingBasket:eg,ShoppingBasketIcon:eg,ShoppingCart:tg,ShoppingCartIcon:tg,Shovel:ng,ShovelIcon:ng,ShowerHead:ag,ShowerHeadIcon:ag,Shrink:ig,ShrinkIcon:ig,Shrub:rg,ShrubIcon:rg,Shuffle:og,ShuffleIcon:og,Sidebar:Rn,SidebarClose:qn,SidebarCloseIcon:qn,SidebarIcon:Rn,SidebarOpen:Fn,SidebarOpenIcon:Fn,Sigma:cg,SigmaIcon:cg,SigmaSquare:sg,SigmaSquareIcon:sg,Signal:yg,SignalHigh:lg,SignalHighIcon:lg,SignalIcon:yg,SignalLow:dg,SignalLowIcon:dg,SignalMedium:hg,SignalMediumIcon:hg,SignalZero:ug,SignalZeroIcon:ug,Signpost:kg,SignpostBig:pg,SignpostBigIcon:pg,SignpostIcon:kg,Siren:fg,SirenIcon:fg,SkipBack:mg,SkipBackIcon:mg,SkipForward:gg,SkipForwardIcon:gg,Skull:vg,SkullIcon:vg,Slack:xg,SlackIcon:xg,Slash:Mg,SlashIcon:Mg,Slice:wg,SliceIcon:wg,Sliders:Cg,SlidersHorizontal:Lg,SlidersHorizontalIcon:Lg,SlidersIcon:Cg,Smartphone:jg,SmartphoneCharging:Sg,SmartphoneChargingIcon:Sg,SmartphoneIcon:jg,SmartphoneNfc:Ig,SmartphoneNfcIcon:Ig,Smile:bg,SmileIcon:bg,SmilePlus:Pg,SmilePlusIcon:Pg,Snail:Ag,SnailIcon:Ag,Snowflake:zg,SnowflakeIcon:zg,Sofa:Vg,SofaIcon:Vg,SortAsc:yn,SortAscIcon:yn,SortDesc:dn,SortDescIcon:dn,Soup:Hg,SoupIcon:Hg,Space:Tg,SpaceIcon:Tg,Spade:qg,SpadeIcon:qg,Sparkle:Dg,SparkleIcon:Dg,Sparkles:Kn,SparklesIcon:Kn,Speaker:Fg,SpeakerIcon:Fg,Speech:Rg,SpeechIcon:Rg,SpellCheck:Ng,SpellCheck2:Bg,SpellCheck2Icon:Bg,SpellCheckIcon:Ng,Spline:Eg,SplineIcon:Eg,Split:Zg,SplitIcon:Zg,SplitSquareHorizontal:Og,SplitSquareHorizontalIcon:Og,SplitSquareVertical:Ug,SplitSquareVerticalIcon:Ug,SprayCan:_g,SprayCanIcon:_g,Sprout:Wg,SproutIcon:Wg,Square:t7,SquareAsterisk:Gg,SquareAsteriskIcon:Gg,SquareCode:$g,SquareCodeIcon:$g,SquareDashedBottom:Kg,SquareDashedBottomCode:Xg,SquareDashedBottomCodeIcon:Xg,SquareDashedBottomIcon:Kg,SquareDot:Qg,SquareDotIcon:Qg,SquareEqual:Yg,SquareEqualIcon:Yg,SquareGantt:jn,SquareGanttIcon:jn,SquareIcon:t7,SquareKanban:zn,SquareKanbanDashed:An,SquareKanbanDashedIcon:An,SquareKanbanIcon:zn,SquareSlash:Jg,SquareSlashIcon:Jg,SquareStack:e7,SquareStackIcon:e7,SquareUser:Yn,SquareUserIcon:Yn,SquareUserRound:Qn,SquareUserRoundIcon:Qn,Squircle:n7,SquircleIcon:n7,Squirrel:a7,SquirrelIcon:a7,Stamp:i7,StampIcon:i7,Star:s7,StarHalf:r7,StarHalfIcon:r7,StarIcon:s7,StarOff:o7,StarOffIcon:o7,Stars:Kn,StarsIcon:Kn,StepBack:c7,StepBackIcon:c7,StepForward:l7,StepForwardIcon:l7,Stethoscope:ai,StethoscopeIcon:ai,Sticker:d7,StickerIcon:d7,StickyNote:h7,StickyNoteIcon:h7,StopCircle:u7,StopCircleIcon:u7,Store:y7,StoreIcon:y7,StretchHorizontal:p7,StretchHorizontalIcon:p7,StretchVertical:k7,StretchVerticalIcon:k7,Strikethrough:f7,StrikethroughIcon:f7,Subscript:m7,SubscriptIcon:m7,Subtitles:g7,SubtitlesIcon:g7,Sun:L7,SunDim:v7,SunDimIcon:v7,SunIcon:L7,SunMedium:x7,SunMediumIcon:x7,SunMoon:M7,SunMoonIcon:M7,SunSnow:w7,SunSnowIcon:w7,Sunrise:C7,SunriseIcon:C7,Sunset:S7,SunsetIcon:S7,Superscript:I7,SuperscriptIcon:I7,SwissFranc:j7,SwissFrancIcon:j7,SwitchCamera:P7,SwitchCameraIcon:P7,Sword:b7,SwordIcon:b7,Swords:A7,SwordsIcon:A7,Syringe:ca,SyringeIcon:ca,Table:H7,Table2:z7,Table2Icon:z7,TableIcon:H7,TableProperties:V7,TablePropertiesIcon:V7,Tablet:q7,TabletIcon:q7,TabletSmartphone:T7,TabletSmartphoneIcon:T7,Tablets:D7,TabletsIcon:D7,Tag:F7,TagIcon:F7,Tags:R7,TagsIcon:R7,Tally1:B7,Tally1Icon:B7,Tally2:N7,Tally2Icon:N7,Tally3:E7,Tally3Icon:E7,Tally4:O7,Tally4Icon:O7,Tally5:U7,Tally5Icon:U7,Tangent:Z7,TangentIcon:Z7,Target:_7,TargetIcon:_7,Tent:G7,TentIcon:G7,TentTree:W7,TentTreeIcon:W7,Terminal:X7,TerminalIcon:X7,TerminalSquare:$7,TerminalSquareIcon:$7,TestTube:la,TestTube2:K7,TestTube2Icon:K7,TestTubeIcon:la,TestTubes:Q7,TestTubesIcon:Q7,Text:tv,TextCursor:J7,TextCursorIcon:J7,TextCursorInput:Y7,TextCursorInputIcon:Y7,TextIcon:tv,TextQuote:ev,TextQuoteIcon:ev,TextSelect:Jn,TextSelectIcon:Jn,TextSelection:Jn,TextSelectionIcon:Jn,Theater:nv,TheaterIcon:nv,Thermometer:rv,ThermometerIcon:rv,ThermometerSnowflake:av,ThermometerSnowflakeIcon:av,ThermometerSun:iv,ThermometerSunIcon:iv,ThumbsDown:ov,ThumbsDownIcon:ov,ThumbsUp:sv,ThumbsUpIcon:sv,Ticket:cv,TicketIcon:cv,Timer:hv,TimerIcon:hv,TimerOff:lv,TimerOffIcon:lv,TimerReset:dv,TimerResetIcon:dv,ToggleLeft:uv,ToggleLeftIcon:uv,ToggleRight:yv,ToggleRightIcon:yv,Tornado:pv,TornadoIcon:pv,Torus:kv,TorusIcon:kv,Touchpad:mv,TouchpadIcon:mv,TouchpadOff:fv,TouchpadOffIcon:fv,TowerControl:gv,TowerControlIcon:gv,ToyBrick:vv,ToyBrickIcon:vv,Tractor:xv,TractorIcon:xv,TrafficCone:Mv,TrafficConeIcon:Mv,Train:e1,TrainFront:Lv,TrainFrontIcon:Lv,TrainFrontTunnel:wv,TrainFrontTunnelIcon:wv,TrainIcon:e1,TrainTrack:Cv,TrainTrackIcon:Cv,TramFront:e1,TramFrontIcon:e1,Trash:Iv,Trash2:Sv,Trash2Icon:Sv,TrashIcon:Iv,TreeDeciduous:jv,TreeDeciduousIcon:jv,TreePine:Pv,TreePineIcon:Pv,Trees:bv,TreesIcon:bv,Trello:Av,TrelloIcon:Av,TrendingDown:zv,TrendingDownIcon:zv,TrendingUp:ii,TrendingUpIcon:ii,Triangle:Hv,TriangleIcon:Hv,TriangleRight:Vv,TriangleRightIcon:Vv,Trophy:Tv,TrophyIcon:Tv,Truck:qv,TruckIcon:qv,Turtle:Dv,TurtleIcon:Dv,Tv:Rv,Tv2:Fv,Tv2Icon:Fv,TvIcon:Rv,Twitch:Bv,TwitchIcon:Bv,Twitter:Nv,TwitterIcon:Nv,Type:Ev,TypeIcon:Ev,Umbrella:Uv,UmbrellaIcon:Uv,UmbrellaOff:Ov,UmbrellaOffIcon:Ov,Underline:Zv,UnderlineIcon:Zv,Undo:Gv,Undo2:_v,Undo2Icon:_v,UndoDot:Wv,UndoDotIcon:Wv,UndoIcon:Gv,UnfoldHorizontal:$v,UnfoldHorizontalIcon:$v,UnfoldVertical:Xv,UnfoldVerticalIcon:Xv,Ungroup:Kv,UngroupIcon:Kv,Unlink:Yv,Unlink2:Qv,Unlink2Icon:Qv,UnlinkIcon:Yv,Unlock:ex,UnlockIcon:ex,UnlockKeyhole:Jv,UnlockKeyholeIcon:Jv,Unplug:tx,UnplugIcon:tx,Upload:ax,UploadCloud:nx,UploadCloudIcon:nx,UploadIcon:ax,Usb:ix,UsbIcon:ix,User:ux,User2:o1,User2Icon:o1,UserCheck:rx,UserCheck2:t1,UserCheck2Icon:t1,UserCheckIcon:rx,UserCircle:Mn,UserCircle2:xn,UserCircle2Icon:xn,UserCircleIcon:Mn,UserCog:ox,UserCog2:n1,UserCog2Icon:n1,UserCogIcon:ox,UserIcon:ux,UserMinus:sx,UserMinus2:a1,UserMinus2Icon:a1,UserMinusIcon:sx,UserPlus:cx,UserPlus2:i1,UserPlus2Icon:i1,UserPlusIcon:cx,UserRound:o1,UserRoundCheck:t1,UserRoundCheckIcon:t1,UserRoundCog:n1,UserRoundCogIcon:n1,UserRoundIcon:o1,UserRoundMinus:a1,UserRoundMinusIcon:a1,UserRoundPlus:i1,UserRoundPlusIcon:i1,UserRoundSearch:lx,UserRoundSearchIcon:lx,UserRoundX:r1,UserRoundXIcon:r1,UserSearch:dx,UserSearchIcon:dx,UserSquare:Yn,UserSquare2:Qn,UserSquare2Icon:Qn,UserSquareIcon:Yn,UserX:hx,UserX2:r1,UserX2Icon:r1,UserXIcon:hx,Users:yx,Users2:s1,Users2Icon:s1,UsersIcon:yx,UsersRound:s1,UsersRoundIcon:s1,Utensils:ri,UtensilsCrossed:da,UtensilsCrossedIcon:da,UtensilsIcon:ri,UtilityPole:px,UtilityPoleIcon:px,Variable:kx,VariableIcon:kx,Vegan:fx,VeganIcon:fx,VenetianMask:mx,VenetianMaskIcon:mx,Verified:fn,VerifiedIcon:fn,Vibrate:vx,VibrateIcon:vx,VibrateOff:gx,VibrateOffIcon:gx,Video:Mx,VideoIcon:Mx,VideoOff:xx,VideoOffIcon:xx,Videotape:wx,VideotapeIcon:wx,View:Lx,ViewIcon:Lx,Voicemail:Cx,VoicemailIcon:Cx,Volume:Px,Volume1:Sx,Volume1Icon:Sx,Volume2:Ix,Volume2Icon:Ix,VolumeIcon:Px,VolumeX:jx,VolumeXIcon:jx,Vote:bx,VoteIcon:bx,Wallet:Vx,Wallet2:Ax,Wallet2Icon:Ax,WalletCards:zx,WalletCardsIcon:zx,WalletIcon:Vx,Wallpaper:Hx,WallpaperIcon:Hx,Wand:qx,Wand2:Tx,Wand2Icon:Tx,WandIcon:qx,Warehouse:Dx,WarehouseIcon:Dx,Watch:Fx,WatchIcon:Fx,Waves:Rx,WavesIcon:Rx,Waypoints:Bx,WaypointsIcon:Bx,Webcam:Nx,WebcamIcon:Nx,Webhook:Ex,WebhookIcon:Ex,Weight:Ox,WeightIcon:Ox,Wheat:Zx,WheatIcon:Zx,WheatOff:Ux,WheatOffIcon:Ux,WholeWord:_x,WholeWordIcon:_x,Wifi:Gx,WifiIcon:Gx,WifiOff:Wx,WifiOffIcon:Wx,Wind:$x,WindIcon:$x,Wine:Kx,WineIcon:Kx,WineOff:Xx,WineOffIcon:Xx,Workflow:Qx,WorkflowIcon:Qx,WrapText:Yx,WrapTextIcon:Yx,Wrench:Jx,WrenchIcon:Jx,X:lt,XCircle:eM,XCircleIcon:eM,XIcon:lt,XOctagon:tM,XOctagonIcon:tM,XSquare:nM,XSquareIcon:nM,Youtube:aM,YoutubeIcon:aM,Zap:rM,ZapIcon:rM,ZapOff:iM,ZapOffIcon:iM,ZoomIn:oM,ZoomInIcon:oM,ZoomOut:sM,ZoomOutIcon:sM,createLucideIcon:i,icons:$V},Symbol.toStringTag,{value:"Module"}));function XV(e,t){const[n,a]=L.useState(()=>{try{const o=window.localStorage.getItem(e);return o?JSON.parse(o):t}catch(o){return console.error(o),t}});return[n,o=>{try{const s=o instanceof Function?o(n):o;a(s),window.localStorage.setItem(e,JSON.stringify(s))}catch(s){console.error(s)}}]}const KP=L.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"}),i9=L.createContext({}),r9=L.createContext(null),o9=typeof document<"u",eC=o9?L.useLayoutEffect:L.useEffect,QP=L.createContext({strict:!1}),tC=e=>e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),KV="framerAppearId",YP="data-"+tC(KV);function QV(e,t,n,a){const{visualElement:r}=L.useContext(i9),o=L.useContext(QP),s=L.useContext(r9),c=L.useContext(KP).reducedMotion,l=L.useRef();a=a||o.renderer,!l.current&&a&&(l.current=a(e,{visualState:t,parent:r,props:n,presenceContext:s,blockInitialAnimation:s?s.initial===!1:!1,reducedMotionConfig:c}));const d=l.current;L.useInsertionEffect(()=>{d&&d.update(n,s)});const u=L.useRef(!!(n[YP]&&!window.HandoffComplete));return eC(()=>{d&&(d.render(),u.current&&d.animationState&&d.animationState.animateChanges())}),L.useEffect(()=>{d&&(d.updateFeatures(),!u.current&&d.animationState&&d.animationState.animateChanges(),u.current&&(u.current=!1,window.HandoffComplete=!0))}),d}function $1(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function YV(e,t,n){return L.useCallback(a=>{a&&e.mount&&e.mount(a),t&&(a?t.mount(a):t.unmount()),n&&(typeof n=="function"?n(a):$1(n)&&(n.current=a))},[t])}function ji(e){return typeof e=="string"||Array.isArray(e)}function s9(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}const nC=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],aC=["initial",...nC];function c9(e){return s9(e.animate)||aC.some(t=>ji(e[t]))}function JP(e){return!!(c9(e)||e.variants)}function JV(e,t){if(c9(e)){const{initial:n,animate:a}=e;return{initial:n===!1||ji(n)?n:void 0,animate:ji(a)?a:void 0}}return e.inherit!==!1?t:{}}function eH(e){const{initial:t,animate:n}=JV(e,L.useContext(i9));return L.useMemo(()=>({initial:t,animate:n}),[zS(t),zS(n)])}function zS(e){return Array.isArray(e)?e.join(" "):e}const VS={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]},Pi={};for(const e in VS)Pi[e]={isEnabled:t=>VS[e].some(n=>!!t[n])};function tH(e){for(const t in e)Pi[t]={...Pi[t],...e[t]}}const iC=L.createContext({}),eb=L.createContext({}),nH=Symbol.for("motionComponentSymbol");function aH({preloadedFeatures:e,createVisualElement:t,useRender:n,useVisualState:a,Component:r}){e&&tH(e);function o(c,l){let d;const u={...L.useContext(KP),...c,layoutId:iH(c)},{isStatic:y}=u,p=eH(c),m=a(c,y);if(!y&&o9){p.visualElement=QV(r,m,u,t);const v=L.useContext(eb),x=L.useContext(QP).strict;p.visualElement&&(d=p.visualElement.loadFeatures(u,x,e,v))}return L.createElement(i9.Provider,{value:p},d&&p.visualElement?L.createElement(d,{visualElement:p.visualElement,...u}):null,n(r,c,YV(m,p.visualElement,l),m,y,p.visualElement))}const s=L.forwardRef(o);return s[nH]=r,s}function iH({layoutId:e}){const t=L.useContext(iC).id;return t&&e!==void 0?t+"-"+e:e}function rH(e){function t(a,r={}){return aH(e(a,r))}if(typeof Proxy>"u")return t;const n=new Map;return new Proxy(t,{get:(a,r)=>(n.has(r)||n.set(r,t(r)),n.get(r))})}const oH=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function rC(e){return typeof e!="string"||e.includes("-")?!1:!!(oH.indexOf(e)>-1||/[A-Z]/.test(e))}const TM={};function sH(e){Object.assign(TM,e)}const qi=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],V1=new Set(qi);function tb(e,{layout:t,layoutId:n}){return V1.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!TM[e]||e==="opacity")}const be=e=>!!(e&&e.getVelocity),cH={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},lH=qi.length;function dH(e,{enableHardwareAcceleration:t=!0,allowTransformNone:n=!0},a,r){let o="";for(let s=0;s<lH;s++){const c=qi[s];if(e[c]!==void 0){const l=cH[c]||c;o+=`${l}(${e[c]}) `}}return t&&!e.z&&(o+="translateZ(0)"),o=o.trim(),r?o=r(e,a?"":o):n&&a&&(o="none"),o}const nb=e=>t=>typeof t=="string"&&t.startsWith(e),ab=nb("--"),Ww=nb("var(--"),hH=/var\s*\(\s*--[\w-]+(\s*,\s*(?:(?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)+)?\s*\)/g,uH=(e,t)=>t&&typeof e=="number"?t.transform(e):e,Gt=(e,t,n)=>Math.min(Math.max(n,e),t),H1={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},oi={...H1,transform:e=>Gt(0,1,e)},ar={...H1,default:1},si=e=>Math.round(e*1e5)/1e5,l9=/(-)?([\d]*\.?[\d])+/g,ib=/(#[0-9a-f]{3,8}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi,yH=/^(#[0-9a-f]{3,8}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;function Di(e){return typeof e=="string"}const Fi=e=>({test:t=>Di(t)&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),jt=Fi("deg"),dt=Fi("%"),V=Fi("px"),pH=Fi("vh"),kH=Fi("vw"),HS={...dt,parse:e=>dt.parse(e)/100,transform:e=>dt.transform(e*100)},TS={...H1,transform:Math.round},rb={borderWidth:V,borderTopWidth:V,borderRightWidth:V,borderBottomWidth:V,borderLeftWidth:V,borderRadius:V,radius:V,borderTopLeftRadius:V,borderTopRightRadius:V,borderBottomRightRadius:V,borderBottomLeftRadius:V,width:V,maxWidth:V,height:V,maxHeight:V,size:V,top:V,right:V,bottom:V,left:V,padding:V,paddingTop:V,paddingRight:V,paddingBottom:V,paddingLeft:V,margin:V,marginTop:V,marginRight:V,marginBottom:V,marginLeft:V,rotate:jt,rotateX:jt,rotateY:jt,rotateZ:jt,scale:ar,scaleX:ar,scaleY:ar,scaleZ:ar,skew:jt,skewX:jt,skewY:jt,distance:V,translateX:V,translateY:V,translateZ:V,x:V,y:V,z:V,perspective:V,transformPerspective:V,opacity:oi,originX:HS,originY:HS,originZ:V,zIndex:TS,fillOpacity:oi,strokeOpacity:oi,numOctaves:TS};function oC(e,t,n,a){const{style:r,vars:o,transform:s,transformOrigin:c}=e;let l=!1,d=!1,u=!0;for(const y in t){const p=t[y];if(ab(y)){o[y]=p;continue}const m=rb[y],v=uH(p,m);if(V1.has(y)){if(l=!0,s[y]=v,!u)continue;p!==(m.default||0)&&(u=!1)}else y.startsWith("origin")?(d=!0,c[y]=v):r[y]=v}if(t.transform||(l||a?r.transform=dH(e.transform,n,u,a):r.transform&&(r.transform="none")),d){const{originX:y="50%",originY:p="50%",originZ:m=0}=c;r.transformOrigin=`${y} ${p} ${m}`}}const sC=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function ob(e,t,n){for(const a in t)!be(t[a])&&!tb(a,n)&&(e[a]=t[a])}function fH({transformTemplate:e},t,n){return L.useMemo(()=>{const a=sC();return oC(a,t,{enableHardwareAcceleration:!n},e),Object.assign({},a.vars,a.style)},[t])}function mH(e,t,n){const a=e.style||{},r={};return ob(r,a,e),Object.assign(r,fH(e,t,n)),e.transformValues?e.transformValues(r):r}function gH(e,t,n){const a={},r=mH(e,t,n);return e.drag&&e.dragListener!==!1&&(a.draggable=!1,r.userSelect=r.WebkitUserSelect=r.WebkitTouchCallout="none",r.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(a.tabIndex=0),a.style=r,a}const vH=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","transformValues","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","ignoreStrict","viewport"]);function qM(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||vH.has(e)}let sb=e=>!qM(e);function xH(e){e&&(sb=t=>t.startsWith("on")?!qM(t):e(t))}try{xH(require("@emotion/is-prop-valid").default)}catch{}function MH(e,t,n){const a={};for(const r in e)r==="values"&&typeof e.values=="object"||(sb(r)||n===!0&&qM(r)||!t&&!qM(r)||e.draggable&&r.startsWith("onDrag"))&&(a[r]=e[r]);return a}function qS(e,t,n){return typeof e=="string"?e:V.transform(t+n*e)}function wH(e,t,n){const a=qS(t,e.x,e.width),r=qS(n,e.y,e.height);return`${a} ${r}`}const LH={offset:"stroke-dashoffset",array:"stroke-dasharray"},CH={offset:"strokeDashoffset",array:"strokeDasharray"};function SH(e,t,n=1,a=0,r=!0){e.pathLength=1;const o=r?LH:CH;e[o.offset]=V.transform(-a);const s=V.transform(t),c=V.transform(n);e[o.array]=`${s} ${c}`}function cC(e,{attrX:t,attrY:n,attrScale:a,originX:r,originY:o,pathLength:s,pathSpacing:c=1,pathOffset:l=0,...d},u,y,p){if(oC(e,d,u,p),y){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:m,style:v,dimensions:x}=e;m.transform&&(x&&(v.transform=m.transform),delete m.transform),x&&(r!==void 0||o!==void 0||v.transform)&&(v.transformOrigin=wH(x,r!==void 0?r:.5,o!==void 0?o:.5)),t!==void 0&&(m.x=t),n!==void 0&&(m.y=n),a!==void 0&&(m.scale=a),s!==void 0&&SH(m,s,c,l,!1)}const cb=()=>({...sC(),attrs:{}}),lC=e=>typeof e=="string"&&e.toLowerCase()==="svg";function IH(e,t,n,a){const r=L.useMemo(()=>{const o=cb();return cC(o,t,{enableHardwareAcceleration:!1},lC(a),e.transformTemplate),{...o.attrs,style:{...o.style}}},[t]);if(e.style){const o={};ob(o,e.style,e),r.style={...o,...r.style}}return r}function jH(e=!1){return(n,a,r,{latestValues:o},s)=>{const l=(rC(n)?IH:gH)(a,o,s,n),u={...MH(a,typeof n=="string",e),...l,ref:r},{children:y}=a,p=L.useMemo(()=>be(y)?y.get():y,[y]);return L.createElement(n,{...u,children:p})}}function lb(e,{style:t,vars:n},a,r){Object.assign(e.style,t,r&&r.getProjectionStyles(a));for(const o in n)e.style.setProperty(o,n[o])}const db=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]);function hb(e,t,n,a){lb(e,t,void 0,a);for(const r in t.attrs)e.setAttribute(db.has(r)?r:tC(r),t.attrs[r])}function dC(e,t){const{style:n}=e,a={};for(const r in n)(be(n[r])||t.style&&be(t.style[r])||tb(r,e))&&(a[r]=n[r]);return a}function ub(e,t){const n=dC(e,t);for(const a in e)if(be(e[a])||be(t[a])){const r=qi.indexOf(a)!==-1?"attr"+a.charAt(0).toUpperCase()+a.substring(1):a;n[r]=e[a]}return n}function hC(e,t,n,a={},r={}){return typeof t=="function"&&(t=t(n!==void 0?n:e.custom,a,r)),typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"&&(t=t(n!==void 0?n:e.custom,a,r)),t}function yb(e){const t=L.useRef(null);return t.current===null&&(t.current=e()),t.current}const DM=e=>Array.isArray(e),PH=e=>!!(e&&typeof e=="object"&&e.mix&&e.toValue),bH=e=>DM(e)?e[e.length-1]||0:e;function cM(e){const t=be(e)?e.get():e;return PH(t)?t.toValue():t}function AH({scrapeMotionValuesFromProps:e,createRenderState:t,onMount:n},a,r,o){const s={latestValues:zH(a,r,o,e),renderState:t()};return n&&(s.mount=c=>n(a,c,s)),s}const pb=e=>(t,n)=>{const a=L.useContext(i9),r=L.useContext(r9),o=()=>AH(e,t,a,r);return n?o():yb(o)};function zH(e,t,n,a){const r={},o=a(e,{});for(const p in o)r[p]=cM(o[p]);let{initial:s,animate:c}=e;const l=c9(e),d=JP(e);t&&d&&!l&&e.inherit!==!1&&(s===void 0&&(s=t.initial),c===void 0&&(c=t.animate));let u=n?n.initial===!1:!1;u=u||s===!1;const y=u?c:s;return y&&typeof y!="boolean"&&!s9(y)&&(Array.isArray(y)?y:[y]).forEach(m=>{const v=hC(e,m);if(!v)return;const{transitionEnd:x,transition:I,...g}=v;for(const k in g){let f=g[k];if(Array.isArray(f)){const M=u?f.length-1:0;f=f[M]}f!==null&&(r[k]=f)}for(const k in x)r[k]=x[k]}),r}const ee=e=>e;class DS{constructor(){this.order=[],this.scheduled=new Set}add(t){if(!this.scheduled.has(t))return this.scheduled.add(t),this.order.push(t),!0}remove(t){const n=this.order.indexOf(t);n!==-1&&(this.order.splice(n,1),this.scheduled.delete(t))}clear(){this.order.length=0,this.scheduled.clear()}}function VH(e){let t=new DS,n=new DS,a=0,r=!1,o=!1;const s=new WeakSet,c={schedule:(l,d=!1,u=!1)=>{const y=u&&r,p=y?t:n;return d&&s.add(l),p.add(l)&&y&&r&&(a=t.order.length),l},cancel:l=>{n.remove(l),s.delete(l)},process:l=>{if(r){o=!0;return}if(r=!0,[t,n]=[n,t],n.clear(),a=t.order.length,a)for(let d=0;d<a;d++){const u=t.order[d];u(l),s.has(u)&&(c.schedule(u),e())}r=!1,o&&(o=!1,c.process(l))}};return c}const ir=["prepare","read","update","preRender","render","postRender"],HH=40;function TH(e,t){let n=!1,a=!0;const r={delta:0,timestamp:0,isProcessing:!1},o=ir.reduce((y,p)=>(y[p]=VH(()=>n=!0),y),{}),s=y=>o[y].process(r),c=()=>{const y=performance.now();n=!1,r.delta=a?1e3/60:Math.max(Math.min(y-r.timestamp,HH),1),r.timestamp=y,r.isProcessing=!0,ir.forEach(s),r.isProcessing=!1,n&&t&&(a=!1,e(c))},l=()=>{n=!0,a=!0,r.isProcessing||e(c)};return{schedule:ir.reduce((y,p)=>{const m=o[p];return y[p]=(v,x=!1,I=!1)=>(n||l(),m.schedule(v,x,I)),y},{}),cancel:y=>ir.forEach(p=>o[p].cancel(y)),state:r,steps:o}}const{schedule:E,cancel:Lt,state:ke,steps:B9}=TH(typeof requestAnimationFrame<"u"?requestAnimationFrame:ee,!0),qH={useVisualState:pb({scrapeMotionValuesFromProps:ub,createRenderState:cb,onMount:(e,t,{renderState:n,latestValues:a})=>{E.read(()=>{try{n.dimensions=typeof t.getBBox=="function"?t.getBBox():t.getBoundingClientRect()}catch{n.dimensions={x:0,y:0,width:0,height:0}}}),E.render(()=>{cC(n,a,{enableHardwareAcceleration:!1},lC(t.tagName),e.transformTemplate),hb(t,n)})}})},DH={useVisualState:pb({scrapeMotionValuesFromProps:dC,createRenderState:sC})};function FH(e,{forwardMotionProps:t=!1},n,a){return{...rC(e)?qH:DH,preloadedFeatures:n,useRender:jH(t),createVisualElement:a,Component:e}}function kt(e,t,n,a={passive:!0}){return e.addEventListener(t,n,a),()=>e.removeEventListener(t,n)}const kb=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1;function d9(e,t="page"){return{point:{x:e[t+"X"],y:e[t+"Y"]}}}const RH=e=>t=>kb(t)&&e(t,d9(t));function mt(e,t,n,a){return kt(e,t,RH(n),a)}const BH=(e,t)=>n=>t(e(n)),Zt=(...e)=>e.reduce(BH);function fb(e){let t=null;return()=>{const n=()=>{t=null};return t===null?(t=e,n):!1}}const FS=fb("dragHorizontal"),RS=fb("dragVertical");function mb(e){let t=!1;if(e==="y")t=RS();else if(e==="x")t=FS();else{const n=FS(),a=RS();n&&a?t=()=>{n(),a()}:(n&&n(),a&&a())}return t}function gb(){const e=mb(!0);return e?(e(),!1):!0}class Yt{constructor(t){this.isMounted=!1,this.node=t}update(){}}function BS(e,t){const n="pointer"+(t?"enter":"leave"),a="onHover"+(t?"Start":"End"),r=(o,s)=>{if(o.pointerType==="touch"||gb())return;const c=e.getProps();e.animationState&&c.whileHover&&e.animationState.setActive("whileHover",t),c[a]&&E.update(()=>c[a](o,s))};return mt(e.current,n,r,{passive:!e.getProps()[a]})}class NH extends Yt{mount(){this.unmount=Zt(BS(this.node,!0),BS(this.node,!1))}unmount(){}}class EH extends Yt{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Zt(kt(this.node.current,"focus",()=>this.onFocus()),kt(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}const vb=(e,t)=>t?e===t?!0:vb(e,t.parentElement):!1;function N9(e,t){if(!t)return;const n=new PointerEvent("pointer"+e);t(n,d9(n))}class OH extends Yt{constructor(){super(...arguments),this.removeStartListeners=ee,this.removeEndListeners=ee,this.removeAccessibleListeners=ee,this.startPointerPress=(t,n)=>{if(this.isPressing)return;this.removeEndListeners();const a=this.node.getProps(),o=mt(window,"pointerup",(c,l)=>{if(!this.checkPressEnd())return;const{onTap:d,onTapCancel:u,globalTapTarget:y}=this.node.getProps();E.update(()=>{!y&&!vb(this.node.current,c.target)?u&&u(c,l):d&&d(c,l)})},{passive:!(a.onTap||a.onPointerUp)}),s=mt(window,"pointercancel",(c,l)=>this.cancelPress(c,l),{passive:!(a.onTapCancel||a.onPointerCancel)});this.removeEndListeners=Zt(o,s),this.startPress(t,n)},this.startAccessiblePress=()=>{const t=o=>{if(o.key!=="Enter"||this.isPressing)return;const s=c=>{c.key!=="Enter"||!this.checkPressEnd()||N9("up",(l,d)=>{const{onTap:u}=this.node.getProps();u&&E.update(()=>u(l,d))})};this.removeEndListeners(),this.removeEndListeners=kt(this.node.current,"keyup",s),N9("down",(c,l)=>{this.startPress(c,l)})},n=kt(this.node.current,"keydown",t),a=()=>{this.isPressing&&N9("cancel",(o,s)=>this.cancelPress(o,s))},r=kt(this.node.current,"blur",a);this.removeAccessibleListeners=Zt(n,r)}}startPress(t,n){this.isPressing=!0;const{onTapStart:a,whileTap:r}=this.node.getProps();r&&this.node.animationState&&this.node.animationState.setActive("whileTap",!0),a&&E.update(()=>a(t,n))}checkPressEnd(){return this.removeEndListeners(),this.isPressing=!1,this.node.getProps().whileTap&&this.node.animationState&&this.node.animationState.setActive("whileTap",!1),!gb()}cancelPress(t,n){if(!this.checkPressEnd())return;const{onTapCancel:a}=this.node.getProps();a&&E.update(()=>a(t,n))}mount(){const t=this.node.getProps(),n=mt(t.globalTapTarget?window:this.node.current,"pointerdown",this.startPointerPress,{passive:!(t.onTapStart||t.onPointerStart)}),a=kt(this.node.current,"focus",this.startAccessiblePress);this.removeStartListeners=Zt(n,a)}unmount(){this.removeStartListeners(),this.removeEndListeners(),this.removeAccessibleListeners()}}const Gw=new WeakMap,E9=new WeakMap,UH=e=>{const t=Gw.get(e.target);t&&t(e)},ZH=e=>{e.forEach(UH)};function _H({root:e,...t}){const n=e||document;E9.has(n)||E9.set(n,{});const a=E9.get(n),r=JSON.stringify(t);return a[r]||(a[r]=new IntersectionObserver(ZH,{root:e,...t})),a[r]}function WH(e,t,n){const a=_H(t);return Gw.set(e,n),a.observe(e),()=>{Gw.delete(e),a.unobserve(e)}}const GH={some:0,all:1};class $H extends Yt{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.unmount();const{viewport:t={}}=this.node.getProps(),{root:n,margin:a,amount:r="some",once:o}=t,s={root:n?n.current:void 0,rootMargin:a,threshold:typeof r=="number"?r:GH[r]},c=l=>{const{isIntersecting:d}=l;if(this.isInView===d||(this.isInView=d,o&&!d&&this.hasEnteredView))return;d&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",d);const{onViewportEnter:u,onViewportLeave:y}=this.node.getProps(),p=d?u:y;p&&p(l)};return WH(this.node.current,s,c)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(XH(t,n))&&this.startObserver()}unmount(){}}function XH({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const KH={inView:{Feature:$H},tap:{Feature:OH},focus:{Feature:EH},hover:{Feature:NH}};function xb(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let a=0;a<n;a++)if(t[a]!==e[a])return!1;return!0}function QH(e){const t={};return e.values.forEach((n,a)=>t[a]=n.get()),t}function YH(e){const t={};return e.values.forEach((n,a)=>t[a]=n.getVelocity()),t}function h9(e,t,n){const a=e.getProps();return hC(a,t,n!==void 0?n:a.custom,QH(e),YH(e))}let uC=ee;const L1=e=>e*1e3,gt=e=>e/1e3,JH={current:!1},Mb=e=>Array.isArray(e)&&typeof e[0]=="number";function wb(e){return!!(!e||typeof e=="string"&&Lb[e]||Mb(e)||Array.isArray(e)&&e.every(wb))}const Fa=([e,t,n,a])=>`cubic-bezier(${e}, ${t}, ${n}, ${a})`,Lb={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Fa([0,.65,.55,1]),circOut:Fa([.55,0,1,.45]),backIn:Fa([.31,.01,.66,-.59]),backOut:Fa([.33,1.53,.69,.99])};function Cb(e){if(e)return Mb(e)?Fa(e):Array.isArray(e)?e.map(Cb):Lb[e]}function eT(e,t,n,{delay:a=0,duration:r,repeat:o=0,repeatType:s="loop",ease:c,times:l}={}){const d={[t]:n};l&&(d.offset=l);const u=Cb(c);return Array.isArray(u)&&(d.easing=u),e.animate(d,{delay:a,duration:r,easing:Array.isArray(u)?"linear":u,fill:"both",iterations:o+1,direction:s==="reverse"?"alternate":"normal"})}function tT(e,{repeat:t,repeatType:n="loop"}){const a=t&&n!=="loop"&&t%2===1?0:e.length-1;return e[a]}const Sb=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,nT=1e-7,aT=12;function iT(e,t,n,a,r){let o,s,c=0;do s=t+(n-t)/2,o=Sb(s,a,r)-e,o>0?n=s:t=s;while(Math.abs(o)>nT&&++c<aT);return s}function Ri(e,t,n,a){if(e===t&&n===a)return ee;const r=o=>iT(o,0,1,e,n);return o=>o===0||o===1?o:Sb(r(o),t,a)}const rT=Ri(.42,0,1,1),oT=Ri(0,0,.58,1),Ib=Ri(.42,0,.58,1),sT=e=>Array.isArray(e)&&typeof e[0]!="number",jb=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,Pb=e=>t=>1-e(1-t),yC=e=>1-Math.sin(Math.acos(e)),bb=Pb(yC),cT=jb(yC),Ab=Ri(.33,1.53,.69,.99),pC=Pb(Ab),lT=jb(pC),dT=e=>(e*=2)<1?.5*pC(e):.5*(2-Math.pow(2,-10*(e-1))),hT={linear:ee,easeIn:rT,easeInOut:Ib,easeOut:oT,circIn:yC,circInOut:cT,circOut:bb,backIn:pC,backInOut:lT,backOut:Ab,anticipate:dT},NS=e=>{if(Array.isArray(e)){uC(e.length===4);const[t,n,a,r]=e;return Ri(t,n,a,r)}else if(typeof e=="string")return hT[e];return e},kC=(e,t)=>n=>!!(Di(n)&&yH.test(n)&&n.startsWith(e)||t&&Object.prototype.hasOwnProperty.call(n,t)),zb=(e,t,n)=>a=>{if(!Di(a))return a;const[r,o,s,c]=a.match(l9);return{[e]:parseFloat(r),[t]:parseFloat(o),[n]:parseFloat(s),alpha:c!==void 0?parseFloat(c):1}},uT=e=>Gt(0,255,e),O9={...H1,transform:e=>Math.round(uT(e))},p1={test:kC("rgb","red"),parse:zb("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:a=1})=>"rgba("+O9.transform(e)+", "+O9.transform(t)+", "+O9.transform(n)+", "+si(oi.transform(a))+")"};function yT(e){let t="",n="",a="",r="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),a=e.substring(5,7),r=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),a=e.substring(3,4),r=e.substring(4,5),t+=t,n+=n,a+=a,r+=r),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(a,16),alpha:r?parseInt(r,16)/255:1}}const $w={test:kC("#"),parse:yT,transform:p1.transform},X1={test:kC("hsl","hue"),parse:zb("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:a=1})=>"hsla("+Math.round(e)+", "+dt.transform(si(t))+", "+dt.transform(si(n))+", "+si(oi.transform(a))+")"},ve={test:e=>p1.test(e)||$w.test(e)||X1.test(e),parse:e=>p1.test(e)?p1.parse(e):X1.test(e)?X1.parse(e):$w.parse(e),transform:e=>Di(e)?e:e.hasOwnProperty("red")?p1.transform(e):X1.transform(e)},$=(e,t,n)=>-n*e+n*t+e;function U9(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function pT({hue:e,saturation:t,lightness:n,alpha:a}){e/=360,t/=100,n/=100;let r=0,o=0,s=0;if(!t)r=o=s=n;else{const c=n<.5?n*(1+t):n+t-n*t,l=2*n-c;r=U9(l,c,e+1/3),o=U9(l,c,e),s=U9(l,c,e-1/3)}return{red:Math.round(r*255),green:Math.round(o*255),blue:Math.round(s*255),alpha:a}}const Z9=(e,t,n)=>{const a=e*e;return Math.sqrt(Math.max(0,n*(t*t-a)+a))},kT=[$w,p1,X1],fT=e=>kT.find(t=>t.test(e));function ES(e){const t=fT(e);let n=t.parse(e);return t===X1&&(n=pT(n)),n}const Vb=(e,t)=>{const n=ES(e),a=ES(t),r={...n};return o=>(r.red=Z9(n.red,a.red,o),r.green=Z9(n.green,a.green,o),r.blue=Z9(n.blue,a.blue,o),r.alpha=$(n.alpha,a.alpha,o),p1.transform(r))};function mT(e){var t,n;return isNaN(e)&&Di(e)&&(((t=e.match(l9))===null||t===void 0?void 0:t.length)||0)+(((n=e.match(ib))===null||n===void 0?void 0:n.length)||0)>0}const Hb={regex:hH,countKey:"Vars",token:"${v}",parse:ee},Tb={regex:ib,countKey:"Colors",token:"${c}",parse:ve.parse},qb={regex:l9,countKey:"Numbers",token:"${n}",parse:H1.parse};function _9(e,{regex:t,countKey:n,token:a,parse:r}){const o=e.tokenised.match(t);o&&(e["num"+n]=o.length,e.tokenised=e.tokenised.replace(t,a),e.values.push(...o.map(r)))}function FM(e){const t=e.toString(),n={value:t,tokenised:t,values:[],numVars:0,numColors:0,numNumbers:0};return n.value.includes("var(--")&&_9(n,Hb),_9(n,Tb),_9(n,qb),n}function Db(e){return FM(e).values}function Fb(e){const{values:t,numColors:n,numVars:a,tokenised:r}=FM(e),o=t.length;return s=>{let c=r;for(let l=0;l<o;l++)l<a?c=c.replace(Hb.token,s[l]):l<a+n?c=c.replace(Tb.token,ve.transform(s[l])):c=c.replace(qb.token,si(s[l]));return c}}const gT=e=>typeof e=="number"?0:e;function vT(e){const t=Db(e);return Fb(e)(t.map(gT))}const $t={test:mT,parse:Db,createTransformer:Fb,getAnimatableNone:vT},Rb=(e,t)=>n=>`${n>0?t:e}`;function Bb(e,t){return typeof e=="number"?n=>$(e,t,n):ve.test(e)?Vb(e,t):e.startsWith("var(")?Rb(e,t):Eb(e,t)}const Nb=(e,t)=>{const n=[...e],a=n.length,r=e.map((o,s)=>Bb(o,t[s]));return o=>{for(let s=0;s<a;s++)n[s]=r[s](o);return n}},xT=(e,t)=>{const n={...e,...t},a={};for(const r in n)e[r]!==void 0&&t[r]!==void 0&&(a[r]=Bb(e[r],t[r]));return r=>{for(const o in a)n[o]=a[o](r);return n}},Eb=(e,t)=>{const n=$t.createTransformer(t),a=FM(e),r=FM(t);return a.numVars===r.numVars&&a.numColors===r.numColors&&a.numNumbers>=r.numNumbers?Zt(Nb(a.values,r.values),n):Rb(e,t)},bi=(e,t,n)=>{const a=t-e;return a===0?1:(n-e)/a},OS=(e,t)=>n=>$(e,t,n);function MT(e){return typeof e=="number"?OS:typeof e=="string"?ve.test(e)?Vb:Eb:Array.isArray(e)?Nb:typeof e=="object"?xT:OS}function wT(e,t,n){const a=[],r=n||MT(e[0]),o=e.length-1;for(let s=0;s<o;s++){let c=r(e[s],e[s+1]);if(t){const l=Array.isArray(t)?t[s]||ee:t;c=Zt(l,c)}a.push(c)}return a}function Ob(e,t,{clamp:n=!0,ease:a,mixer:r}={}){const o=e.length;if(uC(o===t.length),o===1)return()=>t[0];e[0]>e[o-1]&&(e=[...e].reverse(),t=[...t].reverse());const s=wT(t,a,r),c=s.length,l=d=>{let u=0;if(c>1)for(;u<e.length-2&&!(d<e[u+1]);u++);const y=bi(e[u],e[u+1],d);return s[u](y)};return n?d=>l(Gt(e[0],e[o-1],d)):l}function LT(e,t){const n=e[e.length-1];for(let a=1;a<=t;a++){const r=bi(0,t,a);e.push($(n,1,r))}}function CT(e){const t=[0];return LT(t,e.length-1),t}function ST(e,t){return e.map(n=>n*t)}function IT(e,t){return e.map(()=>t||Ib).splice(0,e.length-1)}function RM({duration:e=300,keyframes:t,times:n,ease:a="easeInOut"}){const r=sT(a)?a.map(NS):NS(a),o={done:!1,value:t[0]},s=ST(n&&n.length===t.length?n:CT(t),e),c=Ob(s,t,{ease:Array.isArray(r)?r:IT(t,r)});return{calculatedDuration:e,next:l=>(o.value=c(l),o.done=l>=e,o)}}function Ub(e,t){return t?e*(1e3/t):0}const jT=5;function Zb(e,t,n){const a=Math.max(t-jT,0);return Ub(n-e(a),t-a)}const W9=.001,PT=.01,bT=10,AT=.05,zT=1;function VT({duration:e=800,bounce:t=.25,velocity:n=0,mass:a=1}){let r,o,s=1-t;s=Gt(AT,zT,s),e=Gt(PT,bT,gt(e)),s<1?(r=d=>{const u=d*s,y=u*e,p=u-n,m=Xw(d,s),v=Math.exp(-y);return W9-p/m*v},o=d=>{const y=d*s*e,p=y*n+n,m=Math.pow(s,2)*Math.pow(d,2)*e,v=Math.exp(-y),x=Xw(Math.pow(d,2),s);return(-r(d)+W9>0?-1:1)*((p-m)*v)/x}):(r=d=>{const u=Math.exp(-d*e),y=(d-n)*e+1;return-W9+u*y},o=d=>{const u=Math.exp(-d*e),y=(n-d)*(e*e);return u*y});const c=5/e,l=TT(r,o,c);if(e=L1(e),isNaN(l))return{stiffness:100,damping:10,duration:e};{const d=Math.pow(l,2)*a;return{stiffness:d,damping:s*2*Math.sqrt(a*d),duration:e}}}const HT=12;function TT(e,t,n){let a=n;for(let r=1;r<HT;r++)a=a-e(a)/t(a);return a}function Xw(e,t){return e*Math.sqrt(1-t*t)}const qT=["duration","bounce"],DT=["stiffness","damping","mass"];function US(e,t){return t.some(n=>e[n]!==void 0)}function FT(e){let t={velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1,...e};if(!US(e,DT)&&US(e,qT)){const n=VT(e);t={...t,...n,mass:1},t.isResolvedFromDuration=!0}return t}function _b({keyframes:e,restDelta:t,restSpeed:n,...a}){const r=e[0],o=e[e.length-1],s={done:!1,value:r},{stiffness:c,damping:l,mass:d,duration:u,velocity:y,isResolvedFromDuration:p}=FT({...a,velocity:-gt(a.velocity||0)}),m=y||0,v=l/(2*Math.sqrt(c*d)),x=o-r,I=gt(Math.sqrt(c/d)),g=Math.abs(x)<5;n||(n=g?.01:2),t||(t=g?.005:.5);let k;if(v<1){const f=Xw(I,v);k=M=>{const w=Math.exp(-v*I*M);return o-w*((m+v*I*x)/f*Math.sin(f*M)+x*Math.cos(f*M))}}else if(v===1)k=f=>o-Math.exp(-I*f)*(x+(m+I*x)*f);else{const f=I*Math.sqrt(v*v-1);k=M=>{const w=Math.exp(-v*I*M),j=Math.min(f*M,300);return o-w*((m+v*I*x)*Math.sinh(j)+f*x*Math.cosh(j))/f}}return{calculatedDuration:p&&u||null,next:f=>{const M=k(f);if(p)s.done=f>=u;else{let w=m;f!==0&&(v<1?w=Zb(k,f,M):w=0);const j=Math.abs(w)<=n,P=Math.abs(o-M)<=t;s.done=j&&P}return s.value=s.done?o:M,s}}}function ZS({keyframes:e,velocity:t=0,power:n=.8,timeConstant:a=325,bounceDamping:r=10,bounceStiffness:o=500,modifyTarget:s,min:c,max:l,restDelta:d=.5,restSpeed:u}){const y=e[0],p={done:!1,value:y},m=S=>c!==void 0&&S<c||l!==void 0&&S>l,v=S=>c===void 0?l:l===void 0||Math.abs(c-S)<Math.abs(l-S)?c:l;let x=n*t;const I=y+x,g=s===void 0?I:s(I);g!==I&&(x=g-y);const k=S=>-x*Math.exp(-S/a),f=S=>g+k(S),M=S=>{const z=k(S),H=f(S);p.done=Math.abs(z)<=d,p.value=p.done?g:H};let w,j;const P=S=>{m(p.value)&&(w=S,j=_b({keyframes:[p.value,v(p.value)],velocity:Zb(f,S,p.value),damping:r,stiffness:o,restDelta:d,restSpeed:u}))};return P(0),{calculatedDuration:null,next:S=>{let z=!1;return!j&&w===void 0&&(z=!0,M(S),P(S)),w!==void 0&&S>w?j.next(S-w):(!z&&M(S),p)}}}const RT=e=>{const t=({timestamp:n})=>e(n);return{start:()=>E.update(t,!0),stop:()=>Lt(t),now:()=>ke.isProcessing?ke.timestamp:performance.now()}},_S=2e4;function WS(e){let t=0;const n=50;let a=e.next(t);for(;!a.done&&t<_S;)t+=n,a=e.next(t);return t>=_S?1/0:t}const BT={decay:ZS,inertia:ZS,tween:RM,keyframes:RM,spring:_b};function BM({autoplay:e=!0,delay:t=0,driver:n=RT,keyframes:a,type:r="keyframes",repeat:o=0,repeatDelay:s=0,repeatType:c="loop",onPlay:l,onStop:d,onComplete:u,onUpdate:y,...p}){let m=1,v=!1,x,I;const g=()=>{I=new Promise(q=>{x=q})};g();let k;const f=BT[r]||RM;let M;f!==RM&&typeof a[0]!="number"&&(M=Ob([0,100],a,{clamp:!1}),a=[0,100]);const w=f({...p,keyframes:a});let j;c==="mirror"&&(j=f({...p,keyframes:[...a].reverse(),velocity:-(p.velocity||0)}));let P="idle",S=null,z=null,H=null;w.calculatedDuration===null&&o&&(w.calculatedDuration=WS(w));const{calculatedDuration:re}=w;let le=1/0,ge=1/0;re!==null&&(le=re+s,ge=le*(o+1)-s);let oe=0;const St=q=>{if(z===null)return;m>0&&(z=Math.min(z,q)),m<0&&(z=Math.min(q-ge/m,z)),S!==null?oe=S:oe=Math.round(q-z)*m;const _=oe-t*(m>=0?1:-1),Jt=m>=0?_<0:_>ge;oe=Math.max(_,0),P==="finished"&&S===null&&(oe=ge);let tt=oe,T1=w;if(o){const u9=Math.min(oe,ge)/le;let Bi=Math.floor(u9),tn=u9%1;!tn&&u9>=1&&(tn=1),tn===1&&Bi--,Bi=Math.min(Bi,o+1),!!(Bi%2)&&(c==="reverse"?(tn=1-tn,s&&(tn-=s/le)):c==="mirror"&&(T1=j)),tt=Gt(0,1,tn)*le}const Ae=Jt?{done:!1,value:a[0]}:T1.next(tt);M&&(Ae.value=M(Ae.value));let{done:en}=Ae;!Jt&&re!==null&&(en=m>=0?oe>=ge:oe<=0);const gA=S===null&&(P==="finished"||P==="running"&&en);return y&&y(Ae.value),gA&&b(),Ae},Y=()=>{k&&k.stop(),k=void 0},Re=()=>{P="idle",Y(),x(),g(),z=H=null},b=()=>{P="finished",u&&u(),Y(),x()},T=()=>{if(v)return;k||(k=n(St));const q=k.now();l&&l(),S!==null?z=q-S:(!z||P==="finished")&&(z=q),P==="finished"&&g(),H=z,S=null,P="running",k.start()};e&&T();const D={then(q,_){return I.then(q,_)},get time(){return gt(oe)},set time(q){q=L1(q),oe=q,S!==null||!k||m===0?S=q:z=k.now()-q/m},get duration(){const q=w.calculatedDuration===null?WS(w):w.calculatedDuration;return gt(q)},get speed(){return m},set speed(q){q===m||!k||(m=q,D.time=gt(oe))},get state(){return P},play:T,pause:()=>{P="paused",S=oe},stop:()=>{v=!0,P!=="idle"&&(P="idle",d&&d(),Re())},cancel:()=>{H!==null&&St(H),Re()},complete:()=>{P="finished"},sample:q=>(z=0,St(q))};return D}function NT(e){let t;return()=>(t===void 0&&(t=e()),t)}const ET=NT(()=>Object.hasOwnProperty.call(Element.prototype,"animate")),OT=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),rr=10,UT=2e4,ZT=(e,t)=>t.type==="spring"||e==="backgroundColor"||!wb(t.ease);function _T(e,t,{onUpdate:n,onComplete:a,...r}){if(!(ET()&&OT.has(t)&&!r.repeatDelay&&r.repeatType!=="mirror"&&r.damping!==0&&r.type!=="inertia"))return!1;let s=!1,c,l,d=!1;const u=()=>{l=new Promise(f=>{c=f})};u();let{keyframes:y,duration:p=300,ease:m,times:v}=r;if(ZT(t,r)){const f=BM({...r,repeat:0,delay:0});let M={done:!1,value:y[0]};const w=[];let j=0;for(;!M.done&&j<UT;)M=f.sample(j),w.push(M.value),j+=rr;v=void 0,y=w,p=j-rr,m="linear"}const x=eT(e.owner.current,t,y,{...r,duration:p,ease:m,times:v}),I=()=>{d=!1,x.cancel()},g=()=>{d=!0,E.update(I),c(),u()};return x.onfinish=()=>{d||(e.set(tT(y,r)),a&&a(),g())},{then(f,M){return l.then(f,M)},attachTimeline(f){return x.timeline=f,x.onfinish=null,ee},get time(){return gt(x.currentTime||0)},set time(f){x.currentTime=L1(f)},get speed(){return x.playbackRate},set speed(f){x.playbackRate=f},get duration(){return gt(p)},play:()=>{s||(x.play(),Lt(I))},pause:()=>x.pause(),stop:()=>{if(s=!0,x.playState==="idle")return;const{currentTime:f}=x;if(f){const M=BM({...r,autoplay:!1});e.setWithVelocity(M.sample(f-rr).value,M.sample(f).value,rr)}g()},complete:()=>{d||x.finish()},cancel:g}}function WT({keyframes:e,delay:t,onUpdate:n,onComplete:a}){const r=()=>(n&&n(e[e.length-1]),a&&a(),{time:0,speed:1,duration:0,play:ee,pause:ee,stop:ee,then:o=>(o(),Promise.resolve()),cancel:ee,complete:ee});return t?BM({keyframes:[0,1],duration:0,delay:t,onComplete:r}):r()}const GT={type:"spring",stiffness:500,damping:25,restSpeed:10},$T=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),XT={type:"keyframes",duration:.8},KT={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},QT=(e,{keyframes:t})=>t.length>2?XT:V1.has(e)?e.startsWith("scale")?$T(t[1]):GT:KT,Kw=(e,t)=>e==="zIndex"?!1:!!(typeof t=="number"||Array.isArray(t)||typeof t=="string"&&($t.test(t)||t==="0")&&!t.startsWith("url(")),YT=new Set(["brightness","contrast","saturate","opacity"]);function JT(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[a]=n.match(l9)||[];if(!a)return e;const r=n.replace(a,"");let o=YT.has(t)?1:0;return a!==n&&(o*=100),t+"("+o+r+")"}const eq=/([a-z-]*)\(.*?\)/g,Qw={...$t,getAnimatableNone:e=>{const t=e.match(eq);return t?t.map(JT).join(" "):e}},tq={...rb,color:ve,backgroundColor:ve,outlineColor:ve,fill:ve,stroke:ve,borderColor:ve,borderTopColor:ve,borderRightColor:ve,borderBottomColor:ve,borderLeftColor:ve,filter:Qw,WebkitFilter:Qw},fC=e=>tq[e];function Wb(e,t){let n=fC(e);return n!==Qw&&(n=$t),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const Gb=e=>/^0[^.\s]+$/.test(e);function nq(e){if(typeof e=="number")return e===0;if(e!==null)return e==="none"||e==="0"||Gb(e)}function aq(e,t,n,a){const r=Kw(t,n);let o;Array.isArray(n)?o=[...n]:o=[null,n];const s=a.from!==void 0?a.from:e.get();let c;const l=[];for(let d=0;d<o.length;d++)o[d]===null&&(o[d]=d===0?s:o[d-1]),nq(o[d])&&l.push(d),typeof o[d]=="string"&&o[d]!=="none"&&o[d]!=="0"&&(c=o[d]);if(r&&l.length&&c)for(let d=0;d<l.length;d++){const u=l[d];o[u]=Wb(t,c)}return o}function iq({when:e,delay:t,delayChildren:n,staggerChildren:a,staggerDirection:r,repeat:o,repeatType:s,repeatDelay:c,from:l,elapsed:d,...u}){return!!Object.keys(u).length}function mC(e,t){return e[t]||e.default||e}const rq={skipAnimations:!1},gC=(e,t,n,a={})=>r=>{const o=mC(a,e)||{},s=o.delay||a.delay||0;let{elapsed:c=0}=a;c=c-L1(s);const l=aq(t,e,n,o),d=l[0],u=l[l.length-1],y=Kw(e,d),p=Kw(e,u);let m={keyframes:l,velocity:t.getVelocity(),ease:"easeOut",...o,delay:-c,onUpdate:v=>{t.set(v),o.onUpdate&&o.onUpdate(v)},onComplete:()=>{r(),o.onComplete&&o.onComplete()}};if(iq(o)||(m={...m,...QT(e,m)}),m.duration&&(m.duration=L1(m.duration)),m.repeatDelay&&(m.repeatDelay=L1(m.repeatDelay)),!y||!p||JH.current||o.type===!1||rq.skipAnimations)return WT(m);if(!a.isHandoff&&t.owner&&t.owner.current instanceof HTMLElement&&!t.owner.getProps().onUpdate){const v=_T(t,e,m);if(v)return v}return BM(m)};function NM(e){return!!(be(e)&&e.add)}const $b=e=>/^\-?\d*\.?\d+$/.test(e);function vC(e,t){e.indexOf(t)===-1&&e.push(t)}function xC(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}class MC{constructor(){this.subscriptions=[]}add(t){return vC(this.subscriptions,t),()=>xC(this.subscriptions,t)}notify(t,n,a){const r=this.subscriptions.length;if(r)if(r===1)this.subscriptions[0](t,n,a);else for(let o=0;o<r;o++){const s=this.subscriptions[o];s&&s(t,n,a)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const oq=e=>!isNaN(parseFloat(e));class sq{constructor(t,n={}){this.version="10.18.0",this.timeDelta=0,this.lastUpdated=0,this.canTrackVelocity=!1,this.events={},this.updateAndNotify=(a,r=!0)=>{this.prev=this.current,this.current=a;const{delta:o,timestamp:s}=ke;this.lastUpdated!==s&&(this.timeDelta=o,this.lastUpdated=s,E.postRender(this.scheduleVelocityCheck)),this.prev!==this.current&&this.events.change&&this.events.change.notify(this.current),this.events.velocityChange&&this.events.velocityChange.notify(this.getVelocity()),r&&this.events.renderRequest&&this.events.renderRequest.notify(this.current)},this.scheduleVelocityCheck=()=>E.postRender(this.velocityCheck),this.velocityCheck=({timestamp:a})=>{a!==this.lastUpdated&&(this.prev=this.current,this.events.velocityChange&&this.events.velocityChange.notify(this.getVelocity()))},this.hasAnimated=!1,this.prev=this.current=t,this.canTrackVelocity=oq(this.current),this.owner=n.owner}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new MC);const a=this.events[t].add(n);return t==="change"?()=>{a(),E.read(()=>{this.events.change.getSize()||this.stop()})}:a}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t,n=!0){!n||!this.passiveEffect?this.updateAndNotify(t,n):this.passiveEffect(t,this.updateAndNotify)}setWithVelocity(t,n,a){this.set(n),this.prev=t,this.timeDelta=a}jump(t){this.updateAndNotify(t),this.prev=t,this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}get(){return this.current}getPrevious(){return this.prev}getVelocity(){return this.canTrackVelocity?Ub(parseFloat(this.current)-parseFloat(this.prev),this.timeDelta):0}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function ga(e,t){return new sq(e,t)}const Xb=e=>t=>t.test(e),cq={test:e=>e==="auto",parse:e=>e},Kb=[H1,V,dt,jt,kH,pH,cq],za=e=>Kb.find(Xb(e)),lq=[...Kb,ve,$t],dq=e=>lq.find(Xb(e));function hq(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,ga(n))}function uq(e,t){const n=h9(e,t);let{transitionEnd:a={},transition:r={},...o}=n?e.makeTargetAnimatable(n,!1):{};o={...o,...a};for(const s in o){const c=bH(o[s]);hq(e,s,c)}}function yq(e,t,n){var a,r;const o=Object.keys(t).filter(c=>!e.hasValue(c)),s=o.length;if(s)for(let c=0;c<s;c++){const l=o[c],d=t[l];let u=null;Array.isArray(d)&&(u=d[0]),u===null&&(u=(r=(a=n[l])!==null&&a!==void 0?a:e.readValue(l))!==null&&r!==void 0?r:t[l]),u!=null&&(typeof u=="string"&&($b(u)||Gb(u))?u=parseFloat(u):!dq(u)&&$t.test(d)&&(u=Wb(l,d)),e.addValue(l,ga(u,{owner:e})),n[l]===void 0&&(n[l]=u),u!==null&&e.setBaseTarget(l,u))}}function pq(e,t){return t?(t[e]||t.default||t).from:void 0}function kq(e,t,n){const a={};for(const r in e){const o=pq(r,t);if(o!==void 0)a[r]=o;else{const s=n.getValue(r);s&&(a[r]=s.get())}}return a}function fq({protectedKeys:e,needsAnimating:t},n){const a=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,a}function mq(e,t){const n=e.get();if(Array.isArray(t)){for(let a=0;a<t.length;a++)if(t[a]!==n)return!0}else return n!==t}function Qb(e,t,{delay:n=0,transitionOverride:a,type:r}={}){let{transition:o=e.getDefaultTransition(),transitionEnd:s,...c}=e.makeTargetAnimatable(t);const l=e.getValue("willChange");a&&(o=a);const d=[],u=r&&e.animationState&&e.animationState.getState()[r];for(const y in c){const p=e.getValue(y),m=c[y];if(!p||m===void 0||u&&fq(u,y))continue;const v={delay:n,elapsed:0,...mC(o||{},y)};if(window.HandoffAppearAnimations){const g=e.getProps()[YP];if(g){const k=window.HandoffAppearAnimations(g,y,p,E);k!==null&&(v.elapsed=k,v.isHandoff=!0)}}let x=!v.isHandoff&&!mq(p,m);if(v.type==="spring"&&(p.getVelocity()||v.velocity)&&(x=!1),p.animation&&(x=!1),x)continue;p.start(gC(y,p,m,e.shouldReduceMotion&&V1.has(y)?{type:!1}:v));const I=p.animation;NM(l)&&(l.add(y),I.then(()=>l.remove(y))),d.push(I)}return s&&Promise.all(d).then(()=>{s&&uq(e,s)}),d}function Yw(e,t,n={}){const a=h9(e,t,n.custom);let{transition:r=e.getDefaultTransition()||{}}=a||{};n.transitionOverride&&(r=n.transitionOverride);const o=a?()=>Promise.all(Qb(e,a,n)):()=>Promise.resolve(),s=e.variantChildren&&e.variantChildren.size?(l=0)=>{const{delayChildren:d=0,staggerChildren:u,staggerDirection:y}=r;return gq(e,t,d+l,u,y,n)}:()=>Promise.resolve(),{when:c}=r;if(c){const[l,d]=c==="beforeChildren"?[o,s]:[s,o];return l().then(()=>d())}else return Promise.all([o(),s(n.delay)])}function gq(e,t,n=0,a=0,r=1,o){const s=[],c=(e.variantChildren.size-1)*a,l=r===1?(d=0)=>d*a:(d=0)=>c-d*a;return Array.from(e.variantChildren).sort(vq).forEach((d,u)=>{d.notify("AnimationStart",t),s.push(Yw(d,t,{...o,delay:n+l(u)}).then(()=>d.notify("AnimationComplete",t)))}),Promise.all(s)}function vq(e,t){return e.sortNodePosition(t)}function xq(e,t,n={}){e.notify("AnimationStart",t);let a;if(Array.isArray(t)){const r=t.map(o=>Yw(e,o,n));a=Promise.all(r)}else if(typeof t=="string")a=Yw(e,t,n);else{const r=typeof t=="function"?h9(e,t,n.custom):t;a=Promise.all(Qb(e,r,n))}return a.then(()=>e.notify("AnimationComplete",t))}const Mq=[...nC].reverse(),wq=nC.length;function Lq(e){return t=>Promise.all(t.map(({animation:n,options:a})=>xq(e,n,a)))}function Cq(e){let t=Lq(e);const n=Iq();let a=!0;const r=(l,d)=>{const u=h9(e,d);if(u){const{transition:y,transitionEnd:p,...m}=u;l={...l,...m,...p}}return l};function o(l){t=l(e)}function s(l,d){const u=e.getProps(),y=e.getVariantContext(!0)||{},p=[],m=new Set;let v={},x=1/0;for(let g=0;g<wq;g++){const k=Mq[g],f=n[k],M=u[k]!==void 0?u[k]:y[k],w=ji(M),j=k===d?f.isActive:null;j===!1&&(x=g);let P=M===y[k]&&M!==u[k]&&w;if(P&&a&&e.manuallyAnimateOnMount&&(P=!1),f.protectedKeys={...v},!f.isActive&&j===null||!M&&!f.prevProp||s9(M)||typeof M=="boolean")continue;let z=Sq(f.prevProp,M)||k===d&&f.isActive&&!P&&w||g>x&&w,H=!1;const re=Array.isArray(M)?M:[M];let le=re.reduce(r,{});j===!1&&(le={});const{prevResolvedValues:ge={}}=f,oe={...ge,...le},St=Y=>{z=!0,m.has(Y)&&(H=!0,m.delete(Y)),f.needsAnimating[Y]=!0};for(const Y in oe){const Re=le[Y],b=ge[Y];if(v.hasOwnProperty(Y))continue;let T=!1;DM(Re)&&DM(b)?T=!xb(Re,b):T=Re!==b,T?Re!==void 0?St(Y):m.add(Y):Re!==void 0&&m.has(Y)?St(Y):f.protectedKeys[Y]=!0}f.prevProp=M,f.prevResolvedValues=le,f.isActive&&(v={...v,...le}),a&&e.blockInitialAnimation&&(z=!1),z&&(!P||H)&&p.push(...re.map(Y=>({animation:Y,options:{type:k,...l}})))}if(m.size){const g={};m.forEach(k=>{const f=e.getBaseTarget(k);f!==void 0&&(g[k]=f)}),p.push({animation:g})}let I=!!p.length;return a&&(u.initial===!1||u.initial===u.animate)&&!e.manuallyAnimateOnMount&&(I=!1),a=!1,I?t(p):Promise.resolve()}function c(l,d,u){var y;if(n[l].isActive===d)return Promise.resolve();(y=e.variantChildren)===null||y===void 0||y.forEach(m=>{var v;return(v=m.animationState)===null||v===void 0?void 0:v.setActive(l,d)}),n[l].isActive=d;const p=s(u,l);for(const m in n)n[m].protectedKeys={};return p}return{animateChanges:s,setActive:c,setAnimateFunction:o,getState:()=>n}}function Sq(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!xb(t,e):!1}function nn(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Iq(){return{animate:nn(!0),whileInView:nn(),whileHover:nn(),whileTap:nn(),whileDrag:nn(),whileFocus:nn(),exit:nn()}}class jq extends Yt{constructor(t){super(t),t.animationState||(t.animationState=Cq(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();this.unmount(),s9(t)&&(this.unmount=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){}}let Pq=0;class bq extends Yt{constructor(){super(...arguments),this.id=Pq++}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n,custom:a}=this.node.presenceContext,{isPresent:r}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===r)return;const o=this.node.animationState.setActive("exit",!t,{custom:a??this.node.getProps().custom});n&&!t&&o.then(()=>n(this.id))}mount(){const{register:t}=this.node.presenceContext||{};t&&(this.unmount=t(this.id))}unmount(){}}const Aq={animation:{Feature:jq},exit:{Feature:bq}},GS=(e,t)=>Math.abs(e-t);function zq(e,t){const n=GS(e.x,t.x),a=GS(e.y,t.y);return Math.sqrt(n**2+a**2)}class Yb{constructor(t,n,{transformPagePoint:a,contextWindow:r,dragSnapToOrigin:o=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const y=$9(this.lastMoveEventInfo,this.history),p=this.startEvent!==null,m=zq(y.offset,{x:0,y:0})>=3;if(!p&&!m)return;const{point:v}=y,{timestamp:x}=ke;this.history.push({...v,timestamp:x});const{onStart:I,onMove:g}=this.handlers;p||(I&&I(this.lastMoveEvent,y),this.startEvent=this.lastMoveEvent),g&&g(this.lastMoveEvent,y)},this.handlePointerMove=(y,p)=>{this.lastMoveEvent=y,this.lastMoveEventInfo=G9(p,this.transformPagePoint),E.update(this.updatePoint,!0)},this.handlePointerUp=(y,p)=>{this.end();const{onEnd:m,onSessionEnd:v,resumeAnimation:x}=this.handlers;if(this.dragSnapToOrigin&&x&&x(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const I=$9(y.type==="pointercancel"?this.lastMoveEventInfo:G9(p,this.transformPagePoint),this.history);this.startEvent&&m&&m(y,I),v&&v(y,I)},!kb(t))return;this.dragSnapToOrigin=o,this.handlers=n,this.transformPagePoint=a,this.contextWindow=r||window;const s=d9(t),c=G9(s,this.transformPagePoint),{point:l}=c,{timestamp:d}=ke;this.history=[{...l,timestamp:d}];const{onSessionStart:u}=n;u&&u(t,$9(c,this.history)),this.removeListeners=Zt(mt(this.contextWindow,"pointermove",this.handlePointerMove),mt(this.contextWindow,"pointerup",this.handlePointerUp),mt(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),Lt(this.updatePoint)}}function G9(e,t){return t?{point:t(e.point)}:e}function $S(e,t){return{x:e.x-t.x,y:e.y-t.y}}function $9({point:e},t){return{point:e,delta:$S(e,Jb(t)),offset:$S(e,Vq(t)),velocity:Hq(t,.1)}}function Vq(e){return e[0]}function Jb(e){return e[e.length-1]}function Hq(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,a=null;const r=Jb(e);for(;n>=0&&(a=e[n],!(r.timestamp-a.timestamp>L1(t)));)n--;if(!a)return{x:0,y:0};const o=gt(r.timestamp-a.timestamp);if(o===0)return{x:0,y:0};const s={x:(r.x-a.x)/o,y:(r.y-a.y)/o};return s.x===1/0&&(s.x=0),s.y===1/0&&(s.y=0),s}function qe(e){return e.max-e.min}function Jw(e,t=0,n=.01){return Math.abs(e-t)<=n}function XS(e,t,n,a=.5){e.origin=a,e.originPoint=$(t.min,t.max,e.origin),e.scale=qe(n)/qe(t),(Jw(e.scale,1,1e-4)||isNaN(e.scale))&&(e.scale=1),e.translate=$(n.min,n.max,e.origin)-e.originPoint,(Jw(e.translate)||isNaN(e.translate))&&(e.translate=0)}function ci(e,t,n,a){XS(e.x,t.x,n.x,a?a.originX:void 0),XS(e.y,t.y,n.y,a?a.originY:void 0)}function KS(e,t,n){e.min=n.min+t.min,e.max=e.min+qe(t)}function Tq(e,t,n){KS(e.x,t.x,n.x),KS(e.y,t.y,n.y)}function QS(e,t,n){e.min=t.min-n.min,e.max=e.min+qe(t)}function li(e,t,n){QS(e.x,t.x,n.x),QS(e.y,t.y,n.y)}function qq(e,{min:t,max:n},a){return t!==void 0&&e<t?e=a?$(t,e,a.min):Math.max(e,t):n!==void 0&&e>n&&(e=a?$(n,e,a.max):Math.min(e,n)),e}function YS(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function Dq(e,{top:t,left:n,bottom:a,right:r}){return{x:YS(e.x,n,r),y:YS(e.y,t,a)}}function JS(e,t){let n=t.min-e.min,a=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,a]=[a,n]),{min:n,max:a}}function Fq(e,t){return{x:JS(e.x,t.x),y:JS(e.y,t.y)}}function Rq(e,t){let n=.5;const a=qe(e),r=qe(t);return r>a?n=bi(t.min,t.max-a,e.min):a>r&&(n=bi(e.min,e.max-r,t.min)),Gt(0,1,n)}function Bq(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const eL=.35;function Nq(e=eL){return e===!1?e=0:e===!0&&(e=eL),{x:eI(e,"left","right"),y:eI(e,"top","bottom")}}function eI(e,t,n){return{min:tI(e,t),max:tI(e,n)}}function tI(e,t){return typeof e=="number"?e:e[t]||0}const nI=()=>({translate:0,scale:1,origin:0,originPoint:0}),K1=()=>({x:nI(),y:nI()}),aI=()=>({min:0,max:0}),te=()=>({x:aI(),y:aI()});function Ne(e){return[e("x"),e("y")]}function eA({top:e,left:t,right:n,bottom:a}){return{x:{min:t,max:n},y:{min:e,max:a}}}function Eq({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function Oq(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),a=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:a.y,right:a.x}}function X9(e){return e===void 0||e===1}function tL({scale:e,scaleX:t,scaleY:n}){return!X9(e)||!X9(t)||!X9(n)}function c1(e){return tL(e)||tA(e)||e.z||e.rotate||e.rotateX||e.rotateY}function tA(e){return iI(e.x)||iI(e.y)}function iI(e){return e&&e!=="0%"}function EM(e,t,n){const a=e-n,r=t*a;return n+r}function rI(e,t,n,a,r){return r!==void 0&&(e=EM(e,r,a)),EM(e,n,a)+t}function nL(e,t=0,n=1,a,r){e.min=rI(e.min,t,n,a,r),e.max=rI(e.max,t,n,a,r)}function nA(e,{x:t,y:n}){nL(e.x,t.translate,t.scale,t.originPoint),nL(e.y,n.translate,n.scale,n.originPoint)}function Uq(e,t,n,a=!1){const r=n.length;if(!r)return;t.x=t.y=1;let o,s;for(let c=0;c<r;c++){o=n[c],s=o.projectionDelta;const l=o.instance;l&&l.style&&l.style.display==="contents"||(a&&o.options.layoutScroll&&o.scroll&&o!==o.root&&Q1(e,{x:-o.scroll.offset.x,y:-o.scroll.offset.y}),s&&(t.x*=s.x.scale,t.y*=s.y.scale,nA(e,s)),a&&c1(o.latestValues)&&Q1(e,o.latestValues))}t.x=oI(t.x),t.y=oI(t.y)}function oI(e){return Number.isInteger(e)||e>1.0000000000001||e<.999999999999?e:1}function At(e,t){e.min=e.min+t,e.max=e.max+t}function sI(e,t,[n,a,r]){const o=t[r]!==void 0?t[r]:.5,s=$(e.min,e.max,o);nL(e,t[n],t[a],s,t.scale)}const Zq=["x","scaleX","originX"],_q=["y","scaleY","originY"];function Q1(e,t){sI(e.x,t,Zq),sI(e.y,t,_q)}function aA(e,t){return eA(Oq(e.getBoundingClientRect(),t))}function Wq(e,t,n){const a=aA(e,n),{scroll:r}=t;return r&&(At(a.x,r.offset.x),At(a.y,r.offset.y)),a}const iA=({current:e})=>e?e.ownerDocument.defaultView:null,Gq=new WeakMap;class $q{constructor(t){this.openGlobalLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=te(),this.visualElement=t}start(t,{snapToCursor:n=!1}={}){const{presenceContext:a}=this.visualElement;if(a&&a.isPresent===!1)return;const r=u=>{const{dragSnapToOrigin:y}=this.getProps();y?this.pauseAnimation():this.stopAnimation(),n&&this.snapToCursor(d9(u,"page").point)},o=(u,y)=>{const{drag:p,dragPropagation:m,onDragStart:v}=this.getProps();if(p&&!m&&(this.openGlobalLock&&this.openGlobalLock(),this.openGlobalLock=mb(p),!this.openGlobalLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Ne(I=>{let g=this.getAxisMotionValue(I).get()||0;if(dt.test(g)){const{projection:k}=this.visualElement;if(k&&k.layout){const f=k.layout.layoutBox[I];f&&(g=qe(f)*(parseFloat(g)/100))}}this.originPoint[I]=g}),v&&E.update(()=>v(u,y),!1,!0);const{animationState:x}=this.visualElement;x&&x.setActive("whileDrag",!0)},s=(u,y)=>{const{dragPropagation:p,dragDirectionLock:m,onDirectionLock:v,onDrag:x}=this.getProps();if(!p&&!this.openGlobalLock)return;const{offset:I}=y;if(m&&this.currentDirection===null){this.currentDirection=Xq(I),this.currentDirection!==null&&v&&v(this.currentDirection);return}this.updateAxis("x",y.point,I),this.updateAxis("y",y.point,I),this.visualElement.render(),x&&x(u,y)},c=(u,y)=>this.stop(u,y),l=()=>Ne(u=>{var y;return this.getAnimationState(u)==="paused"&&((y=this.getAxisMotionValue(u).animation)===null||y===void 0?void 0:y.play())}),{dragSnapToOrigin:d}=this.getProps();this.panSession=new Yb(t,{onSessionStart:r,onStart:o,onMove:s,onSessionEnd:c,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:d,contextWindow:iA(this.visualElement)})}stop(t,n){const a=this.isDragging;if(this.cancel(),!a)return;const{velocity:r}=n;this.startAnimation(r);const{onDragEnd:o}=this.getProps();o&&E.update(()=>o(t,n))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:a}=this.getProps();!a&&this.openGlobalLock&&(this.openGlobalLock(),this.openGlobalLock=null),n&&n.setActive("whileDrag",!1)}updateAxis(t,n,a){const{drag:r}=this.getProps();if(!a||!or(t,r,this.currentDirection))return;const o=this.getAxisMotionValue(t);let s=this.originPoint[t]+a[t];this.constraints&&this.constraints[t]&&(s=qq(s,this.constraints[t],this.elastic[t])),o.set(s)}resolveConstraints(){var t;const{dragConstraints:n,dragElastic:a}=this.getProps(),r=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(t=this.visualElement.projection)===null||t===void 0?void 0:t.layout,o=this.constraints;n&&$1(n)?this.constraints||(this.constraints=this.resolveRefConstraints()):n&&r?this.constraints=Dq(r.layoutBox,n):this.constraints=!1,this.elastic=Nq(a),o!==this.constraints&&r&&this.constraints&&!this.hasMutatedConstraints&&Ne(s=>{this.getAxisMotionValue(s)&&(this.constraints[s]=Bq(r.layoutBox[s],this.constraints[s]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!$1(t))return!1;const a=t.current,{projection:r}=this.visualElement;if(!r||!r.layout)return!1;const o=Wq(a,r.root,this.visualElement.getTransformPagePoint());let s=Fq(r.layout.layoutBox,o);if(n){const c=n(Eq(s));this.hasMutatedConstraints=!!c,c&&(s=eA(c))}return s}startAnimation(t){const{drag:n,dragMomentum:a,dragElastic:r,dragTransition:o,dragSnapToOrigin:s,onDragTransitionEnd:c}=this.getProps(),l=this.constraints||{},d=Ne(u=>{if(!or(u,n,this.currentDirection))return;let y=l&&l[u]||{};s&&(y={min:0,max:0});const p=r?200:1e6,m=r?40:1e7,v={type:"inertia",velocity:a?t[u]:0,bounceStiffness:p,bounceDamping:m,timeConstant:750,restDelta:1,restSpeed:10,...o,...y};return this.startAxisValueAnimation(u,v)});return Promise.all(d).then(c)}startAxisValueAnimation(t,n){const a=this.getAxisMotionValue(t);return a.start(gC(t,a,0,n))}stopAnimation(){Ne(t=>this.getAxisMotionValue(t).stop())}pauseAnimation(){Ne(t=>{var n;return(n=this.getAxisMotionValue(t).animation)===null||n===void 0?void 0:n.pause()})}getAnimationState(t){var n;return(n=this.getAxisMotionValue(t).animation)===null||n===void 0?void 0:n.state}getAxisMotionValue(t){const n="_drag"+t.toUpperCase(),a=this.visualElement.getProps(),r=a[n];return r||this.visualElement.getValue(t,(a.initial?a.initial[t]:void 0)||0)}snapToCursor(t){Ne(n=>{const{drag:a}=this.getProps();if(!or(n,a,this.currentDirection))return;const{projection:r}=this.visualElement,o=this.getAxisMotionValue(n);if(r&&r.layout){const{min:s,max:c}=r.layout.layoutBox[n];o.set(t[n]-$(s,c,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:a}=this.visualElement;if(!$1(n)||!a||!this.constraints)return;this.stopAnimation();const r={x:0,y:0};Ne(s=>{const c=this.getAxisMotionValue(s);if(c){const l=c.get();r[s]=Rq({min:l,max:l},this.constraints[s])}});const{transformTemplate:o}=this.visualElement.getProps();this.visualElement.current.style.transform=o?o({},""):"none",a.root&&a.root.updateScroll(),a.updateLayout(),this.resolveConstraints(),Ne(s=>{if(!or(s,t,null))return;const c=this.getAxisMotionValue(s),{min:l,max:d}=this.constraints[s];c.set($(l,d,r[s]))})}addListeners(){if(!this.visualElement.current)return;Gq.set(this.visualElement,this);const t=this.visualElement.current,n=mt(t,"pointerdown",l=>{const{drag:d,dragListener:u=!0}=this.getProps();d&&u&&this.start(l)}),a=()=>{const{dragConstraints:l}=this.getProps();$1(l)&&(this.constraints=this.resolveRefConstraints())},{projection:r}=this.visualElement,o=r.addEventListener("measure",a);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),a();const s=kt(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",({delta:l,hasLayoutChanged:d})=>{this.isDragging&&d&&(Ne(u=>{const y=this.getAxisMotionValue(u);y&&(this.originPoint[u]+=l[u].translate,y.set(y.get()+l[u].translate))}),this.visualElement.render())});return()=>{s(),n(),o(),c&&c()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:a=!1,dragPropagation:r=!1,dragConstraints:o=!1,dragElastic:s=eL,dragMomentum:c=!0}=t;return{...t,drag:n,dragDirectionLock:a,dragPropagation:r,dragConstraints:o,dragElastic:s,dragMomentum:c}}}function or(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function Xq(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class Kq extends Yt{constructor(t){super(t),this.removeGroupControls=ee,this.removeListeners=ee,this.controls=new $q(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||ee}unmount(){this.removeGroupControls(),this.removeListeners()}}const cI=e=>(t,n)=>{e&&E.update(()=>e(t,n))};class Qq extends Yt{constructor(){super(...arguments),this.removePointerDownListener=ee}onPointerDown(t){this.session=new Yb(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:iA(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:a,onPanEnd:r}=this.node.getProps();return{onSessionStart:cI(t),onStart:cI(n),onMove:a,onEnd:(o,s)=>{delete this.session,r&&E.update(()=>r(o,s))}}}mount(){this.removePointerDownListener=mt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}function Yq(){const e=L.useContext(r9);if(e===null)return[!0,null];const{isPresent:t,onExitComplete:n,register:a}=e,r=L.useId();return L.useEffect(()=>a(r),[]),!t&&n?[!1,()=>n&&n(r)]:[!0]}const lM={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function lI(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const Va={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if(V.test(e))e=parseFloat(e);else return e;const n=lI(e,t.target.x),a=lI(e,t.target.y);return`${n}% ${a}%`}},Jq={correct:(e,{treeScale:t,projectionDelta:n})=>{const a=e,r=$t.parse(e);if(r.length>5)return a;const o=$t.createTransformer(e),s=typeof r[0]!="number"?1:0,c=n.x.scale*t.x,l=n.y.scale*t.y;r[0+s]/=c,r[1+s]/=l;const d=$(c,l,.5);return typeof r[2+s]=="number"&&(r[2+s]/=d),typeof r[3+s]=="number"&&(r[3+s]/=d),o(r)}};class eD extends lL.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:a,layoutId:r}=this.props,{projection:o}=t;sH(tD),o&&(n.group&&n.group.add(o),a&&a.register&&r&&a.register(o),o.root.didUpdate(),o.addEventListener("animationComplete",()=>{this.safeToRemove()}),o.setOptions({...o.options,onExitComplete:()=>this.safeToRemove()})),lM.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:a,drag:r,isPresent:o}=this.props,s=a.projection;return s&&(s.isPresent=o,r||t.layoutDependency!==n||n===void 0?s.willUpdate():this.safeToRemove(),t.isPresent!==o&&(o?s.promote():s.relegate()||E.postRender(()=>{const c=s.getStack();(!c||!c.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:t}=this.props.visualElement;t&&(t.root.didUpdate(),queueMicrotask(()=>{!t.currentAnimation&&t.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:a}=this.props,{projection:r}=t;r&&(r.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(r),a&&a.deregister&&a.deregister(r))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function rA(e){const[t,n]=Yq(),a=L.useContext(iC);return lL.createElement(eD,{...e,layoutGroup:a,switchLayoutGroup:L.useContext(eb),isPresent:t,safeToRemove:n})}const tD={borderRadius:{...Va,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Va,borderTopRightRadius:Va,borderBottomLeftRadius:Va,borderBottomRightRadius:Va,boxShadow:Jq},oA=["TopLeft","TopRight","BottomLeft","BottomRight"],nD=oA.length,dI=e=>typeof e=="string"?parseFloat(e):e,hI=e=>typeof e=="number"||V.test(e);function aD(e,t,n,a,r,o){r?(e.opacity=$(0,n.opacity!==void 0?n.opacity:1,iD(a)),e.opacityExit=$(t.opacity!==void 0?t.opacity:1,0,rD(a))):o&&(e.opacity=$(t.opacity!==void 0?t.opacity:1,n.opacity!==void 0?n.opacity:1,a));for(let s=0;s<nD;s++){const c=`border${oA[s]}Radius`;let l=uI(t,c),d=uI(n,c);if(l===void 0&&d===void 0)continue;l||(l=0),d||(d=0),l===0||d===0||hI(l)===hI(d)?(e[c]=Math.max($(dI(l),dI(d),a),0),(dt.test(d)||dt.test(l))&&(e[c]+="%")):e[c]=d}(t.rotate||n.rotate)&&(e.rotate=$(t.rotate||0,n.rotate||0,a))}function uI(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const iD=sA(0,.5,bb),rD=sA(.5,.95,ee);function sA(e,t,n){return a=>a<e?0:a>t?1:n(bi(e,t,a))}function yI(e,t){e.min=t.min,e.max=t.max}function Be(e,t){yI(e.x,t.x),yI(e.y,t.y)}function pI(e,t,n,a,r){return e-=t,e=EM(e,1/n,a),r!==void 0&&(e=EM(e,1/r,a)),e}function oD(e,t=0,n=1,a=.5,r,o=e,s=e){if(dt.test(t)&&(t=parseFloat(t),t=$(s.min,s.max,t/100)-s.min),typeof t!="number")return;let c=$(o.min,o.max,a);e===o&&(c-=t),e.min=pI(e.min,t,n,c,r),e.max=pI(e.max,t,n,c,r)}function kI(e,t,[n,a,r],o,s){oD(e,t[n],t[a],t[r],t.scale,o,s)}const sD=["x","scaleX","originX"],cD=["y","scaleY","originY"];function fI(e,t,n,a){kI(e.x,t,sD,n?n.x:void 0,a?a.x:void 0),kI(e.y,t,cD,n?n.y:void 0,a?a.y:void 0)}function mI(e){return e.translate===0&&e.scale===1}function cA(e){return mI(e.x)&&mI(e.y)}function lD(e,t){return e.x.min===t.x.min&&e.x.max===t.x.max&&e.y.min===t.y.min&&e.y.max===t.y.max}function lA(e,t){return Math.round(e.x.min)===Math.round(t.x.min)&&Math.round(e.x.max)===Math.round(t.x.max)&&Math.round(e.y.min)===Math.round(t.y.min)&&Math.round(e.y.max)===Math.round(t.y.max)}function gI(e){return qe(e.x)/qe(e.y)}class dD{constructor(){this.members=[]}add(t){vC(this.members,t),t.scheduleRender()}remove(t){if(xC(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){const n=this.members.findIndex(r=>t===r);if(n===0)return!1;let a;for(let r=n;r>=0;r--){const o=this.members[r];if(o.isPresent!==!1){a=o;break}}return a?(this.promote(a),!0):!1}promote(t,n){const a=this.lead;if(t!==a&&(this.prevLead=a,this.lead=t,t.show(),a)){a.instance&&a.scheduleRender(),t.scheduleRender(),t.resumeFrom=a,n&&(t.resumeFrom.preserveOpacity=!0),a.snapshot&&(t.snapshot=a.snapshot,t.snapshot.latestValues=a.animationValues||a.latestValues),t.root&&t.root.isUpdating&&(t.isLayoutDirty=!0);const{crossfade:r}=t.options;r===!1&&a.hide()}}exitAnimationComplete(){this.members.forEach(t=>{const{options:n,resumingFrom:a}=t;n.onExitComplete&&n.onExitComplete(),a&&a.options.onExitComplete&&a.options.onExitComplete()})}scheduleRender(){this.members.forEach(t=>{t.instance&&t.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function vI(e,t,n){let a="";const r=e.x.translate/t.x,o=e.y.translate/t.y;if((r||o)&&(a=`translate3d(${r}px, ${o}px, 0) `),(t.x!==1||t.y!==1)&&(a+=`scale(${1/t.x}, ${1/t.y}) `),n){const{rotate:l,rotateX:d,rotateY:u}=n;l&&(a+=`rotate(${l}deg) `),d&&(a+=`rotateX(${d}deg) `),u&&(a+=`rotateY(${u}deg) `)}const s=e.x.scale*t.x,c=e.y.scale*t.y;return(s!==1||c!==1)&&(a+=`scale(${s}, ${c})`),a||"none"}const hD=(e,t)=>e.depth-t.depth;class uD{constructor(){this.children=[],this.isDirty=!1}add(t){vC(this.children,t),this.isDirty=!0}remove(t){xC(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(hD),this.isDirty=!1,this.children.forEach(t)}}function yD(e,t){const n=performance.now(),a=({timestamp:r})=>{const o=r-n;o>=t&&(Lt(a),e(o-t))};return E.read(a,!0),()=>Lt(a)}function pD(e){window.MotionDebug&&window.MotionDebug.record(e)}function kD(e){return e instanceof SVGElement&&e.tagName!=="svg"}function fD(e,t,n){const a=be(e)?e:ga(e);return a.start(gC("",a,t,n)),a.animation}const xI=["","X","Y","Z"],mD={visibility:"hidden"},MI=1e3;let gD=0;const l1={type:"projectionFrame",totalNodes:0,resolvedTargetDeltas:0,recalculatedProjection:0};function dA({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:a,resetTransform:r}){return class{constructor(s={},c=t==null?void 0:t()){this.id=gD++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,l1.totalNodes=l1.resolvedTargetDeltas=l1.recalculatedProjection=0,this.nodes.forEach(MD),this.nodes.forEach(ID),this.nodes.forEach(jD),this.nodes.forEach(wD),pD(l1)},this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=s,this.root=c?c.root||c:this,this.path=c?[...c.path,c]:[],this.parent=c,this.depth=c?c.depth+1:0;for(let l=0;l<this.path.length;l++)this.path[l].shouldResetTransform=!0;this.root===this&&(this.nodes=new uD)}addEventListener(s,c){return this.eventHandlers.has(s)||this.eventHandlers.set(s,new MC),this.eventHandlers.get(s).add(c)}notifyListeners(s,...c){const l=this.eventHandlers.get(s);l&&l.notify(...c)}hasListeners(s){return this.eventHandlers.has(s)}mount(s,c=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=kD(s),this.instance=s;const{layoutId:l,layout:d,visualElement:u}=this.options;if(u&&!u.current&&u.mount(s),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),c&&(d||l)&&(this.isLayoutDirty=!0),e){let y;const p=()=>this.root.updateBlockedByResize=!1;e(s,()=>{this.root.updateBlockedByResize=!0,y&&y(),y=yD(p,250),lM.hasAnimatedSinceResize&&(lM.hasAnimatedSinceResize=!1,this.nodes.forEach(LI))})}l&&this.root.registerSharedNode(l,this),this.options.animate!==!1&&u&&(l||d)&&this.addEventListener("didUpdate",({delta:y,hasLayoutChanged:p,hasRelativeTargetChanged:m,layout:v})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const x=this.options.transition||u.getDefaultTransition()||VD,{onLayoutAnimationStart:I,onLayoutAnimationComplete:g}=u.getProps(),k=!this.targetLayout||!lA(this.targetLayout,v)||m,f=!p&&m;if(this.options.layoutRoot||this.resumeFrom&&this.resumeFrom.instance||f||p&&(k||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(y,f);const M={...mC(x,"layout"),onPlay:I,onComplete:g};(u.shouldReduceMotion||this.options.layoutRoot)&&(M.delay=0,M.type=!1),this.startAnimation(M)}else p||LI(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=v})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const s=this.getStack();s&&s.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,Lt(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(PD),this.animationId++)}getTransformTemplate(){const{visualElement:s}=this.options;return s&&s.getProps().transformTemplate}willUpdate(s=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const y=this.path[u];y.shouldResetTransform=!0,y.updateScroll("snapshot"),y.options.layoutRoot&&y.willUpdate(!1)}const{layoutId:c,layout:l}=this.options;if(c===void 0&&!l)return;const d=this.getTransformTemplate();this.prevTransformTemplateValue=d?d(this.latestValues,""):void 0,this.updateSnapshot(),s&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(wI);return}this.isUpdating||this.nodes.forEach(CD),this.isUpdating=!1,this.nodes.forEach(SD),this.nodes.forEach(vD),this.nodes.forEach(xD),this.clearAllSnapshots();const c=performance.now();ke.delta=Gt(0,1e3/60,c-ke.timestamp),ke.timestamp=c,ke.isProcessing=!0,B9.update.process(ke),B9.preRender.process(ke),B9.render.process(ke),ke.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,queueMicrotask(()=>this.update()))}clearAllSnapshots(){this.nodes.forEach(LD),this.sharedNodes.forEach(bD)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,E.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){E.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure())}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let l=0;l<this.path.length;l++)this.path[l].updateScroll();const s=this.layout;this.layout=this.measure(!1),this.layoutCorrected=te(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:c}=this.options;c&&c.notify("LayoutMeasure",this.layout.layoutBox,s?s.layoutBox:void 0)}updateScroll(s="measure"){let c=!!(this.options.layoutScroll&&this.instance);this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===s&&(c=!1),c&&(this.scroll={animationId:this.root.animationId,phase:s,isRoot:a(this.instance),offset:n(this.instance)})}resetTransform(){if(!r)return;const s=this.isLayoutDirty||this.shouldResetTransform,c=this.projectionDelta&&!cA(this.projectionDelta),l=this.getTransformTemplate(),d=l?l(this.latestValues,""):void 0,u=d!==this.prevTransformTemplateValue;s&&(c||c1(this.latestValues)||u)&&(r(this.instance,d),this.shouldResetTransform=!1,this.scheduleRender())}measure(s=!0){const c=this.measurePageBox();let l=this.removeElementScroll(c);return s&&(l=this.removeTransform(l)),HD(l),{animationId:this.root.animationId,measuredBox:c,layoutBox:l,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:s}=this.options;if(!s)return te();const c=s.measureViewportBox(),{scroll:l}=this.root;return l&&(At(c.x,l.offset.x),At(c.y,l.offset.y)),c}removeElementScroll(s){const c=te();Be(c,s);for(let l=0;l<this.path.length;l++){const d=this.path[l],{scroll:u,options:y}=d;if(d!==this.root&&u&&y.layoutScroll){if(u.isRoot){Be(c,s);const{scroll:p}=this.root;p&&(At(c.x,-p.offset.x),At(c.y,-p.offset.y))}At(c.x,u.offset.x),At(c.y,u.offset.y)}}return c}applyTransform(s,c=!1){const l=te();Be(l,s);for(let d=0;d<this.path.length;d++){const u=this.path[d];!c&&u.options.layoutScroll&&u.scroll&&u!==u.root&&Q1(l,{x:-u.scroll.offset.x,y:-u.scroll.offset.y}),c1(u.latestValues)&&Q1(l,u.latestValues)}return c1(this.latestValues)&&Q1(l,this.latestValues),l}removeTransform(s){const c=te();Be(c,s);for(let l=0;l<this.path.length;l++){const d=this.path[l];if(!d.instance||!c1(d.latestValues))continue;tL(d.latestValues)&&d.updateSnapshot();const u=te(),y=d.measurePageBox();Be(u,y),fI(c,d.latestValues,d.snapshot?d.snapshot.layoutBox:void 0,u)}return c1(this.latestValues)&&fI(c,this.latestValues),c}setTargetDelta(s){this.targetDelta=s,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(s){this.options={...this.options,...s,crossfade:s.crossfade!==void 0?s.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==ke.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(s=!1){var c;const l=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=l.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=l.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=l.isSharedProjectionDirty);const d=!!this.resumingFrom||this!==l;if(!(s||d&&this.isSharedProjectionDirty||this.isProjectionDirty||!((c=this.parent)===null||c===void 0)&&c.isProjectionDirty||this.attemptToResolveRelativeTarget))return;const{layout:y,layoutId:p}=this.options;if(!(!this.layout||!(y||p))){if(this.resolvedRelativeTargetAt=ke.timestamp,!this.targetDelta&&!this.relativeTarget){const m=this.getClosestProjectingParent();m&&m.layout&&this.animationProgress!==1?(this.relativeParent=m,this.forceRelativeParentToResolveTarget(),this.relativeTarget=te(),this.relativeTargetOrigin=te(),li(this.relativeTargetOrigin,this.layout.layoutBox,m.layout.layoutBox),Be(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)){if(this.target||(this.target=te(),this.targetWithTransforms=te()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Tq(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):Be(this.target,this.layout.layoutBox),nA(this.target,this.targetDelta)):Be(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget){this.attemptToResolveRelativeTarget=!1;const m=this.getClosestProjectingParent();m&&!!m.resumingFrom==!!this.resumingFrom&&!m.options.layoutScroll&&m.target&&this.animationProgress!==1?(this.relativeParent=m,this.forceRelativeParentToResolveTarget(),this.relativeTarget=te(),this.relativeTargetOrigin=te(),li(this.relativeTargetOrigin,this.target,m.target),Be(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}l1.resolvedTargetDeltas++}}}getClosestProjectingParent(){if(!(!this.parent||tL(this.parent.latestValues)||tA(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var s;const c=this.getLead(),l=!!this.resumingFrom||this!==c;let d=!0;if((this.isProjectionDirty||!((s=this.parent)===null||s===void 0)&&s.isProjectionDirty)&&(d=!1),l&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(d=!1),this.resolvedRelativeTargetAt===ke.timestamp&&(d=!1),d)return;const{layout:u,layoutId:y}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(u||y))return;Be(this.layoutCorrected,this.layout.layoutBox);const p=this.treeScale.x,m=this.treeScale.y;Uq(this.layoutCorrected,this.treeScale,this.path,l),c.layout&&!c.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(c.target=c.layout.layoutBox);const{target:v}=c;if(!v){this.projectionTransform&&(this.projectionDelta=K1(),this.projectionTransform="none",this.scheduleRender());return}this.projectionDelta||(this.projectionDelta=K1(),this.projectionDeltaWithTransform=K1());const x=this.projectionTransform;ci(this.projectionDelta,this.layoutCorrected,v,this.latestValues),this.projectionTransform=vI(this.projectionDelta,this.treeScale),(this.projectionTransform!==x||this.treeScale.x!==p||this.treeScale.y!==m)&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",v)),l1.recalculatedProjection++}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(s=!0){if(this.options.scheduleRender&&this.options.scheduleRender(),s){const c=this.getStack();c&&c.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}setAnimationOrigin(s,c=!1){const l=this.snapshot,d=l?l.latestValues:{},u={...this.latestValues},y=K1();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!c;const p=te(),m=l?l.source:void 0,v=this.layout?this.layout.source:void 0,x=m!==v,I=this.getStack(),g=!I||I.members.length<=1,k=!!(x&&!g&&this.options.crossfade===!0&&!this.path.some(zD));this.animationProgress=0;let f;this.mixTargetDelta=M=>{const w=M/1e3;CI(y.x,s.x,w),CI(y.y,s.y,w),this.setTargetDelta(y),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(li(p,this.layout.layoutBox,this.relativeParent.layout.layoutBox),AD(this.relativeTarget,this.relativeTargetOrigin,p,w),f&&lD(this.relativeTarget,f)&&(this.isProjectionDirty=!1),f||(f=te()),Be(f,this.relativeTarget)),x&&(this.animationValues=u,aD(u,d,this.latestValues,w,k,g)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=w},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(s){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(Lt(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=E.update(()=>{lM.hasAnimatedSinceResize=!0,this.currentAnimation=fD(0,MI,{...s,onUpdate:c=>{this.mixTargetDelta(c),s.onUpdate&&s.onUpdate(c)},onComplete:()=>{s.onComplete&&s.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const s=this.getStack();s&&s.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(MI),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const s=this.getLead();let{targetWithTransforms:c,target:l,layout:d,latestValues:u}=s;if(!(!c||!l||!d)){if(this!==s&&this.layout&&d&&hA(this.options.animationType,this.layout.layoutBox,d.layoutBox)){l=this.target||te();const y=qe(this.layout.layoutBox.x);l.x.min=s.target.x.min,l.x.max=l.x.min+y;const p=qe(this.layout.layoutBox.y);l.y.min=s.target.y.min,l.y.max=l.y.min+p}Be(c,l),Q1(c,u),ci(this.projectionDeltaWithTransform,this.layoutCorrected,c,u)}}registerSharedNode(s,c){this.sharedNodes.has(s)||this.sharedNodes.set(s,new dD),this.sharedNodes.get(s).add(c);const d=c.options.initialPromotionConfig;c.promote({transition:d?d.transition:void 0,preserveFollowOpacity:d&&d.shouldPreserveFollowOpacity?d.shouldPreserveFollowOpacity(c):void 0})}isLead(){const s=this.getStack();return s?s.lead===this:!0}getLead(){var s;const{layoutId:c}=this.options;return c?((s=this.getStack())===null||s===void 0?void 0:s.lead)||this:this}getPrevLead(){var s;const{layoutId:c}=this.options;return c?(s=this.getStack())===null||s===void 0?void 0:s.prevLead:void 0}getStack(){const{layoutId:s}=this.options;if(s)return this.root.sharedNodes.get(s)}promote({needsReset:s,transition:c,preserveFollowOpacity:l}={}){const d=this.getStack();d&&d.promote(this,l),s&&(this.projectionDelta=void 0,this.needsReset=!0),c&&this.setOptions({transition:c})}relegate(){const s=this.getStack();return s?s.relegate(this):!1}resetRotation(){const{visualElement:s}=this.options;if(!s)return;let c=!1;const{latestValues:l}=s;if((l.rotate||l.rotateX||l.rotateY||l.rotateZ)&&(c=!0),!c)return;const d={};for(let u=0;u<xI.length;u++){const y="rotate"+xI[u];l[y]&&(d[y]=l[y],s.setStaticValue(y,0))}s.render();for(const u in d)s.setStaticValue(u,d[u]);s.scheduleRender()}getProjectionStyles(s){var c,l;if(!this.instance||this.isSVG)return;if(!this.isVisible)return mD;const d={visibility:""},u=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,d.opacity="",d.pointerEvents=cM(s==null?void 0:s.pointerEvents)||"",d.transform=u?u(this.latestValues,""):"none",d;const y=this.getLead();if(!this.projectionDelta||!this.layout||!y.target){const x={};return this.options.layoutId&&(x.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,x.pointerEvents=cM(s==null?void 0:s.pointerEvents)||""),this.hasProjected&&!c1(this.latestValues)&&(x.transform=u?u({},""):"none",this.hasProjected=!1),x}const p=y.animationValues||y.latestValues;this.applyTransformsToTarget(),d.transform=vI(this.projectionDeltaWithTransform,this.treeScale,p),u&&(d.transform=u(p,d.transform));const{x:m,y:v}=this.projectionDelta;d.transformOrigin=`${m.origin*100}% ${v.origin*100}% 0`,y.animationValues?d.opacity=y===this?(l=(c=p.opacity)!==null&&c!==void 0?c:this.latestValues.opacity)!==null&&l!==void 0?l:1:this.preserveOpacity?this.latestValues.opacity:p.opacityExit:d.opacity=y===this?p.opacity!==void 0?p.opacity:"":p.opacityExit!==void 0?p.opacityExit:0;for(const x in TM){if(p[x]===void 0)continue;const{correct:I,applyTo:g}=TM[x],k=d.transform==="none"?p[x]:I(p[x],y);if(g){const f=g.length;for(let M=0;M<f;M++)d[g[M]]=k}else d[x]=k}return this.options.layoutId&&(d.pointerEvents=y===this?cM(s==null?void 0:s.pointerEvents)||"":"none"),d}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(s=>{var c;return(c=s.currentAnimation)===null||c===void 0?void 0:c.stop()}),this.root.nodes.forEach(wI),this.root.sharedNodes.clear()}}}function vD(e){e.updateLayout()}function xD(e){var t;const n=((t=e.resumeFrom)===null||t===void 0?void 0:t.snapshot)||e.snapshot;if(e.isLead()&&e.layout&&n&&e.hasListeners("didUpdate")){const{layoutBox:a,measuredBox:r}=e.layout,{animationType:o}=e.options,s=n.source!==e.layout.source;o==="size"?Ne(y=>{const p=s?n.measuredBox[y]:n.layoutBox[y],m=qe(p);p.min=a[y].min,p.max=p.min+m}):hA(o,n.layoutBox,a)&&Ne(y=>{const p=s?n.measuredBox[y]:n.layoutBox[y],m=qe(a[y]);p.max=p.min+m,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[y].max=e.relativeTarget[y].min+m)});const c=K1();ci(c,a,n.layoutBox);const l=K1();s?ci(l,e.applyTransform(r,!0),n.measuredBox):ci(l,a,n.layoutBox);const d=!cA(c);let u=!1;if(!e.resumeFrom){const y=e.getClosestProjectingParent();if(y&&!y.resumeFrom){const{snapshot:p,layout:m}=y;if(p&&m){const v=te();li(v,n.layoutBox,p.layoutBox);const x=te();li(x,a,m.layoutBox),lA(v,x)||(u=!0),y.options.layoutRoot&&(e.relativeTarget=x,e.relativeTargetOrigin=v,e.relativeParent=y)}}}e.notifyListeners("didUpdate",{layout:a,snapshot:n,delta:l,layoutDelta:c,hasLayoutChanged:d,hasRelativeTargetChanged:u})}else if(e.isLead()){const{onExitComplete:a}=e.options;a&&a()}e.options.transition=void 0}function MD(e){l1.totalNodes++,e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function wD(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function LD(e){e.clearSnapshot()}function wI(e){e.clearMeasurements()}function CD(e){e.isLayoutDirty=!1}function SD(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function LI(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function ID(e){e.resolveTargetDelta()}function jD(e){e.calcProjection()}function PD(e){e.resetRotation()}function bD(e){e.removeLeadSnapshot()}function CI(e,t,n){e.translate=$(t.translate,0,n),e.scale=$(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function SI(e,t,n,a){e.min=$(t.min,n.min,a),e.max=$(t.max,n.max,a)}function AD(e,t,n,a){SI(e.x,t.x,n.x,a),SI(e.y,t.y,n.y,a)}function zD(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const VD={duration:.45,ease:[.4,0,.1,1]},II=e=>typeof navigator<"u"&&navigator.userAgent.toLowerCase().includes(e),jI=II("applewebkit/")&&!II("chrome/")?Math.round:ee;function PI(e){e.min=jI(e.min),e.max=jI(e.max)}function HD(e){PI(e.x),PI(e.y)}function hA(e,t,n){return e==="position"||e==="preserve-aspect"&&!Jw(gI(t),gI(n),.2)}const TD=dA({attachResizeListener:(e,t)=>kt(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),K9={current:void 0},uA=dA({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!K9.current){const e=new TD({});e.mount(window),e.setOptions({layoutScroll:!0}),K9.current=e}return K9.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),qD={pan:{Feature:Qq},drag:{Feature:Kq,ProjectionNode:uA,MeasureLayout:rA}},DD=/var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;function FD(e){const t=DD.exec(e);if(!t)return[,];const[,n,a]=t;return[n,a]}function aL(e,t,n=1){const[a,r]=FD(e);if(!a)return;const o=window.getComputedStyle(t).getPropertyValue(a);if(o){const s=o.trim();return $b(s)?parseFloat(s):s}else return Ww(r)?aL(r,t,n+1):r}function RD(e,{...t},n){const a=e.current;if(!(a instanceof Element))return{target:t,transitionEnd:n};n&&(n={...n}),e.values.forEach(r=>{const o=r.get();if(!Ww(o))return;const s=aL(o,a);s&&r.set(s)});for(const r in t){const o=t[r];if(!Ww(o))continue;const s=aL(o,a);s&&(t[r]=s,n||(n={}),n[r]===void 0&&(n[r]=o))}return{target:t,transitionEnd:n}}const BD=new Set(["width","height","top","left","right","bottom","x","y","translateX","translateY"]),yA=e=>BD.has(e),ND=e=>Object.keys(e).some(yA),bI=e=>e===H1||e===V,AI=(e,t)=>parseFloat(e.split(", ")[t]),zI=(e,t)=>(n,{transform:a})=>{if(a==="none"||!a)return 0;const r=a.match(/^matrix3d\((.+)\)$/);if(r)return AI(r[1],t);{const o=a.match(/^matrix\((.+)\)$/);return o?AI(o[1],e):0}},ED=new Set(["x","y","z"]),OD=qi.filter(e=>!ED.has(e));function UD(e){const t=[];return OD.forEach(n=>{const a=e.getValue(n);a!==void 0&&(t.push([n,a.get()]),a.set(n.startsWith("scale")?1:0))}),t.length&&e.render(),t}const va={width:({x:e},{paddingLeft:t="0",paddingRight:n="0"})=>e.max-e.min-parseFloat(t)-parseFloat(n),height:({y:e},{paddingTop:t="0",paddingBottom:n="0"})=>e.max-e.min-parseFloat(t)-parseFloat(n),top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:zI(4,13),y:zI(5,14)};va.translateX=va.x;va.translateY=va.y;const ZD=(e,t,n)=>{const a=t.measureViewportBox(),r=t.current,o=getComputedStyle(r),{display:s}=o,c={};s==="none"&&t.setStaticValue("display",e.display||"block"),n.forEach(d=>{c[d]=va[d](a,o)}),t.render();const l=t.measureViewportBox();return n.forEach(d=>{const u=t.getValue(d);u&&u.jump(c[d]),e[d]=va[d](l,o)}),e},_D=(e,t,n={},a={})=>{t={...t},a={...a};const r=Object.keys(t).filter(yA);let o=[],s=!1;const c=[];if(r.forEach(l=>{const d=e.getValue(l);if(!e.hasValue(l))return;let u=n[l],y=za(u);const p=t[l];let m;if(DM(p)){const v=p.length,x=p[0]===null?1:0;u=p[x],y=za(u);for(let I=x;I<v&&p[I]!==null;I++)m?uC(za(p[I])===m):m=za(p[I])}else m=za(p);if(y!==m)if(bI(y)&&bI(m)){const v=d.get();typeof v=="string"&&d.set(parseFloat(v)),typeof p=="string"?t[l]=parseFloat(p):Array.isArray(p)&&m===V&&(t[l]=p.map(parseFloat))}else y!=null&&y.transform&&(m!=null&&m.transform)&&(u===0||p===0)?u===0?d.set(m.transform(u)):t[l]=y.transform(p):(s||(o=UD(e),s=!0),c.push(l),a[l]=a[l]!==void 0?a[l]:t[l],d.jump(p))}),c.length){const l=c.indexOf("height")>=0?window.pageYOffset:null,d=ZD(t,e,c);return o.length&&o.forEach(([u,y])=>{e.getValue(u).set(y)}),e.render(),o9&&l!==null&&window.scrollTo({top:l}),{target:d,transitionEnd:a}}else return{target:t,transitionEnd:a}};function WD(e,t,n,a){return ND(t)?_D(e,t,n,a):{target:t,transitionEnd:a}}const GD=(e,t,n,a)=>{const r=RD(e,t,a);return t=r.target,a=r.transitionEnd,WD(e,t,n,a)},iL={current:null},pA={current:!1};function $D(){if(pA.current=!0,!!o9)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>iL.current=e.matches;e.addListener(t),t()}else iL.current=!1}function XD(e,t,n){const{willChange:a}=t;for(const r in t){const o=t[r],s=n[r];if(be(o))e.addValue(r,o),NM(a)&&a.add(r);else if(be(s))e.addValue(r,ga(o,{owner:e})),NM(a)&&a.remove(r);else if(s!==o)if(e.hasValue(r)){const c=e.getValue(r);!c.hasAnimated&&c.set(o)}else{const c=e.getStaticValue(r);e.addValue(r,ga(c!==void 0?c:o,{owner:e}))}}for(const r in n)t[r]===void 0&&e.removeValue(r);return t}const VI=new WeakMap,kA=Object.keys(Pi),KD=kA.length,HI=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"],QD=aC.length;class YD{constructor({parent:t,props:n,presenceContext:a,reducedMotionConfig:r,visualState:o},s={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.values=new Map,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.scheduleRender=()=>E.render(this.render,!1,!0);const{latestValues:c,renderState:l}=o;this.latestValues=c,this.baseTarget={...c},this.initialValues=n.initial?{...c}:{},this.renderState=l,this.parent=t,this.props=n,this.presenceContext=a,this.depth=t?t.depth+1:0,this.reducedMotionConfig=r,this.options=s,this.isControllingVariants=c9(n),this.isVariantNode=JP(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:d,...u}=this.scrapeMotionValuesFromProps(n,{});for(const y in u){const p=u[y];c[y]!==void 0&&be(p)&&(p.set(c[y],!1),NM(d)&&d.add(y))}}scrapeMotionValuesFromProps(t,n){return{}}mount(t){this.current=t,VI.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,a)=>this.bindToMotionValue(a,n)),pA.current||$D(),this.shouldReduceMotion=this.reducedMotionConfig==="never"?!1:this.reducedMotionConfig==="always"?!0:iL.current,this.parent&&this.parent.children.add(this),this.update(this.props,this.presenceContext)}unmount(){VI.delete(this.current),this.projection&&this.projection.unmount(),Lt(this.notifyUpdate),Lt(this.render),this.valueSubscriptions.forEach(t=>t()),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent&&this.parent.children.delete(this);for(const t in this.events)this.events[t].clear();for(const t in this.features)this.features[t].unmount();this.current=null}bindToMotionValue(t,n){const a=V1.has(t),r=n.on("change",s=>{this.latestValues[t]=s,this.props.onUpdate&&E.update(this.notifyUpdate,!1,!0),a&&this.projection&&(this.projection.isTransformDirty=!0)}),o=n.on("renderRequest",this.scheduleRender);this.valueSubscriptions.set(t,()=>{r(),o()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}loadFeatures({children:t,...n},a,r,o){let s,c;for(let l=0;l<KD;l++){const d=kA[l],{isEnabled:u,Feature:y,ProjectionNode:p,MeasureLayout:m}=Pi[d];p&&(s=p),u(n)&&(!this.features[d]&&y&&(this.features[d]=new y(this)),m&&(c=m))}if((this.type==="html"||this.type==="svg")&&!this.projection&&s){this.projection=new s(this.latestValues,this.parent&&this.parent.projection);const{layoutId:l,layout:d,drag:u,dragConstraints:y,layoutScroll:p,layoutRoot:m}=n;this.projection.setOptions({layoutId:l,layout:d,alwaysMeasureLayout:!!u||y&&$1(y),visualElement:this,scheduleRender:()=>this.scheduleRender(),animationType:typeof d=="string"?d:"both",initialPromotionConfig:o,layoutScroll:p,layoutRoot:m})}return c}updateFeatures(){for(const t in this.features){const n=this.features[t];n.isMounted?n.update():(n.mount(),n.isMounted=!0)}}triggerBuild(){this.build(this.renderState,this.latestValues,this.options,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):te()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}makeTargetAnimatable(t,n=!0){return this.makeTargetAnimatableFromInstance(t,this.props,n)}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let a=0;a<HI.length;a++){const r=HI[a];this.propEventSubscriptions[r]&&(this.propEventSubscriptions[r](),delete this.propEventSubscriptions[r]);const o=t["on"+r];o&&(this.propEventSubscriptions[r]=this.on(r,o))}this.prevMotionValues=XD(this,this.scrapeMotionValuesFromProps(t,this.prevProps),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}getVariantContext(t=!1){if(t)return this.parent?this.parent.getVariantContext():void 0;if(!this.isControllingVariants){const a=this.parent?this.parent.getVariantContext()||{}:{};return this.props.initial!==void 0&&(a.initial=this.props.initial),a}const n={};for(let a=0;a<QD;a++){const r=aC[a],o=this.props[r];(ji(o)||o===!1)&&(n[r]=o)}return n}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){n!==this.values.get(t)&&(this.removeValue(t),this.bindToMotionValue(t,n)),this.values.set(t,n),this.latestValues[t]=n.get()}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let a=this.values.get(t);return a===void 0&&n!==void 0&&(a=ga(n,{owner:this}),this.addValue(t,a)),a}readValue(t){var n;return this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:(n=this.getBaseTargetFromProps(this.props,t))!==null&&n!==void 0?n:this.readValueFromInstance(this.current,t,this.options)}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){var n;const{initial:a}=this.props,r=typeof a=="string"||typeof a=="object"?(n=hC(this.props,a))===null||n===void 0?void 0:n[t]:void 0;if(a&&r!==void 0)return r;const o=this.getBaseTargetFromProps(this.props,t);return o!==void 0&&!be(o)?o:this.initialValues[t]!==void 0&&r===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new MC),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}}class fA extends YD{sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){return t.style?t.style[n]:void 0}removeValueFromRenderState(t,{vars:n,style:a}){delete n[t],delete a[t]}makeTargetAnimatableFromInstance({transition:t,transitionEnd:n,...a},{transformValues:r},o){let s=kq(a,t||{},this);if(r&&(n&&(n=r(n)),a&&(a=r(a)),s&&(s=r(s))),o){yq(this,a,s);const c=GD(this,a,s,n);n=c.transitionEnd,a=c.target}return{transition:t,transitionEnd:n,...a}}}function JD(e){return window.getComputedStyle(e)}class eF extends fA{constructor(){super(...arguments),this.type="html"}readValueFromInstance(t,n){if(V1.has(n)){const a=fC(n);return a&&a.default||0}else{const a=JD(t),r=(ab(n)?a.getPropertyValue(n):a[n])||0;return typeof r=="string"?r.trim():r}}measureInstanceViewportBox(t,{transformPagePoint:n}){return aA(t,n)}build(t,n,a,r){oC(t,n,a,r.transformTemplate)}scrapeMotionValuesFromProps(t,n){return dC(t,n)}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;be(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}renderInstance(t,n,a,r){lb(t,n,a,r)}}class tF extends fA{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(V1.has(n)){const a=fC(n);return a&&a.default||0}return n=db.has(n)?n:tC(n),t.getAttribute(n)}measureInstanceViewportBox(){return te()}scrapeMotionValuesFromProps(t,n){return ub(t,n)}build(t,n,a,r){cC(t,n,a,this.isSVGTag,r.transformTemplate)}renderInstance(t,n,a,r){hb(t,n,a,r)}mount(t){this.isSVGTag=lC(t.tagName),super.mount(t)}}const nF=(e,t)=>rC(e)?new tF(t,{enableHardwareAcceleration:!1}):new eF(t,{enableHardwareAcceleration:!0}),aF={layout:{ProjectionNode:uA,MeasureLayout:rA}},iF={...Aq,...KH,...qD,...aF},U=rH((e,t)=>FH(e,t,iF,nF));function mA(){const e=L.useRef(!1);return eC(()=>(e.current=!0,()=>{e.current=!1}),[]),e}function rF(){const e=mA(),[t,n]=L.useState(0),a=L.useCallback(()=>{e.current&&n(t+1)},[t]);return[L.useCallback(()=>E.postRender(a),[a]),t]}class oF extends L.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(n&&t.isPresent&&!this.props.isPresent){const a=this.props.sizeRef.current;a.height=n.offsetHeight||0,a.width=n.offsetWidth||0,a.top=n.offsetTop,a.left=n.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function sF({children:e,isPresent:t}){const n=L.useId(),a=L.useRef(null),r=L.useRef({width:0,height:0,top:0,left:0});return L.useInsertionEffect(()=>{const{width:o,height:s,top:c,left:l}=r.current;if(t||!a.current||!o||!s)return;a.current.dataset.motionPopId=n;const d=document.createElement("style");return document.head.appendChild(d),d.sheet&&d.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${o}px !important;
            height: ${s}px !important;
            top: ${c}px !important;
            left: ${l}px !important;
          }
        `),()=>{document.head.removeChild(d)}},[t]),L.createElement(oF,{isPresent:t,childRef:a,sizeRef:r},L.cloneElement(e,{ref:a}))}const Q9=({children:e,initial:t,isPresent:n,onExitComplete:a,custom:r,presenceAffectsLayout:o,mode:s})=>{const c=yb(cF),l=L.useId(),d=L.useMemo(()=>({id:l,initial:t,isPresent:n,custom:r,onExitComplete:u=>{c.set(u,!0);for(const y of c.values())if(!y)return;a&&a()},register:u=>(c.set(u,!1),()=>c.delete(u))}),o?void 0:[n]);return L.useMemo(()=>{c.forEach((u,y)=>c.set(y,!1))},[n]),L.useEffect(()=>{!n&&!c.size&&a&&a()},[n]),s==="popLayout"&&(e=L.createElement(sF,{isPresent:n},e)),L.createElement(r9.Provider,{value:d},e)};function cF(){return new Map}function lF(e){return L.useEffect(()=>()=>e(),[])}const d1=e=>e.key||"";function dF(e,t){e.forEach(n=>{const a=d1(n);t.set(a,n)})}function hF(e){const t=[];return L.Children.forEach(e,n=>{L.isValidElement(n)&&t.push(n)}),t}const Qe=({children:e,custom:t,initial:n=!0,onExitComplete:a,exitBeforeEnter:r,presenceAffectsLayout:o=!0,mode:s="sync"})=>{const c=L.useContext(iC).forceRender||rF()[0],l=mA(),d=hF(e);let u=d;const y=L.useRef(new Map).current,p=L.useRef(u),m=L.useRef(new Map).current,v=L.useRef(!0);if(eC(()=>{v.current=!1,dF(d,m),p.current=u}),lF(()=>{v.current=!0,m.clear(),y.clear()}),v.current)return L.createElement(L.Fragment,null,u.map(k=>L.createElement(Q9,{key:d1(k),isPresent:!0,initial:n?void 0:!1,presenceAffectsLayout:o,mode:s},k)));u=[...u];const x=p.current.map(d1),I=d.map(d1),g=x.length;for(let k=0;k<g;k++){const f=x[k];I.indexOf(f)===-1&&!y.has(f)&&y.set(f,void 0)}return s==="wait"&&y.size&&(u=[]),y.forEach((k,f)=>{if(I.indexOf(f)!==-1)return;const M=m.get(f);if(!M)return;const w=x.indexOf(f);let j=k;if(!j){const P=()=>{y.delete(f);const S=Array.from(m.keys()).filter(z=>!I.includes(z));if(S.forEach(z=>m.delete(z)),p.current=d.filter(z=>{const H=d1(z);return H===f||S.includes(H)}),!y.size){if(l.current===!1)return;c(),a&&a()}};j=L.createElement(Q9,{key:d1(M),isPresent:!1,onExitComplete:P,custom:t,presenceAffectsLayout:o,mode:s},M),y.set(f,j)}u.splice(w,0,j)}),u=u.map(k=>{const f=k.key;return y.has(f)?k:L.createElement(Q9,{key:d1(k),isPresent:!0,presenceAffectsLayout:o,mode:s},k)}),L.createElement(L.Fragment,null,y.size?u:u.map(k=>L.cloneElement(k)))};function uF({isOpen:e,onClose:t,currentPage:n,onNavigate:a}){const r=[{id:"milestones",label:"里程碑追蹤",icon:Ga,description:"記錄寶寶發展進度"},{id:"care-guide",label:"照顧重點",icon:ia,description:"各階段注意事項"},{id:"vaccine-tracking",label:"疫苗追蹤",icon:ca,description:"疫苗接種時程與副作用"},{id:"complementary-food",label:"副食品指南",icon:da,description:"副食品添加完整攻略"}],o=s=>{a(s),t()};return h.jsx(Qe,{children:e&&h.jsxs(h.Fragment,{children:[h.jsx(U.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:t,className:"fixed inset-0 bg-black/40 z-40"}),h.jsxs(U.div,{initial:{x:"-100%"},animate:{x:0},exit:{x:"-100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto",children:[h.jsxs("div",{className:"sticky top-0 bg-gradient-to-r from-primary to-secondary p-6 text-white",children:[h.jsxs("div",{className:"flex items-center justify-between mb-2",children:[h.jsxs("div",{className:"flex items-center gap-2",children:[h.jsx(Qa,{className:"w-6 h-6"}),h.jsx("h2",{className:"text-xl font-bold",children:"LittleSteps"})]}),h.jsx("button",{onClick:t,className:"w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors",children:h.jsx(lt,{className:"w-5 h-5"})})]}),h.jsx("p",{className:"text-sm text-white/80",children:"育兒里程碑追蹤"})]}),h.jsx("div",{className:"p-4 space-y-2",children:r.map(s=>{const c=s.icon,l=n===s.id;return h.jsx("button",{onClick:()=>o(s.id),className:`
                      w-full p-4 rounded-2xl transition-all text-left
                      ${l?"bg-primary text-white shadow-soft":"bg-gray-50 text-gray-700 hover:bg-gray-100"}
                    `,children:h.jsxs("div",{className:"flex items-start gap-3",children:[h.jsx(c,{className:`w-6 h-6 flex-shrink-0 mt-0.5 ${l?"text-white":"text-primary"}`}),h.jsxs("div",{className:"flex-1",children:[h.jsx("div",{className:"font-semibold mb-1",children:s.label}),h.jsx("div",{className:`text-sm ${l?"text-white/80":"text-gray-500"}`,children:s.description})]})]})},s.id)})}),h.jsx("div",{className:"absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100",children:h.jsxs("p",{className:"text-xs text-gray-500 text-center",children:["© 2024 LittleSteps",h.jsx("br",{}),"陪伴寶貝每一步成長"]})})]})]})})}const TI=[{id:"m0-1-physical-1",monthRange:"0-2",category:"physical",title:"俯臥短暫抬頭",summary:"趴著時頭部可稍微抬起並左右擺頭",details:"這階段寶寶大多數時間都在吃睡，趴著時頸部力量雖弱，但能嘗試離開床面。",tips:["在有人看顧下練習 1 分鐘 Tummy Time","觀察睡姿，鼓勵寶寶平衡地向左右擺頭"]},{id:"m0-1-motor-1",monthRange:"0-2",category:"motor",title:"原始反射：強烈抓握",summary:"對聲音有反射反應，手掌常保持緊握",details:"對突如其來的強光和噪音會產生發抖、閉眼等反射動作。手指放入掌心會自動抓緊。",tips:["觀察寶寶對噪音是否有驚嚇反應","輕撫手掌練習放鬆"]},{id:"m2-physical-1",monthRange:"0-2",category:"physical",title:"抬頭幅度增加",summary:"趴著能小幅抬頭，拉扶坐起時頭微後仰",details:"頸部肌肉力量增強，趴著時視野開始稍微擴大。",tips:["2個月若完全無法抬頭需諮詢醫師","用色彩鮮豔的玩具誘發抬頭"]},{id:"m2-motor-1",monthRange:"0-2",category:"motor",title:"吃手安撫自我",summary:"開始透過吃手動作緩和情緒或增加安全感",details:"手部動作增加，會將手放入口中探索。抓握反射依然存在。",tips:["不需刻意禁止吃手，這在建立安全感","保持手部清潔"]},{id:"m2-cognitive-1",monthRange:"0-2",category:"cognitive",title:"聲音反應與咿呀聲",summary:"嘗試轉頭看聲源，發出不具意義的咿呀聲",details:"對周遭聲響產生好奇，開始練習聲帶控制（咕咕聲）。",tips:["在寶寶兩側說話觀察追聽反應","模仿寶寶的咿呀聲與他互動"]},{id:"m2-social-1",monthRange:"0-2",category:"cognitive",title:"社會性微笑",summary:"能近距離辨識人臉，會對照顧者微笑",details:"寶寶開始想看照顧者的臉孔，並能做出回應式的微笑。",tips:["多與寶寶面對面眼神交流","若2個月仍不微笑應注意"]},{id:"m3-physical-1",monthRange:"3-4",category:"physical",title:"抬頭 45 度與踢腿",summary:"趴著時抬頭達 45 度，躺著時踢腿運動",details:"肌肉力量從頸部延伸到腿部，踢腿動作能幫助下肢肌肉發展。",tips:["給予寬敞地墊讓寶寶自由踢腿","多玩腳踏車運動（幫寶寶踩動腿部）"]},{id:"m3-motor-1",monthRange:"3-4",category:"motor",title:"主動抓握玩具",summary:"能用手抓握玩具，吃手動作變精準",details:"手眼協調進步，看到物體會伸手嘗試抓取。",tips:["提供重量輕、好抓握的搖鈴","將玩具放在不同角度誘發抓取"]},{id:"m3-cognitive-1",monthRange:"3-4",category:"cognitive",title:"識人能力提升",summary:"對家庭成員產生熟悉感，發單音回應",details:"對人臉記憶力更好，會用單音回應大人的話語。",tips:["多介紹不同家人給寶寶認識","保持豐富的面部表情互動"]},{id:"m4-physical-1",monthRange:"3-4",category:"physical",title:"穩穩抬頭與翻身練習",summary:"能穩穩抬頭，利用翻滾由趴姿轉為躺姿",details:"這是大動作發展的重大進步。寶寶開始能控制重心轉移。",tips:["練習「翻回來」：引導寶寶從躺姿再翻回趴姿","注意床緣安全，絕對不可離開視線"]},{id:"m4-motor-1",monthRange:"3-4",category:"motor",title:"伸手碰觸與甩動物品",summary:"抓到東西後能穩穩握住並甩動、搖晃",details:"不再只是隨機觸碰，而是能有意識地操控手中物體。",tips:["練習拿走毛巾遊戲：將輕薄毛巾蓋臉，鼓勵寶寶抓開"]},{id:"m4-social-1",monthRange:"3-4",category:"cognitive",title:"主動微笑與模仿表情",summary:"喜歡跟人玩，模仿照顧者的表情",details:"社交互動變得更主動。若遊戲中斷會用哭來表達不滿。",tips:["與寶寶玩扮鬼臉遊戲","觀察視線是否能自由觀察環境"]},{id:"m5-physical-1",monthRange:"5-6",category:"physical",title:"全向翻滾與玩腳趾",summary:"能自行翻回正面，會用手玩弄腳趾",details:"原本只能單向翻滾，現在可以順利翻回。對自己的腳部產生極大興趣。",tips:["將寶寶雙腳拉近他的手，讓他發現自己的小腳ㄚ"]},{id:"m5-motor-1",monthRange:"5-6",category:"motor",title:"精細動作：玩弄腳趾",summary:"手部動作細膩度增加，會拉扯腳趾",details:"這是認識身體空間感的一部分，代表軀幹柔軟度佳。",tips:["在地墊上讓寶寶光腳活動"]},{id:"m5-feeding-1",monthRange:"5-6",category:"feeding",title:"副食品渴求期",summary:"看人吃東西會想要，長牙跡象出現",details:"會頻繁咬東西，表現出對大人食物的興趣，是嘗試副食品的最佳時機。",tips:["觀察寶寶是否有推舌反應消失","準備咬咬樂或固齒器緩和長牙癢"]},{id:"m5-social-1",monthRange:"5-6",category:"cognitive",title:"分辨陌生人",summary:"開始分辨熟人與陌生人，會因高興而尖叫",details:"情緒表達變得激烈且多元，能發出「媽、爸」等單音（無意義）。",tips:["給予安全感，不要強迫讓陌生人抱寶寶"]},{id:"m6-physical-1",monthRange:"5-6",category:"physical",title:"翻滾達人與獨立坐",summary:"不需協助能自己坐著，扶站時大腿能支撐",details:"核心與下肢肌肉發達。扶站時寶寶會試著用力踩地。",tips:["練習坐在地墊上玩玩具，訓練背部平衡力"]},{id:"m6-motor-1",monthRange:"5-6",category:"motor",title:"打開臉上的手帕",summary:"能抓開蓋在臉上的物品，喜歡東西塞嘴巴",details:"這代表手部力量與問題解決能力的結合。口腔探索依然強烈。",tips:["注意玩具清潔消毒，嚴防細菌病毒","玩進階版躲貓貓：用手帕遮住玩具讓寶寶找"]},{id:"m6-cognitive-1",monthRange:"5-6",category:"cognitive",title:"模仿聲音與反應名字",summary:"會模仿大人發出的音，對名字有反應",details:"對經常聽到的詞語產生連結。大人發一音，寶寶會試著回一音。",tips:["經常對寶寶說話，稱呼他的名字"]},{id:"m6-social-1",monthRange:"5-6",category:"cognitive",title:"分離焦慮出現",summary:"照顧者不在會焦慮，樂於與人開心地互動",details:"對熟人與陌生人的分辨能力大幅提升。此時若6個月不會翻滾應諮詢醫師。",tips:["建立穩定的告別儀式，增加寶寶安全感"]},{id:"m7-physical-1",monthRange:"7-9",category:"physical",title:"穩坐與大腿跳躍",summary:"維持坐姿輕鬆，被抱時會在大腿上亂跳",details:"下肢爆發力增強。坐著時能轉向不同方向拿東西而不倒下。",tips:["扶著寶寶腋下讓他在你腿上練習蹬腿"]},{id:"m7-motor-1",monthRange:"7-9",category:"motor",title:"拇指彎曲與撥弄物品",summary:"能用手指撥弄、抓握細小物件",details:"手部動作不再只是晃動，開始出現精細的撥弄動作。",tips:["給予不同大小的積木練習抓握"]},{id:"m8-physical-1",monthRange:"7-9",category:"physical",title:"爬行取代翻滾",summary:"開始爬行移動，能扶著支撐物站立",details:"移動能力進入新境界。此時口水分泌量大增（長牙）。",tips:["徹底執行地板安全檢查（電線、插座）"]},{id:"m8-motor-1",monthRange:"7-9",category:"motor",title:"主動放開物體",summary:"能自行或經由引導放開手中的物品",details:"放下動作是神經發育的重要指標。此時可以學習自己拿餅乾吃。",tips:["玩「給你/給我」的物體交換遊戲"]},{id:"m8-cognitive-1",monthRange:"7-9",category:"cognitive",title:"理解「不可以」的語氣",summary:"對否定意義詞語有反應，但還不能完全遵守",details:"能從語氣分辨照顧者的情緒，能將單音連成「爸爸、媽媽」。",tips:["語氣要堅定一致，避免過度吼叫"]},{id:"m9-physical-1",monthRange:"7-9",category:"physical",title:"靈活坐姿變換",summary:"能從其他姿勢變換為坐姿，坐直不倒下",details:"即使沒有支撐也能坐得很直，軀幹控制力趨於成熟。",tips:["觀察寶寶是否能自己從趴姿坐起來"]},{id:"m9-motor-1",monthRange:"7-9",category:"motor",title:"指尖捏取（食指拇指）",summary:"能靈活運用食指和拇指捏取食物或小玩具",details:"這是手部精細動作的重大進步（鉗式抓握）。",tips:["提供合適的手指食物練習捏取","嚴防細小雜物被誤吞"]},{id:"m9-cognitive-1",monthRange:"7-9",category:"cognitive",title:"物體恆存認知確立",summary:"知道藏起來的東西沒消失，會試著找出來",details:"躲貓貓遊戲對寶寶來說變得非常有意義。這是緩解分離焦慮的關鍵。",tips:["玩「尋寶遊戲」：在被子下藏玩具讓寶寶找"]},{id:"m10-physical-1",monthRange:"10-12",category:"physical",title:"扶物巡走（螃蟹走）",summary:"嘗試以扶物站立的方式在家中各處行走",details:"雙腿力量已可支撐全身，正處於學步前置期。",tips:["檢查家具是否穩固（避免翻倒）"]},{id:"m10-motor-1",monthRange:"10-12",category:"motor",title:"物品敲擊與容器遊戲",summary:"喜歡敲擊物品出聲，練習放入與取出",details:"對空間感與聲音因果關係感到好奇。",tips:["提供小桶子與軟球練習「放入」動作"]},{id:"m10-cognitive-1",monthRange:"10-12",category:"cognitive",title:"學習生活詞彙",summary:"理解「拜拜」等意思，會揮手回應",details:"能講出媽媽爸爸以外的簡單詞語如「不、走、來」。",tips:["多練習社交手勢如：謝謝、拜拜、親一個"]},{id:"m11-physical-1",monthRange:"10-12",category:"physical",title:"獨自站立與背後拿物",summary:"能不扶物自行站立，坐著可伸到背後拿東西",details:"平衡感極佳，平衡中心已從坐姿轉移到站姿。",tips:["提供安全開放空間讓寶寶嘗試放手站"]},{id:"m11-motor-1",monthRange:"10-12",category:"motor",title:"精細操作：堆疊與按鈕",summary:"能在容器堆疊積木，會用手指戳碰按鈕",details:"手指力量更集中，能單獨使用食指操作物體。",tips:["提供有按鍵的聲光玩具或按鈕書"]},{id:"m12-physical-1",monthRange:"12+",category:"physical",title:"踏出第一步與配合穿衣",summary:"能獨立行走幾步，換衣時會主動伸出手腳",details:"重大里程碑！能運用自身力量配合大人的動作。",tips:["換衣時說：『手伸出來』觀察寶寶反應","給予放手走路熱烈鼓勵"]},{id:"m12-motor-1",monthRange:"12+",category:"motor",title:"模仿工具正確用法",summary:"學拿杯子喝水或拿梳子梳頭髮",details:"手眼協調已可支持使用簡單工具，是自理教育的好時機。",tips:["給予學習杯練習自己喝水","在鏡子前示範梳頭、刷牙"]},{id:"m12-cognitive-1",monthRange:"12+",category:"cognitive",title:"理解音調語法與圖畫識別",summary:"能理解否定搖頭，能從多張圖中找出目標",details:"雖然詞彙有限，但已能識別一整句話的組成意圖與音調。",tips:["問：『蘋果在哪裡？』看寶寶是否能從水果中指出"]},{id:"m12-social-1",monthRange:"12+",category:"cognitive",title:"表現個人喜好與求助",summary:"有最愛的玩具，會主動拿書要求大人讀",details:"自我意識與幽默感展現，會用聲音吸引注意力。",tips:["多讀故事書給寶寶聽，建立早期共讀習慣"]}],yF=[{value:"0-2",label:"0-2 個月"},{value:"3-4",label:"3-4 個月"},{value:"5-6",label:"5-6 個月"},{value:"7-9",label:"7-9 個月"},{value:"10-12",label:"10-12 個月"},{value:"12+",label:"1 歲以上"}],pF=[{value:"all",label:"全部",icon:"Grid3x3"},{value:"physical",label:"大動作",icon:"User"},{value:"motor",label:"精細動作",icon:"Hand"},{value:"cognitive",label:"語言認知",icon:"Brain"},{value:"feeding",label:"飲食營養",icon:"UtensilsCrossed"}];function kF({ranges:e,selected:t,onChange:n}){return h.jsx("div",{className:"flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide",children:e.map(a=>h.jsx("button",{onClick:()=>n(a.value),className:`
            px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all snap-center
            ${t===a.value?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
          `,children:a.label},a.value))})}function fF({categories:e,selected:t,onChange:n}){return h.jsx("div",{className:"flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide",children:e.map(a=>{const r=b1[a.icon];return h.jsxs("button",{onClick:()=>n(a.value),className:`
              flex items-center gap-2 px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all snap-center
              ${t===a.value?"bg-secondary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:[r&&h.jsx(r,{className:"w-4 h-4"}),h.jsx("span",{children:a.label})]},a.value)})})}function mF({milestone:e,isCompleted:t,onToggle:n,onClick:a}){return h.jsxs("div",{className:"card flex gap-3 items-start",children:[h.jsx("button",{onClick:r=>{r.stopPropagation(),n()},className:`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${t?"bg-primary border-primary":"border-gray-300 hover:border-primary"}
        `,children:t&&h.jsx(v1,{className:"w-4 h-4 text-white"})}),h.jsxs("div",{onClick:a,className:"flex-1 cursor-pointer",children:[h.jsx("h3",{className:`font-semibold text-gray-800 mb-1 ${t?"line-through opacity-60":""}`,children:e.title}),h.jsx("p",{className:"text-sm text-gray-600 line-clamp-2",children:e.summary})]}),h.jsx(Xa,{onClick:a,className:"w-5 h-5 text-gray-400 flex-shrink-0 cursor-pointer"})]})}async function gF(e){const t=window.location.href,n=`我的寶貝達成了【${e}】里程碑了！推薦給新手父母的育兒神器：`;if(navigator.share)try{return await navigator.share({title:"LittleSteps - 育兒里程碑",text:n,url:t}),!0}catch(a){return a.name!=="AbortError"&&console.error("分享失敗:",a),!1}else try{return await navigator.clipboard.writeText(`${n} ${t}`),alert("已複製到剪貼簿！"),!0}catch(a){return console.error("複製失敗:",a),!1}}function vF({milestone:e,isOpen:t,onClose:n,isCompleted:a,onToggle:r}){if(L.useEffect(()=>(t?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[t]),!e)return null;const o=async()=>{await gF(e.title)};return h.jsx(Qe,{children:t&&h.jsxs(h.Fragment,{children:[h.jsx(U.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:n,className:"fixed inset-0 bg-black/40 z-40"}),h.jsxs(U.div,{initial:{opacity:0,y:"100%"},animate:{opacity:1,y:0},exit:{opacity:0,y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto",children:[h.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[h.jsx("h2",{className:"text-xl font-bold text-gray-800 flex-1 pr-4",children:e.title}),h.jsx("button",{onClick:n,className:"w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0",children:h.jsx(lt,{className:"w-5 h-5"})})]}),h.jsxs("div",{className:"px-4 py-6 space-y-6",children:[h.jsx("div",{children:h.jsx("p",{className:"text-gray-700 leading-relaxed",children:e.summary})}),h.jsxs("div",{children:[h.jsx("h3",{className:"font-semibold text-gray-800 mb-2",children:"詳細說明"}),h.jsx("p",{className:"text-gray-600 leading-relaxed",children:e.details})]}),e.tips&&e.tips.length>0&&h.jsxs("div",{children:[h.jsxs("h3",{className:"font-semibold text-gray-800 mb-3 flex items-center gap-2",children:[h.jsx(M1,{className:"w-5 h-5 text-primary"}),"練習小撇步"]}),h.jsx("ul",{className:"space-y-2",children:e.tips.map((s,c)=>h.jsxs("li",{className:"flex gap-2",children:[h.jsx("span",{className:"text-primary flex-shrink-0",children:"•"}),h.jsx("span",{className:"text-gray-600",children:s})]},c))})]})]}),h.jsxs("div",{className:"sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3",children:[h.jsxs("button",{onClick:r,className:`
                  flex-1 py-3 px-6 rounded-2xl font-medium transition-all flex items-center justify-center gap-2
                  ${a?"bg-gray-100 text-gray-600 hover:bg-gray-200":"bg-primary text-white shadow-soft hover:bg-primary-dark"}
                `,children:[h.jsx(v1,{className:"w-5 h-5"}),a?"已完成":"標記完成"]}),h.jsxs("button",{onClick:o,className:"px-6 py-3 rounded-2xl bg-secondary text-white shadow-soft hover:bg-secondary-dark transition-all flex items-center gap-2",children:[h.jsx(ti,{className:"w-5 h-5"}),"分享"]})]})]})]})})}function xF({progress:e,onToggleMilestone:t}){const[n,a]=L.useState("0-2"),[r,o]=L.useState("all"),[s,c]=L.useState(null),l=L.useMemo(()=>TI.filter(u=>{const y=u.monthRange===n,p=r==="all"||u.category===r;return y&&p}),[n,r]),d=L.useMemo(()=>TI.find(u=>u.id===s)||null,[s]);return h.jsxs("div",{className:"min-h-screen bg-warm-white pb-6",children:[h.jsx("div",{className:"px-4 mb-4",children:h.jsx(kF,{ranges:yF,selected:n,onChange:a})}),h.jsx("div",{className:"px-4 mb-4",children:h.jsx(fF,{categories:pF,selected:r,onChange:o})}),h.jsx("div",{className:"px-4 space-y-3",children:h.jsx(Qe,{mode:"popLayout",children:l.length>0?l.map((u,y)=>h.jsx(U.div,{layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.2,delay:y*.05},children:h.jsx(mF,{milestone:u,isCompleted:!!e[u.id],onToggle:()=>t(u.id),onClick:()=>c(u.id)})},u.id)):h.jsxs(U.div,{initial:{opacity:0},animate:{opacity:1},className:"text-center py-12",children:[h.jsx("div",{className:"text-6xl mb-4",children:"👶"}),h.jsx("p",{className:"text-gray-500",children:r==="all"?"這個月齡階段沒有里程碑資料":"這個分類沒有里程碑資料"})]})})}),h.jsx(vF,{milestone:d,isOpen:!!d,onClose:()=>c(null),isCompleted:d?!!e[d.id]:!1,onToggle:()=>d&&t(d.id)})]})}const MF=[{id:"safety-sleep",title:"睡眠安全",description:"仰睡，床鋪無鬆軟枕頭被褥，同室不同床",icon:"Moon"},{id:"safety-feeding",title:"飲食習慣",description:"6個月後逐步添加副食品，培養自主進食",icon:"UtensilsCrossed"},{id:"safety-oral",title:"口腔清潔",description:"即使沒長牙，餵奶後也可用紗布清潔口腔",icon:"Sparkles"},{id:"safety-vaccine",title:"疫苗接種",description:"按時接種預防針，滿5個月可接種卡介苗",icon:"Syringe"},{id:"safety-home",title:"居家安全",description:"移除危險物品，保護會爬會走的寶寶",icon:"ShieldCheck"},{id:"safety-bonding",title:"親密互動",description:"每天說話、唱歌，增加安全感",icon:"Heart"}],qI=[{month:1,title:"臍帶與皮膚護理",category:"physiological",highlights:["臍帶脫落前保持乾燥（洗澡後用 95% 酒精消毒乾燥）","新生兒脫皮是正常的，不需過度擦乳液","一週洗澡 2-3 次即可"]},{month:2,title:"排氣與情緒安撫",category:"physiological",highlights:["進入「腸絞痛」高發期，餵奶後務必拍嗝","每天做 2-3 次排氣操（空中腳踏車）","此時開始會社會性微笑，多給予眼神交流"]},{month:3,title:"抬頭與感官發展",category:"physiological",highlights:["練習 Tummy Time（趴睡抬頭），每天數次、每次 1-2 分鐘","加強頸部肌肉發展","白天拉開窗簾、晚上關燈，建立晝夜節律"]},{month:4,title:"副食品與口水疹",category:"feeding",highlights:["準備開始餵副食品（從十倍粥或果菜泥開始）","唾腺發育旺盛，需勤換圍兜","用「按壓」方式擦乾口水，避免口水疹"]},{month:5,title:"翻身安全警訊",category:"safety",highlights:["寶寶隨時會翻身，絕不可單獨留在尿布台或沙發上","若開始長牙，會因牙齦癢愛咬東西","需準備乾淨的固齒器"]},{month:6,title:"口腔清潔與坐姿",category:"feeding",highlights:["正式進入副食品規律期（一天 1-2 次）","開始練習坐姿，周圍需墊軟墊","早晚用紗布巾擦拭牙齦與新牙"]},{month:7,title:"爬行啟動與飲水",category:"safety",highlights:["寶寶開始會蠕動爬行，地板清潔要徹底","副食品量增加後，可開始練習用水杯喝水","預防便秘"]},{month:8,title:"居家環境大安檢",category:"safety",highlights:["寶寶活動力激增，需加裝插座保護蓋","收好地板上的細小物體（如硬幣、鈕扣）","避免誤食窒息"]},{month:9,title:"分離焦慮與安撫",category:"physiological",highlights:["寶寶變得很黏人、怕生，離開前要溫柔告知（不要偷溜）","建立固定的睡前儀式（洗澡→說故事→睡覺）","增加安全感"]},{month:10,title:"手指食物與咀嚼",category:"feeding",highlights:["提供手指食物（如煮軟的紅蘿蔔條、香蕉切片）","訓練手眼協調與咀嚼能力","應減少奶量，增加固體食物比例"]},{month:11,title:"扶站與撞擊防護",category:"safety",highlights:["寶寶會扶著家具站立或橫移","家中的尖銳桌角必須貼上防撞條","撤走可能被扯落的桌巾"]},{month:12,title:"作息調整與轉奶",category:"feeding",highlights:["滿週歲後，飲食應改為「正餐為主、奶為輔」（早晚奶）","可開始練習拿湯匙","嘗試與大人共餐（去油去鹽）"]}],DI=[{value:"all",label:"全部",icon:"Grid3x3"},{value:"physiological",label:"生理護理",icon:"Activity"},{value:"feeding",label:"餵養細節",icon:"Apple"},{value:"safety",label:"環境安全",icon:"ShieldAlert"}];function wF(){const[e,t]=L.useState("all"),n=L.useMemo(()=>e==="all"?qI:qI.filter(o=>o.category===e),[e]),a=o=>{switch(o){case"physiological":return"bg-blue-100 text-blue-700";case"feeding":return"bg-green-100 text-green-700";case"safety":return"bg-red-100 text-red-700";default:return"bg-gray-100 text-gray-700"}},r=o=>{const s=DI.find(c=>c.value===o);return s?s.label:o};return h.jsxs("div",{className:"min-h-screen bg-warm-white pb-6",children:[h.jsxs("div",{className:"bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(Ut,{className:"w-6 h-6 text-primary"}),h.jsx("h2",{className:"text-xl font-bold text-gray-800",children:"重點注意事項"})]}),h.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"適用於所有階段的核心照顧原則"}),h.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3",children:MF.map(o=>{const s=b1[o.icon];return h.jsx(U.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-white rounded-2xl p-4 shadow-soft",children:h.jsxs("div",{className:"flex items-start gap-3",children:[s&&h.jsx("div",{className:"w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0",children:h.jsx(s,{className:"w-5 h-5 text-primary"})}),h.jsxs("div",{className:"flex-1",children:[h.jsx("h3",{className:"font-semibold text-gray-800 mb-1",children:o.title}),h.jsx("p",{className:"text-sm text-gray-600",children:o.description})]})]})},o.id)})})]}),h.jsxs("div",{className:"px-4 mb-4",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[h.jsx(sa,{className:"w-5 h-5 text-gray-600"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"篩選照顧類別"})]}),h.jsx("div",{className:"flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide",children:DI.map(o=>{const s=b1[o.icon];return h.jsxs("button",{onClick:()=>t(o.value),className:`
                  flex items-center gap-2 px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all snap-center
                  ${e===o.value?"bg-secondary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
                `,children:[s&&h.jsx(s,{className:"w-4 h-4"}),h.jsx("span",{children:o.label})]},o.value)})})]}),h.jsxs("div",{className:"px-4",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(m1,{className:"w-5 h-5 text-gray-600"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"按月齡照顧重點"}),h.jsxs("span",{className:"text-sm text-gray-500",children:["（共 ",n.length," 項）"]})]}),h.jsx("div",{className:"space-y-3",children:h.jsx(Qe,{mode:"popLayout",children:n.map((o,s)=>h.jsxs(U.div,{layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.2,delay:s*.05},className:"card",children:[h.jsxs("div",{className:"flex items-start gap-3 mb-3",children:[h.jsxs("div",{className:"w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 text-white font-bold",children:[o.month,"月"]}),h.jsx("div",{className:"flex-1",children:h.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[h.jsx("h4",{className:"font-semibold text-gray-800",children:o.title}),h.jsx("span",{className:`text-xs px-2 py-1 rounded-full ${a(o.category)}`,children:r(o.category)})]})})]}),h.jsx("ul",{className:"space-y-2",children:o.highlights.map((c,l)=>h.jsxs("li",{className:"flex gap-2 text-sm text-gray-700",children:[h.jsx(g1,{className:"w-4 h-4 text-primary flex-shrink-0 mt-0.5"}),h.jsx("span",{children:c})]},l))})]},o.month))})})]})]})}const FI=[{id:"hepb-birth",name:"B型肝炎疫苗 第1劑",timing:"出生24小時內",fundingType:"public",ageInMonths:0,ageLabel:"出生",doses:3,currentDose:1,sideEffects:["注射部位紅腫","輕微發燒"],notes:"出生後儘速接種"},{id:"hepb-1m",name:"B型肝炎疫苗 第2劑",timing:"出生滿1個月",fundingType:"public",ageInMonths:1,ageLabel:"1個月",doses:3,currentDose:2,sideEffects:["注射部位紅腫","輕微發燒"]},{id:"hepb-6m",name:"B型肝炎疫苗 第3劑",timing:"出生滿6個月",fundingType:"public",ageInMonths:6,ageLabel:"6個月",doses:3,currentDose:3,sideEffects:["注射部位紅腫","輕微發燒"]},{id:"pentavalent-2m",name:"五合一疫苗 第1劑",timing:"出生滿2個月",fundingType:"public",ageInMonths:2,ageLabel:"2個月",doses:4,currentDose:1,sideEffects:["發燒","注射部位腫脹","煩躁不安","食慾下降"],notes:"含白喉、破傷風、百日咳、小兒麻痺、b型嗜血桿菌"},{id:"pneumococcal-2m",name:"13價肺炎鏈球菌疫苗 第1劑",timing:"出生滿2個月",fundingType:"public",ageInMonths:2,ageLabel:"2個月",doses:4,currentDose:1,sideEffects:["發燒","注射部位紅腫疼痛","煩躁","嗜睡"]},{id:"rotavirus-2m",name:"口服輪狀病毒疫苗 第1劑",timing:"出生滿2個月",fundingType:"private",ageInMonths:2,ageLabel:"2個月",doses:2,currentDose:1,sideEffects:["輕微腹瀉","嘔吐","煩躁"],notes:"自費疫苗，須在6個月前完成"},{id:"pentavalent-4m",name:"五合一疫苗 第2劑",timing:"出生滿4個月",fundingType:"public",ageInMonths:4,ageLabel:"4個月",doses:4,currentDose:2,sideEffects:["發燒","注射部位腫脹","煩躁不安","食慾下降"]},{id:"pneumococcal-4m",name:"13價肺炎鏈球菌疫苗 第2劑",timing:"出生滿4個月",fundingType:"public",ageInMonths:4,ageLabel:"4個月",doses:4,currentDose:2,sideEffects:["發燒","注射部位紅腫疼痛","煩躁","嗜睡"]},{id:"rotavirus-4m",name:"口服輪狀病毒疫苗 第2劑",timing:"出生滿4個月",fundingType:"private",ageInMonths:4,ageLabel:"4個月",doses:2,currentDose:2,sideEffects:["輕微腹瀉","嘔吐","煩躁"],notes:"自費疫苗"},{id:"bcg-5m",name:"卡介苗",timing:"出生滿5個月",fundingType:"public",ageInMonths:5,ageLabel:"5個月",doses:1,currentDose:1,sideEffects:["注射部位紅腫結痂","可能形成疤痕"],notes:"預防結核病"},{id:"pentavalent-6m",name:"五合一疫苗 第3劑",timing:"出生滿6個月",fundingType:"public",ageInMonths:6,ageLabel:"6個月",doses:4,currentDose:3,sideEffects:["發燒","注射部位腫脹","煩躁不安","食慾下降"]},{id:"pneumococcal-12m",name:"13價肺炎鏈球菌疫苗 第3劑",timing:"出生滿12個月",fundingType:"public",ageInMonths:12,ageLabel:"12個月",doses:4,currentDose:3,sideEffects:["發燒","注射部位紅腫疼痛","煩躁","嗜睡"]},{id:"mmr-12m",name:"麻疹腮腺炎德國麻疹混合疫苗 第1劑",timing:"出生滿12個月",fundingType:"public",ageInMonths:12,ageLabel:"12個月",doses:2,currentDose:1,sideEffects:["發燒","出疹","注射部位腫痛"],notes:"可能在接種後5-12天出現發燒"},{id:"varicella-12m",name:"水痘疫苗 第1劑",timing:"出生滿12個月",fundingType:"public",ageInMonths:12,ageLabel:"12個月",doses:1,currentDose:1,sideEffects:["輕微發燒","注射部位紅疹"],notes:"保護力約85%"},{id:"hepa-12m",name:"A型肝炎疫苗 第1劑",timing:"出生滿12個月",fundingType:"public",ageInMonths:12,ageLabel:"12個月",doses:2,currentDose:1,sideEffects:["注射部位疼痛","疲倦","輕微發燒"]},{id:"flu-1y",name:"流感疫苗",timing:"滿6個月以上，每年接種",fundingType:"public",ageInMonths:6,ageLabel:"6個月起",doses:1,sideEffects:["注射部位痠痛","輕微發燒","疲倦"],notes:"每年10月開始接種"},{id:"pentavalent-18m",name:"五合一疫苗 第4劑",timing:"出生滿18個月",fundingType:"public",ageInMonths:18,ageLabel:"18個月",doses:4,currentDose:4,sideEffects:["發燒","注射部位腫脹","煩躁不安","食慾下降"]},{id:"hepa-18m",name:"A型肝炎疫苗 第2劑",timing:"出生滿18個月",fundingType:"public",ageInMonths:18,ageLabel:"18個月",doses:2,currentDose:2,sideEffects:["注射部位疼痛","疲倦","輕微發燒"]},{id:"je-15m",name:"日本腦炎疫苗 第1劑",timing:"出生滿15個月",fundingType:"public",ageInMonths:15,ageLabel:"15個月",doses:3,currentDose:1,sideEffects:["發燒","注射部位紅腫","頭痛"],notes:"間隔2週接種第2劑"},{id:"je-15m-2",name:"日本腦炎疫苗 第2劑",timing:"第1劑後2週",fundingType:"public",ageInMonths:15.5,ageLabel:"15個月後2週",doses:3,currentDose:2,sideEffects:["發燒","注射部位紅腫","頭痛"]},{id:"je-27m",name:"日本腦炎疫苗 第3劑",timing:"第1劑後12個月",fundingType:"public",ageInMonths:27,ageLabel:"27個月",doses:3,currentDose:3,sideEffects:["發燒","注射部位紅腫","頭痛"]},{id:"pneumococcal-2y",name:"13價肺炎鏈球菌疫苗 第4劑",timing:"2-5歲補接種",fundingType:"public",ageInMonths:24,ageLabel:"2歲",doses:4,currentDose:4,sideEffects:["發燒","注射部位紅腫疼痛","煩躁","嗜睡"],notes:"高風險幼兒追加"},{id:"mmr-5y",name:"麻疹腮腺炎德國麻疹混合疫苗 第2劑",timing:"滿5歲至入小學前",fundingType:"public",ageInMonths:60,ageLabel:"5歲",doses:2,currentDose:2,sideEffects:["發燒","出疹","注射部位腫痛"]},{id:"tdap-5y",name:"減量破傷風白喉非細胞性百日咳及不活化小兒麻痺混合疫苗",timing:"滿5歲至入小學前",fundingType:"public",ageInMonths:60,ageLabel:"5歲",doses:1,sideEffects:["注射部位痠痛腫脹","疲倦","輕微發燒"],notes:"俗稱四合一疫苗"},{id:"je-5y",name:"日本腦炎疫苗 第4劑",timing:"滿5歲至入小學前",fundingType:"public",ageInMonths:60,ageLabel:"5歲",doses:4,currentDose:4,sideEffects:["發燒","注射部位紅腫","頭痛"]},{id:"enterovirus",name:"腸病毒71型疫苗",timing:"出生滿2個月起",fundingType:"private",ageInMonths:2,ageLabel:"2個月起",doses:2,sideEffects:["注射部位紅腫","輕微發燒","煩躁"],notes:"自費疫苗，間隔2個月接種"}],LF=[{category:"常見輕微反應",icon:"Thermometer",reactions:[{symptom:"發燒（<38.5°C）",severity:"mild",response:"多喝水、穿著輕薄衣物、溫水擦拭身體"},{symptom:"注射部位紅腫疼痛",severity:"mild",response:"冰敷15-20分鐘，避免搓揉"},{symptom:"食慾不振、煩躁不安",severity:"mild",response:"少量多餐、多安撫、觀察1-2天"},{symptom:"嗜睡",severity:"mild",response:"讓寶寶充分休息，但需定時確認反應"}]},{category:"需密切觀察",icon:"AlertCircle",reactions:[{symptom:"持續高燒（≥38.5°C超過24小時）",severity:"moderate",response:"使用退燒藥（依醫囑），若超過48小時未退燒需就醫"},{symptom:"注射部位硬塊（>2公分）",severity:"moderate",response:"溫熱敷、輕柔按摩，若持續擴大需回診"},{symptom:"輕微出疹（麻疹、水痘疫苗）",severity:"moderate",response:"保持皮膚清潔乾燥，避免抓破，5-7天內會消退"}]},{category:"立即就醫",icon:"AlertTriangle",reactions:[{symptom:"高燒不退（>39°C）伴隨抽搐",severity:"severe",response:"立即送急診，保持呼吸道暢通"},{symptom:"呼吸困難、臉色蒼白、嘴唇發紫",severity:"severe",response:"疑似過敏性休克，立即叫救護車"},{symptom:"持續嘔吐、嚴重腹瀉（輪狀病毒疫苗）",severity:"severe",response:"可能腸套疊，立即就醫"},{symptom:"活動力極差、不吃不喝超過8小時",severity:"severe",response:"立即就醫檢查"}]}],CF=[{id:"seizure",symptom:"抽搐或痙攣",icon:"Zap",action:"保持側臥、移除周圍危險物品、記錄時間長度、立即送急診"},{id:"anaphylaxis",symptom:"全身起疹、呼吸困難、嘴唇腫脹",icon:"AlertOctagon",action:"疑似過敏性休克，立即撥打119並平躺抬高雙腳"},{id:"intussusception",symptom:"嚴重腹痛、血便、果醬狀大便",icon:"Activity",action:"可能腸套疊（輪狀病毒疫苗罕見併發症），立即急診"},{id:"high-fever",symptom:"持續高燒>40°C",icon:"Flame",action:"冰枕降溫、給予退燒藥後立即就醫"},{id:"lethargy",symptom:"極度嗜睡、無法喚醒",icon:"Moon",action:"立即送急診，可能有神經系統反應"}],SF=[{title:"暫緩接種",items:["正在發燒（體溫≥38°C）","中重度急性疾病","正在使用免疫抑制劑","近期接受過輸血或免疫球蛋白"]},{title:"絕對禁忌",items:["曾對該疫苗成分產生嚴重過敏","接種後曾發生過敏性休克","免疫不全者不可接種活性減毒疫苗（麻疹、水痘、卡介苗）"]},{title:"接種後注意",items:["留院觀察30分鐘，確認無立即過敏反應","24小時內避免劇烈運動","注射部位保持清潔乾燥","記錄接種日期與疫苗批號"]}];function IF(){const[e,t]=L.useState("all"),[n,a]=L.useState(null),[r,o]=L.useState(!1),[s,c]=L.useState(!1),l=L.useMemo(()=>e==="all"?FI:FI.filter(y=>y.fundingType===e),[e]),d=y=>{a(n===y?null:y)},u=y=>{switch(y){case"mild":return"bg-green-100 text-green-700";case"moderate":return"bg-yellow-100 text-yellow-700";case"severe":return"bg-red-100 text-red-700";default:return"bg-gray-100 text-gray-700"}};return h.jsxs("div",{className:"min-h-screen bg-warm-white pb-6",children:[h.jsxs("div",{className:"bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[h.jsx(ca,{className:"w-6 h-6 text-primary"}),h.jsx("h2",{className:"text-xl font-bold text-gray-800",children:"疫苗接種時程表"})]}),h.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"依照衛福部建議時程，記錄寶寶的疫苗接種狀況"}),h.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[h.jsxs("button",{onClick:()=>o(!0),className:"flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium",children:[h.jsx(Ut,{className:"w-4 h-4"}),h.jsx("span",{children:"緊急狀況處理"})]}),h.jsxs("button",{onClick:()=>c(!0),className:"flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium",children:[h.jsx(w1,{className:"w-4 h-4"}),h.jsx("span",{children:"接種注意事項"})]})]})]}),h.jsxs("div",{className:"px-4 mb-4",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[h.jsx(sa,{className:"w-5 h-5 text-gray-600"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"篩選疫苗類型"})]}),h.jsxs("div",{className:"flex gap-2",children:[h.jsx("button",{onClick:()=>t("all"),className:`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all
              ${e==="all"?"bg-secondary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"全部疫苗"}),h.jsx("button",{onClick:()=>t("public"),className:`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all
              ${e==="public"?"bg-green-500 text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"公費疫苗"}),h.jsx("button",{onClick:()=>t("private"),className:`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all
              ${e==="private"?"bg-orange-500 text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"自費疫苗"})]})]}),h.jsxs("div",{className:"px-4",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(m1,{className:"w-5 h-5 text-gray-600"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"接種時程"}),h.jsxs("span",{className:"text-sm text-gray-500",children:["（共 ",l.length," 項）"]})]}),h.jsx("div",{className:"space-y-3",children:h.jsx(Qe,{mode:"popLayout",children:l.map((y,p)=>{const m=n===y.id;return h.jsx(U.div,{layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.2,delay:p*.02},className:"card cursor-pointer",onClick:()=>d(y.id),children:h.jsxs("div",{className:"flex items-start gap-3",children:[h.jsxs("div",{className:`
                      w-16 h-16 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-white font-bold text-xs
                      ${y.fundingType==="public"?"bg-gradient-to-br from-green-400 to-green-600":"bg-gradient-to-br from-orange-400 to-orange-600"}
                    `,children:[h.jsx("div",{className:"text-lg",children:y.ageInMonths||0}),h.jsx("div",{className:"text-[10px] opacity-90",children:"個月"})]}),h.jsxs("div",{className:"flex-1 min-w-0",children:[h.jsxs("div",{className:"flex items-start justify-between gap-2 mb-1",children:[h.jsx("h4",{className:"font-semibold text-gray-800 leading-tight",children:y.name}),h.jsx(U.div,{animate:{rotate:m?180:0},transition:{duration:.2},children:h.jsx(ra,{className:"w-5 h-5 text-gray-400 flex-shrink-0"})})]}),h.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2",children:[h.jsxs("span",{className:"flex items-center gap-1",children:[h.jsx(oa,{className:"w-3 h-3"}),y.timing]}),h.jsx("span",{className:`
                          px-2 py-0.5 rounded-full font-medium
                          ${y.fundingType==="public"?"bg-green-100 text-green-700":"bg-orange-100 text-orange-700"}
                        `,children:y.fundingType==="public"?"公費":"自費"}),y.doses>1&&h.jsxs("span",{className:"text-gray-500",children:["第 ",y.currentDose,"/",y.doses," 劑"]})]}),y.notes&&h.jsx("p",{className:"text-xs text-gray-500 italic",children:y.notes}),h.jsx(Qe,{children:m&&h.jsx(U.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.2},className:"mt-3 pt-3 border-t border-gray-100",children:h.jsxs("div",{className:"space-y-2",children:[h.jsxs("div",{className:"flex items-center gap-2 text-sm font-medium text-gray-700",children:[h.jsx(ia,{className:"w-4 h-4 text-primary"}),h.jsx("span",{children:"可能的副作用"})]}),h.jsx("ul",{className:"space-y-1 ml-6",children:y.sideEffects.map((v,x)=>h.jsxs("li",{className:"text-sm text-gray-600 flex gap-2",children:[h.jsx("span",{className:"text-primary",children:"•"}),h.jsx("span",{children:v})]},x))})]})})})]})]})},y.id)})})})]}),h.jsxs("div",{className:"px-4 mt-6",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(ai,{className:"w-5 h-5 text-gray-600"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"副作用處理指南"})]}),h.jsx("div",{className:"space-y-3",children:LF.map(y=>{const p=b1[y.icon];return h.jsxs("div",{className:"card",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[p&&h.jsx(p,{className:"w-5 h-5 text-primary"}),h.jsx("h4",{className:"font-semibold text-gray-800",children:y.category})]}),h.jsx("div",{className:"space-y-2",children:y.reactions.map((m,v)=>h.jsxs("div",{className:"flex gap-3 text-sm",children:[h.jsx("span",{className:`
                        px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap h-fit
                        ${u(m.severity)}
                      `,children:m.symptom}),h.jsx("p",{className:"text-gray-600 flex-1",children:m.response})]},v))})]},y.category)})})]}),h.jsx(Qe,{children:r&&h.jsxs(h.Fragment,{children:[h.jsx(U.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>o(!1),className:"fixed inset-0 bg-black/50 z-40"}),h.jsxs(U.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto",children:[h.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[h.jsxs("div",{className:"flex items-center gap-2",children:[h.jsx(Ut,{className:"w-6 h-6 text-red-600"}),h.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"緊急狀況處理"})]}),h.jsx("button",{onClick:()=>o(!1),className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",children:h.jsx(lt,{className:"w-5 h-5 text-gray-600"})})]}),h.jsx("div",{className:"p-4 space-y-3",children:CF.map(y=>{const p=b1[y.icon];return h.jsx("div",{className:"bg-red-50 border-2 border-red-200 rounded-2xl p-4",children:h.jsxs("div",{className:"flex items-start gap-3",children:[p&&h.jsx("div",{className:"w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0",children:h.jsx(p,{className:"w-5 h-5 text-red-600"})}),h.jsxs("div",{className:"flex-1",children:[h.jsx("h4",{className:"font-semibold text-red-900 mb-1",children:y.symptom}),h.jsx("p",{className:"text-sm text-red-700",children:y.action})]})]})},y.id)})})]})]})}),h.jsx(Qe,{children:s&&h.jsxs(h.Fragment,{children:[h.jsx(U.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>c(!1),className:"fixed inset-0 bg-black/50 z-40"}),h.jsxs(U.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto",children:[h.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[h.jsxs("div",{className:"flex items-center gap-2",children:[h.jsx(w1,{className:"w-6 h-6 text-blue-600"}),h.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"接種禁忌與注意事項"})]}),h.jsx("button",{onClick:()=>c(!1),className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",children:h.jsx(lt,{className:"w-5 h-5 text-gray-600"})})]}),h.jsx("div",{className:"p-4 space-y-4",children:SF.map((y,p)=>h.jsxs("div",{className:"card",children:[h.jsx("h4",{className:"font-semibold text-gray-800 mb-3",children:y.title}),h.jsx("ul",{className:"space-y-2",children:y.items.map((m,v)=>h.jsxs("li",{className:"flex gap-2 text-sm text-gray-700",children:[h.jsx(g1,{className:"w-4 h-4 text-primary flex-shrink-0 mt-0.5"}),h.jsx("span",{children:m})]},v))})]},p))})]})]})})]})}const jF=[{level:1,name:"啟蒙期",ageRange:"4-6個月",milkRatio:"70-90%",foodRatio:"10-30%",mealsPerDay:"一天一餐",texture:"壓爛或剪碎",keyPoints:["以嘗試少量多樣化的天然食材為主","食物需壓爛或剪碎","不加重鹹糖味","奶水仍是主要營養來源","練習吞嚥與多樣化試敏"],warnings:[]},{level:2,name:"探索期",ageRange:"7-9個月",milkRatio:"60-70%",foodRatio:"30-40%",mealsPerDay:"一天至少兩餐",texture:"泥狀、糊狀到軟塊狀",keyPoints:["讓寶寶體驗不同質地的食物","鍛鍊咀嚼力","副食品比例提高","補充鐵質"],warnings:["嚴禁餵食蜂蜜（有肉毒桿菌風險）","嚴禁整顆硬堅果（有噎到風險）"]},{level:3,name:"進階期",ageRange:"10-12個月",milkRatio:"30-40%",foodRatio:"60-70%",mealsPerDay:"一天三餐起跳",texture:"更多樣形狀（如長條形）",keyPoints:["提供好抓握的食物","練習精細動作","副食品比重開始超過奶量","奶水轉變為點心性質","把主導權還給孩子，不強迫餵食"],warnings:[]}],PF=[{ageRange:"4-6個月",texture:"極稀流質/泥狀（十倍粥、十倍粥泥）",frequency:"1天1次（少量1-2匙開始）",purpose:"練習舌頭後推與吞嚥"},{ageRange:"7-9個月",texture:"濃稠泥/小顆粒粥（七倍粥、剁碎蔬菜）",frequency:"1天2次（逐漸取代一餐奶）",purpose:"練習用舌頭與牙齦壓碎食物"},{ageRange:"10-12個月",texture:"軟塊/手指食物（五倍粥、軟飯、丁狀肉）",frequency:"1天3次（與成人用餐同步）",purpose:"練習咀嚼能力與手眼協調"}],bF=[{level:"low",ageRange:"4-6個月開始",foods:["白米","南瓜","地瓜","胡蘿蔔","高麗菜","蘋果","香蕉"]},{level:"medium",ageRange:"7-9個月開始",foods:["蛋黃（先）","豆腐","白肉魚（鱈魚、鯛魚）","雞肉","大麥","燕麥"]},{level:"high",ageRange:"10個月+ 或少量嘗試",foods:["全蛋（蛋白）","帶殼海鮮（蝦蟹）","花生醬（需稀釋）","奇異果","草莓","番茄"]}],AF=[{month:"4-5個月",focus:"澱粉、根莖",foods:["十倍粥泥","地瓜泥","南瓜泥","紅蘿蔔泥"]},{month:"6個月",focus:"葉菜、基本水果",foods:["青江菜泥","高麗菜泥","蘋果泥","香蕉泥"]},{month:"7-8個月",focus:"植物與禽類蛋白",foods:["蛋黃泥","豆腐泥","雞肉泥","燕麥粥"]},{month:"9-10個月",focus:"魚類、紅肉、全蛋",foods:["鮭魚碎肉","牛肉泥","全蛋（蒸蛋）","細麵"]},{month:"11-12個月",focus:"多樣化成人食材",foods:["軟飯","小餛飩","起司","優格","剪碎的家常菜"]}],zF=[{category:"蔬菜類",examples:["蒸熟的紅蘿蔔條","綠花椰菜（帶梗方便抓）","南瓜塊","玉米筍（煮極軟）"]},{category:"水果類",examples:["香蕉段（切半）","酪梨條","去皮切片的軟柿或水蜜桃"]},{category:"澱粉類",examples:["烤過的吐司條（去邊）","軟質飯糰","煮軟的螺旋麵"]},{category:"蛋白類",examples:["漢堡排（碎肉壓製）","厚片蛋餅"]}],VF=[{id:"early-start",title:"四個月就可以開始吃副食品",description:"把握4-9個月免疫耐受性黃金時期，及早接觸反而能降低過敏機率",icon:"Calendar"},{id:"no-delay",title:"父母有過敏體質也不需延後",description:"現代醫學已證實，太晚給副食品非但不能減少過敏，反而可能提高",icon:"ShieldCheck"},{id:"natural-foods",title:"一歲前除蜂蜜外都可嘗試",description:"什麼天然食物都可以添加，除非吃了產生過敏症狀。少量多樣化最重要",icon:"Leaf"}],HF=[{id:"honey",title:"1歲前嚴禁蜂蜜",description:"含有肉毒桿菌孢子，可能對嬰兒造成致命威脅",icon:"AlertOctagon",severity:"danger"},{id:"choking-hazards",title:"避開窒息風險食物",description:"整顆葡萄、硬堅果、麻糬等黏性強或圓形硬物絕對禁止",icon:"AlertTriangle",severity:"danger"},{id:"no-seasoning",title:"不額外加鹽糖",description:"寶寶腎臟尚未發育完全，且要培養天然口味，避免未來挑食或重口味",icon:"XCircle",severity:"warning"},{id:"iron-supplement",title:"補鐵是關鍵",description:"6個月後母乳鐵質不足，應優先提供蛋黃、紅肉、豬肝泥或強化鐵質的米精",icon:"Droplet",severity:"info"},{id:"water",title:"水分補充",description:"開始副食品後可給予少量飲水（一次30-50ml），主要是為了漱口與習慣味道",icon:"Droplets",severity:"info"}],sr={name:"4x3 試敏法",description:"早期接觸（4-9個月內）反而能建立免疫耐受性，降低未來過敏機率",steps:[{step:1,title:"小量試3天",description:"第一天給一小口，觀察是否有紅疹、腹瀉、嘔吐"},{step:2,title:"增量試3天",description:"若無反應，第二天增加份量，持續觀察"},{step:3,title:"觀察3天",description:"停止新食材，觀察是否有延遲性過敏"}],principle:"每次只試「一種」新食材，若發生過敏，記錄並暫停該食材1-2個月再試"},Y9={title:"手指食物（BLW）挑選3大原則",ageRange:"7-8個月起",principles:[{name:"尺寸",description:"長度約為寶寶握緊拳頭後露出2-3公分（像粗薯條），方便抓握"},{name:"硬度",description:"父母用大拇指與食指能輕易壓碎的程度（如煮熟的紅蘿蔔）"},{name:"安全性",description:"絕對避開圓形（整顆葡萄）、硬殼（堅果）、黏性強（麻糬、蛋黃乾吃）的食物"}]},TF=[{id:"puree",name:"食物泥",description:"將食材打成泥狀，適合初期嘗試"},{id:"traditional",name:"傳統泥粥漸進法",description:"從十倍粥開始，逐步增加濃稠度"},{id:"blw",name:"BLW（寶寶主導式離乳法）",description:"提供手指食物，讓寶寶自己抓取進食"},{id:"follow-parents",name:"少量多樣化，跟著大人吃",description:"最推薦的方法，與家人同步用餐，培養良好飲食習慣"}],qF=["寶寶滿四個月大","寶寶會對大人食物睜大眼睛","開始表現出對大人食物感興趣","脖子能撐住、能坐穩","出現咀嚼動作"];function DF(){const[e,t]=L.useState("overview"),[n,a]=L.useState(!1),[r,o]=L.useState(!1),[s,c]=L.useState(null),l=u=>{switch(u){case"danger":return"bg-red-50 border-red-200 text-red-800";case"warning":return"bg-yellow-50 border-yellow-200 text-yellow-800";case"info":return"bg-blue-50 border-blue-200 text-blue-800";default:return"bg-gray-50 border-gray-200 text-gray-800"}},d=u=>{switch(u){case"low":return"bg-green-100 text-green-700";case"medium":return"bg-yellow-100 text-yellow-700";case"high":return"bg-orange-100 text-orange-700";default:return"bg-gray-100 text-gray-700"}};return h.jsxs("div",{className:"min-h-screen bg-warm-white pb-6",children:[h.jsxs("div",{className:"bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[h.jsx(da,{className:"w-6 h-6 text-primary"}),h.jsx("h2",{className:"text-xl font-bold text-gray-800",children:"副食品指南"})]}),h.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"4-12個月寶寶的副食品添加完整攻略"}),h.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[h.jsxs("button",{onClick:()=>a(!0),className:"flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium",children:[h.jsx(la,{className:"w-4 h-4"}),h.jsx("span",{children:"4x3 試敏法"})]}),h.jsxs("button",{onClick:()=>o(!0),className:"flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium",children:[h.jsx(x1,{className:"w-4 h-4"}),h.jsx("span",{children:"手指食物指南"})]})]})]}),h.jsx("div",{className:"px-4 mb-4",children:h.jsxs("div",{className:"flex gap-2 overflow-x-auto pb-2",children:[h.jsx("button",{onClick:()=>t("overview"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="overview"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"總覽"}),h.jsx("button",{onClick:()=>t("stages"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="stages"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"發展階段"}),h.jsx("button",{onClick:()=>t("menu"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="menu"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"菜單建議"}),h.jsx("button",{onClick:()=>t("safety"),className:`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${e==="safety"?"bg-primary text-white shadow-soft":"bg-white text-gray-600 hover:bg-gray-50"}
            `,children:"安全須知"})]})}),e==="overview"&&h.jsxs("div",{className:"px-4 space-y-6",children:[h.jsxs("div",{children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(M1,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"副食品添加三大原則"})]}),h.jsx("div",{className:"space-y-3",children:VF.map(u=>{const y=b1[u.icon];return h.jsx(U.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"card",children:h.jsxs("div",{className:"flex gap-3",children:[y&&h.jsx("div",{className:"w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0",children:h.jsx(y,{className:"w-5 h-5 text-primary"})}),h.jsxs("div",{className:"flex-1",children:[h.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:u.title}),h.jsx("p",{className:"text-sm text-gray-600",children:u.description})]})]})},u.id)})})]}),h.jsxs("div",{children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(ei,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"開始副食品的時機"})]}),h.jsx("div",{className:"card",children:h.jsx("ul",{className:"space-y-2",children:qF.map((u,y)=>h.jsxs("li",{className:"flex gap-2 text-sm text-gray-700",children:[h.jsx(v1,{className:"w-4 h-4 text-primary flex-shrink-0 mt-0.5"}),h.jsx("span",{children:u})]},y))})})]}),h.jsxs("div",{children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(ri,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"常見副食品餵食法"})]}),h.jsx("div",{className:"space-y-2",children:TF.map(u=>h.jsxs("div",{className:"card",children:[h.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:u.name}),h.jsx("p",{className:"text-sm text-gray-600",children:u.description})]},u.id))})]}),h.jsxs("div",{children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(ii,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"質地與頻率轉變"})]}),h.jsx("div",{className:"space-y-3",children:PF.map((u,y)=>h.jsx("div",{className:"card bg-gradient-to-r from-secondary/5 to-transparent",children:h.jsxs("div",{className:"flex items-start gap-3",children:[h.jsx("div",{className:"w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0 font-bold text-secondary",children:y+1}),h.jsxs("div",{className:"flex-1",children:[h.jsx("div",{className:"font-semibold text-gray-800 mb-1",children:u.ageRange}),h.jsxs("div",{className:"text-sm text-gray-600 space-y-1",children:[h.jsxs("div",{children:[h.jsx("span",{className:"font-medium",children:"質地："}),u.texture]}),h.jsxs("div",{children:[h.jsx("span",{className:"font-medium",children:"頻率："}),u.frequency]}),h.jsxs("div",{children:[h.jsx("span",{className:"font-medium",children:"目的："}),u.purpose]})]})]})]})},y))})]})]}),e==="stages"&&h.jsxs("div",{className:"px-4",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(Ya,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"副食品與奶量轉換三階段"})]}),h.jsx("div",{className:"space-y-3",children:jF.map(u=>{const y=s===u.level;return h.jsx(U.div,{layout:!0,className:"card cursor-pointer",onClick:()=>c(y?null:u.level),children:h.jsxs("div",{className:"flex items-start gap-3",children:[h.jsxs("div",{className:"w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center text-white font-bold flex-shrink-0",children:[h.jsx("div",{className:"text-xs opacity-90",children:"Level"}),h.jsx("div",{className:"text-2xl",children:u.level})]}),h.jsxs("div",{className:"flex-1",children:[h.jsxs("div",{className:"flex items-start justify-between gap-2 mb-2",children:[h.jsxs("div",{children:[h.jsx("h4",{className:"font-bold text-gray-800",children:u.name}),h.jsx("p",{className:"text-sm text-gray-600",children:u.ageRange})]}),h.jsx(U.div,{animate:{rotate:y?180:0},transition:{duration:.2},children:h.jsx(ra,{className:"w-5 h-5 text-gray-400"})})]}),h.jsxs("div",{className:"grid grid-cols-2 gap-2 text-xs mb-2",children:[h.jsxs("div",{className:"bg-blue-50 px-2 py-1 rounded",children:[h.jsx("span",{className:"text-blue-600",children:"奶："}),h.jsx("span",{className:"font-medium text-blue-800",children:u.milkRatio})]}),h.jsxs("div",{className:"bg-green-50 px-2 py-1 rounded",children:[h.jsx("span",{className:"text-green-600",children:"副食品："}),h.jsx("span",{className:"font-medium text-green-800",children:u.foodRatio})]})]}),h.jsxs("div",{className:"flex items-center gap-2 text-xs text-gray-600",children:[h.jsx(oa,{className:"w-3 h-3"}),h.jsx("span",{children:u.mealsPerDay}),h.jsx("span",{className:"mx-1",children:"•"}),h.jsx("span",{children:u.texture})]}),h.jsx(Qe,{children:y&&h.jsxs(U.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.2},className:"mt-3 pt-3 border-t border-gray-100 space-y-3",children:[h.jsxs("div",{children:[h.jsx("div",{className:"text-sm font-medium text-gray-700 mb-2",children:"重點提示"}),h.jsx("ul",{className:"space-y-1",children:u.keyPoints.map((p,m)=>h.jsxs("li",{className:"text-sm text-gray-600 flex gap-2",children:[h.jsx(Ka,{className:"w-4 h-4 text-primary flex-shrink-0"}),h.jsx("span",{children:p})]},m))})]}),u.warnings&&u.warnings.length>0&&h.jsxs("div",{className:"bg-red-50 border border-red-200 rounded-xl p-3",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[h.jsx(Ut,{className:"w-4 h-4 text-red-600"}),h.jsx("span",{className:"text-sm font-medium text-red-800",children:"特別注意"})]}),h.jsx("ul",{className:"space-y-1",children:u.warnings.map((p,m)=>h.jsxs("li",{className:"text-sm text-red-700",children:["• ",p]},m))})]})]})})]})]})},u.level)})})]}),e==="menu"&&h.jsxs("div",{className:"px-4 space-y-6",children:[h.jsxs("div",{children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx($a,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"試敏菜單與月份推薦"})]}),h.jsx("div",{className:"space-y-3",children:AF.map((u,y)=>h.jsxs(U.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:y*.05},className:"card",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[h.jsx("div",{className:"w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center",children:h.jsx(m1,{className:"w-4 h-4 text-primary"})}),h.jsxs("div",{children:[h.jsx("h4",{className:"font-semibold text-gray-800",children:u.month}),h.jsxs("p",{className:"text-xs text-gray-600",children:["重點：",u.focus]})]})]}),h.jsx("div",{className:"flex flex-wrap gap-2",children:u.foods.map((p,m)=>h.jsx("span",{className:"px-2 py-1 bg-secondary/10 text-secondary rounded-lg text-xs font-medium",children:p},m))})]},y))})]}),h.jsxs("div",{children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(w1,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"食物過敏程度分類"})]}),h.jsx("div",{className:"space-y-3",children:bF.map(u=>h.jsxs("div",{className:"card",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[h.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-bold ${d(u.level)}`,children:u.level==="low"?"低敏":u.level==="medium"?"中敏":"高敏"}),h.jsx("span",{className:"text-sm text-gray-600",children:u.ageRange})]}),h.jsx("div",{className:"flex flex-wrap gap-2",children:u.foods.map((y,p)=>h.jsx("span",{className:"text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded",children:y},p))})]},u.level))})]}),h.jsxs("div",{children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(x1,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"手指食物推薦（7-8個月起）"})]}),h.jsx("div",{className:"space-y-2",children:zF.map(u=>h.jsxs("div",{className:"card",children:[h.jsx("h4",{className:"font-semibold text-gray-800 mb-2",children:u.category}),h.jsx("div",{className:"flex flex-wrap gap-2",children:u.examples.map((y,p)=>h.jsx("span",{className:"text-sm text-gray-700 bg-orange-50 px-2 py-1 rounded",children:y},p))})]},u.category))})]})]}),e==="safety"&&h.jsxs("div",{className:"px-4",children:[h.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[h.jsx(ni,{className:"w-5 h-5 text-primary"}),h.jsx("h3",{className:"font-semibold text-gray-800",children:"專業提醒與禁忌"})]}),h.jsx("div",{className:"space-y-3",children:HF.map(u=>{const y=b1[u.icon];return h.jsx(U.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},className:`card border-2 ${l(u.severity)}`,children:h.jsxs("div",{className:"flex gap-3",children:[y&&h.jsx("div",{className:"flex-shrink-0",children:h.jsx(y,{className:"w-6 h-6"})}),h.jsxs("div",{className:"flex-1",children:[h.jsx("h4",{className:"font-bold mb-1",children:u.title}),h.jsx("p",{className:"text-sm",children:u.description})]})]})},u.id)})})]}),h.jsx(Qe,{children:n&&h.jsxs(h.Fragment,{children:[h.jsx(U.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>a(!1),className:"fixed inset-0 bg-black/50 z-40"}),h.jsxs(U.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto",children:[h.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[h.jsxs("div",{className:"flex items-center gap-2",children:[h.jsx(la,{className:"w-6 h-6 text-purple-600"}),h.jsx("h3",{className:"text-lg font-bold text-gray-800",children:sr.name})]}),h.jsx("button",{onClick:()=>a(!1),className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",children:h.jsx(lt,{className:"w-5 h-5 text-gray-600"})})]}),h.jsxs("div",{className:"p-4 space-y-4",children:[h.jsx("div",{className:"bg-purple-50 border border-purple-200 rounded-2xl p-4",children:h.jsx("p",{className:"text-sm text-purple-800",children:sr.description})}),sr.steps.map(u=>h.jsx("div",{className:"card",children:h.jsxs("div",{className:"flex gap-3",children:[h.jsx("div",{className:"w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 font-bold text-purple-700",children:u.step}),h.jsxs("div",{className:"flex-1",children:[h.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:u.title}),h.jsx("p",{className:"text-sm text-gray-600",children:u.description})]})]})},u.step)),h.jsx("div",{className:"bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4",children:h.jsxs("div",{className:"flex items-start gap-2",children:[h.jsx(M1,{className:"w-5 h-5 text-yellow-600 flex-shrink-0"}),h.jsx("p",{className:"text-sm text-yellow-800 font-medium",children:sr.principle})]})})]})]})]})}),h.jsx(Qe,{children:r&&h.jsxs(h.Fragment,{children:[h.jsx(U.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>o(!1),className:"fixed inset-0 bg-black/50 z-40"}),h.jsxs(U.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30,stiffness:300},className:"fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto",children:[h.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between",children:[h.jsxs("div",{className:"flex items-center gap-2",children:[h.jsx(x1,{className:"w-6 h-6 text-orange-600"}),h.jsx("h3",{className:"text-lg font-bold text-gray-800",children:Y9.title})]}),h.jsx("button",{onClick:()=>o(!1),className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",children:h.jsx(lt,{className:"w-5 h-5 text-gray-600"})})]}),h.jsxs("div",{className:"p-4 space-y-4",children:[h.jsx("div",{className:"bg-orange-50 border border-orange-200 rounded-2xl p-4",children:h.jsxs("p",{className:"text-sm text-orange-800 font-medium",children:["適用年齡：",Y9.ageRange]})}),Y9.principles.map((u,y)=>h.jsx("div",{className:"card",children:h.jsxs("div",{className:"flex gap-3",children:[h.jsx("div",{className:"w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0",children:h.jsx(g1,{className:"w-5 h-5 text-orange-600"})}),h.jsxs("div",{className:"flex-1",children:[h.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:u.name}),h.jsx("p",{className:"text-sm text-gray-600",children:u.description})]})]})},y))]})]})]})})]})}function FF(){const[e,t]=L.useState("milestones"),[n,a]=L.useState(!1),[r,o]=XV("milestones-progress",{}),s=l=>{o(d=>({...d,[l]:!d[l]}))},c=()=>{switch(e){case"milestones":return"里程碑追蹤";case"care-guide":return"照顧重點";case"vaccine-tracking":return"疫苗追蹤";case"complementary-food":return"副食品指南";default:return"LittleSteps"}};return h.jsxs("div",{className:"min-h-screen bg-warm-white",children:[h.jsx(uF,{isOpen:n,onClose:()=>a(!1),currentPage:e,onNavigate:t}),h.jsx("header",{className:"bg-white shadow-soft sticky top-0 z-10",children:h.jsxs("div",{className:"px-4 py-4 flex items-center gap-4",children:[h.jsx("button",{onClick:()=>a(!0),className:"w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center",children:h.jsx(Ja,{className:"w-5 h-5 text-gray-700"})}),h.jsx("h1",{className:"text-2xl font-bold text-primary flex-1",children:c()})]})}),h.jsxs("main",{className:"pb-6",children:[e==="milestones"&&h.jsx(xF,{progress:r,onToggleMilestone:s}),e==="care-guide"&&h.jsx(wF,{}),e==="vaccine-tracking"&&h.jsx(IF,{}),e==="complementary-food"&&h.jsx(DF,{})]})]})}J9.createRoot(document.getElementById("root")).render(h.jsx(lL.StrictMode,{children:h.jsx(FF,{})}));
