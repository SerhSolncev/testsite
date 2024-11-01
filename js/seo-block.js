document.addEventListener('DOMContentLoaded', function () {
	const seoBlock = document.querySelector('.js-seo-block');
	const textContent = seoBlock.querySelector('.seo-block__content');
	const maxLength = parseInt(seoBlock.getAttribute('data-length'), 10);
	const textBtn = seoBlock.getAttribute('data-text');

	if (textContent.textContent.length > maxLength) {
		const fullText = textContent.innerHTML;
		const truncatedText = fullText.slice(0, maxLength) + '... ';

		textContent.innerHTML = truncatedText + '<button class="js-read-all">'+textBtn+'</button>';

		const readMoreBtn = textContent.querySelector('.js-read-all');
		readMoreBtn.addEventListener('click', function () {
			textContent.innerHTML = fullText;
		});
	}
});
