import gulpttf2woff from 'gulp-ttf2woff'
import gulpttf2woff2 from 'gulp-ttf2woff2'
import fs from 'fs'
import path from 'path'

export const font = cb => {
    fs.open(path.resolve('dist', 'font'), 'r', (err) => {
        if (err) {
            return glob.src('src/font/*.ttf')
                .pipe(glob.plugin.plumber({
                    errorHandler: glob.plugin.notify.onError({
                        title: 'FONT'
                    })
                }))
                .pipe(gulpttf2woff({ clone: true }))
                .pipe(gulpttf2woff2({ clone: true }))
                .pipe(glob.dest('dist/font/'))
        } else {
            console.log('-----Шрифт уже конвертирован.')
        }
    })

    cb()
}

export const fontCssFile = cb => {
    fs.open(path.resolve('dist', 'css', 'font.css'), 'r', (err) => {
        if (err) {
            let tamplate = ''

            fs.readdir(path.resolve('dist', 'font'), (err, files) => {
                if (!err) {
                    let prevFileName = null

                    files.forEach(file => {
                        const fullFileName = path.basename(file, path.extname(file))

                        if (fullFileName !== prevFileName) {
                            const fileName = /\w+/.exec(fullFileName)
                            let fontWeight = null
                            let fontStyle = null

                            fullFileName.toLowerCase().includes('thin') ? fontWeight = 100 : null
                            fullFileName.toLowerCase().includes('hairline') ? fontWeight = 100 : null
                            fullFileName.toLowerCase().includes('extralight') ? fontWeight = 200 : null
                            fullFileName.toLowerCase().includes('extra light') ? fontWeight = 200 : null
                            fullFileName.toLowerCase().includes('ultralight') ? fontWeight = 200 : null
                            fullFileName.toLowerCase().includes('ultra light') ? fontWeight = 200 : null
                            fullFileName.toLowerCase().includes('light') ? fontWeight = 300 : null
                            fullFileName.toLowerCase().includes('normal') ? fontWeight = 400 : null
                            fullFileName.toLowerCase().includes('regular') ? fontWeight = 400 : null
                            fullFileName.toLowerCase().includes('medium') ? fontWeight = 500 : null
                            fullFileName.toLowerCase().includes('semibold') ? fontWeight = 600 : null
                            fullFileName.toLowerCase().includes('semi bold') ? fontWeight = 600 : null
                            fullFileName.toLowerCase().includes('demibold') ? fontWeight = 600 : null
                            fullFileName.toLowerCase().includes('demi bold') ? fontWeight = 600 : null
                            fullFileName.toLowerCase().includes('bold') ? fontWeight = 700 : null
                            fullFileName.toLowerCase().includes('extrabold') ? fontWeight = 800 : null
                            fullFileName.toLowerCase().includes('extra bold') ? fontWeight = 800 : null
                            fullFileName.toLowerCase().includes('ultrabold') ? fontWeight = 800 : null
                            fullFileName.toLowerCase().includes('ultra bold') ? fontWeight = 800 : null
                            fullFileName.toLowerCase().includes('black') ? fontWeight = 900 : null
                            fullFileName.toLowerCase().includes('heavy') ? fontWeight = 900 : null
                            if (fontWeight === null) {
                                fontWeight = 400
                            }

                            fullFileName.toLowerCase().includes('italic') ? fontStyle = 'italic' : null
                            if (fontStyle === null) {
                                fontStyle = 'normal'
                            }

                            tamplate += `@font-face {\n\tfont-family: "${fileName}";\n\tsrc: url('../font/${fullFileName}.ttf') format('truetype'),\n\t\turl('../font/${fullFileName}.woff') format('woff'),\n\t\turl('../font/${fullFileName}.woff2') format('woff2');\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\n\n`
                        }

                        prevFileName = fullFileName
                    })

                    fs.writeFile(path.resolve('dist', 'css', 'font.css'), tamplate, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            })
        } else {
            console.log('-----font.css уже существует.')
        }
    })

    cb()
}
