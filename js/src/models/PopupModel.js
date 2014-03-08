var Popup = (function(app) {
	app.PopupModel = champ.model.extend('PopupModel', {
		properties: {
			showPrices: true,
			enableNeto: true,
			autoRefresh: true,
			includePaint: true
		}
	});

	return app;
})(Popup || {});