export class Mlider {
    constructor(selectors, opt) {
        this.selectors = selectors
        this.opt = opt !== undefined ? opt : {}
        this.curInd = 0
        this.prevInd = 0
        this.action = 0

        this.defualtOptions = {
            infinity: false,
            slide: {
                preView: 0,
                position: 'left',
                step: 0,
            },
            columnGap: 0,
            currentClass: 'current',
            transitionTime: 400,
            counterInDot: false,
            keyboardEvent: true,
            swipeEvent: {
                sensitivity: 1,
            },
            slideGroup: 1,
            autoViewSlide: {
                time: 0,
                direction: 'right',
            },
            breakpoint: {

            },
        }

        this.#checkElements()
        this.#checkOptions()
        if (this.validKeyElements) {
            this.#generate()
            this.#styles()

            this.#rectReset(true)
            this.#event()
            this.viewSlide()
        }
    }

    // ERROR
    #errorLog(name, info) {
        console.log(`ERROR --- ${name.join('.')} (${info})`)
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
        this.opt.slide = this.#checkBooleanOpt(this.opt.slide, ['slide'])
        if (this.opt.slide) {
            this.opt.slide = Object.assign(Object.assign({}, this.defualtOptions.slide), this.opt.slide)
            this.opt.slide.preView = this.#checkNumberOpt(this.opt.slide.preView, ['slide', 'preView'])
            this.opt.slide.position = this.#checkStringOpt(this.opt.slide.position, ['slide', 'position'])
            this.opt.slide.step = this.#checkNumberOpt(this.opt.slide.step, ['slide', 'step'])
        }

        this.opt.swipeEvent = this.#checkBooleanOpt(this.opt.swipeEvent, ['swipeEvent'])
        if (this.opt.swipeEvent) {
            this.opt.swipeEvent = Object.assign(Object.assign({}, this.defualtOptions.swipeEvent), this.opt.swipeEvent)
            this.opt.swipeEvent.sensitivity = this.#checkNumberOpt(this.opt.swipeEvent.sensitivity, ['swipeEvent', 'sensitivity'])
        }

        this.opt.autoViewSlide = this.#checkBooleanOpt(this.opt.autoViewSlide, ['autoViewSlide'], false)
        if (this.opt.autoViewSlide) {
            this.opt.autoViewSlide = Object.assign(Object.assign({}, this.defualtOptions.autoViewSlide), this.opt.autoViewSlide)
            this.opt.autoViewSlide.time = this.#checkNumberOpt(this.opt.autoViewSlide.time, ['autoViewSlide', 'time'])
            this.opt.autoViewSlide.direction = this.#checkStringOpt(this.opt.autoViewSlide.direction, ['autoViewSlide', 'direction'])
        }

        this.opt.infinity = this.#checkBooleanOpt(this.opt.infinity, ['infinity'])
        this.opt.counterInDot = this.#checkBooleanOpt(this.opt.counterInDot, ['counterInDots'])
        this.opt.keyboardEvent = this.#checkBooleanOpt(this.opt.keyboardEvent, ['keyboardEvent'])
        this.opt.currentClass = this.#checkStringOpt(this.opt.currentClass, ['currentClass'])
        this.opt.transitionTime = this.#checkNumberOpt(this.opt.transitionTime, ['transitionTime'])
        this.opt.columnGap = this.#checkNumberOpt(this.opt.columnGap, ['columnGap'])
        this.opt.slideGroup = this.#checkNumberOpt(this.opt.slideGroup, ['slideGroup'])

        // Other
        if (!Array.isArray(this.opt.slide.preView)) this.opt.slide.preView = [this.opt.slide.preView]
        if (!Array.isArray(this.opt.slide.step)) this.opt.slide.step = [this.opt.slide.step]

        if (this.opt.slide.preView.flat().includes(0)) this.opt.slide.preView = [1]
        if (this.opt.slide.step.flat().includes(0)) this.opt.slide.step = this.opt.slide.preView

