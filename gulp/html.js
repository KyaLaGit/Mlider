import fileinclude from 'gulp-file-include'

export const html = () => {
    return glob.src('src/html/*.html')
        .pipe(glob.plugin.plumber({
            errorHandler: glob.plugin.notify.onError({
                title: 'HTML'
            })
        }))
        .pipe(fileinclude())
        .pipe(glob.plugin.replace(/(\.\.\/)*img\//g, './img/'))
        .pipe(glob.plugin.size({ title: 'HTML' }))
        .pipe(glob.dest('dist/'))
        .pipe(glob.plugin.browsersync.stream())
}