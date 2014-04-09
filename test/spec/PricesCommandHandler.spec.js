;(function($) {
	'use strict';

	module('PricesCommandHandler', {
		setup: function() {
			this.clock = sinon.useFakeTimers(Date.now());
			this.server = sinon.fakeServer.create();
			this.eventSpy = sinon.spy(champ.events, 'trigger');

			champ.ioc.reset();
			champ.ioc
				.register('SettingsRepository', {
					get: sinon.stub().yields(null, {
						lastUpdate: Date.now(),
						updateInterval: 5
					}),

					update: sinon.stub().callsArg(2)
				})
				.register('UpdatePricesCommandHandler', UpdatePricesCommandHandler);

			this.command = new UpdatePricesCommand();
			this.commandHandler = champ.ioc.resolve('UpdatePricesCommandHandler');
		},

		teardown: function() {
			this.clock.restore();
			this.server.restore();
			this.eventSpy.restore();
		}
	});

	test('getElapsedTime(startTime)', function() {
		var startTime = Date.now();
		this.clock.tick(60000);

		equal(this.commandHandler.getElapsedTime(startTime), 1, 'It returns the correct elasped time in minutes');
	});

	test('handle(command)', function() {
		this.commandHandler.handle(this.command);

		ok(this.eventSpy.calledWith(this.command.noContentEvent), 'It triggered a no content event when an update is called before interval is up');

		this.clock.tick(5 * 60 * 1000);
		this.server.respondWith([
			200,
			{ 'Content-Type': 'application/json' },
			'[]'
		]);

		this.commandHandler.handle(this.command);
		this.server.respond();

		ok(this.eventSpy.calledWith(this.command.successEvent), 'It triggered a success event when an update is called after interval is up');

		this.clock.tick(5 * 60 * 1000);
		this.server.respondWith([
			412,
			{ 'Content-Type': 'application/json' },
			''
		]);

		this.commandHandler.handle(this.command);
		this.server.respond();

		ok(this.eventSpy.calledWith(this.command.errorEvent), 'It triggered an error event when an update is called after interval is up');
	});
})(jQuery);