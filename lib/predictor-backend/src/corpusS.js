const request = require('request')
const kefir   = require('kefir')
const moment  = require('moment')
const first   = arr => arr[0]
const last    = arr => arr[arr.length-1]
const rest    = arr => arr.slice(1)
const empty   = arr => arr.length==0
const flatten = arr => arr.reduce((a, b) => a.concat(b), [])

/*

  9-22-16

  Returns a stream with a single corpus.
  The corpus is a list of

  [
    { time: [moment.js time], label: 'wlk' },
    ...
  ]

  Stream may also emit errors

  */

// returns a stream of http get responses, or errors
function fetch_moves (token, pastDays) {

  return kefir.stream(emitter => {
    function handle (error, response, body) {
      if (error) {
        emitter.error(error)
        return
      }
      if (body==='expired_access_token') {
        emitter.error(body)
        return
      }
      let json = JSON.parse(body)
      if (json.error) {
        emitter.error(json)
        return
      }
      emitter.emit(json)
      return
    }
    let url = `https://api.moves-app.com/api/1.1/user/storyline/daily?pastDays=${pastDays}&access_token=${token}`
    // let url = `https://api.moves-app.com/api/1.1/user/storyline/daily/2016-W38?access_token=${token}`
    // console.log(url)
    request(url, handle)
  })
}

function parse (iso8601) {
  return moment(iso8601, 'YYYYMMDDTHHmmssZ')
}


function split_by (minutes) {

  function segments_of (stories) {
    return flatten(stories.map(s => s.segments))
  }

  function start_time (segment) {
    return parse(segment['startTime'])
  }

  function end_time (segment) {
    return parse(segment['endTime'])
  }

  function label (segment) {
    if (segment) {
      if (segment.type==='place') {
        let name = segment.place.name
        if (name)
          return name
        return 'Unknown place'
      }
      else if (segment.type==='move')
        return first(segment.activities).group
    }
    return 'Moves off'
  }

  function labeled_sequence (segments, time, acc) {

    // console.log('at', segments.length, time.format())
    if (empty(segments))
      return acc

    let seg = first(segments)

    if (time.isBetween(start_time(seg), end_time(seg))) {
      acc.push({
        time: time.format(),
        label: label(seg)
      })
      return labeled_sequence(segments,
                              time.add(minutes, 'minutes'),
                              acc)
    }

    if (time.isBefore(start_time(seg)))
      return labeled_sequence(segments,
                              time.add(minutes, 'minutes'),
                              acc)

    return labeled_sequence(rest(segments), time, acc)
  }

  return function (stories) {
    let segments = segments_of(stories)
    let global_start = start_time(first(segments))
        .add(1, 'seconds')
    return labeled_sequence(segments, global_start, [])
  }
}

function corpusS (token, pastDays, slice_min) {
  let splitter = split_by(slice_min)
  return fetch_moves(token, pastDays).map(splitter)
}

module.exports = corpusS
