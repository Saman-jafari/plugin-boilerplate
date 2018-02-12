
import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer  from'gulp-autoprefixer';
import babel from 'gulp-babel';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';

// input and out put define here
const inputCss = './app/assets/**/*.scss';
const inputJs = './app/assets/**/*.js';
const inputImages = './app/assets/images/**/*';
const output = './public/';

// options for plugins goes here
let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

let autoprefixerOptions = {
    browsers: ['last 4 versions', '> 5%', 'Firefox ESR']
};

// task are goes here


//css tasks
gulp.task('sass', function(){
   return gulp
       .src(inputCss)
       .pipe(sass(sassOptions))
       .pipe(sourcemaps.write('./'))
       .pipe(autoprefixer(autoprefixerOptions))
       .pipe(gulp.dest(output))
       .resume();
});
//js tasks
gulp.task('js', function () {
    return gulp
        .src(inputJs)
        .pipe(babel())
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify()) // Use any gulp plugins you want now
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output));
});
//media tasks
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


gulp.task('watch', function() {
     gulp.watch(inputCss, ['sass']);
     gulp.watch(inputJs, ['js'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});
gulp.task('prod',['image'], function () {
    gulp
        .src(inputCss)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output));
    gulp.src(inputJs)
        .pipe(babel())
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify()) // Use any gulp plugins you want now
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output));
});
gulp.task('default', ['prod']);
