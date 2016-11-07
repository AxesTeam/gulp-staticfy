var http = require('http');
var nodeStatic = require('node-static');
var portfinder = require('portfinder');
var fileServerList = [];
function startServer(wwwDir, callback) {
  if(fileServerList[wwwDir]){
    callback(fileServerList[wwwDir]);
  }else{
    var fileServer = new nodeStatic.Server(wwwDir);
    portfinder.getPort(function (err, port) {
      var server = http.createServer(function (request, response) {
        request.addListener('end', function () {
          fileServer.serve(request, response);
        }).resume();
      }).listen(port);
      server.port = port;
      fileServerList[wwwDir] = server;
      callback(server);
    });
  }
}

function closeServer(){
  console.log("close server");
  //process.exit(0);
  fileServerList.forEach(function(item){
    item.close();
  })
}

module.exports = {
  start: startServer,
  closeAll: closeServer
};