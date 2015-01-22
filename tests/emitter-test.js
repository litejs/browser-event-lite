
global.document = this

var emitted = []
, expected = []
, Emitter = require("../").Event.Emitter
, emitter = Object.create(Emitter)
, scope1 = new Scope("scope1")
, scope2 = new Scope("scope2")
, ev1 = makeHandler("ev1")
, ev2 = makeHandler("ev2")
, ev3 = makeHandler("ev3")
, ev4 = makeHandler("ev4")

function makeHandler(name) {
	return function(val) {
		emitted.push(name + ":" + val)
	}
}

function Scope(name) {
	this.name = name
}
Scope.prototype.handler = function(val) {
	emitted.push(this.name + " " + val)
}

require("testman").
describe ("Emitter").

it ("should emit").

equal(emitter.emit("ev0", "emit0"), emitter).
equal(""+emitted, ""+expected).

equal(emitter.on("ev1", ev1), emitter).
equal(emitter.emit("ev1", "emit1"), emitter).
equal(emitted.length, expected.push("ev1:emit1")).
equal(""+emitted, ""+expected).

equal(emitter.on("ev2", ev2), emitter).
equal(emitter.emit("ev1", "emit2"), emitter).
equal(emitted.length, expected.push("ev1:emit2")).
equal(""+emitted, ""+expected).

equal(emitter.emit("ev2", "emit3"), emitter).
equal(emitted.length, expected.push("ev2:emit3")).
equal(""+emitted, ""+expected).

equal(emitter.emit("ev3", "emit4"), emitter).
equal(""+emitted, ""+expected).

equal(emitter.on("ev3", ev3), emitter).
equal(emitter.emit("ev1", "emit5"), emitter).
equal(emitted.length, expected.push("ev1:emit5")).
equal(emitter.emit("ev2", "emit6"), emitter).
equal(emitted.length, expected.push("ev2:emit6")).
equal(emitter.emit("ev3", "emit7"), emitter).
equal(emitted.length, expected.push("ev3:emit7")).
equal(""+emitted, ""+expected).


it ("should handle many listeners").

equal(emitter.on("all", ev1), emitter).
equal(emitter.on("all", ev2), emitter).
equal(emitter.on("all", ev3), emitter).
equal(emitter.on("all", ev4), emitter).
equal(emitter.emit("all", "emit8"), emitter).
equal(emitted.length, (expected.push("ev1:emit8"), expected.push("ev2:emit8"), expected.push("ev3:emit8"), expected.push("ev4:emit8"))).
equal(""+emitted, ""+expected).


it ("should remove from middle").

equal(emitter.non("all", ev2), emitter).
equal(emitter.emit("all", "emit9"), emitter).
equal(emitted.length, (expected.push("ev1:emit9"), expected.push("ev3:emit9"), expected.push("ev4:emit9"))).
equal(""+emitted, ""+expected).

equal(emitter.non("all", ev2), emitter).
equal(emitter.emit("all", "emit9"), emitter).
equal(emitted.length, (expected.push("ev1:emit9"), expected.push("ev3:emit9"), expected.push("ev4:emit9"))).
equal(""+emitted, ""+expected).


it ("should remove from beginning").

equal(emitter.non("all", ev1), emitter).
equal(emitter.emit("all", "emit10"), emitter).
equal(emitted.length, (expected.push("ev3:emit10"), expected.push("ev4:emit10"))).
equal(""+emitted, ""+expected).


it ("should remove from end").

equal(emitter.non("all", ev4), emitter).
equal(emitter.emit("all", "emit11"), emitter).
equal(emitted.length, expected.push("ev3:emit11")).
equal(""+emitted, ""+expected).


it ("should remove last").

equal(emitter.non("all", ev3), emitter).
equal(emitter.emit("all", "emit12"), emitter).
equal(""+emitted, ""+expected).


it ("should remove all listeners").

equal(emitter.on("all", ev1), emitter).
equal(emitter.on("all", ev2), emitter).
equal(emitter.on("all", ev3), emitter).
equal(emitter.on("all", ev4), emitter).
equal(emitter.emit("all", "emit8"), emitter).
equal(emitted.length, (expected.push("ev1:emit8"), expected.push("ev2:emit8"), expected.push("ev3:emit8"), expected.push("ev4:emit8"))).
equal(""+emitted, ""+expected).
equal(emitter.non("all"), emitter).
equal(emitter.emit("all", "emit8"), emitter).
equal(""+emitted, ""+expected).


it ("should handle scope").

equal(emitter.on("ev", scope1.handler, scope1), emitter).
equal(emitter.emit("ev", "emit3"), emitter).
equal(emitted.length, expected.push("scope1 emit3")).
equal(""+emitted, ""+expected).

equal(emitter.once("ev", scope1.handler, scope2), emitter).
equal(emitter.once("ev2", ev2), emitter).
equal(emitter.emit("ev", "emit4"), emitter).
equal(emitted.length, (expected.push("scope1 emit4"), expected.push("scope2 emit4"))).
equal(""+emitted, ""+expected).

equal(emitter.emit("ev", "emit5"), emitter).
equal(emitted.length, expected.push("scope1 emit5")).
equal(""+emitted, ""+expected).

it ("should remove listener by origin").

equal(emitter.on("s4", ev4, null, "foo"), emitter).
equal(emitter.emit("s4", "emit1"), emitter).
equal(emitted.length, expected.push("ev4:emit1")).
equal(""+emitted, ""+expected).
equal(emitter.non("s4", "bar"), emitter).
equal(emitter.emit("s4", "emit2"), emitter).
equal(emitted.length, expected.push("ev4:emit2")).
equal(""+emitted, ""+expected).
equal(emitter.non("s4", "foo"), emitter).
equal(emitter.emit("s4", "emit3"), emitter).
equal(""+emitted, ""+expected).

it ("should remove listener by origin with scope").

equal(emitter.on("s5", scope1.handler, scope1, "foo"), emitter).
equal(emitter.emit("s5", "emit1"), emitter).
equal(emitted.length, expected.push("scope1 emit1")).
equal(""+emitted, ""+expected).
equal(emitter.non("s5", "bar"), emitter).
equal(emitter.emit("s5", "emit2"), emitter).
equal(emitted.length, expected.push("scope1 emit2")).
equal(""+emitted, ""+expected).
equal(emitter.non("s5", "foo", scope1), emitter).
equal(emitter.emit("s5", "emit3"), emitter).
equal(""+emitted, ""+expected).

done()

