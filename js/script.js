function FlipSlider(options) {
    // Variáveis privadas
    var container = options.container,
        startSlideIndex = options.startIndex || 0,
        slider = container.querySelector(".flip"),
        slides = slider.querySelectorAll(".slide"),
        nextBtn = container.querySelector(".next"),
        prevBtn = container.querySelector(".prev"),
        downloadBtn = container.querySelector(".download"),
        timeout,
        frontSlide,
        backSlide;

    // == Funções públicas == //

    // Próxima rotação
    this.nextFlip = function () {
        doFlip(1);
    };

    // Rotação anterior
    this.prevFlip = function () {
        doFlip(-1);
    };

    // == Funções privadas == //

    // Rotacionar slides
    function doFlip(dir) {
        if (!container.querySelector(".animate")) {
            slider.classList.add("animate");

            if (dir == -1) {
                slider.classList.add("animateL");
            }

            frontSlide = slider.querySelector(".front");
            backSlide = findBack(dir);

            backSlide.classList.add("back");

            timeout = setTimeout(function () {
                resetSlides();
                clearTimeout(timeout);
            }, 600);
        }
    }

    // Resetar slides ao concluir a rotação
    function resetSlides() {
        frontSlide = slider.querySelector(".front");
        backSlide = slider.querySelector(".back");

        backSlide.classList.add("front");
        backSlide.classList.remove("back");
        frontSlide.classList.remove("front");
        slider.classList.remove("animate");
        slider.classList.remove("animateL");
    }

    // Encontrar o slide que será rotacionado para trás
    function findBack(dir) {
        var frontIndex, target, slideCount;

        slides = slider.querySelectorAll(".slide");
        slideCount = slides.length;

        for (var i = 0; i < slideCount; i++) {
            if (slides[i].classList.contains("front")) {
                frontIndex = i;
            }
        }

        if (dir == -1) {
            target = frontIndex < 1 ? slides[slideCount - 1] : slides[frontIndex - 1];
        } else {
            target = (frontIndex + 1) < slideCount ? slides[frontIndex + 1] : slides[0];
        }

        return target;
    }

    // Função para download da imagem atualmente visível
    function downloadCurrentImage() {
        var frontSlide = slider.querySelector(".front");
        var imgElement = frontSlide.querySelector("img");
        var imgURL = imgElement.src;

        var link = document.createElement("a");
        link.href = imgURL;
        link.download = `image-${Array.from(slides).indexOf(frontSlide) + 1}.jpg`; // Nome do arquivo para download
        link.click();
    }

    // Inicialização
    (function (instance) {
        // Definir o primeiro slide
        startSlideIndex = startSlideIndex >= slides.length ? 0 : startSlideIndex;
        slides[startSlideIndex].classList.add("front");

        // Vinculação de eventos
        nextBtn.onclick = instance.nextFlip;
        prevBtn.onclick = instance.prevFlip;
        downloadBtn.onclick = downloadCurrentImage;
    })(this);
}

// Criando a instância do slider
var flip1 = new FlipSlider({
    startIndex: 0,
    container: document.querySelector(".flip-slider")
});
