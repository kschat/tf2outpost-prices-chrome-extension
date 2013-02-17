define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
	var PageLoaderModel = Backbone.Model.extend({
		defaults: 	{
			message: 		'Never ending tf2outpost is enabled - scroll to load the next page',
			pageNumber: 	1,
			currentPage: 	'/'
		}
	});

	return PageLoaderModel;
});