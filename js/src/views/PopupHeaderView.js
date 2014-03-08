var Popup = (function(app) {
	app.HeaderView = champ.view.extend('PopupHeaderView', {
		container: '.js-header-view',

		$: {
			headerLabel: '.js-header-label',
			refreshBtn: '.js-refresh-btn : click'
		},

		init: function(options) {
			this.$.refreshBtn.tooltip();
		}
	});

	return app;
})(Popup || {});