var gulp  = require('gulp');
var staticfy  = require('../src/index');
var del    = require('del');
var _ = require('lodash');
var seq = require("gulp-sequence");
// 多语言列表
var langArr = ['', 'zh-cn', 'ja', 'en'];
var langTaskListMap = {};
var fileArr = [
    "src/simple.html",
    "src/simple2.html",
    "src/tmp/query_string.html"
];

gulp.task('clean', function(cb) {
    return del(['build'], cb);
});

// 批量注册任务
langArr.forEach(lang => {
    langTaskListMap[`${lang}-staticfy`] = gulp.task(`${lang}-staticfy`, function() {
        // 这边要指定路径，dest才会复制目录结构
        // 这边一定要return，不然就会变成异步，而不会同步
        return gulp.src(fileArr, {base: '.'})
            .pipe(staticfy({
                query_string: `lang=${lang}`
            }))
            .pipe(gulp.dest(`build/${lang}`));
    });
});

gulp.task('default', seq.apply(null,['clean'].concat( _.keys(langTaskListMap))));