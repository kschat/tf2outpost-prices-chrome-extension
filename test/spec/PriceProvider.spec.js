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
			localStorage.removeItem('tf2LastUpdate');
		}
	});

	var setItemPrices = function() {
		var items = JSON.parse($('#mock-price-data').text());
		localStorage.setItem('tf2ItemList', JSON.stringify(items.response.prices));
	};

	test('update success', function() {
		localStorage.removeItem('tf2ItemList');

		var response = $('#mock-price-data').text();
		this.server.respondWith([
			200, 
			{ 'Content-Type': 'application/json' },
			response
		]);
		
		priceProvider.update();
		this.server.respond();

		deepEqual(
			JSON.parse(localStorage.getItem('tf2ItemList')), 
			JSON.parse(response).response.prices, 
			'priceProvider saved response to local storage'
		);
	});

	test('update', function() {
		this.server.respondWith([
			412, 
			{ 'Content-Type': 'application/json' },
			''
		]);
		
		priceProvider.update();
		this.server.respond();

		ok(this.eventTriggerSpy.calledOnce, 'priceProvider triggered an error event');
	});

	test('update too early', function() {
		localStorage.setItem('tf2LastUpdate', Date.now());

		var ajaxSpy = sinon.spy($, 'ajax');
		
		priceProvider.update();

		ok(!ajaxSpy.called);
		ajaxSpy.restore();
	});

	test('update after 5 minutes', function() {
		localStorage.setItem('tf2LastUpdate', Date.now() - (5 * 60 * 1000));

		var ajaxSpy = sinon.spy($, 'ajax');
		
		priceProvider.update();

		ok(ajaxSpy.called);
		ajaxSpy.restore();
	});

	test('get success', function() {
		strictEqual(priceProvider.get('440,10,11,0'), 14, 'priceProvider returned the correct value');
		strictEqual(priceProvider.get('440,10,11'), 14, 'priceProvider defaults the price index to 0');
		strictEqual(priceProvider.get('440,18,5,6'), 107.02, 'priceProvider returned the correct unusual value');
		strictEqual(priceProvider.get('440,90000,0'), 'offer', 'priceProvider returned "offer" when defindex is 90000');
		strictEqual(priceProvider.get('440,90001,0'), 'game', 'priceProvider returned "game" when defindex is 90001');
		strictEqual(priceProvider.get('440,90002,0'), '$ \u20AC \u00A3', 'priceProvider returned "$&euro;&8377;" when defindex is 90002');
		strictEqual(priceProvider.get('440,90003,0'), '1.33 ref', 'priceProvider returned "1.33 ref" when defindex is 90003');
		strictEqual(priceProvider.get('440,90004,0'), '0.11 ref', 'priceProvider returned "0.11 ref" when defindex is 90004');
		strictEqual(priceProvider.get('753,0,1'), 'gift', 'priceProvider returned "gift" when price index is 5');
		strictEqual(priceProvider.get('440,5022,6,1'), 2.5, 'priceProvider returned the price of the crate per series');
	});

	test('get fail', function() {
		strictEqual(priceProvider.get('0,0,0,0'), '???', 'priceProvider returned "???" when the value doesnt exist');
		strictEqual(priceProvider.get('440,10,0,0'), '???', 'priceProvider returned "???" when the value doesnt exist');
	});
})(jQuery);