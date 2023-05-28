export function dataHeaderFixed() {
    const header = document.querySelector('[data-header-fixed]')

    if (header) {
        let headerOption = header.getAttribute('data-header-fixed')
        headerOption === '' ? headerOption = 0.5 : headerOption *= 1
        const headerScroll = header.getBoundingClientRect().top + (header.getBoundingClientRect().height * headerOption)

        document.addEventListener('scroll', e => {
            console.log("~ headerScroll", headerScroll)
            if (window.scrollY > headerScroll) {
                header.classList.add('fixed')
            } else if (window.scrollY < headerScroll) {
                header.classList.remove('fixed')
            }
        })
    }
}
// [data-header-fixed]

export function dataBurger() {
    const burger = document.querySelector('[data-burger]')

    if (burger) {
        const burgerList = document.querySelector('[data-burger-menu]')
        const wrapper = document.querySelector('.wrapper')
        const header = document.querySelector('.header')

        document.addEventListener('click', burgerEventFn)
        window.addEventListener('resize', burgerEventFn)

        function burgerEventFn(e) {
            const elem = e.target

            if (e.type === 'click' && elem.closest('[data-burger]')) {
                burger.classList.toggle('open')
                burgerList.classList.toggle('open')
                header.classList.toggle('open')
                wrapper.classList.toggle('lock')
            } else {
                burger.classList.remove('open')
                burgerList.classList.remove('open')
                header.classList.remove('open')
                wrapper.classList.remove('lock')
            }
        }
    }
}
// [data-burger],[data-burger-menu]

export function dataPromt() {
    const promtAll = document.querySelectorAll('[data-promt]')

    if (promtAll.length > 0) {
        promtAll.forEach(promt => {
            promt.classList.add('promt')
            promt.parentElement.setAttribute('data-promt-parent', '')
            if (window.getComputedStyle(promt.parentElement).position !== 'absolute' && window.getComputedStyle(promt.parentElement).position !== 'relative') {
                promt.parentElement.style.position = 'relative'
            }

            let dataValue = promt.getAttribute('data-promt')
            dataValue = dataValue.toLowerCase().trim()
            dataValue === '' ? dataValue = 'bottom' : null

            if (dataValue === 'bottom') {
                promt.classList.add('promt_bottom')
            } else if (dataValue === 'top') {
                promt.classList.add('promt_top')
            } else if (dataValue === 'left') {
                promt.classList.add('promt_left')
            } else if (dataValue === 'right') {
                promt.classList.add('promt_right')
            } else if (dataValue === 'own') {
                promt.classList.add('promt_own')
            }
        })
    }

    let promt = null

    document.addEventListener('mouseover', promtEventFn)
    function promtEventFn(e) {
        const elem = e.target

        if (elem.closest('[data-promt-parent]')) {
            promt = elem.closest('[data-promt-parent]').querySelector('[data-promt]')
            promt.classList.add('visible')
        } else if (promt) {
            promt.classList.remove('visible')
            promt = null
        }
    }
}
// [data-promt]

export function dataTabs() {
    const tabWrapAll = document.querySelectorAll('[data-tab]')

    if (tabWrapAll.length > 0) {
        tabWrapAll.forEach(tabWrap => {
            const tabLinks = tabWrap.querySelector('[data-tab-links]').children
            const tabContents = tabWrap.querySelector('[data-tab-contents]').children

            for (let i = 0; i < tabLinks.length; i++) {
                tabLinks[i].setAttribute('data-tab-link', i + 1)
                tabLinks[0].classList.add('active')
            }

            for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].setAttribute('data-tab-content', i + 1)
                tabContents[0].classList.add('open')
            }
        })
    }

    document.addEventListener('click', eventFn)
    function eventFn(e) {
        const elem = e.target

        if (elem.closest('[data-tab-link]')) {
            const index = elem.closest('[data-tab-link]').getAttribute('data-tab-link')
            const parent = elem.closest('[data-tab]')
            const contents = parent.querySelectorAll('[data-tab-content]')
            const links = parent.querySelectorAll('[data-tab-link]')

            links.forEach(link => {
                if (link.classList.contains('active')) {
                    link.classList.remove('active')
                }

                if (link.getAttribute('data-tab-link') === index) {
                    link.classList.add('active')
                }
            })

            contents.forEach(content => {
                if (content.classList.contains('open')) {
                    content.classList.remove('open')
                }

                if (content.getAttribute('data-tab-content') === index) {
                    content.classList.add('open')
                }
            })
        }
    }
}
// [data-tab], [data-tab-links], [data-tab-contents]

