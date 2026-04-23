/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 714
(module) {

!function(t,n){ true?module.exports=n():0}(this,function(){function t(t,n){for(var r=0;r<n.length;r++){var i=n[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,"symbol"==typeof(e=function(t,n){if("object"!=typeof t||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var i=r.call(t,"string");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(i.key))?e:String(e),i)}var e}function n(n,r,i){return r&&t(n.prototype,r),i&&t(n,i),Object.defineProperty(n,"prototype",{writable:!1}),n}function r(){return r=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},r.apply(this,arguments)}function i(t,n){t.prototype=Object.create(n.prototype),t.prototype.constructor=t,o(t,n)}function e(t){return e=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},e(t)}function o(t,n){return o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},o(t,n)}function u(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}function s(t,n,r){return s=u()?Reflect.construct.bind():function(t,n,r){var i=[null];i.push.apply(i,n);var e=new(Function.bind.apply(t,i));return r&&o(e,r.prototype),e},s.apply(null,arguments)}function f(t){var n="function"==typeof Map?new Map:void 0;return f=function(t){if(null===t||-1===Function.toString.call(t).indexOf("[native code]"))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(t))return n.get(t);n.set(t,r)}function r(){return s(t,arguments,e(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),o(r,t)},f(t)}function c(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var a,h=function(){this.before=void 0,this.beforeLeave=void 0,this.leave=void 0,this.afterLeave=void 0,this.beforeEnter=void 0,this.enter=void 0,this.afterEnter=void 0,this.after=void 0};!function(t){t[t.off=0]="off",t[t.error=1]="error",t[t.warning=2]="warning",t[t.info=3]="info",t[t.debug=4]="debug"}(a||(a={}));var v=a.off,d=/*#__PURE__*/function(){function t(t){this.t=void 0,this.t=t}t.getLevel=function(){return v},t.setLevel=function(t){return v=a[t]};var n=t.prototype;return n.error=function(){this.i(console.error,a.error,[].slice.call(arguments))},n.warn=function(){this.i(console.warn,a.warning,[].slice.call(arguments))},n.info=function(){this.i(console.info,a.info,[].slice.call(arguments))},n.debug=function(){this.i(console.log,a.debug,[].slice.call(arguments))},n.i=function(n,r,i){r<=t.getLevel()&&n.apply(console,["["+this.t+"] "].concat(i))},t}();function l(t){return t.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function p(t){return t&&t.sensitive?"":"i"}var m={container:"container",history:"history",namespace:"namespace",prefix:"data-barba",prevent:"prevent",wrapper:"wrapper"},w=/*#__PURE__*/function(){function t(){this.o=m,this.u=void 0,this.h={after:null,before:null,parent:null}}var n=t.prototype;return n.toString=function(t){return t.outerHTML},n.toDocument=function(t){return this.u||(this.u=new DOMParser),this.u.parseFromString(t,"text/html")},n.toElement=function(t){var n=document.createElement("div");return n.innerHTML=t,n},n.getHtml=function(t){return void 0===t&&(t=document),this.toString(t.documentElement)},n.getWrapper=function(t){return void 0===t&&(t=document),t.querySelector("["+this.o.prefix+'="'+this.o.wrapper+'"]')},n.getContainer=function(t){return void 0===t&&(t=document),t.querySelector("["+this.o.prefix+'="'+this.o.container+'"]')},n.removeContainer=function(t){document.body.contains(t)&&(this.v(t),t.parentNode.removeChild(t))},n.addContainer=function(t,n){var r=this.getContainer()||this.h.before;r?this.l(t,r):this.h.after?this.h.after.parentNode.insertBefore(t,this.h.after):this.h.parent?this.h.parent.appendChild(t):n.appendChild(t)},n.getSibling=function(){return this.h},n.getNamespace=function(t){void 0===t&&(t=document);var n=t.querySelector("["+this.o.prefix+"-"+this.o.namespace+"]");return n?n.getAttribute(this.o.prefix+"-"+this.o.namespace):null},n.getHref=function(t){if(t.tagName&&"a"===t.tagName.toLowerCase()){if("string"==typeof t.href)return t.href;var n=t.getAttribute("href")||t.getAttribute("xlink:href");if(n)return this.resolveUrl(n.baseVal||n)}return null},n.resolveUrl=function(){var t=[].slice.call(arguments).length;if(0===t)throw new Error("resolveUrl requires at least one argument; got none.");var n=document.createElement("base");if(n.href=arguments[0],1===t)return n.href;var r=document.getElementsByTagName("head")[0];r.insertBefore(n,r.firstChild);for(var i,e=document.createElement("a"),o=1;o<t;o++)e.href=arguments[o],n.href=i=e.href;return r.removeChild(n),i},n.l=function(t,n){n.parentNode.insertBefore(t,n.nextSibling)},n.v=function(t){return this.h={after:t.nextElementSibling,before:t.previousElementSibling,parent:t.parentElement},this.h},t}(),b=new w,y=/*#__PURE__*/function(){function t(){this.p=void 0,this.m=[],this.P=-1}var i=t.prototype;return i.init=function(t,n){this.p="barba";var r={data:{},ns:n,scroll:{x:window.scrollX,y:window.scrollY},url:t};this.P=0,this.m.push(r);var i={from:this.p,index:this.P,states:[].concat(this.m)};window.history&&window.history.replaceState(i,"",t)},i.change=function(t,n,r){if(r&&r.state){var i=r.state,e=i.index;n=this.g(this.P-e),this.replace(i.states),this.P=e}else this.add(t,n);return n},i.add=function(t,n,r,i){var e=null!=r?r:this.R(n),o={data:null!=i?i:{},ns:"tmp",scroll:{x:window.scrollX,y:window.scrollY},url:t};switch(e){case"push":this.P=this.size,this.m.push(o);break;case"replace":this.set(this.P,o)}var u={from:this.p,index:this.P,states:[].concat(this.m)};switch(e){case"push":window.history&&window.history.pushState(u,"",t);break;case"replace":window.history&&window.history.replaceState(u,"",t)}},i.store=function(t,n){var i=n||this.P,e=this.get(i);e.data=r({},e.data,t),this.set(i,e);var o={from:this.p,index:this.P,states:[].concat(this.m)};window.history.replaceState(o,"")},i.update=function(t,n){var i=n||this.P,e=r({},this.get(i),t);this.set(i,e)},i.remove=function(t){t?this.m.splice(t,1):this.m.pop(),this.P--},i.clear=function(){this.m=[],this.P=-1},i.replace=function(t){this.m=t},i.get=function(t){return this.m[t]},i.set=function(t,n){return this.m[t]=n},i.R=function(t){var n="push",r=t,i=m.prefix+"-"+m.history;return r.hasAttribute&&r.hasAttribute(i)&&(n=r.getAttribute(i)),n},i.g=function(t){return Math.abs(t)>1?t>0?"forward":"back":0===t?"popstate":t>0?"back":"forward"},n(t,[{key:"current",get:function(){return this.m[this.P]}},{key:"previous",get:function(){return this.P<1?null:this.m[this.P-1]}},{key:"size",get:function(){return this.m.length}}]),t}(),P=new y,g=function(t,n){try{var r=function(){if(!n.next.html)return Promise.resolve(t).then(function(t){var r=n.next;if(t){var i=b.toElement(t.html);r.namespace=b.getNamespace(i),r.container=b.getContainer(i),r.url=t.url,r.html=t.html,P.update({ns:r.namespace});var e=b.toDocument(t.html);document.title=e.title}})}();return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(t){return Promise.reject(t)}},E=function t(n,r,i){return n instanceof RegExp?function(t,n){if(!n)return t;for(var r=/\((?:\?<(.*?)>)?(?!\?)/g,i=0,e=r.exec(t.source);e;)n.push({name:e[1]||i++,prefix:"",suffix:"",modifier:"",pattern:""}),e=r.exec(t.source);return t}(n,r):Array.isArray(n)?function(n,r,i){var e=n.map(function(n){return t(n,r,i).source});return new RegExp("(?:".concat(e.join("|"),")"),p(i))}(n,r,i):function(t,n,r){return function(t,n,r){void 0===r&&(r={});for(var i=r.strict,e=void 0!==i&&i,o=r.start,u=void 0===o||o,s=r.end,f=void 0===s||s,c=r.encode,a=void 0===c?function(t){return t}:c,h=r.delimiter,v=void 0===h?"/#?":h,d=r.endsWith,m="[".concat(l(void 0===d?"":d),"]|$"),w="[".concat(l(v),"]"),b=u?"^":"",y=0,P=t;y<P.length;y++){var g=P[y];if("string"==typeof g)b+=l(a(g));else{var E=l(a(g.prefix)),x=l(a(g.suffix));if(g.pattern)if(n&&n.push(g),E||x)if("+"===g.modifier||"*"===g.modifier){var R="*"===g.modifier?"?":"";b+="(?:".concat(E,"((?:").concat(g.pattern,")(?:").concat(x).concat(E,"(?:").concat(g.pattern,"))*)").concat(x,")").concat(R)}else b+="(?:".concat(E,"(").concat(g.pattern,")").concat(x,")").concat(g.modifier);else b+="+"===g.modifier||"*"===g.modifier?"((?:".concat(g.pattern,")").concat(g.modifier,")"):"(".concat(g.pattern,")").concat(g.modifier);else b+="(?:".concat(E).concat(x,")").concat(g.modifier)}}if(f)e||(b+="".concat(w,"?")),b+=r.endsWith?"(?=".concat(m,")"):"$";else{var k=t[t.length-1],O="string"==typeof k?w.indexOf(k[k.length-1])>-1:void 0===k;e||(b+="(?:".concat(w,"(?=").concat(m,"))?")),O||(b+="(?=".concat(w,"|").concat(m,")"))}return new RegExp(b,p(r))}(function(t,n){void 0===n&&(n={});for(var r=function(t){for(var n=[],r=0;r<t.length;){var i=t[r];if("*"!==i&&"+"!==i&&"?"!==i)if("\\"!==i)if("{"!==i)if("}"!==i)if(":"!==i)if("("!==i)n.push({type:"CHAR",index:r,value:t[r++]});else{var e=1,o="";if("?"===t[s=r+1])throw new TypeError('Pattern cannot start with "?" at '.concat(s));for(;s<t.length;)if("\\"!==t[s]){if(")"===t[s]){if(0==--e){s++;break}}else if("("===t[s]&&(e++,"?"!==t[s+1]))throw new TypeError("Capturing groups are not allowed at ".concat(s));o+=t[s++]}else o+=t[s++]+t[s++];if(e)throw new TypeError("Unbalanced pattern at ".concat(r));if(!o)throw new TypeError("Missing pattern at ".concat(r));n.push({type:"PATTERN",index:r,value:o}),r=s}else{for(var u="",s=r+1;s<t.length;){var f=t.charCodeAt(s);if(!(f>=48&&f<=57||f>=65&&f<=90||f>=97&&f<=122||95===f))break;u+=t[s++]}if(!u)throw new TypeError("Missing parameter name at ".concat(r));n.push({type:"NAME",index:r,value:u}),r=s}else n.push({type:"CLOSE",index:r,value:t[r++]});else n.push({type:"OPEN",index:r,value:t[r++]});else n.push({type:"ESCAPED_CHAR",index:r++,value:t[r++]});else n.push({type:"MODIFIER",index:r,value:t[r++]})}return n.push({type:"END",index:r,value:""}),n}(t),i=n.prefixes,e=void 0===i?"./":i,o="[^".concat(l(n.delimiter||"/#?"),"]+?"),u=[],s=0,f=0,c="",a=function(t){if(f<r.length&&r[f].type===t)return r[f++].value},h=function(t){var n=a(t);if(void 0!==n)return n;var i=r[f],e=i.index;throw new TypeError("Unexpected ".concat(i.type," at ").concat(e,", expected ").concat(t))},v=function(){for(var t,n="";t=a("CHAR")||a("ESCAPED_CHAR");)n+=t;return n};f<r.length;){var d=a("CHAR"),p=a("NAME"),m=a("PATTERN");if(p||m)-1===e.indexOf(b=d||"")&&(c+=b,b=""),c&&(u.push(c),c=""),u.push({name:p||s++,prefix:b,suffix:"",pattern:m||o,modifier:a("MODIFIER")||""});else{var w=d||a("ESCAPED_CHAR");if(w)c+=w;else if(c&&(u.push(c),c=""),a("OPEN")){var b=v(),y=a("NAME")||"",P=a("PATTERN")||"",g=v();h("CLOSE"),u.push({name:y||(P?s++:""),pattern:y&&!P?o:P,prefix:b,suffix:g,modifier:a("MODIFIER")||""})}else h("END")}}return u}(t,r),n,r)}(n,r,i)},x={__proto__:null,update:g,nextTick:function(){return new Promise(function(t){window.requestAnimationFrame(t)})},pathToRegexp:E},R=function(){return window.location.origin},k=function(t){return void 0===t&&(t=window.location.href),O(t).port},O=function(t){var n,r=t.match(/:\d+/);if(null===r)/^http/.test(t)&&(n=80),/^https/.test(t)&&(n=443);else{var i=r[0].substring(1);n=parseInt(i,10)}var e,o=t.replace(R(),""),u={},s=o.indexOf("#");s>=0&&(e=o.slice(s+1),o=o.slice(0,s));var f=o.indexOf("?");return f>=0&&(u=T(o.slice(f+1)),o=o.slice(0,f)),{hash:e,path:o,port:n,query:u}},T=function(t){return t.split("&").reduce(function(t,n){var r=n.split("=");return t[r[0]]=r[1],t},{})},A=function(t){return void 0===t&&(t=window.location.href),t.replace(/(\/#.*|\/|#.*)$/,"")},j={__proto__:null,getHref:function(){return window.location.href},getAbsoluteHref:function(t,n){return void 0===n&&(n=document.baseURI),new URL(t,n).href},getOrigin:R,getPort:k,getPath:function(t){return void 0===t&&(t=window.location.href),O(t).path},getQuery:function(t,n){return void 0===n&&(n=!1),n?JSON.stringify(O(t).query):O(t).query},getHash:function(t){return O(t).hash},parse:O,parseQuery:T,clean:A};function M(t,n,i,e,o){return void 0===n&&(n=2e3),new Promise(function(u,s){var f=new XMLHttpRequest;f.onreadystatechange=function(){if(f.readyState===XMLHttpRequest.DONE)if(200===f.status){var n=""!==f.responseURL&&f.responseURL!==t?f.responseURL:t;u({html:f.responseText,url:r({href:n},O(n))}),e.update(t,{status:"fulfilled",target:n})}else if(f.status){var o={status:f.status,statusText:f.statusText};i(t,o),s(o),e.update(t,{status:"rejected"})}},f.ontimeout=function(){var r=new Error("Timeout error ["+n+"]");i(t,r),s(r),e.update(t,{status:"rejected"})},f.onerror=function(){var n=new Error("Fetch error");i(t,n),s(n),e.update(t,{status:"rejected"})},f.open("GET",t),f.timeout=n,f.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml"),f.setRequestHeader("x-barba","yes"),o.all().forEach(function(t,n){f.setRequestHeader(n,t)}),f.send()})}function N(t){return!!t&&("object"==typeof t||"function"==typeof t)&&"function"==typeof t.then}function S(t,n){return void 0===n&&(n={}),function(){var r=arguments,i=!1,e=new Promise(function(e,o){n.async=function(){return i=!0,function(t,n){t?o(t):e(n)}};var u=t.apply(n,[].slice.call(r));i||(N(u)?u.then(e,o):e(u))});return e}}var C=/*#__PURE__*/function(t){function n(){var n;return(n=t.call(this)||this).logger=new d("@barba/core"),n.all=["ready","page","reset","currentAdded","currentRemoved","nextAdded","nextRemoved","beforeOnce","once","afterOnce","before","beforeLeave","leave","afterLeave","beforeEnter","enter","afterEnter","after"],n.registered=new Map,n.init(),n}i(n,t);var r=n.prototype;return r.init=function(){var t=this;this.registered.clear(),this.all.forEach(function(n){t[n]||(t[n]=function(r,i){t.registered.has(n)||t.registered.set(n,new Set),t.registered.get(n).add({ctx:i||{},fn:r})})})},r.do=function(t){var n=arguments,r=this;if(this.registered.has(t)){var i=Promise.resolve();return this.registered.get(t).forEach(function(t){i=i.then(function(){return S(t.fn,t.ctx).apply(void 0,[].slice.call(n,1))})}),i.catch(function(n){r.logger.debug("Hook error ["+t+"]"),r.logger.error(n)})}return Promise.resolve()},r.clear=function(){var t=this;this.all.forEach(function(n){delete t[n]}),this.init()},r.help=function(){this.logger.info("Available hooks: "+this.all.join(","));var t=[];this.registered.forEach(function(n,r){return t.push(r)}),this.logger.info("Registered hooks: "+t.join(","))},n}(h),L=new C,H=/*#__PURE__*/function(){function t(t){if(this.k=void 0,this.O=[],"boolean"==typeof t)this.k=t;else{var n=Array.isArray(t)?t:[t];this.O=n.map(function(t){return E(t)})}}return t.prototype.checkHref=function(t){if("boolean"==typeof this.k)return this.k;var n=O(t).path;return this.O.some(function(t){return null!==t.exec(n)})},t}(),_=/*#__PURE__*/function(t){function n(n){var r;return(r=t.call(this,n)||this).T=new Map,r}i(n,t);var e=n.prototype;return e.set=function(t,n,r,i,e){return this.T.set(t,{action:r,request:n,status:i,target:null!=e?e:t}),{action:r,request:n,status:i,target:e}},e.get=function(t){return this.T.get(t)},e.getRequest=function(t){return this.T.get(t).request},e.getAction=function(t){return this.T.get(t).action},e.getStatus=function(t){return this.T.get(t).status},e.getTarget=function(t){return this.T.get(t).target},e.has=function(t){return!this.checkHref(t)&&this.T.has(t)},e.delete=function(t){return this.T.delete(t)},e.update=function(t,n){var i=r({},this.T.get(t),n);return this.T.set(t,i),i},n}(H),D=/*#__PURE__*/function(){function t(){this.A=new Map}var n=t.prototype;return n.set=function(t,n){return this.A.set(t,n),{name:n}},n.get=function(t){return this.A.get(t)},n.all=function(){return this.A},n.has=function(t){return this.A.has(t)},n.delete=function(t){return this.A.delete(t)},n.clear=function(){return this.A.clear()},t}(),B=function(){return!window.history.pushState},q=function(t){return!t.el||!t.href},F=function(t){var n=t.event;return n.which>1||n.metaKey||n.ctrlKey||n.shiftKey||n.altKey},I=function(t){var n=t.el;return n.hasAttribute("target")&&"_blank"===n.target},U=function(t){var n=t.el;return void 0!==n.protocol&&window.location.protocol!==n.protocol||void 0!==n.hostname&&window.location.hostname!==n.hostname},$=function(t){var n=t.el;return void 0!==n.port&&k()!==k(n.href)},Q=function(t){var n=t.el;return n.getAttribute&&"string"==typeof n.getAttribute("download")},X=function(t){return t.el.hasAttribute(m.prefix+"-"+m.prevent)},z=function(t){return Boolean(t.el.closest("["+m.prefix+"-"+m.prevent+'="all"]'))},G=function(t){var n=t.href;return A(n)===A()&&k(n)===k()},J=/*#__PURE__*/function(t){function n(n){var r;return(r=t.call(this,n)||this).suite=[],r.tests=new Map,r.init(),r}i(n,t);var r=n.prototype;return r.init=function(){this.add("pushState",B),this.add("exists",q),this.add("newTab",F),this.add("blank",I),this.add("corsDomain",U),this.add("corsPort",$),this.add("download",Q),this.add("preventSelf",X),this.add("preventAll",z),this.add("sameUrl",G,!1)},r.add=function(t,n,r){void 0===r&&(r=!0),this.tests.set(t,n),r&&this.suite.push(t)},r.run=function(t,n,r,i){return this.tests.get(t)({el:n,event:r,href:i})},r.checkLink=function(t,n,r){var i=this;return this.suite.some(function(e){return i.run(e,t,n,r)})},n}(H),W=/*#__PURE__*/function(t){function n(r,i){var e;return void 0===i&&(i="Barba error"),(e=t.call.apply(t,[this].concat([].slice.call(arguments,2)))||this).error=void 0,e.label=void 0,e.error=r,e.label=i,Error.captureStackTrace&&Error.captureStackTrace(c(e),n),e.name="BarbaError",e}return i(n,t),n}(/*#__PURE__*/f(Error)),K=/*#__PURE__*/function(){function t(t){void 0===t&&(t=[]),this.logger=new d("@barba/core"),this.all=[],this.page=[],this.once=[],this.j=[{name:"namespace",type:"strings"},{name:"custom",type:"function"}],t&&(this.all=this.all.concat(t)),this.update()}var n=t.prototype;return n.add=function(t,n){"rule"===t?this.j.splice(n.position||0,0,n.value):this.all.push(n),this.update()},n.resolve=function(t,n){var r=this;void 0===n&&(n={});var i=n.once?this.once:this.page;i=i.filter(n.self?function(t){return t.name&&"self"===t.name}:function(t){return!t.name||"self"!==t.name});var e=new Map,o=i.find(function(i){var o=!0,u={};return n.self&&"self"===i.name?(e.set(i,u),!0):(r.j.reverse().forEach(function(n){o&&(o=r.M(i,n,t,u),i.from&&i.to&&(o=r.M(i,n,t,u,"from")&&r.M(i,n,t,u,"to")),i.from&&!i.to&&(o=r.M(i,n,t,u,"from")),!i.from&&i.to&&(o=r.M(i,n,t,u,"to")))}),e.set(i,u),o)}),u=e.get(o),s=[];if(s.push(n.once?"once":"page"),n.self&&s.push("self"),u){var f,c=[o];Object.keys(u).length>0&&c.push(u),(f=this.logger).info.apply(f,["Transition found ["+s.join(",")+"]"].concat(c))}else this.logger.info("No transition found ["+s.join(",")+"]");return o},n.update=function(){var t=this;this.all=this.all.map(function(n){return t.N(n)}).sort(function(t,n){return t.priority-n.priority}).reverse().map(function(t){return delete t.priority,t}),this.page=this.all.filter(function(t){return void 0!==t.leave||void 0!==t.enter}),this.once=this.all.filter(function(t){return void 0!==t.once})},n.M=function(t,n,r,i,e){var o=!0,u=!1,s=t,f=n.name,c=f,a=f,h=f,v=e?s[e]:s,d="to"===e?r.next:r.current;if(e?v&&v[f]:v[f]){switch(n.type){case"strings":default:var l=Array.isArray(v[c])?v[c]:[v[c]];d[c]&&-1!==l.indexOf(d[c])&&(u=!0),-1===l.indexOf(d[c])&&(o=!1);break;case"object":var p=Array.isArray(v[a])?v[a]:[v[a]];d[a]?(d[a].name&&-1!==p.indexOf(d[a].name)&&(u=!0),-1===p.indexOf(d[a].name)&&(o=!1)):o=!1;break;case"function":v[h](r)?u=!0:o=!1}u&&(e?(i[e]=i[e]||{},i[e][f]=s[e][f]):i[f]=s[f])}return o},n.S=function(t,n,r){var i=0;return(t[n]||t.from&&t.from[n]||t.to&&t.to[n])&&(i+=Math.pow(10,r),t.from&&t.from[n]&&(i+=1),t.to&&t.to[n]&&(i+=2)),i},n.N=function(t){var n=this;t.priority=0;var r=0;return this.j.forEach(function(i,e){r+=n.S(t,i.name,e+1)}),t.priority=r,t},t}();function V(t,n){try{var r=t()}catch(t){return n(t)}return r&&r.then?r.then(void 0,n):r}var Y=/*#__PURE__*/function(){function t(t){void 0===t&&(t=[]),this.logger=new d("@barba/core"),this.store=void 0,this.C=!1,this.store=new K(t)}var r=t.prototype;return r.get=function(t,n){return this.store.resolve(t,n)},r.doOnce=function(t){var n=t.data,r=t.transition;try{var i=function(){e.C=!1},e=this,o=r||{};e.C=!0;var u=V(function(){return Promise.resolve(e.L("beforeOnce",n,o)).then(function(){return Promise.resolve(e.once(n,o)).then(function(){return Promise.resolve(e.L("afterOnce",n,o)).then(function(){})})})},function(t){e.C=!1,e.logger.debug("Transition error [before/after/once]"),e.logger.error(t)});return Promise.resolve(u&&u.then?u.then(i):i())}catch(t){return Promise.reject(t)}},r.doPage=function(t){var n=t.data,r=t.transition,i=t.page,e=t.wrapper;try{var o=function(t){u.C=!1},u=this,s=r||{},f=!0===s.sync||!1;u.C=!0;var c=V(function(){function t(){return Promise.resolve(u.L("before",n,s)).then(function(){function t(t){return Promise.resolve(u.remove(n)).then(function(){return Promise.resolve(u.L("after",n,s)).then(function(){})})}var r=function(){if(f)return V(function(){return Promise.resolve(u.add(n,e)).then(function(){return Promise.resolve(u.L("beforeLeave",n,s)).then(function(){return Promise.resolve(u.L("beforeEnter",n,s)).then(function(){return Promise.resolve(Promise.all([u.leave(n,s),u.enter(n,s)])).then(function(){return Promise.resolve(u.L("afterLeave",n,s)).then(function(){return Promise.resolve(u.L("afterEnter",n,s)).then(function(){})})})})})})},function(t){if(u.H(t))throw new W(t,"Transition error [sync]")});var t=function(t){return V(function(){var t=function(){if(!1!==r)return Promise.resolve(u.add(n,e)).then(function(){return Promise.resolve(u.L("beforeEnter",n,s)).then(function(){return Promise.resolve(u.enter(n,s,r)).then(function(){return Promise.resolve(u.L("afterEnter",n,s)).then(function(){})})})})}();if(t&&t.then)return t.then(function(){})},function(t){if(u.H(t))throw new W(t,"Transition error [before/after/enter]")})},r=!1,o=V(function(){return Promise.resolve(u.L("beforeLeave",n,s)).then(function(){return Promise.resolve(Promise.all([u.leave(n,s),g(i,n)]).then(function(t){return t[0]})).then(function(t){return r=t,Promise.resolve(u.L("afterLeave",n,s)).then(function(){})})})},function(t){if(u.H(t))throw new W(t,"Transition error [before/after/leave]")});return o&&o.then?o.then(t):t()}();return r&&r.then?r.then(t):t()})}var r=function(){if(f)return Promise.resolve(g(i,n)).then(function(){})}();return r&&r.then?r.then(t):t()},function(t){if(u.C=!1,t.name&&"BarbaError"===t.name)throw u.logger.debug(t.label),u.logger.error(t.error),t;throw u.logger.debug("Transition error [page]"),u.logger.error(t),t});return Promise.resolve(c&&c.then?c.then(o):o())}catch(t){return Promise.reject(t)}},r.once=function(t,n){try{return Promise.resolve(L.do("once",t,n)).then(function(){return n.once?S(n.once,n)(t):Promise.resolve()})}catch(t){return Promise.reject(t)}},r.leave=function(t,n){try{return Promise.resolve(L.do("leave",t,n)).then(function(){return n.leave?S(n.leave,n)(t):Promise.resolve()})}catch(t){return Promise.reject(t)}},r.enter=function(t,n,r){try{return Promise.resolve(L.do("enter",t,n)).then(function(){return n.enter?S(n.enter,n)(t,r):Promise.resolve()})}catch(t){return Promise.reject(t)}},r.add=function(t,n){try{return b.addContainer(t.next.container,n),L.do("nextAdded",t),Promise.resolve()}catch(t){return Promise.reject(t)}},r.remove=function(t){try{return b.removeContainer(t.current.container),L.do("currentRemoved",t),Promise.resolve()}catch(t){return Promise.reject(t)}},r.H=function(t){return t.message?!/Timeout error|Fetch error/.test(t.message):!t.status},r.L=function(t,n,r){try{return Promise.resolve(L.do(t,n,r)).then(function(){return r[t]?S(r[t],r)(n):Promise.resolve()})}catch(t){return Promise.reject(t)}},n(t,[{key:"isRunning",get:function(){return this.C},set:function(t){this.C=t}},{key:"hasOnce",get:function(){return this.store.once.length>0}},{key:"hasSelf",get:function(){return this.store.all.some(function(t){return"self"===t.name})}},{key:"shouldWait",get:function(){return this.store.all.some(function(t){return t.to&&!t.to.route||t.sync})}}]),t}(),Z=/*#__PURE__*/function(){function t(t){var n=this;this.names=["beforeLeave","afterLeave","beforeEnter","afterEnter"],this.byNamespace=new Map,0!==t.length&&(t.forEach(function(t){n.byNamespace.set(t.namespace,t)}),this.names.forEach(function(t){L[t](n._(t))}))}return t.prototype._=function(t){var n=this;return function(r){var i=t.match(/enter/i)?r.next:r.current,e=n.byNamespace.get(i.namespace);return e&&e[t]?S(e[t],e)(r):Promise.resolve()}},t}();Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(t){var n=this;do{if(n.matches(t))return n;n=n.parentElement||n.parentNode}while(null!==n&&1===n.nodeType);return null});var tt={container:null,html:"",namespace:"",url:{hash:"",href:"",path:"",port:null,query:{}}},nt=/*#__PURE__*/function(){function t(){this.version="2.10.3",this.schemaPage=tt,this.Logger=d,this.logger=new d("@barba/core"),this.plugins=[],this.timeout=void 0,this.cacheIgnore=void 0,this.cacheFirstPage=void 0,this.prefetchIgnore=void 0,this.preventRunning=void 0,this.hooks=L,this.cache=void 0,this.headers=void 0,this.prevent=void 0,this.transitions=void 0,this.views=void 0,this.dom=b,this.helpers=x,this.history=P,this.request=M,this.url=j,this.D=void 0,this.B=void 0,this.q=void 0,this.F=void 0}var i=t.prototype;return i.use=function(t,n){var r=this.plugins;r.indexOf(t)>-1?this.logger.warn("Plugin ["+t.name+"] already installed."):"function"==typeof t.install?(t.install(this,n),r.push(t)):this.logger.warn("Plugin ["+t.name+'] has no "install" method.')},i.init=function(t){var n=void 0===t?{}:t,i=n.transitions,e=void 0===i?[]:i,o=n.views,u=void 0===o?[]:o,s=n.schema,f=void 0===s?m:s,c=n.requestError,a=n.timeout,h=void 0===a?2e3:a,v=n.cacheIgnore,l=void 0!==v&&v,p=n.cacheFirstPage,w=void 0!==p&&p,b=n.prefetchIgnore,y=void 0!==b&&b,P=n.preventRunning,g=void 0!==P&&P,E=n.prevent,x=void 0===E?null:E,R=n.debug,k=n.logLevel;if(d.setLevel(!0===(void 0!==R&&R)?"debug":void 0===k?"off":k),this.logger.info(this.version),Object.keys(f).forEach(function(t){m[t]&&(m[t]=f[t])}),this.B=c,this.timeout=h,this.cacheIgnore=l,this.cacheFirstPage=w,this.prefetchIgnore=y,this.preventRunning=g,this.q=this.dom.getWrapper(),!this.q)throw new Error("[@barba/core] No Barba wrapper found");this.I();var O=this.data.current;if(!O.container)throw new Error("[@barba/core] No Barba container found");if(this.cache=new _(l),this.headers=new D,this.prevent=new J(y),this.transitions=new Y(e),this.views=new Z(u),null!==x){if("function"!=typeof x)throw new Error("[@barba/core] Prevent should be a function");this.prevent.add("preventCustom",x)}this.history.init(O.url.href,O.namespace),w&&this.cache.set(O.url.href,Promise.resolve({html:O.html,url:O.url}),"init","fulfilled"),this.U=this.U.bind(this),this.$=this.$.bind(this),this.X=this.X.bind(this),this.G(),this.plugins.forEach(function(t){return t.init()});var T=this.data;T.trigger="barba",T.next=T.current,T.current=r({},this.schemaPage),this.hooks.do("ready",T),this.once(T),this.I()},i.destroy=function(){this.I(),this.J(),this.history.clear(),this.hooks.clear(),this.plugins=[]},i.force=function(t){window.location.assign(t)},i.go=function(t,n,r){var i;if(void 0===n&&(n="barba"),this.F=null,this.transitions.isRunning)this.force(t);else if(!(i="popstate"===n?this.history.current&&this.url.getPath(this.history.current.url)===this.url.getPath(t)&&this.url.getQuery(this.history.current.url,!0)===this.url.getQuery(t,!0):this.prevent.run("sameUrl",null,null,t))||this.transitions.hasSelf)return n=this.history.change(this.cache.has(t)?this.cache.get(t).target:t,n,r),r&&(r.stopPropagation(),r.preventDefault()),this.page(t,n,null!=r?r:void 0,i)},i.once=function(t){try{var n=this;return Promise.resolve(n.hooks.do("beforeEnter",t)).then(function(){function r(){return Promise.resolve(n.hooks.do("afterEnter",t)).then(function(){})}var i=function(){if(n.transitions.hasOnce){var r=n.transitions.get(t,{once:!0});return Promise.resolve(n.transitions.doOnce({transition:r,data:t})).then(function(){})}}();return i&&i.then?i.then(r):r()})}catch(t){return Promise.reject(t)}},i.page=function(t,n,i,e){try{var o,u=function(){var t=s.data;return Promise.resolve(s.hooks.do("page",t)).then(function(){var n=function(n,r){try{var i=(u=s.transitions.get(t,{once:!1,self:e}),Promise.resolve(s.transitions.doPage({data:t,page:o,transition:u,wrapper:s.q})).then(function(){s.I()}))}catch(t){return r()}var u;return i&&i.then?i.then(void 0,r):i}(0,function(){0===d.getLevel()&&s.force(t.next.url.href)});if(n&&n.then)return n.then(function(){})})},s=this;if(s.data.next.url=r({href:t},s.url.parse(t)),s.data.trigger=n,s.data.event=i,s.cache.has(t))o=s.cache.update(t,{action:"click"}).request;else{var f=s.request(t,s.timeout,s.onRequestError.bind(s,n),s.cache,s.headers);f.then(function(r){r.url.href!==t&&s.history.add(r.url.href,n,"replace")}),o=s.cache.set(t,f,"click","pending").request}var c=function(){if(s.transitions.shouldWait)return Promise.resolve(g(o,s.data)).then(function(){})}();return Promise.resolve(c&&c.then?c.then(u):u())}catch(t){return Promise.reject(t)}},i.onRequestError=function(t){this.transitions.isRunning=!1;var n=[].slice.call(arguments,1),r=n[0],i=n[1],e=this.cache.getAction(r);return this.cache.delete(r),this.B&&!1===this.B(t,e,r,i)||"click"===e&&this.force(r),!1},i.prefetch=function(t){var n=this;t=this.url.getAbsoluteHref(t),this.cache.has(t)||this.cache.set(t,this.request(t,this.timeout,this.onRequestError.bind(this,"barba"),this.cache,this.headers).catch(function(t){n.logger.error(t)}),"prefetch","pending")},i.G=function(){!0!==this.prefetchIgnore&&(document.addEventListener("mouseover",this.U),document.addEventListener("touchstart",this.U)),document.addEventListener("click",this.$),window.addEventListener("popstate",this.X)},i.J=function(){!0!==this.prefetchIgnore&&(document.removeEventListener("mouseover",this.U),document.removeEventListener("touchstart",this.U)),document.removeEventListener("click",this.$),window.removeEventListener("popstate",this.X)},i.U=function(t){var n=this,r=this.W(t);if(r){var i=this.url.getAbsoluteHref(this.dom.getHref(r));this.prevent.checkHref(i)||this.cache.has(i)||this.cache.set(i,this.request(i,this.timeout,this.onRequestError.bind(this,r),this.cache,this.headers).catch(function(t){n.logger.error(t)}),"enter","pending")}},i.$=function(t){var n=this.W(t);if(n){if(this.transitions.isRunning&&this.preventRunning)return t.preventDefault(),void t.stopPropagation();this.F=t,this.go(this.dom.getHref(n),n,t)}},i.X=function(t){this.go(this.url.getHref(),"popstate",t)},i.W=function(t){for(var n=t.target;n&&!this.dom.getHref(n);)n=n.parentNode;if(n&&!this.prevent.checkLink(n,t,this.dom.getHref(n)))return n},i.I=function(){var t=this.url.getHref(),n={container:this.dom.getContainer(),html:this.dom.getHtml(),namespace:this.dom.getNamespace(),url:r({href:t},this.url.parse(t))};this.D={current:n,event:void 0,next:r({},this.schemaPage),trigger:void 0},this.hooks.do("reset",this.data)},n(t,[{key:"data",get:function(){return this.D}},{key:"wrapper",get:function(){return this.q}}]),t}();return new nt});
//# sourceMappingURL=barba.umd.js.map


/***/ },

/***/ 771
(module) {

const NEW_HERO_SELECTOR = '.nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full';
const OLD_HERO_SELECTOR = '.novablocks-hero';
function shouldInitializeHero(element) {
  if (!element || typeof element.matches !== 'function') {
    return false;
  }
  if (element.classList && element.classList.contains('nb-contextual-post-card')) {
    return false;
  }
  return element.matches(NEW_HERO_SELECTOR) || element.matches(OLD_HERO_SELECTOR);
}
module.exports = {
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR,
  shouldInitializeHero
};

/***/ },

/***/ 945
(module) {

/**
 * Reveal Choreographer
 *
 * Coordinates when intro-animation reveals are allowed to fire. Producers
 * (the IntersectionObserver / slide-change flows) request a reveal and list
 * the "gates" it depends on. Integrations (page transitions, Slick carousels,
 * etc.) close and open those gates in response to blocking animations.
 *
 * Semantics:
 *  - A gate is OPEN by default. Only integrations close it.
 *  - While any gate a request depends on is closed, the request queues and
 *    its target stays in its pre-reveal state.
 *  - openGate(name, { settle }) keeps the gate logically closed for `settle`
 *    ms after the blocking animation ends, then flushes queued reveals.
 *    closeGate(name) called during a pending settle cancels that settle.
 *  - Every request has a timeout safety net (default 3s). If a gate it
 *    depends on never opens, the reveal force-fires so the user never sees
 *    permanently-hidden content.
 *  - When prefersReducedMotion() returns true, requests bypass gates
 *    entirely and fire immediately.
 *
 * The module is pure: no DOM queries, no CSS knowledge. The actual reveal
 * (adding a class, running a keyframe, whatever) is the caller's onReveal
 * callback.
 */
function createRevealChoreographer({
  window: win = typeof window !== 'undefined' ? window : null,
  prefersReducedMotion = () => false,
  onReveal = () => {},
  defaultTimeout = 3000
} = {}) {
  const closedGates = new Set();
  // Request queue, keyed by the element so a repeat requestReveal() for the
  // same target cancels the previous one instead of stacking up.
  const queue = new Map();
  // Pending "settle" timers keyed by gate name. If the gate is re-closed
  // before settle elapses, we cancel the timer and stay closed.
  const pendingOpens = new Map();
  function setTimer(fn, ms) {
    if (win && typeof win.setTimeout === 'function') {
      return win.setTimeout(fn, ms);
    }
    return null;
  }
  function clearTimer(handle) {
    if (handle == null) return;
    if (win && typeof win.clearTimeout === 'function') {
      win.clearTimeout(handle);
    }
  }
  function isRequestReady(req) {
    for (const gate of req.waitFor) {
      if (closedGates.has(gate)) return false;
    }
    return true;
  }
  function cleanupRequest(req) {
    clearTimer(req.timeoutHandle);
    queue.delete(req.el);
  }
  function fireReveal(req) {
    cleanupRequest(req);
    // Caller-provided reveal. Try/catch so a throw in one reveal doesn't
    // leave the queue in an inconsistent state.
    try {
      onReveal(req.el);
    } catch (_) {
      /* no-op */
    }
  }
  function flushReadyRequests() {
    // Collect first so we're not mutating queue during iteration.
    const ready = [];
    for (const req of queue.values()) {
      if (isRequestReady(req)) ready.push(req);
    }
    ready.forEach(fireReveal);
  }
  return {
    /**
     * Ask for an element to be revealed.
     *
     * @param {Element} el The target.
     * @param {{ waitFor?: string[], timeout?: number }} [opts]
     *   waitFor: gate names to wait on. Empty = fire immediately.
     *   timeout: force-reveal after this many ms (default 3000).
     */
    requestReveal(el, opts = {}) {
      if (!el) return;

      // Reduced-motion short-circuit: fire now, skip the whole machinery.
      if (typeof prefersReducedMotion === 'function' && prefersReducedMotion()) {
        try {
          onReveal(el);
        } catch (_) {/* no-op */}
        return;
      }
      const waitFor = Array.isArray(opts.waitFor) ? opts.waitFor.slice() : [];
      const timeout = typeof opts.timeout === 'number' ? opts.timeout : defaultTimeout;

      // Cancel any previous request for the same element.
      const previous = queue.get(el);
      if (previous) cleanupRequest(previous);
      const req = {
        el,
        waitFor,
        timeoutHandle: null
      };
      if (waitFor.length === 0 || isRequestReady(req)) {
        try {
          onReveal(el);
        } catch (_) {/* no-op */}
        return;
      }

      // Queue it and arm the timeout safety net.
      queue.set(el, req);
      if (timeout > 0) {
        req.timeoutHandle = setTimer(() => {
          fireReveal(req);
        }, timeout);
      }
    },
    /**
     * Mark a gate as closed. Cancels any pending settle timer for this gate.
     */
    closeGate(name) {
      closedGates.add(name);
      if (pendingOpens.has(name)) {
        clearTimer(pendingOpens.get(name));
        pendingOpens.delete(name);
      }
    },
    /**
     * Mark a gate as open. With settle > 0, the gate stays logically closed
     * for `settle` ms first — requests queued during that window flush when
     * the timer fires. Useful for letting a blocking animation finish its
     * last frame of motion before the next one starts.
     */
    openGate(name, opts = {}) {
      const settle = typeof opts.settle === 'number' ? opts.settle : 0;
      const actuallyOpen = () => {
        closedGates.delete(name);
        pendingOpens.delete(name);
        flushReadyRequests();
      };
      if (settle <= 0) {
        actuallyOpen();
        return;
      }

      // Cancel any previous pending open so a later openGate with a
      // different settle resets the timer.
      if (pendingOpens.has(name)) {
        clearTimer(pendingOpens.get(name));
      }
      const handle = setTimer(actuallyOpen, settle);
      pendingOpens.set(name, handle);
    },
    /** True iff the gate is not currently in the closed set. */
    isGateOpen(name) {
      return !closedGates.has(name);
    },
    /**
     * For instrumentation/tests only — returns the current number of
     * queued (not-yet-fired) requests.
     */
    queuedCount() {
      return queue.size;
    },
    /**
     * Tear down: cancel every pending timer and flush state.
     * Used before re-initializing (e.g., on Barba re-init).
     */
    disconnect() {
      for (const req of queue.values()) {
        clearTimer(req.timeoutHandle);
      }
      queue.clear();
      for (const handle of pendingOpens.values()) {
        clearTimer(handle);
      }
      pendingOpens.clear();
      closedGates.clear();
    }
  };
}
module.exports = {
  createRevealChoreographer
};

/***/ },

/***/ 688
(module, __unused_webpack_exports, __webpack_require__) {

const {
  createIntroAnimationsRuntime
} = __webpack_require__(280);
const {
  attachPageTransitionGate,
  PAGE_TRANSITION_GATE
} = __webpack_require__(155);
const {
  attachSlickGate,
  getSlickGateName
} = __webpack_require__(376);

// Compose the runtime with the production gate resolver.
// - Every target waits on the global page-transition gate. On first page
//   load the gate is open (never closed) so this is a no-op. During a
//   Barba soft-nav the integration closes it during the transition and
//   opens it with settle after, giving the loader a clean exit.
// - Targets inside a Slick carousel also wait on that carousel's
//   slick:{id} gate, so the word-curtain cascade only starts after the
//   slide transform finishes.
function resolveGates(target) {
  const gates = [PAGE_TRANSITION_GATE];
  const slickGate = getSlickGateName(target);
  if (slickGate) gates.push(slickGate);
  return gates;
}
const runtime = createIntroAnimationsRuntime({
  resolveGates
});

// Integrations attach their listeners BEFORE runtime.bind() so that on a
// 'anima:page-transition-complete' dispatch the gate's openGate (with
// settle) runs before runtime.initialize() — queued requests from
// initialize then actually wait the settle window before firing.
if (typeof window !== 'undefined') {
  attachPageTransitionGate({
    window,
    choreographer: runtime.choreographer
  });
  attachSlickGate({
    window,
    document,
    jQuery: window.jQuery || window.$,
    choreographer: runtime.choreographer
  });
}
module.exports = {
  initialize(root) {
    return runtime.initialize(root);
  },
  bind() {
    return runtime.bind();
  },
  disconnect() {
    return runtime.disconnect();
  }
};

/***/ },

/***/ 155
(module) {

/**
 * Page-transition integration for the reveal choreographer.
 *
 * Listens for Anima's window-level page-transition events and opens/closes
 * the 'page-transition' gate accordingly. When a soft navigation is in
 * flight, new reveals requested by the runtime queue behind this gate so
 * they don't animate against the loader/overlay. When the transition ends
 * we open the gate with a small settle delay, giving the overlay a beat to
 * clear before the cascade starts.
 *
 * Events relied upon:
 *  - 'anima:page-transition-start'    — dispatched in page-transitions/index.js
 *                                        via barba.hooks.before().
 *  - 'anima:page-transition-complete' — existing event dispatched after the
 *                                        loader is dismissed.
 *
 * On first page load neither event has fired, so the gate stays open and
 * reveals behave exactly as before.
 */
const PAGE_TRANSITION_GATE = 'page-transition';
const DEFAULT_SETTLE_MS = 200;
function attachPageTransitionGate({
  window: win = typeof window !== 'undefined' ? window : null,
  choreographer,
  settleMs = DEFAULT_SETTLE_MS
} = {}) {
  if (!win || typeof win.addEventListener !== 'function' || !choreographer) {
    return () => {};
  }
  const onStart = () => {
    choreographer.closeGate(PAGE_TRANSITION_GATE);
  };
  const onComplete = () => {
    choreographer.openGate(PAGE_TRANSITION_GATE, {
      settle: settleMs
    });
  };
  win.addEventListener('anima:page-transition-start', onStart);
  win.addEventListener('anima:page-transition-complete', onComplete);
  return function detach() {
    if (typeof win.removeEventListener === 'function') {
      win.removeEventListener('anima:page-transition-start', onStart);
      win.removeEventListener('anima:page-transition-complete', onComplete);
    }
  };
}
module.exports = {
  attachPageTransitionGate,
  PAGE_TRANSITION_GATE
};

/***/ },

/***/ 376
(module) {

/**
 * Slick carousel integration for the reveal choreographer.
 *
 * For single-item Slick carousels (a fade hero, a full-width slide-wipe),
 * closes a per-carousel gate ('slick:{id}') during the slide-change
 * transition and opens it (with a settle delay) once the transition ends.
 * Reveals inside the newly-active slide use that gate name so the Kinetic
 * word-curtain waits for the slide transform to finish before playing.
 *
 * Multi-item carousels (variableWidth, centerMode, slidesToShow > 1) are
 * NOT wired — their "slide changes" are just a scroll of an already-visible
 * gallery of items, so replaying the newly-focused title's cascade feels
 * wrong. They're tagged `data-slick-carousel-kind="multi"` so the runtime's
 * slide-change observer can skip them.
 *
 * Uses jQuery because Slick itself is jQuery-based; Slick dispatches its
 * transition events as jQuery events on the carousel element.
 */
const SLICK_GATE_PREFIX = 'slick:';
const DEFAULT_SETTLE_MS = 100;
const GATE_ID_ATTRIBUTE = 'data-slick-gate-id';
const KIND_ATTRIBUTE = 'data-slick-carousel-kind';
let nextAutoId = 1;

/**
 * Classify a Slick carousel as 'single' or 'multi' based on its options.
 *
 *  - fade: always single-item (Slick fade is a crossfade between 1-at-a-time).
 *  - variableWidth / centerMode / slidesToShow > 1 → multi-item.
 *  - slidesToShow <= 1 without those flags → single-item.
 *
 * Used to decide whether a slide-change should replay the newly-prominent
 * title's cascade (desirable on hero-style carousels) or leave existing
 * reveals alone (correct for gallery-style carousels where nothing is
 * taking over the viewport).
 */
function classifySlickCarousel(carouselEl, jQuery) {
  if (!carouselEl || !jQuery) return 'multi'; // safer default: don't replay
  try {
    const $c = jQuery(carouselEl);
    if (!$c || !$c.length || typeof $c.slick !== 'function') {
      return 'multi';
    }
    const inst = $c.slick('getSlick');
    const opts = inst && inst.options ? inst.options : null;
    if (!opts) return 'multi';
    if (opts.fade) return 'single';
    if (opts.variableWidth) return 'multi';
    if (opts.centerMode) return 'multi';
    if ((opts.slidesToShow || 1) > 1) return 'multi';
    return 'single';
  } catch (e) {
    return 'multi';
  }
}

/**
 * Resolve the gate name for a carousel element. If the carousel hasn't been
 * tagged yet, assigns a fresh id. Safe to call multiple times.
 */
function assignCarouselGateName(carouselEl) {
  if (!carouselEl || !carouselEl.getAttribute) return null;
  let id = carouselEl.getAttribute(GATE_ID_ATTRIBUTE);
  if (!id) {
    id = String(nextAutoId++);
    carouselEl.setAttribute(GATE_ID_ATTRIBUTE, id);
  }
  return SLICK_GATE_PREFIX + id;
}

/**
 * Given any element, find the gate name of the nearest single-item
 * carousel it lives inside. Returns null for elements outside a carousel
 * or inside a multi-item carousel (those don't use gates).
 */
function getSlickGateName(el) {
  if (!el || typeof el.closest !== 'function') return null;
  const carousel = el.closest('.slick-initialized.slick-slider');
  if (!carousel) return null;
  // Multi-item carousels don't participate in the gate system.
  if (carousel.getAttribute && carousel.getAttribute(KIND_ATTRIBUTE) === 'multi') {
    return null;
  }
  return assignCarouselGateName(carousel);
}

/**
 * True iff the element is inside a Slick carousel whose slide changes
 * should replay the Kinetic cascade. Used by the runtime's slide-change
 * observer to skip multi-item carousels.
 */
function isInsideSingleItemSlickCarousel(el) {
  if (!el || typeof el.closest !== 'function') return false;
  const carousel = el.closest('.slick-initialized.slick-slider');
  if (!carousel || !carousel.getAttribute) return false;
  return carousel.getAttribute(KIND_ATTRIBUTE) === 'single';
}

/**
 * Wire one carousel's beforeChange/afterChange into the choreographer.
 * Classifies the carousel first; multi-item carousels get tagged but
 * skip the gate wiring (nothing to gate — the runtime won't replay).
 */
function attachToCarousel($carousel, choreographer, settleMs, jQuery) {
  if (!$carousel || !$carousel.length || $carousel.data('anima-slick-gate-bound')) return;
  const carouselEl = $carousel[0];
  const kind = classifySlickCarousel(carouselEl, jQuery);
  if (carouselEl && carouselEl.setAttribute) {
    carouselEl.setAttribute(KIND_ATTRIBUTE, kind);
  }

  // Flag as bound so repeated scans skip this element either way.
  $carousel.data('anima-slick-gate-bound', true);
  if (kind !== 'single') {
    // Multi-item carousel: no gate, no replay. The runtime's slide-change
    // observer checks the kind attribute and skips these entirely.
    return;
  }
  const gateName = assignCarouselGateName(carouselEl);
  if (!gateName) return;
  $carousel.on('beforeChange', () => {
    choreographer.closeGate(gateName);
  });
  $carousel.on('afterChange', () => {
    choreographer.openGate(gateName, {
      settle: settleMs
    });
  });
}

/**
 * Attach the Slick integration. Wires every already-initialized carousel
 * immediately AND watches the document for new .slick-initialized class
 * additions so late-init carousels (the common case — Slick often
 * initializes after our module loads) get wired as soon as they appear.
 * Also rescans after page transitions to catch soft-navigated-in carousels.
 */
function attachSlickGate({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  jQuery = win ? win.jQuery || win.$ : null,
  choreographer,
  settleMs = DEFAULT_SETTLE_MS
} = {}) {
  if (!choreographer || !jQuery) {
    return () => {};
  }
  const $ = jQuery;
  function scan(root) {
    const searchRoot = root && typeof root.querySelectorAll === 'function' ? root : doc;
    if (!searchRoot || typeof searchRoot.querySelectorAll !== 'function') return;
    $(searchRoot).find('.slick-initialized.slick-slider').each(function () {
      attachToCarousel($(this), choreographer, settleMs, $);
    });
  }

  // Initial sweep for anything already initialized when we ran.
  scan();

  // Watch for late init. Slick often initializes after our script executes
  // (themes load their scripts in an order the runtime can't control), and
  // the .slick-initialized class is the definitive signal.
  let initObserver = null;
  if (win && typeof win.MutationObserver === 'function' && doc && doc.body) {
    initObserver = new win.MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type !== 'attributes' || m.attributeName !== 'class') continue;
        const target = m.target;
        if (!target || !target.classList) continue;
        if (!target.classList.contains('slick-initialized')) continue;
        if (!target.classList.contains('slick-slider')) continue;
        attachToCarousel($(target), choreographer, settleMs, $);
      }
    });
    initObserver.observe(doc.body, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true
    });
  }
  const onPageTransitionComplete = () => {
    // Slick often (re-)initializes after a Barba content swap. Give it
    // one frame to settle, then scan. The MutationObserver above also
    // catches these, but the explicit rescan covers the edge case where
    // Slick reuses existing elements without toggling .slick-initialized.
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(() => scan());
      });
    } else {
      scan();
    }
  };
  if (win && typeof win.addEventListener === 'function') {
    win.addEventListener('anima:page-transition-complete', onPageTransitionComplete);
  }
  return function detach() {
    if (win && typeof win.removeEventListener === 'function') {
      win.removeEventListener('anima:page-transition-complete', onPageTransitionComplete);
    }
    if (initObserver && typeof initObserver.disconnect === 'function') {
      initObserver.disconnect();
    }
  };
}
module.exports = {
  attachSlickGate,
  getSlickGateName,
  assignCarouselGateName,
  isInsideSingleItemSlickCarousel,
  classifySlickCarousel,
  SLICK_GATE_PREFIX,
  KIND_ATTRIBUTE
};

/***/ },

