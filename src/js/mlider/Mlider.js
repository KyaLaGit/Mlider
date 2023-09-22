let mliderArr = [], curContext, mlidersEvent = { click: false, swipe: false, keyboard: false, breakpoint: false }

export class Mlider {
    constructor(selectors, opt) {
        this.selectors = selectors
        this.opt = opt !== undefined ? opt : {}
        this.trueInd = 0
        this.curInd = 0
        this.curBp = 0
        this.stObserve = false

        this.defualtOptions = {
            infinity: false,
            slide: {
                preView: [[100]],
                position: 'left',
                step: [1],
            },
            syncViewSlide: false,
            columnGap: 0,
            currentClass: 'current',
            transitionTime: 400,
            counterInDot: false,
            keyboardEvent: true,
            swipeEvent: true,
            swipeEventOpt: {
                sensitivity: 0.75,
                free: false,
            },
            autoViewSlide: false,
            autoViewSlideOpt: {
                time: 0,
                direction: 'right',
            },
            breakpoint: {
            },
        }

        this.#checkElements()
        this.#checkOptions()

        if (this.validKeyElements) {
            this.resetOptOnBp(document.documentElement.clientWidth)
            this.#generate()
            this.reset()
            this.eventReset()
        }
    }

    // ERROR
    #errorLog(name, info) {
        console.log(`ERROR --- ${name} (${info})`)
    }

    // SETUPS
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
        this.#optionsRegulation()
        if (!this.opt.slide) this.opt.slide = Object.assign({}, this.defualtOptions.slide)
        this.opt = Object.assign(Object.assign({}, this.defualtOptions), this.opt)
        this.#createNullBreakpoint()
    }

    #optionsRegulation({ opt = this.opt, defOpt = this.defualtOptions, innerName } = {}) {
        if (typeof opt === 'object' && !Array.isArray(opt)) {
            for (let key in opt) {
                const name = innerName ? innerName + key[0].toUpperCase() + key.slice(1) : key
                if (typeof defOpt[key] === 'number' || Array.isArray(defOpt[key])) {
                    opt[key] = this.#checkNumberOpt(opt[key], defOpt[key], name)
                } else if (typeof defOpt[key] === 'string') {
                    opt[key] = this.#checkStringOpt(opt[key], defOpt[key], name)
                } else if (typeof defOpt[key] === 'boolean') {
                    opt[key] = this.#checkBooleanOpt(opt[key], defOpt[key], name)
                } else if (typeof defOpt[key] === 'object') {
                    this.#optionsRegulation({ opt: opt[key], defOpt: defOpt[key], innerName: name })
                    if (key === 'slide') {
                        opt[key] = this.#slideOptRegulation(opt[key])
                    } else {
                        opt[key] = Object.assign(Object.assign({}, this.defualtOptions[key]), opt[key])
                    }
                } else if (typeof defOpt[key] === 'undefined') {
                    if (name.includes('breakpoint')) {
                        if (this.#checkNumberOpt(key, 0, name) === 0) delete opt[key]
                        else { this.#optionsRegulation({ opt: opt[key], innerName: key }) }
                    } else {
                        this.#errorLog(name, 'udefined option')
                    }
                }
            }
        } else {
            this.#errorLog(innerName, 'invalid value(!use defualt value!)')
        }
    }

    #slideOptRegulation(slideOpt) {
        if (!slideOpt.preView) slideOpt.preView = this.defualtOptions.slide.preView
        if (!slideOpt.position) slideOpt.position = this.defualtOptions.slide.position
        if (!slideOpt.step) slideOpt.step = slideOpt.preView

        if (!Array.isArray(slideOpt.preView)) slideOpt.preView = [slideOpt.preView]
        if (!Array.isArray(slideOpt.step)) slideOpt.step = [slideOpt.step]

        if (slideOpt.preView.flat().includes(0)) slideOpt.preView = [1]
        if (slideOpt.step.flat().includes(0)) slideOpt.step = slideOpt.preView

        slideOpt.preView = slideOpt.preView.map(opt => {
            if (!Array.isArray(opt)) {
                const val = opt
                opt = []
                for (let i = 0; i < (Math.floor(val) || 1); i++) { opt.push(100 / val) }
            }
            return opt
        })
        slideOpt.step = slideOpt.step.map(opt => Array.isArray(opt) ? opt.length : (Math.floor(opt) || 1))
        if (slideOpt.step.every(opt => opt === slideOpt.step[0])) slideOpt.step = [slideOpt.step[0]]

        this.defualtOptions.slide.preView = slideOpt.preView
        this.defualtOptions.slide.position = slideOpt.position

        return slideOpt
    }

    #createNullBreakpoint() {
        this.opt.breakpoint[0] = {}
        this.bpArr = []
        const optArr = []
        if (this.opt.breakpoint) {
            for (let key in this.opt.breakpoint) {
                this.bpArr.push(Number(key))
                for (let innerKey in this.opt.breakpoint[key]) {
                    if (!optArr.includes(innerKey)) this.opt.breakpoint[0][innerKey] = this.opt[innerKey]
                    optArr.push(innerKey)
                }
            }
        }
    }

    resetOptOnBp(docSize = 0, reset) {
        const bpArr = this.bpArr.filter(bp => docSize <= bp)
        const bp = Math.min(...bpArr) === Infinity ? 0 : Math.min(...bpArr)

        if (this.curBp !== bp) {
            this.opt = Object.assign(this.opt, this.opt.breakpoint[bp])
            this.curBp = bp

            if (reset) {
                const newOptArr = [...Object.keys(this.opt.breakpoint[bp])]
                if (newOptArr.includes('slide') || newOptArr.includes('columnGap') || newOptArr.includes('infinity')) {
                    this.reset()
                }
            }
        }
    }

    get validKeyElements() {
        let check
        this.$slider && this.$slides.length > 0 ? check = true : (check = false, console.log('invalidKeyElements'))
        return check
    }








    // CHECKS
    #checkNumberOpt(opt, defOpt, name) {
        if (Array.isArray(opt)) {
            return opt.map(opt => {
                return this.#checkNumberOpt(opt, defOpt, name)
            })
        } else if (typeof Number(opt) === 'number' && !isNaN(Number(opt))) return Math.abs(Number(opt))
        this.#errorLog(name, 'invalid value(!use defualt value!)')
        return defOpt
    }

    #checkBooleanOpt(opt, defOpt, name) {
        if (typeof opt === 'boolean') return opt
        this.#errorLog(name, 'invalid value(!use defualt value!)')
        return defOpt
    }

    #checkStringOpt(opt, defOpt, name) {
        if (typeof opt === 'string') {
            opt = opt.trim()
            if (name.toLowerCase().includes('position')) {
                if (opt === 'left' || opt === 'center' || opt === 'right' || opt === 'auto') {
                    return opt
                }
            } else if (name.toLowerCase().includes('direction')) {
                if (opt === 'left' || opt === 'right') {
                    return opt
                }
            }
        }
        this.#errorLog(name, 'invalid value(!use defualt value!)')
        return defOpt
    }









    // GENERATE
    #generate() {
        this.$slider.setAttribute('data-mlider', '')

        // generate slides group
        let slidesJoin = ''
        this.$slides.forEach((slide, ind) => {
            slide.setAttribute('data-mlider-index', ind)
            slide.classList.add('slide')
            slidesJoin += slide.outerHTML
        })

        // generate inner wrap
        this.$wrap.innerHTML = `<div class="sub-slide-line"><div class="slide-line"></div></div>`
        this.$slideLine = this.$slider.querySelector('.slide-line')
        this.$subSlideLine = this.$slider.querySelector('.sub-slide-line')
        this.slideLineWidth = this.$slideLine.clientWidth
        this.slideLngth = this.$slides.length
        this.$slideLine.innerHTML = slidesJoin
        this.$slides = this.$slider.querySelectorAll('.slide-mlider')

        // others
        this.$wrap.setAttribute('data-mlider-type', 'wrapper')
        if (this.$prevBtn) this.$prevBtn.setAttribute('data-mlider-type', 'prev-btn')
        if (this.$nextBtn) this.$nextBtn.setAttribute('data-mlider-type', 'next-btn')

        if (this.$dot) {
            this.$dot.setAttribute('data-mlider-type', 'dot')
            this.$dotParent = this.$dot.parentElement
        }
    }

    reset() {
        this.offTransition
        if (this.opt.slideRect) this.viewSlide(0, { infinity: false, syncViewSlide: false })
        this.updateSlideLineOpt
        this.#generateFlexSizes()
        this.#rectReset()
        this.addMLiderArr
        this.viewSlide(0, { transition: false, syncViewSlide: false })
    }





    #generateFlexSizes() {
        let ind = 0
        this.opt.slides = []
        this.$slides = this.$slider.querySelectorAll('.slide-mlider')
        outter: for (let i = 0; ; i === this.opt.slide.preView.length - 1 ? i = 0 : i++) {
            for (let u = 0; u < this.opt.slide.preView[i].length; u++) {
                if (this.$slides[ind]) {
                    this.$slides[ind].style.flex = `0 0 calc(${this.opt.slide.preView[i][u]}% - (${this.opt.columnGap}px 
                        - (${this.opt.columnGap}px / ${this.opt.slide.preView[i].length})))`
                    this.opt.slides.push({
                        link: this.$slides[ind],
                        width: this.$slides[ind].getBoundingClientRect().width,
                        calcColGap: this.opt.columnGap / this.opt.slide.preView[i].length,
                    })
                    ind++
                } else {
                    break outter
                }
            }
        }
    }

    get updateSlideLineOpt() {
        this.$slideLine.style.columnGap = `${this.opt.columnGap}px`
        this.slideLineWidth = this.$slideLine.clientWidth
    }

    get offTransition() {
        this.$slideLine.style.transition = ''
    }

    get onTransition() {
        this.$slideLine.style.transition = `transform ${this.opt.transitionTime / 1000}s ease`
    }

    get addMLiderArr() {
        this.$slider.setAttribute('data-mlider-index', mliderArr.length)
        mliderArr.push(this)
    }






    // VIEW SLIDES
    viewSlide(ind = 0, { infinity = this.opt.infinity, transition = true, translate = true, syncViewSlide = this.opt.syncViewSlide } = {}) {
        if (transition) this.onTransition
        else this.offTransition

        if (translate) {
            let act = this.#getAct(this.curInd, this.#getCheckInd(ind))
            this.curInd = this.#getCheckInd(ind)
            this.#rectUpdate({ act, ind: this.curInd }, { mainUpdate: true })
            this.#setTranslate(this.$slideLine, { pos: this.opt.slideLine.movePoint, colGap: this.opt.slideLine.colGapPoint })
            if (syncViewSlide) this.#syncViewSlide(null, { translate: false, syncViewSlide: false })
        }

        if (!syncViewSlide) {
            let shiftAct
            this.trueInd = this.#getCheckInd(ind)
            if (infinity) shiftAct = this.opt.slideRect[this.trueInd].pos - Math.floor(this.mainSlideLngth / 2)
            else shiftAct = this.opt.slideRect[this.trueInd].pos - this.trueInd

            this.#slideShift(shiftAct)
            this.#setTranslate(this.$subSlideLine,
                { pos: this.opt.subSlideLine.movePoint, colGap: this.opt.subSlideLine.colGapPoint })
            this.#setCurrentClasses(this.trueInd)
        }
    }

    #getAct(prevInd, newInd) {
        let arr = [0, 0]

        for (let i = 0; i < arr.length; i++) {
            for (let u = 0; u < this.mainSlideLngth; u++) {
                if (i === 0) {
                    if (this.#getCheckInd(prevInd + u) === newInd) break
                    else arr[0]++
                } else {
                    if (this.#getCheckInd(prevInd - u) === newInd) break
                    else arr[1]--
                }
            }
        }

        return Math.abs(arr[0]) < Math.abs(arr[1]) ? arr[0] : arr[1]
    }

    #syncViewSlide(change, option) {
        if (!change) {
            if (!this.stObserve) {
                this.stObserve = true
                this.limitPoint = this.getLimitPoint
                this.changePoint = this.limitPoint * 2 / 3
                this.sLLeft = this.$slideLine.getBoundingClientRect().left

                this.slideObserverInterval = setInterval(() => {
                    const change = this.getRectChange
                    if (Math.round(change) === 0) { clearInterval(this.slideObserverInterval); this.stObserve = false }
                    checkTranslateChange.bind(this)(change, option)
                }, 100)
            }
        } else checkTranslateChange.bind(this)()

        function checkTranslateChange(change, option) {
            const sign = change > 0 ? 1 : -1
            for (let i = 0; i < Math.ceil(Math.abs(change) / this.limitPoint); i++) {
                this.changePoint += Math.abs(change) / this.limitPoint >= 1 ? this.limitPoint * sign : change
                console.log(" this.changePoint:", this.changePoint)
                if (this.changePoint >= this.limitPoint) {
                    this.viewSlide(this.trueInd - 1, option)
                    this.changePoint -= this.limitPoint
                    this.limitPoint = this.getLimitPoint
                } else if (this.changePoint < 0) {
                    this.viewSlide(this.trueInd + 1, option)
                    this.limitPoint = this.getLimitPoint
                    this.changePoint += this.limitPoint
                }
            }
        }
    }

    #setTranslate(line, { pos = 0, colGap = 0, swipe = 0 } = {}) {
        if (line === this.$slideLine) {
            pos = -pos / this.slideLineWidth * 100
            swipe = swipe / this.slideLineWidth * 100
            this.$slideLine.style.transform = `translateX(calc(${pos}% + ${colGap}px + ${swipe}%))`
        } else if (line === this.$subSlideLine) {
            pos = pos / this.slideLineWidth * 100
            this.$subSlideLine.style.transform = `translateX(calc(${pos}% + ${colGap}px))`
        }
    }

    #slideShift(act) {
        for (let i = 0; i < Math.abs(act); i++) {
            if (act > 0) {
                const firstRect = this.opt.getRectByPos(0)
                for (let v = 0; v < firstRect.slides.length; v++) {
                    const slide = firstRect.slides[v]
                    this.$slideLine.insertAdjacentHTML('beforeend', `${slide.link.outerHTML}`)
                    slide.link.remove()
                    slide.link = this.$slideLine.querySelector(`[data-mlider-index="${slide.link.getAttribute('data-mlider-index')}"]`)
                }
                this.opt.rectPosUpdate(1)
            } else if (act < 0) {
                const lastRect = this.opt.getRectByPos(this.mainSlideLngth - 1)
                for (let v = lastRect.slides.length - 1; v >= 0; v--) {
                    const slide = lastRect.slides[v]
                    this.$slideLine.insertAdjacentHTML('afterbegin', `${slide.link.outerHTML}`)
                    slide.link.remove()
                    slide.link = this.$slideLine.querySelector(`[data-mlider-index="${slide.link.getAttribute('data-mlider-index')}"]`)
                }
                this.opt.rectPosUpdate(-1)
            }
        }
        this.$slides = this.$slider.querySelectorAll('.slide-mlider')
        this.#rectUpdate({ act, ind: this.trueInd }, { subUpdate: true })
    }

    #getCheckInd(index) {
        if (this.opt.infinity) {
            if (index > this.mainSlideLngth - 1) {
                index -= this.mainSlideLngth
            } else if (index < 0) {
                index += this.mainSlideLngth
            }
        } else {
            if (index > this.mainSlideLngth - 1) {
                index = this.mainSlideLngth - 1
            } else if (index < 0) {
                index = 0
            }
        }
        return index
    }

    #rectReset() {
        this.opt.wrapRect = this.$wrap.getBoundingClientRect()
        this.opt.slideRect = []
        this.opt.slideLine = { movePoint: 0, colGapPoint: 0 }
        this.opt.subSlideLine = { movePoint: 0, colGapPoint: 0 }
        this.$slideLine.style.transform = ''
        this.$subSlideLine.style.transform = ''

        // main slides rect
        let slideInd = 0, stepInd = 0
        for (let ind = 0; ; ind === this.opt.slide.step.length - 1 ? ind = 0 : ind++) {
            const mainRect = {}
            let curWdth = 0, curStep = 0, calcColGap = 0, curSlides = []

            if (this.opt.slides[slideInd]) {
                for (let i = 0; i < this.opt.slide.step[ind]; i++) {
                    const slide = this.opt.slides[slideInd]
                    if (slide) {
                        const slideWdth = slide.width
                        curSlides.push(slide)
                        curWdth += slideWdth
                        calcColGap += slide.calcColGap
                        slideInd++
                        curStep++
                    } else break
                }
            } else break

            mainRect.pos = stepInd
            mainRect.step = curStep
            mainRect.width = curWdth
            mainRect.slides = curSlides
            mainRect.calcColGap = calcColGap

            this.opt.slideRect.push(mainRect)
            stepInd++
        }
        this.mainSlideLngth = this.opt.slideRect.length

        this.opt.getRectByPos = (pos) => {
            for (let i = 0; i < this.mainSlideLngth; i++) {
                if (this.opt.slideRect[i].pos === pos) {
                    return this.opt.slideRect[i]
                }

            }
        }

        this.opt.rectPosUpdate = (act) => {
            for (let i = 0; i < this.mainSlideLngth; i++) {
                const mainRect = this.opt.slideRect[i]
                mainRect.pos = this.#getCheckInd(mainRect.pos - act)
            }
        }

        this.#rectUpdate({}, { first: true })
    }

    #rectUpdate({ act = 0, ind = 0 } = {}, { first = false, mainUpdate = false, subUpdate = false } = {}) {
        const pos = this.opt.slide.position
        const gap = this.opt.columnGap
        const wrap = this.opt.wrapRect

        if (first) {
            const firstRect = this.opt.slideRect[0]
            if (pos === 'right') {
                const calcColGap = this.opt.columnGap - firstRect.calcColGap
                this.opt.slideLine.colGapPoint = calcColGap
                this.opt.slideLine.movePoint = -(wrap.width - firstRect.width - gap * (firstRect.step - 1) - calcColGap)
            } else if (pos === 'center') {
                const calcColGap = (this.opt.columnGap - firstRect.calcColGap) / 2
                this.opt.slideLine.colGapPoint = calcColGap
                this.opt.slideLine.movePoint = -(wrap.width - firstRect.width - gap * (firstRect.step - 1)) / 2 + calcColGap
            }
        } else {
            for (let i = 0; i < Math.abs(act); i++) {
                if (act > 0) {
                    if (mainUpdate) {
                        if (pos === 'left') {
                            const prevRect = this.opt.slideRect[this.#getCheckInd(ind - 1 - i)]
                            this.opt.slideLine.movePoint += prevRect.width + gap * prevRect.step - prevRect.calcColGap
                            this.opt.slideLine.colGapPoint -= prevRect.calcColGap
                        } else if (pos === 'right') {
                            const curRect = this.opt.slideRect[this.#getCheckInd(ind - i)]
                            this.opt.slideLine.movePoint += curRect.width + gap * curRect.step - curRect.calcColGap
                            this.opt.slideLine.colGapPoint -= curRect.calcColGap
                        } else if (pos === 'center') {
                            const curRect = this.opt.slideRect[this.#getCheckInd(ind - i)]
                            const prevRect = this.opt.slideRect[this.#getCheckInd(ind - 1 - i)]
                            const calcColGap = (prevRect.calcColGap + curRect.calcColGap) / 2
                            this.opt.slideLine.movePoint += (curRect.width + prevRect.width + gap * (curRect.step + prevRect.step)) / 2 - calcColGap
                            this.opt.slideLine.colGapPoint -= calcColGap
                        }
                    }

                    if (subUpdate) {
                        const curRect = this.opt.getRectByPos(this.mainSlideLngth - 1 - i)
                        const curRectGapWdth = curRect.width + gap * curRect.step
                        this.opt.subSlideLine.movePoint += curRectGapWdth - curRect.calcColGap
                        this.opt.subSlideLine.colGapPoint += curRect.calcColGap

                        if (this.stObserve) this.shiftPoint = -curRectGapWdth
                    }
                } else {
                    if (mainUpdate) {
                        if (pos === 'left') {
                            const curRect = this.opt.slideRect[this.#getCheckInd(ind + i)]
                            this.opt.slideLine.movePoint -= curRect.width + gap * curRect.step - curRect.calcColGap
                            this.opt.slideLine.colGapPoint += curRect.calcColGap
                        } else if (pos === 'right') {
                            const prevRect = this.opt.slideRect[this.#getCheckInd(ind + 1 + i)]
                            this.opt.slideLine.movePoint -= prevRect.width + gap * prevRect.step - prevRect.calcColGap
                            this.opt.slideLine.colGapPoint += prevRect.calcColGap
                        } else if (pos === 'center') {
                            const prevRect = this.opt.slideRect[this.#getCheckInd(ind + 1 + i)]
                            const curRect = this.opt.slideRect[this.#getCheckInd(ind + i)]
                            const calcColGap = (prevRect.calcColGap + curRect.calcColGap) / 2
                            this.opt.slideLine.movePoint -= (curRect.width + prevRect.width + gap * (curRect.step + prevRect.step)) / 2 - calcColGap
                            this.opt.slideLine.colGapPoint += calcColGap
                        }
                    }

                    if (subUpdate) {
                        const curRect = this.opt.getRectByPos(i)
                        const curRectGapWdth = curRect.width + gap * curRect.step
                        this.opt.subSlideLine.movePoint -= curRectGapWdth - curRect.calcColGap
                        this.opt.subSlideLine.colGapPoint -= curRect.calcColGap

                        if (this.stObserve) this.shiftPoint = curRectGapWdth
                    }
                }

            }
        }
    }

    #intervalView() {
        clearInterval(this.interval)
        this.interval = setInterval(() => {

            if (this.opt.autoViewSlideOpt.direction === 'left') {
                this.viewSlide(this.curInd - 1)
            } else if (this.opt.autoViewSlideOpt.direction === 'right') {
                this.viewSlide(this.curInd + 1)
            }

        }, this.opt.autoViewSlideOpt.time)
    }

    #setCurrentClasses(ind) {
        this.$slides.forEach(slide => slide.classList.remove(this.opt.currentClass))
        this.opt.slideRect[ind].slides.forEach(slideOpt => slideOpt.link.classList.add(this.opt.currentClass))

        if (this.$dot) {
            if (this.$dotParent.children.length !== this.mainSlideLngth) {
                let dotJoin = ''
                for (let i = 0; i < this.mainSlideLngth; i++) {
                    let dot = this.$dot
                    dot.setAttribute('data-mlider-index', i)
                    if (this.opt.counterInDot) dot.innerHTML = i
                    dotJoin += dot.outerHTML
                }
                this.$dotParent.innerHTML = dotJoin
                this.opt.dots = this.$slider.querySelectorAll('[data-mlider-type="dot"]')
            }
            this.opt.dots.forEach(dot => dot.classList.remove(this.opt.currentClass))
            this.opt.dots[ind].classList.add(this.opt.currentClass)
        }

        if (this.$counter) {
            this.$counter.innerHTML = `<span>${ind}</span>/<span>${this.mainSlideLngth - 1}</span>`
        }
    }







    // EVENTS
    eventReset() {
        if (!mlidersEvent.click && (this.$prevBtn || this.$nextBtn || this.$counter)) {
            window.addEventListener('click', this.#clickEvent.bind(this))
            mlidersEvent.click = true
        }

        if (!mlidersEvent.keyboard && this.opt.keyboardEvent) {
            window.addEventListener('keydown', this.#keyboardEvent.bind(this))
            mlidersEvent.keyboard = true
        }

        if (this.opt.swipeEvent) {
            this.swipe = false
            this.prevSwipe = 0
            this.$slideLine.addEventListener('transitionend', this.#transitionendEvent.bind(this))

            if (!mlidersEvent.swipe) {
                document.addEventListener('mousedown', this.#swipeEvent.bind(this))
                document.addEventListener('mousemove', this.#swipeEvent.bind(this))
                document.addEventListener('mouseup', this.#swipeEvent.bind(this))
                document.addEventListener('mouseleave', this.#swipeEvent.bind(this))
                mlidersEvent.swipe = true
            }
        }

        if (!mlidersEvent.breakpoint && this.opt.breakpoint) {
            window.addEventListener('resize', this.#breakpointEvent.bind(this))
            mlidersEvent.breakpoint = true
        }
    }

    #clickEvent(e, context) {
        const elem = e.target

        if (!context && elem.closest('[data-mlider]')) {
            this.#clickEvent.bind(mliderArr[elem.closest('[data-mlider]').getAttribute("data-mlider-index")])(e, true)
        } else {
            if (elem.closest('[data-mlider-type="prev-btn"]')) {
                this.viewSlide(this.curInd - 1)
            } else if (elem.closest('[data-mlider-type="next-btn"]')) {
                this.viewSlide(this.curInd + 1)
            } else if (elem.closest('[data-mlider-type="dot"]')) {
                const elemInd = Number(elem.closest('[data-mlider-type="dot"]').getAttribute('data-mlider-index'))
                this.viewSlide(elemInd)
            }
        }

    }

    #keyboardEvent(e) {
        const key = e.key
        const repeat = e.repeat

        if (key === 'ArrowLeft' && !repeat) {
            mliderArr.forEach(mlider => {
                if (mlider.opt.keyboardEvent) mlider.viewSlide(mlider.curInd - 1)
            })
        } else if (key === 'ArrowRight' && !repeat) {
            mliderArr.forEach(mlider => {
                if (mlider.opt.keyboardEvent) mlider.viewSlide(mlider.curInd + 1)
            })
        }
    }

    #swipeEvent(e) {
        const elem = e.target
        const type = e.type

        if (!curContext && type === 'mousedown' && elem.closest('[data-mlider-type="wrapper"]')) {
            const context = mliderArr[elem.closest('[data-mlider]').getAttribute("data-mlider-index")]
            curContext = context
            this.#swipeEvent.bind(context)(e)
        } else if (curContext) eventFn.bind(curContext)()

        function eventFn() {
            if (type === 'mousedown' && elem.closest('[data-mlider-type="wrapper"]'))
                swipeStart.bind(this)()
            if (this.swipe) {
                if (type === 'mousemove') move.bind(this)()
                if (type === 'mouseup') swipeEnd.bind(this)(true)
                if (type === 'mouseleave') swipeEnd.bind(this)()
            }
        }

        function swipeStart() {
            clearInterval(this.kickbackInterval)

            this.saveInitialSlidePos
            this.prevSwipe = 0
            this.limitPoint = this.opt.slideRect[this.curInd].width + this.opt.slideRect[this.curInd].step * this.opt.columnGap
            this.swipePoint = this.getCurSlideRect - this.initialSlideRect
            this.swipeRemainPoint = this.swipePoint + this.limitPoint / 2
            this.#setTranslate(this.$slideLine, { pos: this.initialSlidePos.pos, colGap: this.initialSlidePos.colGap, swipe: this.swipePoint })

            this.offTransition
            this.swipe = true
        }

        function move(swipe = e.movementX) {
            const sign = swipe > 0 ? 1 : -1
            if (Math.abs(swipe) * 2 < Math.abs(this.prevSwipe) || Math.abs(swipe) / 2 > Math.abs(this.prevSwipe))
                swipe = (Math.abs(swipe) + Math.abs(this.prevSwipe)) / 2 * sign
            this.prevSwipe = swipe

            if (swipe !== 0) {
                swipe *= this.opt.swipeEventOpt.sensitivity

                this.changePoint += swipe
                this.#syncViewSlide()
                this.#setTranslate(this.$slideLine, { pos: this.initialSlidePos.pos, colGap: this.initialSlidePos.colGap, swipe: this.changePoint })

            }
        }

        function swipeEnd(kb = false) {
            this.swipe = false
            curContext = undefined
            if (!kb) this.viewSlide(this.curInd, { transform: !this.opt.swipeEventOpt.free, transition: false })
            else kickback.bind(this)()
        }

        function kickback() {
            const lastSwipe = this.prevSwipe
            let kickbackArr = [lastSwipe]
            const sign = lastSwipe > 0 ? 1 : -1
            let pointQant = Math.abs(lastSwipe * 0.2)
            pointQant < 1 ? pointQant = 1 : null

            for (let i = 1; ; i++) {
                const lastAbsVal = Math.abs(kickbackArr[kickbackArr.length - 1])
                const minus = lastAbsVal / pointQant
                let newVal = lastAbsVal - minus
                newVal *= sign

                if (sign > 0) {
                    if (newVal > 1) kickbackArr.push(newVal)
                    else { kickbackArr.push(0); break }
                } else {
                    if (newVal < -1) kickbackArr.push(newVal)
                    else { kickbackArr.push(0); break }
                }
            }

            let i = 0
            this.kickbackInterval = setInterval(() => {
                const val = kickbackArr[i]
                move.bind(this)(val)
                i++
                if (i > kickbackArr.length - 1) {
                    clearInterval(this.kickbackInterval)
                    this.viewSlide(this.curInd, { transform: !this.opt.swipeEventOpt.free })
                }
            }, 1)
        }
    }

    #transitionendEvent(e) {
        this.initialSlideRect = this.getCurSlideRect
    }

    #breakpointEvent() {
        const docSize = document.documentElement.clientWidth
        mliderArr.forEach(mlider => {
            if (mlider.opt.breakpoint) mlider.resetOptOnBp(docSize, true)
        })
    }







    test() {
    }

    get getRectChange() {
        const newSLLeft = this.$slideLine.getBoundingClientRect().left
        let change = newSLLeft - this.sLLeft + (this.shiftPoint || 0)
        this.sLLeft = newSLLeft
        this.shiftPoint = 0
        return change
    }

    get getLimitPoint() {
        return this.opt.slideRect[this.trueInd].width + this.opt.slideRect[this.trueInd].step * this.opt.columnGap
    }

    get getCurSlideRect() {
        if (this.opt.slide.position === 'left') {
            return this.opt.slideRect[this.curInd].slides[0].link.getBoundingClientRect().left
        } else if (this.opt.slide.position === 'right') {
            return this.opt.slideRect[this.curInd].slides[this.opt.slideRect[this.curInd].slides.length - 1].link.getBoundingClientRect().right
        } else if (this.opt.slide.position === 'center') {
            return this.opt.slideRect[this.curInd].slides[0].link.getBoundingClientRect().left
                + (this.opt.slideRect[this.curInd].slides[0].link.getBoundingClientRect().width / 2)
        }
    }

    get saveInitialSlidePos() {
        this.initialSlidePos = {
            pos: this.opt.slideRect[this.curInd][this.opt.slide.position],
            colGap: this.opt.slideRect[this.curInd].calcColGap,
        }
    }
}



// ============================== INFO
// !!!CANNOT apply transition on slides
// console.time() -> 1-3 ms