chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason === 'install') {
		chrome.storage.sync.set({
			settings: {
				showPrices: false,
				enableNeto: false,
				autoRefresh: true,
				includePaint: true
			}
		});
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, response) {
	switch(request.action) {
		case 'pageAction':
			chrome.pageAction.show(sender.tab.id);
			break;
		case 'settings':
			var settings = JSON.parse(localStorage['settings'] || '{}');
			response(request.settings.trim() === '*' ? settings : settings[request.settings]);
			break;
	}
});