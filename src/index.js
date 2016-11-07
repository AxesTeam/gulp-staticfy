'use strict';

var gutil = require('gulp-util');
var path = require('path');
var phantom = require("phantom");
var SimpleServer = require('./server.js');
var map = require('map-stream');

module.exports = function(options) {
  return map(function (file, callback) {
      if (file.isNull()) {
          console.log("null");
          return callback(null, file);
      }
      if (file.isStream()) {
          console.log("stream");
          return callback(null, file);
      }

      if (file.isBuffer()) {
          var wwwDir = path.dirname(file.path);
          var baseName = path.basename(file.path);
          var url = 'http://localhost:{{port}}/';
          //file.contents = new Buffer("11");
          //callback(null, file);
          SimpleServer.start(wwwDir, function (server) {
              // Replace {{port}} with server.port
              url = url.replace('{{port}}', server.port) + baseName;
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
                  file.contents = new Buffer(content);
                  callback(null, file);
                  console.log(gutil.colors.green(baseName + "load success"));
                  _page.close();
                  _ph.exit();
              }).catch(e => console.log(e));
          });
      }
  });
};
