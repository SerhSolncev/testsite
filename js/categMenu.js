// categoriesMenu.js

const categoriesMenuModule = (() => {
	const init = () => {
		const miniCategories = document.querySelectorAll('.js-mini-category');
		const categoriesMenu = document.querySelector('.js-categories-menu');

		if (miniCategories.length > 0) {
			const options = {
				root: null, // наблюдаем за элементами в пределах видимости окна
				rootMargin: '0px',
				threshold: 0.1 // срабатывает, когда 10% элемента становится видимо
			};

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						// Если элемент в зоне видимости, инициализируем события
						initMouseEvents(miniCategories, categoriesMenu);
						observer.unobserve(entry.target); // Отменяем наблюдение после инициализации
					}
				});
			}, options);

			miniCategories.forEach(button => {
				observer.observe(button); // Начинаем наблюдение за каждым элементом
			});
		}
	};

	const initMouseEvents = (miniCategories, categoriesMenu) => {
		miniCategories.forEach(button => {
			button.addEventListener('mouseenter', () => handleMouseEnter(button, categoriesMenu));
		});

		categoriesMenu.addEventListener('mouseleave', () => handleMenuLeave(categoriesMenu));
		document.querySelector('.js-header').addEventListener('mouseenter', () => handleHeaderEnter(categoriesMenu));

		categoriesMenu.addEventListener('transitionend', () => handleTransitionEnd(categoriesMenu));
	};

	const handleMouseEnter = (button, categoriesMenu) => {
		if (window.innerWidth > 1279) {
			const dataId = button.getAttribute('data-id');
			const targetBlock = document.querySelector(`.js-categories-block[data-id="${dataId}"]`);

			resetCategories();

			categoriesMenu.classList.add('show');
			targetBlock.classList.add('block');

			setTimeout(() => {
				targetBlock.classList.add('show');
				adjustMenuHeight(categoriesMenu);
			}, 100);

			button.classList.add('active');
		}
	};

	const resetCategories = () => {
		const categoriesMenu = document.querySelector('.js-categories-menu');
		document.querySelectorAll('.js-categories-block').forEach(block => block.classList.remove('show', 'block'));
		document.querySelectorAll('.js-mini-category').forEach(btn => btn.classList.remove('active'));
	};

	const handleMenuLeave = (categoriesMenu) => {
		categoriesMenu.classList.remove('show');
		resetCategories();
	};

	const handleHeaderEnter = (categoriesMenu) => {
		handleMenuLeave(categoriesMenu);
	};

	const adjustMenuHeight = (menu) => {
		menu.style.height = 'auto';
		const height = menu.scrollHeight;
		menu.style.height = `${height}px`;
	};

	const handleTransitionEnd = (categoriesMenu) => {
		if (!categoriesMenu.classList.contains('show')) {
			categoriesMenu.style.height = '0';
		}
	};

	return {
		init
	};
})();

export default categoriesMenuModule;
