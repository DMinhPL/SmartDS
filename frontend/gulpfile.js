var autoprefix = require("gulp-autoprefixer");
var babel = require('gulp-babel');
var browserSync = require("browser-sync").create();
var cleanCSS = require('gulp-clean-css');
var concat = require("gulp-concat");
var del = require("del");
var gulp = require("gulp");
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require("gulp-uglify");
var debug = require('gulp-debug');
var watch = require('gulp-watch');
var purgecss = require('gulp-purgecss');

var PORT = 3000;
var VERSION = '3.2.5';
var SRC = {
    root: "src",
    pug: "/pug",
    pug_watch: "",
    css: "/sass",
    js: "/js",
    img: "/images",
    private: "/private",
    building: false,
};

var DIST = {
    clean: ["dist"],
    root: "dist",
    pug: "",
    css: "/assets/css",
    js: "/assets/js",
    img: "/images",
    assets: "/assets"
}

// Clear all
var _clean = function () {
    return del(DIST.clean);
};
var _browser_sync = function () {
    return browserSync.init({
        server: {
            baseDir: './dist',
            serveStaticOptions: { extensions: ["html"] }
        },
        startPath: SRC.pug_watch,
        port: PORT,
        notify: false,
        timestamps: true,
        files: [
            // DIST.root + SRC.pug_watch + "/**/*.html",
            DIST.root + DIST.css + "/*.css",
            "!" + DIST.root + DIST.css + "/*.min.css",
            DIST.root + DIST.js + "/*.js",
        ]
    });
};
var _pug = function (obj) {
    var listDefault = [
        SRC.root + SRC.pug + SRC.pug_watch + '/**/*.pug',
        "!" + SRC.root + SRC.pug + '/**/_*.pug',
        "!" + SRC.root + SRC.pug + "/build/**/*.pug",
        "!" + SRC.root + SRC.pug + "/components/**/*.pug",
        "!" + SRC.root + SRC.pug + "/layouts/**/*.pug",
    ];
    process.env.npm_lifecycle_event != "start:doc" ? listDefault.push("!" + SRC.root + SRC.pug + "/docs/**/*.pug") : '';
    return gulp
        .src((obj !== undefined && obj.path !== undefined) ? obj.path : listDefault, { base: SRC.root + SRC.pug + SRC.pug_watch, allowEmpty: true })
        .pipe(plumber({ errorHandler: function (err) { console.log(err); } }))
        .pipe(debug({ title: '[HTML] ', showCount: SRC.building, showFiles: true }))
        .pipe(pug({ pretty: '    ' }))
        .pipe(gulp.dest(DIST.root + DIST.pug + SRC.pug_watch))
        .on('end', () => browserSync.reload());
};
var _sass = function () {
    return gulp
        .src([
            SRC.root + SRC.css + '/*.scss',
            "!" + SRC.root + SRC.css + '/_*.scss'
        ])
        .pipe(sourcemaps.init())
        .pipe(debug({ title: '[CSS]  ', showCount: SRC.building, showFiles: true }))
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefix(["last 2 versions", "> 5%", "Firefox ESR"]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST.root + DIST.css))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        // .pipe(concat(PATH.scss+"/"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(DIST.root + DIST.css));
};
var _purgecss = function () {
    var home_file = gulp.src(DIST.root + DIST.css + '/styles_homepage.min.css')
        .pipe(purgecss({ content: [DIST.root + '/index.html', DIST.root + DIST.js + '/main.js', DIST.root + DIST.js + '/library_homepage.js'], rejected: false, whitelistPatterns: [/tooltip/] }))
        .pipe(gulp.dest(DIST.root + DIST.css));
    var page_file = gulp.src(DIST.root + DIST.css + '/styles.min.css')
        .pipe(purgecss({ content: [DIST.root + '/**/*.html', "!" + DIST.root + '/index.html', DIST.root + DIST.js + '/pages.js', DIST.root + DIST.js + '/library.js'], rejected: false, whitelistPatterns: [/tooltip/] }))
        .pipe(gulp.dest(DIST.root + DIST.css));
    return merge(home_file, page_file);
}
var _scripts_library = function () {
    var main_file = gulp
        .src([
            SRC.root + SRC.js + "/library/jquery-3.3.1.min.js",
            SRC.root + SRC.js + "/library/imagesloaded.min.js",
            // SRC.root + SRC.js + "/library/moment.min.js",
            // SRC.root + SRC.js + "/library/popper.min.js",
            SRC.root + SRC.js + "/library/*.main.min.js",
        ])
        // .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(debug({ title: '[MLJS] ', showCount: SRC.building, showFiles: true }))
        .pipe(uglify().on('error', function (e) { console.log(e); }))
        .pipe(concat("library.js"))
        .pipe(gulp.dest(DIST.root + DIST.js));

    var home_file = gulp
        .src([
            SRC.root + SRC.js + "/library/jquery-3.3.1.min.js",
            SRC.root + SRC.js + "/library/imagesloaded.min.js",
            // SRC.root + SRC.js + "/library/moment.min.js",
            // SRC.root + SRC.js + "/library/popper.min.js",
            SRC.root + SRC.js + "/library/*.home.main.min.js",
        ])
        // .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(debug({ title: '[HLJS] ', showCount: SRC.building, showFiles: true }))
        .pipe(uglify().on('error', function (e) { console.log(e); }))
        .pipe(concat("library_homepage.js"))
        .pipe(gulp.dest(DIST.root + DIST.js));
    return merge(main_file, home_file);
};

