define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var PriceModel = Backbone.Model.extend({
		initialize: function() {
			
		},

		defaults: {
			price: 	'loading...'
		}
	});

	return PriceModel;
});