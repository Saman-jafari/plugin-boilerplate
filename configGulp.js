
export default {
    // change for browsersync host
    ServerUrl: 'localhost',
    ProxyUrl: 'localhost',
    Port: '3000',
    // ------------------- input and out put define here--------------------------
    inputCss: './assets/**/*.scss',
    inputJs: './assets/**/*.js',
    inputJsWithoutUnderScores: './assets/**/[^_]*.js',
    inputImages: './assets/images/**/*',
    NotlibInput: '!./assets/js/lib/**/*.js',
    NotlibInputAdmin: '!./assets/admin/lib/**/*',
    libInput: ['./assets/js/lib/*'],
    libInputAdmin: ['./assets/admin/lib/**/*'],
    inputFonts: './assets/fonts/**/*',
    outputFonts: './public/fonts/',
    output: './public/',
    outputLib: './public/js/lib/',
    outputLibAdmin: './public/admin/lib/',
    outputForManifest: ['./public/**/*.js',
        './public/**/*.css',
        './public/**/*.{jpg,png,jpeg,gif,svg}',
        './public/**/*.{tff,otf,woff,woff2,eot}'
    ],
    phpFiles: './app/**/*.php',
    // sass options
    sassOptions: {
        errLogToConsole: true,
        // outputStyle: 'expanded',
        outputStyle: 'compressed'
    },
    // auto prefix options
    autoPrefixOptions: {
        browsers: [
            'last 4 versions',
            '> 5%',
            'Firefox ESR'
        ]
    },
    collect: {
        src: [
            './public/manifest.json',
            './public/**/*.{css,js}'
        ]
    }
};