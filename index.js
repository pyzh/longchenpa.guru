document.addEventListener('DOMContentLoaded', e => {

    let cardsContainer = document.querySelector('.header')

    if (cardsContainer.offsetWidth >= 768) {
        let cards = cardsContainer.querySelectorAll('.card3d')
        cards.forEach(card => {
            let plane = card.querySelector('.card3d-plane')
            let glare = card.querySelector('.card3d-glare')

            cardsContainer.addEventListener('mousemove', e => {
                let {
                    left,
                    right,
                    top,
                    bottom,
                    height,
                    width
                } = plane.getBoundingClientRect()
                let centerX = right - width / 2
                let centerY = bottom - height / 2
                plane.style.transform = `
            rotateX(${-15 * (e.pageY - centerY) / cardsContainer.offsetHeight}deg)
            rotateY(${25 * (e.pageX - centerX) / cardsContainer.offsetWidth}deg)`
                glare.style.transform = `
            translateX(${-130 * e.pageX / cardsContainer.offsetWidth}px)
            translateY(${-250 * e.pageY / cardsContainer.offsetHeight}px)`
            })

            let id
            let tran = 50
            cardsContainer.addEventListener('mouseenter', e => {
                id = setInterval(() => {
                    if (tran <= 50) {
                        clearInterval(id)
                    } else {
                        tran -= 6
                        plane.style.transition = `transform ${tran}ms`
                    }
                }, 16)
            })

            cardsContainer.addEventListener('mouseleave', e => {
                if (id) clearInterval(id)
                tran = 500
                plane.style.transition = `transform ${tran}ms`
                plane.style.transform = ''
            })
        })
    }

    let slidesContainers = document.querySelectorAll('.slides a')
    Array.from(slidesContainers).map(showSlides)
    async function showSlides(slidesContainer, index) {
        let text = await fetch(slidesContainer.href).then(res => res.text())
        let dom = new DOMParser().parseFromString(text, "text/html")
        let slides = Array.from(dom.images).map(i =>
            new URL('.' + new URL(i.src).pathname, slidesContainer.href).href
        )
        let backgroundImage = document.createElement('img')
        let foregroundImage = document.createElement('img')
        backgroundImage.src = slides[0]
        foregroundImage.src = slides[1]
        let next = 2
        slidesContainer.appendChild(backgroundImage)
        slidesContainer.appendChild(foregroundImage)

        backgroundImage.style.opacity = 1
        foregroundImage.style.opacity = 0
        setTimeout(showNextSlide, index * 2500 + 2500)

        function showNextSlide() {
            fadeIn(foregroundImage)
            setTimeout(switchSlides, 2000)
            setTimeout(showNextSlide, 5000)
        }

        function fadeIn(element) {
            let opacity = 0
            let id = setInterval(function () {
                element.style.opacity = opacity
                opacity += 1 / 60
                if (opacity > 1) clearInterval(id)
            }, 800 / 60)
        }

        function switchSlides() {
            backgroundImage.src = foregroundImage.src
            foregroundImage.style.opacity = 0
            foregroundImage.src = slides[next]
            next++
            if (next == slides.length) next = 0
        }
    }
})