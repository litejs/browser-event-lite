!function(g,p){function q(a,b,c,d){var f=this._e||(this._e={});(f[a]||(f[a]=[])).unshift(c,d,b);return this}function k(a,b,c){var d;if(a=a&&this._e&&this._e[a])if(b)for(d=a.length;d--;d--){if((a[d--]===b||a[d]===b)&&a[d-1]==c){h=a.splice(d-1,3);break}}else a.length=0;return this}var h,e=g.Event||(g.Event={}),l=120,m="addEventListener",r="removeEventListener",n=g[m]?"":(m="attachEvent",r="detachEvent","on"),t="onwheel"in p?"wheel":"onmousewheel"in p?"mousewheel":"DOMMouseScroll";e.Emitter={on:q,non:k,
off:k,once:function(a,b,c){function d(){f.non(a,b,c).non(a,d,c)}var f=this;return f.on(a,b,c).on(a,d,c)},emit:function(a){var b,c;if(a=this._e&&this._e[a])for(a=a.slice(),c=a.length,b=a.slice.call(arguments,1);c--;c--)a[c--].apply(a[c-1]||this,b);return this}};e.add=function(a,b,c){var d="wheel"==b?function(b){b||(b=g.event);var d=(b.wheelDelta||-b.detail||-b.deltaY)/l;if(0!=d){if(1>d&&-1<d){var e=(0>d?-1:1)/d,d=d*e;l/=e}c.call(a,b,d)}}:n?function(){c.call(a,g.event)}:c;q.call(a,b,d,a,c);a[m](n+("wheel"==
b?t:b),d,!1);return e};e.remove=function(a,b,c){h=null;k.call(a,b,c,a);if(h)a[r](n+("wheel"==b?t:b),h[2]);return e};e.stop=function(a){a.stopPropagation&&a.stopPropagation();a.preventDefault&&a.preventDefault();a.cancelBubble=a.cancel=!0;return a.returnValue=!1};e.removeAll=function(a,b,c,d,f){if(a._e)for(c in a._e)b&&c!==b||e.remove(a,c)}}(this,document);