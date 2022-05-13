// @ts-check

'use strict'

import EventEmitter from 'eventemitter3'

export class Timer extends EventEmitter {
  /**
   * @typedef {Object} TimerOptions - Options for constructor, `start()` and `configure()` methods.
   * @property {number} [duration] - Duration of each tick in ms. Defaults to 1000.
   * @property {number} [delay] - Delay in ms before starting the timer. Defaults to zero.
   * @property {number} [repeat] - How many times to emit the `tick` event. Defaults to 1. Will be set to -1 (infinite) if `loop` is `true`.
   * @property {boolean} [loop] - If `true`, will loop infinitely. Defaults to `false`.
   * @property {boolean} [interval] - If `true`, will use `setInterval` internally when `repeat` is `> 1`. Defaults to `false`.
   */

  /**
   * @param {TimerOptions} [options]
   */
  constructor (options = null) {
    super()

    /**
     * Duration of each tick in ms.
     * @type {number}
     * @private
     */
    this._duration = 1000

    /**
     * Delay in ms before starting the timer.
     * @type {number}
     * @private
     */
    this._delay = 0

    /**
     * `true` if timer has been delayed after started.
     * @type {boolean}
     * @private
     */
    this._delayed = false

    /**
     * How many times to emit `tick` once the timer starts.
     * @type {number}
     * @private
     */
    this._repeat = 1

    /**
     * The number of times a tick has happened after the timer started.
     * @type {number}
     */
    this.count = 0

    /**
     * If `true`, will use `setInterval` internally.
     * @type {boolean}
     * @private
     */
    this._interval = false

    /**
     * The timeout reference returned by `setTimeout` when running a delay.
     * @type {?NodeJS.Timeout}
     * @private
     */
    this._delayRef = null

    /**
     * The timeout reference returned by `setTimeout` when running the timer in non-interval mode.
     * @type {?NodeJS.Timeout}
     * @private
     */
    this._timeoutRef = null

    /**
     * The timer reference returned by `setInterval` when running the timer in interval mode.
     * @type {?NodeJS.Timer}
     * @private
     */
    this._intervalRef = null

    /**
     * `true` if timer is running.
     * @type {boolean}
     * @private
     */
    this._started = false

    this.configure(options)
  }

  /**
   * @param {TimerOptions} options
   */
  configure (options) {
    if (!options) return

    if (options.duration !== undefined) this._duration = options.duration
    if (options.delay !== undefined) this._delay = options.delay
    if (options.repeat !== undefined) this._repeat = Math.max(options.repeat || 1, 1)
    if (options.loop === true) this._repeat = -1
    if (options.interval !== undefined) this._interval = options.interval
  }

  /**
   * Starts the timer.
   * @param {TimerOptions} [options]
   */
  start (options = null) {
    if (this._started) this.stop()

    this.configure(options)

    var delayed = this._startDelay()
    if (delayed) return

    this.count = 0

    this.emit('start', this)

    if (this._interval === true) {
      this._intervalRef = setInterval(tickTimerHelper, this._duration, this)
    } else {
      this.schedule()
    }

    this._started = true
  }

  /**
   * Delays the start of a timer. Called internally by start().
   * @returns {boolean} - `true` if timer was delayed.
   * @private
   */
  _startDelay () {
    if (this._delay > 0 && this._delayed === false) {
      this._delayed = true
      this._delayRef = setTimeout(startTimerHelper, this._delay, this)
      this.emit('delay', this, this._delay)
      return true
    }

    if (this._delayRef) {
      clearTimeout(this._delayRef)
      this._delayRef = null
    }

    this._delayed = false

    return false
  }

  /**
   * Schedules the next tick in non-interval mode.
   * @private
   */
  schedule () {
    this._timeoutRef = setTimeout(tickTimerHelper, this._duration, this)
  }

  tick () {
    if (!this._started) return // Guard against race conditions

    this.count++
    this.emit('tick', this)

    if (this._repeat > 0 && this.count >= this._repeat) {
      this.stop()
    } else if (this._interval !== true) {
      this.schedule()
    }
  }

  /**
   * Clears all active timeouts and intervals.
   */
  stop () {
    this._started = false
    this._delayed = false
    this.count = 0

    this._stopDelay()
    this._stopInterval()
    this._stopTimeout()

    this.emit('stop', this)
  }

  /**
   * @private
   */
  _stopInterval () {
    if (this._intervalRef) {
      clearInterval(this._intervalRef)
      this._intervalRef = null
    }
  }

  /**
   * @private
   */
  _stopDelay () {
    if (this._delayRef) {
      clearTimeout(this._delayRef)
      this._delayRef = null
    }
  }

  /**
   * @private
   */
  _stopTimeout () {
    if (this._timeoutRef) {
      clearTimeout(this._timeoutRef)
      this._timeoutRef = null
    }
  }
}

/**
 * Starts a timer. Used as arguments to `setTimeout` and `setInterval` to avoid function binding.
 * @param {Timer} timer
 */
function startTimerHelper (timer) {
  timer.start()
}

/**
 * Ticks a timer. Used as arguments to `setTimeout` and `setInterval` to avoid function binding.
 * @param {Timer} timer
 */
function tickTimerHelper (timer) {
  timer.tick()
}
