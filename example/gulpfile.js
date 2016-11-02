var gulp  = require('gulp');
var staticfy  = require('../src/index');
var del    = require('del');

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

gulp.task('compress', ['clean'], function() {
  gulp.src('src/simple.html')
          .pipe(staticfy({

          }))
          .pipe(gulp.dest('build'));
});

gulp.task('default', ['compress']);