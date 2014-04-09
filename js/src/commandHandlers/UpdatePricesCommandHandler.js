var UpdatePricesCommandHandler = function(SettingsRepository) {
	this.settingsRepository = SettingsRepository;
};

UpdatePricesCommandHandler.prototype = {
	handle: function(command) {
		champ.events.trigger(command.startEvent);

		this.settingsRepository.get('*', function(err, settings) {
			if(err) { champ.events.trigger(command.errorEvent); }

			if(settings.lastUpdate && this.getElapsedTime(settings.lastUpdate) < settings.updateInterval) {
				return champ.events.trigger(command.noContentEvent);
			}

			$.ajax({
				url: settings.apiUrl,
				type: command.method
			})

			.done(function(data) {
				data.lastUpdate = Date.now();
				
				this.settingsRepository.update('lastUpdate', data.lastUpdate, function() {
					champ.events.trigger(command.successEvent, data);
				});
			}.bind(this))

			.fail(function(xhr, status, err) {
				champ.events.trigger(command.errorEvent, err);
			});
		}.bind(this));
	},

	getElapsedTime: function(startTime) {
		return Math.floor((Date.now() - startTime) / 60 / 1000);
	}
};