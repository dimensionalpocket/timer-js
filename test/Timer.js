// @ts-check

'use strict'

import { expect, sinon } from '@dimensionalpocket/development'

import { Timer } from '../src/Timer.js'

describe('Timer', function () {
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
    it('calls #configure', function () {
      var timer = new Timer()
      sinon.stub(timer, 'configure')
      timer.start({ duration: 10 })
      expect(timer.configure).to.have.been.calledWith({ duration: 10 })
      timer.start()
      expect(timer.configure).to.have.been.calledWith(null)
      // @ts-ignore stubbed method
      timer.configure.restore()
    })

    //
  })
})