/***/ 280
(module, __unused_webpack_exports, __webpack_require__) {

const {
  collectRevealTargets,
  collectKineticTitleTargets
} = __webpack_require__(687);
const {
  createRevealChoreographer
} = __webpack_require__(945);
const {
  isInsideSingleItemSlickCarousel
} = __webpack_require__(376);
const REVEAL_ZONE_TOP_RATIO = 0.82;
const DELAY_WINDOW_BY_STYLE = {
  fade: 600,
  scale: 600,
  slide: 600,
  // Kinetic needs a longer window: the title's per-word cascade can take
  // ~500ms+ on a multi-line heading, and the rest of the batch should still
  // feel like one continuous reveal.
  kinetic: 1000
};

// Selectors that identify a "title" role target (heading blocks, post titles).
// Used by the role classifier below. Anything else gets role 'other'.
const TITLE_ROLE_SELECTORS = ['h1', 'h2', 'h3', '.wp-block-heading', '.wp-block-post-title'];
function classifyTargetRole(node) {
  if (!node || typeof node.matches !== 'function') {
    return 'other';
  }
  for (const selector of TITLE_ROLE_SELECTORS) {
    if (node.matches(selector)) {
      return 'title';
    }
  }
  return 'other';
}
function getRevealObserverOptions() {
  return {
    threshold: 0,
    rootMargin: `0px 0px -${Math.round((1 - REVEAL_ZONE_TOP_RATIO) * 100)}% 0px`
  };
}
function createIntroAnimationsRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  collectTargets = collectRevealTargets,
  collectKineticTitles = collectKineticTitleTargets,
  createObserver = callback => new win.IntersectionObserver(callback, getRevealObserverOptions()),
  // Injectable so tests can supply a synchronous stub. Factory receives the
  // runtime's handleReveal as its onReveal; integrations can close/open
  // gates on the returned choreographer (exposed via runtime.choreographer).
  createChoreographer = createRevealChoreographer,
  // Given a staged target, return the list of gate names its reveal must
  // wait on. Default: no gates (reveal fires immediately; backward-compat
  // for tests). The shipping runtime wires this up in index.js so titles
  // inside Slick slides or the post-transition page wait appropriately.
  resolveGates = () => []
} = {}) {
  const consumedTargets = new WeakSet();
  let observer = null;
  let slideChangeObserver = null;
  let isBound = false;
  function hasEnabledBodyClass() {
    return !!doc && !!doc.body && !!doc.body.classList && doc.body.classList.contains('has-intro-animations');
  }
  function prefersReducedMotion() {
    return !!win && typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function getActiveAnimationStyle() {
    if (!doc || !doc.body || !doc.body.classList) {
      return 'fade';
    }
    const styles = Object.keys(DELAY_WINDOW_BY_STYLE);
    const activeStyle = styles.find(style => doc.body.classList.contains(`has-intro-animations--${style}`));
    return activeStyle || 'fade';
  }
  function parseDelayWindow(value) {
    if (typeof value !== 'string') {
      return null;
    }
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return null;
    }
    if (normalizedValue.endsWith('ms')) {
      const numericValue = Number.parseFloat(normalizedValue.slice(0, -2));
      return Number.isNaN(numericValue) ? null : numericValue;
    }
    if (normalizedValue.endsWith('s')) {
      const numericValue = Number.parseFloat(normalizedValue.slice(0, -1));
      return Number.isNaN(numericValue) ? null : numericValue * 1000;
    }
    return null;
  }
  function getDelayWindowMs() {
    if (win && typeof win.getComputedStyle === 'function' && doc && doc.body) {
      const delayWindow = parseDelayWindow(win.getComputedStyle(doc.body).getPropertyValue('--anima-intro-delay-window'));
      if (delayWindow !== null) {
        return delayWindow;
      }
    }
    return DELAY_WINDOW_BY_STYLE[getActiveAnimationStyle()] || DELAY_WINDOW_BY_STYLE.fade;
  }
  function formatDelay(delay) {
    const roundedDelay = Math.round(delay * 1000) / 1000;
    if (Number.isInteger(roundedDelay)) {
      return `${roundedDelay}ms`;
    }
    return `${roundedDelay}ms`;
  }
  function isInViewport(target) {
    if (!target) {
      return false;
    }
    if (typeof target.isInViewport === 'boolean') {
      return target.isInViewport;
    }
    if (!win || typeof target.getBoundingClientRect !== 'function') {
      return false;
    }
    const rect = target.getBoundingClientRect();
    const viewportHeight = win.innerHeight || doc?.documentElement?.clientHeight || 0;
    const viewportWidth = win.innerWidth || doc?.documentElement?.clientWidth || 0;
    const revealTop = viewportHeight * REVEAL_ZONE_TOP_RATIO;
    return rect.bottom > 0 && rect.top <= revealTop && rect.right > 0 && rect.left < viewportWidth;
  }
  function markTargetBase(target) {
    if (target && target.classList) {
      target.classList.add('anima-intro-target');
    }
  }

  // Pick the DOM node that actually holds the text to split. Handles the
  // three common heading shapes:
  //   <h2>Title</h2>                      — split inside the heading
  //   <h2><a>Title</a></h2>               — split inside the anchor (card titles)
  //   <h2><a><b>Rich</b> Title</a></h2>   — skip to preserve inline markup
  //   <h2>Mixed <em>inline</em> stuff</h2> — skip (returns null)
  function pickSplitRoot(el) {
    if (!el || typeof el.childElementCount !== 'number') {
      return null;
    }
    const outerText = typeof el.textContent === 'string' ? el.textContent.trim() : '';
    if (!outerText) {
      return null;
    }
    if (el.childElementCount === 0) {
      return el;
    }

    // Single wrapper child (e.g., an anchor) whose text covers the entire
    // heading. This is the common pattern for post-card titles and block
    // theme headings that link to the post.
    if (el.childElementCount === 1) {
      const only = el.firstElementChild;
      const innerText = only && typeof only.textContent === 'string' ? only.textContent.trim() : '';
      if (only && innerText === outerText && only.childElementCount === 0) {
        return only;
      }
    }
    return null;
  }

  // Char-split helper used for single-word titles (a word-level cascade on a
  // one-word heading renders as a single pop, which loses the drama). Each
  // character becomes a <span class="char"> with --char-index (per-line) and
  // --line-index (global). Line wrapping is measured via offsetTop so very
  // long single "words" that wrap still get per-line clip-masks.
  function splitTextIntoChars(splitRoot, word) {
    const chars = Array.from(word); // Unicode-aware iteration

    if (chars.length === 0) {
      return;
    }
    const charSpans = chars.map(ch => {
      const span = doc.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      return span;
    });

    // Pass 1: flat layout so the browser decides where the word wraps.
    splitRoot.textContent = '';
    charSpans.forEach(span => splitRoot.appendChild(span));
    if (typeof splitRoot.getBoundingClientRect === 'function') {
      splitRoot.getBoundingClientRect();
    }
    const charsByTop = new Map();
    charSpans.forEach(span => {
      const top = typeof span.offsetTop === 'number' ? span.offsetTop : 0;
      if (!charsByTop.has(top)) {
        charsByTop.set(top, []);
      }
      charsByTop.get(top).push(span);
    });

    // Pass 2: rewrap each visual line in its own <span class="line">.
    const lineTops = [...charsByTop.keys()].sort((a, b) => a - b);
    splitRoot.textContent = '';
    lineTops.forEach((top, lineIndex) => {
      const lineSpan = doc.createElement('span');
      lineSpan.className = 'line';
      if (lineSpan.style && typeof lineSpan.style.setProperty === 'function') {
        lineSpan.style.setProperty('--line-index', String(lineIndex));
      }
      const lineChars = charsByTop.get(top);
      lineChars.forEach((charSpan, charIndex) => {
        if (charSpan.style && typeof charSpan.style.setProperty === 'function') {
          charSpan.style.setProperty('--char-index', String(charIndex));
          charSpan.style.setProperty('--line-index', String(lineIndex));
        }
        lineSpan.appendChild(charSpan);
      });
      splitRoot.appendChild(lineSpan);
    });
  }

  // Split a heading into per-line <span class="line"> containers whose
  // children are <span class="word"> with --word-index (per-line) and
  // --line-index (global). Mirrors the splitting.js behavior used on
  // louisansa.com — line wrapping is detected from the browser's own
  // layout, so each visual line gets its own overflow:hidden clip and
  // the CSS cascade drives delays with no per-element JS work.
  //
  // Safeguards:
  //  - Skip if the element already has split children (re-entrancy / SPA).
  //  - Skip if the heading contains mixed inline markup we can't handle
  //    safely (pickSplitRoot returns null). Text-only single-anchor wrappers
  //    around the full title text ARE handled — we split inside the anchor.
  function splitHeadingForCurtain(el) {
    if (!el || typeof el.querySelector !== 'function') {
      return;
    }
    if (el.querySelector('.line')) {
      return; // already split
    }
    if (!doc || typeof doc.createElement !== 'function' || typeof doc.createTextNode !== 'function') {
      return;
    }
    const splitRoot = pickSplitRoot(el);
    if (!splitRoot) {
      return;
    }
    const text = typeof splitRoot.textContent === 'string' ? splitRoot.textContent.trim() : '';
    if (!text) {
      return;
    }
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return;
    }

    // Single-word titles: split into characters instead of words so the
    // cascade shows a rising letter sequence. Otherwise a one-word heading
    // like "Newsletter" would render as a single block pop with no stagger.
    if (words.length === 1) {
      splitTextIntoChars(splitRoot, words[0]);
      return;
    }
    const wordSpans = words.map(word => {
      const span = doc.createElement('span');
      span.className = 'word';
      span.textContent = word;
      return span;
    });

    // Pass 1: flat layout so the browser decides where lines wrap.
    splitRoot.textContent = '';
    wordSpans.forEach((span, index) => {
      splitRoot.appendChild(span);
      if (index < wordSpans.length - 1) {
        splitRoot.appendChild(doc.createTextNode(' '));
      }
    });

    // Force a layout read, then group words by their offsetTop.
    if (typeof splitRoot.getBoundingClientRect === 'function') {
      splitRoot.getBoundingClientRect();
    }
    const wordsByTop = new Map();
    wordSpans.forEach(span => {
      const top = typeof span.offsetTop === 'number' ? span.offsetTop : 0;
      if (!wordsByTop.has(top)) {
        wordsByTop.set(top, []);
      }
      wordsByTop.get(top).push(span);
    });

    // Pass 2: rewrap each visual line in its own <span class="line">.
    const lineTops = [...wordsByTop.keys()].sort((a, b) => a - b);
    splitRoot.textContent = '';
    lineTops.forEach((top, lineIndex) => {
      const lineSpan = doc.createElement('span');
      lineSpan.className = 'line';
      if (lineSpan.style && typeof lineSpan.style.setProperty === 'function') {
        lineSpan.style.setProperty('--line-index', String(lineIndex));
      }
      const lineWords = wordsByTop.get(top);
      lineWords.forEach((wordSpan, wordIndex) => {
        if (wordSpan.style && typeof wordSpan.style.setProperty === 'function') {
          wordSpan.style.setProperty('--word-index', String(wordIndex));
          wordSpan.style.setProperty('--line-index', String(lineIndex));
        }
        lineSpan.appendChild(wordSpan);
        if (wordIndex < lineWords.length - 1) {
          lineSpan.appendChild(doc.createTextNode(' '));
        }
      });
      splitRoot.appendChild(lineSpan);
    });
  }
  function applyRevealDelay(target, index = 0, totalTargets = 1) {
    if (!target || !target.style || typeof target.style.setProperty !== 'function') {
      return;
    }
    const delay = totalTargets > 0 ? getDelayWindowMs() / totalTargets * index : 0;
    target.style.setProperty('--anima-intro-delay', formatDelay(delay));
  }
  function revealTarget(target) {
    if (!target || !target.classList) {
      return;
    }
    markTargetBase(target);
    target.classList.remove('anima-intro-target--pending');
    target.classList.add('anima-intro-target--revealed');
    consumedTargets.add(target);
    if (observer && typeof observer.unobserve === 'function') {
      observer.unobserve(target);
    }
  }
  function stageTarget(target) {
    if (!target || consumedTargets.has(target)) {
      return false;
    }
    markTargetBase(target);
    target.classList.remove('anima-intro-target--revealed');

    // Tag the target with its role (title / other). Per-role CSS uses this
    // class to apply style-specific treatment — notably Kinetic, which
    // reveals non-title targets with a slide and titles with a word curtain.
    const role = classifyTargetRole(target);
    if (target.classList && typeof target.classList.add === 'function') {
      target.classList.add('anima-intro-target--role-' + role);
    }
    if (prefersReducedMotion()) {
      revealTarget(target);
      return false;
    }

    // Suppress the transition while we apply the pre-state. Without this,
    // the element would interpolate from its natural style (opacity 1,
    // no transform) toward the --pending values over the transition
    // duration. rAF×2 (the usual "wait for a paint" trick) only gives us
    // ~33ms of that transition — nowhere near enough to settle — so when
    // revealTarget later flips to --revealed the reveal transition starts
    // from ~95% opacity with almost no visible distance to animate.
    //
    // With --staging applied, the pre-state snaps in instantly. We force
    // a reflow so the snapped style is committed, then remove --staging
    // on the next frame. revealTarget is wrapped in its own rAF×2 inside
    // handleReveal so it fires AFTER this unstaging — transitions then
    // animate the full --pending → --revealed distance.
    target.classList.add('anima-intro-target--staging');
    target.classList.add('anima-intro-target--pending');

    // Force a synchronous reflow so the browser commits the pre-state
    // paint before we drop the transition suppression.
    // eslint-disable-next-line no-unused-expressions
    target.offsetWidth;
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        if (target && target.classList) {
          target.classList.remove('anima-intro-target--staging');
        }
      });
    } else {
      target.classList.remove('anima-intro-target--staging');
    }

    // Kinetic style only: split title-role headings into words so the CSS
    // per-word cascade has something to reveal. Runs on every stageTarget
    // call, which means it re-applies correctly after Barba page transitions
    // (initialize() re-fires on 'anima:page-transition-complete').
    if (role === 'title' && getActiveAnimationStyle() === 'kinetic') {
      splitHeadingForCurtain(target);
    }
    return true;
  }
  function disconnect() {
    if (observer && typeof observer.disconnect === 'function') {
      observer.disconnect();
    }
    if (slideChangeObserver && typeof slideChangeObserver.disconnect === 'function') {
      slideChangeObserver.disconnect();
    }
    if (choreographer && typeof choreographer.disconnect === 'function') {
      choreographer.disconnect();
    }
    observer = null;
    slideChangeObserver = null;
    // Leave choreographer reference intact — the factory-returned API
    // still exposes it for integrations and for re-use after re-initialize.
    // Its internal state has been reset by disconnect().
  }

  // Re-run the Kinetic word/char cascade on a title that has already been
  // revealed. Used when a carousel slide comes into view a second time
  // (Slick doesn't mutate the DOM on slide change, so IntersectionObserver
  // never re-fires). The sequence:
  //   1. Add --replaying (disables word/char transitions)
  //   2. Remove --revealed → words/chars snap to pre-state with no animation
  //   3. Force a reflow so the snap is committed
  //   4. Remove --replaying (re-enables transitions)
  //   5. Next frame pair, re-add --revealed → cascade runs forward
  function replayKineticTitle(el) {
    if (!el || !el.classList) {
      return;
    }

    // If the title was never revealed in the first place, let the normal
    // IntersectionObserver flow handle it instead — no replay needed.
    if (!el.classList.contains('anima-intro-target--revealed')) {
      return;
    }
    el.classList.add('anima-intro-target--replaying');
    el.classList.remove('anima-intro-target--revealed');

    // Force reflow so the pre-state snap is committed before we re-enable
    // transitions and trigger the forward cascade.
    if (typeof el.getBoundingClientRect === 'function') {
      el.getBoundingClientRect();
    }
    el.classList.remove('anima-intro-target--replaying');
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(() => {
          el.classList.add('anima-intro-target--revealed');
        });
      });
    } else {
      el.classList.add('anima-intro-target--revealed');
    }
  }

  // Watch the document for Slick carousels changing slides. When a slide
  // gains the `slick-active` class (i.e., it's newly in the carousel's
  // visible set), replay any Kinetic titles inside it. The observer is
  // body-wide so it works regardless of Slick-init order relative to the
  // runtime, and it handles dynamic carousels (e.g., those initialized
  // after a page transition).
  function observeSlickSlideChanges() {
    if (!win || typeof win.MutationObserver !== 'function') {
      return null;
    }
    if (!doc || !doc.body) {
      return null;
    }
    if (getActiveAnimationStyle() !== 'kinetic') {
      return null;
    }
    const obs = new win.MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') {
          return;
        }
        const slide = mutation.target;
        if (!slide || !slide.classList || !slide.classList.contains('slick-slide')) {
          return;
        }
        const oldClass = mutation.oldValue || '';
        const wasActive = oldClass.split(/\s+/).indexOf('slick-active') !== -1;
        const isActive = slide.classList.contains('slick-active');
        if (wasActive || !isActive) {
          return; // not a freshly-activated slide
        }
        if (typeof slide.querySelectorAll !== 'function') {
          return;
        }

        // Only replay the title cascade when the slide belongs to a
        // SINGLE-item carousel (fade hero, full-width slide-wipe). On
        // multi-item carousels — variableWidth galleries, centerMode,
        // slidesToShow > 1 — a slide becoming "active" is just a
        // gallery scroll, nothing is taking over the viewport, and
        // replaying the newly-focused title's word-curtain reads as a
        // glitch. The slick-gate integration tags each carousel as
        // 'single' or 'multi' during attach; we trust that tag here.
        if (!isInsideSingleItemSlickCarousel(slide)) {
          return;
        }
        const titles = slide.querySelectorAll('.anima-intro-target--role-title');
        // Route through the choreographer: for an already-revealed title,
        // the slick:{id} gate (closed during this transition by the slick
        // integration) holds the request until the slide settles, then
        // onReveal routes to replayKineticTitle. For a not-yet-revealed
        // title, it routes to the first-reveal path.
        titles.forEach(requestTargetReveal);
      });
    });
    obs.observe(doc.body, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
      subtree: true
    });
    return obs;
  }
  function ensureObserver() {
    if (observer || prefersReducedMotion() || !hasEnabledBodyClass() || typeof createObserver !== 'function') {
      return observer;
    }
    observer = createObserver((entries = []) => {
      const readyTargets = entries.filter(entry => entry && entry.isIntersecting).map(entry => entry.target);
      revealTargets(readyTargets);
    });
    return observer;
  }
  function sortBatchTargets(targets = []) {
    return [...targets].sort((firstTarget, secondTarget) => {
      if (!firstTarget || !secondTarget || typeof firstTarget.getBoundingClientRect !== 'function' || typeof secondTarget.getBoundingClientRect !== 'function') {
        return 0;
      }
      const firstRect = firstTarget.getBoundingClientRect();
      const secondRect = secondTarget.getBoundingClientRect();
      const verticalDelta = firstRect.top - secondRect.top;
      if (Math.abs(verticalDelta) > 24) {
        return verticalDelta;
      }
      return firstRect.left - secondRect.left;
    });
  }

  // The choreographer's onReveal callback. Branches on whether the target
  // is already in the --revealed state:
  //   - Already revealed (e.g., Slick slide becoming active again) → run
  //     the replay pattern (snap to pre-state with transitions disabled,
  //     reflow, re-enable, trigger).
  //   - Pending → wrap in a rAF×2 so the browser has painted the pre-state
  //     before we flip to --revealed; otherwise CSS transitions won't fire.
  function handleReveal(target) {
    if (!target || !target.classList) return;
    if (target.classList.contains('anima-intro-target--revealed')) {
      replayKineticTitle(target);
      return;
    }
    const runReveal = () => revealTarget(target);
    if (win && typeof win.requestAnimationFrame === 'function') {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(runReveal);
      });
      return;
    }
    runReveal();
  }

  // Lazily-created choreographer. Factory signature lets tests substitute
  // a synchronous stub; default is the real one.
  let choreographer = null;
  function getChoreographer() {
    if (!choreographer) {
      choreographer = createChoreographer({
        window: win,
        prefersReducedMotion,
        onReveal: handleReveal
      });
    }
    return choreographer;
  }
  function requestTargetReveal(target) {
    if (!target) return;
    const gates = typeof resolveGates === 'function' ? resolveGates(target) : [];
    getChoreographer().requestReveal(target, {
      waitFor: gates
    });
  }
  function revealTargets(targets = []) {
    const sortedTargets = sortBatchTargets(targets);
    sortedTargets.forEach((target, index) => {
      applyRevealDelay(target, index, sortedTargets.length);
      requestTargetReveal(target);
    });
  }
  function scheduleReveal(targets) {
    if (!targets.length) {
      return;
    }

    // Route through the choreographer so any active gates hold these
    // reveals until ready. The choreographer fires onReveal (handleReveal),
    // which applies the rAF×2 pre-paint dance — no need for us to rAF first.
    revealTargets(targets);
  }
  function initialize(root = doc) {
    if (!hasEnabledBodyClass() || !root || typeof collectTargets !== 'function') {
      return [];
    }
    disconnect();
    const immediateTargets = [];
    const primaryTargets = collectTargets(root);
    let targets = primaryTargets;

    // Kinetic extension: also animate title-role headings anywhere on the
    // page (card titles inside reveal roots, collection headings outside
    // them, footer headings, etc.). The outer reveal-root containers still
    // slide (role-other), and any title found via this broader collector
    // gets the word-curtain (role-title). Outside Kinetic this is a no-op
    // so fade/slide/scale keep the original outer-only reveal semantics.
    if (getActiveAnimationStyle() === 'kinetic' && typeof collectKineticTitles === 'function') {
      const extraTitles = collectKineticTitles(root, primaryTargets);
      if (extraTitles && extraTitles.length) {
        targets = primaryTargets.concat(extraTitles);
      }

      // Also start watching for Slick slide changes so Kinetic titles
      // inside a carousel re-play their word-curtain each time a slide
      // becomes newly active (IntersectionObserver doesn't re-fire
      // because Slick uses CSS transform, not DOM mutation).
      slideChangeObserver = observeSlickSlideChanges();
    }
    targets.forEach(target => {
      if (!stageTarget(target)) {
        return;
      }
      if (isInViewport(target)) {
        immediateTargets.push(target);
        return;
      }
      const activeObserver = ensureObserver();
      if (activeObserver && typeof activeObserver.observe === 'function') {
        activeObserver.observe(target);
      }
    });
    scheduleReveal(immediateTargets);
    return targets;
  }
  function bind() {
    if (isBound || !win || typeof win.addEventListener !== 'function') {
      return;
    }
    win.addEventListener('anima:page-transition-complete', () => {
      initialize(doc);
    });
    isBound = true;
  }
  return {
    initialize,
    bind,
    disconnect,
    revealTarget,
    revealTargets,
    stageTarget,
    prefersReducedMotion,
    isInViewport,
    getRevealObserverOptions,
    // Exposed for tests and for external consumers who want to pre-split
    // server-rendered headings (e.g. a future critical-path enhancement).
    splitHeadingForCurtain,
    replayKineticTitle,
    // Integrations (page-transition-gate, slick-gate) attach to this.
    // Getter so lazy creation still works: callers don't have to know
    // about the creation timing.
    get choreographer() {
      return getChoreographer();
    }
  };
}
module.exports = {
  createIntroAnimationsRuntime,
  getRevealObserverOptions,
  classifyTargetRole,
  TITLE_ROLE_SELECTORS,
  DELAY_WINDOW_BY_STYLE
};

