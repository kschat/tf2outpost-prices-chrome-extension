define([
	'jquery',
	'underscore',
	'backbone',
	'app'
], function($, _, Backbone, App) {
	var AppRouter = Backbone.Router.extend({
		initialize: 		function() {
		},
		routes: {
			'': 					'loadApp',
			'/': 					'loadApp',
			'/recent/2': 			'loadApp',
			'trade/:id': 			'loadApp',
			'backpack': 			'basicLoadApp',
			'backpack/:id': 		'basicLoadApp',
			'trades': 				'basicLoadApp',
			'offers': 				'basicLoadApp',
			'bookmarks': 			'basicLoadApp',
			'matches': 				'basicLoadApp',
			'user/:id': 			'basicLoadApp',
			'user/:id/:page': 		'basicLoadApp',
			'search/:id': 			'basicLoadApp'
		},
		loadApp: function() {
			App.initialize();

			if(App.getPageLoader()) {
				var pageLoader = App.getPageLoader();
				pageLoader.options.renderer = App.render;
				pageLoader.render();

				$(window).scroll(function() {
					pageLoader.detectBottomOfPage();
				});
			}

			$(document).ready(function() {
				App.render($('.item'));
			});
		},
		basicLoadApp: 	function(id) {
			App.initialize();

			$(document).ready(function() {
				App.render($('.item'));
			});
		}
	});

	var initialize = function() {
		var appRouter = new AppRouter();
		Backbone.history.start({pushState: true});
	};

	return {
		initialize: initialize
	}
});