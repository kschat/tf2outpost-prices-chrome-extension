;(function($) {
	'use strict';

	module('PopupFooterView', {
		setup: function() {
			this.view = new PopupFooterView();
		},

		teardown: function() { }
	});

	test('init()', function() {
		this.view.$.homeBtn.tooltip('show');
		equal($('body > .tooltip .tooltip-inner').last().text(), this.view.$.homeBtn.data('original-title'), 'A tooltip displays on hover');
		this.view.$.homeBtn.tooltip('hide');

		this.view.$.aboutBtn.tooltip('show');
		equal($('body > .tooltip .tooltip-inner').last().text(), this.view.$.aboutBtn.data('original-title'), 'A tooltip displays on hover');
		this.view.$.aboutBtn.tooltip('hide');

		this.view.$.reportBugBtn.tooltip('show');
		equal($('body > .tooltip .tooltip-inner').last().text(), this.view.$.reportBugBtn.data('original-title'), 'A tooltip displays on hover');
		this.view.$.reportBugBtn.tooltip('hide');

		this.view.$.advSettingsBtn.tooltip('show');
		equal($('body > .tooltip .tooltip-inner').last().text(), this.view.$.advSettingsBtn.data('original-title'), 'A tooltip displays on hover');
		this.view.$.advSettingsBtn.tooltip('hide');

		this.view.$.backBtn.tooltip('show');
		equal($('body > .tooltip .tooltip-inner').last().text(), this.view.$.backBtn.data('original-title'), 'A tooltip displays on hover');
		this.view.$.backBtn.tooltip('hide');
	});
})(jQuery);