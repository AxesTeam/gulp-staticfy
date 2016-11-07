var gulp  = require('gulp');
var staticfy  = require('../src/index');
var del    = require('del');
var _ = require('lodash');
var seq = require("gulp-sequence");
// �������б�
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

// ����ע������
langArr.forEach(lang => {
    langTaskListMap[`${lang}-staticfy`] = gulp.task(`${lang}-staticfy`, function() {
        // ���Ҫָ��·����dest�ŻḴ��Ŀ¼�ṹ
        // ���һ��Ҫreturn����Ȼ�ͻ����첽��������ͬ��
        return gulp.src(fileArr, {base: '.'})
            .pipe(staticfy({
                query_string: `lang=${lang}`
            }))
            .pipe(gulp.dest(`build/${lang}`));
    });
});

gulp.task('default', seq.apply(null,['clean'].concat( _.keys(langTaskListMap))));