require.config({
	baseUrl: 		chrome.extension.getURL('js'),
	paths: {
		jquery: 	'libs/jquery/jquery-1.8.3.min',
		underscore: 'libs/underscore/underscore-amd-1.4.3.min',
		backbone: 	'libs/backbone/backbone-amd-0.9.10.min',
		text: 		'libs/require/text/text'
	}
});

requirejs([
	'router'
], function(Router) {
	Router.initialize();
});