import {dest, parallel, series, src, watch} from "gulp";
import sass from "gulp-sass";
import sourceMaps from "gulp-sourcemaps";
import autoPrefix from "gulp-autoprefixer";
import buffer from "vinyl-buffer";
import uglify from "gulp-uglify";
import imageMin from "gulp-imagemin";
import include from "gulp-include";
import liveReload from "gulp-livereload";
import StripCommentsCss from "gulp-strip-css-comments";
import del from "del";
import browserSync from "browser-sync";
import config from "./configGulp";
import browserify from 'browserify';
import log from 'gulplog';
import babelify from 'babelify';
import tap from 'gulp-tap';
import eslint from 'gulp-eslint';
import styleLint from 'gulp-stylelint';

// ---------------------options for plugins goes here-------------------------


const server = browserSync.create();

//browser sync init -----start------
const reload = done => {
    server.reload();
    done();
};

/**
 * serve the browser sync
 * @param done
 */
const serve = done => {
    server.init({
        open: "external",
        host: config.ServerUrl,
        proxy: config.ServerUrl,
        port: 3000,
    });
    done();
};
//---------------End Browser sync---------------

// task are goes here

/**
 * delete the public folder
 * @returns {*}
 */
export const clean = () => del(["public"]);

//css tasks scss to css
export const sassFiles = done => {
    src(config.inputCss)
        .pipe(styleLint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }))
        .pipe(sass(config.sassOptions))
        .pipe(sourceMaps.write("./"))
        .pipe(autoPrefix(config.autoPrefixOptions))
        .pipe(StripCommentsCss({preserve: false}))
        .pipe(dest(config.output))
        .pipe(liveReload());
    done();
};

//copy lib from assets to public

export const copyLib = done => {
    src(config.libInput)
        .pipe(
            include({
                extensions: "js",
                hardFail: true,
                includePaths: [__dirname + "/node_modules"],
            }),
        )
        .pipe(dest(config.outputLib));
    done();
};

//copy lib from assets to public

export const copyLibAdmin = done => {
    src(config.libInputAdmin)
        .pipe(
            include({
                extensions: "js",
                hardFail: true,
                includePaths: [__dirname + "/node_modules"],
            }),
        )
        .pipe(dest(config.outputLibAdmin));
    done();
};

//js tasks es next to es5
export const eslintjs = () => {
    src(['assets/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        // Brick on failure to be super strict
        .pipe(eslint.results(results => {
            // Called once for all ESLint results.
            console.log(`Total Results: ${results.length}`);
            console.log(`Total Warnings: ${results.warningCount}`);
            console.log(`Total Errors: ${results.errorCount}`);
            if (results.warningCount > 0) {
                process.exit(0);
            }
        }))
        .pipe(eslint.failOnError());
    // transform file objects using gulp-tap plugin
};

export const js = done => {
    eslintjs();
    src('assets/**/[^_]*.js', {read: false}) // no need of reading file because browserify does.
        .pipe(tap(function (file) {

            log.info('bundling ' + file.path);

            // replace file contents with browserify's bundle stream
            file.contents = browserify(file.path, {debug: true})
                .transform(babelify, {presets: ["@babel/env"]})
                .bundle();

        }))
        // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
        .pipe(buffer())
        .pipe(uglify({mangle: false,}))
        .pipe(sourceMaps.init({loadMaps: true}))
        .pipe(sourceMaps.write("./"))
        .pipe(dest(config.output))
        .pipe(liveReload());
    done();
};

//media tasks minify images
export const image = done => {
    src(config.inputImages)
        .pipe(
            imageMin(
                [
                    imageMin.gifsicle({interlaced: true}),
                    imageMin.jpegtran({progressive: true}),
                    imageMin.optipng({optimizationLevel: 5}),
                    imageMin.svgo({
                        plugins: [{removeViewBox: true}, {cleanupIDs: false}],
                    }),
                ],
                {
                    verbose: true,
                },
            ),
        )
        .pipe(dest("public/images"));
    done();
};
//copy fonts
export const fonts = done => {
    src(config.inputFonts).pipe(dest(config.outputFonts));
    done();
};

//watcher for files
export const watchFiles = done => {
    liveReload.listen();
    watch(config.inputCss, parallel(sassFiles, reload));
    watch(config.inputJs, parallel(js, reload));
    watch(config.inputJs, parallel(copyLib, reload));
    watch(config.phpFiles, reload)
    //if your job is html uncomment this line
        .on("change", event => {
            console.log(event + " is changed running tasks...");
        });
    done();
};
export {watchFiles as watch};
export const build = series(clean, js, sassFiles, copyLib, copyLibAdmin, image, fonts);

//development env
export const dev = series(clean, build, serve, watchFiles);

export default build;
