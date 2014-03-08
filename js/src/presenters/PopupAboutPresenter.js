var Popup = (function(app) {
	app.AboutPresenter = champ.presenter.extend('PopupAboutPresenter', {
		inject: ['ManifestProvider'],

		views: ['PopupAboutView'],

		events: {
			'view:show': 'onViewShow'
		},

		init: function(options) {
			this.manifestProvider = options.ManifestProvider;
			this.setAboutText(this.manifestProvider.get('description'));
		},

		setAboutText: function(description) {
			this.view.$.aboutText.text(description);
		},

		onViewShow: function(args) {
			if(args.view !== 'AboutView') { return this.view.container.removeClass('show'); }
			this.view.container.addClass('show');
		}
	});

	return app;
})(Popup || {});