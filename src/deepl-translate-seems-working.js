// eslint-disable camelcase
/*
import httpx
url = 'https://www2.deepl.com/jsonrpc'
headers = { 'Content-Type': 'application/json' }
post_str = '''{"jsonrpc":"2.0","method": "LMT_handle_texts","params":{"splitting":"newlines","lang":{"source_lang_user_selected":"EN","target_lang":"ZH"},"texts":[{"text":"this is a test and so on","requestAlternatives":3}],"timestamp":1677915377181},"id":118629000}'''
post_str = '''{"jsonrpc":"2.0","method": "LMT_handle_texts","params":{"splitting":"newlines","lang":{"source_lang_user_selected":"EN","target_lang":"ZH"},"texts":[{"text":"this is a test and so on"}],"timestamp":1677915377181},"id":118629000}'''

post_str = '''{"jsonrpc":"2.0","method": "LMT_handle_texts","params":{"splitting":"newlines","lang":{"source_lang_user_selected":null,"target_lang":"DE"},"texts":[{"text":"this is a test and so on","requestAlternatives":3}],"timestamp":1677915743271},"id":144792000}'''
post_str = '''{"jsonrpc":"2.0","method": "LMT_handle_texts","params":{"splitting":"newlines","lang":{"source_lang_user_selected":null,"target_lang":"DE"},"texts":[{"text":"this is a test and so on","requestAlternatives":3}],"timestamp":1677916258170},"id":140054000}'''
httpx.post(url, data=post_str, headers=headers).json()

post_str = '''{"jsonrpc":"2.0","method": "LMT_handle_texts","params":{"splitting":"newlines","lang":{"source_lang_user_selected":"EN","target_lang":"ZH"},"texts":[{"text":"this is a test and so on"}],"timestamp":1677916406790},"id":129277000}'''
httpx.post(url, data=post_str, headers=headers).json()

*/
const axios = require('axios')

const logger = require('tracer').colorConsole({
  format: '{{timestamp}} <{{title}}>{{file}}:{{line}}: {{message}}',
  dateformat: 'HH:MM:ss.L',
  level: process.env.TRACER_DEBUG || 'debug',
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

// const langMap = new Map(config.supportedLanguages);
// const langMapReverse = new Map(config.supportedLanguages.map(([standardLang, lang]) => [lang, standardLang]));
const langMap = new Map(supportedLanguages)
const langMapReverse = new Map(supportedLanguages.map(([standardLang, lang]) => [lang, standardLang]))

// 入参格式:
// {"jsonrpc":"2.0","method" : "LMT_handle_texts","id":125090001,"params":{"texts":[{"text":"You trusted all proxies, this is NOT safe. We recommend you to set a value.","requestAlternatives":3}],"splitting":"newlines","lang":{"source_lang_user_selected":"EN","target_lang":"ZH"},"timestamp":1676555144560}}
// 出参格式:
// {"rawData":{},"data":{"jsonrpc":"2.0","id":194187000,"result":{"texts":[{"text":"参数","alternatives":[{"text":"Params"},{"text":"参数表"},{"text":"参量"}]}],"lang":"EN","lang_is_confident":false,"detectedLanguages":{"SK":0.011904,"ZH":0.005038,"unsupported":0.505983,"PT":0.040255,"PL":0.020479,"SL":0.024711999999999994,"DE":0.02167,"RO":0.013807,"ES":0.016012,"TR":0.027060000000000008,"NB":0.022891,"ET":0.016899,"EL":0.001863,"FI":0.016634,"SV":0.030546,"FR":0.017381,"NL":0.022213,"HU":0.017405,"CS":0.014604000000000002,"EN":0.037805,"DA":0.013585999999999997,"IT":0.024718,"JA":0.0064249999999999976,"BG":0.002212,"LT":0.023487,"ID":0.012715,"UK":0.001442,"KO":0.001697,"RU":0.004128,"LV":0.024428}}}

// https://bobtranslate.com/plugin/api/data.html

function initData (source_lang, target_lang) {
  return {
    jsonrpc: '2.0',
    method: 'LMT_handle_texts',
    params: {
      splitting: 'newlines',
      lang: {
        source_lang_user_selected: source_lang,
        target_lang
      }
    }
  }
}

function getICount (translate_text) {
  return translate_text.split('i').length - 1
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
  // return config.supportedLanguages.map(([standardLang]) => standardLang)
  return supportedLanguages.map(([standardLang]) => standardLang)
}
*/

const translate = async (query) => {
  // const targetLanguage = utils.langMap.get(query.detectTo)
  // const sourceLanguage = utils.langMap.get(query.detectFrom)
  const targetLanguage = langMap.get(query.detectTo)
  const sourceLanguage = langMap.get(query.detectFrom)

  const source_lang = sourceLanguage || null
  const target_lang = targetLanguage || 'ZH'
  const translate_text = query.text || ''
  if (translate_text.trim() === '') return { text: '' }

  const url = 'https://www2.deepl.com/jsonrpc'
  const id = getRandomNumber()
  const post_data = initData(source_lang, target_lang)
  const text = {
    text: translate_text,
    requestAlternatives: 3
  }
  post_data.id = id
  post_data.params.texts = [text]
  post_data.params.timestamp = getTimeStamp(getICount(translate_text))
  let post_str = JSON.stringify(post_data)
  if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
    post_str = post_str.replace('"method":"', '"method" : "')
  } else {
    post_str = post_str.replace('"method":"', '"method": "')
  }
  console.log(post_data)
  console.log(post_str)
  logger.debug('%j', post_data)
  try {
    // $http.request({
    const res = await axios.post(
      url,
      // post_data,
      post_str, //  "\"" +    + "\"" https://stackoverflow.com/questions/43573297/put-request-with-simple-string-as-request-body
      { headers: { 'Content-Type': 'application/json' } }
    )
    return res.data.result.texts[0]
  } catch (e) {
    console.log(e.message)
    return { err: e.meesage }
  }
}

const deepltr = async () => {
  // const query = { text: 'this is a test and', detectTo: 'zh-Hans'  }
  // const query = { text: 'this is a test and so on', detectTo: 'zh', detectFrom: 'en'}
  const query = { text: '这是一个测试和更快的花式测试', detectTo: 'en', detectFrom: 'zh'}
  // await translate(query)
  const result = await translate(query)
  console.log('result: ', result)
}

deepltr()
