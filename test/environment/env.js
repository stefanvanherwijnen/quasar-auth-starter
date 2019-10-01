/**
 * Required because Jest breaks Uint8Array for some reason
 * https://github.com/facebook/jest/issues/4422
 */

'use strict'

const NodeEnvironment = require('jest-environment-node')

class TestEnvironment extends NodeEnvironment {
  constructor (config) {
    super(Object.assign({}, config, {
      globals: Object.assign({}, config.globals, {
        Uint8Array: Uint8Array,
        ArrayBuffer: ArrayBuffer
      })
    }))
  }
}

module.exports = TestEnvironment