!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=61)}([function(t,e,n){var r=n(24)("wks"),i=n(25),o=n(3).Symbol,u="function"==typeof o;(t.exports=function(t){return r[t]||(r[t]=u&&o[t]||(u?o:i)("Symbol."+t))}).store=r},function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,n){"use strict";e.__esModule=!0;var r,i=n(55),o=(r=i)&&r.__esModule?r:{default:r};e.default=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}()},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=t.exports={version:"2.6.9"};"number"==typeof __e&&(__e=n)},function(t,e,n){var r=n(8),i=n(35),o=n(36),u=Object.defineProperty;e.f=n(6)?Object.defineProperty:function(t,e,n){if(r(t),e=o(e,!0),r(n),i)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){t.exports=!n(19)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(5),i=n(14);t.exports=n(6)?function(t,e,n){return r.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(13);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e){t.exports=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var r=n(3),i=n(4),o=n(18),u=n(7),s=n(9),a=function(t,e,n){var c,f,l,p=t&a.F,h=t&a.G,d=t&a.S,y=t&a.P,v=t&a.B,m=t&a.W,g=h?i:i[e]||(i[e]={}),b=g.prototype,x=h?r:d?r[e]:(r[e]||{}).prototype;for(c in h&&(n=e),n)(f=!p&&x&&void 0!==x[c])&&s(g,c)||(l=f?x[c]:n[c],g[c]=h&&"function"!=typeof x[c]?n[c]:v&&f?o(l,r):m&&x[c]==l?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(l):y&&"function"==typeof l?o(Function.call,l):l,y&&((g.virtual||(g.virtual={}))[c]=l,t&a.R&&b&&!b[c]&&u(b,c,l)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){t.exports={}},function(t,e,n){var r=n(24)("keys"),i=n(25);t.exports=function(t){return r[t]||(r[t]=i(t))}},function(t,e){t.exports=!0},function(t,e,n){var r=n(34);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,i){return t.call(e,n,r,i)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var r=n(13),i=n(3).document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},function(t,e,n){var r=n(43),i=n(11);t.exports=function(t){return r(i(t))}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var r=n(10),i=Math.min;t.exports=function(t){return t>0?i(r(t),9007199254740991):0}},function(t,e,n){var r=n(4),i=n(3),o=i["__core-js_shared__"]||(i["__core-js_shared__"]={});(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:r.version,mode:n(17)?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var r=n(5).f,i=n(9),o=n(0)("toStringTag");t.exports=function(t,e,n){t&&!i(t=n?t:t.prototype,o)&&r(t,o,{configurable:!0,value:e})}},function(t,e,n){var r=n(11);t.exports=function(t){return Object(r(t))}},function(t,e,n){t.exports={default:n(30),__esModule:!0}},function(t,e,n){n(31),n(48),t.exports=n(4).Array.from},function(t,e,n){"use strict";var r=n(32)(!0);n(33)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},function(t,e,n){var r=n(10),i=n(11);t.exports=function(t){return function(e,n){var o,u,s=String(i(e)),a=r(n),c=s.length;return a<0||a>=c?t?"":void 0:(o=s.charCodeAt(a))<55296||o>56319||a+1===c||(u=s.charCodeAt(a+1))<56320||u>57343?t?s.charAt(a):o:t?s.slice(a,a+2):u-56320+(o-55296<<10)+65536}}},function(t,e,n){"use strict";var r=n(17),i=n(12),o=n(37),u=n(7),s=n(15),a=n(38),c=n(27),f=n(47),l=n(0)("iterator"),p=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,e,n,d,y,v,m){a(n,e,d);var g,b,x,w=function(t){if(!p&&t in T)return T[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},O=e+" Iterator",_="values"==y,k=!1,T=t.prototype,j=T[l]||T["@@iterator"]||y&&T[y],S=j||w(y),P=y?_?w("entries"):S:void 0,E="Array"==e&&T.entries||j;if(E&&(x=f(E.call(new t)))!==Object.prototype&&x.next&&(c(x,O,!0),r||"function"==typeof x[l]||u(x,l,h)),_&&j&&"values"!==j.name&&(k=!0,S=function(){return j.call(this)}),r&&!m||!p&&!k&&T[l]||u(T,l,S),s[e]=S,s[O]=h,y)if(g={values:_?S:w("values"),keys:v?S:w("keys"),entries:P},m)for(b in g)b in T||o(T,b,g[b]);else i(i.P+i.F*(p||k),e,g);return g}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){t.exports=!n(6)&&!n(19)(function(){return 7!=Object.defineProperty(n(20)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(13);t.exports=function(t,e){if(!r(t))return t;var n,i;if(e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t)))return i;if("function"==typeof(n=t.valueOf)&&!r(i=n.call(t)))return i;if(!e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){t.exports=n(7)},function(t,e,n){"use strict";var r=n(39),i=n(14),o=n(27),u={};n(7)(u,n(0)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:i(1,n)}),o(t,e+" Iterator")}},function(t,e,n){var r=n(8),i=n(40),o=n(26),u=n(16)("IE_PROTO"),s=function(){},a=function(){var t,e=n(20)("iframe"),r=o.length;for(e.style.display="none",n(46).appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;r--;)delete a.prototype[o[r]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(s.prototype=r(t),n=new s,s.prototype=null,n[u]=t):n=a(),void 0===e?n:i(n,e)}},function(t,e,n){var r=n(5),i=n(8),o=n(41);t.exports=n(6)?Object.defineProperties:function(t,e){i(t);for(var n,u=o(e),s=u.length,a=0;s>a;)r.f(t,n=u[a++],e[n]);return t}},function(t,e,n){var r=n(42),i=n(26);t.exports=Object.keys||function(t){return r(t,i)}},function(t,e,n){var r=n(9),i=n(21),o=n(44)(!1),u=n(16)("IE_PROTO");t.exports=function(t,e){var n,s=i(t),a=0,c=[];for(n in s)n!=u&&r(s,n)&&c.push(n);for(;e.length>a;)r(s,n=e[a++])&&(~o(c,n)||c.push(n));return c}},function(t,e,n){var r=n(22);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,e,n){var r=n(21),i=n(23),o=n(45);t.exports=function(t){return function(e,n,u){var s,a=r(e),c=i(a.length),f=o(u,c);if(t&&n!=n){for(;c>f;)if((s=a[f++])!=s)return!0}else for(;c>f;f++)if((t||f in a)&&a[f]===n)return t||f||0;return!t&&-1}}},function(t,e,n){var r=n(10),i=Math.max,o=Math.min;t.exports=function(t,e){return(t=r(t))<0?i(t+e,0):o(t,e)}},function(t,e,n){var r=n(3).document;t.exports=r&&r.documentElement},function(t,e,n){var r=n(9),i=n(28),o=n(16)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=i(t),r(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,e,n){"use strict";var r=n(18),i=n(12),o=n(28),u=n(49),s=n(50),a=n(23),c=n(51),f=n(52);i(i.S+i.F*!n(54)(function(t){Array.from(t)}),"Array",{from:function(t){var e,n,i,l,p=o(t),h="function"==typeof this?this:Array,d=arguments.length,y=d>1?arguments[1]:void 0,v=void 0!==y,m=0,g=f(p);if(v&&(y=r(y,d>2?arguments[2]:void 0,2)),null==g||h==Array&&s(g))for(n=new h(e=a(p.length));e>m;m++)c(n,m,v?y(p[m],m):p[m]);else for(l=g.call(p),n=new h;!(i=l.next()).done;m++)c(n,m,v?u(l,y,[i.value,m],!0):i.value);return n.length=m,n}})},function(t,e,n){var r=n(8);t.exports=function(t,e,n,i){try{return i?e(r(n)[0],n[1]):e(n)}catch(e){var o=t.return;throw void 0!==o&&r(o.call(t)),e}}},function(t,e,n){var r=n(15),i=n(0)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||o[i]===t)}},function(t,e,n){"use strict";var r=n(5),i=n(14);t.exports=function(t,e,n){e in t?r.f(t,e,i(0,n)):t[e]=n}},function(t,e,n){var r=n(53),i=n(0)("iterator"),o=n(15);t.exports=n(4).getIteratorMethod=function(t){if(null!=t)return t[i]||t["@@iterator"]||o[r(t)]}},function(t,e,n){var r=n(22),i=n(0)("toStringTag"),o="Arguments"==r(function(){return arguments}());t.exports=function(t){var e,n,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),i))?n:o?r(e):"Object"==(u=r(e))&&"function"==typeof e.callee?"Arguments":u}},function(t,e,n){var r=n(0)("iterator"),i=!1;try{var o=[7][r]();o.return=function(){i=!0},Array.from(o,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!i)return!1;var n=!1;try{var o=[7],u=o[r]();u.next=function(){return{done:n=!0}},o[r]=function(){return u},t(o)}catch(t){}return n}},function(t,e,n){t.exports={default:n(56),__esModule:!0}},function(t,e,n){n(57);var r=n(4).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},function(t,e,n){var r=n(12);r(r.S+r.F*!n(6),"Object",{defineProperty:n(5).f})},,,,function(t,e,n){"use strict";n.r(e);var r,i=n(29),o=n.n(i),u=n(1),s=n.n(u),a=n(2),c=n.n(a),f=new(function(){function t(){s()(this,t),this.props={},this.renderCallbacks=[],this.updateCallbacks=[],this.frameRendered=!0;var e=this.updateProps.bind(this),n=this.updateScroll.bind(this);e(),document.addEventListener("DOMContentLoaded",e),window.addEventListener("resize",e),window.addEventListener("scroll",n),window.requestAnimationFrame(this.renderLoop.bind(this))}return c()(t,[{key:"renderLoop",value:function(){this.frameRendered||(this.renderStuff(),this.frameRendered=!0),window.requestAnimationFrame(this.renderLoop.bind(this))}},{key:"registerRender",value:function(t){"function"==typeof t&&this.renderCallbacks.indexOf(t)<0&&this.renderCallbacks.push(t)}},{key:"renderStuff",value:function(){this.renderCallbacks.forEach(function(t){t()})}},{key:"registerUpdate",value:function(t){"function"==typeof t&&this.updateCallbacks.indexOf(t)<0&&this.updateCallbacks.push(t)}},{key:"updateStuff",value:function(){this.updateCallbacks.forEach(function(t){t()})}},{key:"updateScroll",value:function(){this.props.scrollY=window.scrollY,this.props.scrollX=window.scrollX,this.frameRendered=!1}},{key:"updateProps",value:function(){this.updateStuff(),this.props.windowWidth=window.innerWidth,this.props.windowHeight=window.innerHeight,this.updateScroll()}},{key:"getProps",value:function(){return this.props}},{key:"getProp",value:function(t){return this.props[t]}}]),t}()),l=function(){function t(e){s()(this,t),this.element=e,this.progress=0,this.timeline=new TimelineMax({paused:!0}),this.pieces=this.getMarkupPieces(),this.paused=!1,this.update(),this.updateOnScroll(),this.init()}return c()(t,[{key:"init",value:function(){var t=this;f.registerUpdate(function(){t.update()}),f.registerRender(function(){t.updateOnScroll(),t.updateTimelineOnScroll()}),this.addIntroToTimeline(),this.timeline.addLabel("middle"),this.addOutroToTimeline(),this.timeline.addLabel("end"),this.pauseTimelineOnScroll(),this.timeline.play()}},{key:"update",value:function(){var t=f.getProps(),e=t.scrollY,n=t.windowHeight;this.box=this.element.getBoundingClientRect(),this.view={x:this.box.x,y:this.box.y+e,width:this.box.width,height:this.box.height};var r=e+this.box.top+.5*(this.box.height-n),i=.5*n;this.start=r-.5*i,this.end=this.start+i}},{key:"getMarkupPieces",value:function(){var t=jQuery(this.element).find(".novablocks-hero__inner-container"),e=t.children().first().filter(".c-headline"),n=e.find(".c-headline__primary"),r=e.find(".c-headline__secondary"),i=e.next(".c-separator"),o=i.find(".c-separator__flower"),u=i.find(".c-separator__line"),s=i.find(".c-separator__arrow");return{headline:e,title:n,subtitle:r,separator:i,sepFlower:o,sepLine:u,sepArrow:s,others:t.children().not(e).not(i)}}},{key:"addIntroToTimeline",value:function(){var t=this.timeline,e=this.pieces,n=e.headline,r=e.title,i=e.subtitle,o=e.separator,u=e.sepFlower,s=e.sepLine,a=e.sepArrow,c=e.others;r.length&&r.text().trim().length&&(t.fromTo(r,.72,{"letter-spacing":"1em","margin-right":"-0.9em"},{"letter-spacing":"0.2em","margin-right":"-0.1em",ease:Expo.easeOut},0),t.fromTo(r,.89,{opacity:0},{opacity:1,ease:Expo.easeOut},0),t.fromTo(n,1,{y:30},{y:0,ease:Expo.easeOut},0)),i.length&&(t.fromTo(i,.65,{opacity:0},{opacity:1,ease:Quint.easeOut},"-=0.65"),t.fromTo(i,.9,{y:30},{y:0,ease:Quint.easeOut},"-=0.65")),u.length&&(t.fromTo(u,.15,{opacity:0},{opacity:1,ease:Quint.easeOut},"-=0.6"),t.fromTo(u,.55,{rotation:-270},{rotation:0,ease:Back.easeOut},"-=0.5")),s.length&&(t.fromTo(s,.6,{width:0},{width:"42%",opacity:1,ease:Quint.easeOut},"-=0.55"),t.fromTo(o,.6,{width:0},{width:"100%",opacity:1,ease:Quint.easeOut},"-=0.6")),a.length&&t.fromTo(a,.2,{opacity:0},{opacity:1,ease:Quint.easeOut},"-=0.27"),c.length&&(t.fromTo(c,.5,{opacity:0},{opacity:1,ease:Quint.easeOut},"-=0.28"),t.fromTo(c,.75,{y:-20},{y:0},"-=0.5")),this.timeline=t}},{key:"addOutroToTimeline",value:function(){var t=this.pieces,e=t.title,n=t.subtitle,r=t.others,i=t.separator,o=t.sepLine,u=t.sepFlower,s=t.sepArrow,a=this.timeline;a.fromTo(e,1.08,{y:0},{opacity:0,y:-60,ease:Quad.easeIn},"middle"),a.to(n,1.08,{opacity:0,y:-90,ease:Quad.easeIn},"middle"),a.to(r,1.08,{y:60,opacity:0,ease:Quad.easeIn},"middle"),a.to(o,.86,{width:"0%",opacity:0,ease:Quad.easeIn},"-=0.94"),a.to(i,.86,{width:"0%",opacity:0,ease:Quad.easeIn},"-=0.86"),a.to(u,1,{rotation:180},"-=1.08"),a.to(u,.11,{opacity:0},"-=0.03"),a.to(s,.14,{opacity:0},"-=1.08"),this.timeline=a}},{key:"pauseTimelineOnScroll",value:function(){var t=this,e=this.timeline.getLabelTime("middle"),n=this.timeline.getLabelTime("end");this.timeline.eventCallback("onUpdate",function(r){var i=r.time(),o=i>e,u=.5*((i-e)/(n-e))+.5>=t.progress;o&&u&&(r.pause(),t.timeline.eventCallback("onUpdate",null),t.paused=!0)},["{self}"])}},{key:"updateOnScroll",value:function(){var t=f.getProps().scrollY;this.progress=(t-this.start)/(this.end-this.start)}},{key:"updateTimelineOnScroll",value:function(){if(this.paused){var t=this.timeline.progress(),e=this.timeline.getLabelTime("middle")/this.timeline.getLabelTime("end"),n=2*(this.progress-.5)*(1-e)+e;t!==(n=Math.min(Math.max(e,n),1))&&this.timeline.progress(n)}}}]),t}(),p=n(63),h=n.n(p),d={offsetTargetElement:null},y=function(){function t(e,n){s()(this,t),this.element=e,this.inversed=!jQuery(this.element).hasClass("site-header--normal"),this.scrollOffset=0,this.options=h()({},d,n),this.update(),this.init()}return c()(t,[{key:"init",value:function(){f.registerUpdate(this.update.bind(this))}},{key:"update",value:function(){var t=f.getProps().scrollY,e=document.getElementById("page"),n=this.options.offsetTargetElement;if(this.box=this.element.getBoundingClientRect(),n){var r=n.getBoundingClientRect();this.scrollOffset=r.top+r.height+t-this.box.height/2}e.style.paddingTop=this.box.height+"px",jQuery(this.element).addClass("site-header--fixed site-header--ready")}},{key:"render",value:function(t){var e=f.getProps().scrollY;t!==this.inversed&&(jQuery(this.element).toggleClass("site-header--normal",!t),this.inversed=t),jQuery(this.element).toggleClass("site-header--scrolled",e>this.scrollOffset)}}]),t}();r=jQuery,window,r(function(){var t=document.getElementsByClassName("novablocks-hero"),e=o()(t),n=e.map(function(t){return new l(t)}),i=e[0],u=r(".site-header").get(0),s=new y(u,{offsetTargetElement:i||null});f.registerRender(function(){var t=n.some(function(t){var e,n,r,i,o=f.getProps().scrollY;return e={x:s.box.x,y:s.box.y+o,width:s.box.width,height:s.box.height},n=t.view,r=e.x+e.width/2>=n.x&&n.x+n.width>=e.x+e.width/2,i=e.y+e.height/2>=n.y&&n.y+n.height>=e.y+e.height/2,r&&i});s.render(t)})})},,function(t,e,n){t.exports={default:n(64),__esModule:!0}},function(t,e,n){n(65),t.exports=n(4).Object.assign},function(t,e,n){var r=n(12);r(r.S+r.F,"Object",{assign:n(66)})},function(t,e,n){"use strict";var r=n(6),i=n(41),o=n(67),u=n(68),s=n(28),a=n(43),c=Object.assign;t.exports=!c||n(19)(function(){var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach(function(t){e[t]=t}),7!=c({},t)[n]||Object.keys(c({},e)).join("")!=r})?function(t,e){for(var n=s(t),c=arguments.length,f=1,l=o.f,p=u.f;c>f;)for(var h,d=a(arguments[f++]),y=l?i(d).concat(l(d)):i(d),v=y.length,m=0;v>m;)h=y[m++],r&&!p.call(d,h)||(n[h]=d[h]);return n}:c},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e){e.f={}.propertyIsEnumerable}]);