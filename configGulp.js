module.exports = {
  //change for browsersync host
  ServerUrl: "127.0.0.1",
  // ------------------- input and out put define here--------------------------
  inputCss: "./assets/**/*.scss",
  inputJs: "./assets/**/*.js",
  inputImages: "./assets/images/**/*",
  NotlibInput: "!./assets/js/lib/**/*.js",
  NotlibInputAdmin: "!./assets/admin/lib/**/*",
  libInput: ["./assets/js/lib/*"],
  libInputAdmin: ["./assets/admin/lib/**/*"],
  inputFonts: "./assets/fonts/**/*",
  outputFonts: "./public/fonts/",
  output: "./public/",
  outputLib: "./public/js/lib/",
  outputLibAdmin: "./public/admin/lib/",
  phpFiles: "./app/**/*.php",
  //sass options
  sassOptions: {
    errLogToConsole: true,
    // outputStyle: 'expanded',
    outputStyle: "compressed",
  },
  //auto prefix options
  autoPrefixOptions: {
    browsers: [
      "last 4 versions",
      "> 5%",
      "Firefox ESR",
    ],
  },
};