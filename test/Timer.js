// @ts-check

'use strict'

import { expect, sinon } from '@dimensionalpocket/development'

import { Timer } from '../src/Timer.js'

describe('Timer', function () {
  before(function () {
    this.clock = sinon.useFakeTimers()
  })

  after(function () {
    this.clock.restore()
  })

  describe('constructor', function () {
    it('sets defaults', function () {
      var timer = new Timer()
      // @ts-ignore private property
      expect(timer._duration).to.eq(1000)
      // @ts-ignore private property
      expect(timer._delay).to.eq(0)
      // @ts-ignore private property
      expect(timer._repeat).to.eq(1)
      // @ts-ignore private property
      expect(timer._interval).to.eq(false)
      // @ts-ignore private property
      expect(timer._delayRef).to.eq(null)
      // @ts-ignore private property
      expect(timer._timeoutRef).to.eq(null)
      // @ts-ignore private property
      expect(timer._intervalRef).to.eq(null)
    })

    it('calls #configure', function () {
      sinon.stub(Timer.prototype, 'configure')
      var timer = new Timer()
      expect(timer.configure).to.have.been.calledWith(null)
      timer = new Timer({ duration: 10 })
      expect(timer.configure).to.have.been.calledWith({ duration: 10 })
      // @ts-ignore stubbed method
      Timer.prototype.configure.restore()
    })
  })

  describe('configure', function () {
    before(function () {
      this.timer = new Timer()
    })

    it('sets duration', function () {
      this.timer.configure({ duration: 10 })
      expect(this.timer._duration).to.eq(10)
    })

    it('sets repeat', function () {
      this.timer.configure({ repeat: 5 })
      expect(this.timer._repeat).to.eq(5)
    })

    it('sets repeat to -1 if loop is true', function () {
      this.timer.configure({ repeat: 5, loop: true })
      expect(this.timer._repeat).to.eq(-1)
    })

    it('sets repeat to 1 if given zero', function () {
      this.timer.configure({ repeat: 0 })
      expect(this.timer._repeat).to.eq(1)
    })

    it('sets repeat to 1 if given a negative value', function () {
      this.timer.configure({ repeat: -5 })
      expect(this.timer._repeat).to.eq(1)
    })

    it('sets interval', function () {
      this.timer.configure({ interval: true })
      expect(this.timer._interval).to.eq(true)
    })
  })

  describe('#start', function () {
    before(function () {
      this.ticks = []
      this.timer = new Timer({ duration: 1000 })
      this.timer.on('start', (timer) => {
        this.ticks.unshift(['start', timer, Date.now()])
      })
      this.timer.on('tick', (timer) => {
        this.ticks.unshift(['tick', timer, Date.now()])
      })
      this.timer.on('stop', (timer) => {
        this.ticks.unshift(['stop', timer, Date.now()])
      })
    })

    after(function () {
      this.timer.removeAllListeners()
    })

    function itBehavesLikeItRunsTheTimer () {
      it('calls #configure', function () {
        sinon.stub(this.timer, 'configure')
        this.timer.start({ duration: 10 })
        expect(this.timer.configure).to.have.been.calledWith({ duration: 10 })
        this.timer.start()
        expect(this.timer.configure).to.have.been.calledWith(null)
        this.timer.stop()

        // Reset
        this.timer.configure.restore()
        this.ticks.length = 0
      })

      it('ticks once then stops for a single repeat', function () {
        this.ticks.length = 0
        this.timer.start({ repeat: 1 })
        this.clock.tick(1000)
        expect(this.ticks.length).to.eq(3)
        expect(this.ticks[2][0]).to.eq('start')
        expect(this.ticks[1][0]).to.eq('tick')
        expect(this.ticks[0][0]).to.eq('stop')
        this.ticks.length = 0
        this.clock.tick(2500)
        expect(this.ticks).to.be.empty

        // Reset
        this.ticks.length = 0
      })

      it('ticks X times then stops for multiple repeats', function () {
        this.ticks.length = 0
        this.timer.start({ duration: 1500, repeat: 5 })
        this.clock.tick(1500 * 5)
        expect(this.ticks.length).to.eq(7)
        expect(this.ticks[6][0]).to.eq('start')
        expect(this.ticks[5][0]).to.eq('tick')
        expect(this.ticks[4][0]).to.eq('tick')
        expect(this.ticks[3][0]).to.eq('tick')
        expect(this.ticks[2][0]).to.eq('tick')
        expect(this.ticks[1][0]).to.eq('tick')
        expect(this.ticks[0][0]).to.eq('stop')
        this.ticks.length = 0
        this.clock.tick(2500)
        expect(this.ticks).to.be.empty

        // Reset
        this.timer.configure({ duration: 1000 })
        this.ticks.length = 0
      })
    }

    context('when not using interval', function () {
      before(function () {
        this.timer.configure({ interval: false })
      })

      itBehavesLikeItRunsTheTimer()
    })

    context('when using interval', function () {
      before(function () {
        this.timer.configure({ interval: true })
      })

      after(function () {
        this.timer.configure({ interval: false })
      })

      itBehavesLikeItRunsTheTimer()
    })
  })
})
