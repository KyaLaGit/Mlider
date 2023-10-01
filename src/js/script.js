// MLIDER------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Mlider } from './mlider/Mlider.js'
window.onload = () => {

    new Mlider(
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
            infinity: false,
            columnGap: 40,
            transitionTime: 500,
            // currentClass: 'asd',
            counterInDot: true,
            keyboardEvent: true,
            swipeEvent: true,
            swipeEventOpt: {
                sensitivity: 2,
                free: true,
            },
            // autoViewSlide: false,
            // autoViewSlideOpt: {
            // time: 0,
            // direction: 'right',
            // },
            syncViewSlide: false,
            slide: {
                preView: ['600px', [40, 60]],
                position: 'right',
                // step: 1,
            },
            // breakpoint: {
            //     1024: {
            //         slide: {
            //             preView: [3],
            //             // position: 'left',
            //             // step: 1,
            //         },
            //         transitionTime: 1300,
            //     },
            //     768: {
            //         slide: {
            //             preView: [1.9],
            //             position: 'right',
            //             // step: 1,
            //         },
            //         transitionTime: 500,
            //         columnGap: 30,
            //     },
            //     425: {
            //         slide: {
            //             preView: [1.2],
            //             position: 'left',
            //             // step: 1,
            //         },
            //         columnGap: 10,
            //     }
            // },
        }
    )

    new Mlider(
        // Classes for slider elements
        {
            sliderSelector: '#mlider-2',
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
            keyboardEvent: false,
            swipeEvent: true,
            swipeEventOpt: {
                sensitivity: 1,
                free: false,
            },
            syncViewSlide: false,
            // autoViewSlide: false,
            // autoViewSlideOpt: {
            // time: 0,
            // direction: 'right',
            // },
            slide: {
                preView: [2, [30, 50]],
                position: 'center',
                step: 1,
            },
            // breakpoint: {
            //     1024: {
            //         slide: {
            //             preView: [3.3],
            //             position: 'left',
            //             step: 1,
            //         },
            //         transitionTime: 800,
            //         columnGap: 100,
            //     },
            //     768: {
            //         slide: {
            //             preView: [1.9],
            //             position: 'right',
            //             // step: 1,
            //         },
            //         transitionTime: 500,
            //         columnGap: 30,
            //     },
            //     425: {
            //         slide: {
            //             preView: [1.2],
            //             position: 'left',
            //             // step: 1,
            //         },
            //         columnGap: 10,
            //     }
            // },
        }
    )

}