(function($) {
	'use strict';

	module('PopupView', {
		setup: function() {
			this.view = new Popup.PopupView();
			this.eventSpy = sinon.spy(champ.events, 'trigger');
		},

		teardown: function() {
			for(var e in this.view.$) { this.view.$[e].off(); }
			this.eventSpy.restore();
		}
	});

	test('init()', function() {
		equal(this.view.container.length, 1, 'It sets the container on init');
		equal(this.view.$.showPricesBtn.length, 1, 'It set showPriceBtn on init');
		equal(this.view.$.enableNetoBtn.length, 1, 'It set enableScrollLoadBtn on init');
		equal(this.view.$.autoRefreshBtn.length, 1, 'It set autoRefreshBtn on init');
		equal(this.view.$.includePaintBtn.length, 1, 'It set includePaintBtn on init');
	});

	test('events', function() {
		for(var e in this.view.$) {
			this.view.$[e].trigger('click');
			ok(this.eventSpy.calledWith('view:' + this.view.id + ':' + e + ' click'), 'It registered a click event for ' + e);
		}
	});
})(jQuery);