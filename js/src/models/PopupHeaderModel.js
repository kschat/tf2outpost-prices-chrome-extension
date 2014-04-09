var PopupHeaderModel = champ.model.extend('PopupHeaderModel', {
	properties: {
		titles: {
			MainView: 'Menu',
			AboutView: 'About'
		},
		lastUpdate: 0,
		updateInterval: 5,
		refreshBtnTooltip: 'Manually refresh prices',
		refreshing: false
	}
});