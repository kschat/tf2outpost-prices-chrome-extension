;(function($) {
	'use strict';

	module('PopupHeaderView', {
		setup: function() {
			this.view = new Popup.HeaderView();
		},

		teardown: function() { }
	});

	test('init()', function() {
		ok(this.view.$.headerLabel, 'Has a header label element');

		this.view.$.refreshBtn.tooltip('show');
		equal(this.view.$.refreshBtn.next().children('.tooltip-inner').text(), this.view.$.refreshBtn.data('original-title'), 'A tooltip displays on hover');
		this.view.$.refreshBtn.tooltip('hide');
	});
})(jQuery);