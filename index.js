


/*
* @version  0.0.2
* @author   Lauri Rooden - https://github.com/litejs/browser-event-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/




!function(root) {
	// The addEventListener is supported in Internet Explorer from version 9.
	// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel

	var Event = root.Event || (root.Event={})
	, wheelDiff = 120
	, prefix = ""
	, addEv = "addEventListener"
	, remEv = "removeEventListener"
	, WHEEL = "mousewheel"

	if (!root[addEv]) {
		prefix = "on"
		addEv  = "attachEvent"
		remEv  = "detachEvent"
	}

	//** Fn.Events
	Event.Emitter = {
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
	//*/
	

	function fixOn(el, type, fn) {
		var fix = type == WHEEL ? 
			function(e) {
				if (!e) e = root.event
				var delta = e.wheelDelta ? e.wheelDelta/wheelDiff : -e.detail/wheelDiff
				if (delta != 0) {
					if (delta < 1 && delta > -1) {
						var diff = (delta < 0 ? -1 : 1)/delta
						delta *= diff
						wheelDiff /= diff
					}
					fn.call(el, e, delta)
				}
			} : 
			prefix ? fn.bind(el, root.event) : fn

		if (fix != fn) fix.origin = fn
		Event.Emitter.on.call(el, type, fix, el)
		return fix
	}

	function fixOff(el, type, fn) {
		if (fn && el._e && el._e[type]) {
			for (var _fn, arr = el._e[type], i = 0; _fn=arr[i];i++) { 
				_fn = _fn[0]
				if (_fn == fn || _fn.origin == fn) {
					arr.splice(i, 1)
					return _fn
				}
			}
		}
	}

	
	function raw(add, fix, el, ev, fn) {
		fn = fix(el, ev, fn)
		el[add](prefix + ev, fn, false)
		if (ev == WHEEL && !prefix) {
			el[add]("DOMMouseScroll", fn, false)
		}
		return Event
	}

	Event.add    = raw.bind(null, addEv, fixOn)
	Event.remove = raw.bind(null, remEv, fixOff)

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



