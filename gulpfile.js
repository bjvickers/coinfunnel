'use strict'

const appRootPath = require('app-root-path')
const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const cleanCSS = require('gulp-clean-css')
const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const path = require('path')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const util = require('gulp-util')

const buildJSTask = () => {
  const files = [
    `${appRootPath}/src/interface/assets/javascripts/index.js`
  ]

  return files.map((fileName) => {
    browserify({ entries: [ fileName ] }) // Initalise browserify
      .transform('babelify', { presets: ['es2015'] })
      .bundle() // Combine javascripts used by entry
      .pipe(source(fileName)) // Convert the combined javascripts to a text stream
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename({
        // Rename the text stream postfix
        dirname: '.',
        extname: '.bundle.js' 
      }))
      .pipe(gulp.dest(`${appRootPath}/src/interface/public/javascripts`))
    })
}

const buildCSSTask = () => {
  return gulp.src(`${appRootPath}/src/interface/assets/stylesheets/index.less`)
    .pipe(less({
      paths: [ `${appRootPath}/node_modules/` ]
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(`${appRootPath}/src/interface/public/stylesheets`))
}

gulp.task('default', [ 'buildJS', 'buildCSS' ])
gulp.task('buildJS', buildJSTask)
gulp.task('buildCSS', buildCSSTask)
