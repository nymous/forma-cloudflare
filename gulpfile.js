var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var mustache = require('gulp-mustache');
var del = require('del');
var browserSync = require('browser-sync');
var download = require('gulp-download-stream');

const paths = {
  htmlSrc: 'src/index.html',
  mdSrc: 'src/presentation.md',
  assetsDir: 'assets',
  jsDir: 'assets/js',
  imgDir: 'assets/img',
  distDir: 'dist',
}

gulp.task('compileHtml', function () {
  return gulp.src(paths.htmlSrc)
    .pipe(mustache())
    .pipe(gulp.dest(paths.distDir));
});

gulp.task('copyAssets', function() {
    return gulp.src(paths.assetsDir + '/**/*')
      .pipe(gulp.dest(paths.distDir + '/assets'));
});

gulp.task('build',['compileHtml', 'copyAssets'], function() {
    return;
});

gulp.task('md-watch',['build'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('watch',['build'], function() {
    browserSync.init(paths.distDir + '/**/*', {
      server: {
        baseDir: paths.distDir
      }
    });

    gulp.watch(paths.mdSrc, ['md-watch']);
});

gulp.task('deploy', ['build'], function() {
  return gulp.src(paths.distDir +  '/**/*')
    .pipe(ghPages());
});

gulp.task('updateRemark', function() {
    download({
      file: 'remark.min.js',
      url: 'https://gnab.github.io/remark/downloads/remark-latest.min.js',
    })
      .pipe(gulp.dest(paths.jsDir));
});

gulp.task('clean', function() {
    del([
        paths.distDir
      ]);
});
