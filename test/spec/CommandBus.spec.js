;(function() {
	'use strict';

	module('CommandBus', {
		setup: function() {
			champ.ioc.reset();
			champ.ioc
				.register('ValidCommand', { type: 'ValidCommand', prop: 'command prop' })
				.register('ValidCommandHandler', { handle: sinon.spy() })
				.register('InvalidCommand', {})
				.register('InvalidCommandHandler', {});

			this.commandBus = CommandBus;
		},

		teardown: function() { }
	});

	test('handle()', function() {
		this.commandBus.handle(champ.ioc.resolve('ValidCommand'));

		ok(champ.ioc.resolve('ValidCommandHandler').handle.calledWith({ 
				type: 'ValidCommand', 
				prop: 'command prop' 
			}), 
			'The commandbus called the correct handler'
		);

		throws(
			function() {
				this.commandBus.handle(champ.ioc.resolve('InvalidCommand'));
			},
			'Throws an error when given a command doesnt have a type property'
		);

		throws(
			function() {
				this.commandbus.handle({ type: 'InvalidCommand' });
			},
			'Throws an error when a command handler doesnt have a handle method'
		);
	});
})();