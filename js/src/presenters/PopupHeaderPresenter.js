var Popup = (function(app) {
	var _titles = {
		MainView: 'Menu',
		AboutView: 'About'
	};

	app.HeaderPresenter = champ.presenter.extend('PopupHeaderPresenter', {
		views: ['PopupHeaderView'],

		events: {
			'view:show': 'onViewShow'
		},

		init: function(options) {
			champ.events.on('view:' + this.view.id + ':refreshBtn click', function(e) { this.onRefreshBtnClicked(e); }.bind(this));
		},

		onViewShow: function(args) {
			this.view.$.headerLabel.text(_titles[args.view]);
		},

		onRefreshBtnClicked: function(e) {
			e.preventDefault();
			this.view.$.refreshBtn.addClass('disabled spin');
		}
	});

	return app;
})(Popup || {});