/***/ },

/***/ 687
(module, __unused_webpack_exports, __webpack_require__) {

const {
  NEW_HERO_SELECTOR,
  OLD_HERO_SELECTOR
} = __webpack_require__(771);
const REVEAL_ROOT_SELECTORS = ['.wp-block-cover', '.wp-block-group', '.wp-block-columns', '.wp-block-media-text', '.wp-block-gallery', '.wp-block-image', '.wp-block-quote', '.wp-block-pullquote', '.wp-block-buttons', '.wp-block-button', '.wp-block-query .wp-block-post', '.nb-supernova-item'];
const FALLBACK_TARGET_SELECTORS = ['.wp-block-heading', '.wp-block-paragraph', '.wp-block-list', '.wp-block-table', '.wp-block-separator', '.wp-block-file', '.wp-block-embed', '.wp-block-post-title', '.wp-block-post-featured-image', '.wp-block-post-excerpt'];
const EXCLUDED_TARGET_SELECTORS = ['header', 'footer', '.js-page-transition-border', '.js-slide-wipe-loader', NEW_HERO_SELECTOR, OLD_HERO_SELECTOR, '.nb-supernova-item--scrolling-effect-parallax', '#wpadminbar', '[aria-hidden="true"]', '[inert]'];
function isExcludedTarget(node) {
  if (!node || typeof node.matches !== 'function' || typeof node.closest !== 'function') {
    return false;
  }
  return EXCLUDED_TARGET_SELECTORS.some(selector => node.matches(selector) || node.closest(selector));
}
function hasTrackedRevealAncestor(node, trackedNodes = []) {
  if (!node) {
    return false;
  }
  return trackedNodes.some(trackedNode => {
    return trackedNode !== node && typeof trackedNode.contains === 'function' && trackedNode.contains(node);
  });
}
function addTargetsForSelectors(root, selectors, trackedNodes) {
  selectors.forEach(selector => {
    const nodes = Array.from(root.querySelectorAll(selector));
    nodes.forEach(node => {
      if (!node || node.isConnected === false) {
        return;
      }
      if (trackedNodes.includes(node) || isExcludedTarget(node) || hasTrackedRevealAncestor(node, trackedNodes)) {
        return;
      }
      trackedNodes.push(node);
    });
  });
}
function collectRevealTargets(root) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }
  const trackedNodes = [];
  addTargetsForSelectors(root, REVEAL_ROOT_SELECTORS, trackedNodes);
  addTargetsForSelectors(root, FALLBACK_TARGET_SELECTORS, trackedNodes);
  return trackedNodes;
}

