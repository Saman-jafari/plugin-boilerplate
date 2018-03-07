
import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer  from'gulp-autoprefixer';
import babel from 'gulp-babel';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import include from "gulp-include";
import browserSync from 'browser-sync';
// import useref from 'gulp-useref';
import del from 'del';
// import gulpIf from 'gulp-if';

// ------------------- input and out put define here--------------------------
const inputCss = './app/assets/**/*.scss';
const inputJs = './app/assets/**/*.js';
const inputImages = './app/assets/images/**/*';
const NotlibInput = '!./assets/js/lib/**/*.js';
const libInput = './assets/js/lib/*.js';
const outputLib = './public/js/lib/';

// const inputHTML = '*.html';
const inputFonts = './app/assets/fonts/**/*';
const output = './public/';

// ---------------------options for plugins goes here-------------------------
let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

let autoprefixerOptions = {
    browsers: ['last 4 versions', '> 5%', 'Firefox ESR']
};

let browserSyncCreate = browserSync.create();
gulp.task('browserSync', function() {
    browserSyncCreate.init({
        server: {
            //set index
            baseDir: './public/'
        },
        //uncomment for proxy
        // proxy: "127.0.0.1",

    })
});
// task are goes here

//css tasks
gulp.task('sass', function(){
   return gulp
       .src(inputCss)
       .pipe(sass(sassOptions))
       .pipe(sourcemaps.write('./'))
       .pipe(autoprefixer(autoprefixerOptions))
       .pipe(gulp.dest(output))
       .pipe(browserSync.reload({
           stream: true
       }))
       .resume();
});
//js tasks

/**
 * copy library files to output
 */

gulp.task('copyLib', function () {
    return gulp
        .src(libInput)
        .pipe(include({
            extensions: "js",
            hardFail: true,
            includePaths: [
                __dirname + "/node_modules"
            ]
        }))
        .pipe(gulp.dest(outputLib));
});
/**
 * transpile es6 to es5 library files to output
 * concat js include
 * uglify
 * export
 */
gulp.task("js", function () {
    console.log("-- gulp is running task 'scripts'");
    return gulp
        .src([inputJs, NotlibInput])
        .pipe(include({
            extensions: "js",
            hardFail: true,
            includePaths: [
                __dirname + "/node_modules"
            ]
        }))
        .on('error', console.log)
        .pipe(babel())
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(output));
});
//media tasks
/**
 * images optimization
 */
gulp.task('image',function () {
    gulp.src(inputImages)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })],{verbose: true
        }))
        .pipe(gulp.dest('public/images'))
});

/**
 * copy fonts to output
 */

gulp.task('fonts', function() {
    return gulp.src(inputFonts)
        .pipe(gulp.dest(output))
});

/**
 * watch the process live
 */

gulp.task('watch',['js', 'sass', 'copyLib','browserSync'], function() {
     gulp.watch(inputCss, ['sass',browserSync.reload]);
     gulp.watch(inputJs, ['js', browserSync.reload])
         //if your job is html uncomment this line
    // gulp.watch(inputHTML,browserSync.reload)
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});
gulp.task('clean:dist', function() {
    return del.sync(output);
});
//use this to concatenate html file css or js files
// gulp.task('useref', function(){
//     return gulp.src(inputHTML)
//         .pipe(useref())
//         .pipe(gulpIf('*.js', uglify()))
//         .pipe(gulp.dest(output))
// });
gulp.task('prod',['image'], function () {
    gulp
        .src(inputCss)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output));
    gulp.src([inputJs, NotlibInput])
        .pipe(include({
            extensions: "js",
            hardFail: true,
            includePaths: [
                __dirname + "/node_modules"
            ]
        }))
        .on('error', console.log)
        .pipe(babel())
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(output));
    gulp.src(libInput)
        .pipe(include({
            extensions: "js",
            hardFail: true,
            includePaths: [
                __dirname + "/node_modules"
            ]
        }))
        .pipe(gulp.dest(outputLib));
    //if you have html uncomment here
    // gulp.src(inputHTML)
    //     .pipe(useref())
    //     .pipe(gulpIf('*.js', uglify()))
    //     .pipe(gulp.dest(output))
});
gulp.task('default', ['prod']);
