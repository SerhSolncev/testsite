// search.js

let searchTimeout;
const searchResultWrap = document.querySelector('.js-search-block');
const searchResultBlock = searchResultWrap.querySelector('.js-search-result');
const emptyError = searchResultWrap.querySelector('.js-search-empty .empty-search__error');
const searchEmpty = searchResultWrap.querySelector('.js-search-empty');
const dropdown = searchResultWrap.querySelector('.js-hover-dropdown');

// Функция выполнения поиска
async function performSearch(query) {
	const lowerCaseQuery = query.toLowerCase();

	if (lowerCaseQuery.includes('purina') || lowerCaseQuery.startsWith('pu') || lowerCaseQuery.startsWith('пу')) {
		try {
			const response = await fetch('search-list.html');
			const data = await response.text();
			searchResultBlock.innerHTML = data;
			searchResultBlock.classList.add('has-result');
			searchEmpty.style.display = 'none';
			dropdown.classList.add('show');
		} catch (error) {
			console.error('Ошибка загрузки результатов поиска:', error);
		}
	} else {
		removeHtml();
		showEmptyError(true, true); // Показать ошибку "Нет совпадений"
	}
}

// Функция очистки результатов поиска
function removeHtml() {
	searchResultBlock.innerHTML = '';
	searchResultBlock.classList.remove('has-result');
}

// Функция показа/скрытия пустого блока ошибки
function showEmptyError(show, noMatches = false) {
	searchEmpty.style.display = show ? 'block' : 'none';
	emptyError.classList.toggle('show', noMatches);
	dropdown.classList.add('show');
}

// Функция переключения видимости кнопки очистки
function toggleClearButton(input) {
	const clearButton = input.parentElement.querySelector('.js-search-clear');
	clearButton.classList.toggle('visible', input.value.length > 2);
}

// Инициализация слушателей для инпута поиска
function initSearchListeners() {
	document.querySelectorAll('.js-search-input').forEach(input => {
		input.addEventListener('input', function() {
			const query = this.value.trim();
			clearTimeout(searchTimeout);

			toggleClearButton(this);

			// Проверка на пустой инпут
			if (query.length === 0) {
				showEmptyError(true, false); // Показать блок `empty-search`, убрать ошибку "Нет совпадений"
				removeHtml();
				return;
			}

			searchTimeout = setTimeout(() => performSearch(query), 300);
		});

		input.addEventListener('focus', () => dropdown.classList.add('show'));
	});

	document.querySelectorAll('.js-search-clear').forEach(button => {
		button.addEventListener('click', function() {
			const input = this.parentElement.querySelector('.js-search-input');
			input.value = '';
			toggleClearButton(input);

			const event = new Event('input', { bubbles: true });
			setTimeout(() => {
				input.dispatchEvent(event);
				input.focus();
			}, 50);

			setTimeout(() => {
				removeHtml();
				showEmptyError(true, false); // Показать блок `empty-search`, убрать ошибку "Нет совпадений"
			}, 200);
		});
	});

	document.addEventListener('click', (event) => {
		if (window.innerWidth > 991 && !event.target.closest('.js-search-block')) {
			dropdown.classList.remove('show');
		}
	});
}

// Экспортируем функцию инициализации
export function initSearch() {
	initSearchListeners();
}
