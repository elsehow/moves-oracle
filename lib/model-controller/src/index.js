const createStore = require('minidux').createStore

let defaultState = {
  error: null,
  corpus: [],
  predictions: [],
  selected_predictions: {},
  nextF: () => null,
}

function prune_selection (state, pred_i) {
  // if this selection is lower than last,
  // delete downstream predictions
  if (pred_i<state.predictions.length)
    state.predictions = state.predictions.slice(0,pred_i+1)
  // and update selected_predictions
  Object.keys(state.selected_predictions).forEach(k => {
    if (parseInt(k)>pred_i) {
      delete state.selected_predictions[k]
    }
  })
  if (pred_i==0)
    state.selected_predictions={}
  return state
}

function reducer (opts) {
  return function (state, action) {
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
    case 'select-prediction':
      var pred_i = action.pred_i
      var label = action.label
      // if we don't have a prediction this high
      if(pred_i<0 || pred_i>state.predictions.length)
        // throw an errror
        throw 'No such prediction!'
      // if this selection is lower than last,
      // delete downstream predictions
      state = prune_selection(state, pred_i)
      // set new prediction
      state.selected_predictions[pred_i] = label
      // Get last n from corpus and predictions
      // console.log('selected', state.selected_predictions)
      let intermediate_predictions = state.predictions
          .slice(pred_i)
          .map((x,i) => state.selected_predictions[i])
      let ngrm = state.corpus
          .slice(-1*(opts.n-pred_i-1))
          .map(x => x.label)
          .concat(intermediate_predictions)
      // console.log(ngrm, 'ngrm')
      // TODO Where is state about *exact* selection?
      state.predictions.push(state.nextF(ngrm))
      return state
    case 'deselect-prediction':
      var pred_i = action.pred_i
      var label = action.label
      state = prune_selection(state, pred_i)
      return state
    default:
      return state
    }
  }
}

module.exports = function (modelStreamF, opts) {
  let store = createStore(reducer(opts), defaultState)
  let modelS = modelStreamF(opts)
  modelS.onError(err   => store.dispatch({ type: 'error', error: err   }))
  modelS.onValue(model => store.dispatch({ type: 'model', model: model }))
  return store
}
