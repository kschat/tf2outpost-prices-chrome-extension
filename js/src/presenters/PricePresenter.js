var PricePresenter = champ.presenter.extend('PricePresenter', {
	models: ['PriceModel'],

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
			this.view.container.data('hash') + ',' + pIndex
		);

		this.label(this.model.property('label'));
	},

	label: function(val) {
		if(!val) { return this.view.$.label.html(); }
		this.view.$.label.html(val);
	},

	extractUnusualQuality: function(imgUrl) {
		imgUrl = imgUrl || '';
		var quality = imgUrl.match(/([\d]+)\.png/i);
		return quality ? quality[1] : 0;
	},

	extractCrateSeries: function(node) {
		return (node && node.text() || '').substr(1) || 0;
	},

	convertCurrency: function(value) {
		if(isNaN(value) || !value.toFixed) { return value; }
		var keyValue = priceProvider.get('440,5021,6,0'),
			budsValue = priceProvider.get('440,143,6,0');

		if(value > keyValue && value <= budsValue) {
			value = (value / keyValue).toFixed(2);
			return value + ' key' + (value == 1.00 ? '' : 's');
		}
		
		if(value > budsValue) {
			value = (value / budsValue).toFixed(2);
			return value + ' bud' + (value == 1.00 ? '' : 's');
		}
		
		return value.toFixed(2) + ' ref';
	},

	onAppInit: function(args) {
		this.onPriceUpdate({ status: 'success' });
	},

	onModelChanged: function(args) {
		if(args.property !== 'price') { return; }
		this.model.property('label', this.convertCurrency(args.value));
		this.label(this.model.property('label'));
	},

	onPriceUpdate: function(args) {
		if(args.status !== 'success') { return; }
		this.label('loading...');
		this.model.property('price', priceProvider.get(this.model.properties.hash));
	}
});