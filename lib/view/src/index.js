var yo = require('yo-yo')
/*
   example state:
   {
     last_observed: [
       { time: 'iso time',
       label: 'some label' },
       ....
     ],
     predicted: {
       'Moves off': 220,
       'walking': 1,
       'cycling': 2,
       'Unknown place': 2,
       'South Hall': 1,
       "Noura's house": 2
     }
   }
*/

const WIDTH   = 600
const PADDING = 5
const MARGIN  = 3
const COLORS = [
  // [ r,   g,     b]
  [255,     0,     0]
, [0,       255,   0]
, [0,       0,     255]
, [255,     0,     255]
, [0,       255,   255]
]

function observed (moves) {
  return yo`<div style=
    " padding-bottom:${PADDING}px;">
    ${moves.map(function (item) {
      return yo`<div style=
        "padding-bottom:${PADDING+MARGIN}px;">
        <div style=
          "background: #121212;
           color:      #fefefe;
           padding:    ${PADDING}px;
           width:100px;
           display:inline; ">
          ${item.label}
        </div>
        <div style=
          "font-size: 8pt;
           float:     right;
           color:     #828282; ">
         ${item.time}
        </div>
        `
    })}
  </div>`
}

function pieBar (proportions, i, dispatchF) {
  function shouldBeDim (prediction) {
    return prediction.isSelected
  }
  function proportionalBar (pred, idx) {
    let color = COLORS[idx]
    let r     = color[0]
    let g     = color[1]
    let b     = color[2]
    let a     = pred.isDimmed ? 0.1 : 1
    let background =  `rgba(${r},${g},${b},${a})`
    return yo`<div style=
      "width:      ${WIDTH*pred.percent}px;
       background: ${background};
       height:     30px;
       float:      left; "
    onclick=${function () {
      dispatchF({
        type: pred.isSelected ? 'deselect-prediction' : 'select-prediction',
        label:  pred.label,
        pred_i: i,
      })
    }}
      >
    </div>`
  }
  function proportionalLabel (pred) {
    return yo`<div style=
      "width:      ${WIDTH*pred.percent}px;
       height:     30px;
       float:      left; ">
      ${pred.label}
      </div>`
  }
  return yo`<div>
    <div>
      ${proportions.map(proportionalBar)}
    </div>
    <div>
      ${proportions.map(proportionalLabel)}
    </div>
  </div>`
}

function predicted (prediction, i, state, dispatchF) {
  let selectionHere = state.selected_predictions[i]
  function isSelected (label) {
    return selectionHere === label
  }
  function isDimmed (label) {
    return  selectionHere && selectionHere !== label
  }
  let sum = Object.keys(prediction)
      .reduce((acc, cur) => acc+=prediction[cur], 0)
  let proportions = Object.keys(prediction)
      .map((label, idx)=> {
        return {
          label:      label,
          percent:    prediction[label]/sum,
          isSelected: isSelected(label),
          isDimmed:   isDimmed(label),
        }
      })
  return yo`<div style=
    "margin: auto;">
    ${pieBar(proportions, i, dispatchF)}
  </div>`
}

function view (state, dispatchF) {

  if (state.error)
    return yo`<h2 style="color:red;"> ERR! ${state.error}`

  return yo`<div style= "width: ${WIDTH}px">
    ${observed(state.corpus.slice(-10))}
    <div>
    ${state.predictions.map(function (p,i)  {
      return predicted(p, i, state, dispatchF)
    })}
    </div>
  </div>`
}

module.exports = view
