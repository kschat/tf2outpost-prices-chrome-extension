var Bootstrapper = {
	bootstrap: function() {
		champ.ioc
			.register('SettingsRepository', SettingsRepository)
			.register('ManifestProvider', ManifestProvider)
			//.register('PriceProvider', PriceProvider)

			.register('CommandBus', CommandBus)
      .register('UpdatePricesCommandHandler', UpdatePricesCommandHandler)
			.register('NotifyCSCommandHandler', NotifyCSCommandHandler)
      .register('NotifyBackgroundCommandHandler', NotifyBackgroundCommandHandler)

      .register('UpdatePricesCommand', UpdatePricesCommand)
			.register('NotifyCSCommand', NotifyCSCommand)
      .register('NotifyBackgroundCommand', NotifyBackgroundCommand);
	}
};