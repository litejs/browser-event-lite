
	// http://www.softcomplex.com/docs/get_window_size_and_scrollbar_position.html

	Event.pointerX = function(e) {
		if (e.changedTouches) e = e.changedTouches[0]
		return e.pageX || e.clientX + document.body.scrollLeft || 0
	}
	Event.pointerY = function(e) {
		if (e.changedTouches) e = e.changedTouches[0]
		return e.pageY || e.clientY + document.body.scrollTop || 0
	}
	Event.pointer = function(e) {
		var x = Event.pointerX(e), y = Event.pointerY(e)
		return { x: x, y: y, left: x, top: y }
	}

	//*/