var _scripts_main = function () {
    var main_file = gulp
        .src([
            SRC.root + SRC.js + "/common.js",
            SRC.root + SRC.js + "/pages.js",
            SRC.root + SRC.js + "/*.js",
            "!" + SRC.root + SRC.js + "/main.js",
        ])
        .pipe(debug({ title: '[MPJS] ', showCount: SRC.building, showFiles: true }))
        .pipe(babel({ presets: ['@babel/env'] }))
        // .pipe(uglify().on('error', function (e) { console.log(e); }))
        .pipe(concat("pages.js"))
        .pipe(gulp.dest(DIST.root + DIST.js));
    var home_file = gulp
        .src([
            SRC.root + SRC.js + "/common.js",
            SRC.root + SRC.js + "/main.js",
        ])
        .pipe(debug({ title: '[MHJS] ', showCount: SRC.building, showFiles: true }))
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(uglify().on('error', function (e) { console.log(e); }))
        .pipe(concat("main.js"))
        .pipe(gulp.dest(DIST.root + DIST.js));
    return merge(main_file, home_file);
};

var _copyfile = function (obj) {
    var listDefault = [SRC.root + SRC.private + "/manifest.json", SRC.root + SRC.private + "/**/**.*"];
    var private_file = gulp
        .src((obj !== undefined && obj.path !== undefined) ? obj.path : listDefault, { base: SRC.root + SRC.private, allowEmpty: true })
        .pipe(debug({ title: '[PFILE]', showCount: SRC.building, showFiles: true }))
        .pipe(gulp.dest(DIST.root + DIST.assets))
        .on('end', () => browserSync.reload());
    var build_data_file = gulp
        .src(SRC.root + SRC.pug + "/build/data/**/**.*")
        .pipe(debug({ title: '[BFILE]', showCount: SRC.building, showFiles: true }))
        .pipe(gulp.dest(DIST.root + DIST.assets + "/build/data"))
        .on('end', () => browserSync.reload());
    return merge(private_file, build_data_file);
}

var _imagemin = function (obj) {
    var listDefault = [SRC.root + SRC.img + "/**/**.*"];
    return gulp
        .src((obj !== undefined && obj.path !== undefined) ? obj.path : listDefault, { base: SRC.root + SRC.img, allowEmpty: true })
        .pipe(debug({ title: '[IMG]  ', showCount: SRC.building, showFiles: true }))
        .pipe(imagemin())
        .pipe(gulp.dest(DIST.root + DIST.img))
        .on('end', () => browserSync.reload());
}

// var _reload = function (done) {
//     browserSync.reload();
//     return done();
// }

var _watch = function () {
    watch([
        SRC.root + SRC.pug + SRC.pug_watch + '/**/*.pug',
        SRC.root + SRC.pug + '/components/**/*.pug',
        SRC.root + SRC.pug + '/layouts/**/*.pug'
    ], obj => obj.path.match(/[-_\w]+[.][\w]+$/i)[0].indexOf('_') == 0 ? _pug() : _pug(obj));
    watch([SRC.root + SRC.css + '/**/*.scss'], _sass);
    watch([SRC.root + SRC.js + '/library/*.min.js'], _scripts_library);
    gulp.watch([SRC.root + SRC.js + '/*.js'], _scripts_main);
    // Bonus image & copy file
    watch([SRC.root + SRC.img + '/**/*.*'], obj => obj.path.match(/[-_\w]+[.][\w]+$/i)[0].indexOf('_') == 0 ? _imagemin() : _imagemin(obj));
    watch([SRC.root + SRC.private], obj => obj.path.match(/[-_\w]+[.][\w]+$/i)[0].indexOf('_') == 0 ? _copyfile() : _copyfile(obj));
    console.log("\x1b[31m\x1b[1m\n================== \t COREFE: " + VERSION + " / START PORT: " + PORT + " \t ================== \n\x1b[0m");
}

var _build = function () {
    SRC.pug_watch = "";
    SRC.building = true;
    return del(DIST.clean);
}


/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports._clean = _clean;
exports._sass = _sass;
exports._pug = _pug;
exports._scripts_library = _scripts_library;
exports._scripts_main = _scripts_main;
exports._copyfile = _copyfile;
exports._imagemin = _imagemin;
exports._purgecss = _purgecss;

/*
 * Return the task when a file changes
 */
exports.watch = gulp.series(
    _clean,
    gulp.parallel(_sass, _scripts_library, _scripts_main, _pug),
    _purgecss,
    gulp.parallel(
        gulp.parallel(_browser_sync, _watch),
        gulp.parallel(_copyfile, _imagemin)
    ),
);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = gulp.series(
    _build,
    // gulp.parallel([_pug, _sass, _scripts_library, _scripts_main, _copyfile, _imagemin])
    gulp.parallel([_sass, _scripts_library, _scripts_main, _pug]),
    _purgecss,
    gulp.parallel([_copyfile, _imagemin])
);
