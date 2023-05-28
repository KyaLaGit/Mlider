// BURGER --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-burger],[data-burger-menu] ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataBurger } from './modules/data.js'
// dataBurger()


// SELECT ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-select], [data-select-link], [data-select-list], [data-select-value](optional) ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataSelect } from './modules/data.js'
// dataSelect()


// TABS ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-tab], [data-tab-links], [data-tab-contents] ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { dataTabs } from './modules/data.js'
dataTabs()


// PROMT ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-promt] "bottom"(a), "top", "right", "left", "own" ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataPromt } from './modules/data.js'
// dataPromt()


// SHM(show and hide menu) ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-shm], [data-shm-link], [data-shm-content],  [data-shm-wrap](optional) ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataSHM } from './modules/data.js'
// dataSHM()


// HEADER SCROLL FIXED ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-header-fixed] ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataHeaderFixed } from './modules/data.js'
// dataHeaderFixed()


// POPUP ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-popup], [data-popup-link], [data-popup-content] ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataPopup } from './modules/data.js'
// dataPopup()


// ANIMATION ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-anim] ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataAnim } from './modules/data.js'
// dataAnim()


// TRANSFER ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [data-tsf=".box2,787,0"] ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataTransfer } from './modules/data.js'
// dataTransfer()


// MLIDER------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Mlider } from './tests/mlider/Mlider-v0.4.js'
window.onload = () => {


    const mlider1 = new Mlider(
        // Classes for slider elements
        {
            sliderSelector: '#mlider-1',
            slideSelector: '.slide-mlider',

            prevBtnSelector: '.mlider__btn_prev',
            nextBtnSelector: '.mlider__btn_next',
            dotSelector: '.mlider__dot',
            counterSelector: '.mlider__counter',
        },
        // Options
        {
            infinity: true,
            columnGap: 20,
            transitionTime: 500,
            // currentClass: 'asd',
            counterInDot: true,
            keyboardEvent: true,
            swipeEvent: true,
            swipeEventOpt: {
                sensitivity: 2,
            },
            slideGroup: 1,
            autoViewSlide: false,
            autoViewSlideOpt: {
                time: 0,
                direction: 'right',
            },
            slide: {
                preView: [2.2, [35, 45]],
                position: 'center',
                // step: 1,
            },
            breakpoint: {
                1024: {
                    slide: {
                        preView: ['2', [2, 4]],
                        position: 'center',
                        // step: 1,
                    },
                },
                768: {

                }
            },
        }
    )

    // const mlider2 = new Mlider(
    //     // Classes for slider elements
    //     {
    //         sliderSelector: '#mlider-2',
    //         slideSelector: '.slide-mlider',

    //         prevBtnSelector: '.mlider__btn_prev',
    //         nextBtnSelector: '.mlider__btn_next',
    //         dotSelector: '.mlider__dot',
    //         counterSelector: '.mlider__counter',
    //     },

    //     // Slider options
    //     {
    //         // loop[true or false]
    //         infinity: true,
    //         // slide width [auto or castom](castom --> can use preViewSlides)
    //         slideSize: 'auto',
    //         // visible slides [quantity] (only with slideSize: custom)
    //         preViewSlides: 3,
    //         // slide position in visible area[left, center, right or auto]
    //         slidePosition: 'center',
    //         // save slide size
    //         saveSlideSize: false,
    //         // distance between slides[px]
    //         columnGap: 20,

    //         // time of animation(change slide)[ms]
    //         animationTime: 500,

    //         // current class
    //         currentClass: 'current',

    //         // include counter in dots(index number in dot)[true or false]
    //         counterInDots: true,
    //         // keyboard events
    //         keyboard: true,
    //         // slides group[0 = auto]
    //         slidesGroup: 0,
    //         // interval auto view slides(ms)[0 - false]
    //         autoViewSlideTime: 0,
    //     }
    // )

}
// const mlider3 = new Mlider(
//     // Classes for slider elements
//     {
//         sliderSelector: '#mlider-3',
//         slideSelector: '.slide-mlider',