export function dataSelect() {
    const selectWrapAll = document.querySelectorAll('[data-select]')

    if (selectWrapAll.length >= 1) {
        const selectListAll = document.querySelectorAll('[data-select-list]')

        selectListAll.forEach(list => {
            for (let i = 0; i < list.children.length; i++) {
                list.children[i].setAttribute('data-select-item', '')
            }
        })

        document.addEventListener('click', eventFn)
        function eventFn(e) {
            const elem = e.target

            if (elem.closest('[data-select-link]') || elem.closest('[data-select-item]')) {
                const parent = elem.closest('[data-select]')
                const value = parent.querySelector('[data-select-value]') || parent.querySelector('[data-select-link]')
                const selectAll = parent.querySelectorAll('[data-select-item]')

                selectWrapAll.forEach(selectWrap => {
                    if (selectWrap.classList.contains('open') && selectWrap !== parent) {
                        selectWrap.classList.remove('open')
                    }
                })

                parent.classList.toggle('open')

                if (elem.closest('[data-select-item]')) {
                    selectAll.forEach(select => {
                        if (select.classList.contains('selected')) {
                            select.classList.remove('selected')
                        }
                    })
                    elem.closest('[data-select-item]').classList.add('selected')
                    value.textContent = elem.closest('[data-select-item]').textContent
                }
            } else {
                selectWrapAll.forEach(selectWrap => {
                    if (selectWrap.classList.contains('open')) {
                        selectWrap.classList.remove('open')
                    }
                })
            }
        }
    }
}
// [data-select], [data-select-link], [data-select-list], [data-select-value](optional)

export function dataSHM() {
    const shmItems = document.querySelectorAll('[data-shm]')

    if (shmItems.length > 0) {
        shmItems.forEach(item => {
            item.classList.add('shm', 'close')
            let content = null

            // Проверка data аттрибутов
            if (item.querySelector('[data-shm-link]')) {
                item.querySelector('[data-shm-link]').classList.add('shm__link')
            } else {
                console.log('data-shm-link -> undefined', item)
            }
            if (item.querySelector('[data-shm-content]')) {
                content = item.querySelector('[data-shm-content]')
                content.classList.add('shm__content')
            } else {
                console.log('data-shm-content -> undefined', item)
            }

            // Оболочка для content
            content.insertAdjacentHTML('beforebegin', `<div class="shm__content-wrap"></div>`)
            const contentWrap = item.querySelector('.shm__content-wrap')
            contentWrap.insertAdjacentHTML('afterbegin', content.outerHTML)
            content.remove()
        })

        document.addEventListener('click', eventFn)
        window.addEventListener('resize', eventFn)
        function eventFn(e) {
            const elem = e.target

            if (e.type === 'click' && elem.closest('.shm__link')) {
                const parent = elem.closest('.shm')
                const content = parent.querySelector('.shm__content-wrap')
                const contentHeight = content.scrollHeight

                if (parent.closest('[data-shm-wrap]')) {
                    const items = parent.closest('[data-shm-wrap]').querySelectorAll('[data-shm]')
                    items.forEach(item => {
                        if (item !== parent) {
                            item.classList.add('close')
                            item.querySelector('.shm__content-wrap').style.maxHeight = 0 + 'px'
                        }
                    })
                }


                if (!parent.classList.contains('close')) {
                    parent.classList.add('close')
                    content.style.maxHeight = 0 + 'px'
                } else if (parent.classList.contains('close')) {
                    parent.classList.remove('close')
                    content.style.maxHeight = contentHeight + 'px'
                }
            }
        }
    }
}
// [data-shm], [data-shm-link], [data-shm-content],  [data-shm-wrap](optional)

