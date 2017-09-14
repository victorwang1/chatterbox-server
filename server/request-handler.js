
var _storage = [{
  'username': 'example',
  'text': 'exampleText',
  'roomname': 'nope',
  'objectId': '0'
}];

var defaultCorsHeaders = {
  'allow': 'GET, POST, OPTIONS',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
// var _storage = [];
var _reversedStorage = () => _storage.slice().reverse();


var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (request.url.indexOf('/classes/messages') !== 0) {
    if (request.method !== 'OPTIONS') {
      statusCode = 404;
    }
    response.writeHead(statusCode, headers);
    response.end();
  }

  if (request.method === 'GET' || request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({'results': _storage}));
  } else if (request.method === 'POST') {

    let message = {};
    request.on('data', (chunk) => {
      message = JSON.parse(chunk.toString('utf8'));
      message.objectId = _storage.length;
      _storage.push(message);
    });
    response.writeHead(201, headers);
    response.end(JSON.stringify(message));
  }
};


exports.requestHandler = requestHandler;
