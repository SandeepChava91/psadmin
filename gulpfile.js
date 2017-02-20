"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local
var open = require('gulp-open'); //Open a URL in a web browser
var browserify = require('browserify'); //Bundles JS
var reactify = require('reactify'); // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // Use Conventional text streams with gulp
var concat = require('gulp-concat'); //Concats the css Files
var lint = require('gulp-eslint'); //lints the js files including JSX files

//Configuration variables
var config={
  port:9005,
  devBaseUrl:'http://localhost',
  paths:{
    html:'./src/*.html',
    js:'./src/**/*.js',
    css:[
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
      './src/*.css'
    ],
    images:'./src/images/*',
    dist:'./dist',
    mainJs:'./src/main.js'
  }
};

//Start a development server
gulp.task('connect',function(){
  connect.server({
    root:['dist'],
    port:config.port,
    base: config.devBaseUrl,
    livereload:true
  });
});

//Open the URL browser
gulp.task('open',['connect'],function () {
  gulp.src('dist/index.html')
    .pipe(open({uri:config.devBaseUrl+':'+config.port+'/'}));
});

//Move html from source to dist and reload
gulp.task('html',function () {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

//Handling JS fies
gulp.task('js',function () {
  browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
});

//Handline CSS File
gulp.task('css',function () {
  gulp.src(config.paths.css)
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.paths.dist+'/css'));
});

//Move images from source to dist and reload
gulp.task('images',function () {
  gulp.src(config.paths.images)
    .pipe(gulp.dest(config.paths.dist + '/images'))
    .pipe(connect.reload());

    //load fav icon
    gulp.src('./src/favicon.ico')
      .pipe(gulp.dest(config.paths.dist));
});

//Linting the Js
gulp.task('lint',function () {
  return gulp.src(config.paths.js)
    .pipe(lint({config:'.eslintrc'}))
    .pipe(lint.format());
})

//Watch Files and reload the browser
gulp.task('watch',function () {
  gulp.watch(config.paths.html,['html']);
  gulp.watch(config.paths.js,['js','lint']);
});

//Default tasks - linting pending
gulp.task('default',['html', 'js', 'css', 'images', 'lint', 'open', 'watch']);
