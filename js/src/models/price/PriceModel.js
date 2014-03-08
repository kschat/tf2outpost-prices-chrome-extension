// define([
// 	'underscore',
// 	'backbone'
// ], function(_, Backbone) {
// 	var PriceModel = Backbone.Model.extend({
// 		initialize: function() {
			
// 		},
// 		idAttribute: 'defindex',
// 		defaults: {
// 			defindex: 0,
// 			price: 	'loading...'
// 		},
// 		getPrice: function(quality, priceIndex) {
// 			return this.attributes.quality[quality].priceIndex[priceIndex].current.value;
// 		},
// 		updatePrice: function(quality, priceIndex) {
// 			this.price = this.attributes.quality[quality].priceIndex[priceIndex].current.value;
// 		}
// 	});

// 	return PriceModel;
// });