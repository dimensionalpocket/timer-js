// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'

import { Timeout, Interval } from '../index.js'
import { Timeout as TimeoutFromSrc } from '../src/Timeout.js'
import { Interval as IntervalFromSrc } from '../src/Interval.js'

describe('main require', function () {
  it('exports Timeout from src', function () {
    expect(Timeout).to.equal(TimeoutFromSrc)
  })

  it('exports Interval from src', function () {
    expect(Interval).to.equal(IntervalFromSrc)
  })
})
