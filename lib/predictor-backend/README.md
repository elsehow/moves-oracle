# predictor-backend

## example

```js
let predictor = require('predictor-backend')
let modelS = predictor(access_token, '20160922', 10, 7)
modelS.onError(err => t.notOk(err, err))
modelS.onValue( m => {
  console.log(m.corpus.length,
       `corpus is length ${m.corpus.length}`)
  console.log(m.corpus[0].time,
       'first corpus item has prop time')
  console.log(m.corpus[0].label,
      'first corpus item has prop label')
  console.log(m.nextF(),
      'nextF exists')
  let pred = m.nextF()
  console.log(pred,
       `made a prediction with nextF(): ${JSON.stringify(pred)}`)
  let last = ['South Hall', 'South Hall']
  let pred2 = m.nextF(last)
  console.log(pred2,
       `with hypothetical sequence ${last} nextF predicts ${JSON.stringify(pred2)}`)
  console.log('heres an example app state')
  console.log({
    last_observed: m.corpus.slice(-4),
    prediction: pred,
  })
  t.end()
})
```

## description

Backend is a function that takes a Moves API access token, ISO datestr, and an object opts:

    { slice_min, n }

slice_min is the # of min to each item in Moves corpus
n is the ngram size to train the model on

Returns a stream of objects:

    {
      corpus: [ { time, label}, ... ]
      nextF: function ([ngram_of_labels]) { ... }
    }

nextF() takes an optional ngram of labels, and an object of frequences
if called no-op, it will generate frequencies for last n in `corpus`
