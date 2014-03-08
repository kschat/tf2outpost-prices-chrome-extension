(function($) {
	'use strict';

	var testUiChange = function(prop) {
		return this.presenter.view.$[prop + 'Btn'].children('.badge').hasClass('badge-primary');
	};

	module('PopupPresenter', {
		setup: function() {
			champ.ioc.register('SettingsRepository', {
				get: sinon.stub().returns({
					showPrices: true,
					enableNeto: true,
					autoRefresh: true,
					includePaint: true
				}),

				set: sinon.spy()
			});

			this.eventSpy = sinon.spy(champ.events, 'trigger');
			this.presenter = new Popup.PopupPresenter();
			this.testUiChange = testUiChange.bind(this);
		},

		teardown: function() {
			this.eventSpy.restore();
			champ.events.off();
			champ.ioc.unregister('SettingsRepository');

			$('.js-main-content a')
				.off()
				.children('.badge')
				.removeClass('.badge-primary');
		}
	});

	test('init()', function() {
		var updateUiSpy = sinon.spy(this.presenter, 'updateUi'),
			onBtnClickSpy = sinon.spy(this.presenter, 'onBtnClick');

		this.presenter.model.property('showPrices', false);
		this.presenter.view.$.showPricesBtn.trigger('click');
		this.presenter.view.$.enableNetoBtn.trigger('click');
		this.presenter.view.$.autoRefreshBtn.trigger('click');
		this.presenter.view.$.includePaintBtn.trigger('click');

		ok(updateUiSpy.calledWith({ property: 'showPrices', value: false }), 'The presenter bound to the model changed event');
		equal(onBtnClickSpy.callCount, 4, 'The presenter bound to the all the button click events');

		updateUiSpy.restore();
		onBtnClickSpy.restore();
	});

	test('updateUi(args)', function() {
		this.presenter.model.property('showPrices', false, true);
		this.presenter.model.property('enableNeto', false, true);
		this.presenter.model.property('autoRefresh', false, true);
		this.presenter.model.property('includePaint', false, true);

		this.presenter.updateUi();

		ok(!this.testUiChange('showPrices'), 'It updates the view based on the models values');
		ok(!this.testUiChange('enableNeto'), 'It updates the view based on the models values');
		ok(!this.testUiChange('autoRefresh'), 'It updates the view based on the models values');
		ok(!this.testUiChange('includePaint'), 'It updates the view based on the models values');

		this.presenter.model.property('showPrices', true, true);
		this.presenter.model.property('enableNeto', true, true);
		this.presenter.model.property('autoRefresh', true, true);
		this.presenter.model.property('includePaint', true, true);
		this.presenter.updateUi();

		ok(this.testUiChange('showPrices'), 'It updates the view based on the models values');
		ok(this.testUiChange('enableNeto'), 'It updates the view based on the models values');
		ok(this.testUiChange('autoRefresh'), 'It updates the view based on the models values');
		ok(this.testUiChange('includePaint'), 'It updates the view based on the models values');
	});

	test('onBtnClick(e)', function() {
		this.presenter.view.$.showPricesBtn.trigger('click');
		ok(
			this.presenter.settingsRepository.set.calledWith({
				showPrices: false,
				enableNeto: true,
				autoRefresh: true,
				includePaint: true
			}), 
			'The settingsRepository set method was called'
		);
	});

	test('onViewShow(args)', function() {
		champ.events.trigger('view:show', { view: 'MainView' });
		ok(this.presenter.view.container.is(':visible'), 'The container is visible');

		champ.events.trigger('view:show', { view: 'OtherView' });
		ok(this.presenter.view.container.is(':visible'), 'The container is not visible');
	});
})(jQuery);