# deeplx-tr-node
deepl api on steroids

## Install
```bash
npm i deeplx-tr-node
```

## Use
```javascript
const deeplTranslate = require('deeplx-tr-node')

!async function (){
  console.log(await deeplTranslate({ text: 'test  this and \n\n that', toLang: 'zh', fromLang: 'en' }))
}()
// { alternatives: [], text: '测试这个和\n\n 那个' }
```

## Supported Languages
```javascript
const supportedLanguages = require('deeplx-tr-node').supportedLanguages
console.log(supportedLanguages)
```
```bash
[
  [ 'auto', 'auto' ],  [ 'de', 'DE' ],
  [ 'en', 'EN' ],      [ 'es', 'ES' ],
  [ 'fr', 'FR' ],      [ 'it', 'IT' ],
  [ 'ja', 'JA' ],      [ 'ko', 'KO' ],
  [ 'nl', 'NL' ],      [ 'pl', 'PL' ],
  [ 'pt', 'PT' ],      [ 'ru', 'RU' ],
  [ 'zh-Hans', 'ZH' ], [ 'zh-Hant', 'ZH' ],
  [ 'zh', 'ZH' ],      [ 'bg', 'BG' ],
  [ 'cs', 'CS' ],      [ 'da', 'DA' ],
  [ 'el', 'EL' ],      [ 'et', 'ET' ],
  [ 'fi', 'FI' ],      [ 'hu', 'HU' ],
  [ 'lt', 'LT' ],      [ 'lv', 'LV' ],
  [ 'ro', 'RO' ],      [ 'sk', 'SK' ],
  [ 'sl', 'SL' ],      [ 'sv', 'SV' ]
]
```

## Acknowledgment

All credit goes to 小.同学 while mistakes are all mine.