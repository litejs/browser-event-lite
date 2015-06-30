
!function(Event, document) {
	function touchHandler(e) {
		Event.stop(e)
		var touch = e.changedTouches[0]
		, ev = document.createEvent("MouseEvent")
		ev.initMouseEvent(
			e.type.replace("touch", "mouse").replace("start", "down").replace("end", "up"),
			true, true, window, 1,
			touch.screenX, touch.screenY, touch.clientX, touch.clientY,
			false, false, false, false, 0, null)
		touch.target.dispatchEvent(ev)
	}

	function touchStart(e) {
		if (e.touches.length == 1) {
			Event.add(document, "touchend", touchEnd)
				.add(document, "touchcancel", touchEnd)
				.add(document, "touchmove", touchHandler)
			touchHandler(e)
		}
	}

	function touchEnd(e) {
		Event.remove(document, "touchend", touchEnd)
			.remove(document, "touchcancel", touchEnd)
			.remove(document, "touchmove", touchHandler)
		touchHandler(e)
	}

	Event.touchAsMouse = function(el) {
		Event.add(el, "touchstart", touchStart)
	}
}(Event, document)


