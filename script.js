/* 

let currentImageIndex = 0;
const images = ["images/image1.jpg", "images/image2.jpg", "images/image3.jpg", "images/image4.jpg", "images/image5.jpg"];

document.getElementById('next-btn').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.querySelector('.carousel-image').src = images[currentImageIndex];
});

document.getElementById('prev-btn').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    document.querySelector('.carousel-image').src = images[currentImageIndex];
});

function searchSite() {
    const query = document.getElementById('search').value.toLowerCase();
    alert(`Search functionality not implemented. You searched for: ${query}`);
}

*/
document.addEventListener('DOMContentLoaded', () => {
    // Load content from JSON
    fetch('data/content.json') // Adjust the path if needed
        .then(response => response.json())
        .then(data => {
            const content = data.index;

            // Set the main title and about text
            document.getElementById('main-title').textContent = content.title;
            document.getElementById('about-title').textContent = content.about.title;
            document.getElementById('about-text').textContent = content.about.text.join('\n');

            // Initialize the carousel
            let currentImageIndex = 0;
            const carouselImages = content.carousel;
            const carouselImageElement = document.getElementById('carousel-image');
            const carouselCaptionElement = document.getElementById('carousel-caption');

            const updateCarouselImage = () => {
                carouselImageElement.src = carouselImages[currentImageIndex].image;
                carouselImageElement.alt = carouselImages[currentImageIndex].alt;
                carouselCaptionElement.textContent = carouselImages[currentImageIndex].caption;
            };

            updateCarouselImage();

            document.getElementById('prev-btn').addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + carouselImages.length) % carouselImages.length;
                updateCarouselImage();
            });

            document.getElementById('next-btn').addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
                updateCarouselImage();
            });
        })
        .catch(error => console.error('Error loading content:', error));
});
