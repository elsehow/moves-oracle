const createStore = require('minidux').createStore

let defaultState = {
  error: null,
  corpus: [],
  predictions: [],
  nextF: () => null,
}

function reducer (state, action) {
  switch (action.type) {
  case 'error':
    state.error = action.error
    return state
  case 'model':
    state.corpus = action.model.corpus
    state.nextF = action.model.nextF
    // Generate predictions
    state.predictions = [ state.nextF() ]
    return state
  // case 'select-prediction':
  //   var pred_i = action.pred_i
  //   return state
  // case 'delect-prediction':
  //   var pred_i = action.pred_i
  //   return state
  default:
    return state
  }
}

module.exports = function (modelStreamF) {
  let store = createStore(reducer, defaultState)
  let modelS = modelStreamF()
  modelS.onError(err   => store.dispatch({ type: 'error', error: err   }))
  modelS.onValue(model => store.dispatch({ type: 'model', model: model }))
  return store
}
