# @dimensionalpocket/timer

Opinionated wrappers for Javascript's `setInterval` and `setTimeout`.

## Usage

```javascript
import { Timeout, Interval } from '@dimensionalpocket/timer'

var myFunc = () => console.log('Hello world!')

var timeout = new Timeout({callback: myFunc, duration: 1000})

// Will fire callback after 1s.
// Can be called multiple times.
// Each time start() is called, it will cancel any running timeouts.
timeout.start()

// Cancel any active timeouts, preserving callback and settings.
timeout.stop()

// Starts after 5s (so callback will be fired after 6s total).
timeout.start({after: 5000})

// Fires callback 5 times every 1 second then stops.
timeout.start({repeat: 5})

// Loops infinitely until stop() is called.
timeout.start({loop: true})

// -----

var interval = new Interval({callback: myFunc, duration: 1000})

// Fires callback after 1s then continuously until stop() is called.
// Each time start() is called, it will cancel any running intervals.
interval.start()

// Stops the interval, preserving settings and callback.
interval.stop()

// Starts after 5s.
// The first callback will be fired at 6s,
// then continuously at 7s, 8s, etc.
interval.start({after: 5000})
```
