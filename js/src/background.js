Bootstrapper.bootstrap();

chrome.runtime.onInstalled.addListener(function(details) {
  var updateStorage = details.reason === 'install' || 
    (details.reason === 'update' && parseFloat(details.previousVersion) <= 1.2);

  if(updateStorage) {
    chrome.storage.sync.clear(function() {
      chrome.storage.sync.set({
        settings: {
          showPrices: true,
          enableNeto: true,
          autoRefresh: true,
          includePaint: true,
          lastUpdate: 0,
          updateInterval: 5,
          apiUrl: 'http://tf2prices.kyleschattler.com/prices'
        }
      });
    });
  }
});

chrome.runtime.onMessage.addListener(function(req, sender, res) {
  if(req.action === 'pageAction:show') {
    chrome.pageAction.show(sender.tab.id);

    return;
  }

  if(req.action === 'app:init') {
    SettingsRepository.get('*', function(err, settings) {
      if(settings.autoRefresh) {
        chrome.alarms.create('alarm:autoRefresh', {
          periodInMinutes: settings.updateInterval
        });
      }

      res(settings);
    });

    return true;
  }

  if(req.action === 'setting:autoRefresh') {
    if(req.message) {
      chrome.alarms.create('alarm:autoRefresh', {
        periodInMinutes: settings.updateInterval
      });
    }
    else {
      chrome.alarms.clear('alarm:autoRefresh');
    }
  }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if(alarm.name === 'alarm:autoRefresh') {
    CommandBus.handle(new UpdatePricesCommand());
  }
});

champ.events.on('prices:update:success', function(data) {
  CommandBus.handle(new NotifyCSCommand({
    action: 'price:update',
    message: data.items
  }));
});