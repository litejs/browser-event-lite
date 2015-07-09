


/*
 * @version    0.3.1
 * @date       2015-07-01
 * @stability  2 - Unstable
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */



!function(window, document) {
	// The addEventListener is supported in Internet Explorer from version 9.
	// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
	// - IE8 always prevents the default of the mousewheel event.

	var Event = window.Event || (window.Event = {})
	, wheelDiff = 120
	, addEv = "addEventListener"
	, remEv = "removeEventListener"
	, prefix = window[addEv] ? "" : (addEv = "attachEvent", remEv = "detachEvent", "on")
	, fixEv = Event.fixEv = {
		wheel:
			"onwheel" in document      ? "wheel" :      // Modern browsers
			"onmousewheel" in document ? "mousewheel" : // Webkit and IE
			"DOMMouseScroll"                            // older Firefox
	}
	, fixFn = Event.fixFn = {
		wheel: function(el, _fn) {
			return function(e) {
				var delta = (e.wheelDelta || -e.detail || -e.deltaY)/wheelDiff
				if (delta) {
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
			}
		}
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
					events.splice(i - 1, 3)
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
			for (i = type.length, args = type.slice.call(arguments, 1); i--; ) {
				type[i--].apply(type[--i] || emitter, args)
			}
		}
		return emitter
	}

	Event.add = function(el, ev, _fn) {
		var fn = fixFn[ev] && fixFn[ev](el, _fn) || _fn
		, fix = prefix ? function() {
			var e = window.event
			if (e) {
				e.target = e.srcElement
				e.preventDefault = preventDefault
				e.stopPropagation = stopPropagation
			}
			fn.call(el, e)
		} : fn

		el[addEv](prefix + (fixEv[ev] || ev), fix, false)

		on.call(el, ev, fix, el, _fn)
	}

	Event.remove = function(el, ev, fn) {
		var evs = el._e && el._e[ev]
		, id = evs && evs.indexOf(fn)
		if (id) {
			el[remEv](prefix + (fixEv[ev] || ev), evs[id + 1])
			evs.splice(id - 1, 3)
		}
	}

	function preventDefault() {
		this.returnValue = false
	}
	function stopPropagation() {
		this.cancelBubble = this.cancel = true
	}

	Event.stop = function(e) {
		e.stopPropagation()
		e.preventDefault()
		return false
	}

	Event.removeAll = function(el, ev, key) {
		if (el._e) for (key in el._e) {
			if (!ev || key === ev) Event.remove(el, key)
		}
	}

}(this, document)



