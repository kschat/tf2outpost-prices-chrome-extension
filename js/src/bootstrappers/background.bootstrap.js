var Bootstrapper = {
  bootstrap: function() {
    champ.ioc
      .register('SettingsRepository', SettingsRepository)

      .register('CommandBus', CommandBus)
      .register('UpdatePricesCommandHandler', UpdatePricesCommandHandler)
      .register('NotifyCSCommandHandler', NotifyCSCommandHandler)
      .register('NotifyBackgroundCommandHandler', NotifyBackgroundCommandHandler)

      .register('UpdatePricesCommand', UpdatePricesCommand)
      .register('NotifyCSCommand', NotifyCSCommand)
      .register('NotifyBackgroundCommand', NotifyBackgroundCommand);
  }
};