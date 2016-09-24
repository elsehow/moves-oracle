const test = require('tape')

// TODO Generate this in the ipy notebook
let access_token='HZ124Mj6Rdip24pP6gXrw3PX1F4g5wJc52E_hZ2431wQSJw68rFyYes5W7QGQXqU'

test('generate stream of { corpus, nextF }', t => {
  let n = 4
  let model = require('..')
  let modelS = model(access_token, '20160922', 10, 7)
  modelS.onError(err => t.notOk(err, err))
  modelS.onValue(m=> {
    t.ok(m.corpus)
    t.ok(m.corpus.length,
         `corpus is length ${m.corpus.length}`)
    t.ok(m.corpus[0].time,
         'first corpus item has prop time')
    t.ok(m.corpus[0].label,
        'first corpus item has prop label')
    t.ok(m.nextF(),
        'nextF exists')
    let pred = m.nextF()
    t.ok(pred,
         `made a prediction with nextF(): ${JSON.stringify(pred)}`)
    let last = ['South Hall', 'South Hall']
    let pred2 = m.nextF(last)
    t.ok(pred2,
         `with hypothetical sequence ${last} nextF predicts ${JSON.stringify(pred2)}`)
    console.log('heres an example state')
    console.log({
      last_observed: m.corpus.slice(-4),
      prediction: pred,
    })
    t.end()
  })
})
