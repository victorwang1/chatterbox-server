var fs = require('fs');
var path = require('path');

// var latestMessage = -1;

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

var _readFile = function() {
  fs.readFile(path.resolve(__dirname, './message-storage.json'), function(err, data) {
    if (!err) {
      let theResults = data.toString('utf8');
      if (theResults.length) {
        _storage = JSON.parse(theResults).results;
      }
    } else {
      console.log('eeeeeeeerrrrrrrrrrrrrror');
    }
  });
};

var _updateFile = function() {
  var write = {'results': _storage};
  fs.writeFile(path.resolve(__dirname, './message-storage.json'), JSON.stringify(write), function(err) {
    if (!err){
      console.log('message-storage updated');
    } else {
      console.log("HALP");
    }
  });
};

var apiRequestHandler = function(request, response) {

  if (_storage.length === 1) {
    _readFile();
  }

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (request.url.indexOf('/classes/messages') !== 0) {
    if ((request.url === '/' || (request.url.indexOf('/?username=') === 0)) && request.method === 'GET') {
      fs.readFile(path.resolve(__dirname, '../client/client/index.html'), 'utf8', function(err, data) {
        if (err) throw err;
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
      });
    } else if (request.method === 'OPTIONS') {
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({'results': _storage}));
    } else {
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
  } else if (request.method === 'OPTIONS') {

    response.writeHead(statusCode, headers);
    response.end('hi');

  } else if (request.method === 'GET') {

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({'results': _storage}));

  } else if (request.method === 'POST') {
    let message = {};
    request.on('data', (chunk) => {
      message = JSON.parse(chunk.toString('utf8'));
      message.objectId = new Date().getTime();
      _storage.push(message);
      // console.log(_storage);
      _updateFile();
    });
    response.writeHead(201, headers);
    response.end(JSON.stringify(message));
  }
};


var fileRequestHandler = function(request, response) {
  var header = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  }
  var url = request.url;
  if (request.method !== 'GET') {
    response.writeHead(404, header);
    response.end('not found');
  }

  if ((url === '/' || (url.indexOf('/?username=') === 0))) {
    fs.readFile(path.resolve(__dirname, '../client/client/index.html'), 'utf8', function(err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(data);
    });
  } else if (url.indexOf('/styles/styles.css') === 0) {
    fs.readFile(path.resolve(__dirname, '../client/client/styles/styles.css'), 'utf8', function(err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'text/css'});
      response.end(data);
    });
  } else if (url.indexOf('/bower_components/jquery/dist/jquery.js') === 0) {
    fs.readFile(path.resolve(__dirname, '../client/client/bower_components/jquery/dist/jquery.js'), 'utf8', function(err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'text/css'});
      response.end(data);
    });
  } else if (url.indexOf('/scripts/app.js') === 0) {
    fs.readFile(path.resolve(__dirname, '../client/client/scripts/app.js'), 'utf8', function(err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'text/javascript'});
      response.end(data);
    });
  } else if (url.indexOf('/images/spiffygif_46x46.gif') === 0) {
    fs.readFile(path.resolve(__dirname, '../client/client/images/spiffygif_46x46.gif'), 'utf8', function(err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'image/gif'});
      response.end(data);
    });
  }
};

exports.requestHandler = apiRequestHandler;
exports.fileRequestHandler = fileRequestHandler;
