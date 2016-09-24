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
  "#7100FA",
  "#C614C7",
  "#943B94",
  "#FAE43E",
  "aliceblue",
  "blueviolet",
  "cadetblue",
  "chartreuse",
  "crimson",
  "DarkGoldenRod"
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

function pieBar (proportions) {
  function proportionalBar (pred) {
    return yo`<div style=
      "width:      ${WIDTH*pred.percent}px;
       background: ${pred.color};
       height:     30px;
       float:      left; ">
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

function predicted (prediction) {
  let sum = Object.keys(prediction)
      .reduce((acc, cur) => acc+=prediction[cur], 0)
  let proportions = Object.keys(prediction)
      .map((cur, i)=> {
        return {
          label:   cur,
          percent: prediction[cur]/sum,
          color:   COLORS[i],
        }
      })
  return yo`<div style=
    "margin: auto;">
    ${pieBar(proportions)}
  </div>`
}

function view (state) {
  return yo`<div style=
              "width: ${WIDTH}px">
    ${observed(state.last_observed)}
    ${predicted(state.prediction)}
  </div>`
}

module.exports = view
