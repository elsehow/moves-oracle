var yo = require('yo-yo')
/*
  9-25-16

  exposes a method view(state)
   */
module.exports = function view (state) {
  return yo`<div>
    <pre>
      ${JSON.stringify(state)}
    </pre>
  </div>`
}
