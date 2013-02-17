define([
	'jquery',
	'underscore',
	'backbone',
	'models/price/PriceModel',
	'text!templates/price/priceTemplate.html'
], function($, _, Backbone, PriceModel, priceTemplate) {
	var PriceView = Backbone.View.extend({
		initialize: function() {
			this.model.bind('change:price', this.render, this);
			this.model.bind('remove', this.remove, this);
			this.render();
		},
		model: 		PriceModel,
		tagName: 	'div',
		className: 	'price',
		template: 	_.template(priceTemplate),
		render: 	function() {
			this.$el.find('.price').remove();
			this.$el.prepend(this.template(this.model.attributes));

			return this;
		},

		remove: 	function() {
			this.$el.find('.price').remove();
		}
	});

	return PriceView;
});