// define([
// 	'jquery',
// 	'underscore',
// 	'backbone',
// 	'views/price/PriceView'
// ], function($, _, Backbone, PriceView) {
// 	var PriceListView = Backbone.View.extend({
// 		initialize: 	function() {
// 			//Rerenders the list whenever the model has been reset (updated)
// 			this.model.bind('reset', this.render, this);
// 			this.model.bind('add', this.add, this);
// 		},

// 		render: 		function(e) {
// 			_.each(this.model.models, function(m) {
// 				this.render();
// 			}, this);

// 			return this;
// 		},

// 		add: 		function(m) {
// 			var priceView = new PriceView({model: m, el: m.get('parent')});
// 			priceView.render();
// 		}
// 	});

// 	return PriceListView;
// });