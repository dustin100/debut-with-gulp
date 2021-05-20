const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sassPaths = [
	'node_modules/foundation-sites/scss',
	'node_modules/motion-ui/src',
];
const jsPaths = [];
// Sass task: compiles the style.scss file into style.css
function scssTask() {
	return src('./sass/styles.scss')
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(sass({includePaths: sassPaths }).on('error', sass.logError))
		.pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
		.pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
		.pipe(rename('theme.css'))
		.pipe(replace('"{{', '{{')) // remove the extra set of quotations used for escaping the liquid string
		.pipe(replace('}}"', '}}'))
		.pipe(
			dest('./assets/') // put final CSS in assets folder
		);
}
// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
	return src([
		'node_modules/jquery/dist/jquery.js',	
		'node_modules/foundation-sites/dist/js/foundation.js',
		'./js/**/*.js',
	])
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(concat('theme.js'))
		.pipe(uglify())
		.pipe(dest('./assets/'));
}
function watchTask() {
	// assumes your sass is in a directory named sass
	// assumes your javascript is in a directory named js
	watch(
		['./sass/**/*.scss', './js/**/*.js'],
		series(parallel(scssTask, jsTask))
	);
}
exports.default = series(parallel(scssTask, jsTask), watchTask);