;(function($) {
	'use strict';

	module('PopupHeaderView', {
		setup: function() {
			this.view = new PopupHeaderView();
		},

		teardown: function() { }
	});

	test('init()', function() {
		ok(this.view.$.headerLabel, 'Has a header label element');
	});
})(jQuery);