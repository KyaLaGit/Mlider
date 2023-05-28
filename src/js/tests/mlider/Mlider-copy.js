export class Mlider {
    constructor(classes, options) {
        this.classes = classes
        this.currentIndex = 1

        const defualtOptions = {
            infinity: true,
            slideSize: 'castomize',
            preViewSlides: 1,
            slidePosition: 'left',
            animationTime: 400,

            saveSlideSize: false,
            columnGap: 0,

            swipe: true,
            overflowHidden: true,
            counterInDots: false,
        }
        this.options = Object.assign(defualtOptions, options)

        this.#setup()

        if (this.$slider) {
            this.viewSlide(this.currentIndex)
            this.#event()
        }
    }

    #setup() {
        // Classes
        this.sliderClass = this.classes.sliderClass
        this.slideClass = this.classes.slideClass
        this.prevBtnClass = this.classes.prevBtnClass
        this.nextBtnClass = this.classes.nextBtnClass
        this.dotClass = this.classes.dotClass
        this.currentClass = this.classes.currentClass
        this.#checkClasses()
        // Elements
        this.#createElements()
        this.#checkElements()
        // Options
        this.infinityOption = this.options.infinity
        this.slideSizeOption = this.options.slideSize
        this.preViewSlidesOption = this.options.preViewSlides
        this.slidePositionOption = this.options.slidePosition
        this.animationTimeOption = this.options.animationTime
        this.saveSlideSizeOption = this.options.saveSlideSize
        this.gapOption = this.options.gap
        this.swipeOption = this.options.swipe
        this.overflowHiddenOption = this.options.overflowHidden
        this.counterInDotsOption = this.options.counterInDots
        this.#checkOptions()
        // 
        if (this.$slider) {
            this.#generate()
            this.#styles()
        }
    }

    #setCheckedNumberOption(option, optionName) {
        if (typeof option === 'number') {
            return option
        } else if (typeof option === 'string') {
            if (isNaN(parseInt(option.trim()))) {
                console.log(`${optionName} -> undefined`)
            } else {
                return parseInt(option.trim())
            }
        } else {
            console.log(`${optionName} -> undefined`)
        }
    }

    #setCheckedBooleanOption(option, optionName) {
        if (typeof (option) === 'string') {
            option = option.trim()
            if (option === 'true') {
                return true
            } else if (option === 'false') {
                return false
            } else {
                console.log(`${optionName} -> undefined`)
            }
        } else if (typeof (option) === 'boolean') {
            return option
        } else {
            console.log(`${optionName} -> undefined`)
        }
    }

    #setCheckedStringOption(option, optionName) {
        if (typeof (option) === 'string') {
            option = option.trim()
            if (optionName === 'slidePosition') {
                if (!(option === 'left' || option === 'center' || option === 'right' || option === 'auto')) {
                    console.log(`${optionName} -> undefined`)
                } else {
                    return option
                }
            } else if (optionName === 'slideSize') {
                if (!(option === 'auto' || option === 'castom')) {
                    console.log(`${optionName} -> undefined`)
                } else {
                    return option
                }
            }
        } else {
            console.log(`${optionName} -> undefined`)
        }
    }

    #setCheckedClass(checkClass, className) {
        this.nullClasses = {}
        if (typeof (checkClass) === 'string') {
            checkClass = checkClass.trim()
            if (checkClass === '') {
                console.log(`${className} -> undefined`)
            } else if (className !== 'currentClass') {
                if (!(checkClass.startsWith('.'))) {
                    checkClass = '.' + checkClass
                }
            } else if (className === 'currentClass') {
                if (checkClass.startsWith('.')) {
                    checkClass = checkClass.replace('.', '')
                }
            }
        } else if (typeof (checkClass) === 'undefined') {
            if (className === 'sliderClass' || className === 'slideClass') {
                console.log(`${className} -> undefined`)
            }
        } else {
            console.log(`${className} -> undefined`)
        }

        return checkClass
    }

    #setCheckedElement(element, elementName, elementClass) {
        if (!element && elementClass) {
            console.log(`${elementName} -> undefined`)
        } else if (elementName === 'slides') {
            if (!element[0] && elementClass) {
                console.log(`${elementName} -> undefined`)
            }
        }

        if (elementName === 'prevBtn' && element) {
            element.setAttribute('data-type', elementName)
        } else if (elementName === 'nextBtn' && element) {
            element.setAttribute('data-type', elementName)
        }
        return element
    }

    #checkOptions() {
        const infinityOptionName = 'infinity'
        this.infinityOption = this.#setCheckedBooleanOption(this.infinityOption, infinityOptionName)

        const slideSizeOptionName = 'slideSize'
        this.slideSizeOption = this.#setCheckedStringOption(this.slideSizeOption, slideSizeOptionName)

        const preViewSlidesOptionName = 'preViewSlides'
        this.preViewSlidesOption = this.#setCheckedNumberOption(this.preViewSlidesOption, preViewSlidesOptionName)
        this.preViewSlidesOption = 100 / this.preViewSlidesOption

        const slidePositionOptionName = 'slidePosition'
        this.slidePositionOption = this.#setCheckedStringOption(this.slidePositionOption, slidePositionOptionName)

        const animationTimeOptionName = 'animationTime'
        this.animationTimeOption = this.#setCheckedNumberOption(this.animationTimeOption, animationTimeOptionName)
        this.animationTimeOption = this.animationTimeOption / 1000

        const saveSlideSizeOptionName = 'saveSlideSize'
        this.saveSlideSizeOption = this.#setCheckedBooleanOption(this.saveSlideSizeOption, saveSlideSizeOptionName)

        const gapOptionName = 'gap'
        this.gapOption = this.#setCheckedNumberOption(this.gapOption, gapOptionName)

        const swipeOptionName = 'swipe'
        this.swipeOption = this.#setCheckedBooleanOption(this.swipeOption, swipeOptionName)

        const overflowHiddenOptionName = 'overflowHidden'
        this.overflowHiddenOption = this.#setCheckedBooleanOption(this.overflowHiddenOption, overflowHiddenOptionName)

        const counterInDotsOptionName = 'counterInDots'
        this.counterInDotsOption = this.#setCheckedBooleanOption(this.counterInDotsOption, counterInDotsOptionName)
    }

    #checkClasses() {
        const sliderClassName = 'sliderClass'
        this.sliderClass = this.#setCheckedClass(this.sliderClass, sliderClassName)

        const slideClassName = 'slideClass'
        this.slideClass = this.#setCheckedClass(this.slideClass, slideClassName)

        const prevBtnClassName = 'prevBtnClass'
        this.prevBtnClass = this.#setCheckedClass(this.prevBtnClass, prevBtnClassName)

        const nextBtnClassName = 'nextBtnClass'
        this.nextBtnClass = this.#setCheckedClass(this.nextBtnClass, nextBtnClassName)

        const dotClassName = 'dotClass'
        this.dotClass = this.#setCheckedClass(this.dotClass, dotClassName)

        const currentClassName = 'currentClass'
        this.currentClass = this.#setCheckedClass(this.currentClass, currentClassName)
    }

    #createElements() {
        this.$slider = document.querySelector(this.sliderClass)
        this.$slides = document.querySelectorAll(this.slideClass)

        if (this.prevBtnClass) {
            this.$prevBtn = document.querySelector(this.prevBtnClass)
        }
        if (this.nextBtnClass) {
            this.$nextBtn = document.querySelector(this.nextBtnClass)
        }
        if (this.dotClass) {
            this.$dot = document.querySelector(this.dotClass)
        }
    }

    #checkElements() {
        const sliderElementName = 'slider'
        this.$slider = this.#setCheckedElement(this.$slider, sliderElementName, this.sliderClass)

        const slidesElementName = 'slides'
        this.$slides = this.#setCheckedElement(this.$slides, slidesElementName, this.slideClass)

        const prevBtnElementName = 'prevBtn'
        this.$prevBtn = this.#setCheckedElement(this.$prevBtn, prevBtnElementName, this.prevBtnClass)

        const nextBtnElementName = 'nextBtn'
        this.$nextBtn = this.#setCheckedElement(this.$nextBtn, nextBtnElementName, this.nextBtnClass)

        const dotElementName = 'dot'
        this.$dot = this.#setCheckedElement(this.$dot, dotElementName, this.dotClass)
    }

    #generate() {
        const slides = []
        const dotsArr = []

        for (let i = 0; i < this.slidesLength; i++) {
            const slide = this.$slides[i]
            const dot = this.$dot

            const slideTemplate = document.createElement('div')
            slideTemplate.setAttribute('id', 'mlider__slide-shell')
            slideTemplate.setAttribute('data-index', i + 1)
            slideTemplate.innerHTML = slide.outerHTML
            slides.push(slideTemplate.outerHTML)

            slide.remove()

            if (this.$dot) {
                dot.setAttribute('data-type', 'dot')
                dot.setAttribute('data-index', i + 1)
                dotsArr.push(dot.outerHTML)
            }
        }

        this.$slider.insertAdjacentHTML('afterbegin', `
                <div div id = "mlider__wrapper" >
                    <div id="mlider__slides-line">
                        ${slides.join('')}
                    </div>
                </div >
        `)

        if (this.$dot) {
            const dotParent = this.$dot.parentElement
            dotParent.innerHTML = dotsArr.join('')
        }

        this.$slideLineWrapper = this.$slider.querySelector('#mlider__wrapper')
        this.$slideLine = this.$slider.querySelector('#mlider__slides-line')
        this.$slidesShell = this.$slider.querySelectorAll('#mlider__slide-shell')
        this.$slides = document.querySelectorAll(this.slideClass)
        this.$dots = this.$slider.querySelectorAll('[data-type="dot"]')
    }

    #styles() {
        let columnGapParameter
        let marginAndPaddingParameter

        const getOverflowParameter = () => {
            if (this.overflowHiddenOption) {
                return `overflow: hidden;`
            } else {
                return ``
            }
        }

        const getGapParameters = () => {
            const arr = []

            if (this.saveSlideSizeOption) {
                columnGapParameter = `column-gap: ${this.gapOption}px; `
            } else if (!this.saveSlideSizeOption) {
                arr.push(`margin: 0 -${this.gapOption / 2} px;`)
                arr.push(`padding: 0 ${this.gapOption / 2} px;`)
                marginAndPaddingParameter = arr
            }
        }
        getGapParameters()

        const getSlideSizeOption = () => {
            if (this.slideSizeOption === 'auto') {
                return ''
            } else if (this.slideSizeOption === 'castom') {
                return `flex: 0 0 ${this.preViewSlidesOption}%; `
            }
        }

        columnGapParameter = columnGapParameter ?? ''
        marginAndPaddingParameter = marginAndPaddingParameter ?? ''

        this.$slideLineWrapper.style.cssText = `
            ${getOverflowParameter()}
            height: 100%;
            `

        this.$slideLine.style.cssText = `
            height: 100%;
            display: flex;
            ${columnGapParameter}
            ${marginAndPaddingParameter[0]}
            position: relative;
            transition: all ${this.animationTimeOption}s ease;
            `

        this.$slidesShell.forEach(slide => {
            slide.style.cssText = `
                ${getSlideSizeOption()}
                ${marginAndPaddingParameter[1]}
            `
        })

        if (this.counterInDotsOption) {
            for (let i = 0; i < this.$dots.length; i++) {
                this.$dots[i].innerHTML = i + 1
            }
        }
    }

    nextSlide() {
        this.currentIndex++
        this.viewSlide(this.currentIndex)
    }

    prevSlide() {
        this.currentIndex--
        this.viewSlide(this.currentIndex)
    }

    viewSlide(index) {
        this.checkedIndex = index

        this.$slideLine.style.transform = `translate(${this.getScrollParameters[this.currentIndex - 1]}px, 0)`
        this.setCurrentClass
    }

    get getScrollParameters() {
        const scrollParameters = []
        let repeatPush = 1

        for (let i = 0; i < this.$slidesShell.length; i++) {
            const slide = this.$slidesShell[i]
            const wrapperWidth = this.$slideLineWrapper.offsetWidth
            const slideLineWidth = this.$slideLine.scrollWidth
            const slideLeft = slide.offsetLeft
            const slideWidth = slide.offsetWidth
            const slideRight = slideLineWidth - (slideLeft + slideWidth)


            if (this.slidePositionOption === 'left') {
                scrollParameters.push(-slideLeft)
            } else if (this.slidePositionOption === 'right') {
                scrollParameters.push(wrapperWidth - (slideLeft + slideWidth))
            } else if (this.slidePositionOption === 'center') {
                scrollParameters.push(((wrapperWidth - slideWidth) / 2) - slideLeft)
            } else if (this.slidePositionOption === 'auto') {
                if (i === 0) {
                    scrollParameters.push(-slideLeft)
                } else if (i !== 0 && i !== this.$slidesShell.length - 1) {
                    if (wrapperWidth / 2 > slideLeft + (slideWidth / 2)) {
                        scrollParameters.push(scrollParameters[i - 1])
                    } else if (wrapperWidth / 2 > slideRight + (slideWidth / 2)) {
                        repeatPush++
                    } else {
                        scrollParameters.push(((wrapperWidth - slideWidth) / 2) - slideLeft)
                    }
                } else if (i === this.$slidesShell.length - 1) {
                    for (let i = 0; i < repeatPush; i++) {
                        scrollParameters.push(wrapperWidth - (slideLeft + slideWidth))
                    }
                }
            }
        }

        return scrollParameters
    }

    get setCurrentClass() {
        this.$slidesShell.forEach(slide => {
            if (slide.firstElementChild.classList.contains(this.currentClass)) {
                slide.firstElementChild.classList.remove(this.currentClass)
            }
            if (slide.getAttribute('data-index') === this.currentIndex.toString()) {
                slide.firstElementChild.classList.add(this.currentClass)
            }
        })

        this.$dots.forEach(dot => {
            if (dot.classList.contains(this.currentClass)) {
                dot.classList.remove(this.currentClass)
            }
            if (dot.getAttribute('data-index') === this.currentIndex.toString()) {
                dot.classList.add(this.currentClass)
            }
        })
    }

    set checkedIndex(index) {
        if (this.infinityOption) {
            if (index > this.slidesLength) {
                this.currentIndex = 1
            } else if (index < 1) {
                this.currentIndex = this.slidesLength
            } else {
                this.currentIndex = index
            }
        } else {
            if (index > this.slidesLength) {
                this.currentIndex = this.slidesLength
            } else if (index < 1) {
                this.currentIndex = 1
            } else {
                this.currentIndex = index
            }
        }
    }

    get slidesLength() {
        return this.$slides.length
    }

    #event() {
        this.eventFn = this.eventFn.bind(this)
        this.$slider.addEventListener('click', this.eventFn)

        // if (this.swipeOption) {
        //     this.swipeFn = this.swipeFn.bind(this)
        //     this.$slideLineWrapper.addEventListener('mousedown', this.swipeFn)
        //     this.$slideLineWrapper.addEventListener('mousemove', this.swipeFn)
        //     this.$slideLineWrapper.addEventListener('mouseup', this.swipeFn)

        //     this.posX = 0
        //     this.newPosX = 0
        //     this.difX = 0
        //     this.defualtX = 0

        //     this.checkPos = false
        // }
    }

    eventFn(e) {
        const elem = e.target

        if (elem.closest('[data-type="prevBtn"]')) {
            this.prevSlide()
        } else if (elem.closest('[data-type="nextBtn"]')) {
            this.nextSlide()
        } else if (elem.closest('[data-type="dot"]')) {
            this.viewSlide(elem.dataset.index)
        }
    }

    swipeFn(e) {
        const elem = e.target
        const eventType = e.type


        if (eventType === 'mousedown') {
            if (elem.closest('#mlider__slide-shell')) {
                this.checkPos = true
                this.posX = e.clientX
            }
        }

        if (eventType === 'mousemove') {

            if (this.checkPos) {
                this.newPosX = e.clientX
                this.difX = this.newPosX - this.posX
                this.posX = this.newPosX
                this.defualtX += this.difX

                this.$slideLine.style.transform = `translate(${this.defualtX}px, 0px)`
            }
        }

        if (eventType === 'mouseup') {
            this.checkPos = false
            this.defualtX = 0
        }

    }
}