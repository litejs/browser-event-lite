
[1]: https://raw.github.com/litejs/browser-event-lite/master/min.js
[2]: https://raw.github.com/litejs/browser-event-lite/master/index.js


    @version  0.2.0
    @date     2015-01-23


Event
=====

Browser event helper.
Download [compressed][1] 
or [uncompressed][2] source.


### Usage

```javascript
function hi(){
	alert("Hei")	
	// alert just once
	Event.remove(el, "click", hi)
}

Event.add(el, "click", hi)
// handle also touch events
Event.touch_as_mouse(el) 
```


### Licence

Copyright (c) 2012 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[The MIT License](http://lauri.rooden.ee/mit-license.txt)


