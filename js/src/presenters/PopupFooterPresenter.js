var PopupFooterPresenter = champ.presenter.extend('PopupFooterPresenter', {
	inject: ['ManifestProvider'],

	views: ['PopupFooterView'],

	init: function(options) {
		this.manifestProvider = options.ManifestProvider;
		this.setVersionText(this.manifestProvider.get('version'));

		champ.events
			.on('view:' + this.view.id + ':aboutBtn click', function(e) { this.onAboutBtnClicked(e); }.bind(this))
			.on('view:' + this.view.id + ':backBtn click', function(e) { this.onBackBtnClicked(e); }.bind(this));
	},

	setVersionText: function(version) {
		this.view.$.versionText.text('Version ' + version);
	},

	onAboutBtnClicked: function(e) {
		e.preventDefault();
		champ.events.trigger('view:show', { view: 'AboutView' });
		this.view.$.aboutBtn.addClass('hidden');
		this.view.$.backBtn.removeClass('hidden');
	},

	onBackBtnClicked: function(e) {
		e.preventDefault();
		champ.events.trigger('view:show', { view: 'MainView' });
		this.view.$.backBtn.addClass('hidden');
		this.view.$.aboutBtn.removeClass('hidden');
	}
});