var PopupModel = champ.model.extend('PopupModel', {
  properties: {
    showPrices: true,
    enableNeto: true,
    autoRefresh: true,
    includePaint: true,
    useBudsAsCurrency: false,
    lastUpdate: 0,
    updateInterval: 5
  }
});
