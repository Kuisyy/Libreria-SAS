import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import browserSyncPkg from 'browser-sync';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

const browserSync = browserSyncPkg.create();
const sass = gulpSass(dartSass);

// Carpeta de salida
const paths = {
    scss: {
        src: 'scss/**/*.scss',
        main: ['scss/index.scss', 'scss/tienda.scss'],
        dest: 'css' // Solo se generará el CSS normal
    },
    html: {
        src: '*.html'
    }
};

// Tarea para compilar SCSS
function compileSass() {
    return gulp.src(paths.scss.main)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Error SCSS',
                message: '<%= error.message %>'
            })
        }))
        .pipe(sass({
            outputStyle: 'expanded' // ⬅️ No minificado
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest(paths.scss.dest)) // ⬅️ Solo CSS normal
        .pipe(browserSync.stream());
}

// Servidor de desarrollo
function serve() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 3000,
        open: true,
        notify: false
    });

    gulp.watch(paths.scss.src, compileSass);
    gulp.watch(paths.html.src).on('change', browserSync.reload);
}

// Exportar tareas
export { compileSass as sass, serve };

// Tarea por defecto
export default gulp.series(
    compileSass,
    serve
);
