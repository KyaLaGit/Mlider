import { Mlider } from './Mlider-v0.1.js'

const slider = new Mlider(
    // Classes for slider elements
    {
        sliderClass: '.mlider',
        slideClass: '.slide-mlider',

        prevBtnClass: '.mlider__prev-btn',
        nextBtnClass: '.mlider__next-btn',
        dotClass: '.mlider__dot',

        currentClass: '.current',
    },

    // Slider options
    {
        // loop[true or false]
        infinity: true,
        // slide width [auto or custom](custom --> can use preViewSlides)
        slideSize: 'castom',
        // visible slides [quantity] (only with slideSize: custom)
        preViewSlides: 1.4,
        // slide position in visible area[left, center, right or auto]
        slidePosition: 'auto',
        // time of animation(change slide)[ms]
        animationTime: 400,

        // using column-gap(gap displaces other slides in visible area)[true] OR 
        // padding and negative margin(not displaces other slides in visible area)[false]
        saveSlideSize: true,
        // distance between slides[px]
        gap: 20,

        // // use swipe of slider[true or false]
        // swipe: true,
        // use overflow: hidden on slider-wrapper[true or false]
        overflowHidden: true,
        // include counter in dots(index number in dot)[true or false]
        counterInDots: false,
    }
)

window.slider = slider
