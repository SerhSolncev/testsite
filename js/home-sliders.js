const getElement = (context, selector) => context && selector ? context.querySelector(selector) : null;

async function createSwiper(el, options) {
	const { default: Swiper } = await import('./modules/swiper.min.js');
	return new Swiper(el.querySelector('.swiper-container'), {
		freeMode: false,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		simulateTouch: true,
		loop: false,
		slidesPerView: options.slidesPerView || 1,
		slidesPerGroup: options.slidesPerGroup || 1,
		followFinger: true,
		spaceBetween: options.spaceBetween || 0,
		speed: options.speed || 300,
		autoplay: options.autoplay,
		effect: options.effect,
		fadeEffect: options.fadeEffect,
		navigation: {
			nextEl: getElement(el, '.js-next-swiper'),
			prevEl: getElement(el, '.js-prev-swiper'),
			disabledClass: 'swiper-lock'
		},
		pagination: {
			el: el.querySelector('.swiper-pagination'),
			clickable: true,
		},
		breakpoints: options.breakpoints,
		on: options.on
	});
}

function initSliders(selector, options) {
	document.querySelectorAll(selector).forEach(el => createSwiper(el, options));
}

function loadSwiper() {
	initSliders('[data-slider="home-slider"]', {
		slidesPerView: 1,
		effect: 'fade',
		fadeEffect: { crossFade: true }
	});

	initSliders('[data-slider="wild-slider"]', {
		slidesPerView: 4,
		spaceBetween: 4,
		autoplay: { delay: 3000, disableOnInteraction: true },
		speed: 700,
		breakpoints: {
			0: { slidesPerView: 1, spaceBetween: 10 },
			560: { slidesPerView: 2, spaceBetween: 20 },
			860: { slidesPerView: 3, spaceBetween: 20 },
			1200: { slidesPerView: 4, spaceBetween: 20 }
		}
	});

	initSliders('[data-slider="wild-slider-sec"]', {
		slidesPerView: 4,
		spaceBetween: 4,
		breakpoints: {
			0: { slidesPerView: 2, spaceBetween: 10 },
			640: { slidesPerView: 2, spaceBetween: 10 },
			1200: { slidesPerView: 4, slidesPerGroup: 2, spaceBetween: 20 }
		}
	});

	initSliders('[data-slider="wild-slider-three"]', {
		slidesPerView: 4,
		spaceBetween: 4,
		breakpoints: {
			0: { slidesPerView: 1, spaceBetween: 20 },
			560: { slidesPerView: 2, spaceBetween: 10 },
			860: { slidesPerView: 3, spaceBetween: 10 },
			1200: { slidesPerView: 4, slidesPerGroup: 2, spaceBetween: 20 }
		}
	});

	initSliders('[data-slider="double-slider"]', {
		slidesPerView: 2,
		spaceBetween: 4,
		breakpoints: {
			0: { slidesPerView: 1, spaceBetween: 10 },
			1200: { slidesPerView: 2, spaceBetween: 20 }
		}
	});

	initSliders('[data-slider="brands-slider"]', {
		slidesPerView: 2,
		spaceBetween: 4,
		autoplay: { delay: 3000, disableOnInteraction: true },
		speed: 700,
		breakpoints: {
			0: { slidesPerView: 3, spaceBetween: 10 },
			768: { slidesPerView: 5, spaceBetween: 20 },
			1200: { slidesPerView: 7, slidesPerGroup: 2, spaceBetween: 20 }
		}
	});
}

const sliderObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			loadSwiper();
			sliderObserver.unobserve(entry.target);
		}
	});
});

document.querySelectorAll('[data-slider]').forEach(slider => {
	sliderObserver.observe(slider);
});
