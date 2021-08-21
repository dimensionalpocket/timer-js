# @dimensionalpocket/timer

[![build](https://github.com/dimensionalpocket/timer-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/dimensionalpocket/timer-js/actions/workflows/node.js.yml) [![Total alerts](https://img.shields.io/lgtm/alerts/g/dimensionalpocket/timer-js.svg)](https://lgtm.com/projects/g/dimensionalpocket/timer-js/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/dimensionalpocket/timer-js.svg)](https://lgtm.com/projects/g/dimensionalpocket/timer-js/context:javascript)

Opinionated wrapper for Javascript's `setInterval` and `setTimeout` functions.

## Usage

```javascript
import Timer from '@dimensionalpocket/timer'

var myFunc = () => console.log('Hello world!')

// Initialize a timer using the callback option,
// but don't start it yet.
var timer = new Timer({callback: myFunc, duration: 1000})

// You can also use emitters instead of callbacks.
// Available events: `tick`, `start`, `stop`
var timer = new Timer({emit: true, duration: 1000})
timer.on('tick', myFunc)

// Will fire callback once after 1s.
// Can be called multiple times.
// Each time start() is called, it will cancel any running timers.
timer.start()

// Cancel any active timeouts/intervals, preserving callback and settings.
timer.stop()

// Starts after 5s (so callback will be fired after 6s).
timer.start({delay: 5000})

// Fires callback 5 times every 1 second then stops.
timer.start({repeat: 5})

// Fires callback 5 times every 1 second, with a 5s delay before the first call.
timer.start({delay: 5000, repeat: 5})

// Loops infinitely until stop() is called.
timer.start({repeat: -1})
// Or
timer.start({loop: true})

// Infinite loops can be combined with delayed starts.
// The first call will fire at 6s, then loop infinitely every 1s.
timer.start({delay: 5000, loop: true})

// If you prefer to use `setInterval` internally for looping:
timer.start({loop: true, interval: true})
timer.start({repeat: 5, interval: true})

// Adds a delay to an ongoing timer.
timer.delay(1000)
```
