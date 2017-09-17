'use strict'
var gulp = require('gulp');


var nodemon = require('gulp-nodemon');//---------------nodemon
var jshint = require('gulp-jshint');//-----------------jshint
var autoprefixer = require('gulp-autoprefixer');//-----autoprefixer
var sourcemaps = require('gulp-sourcemaps');//---------sourcemaps
var watch = require('gulp-watch');//-------------------watch
var browserSync = require('browser-sync').create();//--browserSync
var reload = browserSync.reload;//---------------------reload
var minifycss = require('gulp-minify-css');//----------minify-css
var sass = require('gulp-sass');
var babel = require('gulp-babel');

var uglify = require('gulp-uglify');//-----------------uglify
var pump = require('pump');//--------------------------pump;

var path = require('path');//--------------------------path

var clean = require('gulp-clean');//-------------------clean

var browserify = require('browserify');//--------------browserify
var babelify = require('babelify');//------------------babelify
var watchify = require('watchify');//------------------watchify
var streamify = require('gulp-streamify');//-----------streamify
var source = require('vinyl-source-stream');//---------vinyl-source-stream
var buffer = require('vinyl-buffer');//----------------vinyl-buffer
var plumber = require('gulp-plumber');//---------------错误


var env = process.env.NODE_ENV || 'development';

var log = function (content) {
	content = '\x1B[32m' + content.replace('/Users/yangshanglin/www/Blog-rRichText/', '');
	console.log('\x1B[33m------- ', content, '\x1B[33m -------');
}

var PATH = {
	entry: 'src/main.js',
	bundle: 'bundle.js',
	react: 'public/react'
}
gulp.task('default', ['browser-Sync'],function(){
})

// nodemon : reload server and run tasks(script&styles); (react任务取消)
gulp.task('nodemon', ['css', 'script', 'scriptES2015', 'react'], function(cb){
	var started = false;
	nodemon({
		script: 'app.js',
		ext: 'js pug css scss',
		env: {'NODE_ENV': 'development'},
		ignore: ['node_modules/**', 'public/**', 'src/**'],
	})
	.on('start', function(){
		if(!started){
			cb();
			started = true;
		}
	})
	.on('restart', function() {
		setTimeout(reload, 1000);
	});
})

// watch
gulp.task('css', function(){

  gulp.src('src/css/**')
		.pipe(autoprefixer())
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('public/css'));
	gulp.watch('src/css/**', function(event){
		var _path = path.dirname(event.path.replace('src','public'));
		gulp.src(event.path)
			.pipe(plumber())
			.pipe(autoprefixer())
			.pipe(sass())
			.pipe(gulp.dest(_path));
		log(event.path);
	}).on('change', reload)
})
gulp.task('script', function(){
	gulp.src('src/js/!(login).js')
			.pipe(gulp.dest('public/js'));
	gulp.watch('src/js/!(login).js', function(event){
		gulp.src(event.path)
			.pipe(gulp.dest('public/js'));
		log(event.path);
	}).on('change', reload)

})
gulp.task('scriptES2015', function(){
	gulp.src('src/js/login.js')
			.pipe(babel({
				presets: ['es2015'],
			}))
			.pipe(gulp.dest('public/js'));
	gulp.watch('src/js/login.js', function(event){
		gulp.src(event.path)
			.pipe(babel({
				presets: ['es2015'],
			}))
			.pipe(gulp.dest('public/js'));
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

// react
gulp.task('react', function(){
	var b = watchify(browserify({
		entries: [PATH.entry],
		transform: [
			[babelify, {presets: ["es2015", "react"], sourceMaps: true}]
		],
		debug: true,
		cache: {},
		packageCache: {}
	}), {delay: 1000});

	return b.on('update', function(file){
		b.bundle()
			.pipe(source(PATH.bundle))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(PATH.react));
		reload();
		file.forEach(function(value) {
			log(value);
		})
	})
	.bundle()
	.pipe(source(PATH.bundle))
	.pipe(gulp.dest(PATH.react));
});


//clean : clean public;
gulp.task('clean', function(){
	return gulp.src(['public/css/*', 'public/js/*', 'public/react/*'], {read: false})
		.pipe(clean());
})

gulp.task('compress', function (cb) {
  pump([
      gulp.src('public/react/*.js'),
      uglify(),
      gulp.dest('public/react')
    ],
    cb
  );
});
