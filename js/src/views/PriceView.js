var PriceView = champ.view.extend('PriceView', {
	init: function(options) {
		this.container.prepend('<div class="price"><p></p></div>');
		this.add('label', '.price p');
	}
});