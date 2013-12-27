
/**
 * Module dependencies
 */

var mdn = require('./')

var search =  mdn('array');

search.pipe(process.stdout);

search.on('error', function (err) {
  console.log('error:', err);
});
