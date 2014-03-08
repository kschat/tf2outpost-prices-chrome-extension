(function(champ, $, MutationObserver, undefined) {
	'use strict';
	var pricePresenters = [];

	$(function() {
		$('.item').not('.blank').each(function(index) {
			pricePresenters.push(new PricePresenter({ container: $(this) }));
		});
		
		priceProvider.update();
		champ.events.trigger('app:init');

		chrome.runtime.sendMessage({ action: 'pageAction' });
	});
})(champ, jQuery.noConflict(), window.MutationObserver || window.WebKitMutationObserver);