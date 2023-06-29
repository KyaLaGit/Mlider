// MLIDER------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Mlider } from './mlider/Mlider.js'
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
            columnGap: 50,
            transitionTime: 500,
            // currentClass: 'asd',
            counterInDot: true,
            keyboardEvent: true,
            swipeEvent: false,
            // swipeEventOpt: {
            //     sensitivity: 2,
            // },
            // slideGroup: 1,
            // autoViewSlide: false,
            // autoViewSlideOpt: {
            // time: 0,
            // direction: 'right',
            // },
            slide: {
                preView: [2.5, [40, 55]],
                position: 'left',
                // step: 1,
            },
            breakpoint: {
                1024: {
                    slide: {
                        preView: [3, 2],
                        position: 'center',
                        // step: 1,
                    },
                    transitionTime: 600,
                    columnGap: 20,
                },
                // 768: {
                //     slide: {
                //         preView: [2, 3],
                //         position: 'left',
                //         // step: 1,
                //     },
                //     // columnGap: 40,
                // },
                425: {
                    columnGap: 0,
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