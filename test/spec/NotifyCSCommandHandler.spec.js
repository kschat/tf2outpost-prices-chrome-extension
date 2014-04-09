;(function($) {
  'use strict';

  module('NotifyCSCommandHandler', {
    setup: function() {
      champ.ioc.reset();
      champ.ioc.register('NotifyCSCommandHandler', NotifyCSCommandHandler);

      chrome.tabs = {
        query: sinon.stub().yields([{ id: '1' }]),

        sendMessage: sinon.stub().callsArg(2)
      };

      this.command = new NotifyCSCommand({ action: 'testAction', message: 'test message' });
      this.commandHandler = champ.ioc.resolve('NotifyCSCommandHandler');
    },

    teardown: function() { }
  });

  test('handle(command)', function() {
    this.commandHandler.handle(this.command);

    ok(
      chrome.tabs.sendMessage.calledWith('1', { action: 'testAction', message: 'test message' }),
      'It sends a message to the content script using the action and message from the command'
    );
  });
})(jQuery);