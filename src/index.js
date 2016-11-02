'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var phantom = require("phantom");
var co = require('co');
var SimpleServer = require('./server.js');

// 可以按照 gulp-cssmin 的方式来写
module.exports = function(options) {
  return through.obj(function(file, enc, callback) {
      if (file.isNull()) {
          console.log("null");
          return callback(null, file);
      }
      if (file.isStream()) {
          console.log("stream");
          return callback(null, file);
      }

      if (file.isBuffer()) {
          file.contents = new Buffer("111");
          //var wwwDir = path.join(__dirname, '.');
          var wwwDir = 'F:/airdroid_code/github/gulp-staticfy/example';
          console.log("www:", wwwDir);
          var url = 'http://localhost:{{port}}/';
          SimpleServer.start(wwwDir, function (server) {
              console.log("port:", server.port);
              // Replace {{port}} with server.port
              url = url.replace('{{port}}', server.port) + 'src/simple.html';
              console.log("url:", url);
              var _ph, _page;
              phantom.create().then(ph => {
                  _ph = ph;
                  return _ph.createPage();
              }).then(page => {
                  _page = page;
                  return _page.open(url);
              }).then(status => {
                  console.log(status);
                  return _page.property('content')
              }).then(content => {
                  //console.log(content);
                  file.contents = new Buffer(content);
                  callback(null, file);
                  console.log("end");
                  _page.close();
                  _ph.exit();
              }).catch(e => console.log(e));
          });
      }
  });
};
