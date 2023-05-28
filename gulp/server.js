export const server = () => {
    glob.plugin.browsersync.init({
        server: {
            baseDir: "dist/"
        }
    })
}