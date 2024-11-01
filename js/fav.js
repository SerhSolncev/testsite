// favorite.js

const addFavoriteModule = (() => {
	const addFav = document.querySelectorAll('.js-like-add');

	const addFavoriteHandler = (elem) => {
		const id = elem.getAttribute('data-id');
		const url = elem.getAttribute('data-url');
		elem.classList.toggle('added');

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ addFav: elem.classList.contains('added'), id: id })
		})
		.then(response => response.text())
		.then(data => {
			// Можно добавить обработку ответа от сервера здесь, если необходимо
		})
		.catch(error => console.error('Ошибка загрузки данных:', error));
	};

	const init = () => {
		if (addFav.length > 0) {
			const options = {
				root: null, // наблюдаем за элементами в пределах видимости окна
				rootMargin: '0px',
				threshold: 0.1 // срабатывает, когда 10% элемента становится видимо
			};

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						// Элемент в зоне видимости, добавляем обработчик события
						const elem = entry.target;
						elem.addEventListener('click', () => addFavoriteHandler(elem));
						// Отменяем наблюдение после добавления обработчика
						observer.unobserve(elem);
					}
				});
			}, options);

			addFav.forEach(elem => {
				observer.observe(elem); // Начинаем наблюдение за каждым элементом
			});
		}
	};

	return {
		init
	};
})();

export default addFavoriteModule;
