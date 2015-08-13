var PricePresenter = champ.presenter.extend('PricePresenter', {
  models: ['PriceModel'],

  events: {
    'background:setting:showPrices': 'onShowPricesChange'
  },

  init: function(options) {
    this.views = [new PriceView({ container: options.container })];
    this.view = this.views[0];

    champ.events
      .on('app:init', this.onAppInit.bind(this))
      .on('priceProvider:update', this.onPriceUpdate.bind(this))
      .on('model:' + this.model.id + ':changed', this.onModelChanged.bind(this));

    var pIndex = this.extractUnusualQuality(this.view.container.css('background-image'))
      || this.extractCrateSeries(this.view.container.find('.series_no'));

    this.model.property(
      'hash',
      this.constructHash(
        this.view.container.data('hash'),
        this.isTradable(this.view.container),
        this.isCraftable(this.view.container),
        pIndex
      )
    );

    if(!this.isPaintCan(this.view.container.find('a > span > img'))) {
      this.model.property(
        'paint',
        this.extractPaintColor(this.view.container.find('.paint'))
      );
    }

    this.label(this.model.property('label'));
  },

  constructHash: function(oHash, isTradable, isCraftable, pIndex) {
    oHash = oHash.split(',');
    oHash.splice(3, 0, isTradable, isCraftable, pIndex);

    return oHash.join(',');
  },

  label: function(val) {
    if(!val) { return this.view.$.label.html(); }
    this.view.$.label.html(val);
  },

  isCraftable: function(node) {
    return node.hasClass('uncraftable')
      ? 0
      : 1;
  },

  isTradable: function(node) {
    return node.hasClass('untradable')
      ? 0
      : 1;
  },

  isPaintCan: function($imgNode) {
    return !!$imgNode.attr('src').match(/\/paintcan/);
  },

  extractPaintColor: function($paintNode) {
    return ($paintNode.attr('style') || '#')
      .split('#')[1]
      .slice(0, -1)
      .toUpperCase();
  },

  onShowPricesChange: function(isVisible) {
    this.view.container.children('.price')[isVisible ? 'show' : 'hide']();
  },

  extractUnusualQuality: function(imgUrl) {
    imgUrl = imgUrl || '';
    var quality = imgUrl.match(/([\d]+)\.png/i);
    return quality ? quality[1] : 0;
  },

  extractCrateSeries: function(node) {
    return (node && node.text() || '').substr(1) || 0;
  },

  onAppInit: function(args) {
    if(args.initialSetup) { return; }
    this.onShowPricesChange(args.showPrices);
    this.onPriceUpdate({ status: 'success' });
  },

  onModelChanged: function(args) {
    if(args.property !== 'price') { return; }
    this.model.property('label', priceProvider.convertCurrency(args.value));
    this.label(this.model.property('label'));
  },

  onPriceUpdate: function(args) {
    if(args.status !== 'success') { return; }
    this.label('loading...');

    var price = priceProvider.convertCurrency(priceProvider.get(
      this.model.properties.hash,
      this.model.properties.paint
    ));

    this.model.property('price', price);
  }
});
