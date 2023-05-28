import gulp from 'gulp'

// Plugins
import browsersync from 'browser-sync'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import size from 'gulp-size'
import gulprename from 'gulp-rename'
import gulpreplace from 'gulp-replace'

// Global vars
global.glob = {
    src: gulp.src,
    dest: gulp.dest,
    plugin: {
        browsersync: browsersync,
        plumber: plumber,
        notify: notify,
        size: size,
        rename: gulprename,
        replace: gulpreplace,
    }
}

// Task imports
import { copy } from './gulp/copy.js'
import { cleaner } from './gulp/cleaner.js'
import { server } from './gulp/server.js'
import { html } from './gulp/html.js'
import { scss } from './gulp/scss.js'
import { js } from './gulp/js.js'
import { img } from './gulp/img.js'
import { font, fontCssFile } from './gulp/font.js'

// Watchers
function watcher() {
    gulp.watch('src/files/*.*', copy)
    gulp.watch('src/**/*.html', html)
    gulp.watch('src/scss/**/*.scss', scss)
    gulp.watch('src/js/**/*.js', js)
    gulp.watch('src/img/**/*.*', img)
}

// Vars
const transferFiles = gulp.series(cleaner, copy)
const serverWatcher = gulp.parallel(watcher, server)
const failsScript = gulp.parallel(html, scss, js, img)

const mainScript = gulp.series(transferFiles, font, failsScript, fontCssFile, serverWatcher)

// Tasks call
gulp.task('default', mainScript)