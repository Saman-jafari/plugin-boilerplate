wordpress development automation with gulp; 

**Plugins** :

- gulp 4
- Sass
- autoprefixer
- Babel 7
- uglify
- sourcemaps
- composer
- npm
- image minification
- gulp-include
- browserSync
- gulp LiveReload
- manifest
- eslint
- styleLint

###Start From here
`git clone` from files then `npm install` and `composer install` and `npm run autoload` if 
error arise `npm run autoloadw@php` if error arise install latest version composer 
then close all IDE or editors and try again then in gulp file change ServerUrl var to your 
local host name then `npm start` then you can use commands have fun hacking!


####**Commands**:<br>
Auto loads
- `npm run aloadphp` same as `php composer dump-autoload -o` generate autoload composer file
- `npm run aload` same as `composer dump-autoload -o` generate autoload composer file without calling php
- `php composer dump-autoload -o`do this after every new class so you dont need to add `indlude`and`require` to get all autoload in composer

Development Start 
- `npm start` run dev server change destination for server in gulp file
- `gulp dev` same as `npm start`

Production Build
- `npm run build` build a production ready file and will put it in public folder
- `gulp` and `gulp build` make files ready for production same as `npm run build`
- `npm run build:production` make files ready for production with hash for cache

Other Commands
- `gulp js` transpile es next to es5
- `gulp sassFiles` compile sass
- `gulp image` minify the images
- `gulp fonts` optimize and move fonts to public folder
- `gulp clean` delete public folder
- `gulp copyLib` copy libraries from assets to public folder
- `gulp copyLibAdmin` copy libraries from assets to public folder for admin gui

assets are contain `css` , `js` , `images`, `fonts` that will be compile to public folder never change public folder
`js` is in ES6
`css` is in SCSS