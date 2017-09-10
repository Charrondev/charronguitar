const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

// Static Server + watching scss/html files
gulp.task("serve", ["sass"], function() {
    browserSync.init({
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });

    gulp.watch("src/scss/*.scss", ["sass"]);
    gulp.watch("dist/*.html").on("change", browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", function() {
    return gulp
        .src("src/scss/*.scss")
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("default", ["serve"]);
