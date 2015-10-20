


/*
* @version  0.0.3
* @author   Lauri Rooden - https://github.com/litejs/browser-keymap-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/




/*
* Windows versions of Opera have a bit of buggy behavior:
* when you type the +, -, *, or / keys on the keypad,
* then two keypress events are triggered instead of one.
* This has been observed on Opera 11 and Opera 8.5.
* http://unixpapa.com/js/key.html
*/

//** Event.keymap
!function(Event) {
	var maps = []
	, keys = {
		8:"backspace", 9:"tab",
		13:"enter", 16:"shift", 17:"ctrl", 18:"alt", 19:"pause",
		20:"caps", 27:"esc",
		33:"pgup", 34:"pgdown",
		35:"end", 36:"home",
		37:"left", 38:"up", 39:"right", 40:"down",
		45:"ins", 46:"del",
		112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8",
		120:"f9", 121:"f10", 122:"f11", 123:"f12"
	}
	//, is_down = {}

	function _key(e, chr) {
		var fn, map
		, i = 0
		, el = e.target || e.srcElement
		, input = /INPUT|TEXTAREA|SELECT/i.test((el.nodeType == 3 ? el.parentNode : el).tagName)

		while (map = maps[i++]) {
			if (!input || map.enable_input) {
				fn = map[chr] || (
					map.num && chr > "/" && chr < ":" ? (chr|=0, map.num) :
					map.all
				)
			}
			if (fn || !map.bubble) break
		}
		if (fn) fn(e, chr, el)
	}

	Event.setKeyMap = function(map) {
		maps.unshift(map)
	}

	Event.rmKeyMap = function(map) {
		var i = maps.indexOf(map||maps[0])
		if (i > -1) maps.splice(i, 1)
	}

	function keydown(e) {
		var code = e.keyCode || e.which
		// Otherwise IE backspace navigates back
		if (code == 8 && maps[0] && maps[0].backspace) {
			Event.stop(e)
		}
	//	is_down[ code ] = 1
	}
	Event.add(document, "keydown", keydown)

	function keyup(e) {
		var code = e.keyCode || e.which
		if (code > 95 && code < 106) code -= 48
		var key = keys[code] || String.fromCharCode(code) || code
		_key(e, key)
		if (e.ctrlKey && key != "ctrl") _key(e, "ctrl+" + key)
		if (e.altKey && key != "alt") _key(e, "alt+" + key)
		//e.shiftKey
		//is_down[ key ] = 0
		//is_down.ctrl && _key(e, "ctrl+"+key, el, input)
	}
	Event.add(document, "keyup", keyup)
}(Event)

//*/



