(function($) {
	'use strict';

	module('PriceView', {
		setup: function() {
			this.view = new PriceView({ container: $('.item') });
		},

		teardown: function() {
			$('.item').find('.price').remove();
		}
	});

	test('init', function() {
		notStrictEqual(this.view.container, undefined, 'The container is found and set');
	});
})(jQuery);