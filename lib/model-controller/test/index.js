const test = require('tape')
const modelcontroller = require('..')

function mockModelStreamF () {
  const kefir = require('kefir')
  const nextafter = require('next-after-n')
  let noises = [
      'beep'
    , 'beep'
    , 'beep'
    , 'beep'
    , 'snark'
  ]
  return kefir.constant({
    corpus: noises,
    nextF: function () {
      return nextafter(noises, 2)
    }
  })
}

let store = modelcontroller(mockModelStreamF)
test('initializing model-controller', t => {
  let state = store.getState()
  t.ok(state.corpus.length,
   'state has a list `corpus`')
  t.equals(state.predictions.length, 1,
   'state has a list `predictions` of length 1')
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
    // TODO What ngram should we have tried to predict with?
    // TODO What ngram would we expect to see
  })
  store.dispatch({
    type: 'select-prediction',
    pred_i: 0,
  })
})

// test('select-prediction 1 yields 3 predictions', t => {
//   // should have 3 predictions now
//   store.subscribe(function (state) {
//     t.equals(state.predictions.length, 3,
//      '`state.predictions` now has length 3')
//     t.end()
//   })
//   // TODO new one should be as expeted
//   store.dispatch({
//     type: 'select-prediction',
//     pred_i: 1,
//   })
// })

// test('deselect-prediction 1 yields 2 prediction', t => {
//   store.subscribe(function (state) {
//     t.equals(state.predictions.length, 2,
//      '`state.predictions` now has length 2')
//     // TODO should just have that first and second pred we had originally
//     t.end()
//   })
//   // TODO new one should be as expeted
//   store.dispatch({
//     type: 'deselect-prediction',
//     pred_i: 1,
//   })
// })

// test('deselect-prediction 0 yields 1 prediction', t => {
//   store.subscribe(function (state) {
//     t.equals(state.predictions.length, 1,
//      '`state.predictions` now has length 1')
//     // TODO should just have that original prediction now
//     t.end()
//   })
//   store.dispatch({
//     type: 'deselect-prediction',
//     pred_i: 0,
//   })
// })

// test('select-prediction 3 should yield an error', t => {
//   store.subscribe(function (state) {
//     t.ok(state.error,
//      'selecting nonexistent prediction index yields error ' + state.error)
//     t.end()
//   })
//   store.dispatch({
//     type: 'select-prediction',
//     pred_i: 3,
//   })
// })

// test('deselect-prediction 3 should yield an error', t => {
//   store.subscribe(function (state) {
//     t.ok(state.error,
//      'deselecting nonexistent prediction index yields error ' + state.error)
//     t.end()
//   })
//   store.dispatch({
//     type: 'deselect-prediction',
//     pred_i: 3,
//   })
// })
