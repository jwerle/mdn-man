
/**
 * Module dependencies
 */

var Parser = require('html-to')
  , fs = require('fs')
  , through = require('through')

var read = fs.readFileSync;
var stack = null;
var html = null;
var parser = null;

function occurences (e, a) {
  var c = 0;
  a.forEach(function (i) {
    if (e == i) c++;
  });

  return c;
}

function pad (level, str) {
  if ('#' == str[0]) return str;
  var i = 0; var out = "\n";
  for (; i < level; ++i) out += '#';
  if (level > 0) out += " ";
  return out + str + '\n\n';
}

function trim (str) {
  var i = 0;
  str = str.replace(/^\s+/, '');
  for (i = str.length - 1; i >= 0; i--) {;
    if (true == /\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }

  return str;
}

function code (str) {
  if ('`' == str[0]) return str;
  return '`'+ str +'`';
}

function block (str) {
  if ('`' == str[0]) return str;
  return '\n\n```\n'+ str + '\n```\n\n';
}

function bold (str) {
  if ('*' == str[0]) return str;
  return '**'+ str +'**';
}

function italic (str) {
  if ('*' == str[0]) return str;
  return '*'+ str +'*';
}

function p (str) {
  return '\n\n\n'+ str +'\n\n';
}

module.exports = function () {
  var parser = Parser();

  parser
    .pipe(through(function (chunk) { this.push(trim(String(chunk))); }))

  parser
    .root('#wikiArticle')
    .exclude('table, .htab, #Browser_compatibility, #Specifications')

  parser.use(function (node) {
    var text = trim(this.html());

    switch (node.name) {
      case 'h1': text = pad(1, trim(text)); break;
      case 'h2': text = pad(2, trim(text)); break;
      case 'h3': text = pad(3, trim(text)); break;
      case 'h4': text = pad(4, trim(text)); break;
      case 'h5': text = pad(5, trim(text)); break;
      case 'h6': text = pad(6, trim(text)); break;

      case 'pre': text = block(text); break;
      case 'code': text = code(text); break;
      case 'dt': text = code(text) + '\n'; break;

      default:
        text = p(text);
    }

    this.html(text);
  });


  return parser;
};

