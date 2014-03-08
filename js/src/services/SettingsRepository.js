champ.ioc.register('SettingsRepository', {
	get: function(setting, callback) {
		chrome.storage.sync.get('settings', function(storage) {
			var settings = storage.settings;
			callback(setting.trim() === '*' ? settings : settings[setting]);
		});
	},

	set: function(setting, callback) {
		chrome.storage.sync.set({ settings: setting }, function() {
			champ.events.trigger('settings:updated', setting);
			if(callback) { callback(); }
		});
	}
});