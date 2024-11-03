import lozad from './modules/lozad.min.js';

document.addEventListener('DOMContentLoaded', (event) => {
	// lazy-load
	const el = document.querySelectorAll('.lazy');
	window.observer = lozad(el);
	window.observer.observe();

	const header = document.querySelector('.js-header');
	const categoriesMenu = document.querySelector('.js-categories-menu');
	const categoriesBlocks = document.querySelectorAll('.js-categories-block');
	const headerElement = document.querySelector('.header');
	const headerHeight = header.offsetHeight;

	function throttle(func, limit) {
		let lastFunc;
		let lastRan;
		return function (...args) {
			if (!lastRan) {
				func.apply(this, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(() => {
					if ((Date.now() - lastRan) >= limit) {
						func.apply(this, args);
						lastRan = Date.now();
					}
				}, limit - (Date.now() - lastRan));
			}
		};
	}
	const handleScroll = throttle(function () {
		const scrollY = window.scrollY;

		if (scrollY > 50 && window.innerWidth > 1279) {
			categoriesMenu.classList.remove('show');
			categoriesBlocks.forEach(block => block.classList.remove('show'));

			setTimeout(() => {
				categoriesBlocks.forEach(block => block.classList.remove('block'));
			}, 100);
		}

		if (scrollY > headerHeight) {
			headerElement.classList.add('scroll');
		} else {
			headerElement.classList.remove('scroll');
		}
	}, 100);

	window.addEventListener('scroll', handleScroll);


	// inview
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('animate');
				observer.unobserve(entry.target);
			}
		});
	});
	document.querySelectorAll('.js-inview').forEach(el => observer.observe(el));

	document.addEventListener('click', (event) => {
		const button = event.target.closest('.js-open-acc, .js-open-acc-m');
		if (!button) return;

		const isMobileAcc = button.classList.contains('js-open-acc-m');
		const parentAcc = button.closest(isMobileAcc ? '.js-acc-m' : '.js-acc');
		const accBlock = parentAcc.querySelector(isMobileAcc ? '.js-acc-block-m' : '.js-acc-block');
		const parentWrap = button.closest(isMobileAcc ? '.js-acc-wrap-m' : '.js-acc-wrap');
		const mobileMenuBody = document.querySelector('.mobile-menu__body');
		const activeClass = isMobileAcc ? 'active-m' : 'active';

		function updateParentMaxHeight(element) {
			while (element) {
				if (element.classList.contains('js-acc-block-m')) {
					element.style.maxHeight = '0';
					const scrollHeight = element.scrollHeight;
					element.style.maxHeight = `${scrollHeight}px`;
				}
				element = element.parentElement.closest('.js-acc-block-m');
			}
		}

		if (parentAcc.classList.contains(activeClass)) {
			accBlock.style.maxHeight = `${accBlock.scrollHeight}px`;
			requestAnimationFrame(() => {
				accBlock.style.transition = 'max-height 0.3s ease';
				accBlock.style.maxHeight = '0';
				parentAcc.classList.remove(activeClass);
			});
			accBlock.addEventListener('transitionend', () => {
				accBlock.style.transition = '';
				updateParentMaxHeight(parentAcc.closest('.js-acc-block-m'));
			}, { once: true });

			if (!isMobileAcc && parentAcc.classList.contains('promo-block')) {
				parentAcc.querySelector('input').value = '';
			}
			return;
		}

		parentWrap.querySelectorAll(isMobileAcc ? '.js-acc-m' : '.js-acc').forEach((item) => item.classList.remove(activeClass));
		parentWrap.querySelectorAll(isMobileAcc ? '.js-acc-block-m' : '.js-acc-block').forEach((block) => (block.style.maxHeight = '0'));

		accBlock.style.maxHeight = `${accBlock.scrollHeight}px`;
		parentAcc.classList.add(activeClass);

		setTimeout(() => {
			const scrollToPosition = parentAcc.getBoundingClientRect().top + mobileMenuBody.scrollTop - mobileMenuBody.getBoundingClientRect().top;

			mobileMenuBody.scrollTo({
				top: scrollToPosition - 20,
				behavior: 'smooth'
			});
			if (isMobileAcc) mobileMenuBody.style.height = `${parentWrap.offsetHeight}px`;

			accBlock.addEventListener('transitionend', () => {
				updateParentMaxHeight(parentAcc.closest('.js-acc-block-m'));

				setTimeout(() => {
					updateParentMaxHeight(parentAcc.closest('.js-acc-block-m'));
					if (isMobileAcc) mobileMenuBody.style.height = 'auto';
				}, 100);
			}, { once: true });

		}, 300);
	});



	// call-dropdowns
	let callTriggers = document.querySelectorAll('.js-trigger-drop');

	function showDropdown(dataId) {
		let callDropdown = document.querySelector(`.js-hover-dropdown[data-id="${dataId}"]`);
		let callTriggers = document.querySelectorAll(`.js-trigger-drop[data-id="${dataId}"]`);
		let windowWidth = window.innerWidth;

		if (!callDropdown.classList.contains('show')) {
			closeAllDropdowns();
		}

		callDropdown.classList.add('show');

		callTriggers.forEach(trigger => {
			trigger.classList.add('opened');
		});

		if (windowWidth < 991) {
			document.body.style.overflow = 'hidden';
		}

		let callClose = callDropdown.querySelector('.js-drop-close');
		if (callClose !== null) {
			callClose.addEventListener('click', function() {
				hideDropdown(dataId);
			});
		}
	}

	function hideDropdown(dataId) {
		let callDropdown = document.querySelector(`.js-hover-dropdown[data-id="${dataId}"]`);
		let callTriggers = document.querySelectorAll(`.js-trigger-drop[data-id="${dataId}"]`);

		callDropdown.classList.remove('show');

		callTriggers.forEach(trigger => {
			trigger.classList.remove('opened');
		});
		document.body.style.overflow = 'initial';

		if (document.querySelector('.micromodal-slide.is-open')) {
			MicroModal.close();
		}
	}

	function toggleDropdown(dataId) {
		let callDropdown = document.querySelector(`.js-hover-dropdown[data-id="${dataId}"]`);
		let isDropdownOpen = callDropdown.classList.contains('show');

		if (isDropdownOpen) {
			hideDropdown(dataId);
		} else {
			showDropdown(dataId);
		}
	}

	function closeAllDropdowns() {
		let allDropdowns = document.querySelectorAll('.js-hover-dropdown');
		let allTriggers = document.querySelectorAll('.js-trigger-drop');

		allDropdowns.forEach(dropdown => dropdown.classList.remove('show'));
		allTriggers.forEach(trigger => trigger.classList.remove('opened'));
		document.body.style.overflow = 'initial';
		if (document.querySelector('.micromodal-slide.is-open')) { // Проверяем, есть ли открытое модальное окно
			MicroModal.close();
		}
	}

	function setupDropdownBehavior() {
		let windowWidth = window.innerWidth;

		callTriggers.forEach(trigger => {
			let dataId = trigger.getAttribute('data-id');

			trigger.addEventListener('click', function(e) {
				e.preventDefault();

				setTimeout(() => {
					if(trigger.classList.contains('opened')) {
						if(dataId === 'drop-search') {
							const input = document.querySelector('.search-dropdown').querySelector('input');
							const event = new Event('touchstart', { bubbles: true });
							setTimeout(() => {
								input.dispatchEvent(event);
								input.focus();
								input.click();
							}, 50)
						}
					}
				}, 500)

				if (windowWidth < 991) {
					toggleDropdown(dataId);
				} else if(windowWidth > 991 && trigger.classList.contains('burger')) {
					toggleDropdown(dataId);
				}

			});
		});
	}

	setupDropdownBehavior();

	// popups
	document.querySelectorAll('[data-id-modal]').forEach(button => {
		button.addEventListener('click', function () {
			const modalId = this.getAttribute('data-id-modal');

			if (button.classList.contains('opened')) {
				MicroModal.close(modalId, {
					awaitCloseAnimation: true
				});
			} else {
				MicroModal.show(modalId, {
					awaitCloseAnimation: true,
					onShow: () => {
						document.body.style.overflow = 'hidden';
						button.classList.add('opened');
						if (document.querySelector('.js-hover-dropdown.show')) {
							document.querySelector('.js-hover-dropdown.show').classList.remove('show');
							document.querySelector('.js-trigger-drop.opened').classList.remove('opened');
						}
					},
					onClose: () => {
						document.body.style.overflow = 'initial';
						button.classList.remove('opened');
					}
				});
			}
		});
	});

	document.querySelectorAll('.js-close-modal').forEach(button => {
		button.addEventListener('click', () => {
			MicroModal.close();
			document.body.style.overflow = 'initial';
		});

	});

	const addToCart = document.querySelectorAll('.js-add-to-cart');

	if(addToCart.length > 0) {
		addToCart.forEach((elem) => {
			const id = elem.getAttribute('data-id');
			const url = elem.getAttribute('data-url');

			elem.addEventListener('click', () => {
				MicroModal.show('basket-popup', {
					onShow: () => {
						document.body.style.overflow = 'hidden';
						if(document.querySelector('.js-hover-dropdown.show')) {
							document.querySelector('.js-hover-dropdown.show').classList.remove('show');
							document.querySelector('.js-trigger-drop.opened').classList.remove('opened');

						}
					},
					onClose: () => {
						document.body.style.overflow = 'initial';
					}
				});
				fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ addToCart: true, id: id })
				})
				.then(response => response.text())
				.then(data => {
					// Check if there are no more .js-basket-cart elements in the .basket-list
					const basketList = document.querySelector('.basket-list');
					if (!basketList.querySelector('.js-basket-cart')) {
						basketList.closest('.basket-popup').classList.add('basket-popup--empty');
					}
				})
				.catch(error => console.error('Ошибка загрузки данных:', error));
			})
		})
	}

	// password

	document.querySelectorAll('.js-show-password').forEach((el) => {
		const input = el.nextElementSibling;

		el.addEventListener('click', () => {
			if (el.classList.contains('show')) {
				el.classList.remove('show');
				input.type = 'password';
			} else {
				el.classList.add('show');
				input.type = 'text';
			}
		});

		// Clear the 'show' class and reset input type when the input is cleared
		input.addEventListener('input', () => {
			if (input.value === '') {
				el.classList.remove('show');
				input.type = 'password';
			}
		});
	});

	// send form
	const jsForm = document.querySelectorAll('.js-form');

	if (jsForm !== null) {
		jsForm.forEach((formItem) => {
			let inputs = formItem.querySelectorAll('input, textarea, select');

			inputs.forEach(function(input) {
				// Проверяем наличие атрибута data-required
				if (input.hasAttribute('data-required')) {
					input.addEventListener('input', () => {
						if (input.value.length > 1) {
							input.classList.remove('error');
						} else {
							input.classList.add('error');
						}
					});
				}
			});

			formItem.addEventListener('submit', function(event) {
				event.preventDefault();

				let inputs = formItem.querySelectorAll('input, textarea');
				let errorBlock = formItem.querySelector('.error-form'); // Находим блок error-form
				let isValid = true;

				// Убираем ошибки с полей
				inputs.forEach(function(input) {
					input.classList.remove('error');
					if (input.classList.contains('hidden-input')) {
						input.closest('.js-custom-select').classList.remove('error');
					}
				});

				// Проверяем, заполнены ли обязательные поля
				inputs.forEach(function(input) {
					if (input.hasAttribute('data-required') && !input.value) {
						isValid = false;
						input.classList.add('error');
						if (input.classList.contains('hidden-input')) {
							input.closest('.js-custom-select').classList.add('error');
						}
					}
				});

				// Показываем блок error-form, если форма не валидна
				if (!isValid && errorBlock) {
					errorBlock.style.display = 'block';
				} else if (errorBlock) {
					errorBlock.style.display = 'none';
				}

				// Если форма валидна, отправляем данные
				if (isValid) {
					var formData = new FormData(this);
					var dataArray = [];
					formData.forEach(function(value, key) {
						dataArray.push({ key: key, value: value });
					});

					var xhr = new XMLHttpRequest();
					xhr.open('POST', 'your_php_script.php', true);
					xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
					xhr.onload = function() {
						if (xhr.status >= 200 && xhr.status < 400) {
							console.log('Data sent successfully');
						} else {
							console.error('Error sending data');
						}
					};
					xhr.send(JSON.stringify(dataArray));
					console.log(dataArray);
				}
			});
		});
	}

	// number validation
	const phoneNumber = document.querySelectorAll('.js-number-inp');

	if(phoneNumber !== null) {
		phoneNumber.forEach((phoneIinput) => {
			phoneIinput.addEventListener('input', function() {
				phoneIinput.value = this.value.replace(/[^0-9]/g, ''); // Allow only numbers
			});
		})
	}

	document.addEventListener('click', (event) => {
		const priceCart = event.target.closest('.js-price-cart');

		if (!priceCart) return;

		const countProd = priceCart.querySelector('.js-count-prod');
		const plus = countProd.querySelector('.js-count-plus');
		const minus = countProd.querySelector('.js-count-minus');
		const input = countProd.querySelector('input');
		const priceCur = priceCart.querySelector('.js-price-cart-cur');
		const priceTotal = priceCart.querySelector('.js-price-cart-total');

		const getNumberFromText = (element) => {
			const cleanText = element.textContent.replace(/\s/g, '');
			const match = cleanText.match(/[\d,.]+/);
			return match ? parseFloat(match[0].replace(',', '.')) : 0;
		};

		const updatePrice = () => {
			const unitPrice = getNumberFromText(priceCur);
			const quantity = parseInt(input.value);
			const totalPrice = unitPrice * quantity;
			priceTotal.textContent = `${totalPrice.toLocaleString('ru-RU')} грн`;
		};

		if (plus.contains(event.target)) {
			let num = parseInt(input.value);
			input.value = num + 1;
			updatePrice();
		} else if (minus.contains(event.target)) {
			let num = parseInt(input.value);
			if (num > 1) {
				input.value = num - 1;
				updatePrice();
			}
		}
	});

	const baskDel = document.querySelectorAll('.js-basket-del');

	baskDel.forEach((elem) => {
		const parent = elem.closest('.js-basket-cart');
		const id = parent.getAttribute('data-id');
		const url = parent.getAttribute('data-url');
		const delBlock = parent.querySelector('.del-cart');
		const delYes = delBlock.querySelector('.js-del-yes');
		const delNo = delBlock.querySelector('.js-del-no');

		elem.addEventListener('click', () => {
			delBlock.classList.add('show');
		});

		delNo.addEventListener('click', () => {
			delBlock.classList.remove('show');
		});

		delYes.addEventListener('click', () => {
			parent.remove();
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ deleteCart: true, id: id })
			})
			.then(response => response.text())
			.then(data => {
				// Check if there are no more .js-basket-cart elements in the .basket-list
				const basketList = document.querySelector('.basket-list');
				if (!basketList.querySelector('.js-basket-cart')) {
					basketList.closest('.basket-popup').classList.add('basket-popup--empty');
				}
			})
			.catch(error => console.error('Ошибка загрузки данных:', error));
		});
	});

});
