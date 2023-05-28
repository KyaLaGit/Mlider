import webpack from 'webpack-stream'

export const js = () => {
    return glob.src('src/js/script.js')
        .pipe(glob.plugin.plumber({
            errorHandler: glob.plugin.notify.onError({
                title: 'JS'
            })
        }))
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'script.min.js'
            }
        }))
        .pipe(glob.dest('dist/js/'))
        .pipe(glob.plugin.browsersync.stream())
}