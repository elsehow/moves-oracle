const ud = require('ud');
const predictor = require('predictor-backend')
const token = require('../token')
// everything in this function will get updated on change
var setup = ud.defn(module, function () {
  let modelS = predictor(token, '20160922', 10, 7)
  console.log('loading..')
  modelS.onValue(state => {
    let el = require('..')(state)
    document.body.innerHTML=''
    document.body.appendChild(el)
  })
})

// will re-run setup() whenever method changes
setup()
