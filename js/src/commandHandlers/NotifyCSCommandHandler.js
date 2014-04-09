var NotifyCSCommandHandler = function() { };

//Decorate the tree!
NotifyCSCommandHandler.prototype = {
  handle: function(command) {
    chrome.tabs.query({ url:'*://*.tf2outpost.com/*' }, function(tabs) {
      for(var i=0; i<tabs.length; i++) {
        chrome.tabs.sendMessage(
          tabs[i].id, 
          { action: 'background:' + command.action, message: command.message }, 
          function(res) { }
        );
      }
    });
  }
};