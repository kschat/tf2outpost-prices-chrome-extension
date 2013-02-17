define([
	'underscore',
	'backbone',
	'models/price/PriceModel'
], function(_, Backbone, PriceModel) {
	var PriceCollection = Backbone.Collection.extend({
		model: PriceModel
	});

	return PriceCollection;
});