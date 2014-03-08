;(function($) {
	'use strict';

	module('PopupHeaderPresenter', {
		setup: function() {
			this.presenter = new Popup.HeaderPresenter();
		},

		teardown: function() { }
	});

	test('init()', function() {
		var onRefreshBtnClickedSpy = sinon.spy(this.presenter, 'onRefreshBtnClicked');

		this.presenter.view.$.refreshBtn.trigger('click');

		ok(onRefreshBtnClickedSpy.calledOnce, 'The presenter bound the refreshBtn to a handler');

		onRefreshBtnClickedSpy.restore();
	});

	test('onViewShow(args)', function() {
		this.presenter.onViewShow({ view: 'AboutView' });
		equal(this.presenter.view.$.headerLabel.text(), 'About', 'It sets the header labels text');

		this.presenter.onViewShow({ view: 'MainView' });
		equal(this.presenter.view.$.headerLabel.text(), 'Menu', 'It sets the header labels text');
	});

	test('onRefreshBtnClicked(args)', function() {
		var btn = this.presenter.view.$.refreshBtn;

		btn.trigger('click');
		ok(btn.hasClass('disabled'));
		ok(btn.hasClass('spin'));
	});	
})(jQuery);