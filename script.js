document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nav = document.querySelector('.carousel-nav');
    const indicators = Array.from(nav.children);

    // Clonar la primera y última diapositiva
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const updatedSlides = Array.from(track.children);

    let currentIndex = 1; // Comenzar en el primer slide real

    function updateSlidePositions() {
        const slideWidth = track.clientWidth;

        updatedSlides.forEach((slide, index) => {
            slide.style.minWidth = `${slideWidth}px`;
            slide.style.left = `${index * slideWidth}px`; // Asegura que cada slide está posicionado correctamente
        });

        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function moveToSlide(track, currentSlide, targetSlide) {
        track.style.transition = 'transform 0.5s ease';
        const targetIndex = updatedSlides.indexOf(targetSlide);
        track.style.transform = `translateX(-${targetIndex * track.clientWidth}px)`;
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    }

    function updateIndicators(currentIndex) {
        const currentIndicator = nav.querySelector('.current-slide');
        if (currentIndicator) {
            currentIndicator.classList.remove('current-slide');
        }
        if (currentIndex === 0) {
            indicators[indicators.length - 1].classList.add('current-slide');
        } else if (currentIndex === updatedSlides.length - 1) {
            indicators[0].classList.add('current-slide');
        } else {
            indicators[currentIndex - 1].classList.add('current-slide');
        }
    }

    function moveToNextSlide() {
        const currentSlide = track.querySelector('.current-slide');
        let nextSlide = currentSlide.nextElementSibling;

        if (nextSlide.classList.contains('carousel-track')) {
            nextSlide = updatedSlides[1];
        }

        moveToSlide(track, currentSlide, nextSlide);

        currentIndex++;

        if (currentIndex === updatedSlides.length - 1) {
            setTimeout(() => {
                track.classList.add('no-transition');
                track.style.transform = `translateX(-${track.clientWidth}px)`;
                currentIndex = 1;
                updatedSlides[1].classList.add('current-slide');
                updatedSlides[updatedSlides.length - 1].classList.remove('current-slide');
                setTimeout(() => track.classList.remove('no-transition'), 50);
            }, 500); // Duración de la transición
        }

        updateIndicators(currentIndex);
    }

    function moveToPrevSlide() {
        const currentSlide = track.querySelector('.current-slide');
        let prevSlide = currentSlide.previousElementSibling;

        if (prevSlide.classList.contains('carousel-track')) {
            prevSlide = updatedSlides[updatedSlides.length - 2];
        }

        moveToSlide(track, currentSlide, prevSlide);

        currentIndex--;

        if (currentIndex === 0) {
            setTimeout(() => {
                track.classList.add('no-transition');
                track.style.transform = `translateX(-${(updatedSlides.length - 2) * track.clientWidth}px)`;
                currentIndex = updatedSlides.length - 2;
                updatedSlides[updatedSlides.length - 2].classList.add('current-slide');
                updatedSlides[0].classList.remove('current-slide');
                setTimeout(() => track.classList.remove('no-transition'), 50);
            }, 500); // Duración de la transición
        }

        updateIndicators(currentIndex);
    }

    function moveToSlideByIndex(index) {
        const currentSlide = track.querySelector('.current-slide');
        const targetSlide = updatedSlides[index + 1]; // Ajustar por el primer clone
        moveToSlide(track, currentSlide, targetSlide);
        currentIndex = index + 1;
        updateIndicators(currentIndex);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            moveToSlideByIndex(index);
        });
    });

    setInterval(moveToNextSlide, 3000); // Cambia cada 3 segundos

    // Set the initial slide and indicator
    track.style.transform = `translateX(-${track.clientWidth}px)`;
    updatedSlides[1].classList.add('current-slide');
    indicators[0].classList.add('current-slide');

    // Recalcular posiciones al redimensionar la ventana
    window.addEventListener('resize', updateSlidePositions);
    updateSlidePositions();

    // Establecer las posiciones iniciales al cargar la página
    updateSlidePositions();
});
