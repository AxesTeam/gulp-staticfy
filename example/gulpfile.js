var gulp  = require('gulp');
var staticfy  = require('../src/index');
var del    = require('del');

var fileArr = [
    "src/simple.html",
    "src/simple2.html"
];

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

gulp.task('compress', ['clean'], function() {
  gulp.src(fileArr)
  .pipe(staticfy({

  }))
  .pipe(gulp.dest('build'));
});

gulp.task('default', ['compress']);