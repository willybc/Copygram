'use strict'

const test = require('ava')

const utils = require('../lib/utils')

test('extracting hashtags from text', t => {
  let tags = utils.extractTags('a #picture with tags #AweSome #plazi #AVA and #100 ##yes')

  t.deepEqual([
    'picture',

    'awesome',

    'platzi',

    'ava',

    '100',

    'yes'

  ], [

    'picture',

    'awesome',

    'platzi',

    'ava',

    '100',

    'yes'

  ])

  tags = utils.extractTags('a picture whit no tags')
  t.deepEqual(tags, [])

  tags = utils.extractTags()
  t.deepEqual(tags, [])

  tags = utils.extractTags(null)
  t.deepEqual(tags, [])
})