// Kinetic-only extension: find heading-role nodes anywhere on the page so they
// can receive the word-curtain treatment, regardless of whether they live
// inside a tracked reveal-root container. Used by the runtime when the active
// animation style is 'kinetic'. For fade/slide/scale this helper is never
// called — those styles keep the original outer-only reveal semantics.
//
// Deliberately broader than `collectRevealTargets`:
//   - Selector list includes Nova Blocks' custom title classes
//     (.nb-collection__title, .nb-card__title) which aren't picked up by
//     Anima's standard fallback list.
//   - Excluded-zone list is SMALLER than the default one: we WANT footer
//     headings to animate under Kinetic (they're typographic moments too).
//     Only admin bar, site <header> chrome, hidden/inert nodes, and the
//     page-transition loader UI are excluded.
const KINETIC_TITLE_SELECTORS = ['h1', 'h2', 'h3', '.wp-block-heading', '.wp-block-post-title', '.nb-collection__title', '.nb-card__title'].join(',');
const KINETIC_EXCLUDED_ZONES = ['#wpadminbar', '[aria-hidden="true"]', '[inert]', '.js-page-transition-border', '.js-slide-wipe-loader', 'header'
// Intentionally NOT excluding .nb-supernova-item--scrolling-effect-parallax:
// the parallax container keeps its own scroll motion, but the title inside
// it (e.g., a single-project hero h1.wp-block-post-title) still benefits
// from the Kinetic word-curtain. The container itself isn't a primary
// intro target anyway (the base EXCLUDED_TARGET_SELECTORS list keeps the
// container static), so there's no conflicting outer animation.
].join(',');
function isInsideKineticExclusionZone(node) {
  if (!node || typeof node.closest !== 'function') {
    return false;
  }
  const hit = node.closest(KINETIC_EXCLUDED_ZONES);
  if (!hit) {
    return false;
  }

  // Slick carousels toggle aria-hidden="true" on inactive slides as part of
  // their rotation — but the slide content IS visible when the slide is
  // active. If the nearest exclusion-zone ancestor is a .slick-slide, let
  // the title through; the carousel replay observer will re-run its reveal
  // each time the slide becomes active.
  if (hit.classList && hit.classList.contains('slick-slide')) {
    return false;
  }
  return true;
}
function collectKineticTitleTargets(root, primaryTargets = []) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }
  const primarySet = new Set(primaryTargets);
  const results = [];
  const seen = new Set();
  const candidates = Array.from(root.querySelectorAll(KINETIC_TITLE_SELECTORS));
  candidates.forEach(node => {
    if (!node || node.isConnected === false) {
      return;
    }

    // Already handled by the primary-target pipeline (or collected here earlier
    // in the loop) — skip to avoid double-staging.
    if (primarySet.has(node) || seen.has(node)) {
      return;
    }

    // Kinetic-specific exclusion zones. Intentionally more lenient than
    // EXCLUDED_TARGET_SELECTORS — footer is NOT listed, because users want
    // Kinetic to animate footer headings too. The aria-hidden check is
    // further narrowed in isInsideKineticExclusionZone so slick-slide
    // rotation doesn't hide every inactive slide's title permanently.
    if (isInsideKineticExclusionZone(node)) {
      return;
    }
    seen.add(node);
    results.push(node);
  });
  return results;
}
module.exports = {
  REVEAL_ROOT_SELECTORS,
  FALLBACK_TARGET_SELECTORS,
  EXCLUDED_TARGET_SELECTORS,
  KINETIC_TITLE_SELECTORS,
  KINETIC_EXCLUDED_ZONES,
  isExcludedTarget,
  hasTrackedRevealAncestor,
  collectRevealTargets,
  collectKineticTitleTargets
};

/***/ },

/***/ 236
(module) {

function cleanupTransitionContainer(container) {
  if (!container || typeof container.querySelectorAll !== 'function') {
    return;
  }
  container.querySelectorAll('.js-reading-bar, .js-reading-progress').forEach(element => {
    element.remove();
  });
  container.querySelectorAll('video').forEach(video => {
    video.pause();
    video.src = '';
    video.load();
    video.remove();
  });
}
module.exports = {
  cleanupTransitionContainer
};

/***/ },

/***/ 628
(module) {

const NAMED_HTML_ENTITIES = {
  amp: '&',
  apos: '\'',
  gt: '>',
  hellip: '…',
  lt: '<',
  mdash: '—',
  nbsp: '\u00A0',
  ndash: '–',
  quot: '"'
};
function decodeHtmlEntities(text) {
  return text.replace(/&(#(?:x[\da-f]+|\d+)|[a-z]+);/gi, (entity, value) => {
    if (value.charAt(0) === '#') {
      const isHex = value.charAt(1).toLowerCase() === 'x';
      const number = parseInt(value.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      if (Number.isFinite(number)) {
        return String.fromCodePoint(number);
      }
      return entity;
    }
    const namedValue = NAMED_HTML_ENTITIES[value.toLowerCase()];
    return typeof namedValue === 'string' ? namedValue : entity;
  });
}
function getDocumentTitleFromHtml(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match || !match[1]) {
    return null;
  }
  return decodeHtmlEntities(match[1].trim());
}
function syncDocumentTitle(html, targetDocument = document) {
  const title = getDocumentTitleFromHtml(html);
  if (title === null) {
    return null;
  }
  targetDocument.title = title;
  return title;
}
module.exports = {
  decodeHtmlEntities,
  getDocumentTitleFromHtml,
  syncDocumentTitle
};

/***/ },

/***/ 564
(module) {

const PROGRESS_SELECTOR = '.js-reading-progress';
const TITLE_SELECTOR = '.wp-block-post-title, .entry-title';
const CONTENT_SELECTOR = '.wp-block-post-content, .entry-content, #primary, main';
const IGNORED_SELECTOR = '.article-header, .post-navigation, .novablocks-conversations';
let destroyReadingBarSync = null;
function getIgnoredHeight(targetDocument) {
  if (!targetDocument || typeof targetDocument.querySelectorAll !== 'function') {
    return 0;
  }
  return Array.from(targetDocument.querySelectorAll(IGNORED_SELECTOR)).reduce((total, element) => {
    return total + (element?.offsetHeight || 0);
  }, 0);
}
function getReadingBarBounds(targetDocument = document, targetWindow = window) {
  const title = targetDocument.querySelector(TITLE_SELECTOR);
  const content = targetDocument.querySelector(CONTENT_SELECTOR);
  if (!title && !content) {
    return null;
  }
  const titleBottom = title ? title.offsetTop + title.offsetHeight : content.offsetTop;
  const contentBottom = content ? content.offsetTop + content.offsetHeight : targetDocument.body?.scrollHeight || titleBottom;
  const min = Number.isFinite(titleBottom) ? titleBottom : 0;
  const maxCandidate = contentBottom - getIgnoredHeight(targetDocument) - targetWindow.innerHeight;
  const max = Math.max(min, Number.isFinite(maxCandidate) ? maxCandidate : min);
  return {
    min,
    max
  };
}
function getReadingBarProgress(scrollY, bounds) {
  var _bounds$min, _bounds$max;
  const min = (_bounds$min = bounds?.min) !== null && _bounds$min !== void 0 ? _bounds$min : 0;
  const max = (_bounds$max = bounds?.max) !== null && _bounds$max !== void 0 ? _bounds$max : min;
  const safeScrollY = Number.isFinite(scrollY) ? scrollY : 0;
  const range = max - min;
  if (!Number.isFinite(range) || range <= 0) {
    return safeScrollY > min ? 1 : 0;
  }
  const progress = (safeScrollY - min) / range;
  if (!Number.isFinite(progress)) {
    return safeScrollY > min ? 1 : 0;
  }
  return Math.max(0, Math.min(1, progress));
}
function syncAjaxReadingProgress(targetDocument = document, targetWindow = window) {
  const progressBar = targetDocument.querySelector(PROGRESS_SELECTOR);
  if (!progressBar?.style || typeof progressBar.style.setProperty !== 'function') {
    return null;
  }
  const progress = getReadingBarProgress(targetWindow.pageYOffset, getReadingBarBounds(targetDocument, targetWindow));
  progressBar.style.setProperty('--progress', progress);
  return progress;
}
function bindAjaxReadingProgress(targetDocument = document, targetWindow = window) {
  if (!targetDocument.querySelector(PROGRESS_SELECTOR)) {
    return () => {};
  }
  let rafId = null;
  let timeoutId = null;
  const runSync = () => {
    rafId = null;
    syncAjaxReadingProgress(targetDocument, targetWindow);
  };
  const scheduleSync = () => {
    if (typeof targetWindow.requestAnimationFrame !== 'function') {
      runSync();
      return;
    }
    if (rafId !== null) {
      return;
    }
    rafId = targetWindow.requestAnimationFrame(runSync);
  };
  if (typeof targetWindow.addEventListener === 'function') {
    targetWindow.addEventListener('scroll', scheduleSync);
    targetWindow.addEventListener('resize', scheduleSync);
  }
  syncAjaxReadingProgress(targetDocument, targetWindow);
  scheduleSync();
  if (typeof targetWindow.setTimeout === 'function') {
    timeoutId = targetWindow.setTimeout(scheduleSync, 250);
  }
  return () => {
    if (typeof targetWindow.removeEventListener === 'function') {
      targetWindow.removeEventListener('scroll', scheduleSync);
      targetWindow.removeEventListener('resize', scheduleSync);
    }
    if (rafId !== null && typeof targetWindow.cancelAnimationFrame === 'function') {
      targetWindow.cancelAnimationFrame(rafId);
    }
    if (timeoutId !== null && typeof targetWindow.clearTimeout === 'function') {
      targetWindow.clearTimeout(timeoutId);
    }
  };
}
function rebindAjaxReadingProgress(targetDocument = document, targetWindow = window) {
  if (typeof destroyReadingBarSync === 'function') {
    destroyReadingBarSync();
  }
  destroyReadingBarSync = bindAjaxReadingProgress(targetDocument, targetWindow);
  return destroyReadingBarSync;
}
module.exports = {
  bindAjaxReadingProgress,
  getReadingBarBounds,
  getReadingBarProgress,
  rebindAjaxReadingProgress,
  syncAjaxReadingProgress
};

/***/ },

/***/ 547
(module) {

function getTransitionColorFromTrigger(trigger, fallbackColor = 'var(--sm-current-accent-color)') {
  if (!trigger || typeof trigger.getAttribute !== 'function') {
    return fallbackColor;
  }
  const explicitColorAttributes = ['data-anima-transition-color', 'data-color'];
  for (const attributeName of explicitColorAttributes) {
    const explicitColor = trigger.getAttribute(attributeName);
    if (explicitColor && explicitColor.trim()) {
      return explicitColor.trim();
    }
  }
  return fallbackColor;
}
module.exports = {
  getTransitionColorFromTrigger
};

/***/ },

/***/ 233
(module) {

function matchesPilePattern({
  index,
  columns = 1,
  target3d = 'item',
  rule3d = 'odd'
}) {
  const normalizedColumns = Math.max(1, parseInt(columns, 10) || 1);
  if (target3d === 'column') {
    const column = index % normalizedColumns + 1;
    return rule3d === 'even' ? column % 2 === 0 : column % 2 === 1;
  }
  const position = index + 1;
  return rule3d === 'even' ? position % 2 === 0 : position % 2 === 1;
}
function getPilePatternSettings({
  className = '',
  columns = 1
} = {}) {
  return {
    has3d: className.includes('nb-supernova--pile-3d'),
    target3d: className.includes('nb-supernova--pile-3d-target-column') ? 'column' : 'item',
    rule3d: className.includes('nb-supernova--pile-3d-rule-even') ? 'even' : 'odd',
    columns: Math.max(1, parseInt(columns, 10) || 1)
  };
}
function shouldParallaxItem({
  has3d = false,
  index,
  columns = 1,
  target3d = 'item',
  rule3d = 'odd'
}) {
  if (!has3d) {
    return true;
  }
  return matchesPilePattern({
    index,
    columns,
    target3d,
    rule3d
  });
}
module.exports = {
  getPilePatternSettings,
  matchesPilePattern,
  shouldParallaxItem
};

/***/ },

/***/ 33
(module, __unused_webpack_exports, __webpack_require__) {

const {
  createSiteFrameRuntime
} = __webpack_require__(869);
class SiteFrame {
  constructor({
    window: win = typeof window !== 'undefined' ? window : null,
    runtime = createSiteFrameRuntime()
  } = {}) {
    this.window = win;
    this.runtime = runtime;
    this.onResize = this.onResize.bind(this);
    this.runtime.sync();
    if (this.window && typeof this.window.addEventListener === 'function') {
      this.window.addEventListener('resize', this.onResize);
    }
  }
  onResize() {
    this.runtime.sync();
  }
}
module.exports = SiteFrame;

/***/ },

