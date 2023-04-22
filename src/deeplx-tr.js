// eslint-disable camelcase
const axios = require('axios')

const logger = require('tracer').colorConsole({
  format: '{{timestamp}} <{{title}}>{{file}}:{{line}}: {{message}}',
  dateformat: 'HH:MM:ss.L',
  level: process.env.TRACER_DEBUG || 'info',
})

// var config = require('./config.js');
// var utils = require('./utils.js');
const supportedLanguages = [
  ['auto', 'auto'],
  ['de', 'DE'],
  ['en', 'EN'],
  ['es', 'ES'],
  ['fr', 'FR'],
  ['it', 'IT'],
  ['ja', 'JA'],
  ['ko', 'KO'],
  ['nl', 'NL'],
  ['pl', 'PL'],
  ['pt', 'PT'],
  ['ru', 'RU'],
  ['zh-Hans', 'ZH'],
  ['zh-Hant', 'ZH'],
  ['zh', 'ZH'],
  ['bg', 'BG'],
  ['cs', 'CS'],
  ['da', 'DA'],
  ['el', 'EL'],
  ['et', 'ET'],
  ['fi', 'FI'],
  ['hu', 'HU'],
  ['lt', 'LT'],
  ['lv', 'LV'],
  ['ro', 'RO'],
  ['sk', 'SK'],
  ['sl', 'SL'],
  ['sv', 'SV']
]

const langMap = new Map(supportedLanguages)

// 入参格式:
// {"jsonrpc":"2.0","method" : "LMT_handle_texts","id":125090001,"params":{"texts":[{"text":"You trusted all proxies, this is NOT safe. We recommend you to set a value.","requestAlternatives":3}],"splitting":"newlines","lang":{"sourceLang_user_selected":"EN","targetLang":"ZH"},"timestamp":1676555144560}}
// 出参格式:
// {"rawData":{},"data":{"jsonrpc":"2.0","id":194187000,"result":{"texts":[{"text":"参数","alternatives":[{"text":"Params"},{"text":"参数表"},{"text":"参量"}]}],"lang":"EN","lang_is_confident":false,"detectedLanguages":{"SK":0.011904,"ZH":0.005038,"unsupported":0.505983,"PT":0.040255,"PL":0.020479,"SL":0.024711999999999994,"DE":0.02167,"RO":0.013807,"ES":0.016012,"TR":0.027060000000000008,"NB":0.022891,"ET":0.016899,"EL":0.001863,"FI":0.016634,"SV":0.030546,"FR":0.017381,"NL":0.022213,"HU":0.017405,"CS":0.014604000000000002,"EN":0.037805,"DA":0.013585999999999997,"IT":0.024718,"JA":0.0064249999999999976,"BG":0.002212,"LT":0.023487,"ID":0.012715,"UK":0.001442,"KO":0.001697,"RU":0.004128,"LV":0.024428}}}

// https://bobtranslate.com/plugin/api/data.html

function initData (sourceLang, targetLang) {
  return {
    jsonrpc: '2.0',
    method: 'LMT_handle_texts',
    params: {
      splitting: 'newlines',
      lang: {
        sourceLang_user_selected: sourceLang,
        target_lang: targetLang,
      }
    }
  }
}

function getICount (translateText) {
  return translateText.split('i').length - 1
}

function getRandomNumber () {
  const rand = Math.floor(Math.random() * 99999) + 100000
  return rand * 1000
}

function getTimeStamp (iCount) {
  const ts = Date.now()
  if (iCount !== 0) {
    iCount = iCount + 1
    return ts - (ts % iCount) + iCount
  } else {
    return ts
  }
}

/*
function supportLanguages () {
  return supportedLanguages.map(([standardLang]) => standardLang)
}
*/

const translate = async (query) => {
  const targetLanguage = langMap.get(query.toLang)
  const sourceLanguage = langMap.get(query.fromLang)

  const sourceLang = sourceLanguage || 'ZH'
  const targetLang = targetLanguage || 'EN'
  const translateText = query.text || ''
  if (translateText.trim() === '') return { text: '' }

  const url = 'https://www2.deepl.com/jsonrpc'
  const id = getRandomNumber()
  const postData = initData(sourceLang, targetLang)
  const text = {
    text: translateText,
    requestAlternatives: 3
  }
  postData.id = id
  postData.params.texts = [text]
  postData.params.timestamp = getTimeStamp(getICount(translateText))
  let postStr = JSON.stringify(postData)
  if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
    postStr = postStr.replace('"method":"', '"method" : "')
  } else {
    postStr = postStr.replace('"method":"', '"method": "')
  }

  let res
  try {
    res = await axios.post(
      url,
      postStr,
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    logger.error(e.message)
    return e.message
  }

  let resu
  try {
    resu = res.data.result.texts[0]
  } catch (e) {
    logger.error(e.message)
    resu = e.message
  }

  return resu
}

/*
const deepltr = async () => {
  const query = { text: 'this is a test and so on', toLang: 'zh-Hans', fromLang: 'en' }
  const result = await translate(query)
  logger.info('result: ', result)
}


if (require.main === module) {
  // main();
  deepltr()
}
// */

module.exports = translate
module.exports.supportedLanguages = supportedLanguages
