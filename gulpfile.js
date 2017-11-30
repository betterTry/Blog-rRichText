'use strict'
var env = process.env.NODE_ENV || 'development';
var isDev = !(env === 'production');

var gulp = require('gulp');
var fs = require('fs');
var webpack = require('webpack-stream');
var webpackConfig = isDev ? require('./build/webpack.dev.conf') : require('./build/webpack.pro.conf');
var ora = require('ora');

var $ = require('gulp-load-plugins')();
var nodemon = require('gulp-nodemon');//---------------nodemon
var jshint = require('gulp-jshint');//-----------------jshint
var autoprefixer = require('gulp-autoprefixer');//-----autoprefixer
var sourcemaps = require('gulp-sourcemaps');//---------sourcemaps
var watch = require('gulp-watch');//-------------------watch

var minifycss = require('gulp-minify-css');//----------minify-css
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');//-----------------uglify
var pump = require('pump');//--------------------------pump;

var path = require('path');//--------------------------path
var clean = require('gulp-clean');//-------------------clean

var babelify = require('babelify');//------------------babelify
var watchify = require('watchify');//------------------watchify
var plumber = require('gulp-plumber');//---------------错误

var browserSync = require('browser-sync').create();//--browserSync
var reload = browserSync.reload;//---------------------reload


var log = function (content) {
	content = '\x1B[32m' + content.replace('/Users/yangshanglin/www/Blog-rRichText/', '');
	console.log('\x1B[33m------- ', content, '\x1B[33m -------');
}

var PATH = {
	entry: 'src/main.js',
	js: 'public/js',
	react: 'public/react'
}
gulp.task('default', ['browser-Sync'],function(){
})

// nodemon : reload server and run tasks(script&styles); (react任务取消)
gulp.task('nodemon', ['css', 'script', 'scriptES2015', 'webpack'], function(cb){
	var started = false;
	nodemon({
		script: 'app.js',
		ext: 'js pug css scss',
		env: {'NODE_ENV': 'development', 'PORT': 3100},
		ignore: ['node_modules/**', 'public/**', 'src/**'],
	})
	.on('start', function(){
		if(!started){
			cb();
			started = true;
		}
	})
	.on('restart', function() {
		setTimeout(reload, 2000);
	});
})

// watch
gulp.task('css', function(){

  gulp.src('src/css/**')
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('public/css'));
	gulp.watch('src/css/**', function(event){
		var _path = path.dirname(event.path.replace('src', 'public'));
		gulp.src(event.path)
			.pipe(plumber())
			.pipe(sass())
			.pipe(autoprefixer())
			.pipe(gulp.dest(_path));
		log(event.path);
	}).on('change', reload)
})
gulp.task('script', function() {
	gulp.src('src/js/!(login).js')
			.pipe(gulp.dest(PATH.js));
	gulp.watch('src/js/!(login).js', function(event){
		gulp.src(event.path)
			.pipe(gulp.dest(PATH.js));
		log(event.path);
	}).on('change', reload)

})


gulp.task('webpack', function(cb) {
	var start = false;
	var spinner = ora("yangsl's blog building...");
	spinner.start();
  var webpackhandler = function(err, stats) {
		spinner.stop();
		if (err) {
      throw err;
    }
		process.stdout.write(stats.toString({
	    colors: true,
	    modules: false,
	    children: false,
	    chunks: false,
	    chunkModules: false,
	  }) + '\n');
		isDev && browserSync.reload();
		if (isDev && !start) {
			cb();
			start = true;
		}
	};
	var webpackChangeHandler = isDev ? webpackhandler : null;
  var webpackEndHandler = isDev ? null : webpackhandler;

	return gulp.src('src/main.js')
		.pipe($.plumber())
		.pipe(webpack(webpackConfig, null, webpackhandler))
		.pipe(gulp.dest(PATH.react));
});

gulp.task('scriptES2015', function(){
	gulp.src('src/js/login.js')
			.pipe(babel({
				presets: ['es2015'],
			}))
			.pipe(gulp.dest(PATH.js));
	gulp.watch('src/js/login.js', function(event){
		gulp.src(event.path)
			.pipe(babel({
				presets: ['es2015'],
			}))
			.pipe(gulp.dest(PATH.js));
		log(event.path);
	}).on('change', reload)

})

gulp.task('browser-Sync', ['nodemon'], function(){
	setTimeout(function(){
		browserSync.init({
			proxy: 'localhost:3100',
			port: 3200
		})
	}, 3000)
})

//clean : clean public;
gulp.task('clean', function(){
	return gulp.src(['public/css/*', 'public/js/*', 'public/react/*'], {read: false})
		.pipe(clean());
})

gulp.task('compress', function (cb) {
  try {
    if (!fs.existsSync(PATH.react)) {
      fs.mkdirSync(PATH.react);
    }
  } catch(e) {
    // haha;
  }
  pump([
      gulp.src('public/react/*.js'),
      uglify(),
      gulp.dest(PATH.react)
    ],
    cb
  );
});
