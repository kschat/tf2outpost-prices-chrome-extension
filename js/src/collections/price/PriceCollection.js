// define(function(require) {
// 	var Backbone = require('backbone'),
// 		PriceModel = require('PriceModel');

// 	var PriceCollection = Backbone.Collection.extend({
// 		initialize: function() {
// 			//_.bindAll(this, 'parse');
// 		},
// 		model: PriceModel,
// 		currentTime: 0,
// 		url: 'http://backpack.tf/api/IGetPrices/v3/?key=514ce50eba2536c86e000006',
// 		sync: function(method, model, options) {

// 			return Backbone.sync(method, model, options);
// 		},
// 		parse: function(response) {
// 			var priceResponse = response.response.prices;

// 			if(this.getHoursPassed(response.response.current_time, this.currentTime) >= 1) {
// 				this.currentTime = response.response.current_time;
// 				var prices = [];

// 				for(var price in priceResponse) {
// 					var currPrice = priceResponse[price];
// 					currPrice.defindex = price;
// 					currPrice.quality = {};

// 					for(var quality in currPrice) {
// 						if(!isNaN(parseInt(quality, 10))) {
// 							var currQuality = currPrice[quality];
// 							currPrice.quality[quality] = currQuality;
// 							currPrice.quality[quality].priceIndex = {};
// 							delete currPrice[quality];

// 							for(var priceIndex in currQuality) {
// 								if(!isNaN(parseInt(priceIndex, 10))) {
// 									var currPriceIndex = currQuality[priceIndex];
// 									currPrice.quality[quality].priceIndex[priceIndex] = currPriceIndex;
// 									delete currPrice.quality[quality][priceIndex];
// 								}
// 							}
// 						}
// 					}

// 					prices.push(priceResponse[price]);
// 				}

// 				return prices;
// 			}

// 			return this.models;
// 		},
// 		getHoursPassed: function(time1, time2) {
// 			return (time1 - time2) / 60 / 60;
// 		},
// 		getUnixCurrentTime: function() {
// 			return Math.round((new Date()).getTime() / 1000);
// 		}
// 	});

// 	return PriceCollection;
// });