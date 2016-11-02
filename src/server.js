var http = require('http');
var nodeStatic = require('node-static');
var portfinder = require('portfinder');

function startServer(wwwDir, callback) {
  var fileServer = new nodeStatic.Server(wwwDir);
  portfinder.getPort(function (err, port) {
    var server = http.createServer(function (request, response) {
      request.addListener('end', function () {
        fileServer.serve(request, response);
      }).resume();
    }).listen(port);
    server.port = port;
    callback(server);
  });
}

module.exports = {
  start: startServer
};