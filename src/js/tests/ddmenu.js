// ddmenu ver4 (with opened) 
function dataDDMenu() {
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


        let menuOrder = []
        function eventFn(e) {
            const target = e.target
            const eType = e.type

            let parent = target.closest('[data-ddmenu]')
            let parentEType, parentLink, parentContent, nextParent, asincParent, asincParentLink

            // vars
            if (parent) {

                if (parent.matches('[data-ddmenu-opened]')) {
                    asincParent = parent
                    asincParentLink = target.closest('[data-ddmenu-link]')
                    parent = null
                } else {
                    parentEType = parent.getAttribute('data-ddmenu')
                    parentLink = target.closest('[data-ddmenu-link]')
                    parentContent = target.closest('[data-ddmenu-content]')

                    parentLink || parentContent
                        ? ((!parentLink && parentContent) ? parent = parentContent.closest('[data-ddmenu]') : null)
                        : null

                    nextParent = nextParentPar(parent)
                }

            }

            // sinc
            if (parentLink) {
                // nesting
                if ((menuOrder.length === 0 ? true : menuOrder[0].contains(parent))) {

                    // preremove
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

                    // add
                    if (eType === parentEType) {
                        menuOrderOpt({
                            action: 'add',
                            eType,
                            parent,
                        })
                    }

                }

                // other menu
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

            // asinc
            if (asincParentLink && eType === 'click') {
                asincParent.classList.toggle('open')
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

// ddmenu ver3 (without opened)
function dataDDMenu() {
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

                // nesting
                if ((menuOrder.length === 0 ? true : menuOrder[0].contains(parent))) {

                    // preremove
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

                    // add
                    if (eType === parentEType) {
                        menuOrderOpt({
                            action: 'add',
                            eType,
                            parent,
                        })
                    }

                }

                // other menu
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

// ddmenu ver2 (with opened)
function dataDDMenu2() {
    let ddMenuAll = document.querySelectorAll('[data-ddmenu]')
    if (ddMenuAll.length > 0) {
        let ddMenuOptionsArr = []
        let asincMenuArray = []

        // options
        ddMenuAll.forEach(ddmenu => {
            if (ddmenu.getAttribute('data-ddmenu').toLowerCase().trim() === '') {
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
        let menuArray = []
        function eventFn(e) {
            const target = e.target
            const eventType = e.type
            const parent = target.closest('[data-ddmenu]') ? target.closest('[data-ddmenu]') : null
            const targetType = parent ? parent.getAttribute('data-ddmenu') : null

            if (parent && parent.getAttribute('data-ddmenu-opened') === null) {
                if (menuArray.length === 0 && target.closest('[data-ddmenu-link]') && eventType === targetType) {
                    arrayOption('add', parent)
                } else if (menuArray.length > 0) {
                    const lastChild = menuArray[menuArray.length - 1]
                    if (target.closest('[data-ddmenu-link]') && lastChild.contains(parent) && eventType === targetType) {
                        if (targetType === 'mouseover') {
                            arrayOption('add', parent)
                        } else if (targetType === 'click') {
                            arrayOption('toggle', parent)
                        }
                    } else if (menuArray.includes(parent)) {
                        if (targetType === 'mouseover' || lastChild.getAttribute('data-ddmenu') === 'mouseover') {
                            if (lastChild !== parent) {
                                arrayOption('remove-next', parent)
                            } else if (lastChild === parent && target.querySelector('[data-ddmenu-link]')) {
                                arrayOption('remove-current', parent)
                            }
                        } else if (targetType === 'click' && target.closest('[data-ddmenu-link]') && eventType === targetType) {
                            arrayOption('remove-current', parent)
                        }
                    } else if (!menuArray[0].contains(parent)) {
                        if (targetType === eventType) {
                            arrayOption('remove-all')
                            arrayOption('add', parent)
                        } else if (targetType !== eventType && menuArray[0].getAttribute('data-ddmenu') === 'mouseover') {
                            arrayOption('remove-all')
                        }
                    }
                }
            } else if (menuArray.length > 0 && eventType === menuArray[0].getAttribute('data-ddmenu')) {
                arrayOption('remove-all')
            }

            if (asincMenuArray.length > 0) {
                if (asincMenuArray.includes(target.closest('[data-ddmenu]')) && target.closest('[data-ddmenu-link]') && eventType === 'click') {
                    target.closest('[data-ddmenu]').classList.toggle('open')
                }
            }
        }

        function arrayOption(option, target) {
            if (option === 'add' && target) {
                if (!menuArray.includes(target)) {
                    menuArray.push(target)
                }
                menuArray[menuArray.length - 1].classList.add('open')
            } else if (option === 'toggle' && target) {
                if (menuArray.includes(target)) {
                    const index = menuArray.indexOf(target)
                    menuArray[index].classList.remove('open')
                    menuArray.splice(index)
                } else if (!menuArray.includes(target)) {
                    menuArray.push(target)
                    menuArray[menuArray.length - 1].classList.add('open')
                }
            } else if (option === 'remove-current' && target) {
                menuArray.forEach((menu, index) => {
                    if (index >= menuArray.indexOf(target)) {
                        menu.classList.remove('open')
                    }
                })
                menuArray.splice(menuArray.indexOf(target))
            } else if (option === 'remove-next' && target) {
                menuArray.forEach((menu, index) => {
                    if (index >= menuArray.indexOf(target) + 1) {
                        menu.classList.remove('open')
                    }
                })
                menuArray.splice(menuArray.indexOf(target) + 1)
            } else if (option === 'remove-all' && !target) {
                menuArray.forEach(menu => {
                    if (menu.classList.contains('open')) {
                        menu.classList.remove('open')
                    }
                })
                menuArray = []
            }
        }
    }
}

// ddmenu ver1 (simple)
function dataDDMenu1() {
    let ddMenuAll = document.querySelectorAll('[data-ddmenu]')
    if (ddMenuAll.length > 0) {
        let ddMenuOptionsArr = []

        // options
        ddMenuAll.forEach(ddmenu => {
            if (ddmenu.getAttribute('data-ddmenu').toLowerCase().trim() === '') {
                ddmenu.setAttribute('data-ddmenu', 'mouseover')
            }
            ddMenuOptionsArr.push(ddmenu.getAttribute('data-ddmenu'))
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
        let menuArray = []
        function eventFn(e) {
            const target = e.target
            const eventType = e.type
            const parent = target.closest('[data-ddmenu]') ? target.closest('[data-ddmenu]') : null
            const targetType = parent ? parent.getAttribute('data-ddmenu') : null

            if (parent) {
                if (menuArray.length === 0 && target.closest('[data-ddmenu-link]') && eventType === targetType) {
                    arrayOption('add', parent)
                } else if (menuArray.length > 0) {
                    const lastChild = menuArray[menuArray.length - 1]
                    if (target.closest('[data-ddmenu-link]') && lastChild.contains(parent) && eventType === targetType) {
                        if (targetType === 'mouseover') {
                            arrayOption('add', parent)
                        } else if (targetType === 'click') {
                            arrayOption('toggle', parent)
                        }
                    } else if (menuArray.includes(parent)) {
                        if (targetType === 'mouseover' || lastChild.getAttribute('data-ddmenu') === 'mouseover') {
                            if (lastChild !== parent) {
                                arrayOption('remove-next', parent)
                            } else if (lastChild === parent && target.querySelector('[data-ddmenu-link]')) {
                                arrayOption('remove-current', parent)
                            }
                        } else if (targetType === 'click' && target.closest('[data-ddmenu-link]') && eventType === targetType) {
                            arrayOption('remove-current', parent)
                        }
                    } else if (!menuArray[0].contains(parent)) {
                        if (targetType === eventType) {
                            arrayOption('remove-all')
                            arrayOption('add', parent)
                        } else if (targetType !== eventType && menuArray[0].getAttribute('data-ddmenu') === 'mouseover') {
                            arrayOption('remove-all')
                        }
                    }
                }
            } else if (menuArray.length > 0 && eventType === menuArray[0].getAttribute('data-ddmenu')) {
                arrayOption('remove-all')
            }
        }

        function arrayOption(option, target) {
            if (option === 'add' && target) {
                if (!menuArray.includes(target)) {
                    menuArray.push(target)
                }
                menuArray[menuArray.length - 1].classList.add('open')
            } else if (option === 'toggle' && target) {
                if (menuArray.includes(target)) {
                    const index = menuArray.indexOf(target)
                    menuArray[index].classList.remove('open')
                    menuArray.splice(index)
                } else if (!menuArray.includes(target)) {
                    menuArray.push(target)
                    menuArray[menuArray.length - 1].classList.add('open')
                }
            } else if (option === 'remove-current' && target) {
                menuArray.forEach((menu, index) => {
                    if (index >= menuArray.indexOf(target)) {
                        menu.classList.remove('open')
                    }
                })
                menuArray.splice(menuArray.indexOf(target))
            } else if (option === 'remove-next' && target) {
                menuArray.forEach((menu, index) => {
                    if (index >= menuArray.indexOf(target) + 1) {
                        menu.classList.remove('open')
                    }
                })
                menuArray.splice(menuArray.indexOf(target) + 1)
            } else if (option === 'remove-all' && !target) {
                menuArray.forEach(menu => {
                    if (menu.classList.contains('open')) {
                        menu.classList.remove('open')
                    }
                })
                menuArray = []
            }
        }
    }
}