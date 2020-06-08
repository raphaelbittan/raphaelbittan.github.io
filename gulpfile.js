require('dotenv').config({ debug: process.env.DOTENV_DEBUG });
var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
const { spawn } = require('child_process');
var imagemin = require('gulp-imagemin');
const format = require('gulp-format-md');
var browserSync = require('browser-sync');
var sync = require('gulp-npm-script-sync');
const htmlmin = require('gulp-htmlmin');
var del = require("del");

// var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'bundle exec jekyll';
var bundleExecJekyllCommand = `bundle exec jekyll`; // JEKYLL_ENV=${process.env.JEKYLL_ENV}
var bundleInstallCommand = 'bundle install';
var bundleExecAlgoliaCommand = `ALGOLIA_API_KEY=${process.env.ALGOLIA_API_KEY} bundle exec jekyll algolia --verbose`
var bundleExecHTMLProoferCommand = `bundle exec htmlproofer --assume-extension ./_site --file-ignore "*.xml,README.md,LICENSE" --log-level ${process.env.HTML_PROOFER_LOG_LEVEL} --http-status-ignore '999' --only-4xx --check-html --check-opengraph --check-favicon --timeframe "1d" --trace`;
var manifestGenerateCommand = 'python scripts/createManifestJSON.py'
var swGenerateCommand = 'workbox generateSW workbox-config.js'

/*
 * Install missing Gems
 */
gulp.task('gems', function (done) {
  return spawn(bundleInstallCommand, {stdio: 'inherit', shell: true}).on('close', done);
});

/*
 * Install Manifest
 */
gulp.task('manifest', function (done) {
  return spawn(manifestGenerateCommand, {stdio: 'inherit', shell: true}).on('close', done);
});

/*
 * Install ServiceWorker
 */
gulp.task('service-worker', function (done) {
  return spawn(swGenerateCommand, {stdio: 'inherit', shell: true}).on('close', done);
});

/*
 * Delete Assets Folder
 */
gulp.task("assets-clean", function () {
  return del("assets");
});

/*
 * Delete Node Modules Folder
 */
gulp.task("modules-clean", function () {
  return del("node_modules");
});

/*
 * Clean the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-clean', function (done) {
  return spawn(bundleExecJekyllCommand, ['clean'], {stdio: 'inherit', shell: true}).on('close', done);
});

/*
 * Build the Jekyll Site for Development or Production purpose
 */
gulp.task('jekyll-build', function (done) {
  return spawn(bundleExecJekyllCommand, ['build'], {stdio: 'inherit', shell: true}).on('close', done);
});

/*
 * Build the Algolia Index
 */
gulp.task('jekyll-algolia', function (done) {
  return spawn(bundleExecAlgoliaCommand, {stdio: 'inherit', shell: true}).on('close', done);
});

/*
 * Test Site with HTMLProofer
 */
