
/**
 * Module dependencies
 */

var through = require('through')
  , agent = require('superagent')
  , Parser = require('./parser')
  , Ronn = require('ronn').Ronn

/**
 * Searches mdn for a term
 * and returns an object
 * containing data about
 * it
 *
 * @api public
 * @param {String} term
 * @param {Function} fn
 */

module.exports = mdn;
function mdn (term) {
  var stream = through(write);

  function write (chunk) {
    this.push(chunk);
  }

  agent.get('http://mdn.io/'+ term, function (err, res) {
    if (null != err) {
      return stream.emit('error', err);
    }

    var parsed = "";
    var parser = Parser();
    var ronn = null;

    parser.on('data', function (chunk) { parsed += chunk; });
    parser.write(res.text);

    parsed = term + "(3) -- from MDN\n"+
             "===========================================\n"+
             parsed;


    ronn = new Ronn(parsed, term, 1, Date());

    stream.write(ronn.roff());
  });

  return stream;
}
