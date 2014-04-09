var PopupHeaderPresenter = champ.presenter.extend('PopupHeaderPresenter', {

	inject: [
    'SettingsRepository',
    'CommandBus',
    'UpdatePricesCommand',
    'NotifyCSCommand'
  ],

	views: ['PopupHeaderView'],

	models: ['PopupHeaderModel'],

	events: {
		'view:show'					: 'onViewShow',
		'prices:update:success'		: 'onPriceUpdateSuccess',
		'prices:update:fail'		: 'onPriceUpdateFail',
		'prices:update:noContent'	: 'onPriceUpdateNoContent'
	},

	init: function(options) {
		this.settingsRepository = options.SettingsRepository;
		this.commandBus = options.CommandBus;
		this.updatePricesCommand = options.UpdatePricesCommand;
    this.notifyCSCommand = options.NotifyCSCommand;

		champ.events.on(
			'view:' + this.view.id + ':refreshBtn click', 
			function(e) { this.onRefreshBtnClicked(e); }.bind(this)
		)
		.on(
			'view:' + this.view.id + ':refreshBtnTooltip mouseover', 
			function(e) { this.onRefreshBtnMouseOver(e); }.bind(this)
		)
		.on(
			'model:' + this.model.id + ':changed',
			function(args) { this.onModelChanged(args); }.bind(this)
		);

		this.settingsRepository.get('*', function(err, settings) {
			if(err) { champ.events.trigger('error', err); }

			this.model.property({
				lastUpdate: settings.lastUpdate,
				updateInterval: settings.updateInterval
			});
		}.bind(this));

		this.view.$.refreshBtnTooltip.tooltip({
			title: this.model.property.bind(this.model, 'refreshBtnTooltip')
		});
	},

	setRefreshBtnState: function(state) {
		var spin = (state === 'loading' ? 'add' : 'remove') + 'Class',
			disable = (state !== 'enable' ? 'add' : 'remove') + 'Class';

		this.view.$.refreshBtn
			[disable]('disabled')
			.children('.fa-repeat')
			[spin]('fa-spin');
	},

	refreshTimeRemaining: function() {
		return this.model.property('updateInterval') - this.getElapsedTime(this.model.property('lastUpdate'));
	},

	getElapsedTime: function(startTime) {
		return Math.floor((Date.now() - startTime) / 60 / 1000);
	},

	onModelChanged: function(args) {
		var timeRemaining = this.refreshTimeRemaining();

		if(timeRemaining < 1) { return this.setRefreshBtnState('enable'); }

		this.view.$.refreshBtn.addClass('disabled');

		this.model.property(
			'refreshBtnTooltip', 
			'Please wait ' + timeRemaining + ' minutes to refresh again', 
			true
		);

		setTimeout(
			this.view.$.refreshBtn.removeClass.bind(this.view.$.refreshBtn, 'disabled'), 
			timeRemaining * 60 * 1000
		);
	},

	onRefreshBtnClicked: function(e) {
		e.preventDefault();

		this.setRefreshBtnState('loading');
		this.commandBus.handle(this.updatePricesCommand);
	},

	onRefreshBtnMouseOver: function(e) {
		if(this.model.refreshing) { return this.model.property('refreshBtnTooltip', 'Refreshing prices...', true); }

		var timeRemaining = this.refreshTimeRemaining(),
			minuteText = timeRemaining === 1 
				? 'minute'
				: 'minutes',
			title = timeRemaining > 0
  			? 'Please wait ' + timeRemaining + ' ' + minuteText + ' to refresh again'
  			: 'Manually refresh prices';

		this.model.property(
			'refreshBtnTooltip',
			title,
			true
		);
	},

	onViewShow: function(args) {
		this.view.$.headerLabel.text(this.model.property('titles')[args.view]);
	},

	onPriceUpdateSuccess: function(data) {
    var notifyPriceCommand = Object.create(this.notifyCSCommand);
    notifyPriceCommand.action = 'price:update';
    notifyPriceCommand.message = data.items;

		this.setRefreshBtnState('disable');
		this.model.property('lastUpdate', data.lastUpdate);
    this.commandBus.handle(notifyPriceCommand);
	},

	onPriceUpdateFail: function(err) {
		this.setRefreshBtnState('enable');
	},

	onPriceUpdateNoContent: function() {
		this.setRefreshBtnState('disable');
	}
});