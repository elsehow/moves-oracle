const test = require('tape')
const modelcontroller = require('..')

function mockModelStreamF (n) {

  const kefir = require('kefir')
  const nextafter = require('next-after-n')

  function next (labels, ngram) {
    let n = ngram.length
    if (!n)
      return 'No idea!'
    let model = train(labels,n)
    let prediction = model[ngram]
    if (prediction)
      return prediction
    let n_minus_one_gram = ngram.slice(1)
    return next(labels, n_minus_one_gram)
  }

  function train (labels, n) {
    let model = nextafter(labels, n)
    return model
  }

  let noises = [
     { label: 'beep'  }
   , { label: 'beep'  }
   , { label: 'beep'  }
   , { label: 'snark' }
   , { label: 'beep'  }
  ]

  function nextF (ngram) {
    let labels = noises.map(x=>x.label)
    let ng = labels.slice(1*-n)
    if (ngram)
      ng = ngram
    return next(labels, ng)
  }

  return kefir.constant({
    corpus: noises,
    nextF: nextF,
  })
}

let store = modelcontroller(mockModelStreamF, {
  n: 3,
})

test('initializing model-controller', t => {
  let state = store.getState()
  t.deepEqual(state.predictions, [{'snark': 1, 'beep': 2,}],
   '`state.predictions is a list 1 object`')
  t.ok(state.corpus.length,
   'state has a list `corpus`')
  t.deepEquals(typeof state.nextF, 'function',
   'state has a fn `nextF`')
  t.notOk(state.err,
   'state has no errors')
  t.end()
})

test('select-prediction 0 yields 2 predictions', t => {
  store.subscribe(function (state) {
    t.equals(state.predictions.length, 2,
     '`state.predictions` now has length 2')
    t.end()
    // What ngram should we have tried to predict with?
    //    'snark,beep,snark'
    // What prediction would we expect to see?
    //    { 'beep': 1 }
    t.deepEquals(state.predictions[1], {
      beep: 1,
    }, 'new prediction is as expected')
  })
  store.dispatch({
    type: 'select-prediction',
    pred_i: 0,
    label: 'snark'
  })
})

test('select-prediction 1 yields 3 predictions', t => {
  // should have 3 predictions now
  store.subscribe(function (state) {
    t.equals(state.predictions.length, 3,
     '`state.predictions` now has length 3')
    // TODO new one should be as expeted
    // What should this ngram be?
    //    'snark,snark,snark'
    // What would this prediction be?
    t.deepEquals(state.predictions[2], {
      beep: 1
    }, '`state.predictions[2]` is as expected')
    t.deepEquals(state.selected_predictions, {
      0: 'snark',
      1: 'snark',
    }, 'state.selected_predictions is as expected')
    t.end()
  })
  store.dispatch({
    type: 'select-prediction',
    pred_i: 1,
    label: 'snark',
  })
})


// what if i select another prediction
// while one is already selected?
test('select a different prediction at level 0, while a different one is already selected at level 1', t => {
  // should have 3 predictions now
  store.subscribe(function (state) {
    t.deepEqual(state.selected_predictions, {
      0: 'beep'
    }, 'now state.selected_predictions is a list of only 1 object')

    t.deepEqual(state.predictions, [
      {'beep': 2, 'snark': 1,}
     ,{'snark': 1, 'beep': 1,}
    ], 'now state.predictions is 2 objects')
    t.end()
  })
  store.dispatch({
    type: 'select-prediction',
    pred_i: 0,
    label: 'beep',
  })
})


test('deselect-prediction 0 beep yields 1 prediction, 0 selected_prediction', t => {
  store.subscribe(function (state) {
    t.equals(state.predictions.length, 1,
     'now `state.predictions` now has length 1')
    t.deepEquals(state.selected_predictions, {},
     'now `state.selected_predictions` is {}')
    t.deepEquals(state.predictions, [
      {'beep': 2, 'snark': 1,}
    ], 'now `state.predictions` is just that first pred we had originally')
    t.end()
  })
  // TODO new one should be as expeted
  store.dispatch({
    type: 'deselect-prediction',
    pred_i: 0,
    label: 'beep'
  })
})

test('select-prediction 3 should throw an error', t => {
  t.plan(1)
  t.throws(function () {
    store.dispatch({
      type: 'select-prediction',
      pred_i: 7,
      label: 'whatever',
    })
  }, 'selecting nonexistent prediction index yields error')
})

test('deselect-prediction 3 should throw an error', t => {
  t.plan(1)
  t.throws(function () {
    store.dispatch({
      type: 'deselect-prediction',
      pred_i: 7,
      label: 'whatever',
    })
  }, 'selecting nonexistent prediction index yields error')
})

test('select-prediction 0 not-real-key should throw an error', t => {
  t.plan(1)
  t.throws(function () {
    store.dispatch({
      type: 'select-prediction',
      pred_i: 0,
      label: 'not-real-key',
    })
  }, 'selecting nonexistent prediction label yields error')
})