/***/ 869
(module) {

const SITE_FRAME_CLONE_ATTR = 'siteFrameClone';
function getChildElements(node) {
  if (!node || !node.children) {
    return [];
  }
  return Array.from(node.children);
}
function removeSiteFrameMobileMenuClones(targetList) {
  if (!targetList) {
    return 0;
  }
  let removedCount = 0;
  getChildElements(targetList).forEach(item => {
    if (item?.dataset?.[SITE_FRAME_CLONE_ATTR] !== 'true') {
      return;
    }
    if (typeof item.remove === 'function') {
      item.remove();
      removedCount += 1;
    }
  });
  return removedCount;
}
function appendSiteFrameMobileMenuItems(sourceList, targetList) {
  if (!sourceList || !targetList) {
    return 0;
  }
  removeSiteFrameMobileMenuClones(targetList);
  let appendedCount = 0;
  getChildElements(sourceList).forEach(item => {
    if (!item || typeof item.cloneNode !== 'function') {
      return;
    }
    const clone = item.cloneNode(true);
    if (!clone.dataset) {
      clone.dataset = {};
    }
    clone.dataset[SITE_FRAME_CLONE_ATTR] = 'true';
    if (clone.classList && typeof clone.classList.add === 'function') {
      clone.classList.add('menu-item--site-frame-clone');
    }
    if (typeof targetList.appendChild === 'function') {
      targetList.appendChild(clone);
      appendedCount += 1;
    }
  });
  return appendedCount;
}
function syncSiteFrameMobileMenu({
  enabled = false,
  belowLap = false,
  sourceList = null,
  targetList = null
} = {}) {
  if (!enabled || !belowLap || !sourceList || !targetList) {
    removeSiteFrameMobileMenuClones(targetList);
    return 0;
  }
  return appendSiteFrameMobileMenuItems(sourceList, targetList);
}
function createSiteFrameRuntime({
  window: win = typeof window !== 'undefined' ? window : null,
  document: doc = typeof document !== 'undefined' ? document : null,
  sourceSelector = '.c-site-frame__menu',
  targetSelector = '.nb-header .nb-navigation--primary .menu',
  isBelowLap = () => !!win && typeof win.matchMedia === 'function' && win.matchMedia('not screen and (min-width: 1024px)').matches
} = {}) {
  function hasEnabledBodyClass() {
    return !!doc && !!doc.body && !!doc.body.classList && doc.body.classList.contains('has-site-frame-menu');
  }
  function getSourceList() {
    return doc && typeof doc.querySelector === 'function' ? doc.querySelector(sourceSelector) : null;
  }
  function getTargetList() {
    return doc && typeof doc.querySelector === 'function' ? doc.querySelector(targetSelector) : null;
  }
  function sync() {
    return syncSiteFrameMobileMenu({
      enabled: hasEnabledBodyClass(),
      belowLap: isBelowLap(),
      sourceList: getSourceList(),
      targetList: getTargetList()
    });
  }
  return {
    sync,
    removeClones() {
      return removeSiteFrameMobileMenuClones(getTargetList());
    }
  };
}
module.exports = {
  SITE_FRAME_CLONE_ATTR,
  appendSiteFrameMobileMenuItems,
  createSiteFrameRuntime,
  removeSiteFrameMobileMenuClones,
  syncSiteFrameMobileMenu
};

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

;// external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
// EXTERNAL MODULE: ./node_modules/@barba/core/dist/barba.umd.js
var barba_umd = __webpack_require__(714);
var barba_umd_default = /*#__PURE__*/__webpack_require__.n(barba_umd);
;// ./src/js/utils.js



const debounce = (func, wait) => {
  let timeout = null;
  return function () {
    const context = this;
    const args = arguments;
    const later = () => {
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const hasTouchScreen = function () {
  var hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true;
    } else {
      var UA = navigator.userAgent;
      hasTouchScreen = /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
  return hasTouchScreen;
};
function setAndResetElementStyles(element, props = {}) {
  const $element = external_jQuery_default()(element);
  $element.css(props);
  Object.keys(props).forEach(key => {
    props[key] = '';
  });
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      $element.css(props);
    });
  } else {
    setTimeout(() => {
      $element.css(props);
    }, 0);
  }
}
const getColorSetClasses = element => {
  const classAttr = element?.getAttribute('class');
  if (!classAttr) {
    return [];
  }
  const classes = classAttr.split(/\s+/);
  return classes.filter(classname => {
    return classname.search('sm-palette-') !== -1 || classname.search('sm-variation-') !== -1;
  });
};
const addClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);
  if (classesArray.length) {
    element.classList.add(...classesArray);
  }
};
const removeClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);
  if (classesArray.length) {
    element.classList.remove(...classesArray);
  }
};
const hasClass = (element, className) => {
  return element.classList.contains(className);
};
const toggleClasses = (element, classesToAdd = '') => {
  const prefixes = ['sm-palette-', 'sm-variation-', 'sm-color-signal-'];
  const classesToRemove = Array.from(element.classList).filter(classname => {
    return prefixes.some(prefix => classname.indexOf(prefix) > -1);
  });
  element.classList.remove(...classesToRemove);
  addClass(element, classesToAdd);
};
function getFirstChild(el) {
  var firstChild = el.firstChild;
  while (firstChild != null && firstChild.nodeType === 3) {
    // skip TextNodes
    firstChild = firstChild.nextSibling;
  }
  return firstChild;
}
const getFirstBlock = element => {
  if (!element || !element.children.length) {
    return element;
  }
  const firstBlock = element.children[0];
  if (hasClass(firstBlock, 'nb-sidecar')) {
    const content = firstBlock.querySelector('.nb-sidecar-area--content');
    if (content && content.children.length) {
      return getFirstBlock(content);
    }
  }
  return firstBlock;
};
;// ./src/js/components/globalService.js


