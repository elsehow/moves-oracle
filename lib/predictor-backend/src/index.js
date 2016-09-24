const nextafter = require('next-after-n')

// Takes access token, ISO datestr, and an object opts:
//
//   { slice_min, n }
//
// slice_min is the # of min to each item in Moves corpus
// n is the ngram size to train the model on
//
// Returns a stream of objects:
//
// {
//     corpus: [ { time, label}, ... ]
//     nextF: function ([ngram_of_labels]) { ... }
// }
//
// nextF() takes an optional ngram of labels, and an object of frequences
// if called no-op, it will generate frequencies for last n in `corpus`

module.exports = function predictionS (token, datestr, opts)  {
  if (!opts || typeof(opts)!=='Object')
    opts = {}
  if (!opts.slice_min)
    opts.slice_min=10
  if (!opts.n)
    opts.n=7
  let corpusS = require('./corpusS')(token, datestr, opts.slice_min)
  let stateS = corpusS.map(corpus => {
    let labels = corpus.map(x => x.label)
    function nextF (ngram) {
      let ng = labels.slice(1*-opts.n)
      if (ngram)
        ng = ngram
      return next(labels, ng)
    }
    return {
      corpus: corpus,
      nextF: nextF,
    }
  })
  return stateS
}

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
