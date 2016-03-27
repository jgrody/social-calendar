var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var connect = require('gulp-connect')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var ngAnnotate = require('gulp-ng-annotate');
var rename = require("gulp-rename");
var streamify = require('gulp-streamify');
var cachebust = require('gulp-cache-bust');
// var livereload = require('gulp-livereload');

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

gulp.task('cachebust', function(){
  gulp.src('./public/**/*.html')
  .pipe(cachebust({type: 'timestamp'}))
  .pipe(gulp.dest('./public'));
})

gulp.task('bootstrap', function(){
  return gulp.src('node_modules/bootstrap/dist/css/bootstrap.css')
    .pipe(rename('bootstrap.scss'))
    .pipe(gulp.dest('sass'))
})

gulp.task('calendar', function(){
  return gulp.src('node_modules/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css')
    .pipe(rename('angular-bootstrap-calendar.scss'))
    .pipe(gulp.dest('sass'))
})

gulp.task('browserify', function() {
      // Grabs the app.js file
    return browserify('./app/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(streamify(ngAnnotate()))
    .pipe(gulp.dest('./public/js/'))
  })

gulp.task('sass', function() {
  return sass('sass/style.sass', {
    loadPath: ['./sass', './modules', './node_modules']
  })
  .on('error', sass.logError)
  .pipe(gulp.dest('public/css'))
  // .pipe(livereload())
})

gulp.task('copy', function(){
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./public'))
    // .pipe(livereload())
})

gulp.task('watch', function() {
  // livereload.listen();
  gulp.watch([
    'app/**/*.js',
    'app/**/*.html',
    'modules/**/*.js',
    'modules/**/*.html'
  ], ['browserify', 'copy']);

  gulp.watch('sass/**/*.sass', ['sass']);

})

gulp.task('default', [
  'connect',
  'copy',
  'bootstrap',
  'calendar',
  'watch'
])