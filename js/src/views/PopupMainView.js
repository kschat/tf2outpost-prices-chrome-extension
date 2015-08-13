var PopupMainView = champ.view.extend('PopupMainView', {
  container: '.js-main-content',

  $: {
    showPricesBtn: '.js-show-price-btn : click',
    enableNetoBtn: '.js-enable-neto-btn : click',
    autoRefreshBtn: '.js-auto-refresh-btn : click',
    includePaintBtn: '.js-include-paint-btn : click',
    useBudsAsCurrencyBtn: '.js-use-buds-as-currency-btn : click'
  },

  init: function() {
    this.$.showPricesBtn.data('model-name', 'showPrices');
    this.$.enableNetoBtn.data('model-name', 'enableNeto');
    this.$.autoRefreshBtn.data('model-name', 'autoRefresh');
    this.$.includePaintBtn.data('model-name', 'includePaint');
    this.$.useBudsAsCurrencyBtn.data('model-name', 'useBudsAsCurrency');
  }
});
