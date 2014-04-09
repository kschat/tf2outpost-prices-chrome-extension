(function($) {
	'use strict';

	module('priceProvider', {
		setup: function() {
			this.server = sinon.fakeServer.create();
			this.eventTriggerSpy = sinon.spy(champ.events, 'trigger');
			setItemPrices();
		},

		teardown: function() {
			this.server.restore();
			this.eventTriggerSpy.restore();
			localStorage.removeItem('tf2ItemList');
		}
	});

	var setItemPrices = function() {
		var mockData = JSON.parse($('#mock-price-data').text());
		localStorage.setItem('tf2ItemList', JSON.stringify(mockData.items));
	};

	test('get success', function() {
    champ.events.trigger('app:init', {
      includePaint: false
    });

		strictEqual(
      priceProvider.get('440,30186,6,1,1'), 
      4, 
      'it returned the correct value'
    );

    strictEqual(
      priceProvider.get('440,30299,5,1,1,22'), 
      2.66, 
      'it found the price for the unusual'
    );

    strictEqual(
      priceProvider.get('440,30354'), 
      1.33, 
      'it defaults the quality to "6"'
    );

    strictEqual(
      priceProvider.get('440,30354,6'), 
      1.33, 
      'it defaults to "tradable" and "craftable"'
    );

    strictEqual(
      priceProvider.get('440,30354,6,1,1'), 
      1.33, 
      'it defaults the "pIndex" to "0"'
    );

    strictEqual(
      priceProvider.get('440,90000,0'), 
      'offer', 
      'it returned "offer" when defindex is 90000'
    );

    strictEqual(
      priceProvider.get('440,90001,0'), 
      'game', 
      'it returned "game" when defindex is 90001'
    );

    strictEqual(
      priceProvider.get('440,90002,0'), 
      '$ \u20AC \u00A3', 
      'it returned "$ \u20AC \u00A3" when defindex is 90002'
    );

    strictEqual(
      priceProvider.get('440,90003,0'), 
      '1.33 ref', 
      'it returned "1.33 ref" when defindex is 90003'
    );

    strictEqual(
      priceProvider.get('440,90004,0'), 
      '0.11 ref', 
      'it returned "0.11 ref" when defindex is 90004'
    );

    strictEqual(
      priceProvider.get('753,0,1'), 
      'gift', 
      'it returned "gift" when the game field is 753'
    );
	});

	test('get fail', function() {
    champ.events.trigger('app:init', {});

		strictEqual(
      priceProvider.get('0,0,0,0'),
      '???',
      'it returned "???" when the value doesnt exist'
    );
		
    strictEqual(
      priceProvider.get('440,10,0,0'),
      '???',
      'it returned "???" when the value doesnt exist'
    );
	});

  test('get with paint prices', function() {
    champ.events.trigger('app:init', {
      includePaint: true
    });

    strictEqual(
      priceProvider.get('440,30354,6,1,1', '729E42'),
      2.33,
      'it added the price of the paint to the total price'
    );

    strictEqual(
      priceProvider.get('440,30354,6,1,1', '729E40'),
      1.33,
      'it didnt add anything if it cant find the paint'
    );
  });
})(jQuery);