// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'

import Timer from '../index.js'
import { Timer as TimerFromSrc } from '../src/Timer.js'

describe('main require', function () {
  it('exports Timer from src', function () {
    expect(Timer).to.equal(TimerFromSrc)
  })
})
