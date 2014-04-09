var PopupModel = champ.model.extend('PopupModel', {
	properties: {
		showPrices: true,
		enableNeto: true,
		autoRefresh: true,
		includePaint: true,
		lastUpdate: 0,
		updateInterval: 5
	}
});