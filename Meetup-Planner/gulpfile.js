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
	gulp.src(['./src/js/taffy.js','./src/js/knockout-3.4.0.js','./src/js/app.js'])
		// For JSLint, but knockout was reported too much error. 
		// So just commented out here.
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))	
		.pipe(concat('allJS.js'))
		.pipe(gulp.dest('./build/js'))
		.pipe(rename('allJS.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/js'));
});

gulp.task('css', function(){
    gulp.src(['./src/css/*.css'])
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/css'));
});