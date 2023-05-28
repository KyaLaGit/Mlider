export class Mlider {
    constructor(selectors, opt) {
        this.selectors = selectors
        this.opt = opt
        this.curInd = 0
        this.prevInd = 0
        this.action = 0

        this.defualtOptions = {
            infinity: false,
            slideSize: 'auto',
            preViewSlide: 1,
            saveSlideSize: false,
            columnGap: 0,
            slidePosition: 'left',
            currentClass: 'current',
            transitionTime: 400,
            counterInDot: false,
            keyboardEvent: true,
            slideGroup: 0,
            autoViewSlideTime: 0,
            step: 0,
            emptySlide: false,
        }
        Object.assign(Object.assign(this.options = {}, this.defualtOptions), opt)

        this.#setup()

        if (this.validKeyElements) {
            this.#rectReset(true)
            this.#event()
            // this.viewSlide(Math.round(this.slidesLngth / this.opt.slide.step[0] / 2), 0)
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

    // nemnogo ugly govno(hz)
    #checkOptions() {
        // Boolean opt
        this.opt.slider.infinity = this.#checkBooleanOpt(this.opt.slider.infinity, 'infinity')
        this.opt.slide.saveSize = this.#checkBooleanOpt(this.opt.slide.saveSize, 'saveSlideSize')
        this.opt.slider.counterInDot = this.#checkBooleanOpt(this.opt.slider.counterInDot, 'counterInDots')
        this.opt.slider.keyboardEvent = this.#checkBooleanOpt(this.opt.slider.keyboardEvent, 'keyboardEvents')
        this.opt.slide.empty = this.#checkBooleanOpt(this.opt.slide.empty, 'emptySlide')

        // String opt
        this.opt.slide.size = this.#checkStringOpt(this.opt.slide.size, 'slideSize')
        this.opt.slider.currentClass = this.#checkStringOpt(this.opt.slider.currentClass, 'currentClass')

        // Array opt        
        this.opt.slide.preView = this.#checkArrayOpt(this.opt.slide.preView, 'preViewSlide')
        this.opt.slide.position = this.#checkArrayOpt(this.opt.slide.position, 'slidePosition')
        this.opt.slide.step = this.#checkArrayOpt(this.opt.slide.step, 'step')

        // Number opt
        this.opt.slider.transitionTime = this.#checkNumberOpt(this.opt.slider.transitionTime, 'transitionTime')
        this.opt.slider.columnGap = this.#checkNumberOpt(this.opt.slider.columnGap, 'columnGap')
        this.opt.slider.slideGroup = this.#checkNumberOpt(this.opt.slider.slideGroup, 'slideGroup')
        this.opt.slider.autoViewSlideTime = this.#checkNumberOpt(this.opt.slider.autoViewSlideTime, 'autoViewSlideTime')

        this.opt.slide.step[0] === 0 ? this.opt.slide.step = this.opt.slide.preView.map(opt => Math.round(opt)) : null
    }


    // CHECKS
    #checkNumberOpt(option, name) {
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

        return Math.abs(option)
    }

    #checkBooleanOpt(option, name) {
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

    #checkStringOpt(option, name) {
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

    #checkArrayOpt(option, name) {
        if (Array.isArray(option)) {
            if (name === 'slidePosition') {
                return option.map(opt => this.#checkStringOpt(opt, name))
            } else if (name === 'step' || name === 'preViewSlide') {
                return option.map(opt => this.#checkNumberOpt(opt, name))
            }
        } else {
            if (name === 'slidePosition') {
                return [this.#checkStringOpt(option, name)]
            } else if (name === 'step' || name === 'preViewSlide') {
                return [this.#checkNumberOpt(option, name)]
            }
        }
    }






    // GENERATE
    #generate() {
        this.initSlidesLngth = this.$slides.length
        let dotsJoin = ''
        let slidesJoin = ''

        // generate slides group
        if (this.opt.slider.slideGroup === 0) {
            if (this.opt.slider.infinity) {
                let slidesQuantity = 15
                slidesQuantity *= this.opt.slider.transitionTime / 1000
                slidesQuantity *= this.opt.slide.step
                slidesQuantity < 10 ? slidesQuantity = 10 : null
                this.opt.slider.slideGroup = slidesQuantity / this.initSlidesLngth
                this.opt.slider.slideGroup = Math.ceil(Number(this.opt.slider.slideGroup))
            } else {
                this.opt.slider.slideGroup = 1
            }
        }
        let ind = 0
        for (let i = 0; i < this.opt.slider.slideGroup; i++) {
            this.$slides.forEach(slide => {
                // slide.classList.contains(this.opt.slider.currentClass) ? this.action = ind : null
                slide.setAttribute('data-mlider-index', ind)
                slidesJoin += slide.outerHTML

                if (this.$dot && ind <= this.initSlidesLngth) {
                    const dot = this.$dot
                    dot.setAttribute('data-mlider-type', 'dot')
                    dot.setAttribute('data-mlider-index', ind)
                    this.opt.slider.counterInDot ? dot.innerHTML = ind : null
                    dotsJoin += dot.outerHTML
                }
                ind++
            })
            if (this.opt.slide.empty && this.initSlidesLngth % this.opt.slide.step !== 0) {
                const emptySlide = this.$slides[this.initSlidesLngth - 1]
                emptySlide.classList.add('empty')

                for (let i = 0; i < this.opt.slide.step - (this.initSlidesLngth % this.opt.slide.step); i++) {
                    emptySlide.setAttribute('data-mlider-index', ind)
                    slidesJoin += emptySlide.outerHTML
                    ind++
                }
            }
        }

        // generate slide line
        this.$wrap.innerHTML = ''
        if (this.opt.slider.infinity) {
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
        const opt = this.opt
        const slideLngth = this.slidesLngth
        const flexSizes = getSlideSize()
        function getSlideSize() {
            const arr = []
            let ind = 0

            for (ind; ind <= slideLngth; ind) {
                for (let v = 0; v < opt.slide.preView.length; v++) {
                    for (let i = 0; i < Math.floor(opt.slide.preView[v]); i++) {
                        arr.push(`flex: 0 0 calc(${100 / opt.slide.preView[v]}% - (${opt.slider.columnGap}px - (${opt.slider.columnGap}px / ${opt.slide.preView[v]})));`)
                        ind++
                    }
                }
            }
            return arr
        }


        if (this.opt.slider.infinity) {
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
            column-gap: ${this.opt.slider.columnGap}px;
            transition: transform ${this.opt.slider.transitionTime / 1000}s ease;
        `

        this.$slides.forEach((slide, i) => {
            slide.style.cssText += `
                ${flexSizes[i]}
                height: 100%;
                `
        })
    }







    // VIEW SLIDES
    viewSlide(action, ind) {
        // check current and initial index
        this.opt.slider.infinity && Math.abs(action) > this.initSlidesLngth / 2
            ? this.action = (this.initSlidesLngth - Math.abs(action)) * -(action / Math.abs(action))
            : this.action = action
        this.action *= this.opt.slide.step

        this.prevInd = this.curInd
        const checkedInd = this.#getCheckInd(this.curInd + this.action)
        this.curInd === checkedInd ? this.action = 0 : null
        this.curInd = checkedInd
        ind !== undefined ? this.curInd = ind : null



        // main actions
        if (this.opt.slider.infinity) {
            // this.slidesShift(this.action)
            this.$subSlideLine.style.transform = `translateX(${this.opt.moveSlidesPoint}px)`
        }
        this.$slideLine.style.transform = `translateX(${this.opt.slideRect[this.curInd][this.opt.slide.position]}px)`
        console.log("this.opt.slideRect:", this.opt.slideRect)

        // others
        // this.setCurrentClasses
        this.opt.slider.autoViewSlideTime ? this.#intervalView() : null
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
        if (this.opt.slider.infinity) {
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
            this.opt.slideRect = []
            this.opt.moveSlidesPoint = 0
            this.opt.slide.curStep = this.opt.slide.step[this.curInd % this.opt.slide.step.length]

            // slides rect
            for (let i = 0; i < this.slidesSort.length; i++) {
                const par = {}
                const slide = this.slidesSort[i]
                const slideRect = slide.getBoundingClientRect()
                const wrapRect = this.opt.wrapRect
                const slideCenter = slideRect.left + (slideRect.width / 2)
                const wrapCenter = wrapRect.left + (wrapRect.width / 2)

                par.pos = i

                par.initialRect = {}
                par.initialRect.left = -(slideRect.left - wrapRect.left)
                par.initialRect.right = wrapRect.right - slideRect.right
                par.initialRect.center = -(slideCenter - wrapCenter)
                par.width = slideRect.width
                par.slide = slide

                this.opt.slideRect.push(par)
            }

            this.opt.rectByPos = (pos) => {
                for (let i in this.opt.slideRect) {
                    if (this.opt.slideRect[i].pos === pos) {
                        return this.opt.slideRect[i]
                    }
                }
            }

        } else {
            // slides opt update
            for (let i = 0; i < this.opt.slideRect.length; i++) {
                const slideRect = this.opt.slideRect[i]
                slideRect.pos = this.#getCheckInd(slideRect.pos - this.action)
                slideRect.slide = this.$slideLine.querySelector(`[data-mlider-index='${slideRect.slide.getAttribute('data-mlider-index')}']`)
            }
            // slides rect update
            for (let i = Math.abs(this.action); i > 0; i--) {
                if (this.action > 0) {
                    const curSlideRect = this.opt.rectByPos(this.slidesLngth - i)
                    const prevSlideRect = this.opt.rectByPos(this.slidesLngth - i - 1)

                    curSlideRect.initialRect.left = prevSlideRect.initialRect.left - prevSlideRect.width - this.opt.slider.columnGap
                    curSlideRect.initialRect.right = prevSlideRect.initialRect.right - curSlideRect.width - this.opt.slider.columnGap
                    curSlideRect.initialRect.center = prevSlideRect.initialRect.center - (prevSlideRect.width / 2) - (curSlideRect.width / 2) - this.opt.slider.columnGap
                } else if (this.action < 0) {
                    const curSlideRect = this.opt.rectByPos(i - 1)
                    const nextSlideRect = this.opt.rectByPos(i)

                    curSlideRect.initialRect.left = nextSlideRect.initialRect.left + curSlideRect.width + this.opt.slider.columnGap
                    curSlideRect.initialRect.right = nextSlideRect.initialRect.right + nextSlideRect.width + this.opt.slider.columnGap
                    curSlideRect.initialRect.center = nextSlideRect.initialRect.center + (nextSlideRect.width / 2) + (curSlideRect.width / 2) + this.opt.slider.columnGap
                }
            }
        }
        this.#mainRectUpdate()

        // for sub slide line   
        if (this.opt.slider.infinity && this.action !== 0) {
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
                ? this.opt.moveSlidesPoint += moveSlideWdth + Math.abs(this.opt.slider.columnGap * this.action)
                : this.opt.moveSlidesPoint -= moveSlideWdth + Math.abs(this.opt.slider.columnGap * this.action)
        }
    }

    #mainRectUpdate() {
        let leftValues = []
        let rightValues = []
        let centerValues = []

        for (let i = 0; i < this.opt.slideRect.length; i++) {
            const slideRect = this.opt.rectByPos(i)

            if (i % this.opt.slide.curStep === 0) {
                leftValues = []
                rightValues = []
                centerValues = []
                for (let step = 0; step < this.opt.slide.curStep; step++) {
                    const nextRect = this.opt.rectByPos(i + step)
                    if (nextRect) {
                        leftValues.push(nextRect.initialRect.left)
                        rightValues.push(nextRect.initialRect.right)
                        centerValues.push(nextRect.initialRect.center)
                    }
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







    // EVENTS
    #event() {
        this.mouseEvent = this.mouseEvent.bind(this)
        this.$slider.addEventListener('click', this.mouseEvent)

        if (this.opt.slider.keyboardEvent) {
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

            if (this.opt.slider.infinity) {
                this.action >= 0 ? this.viewSlide(1) : this.viewSlide(-1)
            } else {
                (this.curInd === 0 || this.curInd === this.slidesLngth - 1)
                    ? (this.curInd === 0 ? this.viewSlide(1) : this.viewSlide(-1))
                    : this.action >= 0 ? this.viewSlide(1) : this.viewSlide(-1)
            }

        }, this.opt.slider.autoViewSlideTime)
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
        this.opt.slideRect[this.prevInd].slides.forEach(slide => { slide.classList.remove(this.opt.slider.currentClass) })
        this.opt.slideRect[this.curInd].slides.forEach(slide => { slide.classList.add(this.opt.slider.currentClass) })

        const curInitInd = this.#toInit(this.curInd)
        const prevInitInd = this.#toInit(this.prevInd)
        const initSlidesLngth = this.#toInit(this.slidesLngth - 1)

        if (this.$dot) {
            this.opt.dots[prevInitInd].classList.remove(this.opt.slider.currentClass)
            this.opt.dots[curInitInd].classList.add(this.opt.slider.currentClass)
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
        if (this.opt.slider.infinity) {
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