class GlobalService {
  constructor() {
    this.props = {};
    this.newProps = {};
    this.renderCallbacks = [];
    this.resizeCallbacks = [];
    this.debouncedResizeCallbacks = [];
    this.observeCallbacks = [];
    this.scrollCallbacks = [];
    this.currentMutationList = [];
    this.frameRendered = true;
    this.useOrientation = hasTouchScreen() && 'orientation' in window;
    this._init();
  }
  _init() {
    const $window = external_jQuery_default()(window);
    const updateProps = this._updateProps.bind(this);
    const renderLoop = this._renderLoop.bind(this);
    this._debouncedResizeCallback = debounce(this._resizeCallbackToBeDebounced.bind(this), 100);

    // now
    updateProps();

    // on document ready
    external_jQuery_default()(updateProps);
    this._bindOnResize();
    this._bindOnScroll();
    this._bindOnLoad();
    this._bindObserver();
    this._bindCustomizer();
    requestAnimationFrame(renderLoop);
  }
  _bindOnResize() {
    const $window = external_jQuery_default()(window);
    const updateProps = this._updateProps.bind(this);
    if (this.useOrientation) {
      $window.on('orientationchange', () => {
        $window.one('resize', updateProps);
      });
    } else {
      $window.on('resize', updateProps);
    }
  }
  _bindOnScroll() {
    external_jQuery_default()(window).on('scroll', this._updateScroll.bind(this));
  }
  _bindOnLoad() {
    external_jQuery_default()(window).on('load', this._updateProps.bind(this));
  }
  _bindObserver() {
    const self = this;
    const observeCallback = this._observeCallback.bind(this);
    const observeAndUpdateProps = () => {
      observeCallback();
      self.currentMutationList = [];
    };
    const debouncedObserveCallback = debounce(observeAndUpdateProps, 300);
    if (!window.MutationObserver) {
      return;
    }
    const observer = new MutationObserver(function (mutationList) {
      self.currentMutationList = self.currentMutationList.concat(mutationList);
      debouncedObserveCallback();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  _bindCustomizer() {
    if (typeof wp !== 'undefined' && typeof wp.customize !== 'undefined') {
      if (typeof wp.customize.selectiveRefresh !== 'undefined') {
        wp.customize.selectiveRefresh.bind('partial-content-rendered', this._updateProps.bind(this));
      }
      wp.customize.bind('change', debounce(this._updateProps.bind(this), 100));
    }
  }
  _updateProps(force = false) {
    this._updateSize(force);
    this._updateScroll(force);
  }
  _observeCallback() {
    const mutationList = this.currentMutationList;
    external_jQuery_default().each(this.observeCallbacks, function (i, fn) {
      fn(mutationList);
    });
  }
  _renderLoop() {
    if (!this.frameRendered) {
      this._renderCallback();
      this.frameRendered = true;
    }
    window.requestAnimationFrame(this._renderLoop.bind(this));
  }
  _renderCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.renderCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _resizeCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.resizeCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _resizeCallbackToBeDebounced() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.debouncedResizeCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _scrollCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.scrollCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }
  _updateScroll(force = false) {
    this.newProps = Object.assign({}, this.newProps, {
      scrollY: window.scrollY,
      scrollX: window.scrollX
    });
    this._shouldUpdate(this._scrollCallback.bind(this));
  }
  _updateSize(force = false) {
    const body = document.body;
    const html = document.documentElement;
    const bodyScrollHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight);
    const htmlScrollHeight = Math.max(html.scrollHeight, html.offsetHeight);
    this.newProps = Object.assign({}, this.newProps, {
      scrollHeight: Math.max(bodyScrollHeight, htmlScrollHeight),
      adminBarHeight: this.getAdminBarHeight(),
      windowWidth: this.useOrientation && window.screen && window.screen.availWidth || window.innerWidth,
      windowHeight: this.useOrientation && window.screen && window.screen.availHeight || window.innerHeight
    });
    this._shouldUpdate(() => {
      this._resizeCallback();
      this._debouncedResizeCallback();
    });
  }
  _shouldUpdate(callback, force = false) {
    if (this._hasNewProps() || force) {
      this.props = Object.assign({}, this.props, this.newProps);
      this.newProps = {};
      this.frameRendered = false;
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
  _hasNewProps() {
    return Object.keys(this.newProps).some(key => {
      return this.newProps[key] !== this.props[key];
    });
  }
  getAdminBarHeight() {
    const adminBar = document.getElementById('wpadminbar');
    if (adminBar) {
      const box = adminBar.getBoundingClientRect();
      return box.height;
    }
    return 0;
  }
  registerOnResize(fn) {
    if (typeof fn === 'function' && this.resizeCallbacks.indexOf(fn) < 0) {
      this.resizeCallbacks.push(fn);
    }
  }
  registerOnDeouncedResize(fn) {
    if (typeof fn === 'function' && this.resizeCallbacks.indexOf(fn) < 0) {
      this.debouncedResizeCallbacks.push(fn);
    }
  }
  registerOnScroll(fn) {
    if (typeof fn === 'function' && this.scrollCallbacks.indexOf(fn) < 0) {
      this.scrollCallbacks.push(fn);
    }
  }
  registerObserverCallback(fn) {
    if (typeof fn === 'function' && this.observeCallbacks.indexOf(fn) < 0) {
      this.observeCallbacks.push(fn);
    }
  }
  registerRender(fn) {
    if (typeof fn === 'function' && this.renderCallbacks.indexOf(fn) < 0) {
      this.renderCallbacks.push(fn);
    }
  }
  getProps() {
    return this.props;
  }
}
/* harmony default export */ const globalService = (new GlobalService());
;// ./src/js/components/hero.js

class Hero {
  constructor(element) {
    this.element = element;
    this.progress = 0;
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.paused = true;
      }
    });
    this.pieces = this.getMarkupPieces();
    this.paused = false;
    this.offset = 0;
    this.reduceMotion = false;
    this.update();
    this.updateOnScroll();
    this.init();
  }
  init() {
    globalService.registerOnScroll(() => {
      this.update();
    });
    globalService.registerRender(() => {
      this.updateOnScroll();
    });
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      this.reduceMotion = mediaQuery.matches;
      this.updateOnScroll();
    });
    this.reduceMotion = mediaQuery.matches;
    this.addIntroToTimeline();
    this.timeline.addLabel('middle');
    this.addOutroToTimeline();
    this.timeline.addLabel('end');
    this.pauseTimelineOnScroll();
    if (this.reduceMotion) {
      const middleTime = this.labels.middle;
      const endTime = this.labels.end;
      const minTlProgress = middleTime / endTime;
      this.paused = true;
      this.timeline.progress(minTlProgress);
    } else {
      this.timeline.play();
    }
  }
  update() {
    const {
      scrollY
    } = globalService.getProps();
    this.box = this.element.getBoundingClientRect();
    this.view = {
      left: this.box.left,
      top: this.box.top + scrollY,
      width: this.box.width,
      height: this.box.height
    };
  }
  updateOnScroll() {
    const {
      scrollY,
      scrollHeight,
      windowHeight
    } = globalService.getProps();

    // used to calculate animation progress
    const length = windowHeight * 0.5;
    const middleMin = 0;
    const middleMax = scrollHeight - windowHeight - length * 0.5;
    const middle = this.view.top + (this.box.height - windowHeight) * 0.5;
    const middleMid = Math.max(middleMin, Math.min(middle, middleMax));
    this.start = middleMid - length * 0.5;
    this.end = this.start + length;
    this.progress = (scrollY - this.start) / (this.end - this.start);
    if (this.reduceMotion) {
      const middleTime = this.timeline.labels.middle;
      const endTime = this.timeline.labels.end;
      const minTlProgress = middleTime / endTime;
      this.progress = minTlProgress;
    }
    this.updateTimelineOnScroll();
  }
  updateTimelineOnScroll() {
    if (!this.paused) {
      return;
    }
    const currentProgress = this.timeline.progress();
    const middleTime = this.timeline.labels.middle;
    const endTime = this.timeline.labels.end;
    const minTlProgress = middleTime / endTime;
    let newTlProgress = (this.progress - 0.5) * 2 * (1 - minTlProgress) + minTlProgress;
    newTlProgress = Math.min(Math.max(minTlProgress, newTlProgress), 1);
    if (currentProgress === newTlProgress) {
      return;
    }
    this.timeline.progress(newTlProgress);
  }
  getMarkupPieces() {
    const container = jQuery(this.element).find('.novablocks-hero__inner-container, .nb-supernova-item__inner-container');
    const headline = container.children().filter('.c-headline').first();
    const title = headline.find('.c-headline__primary');
    const subtitle = headline.find('.c-headline__secondary');
    const separator = headline.next('.wp-block-separator');
    const sepFlower = separator.find('.c-separator__symbol');
    const sepLine = separator.find('.c-separator__line');
    const sepArrow = separator.find('.c-separator__arrow');
    const othersBefore = headline.prevAll();
    const othersAfter = headline.length ? headline.nextAll().not(separator).not('.nb-scroll-indicator') : container.children().not('.nb-scroll-indicator');
    return {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    };
  }
  addIntroToTimeline() {
    const timeline = this.timeline;
    const {
      windowWidth
    } = globalService.getProps();
    const {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    } = this.pieces;
    if (title.length && title.text().trim().length) {
      this.splitTitle = new SplitText(title, {
        wordsClass: 'c-headline__word'
      });
      this.splitTitle.lines.forEach(line => {
        const words = Array.from(line.children);
        const letters = [];
        words.forEach(word => {
          letters.push(...word.children);
        });
        letters.forEach(letter => {
          const box = letter.getBoundingClientRect();
          const width = letter.offsetWidth;
          const offset = box.x - windowWidth / 2;
          const offsetPercent = 2 * offset / windowWidth;
          const move = 400 * letters.length * offsetPercent;
          timeline.from(letter, {
            duration: 0.72,
            x: move,
            ease: 'power.out'
          }, 0);
        });
      });
      timeline.fromTo(title, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.89,
        ease: 'power.out'
      }, 0);

      // aici era title dar facea un glitch ciudat
      timeline.fromTo(headline, {
        'y': 30
      }, {
        'y': 0,
        duration: 1,
        ease: 'power.out'
      }, 0);
    }
    if (subtitle.length) {
      timeline.fromTo(subtitle, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.65,
        ease: 'power4.out'
      }, '-=0.65');
      timeline.fromTo(subtitle, {
        y: 30
      }, {
        y: 0,
        duration: 0.9,
        ease: 'power4.out'
      }, '-=0.65');
    }
    if (separator.length) {
      if (sepFlower.length) {
        timeline.fromTo(sepFlower, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.15,
          ease: 'power4.out'
        }, '-=0.6');
        timeline.fromTo(sepFlower, {
          rotation: -270
        }, {
          rotation: 0,
          duration: 0.55,
          ease: 'back.out'
        }, '-=0.5');
      }
      if (sepLine.length) {
        timeline.fromTo(sepLine, {
          width: 0
        }, {
          width: '42%',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out'
        }, '-=0.55');
        timeline.fromTo(separator, {
          width: 0
        }, {
          width: '100%',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out'
        }, '-=0.6');
      }
      if (sepArrow.length) {
        timeline.fromTo(sepArrow, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.2,
          ease: 'power4.out'
        }, '-=0.27');
      }
    }
    if (othersAfter.length) {
      timeline.fromTo(othersAfter, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out'
      }, '-=0.28');
      timeline.fromTo(othersAfter, {
        y: -20
      }, {
        y: 0,
        duration: 0.75
      }, '-=0.5');
    }
    if (othersBefore.length) {
      timeline.fromTo(othersBefore, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out'
      }, '-=0.75');
      timeline.fromTo(othersBefore, {
        y: 20
      }, {
        y: 0,
        duration: 0.75
      }, '-=0.75');
    }
    this.timeline = timeline;
  }
  addOutroToTimeline() {
    const {
      title,
      subtitle,
      othersBefore,
      othersAfter,
      separator,
      sepLine,
      sepFlower,
      sepArrow
    } = this.pieces;
    const timeline = this.timeline;
    if (title.length) {
      timeline.fromTo(title, {
        y: 0
      }, {
        opacity: 0,
        y: -60,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (subtitle.length) {
      timeline.to(subtitle, {
        opacity: 0,
        y: -90,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (othersBefore.length) {
      timeline.to(othersBefore, {
        y: 60,
        opacity: 0,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (othersAfter.length) {
      timeline.to(othersAfter, {
        y: 60,
        opacity: 0,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }
    if (sepLine.length) {
      timeline.to(sepLine, {
        width: '0%',
        opacity: 0,
        duration: 0.86,
        ease: 'power1.in'
      }, '-=0.94');
    }
    if (separator.length) {
      timeline.to(separator, {
        width: '0%',
        opacity: 0,
        duration: 0.86,
        ease: 'power1.in'
      }, '-=0.86');
    }
    if (sepFlower.length) {
      timeline.to(sepFlower, {
        rotation: 180,
        duration: 1
      }, '-=1.08');
    }
    if (sepFlower.length) {
      timeline.to(sepFlower, {
        opacity: 0,
        duration: 0.11
      }, '-=0.03');
    }
    if (sepArrow.length) {
      timeline.to(sepArrow, {
        opacity: 0,
        duration: 0.14
      }, '-=1.08');
    }
    this.timeline = timeline;
  }
  revertTitle() {
    if (typeof this.splitTitle !== 'undefined') {
      this.splitTitle.revert();
    }
  }
  pauseTimelineOnScroll() {
    const middleTime = this.timeline.labels.middle;
    const endTime = this.timeline.labels.end;
    this.timeline.eventCallback('onUpdate', tl => {
      const time = this.timeline.time();

      // calculate the current timeline progress relative to middle and end labels
      // in such a way that timelineProgress is 0.5 for middle and 1 for end
      // because we don't want the animation to be stopped before the middle label
      const tlProgress = (time - middleTime) / (endTime - middleTime);
      const pastMiddle = time > middleTime;
      const pastScroll = tlProgress * 0.5 + 0.5 >= this.progress;
      if (pastMiddle && pastScroll) {
        this.timeline.pause();
        this.revertTitle();
        this.timeline.eventCallback('onUpdate', null);
        this.paused = true;
      }
    }, ['{self}']);
  }
}
// EXTERNAL MODULE: ./src/js/components/hero-init-filter.js
var hero_init_filter = __webpack_require__(771);
var hero_init_filter_default = /*#__PURE__*/__webpack_require__.n(hero_init_filter);
;// ./src/js/components/commentsArea.js

class CommentsArea {
  constructor(element) {
    this.$element = external_jQuery_default()(element);
    this.$checkbox = this.$element.find('.c-comments-toggle__checkbox');
    this.$content = this.$element.find('.comments-area__content');
    this.$contentWrap = this.$element.find('.comments-area__wrap');

    // overwrite CSS that hides the comments area content
    this.$contentWrap.css('display', 'block');
    this.$checkbox.on('change', this.onChange.bind(this));
    this.checkWindowLocationComments();
  }
  onChange() {
    this.toggle(false);
  }
  toggle(instant = false) {
    const $contentWrap = this.$contentWrap;
    const isChecked = this.$checkbox.prop('checked');
    const newHeight = isChecked ? this.$content.outerHeight() : 0;
    if (instant) {
      $contentWrap.css('height', newHeight);
    } else {
      gsap.to($contentWrap, {
        duration: 0.4,
        height: newHeight,
        onComplete: function () {
          if (isChecked) {
            $contentWrap.css('height', '');
          }
        }
      });
    }
  }
  checkWindowLocationComments() {
    if (window.location.href.indexOf('#comment') === -1) {
      this.$checkbox.prop('checked', false);
      this.toggle(true);
    }
  }
}
;// ./src/js/components/mqService.js

class mqService {
  constructor() {
    this.breakpoints = {
      mobile: '480px',
      tablet: '768px',
      lap: '1024px',
      desktop: '1440px'
    };
    this.above = {};
    this.below = {};
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
    this.onResize();
  }
  onResize() {
    Object.keys(this.breakpoints).forEach(key => {
      const breakpoint = this.breakpoints[key];
      this.above[key] = !!window.matchMedia(`not screen and (min-width: ${breakpoint})`).matches;
      this.below[key] = !!window.matchMedia(`not screen and (min-width: ${breakpoint})`).matches;
    });
  }
}
/* harmony default export */ const components_mqService = (new mqService());
;// ./src/js/components/navbar.js



const MENU_ITEM = '.menu-item, .page_item';
const MENU_ITEM_WITH_CHILDREN = '.menu-item-has-children, .page_item_has_children';
const SUBMENU = '.sub-menu, .children';
const SUBMENU_LEFT_CLASS = 'has-submenu-left';
const HOVER_CLASS = 'hover';
class Navbar {
  constructor() {
    this.$menuItems = external_jQuery_default()(MENU_ITEM);
    this.$menuItemsWithChildren = this.$menuItems.filter(MENU_ITEM_WITH_CHILDREN).removeClass(HOVER_CLASS);
    this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children('a');
    this.initialize();
  }
  initialize() {
    this.onResize();
    this.initialized = true;
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
  }
  onResize() {
    // we are on desktop
    if (!components_mqService.below.lap) {
      this.addSubMenusLeftClass();
      if (this.initialized && !this.desktop) {
        this.unbindClick();
      }
      if (!this.initialized || !this.desktop) {
        this.bindHoverIntent();
      }
      this.desktop = true;
      return;
    }
    this.removeSubMenusLeftClass();
    if (this.initialized && this.desktop) {
      this.unbindHoverIntent();
    }
    if (!this.initialized || this.desktop) {
      this.bindClick();
    }
    this.desktop = false;
  }
  addSubMenusLeftClass() {
    const {
      windowWidth
    } = globalService.getProps();
    this.$menuItemsWithChildren.each(function (index, obj) {
      const $obj = external_jQuery_default()(obj);
      const $subMenu = $obj.children(SUBMENU),
        subMenuWidth = $subMenu.outerWidth(),
        subMenuOffSet = $subMenu.offset(),
        availableSpace = windowWidth - subMenuOffSet.left;
      if (availableSpace < subMenuWidth) {
        $obj.addClass(SUBMENU_LEFT_CLASS);
      }
    });
  }
  removeSubMenusLeftClass() {
    this.$menuItemsWithChildren.removeClass(SUBMENU_LEFT_CLASS);
  }
  onClickMobile(event) {
    const $link = external_jQuery_default()(this);
    const $siblings = $link.parent().siblings().not($link);
    if ($link.is('.active')) {
      return;
    }
    event.preventDefault();
    $link.addClass('active').parent().addClass(HOVER_CLASS);
    $siblings.removeClass(HOVER_CLASS);
    $siblings.find('.active').removeClass('active');
  }
  bindClick() {
    this.$menuItemsWithChildrenLinks.on('click', this.onClickMobile);
  }
  unbindClick() {
    this.$menuItemsWithChildrenLinks.off('click', this.onClickMobile);
  }
  bindHoverIntent() {
    this.$menuItems.hoverIntent({
      out: function () {
        external_jQuery_default()(this).removeClass(HOVER_CLASS);
      },
      over: function () {
        external_jQuery_default()(this).addClass(HOVER_CLASS);
      },
      timeout: 200
    });
  }
  unbindHoverIntent() {
    this.$menuItems.off('mousemove.hoverIntent mouseenter.hoverIntent mouseleave.hoverIntent');
    delete this.$menuItems.hoverIntent_t;
    delete this.$menuItems.hoverIntent_s;
  }
}
;// ./src/js/components/base-component.js

class BaseComponent {
  constructor() {
    globalService.registerOnResize(this.onResize.bind(this));
    globalService.registerOnDeouncedResize(this.onDebouncedResize.bind(this));
  }
  onResize() {}
  onDebouncedResize() {}
}
/* harmony default export */ const base_component = (BaseComponent);
;// ./src/js/components/search-overlay.js



const SEARCH_OVERLAY_OPEN_CLASS = 'has-search-overlay';
const ESC_KEY_CODE = 27;
class SearchOverlay extends base_component {
  constructor() {
    super();
    this.$searchOverlay = external_jQuery_default()('.c-search-overlay');
    this.initialize();
    this.onDebouncedResize();
  }
  initialize() {
    external_jQuery_default()(document).on('click', '.menu-item--search a', this.openSearchOverlay);
    external_jQuery_default()(document).on('click', '.c-search-overlay__cancel', this.closeSearchOverlay);
    external_jQuery_default()(document).on('keydown', this.closeSearchOverlayOnEsc);
  }
  onDebouncedResize() {
    setAndResetElementStyles(this.$searchOverlay, {
      transition: 'none'
    });
  }
  openSearchOverlay(e) {
    e.preventDefault();
    external_jQuery_default()('body').toggleClass(SEARCH_OVERLAY_OPEN_CLASS);
    external_jQuery_default()('.c-search-overlay__form .search-field').focus();
  }
  closeSearchOverlayOnEsc(e) {
    if (e.keyCode === ESC_KEY_CODE) {
      external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
      external_jQuery_default()('.c-search-overlay__form .search-field').blur();
    }
  }
  closeSearchOverlay(e) {
    e.preventDefault();
    external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
  }
}
/* harmony default export */ const search_overlay = (SearchOverlay);
// EXTERNAL MODULE: ./src/js/components/site-frame/index.js
var site_frame = __webpack_require__(33);
var site_frame_default = /*#__PURE__*/__webpack_require__.n(site_frame);
;// ./src/js/components/pile-parallax/index.js
/**
 * Pile Parallax — differential parallax scrolling for Nova Blocks collection grids.
 *
 * Ported from Pile theme's ArchiveParallax.js.
 * Uses vanilla JS + requestAnimationFrame — no GSAP dependency.
 *
 * Two linked features:
 *  1. 3D Grid: applies `js-3d` to the same item/column odd/even pattern used by
 *     Nova Blocks so the frontend matches the editor and plugin CSS.
 *  2. Parallax Scrolling: when 3D is enabled, only the selected 3D pattern gets
 *     translated on scroll; otherwise the effect applies to every item.
 */

const {
  getPilePatternSettings,
  matchesPilePattern,
  shouldParallaxItem
} = __webpack_require__(233);
const PARALLAX_SELECTOR = '.nb-supernova--pile-parallax';
const GRID_3D_SELECTOR = '.nb-supernova--pile-3d';
const ITEM_SELECTOR = '.nb-collection__layout-item';
let blocks = [];
let ticking = false;
let positiveOffsetFactor = 1;
let isBound = false;
let onResizeHandler = null;
let onPageTransitionCompleteHandler = null;
function getDocumentHeight() {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(body ? body.scrollHeight : 0, html ? html.scrollHeight : 0);
}

/**
 * Add only the missing top/bottom space needed for parallax near viewport edges.
 * Mirrors Pile's ArchiveParallax.addMissingPadding() behavior.
 */
function addMissingPadding(layout, items, parallaxAmount, windowHeight) {
  if (!layout) {
    return;
  }
  let maxMissingTop = 0;
  let maxMissingBottom = 0;

  // Remove previously applied inline padding before recomputing.
  layout.style.paddingTop = '';
  layout.style.paddingBottom = '';
  const contentTop = 0;
  const contentBottom = getDocumentHeight();
  items.forEach(item => {
    item.style.transform = '';
    const rect = item.getBoundingClientRect();
    const itemTop = rect.top + window.scrollY;
    const itemHeight = item.offsetHeight;
    const toTop = itemTop + itemHeight / 2 - contentTop;
    const toBottom = contentBottom - itemTop - itemHeight / 2;
    const missingTop = toTop < windowHeight / 2 ? windowHeight / 2 - toTop : 0;
    const missingBottom = toBottom < windowHeight / 2 ? windowHeight / 2 - toBottom : 0;
    const paddingLimit = itemHeight * parallaxAmount / 2;
    maxMissingTop = Math.max(Math.min(missingTop, paddingLimit), maxMissingTop);
    maxMissingBottom = Math.max(Math.min(missingBottom, paddingLimit), maxMissingBottom);
  });
  if (!maxMissingTop && !maxMissingBottom) {
    return;
  }
  const computedStyles = window.getComputedStyle(layout);
  const basePaddingTop = parseFloat(computedStyles.paddingTop) || 0;
  const basePaddingBottom = parseFloat(computedStyles.paddingBottom) || 0;
  layout.style.paddingTop = `${(basePaddingTop + maxMissingTop).toFixed(2)}px`;
  layout.style.paddingBottom = `${(basePaddingBottom + maxMissingBottom).toFixed(2)}px`;
}

/**
 * Apply 3D grid classes to items in a collection.
 * Purely visual: adds `js-3d` class for CSS padding using Nova's selected pattern.
 */
function apply3dClasses(el) {
  const {
    columns,
    target3d,
    rule3d
  } = getPilePatternSettings({
    className: el.className,
    columns: parseInt(el.dataset.columns, 10) || 3
  });
  const items = el.querySelectorAll(ITEM_SELECTOR);
  items.forEach((item, index) => {
    item.classList.toggle('js-3d', matchesPilePattern({
      index,
      columns,
      target3d,
      rule3d
    }));
  });
}

/**
 * Initialize parallax for all matching blocks on the page.
 */
function initialize() {
  blocks = [];

  // 1. Apply 3D classes to all 3D grid blocks (independent of parallax).
  const grid3dElements = document.querySelectorAll(GRID_3D_SELECTOR);
  grid3dElements.forEach(apply3dClasses);

  // 2. Set up parallax scrolling for blocks that have it enabled.
  const parallaxElements = document.querySelectorAll(PARALLAX_SELECTOR);
  const windowHeight = window.innerHeight;
  // Reduce only the positive (downward) phase to avoid oversized blank bands at
  // the top of dense grids, while keeping the negative (upward) phase fully
  // visible so the parallax effect remains obvious during scroll.
  positiveOffsetFactor = 0.35;
  parallaxElements.forEach(el => {
    const amount = parseFloat(el.dataset.pileParallaxAmount) || 0;
    const parallaxAmount = amount / 100;
    const layout = el.querySelector('.nb-collection__layout');
    const pilePattern = getPilePatternSettings({
      className: el.className,
      columns: parseInt(el.dataset.columns, 10) || 3
    });
    if (amount <= 0) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }
    const items = el.querySelectorAll(ITEM_SELECTOR);
    if (!items.length) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }
    const animatedItems = Array.from(items).filter((item, index) => {
      const shouldAnimate = shouldParallaxItem({
        ...pilePattern,
        index
      });
      if (!shouldAnimate) {
        item.style.transform = '';
      }
      return shouldAnimate;
    });
    if (!animatedItems.length) {
      if (layout) {
        layout.style.paddingTop = '';
        layout.style.paddingBottom = '';
      }
      return;
    }

    // Match Pile: compute extra padding before measuring per-item scroll windows.
    addMissingPadding(layout, animatedItems, parallaxAmount, windowHeight);
    const itemsData = [];
    animatedItems.forEach(item => {
      // Reset transform before measuring positions.
      item.style.transform = '';
      const height = item.offsetHeight;
      const initialTop = height * parallaxAmount / 2;
      const travel = initialTop;

      // Cache the item's absolute top position for scroll-window calculation.
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + window.scrollY;

      // Scroll window: item enters viewport at bottom → leaves at top.
      const scrollStart = itemTop - windowHeight;
      const scrollEnd = itemTop + height;
      itemsData.push({
        el: item,
        travel,
        scrollStart,
        scrollEnd
      });
    });
    blocks.push({
      el,
      items: itemsData
    });
  });
  if (blocks.length) {
    update();
  }
}

/**
 * Update transforms based on current scroll position.
 */
function update() {
  const scrollY = window.scrollY;
  blocks.forEach(block => {
    block.items.forEach(({
      el,
      travel,
      scrollStart,
      scrollEnd
    }) => {
      const scrollRange = scrollEnd - scrollStart;
      if (scrollRange <= 0) {
        return;
      }
      let progress = (scrollY - scrollStart) / scrollRange;
      progress = Math.max(0, Math.min(1, progress));
      const rawOffset = travel - progress * travel * 2;
      const y = rawOffset > 0 ? rawOffset * positiveOffsetFactor : rawOffset;
      el.style.transform = `translateY(${y.toFixed(1)}px)`;
    });
  });
}

/**
 * Scroll handler with requestAnimationFrame throttle.
 */
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }
}

/**
 * Start listening for scroll events.
 */
function bind() {
  if (isBound) {
    return;
  }
  onResizeHandler = () => {
    initialize();
  };
  onPageTransitionCompleteHandler = () => {
    initialize();
    onScroll();
  };
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  window.addEventListener('resize', onResizeHandler);
  window.addEventListener('anima:page-transition-complete', onPageTransitionCompleteHandler);
  isBound = true;
}

/**
 * Clean up — useful for page transitions.
 */
function destroy() {
  window.removeEventListener('scroll', onScroll);
  if (onResizeHandler) {
    window.removeEventListener('resize', onResizeHandler);
  }
  if (onPageTransitionCompleteHandler) {
    window.removeEventListener('anima:page-transition-complete', onPageTransitionCompleteHandler);
  }
  onResizeHandler = null;
  onPageTransitionCompleteHandler = null;
  isBound = false;
  blocks = [];
}
// EXTERNAL MODULE: ./src/js/components/intro-animations/index.js
var intro_animations = __webpack_require__(688);
var intro_animations_default = /*#__PURE__*/__webpack_require__.n(intro_animations);
;// ./src/js/components/app.js











class App {
  constructor() {
    this.initializeHero();
    this.navbar = new Navbar();
    this.searchOverlay = new search_overlay();
    this.siteFrame = new (site_frame_default())();
    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
    this.initializeIntroAnimations();
    this.initializePileParallax();
  }
  initializeImages() {
    const showLoadedImages = this.showLoadedImages.bind(this);
    showLoadedImages();
    globalService.registerObserverCallback(function (mutationList) {
      external_jQuery_default().each(mutationList, (i, mutationRecord) => {
        external_jQuery_default().each(mutationRecord.addedNodes, (j, node) => {
          const nodeName = node.nodeName && node.nodeName.toLowerCase();
          if ('img' === nodeName || node.childNodes.length) {
            showLoadedImages(node);
          }
        });
      });
    });
  }
  initializeReservationForm() {
    globalService.registerObserverCallback(function (mutationList) {
      external_jQuery_default().each(mutationList, (i, mutationRecord) => {
        external_jQuery_default().each(mutationRecord.addedNodes, (j, node) => {
          const $node = external_jQuery_default()(node);
          if ($node.is('#ot-reservation-widget')) {
            $node.closest('.novablocks-opentable').addClass('is-loaded');
          }
        });
      });
    });
  }
  showLoadedImages(container = document.body) {
    const $images = external_jQuery_default()(container).find('img').not('[srcset], .is-loaded, .is-broken');
    $images.imagesLoaded().progress((instance, image) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      external_jQuery_default()(image.img).addClass(className);
    });
  }
  initializeHero() {
    const {
      NEW_HERO_SELECTOR: newHeroesSelector,
      OLD_HERO_SELECTOR: oldHeroesSelector,
      shouldInitializeHero
    } = (hero_init_filter_default());
    const heroesSelector = `${newHeroesSelector}, ${oldHeroesSelector}`;
    const heroElementsArray = Array.from(document.querySelectorAll(heroesSelector)).filter(shouldInitializeHero);
    this.HeroCollection = heroElementsArray.map(element => new Hero(element));
    this.firstHero = heroElementsArray[0];
  }
  initializePileParallax() {
    initialize();
    bind();
  }
  initializeIntroAnimations() {
    intro_animations_default().initialize();
    intro_animations_default().bind();
  }
  initializeCommentsArea() {
    const $commentsArea = external_jQuery_default()('.comments-area');
    if ($commentsArea.length) {
      this.commentsArea = new CommentsArea($commentsArea.get(0));
    }
  }
}
;// ./src/js/components/page-transitions/utils.js



const {
  cleanupTransitionContainer
} = __webpack_require__(236);
const {
  syncDocumentTitle
} = __webpack_require__(628);
const {
  rebindAjaxReadingProgress
} = __webpack_require__(564);


// Tracks script IDs that syncPageAssets() loaded for the first time.
// reinitNovaBlocksScripts() skips these to avoid double-initialization
// (which causes duplicate elements and toggled handlers canceling each other).
let freshlyLoadedScriptIds = new Set();
const INLINE_SYNC_KEY_ATTR = 'data-anima-inline-sync-key';

/**
 * Sync body classes from the new page's HTML response.
 * Uses the same NOTBODY trick as Pile to parse <body> attributes from raw HTML.
 */
function syncBodyClasses(html) {
  const data = html.replace(/(<\/?)body( .+?)?>/gi, '$1NOTBODY$2>');
  const nobodyClass = external_jQuery_default()(data).filter('notbody').attr('class');
  if (nobodyClass) {
    // Preserve classes that our JS manages and that aren't in server HTML.
    const $body = external_jQuery_default()('body');
    const preserveClasses = ['has-page-transitions', 'is-loaded', 'has-loaded', 'admin-bar'];
    const preserved = preserveClasses.filter(cls => $body.hasClass(cls));
    $body.attr('class', nobodyClass);

    // Re-add preserved classes.
    preserved.forEach(cls => $body.addClass(cls));

    // Remove server-side initial loading state — not applicable after AJAX navigation.
    $body.removeClass('is-loading');
  }
}

/**
 * Sync page assets (styles and scripts) from the new page's full HTML.
 *
 * WordPress injects per-page inline CSS and JS based on which blocks/plugins
 * are present. After AJAX swap only the Barba container changes — the rest of
 * the document keeps stale assets. This function:
 *
 * 1. Syncs inline <style> blocks (add new, update changed, remove stale)
 * 2. Syncs <link> stylesheets (add new ones needed by the new page)
 * 3. Syncs <script> tags — loads new external scripts and executes new inline
 *    data scripts (e.g., FacetWP's `window.FWP_JSON`) so plugins reinitialize
 */
function syncPageAssets(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  syncStyles(doc);
  syncScripts(doc);
}

/**
 * Sync inline <style> blocks and <link> stylesheets.
 */
function syncStyles(doc) {
  const newHead = doc.head;
  const styleOrder = getServerStyleOrder(newHead);

  // --- Sync inline <style> blocks (identified by id) ---
  const newStyles = newHead.querySelectorAll('style[id]');
  const newStyleIds = new Set();
  newStyles.forEach(newStyle => {
    newStyleIds.add(newStyle.id);
    const existing = document.getElementById(newStyle.id);
    if (existing && existing.tagName === 'STYLE') {
      if (existing.textContent !== newStyle.textContent) {
        existing.textContent = newStyle.textContent;
      }
    } else {
      insertStyleNodeInServerOrder(newStyle.cloneNode(true), styleOrder);
    }
  });

  // Remove old block-specific inline styles the new page doesn't need.
  document.querySelectorAll('head style[id]').forEach(style => {
    if (!newStyleIds.has(style.id) && isBlockInlineStyle(style.id)) {
      style.remove();
    }
  });

  // --- Sync <link> stylesheets ---
  const newLinks = newHead.querySelectorAll('link[rel="stylesheet"][id]');
  const newLinkIds = new Set();
  newLinks.forEach(newLink => {
    newLinkIds.add(newLink.id);
    if (!document.getElementById(newLink.id)) {
      insertStyleNodeInServerOrder(newLink.cloneNode(true), styleOrder);
    }
  });

  // Remove old block-specific stylesheets the new page doesn't need.
  document.querySelectorAll('head link[rel="stylesheet"][id]').forEach(link => {
    if (!newLinkIds.has(link.id) && isBlockStylesheet(link.id)) {
      link.remove();
    }
  });
}

/**
 * Build a CSS order map from the new server-rendered <head>.
 */
function getServerStyleOrder(newHead) {
  const ids = Array.from(newHead.querySelectorAll('style[id], link[rel="stylesheet"][id]')).map(node => node.id).filter(Boolean);
  return new Map(ids.map((id, index) => [id, index]));
}

/**
 * Insert a new <style>/<link> node in the same relative order as server HTML.
 *
 * This avoids full head reordering (which can trigger visible flicker) while
 * still keeping cascade-sensitive inline styles in a stable position.
 */
function insertStyleNodeInServerOrder(node, styleOrder) {
  const nodeOrder = styleOrder.get(node.id);
  if (typeof nodeOrder === 'undefined') {
    document.head.appendChild(node);
    return;
  }
  const managedNodes = Array.from(document.head.querySelectorAll('style[id], link[rel="stylesheet"][id]')).filter(existing => {
    if (!existing.id) {
      return false;
    }
    if (existing.tagName === 'STYLE') {
      return true;
    }
    return existing.tagName === 'LINK' && existing.rel === 'stylesheet';
  });
  const anchor = managedNodes.find(existing => {
    const existingOrder = styleOrder.get(existing.id);
    return typeof existingOrder !== 'undefined' && existingOrder > nodeOrder;
  });
  if (anchor) {
    document.head.insertBefore(node, anchor);
    return;
  }
  const orderedManaged = managedNodes.filter(existing => {
    return typeof styleOrder.get(existing.id) !== 'undefined';
  });
  if (orderedManaged.length) {
    orderedManaged[orderedManaged.length - 1].insertAdjacentElement('afterend', node);
    return;
  }
  document.head.appendChild(node);
}

/**
 * Sync scripts from the new page's full HTML.
 *
 * External scripts: loads any that exist in the new page but not the current page.
 * Inline scripts: executes data/config scripts from the new page's <body>.
 */
function syncScripts(doc) {
  // Reset the freshly-loaded tracking set for this navigation.
  freshlyLoadedScriptIds = new Set();

  // Build a set of script src URLs already on the current page.
  const currentSrcs = new Set();
  document.querySelectorAll('script[src]').forEach(s => {
    // Normalize: strip cache-bust params we added.
    currentSrcs.add(stripCacheBust(s.src));
  });

  // --- Sync external scripts ---
  // Find all external scripts in the new page that aren't on the current page.
  const newScripts = doc.querySelectorAll('script[src]');
  newScripts.forEach(script => {
    const normalizedSrc = stripCacheBust(script.src);
    if (!currentSrcs.has(normalizedSrc)) {
      const newScript = document.createElement('script');
      newScript.src = script.src;
      newScript.async = false;
      if (script.id) {
        newScript.id = script.id;
        // Track this as freshly loaded so reinitNovaBlocksScripts() skips it.
        freshlyLoadedScriptIds.add(script.id);
      }
      document.body.appendChild(newScript);
    }
  });

  // --- Sync inline data scripts from <body> ---
  // WordPress plugins inject inline scripts in the body (via wp_footer) that
  // set global data objects. These are outside the Barba container.
  const newBodyScripts = doc.body.querySelectorAll('script:not([src])');
  newBodyScripts.forEach(script => {
    const text = script.textContent;
    if (!text.trim()) {
      return;
    }
    const scriptKey = getInlineDataScriptKey(script, text);
    if (!scriptKey) {
      return;
    }
    removePreviouslySyncedInlineScripts(scriptKey);

    // If WordPress provided a stable ID for this inline script, replace
    // the previous node so we don't accumulate duplicate IDs in the DOM.
    if (script.id) {
      const existing = document.getElementById(script.id);
      if (existing && existing.tagName === 'SCRIPT' && !existing.src) {
        existing.remove();
      }
    }
    const newScript = document.createElement('script');
    if (script.id) {
      newScript.id = script.id;
    }
    if (script.type) {
      newScript.type = script.type;
    }
    newScript.setAttribute(INLINE_SYNC_KEY_ATTR, scriptKey);
    newScript.textContent = text;
    document.body.appendChild(newScript);
  });
}

/**
 * Strip cache-bust params we add for reinit.
 */
function stripCacheBust(url) {
  return url.replace(/[?&]_barba=\d+/, '');
}

/**
 * Return a stable key for inline scripts that are safe to re-execute.
 *
 * We only sync script-localized data blocks and explicit FacetWP payloads.
 * This avoids re-executing generic inline JS (or module scripts), which can
 * throw syntax/runtime errors when replayed during AJAX navigation.
 */
function getInlineDataScriptKey(script, text) {
  const type = (script.type || 'text/javascript').toLowerCase();
  const isClassicJs = !type || type === 'text/javascript' || type === 'application/javascript' || type === 'application/ecmascript';
  if (!isClassicJs) {
    return null;
  }

  // WordPress localized data scripts usually use handle-based IDs.
  if (script.id && script.id.endsWith('-js-extra')) {
    return `id:${script.id}`;
  }

  // FacetWP payload is emitted inline without a stable ID in some setups.
  if (/window\.FWP_JSON\s*=/.test(text)) {
    return 'facetwp-json';
  }
  return null;
}
function removePreviouslySyncedInlineScripts(scriptKey) {
  document.querySelectorAll(`script[${INLINE_SYNC_KEY_ATTR}]`).forEach(el => {
    if (el.getAttribute(INLINE_SYNC_KEY_ATTR) === scriptKey) {
      el.remove();
    }
  });
}

/**
 * Check if a <style> id is a per-page block inline style (safe to add/remove).
 */
function isBlockInlineStyle(id) {
  return id.includes('inline-css') && (id.startsWith('wp-block-') || id.startsWith('novablocks') || id === 'core-block-supports-inline-css');
}

/**
 * Check if a <link> id is a per-page block stylesheet (safe to add/remove).
 */
function isBlockStylesheet(id) {
  return id.startsWith('wp-block-') && id.endsWith('-css');
}

/**
 * Header color signal guard.
 *
 * Problem: In FSE templates, the Nova Blocks header color detection queries
 * `.site-main .hentry` to find the first block's palette — but FSE themes
 * don't have those elements. HeaderColors.initializeColors() reads from
 * `colorsElement` (the adjacent content block), NOT the header itself, so
 * pre-applying classes on the header doesn't affect what gets frozen.
 * Then on every sticky threshold crossing, toggleClasses() overwrites the
 * header's classes with the frozen wrong set.
 *
 * Solution: extract the correct color classes from the server-rendered HTML
 * (which WordPress computed correctly via PHP), apply them immediately,
 * and use a MutationObserver to guard them against ALL future overwrites.
 * The observer is set up right after the DOM swap — before any scripts
 * re-execute — so it catches the header script's initialization AND
 * subsequent toggleClasses() calls on scroll. Observer callbacks fire
 * before the browser paints, so there's no visual flicker.
 */
let headerColorObserver = null;

// Regex pattern for color-related classes on the header.
const COLOR_CLASS_PATTERN = /\b(sm-palette-\S+|sm-variation-\S+|sm-color-signal-\S+|sm-light|sm-dark)\b/g;

/**
 * Detect and apply the correct header color signal after AJAX page swap.
 *
 * Replicates the EXACT detection logic from Nova Blocks' Header constructor:
 *   getAdjacentElement() → findProperElement() → findColorsElement()
 *   → getColorSetClasses() → toggleClasses()
 *
 * This is the same code path that runs on a fresh page load. We run it on
 * the live DOM (after Barba has inserted the new container) to get the same
 * result. A MutationObserver then guards the classes in transparent mode
 * while allowing the normal sticky toggle on scroll.
 *
 * @param {string}      html      Full HTML of the new page (unused, kept for API compat).
 * @param {HTMLElement}  container The new Barba container element (scopes DOM queries).
 */
function syncHeaderColorSignal(html, container) {
  // Disconnect any observer from the previous page.
  disconnectHeaderColorObserver();

  // Find the header in the live DOM (scoped to new Barba container).
  const header = container ? container.querySelector('.nb-header--main') : document.querySelector('.nb-header--main');
  if (!header) {
    return;
  }

  // --- Replicate Nova Blocks Header detection on the live DOM ---

  // Step 1: Find the adjacent element (next sibling, skipping scripts/styles).
  const adjacent = getAdjacentElement(header);
  if (!adjacent) {
    return;
  }

  // Step 2: Walk into containers to find the "proper" color source element.
  const properElement = findProperElement(adjacent);
  if (!properElement) {
    return;
  }

  // Step 3: Handle nested sidecar/supernova to find the actual colors element.
  const colorsElement = findColorsElement(properElement);
  if (!colorsElement) {
    return;
  }

  // Step 4: Read color signal classes from the detected element.
  const transparentClasses = utils_getColorSetClasses(colorsElement).filter(cls => cls !== 'sm-color-signal-0');
  if (!transparentClasses.length) {
    return;
  }

  // Step 5: Apply to the header (and row).
  replaceColorClasses(header, transparentClasses);
  const headerRow = header.querySelector('.nb-header-row--primary');
  if (headerRow) {
    replaceColorClasses(headerRow, transparentClasses);
  }

  // Step 6: Guard with sticky-aware observer.
  setupHeaderColorObserver(header, transparentClasses);
}

// ---------------------------------------------------------------------------
// Nova Blocks Header detection logic (replicated from source).
// See: nova-blocks/packages/block-library/src/blocks/header/frontend/components/
// ---------------------------------------------------------------------------

/**
 * Get the element adjacent to the header (its next meaningful sibling).
 * Skips script, style, and menu toggle elements.
 * Climbs up to parent if no sibling exists.
 *
 * Replica of: Header.getAdjacentElement()
 */
function getAdjacentElement(element) {
  const skip = '.c-menu-toggle, .c-menu-toggle__checkbox, script, style';
  const next = element.nextElementSibling;
  if (!next) {
    if (element.parentElement) {
      return getAdjacentElement(element.parentElement);
    }
    return null;
  }
  if (next.matches(skip)) {
    return getAdjacentElement(next);
  }
  return next;
}

/**
 * Walk down the DOM from the adjacent element to find the block that
 * determines the header's transparent-state colors.
 *
 * Traverses into known container blocks (main, wp-block-group, sidecar,
 * wp-block-post-content) when they don't carry their own color signal.
 *
 * Replica of: Header.findProperElement()
 */
function findProperElement(element, previous) {
  if (!element) {
    return previous || null;
  }
  const variation = element.dataset.paletteVariation ? parseInt(element.dataset.paletteVariation, 10) : 1;
  const isShifted = !!element.dataset.useSourceColorAsReference;
  const hasSignal = variation !== 1 || isShifted;

  // Container blocks without their own color signal — recurse into first child.
  if (element.matches('main, .wp-block-group.alignfull, .wp-block-query, .wp-block-post-content')) {
    if (!hasSignal) {
      return findProperElement(element.firstElementChild, element);
    }
  }

  // Sidecar layout — recurse into content area's first child.
  if (element.classList.contains('nb-sidecar')) {
    if (element.children.length === 1 && element.firstElementChild.classList.contains('nb-sidecar-area--content')) {
      const child = element.firstElementChild.firstElementChild;
      if (child) {
        return findProperElement(child, element);
      }
    }
  }

  // Non-fullwidth block with color signal — return the parent container instead.
  if (!element.matches('.alignfull') && hasSignal && previous) {
    return previous;
  }

  // Element with palette class — use it.
  if (element.matches('[class*="sm-palette-"]')) {
    return element;
  }

  // Fall back to closest ancestor with palette.
  return element.closest('[class*="sm-palette-"]') || null;
}

/**
 * Handle nested sidecar and supernova blocks to find the actual element
 * whose color classes should be copied to the header.
 *
 * Replica of: Header.findColorsElement()
 */
function findColorsElement(element) {
  if (!element) {
    return null;
  }

  // Nested sidecar — recurse into content area.
  if (element.classList.contains('nb-sidecar')) {
    const content = Array.from(element.children).find(child => child.classList.contains('nb-sidecar-area--content'));
    if (content && content.firstElementChild && content.firstElementChild.classList.contains('nb-sidecar')) {
      return findColorsElement(content.firstElementChild);
    }
  }

  // Supernova with 0 padding — use the first item.
  if (element.classList.contains('nb-supernova')) {
    const paddingTop = parseInt(window.getComputedStyle(element).paddingTop, 10);
    if (paddingTop === 0) {
      return element.querySelector('.nb-supernova-item') || element;
    }
  }
  return element;
}

/**
 * Extract all color signal classes from an element's class attribute.
 *
 * Replica of: getColorSetClasses() from header/utils.js
 */
function utils_getColorSetClasses(element) {
  const classAttr = element.getAttribute('class');
  if (!classAttr) {
    return [];
  }
  return classAttr.split(/\s+/).filter(cls => {
    return cls.includes('sm-color-signal-') || cls.includes('sm-palette-') || cls.includes('sm-variation-') || cls.includes('sm-dark') || cls.includes('sm-light');
  });
}

/**
 * Replace color classes on an element with the correct set.
 */
function replaceColorClasses(element, correctClasses) {
  const existing = element.className.match(COLOR_CLASS_PATTERN);
  if (existing) {
    existing.forEach(cls => element.classList.remove(cls));
  }
  correctClasses.forEach(cls => element.classList.add(cls));
}

/**
 * Set up a MutationObserver that guards the header's transparent-state
 * color classes.
 *
 * The observer is "sticky-aware":
 * - When the header has `is-sticky` class (scrolled past hero), the observer
 *   does nothing — Nova Blocks manages the sticky-state colors correctly
 *   (the header uses its own palette, which doesn't need detection).
 * - When the header is in transparent mode (overlapping hero, no `is-sticky`),
 *   the observer guards the correct color classes from the adjacent block.
 *
 * MutationObserver callbacks are batched — both `is-sticky` and color class
 * changes are visible by the time the callback runs, so there's no race.
 */
function setupHeaderColorObserver(header, transparentClasses) {
  let applying = false;
  headerColorObserver = new MutationObserver(() => {
    if (applying) {
      return;
    }

    // Don't interfere when the header is in sticky mode.
    // Nova Blocks manages sticky colors correctly (uses header's own palette).
    if (header.classList.contains('is-sticky')) {
      return;
    }

    // In transparent mode: check if the correct (adjacent block) classes
    // are still present. If Nova Blocks overwrote them (failed detection
    // in FSE), re-apply.
    const hasAll = transparentClasses.every(cls => header.classList.contains(cls));
    if (!hasAll) {
      applying = true;
      replaceColorClasses(header, transparentClasses);
      const headerRow = header.querySelector('.nb-header-row--primary');
      if (headerRow) {
        replaceColorClasses(headerRow, transparentClasses);
      }
      applying = false;
    }
  });
  headerColorObserver.observe(header, {
    attributes: true,
    attributeFilter: ['class']
  });
}

/**
 * Disconnect the header color observer.
 * Called at the start of each new navigation and during cleanup.
 */
function disconnectHeaderColorObserver() {
  if (headerColorObserver) {
    headerColorObserver.disconnect();
    headerColorObserver = null;
  }
}

/**
 * Re-initialize Anima's JS components on the new page DOM.
 * Follows Pile's "re-scan and re-bind" pattern.
 *
 * Creates a fresh App instance which initializes Hero, CommentsArea, images, etc.
 * Hero.js handles its own intro timeline and scroll-driven animations —
 * the page transitions system must NOT animate hero elements directly.
 */
function reinitComponents() {
  // Create fresh App instance — this reinits Hero, CommentsArea, images, etc.
  // Fonts are already loaded (wf-active class persists), so Hero init runs immediately.
  new App();
  return new Promise(resolve => {
    // Re-initialize Nova Blocks frontend scripts.
    // In FSE themes the header/footer are inside the Barba container and get swapped,
    // so Nova Blocks' block JS (header sticky, color signal, etc.) must re-run.
    reinitNovaBlocksScripts(() => {
      // Nova Blocks scripts can mutate/rebuild collection card DOM after AJAX swap.
      // Refresh pile parallax bindings after those scripts finish so we target
      // the final nodes and not stale pre-mutation references.
      initialize();
      rebindAjaxReadingProgress();
      window.dispatchEvent(new Event('scroll'));

      // Reinitialize FacetWP if it was previously loaded.
      // FacetWP renders facets client-side — after AJAX page swap, the new DOM
      // has empty .facetwp-facet containers that need FWP to re-parse and render.
      // Only call refresh() if FacetWP already completed its first init (FWP.loaded).
      // On first navigation TO a page with facets, FacetWP's own script handles init.
      if (typeof FWP !== 'undefined' && FWP.loaded && typeof FWP.refresh === 'function') {
        if (typeof FWP_HTTP !== 'undefined') {
          FWP_HTTP.uri = window.location.pathname;
          FWP_HTTP.get = {};
        }
        FWP.refresh();
      }

      // Re-trigger WooCommerce cart fragments if available.
      if (typeof wc_cart_fragments_params !== 'undefined') {
        external_jQuery_default()(document.body).trigger('wc_fragment_refresh');
      }

      // Fire completion events only after the frontend scripts rebuilt the new page.
      external_jQuery_default()(document).trigger('anima:page-transition-complete');
      window.dispatchEvent(new CustomEvent('anima:page-transition-complete'));

      // Dispatch resize + scroll events for layout-dependent JS.
      // Resize: recalculates layout (Hero, GlobalService).
      // Scroll: triggers Hero.update() and bully's rAF loop to process new elements.
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));

      // Delayed fallback pass: some third-party scripts mutate the new container
      // asynchronously right after transition. Trigger one more recalculation.
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('scroll'));
      }, 250);
      resolve();
    });
  });
}