        this.opt.slide.preView = this.opt.slide.preView.map(opt => {
            if (!Array.isArray(opt)) {
                const val = opt
                opt = []
                for (let i = 0; i < Math.floor(val); i++) { opt.push(100 / val) }
            }
            return opt
        })
        this.opt.slide.step = this.opt.slide.step.map(opt => Array.isArray(opt) ? opt.length : Math.floor(opt))
        if (this.opt.slide.step.every(opt => opt === this.opt.slide.step[0])) this.opt.slide.step = [this.opt.slide.step[0]]
    }





    // CHECKS
    #checkNumberOpt(option, name, defVal) {
        const defualtOption = defVal ? defVal : (name.length === 2 ? this.defualtOptions[name[0]][name[1]] : this.defualtOptions[name[0]])
        if (Array.isArray(option)) {
            return option.map(opt => this.#checkNumberOpt(opt, name))
        } else {
            if (typeof option === 'string') {
                option = option.trim()
                option = parseInt(option)
                if (isNaN(option)) {
                    option = defualtOption
                    this.#errorLog(name, 'invalid value(!use defualt value!)')
                }
            } else if (typeof option === 'undefined') {
                option = defualtOption
            } else if (typeof option !== 'number') {
                option = defualtOption
                this.#errorLog(name, 'invalid value(!use defualt value!)')
            }
            return Math.abs(option)
        }
    }

    #checkBooleanOpt(option, name, defVal) {
        const defualtOption = defVal ? defVal : (name.length === 2 ? this.defualtOptions[name[0]][name[1]] : this.defualtOptions[name[0]])
        if (typeof option === 'string') {
            option = option.trim()
            if (option !== 'true' && option !== 'false') {
                option = defualtOption
                this.#errorLog(name, 'invalid value(!use defualt value!)')
            }
        } else if (typeof option === 'undefined') {
            option = defualtOption
        } else if (typeof option !== 'boolean') {
            if (name[0] === 'slide' || name[0] === 'swipeEvent' || name[0] === 'autoViewSlide' || name[0] === 'breakpoint') {
                if (!(typeof option === 'object' && !Array.isArray(option))) {
                    option = defualtOption
                    this.#errorLog(name, 'invalid value(!use defualt value!)')
                }
            } else {
                option = defualtOption
                this.#errorLog(name, 'invalid value(!use defualt value!)')
            }
        }

        return option
    }

    #checkStringOpt(option, name, defVal) {
        const defualtOption = defVal ? defVal : (name.length === 2 ? this.defualtOptions[name[0]][name[1]] : this.defualtOptions[name[0]])
        if (typeof option === 'string') {
            option = option.trim()
            if (name === 'slidePosition') {
                if (!(option === 'left' || option === 'center' || option === 'right' || option === 'auto')) {
                    option = defualtOption
                    this.#errorLog(name, 'invalid value(!use defualt value!)')
                }
            } else if (name === 'autoViewSlide') {
                if (!(option === 'left' || option === 'right')) {
                    option = defualtOption
                    this.#errorLog(name, 'invalid value(!use defualt value!)')
                }
            } else if (option === '') {
                option = defualtOption
                this.#errorLog(name, 'invalid value(!use defualt value!)')
            }
        } else if (typeof option === 'undefined') {
            option = defualtOption
        } else {
            option = defualtOption
            this.#errorLog(name, 'invalid value(!use defualt value!)')
        }

        return option
    }





    // GENERATE
    #generate() {
        this.initSlideLngth = this.$slides.length
        let slidesJoin = ''

        // generate slides group
        if (this.opt.slideGroup === 0) {
            if (this.opt.infinity) {
                let slidesQuantity = 15
                slidesQuantity *= this.opt.transitionTime / 1000
                slidesQuantity *= this.opt.slide.step
                slidesQuantity < 10 ? slidesQuantity = 10 : null
                this.opt.slideGroup = slidesQuantity / this.initSlideLngth
                this.opt.slideGroup = Math.ceil(Number(this.opt.slideGroup))
            } else {
                this.opt.slideGroup = 1
            }
        }
        let ind = 0
        for (let i = 0; i < this.opt.slideGroup; i++) {
            this.$slides.forEach(slide => {
                // slide.classList.contains(this.opt.currentClass) ? this.action = ind : null
                slide.setAttribute('data-mlider-index', ind)
                slidesJoin += slide.outerHTML
                ind++
            })
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
        this.$slides = Array.from(this.$slider.querySelectorAll(this.selectors.slideSelector))
        this.$slideLine = this.$slides[0].parentElement
        this.slideLngth = this.$slides.length

        // generate layouts
        this.stepLayout = []
        this.styleLayout = []

        for (let i = 0, ind = 0; i <= this.slideLngth;) {
            const val = this.opt.slide.step[ind % this.opt.slide.step.length]
            const residue = this.slideLngth - i

            if (residue > val) {
                this.stepLayout.push(val)
                ind++
                i += val
            } else {
                this.stepLayout.push(residue)
                break
            }
        }
        for (let i = 0, ind = 0; i <= this.slideLngth;) {
            const val = this.opt.slide.preView[ind % this.opt.slide.preView.length]
            const residue = this.slideLngth - i

            if (residue > val.length) {
                this.styleLayout.push(val)
                ind++
                i += val.length
            } else {
                this.styleLayout.push(val.slice(0, residue))
                break
            }
        }

        this.mainSlideLngth = this.stepLayout.length
        // WARNING  
        this.initMainSlideLngth = this.stepLayout.length

        // others
        this.$wrap.setAttribute('data-mlider-type', 'wrapper')
        this.$prevBtn ? this.$prevBtn.setAttribute('data-mlider-type', 'prev-btn') : null
        this.$nextBtn ? this.$nextBtn.setAttribute('data-mlider-type', 'next-btn') : null

        if (this.$dot) {
            const dot = this.$dot
            const dotParent = this.$dot.parentElement
            this.$dot.remove()
            dot.setAttribute('data-mlider-type', 'dot')

            for (let i = 0; i < this.initMainSlideLngth; i++) {
                dot.setAttribute('data-mlider-index', i)
                this.opt.counterInDot ? dot.innerHTML = i : null
                dotParent.insertAdjacentHTML('beforeend', dot.outerHTML)
            }
            this.opt.dots = this.$slider.querySelectorAll(this.selectors.dotSelector)
        }
    }

    #styles() {
        const flexSizes = function () {
            const arr = []
            if (this.opt.slide.preView[0] === 0) {
                while (arr.length < this.slideLngth) {
                    arr.push('')
                }
            } else {
                for (let i = 0; i < this.styleLayout.length; i++) {
                    for (let u = 0; u < this.styleLayout[i].length; u++) {
                        arr.push(`flex: 0 0 calc(${this.styleLayout[i][u]}% - (${this.opt.columnGap}px 
                            - (${this.opt.columnGap}px / ${this.styleLayout[i].length})));`)
                    }
                }
            }
            return arr
        }.bind(this)()

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
            transition: transform ${this.opt.transitionTime / 1000}s ease;
        `

        this.$slides.forEach((slide, i) => {
            slide.style.cssText += `
                ${flexSizes[i]}
                height: 100%;
                `
        })
    }







    // VIEW SLIDES
    viewSlide(ind = 0) {
        // index and actions
        this.prevInd = this.curInd
        this.curInd = this.#getCheckInd(ind)
        this.action = this.opt.mainSlideRect[this.curInd].pos - Math.floor(this.mainSlideLngth / 2)
        this.opt.infinity ? this.slideShift() : null

        // main actions
        if (this.opt.infinity) this.$subSlideLine.style.transform = `translateX(${this.opt.moveSlidePoint}px)`
        this.$slideLine.style.transform = `translateX(${this.opt.mainSlideRect[this.curInd][this.opt.slide.position]}px)`

        // others
        this.setCurrentClasses
        this.opt.autoViewSlide.time ? this.#intervalView() : null
    }

    slideShift() {
        for (let i = 0; i < Math.abs(this.action); i++) {
            if (this.action > 0) {
                for (let v = 0; v < this.opt.rectByPos(0).step; v++) {
                    const slide = this.opt.rectByPos(0).slides[v]
                    this.$slideLine.insertAdjacentHTML('beforeend', `${slide.outerHTML}`)
                    slide.remove()
                }
                this.opt.rectPosUpdate(1)
            } else if (this.action < 0) {
                for (let v = this.opt.rectByPos(this.mainSlideLngth - 1).step - 1; v >= 0; v--) {
                    const slide = this.opt.rectByPos(this.mainSlideLngth - 1).slides[v]
                    this.$slideLine.insertAdjacentHTML('afterbegin', `${slide.outerHTML}`)
                    slide.remove()
                }
                this.opt.rectPosUpdate(-1)
            }
        }
        this.#rectReset()
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

    #rectReset(first) {
        if (first) {
            this.opt.wrapRect = this.$wrap.getBoundingClientRect()
            this.opt.mainSlideRect = []
            this.opt.secSlideRect = []
            this.opt.moveSlidePoint = 0

            // main slides rect
            let secInd = 0
            for (let ind = 0; ind < this.stepLayout.length; ind++) {
                const mainRect = {}
                let leftValues = []
                let rightValues = []
                let slideValues = []
                let widthValue = 0

                for (let i = 0; i < this.stepLayout[ind]; i++) {
                    const slide = this.$slides[secInd]
                    const slideRect = slide.getBoundingClientRect()
                    const wrapRect = this.opt.wrapRect

                    leftValues.push(-(slideRect.left - wrapRect.left))
                    rightValues.push(wrapRect.right - slideRect.right)
                    slideValues.push(slide)
                    widthValue += slideRect.width + this.opt.columnGap

                    secInd++
                }

                mainRect.ind = ind
                mainRect.pos = ind
                mainRect.step = this.stepLayout[ind]
                mainRect.left = Math.max(...leftValues)
                mainRect.right = Math.min(...rightValues)
                mainRect.center = (mainRect.left + mainRect.right) / 2
                mainRect.width = widthValue
                mainRect.slides = slideValues

                this.opt.mainSlideRect.push(mainRect)
            }

            this.opt.rectByPos = (pos) => {
                for (let i = 0; i < this.mainSlideLngth; i++) {
                    if (this.opt.mainSlideRect[i].pos === pos) {
                        return this.opt.mainSlideRect[i]
                    }

                }
            }

            this.opt.rectPosUpdate = (act) => {
                for (let i = 0; i < this.mainSlideLngth; i++) {
                    const mainRect = this.opt.mainSlideRect[i]
                    mainRect.pos = this.#getCheckInd(mainRect.pos - act)
                }
            }
        } else {
            // slides opt update
            for (let i = 0; i < this.mainSlideLngth; i++) {
                const mainRect = this.opt.mainSlideRect[i]
                mainRect.slides = mainRect.slides.map(slide => this.$slideLine.querySelector(`[data-mlider-index="${slide.getAttribute('data-mlider-index')}"]`))
            }

            // for sub slide line   
            if (this.opt.infinity && this.action && this.action !== 0) {
                let moveSlideWdth
                this.action > 0
                    ? moveSlideWdth = this.opt.rectByPos(this.mainSlideLngth - 1).width
                    : moveSlideWdth = this.opt.rectByPos(0).width

                if (Math.abs(this.action) > 1) {
                    moveSlideWdth = 0
                    if (this.action > 0) {
                        for (let i = 1; i < Math.abs(this.action) + 1; i++) {
                            moveSlideWdth += this.opt.rectByPos(this.mainSlideLngth - i).width
                        }
                    } else if (this.action < 0) {
                        for (let i = 0; i < Math.abs(this.action); i++) {
                            moveSlideWdth += this.opt.rectByPos(i).width
                        }
                    }
                }

                this.action > 0
                    ? this.opt.moveSlidePoint += moveSlideWdth
                    : this.opt.moveSlidePoint -= moveSlideWdth
            }
        }
        this.#mainRectUpdate()
    }

    #mainRectUpdate() {
        for (let i = Math.abs(this.action); i > 0; i--) {
            if (this.action > 0) {
                const curRect = this.opt.rectByPos(this.mainSlideLngth - i)
                const prevRect = this.opt.rectByPos(this.mainSlideLngth - i - 1)

                curRect.left = prevRect.left - prevRect.width
                curRect.right = prevRect.right - curRect.width
                curRect.center = prevRect.center - (prevRect.width / 2) - (curRect.width / 2)
            } else if (this.action < 0) {
                const curRect = this.opt.rectByPos(i - 1)
                const nextRect = this.opt.rectByPos(i)

                curRect.left = nextRect.left + curRect.width
                curRect.right = nextRect.right + nextRect.width
                curRect.center = nextRect.center + (nextRect.width / 2) + (curRect.width / 2)
            }
        }
    }









    // EVENTS
    #event() {
        this.mouseEvent = this.mouseEvent.bind(this)
        this.$slider.addEventListener('click', this.mouseEvent)

        if (this.opt.keyboardEvent) {
            this.keyboardEvent = this.keyboardEvent.bind(this)
            document.addEventListener('keydown', this.keyboardEvent)
        }

        if (this.opt.swipeEvent) {
            this.swipe = false
            this.swipePoint = 0
            this.swipeEvent = this.swipeEvent.bind(this)
            document.addEventListener('mousedown', this.swipeEvent)
            document.addEventListener('mousemove', this.swipeEvent)
            document.addEventListener('mouseup', this.swipeEvent)
        }
    }

    mouseEvent(e) {
        const elem = e.target

        if (elem.closest('[data-mlider-type="prev-btn"]')) {
            this.viewSlide(this.curInd - 1)
        } else if (elem.closest('[data-mlider-type="next-btn"]')) {
            this.viewSlide(this.curInd + 1)
        } else if (elem.closest('[data-mlider-type="dot"]')) {
            const elemInd = Number(elem.closest('[data-mlider-type="dot"]').getAttribute('data-mlider-index'))
            this.viewSlide(elemInd)
        }
    }

    keyboardEvent(e) {
        const key = e.key
        const repeat = e.repeat

        if (key === 'ArrowLeft' && !repeat) {
            this.viewSlide(this.curInd - 1)
        } else if (key === 'ArrowRight' && !repeat) {
            this.viewSlide(this.curInd + 1)
        }
    }

    swipeEvent(e) {
        const target = e.target
        const type = e.type

        if (type === 'mousedown' && target.closest('[data-mlider-type="wrapper"]')) {
            this.swipe = true
            const firstSlideRect = this.opt.mainSlideRect[this.curInd].slides[0].getBoundingClientRect()
            this.swipePoint = this.prevLeftVal ? this.prevLeftVal - firstSlideRect.left : 0
            this.$slideLine.style.transition = `none`
        } else if (type === 'mousemove' && this.swipe) {
            this.swipePoint += e.movementX * this.opt.swipeEvent.sensitivity
            this.$slideLine.style.transform = `translate(${this.opt.mainSlideRect[this.curInd][this.opt.slide.position] + this.swipePoint}px, 0px)`
        } else if (type === 'mouseup') {
            this.swipe = false
            this.$slideLine.style.transition = `transform ${this.opt.transitionTime / 1000}s ease`

            const curRect = this.opt.mainSlideRect[this.curInd][this.opt.slide.position]
            const curPos = this.opt.mainSlideRect[this.curInd].pos
            if (curRect + this.swipePoint < this.opt.rectByPos(curPos + 1)[this.opt.slide.position] + 500) {
                this.viewSlide(this.curInd + 1)
            } else if (curRect + this.swipePoint > this.opt.rectByPos(curPos - 1)[this.opt.slide.position] - 500) {
                this.viewSlide(this.curInd - 1)
            } else {
                this.viewSlide(this.curInd)
            }

            this.prevLeftVal = this.opt.mainSlideRect[this.curInd].slides[0].getBoundingClientRect().left
        }
    }

    #intervalView() {
        clearInterval(this.interval)
        this.interval = setInterval(() => {

            if (this.opt.autoViewSlide.direction === 'left') {
                this.viewSlide(this.curInd - 1)
            } else if (this.opt.autoViewSlide.direction === 'right') {
                this.viewSlide(this.curInd + 1)
            }

        }, this.opt.autoViewSlide.time)
    }










    // GETTERS AND SETTERS
    get setCurrentClasses() {
        this.opt.mainSlideRect[this.prevInd].slides.forEach(slide => { slide.classList.remove(this.opt.currentClass) })
        this.opt.mainSlideRect[this.curInd].slides.forEach(slide => { slide.classList.add(this.opt.currentClass) })

        if (this.$dot) {
            this.opt.dots[this.#toInit(this.prevInd)].classList.remove(this.opt.currentClass)
            this.opt.dots[this.#toInit(this.curInd)].classList.add(this.opt.currentClass)
        }

        if (this.$counter) {
            this.$counter.innerHTML = `<span>${this.#toInit(this.curInd)}</span>/<span>${this.initMainSlideLngth - 1}</span>`
        }
    }

    get validKeyElements() {
        let check
        this.$slider && this.$slides.length > 0 ? check = true : (check = false, console.log('invalidKeyElements'))
        return check
    }

    #toInit(ind) {
        while (ind > this.initMainSlideLngth - 1) {
            ind -= this.initMainSlideLngth
        }
        return ind
    }
}








// ============================== INFO
// !!!CANNOT apply transition on slides
// console.time() -> 1-3 ms


