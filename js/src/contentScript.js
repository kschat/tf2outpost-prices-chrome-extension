(function(champ, $, MutationObserver, undefined) {
	'use strict';

	var pricePresenters = [];

  chrome.runtime.onMessage.addListener(function(req, sender, res) {
    console.log(req);
    champ.events.trigger(req.action, req.message);
  });

	$(function() {
		$('.item').not('.blank').each(function(index) {
			pricePresenters.push(new PricePresenter({ container: $(this) }));
		});
		
    chrome.runtime.sendMessage({ action: 'app:init' }, function(res) {
      champ.events.trigger('app:init', res);
    });
	});

})(champ, jQuery.noConflict(), window.MutationObserver || window.WebKitMutationObserver);