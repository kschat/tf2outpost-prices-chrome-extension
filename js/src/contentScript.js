(function(champ, $, MutationObserver, undefined) {
	'use strict';

	var pricePresenters = []

    , itemObserver = new MutationObserver(function(mutations) {
      var mutation
        , itemNodes = []
        , itemFilter = '.item[data-hash]';

      for(var m in mutations) {
        mutation = mutations[m];

        for(var i=0; i<mutation.addedNodes.length; i++) {
          $(mutation.addedNodes[i])
            .find('.item[data-hash]')
            .addBack('[data-hash]')
            .not('.blank')
            .each(function() {
              pricePresenters.push(new PricePresenter({ container: $(this) }));
            });
        }
      }

      champ.events.trigger('priceProvider:update', { status: 'success' });
    })

    , observerConfig = { childList: true }

    , observables;

  chrome.runtime.sendMessage({ action: 'pageAction:show' });

  chrome.runtime.onMessage.addListener(function(req, sender, res) {
    champ.events.trigger(req.action, req.message);
  });

	$(function() {
    observables = $('#replacable, .grid, #has, #wants');

		$('.item').not('.blank').each(function(index) {
			pricePresenters.push(new PricePresenter({ container: $(this) }));
		});
		
    chrome.runtime.sendMessage({ action: 'app:init' }, function(res) {
      champ.events.trigger('app:init', res);
    });

    observables.each(function() {
      itemObserver.observe(this, observerConfig);
    });
	});

}(champ, jQuery.noConflict(), window.MutationObserver || window.WebKitMutationObserver));