;(function($) {
	'use strict';

	module('PopupFooterPresenter', {
		setup: function() {
			champ.ioc.reset();
			champ.ioc
				.register('PopupFooterView', PopupFooterView)
				.register('ManifestProvider', {
					get: sinon.stub().withArgs('version').returns('1.0.0')
				});

			this.eventSpy = sinon.spy(champ.events, 'trigger');
			this.presenter = new PopupFooterPresenter();
		},

		teardown: function() {
			this.eventSpy.restore();
		}
	});

	test('init()', function() {
		var onAboutBtnClickedSpy = sinon.spy(this.presenter, 'onAboutBtnClicked'),
			onBackBtnClickedSpy = sinon.spy(this.presenter, 'onBackBtnClicked');

		this.presenter.view.$.aboutBtn.trigger('click');
		this.presenter.view.$.backBtn.trigger('click');

		ok(onAboutBtnClickedSpy.calledOnce, 'The presenter bound click events to handlers');
		ok(onBackBtnClickedSpy.calledOnce, 'The presenter bound click events to handlers');
		ok(this.presenter.manifestProvider.get.calledOnce, 'The presenter set the vesion');

		onAboutBtnClickedSpy.restore();
		onBackBtnClickedSpy.restore();
	});

	test('setVersionText(version)', function() {
		this.presenter.setVersionText('1.1.1');
		ok(this.presenter.view.$.versionText.text('1.1.1'), 'It sets the views version number');
	});

	test('onAboutBtnClicked(e)', function() {
		this.presenter.view.$.aboutBtn.trigger('click');

		ok(this.eventSpy.calledWith('view:show', { view: 'AboutView' }), 'It triggers an event to show the AboutView');
		ok(this.presenter.view.$.aboutBtn.hasClass('hidden'), 'It hides the about button');
		ok(!this.presenter.view.$.backBtn.hasClass('hidden'), 'It shows the back button');
	});

	test('onBackBtnClicked(e)', function() {
		this.presenter.view.$.backBtn.trigger('click');

		ok(this.eventSpy.calledWith('view:show', { view: 'MainView' }), 'It triggers an event to show the AboutView');
		ok(this.presenter.view.$.backBtn.hasClass('hidden'), 'It hides the back button');
		ok(!this.presenter.view.$.aboutBtn.hasClass('hidden'), 'It shows the about button');
	});
})(jQuery);