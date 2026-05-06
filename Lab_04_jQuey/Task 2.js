const images = [
    {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        title: "Majestic Mountains"
    },
    {
        url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
        title: "Serene Lakeview"
    },
    {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
        title: "Deep Forest Path"
    }
];

let currentIndex = 0;
const imgElement = document.getElementById('galleryImg');
const captionElement = document.getElementById('caption');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

function updateGallery(index) {
    // 1. Add fade-out class
    imgElement.classList.add('fade-out');
    captionElement.style.transform = "translateY(20px)";
    captionElement.style.opacity = "0";

    // 2. Wait for fade-out animation to finish (500ms)
    setTimeout(() => {
        imgElement.src = images[index].url;
        captionElement.innerText = images[index].title;

        // 3. Remove fade-out class to fade back in
        imgElement.classList.remove('fade-out');
        captionElement.style.transform = "translateY(0)";
        captionElement.style.opacity = "1";
    }, 500);
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery(currentIndex);
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateGallery(currentIndex);
});