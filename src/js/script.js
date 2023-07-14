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
            infinity: false,
            columnGap: 40,
            transitionTime: 500,
            // currentClass: 'asd',
            counterInDot: true,
            keyboardEvent: true,
            swipeEvent: false,
            // swipeEventOpt: {
            //     sensitivity: 2,
            // },
            // autoViewSlide: false,
            // autoViewSlideOpt: {
            // time: 0,
            // direction: 'right',
            // },
            slide: {
                preView: [2.3],
                position: 'left',
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

    const mlider2 = new Mlider(
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
            infinity: false,
            columnGap: 50,
            transitionTime: 500,
            // currentClass: 'asd',
            counterInDot: true,
            keyboardEvent: true,
            swipeEvent: false,
            // swipeEventOpt: {
            //     sensitivity: 2,
            // },
            // autoViewSlide: false,
            // autoViewSlideOpt: {
            // time: 0,
            // direction: 'right',
            // },
            slide: {
                preView: [[25, 55, 40]],
                position: 'right',
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
