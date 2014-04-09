;(function($) {
	'use strict';

	module('PopupHeaderPresenter', {
		setup: function() {
			this.clock = sinon.useFakeTimers(Date.now());

			champ.ioc.reset();
			champ.ioc
				.register('PopupHeaderView', PopupHeaderView)
				.register('PopupHeaderModel', PopupHeaderModel)
				.register('SettingsRepository', {
					get: sinon.stub().yields(null, {
						titles: {
							MainView: 'Menu',
							AboutView: 'About'
						},
						lastUpdate: Date.now(),
						updateInterval: 5
					}),

					update: sinon.spy()
				})
				.register('CommandBus', {
					handle: sinon.spy()
				})
				.register('UpdatePricesCommand', UpdatePricesCommand);

			this.setRefreshBtnStateSpy = sinon.spy(PopupHeaderPresenter.prototype, 'setRefreshBtnState');

			this.tooltipLables = {
				def: 'Manually refresh prices',
				loading: 'Refreshing prices...',
				wait: function(amt) { return 'Please wait ' + amt + ' minutes to refresh again'; }
			};

			this.presenter = new PopupHeaderPresenter();
		},

		teardown: function() {
			this.clock.restore();
			this.setRefreshBtnStateSpy.restore();
			this.presenter.view.$.refreshBtn.addClass('disabled');
		}
	});

	test('init()', function() {
		var onRefreshBtnClickedSpy = sinon.spy(this.presenter, 'onRefreshBtnClicked'),
			onModelChangedSpy = sinon.spy(this.presenter, 'onModelChanged');

		ok(this.presenter.view.$.refreshBtn.hasClass('disabled'), 'The refresh button is disabled when first loaded');

		this.presenter.view.$.refreshBtn.trigger('click');
		champ.events.trigger('model:' + this.presenter.model.id + ':changed');

		ok(onRefreshBtnClickedSpy.calledOnce, 'The presenter bound the refreshBtn to a handler');
		ok(onModelChangedSpy.calledOnce, 'The presenter bound the model changed event to a handler');

		onRefreshBtnClickedSpy.restore();
		onModelChangedSpy.restore();
	});

	test('setRefreshBtnState(isLoading)', function() {
		this.presenter.setRefreshBtnState('loading');

		ok(this.presenter.view.$.refreshBtn.hasClass('disabled'), 'It disables the refresh button');
		ok(this.presenter.view.$.refreshBtn.children('.fa-repeat').hasClass('fa-spin'), 'It animates the refreshBtn icon');

		this.presenter.setRefreshBtnState('disable');

		ok(this.presenter.view.$.refreshBtn.hasClass('disabled'), 'It enables the refresh button');
		ok(!this.presenter.view.$.refreshBtn.children('.fa-repeat').hasClass('fa-spin'), 'It stops animating the refreshBtn icon');

		this.presenter.setRefreshBtnState('enable');

		ok(!this.presenter.view.$.refreshBtn.hasClass('disabled'), 'It enables the refresh button');
		ok(!this.presenter.view.$.refreshBtn.children('.fa-repeat').hasClass('fa-spin'), 'It stops animating the refreshBtn icon');
	});

	test('refreshTimeRemaining()', function() {
		equal(this.presenter.refreshTimeRemaining(), 5, 'It returns the time left before a refresh can occur');

		this.clock.tick(60 * 1000);

		equal(this.presenter.refreshTimeRemaining(), 4, 'It returns the time left before a refresh can occur');

		this.clock.tick(4 * 60 * 1000);

		equal(this.presenter.refreshTimeRemaining(), 0, 'It returns the time left before a refresh can occur');
	});

	test('onModelChanged(args)', function() {
		var tooltipOptions = this.presenter.view.$.refreshBtnTooltip.data('bs.tooltip').options;

		this.presenter.onModelChanged();

		equal(
			tooltipOptions.title(),
			this.tooltipLables.wait(5),
			'It sets the tooltips title'
		);

		ok(this.presenter.view.$.refreshBtn.hasClass('disabled'), 'It disabled the refresh button');

		this.clock.tick(5 * 60 * 1000);

		ok(!this.presenter.view.$.refreshBtn.hasClass('disabled'), 'It enables the refresh button after the interval');
	});

	test('onRefreshBtnMouseOver(e)', function() {
		var tooltipOptions = this.presenter.view.$.refreshBtnTooltip.data('bs.tooltip').options;

		this.presenter.view.$.refreshBtn.trigger('mouseover');

		equal(
			tooltipOptions.title(),
			this.tooltipLables.wait(5),
			'It shows a tooltip asking to wait to refresh again'
		);

		this.clock.tick(1 * 60 * 1000);
		this.presenter.view.$.refreshBtn.trigger('mouseover');

		equal(
			tooltipOptions.title(),
			this.tooltipLables.wait(4),
			'It shows a tooltip asking to wait to refresh again'
		);

		this.clock.tick(4 * 60 * 1000);
		this.presenter.view.$.refreshBtn.trigger('mouseover');

		equal(
			tooltipOptions.title(),
			this.tooltipLables.def,
			'It shows a tooltip asking to wait to refresh again'
		);

		this.presenter.view.$.refreshBtn.tooltip('hide');
	});

	test('onRefreshBtnClicked(e)', function() {
		var btn = this.presenter.view.$.refreshBtn,
			onRefreshBtnClickedSpy = sinon.spy(this.presenter, 'onRefreshBtnClicked');

		btn.trigger('click');
		ok(onRefreshBtnClickedSpy.calledOnce, 'It called the onRefreshBtnClicked method');
		ok(this.setRefreshBtnStateSpy.calledWith('loading'), 'It disables the refresh button');
		ok(this.presenter.commandBus.handle.calledWith(this.presenter.updatePricesCommand), 'It sends an UpdatePricesCommand');
	});

	test('onViewShow(args)', function() {
		this.presenter.onViewShow({ view: 'AboutView' });
		equal(this.presenter.view.$.headerLabel.text(), 'About', 'It sets the header labels text');

		this.presenter.onViewShow({ view: 'MainView' });
		equal(this.presenter.view.$.headerLabel.text(), 'Menu', 'It sets the header labels text');
	});

	test('onPriceUpdateSuccess', function() {
		var tooltipOptions = this.presenter.view.$.refreshBtnTooltip.data('bs.tooltip').options;
		this.presenter.onPriceUpdateSuccess({ lastUpdate: Date.now() });

		ok(this.setRefreshBtnStateSpy.calledWith('disable'), 'It disables the refresh button');

		this.presenter.view.$.refreshBtn.trigger('mouseover');

		equal(
			tooltipOptions.title(),
			this.tooltipLables.wait(5),
			'It shows a tooltip asking to wait to refresh again'
		);

		this.presenter.view.$.refreshBtn.tooltip('hide');
	});

	test('onPriceUpdateFail', function() {
		this.presenter.onPriceUpdateFail();
		ok(this.setRefreshBtnStateSpy.calledWith('enable'), 'It enables the refresh button');
	});

	test('onPriceUpdateNoContent', function() {
		this.presenter.onPriceUpdateNoContent();
		ok(this.setRefreshBtnStateSpy.calledWith('disable'), 'It disables the refresh button');
	});
})(jQuery);