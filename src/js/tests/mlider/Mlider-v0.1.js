export class Mlider {
    constructor(selectors, options) {
        this.selectors = selectors
        this.curInd = 0
        this.initInd = 0
        this.trnsfrmPoint = 0
        this.trnsfrmPointWrap = 0
        this.action = 0
        this.rect = {}
        this.autoViewPar = []

        this.defualtOptions = {
            infinity: false,
            slideSize: 'castom',
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
        }
        Object.assign(Object.assign(this.options = {}, this.defualtOptions), options)

        this.#setup()

        if (this.validKeyElements) {
            this.#event()
            this.viewSlide(this.action, true)
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
        this.infinityOpt = this.#setCheckedBooleanOption(this.options.infinity, 'infinity')
        this.saveSlideSizeOpt = this.#setCheckedBooleanOption(this.options.saveSlideSize, 'saveSlideSize')
        this.counterInDotsOpt = this.#setCheckedBooleanOption(this.options.counterInDots, 'counterInDots')
        this.keyboardEventsOpt = this.#setCheckedBooleanOption(this.options.keyboard, 'keyboardEvents')

        // String opt
        this.slideSizeOpt = this.#setCheckedStringOption(this.options.slideSize, 'slideSize')
        this.slidePositionOpt = this.#setCheckedStringOption(this.options.slidePosition, 'slidePosition')
        this.currentClassOpt = this.#setCheckedStringOption(this.options.currentClass, 'currentClass')

        // Number opt
        this.preViewSlidesOpt = this.#setCheckedNumberOption(this.options.preViewSlides, 'preViewSlides')
        this.animationTimeOpt = this.#setCheckedNumberOption(this.options.animationTime, 'animationTime')
        this.columnGapOpt = this.#setCheckedNumberOption(this.options.columnGap, 'columnGap')
        this.slidesGroupOpt = this.#setCheckedNumberOption(this.options.slidesGroup, 'slidesGroup')
        this.autoViewSlideTimeOpt = this.#setCheckedNumberOption(this.options.autoViewSlideTime, 'autoViewSlideTime')
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
        } else if (typeof option !== 'number') {
            option = this.defualtOptions[name]
            this.#errorLog(name, 'invalid value(!use defualt value!)')
        }

        return option
    }

    #setCheckedBooleanOption(option, name) {
        if (typeof (option) === 'string') {
            option = option.trim()
            if (option !== 'true' && option !== 'false') {
                option = this.defualtOptions[name]
                this.#errorLog(name, 'invalid value(!use defualt value!)')
            }
        } else if (typeof (option) !== 'boolean') {
            option = this.defualtOptions[name]
            this.#errorLog(name, 'invalid value(!use defualt value!)')
        }

        return option
    }

    #setCheckedStringOption(option, name) {
        if (typeof (option) === 'string') {
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
        } else {
            option = this.defualtOptions[name]
            this.#errorLog(name, 'invalid value(!use defualt value!)')
        }

        return option
    }






    // GENERATE
    #generate() {
        this.slidesLength = this.$slides.length
        const dotsArr = []
        let slidesJoin = ''
        let b = 0

        // generate slides group
        let slidesGroup = this.slidesGroupOpt
        if (this.slidesGroupOpt === 0) {
            if (this.infinityOpt) {
                let slidesQuantity = 15
                slidesQuantity *= this.animationTimeOpt / 1000
                slidesQuantity < 8 ? slidesQuantity = 8 : null
                slidesGroup = slidesQuantity / this.slidesLength
                slidesGroup = Number(slidesGroup.toFixed(0))
            } else {
                slidesGroup = 1
            }
        }
        for (let i = 0; i < slidesGroup; i++) {
            for (let i = 0; i < this.$slides.length; i++) {
                const slide = this.$slides[i]
                slide.setAttribute('data-mlider-index', b)
                slide.classList.contains(this.currentClassOpt) ? (this.action = b, slide.classList.remove(this.currentClassOpt)) : null
                slidesJoin += slide.outerHTML
                b++

                if (this.$dot && b <= this.$slides.length) {
                    const dot = this.$dot
                    dot.setAttribute('data-mlider-type', 'dot')
                    dot.setAttribute('data-mlider-index', i)
                    dotsArr.push(dot.outerHTML)
                }
            }
        }

        // set attributes
        this.$prevBtn ? this.$prevBtn.setAttribute('data-mlider-type', 'prev-btn') : null
        this.$nextBtn ? this.$nextBtn.setAttribute('data-mlider-type', 'next-btn') : null

        // generate slide line
        this.$wrap.innerHTML = ''
        if (this.infinityOpt) {
            this.$wrap.insertAdjacentHTML('afterbegin', `
                <div class="slide-line-second">
                    <div class="slide-line">${slidesJoin}</div>
                </div>
            `)
            this.$subSlideLine = this.$slider.querySelector('.slide-line-second')
        } else {
            this.$wrap.insertAdjacentHTML('afterbegin', `
                <div class="slide-line">${slidesJoin}</div>
            `)
        }
        this.setSlides
        this.$slideLine = this.$slides[0].parentElement

        // rect
        this.rect = this.rectReset

        // other
        if (this.$dot) {
            this.$dot.parentElement.innerHTML = dotsArr.join('')
            this.$dots = this.$slider.querySelectorAll(this.selectors.dotSelector)

            if (this.counterInDotsOpt) {
                for (let i = 0; i < this.$dots.length; i++) {
                    this.$dots[i].innerHTML = i
                }
            }
        }

        if (this.$counter) {
            this.$counter.innerHTML = `<span>${this.initInd}</span>/<span>${this.slidesLength - 1}</span>`
        }
    }

    #styles() {
        const getSlideSizeOpt = () => {
            if (this.slideSizeOpt === 'auto') {
                return ``
            } else if (this.slideSizeOpt === 'castom') {
                if (this.saveSlideSizeOpt === true) {
                    return `flex: 0 0 ${100 / this.preViewSlidesOpt}%;`
                } else {
                    return `
                        flex: 0 0 calc(${100 / this.preViewSlidesOpt}% - (${this.rect.gap}px - (${this.rect.gap}px / ${this.preViewSlidesOpt})));
                    `
                }
            }
        }

        if (this.infinityOpt) {
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
            column-gap: ${this.columnGapOpt}px;
            transition: transform ${this.animationTimeOpt / 1000}s ease;
        `

        this.$slides.forEach(slide => {
            slide.style.cssText += `
                ${getSlideSizeOpt()}
                height: 100%;
            `
        })
    }







    // VIEW SLIDES
    viewSlide(action, first) {
        // check current and initial index
        const checkedInd = this.#getCheckInd(this.curInd + action)
        const checkedInitInd = this.#getCheckInd(checkedInd, true)

        this.curInd === checkedInd ? this.action = 0
            : (this.infinityOpt && Math.abs(action) > this.slidesLength / 2
                ? this.action = (this.slidesLength - Math.abs(action)) * -(action / Math.abs(action))
                : this.action = action
            )

        this.curInd = checkedInd
        this.initInd = checkedInitInd

        // main actions
        if (first) {
            // actions in first slide launch
            if (this.infinityOpt) {
                this.slidesShift(-(Math.floor(this.$slides.length / 2) - this.initInd))
                this.$subSlideLine.style.left = `${-this.#getScrollPar({ first: true })}px`
            } else {
                this.$slideLine.style.left = `${-this.#getScrollPar({ first: true })}px`
            }
        } else if (this.action !== 0) {
            if (this.infinityOpt) {
                this.slidesShift(action)
                this.$subSlideLine.style.transform = `translateX(${this.#getScrollPar({ sub: true })}px)`
            }
            this.$slideLine.style.transform = `translateX(${-this.#getScrollPar()}px)`
        }

        // others
        this.setCurrentClasses
        this.autoViewSlideTimeOpt ? this.#intervalView() : null
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
                arr[this.$slides.length - 1].remove()
                arr = Array.from(this.$slider.querySelectorAll(this.selectors.slideSelector))
            }
        }
        this.setSlides
    }

    #getCheckInd(index, init = false) {
        if (init) {
            if (this.infinityOpt) {
                if (index > this.slidesLength - 1) {
                    while (index > this.slidesLength - 1) {
                        index -= this.slidesLength
                    }
                }
            }
        } else {
            if (this.infinityOpt) {
                if (index > this.$slides.length - 1) {
                    index -= this.$slides.length
                } else if (index < 0) {
                    index += this.$slides.length
                }
            } else {
                if (index > this.$slides.length - 1) {
                    index = this.$slides.length - 1
                } else if (index < 0) {
                    index = 0
                }
            }
        }
        return index
    }






    // EVENTS

    #event() {
        this.mouseEvent = this.mouseEvent.bind(this)
        this.$slider.addEventListener('click', this.mouseEvent)

        if (this.keyboardEventsOpt) {
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
            this.viewSlide(elemInd - this.initInd)
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

            if (this.infinityOpt) {
                this.action >= 0 ? this.viewSlide(1) : this.viewSlide(-1)
            } else {
                (this.curInd === 0 || this.curInd === this.slidesLength - 1)
                    ? (this.curInd === 0 ? this.viewSlide(1) : this.viewSlide(-1))
                    : this.action >= 0 ? this.viewSlide(1) : this.viewSlide(-1)
            }

        }, this.autoViewSlideTimeOpt)
    }







    // OTHERS
    #getScrollPar({ first = false, sub = false } = {}) {
        let par = 0

        const gap = this.rect.gap
        this.rect = this.rectReset
        Object.assign(this.rect, this.#getActiveSlidesRect())

        if (first) {
            if (this.slidePositionOpt === 'left' || this.slidePositionOpt === 'auto') {
                par = this.#slidePosLeft(first)
            } else if (this.slidePositionOpt === 'right') {
                par = this.#slidePosRight(first)
            } else if (this.slidePositionOpt === 'center') {
                par = this.#slidePosCenter(first)
            }
        } else {
            if (sub) {
                let lastSlideWdth = this.rect.lastSlide.width
                let firstSlideWdth = this.rect.firstSlide.width

                if (Math.abs(this.action) > 1) {
                    lastSlideWdth = 0
                    firstSlideWdth = 0
                    for (let i = 1; i < Math.abs(this.action) + 1; i++) {
                        lastSlideWdth += this.$slides[this.$slides.length - i].getBoundingClientRect().width
                    }
                    for (let i = 0; i < Math.abs(this.action); i++) {
                        firstSlideWdth += this.$slides[i].getBoundingClientRect().width
                    }
                }

                this.action > 0
                    ? par = this.trnsfrmPointWrap + lastSlideWdth + (gap * Math.abs(this.action))
                    : par = this.trnsfrmPointWrap - firstSlideWdth - (gap * Math.abs(this.action))
                this.trnsfrmPointWrap = par
            } else {
                if (this.slidePositionOpt === 'left') {
                    par = this.#slidePosLeft()
                } else if (this.slidePositionOpt === 'right') {
                    par = this.#slidePosRight()
                } else if (this.slidePositionOpt === 'center') {
                    par = this.#slidePosCenter()
                } else if (this.slidePositionOpt === 'auto') {
                    const wrapCenter = this.rect.wrap.left + (this.rect.wrap.width / 2)

                    this.$slides.forEach(slide => {
                        const slideRect = slide.getBoundingClientRect()
                        const slideCenter = slideRect.left + (slideRect.width / 2)

                        if (slideCenter <= wrapCenter) {
                            this.autoViewPar.push(this.#slidePosLeft(true))
                        }
                    })
                }
            }
        }

        return par
    }

    #slidePosLeft(first) {
        let par = 0

        if (first) {
            par = this.rect.curSlide.left - this.rect.wrap.left
        } else {
            const gap = this.rect.gap
            const prevSlideWdth = this.rect.prevSlide.width
            const curSlideWdth = this.rect.curSlide.width
            let othSlideWdth = 0
            for (let i in this.rect) {
                i.includes('othSlide') ? othSlideWdth += this.rect[i].width : null
            }

            this.action > 0
                ? par = this.trnsfrmPoint + prevSlideWdth + othSlideWdth + (gap * Math.abs(this.action))
                : par = this.trnsfrmPoint - curSlideWdth - othSlideWdth - (gap * Math.abs(this.action))
            this.trnsfrmPoint = par
        }

        return par
    }

    #slidePosRight(first) {
        let par = 0

        if (first) {
            par = this.rect.curSlide.right - this.rect.wrap.right
        } else {
            const gap = this.columnGapOpt
            const nextSlideWdth = this.rect.nextSlide.width
            const curSlideWdth = this.rect.curSlide.width
            let othSlideWdth = 0
            for (let i in this.rect) {
                i.includes('othSlide') ? othSlideWdth += this.rect[i].width : null
            }

            this.action > 0
                ? par = this.trnsfrmPoint + curSlideWdth + othSlideWdth + (gap * Math.abs(this.action))
                : par = this.trnsfrmPoint - nextSlideWdth - othSlideWdth - (gap * Math.abs(this.action))
            this.trnsfrmPoint = par
        }

        return par
    }

    #slidePosCenter(first) {
        let par = 0

        if (first) {
            const wrapCenter = this.rect.wrap.left + (this.rect.wrap.width / 2)
            const curSlideCenter = this.rect.curSlide.left + (this.rect.curSlide.width / 2)
            par = curSlideCenter - wrapCenter
        } else {
            const gap = this.rect.gap
            const prevSlideWdth = this.rect.prevSlide.width
            const nextSlideWdth = this.rect.nextSlide.width
            const curSlideWdth = this.rect.curSlide.width
            let othSlideWdth = 0
            for (let i in this.rect) {
                i.includes('othSlide') ? othSlideWdth += this.rect[i].width : null
            }

            this.action > 0
                ? par = this.trnsfrmPoint + (curSlideWdth / 2) + (prevSlideWdth / 2) + othSlideWdth + (gap * Math.abs(this.action))
                : par = this.trnsfrmPoint - (curSlideWdth / 2) - (nextSlideWdth / 2) - othSlideWdth - (gap * Math.abs(this.action))
            this.trnsfrmPoint = par
        }

        return par
    }

    #getActiveSlidesRect() {
        let obj = {}

        const slide = this.slidesSort[this.curInd]
        const pos = this.$slides.indexOf(slide)
        const nextPos = this.#getCheckInd(pos + (this.action > 0 ? 1 : Math.abs(this.action)))
        const prevPos = this.#getCheckInd(pos - (this.action > 0 ? Math.abs(this.action) : 1))

        let b = 0
        for (let i = 0; i < this.$slides.length; i++) {
            const slide = this.$slides[i]

            if (prevPos < nextPos) {
                if (i >= prevPos && i <= nextPos) {
                    i === prevPos ? obj.prevSlide = slide.getBoundingClientRect() : null
                    i === pos ? obj.curSlide = slide.getBoundingClientRect() : null
                    i === nextPos ? obj.nextSlide = slide.getBoundingClientRect() : null
                    i !== prevPos && i !== pos && i !== nextPos ? (obj[`othSlide${b}`] = slide.getBoundingClientRect(), b++) : null
                }
            } else if (prevPos > nextPos) {
                if (!obj.nextSlide && !obj.prevSlide) {
                    i === prevPos ? obj.prevSlide = slide.getBoundingClientRect() : null
                    i === pos ? obj.curSlide = slide.getBoundingClientRect() : null
                    i === nextPos ? obj.nextSlide = slide.getBoundingClientRect() : null
                    i !== prevPos && i !== pos && i !== nextPos ? (obj[`othSlide${b}`] = slide.getBoundingClientRect(), b++) : null
                } else if ((obj.nextSlide || obj.prevSlide) && !(obj.nextSlide && obj.prevSlide)) {
                    i === prevPos ? obj.prevSlide = slide.getBoundingClientRect() : null
                    i === nextPos ? obj.nextSlide = slide.getBoundingClientRect() : null
                } else if (obj.nextSlide && obj.prevSlide) {
                    i === pos ? obj.curSlide = slide.getBoundingClientRect() : null
                    i !== prevPos && i !== pos && i !== nextPos ? (obj[`othSlide${b}`] = slide.getBoundingClientRect(), b++) : null
                }
            } else if (prevPos === nextPos) {
                i === prevPos ? obj.prevSlide = slide.getBoundingClientRect() : null
                i === pos ? obj.curSlide = slide.getBoundingClientRect() : null
                i === nextPos ? obj.nextSlide = slide.getBoundingClientRect() : null
                i !== prevPos && i !== pos && i !== nextPos ? (obj[`othSlide${b}`] = slide.getBoundingClientRect(), b++) : null
            }
        }

        return obj
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
        this.$slides.forEach(slide => {
            if (slide.classList.contains(this.currentClassOpt)) {
                slide.classList.remove(this.currentClassOpt)
            }
            if (Number(slide.getAttribute('data-mlider-index')) === this.curInd) {
                slide.classList.add(this.currentClassOpt)
            }
        })

        if (this.$dot) {
            this.$dots.forEach(dot => {
                if (dot.classList.contains(this.currentClassOpt)) {
                    dot.classList.remove(this.currentClassOpt)
                }
                if (Number(dot.getAttribute('data-mlider-index')) === this.initInd) {
                    dot.classList.add(this.currentClassOpt)
                }
            })
        }

        if (this.$counter) {
            this.$counter.innerHTML = `<span>${this.initInd}</span>/<span>${this.slidesLength - 1}</span>`
        }
    }

    get validKeyElements() {
        let check
        this.$slider && this.$slides.length > 0 ? check = true : check = false
        return check
    }

    get rectReset() {
        return {
            gap: this.columnGapOpt,
            wrap: this.$wrap.getBoundingClientRect(),
            firstSlide: this.$slides[0].getBoundingClientRect(),
            lastSlide: this.$slides[this.$slides.length - 1].getBoundingClientRect(),
        }
    }
}








// ============================== INFO
// !!!CANNOT apply transition on slides 