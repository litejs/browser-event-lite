


/*
 * @version    0.2.0
 * @date       2015-01-23
 * @stability  2 - Unstable
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */



!function(window, document) {
	// The addEventListener is supported in Internet Explorer from version 9.
	// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
	// - IE8 always prevents the default of the mousewheel event.

	var removed
	, Event = window.Event || (window.Event = {})
	, wheelDiff = 120
	, addEv = "addEventListener"
	, remEv = "removeEventListener"
	, prefix = window[addEv] ? "" : (addEv = "attachEvent", remEv = "detachEvent", "on")
	, translateEvent = {
		wheel:
			"onwheel" in document      ? "wheel" :      // Modern browsers
			"onmousewheel" in document ? "mousewheel" : // Webkit and IE
			"DOMMouseScroll"                            // older Firefox
	}

	Event.Emitter = {
		on: on,
		non: non,
		off: non,
		once: once,
		one: once,
		emit: emit
	}

	function on(type, fn, scope, _origin) {
		var emitter = this
		, events = emitter._e || (emitter._e = {})
		;(events[type] || (events[type] = [])).unshift(scope, _origin, fn)
		return emitter
	}

	function non(type, fn, scope) {
		var i
		, emitter = this
		, events = emitter._e && emitter._e[type]
		if (events) {
			if (fn) for (i = events.length; i--; i--) {
				if ((events[i--] === fn || events[i] === fn) && events[i - 1] == scope) {
					removed = events.splice(i - 1, 3)
					break
				}
			}
			else events.length = 0
		}
		return emitter
	}

	function once(type, fn, scope) {
		var emitter = this
		function remove() {
			emitter.non(type, fn, scope).non(type, remove, scope)
		}
		return emitter.on(type, remove, scope).on(type, fn, scope)
	}

	function emit(type) {
		var args, i
		, emitter = this
		if (type = (emitter._e && emitter._e[type])) {
			type = type.slice()
			for (i = type.length, args = type.slice.call(arguments, 1); i--; i--) {
				type[i--].apply(type[i - 1] || emitter, args)
			}
		}
		return emitter
	}

	Event.add = function(el, ev, _fn) {
		var fn = ev == "wheel" ?
			function(e) {
				if (!e) e = window.event
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
			prefix ? function() {
				_fn.call(el, window.event)
			} : _fn

		on.call(el, ev, fn, el, _fn)

		el[addEv](prefix + (translateEvent[ev] || ev), fn, false)
		return Event
	}

	Event.remove = function(el, ev, fn) {
		// HACK:2015-01-23:lauri:capturing removed this way is ugly but let it be till better idea will come
		removed = null
		non.call(el, ev, fn, el)
		if (removed) {
			el[remEv](prefix + (translateEvent[ev] || ev), removed[2])
		}
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
			if (!ev || key === ev) Event.remove(el, key)
		}
	}

}(this, document)