export function dataPopup() {
    const popups = document.querySelectorAll('[data-popup-content]')

    if (popups.length > 0) {
        document.addEventListener('click', eventFn)

        function eventFn(e) {
            const elem = e.target

            if (elem.closest('[data-popup-link]')) {
                const popupLink = elem.closest('[data-popup-link]')

                if (!popupLink.getAttribute('data-popup-link')) {
                    const popupContent = popupLink.closest('[data-popup]').querySelector('[data-popup-content]')
                    popupContent.classList.add('open')
                } else if (popupLink.getAttribute('data-popup-link')) {
                    const popupContent = document.querySelector(`[data-popup-content="${popupLink.getAttribute('data-popup-link')}"]`)
                    popupContent.classList.add('open')
                }
            }

            if (elem.matches('[data-popup-content]')) {
                const popupContent = elem.closest('[data-popup-content]')

                if (!popupContent.getAttribute('data-popup-content')) {
                    popupContent.classList.remove('open')
                } else if (popupContent.getAttribute('data-popup-content')) {
                    popupContent.classList.remove('open')
                }
            }
        }
    }
}
// [data-popup], [data-popup-link], [data-popup-content]

export function dataAnim() {
    const dataAnimationItems = document.querySelectorAll('[data-anim]')

    if (dataAnimationItems.length > 0) {

        let options = {
            root: null,
            threshold: 1
        }

        let callback = function (entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('anim')
                }
            })
        }

        let observer = new IntersectionObserver(callback, options)

        dataAnimationItems.forEach(item => {
            item.classList.add('animation')
            observer.observe(item)
        })

    }
}
// [data-anim]

export function dataTransfer() {
    const tsfElems = document.querySelectorAll('[data-tsf]')
    const tsfElemsPar = []

    if (tsfElems.length > 0) {
        tsfElems.forEach((tsfElem, index) => {
            const tsfElemPar = tsfElem.getAttribute('data-tsf').split(',')

            tsfElemsPar.push(
                {
                    element: tsfElem,
                    screenSize: Number(tsfElemPar[1].trim()),
                    currentPar: currentElemPar(tsfElem),
                    newPar: newElemPar(document.querySelector(tsfElemPar[0].trim()), tsfElemPar[2].trim()),
                    elemInside: false,
                    index: index,
                }
            )
            tsfElem.setAttribute('data-tsf-index', index)

            function currentElemPar(elem) {
                let par = {}
                par.parent = elem.parentElement
                const parentChilds = Array.from(elem.parentElement.children)

                for (let i = 0; i < parentChilds.length; i++) {
                    const child = parentChilds[i]

                    if (child === elem) {
                        if (i === 0) {
                            par.pos = 'start'
                            break
                        } else if (i > parentChilds.length - 1) {
                            par.pos = 'end'
                            break
                        } else {
                            par.pos = i
                            break
                        }
                    }
                }

                return par
            }

            function newElemPar(parent, position) {
                let par = {}
                par.parent = parent

                if (isNaN(Number(position))) {
                    par.pos = position
                } else if (Number(position) === 0) {
                    par.pos = 'start'
                } else if (Number(position) > parent.children.length - 1) {
                    par.pos = 'end'
                } else {
                    par.pos = Number(position)
                }

                return par
            }
        })

        window.addEventListener('resize', eventFn)
        document.onload = eventFn()
        function eventFn() {
            const screenSize = window.innerWidth

            tsfElemsPar.forEach(tsfElemPar => {

                // перенос в новое место
                if (screenSize < tsfElemPar.screenSize) {
                    if (!tsfElemPar.elemInside) {
                        document.querySelector(`[data-tsf-index='${tsfElemPar.index}']`).remove()
                        if (tsfElemPar.newPar.pos === 'start') {
                            tsfElemPar.newPar.parent.insertAdjacentHTML('afterbegin', tsfElemPar.element.outerHTML)
                        } else if (tsfElemPar.newPar.pos === 'end') {
                            tsfElemPar.newPar.parent.insertAdjacentHTML('beforeend', tsfElemPar.element.outerHTML)
                        } else if (typeof (tsfElemPar.newPar.pos) === 'number') {
                            let orient = tsfElemPar.newPar.parent.children[tsfElemPar.newPar.pos]
                            orient ? orient = orient.previousElementSibling : orient = Array.from(tsfElemPar.newPar.parent.children)[tsfElemPar.newPar.parent.children.length - 1]
                            orient.insertAdjacentHTML('afterend', tsfElemPar.element.outerHTML)
                        }
                        tsfElemPar.elemInside = true
                    }
                }

                // обратный перенос
                if (screenSize > tsfElemPar.screenSize) {
                    if (tsfElemPar.elemInside) {
                        document.querySelector(`[data-tsf-index='${tsfElemPar.index}']`).remove()
                        if (tsfElemPar.currentPar.pos === 'start') {
                            tsfElemPar.currentPar.parent.insertAdjacentHTML('afterbegin', tsfElemPar.element.outerHTML)
                        } else if (tsfElemPar.currentPar.pos === 'end') {
                            tsfElemPar.currentPar.parent.insertAdjacentHTML('beforeend', tsfElemPar.element.outerHTML)
                        } else if (typeof (tsfElemPar.currentPar.pos) === 'number') {
                            let orient = tsfElemPar.currentPar.parent.children[tsfElemPar.currentPar.pos]
                            orient ? orient = orient.previousElementSibling : orient = Array.from(tsfElemPar.currentPar.parent.children)[tsfElemPar.currentPar.parent.children.length - 1]
                            orient.insertAdjacentHTML('afterend', tsfElemPar.element.outerHTML)
                        }
                        tsfElemPar.elemInside = false
                    }
                }
            })
        }
    }
}
// [data-tsf=".box2,787,0"]