/**
 * Re-execute Nova Blocks frontend scripts after AJAX page swap.
 *
 * Nova Blocks registers per-block `frontend.js` scripts that initialize
 * DOM-dependent behavior (header sticky, color signals, scroll effects, etc.).
 * These run once on DOMContentLoaded. After Barba swaps the container,
 * the new DOM has no JS behavior — we must re-execute the scripts.
 *
 * We dynamically load fresh <script> tags so each script re-queries the DOM
 * and creates new instances for the new elements.
 *
 * After ALL scripts have loaded and executed, dispatches resize + scroll
 * events so scripts like the Doppler parallax effect recalculate their
 * initial positions with correct DOM measurements.
 */
function reinitNovaBlocksScripts(onComplete = () => {}) {
  // Re-execute the bully vendor script first so it creates a fresh IIFE
  // with an empty elements array and a new .c-bully DOM element.
  // The old instance's rAF loop will harmlessly reference the removed DOM.
  reinitBullyScript();
  const scripts = document.querySelectorAll('script[id*="novablocks"][id$="-js"][src*="frontend"]');
  let pending = 0;
  const onAllLoaded = () => {
    // Nova Blocks scripts have now executed their domReady() callbacks
    // and measured the DOM. Force a recalculation so scripts like the
    // Doppler parallax effect get correct initial positions.
    // Use rAF to ensure measurements happen after the browser has
    // applied any style changes from the newly-loaded scripts.
    requestAnimationFrame(() => {
      // Trigger the bully bullet pop animation. The bully plugin normally
      // does this on window.load, which won't fire again after AJAX nav.
      // Bullets default to opacity: 0 and only become visible via --pop.
      external_jQuery_default()('.c-bully .c-bully__bullet').not('.c-bully__bullet--active').each(function (i) {
        const $bullet = external_jQuery_default()(this);
        setTimeout(() => {
          $bullet.addClass('c-bully__bullet--pop');
        }, i * 400);
      });
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));
      onComplete();
    });
  };
  scripts.forEach(script => {
    // Skip scripts that syncPageAssets() just loaded for the first time —
    // they will run their own domReady() callbacks. Re-executing them would
    // cause double-initialization (duplicate share icons, toggled handlers
    // that cancel each other out, etc.).
    if (freshlyLoadedScriptIds.has(script.id)) {
      return;
    }
    pending++;
    const newScript = document.createElement('script');
    // Append a cache-bust param so the browser treats it as a new request
    // (avoids de-duplication of identical src URLs).
    newScript.src = script.src + (script.src.includes('?') ? '&' : '?') + '_barba=' + Date.now();
    newScript.async = false;
    newScript.onload = () => {
      pending--;
      if (pending === 0) {
        onAllLoaded();
      }
    };
    document.body.appendChild(newScript);
  });

  // If no scripts needed re-execution (all were freshly loaded by
  // syncPageAssets, or no Nova Blocks frontend scripts exist), fire
  // onAllLoaded immediately so resize/scroll events still dispatch.
  if (pending === 0) {
    onAllLoaded();
  }
}

/**
 * Re-execute the jquery.bully.js vendor script to create a fresh instance.
 *
 * The bully plugin uses a closure-scoped elements array and rAF loop that
 * persist across page transitions. Since there's no destroy API, we remove
 * the old .c-bully DOM element (done in cleanupBeforeTransition) and
 * re-execute the script so the IIFE runs again with a clean slate.
 *
 * After the new bully instance is ready and position-indicators has run
 * (via the core frontend script), we trigger the bullet pop animation
 * that normally only fires on window.load.
 *
 * The old rAF loop continues but operates on the removed DOM — harmless.
 * The new IIFE creates a fresh .c-bully, empty elements array, and new loop.
 */
function reinitBullyScript() {
  const bullyScript = document.querySelector('script[id*="novablocks-bully"][src]');
  if (!bullyScript) {
    return;
  }
  const newScript = document.createElement('script');
  newScript.src = bullyScript.src + (bullyScript.src.includes('?') ? '&' : '?') + '_barba=' + Date.now();
  newScript.async = false;
  document.body.appendChild(newScript);
}

/**
 * Cleanup heavy resources before page transition.
 */
function cleanupBeforeTransition(container) {
  // Disconnect the header color observer from the current page.
  disconnectHeaderColorObserver();

  // Remove reading bar nodes from the outgoing container before scripts re-run.
  // Nova Blocks queries `.js-reading-*` globally; leaving old nodes in the DOM
  // during AJAX swap can leak a stale progress bar into the next page header.
  cleanupTransitionContainer(container);

  // Remove the bully navigation dots. The jquery.bully.js IIFE keeps
  // closure-scoped state (elements array, rAF loop) that can't be reset
  // externally. Removing the DOM element and re-executing the vendor
  // script in reinitNovaBlocksScripts() creates a fresh instance.
  external_jQuery_default()('.c-bully').remove();
}

/**
 * Push a pageview event for analytics.
 */
function trackPageview() {
  // Google Analytics 4 (gtag).
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_location: window.location.href,
      page_title: document.title
    });
    return;
  }

  // Google Tag Manager dataLayer.
  if (typeof dataLayer !== 'undefined' && Array.isArray(dataLayer)) {
    dataLayer.push({
      event: 'pageview',
      page: {
        path: window.location.pathname,
        title: document.title
      }
    });
    return;
  }

  // Legacy Universal Analytics.
  if (typeof _gaq !== 'undefined') {
    _gaq.push(['_trackPageview']);
  }
}
;// ./src/js/components/page-transitions/admin-bar.js
/**
 * Sync the WordPress admin bar from the new page's raw HTML.
 *
 * Replaces the inner content of #wpadminbar with the version from the AJAX
 * response. After replacement, re-initializes WordPress's admin bar JS so
 * dropdown menus and other interactive features continue to work.
 *
 * @param {string} html - Full HTML response from Barba's AJAX fetch.
 */
function syncAdminBar(html) {
  const currentAdminBar = document.getElementById('wpadminbar');
  if (!currentAdminBar) {
    return;
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const newAdminBar = doc.getElementById('wpadminbar');
  if (!newAdminBar) {
    return;
  }

  // Replace inner HTML to update all admin bar items.
  currentAdminBar.innerHTML = newAdminBar.innerHTML;

  // Copy over any changed attributes (classes, aria attributes, etc.).
  Array.from(newAdminBar.attributes).forEach(attr => {
    currentAdminBar.setAttribute(attr.name, attr.value);
  });

  // Re-initialize WordPress admin bar JS.
  // The admin bar script uses event delegation on document for most interactions,
  // but some hover/click handlers are bound directly to elements.
  // Re-executing the script re-binds those handlers to the new DOM nodes.
  reinitAdminBarScripts();
}

/**
 * Re-initialize WordPress admin bar interactive behavior.
 *
 * WordPress's admin-bar.js is enqueued as `admin-bar` and binds hover/click
 * handlers to admin bar elements. After innerHTML replacement, those handlers
 * are lost. We re-execute the script to re-bind them.
 */
function reinitAdminBarScripts() {
  const adminBarScript = document.getElementById('admin-bar-js');
  if (!adminBarScript || !adminBarScript.src) {
    return;
  }
  const newScript = document.createElement('script');
  newScript.src = adminBarScript.src + (adminBarScript.src.includes('?') ? '&' : '?') + '_barba=' + Date.now();
  newScript.async = false;
  document.body.appendChild(newScript);

  // Clean up after execution.
  newScript.onload = () => {
    newScript.remove();
  };
}
;// ./src/js/components/page-transitions/transitions.js



const {
  getTransitionColorFromTrigger
} = __webpack_require__(547);

/**
 * Wraps a GSAP timeline in a Promise.
 * Resolves when the timeline completes.
 */
function timelinePromise(timeline) {
  return new Promise(resolve => {
    timeline.eventCallback('onComplete', () => {
      resolve(true);
    });
  });
}

/**
 * Create the "border expanding inward" timeline for page leave.
 * Ported from Pile's borderOutTimeline().
 */
function createBorderOutTimeline(trigger = null) {
  const $border = external_jQuery_default()('.js-page-transition-border');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const borderX = windowWidth / 2;
  const borderY = windowHeight / 2;
  const color = getTransitionColorFromTrigger(trigger);
  const timeline = gsap.timeline({
    paused: true
  });
  $border.css({
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    borderWidth: '0 0',
    borderColor: color,
    display: 'block'
  });
  timeline.fromTo($border[0], {
    x: 0,
    y: 0,
    scale: 1
  }, {
    borderTopWidth: borderY,
    borderBottomWidth: borderY,
    borderLeftWidth: borderX,
    borderRightWidth: borderX,
    duration: 0.6,
    ease: 'quart.inOut'
  });
  return timeline;
}

/**
 * Create the "border collapsing outward" timeline for page enter.
 * Ported from Pile's FadeTransition.fadeIn().
 *
 * IMPORTANT: Only animates the border overlay itself.
 * Hero content animations are handled by Hero.js after reinitComponents().
 */
function createBorderInTimeline() {
  const $border = external_jQuery_default()('.js-page-transition-border');
  const timeline = gsap.timeline({
    paused: true,
    onComplete: () => {
      // Clear all GSAP inline styles from the border element so it returns
      // to its CSS-defined state (border: 0 solid transparent).
      gsap.set($border[0], {
        clearProps: 'all'
      });
    }
  });
  timeline.to($border[0], {
    borderWidth: 0,
    duration: 0.6,
    ease: 'quart.inOut'
  });
  return timeline;
}

/**
 * Shared enter logic for both transitions.
 *
 * Syncs WordPress state (assets, body classes, title, admin bar, header color),
 * reinitializes components, and plays the border collapse animation.
 */
function performEnter({
  next
}) {
  // Scroll to top.
  window.scrollTo(0, 0);

  // Reset border background.
  external_jQuery_default()('.js-page-transition-border').css('backgroundColor', 'transparent');

  // Sync WordPress state from new page HTML.
  const html = next.html;
  syncPageAssets(html);
  syncBodyClasses(html);
  syncDocumentTitle(html);

  // Sync admin bar from raw HTML (full #wpadminbar replacement).
  syncAdminBar(html);

  // Save the header's correct color signal classes from the server HTML.
  // The Nova Blocks header script will re-execute and fail to detect colors
  // in FSE templates (it queries `.site-main .hentry` which doesn't exist).
  // Pass the new container to scope DOM queries and avoid finding the old header.
  syncHeaderColorSignal(html, next.container);

  // Defer component reinitialization until after the browser has reflowed the
  // new DOM. Nova Blocks color signal scripts read computed styles (padding,
  // background-color) and Hero.js calls getBoundingClientRect() — both return
  // stale values if called before the browser recalculates layout.
  // Double-rAF ensures styles are applied and one paint cycle has completed.
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reinitComponents().then(() => {
          trackPageview();
          const timeline = createBorderInTimeline();
          timeline.play();
          timelinePromise(timeline).then(resolve);
        });
      });
    });
  });
}

/**
 * The generic Barba.js v2 transition definition.
 * Ported from Pile's FadeTransition (Barba v1).
 * Used for all non-card links (header nav, footer, back button, etc.).
 */
const pageTransition = {
  name: 'page-transition',
  leave({
    current,
    trigger
  }) {
    const timeline = createBorderOutTimeline(trigger);
    timeline.play();

    // Close mobile nav if open.
    external_jQuery_default()('body').removeClass('nav-is-open');
    return timelinePromise(timeline).then(() => {
      // Cleanup heavy resources from the old page.
      cleanupBeforeTransition(current.container);

      // Hide old container.
      external_jQuery_default()(current.container).hide();
    });
  },
  enter({
    next
  }) {
    return performEnter({
      next
    });
  }
};

