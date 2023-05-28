export class Mlider {
    constructor(selectors, options) {
        this.selectors = selectors
        this.curInd = 0
        this.prevInd = 0
        this.action = 0
        this.opt = {}

        this.defualtOptions = {
            infinity: false,
            slideSize: 'auto',
            preViewSlides: 1,
            saveSlideSize: false,
            columnGap: 0,
            slidePosition: 'left',
            currentClass: 'current',
            animationTime: 400,
            counterInDots: false,
            keyboard: true,
            slidesGroup: 0,
            autoViewSlideTime: 0,
            step: 0,
            emptySlide: false,
        }
        Object.assign(Object.assign(this.options = {}, this.defualtOptions), options)

        this.#setup()

        if (this.validKeyElements) {
            this.#rectReset(true)
            this.#event()
            this.viewSlide(0, 0)
        }
    }

    // ERROR
    #errorLog(name, info) {
        console.log(`ERROR --- ${name} (${info})`)
    }

    // SETUPS
    #setup() {
        this.#checkElements()
        this.#checkOptions()

        if (this.validKeyElements) {
            this.#generate()
            this.#styles()
        }
    }

    #checkElements() {
        this.$slider = document.querySelector(this.#checkSelector(this.selectors.sliderSelector, 'slider'))
        this.$slider ? this.$slides = this.$slider.querySelectorAll(this.#checkSelector(this.selectors.slideSelector, 'slides')) : null

        if (this.validKeyElements) {
            this.$prevBtn = this.$slider.querySelector(this.#checkSelector(this.selectors.prevBtnSelector, 'prev btn'))
            this.$nextBtn = this.$slider.querySelector(this.#checkSelector(this.selectors.nextBtnSelector, 'next btn'))
            this.$dot = this.$slider.querySelector(this.#checkSelector(this.selectors.dotSelector, 'dot'))
            this.$counter = this.$slider.querySelector(this.#checkSelector(this.selectors.counterSelector, 'counter'))
            this.$wrap = this.$slides[0].parentElement
        }
    }

    // ugly govno(peredelivay)
    #checkSelector(selector, name) {

        if (selector !== undefined && selector !== null) {
            if (typeof selector === 'string') {
                selector = selector.trim()
                if (selector === '' || !/[.#]\w+/.test(selector)) {
                    selector = undefined
                    this.#errorLog(name, 'invalid selector')
                }
            } else {
                selector = undefined
                this.#errorLog(name, 'invalid selector')
            }
        }

        if (selector !== undefined && name !== 'slides' && name !== 'slider') {
            if (this.$slider.querySelectorAll(selector).length > 1) {
                selector = undefined
                this.#errorLog(name, '>1 elements')
            } else if (!this.$slider.querySelector(selector)) {
                this.#errorLog(name, 'can`t find element')
            }
        }

        name === 'slider' && !document.querySelector(selector) ? this.#errorLog(name, 'can`t find element') : null
        name === 'slides' && !this.$slider.querySelector(selector) ? this.#errorLog(name, 'can`t find element') : null

        return selector
    }

    #checkOptions() {
        // Boolean opt
        this.opt.infinity = this.#setCheckedBooleanOption(this.options.slider.infinity, 'infinity')
        this.opt.saveSlideSize = this.#setCheckedBooleanOption(this.options.slide.saveSize, 'saveSlideSize')
        this.opt.counterInDots = this.#setCheckedBooleanOption(this.options.slider.counterInDots, 'counterInDots')
        this.opt.keyboardEvents = this.#setCheckedBooleanOption(this.options.slider.keyboard, 'keyboardEvents')
        this.opt.emptySlide = this.#setCheckedBooleanOption(this.options.slide.empty, 'emptySlide')

        // String opt
        this.opt.slideSize = this.#setCheckedStringOption(this.options.slide.size, 'slideSize')
        this.opt.slidePosition = this.#setCheckedStringOption(this.options.slide.position, 'slidePosition')
        this.opt.currentClass = this.#setCheckedStringOption(this.options.slider.currentClass, 'currentClass')

        // Number opt
        this.opt.preViewSlides = this.#setCheckedNumberOption(this.options.slide.preView, 'preViewSlides')
        this.opt.animationTime = this.#setCheckedNumberOption(this.options.animationTime, 'animationTime')
        this.opt.columnGap = this.#setCheckedNumberOption(this.options.slider.columnGap, 'columnGap')
        this.opt.slidesGroup = this.#setCheckedNumberOption(this.options.slider.slidesGroup, 'slidesGroup')
        this.opt.autoViewSlideTime = this.#setCheckedNumberOption(this.options.slider.autoViewSlideTime, 'autoViewSlideTime')
        this.opt.step = this.#setCheckedNumberOption(this.options.slide.step, 'step')

        this.opt.preViewSlides === 0 ? this.opt.preViewSlides = 1 : null
        this.opt.step === 0 ? this.opt.step = Math.round(this.opt.preViewSlides) : this.opt.step = Math.round(this.opt.step)
        this.opt.slidesGroup !== 0 ? this.opt.slidesGroup = Math.round(this.opt.slidesGroup) : null
        this.opt.moveSlidesPoint = 0
        this.opt.slidesRect = []
    }

    // CHECKS
    #setCheckedNumberOption(option, name) {
        if (typeof option === 'string') {
            option = option.trim()
            option = parseInt(option)
            if (isNaN(option)) {
                option = this.defualtOptions[name]
                this.#errorLog(name, 'invalid value(!use defualt value!)')
            }
        } else if (typeof option === 'undefined') {
            option = this.defualtOptions[name]
        } else if (typeof option !== 'number') {
            option = this.defualtOptions[name]
            this.#errorLog(name, 'invalid value(!use defualt value!)')
        }

        if (option < 0) {
            option = this.defualtOptions[name]
            this.#errorLog(name, 'invalid value(!use defualt value!)')
        }

        return option
    }

    #setCheckedBooleanOption(option, name) {
        if (typeof option === 'string') {
            option = option.trim()
            if (option !== 'true' && option !== 'false') {
                option = this.defualtOptions[name]
                this.#errorLog(name, 'invalid value(!use defualt value!)')
            }
        } else if (typeof option === 'undefined') {
            option = this.defualtOptions[name]
        } else if (typeof option !== 'boolean') {
            option = this.defualtOptions[name]
            this.#errorLog(name, 'invalid value(!use defualt value!)')
        }

        return option
    }

    #setCheckedStringOption(option, name) {
        if (typeof option === 'string') {
            option = option.trim()
            if (name === 'slidePosition') {
                if (!(option === 'left' || option === 'center' || option === 'right' || option === 'auto')) {
                    option = this.defualtOptions[name]
                    this.#errorLog(name, 'invalid value(!use defualt value!)')
                }
            } else if (name === 'slideSize') {
                if (!(option === 'auto' || option === 'castom')) {
                    option = this.defualtOptions[name]
                    this.#errorLog(name, 'invalid value(!use defualt value!)')
                }
            } else if (option === '') {
                option = this.defualtOptions[name]
                this.#errorLog(name, 'invalid value(!use defualt value!)')
            }
        } else if (typeof option === 'undefined') {
            option = this.defualtOptions[name]
        } else {
            option = this.defualtOptions[name]
            this.#errorLog(name, 'invalid value(!use defualt value!)')
        }

        return option
    }






    // GENERATE
    #generate() {
        this.initSlidesLngth = this.$slides.length
        let dotsJoin = ''
        let slidesJoin = ''

        // generate slides group
        if (this.opt.slidesGroup === 0) {
            if (this.opt.infinity) {
                let slidesQuantity = 15
                slidesQuantity *= this.opt.animationTime / 1000
                slidesQuantity *= this.opt.step
                slidesQuantity < 10 ? slidesQuantity = 10 : null
                this.opt.slidesGroup = slidesQuantity / this.initSlidesLngth
                this.opt.slidesGroup = Math.ceil(Number(this.opt.slidesGroup))
            } else {
                this.opt.slidesGroup = 1
            }
        }
        let ind = 0
        for (let i = 0; i < this.opt.slidesGroup; i++) {
            this.$slides.forEach(slide => {
                // slide.classList.contains(this.opt.currentClass) ? this.action = ind : null
                slide.setAttribute('data-mlider-index', ind)
                slidesJoin += slide.outerHTML

                if (this.$dot && ind <= this.initSlidesLngth) {
                    const dot = this.$dot
                    dot.setAttribute('data-mlider-type', 'dot')
                    dot.setAttribute('data-mlider-index', ind)
                    this.opt.counterInDots ? dot.innerHTML = ind : null
                    dotsJoin += dot.outerHTML
                }
                ind++
            })
            if (this.opt.emptySlide && this.initSlidesLngth % this.opt.step !== 0) {
                const emptySlide = this.$slides[this.initSlidesLngth - 1]
                emptySlide.classList.add('empty')

                for (let i = 0; i < this.opt.step - (this.initSlidesLngth % this.opt.step); i++) {
                    emptySlide.setAttribute('data-mlider-index', ind)
                    slidesJoin += emptySlide.outerHTML
                    ind++
                }
            }
        }

        // generate slide line
        this.$wrap.innerHTML = ''
        if (this.opt.infinity) {
            this.$wrap.insertAdjacentHTML('afterbegin', `
                <div class="sub-slide-line">
                    <div class="slide-line">${slidesJoin}</div>
                </div>
            `)
            this.$subSlideLine = this.$slider.querySelector('.sub-slide-line')
        } else {
            this.$wrap.insertAdjacentHTML('afterbegin', `
                <div class="slide-line">${slidesJoin}</div>
            `)
        }
        this.setSlides
        this.$slideLine = this.$slides[0].parentElement
        this.slidesLngth = this.$slides.length

        // others
        this.$prevBtn ? this.$prevBtn.setAttribute('data-mlider-type', 'prev-btn') : null
        this.$nextBtn ? this.$nextBtn.setAttribute('data-mlider-type', 'next-btn') : null

        if (this.$dot) {
            this.$dot.parentElement.innerHTML = dotsJoin
            this.opt.dots = this.$slider.querySelectorAll(this.selectors.dotSelector)
        }
    }

    #styles() {
        const getSlideSizeOpt = () => {
            if (this.opt.slideSize === 'auto') {
                return ``
            } else if (this.opt.slideSize === 'castom') {
                if (this.opt.saveSlideSize === true) {
                    return `flex: 0 0 ${100 / this.opt.preViewSlides}%;`
                } else {
                    return `
                        flex: 0 0 calc(${100 / this.opt.preViewSlides}% - (${this.opt.columnGap}px - (${this.opt.columnGap}px / ${this.opt.preViewSlides})));
                    `
                }
            }
        }

        if (this.opt.infinity) {
            this.$subSlideLine.style.cssText += `
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 100%;    
            `
        }

        this.$slideLine.style.cssText += `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            column-gap: ${this.opt.columnGap}px;
            transition: transform ${this.opt.animationTime / 1000}s ease;
        `

        this.$slides.forEach(slide => {
            slide.style.cssText += `
                ${getSlideSizeOpt()}
                height: 100%;
            `
        })
    }







    // VIEW SLIDES
    viewSlide(action, ind) {
        // check current and initial index
        action *= this.opt.step
        this.opt.infinity && Math.abs(action) > this.initSlidesLngth / 2
            ? this.action = (this.initSlidesLngth - Math.abs(action)) * -(action / Math.abs(action))
            : this.action = action

        this.prevInd = this.curInd
        const checkedInd = this.#getCheckInd(this.curInd + this.action)
        this.curInd === checkedInd ? this.action = 0 : null
        this.curInd = checkedInd
        ind !== undefined ? this.curInd = ind : null

        // main actions
        if (this.opt.infinity) {
            this.slidesShift(this.action)
            this.$subSlideLine.style.transform = `translateX(${this.opt.moveSlidesPoint}px)`
        }
        this.$slideLine.style.transform = `translateX(${this.opt.slidesRect[this.curInd][this.opt.slidePosition]}px)`
        console.log("this.opt.slidesRect:", this.opt.slidesRect)

        // others
        // this.setCurrentClasses
        this.opt.autoViewSlideTime ? this.#intervalView() : null
    }

    slidesShift(action) {
        let arr = Array.from(this.$slider.querySelectorAll(this.selectors.slideSelector))
        if (action > 0) {
            for (let i = 0; i < Math.abs(action); i++) {
                this.$slideLine.insertAdjacentHTML('beforeend', `${arr[0].outerHTML}`)
                arr[0].remove()
                arr = Array.from(this.$slider.querySelectorAll(this.selectors.slideSelector))
            }
        } else if (action < 0) {
            for (let i = 0; i < Math.abs(action); i++) {
                this.$slideLine.insertAdjacentHTML('afterbegin', `${arr[arr.length - 1].outerHTML}`)
                arr[arr.length - 1].remove()
                arr = Array.from(this.$slider.querySelectorAll(this.selectors.slideSelector))
            }
        }
        this.#rectReset()
    }

    #getCheckInd(index) {
        if (this.opt.infinity) {
            if (index > this.slidesLngth - 1) {
                index -= this.slidesLngth
            } else if (index < 0) {
                index += this.slidesLngth
            }
        } else {
            if (index > this.slidesLngth - 1) {
                index = this.slidesLngth - 1
            } else if (index < 0) {
                index = 0
            }
        }
        return index
    }

    #rectReset(first) {
        if (first) {
            this.opt.wrapRect = this.$wrap.getBoundingClientRect()
            for (let i = 0; i < this.slidesSort.length; i++) {
                const par = {}

                const slide = this.slidesSort[i]
                const slideRect = slide.getBoundingClientRect()
                const wrapRect = this.opt.wrapRect
                const slideCenter = slideRect.left + (slideRect.width / 2)
                const wrapCenter = wrapRect.left + (wrapRect.width / 2)

                par.pos = i
                par.width = slideRect.width
                par.left = -(slideRect.left - wrapRect.left)
                par.right = wrapRect.right - slideRect.right
                par.center = -(slideCenter - wrapCenter)
                par.slide = slide
                this.opt.slidesRect.push(par)
            }

            this.opt.rectByPos = (pos) => {
                for (let i in this.opt.slidesRect) {
                    if (this.opt.slidesRect[i].pos === pos) {
                        return this.opt.slidesRect[i]
                    }
                }
            }

            if (this.opt.step > 1) {
                let leftValues = []
                let rightValues = []
                let centerValues = []

                for (let i = 0; i < this.opt.slidesRect.length; i++) {
                    const slideRect = this.opt.rectByPos(i)

                    if (i % this.opt.step === 0) {
                        leftValues = []
                        rightValues = []
                        centerValues = []
                        for (let step = 0; step < this.opt.step; step++) {
                            const nextRect = this.opt.rectByPos(i + step)
                            leftValues.push(nextRect.left)
                            rightValues.push(nextRect.right)
                            centerValues.push(nextRect.center)
                        }
                        slideRect.left = Math.max(...leftValues)
                        slideRect.right = Math.min(...rightValues)
                        slideRect.center = function () { return centerValues.reduce((sum, value) => sum + value, 0) / centerValues.length }()
                    } else {
                        slideRect.left = this.opt.rectByPos(i - 1).left
                        slideRect.right = this.opt.rectByPos(i - 1).right
                        slideRect.center = this.opt.rectByPos(i - 1).center
                    }
                }
            }
        } else {
            // slides opt update
            for (let i = 0; i < this.opt.slidesRect.length; i++) {
                const slideRect = this.opt.slidesRect[i]
                slideRect.pos = this.#getCheckInd(slideRect.pos - this.action)
                slideRect.slide = this.$slideLine.querySelector(`[data-mlider-index='${slideRect.slide.getAttribute('data-mlider-index')}']`)
            }
            // slides rect update
            for (let i = Math.abs(this.action); i > 0; i--) {
                if (this.action > 0) {
                    const curSlideRect = this.opt.rectByPos(this.slidesLngth - i)
                    const prevSlideRect = this.opt.rectByPos(this.slidesLngth - i - 1)

                    if (this.opt.slidePosition === 'left') {
                        curSlideRect.left = prevSlideRect.left - prevSlideRect.width - this.opt.columnGap
                    } else if (this.opt.slidePosition === 'right') {
                        curSlideRect.right = prevSlideRect.right - curSlideRect.width - this.opt.columnGap
                    } else if (this.opt.slidePosition === 'center') {
                        curSlideRect.center = prevSlideRect.center - (prevSlideRect.width / 2) - (curSlideRect.width / 2) - this.opt.columnGap
                    }
                } else if (this.action < 0) {
                    const curSlideRect = this.opt.rectByPos(i - 1)
                    const nextSlideRect = this.opt.rectByPos(i)

                    if (this.opt.slidePosition === 'left') {
                        curSlideRect.left = nextSlideRect.left + curSlideRect.width + this.opt.columnGap
                    } else if (this.opt.slidePosition === 'right') {
                        curSlideRect.right = nextSlideRect.right + nextSlideRect.width + this.opt.columnGap
                    } else if (this.opt.slidePosition === 'center') {
                        curSlideRect.center = nextSlideRect.center + (nextSlideRect.width / 2) + (curSlideRect.width / 2) + this.opt.columnGap
                    }
                }
            }
        }

        // for sub slide line   
        if (this.opt.infinity && this.action !== 0) {
            let moveSlideWdth
            this.action > 0
                ? moveSlideWdth = this.opt.rectByPos(this.slidesLngth - 1).width
                : moveSlideWdth = this.opt.rectByPos(0).width

            if (Math.abs(this.action) > 1) {
                moveSlideWdth = 0
                if (this.action > 0) {
                    for (let i = 1; i < Math.abs(this.action) + 1; i++) {
                        moveSlideWdth += this.opt.rectByPos(this.slidesLngth - i).width
                    }
                } else if (this.action < 0) {
                    for (let i = 0; i < Math.abs(this.action); i++) {
                        moveSlideWdth += this.opt.rectByPos(i).width
                    }
                }
            }

            this.action > 0
                ? this.opt.moveSlidesPoint += moveSlideWdth + Math.abs(this.opt.columnGap * this.action)
                : this.opt.moveSlidesPoint -= moveSlideWdth + Math.abs(this.opt.columnGap * this.action)
        }
    }











    // EVENTS
    #event() {
        this.mouseEvent = this.mouseEvent.bind(this)
        this.$slider.addEventListener('click', this.mouseEvent)

        if (this.opt.keyboardEvents) {
            this.keyboardEvent = this.keyboardEvent.bind(this)
            document.addEventListener('keydown', this.keyboardEvent)
        }

    }

    mouseEvent(e) {
        const elem = e.target

        if (elem.closest('[data-mlider-type="prev-btn"]')) {
            this.viewSlide(this.action = -1)
        } else if (elem.closest('[data-mlider-type="next-btn"]')) {
            this.viewSlide(this.action = 1)
        } else if (elem.closest('[data-mlider-type="dot"]')) {
            const elemInd = Number(elem.closest('[data-mlider-type="dot"]').getAttribute('data-mlider-index'))
            this.viewSlide(elemInd - this.#toInit(this.curInd))
        }
    }

    keyboardEvent(e) {
        const key = e.key
        const repeat = e.repeat

        if (key === 'ArrowLeft' && !repeat) {
            this.viewSlide(this.action = -1)
        } else if (key === 'ArrowRight' && !repeat) {
            this.viewSlide(this.action = 1)
        }
    }

    #intervalView() {
        clearInterval(this.interval)
        this.interval = setInterval(() => {

            if (this.opt.infinity) {
                this.action >= 0 ? this.viewSlide(1) : this.viewSlide(-1)
            } else {
                (this.curInd === 0 || this.curInd === this.slidesLngth - 1)
                    ? (this.curInd === 0 ? this.viewSlide(1) : this.viewSlide(-1))
                    : this.action >= 0 ? this.viewSlide(1) : this.viewSlide(-1)
            }

        }, this.opt.autoViewSlideTime)
    }










    // GETTERS AND SETTERS
    get setSlides() {
        this.$slides = Array.from(this.$slider.querySelectorAll(this.selectors.slideSelector))
        this.slidesSort = Array.from(this.$slider.querySelectorAll(this.selectors.slideSelector))
        this.slidesSort.sort((a, b) => {
            if (Number(a.getAttribute('data-mlider-index')) > Number(b.getAttribute('data-mlider-index'))) return 1
            if (Number(a.getAttribute('data-mlider-index')) < Number(b.getAttribute('data-mlider-index'))) return -1
        })
    }

    get setCurrentClasses() {
        this.opt.slidesRect[this.prevInd].slides.forEach(slide => { slide.classList.remove(this.opt.currentClass) })
        this.opt.slidesRect[this.curInd].slides.forEach(slide => { slide.classList.add(this.opt.currentClass) })

        const curInitInd = this.#toInit(this.curInd)
        const prevInitInd = this.#toInit(this.prevInd)
        const initSlidesLngth = this.#toInit(this.slidesLngth - 1)

        if (this.$dot) {
            this.opt.dots[prevInitInd].classList.remove(this.opt.currentClass)
            this.opt.dots[curInitInd].classList.add(this.opt.currentClass)
        }

        if (this.$counter) {
            this.$counter.innerHTML = `<span>${curInitInd}</span>/<span>${initSlidesLngth}</span>`
        }
    }

    get validKeyElements() {
        let check
        this.$slider && this.$slides.length > 0 ? check = true : check = false
        return check
    }

    #toInit(ind) {
        if (this.opt.infinity) {
            while (ind > this.initSlidesLngth - 1) {
                ind -= this.initSlidesLngth
            }
        }
        return ind
    }
}








// ============================== INFO
// !!!CANNOT apply transition on slides
// console.time() -> 1-3 ms




// for (let i = 0; i < this.slidesSort.length; i++) {
//     const slide = this.slidesSort[i]
//     const par = {}
//     const pos = this.$slides.indexOf(slide)
//     const slideRect = slide.getBoundingClientRect()
//     const wrapRect = this.$wrap.getBoundingClientRect()

//     const slideCenter = slideRect.left + (slideRect.width / 2)
//     const wrapCenter = wrapRect.left + (wrapRect.width / 2)

//     par.ind = i
//     par.pos = pos
//     par.slide = slide
//     par.width = slideRect.width
//     par.left = -(slideRect.left - wrapRect.left)
//     par.right = wrapRect.right - slideRect.right
//     par.center = -(slideCenter - wrapCenter)

//     if (this.opt.slidePosition === 'auto') {
//         if (i === 0) {
//             par.auto = par.left
//         } else if (i === this.$slides.length - 1) {
//             par.auto = par.right
//         } else {
//             par.auto = par.center
//         }
//     }

//     this.opt.slidesRect.push(par)
// }


