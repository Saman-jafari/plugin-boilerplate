import gulp from 'gulp'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer  from'gulp-autoprefixer'
import sassdoc  from 'sassdoc'
import babel from 'gulp-babel'
import buffer from 'vinyl-buffer'
import uglify from 'gulp-uglify'
import imagemin from 'gulp-imagemin';


//css part
let inputCss = './assets/**/*.scss';
let inputJs = './assets/**/*.js';
let output = './public/';
let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};
let sassdocOptions = {
    dest: './public/sassdoc'
};

let autoprefixerOptions = {
    browsers: ['last 4 versions', '> 5%', 'Firefox ESR']
};
gulp.task('sass', function(){
   return gulp
       .src(inputCss)
       .pipe(sass(sassOptions))
       .pipe(sourcemaps.write('./'))
       .pipe(autoprefixer(autoprefixerOptions))
       .pipe(gulp.dest(output))
       .pipe(sassdoc(sassdocOptions))
       .resume();
});
gulp.task('sassdoc', function () {
    return gulp
        .src(inputCss)
        .pipe(sassdoc(sassdocOptions))
        .resume();
});
gulp.task('watch', function() {
     gulp.watch(inputCss, ['sass']);
     gulp.watch(inputJs, ['js'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});
gulp.task('prod', ['sassdoc'], function () {
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
gulp.task('image',function () {
    gulp.src('assets/images/*')
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
gulp.task('default', ['sass', 'prod','js' ]);
