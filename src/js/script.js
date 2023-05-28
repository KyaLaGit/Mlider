import * as dataInit from './module.js'

function mrange() {
    const mrange = document.querySelector('[data-mrange]')

    if (mrange) {
        const dot = document.querySelector('[data-mrange-dot]')

        document.addEventListener('mousedown', eventFn)
        document.addEventListener('mousemove', eventFn)
        document.addEventListener('mouseup', eventFn)
        let move = false
        let moveX = -50
        function eventFn(e) {
            const target = e.target
            const type = e.type

            if (!move && target.closest('[data-mrange-dot]') && type === 'mousedown') {
                move = true
            } else if (move && type === 'mousemove') {
                console.log(e.movementX)
                // moveX += e.movementX * 10
                moveX += e.movementX * 100 / 5
                // console.log(e.movementX * 100 / 25)

                dot.style.cssText += `transform: translate(${moveX}%, -50%);`
            } else if (move && type === 'mouseup') {
                move = false
            }
        }

    }
}
// mrange()