export function dataDDMenu() {
    let ddMenuAll = document.querySelectorAll('[data-ddmenu]')
    if (ddMenuAll.length > 0) {
        let ddMenuOptionsArr = []
        let asincMenuArray = []

        // options
        ddMenuAll.forEach(ddmenu => {
            if (ddmenu.getAttribute('data-ddmenu').toLowerCase().trim() === '' ||
                ddmenu.getAttribute('data-ddmenu').toLowerCase().trim() === 'hover') {
                ddmenu.setAttribute('data-ddmenu', 'mouseover')
            }
            ddMenuOptionsArr.push(ddmenu.getAttribute('data-ddmenu'))

            if (ddmenu.getAttribute('data-ddmenu-opened') !== null) {
                asincMenuArray.push(ddmenu)
                ddmenu.classList.contains('open') ? null : ddmenu.classList.add('open')

                if (ddmenu.getAttribute('data-ddmenu').toLowerCase().trim() === 'mouseover') {
                    ddmenu.setAttribute('data-ddmenu', 'click')
                }
            }
        })

        // mouseover quantity
        const mouseOverOpt = []
        ddMenuOptionsArr.forEach(option => {
            if (option.toLowerCase().trim() === 'mouseover') {
                mouseOverOpt.push(option)
            }
        })

        // listeners
        if (mouseOverOpt.length === 0) {
            document.addEventListener('click', eventFn)
        } else if (mouseOverOpt.length > 0) {
            document.addEventListener('mouseover', eventFn)
            document.addEventListener('click', eventFn)
        }

        // array option
        let menuOrder = []
        function eventFn(e) {
            const target = e.target
            const eType = e.type

            let parent = target.closest('[data-ddmenu]')
            const parentLink = parent ? target.closest('[data-ddmenu-link]') : null
            const parentEType = parent ? parent.getAttribute('data-ddmenu') : null
            const parentContent = parent ? target.closest('[data-ddmenu-content]') : null

            parentLink || parentContent
                ? ((!parentLink && parentContent) ? parent = parentContent.closest('[data-ddmenu]') : null)
                : null

            let nextParent = nextParentPar(parent)

            if (parentLink) {
                if ((menuOrder.length === 0 ? true : menuOrder[0].contains(parent))) {
                    if (menuOrder.includes(parent)) {
                        if (menuNesting()) {
                            menuOrderOpt({
                                action: 'remove',
                                eType,
                                parent,
                            })
                        } else if (eType === parentEType) {
                            menuOrderOpt({
                                action: 'remove',
                                eType,
                                parent,
                            })
                        }
                    }
                    if (eType === parentEType) {
                        menuOrderOpt({
                            action: 'add',
                            eType,
                            parent,
                        })
                    }

                }
                else if (menuOrder.length > 0 && !menuOrder[0].contains(parent)) {
                    if (menuOrder[0].getAttribute('data-ddmenu') === eType || parentEType === 'mouseover') {
                        menuOrderOpt({
                            action: 'remove',
                            eType,
                            parent: 'other'
                        })
                        eventFn(e)
                    }
                }
            } else if (parentContent && menuOrder[0] && menuOrder[0].contains(parent)) {
                if (menuNesting() && parent !== menuOrder[menuOrder.length - 1]) {
                    menuOrderOpt({
                        action: 'remove',
                        eType,
                        parent,
                    })
                } else if (eType === nextParent.type) {
                    menuOrderOpt({
                        action: 'remove',
                        eType,
                        parent,
                    })
                }
            } else if (menuOrder.length > 0) {
                menuOrderOpt({
                    action: 'remove',
                    parent: null,
                    eType,
                })
            }
        }
        function menuOrderOpt({ action, parent, eType } = {}) {
            if (action === 'add') {
                if (eType === 'mouseover') {
                    if (!menuOrder.includes(parent)) {
                        menuOrder.push(parent)
                        parent.classList.add('open')
                    }
                } else if (eType === 'click') {
                    if (menuOrder.includes(parent)) {
                        const parentIndex = menuOrder.indexOf(parent)
                        menuOrder.forEach((menu, index) => {
                            if (index > parentIndex - 1 && menu.classList.contains('open')) {
                                menu.classList.remove('open')
                            }
                        })
                        menuOrder.splice(parentIndex)
                    } else if (!menuOrder.includes(parent)) {
                        menuOrder.push(parent)
                        parent.classList.add('open')
                    }
                }
            } else if (action === 'remove') {
                let newIndex, parentIndex, check = false
                if (parent === null) {
                    parentIndex = -1
                } else if (parent === 'other') {
                    parentIndex = -1
                    check = true
                } else {
                    parentIndex = menuOrder.indexOf(parent)
                }
                menuOrder.forEach((menu, index) => {
                    if (index > parentIndex) {
                        if (!check && menu.getAttribute('data-ddmenu') === eType) {
                            check = true
                            newIndex = index
                        }
                        if (check) {
                            menu.classList.remove('open')
                        }
                    }
                })
                if (check) {
                    menuOrder.splice(typeof (newIndex) === 'undefined' ? parentIndex : newIndex)
                }
            }
        }
        function menuNesting() {
            let nesting = false
            if (menuOrder.length > 0) {
                const firstMenuType = menuOrder[0].getAttribute('data-ddmenu')
                for (let i = 0; i < menuOrder.length; i++) {
                    const menu = menuOrder[i]
                    if (menu.getAttribute('data-ddmenu') !== firstMenuType) {
                        nesting = true
                        break
                    }
                }
            }
            return nesting
        }
        function nextParentPar(parent) {
            const par = {}
            if (parent) {
                par.nextParent = menuOrder.includes(parent)
                    ? (menuOrder[menuOrder.indexOf(parent) + 1]
                        ? menuOrder[menuOrder.indexOf(parent) + 1]
                        : parent)
                    : null
                par.type = par.nextParent ? par.nextParent.getAttribute('data-ddmenu') : null
            }
            return par
        }
    }
}
// [data-ddmenu], [data-ddmenu-link], [data-ddmenu-content]
