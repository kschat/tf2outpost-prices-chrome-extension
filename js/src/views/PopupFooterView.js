var PopupFooterView = champ.view.extend('PopupFooterView', {
	container: '.js-footer-content',

	$: {
		homeBtn: '.js-home-btn',
		aboutBtn: '.js-about-btn : click',
		reportBugBtn: '.js-report-bug-btn',
		advSettingsBtn: '.js-adv-settings-btn : click',
		versionText: '.js-version-text',
		backBtn: '.js-back-btn : click'
	},

	init: function(options) {
		for(var el in this.$) { this.$[el].tooltip({ container: 'body' }); }
	}
});