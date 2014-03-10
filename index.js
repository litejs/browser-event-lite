


/*
* @version    0.1.4
* @date       2014-03-10
* @stability  2 - Unstable
* @author     Lauri Rooden <lauri@rooden.ee>
* @license    MIT License
*/



!function(root) {
	// The addEventListener is supported in Internet Explorer from version 9.
	// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
	// - IE8 always prevents the default of the mousewheel event.

	var doc = document
	, Event = root.Event || (root.Event={})
	, wheelDiff = 120
	, addEv = "addEventListener"
	, remEv = "removeEventListener"
	, prefix = root[addEv] ? "" : (addEv = "attachEvent", remEv = "detachEvent", "on")
	, WHEEL_EVENT = 
		"onwheel" in doc      ? "wheel" :      // Modern browsers support "wheel"
		"onmousewheel" in doc ? "mousewheel" : // Webkit and IE support at least "mousewheel"
		"DOMMouseScroll"                       // let's assume that remaining browsers are older Firefox

	, Emitter = Event.Emitter = {
		on: function(ev, fn, scope) {
			var t = this
			, e = t._e || (t._e = {})
			;(e[ev] || (e[ev] = [])).push([fn, scope])
			return t
		},
		non: function(ev, fn) {
			var t = this
			if (ev) {
				if (t._e && t._e[ev]) {
					if (fn) for (var a = t._e[ev], l = a.length; l--;) if (a[l][0] == fn) a.splice(l, 1)
					else delete t._e[ev]
				}
			} else delete t._e
			return t
		},
		once: function(ev, fn, scope) {
			var t = this
			return t.on(ev, fn, scope).on(ev, t.non.bind(t, ev, fn))
		},
		emit: function(ev) {
			var t = this
			if (t._e && t._e[ev]) {
				for (var i=0, e=t._e[ev], a=e.slice.call(arguments, 1); ev=e[i++];) ev[0].apply(ev[1]||t, a)
			}
			return t
		}
	}

	// Alias
	Emitter.off = Emitter.non


	Event.add = function(el, ev, _fn) {
		var fn = ev == "wheel" ? 
			function(e) {
				if (!e) e = root.event
				var delta = (e.wheelDelta || -e.detail || -e.deltaY)/wheelDiff
				if (delta != 0) {
					if (delta < 1 && delta > -1) {
						var diff = (delta < 0 ? -1 : 1)/delta
						delta *= diff
						wheelDiff /= diff
					}
					//TODO: fix event
					// e.deltaY = 
					// e.deltaX = - 1/40 * e.wheelDeltaX|0
					// e.target = e.target || e.srcElement
					_fn.call(el, e, delta)
				}
			} : 
			prefix ? function(){
				_fn.call(el, root.event)
			} : _fn

		if (fn != _fn) fn.origin = _fn
		Emitter.on.call(el, ev, fn, el)


		el[addEv](prefix + (ev == "wheel" ? WHEEL_EVENT : ev), fn, false)
		return Event
	}

	Event.remove = function(el, ev, fn) {
		if (fn && el._e && el._e[ev]) {
			for (var _fn, arr = el._e[ev], i = 0; _fn=arr[i];i++) { 
				_fn = _fn[0]
				if (_fn == fn || _fn.origin == fn) {
					arr.splice(i, 1)
					fn = _fn
				}
			}
		}
		el[remEv](prefix + (ev == "wheel" ? WHEEL_EVENT : ev), fn, false)
		return Event
	}

	Event.stop = function(e) {
		e.stopPropagation && e.stopPropagation()
		e.preventDefault && e.preventDefault()
		e.cancelBubble = e.cancel = true
		return e.returnValue = false
	}

	Event.removeAll = function(el, ev, key, arr, i) {
		if (el._e) for (key in el._e) {
			if (!ev || key == ev) for (arr = el._e[key], i = arr.length; i--;) {
				Event.remove(el, key, arr[0])
			}
		}
	}

}(this)



