var ud = require('ud');

let state = { last_observed: 
              [ { time: '2016-09-22T18:09:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T18:19:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T18:29:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T18:39:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T18:49:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T18:59:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T19:09:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T19:19:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T19:29:07-07:00', label: 'South Hall' },
                { time: '2016-09-22T19:39:07-07:00', label: 'transport' },
                { time: '2016-09-22T19:49:07-07:00', label: 'Home' },
                { time: '2016-09-22T19:59:07-07:00', label: 'Home' },
                { time: '2016-09-22T20:09:07-07:00', label: 'Home' },
                { time: '2016-09-22T20:19:07-07:00', label: 'Home' } ],
              prediction: {
                  Home:         1
                , walking:      3
                , cycling:      1
                , 'South Hall': 5
              }
            }

// everything in this function will get updated on change
var setup = ud.defn(module, function () {
  let el = require('..')(state)
  document.body.innerHTML=''
  document.body.appendChild(el)
})

// will re-run setup() whenever method changes
setup()
