var PopupMainPresenter = champ.presenter.extend('PopupMainPresenter', {
  inject: [
    'SettingsRepository',
    'CommandBus',
    'NotifyCSCommand'
  ],

  views: ['PopupMainView'],

  models: ['PopupModel'],

  events: {
    'view:show': 'onViewShow'
  },

  init: function(options) {
    this.settingsRepository = options.SettingsRepository;
    this.commandBus = options.CommandBus;
    this.notifyCSCommand = options.NotifyCSCommand;

    champ.events
      .on('model:' + this.model.id + ':changed', function(args) { this.updateUi(args); }.bind(this))
      .on('view:' + this.view.id + ':showPricesBtn click', function(e) { this.onBtnClick(e); }.bind(this))
      .on('view:' + this.view.id + ':enableNetoBtn click', function(e) { this.onBtnClick(e); }.bind(this))
      .on('view:' + this.view.id + ':autoRefreshBtn click', function(e) { this.onBtnClick(e); }.bind(this))
      .on('view:' + this.view.id + ':includePaintBtn click', function(e) { this.onBtnClick(e); }.bind(this))
      .on('view:' + this.view.id + ':useBudsAsCurrencyBtn click', function(e) { this.onBtnClick(e); }.bind(this));

    this.settingsRepository.get('*', function(err, settings) {
      if(err) { champ.events.trigger('error', err); }

      this.model.property({
        showPrices: settings.showPrices,
        enableNeto: settings.enableNeto,
        autoRefresh: settings.autoRefresh,
        includePaint: settings.includePaint,
        lastUpdate: settings.lastUpdate,
        updateInterval: settings.updateInterval,
        useBudsAsCurrency: settings.useBudsAsCurrency
      });
    }.bind(this));
  },

  updateUi: function(args) {
    this.view.$.showPricesBtn.children('span').toggleClass('badge-primary', this.model.property('showPrices'));
    this.view.$.enableNetoBtn.children('span').toggleClass('badge-primary', this.model.property('enableNeto'));
    this.view.$.autoRefreshBtn.children('span').toggleClass('badge-primary', this.model.property('autoRefresh'));
    this.view.$.includePaintBtn.children('span').toggleClass('badge-primary', this.model.property('includePaint'));
    this.view.$.useBudsAsCurrencyBtn.children('span').toggleClass('badge-primary', this.model.property('useBudsAsCurrency'));
  },

  //this whole method is gross
  onBtnClick: function(e) {
    e.preventDefault();
    var $span = e.target.tagName === 'A'
      ? $(e.target).children('span')
      : $(e.target),

      prop = this.view.container.find($span.parent('a')).data('model-name'),
      val = !$span.hasClass('badge-primary');

    this.model.property(prop, val);

    this.settingsRepository.update(this.model.properties, function(err) {
      if(err) { return champ.events.trigger('error', err); }

      var notifySettingChange = Object.create(this.notifyCSCommand);
      notifySettingChange.action = 'setting:' + prop;
      notifySettingChange.message = val;

      this.commandBus.handle(notifySettingChange);

      notifySettingChange.type = 'NotifyBackgroundCommand';

      this.commandBus.handle(notifySettingChange);

    }.bind(this));
  },

  onViewShow: function(args) {
    if(args.view !== 'MainView') { return this.view.container.removeClass('show'); }
    this.view.container.addClass('show');
  }
});
