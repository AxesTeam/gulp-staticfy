# gulp-staticfy
> Staticfy your website for gulp

## Usage

First, install `gulp-staticfy` as a development dependency:

```shell
npm install --save-dev gulp-staticfy
```

### Usage Examples

```js
gulp.task(`staticfy`, function() {
        return gulp.src('src/**/*.html')
            .pipe(staticfy({
                query_string: `lang=en`
            }))
            .pipe(gulp.dest('build'));
    });
```

### Options

#### options.query_string
Type: `String`
Default value: `''`

url query string

#### options.server_url
Type: `String`
Default value: `''`

the simple http server host
