'use strict';

var gutil = require('gulp-util');
var path = require('path');
var phantom = require("phantom");
var SimpleServer = require('./server.js');
var map = require('map-stream');

module.exports = function(options) {
    var totalFileSize = 0;
    var finishFileSize = 0;
    // close all http server
    var doAllFinish = () => {
        SimpleServer.closeAll();
        console.log(gutil.colors.green("staticfy success"));
    };
    var doFinish = () => {
        finishFileSize += 1;
        if(finishFileSize === totalFileSize){
            doAllFinish();
        }
    };
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
          totalFileSize += 1;
          var wwwDir = file.cwd;
          var baseName = path.relative(file.cwd, file.path);
          var url = 'http://localhost:{{port}}/';
          var query_string = options.query_string ? `?${options.query_string}` : '';
          SimpleServer.start(wwwDir, server => {
              // Replace {{port}} with server.port
              url = url.replace('{{port}}', server.port) + baseName + query_string;
              var _ph, _page;
              phantom.create().then(ph => {
                  _ph = ph;
                  return _ph.createPage();
              }).then(page => {
                  _page = page;
                  return _page.open(url);
              }).then(status => {
                  //console.log(status);
                  return _page.property('content')
              }).then(content => {
                  console.log(gutil.colors.blue(baseName) + gutil.colors.green(" load success"));
                  doFinish();
                  _page.close();
                  _ph.exit();
                  file.contents = new Buffer(content);
                  callback(null, file);
              }).catch(e => {
                  doFinish();
                  console.log(e)
              });
          });
      }
    });
};
