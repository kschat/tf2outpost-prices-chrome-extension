var NotifyBackgroundCommandHandler = function() { };

NotifyBackgroundCommandHandler.prototype = {
  handle: function(command) {
    console.log(command);
    chrome.runtime.sendMessage(
      { action: command.action, message: command.message },
      function(res) { }
    );
  }
};