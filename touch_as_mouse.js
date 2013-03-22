
	//** Touch as mouse

	function touchHandler(e) {
		Event.stop(e)
		var touch = e.changedTouches[0], ev = d.createEvent("MouseEvent")
		ev.initMouseEvent(
			e.type.replace("touch", "mouse").replace("start", "down").replace("end", "up"),
			true, true, window, 1, 
			touch.screenX, touch.screenY, touch.clientX, touch.clientY,
			false, false, false, false, 0, null)
		touch.target.dispatchEvent(ev)
	}
	
	function touchStart(e) {
		if(e.touches.length == 1) {
			Event.add(d, "touchend", touchEnd)
				.add(d, "touchcancel", touchEnd)
				.add(d, "touchmove", touchHandler)
			touchHandler(e)
		}
	}
 
	function touchEnd(e) {
		Event.remove(d, "touchend", touchEnd)
			.remove(d, "touchcancel", touchEnd)
			.remove(d, "touchmove", touchHandler)
		touchHandler(e)
	}

	Event.touch_as_mouse = function(el) {
		Event.add(el, "touchstart", touchStart)
	}
	//*/



