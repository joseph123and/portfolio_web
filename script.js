document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 2. Scroll Animations
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // 3. Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 5%';
            navbar.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
        } else {
            navbar.style.padding = '1.5rem 5%';
            navbar.style.backgroundColor = 'rgba(5, 5, 5, 0.85)';
        }
    });

    // 4. PROJECT MODAL (GALLERY) LOGIC
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDesc = document.getElementById('modal-desc');
    const mainMediaViewer = document.getElementById('modal-main-media');
    const thumbnailStrip = document.getElementById('modal-thumbnails');

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            // Get basic data
            const title = card.getAttribute('data-title');
            const category = card.getAttribute('data-category');
            const desc = card.getAttribute('data-desc');
            const mediaJson = card.getAttribute('data-media');

            // Populate basic info
            modalTitle.textContent = title;
            modalCategory.textContent = category;
            modalDesc.textContent = desc;

            // Clear previous gallery
            mainMediaViewer.innerHTML = '';
            thumbnailStrip.innerHTML = '';

            if (mediaJson) {
                const mediaItems = JSON.parse(mediaJson);
                
                // Function to set main media
                const setMainMedia = (item) => {
                    mainMediaViewer.innerHTML = ''; // Clear main viewer
                    if (item.type === 'video') {
                        const video = document.createElement('video');
                        video.src = item.src;
                        video.controls = true;
                        video.autoplay = true;
                        mainMediaViewer.appendChild(video);
                    } else {
                        const img = document.createElement('img');
                        img.src = item.src;
                        img.alt = title;
                        mainMediaViewer.appendChild(img);
                    }
                };

                // Build thumbnails
                mediaItems.forEach((item, index) => {
                    const thumb = document.createElement('div');
                    thumb.classList.add('thumb-item');
                    if (index === 0) thumb.classList.add('active'); // First item active

                    if (item.type === 'video') {
                        const videoThumb = document.createElement('video');
                        videoThumb.src = item.src;
                        thumb.appendChild(videoThumb);
                    } else {
                        const imgThumb = document.createElement('img');
                        imgThumb.src = item.src;
                        imgThumb.alt = `${title} thumbnail ${index + 1}`;
                        thumb.appendChild(imgThumb);
                    }

                    // Click event for thumbnail
                    thumb.addEventListener('click', () => {
                        // Remove active class from all
                        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
                        // Add active to clicked
                        thumb.classList.add('active');
                        // Set main media
                        setMainMedia(item);
                    });

                    thumbnailStrip.appendChild(thumb);
                });

                // Set first item as main media initially
                if (mediaItems.length > 0) {
                    setMainMedia(mediaItems[0]);
                }
            }

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal function
    const closeModalFunction = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Stop any playing videos in the modal
        const videos = mainMediaViewer.querySelectorAll('video');
        videos.forEach(vid => vid.pause());
        mainMediaViewer.innerHTML = ''; // Clear media to stop loading
    };

    closeModal.addEventListener('click', closeModalFunction);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFunction(); });
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModalFunction(); 
    });
});