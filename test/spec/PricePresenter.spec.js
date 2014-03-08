(function($) {
	'use strict';

	module('PricePresenter', {
		setup: function() {
			this.presenter = new PricePresenter({ container: $('#basic-item-test') });
			this.cratePresenter = new PricePresenter({ container: $('#crate-test') });
		},

		teardown: function() {
			$('#basic-item-test').find('.price').remove();
			$('#crate-test').find('.price').remove();
			champ.events.off();
		}
	});

	var setItemPrices = function() {
		var items = JSON.parse($('#mock-price-data').text());
		localStorage.setItem('tf2ItemList', JSON.stringify(items.response.prices));
	};

	test('init()', function() {
		notEqual(this.presenter.view, undefined, 'The presenter creates a new PriceView');
		strictEqual(this.presenter.view.$.label.text(), 'loading...', 'The presenter sets the views text to "loading..."');
		equal(this.presenter.model.property('hash'), '440,30077,6,36', 'The presenter builds and sets the hash on the model');
	});

	test('label()', function() {
		strictEqual(this.presenter.label(), 'loading...', 'The method returns the value of the views label property');
		
		this.presenter.label('new value');
		strictEqual(this.presenter.label(), 'new value', 'The method sets the value of the views label property');
	});

	test('onModelChanged()', function() {
		champ.events.trigger('model:' + this.presenter.model.id + ':changed', { property: 'price', value: 'new value' });
		strictEqual(this.presenter.label(), 'new value', 'The label on the view changed when the model changed');
	});

	test('extractUnusualQuality(imgUrl)', function() {
		equal(
			this.presenter.extractUnusualQuality(this.presenter.view.container.css('background-image')), 
			36, 
			'It extracts the unusual quality from the url'
		);

		equal(this.presenter.extractUnusualQuality(''), 0, 'It defaults to 0 if theres no unusual quality');
		equal(this.presenter.extractUnusualQuality(null), 0, 'It defaults to 0 if theres no unusual quality');
		equal(this.presenter.extractUnusualQuality(undefined), 0, 'It defaults to 0 if theres no unusual quality');
	});

	test('extractCrateSeries(node)', function() {
		equal(
			this.cratePresenter.extractCrateSeries(this.cratePresenter.view.container.find('.series_no')),
			45,
			'It extracts the crate series from the node'
		);

		strictEqual(this.cratePresenter.extractCrateSeries($('<div>')), 0, 'It defaults to 0 if theres no create series');
		strictEqual(this.cratePresenter.extractCrateSeries(null), 0, 'It defaults to 0 if theres no create series');
		strictEqual(this.cratePresenter.extractCrateSeries(undefined), 0, 'It defaults to 0 if theres no create series');
	});

	test('onPriceUpdate()', function() {
		var providerStub = sinon.stub(priceProvider, 'get').returns(7.00);
		champ.events.trigger('priceProvider:update', { status: 'success' });

		equal(this.presenter.model.property('price'), '7', '');
		equal(this.presenter.model.property('label'), '7.00 ref', '');

		providerStub.restore();
	});

	test('convertCurrency()', function() {
		setItemPrices();
		equal(this.presenter.convertCurrency(0.33), '0.33 ref', 'Converts scrap to ref');
		equal(this.presenter.convertCurrency(1), '1.00 ref', 'Properly labels ref');
		equal(this.presenter.convertCurrency(7), '7.00 ref', 'Shows 1 key as 7 ref');
		equal(this.presenter.convertCurrency(14), '2.00 keys', 'Converts ref to keys');
		equal(this.presenter.convertCurrency(137), '1.00 bud', 'Converts keys to buds');
		equal(this.presenter.convertCurrency(273), '2.00 buds', 'Makes bud plural when its more than 1');
	});
})(jQuery);