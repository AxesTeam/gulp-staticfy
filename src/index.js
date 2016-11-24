'use strict';

var gutil = require('gulp-util');
var path = require('path');
var phantom = require("phantom");
var SimpleServer = require('./server.js');
var map = require('map-stream');

module.exports = function(options) {
    var totalFileSize = 0;
    var finishFileSize = 0;
    var ph;
    var createPhPage = function(){
        if(ph){
            return ph.createPage();
        }else{
            return phantom.create().then(_ph => {
                ph = _ph;
                return ph.createPage();
            }).catch(e => {
                console.log(gutil.colors.red(e));
            })
        }
    };
    // close all http server
    var doAllFinish = () => {
        ph.exit();
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
            // custom server url
            var wwwDir = options.server_url || file.cwd;
            var baseName = path.relative(wwwDir, file.path);
            var url = 'http://localhost:{{port}}/';
            var query_string = options.query_string ? `?${options.query_string}` : '';
            console.log(gutil.colors.blue(`${baseName} loading ...`));
            SimpleServer.start(wwwDir, server => {
                // Replace {{port}} with server.port
                url = url.replace('{{port}}', server.port) + baseName + query_string;
                var ph_page;
                createPhPage().then(page => {
                    ph_page = page;
                    return ph_page.open(url);
                }).then(status => {
                    //console.log(status);
                    return ph_page.property('content')
                }).then(content => {
                    console.log(gutil.colors.blue(baseName) + gutil.colors.green(" load success"));
                    ph_page.close();
                    doFinish();
                    file.contents = new Buffer(content);
                    callback(null, file);
                }).catch(e => {
                    ph_page && ph_page.close();
                    doFinish();
                    console.log(e)
                });
            });
        }
    });
};
