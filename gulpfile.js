const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const terser = require("terser");
const imagemin = require("imagemin");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () =>{
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/menu.js")
  .pipe(terser())
  .pipe(rename("menu.minify.js"))
  .pipe(gulp.dest("build/js"))
  .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const optimimizeImages = () => {
  return gulp.src("source/img/**/*/.{png,jpg,svg}")
  .pipe(imagemin ([
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimisationLevel: 3}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("source/img"))
}

exports.images = optimizeImages;

const copyImages = () => {
  return.gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(gulp.dest("source/img"))
}

exports.images = copyImages;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);