/**
 * Card-expand transition.
 *
 * When clicking a Nova Blocks collection card (project/post in a grid),
 * the border overlay is positioned exactly over the clicked card, fills it
 * solid in the project's color, then scales to cover the full viewport.
 *
 * Ported from Pile's projectBorderOutTimeline().
 *
 * Uses Barba v2's `custom` function to match only clicks from grid cards.
 * The `trigger` parameter is the clicked <a> element (or 'barba' for popstate).
 */
const cardExpandTransition = {
  name: 'card-expand',
  // Only match clicks from within a multi-column post archive grid card.
  // - .wp-block-query: excludes standalone supernova blocks (hero, media card)
  // - :not(.nb-supernova--1-columns): excludes full-width sliders/carousels
  custom: ({
    trigger
  }) => {
    if (!trigger || trigger === 'barba' || typeof trigger.closest !== 'function') {
      return false;
    }
    const card = trigger.closest('.nb-supernova-item');
    if (!card || !card.closest('.wp-block-query')) {
      return false;
    }
    const supernova = card.closest('.nb-supernova');
    return supernova !== null && !supernova.classList.contains('nb-supernova--1-columns');
  },
  leave({
    current,
    trigger
  }) {
    const card = trigger.closest('.nb-supernova-item');
    // Use the media wrapper for positioning (border is around the image, not full card).
    const mediaWrapper = card.querySelector('.nb-supernova-item__media-wrapper') || card;
    const rect = mediaWrapper.getBoundingClientRect();

    // Read project color (custom property with accent fallback).
    const styles = getComputedStyle(card);
    const projectColor = styles.getPropertyValue('--anima-project-color').trim();
    const accentColor = styles.getPropertyValue('--sm-current-accent-color').trim();
    const color = projectColor || accentColor || '#333';
    const $border = external_jQuery_default()('.js-page-transition-border');
    const borderX = Math.ceil(rect.width / 2);
    const borderY = Math.ceil(rect.height / 2);
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const moveX = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const moveY = window.innerHeight / 2 - (rect.top + rect.height / 2);

    // Position the overlay exactly over the clicked card.
    $border.css({
      display: 'block',
      position: 'fixed',
      top: rect.top - 1,
      left: rect.left - 1,
      right: 'auto',
      bottom: 'auto',
      width: rect.width + 2,
      height: rect.height + 2,
      borderWidth: 0,
      borderColor: color,
      backgroundColor: 'transparent',
      transform: 'none'
    });
    external_jQuery_default()('body').addClass('is-transitioning');
    const timeline = gsap.timeline({
      paused: true
    });

    // Step A (0.4s): Border grows inward until it fills the card solid.
    timeline.to($border[0], {
      borderTopWidth: borderY,
      borderBottomWidth: borderY,
      borderLeftWidth: borderX,
      borderRightWidth: borderX,
      duration: 0.4,
      ease: 'quart.inOut',
      onComplete: () => {
        // Once border fills the card, set backgroundColor to match.
        // This creates a seamless solid fill for the scale step.
        $border.css('backgroundColor', color);
      }
    });

    // Step B (0.5s): Scale + translate from card position to cover full viewport.
    timeline.to($border[0], {
      x: moveX,
      y: moveY,
      scaleX,
      scaleY,
      duration: 0.5,
      ease: 'power3.inOut'
    });
    timeline.play();

    // Close mobile nav if open.
    external_jQuery_default()('body').removeClass('nav-is-open');
    return timelinePromise(timeline).then(() => {
      cleanupBeforeTransition(current.container);
      external_jQuery_default()(current.container).hide();
      external_jQuery_default()('body').removeClass('is-transitioning');
    });
  },
  enter({
    next
  }) {
    return performEnter({
      next
    });
  }
};
;// ./src/js/components/page-transitions/slide-wipe-loader.js


/**
 * Slide Wipe Loader — ported from Fargo theme's loader.js.
 *
 * Uses Snap.svg for SVG pattern fills and GSAP 3 for slide animations.
 * The loader slides in from the left while its inner mask slides from the right,
 * creating a parallax wipe effect. A large SVG letter displays centered with
 * cycling image pattern fills.
 */

const LOADER_DURATION = 1; // seconds
const PATTERN_INTERVAL = 300; // ms between image pattern swaps
const MIN_DISPLAY_TIME = 900; // ms — minimum time the loader stays visible on initial load
const MAX_DISPLAY_TIME = 5000; // ms — safety cap so the loader never gets stuck

let $loader = null;
let $loaderMask = null;
let $svg = null;
let snap = null;
let patterns = [];
let isVisible = false;
let locked = false;
let svgWidth = 0;
let svgHeight = 0;
let animationFrameId = null;

/**
 * Initialize the Slide Wipe loader.
 * Must be called after DOM ready and after Snap is available globally.
 */
function init() {
  $loader = external_jQuery_default()('.js-slide-wipe-loader');
  $loaderMask = $loader.find('.c-loader__mask');
  $svg = $loader.find('svg');
  if (!$loader.length || !$svg.length) {
    return;
  }

  // Snap.svg is loaded globally via CDN.
  if (typeof Snap === 'undefined') {
    return;
  }
  snap = new Snap($svg[0]);

  // The loader is visually covering the page from initial render (CSS).
  // Mark as visible so pattern cycling starts immediately.
  isVisible = true;

  // Remove any existing fill attributes so patterns apply cleanly.
  $svg.find('[fill]').removeAttr('fill');
  fitText();
  getSize();

  // Generate Snap.svg image patterns from random post images.
  const imageSrcs = typeof animaPageTransitions !== 'undefined' && animaPageTransitions.loaderRandomImages ? animaPageTransitions.loaderRandomImages : [];
  if (imageSrcs.length) {
    patterns = generatePatterns(imageSrcs);
  }

  // Start the pattern cycling animation loop.
  startPatternAnimation();
}

/**
 * Initialize only the Slide Wipe overlay (no cycling images).
 * Used when the overlay is Slide Wipe but loading content is Progress Bar.
 */
function initOverlayOnly() {
  $loader = external_jQuery_default()('.js-slide-wipe-loader');
  $loaderMask = $loader.find('.c-loader__mask');
  if (!$loader.length) {
    return;
  }
  isVisible = true;
}

/**
 * Initialize cycling images content inside any container.
 * Used when logo_loading_style is 'cycling_images' but the overlay
 * is not necessarily the Slide Wipe loader (e.g., Border Iris overlay).
 *
 * @param {jQuery} $container - The container element that holds the SVG.
 */
function initCyclingImagesContent($container) {
  if (!$container || !$container.length) {
    return;
  }
  const $svgEl = $container.find('svg');
  if (!$svgEl.length) {
    return;
  }
  if (typeof Snap === 'undefined') {
    return;
  }
  snap = new Snap($svgEl[0]);
  $svg = $svgEl;
  isVisible = true;
  $svgEl.find('[fill]').removeAttr('fill');
  fitText();
  getSize();
  const imageSrcs = typeof animaPageTransitions !== 'undefined' && animaPageTransitions.loaderRandomImages ? animaPageTransitions.loaderRandomImages : [];
  if (imageSrcs.length) {
    patterns = generatePatterns(imageSrcs);
  }
  startPatternAnimation();
}

/**
 * Stop cycling images and mark as not visible.
 */
function stopCyclingImages() {
  isVisible = false;
}

/**
 * Fit the SVG viewBox to the text bounding box.
 * Ported from Fargo's Loader.fitText().
 */
function fitText() {
  const textEl = document.getElementById('letter');
  if (!textEl) {
    return;
  }
  const box = textEl.getBBox();
  $svg.attr({
    width: box.width,
    height: box.height,
    viewBox: '0 0 ' + box.width + ' ' + box.height
  });
}

/**
 * Cache the SVG dimensions.
 */
function getSize() {
  svgWidth = $svg.width();
  svgHeight = $svg.height();
}

/**
 * Generate Snap.svg image patterns from an array of image URLs.
 * Each pattern is scaled to cover the SVG text area.
 * Ported from Fargo's Loader.generatePatterns().
 *
 * @param {string[]} paths - Array of image URLs.
 * @return {Object[]} Array of Snap pattern elements.
 */
function generatePatterns(paths) {
  const result = [];
  paths.forEach(path => {
    const box = getPatternSize(150, 150);
    const img = snap.image(path, (svgWidth - box.width) / 2, (svgHeight - box.height) / 2, box.width, box.height);
    const pattern = img.toPattern();
    pattern.attr({
      width: box.width,
      height: box.height,
      viewBox: '0 0 ' + box.width + ' ' + box.height
    });
    result.push(pattern);
  });
  return result;
}

/**
 * Calculate pattern size that covers the SVG text area.
 * Ported from Fargo's Loader.getPatternSize().
 */
function getPatternSize(width, height) {
  width = width || 150;
  height = height || 150;
  const scale = Math.max(svgWidth / width, svgHeight / height);
  return {
    width: width * scale,
    height: height * scale
  };
}

/**
 * Start the pattern cycling animation.
 * Cycles through image patterns at PATTERN_INTERVAL ms.
 * Ported from Fargo's Loader.animate().
 */
function startPatternAnimation() {
  let index = 0;
  let then = Date.now();
  function animate() {
    if (isVisible && patterns.length) {
      const now = Date.now();
      const elapsed = now - then;
      if (elapsed > PATTERN_INTERVAL) {
        then = now - elapsed % PATTERN_INTERVAL;
        index = (index + 1) % patterns.length;
        if (isVisible && snap) {
          snap.attr('fill', patterns[index]);
        }
      }
    }
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();
}

/**
 * Wait for the page to fully load, then hide the loader.
 * Used on initial page visit so the user sees the cycling image patterns
 * while resources load underneath.
 *
 * - Waits for `window.load` (all images, fonts, etc.)
 * - Enforces MIN_DISPLAY_TIME so even on fast connections the patterns show
 * - Caps at MAX_DISPLAY_TIME so the loader never gets stuck
 *
 * @return {Promise} Resolves when the hide animation completes.
 */
function waitForLoadAndHide() {
  const initTime = Date.now();
  const windowLoaded = new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve, {
        once: true
      });
    }
  });
  const minTimer = new Promise(resolve => {
    setTimeout(resolve, MIN_DISPLAY_TIME);
  });
  const maxTimer = new Promise(resolve => {
    setTimeout(resolve, MAX_DISPLAY_TIME);
  });

  // Hide when: (window loaded AND minimum time elapsed) OR max time reached.
  return Promise.race([Promise.all([windowLoaded, minTimer]), maxTimer]).then(() => {
    return hide();
  });
}

/**
 * Wait for the page to fully load, then call a callback.
 * Like waitForLoadAndHide() but lets the caller control the dismiss animation.
 * Used for Border Iris + Cycling Images combo where the border collapse
 * is different from the slide wipe dismiss.
 *
 * @param {Function} callback - Called when ready to dismiss.
 * @param {number} [customMinTime] - Override minimum display time in ms.
 * @return {Promise}
 */
function waitForLoadThen(callback, customMinTime) {
  const minTime = typeof customMinTime === 'number' ? customMinTime : MIN_DISPLAY_TIME;
  const windowLoaded = new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve, {
        once: true
      });
    }
  });
  const minTimer = new Promise(resolve => {
    setTimeout(resolve, minTime);
  });
  const maxTimer = new Promise(resolve => {
    setTimeout(resolve, MAX_DISPLAY_TIME);
  });
  return Promise.race([Promise.all([windowLoaded, minTimer]), maxTimer]).then(() => {
    if (callback) {
      callback();
    }
  });
}

/**
 * Show the loader — slides in from left.
 * .c-loader slides from x:-100% to x:0%.
 * .c-loader__mask slides from x:100% to x:0% simultaneously.
 * Easing: quint.inOut (1 second).
 *
 * @return {Promise} Resolves when the slide-in animation completes.
 */
function show() {
  if (locked || !$loader || !$loader.length) {
    return Promise.resolve();
  }
  isVisible = true;
  return new Promise(resolve => {
    gsap.fromTo($loader[0], {
      x: '-100%'
    }, {
      x: '0%',
      duration: LOADER_DURATION,
      ease: 'quint.inOut',
      onComplete: resolve
    });
    gsap.fromTo($loaderMask[0], {
      x: '100%'
    }, {
      x: '0%',
      duration: LOADER_DURATION,
      ease: 'quint.inOut'
    });
  });
}

/**
 * Hide the loader — slides out to right.
 * .c-loader slides from x:0% to x:100%.
 * .c-loader__mask slides from x:0% to x:-100% simultaneously.
 * Easing: quint.inOut (1 second).
 *
 * @return {Promise} Resolves when the slide-out animation completes.
 */
function hide() {
  if (locked) {
    window.location.reload(true);
    return Promise.resolve();
  }
  if (!$loader || !$loader.length) {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        isVisible = false;
        resolve();
      }
    });
    timeline.to($loader[0], {
      x: '100%',
      duration: LOADER_DURATION,
      ease: 'quint.inOut'
    });
    timeline.to($loaderMask[0], {
      x: '-100%',
      duration: LOADER_DURATION,
      ease: 'quint.inOut'
    }, 0); // start at same time

    timeline.play();
  });
}

/**
 * Lock the loader — forces a full page reload on next hide().
 * Used when scripts detect an unrecoverable state.
 */
function lock() {
  locked = true;
}

/**
 * Check if the loader is currently visible.
 */
function getIsVisible() {
  return isVisible;
}
;// ./src/js/components/page-transitions/slide-wipe-transitions.js





/**
 * Shared enter logic for Slide Wipe transitions.
 * Syncs WordPress state, reinitializes components, then hides the loader.
 */
function performSlideWipeEnter({
  next
}) {
  window.scrollTo(0, 0);
  const html = next.html;
  syncPageAssets(html);
  syncBodyClasses(html);
  syncDocumentTitle(html);
  syncAdminBar(html);
  syncHeaderColorSignal(html, next.container);
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reinitComponents().then(() => {
          trackPageview();
          hide().then(resolve);
        });
      });
    });
  });
}

/**
 * Generic page transition using Slide Wipe.
 */
const slideWipePageTransition = {
  name: 'slide-wipe-page-transition',
  leave({
    current
  }) {
    external_jQuery_default()('body').removeClass('nav-is-open');
    return show().then(() => {
      cleanupBeforeTransition(current.container);
      external_jQuery_default()(current.container).hide();
    });
  },
  enter({
    next
  }) {
    return performSlideWipeEnter({
      next
    });
  }
};

/**
 * Card-expand transition using Slide Wipe.
 * Same card-click detection as Border Iris, but uses slide wipe instead of border overlay.
 */
const slideWipeCardExpandTransition = {
  name: 'slide-wipe-card-expand',
  custom: ({
    trigger
  }) => {
    if (!trigger || trigger === 'barba' || typeof trigger.closest !== 'function') {
      return false;
    }
    const card = trigger.closest('.nb-supernova-item');
    if (!card || !card.closest('.wp-block-query')) {
      return false;
    }
    const supernova = card.closest('.nb-supernova');
    return supernova !== null && !supernova.classList.contains('nb-supernova--1-columns');
  },
  leave({
    current
  }) {
    external_jQuery_default()('body').removeClass('nav-is-open');
    return show().then(() => {
      cleanupBeforeTransition(current.container);
      external_jQuery_default()(current.container).hide();
    });
  },
  enter({
    next
  }) {
    return performSlideWipeEnter({
      next
    });
  }
};
;// ./src/js/components/page-transitions/loading-animation.js
/* unused harmony import specifier */ var $;


/**
 * Progress Bar loading content animations — the "opening curtain".
 * Ported from Pile's loadingAnimation.js.
 *
 * Animates the logo fill bar and logo visibility inside any overlay.
 * The overlay dismiss (border collapse or slide out) is handled separately.
 */

/**
 * Play the progress bar completion animation.
 * Call this when window.load fires to snap the fill bar to 100% and hide the logo.
 *
 * @return {Promise} Resolves when the content animation is done (~0.6s).
 */
function playProgressBarComplete() {
  return new Promise(resolve => {
    // Logo fill slides in from left.
    gsap.to('.border-logo-fill', {
      x: 0,
      duration: 0.3,
      ease: 'circ.in',
      onComplete: function () {
        external_jQuery_default()('.border-logo').css('opacity', 0);
      }
    });

    // Logo background scales down.
    gsap.to('.border-logo-bgscale', {
      scaleY: 0,
      duration: 0.3,
      delay: 0.3,
      ease: 'quad.inOut',
      onComplete: resolve
    });
  });
}

/**
 * Play the full Border Iris loading animation (content + border collapse).
 * Used when page transition style is Border Iris + logo loading is Progress Bar.
 */
function playBorderIrisLoadingAnimation() {
  const $border = $('.js-page-transition-border');
  if (!$border.length) {
    return;
  }
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Animate the progress bar content.
  playProgressBarComplete();

  // Border collapses from full-screen to zero.
  gsap.fromTo($border[0], {
    borderWidth: windowHeight / 2 + 'px ' + windowWidth / 2 + 'px'
  }, {
    background: 'none',
    borderWidth: 0,
    duration: 0.6,
    delay: 0.5,
    ease: 'quart.inOut'
  });
}
;// ./src/js/components/page-transitions/index.js







// Ignored URL patterns — file extensions, admin, anchors.
const IGNORED_PATTERNS = ['.pdf', '.doc', '.eps', '.png', '.jpg', '.jpeg', '.zip', 'wp-admin', 'wp-login', 'wp-', 'feed', '#', '&add-to-cart=', '?add-to-cart=', '?remove_item'];

/**
 * Initialize page transitions.
 *
 * Two independent settings control behavior:
 * - pageTransitionStyle: 'border_iris' | 'slide_wipe' — how pages swap
 * - logoLoadingStyle: 'progress_bar' | 'cycling_images' — what shows on first visit
 */
function page_transitions_init() {
  const $body = external_jQuery_default()('body');

  // Don't init in Customizer preview.
  if ($body.hasClass('is--customizer-preview')) {
    return;
  }
  const config = typeof animaPageTransitions !== 'undefined' ? animaPageTransitions : {};
  const pageTransitionStyle = config.pageTransitionStyle || 'border_iris';
  const logoLoadingStyle = config.logoLoadingStyle || 'progress_bar';
  const isSlideWipe = pageTransitionStyle === 'slide_wipe';
  const isCyclingImages = logoLoadingStyle === 'cycling_images';

  // Initialize overlay and loading content based on the 2x2 matrix.
  if (isSlideWipe && isCyclingImages) {
    // Slide Wipe + Cycling Images — original Fargo combo.
    init();
  } else if (isSlideWipe && !isCyclingImages) {
    // Slide Wipe overlay + Progress Bar content.
    initOverlayOnly();
  } else if (!isSlideWipe && isCyclingImages) {
    // Border Iris overlay + Cycling Images content.
    const $border = external_jQuery_default()('.js-page-transition-border');
    initCyclingImagesContent($border);
  }
  // Border Iris + Progress Bar needs no special init — CSS keyframes handle it.

  // Merge server-side excluded URLs with client-side patterns.
  const serverExcluded = config.excludedUrls || [];

  // Select the correct page-to-page transition objects.
  const transitions = isSlideWipe ? [slideWipeCardExpandTransition, slideWipePageTransition] : [cardExpandTransition, pageTransition];
  barba_umd_default().init({
    prefetchIgnore: true,
    prevent: ({
      el,
      href
    }) => {
      if (el.target && el.target === '_blank') {
        return true;
      }
      if (el.hasAttribute('data-no-transition')) {
        return true;
      }
      for (const pattern of IGNORED_PATTERNS) {
        if (href.indexOf(pattern) > -1) {
          return true;
        }
      }
      for (const url of serverExcluded) {
        if (href.indexOf(url) > -1) {
          return true;
        }
      }
      return false;
    },
    transitions,
    requestError: (trigger, action, url) => {
      window.location.href = url;
      return false;
    }
  });

  // Signal to the intro-animations choreographer that a transition has
  // started. Its page-transition-gate integration closes the gate here
  // so reveals on the incoming page queue behind the loader instead of
  // playing while the overlay is still dismissing.
  barba_umd_default().hooks.before(() => {
    external_jQuery_default()(document).trigger('anima:page-transition-start');
    window.dispatchEvent(new CustomEvent('anima:page-transition-start'));
  });
  barba_umd_default().hooks.after(() => {
    $body.addClass('is-loaded');
  });

  // Minimum display times for each loading style.
  // Progress Bar: 2.5s — CSS intro takes 0.8s, then fill bar needs ~1.7s to show visible progress.
  // Cycling Images: uses the default MIN_DISPLAY_TIME (0.9s) from slide-wipe-loader.js.
  const PROGRESS_BAR_MIN_TIME = 2500;

  // For Cycling Images and Slide Wipe, mark as loaded immediately — the overlay covers the page.
  // For Progress Bar on Border Iris, defer is-loaded until the dismiss fires,
  // because the CSS rule `.is-loaded .border-logo .logo { opacity: 0 }` would
  // kill the logo prematurely while the fill bar is still progressing.
  const deferIsLoaded = !isSlideWipe && !isCyclingImages;
  if (!deferIsLoaded) {
    $body.addClass('is-loaded');
  }

  // Dispatch initial load animation based on the 2x2 matrix.
  if (isSlideWipe && isCyclingImages) {
    // Slide Wipe + Cycling Images: wait for load, then slide out.
    waitForLoadAndHide();
  } else if (isSlideWipe && !isCyclingImages) {
    // Slide Wipe + Progress Bar: wait for load, complete progress bar, then slide out.
    waitForLoadThen(() => {
      playProgressBarComplete().then(() => {
        hide();
      });
    }, PROGRESS_BAR_MIN_TIME);
  } else if (!isSlideWipe && isCyclingImages) {
    // Border Iris + Cycling Images: wait for load, then collapse border.
    waitForLoadThen(() => {
      stopCyclingImages();
      const $border = external_jQuery_default()('.js-page-transition-border');
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Hide the cycling images content.
      $border.find('.c-loader__logo').css('opacity', 0);

      // Collapse the border overlay.
      gsap.fromTo($border[0], {
        borderWidth: windowHeight / 2 + 'px ' + windowWidth / 2 + 'px'
      }, {
        background: 'none',
        borderWidth: 0,
        duration: 0.6,
        ease: 'quart.inOut'
      });
    });
  } else {
    // Border Iris + Progress Bar: wait for load, then play the opening curtain.
    // Defer is-loaded until after the progress bar content animation completes,
    // because the CSS `.is-loaded .border-logo .logo { opacity: 0 }` would
    // instantly hide the logo before the fill bar finishes.
    waitForLoadThen(() => {
      playProgressBarComplete().then(() => {
        $body.addClass('is-loaded');
        // Now collapse the border.
        const $border = external_jQuery_default()('.js-page-transition-border');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        gsap.fromTo($border[0], {
          borderWidth: windowHeight / 2 + 'px ' + windowWidth / 2 + 'px'
        }, {
          background: 'none',
          borderWidth: 0,
          duration: 0.6,
          ease: 'quart.inOut'
        });
      });
    }, PROGRESS_BAR_MIN_TIME);
  }
}
;// ./src/js/page-transitions.js


external_jQuery_default()(function () {
  page_transitions_init();
});
})();

/******/ })()
;