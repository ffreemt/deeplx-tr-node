/* eslint-env mocha */
const expect = require('chai').expect
// const translate = require('../src/deeplx-tr-node')

const deeplTranslate = require('../src/deeplx-tr')

const logger = require('tracer').colorConsole({
  // format: '{{timestamp}} <{{title}}>{{file}}:{{line}}: {{message}}',
  dateformat: 'HH:MM:ss.L',
  level: process.env.TRACER_DEBUG || 'info' // set TRACER_DEBUG=debug
})

describe('@1-deeplTranslate-sanity-test', () => {
  test('#1-deeplTranslate [test 1\n test2]', async () => {
    const lines = 'test 1\n test2'
    const result = await deeplTranslate({ text: lines, toLang: 'zh', fromLang: 'en' })
    logger.info('result: %s', result)
    expect(result.text.split(/\n/).length).to.equal(2)
  })
})
