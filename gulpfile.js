var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');	


// Default task
gulp.task('default',['scripts','css'], function() {

});



// JS check, concat and minify scripts
gulp.task('scripts', function(){
	gulp.src(['./src/js/lib/*.js','./src/js/app.js'])
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))	
		.pipe(concat('allJS.js'))
		.pipe(gulp.dest('./build/js'))
		.pipe(rename('allJS.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/js'));
});

gulp.task('css', function(){
    gulp.src(['./src/css/lib/*.css', './src/css/style.css'])
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/css'));
});