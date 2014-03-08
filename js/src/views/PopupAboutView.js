var Popup = (function(app) {
	app.AboutView = champ.view.extend('PopupAboutView', {
		container: '.js-about-content',

		$: {
			aboutText: '.js-about-text'
		},

		init: function(options) { }
	});

	return app;
})(Popup || {});