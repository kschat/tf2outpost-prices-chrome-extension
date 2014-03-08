var Popup = (function(app) {
	app.PopupView = champ.view.extend('PopupView', {
		container: '.js-main-content',

		$: {
			showPricesBtn: '.js-show-price-btn : click',
			enableNetoBtn: '.js-enable-neto-btn : click',
			autoRefreshBtn: '.js-auto-refresh-btn : click',
			includePaintBtn: '.js-include-paint-btn : click'
		},

		init: function() {
			this.$.showPricesBtn.data('model-name', 'showPrices');
			this.$.enableNetoBtn.data('model-name', 'enableNeto');
			this.$.autoRefreshBtn.data('model-name', 'autoRefresh');
			this.$.includePaintBtn.data('model-name', 'includePaint');
		}
	});

	return app;
})(Popup || {});