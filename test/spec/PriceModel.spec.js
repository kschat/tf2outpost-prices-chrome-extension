(function($) {
	'use strict';

	module('PriceModel', {
		setup: function() {
			this.model = new PriceModel();
		}
	});

	test('init()', function() {
		propEqual(this.model.properties, {
			label: 'loading...', 
			hash: '', 
			price: '0'
		}, 
		'The model starts with the correct default values');
	});
})(jQuery);