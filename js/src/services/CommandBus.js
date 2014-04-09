var CommandBus = {
	handle: function(command) {
		var type = command.type,
			handler;

		if(!type) { throw Error('Command must have a type property'); }
		handler = champ.ioc.resolve(type + 'Handler');
		handler.handle(command);
	}
};