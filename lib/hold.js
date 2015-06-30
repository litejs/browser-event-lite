
Event.fixFn.hold = function(el, _fn) {
	// return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
	var ev, pending
	el.on("mousedown", down).on("touchstart", down)

	function down(e) {
		if (pending) return
		ev = e
		pending = stop.ttl(800, start)
		Event.add(document, "mouseup", pending)
		Event.add(document, "mousemove", pending)
		Event.add(document, "touchend", pending)
		Event.add(document, "touchcancel", pending)
		Event.add(document, "touchmove", pending)
	}

	function start() {
		Event.Emitter.emit.call(el, "hold", ev)
		stop()
	}

	function stop() {
		if (pending) {
			Event.remove(document, "mouseup", pending)
			Event.remove(document, "mousemove", pending)
			Event.remove(document, "touchend", pending)
			Event.remove(document, "touchcancel", pending)
			Event.remove(document, "touchmove", pending)
			pending = null
		}
	}
}

