var Popup = (function(app) {
	app.PopupPresenter = champ.presenter.extend('PopupPresenter', {
		inject: ['SettingsRepository'],

		views: ['PopupView'],

		models: ['PopupModel'],

		events: {
			'view:show': 'onViewShow'
		},

		init: function(options) {
			this.settingsRepository = options.SettingsRepository;

			champ.events
				.on('model:' + this.model.id + ':changed', function(args) { this.updateUi(args); }.bind(this))
				.on('view:' + this.view.id + ':showPricesBtn click', function(e) { this.onBtnClick(e); }.bind(this))
				.on('view:' + this.view.id + ':enableNetoBtn click', function(e) { this.onBtnClick(e); }.bind(this))
				.on('view:' + this.view.id + ':autoRefreshBtn click', function(e) { this.onBtnClick(e); }.bind(this))
				.on('view:' + this.view.id + ':includePaintBtn click', function(e) { this.onBtnClick(e); }.bind(this));

			this.settingsRepository.get('*', this.model.property.bind(this.model));
		},

		updateUi: function(args) {
			this.view.$.showPricesBtn.children('span').toggleClass('badge-primary', this.model.property('showPrices'));
			this.view.$.enableNetoBtn.children('span').toggleClass('badge-primary', this.model.property('enableNeto'));
			this.view.$.autoRefreshBtn.children('span').toggleClass('badge-primary', this.model.property('autoRefresh'));
			this.view.$.includePaintBtn.children('span').toggleClass('badge-primary', this.model.property('includePaint'));
		},

		//this whole method is gross
		onBtnClick: function(e) {
			e.preventDefault();
			var $span = e.target.tagName === 'A'
				? $(e.target).children('span')
				: $(e.target);

			this.model.property(this.view.container.find($span.parent('a')).data('model-name'), !$span.hasClass('badge-primary'));
			this.settingsRepository.set(this.model.properties);
		},

		onViewShow: function(args) {
			if(args.view !== 'MainView') { return this.view.container.removeClass('show'); }
			this.view.container.addClass('show');
		}
	});

	return app;
})(Popup || {});