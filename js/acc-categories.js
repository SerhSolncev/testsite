const buttonsCat = document.querySelectorAll(".js-more-categories");

buttonsCat.forEach(button => {
	const categoryId = button.dataset.categoryId;
	const categoryList = document.querySelector(`.mid-categories__list[data-category-id="${categoryId}"]`);
	const buttonText = button.querySelector("[data-change-text]");

	button.addEventListener("click", function () {
		categoryList.classList.toggle("open");

		if (categoryList.classList.contains("open")) {
			buttonText.textContent = button.dataset.closeText;

			const categoryListTop = categoryList.getBoundingClientRect().top + window.pageYOffset;
			const categoryListHeight = categoryList.offsetHeight;
			const middlePosition = categoryListTop + categoryListHeight - (window.innerHeight / 2);

			if (window.innerWidth < 745) {
				window.scrollTo({
					top: middlePosition,
					behavior: "smooth"
				});
			}

		} else {
			buttonText.textContent = button.dataset.openText;

			const categoryListPosition = categoryList.getBoundingClientRect().top + window.pageYOffset;
			if (window.innerWidth < 745) {
				window.scrollTo({
					top: categoryListPosition - 80,
					behavior: "smooth"
				});
			}

		}
	});
});

const triggerBtnCat = document.querySelectorAll(".js-more-categories-trigger");

triggerBtnCat.forEach((trg) => {
	const categoryId = trg.dataset.categoryId;
	const categoryList = document.querySelector(`.mid-categories__list[data-category-id="${categoryId}"]`);

	if (categoryList.classList.contains("open")) {
		const categoryListTop = categoryList.getBoundingClientRect().top + window.pageYOffset;
		const categoryListHeight = categoryList.offsetHeight;
		const middlePosition = categoryListTop + categoryListHeight - (window.innerHeight / 2);
		if (window.innerWidth < 745) {
			window.scrollTo({
				top: middlePosition,
				behavior: "smooth"
			});
		}

	} else {

	}

	trg.addEventListener('click', () => {
		document.querySelector(`.js-more-categories[data-category-id="${categoryId}"]`).click()
	});
});