gulp.task('htmlproofer', function (done) {
  return spawn(bundleExecHTMLProoferCommand, {stdio: 'inherit', shell: true}).on('close', done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task('jekyll-rebuild', gulp.series(['jekyll-clean', 'jekyll-build'], function (done) {
  browserSync.reload();
  done();
}));

/*
 * Synchronizes between Gulp Tasks and package.json Saves the modification as is
 */
gulp.task('script-sync', function(done) {
  sync(gulp);
  done();
});

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task('browser-sync', function(done) {
  browserSync.init({
    server: {
      baseDir: '_site'
    }
  });
  done();
});


/*
* Compile and minify sass
*/
gulp.task('scss', function() {
  return gulp.src('src/styles/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('assets/css/'))
});

/*
* Compile css
*/
gulp.task('css', function() {
  return gulp.src('src/styles/**/*.{css,map}')
    .pipe(gulp.dest('assets/css/'))
});

/*
* Compile fonts
*/
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(plumber())
    .pipe(gulp.dest('assets/fonts/'))
});

/*
 * Minify HTML
 */
// gulp.task('htmlmin', () => {
//   return gulp.src('*.html')
//     .pipe(htmlmin({ collapseWhitespace: true }))
//     .pipe(gulp.dest('dist'));
// });

/*
 * Minify images
 */
gulp.task('imagemin', function() {
  return gulp.src('src/img/**/*.{ico,jpeg,jpg,png,pdf}')
    .pipe(plumber())
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('assets/img/'))
});

/*
 * Compile Markdowns
 */
gulp.task('format-md', function() {
  return gulp.src('src/md/**/*.md')
    .pipe(format({ newline: false }))
    .pipe(gulp.dest('assets/md/'))
});

/**
 * Compile and minify Particle js
 */
gulp.task('particle', function() {
  return gulp.src('src/js/particle.js')
    .pipe(plumber())
    .pipe(concat('particle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
});

/**
 * Compile and minify ie10-viewport-bug-workaround js
 */
gulp.task('ie10-viewport-bug-workaround', function() {
  return gulp.src('src/js/ie10-viewport-bug-workaround.js')
    .pipe(plumber())
    .pipe(concat('ie10-viewport-bug-workaround.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
});

/**
 * Compile and minify Repositories js
 */
gulp.task('repositories', function() {
  return gulp.src('src/js/repositories.js')
    .pipe(plumber())
    .pipe(concat('repositories.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
});

/**
 * Compile and minify PrettyDate js
 */
gulp.task('prettydate', function() {
  return gulp.src('src/js/prettydate.js')
    .pipe(plumber())
    .pipe(concat('prettydate.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
});

/**
 * Compile ReadingTime js
 */
gulp.task('readingtime', function() {
  return gulp.src('src/js/readingtime.js')
    .pipe(gulp.dest('assets/js/'))
});

/**
 * Compile and minify Comment js
 */
gulp.task('comment', function() {
  return gulp.src('src/js/comment.js')
    .pipe(plumber())
    .pipe(concat('comment.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
});

/**
 * Compile and minify Animate js
 */
gulp.task('animate', function() {
  return gulp.src('src/js/animate.js')
    .pipe(plumber())
    .pipe(concat('animate.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
});

/**
 * Compile Lazysizes js
 */
gulp.task('lazysizes', function() {
  return gulp.src('src/js/lazysizes.min.js')
    .pipe(gulp.dest('assets/js/'))
});

/**
 * Compile and minify language-redirect js
 */
gulp.task('language-redirect', function() {
  return gulp.src('src/js/language-redirect.js')
    .pipe(plumber())
    .pipe(concat('language-redirect.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
});

/*
 * Handle all JS
 */
gulp.task('js', gulp.series(['particle', 'ie10-viewport-bug-workaround', 'repositories', 'prettydate', 'readingtime', 'comment', 'animate', 'language-redirect', 'lazysizes'], function(done) {
  done()
}));

/*
 * Handle all CSS
 */
gulp.task('sass', gulp.series(['scss', 'css', 'fonts'], function(done) {
  done()
}));


gulp.task('watch', function() {
  gulp.watch('gulpfile.js', gulp.series(['jekyll-rebuild']));
  gulp.watch('src/styles/**/*.scss', gulp.series(['sass', 'jekyll-rebuild']));
  gulp.watch('src/styles/**/*.{css,map}', gulp.series(['css', 'jekyll-rebuild']));
  gulp.watch('src/js/**/*.js', gulp.series(['js', 'jekyll-rebuild']));
  gulp.watch('src/fonts/**/*.{eot,svg,tff,woff,woff2}', gulp.series(['fonts', 'jekyll-rebuild']));
  gulp.watch('src/img/**/*.{jpeg,jpg,png,pdf}', gulp.series(['imagemin', 'jekyll-rebuild']));
  gulp.watch('src/md/**/*.md', gulp.series(['format-md', 'jekyll-rebuild', 'jekyll-algolia']));
  gulp.watch('Gemfile', gulp.series(['gems', 'jekyll-rebuild']));
  gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', 'projects/*.html', '_config.yml', '_posts/*.md'], gulp.series(['jekyll-rebuild']));
});

gulp.task('development', gulp.series(['assets-clean', 'jekyll-clean', 'gems', 'js', 'sass', 'imagemin', 'format-md', 'manifest', 'jekyll-build', 'service-worker', 'jekyll-algolia', 'browser-sync', 'watch']));
gulp.task('production', gulp.series(['assets-clean', 'jekyll-clean', 'gems', 'js', 'sass', 'imagemin', 'format-md', 'manifest', 'jekyll-build', 'service-worker', 'jekyll-algolia']))
