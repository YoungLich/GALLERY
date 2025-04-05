let currentDesktopIndex = 0;
let currentMobileIndex = 0;
let desktopImages = [];
let mobileImages = [];
let isAnimating = false;

// Cache de elementos
const elements = {
    desktop: {
        flip: document.getElementById("desktopFlip"),
        current: document.getElementById("desktopCurrent"),
        next: document.getElementById("desktopNext")
    },
    mobile: {
        flip: document.getElementById("mobileFlip"),
        current: document.getElementById("mobileCurrent"),
        next: document.getElementById("mobileNext")
    }
};

// Função para carregar imagem com tratamento de erro
function loadImage(element, src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            element.src = src;
            resolve(true);
        };
        img.onerror = () => {
            console.error("Erro ao carregar imagem:", src);
            resolve(false);
        };
        img.src = src;
    });
}

// Carrega os dados JSON e inicia a galeria
async function initGallery() {
    try {
        const [desktopRes, mobileRes] = await Promise.all([
            fetch('json/desktop.json'),
            fetch('json/mobile.json')
        ]);

        desktopImages = (await desktopRes.json()).gallery;
        mobileImages = (await mobileRes.json()).gallery;

        await loadInitialImages();
        setupEventListeners();
    } catch (error) {
        console.error("Erro ao carregar galeria:", error);
        alert("Erro ao carregar a galeria. Recarregue a página.");
    }
}

// Carrega as imagens iniciais
async function loadInitialImages() {
    if (desktopImages.length > 0) {
        await loadImage(elements.desktop.current, desktopImages[currentDesktopIndex].src);
        await preloadImage('desktop', getNextIndex('desktop', 1));
    }

    if (mobileImages.length > 0) {
        await loadImage(elements.mobile.current, mobileImages[currentMobileIndex].src);
        await preloadImage('mobile', getNextIndex('mobile', 1));
    }
}

// Pré-carrega uma imagem
async function preloadImage(device, index) {
    return loadImage(elements[device].next, getImageSrc(device, index));
}

// Obtém o índice seguinte/anterior
function getNextIndex(device, direction) {
    const images = device === 'desktop' ? desktopImages : mobileImages;
    const currentIndex = device === 'desktop' ? currentDesktopIndex : currentMobileIndex;
    return (currentIndex + direction + images.length) % images.length;
}

// Obtém o src da imagem
function getImageSrc(device, index) {
    const images = device === 'desktop' ? desktopImages : mobileImages;
    return images[index].src;
}

// Configura os event listeners
function setupEventListeners() {
    document.getElementById("prev").addEventListener("click", () => navigate(-1));
    document.getElementById("next").addEventListener("click", () => navigate(1));
    document.getElementById("downloadDesktop").addEventListener("click", () => downloadImage('desktop'));
    document.getElementById("downloadMobile").addEventListener("click", () => downloadImage('mobile'));
}

async function navigate(direction) {
    if (isAnimating) return;
    isAnimating = true;

    // Pré-carrega as próximas imagens
    const nextDesktopIndex = getNextIndex('desktop', direction);
    const nextMobileIndex = getNextIndex('mobile', direction);

    await Promise.all([
        loadImage(elements.desktop.next, getImageSrc('desktop', nextDesktopIndex)),
        loadImage(elements.mobile.next, getImageSrc('mobile', nextMobileIndex))
    ]);

    // Configura a animação
    const animateClass = direction > 0 ? "animate" : "animateL";

    // Adiciona a classe de animação
    elements.desktop.flip.classList.add(animateClass);
    elements.mobile.flip.classList.add(animateClass);

    // Quando a animação atingir 50% (ponto de virada)
    setTimeout(() => {
        // Troca as imagens de forma invisível
        elements.desktop.current.src = getImageSrc('desktop', nextDesktopIndex);
        elements.mobile.current.src = getImageSrc('mobile', nextMobileIndex);

        // Atualiza os índices
        currentDesktopIndex = nextDesktopIndex;
        currentMobileIndex = nextMobileIndex;
    }, 350); // Metade do tempo da animação (700ms)

    // Quando a animação terminar
    const finishAnimation = () => {
        elements.desktop.flip.classList.remove("animate", "animateL");
        elements.mobile.flip.classList.remove("animate", "animateL");

        // Reseta a transformação para evitar problemas no próximo flip
        elements.desktop.flip.style.transform = 'rotateY(0)';
        elements.mobile.flip.style.transform = 'rotateY(0)';

        isAnimating = false;
    };

    setTimeout(finishAnimation, 700);
}

// Download da imagem
function downloadImage(device) {
    if (isAnimating) return;

    const index = device === 'desktop' ? currentDesktopIndex : currentMobileIndex;
    const images = device === 'desktop' ? desktopImages : mobileImages;

    if (images[index]) {
        const link = document.createElement("a");
        link.href = images[index].src;
        link.download = `${device}-wallpaper-${index + 1}.jpg`;
        link.click();
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initGallery);