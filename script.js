// Hero Swiper (only initialize when element exists)
if (document.querySelector('.hero-swiper')) {
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        effect: 'fade',
        speed: 1000,
    });
}

// Gallery Top Swiper (ke kiri - reverse, 3 slides visible, centered)
if (document.querySelector('.gallery-top-swiper')) {
    const galleryTopSwiper = new Swiper('.gallery-top-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            reverseDirection: true, // Slide ke kiri
        },
        navigation: {
            nextEl: '.gallery-top-swiper .swiper-button-next',
            prevEl: '.gallery-top-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

// Gallery Bottom Swiper (ke kanan - normal, 3 slides visible, centered)
if (document.querySelector('.gallery-bottom-swiper')) {
    const galleryBottomSwiper = new Swiper('.gallery-bottom-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            reverseDirection: false, // Slide ke kanan
        },
        navigation: {
            nextEl: '.gallery-bottom-swiper .swiper-button-next',
            prevEl: '.gallery-bottom-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

// Mini Swiper for Services Tabs (sama animasi loop untuk semua)
document.querySelectorAll('.mini-swiper').forEach(swiperEl => {
    new Swiper(swiperEl, {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 10,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        // ensure Swiper updates if parent/layout changes
        observer: true,
        observeParents: true,
        speed: 800,
    });
});

// Smooth scrolling untuk nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Tab Functionality for Services
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        // Remove active from all
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        // Add active to clicked
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Form submit dengan SweetAlert2
document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = {
        name: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        message: this.querySelector('textarea').value
    };

    if (!formData.name || !formData.email || !formData.message) {
        Swal.fire({
            icon: 'warning',
            title: 'Lengkapi Form!',
            text: 'Pastikan nama, email, dan pesan terisi.',
            confirmButtonColor: '#8e44ad'
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/submit-booking', {
            method: 'POST',
            mode: 'cors',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (response.ok) {
            // Show loading alert first
            Swal.fire({
                title: 'Memproses...',
                text: 'Mohon tunggu sebentar.',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            // Delay for normal loading time (2 seconds)
            setTimeout(() => {
                Swal.close();
                // Use `html` so longer/multi-line content shows correctly and
                // don't auto-close so user can read full message. Show confirm
                // button with custom color.
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Berhasil!',
                    html: '<p>Permintaan Anda akan diproses dan kami akan menghubungi Anda untuk mengkonfirmasi pesanan.</p>',
                    confirmButtonColor: '#8e44ad',
                    allowOutsideClick: false,
                    // Auto-close after 2500ms (2.5s) with progress bar
                    timer: 2500,
                    timerProgressBar: true
                }).then(() => {
                    // Reset the form after the alert closes (either via timer or user)
                    this.reset();
                });
            }, 2000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Booking Gagal!',
                text: result.message || 'Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.',
                confirmButtonColor: '#8e44ad'
            });
        }
    } catch (error) {
        console.error('Fetch error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Koneksi Error',
            text: 'Pastikan server backend jalan. Cek console untuk detail.',
            confirmButtonColor: '#8e44ad'
        });
    }
});

// Lightbox untuk Gallery (handle all items from both swipers and mini galleries)
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        if (galleryItems[index] && galleryItems[index].dataset.full) {
            lightboxImg.src = galleryItems[index].dataset.full;
        }
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightboxFunc() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function nextImage() {
        if (!galleryItems.length) return;
        currentIndex = (currentIndex + 1) % galleryItems.length;
        lightboxImg.src = galleryItems[currentIndex].dataset.full;
    }

    function prevImage() {
        if (!galleryItems.length) return;
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        lightboxImg.src = galleryItems[currentIndex].dataset.full;
    }

    // Event listeners (only attach if elements exist)
    if (galleryItems.length) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });
    }

    if (closeLightbox) closeLightbox.addEventListener('click', closeLightboxFunc);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightboxFunc();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightboxFunc();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });
}

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking outside or on a link
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});
// Inisialisasi Swiper Khusus Halaman Kategori (loop sama animasi)
if (document.querySelector('.wisuda-swiper')) {
    new Swiper('.wisuda-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.wisuda-swiper .swiper-button-next',
            prevEl: '.wisuda-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

// Duplikat buat kategori lain, ganti class (misal .formal-swiper di formal.html)
if (document.querySelector('.formal-swiper')) {
    new Swiper('.formal-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.formal-swiper .swiper-button-next',
            prevEl: '.formal-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

// Inisialisasi untuk kategori lainnya
if (document.querySelector('.keluarga-swiper')) {
    new Swiper('.keluarga-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.keluarga-swiper .swiper-button-next',
            prevEl: '.keluarga-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

if (document.querySelector('.prewedding-swiper')) {
    new Swiper('.prewedding-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.prewedding-swiper .swiper-button-next',
            prevEl: '.prewedding-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

if (document.querySelector('.produk-swiper')) {
    new Swiper('.produk-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.produk-swiper .swiper-button-next',
            prevEl: '.produk-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

if (document.querySelector('.sirkel-swiper')) {
    new Swiper('.sirkel-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.sirkel-swiper .swiper-button-next',
            prevEl: '.sirkel-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

if (document.querySelector('.teman-swiper')) {
    new Swiper('.teman-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.teman-swiper .swiper-button-next',
            prevEl: '.teman-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}

if (document.querySelector('.lain-swiper')) {
    new Swiper('.lain-swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.lain-swiper .swiper-button-next',
            prevEl: '.lain-swiper .swiper-button-prev',
        },
        speed: 800,
    });
}
