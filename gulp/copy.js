export const copy = () => {
    return glob.src('src/files/**/*.*')
        .pipe(glob.dest('dist/files/'))
}