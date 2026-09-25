const gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  sourcemaps = require('gulp-sourcemaps'),
  rtlcss = require('gulp-rtlcss'),
  rename = require('gulp-rename'),
  cached = require('gulp-cached'),
  { writeSocialIconsScss } = require('./lib/social-icons-scss')

function stylesBase (src, dest, cb) {
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest))
}

const stylesRoot = './src/scss/'
const rootStyles = [stylesRoot + 'style.scss']
const notRootStyles = rootStyles.map(path => '!' + path)

notRootStyles.unshift(stylesRoot + '**/*.scss')

function compileRootStyles (cb) {
  return stylesBase(rootStyles, './', cb)
}

function compileNotRootStyles (cb) {
  return stylesBase(notRootStyles, './dist/css/', cb)
}

function stylesRTL (cb) {
  return gulp.src(['style.css', './dist/css/**/*.css', '!./dist/css/**/*-rtl.css'], {base: './'})
    .pipe(cached('styles-rtl'))
    .pipe(rtlcss())
    .pipe(rename(function (path) { path.basename += '-rtl' }))
    .pipe(gulp.dest('.'))
}

stylesRTL.description = 'Generate style-rtl.css file based on style.css'

function watch (cb) {
  gulp.watch(['./src/scss/**/*.scss', './inc/social-icons.json'], compile)
}

function buildSocialIcons (cb) {
  writeSocialIconsScss()
  cb()
}

buildSocialIcons.description = 'Generate src/scss/setup/_social-icons.scss from inc/social-icons.json'

const compile = gulp.series(buildSocialIcons, gulp.parallel(compileRootStyles, compileNotRootStyles), stylesRTL)

gulp.task('build:social-icons', buildSocialIcons)
gulp.task('compile:styles', compile)
gulp.task('watch:styles', gulp.series(compile, watch))
