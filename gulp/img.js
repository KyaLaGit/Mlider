export const img = () => {
    return glob.src('src/img/**/*.*')
        .pipe(glob.dest('dist/img/'))
}