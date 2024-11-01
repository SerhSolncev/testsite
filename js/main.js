import MicroModal from './modules/micromodal.js';
import { initSearch } from './search.js';
import cartSelectModule from './cartSelect.js';
import addFavoriteModule from './fav.js';
import categoriesMenuModule from './categMenu.js';

import './acc-categories.js';
import './common.js';
import './home-sliders.js';
import './seo-block.js';

document.addEventListener('DOMContentLoaded', () => {
	cartSelectModule.init();
	addFavoriteModule.init();
	categoriesMenuModule.init()
	initSearch();
	MicroModal.init();
});
