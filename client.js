var modelS    = require('predictor-backend')
var modelcont = require('oracle-model-controller')
var view      = require('oracle-view')

// TODO update on an interval
function modelStreamF (n) {
  return modelS(
    require('./token'),
    '201609', {
      n: n,
      slice_min: 10,
    }
  )
}

var store = modelcont(modelStreamF, {
  n: 7,
})

let dispatchF = x => store.dispatch(x)
let yo = require('yo-yo')
let el = view(store.getState(), dispatchF)
store.subscribe(state => {
  console.log(state)
  let newEl = view(state, dispatchF)
  yo.update(el, newEl)
})
document.body.appendChild(el)
