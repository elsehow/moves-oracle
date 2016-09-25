var ud = require('ud');

let corp = [
  { time: '2016-09-22T18:09:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T18:19:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T18:29:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T18:39:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T18:49:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T18:59:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T19:09:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T18:59:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T19:09:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T19:19:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T19:29:07-07:00', label: 'South Hall' },
  { time: '2016-09-22T19:39:07-07:00', label: 'transport' },
  { time: '2016-09-22T19:49:07-07:00', label: 'Home' },
  { time: '2016-09-22T19:59:07-07:00', label: 'Home' },
  { time: '2016-09-22T20:09:07-07:00', label: 'Home' },
  { time: '2016-09-22T20:19:07-07:00', label: 'Home' } 
]

let states = [
  // simple state, one prediction
  {
    corpus: corp,
    predictions: [{
        Home:         1
      , walking:      3
      , cycling:      1
      , 'South Hall': 5
    }],
    selected_predictions: {}
  },
  // a selected prediction
  {
    corpus: corp,
    predictions: [
      {
        Home:           1
      , walking:        3
      , cycling:        1
      , 'South Hall':   5
      },
      {
          cycling:      300
        , walking:      3
        , 'South Hall': 1
      },
    ],
    selected_predictions: {
      0: 'cycling'
    }
  }, 
  // error state
  {
    error: 'Uh oh! Big bad time :('
  }
]

function dispatchF (action) {
  console.log('ACTION DISPATCHED!', action)
}

// everything in this function will get updated on change
var setup = ud.defn(module, function () {
  let yo = require('yo-yo')
  let view = require('..')
  document.body.innerHTML=''
  states.forEach(state => {
    let el = view(state, dispatchF)
    el = yo`<div><h1>card</h1>${el}</div>`
    document.body.appendChild(el)
  })
})

// will re-run setup() whenever method changes
setup()
