import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import gulpAutoprefixer from 'gulp-autoprefixer'
import gulpGroupCssMediaQueries from 'gulp-group-css-media-queries'

const sass = gulpSass(dartSass)

export const scss = () => {
    return glob.src('src/scss/style.scss')
        .pipe(glob.plugin.plumber({
            errorHandler: glob.plugin.notify.onError({
                title: 'SCSS'
            })
        }))
        .pipe(sass())
        .pipe(glob.plugin.replace(/(\.\.\/)*img\//g, '../img/'))
        .pipe(gulpGroupCssMediaQueries())
        .pipe(gulpAutoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            cascade: false,
        }))
        .pipe(glob.dest('dist/css/'))
        .pipe(glob.plugin.browsersync.stream())
}