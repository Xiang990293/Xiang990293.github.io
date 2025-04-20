const albumContainer = document.getElementById('current-image-container');
const nextImageContainer = document.getElementById('next-image-container');

var albumtry = async () => {
	try {
		const res = await fetch('/all_album')
		const result = await res.json()
		return result.pics;
	} catch (error) {
		return [
			'2024-10-04_00.15.48.png',
			'2024-10-04_00.35.51.png',
			'2024-10-04_00.36.06.png',
			'2024-10-04_00.36.14.png',
			'2024-10-04_00.36.39.png',
			'2024-10-04_00.36.47.png',
			'2024-10-04_00.36.57.png',
			'2024-10-04_00.37.10.png',
			'2024-10-04_00.37.20.png',
			'2024-10-04_00.37.48.png',
			'2024-10-04_00.38.11.png',
			'2024-10-04_00.38.24.png',
			'2024-10-04_00.39.35.png',
			'2024-10-04_00.39.49.png',
			'2024-10-04_00.39.58.png',
			'2024-10-04_00.40.16.png',
			'2024-10-04_00.41.13.png',
			'2024-10-04_00.41.45.png',
			'2024-10-04_00.41.51.png',
			'2024-10-04_00.43.55.png',
			'2024-10-04_00.44.28.png',
			'2024-10-04_00.44.39.png',
			'2024-10-04_00.44.49.png',
			'2024-10-04_00.45.02.png',
			'2024-10-04_00.45.13.png',
			'2024-10-04_00.45.50.png',
			'2024-10-04_00.47.49.png',
			'2024-10-04_00.48.17.png',
			'2024-10-04_00.49.01.png',
			'2024-10-04_00.49.10.png',
			'2024-10-04_00.49.21.png',
			'2024-10-04_00.49.32.png',
			'2024-10-04_00.49.47.png',
			'2024-10-04_00.50.08.png',
			'2024-10-04_00.50.21.png',
			'2024-10-04_00.51.34.png',
			'2024-10-04_00.51.45.png',
			'2024-10-04_00.52.05.png',
			'2024-10-04_00.52.24.png',
			'2024-10-04_00.52.33.png',
			'2024-10-04_00.52.40.png',
			'2024-10-04_00.54.23.png',
			'2024-10-04_00.54.37.png',
			'2024-10-04_00.54.45.png',
			'2024-10-04_00.55.43.png',
			'2024-10-04_01.18.19.png',
			'2024-10-04_01.21.40.png',
			'2024-10-08_18.21.26.png'
		];
	}
}


/**
 * Initializes the album display by preloading images and setting up an image rotation
 * mechanism. This function fetches the list of album images, preloads them, and then
 * continuously changes the displayed image at a set interval, creating a slideshow effect.
 * It updates the background images of designated containers to cycle through the album images.
 */


async function initAlbum() {
	const albumImages = await albumtry();
	const preloadedImages = albumImages.map((image) => {
		const img = new Image();
		img.src = 'web_content/home/header_background/' + image;
		return img;
	});

	const IMAGE_INTERVAL = 5000; // Define a constant for the interval value

	let currentImageIndex = 0;

	function changeAlbumImage() {
		if (albumImages.length === 0) {
			console.error('albumImages array is empty');
			return;
		}

		const currentImage = preloadedImages[currentImageIndex];
		const nextImage = preloadedImages[(currentImageIndex + 1) % albumImages.length];

		albumContainer.style.backgroundImage = `url(${currentImage.src})`;
		albumContainer.style.opacity = 1; // Set opacity to 1 for the current image

		nextImageContainer.style.backgroundImage = `url(${nextImage.src})`;
		nextImageContainer.style.opacity = 1; // Set opacity to 0 for the next image

		setTimeout(() => {
			albumContainer.style.opacity = 0; // Set opacity to 0 for the current image
			setTimeout(() => {
				albumContainer.style.backgroundImage = `url(${nextImage.src})`;
				albumContainer.style.opacity = 1;
				currentImageIndex = (currentImageIndex + 1) % albumImages.length;
			}, 500);
		}, 500);



	}

	setInterval(changeAlbumImage, IMAGE_INTERVAL);
}

window.addEventListener('DOMContentLoaded', () => {
	initAlbum();
});