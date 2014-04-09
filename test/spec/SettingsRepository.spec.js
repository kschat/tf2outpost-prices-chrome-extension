;(function() {
	'use strict';

	module('SettingsRepository', {
		setup: function() {
			this.settings = {
				setting1: 'value1',
				setting2: 2,
				setting3: false,
				setting4: { value: 4 }
			};

			champ.namespace.call(chrome, 'storage.sync', {
				get: sinon.stub().yields({ settings: this.settings }),
				set: sinon.stub().yields()
			});

			champ.namespace.call(chrome, 'runtime.lastError');
			chrome.runtime.lastError = null;
			
			this.repository = SettingsRepository;
		},

		teardown: function() {
			chrome.runtime.lastError = null;
		}
	});

	test('get()', function() {
		var callbackSpy = sinon.spy(),
			i;

		this.repository.get('*', callbackSpy);
		ok(
			callbackSpy.getCall(0).calledWith(null, this.settings),
			'The repository returned all the settings when given "*"'
		);

		for(var p in this.settings) {
			i = parseInt(p.substring(p.length - 1), 10);

			this.repository.get(p, callbackSpy);

			ok(
				callbackSpy.getCall(i).calledWith(null, this.settings[p]),
				'The repository returned the value of "setting' + i + '"" when given "setting' + i + '"'
			);
		}

		chrome.runtime.lastError = { message: 'Error' };
		this.repository.get('doesn\'t exist', callbackSpy);

		ok(
			callbackSpy.getCall(i + 1).calledWith(chrome.runtime.lastError, null),
			'The repository passes an error parameter to callback when "chrome.runtime.lastError" is set'
		);
	});

	test('update()', function() {
		var callbackSpy = sinon.spy(),
			setStub = chrome.storage.sync.set,
			settingsClone = champ.extend({}, this.settings),
			i;

		for(var p in this.settings) {
			var setValue = settingsClone;
			i = parseInt(p.substring(p.length - 1), 10);

			setValue[p] = 'new value' + i;
			this.repository.update('setting' + i, 'new value' + i, callbackSpy);

			ok(
				setStub.getCall(i - 1).calledWith({ settings: setValue }),
				'The repository set the correct value'
			);
			
			ok(
				callbackSpy.getCall(i - 1).calledWith(null, setValue),
				'The repository called the callback and passed the updated value'
			);
		}

		this.repository.update(this.settings, callbackSpy);

		ok(
			setStub.getCall(i).calledWith({ settings: this.settings }),
			'The repository used the object to set the settings'
		);
		
		ok(
			callbackSpy.getCall(i).calledWith(null, this.settings),
			'The repository called the callback and passed the updated value'
		);

		chrome.runtime.lastError = { message: 'Error' };
		this.repository.update('doesn\'t exist', '', callbackSpy);

		ok(
			callbackSpy.getCall(i + 1).calledWith(chrome.runtime.lastError, null),
			'The repository passes an error parameter to callback when "chrome.runtime.lastError" is set'
		);
	});
})();