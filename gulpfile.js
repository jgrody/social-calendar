var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var connect = require('gulp-connect')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var ngAnnotate = require('gulp-ng-annotate');
var rename = require("gulp-rename");
var streamify = require('gulp-streamify');

// configure paths for browserify
var cwd = process.cwd();
process.env.NODE_PATH = process.env.NODE_PATH || cwd + '/node_modules';
process.env.NODE_PATH += ":"+cwd+"/app";

gulp.task('connect', function() {
  connect.server({
    root: ['public'],
    port: 4000
  })
})

gulp.task('vendor', function() {
    return browserify('./app/vendor.js')
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest('./public/js/'));
  })

gulp.task('browserify', function() {
      // Grabs the app.js file
    return browserify('./app/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(streamify(ngAnnotate()))
    .pipe(gulp.dest('./public/js/'));
  })

gulp.task('sass', function() {
  return sass('sass/style.sass')
    .pipe(gulp.dest('public/css'))
})

gulp.task('copy', function(){
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./public'));
})

gulp.task('watch', function() {
  gulp.watch('app/**/*.js', ['browserify', 'copy']);
  gulp.watch('modules/**/*.js', ['browserify', 'copy']);
  gulp.watch('app/**/*.html', ['copy']);
  gulp.watch('sass/style.sass', ['sass']);
})

gulp.task('default', ['connect', 'copy', 'vendor', 'watch'])