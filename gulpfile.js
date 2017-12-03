const gulp = require("gulp");
const babel = require("babelify");
const watchify = require("watchify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const fs = require("fs");

function swallowError(error) {
    // If you want details of the error in the console
    console.log(error.toString());

    this.emit("end");
}

function compile(watch) {
    var bundler = watchify(
        browserify("./src/js/app.js", { debug: true }).transform(babel)
    );

    function rebundle() {
        bundler
            .bundle()
            .on("error", swallowError)
            .pipe(source("app.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist/js"));
    }

    if (watch) {
        bundler.on("update", function() {
            console.log("-> bundling...");
            rebundle();
            browserSync.reload();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
}

gulp.task("bundle", () => compile());

gulp.task("bundle-watch", () => watch());

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", () => {
    return gulp
        .src("src/scss/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", swallowError)
        .pipe(postcss([autoprefixer()]))
        .pipe(cssnano())
        .pipe(gulp.dest("build"))
        .pipe(browserSync.stream())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/css"));
});

gulp.task("watch", ["sass", "bundle"], () => {
    browserSync.init({
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });

    gulp.watch("src/js/*.js", ["bundle"]);
    gulp.watch("src/scss/*.scss", ["sass"]);
    gulp.watch("dist/*.html").on("change", browserSync.reload);
});

gulp.task("inline", ["sass"], () => {
    // in your task
    return gulp
        .src("./dist/index.html")
        .pipe(
            replace(`<link rel="stylesheet" href="css/app.css">`,
                s => {
                    const style = fs.readFileSync("./dist/css/app.css", "utf8");
                    return "<style>\n" + style + "\n</style>";
                }
            )
        )
        .pipe(rename("index-inline.html"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["watch"], () => {
    process.exit();
});

gulp.task("build", ["bundle", "inline"], () => {
    process.exit();
});
