


/*
* @version  0.0.2
* @author   Lauri Rooden - https://github.com/litejs/browser-event-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/




!function(win, doc) {

	var Event = win.Event || (win.Event={})
	, fn_id = 0
	, rendering  = false
	, wheelDiff = 120

	function cacheEvent(el, type, fn, fix_fn) {
		var _e = el._e || (el._e={})
		_e[type] || (_e[type]={})
		/*
		* JavaScript converts fn to a string via .toString(),
		* use unique id instead of fn source as a key.
		*/
		return (_e[type][ fn._fn_id || (fn._fn_id = ++fn_id) ] = type == "mousewheel" ? function(e) {
				if (!e) e = win.event
				var delta = e.wheelDelta ? e.wheelDelta/wheelDiff : -e.detail/wheelDiff
				if (delta != 0) {
					if (delta < 1 && delta > -1) {
						var diff = (delta < 0 ? -1 : 1)/delta
						delta *= diff
						wheelDiff /= diff
					}
					fn.call(el, e, delta)
				}
			} 
			: fix_fn
		)
	}

	function uncacheEvent(el, type, fn) {
		var _e = el._e||{}
		if (_e[type] && fn._fn_id && _e[type][fn._fn_id]) {
			var _fn = _e[type][fn._fn_id]
			delete _e[type][fn._fn_id]
			return _fn
		};
		return fn
	}

	// The addEventListener is supported in Internet Explorer from version 9.
	if (win.addEventListener) {
		Event.add = function(el, ev, fn) {
			var _fn = cacheEvent(el, ev, fn, fn)
			ev == "mousewheel" && el.addEventListener("DOMMouseScroll", _fn, false)
			el.addEventListener(ev, _fn, false)
			return Event
		}
		Event.remove = function(el, ev, fn) {
			var _fn = uncacheEvent(el, ev, fn)
			ev == "mousewheel" && el.removeEventListener("DOMMouseScroll", _fn, false)
			el.removeEventListener(ev, _fn, false)
			return Event
		}
	} else {
		Event.add = function(el, ev, fn) {
			// In IE the event handling function is referenced, not copied, so 
			// the this keyword always refers to the window and is completely useless.
			el.attachEvent("on"+ev, cacheEvent(el, ev, fn, function(){fn.call(el,win.event)}) )
			return Event
		}
		Event.remove = function(el, ev, fn) {
			el.detachEvent("on"+ev, uncacheEvent(el, ev, fn) )
			return Event
		}
	}
	Event.stop = function(e) {
		e.stopPropagation && e.stopPropagation()
		e.preventDefault && e.preventDefault()
		e.cancelBubble = e.cancel = true
		return e.returnValue = false
	}

	Event.removeAll = function(el, ev) {
		var _e = el._e||{}
		for (var t in _e)
		/** hasOwnProperty
		if (_e.hasOwnProperty(t))
		//*/
		if (!ev || ev == t) {
			var fnList = _e[t]
			for (var fn in fnList)
			/** hasOwnProperty
			if (fnList.hasOwnProperty(fn))
			//*/

			Event.remove(el, t, fnList[fn])
			delete _e[t]
		}
	}


	// http://www.softcomplex.com/docs/get_window_size_and_scrollbar_position.html

	Event.pointerX = function(e) {
		if (e.changedTouches) e = e.changedTouches[0]
		return e.pageX || e.clientX + doc.body.scrollLeft || 0
	}
	Event.pointerY = function(e) {
		if (e.changedTouches) e = e.changedTouches[0]
		return e.pageY || e.clientY + doc.body.scrollTop || 0
	}
	Event.pointer = function(e) {
		var x = Event.pointerX(e), y = Event.pointerY(e)
		return { x: x, y: y, left: x, top: y }
	}

	//*/



}(this, document)



