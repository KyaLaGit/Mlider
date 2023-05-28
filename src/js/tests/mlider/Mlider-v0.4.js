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
            swipeEvent: true,
            swipeEventOpt: {
                sensitivity: 1,
            },
            slideGroup: 1,
            autoViewSlide: false,
            autoViewSlideOpt: {
                time: 0,
                direction: 'right',
            },
            breakpoint: {

            },
        }

        this.#checkElements()
        this.#checkOptions(this.opt)
        this.#optionsRegulation()
        console.log("this.opt:", this.opt.slide.preView)

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

    #checkOptions(options, innerDefOpt, innerName) {
        const defOpt = innerDefOpt ? innerDefOpt : this.defualtOptions
        if (typeof options === 'object' && !Array.isArray(options)) {
            for (let key in options) {
                const name = innerName ? innerName + key[0].toUpperCase() + key.slice(1) : key
                if (typeof defOpt[key] === 'number') {
                    options[key] = this.#checkNumberOpt(options[key], defOpt[key], name)
                } else if (typeof defOpt[key] === 'string') {
                    options[key] = this.#checkStringOpt(options[key], defOpt[key], name)
                } else if (typeof defOpt[key] === 'boolean') {
                    options[key] = this.#checkBooleanOpt(options[key], defOpt[key], name)
                } else if (typeof defOpt[key] === 'object') {
                    this.#checkOptions(options[key], defOpt[key], name)
                }
                // else if (typeof defOpt[key] === 'undefined') {
                //     if (name.includes('breakpoint')) {
                //         options[key] = this.#checkNumberOpt(options[key], 0, name)
                //     } else {
                //     }
                //     this.#errorLog(name, 'udefined value')
                // }
            }
        } else {
            this.#errorLog(innerName, 'invalid value(!use defualt value!)')
        }
    }

    #optionsRegulation() {
        this.opt = Object.assign(Object.assign({}, this.defualtOptions), this.opt)
        this.opt.slide = Object.assign(Object.assign({}, this.defualtOptions.slide), this.opt.slide)
        this.opt.swipeEventOpt = Object.assign(Object.assign({}, this.defualtOptions.swipeEventOpt), this.opt.swipeEventOpt)
        this.opt.autoViewSlideOpt = Object.assign(Object.assign({}, this.defualtOptions.autoViewSlideOpt), this.opt.autoViewSlideOpt)

        if (!Array.isArray(this.opt.slide.preView)) this.opt.slide.preView = [this.opt.slide.preView]
        if (!Array.isArray(this.opt.slide.step)) this.opt.slide.step = [this.opt.slide.step]

        if (this.opt.slide.preView.flat().includes(0)) this.opt.slide.preView = [1]
        if (this.opt.slide.step.flat().includes(0)) this.opt.slide.step = this.opt.slide.preView

        this.opt.slide.preView = this.opt.slide.preView.map(opt => {
            if (!Array.isArray(opt)) {
                const val = opt === 0 ? 1 : opt
                opt = []
                for (let i = 0; i < Math.floor(val); i++) { opt.push(100 / val) }
            } else {
                const optSum = opt.reduce((acc, val) => acc + val, 0)
                const nullQant = opt.filter(opt => opt === 0).length
                opt = opt.map(opt => opt === 0 ? (100 - optSum) / nullQant : opt)
            }
            return opt
        })
        this.opt.slide.step = this.opt.slide.step.map(opt => Array.isArray(opt) ? opt.length : Math.floor(opt))
        if (this.opt.slide.step.every(opt => opt === this.opt.slide.step[0])) this.opt.slide.step = [this.opt.slide.step[0]]
    }





    // CHECKS
    #checkNumberOpt(opt, defOpt, name) {
        if (Array.isArray(opt)) {
            return opt.map(opt => {
                return this.#checkNumberOpt(opt, defOpt, name)
            })
        } else if (typeof opt === 'number') return Math.abs(opt)
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
            if (name === 'slidePosition') {
                if (opt === 'left' || opt === 'center' || opt === 'right' || opt === 'auto') {
                    return opt
                }
            } else if (name === 'autoViewSlideOptDirection') {
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
        // generate slides group
        let slidesJoin = ''
        this.$slides.forEach((slide, ind) => {
            slide.setAttribute('data-mlider-index', ind)
            slidesJoin += slide.outerHTML
        })

        // generate inner wrap
        this.$wrap.innerHTML = ''
        this.$wrap.insertAdjacentHTML('afterbegin', `
                <div class="sub-slide-line">
                    <div class="slide-line">${slidesJoin}</div>
                </div>
        `)
        this.$slides = Array.from(this.$slider.querySelectorAll(this.selectors.slideSelector))
        this.$slideLine = this.$slider.querySelector('.slide-line')
        this.$subSlideLine = this.$slider.querySelector('.sub-slide-line')
        this.slideLngth = this.$slides.length

        // generate layouts
        this.#generateLayouts(this.opt)

        // others
        this.$wrap.setAttribute('data-mlider-type', 'wrapper')
        if (this.$prevBtn) this.$prevBtn.setAttribute('data-mlider-type', 'prev-btn')
        if (this.$nextBtn) this.$nextBtn.setAttribute('data-mlider-type', 'next-btn')

        if (this.$dot) {
            const dot = this.$dot
            const dotParent = this.$dot.parentElement
            dotParent.innerHTML = ''
            dot.setAttribute('data-mlider-type', 'dot')
            for (let i = 0; i < this.mainSlideLngth; i++) {
                dot.setAttribute('data-mlider-index', i)
                this.opt.counterInDot ? dot.innerHTML = i : null
                dotParent.insertAdjacentHTML('beforeend', dot.outerHTML)
            }
            this.opt.dots = this.$slider.querySelectorAll(this.selectors.dotSelector)
        }
    }

    #generateLayouts(option) {
        this.stepLayout = []
        this.styleLayout = []

        for (let i = 0, ind = 0; i <= this.slideLngth;) {
            const val = option.slide.step[ind % option.slide.step.length]
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
            const val = option.slide.preView[ind % option.slide.preView.length]
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
    }

    #styles() {
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

        this.$slides.forEach(slide => {
            slide.style.cssText += `
                height: 100%;
                `
        })

        this.#generateFlexSizes(this.opt)
    }

    #generateFlexSizes() {
        let ind = 0
        for (let i = 0; i < this.styleLayout.length; i++) {
            for (let u = 0; u < this.styleLayout[i].length; u++) {
                this.$slides[ind].style.flex = `0 0 calc(${this.styleLayout[i][u]}% - (${this.opt.columnGap}px 
                            - (${this.opt.columnGap}px / ${this.styleLayout[i].length})))`
                ind++
            }
        }
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
        this.opt.autoViewSlide ? this.#intervalView() : null
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
        this.$slider.addEventListener('click', this.mouseEvent.bind(this))

        if (this.opt.keyboardEvent) {
            document.addEventListener('keydown', this.keyboardEvent.bind(this))
        }

        if (this.opt.swipeEvent) {
            this.swipe = false
            this.swipePoint = 0
            this.swipeEvent = this.swipeEvent.bind(this)
            document.addEventListener('mousedown', this.swipeEvent)
            document.addEventListener('mousemove', this.swipeEvent)
            document.addEventListener('mouseup', this.swipeEvent)
        }

        if (this.opt.breakpoint) {
            window.addEventListener('resize', this.breakpointEvent.bind(this))
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
            this.swipePoint += e.movementX * this.opt.swipeEventOpt.sensitivity
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

    breakpointEvent(e) {
        const docSize = document.documentElement.clientWidth

        if (docSize <= 1024) {

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










    // GETTERS AND SETTERS
    get setCurrentClasses() {
        this.opt.mainSlideRect[this.prevInd].slides.forEach(slide => { slide.classList.remove(this.opt.currentClass) })
        this.opt.mainSlideRect[this.curInd].slides.forEach(slide => { slide.classList.add(this.opt.currentClass) })

        if (this.$dot) {
            this.opt.dots[this.#toInit(this.prevInd)].classList.remove(this.opt.currentClass)
            this.opt.dots[this.#toInit(this.curInd)].classList.add(this.opt.currentClass)
        }

        if (this.$counter) {
            this.$counter.innerHTML = `<span>${this.#toInit(this.curInd)}</span>/<span>${this.mainSlideLngth - 1}</span>`
        }
    }

    get validKeyElements() {
        let check
        this.$slider && this.$slides.length > 0 ? check = true : (check = false, console.log('invalidKeyElements'))
        return check
    }

    #toInit(ind) {
        while (ind > this.mainSlideLngth - 1) {
            ind -= this.mainSlideLngth
        }
        return ind
    }
}








// ============================== INFO
// !!!CANNOT apply transition on slides
// console.time() -> 1-3 ms