//         prevBtnSelector: '.mlider__btn_prev',
//         nextBtnSelector: '.mlider__btn_next',
//         dotSelector: '.mlider__dot',
//         counterSelector: '.mlider__counter',
//     },

//     // Slider options
//     {
//         // loop[true or false]
//         infinity: true,
//         // slide width [auto or castom](castom --> can use preViewSlides)
//         slideSize: 'auto',
//         // visible slides [quantity] (only with slideSize: custom)
//         preViewSlides: 3,
//         // slide position in visible area[left, center, right or auto]
//         slidePosition: 'center',
//         // save slide size
//         saveSlideSize: false,
//         // distance between slides[px]
//         columnGap: 20,

//         // time of animation(change slide)[ms]
//         animationTime: 500,

//         // current class
//         currentClass: 'current',

//         // include counter in dots(index number in dot)[true or false]
//         counterInDots: true,
//         // keyboard events
//         keyboard: true,
//         // slides group[0 = auto]
//         slidesGroup: 0,
//         // interval auto view slides(ms)[0 - false]
//         autoViewSlideTime: 2000,
//     }
// )

// const mlider4 = new Mlider(
//     // Classes for slider elements
//     {
//         sliderSelector: '#mlider-4',
//         slideSelector: '.slide-mlider',

//         prevBtnSelector: '.mlider__btn_prev',
//         nextBtnSelector: '.mlider__btn_next',
//         dotSelector: '.mlider__dot',
//         counterSelector: '.mlider__counter',
//     },

//     // Slider options
//     {
//         // loop[true or false]
//         infinity: true,
//         // slide width [auto or castom](castom --> can use preViewSlides)
//         slideSize: 'auto',
//         // visible slides [quantity] (only with slideSize: custom)
//         preViewSlides: 3,
//         // slide position in visible area[left, center, right or auto]
//         slidePosition: 'center',
//         // save slide size
//         saveSlideSize: false,
//         // distance between slides[px]
//         columnGap: 20,

//         // time of animation(change slide)[ms]
//         animationTime: 500,

//         // current class
//         currentClass: 'current',

//         // include counter in dots(index number in dot)[true or false]
//         counterInDots: true,
//         // keyboard events
//         keyboard: true,
//         // slides group[0 = auto]
//         slidesGroup: 0,
//         // interval auto view slides(ms)[0 - false]
//         autoViewSlideTime: 2000,
//     }
// )

// const mlider5 = new Mlider(
//     // Classes for slider elements
//     {
//         sliderSelector: '#mlider-5',
//         slideSelector: '.slide-mlider',

//         prevBtnSelector: '.mlider__btn_prev',
//         nextBtnSelector: '.mlider__btn_next',
//         dotSelector: '.mlider__dot',
//         counterSelector: '.mlider__counter',
//     },

//     // Slider options
//     {
//         // loop[true or false]
//         infinity: true,
//         // slide width [auto or castom](castom --> can use preViewSlides)
//         slideSize: 'castom',
//         // visible slides [quantity] (only with slideSize: custom)
//         preViewSlides: 2,
//         // slide position in visible area[left, center, right or auto]
//         slidePosition: 'center',
//         // save slide size
//         saveSlideSize: false,
//         // distance between slides[px]
//         columnGap: 20,

//         // time of animation(change slide)[ms]
//         animationTime: 500,

//         // current class
//         currentClass: 'current',

//         // include counter in dots(index number in dot)[true or false]
//         counterInDots: true,
//         // keyboard events
//         keyboard: true,
//         // slides group[0 = auto]
//         slidesGroup: 0,
//         // interval auto view slides(ms)[0 - false]
//         autoViewSlideTime: 2000,
//     }
// )

// DDMENU ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { dataDDMenu } from './modules/data.js'
// dataDDMenu()