var _storage = [{
  'username': 'example',
  'text': 'exampleText',
  'roomname': 'nope',
  'objectId': '0'
}];
// var _storage = [];
var _reversedStorage = () => _storage.slice().reverse();


var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (request.method === 'GET' || request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.write(JSON.stringify({'results': _storage}));
    response.end();
  } else if (request.method === 'POST') {
    let body = [];
    let message = {};
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      Buffer.concat(body)
            .toString()
            .split('&')
            .map((pair) => pair.split('='))
            .forEach((tuple) => message[tuple[0]] = tuple[1]);
      message.objectId = _storage.length;
      console.log(message);
      _storage.push(message);
    });
    response.writeHead(201, headers);
    response.end(JSON.stringify(message));
  }
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
