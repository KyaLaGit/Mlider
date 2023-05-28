import clean from 'gulp-clean'

export const cleaner = () => {
    return glob.src(['dist/**/*.*', '!dist/css/font.css', '!dist/font/*.*'], { read: false, allowEmpty: true })
        .pipe(clean())
        .pipe(glob.dest('dist/'));
}
