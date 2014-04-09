var NotifyBackgroundCommand = function(options) {
  options = options || {};
  this.type = 'NotifyBackgroundCommand';
  this.action = options.action || '';
  this.message = options.message || '';
};