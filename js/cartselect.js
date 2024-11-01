// cartSelect.js

const cartSelectModule = (() => {
	const cartSelects = document.querySelectorAll('.js-cart-select');

	const init = () => {
		if (cartSelects.length > 0) {
			const options = {
				root: null,
				rootMargin: '0px',
				threshold: 0.1
			};

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const cartSelect = entry.target;
						setupCartSelect(cartSelect);
						observer.unobserve(cartSelect);
					}
				});
			}, options);

			cartSelects.forEach(cartSelect => {
				observer.observe(cartSelect);
			});
		}
	};

	const setupCartSelect = (cartSelect) => {
		const selectBody = cartSelect.querySelector('.cart-select__body');
		const selectDrop = cartSelect.querySelector('.cart-select__drop');
		const selectText = cartSelect.querySelector('.cart-select__text');
		const cartPrice = cartSelect.closest('.js-cart-price');

		selectBody.addEventListener('click', () => {
			selectDrop.classList.toggle('open');
		});

		const selectItems = selectDrop.querySelectorAll('.cart-select__item');
		selectItems.forEach(item => {
			item.addEventListener('click', () => handleItemClick(item, selectText, cartPrice, selectDrop));
		});

		document.addEventListener('click', (e) => {
			if (!cartSelect.contains(e.target)) {
				selectDrop.classList.remove('open');
			}
		});
	};

	const handleItemClick = (item, selectText, cartPrice, selectDrop) => {
		selectText.textContent = item.textContent.trim();

		if (cartPrice) {
			const oldPrice = item.getAttribute('data-check-old');
			const currentPrice = item.getAttribute('data-check-current');

			const priceOldElement = cartPrice.querySelector('[data-price-old]');
			const priceCurrentElement = cartPrice.querySelector('[data-price-current]');

			if (priceOldElement && oldPrice) {
				priceOldElement.textContent = `${oldPrice} грн`;
			}
			if (priceCurrentElement && currentPrice) {
				priceCurrentElement.textContent = `${currentPrice} грн`;
			}
		}

		selectDrop.classList.remove('open');
	};

	return {
		init
	};
})();

export default cartSelectModule;
